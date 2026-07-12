# P1 Integration Ownership Audit

> 状态：`CLOSED / FULL GHOST EXPORT AUDITED / OWNER GATES MAPPED`
> 记录时间：2026-07-12（Asia/Singapore）  
> 线上写入：无

## Owner 矩阵

| 能力 | 唯一/当前 owner | 注入层 | 页面范围 | 时机 | 判定 |
|---|---|---|---|---|---|
| Portal | Ghost | `ghost_head` | 全站 | defer | 保留 |
| Stripe | Ghost Portal | `ghost_head` | 全站 HTML | async | 保留 |
| Search | Ghost Sodo Search | `ghost_head` | 全站 | defer | 保留 |
| Ghost Analytics | Ghost | `ghost_head` | 全站 | defer | 保留 |
| GA4 | Site Header direct gtag；Zaraz shadow config | Ghost Injection + Cloudflare | 全站/配置态 | direct script async；Zaraz bootstrap 未执行任何 tool | owner Pass；保留两边配置但禁止第二套 pageview |
| Fonts | Site Header Injection + theme CSS | Header + `screen.css` | 全站 | non-blocking preload | owner 冲突，进入 R5 |
| Prism | Site Footer Injection + 59 个历史 Post/Page Injection | Site/Post Injection | 代码 Post 为主 | DOM 检测后动态加载；历史语言组件额外加载 | owner 冲突，进入 R6 |
| Ghost Comments | Ghost helper | `post.hbs` | 登录会员普通 Post | Ghost managed | 保留 |
| Giscus | theme partial | `partials/comments.hbs` | 匿名普通 Post + 三个 Custom Post | async + lazy iframe | 保留 |
| Ads | theme partial + `post.js` | 四个 Post-family 模板 | Post/Custom Post | 近视口 | R2 owner |
| jQuery | active theme | `default.hbs` | 当前全站 | parser-time 3.5.1 | R3a/R3b |
| Home bundle | theme | `home.min.js` | Home/Paged/Tag/Author | jQuery 后 defer | 保留 jQuery |
| Cloudflare email decode | Cloudflare | Edge HTML transform | 含混淆邮箱页面 | parser-time | 保留 Cloudflare 能力 |

## Site Injection 恢复材料

- [Site Header](./ghost-injection/site-header.html)：44 行，SHA-256 `6d726b1d721f475ffa08fd6126c462385e18ace223c2acf9879ad4f1f4e7d678`
- [Site Footer](./ghost-injection/site-footer.html)：82 行，SHA-256 `fce94e4e9c5964c3cf69ef941dad6f309865e68ee101d0cab99625d0c30a2a35`；脚本正文与 2026-07-12 公开页面实际下发的 3,075 字符 Prism 脚本逐字一致。
- 从 Ghost Admin Code Injection 只读复制，未点击 Save。

## Page/Post Injection 审计

Ghost 原始 Export 覆盖 215 条 Post/Page（210 published、5 draft；201 Post、14 Page）：

- 非空 Injection：68 条；65 Post、3 Page；67 published、1 draft。
- 全量原始 Post/Page Injection 中 jQuery 命中：0。
- Prism 59 条、Mermaid 4 条、MathJax 2 条、KaTeX 2 条，部分文章组合使用。
- 历史 Prism 主要版本为 1.26/1.28/1.29，并存在 Go、Python、Bash、TypeScript、C/C++、SQL、YAML 等按文章组件。
- 另有 Mermaid、KaTeX、MathJax 及个别页面专用组件，不能作为 Prism 清理顺手删除。

结论：全部公开、draft/private 原始 Post/Page Injection 均不依赖 jQuery，R0 owner 条件正式 Pass，R0 应走 No-op，不制造 Injection 修改。

2026-07-12 P0 按 D-031 关闭后，当前混合 authoring WIP 已冻结为“禁止直接发布”；`unit-scope-matrix.md` 的允许文件、禁止项和 predecessor 继续作为事实来源，9 个独立候选 worktree 复核为 clean。P1 随后正式关闭，R0 已按 No-op 退出。

Cloudflare Zaraz 当前为 Zone Active，GA4 tool 与 Pageviews checked，且使用与 Site Header 相同的 Measurement ID。公开页加载 Zaraz bootstrap，但点时 payload `executed=[]`，页面无可运行 `window.zaraz`；唯一审计访问在 GA4 Realtime 产生 1 个 view。当前实际 page_view owner 因此判定为 direct gtag，Zaraz 保留为未执行 shadow config；详见 `ga4-zaraz-baseline.md`。

## 阶段入口判定

| 阶段 | 当前结论 | 原因 |
|---|---|---|
| R0 | `OWNER PASS / NO-OP` | 全量 Export 证明 68 条非空 Injection 的 jQuery 命中为 0 |
| R2 | `OWNER + METRIC PASS` | Ads 只有 theme owner；7/28 天网站级基线及 G-003 已获用户确认 |
| R3b | `OWNER PASS / SEQUENCE BLOCK` | Post/Page Injection 无 jQuery；仍需先完成 R1/R2/R3a |
| R5 | `TWO LOCAL CANDIDATES / SEQUENCE BLOCK` | R5a 已完成本地 LXGW 清理；R5b 方案 A 已批准并以独立 commit/ZIP 恢复 Modern/Elegant 条件 owner；Barlow/Alike 仍在 Site Injection，等待 R5b 稳定后执行独立 R5c |
| R6 | `EXECUTE CANDIDATE` | 59 条历史 Prism Injection 已形成精确 allowlist：54 条 Prism-only、5 条需保留 Mermaid/KaTeX/MathJax；等待 R5.x 与修改批准 |

## 字体历史包袱

- Site Injection 加载 Barlow 300/500/700（含 italic）和 Alike。
- `assets/css/misc/header-inject.css` 用 `!important` 对 body 与所有 heading 强制 Barlow，覆盖 Ghost `@custom` 字体语义。
- 生产 active theme 仍提供 `LXGW Bright` 选项，但从未有效加载；本地 R5 候选已按批准范围删除选项、注释、fallback 与旧 WOFF2，尚未发布。
- 当前线上设置是 `Modern sans-serif`，因此本地清理不改变生产视觉。

## 未完成

- 每个触及 Site Header、Zaraz 或 Cloudflare 请求链的生产单元仍须复核单访问单 page_view。
- R5a/R5b 仍须按顺序发布；R5c 线上 Site Header 字体迁移仍须独立执行批准。
- R6 执行前的最新 predecessor Export/checksum 与清理批准；allowlist 已完成。
