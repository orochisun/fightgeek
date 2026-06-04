package com.ssj.geekfight.ui.screen

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import com.ssj.geekfight.ui.theme.Border
import com.ssj.geekfight.ui.theme.Green
import com.ssj.geekfight.ui.theme.GreenGlow
import com.ssj.geekfight.ui.theme.Grey2
import com.ssj.geekfight.ui.theme.Grey3
import com.ssj.geekfight.ui.theme.Red
import com.ssj.geekfight.ui.theme.RedGlow
import com.ssj.geekfight.ui.theme.Surface
import com.ssj.geekfight.ui.theme.Surface2
import com.ssj.geekfight.viewmodel.AppViewModel

@Composable
fun TokenScreen(viewModel: AppViewModel) {
    val tokenState by viewModel.tokenState.collectAsState()

    var inputToken by remember(tokenState.token) { mutableStateOf(tokenState.token) }
    var showToken  by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(horizontal = 16.dp, vertical = 20.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp),
    ) {

        if (tokenState.isValid) {
            Row(
                modifier = Modifier.fillMaxWidth()
                    .clip(RoundedCornerShape(6.dp))
                    .background(GreenGlow)
                    .border(1.dp, Green.copy(alpha = 0.5f), RoundedCornerShape(6.dp))
                    .padding(horizontal = 14.dp, vertical = 10.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                Icon(Icons.Default.CheckCircle, null, tint = Green, modifier = Modifier.padding(end = 4.dp))
                Text("TOKEN ACTIVE", color = Green, fontWeight = FontWeight.Bold,
                    style = MaterialTheme.typography.labelLarge)
            }
        }

        Text(
            "从微信小程序「极斗」抓包获取 Authorization / fgm_token，粘贴后保存。",
            style = MaterialTheme.typography.bodySmall,
            color = Grey3,
        )

        OutlinedTextField(
            value = inputToken,
            onValueChange = { inputToken = it },
            label = { Text("fgm_token", color = Grey2) },
            modifier = Modifier.fillMaxWidth(),
            minLines = 3,
            maxLines = 6,
            visualTransformation = if (showToken) VisualTransformation.None else PasswordVisualTransformation(),
            trailingIcon = {
                IconButton(onClick = { showToken = !showToken }) {
                    Icon(
                        if (showToken) Icons.Default.VisibilityOff else Icons.Default.Visibility,
                        contentDescription = null,
                        tint = Grey2,
                    )
                }
            },
            keyboardOptions = KeyboardOptions(imeAction = ImeAction.Done),
            keyboardActions = KeyboardActions(onDone = {
                if (inputToken.isNotBlank()) viewModel.saveToken(inputToken.trim())
            }),
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = Red,
                unfocusedBorderColor = Border,
                focusedTextColor = Color.White,
                unfocusedTextColor = Color.White,
                cursorColor = Red,
                focusedContainerColor = Surface,
                unfocusedContainerColor = Surface,
                focusedLabelColor = Red,
            ),
        )

        Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
            Button(
                onClick = { if (inputToken.isNotBlank()) viewModel.saveToken(inputToken.trim()) },
                enabled = inputToken.isNotBlank(),
                modifier = Modifier.weight(1f),
                colors = ButtonDefaults.buttonColors(containerColor = Red, contentColor = Color.White,
                    disabledContainerColor = Surface2, disabledContentColor = Grey3),
                shape = RoundedCornerShape(6.dp),
            ) { Text("保存", fontWeight = FontWeight.Bold) }

            OutlinedButton(
                onClick = { viewModel.clearToken(); inputToken = "" },
                enabled = tokenState.saved,
                modifier = Modifier.weight(1f),
                border = androidx.compose.foundation.BorderStroke(1.dp, Red.copy(alpha = if (tokenState.saved) 0.6f else 0.2f)),
                colors = ButtonDefaults.outlinedButtonColors(contentColor = Red,
                    disabledContentColor = Grey3),
                shape = RoundedCornerShape(6.dp),
            ) {
                Icon(Icons.Default.Delete, null)
                Spacer(Modifier.padding(horizontal = 4.dp))
                Text("清除")
            }
        }

        Box(
            modifier = Modifier.fillMaxWidth()
                .clip(RoundedCornerShape(6.dp))
            .background(Color(0xE60F0F0F))
            .border(1.dp, Border, RoundedCornerShape(6.dp))
            .padding(14.dp),
        ) {
            Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                Text("HOW TO GET TOKEN", style = MaterialTheme.typography.labelLarge, color = Grey2)
                Spacer(Modifier.height(2.dp))
                Text(
                    "1. Charles / mitmproxy 抓包微信小程序\n" +
                    "2. 找请求头 Authorization 的值\n" +
                    "3. 粘贴到上方输入框",
                    style = MaterialTheme.typography.bodySmall,
                    color = Grey3,
                    lineHeight = MaterialTheme.typography.bodySmall.lineHeight,
                )
            }
        }
    }
}
