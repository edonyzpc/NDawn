# P0 离线恢复演练

日期：2026-07-12  
状态：`OFFLINE DRILL PASS / NO IMPORT / NO PRODUCTION CHANGE`

## 材料完整性

| 材料 | Bytes | SHA-256 | 校验 |
|---|---:|---|---|
| Ghost Content/Settings Export | 9,881,779 | `c320ff4e07ed3766dc3ee29f7db11aa466a29b008a4f9d8a08a178ef85e3c2cf` | JSON parse PASS；1 db、215 Post/Page、108 settings、1,285 custom theme settings、196 posts_meta |
| `routes.yaml` | 708 | `e58b72e003b8e2ea404265b51be5bc0cb520081a33caa10db24bbc0e02b0bb36` | 文件/checksum PASS |
| `redirects.yaml` | 32 | `18b94bfb3ab4d637ebb968cc9ab51fca8c6495893f82f09897d6e41239d77871` | 文件/checksum PASS |
| Site Header/Footer Injection | 仓库脱敏快照 | 见 `p1-owner-audit.md` | `validate-injection-snapshots.mjs` PASS |

原始文件只在 gitignored `.private/seo-performance-recovery/2026-07-12/`，不提交内容、账号或敏感配置。

## 演练恢复顺序

1. 主题回归：Ghost Dashboard 重新 Activate 已安装的直接 predecessor；不下载、删除或重新上传旧 ZIP。
2. 内容/设置灾难恢复：仅在真实事故且用户再次批准后，从 Ghost Labs 导入 Content/Settings Export。
3. 路由恢复：内容/设置确认后，再分别恢复 `routes.yaml` 与 `redirects.yaml`，避免用 P0 文件覆盖后续已接受配置。
4. Injection 恢复：按 Unit 的直接 predecessor/checksum 恢复 Site 或 Post/Page 字段；若后续 Unit 已叠加，使用 rollback-forward，不整体覆盖。
5. Cloudflare 恢复：按单条规则保存的 predecessor 恢复；Ghost Export 不包含 Cloudflare 状态。

本轮只验证文件可读、checksum、结构与恢复顺序，没有执行 Import/Upload/Activate/Save。真实写入演练会破坏生产状态，因此不是 P0 离线门的组成部分。

