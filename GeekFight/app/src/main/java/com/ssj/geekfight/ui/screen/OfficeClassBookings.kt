package com.ssj.geekfight.ui.screen

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.text.selection.SelectionContainer
import androidx.compose.material3.Button
import androidx.compose.material3.Checkbox
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import com.ssj.geekfight.api.OfficeApi
import com.ssj.geekfight.api.OfficeCatalog
import com.ssj.geekfight.ui.theme.Grey2
import com.ssj.geekfight.ui.theme.Grey3
import com.ssj.geekfight.ui.theme.Red
import com.ssj.geekfight.ui.theme.Surface2
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneId
import java.time.format.DateTimeFormatter

private val BOOKING_ZONE = ZoneId.of("Asia/Shanghai")
private val BOOKING_TIME_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")

private fun bookingTime(epoch: Long): String = runCatching {
    BOOKING_TIME_FORMAT.format(Instant.ofEpochSecond(epoch).atZone(BOOKING_ZONE))
}.getOrDefault("时间未提供")

private fun bookingRows(body: JSONObject): List<JSONObject> {
    val list = body.optJSONObject("data")?.optJSONArray("list")
        ?: error("接口未返回 data.list 数组：${body.toString(2)}")
    return (0 until list.length()).map { index ->
        list.optJSONObject(index) ?: error("第 ${index + 1} 条记录格式无效：${body.toString(2)}")
    }
}

@Composable
internal fun OfficeClassBookings(api: OfficeApi, token: String) {
    val scope = rememberCoroutineScope()
    var storeId by rememberSaveable { mutableStateOf("1101013") }
    var startDate by rememberSaveable { mutableStateOf(LocalDate.now(BOOKING_ZONE).toString()) }
    var classId by rememberSaveable { mutableStateOf("") }
    var pageSize by rememberSaveable { mutableStateOf("100") }
    var lastId by rememberSaveable { mutableStateOf("0") }
    var showAll by rememberSaveable { mutableStateOf(false) }
    var rawJson by rememberSaveable { mutableStateOf(false) }
    var storeMenuOpen by remember { mutableStateOf(false) }
    var showClasses by remember { mutableStateOf(false) }
    var classes by remember { mutableStateOf<List<JSONObject>>(emptyList()) }
    var selectedClass by remember { mutableStateOf<JSONObject?>(null) }
    var bookings by remember { mutableStateOf<List<JSONObject>>(emptyList()) }
    var response by remember { mutableStateOf<JSONObject?>(null) }
    var resultClassId by remember { mutableStateOf("") }
    var resultPageSize by remember { mutableStateOf(100) }
    var classListResponse by remember { mutableStateOf<JSONObject?>(null) }
    var loading by remember { mutableStateOf(false) }
    var errorText by remember { mutableStateOf<String?>(null) }

    fun requireToken(): String = token.trim().also {
        require(it.isNotEmpty()) { "请先在「Token」页保存用户 Token" }
    }

    fun queryBookings(idText: String) {
        if (loading) return
        try {
            val requestToken = requireToken()
            val id = idText.trim().toIntOrNull()?.takeIf { it > 0 }
                ?: error("请输入有效的团课场次 ID")
            val size = pageSize.trim().toIntOrNull()?.takeIf { it > 0 }
                ?: error("请求条数必须为正整数")
            val cursor = lastId.trim().toIntOrNull()?.takeIf { it >= 0 }
                ?: error("分页游标必须为非负整数")
            loading = true
            errorText = null
            response = null
            bookings = emptyList()
            scope.launch {
                try {
                    val body = withContext(Dispatchers.IO) { api.classBookings(requestToken, id, size, cursor) }
                    bookings = bookingRows(body)
                    response = body
                    resultClassId = id.toString()
                    resultPageSize = size
                } catch (e: CancellationException) {
                    throw e
                } catch (e: Exception) {
                    errorText = e.message ?: e.javaClass.simpleName
                } finally {
                    loading = false
                }
            }
        } catch (e: Exception) {
            errorText = e.message ?: e.javaClass.simpleName
        }
    }

    Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
        Text("先查团课，点击课程即可查看预约名单；也可直接填写场次 ID。", color = Grey2,
            style = MaterialTheme.typography.bodySmall)
        Text("团课列表：GET /fg/management/v1/class/list", color = Grey3,
            style = MaterialTheme.typography.labelSmall)
        OutlinedTextField(
            value = storeId,
            onValueChange = {
                storeId = it
                classes = emptyList()
                classListResponse = null
            },
            label = { Text("门店 ID") },
            supportingText = { Text(OfficeCatalog.stores[storeId.trim()] ?: "手填 ID 或从下方选择门店") },
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
            enabled = !loading, singleLine = true, modifier = Modifier.fillMaxWidth(),
        )
        Box {
            TextButton(onClick = { storeMenuOpen = true }, enabled = !loading) { Text("选择门店") }
            DropdownMenu(expanded = storeMenuOpen, onDismissRequest = { storeMenuOpen = false }) {
                OfficeCatalog.stores.forEach { (id, name) ->
                    DropdownMenuItem(text = { Text("$name · $id") }, onClick = {
                        storeId = id
                        storeMenuOpen = false
                        classes = emptyList()
                        classListResponse = null
                    })
                }
            }
        }
        OutlinedTextField(
            value = startDate,
            onValueChange = { startDate = it; classes = emptyList(); classListResponse = null },
            label = { Text("起始日期 · YYYY-MM-DD") },
            supportingText = {
                val day = runCatching { LocalDate.parse(startDate.trim()) }.getOrNull()
                val monday = day?.minusDays((day.dayOfWeek.value - 1).toLong())
                Text(if (monday != null) "显示 $day 至 ${monday.plusDays(6)} 的课程" else "填写起始日期，显示从该日到所在周周日的课程")
            },
            enabled = !loading, singleLine = true, modifier = Modifier.fillMaxWidth(),
        )
        Button(onClick = {
            try {
                val requestToken = requireToken()
                val id = storeId.trim().toIntOrNull()?.takeIf { it > 0 } ?: error("门店 ID 必须为正整数")
                val date = runCatching { LocalDate.parse(startDate.trim()) }.getOrNull() ?: error("日期请填 YYYY-MM-DD")
                loading = true
                errorText = null
                classes = emptyList()
                classListResponse = null
                response = null
                selectedClass = null
                scope.launch {
                    try {
                        val body = withContext(Dispatchers.IO) { api.groupClasses(requestToken, id, date) }
                        val firstTime = date.atStartOfDay(BOOKING_ZONE).toEpochSecond()
                        classes = bookingRows(body).filter { it.optLong("startTime") >= firstTime }
                            .sortedBy { it.optLong("startTime") }
                        classListResponse = body
                        showClasses = true
                    } catch (e: CancellationException) {
                        throw e
                    } catch (e: Exception) {
                        errorText = e.message ?: e.javaClass.simpleName
                    } finally {
                        loading = false
                    }
                }
            } catch (e: Exception) {
                errorText = e.message ?: e.javaClass.simpleName
            }
        }, enabled = !loading, modifier = Modifier.fillMaxWidth()) { Text("查询团课列表") }

        if (classListResponse != null) {
            TextButton(onClick = { showClasses = !showClasses }) {
                Text("返回 ${classes.size} 节团课 · ${if (showClasses) "收起列表" else "选择课程"}")
            }
            if (classes.isEmpty()) Text("接口返回的团课列表为空，可更换门店或日期。", color = Grey2)
            if (showClasses) classes.forEach { item ->
                OutlinedButton(onClick = {
                    classId = item.optInt("id").toString()
                    selectedClass = item
                    lastId = "0"
                    showClasses = false
                    queryBookings(classId)
                }, enabled = !loading, modifier = Modifier.fillMaxWidth()) {
                    Column(modifier = Modifier.fillMaxWidth()) {
                        Text(item.optString("name").ifBlank { "未标明课程" })
                        Text("${bookingTime(item.optLong("startTime"))} · ID ${item.opt("id")}",
                            style = MaterialTheme.typography.bodySmall)
                    }
                }
            }
            if (rawJson && showClasses) BookingJson(classListResponse!!.toString(2))
        }

        selectedClass?.let { item ->
            Text("已选：${item.optString("name")} · ${bookingTime(item.optLong("startTime"))}", color = Grey2)
        }
        OutlinedTextField(
            value = classId,
            onValueChange = { classId = it; selectedClass = null; response = null },
            label = { Text("团课场次 ID · classId") },
            supportingText = { Text("使用团课列表中的 id，不是 courseId") },
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
            enabled = !loading, singleLine = true, modifier = Modifier.fillMaxWidth(),
        )
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            OutlinedTextField(value = pageSize, onValueChange = { pageSize = it }, label = { Text("请求条数") },
                enabled = !loading, singleLine = true, modifier = Modifier.weight(1f),
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number))
            OutlinedTextField(value = lastId, onValueChange = { lastId = it }, label = { Text("分页游标") },
                enabled = !loading, singleLine = true, modifier = Modifier.weight(1f),
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number))
        }
        Row { Checkbox(checked = showAll, onCheckedChange = { showAll = it }); Text("包含已取消等全部记录", modifier = Modifier.padding(top = 12.dp)) }
        Row { Checkbox(checked = rawJson, onCheckedChange = { rawJson = it }); Text("显示原始 JSON", modifier = Modifier.padding(top = 12.dp)) }
        Button(onClick = { queryBookings(classId) }, enabled = !loading, modifier = Modifier.fillMaxWidth()) {
            Text("查询预约名单")
        }
        if (loading) CircularProgressIndicator(color = Red)
        errorText?.let { SelectionContainer { Text(it, color = Red) } }

        response?.let { body ->
            val visible = if (showAll) bookings else bookings.filter { it.optInt("role") != 2 && it.optInt("status") != 4 }
            Text("团课 ID $resultClassId · 返回 ${bookings.size} 条 · 展示 ${visible.size} 条", color = Color.White,
                style = MaterialTheme.typography.titleSmall)
            if (rawJson) BookingJson(body.toString(2)) else {
                if (visible.isEmpty()) Text("本次返回中没有符合条件的预约用户。", color = Grey2)
                visible.forEach { row ->
                    val status = when (row.optInt("status", -1)) {
                        0, 1 -> "未签到"
                        2 -> "已签到"
                        3 -> "未约代消"
                        4 -> "已取消"
                        5 -> "自动消课"
                        else -> "状态 ${row.opt("status") }"
                    }
                    SelectionContainer {
                        Column(modifier = Modifier.fillMaxWidth().background(Surface2).padding(12.dp)) {
                            Text("${row.optString("userName").ifBlank { "未标明姓名" }} · $status", color = Color.White)
                            Text("用户 ID ${row.opt("userId")} · 记录 ID ${row.opt("id")}", color = Grey2,
                                style = MaterialTheme.typography.bodySmall)
                            Text("预约时间 ${bookingTime(row.optLong("createTime"))}", color = Grey2,
                                style = MaterialTheme.typography.bodySmall)
                            if (row.optLong("signinTime") > 0) Text("签到时间 ${bookingTime(row.optLong("signinTime"))}", color = Grey2,
                                style = MaterialTheme.typography.bodySmall)
                        }
                    }
                }
            }
            if (bookings.size >= resultPageSize) Text("返回条数达到请求条数，可能还有记录；可调大请求条数，或填写分页游标再查询。", color = Red)
        }
    }
}

@Composable
private fun BookingJson(text: String) {
    SelectionContainer {
        Text(text, color = Color.White, fontFamily = FontFamily.Monospace,
            style = MaterialTheme.typography.bodySmall,
            modifier = Modifier.fillMaxWidth().background(Surface2).padding(12.dp))
    }
}
