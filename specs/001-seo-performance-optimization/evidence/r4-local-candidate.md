# R4 首页 Featured LCP 候选

> 状态：`ISOLATED LOCAL CANDIDATE / NOT MEASURED / NOT RELEASED`
> G-008：`No`（只修改首页 Featured 图片，不涉及 Post、Ads、Injection 或 Cache）

- 基线：R3b local commit `27051d2`；生产发布时使用 R3b accepted head。
- 分支/提交：`codex/r4-featured-lcp` / `1362b72 perf(featured): expose lazy images to the browser`。
- 本地验证 ZIP：`ndawn-r4-local`，SHA-256 `923168ba098835d280088e951e23db4ca7a1d2d63b4c74c9e017a8a93a398ab0`；未上传。

## 证据

2026-07-12 Cloudflare RUM 最近 24 小时：

- LCP P50 2,660 ms、P75 3,984 ms；总 pageviews 91，整体结论仍为样本不足。
- Debug View 明确出现首页第二张 Featured 图片，LCP 约 4,704 ms。
- 对应资源为 `AI的一些思考和总结` 的 Feature image；它是当前 Featured 列表第二项。
- 主题当前只让第一项使用真实 `src/srcset + eager + fetchpriority=high`；第二项使用 lazysizes 的透明占位符和 `data-srcset`，等待 JS 后才可发现真实图片。

## 单一候选

仅修改 `partials/featured.hbs` 的非首项图片：

- 保留第一项 `loading=eager` 与 `fetchpriority=high`；
- 非首项从 lazysizes 占位符改为真实 `src/srcset/sizes + loading=lazy`；
- 不增加 preload，不改变 Post、正文图片、轮播插件或图片尺寸；
- 浏览器可在布局阶段发现第二/第三张桌面可见图片，同时在移动端继续按原生 lazy 策略加载。

## 本地门

- GScan fatal：PASS。
- 独立 diff 仅包含 `partials/featured.hbs` 非首图 6 组属性替换；首图 priority、标题和 ARIA 均未变化。
- ZIP fatal GScan、allowlist/identity/唯一 ZIP、`git diff --check`：PASS。
- 尚未执行固定协议下 5 次中位数对比，因此不能记录 `Accept` 或声称 LCP 已改善。

## 后续

前置 R1–R3b 接受后，以单独 R4 候选构建并在同一设备、网络、冷/热缓存协议下至少运行 5 次；只有 LCP 改善且 CLS 未超过 G-007 才可批准上传。
