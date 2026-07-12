# R3 jQuery 本地候选

日期：2026-07-12  
状态：`LOCAL CODE PRESENT / MUST SPLIT R3a AND R3b / NOT RELEASED`

## 当前本地最终态

- jQuery 版本：3.7.1。
- 官方文件：`https://code.jquery.com/jquery-3.7.1.min.js`。
- 2026-07-12 从 jQuery 官方 CDN 取得的 minified 文件大小：87,533 bytes。
- 本机 SHA-256 base64：`/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=`，与 `default.hbs` 的 SRI 逐字一致。
- jQuery 与 `home.min.js` 只出现在 `home, paged, tag, author` helper block。
- `post` 与 `page` 只加载 `main.min.js` + `post.min.js`，主题层不再加载 jQuery。
- 语义 validator 固定唯一 jQuery URL、版本、SRI、范围和 `home.min.js` 顺序。

## 重要发布边界

当前工作区同时包含 R3a 与 R3b 的最终代码，不能作为一个候选发布：

1. R3a 必须从已接受 predecessor 单独把 3.5.1 升级为 3.7.1，暂时保持全站范围。
2. R3a 立即与 72 小时接受后，R3b 才能把范围收敛到 Home/Paged/Tag/Author。
3. R3b 必须用 Network 证明 Post/Page 不再请求 jQuery，并重测轮播、Load more、Portal、Search 与 Injection。

本文件只证明最终代码和 SRI 正确，不证明两个生产 Release Unit 已完成。
