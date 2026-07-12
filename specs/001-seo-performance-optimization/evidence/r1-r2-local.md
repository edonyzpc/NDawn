# R1/R2 本地实现与浏览器证据

> 状态：`LOCAL PASS / NOT RELEASED`  
> 记录时间：2026-07-12（Asia/Singapore）  
> 生产影响：无

## 范围说明

当前工作区仍包含 R1、R2、R3a、R3b 的混合 WIP。依据 FR-003，这些改动不得作为一个候选直接发布；本记录只证明 R1/R2 的本地实现行为，不代表前置 gate、发布批准、线上激活或观察期完成。

## R1 — Native JS 与 TOC

- TOC link 同时保存原始 heading ID 到 `data-target-id`，URL fragment 使用编码值。
- 点击时用原始 `data-target-id` 执行 `getElementById`，不再用编码后的 `link.hash` 查找。
- 真实 Chrome fixture 使用 ID `中文 标题/%`：链接唯一、点击无导航跳转、平滑滚动被调用且目标可计算。
- 桌面 More menu 使用 button + sibling submenu，按钮内嵌链接数为 0；点击、外部点击与 `aria-expanded` 状态通过。
- Mobile Burger 使用真实 button，`aria-controls`、`aria-expanded`、`aria-hidden` 与 `menu-opened` 状态同步。
- TOC toggle 与 TOC nav 分离，按钮内嵌链接数为 0；打开、选择条目、关闭状态通过。
- Theme 切换恢复为 `System → Dark → Light → System` 三态；System 不再错误固化为暗/亮 class。
- `main.js` / `post.js` Node syntax、source GScan、built/Source Map 重建均通过。

## R2 — Ads Near-viewport

实现约 `1.75` 个视口的初始触发距离，并增加：

- IntersectionObserver 与 scroll/resize fallback；
- 快速滚动前置检查；
- 将 `content-visibility` 切换到可布局状态后等待至少两帧；
- Slot 宽高非零后才加载脚本和请求广告；
- 脚本成功、失败、8 秒超时和一次重试状态；
- Slot 状态超时会先进入一次宽限重试，第二次仍无 `filled/unfilled` 时收敛为失败并移除空白；
- 每个 Slot 的 `data-ad-requested` 防重复；
- `filled` / `unfilled` MutationObserver；
- 单 Slot unfilled 收起父容器；全部 unfilled 收起整个 Ads 区域；
- 零尺寸和脚本失败在一次重试后进入可观测失败状态并收起区域；
- 桌面、平板、手机三档 intrinsic slot 高度。

## Chrome fixture 结果

fixture：`specs/001-seo-performance-optimization/evidence/fixtures/runtime.html`

导航/主题 fixture：`specs/001-seo-performance-optimization/evidence/fixtures/r1-navigation.html`

| 场景 | 结果 |
|---|---|
| 默认：1 filled + 1 unfilled | `rendered`；第二个父容器为 `is-unfilled` |
| 无 IntersectionObserver | fallback 触发；`rendered` |
| 两个 Slot 均 unfilled | `unfilled`；容器为 `is-empty` |
| Slot 始终零尺寸 | 重试后 `failed / zero-sized-slot`；容器为 `is-failed` |
| Ads 脚本 404 | 重试后 `failed / script-error`；失败脚本被清理 |
| Slot 状态始终未知 | 宽限重试后 `failed / status-timeout`；容器为 `is-failed` |
| 重复 owner 调用 | `data-ads-state` 入口守卫；已请求 Slot 不再次 push |

2026-07-12 在本机真实 Chromium 内重新执行上述 fixture：

- More menu 打开/外部点击关闭、Mobile Burger 状态同步、`System → Dark → Light → System` 三态均通过。
- 特殊 ID `中文 标题/%` 的 TOC 链接可平滑滚动到原始目标，并在选择后关闭目录。
- 默认、无 `IntersectionObserver`、全部 unfilled、零尺寸、脚本 404、Slot 状态超时六种 Ads 场景均达到预期终态；失败场景重试后收敛为 `failed`，失败脚本被移除。

复现方式：从仓库根目录启动只读静态服务器，访问：

```text
http://127.0.0.1:8765/specs/001-seo-performance-optimization/evidence/fixtures/runtime.html
?mode=no-observer
?mode=all-unfilled
?mode=zero-size
?mode=script-error
```

## 构建与包验证

- 临时构建目录：`/private/tmp/ndawn-r1-a11y.YB2I47`
- source fatal GScan：PASS
- ZIP fatal GScan：PASS
- allowlist / identity / unique ZIP：PASS
- semantic validator：PASS；固定 4 个 Post 模板各引用一次 Ads partial、Ads partial 恰有两个 Slot、jQuery/home bundle 只在 home/paged/tag/author 范围。
- 当前本地候选 SHA-256：`5b621cab988e6d9b43b22ab1db86ee057fb96be516b9e41b874ed3884a4c2b1c`
- 工作区 built 四个核心产物与临时副本逐文件一致：PASS

## 尚未满足

- Ads script 监听器已在 append 前注册，并已在真实 Chromium 重跑成功加载与 `script-error` 场景；仍需在独立 R2 候选上完成真实 AdSense/三设备 Smoke。
- R1/R2 的 predecessor、独立候选、上传/激活批准尚未执行。
- R1 完整产品 Smoke 与 72 小时门尚未执行。
- G-003 的 Ads 最低样本、收益回滚线和 owner 尚未锁定。
- R2 线上 Ads Day 0、立即检查、72 小时及 Day 7/14/28 尚未开始。
