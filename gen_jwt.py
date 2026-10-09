#!/usr/bin/env python3
import argparse
import base64
import hashlib
import hmac
import json


HEADER = {"alg": "HS256", "typ": "JWT"}
PAYLOAD = {
    "exp": 1782723761,
    "iat": 1782118961,
    "jwtRoleType": 1,
    "jwtUserId": 3347,
}

# eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
# eyJleHAiOjE3ODI3MjM3NjEsImlhdCI6MTc4MjExODk2MSwiand0Um9sZVR5cGUiOjEsImp3dFVzZXJJZCI6MzM0N30.
# eCUsufABquWWdbLYO6ReQDJGYXfukEWaExaGD240dz8

# eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
# eyJleHAiOjE3ODI3ODc0MDYsImlhdCI6MTc4MjE4MjYwNiwiand0Um9sZVR5cGUiOjEsImp3dFVzZXJJZCI6MzM0N30.
# QscrC2frXx7GhKs9ZwErSu1cU9V8nXrkXAvCb_cK9MY


def b64url(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("ascii")


def json_b64url(value: dict) -> str:
    raw = json.dumps(value, separators=(",", ":"), ensure_ascii=False).encode("utf-8")
    return b64url(raw)


def build_jwt(secret: bytes) -> str:
    header_part = json_b64url(HEADER)
    payload_part = json_b64url(PAYLOAD)
    signing_input = f"{header_part}.{payload_part}".encode("ascii")
    signature = hmac.new(secret, signing_input, hashlib.sha256).digest()
    return f"{header_part}.{payload_part}.{b64url(signature)}"


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate the fixed HS256 JWT.")
    parser.add_argument("secret", help="HS256 secret used by the server")
    args = parser.parse_args()
    print(build_jwt(args.secret.encode("utf-8")))


if __name__ == "__main__":
    main()
