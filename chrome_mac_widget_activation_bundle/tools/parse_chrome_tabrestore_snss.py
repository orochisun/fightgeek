#!/usr/bin/env python3
import struct
import sys
from dataclasses import dataclass, field

from parse_chrome_snss import PickleReader


@dataclass
class RestoreTab:
    tab_id: int
    selected_nav_index: int
    timestamp: int
    navigations: list[tuple[str, str, int]] = field(default_factory=list)


@dataclass
class RestoreWindow:
    window_id: int
    selected_tab_index: int
    num_tabs: int
    timestamp: int
    tabs: list[RestoreTab] = field(default_factory=list)


def parse_nav(contents: bytes) -> tuple[int, int, str, str, int]:
    p = PickleReader(contents)
    tab_id = p.read_i32()
    nav_index = p.read_i32()
    url = p.read_str()
    title = p.read_str16()
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
    return tab_id, nav_index, url, title, timestamp


def parse_window(contents: bytes) -> RestoreWindow:
    p = PickleReader(contents)
    window_id = p.read_i32()
    selected_tab_index = p.read_i32()
    num_tabs = p.read_i32()
    timestamp = p.read_i64()
    return RestoreWindow(window_id, selected_tab_index, num_tabs, timestamp)


def parse_selected_tab(contents: bytes) -> tuple[int, int, int]:
    # SelectedNavigationInTabPayload2: int32 id, int32 index, int64 timestamp.
    if len(contents) >= 16:
        tab_id, index = struct.unpack_from("<ii", contents, 0)
        timestamp = struct.unpack_from("<q", contents, 8)[0]
        return tab_id, index, timestamp
    tab_id, index = struct.unpack_from("<ii", contents, 0)
    return tab_id, index, 0


def parse(path: str):
    data = open(path, "rb").read()
    if data[:4] != b"SNSS":
        raise SystemExit(f"{path}: not an SNSS file")

    entries = []
    current_window: RestoreWindow | None = None
    remaining_tabs = 0
    current_tab: RestoreTab | None = None
    off = 8
    counts = {}

    while off + 3 <= len(data):
        size = struct.unpack_from("<H", data, off)[0]
        if size == 0 or off + 2 + size > len(data):
            break
        cid = data[off + 2]
        contents = data[off + 3:off + 2 + size]
        counts[cid] = counts.get(cid, 0) + 1
        try:
            if cid == 9:
                current_window = parse_window(contents)
                remaining_tabs = current_window.num_tabs
                entries.append(current_window)
                current_tab = None
            elif cid == 4:
                tab_id, index, ts = parse_selected_tab(contents)
                current_tab = RestoreTab(tab_id, index, ts)
                if current_window and remaining_tabs > 0:
                    current_window.tabs.append(current_tab)
                    remaining_tabs -= 1
                    if remaining_tabs == 0:
                        current_window = None
                else:
                    entries.append(current_tab)
            elif cid == 1 and current_tab:
                tab_id, _nav_index, url, title, ts = parse_nav(contents)
                current_tab.navigations.append((url, title, ts))
        except Exception as e:
            print(f"parse_error off={off:x} cid={cid} {type(e).__name__}: {e}", file=sys.stderr)
        off += 2 + size

    print(f"file={path}")
    print(f"counts={counts}")
    for ei, entry in enumerate(entries):
        if isinstance(entry, RestoreWindow):
            print(f"\nwindow_entry[{ei}] id={entry.window_id} selected_tab_index={entry.selected_tab_index} num_tabs={entry.num_tabs} ts={entry.timestamp}")
            for i, tab in enumerate(entry.tabs):
                marker = "=>" if i == entry.selected_tab_index else "  "
                nav = tab.navigations[tab.selected_nav_index] if 0 <= tab.selected_nav_index < len(tab.navigations) else (tab.navigations[-1] if tab.navigations else ("<no navigation>", "", 0))
                print(f"{marker} idx={i} tab={tab.tab_id} selected_nav={tab.selected_nav_index} tab_ts={tab.timestamp} nav_ts={nav[2]} url={nav[0]}")
                if nav[1]:
                    print(f"      title={nav[1]}")
        else:
            nav = entry.navigations[entry.selected_nav_index] if 0 <= entry.selected_nav_index < len(entry.navigations) else (entry.navigations[-1] if entry.navigations else ("<no navigation>", "", 0))
            print(f"\ntab_entry[{ei}] tab={entry.tab_id} selected_nav={entry.selected_nav_index} tab_ts={entry.timestamp} nav_ts={nav[2]} url={nav[0]}")
            if nav[1]:
                print(f"      title={nav[1]}")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit(f"usage: {sys.argv[0]} <SNSS tab-restore file>")
    parse(sys.argv[1])
