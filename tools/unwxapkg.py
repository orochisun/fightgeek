#!/usr/bin/env python3
"""Unpack decrypted .wxapkg (format from Integ gist / wxapkg tools)."""
import sys
import os
import struct


class WxapkgFile:
    pass


def unpack(wxapkg_path: str, output_dir: str) -> int:
    with open(wxapkg_path, "rb") as f:
        first_mark = struct.unpack("B", f.read(1))[0]
        if first_mark != 0xBE:
            raise ValueError(f"not wxapkg: first mark = {first_mark:#x}")

        f.read(4)  # info1
        f.read(4)  # index_info_length
        f.read(4)  # body_info_length
        last_mark = struct.unpack("B", f.read(1))[0]
        if last_mark != 0xED:
            raise ValueError(f"not wxapkg: last mark = {last_mark:#x}")

        file_count = struct.unpack(">L", f.read(4))[0]
        file_list = []
        for _ in range(file_count):
            entry = WxapkgFile()
            entry.name_len = struct.unpack(">L", f.read(4))[0]
            entry.name = f.read(entry.name_len).decode("utf-8", errors="replace")
            entry.offset = struct.unpack(">L", f.read(4))[0]
            entry.size = struct.unpack(">L", f.read(4))[0]
            file_list.append(entry)

        os.makedirs(output_dir, exist_ok=True)
        for entry in file_list:
            out_path = os.path.join(output_dir, entry.name.lstrip("/"))
            os.makedirs(os.path.dirname(out_path), exist_ok=True)
            f.seek(entry.offset)
            with open(out_path, "wb") as w:
                w.write(f.read(entry.size))

    return file_count


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("usage: unwxapkg.py <wxapkg> <output_dir>")
        sys.exit(1)
    n = unpack(sys.argv[1], sys.argv[2])
    print(f"extracted {n} files -> {sys.argv[2]}")
