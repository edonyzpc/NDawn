# R9 Cloudflare Cache 只读验证

日期：2026-07-12  
状态：`READ-ONLY / PRE-P5 / NO CONFIG CHANGE`

## 结果

### HTML

`GET https://www.edony.ink/`

- HTTP 200
- `cf-cache-status: DYNAMIC`
- `cache-control: public, max-age=0`
- `vary: Cookie, Accept-Encoding`
- 无 Cloudflare 共享 HTML HIT

响应同时存在 `age`、`x-cache` 与 `ghost-fastly`，它们来自 Ghost/Fastly 上游；不能把上游 Age 误判成 Cloudflare 缓存 HTML。Cloudflare 的直接状态仍是 `DYNAMIC`。

### Theme static asset

激活 `ndawn-dbc1e7b189ee` 后，公开 HTML 的当前版本键为 `v=363f476934`：

- `screen.css?v=363f476934`
- `main.min.js?v=363f476934`
- `home.min.js?v=363f476934`

连续两次 `GET /assets/built/screen.css?v=363f476934`：

- HTTP 200
- `cf-cache-status: HIT`
- `age: 8968` → `8969`
- `cache-control: public, max-age=31536000`
- `etag`、`last-modified` 均存在
- 新主题版本键与旧基线不同，且新键已稳定 HIT；本次激活无需全局 Purge，query version 已承担 cache busting

现有 `Ghost Static Assets` 规则正在产生有效 HIT，不应删除或替换为 HTML Cache Everything。

### Legacy www image path

`GET /content/images/size/w400/format/webp/...`

- 首次：301 到 `storage.ghost.io/...`，Cloudflare `MISS`
- 第二次：同一 301 为 Cloudflare `HIT`，`age: 12`
- 实际 Ghost Storage 图片：HTTP 200、WebP、`cache-control: public, max-age=31536000`、Fastly `HIT`、`age: 267854`

当前页面的实际图片 URL 主要直接指向 `storage.ghost.io`；`Ghost Images` Cache Rule 主要覆盖旧的 `www/content/images/**` 跳转，不控制 Ghost Storage CDN 本体。规则无明显性能风险，也保留旧 URL 能力。

## R9 预备结论

在 P5 与三身份 A→B→C→A 完成前，不执行任何 Cache Rule 变更。当前最合理候选是：

1. `Ghost Static Assets`：接受现状。
2. `Ghost Images`：接受为 legacy redirect cache，不扩大范围。
3. `Ghost Admin Bypass`：保留。
4. 不新增 HTML cache，不启用 Cache Everything。

若后续 A→B→C→A、精确 Purge 与静态更新验证均通过，R9 可记录 `No-op/Complete`，无需为了“优化”而制造规则变更。

## 未完成

- 匿名/免费/付费独立 profile 的 A→B→C→A。
- 精确 Purge 的真实执行演练；当前新版本键已自动隔离旧缓存，因此不为演练而 Purge。
- R9 正式依赖 P5；本文件不能提前关闭 R9。
