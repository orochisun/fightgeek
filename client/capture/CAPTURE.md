# 获取 fgm_token — 从「体面」到「硬核」

目标：拿到请求头 **`Authorization`**（= 本地 `fgm_token`），或登录响应里的 **`data.accessToken`**。

---

## 推荐：Proxyman（Mac 上最省事）

不用改系统代理、不用终端，图形界面过滤域名即可。

1. 安装 [Proxyman](https://proxyman.io/)（免费版够用）。
2. **Certificate → Install Certificate on macOS**，钥匙串里设为「始终信任」。
3. **Certificate → Enable SSL Proxying on macOS**。
4. **Tools → SSL Proxying List → +** 添加：`mini.arfighter.com`（端口 `443`）。
5. 左侧选中 **macOS**（或 **WeChat**），确保在录流量。
6. 顶部过滤框输入：`mini.arfighter.com`。
7. Mac 微信打开 **FIGHT GEEK** → 点 **「我的」** → 再点 **「约课记录」**。
8. 在列表里任选一条 **已登录** 的请求（如 `user/detail`、`class/booking`）：
   - **Request → Header → `Authorization`** → 复制值  
   - 或找 **`POST .../wxMiniLogin`** → **Response → JSON → `data.accessToken`**
9. 写入项目：

```bash
cd /Users/orochisun/work/fightgeek/client
python3 get_token.py --paste "粘贴的token"
# 或
echo '粘贴的token' > .fgm_token
```

用完可在 Proxyman 里 **Stop Recording**，不必动系统网络设置。

---

## 次选：mitmweb（比 mitmdump 体面）

有网页 UI，比纯终端好认请求。

```bash
brew install mitmproxy
cd /Users/orochisun/work/fightgeek/client/capture
mitmweb -s extract_token.py -p 8080
```

1. 浏览器打开 **http://127.0.0.1:8081** 看请求列表。
2. Mac **系统设置 → 网络 → 代理** 指向 `127.0.0.1:8080`（仅抓包期间）。
3. 证书：**http://mitm.it** → Apple → 钥匙串信任。
4. 微信里操作小程序；插件会自动把 token 写到 `client/.fgm_token`。
5. **抓完务必关闭系统代理。**

---

## 最干净：微信开发者工具（若能打开该小程序）

不涉及 HTTPS 解密，直接在 Storage 里读键名。

1. 安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)。
2. 用 AppID **`wx2e1deadc021eaeb9`** 打开项目（需开发者权限；没有则用下面抓包方案）。
3. 预览 / 真机调试登录后：**调试器 → Storage → Local Storage**。
4. 找 **`fgm_token`**、**`fgm_token_expire`**，复制即可。

---

## 备用：mitmdump + 脚本（全自动写文件）

适合习惯命令行、愿意临时开系统代理时。

```bash
brew install mitmproxy
cd /Users/orochisun/work/fightgeek/client/capture
./start.sh
```

按脚本提示配置代理与证书，成功后见 `client/.fgm_token`。

---

## 本地 grep（不抓包，但偏硬核）

```bash
BASE="$HOME/Library/Containers/com.tencent.xinWeChat/Data/Documents/app_data/radium/users/987c68f36701646de50aed758477eac3/applet/local/wx2e1deadc021eaeb9"
strings "$BASE/usrmmkvstorage1/wx2e1deadc021eaeb9" | grep -E 'fgm_token|eyJ'
```

键名来自逆向：`fgm_token` / `fgm_token_expire`（MMKV 二进制，不一定能 grep 到）。

---

## 对比

| 方式 | 体面度 | 要装证书 | 要改系统代理 | 说明 |
|------|--------|----------|--------------|------|
| Proxyman | ★★★★★ | 一次 | 一般不用 | Mac 日常首选 |
| mitmweb | ★★★★ | 一次 | 抓包时要 | 网页看请求 |
| 开发者工具 Storage | ★★★★★ | 否 | 否 | 需能导入该 AppID |
| mitmdump | ★★★ | 一次 | 要 | 全自动写 `.fgm_token` |
| grep MMKV | ★★ | 否 | 否 | 常失败 |

---

## 微信目录（自行 grep 时用）

```text
~/Library/Containers/com.tencent.xinWeChat/Data/Documents/app_data/radium/users/
  987c68f36701646de50aed758477eac3/applet/local/wx2e1deadc021eaeb9/   # 当前号
  5937eb5079f792a66c065ac71f12adae/applet/local/wx2e1deadc021eaeb9/   # 旧号
```

MMKV 主文件（无 `.crc` 后缀）：

```text
usrmmkvstorage1/wx2e1deadc021eaeb9
mmkvadapterstorage/wx2e1deadc021eaeb9
```

---

## HTTPS 看不到时

- Proxyman 确认 **SSL Proxying List** 含 `mini.arfighter.com`
- **完全退出微信再打开**，重新进小程序
- 优先找 **`wxMiniLogin`** 响应 body 里的 **`accessToken`**
