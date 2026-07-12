# P0 最终功能 Smoke

日期：2026-07-12  
状态：`CLOSED WITH TWO ACCEPTED EXTERNAL GAPS / NO CONFIG CHANGE`

## 已通过

### 公开技术面

`npm run smoke:public` 于 `2026-07-12T11:08:32Z` 重跑通过：

- Home、普通 Post、长文、图片 Post、代码 Post、Page、Paged、Tag、Author、Custom Narrow 共 10/10 HTTP 200；
- canonical、SEO metadata、robots、Sitemap、RSS 全部符合基线；
- 10/10 HTML 为 Cloudflare `DYNAMIC`，没有共享 HTML HIT；
- 当前 active theme 的 10/10 页面均保留一个 jQuery，符合 R3a/R3b 前 predecessor。

### Chrome Desktop / 当前付费会员

- Ghost Sodo Search：桌面按钮与 `⌘K` 均能打开；搜索“左耳进”返回准确文章、摘要与 URL。
- Portal Account：当前浏览器存在有效付费会员会话；账户面板、当前套餐、账单入口、邮件偏好与退出入口均能渲染。敏感账户信息不写入证据。
- Theme：Dark → Light 切换生效，并恢复到用户原 Dark 状态。
- 长文：唯一 H1、20 个 TOC link、2 个表格、5 张 Image Card、PhotoSwipe root、1 个 Ads container / 2 个 Slot、Ghost member comments 均存在。
- TOC：实际指针点击可打开并再次关闭，`toc-opened` 状态正确；无 Console error。
- Ads：两个 Slot 已实际渲染，其中一个展示真实广告；没有点击广告或外部链接。

### 隔离匿名移动端 / 平板

- 390×844：Login、Subscribe、Search 与 Burger 均存在；Burger 打开后显示 13 个导航链接，关闭后状态恢复。
- 匿名普通 Post：唯一 H1、Giscus section/script/frame、1 个 Ads container / 2 个 Slot 均存在；Ghost member comments 按匿名状态不输出；无 Console error。
- 768×1024：无水平溢出，Burger 与 Search 保持可用，Login/Subscribe 入口存在。
- Ghost Preview：既有专用未发布 Draft 的 Full 与 No-image 模板继续沿用 `custom-post-template-offline.md` 的 PASS；未发布、未删除。

### Safari Desktop

- 首页、主导航、会员入口与文章页均正常渲染。
- Search：实际点击后搜索“左耳进”，返回准确文章与摘要。
- 文章页：唯一 H1、TOC button、广告容器、会员评论与相关文章均正常渲染。
- TOC：实际点击后右侧目录面板打开；测试结束后只关闭本轮新建的 Safari 标签页，保留用户原有 Start Page。

### Safari Responsive

- Safari Responsive Design Mode 使用精确自定义视口完成 390×844 与 768×1024 实机引擎核对。
- 两个尺寸均保留 Logo、Search、Burger、唯一 H1、摘要、Feature image 与正文，未见横向溢出或内容截断。
- 390×844 实际点击 Search 后弹层遮罩被触发；搜索结果准确性由 Safari Desktop 同轮查询覆盖。
- 退出 Responsive Design Mode 后只关闭本轮新建的测试标签页，未改变 Safari 持久配置。

### PhotoSwipe

- Safari 在 `/sightseeing-of-singapore/` 正文图库中点击首张图片后，PhotoSwipe 灯箱显示 `1 / 5`，并提供 Close、Fullscreen、Zoom、Previous、Next 控件。
- 点击 Next 后计数变为 `2 / 5`；随后使用 Close 正常退出灯箱。
- 交互通过正文图库 image 元素触发，没有点击广告、外链或坐标猜测区域。

### 匿名订阅入口

- Safari Private Browsing 确认匿名首页显示 Login/Subscribe；点击 Subscribe 后 Portal 正常展示 Free 与 Member（月付/年付）方案、姓名/邮箱字段和登录入口。
- 没有填写姓名/邮箱：继续 Free 或 Member 会把测试身份数据传给 Ghost，并可能创建会员记录；该动作不属于纯只读 Smoke，需专用测试身份与单独授权。

## 现有基线缺陷与计划归属

- 当前生产 Burger 是可点击的 `div`，缺少 button/accessible name/expanded 状态。功能可用但键盘与辅助技术语义不足；R1 commit `0e72467` 已把它改为带 `aria-label`、`aria-controls`、`aria-expanded` 的真实 button。
- 当前生产 TOC button 同样缺少 expanded/controls 语义；R1 已补齐并增加 Escape 关闭。

这些是 predecessor 的已知问题，不在 P0 中顺手线上修改；由 R1 独立发布和回滚。

## 已接受外部缺口

1. **Checkout**：当前 Chrome 是已有付费订阅，直接“更改”可能影响真实订阅；Safari 私密匿名 Portal 已可安全读取，但进入 Member Checkout 前必须提交姓名/邮箱并可能创建会员记录。因此没有创建 Checkout Session，更没有付款。2026-07-12 用户明确接受为外部缺口。
2. **免费会员**：匿名、付费会员与匿名 Free 方案入口已覆盖；创建/登录独立免费会员仍需要专用测试身份。2026-07-12 用户明确接受为外部缺口。

两项只作为 P0 入口例外，不计为功能 Pass，也不豁免 R9 的匿名/免费/付费缓存隔离硬门。

## 结论

公开正确性、Chrome/Safari 桌面核心功能、Chrome/Safari 移动与平板、PhotoSwipe、付费账户、匿名 Portal/评论和广告均通过。Checkout 与免费会员没有被伪记为 Pass，而是按 D-031 作为用户明确接受的外部缺口；因此 T024/P0 以 `Closed with accepted external gaps` 关闭。全程没有保存 Ghost、GA4、Cloudflare 或会员配置，也没有创建测试会员或 Checkout Session。
