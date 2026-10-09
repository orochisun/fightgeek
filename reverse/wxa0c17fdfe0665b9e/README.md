# FightGeek Office 小程序

- AppID：`wxa0c17fdfe0665b9e`
- 本机微信缓存版本：`136`（包文件修改时间：2026-09-21 10:47:37）
- 原始加密包：`applet-packages/136/__APP__.wxapkg`
- 解密包：`unpacked/136/dec.wxapkg`
- 解包文件：`unpacked/136/source/`（135 个文件）
- 原始包 SHA-256：`a1867253563d57a215bce92c47994a5b9ee551c89783b95dc5699aa0b34d79b1`

来源是本机 Mac 微信缓存的 `applet/packages/wxa0c17fdfe0665b9e/136/`。这里只保存程序包及静态解包结果，没有复制账号本地缓存。

## 与登录页截图的对应关系

`source/app-config.json` 的入口是 `pages/index/index.html`，该页标题为 `FightGeek Office`。`source/app-wxss.js` 中可以找到“欢迎使用 FightGeek-Official 管理系统”“该小程序仅限公司内部人员使用”“授权手机号登录”。这些文字与提供的登录页截图一致。

## 页面线索

配置包含 98 个页面、11 个分包。底部导航为“首页、功能、消息、我的”；页面包括仪表盘、课程签到、销售、财务、员工、门店、会员及报表等。后续分析可从 `unpacked/136/source/app-service.js` 和 `app-config.json` 开始。

按菜单分类整理的功能清单见 `docs/FEATURE_MAP.md`。

独立的教练课表查询脚本见 `../../office/coach_schedule.py`，使用说明见 `../../office/README.md`。

解密命令：

```bash
python3 tools/decrypt_v1mmwx.py wxa0c17fdfe0665b9e \
  reverse/wxa0c17fdfe0665b9e/applet-packages/136/__APP__.wxapkg \
  reverse/wxa0c17fdfe0665b9e/unpacked/136/dec.wxapkg
```

解包命令：

```bash
python3 tools/unwxapkg.py \
  reverse/wxa0c17fdfe0665b9e/unpacked/136/dec.wxapkg \
  reverse/wxa0c17fdfe0665b9e/unpacked/136/source
```
