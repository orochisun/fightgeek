package com.ssj.geekfight

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.lifecycle.viewmodel.compose.viewModel
import com.ssj.geekfight.ui.screen.HomeScreen
import com.ssj.geekfight.ui.theme.GeekFightTheme
import com.ssj.geekfight.viewmodel.AppViewModel

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            GeekFightTheme {
                val appViewModel: AppViewModel = viewModel()
                HomeScreen(viewModel = appViewModel)
            }
        }
    }
}
