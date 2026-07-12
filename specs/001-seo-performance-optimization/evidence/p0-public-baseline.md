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
| Custom Full | 专用未发布 Draft Preview | 196 篇公开 Post 中无使用记录；使用批准的专用草稿验证，不制造公开 URL |
| Custom No-image | 同一专用未发布 Draft Preview | 196 篇公开 Post 中无使用记录；同一草稿切换模板验证 |

公开 Content API 共返回 196 篇 Post。`custom-narrow-feature-image` 有 16 篇使用记录；`custom-full-feature-image` 与 `custom-no-feature-image` 没有公开 Post 使用记录。2026-07-12 已用一个专用未发布 Draft 依次完成 Full/No-image Preview，避免虚构公开 URL 或修改既有文章。

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

公开 HTML owner 线索已与 Site/Page/Post Injection 全量导出核对；正式结论见 `p1-owner-audit.md`。

## 6. 尚未满足的 P0 项

- 当前 active theme 已更新为用户手动激活的 `ndawn-dbc1e7b189ee`（v2.2.0，源码/候选 commit `dbc1e7b`，ZIP SHA-256 `bbed2724…c8a8`）；原 `ndawn-2026-07-05-13-03` 继续保留为平台回退点，不删除、不下载旧 ZIP。
- Ghost Content/Settings Export、全部非空 Injection、`routes.yaml`、`redirects.yaml` 已保存到 gitignored `.private`，脱敏摘要与 checksum 见 `p0-ghost-recovery-snapshot.md`。
- Cloudflare 脱敏快照已完成并保存在 `p0-cloudflare-snapshot.md`；active/predecessor 与 Ghost 恢复材料门已满足。
- AdSense 的 `www.edony.ink` 7/28 天、GA4 7/28 天与 Ghost Analytics 30 天基线已只读记录；Cloudflare RUM 只有样本不足且可能污染的 24 小时线索，按批准口径记 `Insufficient`。T018 已按各平台可用窗口关闭。
- 测量协议与 Chrome 手机/桌面、冷/热缓存矩阵已锁定；Safari Desktop/390×844/768×1024、Chrome 平板及真实付费账号功能 Smoke 已完成，真实免费账号仍未完成。
- 三个核心性能页面的 60 个无警告 Lighthouse 有效样本已完成，结果见 `p0-lighthouse-baseline.md`。
- Full/No-image 已由专用未发布 Draft Preview 补齐；Draft 保留且最终模板为 No Feature Image。
- 固定 URL、激活回退点与公开技术 SEO/响应头基线已分别关闭 T013、T015、T019；其余 P0 项继续按 Tasks 独立关闭。
