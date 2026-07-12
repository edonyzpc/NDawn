# R10 Cloudflare Header Transform 只读审计

日期：2026-07-12
状态：`WEBHOOK CHANGE DEFERRED / R2-CORS NO-OP APPROVED / NO CONFIG CHANGE`

## Request Header：Webhook Header

当前规则：Active，顺序 1；为 origin request 设置静态 `X-Telegram-Bot-Api-Secret-Token`。敏感值不写入仓库或本文。

匹配逻辑为三个条件的 **OR**：

```text
(http.host eq "twitter.edony.ink") or
(ip.src eq <one-public-ip>) or
(ip.src eq <one-rfc1918-private-ip>)
```

确认的问题：

1. 所有访问 `twitter.edony.ink` 的请求都会被 Cloudflare 注入同一个认证 secret，不要求 Telegram 来源、POST method 或精确 webhook path。若 origin 只检查该 header，任意客户端都会被边缘伪装成已认证 webhook，请求认证失去意义。
2. 公网 IP 条件没有 hostname 限制；该来源访问 `www.edony.ink` 或 Zone 其他 Proxied host 时，也会把 secret 发送给对应 origin，扩大敏感值传播面。
3. RFC1918 私网地址不会作为互联网请求的 Cloudflare `ip.src` 出现，是无效历史条件。
4. 该 secret 在只读审计中由 Dashboard 明文呈现并进入本次受控审计上下文；按 secret hygiene 必须轮换，不能继续视为从未暴露的长期凭据。

Telegram 官方的正确机制是：调用 `setWebhook` 时设置 `secret_token`，随后 **Telegram 自己**在每次 webhook request 中发送 `X-Telegram-Bot-Api-Secret-Token`。Cloudflare 不需要为所有访问者合成该身份 header：

- https://core.telegram.org/bots/api#setwebhook
- https://core.telegram.org/bots/webhooks

## 推荐目标状态

1. 确认该规则对应的 Bot、webhook URL、origin 服务及 header 校验代码 owner。
2. 生成新 secret，不写入仓库或聊天文本。
3. 让 origin 在迁移窗口同时接受 old/new，调用 Telegram `setWebhook(secret_token=<new>)`。
4. 验证 Telegram 实际请求携带 new secret 后，Disable `Webhook Header` Transform Rule。
5. origin 取消 old secret，最终只接受 new；完成消息投递与拒绝伪造请求验证。
6. 稳定后可保留 Disabled predecessor 一段观察期，再由用户决定是否删除；本项目默认不删除历史规则。

如果 origin 无法临时接受两个 secret，必须先设计原子切换和短暂停机窗口，不能直接 Save。

## 当前不可推断的信息

- 这条规则原本服务于哪个 Telegram Bot / webhook path。
- `twitter.edony.ink` origin 是否真的验证该 header。
- 公网 IP 条件的 owner 与历史用途。
- 当前 Telegram `getWebhookInfo` 是否已配置 `secret_token`。

以上必须由用户确认；不得从博客主题或 Cloudflare 表达式猜测。

## Response Header：R2-CORS

当前规则：Active，仅匹配 `img.edony.ink` 或 `memos.edony.ink`，设置 `access-control-allow-origin: *`。

- 不匹配 `www.edony.ink`，不会改变博客 HTML、字体、脚本或 SEO headers。
- 目标是公开图片/Memos 历史能力，本博客优化没有收窄 CORS 的证据。
- 推荐 `No-op`：保留现状，不修改、不禁用、不删除。

## 决策

1. 2026-07-12 用户决定 `Webhook Header` 暂不改动：不轮换凭据，不修改、禁用或删除规则。已确认的范围过宽与凭据风险继续登记在安全 backlog；未来重启迁移时仍须先确认 Bot/webhook、backend、公网 IP owner 与执行窗口。
2. 用户批准 `R2-CORS` 在本项目记录 `No-op`，保留现状，不修改、不禁用、不删除。
