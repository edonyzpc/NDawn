# P0 可重建源码基线

日期：2026-07-12  
状态：`RECONSTRUCTIBLE / AUTHORING WIP ISOLATED`

## 基线

- 主题源码基线：`4e3ac8a2ecab63069b0c80fda3c5cf657eefe787`。
- 当前 Ghost active packaging commit：`dbc1e7b189eeb532cc886b78ede90b7ff91c216a`。
- 排除 `.github/**`、`docs/**`、`specs/**` 后，两者主题源码逐文件相同；active 候选仅承载 CI/package 发布差异。
- 当前 authoring branch 的混合 WIP 不作为任何生产候选。

## 已可重建的独立候选链

| Unit | Commit | Parent |
|---|---|---|
| R1 | `0e72467b7c57c2ada55550552a8f2336c669e975` | `4e3ac8a2ecab63069b0c80fda3c5cf657eefe787` |
| R2 | `f52f51267de1be01dc9031a998400d6682b73c03` | R1 |
| R3a | `82aebbb5063763d08bb101b2601977ab36784513` | R2 |
| R3b | `27051d2fad7ca299ae795ed5bd00caa1e139e594` | R3a |
| R4 | `1362b7216cfc67d4bb0296557594f1aa45067cac` | R3b |
| R7a | `0916c11a853eb45c0f48af116d1cfacb249b4aec` | R4（仅离线视觉链，生产需在 R6 accepted head 重建） |
| R7b | `112e3209e1949c50fbb22f0909628fd4dacb4121` | R7a（仅离线视觉链） |

全部 commit object 已存在，可由 Git 重建；版本、checksum、predecessor 与发布状态记录于 `release-ledger.md`，长期窗口记录于 `observation-registry.md`，后续叠加回滚使用 `rollback-forward-template.md`。

