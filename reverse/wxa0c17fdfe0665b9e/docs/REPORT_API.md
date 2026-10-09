# FightGeek Office 报表接口（主包静态分析）

依据 FightGeek Office 小程序 `wxa0c17fdfe0665b9e` 的本机缓存版本 136 整理。报表菜单和页面标题来自 `unpacked/136/source/app-service.js` 中的 `options/functions.js`，以及 `app-config.json`；请求方法、路径和参数来自同一主包的 `net/*.js`。

**证据范围：** 本机只有主包，没有 `reportPages/` 分包源码。下表列出主包中已定义、与各报表页面名称对应的请求函数；分包页面是否调用了全部函数、筛选项的取值、响应结构和下载文件类型，仍需分包源码或运行时请求确认。此文档未用管理角色登录验证接口。

对应的命令行脚本是 [office/report_api.py](../../../office/report_api.py)，用法见 [office/README.md](../../../office/README.md#报表与统计接口)。

## 请求约定

- 正式环境管理接口前缀：`https://mini.arfighter.com/fg/management/v1`。
- 正式环境订单接口前缀：`https://mini.arfighter.com/fg/order/v1`。
- 开发、体验环境域名为 `m2.bitzhedu.com`，路径不变。
- 请求头 `Authorization` 使用小程序存储的 `fg_token` 原值。`net/api.js` 的 `getPromise` 发送 GET 请求；`postJsonPromise` 发送 `Content-Type: application/json` 的 POST 请求。
- `net/*.js` 的函数通常取微信请求对象的 `data`，即服务端 JSON 响应主体。首页仪表盘页面检查 `code === 200`，并对部分 `data.info` 再执行 `JSON.parse`。其他报表响应字段在主包里无法完整确认。
- 以下参数名照源码保留。`from`、`to`、`startTime`、`endTime` 在不同函数中并存；不要互换。仪表盘主包使用 Unix 秒时间值，但报表分包的日期控件未缓存，不能据此断定每个报表接口的时间单位。

## “报表”和“分析”菜单

| 菜单 | 页面 | 主包中对应的请求函数 |
| --- | --- | --- |
| 销售报表 | `/reportPages/pages/salesflow` | `getOrderFlow`、`getOrderFlowReportUrl` |
| 教练消课 | `/reportPages/pages/coachflowlist`；配置另含 `/reportPages/pages/coachflowdetail` | `getCoachClassFlowList`、`getCoachClassFlowDetail` |
| 例子报表 | `/reportPages/pages/conversion` | `getConversionList`、`getConversionReportList`、`getConversionReportUrl` |
| 美团合作 | `/reportPages/pages/meituanflow` | `getMeituanSaleList`、`getMeituanSaleReportUrl` |
| 团课分析（“分析”菜单） | `/reportPages/pages/classanalysis` | `getAnalysisReport` |

页面与函数是按菜单名称和请求模块语义对应的。由于分包未缓存，表格不代表已追踪到页面中的实际调用链。

### 销售报表：订单流水

模块：`net/order.js`。这两个接口使用**订单接口前缀**。

| 函数 | 方法与路径 | 查询参数（源码顺序） | 能确认的用途 |
| --- | --- | --- | --- |
| `getOrderFlow(storeId, staffId, paymentType, from, to)` | `GET /flow` | `storeId`, `staffId`, `paymentType`, `from`, `to` | 查询销售流水 |
| `getOrderFlowReportUrl(storeId, paymentType, from, to)` | `GET /reporturl` | `storeId`, `paymentType`, `from`, `to` | 取得销售报表地址；此函数没有 `staffId` 参数 |

### 教练消课

模块：`net/coach.js`。以下路径使用**管理接口前缀**。

| 函数 | 方法与路径 | 查询参数（源码顺序） | 能确认的用途 |
| --- | --- | --- | --- |
| `getCoachClassFlowList(storeId, courseType, from, to, queryValue)` | `GET /coach/classflowlist` | `storeId`, `from`, `to`, `courseType`, `queryValue` | 按门店、课程类型、时间及搜索值查消课列表 |
| `getCoachClassFlowDetail(userId, from, to)` | `GET /coach/classflowdetail` | `from`, `to`, `userId` | 查某个 `userId` 的消课明细 |

`courseType` 和 `queryValue` 的实际取值范围、明细返回字段，在主包中无法确定。

### 例子报表：会员转化

模块：`net/member.js`；路径使用**管理接口前缀**。

| 函数 | 方法与路径 | 查询参数（源码顺序） | 能确认的用途 |
| --- | --- | --- | --- |
| `getConversionList(queryType, storeId, staffId)` | `GET /member/conversion` | `queryType`, `storeId`, `staffId` | 查询转化概况 |
| `getConversionReportList(options)` | `GET /member/conversion/report` | `storeId`, `staffId`, `mode`, `from`, `to` | 查询转化报表列表 |
| `getConversionReportUrl(options)` | `GET /member/conversion/url` | `storeId`, `staffId`, `mode`, `from`, `to` | 取得转化报表地址 |

`options` 是传入对象，字段名如表。`queryType` 和 `mode` 的枚举值需要分包页面确认。

### 美团合作报表

模块：`net/card.js`；路径使用**管理接口前缀**。

| 函数 | 方法与路径 | 查询参数（源码顺序） | 能确认的用途 |
| --- | --- | --- | --- |
| `getMeituanSaleList(storeId, startTime, endTime)` | `GET /card/meituan` | `storeId`, `startTime`, `endTime` | 查询美团销售数据 |
| `getMeituanSaleReportUrl(storeId, startTime, endTime)` | `GET /card/meituan/report` | `storeId`, `startTime`, `endTime` | 取得美团报表地址 |

### 团课分析

模块：`net/analysis.js`；路径使用**管理接口前缀**。

| 函数 | 方法与路径 | 查询参数（源码顺序） | 能确认的用途 |
| --- | --- | --- | --- |
| `getAnalysisReport(queryType, storeId, startTime, endTime)` | `GET /analysis/detail` | `queryType`, `storeId`, `startTime`, `endTime` | 查询分析详情 |

`queryType` 的含义和响应字段需要 `classanalysis` 分包页面确认。

## 主包中另外可见的统计接口

这些接口在主包中可直接定位；其页面位于首页、店面指标或会员相关功能，并非“报表”菜单的五个页面。

| 页面或模块 | 函数 | 方法与路径 | 参数 |
| --- | --- | --- | --- |
| 首页仪表盘，`net/dashboard.js` | `getDashboardInfo(queryType, storeId, from, to)` | `POST /dashboard/detail` | JSON：`storeId`, `queryType`, `from`, `to` |
| 首页仪表盘，`net/dashboard.js` | `getRankListInfo(queryType, regionalId, cloudBrandId, from, to)` | `GET /dashboard/rank` | `regionalId`, `cloudBrandId`, `from`, `to`, `queryType` |
| 仪表盘请求模块，`net/dashboard.js` | `getReportUrl(reportType, queryParam)` | `POST /dashboard/report` | JSON：`reportType`, `queryParam`；主包未见页面调用 |
| 会员统计，`net/member.js` | `getMemberAnlysis(storeId, staffId, status, queryType)` | `GET /member/analysis` | `status`, `storeId`, `staffId`, `queryType`；函数名中的 `Anlysis` 为源码拼写 |
| 店面指标，`net/staff.js` | `getStorePerfomanceList(storeId, type, startTime)` | `GET /staff/performance` | `storeId`, `type`, `startTime`；函数名中的 `Perfomance` 为源码拼写 |
| 店面指标，`net/staff.js` | `getStorePerfomanceStatus(storeId, type, startTime, endTime)` | `GET /staff/performance/status` | `storeId`, `type`, `startTime`, `endTime` |

首页 `pages/dashboard/dashboard.js` 确认调用 `/dashboard/detail` 的 `queryType=1…9`，以及排行接口的 `queryType=1…5`。首页把 `data.info` 当 JSON 字符串解析。`/staff/performance` 对应的页面还定义了 `POST /staff/performance` 提交数据；这是写入操作，不属于查询接口。

## 源码定位

- 菜单入口：`unpacked/136/source/app-service.js` 第 7719 行，`options/functions.js`。
- 请求封装、环境及鉴权：同文件第 7656、7677 行，`net/api.js`、`net/config.js`。
- 报表请求：同文件第 7653、7662、7674、7689、7695 行，依次为 `net/analysis.js`、`net/card.js`、`net/coach.js`、`net/member.js`、`net/order.js`。
- 首页和指标请求：同文件第 7683、7710、7890、7938 行，依次为 `net/dashboard.js`、`net/staff.js`、首页、店面指标页面。
- 页面配置：`unpacked/136/source/app-config.json` 的 `reportPages/` 页面条目。
