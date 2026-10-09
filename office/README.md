# FightGeek Office 教练课表查询

脚本：[coach_schedule.py](coach_schedule.py)。使用 Python 标准库和系统 `curl`，请求的是 **FightGeek Office** 管理接口。

```bash
python3 office/coach_schedule.py
```

默认读取本地的 `office/.office_token`，从 Office 的 `/user/detail` 获取当前职员 ID，然后查询本周与下周的课表。`FG_OFFICE_TOKEN` 环境变量和 `--token-file` 可覆盖本地默认值；如果都没有设置，终端会隐式提示输入 token。

```bash
python3 office/coach_schedule.py --token-file /path/to/office-token.txt
```

常用选项：

```bash
python3 office/coach_schedule.py --week 2026-10-05 --weeks 1
python3 office/coach_schedule.py --coach-id 1234 --weeks 2
python3 office/coach_schedule.py --pt-only
python3 office/coach_schedule.py --json
```

`--week` 可填目标周任意一天；请求中的 `date` 使用该周周一 00:00（北京时间）的 Unix 秒值。`--coach-id` 仅在已确认教练 ID 时使用；默认先查询职员身份，避免拿会员 ID 得到误导性的空课表。`--pt-only` 对普通输出和 `--json` 都生效。开发或体验版可加 `--env test`。

如果服务器返回的不是 JSON，脚本会在错误信息中打印 HTTP 状态码和完整响应正文。

## 报表与统计接口

[report_api.py](report_api.py) 提供 [Office 报表接口文档](../reverse/wxa0c17fdfe0665b9e/docs/REPORT_API.md) 中的 16 个查询与报表地址接口：10 个报表/分析接口和 6 个相关统计接口。每个接口是一个子命令；执行 `python3 office/report_api.py --help` 可查看全部命令，执行 `python3 office/report_api.py <子命令> --help` 可查看所需参数。`--env`、`--token-file` 和 `--timeout` 这类全局选项放在子命令前。

```bash
python3 office/report_api.py dashboard-rank
python3 office/report_api.py coach-flow
python3 office/report_api.py coach-flow --days 365
python3 office/report_api.py sales-flow --payment-type 1
python3 office/report_api.py coach-flow-detail --user-id 1234
```

默认门店由脚本顶部的 `DEFAULT_STORE_ID` 指定；门店 ID 对照表见 [教练名录的门店表](../reports/fightgeek-coaches-2026-09-29.md#门店)。`dashboard-rank` 不使用 `storeId`，它的区域 `0`、云联品牌 `-1`、排行类型 `1` 和“今日”时间值沿用首页代码；其余带时间范围的接口默认查询本月 1 日至当前时间。`staffId=0`、`paymentType=0`、`courseType=0`、`mode=1` 及其他报表的 `queryType=1` 等只是方便试用的默认筛选值，报表分包未缓存，暂不能确认它们在各页面中的业务含义。所有默认值都可以用对应选项覆盖；`coach-flow-detail` 的 `--user-id`、`dashboard-report` 的 `--report-type` 和 `--query-param` 仍需手动提供。

带起止时间的接口可用 `--days 365` 查询过去 365 天；该选项会覆盖同一命令中的 `--from`、`--to` 或 `--start-time`、`--end-time`。脚本对手动传入的 GET 时间参数原样编码，不自动转换日期。两个 POST 子命令要求参数是 JSON 字面量，例如 `--store-id '[1101010]'`、`--query-param '{"storeId":1101010}'`。报表分包的时间单位仍待确认；默认时间和 `--days` 按 Unix 秒生成。

token 读取顺序：`--token-file`、`FG_OFFICE_TOKEN`、`office/.office_token`、脚本内置默认值。输出完整 JSON 响应；若服务器返回非 JSON，则打印完整原文及 HTTP 状态码。服务端返回错误时脚本退出码为 1。
