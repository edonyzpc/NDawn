# R7 主题语义本地候选

日期：2026-07-12  
状态：`R7a + R7b ISOLATED LOCAL CANDIDATES / NOT RELEASED`

## R7a 独立本地候选

- 基线：R4 local commit `1362b72`；生产发布时必须在 R6 accepted head 上重建/核对。
- 分支/提交：`codex/r7a-home-semantics` / `0916c11 feat(seo): improve homepage heading semantics`。
- 首页 Cover 增加自然可见的 `@site.title` H1；不添加隐藏 H1 或重复元数据。
- 严格范围包含 H1、标题文字链接/唯一焦点、Featured/分页/轮播 ARIA 与对应 built；不含摘要、字体、Ghost 内容或 redirects。
- semantic validator、source/ZIP fatal GScan、allowlist/identity/唯一 ZIP、JS syntax、generated diff 与 `git diff --check` 均 PASS。
- 本地验证 ZIP：`ndawn-r7a-local`，SHA-256 `ee94bda711d5b8080027a2f03ebaf1027a81b372fb200a4c77459024f0773c21`；未上传。

## R7b 独立本地候选

- 基线：R7a local commit `0916c11`；生产发布时使用 R7a accepted head。
- 分支/提交：`codex/r7b-home-excerpts` / `112e320 feat(seo): add excerpts to latest homepage posts`。
- `{{#is "home"}}` + `{{#match @index "<" 5}}` 只为首页最新 5 篇输出 Ghost `{{excerpt}}`；该 helper 优先使用 custom excerpt、否则从正文生成纯文本。
- CSS 将摘要限制为两行；分页、Tag、Author 与首页第 6 篇以后保持紧凑标题列表。
- semantic validator、source/ZIP fatal GScan、allowlist/identity/唯一 ZIP、generated diff 与 `git diff --check` 均 PASS。
- 本地验证 ZIP：`ndawn-r7b-local`，SHA-256 `78909d3200abe26f48f23f9624653cdcb90c4a526fe2d65b75aa50e2bb8e1812`；未上传。

## 已实现

- 首页文章列表的标题是可见文字链接。
- Featured 卡片标题是可见文字链接。
- 整卡鼠标点击 overlay 保留，但设置 `aria-hidden="true"`、`tabindex="-1"`，每张卡只保留一个键盘焦点。
- Featured section 具备可访问名称；轮播前后按钮移除 `role="presentation"`，增加 `aria-label`、`aria-controls`，图标从辅助技术隐藏。
- 隐藏的 older-posts 链接具备 `aria-label`。
- Load more 明确为 `type="button"`；加载状态使用 `role="status"` 与 `aria-live="polite"`。
- 根模板、partials 与可选 members 模板禁止手写 canonical、description、OG、Twitter Card 或 JSON-LD；`ghost_head` / `ghost_foot` 各保留一次，SEO 元数据继续由 Ghost 唯一拥有。
- 自动语义检查会阻止标题文字链接、唯一焦点、Featured 原生图片、分页标签、Ads Slot 数量和 jQuery 范围回退。

## 尚未实现

- G-001 可见 H1：用户已接受并形成 R7a 独立本地候选，尚未发布。
- G-002 首页摘要：用户已接受并形成 R7b 独立本地候选，尚未发布；未与 H1 合并。
- 未上传或激活主题，尚无 Day 0、立即检查或 72 小时结果。

## 本地验证

- `node --check assets/js/home.js`：PASS
- semantic validator：PASS
- source/ZIP fatal GScan：PASS
- ZIP allowlist / identity / uniqueness：PASS
- R7a 本地 ZIP SHA-256：`ee94bda711d5b8080027a2f03ebaf1027a81b372fb200a4c77459024f0773c21`
