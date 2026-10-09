package com.ssj.geekfight.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.ssj.geekfight.api.ApiException
import com.ssj.geekfight.api.AvailableDate
import com.ssj.geekfight.api.BookGroupResult
import com.ssj.geekfight.api.BookingApi
import com.ssj.geekfight.api.BookingRecord
import com.ssj.geekfight.api.BookingRecordType
import com.ssj.geekfight.api.BookingStatus
import com.ssj.geekfight.api.ClassListCache
import com.ssj.geekfight.api.Coach
import com.ssj.geekfight.api.CoachScheduleDay
import com.ssj.geekfight.api.FightGeekClient
import com.ssj.geekfight.api.PtStatsCache
import com.ssj.geekfight.api.GroupClass
import com.ssj.geekfight.api.IdType
import com.ssj.geekfight.api.MemberCard
import com.ssj.geekfight.api.PtBookResult
import com.ssj.geekfight.api.PtCourse
import com.ssj.geekfight.api.PtSlot
import com.ssj.geekfight.api.Region
import com.ssj.geekfight.api.Store
import com.ssj.geekfight.api.TokenManager
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneId
import java.time.format.DateTimeFormatter

data class UiMessage(val text: String, val id: Long = System.currentTimeMillis())

// ── Group Classes State ───────────────────────────────────────────────────────

data class ClassListState(
    val isLoading: Boolean = false,
    val regions: List<Region> = emptyList(),
    val stores: List<Store> = emptyList(),
    val selectedRegion: Region? = null,
    val selectedStore: Store? = null,
    val classes: List<GroupClass> = emptyList(),
    val pendingBookClass: GroupClass? = null,
    val availableCards: List<MemberCard> = emptyList(),
    val message: UiMessage? = null,
    val error: String? = null,
)

// ── PT State ─────────────────────────────────────────────────────────────────

data class PtState(
    val isLoading: Boolean = false,
    val coachQuery: String = "",
    val coachId: Int? = null,
    val coachName: String = "",
    val availableDates: List<AvailableDate> = emptyList(),
    val selectedDate: AvailableDate? = null,
    val slots: List<PtSlot> = emptyList(),
    val pendingBookSlot: PtSlot? = null,
    val availableCards: List<MemberCard> = emptyList(),
    val message: UiMessage? = null,
    val error: String? = null,
    val coachSchedule: List<CoachScheduleDay> = emptyList(),
    val isLoadingSchedule: Boolean = false,
)

// ── Records State ─────────────────────────────────────────────────────────────

data class RecordsState(
    val isLoading: Boolean = false,
    val year: Int = java.time.LocalDate.now().year,
    val month: Int = java.time.LocalDate.now().monthValue,
    val records: List<BookingRecord> = emptyList(),
    val qrCodeTarget: BookingRecord? = null,
    val qrCodeBase64: String? = null,
    val message: UiMessage? = null,
    val error: String? = null,
)

// ── PT Stats State ────────────────────────────────────────────────────────────

data class PtStatsDayResult(
    val date: String,
    val bookedCount: Int,
    val totalSlots: Int,
    val groupClassCount: Int = 0,
    val availableCount: Int = 0,
    val fromCache: Boolean,
)

data class CoachRankEntry(
    val coachId: Int,
    val coachName: String,
    val bookedCount: Int,
    val daysWithData: Int,
)

data class PtStatsState(
    val coachId: Int? = null,
    val coachName: String = "",
    val startDate: java.time.LocalDate = java.time.LocalDate.now().minusDays(6),
    val endDate: java.time.LocalDate = java.time.LocalDate.now(),
    val isLoading: Boolean = false,
    val results: List<PtStatsDayResult> = emptyList(),
    val error: String? = null,
    val isBulkFetching: Boolean = false,
    val bulkFetchProgress: String = "",
    val isLoadingRanking: Boolean = false,
    val rankingResults: List<CoachRankEntry> = emptyList(),
)

// ── Token State ───────────────────────────────────────────────────────────────

data class TokenState(
    val token: String = "",
    val isValid: Boolean = false,
    val saved: Boolean = false,
)

class AppViewModel(application: Application) : AndroidViewModel(application) {

    val tokenManager = TokenManager(application)

    private val client = FightGeekClient { tokenManager.getToken() }
    private val api = BookingApi(client, application)

    // ── Token ─────────────────────────────────────────────────────────────────

    private val _tokenState = MutableStateFlow(
        TokenState(
            token = tokenManager.getToken() ?: "",
            isValid = tokenManager.isTokenValid(),
            saved = tokenManager.getToken() != null,
        )
    )
    val tokenState: StateFlow<TokenState> = _tokenState.asStateFlow()

    fun saveToken(token: String) {
        tokenManager.saveToken(token)
        _tokenState.value = TokenState(token = token, isValid = token.isNotBlank(), saved = true)
    }

    fun clearToken() {
        tokenManager.clearToken()
        _tokenState.value = TokenState()
    }

    // ── Class List ───────────────────────────────────────────────────────────

    private val _classState = MutableStateFlow(ClassListState())
    val classState: StateFlow<ClassListState> = _classState.asStateFlow()

    fun initClassList() {
        viewModelScope.launch {
            _classState.update { it.copy(isLoading = true, error = null) }
            try {
                val (regions, stores, classes) = withContext(Dispatchers.IO) {
                    val regions = api.getRegionalList()
                    val defaultRegion = regions.firstOrNull()
                    val stores = defaultRegion?.let { api.getStoreList(it.id) } ?: emptyList()
                    val defaultStore = stores.firstOrNull()
                    val classes = defaultStore?.let { api.getClassList(it.id) } ?: emptyList()
                    Triple(regions to defaultRegion, stores to defaultStore, classes)
                }
                _classState.update {
                    it.copy(
                        isLoading = false,
                        regions = regions.first,
                        selectedRegion = regions.second,
                        stores = stores.first,
                        selectedStore = stores.second,
                        classes = classes,
                    )
                }
            } catch (e: Exception) {
                _classState.update { it.copy(isLoading = false, error = e.toUserMessage()) }
            }
        }
    }

    fun selectRegion(region: Region) {
        viewModelScope.launch {
            _classState.update { it.copy(isLoading = true, error = null, selectedRegion = region) }
            try {
                val (stores, store, classes) = withContext(Dispatchers.IO) {
                    val stores = api.getStoreList(region.id)
                    val store = stores.firstOrNull()
                    val classes = store?.let { api.getClassList(it.id) } ?: emptyList()
                    Triple(stores, store, classes)
                }
                _classState.update {
                    it.copy(isLoading = false, stores = stores, selectedStore = store, classes = classes)
                }
            } catch (e: Exception) {
                _classState.update { it.copy(isLoading = false, error = e.toUserMessage()) }
            }
        }
    }

    fun selectStore(store: Store, forceRefresh: Boolean = false) {
        viewModelScope.launch {
            _classState.update { it.copy(isLoading = true, error = null, selectedStore = store) }
            try {
                val classes = withContext(Dispatchers.IO) { api.getClassList(store.id, forceRefresh) }
                _classState.update { it.copy(isLoading = false, classes = classes) }
            } catch (e: Exception) {
                _classState.update { it.copy(isLoading = false, error = e.toUserMessage()) }
            }
        }
    }

    fun refreshClassList() {
        val store = _classState.value.selectedStore ?: return
        selectStore(store, forceRefresh = true)
    }

    fun requestBookGroupClass(groupClass: GroupClass) {
        viewModelScope.launch {
            try {
                val result = withContext(Dispatchers.IO) {
                    api.bookGroupClass(groupClass.id, cardId = null)
                }
                when (result) {
                    is BookGroupResult.NeedCard -> _classState.update {
                        it.copy(pendingBookClass = groupClass, availableCards = result.cards)
                    }
                    is BookGroupResult.Success -> _classState.update {
                        it.copy(
                            classes = it.classes.map { c ->
                                if (c.id == groupClass.id) c.copy(myBooking = 1, bookingNum = c.bookingNum + 1) else c
                            },
                            message = UiMessage("预约成功！"),
                        )
                    }
                }
            } catch (e: Exception) {
                _classState.update { it.copy(message = UiMessage(e.toUserMessage())) }
            }
        }
    }

    fun confirmBookGroupClass(card: MemberCard) {
        val cls = _classState.value.pendingBookClass ?: return
        viewModelScope.launch {
            _classState.update { it.copy(pendingBookClass = null, availableCards = emptyList()) }
            try {
                withContext(Dispatchers.IO) { api.bookGroupClass(cls.id, cardId = card.id) }
                _classState.update {
                    it.copy(
                        classes = it.classes.map { c ->
                            if (c.id == cls.id) c.copy(myBooking = 1, bookingNum = c.bookingNum + 1) else c
                        },
                        message = UiMessage("预约成功！使用「${card.name}」"),
                    )
                }
            } catch (e: Exception) {
                _classState.update { it.copy(message = UiMessage(e.toUserMessage())) }
            }
        }
    }

    fun dismissBookDialog() {
        _classState.update { it.copy(pendingBookClass = null, availableCards = emptyList()) }
    }

    fun cancelGroupClassFromList(classId: Int) {
        viewModelScope.launch {
            try {
                withContext(Dispatchers.IO) { api.cancelGroupClass(classId) }
                _classState.update {
                    it.copy(
                        classes = it.classes.map { c ->
                            if (c.id == classId) c.copy(myBooking = 0, bookingNum = (c.bookingNum - 1).coerceAtLeast(0)) else c
                        },
                        message = UiMessage("已取消预约"),
                    )
                }
            } catch (e: Exception) {
                _classState.update { it.copy(message = UiMessage(e.toUserMessage())) }
            }
        }
    }

    fun clearClassMessage() = _classState.update { it.copy(message = null) }

    // ── PT ───────────────────────────────────────────────────────────────────

    private val _ptState = MutableStateFlow(PtState())
    val ptState: StateFlow<PtState> = _ptState.asStateFlow()

    fun initPt() {
        if (_ptState.value.availableDates.isNotEmpty()) return
        val defaultCoach = com.ssj.geekfight.api.CoachEntry(163, "U")
        _ptState.update {
            it.copy(
                availableDates = buildAvailableDates(),
                coachId = defaultCoach.id,
                coachName = defaultCoach.name,
                coachQuery = "${defaultCoach.name} (${defaultCoach.id})",
            )
        }
    }

    fun setPtCoachQuery(value: String) {
        _ptState.update { it.copy(coachQuery = value) }
    }

    private val scheduleCache = mutableMapOf<Int, List<CoachScheduleDay>>()

    fun selectPtCoach(entry: com.ssj.geekfight.api.CoachEntry) {
        val cached = scheduleCache[entry.id]
        _ptState.update {
            it.copy(
                coachId = entry.id,
                coachName = entry.name,
                coachQuery = "${entry.name} (${entry.id})",
                slots = emptyList(),
                coachSchedule = cached ?: emptyList(),
                error = null,
            )
        }
        loadPtSlots()
    }

    fun loadCoachSchedule() {
        val coachId = _ptState.value.coachId ?: return
        loadCoachSchedule(coachId, forceRefresh = false)
    }

    fun refreshCoachSchedule() {
        val coachId = _ptState.value.coachId ?: return
        scheduleCache.remove(coachId)
        loadCoachSchedule(coachId, forceRefresh = true)
    }

    private fun loadCoachSchedule(coachId: Int, forceRefresh: Boolean = false, showLoading: Boolean = true) {
        val inMemory = scheduleCache[coachId]
        if (!forceRefresh && inMemory != null) {
            _ptState.update { it.copy(coachSchedule = inMemory) }
            return
        }
        viewModelScope.launch {
            if (showLoading) _ptState.update { it.copy(isLoadingSchedule = true) }
            try {
                val schedule = withContext(Dispatchers.IO) {
                    api.getCoachSchedule(coachId, forceRefresh = forceRefresh)
                }
                scheduleCache[coachId] = schedule
                _ptState.update { it.copy(isLoadingSchedule = false, coachSchedule = schedule) }
            } catch (_: Exception) {
                _ptState.update { it.copy(isLoadingSchedule = false) }
            }
        }
    }

    fun confirmPtCoachId() {
        val query = _ptState.value.coachQuery.trim()
        val id = query.toIntOrNull()
            ?: com.ssj.geekfight.api.COACH_DIRECTORY.entries.firstOrNull {
                it.value.equals(query, ignoreCase = true)
            }?.key
            ?: return
        val name = com.ssj.geekfight.api.coachNameById(id)
        _ptState.update {
            it.copy(
                coachId = id,
                coachName = name,
                coachQuery = "$name ($id)",
                slots = emptyList(),
                error = null,
            )
        }
        loadPtSlots()
    }

    fun selectPtDate(date: AvailableDate) {
        _ptState.update { it.copy(selectedDate = date, slots = emptyList()) }
        loadPtSlots()
    }

    private fun loadPtSlots() {
        val state = _ptState.value
        val coachId = state.coachId ?: return
        val date = state.selectedDate ?: return
        viewModelScope.launch {
            _ptState.update { it.copy(isLoading = true, error = null) }
            try {
                val slots = withContext(Dispatchers.IO) {
                    api.getPtBookingList(PT_DEFAULT_COURSE_ID, PT_DEFAULT_STORE_ID, date.date, coachId)
                }
                _ptState.update { it.copy(isLoading = false, slots = slots) }
            } catch (e: Exception) {
                _ptState.update { it.copy(isLoading = false, error = e.toUserMessage()) }
            }
        }
        // Auto-load schedule silently for denominator deduction (no loading indicator)
        if (scheduleCache[coachId] == null) {
            loadCoachSchedule(coachId, forceRefresh = false, showLoading = false)
        }
    }

    fun requestPtBook(slot: PtSlot) {
        val coachId = _ptState.value.coachId ?: return
        viewModelScope.launch {
            try {
                val result = withContext(Dispatchers.IO) {
                    api.ptBooking(PT_DEFAULT_COURSE_ID, slot.startTime, coachId, PT_DEFAULT_STORE_ID, null)
                }
                when (result) {
                    is PtBookResult.NeedCard -> _ptState.update {
                        it.copy(pendingBookSlot = slot, availableCards = result.cards)
                    }
                    is PtBookResult.Success -> _ptState.update { it.copy(message = UiMessage("预约成功！")) }
                }
            } catch (e: Exception) {
                _ptState.update { it.copy(message = UiMessage(e.toUserMessage())) }
            }
        }
    }

    fun confirmPtBook(card: MemberCard) {
        val slot = _ptState.value.pendingBookSlot ?: return
        val coachId = _ptState.value.coachId ?: return
        _ptState.update { it.copy(pendingBookSlot = null, availableCards = emptyList()) }
        viewModelScope.launch {
            try {
                withContext(Dispatchers.IO) {
                    api.ptBooking(PT_DEFAULT_COURSE_ID, slot.startTime, coachId, PT_DEFAULT_STORE_ID, card.id)
                }
                _ptState.update { it.copy(message = UiMessage("预约成功！使用「${card.name}」")) }
            } catch (e: Exception) {
                _ptState.update { it.copy(message = UiMessage(e.toUserMessage())) }
            }
        }
    }

    fun dismissPtBookDialog() = _ptState.update { it.copy(pendingBookSlot = null, availableCards = emptyList()) }
    fun clearPtMessage() = _ptState.update { it.copy(message = null) }

    // ── Records ───────────────────────────────────────────────────────────────

    private val _recordsState = MutableStateFlow(RecordsState())
    val recordsState: StateFlow<RecordsState> = _recordsState.asStateFlow()

    fun initRecords() {
        val s = _recordsState.value
        loadRecords(s.year, s.month)
    }

    fun loadRecords(year: Int, month: Int) {
        viewModelScope.launch {
            _recordsState.update { it.copy(isLoading = true, year = year, month = month, error = null) }
            try {
                val records = withContext(Dispatchers.IO) { api.getCombinedBookingRecords(year, month) }
                _recordsState.update { it.copy(isLoading = false, records = records) }
            } catch (e: Exception) {
                _recordsState.update { it.copy(isLoading = false, error = e.toUserMessage()) }
            }
        }
    }

    fun cancelRecord(record: BookingRecord) {
        val idType = if (record.type == BookingRecordType.PT.value) IdType.PT else IdType.GROUP
        viewModelScope.launch {
            try {
                withContext(Dispatchers.IO) { api.cancelBooking(record.id, idType) }
                _recordsState.update { state ->
                    state.copy(
                        records = state.records.filter { it.id != record.id },
                        message = UiMessage("已取消预约"),
                    )
                }
            } catch (e: Exception) {
                _recordsState.update { it.copy(message = UiMessage(e.toUserMessage())) }
            }
        }
    }

    fun showQrCode(record: BookingRecord) {
        val idType = if (record.type == BookingRecordType.PT.value) IdType.PT else IdType.GROUP
        _recordsState.update { it.copy(qrCodeTarget = record, qrCodeBase64 = null) }
        viewModelScope.launch {
            try {
                val base64 = withContext(Dispatchers.IO) { api.getCheckinQrcode(record.id, idType) }
                _recordsState.update { it.copy(qrCodeBase64 = base64) }
            } catch (_: Exception) {
                // QR will show placeholder if fetch fails
            }
        }
    }

    fun dismissQrCode() = _recordsState.update { it.copy(qrCodeTarget = null, qrCodeBase64 = null) }
    fun clearRecordsMessage() = _recordsState.update { it.copy(message = null) }

    // ── PT Stats ──────────────────────────────────────────────────────────────

    private val _ptStatsState = MutableStateFlow(PtStatsState())
    val ptStatsState: StateFlow<PtStatsState> = _ptStatsState.asStateFlow()

    fun selectStatsCoach(entry: com.ssj.geekfight.api.CoachEntry) {
        _ptStatsState.update { it.copy(coachId = entry.id, coachName = entry.name, results = emptyList()) }
    }

    fun setStatsStartDate(date: java.time.LocalDate) {
        _ptStatsState.update { it.copy(startDate = date, results = emptyList()) }
    }

    fun setStatsEndDate(date: java.time.LocalDate) {
        _ptStatsState.update { it.copy(endDate = date, results = emptyList()) }
    }

    /**
     * Build a map of (coachId -> set of hours with group class) for a specific date,
     * using ClassListCache across all known stores.
     * Returns empty set if no class list is cached.
     */
    private fun groupClassHoursForCoach(
        ctx: android.content.Context,
        coachId: Int,
        date: java.time.LocalDate,
    ): Set<Int> {
        val zone = java.time.ZoneId.systemDefault()
        val hours = mutableSetOf<Int>()
        // Use all store IDs that have class list cache files
        val storeIds = ctx.cacheDir.listFiles { f -> f.name.startsWith("classlist_") }
            ?.mapNotNull { f -> f.nameWithoutExtension.removePrefix("classlist_").toIntOrNull() }
            ?: return hours
        for (storeId in storeIds) {
            val classes = ClassListCache.load(ctx, storeId) ?: continue
            classes.filter { cls ->
                cls.coaches.any { it.id == coachId } &&
                    java.time.Instant.ofEpochSecond(cls.startTime).atZone(zone).toLocalDate() == date
            }.forEach { cls ->
                hours += java.time.Instant.ofEpochSecond(cls.startTime).atZone(zone).hour
            }
        }
        return hours
    }

    fun clearPtStatsCache() {
        val ctx = getApplication<android.app.Application>()
        PtStatsCache.clearAll(ctx)
        _ptStatsState.update { it.copy(results = emptyList(), rankingResults = emptyList()) }
    }

    fun computeRanking() {
        val from = _ptStatsState.value.startDate
        val to = _ptStatsState.value.endDate
        viewModelScope.launch {
            _ptStatsState.update { it.copy(isLoadingRanking = true, rankingResults = emptyList()) }
            val ctx = getApplication<android.app.Application>()
            val ranking = withContext(Dispatchers.IO) {
                com.ssj.geekfight.api.COACH_LIST.map { coach ->
                    val dayData = PtStatsCache.getRange(ctx, coach.id, from, to)
                    val booked = dayData.entries.sumOf { (dateStr, entry) ->
                        val date = java.time.LocalDate.parse(dateStr)
                        val gcHours = groupClassHoursForCoach(ctx, coach.id, date)
                        entry.slots.count { !it.available && slotHour(it.timeStr) !in gcHours }
                    }
                    CoachRankEntry(coach.id, coach.name, booked, dayData.size)
                }.sortedByDescending { it.bookedCount }
            }
            _ptStatsState.update { it.copy(isLoadingRanking = false, rankingResults = ranking) }
        }
    }

    fun fetchAllCoachesPt() {
        val from = _ptStatsState.value.startDate
        val to = _ptStatsState.value.endDate
        val today = java.time.LocalDate.now()
        val zone = java.time.ZoneId.systemDefault()
        val coaches = com.ssj.geekfight.api.COACH_LIST

        viewModelScope.launch {
            _ptStatsState.update { it.copy(isBulkFetching = true, bulkFetchProgress = "加载课表…") }
            val ctx = getApplication<android.app.Application>()
            withContext(Dispatchers.IO) {
                // Ensure class list cache is populated first
                try {
                    val allStores = api.getAllStores()
                    for (store in allStores) {
                        if (ClassListCache.load(ctx, store.id) == null) {
                            api.getClassList(store.id)
                        }
                    }
                } catch (_: Exception) {}
            }
            withContext(Dispatchers.IO) {
                coaches.forEachIndexed { idx, coach ->
                    _ptStatsState.update {
                        it.copy(bulkFetchProgress = "${coach.name} (${idx + 1}/${coaches.size})")
                    }
                    var d = if (from.isBefore(today)) today else from
                    while (!d.isAfter(to)) {
                        val epochDate = d.atStartOfDay(zone).toEpochSecond()
                        try {
                            val slots = api.getPtBookingList(PT_DEFAULT_COURSE_ID, PT_DEFAULT_STORE_ID, epochDate, coach.id)
                            val records = slots.map { com.ssj.geekfight.api.PtSlotRecord(it.timeStr, it.available) }
                            PtStatsCache.update(ctx, coach.id, d, records)
                        } catch (_: Exception) {}
                        d = d.plusDays(1)
                    }
                }
            }
            _ptStatsState.update { it.copy(isBulkFetching = false, bulkFetchProgress = "") }
        }
    }

    fun runPtStats() {
        val state = _ptStatsState.value
        val coachId = state.coachId ?: return
        val from = state.startDate
        val to = state.endDate
        if (from.isAfter(to)) return

        viewModelScope.launch {
            _ptStatsState.update { it.copy(isLoading = true, error = null, results = emptyList()) }
            try {
                val today = java.time.LocalDate.now()
                val zone = java.time.ZoneId.systemDefault()

                val ctx = getApplication<android.app.Application>()

                // Ensure class list cache is populated for accurate group class detection
                withContext(Dispatchers.IO) {
                    try {
                        val allStores = api.getAllStores()
                        for (store in allStores) {
                            if (ClassListCache.load(ctx, store.id) == null) {
                                api.getClassList(store.id)
                            }
                        }
                    } catch (_: Exception) {}
                }

                // For today and future dates in range: fetch from API and persist to stats cache
                withContext(Dispatchers.IO) {
                    var d = if (from.isBefore(today)) today else from
                    while (!d.isAfter(to)) {
                        val epochDate = d.atStartOfDay(zone).toEpochSecond()
                        try {
                            val slots = api.getPtBookingList(PT_DEFAULT_COURSE_ID, PT_DEFAULT_STORE_ID, epochDate, coachId)
                            val records = slots.map { com.ssj.geekfight.api.PtSlotRecord(it.timeStr, it.available) }
                            PtStatsCache.update(ctx, coachId, d, records)
                        } catch (_: Exception) {}
                        d = d.plusDays(1)
                    }
                }

                // Read aggregated results from cache
                val dayFmt = java.time.format.DateTimeFormatter.ofPattern("M月d日 EEE", java.util.Locale.CHINESE)
                val results = withContext(Dispatchers.IO) {
                    val cached = PtStatsCache.getRange(ctx, coachId, from, to)
                    var d = from
                    val list = mutableListOf<PtStatsDayResult>()
                    while (!d.isAfter(to)) {
                        val entry = cached[d.toString()]
                        if (entry != null) {
                            val gcHours = groupClassHoursForCoach(ctx, coachId, d)
                            val groupClassCount = entry.slots.count { slotHour(it.timeStr) in gcHours }
                            val bookedPt = entry.slots.count { !it.available && slotHour(it.timeStr) !in gcHours }
                            val availableCount = entry.slots.count { it.available && slotHour(it.timeStr) !in gcHours }
                            list.add(PtStatsDayResult(
                                date = d.format(dayFmt),
                                bookedCount = bookedPt,
                                totalSlots = entry.slots.size,
                                groupClassCount = groupClassCount,
                                availableCount = availableCount,
                                fromCache = d.isBefore(today),
                            ))
                        }
                        d = d.plusDays(1)
                    }
                    list
                }
                _ptStatsState.update { it.copy(isLoading = false, results = results) }
            } catch (e: Exception) {
                _ptStatsState.update { it.copy(isLoading = false, error = e.toUserMessage()) }
            }
        }
    }
}

// ── Constants & helpers ───────────────────────────────────────────────────────

const val PT_DEFAULT_STORE_ID = 1101005
const val PT_DEFAULT_COURSE_ID = 5

private val DOW_CN = mapOf(
    java.time.DayOfWeek.MONDAY    to "周一",
    java.time.DayOfWeek.TUESDAY   to "周二",
    java.time.DayOfWeek.WEDNESDAY to "周三",
    java.time.DayOfWeek.THURSDAY  to "周四",
    java.time.DayOfWeek.FRIDAY    to "周五",
    java.time.DayOfWeek.SATURDAY  to "周六",
    java.time.DayOfWeek.SUNDAY    to "周日",
)

fun buildAvailableDates(days: Int = 14): List<AvailableDate> {
    val zone = ZoneId.systemDefault()
    return (0 until days).map { offset ->
        val date = java.time.LocalDate.now().plusDays(offset.toLong())
        val ts = date.atStartOfDay(zone).toEpochSecond()
        val dow = DOW_CN[date.dayOfWeek] ?: ""
        AvailableDate(date = ts, displayDate = "${date.monthValue}/${date.dayOfMonth} $dow")
    }
}

// ── Formatting helpers ────────────────────────────────────────────────────────

private val dtFormatter = DateTimeFormatter.ofPattern("MM-dd EEE HH:mm", java.util.Locale.CHINESE)
private val timeFormatter = DateTimeFormatter.ofPattern("HH:mm")

fun Long.toDisplayDateTime(): String =
    Instant.ofEpochSecond(this).atZone(ZoneId.systemDefault()).format(dtFormatter)

fun Long.toDisplayTime(): String =
    Instant.ofEpochSecond(this).atZone(ZoneId.systemDefault()).format(timeFormatter)

private fun slotHour(timeStr: String): Int =
    Regex("""(\d{1,2}):""").find(timeStr)?.groupValues?.get(1)?.toIntOrNull() ?: -1

private fun Exception.toUserMessage(): String = when (this) {
    is ApiException -> message ?: "请求失败"
    else -> message?.take(80) ?: "网络错误，请检查连接"
}
