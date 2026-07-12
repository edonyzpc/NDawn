# 001 — NDawn SEO 与性能优化 SDD

> 状态：Draft，等待审查
> 创建时间：2026-07-11
> 上游方案：[SEO 与性能优化计划](../../docs/seo-performance-optimization-plan.md)

本目录按照 GitHub Spec Kit 的 Spec-Driven Development 流程组织：

```text
Spec -> Plan -> Tasks -> Analyze -> Implement -> Verify
```

当前仓库尚未初始化 `.specify/`，本轮也没有安装 Specify CLI、创建分支或执行实现。这里仅先建立与 Spec Kit 兼容的 feature-local Markdown 产物，供审查通过后使用。

## 产物索引

| 产物 | 作用 | 当前状态 |
| --- | --- | --- |
| [spec.md](spec.md) | 用户故事、需求、边界、成功标准与决策门 | Draft |
| [plan.md](plan.md) | 技术上下文、门禁、架构、阶段、测试和回滚 | Draft |
| [research.md](research.md) | 技术决策、证据、替代方案与待研究事项 | Draft |
| [tasks.md](tasks.md) | 可执行任务、依赖、并行标记、需求追踪 | Draft |
| [quickstart.md](quickstart.md) | 单发布单元的执行与验证手册 | Draft |
| [checklists/requirements.md](checklists/requirements.md) | SDD 规范质量与需求完整性检查 | Draft |

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

该分支尚未创建。当前工作区存在 11 个混合主题 WIP 文件，实施前必须先确定其所有权和隔离方式，不能直接把当前工作区作为第一个发布单元。

## 进入实现前的总门

- [ ] SDD 产物审查通过。
- [ ] F0 CI/CD Candidate Upload Gate 已正式通过：F0a 顺序验证、F0b packaging/上传均有证据，不存在临时旁路。
- [ ] P0 完整基线与回滚包已经完成。
- [ ] P1 第三方所有者矩阵及硬门已经完成。
- [ ] 当前混合 WIP 已冻结并可从干净基线重新拆分。
- [ ] 首个线上发布单元获得单独授权。

## 一致性复核（2026-07-11）

- ✅ 已确认低负担 CI/CD：`master` 自动验证并上传未激活候选，Ghost Dashboard 手动激活；不增加 GitHub 人工审批。
- ✅ Ads Day 7/14/28 为非阻断旁路，只有 Ads-affecting 候选暂停或另立 R2.x；延迟回退使用 rollback-forward。
- ✅ 约 20% LCP、28 天 RUM CWV 与 Search Console 趋势为非阻断目标；G-007/G-008/G-009 保留可执行硬门。
- ✅ 18 条 FR、13 条 NFR、12 条 SC、9 个决策门均被任务追踪。
- ✅ T001–T177 连续，主链与 Ads 旁路在 T176 汇合；无未知需求 ID、断链或残留澄清标记。
- ✅ 第二轮 Agent Team 发现的 F0 `file/theme-name`、唯一 `FINAL_ZIP`、packaging 边界、主题设置保真、Cache 状态、5xx 口径、Ads 分类、R10 双周期、逐 predecessor 回滚与每单元 Day 0 已纳入文档。
- ⛔ 文档可进入人工审查，但 F0 的 theme identity 仍需按任务做真实验证；P0、P1 与线上授权也未完成，因此不可实施后续主题或线上配置发布。
