# P0 性能与兼容性测量协议

日期：2026-07-12
状态：`USER CONFIRMED / 60-RUN BASELINE COMPLETE`

## 固定工具

- 主机：macOS 26.5.2（25F84）。
- Chrome：150.0.7871.115。
- Safari / safaridriver：26.5.2（21624.2.5.11.8）。
- 实验室性能：Lighthouse CLI 13.4.0，安装在临时工具目录，不加入主题依赖或发布 ZIP。
- Lighthouse 默认移动预设使用模拟 Slow 4G 与 4x CPU slowdown；桌面使用 `desktop` preset。原始 JSON/HTML 保留在本地 evidence 目录，仓库只提交汇总与必要的脱敏样本。

## 三个核心性能 URL

1. 首页：`https://www.edony.ink/`
2. 普通 Post：`https://www.edony.ink/why-does-left-come-before-right/`
3. 长文/慢页面：`https://www.edony.ink/deep-insight-of-langgraph-and-bsp-model-in-agent-developing/`

代码、图片、Page、分页、Tag、Author 与三个 Custom Post 进入功能/Network/SEO Smoke，不扩大每个单元的 5-run 性能集合。

## 性能运行矩阵

| Form factor | Viewport / preset | Cache | 每 URL 次数 | 统计 |
|---|---|---|---:|---|
| Mobile | Lighthouse mobile default | Cold（默认清理 storage/cache） | 5 | 中位数 |
| Mobile | 同一持久 Chrome + `--disable-storage-reset` | Warm | 5 | 中位数 |
| Desktop | Lighthouse `desktop` preset | Cold | 5 | 中位数 |
| Desktop | 同一持久 Chrome + `--disable-storage-reset` | Warm | 5 | 中位数 |

每个版本共 3 URL × 2 form factors × 2 cache states × 5 = 60 次。固定记录 LCP、LCP element、CLS、TBT、FCP、Speed Index、transfer bytes、request count、Console 与失败原因。单元比较只使用相同矩阵和前一 accepted 版本。

## G-007 默认硬门

- 固定 Smoke 100% PASS。
- 可复现新增 Console error = 0。
- 核心 URL 脚本检查意外 4xx/5xx = 0。
- 每个核心页面同条件 LCP 中位数回退不超过 `max(10%, 250ms)`。
- CLS 中位数绝对回退不超过 0.02。
- 当前 Cloudflare RUM 样本不足且混入其他子域，生产 5xx 数据源也未锁定；二者暂为观察项，不伪装成硬门。

## 功能兼容矩阵

- Chrome Desktop、Chrome 390×844 mobile emulation。
- Chrome 768×1024 tablet responsive spot check（不加入 60-run 性能集合）。
- Safari Desktop、Safari Responsive 390×844。
- Safari Responsive 768×1024 tablet spot check。
- 匿名、免费会员、付费会员；凭据不写入仓库。没有可用真实测试账号时，用 Ghost Preview member status 覆盖模板，并把真实登录标为外部缺口。
- 首页、Paged、Post、Page、Tag、Author、Custom Narrow、专用 Draft Full/No-image。
- 验证 Navigation、Search、Portal、主题切换、TOC、PhotoSwipe、表格、Comments/Giscus、Ads、Analytics、SEO metadata 与 Network owner。

## 确认记录

- 2026-07-12 用户接受 60-run/版本协议、Lighthouse 13.4.0 临时安装，以及无真实测试账号时的 Ghost Preview 模板模拟/外部缺口记录方式。
- P0 正式结果见 `p0-lighthouse-baseline.md`。
