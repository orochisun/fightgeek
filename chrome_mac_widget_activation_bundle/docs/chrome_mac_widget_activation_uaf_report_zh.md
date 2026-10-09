# Google Chrome macOS 崩溃根因分析报告

## 基本信息

- 应用：Google Chrome
- 版本：149.0.7827.115
- 平台：macOS 26.5, ARM64
- 崩溃时间：2026-06-22 14:06:45 +0800
- 崩溃线程：Thread 0, `CrBrowserMain`, main thread
- 异常：`EXC_BAD_ACCESS (SIGSEGV)`, `KERN_INVALID_ADDRESS at 0x40`
- 触发栈特征：`NSWindow becomeKeyWindow` / `makeKeyAndOrderFront` 期间进入 Chrome Views macOS widget activation 逻辑

## 结论

该崩溃是 Chrome macOS Views widget 激活路径中的 use-after-free 风险触发。

核心问题位于 `views::NativeWidgetMac::OnWindowKeyStatusChanged()`：函数先从 `delegate_` 弱引用取出局部裸指针 `Widget* widget`，随后调用 `widget->OnNativeWidgetActivationChanged(is_key)`。该调用会同步派发 observer/controller 回调，回调链中可以关闭或同步销毁当前或相关 `Widget`。函数返回后没有重新验证 `widget` 是否仍然存活，就继续调用 `widget->OnNativeFocus()` / `widget->GetFocusManager()`，导致已销毁对象被再次解引用。

本次崩溃点表现为：`Widget*` 指针本身非空，但对象 vtable 已经无效/被清空，Chrome 在读取 vtable 偏移 `0x40` 时访问地址 `0x40` 崩溃。

## 关键证据

### 1. 崩溃地址和寄存器状态

崩溃报告中：

```text
Exception Type: EXC_BAD_ACCESS (SIGSEGV)
Exception Subtype: KERN_INVALID_ADDRESS at 0x0000000000000040
Thread 0 Crashed
far: 0x0000000000000040
x21: 0x0000013c16835100
x8:  0x0000000000000000
pc:  0x0000000108394c7c
```

`x21` 是局部 `Widget*`，`x8` 是从 `[x21]` 读出的 vptr。`x8 == 0` 后再读 `[x8 + 0x40]`，所以 fault address 是 `0x40`。

### 2. 本机 Chrome Framework 反汇编

对 `/tmp/google_chrome_framework_arm64` 反汇编，崩溃函数关键片段如下：

```asm
0x2d38c5c: ldr    x21, [x19, #0x38]   ; x21 = Widget*
0x2d38c68: mov    x0, x21
0x2d38c6c: bl     0x2d38de4            ; Widget::OnNativeWidgetActivationChanged(is_key)
0x2d38c70: cbz    w0, 0x2d38cc8
0x2d38c74: ldr    x8, [x21]            ; 读取 Widget vptr
0x2d38c78: cbz    w20, 0x2d38ca0
0x2d38c7c: ldr    x8, [x8, #0x40]      ; 崩溃点，x8 == 0
0x2d38c80: mov    x0, x21
0x2d38c84: blr    x8                   ; 调用 OnNativeFocus()
```

这和崩溃报告中的 `pc` / `far` / 寄存器状态一致。

### 3. 对应 Chromium 源码

本地抓取的 Chromium 149.0.7827.95 源码位置：

`/tmp/chromium-grep-149/ui/views/widget/native_widget_mac.mm`

对应函数：

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

`NativeWidgetMac::delegate_` 是 `const base::WeakPtr<internal::NativeWidgetDelegate>`，初始化自 `delegate->AsWidget()->GetWeakPtr()`。进入函数时 `GetWidget()` 会把弱引用转成裸 `Widget*`，但在同步回调返回后没有再次检查 WeakPtr。

## 释放路径分析

真正的释放不是发生在 `NativeWidgetMac` 函数内部，而是发生在它调用的同步回调中：

```text
NativeWidgetMac::OnWindowKeyStatusChanged(true)
  -> Widget::OnNativeWidgetActivationChanged(true)
     -> observers_.Notify(OnWidgetActivationChanged)
     -> AnyWidgetObserverSingleton::OnAnyWidgetActivated
     -> WidgetObserver::OnWidgetTreeActivated
     -> 某个 UI controller / bubble / popup 关闭 widget
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

相关源码证据：

- `Widget::OnNativeWidgetActivationChanged()` 会同步派发 observer：
  - `/tmp/chromium-grep-149/ui/views/widget/widget.cc`
- `Widget::CloseNow()` 注释明确说明调用 native close 后 `Widget` 可能已经被销毁：
  - `/tmp/chromium-grep-149/ui/views/widget/widget.cc`
- `Widget::OnNativeWidgetDestroyed()` 使用 `WeakPtr` 检查自身是否在销毁过程中被删除：
  - `/tmp/chromium-grep-149/ui/views/widget/widget.cc`
- `WidgetDelegate::DeleteDelegate()` 会根据 ownership 删除 delegate 或 invalidate weak ptr：
  - `/tmp/chromium-grep-149/ui/views/widget/widget_delegate.cc`

## 可能触发释放的 UI 路径

本次 dump 没有包含 `x21 = 0x13c16835100` 对应 heap page，因此无法从 dump 唯一还原具体是哪一个 UI 子类或 controller 关闭了该 Widget。但源码中存在多条可以在 activation/close-on-deactivate 路径中同步关闭 Widget 的生产路径：

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

源码：

- `/tmp/chromium-grep-149/chrome/browser/ui/views/extensions/extension_popup.cc`

### Bubble/Dialog close-on-deactivate

通用 `BubbleDialogDelegate` 在失活时会：

```cpp
GetWidget()->CloseWithReason(views::Widget::ClosedReason::kLostFocus);
```

源码：

- `/tmp/chromium-grep-149/ui/views/bubble/bubble_dialog_delegate_view.cc`

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

源码：

- `/tmp/chromium-grep-149/chrome/browser/ui/views/omnibox/omnibox_popup_presenter_base.cc`

这类对象一旦在 activation 回调中被关闭，会立即让外层裸 `Widget*` 失效。

## 移除路径分析

源码里相关 observer 的移除路径是存在的，所以问题不是简单的“observer 没移除”：

- `NativeWidgetMac::OnWidgetDestroyed()`：
  - `widget_observation_.Reset();`
  - `SetFocusManager(nullptr);`
- `BubbleDialogDelegate::AnchorWidgetObserver::OnWidgetDestroying()`：
  - `widget_observation_.Reset();`
- `BubbleDialogDelegate::BubbleWidgetObserver::OnWidgetDestroyed()`：
  - `observation_.Reset();`
- `WidgetDelegate::DeleteDelegate()`：
  - 删除 delegate 或 `weak_ptr_factory_.InvalidateWeakPtrs();`

问题点在于 observer/close 回调返回到 `NativeWidgetMac::OnWindowKeyStatusChanged()` 后，原先缓存的局部裸 `Widget*` 没有重新验证生命周期。

## 建议修复

在进入可重入的 activation 回调前保存 `Widget` 的 `WeakPtr`，回调后重新检查：

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

更保守的修复是每个可能派发事件/改变焦点的调用后都重新检查 WeakPtr。

## 影响判断

该问题属于本地 UI 事件驱动的 use-after-free 崩溃。当前证据能确认：

- 崩溃发生在 Chrome browser process 主线程。
- 触发点是 macOS window key/focus activation。
- 失败对象是 `views::Widget*`。
- 崩溃由可重入 callback 后继续使用裸指针导致。

当前证据不能确认：

- 具体是哪一个 Chrome UI 子类或 extension/bubble/popup controller 关闭了该 Widget。
- 是否存在稳定远程可控利用路径。
- 是否能从网页内容单独触发。

原因是当前 Crashpad dump 没有包含 `0x13c16835100` 对应 heap page，也没有该对象的 vtable/class 信息。

## 本地分析产物路径

- 报告：`/Users/orochisun/Xuanwu/Projects/fightgeek/chrome_mac_widget_activation_uaf_report_zh.md`
- Chrome Framework thin arm64：`/tmp/google_chrome_framework_arm64`
- Chromium 149.0.7827.95 源码抓取目录：`/tmp/chromium-grep-149`
- Chromium main 对照文件：`/tmp/chromium-main-check/ui/views/widget/native_widget_mac.mm`

