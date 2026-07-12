# 当前已实现设计态集合验证

日期：2026-07-12
状态：`LOCAL IMPLEMENTED-UNITS AGGREGATE PASS / NOT A RELEASE UNIT / NOT UPLOADED`

本文件只验证当前已实现的 R1/R2/R3a/R3b/R4/R7a/R7b 主题功能能够收敛成一个自洽聚合集合；R5、R6、R7c、R8、R9、R10 仍未完成，因此它不是完整最终主题，也不改变所有 Unit 必须逐单元发布、观察和回滚的要求。

## 验证结果

| 检查 | 结果 |
|---|---|
| `yarn test:semantics` | PASS |
| `yarn test:evidence` | PASS |
| `yarn test:ci` / GScan fatal | PASS |
| `yarn zip` | PASS |
| `yarn test:zip:ci` | PASS |
| Theme 文件 `git diff --check` | PASS |
| 连续两次完整重建 SHA | 8 个 built/maps 文件全部一致 |

本地聚合 ZIP：

- 路径：`dist/ndawn.zip`
- 大小：347,082 bytes
- SHA-256：`5b621cab988e6d9b43b22ab1db86ee057fb96be516b9e41b874ed3884a4c2b1c`
- 仅作当前已实现 Unit 的聚合验证；不得上传 Ghost，也不得替代任一 Unit 的独立 `FINAL_ZIP`。

## 发现并修正的构建漂移

首次完整重建发现工作区内 8 个 `assets/built/*` 与当前源码不一致，因此 CI 的 generated-assets gate 会失败。重新生成后连续两次构建哈希完全一致，证明是漏同步 built 产物而不是构建随机性。

当前 regenerated built 文件保留在设计工作区，后续每个发布 Unit 仍须从其 accepted predecessor 单独重建；不能把本聚合 built 文件直接夹带到早期 Unit。
