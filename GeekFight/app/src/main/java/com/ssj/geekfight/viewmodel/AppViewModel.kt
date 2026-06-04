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
import com.ssj.geekfight.api.Coach
import com.ssj.geekfight.api.FightGeekClient
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

// ── Token State ───────────────────────────────────────────────────────────────

data class TokenState(
    val token: String = "",
    val isValid: Boolean = false,
    val saved: Boolean = false,
)

class AppViewModel(application: Application) : AndroidViewModel(application) {

    val tokenManager = TokenManager(application)

    private val client = FightGeekClient { tokenManager.getToken() }
    private val api = BookingApi(client)

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

    fun selectStore(store: Store) {
        viewModelScope.launch {
            _classState.update { it.copy(isLoading = true, error = null, selectedStore = store) }
            try {
                val classes = withContext(Dispatchers.IO) { api.getClassList(store.id) }
                _classState.update { it.copy(isLoading = false, classes = classes) }
            } catch (e: Exception) {
                _classState.update { it.copy(isLoading = false, error = e.toUserMessage()) }
            }
        }
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
        _ptState.update { it.copy(availableDates = buildAvailableDates()) }
    }

    fun setPtCoachQuery(value: String) {
        _ptState.update { it.copy(coachQuery = value) }
    }

    fun selectPtCoach(entry: com.ssj.geekfight.api.CoachEntry) {
        _ptState.update {
            it.copy(
                coachId = entry.id,
                coachName = entry.name,
                coachQuery = "${entry.name} (${entry.id})",
                slots = emptyList(),
                error = null,
            )
        }
        loadPtSlots()
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
}

// ── Constants & helpers ───────────────────────────────────────────────────────

const val PT_DEFAULT_STORE_ID = 1101005
const val PT_DEFAULT_COURSE_ID = 5

fun buildAvailableDates(days: Int = 14): List<AvailableDate> {
    val zone = ZoneId.systemDefault()
    return (1..days).map { offset ->
        val date = java.time.LocalDate.now().plusDays(offset.toLong())
        val ts = date.atStartOfDay(zone).toEpochSecond()
        AvailableDate(date = ts, displayDate = "${date.monthValue}/${date.dayOfMonth}")
    }
}

// ── Formatting helpers ────────────────────────────────────────────────────────

private val dtFormatter = DateTimeFormatter.ofPattern("MM-dd HH:mm")
private val timeFormatter = DateTimeFormatter.ofPattern("HH:mm")

fun Long.toDisplayDateTime(): String =
    Instant.ofEpochSecond(this).atZone(ZoneId.systemDefault()).format(dtFormatter)

fun Long.toDisplayTime(): String =
    Instant.ofEpochSecond(this).atZone(ZoneId.systemDefault()).format(timeFormatter)

private fun Exception.toUserMessage(): String = when (this) {
    is ApiException -> message ?: "请求失败"
    else -> message?.take(80) ?: "网络错误，请检查连接"
}
