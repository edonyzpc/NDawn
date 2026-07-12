# G-009 正文 Image Card alt 第一批候选

日期：2026-07-12  
状态：`TWO LEXICAL TEXTS APPROVED / TWO LEGACY MOBILEDOC NO-OP APPROVED / NO GHOST CHANGE`

## Allowlist

只包含 Search Console 重点文章中的 4 张信息图片；图片已结合公开页面上下文和原图人工核对。

| URL | 存储格式 | 图片 | 当前值 | 建议 alt | 回滚值 |
|---|---|---|---|---|---|
| `/details-of-obsidian-ui/` | Mobiledoc | `2023/03/image.png` | alt 空；已有 caption `overview of Obsidian UI` | `Obsidian 桌面界面的 Ribbon、左右侧栏、编辑区、视图和状态栏标注` | 空 |
| `/details-of-obsidian-ui/` | Mobiledoc | `2023/03/image-1.png` | alt 空；已有 caption `workspace tree struct of Obsidian` | `Obsidian Workspace 树形结构：Left split、Root split、Right split、Tabs 与 Leaf` | 空 |
| `/ai-assistant-of-obsidian-based-on-qwen/` | Lexical | `2024/08/image-6.png` | 空 | `阿里云 DashScope API-KEY 管理页面，密钥内容已遮挡` | 空 |
| `/ai-assistant-of-obsidian-based-on-qwen/` | Lexical | `2024/08/image-7.png` | 空 | `Obsidian 社区插件设置中已启用 Terminal 插件` | 空 |

## Mobiledoc 风险与推荐

`/details-of-obsidian-ui/` 的 `lexical` 为空，正文仍保存为已弃用的 Mobiledoc；另一个候选页面已经是 Lexical。Ghost 官方说明当前编辑/API 以 Lexical 为正文格式，Mobiledoc 已被替代：

- https://docs.ghost.org/admin-api/posts/overview
- https://docs.ghost.org/changes#mobiledoc-deprecation

因此，在当前 Ghost 编辑器中仅为两张旧图片补 alt，也可能触发整篇文章从 Mobiledoc 转换为 Lexical。公开页面已经显示两条 caption，信息并未完全缺失。**推荐本轮只执行两张 Lexical 图片；Mobiledoc 两张记录为风险 No-op，未来若需要迁移整篇文章再单独设计、预览和回归。**

若用户仍选择处理 Mobiledoc 两张，必须把“整篇格式迁移”作为新的独立内容单元，而不能按普通 alt 字段小改执行。

## 边界

- 不修改文章 title、excerpt、Feature image alt、图片 caption、顺序或文件。
- 不处理其余 393 张空 alt 图片；装饰图继续为空，其余进入 backlog。
- 2026-07-12 用户已批准两张 Lexical 图片的精确文本；实际写入仍须等待 R7c 顺序门与执行批准。写入后检查公开 HTML、可访问名称、Sitemap/社交元数据不受影响，并保留空值回滚路径。
- 用户已批准两张 Mobiledoc 图片本轮 `No-op`；除非未来另立整篇格式迁移单元并重新批准，否则不得保存。
