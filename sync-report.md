# Docs sync plan - 09.10.2026

Source: `upstream/main`
Target: `upstream/ai-gateway-1.2.0`

Page changes are replayed commit by commit. A change is applied only when this branch does not already have it. mkdocs.yml, redirects, theme, and hooks are not modified.

## Commits

- `replay` `392ed01c8` Update doc version — 36 pages; other files in that commit are not included
- `replay` `4ff9eaf28` Add multi-provider routing details for 1.2.0 — 1 page
- `replay` `5113399f6` Address multi-provider routing review comments — 1 page; other files in that commit are not included
- `replay` `800e24791` Add Bedrock provider guide for 1.2.0 — 2 pages; other files in that commit are not included
- `replay` `de0d87239` Sync latest docs with gateway and platform API specs — 30 pages; other files in that commit are not included
- `replay` `ce0337572` Refactor AI Gateway deployment guidelines — 13 pages; other files in that commit are not included
- `replay` `dd0465777` Update AI Gateway documentation for clarity and consistency, including revisions to deployment guidelines, descriptions, and terminology. Adjusted references to LLM and MCP traffic, improved formatting, and ensured accurate descriptions of security and scaling configurations. — 7 pages; other files in that commit are not included
- `replay` `b45c90d45` Enhance AI Gateway documentation for version 1.2.0 — 7 pages; other files in that commit are not included
- `replay` `56a5b1a7e` Address Bedrock provider guide review comments — 1 page; other files in that commit are not included
- `replay` `5c2eec5d5` Update AI Gateway documentation for version 1.2.0, enhancing clarity and consistency across deployment guidelines, security configurations, and API interactions. Revisions include improved instructions for handling sensitive data, adjustments to timeout settings for LLM traffic, and updated examples for creating Kubernetes Secrets. — 5 pages; other files in that commit are not included
- `replay` `7ee0cd397` Update AI Gateway documentation for versions 1.1.0 and 1.2.0 — 3 pages; other files in that commit are not included
- `already` `c4b508569` Update docs — this branch already has these page changes
- `replay` `54d604ad2` docs: backport policy execution order docs to 1.0.0, 1.1.0, 1.2.0 — 2 pages; other files in that commit are not included
- `replay` `4c741e0f6` docs: replace policy execution order SVGs with PNGs — 1 page; other files in that commit are not included
- `already` `a30b67453` Remove Proxy creation from AI Gateway quickstart and update quickstart structure — this branch already has these page changes
- `already` `7794288b4` Address coderabbital feedback — this branch already has these page changes
- `already` `60820b62e` Remove mention of Proxy from description — this branch already has these page changes
- `replay` `b46ee61f5` Fix the schemas sidebar by making schema names markdown headings — 1 page; other files in that commit are not included
- `replay` `79d59a11c` Add AI Gateway traffic logging docs, fix analytics config, and update llms.txt — 1 page; other files in that commit are not included
- `replay` `f3aeeebcc` add mcp-ratelimit policy and supportted spec versions — 1 page; other files in that commit are not included
- `replay` `a5f59714a` Implement the same set of Ai Gateway Revamp changes to 1.2.0 same as next — 21 pages; other files in that commit are not included
- `replay` `991125858` Delete policy page for MCP Rate Limit and fixes the redirect maps — 1 page; other files in that commit are not included
- `already` `2dc7aab06` Update docs with azure llm cost policy — this branch already has these page changes
- `replay` `94a7bef90` Adding otel publisher docs for gw 1.2.0 — 2 pages; other files in that commit are not included
- `replay` `494d5e855` docs: document adding and updating gateway policies — 1 page; other files in that commit are not included
- `replay` `96dd6ee9e` add version disclaimer — 1 page; other files in that commit are not included
- `replay` `02a893cd6` Remove LLM proxy creation and invocation from the AI Gateway quick start guide — 1 page; other files in that commit are not included
- `replay` `75bcfdcd0` Address code rabbit change reqeusts — 1 page; other files in that commit are not included
- `replay` `ba1844580` Fix canonical and Markdown URLs in versioned docs frontmatter — 74 pages; other files in that commit are not included
- `replay` `ae922c9cd` Add minimum resource requirement — 1 page; other files in that commit are not included

25 commits to replay, 5 already on this branch, 0 skipped.

## Nav entries to add by hand

Paste the ones you want into the target branch's `en/mkdocs.yml`, next to the same neighbors as on main.

- `- OpenTelemetry Analytics: ai-gateway/1.2.0/analytics/opentelemetry-analytics.md`
- `- Minimum resource requirements: ai-gateway/1.2.0/setup-and-deployment/resource-requirement.md`

## Redirects to add by hand

Add these to the target branch's `en/redirects.yml`.

- `ai-gateway/analytics/opentelemetry-analytics.md: ai-gateway/1.2.0/analytics/opentelemetry-analytics.md`
- `ai-gateway/mcp-proxy/policies/mcp-ratelimit.md: ai-gateway/1.2.0/mcp-governance.md`

## Pages that will still differ from main

None, apart from pages listed under Left deleted.
