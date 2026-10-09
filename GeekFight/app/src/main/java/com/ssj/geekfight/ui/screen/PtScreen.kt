package com.ssj.geekfight.ui.screen

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowDropDown
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material.icons.filled.KeyboardArrowUp
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Snackbar
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.ssj.geekfight.api.COACH_LIST
import com.ssj.geekfight.api.CoachEntry
import com.ssj.geekfight.api.CoachScheduleDay
import com.ssj.geekfight.api.PtSlot
import com.ssj.geekfight.api.coachNameById
import com.ssj.geekfight.ui.theme.Border
import com.ssj.geekfight.ui.theme.Grey2
import com.ssj.geekfight.ui.theme.Grey3
import com.ssj.geekfight.ui.theme.Red
import com.ssj.geekfight.ui.theme.RedGlow
import com.ssj.geekfight.ui.theme.Surface
import com.ssj.geekfight.ui.theme.Surface2
import com.ssj.geekfight.ui.theme.Surface3
import com.ssj.geekfight.viewmodel.AppViewModel
import com.ssj.geekfight.viewmodel.PT_DEFAULT_COURSE_ID
import com.ssj.geekfight.viewmodel.PT_DEFAULT_STORE_ID
import com.ssj.geekfight.viewmodel.toDisplayTime
import kotlinx.coroutines.delay

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PtScreen(viewModel: AppViewModel) {
    val state by viewModel.ptState.collectAsState()
    LaunchedEffect(Unit) { viewModel.initPt() }

    var showCoachPicker by remember { mutableStateOf(false) }
    var scheduleExpanded by remember { mutableStateOf(false) }
    var coachIdInput by remember { mutableStateOf("") }
    LaunchedEffect(state.coachId) { coachIdInput = state.coachId?.toString().orEmpty() }
    val enteredCoachId = coachIdInput.trim().toIntOrNull()?.takeIf { it > 0 }
    val submitCoachId = {
        enteredCoachId?.let { id -> viewModel.selectPtCoach(CoachEntry(id, coachNameById(id))) }
        Unit
    }

    Box(modifier = Modifier.fillMaxSize()) {
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = androidx.compose.foundation.layout.PaddingValues(bottom = 80.dp),
        ) {

            item {
                Text(
                    "STORE $PT_DEFAULT_STORE_ID  ·  COURSE $PT_DEFAULT_COURSE_ID",
                    style = MaterialTheme.typography.labelSmall,
                    color = Grey3,
                    letterSpacing = 1.sp,
                    modifier = Modifier.padding(start = 16.dp, top = 14.dp, bottom = 6.dp),
                )
                Box(modifier = Modifier.fillMaxWidth().height(1.dp).padding(horizontal = 14.dp).background(Border))
            }

            // Coach selector button
            item {
                SectionLabel("COACH")
                CoachSelectorButton(
                    selectedCoach = if (state.coachId != null)
                        CoachEntry(state.coachId!!, state.coachName) else null,
                    onClick = { showCoachPicker = true },
                    modifier = Modifier.padding(horizontal = 14.dp, vertical = 4.dp),
                )
                Row(
                    modifier = Modifier.fillMaxWidth().padding(horizontal = 14.dp, vertical = 4.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                ) {
                    TextField(
                        value = coachIdInput,
                        onValueChange = { coachIdInput = it.filter(Char::isDigit) },
                        placeholder = { Text("输入教练 ID", color = Grey3) },
                        singleLine = true,
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number, imeAction = ImeAction.Done),
                        keyboardActions = KeyboardActions(onDone = { submitCoachId() }),
                        colors = TextFieldDefaults.colors(
                            focusedContainerColor = Surface2,
                            unfocusedContainerColor = Surface2,
                            focusedTextColor = Color.White,
                            unfocusedTextColor = Color.White,
                            cursorColor = Red,
                            focusedIndicatorColor = Red,
                            unfocusedIndicatorColor = Border,
                        ),
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier.weight(1f),
                    )
                    Button(
                        onClick = submitCoachId,
                        enabled = enteredCoachId != null,
                        colors = ButtonDefaults.buttonColors(containerColor = Red),
                        shape = RoundedCornerShape(8.dp),
                    ) { Text("查询") }
                }
            }

            // Coach schedule
            if (state.coachId != null) {
                item {
                    when {
                        state.isLoadingSchedule -> {
                            Row(
                                modifier = Modifier.padding(horizontal = 16.dp, vertical = 10.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(8.dp),
                            ) {
                                CircularProgressIndicator(color = Grey3, modifier = Modifier.size(14.dp), strokeWidth = 2.dp)
                                Text("查询排课中…", color = Grey3, style = MaterialTheme.typography.labelSmall)
                            }
                        }
                        state.coachSchedule.isNotEmpty() -> {
                            Row(
                                modifier = Modifier.padding(start = 16.dp, top = 14.dp, bottom = 4.dp, end = 4.dp),
                                verticalAlignment = Alignment.CenterVertically,
                            ) {
                                Text(
                                    "团课排课",
                                    style = MaterialTheme.typography.labelLarge,
                                    color = Red,
                                    modifier = Modifier.weight(1f),
                                )
                                IconButton(
                                    onClick = { viewModel.refreshCoachSchedule() },
                                    modifier = Modifier.size(32.dp),
                                ) {
                                    Icon(Icons.Default.Refresh, null, tint = Grey3, modifier = Modifier.size(16.dp))
                                }
                                IconButton(
                                    onClick = { scheduleExpanded = !scheduleExpanded },
                                    modifier = Modifier.size(32.dp),
                                ) {
                                    Icon(
                                        if (scheduleExpanded) Icons.Default.KeyboardArrowUp else Icons.Default.KeyboardArrowDown,
                                        null, tint = Grey3, modifier = Modifier.size(18.dp),
                                    )
                                }
                            }
                            if (scheduleExpanded) {
                                CoachScheduleCard(state.coachSchedule)
                                Spacer(Modifier.height(4.dp))
                            }
                        }
                        else -> {
                            androidx.compose.material3.TextButton(
                                onClick = { viewModel.loadCoachSchedule() },
                                modifier = Modifier.padding(start = 10.dp, top = 2.dp),
                            ) {
                                Icon(
                                    Icons.Default.Search,
                                    contentDescription = null,
                                    tint = Grey3,
                                    modifier = Modifier.size(14.dp),
                                )
                                Spacer(Modifier.width(4.dp))
                                Text("查看团课排课", color = Grey3, style = MaterialTheme.typography.labelMedium)
                            }
                        }
                    }
                }
            }

            // Date chips
            item {
                SectionLabel("DATE")
                LazyRow(
                    modifier = Modifier.padding(horizontal = 12.dp, vertical = 4.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                ) {
                    items(state.availableDates) { date ->
                        FilterChip(
                            selected = state.selectedDate?.date == date.date,
                            onClick = { viewModel.selectPtDate(date) },
                            label = { Text(date.displayDate, style = MaterialTheme.typography.labelMedium) },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = RedGlow, selectedLabelColor = Red,
                                containerColor = Surface2, labelColor = Grey2,
                            ),
                            border = FilterChipDefaults.filterChipBorder(
                                enabled = true, selected = state.selectedDate?.date == date.date,
                                borderColor = Border, selectedBorderColor = Red,
                                borderWidth = 1.dp, selectedBorderWidth = 1.dp,
                            ),
                        )
                    }
                }
            }

            if (state.isLoading) {
                item {
                    Box(Modifier.fillMaxWidth().padding(20.dp), contentAlignment = Alignment.Center) {
                        CircularProgressIndicator(color = Red, modifier = Modifier.size(32.dp))
                    }
                }
            }

            if (state.error != null) {
                item {
                    Text(state.error!!, color = Red, modifier = Modifier.padding(16.dp),
                        style = MaterialTheme.typography.bodySmall)
                }
            }

            if (state.slots.isNotEmpty()) {
                val dayStart = state.selectedDate?.date ?: 0L
                val dayEnd = dayStart + 86400
                val gcEpochs = state.coachSchedule.flatMap { it.entries }
                    .filter { it.startEpoch in dayStart until dayEnd }
                    .map { it.startEpoch }.toSet()

                val available = state.slots.filter { it.available }
                val groupClassCount = state.slots.count { !it.available && it.startTime in gcEpochs }
                val denominator = state.slots.size - groupClassCount
                val denomLabel = if (groupClassCount > 0) "$denominator(-$groupClassCount)" else "$denominator"
                item { SectionLabel("可约时段  ${available.size}/$denomLabel") }
                items(state.slots, key = { it.startTime }) { slot ->
                    val isGroupClass = !slot.available && slot.startTime in gcEpochs
                    PtSlotRow(
                        slot = slot,
                        isGroupClass = isGroupClass,
                        onBook = { viewModel.requestPtBook(slot) },
                    )
                }
            }
        }

        val msg = state.message
        if (msg != null) {
            LaunchedEffect(msg.id) { delay(2000); viewModel.clearPtMessage() }
            Snackbar(
                modifier = Modifier.align(Alignment.BottomCenter).padding(16.dp),
                containerColor = Surface2, contentColor = Color.White,
            ) { Text(msg.text) }
        }
    }

    if (showCoachPicker) {
        CoachPickerDialog(
            currentId = state.coachId,
            onSelect = { coach ->
                showCoachPicker = false
                viewModel.selectPtCoach(coach)
            },
            onDismiss = { showCoachPicker = false },
        )
    }

    val pendingSlot = state.pendingBookSlot
    if (pendingSlot != null && state.availableCards.isNotEmpty()) {
        CardPickerDialog(
            title = "选择会员卡",
            subtitle = "${state.coachName}（${state.coachId}）  ·  ${pendingSlot.startTime.toDisplayTime()}",
            cards = state.availableCards,
            onSelect = { viewModel.confirmPtBook(it) },
            onDismiss = { viewModel.dismissPtBookDialog() },
        )
    }
}

@Composable
private fun CoachSelectorButton(
    selectedCoach: CoachEntry?,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(8.dp))
            .background(if (selectedCoach != null) RedGlow else Surface2)
            .border(1.dp, if (selectedCoach != null) Red else Border, RoundedCornerShape(8.dp))
            .clickable(onClick = onClick)
            .padding(horizontal = 14.dp, vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Icon(
            Icons.Default.Person,
            contentDescription = null,
            tint = if (selectedCoach != null) Red else Grey3,
            modifier = Modifier.size(18.dp),
        )
        Spacer(Modifier.width(10.dp))
        if (selectedCoach != null) {
            Text(
                selectedCoach.name,
                color = Color.White,
                fontWeight = FontWeight.Bold,
                style = MaterialTheme.typography.bodyMedium,
                modifier = Modifier.weight(1f),
            )
            Text(
                "ID ${selectedCoach.id}",
                color = Red,
                style = MaterialTheme.typography.labelMedium,
                fontWeight = FontWeight.Bold,
            )
        } else {
            Text(
                "选择教练",
                color = Grey3,
                style = MaterialTheme.typography.bodyMedium,
                modifier = Modifier.weight(1f),
            )
        }
        Spacer(Modifier.width(6.dp))
        Icon(Icons.Default.ArrowDropDown, null, tint = Grey2, modifier = Modifier.size(20.dp))
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
internal fun CoachPickerDialog(
    currentId: Int?,
    onSelect: (CoachEntry) -> Unit,
    onDismiss: () -> Unit,
) {
    var query by remember { mutableStateOf("") }
    val focusRequester = remember { FocusRequester() }

    val filtered = remember(query) {
        val q = query.trim()
        if (q.isBlank()) COACH_LIST
        else COACH_LIST.filter {
            it.name.contains(q, ignoreCase = true) || it.id.toString().contains(q)
        }
    }

    AlertDialog(
        onDismissRequest = onDismiss,
        containerColor = Color(0xF00F0F0F),
        titleContentColor = Color.White,
        title = {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text("选择教练", fontWeight = FontWeight.Bold, modifier = Modifier.weight(1f))
                IconButton(onClick = onDismiss, modifier = Modifier.size(32.dp)) {
                    Icon(Icons.Default.Close, null, tint = Grey2, modifier = Modifier.size(18.dp))
                }
            }
        },
        text = {
            Column {
                // Search box
                TextField(
                    value = query,
                    onValueChange = { query = it },
                    placeholder = { Text("搜索名字或 ID", color = Grey3) },
                    leadingIcon = { Icon(Icons.Default.Search, null, tint = Grey3, modifier = Modifier.size(18.dp)) },
                    trailingIcon = {
                        if (query.isNotEmpty()) {
                            IconButton(onClick = { query = "" }, modifier = Modifier.size(32.dp)) {
                                Icon(Icons.Default.Close, null, tint = Grey3, modifier = Modifier.size(16.dp))
                            }
                        }
                    },
                    singleLine = true,
                    keyboardOptions = androidx.compose.foundation.text.KeyboardOptions(imeAction = ImeAction.Search),
                    colors = TextFieldDefaults.colors(
                        focusedContainerColor = Surface2,
                        unfocusedContainerColor = Surface2,
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White,
                        cursorColor = Red,
                        focusedIndicatorColor = Red,
                        unfocusedIndicatorColor = Color.Transparent,
                    ),
                    shape = RoundedCornerShape(8.dp),
                    modifier = Modifier.fillMaxWidth().focusRequester(focusRequester),
                )

                Spacer(Modifier.height(8.dp))

                // Coach list
                LazyColumn(
                    modifier = Modifier.fillMaxWidth().height(320.dp),
                ) {
                    items(filtered, key = { it.id }) { coach ->
                        val isSelected = coach.id == currentId
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(6.dp))
                                .background(if (isSelected) RedGlow else Color.Transparent)
                                .clickable { onSelect(coach) }
                                .padding(horizontal = 12.dp, vertical = 12.dp),
                            verticalAlignment = Alignment.CenterVertically,
                        ) {
                            Text(
                                coach.name,
                                color = if (isSelected) Red else Color.White,
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                                style = MaterialTheme.typography.bodyMedium,
                                modifier = Modifier.weight(1f),
                            )
                            Text(
                                coach.id.toString(),
                                color = Grey3,
                                style = MaterialTheme.typography.labelSmall,
                            )
                            if (isSelected) {
                                Spacer(Modifier.width(8.dp))
                                Icon(Icons.Default.Check, null, tint = Red, modifier = Modifier.size(16.dp))
                            }
                        }
                        if (coach != filtered.last()) {
                            HorizontalDivider(color = Border, thickness = 0.5.dp)
                        }
                    }
                }
            }
        },
        confirmButton = {},
        dismissButton = { TextButton(onClick = onDismiss) { Text("取消", color = Grey2) } },
    )

    LaunchedEffect(Unit) {
        runCatching { focusRequester.requestFocus() }
    }
}

@Composable
private fun CoachScheduleCard(days: List<CoachScheduleDay>) {
    Column(
        modifier = Modifier
            .padding(horizontal = 14.dp)
            .clip(RoundedCornerShape(8.dp))
            .background(Surface2)
            .border(1.dp, Border, RoundedCornerShape(8.dp)),
    ) {
        days.forEachIndexed { dayIdx, day ->
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Color(0x18FF3333))
                    .padding(horizontal = 12.dp, vertical = 7.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Text(
                    day.date,
                    color = Red,
                    fontWeight = FontWeight.Bold,
                    style = MaterialTheme.typography.labelMedium,
                )
            }
            day.entries.forEachIndexed { entryIdx, entry ->
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 12.dp, vertical = 8.dp),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Text(
                        entry.time,
                        color = Color.White,
                        fontWeight = FontWeight.Medium,
                        style = MaterialTheme.typography.bodySmall,
                        modifier = Modifier.width(110.dp),
                    )
                    Column(modifier = Modifier.weight(1f)) {
                        Text(entry.courseName, color = Grey2, style = MaterialTheme.typography.bodySmall)
                        Text(entry.storeName, color = Grey3, style = MaterialTheme.typography.labelSmall)
                    }
                }
                if (entryIdx < day.entries.lastIndex) {
                    HorizontalDivider(color = Border, thickness = 0.5.dp, modifier = Modifier.padding(horizontal = 12.dp))
                }
            }
            if (dayIdx < days.lastIndex) {
                HorizontalDivider(color = Border, thickness = 1.dp)
            }
        }
    }
}

@Composable
private fun SectionLabel(text: String) {
    Text(
        text = text,
        style = MaterialTheme.typography.labelLarge,
        color = Red,
        modifier = Modifier.padding(start = 16.dp, top = 14.dp, bottom = 4.dp),
    )
}

@Composable
private fun PtSlotRow(slot: PtSlot, isGroupClass: Boolean, onBook: () -> Unit) {
    val nowEpoch = remember { System.currentTimeMillis() / 1000 }
    val isPast = slot.startTime < nowEpoch
    val dimmed = !slot.available
    Box(
        modifier = Modifier.fillMaxWidth().padding(horizontal = 14.dp, vertical = 4.dp)
            .clip(RoundedCornerShape(6.dp))
            .background(if (dimmed) Color(0x660F0F0F) else Color(0xE60F0F0F))
            .border(1.dp, if (dimmed) Color(0x33FFFFFF) else Border, RoundedCornerShape(6.dp)),
    ) {
        Row(
            modifier = Modifier.fillMaxWidth().padding(horizontal = 14.dp, vertical = 10.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween,
        ) {
            Text(
                "${slot.startTime.toDisplayTime()} – ${slot.endTime.toDisplayTime()}",
                style = MaterialTheme.typography.bodyMedium,
                color = if (dimmed) Grey3 else Color.White,
                fontWeight = FontWeight.Medium,
            )
            when {
                slot.available -> Button(
                    onClick = onBook,
                    modifier = Modifier.height(30.dp),
                    contentPadding = androidx.compose.foundation.layout.PaddingValues(horizontal = 14.dp, vertical = 0.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Red, contentColor = Color.White),
                    shape = RoundedCornerShape(4.dp),
                ) { Text("预约", fontSize = 12.sp, fontWeight = FontWeight.Bold) }

                isPast -> Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(4.dp))
                        .background(Color(0x11FFFFFF))
                        .border(1.dp, Color(0x22FFFFFF), RoundedCornerShape(4.dp))
                        .padding(horizontal = 10.dp, vertical = 4.dp),
                ) { Text("已过时", fontSize = 12.sp, color = Color(0x66FFFFFF), fontWeight = FontWeight.Bold) }

                isGroupClass -> Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(4.dp))
                        .background(Color(0x33FF8800))
                        .border(1.dp, Color(0xFFFF8800), RoundedCornerShape(4.dp))
                        .padding(horizontal = 10.dp, vertical = 4.dp),
                ) { Text("团课", fontSize = 12.sp, color = Color(0xFFFF8800), fontWeight = FontWeight.Bold) }

                else -> Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(4.dp))
                        .background(Color(0x22FFFFFF))
                        .border(1.dp, Color(0x44FFFFFF), RoundedCornerShape(4.dp))
                        .padding(horizontal = 10.dp, vertical = 4.dp),
                ) { Text("已预约", fontSize = 12.sp, color = Grey3, fontWeight = FontWeight.Bold) }
            }
        }
    }
}
