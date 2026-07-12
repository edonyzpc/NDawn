# Ghost Image Card alt 审计

日期：2026-07-12
状态：`FULL EXPORT AUDIT / PRIORITY BATCH APPROVED / NO CONTENT CHANGE`

## Image Card alt 是什么

Ghost 编辑器正文中的每一个图片块叫 **Image Card**。它的 `alt`（alternative text）是图片无法被视觉读取时使用的替代说明：

- 屏幕阅读器用它向视障读者说明图片内容/用途。
- 搜索引擎用它理解图片与文章上下文，可能改善图片搜索与内容可理解性。
- 图片加载失败时，浏览器可以显示替代文字。

它不同于文章顶部的 **Feature image alt**：Feature image 是封面图；Image Card 是正文中的截图、照片、流程图等。

有信息价值的图片应写简短、具体、与上下文一致的描述，例如“Obsidian Local Graph 右键菜单中的筛选选项”。纯装饰图片应保留空 `alt`，避免屏幕阅读器朗读无意义内容。不能把文章标题批量复制成 alt，也不能堆砌关键词。

## 全量 Export 结果

| 项目 | 数量 |
|---|---:|
| 正文 `kg-image` Image Card | 400 |
| `alt` 为空 | 397 |
| 缺少 alt 属性 | 0 |
| 受影响内容记录 | 112（111 Post、1 Page，全部 published） |
| 已有非空 alt | 3 |

因此这不是 4 张图片的小修复，而是历史内容治理问题。自动为 397 张图生成文字会引入错误语义、关键词堆砌和维护成本，不应与主题发布混在一起。

## 推荐范围

1. 当前 R7c 继续保持小批次、逐字段批准。
2. 第一批只考虑 Search Console 重点文章中确有信息价值的正文图片；逐图给出原值、建议 alt、上下文与回滚文本。
3. 纯装饰图保持空 alt；无上下文无法判断的图片不改。
4. 其余 112 篇建立独立内容 SEO backlog，不阻断 R1–R8 的技术发布。

2026-07-12 用户批准上述范围：正文 Image Card alt 纳入第一批 G-009，但只处理重点文章中确有信息价值的图片；其余进入 backlog。本轮仍未修改任何 Ghost 内容，每张建议文本需在写入前单独审查。
