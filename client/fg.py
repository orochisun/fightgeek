#!/usr/bin/env python3
"""FIGHT GEEK 约课 API CLI（标准库，python3 main.py）。"""

from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from api.booking import BookingAPI
from api.client import FightGeekClient
from api.enums import IdType
from api.help_text import EPILOG
from api.utils import format_timestamps_for_display, parse_unix_or_datetime

TOKEN_FILE = Path(__file__).resolve().parent / ".fgm_token"
PUBLIC_CMDS = frozenset({"regions", "store-list", "class-list", "ts", "help-examples"})
DEFAULT_STORE_ID = 1101005
DEFAULT_COACH_ID = 163
DEFAULT_COURSE_ID = 5


def _print(data: object) -> None:
    json.dump(format_timestamps_for_display(data), sys.stdout, ensure_ascii=False, indent=2)
    sys.stdout.write("\n")


def _resolve_token(cli_token: str | None) -> str | None:
    if cli_token:
        return cli_token.strip()
    env = os.environ.get("FGM_TOKEN", "").strip()
    if env:
        return env
    if TOKEN_FILE.is_file():
        return TOKEN_FILE.read_text(encoding="utf-8").strip()
    return None


def _hint_empty_class_list(store_id: int) -> None:
    print(
        f"\n提示: store-id={store_id} 无团课数据，请先:\n"
        "  python3 main.py regions\n"
        "  python3 main.py store-list --regional-id 1101\n"
        "  python3 main.py class-list --store-id 1101014\n",
        file=sys.stderr,
    )


def _build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="main.py",
        description="FIGHT GEEK（极斗）小程序约课 API 命令行工具",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=EPILOG,
    )
    parser.add_argument(
        "--token",
        default=None,
        help="fgm_token；也可用 FGM_TOKEN 环境变量或 .fgm_token 文件",
    )
    parser.add_argument("--token-expire", type=int, default=None, help="fgm_token_expire（Unix 秒）")

    sub = parser.add_subparsers(dest="cmd", metavar="命令", required=True, title="子命令")

    # 门店
    sub.add_parser("regions", help="[公开] 城市列表 → regionalId")
    p = sub.add_parser("store-list", help="[公开] 门店列表 → storeId")
    p.add_argument("--regional-id", type=int, required=True, metavar="ID", help="城市 ID，如 1101=北京")

    # 团课
    p = sub.add_parser("class-list", help="[公开] 团课列表")
    p.add_argument(
        "--store-id",
        type=int,
        default=DEFAULT_STORE_ID,
        metavar="ID",
        help=f"门店 ID（默认 {DEFAULT_STORE_ID}）",
    )
    p.add_argument("--raw", action="store_true", help="原始响应，不过滤已过期班次")

    p = sub.add_parser("book-group", help="[登录] 团课预约")
    p.add_argument("--class-id", type=int, required=True, help="班次 ID")
    p.add_argument("--card-id", type=int, default=None, help="会员卡 ID（选卡后二次提交）")

    p = sub.add_parser("cancel-group", help="[登录] 团课取消（idType=2）")
    p.add_argument("--id", type=int, required=True, help="班次 ID")

    # 私教 PT
    sub.add_parser("pt-stores", help="[登录] 支持私教的门店列表")

    p = sub.add_parser("pt-coaches", help="[登录] 门店私教教练列表")
    p.add_argument(
        "--store-id",
        type=int,
        default=DEFAULT_STORE_ID,
        metavar="ID",
        help=f"门店 ID（默认 {DEFAULT_STORE_ID}）",
    )

    p = sub.add_parser("pt-course", help="[登录] 私教可约日期与课种 courseList")
    p.add_argument(
        "--store-id",
        type=int,
        default=DEFAULT_STORE_ID,
        help=f"门店 ID（默认 {DEFAULT_STORE_ID}）",
    )
    p.add_argument(
        "--coach-id",
        type=int,
        default=DEFAULT_COACH_ID,
        help=f"教练 ID（默认 {DEFAULT_COACH_ID}）",
    )

    p = sub.add_parser("pt-slots", help="[登录] 某日某课种可约时段 bookinglist")
    p.add_argument(
        "--store-id",
        type=int,
        default=DEFAULT_STORE_ID,
        help=f"门店 ID（默认 {DEFAULT_STORE_ID}）",
    )
    p.add_argument(
        "--course-id",
        type=int,
        default=DEFAULT_COURSE_ID,
        help=f"课种 ID（默认 {DEFAULT_COURSE_ID}，来自 pt-course 的 courseList[].id）",
    )
    p.add_argument(
        "--date",
        required=True,
        help="日期：Unix 秒，或 YYYY-MM-DD（当天 0 点）",
    )
    p.add_argument(
        "--coach-id",
        type=int,
        default=DEFAULT_COACH_ID,
        help=f"教练 ID（默认 {DEFAULT_COACH_ID}）",
    )

    p = sub.add_parser("pt-book", help="[登录] 私教预约 POST /class/pt/booking")
    p.add_argument(
        "--store-id",
        type=int,
        default=DEFAULT_STORE_ID,
        help=f"门店 ID（默认 {DEFAULT_STORE_ID}）",
    )
    p.add_argument(
        "--course-id",
        type=int,
        default=DEFAULT_COURSE_ID,
        help=f"课种 ID（默认 {DEFAULT_COURSE_ID}）",
    )
    p.add_argument(
        "--coach-id",
        type=int,
        default=DEFAULT_COACH_ID,
        help=f"教练 ID（默认 {DEFAULT_COACH_ID}）",
    )
    p.add_argument(
        "--start-time",
        required=True,
        help="上课开始时间：Unix 秒，或 'YYYY-MM-DD HH:MM[:SS]'",
    )
    p.add_argument(
        "--card-id",
        type=int,
        default=None,
        help="会员卡 ID；不传则为预检（返回可用卡列表）",
    )

    # 约课记录 / 签到 / 取消
    p = sub.add_parser("booking-records", help="[登录] 约课记录（团课+私教合并）")
    p.add_argument("--year", type=int, required=True, help="年，如 2026")
    p.add_argument("--month", type=int, required=True, help="月 1-12")

    p = sub.add_parser("cancel-booking", help="[登录] 取消预约（记录页，团课/私教通用）")
    p.add_argument("--id", type=int, required=True, help="预约记录 ID")
    p.add_argument(
        "--id-type",
        type=int,
        choices=[1, 2],
        required=True,
        help="1=私教  2=团课",
    )

    p = sub.add_parser("qrcode", help="[登录] 签到二维码")
    p.add_argument("--id", type=int, required=True)
    p.add_argument("--id-type", type=int, choices=[1, 2], default=2, help="1=私教  2=团课")

    # 工具
    p = sub.add_parser("ts", help="[工具] 日期时间 → Unix 时间戳（本机时区）")
    p.add_argument("datetime", help='如 "2026-06-06" 或 "2026-06-06 14:30:00"')

    sub.add_parser("help-examples", help="打印常用命令示例")

    return parser


def _run(args: argparse.Namespace) -> int:
    if args.cmd == "help-examples":
        print(EPILOG)
        return 0

    if args.cmd == "ts":
        ts = parse_unix_or_datetime(args.datetime)
        print(ts)
        return 0

    token = _resolve_token(args.token)
    if args.cmd not in PUBLIC_CMDS and not token:
        print(
            "错误: 此命令需要登录 token。\n"
            "  --token YOUR_TOKEN\n"
            "  export FGM_TOKEN=...\n"
            f"  echo '...' > {TOKEN_FILE}\n"
            "  python3 get_token.py --paste \"...\"",
            file=sys.stderr,
        )
        return 1

    client = FightGeekClient(token, token_expire=args.token_expire)
    api = BookingAPI(client)

    if args.cmd == "regions":
        _print(api.get_regional_list())
    elif args.cmd == "store-list":
        _print(api.get_store_list(args.regional_id))
    elif args.cmd == "class-list":
        if args.raw:
            body = api.get_class_list(args.store_id)
            _print(body)
            if not (body.get("data") or {}).get("list"):
                _hint_empty_class_list(args.store_id)
        else:
            result = api.get_class_list_filtered_with_meta(args.store_id)
            _print(result)
            if result["rawCount"] == 0:
                _hint_empty_class_list(args.store_id)
    elif args.cmd == "book-group":
        _print(api.book_group_class(args.class_id, card_id=args.card_id))
    elif args.cmd == "cancel-group":
        _print(api.cancel_group_class(args.id))
    elif args.cmd == "pt-stores":
        _print(api.get_pt_stores())
    elif args.cmd == "pt-coaches":
        _print(api.get_pt_coaches(args.store_id))
    elif args.cmd == "pt-course":
        _print(api.get_pt_course(args.store_id, coach_id=args.coach_id))
    elif args.cmd == "pt-slots":
        date_unix = parse_unix_or_datetime(args.date)
        _print(
            api.get_pt_booking_list(
                course_id=args.course_id,
                store_id=args.store_id,
                date=date_unix,
                coach_id=args.coach_id,
            )
        )
    elif args.cmd == "pt-book":
        start_time = parse_unix_or_datetime(args.start_time)
        if args.card_id is None:
            _print(
                api.pt_booking_precheck(
                    course_id=args.course_id,
                    start_time=start_time,
                    coach_id=args.coach_id,
                    store_id=args.store_id,
                )
            )
        else:
            _print(
                api.pt_booking_confirm(
                    course_id=args.course_id,
                    start_time=start_time,
                    coach_id=args.coach_id,
                    store_id=args.store_id,
                    card_id=args.card_id,
                )
            )
    elif args.cmd == "booking-records":
        _print(api.get_combined_booking_records(year=args.year, month=args.month))
    elif args.cmd == "cancel-booking":
        _print(api.cancel_booking(args.id, args.id_type))
    elif args.cmd == "qrcode":
        _print(api.get_checkin_qrcode(args.id, IdType(args.id_type)))
    else:
        return 1

    return 0


def main(argv: list[str] | None = None) -> int:
    parser = _build_parser()
    args = parser.parse_args(argv)
    try:
        return _run(args)
    except ValueError as e:
        print(f"参数错误: {e}", file=sys.stderr)
        return 2
    except OSError as e:
        print(f"请求失败: {e}", file=sys.stderr)
        return 3


if __name__ == "__main__":
    raise SystemExit(main())
