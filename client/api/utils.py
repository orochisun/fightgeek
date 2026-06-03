"""与小程序前端一致的工具函数。"""

from __future__ import annotations

import re
import time
from datetime import datetime
from typing import Any

# 输出展示时转为可读时间的字段名（值为 Unix 秒）
_DATETIME_KEYS = frozenset(
    {"startTime", "endTime", "createTime", "updateTime", "expireTime", "token_expire"}
)
_DATE_KEYS = frozenset({"date"})
# coachList / coach 输出时省略的大字段
_COACH_OMIT_KEYS = frozenset({"avatar", "videoUrl", "images", "info"})


def is_unix_timestamp(value: Any) -> bool:
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        return False
    return 1_000_000_000 <= value < 4_000_000_000


def unix_to_display(key: str, value: int | float) -> str:
    dt = datetime.fromtimestamp(value)
    if key in _DATE_KEYS:
        return dt.strftime("%Y-%m-%d")
    return dt.strftime("%Y-%m-%d %H:%M:%S")


def _omit_coach_media(obj: Any) -> Any:
    """去掉教练对象里的 avatar / videoUrl / images / info。"""
    if not isinstance(obj, dict):
        return obj
    return {k: v for k, v in obj.items() if k not in _COACH_OMIT_KEYS}


def format_timestamps_for_display(data: Any) -> Any:
    """格式化 CLI 输出：时间戳 → 可读时间；精简 coach / coachList。"""
    if isinstance(data, dict):
        out: dict[str, Any] = {}
        for key, val in data.items():
            if is_unix_timestamp(val) and key in (_DATETIME_KEYS | _DATE_KEYS):
                out[key] = unix_to_display(key, val)
            elif key == "coachList" and isinstance(val, list):
                out[key] = [
                    format_timestamps_for_display(_omit_coach_media(item)) for item in val
                ]
            elif key == "coach":
                out[key] = format_timestamps_for_display(_omit_coach_media(val))
            else:
                out[key] = format_timestamps_for_display(val)
        return out
    if isinstance(data, list):
        return [format_timestamps_for_display(item) for item in data]
    return data


def build_query(path: str, params: dict[str, Any] | None = None) -> str:
    """对应 common.js 模块 6116 的 `c(url, params)`。"""
    if not params:
        return path
    parts: list[str] = []
    for key, value in params.items():
        if value is not None:
            parts.append(f"{key}={value}")
    return f"{path}?{'&'.join(parts)}"


def month_start_unix(year: int, month: int) -> int:
    """约课记录页：所选年月月初 Unix 秒（local time）。"""
    return int(datetime(year, month, 1).timestamp())


def parse_unix_or_datetime(value: str) -> int:
    """
    解析时间参数：纯数字视为 Unix 秒；否则按本地时间解析。

    支持格式:
      - 1780675200
      - 2026-06-06
      - 2026-06-06 14:30:00
      - 2026-06-06 14:30
    """
    value = value.strip()
    if value.isdigit():
        return int(value)
    for fmt in ("%Y-%m-%d %H:%M:%S", "%Y-%m-%d %H:%M", "%Y-%m-%d"):
        try:
            return int(datetime.strptime(value, fmt).timestamp())
        except ValueError:
            continue
    raise ValueError(f"无法解析时间: {value!r}")


def parse_pt_start_time(date_unix: int, time_str: str) -> int | None:
    """由日期 Unix 秒 + timeStr（如 14:30）拼出 startTime。对应 pt-coach/index.js 的 P()。"""
    match = re.match(r"(\d{1,2}):(\d{2})", time_str or "")
    if not date_unix or not match:
        return None
    hour, minute = int(match.group(1)), int(match.group(2))
    dt = datetime.fromtimestamp(date_unix)
    slot = dt.replace(hour=hour, minute=minute, second=0, microsecond=0)
    return int(slot.timestamp())


def filter_upcoming_classes(
    items: list[dict[str, Any]],
    *,
    now: int | None = None,
    grace_minutes: int = 10,
) -> list[dict[str, Any]]:
    """团课列表前端过滤：丢弃 startTime <= now - 10min，按 startTime 升序。"""
    now = now if now is not None else int(time.time())
    cutoff = now - grace_minutes * 60
    kept = [x for x in items if (x.get("startTime") or 0) > cutoff]
    return sorted(kept, key=lambda x: x.get("startTime") or 0)


def merge_booking_records(
    group_body: dict[str, Any],
    pt_body: dict[str, Any],
    *,
    exclude_cancelled: bool = True,
) -> dict[str, Any]:
    """对应 common.js 的 getCombinedBookingList (rE)。"""
    group_list = (group_body.get("data") or {}).get("list") or []
    pt_list = (pt_body.get("data") or {}).get("list") or []

    merged: list[dict[str, Any]] = []

    for row in group_list:
        cls = row.get("class") or {}
        merged.append(
            {
                "id": cls.get("id"),
                "startTime": cls.get("startTime"),
                "duration": cls.get("duration"),
                "courseName": cls.get("courseName"),
                "customerType": cls.get("customerType"),
                "storeName": row.get("storeName"),
                "type": 2,
                "status": row.get("status"),
                "coach": cls.get("coach"),
                "capacity": cls.get("capacity"),
                "bookingNum": cls.get("bookingNum"),
                "cardName": row.get("cardName"),
            }
        )

    for row in pt_list:
        merged.append(
            {
                "id": row.get("id"),
                "startTime": row.get("startTime"),
                "duration": row.get("duration"),
                "courseName": row.get("courseName"),
                "customerType": row.get("customerType"),
                "storeName": row.get("storeName"),
                "type": 1,
                "coach": row.get("coach"),
                "status": row.get("status"),
                "cardName": row.get("cardName"),
            }
        )

    merged.sort(key=lambda x: x.get("startTime") or 0, reverse=True)

    if exclude_cancelled:
        merged = [x for x in merged if x.get("status") != 2]

    return {"code": 200, "msg": "success", "data": {"list": merged}}
