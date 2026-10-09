# Chrome macOS Widget Activation Crash 合并分析报告

## 基本信息

- 应用：Google Chrome
- 版本：149.0.7827.115
- 平台：macOS 26.5, ARM64
- 崩溃时间：2026-06-22 14:06:45 +0800
- 崩溃线程：Thread 0, `CrBrowserMain`
- 异常：`EXC_BAD_ACCESS (SIGSEGV)`, `KERN_INVALID_ADDRESS at 0x40`
- 合并来源：
  - `chrome_mac_widget_activation_uaf_report_zh.md`
  - `chrome_mac_widget_activation_status_zh.md`

## 当前结论

当前证据可以确认：这次崩溃落在 Chrome Views 的 macOS widget activation 路径。底层 bug 形态是 `views::NativeWidgetMac::OnWindowKeyStatusChanged()` 在一次同步 activation 回调前缓存了裸 `Widget*`，回调期间该 `Widget` 可能被关闭或销毁，回调返回后函数继续使用旧指针并调用虚函数，最终在读取无效 vtable slot 时崩溃。

当前还不能确认的是：真实用户场景里到底是哪一个生产 UI 对象在 activation 回调期间关闭/销毁了这个 `Widget`。从符号化栈看，上层路径已经进入 `tabs::TabDialogManager::TabDidEnterForeground()` / `UpdateDialogVisibility()`，所以追查范围应集中在 tab-scoped dialog / tab-modal dialog。FedCM active/modal dialog 是目前证据最强的候选，但尚未稳定复现。

## 崩溃现场

关键寄存器：

```text
far: 0x0000000000000040
x21: 0x0000013c16835100
x8:  0x0000000000000000
pc:  0x0000000108394c7c
```

符号化后的关键栈：

```text
views::NativeWidgetMac::OnWindowKeyStatusChanged(bool, bool)
-[ViewsNSWindowDelegate windowDidBecomeKey:]
-[NativeWidgetMacNSWindow makeKeyAndOrderFront:]
remote_cocoa::NativeWidgetNSWindowBridge::SetVisibilityState(...)
views::NativeWidgetMac::Show(...)
views::Widget::Show()
tabs::TabDialogManager::UpdateDialogVisibility(...)
tabs::TabDialogManager::TabDidEnterForeground(...)
BrowserView::OnActiveTabChanged(...)
TabStripModel::ActivateTabAt(...)
BrowserTabStripController::SelectTab(...)
TabStrip::SelectTab(...)
Tab::OnMousePressed(...)
```

这说明崩溃不是 renderer 进程里网页 JS 直接造成的，而是 browser process 主线程 UI 代码崩溃。上层经过 `TabDialogManager`，即某个 tab 关联 dialog 在 tab 进入前台时被 show/focus。

## 反汇编与源码对应

崩溃地址对应 Chrome Framework text offset `0x2d38c7c`。反汇编关键片段：

```asm
0x2d38c5c: ldr    x21, [x19, #0x38]   ; x21 = Widget*
0x2d38c68: mov    x0, x21
0x2d38c6c: bl     0x2d38de4            ; Widget::OnNativeWidgetActivationChanged(is_key)
0x2d38c70: cbz    w0, 0x2d38cc8
0x2d38c74: ldr    x8, [x21]            ; read Widget vptr
0x2d38c78: cbz    w20, 0x2d38ca0
0x2d38c7c: ldr    x8, [x8, #0x40]      ; crash, x8 == 0
0x2d38c80: mov    x0, x21
0x2d38c84: blr    x8                   ; virtual call: OnNativeFocus()
```

`far = 0x40` 与 `x8 = 0` 对得上：代码先从 `Widget*` 读 vptr 到 `x8`，但读出的 vptr 为 0，随后读 `[x8 + 0x40]`，所以 fault address 是 `0x40`。这不是普通空 `Widget*`，而是 `Widget*` 非空但对象状态已经无效。

对应 Chromium 源码：

`/tmp/chromium-grep-149/ui/views/widget/native_widget_mac.mm:178`

```cpp
void NativeWidgetMac::OnWindowKeyStatusChanged(
    bool is_key,
    bool is_content_first_responder) {
  Widget* widget = GetWidget();
  if (!widget || !widget->OnNativeWidgetActivationChanged(is_key)) {
    return;
  }

  if (is_key) {
    widget->OnNativeFocus();
    widget->GetFocusManager()->RestoreFocusedView();
  } else {
    widget->OnNativeBlur();
    widget->GetFocusManager()->StoreFocusedView(false);
    parent_key_lock_.reset();
  }
}
```

问题点：`Widget* widget` 在 `OnNativeWidgetActivationChanged()` 前取出，回调返回后没有重新通过 `WeakPtr` 或 `GetWidget()` 校验生命周期。

## 释放路径分析

真正的释放不是发生在 `NativeWidgetMac::OnWindowKeyStatusChanged()` 内部，而是发生在它调用的同步回调中：

```text
NativeWidgetMac::OnWindowKeyStatusChanged(true)
  -> Widget::OnNativeWidgetActivationChanged(true)
     -> observers_.Notify(OnWidgetActivationChanged)
     -> AnyWidgetObserverSingleton::OnAnyWidgetActivated
     -> WidgetObserver::OnWidgetTreeActivated
     -> 某个 UI controller / bubble / popup / dialog 关闭 widget
        -> Widget::CloseWithReason() 或 Widget::CloseNow()
        -> NativeWidgetMac::CloseNow() / native teardown
        -> Widget::OnNativeWidgetDestroyed()
        -> Widget::HandleWidgetDestroyed()
        -> WidgetDelegate::DeleteDelegate()
        -> owner reset / delegate delete / weak ptr invalidation
  -> 返回 OnWindowKeyStatusChanged()
  -> 继续使用旧的裸 Widget*
  -> 读取 vptr 崩溃
```

`Widget::OnNativeWidgetActivationChanged()` 会同步派发 observer：

`/tmp/chromium-grep-149/ui/views/widget/widget.cc:1893`

```cpp
bool Widget::OnNativeWidgetActivationChanged(bool active) {
  if (!ShouldHandleNativeWidgetActivationChanged(active)) {
    return false;
  }

  if (!active && native_widget_initialized_) {
    SaveWindowPlacement();
  }

  observers_.Notify(&WidgetObserver::OnWidgetActivationChanged, this, active);

  if (active) {
    internal::AnyWidgetObserverSingleton::GetInstance()->OnAnyWidgetActivated(
        this);

    base::AutoReset<bool> is_traversing_widget_tree(&is_traversing_widget_tree_,
                                                    true);
    Widget* root = nullptr;
    for (Widget* widget = this; widget; widget = widget->parent()) {
      widget->observers_.Notify(&WidgetObserver::OnWidgetTreeActivated, widget,
                                this);
      root = widget;
    }
  }
  ...
}
```

Chromium 自己的测试证明 activation callback 期间关闭 widget 是合法存在的场景：

`/tmp/chromium-grep-149/ui/views/widget/desktop_aura/desktop_window_tree_host_platform_unittest.cc:143`

```cpp
class CloseOnActivationWidgetObserver : public WidgetObserver {
 public:
  explicit CloseOnActivationWidgetObserver(Widget* widget) {
    observation_.Observe(widget);
  }

  void OnWidgetActivationChanged(Widget* widget, bool active) override {
    observation_.Reset();
    widget->CloseNow();
  }
};
```

`Widget::OnNativeWidgetDestroyed()` 也用 `WeakPtr` 判断自身是否已经在销毁过程中被删除：

`/tmp/chromium-grep-149/ui/views/widget/widget.cc:2019`

```cpp
void Widget::OnNativeWidgetDestroyed() {
  widget_closed_ = true;
  auto weak_this = GetWeakPtr();
  HandleWidgetDestroyed();
  ...
  if (weak_this && override_close_) {
    std::move(override_close_).Run(closed_reason());
  }
}
```

这说明 close/destroy 路径本身是可重入且会删除对象的。`NativeWidgetMac::OnWindowKeyStatusChanged()` 没有做同等级别的回调后校验。

## 上层 TabDialogManager 路径

符号化栈显示上层进入了 `tabs::TabDialogManager`。

`/tmp/chromium-grep-149/chrome/browser/ui-all/tabs/tab_dialog_manager.cc:315`

```cpp
void TabDialogManager::ShowDialog(views::Widget* widget,
                                  std::unique_ptr<Params> params) {
  ...
  widget_ = widget;
  params_ = std::move(params);
  ...
  if (GetHostWidget()->ShouldPaintAsActive()) {
    widget_->Show();
  } else {
    widget->ShowInactive();
  }

  UpdateDialogVisibility();
}
```

tab 进入前台时：

`/tmp/chromium-grep-149/chrome/browser/ui-all/tabs/tab_dialog_manager.cc:532`

```cpp
void TabDialogManager::TabDidEnterForeground(TabInterface* tab_interface) {
  if (widget_) {
    web_contents_modal_dialog_host_observer_ =
        std::make_unique<WebContentsModalDialogHostObserver>(this,
                                                             tab_interface_);
    auto* parent_widget = GetHostWidget();
    if (parent_widget != widget_->parent()) {
      widget_->Reparent(parent_widget);
    }
    UpdateDialogVisibility();
    UpdateModalDialogBounds();
  }
}
```

`UpdateDialogVisibility()` 会直接改变 widget 可见性：

`/tmp/chromium-grep-149/chrome/browser/ui-all/tabs/tab_dialog_manager.cc:482`

```cpp
bool TabDialogManager::UpdateDialogVisibility(
    std::optional<bool> requested_visibility) {
  if (widget_) {
    widget_->SetVisible(GetDialogWidgetVisibility() &&
                        requested_visibility.value_or(true));
    return widget_->IsVisible();
  }
  return false;
}
```

因此当前合理的追查范围是：会被 `TabDialogManager` 管理、会在 tab 前后台切换时 show/hide、并且可能在 activation/modal 状态变化里关闭自身或相关 widget 的 dialog。

## 可能触发释放的 UI 路径

Crash dump 没有包含 `x21 = 0x13c16835100` 对应 heap page，因此不能唯一还原具体 C++ 动态类型。但源码中存在多条可以在 activation / close-on-deactivate 路径中同步关闭 `Widget` 的生产路径。

### Extension popup

`ExtensionPopup::OnWidgetTreeActivated()` 会在同一 widget tree 中其他 widget 激活时关闭 popup：

```cpp
if (active_widget != GetWidget()) {
  CloseUnlessBlockedByInspectionOrJSDialog();
}
```

随后：

```cpp
CloseDeferredIfNecessary(views::Widget::ClosedReason::kLostFocus);
```

Mac 上这里还专门判断 `base::message_pump_apple::IsHandlingSendEvent()` 并延迟 close，注释说明是为了避免 messaging deallocated objects。这说明 Chromium 已知该区域存在 nested event / deallocated object 风险。

### Bubble/Dialog close-on-deactivate

通用 `BubbleDialogDelegate` 在失活时会：

```cpp
GetWidget()->CloseWithReason(views::Widget::ClosedReason::kLostFocus);
```

这类路径主要解释同类风险；本次崩溃处在 `is_key=true` 分支，不能单独断言它就是本次唯一触发者。

### MakeCloseSynchronous widget

部分 Chrome UI 使用 `Widget::MakeCloseSynchronous()` 将 `CloseWithReason()` 转换为同步 owner reset。例如 omnibox popup：

```cpp
widget_->MakeCloseSynchronous(base::BindOnce(
    &OmniboxPopupPresenterBase::OnWidgetClosed, base::Unretained(this)));
```

回调中：

```cpp
widget_.reset();
```

这类对象一旦在 activation 回调中被关闭，会立即让外层裸 `Widget*` 失效。

## 当前最强候选：FedCM modal dialog

FedCM 候选不是凭空猜的，理由如下。

第一，FedCM account selection view 在 modal 类型下明确创建“functionally a tab-modal dialog”：

`/tmp/chromium-grep-149/chrome/browser/ui/views/webid/fedcm_account_selection_view_desktop.cc:1128`

```cpp
std::unique_ptr<views::Widget> FedCmAccountSelectionView::CreateDialogWidget() {
  ...
  if (dialog_type_ == DialogType::BUBBLE) {
    ...
  } else {
    // Create and show the dialog widget. This is functionally a tab-modal
    // dialog.
    widget_delegate_ = std::make_unique<AccountSelectionModalDelegate>(...);
    ...
    dialog_widget = base::WrapUnique(views::DialogDelegate::CreateDialogWidget(
        widget_delegate_.get()->AsDialogDelegate(),
        /*context=*/gfx::NativeWindow(),
        /*parent=*/top_level_widget->GetNativeView()));
  }
  ...
}
```

第二，它确实通过 `TabDialogManager` show：

`/tmp/chromium-grep-149/chrome/browser/ui/views/webid/fedcm_account_selection_view_desktop.cc:1179`

```cpp
void FedCmAccountSelectionView::ShowDialog(
    views::Widget* widget,
    std::unique_ptr<tabs::TabDialogManager::Params> params) {
  tab_->GetTabFeatures()->tab_dialog_manager()->ShowDialog(widget,
                                                           std::move(params));
}
```

第三，FedCM modal/popup/login/auto re-authn 状态机里存在 close 后继续推进状态的敏感路径：

`/tmp/chromium-grep-149/chrome/browser/ui/views/webid/fedcm_account_selection_view_desktop_browsertest.cc:215`

```cpp
IN_PROC_BROWSER_TEST_F(FedCmAccountSelectionViewBrowserTest,
                       ModalDialogThenShowThenCloseModalDialog) {
  PreShow();
  delegate_->SetAccountSelectedCallback(base::BindOnce(
      &FedCmAccountSelectionViewBrowserTest::ResetAccountSelectionView,
      base::Unretained(this)));
  account_selection_view_->ShowModalDialog(GURL("https://rp-example.com"),
                                           blink::mojom::RpMode::kPassive,
                                           base::DoNothing());
  // Because a modal dialog is up, this should save the accounts for later.
  ShowVerifyingDialog(Account::SignInMode::kAuto);
  // This should trigger auto re-authn without crashing or UAF.
  account_selection_view_->CloseModalDialog();
  EXPECT_EQ(account_selection_view_->state_,
            FedCmAccountSelectionView::State::AUTO_REAUTHN);
}
```

这不是说该测试就是本次 crash 的直接复现，而是说明 FedCM modal dialog 的设计确实有“modal 打开期间保存后续 account flow、关闭 modal 后触发 auto re-authn”的复杂生命周期场景，并且 Chromium 明确担心“不崩溃或 UAF”。

## FedCM 自动触发条件

FedCM active mode 在用户未登录 IdP 或登录状态未知时，会走 active-mode modal/login 流：

`/tmp/chromium-src-sparse/content/browser/webid/accounts_fetcher.cc:275`

```cpp
if (idp_info->has_failing_idp_signin_status) {
  if (params_.rp_mode == blink::mojom::RpMode::kActive) {
    result.show_active_mode_modal_dialog = true;
    result.idp_info = std::move(idp_info);
    AddResult(std::move(result));
    continue;
  }
}
```

未知登录状态也会触发 active modal：

`/tmp/chromium-src-sparse/content/browser/webid/accounts_fetcher.cc:631`

```cpp
if (!old_idp_signin_status.has_value()) {
  if (params_.rp_mode == blink::mojom::RpMode::kActive) {
    Result res;
    res.idp_config_url = idp_info->provider->config->config_url;
    res.show_active_mode_modal_dialog = true;
    ...
    AddResult(std::move(res));
    return;
  }
}
```

真正的 auto re-authn 又要求浏览器侧存在 sharing permission 或第三方 Cookie 访问例外：

`/tmp/chromium-src-sparse/content/browser/webid/request.cc:2563`

```cpp
bool Request::GetAccountForAutoReauthn(...) {
  ...
  if (!HasSharingPermissionOrIdpHasThirdPartyCookiesAccess(
          render_frame_host(),
          account->identity_provider->idp_metadata.config_url,
          GetEmbeddingOrigin(), origin(), account->id, permission_delegate_,
          api_permission_delegate_)) {
    continue;
  }
  ...
}
```

sharing permission 最终按 `chosen-objects` 写入 content setting。因此后续 no-click PoC 的方向应是构造：

1. RP 页面加载即调用 active FedCM。
2. IdP config 提供 `login_url`，让 Chrome 打开 FedCM active modal/login popup。
3. 登录页自动完成登录状态变更并调用 `IdentityProvider.close()` 或等价路径。
4. profile 中预置或真实产生 `fedcm_share`，让 auto re-authn 条件成立。
5. 使用 CDP `Page.bringToFront` / `Target.createTarget` 或页面脚本做 tab foreground/background，不使用鼠标点击。

## 已做过的验证

已做过一次低强度、非压力的 FedCM 普通 chooser 测试：

- 使用 Chrome for Testing 149.0.7827.115。
- 本地 HTTPS RP/IdP：`https://127.0.0.1:9443` 和 `https://127.0.0.1:9444`。
- 页面自动调用 FedCM request。
- 自动打开 return/hold tab，制造 tab 前后台切换。
- 结果：FedCM chooser 可以出现，tab 切换链条可以走通，但没有 crash。

这个结果说明普通 pending chooser + tab 切换不足以触发本次崩溃。它没有推翻底层 UAF 判断，只说明当前 PoC 没覆盖到必要状态组合，例如 modal login close、auto re-authn、permission/state transition 等。

## 用户真实会话线索

从 Chrome Session/Tabs 恢复文件解析到的线索：

```text
window_entry[24] id=2093620786 selected_tab_index=10 num_tabs=11
=> idx=10 tab=2093620797
   nav_ts=13426582000810502
   url=https://www.google.com/search?q=...
   title=芒果皮可以吃吗 - Google 搜索
```

该导航时间约为 `2026-06-22 14:06:40.810502 +0800`，距离 crash 时间 `2026-06-22 14:06:45.565 +0800` 约 4.75 秒。

这个线索只能说明 crash 前台 tab 是 Google 搜索页，不能直接证明具体 dialog 类型。Session 文件不包含崩溃时 `Widget` 对象、dialog class 或 heap 内容。

## 可以确认与不能确认

可以确认：

- 崩溃发生在 browser process 主线程 UI 层。
- 崩溃点是 `NativeWidgetMac::OnWindowKeyStatusChanged()` 返回到 `widget->OnNativeFocus()` 虚调用前。
- 寄存器、反汇编、源码三者一致，表现为非空 `Widget*` 指向的对象状态已失效。
- `Widget::OnNativeWidgetActivationChanged()` 同步派发 observer，observer 中关闭 widget 是源码和测试都支持的合法场景。
- 上层路径经过 `TabDialogManager::TabDidEnterForeground()` / `UpdateDialogVisibility()`，追查范围应是 tab dialog / tab-modal dialog。

不能确认：

- 不能仅凭 crash dump 唯一识别 `x21 = 0x13c16835100` 对应的具体 C++ 动态类型。
- 不能断言 FedCM 就是本次真实用户崩溃的唯一来源。
- 不能把普通 FedCM chooser 测试失败解释为“无漏洞”；它只说明当前 PoC 没覆盖到必要状态。
- 不能在没有更多证据时继续随机压力测试或随机点击；下一步应按源码状态机构造最小 no-click 条件。

## 修复方向

最直接的修复是在 `OnNativeWidgetActivationChanged()` 前后使用 `WeakPtr` 重新校验：

```cpp
void NativeWidgetMac::OnWindowKeyStatusChanged(
    bool is_key,
    bool is_content_first_responder) {
  Widget* widget = GetWidget();
  if (!widget) {
    return;
  }

  base::WeakPtr<Widget> weak_widget = widget->GetWeakPtr();
  if (!widget->OnNativeWidgetActivationChanged(is_key) || !weak_widget) {
    return;
  }

  widget = weak_widget.get();
  if (is_key) {
    widget->OnNativeFocus();
    if (!weak_widget) {
      return;
    }
    widget->GetFocusManager()->RestoreFocusedView();
  } else {
    widget->OnNativeBlur();
    if (!weak_widget) {
      return;
    }
    widget->GetFocusManager()->StoreFocusedView(false);
    parent_key_lock_.reset();
  }
}
```

更保守的做法是：每次调用可能同步派发 observer、focus 或 close 逻辑的函数之后，都重新检查 `WeakPtr`。

## 目录内验证代码说明

本目录中的验证代码用于继续构造和验证 no-click 触发链：

- `fedcm_tab_dialog_repro_server.py`：本地 HTTPS RP/IdP FedCM 测试服务。
- `fedcm_repro_cert.pem` / `fedcm_repro_key.pem`：FedCM 本地 HTTPS 服务证书。
- `chrome_focus_close_app.html`：窗口 focus/close 行为验证页。
- `chrome_widget_activation_direct_repro.html`：直接模拟 widget activation 相关 UI 触发页。
- `chrome_window_close_repro.html` / `chrome_window_close_child.html`：窗口打开/关闭链验证页。
- `chrome_webauthn_abort_repro.html`：WebAuthn abort/focus 相关候选验证页。
- `parse_chrome_snss.py` / `parse_chrome_tabrestore_snss.py`：Chrome session/tab restore 文件解析脚本。

这些验证代码并不都代表成功复现；其中 FedCM server 是当前最接近 `TabDialogManager` 真实路径的验证基础。
