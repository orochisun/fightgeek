# wx2e1deadc021eaeb9 解包结果（版本 29）

## 来源

- 加密包：`applet-packages/29/__APP__.wxapkg`（V1MMWX）
- 解密算法：PC/Mac 通用 `pc_wxapkg_decrypt`（PBKDF2 + AES-CBC + XOR，AppID 作密钥）

## 目录

| 路径 | 说明 |
|------|------|
| `dec.wxapkg` | 解密后的原始包 |
| `source/` | 仅解包（未反编译） |
| `dec/` | **反编译主目录**（app.json、分页面 js、wxss 等） |

## 小程序信息

- **名称**：极斗 / FIGHT GEEK（Fightgeek极斗综合格斗馆）
- **AppID**：`wx2e1deadc021eaeb9`
- **技术栈**：Taro + React（webpack 分包）
- **主题色**：`#E7262A`
- **API 基址**：`https://mini.arfighter.com/fg`

## 页面结构（app.json）

**TabBar**：极斗、影展、约课、会员、我的

**主包页面**：home、index（约课）、member、me、buy-card、video、coach、store、user-info 等

**分包（9 个）**：esign、order、my-card、message、booking、admin-push-order、customer-acquisition、customer-service、user

## 说明

- `page-frame.js` → wxml 反编译因 Node/vm2 环境报错未完成；页面结构可从 `pages/*/index.html` 与 `app-service.js` 分析
- 分包页面的独立 `.wxapkg` 未包含在本主包中，需另行从微信缓存拉取对应分包
