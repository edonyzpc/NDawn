# Requirements Quality Checklist

**Feature**: [NDawn SEO 与性能优化](../spec.md)
**Created**: 2026-07-11
**Purpose**: 在实施前验证 Spec 的完整性、清晰度、一致性和可追踪性。

## Specification Quality

- [x] 已包含按优先级排列的用户故事。
- [x] 每个用户故事可以独立测试并有明确价值说明。
- [x] 每个用户故事包含 Given/When/Then 验收场景。
- [x] 已覆盖匿名、免费会员和付费会员。
- [x] 已覆盖性能、SEO、Analytics、Ads、Cloudflare 和发布安全。
- [x] 已列出边界情况和失败路径。
- [x] FR、NFR、SC 均有唯一稳定 ID。
- [x] 每条 Functional Requirement 都可验证。
- [x] 性能、广告、缓存和 CI 成功标准均可量化。
- [x] 已记录已确认决策，不重复询问既有产品边界。
- [x] 已把 H1、摘要、Ads 参数、Cloudflare 规则、安全清理、DNS 和稳定性阈值定义为显式决策门。
- [x] 已列出 Assumptions 和 Out of Scope。
- [x] 没有遗留未解决的待澄清标记。

## Source-plan Consistency

- [x] Portal、Stripe、Search、三类统计、双评论和两个 Ads 位全部保留。
- [x] `www.edony.ink` 保持 Cloudflare Proxied。
- [x] DNS-only 只保留应急决策门。
- [x] R0、R1、R2、R3a、R3b 分开。
- [x] Prism 默认保留 Footer Injection owner。
- [x] H1 不被描述为排名保证。
- [x] Redirects 与主题语义分开。
- [x] 观察窗口区分立即、72h、7d、14d、28d。
- [x] Ads、SEO、最终 RUM/Cloudflare 分别定义了独立 Day 0。

## Cross-artifact Traceability

- [x] `plan.md` 中的阶段覆盖 FR-001–FR-018。
- [x] `tasks.md` 中的实现任务标注 FR/NFR/SC。
- [x] `research.md` 记录了主要技术选择与替代方案。
- [x] `quickstart.md` 定义发布证据、验证和停止条件。
- [x] 不需要 `data-model.md`，原因已记录。
- [x] 不需要 API `contracts/`，原因已记录。

## Agent Team Consistency Review

- [x] 非主题配置单元不再被错误要求生成 built/Source Map/ZIP。
- [x] P0 汇总门依赖全部基线任务，并包含构建版本、源码 SHA/干净基线与 G-007。
- [x] Owner 矩阵包含 Ghost Comments，且所有相关能力逐项 Pass/Block。
- [x] H1 与摘要的 Pass/Reject 分支均可关闭，不形成任务死路。
- [x] R10 后重新执行最终 Cloudflare 完整验收矩阵。
- [x] NFR-004、NFR-009、NFR-012 与 G-003/G-005/G-006 均有显式任务覆盖。
- [x] 候选上传与 Ghost Dashboard 生产激活的术语、状态和 Day 0 已完全分离。
- [x] docs/specs-only 不上传，且 packaging 任务显式排除开发产物。
- [x] 已验证同一 ZIP、checksum 与唯一候选 identity 被定义为 F0 技术门；未假设 `file` 与 `theme-name` 可同时生效。
- [x] concurrency 不增加人工步骤，并包含上传边界故障验证。
- [x] 不存在临时 F0 旁路；F0a/F0b 都是正式任务。
- [x] 所有回滚绑定直接 predecessor 或 rollback-forward；R6 禁止恢复 P0 Injection。
- [x] Ads 影响分类、未知按 Yes、非阻断窗口与 rollback-forward 完整。
- [x] A→B→C→A、`DYNAMIC/BYPASS/MISS` 条件验收与缓存响应头证据完整。
- [x] 生产 5xx 的分子、分母、排除项、零基线和样本规则完整。
- [x] R9 拥有所有 Cache Rule 操作，R10 不含 Cache 修改。
- [x] 每个 Release Unit 与最终组合分别有 Day 0，候选上传不启动 Day 0。
- [x] SEO 内容 allowlist、原值、独立发布与字段级回滚已覆盖。
- [x] `.x` 阶段与 R6 均有 no-op/分支关闭出口。
- [x] F0 上传启用后重新执行全部负向矩阵，且因未激活主题而明确豁免 Day 0/72h。
- [x] 最终唯一 `FINAL_ZIP` 被 GScan、内容检查、checksum 与上传共同消费，不再依赖固定旧路径。
- [x] 唯一候选 identity 的主题 `@custom` 设置保真、关键渲染和 predecessor 恢复已覆盖。
- [x] R9/R10 在 Ads Day 28 前执行 G-008，R10 Cache 发现会阻断并退回新 R9.x。
- [x] R10 Log 与目标动作分别有批准、生效 Day 0、立即检查和 72h 周期。

## Implementation Readiness Gates

- [ ] F0 CI/CD Candidate Upload Gate 已实施并验证。
- [ ] P0 Baseline & Recovery Pack 已完成。
- [ ] P1 Integration Ownership Matrix 已完成。
- [ ] 当前 11 个混合 WIP 已冻结并可从干净基线重新拆分。
- [ ] 推荐实现分支已创建。
- [ ] 首个线上发布单元已单独批准。

## Review Result

当前 SDD 文档结构完整，可进入人工审查；尚不可进入实现，因为 F0、P0、P1 和发布授权仍未完成。
