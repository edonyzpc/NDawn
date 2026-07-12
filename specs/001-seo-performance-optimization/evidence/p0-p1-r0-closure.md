# P0 / P1 / R0 Closure

日期：2026-07-12  
状态：`P0 CLOSED WITH ACCEPTED EXTERNAL GAPS / P1 CLOSED / R0 NO-OP`

## P0

- 公开技术面、恢复演练、Chrome/Safari Desktop、Chrome/Safari 390×844 与 768×1024、匿名与付费会员、Portal 入口、Search、Theme、TOC、PhotoSwipe、Comments/Giscus、Ads 已有直接证据。
- Checkout 与真实免费会员会话因缺少专用测试身份没有执行，也没有被写成 Pass。
- 用户明确接受两项作为外部缺口并要求关闭 P0、继续后续发布阶段；决策记录为 D-031。
- D-031 不豁免 R9 的匿名/免费/付费 A→B→C→A 缓存隔离硬门。

## P1 Freeze

- 当前 `codex/001-seo-performance-optimization` 仍是多单元 authoring WIP，冻结规则是“禁止直接生成生产候选”。
- `unit-scope-matrix.md` 已固定每个 release unit 的允许源码、必须重建产物和禁止夹带项。
- R1、R2、R3a、R3b、R4、R5a、R5b、R7a、R7b 共 9 个独立候选 worktree 于关闭时复核为 clean。
- R1→R2→R3a→R3b→R4→R5a→R5b parent 链与 release ledger 一致；R7a/R7b 是从 R4 建立的预验证链，生产时仍须在 R6 accepted head 重建。
- P1 owner gate 保留：R3b 必须等待 R1/R2/R3a；R5/R6 必须按既定顺序，不能绕过。

## R0 No-op

- Ghost Export 覆盖 215 条 Post/Page；68 条非空 Injection 的 jQuery 命中为 0。
- 因迁移集合为空，R0 Injection diff 为空，不需要原生 API 重写。
- Site/Page/Post Injection predecessor 与 checksum 已在恢复快照保存。
- 未点击 Ghost Save、未修改 Analytics/Fonts/Prism/Comments/Ads owner、未建立配置 Day 0。
- 当前 predecessor 的完整产品 Smoke 已通过；No-op 没有新增回归面，因此立即/72 小时/回滚均为 N/A。
- R0 Exit：`No-op`。

## 下一门

R1 已解除 P0/P1/R0 sequence block，进入独立候选最终验证；上传、`master` push 自动上传与 Ghost Dashboard 激活仍需单独批准。
