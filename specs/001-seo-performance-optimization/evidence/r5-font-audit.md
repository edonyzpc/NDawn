# R5 字体来源与打包审计

日期：2026-07-12  
状态：`G-010 APPROVED / ISOLATED R5a CANDIDATE / NOT RELEASED`

## 当前事实

| 项目 | 当前状态 | 影响 |
|---|---|---|
| Modern sans-serif | Site Header Injection 加载 Barlow 300/500/700；主题 CSS 用 `!important` 全局强制 Barlow | 当前视觉稳定，但 `@custom` 的其他选项被覆盖 |
| Elegant serif | Site Header Injection 无条件加载 Alike | 即使当前未选择也会发起字体样式请求；选择后仍可能被 Barlow 覆盖 |
| LXGW Bright | 用户已批准清理；本地候选已移除选项、注释、fallback 与 3,862,040 bytes WOFF2 | 线上原本不请求；本地 source/built 已无引用，尚未发布 |
| Ghost font variables | `--font-base` / `--font-heading` 已存在 | 被 `assets/css/misc/header-inject.css` 的全局 `!important` 规则压过 |

本地 WOFF2 SHA-256：`0b1523a8ca35401ba11e3cfc1a9218948a376f3049d3959005f4d647df9eec56`。仓库没有与该二进制绑定的版本记录或 OFL 文本，因此暂不把它加入发布包。

## 使用历史与回退影响

- 当前 active `ndawn-dbc1e7b189ee` 的 title/body 均为 `Modern sans-serif`。
- 直接 predecessor `ndawn-2026-07-05-13-03` 的 title/body 也均为 `Modern sans-serif`。
- Ghost Export 中所有 `ndawn-*` 历史设置均为 Modern；只有旧主题 `dawn-edony-2022-05-07` 有 1 条 LXGW 历史值。
- 重新 Activate 旧已安装主题时，Ghost 使用该旧主题自己的 `package.json` 与设置；从新 NDawn 删除选项不会修改旧主题 ZIP 或其历史值。
- 当前生产 HTML/CSS 没有 LXGW 字体请求。删除仓库 WOFF2 不改变现网页下载体积，只减少仓库约 3.86MB 并消除一个实际不可用的设置。

## G-010 推荐删除范围

用户已批准且本地候选已精确删除：

1. `package.json` 中 title/body 两处 `LXGW Bright` 选项。
2. `assets/css/general/basics.css` 中整段已注释 `@font-face`。
3. `assets/css/misc/header-inject.css` 三处 fallback 名称。
4. 来源/许可不明且从未进入 ZIP 的 `assets/css/fonts/LXGWBright-Medium.woff2`。
5. 已重建 `screen.css(.map)`；source/built/ZIP 搜索均无引用。

Modern/Elegant 仍保留。R5 后续候选只解决这两个选项的真实 owner：取消主题 CSS 对 Barlow 的无条件 `!important`，按实际选择加载 Barlow 或 Alike；Site Header 中对应字体链接仍需独立线上批准后删除。

## 收益与风险

- SEO：无直接排名收益；避免向用户暴露一个失效的主题选项。
- 性能：删除 WOFF2 对生产网络无变化，因为它当前未打包/未请求；R5 真正的性能收益来自不再无条件加载未选择的 Alike。
- 维护：仓库减少约 3.86MB，移除无版本/OFL 绑定的二进制与死代码。
- 回滚：旧 Ghost 已安装主题不受影响；若新主题需要恢复 LXGW，必须从受信上游重新引入并另立候选，不能依赖来源不明的旧文件。

## 决策记录

- 用户先前要求保留三种字体；2026-07-12 最终批准上述完整 LXGW 删除范围。
- 隔离候选 commit：`a5a07c7`，parent `1362b72`，只含 6 个批准路径。
- 最终本地候选：`ndawn-r5a-a5a07c7.zip`，SHA-256 `eb27e236cdb06d80be63395640b2e397d948a3fb693e501db258018916b108bd`；GScan fatal、ZIP 内容/identity/checksum 与 source/built/ZIP 零引用均 PASS。
- authoring 聚合态另行通过 `test:semantics`；R5a predecessor 本身未包含该后续聚合校验器，未为通过测试夹带脚本。
- 未 push、上传或激活，生产状态未变。

## 未解决的门

- 需要分别预览 Modern/Elegant 的中英文标题、正文、按钮、表格和 fallback。
- Site Header Injection 删除属于线上配置变更，必须在执行时单独批准。
