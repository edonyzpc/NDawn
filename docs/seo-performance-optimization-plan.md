# NDawn SEO 与性能优化计划

> 状态：Draft v4，已同步已确认决策与第二轮 Agent Team 审查
> 更新时间：2026-07-11
> 适用范围：`www.edony.ink`、Ghost(Pro) 后台、NDawn 主题、Cloudflare `edony.ink` Zone
> 原则：保留既有产品与 Cloudflare 能力；一次只发布一个可回滚单元；任何线上修改必须有验证、观察窗口和回滚路径。

## 1. 文档目的

本文档把博客的 SEO、性能和 Cloudflare 历史架构问题整理成可审查、可分阶段执行的方案，重点回答：

1. 当前具体存在什么问题。
2. 每项工作解决什么问题、可能获得什么收益。
3. 哪些工作是直接优化，哪些是稳定性保障或历史清理。
4. 如何保证登录、订阅、付费、搜索、统计、评论、广告和 Cloudflare 能力不受损。
5. 每个阶段如何验收、何时停止、如何回滚。

本文档不是线上执行授权。进入每个会修改主题、Ghost 后台或 Cloudflare 配置的发布单元前，仍需单独确认。

## 2. 推荐路线

推荐采用“主题性能优先、Cloudflare 安全代理加固后置”的顺序：

```text
CI/CD 验证与未激活候选上传门
  -> 完整备份与正式基线
  -> Ghost 全局/页面级注入审计
  -> 解耦并分批发布现有 WIP
  -> 真实 LCP 与第三方加载优化
  -> 首页 SEO 语义优化
  -> 统一验收
  -> Cloudflare Proxied 架构加固
  -> Cloudflare 历史安全规则清理
  -> 7/14/28 天长期复查
```

`www.edony.ink` 保持 Proxied，以保留 Cloudflare WAF、Cache、Zaraz、RUM、Crawler Hints、Managed robots 和边缘 Analytics。DNS-only 不再是计划内迁移阶段，只作为出现明确性能、内容刷新或 Ghost 支持问题时的应急评估选项。

### 2.1 本版关键修订

- 将“可选 DNS-only 实验”替换为“Cloudflare Proxied 架构加固”。
- 明确保留 Cloudflare 是正式约束，同时记录双 CDN 的缓存、证书和 Ghost 支持风险。
- 将混合 WIP 拆为 Code Injection、Native JS、Ads、jQuery 版本、jQuery 范围五个顺序发布单元。
- 补齐全局与页面级 Code Injection 备份、会员状态 Smoke、Custom Post 模板和直连证书检查。
- 将技术发布硬门、Ads 非阻断收益观察、RUM 长期目标和 SEO 观察窗分开。
- 将 redirects、字体、Prism、Cloudflare Cache 和安全规则拆为独立发布单元。
- 将 CI/CD 收敛为“`master` 自动验证并上传未激活候选，Ghost Dashboard 手动激活”；不增加 GitHub 人工审批。
- 将 Ads 7/14/28 天定义为非阻断安全观察；只暂停 Ads-affecting 单元，延迟回退采用 rollback-forward。
- 将约 20% LCP、28 天 RUM 与 Search Console 趋势定义为非阻断阶段目标；单元硬门仍保护功能、错误、LCP/CLS、Ads 即时行为、缓存隔离和回滚安全。
- 增加 CI/CD 最终同一 ZIP、唯一候选 identity、packaging 边界、G-007 客观稳定性阈值和每单元独立 Day 0。

## 3. 已确认的产品与架构决策

以下事项已经确认，后续不再重复询问。

| ID | 已确认决策 | 对优化方案的影响 |
| --- | --- | --- |
| D-001 | Portal、登录、订阅、Stripe 付费必须全站保留 | 不通过删除 Ghost Portal/Stripe 换取性能；只治理重复注入和加载时机 |
| D-002 | Ghost 原生 Search 必须保留 | 不恢复旧搜索实现；桌面和移动触发器不视为重复实现 |
| D-003 | Ghost Native Analytics 与 GA4 必须保留 | Ghost Native Analytics、GA4 与 Cloudflare RUM 分开验收，不以删除统计换性能 |
| D-004 | Ghost Comments 与 Giscus 必须保留 | 保持现有非点击加载体验，并按用户状态验证 |
| D-005 | AdSense 是重要收益来源 | 保留两个广告位，且仅位于 `post.hbs` 与三个 `custom-*-feature-image.hbs` 末尾；允许接近视口时加载 |
| D-006 | Clustrmaps 已决定移除 | 保持删除，不恢复 |
| D-007 | 首页轮播、Load more、PhotoSwipe 暂时保留 | UI 架构瘦身后置，不与核心优化混合发布 |
| D-008 | H1 不是核心排名或性能优化 | 只在能自然融入视觉时增加，不使用隐藏或关键词堆砌的 H1 |
| D-009 | `www.edony.ink` 保持 Cloudflare Proxied | 保留 WAF、Cache、Zaraz、RUM、Crawler Hints、Managed robots 和边缘 Analytics |
| D-010 | 接受 Proxied 偏离 Ghost 官方推荐拓扑的历史风险 | 通过不缓存 HTML、明确 Purge、证书监测和回滚手册降低风险 |
| D-011 | robots 策略保持现状 | 允许传统搜索抓取，禁止 AI 训练，保持当前允许的搜索/引用用途 |
| D-012 | 采用保守发布节奏 | F0、Injection、Native JS、Ads、jQuery 版本、jQuery 范围、每个 LCP/Fonts 候选、Prism、SEO 主题语义、SEO 内容、redirects、每个 Cache 候选和每个安全规则分别发布 |
| D-013 | 保留当前低负担发布方式 | `master` 自动顺序验证并上传未激活唯一候选；Ghost Dashboard 手动激活是唯一生产主题门，不增加 GitHub 人工审批 |
| D-014 | Ads 观察期不冻结无关工作 | Day 7/14/28 仅限制 Ads-affecting 候选；无法确认时按影响 Ads 处理，延迟回退使用 rollback-forward |
| D-015 | 长期指标不作为单次发布硬门 | 约 20% LCP、28 天 RUM CWV 和 Search Console 趋势报告“达成/未达成/样本不足”，不阻断已通过技术门的单元 |

### 3.1 术语与状态边界

| 术语 | 精确定义 |
| --- | --- |
| Candidate upload | CI 上传已经验证且 checksum 锁定的最终 ZIP；候选保持未激活，不改变公开站点，也不开始 Day 0 |
| Production activation | 用户在 Ghost Dashboard 手动激活主题；这是主题单元唯一生产门和 Day 0 |
| Configuration apply | Injection、Ghost 内容、redirect 或 Cloudflare 配置实际生效；这是对应配置单元 Day 0 |
| Direct predecessor | 当前故障单元发布前的直接已接受状态，不等于 P0 或“最早 ZIP” |
| Rollback-forward | 后续单元已叠加时，从当前已接受 head 只移除目标单元；主题重新验证/上传/激活，配置重新应用对应变更，并分别记录新的 Day 0 |
| Technical hard gate | 立即/72 小时的功能、错误、LCP/CLS、Ads 即时行为、缓存隔离和回滚安全门 |
| Long-term observation | Ads、RUM、SEO 的 7/14/28 天非阻断趋势；不能替代技术硬门 |

## 4. 当前状态摘要

### 4.1 线上架构

- `@ -> 178.128.137.126` 当前为 DNS only。
- `www -> edony.ghost.io` 当前为 Proxied。
- 实际链路为 Cloudflare -> Ghost/Fastly，属于双 CDN。
- 当前快照中首页 Cloudflare 层为 `CF-Cache-Status: DYNAMIC`，没有发现 Cloudflare 缓存会员或个性化 HTML 的证据；最终验收按原因接受安全的 `DYNAMIC/BYPASS/MISS`，不把当前字面状态当作唯一标准。
- Cloudflare 仍承担 Registrar、权威 DNS、Email Routing、R2、Pages、Tunnel 和其他子域能力。
- Ghost 官方建议所有指向 Ghost(Pro) 的记录使用 DNS only，并提示叠加第三方 CDN 可能影响内容、主题、routes 和 redirects 更新。
- 本计划选择保留 Proxied，因此必须把缓存正确性、证书监测和 Ghost 支持边界列为长期保护项。

### 4.2 Cloudflare 配置快照

- Ghost Static Assets、Ghost Images、Ghost Admin Bypass 等 Cache Rules 已启用。
- Tiered Cache 已启用。
- Web Analytics/RUM 当前为自动注入。
- Zaraz 已启用，并承载 GA4。
- Crawler Hints 已启用。
- Cloudflare Managed robots 当前输出的政策为允许搜索、禁止 AI 训练并允许既有引用用途。
- Workers Routes、Page Rules、Bulk Redirects 当前没有 `www` 的关键业务依赖。
- SSL 模式为 Full；由于同一 Zone 还有其他历史源站，本轮不直接改为 Full Strict。

以上均为当前快照，进入阶段 0 时需要重新核验并记录时间。

### 4.3 主题与本地 WIP

当前工作区已有 11 个未提交主题文件，不能直接视为一个可发布单元。

实际修改范围包括：

- `assets/js/main.js`：子菜单、Burger、主题切换从 jQuery 迁移到原生 DOM API。
- `assets/js/post.js`：阅读进度、响应式表格、TOC、PhotoSwipe 及 Ads 逻辑重写。
- `default.hbs`：jQuery 更新并缩小到首页、分页、Tag、Author 页面。
- `partials/ads.hbs` 与 `assets/css/blog/ads.css`：广告脚本延迟加载、容器预留和布局调整。
- 对应 built JS、CSS 和 Source Map 已发生修改。

上述内容尚未上线，且混合了功能重构、缺陷修复和性能优化。必须从已验收基线重新拆分发布，不能直接上传当前混合 ZIP。

当前主题资源的主要结论：

- CSS 传输体积不是当前首要瓶颈。
- 通用主题 JS 已较小。
- 首页 bundle 主要包含 Owl Carousel 与 Infinite Scroll。
- Post bundle 主要包含 PhotoSwipe。
- 图片已经较广泛使用 WebP、`srcset`、`loading`、`fetchpriority` 和异步解码，不需要优先重写整个图片体系。

### 4.4 当前性能信号

Cloudflare RUM 当前样本较小，只作为方向判断：

- Page load time 约 5.0s。
- LCP P75 约 3.67s。
- INP 整体良好。
- CLS 大部分良好，但存在个别异常样本。
- 某个视频卡片的 spacer 曾成为极慢 LCP，需要定位具体页面。

上述数字在阶段 0 重新测量后才作为正式基线。

## 5. 问题、方案与预期收益

| 问题 | 当前证据 | 方案 | 直接收益 | 收益判断 |
| --- | --- | --- | --- | --- |
| 非首屏资源可能过早进入关键链路 | Ads、Prism、字体、评论和 Ghost 注入共同存在 | 在保留功能的前提下调整加载时机和页面范围 | 降低首屏竞争、JS 执行和 LCP | 高潜力，中等置信度 |
| 当前 WIP 不能安全独立回滚 | Native JS、TOC、Ads、jQuery 版本/范围和 built 产物混合 | 从基线重拆为五个发布单元 | 降低功能回归和定位成本 | 高确定性 |
| jQuery 与 `ghost_foot` 存在时序风险 | deferred jQuery 晚于同步 Footer Injection 执行 | 先清除全局和页面级同步 jQuery 依赖 | 避免线上 Injection 报错 | 高确定性 |
| 移动端 LCP 偏慢 | RUM P75 约 3.67s | 按页面类型确认真实 LCP，再做单点优化 | 直接改善用户可感知加载时间 | 高收益，但必须先定位 |
| 首页主语义不够清晰 | Cover 只有图标与描述；卡片链接和 heading 结构可改善 | 可见 H1 预览、真实标题链接、合理 heading 层级 | 改善可访问性和搜索理解 | 低到中等 SEO 收益 |
| 双 CDN 带来缓存和支持风险 | Cloudflare Proxied + Ghost/Fastly | 保留 Proxied，但不缓存 HTML、建立 Purge 与证书监测 | 保留 Cloudflare 能力并降低刷新、证书和排障风险 | 稳定性收益高，性能收益需实测 |
| Analytics/robots 与 Cloudflare 绑定 | GA4 在 Zaraz，RUM 自动注入，Managed robots 生效 | 保持现状并防止重复注入 | 保留统计、Crawler Hints 与 robots 政策 | 保护性工作 |
| Cloudflare 历史规则存在安全债 | 过宽 Skip、疑似无效 Rate Limit、Transform Rule 范围复杂 | 作为独立安全发布单元处理 | 降低安全和维护风险 | 不直接改善 SEO/性能 |

由于所有核心产品与 Cloudflare 能力都必须保留，本轮不以“删除功能”换性能。主要收益来自关键路径收敛、缓存正确性和可回滚发布。

## 6. 成功指标与保护指标

### 6.1 指标分层

| 指标层级 | 判定标准 | 用途 |
| --- | --- | --- |
| 单次发布技术门 | 固定 Smoke 100%；可复现新增 Console 错误 0；脚本化核心 URL 意外 4xx/5xx 为 0；LCP 中位数回退不超过 `max(10%, 250ms)`；CLS 绝对回退不超过 0.02 | 判断当前发布是否可保留，属于阻断门 |
| 阶段累计目标 | 移动端核心页面 LCP 中位数相对阶段 0 改善约 20% | 非阻断；判断主题性能阶段收益 |
| 长期 RUM 目标 | 28 天 LCP P75 不高于 2.5s、CLS 不高于 0.1、INP 不高于 200ms；至少 100 个有效 page-load 样本才形成数值结论 | 非阻断；判断真实用户体验 |
| 次要方向指标 | Cloudflare RUM Page Load P75 从约 5.0s 向约 3.5s 改善 | 方向参考，不作为单次发布唯一阻断项 |

阶段 0 选定三个核心性能页面，每个设备与网络组合至少运行 5 次并取中位数。其他模板以功能 Smoke 为主，避免测试规模失控。

### 6.2 观察窗口

| 窗口 | Day 0 | 观察内容 |
| --- | --- | --- |
| 发布前后立即 / 72 小时 | 每个主题单元的 Dashboard 实际激活时间；每个 Injection、内容、redirect、Cloudflare 单元的配置实际生效时间 | 功能 Smoke、Console、Network、canonical、robots、Sitemap、RSS 与 G-007 |
| Ads 7/14/28 天 | R2 Dashboard 激活时间 | normalized impressions、fill rate、RPM、CLS；非阻断旁路 |
| SEO 14/28 天 | 每个 R7.x/R8 各自 Day 0 | 固定 Search Console property、URL 集、基线窗口、索引与趋势；非阻断 |
| RUM/Cloudflare 7/14/28 天 | 每个性能/R9.x/R10.x 各自 Day 0，并另记最终组合 Day 0 | RUM、CWV、错误和 Cloudflare 状态；非阻断 |

G-007 默认要求固定 Smoke 100% 通过、可复现新增 Console 错误为 0、核心 URL 脚本化检查中的意外 4xx/5xx 为 0、实验室 CLS 中位数绝对回退不超过 0.02、核心页面 LCP 中位数回退不超过 `max(10%, 250ms)`。生产 5xx 只有在 P0 锁定唯一数据源、时区、Host/Path/Method、最低样本和口径后才可成为硬门：分子为排除静态资源、Bot、监控后的 500–599 请求，分母为同范围全部有效请求；基线为 0 时不计算相对变化，只使用预先批准的绝对百分点阈值。数据源或样本不可靠时仅作观察项。P0 如需调整默认值，必须在 R0 前记录理由并单独批准。

### 6.3 SEO 保护指标

- 首页、Post、Page、Tag、Author 的单一绝对 canonical 正确。
- `robots.txt`、`sitemap.xml` 和 RSS 返回 200 且内容正确。
- 不出现意外的 `noindex` 或 `Disallow: /`。
- Ghost 输出的 Open Graph、X Card、JSON-LD 和 Schema 不重复、不丢失。
- Sitemap 抽样 URL 返回 200，且 canonical 与最终 URL 自洽。
- Search Console 在 14/28 天观察期内不出现异常索引下降。
- Verified Bots 不被 Cloudflare WAF Challenge 或误拦截。

### 6.4 产品、统计和收益保护指标

- Portal 登录、订阅、升级、账户入口正常。
- Stripe 只验证 Checkout 创建与跳转；除非有安全测试环境，不在生产执行真实扣款。
- Ghost 原生 Search 在桌面、移动端及快捷键入口正常。
- Ghost Native Analytics、GA4 与 Cloudflare RUM 数据连续。
- 每次访问只有一个 GA4 `page_view`。
- Ghost Comments 与 Giscus 按用户状态正常。
- 两个 AdSense 广告位只在 Post 末尾出现。
- 广告比较使用 `impressions / Post pageview`、fill rate 和 RPM，而不是只看总收入。
- 暂定同等流量结构下持续下降超过约 10%时调整触发距离或执行 rollback-forward；样本不足则延长到 14/28 天再判断。
- Ads 长期观察不冻结无关工作：每个后续单元执行 G-008；影响 Ads 或无法确认的候选等待收益结论或另立 R2.x，不影响 Ads 的候选在 72 小时技术门后可继续。

## 7. 分阶段实施计划

### 阶段 F0：CI/CD Candidate Upload Gate

**目标**：保持“提交 `master` 后自动处理、Ghost Dashboard 手动激活”的现有操作习惯，同时保证只有已验证的同一 ZIP 能进入 Ghost 候选列表。候选上传不是生产激活。
**预计投入**：0.5 到 1 天。
**线上影响**：F0a 无 Ghost 写入；F0b 只上传一个经批准的未激活安全候选，不切换公开主题。

#### F0a：顺序验证，不上传

1. 保存两个现有 workflow、branch protection、Action 权限和可恢复 predecessor；记录 Ghost 已安装列表中的当前 active theme 名称、版本与状态，确认它保持安装且可重新 Activate。该平台保留项是 F0b 的最小主题恢复点，不要求下载 ZIP。
2. 固定 Node、Yarn、Gulp、GScan 与 lockfile 安装方式，不顺手升级构建栈。
3. 将 PR 和 `master` 验证收敛到一个顺序 job，覆盖 `opened/synchronize/reopened`。
4. 上传步骤保持显式关闭；验证失败、workflow-only、docs-only、specs-only 均不得产生候选。
5. path gate 以“是否改变构建结果或 ZIP 内容”为准，覆盖根目录/partials/members HBS、`assets/**`、`package.json`、`yarn.lock`、`gulpfile.js` 及会进入 ZIP 的根目录静态文件。

#### F0b：修复 packaging 并启用候选上传

1. 最小修改 zipper，显式排除 `docs/**`、`specs/**`、`.github/**`、`gulpfile.js` 等开发产物，并通过 ZIP 内容断言验证。
2. 先验证 TryGhost Action `file` 模式下 Ghost 实际采用的 theme identity；官方参数表明 `file` 存在时忽略 `theme-name`，不得只同时传入两个参数来假设唯一候选成立。
3. 在 staging package 写入版本化 package identity，或采用其他经真实上传证明的唯一机制；不直接改写仓库中的发布版本元数据。
4. 生成最终 ZIP，对该同一文件执行 Node syntax、GScan source/ZIP、内容检查并记录 checksum；当前 `test:zip:ci` 固定检查 `dist/ndawn.zip`，若 staging identity 改变文件名，必须显式把最终上传文件传给 GScan。上传步骤只消费该文件，禁止重打包。
5. PR 旧验证可自动取消；`master` 候选上传组使用 `cancel-in-progress: false` 串行，禁止中断已开始的上传；若跳过旧 SHA，只能在上传前安全退出。
6. 用单独批准的安全输入证明：只上传一次、候选 identity 唯一、`active=false`、当前 active theme 不变；上传启用后再重跑 PR `opened/synchronize/reopened`、故意失败、workflow/docs/specs-only 的 0 上传矩阵。

#### F0 退出条件

- F0a、F0b 均有独立批准、证据和 predecessor 回滚。
- `master` 主题输入自动上传候选，无新增 GitHub 手动审批。
- Ghost Dashboard 手动激活仍是唯一生产主题门；候选上传时间永远不是 Day 0。
- F0 只验证未激活候选，不建立 Day 0/72 小时；F0 以专用正向、负向和回滚矩阵关闭。候选首次真实激活前，P0 必须先快照全部主题自定义设置，激活后逐项比对。
- 机制未同时证明“最终同一 ZIP、唯一候选、active 不变”时，F0 不得标记 Pass，P0 与主题实现不得开始。

### 阶段 0：完整备份与正式基线

**目标**：建立可比较数据与完整回滚包。
**预计投入**：0.5 到 1 天。
**线上修改**：无。

#### 工作内容

- 记录 Ghost 已安装列表中的当前线上主题名称、版本和 Active 状态，保存界面证据并确认可重新 Activate；不得删除该直接 predecessor，不要求下载 ZIP。
- 导出或逐项记录 Ghost Dashboard 当前全部主题自定义设置值，并保存字体、暗色 Logo、Featured、分享、作者、相关文章和 Ads 开关的关键渲染截图。
- 导出 Ghost Content/Settings JSON，保全其中包含的页面级 Injection 数据。
- 备份 Ghost Site Header/Footer Code Injection。
- 列出所有使用页面级 Header/Footer Injection 的 Post/Page，另行保存其非空配置并抽样核对导出结果。
- 备份 `routes.yaml`、`redirects.yaml` 和相关 Ghost 设置。
- 导出 Cloudflare DNS 与关键 Cache、WAF、Transform、Analytics、Zaraz、robots 配置状态。
- 保存当前首页响应头、`robots.txt`、Sitemap 和 RSS。
- 记录 GA4、Ghost Native Analytics、Cloudflare RUM、AdSense 近 7/28 天基线。

固定性能页面：

- 首页。
- 普通文章。
- 当前已知的视频或极慢 LCP 文章。

功能 Smoke 页面：

- 图片较多文章。
- 代码文章。
- Page。
- 分页第 2 页。
- Tag 与 Author 页面。
- 三个 Custom Post 模板。

用户状态：

- 匿名用户。
- 免费会员。
- 付费会员。
- 公开、会员限定和付费内容。

核心性能页面在移动端和桌面端各运行至少 5 次，保存请求瀑布、LCP 元素、主线程执行和 Console 状态。

#### 交付物

- 基线报告。
- 线上配置快照。
- 主题、Ghost Export 和 Code Injection 回滚包。
- 主题全部 `@custom` 当前值、关键渲染与设置恢复清单。
- 固定测试 URL、用户状态与账号清单。
- 每项线上脚本的初始所有者清单。

#### 退出条件

- 所有后续指标都能与同一组 URL 和测试条件比较。
- 能在不依赖当前工作区的情况下恢复线上主题、Injection、routes 和 redirects。
- 所有后续 Smoke 所需的匿名、免费与付费状态可重复验证。

### 阶段 1：Ghost 注入与第三方依赖审计

**目标**：确认每个保留功能的唯一来源、注入层级和加载时机。
**预计投入**：0.5 到 1 天。
**线上修改**：无，只读检查。

#### 审计内容

- GA4 是否只有 Zaraz 一个来源。
- Ghost Native Analytics 的后台开关、本域采集请求和 Admin 数据是否正常。
- Cloudflare RUM 是否只有自动注入一个来源。
- Google Fonts、中文字体及字重来自主题 CSS、全局 Injection 还是页面级 Injection。
- Prism 是否全站注入，以及其 JS、CSS、语言包和 autoloader 的所有者。
- Site Header/Footer 与页面级 Injection 是否存在同步 `$` 或 `jQuery` 调用。
- Portal、Search、Ghost Comments 是否被主题或 Injection 重复实现。
- 桌面、移动 Search 触发器是否都指向 Ghost 原生 Search。
- Giscus 是否只出现在预期 Post/Custom Post 页面。
- AdSense 是否存在主题与后台重复注入。

#### 依赖矩阵

| 资源/功能 | 来源 | 注入层级 | 页面范围 | 是否重复 | 保留方式 | 可优化点 |
| --- | --- | --- | --- | --- | --- | --- |
| Portal/Stripe | 待审计 | 待审计 | 全站 | 待审计 | 保留 | 只调整曝光，不删除 |
| Search | Ghost 原生 | Ghost/主题触发器 | 全站 | 待审计 | 保留 | 验证唯一实现 |
| Ghost Native Analytics | Ghost | Ghost 设置 | 全站 | 不按主题脚本去重 | 保留 | 验证本域请求与数据 |
| GA4 | Zaraz | Cloudflare | 全站 | 待审计 | 保留 | 单一 `page_view` |
| Cloudflare RUM | Cloudflare | 自动注入 | 全站 | 待审计 | 保留 | 禁止手动重复 Snippet |
| Prism | 待审计 | 待审计 | 待审计 | 待审计 | 保留 | 仅代码文章加载 |
| 字体 | 待审计 | 主题/Injection | 全站 | 待审计 | 保留视觉 | 合并来源和字重 |
| Giscus | 主题 | Post partial | Post/Custom Post | 待审计 | 保留 | 保持 async/lazy iframe |
| AdSense | 主题 | Post partial | Post 末尾 | 待审计 | 两个广告位 | 接近视口加载 |

#### 硬门槛

- 任一会在 Post/Page 执行的全局或页面级 Injection 仍以任何时序依赖 jQuery，则禁止发布 jQuery 页面级收敛。
- 未确认 Analytics 唯一来源，则禁止修改 Zaraz、RUM 或 GA4。
- 未确认广告唯一来源，则禁止发布 Ads 懒加载。

### 阶段 2：解耦并分批发布现有 WIP

**目标**：将当前混合 WIP 重构为可独立验证、观察和回滚的发布单元。
**预计投入**：2 到 4 天开发与验证，另加观察窗口。
**Cloudflare DNS 修改**：无。

#### 通用发布规则

- 不直接上传当前混合 WIP 生成的 ZIP。
- 每个发布单元从上一个已验收版本继续，不能夹带下一单元代码。
- 只有修改源 JS/CSS 的主题单元才重建对应 built 与 Source Map；HBS-only 主题单元不得制造无关 built diff。所有主题单元都生成本批最终 ZIP并保存主题 predecessor。
- Injection、Ghost 内容、redirect、Cloudflare 等配置单元不生成 built/Source Map/主题 ZIP，只保存该配置的直接 predecessor、脱敏 diff、时间戳和变更记录。
- 当前单元通过 72 小时技术门后，才能进入下一技术单元。
- R2 Day 28 前每个候选执行 G-008：修改 `post.js`、Ads CSS/partial、四个 Post family 布局、共享 Injection 或广告请求相关 Cache/WAF 时判定为 Ads Impact = Yes；无法确认也按 Yes。
- Ads Impact = No 的单元通过 72 小时技术门后可继续；Yes 的单元等待对应收益结论，或另立 R2.x 并重置 Ads Day 0。

#### R0：Code Injection 兼容性

**修改范围**：Ghost Site/Page Header/Footer Injection。
**主题修改**：无。

计划：

1. 将会在 Post/Page 执行的 `$`/`jQuery` 调用迁移为原生 JS；只有明确限定在保留 jQuery 的首页、分页、Tag、Author 页面时，才允许继续依赖 jQuery。
2. 新 Injection 必须同时兼容当前线上旧主题。
3. 发布后完整观察 72 小时。
4. 验证 Portal、Search、统计、Prism、字体、评论和 Ads 没有回归。

回滚：R0 仍为当前 Injection head 时恢复 R0 直接 predecessor，不默认恢复阶段 0 快照；不需要同时回滚主题。

#### R1：Native JS 行为等价重构与 TOC 修复

**修改范围**：`assets/js/main.js`、`assets/js/post.js` 及对应 built 产物。
**暂时保留**：全站 jQuery 加载。

覆盖功能：

- 子菜单。
- Burger。
- 深浅主题。
- 阅读进度。
- 响应式表格。
- TOC。
- PhotoSwipe。

TOC 修复：

- 使用 `data-target-id` 保存原始 `heading.id`。
- 点击时用原始 ID 调用 `getElementById()`。
- 验证中文、空格、标点、重复标题和无 ID heading。

退出条件：

- 所有原有交互行为等价。
- 中文和特殊字符 TOC 正常。
- Console 无新增错误。
- jQuery 仍存在，因此该单元不涉及 Injection 时序变化。

回滚：R1 仍为当前 head 时恢复直接 predecessor；后续主题单元已叠加时使用 rollback-forward，不修改 Injection。

#### R2：AdSense 接近视口加载

**修改范围**：`assets/js/post.js`、`assets/css/blog/ads.css`、`partials/ads.hbs` 及 built 产物。
**广告位数量与位置**：两个，且仅位于 `post.hbs` 与三个 `custom-*-feature-image.hbs` 模板末尾；不扩展到 Page、首页或归档。

实现要求：

1. 初始触发距离采用约 1.5 到 2 个视口高度，优先保护曝光。
2. Observer 命中后先将容器切换到可布局状态。
3. 至少等待一帧并确认两个 Slot 宽高非零后再初始化。
4. 处理脚本已存在、脚本失败、快速滚动、重复触发和无 `IntersectionObserver` 回退。
5. 手机、平板和桌面使用与真实广告更匹配的 intrinsic size。
6. 明确处理 unfilled Slot 的父容器，避免留下大块空白或引入可见 CLS。
7. 覆盖普通 Post 与三个 Custom Post 模板。

观察：

- 72 小时：功能、Console、广告请求和 CLS。
- 7 天：初步比较 normalized impressions、fill rate、RPM。
- 14/28 天：流量不足时再做最终收益判断。

回滚：R2 仍为当前 head 时恢复其直接 predecessor；后续单元已叠加时，从当前已接受 head 构建只移除 R2 的 rollback-forward。不得恢复陈旧的 R2 前 ZIP而连带撤销后续能力。

#### R3a：jQuery 版本更新

**修改范围**：`default.hbs`。
**页面范围**：暂时保持全站加载。

计划：

- 只将 jQuery 从 3.5.1 更新到 3.7.1，不同时缩小页面范围。
- 验证首页轮播、Load more、Injection、Portal、Search、Post 与 Page。
- 完整观察 72 小时，发生回归时只恢复旧 jQuery 版本。

#### R3b：jQuery 页面范围收敛

**修改范围**：`default.hbs`。
**前置条件**：R0、R1、R2、R3a 已通过；所有会在 Post/Page 执行的 Injection 均不再依赖 jQuery。

计划：

- jQuery 只保留在首页、分页、Tag 和 Author 页面，供现有 `home.min.js` 使用。
- Post 与 Page 不再加载 jQuery。
- 验证 deferred jQuery 与 `home.min.js` 的执行顺序。
- 验证 Post/Page 的 `ghost_head`、`ghost_foot` 和页面级 Injection 完全不依赖 jQuery。

收益：文章和普通页面不再承担不必要的 jQuery 下载与执行，同时不影响首页轮播和 Load more。

#### 自动化与打包检查

每个主题发布单元至少运行：

```bash
node --check assets/js/main.js
node --check assets/js/post.js
node --check assets/js/home.js
npm run test:ci
npm run zip
: "${FINAL_ZIP:?F0 必须导出唯一最终 ZIP 路径}"
test -f "$FINAL_ZIP"
./node_modules/.bin/gscan -z --fatal --verbose "$FINAL_ZIP"
unzip -l "$FINAL_ZIP"
shasum -a 256 "$FINAL_ZIP"
git diff --check
```

`npm run lint` 只在干净工作区运行，并检查其自动修改，避免把无关格式化混入当前发布。

每批使用干净 staging/output，构建前无旧 ZIP，构建后只允许一个本批 `FINAL_ZIP`。GScan、内容检查、checksum 与上传必须消费该同一文件，上传步骤不重新打包；ZIP 不包含 `docs/**`、`specs/**`、`.github/**`、开发源码或敏感快照，候选 identity 与 F0 证据一致。

#### 浏览器 Smoke

- Chrome 与 Safari。
- 手机与桌面。
- 首页、分页第 2 页、Post、Page、Tag、Author、三个 Custom Post。
- 菜单、主题切换、轮播、Load more、PhotoSwipe、TOC、表格和 Prism。
- 匿名、免费会员和付费会员。
- Portal 登录、订阅、账户、升级和 Checkout 跳转。
- Ghost Search 的桌面、移动和快捷键入口。
- Ghost Comments 与 Giscus。
- 关闭广告拦截器后验证两个广告请求、Slot 状态和布局。
- Dashboard 激活前后逐项比对全部当前 `@custom` 值，并验证字体、暗色 Logo、Featured、分享、作者、相关文章与 Ads 开关的关键渲染。
- GA4 Network/DebugView、Ghost Native Analytics 与 Cloudflare RUM。

### 阶段 3：真实 LCP 与第三方加载优化

**目标**：在保留所有功能和 Cloudflare 能力的前提下，减少非首屏资源对 LCP 的竞争。
**预计投入**：1 到 3 天。
**发布方式**：每类资源独立发布。

#### 3.1 按模板确认 LCP

- 首页：区分 Cover 图标、站点描述、第一张 Featured 图片。
- 普通文章：区分标题、Feature image、首段文本。
- 视频文章：定位 spacer 成为极慢 LCP 的具体原因。
- 代码文章：检查 Prism、字体或代码块样式是否延迟正文渲染。

只对已确认的 LCP 元素使用 preload 或 `fetchpriority`，不同时提高多个候选资源优先级。

#### 3.2 字体加载

保持现有品牌视觉，不默认改为系统字体。

计划：

- 同时审计主题 CSS、Site Injection 和 Page Injection 中的字体来源。
- 消除重复 Google Fonts、重复字重和无效字体声明。
- 现有本地中文字体文件体积较大，且当前打包路径不会自动包含，不能直接当作可发布方案。
- 如需自托管，必须确认许可、字符子集、字体目录、构建复制和 ZIP 包含路径。
- 只对真实首屏所需字体做 preload。
- 保留合适的 `font-display` 回退策略。

收益：减少标题与正文等待字体造成的 LCP 和闪烁，不改变品牌视觉。

#### 3.3 Prism 按需加载

保留代码高亮功能，不要求用户点击。

本轮默认继续由 Footer Injection 作为唯一所有者，通过 DOM 检测条件加载。若该方式无法满足需求，迁入主题必须另起独立设计与发布方案，不在 R6 中同时迁移主题和 Injection。

检测范围必须覆盖 Ghost Code Card，而不能只检测带 `language-*` class 的代码块。

退出条件：

- 普通文章不加载 Prism Runtime。
- 代码文章的语言包、autoloader 和样式正常。
- 不出现未高亮闪烁或 Console 错误。

#### 3.4 Analytics

- Zaraz 保持 GA4 唯一来源。
- Cloudflare RUM 保持自动注入，不添加手动 Snippet。
- Ghost Native Analytics 保持启用。
- 三类统计分别验收，不把它们视为可以互相替代的重复实现。

#### 3.5 评论

- Ghost Comments 与 Giscus 都保留。
- 保持当前非点击加载体验。
- 按匿名、免费会员、付费会员和当前 Comments Access 设置验证。
- 确认评论不出现在非预期页面，并保持 Giscus async/lazy iframe 行为。

### 阶段 4：首页 SEO 语义与历史 URL 优化

**目标**：在不重复 Ghost SEO 输出的前提下，改善首页语义、文本链接和可访问性。
**预计投入**：0.5 到 1.5 天。
**发布方式**：主题语义与 redirects 分开。

#### 4.1 主题语义候选

- 将文章卡片标题变成真实文字链接，而不是只依赖 overlay link。
- 重构 overlay 时避免标题链接和 overlay link 形成两个重复 Tab 焦点。
- 检查首页、Tag、Author 页面 heading 层级。
- 为分页补充可读文本或 `aria-label`。

#### 4.2 H1

当前 `partials/cover.hbs` 只有图标和站点描述，没有明确的正文主标题。

H1 的主要收益：

- 为屏幕阅读器和文档结构提供明确的页面主题。
- 帮助搜索引擎理解首页主视觉标题。
- 作为 Google 生成 title link 时可能参考的多个来源之一。

H1 不是排名保证，也不是控制站点名称的主要信号，没有直接性能收益。

计划：

1. 先提供首页视觉预览。
2. 只有在不破坏当前视觉时，使用 `@site.title` 作为可见 H1。
3. 站点描述改为语义段落。
4. 不添加隐藏 H1，不堆关键词，不把长描述当标题。

若视觉效果不合适，放弃 H1，不阻塞其他优化。

#### 4.3 首页短摘要

不默认实施。先提供“最新 5 篇显示 20 到 30 词摘要”的视觉预览，再决定是否上线。

#### 4.4 Ghost SEO 边界

不在主题重复输出 Ghost 已负责的：

- canonical。
- Open Graph 与 X Card。
- Sitemap。
- JSON-LD 与 Schema.org。
- Meta fallback。

#### 4.5 Ghost SEO 内容独立发布

- 依据 Search Console、GA4 与内容重要性形成 G-009 allowlist。
- 每批只包含明确的 Tag description、Post excerpt 或 Feature image alt 字段；保存 URL、原值、拟定值和恢复证据。
- 文字准确、自然，不做关键词堆砌；有意义图片的 alt 以可访问性和内容描述为准。
- 与主题语义、redirects、Injection 和 Cloudflare 分日发布；无充分候选时记录 `No-op`。
- 回滚只恢复该批原字段值；后续内容已叠加时仍按字段级 rollback-forward 处理。

#### 4.6 Redirects 独立发布

- 从 Search Console、GA4、外链或日志确定有价值的历史 404。
- 下载当前 `redirects.yaml`。
- 只添加精确、可解释的 301。
- 验证旧 URL 一跳到最终 canonical，不产生 chain、loop 或误伤现有路由。
- 不与 H1、主题、Injection 或 Cloudflare 规则同日发布。
- 回滚时恢复 R8 直接 predecessor `redirects.yaml`，不默认恢复阶段 0 文件。

### 阶段 5：统一验收与收益判断

**目标**：判断阶段 2 到 4 是否真正改善用户体验，同时没有伤害产品、统计、广告、SEO 或 Cloudflare 能力。

| 维度 | 验收条件 |
| --- | --- |
| 单次发布 | G-007：功能/Console/脚本化 URL 通过，LCP 中位数回退不超过 `max(10%, 250ms)`，CLS 绝对回退不超过 0.02 |
| 阶段性能 | 核心页面移动端 LCP 中位数累计改善约 20%是非阻断目标；未达成只形成后续调查 |
| 长期性能 | 28 天 RUM LCP P75 ≤ 2.5s、CLS ≤ 0.1、INP ≤ 200ms 是非阻断目标；有效 page-load 少于 100 时记录“样本不足” |
| 功能 | Portal、Search、Checkout、评论、图库、TOC、广告全部通过状态矩阵 |
| Analytics | Ghost Native Analytics、GA4、RUM 连续，GA4 无重复 `page_view` |
| 广告 | 两个 Post 末尾广告位正常，normalized impressions、fill rate、RPM 无持续异常 |
| SEO | canonical、robots、Sitemap、Schema、RSS 无回退 |
| 稳定性 | 满足 G-007：固定矩阵 100% 通过、新增可复现 Console 错误和核心 URL 意外 4xx/5xx 均为 0，LCP/CLS 未越线；生产 5xx 仅在 P0 升级后阻断 |

阶段 5 通过后，才对 Cloudflare Cache/WAF 进行主动配置修改。

### 阶段 6：Cloudflare Proxied 架构加固

**定位**：保留 Cloudflare 能力的前提下，降低双 CDN 的缓存、证书、爬虫和排障风险。
**预计投入**：1 到 2 天。
**DNS 修改**：无，`www` 保持 Proxied。
**发布原则**：每次只修改一条规则或一个功能组。

#### 6.1 Cache 正确性（R9.x）

- R2 Day 28 前，每个 Cache 候选先执行 G-008；影响 Ads 或无法确认时等待 R2 结论，或另立 R2.x 后再改规则。
- 不创建 `Cache Everything` 或强制缓存会员/个性化 HTML 的规则。
- Admin、会员认证、Portal/Stripe、Comments、API 等动态路径明确绕过缓存。
- 匿名 A、免费会员 B、付费会员 C 使用独立 profile 执行 A→B→C→A，比较实际可见权限与响应头。
- `DYNAMIC` 可直接接受；`BYPASS` 必须记录 Cookie、Authorization 或上游 `Cache-Control` 原因；`MISS` 只能暂时接受，重复请求及 A→B→C→A 后不得转为共享 `HIT/STALE/UPDATING`，`Age` 不得递增。
- 每次保存 `CF-Cache-Status`、`Age`、`Cache-Control`、`Vary`、`ETag`、Ray ID 和实际可见内容；单个状态码不能独立证明安全。
- `robots.txt`、Sitemap、RSS 和 redirects 结果不设置强制长 Edge TTL。
- 仅对可安全刷新的图片、CSS、JS 使用 Cache Rules；静态规则尊重 Ghost/Fastly 的 `Cache-Control`、ETag 和版本参数。
- Tiered Cache 仅作用于确认安全的静态资源。
- 所有 Cache Rule 新增、修改、禁用、删除和顺序调整都只属于 R9.x；每次一条规则或严格同类组，并提供 `No-op/Accept/Rollback/Iterate/Complete` 出口。

#### 6.2 Purge 与内容刷新流程

主题、routes、redirects 或关键内容更新后：

1. 记录更新时间和测试 URL。
2. 先验证 Ghost/Fastly 返回的新版本。
3. 验证 Cloudflare 是否立即反映更新。
4. 如未更新，只 Purge 精确 URL 或相关资源，避免无必要 Purge Everything。
5. 验证首页、文章、Sitemap、RSS、redirects 和主题资产。

任何一次出现 Cloudflare 持续返回旧版本，都记录规则命中、TTL、响应头和回滚动作。

#### 6.3 Analytics、robots 与 Crawler Hints

- Zaraz 继续承载 GA4，禁止再通过 Ghost Header 注入同一 GA4。
- Web Analytics/RUM 保持自动注入，禁止添加第二个手动 Snippet。
- Managed robots 保持当前搜索允许、AI 训练禁止和既有引用政策。
- Crawler Hints 保持启用，但不把它当作排名保证或 Sitemap 替代品。
- 每次规则修改后验证 `robots.txt`、Sitemap、GA4 单一 `page_view` 和 RUM 请求。

#### 6.4 WAF、搜索爬虫与证书

- Verified Bots 不应被 Managed Challenge 或 Block。
- 搜索爬虫放行不依赖可伪造 User-Agent。
- 收窄历史 Skip 规则时先 Log/观察，再启用阻断。
- 保持 Cloudflare Edge 证书正常。
- 定期绕过 Cloudflare 检查 Ghost/Fastly 端 `www.edony.ink` 的 SNI、证书有效期和完整 HTTPS 页面，防止代理掩盖源端证书问题。
- Ghost 支持排障时准备临时只读证据和可回滚的 Proxy 状态切换手册，但不把切换视为默认操作。

#### 6.5 验收

- 匿名、免费会员和付费会员 A→B→C→A 均无共享 `HIT/STALE/UPDATING` 或跨身份内容；按原因接受安全的 `DYNAMIC/BYPASS/MISS`。
- 静态资源按预期出现 MISS/HIT，更新后能及时刷新。
- Portal、Search、Checkout、Comments、Giscus 和 Ads 正常。
- GA4、Ghost Native Analytics 与 RUM 连续。
- Verified Bots、robots、Sitemap、RSS 和 canonical 正常。
- Theme、routes、redirects 和内容更新不会被 Cloudflare 长时间阻滞。
- Cloudflare WAF、Cache、Analytics 与其他子域能力保持可用。
- 最后一个 R10 单元通过 72 小时门后，重新执行完整浏览器、设备、模板和匿名/免费/付费矩阵，覆盖 Cache、Ads、SEO、Analytics、爬虫与源端证书；最终矩阵 100% 通过才进入长期复查。

#### 6.6 回滚

- 每次规则变更前保存旧表达式、动作、优先级和截图。
- 出现问题时只禁用或恢复当前规则，不同时修改 DNS、主题或 Injection。
- 回滚后重新验证 Cache Status、功能、Analytics 和搜索爬虫。

#### 6.7 DNS-only 应急边界

DNS-only 不在本计划执行范围内。只有出现以下任一条件并取得可重复证据时，才另起方案讨论：

- 有重复测量证明 Cloudflare 明显增加 TTFB/LCP；或
- Cloudflare 持续导致主题、内容、routes、redirects 刷新异常；或
- Ghost 支持或证书问题要求临时移除代理。

届时必须重新评估 WAF、Cache、Zaraz、RUM、Crawler Hints、Managed robots 和边缘 Analytics 的损失，不能沿用旧版 DNS 计划直接操作。

### 阶段 7：Cloudflare 历史安全配置清理

**定位**：独立安全与维护任务。由于 `www` 继续 Proxied，这些规则仍实际影响博客。
**执行时间**：阶段 6 Cache 正确性稳定后。

候选事项：

- R2 Day 28 前，每个 WAF/Rate/Transform 候选先执行 G-008；影响广告请求或无法确认时等待 R2 结论，或另立 R2.x。
- 收窄基于可伪造 User-Agent 的 Gemini Skip。
- 修复疑似把 Hostname 写进 URI Path 的 Rate Limit 条件。
- 核对 Request Header Transform Rule 的 OR 范围。
- 必要时轮换规则中的敏感值；文档不记录该值。
- 审计 `_domainconnect` 的历史用途和代理状态。
- 逐个确认其他 Proxied 源站证书后，才讨论全局 Full -> Full Strict。

若阶段 7 审计发现失效或重复 Cache Rule，当前 R10 立即停止且不得关闭；先把新的 R9.x 与恢复 R10 的任务/依赖写回 SDD并完成 R9 Accept。R10 不得新增、修改、禁用、删除或重排 Cache Rule。

每个规则单独发布：先 Log/模拟并记录第一次配置生效 Day 0、立即检查与 72 小时误报观察；再单独批准目标动作，记录第二次生效 Day 0，并重新执行立即检查与 72 小时门。最后决定 `Accept/Log-only/Rollback/Iterate/Complete`。

## 8. 发布拆分与回滚矩阵

任何两个发布单元不得合并上线。

| 发布单元 | 允许包含 | 不允许混入 | 观察与回滚 |
| --- | --- | --- | --- |
| F0a/F0b | 顺序验证、packaging 边界、未激活候选上传 | 主题功能、Injection、Cloudflare | F0a 无上传；F0b 只上传安全候选；恢复各自直接 predecessor，保持不自动激活 |
| R0 Injection | 全局/页面级 jQuery 依赖迁移 | 主题、Ads、Cloudflare | 72h；恢复 R0 predecessor Injection |
| R1 Native JS | main/post 行为等价重构与 TOC 修复 | Ads、jQuery 范围、SEO | 72h；直接 predecessor 或 rollback-forward |
| R2 Ads | Observer、脚本、Slot、占位 CSS、四个 Post family | SEO、Analytics、Cloudflare | 72h 技术门 + 非阻断 7/14/28 天；直接 predecessor 或 rollback-forward |
| R3a jQuery 版本 | 3.5.1 -> 3.7.1 | 页面范围、Ads、SEO、Cloudflare | 72h；直接 predecessor 或 rollback-forward |
| R3b jQuery 范围 | jQuery 页面范围与执行顺序 | 版本升级、Ads、SEO、Cloudflare | 72h；直接 predecessor 或 rollback-forward |
| R4.x LCP | 单一模板的单一 LCP 候选 | 多资源 preload、Cloudflare | 72h；`No-op/Accept/Rollback/Iterate/Complete-unmet` |
| R5.x Fonts | 单一字体来源或字重策略 | Prism、SEO、Cloudflare | 72h；`No-op/Accept/Rollback/Iterate/Complete-unmet` |
| R6 Prism | 唯一所有者与条件加载 | Fonts、SEO、Cloudflare | 72h；只恢复 R6 predecessor，绝不恢复 P0 Injection |
| R7.x SEO 语义 | H1、标题链接、heading、分页、可选摘要 | JS 架构、redirects、Cloudflare | 72h；直接 predecessor 或 rollback-forward |
| R7.x SEO 内容 | G-009 allowlist 字段 | 主题、redirects、Cloudflare | 恢复该批原字段或字段级 rollback-forward |
| R8 Redirects | 精确 301 与对应验证 | 主题、Injection、Cloudflare | 恢复 R8 predecessor `redirects.yaml` |
| R9.x CF Cache | 单一 Cache Rule 或严格同类组 | 主题、Injection、WAF | 恢复当前规则 predecessor；所有 Cache 操作只在 R9 |
| R10.x CF Security | 单一 WAF/Rate Limit/Transform 修复 | Cache、主题、DNS | 恢复当前规则 predecessor；Cache 发现退回 R9 |

统一回滚规则：本项目不删除 Ghost 已安装主题，直接 theme predecessor 持续保留；故障单元仍是当前 head 时在 Dashboard 直接重新 Activate predecessor，不要求下载旧 ZIP。已有后续已接受单元时，从当前 head 创建只移除目标单元的 rollback-forward，重新构建/验证、上传候选并由 Dashboard 手动激活；Injection、Ghost 内容、redirect、Cloudflare rollback-forward 重新应用对应配置。两类都重新执行立即/72 小时检查并记录各自新的激活或配置生效 Day 0。P0 只用于灾难恢复基线，不是后续单元的默认回滚目标；DNS 切换也不是普通回滚手段。

## 9. 明确后置或不做的事项

- 不为减小约 10KB gzip CSS 而立即拆分整套 CSS。
- 不添加隐藏 H1 或关键词堆砌。
- 不删除 Portal、Search、Ghost Native Analytics、GA4、RUM、Comments、Giscus 或 AdSense。
- 不将评论改为点击后加载。
- 不在同一天发布主题、Injection 和 Cloudflare 规则。
- 不把 `www` 切为 DNS only，除非触发阶段 6.7 并重新审批。
- 不迁移 Zaraz 到独立子域，也不改为直接 GA4，因为 `www` 保持 Proxied。
- 不在未审计其他源站前修改全局 SSL 为 Full Strict。
- 不在没有真实 LCP 证据前增加多个 preload。
- 不立即移除首页轮播、Load more 或 PhotoSwipe。
- 不为了追求分数改变已确认的核心产品体验。

## 10. 后续决策门

既有产品与 Cloudflare 保留决策不再重复确认。后续只保留：

1. **H1 视觉门**：看到首页预览后决定是否增加可见 H1。
2. **摘要视觉门**：看到“最新 5 篇短摘要”预览后决定是否上线。
3. **广告参数门**：阶段 0 基线后锁定触发距离、样本要求和最终收益回滚线。
4. **Cloudflare 规则门**：每条 Cache/WAF/Transform 修改前审查表达式、命中范围和回滚。
5. **安全清理门**：Cache 正确性稳定后，单独确认安全规则修复顺序。
6. **DNS 应急门**：只有阶段 6.7 出现明确证据时，才另起 DNS-only 方案。
7. **稳定性阈值门**：阶段 0 锁定 G-007 数值与低样本处理方式，R0 前确认。

F0 的“最终同一 ZIP、唯一候选 identity、active theme 不变”属于技术验收，不是新增用户操作或第二个人工发布决策；任一证据缺失时只阻断 F0，不要求用户在 GitHub 额外审批每次发布。

## 11. 官方参考资料

- [Ghost: Cloudflare domain setup](https://ghost.org/help/cloudflare-domain-setup/)
- [Ghost: CDN provider support](https://ghost.org/help/cdn-provider-support/)
- [Ghost: SEO](https://ghost.org/help/seo/)
- [Ghost: Modifying robots.txt](https://ghost.org/help/modifying-robots-txt/)
- [Ghost: Native Analytics](https://ghost.org/help/native-analytics/)
- [Ghost: Google Analytics integration](https://ghost.org/integrations/google/)
- [Ghost Admin API: Themes upload and activation](https://docs.ghost.org/admin-api/themes/overview)
- [Ghost: Download and upload a theme](https://ghost.org/tutorials/download-and-upload-a-theme/)
- [Ghost: Custom theme settings](https://docs.ghost.org/themes/custom-settings/)
- [TryGhost: action-deploy-theme](https://github.com/TryGhost/action-deploy-theme)
- [Cloudflare: Proxy status](https://developers.cloudflare.com/dns/proxy-status/)
- [Cloudflare: Cache Rules](https://developers.cloudflare.com/cache/how-to/cache-rules/)
- [Cloudflare: Cache response statuses](https://developers.cloudflare.com/cache/concepts/cache-responses/)
- [Cloudflare: Dynamic content and login cache issues](https://developers.cloudflare.com/cache/troubleshooting/dynamic-content-and-login-issues/)
- [Cloudflare: Crawler Hints](https://developers.cloudflare.com/cache/advanced-configuration/crawler-hints/)
- [Cloudflare: Web Analytics setup](https://developers.cloudflare.com/web-analytics/get-started/)
- [Google Search Central: Influencing title links](https://developers.google.com/search/docs/appearance/title-link)
- [web.dev: Core Web Vitals](https://web.dev/articles/vitals)

## 12. 审查清单

- [ ] 已确认 Portal、Search、统计、评论、Stripe、两个广告位等产品功能完整保留。
- [ ] 已确认 `www.edony.ink` 保持 Cloudflare Proxied。
- [ ] 已理解并接受 Proxied 偏离 Ghost 官方推荐拓扑的缓存、证书与支持风险。
- [ ] 已确认阶段 0 包含 Ghost Export、全局及页面级 Injection 完整备份。
- [ ] 已确认当前 11 个主题 WIP 文件不能作为一个 ZIP 直接上线。
- [x] 已确认 `master` 自动验证并上传未激活候选，Ghost Dashboard 手动激活是唯一生产主题门，不增加 GitHub 人工审批。
- [ ] 已验证 F0 的最终同一 ZIP、checksum、唯一候选 identity、开发产物排除和 active theme 不变。
- [ ] 已快照全部当前主题自定义设置，并确认每次新 identity 激活前后逐项比对与 predecessor 恢复路径。
- [ ] 已确认 R0、R1、R2、R3a、R3b 分开发布和回滚。
- [x] 已确认广告使用 normalized 指标并设置非阻断 7/14/28 天观察窗；只限制 Ads-affecting 单元，延迟回退使用 rollback-forward。
- [x] 已确认约 20% LCP、28 天 RUM 与 Search Console 趋势为非阻断目标，不替代单元技术硬门。
- [ ] 已确认每个 release unit 与最终组合分别记录 Day 0，候选上传时间不作为 Day 0。
- [ ] 已确认 GA4 只由 Zaraz 提供，RUM 只自动注入一次。
- [ ] 已确认会员 HTML、后台、API、Sitemap 和 RSS 不做强制 Edge Cache，并以 A→B→C→A 验证安全的 `DYNAMIC/BYPASS/MISS`。
- [ ] 已确认 H1 与文章摘要仍需视觉预览后决定。
- [ ] 已确认 DNS-only 不属于当前计划，只保留应急决策门。
- [ ] 已确认 Cloudflare Cache 与安全规则逐条修改，不与主题发布混合。
- [ ] 已确认 R10 Log 与目标动作分别经历独立 Day 0、立即检查和 72 小时门。

## 13. SDD 开发计划

本方案的 Spec-Driven Development 产物位于：

- [SDD 产物索引](../specs/001-seo-performance-optimization/README.md)
- [Feature Specification](../specs/001-seo-performance-optimization/spec.md)
- [Implementation Plan](../specs/001-seo-performance-optimization/plan.md)
- [Executable Tasks](../specs/001-seo-performance-optimization/tasks.md)
- [Research Decisions](../specs/001-seo-performance-optimization/research.md)
- [Release Quickstart](../specs/001-seo-performance-optimization/quickstart.md)

SDD Spec 是实现阶段的主事实来源。本优化方案发生范围或决策变化时，必须同步更新 Spec、Plan、Tasks，并在实施前重新完成一致性审查。
