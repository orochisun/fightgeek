#!/usr/bin/env python3
"""按团课 classId 查询 FightGeek Office 预约用户。"""

from __future__ import annotations

import argparse
import json
import shutil
import sys
from datetime import datetime
from pathlib import Path

try:
    from .coach_schedule import BASE_URLS, TIMEZONE, OfficeApiError, get_json, get_token, positive_int
except ImportError:
    from coach_schedule import BASE_URLS, TIMEZONE, OfficeApiError, get_json, get_token, positive_int


STATUS_NAMES = {"0": "未签到", "1": "未签到", "2": "已签到", "3": "未约代消", "4": "已取消", "5": "自动消课"}


def format_time(value: object) -> str:
    try:
        return datetime.fromtimestamp(int(value), TIMEZONE).strftime("%Y-%m-%d %H:%M:%S")
    except (TypeError, ValueError, OverflowError, OSError):
        return str(value or "—")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("class_id", type=positive_int, help="团课场次 ID，非 courseId")
    parser.add_argument("--token-file", type=Path, help="Token 文件；默认使用 FG_OFFICE_TOKEN 或 office/.office_token")
    parser.add_argument("--env", choices=BASE_URLS, default="production")
    parser.add_argument("--page-size", type=positive_int, default=100, help="请求条数，默认 100")
    parser.add_argument("--last-id", type=int, default=0, help="分页游标，默认 0")
    parser.add_argument("--all", action="store_true", help="同时展示已取消记录与 role=2 的记录")
    parser.add_argument("--json", action="store_true", help="输出完整原始 JSON，不应用名单过滤")
    args = parser.parse_args()
    if args.last_id < 0:
        parser.error("--last-id 不能为负数")
    if not shutil.which("curl"):
        parser.error("找不到系统 curl")

    try:
        body = get_json(
            BASE_URLS[args.env], "/class/booking", get_token(args.token_file),
            queryType=4, queryValue=args.class_id, status=0,
            lastId=args.last_id, pageSize=args.page_size, startTime=0, endTime=0,
        )
        data = body.get("data")
        rows = data.get("list") if isinstance(data, dict) else None
        if not isinstance(rows, list) or any(not isinstance(row, dict) for row in rows):
            raise OfficeApiError("/class/booking 未返回有效的 data.list 数组")
    except (OfficeApiError, OSError) as exc:
        print(f"错误：{exc}", file=sys.stderr)
        return 1

    if args.json:
        print(json.dumps(body, ensure_ascii=False, indent=2))
    else:
        visible = rows if args.all else [
            row for row in rows if str(row.get("role")) != "2" and str(row.get("status")) != "4"
        ]
        print(f"团课 ID {args.class_id}｜返回 {len(rows)} 条｜展示 {len(visible)} 条")
        for row in visible:
            status = row.get("status")
            status_name = STATUS_NAMES.get(str(status), str(status))
            print(
                f"{row.get('userName', '未标明姓名')} | 用户 ID {row.get('userId', '—')} | "
                f"{status_name} | 预约时间 {format_time(row.get('createTime'))} | "
                f"记录 ID {row.get('id', '—')}"
            )
        if not visible:
            print("本次返回中没有符合条件的预约用户。")
    if len(rows) >= args.page_size:
        print("提示：返回条数达到 pageSize，可能还有记录；可调大 --page-size 或使用 --last-id。", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
