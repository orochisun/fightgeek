package com.ssj.geekfight.api

import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import com.ssj.geekfight.api.dto.ApiResponse
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import java.lang.reflect.Type
import java.util.concurrent.TimeUnit

private const val BASE_URL = "https://mini.arfighter.com/fg"

class FightGeekClient(private val tokenProvider: () -> String?) {

    internal val http = OkHttpClient.Builder()
        .connectTimeout(15, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .build()

    internal val gson = Gson()

    internal val jsonMediaType = "application/json; charset=utf-8".toMediaType()

    // ── Core request ─────────────────────────────────────────────────────────

    fun <T> request(
        method: String,
        path: String,
        responseType: Type,
        params: Map<String, Any?>? = null,
        body: Any? = null,
        skipToken: Boolean = false,
    ): ApiResponse<T> {
        val url = buildUrl(path, params)

        val reqBody = if (body != null) {
            gson.toJson(body).toRequestBody(jsonMediaType)
        } else if (method == "POST" || method == "PUT") {
            "".toRequestBody(jsonMediaType)
        } else {
            null
        }

        val reqBuilder = Request.Builder().url(url)
        if (!skipToken) {
            tokenProvider()?.let { reqBuilder.header("Authorization", it) }
        }

        val request = when (method.uppercase()) {
            "GET" -> reqBuilder.get().build()
            "POST" -> reqBuilder.post(reqBody!!).build()
            "PUT" -> reqBuilder.put(reqBody ?: "".toRequestBody(jsonMediaType)).build()
            "DELETE" -> reqBuilder.delete().build()
            else -> throw IllegalArgumentException("Unsupported HTTP method: $method")
        }

        val response = http.newCall(request).execute()
        val rawJson = response.body?.string() ?: throw ApiException("Empty response body")

        if (!response.isSuccessful) {
            throw ApiException("HTTP ${response.code}: $rawJson")
        }

        val apiResponseType = TypeToken.getParameterized(ApiResponse::class.java, responseType).type
        val parsed: ApiResponse<T> = gson.fromJson(rawJson, apiResponseType)

        if (parsed.code != 200 && parsed.code != 0) {
            throw ApiException(parsed.msg.ifBlank { "API error code ${parsed.code}" }, parsed.code)
        }
        return parsed
    }

    private fun buildUrl(path: String, params: Map<String, Any?>?): String {
        val base = if (path.startsWith("http")) path
                   else "$BASE_URL${if (path.startsWith("/")) path else "/$path"}"
        if (params.isNullOrEmpty()) return base
        val query = params.entries
            .filter { it.value != null }
            .joinToString("&") { "${it.key}=${it.value}" }
        return "$base?$query"
    }
}

/** Convenience extension to keep call sites clean. */
inline fun <reified T> FightGeekClient.request(
    method: String,
    path: String,
    params: Map<String, Any?>? = null,
    body: Any? = null,
    skipToken: Boolean = false,
): ApiResponse<T> = request(
    method = method,
    path = path,
    responseType = object : TypeToken<T>() {}.type,
    params = params,
    body = body,
    skipToken = skipToken,
)

class ApiException(message: String, val code: Int = -1) : Exception(message)
