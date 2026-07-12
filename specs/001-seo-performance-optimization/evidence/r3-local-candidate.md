# R3 jQuery 本地候选

日期：2026-07-12  
状态：`R3a + R3b ISOLATED LOCAL CANDIDATES / NOT RELEASED`

## R3a 独立本地候选

- 基线：R2 local commit `f52f512`；生产发布时必须以 R2 accepted head 重建/核对。
- 分支/提交：`codex/r3a-jquery-version` / `82aebbb perf(deps): upgrade jQuery to 3.7.1`。
- 严格范围：只修改 `default.hbs` 的 jQuery URL 与 SRI；保持全站位置、无 `defer`，不夹带 R3b scope。
- source fatal GScan、ZIP fatal GScan、allowlist/identity/唯一 ZIP、`git diff --check` 均 PASS。
- 本地验证 ZIP：`ndawn-r3a-local`，SHA-256 `1f25903813a5dd1706bf264327bad0725bb2a15d4bd2944b5c6d9373ea11b158`；未上传。

## R3b 独立本地候选

- 基线：R3a local commit `82aebbb`；生产发布时必须以 R3a accepted head 重建/核对。
- 分支/提交：`codex/r3b-jquery-scope` / `27051d2 perf(theme): scope jQuery to listing pages`。
- 严格范围：只在 `default.hbs` 把既有 jQuery 3.7.1 移入 `home, paged, tag, author` block 并设为 `defer`；`main.min.js` 仍全站，`home.min.js` 仍在同一 block。
- source fatal GScan、ZIP fatal GScan、allowlist/identity/唯一 ZIP、`git diff --check` 均 PASS。
- 本地验证 ZIP：`ndawn-r3b-local`，SHA-256 `df345e248a9a9b60314e65b25f3bfa52e745634080063685c0dc669e43de543a`；未上传。
- 生产 Network、Portal/Search、Injection 与 72h 仍为发布门；本地模板范围不等于线上完成。

## 当前本地最终态

- jQuery 版本：3.7.1。
- 官方文件：`https://code.jquery.com/jquery-3.7.1.min.js`。
- 2026-07-12 从 jQuery 官方 CDN 取得的 minified 文件大小：87,533 bytes。
- 本机 SHA-256 base64：`/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=`，与 `default.hbs` 的 SRI 逐字一致。
- jQuery 与 `home.min.js` 只出现在 `home, paged, tag, author` helper block。
- `post` 与 `page` 只加载 `main.min.js` + `post.min.js`，主题层不再加载 jQuery。
- 语义 validator 固定唯一 jQuery URL、版本、SRI、范围和 `home.min.js` 顺序。

## 重要发布边界

主 authoring 工作区仍同时包含 R3a 与 R3b 的最终代码，不能作为一个候选发布；两者已按下列边界分别重建：

1. R3a 必须从已接受 predecessor 单独把 3.5.1 升级为 3.7.1，暂时保持全站范围。
2. R3a 立即与 72 小时接受后，R3b 才能把范围收敛到 Home/Paged/Tag/Author。
3. R3b 必须用 Network 证明 Post/Page 不再请求 jQuery，并重测轮播、Load more、Portal、Search 与 Injection。

本文件只证明最终代码和 SRI 正确，不证明两个生产 Release Unit 已完成。
