# Observation Registry

> 日期在实际 Day 0 后填写；没有生产生效时间时不得预填或假装到期。

| Unit | Cohort / 数据源 | Day 0 | Immediate | 72h | Day 7 | Day 14 | Day 28 | 结论 | 负责人 |
|---|---|---|---|---|---|---|---|---|---|
| R0 Injection | 核心页面/Console/5xx | — | — | — | N/A | N/A | N/A | 未开始 | User + Codex |
| R1 Native JS | 固定页面/设备/账号/G-007 | — | — | — | N/A | N/A | 性能单元 RUM | 未开始 | User + Codex |
| R2 Ads | AdSense + GA4 + RUM + G-007 | — | — | — | — | — | — | 未开始 | User + Codex |
| R3a jQuery version | 固定页面/G-007 | — | — | — | N/A | N/A | N/A | 未开始 | User + Codex |
| R3b jQuery scope | Network/功能/G-007 | — | — | — | N/A | N/A | 性能单元 RUM | 未开始 | User + Codex |
| R4 LCP | 固定 5-run + RUM | — | — | — | N/A | N/A | — | 未开始 | User + Codex |
| R5 Fonts | Network/视觉/RUM | — | — | — | N/A | N/A | — | 未开始 | User + Codex |
| R6 Prism | 普通页/代码页/Console | — | — | — | N/A | N/A | N/A | 未开始 | User + Codex |
| R7a Theme SEO | Search Console 固定 URL + 技术 SEO | — | — | — | N/A | — | — | 未开始 | User + Codex |
| R7b Excerpts | Search Console 固定 URL + UX | — | — | — | N/A | — | — | 未开始 | User + Codex |
| R7c Content batch | Search Console allowlist | — | — | — | N/A | — | — | 未开始 | User + Codex |
| R8 Redirects | 旧 URL/404/Search Console | — | — | — | N/A | — | — | 未开始 | User + Codex |
| R9 Cache unit | Cache/权限/5xx/RUM | — | — | — | N/A | N/A | — | 未开始 | User + Codex |
| R10 Security Log | WAF events/误报/Bots/5xx | — | — | — | N/A | N/A | N/A | 未开始 | User + Codex |

统一结论只使用：`达成 / 未达成 / 样本不足 / N/A`。长期指标不得覆盖对应 Unit 的 Immediate 或 72h 技术失败。
