# 可重复公开面 Smoke

日期：2026-07-12 16:59（Asia/Singapore）
脚本：`scripts/smoke/check-public-site.mjs`
本次模式：默认只读检查；当前 active theme 实测 jQuery 3.5.1 全站基线

## 本次结果

- 固定 10 个页面全部 HTTP 200。
- 10/10 均且仅有一个 canonical，且与最终 URL origin/path 自洽。
- 10/10 均无意外 `noindex`。
- Home、Post、Page、Tag、Author 与 Custom Narrow 各有且仅有一组 description、`og:url`、X Card、JSON-LD；`/page/2/` 按 Ghost 当前输出仅要求 canonical，不伪造社交/结构化元数据。
- 10/10 Cloudflare HTML 均为 `DYNAMIC`，无 `HIT/STALE/UPDATING`。
- 当前 active theme 基线下 10/10 均有且仅有一个 jQuery script。
- `/robots.txt`：200，包含 `search=yes`、`ai-train=no`、`use=reference` 与 canonical Sitemap URL。
- `/sitemap.xml`：200，包含 Pages、Posts、Authors、Tags 四个 child sitemap。
- `/rss/`：200，返回 RSS XML。
- 首页响应头：`cache-control: public, max-age=0`、`vary: Cookie, Accept-Encoding`、`cf-cache-status: DYNAMIC`、`strict-transport-security: max-age=15552000`；Ghost/Fastly 的 `x-cache` 不作为 Cloudflare Edge HIT。

2026-07-12 19:08 SGT 再次运行同一脚本：10/10 页面、robots、Sitemap、RSS、canonical、metadata、HTML `DYNAMIC` 与 predecessor jQuery 范围再次全部 PASS；完整输出结论归档于 `p0-functional-smoke.md`。

## 图片 alt 基线

- Theme UI 图片已有可读 alt：站点 Logo 与 Cover 均为 `Shadow Walker 松烟阁`，ForeverBlog 标记为 `foreverblog`。
- 代表性图片文章 `/touring-to-japan-osaka/` 的正文 5 张 Ghost Image Card 均存在 `alt` 属性但值为空；这是内容数据缺口，不由主题猜测图片语义。
- 后续内容 SEO 单元只能在 Ghost Export/文章上下文确认后逐篇补写，不把空 alt 当成主题模板回归，也不批量自动生成描述。

## 固定页面

Home、普通 Post、长文、图片 Post、代码 Post、Page、Paged、Tag、Author、Custom Narrow。

Custom Full 与 Custom No-image 因没有公开样本，不在脚本中虚构 URL；已由 `custom-post-template-offline.md` 记录的同一专用未发布 Draft Preview 补充。

## 使用方式

当前生产基线：

```text
EXPECT_CONTENT_JQUERY=present yarn smoke:public
```

R3b 激活后：

```text
EXPECT_CONTENT_JQUERY=absent yarn smoke:public
```

第二种模式要求 Home/Paged/Tag/Author 仍各有一个 jQuery，而 Post/Page/Custom Narrow 为零，可直接证明 scope 是否按计划收敛。
