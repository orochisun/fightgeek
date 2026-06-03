"""约课相关接口（对应 BOOKING_API.md / common.js 模块 6584 等）。"""

from __future__ import annotations

from typing import Any

from .client import FightGeekClient
from .enums import IdType
from .utils import filter_upcoming_classes, merge_booking_records, month_start_unix


class BookingAPI:
    """还原 BOOKING_API.md 中的约课接口。"""

    def __init__(self, client: FightGeekClient) -> None:
        self._c = client

    # --- 门店 / 区域（查 storeId 用）---

    def get_regional_list(self) -> dict[str, Any]:
        """GET /member/v1/regional/list  城市/区域列表。"""
        return self._c.request("GET", "/member/v1/regional/list", skip_token=True)

    def get_store_list(self, regional_id: int) -> dict[str, Any]:
        """GET /member/v1/store/list?regionalId=  某城市下的门店。"""
        return self._c.request(
            "GET",
            "/member/v1/store/list",
            params={"regionalId": regional_id},
            skip_token=True,
        )

    # --- 团课 ---

    def get_class_list(self, store_id: int) -> dict[str, Any]:
        """GET /member/v1/class/list?storeId=  无需 Token。"""
        return self._c.request(
            "GET",
            "/member/v1/class/list",
            params={"storeId": store_id},
            skip_token=True,
        )

    def get_class_list_filtered(self, store_id: int) -> list[dict[str, Any]]:
        """团课列表 + 前端过滤/排序。"""
        body = self.get_class_list(store_id)
        items = (body.get("data") or {}).get("list") or []
        return filter_upcoming_classes(items)

    def get_class_list_filtered_with_meta(self, store_id: int) -> dict[str, Any]:
        """团课列表，附带原始条数与过滤后条数。"""
        body = self.get_class_list(store_id)
        raw = (body.get("data") or {}).get("list") or []
        filtered = filter_upcoming_classes(raw)
        return {
            "storeId": store_id,
            "apiCode": body.get("code"),
            "apiMsg": body.get("msg"),
            "rawCount": len(raw),
            "filteredCount": len(filtered),
            "list": filtered,
        }

    def book_group_class(
        self,
        class_id: int,
        *,
        card_id: int | None = None,
    ) -> dict[str, Any]:
        """POST /member/v1/class/booking  body: {classId, cardId?}"""
        payload: dict[str, Any] = {"classId": class_id}
        if card_id is not None:
            payload["cardId"] = card_id
        return self._c.request("POST", "/member/v1/class/booking", json=payload)

    def cancel_group_class(self, booking_id: int) -> dict[str, Any]:
        """PUT /member/v1/class/booking?id=&idType=2  团课 Tab 取消（idType 固定 2）。"""
        return self.cancel_booking(booking_id, IdType.GROUP)

    # --- 私教 ---

    def get_pt_stores(self) -> dict[str, Any]:
        """GET /member/v1/class/pt/store"""
        return self._c.request("GET", "/member/v1/class/pt/store")

    def get_pt_course(
        self,
        store_id: int,
        coach_id: int | None = None,
    ) -> dict[str, Any]:
        """
        GET /member/v1/class/pt/course?storeId=&coachId?

        coach_id 可选：私教「时间预约」Tab 只传 storeId；「教练预约」页传 coachId。
        """
        params: dict[str, Any] = {"storeId": store_id}
        if coach_id is not None:
            params["coachId"] = coach_id
        return self._c.request("GET", "/member/v1/class/pt/course", params=params)

    def get_pt_booking_list(
        self,
        *,
        course_id: int,
        store_id: int,
        date: int,
        coach_id: int | None = None,
    ) -> dict[str, Any]:
        """GET /member/v1/class/pt/bookinglist  date 为 availableDate.date（Unix 秒）。"""
        params: dict[str, Any] = {
            "courseId": course_id,
            "storeId": store_id,
            "date": date,
        }
        if coach_id is not None:
            params["coachId"] = coach_id
        return self._c.request("GET", "/member/v1/class/pt/bookinglist", params=params)

    def get_pt_coaches(self, store_id: int) -> dict[str, Any]:
        """GET /member/v1/class/pt/coach?storeId="""
        return self._c.request(
            "GET",
            "/member/v1/class/pt/coach",
            params={"storeId": store_id},
        )

    def pt_booking_precheck(
        self,
        *,
        course_id: int,
        start_time: int,
        coach_id: int,
        store_id: int,
    ) -> dict[str, Any]:
        """POST /member/v1/class/pt/booking  阶段 A：预检 / 拉可用会员卡。"""
        return self._pt_booking(
            course_id=course_id,
            start_time=start_time,
            coach_id=coach_id,
            store_id=store_id,
        )

    def pt_booking_confirm(
        self,
        *,
        course_id: int,
        start_time: int,
        coach_id: int,
        store_id: int,
        card_id: int,
    ) -> dict[str, Any]:
        """POST /member/v1/class/pt/booking  阶段 B：确认预约。"""
        return self._pt_booking(
            course_id=course_id,
            start_time=start_time,
            coach_id=coach_id,
            store_id=store_id,
            card_id=card_id,
        )

    def _pt_booking(
        self,
        *,
        course_id: int,
        start_time: int,
        coach_id: int,
        store_id: int,
        card_id: int | None = None,
    ) -> dict[str, Any]:
        payload: dict[str, Any] = {
            "courseId": course_id,
            "startTime": start_time,
            "coachId": coach_id,
            "storeId": store_id,
        }
        if card_id is not None:
            payload["cardId"] = card_id
        return self._c.request("POST", "/member/v1/class/pt/booking", json=payload)

    # --- 约课记录 / 签到 / 取消 ---

    def get_group_booking_records(
        self,
        *,
        year: int,
        month: int,
        page_size: int = 100,
    ) -> dict[str, Any]:
        """GET /member/v1/class/booking?date=&pageSize="""
        return self._c.request(
            "GET",
            "/member/v1/class/booking",
            params={
                "date": month_start_unix(year, month),
                "pageSize": page_size,
            },
        )

    def get_pt_booking_records(
        self,
        *,
        year: int,
        month: int,
        page_size: int = 100,
    ) -> dict[str, Any]:
        """GET /member/v1/class/ptbooking?date=&pageSize="""
        return self._c.request(
            "GET",
            "/member/v1/class/ptbooking",
            params={
                "date": month_start_unix(year, month),
                "pageSize": page_size,
            },
        )

    def get_combined_booking_records(
        self,
        *,
        year: int,
        month: int,
        page_size: int = 100,
        exclude_cancelled: bool = True,
    ) -> dict[str, Any]:
        """并行拉团课+私教记录并合并（对应 rE / getCombinedBookingList）。"""
        group = self.get_group_booking_records(year=year, month=month, page_size=page_size)
        pt = self.get_pt_booking_records(year=year, month=month, page_size=page_size)
        return merge_booking_records(group, pt, exclude_cancelled=exclude_cancelled)

    def cancel_booking(self, record_id: int, id_type: IdType | int) -> dict[str, Any]:
        """PUT /member/v1/class/booking?id=&idType=  记录页团课/私教通用。"""
        return self._c.request(
            "PUT",
            "/member/v1/class/booking",
            params={"id": record_id, "idType": int(id_type)},
        )

    def get_checkin_qrcode(self, record_id: int, id_type: IdType | int) -> dict[str, Any]:
        """GET /member/v1/class/qrcode?id=&idType="""
        return self._c.request(
            "GET",
            "/member/v1/class/qrcode",
            params={"id": record_id, "idType": int(id_type)},
        )

    def get_checkin_qrcode_base64(self, record_id: int, id_type: IdType | int) -> str | None:
        """返回 data.qrCodeBase64（记录页展示用）。"""
        body = self.get_checkin_qrcode(record_id, id_type)
        data = body.get("data") or {}
        return data.get("qrCodeBase64")
