# Chrome macOS Widget Activation Crash 现状梳理

## 结论摘要

当前证据可以确认：这次 Chrome 149.0.7827.115 在 macOS 上的崩溃，落点是 Chrome Views 的 macOS widget activation 路径。底层 bug 形态是 `views::NativeWidgetMac::OnWindowKeyStatusChanged()` 在一次同步 activation 回调前缓存了裸 `Widget*`，回调期间该 `Widget` 可能被关闭/销毁，回调返回后函数继续使用旧指针并调用虚函数，最终在读取无效 vtable slot 时崩溃。

当前还没有完全确认的是：真实用户场景里到底是哪一个生产 UI 对象在 activation 回调期间关闭/销毁了这个 `Widget`。从符号化栈看，上层路径已经进入 `tabs::TabDialogManager::TabDidEnterForeground()` / `UpdateDialogVisibility()`，所以最合理的追查范围是 tab-scoped dialog / tab-modal dialog。FedCM active/modal dialog 是目前证据最强的候选，但尚未完成稳定复现。

## 崩溃现场

原始崩溃信息：

- 进程：`Google Chrome`
- 版本：`149.0.7827.115`
- 平台：macOS 26.5, ARM64
- 崩溃时间：`2026-06-22 14:06:45 +0800`
- 崩溃线程：Thread 0, `CrBrowserMain`
- 异常：`EXC_BAD_ACCESS (SIGSEGV)`, `KERN_INVALID_ADDRESS at 0x40`
- 关键寄存器：`x21 = 0x13c16835100`, `x8 = 0`, `far = 0x40`

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

这里说明两件事：

1. 崩溃不是 renderer 进程网页 JS 直接崩，而是 browser process 主线程 UI 代码崩。
2. 上层进入了 `TabDialogManager`，也就是某个 tab 关联 dialog 在 tab 进入前台时被 show/focus。

## 底层崩溃点

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

对应源码在：

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

问题点很集中：`Widget* widget` 在 `OnNativeWidgetActivationChanged()` 前取出，回调返回后没有重新通过 `WeakPtr` 或 `GetWidget()` 校验生命周期。

## 为什么回调期间可能释放

`Widget::OnNativeWidgetActivationChanged()` 本身会同步派发 observer：

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

这段同步通知包括：

- `OnWidgetActivationChanged`
- `OnAnyWidgetActivated`
- `OnWidgetTreeActivated`

这些回调允许 UI controller 关闭 dialog、popup 或当前 widget。Chromium 自己的测试也证明这种路径是合法存在的：

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

另一个测试也在 activation/closing 过程中主动 `Close()`：

`/tmp/chromium-grep-149/ui/views/widget/widget_unittest.cc:2207`

```cpp
void OnWidgetActivationChanged(Widget* widget, bool active) override {
  if (!active) {
    widget->Close();
  }
}
```

因此，“activation callback 期间关闭 widget”不是猜测，而是 Chromium Views 允许并测试覆盖过的生命周期行为。

同时，`Widget::OnNativeWidgetDestroyed()` 自己也承认销毁过程中 `this` 可能被删除：

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

这说明 Chrome Views 在 close/destroy 路径中本来就需要用 `WeakPtr` 防止回调后继续使用已销毁对象。`NativeWidgetMac::OnWindowKeyStatusChanged()` 当前没有做同等级别保护。

## 上层 TabDialogManager 路径

符号化栈显示上层进入了 `tabs::TabDialogManager`。对应源码：

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

这和崩溃栈的顺序一致：

```text
TabDidEnterForeground()
  -> UpdateDialogVisibility()
  -> Widget::Show()/SetVisible()
  -> NativeWidgetMac::Show()
  -> NSWindow makeKeyAndOrderFront
  -> windowDidBecomeKey
  -> OnWindowKeyStatusChanged()
```

所以当前追查范围应该限定在：会被 `TabDialogManager` 管理、会在 tab 前后台切换时 show/hide、并且可能在 activation/modal 状态变化里关闭自身或相关 widget 的 dialog。

## 当前最强候选：FedCM modal dialog

FedCM 候选不是凭空猜的，理由有三层。

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

第三，FedCM modal/popup/login/auto re-authn 状态机里存在 close 后继续推进状态的敏感路径。浏览器测试里有一个直接相关的回归语义：

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

未知登录状态也会触发：

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

Request 收到后会显示 modal dialog：

`/tmp/chromium-src-sparse/content/browser/webid/request.cc:805`

```cpp
if (result.show_active_mode_modal_dialog) {
  MaybeShowActiveModeModalDialog(result.idp_config_url,
                                 result.idp_info->metadata.idp_login_url);
  continue;
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

sharing permission 存储结构来自：

`/tmp/chromium-src-sparse/chrome/browser/webid/federated_identity_account_keyed_permission_context.cc:200`

```cpp
void FederatedIdentityAccountKeyedPermissionContext::GrantPermission(
    const url::Origin& relying_party_requester,
    const url::Origin& relying_party_embedder,
    const url::Origin& identity_provider,
    const std::string& account_id) {
  ...
  new_object.Set(kRpRequesterKey, relying_party_requester.Serialize());
  new_object.Set(kRpEmbedderKey, relying_party_embedder.Serialize());
  new_object.Set(kSharingIdpKey, identity_provider.Serialize());
  AddToAccountList(new_object, account_id);
  GrantObjectPermission(relying_party_requester, std::move(new_object));
}
```

对象最终按 `chosen-objects` 写入 content setting：

`/tmp/chromium-src-sparse/components/permissions/object_permission_context_base.cc:282`

```cpp
base::ListValue objects_list;
for (const auto& object : origin_objects_it->second) {
  objects_list.Append(object.second->value.Clone());
}
base::DictValue website_setting_value;
website_setting_value.Set(kObjectListKey, std::move(objects_list));
host_content_settings_map_->SetWebsiteSettingDefaultScope(
    origin.GetURL(), GURL(), data_content_settings_type_,
    base::Value(std::move(website_setting_value)), constraints);
```

所以如果继续做“不点击、打开页面自动触发”的 PoC，合理方向不是随机压力测试，而是构造一个具备以下条件的普通 FedCM active flow：

1. RP 页面自动调用 `navigator.credentials.get({ identity: { ..., mode: 'active' } })`。
2. IdP config 提供 `login_url`，使 Chrome 打开 FedCM active modal/login popup。
3. 登录页自动完成登录状态变更并调用 `IdentityProvider.close()` 或对应登录完成路径。
4. profile 中预置或真实产生 `fedcm_share`，使返回后满足 auto re-authn 条件。
5. 通过 CDP `Page.bringToFront` / `Target.createTarget` 或页面自身 `window.open/focus` 做 tab foreground/background，不使用鼠标点击。

## 已做过的复现尝试

已经做过一次低强度、非压力的 FedCM 普通 chooser 测试：

- 使用 Chrome for Testing 149.0.7827.115。
- 本地 HTTPS RP/IdP：`https://127.0.0.1:9443` 和 `https://127.0.0.1:9444`。
- 页面自动调用 FedCM request。
- 自动打开 return/hold tab，制造 tab 前后台切换。
- 结果：FedCM chooser 可以出现，tab 切换链条可以走通，但没有 crash。

这次失败说明：普通 pending chooser + tab 切换不足以触发本次崩溃。它并没有推翻底层 UAF 判断，只是说明生产触发需要更精确的状态组合，例如 modal login close、auto re-authn、permission/state transition 等。

## 用户真实会话线索

从 Chrome Session/Tabs 恢复文件解析到的线索：

`/tmp/tabrestore_13426582012008579_parsed.txt`

关键窗口：

```text
window_entry[24] id=2093620786 selected_tab_index=10 num_tabs=11
=> idx=10 tab=2093620797
   nav_ts=13426582000810502
   url=https://www.google.com/search?q=...
   title=芒果皮可以吃吗 - Google 搜索
```

该导航时间约为 `2026-06-22 14:06:40.810502 +0800`，距离 crash 时间 `2026-06-22 14:06:45.565 +0800` 约 4.75 秒。

这个线索只能说明 crash 前台 tab 是 Google 搜索页，不能直接证明具体 dialog 类型。Session 文件不包含崩溃时 `Widget` 对象、dialog class 或 heap 内容。

## 现在可以确认和不能确认的边界

可以确认：

- 崩溃发生在 browser process 主线程 UI 层。
- 崩溃点是 `NativeWidgetMac::OnWindowKeyStatusChanged()` 返回到 `widget->OnNativeFocus()` 虚调用前。
- 寄存器/反汇编/源码三者一致，表现为非空 `Widget*` 指向的对象状态已失效。
- `Widget::OnNativeWidgetActivationChanged()` 同步派发 observer，observer 中关闭 widget 是源码和测试都支持的合法场景。
- 上层路径经过 `TabDialogManager::TabDidEnterForeground()` / `UpdateDialogVisibility()`，追查范围应是 tab dialog / tab-modal dialog。

不能确认：

- 不能仅凭 crash dump 唯一识别 `x21 = 0x13c16835100` 对应的具体 C++ 动态类型。
- 不能断言 FedCM 就是本次真实用户崩溃的唯一来源。
- 不能把普通 FedCM chooser 测试失败解释为“无漏洞”；它只说明当前 PoC 没覆盖到必要状态。
- 不能在没有更多证据时继续随机压力测试或随机点击；下一步应是按源码状态机构造最小 no-click 条件。

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

## 下一步追查建议

继续追复现时，建议只沿一条证据链走：

1. 补全 FedCM active mode 的 no-click 页面：页面加载即触发 active FedCM，而不是依赖按钮点击。
2. 明确构造登录状态变更和 modal close：确认 `IdentityProvider.close()` / login status header 触发 `Request::OnClose()` 和 `CloseModalDialog()`。
3. 预置或自然生成 `fedcm_share`：让 auto re-authn 条件成立，而不是停留在普通 chooser。
4. 只使用 CDP 或页面脚本做 tab foreground/background：避免鼠标点击变量。
5. 每次只跑一次正常流程，检查 Crashpad 和 Chrome 退出状态；不做压力循环。

当前阶段不建议继续做泛化 UI 压测，因为泛化点击/压力无法证明“哪个对象释放、哪个路径触发”，还会干扰机器状态。
