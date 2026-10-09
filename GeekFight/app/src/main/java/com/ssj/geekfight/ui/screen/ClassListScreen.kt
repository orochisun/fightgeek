package com.ssj.geekfight.ui.screen

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Snackbar
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.ssj.geekfight.api.GroupClass
import com.ssj.geekfight.api.MemberCard
import com.ssj.geekfight.ui.theme.Border
import com.ssj.geekfight.ui.theme.Green
import com.ssj.geekfight.ui.theme.GreenGlow
import com.ssj.geekfight.ui.theme.Grey2
import com.ssj.geekfight.ui.theme.Grey3
import com.ssj.geekfight.ui.theme.Red
import com.ssj.geekfight.ui.theme.RedGlow
import com.ssj.geekfight.ui.theme.Surface
import com.ssj.geekfight.ui.theme.Surface2
import com.ssj.geekfight.ui.theme.Surface3
import com.ssj.geekfight.viewmodel.AppViewModel
import com.ssj.geekfight.viewmodel.toDisplayDateTime
import com.ssj.geekfight.viewmodel.toDisplayTime
import kotlinx.coroutines.delay
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneId
import java.time.format.DateTimeFormatter

@OptIn(ExperimentalFoundationApi::class)
@Composable
fun ClassListScreen(viewModel: AppViewModel) {
    val state by viewModel.classState.collectAsState()
    LaunchedEffect(Unit) { viewModel.initClassList() }

    Box(modifier = Modifier.fillMaxSize()) {
        Column(modifier = Modifier.fillMaxSize()) {

            // Region chips
            if (state.regions.isNotEmpty()) {
                LazyRow(
                    modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                ) {
                    items(state.regions) { region ->
                        CombatChip(
                            label = region.name,
                            selected = state.selectedRegion?.id == region.id,
                            onClick = { viewModel.selectRegion(region) },
                        )
                    }
                }
            }

            // Store chips + refresh
            if (state.stores.isNotEmpty()) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    LazyRow(
                        modifier = Modifier.weight(1f).padding(start = 12.dp, top = 2.dp, bottom = 2.dp),
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                    ) {
                        items(state.stores) { store ->
                            CombatChip(
                                label = store.name.removePrefix("极斗·"),
                                selected = state.selectedStore?.id == store.id,
                                onClick = { viewModel.selectStore(store) },
                            )
                        }
                    }
                    IconButton(
                        onClick = { viewModel.refreshClassList() },
                        modifier = Modifier.size(36.dp),
                        enabled = !state.isLoading,
                    ) {
                        Icon(
                            Icons.Default.Refresh, null,
                            tint = if (state.isLoading) Grey3.copy(alpha = 0.3f) else Grey3,
                            modifier = Modifier.size(18.dp),
                        )
                    }
                }
            }

            when {
                state.isLoading -> Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    CircularProgressIndicator(color = Red)
                }
                state.error != null -> ErrorView(state.error!!) { viewModel.initClassList() }
                state.classes.isEmpty() -> Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    Text("暂无班次", color = Grey3)
                }
                else -> {
                    val zone = ZoneId.systemDefault()
                    val today = LocalDate.now(zone)
                    val grouped = state.classes.groupBy { cls ->
                        Instant.ofEpochSecond(cls.startTime).atZone(zone).toLocalDate()
                    }.entries.sortedBy { it.key }

                    LazyColumn(
                        modifier = Modifier.fillMaxSize(),
                        contentPadding = androidx.compose.foundation.layout.PaddingValues(
                            horizontal = 14.dp, vertical = 10.dp,
                        ),
                    ) {
                        grouped.forEach { (date, classes) ->
                            stickyHeader(key = date.toString()) {
                                DateHeader(date = date, today = today)
                            }
                            items(classes, key = { it.id }) { cls ->
                                GroupClassCard(
                                    cls = cls,
                                    onBook = { viewModel.requestBookGroupClass(cls) },
                                    onCancel = { viewModel.cancelGroupClassFromList(cls.id) },
                                )
                                Spacer(Modifier.height(10.dp))
                            }
                        }
                    }
                }
            }
        }

        val msg = state.message
        if (msg != null) {
            LaunchedEffect(msg.id) { delay(2500); viewModel.clearClassMessage() }
            Snackbar(
                modifier = Modifier.align(Alignment.BottomCenter).padding(16.dp),
                containerColor = Surface2,
                contentColor = Color.White,
            ) { Text(msg.text) }
        }
    }

    val pendingClass = state.pendingBookClass
    if (pendingClass != null && state.availableCards.isNotEmpty()) {
        CardPickerDialog(
            title = "选择会员卡",
            subtitle = pendingClass.courseName,
            cards = state.availableCards,
            onSelect = { viewModel.confirmBookGroupClass(it) },
            onDismiss = { viewModel.dismissBookDialog() },
        )
    }
}

@Composable
internal fun ErrorView(message: String, onRetry: () -> Unit) {
    Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.padding(32.dp)) {
            Text(message, color = Red, style = MaterialTheme.typography.bodyMedium)
            Spacer(Modifier.height(16.dp))
            OutlinedButton(
                onClick = onRetry,
                border = androidx.compose.foundation.BorderStroke(1.dp, Red),
                colors = ButtonDefaults.outlinedButtonColors(contentColor = Red),
            ) {
                Icon(Icons.Default.Refresh, null)
                Spacer(Modifier.width(6.dp))
                Text("重试")
            }
        }
    }
}

private val dateFmt = DateTimeFormatter.ofPattern("M月d日 E")

@Composable
private fun DateHeader(date: LocalDate, today: LocalDate) {
    val label = when (date) {
        today            -> "今天  ${date.format(dateFmt)}"
        today.plusDays(1) -> "明天  ${date.format(dateFmt)}"
        else              -> date.format(dateFmt)
    }
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color(0xCC000000))
            .padding(horizontal = 2.dp, vertical = 8.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(8.dp),
    ) {
        Box(modifier = Modifier.width(3.dp).height(16.dp).background(Red))
        Text(
            label,
            style = MaterialTheme.typography.labelLarge,
            color = Red,
        )
    }
}

@Composable
private fun CombatChip(label: String, selected: Boolean, onClick: () -> Unit) {
    FilterChip(
        selected = selected,
        onClick = onClick,
        label = { Text(label, style = MaterialTheme.typography.labelMedium) },
        colors = FilterChipDefaults.filterChipColors(
            selectedContainerColor = RedGlow,
            selectedLabelColor = Red,
            containerColor = Surface2,
            labelColor = Grey2,
        ),
        border = FilterChipDefaults.filterChipBorder(
            enabled = true,
            selected = selected,
            borderColor = Border,
            selectedBorderColor = Red,
            borderWidth = 1.dp,
            selectedBorderWidth = 1.dp,
        ),
    )
}

@Composable
private fun GroupClassCard(cls: GroupClass, onBook: () -> Unit, onCancel: () -> Unit) {
    val isFull   = cls.bookingNum >= cls.capacity
    val isBooked = cls.myBooking == 1
    val fill     = if (cls.capacity > 0) cls.bookingNum.toFloat() / cls.capacity else 0f

    val accent = when {
        isBooked -> Green
        isFull   -> Grey3
        else     -> Red
    }
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(8.dp))
            .background(Color(0xE60F0F0F))
            .border(1.dp, if (isBooked) Green.copy(alpha = 0.4f) else Border, RoundedCornerShape(8.dp)),
    ) {
        Row(modifier = Modifier.fillMaxWidth()) {
            // Left accent bar
            Box(
                modifier = Modifier
                    .width(3.dp)
                    .height(96.dp)
                    .background(accent),
            )

            Column(modifier = Modifier.weight(1f).padding(start = 12.dp, top = 12.dp, end = 12.dp, bottom = 10.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.Top,
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            cls.courseName,
                            style = MaterialTheme.typography.titleMedium,
                            color = Color.White,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis,
                        )
                        Spacer(Modifier.height(3.dp))
                        Text(
                            "${cls.startTime.toDisplayDateTime()} – ${cls.endTime.toDisplayTime()}",
                            style = MaterialTheme.typography.bodySmall,
                            color = Grey2,
                        )
                        if (cls.coaches.isNotEmpty()) {
                            Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.padding(top = 2.dp)) {
                                Icon(Icons.Default.Person, null, Modifier.size(12.dp), tint = Grey3)
                                Spacer(Modifier.width(3.dp))
                                Text(
                                    cls.coaches.joinToString(" / ") { it.name },
                                    style = MaterialTheme.typography.bodySmall,
                                    color = Grey3,
                                )
                            }
                        }
                    }

                    Column(horizontalAlignment = Alignment.End, modifier = Modifier.padding(start = 10.dp)) {
                        Text(
                            "${cls.bookingNum}/${cls.capacity}",
                            style = MaterialTheme.typography.labelMedium,
                            color = accent,
                            fontWeight = FontWeight.Bold,
                        )
                        Spacer(Modifier.height(6.dp))
                        when {
                            isBooked -> OutlinedButton(
                                onClick = onCancel,
                                modifier = Modifier.height(30.dp),
                                contentPadding = androidx.compose.foundation.layout.PaddingValues(horizontal = 10.dp, vertical = 0.dp),
                                border = androidx.compose.foundation.BorderStroke(1.dp, Green.copy(alpha = 0.6f)),
                                colors = ButtonDefaults.outlinedButtonColors(contentColor = Green),
                            ) { Text("取消", fontSize = 12.sp) }

                            isFull -> Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(4.dp))
                                    .background(Surface3)
                                    .padding(horizontal = 12.dp, vertical = 6.dp),
                            ) { Text("已满", fontSize = 12.sp, color = Grey3) }

                            else -> Button(
                                onClick = onBook,
                                modifier = Modifier.height(30.dp),
                                contentPadding = androidx.compose.foundation.layout.PaddingValues(horizontal = 12.dp, vertical = 0.dp),
                                colors = ButtonDefaults.buttonColors(containerColor = Red, contentColor = Color.White),
                                shape = RoundedCornerShape(4.dp),
                            ) { Text("预约", fontSize = 12.sp) }
                        }
                    }
                }

                Spacer(Modifier.height(8.dp))
                LinearProgressIndicator(
                    progress = { fill },
                    modifier = Modifier.fillMaxWidth().height(2.dp).clip(RoundedCornerShape(1.dp)),
                    color = accent,
                    trackColor = Surface3,
                )
            }
        }
    }
}

@Composable
fun CardPickerDialog(
    title: String,
    subtitle: String = "",
    cards: List<MemberCard>,
    onSelect: (MemberCard) -> Unit,
    onDismiss: () -> Unit,
) {
    AlertDialog(
        onDismissRequest = onDismiss,
        containerColor = Color(0xF00F0F0F),
        titleContentColor = Color.White,
        textContentColor = Grey2,
        title = { Text(title, fontWeight = FontWeight.Bold) },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                if (subtitle.isNotBlank()) {
                    Text(subtitle, style = MaterialTheme.typography.bodyMedium, color = Grey2)
                    Spacer(Modifier.height(4.dp))
                }
                cards.forEach { card ->
                    Surface(
                        onClick = { onSelect(card) },
                        shape = RoundedCornerShape(6.dp),
                        color = Surface2,
                        modifier = Modifier.fillMaxWidth().border(1.dp, Border, RoundedCornerShape(6.dp)),
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 14.dp, vertical = 12.dp),
                            verticalAlignment = Alignment.CenterVertically,
                        ) {
                            Text(card.name, color = Color.White, fontWeight = FontWeight.Medium, modifier = Modifier.weight(1f))
                            Text("余 ${card.balance}", color = Red, fontWeight = FontWeight.Bold,
                                style = MaterialTheme.typography.labelMedium)
                        }
                    }
                }
            }
        },
        confirmButton = {},
        dismissButton = {
            TextButton(onClick = onDismiss) { Text("取消", color = Grey2) }
        },
    )
}
