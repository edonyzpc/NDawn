# R10 Cloudflare Rate Limit 只读审计

日期：2026-07-12  
状态：`BLOG-SCOPE NO-OP APPROVED / NO CONFIG CHANGE`

## 当前规则

Cloudflare Free plan 当前只允许 1 条 Rate limiting rule，现有规则占用 `1/1`：

| 字段 | 当前值 |
|---|---|
| 名称 | `Rate limiting` |
| 状态 | Active |
| 顺序 | First |
| Action | Block |
| Characteristic | IP |
| 阈值 | 100 requests / 10 seconds |
| Mitigation | Block 10 seconds |
| Events | 0 |

当前表达式：

```text
(starts_with(http.request.uri.path, "d1.dbproxy.edony.ink")) or
(starts_with(http.request.uri.path, "d1database-proxy.worker.edony.ink")) or
(starts_with(http.request.uri.path, "edony-db-proxy-092b92d3.edonyzpc-worker-001.workers.dev")) or
(starts_with(http.request.uri.path, "img.edony.ink"))
```

## 确认的问题

规则把四个 hostname 写入了 `http.request.uri.path`。Cloudflare 定义 URI path 的示例值以 `/` 开头，例如 `/articles/index`；hostname 应使用 `http.host`。因此上述条件不会匹配正常 HTTP 请求，`Events=0` 不能证明没有攻击，只能与“规则不命中”一致。

官方字段定义：

- https://developers.cloudflare.com/ruleset-engine/rules-language/fields/reference/http.request.uri.path/
- https://developers.cloudflare.com/ruleset-engine/rules-language/fields/reference/http.host/

另一个限制是 Free plan 的 Rate Limit 表达式只支持 Path 与 Verified Bot，不支持 Host；Pro 才支持 Host。当前不能在 Free plan 中把这条规则简单改成多个 `http.host` 条件：

- https://developers.cloudflare.com/waf/rate-limiting-rules/#availability

`workers.dev` 是独立的 Workers 路由，不属于 `edony.ink` Zone 的自定义 hostname；若它仍需保护，应在该 Worker 的 Domains & Routes、Access 或应用自身单独设计，不能混入此 Zone 规则：

- https://developers.cloudflare.com/workers/configuration/routing/

## 与博客的关系

- 表达式没有 `www.edony.ink`，目标均为 D1/Image/Worker 历史应用。
- 当前规则不命中，因此对博客 SEO、爬虫、LCP 或请求稳定性没有可证明的收益，也没有观察到直接误拦。
- 修复它需要各应用的真实 API path、合法峰值、鉴权方式和 owner；这些信息不能从博客主题或 Ghost 配置推断。
- 直接改成 `/`、`/api/` 等猜测路径会把所有 Zone hostname 混在一起，可能误拦博客或其他子域。

## 方案

### A：本博客优化中记录 No-op（推荐）

保留规则及全部 Cloudflare 能力，不禁用、不删除、不改阈值；在 R10 记录“历史规则不命中，属于非博客应用 backlog”。后续若要修复，按具体 Worker/API 单独收集真实 path 和流量基线。

收益：不把无关应用风险引入博客发布链；不影响 SEO/性能；保留现有配置与未来修复入口。

代价：该规则继续提供不了实际限速保护，并继续占用 Free plan 唯一规则槽位。

### B：升级 Pro 后按 Host 重建

Pro 可使用 Host 字段，但仍需确认三个 `edony.ink` hostname 的真实 owner、路径和峰值；`workers.dev` 仍须单独处理。本轮没有购买套餐的收益依据。

### C：Free plan 按真实 Path 重建

只有在这些应用具有不会与博客/其他子域冲突的稳定路径，并完成请求率基线后才可行。当前证据不足，不能生成安全表达式。

## 决策

2026-07-12 用户批准方案 A：R10 对现有 Rate Limit 记录博客范围 `No-op`，把应用级限速修复留作独立 backlog。任何 Cloudflare Save、Disable、Delete 或 Upgrade 均不执行。
