# R5b/R5c Modern 与 Elegant 字体 owner 方案

日期：2026-07-12  
状态：`OPTION A APPROVED / R5B LOCAL CANDIDATE READY / NO ONLINE CHANGE`

## 当前事实

- `title_font`、`body_font` 是主题 `package.json` 的 select custom settings；`default.hbs` 用 `@custom` 添加 `has-serif-title/body` class。
- 公开首页没有 Ghost native `--gh-font-heading/body` 或 Bunny Fonts 输出；当前字体只来自 Site Header 的 Google Fonts Barlow + Alike。
- 主题 `header-inject.css` 对 body/headings 强制 Barlow `!important`，导致 Elegant class 无法可靠生效。
- 当前 Modern/Modern 仍无条件声明 Alike；这是可删除的首屏第三方请求。

Ghost 官方文档确认 custom settings 应通过 `@custom`/`match` 控制主题行为，原生 Custom Fonts 若启用则由 `ghost_head` 注入字体与 `--gh-font-*` 变量；本博客当前没有该输出：

- https://docs.ghost.org/themes/custom-settings
- https://docs.ghost.org/themes/helpers/functional/match

## A：主题条件加载 Google Fonts（推荐）

R5b theme：

1. Barlow 继续作为 UI 与 Modern 默认字体，保持当前视觉与现有 300/500/700 + italic 字重范围。
2. 只有 title 或 body 选择 Elegant 时，才在同一个 Google Fonts stylesheet 中同时请求 Barlow + Alike；Modern/Modern 只请求 Barlow。
3. 移除 body/headings 的无条件 Barlow `!important`，让 `has-serif-title/body` 真正使用 Alike；菜单等 UI 继续 Barlow。
4. 保留系统 sans/serif fallback；不引入新二进制。

R5c Site Header：R5b 激活并通过视觉/Network 后，单独删除现有 Barlow/Alike preconnect/preload/noscript，其他 Prism shim、GA4、Bing 验证全部保持原样。

收益：当前 Modern/Modern 从两条字体 stylesheet 降为一条，Elegant 恢复可用；第三方 Google Fonts 依赖仍保留。

## B：全部使用系统字体

删除 Google Fonts，Modern 使用系统 sans，Elegant 使用系统 serif。网络收益最大，但当前 Barlow 视觉会明显变化，不推荐在本轮低风险优化中采用。

## C：自托管 Barlow/Alike

可移除第三方字体连接并稳定缓存，但需要 OFL、子集、字重、CJK fallback、ZIP 体积与更新责任的独立审计；工作量和维护成本最高，建议另立后续候选。

## 推荐决策

2026-07-12 用户批准方案 A，并严格拆成 R5b theme 与 R5c Site Header 两个发布单元。任何线上 Save/上传/激活仍需在对应门单独批准。

## R5b 本地候选

- commit：`3cb1791 fix(fonts): restore theme font selection`
- 主题 identity：`ndawn-r5b-3cb1791`
- ZIP SHA-256：`f6e396337efba8a852c5e30443d57803eca48d070636457251cd6b8a09a84b6d`
- 变更边界：`default.hbs`、字体变量/覆盖 CSS 与生成的 `screen.css(.map)`，不含 Site Header Injection。
- 验证：GScan fatal、确定性 ZIP 边界、Modern/Modern、Elegant title、Elegant body、Elegant both 四组合浏览器 computed font 均通过；Barlow 与 Alike 均成功加载。
- 线上状态：未 push、未上传、未激活；R5c 未执行。
