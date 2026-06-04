package com.ssj.geekfight.api

enum class IdType(val value: Int) {
    PT(1),
    GROUP(2);

    companion object {
        fun from(v: Int) = entries.first { it.value == v }
    }
}

enum class BookingStatus(val value: Int) {
    ACTIVE(0),
    CANCELLED(2),
    CHECKED_IN(3);

    companion object {
        fun from(v: Int) = entries.firstOrNull { it.value == v } ?: ACTIVE
    }
}

enum class BookingRecordType(val value: Int) {
    PT(1),
    GROUP(2)
}

enum class CustomerType(val value: Int) {
    GENERAL(1),
    ADULT(2),
    CHILD(3)
}
