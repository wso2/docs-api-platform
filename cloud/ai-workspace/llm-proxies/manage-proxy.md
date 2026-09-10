---
title: "Manage an App LLM proxy"
description: "Configure provider settings, resources, security, and guardrails for a deployed App LLM proxy, then save, redeploy, or delete it."
canonical_url: https://wso2.com/api-platform/docs/cloud/ai-workspace/llm-proxies/manage-proxy/
md_url: https://wso2.com/api-platform/docs/cloud/ai-workspace/llm-proxies/manage-proxy.md
tags:
  - cloud
  - ai-workspace
  - llm-proxies
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-22
content_type: "how-to"
---

# Manage App LLM Proxy

Once you create an App LLM Proxy, you can manage its configuration through the proxy details page. This guide covers all management operations available for your specialized application or agent proxy.

!!! info "On This Page"
    **Proxy Configuration:**

    - [Provider Settings](#provider-settings) - LLM service provider and authentication
    - [Resources](#resources) - OpenAPI specification and endpoints
    - [Security](#security) - Client application authentication
    - [Guardrails](#guardrails) - Content protection and policies
    - [Get Started](#get-started) - API keys and gateway deployments

    **Lifecycle Operations:**

    - [Save Changes](#save-changes) - Apply configuration updates
    - [Delete Proxy](#delete-proxy) - Remove proxy permanently

---

## Access Proxy Details

1. Navigate to **LLM** > **Proxies** in the left navigation menu.

2. Click on a proxy name to open its details page.

The proxy details page displays the following information at the top:

- **Proxy name** (e.g., Test-Openai)
- **Provider** - The linked LLM service provider
- **Version** - The proxy version
- **Last updated** - Timestamp of the most recent change

The page is organized into four configuration tabs: **Provider**, **Resources**, **Security**, and **Guardrails**. On the right side, you'll find the **Get Started** panel with API key generation and deployed gateway information.

The **Deploy to Gateway** button and a **delete** icon are located in the top-right corner of the page.

---

## Provider Settings

<div style="border-left: 4px solid #1976d2; padding-left: 16px; margin-bottom: 24px;">

Configure which LLM service provider the proxy connects to and how it authenticates with the provider.

</div>

### LLM Service Provider

1. Go to the **Provider** tab.

2. Use the **Provider** dropdown to select or change the linked LLM service provider.

    The dropdown lists all service providers that have been configured in your workspace.

    !!! info
        Changing the provider updates related settings such as authentication and available resources.

### API Key Configuration

If your selected provider uses API key authentication, you'll see the **API Key Configuration** section below the provider dropdown.

| Field | Description |
|-------|-------------|
| **Header Name** | The authentication header required by the provider (e.g., `X-API-Key`). This field is read-only and is defined by the provider template. |
| **API Key** | Enter your provider's API key in this field. |

**To configure:**

1. Enter the API key in the **API Key** field.
2. Click **Save API Key** to store the credential securely.

!!! warning "Security Best Practices"
    - API keys are encrypted and stored securely
    - Keys are not displayed after saving
    - Store a backup copy in a secure location
    - Rotate keys regularly for security

---

## Resources

<div style="border-left: 4px solid #388e3c; padding-left: 16px; margin-bottom: 24px;">

Define which API endpoints (resources) are available through this proxy by importing an OpenAPI specification.

</div>

### OpenAPI Specification

The OpenAPI specification defines the resources (API endpoints) available through your proxy. Depending on the provider, the specification may be automatically populated.

**To import manually:**

1. Go to the **Resources** tab.

2. Click the **Import from file** button.

3. Upload a JSON or YAML file containing your OpenAPI specification.

4. The proxy automatically parses the file and displays the extracted resources.

!!! tip "OpenAPI Format"
    Supports OpenAPI 3.0 and 3.1 specifications in both JSON and YAML formats.

### View Resources

After importing, the **Resources** section displays the count and list of parsed resources. Each resource shows:

- **HTTP Method** - The HTTP method (GET, POST, PUT, DELETE, PATCH)
- **Resource Path** - The endpoint path (e.g., `/v1/chat/completions`)
- **Description** - A description extracted from the OpenAPI spec

---

## Security

<div style="border-left: 4px solid #f57c00; padding-left: 16px; margin-bottom: 24px;">

Configure how client applications authenticate when accessing your proxy endpoints.

</div>

### Authentication

1. Go to the **Security** tab.

2. Configure the following authentication settings:

| Field | Description |
|-------|-------------|
| **Authentication type** | Select the authentication method from the dropdown. Currently, **API Key** is available. |
| **Key name** | The name of the key that clients must provide (e.g., `X-API-Key`). |
| **Sent in** | Choose how clients send the authentication key: **Header** (recommended) or **Query Parameter**. |

3. Click **Save** to apply the security configuration.

!!! tip "Best Practice"
    Use **Header** authentication for production environments. Query parameters may be logged in server access logs and browser history.

---

## Guardrails

<div style="border-left: 4px solid #d32f2f; padding-left: 16px; margin-bottom: 24px;">

Attach guardrails to enforce content safety, compliance, and quality standards on this proxy.

</div>

### Global Guardrails

Global guardrails apply to **all resources** in the proxy.

**To add a global guardrail:**

1. Go to the **Guardrails** tab.

2. In the **Global Guardrails** section, click **+ Add Guardrail**.

3. A right-side panel opens displaying the available guardrails and policies.

4. Select a guardrail from the list.

5. Configure the guardrail settings including version, parameters, and any advanced settings.

6. Click **Submit** to add the guardrail.

Added guardrails appear as pills showing the guardrail name and version.

### Resource-wise Guardrails

Resource-wise guardrails apply to **specific endpoints** only. This section lists each resource from your OpenAPI specification, allowing you to attach guardrails to individual endpoints.

**To add a resource-specific guardrail:**

1. In the **Resource-wise Guardrails** section, find the resource you want to protect.

2. Expand the resource card and click **+ Add Guardrail**.

3. Select and configure the guardrail (same process as global guardrails).

4. Click **Submit** to attach the guardrail to the resource.

### Manage Guardrails

- **View**: Global guardrails appear as pills in the Global Guardrails section. Resource-specific guardrails appear under each resource card.
- **Remove**: Click the **×** icon on a guardrail pill to remove it.

!!! warning
    After adding or removing guardrails, you must redeploy the proxy for the changes to take effect. Click **Deploy to Gateway** to apply your changes.

!!! info
    Learn more about available guardrails in the [Guardrails Overview](../policies/guardrails/overview.md). For the full list of policies and their specifications, visit the [Policy Hub](https://wso2.com/api-platform/policy-hub/).

---

## Save Changes

After making configuration changes across any tab (Provider, Resources, Security, Guardrails), click the **Save** button at the bottom-right of the page to persist your changes.

Use the **Cancel** button to discard all unsaved changes and revert to the last saved state.

!!! info
    Configuration changes require a manual redeploy to take effect on deployed gateways. After saving, click **Deploy to Gateway** to apply your changes.

---

## Delete Proxy

To delete a proxy, click the **delete** icon (trash icon) in the top-right corner of the proxy details page, next to the Deploy to Gateway button.

!!! danger "Irreversible Action"
    Deleting a proxy is permanent and cannot be undone.

    - The proxy is immediately removed from all gateways
    - All generated API keys stop working
    - All configuration (resources, security, guardrails) is deleted

!!! warning "Before Deleting"
    - Ensure no applications are actively using the proxy
    - Back up any important configuration settings
    - Notify teams that depend on the proxy endpoints

---

## Next Steps

- [Policies Overview](../policies/overview.md) - Learn about all available policies for proxies
- [Policy Hub](https://wso2.com/api-platform/policy-hub/) - Browse the full catalog of available guardrails and policies