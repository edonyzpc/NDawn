# P0 公开面基线（Draft）

> 状态：`READ-ONLY BASELINE + REPEATABLE SMOKE / P0 NOT CLOSED`  
> 采集时间：2026-07-12 10:19–10:21（Asia/Singapore）  
> 采集区域：LAX 边缘（本次 `cf-ray`）  
> 线上写入：无

## 1. 固定 URL 候选

| 类型 | URL | 选择理由 |
|---|---|---|
| 首页 | `https://www.edony.ink/` | 首页、Featured、Feed、Portal/Search |
| 普通文章 | `https://www.edony.ink/why-does-left-come-before-right/` | 近期普通 Post |
| 长文 | `https://www.edony.ink/deep-insight-of-langgraph-and-bsp-model-in-agent-developing/` | 32 分钟长文 |
| 图片文章 | `https://www.edony.ink/touring-to-japan-osaka/` | 游记/图片场景 |
| 代码文章 | `https://www.edony.ink/chai-jie-kimi-cli-coding-agent-de-neng-li-shang-xian-wei-shi-yao-zai-mo-xing-zhi-wai/` | 代码高亮与 TOC 场景 |
| Page | `https://www.edony.ink/bio/` | 独立 Page |
| 分页 | `https://www.edony.ink/page/2/` | jQuery/Home bundle/分页 |
| Tag | `https://www.edony.ink/tag/ai/` | Tag heading、Feed、分页 |
| Author | `https://www.edony.ink/author/edony/` | Author heading、Feed、分页 |
| Custom Narrow | `https://www.edony.ink/vscode-docker-container-env/` | Content API 明确返回 `custom-narrow-feature-image` |
| Custom Full | 待决策 | 196 篇公开 Post 中未发现使用记录 |
| Custom No-image | 待决策 | 196 篇公开 Post 中未发现使用记录 |

公开 Content API 共返回 196 篇 Post。`custom-narrow-feature-image` 有 16 篇使用记录；`custom-full-feature-image` 与 `custom-no-feature-image` 没有公开 Post 使用记录。不得虚构两个 URL 或在未经批准时修改文章模板。

## 2. 公开技术端点

| 端点 | 状态 | 当前信号 |
|---|---|---|
| `/` | 200 | `cf-cache-status: DYNAMIC`、`vary: Cookie, Accept-Encoding` |
| `/robots.txt` | 200 | Cloudflare Managed Content Signals + Ghost operational disallow |
| `/sitemap.xml` | 200 | Pages / Posts / Authors / Tags 四个 sitemap |
| `/rss/` | 200 | XML，`cf-cache-status: DYNAMIC` |
| `/page/2/` | 200 | `cf-cache-status: DYNAMIC` |
| `/tag/ai/` | 200 | `cf-cache-status: DYNAMIC` |
| `/author/edony/` | 200 | `cf-cache-status: DYNAMIC` |

本轮响应均由 Cloudflare Proxied 路径提供，公开 HTML 未观察到 Cloudflare 共享 `HIT/STALE/UPDATING`；Ghost/Fastly 上游存在独立 `x-cache` 与 `Age`，两者不得混同为 Cloudflare Edge HTML Cache。

## 3. robots 与 Sitemap

- Content signals：`search=yes, ai-train=no, use=reference`。
- 允许公开抓取，禁止 Amazonbot、Applebot-Extended、Bytespider、CCBot、ClaudeBot、CloudflareBrowserRenderingCrawler、Google-Extended、GPTBot、meta-externalagent。
- Ghost operational disallow：`/ghost/`、`/email/`、`/members/api/comments/counts/`、`/r/`、`/webmentions/receive/`、`/.ghost/analytics/api/`。
- Sitemap 指向：`https://www.edony.ink/sitemap.xml`。
- sitemap index 当前包含 pages、posts、authors、tags；最近修改时间由 Ghost 输出。

## 4. 首页 SEO 输出

- 抓取 HTML：51,302 bytes。
- 唯一 canonical：`https://www.edony.ink/`。
- Ghost 已输出 description、OpenGraph、X/Twitter Card 和 JSON-LD。
- 主题不应重复生成 canonical、OG/X 或 schema。
- 当前首页可见 heading 从 Featured `H2` 开始，没有首页 `H1`；是否加入自然可见的站点标题仍受 G-001 视觉门控制。

## 5. 当前运行时 owner 线索

| 能力 | 当前来源/范围线索 |
|---|---|
| Portal | Ghost `portal@~2.69`，全站 |
| Stripe | Ghost Portal 相关，全站 HTML 出现 |
| Search | Ghost `sodo-search@~1.8`，全站 |
| Cards | Ghost `/public/cards.min.js` |
| Comment counts | Ghost `/public/comment-counts.min.js` |
| Member attribution | Ghost `/public/member-attribution.min.js` |
| Ghost Analytics | Ghost `/public/ghost-stats.min.js`，全站 |
| GA4 | Site Injection，`G-GMXX0SWB0S`，idle/load 初始化 |
| Fonts | Site Injection，Google Fonts Barlow 300/500/700 + Alike，非阻塞 stylesheet preload |
| Prism | Footer Injection，先检测 Code Card DOM，再动态加载 Prism 1.29.0；普通页不应发起 Prism CDN 请求 |
| jQuery | 当前 active theme 3.5.1，全站 |
| Cloudflare email decode | Cloudflare `/cdn-cgi/scripts/.../email-decode.min.js` |

这只是公开 HTML owner 线索；P1 关闭前仍需与 Site/Page/Post Injection 全量导出核对。

## 6. 尚未满足的 P0 项

- 已记录 Ghost 已安装 active predecessor `ndawn-2026-07-05-13-03`（v2.2.0）；按已确认策略保持安装、不得删除并通过 Dashboard 重新 Activate，旧 ZIP 下载与 checksum 为 N/A。
- Ghost Export、全部 Injection、routes、redirects 未导出。
- Cloudflare 脱敏快照已完成并保存在 `p0-cloudflare-snapshot.md`；正式 P0 关闭仍依赖 active theme/Ghost Export 等其他恢复材料。
- GA4、Ghost Analytics、Cloudflare RUM、AdSense 7/28 天样本未导出。
- Chrome/Safari、设备、网络、冷/热缓存及匿名/免费/付费账号矩阵未锁定。
- 三个核心性能页面的每组合 5 次 LCP/CLS/瀑布/主线程测量未执行。
- `custom-full-feature-image` 与 `custom-no-feature-image` 无公开 URL，需要用户选择离线 fixture、预览草稿或从矩阵移除。
- 本文是 F0 关闭前的提前只读采集，不勾选 T013–T024。
