# R10 Ghost 专用 Full (strict) 方案

日期：2026-07-12  
状态：`HOST-SCOPED DESIGN APPROVED / EXECUTION PENDING / NO CONFIG CHANGE`

## 当前事实

- Zone 全局 SSL/TLS encryption mode：`Full`；Automatic mode Disabled。
- `www.edony.ink`：Proxied CNAME → `edony.ghost.io`。
- 直接以 SNI/hostname=`www.edony.ink` 连接 Ghost origin，TLS 1.3 与系统信任链验证均为 `OK`。
- Origin certificate：CN/SAN=`www.edony.ink`，Let's Encrypt `YR1`，有效期 2026-05-29 至 2026-08-27。

Cloudflare `Full` 会加密到 origin，但不验证证书；`Full (strict)` 额外要求证书未过期、由受信 CA/Origin CA 签发并匹配 hostname，否则返回 526：

- https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/full/
- https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/full-strict/

## 为什么不建议全 Zone 直接切换

当前 Proxied 记录还包括：

- `old.edony.ink`：两个历史 A origin；直接 TLS 未返回证书，另有 Edge Redirect。
- `twitter.edony.ink`：A origin；证书链与 hostname 验证 OK。
- `cloudenv.edony.ink`、`uptime.edony.ink`：Cloudflare Tunnel。
- `img.edony.ink`：R2 custom domain。
- `slateleaf.edony.ink`、`wormhole.edony.ink`：Cloudflare Pages。
- `_domainconnect.edony.ink`：历史 CNAME；直接 TLS 未返回证书。

全 Zone 切换会把非博客历史子域一起带入，无法满足“每个 origin 均已证明”的门槛，不符合本项目的低风险边界。

## A：只对 www 启用 Strict（推荐）

新增一条现代 Configuration Rule：

```text
Name: Ghost www Full strict
Expression: (http.host eq "www.edony.ink")
Setting: SSL/TLS encryption mode = Strict
```

Cloudflare 官方支持 Configuration Rule 按 hostname 覆盖 SSL mode，并建议新配置使用现代 Rules，而不是 Page Rules：

- https://developers.cloudflare.com/rules/configuration-rules/settings/#ssl
- https://developers.cloudflare.com/rules/reference/page-rules-migration/#migrate-ssl

收益：Cloudflare 到 Ghost origin 不仅加密，还验证 CA、有效期和 `www.edony.ink` hostname；降低 origin 连接被错误证书或中间人接管的风险。

对 SEO/性能：没有直接排名或 LCP 收益；正常情况下只增加握手验证，不改变页面内容、缓存、Crawler 或 Cloudflare Proxied 能力。

发布与回滚：

1. R9 完成后保存 Configuration Rules predecessor（当前无规则）并再次验证 origin 证书。
2. 单独批准后创建一条规则，不修改全 Zone `Full`。
3. 立即执行固定 Smoke、Ghost Admin/会员状态、TLS、canonical/robots/Sitemap；观察 72 小时 525/526 与功能。
4. 发生异常时 Disable/Delete 该规则，立即恢复继承的全 Zone `Full`。

## B：保持全 Zone Full，不新增规则

配置最简单，也不会触及历史子域，但 origin certificate 继续不被验证。若本轮只限定 SEO/性能，可把它记录为 `No-op`。

## 决策

2026-07-12 用户批准方案 A 作为 R10 独立安全单元。当前不创建规则；本次批准只锁定方案，实际 Save 仍需等待前置发布顺序门和执行批准。
