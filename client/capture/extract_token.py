#!/usr/bin/env python3
"""
mitmproxy 插件：自动抓取 FIGHT GEEK 的 token。

启动（需先安装 mitmproxy: brew install mitmproxy）:

  cd client/capture
  mitmdump -s extract_token.py -p 8080 --set block_global=false

然后按 CAPTURE.md 配置 Mac 代理与证书，在微信里操作小程序。
"""

from __future__ import annotations

import json
import sys
from datetime import datetime
from pathlib import Path

HOST = "mini.arfighter.com"
TOKEN_FILE = Path(__file__).resolve().parent.parent / ".fgm_token"
EXPIRE_FILE = Path(__file__).resolve().parent.parent / ".fgm_token_expire"


def _save(token: str, expire: str | None = None) -> None:
    TOKEN_FILE.write_text(token.strip(), encoding="utf-8")
    print("\n" + "=" * 60)
    print("已捕获 fgm_token，已写入:")
    print(f"  {TOKEN_FILE}")
    if expire:
        EXPIRE_FILE.write_text(str(expire), encoding="utf-8")
        print(f"  {EXPIRE_FILE} (expire={expire})")
    print()
    print("下一步:")
    print(f'  cd {TOKEN_FILE.parent}')
    print(f'  python3 main.py --token "$(cat .fgm_token)" booking-records --year 2026 --month 6')
    print("=" * 60 + "\n", flush=True)


def _try_login_body(content: bytes) -> None:
    try:
        body = json.loads(content)
    except (json.JSONDecodeError, UnicodeDecodeError):
        return
    data = body.get("data") if isinstance(body, dict) else None
    if not isinstance(data, dict):
        return
    token = data.get("accessToken")
    expire = data.get("accessExpire")
    if token:
        _save(str(token), str(expire) if expire is not None else None)


class FightGeekCapture:
    def _handle(self, flow) -> None:
        req = flow.request
        if HOST not in (req.host or ""):
            return

        auth = req.headers.get("Authorization") or req.headers.get("authorization")
        if auth and auth.strip():
            _save(auth.strip())

    def request(self, flow) -> None:
        self._handle(flow)

    def response(self, flow) -> None:
        self._handle(flow)
        req = flow.request
        if flow.response and flow.response.content and req.path:
            if "wxMiniLogin" in req.path or "wxMiniRegister" in req.path:
                _try_login_body(flow.response.content)


addons = [FightGeekCapture()]
