# P1 Integration Ownership Audit（Draft）

> 状态：`PUBLIC SURFACE AUDITED / ADMIN EXPORT PENDING`  
> 记录时间：2026-07-12（Asia/Singapore）  
> 线上写入：无

## Owner 矩阵

| 能力 | 唯一/当前 owner | 注入层 | 页面范围 | 时机 | 判定 |
|---|---|---|---|---|---|
| Portal | Ghost | `ghost_head` | 全站 | defer | 保留 |
| Stripe | Ghost Portal | `ghost_head` | 全站 HTML | async | 保留 |
| Search | Ghost Sodo Search | `ghost_head` | 全站 | defer | 保留 |
| Ghost Analytics | Ghost | `ghost_head` | 全站 | defer | 保留 |
| GA4 | Site Header Injection + Zaraz shadow config | Ghost Injection + Cloudflare | 全站/配置态 | direct script async；Zaraz runtime 未观察到 | owner 待核对 |
| Fonts | Site Header Injection + theme CSS | Header + `screen.css` | 全站 | non-blocking preload | owner 冲突，进入 R5 |
| Prism | Site Footer Injection + 64 个历史 Post Injection | Site/Post Injection | 代码 Post 为主 | DOM 检测后动态加载；历史语言组件额外加载 | owner 冲突，进入 R6 |
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

公开 Content API 覆盖 196 篇 published Post 与公开 Pages：

- 非空 Post Injection：64 篇；head 3 篇，foot 63 篇。
- 非空 Page Injection：3 页；head 1 页，foot 2 页。
- 全量公开 Post/Page Injection 中 jQuery / `$()` / `$.` 命中：0。
- 历史 Prism 主要版本为 1.26/1.28/1.29，并存在 Go、Python、Bash、TypeScript、C/C++、SQL、YAML 等按文章组件。
- 另有 Mermaid、KaTeX、MathJax 及个别页面专用组件，不能作为 Prism 清理顺手删除。

结论：当前公开生产 Post/Page Injection 不依赖 jQuery，R0 的生产 owner 条件初步 Pass；但 P1 正式关闭前仍需 Ghost Export/后台快照覆盖 drafts、未公开 Page 及原始格式。

Cloudflare Zaraz 当前为 Zone Active，GA4 tool checked；但公开首页 DOM 只观察到 direct gtag，没有 Zaraz runtime script。必须用 GA4 实际请求/数据核对唯一 pageview owner，不能把“配置 checked”误判为已经重复统计，也不能直接删除 Zaraz 能力。

## 阶段入口判定

| 阶段 | 当前结论 | 原因 |
|---|---|---|
| R0 | `PUBLIC PASS / FORMAL BLOCK` | 公开 Injection 无 jQuery；全量 Admin Export 未完成 |
| R2 | `OWNER PASS / METRIC BLOCK` | Ads 只有 theme owner；G-003 最低样本与收益线未锁定 |
| R3b | `PUBLIC PASS / FORMAL BLOCK` | 公开 Post/Page Injection 无 jQuery；需先完成 R0/R1/R2/R3a |
| R5 | `EXECUTE CANDIDATE` | Barlow/Alike 在 Site Injection，theme CSS 用 `!important` 强制 Barlow；`@custom` Elegant/LXGW 当前会被覆盖或无效 |
| R6 | `EXECUTE CANDIDATE` | Site Footer 已按 DOM 加载，但 64 篇历史 Post Injection 仍是额外 Prism owner；需单独备份和清理，不得影响 Mermaid/KaTeX/MathJax |

## 字体历史包袱

- Site Injection 加载 Barlow 300/500/700（含 italic）和 Alike。
- `assets/css/misc/header-inject.css` 用 `!important` 对 body 与所有 heading 强制 Barlow，覆盖 Ghost `@custom` 字体语义。
- package 提供 `LXGW Bright` 选项，但相关 `@font-face` 已注释，且现有 WOFF2 位于被 ZIP 排除的 `assets/css/**`。
- 当前线上设置是 `Modern sans-serif`，因此当前视觉不受影响；R5 必须在保留 Modern/Elegant/LXGW 三个选项的前提下处理，不能直接删除任一能力。

## 未完成

- Ghost 全量 Export 和原格式 Page/Post Injection 备份。
- private/draft 内容的 Injection 审计。
- GA4/Ghost Analytics/Ads 数据口径和样本导出。
- R5 字体许可、子集、最终包路径与视觉预览。
- R6 64 篇历史 Prism Injection 的精确 allowlist、predecessor 和清理批准。
