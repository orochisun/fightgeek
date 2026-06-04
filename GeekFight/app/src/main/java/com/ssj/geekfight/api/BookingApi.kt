package com.ssj.geekfight.api

import com.ssj.geekfight.api.dto.BookGroupData
import com.ssj.geekfight.api.dto.ClassListData
import com.ssj.geekfight.api.dto.GroupBookingRecordsData
import com.ssj.geekfight.api.dto.MemberCardDto
import com.ssj.geekfight.api.dto.PtBookData
import com.ssj.geekfight.api.dto.PtBookingListData
import com.ssj.geekfight.api.dto.PtBookingRecordsData
import com.ssj.geekfight.api.dto.PtCoachListData
import com.ssj.geekfight.api.dto.PtCourseData
import com.ssj.geekfight.api.dto.PtStoreListData
import com.ssj.geekfight.api.dto.QrCodeData
import com.ssj.geekfight.api.dto.RegionListData
import com.ssj.geekfight.api.dto.StoreListData
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneId

class BookingApi(private val client: FightGeekClient) {

    // ── Regions & Stores ─────────────────────────────────────────────────────

    fun getRegionalList(): List<Region> {
        val resp = client.request<RegionListData>("GET", "/member/v1/regional/list", skipToken = true)
        return resp.data?.list?.map { Region(it.id, it.city.ifBlank { it.state }) } ?: emptyList()
    }

    fun getStoreList(regionalId: Int): List<Store> {
        val resp = client.request<StoreListData>(
            "GET", "/member/v1/store/list",
            params = mapOf("regionalId" to regionalId),
            skipToken = true,
        )
        return resp.data?.list?.map {
            Store(it.id, it.name, it.address ?: "", it.regionalId ?: regionalId)
        } ?: emptyList()
    }

    // ── Group Classes ────────────────────────────────────────────────────────

    fun getClassList(storeId: Int): List<GroupClass> {
        val resp = client.request<ClassListData>(
            "GET", "/member/v1/class/list",
            params = mapOf("storeId" to storeId),
            skipToken = true,
        )
        val now = System.currentTimeMillis() / 1000
        val cutoff = now - 10 * 60
        return (resp.data?.list ?: emptyList())
            .filter { it.startTime > cutoff }
            .sortedBy { it.startTime }
            .map { dto ->
                val coach = dto.coach?.let { c -> Coach(c.id, c.name, c.title ?: "", storeId) }
                GroupClass(
                    id = dto.id,
                    courseName = dto.courseName,
                    startTime = dto.startTime,
                    endTime = dto.endTime ?: (dto.startTime + dto.duration * 60),
                    duration = dto.duration,
                    storeId = storeId,
                    storeName = dto.storeName ?: "",
                    coach = coach,
                    capacity = dto.capacity,
                    bookingNum = dto.bookingNum,
                    customerType = dto.customerType,
                    myBooking = dto.myBooking,
                )
            }
    }

    /**
     * Stage A (cardId == null): returns the card list to pick from.
     * Stage B (cardId != null): confirms booking.
     */
    fun bookGroupClass(classId: Int, cardId: Int?): BookGroupResult {
        val payload = buildMap<String, Any> {
            put("classId", classId)
            if (cardId != null) put("cardId", cardId)
        }
        val resp = client.request<BookGroupData>("POST", "/member/v1/class/booking", body = payload)
        val cards = resp.data?.list?.map { it.toModel() } ?: emptyList()
        return if (cards.isNotEmpty()) {
            BookGroupResult.NeedCard(cards)
        } else {
            BookGroupResult.Success(bookingId = classId)
        }
    }

    fun cancelGroupClass(classId: Int): Boolean {
        client.request<Unit>(
            "PUT", "/member/v1/class/booking",
            params = mapOf("id" to classId, "idType" to 2),
        )
        return true
    }

    // ── PT ───────────────────────────────────────────────────────────────────

    fun getPtStores(): List<Store> {
        val resp = client.request<PtStoreListData>("GET", "/member/v1/class/pt/store")
        return resp.data?.list?.map { Store(it.id, it.name, it.address ?: "", it.regionalId ?: 0) }
            ?: emptyList()
    }

    fun getPtCoaches(storeId: Int): List<Coach> {
        val resp = client.request<PtCoachListData>(
            "GET", "/member/v1/class/pt/coach",
            params = mapOf("storeId" to storeId),
        )
        return resp.data?.list?.map { c ->
            Coach(c.id, c.name, c.title ?: "", storeId)
        } ?: emptyList()
    }

    fun getPtCourse(storeId: Int, coachId: Int): PtCourseInfo {
        val resp = client.request<PtCourseData>(
            "GET", "/member/v1/class/pt/course",
            params = mapOf("storeId" to storeId, "coachId" to coachId),
        )
        val entries = resp.data?.list ?: emptyList()
        val dates = entries.map { e ->
            val display = e.dateStr ?: run {
                val ld = Instant.ofEpochSecond(e.date).atZone(ZoneId.systemDefault()).toLocalDate()
                "${ld.monthValue}月${ld.dayOfMonth}日"
            }
            AvailableDate(date = e.date, displayDate = display)
        }
        // Courses are the same across dates; take from first available entry.
        val courses = entries.firstOrNull { !it.courseList.isNullOrEmpty() }
            ?.courseList
            ?.map { PtCourse(it.id, it.name, it.duration ?: 60) }
            ?: emptyList()
        return PtCourseInfo(availableDates = dates, courseList = courses)
    }

    fun getPtBookingList(courseId: Int, storeId: Int, date: Long, coachId: Int): List<PtSlot> {
        val resp = client.request<PtBookingListData>(
            "GET", "/member/v1/class/pt/bookinglist",
            params = mapOf(
                "courseId" to courseId,
                "storeId" to storeId,
                "date" to date,
                "coachId" to coachId,
            ),
        )
        return (resp.data?.list ?: emptyList()).map { dto ->
            val startTime = parseSlotStartTime(date, dto.timeStr)
            PtSlot(
                startTime = startTime,
                endTime = startTime + 3600,
                timeStr = dto.timeStr,
                available = dto.available,
            )
        }
    }

    fun ptBooking(courseId: Int, startTime: Long, coachId: Int, storeId: Int, cardId: Int?): PtBookResult {
        val payload = buildMap<String, Any> {
            put("courseId", courseId)
            put("startTime", startTime)
            put("coachId", coachId)
            put("storeId", storeId)
            if (cardId != null) put("cardId", cardId)
        }
        val resp = client.request<PtBookData>("POST", "/member/v1/class/pt/booking", body = payload)
        val cards = resp.data?.list?.map { it.toModel() } ?: emptyList()
        return if (cards.isNotEmpty()) {
            PtBookResult.NeedCard(cards)
        } else {
            PtBookResult.Success(bookingId = courseId)
        }
    }

    // ── Booking Records ──────────────────────────────────────────────────────

    fun getGroupBookingRecords(year: Int, month: Int): List<BookingRecord> {
        val date = monthStartUnix(year, month)
        val resp = client.request<GroupBookingRecordsData>(
            "GET", "/member/v1/class/booking",
            params = mapOf("date" to date, "pageSize" to 100),
        )
        return (resp.data?.list ?: emptyList()).mapNotNull { row ->
            val cls = row.classInfo ?: return@mapNotNull null
            val coach = cls.coach?.let { c -> Coach(c.id, c.name, c.title ?: "", 0) }
            BookingRecord(
                id = cls.id,
                startTime = cls.startTime,
                duration = cls.duration,
                courseName = cls.courseName,
                customerType = cls.customerType,
                storeName = row.storeName ?: "",
                type = BookingRecordType.GROUP.value,
                status = row.status,
                coach = coach,
                cardName = row.cardName,
                capacity = cls.capacity,
                bookingNum = cls.bookingNum,
            )
        }
    }

    fun getPtBookingRecords(year: Int, month: Int): List<BookingRecord> {
        val date = monthStartUnix(year, month)
        val resp = client.request<PtBookingRecordsData>(
            "GET", "/member/v1/class/ptbooking",
            params = mapOf("date" to date, "pageSize" to 100),
        )
        return (resp.data?.list ?: emptyList()).map { dto ->
            val coach = dto.coach?.let { c -> Coach(c.id, c.name, c.title ?: "", 0) }
            BookingRecord(
                id = dto.id,
                startTime = dto.startTime,
                duration = dto.duration,
                courseName = dto.courseName,
                customerType = dto.customerType,
                storeName = dto.storeName ?: "",
                type = BookingRecordType.PT.value,
                status = dto.status,
                coach = coach,
                cardName = dto.cardName,
            )
        }
    }

    fun getCombinedBookingRecords(year: Int, month: Int): List<BookingRecord> {
        val group = try { getGroupBookingRecords(year, month) } catch (_: Exception) { emptyList() }
        val pt = try { getPtBookingRecords(year, month) } catch (_: Exception) { emptyList() }
        return (group + pt)
            .filter { it.status != BookingStatus.CANCELLED.value }
            .sortedByDescending { it.startTime }
    }

    fun cancelBooking(recordId: Int, idType: IdType): Boolean {
        client.request<Unit>(
            "PUT", "/member/v1/class/booking",
            params = mapOf("id" to recordId, "idType" to idType.value),
        )
        return true
    }

    fun getCheckinQrcode(recordId: Int, idType: IdType): String {
        val resp = client.request<QrCodeData>(
            "GET", "/member/v1/class/qrcode",
            params = mapOf("id" to recordId, "idType" to idType.value),
        )
        return resp.data?.qrCodeBase64 ?: ""
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private fun monthStartUnix(year: Int, month: Int): Long {
        return LocalDate.of(year, month, 1)
            .atStartOfDay(ZoneId.systemDefault())
            .toEpochSecond()
    }

    private fun parseSlotStartTime(dateUnix: Long, timeStr: String): Long {
        val match = Regex("""(\d{1,2}):(\d{2})""").find(timeStr) ?: return dateUnix
        val hour = match.groupValues[1].toInt()
        val minute = match.groupValues[2].toInt()
        return Instant.ofEpochSecond(dateUnix)
            .atZone(ZoneId.systemDefault())
            .toLocalDate()
            .atTime(hour, minute)
            .atZone(ZoneId.systemDefault())
            .toEpochSecond()
    }
}

private fun MemberCardDto.toModel() = MemberCard(id, name, balance ?: 0)

// ── Result types ──────────────────────────────────────────────────────────────

sealed class BookGroupResult {
    data class NeedCard(val cards: List<MemberCard>) : BookGroupResult()
    data class Success(val bookingId: Int) : BookGroupResult()
}

sealed class PtBookResult {
    data class NeedCard(val cards: List<MemberCard>) : PtBookResult()
    data class Success(val bookingId: Int) : PtBookResult()
}

data class PtCourseInfo(
    val availableDates: List<AvailableDate>,
    val courseList: List<PtCourse>,
)
