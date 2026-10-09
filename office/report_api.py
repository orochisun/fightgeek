#!/usr/bin/env python3
"""查询 FightGeek Office 报表与统计接口。"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
from dataclasses import dataclass
from datetime import datetime, timedelta
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen
from zoneinfo import ZoneInfo


BASE_URLS = {
    "production": "https://mini.arfighter.com",
    "test": "https://m2.bitzhedu.com",
}
DEFAULT_TOKEN_FILE = Path(__file__).resolve().with_name(".office_token")
DEFAULT_STORE_ID = "1101013"  # 望京凯德店
TIMEZONE = ZoneInfo("Asia/Shanghai")
DEFAULT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3OTExODQ1ODMsImlhdCI6MTc5MDU3OTc4Mywiand0Um9sZVR5cGUiOjEsImp3dFVzZXJJZCI6MzM0N30.QGaSa56HTWj0eOPn9tCY9bDob9sDTZNfDWH3MMfzz3Q'


@dataclass(frozen=True)
class Endpoint:
    description: str
    service: str
    method: str
    path: str
    fields: tuple[str, ...]


# 参数顺序、HTTP 方法和路径均取自 Office 主包版本 136 的 net/*.js。
ENDPOINTS = {
    "sales-flow": Endpoint("销售流水", "order", "GET", "/flow", ("storeId", "staffId", "paymentType", "from", "to")),
    "sales-report-url": Endpoint("销售报表地址", "order", "GET", "/reporturl", ("storeId", "paymentType", "from", "to")),
    "coach-flow": Endpoint("教练消课列表", "management", "GET", "/coach/classflowlist", ("storeId", "from", "to", "courseType", "queryValue")),
    "coach-flow-detail": Endpoint("教练消课明细", "management", "GET", "/coach/classflowdetail", ("from", "to", "userId")),
    "conversion": Endpoint("会员转化概况", "management", "GET", "/member/conversion", ("queryType", "storeId", "staffId")),
    "conversion-report": Endpoint("会员转化报表", "management", "GET", "/member/conversion/report", ("storeId", "staffId", "mode", "from", "to")),
    "conversion-report-url": Endpoint("会员转化报表地址", "management", "GET", "/member/conversion/url", ("storeId", "staffId", "mode", "from", "to")),
    "meituan-sales": Endpoint("美团销售数据", "management", "GET", "/card/meituan", ("storeId", "startTime", "endTime")),
    "meituan-report-url": Endpoint("美团报表地址", "management", "GET", "/card/meituan/report", ("storeId", "startTime", "endTime")),
    "class-analysis": Endpoint("团课分析详情", "management", "GET", "/analysis/detail", ("queryType", "storeId", "startTime", "endTime")),
    "dashboard-detail": Endpoint("首页仪表盘详情", "management", "POST", "/dashboard/detail", ("storeId", "queryType", "from", "to")),
    "dashboard-rank": Endpoint("首页排行", "management", "GET", "/dashboard/rank", ("regionalId", "cloudBrandId", "from", "to", "queryType")),
    "dashboard-report": Endpoint("仪表盘报表地址", "management", "POST", "/dashboard/report", ("reportType", "queryParam")),
    "member-analysis": Endpoint("会员状态统计", "management", "GET", "/member/analysis", ("status", "storeId", "staffId", "queryType")),
    "store-performance": Endpoint("店面指标列表", "management", "GET", "/staff/performance", ("storeId", "type", "startTime")),
    "store-performance-status": Endpoint("店面指标状态", "management", "GET", "/staff/performance/status", ("storeId", "type", "startTime", "endTime")),
}


def option_name(field: str) -> str:
    return "--" + re.sub(r"(?<!^)(?=[A-Z])", "-", field).lower()


def positive_int(value: str) -> int:
    try:
        number = int(value)
    except ValueError as exc:
        raise argparse.ArgumentTypeError("必须是正整数") from exc
    if number <= 0:
        raise argparse.ArgumentTypeError("必须是正整数")
    return number


def field_default(command: str, field: str, now: datetime) -> str | None:
    current = str(int(now.timestamp()))
    month_start = str(int(now.replace(day=1, hour=0, minute=0, second=0, microsecond=0).timestamp()))
    if field in ("from", "to", "startTime", "endTime"):
        if command in ("dashboard-detail", "dashboard-rank"):
            return current  # 与首页“今日”选项一致，from/to 均为当前 Unix 秒值
        return month_start if field in ("from", "startTime") else current
    if field == "storeId":
        return f"[{DEFAULT_STORE_ID}]" if command == "dashboard-detail" else DEFAULT_STORE_ID
    if field in ("reportType", "queryParam", "userId"):
        return None  # 主包没有足够信息推断
    return {
        "regionalId": "0",
        "cloudBrandId": "-1",
        "staffId": "0",
        "paymentType": "0",
        "courseType": "0",
        "queryValue": "",
        "queryType": "1",
        "mode": "1",
        "status": "0",
        "type": "1",
    }.get(field)


def load_token(token_file: Path | None) -> str:
    if token_file is not None:
        token = token_file.read_text(encoding="utf-8").strip()
    else:
        token = os.environ.get("FG_OFFICE_TOKEN", "").strip()
        if not token and DEFAULT_TOKEN_FILE.is_file():
            token = DEFAULT_TOKEN_FILE.read_text(encoding="utf-8").strip()
        if not token:
            token = DEFAULT_TOKEN
    if not token:
        raise ValueError("缺少 token：设置 FG_OFFICE_TOKEN、使用 --token-file，或写入 office/.office_token")
    if any(char in token for char in "\r\n"):
        raise ValueError("token 包含换行符")
    return token


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--env", choices=BASE_URLS, default="production", help="Office 环境；默认 production")
    parser.add_argument("--token-file", type=Path, help="从文件读取 token；否则依次使用 FG_OFFICE_TOKEN、office/.office_token、脚本内置默认值")
    parser.add_argument("--timeout", type=int, default=30, help="请求超时秒数；默认 30")
    commands = parser.add_subparsers(dest="command", required=True, metavar="接口")
    now = datetime.now(TIMEZONE)
    for name, endpoint in ENDPOINTS.items():
        command = commands.add_parser(name, help=endpoint.description, description=f"{endpoint.description}：{endpoint.method} {endpoint.path}")
        for field in endpoint.fields:
            hint = "JSON 字面量" if endpoint.method == "POST" else "原样放入查询参数"
            default = field_default(name, field, now)
            note = f"；默认 {default!r}" if default is not None else "；必填"
            command.add_argument(option_name(field), dest=field, required=default is None, default=default, help=f"{field}（{hint}{note}）")
        if {"from", "to"}.issubset(endpoint.fields) or {"startTime", "endTime"}.issubset(endpoint.fields):
            command.add_argument("--days", type=positive_int, metavar="天数", help="查询最近 N 天；覆盖该命令的起止时间参数")
    return parser


def request_endpoint(endpoint: Endpoint, values: dict[str, str], token: str, env: str, timeout: int) -> tuple[int, str]:
    base_url = BASE_URLS[env] + "/fg/" + endpoint.service + "/v1"
    url = base_url + endpoint.path
    headers = {"Authorization": token, "Accept": "application/json"}
    data = None
    if endpoint.method == "GET":
        url += "?" + urlencode([(field, values[field]) for field in endpoint.fields])
    else:
        try:
            payload = {field: json.loads(values[field]) for field in endpoint.fields}
        except json.JSONDecodeError as exc:
            raise ValueError(f"POST 参数必须是 JSON 字面量：{exc}") from exc
        data = json.dumps(payload, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
        headers["Content-Type"] = "application/json"

    req = Request(url, data=data, headers=headers, method=endpoint.method)
    try:
        with urlopen(req, timeout=timeout) as response:
            return response.status, response.read().decode("utf-8-sig", errors="replace")
    except HTTPError as exc:
        return exc.code, exc.read().decode("utf-8-sig", errors="replace")


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()
    if args.timeout <= 0:
        parser.error("--timeout 必须是正整数")

    endpoint = ENDPOINTS[args.command]
    values = {field: getattr(args, field) for field in endpoint.fields}
    if getattr(args, "days", None) is not None:
        end = datetime.now(TIMEZONE)
        start = end - timedelta(days=args.days)
        first, last = ("from", "to") if "from" in endpoint.fields else ("startTime", "endTime")
        values[first] = str(int(start.timestamp()))
        values[last] = str(int(end.timestamp()))
    try:
        token = load_token(args.token_file)
        status, response = request_endpoint(endpoint, values, token, args.env, args.timeout)
    except (OSError, URLError, ValueError) as exc:
        print(f"请求失败：{exc}", file=sys.stderr)
        return 1

    try:
        body = json.loads(response)
    except json.JSONDecodeError:
        print(response or "<空响应>")
        print(f"服务器未返回有效的 JSON（HTTP {status}）；上方是完整响应正文。", file=sys.stderr)
        return 1

    print(json.dumps(body, ensure_ascii=False, indent=2))
    if status >= 400:
        print(f"HTTP {status}", file=sys.stderr)
        return 1
    if isinstance(body, dict) and body.get("code") not in (None, 200):
        print(f"业务码：{body['code']}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
