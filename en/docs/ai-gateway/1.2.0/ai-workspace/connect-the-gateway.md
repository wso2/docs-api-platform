---
title: "Connect the gateway to AI Workspace"
description: "Find the page that connects your AI Gateway to AI Workspace, whether you're trying the control plane locally or registering a production gateway."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/ai-workspace/connect-the-gateway/
md_url: https://wso2.com/api-platform/docs/ai-gateway/ai-workspace/connect-the-gateway.md
tags:
  - ai-gateway
  - ai-workspace
  - control-plane
  - deployment
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-26
content_type: "how-to"
---

# Connect the gateway to AI Workspace

!!! note "Requires AI Workspace"
    A gateway can register only with a running AI Workspace deployment. For what registering gains you, see [Extend your gateway with AI Workspace](extend-your-gateway-with-ai-workspace.md).

Connecting a gateway takes two steps, in this order. First you add the gateway in AI Workspace, which issues a registration token for it. Then you give that token and the address of AI Workspace to the gateway runtime, which registers itself and stays connected.

## Choose your path

Four pages cover those two steps, each for a different situation. Find the row that matches yours:

| Situation | Page | What it covers |
|---|---|---|
| You want to try AI Workspace on your own machine first | [Get started with AI Workspace](../../../ai-workspace/1.0.0/getting-started.md) | Running the control plane locally, then creating a gateway in it |
| You're connecting a gateway on either runtime | [Connect AI gateways in production](../../../ai-workspace/1.0.0/production/connect-gateways.md) | The authoritative procedure for both Docker Compose and Kubernetes, including certificate trust |
| You need the console side — the gateway record and its token | [Set up an AI Gateway](../../../ai-workspace/1.0.0/ai-gateways/setting-up.md) | Adding a gateway in AI Workspace and obtaining its registration token |
| You're connecting a production Kubernetes gateway | [Connect to AI Workspace](../setup-and-deployment/production-deployment/control-plane-connection.md) | The gateway-side chart values and token storage |

## Verify the connection

Each path ends with its own check that the gateway registered. For a production connection, see [Verify](../../../ai-workspace/1.0.0/production/connect-gateways.md#verify). For a Helm installation, see [Step 3: Verify the connection](../setup-and-deployment/production-deployment/control-plane-connection.md#step-3-verify-the-connection).
