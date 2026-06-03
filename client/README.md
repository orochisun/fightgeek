# FIGHT GEEK API Client

标准库实现，`python3 main.py` 即可，无需 `pip install`。

## 快速开始

```bash
cd /Users/orochisun/work/fightgeek/client

# 中文帮助 + 示例
python3 main.py -h
python3 main.py help-examples

# Token（三选一）
python3 get_token.py --paste "你的token"
export FGM_TOKEN="你的token"
echo '你的token' > .fgm_token
```

## 命令一览

| 命令 | 需登录 | 说明 |
|------|--------|------|
| `regions` | 否 | 城市列表 |
| `store-list --regional-id` | 否 | 门店列表 |
| `class-list --store-id` | 否 | 团课列表 |
| `book-group` | 是 | 团课预约 |
| `cancel-group` | 是 | 团课取消 |
| `pt-stores` | 是 | 私教门店 |
| `pt-coaches --store-id` | 是 | 私教教练 |
| `pt-course --store-id [--coach-id]` | 是 | 日期 + 课种 |
| `pt-slots` | 是 | 可约时段 |
| `pt-book` | 是 | 私教预约/预检 |
| `booking-records` | 是 | 约课记录 |
| `cancel-booking` | 是 | 取消预约 |
| `qrcode` | 是 | 签到码 |
| `ts` | 否 | 时间转 Unix 戳 |

## 私教完整示例

```bash
TOKEN="$(cat .fgm_token)"

# 默认 store=1101005  coach=163  course=5
python3 main.py --token "$TOKEN" pt-course
python3 main.py --token "$TOKEN" pt-slots --date 2026-06-06
python3 main.py --token "$TOKEN" pt-book --start-time "2026-06-06 21:00:00"
python3 main.py --token "$TOKEN" pt-book --start-time 1780750800 --card-id 5085
```

## 其它

- 接口文档：`../reverse/wx2e1deadc021eaeb9/docs/BOOKING_API.md`
- 抓 token：`capture/CAPTURE.md`、`get_token.py`
