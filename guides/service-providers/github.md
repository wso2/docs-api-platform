---
title: "GitHub guides"
description: "Use WSO2 API Platform to route GitHub Copilot through AI Gateway, create API proxies from GitHub repositories, and design APIs with Copilot in VS Code."
canonical_url: https://wso2.com/api-platform/docs/guides/service-providers/github/
md_url: https://wso2.com/api-platform/docs/guides/service-providers/github.md
tags:
  - guides
  - github
  - github-copilot
  - vs-code
  - service-provider-guides
author: WSO2 API Platform Documentation Team
last_updated: 2026-10-21
content_type: "reference"
---

# Govern GitHub Copilot and build APIs from GitHub

WSO2 API Platform works alongside the GitHub tools you already use. Route GitHub Copilot through AI Gateway, build API proxies from GitHub repositories, and design governed APIs with Copilot in VS Code.

## End-to-end guides

A step-by-step guide for GitHub Copilot.

<div class="vendor-guide-list" markdown="1">

- [Configure GitHub Copilot with AI Gateway](../ai-and-mcp/ai-coding-assistants/github-copilot-configuration-with-ai-gateway.md)

    Route GitHub Copilot CLI and Copilot Chat in VS Code through an App LLM Proxy.

    Guide · GitHub Copilot · Hybrid

</div>

## AI Gateway with GitHub Copilot

With the bring-your-own-key (BYOK) option, GitHub Copilot sends requests for your model to an LLM proxy on WSO2 AI Gateway. Requests for GitHub-hosted models still go directly to GitHub.

<div class="vendor-cap" markdown="1">

### Copilot's model provider

The Copilot guide uses an OpenAI provider.

<div class="vendor-links" data-deployments="hybrid" markdown="1">

- [Configure GitHub Copilot with AI Gateway](../ai-and-mcp/ai-coding-assistants/github-copilot-configuration-with-ai-gateway.md) <span class="vendor-meta">End-to-end guide</span>
- [Configure an LLM provider](../../cloud/ai-workspace/llm-providers/configure-provider.md#authentication) <span class="vendor-meta">AI Workspace</span>

</div>

<div class="vendor-links" data-deployments="self-hosted" markdown="1">

- [OpenAI provider](../../ai-gateway/2026.09.24/gateway-artifacts/llm-provider/supported-providers/openai.md) <span class="vendor-meta">AI Gateway</span>

</div>

</div>

<div class="vendor-links" data-deployments="hybrid" markdown="1">

Routing, token limits, cost control, and the other AI Workspace policies work the same way for every provider. See the [AI Workspace overview](../../cloud/ai-workspace/overview.md).

</div>

<div class="vendor-links" data-deployments="self-hosted" markdown="1">

Routing, token limits, cost control, and the gateway's other policies work the same way for every provider. See the [AI Gateway documentation](../../ai-gateway/2026.09.24/overview.md).

</div>

## GitHub repositories

Keep an API proxy's contract and configuration in a GitHub repository, then build and deploy the proxy from it.

<div class="vendor-cap" markdown="1">

### Create an API proxy from source

Connect a repository that holds the API contract and a `component.yaml` file.

<div class="vendor-links" data-deployments="cloud" markdown="1">

- [Create an API proxy from a GitHub repository](../../cloud/create-api-proxy/my-apis/http/import-api-from-github.md) <span class="vendor-meta">Cloud console</span>

</div>

</div>

## GitHub Copilot in VS Code

The API Designer extension for VS Code uses GitHub Copilot Chat to draft, edit, and fix OpenAPI specifications, and checks them against governance rules. It works the same way for every deployment.

<div class="vendor-cap" markdown="1">

### Design and govern APIs

Draft a specification with Copilot, then review and fix governance findings.

- [Get started with API Designer](../../tools/vscode-api-design/getting-started.md) <span class="vendor-meta">VS Code extension</span>
- [Govern APIs with API Designer](../../tools/vscode-api-design/govern-apis.md) <span class="vendor-meta">VS Code extension</span>
- [API Designer end-to-end tutorial](../../tools/vscode-api-design/end-to-end-tutorial.md) <span class="vendor-meta">VS Code extension</span>

</div>

## Architecture and responsibility model

WSO2 API Platform and GitHub split the work like this:

| Scenario | WSO2 role | GitHub role | Runtime traffic |
| --- | --- | --- | --- |
| GitHub Copilot through AI Gateway | Authenticates developers and applies guardrails, rate limits, and analytics | Provides the Copilot clients | BYOK model requests go through WSO2 AI Gateway to the model provider |
| API proxy from a GitHub repository | Builds, deploys, and manages the API proxy | Hosts the source and configuration | API traffic goes through the WSO2 gateway, not through GitHub |
| API design with Copilot in VS Code | Provides the API Designer extension and governance rules | Provides Copilot Chat | Runs in the developer's editor, with no API traffic involved |

## Learn more

Related pages in the GitHub documentation:

- [GitHub Copilot documentation](https://docs.github.com/en/copilot)
- [Use GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/overview)
- [AI language models in VS Code](https://code.visualstudio.com/docs/agent-customization/language-models)

To browse every guide by goal, see the [Guides overview](../overview.md#browse-by-use-case).