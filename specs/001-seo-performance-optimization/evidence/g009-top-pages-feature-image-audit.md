# G-009 Search Console Top pages Feature image alt 审计

日期：2026-07-12
状态：`FOUR EXACT TEXTS APPROVED / EXECUTION PENDING / NO GHOST CHANGE`

## 当前渲染行为

- Search Console 28 天 Top 10 页面在 Ghost 中的 `feature_image_alt` 均为空。
- 文章页模板在该字段为空时使用文章标题作为 Feature image 的 `alt`，因此公开页面不是“空 alt”，但标题通常不能准确描述图片。
- 首页 Featured 卡片始终使用文章标题作为 `alt`。
- 本轮不修改模板 fallback：若直接把所有缺失字段渲染为空，会让未审计的有意义图片失去可访问名称。

## Top 10 审计

| URL | 图片内容 | 判定 | 建议 |
|---|---|---|---|
| `/obsidian-ai-assistant-powered-by-rag-knowledge-base/` | Obsidian 笔记本电脑中的机器人、文档和知识图标 | 有信息价值的主题插图 | 候选：`Obsidian 笔记本电脑中的 AI 助手与知识库文档图标` |
| `/obsidian-fonts-with-css/` | 字体字样的通用素材图 | 装饰性素材 | 不写字段，保护现状 |
| `/go-mod-upgrade/` | 多屏工作站的通用素材图 | 与正文意图关系弱 | 不写字段，保护现状 |
| `/deep-insight-of-langgraph-and-bsp-model-in-agent-developing/` | 人物观察发光的节点网络与齿轮 | 有信息价值的主题插图 | 候选：`人物观察由节点、连线和齿轮组成的智能体工作流` |
| `/go-source-code-audit/` | 放大镜下的代码与红色警告标志 | 有信息价值的主题插图 | 候选：`放大镜下的代码与红色安全警告标志` |
| `/self-hosting-personal-memos-services/` | 人物在代码显示器后比出手势 | 装饰性素材 | 不写字段，保护现状 |
| `/customize-memos-webhook-service-with-cf-worker/` | 网络设备和多根数据线 | 通用素材，标题已提供上下文 | 不写字段，保护现状 |
| `/details-of-obsidian-ui/` | 人物绘制界面线框图 | 装饰性素材 | 不写字段，保护现状 |
| `/ai-assistant-of-obsidian-based-on-qwen/` | 机器人头像插图 | 有信息价值的主题插图 | 候选：`通义千问 Obsidian AI 助手的机器人形象` |
| `/word-counter-tool-prototype/` | 显示折线图的电脑屏幕 | 装饰性素材 | 不写字段，保护现状 |

## 建议发布批次

只为上表 4 张明确有信息价值的主题插图写入 Feature image alt；其余 6 张保持 Ghost 字段为空，不将通用素材的视觉细节强行加入搜索语义。

该批次与正文 Image Card alt 分开审批、分开写入、分开回滚。写入前保存 4 个字段的空值 predecessor；写入后核对文章页公开 HTML、首页 Featured 卡片行为、canonical、OG/X 与 JSON-LD 未发生非预期变化。

2026-07-12 用户已批准上表 4 个候选的精确文本；实际 Ghost 写入仍须等待 R7c 顺序门与执行批准。

## 暂不做的模板决策

若希望装饰性 Feature image 真正输出 `alt=""`，需要改变主题 fallback 规则。但 Ghost 空值同时包含“装饰图”和“尚未审计的有意义图片”，当前无法安全区分，因此不纳入本批次。
