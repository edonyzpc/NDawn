# Implementation Plan: NDawn SEO 与性能优化

**Spec**: [spec.md](spec.md)
**Source Plan**: [SEO 与性能优化计划](../../docs/seo-performance-optimization-plan.md)
**Status**: Draft for approval
**Date**: 2026-07-11

## Summary

在保留 Portal、Stripe、Ghost Search、Ghost Native Analytics、GA4、Cloudflare RUM、Ghost Comments、Giscus、两个 AdSense 广告位及 Cloudflare Proxied 架构的前提下：

1. 先把 CI/CD 收敛为“顺序验证同一 ZIP后上传未激活候选”，保留 Ghost Dashboard 手动激活。
2. 建立可恢复基线和第三方所有者矩阵。
3. 从干净基线重新拆分当前混合 WIP。
4. 按单发布单元完成关键路径、SEO、redirects、Cloudflare Cache 与安全规则治理。
5. 通过立即与 72 小时硬门决定单元保留或回滚；Ads、RUM 与 SEO 的 7/14/28 天作为非阻断观察，并支持 rollback-forward。

实施顺序：

```text
F0 CI/CD Candidate Upload Gate
  -> P0 Baseline & Recovery Pack
  -> P1 Injection / Third-party Audit
  -> R0 -> R1 -> R2 -> R3a -> R3b
  -> R4.x -> R5.x -> R6
  -> R7.x -> R8
  -> P5 Unified Acceptance
  -> R9.x -> R10.x
  -> P8 7/14/28-day Review
```

R0–R10 实际包含 12 类发布单元，因为 R3 拆为 R3a、R3b，且带 `.x` 的单元可按候选继续拆分。F0 是独立基础设施单元；候选上传不是生产激活，不开始 Release Day 0。

## Technical Context

| 项目 | 当前上下文 |
| --- | --- |
| 产品 | `www.edony.ink` Ghost(Pro) 博客，NDawn 自定义主题 |
| 模板 | Ghost Handlebars `.hbs`，Ghost engine `>=5.0.0` |
| 前端 | ES5 风格 JavaScript、原生 DOM API、jQuery、CSS |
| Runtime bundles | lazysizes、Owl Carousel、Infinite Scroll、PhotoSwipe |
| 外部 Runtime | jQuery CDN、Giscus、AdSense；Prism/字体所有者待审计 |
| 构建 | Node + Yarn Classic + Gulp 4 |
| CSS 链 | easy-import -> Autoprefixer -> cssnano |
| JS 链 | lib/source concat -> uglify -> committed built/map |
| 验证 | GScan 4.47；当前无单元测试或 E2E 框架 |
| 打包 | `gulp zip` -> `dist/ndawn.zip`；当前排除 `docs/`、`assets/css/`、`assets/js/`，但未排除 `specs/`，F0 必须修正 |
| 主题交付 | 当前 push `master` 通过 Action 上传版本化候选；用户确认仍需在 Ghost Dashboard 手动激活 |
| 边缘架构 | Cloudflare Proxied -> Ghost/Fastly |
| 性能目标 | 移动核心页 LCP 中位数累计改善约 20%；28 天 RUM LCP P75 ≤ 2.5s |
| 约束 | 单发布单元、功能全保留、Cloudflare Proxied、DNS-only 另案 |
| 未确认项 | Node/Yarn 版本、线上主题 SHA、Injection 全量、第三方 owner、实时 CF 规则、固定 URL/账号 |

`package.json` 没有锁定 Node 版本；`Makefile` 仍以 Node 16 为安装提示。F0 必须先探测并固定当前可复现的 Node、Yarn 与 Gulp 版本，在本功能中不顺手升级构建栈。

## Current-state Findings

### 当前 WIP 不满足发布边界

- `default.hbs` 同时更新 jQuery 版本并缩小页面范围，必须重拆为 R3a/R3b。
- `assets/js/post.js` 的 TOC 仍从 URL hash 解析 ID，尚未满足原始 `data-target-id` 要求。
- 当前 Ads 逻辑仍缺少一帧等待、非零尺寸、脚本失败和 unfilled 父容器处理。
- `assets/css/blog/ads.css` 隐藏 unfilled `ins` 后，父级最小高度仍可能留下空白。
- 11 个主题 WIP 文件只能作为参考 patch，不能直接生成生产 ZIP。

### 当前 CI/CD 是实施阻断项

- `.github/workflows/test.yml` 使用 `pull_request.types: open`；GitHub 正确 activity type 是 `opened`，且 PR 更新需要 `synchronize`。
- 测试和候选上传是两个无依赖 workflow；`master` push 时未验证 ZIP 可能先被上传。
- F0 将其收敛为一个顺序 job：固定工具链 -> 构建版本化 ZIP -> 语法/GScan/ZIP/diff 检查 -> 仅在主题相关 `master` push 中上传该同一 ZIP。
- 上传步骤必须使用唯一候选名并证明 active theme 不变；Ghost Dashboard 手动激活仍是唯一生产门，不增加 GitHub 人工审批。
- 当前 zipper 未排除 `specs/**`；F0 需要一个最小 packaging 修复，保证 docs/specs-only 既不触发上传，也不进入 ZIP。
- 当前 `test:zip:ci` 固定检查 `dist/ndawn.zip`；版本化 staging 若改变文件名，GScan 必须改为明确检查最终上传文件。
- TryGhost Action 在 `file` 模式下忽略 `theme-name`；F0 必须验证 Ghost 实际 theme identity，并锁定“同一已验证 ZIP + 唯一候选”的兼容机制，不能只同时配置两个参数。
- path gate 必须覆盖所有会改变构建结果或 ZIP 内容的输入；自动 concurrency 防止旧候选晚于新候选上传，不增加操作负担。

## Constitution Check

仓库没有正式 `.specify/memory/constitution.md`。本功能暂采用以下门禁；未来初始化 Spec Kit 时必须迁移并重新检查。

| Gate | 要求 | 当前状态 |
| --- | --- | --- |
| C1 功能完整性 | Portal、Search、支付、统计、评论、Ads 全部保留 | ✅ Spec 满足 |
| C2 Cloudflare 边界 | 保持 Proxied；HTML 不强制 Edge Cache | ✅ Spec 满足 |
| C3 单一发布单元 | 主题、Injection、redirects、Cloudflare 分开 | ✅ 设计满足 |
| C4 CI/CD 完整性 | 同一顺序 job 验证同一 ZIP 后才能上传候选；上传不激活 | ⛔ F0 前阻断 |
| C5 可恢复基线 | 主题、Export、Injection、routes、redirects、CF 快照齐全 | ⛔ P0 前阻断 |
| C6 唯一所有者 | Analytics、字体、Prism、Ads 等 owner 明确 | ⛔ P1 前阻断相关单元 |
| C7 源码/产物一致 | source、built、map、ZIP 属于同一单元 | ⛔ 当前混合 WIP 不通过 |
| C8 证据优先 | 未确认真实 LCP 前不得增加候选优先级 | ✅ 设计满足 |
| C9 最小改动 | 不夹带格式化、升级或顺手重构 | ✅ 设计满足 |
| C10 外部配置安全 | 快照不入库敏感值；逐条变更和回滚 | ✅ 设计满足 |
| C11 观察窗口 | 72h 技术硬门；Ads/SEO/RUM 7/14/28 天非阻断观察 | ✅ 设计满足 |
| C12 局部回滚 | 直接 predecessor 或 rollback-forward，不恢复陈旧快照 | ✅ 设计满足 |

### 单元入口门

| 单元 | 必须先满足 |
| --- | --- |
| F0 | SDD 产物通过审查 |
| P0 | F0 已证明失败不上传、成功只上传未激活候选且 active theme 不变；不存在临时旁路 |
| R0 | P0/P1 完成，Injection 清单齐全 |
| R2 | Ads owner 与基线确认 |
| R3b | Post/Page 所有 Injection 完全不依赖 jQuery |
| R4.x | 真实 LCP 元素和 5 次基线已记录 |
| R5.x | 字体 owner、许可、子集和打包路径确认 |
| R6 | Prism Footer Injection owner 确认 |
| R7.x | 对应视觉门已完成 |
| R8 | 每条历史 URL 有证据和最终 canonical |
| R9.x | P5 统一验收通过 |
| R10.x | R9 Cache 正确性稳定 |

## Accepted Complexity

| 已接受复杂度 | 理由 | 控制措施 |
| --- | --- | --- |
| Cloudflare + Ghost/Fastly 双 CDN | 保留 WAF、Zaraz、RUM、Crawler Hints 等 | 个性化 HTML 无共享缓存、精确 Purge、证书监测 |
| Ghost Comments + Giscus | 已确认产品需求 | 匿名/会员显示矩阵 |
| Ghost Analytics + GA4 + RUM | 用途不同 | 唯一 owner、单一 GA4 `page_view` |
| Home 继续使用 jQuery | Owl/Infinite Scroll 暂保留 | R3b 仅让 Post/Page 脱离 |
| source 与 built 同时入库 | Ghost ZIP 不包含开发源码 | 每单元重建、差异和 ZIP 校验 |
| Ghost/CF 状态不在 Git | 平台限制 | 时间戳快照、owner matrix、回滚手册 |

## Architecture

```text
Browser
  |
  v
Cloudflare
  DNS / Proxy / WAF / Cache / Zaraz / RUM / Managed robots
  |
  v
Ghost(Pro) / Fastly
  |
  v
default.hbs
  |- ghost_head: Ghost SEO + Site/Page Header Injection
  |- header / cover / featured
  |- route template
  |    |- index / paged / tag / author
  |    |- post / page
  |    |- custom post/page templates
  |    '- rss
  |- footer / PhotoSwipe shell
  |- main.min.js: all pages
  |- jQuery + home.min.js: home/paged/tag/author after R3b
  |- post.min.js: post/page
  '- ghost_foot: Site/Page Footer Injection
```

构建链：

```text
assets/css/screen.css + imports
  -> PostCSS / Autoprefixer / cssnano
  -> assets/built/screen.css + map

JS libs + assets/js/{main,home,post}.js
  -> concat / uglify
  -> assets/built/*.min.js + map

templates + built + images + package metadata
  -> gulp zip
  -> dist/ndawn.zip
```

CI/CD 目标链：

```text
pull_request opened/synchronize/reopened
  -> fixed toolchain -> build versioned ZIP -> validate

theme-related push master
  -> fixed toolchain -> build versioned ZIP -> validate same ZIP
  -> upload uniquely named inactive candidate
  -> Ghost Dashboard manual activation
  -> Release Day 0

docs-only push master
  -> no theme upload
```

## Project Structure / File Map

| 领域 | 文件 | 发布单元 |
| --- | --- | --- |
| CI/CD 与打包门 | `.github/workflows/test.yml`, `deploy-theme.yml`, `gulpfile.js`, `package.json` | F0 |
| 全局布局、资源范围 | `default.hbs` | R3a、R3b |
| 首页列表 | `index.hbs`, `partials/loop.hbs`, `partials/pagination.hbs` | R7.x |
| Cover/Featured | `partials/cover.hbs`, `partials/featured.hbs` | R4.x、R7.x |
| Post/Page 内容 | `post.hbs`, `page.hbs`, `partials/content.hbs` | R4.x、R7.x |
| Custom Post | `custom-{full,narrow,no}-feature-image.hbs` | R2、Smoke |
| 评论 | `post.hbs`, `partials/comments.hbs` | 审计与保护 |
| Ads | `partials/ads.hbs`, `assets/js/post.js`, `assets/css/blog/ads.css` | R2 |
| 全局交互 | `assets/js/main.js` | R1 |
| Post 交互 | `assets/js/post.js` | R1、R2 |
| 首页插件 | `assets/js/home.js` + bundled libs | R3a/R3b 保护验证 |
| 字体 | `assets/css/general/basics.css`, `assets/css/misc/header-inject.css`, `assets/css/fonts/` | R5.x |
| Generated assets | `assets/built/*` | 每个主题单元 |
| 构建与打包 | `package.json`, `gulpfile.js`, `yarn.lock` | 验证基础设施 |
| Ghost 外部状态 | Injection、routes、redirects、Analytics | R0、R6、R8 |
| Cloudflare 外部状态 | Cache/WAF/Transform/Zaraz/RUM/robots | R9.x、R10.x |

字体风险：`assets/css/fonts/LXGWBright-Medium.woff2` 体积较大、来源/OFL 未绑定且从未进入 ZIP。全量 Export 证明 active/direct predecessor 及所有 `ndawn-*` 历史设置均未选择 LXGW；R5.x 通过 G-010 后可删除该失效选项、死代码与二进制，同时保留 Modern/Elegant。

## Implementation Phases

### F0 — CI/CD Candidate Upload Gate

**目标**：不增加用户操作的前提下，只有通过验证的同一 ZIP 才能上传为未激活候选；生产激活继续由 Ghost Dashboard 手动完成。

1. 记录现有 workflow、branch protection、Action 参数行为、Ghost active theme 与 zipper 实际内容；F0b 前记录已安装 active theme 的名称、版本与状态，确认它保持安装并可重新 Activate，作为平台保留的最小恢复点；不要求下载旧主题 ZIP。
2. 修正 PR 事件，至少覆盖 `opened`、`synchronize`、`reopened`。
3. 只读探测当前可复现 Node、Yarn、Gulp，固定版本与 lockfile 安装方式。
4. 先实施 F0a：合并为一个 validation-only 顺序 job并显式关闭上传；PR 与主题相关 `master` push 运行相同 build/validate，任何前序失败自然阻止后续步骤。
5. F0a 验证通过后单独批准 F0b：最小修改 zipper，排除 `docs/**`、`specs/**`、`.github/**`、`gulpfile.js` 等开发产物；用 ZIP 内容断言锁定边界。
6. 验证 `file` 模式和 Ghost theme identity：在 staging package 中写入版本化 package name，或采用其他经真实上传证明的唯一 identity 机制；不得假设 `file` 与 `theme-name` 同时配置即可生效。
7. 生成最终候选 ZIP 后，依次运行 Node syntax、GScan、ZIP 内容检查并记录 checksum；若文件名不再是 `dist/ndawn.zip`，GScan 命令必须显式指向最终文件。上传步骤只消费该文件，不得重新构建。
8. theme-input path gate 至少覆盖根目录/partials/members HBS、`assets/**`、`package.json`、`yarn.lock`、`gulpfile.js` 和会进入 ZIP 的根目录静态文件；workflow-only 只验证，docs/specs-only 不上传。
9. PR 旧验证可自动取消；`master` 候选上传使用 `cancel-in-progress: false` 串行化。若增加 latest-SHA 跳过，只允许在上传开始前生效；不得取消正在上传的 run。
10. 保留现有 Ghost Dashboard 手动激活；不增加 `workflow_dispatch`、Environment approval 或自动 activate。
11. 在已安装 active theme 的平台恢复点就绪且明确不得删除后，用已批准的安全 F0b 候选证明最终 ZIP checksum 一致、候选 `active=false`、当前 active theme 不变且 identity 唯一；上传启用后再重跑 PR `opened/synchronize/reopened`、故意失败、workflow-only 和 docs/specs-only 的 0 上传矩阵。

F0a 只修改 workflow且不得上传或激活主题；F0b 仅包含经批准的 packaging 边界和候选上传启用。F0b 可以上传未激活安全候选，但用户无需增加任何 GitHub 操作。两步均属于正式 F0，不存在临时旁路。

F0 不激活主题、没有公开流量变化，因此不建立 Release Day 0 或 72 小时观察；它只在正向上传、启用后的全部负向路径、active theme 不变和回滚矩阵均 Pass 后关闭。

### P0 — Baseline & Recovery Pack

只读线上状态：

- Ghost 已安装列表中线上 active theme 的名称、版本、Active 状态、记录时间和重新 Activate 路径；直接 predecessor 保持安装且不得删除，不要求下载旧 ZIP。
- Ghost Dashboard 当前全部主题自定义设置 `@custom` 值及其关键渲染截图。
- Ghost Export、Site/Page Injection、routes、redirects。
- Cloudflare DNS/Cache/WAF/Transform/Zaraz/RUM/robots 快照。
- 固定性能页、功能页、用户账号和权限矩阵。
- 核心页面移动/桌面至少 5 次基线。
- GA4、Ghost Analytics、RUM、AdSense 7/28 天基线。
- 复核 F0 已固定的 Node、Yarn、Gulp 版本。
- 尽力确认线上主题与源码 commit/SHA 的对应关系；无法确认时，将 Ghost 平台保留的已安装 predecessor 仅作为运行态回滚锚点，不把它视为可编辑源码基线；后续开发仍从已确认 SHA 建立干净可重建源码基线。
- 从确认 SHA 建立干净、可重建的源码基线；当前 WIP 只作为参考 patch。
- 锁定性能测量工具/版本、区域、设备、网络、冷/热缓存和账号，并基于重复测量噪声确认 G-007 的 LCP/CLS 单元回退线。
- 生产 5xx、INP、RUM 只有在能记录唯一数据源、分母、排除项和最低样本时才升级为硬门，否则标记为观察项。

退出条件：任意层都有不依赖当前工作区的恢复路径。

### P1 — Injection / Third-party Audit

建立 owner matrix：

- GA4 仅 Zaraz。
- RUM 仅 Cloudflare 自动注入。
- Ghost Native Analytics 独立。
- Prism、字体、Ads、Giscus 的来源和页面范围。
- Ghost Comments 与 Giscus 分别在何种模板、用户状态和 Injection 层出现。
- Site/Page Injection 的 jQuery 依赖。
- Portal、Search、Comments 的唯一实现。

退出条件：R0、R2、R3b、R5、R6 的入口门均有明确 Pass/Fail。

### P2 — Theme WIP Decomposition

| 单元 | 允许范围 | 主要退出条件 | 回滚 |
| --- | --- | --- | --- |
| R0 Injection | Site/Page Injection；无主题改动 | Post/Page 不再依赖 jQuery；旧主题兼容；72h | 当前 Injection head 时恢复直接 predecessor；后续配置已叠加时 rollback-forward |
| R1 Native JS + TOC | `main.js`、`post.js`、built/map；jQuery 仍全站 | 行为等价；原始 heading ID；72h | 当前主题 head 时激活直接 predecessor；后续主题已叠加时 rollback-forward |
| R2 Ads | `post.js`、`ads.css`、`ads.hbs`、四个 Post family 模板、built/map | 非零尺寸、失败/重复/快速滚动/unfilled；72h 技术门 + 非阻断 Day 7/14/28 | 当前主题 head 时直接 predecessor；后续已叠加时 rollback-forward |
| R3a jQuery version | `default.hbs`；仍全站 | 3.5.1 -> 3.7.1；72h | 当前主题 head 时恢复直接 predecessor；后续已叠加时 rollback-forward |
| R3b jQuery scope | `default.hbs` | 仅 home/paged/tag/author；Post/Page 无依赖；72h | 当前主题 head 时恢复直接 predecessor；后续已叠加时 rollback-forward |

### P3 — Critical-path Optimization

| 单元 | 内容 | 回滚 |
| --- | --- | --- |
| R4.x LCP | 一次只处理一个模板的一个真实 LCP 候选 | 当前主题 head 时恢复 predecessor；后续已叠加时 rollback-forward |
| R5.x Fonts | 先去重来源/字重；自托管需许可、子集和打包路径 | 当前 head 时恢复 predecessor；后续已叠加时 rollback-forward |
| R6 Prism | Footer Injection 根据 DOM 按需加载，覆盖 Ghost Code Card | 当前 Injection head 时恢复 R6 predecessor；后续已叠加时配置 rollback-forward；不得恢复 P0 |

R4.x、R5.x、R6、R9.x、R10.x 审计后都必须支持四种显式出口：`无需修改`、`候选接受/阶段完成`、`候选回滚`、`仍有候选且先更新 SDD`。不得为了完成任务强制制造修改。R6 若 Footer Injection owner/能力门失败，记录 no-op 并另立主题迁移 Spec。

### P4 — SEO

| 单元 | 内容 | 回滚 |
| --- | --- | --- |
| R7.x SEO semantics | 标题文字链接、heading、分页；H1/摘要需视觉门 | 当前主题 head 时直接 predecessor；后续已叠加时 rollback-forward |
| R7.x SEO content | 重点 Tag 描述、文章 excerpt、Feature image alt、获批重点文章的正文 Image Card alt；逐字段/逐图独立批准 | 当前字段 head 时恢复该批原值；后续已叠加时字段级 rollback-forward |
| R8 Redirects | 有证据的精确 301，一跳到 canonical | 当前 redirects head 时恢复 R8 predecessor；后续已叠加时配置 rollback-forward |

### P5 — Unified Acceptance

- 比较 P0 与 R0–R8 的性能、功能、Analytics、Ads 与 SEO。
- 核心页面 LCP 中位数累计改善目标约 20%，但“未达成/样本不足”不阻断已通过 G-007 的单元。
- 所有保护功能和用户状态矩阵通过。
- GA4、Ghost Analytics、RUM 连续，无重复 `page_view`。
- canonical、robots、Sitemap、RSS、Schema 正常。
- Ads Day 7 已记录早期趋势；Day 14/28 继续作为非阻断旁路观察。

P5 未通过时禁止进入 Cloudflare 主动修改。

### P6 — R9.x Cloudflare Cache

- R2 Day 28 前，每个 Cache 候选先执行 G-008；Yes/未知时等待 Ads 结论或另立 R2.x。
- 匿名/免费/付费使用独立 profile 执行 A→B→C→A；个性化 HTML 不出现共享 `HIT/STALE/UPDATING`。
- `DYNAMIC` 可直接接受；`BYPASS` 必须记录 Cookie、Authorization 或上游 `Cache-Control` 原因；`MISS` 仅可暂时接受，重复请求及 A→B→C→A 后不得转为共享命中，`Age` 不得递增。
- 每次保存 `CF-Cache-Status`、`Age`、`Cache-Control`、`Vary`、`ETag`、Ray ID 和实际可见权限结果。
- 静态资源尊重 Ghost/Fastly Cache-Control、ETag 和版本参数。
- 禁止 Cache Everything。
- 建立精确 Purge。
- 一次只修改一条规则或严格同类组。
- 所有 Cache Rule 的新增、修改、禁用、删除和顺序调整均在 R9.x 完成；每个候选后执行 `no-op/accept/rollback/iterate/complete` 出口。

### P7 — R10.x Cloudflare Security

- R2 Day 28 前，每个 WAF/Rate/Transform 候选先执行 G-008；Yes/未知时等待 Ads 结论或另立 R2.x。
- User-Agent Skip。
- Rate Limit 条件。
- Transform Rule 范围。
- `_domainconnect` 历史用途。
- Full Strict 仅在全 Zone 源站证书审计后另案。

规则先 Log/模拟并记录第一次配置生效 Day 0、立即检查和 72 小时误报观察；再经第二次批准切换目标动作，记录第二次 Day 0，并重新执行立即检查和 72 小时门。`Log-only` 不进入目标动作。发现 Cache Rule 问题时当前 R10 必须停止，不得关闭；先把新 R9.x 及恢复 R10 的任务/依赖写回 SDD并完成 R9 Accept，不能在 R10 夹带。

R10 最后一个单元通过后，必须重新执行 FR-017 的完整浏览器、设备、模板和匿名/免费/付费用户矩阵，同时覆盖 Cache、Ads、SEO、Analytics、证书与 Verified Bots。这是最终 Cloudflare 状态的统一验收，不以 R9/R10 前的 P5 代替。

### P8 — Long-term Review

- 每个发布单元激活/生效后立即：功能、Console、Network、SEO、Analytics。
- 每个发布单元从自身 Day 0 起 72h：按 G-007 检查功能、错误、LCP/CLS 与统计连续性。
- Ads：以 R2 的 Ghost Dashboard 激活时间为 Day 0，建立独立 Day 7/14/28 到期任务；G-008 判定为“不影响 Ads”的单元可继续，无法确认时按“影响 Ads”处理。
- SEO：每个 R7.x/R8 分别保留 Day 0 和 Day 14/28 Search Console 报告，使用 P0 锁定的 property、URL 集、基线窗口和最低样本。
- RUM/Cloudflare：每个性能单元及 R9.x/R10.x 分别保留窗口，并额外建立最终组合 Day 7/14/28；每个 cohort 至少 100 个有效 page-load 样本才形成数值结论，否则标记“样本不足”。
- 长期结论统一写作“达成 / 未达成 / 样本不足”，不作为单次发布硬门，也不能替代各单元短期证据。

## Test Strategy

### Static and package gates

每个主题单元：

```bash
node --check assets/js/main.js
node --check assets/js/home.js
node --check assets/js/post.js
npm run test:ci
npm run zip
: "${FINAL_ZIP:?F0 必须导出唯一最终 ZIP 路径}"
test -f "$FINAL_ZIP"
./node_modules/.bin/gscan -z --fatal --verbose "$FINAL_ZIP"
unzip -l "$FINAL_ZIP"
shasum -a 256 "$FINAL_ZIP"
git diff --check
```

补充：

- 每批使用干净 staging/output，生成前不得残留旧 ZIP；构建后必须断言只存在一个本批 `FINAL_ZIP`。
- GScan、内容检查、checksum 与上传必须消费完全相同的 `FINAL_ZIP`；不得再使用固定 `dist/ndawn.zip` 检查另一个文件。
- `unzip -l "$FINAL_ZIP"` 检查模板、built、图片与新增字体。
- ZIP 不得包含 `docs/`、开发源码或敏感快照。
- build 后只允许当前单元预期的 built/map 改动。
- `npm run lint` 会自动修复，只在隔离工作区运行并审查 diff。
- 不信任已有 `dist/ndawn.zip`；每批重新生成。

### Browser smoke matrix

- Chrome、Safari；手机、桌面，Ads 增加平板尺寸。
- 首页、分页 2、Tag、Author、Post、Page、三个 Custom Post。
- 匿名、免费会员、付费会员；公开、会员、付费内容。
- 菜单、主题、轮播、Load more、PhotoSwipe、表格、TOC。
- 首页卡片按 Tab 顺序每卡只有一个预期焦点，标题具有可访问名称；分页按钮具有可读标签。
- Portal、Search、Checkout 跳转、Comments、Giscus。
- 两个 Ads Slot、filled/unfilled、失败和快速滚动。
- Dashboard 激活前后逐项比对全部当前 `@custom` 值，并验证字体、暗色 Logo、Featured、分享、作者、相关文章和 Ads 开关的关键渲染。
- GA4 DebugView/Network、Ghost Analytics、RUM。

### Performance and SEO

- P0 固定测量工具/版本、执行区域、设备/浏览器、网络、冷/热缓存、账号和 URL；每份证据记录这些字段。
- 三个核心页面每种既定组合至少 5 次，取中位数并与前一已接受版本比较。
- 单次发布 LCP 中位数回退不得超过 `max(10%, 250ms)`，CLS 中位数绝对回退不得超过 0.02；累计约 20% 仅为非阻断阶段目标。
- LCP 元素必须与优化假设一致。
- canonical、robots、Sitemap、RSS 状态和内容正确。
- Sitemap 抽样 URL 为 200 且 canonical 自洽。
- Cloudflare 单元后使用匿名/免费/付费独立 profile 执行 A→B→C→A，比较 `CF-Cache-Status`、`Age`、Cache-Control、Cookie/Authorization 和实际内容；不得出现共享 `HIT/STALE/UPDATING`。
- 每个 R7.x/R8 保留独立 Search Console 查询属性、固定 URL 集、基线窗口和 Day 0；14/28 天趋势只生成结论和调查任务。

### 72 小时稳定性门

- 固定 Smoke 通过率必须为 100%。
- 固定矩阵中可复现的新增 Console 错误必须为 0。
- 核心 URL 脚本化检查中的意外 4xx/5xx 必须为 0；历史 404 与恶意流量另行分类。
- 实验室 CLS 中位数绝对回退不得超过 0.02。
- 核心页面 LCP 中位数回退不得超过 `max(10%, 250ms)`。
- 生产 5xx 仅在 P0 锁定唯一数据源、时区、Host/Path/Method、最低样本及以下口径后才可成为硬门：分子是排除静态资源、Bot 与监控后的 500–599 请求，分母是同范围全部有效请求。基线为 0 时不计算相对变化，只使用预先批准的绝对百分点阈值；数据源或样本不可靠时仅作观察项。
- INP 与 RUM 只作为长期非阻断目标；不得用实验室替代指标伪装 INP 结论。
- P0 若基于真实数据调整默认阈值，必须记录理由并在 R0 前单独批准。

## Deployment and Rollback

### 发布前

- 当前单元独立 branch/PR/diff。
- 前一主题、Injection、redirects 或规则快照齐全。
- 主题单元激活前已保存当前全部 `@custom` 值、关键渲染和直接 predecessor；不能只依赖默认值。
- ZIP 和配置快照记录 checksum、时间和 release unit。
- 工作区没有下一单元改动。
- F0 已通过，当前候选由固定工具链生成且 ZIP checksum 与验证记录一致。
- G-008 已判定当前单元是否影响 Ads：修改 `post.js`、Ads CSS/partial、四个 Post family 布局、共享 Injection 或广告请求相关 Cache/WAF 为 Yes；无法确认也按 Yes。处于观察期且判定为 Yes 时必须等待对应收益结论或另立 R2.x。

### 发布

- 一次 merge 只含一个发布单元。
- 主题相关 `master` push 只自动上传未激活候选；候选名、SHA、ZIP checksum 与当前 active theme 留档。
- 主题单元只有在用户于 Ghost Dashboard 手动激活后才算生产发布并开始 Day 0。
- 每次主题激活后立即逐项比对 `@custom` 值与关键渲染；不一致时停止 Smoke，立即激活直接 predecessor并恢复设置。
- R0、R6、R7 内容、R8、R9、R10 是平台配置发布，不与候选上传或主题激活混合。
- 激活/生效后立即 Smoke，再开始 72 小时技术门。
- 当前单元未过 72 小时硬门，不激活下一技术单元；Ads/RUM/SEO 长期目标不冻结无关单元。

### 回滚优先级

1. 若故障单元仍是当前 head，激活其直接 predecessor 候选或恢复该配置的直接 predecessor。
2. 若故障单元后已有其他已接受单元，从当前 head 创建只反向移除目标单元的 rollback-forward；重新构建、验证、上传并手动激活。
3. R0 Injection 可恢复 R0 predecessor；R6 只能恢复 R6 predecessor，绝不恢复 P0 Injection。
4. Redirects 恢复 R8 predecessor YAML；Ghost 内容恢复该批原字段值。
5. Cache/WAF/Transform 只恢复当前规则的 predecessor 表达式、动作和优先级。
6. CI/CD 恢复 F0 predecessor workflow 时必须保持候选上传不自动激活。
7. 回滚后重新验证功能、Cache Status、Analytics、Ads、robots 和 Sitemap，并为 rollback-forward 建立新的 Day 0。
8. DNS 切换不是普通回滚手段。

## Risk Register

| 风险 | 影响 | 缓解 |
| --- | --- | --- |
| master 候选上传早于测试 | 未验证 ZIP 进入 Ghost 候选列表 | F0 单一顺序 job，上传消费同一已验证 ZIP |
| path gate 漏掉 ZIP 输入 | 主题变化未触发候选或 docs-only 误上传 | 按构建结果/ZIP 输入列白名单并用路径矩阵验证 |
| docs/specs 进入主题 ZIP | 包体污染、Ghost 校验或发布边界失真 | F0b 修正 zipper 并添加内容断言 |
| `file`/候选 identity 不兼容 | 覆盖 active theme 或无法保留唯一候选 | 真实验证 Ghost identity，锁定 checksum 后再上传 |
| concurrency 在上传中取消 | 候选错序或留下不完整状态 | PR 可取消；master 上传串行且不取消进行中的 run，故障测试核对候选列表 |
| 候选上传被误认为生产 | 错误启动观察或未经确认切换主题 | 只以 Ghost Dashboard 手动激活为 Day 0 |
| 唯一候选 identity 重置主题设置 | 字体、Logo、Featured、分享、作者、相关文章或 Ads 行为改变 | P0 快照全部 `@custom`；每次激活前后逐项比对并立即恢复 predecessor |
| PR trigger 使用 `open` | PR 创建/更新可能无检查 | 改为默认事件或 opened/synchronize/reopened |
| 当前混合 WIP 直接发布 | 无法定位和独立回滚 | 从干净基线逐单元重建 |
| TOC 特殊字符失败 | 中文标题无法跳转 | 原始 ID 存 data 属性 |
| Ads 初始化不完整 | 拒载、空白、CLS、收益下降 | 等待布局和非零尺寸；异常路径验证 |
| Footer Injection 与 defer jQuery | `$` 报错 | R0 先去除 Post/Page 依赖 |
| 字体大且打包排除 | 404、包体/LCP 恶化 | 先去重；自托管另做路径和子集 |
| 双 CDN 返回旧内容/跨身份缓存 | 内容泄漏或更新延迟 | A→B→C→A、无共享命中、精确 Purge |
| Cloudflare 掩盖源证书 | 故障难定位 | 定期直连 SNI/证书检查 |
| Analytics 重复 | 数据失真 | GA4 仅 Zaraz、RUM 仅自动注入 |
| RUM/Ads 样本小 | 错误结论 | 7/14/28 天与 normalized 指标 |
| 延迟发现旧单元回归 | 恢复陈旧 ZIP 撤销后续能力 | 从当前 head rollback-forward |
| GScan 无交互覆盖 | 行为回归漏检 | 固定浏览器/用户状态矩阵 |
| Source/built/map 漂移 | 审查代码与发布代码不同 | 每批重建、差异和 ZIP 检查 |
| 安全规则误报 | 合法用户/爬虫被阻断 | Log 模式、单规则、局部回滚 |

## Artifact Decisions

- `data-model.md`：不需要；无持久化数据模型变化。
- `contracts/`：不需要 API 合同；发布证据格式由 `quickstart.md` 定义。
- `research.md`：记录技术选择、替代方案和未决研究。
- `tasks.md`：实现前唯一任务清单，所有任务追踪到 Spec。
- `quickstart.md`：每批发布的执行与停止手册。
