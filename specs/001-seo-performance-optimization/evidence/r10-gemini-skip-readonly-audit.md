# R10 Cloudflare Gemini Skip 只读审计

日期：2026-07-12  
状态：`DISABLE DESIGN APPROVED / EXECUTION PENDING / NO CONFIG CHANGE`

## 当前规则

| 字段 | 当前值 |
|---|---|
| 名称 | `Allow Gemini AI` |
| 顺序 | Custom Rules 第 1 条 |
| 状态 | Active |
| 表达式 | `(http.user_agent contains "Gemini-Google")` |
| 动作 | Skip |
| Log matching requests | Enabled |
| Events | 0 |
| Skip | 所有后续 Custom Rules、所有 Managed Rules、所有 Super Bot Fight Mode Rules |
| 不 Skip | Rate Limiting Rules、IP Access Rules |

后续 Custom Rules 中有一条 Active 的恶意 IP Block。因此，只要请求伪造 `Gemini-Google` User-Agent，就会先命中 Skip 并绕过该后续 Block。User-Agent 本身不是身份认证。

当前 Zone 没有 Managed Rules；是否启用 Super Bot Fight Mode 不改变表达式可伪造的事实。

## Google 与 Cloudflare 官方边界

Google 官方当前 crawler/fetcher 列表没有名为 `Gemini-Google` 的独立 User-Agent。`Google-Extended` 是 `robots.txt` 产品 token，不是 HTTP User-Agent；Google 说明它控制 Gemini 训练/grounding 使用，并且不影响 Google Search 收录或排名：

- https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers#google-extended

Google 说明 crawler 身份验证不能只看 User-Agent，还要结合已发布 IP 与 reverse DNS。Cloudflare Verified Bots 则通过签名、IP 或 reverse DNS 验证身份：

- https://developers.google.com/crawling/docs/crawlers-fetchers/overview-google-crawlers#verify-googlebot
- https://developers.cloudflare.com/bots/concepts/bot/verified-bots/

公开 `robots.txt` 当前已经对 `Google-Extended` 设置 Disallow；这不会影响 Google Search。现有 Cloudflare `Gemini-Google` Skip 既不能覆盖该产品 token，也不能证明请求来自 Google。

## 对 SEO 与能力的影响

- 禁用这条 Skip **不会屏蔽 Googlebot**；Google Search crawler 不依赖 `Gemini-Google`。
- 保留 `Google-Extended` robots policy 不影响 Search inclusion/ranking。
- 当前规则对 SEO 没有可证明收益，却为伪造 UA 提供后续安全规则绕过。
- Cloudflare Proxied、Cache、RUM、Fonts、Verified Bots、Google Search 和其他历史规则能力均不依赖这条 Skip。

## 方案

### A：禁用该规则（推荐）

只把 `Allow Gemini AI` 从 Active 切为 Disabled，不删除规则；保留完整 predecessor 和重新 Enable 回滚能力。随后立即验证 Googlebot/robots/首页，并观察 72 小时 Security Events、Search Console 与功能 Smoke。

收益：移除可伪造的安全绕过；不改变 Google Search 或 Cloudflare 代理/性能能力。

风险：若存在未记录、确实发送 `Gemini-Google` UA 的私有集成，它将不再跳过后续 Custom/SBFM；当前 Events=0，没有使用证据。

### B：保留现状

不改变历史行为，但接受可伪造绕过与“Gemini 能力”无法验证的问题。不推荐。

### C：改为 Verified Bot 分类

Cloudflare 提供 `AI Assistant`、`AI Crawler` 等 Verified Bot category，但分类覆盖多个厂商，不能表达“只允许 Gemini”；在未明确允许哪种 AI 行为前不应替换。

## 决策

2026-07-12 用户批准方案 A：后续到达 R10 顺序门时，将 `Allow Gemini AI` 单独禁用并保留可重新 Enable 的回滚路径。当前只形成候选；实际 Cloudflare Save 仍需执行批准。
