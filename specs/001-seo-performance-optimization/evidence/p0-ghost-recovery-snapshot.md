# P0 Ghost 恢复材料与全量 Injection 审计

日期：2026-07-12
状态：`RAW PRIVATE EXPORT COMPLETE / SANITIZED SUMMARY ONLY IN GIT`

## 原始材料

原始文件保存于被 `.gitignore` 排除的 `.private/seo-performance-recovery/2026-07-12/`，不会提交，也不复制会员、邮件、密钥或草稿正文到证据文档。

| 文件 | 大小 | SHA-256 |
|---|---:|---|
| `ghost-content-settings.json` | 9,881,779 bytes | `c320ff4e07ed3766dc3ee29f7db11aa466a29b008a4f9d8a08a178ef85e3c2cf` |
| `redirects.yaml` | 32 bytes | `18b94bfb3ab4d637ebb968cc9ab51fca8c6495893f82f09897d6e41239d77871` |
| `routes.yaml` | 708 bytes | `e58b72e003b8e2ea404265b51be5bc0cb520081a33caa10db24bbc0e02b0bb36` |

Ghost Export 标记版本 `6.51.1-rc.0`，包含 215 条 Post/Page 记录：210 published、5 draft；201 Post、14 Page。

## Site Injection

| Owner | 字符数 | Export SHA-256 | 已保存文本快照 |
|---|---:|---|---|
| Site Header | 1,936 | `ef32271e48cd67a5bd673e1e130e444d2e0c799e89a3a834e268e900e614ab77` | 与 `ghost-injection/site-header.html` 去掉文件末尾换行后逐字一致 |
| Site Footer | 3,149 | `dc53aaefff372bb76d8cf7030fa85722bc9279b15a788ca5695daf8f53117466` | 与 `ghost-injection/site-footer.html` 去掉文件末尾换行后逐字一致 |

## Page/Post Injection

- 非空记录：68；67 published、1 draft；65 Post、3 Page。
- jQuery 命中：**0**，覆盖 draft/private 原始记录后，R0 owner 门正式 Pass。
- Prism：59；Mermaid：4；MathJax：2；KaTeX：2。不同能力存在重叠，R6 只能清理 Prism 精确 allowlist，不能顺手删除 Mermaid/MathJax/KaTeX。
- 其余页面专用 Injection 保持原样；所有 predecessor 已包含在原始 Export 中。

## routes / redirects

- 当前 redirects 只有一条：`/author/:` → `/author/edony/`（301）。
- routes 含 `/rss/`、`/en/`、`/diary/`、`/bio/`、`/twitter/`、`/private/`、根 collection 与 `/go/`，以及 Tag/Author taxonomy。
- R8 必须以当前 redirects checksum 为 predecessor，不能覆盖既有 Author redirect。

旧主题 ZIP 按用户决定不下载；Ghost 已安装 predecessor 继续作为主题回退点。
