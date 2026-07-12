# P0 生产 5xx 数据源与 G-007 口径

日期：2026-07-12  
状态：`ACCEPTED / PRODUCTION 5XX OBSERVATION-ONLY / NO CONFIG CHANGE`

## 当前可用性

- Cloudflare HTTP Traffic（Free）只能看到 Zone 级 Previous 24 hours 汇总：16.23k total、2.2k cached、14.03k uncached；当前页面没有 hostname、status、path、method 或 bot 过滤器。
- Cloudflare Log Search 明确要求购买 Log Explorer；当前账号没有可查询的完整请求日志。
- Search Console 使用 `sc-domain:edony.ink`，已观察到 `uptime.edony.ink` 与 `wormhole.edony.ink` 错误混入，且数据延迟，不适合作生产发布硬门。
- Cloudflare RUM 同样疑似混入其他子域，且不是 HTTP 5xx 请求日志。

因此当前没有能可靠计算 `www.edony.ink` 动态请求 5xx 比率的数据源。不得用 Zone 总量、Search Console 或单个公开请求伪造百分比。

## 当前建议

1. 生产 5xx 比率降级为观察项，结论固定为 `样本不足 / 数据源不可用`，不阻断 R0–R8。
2. G-007 继续使用已批准的硬门：固定 Smoke 100% PASS、核心 URL 脚本化检查意外 4xx/5xx 为 0、新增 Console error 为 0、LCP/CLS 不超过回退线。
3. 不为本项目购买 Log Explorer，也不新增 Logpush/第三方日志服务；若未来已有可靠日志，再单独升级口径。

## 未来可升级口径

只有获得完整日志后才启用：UTC 滚动 7 天，Host=`www.edony.ink`，Method=`GET/HEAD`，排除 `/assets/`、`/content/images/`、`/public/`、favicon、已知监控及 Verified Bots；分子为同范围 500–599，分母为同范围有效请求；最低 1,000 个动态请求。基线为 0 时只使用另行批准的绝对百分点阈值。

2026-07-12 用户接受当前降级方案。T021 已关闭；GA4 7/28 天与 direct gtag/Zaraz owner 随后补齐，T018/T022 均已按可用窗口和 `Insufficient` 口径关闭。
