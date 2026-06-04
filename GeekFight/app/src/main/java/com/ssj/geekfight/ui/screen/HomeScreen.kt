package com.ssj.geekfight.ui.screen

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.FitnessCenter
import androidx.compose.material.icons.filled.Key
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.ssj.geekfight.R
import com.ssj.geekfight.ui.theme.Grey3
import com.ssj.geekfight.ui.theme.Red
import com.ssj.geekfight.ui.theme.Surface
import com.ssj.geekfight.ui.theme.Surface2
import com.ssj.geekfight.viewmodel.AppViewModel

/** Full-screen background: bg.jpg with a dark scrim so UI stays readable. */
@Composable
fun AppBackground(modifier: Modifier = Modifier, content: @Composable () -> Unit) {
    Box(modifier = modifier.fillMaxSize()) {
        Image(
            painter = painterResource(R.drawable.bg),
            contentDescription = null,
            contentScale = ContentScale.Crop,
            modifier = Modifier.fillMaxSize(),
        )
        // Dark scrim — 0xCC = 80% opacity black; raise to 0xE6 (90%) for more contrast
        Box(modifier = Modifier.fillMaxSize().background(Color(0xCC000000)))
        content()
    }
}

private data class NavTab(val label: String, val icon: ImageVector)

private val TABS = listOf(
    NavTab("团课", Icons.Default.FitnessCenter),
    NavTab("私教", Icons.Default.Person),
    NavTab("记录", Icons.Default.CalendarMonth),
    NavTab("Token", Icons.Default.Key),
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(viewModel: AppViewModel) {
    var selectedTab by rememberSaveable { mutableIntStateOf(0) }

    AppBackground {
        Scaffold(
            containerColor = Color.Transparent,
            topBar = {
                TopAppBar(
                    title = {
                        Text(
                            "FIGHT GEEK",
                            style = MaterialTheme.typography.titleLarge,
                            fontWeight = FontWeight.Black,
                            color = Red,
                        )
                    },
                    colors = TopAppBarDefaults.topAppBarColors(
                        containerColor = Color(0xB3000000),
                        titleContentColor = Red,
                    ),
                )
            },
            bottomBar = {
                NavigationBar(
                    containerColor = Color(0xCC0F0F0F),
                    tonalElevation = 0.dp,
                ) {
                    TABS.forEachIndexed { index, tab ->
                        NavigationBarItem(
                            selected = selectedTab == index,
                            onClick = { selectedTab = index },
                            icon = { Icon(tab.icon, contentDescription = tab.label) },
                            label = { Text(tab.label, style = MaterialTheme.typography.labelSmall) },
                            colors = NavigationBarItemDefaults.colors(
                                selectedIconColor = Red,
                                selectedTextColor = Red,
                                unselectedIconColor = Grey3,
                                unselectedTextColor = Grey3,
                                indicatorColor = Color(0x33FF1744),
                            ),
                        )
                    }
                }
            },
        ) { innerPadding ->
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding),
            ) {
                when (selectedTab) {
                    0 -> ClassListScreen(viewModel)
                    1 -> PtScreen(viewModel)
                    2 -> RecordsScreen(viewModel)
                    3 -> TokenScreen(viewModel)
                }
            }
        }
    }
}
