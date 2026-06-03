#!/bin/bash
# 启动抓包代理，自动提取 token
set -e
cd "$(dirname "$0")"

if ! command -v mitmdump >/dev/null 2>&1; then
  echo "未安装 mitmproxy。请先执行:"
  echo "  brew install mitmproxy"
  exit 1
fi

PORT="${PORT:-8080}"
echo "启动 mitmproxy，端口 ${PORT}"
echo "插件: extract_token.py（捕获 mini.arfighter.com 的 Authorization）"
echo ""
echo "请另开终端按 CAPTURE.md 配置系统代理与证书，然后在 Mac 微信操作小程序。"
echo "按 Ctrl+C 停止。"
echo ""

mitmdump -s extract_token.py -p "$PORT" --set block_global=false
