package com.ssj.geekfight.api

import android.content.Context
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import java.io.File

private const val CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000L

private data class CacheFile(
    val timestamp: Long,
    val classes: List<GroupClass>,
)

object ClassListCache {

    private val gson = Gson()
    private val listType = object : TypeToken<CacheFile>() {}.type

    fun load(context: Context, storeId: Int): List<GroupClass>? {
        val file = cacheFile(context, storeId)
        if (!file.exists()) return null
        return try {
            val entry: CacheFile = gson.fromJson(file.readText(), listType)
            if (System.currentTimeMillis() - entry.timestamp > CACHE_TTL_MS) {
                file.delete()
                null
            } else {
                entry.classes
            }
        } catch (_: Exception) {
            file.delete()
            null
        }
    }

    fun save(context: Context, storeId: Int, classes: List<GroupClass>) {
        try {
            val entry = CacheFile(timestamp = System.currentTimeMillis(), classes = classes)
            cacheFile(context, storeId).writeText(gson.toJson(entry))
        } catch (_: Exception) {}
    }

    fun clear(context: Context, storeId: Int) = cacheFile(context, storeId).delete()

    fun clearAll(context: Context) {
        context.cacheDir.listFiles { f -> f.name.startsWith("classlist_") }?.forEach { it.delete() }
    }

    private fun cacheFile(context: Context, storeId: Int): File =
        File(context.cacheDir, "classlist_$storeId.json")
}
