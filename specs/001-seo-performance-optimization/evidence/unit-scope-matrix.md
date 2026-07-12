# Release Unit 文件范围矩阵

> 当前工作区是设计/本地验证用的最终态集合。发布时必须从上一 accepted head 逐单元重建，不能按整文件直接提交共享文件。

| Unit | 允许源码/配置 | 必须重建 | 明确禁止夹带 |
|---|---|---|---|
| F0a | `.github/workflows/test.yml`, `.nvmrc`, `package.json` 工具链字段/验证 scripts | 无生产主题 ZIP 上传 | 主题行为、Ghost/Cloudflare 配置 |
| F0b | `gulpfile.js`, `.gitignore`, package/ZIP validators, F0 workflow upload step | 版本化 ZIP（仅验证上传） | R1–R10 行为改动、自动激活 |
| R1 | `assets/js/main.js`; `assets/js/post.js` 中 sticky/table/TOC/PhotoSwipe；`partials/header.hbs` | `main.min.js(.map)`, `post.min.js(.map)`, ZIP | Ads、jQuery scope、Featured、SEO links |
| R2 | `assets/js/post.js` 中 Ads；`assets/css/blog/ads.css`; `partials/ads.hbs` | `post.min.js(.map)`, `screen.css(.map)`, ZIP | R1 交互、jQuery、SEO、Cloudflare |
| R3a | `default.hbs`：只把 jQuery 3.5.1/SRI 改为 3.7.1/SRI，保持全站 | ZIP | scope 收敛、其他主题改动 |
| R3b | `default.hbs`：jQuery + `home.min.js` 收敛到 home/paged/tag/author | ZIP | 版本升级与任何其他行为 |
| R4 | `partials/featured.hbs`：只改非首图 native `src/srcset/loading` | ZIP | 标题链接、ARIA、H1、字体 |
| R5a theme | G-010 批准的 LXGW package 选项、注释/fallback、旧 WOFF2 | `screen.css(.map)`, ZIP | Modern/Elegant owner、Site Injection、Prism、SEO |
| R5b theme | 经批准的 Modern/Elegant font classes/loading/CSS | `screen.css(.map)`, ZIP | Site Injection Save、Prism、SEO |
| R5c injection | 只删除已迁移且稳定的 Barlow/Alike links | N/A | 其他 Site Injection 内容 |
| R6 | Site/Post Injection 精确 allowlist 中的 Prism owner | N/A | Mermaid、KaTeX、MathJax、字体、Analytics |
| R7a | `partials/loop.hbs`, `partials/featured.hbs` 的标题/section/ARIA；`partials/pagination.hbs`; `assets/js/home.js`; `assets/css/misc/utils.css`; 已批准 H1 | `home.min.js(.map)`, `screen.css(.map)`, ZIP | 摘要、Ghost 内容、redirects |
| R7b | 已批准的首页摘要模板/CSS | 对应 built/maps/ZIP | R7a 其他语义、内容字段 |
| R7c | G-009 allowlist 中的单个 Ghost 字段批次 | N/A | 主题、redirects、Cloudflare |
| R8 | 精确 `redirects.yaml` 单元 | N/A | 内容、主题、Cloudflare redirects |
| R9 | 一条 Cache Rule 或严格同类组 | N/A | WAF/Rate Limit/Transform |
| R10 | 一条 WAF/Rate Limit/Transform 规则或严格同类组 | N/A | Cache Rules、DNS-only |

## 共享文件拆分要求

- `assets/js/post.js` 同时含 R1 与 R2：必须以 accepted predecessor 为基线按函数/hunk 重放，不能把当前整文件一次发布。
- `partials/featured.hbs` 同时含 R4 与 R7a：R4 只取图片加载 hunk，R7a 稳定后再取标题/ARIA hunk。
- built 文件和 Source Map 不手工拆；每个 Unit 从对应源码重新生成并与 git diff 一起提交。
- `default.hbs` 当前同时含 R3a/R3b 最终态：R3a 先保留全站 script，只改 URL/SRI；R3b 再移动到 helper block。
- evidence/spec/docs 可随对应 Unit 提交，但 docs/specs-only 不得触发候选上传，也不得进入 ZIP。
- 聚合语义校验器只能在其断言的最后一个功能 Unit 同时存在时启用；不得为了让早期 Unit 通过而放宽最终合同，也不得为了让聚合校验通过而提前夹带后续 Unit。
