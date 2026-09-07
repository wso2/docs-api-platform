---
title: "Configure an App LLM proxy"
description: "Create an App LLM proxy, optionally attach guardrails, and deploy it to a gateway."
canonical_url: https://wso2.com/api-platform/docs/ai-workspace/1.0.0/llm-proxies/configure-proxy/
md_url: https://wso2.com/api-platform/docs/ai-workspace/next/llm-proxies/configure-proxy.md
tags:
  - cloud
  - ai-workspace
  - llm-proxies
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-22
content_type: "how-to"
---

# Configure an App LLM proxy

An App LLM proxy exposes a managed endpoint that your GenAI applications or agents use to reach an LLM provider. Once deployed, the proxy handles authentication and enforces any guardrails you configure.

You can also call the provider directly. Use a proxy when you need specialized endpoints for different applications, agents, or environments. Each proxy gets its own keys, guardrails, and access controls on top of the same provider.

This guide walks you through creating an App LLM proxy, optionally attaching guardrails, and deploying it to a gateway.

## Prerequisites

!!! info "Before you begin"
    - A user whose token carries the scopes these steps need:

        - `ap:llm_proxy:manage` to create and edit proxies.
        - `ap:llm_proxy:deployment:manage` to deploy a proxy.
        - `ap:llm_provider:read` to choose the provider behind it.
        - `ap:gateway:read` to choose the target gateway.
        - `ap:secret:create`, but only when the proxy carries its own upstream credential.

        Of the roles the [role-to-scope mapping](../setting-up/authentication/overview.md) ships, `ap_admin` grants all of these. `ap_publisher` grants every one except `ap:secret:create`.

    - At least one [configured and deployed LLM provider](../llm-providers/configure-provider.md).

## Create a new App LLM proxy

1. Navigate to **LLM** > **Proxies** in the left navigation menu.

2. Click **+ Create Proxy**.

3. Fill in the required proxy details:

    1. **Name*** (Required): Enter a unique name for the proxy (for example, `support-chat-api`, `sales-agent-proxy`). The Proxy ID is auto-generated from the name (lowercase, hyphen-separated).

    2. **LLM Service Provider*** (Required): Select the LLM provider this proxy routes to from the dropdown. It defaults to the most recently updated provider.

    3. **Version*** (Required): The version is pre-filled (for example, `v1.0`). You can edit this if needed.

    4. **Description** (Optional): Add a brief description to identify the GenAI application or agent use case this proxy is created for.

    5. **Context** (Optional): Enter the context path (default: `/`). This is the base path for proxy endpoints (normalized with "/" prefix).

4. Click **Create Proxy** to save the proxy.

## Add guardrails (optional)

Attach policies and guardrails that apply to every request this proxy serves:

1. In the **Guardrails** tab, click **+ Add Guardrail**.

2. A sidebar opens showing the available guardrails and policies.

3. Click a guardrail to select it and configure its settings.

4. Click **Submit** to attach it to the proxy.

!!! tip "Advanced settings"
    Each guardrail includes advanced configuration options for fine-tuning its behavior. After selecting a guardrail, configure these settings before you attach it to the proxy.

!!! info
    Learn more about available guardrails in the [Policies overview](../policies/overview.md). For the full list of policies and their specifications, visit the [Policy Hub](https://wso2.com/api-platform/policy-hub/).

## Deploy proxy to gateway

After creating your proxy, you must deploy it to a gateway before it can be used.

!!! warning "Required step"
    The proxy isn't functional until you deploy it to at least one gateway.

1. Click the **Deploy to Gateway** button in the top-right corner of the proxy details page.

2. The **Deploy to Gateway** page opens, showing all available gateways. Use the search bar to find a specific gateway.

3. Each gateway card displays:
    - **Gateway name** and **status** (Active or Not Active)
    - **Current Deployment** identifier (if previously deployed)

4. Click **Deploy** next to the gateway you want to deploy to.

5. Once deployed, expand the gateway card to view deployment details:

    | Field | Description |
    |-------|-------------|
    | **Deployment Status** | Either Active or Inactive |
    | **Deployment ID** | Unique identifier for the deployment |
    | **Deployed** | The time since deployment |
    | **Stop** | Button to stop an active deployment |

6. The **API Deployment History** panel on the right shows the deployment timeline:
    - Deployment identifier and timestamp
    - Status tags (**Latest**, **Deployed**)

**To stop a deployment:**

Click the **Stop** button next to an active deployment to undeploy the proxy from that gateway.

Click **Back to App LLM Proxy** to return to the proxy details page.

!!! info "Deployment status"
    Monitor deployment progress on this page. Changes take effect within seconds of successful deployment.

## Get started

Once the proxy is deployed, the proxy details page shows the **Get Started** panel on the right.

### Invoke URL

Select a gateway from the **Gateways** dropdown to see the base URL for calling this proxy through that gateway.

The URL follows the format:

```
https://{gateway-host}/{proxy-name}
```

To call a specific resource, append the resource path:

```
https://{gateway-host}/{proxy-name}/chat/completions
```

### App LLM proxy keys

Generate an API key to authenticate requests to the deployed gateway.

1. Click **Generate API Key** in the Get Started panel.
2. Copy and save your API key immediately.

!!! danger "Important"
    An API key is displayed only once. Store it in a secure location immediately, because you can't retrieve it again.

### Deployed gateways

The **Deployed Gateways** section lists all gateways this proxy is deployed to, along with the deployment status.

## Next steps

- [Invoke providers and proxies via SDKs](../using-sdks.md): connect to your proxy from Python using provider-native SDKs
- [Manage an App LLM proxy](manage-proxy.md): configure the provider, resources, security, and guardrails
- [Policies overview](../policies/overview.md): learn about the policies available for rate limiting and caching