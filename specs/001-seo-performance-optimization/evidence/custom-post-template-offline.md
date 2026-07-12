# Custom Post 模板契约与 Ghost Preview

日期：2026-07-12  
状态：`OFFLINE STRUCTURAL PASS / UNPUBLISHED GHOST PREVIEW PASS`

当前公开 Content API 只找到使用 `custom-narrow-feature-image` 的文章；没有可作为 full/no-image 生产样本的公开 URL。为补齐真实模板覆盖，已按用户批准创建一个专用 Ghost Draft；未修改任何既有文章。

## 已验证契约

| 模板 | 内容契约 | Ads | Related | Comments |
|---|---|---:|---:|---:|
| `custom-full-feature-image.hbs` | `content width="full"` | 1 个 partial / 2 个 Slot | 1 | 1 |
| `custom-narrow-feature-image.hbs` | `content width="narrow"` | 1 个 partial / 2 个 Slot | 1 | 1 |
| `custom-no-feature-image.hbs` | `content no_image=true` | 1 个 partial / 2 个 Slot | 1 | 1 |

共同 `content` partial 同时满足：

- `no_image` 分支抑制 Feature image；
- full/narrow 通过 `kg-width-{{width}}` 保持版式差异；
- Feature image alt 优先使用 `feature_image_alt`，缺失时回退文章标题；
- 四个 Post-family 模板统一使用同一个 Ads partial，避免 Slot 配置漂移。

## Ghost 未发布 Preview 结果

2026-07-12 使用标题 `NDawn 模板验收草稿（请勿发布）` 创建一个专用 Draft，并依次验证：

1. 选择 `Full Feature Image`，Web Preview 正常显示站点导航、日期/阅读时长、唯一文章 H1、摘要、三段正文、作者与分享区域；未添加 Feature image，页面按无图输入正常降级。
2. 切换 `No Feature Image`，Web Preview 的 DOM 正常包含导航、唯一文章 H1、摘要、正文、作者、分享、Advertisement region 与页脚；未出现缺图占位或模板错误。
3. 草稿保存状态为 `Draft - Saved`，最终保留模板为 `No Feature Image`；未点击 Publish、Delete 或 Add feature image。

结论：Full 与 No-image 两个真实 Ghost 模板入口均可渲染；该结果只关闭模板可达性与无图降级验证，不替代正式发布单元的三设备、账号状态、Console、Network 与 72h 检查。
