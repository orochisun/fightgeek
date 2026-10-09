#!/usr/bin/env python3
import re
import struct
import sys
from dataclasses import dataclass, field


def align4(n: int) -> int:
    return (n + 3) & ~3


class PickleReader:
    def __init__(self, data: bytes):
        if len(data) < 4:
            raise ValueError("pickle too short")
        self.payload_size = struct.unpack_from("<I", data, 0)[0]
        self.data = data
        self.pos = 4
        self.end = min(len(data), 4 + self.payload_size)

    def _take(self, n: int) -> bytes:
        if self.pos + n > self.end:
            raise ValueError("pickle underrun")
        out = self.data[self.pos:self.pos + n]
        self.pos += align4(n)
        return out

    def read_i32(self) -> int:
        return struct.unpack("<i", self._take(4))[0]

    def read_i64(self) -> int:
        return struct.unpack("<q", self._take(8))[0]

    def read_bool(self) -> bool:
        return bool(struct.unpack("<B", self._take(1))[0])

    def read_str(self) -> str:
        n = self.read_i32()
        if n < 0:
            raise ValueError("negative string length")
        raw = self._take(n)
        return raw.decode("utf-8", "replace")

    def read_str16(self) -> str:
        n = self.read_i32()
        if n < 0:
            raise ValueError("negative string16 length")
        raw = self._take(n * 2)
        return raw.decode("utf-16le", "replace")


@dataclass
class Tab:
    tab_id: int
    window_id: int | None = None
    visual_index: int | None = None
    selected_nav_index: int | None = None
    last_active_time: int | None = None
    navigations: dict[int, tuple[str, str, int]] = field(default_factory=dict)

    def current_nav(self):
        if not self.navigations:
            return None
        idx = self.selected_nav_index
        if idx in self.navigations:
            return self.navigations[idx]
        last_key = sorted(self.navigations)[-1]
        return self.navigations[last_key]


@dataclass
class Window:
    window_id: int
    selected_tab_index: int | None = None
    tabs: list[int] = field(default_factory=list)


def extract_urls(blob: bytes) -> list[str]:
    pat = re.compile(rb"(?:https?|chrome-extension|chrome|file)://[^\x00-\x20\"'<>\\]+")
    return [m.group(0).decode("utf-8", "replace") for m in pat.finditer(blob)]


def parse_snss(path: str):
    data = open(path, "rb").read()
    if data[:4] != b"SNSS":
        raise SystemExit(f"{path}: not an SNSS file")
    off = 8
    tabs: dict[int, Tab] = {}
    windows: dict[int, Window] = {}
    active_window: int | None = None
    commands = []
    unknown = {}

    def tab(tid: int) -> Tab:
        tabs.setdefault(tid, Tab(tid))
        return tabs[tid]

    def win(wid: int) -> Window:
        windows.setdefault(wid, Window(wid))
        return windows[wid]

    while off + 3 <= len(data):
        size = struct.unpack_from("<H", data, off)[0]
        if size == 0 or off + 2 + size > len(data):
            break
        cid = data[off + 2]
        contents = data[off + 3:off + 2 + size]
        commands.append(cid)
        try:
            if cid == 0 and len(contents) >= 8:
                wid, tid = struct.unpack_from("<ii", contents, 0)
                tab(tid).window_id = wid
                win(wid)
            elif cid == 2 and len(contents) >= 8:
                tid, idx = struct.unpack_from("<ii", contents, 0)
                tab(tid).visual_index = idx
            elif cid == 6:
                p = PickleReader(contents)
                tid = p.read_i32()
                nav_index = p.read_i32()
                url = p.read_str()
                title = p.read_str16()
                # Keep reading enough to get the persisted timestamp when present.
                _state = p.read_str()
                _transition = p.read_i32()
                timestamp = 0
                try:
                    _type_mask = p.read_i32()
                    _referrer = p.read_str()
                    _obsolete_referrer_policy = p.read_i32()
                    _original_request_url = p.read_str()
                    _overriding_ua = p.read_bool()
                    timestamp = p.read_i64()
                except Exception:
                    pass
                tab(tid).navigations[nav_index] = (url, title, timestamp)
            elif cid == 7 and len(contents) >= 8:
                tid, idx = struct.unpack_from("<ii", contents, 0)
                tab(tid).selected_nav_index = idx
            elif cid == 8 and len(contents) >= 8:
                wid, idx = struct.unpack_from("<ii", contents, 0)
                win(wid).selected_tab_index = idx
            elif cid == 16 and len(contents) >= 4:
                tid = struct.unpack_from("<i", contents, 0)[0]
                tabs.pop(tid, None)
            elif cid == 17 and len(contents) >= 4:
                wid = struct.unpack_from("<i", contents, 0)[0]
                windows.pop(wid, None)
            elif cid == 20 and len(contents) >= 4:
                active_window = struct.unpack_from("<i", contents, 0)[0]
                win(active_window)
            elif cid == 21 and len(contents) >= 16:
                tid = struct.unpack_from("<i", contents, 0)[0]
                ts = struct.unpack_from("<q", contents, 8)[0]
                tab(tid).last_active_time = ts
            else:
                unknown[cid] = unknown.get(cid, 0) + 1
        except Exception as e:
            unknown[f"{cid}:err:{type(e).__name__}"] = unknown.get(f"{cid}:err:{type(e).__name__}", 0) + 1
        off += 2 + size

    for t in tabs.values():
        if t.window_id in windows:
            windows[t.window_id].tabs.append(t.tab_id)
    for w in windows.values():
        w.tabs.sort(key=lambda tid: (tabs[tid].visual_index if tabs[tid].visual_index is not None else 1 << 30, tid))

    print(f"file={path}")
    print(f"commands={len(commands)} active_window={active_window} unknown={unknown}")
    for wid in sorted(windows):
        w = windows[wid]
        marker = "*" if wid == active_window else " "
        print(f"\n{marker} window {wid} selected_visual_index={w.selected_tab_index} tabs={len(w.tabs)}")
        selected_tid = None
        for tid in w.tabs:
            if tabs[tid].visual_index == w.selected_tab_index:
                selected_tid = tid
                break
        for tid in w.tabs:
            t = tabs[tid]
            nav = t.current_nav()
            url, title, ts = nav if nav else ("<no navigation>", "", 0)
            sel = "=>" if tid == selected_tid else "  "
            print(f"{sel} tab={tid} visual={t.visual_index} nav={t.selected_nav_index} last={t.last_active_time or 0} ts={ts} url={url}")
            if title:
                print(f"      title={title}")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit(f"usage: {sys.argv[0]} <SNSS file>")
    parse_snss(sys.argv[1])
