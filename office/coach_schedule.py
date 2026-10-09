#!/usr/bin/env python3
"""查询 FightGeek Office 教练课表（只读，使用系统 curl）。"""

from __future__ import annotations

import argparse
import getpass
import json
import os
import shutil
import subprocess
import sys
from datetime import date, datetime, time, timedelta
from pathlib import Path
from urllib.parse import urlencode
from zoneinfo import ZoneInfo


BASE_URLS = {
    "production": "https://mini.arfighter.com/fg/management/v1",
    "test": "https://m2.bitzhedu.com/fg/management/v1",
}
TIMEZONE = ZoneInfo("Asia/Shanghai")
DEFAULT_TOKEN_FILE = Path(__file__).resolve().with_name(".office_token")


class OfficeApiError(Exception):
    pass


def positive_int(value: str) -> int:
    try:
        number = int(value)
    except ValueError as exc:
        raise argparse.ArgumentTypeError("必须是正整数") from exc
    if number <= 0:
        raise argparse.ArgumentTypeError("必须是正整数")
    return number


def get_token(token_file: Path | None) -> str:
    if token_file:
        token = token_file.read_text(encoding="utf-8").strip()
    else:
        token = os.environ.get("FG_OFFICE_TOKEN", "").strip()
        if not token:
            if DEFAULT_TOKEN_FILE.is_file():
                token = DEFAULT_TOKEN_FILE.read_text(encoding="utf-8").strip()
            elif sys.stdin.isatty():
                token = getpass.getpass("FightGeek Office token: ").strip()
            else:
                raise OfficeApiError(
                    "缺少 token：设置 FG_OFFICE_TOKEN、使用 --token-file，"
                    "或将 token 写入 office/.office_token"
                )
    if not token or any(char in token for char in '\r\n"\\'):
        raise OfficeApiError("token 为空或包含无效字符")
    return token


def get_json(base_url: str, path: str, token: str, **params: object) -> dict:
    query = urlencode(params)
    url = f"{base_url}{path}" + (f"?{query}" if query else "")
    # 配置经 stdin 传给 curl，token 不出现在命令行参数中。
    curl_config = f'header = "Authorization: {token}"\nheader = "Accept: application/json"\n'
    result = subprocess.run(
        [
            "curl", "-q", "--silent", "--show-error", "--connect-timeout", "10",
            "--max-time", "30", "--config", "-", "--write-out", "\n%{http_code}",
            url,
        ],
        input=curl_config.encode("utf-8"),
        capture_output=True,
        check=False,
    )
    if result.returncode:
        detail = result.stderr.decode("utf-8", errors="replace").strip()
        raise OfficeApiError(f"网络请求失败：{detail}")
    try:
        raw, status_text = result.stdout.rsplit(b"\n", 1)
        http_status = int(status_text)
    except ValueError as exc:
        response = result.stdout.decode("utf-8", errors="replace")
        raise OfficeApiError(f"无法读取 HTTP 状态码，完整响应：\n{response or '<空响应>'}") from exc
    response = raw.decode("utf-8-sig", errors="replace")
    try:
        body = json.loads(response)
    except json.JSONDecodeError as exc:
        raise OfficeApiError(
            f"服务器未返回有效的 JSON（HTTP {http_status}），完整响应：\n"
            f"{response or '<空响应>'}"
        ) from exc
    if not isinstance(body, dict):
        raise OfficeApiError("服务器响应格式不正确")
    if http_status >= 400 or body.get("code") != 200:
        raise OfficeApiError(
            f"HTTP {http_status}，业务码 {body.get('code')}：{body.get('msg', '未知错误')}"
        )
    return body


def coach_id_from_account(base_url: str, token: str) -> int:
    try:
        body = get_json(base_url, "/user/detail", token)
    except OfficeApiError as exc:
        raise OfficeApiError(
            f"Office 无法识别当前职员身份：{exc}。请换 Office token；"
            "若已知教练 ID，可显式使用 --coach-id"
        ) from exc
    data = body.get("data")
    if not isinstance(data, dict):
        raise OfficeApiError("/user/detail 未返回职员资料")
    try:
        coach_id = int(data["id"])
    except (KeyError, TypeError, ValueError) as exc:
        raise OfficeApiError("/user/detail 未返回有效的职员 ID") from exc
    if coach_id <= 0:
        raise OfficeApiError("/user/detail 返回的职员 ID 无效")
    role = data.get("mainRole")
    if role is not None and str(role) != "2":
        print(f"提示：当前主角色为 {role}，教练角色值为 2。", file=sys.stderr)
    return coach_id


def monday_of(day: date) -> date:
    return day - timedelta(days=day.weekday())


def format_class(item: dict) -> str:
    start = item.get("startTime")
    try:
        when = datetime.fromtimestamp(int(start), TIMEZONE).strftime("%m-%d %a %H:%M")
    except (TypeError, ValueError, OverflowError):
        when = f"时间戳 {start}"
    mode = str(item.get("mode"))
    kind = {"1": "私教", "2": "团课"}.get(mode, mode)
    fields = [when, kind, str(item.get("courseName") or "未标明课程"), str(item.get("storeName") or "未标明场馆")]
    if kind == "私教" and item.get("memberName"):
        fields.append(f"会员：{item['memberName']}")
    if item.get("bookingNum") is not None:
        fields.append(f"预约：{item['bookingNum']}")
    if item.get("signInNum") is not None:
        fields.append(f"签到：{item['signInNum']}")
    return " | ".join(fields)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--token-file", type=Path, help="从文件读取 Office token；默认依次读取 FG_OFFICE_TOKEN、office/.office_token 或交互输入")
    parser.add_argument("--coach-id", type=positive_int, help="已知教练 ID 时手动指定；默认从 /user/detail 获取")
    parser.add_argument("--week", type=date.fromisoformat, metavar="YYYY-MM-DD", help="从该日期所在周开始；默认本周")
    parser.add_argument("--weeks", type=positive_int, default=2, help="连续查询周数，1–8；默认 2")
    parser.add_argument("--env", choices=BASE_URLS, default="production", help="Office 环境；默认正式版")
    parser.add_argument("--pt-only", action="store_true", help="只展示私教课（mode=1）")
    parser.add_argument("--json", action="store_true", help="输出课表 JSON，包含接口返回的课程字段")
    args = parser.parse_args()
    if args.weeks > 8:
        parser.error("--weeks 最多为 8")
    if not shutil.which("curl"):
        parser.error("找不到系统 curl")

    try:
        token = get_token(args.token_file)
        base_url = BASE_URLS[args.env]
        coach_id = args.coach_id or coach_id_from_account(base_url, token)
        first_monday = monday_of(args.week or datetime.now(TIMEZONE).date())
        results = []
        for week_offset in range(args.weeks):
            monday = first_monday + timedelta(weeks=week_offset)
            date_unix = int(datetime.combine(monday, time.min, TIMEZONE).timestamp())
            body = get_json(base_url, "/coach/classtable", token, date=date_unix, coachId=coach_id)
            data = body.get("data")
            classes = data.get("list") if isinstance(data, dict) else None
            if not isinstance(classes, list):
                raise OfficeApiError("/coach/classtable 未返回 data.list 数组")
            if any(not isinstance(item, dict) for item in classes):
                raise OfficeApiError("/coach/classtable 的课程数据格式不正确")
            try:
                classes.sort(key=lambda item: int(item.get("startTime") or 0))
            except (TypeError, ValueError) as exc:
                raise OfficeApiError("/coach/classtable 返回了无效的上课时间") from exc
            if args.pt_only:
                classes = [item for item in classes if str(item.get("mode")) == "1"]
            results.append({"week_start": monday.isoformat(), "coach_id": coach_id, "classes": classes})
    except (OfficeApiError, OSError) as exc:
        print(f"错误：{exc}", file=sys.stderr)
        return 1

    if args.json:
        json.dump(results, sys.stdout, ensure_ascii=False, indent=2)
        print()
    else:
        for result in results:
            monday = date.fromisoformat(result["week_start"])
            sunday = monday + timedelta(days=6)
            classes = result["classes"]
            print(f"\n{monday} 至 {sunday}｜教练 ID {coach_id}｜{len(classes)} 节课")
            for item in classes:
                print(format_class(item))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
