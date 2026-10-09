---
title: "GenAI applications"
description: "Group API keys under a named GenAI application for application-level usage visibility, analytics, and governance."
canonical_url: https://wso2.com/api-platform/docs/cloud/ai-workspace/genai-applications/
md_url: https://wso2.com/api-platform/docs/cloud/ai-workspace/genai-applications.md
tags:
  - cloud
  - ai-workspace
  - genai-applications
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-22
content_type: "concept"
---

# GenAI Applications

GenAI Applications let you represent a real AI application inside the AI Workspace and associate existing API keys with it. This gives you application-level visibility and control instead of tracking usage only at the individual key level.

Without GenAI Applications, usage is tied only to the API keys generated for LLM Providers or App LLM Proxies. That makes it difficult to understand which application is consuming models, tokens, and cost, especially when multiple developers generate keys for the same project.

With GenAI Applications, you can:

- group API keys under a named application
- view usage and analytics at the application level
- improve governance and accountability for shared GenAI workloads
- prepare for application-level limits and controls

## When to Use GenAI Applications

Use a GenAI Application when:

- multiple developers work on the same AI application
- the application uses more than one API key
- you want analytics grouped by application instead of by key only
- platform teams need clearer visibility into which applications are driving usage

Examples include customer support copilots, internal knowledge assistants, document analysis apps, or workflow-specific AI agents.

## How It Works

The typical flow is:

1. Generate one or more API keys for an LLM Provider or App LLM Proxy.
2. Create a GenAI Application in the AI Workspace.
3. Attach the generated API keys to that application.
4. Invoke the gateway using those mapped keys.
5. View analytics and usage for that application in Insights.

The same application can have multiple API keys mapped to it. This is useful when different developers, environments, or services within the same project need separate keys while still rolling up usage to one application.

## Prerequisites

- At least one configured [LLM Provider](llm-providers/configure-provider.md) or [App LLM Proxy](llm-proxies/configure-proxy.md)
- At least one generated API key
- Access to the AI Workspace project where the GenAI Application will be created

## Create a GenAI Application

1. Navigate to **AI Workspace** in your API Platform dashboard.
2. Open **GenAI Applications** from the left navigation menu.
3. Click **+ Create Application**.
4. Provide the application details:

    - **Name**: A human-readable name for the application
    - **Description**: Optional details to identify the app's purpose

5. Click **Create**.

The application is created within the current project and becomes the shared representation of that GenAI workload.

## Attach API Keys to an Application

After creating the application, attach the API keys that the application already uses.

1. Open the GenAI Application.
2. Go to the **API Keys** section.
3. Click **Attach API Keys**.
4. Select one or more API keys generated for your LLM Providers or App LLM Proxies.
5. Save the mapping.

Only existing keys are mapped. This workflow does not create new keys. It links previously generated keys to the application so usage can be attributed correctly.

## View and Manage Attached Keys

The GenAI Application details page shows the keys currently mapped to the application.

For each mapped key, you can view details such as:

- the associated provider or proxy
- key status
- the user who created the key
- creation and update timestamps
- expiry details, when applicable

You can remove mappings for keys that should no longer be associated with the application.

Removing a mapping only detaches the key from that GenAI Application. It does not delete the underlying key unless you remove it from the provider or proxy separately.

## Insights for GenAI Applications

Once a mapped key is used to invoke the gateway, the gateway can identify the owning GenAI Application and publish analytics accordingly.

This lets you analyze usage by application, including:

- request volume
- token consumption
- latency trends
- error patterns
- cost and resource usage by application

This is especially useful for teams that need to understand which GenAI applications are driving traffic and spend.

See [Insights](insights.md) for more on the analytics experience.

## Best Practices

- Create one GenAI Application per real application or agent workload, not per developer.
- Map all keys used by the same application so analytics stay complete.
- Use clear names such as `Docs Assistant`, `Support Copilot`, or `Invoice Analyzer`.
- Review mappings periodically and remove keys that are no longer in use.
- Combine GenAI Applications with App LLM Proxies when an application also needs its own authentication, guardrails, or routing behavior.

## Related

- [App LLM Proxies](llm-proxies/overview.md) - Create application-specific endpoints and controls
- [Insights](insights.md) - Analyze usage by application
- [Invoke via SDKs](using-sdks.md) - Use mapped keys when calling providers and proxies