# P0 Lighthouse 性能基线

日期：2026-07-12
状态：`60 COMPLETE RUNS / BASELINE PASS / TARGET NOT YET MET`

## 协议与原始材料

- Lighthouse 13.4.0、Chrome 150.0.7871.115、Node 22.22.3。
- 3 个核心 URL × Mobile/Desktop × Cold/Warm × 5 次中位数 = 60 个完整有效样本。
- 6 个报告出现 `Results may be incomplete`，保留在私有原始目录但从统计排除，并补跑 6 个无警告样本替换。
- 原始 JSON、瀑布、主线程、LCP breakdown 和合并 summary 保存于 gitignored `.private/perf/p0-2026-07-12-final/`；仓库只提交本脱敏汇总。
- 60/60 最终样本无 runtime failure；所有组合 Console error 最大值为 0。

## 中位数

| Form | Cache | URL | Score | LCP | CLS | TBT | FCP | Transfer | Requests |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|
| Mobile | Cold | Home | 92 | 2,670ms | 0 | 103ms | 2,275ms | 1.54MB | 54 |
| Mobile | Warm | Home | 100 | 1,016ms | 0.0016 | 5ms | 918ms | 28KB | 49 |
| Mobile | Cold | Post | 89 | 2,686ms | 0 | 135ms | 2,451ms | 1.87MB | 88 |
| Mobile | Warm | Post | 100 | 1,011ms | 0.0026 | 26ms | 947ms | 140KB | 84 |
| Mobile | Cold | Long Post | 83 | 2,723ms | 0 | 289ms | 2,249ms | 4.39MB | 106 |
| Mobile | Warm | Long Post | 98 | 1,083ms | 0.0013 | 168ms | 1,071ms | 160KB | 100 |
| Desktop | Cold | Home | 91 | 1,523ms | 0.0006 | 0ms | 965ms | 1.72MB | 56 |
| Desktop | Warm | Home | 100 | 283ms | 0.0006 | 0ms | 257ms | 28KB | 52 |
| Desktop | Cold | Post | 96 | 970ms | 0.0019 | 0ms | 905ms | 1.87MB | 86 |
| Desktop | Warm | Post | 100 | 292ms | 0.0020 | 0ms | 257ms | 173KB | 82 |
| Desktop | Cold | Long Post | 95 | 1,024ms | 0.0009 | 0ms | 838ms | 4.38MB | 104 |
| Desktop | Warm | Long Post | 100 | 283ms | 0.0010 | 0ms | 258ms | 164KB | 101 |

## LCP 元素

- Home：首个 Featured 卡片图片 `在乌龟追上来之前`，已是 `loading=eager` + `fetchpriority=high`。
- 普通 Post：Feature image `为什么偏偏是“左耳进，右耳出”`，已是 eager/high。
- Long Post：可见文字 `.single-excerpt`，不是图片。

## 结论

1. 移动端冷缓存三页 LCP 均略高于 2.5s，当前阶段目标未达到；差距约 170–223ms。
2. 热缓存 LCP 约 1.0s，说明重复访问缓存有效，主要问题是首次加载链与第三方/内容资源，而不是 Cloudflare 静态缓存失效。
3. Long Post 冷缓存 4.39MB、106 requests、TBT 289ms，是当前最重页面；图片、Code Card 与历史 Injection 必须保持独立优化归因。
4. Home 实验室 LCP 是首个 Featured 图片；R4 仅修改非首图，因此必须用同协议比较，不能预先宣称会改善 LCP。
5. 所有后续 Unit 使用同版本、同矩阵与前一 accepted 版本比较，适用 G-007 `max(10%, 250ms)` LCP 回退线和 CLS +0.02 回退线。
