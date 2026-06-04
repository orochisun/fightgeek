package com.ssj.geekfight.ui.screen

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
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
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ExposedDropdownMenuBox
import androidx.compose.material3.ExposedDropdownMenuDefaults
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.MenuDefaults
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Snackbar
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.material3.TextFieldDefaults
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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.ssj.geekfight.api.COACH_LIST
import com.ssj.geekfight.api.PtSlot
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

    var dropdownExpanded by remember { mutableStateOf(false) }

    val query = state.coachQuery
    val filteredCoaches = remember(query) {
        if (query.isBlank()) COACH_LIST
        else COACH_LIST.filter {
            it.name.contains(query, ignoreCase = true) || it.id.toString().startsWith(query.trim())
        }
    }

    Box(modifier = Modifier.fillMaxSize()) {
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = androidx.compose.foundation.layout.PaddingValues(bottom = 80.dp),
        ) {

            // Header hint
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

            // Coach dropdown
            item {
                SectionLabel("COACH")
                ExposedDropdownMenuBox(
                    expanded = dropdownExpanded && filteredCoaches.isNotEmpty(),
                    onExpandedChange = { dropdownExpanded = it },
                    modifier = Modifier.padding(horizontal = 14.dp, vertical = 4.dp),
                ) {
                    TextField(
                        value = query,
                        onValueChange = { viewModel.setPtCoachQuery(it); dropdownExpanded = true },
                        placeholder = { Text("名字或 ID，如 Jay / 157", color = Grey3) },
                        singleLine = true,
                        trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = dropdownExpanded) },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Text, imeAction = ImeAction.Done),
                        keyboardActions = KeyboardActions(onDone = { dropdownExpanded = false; viewModel.confirmPtCoachId() }),
                        colors = TextFieldDefaults.colors(
                            focusedContainerColor = Surface2,
                            unfocusedContainerColor = Surface,
                            focusedTextColor = Color.White,
                            unfocusedTextColor = Color.White,
                            cursorColor = Red,
                            focusedIndicatorColor = Red,
                            unfocusedIndicatorColor = Border,
                        ),
                        modifier = Modifier.menuAnchor().fillMaxWidth(),
                    )
                    ExposedDropdownMenu(
                        expanded = dropdownExpanded && filteredCoaches.isNotEmpty(),
                        onDismissRequest = { dropdownExpanded = false },
                        modifier = Modifier.background(Surface2),
                    ) {
                        filteredCoaches.forEach { coach ->
                            DropdownMenuItem(
                                text = {
                                    Row(modifier = Modifier.fillMaxWidth()) {
                                        Text(coach.name, color = Color.White, modifier = Modifier.weight(1f))
                                        Text(coach.id.toString(), color = Grey3, style = MaterialTheme.typography.bodySmall)
                                    }
                                },
                                onClick = { dropdownExpanded = false; viewModel.selectPtCoach(coach) },
                                colors = MenuDefaults.itemColors(textColor = Color.White),
                            )
                        }
                    }
                }

                if (state.coachId != null) {
                    Box(
                        modifier = Modifier.padding(horizontal = 14.dp, vertical = 2.dp)
                            .clip(RoundedCornerShape(4.dp))
                            .background(RedGlow)
                            .padding(horizontal = 10.dp, vertical = 4.dp),
                    ) {
                        Text(
                            "✓  ${state.coachName}  (${state.coachId})",
                            color = Red,
                            fontWeight = FontWeight.Bold,
                            style = MaterialTheme.typography.labelMedium,
                        )
                    }
                    Spacer(Modifier.height(4.dp))
                }
            }

            // Date picker
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

            // Slots
            if (state.slots.isNotEmpty()) {
                val available = state.slots.filter { it.available }
                item { SectionLabel("可约时段  ${available.size}/${state.slots.size}") }
                if (available.isEmpty()) {
                    item {
                        Box(Modifier.fillMaxWidth().padding(16.dp), contentAlignment = Alignment.Center) {
                            Text("当日无可约时段", color = Grey3)
                        }
                    }
                } else {
                    items(available, key = { it.startTime }) { slot ->
                        PtSlotRow(slot = slot, onBook = { viewModel.requestPtBook(slot) })
                    }
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
private fun SectionLabel(text: String) {
    Text(
        text = text,
        style = MaterialTheme.typography.labelLarge,
        color = Red,
        modifier = Modifier.padding(start = 16.dp, top = 14.dp, bottom = 4.dp),
    )
}

@Composable
private fun PtSlotRow(slot: PtSlot, onBook: () -> Unit) {
    Box(
        modifier = Modifier.fillMaxWidth().padding(horizontal = 14.dp, vertical = 4.dp)
            .clip(RoundedCornerShape(6.dp))
            .background(Color(0xE60F0F0F))
            .border(1.dp, Border, RoundedCornerShape(6.dp)),
    ) {
        Row(
            modifier = Modifier.fillMaxWidth().padding(horizontal = 14.dp, vertical = 10.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween,
        ) {
            Text(
                "${slot.startTime.toDisplayTime()} – ${slot.endTime.toDisplayTime()}",
                style = MaterialTheme.typography.bodyMedium,
                color = Color.White,
                fontWeight = FontWeight.Medium,
            )
            Button(
                onClick = onBook,
                modifier = Modifier.height(30.dp),
                contentPadding = androidx.compose.foundation.layout.PaddingValues(horizontal = 14.dp, vertical = 0.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Red, contentColor = Color.White),
                shape = RoundedCornerShape(4.dp),
            ) { Text("预约", fontSize = 12.sp, fontWeight = FontWeight.Bold) }
        }
    }
}
