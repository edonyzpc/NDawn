# Google Search Console 基线与 G-009/R8 入口

日期：2026-07-12  
Property：`sc-domain:edony.ink`  
状态：`READ-ONLY AUDIT / FULL GHOST EXPORT CORRELATED / NO GSC WRITE / NO CONTENT CHANGE`

## Performance 基线

| 窗口 | Clicks | Impressions | CTR | Average position |
|---|---:|---:|---:|---:|
| 28 天（2026-06-13–2026-07-10） | 79 | 19,135 | 0.4% | 20.2 |
| 3 个月（2026-04-11–2026-07-10） | 300 | 51,517 | 0.6% | 13.3 |

28 天 Top pages：

| URL | Clicks | Impressions | CTR | Position | 初步判定 |
|---|---:|---:|---:|---:|---|
| `/obsidian-ai-assistant-powered-by-rag-knowledge-base/` | 14 | 545 | 2.6% | 9.0 | 保护现状，不做无证据改写 |
| `/obsidian-fonts-with-css/` | 8 | 349 | 2.3% | 11.6 | 保护现状 |
| `/go-mod-upgrade/` | 5 | 697 | 0.7% | 26.4 | 排名仍低，不能只靠改 snippet 推断收益 |
| `/deep-insight-of-langgraph-and-bsp-model-in-agent-developing/` | 5 | 358 | 1.4% | 20.1 | 同时保留为性能长文基线 |
| `/go-source-code-audit/` | 4 | 632 | 0.6% | 15.5 | G-009 元数据审计候选；最近一周 impressions 异常增长 2,124% |
| `/self-hosting-personal-memos-services/` | 4 | 223 | 1.8% | 19.9 | 暂不改 |
| `/customize-memos-webhook-service-with-cf-worker/` | 4 | 90 | 4.4% | 12.7 | 健康，保护现状 |
| `/details-of-obsidian-ui/` | 3 | 234 | 1.3% | 9.3 | G-009 元数据审计候选 |
| `/ai-assistant-of-obsidian-based-on-qwen/` | 3 | 165 | 1.8% | 10.5 | 次级候选 |
| `/word-counter-tool-prototype/` | 3 | 84 | 3.6% | 12.6 | 健康，保护现状 |

`/details-of-obsidian-ui/` 的可见查询样本只有 19/234 impressions（其余受隐私阈值隐藏）；不能仅按三个可见查询批量重写。`/go-source-code-audit/` 的查询表完全隐藏，因此也必须先读取当前 Ghost title/meta 和内容意图，再提出逐字段 diff。

## G-009 公开字段预审

| URL | 当前 title | Title 长度 | 当前 description 长度 | 正文 Image Card 空 alt | 预审结论 |
|---|---|---:|---:|---:|---|
| `/go-source-code-audit/` | `go 代码安全审计` | 9 | 188 | 0 | Export 确认 `meta_title` 为空，188 字 `custom_excerpt` 与 `meta_description` 相同；只改 `meta_description` 的 82 字精确文本已批准，写入待 R7c 执行批准 |
| `/details-of-obsidian-ui/` | `Obsidian UI 技术原理` | 16 | 94 | 2 | Title/description 已准确，不因 CTR 单独改写；正文图片 alt 属于独立内容数据缺口 |
| `/ai-assistant-of-obsidian-based-on-qwen/` | `在Obsidian搭建通义千问AI助手` | 19 | 164 | 2 | Export 确认 `meta_title` 为空、`custom_excerpt` 与 `meta_description` 相同；Title 保护现状，description/正文图片另行决策 |

三篇均已有唯一 H1、canonical、OG/X 与 JSON-LD。Export 已确认字段 owner：三篇 `meta_title` 均为空；`details-of-obsidian-ui` 的 `meta_description` 为空并由 94 字 `custom_excerpt` 提供摘要，另两篇的 `custom_excerpt` 与 `meta_description` 内容相同。T130 仍需在实际修改前逐字段保存 predecessor 文本。

发现的 4 个空 alt 来自正文 Image Card。用户已批准 2 张 Lexical 图片的精确文本；另 2 张位于旧 Mobiledoc 文章，保存可能触发整篇格式迁移，用户已批准本轮 `No-op`。Spec 仍禁止自动套用文章标题或批量生成。

Top 10 页面 Feature image 的 Ghost alt 字段也均为空，但当前文章页模板会回退到文章标题，并非公开空 alt。`g009-top-pages-feature-image-audit.md` 已逐图分类：4 张主题插图的精确文本已批准，6 张通用素材保护现状；实际写入仍等待 R7c 执行批准。装饰图输出空 alt 涉及全站模板 fallback 与未审计存量图片，暂不改。

## Indexing 基线

- Last update：2026-06-30。
- Indexed：465。
- Not indexed：181 / 7 reasons。
- Crawled - currently not indexed：140。
- Discovered - currently not indexed：19。
- Page with redirect：14。
- Not found (404)：3。
- Alternate page with proper canonical：3。
- Blog property 中显示的单条 5xx 来自 `uptime.edony.ink`，单条 other-4xx 来自 `wormhole.edony.ink/cdn-cgi/zaraz/...`；均不属于 `www.edony.ink` 博客 Host。这证明 domain property 会混入子域，不能直接作为博客 G-007 5xx 硬门。

## R8 404 审计

| GSC URL | 证据 | 当前结论 |
|---|---|---|
| `https://www.edony.ink/site` | 2026-06-25 crawl；全量 Export 未发现指向该精确 URL 的正文链接，也没有明确 successor | `No-op` 候选，不建立猜测性映射 |
| `https://www.edony.ink/my-pkm/，` | 正确 `/my-pkm/` 存在；全量 Export 未发现带中文逗号或其编码形式的来源，只有一条正常 `/my-pkm/` 链接 | `No-op` 候选，不为无法复现的标点 URL 建永久 redirect |
| `https://edony.ink/D` | `/ghost-blog-structuration/` 正文把 `/A`–`/D` 当路由示例；不是已删除真实内容 | 明确 No-op，不创建误导 redirect |

当前没有足够证据发布 `redirects.yaml`。用户已批准 R8 三个 URL 全部 `No-op`；按任务依赖在 R7c 关闭后正式记录退出，不得用“减少 404 数量”作为无依据映射理由。

## 下一步边界

1. G-009 已批准的 7 项精确文本仍按单个字段批次保存 before/after 与回滚值，并在 R7c 顺序门请求执行批准。
2. 正文 Image Card alt 第一批只执行 2 张 Lexical 图片；2 张 Mobiledoc 图片已批准风险 `No-op`。
3. Feature image alt 第一批按 `g009-top-pages-feature-image-audit.md` 的 4 个精确文本请求批准；不改模板 fallback。
4. R8 已批准 `No-op`；Search Console 不执行 Validate fix、Request indexing、Sitemap submit 或 Removals。
