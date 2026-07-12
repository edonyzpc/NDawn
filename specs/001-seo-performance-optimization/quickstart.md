# Quickstart: NDawn SEO 与性能优化发布

> 本文是执行手册，不是线上授权。每个线上单元仍需单独确认。

这里的单元批准是变更授权记录，不会在 GitHub workflow 中新增人工点击；正常路径仍为 merge `master` 自动上传未激活候选，再由用户在 Ghost Dashboard 手动激活。

## 1. 先决条件

开始 F0 之后的任何主题、Injection、内容、redirect 或 Cloudflare 修改前必须具备：

- SDD Spec、Plan、Tasks 已审查并通过一致性分析。
- F0 已证明验证失败不上传、成功只上传唯一未激活候选且 active theme 不变；不存在临时旁路。
- P0 完整备份、正式基线和脱离当前工作区可用的回滚包。
- P1 owner 矩阵逐项 Pass/Block，相关发布单元硬门均有结论。
- 固定 URL、浏览器、设备、网络和匿名/免费/付费用户矩阵。
- 当前批次的批准记录、允许范围、禁止项和前版 ZIP/配置。
- 主题批次具有激活前全部 `@custom` 值、关键渲染与直接 predecessor 恢复证据。
- G-007 已锁定 72 小时稳定性阈值。
- R2 后且 Day 28 前，当前候选已经完成 G-008 Ads 影响判定。
- 私密账号、Cookie、API Key 和规则敏感值不得写入仓库或证据。

当前 11 个混合 WIP 文件不得直接上传。

说明：上述完整先决条件用于 F0 完成后的业务单元；F0b 自身首次真实上传前至少必须记录 Ghost 已安装列表中的当前 active theme 名称、版本与状态，确认其保持安装且可重新 Activate。该平台保留项是最小恢复点，禁止删除且不要求下载旧 ZIP。

## 2. 唯一发布顺序

```text
F0 -> P0 -> P1
-> R0 -> R1 -> R2 -> R3a -> R3b
-> R4.x -> R5.x -> R6
-> R7.x Theme -> R7.x Content -> R8
-> P5
-> R9.x -> R10.x
-> P8
```

`[P]` 只允许离线或只读任务并行。任何两个线上发布单元不得同时执行。

| 单元 | 唯一允许范围 | 入口门 | 回滚 |
| --- | --- | --- | --- |
| F0 | 顺序验证同一 ZIP并上传未激活候选 | SDD 审查 | 恢复 predecessor workflow，保持不自动激活 |
| R0 | Site/Page Injection jQuery 兼容 | P0/P1 | 恢复 Injection |
| R1 | Native JS、TOC、built/map | R0 72h | 直接 predecessor 或 rollback-forward |
| R2 | Ads JS/CSS/partial、四个 Post family 模板、built/map | R1 72h + Ads owner | 直接 predecessor 或 rollback-forward |
| R3a | jQuery 3.5.1 -> 3.7.1，仍全站 | R2 技术门 | 恢复旧版本 |
| R3b | jQuery 仅 home/paged/tag/author | R0–R3a + 无依赖 | 恢复全站范围 |
| R4.x | 单模板、单 LCP 候选 | R3b 72h | 回退候选/ZIP |
| R5.x | 单一字体来源/字重 | R4.x + owner/许可 | 恢复字体来源 |
| R6 | Footer Injection Prism | R5.x + owner | 只恢复 R6 predecessor Injection |
| R7.x | 标题链接、heading、分页、已批准 H1 | R6 + 视觉门 | 直接 predecessor 或 rollback-forward |
| R7.x Content | G-009 allowlist 中 Tag/excerpt/alt | 主题语义稳定 | 恢复该批原字段值 |
| R8 | 精确 `redirects.yaml` | R7.x，且不同发布日 | 恢复旧 YAML |
| R9.x | 一条 Cache Rule/同类组 | P5 Pass | 当前 head 恢复 predecessor；后续叠加则配置 rollback-forward |
| R10.x | 一条 WAF/Rate/Transform | R9 稳定 | 当前 head 恢复 predecessor；后续叠加则配置 rollback-forward |

## 3. 每批发布记录

每批开始前复制并填写：

```text
Batch:
Spec / FR / SC:
前一已接受版本:
本批唯一目标:
允许文件或配置:
明确禁止项:
Commit SHA:
构建环境:
Candidate theme name / ZIP checksum:
Theme custom settings snapshot / post-activation comparison:
Ghost Dashboard 激活人及时间:
Observation Day 0 / 到期日（以激活/生效时间为准）:
G-007 阈值版本:
G-008 Ads 影响结论:
发布前快照:
Rollback package:
批准人及时间:
发布开始时间:
立即验证结果:
72 小时结论:
7/14/28 天结论（如适用）:
Accept / Rollback:
```

缺少任一必要字段时不得发布。

### 发布状态机

F0 使用专用状态机：`F0a Approved -> Validation-only Pass -> F0b Approved -> Positive/Negative Upload Matrix Pass -> Exit`。F0 不激活主题，因此没有 Day 0 或 72 小时观察。

主题单元必须按以下状态顺序留证，禁止合并勾选：

```text
Scoped -> Prechecked -> Approved -> Candidate uploaded
-> Dashboard activated -> Immediate Pass -> 72h Pass -> Exit
```

普通平台配置单元使用 `Approved -> Applied -> Immediate Pass -> 72h Pass -> Exit`。R10 必须使用两段状态机：`Log approved -> Log applied/Day 0 -> Immediate -> 72h -> Target action approved -> Target applied/Day 0 -> Immediate -> 72h -> Exit`；`Log-only` 时不进入目标动作。

Exit 按对应 Tasks 阶段定义：通用为 `No-op/Accept/Rollback/Iterate`，R4/R5 可用 `Complete-unmet`，R6 可用 `Separate-Spec`，R9 可用 `Complete`，R10 可用 `Log-only/Complete`。选择 Iterate 或 rollback-forward 时，必须先把新的任务 ID、依赖与观察窗口写回 SDD。

## 4. CI/CD 候选上传门禁

F0 完成后：

- PR 创建、更新、重开均用固定工具链构建并验证，但不上传 Ghost 候选。
- F0b 启用上传后必须重新证明 PR 三种事件、故意失败、workflow/docs/specs-only 的候选上传次数均为 0；F0a 上传关闭时的结果不能替代。
- F0a 先以 validation-only workflow 合并，上传显式关闭；F0b 再单独批准最小 packaging 修复和候选上传启用，两者都不增加日常人工步骤。
- 主题相关 `master` push 在同一顺序 job 中生成最终 ZIP，对该文件完成 GScan、内容检查与 checksum，再以文件模式上传未激活候选；上传步骤不得重新打包。
- theme-input path gate 覆盖所有会改变构建结果或 ZIP 内容的文件；workflow-only 只验证，docs/specs-only 不上传，且 `docs/**`、`specs/**`、`.github/**`、`gulpfile.js` 等开发产物不得进入 ZIP。
- 候选 identity 必须经真实 `file` 上传验证为唯一；不得假设同时传 `theme-name` 可以覆盖文件模式。上传前后记录 active theme，并证明其未变化。
- PR 旧验证可自动取消；`master` 上传组必须串行且 `cancel-in-progress: false`，不得中断已开始的上传，也不增加人工操作。
- 候选上传不是生产发布，不开始 Day 0。
- 用户在 Ghost Dashboard 检查并手动激活后，记录候选名、SHA、checksum 和时间；该时间才是 Day 0。
- 不增加 `workflow_dispatch` 或 GitHub Environment 人工审批。

## 5. 主题批次检查

在隔离且无夹带的批次中运行：

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

`npm run lint` 会自动修复，只在隔离工作区运行，并审查其 diff。

检查：

- 每批使用干净 staging/output，构建前无旧 ZIP；构建后只存在一个本批 `FINAL_ZIP`。
- ZIP、built 和 Source Map 均来自当前批次。
- GScan、内容检查、checksum 与 CI 上传全部消费同一个 `FINAL_ZIP`，不得验证固定旧路径或在上传步骤重新构建。
- theme identity 机制已在 F0 真实验证，最终 ZIP 内 identity 与候选记录一致。
- `git diff` 只含当前单元允许范围。
- `unzip -l "$FINAL_ZIP"` 中模板、built、图片和新增字体符合预期。
- ZIP 不包含 `docs/`、`specs/`、开发源码或敏感快照。
- 不使用当前工作区已有的混合 `dist/ndawn.zip`。

## 6. 立即 Smoke

每次发布后立即检查：

### 浏览器、页面和状态

- Chrome、Safari；手机、桌面，Ads 增加平板。
- 首页、分页、Post、Page、Tag、Author、三个 Custom Post。
- 匿名、免费会员、付费会员。
- 公开、会员限定、付费内容。

### 产品功能

- 菜单、Burger、主题切换。
- 轮播、Load more。
- PhotoSwipe、TOC、响应式表格、Prism。
- Portal 登录、订阅、账户、升级。
- Checkout 创建和跳转，不执行生产真实扣款。
- Ghost Search 桌面、移动和快捷键入口。
- Ghost Comments、Giscus。
- 两个 AdSense Slot 只位于 `post.hbs` 和三个 Custom Post 模板末尾。
- 首页卡片每卡只有一个预期 Tab 焦点且标题有可访问名称；分页控件有可读标签。
- 主题激活前后全部当前 `@custom` 值一致；字体、暗色 Logo、Featured、分享、作者、相关文章和 Ads 开关的关键渲染一致。

### Analytics 与 SEO

- Ghost Native Analytics、GA4、Cloudflare RUM 连续。
- 每次访问只有一个 GA4 `page_view`。
- canonical、robots、Sitemap、RSS、OG/X Card、JSON-LD 正常。
- Console、Network、4xx/5xx 无新增异常。

基础公开端点可抽查：

```bash
curl -fsSIL "$HOME_URL"
curl -fsS "$BASE_URL/robots.txt"
curl -fsS "$BASE_URL/sitemap.xml"
curl -fsS "$BASE_URL/rss/"
```

会员态 Cache 验证必须使用匿名 A、免费会员 B、付费会员 C 的独立 profile 执行 A→B→C→A，不保存或提交 Cookie；同时比较 `CF-Cache-Status`、`Age`、Cache-Control 和实际可见内容。

最后一个 R10 单元通过 72 小时门后，必须再次完整执行本节矩阵，并额外验证匿名/免费/付费 HTML 的 Cache Status、Ads、SEO、Analytics、Verified Bots 和源端证书；最终矩阵 100% 通过才可进入 P8。

## 7. 性能测量

- 固定测量工具/版本、执行区域、浏览器/设备、网络、冷/热缓存、账号和 URL。
- 每种条件至少运行 5 次，取中位数。
- 保存真实 LCP 元素、瀑布、主线程和响应头。
- 与前一已接受版本比较；LCP 中位数回退不得超过 `max(10%, 250ms)`，CLS 中位数绝对回退不得超过 0.02。
- 累计 LCP 约 20% 与 28 天 RUM 属于非阻断目标，报告为“达成 / 未达成 / 样本不足”。
- R4.x 只允许一个模板中的一个候选。
- 无证据时不得同时 preload 图片、字体和第三方脚本。

## 8. 观察与停止条件

| 窗口 | Day 0 | 必查内容 |
| --- | --- | --- |
| 立即/72h | 每个主题单元的 Dashboard 激活时间；每个 Injection、内容、redirect、Cloudflare 单元的配置生效时间 | 功能、Console、Network、SEO、统计、G-007 |
| Ads 7/14/28d | R2 Dashboard 激活时间 | normalized impressions、fill rate、RPM、CLS；非阻断 |
| SEO 14/28d | 每个 R7.x/R8 各自 Day 0 | 固定 Search Console 属性/URL 集、索引与趋势；非阻断 |
| RUM/CF 7/14/28d | 每个性能/R9.x/R10.x 各自 Day 0，另有最终组合 Day 0 | RUM、CWV、错误、Cloudflare 状态；非阻断 |

候选上传时间永远不是 Day 0。每个 release unit 的窗口独立保留，最终组合窗口另行记录，不能覆盖单元窗口。RUM cohort 至少 100 个有效 page-load 样本才形成数值结论，否则记录“样本不足”；Search Console 使用 P0 锁定的固定 property、URL 集、基线窗口和最低样本。

G-007 默认 Pass/Fail：

- 固定 Smoke 通过率 100%。
- 固定矩阵中可复现新增 Console 错误为 0。
- 核心 URL 脚本化检查中的意外 4xx/5xx 为 0。
- 核心页面 LCP 中位数回退不超过 `max(10%, 250ms)`。
- 实验室 CLS 中位数绝对回退不超过 0.02。
- 生产 5xx 只有在 P0 已锁定数据源、查询口径、排除项、零基线算法和最低样本时才是硬门；否则记录为观察项。
- 生产 5xx 口径固定为：排除静态资源、Bot、监控后的 500–599 请求 / 同 Host、Path、Method 范围的全部有效请求；基线为 0 时不算相对变化，只使用预先批准的绝对百分点阈值。
- INP、RUM、累计 LCP 与 Search Console 趋势不属于 72 小时硬门。
- P0 调整默认值时必须在 R0 前记录理由并单独批准。

出现以下任一情况，立即停止下一批并只回滚当前单元：

- Portal、Search、Checkout、Comments、Ads 等保护功能失败。
- 重复 GA4 `page_view` 或任一统计链路中断。
- canonical、robots、Sitemap、RSS 或结构化数据异常。
- 出现任何可复现新增 Console 错误、核心 URL 意外 4xx/5xx，或超过 G-007 的 LCP/CLS 回退线。
- A→B→C→A 中会员或个性化 HTML 出现共享 `HIT/STALE/UPDATING`、`Age` 递增或跨身份内容。
- Verified Bots 被 Challenge/Block。
- Ads 同等流量结构下持续下降超过 G-003 回滚线时，暂停 Ads-affecting 单元并创建 rollback-forward；不冻结无关单元。
- CI 验证失败但仍上传候选，或候选上传后 active theme 发生变化：禁止激活并停止 F0；这不是生产主题已发布。

累计 LCP/RUM/Search Console 长期目标未达成不会自动触发回滚，只形成调查或后续独立方案。回滚后重新执行立即 Smoke，不通过修改第二层配置“补救”当前批次。

## 9. Cloudflare 红线

- `www.edony.ink` 始终保持 Proxied。
- 不创建 Cache Everything。
- HTML、Admin、Auth、Portal、Stripe、Comments、API 不得强制缓存。
- 个性化 HTML 允许有依据的 `DYNAMIC/BYPASS/MISS`，禁止共享 `HIT/STALE/UPDATING`；单次 `MISS` 不足以通过，必须重复 A→B→C→A。
- `DYNAMIC` 可直接接受；`BYPASS` 必须记录 Cookie、Authorization 或上游 `Cache-Control` 原因；`MISS` 后的重复请求和 A→B→C→A 不得变为共享命中，`Age` 不得递增。
- 每次保存 `CF-Cache-Status`、`Age`、`Cache-Control`、`Vary`、`ETag`、Ray ID 和实际可见权限结果。
- 所有 Cache Rule 新增、修改、禁用、删除、重排仅属于 R9；R10 只处理 WAF、Rate Limit、Transform 与安全只读审计。
- R10 发现 Cache 问题时立即停止，不得关闭当前阶段；先更新 SDD、完成新的 R9.x Accept，再按新增依赖恢复 R10。
- robots、Sitemap、RSS、redirects 不得设置强制长 Edge TTL。
- 内容不一致时只精确 Purge，不执行无必要的 Purge Everything。
- 保持 SSL Full；Full Strict 仅在另行完成全 Zone 源站证书审计后讨论。
- DNS-only、Proxy 切换和全局 SSL 修改必须另立方案与审批。

## 10. 回滚顺序

1. 故障单元仍是当前 head：在 Ghost Dashboard 重新 Activate 已安装并保留的直接 predecessor；配置恢复其直接 predecessor。旧主题 ZIP 无需下载。
2. 后续单元已经叠加：从当前已接受 head 创建只移除目标单元的 rollback-forward。主题单元重新构建/验证、上传并手动激活；Injection、Ghost 内容、redirect、Cloudflare 单元重新应用对应配置。
3. R0 可恢复 R0 predecessor Injection；R6 只能恢复 R6 predecessor，禁止恢复 P0 Injection。
4. Redirects 恢复 R8 predecessor；Ghost 内容恢复该批原字段值；后续字段修改已叠加时执行字段级 rollback-forward。
5. Cache/WAF/Transform 只恢复当前规则的 predecessor 表达式、动作和优先级。
6. CI/CD 恢复 predecessor workflow 时仍必须保证上传不自动激活。
7. rollback-forward 主题重新激活或配置重新生效后，重新验证功能、Cache Status、Analytics、Ads、robots 与 Sitemap，并分别记录新的激活 Day 0 或配置生效 Day 0。
8. DNS 切换不是普通回滚手段。

## 11. Proxied 应急手册

Cloudflare 异常时按以下顺序处理并留证：

1. 记录受影响 URL、用户状态、时间、Ray ID、响应头和当前规则版本；不保存 Cookie 或密钥。
2. 比较 Cloudflare 响应与 Ghost/Fastly 源端的 SNI、证书和完整 HTTPS 页面，区分边缘、缓存和源端问题。
3. 内容陈旧时先验证上游版本，再精确 Purge 受影响 URL/资源；不得先执行 Purge Everything。
4. Cache/WAF/Transform 回归时，只禁用或恢复当前发布单元的 predecessor，随后重跑产品、SEO、Analytics、Ads 与 Cache 矩阵。
5. 记录 Ghost 支持反馈、证书证据和重复性；只有满足 G-006 时才提出独立 DNS-only SDD。
6. 任何 DNS、Proxy 或全局 SSL 改动都需要新的方案、影响分析、批准和专用回滚，不属于本手册的普通处置。
