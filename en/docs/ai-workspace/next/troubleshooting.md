---
title: "Troubleshoot AI Workspace"
description: "Fixes for common AI Workspace problems: a gateway that stays Inactive, a chat completion request that returns 401, 403, or a model error."
canonical_url: https://wso2.com/api-platform/docs/ai-workspace/1.0.0/troubleshooting/
md_url: https://wso2.com/api-platform/docs/ai-workspace/next/troubleshooting.md
tags:
  - ai-workspace
  - troubleshooting
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-31
content_type: "troubleshooting"
---

# Troubleshoot AI Workspace

This page covers the problems you're most likely to hit while setting up AI Workspace and an AI Gateway. See [Get started with AI Workspace](getting-started.md) for the setup steps these fixes assume.

## The AI Gateway stays Inactive after you start it

Check that:

- The gateway container can reach the host and port in `APIP_GW_CONTROLLER_CONTROLPLANE_HOST`. From inside a container, `host.docker.internal` resolves to your host machine.
- The registration token in `APIP_GW_CONTROLLER_CONTROLPLANE_TOKEN` hasn't been revoked. Clicking **Reconfigure** on the gateway's page generates a fresh token and revokes the old one. Update `api-platform.env` and restart the gateway if you do this.
- The gateway container's logs (`docker compose logs`) don't show a connection error to the control plane.

## A chat completion request returns 401 or 403

Confirm you're sending the generated provider API key in the `X-API-Key` header, not your AI Workspace sign-in session. These authenticate two different things: one signs you in to AI Workspace, the other authenticates an application to the gateway.

## A chat completion request returns an error naming the model

The gateway only allows models explicitly added on the provider's **Models** tab. Add the model ID you're requesting, save, and try again.
