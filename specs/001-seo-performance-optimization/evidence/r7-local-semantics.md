# R7 主题语义本地候选

日期：2026-07-12  
状态：`LOCAL PASS / VISUAL GATES PENDING / NOT RELEASED`

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

- G-001 可见 H1：等待用户在 A/B 预览后决定。
- G-002 首页摘要：等待用户决定；不会与 H1 合并成一个发布单元。
- 未上传或激活主题，尚无 Day 0、立即检查或 72 小时结果。

## 本地验证

- `node --check assets/js/home.js`：PASS
- semantic validator：PASS
- source/ZIP fatal GScan：PASS
- ZIP allowlist / identity / uniqueness：PASS
- 当前本地 ZIP SHA-256：`5b621cab988e6d9b43b22ab1db86ee057fb96be516b9e41b874ed3884a4c2b1c`
