---
title: "Configure an App LLM proxy"
description: "Create an App LLM proxy, optionally attach guardrails, and deploy it to a gateway."
canonical_url: https://wso2.com/api-platform/docs/cloud/ai-workspace/llm-proxies/configure-proxy/
md_url: https://wso2.com/api-platform/docs/cloud/ai-workspace/llm-proxies/configure-proxy.md
tags:
  - cloud
  - ai-workspace
  - llm-proxies
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-22
content_type: "how-to"
---

# Configure App LLM Proxy

An App LLM Proxy exposes a managed endpoint that your Gen AI applications or agents use to reach an LLM Provider. Once deployed, the proxy handles authentication and enforces any guardrails you configure. While the provider can be called directly, the proxy lets you create specialized endpoints for different applications, agents, or environments with independent keys, guardrails, and access controls on top of the same provider.

This guide walks you through creating an App LLM Proxy, optionally attaching guardrails, and deploying it to a gateway.

## Prerequisites

!!! info "Before You Begin"
    - Access to API Platform Console with **Admin** or **Developer** role
    - At least one [configured and deployed LLM Provider](../llm-providers/configure-provider.md)

---

## Create a New App LLM Proxy

1. Navigate to **LLM** > **Proxies** in the left navigation menu.

2. Click **+ Create Proxy** button.

3. Fill in the required proxy details:

    1. **Name*** (Required): Enter a unique name for the proxy (e.g., `support-chat-api`, `sales-agent-proxy`). The Proxy ID is auto-generated from the name (lowercase, hyphen-separated).

    2. **LLM Service Provider*** (Required): Select the LLM provider this proxy will route to from the dropdown (defaults to the latest updated provider).

    3. **Version*** (Required): The version is pre-filled (e.g., `v1.0`). You can edit this if needed.

    4. **Description** (Optional): Add a brief description to identify the Gen AI application or agent use case this proxy is created for.

    5. **Context** (Optional): Enter the context path (default: `/`). This is the base path for proxy endpoints (normalized with "/" prefix).

4. Click **Create Proxy** to save the proxy.

---

## Add Guardrails (Optional)

You can attach policies and guardrails to your proxy that apply to all requests:

1. In the **Guardrails** tab, click **+ Add Guardrail**.

2. A sidebar will open showing available guardrails and policies.

3. Click on a guardrail to select it and configure its settings.

4. Click **Submit** to attach it to the proxy.

!!! tip "Advanced Settings"
    Each guardrail includes advanced configuration options that allow you to fine-tune its behavior. After selecting a guardrail, you can configure these settings before attaching it to the proxy.

!!! info
    Learn more about available guardrails in the [Guardrails Overview](../policies/guardrails/overview.md). For the full list of policies and their specifications, visit the [Policy Hub](https://wso2.com/api-platform/policy-hub/).

---

## Deploy Proxy to Gateway

After creating your proxy, you must deploy it to a gateway before it can be used.

!!! warning "Required Step"
    Your proxy will not be functional until it is deployed to at least one gateway.

1. Click the **Deploy to Gateway** button in the top-right corner of the proxy details page.

2. The **Deploy to Gateway** page opens, showing all available gateways. Use the search bar to find a specific gateway.

3. Each gateway card displays:
    - **Gateway name** and **status** (Active or Not Active)
    - **Current Deployment** identifier (if previously deployed)

4. Click **Deploy** next to the gateway you want to deploy to.

5. Once deployed, expand the gateway card to view deployment details:

    | Field | Description |
    |-------|-------------|
    | **Deployment Status** | Active or Inactive |
    | **Deployment ID** | Unique identifier for the deployment |
    | **Deployed** | Time since deployment |
    | **Stop** | Button to stop an active deployment |

6. The **API Deployment History** panel on the right shows the deployment timeline:
    - Deployment identifier and timestamp
    - Status tags (**Latest**, **Deployed**)

**To stop a deployment:**

Click the **Stop** button next to an active deployment to undeploy the proxy from that gateway.

Click **Back to App LLM Proxy** to return to the proxy details page.

!!! info "Deployment Status"
    Monitor deployment progress on this page. Changes take effect within seconds of successful deployment.

---

## Get Started

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

### App LLM Proxy Keys

Generate an API key to authenticate requests to the deployed gateway.

1. Click **Generate API Key** in the Get Started panel.
2. Copy and save your API key immediately.

!!! danger "Important"
    API keys are only displayed once. Store it in a secure location immediately — you will not be able to retrieve it again.

### Deployed Gateways

The **Deployed Gateways** section lists all gateways this proxy is deployed to, along with the deployment status.

---

## Next Steps

- [Invoke via SDKs](../using-sdks.md) - Connect to your proxy from Python using provider-native SDKs
- [Manage Your App LLM Proxy](manage-proxy.md) - Configure provider, resources, security, and guardrails
- [Apply Policies](../policies/overview.md) - Learn about available policies for rate limiting and caching