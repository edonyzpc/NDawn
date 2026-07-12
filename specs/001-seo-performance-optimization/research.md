# Research: NDawn SEO 与性能优化

**Spec**: [spec.md](spec.md)
**Plan**: [plan.md](plan.md)
**Date**: 2026-07-11

## Scope and Evidence

本研究基于：

- [SEO 与性能优化计划](../../docs/seo-performance-optimization-plan.md)
- [package.json](../../package.json)
- [gulpfile.js](../../gulpfile.js)
- [test.yml](../../.github/workflows/test.yml)
- [deploy-theme.yml](../../.github/workflows/deploy-theme.yml)
- 当前模板、资源和 Git diff
- [GitHub Spec Kit](https://github.com/github/spec-kit)
- [GitHub Actions pull_request 事件](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows)
- [Ghost Admin API Themes](https://docs.ghost.org/admin-api/themes/overview)
- [Ghost 主题上传与激活](https://ghost.org/tutorials/download-and-upload-a-theme/)
- [Ghost Custom Settings](https://docs.ghost.org/themes/custom-settings/)
- [TryGhost Action Deploy Theme](https://github.com/TryGhost/action-deploy-theme)
- [Cloudflare Cache Status](https://developers.cloudflare.com/cache/concepts/cache-responses/)
- [Cloudflare 动态内容与登录缓存排查](https://developers.cloudflare.com/cache/troubleshooting/dynamic-content-and-login-issues/)

本轮没有重新读取 Ghost、Cloudflare、GA4、AdSense 后台。相关线上事实来自上游优化方案，必须在 P0/P1 刷新。

## Research Decisions

### RD-001 — 采用 Spec Kit 风格 SDD 产物

**Decision**：使用 `spec.md -> plan.md/research.md -> tasks.md -> analyze -> implement`。

**Rationale**：让需求、实现计划、任务和验证保持可追踪，避免当前混合 WIP 直接驱动生产。

**Alternative**：只维护一份长优化计划。

**Rejected because**：无法表达独立用户故事、需求 ID、任务依赖和跨产物一致性。

### RD-002 — 本轮不初始化 Specify CLI

**Decision**：只创建 feature-local `specs/001-seo-performance-optimization/`，不生成 `.specify/`。

**Rationale**：用户要求制定开发计划，而不是安装工具或修改仓库级 Agent 配置。

**Revisit**：审查通过并明确采用 Spec Kit CLI 时。

### RD-003 — 顺序验证后上传候选，Ghost 手动激活

**Decision**：F0 在任何主题实现前完成，不保留临时旁路。PR 运行验证；主题相关 `master` push 在一个顺序 job 内固定工具链、构建版本化 ZIP、验证该 ZIP，再上传为未激活候选。Ghost Dashboard 手动激活继续作为生产发布门，不增加 `workflow_dispatch` 或 GitHub Environment 人工审批。

**Evidence**：

- `test.yml` 使用 `pull_request.types: open`；有效事件为 `opened`，PR 更新还需 `synchronize`。
- `test.yml` 与 `deploy-theme.yml` 在 `master` push 时彼此无依赖，候选上传可能早于测试结束。
- Ghost API 将 `themes/upload` 与 `themes/{name}/activate` 分开；用户确认当前流程需要在 Ghost Dashboard 手动激活。
- 当前 `gulpfile.js` 排除 `docs/**`，但没有排除 `specs/**`；若不修复，SDD 文档会进入后续主题 ZIP。
- 当前 `test:zip:ci` 固定检查 `dist/ndawn.zip`；若 staging identity 改变文件名，F0 必须让 GScan 明确检查最终上传文件，不能验证旧路径中的另一个 ZIP。
- TryGhost Action 的 `file` 模式可上传已生成 ZIP，但其官方参数说明表明设置 `file` 时忽略 `theme-name`；因此不能只同时配置两个参数来假设唯一候选成立。

**Recommended design**：

- 分为 F0a 与 F0b 两个内部步骤：F0a 先合并 validation-only workflow 且显式关闭上传；F0b 再以独立批准修正最小 packaging 边界并启用候选上传。两者都是 F0，不增加日常人工门。
- 使用单一顺序 job，前序任一步失败即不执行上传步骤；先生成最终 ZIP，对该文件运行 GScan/内容检查并记录 checksum，再用 `file` 上传，上传步骤不得重打包。
- theme-input gate 以“是否改变构建结果或 ZIP 内容”为准，至少覆盖根目录/partials/members HBS、`assets/**`、`package.json`、`yarn.lock`、`gulpfile.js` 及会进入 ZIP 的根目录静态文件；workflow-only 只验证，`docs/**`/`specs/**` only 不上传且二者必须从 ZIP 排除。
- F0 必须先验证 Ghost 实际采用的主题 identity，再选择在 staging package 中写入版本化 package name 或其他已证实机制；不得依赖被 `file` 忽略的命名参数。
- F0b 首次真实上传前记录 Ghost 已安装列表中的当前 active theme 名称、版本与状态，确认其保持安装且可重新 Activate；它是平台保留的最小恢复点，禁止删除且不要求下载旧 ZIP。
- 候选 identity 必须唯一，F0 必须证明上传结果未激活且当前 active theme 不变。
- 唯一 identity 的设置保真不能从“未激活”推断：P0 必须快照全部 `@custom` 当前值，后续每次 Dashboard 激活前后逐项比对并验证关键渲染；不一致时立即激活直接 predecessor 并恢复设置。
- PR 可自动取消旧验证；`master` 候选上传组使用 `cancel-in-progress: false` 串行化，避免上传中途被取消。若实现 latest-SHA 检查，旧 run 只能在上传前安全跳过，不得中断已开始的上传。
- F0b 启用上传后必须重跑 PR 三种事件、故意失败、workflow/docs/specs-only 全部负向路径；不能用 F0a“上传关闭”时的 0 上传结果代替。
- Release Day 0 只从 Ghost Dashboard 实际激活时间开始。

**Rejected**：继续使用两个无依赖 workflow；增加 `workflow_dispatch`/Environment 第二层人工审批；把候选上传误写成生产激活。

### RD-004 — 保留现有产品能力

**Decision**：保留 Portal、Stripe、Search、三类统计、双评论和两个 Ads 位。

**Rationale**：优化目标是关键路径收敛，不是删功能。

**Rejected**：删除统计、评论、Portal 或 Ads 换取分数。

### RD-005 — 保持 Cloudflare Proxied

**Decision**：`www` 保持 Proxied。

**Rationale**：继续使用 WAF、Cache、Zaraz、RUM、Crawler Hints、Managed robots 和边缘 Analytics。

**Trade-off**：偏离 Ghost 推荐拓扑，增加双 CDN、证书和支持复杂度。

**Rejected**：把 DNS-only 作为常规性能阶段。

**Revisit**：可重复证明 Cloudflare 明显恶化性能、长期阻滞刷新，或 Ghost 支持明确要求时。

### RD-006 — 当前 WIP 必须重新拆分

**Decision**：当前 11 个主题文件不能直接发布。

**Rationale**：Native JS、TOC、Ads、jQuery 版本和范围混合，且实现尚未满足 Spec。

**Rejected**：一次发布后依靠整体主题回滚。

### RD-007 — jQuery 版本与范围分开

**Decision**：R3a 先在全站升级 3.5.1 -> 3.7.1，R3b 再缩小页面范围。

**Rationale**：把库兼容性与依赖移除风险分开。

### RD-008 — Injection 先于 jQuery 范围

**Decision**：R0 先迁移所有会在 Post/Page 执行的 jQuery Injection。

**Rationale**：`ghost_foot` 中同步 inline code 可能早于 deferred jQuery。

**Rejected**：只检查主题源码后直接移除 Post/Page jQuery。

### RD-009 — Main/Post 原生化，Home 暂留 jQuery

**Decision**：R1 迁移通用与文章交互；Owl/Infinite Scroll 所在 Home bundle 暂保留 jQuery。

**Rationale**：优先使 Post/Page 脱离依赖，同时不扩张为首页插件替换项目。

**Deferred**：移除 Owl、Infinite Scroll 或重写 Home bundle。

### RD-010 — Ads 接近视口加载，收益保护优先

**Decision**：初始约 1.5–2 个视口，容器可布局且 Slot 非零后初始化。

**Metrics**：`impressions / Post pageview`、fill rate、RPM、CLS；7/14/28 天。

**Observation policy**：Ads 数据采集和 Day 7/14/28 计时从 R2 Dashboard 激活时立即开始；72 小时技术门只控制后续技术单元。G-008 判定为“不影响 Ads”的单元可继续。Day 7/14/28 发现可归因回归时，从当前已接受 head 构建 rollback-forward，不恢复陈旧的 R2 前 ZIP。

**Rejected**：删除 Ads、点击加载、只看总收入或仅用 7 天低样本结论。

### RD-011 — LCP 证据驱动

**Decision**：R4.x 一次只优化一个模板的一个真实 LCP 候选。

**Rationale**：无证据同时 preload 多个资源会制造新的竞争。

### RD-012 — 字体先去重，暂不默认自托管

**Decision**：先确认主题/Injection 来源，去除重复字重。

**Evidence**：现有本地中文字体体积较大，且 zipper 排除 `assets/css/**`。

**Rejected**：直接启用当前 `woff2` 路径。

**Revisit**：许可、字符子集、可打包目录与包体影响全部确认后。

### RD-013 — Prism 继续由 Footer Injection 所有

**Decision**：通过 DOM 检测，仅在代码文章加载并覆盖 Ghost Code Card。

**Rationale**：避免同一单元同时迁移 owner 和改变加载策略。

**Deferred**：若 Injection 不能满足需求，另立主题迁移 Spec。

### RD-014 — SEO 输出尊重 Ghost 边界

**Decision**：主题只处理可见语义、文字链接、heading 和分页可访问性。

**Rationale**：canonical、OG/X Card、Sitemap、JSON-LD 应由 Ghost 负责。

**Rejected**：主题重复生成 SEO metadata/schema。

### RD-015 — H1 与摘要保留视觉门

**Decision**：H1 只使用自然可见的 `@site.title`；摘要独立预览。

**Rationale**：H1 主要价值是结构与可访问性，不是排名保证。

**Rejected**：隐藏 H1、关键词堆砌或长描述充当标题。

### RD-016 — Redirects 独立发布

**Decision**：R8 只包含有 Search Console、Analytics、外链或日志证据的精确 301。

**Rationale**：保证 chain、loop 和误伤可独立定位与回滚。

### RD-017 — Cloudflare 不缓存个性化 HTML

**Decision**：会员、Post/Page、Admin、API、Portal/Checkout/Comments 不得被共享 Edge Cache；安全结果不能只要求字面 `DYNAMIC`，应按原因接受 `DYNAMIC/BYPASS/MISS`，并通过三身份 A→B→C→A、`Age`、缓存头和内容标记证明无跨用户泄漏。

**Allowed**：可安全刷新的 CSS、JS、图片，且尊重上游缓存语义。

### RD-018 — Cloudflare 规则逐条治理

**Decision**：R9 先 Cache，稳定后 R10 Security；一次一条规则或严格同类组。所有 Cache Rule 的新增、修改、禁用、删除和顺序调整都留在 R9；R10 只处理 WAF、Rate Limit 与 Transform。

**Rationale**：Cache、WAF、Rate Limit、Transform 的故障表现与回滚不同。

### RD-019 — 不新增完整测试框架作为前置

**Decision**：使用 Node syntax、GScan、ZIP 检查和固定浏览器 Smoke。

**Rationale**：仓库当前没有单元/E2E 基础，本轮优先隔离生产风险。

**Caveat**：若 R1/R2 继续复杂化，可另立最小 DOM fixture 测试单元。

### RD-020 — 72 小时门使用预先锁定阈值

**Decision**：P0 完成后、R0 开始前锁定 G-007；默认采用固定 Smoke 100%、可复现新增 Console 错误 0、核心 URL 脚本化检查意外 4xx/5xx 为 0、实验室 CLS 中位数绝对回退不超过 0.02、核心页面 LCP 中位数回退不超过 `max(10%, 250ms)`。生产 5xx、INP 与 RUM 只有在 P0 定义可靠数据源、分母、排除项和最低样本后才可成为硬门，否则作为观察项。

**Rationale**：72 小时门会阻断下一批，不能依赖“高频”“明显”等主观描述。

**Revisit**：P0 真实基线证明默认值不适用时，必须记录原因并在 R0 前单独批准替代阈值。

### RD-021 — 长期指标使用独立 Day 0

**Decision**：每个主题单元以 Ghost Dashboard 实际激活时间为 Day 0，每个平台配置单元以实际生效时间为 Day 0。Ads、每个 R7.x/R8、每个性能单元、每个 R9.x/R10.x 都保留独立窗口；最终组合窗口不能覆盖单元窗口。

**Rationale**：发布错峰且观察窗重叠，统一按“项目第 N 天”会把不同变更的影响混在一起。

**Rejected**：等全部发布完成后才启动 Ads 或 SEO 的 7/14/28 天计时。

### RD-022 — 长期目标非阻断

**Decision**：约 20% LCP、28 天 RUM CWV、Page Load 与 Search Console 趋势属于阶段目标，不作为单次发布硬门；每份报告必须给出“达成 / 未达成 / 样本不足”。

**Rationale**：当前 RUM 与 SEO 样本受流量、设备、网络和索引延迟影响，不能用低样本趋势阻止一个已通过技术门的独立单元。

**Hard gates retained**：G-007 单元回退线、功能完整、无重复 Analytics、Ads 保护、缓存隔离、SEO 技术端点和可回滚性。

## Open Research Items

F0/P0/P1 必须补齐：

- GitHub branch protection、当前 Action 权限和可用 secrets。
- 实际 Node、Yarn、Gulp 可复现版本，以及完整 theme-input path filter/concurrency 表达式。
- `file` 模式下 Ghost 采用的主题 identity、最终同一 ZIP 的 checksum、版本化候选名、`active=false` 和当前 active theme 不变证据。
- zipper 对 `docs/**`、`specs/**`、`.github/**`、`gulpfile.js` 等开发文件的完整排除清单。
- 当前线上主题是否对应 `origin/master`，及可回滚主题名/SHA。
- 所有 Site/Page/Post Injection 及其 owner。
- Prism、字体、Ads、GA4、RUM 的唯一来源。
- 固定测试 URL、会员账号与内容可见性矩阵。
- 视频 spacer 成为 LCP 的具体页面和原因。
- Cloudflare Cache/WAF/Transform 当前表达式、顺序和命中数据。
- Ghost/Fastly 直连 SNI 与证书状态。
- Search Console 历史 404 和 redirects 候选。

## Deferred / Out of Scope

- DNS-only 常规迁移。
- 全站 CSS 拆包。
- Owl Carousel、Infinite Scroll、PhotoSwipe 移除。
- 评论点击后加载。
- Zaraz 迁出 Cloudflare。
- 未审计其他源站前启用全局 Full Strict。
- 无真实 LCP 证据的多资源 preload。
- 隐藏 H1、关键词堆砌。
- 用单日 Ads/RUM/SEO 数据判断成败。
- 在本轮初始化或升级整个 Spec Kit 工具链。
