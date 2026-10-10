package com.ssj.geekfight.ui.screen

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.text.selection.SelectionContainer
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material.icons.filled.KeyboardArrowUp
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.ssj.geekfight.api.OfficeApi
import com.ssj.geekfight.ui.theme.Grey2
import com.ssj.geekfight.ui.theme.Red
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

private data class BookingPerson(val id: String, val name: String, val status: String)

@Composable
internal fun GroupBookingPeople(classId: Int, capacity: Int, token: String, api: OfficeApi) {
    var expanded by rememberSaveable(classId) { mutableStateOf(false) }
    var refresh by remember(classId) { mutableIntStateOf(0) }
    var loading by remember(classId) { mutableStateOf(false) }
    var people by remember(classId) { mutableStateOf<List<BookingPerson>>(emptyList()) }
    var errorText by remember(classId) { mutableStateOf<String?>(null) }
    var mayHaveMore by remember(classId) { mutableStateOf(false) }

    LaunchedEffect(classId, expanded, token, refresh) {
        if (expanded) {
            loading = true
            errorText = null
            people = emptyList()
            mayHaveMore = false
            try {
                require(token.isNotBlank()) { "请先在「Token」页保存用户 Token" }
                val pageSize = maxOf(capacity + 20, 100)
                val body = withContext(Dispatchers.IO) { api.classBookings(token.trim(), classId, pageSize, 0) }
                val rows = body.optJSONObject("data")?.optJSONArray("list")
                    ?: error("接口未返回 data.list：${body.toString(2)}")
                people = (0 until rows.length()).map { index ->
                    rows.optJSONObject(index) ?: error("预约记录格式无效：${body.toString(2)}")
                }.filter { it.optInt("role") != 2 && it.optInt("status") != 4 }.map { item ->
                    val status = when (item.optInt("status", -1)) {
                        0, 1 -> "未签到"
                        2 -> "已签到"
                        3 -> "未约代消"
                        5 -> "自动消课"
                        else -> "状态 ${item.opt("status") }"
                    }
                    BookingPerson(item.optString("userId"), item.optString("userName").ifBlank { "未标明姓名" }, status)
                }
                mayHaveMore = rows.length() >= pageSize
            } catch (e: CancellationException) {
                throw e
            } catch (e: Exception) {
                errorText = e.message ?: e.javaClass.simpleName
            } finally {
                loading = false
            }
        }
    }

    Column {
        Row(modifier = Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
            TextButton(onClick = { expanded = !expanded }, modifier = Modifier.weight(1f)) {
                Text(if (expanded) "收起预约名单" else "展开预约名单", modifier = Modifier.weight(1f))
                Icon(if (expanded) Icons.Default.KeyboardArrowUp else Icons.Default.KeyboardArrowDown,
                    contentDescription = null, modifier = Modifier.size(18.dp))
            }
            if (expanded) IconButton(onClick = { refresh++ }, enabled = !loading, modifier = Modifier.size(36.dp)) {
                Icon(Icons.Default.Refresh, contentDescription = "刷新预约名单", tint = Grey2, modifier = Modifier.size(18.dp))
            }
        }
        if (expanded) {
            when {
                loading -> Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    CircularProgressIndicator(color = Red, strokeWidth = 2.dp, modifier = Modifier.size(16.dp))
                    Text("查询预约名单中…", color = Grey2, style = MaterialTheme.typography.bodySmall)
                }
                errorText != null -> SelectionContainer {
                    Text(errorText!!, color = Red, style = MaterialTheme.typography.bodySmall)
                }
                else -> {
                    Text("已预约 ${people.size} 人", color = Grey2, style = MaterialTheme.typography.labelMedium)
                    if (people.isEmpty()) Text("本次返回中暂无预约用户", color = Grey2, style = MaterialTheme.typography.bodySmall)
                    people.forEach { person ->
                        SelectionContainer {
                            Row(modifier = Modifier.fillMaxWidth().padding(vertical = 5.dp),
                                horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                Text("${person.name}（${person.id}）", color = Color.White,
                                    style = MaterialTheme.typography.bodySmall, modifier = Modifier.weight(1f))
                                Text(person.status, color = Grey2, style = MaterialTheme.typography.bodySmall)
                            }
                        }
                    }
                    if (mayHaveMore) Text("可能还有记录，可在 Office 预约名单中增加请求条数查询。", color = Red,
                        style = MaterialTheme.typography.bodySmall)
                }
            }
        }
    }
}
