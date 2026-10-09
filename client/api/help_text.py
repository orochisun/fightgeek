"""CLI 中文说明。"""

EPILOG = """
常用流程
--------

【查 ID】
  python3 main.py regions
  python3 main.py store-list --regional-id 1101
  python3 main.py --token "$TOKEN" pt-coaches
  python3 main.py --token "$TOKEN" pt-coaches --all  （所有门店的教练）

【私教预约】（默认 store=1101005 coach=163 course=5）
  python3 main.py --token "$TOKEN" pt-course
  python3 main.py --token "$TOKEN" pt-slots --date 2026-06-06
  python3 main.py --token "$TOKEN" pt-book --start-time 1780750800
  python3 main.py --token "$TOKEN" pt-book --start-time 1780750800 --card-id 5085

【团课】
  python3 main.py class-list --store-id 1101014

【时间戳】
  python3 main.py ts "2026-06-06 00:00:00"
  python3 main.py ts "2026-06-06 14:30:00"

Token: python3 get_token.py --paste "..."  或  cat .fgm_token
文档: ../reverse/wx2e1deadc021eaeb9/docs/BOOKING_API.md
"""
