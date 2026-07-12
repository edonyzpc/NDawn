# P0 Cloudflare 脱敏快照（Draft）

> 状态：`READ-ONLY SNAPSHOT / NO CONFIG CHANGE`  
> 记录时间：2026-07-12（Asia/Singapore）  
> Zone：`edony.ink`，Free plan

## DNS 与代理边界

- 共 24 条 DNS 记录。
- `www.edony.ink`：CNAME 指向 Ghost Pro，`Proxied`；必须保留。
- apex `edony.ink`：A，`DNS only`；当前不是博客公开主入口。
- Ghost/Mailgun 邮件记录和 MX/TXT：`DNS only`；必须保留。
- `_domainconnect`：CNAME，当前 `Proxied`；属于历史配置，R10 只审计，不直接修改。
- 其他子域、Tunnel、R2、Pages 与邮件能力不属于博客优化，不做顺手清理。

## Cache

### 基础配置

- Caching Level：`Standard`
- Browser Cache TTL：`5 days`
- Development Mode：`Off`
- Page Rules：`0 / 3`
- Cache Response Rules：0
- 最近 24 小时 Overview：约 14.08k requests、4.08% cached、19 MB cached。
- 公开 HTML 实测为 `cf-cache-status: DYNAMIC` 且 `Vary: Cookie, Accept-Encoding`。

### Cache Rules（按顺序）

| 顺序 | 名称 | 范围/动作 | 状态 |
|---|---|---|---|
| 1 | CSS Cache | 历史精确 CSS URI，Eligible + Edge/Browser TTL | Disabled |
| 2 | js Cache | 历史 Zaraz/Apps 精确 URI，Eligible + Edge/Browser TTL | Disabled |
| 3 | image Cache | 历史精确图片 URI | Disabled |
| 4 | Memos Static Assets | `twitter.edony.ink` 静态扩展名 | Active |
| 5 | Memos API Bypass | `twitter.edony.ink/api/**` | Active |
| 6 | Ghost Static Assets | `www.edony.ink` 静态扩展名 | Active |
| 7 | Ghost Admin Bypass | `www.edony.ink/ghost/**` | Active |
| 8 | Ghost Images | `www.edony.ink/content/images/**` | Active |

当前没有 Cache Everything 或 HTML eligible 规则。R9 应先验证现有三条 Ghost 规则，而不是新增 HTML Cache。

## Redirect 与 Transform

| 类型 | 名称 | 范围/动作 | 状态 |
|---|---|---|---|
| Redirect | Ads | `edony.ink/ads.txt` / `www.../ads.txt` → Ghost ads.txt | Disabled |
| Redirect | Redirect to Old Blog | `old.edony.ink` → WordPress 旧博客 | Active |
| Request Header | Webhook Header | Memos/Webhook 历史匹配，注入一个 secret header | Active |
| Response Header | R2-CORS | `img.edony.ink`、`memos.edony.ink` 加 `access-control-allow-origin: *` | Active |

Webhook header 的 secret value 未写入仓库；后续 R10 若调整表达式或轮换 secret，必须独立批准。当前无 URL Rewrite、Configuration、Origin、Compression Rules。

## Security Rules

### Custom Rules

| 顺序 | 名称 | 动作 | 状态 |
|---|---|---|---|
| 1 | Allow Gemini AI | `Gemini-Google` User-Agent → Skip | Active |
| 2 | Skip-Memos-Webhook | `/rss` → Skip | Disabled |
| 3 | 禁用恶意 IP | 单 IP → Block | Active |
| 4 | AI Scrapers and Crawlers rule | Verified Bot Category = AI Crawler → Block | Disabled |

- Managed WAF Rules：Free plan 未配置。
- Rate limiting：1 条 Active；表达式把多个 hostname 字符串用于 `URI Path starts_with`，从语义看很可能无法命中。只能在 R10 通过日志/模拟验证后修复，不能直接重写。
- 当前规则事件计数快照均为 0，不能据此证明规则正确或无误报。

## SSL/TLS

- Encryption mode：`Full`，Automatic mode Off；不是 `Full (strict)`。
- Universal wildcard/backup certificates：Active/Issued；另有历史 Advanced managed certificates。
- Always Use HTTPS：On。
- HSTS：On，max-age 6 months，includeSubDomains Off，preload Off。
- Minimum TLS：1.2；TLS 1.3 On。
- Opportunistic Encryption、Automatic HTTPS Rewrites：On。
- HTTP/2、HTTP/3、HTTP/2 to Origin、0-RTT：On。

`Full → Full (strict)` 只有在直连源证书链、Ghost 支持边界和回滚证据齐全后才可另立 R10 单元；当前不改。

## Speed / RUM / Zaraz

### 当前能力

- Cloudflare Web Analytics/RUM：Enabled，公开 DOM 有 1 个 Cloudflare beacon。
- Cloudflare Fonts：Enabled。
- Early Hints：Enabled。
- Speed Brain：Disabled。
- Rocket Loader：Disabled。
- Zaraz：Zone Active；Custom HTML、Custom Image 未启用，GA4 tool 为 checked。
- 公开首页 DOM：direct gtag 1、Zaraz runtime script 0、Cloudflare beacon 1、Ghost Stats 1。

因此 Zaraz GA4 是“配置存在、运行 owner 未观察到”的历史状态；不得直接删除或启用第二套 pageview。P1 需把 direct GA4、Zaraz 配置与 GA4 实际数据核对后确定唯一 owner。

### RUM 最近 24 小时

- Visits：79；Page views：91；低于 SDD 的 100 个有效 page-load 最低样本。
- Page load time：5,732 ms。
- LCP：P50 2,660 ms、P75 3,984 ms、P90 5,688 ms、P99 36,592 ms；Good 45%、Needs Improvement 30%、Poor 25%。
- INP：Good 86%、Needs Improvement 14%、Poor 0%，但 Debug View 无数据。
- CLS：Good 91%、Poor 9%；Debug View 出现不属于博客主题的 Tailwind selector，说明当前 RUM 可能混入其他子域/应用。

结论：本轮 RUM 为 `样本不足且范围可能污染`，只能作为线索，不能升级为 G-007 硬门。后续需固定 hostname/path filter 与有效样本口径。

## 已识别但未执行的候选

1. R9：逐条验证 Ghost Static Assets / Images 的 HIT、TTL、ETag、精确 Purge；不缓存 HTML。
2. R10：先 Log/观察 rate-limit 的无效 path 表达式，再决定修复。
3. R10：审计 Webhook Header 的 OR 范围与 secret rotation，不与缓存混改。
4. R10：验证 Verified Bots 与 Gemini Skip 的真实命中和误报。
5. 独立证书调查：仅在直连证据充分时评估 Full (strict)，不触碰 DNS-only 应急门。

以上全部需要对应 G-004/G-005 批准；本次没有点击任何保存、开关、重排、Purge 或规则动作。
