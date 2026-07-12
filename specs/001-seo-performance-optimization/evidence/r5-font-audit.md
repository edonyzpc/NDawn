# R5 字体来源与打包审计

日期：2026-07-12  
状态：`OWNER DIRECTION APPROVED / ASSET TRACEABILITY PENDING / NOT IMPLEMENTED`

## 当前事实

| 项目 | 当前状态 | 影响 |
|---|---|---|
| Modern sans-serif | Site Header Injection 加载 Barlow 300/500/700；主题 CSS 用 `!important` 全局强制 Barlow | 当前视觉稳定，但 `@custom` 的其他选项被覆盖 |
| Elegant serif | Site Header Injection 无条件加载 Alike | 即使当前未选择也会发起字体样式请求；选择后仍可能被 Barlow 覆盖 |
| LXGW Bright | `package.json` 保留该选项；仓库有 3,862,040 bytes 的 Medium WOFF2 | 主题未生成对应 body class；ZIP 又排除 `assets/css/**`，所以当前选项不可可靠使用 |
| Ghost font variables | `--font-base` / `--font-heading` 已存在 | 被 `assets/css/misc/header-inject.css` 的全局 `!important` 规则压过 |

本地 WOFF2 SHA-256：`0b1523a8ca35401ba11e3cfc1a9218948a376f3049d3959005f4d647df9eec56`。仓库没有与该二进制绑定的版本记录或 OFL 文本，因此暂不把它加入发布包。

## 许可结论

LXGW Bright 官方仓库说明字体以 SIL Open Font License 1.1 发布，允许嵌入和再分发，但再分发仍须遵守 OFL；官方同时提供 WOFF2。许可允许自托管，发布包仍应附带对应 OFL 文本并记录所用 release/version 与 checksum。

## 推荐单候选

保留全部三个 `@custom` 选项，并把字体 owner 从 Site Header Injection 迁到主题：

1. `default.hbs` 为 title/body 分别生成 Modern、Elegant、LXGW class。
2. 只在当前选择需要时加载对应字体；Modern 使用 Barlow，Elegant 使用 Alike。
3. LXGW 只在选中时加载自托管 WOFF2，使用 `font-display: swap`；字体移到 ZIP allowlist 可包含的稳定路径，并随包附带 OFL。
4. 删除主题 CSS 中强制 Barlow 的 `!important` owner，改由上述 class/变量决定。
5. 主题候选稳定后，再单独批准删除 Site Header Injection 中的 Barlow/Alike links；删除前后都保存 predecessor。

该方案不会删除任何字体选项。当前仍选 Modern sans-serif 时，最终运行时只加载 Barlow，不再额外加载 Alike 或 LXGW。

## 已确认方向

- 2026-07-12 用户接受“主题成为字体唯一 owner”，并要求完整保留 Modern/Elegant/LXGW Bright 三个选项。

## 未解决的门

- 需要从官方 release 重新取得可追溯的 WOFF2 与 OFL，不能只依赖仓库内来源不明的旧文件。
- 需要分别预览 Modern/Elegant/LXGW 的中英文标题、正文、按钮、表格和 fallback。
- Site Header Injection 删除属于线上配置变更，必须在执行时单独批准。
