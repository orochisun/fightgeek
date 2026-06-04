package com.ssj.geekfight.ui.theme

import android.app.Activity
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

private val CombatColorScheme = darkColorScheme(
    primary              = Red,
    onPrimary            = White,
    primaryContainer     = RedSubtle,
    onPrimaryContainer   = Red,
    secondary            = Orange,
    onSecondary          = White,
    secondaryContainer   = Color(0xFF1A0D00),
    onSecondaryContainer = Orange,
    tertiary             = Green,
    onTertiary           = Black,
    tertiaryContainer    = Color(0xFF002200),
    onTertiaryContainer  = Green,
    background           = Black,
    onBackground         = White,
    surface              = Surface,
    onSurface            = White,
    surfaceVariant       = Surface2,
    onSurfaceVariant     = Grey2,
    outline              = Border,
    error                = Red,
    onError              = White,
)

@Composable
fun GeekFightTheme(content: @Composable () -> Unit) {
    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = android.graphics.Color.BLACK
            window.navigationBarColor = android.graphics.Color.BLACK
            WindowCompat.getInsetsController(window, view).apply {
                isAppearanceLightStatusBars = false
                isAppearanceLightNavigationBars = false
            }
        }
    }

    MaterialTheme(
        colorScheme = CombatColorScheme,
        typography = Typography,
        content = content,
    )
}
