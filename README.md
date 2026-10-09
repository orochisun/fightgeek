# fightgeek

极斗相关微信小程序的逆向资料。这里有两个不同的小程序：**FightGeek Office** 内部管理系统，以及供会员约课使用的 **FIGHT GEEK / 极斗**。

## 目录

```
fightgeek/
├── client/                 # 会员约课 API 客户端
│   ├── fg.py               # 约课客户端入口
│   └── api/
├── office/                 # FightGeek Office 查询脚本
│   └── coach_schedule.py   # 教练课表
├── reverse/                # 逆向产物（勿与 client 混放）
│   ├── wxa0c17fdfe0665b9e/ # FightGeek Office 内部管理小程序
│   └── wx2e1deadc021eaeb9/
│       ├── applet-local*/
│       ├── applet-packages/
│       ├── unpacked/
│       ├── docs/BOOKING_API.md
│       └── SOURCE_PATHS.txt
└── tools/                  # 解密、解包工具链
```

## 快速使用（client）

```bash
cd client
python3 fg.py regions
python3 fg.py store-list --regional-id 1101
python3 fg.py class-list --store-id 1101014
```

上面的 `client/` 命令只对应约课小程序；接口说明见 `reverse/wx2e1deadc021eaeb9/docs/BOOKING_API.md`。FightGeek Office 的课表脚本见 `office/README.md`，包和页面索引见 `reverse/wxa0c17fdfe0665b9e/README.md`。
