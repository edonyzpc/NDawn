# AdSense 博客基线与 G-003

日期：2026-07-12
状态：`READ-ONLY BASELINE COMPLETE / G-003 CONFIRMED`
范围：仅 `www.edony.ink`；不混入 `twitter.edony.ink`、`memos.edony.ink`。

## 网站维度基线

| 窗口 | 收入 | Page views | Page RPM | Ad impressions | Impression RPM | Active View | Clicks | Impressions / 100 PV |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 2026-07-05–07-11（近 7 天） | US$0.04 | 163 | US$0.22 | 43 | US$0.85 | 55.81% | 1 | 26.38 |
| 2026-06-28–07-04（前 7 天） | US$0.00 | 217 | US$0.01 | 13 | US$0.10 | 61.54% | 0 | 5.99 |
| 2026-06-14–07-11（近 28 天） | US$0.05 | 716 | US$0.08 | 118 | US$0.47 | 45.76% | 1 | 16.48 |
| 2026-05-17–06-13（前 28 天） | US$0.08 | 1,267 | US$0.06 | 264 | US$0.30 | 30.42% | 0 | 20.84 |

AdSense 首页卡片与 Sites 报告存在估算/账号范围差异；G-003 统一以 Sites 报告的 `www.edony.ink` 行为准，不使用账号总计或首页四舍五入值。

## 当前解读

- 近 28 天 Page views 比前 28 天下降 43.5%，总收入下降不能直接归因于广告加载策略。
- 同期 Page RPM 从 US$0.06 升至 US$0.08，Impression RPM 从 US$0.30 升至 US$0.47。
- Impressions / 100 PV 从 20.84 降至 16.48，下降约 20.9%；但 RPM 同时上升，当前数据不支持仅凭单指标回滚。
- 近 7 天只有 43 次展示，波动很大，只适合发现广告不显示、重复请求或布局异常，不适合判断收益趋势。

## G-003 已确认门

1. **Day 7 早期观察**：当前与对照窗口各至少 100 Page views 且 20 Ad impressions；否则记 `Insufficient`，不据此回滚。
2. **Day 14 趋势观察**：沿用同口径，重点排查展示密度、Active View、设备结构与异常页面；不单独用总收入作结论。
3. **Day 28 收益结论**：当前与对照窗口各至少 500 Page views 且 100 Ad impressions，才允许 `Met/Unmet`；否则记 `Insufficient`。
4. **收益回滚候选**：样本充足时，`Impressions / 100 PV` 与 `Page RPM` **同时**比同长度 predecessor 窗口下降超过 20%，才进入人工回滚判定。
5. **技术立即回滚**：广告 Slot 不显示、重复请求、Console error、布局坍塌或两个 Post-family 广告位位置/数量错误，不等待 Day 7/14/28。
6. Active View、Impression RPM、Clicks 和总收入作为解释指标；不单独触发自动回滚。

以上门保护低流量站点不被随机波动误导，同时仍能在广告实际失效时立即止损。
