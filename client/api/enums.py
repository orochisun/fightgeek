"""BOOKING_API.md 中的枚举。"""

from enum import IntEnum


class CustomerType(IntEnum):
    GENERAL = 1
    ADULT = 2
    CHILD = 3


class CourseCardStyle(IntEnum):
    STYLE_1 = 1
    STYLE_2 = 2
    STYLE_3 = 3


class BookingRecordType(IntEnum):
    PT = 1
    GROUP = 2


class IdType(IntEnum):
    PT = 1
    GROUP = 2


class BookingStatus(IntEnum):
    ACTIVE = 0
    CANCELLED = 2
    CHECKED_IN = 3
