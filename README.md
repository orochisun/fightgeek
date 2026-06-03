# fightgeek

FIGHT GEEK（极斗）微信小程序相关：逆向产物与 API 客户端分离存放。

## 目录

```
fightgeek/
├── client/                 # Python API 客户端（你写的代码）
│   ├── main.py             # 入口: python3 main.py ...
│   └── api/
├── reverse/                # 逆向产物（勿与 client 混放）
│   └── wx2e1deadc021eaeb9/
│       ├── applet-local*/
│       ├── applet-packages/
│       ├── unpacked/
│       ├── docs/BOOKING_API.md
│       └── SOURCE_PATHS.txt
└── tools/                  # 解包/反编译工具链
```

## 快速使用（client）

```bash
cd client
python3 main.py regions
python3 main.py store-list --regional-id 1101
python3 main.py class-list --store-id 1101014
```

接口说明见 `reverse/wx2e1deadc021eaeb9/docs/BOOKING_API.md`。
