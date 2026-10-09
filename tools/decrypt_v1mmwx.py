#!/usr/bin/env python3
"""Decrypt a desktop WeChat V1MMWX mini-program package.

Format reference: https://github.com/BlackTrace/pc_wxapkg_decrypt
Requires pycryptodome.
"""

import argparse
import hashlib
from pathlib import Path

from Crypto.Cipher import AES


def decrypt(data: bytes, app_id: str) -> bytes:
    if not data.startswith(b"V1MMWX") or len(data) < 1030:
        raise ValueError("expected a V1MMWX package of at least 1030 bytes")

    key = hashlib.pbkdf2_hmac("sha1", app_id.encode(), b"saltiest", 1000, 32)
    first_block = AES.new(key, AES.MODE_CBC, b"the iv: 16 bytes").decrypt(
        data[6:1030]
    )
    xor_key = ord(app_id[-2]) if len(app_id) >= 2 else 0x66
    result = first_block[:1023] + bytes(value ^ xor_key for value in data[1030:])
    if result[:1] != b"\xbe" or result[13:14] != b"\xed":
        raise ValueError("decryption failed: wxapkg header is invalid")
    return result


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("app_id", help="WeChat mini-program AppID")
    parser.add_argument("source", type=Path, help="encrypted .wxapkg")
    parser.add_argument("output", type=Path, help="decrypted .wxapkg")
    args = parser.parse_args()

    result = decrypt(args.source.read_bytes(), args.app_id)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_bytes(result)
    print(f"decrypted {len(result)} bytes -> {args.output}")


if __name__ == "__main__":
    main()
