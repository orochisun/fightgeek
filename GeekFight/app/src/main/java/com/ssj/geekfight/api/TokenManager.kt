package com.ssj.geekfight.api

import android.content.Context
import android.content.SharedPreferences

private const val PREFS_NAME = "fg_prefs"
private const val KEY_TOKEN = "fgm_token"
private const val KEY_TOKEN_EXPIRE = "fgm_token_expire"

class TokenManager(context: Context) {

    private val prefs: SharedPreferences =
        context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

    fun getToken(): String? = prefs.getString(KEY_TOKEN, null)?.takeIf { it.isNotBlank() }

    fun getTokenExpire(): Long = prefs.getLong(KEY_TOKEN_EXPIRE, 0L)

    fun saveToken(token: String, expireUnix: Long = 0L) {
        prefs.edit()
            .putString(KEY_TOKEN, token.trim())
            .putLong(KEY_TOKEN_EXPIRE, expireUnix)
            .apply()
    }

    fun clearToken() {
        prefs.edit().remove(KEY_TOKEN).remove(KEY_TOKEN_EXPIRE).apply()
    }

    fun isTokenValid(): Boolean {
        val token = getToken() ?: return false
        val expire = getTokenExpire()
        if (expire > 0 && expire < System.currentTimeMillis() / 1000) return false
        return token.isNotBlank()
    }
}
