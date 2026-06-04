package com.ssj.geekfight.api

data class Region(
    val id: Int,
    val name: String,
)

data class Store(
    val id: Int,
    val name: String,
    val address: String,
    val regionalId: Int,
)

data class Coach(
    val id: Int,
    val name: String,
    val title: String,
    val storeId: Int,
)

data class GroupClass(
    val id: Int,
    val courseName: String,
    val startTime: Long,
    val endTime: Long,
    val duration: Int,
    val storeId: Int,
    val storeName: String,
    val coach: Coach?,
    val capacity: Int,
    val bookingNum: Int,
    val customerType: Int,
    /** 0 = not booked, 1 = booked (myBooking from API) */
    val myBooking: Int = 0,
)

data class PtCourse(
    val id: Int,
    val name: String,
    val duration: Int,
)

data class AvailableDate(
    val date: Long,
    val displayDate: String,
)

data class PtSlot(
    val startTime: Long,
    val endTime: Long,
    val timeStr: String,
    val available: Boolean,
)

data class MemberCard(
    val id: Int,
    val name: String,
    val balance: Int,
)

data class BookingRecord(
    val id: Int,
    val startTime: Long,
    val duration: Int,
    val courseName: String,
    val customerType: Int,
    val storeName: String,
    val type: Int,
    val status: Int,
    val coach: Coach?,
    val cardName: String?,
    val capacity: Int? = null,
    val bookingNum: Int? = null,
)
