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

Webhook Header 的 secret value 未写入仓库；R10 精确审计确认其 OR 条件会为所有 `twitter.edony.ink` 请求及一个公网来源访问任意 Zone host 时注入认证 header，RFC1918 条件无效。敏感值已进入受控审计上下文，必须轮换；用途、Bot/webhook/backend owner 与执行窗口待用户确认，详见 `r10-transform-readonly-audit.md`。当前无 URL Rewrite、Configuration、Origin、Compression Rules。

## Security Rules

### Custom Rules

| 顺序 | 名称 | 动作 | 状态 |
|---|---|---|---|
| 1 | Allow Gemini AI | `Gemini-Google` User-Agent → Skip | Active |
| 2 | Skip-Memos-Webhook | `/rss` → Skip | Disabled |
| 3 | 禁用恶意 IP | 单 IP → Block | Active |
| 4 | AI Scrapers and Crawlers rule | Verified Bot Category = AI Crawler → Block | Disabled |

- Managed WAF Rules：Free plan 未配置。
- `Allow Gemini AI` 精确审计确认会 Skip 所有后续 Custom Rules、Managed Rules 与 Super Bot Fight Mode，但条件只检查可伪造的 `Gemini-Google` User-Agent；Google 官方没有该独立 crawler UA。建议 R10 单独禁用并保留 Enable 回滚，详见 `r10-gemini-skip-readonly-audit.md`。
- Rate limiting：1 条 Active；R10 已读取精确表达式，确认它把多个 hostname 字符串用于 `URI Path starts_with`，不会匹配正常以 `/` 开头的 path。Free plan 又不支持 Host 条件，因此不能直接原位修成多 hostname 规则；建议博客范围 No-op，详见 `r10-rate-limit-readonly-audit.md`。
- 当前规则事件计数快照均为 0，不能据此证明规则正确或无误报。

## SSL/TLS

- Encryption mode：`Full`，Automatic mode Off；不是 `Full (strict)`。
- Universal wildcard/backup certificates：Active/Issued；另有历史 Advanced managed certificates。
- Always Use HTTPS：On。
- HSTS：On，max-age 6 months，includeSubDomains Off，preload Off。
- Minimum TLS：1.2；TLS 1.3 On。
- Opportunistic Encryption、Automatic HTTPS Rewrites：On。
- HTTP/2、HTTP/3、HTTP/2 to Origin、0-RTT：On。

全 Zone `Full → Full (strict)` 不安全：历史 `old` 与 `_domainconnect` origin 未能提供可验证证书。Ghost `www` origin 已通过 CA、有效期与 hostname 验证，可选择用 `(http.host eq "www.edony.ink")` 的 Configuration Rule 单独设为 Strict；方案与回滚见 `r10-full-strict-options.md`，当前不改。

## Speed / RUM / Zaraz

### 当前能力

- Cloudflare Web Analytics/RUM：Enabled，公开 DOM 有 1 个 Cloudflare beacon。
- Cloudflare Fonts：Enabled。
- Early Hints：Enabled。
- Speed Brain：Disabled。
- Rocket Loader：Disabled。
- Zaraz：Zone Active；Custom HTML、Custom Image 未启用，GA4 tool 与自动 Pageviews 为 checked，Measurement ID 与 Site Header direct gtag 相同。
- 公开首页 DOM：direct gtag、Zaraz bootstrap、Cloudflare beacon 与 Ghost Stats 均存在。

点时 owner 验证显示 Zaraz bootstrap `executed=[]`、页面无可运行 `window.zaraz`，单次唯一审计访问在 GA4 Realtime 只有 1 个 view；当前实际 page_view owner 为 Site Header direct gtag，Zaraz GA4 是未执行的 shadow config。不得直接删除或启用第二套 pageview，详见 `ga4-zaraz-baseline.md`。

### RUM 最近 24 小时

- Visits：79；Page views：91；低于 SDD 的 100 个有效 page-load 最低样本。
- Page load time：5,732 ms。
- LCP：P50 2,660 ms、P75 3,984 ms、P90 5,688 ms、P99 36,592 ms；Good 45%、Needs Improvement 30%、Poor 25%。
- INP：Good 86%、Needs Improvement 14%、Poor 0%，但 Debug View 无数据。
- CLS：Good 91%、Poor 9%；Debug View 出现不属于博客主题的 Tailwind selector，说明当前 RUM 可能混入其他子域/应用。

结论：本轮 RUM 为 `样本不足且范围可能污染`，只能作为线索，不能升级为 G-007 硬门。后续需固定 hostname/path filter 与有效样本口径。

## 已识别但未执行的候选

1. R9：逐条验证 Ghost Static Assets / Images 的 HIT、TTL、ETag、精确 Purge；不缓存 HTML。
2. R10：Rate Limit 已确认不命中；博客范围 No-op 已批准，应用级修复另行收集真实 path/流量基线。
3. R10：Gemini Skip 已确认仅按可伪造 UA 绕过后续安全组件；单独 Disabled 设计已批准，实际 Save 待顺序门与执行批准。
4. R10：Webhook Header 已确认范围过宽且 secret 需轮换；用户决定暂不改动，风险保留安全 backlog。R2-CORS 博客范围 No-op 已批准。
5. R10：Ghost `www` 专用 Strict Configuration Rule 设计已批准；实际 Save 等待顺序门与执行批准，禁止全 Zone 切换，不触碰 DNS-only 应急门。

以上全部需要对应 G-004/G-005 批准；本次没有点击任何保存、开关、重排、Purge 或规则动作。
