# GA4 与 Zaraz owner 基线

日期：2026-07-12  
状态：`READ-ONLY / DIRECT GTAG OBSERVED OWNER / ZARAZ SHADOW CONFIG NOT EXECUTING`

## GA4 属性与窗口

- Account / Property：`edony` / `shadow-walker`
- Web stream：`Shadow Walker`，URL `https://edony.ink`
- Stream ID：`3476409031`
- Measurement ID：`G-GMXX0SWB0S`；与 Ghost Site Header Injection 完全一致。

| 窗口 | Active users | Views | Event count | Key events |
|---|---:|---:|---:|---:|
| Last 7 days | 351 | 360 | 1.4K | 690 |
| Last 28 days | 2K | 2.5K | 9.1K | 3.1K |

Last 7 days 的 `page_view` 为 360；数据流显示过去 48 小时持续接收数据。以上仅为发布前基线，不与 Ghost 30 天或 Cloudflare RUM 24 小时窗口直接比较。

## owner 核对

Cloudflare Zaraz 当前为 Active，GA4 工具使用同一 Measurement ID，工具与 `Pageviews` 均显示 Enabled。公开页同时存在：

- Ghost Site Header 的 direct `gtag.js`；
- Cloudflare `/cdn-cgi/zaraz/s.js` bootstrap；
- Cloudflare Web Analytics beacon。

但对唯一审计 URL 的实际核对结果为：

- Zaraz bootstrap payload 的 `executed` 数组为空；
- 页面没有暴露可运行的 `window.zaraz`；
- Direct `gtag.js` 存在；
- 该单次审计访问在 GA4 Realtime pages 中产生 1 个 `/` view，而不是 2 个。

因此，**当前观察到的 GA4 `page_view` owner 是 Ghost Site Header direct gtag；Zaraz GA4 是启用但未执行的 shadow config，本次未观察到重复 page_view。** 这是 2026-07-12 的点时证据；Zaraz 配置或触发器变化后必须重新核对。

## 决策边界

- 不删除或禁用 Direct gtag；它是当前已证明的数据 owner。
- 不启用、删除或修改 Zaraz GA4；保留 Cloudflare 能力与历史配置。
- 每个会修改 Site Header、Zaraz、Cache/WAF 或统计脚本的单元，立即检查同一访问是否仍只产生一个 page_view。
- 本次仅只读，没有修改 GA4、Ghost Injection 或 Zaraz。
