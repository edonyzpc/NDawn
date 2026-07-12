# Feature Specification: NDawn SEO 与性能优化

**Planned Feature Branch**: `codex/001-seo-performance-optimization`（未创建）
**Created**: 2026-07-11
**Status**: Draft for approval
**Input**: 基于 [SEO 与性能优化计划](../../docs/seo-performance-optimization-plan.md)，在完整保留现有产品能力及 `www.edony.ink` Cloudflare Proxied 架构的前提下，改善 SEO、真实性能、缓存正确性和发布可回滚性。

> `Priority P1/P2/P3` 表示用户故事交付优先级；`Phase P0/P1/P5/P8` 表示实施阶段。Cloudflare Proxied、核心产品保留和单发布单元是全局硬约束，不因故事优先级而改变。

## Clarifications

### 已确认决策（更新至 2026-07-12）

| ID | 已确认决策 |
| --- | --- |
| D-001 | 全站保留 Portal、登录、订阅、账户、升级和 Stripe Checkout。 |
| D-002 | 保留 Ghost 原生 Search；桌面、移动及快捷键入口均需可用。 |
| D-003 | Ghost Native Analytics、GA4 与 Cloudflare RUM 全部保留并分别验收。 |
| D-004 | Ghost Comments 与 Giscus 均保留，维持现有非点击加载体验。 |
| D-005 | 保留两个 AdSense 广告位，仅位于 Post family 末尾；Post family 明确指 `post.hbs` 与三个 `custom-*-feature-image.hbs` 模板，不扩展到 Page、首页或归档；允许接近视口加载。 |
| D-006 | Clustrmaps 保持移除。 |
| D-007 | 首页轮播、Load more、PhotoSwipe 暂时保留。 |
| D-008 | H1 仅在可自然融入视觉时增加，不作为排名或性能保证。 |
| D-009 | `www.edony.ink` 保持 Cloudflare Proxied。 |
| D-010 | 接受 Proxied 偏离 Ghost 官方推荐拓扑的历史风险，通过缓存、Purge、证书监测和回滚流程降低风险。 |
| D-011 | robots 策略保持现状：允许传统搜索抓取、禁止 AI 训练、保持既有搜索/引用用途。 |
| D-012 | F0、Injection、Native JS、Ads、jQuery 版本、jQuery 范围、每个 LCP 候选、每个 Fonts 候选、Prism、SEO 主题语义、SEO 内容、redirects、每个 Cloudflare Cache 候选与每个安全规则分别发布；任意两个发布单元不得合并。 |
| D-013 | 保留 `master` 自动触发：CI 在同一顺序 job 内生成最终 ZIP，对该同一文件完成验证与 checksum 后上传未激活的唯一候选主题；Ghost Dashboard 手动激活是唯一生产主题发布门，不增加 GitHub 手动审批。 |
| D-014 | Ads Day 7/14/28 是非阻断安全观察，不冻结无关工作；观察期内只有被判定会影响 Ads 的单元需要暂停或另立 R2.x，延迟回滚使用 rollback-forward。 |
| D-015 | LCP 约 20%、28 天 RUM CWV 与 Search Console 趋势是阶段目标，不作为单次发布硬门；必须报告“达成 / 未达成 / 样本不足”，但不得为追分夹带未计划修改。 |
| D-016 | 不下载当前 active theme ZIP 作为备份。本项目不删除 Ghost 已安装主题；直接 predecessor 必须保留，主题回归时在 Dashboard 直接重新 Activate。候选 ZIP 仍须保存 checksum，源码历史仍须可重建。 |
| D-017 | 首页采用可见站点标题 H1，并为最新 5 篇文章增加两行短摘要；H1 与摘要仍作为 R7a/R7b 两个独立发布单元。 |
| D-018 | 接受主题成为字体唯一 owner，同时完整保留 Modern sans-serif、Elegant serif、LXGW Bright 三个 `@custom` 选项；Site Header 字体清理仍作为独立线上配置单元执行。 |
| D-019 | 允许在 Ghost 创建一个不发布的临时 Draft，依次验证 Custom Full 与 Custom No-image 模板；Draft 不公开、不删除。 |
| D-020 | 个人项目不创建 PR；按发布单元创建独立 commit并直接提交。`master` push 继续自动上传未激活候选，Ghost Dashboard 手动 Activate 仍是唯一生产切换。 |

### 已定义但需阶段执行时确认的决策门

- **G-001 H1 视觉门**：已通过，R7a 上线可见站点标题 H1。
- **G-002 摘要视觉门**：已通过，R7b 为最新 5 篇增加两行短摘要。
- **G-003 广告参数门**：P0 后锁定触发距离、有效样本和收益回滚线。
- **G-004 Cloudflare 规则门**：每条 Cache/WAF/Transform 修改前确认表达式、命中范围和回滚动作。
- **G-005 安全清理门**：Cache 正确性稳定后再确认历史安全规则处理顺序。
- **G-006 DNS 应急门**：仅在出现可重复的性能、刷新、证书或 Ghost 支持证据时另立 DNS-only 方案。
- **G-007 稳定性阈值门**：P0 锁定测量工具、版本、区域、设备、网络、缓存状态和前一已接受基线。默认硬门为固定 Smoke 100% 通过、可复现新增 Console 错误为 0、核心 URL 脚本化检查中的意外 4xx/5xx 为 0、实验室 CLS 中位数绝对回退不超过 0.02、核心页面 LCP 中位数回退不超过 `max(10%, 250ms)`；P0 可依据重复测量噪声提出替代值，但必须在 R0 前单独批准。生产 5xx、INP 与 RUM 在没有可靠数据源和足够样本时只作观察项，不得伪装成硬门。
- **G-008 Ads 影响门**：R2 激活后至 Day 28 结束前，每个候选必须在发布前判定是否修改 `post.js`、Ads CSS/partial、Post family 模板布局、共享 Injection 或会影响广告请求的 Cache/WAF；判定为“影响 Ads”时必须等待对应收益结论或另立 R2.x 并重置 Day 0，判定为“不影响”时可在 72 小时技术门后继续；无法确认时一律按“影响 Ads”处理。
- **G-009 SEO 内容范围门**：根据 Search Console、GA4 与内容重要性形成明确 allowlist；在 Ghost Dashboard 修改前确认具体 Tag/Post、字段、原值和回滚证据，不进行无依据批量改写。

## User Scenarios & Testing

### User Story 1 — 安全且可回滚地交付优化（Priority: P1）

作为站点所有者，我希望每项线上优化都有可复现基线、自动或人工发布门禁、独立验收和单独回滚能力，以免混合改动直接进入生产并造成无法定位的回归。

**Why this priority**：当前 WIP 混合功能重构、缺陷修复与性能优化；同时 `master` 推送会上传 Ghost 候选主题，而现有测试 workflow 与上传 workflow 相互独立。

**Independent Test**：选择任一发布单元，仅凭 P0 资料完成隔离构建、发布前验证、发布后检查及单元级回滚，不依赖当前混合工作区，也不修改其他单元。

**Acceptance Scenarios**

1. **Given** 尚未进行线上修改，**When** P0 完成，**Then** 固定 URL、测试条件、用户状态、配置快照、指标基线和完整回滚包均可复用。
2. **Given** PR 创建、更新或重开，**When** CI 运行，**Then** 每次变更都会触发验证。
3. **Given** 主题相关提交进入 `master`，**When** 顺序 job 运行，**Then** 只有同一版本化 ZIP 完成构建、GScan 与包检查后才上传为未激活候选；文档-only 提交不上传主题。
4. **Given** 候选主题已经上传，**When** 尚未在 Ghost Dashboard 手动激活，**Then** 当前公开主题和 Release Day 0 均保持不变。
5. **Given** 一个候选发布包，**When** 审查其变更范围，**Then** 只包含当前发布单元允许内容，没有夹带后续单元或外部配置修改。
6. **Given** 一个技术单元已激活，**When** G-007 锁定的 72 小时阈值尚未通过，**Then** 下一技术单元不得激活。
7. **Given** 当前单元发生回归，**When** 执行回滚，**Then** 使用直接 predecessor 或 rollback-forward 只移除可归因单元，其他已验收能力不受影响。

---

### User Story 2 — 更快地阅读核心页面（Priority: P1）

作为移动端或桌面端访客，我希望首页、普通文章和慢 LCP 页面更快呈现主要内容，同时保持现有视觉和交互。

**Why this priority**：当前移动端 LCP P75 约 3.67s，真实首屏资源竞争是本轮最高潜力优化方向。

**Independent Test**：对固定首页、普通文章和视频/慢 LCP 文章，在相同设备与网络条件下各运行至少 5 次，以中位数比较 P0 和优化后结果。

**Acceptance Scenarios**

1. **Given** 某模板尚未确认 LCP 元素，**When** 开始优化，**Then** 先定位真实 LCP，只提高一个已确认候选资源的优先级。
2. **Given** 普通非代码文章，**When** 页面加载，**Then** Prism Runtime 不进入加载链路。
3. **Given** Post 或 Page 已满足 jQuery 移除前置门，**When** 页面加载和交互，**Then** 不下载 jQuery 且无功能或 Console 回归。
4. **Given** 字体、广告、评论等非首屏资源存在，**When** 页面首次渲染，**Then** 它们不应无必要地争夺真实 LCP 关键资源。

---

### User Story 3 — 完整使用既有产品功能（Priority: P1）

作为匿名访客、免费会员或付费会员，我希望优化前后仍能正常搜索、登录、订阅、访问对应内容、评论、浏览图库和进入 Checkout。

**Why this priority**：性能优化不得以删除或削弱核心产品体验换取分数。

**Independent Test**：使用匿名、免费会员、付费会员覆盖首页、Post、Page、Tag、Author、分页和三个 Custom Post 模板的功能矩阵。

**Acceptance Scenarios**

1. **Given** 任一支持的用户状态，**When** 使用桌面、移动或快捷键 Search 入口，**Then** 均打开同一 Ghost 原生 Search。
2. **Given** 用户进入 Portal，**When** 执行登录、订阅、账户或升级流程，**Then** 流程可继续且没有重复 Portal 实现。
3. **Given** 需要付费的流程，**When** 验证 Stripe，**Then** 仅创建并跳转 Checkout，不在生产环境执行真实扣款。
4. **Given** Post 或 Custom Post，**When** 使用菜单、主题切换、TOC、PhotoSwipe、表格或评论，**Then** 行为与已验收基线等价。

---

### User Story 4 — 被搜索引擎正确理解与索引（Priority: P2）

作为搜索访问者和站点所有者，我希望页面语义、canonical、robots、Sitemap、RSS 和历史 URL 保持正确，避免重复信号或索引损失。

**Why this priority**：语义与历史 URL 优化有长期价值，但必须建立在产品与性能稳定之上。

**Independent Test**：抽查首页、Post、Page、Tag、Author、Sitemap URL 和一组历史 URL，不依赖性能改动即可独立验证 SEO 输出。

**Acceptance Scenarios**

1. **Given** 任一公开模板，**When** 检查 SEO 输出，**Then** 只有一个绝对 canonical，Ghost 管理的 Open Graph、X Card、JSON-LD 与 Schema 不重复或丢失。
2. **Given** 搜索爬虫访问站点，**When** 请求 `robots.txt`、Sitemap 或 RSS，**Then** 返回 200 且没有意外 `noindex` 或 `Disallow: /`。
3. **Given** 首页文章卡片，**When** 键盘或辅助技术导航，**Then** 标题是真实文字链接，overlay 不产生重复 Tab 焦点。
4. **Given** 一个获准保留的历史 URL，**When** 访问该 URL，**Then** 一次 301 到最终 canonical，无 chain、loop 或路由误伤。
5. **Given** G-009 批准一组重点内容，**When** 修改 Tag description、Post excerpt 或 Feature image alt，**Then** 只修改 allowlist 内字段、保留原值，并与主题语义、redirects 和 Cloudflare 分批发布。

---

### User Story 5 — 保持统计连续与广告收益（Priority: P2）

作为站点所有者，我希望性能优化后仍能获得连续、无重复的统计数据，并避免广告曝光和收益持续异常下降。

**Why this priority**：Analytics 是决策依据，AdSense 是重要收益来源，二者不能被性能分数替代。

**Independent Test**：在关闭广告拦截器的普通 Post 与三个 Custom Post 上验证统计请求、两个广告 Slot、布局及 7/14/28 天标准化收益指标。

**Acceptance Scenarios**

1. **Given** 一次正常访问，**When** 检查统计请求，**Then** GA4 只有一个 `page_view`，Ghost Native Analytics 与 Cloudflare RUM 分别保持连续。
2. **Given** 用户接近文章末尾广告位，**When** 达到加载阈值，**Then** 两个广告位在具有非零尺寸后初始化且不重复触发。
3. **Given** Slot 未填充或广告脚本失败，**When** 页面完成布局，**Then** 不留下异常大块空白或造成明显 CLS。
4. **Given** 广告流量样本充足，**When** 比较同等流量结构下标准化指标，**Then** `impressions / Post pageview`、fill rate 和 RPM 不持续下降超过约 10%。
5. **Given** R2 正处于收益观察期，**When** 后续候选准备发布，**Then** 先执行 G-008；不影响 Ads 的候选可以继续，影响 Ads 的候选等待或另立 R2.x。
6. **Given** Day 7/14/28 才发现可归因的 Ads 回归，**When** 后续主题单元已经激活，**Then** 在当前已接受 head 上执行 rollback-forward，而不是恢复陈旧的 R2 前 ZIP。

---

### User Story 6 — 在 Cloudflare Proxied 下稳定运行（Priority: P3）

作为站点运维者，我希望继续使用 Cloudflare WAF、Cache、Zaraz、RUM、Crawler Hints、Managed robots 和边缘 Analytics，同时避免双 CDN 导致个性化 HTML 缓存、内容陈旧、爬虫误拦或源端证书问题被掩盖。

**Why this priority**：这是主题性能阶段统一验收后的架构加固工作，但 Proxied 本身始终是硬约束。

**Independent Test**：不修改 DNS，通过匿名、免费会员、付费会员响应头矩阵、内容更新、精确 Purge、爬虫和源端证书检查独立验收。

**Acceptance Scenarios**

1. **Given** 匿名、免费会员和付费会员使用独立浏览器 profile 执行 A→B→C→A 请求，**When** 检查响应头、`Age` 和内容标记，**Then** 个性化 HTML 不出现共享 `HIT/STALE/UPDATING`，并可按原因接受 `DYNAMIC/BYPASS/MISS`，任何身份均不会收到其他身份内容。
2. **Given** 主题、内容、routes 或 redirects 更新，**When** Cloudflare 未及时反映上游版本，**Then** 只精确 Purge 相关 URL/资源并恢复新版本。
3. **Given** Verified Bot 访问公开内容，**When** 命中 WAF，**Then** 不被 Challenge 或 Block，放行逻辑不只依赖可伪造 User-Agent。
4. **Given** Cloudflare 边缘证书正常，**When** 绕过代理检查 Ghost/Fastly，**Then** `www.edony.ink` 的 SNI、源端证书和完整 HTTPS 页面同样正常。

## Edge Cases

- 全局或页面级 Injection 仍在 Post/Page 调用 jQuery 时，R3b 必须停止。
- TOC 标题包含中文、空格、标点、重复文本、特殊 ID 或没有 ID。
- 广告脚本已存在、加载失败、快速滚动、重复 Observer 回调或浏览器无 `IntersectionObserver`。
- 广告 Slot 初始化时宽高为零，或广告返回 unfilled。
- 视频 spacer、文本或图片中的任意一个成为实际 LCP，不能按模板名称猜测。
- Ghost Code Card 没有 `language-*` class，但仍需按代码文章处理。
- 字体同时来自主题、Site Injection 与 Page Injection，或自托管字体缺少许可、子集及打包路径。
- 匿名、免费和付费会员收到不同 HTML 时，任何一类都不得被共享 Edge Cache。
- Cloudflare 返回旧主题、旧内容、旧 Sitemap、旧 RSS 或旧 redirects。
- GA4 同时由 Zaraz 与 Ghost Header 注入，造成重复 `page_view`。
- H1 或首页摘要预览破坏现有视觉时，应放弃候选而非隐藏实现。
- 历史 URL 与现有 Ghost 路由冲突，或产生 redirect chain/loop。
- 广告样本不足以在 7 天作结论时，观察期延长至 14/28 天。
- 候选 ZIP 名称与当前激活主题相同可能覆盖线上主题；F0 必须证明版本化上传后 `active=false` 且当前 active theme 不变。
- 当前 zipper 未显式排除 `specs/**` 等开发产物；F0 必须先修复打包边界，并证明 docs/specs-only 提交既不上传候选，也不会进入后续主题 ZIP。
- 上传 Action 的文件模式与候选命名参数可能不兼容；F0 不得假设同时传参即可满足“同一 ZIP + 唯一候选”，必须验证 Ghost 实际采用的主题 identity。
- 唯一候选 identity 可能使 Ghost 将候选视作另一主题；P0 与每次主题激活必须保存并逐项比对全部 `@custom` 值及关键渲染结果，防止字体、暗色 Logo、Featured、分享、作者、相关文章或 Ads 开关回到默认值。
- R2 观察期内的后续单元若触碰 Post family、共享 Injection、缓存或广告请求链，必须按 G-008 判为 Ads-affecting，不能以任务名称推断无影响。
- Cloudflare 边缘正常但源端证书过期、SNI 不匹配或完整页面不可用。
- 收窄旧 WAF/Skip/Rate Limit 规则后出现误报时，只回滚当前规则。

## Requirements

### Functional Requirements

- **FR-001 — 基线与回滚**：MUST 建立固定性能页面、功能 Smoke 页面、设备/浏览器、用户状态和内容权限矩阵；MUST 在 Ghost 已安装主题中保留并记录线上直接 predecessor 的名称、版本、状态及重新 Activate 路径，不要求下载其 ZIP；MUST 备份当前全部主题自定义设置值、Ghost Export、全局及页面级 Injection、routes、redirects 与关键 Cloudflare 配置。
- **FR-002 — 所有者与依赖审计**：MUST 记录 Portal、Search、Analytics、字体、Prism、Comments、Giscus 与 Ads 的唯一来源、注入层级、页面范围和加载时机；所有者未确认时 MUST 阻断相关单元。
- **FR-003 — 隔离发布总门**：当前混合 WIP MUST NOT 直接发布；每个单元 MUST 有独立版本、变更记录、批准记录和回滚记录。主题单元 MUST 具有同一提交生成的 source、built、Source Map 与 ZIP；Injection、redirects、CI/CD、Cloudflare 等配置单元 MUST 具有脱敏 diff、时间戳快照、checksum（适用时）和可恢复旧配置。
- **FR-004 — CI/CD 与候选上传门禁**：PR 创建、更新和重开时 MUST 运行验证；主题相关 `master` push MUST 在同一个顺序 job 中固定工具链、生成最终版本化 ZIP、对该同一文件运行语法/GScan/ZIP 检查并记录 checksum，且只在全部通过后以文件模式上传，上传步骤不得重新打包。候选 identity MUST 唯一并通过真实上传证明不会覆盖或激活当前主题；不得依赖未经验证的“文件 + 命名参数”组合。theme-input path gate MUST 覆盖所有会改变构建结果或 ZIP 内容的文件；`docs/**`、`specs/**` only push MUST NOT 上传，且这些目录 MUST NOT 进入 ZIP。Ghost Dashboard 手动激活是唯一生产主题门；并发 push MUST 自动取消或串行化旧候选。
- **FR-005 — R0 Injection**：所有会在 Post/Page 运行的 jQuery Injection MUST 迁移为原生行为；新 Injection MUST 兼容当前线上旧主题。
- **FR-006 — R1 Native JS 与 TOC**：子菜单、Burger、主题切换、阅读进度、响应式表格、TOC 与 PhotoSwipe MUST 与基线行为等价；TOC MUST 保存并使用原始 heading ID。
- **FR-007 — R2 Ads**：两个广告位 MUST 仅位于 `post.hbs` 与三个 `custom-*-feature-image.hbs` 末尾并在约 1.5–2 个视口距离内触发；初始化前 MUST 使容器可布局、至少等待一帧并确认 Slot 非零；MUST 处理失败、重复、快速滚动、无 Observer 与 unfilled。R2 激活后 MUST 启动非阻断 Day 7/14/28 观察，并对后续候选执行 G-008；延迟回滚 MUST 基于当前已接受 head 构建 rollback-forward 单元。
- **FR-008 — R3a jQuery 版本**：jQuery 3.5.1 -> 3.7.1 MUST 作为独立单元，页面范围暂时保持全站。
- **FR-009 — R3b jQuery 范围**：仅在 R0、R1、R2、R3a 通过且 Post/Page Injection 不再依赖 jQuery 后，jQuery 才可收敛至首页、分页、Tag 与 Author。
- **FR-010 — R4 LCP**：MUST 按模板识别真实 LCP；每个发布单元 MUST 只优化一个模板中的一个已确认候选。
- **FR-011 — R5 Fonts**：MUST 审计主题、Site Injection 与 Page Injection 字体来源并消除重复；自托管仅可在许可、子集、目录复制和 ZIP 路径确认后实施。
- **FR-012 — R6 Prism**：Prism MUST 保持代码高亮且无需点击；默认由 Footer Injection 作为唯一所有者，通过包含 Ghost Code Card 的 DOM 检测按需加载。
- **FR-013 — R7 SEO**：主题语义单元中，卡片标题 MUST 为真实文字链接且不得产生重复焦点，heading、分页与已批准可见 H1 MUST 可理解，主题不得重复 Ghost SEO 元数据；Tag 描述、重点文章 excerpt 与 Feature image alt MUST 只对 G-009 allowlist 作为独立内容单元逐组批准，不与主题语义同日发布。
- **FR-014 — R8 Redirects**：只可添加有证据的精确 301；旧 URL MUST 一跳到最终 canonical，无 chain、loop 或路由误伤。
- **FR-015 — R9 Cloudflare Cache**：`www` MUST 保持 Proxied；个性化 HTML 不得出现共享 `HIT/STALE/UPDATING`，可根据原因接受 `DYNAMIC/BYPASS/MISS`；MUST 使用匿名/免费/付费独立 profile 的 A→B→C→A 内容隔离矩阵验证；动态路径 MUST 绕过缓存；禁止 `Cache Everything`，静态缓存 MUST 尊重上游语义并支持精确 Purge。所有 Cache Rule 新增、修改、禁用、删除和顺序调整均只属于 R9.x。
- **FR-016 — R10 Cloudflare Security**：每次只修改一条规则或一个同类规则组；MUST 保存旧表达式、动作与优先级；Verified Bots 不得被误拦；规则 MUST 先 Log/观察再强制。
- **FR-017 — 统一验收**：MUST 在 Chrome/Safari、手机/桌面、核心模板、三个 Custom Post 和匿名/免费/付费状态下完成主题 `@custom` 设置保真、产品、Console、Network、SEO、Analytics、Ads 与 Cache 验收；R9/R10 完成后 MUST 对最终 Cloudflare 状态重新执行该矩阵，不得只复用 P5 结果。
- **FR-018 — 长期复查与保留边界**：除不激活主题的 F0 外，MUST 记录每个生产 Release Unit 的激活/生效 Day 0，并执行立即、72 小时及适用的 7/14/28 天观察；F0 只执行专用正负上传、active 不变和回滚矩阵。Ads、RUM 与 Search Console 长期结果不冻结无关单元，结论 MUST 为“达成 / 未达成 / 样本不足”。MUST 全程保留已确认产品与 Cloudflare 能力；DNS-only 仅可在 G-006 后另立并审批方案。

### Non-Functional Requirements

- **NFR-001 — 可重复测量**：P0 MUST 固定测量工具与版本、执行区域、浏览器/设备、网络、冷/热缓存、账号和 URL；三个核心性能页面在每种既定组合下至少运行 5 次并取中位数，后续单元使用相同协议和前一已接受版本比较。
- **NFR-002 — 性能**：单元硬门按 G-007 防止 LCP/CLS 回退；阶段累计目标为核心页面移动端 LCP 中位数较 P0 改善约 20%，28 天 RUM 目标为 LCP P75 ≤ 2.5s、CLS ≤ 0.1、INP ≤ 200ms。累计/RUM 目标是非阻断目标，样本不足或未达成必须如实报告。
- **NFR-003 — 兼容性**：MUST 支持 Chrome 与 Safari 的手机和桌面场景，并覆盖首页、分页、Post、Page、Tag、Author 和三个 Custom Post。
- **NFR-004 — 可访问性**：可见标题、heading 层级、键盘焦点、分页标签与有意义图片 alt 不得退化。
- **NFR-005 — 稳定性**：除 F0 外的生产单元 MUST 按 G-007 验收；固定 Smoke 必须 100% 通过，可复现新增 Console 错误和核心 URL 脚本化检查中的意外 4xx/5xx 必须为 0，LCP/CLS 不得超过批准的单元回退线。F0 使用专用正负上传、active 不变和回滚矩阵。生产 5xx、INP 与 RUM 只有在 P0 记录可靠数据源、分母、排除项和最低样本后才可升级为硬门，否则只能作为观察证据。
- **NFR-006 — 缓存正确性**：会员、认证及个性化 HTML 不得被共享 Edge Cache；验证不能只依赖单个 `CF-Cache-Status`，必须同时检查 A→B→C→A 内容隔离、`Age`、`Cache-Control`、`Vary`、`ETag`、Ray ID、Cookie/Authorization、规则命中与实际可见权限；静态资产更新后必须能及时刷新。
- **NFR-007 — 可观测性**：每次发布必须保留时间、测试 URL、响应头、规则命中、关键指标和异常/回滚记录。
- **NFR-008 — 可逆性**：每个发布单元和 Cloudflare 规则必须能单独回滚。直接 predecessor 仍是当前 head 时可恢复前一版本；后续单元已叠加时必须通过 rollback-forward 从当前 head 移除目标单元并重新构建，不能恢复陈旧 ZIP 或 P0 快照而连带撤销已接受单元。
- **NFR-009 — 安全性**：文档不得记录敏感值；爬虫放行不得仅依赖 User-Agent；阻断规则须先观察误报。
- **NFR-010 — 可维护性**：每项第三方资源必须有唯一所有者、明确页面范围与加载责任。
- **NFR-011 — 构建质量**：每个主题单元必须通过语法、GScan、ZIP 内容和差异完整性检查，不得夹带无关修改。
- **NFR-012 — 支持性**：必须保留 Proxied 风险说明、精确 Purge、源端证书检查和 Proxy 状态应急手册。
- **NFR-013 — 发布完整性**：候选上传必须消费同一顺序 job 中已经通过验证并记录 checksum 的最终 ZIP；测试与上传不得并行，上传步骤不得重建 ZIP，上传不得自动激活。每次主题激活前后 MUST 比对全部当前 `@custom` 值与关键渲染结果；不一致时立即恢复直接 predecessor 并恢复设置。主题单元的 Release Day 0、72 小时与长期窗口只以 Ghost Dashboard 实际激活时间为准；平台配置单元按实际生效时间计时。F0 仅验证未激活候选上传，豁免 Day 0/72 小时，使用专用正负测试矩阵关闭。

### Key Entities

- **Baseline Snapshot**：固定 URL、设备/网络、用户状态、响应头、性能、SEO、Analytics 与 Ads 初始数据。
- **Release Unit**：一次独立实现、发布、观察及回滚的最小变更集合。
- **Integration Ownership Record**：第三方资源的唯一来源、注入层级、页面范围和加载责任。
- **Rollback Package**：Ghost 平台中保留的已安装主题 predecessor、候选主题 ZIP/checksum、Ghost Export、Injection、routes、redirects 与 Cloudflare 规则旧状态。
- **Candidate Theme**：同一顺序 job 生成、验证并记录 checksum 后，以已验证的唯一 identity 上传到 Ghost、但尚未激活的最终 ZIP；它不是生产发布。
- **Activation Record**：Ghost Dashboard 手动激活的主题名、commit SHA、ZIP checksum、操作者和时间；该时间是主题 Release Day 0。
- **Rollback-forward Unit**：以后续已接受 head 为基线，只反向移除可归因旧单元并重新验证、上传和激活的新发布单元。
- **Observation Window**：立即、72 小时、7/14/28 天的指标和停止条件。
- **Decision Gate**：需要在具体阶段确认后才能继续的视觉、广告、规则、安全或 DNS 决策。
- **Release Evidence Record**：当前批次的目标、允许范围、提交、构建、批准、验证、观察和回滚证据。

## Success Criteria

- **SC-001 — 基线可复现**：P0 页面、用户状态、指标和响应头均有完整记录，后续可在相同条件下 100% 重测。
- **SC-002 — 可恢复**：主题可通过 Ghost 平台中保留的已安装 predecessor 直接重新 Activate；Injection、routes、redirects 与关键 Cloudflare 配置均能恢复到直接 predecessor；旧单元延迟回滚可从当前已接受 head 构建 rollback-forward，不依赖当前混合工作区。
- **SC-003 — 功能完整**：统一验收矩阵中的主题自定义设置、关键渲染、核心产品和主题交互通过率为 100%。
- **SC-004 — 统计连续**：Ghost Native Analytics、GA4 和 RUM 连续；一次访问仅产生一个 GA4 `page_view`。
- **SC-005 — 广告保护**：普通 Post 与三个 Custom Post 中两个广告位的位置正确；Day 7/14/28 均形成标准化指标结论。样本充足时 normalized impressions、fill rate 或 RPM 不持续下降超过 G-003 回滚线；样本不足明确记录，不阻断无关单元。
- **SC-006 — SEO 正确**：核心端点返回 200；每页仅一个自洽 canonical；无意外阻止抓取。每个 R7.x/R8 单元保留独立 Day 0，14/28 天 Search Console 按固定属性、URL 集和基线窗口报告“达成 / 未达成 / 样本不足”，趋势本身不作为自动回滚依据。
- **SC-007 — 阶段性能**：每个主题单元满足 G-007 的 LCP/CLS 回退线；固定核心页面移动端 LCP 中位数相对 P0 累计改善约 20%是阶段目标，未达成时记录原因和后续方案，不夹带额外修改。
- **SC-008 — 长期体验证据**：每个性能相关单元保留独立 Day 0；28 天 RUM 在目标 cohort 至少 100 个有效 page-load 样本时比较 LCP P75 ≤ 2.5s、CLS ≤ 0.1、INP ≤ 200ms，少于 100 时结论为“样本不足”。Page Load P75 向约 3.5s 改善仅作方向指标，均不作为单次发布硬门。
- **SC-009 — 缓存正确性**：匿名、免费会员和付费会员 A→B→C→A 矩阵没有共享 `HIT/STALE/UPDATING` 或跨身份内容；按原因接受 `DYNAMIC/BYPASS/MISS`；静态资源更新后不长时间返回旧版本。
- **SC-010 — 安全与爬虫**：Verified Bots、robots、Sitemap、RSS、边缘证书和源端证书正常，Cloudflare 能力无损失。
- **SC-011 — 隔离与稳定**：所有发布可归属单一单元；除 F0 外的生产技术单元连续 72 小时满足 G-007，F0 专用矩阵通过，且直接回滚或 rollback-forward 不撤销其他已接受单元。
- **SC-012 — CI/CD 门禁**：PR 创建、更新、重开均运行验证；主题相关 `master` push 只有在同一顺序 job 的最终 ZIP 全部通过且 checksum 锁定后才上传该文件，失败提交及 docs/specs-only 提交上传次数为 0；ZIP 不含开发产物，候选 identity 唯一，上传后 active theme 保持不变，直至 Ghost Dashboard 手动激活。

## Assumptions

- `www.edony.ink -> edony.ghost.io` 当前保持 Proxied，本 Spec 不改变该拓扑。
- 当前快照中首页 HTML 为 `CF-Cache-Status: DYNAMIC`；P0 会重新核验，最终按原因接受安全的 `DYNAMIC/BYPASS/MISS`，不把当前字面状态当作唯一标准。
- 当前 RUM 样本较小，约 3.67s LCP P75 和约 5.0s Page Load 仅为方向信号。
- 当前流程由 `master` push 自动上传版本化候选主题，再由用户在 Ghost Dashboard 手动激活；F0 会重新证明上传结果 `active=false` 且不会覆盖当前 active theme。
- Ghost 继续负责 canonical、Open Graph、X Card、Sitemap、JSON-LD、Schema 与 meta fallback。
- P0 可取得匿名、免费会员、付费会员及不同内容权限的测试账号。
- GA4 当前由 Zaraz 承载，RUM 当前为自动注入；P1 会验证而非假设没有重复。
- 广告流量不足时，7 天数据不用于最终判断，观察期延长至 14/28 天；观察不冻结 G-008 判定为“不影响 Ads”的单元。
- 每个主题单元的 Day 0 是 Ghost Dashboard 实际激活时间；每个平台配置单元的 Day 0 是配置实际生效时间。Ads、SEO、RUM 和 Cloudflare 均按 release unit 分别记录，最终组合窗口不能替代单元窗口。
- Zone 包含其他历史源站，SSL 保持 Full；Full Strict 不在本轮直接启用。
- 每项线上修改仍需单独授权；本 Spec 不是自动执行授权。

## Out of Scope

- 将 `www.edony.ink` 默认迁移为 DNS-only。
- 删除或降级 Portal、Search、Stripe、Analytics、Comments、Giscus、AdSense 或 Cloudflare 能力。
- 评论点击后加载。
- 移除首页轮播、Load more 或 PhotoSwipe。
- 为约 10KB gzip CSS 立即拆分整套 CSS。
- 全面重写图片体系。
- 隐藏 H1、关键词堆砌或把长描述当标题。
- 无真实 LCP 证据时同时添加多个 preload/fetchpriority。
- 将 Zaraz 迁到独立子域或改为 Ghost 直接注入 GA4。
- 将 Prism 从 Injection 迁入主题。
- 未确认许可、子集和打包链路时发布自托管中文字体。
- 未审计其他源站证书前将整个 Zone 切换至 Full Strict。
- 在生产环境执行真实 Stripe 扣款。
- 将当前 11 个混合 WIP 文件直接打包上线。
- 同日发布主题、Injection、redirects 与 Cloudflare 规则。
- 自动激活由 CI 上传的候选主题，或增加第二个人工 GitHub 发布审批门。
