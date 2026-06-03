#!/usr/bin/env python3
"""
从 Mac 微信本地 MMKV 读取 fgm_token。

用法:
  python3 get_token.py -v
  python3 get_token.py --user 987c68f36701646de50aed758477eac3
  python3 get_token.py --paste "你的Authorization值"

前提: 在 Mac 版微信（不是仅手机）打开并登录「FIGHT GEEK / 极斗」小程序。
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

APPID = "wx2e1deadc021eaeb9"
WECHAT_RADIUM = Path.home() / (
    "Library/Containers/com.tencent.xinWeChat/Data/Documents/app_data/radium/users"
)
JWT_RE = re.compile(rb"eyJ[A-Za-z0-9_\-]{8,}\.[A-Za-z0-9_\-]+\.[A-Za-z0-9_\-]+")
EXPIRE_RE = re.compile(rb"fgm_token_expire")
TOKEN_KEY_UTF8 = b"fgm_token"
TOKEN_KEY_UTF16 = "fgm_token".encode("utf-16-le")


def _jwt_candidates(data: bytes) -> list[str]:
    return [m.group().decode("ascii", errors="ignore") for m in JWT_RE.finditer(data)]


def _ascii_runs(data: bytes, min_len: int = 32) -> list[str]:
    runs: list[str] = []
    buf: list[int] = []
    for b in data:
        if 32 <= b < 127:
            buf.append(b)
        else:
            if len(buf) >= min_len:
                runs.append(bytes(buf).decode("ascii", errors="ignore"))
            buf = []
    if len(buf) >= min_len:
        runs.append(bytes(buf).decode("ascii", errors="ignore"))
    return runs


def _after_key_utf8(data: bytes) -> str | None:
    idx = data.find(TOKEN_KEY_UTF8)
    if idx < 0:
        return None
    window = data[idx : idx + 800]
    for jwt in _jwt_candidates(window):
        return jwt
    for s in _ascii_runs(window, min_len=20):
        if s != "fgm_token" and not s.startswith("fgm_token_expire"):
            return s
    return None


def _after_key_utf16(data: bytes) -> str | None:
    idx = data.find(TOKEN_KEY_UTF16)
    if idx < 0:
        return None
    window = data[idx : idx + 1600]
    # UTF-16-LE JWT: e y J ...
    try:
        text = window.decode("utf-16-le", errors="ignore")
    except Exception:
        return None
    m = re.search(r"eyJ[A-Za-z0-9_\-]{8,}\.[A-Za-z0-9_\-]+\.[A-Za-z0-9_\-]+", text)
    if m:
        return m.group(0)
    for part in text.split("\x00"):
        part = part.strip()
        if len(part) >= 20 and part not in ("fgm_token", "fgm_token_expire"):
            return part
    return None


def _find_expire(data: bytes) -> str | None:
    for pat in (rb"fgm_token_expire", "fgm_token_expire".encode("utf-16-le")):
        idx = data.find(pat)
        if idx < 0:
            continue
        window = data[idx : idx + 80]
        m = re.search(rb"(\d{10,11})", window)
        if m:
            return m.group(1).decode()
    return None


def scan_file(path: Path, verbose: bool) -> tuple[str | None, str | None, list[str]]:
    try:
        data = path.read_bytes()
    except OSError as e:
        if verbose:
            print(f"  跳过(无法读取): {path} ({e})", file=sys.stderr)
        return None, None, []

    if path.name.endswith(".crc") or len(data) == 0:
        return None, None, []

    hints: list[str] = []
    if verbose:
        print(f"  扫描: {path} ({len(data)} bytes)", file=sys.stderr)

    expire = _find_expire(data)
    token = _after_key_utf8(data) or _after_key_utf16(data)

    jwts = _jwt_candidates(data)
    if not token and jwts:
        token = jwts[0]
        hints.append(f"JWT@{path.name}")

    if verbose:
        if TOKEN_KEY_UTF8 in data or TOKEN_KEY_UTF16 in data:
            print("    含键名 fgm_token", file=sys.stderr)
        if jwts:
            print(f"    JWT 候选 {len(jwts)} 个", file=sys.stderr)
        if expire:
            print(f"    expire={expire}", file=sys.stderr)

    return token, expire, hints


def iter_storage_files(user_hash: str | None) -> list[Path]:
    files: list[Path] = []
    if not WECHAT_RADIUM.is_dir():
        return files

    users = [WECHAT_RADIUM / user_hash] if user_hash else sorted(WECHAT_RADIUM.iterdir())
    for user_dir in users:
        if not user_dir.is_dir():
            continue
        root = user_dir / "applet/local" / APPID
        if not root.is_dir():
            continue
        for p in sorted(root.rglob("*")):
            if p.is_file():
                files.append(p)
    return files


def find_token(user_hash: str | None, verbose: bool) -> tuple[str | None, str | None, list[Path]]:
    scanned: list[Path] = []
    best_token: str | None = None
    best_expire: str | None = None

    files = iter_storage_files(user_hash)
    if verbose:
        print(f"微信用户目录: {WECHAT_RADIUM}", file=sys.stderr)
        print(f"待扫描文件数: {len(files)}", file=sys.stderr)

    for path in files:
        scanned.append(path)
        token, expire, _ = scan_file(path, verbose)
        if expire and not best_expire:
            best_expire = expire
        if token:
            best_token = token
            if path.name.endswith(("usrmmkvstorage1/wx2e1deadc021eaeb9",)) or "usrmmkvstorage1" in str(path):
                return token, expire or best_expire, scanned

    return best_token, best_expire, scanned


def _diagnose(scanned: list[Path]) -> None:
    print(file=sys.stderr)
    print("可能原因:", file=sys.stderr)
    print("  1. 只在手机上用过，Mac 微信里没打开/登录过该小程序", file=sys.stderr)
    print("  2. Mac 微信里还没点「我的」完成 wx.login（需先登录一次）", file=sys.stderr)
    print("  3. 只有 .crc 没有 MMKV 数据文件（微信占用或未落盘）", file=sys.stderr)
    print(file=sys.stderr)

    data_files = [p for p in scanned if p.is_file() and not p.name.endswith(".crc")]
    mmkv = [p for p in data_files if "mmkv" in str(p) or "storage" in str(p)]
    if mmkv:
        print("本机 MMKV 相关文件:", file=sys.stderr)
        for p in mmkv:
            size = p.stat().st_size if p.exists() else 0
            print(f"  {p}  ({size} bytes)", file=sys.stderr)
    else:
        print(f"未找到: .../applet/local/{APPID}/usrmmkvstorage1/{APPID}", file=sys.stderr)

    print(file=sys.stderr)
    print("推荐改用（最可靠）:", file=sys.stderr)
    print("  Proxyman / Charles 抓 Mac 微信 HTTPS，过滤 mini.arfighter.com", file=sys.stderr)
    print("  打开小程序 → 点「约课记录」或「我的」", file=sys.stderr)
    print("  复制请求头 Authorization 的值", file=sys.stderr)
    print(file=sys.stderr)
    print("或手动粘贴:", file=sys.stderr)
    print('  python3 get_token.py --paste "你的token"', file=sys.stderr)


def main() -> int:
    parser = argparse.ArgumentParser(description="读取 FIGHT GEEK fgm_token")
    parser.add_argument("--user", help="微信用户 hash 目录名")
    parser.add_argument("-v", "--verbose", action="store_true", help="显示扫描细节")
    parser.add_argument("--paste", help="手动粘贴 Authorization / token")
    args = parser.parse_args()

    if args.paste:
        token = args.paste.strip().removeprefix("Bearer ").strip()
        print(f"fgm_token={token}")
        print()
        print(f'  python3 main.py --token "{token}" booking-records --year 2026 --month 6')
        return 0

    token, expire, scanned = find_token(args.user, args.verbose)
    if not token:
        print("未在本地缓存找到 fgm_token。", file=sys.stderr)
        _diagnose(scanned)
        return 1

    print(f"fgm_token={token}")
    if expire:
        print(f"fgm_token_expire={expire}")
    print()
    cmd = f'python3 main.py --token "{token}"'
    if expire:
        cmd += f" --token-expire {expire}"
    print(f"  {cmd} booking-records --year 2026 --month 6")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
