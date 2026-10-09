package com.ssj.geekfight.api

import okhttp3.HttpUrl.Companion.toHttpUrl
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONArray
import org.json.JSONException
import org.json.JSONObject
import org.json.JSONTokener
import java.time.Instant
import java.time.LocalDate
import java.time.ZonedDateTime
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.util.Locale
import java.util.concurrent.TimeUnit

private const val OFFICE_BASE_URL = "https://mini.arfighter.com"
private const val DEFAULT_OFFICE_STORE_ID = "1101013"
private val OFFICE_TIME_ZONE = ZoneId.of("Asia/Shanghai")

data class OfficeEndpoint(
    val key: String,
    val label: String,
    val service: String,
    val method: String,
    val path: String,
    val fields: List<String>,
) {
    val displayPath: String get() = "/fg/$service/v1$path"
}

data class OfficeResult(val status: Int, val text: String)

/** FightGeek Office 课表、报表及统计接口。 */
object OfficeCatalog {
    val endpoints = listOf(
        OfficeEndpoint("coach-schedule", "我的教练课表", "management", "GET", "/coach/classtable", listOf("date", "coachId")),
        OfficeEndpoint("sales-flow", "销售流水", "order", "GET", "/flow", listOf("storeId", "staffId", "paymentType", "from", "to")),
        OfficeEndpoint("sales-report-url", "销售报表地址", "order", "GET", "/reporturl", listOf("storeId", "paymentType", "from", "to")),
        OfficeEndpoint("coach-flow", "教练消课列表", "management", "GET", "/coach/classflowlist", listOf("storeId", "from", "to", "courseType", "queryValue")),
        OfficeEndpoint("coach-flow-detail", "教练消课明细", "management", "GET", "/coach/classflowdetail", listOf("from", "to", "userId")),
        OfficeEndpoint("conversion", "例子转化概况", "management", "GET", "/member/conversion", listOf("queryType", "storeId", "staffId")),
        OfficeEndpoint("conversion-report", "例子转化报表", "management", "GET", "/member/conversion/report", listOf("storeId", "staffId", "mode", "from", "to")),
        OfficeEndpoint("conversion-report-url", "例子报表地址", "management", "GET", "/member/conversion/url", listOf("storeId", "staffId", "mode", "from", "to")),
        OfficeEndpoint("meituan-sales", "美团销售", "management", "GET", "/card/meituan", listOf("storeId", "startTime", "endTime")),
        OfficeEndpoint("meituan-report-url", "美团报表地址", "management", "GET", "/card/meituan/report", listOf("storeId", "startTime", "endTime")),
        OfficeEndpoint("class-analysis", "团课分析", "management", "GET", "/analysis/detail", listOf("queryType", "storeId", "startTime", "endTime")),
        OfficeEndpoint("dashboard-detail", "首页仪表盘", "management", "POST", "/dashboard/detail", listOf("storeId", "queryType", "from", "to")),
        OfficeEndpoint("dashboard-rank", "首页排行", "management", "GET", "/dashboard/rank", listOf("regionalId", "cloudBrandId", "from", "to", "queryType")),
        OfficeEndpoint("dashboard-report", "仪表盘报表地址", "management", "POST", "/dashboard/report", listOf("reportType", "queryParam")),
        OfficeEndpoint("member-analysis", "会员状态统计", "management", "GET", "/member/analysis", listOf("status", "storeId", "staffId", "queryType")),
        OfficeEndpoint("store-performance", "店面指标", "management", "GET", "/staff/performance", listOf("storeId", "type", "startTime")),
        OfficeEndpoint("store-performance-status", "店面指标状态", "management", "GET", "/staff/performance/status", listOf("storeId", "type", "startTime", "endTime")),
    )

    val stores = linkedMapOf(
        "1101001" to "天通苑龙德店", "1101002" to "荟聚店", "1101003" to "清河万象汇店",
        "1101004" to "顺义华联店", "1101005" to "万柳店", "1101006" to "石景山喜隆多店",
        "1101007" to "五棵松万达店", "1101008" to "丰科万达店", "1101009" to "西局店",
        "1101010" to "中关村融科店", "1101011" to "西铁营万达店", "1101012" to "通州万达店",
        "1101013" to "望京凯德店", "1101014" to "房山店", "1101015" to "极斗·IKMF马伽术格斗",
        "1101016" to "长楹天街", "3101001" to "上海 LCM 店", "4301007" to "长沙德思勤店",
        "4301008" to "长沙马栏山店", "5001001" to "重庆时代天街店",
    )

    fun defaultValue(endpoint: OfficeEndpoint, field: String, now: ZonedDateTime = ZonedDateTime.now(OFFICE_TIME_ZONE)): String {
        val current = now.toEpochSecond().toString()
        val monthStart = now.toLocalDate().withDayOfMonth(1).atStartOfDay(OFFICE_TIME_ZONE).toEpochSecond().toString()
        if (field in listOf("from", "to", "startTime", "endTime")) {
            if (endpoint.key in listOf("dashboard-detail", "dashboard-rank")) return current
            return if (field == "from" || field == "startTime") monthStart else current
        }
        if (field == "storeId") return if (endpoint.key == "dashboard-detail") "[$DEFAULT_OFFICE_STORE_ID]" else DEFAULT_OFFICE_STORE_ID
        return when (field) {
            "regionalId" -> "0"
            "cloudBrandId" -> "-1"
            "staffId", "paymentType", "courseType", "status" -> "0"
            "queryValue" -> ""
            "queryType", "mode", "type" -> "1"
            else -> ""
        }
    }

    fun range(endpoint: OfficeEndpoint, yearsBack: Long = 0): Map<String, String> {
        val now = ZonedDateTime.now(OFFICE_TIME_ZONE)
        val start = if (yearsBack > 0) now.minusYears(yearsBack) else
            now.toLocalDate().withDayOfMonth(1).atStartOfDay(OFFICE_TIME_ZONE)
        val first = if ("from" in endpoint.fields) "from" else "startTime"
        val last = if ("to" in endpoint.fields) "to" else "endTime"
        return mapOf(first to start.toEpochSecond().toString(), last to now.toEpochSecond().toString())
    }
}

class OfficeApi {
    private val http = OkHttpClient.Builder()
        .connectTimeout(15, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .build()
    private val jsonType = "application/json; charset=utf-8".toMediaType()
    private val classTimeFormat = DateTimeFormatter.ofPattern("MM-dd E HH:mm", Locale.CHINA)

    fun request(endpoint: OfficeEndpoint, token: String, values: Map<String, String>): OfficeResult {
        require(token.isNotBlank()) { "请先在 Token 页保存用户 Token" }
        val url = (OFFICE_BASE_URL + endpoint.displayPath).toHttpUrl().newBuilder()
        val builder = Request.Builder()
            .header("Authorization", token.trim())
            .header("Accept", "application/json")

        if (endpoint.method == "GET") {
            endpoint.fields.forEach { field ->
                url.addQueryParameter(field, values[field].orEmpty())
            }
            builder.url(url.build()).get()
        } else {
            val json = JSONObject()
            endpoint.fields.forEach { field ->
                val raw = values[field].orEmpty()
                require(raw.isNotBlank()) { "请填写 $field" }
                val parsed = try { JSONTokener(raw).nextValue() } catch (e: JSONException) {
                    throw IllegalArgumentException("$field 需要填写有效的 JSON 值", e)
                }
                json.put(field, parsed)
            }
            builder.url(url.build()).post(json.toString().toRequestBody(jsonType))
        }

        http.newCall(builder.build()).execute().use { response ->
            val raw = response.body?.string().orEmpty()
            return OfficeResult(response.code, prettyResponse(raw))
        }
    }

    /** 与 office/coach_schedule.py 相同：按周查课，教练 ID 可由 /user/detail 获取。 */
    fun coachSchedule(
        token: String,
        selectedWeek: LocalDate,
        weeks: Int,
        coachIdOverride: Int?,
        ptOnly: Boolean,
        rawJson: Boolean,
    ): OfficeResult {
        require(weeks in 1..8) { "连续周数必须为 1–8" }
        val coachId = coachIdOverride ?: run {
            val detail = checkedJson(
                OfficeEndpoint("user-detail", "当前职员", "management", "GET", "/user/detail", emptyList()),
                token, emptyMap(),
            )
            val id = detail.optJSONObject("data")?.optInt("id") ?: 0
            require(id > 0) { "/user/detail 未返回职员 ID；请手动填写教练 ID" }
            id
        }
        val firstMonday = selectedWeek.minusDays((selectedWeek.dayOfWeek.value - 1).toLong())
        val text = StringBuilder()
        val jsonWeeks = JSONArray()
        val endpoint = OfficeCatalog.endpoints.first { it.key == "coach-schedule" }

        repeat(weeks) { offset ->
            val monday = firstMonday.plusWeeks(offset.toLong())
            val dateUnix = monday.atStartOfDay(OFFICE_TIME_ZONE).toEpochSecond()
            val response = checkedJson(endpoint, token, mapOf("date" to dateUnix.toString(), "coachId" to coachId.toString()))
            val rows = response.optJSONObject("data")?.optJSONArray("list")
                ?: throw IllegalStateException("/coach/classtable 未返回 data.list：${response.toString(2)}")
            val classes = (0 until rows.length()).map { index ->
                rows.optJSONObject(index) ?: throw IllegalStateException("课表第 ${index + 1} 条不是对象")
            }.sortedBy { it.optLong("startTime", 0L) }
                .filter { !ptOnly || it.optString("mode") == "1" }

            if (rawJson) {
                val items = JSONArray()
                classes.forEach { items.put(it) }
                jsonWeeks.put(JSONObject()
                    .put("week_start", monday.toString())
                    .put("coach_id", coachId)
                    .put("classes", items))
            } else {
                if (text.isNotEmpty()) text.appendLine()
                text.appendLine("$monday 至 ${monday.plusDays(6)}｜教练 ID $coachId｜${classes.size} 节课")
                if (classes.isEmpty()) text.appendLine("暂无课程")
                classes.forEach { text.appendLine(formatClass(it)) }
            }
        }
        return OfficeResult(200, if (rawJson) jsonWeeks.toString(2) else text.toString().trimEnd())
    }

    private fun checkedJson(endpoint: OfficeEndpoint, token: String, values: Map<String, String>): JSONObject {
        val response = request(endpoint, token, values)
        val body = try { JSONObject(response.text) } catch (e: JSONException) {
            throw IllegalStateException("${endpoint.path} 未返回 JSON（HTTP ${response.status}）：${response.text}", e)
        }
        if (response.status !in 200..299 || body.optInt("code", -1) != 200) {
            val reason = body.optString("msg").ifBlank { body.optString("message") }
            throw IllegalStateException(
                "${endpoint.path} 请求失败（HTTP ${response.status}，业务码 ${body.opt("code")}）：$reason\n${response.text}"
            )
        }
        return body
    }

    private fun formatClass(item: JSONObject): String {
        val startTime = item.optLong("startTime", 0L)
        val time = if (startTime > 0) {
            classTimeFormat.format(Instant.ofEpochSecond(startTime).atZone(OFFICE_TIME_ZONE))
        } else "时间未提供"
        val isPt = item.optString("mode") == "1"
        val kind = if (isPt) "私教" else if (item.optString("mode") == "2") "团课" else "类型 ${item.optString("mode")}"
        val parts = mutableListOf(time, kind,
            item.optString("courseName").ifBlank { "未标明课程" },
            item.optString("storeName").ifBlank { "未标明场馆" })
        if (isPt && item.optString("memberName").isNotBlank()) parts += "会员：${item.optString("memberName")}"
        if (item.has("bookingNum") && !item.isNull("bookingNum")) parts += "预约：${item.opt("bookingNum")}"
        if (item.has("signInNum") && !item.isNull("signInNum")) parts += "签到：${item.opt("signInNum")}"
        return parts.joinToString(" | ")
    }

    private fun prettyResponse(raw: String): String {
        val trimmed = raw.trim()
        return try {
            when {
                trimmed.startsWith("{") -> JSONObject(trimmed).toString(2)
                trimmed.startsWith("[") -> JSONArray(trimmed).toString(2)
                else -> raw.ifEmpty { "<空响应>" }
            }
        } catch (_: JSONException) {
            raw.ifEmpty { "<空响应>" }
        }
    }
}
