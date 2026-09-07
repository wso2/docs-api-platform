---
title: "Configure an LLM provider template"
description: "Create a custom LLM provider template in AI Workspace, configure its connection and token mappings, version it, and deploy it to a gateway."
canonical_url: https://wso2.com/api-platform/docs/ai-workspace/1.0.0/llm-provider-templates/configure-template/
md_url: https://wso2.com/api-platform/docs/ai-workspace/next/llm-provider-templates/configure-template.md
tags:
  - cloud
  - ai-workspace
  - llm-provider-templates
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-10
content_type: "how-to"
---

# Configure an LLM provider template

When the built-in templates don't cover the upstream LLM service you want to use, create a custom template for it. This guide shows how to create a custom template, complete its configuration, manage its versions, and deploy it to a gateway.

## Prerequisites

- A user whose token carries two scopes: `ap:llm_template:manage` to create, edit, and delete templates, and `ap:llm_template:read` to list them. In the [role-to-scope mapping](../setting-up/authentication/overview.md), `ap_admin` and `ap_operator` grant both scopes. `ap_publisher` and `ap_viewer` grant only `ap:llm_template:read`, which permits listing templates but not modifying them.
- At least one [AI Gateway created and set up](../ai-gateways/setting-up.md)
- The endpoint URL and OpenAPI specification of the upstream service

## Create a custom template

1. Navigate to **AI Workspace** > **Settings** > **LLM Provider Templates**.
2. Click **Create**.
3. Enter the relevant details, including the template **name** and the upstream **endpoint URL** (for example, `https://api.example.com`).
4. Click **Create**.

The new template starts at version **v1.0**. Open it to complete the rest of the configuration.

![Create LLM provider template form with name and endpoint URL fields](../../../assets/img/ai-gateway/standalone-ai-workspace/llm-provider-template/create-template-form.png)

## Configure the template

The template details page has an overview, a version selector, and the tabs described below.

![Template details page showing the version selector and configuration tabs](../../../assets/img/ai-gateway/standalone-ai-workspace/llm-provider-template/template-overview.png)

### Overview

Shows the template's logo, description, current version, and when it was last updated. For custom templates, you can edit details such as the logo URL and description here. From here you can also:

- **Download YAML**: export the current version as a manifest you can apply to a gateway.
- **Enable** or **Disable** the current version (built-in templates only).
- **Delete** the current version (custom templates only).

### Connection

Configure how the gateway connects to the upstream service:

- **Endpoint URL**: the base URL of the upstream service.
- **OpenAPI specification**: provide a **URL** and click **Fetch** to load it, or **upload** the file.
- **Authentication**: the inbound auth type, header or parameter name, and value prefix.

![Connection tab showing endpoint URL, OpenAPI specification, and authentication settings](../../../assets/img/ai-gateway/standalone-ai-workspace/llm-provider-template/template-connection.png)

### Token mapping

Define where token usage and model information are read from in requests and responses:

- **Default (Global) mappings**: prompt, completion, total, and remaining tokens, plus the request and response model.
- **Per-resource overrides**: different mappings for individual API resources.

![Token mapping tab showing default mappings and per-resource overrides](../../../assets/img/ai-gateway/standalone-ai-workspace/llm-provider-template/template-token-mapping.png)

## Versioning

Built-in template versions are read-only. You can edit a custom template version in place at any time. You can also create a new version to introduce a different configuration while keeping the earlier version available. Either way, providers already created from a version aren't affected—a provider copies the template configuration at creation time.

**To create a new version:**

1. Open the template and click the **version selector** (for example, **v1.0**).
2. Click **Create new version**.
3. Enter the new version (for example, `v2.0`) and adjust the configuration as needed.
4. Click **Create**.

![Version selector dropdown with the Create new version option](../../../assets/img/ai-gateway/standalone-ai-workspace/llm-provider-template/create-new-version.png)

!!! note
    Creating a new version of a **built-in** template produces a **custom** version.

## Deploy a custom template to the gateway

Built-in templates are already available on the gateway, but a custom template has to be deployed manually:

1. Open the template's **Overview** tab and click **Download YAML**.
2. Apply the downloaded manifest to the target gateway.

!!! warning "Required step"
    A provider created from a custom template only works after the template is deployed to the gateway that serves the provider.

!!! info
    You can apply the template manifest through the gateway's management API. See the [LLM provider template Management API reference](../../../api-gateway/next/gateway-controller-management-api/llm-provider-template-management.md) for details.

## Next steps

- [Manage an LLM provider template](manage-template.md): create providers from a template, and edit, enable, disable, or delete templates
- [Configure an LLM provider](../llm-providers/configure-provider.md): create a provider from your template