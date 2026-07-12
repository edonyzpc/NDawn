# Release Ledger

> 本表记录实际发布状态；`Local candidate` 不等于已发布。主题 Day 0 只取 Ghost Dashboard 实际激活时间，配置 Day 0 取 Save/生效时间。

| Unit | 类型 | 当前状态 | Predecessor | Candidate / checksum | 批准 | Day 0 | Immediate | 72h | Exit |
|---|---|---|---|---|---|---|---|---|---|
| F0a | GitHub workflow validation | Remote pass | `07804aea…` workflows | fix `3df5946`; run `29179810177` PASS | 已批准 | N/A | Pass | N/A | Accept |
| F0b | Packaging + inactive upload | Accepted；后由用户手动激活 | F0a accepted head；Ghost installed theme `ndawn-2026-07-05-13-03` 保留且不得删除 | `ndawn-dbc1e7b189ee`; SHA-256 `bbed2724…c8a8`; positive run `29179894534`; zero-upload runs `29180067547` / `29180120331` | 已批准；激活由用户执行 | 首次确认 Active：2026-07-12 12:56 SGT | `@custom`/关键预览 Pass；16:59 SGT 公开 10 URL + robots/sitemap/RSS Smoke Pass | N/A；无功能代码差异 | Accept |
| R0 | Ghost Injection jQuery migration | Closed No-op | 当前 Site/Page/Post Injection checksum 见恢复快照 | 空 diff；68 条非空 Injection 的 jQuery 命中为 0 | 用户接受 No-op；不产生配置写入 | N/A | Owner/sequence + predecessor product Smoke Pass | N/A | No-op |
| R1 | Theme native JS/TOC | Local release candidate validated | accepted source head `4e3ac8a`（包含 active identity `dbc1e7b` 后续 F0/docs head）；当前 active `ndawn-dbc1e7b189ee` 保留 | commit `0e72467`; local ZIP SHA-256 `0f11ca15…cd86` 精确复现；未上传 | 上传/激活未请求 | — | Chrome + Safari fixture、source/ZIP、predecessor product matrix Pass | — | T038–T043 完成；待 T044 单独发布批准 |
| R2 | Theme Ads near-viewport | Isolated local candidate | R1 local commit `0e72467`；生产发布时必须改用 R1 accepted head | commit `f52f512`; local ZIP SHA-256 `dff03ece…001c`；未上传 | 未请求；G-003 已确认 | — | 6-mode Chrome fixture + source/ZIP validation Pass | — | Blocked by R1/P0 |
| R3a | Theme jQuery 3.7.1 | Isolated local candidate | R2 local commit `f52f512`；生产时使用 R2 accepted head | commit `82aebbb`; local ZIP SHA-256 `1f259038…b158`；全站范围、未上传 | 未请求 | — | source/ZIP/SRI scope Pass | — | Blocked by R2 |
| R3b | Theme jQuery scope | Isolated local candidate | R3a local commit `82aebbb`；生产时使用 R3a accepted head | commit `27051d2`; local ZIP SHA-256 `df345e24…543a`；未上传 | 未请求 | — | template scope + source/ZIP validation Pass | — | Blocked by R0 + R3a |
| R4 | Theme homepage Featured LCP | Isolated local candidate | R3b local commit `27051d2`；生产时使用 R3b accepted head | commit `1362b72`; local ZIP SHA-256 `923168ba…8ab0`；未上传 | 未请求 | — | source/ZIP/scope Pass；5-run 未执行 | — | Blocked by R3b + P0 performance baseline |
| R5a | Theme LXGW cleanup | Isolated local candidate | R4 local commit `1362b72`；生产时必须使用 R4 accepted head | commit `a5a07c7`; `ndawn-r5a-a5a07c7.zip`; SHA-256 `eb27e236…08bd`；未上传 | G-010 范围已批准；上传未请求 | — | GScan fatal + source/built/ZIP scope Pass | — | Blocked by release sequence |
| R5b | Theme Modern/Elegant owner | Isolated local candidate | R5a local commit `a5a07c7`；生产时必须使用 R5a accepted head | commit `3cb1791`; `ndawn-r5b-3cb1791.zip`; SHA-256 `f6e39633…4b6d`；未上传 | 方案 A 已批准；上传/激活未请求 | — | GScan/ZIP + 四组合 Chrome computed font Pass | — | Blocked by release sequence |
| R5c | Site Header font links | Not started | R5b accepted head | 只允许删除已迁移的 Barlow/Alike links | 未请求 | — | — | — | Open |
| R6 | Site/Post Injection Prism | Rebuildable offline mutation candidate | R5c accepted/no-op | 59 篇 allowlist；54 clear、5 surgical；111 个 legacy component；manifest `fb6a11ef…6b98` | 未请求 | — | Export hash、生成器安全边界与保留能力 Pass | — | Blocked by R5.x + fresh precheck + modification approval |
| R7a | Theme semantics/H1 | Isolated local candidate | R4 local commit `1362b72`；生产时在 R6 accepted head 重建 | commit `0916c11`; local ZIP SHA-256 `ee94bda7…3c21`；未上传 | 视觉方向已批准；发布未请求 | — | semantic/source/ZIP Pass | — | Blocked by R5/R6 |
| R7b | Theme excerpts | Isolated local candidate | R7a local commit `0916c11`；生产时使用 R7a accepted head | commit `112e320`; local ZIP SHA-256 `78909d32…1812`；未上传 | 视觉方向已批准；发布未请求 | — | template/CSS/source/ZIP Pass | — | Blocked by R7a |
| R7c | Ghost SEO content | Approved offline candidates | R7b stable head | 2 张 Lexical Image Card alt；4 张 Feature image alt；1 个 meta description；2 张 Mobiledoc No-op，三个写入批次分别发布/回滚 | 7 项精确文本 + Mobiledoc No-op 已批准；写入未批准 | — | 原图/上下文/字段 owner/存储格式核对 Pass | — | Blocked by R7b + execution approval |
| R8 | Ghost redirects | Approved No-op / dependency pending | R7c accepted/no-op | GSC 3 个 URL + 全量 Export 内链核对；无可靠一跳 successor | 2026-07-12 已批准三项 No-op | — | Read-only audit Pass | N/A | T136 后正式 No-op |
| R9 | Cloudflare Cache | Read-only candidate `No-op/Complete` | P5 accepted state | 无配置 diff | 未请求 | — | — | — | Pre-P5 |
| R10a | Cloudflare Rate Limit | Approved blog-scope No-op | R9 accepted state | 现有 1/1 规则确定不命中；Free 不支持 Host；目标均非博客应用 | No-op 已批准；无 Save | — | 精确表达式/阈值/plan 限制 Pass | N/A | Pre-R9；按顺序记录 No-op |
| R10b | Gemini UA Skip | Disable design approved / execution pending | R10a accepted/no-op | Active UA-only Skip；绕过后续 Custom/Managed/SBFM；保留 Rate Limit | 禁用设计已批准；Save 未批准 | — | 精确表达式/Skip components/官方 crawler 边界 Pass | — | Pre-R9 + execution approval |
| R10c | Ghost www Full strict | Host-scoped design approved / execution pending | R10b accepted/no-op | `(http.host eq "www.edony.ink")` Configuration Rule；全 Zone 保持 Full | 方案已批准；Save 未批准 | — | Ghost origin CA/expiry/SAN/TLS Pass；其他 Zone origins 隔离 | — | Pre-R9 + execution approval |
| R10d | Webhook Header credential migration | Deferred / existing risk accepted temporarily | R10c accepted/no-op | OR hostname/public-IP/private-IP；静态 Telegram secret；不得写入仓库 | 用户决定暂不改动 | — | 表达式、header owner 与 Telegram 官方机制 Pass | N/A | Security backlog；未来需重新批准迁移 |
| R10e | R2-CORS + remaining history | Approved blog-scope No-op | R10d deferred | R2-CORS 仅 img/memos；`_domainconnect` 与其余历史规则保留 | No-op 已批准；无 Save | — | Blog-host exclusion Pass | N/A | Pre-R9；按顺序记录 No-op |

## 记录规则

- 每次只把一个 Unit 改为 `Approved`、`Activated` 或 `Effective`。
- 主题候选必须记录主题 name、commit SHA、最终 ZIP SHA-256、Ghost 已安装 active predecessor 和全部 `@custom` 前后值；本项目不删除已安装主题，回滚时直接重新 Activate predecessor，不要求下载旧 ZIP。
- 配置单元必须记录脱敏 before/after、规则顺序、操作者、生效时间和 predecessor checksum。
- Exit 只允许 Spec 定义的 `No-op/Accept/Rollback/Iterate/Complete-unmet/Log-only/Separate-Spec`。

## 2026-07-12 本地链核验

- R1 → R2 → R3a → R3b → R4 的候选 parent 与计划链完全一致；R7a/R7b 继续作为视觉/语义预验证链，生产时仍须在 R6 accepted head 重建。
- 7 个候选 worktree 均为 clean，逐 commit `git diff --check` PASS；没有 push、上传或激活。
- 当前设计工作区的 `test:semantics` / `test:evidence` 已 PASS，但它们断言 R3b/R4/R7 的最终合同，属于最终集成加固，**不得在 R1 前单独落到 master**。分阶段发布继续使用各 Unit accepted predecessor 上当时存在的 CI；最终语义合同随完整对应功能落地后再启用，避免 CI 反向强迫夹带后续 Unit。
