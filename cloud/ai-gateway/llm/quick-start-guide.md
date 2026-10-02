---
title: "AI Gateway LLM quick start guide"
description: "Create an AI Gateway and configure an LLM provider through the AI Workspace UI, then send your first request through the gateway."
canonical_url: https://wso2.com/api-platform/docs/cloud/ai-gateway/llm/quick-start-guide/
md_url: https://wso2.com/api-platform/docs/cloud/ai-gateway/llm/quick-start-guide.md
tags:
  - cloud
  - ai-gateway
  - llm
  - quickstart
author: WSO2 API Platform Documentation Team
last_updated: 2026-09-03
content_type: "quickstart"
---

# Quick start guide for LLMs in AI Gateway

The AI Gateway routes, secures, and observes traffic to large language model (LLM) providers such as OpenAI, Anthropic, and Azure OpenAI. On Cloud, you manage it through [AI Workspace](https://ai-workspace.bijira.dev). You register a gateway runtime, connect an LLM provider, and deploy the configuration.

This guide is for developers setting up their first AI Gateway on Cloud. You'll create a gateway, connect an OpenAI provider to it, and send your first request.

## Before you start
Before going through this quickstart, make sure you meet the following prerequisites:

- Access to [AI Workspace](https://ai-workspace.bijira.dev/) with the **Admin** role.
- An OpenAI API key.
- [Docker](https://docs.docker.com/get-docker/) with the Compose plugin. You can check the installed version with the `docker compose version` command.
- `curl` and `unzip` commands available in the command line.
- Port `8443` available on your machine. For more information, see [Default Ports in AI Gateway](../../../ai-gateway/1.2.0/reference/default-ports.md).


## Create an AI Gateway

An AI Gateway entry in AI Workspace represents one gateway runtime. Registering it here gets you a token; you still start the runtime yourself with Docker.

### Step 1: Sign in to AI Workspace

Open [AI Workspace](https://ai-workspace.bijira.dev/) and sign in. Then create an Organization and a Project in your Organization.

### Step 2: Add a gateway

1. Click **AI Gateways** in the left navigation menu.
2. Click **Add AI Gateway**.
3. Fill in the gateway details:

    | Field | Value |
    |---|---|
    | **Name** | A unique name for the gateway |
    | **Description** | An optional description of the gateway |
    | **URL** | The gateway URL. The gateway runtime is accessible at this endpoint, for example `https://localhost:8443` |
    | **Associated Environment** | Select an environment, for example `Development` |

4. Click **Add Gateway**.

The gateway detail screen opens. 

### Step 3: Start the gateway runtime

Select the __Quick Start__ tab in the detail page of the newly added gateway's **Get Started** pane. Then follow the instructions on the screen. The terminal commands contain the necessary configuration credentials like the gateway registration token and Moesif key. You don't have to manually generate anything.

1. Download and unzip the gateway distribution:

    ```bash
    curl -sLO https://github.com/wso2/api-platform/releases/download/ai-gateway/v1.1.0/wso2apip-ai-gateway-1.1.0.zip && \
    unzip wso2apip-ai-gateway-1.1.0.zip
    ```

2. Create the environment file with your registration token. 

    ```bash
    cat > wso2apip-ai-gateway-1.1.0/configs/keys.env << 'ENVFILE'
    MOESIF_KEY=<your-moesif-key>
    GATEWAY_CONTROLPLANE_HOST=connect.bijira.dev
    GATEWAY_REGISTRATION_TOKEN=<your-gateway-token>
    ENVFILE
    ```

3. Start the runtime:

    ```bash
    cd wso2apip-ai-gateway-1.1.0 && \
    docker compose --env-file configs/keys.env up
    ```

### Step 4: Verify the gateway is active

Return to the gateway's detail page in AI Workspace and refresh it. Once the runtime connects, the status changes from **Inactive** to **Active**. The __AI Gateways__ page listing the available gateways also shows the gateway as __Active__.

## Configure an LLM provider

An LLM Provider is a reusable connection from the gateway to an upstream LLM service. This guide uses OpenAI.

### Step 1: Add a provider

1. Select **LLM Providers** in the left navigation menu.
2. Click **Add New Provider**.
3. Select **OpenAI** from the provider types.

### Step 2: Fill in the provider details

| Field | Value |
|---|---|
| **Name** | A unique name for the Provider |
| **Version** | A version number, for example `v1.0` |
| **Description** | An optional description of the Provider |
| **Context** | The base context path. Leave the default`/`, or set one, for example `/ask-ai` |
| **API Key** | Your OpenAI API key |

AI Workspace configures OpenAI's upstream endpoint URL, so you don't need to supply one.

### Step 3: Add guardrails (optional)

In the Provider creation screen, you can opt to attach [guardrails like the AWS Bedrock Guardrail](./llm/guardrails/aws-bedrock-guardrail/), content-safety, or PII masking. Skip this for now.

### Step 4: Save the provider

Click **Add Provider**. The provider is added to __LLM Providers__ list. The detail page of the provider appears.

### Step 5: Deploy the provider to your gateway

1. Click **Deploy to Gateway**.
2. Click **Deploy** next to the [gateway you created](#create-an-ai-gateway).
3. Wait for the status to change to **Deployed**.

Click __LLM Providers__ in the navigation menu and click on your Provider. It opens the Provider's detail page in the __Overview__ tab.

## Send your first request

### Step 1: Get the invoke URL

On the Provider's detail page, select your gateway from the **Gateways** dropdown. This lets you see the invoke URL: the base address for reaching this provider through that gateway.

### Step 2: Generate an API key
1. Select the __Overview__ tab of your Provider screen.
2. Click **Generate API Key**
3. Enter a name for the key and then click __Generate__.
4. Copy the key.

A dialog appears containing a generated API key. It also contains a cURL command 
to send an authenticated request to your LLM through the gateway.

!!! danger "Generated API key appears only once"
    You can't retrieve the API key again after you close the key generation dialog. Generate a new API key if you lose the current one.

### Step 3: Send a request

Send an authenticated request through the gateway with your API key in the request header. For example, here we send a request to OpenAI API's `/chat/completions` endpoint:

```bash
curl -X POST "https://localhost:8443/my-openai-provider/ask-ai/chat/completions" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: 9f736716ebd31d9706s83c10d9aec691ddc0e2d8b2413xx86f5a3db3461b4d80" \
  -d '{
  "model": "gpt-4o-mini",
  "messages": [
    {
      "role": "user",
      "content": "Explain economics in one sentence!"
    }
  ]
}'
```

A successful response returns the model's completion.

## Next steps

- [Manage LLM Provider](../../ai-workspace/llm-providers/manage-provider.md): configure access control, rate limiting, and guardrails on the provider you just deployed
- [Configure App LLM Proxy](../../ai-workspace/llm-proxies/configure-proxy.md): create an application-specific endpoint on top of this provider, with its own guardrails and authentication
- [LLM Provider Templates](llm-templates.md): the metadata WSO2 API Platform extracts for each supported provider
- [AI Workspace Overview](../../ai-workspace/overview.md): everything else the control plane manages