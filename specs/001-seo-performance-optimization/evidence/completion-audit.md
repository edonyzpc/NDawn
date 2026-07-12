# Spec 完成度审计

日期：2026-07-12  
判定原则：只有当前代码、线上状态或可重复证据直接证明时才记为完成；本地候选不等于生产完成。

## Functional Requirements

| 要求 | 当前证据 | 判定 | 关闭条件 |
|---|---|---|---|
| FR-001 基线与回滚 | P0 public/Cloudflare 快照、Site Injection 快照；已记录并保留 Ghost installed predecessor | **部分** | Ghost Export、routes/redirects、Page/Post Injection 原始导出、完整设备/账号基线；旧主题 ZIP 下载为 N/A |
| FR-002 owner 审计 | `p1-owner-audit.md` | **部分** | 覆盖 draft/private 与 GA4/Zaraz 实际 page_view owner |
| FR-003 隔离发布 | SDD 已定义；当前仍是混合 WIP | **未完成** | 每个单元独立 SHA/ZIP/predecessor/批准/回滚，不直接发布当前工作区 |
| FR-004 CI/CD | F0a run `29179810177` PASS；F0b run `29179894534` PASS并上传唯一未激活候选；Ghost active 不变 | **远端部分通过** | workflow/docs/specs-only 0 上传与受控失败矩阵；D-020 下 PR 实跑 N/A |
| FR-005 R0 Injection | 196 篇公开 Post/Page Injection 无 jQuery | **部分** | Ghost 原始全量导出覆盖 draft/private 后正式 Pass；若存在命中则迁移并发布 |
| FR-006 R1 Native JS/TOC | 原生 JS、原始 heading ID、真实 Chromium fixture | **本地候选** | 独立 R1 候选、完整 Chrome/Safari/状态 Smoke、立即与 72h |
| FR-007 R2 Ads | 近视口、布局/Slot、失败/重复/unfilled/fallback 状态机与真实 Chromium fixture | **本地候选** | G-003、真实 AdSense/三设备 Smoke、独立 R2 发布、Day 7/14/28 |
| FR-008 R3a jQuery 版本 | 3.7.1 + SRI 已存在于混合 WIP | **未形成独立单元** | 从全站 predecessor 构建只改版本的独立候选并观察 |
| FR-009 R3b jQuery 范围 | home/paged/tag/author scope 已存在于混合 WIP | **未形成独立单元** | R0–R3a 接受后发布独立 scope 候选，Network 证明 Post/Page 无 jQuery |
| FR-010 R4 LCP | Cloudflare RUM 指向首页第二张 Featured；单一 native loading 候选 | **本地候选** | 前置稳定后按固定协议 5 次中位数、独立发布与 72h |
| FR-011 R5 Fonts | 来源、覆盖冲突、许可与打包风险已审计；主题唯一 owner 方向已批准 | **部分** | 可追溯字体/OFL/ZIP、三字体视觉/Network、分步迁移 |
| FR-012 R6 Prism | Footer DOM 条件加载完整快照；公开面有 64 篇 legacy owner | **部分** | 全量 allowlist/predecessor、批准清理 legacy Prism，普通/代码页验证与 72h |
| FR-013 R7 SEO | 标题文字链接、唯一焦点、轮播/分页语义已本地实现；H1/摘要视觉门已通过 | **部分** | H1与摘要独立主题发布；G-009 内容 allowlist 与 14/28d |
| FR-014 R8 Redirects | 无 redirects/404 allowlist | **未开始** | 从 Search Console/GA4/log 获取证据，精确一跳映射或正式 No-op |
| FR-015 R9 Cache | Cloudflare 只读快照；HTML 当前 DYNAMIC | **未开始执行** | P5 后逐条规则批准，A→B→C→A、静态 HIT/Purge、72h |
| FR-016 R10 Security | WAF/Rate Limit/Transform 只读快照；发现疑似无效 Rate Limit path 表达式 | **未开始执行** | R9 后单条 Log → 72h → Enforce/Log-only 决策，Verified Bots/证书验证 |
| FR-017 统一验收 | 局部 fixtures 与公开端点检查 | **未完成** | 最终 Chrome/Safari、设备、模板、账号、Analytics/Ads/SEO/Cache 全矩阵 |
| FR-018 长期复查 | 尚无生产 Release Day 0 | **未开始** | 每个实际发布记录立即/72h，适用时 7/14/28d；保留所有既有能力 |

## Success Criteria

| 成功标准 | 判定 | 主要缺口 |
|---|---|---|
| SC-001 基线可复现 | **部分** | 完整设备/账号/5-run 与恢复材料 |
| SC-002 可恢复 | **部分** | 主题通过已保留的 Ghost installed predecessor 重新 Activate；仍缺 Ghost Export、routes/redirects predecessor |
| SC-003 功能完整 | **部分** | 真实候选与完整矩阵未跑 |
| SC-004 统计连续 | **未证明** | GA4/Ghost/RUM 请求与一次访问单 page_view 数据 |
| SC-005 广告保护 | **本地候选** | G-003 与 Day 7/14/28 数据 |
| SC-006 SEO 正确 | **基线部分通过** | 生产 R7/R8 Day 0 与 Search Console 14/28d |
| SC-007 阶段性能 | **未证明** | 固定协议 P0 与每单元 5-run/72h |
| SC-008 长期体验 | **样本不足且未到期** | 每个性能单元 Day 0 与 ≥100 RUM cohort |
| SC-009 缓存正确 | **未证明** | 三身份 A→B→C→A 与静态 Purge |
| SC-010 安全与爬虫 | **部分** | Verified Bots、源端证书与 R10 观察 |
| SC-011 隔离与稳定 | **未完成** | 当前仍混合 WIP，尚无独立 72h 单元 |
| SC-012 CI/CD 门禁 | **部分通过** | 正向真实上传与 active 不变已证明；仍缺 workflow/docs/specs-only 0 上传和受控失败矩阵 |

## 当前可继续与必须暂停的边界

可继续：本地语义、构建、ZIP、防回归、只读公开面/Cloudflare 审计、离线候选与恢复模板。

必须暂停并等待确认：Ghost Export 或配置文件下载、任何文件上传、Ghost/Cloudflare 写入、主题候选上传/激活、H1/摘要选择、字体 owner 迁移、未发布 Ghost Preview、内容/redirects/WAF/Cache 修改。旧主题 ZIP 下载已明确不执行。
