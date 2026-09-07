---
title: "Manage an App LLM proxy"
description: "Configure provider settings, resources, security, and guardrails for a deployed App LLM proxy, then save, redeploy, or delete it."
canonical_url: https://wso2.com/api-platform/docs/ai-workspace/1.0.0/llm-proxies/manage-proxy/
md_url: https://wso2.com/api-platform/docs/ai-workspace/next/llm-proxies/manage-proxy.md
tags:
  - cloud
  - ai-workspace
  - llm-proxies
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-23
content_type: "how-to"
---

# Manage an App LLM proxy

Once you create an App LLM proxy, manage its configuration through the proxy details page. This guide covers every management operation available for your App LLM proxy.

## Access proxy details

1. Navigate to **LLM** > **Proxies** in the left navigation menu.

2. Click a proxy name to open its details page.

The proxy details page displays the following information at the top:

- **Proxy name**, for example `Test-Openai`
- **Provider**: the linked LLM service provider
- **Version**: the proxy version
- **Last updated**: the timestamp of the most recent change

The page is organized into four configuration tabs: **Provider**, **Resources**, **Security**, and **Guardrails**. On the right side, you'll find the **Get Started** panel with API key generation and deployed gateway information.

The **Deploy to Gateway** button and a **delete** icon are located in the top-right corner of the page.

## Provider settings

Configure which LLM service provider the proxy connects to and how it authenticates with the provider.

### LLM service provider

1. Go to the **Provider** tab.

2. Use the **Provider** dropdown to select or change the linked LLM service provider.

    The dropdown lists all service providers that have been configured in your workspace.

    !!! info
        Changing the provider updates related settings such as authentication and available resources.

### API key configuration

If your selected provider uses API key authentication, you'll see the **API Key Configuration** section below the provider dropdown.

| Field | Description |
|-------|-------------|
| **Header Name** | The authentication header required by the provider (for example, `X-API-Key`). This field is read-only and is defined by the provider template. |
| **API Key** | Enter your provider's API key in this field. |

**To configure:**

1. Enter the API key in the **API Key** field.
2. Click **Save API Key** to store the credential securely.

!!! warning "Security best practices"
    - The workspace encrypts API keys and stores them securely.
    - Keys aren't displayed after saving.
    - Store a backup copy in a secure location.
    - Rotate keys regularly.

## Resources

Define which API endpoints (resources) are available through this proxy by importing an OpenAPI specification.

### OpenAPI specification

The OpenAPI specification defines the resources, or API endpoints, available through your proxy. For some providers, the workspace populates the specification for you.

**To import manually:**

1. Go to the **Resources** tab.

2. Click the **Import from file** button.

3. Upload a JSON or YAML file containing your OpenAPI specification.

4. The proxy automatically parses the file and displays the extracted resources.

!!! tip "OpenAPI format"
    The proxy accepts OpenAPI 3.0 and 3.1 specifications in both JSON and YAML formats.

### View resources

After importing, the **Resources** section displays the count and list of parsed resources. Each resource shows:

- **HTTP Method**: the HTTP method (GET, POST, PUT, DELETE, or PATCH)
- **Resource Path**: the endpoint path, for example `/v1/chat/completions`
- **Description**: the description extracted from the OpenAPI specification

## Security

Configure how client applications authenticate when accessing your proxy endpoints.

### Authentication

1. Go to the **Security** tab.

2. Configure the following authentication settings:

| Field | Description |
|-------|-------------|
| **Authentication type** | Select the authentication method from the dropdown. **API Key** is the only available method. |
| **Key name** | The name of the request header that clients must provide, for example `X-API-Key`. |
| **Sent in** | Where clients send the key. `header` is the only supported option. |
| **API Key Value Prefix** | An optional prefix prepended to the value clients must send, for example `Bearer`, so that clients send `Bearer <key>`. |

3. Click **Save** to apply the security configuration.

## Guardrails

Attach guardrails to enforce content safety, compliance, and quality standards on this proxy.

### Global guardrails

Global guardrails apply to **all resources** in the proxy.

**To add a global guardrail:**

1. Go to the **Guardrails** tab.

2. In the **Global Guardrails** section, click **+ Add Guardrail**.

3. A right-side panel opens displaying the available guardrails and policies.

4. Select a guardrail from the list.

5. Configure the guardrail settings including version, parameters, and any advanced settings.

6. Click **Submit** to add the guardrail.

Each guardrail you add appears as a pill showing its name and version.

### Resource-wise guardrails

Resource-wise guardrails apply to **specific endpoints** only. This section lists each resource from your OpenAPI specification, so you can attach guardrails to individual endpoints.

**To add a resource-specific guardrail:**

1. In the **Resource-wise Guardrails** section, find the resource you want to protect.

2. Expand the resource card and click **+ Add Guardrail**.

3. Select and configure the guardrail (same process as global guardrails).

4. Click **Submit** to attach the guardrail to the resource.

### Manage guardrails

- **View**: Global guardrails appear as pills in the Global Guardrails section. Resource-specific guardrails appear under each resource card.
- **Remove**: Click the **×** icon on a guardrail pill to remove it.

!!! warning
    After adding or removing guardrails, you must redeploy the proxy for the changes to take effect. Click **Deploy to Gateway** to apply your changes.

!!! info
    Learn more about available guardrails in the [Policies overview](../policies/overview.md). For the full list of policies and their specifications, visit the [Policy Hub](https://wso2.com/api-platform/policy-hub/).

## Save changes

After making configuration changes across any tab (Provider, Resources, Security, Guardrails), click the **Save** button at the bottom-right of the page to persist your changes.

Use the **Cancel** button to discard all unsaved changes and revert to the last saved state.

!!! info
    Configuration changes require a manual redeploy to take effect on deployed gateways. After saving, click **Deploy to Gateway** to apply your changes.

## Delete proxy

To delete a proxy, click the **delete** icon (trash icon) in the top-right corner of the proxy details page, next to the Deploy to Gateway button.

!!! danger "Irreversible action"
    Deleting a proxy is permanent and can't be undone.

    - The workspace removes the proxy from all gateways immediately.
    - All generated API keys stop working.
    - All configuration, including resources, security, and guardrails, is deleted.

!!! warning "Before deleting"
    - Ensure no applications are actively using the proxy.
    - Back up any important configuration settings.
    - Notify teams that depend on the proxy endpoints.

## Next steps

- [Policies overview](../policies/overview.md): learn about all available policies for proxies
- [Policy Hub](https://wso2.com/api-platform/policy-hub/): browse the full catalog of available guardrails and policies