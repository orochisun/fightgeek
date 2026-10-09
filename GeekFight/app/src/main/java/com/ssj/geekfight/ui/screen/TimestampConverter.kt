package com.ssj.geekfight.ui.screen

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.text.selection.SelectionContainer
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import com.ssj.geekfight.ui.theme.Grey2
import com.ssj.geekfight.ui.theme.Red
import com.ssj.geekfight.ui.theme.Surface2
import java.time.Instant
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.time.format.ResolverStyle

private val CONVERTER_ZONE = ZoneId.of("Asia/Shanghai")
private val OUTPUT_FORMAT = DateTimeFormatter.ofPattern("uuuu-MM-dd HH:mm:ss.SSS")
private val INPUT_FORMATS = listOf(
    "uuuu-MM-dd HH:mm:ss.SSS",
    "uuuu-MM-dd HH:mm:ss",
    "uuuu-MM-dd HH:mm",
).map { DateTimeFormatter.ofPattern(it).withResolverStyle(ResolverStyle.STRICT) }

private data class Conversion(val text: String, val valid: Boolean)

@Composable
internal fun TimestampConverter() {
    var timestampInput by rememberSaveable { mutableStateOf("") }
    var dateTimeInput by rememberSaveable { mutableStateOf("") }

    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Text("时间戳 → 北京时间", color = Grey2, style = MaterialTheme.typography.labelMedium)
        OutlinedTextField(
            value = timestampInput,
            onValueChange = { timestampInput = it },
            label = { Text("Unix 时间戳") },
            placeholder = { Text("例如 1790740800") },
            supportingText = { Text("13 位按毫秒解析，其余按秒解析") },
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
            singleLine = true,
            modifier = Modifier.fillMaxWidth(),
        )
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.End) {
            TextButton(onClick = { timestampInput = Instant.now().epochSecond.toString() }) {
                Text("填入当前时间")
            }
        }
        if (timestampInput.isNotBlank()) ConversionResult(convertTimestamp(timestampInput))

        HorizontalDivider(color = Surface2)

        Text("北京时间 → 时间戳", color = Grey2, style = MaterialTheme.typography.labelMedium)
        OutlinedTextField(
            value = dateTimeInput,
            onValueChange = { dateTimeInput = it },
            label = { Text("北京时间 · Asia/Shanghai") },
            placeholder = { Text("2026-09-30 12:34:56") },
            supportingText = { Text("可只填日期，或在日期后加 HH:mm、HH:mm:ss、毫秒") },
            singleLine = true,
            modifier = Modifier.fillMaxWidth(),
        )
        if (dateTimeInput.isNotBlank()) ConversionResult(convertDateTime(dateTimeInput))
    }
}

@Composable
private fun ConversionResult(result: Conversion) {
    SelectionContainer {
        Text(
            result.text,
            color = if (result.valid) Color.White else Red,
            fontFamily = FontFamily.Monospace,
            style = MaterialTheme.typography.bodySmall,
            modifier = Modifier.fillMaxWidth().background(Surface2).padding(10.dp),
        )
    }
}

private fun convertTimestamp(input: String): Conversion {
    val raw = input.trim()
    val value = raw.toLongOrNull() ?: return Conversion("请输入整数时间戳", false)
    val isMillis = raw.trimStart('-', '+').length >= 13
    return runCatching {
        val instant = if (isMillis) Instant.ofEpochMilli(value) else Instant.ofEpochSecond(value)
        val formatted = instant.atZone(CONVERTER_ZONE).format(OUTPUT_FORMAT)
        Conversion("北京时间：$formatted\n单位：${if (isMillis) "毫秒" else "秒"}", true)
    }.getOrElse { Conversion("时间戳超出可转换范围", false) }
}

private fun convertDateTime(input: String): Conversion {
    val raw = input.trim()
    val parsed = INPUT_FORMATS.firstNotNullOfOrNull { format ->
        runCatching { LocalDateTime.parse(raw, format) }.getOrNull()
    } ?: runCatching { LocalDate.parse(raw).atStartOfDay() }.getOrNull()
        ?: return Conversion("请输入北京时间：YYYY-MM-DD HH:mm:ss", false)
    return runCatching {
        val instant = parsed.atZone(CONVERTER_ZONE).toInstant()
        Conversion("Unix 秒：${instant.epochSecond}\nUnix 毫秒：${instant.toEpochMilli()}", true)
    }.getOrElse { Conversion("日期超出可转换范围", false) }
}
