# R6 Prism 全量 allowlist 与离线清理候选

日期：2026-07-12  
状态：`FULL EXPORT AUDIT / OFFLINE CANDIDATE / NO GHOST CHANGE`

## Owner 结论

- Site Footer 已是 Prism 1.29.0 唯一目标 owner：仅在 DOM 存在 `language-*` Code Card 时加载 core、autoloader、toolbar、copy 与 inline-color。
- Ghost Export 中仍有 59 篇 published Post 的历史 Prism Injection；不存在 draft/private Prism owner。
- 59 篇中 58 篇当前 HTML 有 `language-*` class；`solid-go` 没有目标 class，清理后应由全局检测正常 no-op。
- 公开 `/go-source-code-audit/` 当前除全局 loader 外还声明 4 个 legacy component URL（Go、Go module、Bash、SQL），证明存在重复/多版本 owner。

## 精确清理策略

- 54 篇 Injection 只有 Prism：只把对应 Post Footer Injection 清空。
- 5 篇混合 Injection 必须手术式删除 Prism 片段并逐字保留其他能力：
  - `text-embedding-and-its-application-in-semantic-understanding`：保留 KaTeX。
  - `from-kv-cache-to-prompt-cache-in-ai-app`：保留 MathJax。
  - `the-physics-of-inference-a-deep-dive-into-kv-and-prompt-caching`：保留 MathJax。
  - `deep-insight-of-langgraph-and-bsp-model-in-agent-developing`：保留 Mermaid。
  - `a-deep-dive-of-langgraph-mechanisms-agent-design-patterns`：保留 Mermaid。
- 不修改 Site Footer、Mermaid、KaTeX、MathJax、Analytics、Fonts、Comments 或 Ads。

## 可重建变更清单

- 生成器：`scripts/seo/build-r6-prism-manifest.mjs`。
- P0 Export SHA-256：`c320ff4e07ed3766dc3ee29f7db11aa466a29b008a4f9d8a08a178ef85e3c2cf`。
- 离线私有 manifest：`.private/seo-performance-recovery/2026-07-12/r6-prism-mutation-manifest.json`。
- Manifest SHA-256：`fb6a11ef1b508bf73b1a09144026f51df31a5268c4b6e4d57281c934e4796b98`。
- 结果：59 篇文章、54 个清空、5 个手术式删除，共移除 111 个历史 Prism component `<script>`。

生成器只删除 `cdnjs.cloudflare.com/ajax/libs/prism/<version>/components/prism-*.min.js` 外链元素，其他内容保持不变；若 allowlist 不再是 59 篇或混合 Injection 不再是 5 篇会直接失败，要求重新审计。

该 manifest 仅用于证明算法和当前候选，不可直接作为线上写入源。实际执行前必须重新下载 Ghost Export、重新生成 manifest，并以当时的 `updated_at`、字段值和 checksum 作为 G-008 predecessor。

5 个混合页面清理后字段摘要：

| Slug | 保留能力 | 清理后字段 |
|---|---|---|
| `text-embedding-and-its-application-in-semantic-understanding` | KaTeX | Head 817 bytes；Foot 空 |
| `from-kv-cache-to-prompt-cache-in-ai-app` | MathJax | Head 空；Foot 249 bytes |
| `the-physics-of-inference-a-deep-dive-into-kv-and-prompt-caching` | MathJax | Head 空；Foot 249 bytes |
| `deep-insight-of-langgraph-and-bsp-model-in-agent-developing` | Mermaid | Head 空；Foot 135 bytes |
| `a-deep-dive-of-langgraph-mechanisms-agent-design-patterns` | Mermaid | Head 空；Foot 148 bytes |

## 59 篇 allowlist

```text
solid-go
go-srp
ebpf-tracing
go-ocp
go-lsp
go-isp
go-dip
go-key-points
go-mod-upgrade
deep-in-ebpf-uprobe
lifetime-of-goroutine
details-of-go-binary-launch
understand-go-interface-with-ebpf-tech
ebpf-and-observability-system
cpp-class-memory-layout
thinking-of-rust-project-and-design-pattern
deep-insight-of-golang-map-with-gdb-ebpf
deepinsight-of-ebpf-map
dive-into-ebpf-loader
about-python-virtual-env-mangement
details-of-linux-hook
go-project-layout
docker-run-vs-docker-compose
quotation-marks-in-golang
visual-understanding-shamirs-secret-share-algorithm
self-hosting-personal-memos-services
key-points-of-effective-go
memos-database-related-source-code-reviewing
pointer-receiver-related-interface-type-assertion-failure
customize-memos-webhook-service-with-cf-worker
backup-memos-with-github-api-in-cloudflare-worker-webhook
reflection-programming-and-golang-marshal
how-to-use-grpc-gateway
details-of-gorm-framework
advanced-gorm-customized-types
create-x86-testing-env-in-apple-m-chip
solution-of-random-accessing-ghost-post
how-to-be-a-master-of-ai-like-chatgpt
new-awesome-features-to-show-off
publish-go-package-by-myself
go-source-code-audit
mvp-of-go-wasm-in-obsidian
embedding-graph-view-in-local-obsidian-tab-biew
prompt-engineering-notebook
migrate-memos-sqlite-to-mysql-with-help-of-claude-35-sonnet
details-of-vector-embeddings-in-llm
text-embedding-and-its-application-in-semantic-understanding
agentic-ai
langchain-frameworks-2
how-to-use-langchain-to-enable-rag
detailed-learning-of-model-context-protocol
detailed-learning-of-model-context-protocol-2
react-agent-mcp-to-convert-epub-to-audio
from-stable-agent-to-smart-agent
before-making-ai-agent-systems-smarter-first-make-them-trustworthy
from-kv-cache-to-prompt-cache-in-ai-app
the-physics-of-inference-a-deep-dive-into-kv-and-prompt-caching
deep-insight-of-langgraph-and-bsp-model-in-agent-developing
a-deep-dive-of-langgraph-mechanisms-agent-design-patterns
```

## 风险与验证

- 部分正文含拼写错误或自定义 language class（如 `makrdown`、`models-with-attention-sinks`）；legacy Injection 同样没有对应组件，本单元不顺手改正文。
- Precheck 必须重新导出 59 篇当前字段和 checksum，不能使用 P0 快照直接覆盖。
- 修改批准前仅保留离线 allowlist；执行后用普通页、单语言、多语言及上述 5 篇混合页面验证 Network、Console、代码高亮和非 Prism 功能。
