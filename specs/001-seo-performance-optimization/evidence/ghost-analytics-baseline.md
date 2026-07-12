# Ghost Analytics 基线

日期：2026-07-12  
状态：`READ-ONLY / LAST 30 DAYS / NO CONFIG CHANGE`

## 网站级样本

Ghost Admin → Analytics → Web traffic，窗口为 Last 30 days：

| 指标 | 数值 |
|---|---:|
| Unique visitors | 3,949 |
| Total views | 5,451 |

主要来源：Google 2,271、Direct 1,570、Bing 41、GitHub 13。首页有 200 unique visitors。

## 重点内容交叉核对

`go 代码安全审计` 在 Ghost Analytics 同窗口有 182 unique visitors；它同时是 Search Console G-009 最高优先级候选。该证据只证明内容有真实流量，不单独授权改写 title/description。

## 边界

- 本次仅只读，没有修改 Analytics 设置。
- GA4 已补齐 7/28 天基线与 owner 审计：当前 direct gtag 是观察到的 page_view owner，Zaraz GA4 为未执行的 shadow config；详见 `ga4-zaraz-baseline.md`。
- Cloudflare RUM 最近 24 小时证据已在 `p0-cloudflare-snapshot.md`，但样本不足且疑似混入其他子域，不能与 Ghost 网站级 30 天数据直接比较。
- 各平台只提供不同可用窗口：GA4/AdSense 使用 7/28 天，Ghost 使用 30 天，Cloudflare RUM 使用 24 小时且记录为 `Insufficient`。用户已批准生产 5xx/RUM 数据不足时不伪造统一口径。
