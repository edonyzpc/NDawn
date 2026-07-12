# 可重复公开面 Smoke

日期：2026-07-12  
脚本：`scripts/smoke/check-public-site.mjs`  
本次模式：`EXPECT_CONTENT_JQUERY=present`（当前 active theme 3.5.1 全站基线）

## 本次结果

- 固定 10 个页面全部 HTTP 200。
- 10/10 均且仅有一个 canonical，且与最终 URL origin/path 自洽。
- 10/10 均无意外 `noindex`。
- 10/10 Cloudflare HTML 均为 `DYNAMIC`，无 `HIT/STALE/UPDATING`。
- 当前 active theme 基线下 10/10 均有且仅有一个 jQuery script。
- `/robots.txt`：200，包含 `search=yes`、`ai-train=no`、`use=reference` 与 canonical Sitemap URL。
- `/sitemap.xml`：200，包含 Pages、Posts、Authors、Tags 四个 child sitemap。
- `/rss/`：200，返回 RSS XML。

## 固定页面

Home、普通 Post、长文、图片 Post、代码 Post、Page、Paged、Tag、Author、Custom Narrow。

Custom Full 与 Custom No-image 因没有公开样本，不在脚本中虚构 URL；由 `custom-post-template-offline.md` 和待批准的未发布 Preview 补充。

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
