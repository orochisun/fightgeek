# 约课接口逆向整理（静态分析）

> 来源（新微信号 `987c68f36701646de50aed758477eac3`，v29）：  
> `unpacked/main/dec/common.js`、`pages/index/index.js`、`pages/booking/index.js`、`pages/booking/pt-coach/index.js`  
> 基址：`https://mini.arfighter.com/fg`  
> 鉴权：请求头 `Authorization: <fgm_token>`（本地存储 `fgm_token` / `fgm_token_expire`）  
> **未发起任何真实请求**，字段与枚举来自前端逻辑推断。

---

## 一、约课页面结构

Tab 页 `pages/index/index`（导航标题「约课」）含三个子 Tab：

| Tab | 名称 | 主要接口 |
|-----|------|----------|
| 0 | 团课预约 | `class/list`、`class/booking` |
| 1 | 私教时间预约 | `class/pt/*` |
| 2 | 私教教练预约 | `class/pt/store`、`class/pt/coach`（跳转分包页） |

「约课记录」入口跳转分包 `pages/booking/index`（`_pages_booking_.wxapkg`，已反编译至 `unpacked/main/dec/pages/booking/`）。

---

## 二、团课预约

### 2.1 获取团课列表

```
GET /member/v1/class/list?storeId={storeId}
```

| 项 | 值 |
|----|-----|
| 鉴权 | **不需要** Token（`doNotCheckToken: true`） |
| Query | `storeId`：当前门店 ID |

**前端过滤**（非服务端）：

- 丢弃 `startTime <= 当前时间 - 10 分钟` 的课程
- 按 `startTime` 升序

**列表项字段**（UI 使用，推断为 `data.list[]` 元素）：

| 字段 | 说明 |
|------|------|
| `id` | 课程/班次 ID（预约、取消时用） |
| `startTime` | Unix 时间戳（秒） |
| `duration` | 时长（分钟） |
| `courseName` | 课程名 |
| `courseCover` | 封面图 URL |
| `customerType` | 适用人群，见枚举 §六 |
| `bookingNum` | 已预约人数 |
| `capacity` | 容量 |
| `myBooking` | `0` 未预约 / `1` 已预约 |
| `type` | 卡片样式类型（1/2/3，对应渐变色） |
| `coach` | `{ id, name, avatar }` 主教练 |
| `sndCoach` | 副教练（`id === 0` 表示无） |
| `thdCoach` | 第三教练（`id === 0` 表示无） |

**响应约定**（全局）：

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "list": [ /* 课程对象 */ ]
  }
}
```

---

### 2.2 团课预约（下单）

```
POST /member/v1/class/booking
Content-Type: application/json
```

**请求体：**

```json
{
  "classId": 12345,
  "cardId": 67890
}
```

| 字段 | 必填 | 说明 |
|------|------|------|
| `classId` | 是 | 班次 ID |
| `cardId` | 否 | 会员卡 ID；首次点击可能不传，由服务端返回可用卡列表 |

**业务逻辑**（前端）：

1. 用户点击「会员预约」→ 调用本接口（防抖 500ms）
2. 若 `data.list` 为**非空数组** → 弹出「选择可用会员卡」，用户选卡后再次提交（带 `cardId`）
3. 若无需选卡或 `list` 为空 → 直接提示「预约成功」并刷新列表

**响应：**

- `code === 200` 成功
- 需选卡时：`data.list` 为会员卡选项（结构与购卡/会员卡组件一致，含 `id` 等）
- 失败：`msg` 用于 `showToast`

---

### 2.3 取消团课预约

```
PUT /member/v1/class/booking
Content-Type: application/json
```

**请求体：**

```json
{
  "id": 12345,
  "idType": 2
}
```

| 字段 | 说明 |
|------|------|
| `id` | 班次/预约记录 ID（团课列表项的 `id`） |
| `idType` | **固定为 `2`** 表示团课（前端取消团课时写死） |

**规则（前端文案）**：课程开始前 **4 小时**内不可自行取消。

---

## 三、私教时间预约

依赖门店上下文（`storeId`），流程：门店 → 日期 → 课程 → 时段 → 教练 → 选卡 → 确认。

### 3.1 支持私教的门店

```
GET /member/v1/class/pt/store
```

无 Query，需登录。返回 `data.list` 为门店数组（与通店列表经 `jD` 加工后用于选择）。

---

### 3.2 可选日期与课程

```
GET /member/v1/class/pt/course?storeId={storeId}&coachId={coachId}
```

| Query | 说明 |
|-------|------|
| `storeId` | 门店 ID |
| `coachId` | 教练 ID（私教时间 Tab 下随当前课程上下文传入） |

**返回结构**（前端使用）：

- `data.list[]` 元素含：
  - `date` / `dateStr`：日期
  - `available`：是否可约（`false` 显示「排课中」）
  - `courseList[]`：`{ id, name, ... }` 课程列表

---

### 3.3 某日某课程的可用时段

```
GET /member/v1/class/pt/bookinglist?courseId={courseId}&storeId={storeId}&date={date}
```

| Query | 说明 |
|-------|------|
| `courseId` | 课程 ID |
| `storeId` | 门店 ID |
| `date` | 日期（与 `availableDate.date` 一致，Unix 日或日期戳，以前端传入为准） |

**返回 `data.list[]` 元素：**

| 字段 | 说明 |
|------|------|
| `timeStr` | 展示用时段，如 `"14:30"`（前端用正则解析为当日时间戳） |
| `available` | 是否可约 |
| `coachList[]` | 该时段可选教练 `{ id, name, avatar, ... }` |

---

### 3.4 私教预约（含预检与确认）

```
POST /member/v1/class/pt/booking
Content-Type: application/json
```

**阶段 A — 预检 / 拉可用会员卡**（选教练后）：

```json
{
  "courseId": 1,
  "startTime": 1717502400,
  "coachId": 100,
  "storeId": 10
}
```

| 字段 | 说明 |
|------|------|
| `courseId` | 课程 ID |
| `startTime` | Unix 秒；由选中日期 + `timeStr` 拼出 |
| `coachId` | 教练 ID |
| `storeId` | 门店 ID |

- `code === 200` 且 `data.list.length > 0` → 弹层选会员卡  
- 否则提示「暂无可用会员卡」

**阶段 B — 确认预约**（用户选卡后点「确认预约」）：

```json
{
  "courseId": 1,
  "startTime": 1717502400,
  "coachId": 100,
  "storeId": 10,
  "cardId": 67890
}
```

成功：Toast「预约成功」，并刷新时段列表。

---

### 3.5 私教教练列表（Tab「私教教练预约」）

```
GET /member/v1/class/pt/coach?storeId={storeId}
```

返回教练列表；选中后跳转分包页 `pages/booking/pt-coach/index`。

**分包页预约流程**（与 §3.2–3.4 相同，差异为 `coachId` 来自路由上下文而非时段列表）：

1. `GET class/pt/course?storeId=&coachId=` — 拉日期/课程
2. `GET class/pt/bookinglist?courseId=&storeId=&date=&coachId=` — 拉时段（**多传 `coachId`**）
3. `POST class/pt/booking` — 预检会员卡 → 选卡后再次 POST 确认（body 同 §3.4）

---

## 四、约课记录（分包 `pages/booking/index`）

实现函数 `getCombinedBookingList`（`common.js` 导出 **`rE`**），**并行**请求：

```
GET /member/v1/class/booking?date={unix}&pageSize={n}
GET /member/v1/class/ptbooking?date={unix}&pageSize={n}
```

**调用参数**（`pages/booking/index.js` 已确认）：

| 参数 | 说明 |
|------|------|
| `date` | 所选年月的 **月初** Unix 时间戳（秒），`dayjs().year(Y).month(M-1).startOf('month').unix()` |
| `pageSize` | 固定 **100** |

UI 提供年/月选择器，切换年月会重新请求。

**团课记录**（`class/booking`）映射字段：

| 统一字段 | 来源 |
|----------|------|
| `id` | `class.id` |
| `startTime` | `class.startTime` |
| `duration` | `class.duration` |
| `courseName` | `class.courseName` |
| `customerType` | `class.customerType` |
| `storeName` | `storeName` |
| `coach` | `class.coach` |
| `capacity` / `bookingNum` | 同上 |
| `cardName` | `cardName` |
| `status` | `status` |
| `type` | **固定 `2`**（团课） |

**私教记录**（`class/ptbooking`）映射字段：

| 统一字段 | 来源 |
|----------|------|
| `id` | `id` |
| `startTime` / `duration` / `courseName` / ... | 顶层字段 |
| `type` | **固定 `1`**（私教） |

合并后按 `startTime` **降序** 排序，封装为：

```json
{
  "code": 200,
  "msg": "success",
  "data": { "list": [ /* 合并后的记录 */ ] }
}
```

**前端展示过滤**：`status === 2`（已取消）的记录从列表中剔除。

**记录状态 `status`**（UI 文案）：

| 值 | 展示 |
|----|------|
| 0 | 显示「取消预约」按钮 |
| 2 | 已取消（不展示在列表） |
| 3 | 「已签到」 |

**取消预约**（记录页，团课/私教通用）：

```
PUT /member/v1/class/booking?id={id}&idType={type}
```

| 参数 | 说明 |
|------|------|
| `id` | 合并列表项的 `id` |
| `idType` | 合并列表项的 `type`（`1` 私教 / `2` 团课） |

对应 `common.js` 导出 **`Se`**（与团课 Tab 取消不同：Tab 内团课取消写死 `idType: 2`）。

---

## 五、签到二维码（约课相关辅助）

```
GET /member/v1/class/qrcode?id={id}&idType={idType}
```

| Query | 说明 |
|-------|------|
| `id` | 预约/班次 ID |
| `idType` | `1` 私教 / `2` 团课（与合并列表 `type` 一致，记录页 `q$` 已确认） |

---

## 六、枚举（`common.js` 模块 1904）

**customerType（适用人群）**

| 值 | 文案 |
|----|------|
| 1 | 通用 |
| 2 | 成人 |
| 3 | 儿童 |

**课程类型 type（卡片 UI 色）**

| 值 | 含义 |
|----|------|
| 1 | 样式 1（蓝绿渐变） |
| 2 | 样式 2（黄渐变） |
| 3 | 样式 3（红渐变） |

**约课记录 type（合并列表）**

| 值 | 含义 |
|----|------|
| 1 | 私教 |
| 2 | 团课 |

**idType（取消 / 二维码）**

| 值 | 含义（推断） |
|----|----------------|
| 1 | 私教 |
| 2 | 团课 |

---

## 七、调用链简图

```
团课 Tab
  storeId ──► GET class/list ──► 展示班次
                │
                ├─► POST class/booking (classId [, cardId])
                └─► PUT  class/booking (id, idType=2)  取消

私教时间 Tab
  GET pt/store ──► 选门店
  GET pt/course ──► 选日期/课程
  GET pt/bookinglist ──► 选时段/教练
  POST pt/booking ──► 预检 → 选卡 → 再 POST 确认

约课记录（分包 pages/booking/index）
  date + pageSize ──► GET class/booking + GET class/ptbooking ──► rE 合并
        ├─► GET class/qrcode (id, idType=type)  签到
        └─► PUT class/booking (id, idType=type)  取消

私教教练预约（分包 pages/booking/pt-coach/index）
  pt/course ──► pt/bookinglist(+coachId) ──► POST pt/booking
```

---

## 八、说明与局限

1. **新账号 v29** 含约课分包 `_pages_booking_.wxapkg`，已合并反编译至 `unpacked/main/dec/pages/booking/`。  
2. **影展接口**（`GET class/movie`、`GET class/moviedetail`）与约课 Tab 无关，见 `common.js` 导出 `Bj`/`OH`。  
3. **响应细字段**：除文中列出的外，其余 nested 字段需结合运行时抓包补充。  
4. **错误码**：前端仅判断 `code === 200`，非 200 时展示 `msg`。
