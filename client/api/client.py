"""FIGHT GEEK 小程序 HTTP 客户端（标准库，无需 pip 安装）。"""

from __future__ import annotations

import json as json_module
import time
import urllib.error
import urllib.parse
import urllib.request
from typing import Any


DEFAULT_BASE_URL = "https://mini.arfighter.com/fg"


class FightGeekClient:
    def __init__(
        self,
        token: str | None = None,
        *,
        token_expire: int | None = None,
        base_url: str = DEFAULT_BASE_URL,
        timeout: float = 30.0,
    ) -> None:
        self.base_url = base_url.rstrip("/")
        self.token = token
        self.token_expire = token_expire
        self.timeout = timeout

    def _resolve_url(self, path: str, params: dict[str, Any] | None = None) -> str:
        if path.startswith("http://") or path.startswith("https://"):
            url = path
        else:
            if not path.startswith("/"):
                path = "/" + path
            url = f"{self.base_url}{path}"
        if params:
            query = urllib.parse.urlencode(
                {k: v for k, v in params.items() if v is not None}
            )
            sep = "&" if "?" in url else "?"
            url = f"{url}{sep}{query}"
        return url

    def _ensure_token(self, *, skip_token: bool) -> str:
        if skip_token:
            return ""
        if not self.token:
            raise ValueError("Token is required for this request (set token= or use skip_token=True)")
        if self.token_expire is not None and self.token_expire < time.time():
            raise ValueError("Token has expired")
        return self.token

    def request(
        self,
        method: str,
        path: str,
        *,
        params: dict[str, Any] | None = None,
        json: dict[str, Any] | None = None,
        skip_token: bool = False,
        headers: dict[str, str] | None = None,
    ) -> dict[str, Any]:
        """发起请求，返回 API JSON 体 ``{code, msg, data}``。"""
        url = self._resolve_url(path, params)
        req_headers = {"Accept": "application/json", **(headers or {})}
        token = self._ensure_token(skip_token=skip_token)
        if token:
            req_headers["Authorization"] = token

        data: bytes | None = None
        if json is not None:
            data = json_module.dumps(json).encode("utf-8")
            req_headers["Content-Type"] = "application/json"

        req = urllib.request.Request(
            url,
            data=data,
            headers=req_headers,
            method=method.upper(),
        )
        try:
            with urllib.request.urlopen(req, timeout=self.timeout) as resp:
                raw = resp.read().decode("utf-8")
        except urllib.error.HTTPError as e:
            raw = e.read().decode("utf-8", errors="replace")
            raise urllib.error.HTTPError(
                e.url, e.code, f"{e.reason}: {raw}", e.headers, e.fp
            ) from e

        body = json_module.loads(raw)
        if not isinstance(body, dict):
            raise TypeError(f"Expected JSON object, got {type(body).__name__}")
        return body
