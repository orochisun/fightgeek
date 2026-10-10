package com.ssj.geekfight.ui.screen

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.selection.SelectionContainer
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowDropDown
import androidx.compose.material3.Button
import androidx.compose.material3.Checkbox
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateMapOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.ssj.geekfight.api.OfficeApi
import com.ssj.geekfight.api.OfficeCatalog
import com.ssj.geekfight.ui.theme.Grey2
import com.ssj.geekfight.ui.theme.Grey3
import com.ssj.geekfight.ui.theme.Red
import com.ssj.geekfight.ui.theme.Surface2
import com.ssj.geekfight.viewmodel.AppViewModel
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.time.ZoneId
import java.time.ZonedDateTime
import java.time.LocalDate

private val OFFICE_ZONE = ZoneId.of("Asia/Shanghai")

@Composable
fun OfficeScreen(viewModel: AppViewModel) {
    val tokenState by viewModel.tokenState.collectAsState()
    val api = remember { OfficeApi() }
    val scope = rememberCoroutineScope()
    val inputs = remember { mutableStateMapOf<String, String>() }

    var selectedIndex by rememberSaveable { mutableIntStateOf(0) } // 我的教练课表
    var endpointMenuOpen by remember { mutableStateOf(false) }
    var converterExpanded by rememberSaveable { mutableStateOf(false) }
    var storeMenuOpen by remember { mutableStateOf(false) }
    var scheduleWeek by rememberSaveable {
        val today = LocalDate.now(OFFICE_ZONE)
        mutableStateOf(today.minusDays((today.dayOfWeek.value - 1).toLong()).toString())
    }
    var scheduleWeeks by rememberSaveable { mutableStateOf("2") }
    var scheduleCoachId by rememberSaveable { mutableStateOf("") }
    var ptOnly by rememberSaveable { mutableStateOf(false) }
    var rawSchedule by rememberSaveable { mutableStateOf(false) }
    var loading by remember { mutableStateOf(false) }
    var httpStatus by remember { mutableStateOf<Int?>(null) }
    var resultTitle by remember { mutableStateOf("") }
    var resultText by remember { mutableStateOf("") }
    var errorText by remember { mutableStateOf<String?>(null) }

    val endpoint = OfficeCatalog.endpoints[selectedIndex]
    val initialNow = remember(endpoint.key) { ZonedDateTime.now(OFFICE_ZONE) }
    fun fieldValue(field: String): String =
        inputs["${endpoint.key}:$field"] ?: OfficeCatalog.defaultValue(endpoint, field, initialNow)

    Column(
        modifier = Modifier.fillMaxSize().verticalScroll(rememberScrollState())
            .padding(horizontal = 16.dp, vertical = 16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        Text("OFFICE", style = MaterialTheme.typography.titleMedium, color = Red, fontWeight = FontWeight.Bold)
        Text("课表、报表与统计接口 · 参数可直接修改", color = Grey2, style = MaterialTheme.typography.bodySmall)
        Text(
            if (tokenState.token.isNotBlank()) "使用「Token」页已保存的用户 Token"
            else "请先在「Token」页保存用户 Token",
            color = if (tokenState.token.isNotBlank()) Grey2 else Red,
            style = MaterialTheme.typography.bodySmall,
        )

        OutlinedButton(
            onClick = { converterExpanded = !converterExpanded },
            modifier = Modifier.fillMaxWidth(),
        ) {
            Text("时间戳转换器", modifier = Modifier.weight(1f))
            Text(if (converterExpanded) "收起" else "展开")
        }
        if (converterExpanded) TimestampConverter()
        HorizontalDivider(color = Surface2)

        Box {
            OutlinedButton(onClick = { endpointMenuOpen = true }, modifier = Modifier.fillMaxWidth()) {
                Text(endpoint.label, modifier = Modifier.weight(1f))
                Icon(Icons.Default.ArrowDropDown, contentDescription = "选择接口")
            }
            DropdownMenu(expanded = endpointMenuOpen, onDismissRequest = { endpointMenuOpen = false }) {
                OfficeCatalog.endpoints.forEachIndexed { index, item ->
                    DropdownMenuItem(
                        text = { Text(item.label) },
                        onClick = {
                            selectedIndex = index
                            endpointMenuOpen = false
                            storeMenuOpen = false
                        },
                    )
                }
            }
        }
        Text("${endpoint.method} ${endpoint.displayPath}", color = Grey3,
            fontFamily = FontFamily.Monospace, fontSize = 11.sp)

        if (endpoint.key == "class-bookings") {
            OfficeClassBookings(api, tokenState.token)
        } else {

        if (endpoint.key == "coach-schedule") {
            OutlinedTextField(
                value = scheduleWeek,
                onValueChange = { scheduleWeek = it },
                label = { Text("起始周日期 · YYYY-MM-DD") },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true,
                supportingText = { Text("填该周任意一天；请求从周一开始") },
            )
            OutlinedTextField(
                value = scheduleWeeks,
                onValueChange = { scheduleWeeks = it },
                label = { Text("连续周数 · 1–8") },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true,
            )
            OutlinedTextField(
                value = scheduleCoachId,
                onValueChange = { scheduleCoachId = it },
                label = { Text("教练 ID · 可留空") },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true,
                supportingText = { Text("留空时先从 Office /user/detail 查询当前职员 ID") },
            )
            Row { Checkbox(checked = ptOnly, onCheckedChange = { ptOnly = it }); Text("只看私教", modifier = Modifier.padding(top = 12.dp)) }
            Row { Checkbox(checked = rawSchedule, onCheckedChange = { rawSchedule = it }); Text("显示原始 JSON", modifier = Modifier.padding(top = 12.dp)) }
        } else endpoint.fields.forEach { field ->
            val inputKey = "${endpoint.key}:$field"
            val value = fieldValue(field)
            OutlinedTextField(
                value = value,
                onValueChange = { inputs[inputKey] = it },
                label = { Text(field) },
                modifier = Modifier.fillMaxWidth(),
                singleLine = field != "queryParam",
                minLines = if (field == "queryParam") 2 else 1,
                supportingText = {
                    when (field) {
                        "storeId" -> {
                            val id = value.trim().removePrefix("[").removeSuffix("]")
                            Text(OfficeCatalog.stores[id] ?: "可点下方“选门店”查看 ID")
                        }
                        "from", "to", "startTime", "endTime" -> Text("北京时间对应的 Unix 秒")
                        "queryParam" -> Text("填写 JSON，例如 {\"storeId\":1101013}")
                        else -> Unit
                    }
                },
            )
            if (field == "storeId") {
                Box {
                    TextButton(onClick = { storeMenuOpen = true }) { Text("选门店") }
                    DropdownMenu(expanded = storeMenuOpen, onDismissRequest = { storeMenuOpen = false }) {
                        OfficeCatalog.stores.forEach { (id, name) ->
                            DropdownMenuItem(
                                text = { Text("$name · $id") },
                                onClick = {
                                    inputs[inputKey] = if (endpoint.key == "dashboard-detail") "[$id]" else id
                                    storeMenuOpen = false
                                },
                            )
                        }
                    }
                }
            }
        }

        val hasRange = ("from" in endpoint.fields && "to" in endpoint.fields) ||
            ("startTime" in endpoint.fields && "endTime" in endpoint.fields)
        if (hasRange) {
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                OutlinedButton(onClick = {
                    OfficeCatalog.range(endpoint).forEach { (key, value) -> inputs["${endpoint.key}:$key"] = value }
                }) { Text("本月") }
                OutlinedButton(onClick = {
                    OfficeCatalog.range(endpoint, yearsBack = 1).forEach { (key, value) -> inputs["${endpoint.key}:$key"] = value }
                }) { Text("近一年") }
            }
        }

        Button(
            onClick = {
                val tokenToUse = tokenState.token.trim()
                if (tokenToUse.isBlank()) {
                    errorText = "请先在「Token」页保存用户 Token"
                    return@Button
                }
                val isSchedule = endpoint.key == "coach-schedule"
                val weekDate = if (isSchedule) runCatching { LocalDate.parse(scheduleWeek.trim()) }.getOrNull() else null
                val weekCount = if (isSchedule) scheduleWeeks.trim().toIntOrNull() else null
                val manualCoachId = scheduleCoachId.trim().takeIf { it.isNotEmpty() }?.toIntOrNull()
                if (isSchedule && weekDate == null) {
                    errorText = "起始周日期请填 YYYY-MM-DD"
                    return@Button
                }
                if (isSchedule && (weekCount == null || weekCount !in 1..8)) {
                    errorText = "连续周数必须为 1–8"
                    return@Button
                }
                if (isSchedule && scheduleCoachId.isNotBlank() && (manualCoachId == null || manualCoachId <= 0)) {
                    errorText = "教练 ID 必须是正整数，或留空自动获取"
                    return@Button
                }
                val requestValues = if (isSchedule) emptyMap() else endpoint.fields.associateWith { fieldValue(it) }
                val ptOnlyValue = ptOnly
                val rawScheduleValue = rawSchedule
                resultTitle = endpoint.label
                resultText = ""
                httpStatus = null
                errorText = null
                loading = true
                scope.launch {
                    try {
                        val response = withContext(Dispatchers.IO) {
                            if (isSchedule) api.coachSchedule(
                                tokenToUse, weekDate!!, weekCount!!, manualCoachId, ptOnlyValue, rawScheduleValue,
                            ) else api.request(endpoint, tokenToUse, requestValues)
                        }
                        httpStatus = response.status
                        resultText = response.text
                    } catch (e: Exception) {
                        errorText = e.message ?: e.javaClass.simpleName
                    } finally {
                        loading = false
                    }
                }
            },
            enabled = !loading,
            modifier = Modifier.fillMaxWidth(),
        ) { Text(if (loading) "请求中…" else "发送请求") }

        if (loading) CircularProgressIndicator(color = Red)
        errorText?.let { Text(it, color = Red, style = MaterialTheme.typography.bodyMedium) }
        if (httpStatus != null || resultText.isNotEmpty()) {
            val status = httpStatus
            Text("$resultTitle · HTTP $status", color = if (status != null && status in 200..299) Color.White else Red,
                style = MaterialTheme.typography.titleSmall)
            SelectionContainer {
                Text(
                    resultText,
                    modifier = Modifier.fillMaxWidth().background(Surface2).padding(12.dp),
                    color = Color.White,
                    fontFamily = FontFamily.Monospace,
                    fontSize = 12.sp,
                    lineHeight = 18.sp,
                )
            }
        }
        }
    }
}
