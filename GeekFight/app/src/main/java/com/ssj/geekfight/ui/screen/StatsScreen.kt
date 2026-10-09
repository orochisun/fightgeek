package com.ssj.geekfight.ui.screen

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowDropDown
import androidx.compose.material.icons.filled.DateRange
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.DatePickerDefaults
import androidx.compose.material3.DateRangePicker
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.rememberDateRangePickerState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import com.ssj.geekfight.ui.theme.Border
import com.ssj.geekfight.ui.theme.Grey2
import com.ssj.geekfight.ui.theme.Grey3
import com.ssj.geekfight.ui.theme.Red
import com.ssj.geekfight.ui.theme.RedGlow
import com.ssj.geekfight.ui.theme.Surface2
import com.ssj.geekfight.viewmodel.AppViewModel
import com.ssj.geekfight.viewmodel.CoachRankEntry
import com.ssj.geekfight.viewmodel.PtStatsDayResult
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneId
import java.time.format.DateTimeFormatter

private val displayFmt = DateTimeFormatter.ofPattern("M月d日")
private val PRESETS = listOf(7 to "7天", 14 to "14天", 30 to "30天", 60 to "60天")

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun StatsScreen(viewModel: AppViewModel) {
    val state by viewModel.ptStatsState.collectAsState()
    var showCoachPicker by remember { mutableStateOf(false) }
    var showDatePicker by remember { mutableStateOf(false) }
    var showRanking by remember { mutableStateOf(false) }
    var showClearConfirm by remember { mutableStateOf(false) }

    Box(modifier = Modifier.fillMaxSize()) {
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = androidx.compose.foundation.layout.PaddingValues(bottom = 80.dp),
        ) {

            // Coach selector
            item {
                StatsSectionLabel("COACH")
                Row(
                    modifier = Modifier
                        .padding(horizontal = 14.dp, vertical = 4.dp)
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(8.dp))
                        .background(if (state.coachId != null) RedGlow else Surface2)
                        .border(1.dp, if (state.coachId != null) Red else Border, RoundedCornerShape(8.dp))
                        .clickable { showCoachPicker = true }
                        .padding(horizontal = 14.dp, vertical = 12.dp),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Icon(Icons.Default.Person, null,
                        tint = if (state.coachId != null) Red else Grey3,
                        modifier = Modifier.size(18.dp))
                    Spacer(Modifier.width(10.dp))
                    if (state.coachId != null) {
                        Text(state.coachName, color = Color.White, fontWeight = FontWeight.Bold,
                            style = MaterialTheme.typography.bodyMedium, modifier = Modifier.weight(1f))
                        Text("ID ${state.coachId}", color = Red, style = MaterialTheme.typography.labelMedium,
                            fontWeight = FontWeight.Bold)
                    } else {
                        Text("选择教练", color = Grey3, style = MaterialTheme.typography.bodyMedium,
                            modifier = Modifier.weight(1f))
                    }
                    Spacer(Modifier.width(6.dp))
                    Icon(Icons.Default.ArrowDropDown, null, tint = Grey2, modifier = Modifier.size(20.dp))
                }
            }

            // Date range row
            item {
                StatsSectionLabel("日期范围")
                // Presets
                Row(
                    modifier = Modifier.padding(horizontal = 12.dp, vertical = 4.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                ) {
                    val today = LocalDate.now()
                    PRESETS.forEach { (days, label) ->
                        val presetStart = today.minusDays(days.toLong() - 1)
                        val selected = state.startDate == presetStart && state.endDate == today
                        FilterChip(
                            selected = selected,
                            onClick = {
                                viewModel.setStatsStartDate(presetStart)
                                viewModel.setStatsEndDate(today)
                            },
                            label = { Text(label, style = MaterialTheme.typography.labelMedium) },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = RedGlow, selectedLabelColor = Red,
                                containerColor = Surface2, labelColor = Grey2,
                            ),
                            border = FilterChipDefaults.filterChipBorder(
                                enabled = true, selected = selected,
                                borderColor = Border, selectedBorderColor = Red,
                                borderWidth = 1.dp, selectedBorderWidth = 1.dp,
                            ),
                        )
                    }
                }
                // Custom picker button
                Row(
                    modifier = Modifier
                        .padding(horizontal = 14.dp, vertical = 4.dp)
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(8.dp))
                        .background(Surface2)
                        .border(1.dp, Border, RoundedCornerShape(8.dp))
                        .clickable { showDatePicker = true }
                        .padding(horizontal = 14.dp, vertical = 12.dp),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Icon(Icons.Default.DateRange, null, tint = Grey3, modifier = Modifier.size(18.dp))
                    Spacer(Modifier.width(10.dp))
                    Text(
                        "${state.startDate.format(displayFmt)} – ${state.endDate.format(displayFmt)}",
                        color = Color.White,
                        style = MaterialTheme.typography.bodyMedium,
                        modifier = Modifier.weight(1f),
                    )
                    Text("自定义", color = Grey3, style = MaterialTheme.typography.labelSmall)
                }
            }

            // Buttons
            item {
                Spacer(Modifier.height(8.dp))
                Row(
                    modifier = Modifier.padding(horizontal = 14.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                ) {
                    Button(
                        onClick = { viewModel.runPtStats() },
                        enabled = state.coachId != null && !state.isLoading && !state.isBulkFetching
                            && !state.startDate.isAfter(state.endDate),
                        modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.buttonColors(containerColor = Red, contentColor = Color.White,
                            disabledContainerColor = Surface2, disabledContentColor = Grey3),
                        shape = RoundedCornerShape(8.dp),
                    ) { Text("统计", fontWeight = FontWeight.Bold, fontSize = 14.sp) }
                    Button(
                        onClick = { viewModel.computeRanking(); showRanking = true },
                        enabled = !state.isLoading && !state.isBulkFetching
                            && !state.startDate.isAfter(state.endDate),
                        modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.buttonColors(containerColor = Surface2, contentColor = Grey2,
                            disabledContainerColor = Surface2, disabledContentColor = Grey3),
                        shape = RoundedCornerShape(8.dp),
                    ) { Text("排行榜", fontWeight = FontWeight.Bold, fontSize = 14.sp) }
                    Button(
                        onClick = { viewModel.fetchAllCoachesPt() },
                        enabled = !state.isBulkFetching && !state.isLoading
                            && !state.startDate.isAfter(state.endDate),
                        modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.buttonColors(containerColor = Surface2, contentColor = Grey2,
                            disabledContainerColor = Surface2, disabledContentColor = Grey3),
                        shape = RoundedCornerShape(8.dp),
                    ) { Text("拉全部", fontWeight = FontWeight.Bold, fontSize = 13.sp) }
                }
                androidx.compose.material3.TextButton(
                    onClick = { showClearConfirm = true },
                    modifier = Modifier.fillMaxWidth().padding(end = 6.dp),
                ) {
                    Text("清除统计缓存", color = Grey3, style = MaterialTheme.typography.labelSmall)
                }
                if (state.isBulkFetching) {
                    Row(
                        modifier = Modifier.padding(horizontal = 16.dp, vertical = 6.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                    ) {
                        CircularProgressIndicator(color = Red, modifier = Modifier.size(14.dp), strokeWidth = 2.dp)
                        Text(state.bulkFetchProgress, color = Grey3, style = MaterialTheme.typography.labelSmall)
                    }
                }
                Spacer(Modifier.height(4.dp))
            }

            // Loading
            if (state.isLoading) {
                item {
                    Box(Modifier.fillMaxWidth().padding(20.dp), contentAlignment = Alignment.Center) {
                        CircularProgressIndicator(color = Red, modifier = Modifier.size(32.dp))
                    }
                }
            }

            // Error
            if (state.error != null) {
                item {
                    Text(state.error!!, color = Red, modifier = Modifier.padding(16.dp),
                        style = MaterialTheme.typography.bodySmall)
                }
            }

            // Results
            if (state.results.isNotEmpty()) {
                val total = state.results.sumOf { it.bookedCount }
                item {
                    Row(
                        modifier = Modifier.padding(horizontal = 16.dp, vertical = 6.dp),
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Text("统计结果", style = MaterialTheme.typography.labelLarge, color = Red,
                            modifier = Modifier.weight(1f))
                        Text("共 $total 节", color = Red, fontWeight = FontWeight.Black,
                            style = MaterialTheme.typography.titleMedium)
                    }
                }
                item {
                    StatsResultCard(state.results)
                    Spacer(Modifier.height(8.dp))
                }
            }
        }
    }

    if (showCoachPicker) {
        CoachPickerDialog(
            currentId = state.coachId,
            onSelect = { coach ->
                showCoachPicker = false
                viewModel.selectStatsCoach(coach)
            },
            onDismiss = { showCoachPicker = false },
        )
    }

    if (showClearConfirm) {
        androidx.compose.material3.AlertDialog(
            onDismissRequest = { showClearConfirm = false },
            containerColor = Color(0xFF0F0F0F),
            titleContentColor = Color.White,
            title = { Text("清除统计缓存", fontWeight = FontWeight.Bold) },
            text = { Text("将删除所有教练的 PT 缓存数据，无法恢复。确认？", color = Grey2) },
            confirmButton = {
                Button(
                    onClick = { showClearConfirm = false; viewModel.clearPtStatsCache() },
                    colors = ButtonDefaults.buttonColors(containerColor = Red),
                    shape = RoundedCornerShape(8.dp),
                ) { Text("清除", color = Color.White) }
            },
            dismissButton = {
                TextButton(onClick = { showClearConfirm = false }) { Text("取消", color = Grey2) }
            },
        )
    }

    if (showRanking) {
        RankingDialog(
            title = "${state.startDate.format(displayFmt)} – ${state.endDate.format(displayFmt)}",
            isLoading = state.isLoadingRanking,
            entries = state.rankingResults,
            onDismiss = { showRanking = false },
        )
    }

    if (showDatePicker) {
        DateRangePickerDialog(
            initialStart = state.startDate,
            initialEnd = state.endDate,
            onConfirm = { start, end ->
                showDatePicker = false
                viewModel.setStatsStartDate(start)
                viewModel.setStatsEndDate(end)
            },
            onDismiss = { showDatePicker = false },
        )
    }
}

@Composable
private fun RankingDialog(
    title: String,
    isLoading: Boolean,
    entries: List<CoachRankEntry>,
    onDismiss: () -> Unit,
) {
    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false),
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp)
                .clip(RoundedCornerShape(16.dp))
                .background(Color(0xFF0F0F0F))
                .border(1.dp, Border, RoundedCornerShape(16.dp)),
        ) {
            Row(
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 14.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text("PT 排行榜", color = Red, fontWeight = FontWeight.Black,
                        style = MaterialTheme.typography.titleMedium)
                    Text(title, color = Grey3, style = MaterialTheme.typography.labelSmall)
                }
                if (isLoading) {
                    CircularProgressIndicator(color = Red, modifier = Modifier.size(20.dp), strokeWidth = 2.dp)
                }
            }
            HorizontalDivider(color = Border)

            if (entries.isEmpty() && !isLoading) {
                Box(Modifier.fillMaxWidth().padding(32.dp), contentAlignment = Alignment.Center) {
                    Text("暂无缓存数据，先点「拉全部」", color = Grey3,
                        style = MaterialTheme.typography.bodySmall)
                }
            } else {
                // Header
                Row(
                    modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 6.dp),
                ) {
                    Text("#", color = Grey3, style = MaterialTheme.typography.labelSmall,
                        modifier = Modifier.width(24.dp))
                    Text("教练", color = Grey3, style = MaterialTheme.typography.labelSmall,
                        modifier = Modifier.weight(1f))
                    Text("有数据天数", color = Grey3, style = MaterialTheme.typography.labelSmall,
                        modifier = Modifier.width(72.dp))
                    Text("PT节数", color = Grey3, style = MaterialTheme.typography.labelSmall,
                        modifier = Modifier.width(48.dp),
                        textAlign = androidx.compose.ui.text.style.TextAlign.End)
                }
                HorizontalDivider(color = Border, thickness = 0.5.dp)
                LazyColumn(modifier = Modifier.fillMaxWidth().heightIn(max = 420.dp)) {
                    itemsIndexed(entries) { idx, entry ->
                        val isTop = idx < 3 && entry.bookedCount > 0
                        val rankColor = when (idx) {
                            0 -> Color(0xFFFFD700)
                            1 -> Color(0xFFC0C0C0)
                            2 -> Color(0xFFCD7F32)
                            else -> Grey3
                        }
                        Row(
                            modifier = Modifier.fillMaxWidth()
                                .background(if (isTop) Color(0x0DFFFFFF) else Color.Transparent)
                                .padding(horizontal = 16.dp, vertical = 10.dp),
                            verticalAlignment = Alignment.CenterVertically,
                        ) {
                            Text("${idx + 1}", color = rankColor,
                                fontWeight = if (isTop) FontWeight.Bold else FontWeight.Normal,
                                style = MaterialTheme.typography.labelMedium,
                                modifier = Modifier.width(24.dp))
                            Text(entry.coachName,
                                color = if (entry.bookedCount > 0) Color.White else Grey3,
                                fontWeight = if (isTop) FontWeight.Bold else FontWeight.Normal,
                                style = MaterialTheme.typography.bodySmall,
                                modifier = Modifier.weight(1f))
                            Text("${entry.daysWithData}天",
                                color = Grey3, style = MaterialTheme.typography.labelSmall,
                                modifier = Modifier.width(72.dp))
                            Text("${entry.bookedCount}",
                                color = if (entry.bookedCount > 0) Red else Grey3,
                                fontWeight = if (isTop) FontWeight.Black else FontWeight.Normal,
                                style = if (isTop) MaterialTheme.typography.titleSmall else MaterialTheme.typography.bodySmall,
                                textAlign = androidx.compose.ui.text.style.TextAlign.End,
                                modifier = Modifier.width(48.dp))
                        }
                        if (idx < entries.lastIndex) {
                            HorizontalDivider(color = Border, thickness = 0.5.dp)
                        }
                    }
                }
            }

            HorizontalDivider(color = Border)
            Row(
                modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 8.dp),
                horizontalArrangement = Arrangement.End,
            ) {
                TextButton(onClick = onDismiss) { Text("关闭", color = Grey2) }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun DateRangePickerDialog(
    initialStart: LocalDate,
    initialEnd: LocalDate,
    onConfirm: (LocalDate, LocalDate) -> Unit,
    onDismiss: () -> Unit,
) {
    val zone = ZoneId.systemDefault()
    fun LocalDate.toUtcMs() = atStartOfDay(zone).toInstant().toEpochMilli()
    fun Long.toLocalDate() = Instant.ofEpochMilli(this).atZone(zone).toLocalDate()

    val pickerState = rememberDateRangePickerState(
        initialSelectedStartDateMillis = initialStart.toUtcMs(),
        initialSelectedEndDateMillis = initialEnd.toUtcMs(),
    )

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false),
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth(0.95f)
                .fillMaxHeight(0.85f)
                .clip(RoundedCornerShape(16.dp))
                .background(Color(0xFF0F0F0F))
                .border(1.dp, Border, RoundedCornerShape(16.dp)),
        ) {
            DateRangePicker(
                state = pickerState,
                modifier = Modifier.weight(1f),
                colors = DatePickerDefaults.colors(
                    containerColor = Color(0xFF0F0F0F),
                    titleContentColor = Grey2,
                    headlineContentColor = Color.White,
                    weekdayContentColor = Grey3,
                    subheadContentColor = Grey2,
                    navigationContentColor = Grey2,
                    yearContentColor = Grey2,
                    currentYearContentColor = Red,
                    selectedYearContentColor = Color.White,
                    selectedYearContainerColor = Red,
                    dayContentColor = Color.White,
                    disabledDayContentColor = Grey3,
                    selectedDayContentColor = Color.White,
                    disabledSelectedDayContentColor = Grey3,
                    selectedDayContainerColor = Red,
                    todayContentColor = Red,
                    todayDateBorderColor = Red,
                    dayInSelectionRangeContentColor = Color.White,
                    dayInSelectionRangeContainerColor = Color(0x44FF1744),
                ),
            )
            HorizontalDivider(color = Border)
            Row(
                modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 8.dp),
                horizontalArrangement = Arrangement.End,
                verticalAlignment = Alignment.CenterVertically,
            ) {
                TextButton(onClick = onDismiss) { Text("取消", color = Grey2) }
                Spacer(Modifier.width(8.dp))
                Button(
                    onClick = {
                        val start = pickerState.selectedStartDateMillis?.toLocalDate() ?: initialStart
                        val end = pickerState.selectedEndDateMillis?.toLocalDate() ?: initialEnd
                        onConfirm(start, end)
                    },
                    enabled = pickerState.selectedStartDateMillis != null && pickerState.selectedEndDateMillis != null,
                    colors = ButtonDefaults.buttonColors(containerColor = Red),
                    shape = RoundedCornerShape(8.dp),
                ) { Text("确定", color = Color.White) }
            }
        }
    }
}

@Composable
private fun StatsResultCard(results: List<PtStatsDayResult>) {
    Column(
        modifier = Modifier
            .padding(horizontal = 14.dp)
            .clip(RoundedCornerShape(8.dp))
            .background(Surface2)
            .border(1.dp, Border, RoundedCornerShape(8.dp)),
    ) {
        results.forEachIndexed { i, day ->
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 14.dp, vertical = 11.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Text(
                    day.date,
                    color = if (day.bookedCount > 0) Color.White else Grey3,
                    style = MaterialTheme.typography.bodySmall,
                    modifier = Modifier.weight(1f),
                )
                if (day.fromCache) {
                    Text("缓存", color = Grey3, style = MaterialTheme.typography.labelSmall,
                        modifier = Modifier.padding(end = 8.dp))
                }
                Text(
                    "${day.totalSlots}-${day.groupClassCount}-${day.availableCount} = ${day.bookedCount}",
                    color = if (day.bookedCount > 0) Red else Grey3,
                    fontWeight = if (day.bookedCount > 0) FontWeight.Bold else FontWeight.Normal,
                    style = MaterialTheme.typography.labelMedium,
                )
            }
            if (i < results.lastIndex) {
                HorizontalDivider(color = Border, thickness = 0.5.dp)
            }
        }
    }
}

@Composable
private fun StatsSectionLabel(text: String) {
    Text(
        text = text,
        style = MaterialTheme.typography.labelLarge,
        color = Red,
        modifier = Modifier.padding(start = 16.dp, top = 14.dp, bottom = 4.dp),
    )
}

