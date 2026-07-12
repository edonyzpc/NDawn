# 001 — NDawn SEO 与性能优化 SDD

> 状态：实施中；F0、P0、P1、R0 已关闭，R1 发布前检查中
> 创建时间：2026-07-11
> 上游方案：[SEO 与性能优化计划](../../docs/seo-performance-optimization-plan.md)

本目录按照 GitHub Spec Kit 的 Spec-Driven Development 流程组织：

```text
Spec -> Plan -> Tasks -> Analyze -> Implement -> Verify
```

当前仓库未初始化 `.specify/`，但本 feature-local SDD 已完成审查并进入实施。当前 authoring 分支仍是多单元聚合 WIP，生产发布只能使用从 accepted predecessor 构建的独立 release unit。

## 产物索引

| 产物 | 作用 | 当前状态 |
| --- | --- | --- |
| [spec.md](spec.md) | 用户故事、需求、边界、成功标准与决策门 | Active |
| [plan.md](plan.md) | 技术上下文、门禁、架构、阶段、测试和回滚 | Active |
| [research.md](research.md) | 技术决策、证据、替代方案与待研究事项 | Reviewed |
| [tasks.md](tasks.md) | 可执行任务、依赖、并行标记、需求追踪 | Active tracker |
| [quickstart.md](quickstart.md) | 单发布单元的执行与验证手册 | Active |
| [checklists/requirements.md](checklists/requirements.md) | SDD 规范质量与需求完整性检查 | Reviewed |

## SDD Source of Truth

1. `spec.md` 定义要解决的问题和可验证结果，是实现的主事实来源。
2. `plan.md` 只解释如何满足 Spec，不得自行扩大产品范围。
3. `tasks.md` 中每个实现任务必须追踪到 FR/NFR/SC。
4. 生产证据与异常必须反向更新 Spec、Plan 或 Tasks，不能只修代码。
5. 任一产物发生范围变化后，实施前必须重新执行跨产物一致性审查。

## 当前不生成的标准产物

- `data-model.md`：本功能不新增持久化实体或数据库。
- `contracts/`：本功能不新增 API 或协议；发布证据契约已经写入 `quickstart.md`。
- `.specify/`：需要在用户明确决定采用 Spec Kit CLI 后再初始化，避免产生未审查的仓库级模板和 Agent 配置。

## 推荐实施分支

`codex/001-seo-performance-optimization`

该 authoring 分支已经存在且包含多单元聚合 WIP，明确禁止直接生成生产 ZIP。R1–R5b、R7a/R7b 已使用独立 worktree/commit 形成候选；生产时仍按 accepted predecessor 顺序重建。

## 进入实现前的总门

- [x] SDD 产物审查通过。
- [x] F0 CI/CD Candidate Upload Gate 已正式通过：F0a 顺序验证、F0b packaging/上传均有证据，不存在临时旁路。
- [x] P0 基线与回滚包已完成；Checkout/免费会员按 D-031 作为已接受外部缺口，不计为 Pass。
- [x] P1 第三方所有者矩阵及硬门已经完成。
- [x] 当前混合 WIP 已冻结为禁止直接发布，独立候选可从干净 predecessor 重建。
- [ ] 首个线上发布单元获得单独授权。

## 一致性复核（2026-07-11）

- ✅ 已确认低负担 CI/CD：`master` 自动验证并上传未激活候选，Ghost Dashboard 手动激活；不增加 GitHub 人工审批。
- ✅ Ads Day 7/14/28 为非阻断旁路，只有 Ads-affecting 候选暂停或另立 R2.x；延迟回退使用 rollback-forward。
- ✅ 约 20% LCP、28 天 RUM CWV 与 Search Console 趋势为非阻断目标；G-007/G-008/G-009/G-010 保留可执行硬门。
- ✅ 18 条 FR、13 条 NFR、12 条 SC、9 个决策门均被任务追踪。
- ✅ T001–T177 连续，主链与 Ads 旁路在 T176 汇合；无未知需求 ID、断链或残留澄清标记。
- ✅ 第二轮 Agent Team 发现的 F0 `file/theme-name`、唯一 `FINAL_ZIP`、packaging 边界、主题设置保真、Cache 状态、5xx 口径、Ads 分类、R10 双周期、逐 predecessor 回滚与每单元 Day 0 已纳入文档。
- ✅ F0、P0、P1、R0 已按证据关闭；当前进入 R1 独立候选最终验证与单独发布授权门。
