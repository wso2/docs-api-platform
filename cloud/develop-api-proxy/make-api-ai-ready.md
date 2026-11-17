---
title: "Make an API AI-Ready"
description: "Write clear descriptions, structure OpenAPI specs, add documents, and control agent visibility so AI agents can discover and use your API."
canonical_url: https://wso2.com/api-platform/docs/cloud/develop-api-proxy/make-api-ai-ready/
md_url: https://wso2.com/api-platform/docs/cloud/develop-api-proxy/make-api-ai-ready.md
tags:
  - cloud
  - api-proxy
  - ai-discoverability
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-18
content_type: "how-to"
---

# Make an API AI-Ready

When you publish an API to the Developer Portal, it is automatically included in the portal's machine readable surfaces including `llms.txt`, the API catalog Markdown, and per API documentation endpoints. These surfaces are what AI agents use to discover, understand, and invoke your APIs.

This page explains what you can do as an API publisher to make your API as useful as possible for AI agents.


## Write a Clear API Description

The API description is the primary signal an AI agent uses to decide whether an API is relevant to the task it is trying to accomplish. A vague or empty description leads to missed discovery or incorrect usage.

**What to include:**

- What the API does and the domain it covers (e.g., order management, product catalog, identity)
- The kinds of operations it supports (read, write, or both)
- Any significant constraints agents should know upfront (authentication requirements, rate limits, environment differences)

The description appears in `llms.txt` and in the agent-readable API catalog (`apis.md`), so it is often the first thing an agent reads about your API.

## Use a Well-Structured API Specification

Publishing a complete, accurate API specification is one of the most impactful things you can do for AI discoverability. 

For REST APIs, follow these practices in your OpenAPI spec to improve agent accuracy:

- Give each operation a clear, unique `operationId` (e.g., `createOrder`, `listProducts`)
- Add a `summary` and `description` to each operation explaining its purpose
- Document all required and optional parameters, including their types and valid values
- Document response schemas, not just status codes
- Note any authentication requirements per operation


## Add Supporting Documents

Beyond the machine readable specification, you can attach prose documents to your API (see [Documents](documents.md)). These documents are surfaced to agents in the per API Markdown endpoint alongside the specification.

Use documents to cover things the specification cannot express well:

- Getting started guides with end-to-end examples
- Authentication walkthroughs
- Known limitations, edge cases, or gotchas
- Environment differences (sandbox vs. production)
- Changelog and migration notes

Well written prose documents reduce the chance that an agent will misinterpret the specification or hallucinate behavior that doesn't exist.

## Control Agent Visibility

All published APIs are agent visible by default. If an API should not be surfaced to AI agents, for example, an internal API not intended for external consumption you can hide it from agent facing endpoints while keeping it accessible to human users in the portal.

**To hide an API from agents:**

1. Sign in to the [API Platform Console](https://console.bijira.dev/).
2. Select the project and the API.
3. Navigate to **Manage** and then **Lifecycle**.
4. Click **Publish** to open the publish dialog.
5. Set **Agent Visibility** to **Hidden**.
6. Complete the publish flow.

Once hidden, the API is excluded from `llms.txt`, `apis.md`, and all per API Markdown and specification endpoints. It remains visible to human users in the portal.

![Publish API dialog with Display Name, Production Endpoint, and Make this API discoverable by AI agents toggle](../../assets/img/develop-api-proxy/publish-with-ai-visibility.png)

!!! note
    This setting applies per API. Hiding one API does not affect the visibility of others.

## Publish API Workflows

If your API is used in multi-step scenarios, for example, authenticate, then create a resource, then retrieve it, consider publishing an API Workflow that guides agents through the correct sequence of calls.

Workflows solve a common agent failure mode: left to reason freely, agents often misorient calls, skip required steps, or hallucinate endpoints. A published workflow gives agents a vetted, reliable path for a specific use case.

API Workflows are managed by portal admins. See [Managing API Workflows](../devportal/admin-settings/managing-api-workflows.md) for details.

## Verify AI Discoverability

After publishing your API, you can verify that it appears correctly in the portal's agent-facing surfaces:

1. Fetch `/{orgName}/views/{viewName}/llms.txt` and confirm your API is listed with its name and description.
2. Fetch `/{orgName}/views/{viewName}/api/{apiHandle}.md` and confirm the Markdown documentation is complete and readable.
3. Fetch `/{orgName}/views/{viewName}/api/{apiHandle}/docs/specification.json` (or `.graphql` / `.xml` depending on your API type) and confirm the specification is valid.

## What's Next

- [Managing API Workflows](../devportal/admin-settings/managing-api-workflows.md) — publish workflows that guide agents through multi-step call sequences
- [LLM Instructions](../devportal/admin-settings/llm-instructions.md) — add portal-level context that applies across all APIs in `llms.txt`
- [AI Agent Discovery](../devportal/discover-apis/ai-agent-discovery.md) — understand how agents discover and interact with your API