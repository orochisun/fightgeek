package com.ssj.geekfight.api

import android.content.Context
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import java.io.File
import java.time.LocalDate

/** A single PT slot record stored in the stats cache. */
data class PtSlotRecord(
    val timeStr: String,
    val available: Boolean,
)

/** All slot data fetched for one coach on one calendar day. */
data class PtStatsDayEntry(
    val fetchedAt: Long,
    val slots: List<PtSlotRecord>,
)

/**
 * Persistent cache for PT slot availability per coach.
 *
 * File: cacheDir/pt_stats_<coachId>.json
 * Content: Map<"YYYY-MM-DD", PtStatsDayEntry>
 *
 * Eviction rules:
 *  - Past dates: written once, never overwritten (API can no longer return them).
 *  - Today and future: always overwritten with fresh data from the API.
 *    The API only returns slots from "now" onwards, so earlier hours simply
 *    have no data — we do NOT preserve stale cached values for them.
 */
object PtStatsCache {

    private val gson = Gson()
    private val mapType = object : TypeToken<MutableMap<String, PtStatsDayEntry>>() {}.type

    fun load(context: Context, coachId: Int): MutableMap<String, PtStatsDayEntry> {
        return try {
            val text = cacheFile(context, coachId).readText()
            gson.fromJson(text, mapType) ?: mutableMapOf()
        } catch (_: Exception) {
            mutableMapOf()
        }
    }

    private fun save(context: Context, coachId: Int, data: Map<String, PtStatsDayEntry>) {
        try { cacheFile(context, coachId).writeText(gson.toJson(data)) } catch (_: Exception) {}
    }

    /**
     * Update slot data for a specific date.
     *
     * - Past dates: written once, never overwritten (API can no longer return them).
     * - Future dates: always overwritten with fresh data.
     * - Today: **merged** — keep cached slots whose hour has already passed
     *   AND whose cached entry was written TODAY (same calendar day).
     *   Entries written on a previous day are treated as empty, so stale
     *   cross-session data from yesterday or earlier is never merged in.
     */
    fun update(context: Context, coachId: Int, date: LocalDate, slots: List<PtSlotRecord>) {
        val key = date.toString()
        val today = LocalDate.now()
        val data = load(context, coachId)

        when {
            date.isBefore(today) -> {
                if (data.containsKey(key)) return  // immutable once cached
                data[key] = PtStatsDayEntry(System.currentTimeMillis(), slots)
            }
            date == today -> {
                val currentHour = java.time.LocalTime.now().hour
                // Only write future slots; past slots are ambiguous (unavailable ≠ booked)
                val futureSlots = slots.filter { extractHour(it.timeStr) > currentHour }
                val existing = data[key]?.slots ?: emptyList()
                val freshTimeStrs = futureSlots.map { it.timeStr }.toSet()
                // Preserve past-hour slots that were captured earlier today when they were still future
                val preserved = existing.filter { old ->
                    old.timeStr !in freshTimeStrs && extractHour(old.timeStr) <= currentHour
                }
                data[key] = PtStatsDayEntry(System.currentTimeMillis(), preserved + futureSlots)
            }
            else -> {
                data[key] = PtStatsDayEntry(System.currentTimeMillis(), slots)
            }
        }
        save(context, coachId, data)
    }

    private fun extractHour(timeStr: String): Int =
        Regex("""(\d{1,2}):""").find(timeStr)?.groupValues?.get(1)?.toIntOrNull() ?: 0

    fun clearAll(context: Context) {
        context.cacheDir.listFiles { f -> f.name.startsWith("pt_stats_") }?.forEach { it.delete() }
    }

    fun getRange(
        context: Context,
        coachId: Int,
        from: LocalDate,
        to: LocalDate,
    ): Map<String, PtStatsDayEntry> {
        val data = load(context, coachId)
        val result = mutableMapOf<String, PtStatsDayEntry>()
        var d = from
        while (!d.isAfter(to)) {
            val key = d.toString()
            data[key]?.let { result[key] = it }
            d = d.plusDays(1)
        }
        return result
    }

    private fun cacheFile(context: Context, coachId: Int): File =
        File(context.cacheDir, "pt_stats_$coachId.json")
}
