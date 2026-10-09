package com.ssj.geekfight.api.dto

import com.google.gson.annotations.SerializedName

/** Top-level API envelope: {"code":200,"msg":"success","data":{...}} */
data class ApiResponse<T>(
    val code: Int = 0,
    val msg: String = "",
    val data: T? = null,
)

// ── Regions & Stores ─────────────────────────────────────────────────────────

data class RegionListData(val list: List<RegionDto>? = null)

data class RegionDto(
    val id: Int = 0,
    val state: String = "",
    val city: String = "",
)

data class StoreListData(val list: List<StoreDto>? = null)

data class StoreDto(
    val id: Int = 0,
    val name: String = "",
    val address: String? = null,
    val regionalId: Int? = null,
)

// ── Coach ────────────────────────────────────────────────────────────────────

data class CoachDto(
    val id: Int = 0,
    val name: String = "",
    val avatar: String? = null,
    val title: String? = null,
)

// ── Group Classes ─────────────────────────────────────────────────────────────

data class ClassListData(val list: List<GroupClassDto>? = null)

data class GroupClassDto(
    val id: Int = 0,
    val startTime: Long = 0,
    val endTime: Long? = null,
    val duration: Int = 60,
    val courseName: String = "",
    val customerType: Int = 1,
    val bookingNum: Int = 0,
    val capacity: Int = 0,
    /** 0 = not booked, 1 = booked */
    val myBooking: Int = 0,
    val coach: CoachDto? = null,
    val sndCoach: CoachDto? = null,
    val thdCoach: CoachDto? = null,
    val storeName: String? = null,
)

// ── Group Booking ─────────────────────────────────────────────────────────────

data class BookGroupData(val list: List<MemberCardDto>? = null)

data class MemberCardDto(
    val id: Int = 0,
    val name: String = "",
    val balance: Int? = null,
)

// ── PT ────────────────────────────────────────────────────────────────────────

data class PtStoreListData(val list: List<StoreDto>? = null)

data class PtCoachListData(val list: List<CoachDto>? = null)

/**
 * Response for GET /class/pt/course.
 * Each entry is a date with its available courses.
 */
data class PtCourseData(val list: List<PtDateEntryDto>? = null)

data class PtDateEntryDto(
    val date: Long = 0,
    val dateStr: String? = null,
    val available: Boolean? = null,
    val courseList: List<PtCourseDto>? = null,
)

data class PtCourseDto(
    val id: Int = 0,
    val name: String = "",
    val duration: Int? = null,
)

/** Response for GET /class/pt/bookinglist */
data class PtBookingListData(val list: List<PtSlotDto>? = null)

data class PtSlotDto(
    val timeStr: String = "",
    val available: Boolean = false,
    val coachList: List<CoachDto>? = null,
)

/** Response for POST /class/pt/booking */
data class PtBookData(val list: List<MemberCardDto>? = null)

// ── Booking Records ───────────────────────────────────────────────────────────

data class GroupBookingRecordsData(val list: List<GroupBookingRecordDto>? = null)

data class GroupBookingRecordDto(
    val storeName: String? = null,
    val cardName: String? = null,
    val status: Int = 0,
    @SerializedName("class") val classInfo: GroupClassInRecordDto? = null,
)

data class GroupClassInRecordDto(
    val id: Int = 0,
    val startTime: Long = 0,
    val duration: Int = 60,
    val courseName: String = "",
    val customerType: Int = 1,
    val coach: CoachDto? = null,
    val capacity: Int = 0,
    val bookingNum: Int = 0,
)

data class PtBookingRecordsData(val list: List<PtBookingRecordDto>? = null)

data class PtBookingRecordDto(
    val id: Int = 0,
    val startTime: Long = 0,
    val duration: Int = 60,
    val courseName: String = "",
    val customerType: Int = 1,
    val storeName: String? = null,
    val coach: CoachDto? = null,
    val status: Int = 0,
    val cardName: String? = null,
)

// ── QR Code ───────────────────────────────────────────────────────────────────

data class QrCodeData(val qrCodeBase64: String? = null)
