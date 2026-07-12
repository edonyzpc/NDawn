# Release Ledger

> 本表记录实际发布状态；`Local candidate` 不等于已发布。主题 Day 0 只取 Ghost Dashboard 实际激活时间，配置 Day 0 取 Save/生效时间。

| Unit | 类型 | 当前状态 | Predecessor | Candidate / checksum | 批准 | Day 0 | Immediate | 72h | Exit |
|---|---|---|---|---|---|---|---|---|---|
| F0a | GitHub workflow validation | Remote pass | `07804aea…` workflows | fix `3df5946`; run `29179810177` PASS | 已批准 | N/A | Pass | N/A | Accept |
| F0b | Packaging + inactive upload | Remote pass / inactive | F0a accepted head；Ghost installed theme `ndawn-2026-07-05-13-03` 保留且不得删除 | `ndawn-dbc1e7b189ee`; SHA-256 `bbed2724…c8a8`; run `29179894534` | 已批准 | N/A | Pass；active 未变化 | N/A | Negative matrix pending |
| R0 | Ghost Injection jQuery migration | Public audit only | 待全量 Export | N/A | 未请求 | — | — | — | Blocked by P0 |
| R1 | Theme native JS/TOC | Local candidate | 待锁定已安装 active predecessor | 混合 WIP，禁止发布 | 未请求 | — | — | — | Open |
| R2 | Theme Ads near-viewport | Local candidate | R1 accepted head | 混合 WIP，禁止发布 | 未请求 | — | — | — | Open |
| R3a | Theme jQuery 3.7.1 | Local final code only | R2 accepted head | 必须拆出全站版本候选 | 未请求 | — | — | — | Open |
| R3b | Theme jQuery scope | Local final code only | R3a accepted head | 必须拆出 scope 候选 | 未请求 | — | — | — | Open |
| R4 | Theme homepage Featured LCP | Local candidate | R3b accepted head | 混合 WIP，禁止发布 | 未请求 | — | — | — | Open |
| R5 | Theme + Site Injection fonts | Owner approved | R4 accepted head | 等待可追溯字体/OFL与独立候选 | 未请求 | — | — | — | Open |
| R6 | Site/Post Injection Prism | Audited | R5 accepted head | 等待全量 allowlist | 未请求 | — | — | — | Open |
| R7a | Theme semantics/H1 | Approved local direction | R6 accepted head | 可见 H1 已批准，等待独立候选 | 未请求 | — | — | — | Open |
| R7b | Theme excerpts | Approved preview | R7a accepted head | 最新 5 篇两行摘要已批准，等待独立候选 | 未请求 | — | — | — | Open |
| R7c | Ghost SEO content | Not started | R7b stable head | 等待 G-009 allowlist | 未请求 | — | — | — | Open |
| R8 | Ghost redirects | Not started | R7c accepted/no-op | 等待 404 evidence | 未请求 | — | — | — | Open |
| R9 | Cloudflare Cache | Read-only candidate `No-op/Complete` | P5 accepted state | 无配置 diff | 未请求 | — | — | — | Pre-P5 |
| R10 | Cloudflare Security | Read-only audit | R9 accepted state | 等待 Log 单元选择 | 未请求 | — | — | — | Pre-R9 |

## 记录规则

- 每次只把一个 Unit 改为 `Approved`、`Activated` 或 `Effective`。
- 主题候选必须记录主题 name、commit SHA、最终 ZIP SHA-256、Ghost 已安装 active predecessor 和全部 `@custom` 前后值；本项目不删除已安装主题，回滚时直接重新 Activate predecessor，不要求下载旧 ZIP。
- 配置单元必须记录脱敏 before/after、规则顺序、操作者、生效时间和 predecessor checksum。
- Exit 只允许 Spec 定义的 `No-op/Accept/Rollback/Iterate/Complete-unmet/Log-only/Separate-Spec`。
