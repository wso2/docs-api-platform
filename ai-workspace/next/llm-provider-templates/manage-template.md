---
title: "Manage an LLM provider template"
description: "Use an LLM provider template to create a provider, and edit, enable/disable, or delete template versions in AI Workspace."
canonical_url: https://wso2.com/api-platform/docs/ai-workspace/1.0.0/llm-provider-templates/manage-template/
md_url: https://wso2.com/api-platform/docs/ai-workspace/next/llm-provider-templates/manage-template.md
tags:
  - cloud
  - ai-workspace
  - llm-provider-templates
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-10
content_type: "how-to"
---

# Manage an LLM provider template

This guide shows how to create an LLM provider from a template, and how to edit, enable, disable, and delete templates.

## Use a template to create a provider

When [adding an LLM provider](../llm-providers/configure-provider.md):

1. Pick a template from the template picker. Custom templates appear alongside the built-in ones.

    ![Template picker in the Add Provider flow showing built-in and custom template cards](../../../assets/img/ai-gateway/standalone-ai-workspace/llm-provider-template/select-template-for-provider.png)

2. If the template has more than one version, select the version you want and click **Continue**. If there is only one version, it is selected for you.

    ![Version selection step with available template versions and the Continue button](../../../assets/img/ai-gateway/standalone-ai-workspace/llm-provider-template/select-template-version.png)

3. Enter the provider name and credentials. The provider takes its endpoint, authentication, and token mappings from the selected template version.

!!! warning
    A provider created from a custom template only works after the template is [deployed to the gateway](configure-template.md#deploy-a-custom-template-to-the-gateway) that serves the provider.

## Edit a template

You can only edit **custom** templates; built-in templates are read-only. There are two ways to make a change:

- Edit a version in place through the [Overview, Connection, and Token Mapping tabs](configure-template.md#configure-the-template) — for example, to update the logo URL, endpoint, or mappings.
- [Create a new version](configure-template.md#versioning) to introduce a different configuration while keeping the existing version available.

Editing a template version doesn't affect the providers already created from it. A provider copies the template configuration at creation time, so template changes apply only to providers created afterward.

## Enable or disable a template

You can turn a **built-in** template version on or off from the template's **Overview** tab.

![Built-in template Overview tab showing the Enable/Disable action](../../../assets/img/ai-gateway/standalone-ai-workspace/llm-provider-template/enable-disable-template.png)

- Only built-in templates can be enabled or disabled. To remove a custom template, delete it instead.
- A version can't be disabled while a provider is using it.
- Disabled templates appear dimmed in the listing, and you can't create providers from them.

## Delete a template

To remove a **custom** template version:

1. Navigate to **Settings** > **LLM Provider Templates** and open the template.
2. Pick the version you want to remove from the **version selector**.
3. Click **Delete** and confirm.

![Delete confirmation dialog for a custom template version](../../../assets/img/ai-gateway/standalone-ai-workspace/llm-provider-template/delete-template.png)

!!! warning "Deletion is blocked while in use"
    You can't delete a template version while a provider created from it still exists. The console shows the error `Cannot delete: one or more providers were created from this template.` Delete those providers first, then try again.

Deleting the last remaining version removes the whole template.

## Next steps

- [LLM providers overview](../llm-providers/overview.md): create a provider from a template
- [App LLM proxies overview](../llm-proxies/overview.md): add application-facing endpoints on top of a provider