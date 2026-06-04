package com.ssj.geekfight.api

import java.time.LocalDate
import java.time.LocalDateTime
import java.time.ZoneId

private fun localDt(
    year: Int, month: Int, day: Int, hour: Int, minute: Int = 0
): Long {
    return LocalDateTime.of(year, month, day, hour, minute)
        .atZone(ZoneId.systemDefault())
        .toEpochSecond()
}

private fun todayAt(hour: Int, minute: Int = 0): Long {
    val today = LocalDate.now()
    return localDt(today.year, today.monthValue, today.dayOfMonth, hour, minute)
}

private fun daysFromNow(days: Int, hour: Int = 10, minute: Int = 0): Long {
    val date = LocalDate.now().plusDays(days.toLong())
    return localDt(date.year, date.monthValue, date.dayOfMonth, hour, minute)
}

object MockData {

    val regions = listOf(
        Region(id = 1101, name = "北京"),
        Region(id = 3101, name = "上海"),
    )

    val stores = listOf(
        Store(id = 1101005, name = "极斗·朝阳大悦城店", address = "北京市朝阳区朝阳北路101号大悦城5层", regionalId = 1101),
        Store(id = 1101014, name = "极斗·望京SOHO店", address = "北京市朝阳区望京街道望京SOHO T3 B1", regionalId = 1101),
        Store(id = 1101021, name = "极斗·五棵松店", address = "北京市海淀区西四环北路158号五棵松华熙LIVE", regionalId = 1101),
        Store(id = 3101001, name = "极斗·徐汇万象城店", address = "上海市徐汇区漕溪北路8号万象城B2", regionalId = 3101),
    )

    val coaches = listOf(
        Coach(id = 163, name = "Alex", title = "MMA综合格斗教练", storeId = 1101005),
        Coach(id = 164, name = "Mike", title = "泰拳专项教练", storeId = 1101005),
        Coach(id = 165, name = "Sarah", title = "巴西柔术教练", storeId = 1101005),
        Coach(id = 170, name = "Kevin", title = "搏击体能教练", storeId = 1101014),
    )

    val ptCourses = listOf(
        PtCourse(id = 5, name = "MMA综合格斗私教", duration = 60),
        PtCourse(id = 6, name = "泰拳私教", duration = 60),
        PtCourse(id = 7, name = "巴西柔术私教", duration = 90),
    )

    val memberCards = listOf(
        MemberCard(id = 1001, name = "私教课时卡·10次", balance = 7),
        MemberCard(id = 1002, name = "团课月卡", balance = 999),
    )

    fun getGroupClasses(storeId: Int): List<GroupClass> {
        val store = stores.find { it.id == storeId }
        val storeName = store?.name ?: "未知门店"
        val coach = coaches.firstOrNull { it.storeId == storeId }
        return listOf(
            GroupClass(
                id = 20001, courseName = "MMA综合格斗", startTime = todayAt(10, 0),
                endTime = todayAt(11, 0), duration = 60, storeId = storeId,
                storeName = storeName, coach = coach, capacity = 15, bookingNum = 8, customerType = 1, myBooking = 0,
            ),
            GroupClass(
                id = 20002, courseName = "泰拳入门", startTime = todayAt(12, 0),
                endTime = todayAt(13, 0), duration = 60, storeId = storeId,
                storeName = storeName, coach = coach, capacity = 12, bookingNum = 12, customerType = 1, myBooking = 0,
            ),
            GroupClass(
                id = 20003, courseName = "搏击体能", startTime = todayAt(14, 30),
                endTime = todayAt(15, 30), duration = 60, storeId = storeId,
                storeName = storeName, coach = coach, capacity = 20, bookingNum = 5, customerType = 1, myBooking = 0,
            ),
            GroupClass(
                id = 20004, courseName = "巴西柔术基础", startTime = daysFromNow(1, 10),
                endTime = daysFromNow(1, 11, 30), duration = 90, storeId = storeId,
                storeName = storeName, coach = coaches.getOrNull(2), capacity = 10, bookingNum = 3, customerType = 1, myBooking = 0,
            ),
            GroupClass(
                id = 20005, courseName = "MMA综合格斗", startTime = daysFromNow(1, 19),
                endTime = daysFromNow(1, 20), duration = 60, storeId = storeId,
                storeName = storeName, coach = coach, capacity = 15, bookingNum = 10, customerType = 1, myBooking = 0,
            ),
            GroupClass(
                id = 20006, courseName = "搏击体能", startTime = daysFromNow(2, 9),
                endTime = daysFromNow(2, 10), duration = 60, storeId = storeId,
                storeName = storeName, coach = coach, capacity = 20, bookingNum = 0, customerType = 1, myBooking = 0,
            ),
        )
    }

    fun getPtSlots(courseId: Int, storeId: Int, date: Long, coachId: Int): List<PtSlot> {
        val hours = listOf(9, 10, 11, 14, 15, 16, 17, 19, 20)
        return hours.mapIndexed { index, hour ->
            val start = run {
                val d = java.time.Instant.ofEpochSecond(date)
                    .atZone(ZoneId.systemDefault()).toLocalDate()
                localDt(d.year, d.monthValue, d.dayOfMonth, hour, 0)
            }
            PtSlot(
                startTime = start,
                endTime = start + 3600,
                timeStr = "%02d:00".format(hour),
                available = index % 3 != 1
            )
        }
    }

    fun getAvailableDates(coachId: Int): List<AvailableDate> {
        return (1..7).map { offset ->
            val date = LocalDate.now().plusDays(offset.toLong())
            val ts = localDt(date.year, date.monthValue, date.dayOfMonth, 0, 0)
            AvailableDate(
                date = ts,
                displayDate = "%d月%d日".format(date.monthValue, date.dayOfMonth),
            )
        }
    }

    fun getInitialBookingRecords(): List<BookingRecord> {
        val coach = coaches[0]
        return listOf(
            BookingRecord(
                id = 30001, startTime = daysFromNow(1, 10), duration = 60,
                courseName = "MMA综合格斗", customerType = 1,
                storeName = "极斗·朝阳大悦城店", type = BookingRecordType.GROUP.value,
                status = BookingStatus.ACTIVE.value, coach = coach, cardName = "团课月卡",
                capacity = 15, bookingNum = 8
            ),
            BookingRecord(
                id = 30002, startTime = daysFromNow(2, 14), duration = 60,
                courseName = "MMA综合格斗私教", customerType = 1,
                storeName = "极斗·朝阳大悦城店", type = BookingRecordType.PT.value,
                status = BookingStatus.ACTIVE.value, coach = coach, cardName = "私教课时卡·10次"
            ),
            BookingRecord(
                id = 30003, startTime = daysFromNow(-3, 10), duration = 60,
                courseName = "泰拳入门", customerType = 1,
                storeName = "极斗·朝阳大悦城店", type = BookingRecordType.GROUP.value,
                status = BookingStatus.CHECKED_IN.value, coach = coaches[1], cardName = "团课月卡",
                capacity = 12, bookingNum = 12
            ),
            BookingRecord(
                id = 30004, startTime = daysFromNow(-7, 14), duration = 90,
                courseName = "巴西柔术私教", customerType = 1,
                storeName = "极斗·朝阳大悦城店", type = BookingRecordType.PT.value,
                status = BookingStatus.CHECKED_IN.value, coach = coaches[2], cardName = "私教课时卡·10次"
            ),
        )
    }
}
