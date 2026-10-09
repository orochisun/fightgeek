# Chrome macOS Widget Activation Bundle

这个目录集中存放本次 Chrome macOS crash 分析相关的文档、PoC/验证页和辅助工具。

## docs

- `chrome_mac_widget_activation_combined_report_zh.md`
  - 合并后的主报告。优先看这个。
  - 内容包括崩溃现场、反汇编和源码对应、释放路径、`TabDialogManager` 上层链路、FedCM 候选、验证状态和修复建议。
- `chrome_mac_widget_activation_status_zh.md`
  - 现状梳理版报告，保留分析过程中的边界和未确认点。
- `chrome_mac_widget_activation_uaf_report_zh.md`
  - 早期根因报告，重点是底层 `NativeWidgetMac::OnWindowKeyStatusChanged()` UAF 风险。

## poc

- `fedcm_tab_dialog_repro_server.py`
  - 本地 HTTPS RP/IdP FedCM 测试服务。
  - 当前最贴近 `TabDialogManager` 真实路径的验证基础，但普通 chooser 流程尚未稳定复现 crash。
- `fedcm_repro_cert.pem` / `fedcm_repro_key.pem`
  - 上面 FedCM 本地 HTTPS 服务使用的证书和私钥。
- `chrome_focus_close_app.html`
  - focus/close 行为验证页。
- `chrome_widget_activation_direct_repro.html`
  - 直接模拟 widget activation 相关 UI 行为的验证页。
- `chrome_window_close_repro.html` / `chrome_window_close_child.html`
  - 窗口打开/关闭链路验证页。
- `chrome_webauthn_abort_repro.html`
  - WebAuthn abort/focus 相关候选验证页。

## tools

- `parse_chrome_snss.py`
  - Chrome SNSS session 文件解析脚本。
- `parse_chrome_tabrestore_snss.py`
  - Chrome tab restore/session 文件解析脚本，用于还原 crash 附近前台 tab 线索。

## 当前状态

已确认底层崩溃点和 `TabDialogManager` 上层路径；FedCM active/modal dialog 是当前证据最强的候选，但尚未稳定复现。后续验证应优先构造 no-click FedCM active/modal/login close + auto re-authn 流程，避免随机点击或压力测试。
