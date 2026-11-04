---
title: "Make an API AI-Ready"
description: "Write clear descriptions, structure OpenAPI specs, add documents, and control agent visibility so AI agents can discover and use your API."
---

When you publish an API to the API Portal and AI Hub, it is automatically included in the portal's machine readable surfaces including `llms.txt`, the API catalog Markdown, and per API documentation endpoints. These surfaces are what AI agents use to discover, understand, and invoke your APIs.

This page explains what you can do as an API publisher to make your API as useful as possible for AI agents.

## Write a Clear API Description

The API description is the primary signal an AI agent uses to decide whether an API is relevant to the task it is trying to accomplish. A vague or empty description leads to missed discovery or incorrect usage.

**What to include:**

- What the API does and the domain it covers (e.g., order management, product catalog, identity)
- The kinds of operations it supports (read, write, or both)
- Any significant constraints agents should know upfront (authentication requirements, rate limits, environment differences)

The description appears in `llms.txt` and in the agent-readable API catalog (`apis.md`), so it is often the first thing an agent reads about your API. You set the description for each portal in the **API Details** tab of the publish page. See [Customize the Portal Listing](./customize-portal-listing.md).

## Use a Well-Structured API Specification

Publishing a complete, accurate API specification is one of the most impactful things you can do for AI discoverability. You can refine the specification for each portal in the **Specification** tab of the publish page.

For REST APIs, follow these practices in your OpenAPI spec to improve agent accuracy.

- Give each operation a clear, unique `operationId` (e.g., `createOrder`, `listProducts`)
- Add a `summary` and `description` to each operation explaining its purpose
- Document all required and optional parameters, including their types and valid values
- Document response schemas, not just status codes
- Note any authentication requirements per operation

## Add Supporting Documents

Beyond the machine readable specification, you can attach prose documents to your API (see [Documents](../develop-api-proxy/documents.md)). These documents are surfaced to agents in the per API Markdown endpoint alongside the specification.

Use documents to cover things the specification cannot express well.

- Getting started guides with end-to-end examples
- Authentication walkthroughs
- Known limitations, edge cases, or gotchas
- Environment differences (sandbox vs. production)
- Changelog and migration notes

Well written prose documents reduce the chance that an agent will misinterpret the specification or hallucinate behavior that doesn't exist.

## Control Agent Visibility

By default, AI agents in the portal can discover a published API and invoke it on behalf of users. If an API shouldn't be available to AI agents, for example, an internal API that isn't intended for external consumption, you can hide it from agents while keeping it available to human users in the portal.

To control whether AI agents can discover an API, follow the steps given below.

1. Sign in to the [API Management Console](https://console.bijira.dev/).
2. In the header, select the project from the **Projects** list and the API from the **APIs** list.
3. In the left navigation menu, click **Publish**.
4. On the portal, click **Go to Publish**.
5. In the **Draft** view, on the **API Details** tab, turn the **Make this API discoverable by AI agents** toggle on or off.

    ![API Details tab of the publish page with the Make this API discoverable by AI agents toggle turned on, and its tooltip saying that agents in the API Portal can discover and invoke the API on behalf of users](/img/cloud/publish-api-proxy/ai-agent-discovery.png)

6. Click **Publish**, or **Republish** if the API is already published to the portal.

When you turn off the toggle, the API is excluded from `llms.txt`, `apis.md`, and the per API Markdown and specification endpoints of the portal. It remains visible to human users in the portal.

:::note
This setting applies to each API in each portal separately. Hiding one API doesn't affect the visibility of other APIs, or of the same API in other portals.
:::
