# Tasks: NDawn SEO 与性能优化

**Spec**: [spec.md](spec.md)
**Plan**: [plan.md](plan.md)
**Quickstart**: [quickstart.md](quickstart.md)

## Format and Execution Rules

任务格式：`[ID] [P?] [US?] 描述；依赖；追踪；验证/回滚`。

- `[P]` 只表示依赖满足后可与同阶段其他不重叠、只读或不同文件任务并行。
- `[US1]`–`[US6]` 对应 Spec 用户故事；`Priority P1/P2/P3` 与 `Phase P0/P1/P5/P8` 含义不同。
- 主题单元必须依次经过：`Scoped -> Prechecked -> Approved -> Candidate uploaded -> Dashboard activated -> Immediate Pass -> 72h Pass -> Exit`。
- 候选上传不是生产发布；主题 Day 0 只取 Ghost Dashboard 手动激活时间。平台配置 Day 0 取实际生效时间。
- 每个线上修改仍需单独批准；任务勾选不等于授权。任何两个发布单元不得并行激活或生效。
- 任务中的“批准”是发布单元开始前的变更授权记录，不是在 GitHub workflow 中新增人工审批；日常流程仍是 merge `master` 自动上传候选、Dashboard 手动激活。
- 每个主题单元在 Dashboard 激活前后必须快照并逐项比对全部 `@custom` 值和关键渲染；不一致时立即恢复直接 predecessor 与设置。F0 候选不激活，因此以专用正负测试矩阵关闭，不建立 Day 0/72h。
- 本项目不删除 Ghost 已安装主题；直接主题 predecessor 必须持续保留，直接回滚在 Dashboard 重新 Activate，不要求下载旧主题 ZIP。
- R2 Day 28 前，每个候选必须执行 G-008；Ads-affecting 候选等待或另立 R2.x，不影响 Ads 的候选可继续。
- G-008 无法确认时按 Ads-affecting 处理；不得以任务名推断“不影响 Ads”。
- `.x` 阶段 Exit 必须记录 `No-op / Accept / Rollback / Iterate / Complete-unmet`。Iterate 或 rollback-forward 必须先把新的任务 ID、依赖、Day 0 和回滚写回 SDD。
- 直接 predecessor 仍是当前 head 时可直接恢复；后续单元已叠加时必须 rollback-forward，禁止恢复陈旧 ZIP 或错误的 P0 快照。
- 当前 11 个混合 WIP 文件不得直接发布。

## Phase F0 — CI/CD Candidate Upload Gate

**Goal**：固定工具链，在一个顺序 job 内验证同一版本化 ZIP 后上传未激活候选；Ghost Dashboard 手动激活保持不变。
**Independent Test**：PR、失败提交和 docs-only 提交均不上传候选；安全主题提交只上传一次，active theme 不变。

- [x] T001 [P] 记录现有 Node/Yarn/Gulp/GScan、两个 workflow、branch protection、secrets、Action `file/theme-name` 行为、zipper 输入/排除和最近成功构建；依赖：无；追踪：FR-004、NFR-013、SC-012；验证：快照不含 secret。
- [x] T002 [P] 记录当前 Ghost active theme、候选命名和手动激活流程；已确认已安装 predecessor `ndawn-2026-07-05-13-03`（v2.2.0）保持 Active、不得删除且可在 Dashboard 重新 Activate，作为 F0b 首次真实上传前的平台恢复点；不要求下载旧主题 ZIP；依赖：无；追踪：FR-004、SC-002、SC-012。
- [x] T003 锁定 Node/Yarn 版本、frozen lockfile、唯一 build/check 命令链，并枚举所有会改变构建结果或 ZIP 的 theme input；GScan 必须显式检查最终上传文件而非固定旧路径；依赖：T001；追踪：NFR-011、NFR-013。
- [x] T004 在干净副本验证 install、Node syntax、GScan source、最终 ZIP、GScan ZIP 和内容断言；记录当前 `specs/**` 进入 ZIP 的失败证据；依赖：T003；追踪：NFR-011、SC-012。
- [x] T005 验证 Action `file` 模式与 Ghost theme identity，确定版本化 package identity、最终 ZIP checksum、完整 path gate；PR 可取消旧验证，master 上传必须 `cancel-in-progress: false` 串行；依赖：T002、T004；追踪：FR-004、NFR-013、SC-012。
- [x] T006 设计 F0a validation-only 与 F0b packaging/upload 两步，保存各自 predecessor workflow/zipper 和回滚 patch；依赖：T005；追踪：FR-003、NFR-008。
- [x] T007 取得 F0a 单独批准；2026-07-12 用户确认个人项目不建 PR，允许按单元直接 commit；依赖：T006；追踪：FR-003。
- [x] T008 实现并直接提交 F0a 顺序验证 workflow，上传保持显式关闭；首次 Linux mode-only Fail 后由 `3df5946` 修复，run `29179810177` PASS；依赖：T007；追踪：FR-004、NFR-013；回滚：恢复 T006 workflow predecessor。
- [x] T009 验证 F0a `master` 直接提交运行且不上传；个人项目按 D-020 不创建 PR，因此 PR `opened/synchronize/reopened` 实跑为 N/A，事件配置保留；F0b 后负向矩阵转入 T011；依赖：T008；追踪：FR-004、SC-012。
- [x] T010 取得 F0b 最小 packaging 修复和候选上传启用的批准；2026-07-12 用户同意直接 commit、无 PR；依赖：T009；追踪：FR-003。
- [x] T011 实现并直接提交 F0b：`dbc1e7b` / run `29179894534` 完成同一 ZIP 验证、唯一 identity 与一次未激活上传；docs/specs-only run `29180067547`、workflow-only run `29180120331` 均跳过 Upload；本地 corrupt/stale ZIP 与真实 F0a failure 覆盖失败路径；依赖：T010；追踪：FR-004、NFR-011、NFR-013、SC-012。
- [x] T012 核对最终 ZIP 不含 docs/specs/开发产物、候选 `ndawn-dbc1e7b189ee` 显示 `Activate`、active theme 仍为 `ndawn-2026-07-05-13-03`，记录 F0 `Accept` 并关闭；F0 未激活主题，豁免 Day 0/72h；依赖：T011；追踪：SC-012；回滚：恢复 F0b workflow predecessor，不激活或删除任何主题。

> 后续事件：用户在 F0 关闭后手动激活 `ndawn-dbc1e7b189ee`。2026-07-12 12:56 SGT 确认 Active、全部 `@custom` 保真且关键预览正常；该候选仅含 packaging/identity 变化，不代表 SEO/性能功能发布。自动化 public smoke 因执行环境联网限制转入 P0 补验。

## Phase P0 — Baseline & Recovery Pack

**Goal**：建立不依赖当前混合工作区的基线、测量协议和恢复材料。

- [x] T013 [P] 固定首页、普通/慢/图片/代码文章、Page、分页、Tag、Author、Custom Narrow 公开 URL；Full/No-image 无公开样本，按 D-019 使用同一专用未发布 Draft 依次 Preview，不虚构 URL；依赖：T012；追踪：FR-001、SC-001。
- [x] T014 [P] 固定 Chrome/Safari、手机/桌面/平板、网络、冷/热缓存、区域、匿名/免费/付费账号和内容权限矩阵；无真实账号时 Ghost Preview 只覆盖模板并登记外部缺口；依赖：T012；追踪：FR-001、NFR-001、NFR-003、SC-001。
- [x] T015 [P] 记录 active `ndawn-dbc1e7b189ee`（v2.2.0、commit `dbc1e7b`、ZIP SHA-256 `bbed2724…c8a8`）、首次确认时间、Dashboard Activate 路径、全部 `@custom` 与关键预览；原 `ndawn-2026-07-05-13-03` 保持安装且不得删除，旧 ZIP 下载与 checksum 为 N/A；依赖：T012；追踪：FR-001、SC-002、SC-003。
- [x] T016 [P] 导出 Ghost Content/Settings、Site/Page Injection、全部非空 Page/Post Injection、`routes.yaml`、`redirects.yaml`；原始材料保存于 gitignored `.private`，仓库只记录脱敏摘要与 checksum；依赖：T012；追踪：FR-001、NFR-009、SC-002。
- [x] T017 [P] 保存 Cloudflare DNS、Cache、WAF、Rate Limit、Transform、Zaraz、RUM、robots、Crawler Hints、SSL 和规则顺序脱敏快照；激活后新静态版本键 `v=363f476934` 连续 HIT，未执行 Purge 或配置写入；依赖：T012；追踪：FR-001、NFR-007、NFR-009、SC-002。
- [x] T018 [P] 保存平台可用窗口及样本量：GA4/AdSense 7/28 天、Ghost 30 天、Cloudflare RUM 24 小时；RUM 样本不足且范围污染按已批准口径记录 `Insufficient`，不伪造统一窗口；依赖：T013、T014；追踪：FR-001、SC-004、SC-005、SC-008。
- [x] T019 [P] 保存 canonical、robots、Sitemap、RSS、OG/X、JSON-LD、代表性 alt 和响应头基线；`/page/2/` 当前仅输出 canonical，代表图片文章正文 5 张图 alt 为空并登记为内容缺口；依赖：T013；追踪：FR-001、NFR-004、SC-006。
- [x] T020 [P] 按固定协议完成 60 个无警告有效样本；6 个可能不完整报告保留并替换，保存中位数、LCP 元素、CLS、瀑布、主线程和 Console；依赖：T013、T014；追踪：NFR-001、NFR-002、SC-007。
- [x] T021 定义生产 5xx 的唯一数据源、时区、Host/Path/Method、最低样本；当前无可靠 Host 级数据源，用户已批准降级为观察项，未来日志口径已记录；依赖：T014、T017；追踪：G-007、NFR-005。
- [x] T022 锁定 G-007、G-003 参数及“达成/未达成/样本不足”格式；GA4/Ghost/AdSense 有效窗口已保存，RUM/生产 5xx 数据不足按批准方案记观察项；依赖：T018、T020、T021；追踪：G-003、G-007、NFR-002、NFR-005。
- [x] T023 建立干净可重建源码基线、release ledger、observation registry 与 predecessor/rollback-forward 模板；基线与独立候选 commit object 已核验，混合 authoring WIP 不作为生产候选；依赖：T015、T016、T017；追踪：FR-003、NFR-007、NFR-008。
- [x] T024 完成公开脚本、Chrome 桌面付费会员、匿名移动/平板、Safari Desktop/390×844/768×1024、Search/Portal/Theme/TOC/PhotoSwipe/Comments/Ads Smoke 与恢复演练；Checkout、免费会员专用测试身份按 D-031 记录为已接受外部缺口而非 Pass，P0 以 `Closed with accepted external gaps` 关闭；依赖：T013、T014、T015、T016、T017、T018、T019、T020、T021、T022、T023；追踪：FR-001、FR-017、SC-001、SC-002、SC-003。

## Phase P1 — Integration Ownership Audit

- [x] T025 [P] 建立 Portal、Search、Ghost Analytics、GA4、RUM、Fonts、Prism、Ghost Comments、Giscus、Ads 的 owner/注入层/页面范围/时机矩阵；依赖：T016、T017；追踪：FR-002、NFR-010。
- [x] T026 [P] 审计全部 Site/Page Injection 的 jQuery 依赖和执行顺序；68 条非空原始 Injection 的 jQuery 命中为 0；依赖：T016；追踪：FR-002、FR-005、FR-009。
- [x] T027 对每个 owner 判定 Pass/Block，并映射到 R0/R2/R3b/R5/R6 入口门；R0 No-op、R2 owner/metric Pass、R3b sequence block、R5/R6 execute audit；依赖：T025、T026；追踪：FR-002、NFR-010。
- [x] T028 在 P0 关闭后冻结当前混合 WIP；当前 authoring 分支继续明确禁止直接发布，`unit-scope-matrix.md` 已记录每单元允许文件、禁止项和 predecessor，9 个独立候选 worktree 复核为 clean；依赖：T024、T027；追踪：FR-003、NFR-008、SC-011。
- [x] T029 关闭 Phase P1；owner matrix 与入口门已映射，R0 走 No-op、R3b/R5/R6 的 sequence block 保留，任何 Block 都没有被后续依赖绕过；依赖：T028；追踪：FR-002、SC-011。

## Phase R0 — Injection Compatibility [US1, US3, US5]

- [x] T030 [US1] 全量 Ghost Export 生成 R0 diff 为空：68 条非空 Post/Page Injection 的 jQuery 命中为 0；依赖：T029 且 R0 owner 门 Pass；追踪：FR-005。
- [x] T031 [US1] No-op 分支无原生 API 迁移，Analytics、Fonts、Prism、Comments 与 Ads owner 均未改变；依赖：T030；追踪：FR-005、NFR-010。
- [x] T032 [US3] 当前 active theme 的公开脚本与完整产品 Smoke 已通过，证明无需 R0 Injection 改动；依赖：T031；追踪：FR-017、SC-003。
- [x] T033 [US1] R0 predecessor Site/Page/Post Injection checksum 已保存在恢复快照；No-op 分支修改批准为 N/A；依赖：T032；追踪：FR-003、NFR-008。
- [x] T034 [US1] R0 未应用任何 Injection diff，配置 Day 0 为 N/A；依赖：T033；追踪：FR-005、NFR-007。
- [x] T035 [US3] 复用同一 predecessor 的 P0 立即功能、Console、Analytics、Ads 与 SEO 证据；No-op 未产生新回归面；依赖：T034；追踪：FR-017、SC-003、SC-004。
- [x] T036 [US1] R0 No-op 没有生产变更或 Day 0，72 小时 G-007 门为 N/A；依赖：T035；追踪：FR-018、NFR-005、SC-011。
- [x] T037 记录 R0 `No-op` 并关闭阶段；没有配置写入、回滚或 rollback-forward；依赖：T036；追踪：NFR-008、SC-002、SC-011。

## Phase R1 — Native JS + TOC [US1, US2, US3]

- [ ] T038 [US1] 从已接受基线建立 R1 范围，排除 Ads、jQuery 范围与 SEO；依赖：T037；追踪：FR-003、FR-006。
- [ ] T039 [P] [US3] 在 `assets/js/main.js` 原生化子菜单、Burger、主题切换；依赖：T038；追踪：FR-006。
- [ ] T040 [P] [US3] 在 `assets/js/post.js` 原生化阅读进度、表格、PhotoSwipe；依赖：T038；追踪：FR-006。
- [ ] T041 [US2] 使用原始 heading ID/`data-target-id` 修复特殊字符、重复标题和无 ID TOC；依赖：T040；追踪：FR-006。
- [ ] T042 [US1] 重建 built/maps/ZIP，运行静态、包和 diff 检查；依赖：T039、T041；追踪：NFR-011。
- [ ] T043 [US3] 完成浏览器、页面、用户状态和可访问性 Smoke；依赖：T042；追踪：FR-017、NFR-003、NFR-004、SC-003。
- [ ] T044 [US1] 锁定 active predecessor、候选名、SHA/checksum并取得上传与激活批准；依赖：T043；追踪：FR-003、NFR-008、NFR-013。
- [ ] T045 [US1] 合并 master，由 CI 验证并上传 R1 未激活候选；依赖：T044；追踪：FR-004、SC-012。
- [ ] T046 [US1] 核对候选未激活后，在 Ghost Dashboard 手动激活并记录 Day 0；依赖：T045；追踪：NFR-013。
- [ ] T047 [US3] 完成 R1 立即检查；依赖：T046；追踪：FR-017、SC-003。
- [ ] T048 [US1] 完成 R1 72 小时门并记录 `Accept/Rollback`；依赖：T047；追踪：FR-018、NFR-005、NFR-008、SC-011。

## Phase R2 — Ads Near-viewport [US2, US5]

- [ ] T049 [US5] 锁定 G-003、Ads owner、1.5–2 视口初始值、最低样本和收益回滚线；依赖：T048 且 Ads owner 门 Pass；追踪：G-003、FR-007、SC-005。
- [ ] T050 [US5] 在 `post.js` 实现布局后至少一帧、Slot 非零、Observer/快速滚动/重复回退；依赖：T049；追踪：FR-007。
- [ ] T051 [US5] 实现 Ads 脚本已存在、成功、失败、超时与重试状态；依赖：T050；追踪：FR-007、NFR-005。
- [ ] T052 [P] [US5] 在 `ads.css` 实现设备 intrinsic size 与 unfilled 父容器策略；依赖：T049；追踪：FR-007、SC-005。
- [ ] T053 [P] [US5] 核对 `post.hbs` 和三个 Custom Post 均且仅保留两个 Slot；依赖：T049；追踪：FR-007、SC-005。
- [ ] T054 [US1] 构建 built/maps/ZIP，完成 Ads 失败、快速滚动、unfilled、三尺寸专项 Smoke；依赖：T051、T052、T053；追踪：NFR-011、SC-003。
- [ ] T055 [US5] 锁定 active predecessor、rollback-forward 模板、候选 SHA/checksum并取得上传与激活批准；依赖：T054；追踪：FR-003、NFR-008。
- [ ] T056 [US5] master 自动验证并上传 R2 未激活候选；依赖：T055；追踪：FR-004、SC-012。
- [ ] T057 [US5] 在 Ghost Dashboard 手动激活 R2并记录 Ads Day 0；依赖：T056；追踪：FR-007、NFR-013。
- [ ] T058 [US5] 完成 R2 立即 Ads、布局、Console、Analytics 检查；依赖：T057；追踪：FR-017、SC-003、SC-004、SC-005。
- [ ] T059 [US5] 完成 R2 72 小时 G-007 技术门并记录 `Pass/Fail`；Ads 数据采集与 Day 7/14/28 计时已从 T057 激活时开始；依赖：T058；追踪：FR-018、NFR-005、SC-011。
- [ ] T060 Pass 分支建立 R2 Day 7/14/28 到期日、负责人、数据口径和 G-008 登记；Fail 分支完成 R2 predecessor 回滚并记录长期观察 N/A；依赖：T059；追踪：G-008、FR-018、NFR-007、NFR-008。
- [ ] T061 记录 R2 `Accept/Rollback` 并关闭技术发布；Accept 或已完成 Rollback 都必须形成稳定已接受 head，失败/未完成回滚阻断后续；依赖：T060；追踪：D-014、SC-011。

## Observation R2 — Non-blocking Ads

- [ ] T062 [P] [US5] Accept 分支执行 Ads Day 7并记录 `Met/Unmet/Insufficient`；触发回滚时新增 rollback-forward；R2 已回滚分支记录 N/A；依赖：T060；追踪：FR-007、SC-005。
- [ ] T063 [P] [US5] Accept 分支执行 Ads Day 14或记录延期依据；R2 已回滚分支记录 N/A；依赖：T062；追踪：FR-007、SC-005。
- [ ] T064 [P] [US5] Accept 分支执行 Ads Day 28最终结论，任何 R2.x/RF 先完成；R2 已回滚分支记录 N/A；依赖：T063；追踪：FR-007、FR-018、SC-005。

## Phase R3a — jQuery Version [US1, US3]

- [ ] T065 [US1] Precheck：执行 G-008，锁定 predecessor并确认只升级 jQuery 3.5.1 -> 3.7.1；依赖：T061；追踪：G-008、FR-008。
- [ ] T066 [US1] 修改版本且保持全站范围，验证 SRI；依赖：T065；追踪：FR-008。
- [ ] T067 [US3] 验证轮播、Load more、Injection、Portal、Search、Post 和 Page；依赖：T066；追踪：FR-017、SC-003。
- [ ] T068 [US1] 取得候选上传与激活批准；依赖：T067；追踪：FR-003。
- [ ] T069 [US1] master 自动验证并上传 R3a候选；依赖：T068；追踪：FR-004、SC-012。
- [ ] T070 [US1] Ghost Dashboard 手动激活并记录 Day 0；依赖：T069；追踪：NFR-013。
- [ ] T071 [US3] 完成立即检查；依赖：T070；追踪：FR-017。
- [ ] T072 [US1] 完成 72 小时门并记录 `Accept/Rollback`；依赖：T071；追踪：FR-018、NFR-008、SC-011。

## Phase R3b — jQuery Scope [US1, US2, US3]

- [ ] T073 [US1] 重新审计 Post/Page Injection，确认 jQuery 范围硬门 Pass；依赖：T072；追踪：FR-009。
- [ ] T074 [US2] 仅为 home/paged/tag/author 保留 jQuery 与 `home.min.js`；依赖：T073；追踪：FR-009。
- [ ] T075 [US3] 验证脚本顺序、Post/Page Network 与完整产品功能；依赖：T074；追踪：FR-017、SC-003。
- [ ] T076 [US1] Precheck：执行 G-008，锁定 predecessor并取得上传与激活批准；依赖：T075；追踪：G-008、FR-003。
- [ ] T077 [US1] master 自动验证并上传 R3b候选；依赖：T076；追踪：FR-004、SC-012。
- [ ] T078 [US1] Ghost Dashboard 手动激活并记录 Day 0；依赖：T077；追踪：NFR-013。
- [ ] T079 [US3] 完成立即检查，确认 Post/Page 无 jQuery；依赖：T078；追踪：FR-009、FR-017。
- [ ] T080 [US1] 完成 72 小时门；依赖：T079；追踪：FR-018、SC-011。
- [ ] T081 记录 R3b `Accept/Rollback`并关闭阶段；依赖：T080；追踪：NFR-008。

## Phase R4.x — Single LCP Candidate [US2]

- [ ] T082 [US2] 按固定协议重新定位各模板真实 LCP；依赖：T081；追踪：FR-010、NFR-001。
- [ ] T083 [US2] 选择一个候选或记录 `No-op/Complete-unmet`；依赖：T082；追踪：FR-010、NFR-002。
- [ ] T084 [US2] Execute 分支 Precheck：执行 G-008，锁定 predecessor、范围和回退线；No-op/Complete-unmet 分支记录 N/A；依赖：T083；追踪：G-008、FR-010。
- [ ] T085 [US2] Execute 分支只实现一个模板的一个候选；No-op/Complete-unmet 分支记录 N/A；依赖：T084；追踪：FR-010。
- [ ] T086 [US2] Execute 分支构建并按相同条件比较至少 5 次中位数；No-op/Complete-unmet 分支记录 N/A；依赖：T085；追踪：NFR-001、NFR-002、SC-007。
- [ ] T087 [US2] 取得候选上传与激活批准或记录 N/A；依赖：T086；追踪：FR-003。
- [ ] T088 [US2] CI 上传候选或记录 N/A；依赖：T087；追踪：FR-004、SC-012。
- [ ] T089 [US2] Dashboard 激活并记录 Day 0或记录 N/A；依赖：T088；追踪：NFR-013。
- [ ] T090 [US2] 完成立即检查或记录 N/A；依赖：T089；追踪：FR-017。
- [ ] T091 [US2] 完成 72 小时门或记录 N/A；依赖：T090；追踪：FR-018、SC-011。
- [ ] T092 记录 `No-op/Accept/Rollback/Iterate/Complete-unmet`；Iterate/Rollback-forward 必须先新增任务；依赖：T091；追踪：NFR-008、SC-007。

## Phase R5.x — Fonts [US2, US3]

- [x] T093 [US2] 审计主题/Site/Page Injection 字体来源、字重、preload、重复请求及 LXGW 历史选择；active/direct predecessor/全部 `ndawn-*` 均未选择 LXGW，线上与 ZIP 无请求；依赖：T092；追踪：G-010、FR-011。
- [x] T094 [US2] 执行 G-010，用户已批准删除 LXGW 选项/死代码/旧 WOFF2并保留 Modern/Elegant；R5a 独立候选 commit `a5a07c7` 已通过 source/built/ZIP 检查；依赖：T093；追踪：G-010、FR-011。
- [ ] T095 [US2] Execute 分支 Precheck：执行 G-008，锁定 predecessor和视觉回退；No-op 分支记录 N/A；依赖：T094；追踪：G-008、FR-011。
- [ ] T096 [US2] Execute 分支实现一个字体来源/字重策略并验证 Network、fallback、视觉和包内容；No-op 分支记录 N/A；依赖：T095；追踪：FR-011、NFR-004。
- [ ] T097 [US1] 取得候选上传与激活批准或记录 N/A；依赖：T096；追踪：FR-003。
- [ ] T098 [US1] CI 上传候选或记录 N/A；依赖：T097；追踪：FR-004、SC-012。
- [ ] T099 [US1] Dashboard 激活并记录 Day 0或记录 N/A；依赖：T098；追踪：NFR-013。
- [ ] T100 [US3] 完成立即检查或记录 N/A；依赖：T099；追踪：FR-017。
- [ ] T101 [US1] 完成 72 小时门或记录 N/A；依赖：T100；追踪：FR-018、SC-011。
- [ ] T102 记录 `No-op/Accept/Rollback/Iterate/Complete-unmet`；依赖：T101；追踪：NFR-008、SC-007。

## Phase R6 — Prism On-demand [US2, US3]

- [ ] T103 [US2] 确认 Footer Injection owner/选择器，选择 Execute 或 `No-op/Separate-Spec`；依赖：T102；追踪：FR-012。
- [ ] T104 [US2] Execute Precheck：执行 G-008，保存 R6 predecessor Injection/checksum，绝不使用 P0；No-op/Separate-Spec 分支记录 N/A；依赖：T103；追踪：G-008、NFR-008。
- [ ] T105 [US2] Execute 分支用当前 Export 生成 59 篇 Post Injection allowlist diff；验证普通页不加载、代码页由 Site Footer 条件加载且 5 个混合页保留 KaTeX/MathJax/Mermaid；其他分支记录 N/A；依赖：T104；追踪：FR-012。
- [ ] T106 [US1] 取得 R6 Injection 修改批准或记录 N/A；依赖：T105；追踪：FR-003。
- [ ] T107 [US1] 应用 R6 diff并记录 Day 0或记录 N/A；依赖：T106；追踪：FR-012。
- [ ] T108 [US3] 完成立即检查或记录 N/A；依赖：T107；追踪：FR-017。
- [ ] T109 [US1] 完成 72 小时门或记录 N/A；依赖：T108；追踪：FR-018、SC-011。
- [ ] T110 记录 `No-op/Accept/Rollback/Iterate/Separate-Spec`；Rollback 只恢复 R6 predecessor；依赖：T109；追踪：NFR-008、SC-002。

## Phase R7a/R7b — SEO Theme Semantics [US4]

- [ ] T111 [P] [US4] 生成 H1 视觉预览并记录 G-001 Pass/Reject；依赖：T110；追踪：G-001、FR-013。
- [ ] T112 [P] [US4] 生成最新 5 篇摘要预览并记录 G-002 Pass/Reject；依赖：T110；追踪：G-002、FR-013。
- [ ] T113 [US4] 实现标题文字链接、heading、分页和已批准 H1；Reject H1时保持 no-op；依赖：T111；追踪：FR-013、NFR-004。
- [ ] T114 [US4] 验证 Tab 顺序、每卡唯一焦点、accessible name、分页标签和 Ghost SEO 输出；依赖：T113；追踪：FR-013、NFR-004、SC-006。
- [ ] T115 [US4] R7a Precheck：执行 G-008，锁定 predecessor并取得上传与激活批准；依赖：T114；追踪：G-008、FR-003。
- [ ] T116 [US4] CI 上传 R7a候选；依赖：T115；追踪：FR-004、SC-012。
- [ ] T117 [US4] Dashboard 激活 R7a并记录 Day 0；依赖：T116；追踪：NFR-013。
- [ ] T118 [US4] 完成 R7a 立即检查；依赖：T117；追踪：FR-017、SC-006。
- [ ] T119 [US4] 完成 R7a 72 小时门；依赖：T118；追踪：FR-018、SC-011。
- [ ] T120 [US4] 记录 R7a `Accept/Rollback`；Accept 才依据 G-002 选择 R7b Execute/Reject，Rollback 必须先完成并令 T121–T126 记录 N/A；依赖：T112、T119；追踪：G-002、FR-013、NFR-008。
- [ ] T121 [US4] Execute 分支实现/验证摘要并完成 G-008 Precheck；Reject 或 R7a Rollback 分支记录 N/A；依赖：T120；追踪：G-008、FR-013。
- [ ] T122 [US4] 取得 R7b候选上传与激活批准或记录 N/A；依赖：T121；追踪：FR-003。
- [ ] T123 [US4] CI 上传 R7b候选或记录 N/A；依赖：T122；追踪：FR-004、SC-012。
- [ ] T124 [US4] Dashboard 激活并记录 R7b Day 0或记录 N/A；依赖：T123；追踪：NFR-013。
- [ ] T125 [US4] 完成 R7b 立即检查或记录 N/A；依赖：T124；追踪：FR-017。
- [ ] T126 [US4] 完成 R7b 72 小时门或记录 N/A；依赖：T125；追踪：FR-018、SC-011。
- [ ] T127 独立关闭 R7b：记录 `Reject/Accept/Rollback/N/A`；汇总 R7a/R7b 各自退出，只有稳定已接受 head 进入 R7c；依赖：T126；追踪：NFR-008、SC-006。

## Phase R7c — Ghost SEO Content [US4]

- [ ] T128 [US4] 依据 Search Console/GA4 盘点 Tag description、Post excerpt、Feature image alt 与获批重点文章的正文 Image Card alt 候选；装饰图保持空值；依赖：T127；追踪：G-009、FR-013。
- [ ] T129 [US4] 执行 G-009，选择一个 allowlist 批次或记录 `No-op`；依赖：T128；追踪：G-009、FR-013。
- [ ] T130 [US4] Execute Precheck：导出原字段值、URL 和内容 predecessor；No-op 分支记录 N/A；依赖：T129；追踪：NFR-008。
- [ ] T131 [US4] Execute 分支离线拟定并审查准确文本，禁止关键词堆砌；No-op 分支记录 N/A；依赖：T130；追踪：FR-013、NFR-004。
- [ ] T132 [US4] 取得该批 Ghost 内容修改批准或记录 N/A；依赖：T131；追踪：FR-003。
- [ ] T133 [US4] 修改 allowlist 内容并记录 Day 0或记录 N/A；依赖：T132；追踪：FR-013。
- [ ] T134 [US4] Execute 分支完成页面、Sitemap、社交预览、alt 与可访问性立即检查；No-op 分支记录 N/A；依赖：T133；追踪：FR-017、NFR-004、SC-006。
- [ ] T135 [US4] 完成 72 小时技术门或记录 N/A；依赖：T134；追踪：FR-018、SC-011。
- [ ] T136 记录 `No-op/Accept/Rollback/Iterate`；Rollback 恢复该批原字段，Iterate 先新增任务；依赖：T135；追踪：NFR-008、SC-006。

## Phase R8 — Exact Redirects [US4]

- [ ] T137 [US4] 从 Search Console、GA4、外链或日志收集历史 404；依赖：T136；追踪：FR-014。
- [ ] T138 [US4] 选择精确映射单元或记录 `No-op`；依赖：T137；追踪：FR-014。
- [ ] T139 [US4] Execute Precheck：下载 redirects predecessor/checksum并离线验证一跳、无 chain/loop/误伤；No-op 分支记录 N/A；依赖：T138；追踪：FR-014、NFR-008。
- [ ] T140 [US4] 取得 redirects 上传批准或记录 N/A；依赖：T139；追踪：FR-003。
- [ ] T141 [US4] 上传当前 redirects 单元并记录 Day 0或记录 N/A；依赖：T140；追踪：FR-014。
- [ ] T142 [US4] Execute 分支完成旧 URL、canonical、路由、Sitemap、RSS 与 4xx 立即检查；No-op 分支记录 N/A；依赖：T141；追踪：FR-017、SC-006。
- [ ] T143 [US4] 完成 72 小时门或记录 N/A；依赖：T142；追踪：FR-018、SC-011。
- [ ] T144 记录 `No-op/Accept/Rollback`；Rollback 恢复 R8 predecessor；依赖：T143；追踪：NFR-008。

## Phase P5 — Unified Acceptance [US1–US5]

- [ ] T145 汇总 R0–R8 的版本、SHA/checksum、激活/生效 Day 0、批准、立即/72h、回滚和长期旁路状态；依赖：T144；追踪：NFR-007、SC-011。
- [ ] T146 执行产品、性能硬门、三类统计、Ads 即时行为、SEO 技术端点和可访问性统一验收；长期目标只记录 `Met/Unmet/Insufficient`；依赖：T145；追踪：FR-017、SC-003、SC-004、SC-005、SC-006、SC-007、SC-008。
- [ ] T147 形成是否进入 Cloudflare 的正式结论；只有技术与正确性硬门 Pass 才可继续；依赖：T146；追踪：FR-017、SC-011。

## Phase R9.x — Cloudflare Cache [US6]

- [ ] T148 [US6] 审计全部 Cache Rules、Tiered Cache、Purge 和顺序；所有 Cache Rule 操作只属于 R9；依赖：T147；追踪：FR-015。
- [ ] T149 [US6] 选择一条规则/严格同类组或记录 `No-op`；依赖：T148；追踪：G-004、FR-015。
- [ ] T150 [US6] Execute Precheck：执行 G-008，若 Yes/未知则等待 T064 或先新增 R2.x；保存 predecessor 并执行 A→B→C→A，留存 Status、Age、Cache-Control、Vary、ETag、Ray ID 与权限；No-op 记录 N/A；依赖：T149；追踪：G-008、FR-015、NFR-006、NFR-008。
- [ ] T151 [US6] 取得当前 Cache 单元批准或记录 N/A；依赖：T150；追踪：FR-003。
- [ ] T152 [US6] 应用当前 Cache 单元并记录 Day 0或记录 N/A；依赖：T151；追踪：FR-015。
- [ ] T153 [US6] Execute 分支立即重放 A→B→C→A：DYNAMIC 可接受，BYPASS 记录原因，MISS 重复后不得共享命中且 Age 不递增；验证权限；No-op 记录 N/A；依赖：T152；追踪：FR-015、SC-009。
- [ ] T154 [US6] Execute 分支验证静态 MISS/HIT、上游 Cache-Control/ETag、版本参数和精确 Purge；No-op 记录 N/A；依赖：T153；追踪：FR-015、SC-009。
- [ ] T155 [US6] Execute 分支完成产品、Analytics、SEO、Verified Bots 立即矩阵；No-op 记录 N/A；依赖：T154；追踪：FR-017、SC-003、SC-004、SC-006、SC-010。
- [ ] T156 [US6] 完成 72 小时门或记录 N/A；依赖：T155；追踪：FR-018、SC-011。
- [ ] T157 记录 `No-op/Accept/Rollback/Iterate/Complete`；Iterate 先新增 R9.x 任务，Rollback 恢复当前规则 predecessor；依赖：T156；追踪：NFR-008、SC-009。

## Phase R10.x — Cloudflare Security [US6]

- [ ] T158 [P] [US6] 审计 WAF、Rate Limit、Transform；发现 Cache 问题时立即停止且不得勾选本任务，先把新 R9.x 及后续 R10.x ID/依赖写回 SDD并完成 R9 Accept；不得夹带 Cache；依赖：T157；追踪：G-005、FR-016。
- [ ] T159 [P] [US6] 验证 Verified Bots、边缘/源端证书、`_domainconnect` 和 Proxied 应急手册；依赖：T157；追踪：NFR-012、SC-010。
- [ ] T160 [US6] 选择一条规则/严格同类组或记录 `No-op`；依赖：T158、T159；追踪：G-004、G-005、FR-016。
- [ ] T161 [US6] Execute Precheck：执行 G-008，若 Yes/未知则等待 T064 或先新增 R2.x；保存 predecessor、表达式、动作、顺序和 Log 口径；No-op 记录 N/A；依赖：T160；追踪：G-008、FR-016、NFR-008、NFR-009。
- [ ] T162 [US6] 取得 Log/模拟模式批准或记录 N/A；依赖：T161；追踪：FR-003。
- [ ] T163 [US6] 应用 Log/模拟模式并记录 Day 0或记录 N/A；依赖：T162；追踪：FR-016。
- [ ] T164 [US6] Execute 分支完成 Log 模式立即功能/Bot检查；No-op 记录 N/A；依赖：T163；追踪：FR-017、SC-010。
- [ ] T165 [US6] Execute 分支完成 Log 模式 72 小时误报观察；No-op 记录 N/A；依赖：T164；追踪：NFR-009、SC-011。
- [ ] T166 [US6] 判定 `Enforce/Log-only/Rollback/Iterate/No-op`；依赖：T165；追踪：FR-016。
- [ ] T167 [US6] Enforce 分支取得目标动作批准；其他分支记录 N/A或执行 predecessor 回滚；依赖：T166；追踪：FR-003、NFR-008。
- [ ] T168 [US6] 切换目标动作并记录新的生效时间或记录 N/A；依赖：T167；追踪：FR-016。
- [ ] T169 [US6] 完成目标动作立即产品/Analytics/Bot/证书检查或记录 N/A；依赖：T168；追踪：FR-017、SC-003、SC-004、SC-010。
- [ ] T170 [US6] 完成目标动作 72 小时门或记录 N/A；依赖：T169；追踪：FR-018、SC-011。
- [ ] T171 记录 `No-op/Accept/Log-only/Rollback/Iterate/Complete`；Iterate 先新增 R10.x 任务；依赖：T170；追踪：NFR-008、SC-010。

## Phase P8 — Final Matrix and Long-term Evidence

- [ ] T172 在最终 Cloudflare 状态重跑完整浏览器/设备/模板/用户、A→B→C→A、Ads、SEO、Analytics、Bot 与证书矩阵；依赖：T157、T171；追踪：FR-017、SC-003、SC-004、SC-006、SC-009、SC-010。
- [ ] T173 审计 observation registry，确认每个主题激活和配置生效都有独立 Day 0、到期日和负责人；依赖：T172；追踪：FR-018、NFR-007。
- [ ] T174 [P] 汇总所有已到期 Day 7 记录；每项保持独立 cohort 和 `Met/Unmet/Insufficient`；依赖：T173；追踪：FR-018、SC-005、SC-008。
- [ ] T175 汇总所有已到期 Day 14 Ads、SEO、RUM 与 Cloudflare 记录；依赖：T174；追踪：FR-018、SC-005、SC-006、SC-008。
- [ ] T176 汇总所有已到期 Day 28 记录；必须包含 T064 Ads 结论，任何延期/迭代先补任务；依赖：T064、T175；追踪：FR-018、SC-005、SC-006、SC-008。
- [ ] T177 执行 G-006 的 `N/A/另立 DNS-only SDD` 判定，形成最终“达成/未达成/样本不足/后续独立方案”报告；依赖：T176；追踪：G-006、FR-018、SC-007、SC-008、SC-010。

## Dependency Summary

```text
Main:
T001-T012 -> T013-T024 -> T025-T029 -> T030-T037
-> T038-T048 -> T049-T061 -> T065-T072 -> T073-T081
-> T082-T092 -> T093-T102 -> T103-T110
-> T111-T127 -> T128-T136 -> T137-T144
-> T145-T147 -> T148-T157 -> T158-T171
-> T172-T177

Ads observation side lane:
T060 -> T062 -> T063 -> T064 -> T176
```

## Parallel Opportunities

- P0 的只读导出、线上快照、指标与性能采集可并行。
- P1 owner matrix 与 jQuery Injection 审计可并行。
- R1 的 `main.js` 与 `post.js` 离线实现可并行。
- R2 的 JS、CSS、HBS 离线实现可并行；候选上传和激活不可并行。
- R7 的 H1/摘要预览可并行，但 R7 退出依赖两个决策分支。
- R10 的安全规则审计与证书/应急手册验证可并行。
- Ads Day 7/14/28 是旁路观察，可与 G-008 判定为“不影响 Ads”的主链工作并行。
