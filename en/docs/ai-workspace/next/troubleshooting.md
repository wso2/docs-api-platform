---
title: "Troubleshoot AI Workspace"
description: "Fixes for common AI Workspace problems: a gateway that stays Inactive, or a chat completion request that returns 401 or 403."
canonical_url: https://wso2.com/api-platform/docs/ai-workspace/next/troubleshooting/
md_url: https://wso2.com/api-platform/docs/ai-workspace/next/troubleshooting.md
tags:
  - ai-workspace
  - troubleshooting
author: WSO2 API Platform Documentation Team
last_updated: 2026-09-24
content_type: "troubleshooting"
---

# Troubleshoot AI Workspace

This page covers the problems you're most likely to encounter while setting up AI Workspace and an AI Gateway. For the setup steps these fixes assume, see [Get started with AI Workspace](getting-started.md). For background, see [AI Workspace overview](overview.md) and [AI Workspace configuration and environment interpolation](setting-up/configuration.md).

## The AI Gateway stays Inactive after you start it

Check that:

- The gateway container can reach the host and port in `APIP_GW_CONTROLLER_CONTROLPLANE_HOST`. From inside a container, `host.docker.internal` resolves to your host machine.
- The registration token in `APIP_GW_CONTROLLER_CONTROLPLANE_TOKEN` hasn't been revoked. If you click **Reconfigure** on the gateway's page, it revokes the old token and issues a fresh one. Update `api-platform.env` and restart the gateway to pick it up.
- Inspect the gateway container's logs (`docker compose logs`) for a connection error to the control plane.

## A chat completion request returns `401` or `403`

Send the generated inbound API key in the header configured on your provider's **Security** tab. Include the **API Key Value Prefix** if one is set. Do not use your AI Workspace sign-in session. By default, the header is the one the provider's vendor uses. Examples include `Authorization: Bearer <key>` for OpenAI and `api-key: <key>` for Azure OpenAI. See [Configure inbound authentication](configure-inbound-auth.md#default-header-per-provider). These authenticate two different things: one signs you in to AI Workspace; the other authenticates an application to the gateway.
