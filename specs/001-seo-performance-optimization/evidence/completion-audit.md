# Spec 完成度审计

日期：2026-07-12  
判定原则：只有当前代码、线上状态或可重复证据直接证明时才记为完成；本地候选不等于生产完成。

## Functional Requirements

| 要求 | 当前证据 | 判定 | 关闭条件 |
|---|---|---|---|
| FR-001 基线与回滚 | P0 public/Cloudflare/Lighthouse、Ghost Export、Injection、routes/redirects、GA4/Ghost/Ads、公开 SEO/响应头；恢复演练、Chrome 付费会员、匿名移动/平板、Safari Desktop/Responsive、PhotoSwipe 与匿名 Portal Smoke PASS | **P0 门完成（含 D-031 外部缺口）** | Checkout 与免费会员仍非 Pass；R9 前必须补齐免费会员；旧主题 ZIP 下载为 N/A |
| FR-002 owner 审计 | `p1-owner-audit.md` 覆盖全量 Export；R0 jQuery owner Pass；GA4 7/28 天、同 Measurement ID、Zaraz `executed=[]` 与单访问单 Realtime view 证明 direct gtag 为当前 owner | **完成（点时 owner 基线）** | 每个相关生产单元继续复核，不删除 Zaraz 能力 |
| FR-003 隔离发布 | 可重建源码基线、release ledger、observation registry、rollback-forward 模板与 R1–R7b 独立 commit object 已核验；authoring 工作区仍为混合 WIP | **部分** | 各单元继续按 accepted predecessor 重建 SHA/ZIP，不直接发布当前工作区 |
| FR-004 CI/CD | F0a run `29179810177` PASS；F0b run `29179894534` PASS并上传唯一未激活候选；zero-upload runs `29180067547` / `29180120331` PASS；上传当时 Ghost active 不变，用户后续手动激活 | **完成** | D-020 下 PR 实跑 N/A，事件配置保留 |
| FR-005 R0 Injection | Ghost Export 中 68 条非空 Injection 的 jQuery 命中为 0；P1 已关闭，R0 未产生配置写入或 Day 0 | **完成 / No-op** | 无 |
| FR-006 R1 Native JS/TOC | 独立 commit `0e72467`、可重复 ZIP checksum、原生 JS、原始 heading ID 与真实 Chrome/Safari fixture；P0/P1/R0 已关闭 | **本地发布候选通过** | 取得 T044 上传/激活批准，完成 CI 上传、Ghost 实际候选立即与 72h |
| FR-007 R2 Ads | 独立 commit `f52f512`/ZIP、近视口、布局/Slot、失败/重复/unfilled/fallback 状态机与 6-mode Chrome fixture | **独立本地候选** | R1 accepted 后从其 head 重建；锁定 G-003、真实 AdSense/三设备 Smoke、独立发布及 Day 7/14/28 |
| FR-008 R3a jQuery 版本 | 独立 commit `82aebbb`/ZIP 只把全站 3.5.1 + SRI 升至 3.7.1 + SRI | **独立本地候选** | R2 accepted 后重建/核对，取得批准并完成生产观察 |
| FR-009 R3b jQuery 范围 | 独立 commit `27051d2`/ZIP 仅把 jQuery 3.7.1 收敛到 home/paged/tag/author | **独立本地候选** | R0–R3a 接受后重建/核对并发布，Network 证明 Post/Page 无 jQuery |
| FR-010 R4 LCP | Cloudflare RUM 指向首页第二张 Featured；独立 commit `1362b72`/ZIP 仅改非首图 native discovery | **独立本地候选** | 前置稳定后按固定协议 5 次中位数、发布与 72h |
| FR-011 R5 Fonts | R5a commit `a5a07c7`/ZIP 删除 LXGW；R5b 方案 A 已批准并形成 commit `3cb1791`、ZIP `f6e39633…4b6d`，四种 Modern/Elegant 组合及 GScan/包检查 PASS | **R5a/R5b 独立本地候选 / 部分** | R5a、R5b 顺序发布；R5b 稳定后单独执行 R5c Site Header owner 迁移 |
| FR-012 R6 Prism | Footer DOM 条件加载完整快照；全量 Export 有 59 篇 legacy owner；可重建 manifest 已证明 54 clear、5 surgical 且保留 KaTeX/MathJax/Mermaid | **离线候选 / 部分** | R5c 后重新导出 predecessor、批准清理 legacy Prism，普通/代码/混合页验证与 72h |
| FR-013 R7 SEO | R7a commit `0916c11`/ZIP 实现可见 H1 与语义；R7b commit `112e320`/ZIP 增加摘要；G-009 的 2 张 Lexical Image Card、4 张 Feature image、1 个 meta description 精确文本及 2 张 Mobiledoc No-op 均已批准 | **部分** | R7a/R7b 独立发布；G-009 三个内容子批次取得执行批准、发布及 14/28d |
| FR-014 R8 Redirects | Search Console 3 个 404 与全量 Export 已核对；用户批准 `/site`、`/my-pkm/，`、`/D` 全部不建立猜测性映射 | **Approved No-op / 依赖待关闭** | T136 后按顺序记录 R8 No-op |
| FR-015 R9 Cache | Cloudflare 只读快照；HTML 当前 DYNAMIC | **未开始执行** | P5 后逐条规则批准，A→B→C→A、静态 HIT/Purge、72h |
| FR-016 R10 Security | R10a Rate Limit No-op、R10b Gemini Disable 设计、R10c `www` Full strict 设计、R10e CORS No-op 均已批准；R10d Webhook 修改被用户暂缓，已知风险保留 backlog | **R10a/R10e Approved No-op + R10b/R10c execution pending + R10d Deferred** | R9 后分别取得 R10b/R10c 执行批准并完成最终矩阵；R10d 未来另行确认 owner、权限与窗口 |
| FR-017 统一验收 | 公开 10 页/端点、Chrome 桌面付费会员、匿名移动/平板、Safari Desktop/390×844/768×1024、Search/Portal/Theme/TOC/PhotoSwipe/Comments/Ads，以及 Full/No-image 未发布 Preview | **P0 门完成 / 总体验收部分** | Checkout、免费会员为 D-031 外部缺口；每个候选与最终 Cache/安全矩阵仍需执行 |
| FR-018 长期复查 | F0 packaging 候选由用户手动激活，但无功能代码差异，不建立 SEO/性能观察窗口 | **未开始** | 从首个功能发布单元起记录立即/72h，适用时 7/14/28d；保留所有既有能力 |

## Success Criteria

| 成功标准 | 判定 | 主要缺口 |
|---|---|---|
| SC-001 基线可复现 | **部分** | 60-run Lighthouse、恢复材料与 Safari Desktop/Responsive 完成；仍缺完整账号功能矩阵 |
| SC-002 可恢复 | **满足恢复材料门** | Ghost installed predecessor 可重新 Activate；Ghost Export、routes、redirects 与 Cloudflare 快照均已保存 |
| SC-003 功能完整 | **部分** | 真实候选与完整矩阵未跑 |
| SC-004 统计连续 | **基线部分通过** | GA4/Ghost/AdSense 基线已保存，单访问单 GA4 page_view 已证明；仍需每个生产单元 Day 0 连续性检查 |
| SC-005 广告保护 | **本地候选 + 基线** | 网站级 7/28 天基线与 G-003 阈值已确认；发布后仍需 Day 7/14/28 |
| SC-006 SEO 正确 | **基线部分通过** | 生产 R7/R8 Day 0 与 Search Console 14/28d |
| SC-007 阶段性能 | **P0 已证明，优化未发布** | P0 60 个有效样本完成；仍需每单元相同协议与 72h |
| SC-008 长期体验 | **样本不足且未到期** | 每个性能单元 Day 0 与 ≥100 RUM cohort |
| SC-009 缓存正确 | **未证明** | 三身份 A→B→C→A 与静态 Purge |
| SC-010 安全与爬虫 | **部分** | Verified Bots、源端证书与 R10 观察 |
| SC-011 隔离与稳定 | **未完成** | 当前仍混合 WIP，尚无独立 72h 单元 |
| SC-012 CI/CD 门禁 | **完成** | 正向真实上传、唯一 identity、active 不变、docs/specs/workflow-only 0 上传、失败阻断均有证据 |

## 当前可继续与必须暂停的边界

可继续：本地语义、构建、ZIP、防回归、只读公开面/Cloudflare 审计、离线候选与恢复模板。

必须暂停并等待确认：任何文件上传、Ghost/Cloudflare 写入、主题候选上传/激活、Site Header 字体清理、未发布 Ghost Preview、内容/redirects/WAF/Cache 修改。R5a/R5b 已形成隔离本地候选但上传仍未批准；G-009 精确文本和 R10b 禁用设计获批不等于线上执行批准；Ghost Export、routes、redirects 下载已获准并完成；旧主题 ZIP 下载明确不执行。

补充：当前已实现 Unit 的聚合源码、语义、Injection、GScan、ZIP 与确定性重建均已 PASS；R5/R6/R7c–R10 仍未完成，该结果不代表最终完成，也不替代各 Unit 的独立生产门。
