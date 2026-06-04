package com.ssj.geekfight.ui.screen

import android.graphics.BitmapFactory
import android.util.Base64
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.QrCode
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Snackbar
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.ssj.geekfight.api.BookingRecord
import com.ssj.geekfight.api.BookingRecordType
import com.ssj.geekfight.api.BookingStatus
import com.ssj.geekfight.ui.theme.Border
import com.ssj.geekfight.ui.theme.Green
import com.ssj.geekfight.ui.theme.GreenGlow
import com.ssj.geekfight.ui.theme.Grey2
import com.ssj.geekfight.ui.theme.Grey3
import com.ssj.geekfight.ui.theme.Orange
import com.ssj.geekfight.ui.theme.OrangeGlow
import com.ssj.geekfight.ui.theme.Red
import com.ssj.geekfight.ui.theme.RedGlow
import com.ssj.geekfight.ui.theme.Surface
import com.ssj.geekfight.ui.theme.Surface2
import com.ssj.geekfight.ui.theme.Surface3
import com.ssj.geekfight.viewmodel.AppViewModel
import com.ssj.geekfight.viewmodel.toDisplayDateTime
import kotlinx.coroutines.delay

private val MONTHS = (1..12).map { it }

@Composable
fun RecordsScreen(viewModel: AppViewModel) {
    val state by viewModel.recordsState.collectAsState()
    LaunchedEffect(Unit) { viewModel.initRecords() }

    Box(modifier = Modifier.fillMaxSize()) {
        Column(modifier = Modifier.fillMaxSize()) {

            LazyRow(
                modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                items(MONTHS) { month ->
                    FilterChip(
                        selected = state.month == month,
                        onClick = { viewModel.loadRecords(state.year, month) },
                        label = { Text("${month}月", style = MaterialTheme.typography.labelMedium) },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = RedGlow,
                            selectedLabelColor = Red,
                            containerColor = Surface2,
                            labelColor = Grey2,
                        ),
                        border = FilterChipDefaults.filterChipBorder(
                            enabled = true, selected = state.month == month,
                            borderColor = Border, selectedBorderColor = Red,
                            borderWidth = 1.dp, selectedBorderWidth = 1.dp,
                        ),
                    )
                }
            }

            when {
                state.isLoading -> Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    CircularProgressIndicator(color = Red)
                }
                state.error != null -> ErrorView(state.error!!) { viewModel.initRecords() }
                state.records.isEmpty() -> Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    Text("${state.month}月暂无记录", color = Grey3)
                }
                else -> LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    verticalArrangement = Arrangement.spacedBy(10.dp),
                    contentPadding = androidx.compose.foundation.layout.PaddingValues(
                        horizontal = 14.dp, vertical = 10.dp,
                    ),
                ) {
                    items(state.records, key = { it.id }) { record ->
                        RecordCard(
                            record = record,
                            onCancel = { viewModel.cancelRecord(record) },
                            onQrCode = { viewModel.showQrCode(record) },
                        )
                    }
                }
            }
        }

        val msg = state.message
        if (msg != null) {
            LaunchedEffect(msg.id) { delay(2500); viewModel.clearRecordsMessage() }
            Snackbar(
                modifier = Modifier.align(Alignment.BottomCenter).padding(16.dp),
                containerColor = Surface2, contentColor = Color.White,
            ) { Text(msg.text) }
        }
    }

    state.qrCodeTarget?.let { record ->
        QrDialog(record = record, qrCodeBase64 = state.qrCodeBase64, onDismiss = { viewModel.dismissQrCode() })
    }
}

@Composable
private fun RecordCard(record: BookingRecord, onCancel: () -> Unit, onQrCode: () -> Unit) {
    val isActive    = record.status == BookingStatus.ACTIVE.value
    val isCheckedIn = record.status == BookingStatus.CHECKED_IN.value
    val isPt        = record.type == BookingRecordType.PT.value

    val accentColor = when {
        isCheckedIn -> Green
        isActive    -> Red
        else        -> Grey3
    }
    val accentGlow = when {
        isCheckedIn -> GreenGlow
        isActive    -> RedGlow
        else        -> Color.Transparent
    }

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(8.dp))
            .background(Color(0xE60F0F0F))
            .border(1.dp, accentColor.copy(alpha = 0.25f), RoundedCornerShape(8.dp)),
    ) {
        Column {
            // Top accent line
            Box(modifier = Modifier.fillMaxWidth().height(2.dp).background(accentColor))

            Column(modifier = Modifier.padding(12.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween,
                ) {
                    Text(
                        record.courseName,
                        style = MaterialTheme.typography.titleMedium,
                        color = Color.White,
                        modifier = Modifier.weight(1f),
                    )
                    Row(horizontalArrangement = Arrangement.spacedBy(5.dp)) {
                        Pill(if (isPt) "私教" else "团课", if (isPt) OrangeGlow to Orange else RedGlow to Red)
                        Pill(
                            when { isCheckedIn -> "已签到"; isActive -> "已预约"; else -> "已取消" },
                            accentGlow to accentColor,
                        )
                    }
                }

                Spacer(Modifier.height(6.dp))
                Text(record.startTime.toDisplayDateTime() + "  ·  ${record.duration}min",
                    style = MaterialTheme.typography.bodySmall, color = Grey2)
                Text(record.storeName, style = MaterialTheme.typography.bodySmall, color = Grey3)

                val extras = listOfNotNull(
                    record.coach?.name?.let { "教练 $it" },
                    record.cardName?.let { "卡：$it" },
                )
                if (extras.isNotEmpty()) {
                    Text(extras.joinToString("  ·  "),
                        style = MaterialTheme.typography.bodySmall, color = Grey3)
                }

                if (isActive) {
                    Spacer(Modifier.height(10.dp))
                    Box(modifier = Modifier.fillMaxWidth().height(1.dp).background(Border))
                    Spacer(Modifier.height(6.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.End,
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        IconButton(onClick = onQrCode, modifier = Modifier.size(36.dp)) {
                            Icon(Icons.Default.QrCode, "二维码", tint = Grey2, modifier = Modifier.size(20.dp))
                        }
                        Spacer(Modifier.width(6.dp))
                        OutlinedButton(
                            onClick = onCancel,
                            modifier = Modifier.height(30.dp),
                            contentPadding = androidx.compose.foundation.layout.PaddingValues(horizontal = 12.dp, vertical = 0.dp),
                            border = androidx.compose.foundation.BorderStroke(1.dp, Red.copy(alpha = 0.6f)),
                            colors = ButtonDefaults.outlinedButtonColors(contentColor = Red),
                        ) { Text("取消预约", fontSize = 12.sp) }
                    }
                }
            }
        }
    }
}

@Composable
private fun Pill(label: String, colors: Pair<Color, Color>) {
    val (bg, fg) = colors
    Box(
        modifier = Modifier
            .clip(RoundedCornerShape(3.dp))
            .background(bg)
            .padding(horizontal = 6.dp, vertical = 2.dp),
    ) {
        Text(label, style = MaterialTheme.typography.labelSmall, color = fg, fontWeight = FontWeight.Bold)
    }
}

@Composable
private fun QrDialog(record: BookingRecord, qrCodeBase64: String?, onDismiss: () -> Unit) {
    AlertDialog(
        onDismissRequest = onDismiss,
        containerColor = Color(0xF00F0F0F),
        titleContentColor = Color.White,
        textContentColor = Grey2,
        title = { Text("签到二维码", fontWeight = FontWeight.Bold) },
        text = {
            Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.fillMaxWidth()) {
                Text(record.courseName, color = Color.White, fontWeight = FontWeight.Medium)
                Text(record.startTime.toDisplayDateTime(), style = MaterialTheme.typography.bodySmall, color = Grey2)
                Spacer(Modifier.height(16.dp))

                val bitmap = remember(qrCodeBase64) {
                    qrCodeBase64?.let { b64 ->
                        runCatching {
                            val bytes = Base64.decode(b64, Base64.DEFAULT)
                            BitmapFactory.decodeByteArray(bytes, 0, bytes.size)?.asImageBitmap()
                        }.getOrNull()
                    }
                }

                Box(
                    modifier = Modifier.size(200.dp).clip(RoundedCornerShape(8.dp)).background(Surface2)
                        .border(1.dp, Border, RoundedCornerShape(8.dp)),
                    contentAlignment = Alignment.Center,
                ) {
                    when {
                        bitmap != null -> Image(bitmap, "QR", modifier = Modifier.size(185.dp))
                        qrCodeBase64 == null -> CircularProgressIndicator(color = Red, modifier = Modifier.size(40.dp))
                        else -> Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Icon(Icons.Default.QrCode, null, Modifier.size(64.dp), tint = Grey3)
                            Text("ID: ${record.id}", style = MaterialTheme.typography.labelSmall, color = Grey3)
                        }
                    }
                }
            }
        },
        confirmButton = {},
        dismissButton = { TextButton(onClick = onDismiss) { Text("关闭", color = Grey2) } },
    )
}
