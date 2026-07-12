# Custom Post 模板离线契约

日期：2026-07-12  
状态：`OFFLINE STRUCTURAL PASS / UNPUBLISHED GHOST PREVIEW APPROVED`

当前公开 Content API 只找到使用 `custom-narrow-feature-image` 的文章；没有可作为 full/no-image 生产样本的公开 URL。未创建、修改或发布测试文章。

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

## 已确认验证方式

2026-07-12 用户允许创建一个不发布的临时 Draft，依次切换 Custom Full 与 Custom No-image 做真实 Ghost Preview；Draft 保留、不公开、不删除。创建 Draft 属于后续 Ghost 写入步骤，执行时只使用该专用草稿，不修改现有公开文章。
