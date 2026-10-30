---
title: "Get started with AI Workspace"
description: "Connect an AI Gateway to AI Workspace, configure an LLM provider and an MCP proxy, and call both through the AI Gateway."
canonical_url: https://wso2.com/api-platform/docs/cloud/ai-workspace/quickstart/
md_url: https://wso2.com/api-platform/docs/cloud/ai-workspace/quickstart.md
tags:
  - cloud
  - ai-workspace
  - ai-gateway
  - llm
  - mcp
  - quickstart
  - docker
author: WSO2 API Platform Documentation Team
last_updated: 2026-09-09
content_type: "quickstart"
---

# Get started with AI Workspace

AI Workspace, hosted by WSO2, provides a central control plane for your AI infrastructure. It lets you manage:

- AI Gateways that route and govern AI traffic.
- Large language model (LLM) providers that your applications use.
- Model Context Protocol (MCP) servers that provide tools and context to your applications.

AI Workspace configures the gateways, providers, and proxies, and deploys these configurations to the gateway. The gateway enforces inbound authentication on LLM providers and App LLM proxies by default; an MCP proxy needs an MCP Authentication policy for the same protection. The gateway also provides centralized control and observability for traffic. You run the gateway on the infrastructure of your choice.

## Overview

This guide walks you through:

1. [Set up your workspace](#part-1-set-up-your-workspace): create an organization in the Console.
2. [Connect an AI Gateway](#part-2-connect-an-ai-gateway): register a gateway and start it.
3. [Configure an LLM provider](#part-3-configure-an-llm-provider): connect a provider, add a model, deploy it, and generate an API key.
4. [Run your first prompt](#part-4-run-your-first-prompt): send a real chat completion request.
5. [Configure an MCP proxy](#part-5-configure-an-mcp-proxy): proxy a sample MCP server and deploy it.
6. [Call your first MCP tool](#part-6-call-your-first-mcp-tool): send a real tool call and confirm the response.

By the end, you'll have an AI Gateway, connected through AI Workspace to both an LLM provider and an MCP server. You'll send a real chat completion request and a real tool call through the resulting endpoints.

It's written for platform engineers, developers, and anyone evaluating AI Workspace for AI governance. No prior WSO2 API Platform experience is required. For optional background on the concepts this guide uses, see:

- [AI Workspace and how it relates to the AI Gateway](overview.md)
- [LLM providers](llm-providers/overview.md)
- [MCP proxies](mcp-proxies/overview.md)

The gateway you run fans out to both back ends:

![AI Gateway routes requests to an LLM provider and an MCP server, configured by AI Workspace, which WSO2 hosts](../../assets/img/ai-gateway/ai-workspace/quickstart/architecture-overview.svg)

## Before you start

Complete the following prerequisites:

- A WSO2 API Platform account: sign up at [API Platform Console](https://console.bijira.dev/) with Google, GitHub, Microsoft, or email. The free trial covers this guide.
- Install [Docker](https://docs.docker.com/get-docker/) with the Compose plugin, on the machine where the gateway will run, or another Compose-compatible container runtime such as Podman.
- Port `8443` free on that machine, for the gateway's HTTPS listener.
- Install `curl` and `unzip`.
- An API key from an LLM provider. This guide uses Mistral AI as the worked example, but any of the six built-in providers works. Sign up with your chosen provider and generate a key before [Part 3](#part-3-configure-an-llm-provider).

This guide shows commands with `docker compose`. If you use Podman or another Compose-compatible runtime, run the equivalent Compose command instead, such as `podman compose up -d`.

## Part 1: Set up your workspace

Everything in the platform lives under an *organization*, which you create once, in the Console.

### Step 1: Create your organization

1. Go to the [API Platform Console](https://console.bijira.dev/) and sign in. If you already have an organization, open it from the **Organization** menu and skip to [Part 2](#part-2-connect-an-ai-gateway).
2. On first sign-in, enter a name for your organization, accept the Privacy Policy and Terms of Use, and click **Create**.

    ![Console screen for creating your first organization, with a name field and an agree checkbox](../../assets/img/ai-gateway/ai-workspace/quickstart/create-organization.png)

### Step 2: Choose what to build

1. When asked to select a region, keep the default and click **Get Started** (you can add your own data plane later).
2. On **What do you want to build?**, select **AI Service**, then click **Next**.

    ![What do you want to build? screen with the AI Service option selected](../../assets/img/ai-gateway/ai-workspace/quickstart/select-ai-service.png)

The Console provisions a **Default** project with **Development** and **Production** environments, then opens AI Workspace in a new tab. AI Workspace opens on a guided setup page. Click **Skip and go to Console** to follow this guide's steps directly.

## Part 2: Connect an AI Gateway

An AI Gateway is the runtime that enforces authentication, rate limits, and guardrails while routing requests to LLM providers and MCP servers. AI Workspace configures it; you run it yourself, as a set of containers. You need at least one connected and active before you can send a real request. This part registers a gateway in AI Workspace, then installs and starts its runtime so it shows a status of **Active**.

### Step 3: Register the gateway

1. Navigate to **AI Gateways** in the left navigation menu.
2. Click **Add AI Gateway**.
3. Fill in the gateway details:
    - **Name**: a unique name, for example `dev-ai-gateway`.
    - **Description**: optional.
    - **URL**: keep the pre-filled `https://localhost:8443`. This is the address the gateway is reachable at once it's running. AI Workspace uses this to build the Invoke URL and MCP Proxy URL you'll call from your own terminal later in this guide. Use an address your terminal can actually reach, not `host.docker.internal`. That hostname only resolves from inside a container, not from your host machine.
    - **Associated Environment**: select **Development**.

    ![Add AI Gateway form with a name, the localhost URL, and the Development environment](../../assets/img/ai-gateway/ai-workspace/quickstart/add-ai-gateway-form.png)

4. Click **Add Gateway**.

!!! note "Environment dropdown empty?"
    The **AI Service** onboarding in Part 1 didn't finish. Complete it in the Console, then come back to this step.

AI Workspace creates the gateway with a status of **Inactive** and opens a **Get Started** section with the commands to start the runtime, organized under four tabs: **Quick Start**, **Virtual Machine**, **Docker**, and **Kubernetes**. This guide uses **Quick Start**; for the other methods, see [Set up an AI Gateway](ai-gateways/setting-up.md). Each command has a **Copy** button that fills in your gateway's registration token.

!!! danger "The registration token is issued once"
    It's shown only once. If you need a new one, click **Reconfigure** on the gateway's page, which revokes the old token.

### Step 4: Install and start the gateway

Run these on the machine where the gateway will run. Copy each command from the gateway's **Quick Start** tab so the values are filled in for you.

1. **Download the gateway:**

    ```bash
    curl -sLO https://github.com/wso2/api-platform/releases/download/ai-gateway/v1.1.0/wso2apip-ai-gateway-1.1.0.zip && \
    unzip wso2apip-ai-gateway-1.1.0.zip
    ```

2. **Configure the gateway.** Create `wso2apip-ai-gateway-1.1.0/configs/keys.env`. Copying from the **Quick Start** tab fills in the registration token and the analytics key:

    ```bash
    MOESIF_KEY=<filled in for you>
    GATEWAY_CONTROLPLANE_HOST=connect.bijira.dev
    GATEWAY_REGISTRATION_TOKEN=<filled in for you>
    ```

    `MOESIF_KEY` is optional and enables usage analytics. On Windows, create this file in a text editor, or run these commands from Git Bash or Windows Subsystem for Linux (WSL).

3. **Start the gateway.** It runs in the foreground, so use a second terminal for the rest of this guide:

    ```bash
    cd wso2apip-ai-gateway-1.1.0
    docker compose --env-file configs/keys.env up
    ```

The gateway connects to the control plane, and its logs show `Control plane connection established`. Back in AI Workspace, the gateway's status changes from **Inactive** to **Active**, and the page shows **Your gateway is connected successfully**:

![AI Gateway page with a green Active status and a connected-successfully message](../../assets/img/ai-gateway/ai-workspace/quickstart/ai-gateway-connected.png)

Keep this gateway running for the rest of this guide.

## Part 3: Configure an LLM provider

An LLM provider connects AI Workspace to an AI service platform, such as OpenAI, Anthropic, or Mistral AI. You give AI Workspace your provider credentials once; the clients that call your gateway never see them. LLM providers belong to the organization, not a single project, so every project in your organization can use the one you create here. For background, see [LLM providers](llm-providers/overview.md). This part creates a provider, allows a model, deploys the provider to your gateway, and generates an API key.

### Step 5: Configure an LLM provider

This section configures Mistral AI as a worked example. The same steps apply to any of the six built-in providers.

1. Navigate to **LLM Providers** in the left navigation menu, then click **Create Provider**.
2. Select a provider tile. The built-in options are **Anthropic**, **Azure AI Foundry**, **Azure OpenAI**, **Gemini**, **Mistral**, and **OpenAI**. Select **Mistral**.

    ![Provider selection panel with tiles for OpenAI, Mistral, Gemini, Azure OpenAI, Azure AI Foundry, and Anthropic](../../assets/img/ai-gateway/ai-workspace/quickstart/select-llm-provider.png)

    !!! tip "Using a different provider?"
        The steps below are the same for any of them. Azure OpenAI and Azure AI Foundry also need the **Upstream URL** from your Azure resource.

3. Fill in the provider form:
    - **Name**: for example, `Mistral Provider`.
    - **Version**: pre-filled, for example `v1.0`.
    - **Description**: optional.
    - **Context**: the URL path segment this provider is reachable under, for example `/mistral`.
    - **API Key**: your Mistral AI API key. Mistral's endpoint URL is pre-configured automatically.

    ![Provider form with Mistral selected and the name, context, and API key filled in](../../assets/img/ai-gateway/ai-workspace/quickstart/configure-mistral-provider.png)

    The **Guardrails & Policies** panel pre-selects a suggested `llm-cost` guardrail. Leave it, remove it, or add more later from the provider's **Guardrails & Policies** tab. See [Policies overview](policies/overview.md).

4. Click **Add Provider**.

AI Workspace encrypts the API key before storing it. The plaintext value is never saved. AI Workspace also imports the provider's OpenAPI specification automatically. It shows a progress tracker with three remaining steps: **Add Guardrails**, **Deploy to Gateway**, and **Consume LLM Provider**. For other providers, including the Azure OpenAI and Azure AI Foundry fields, see [Configure an LLM provider](llm-providers/configure-provider.md).

### Step 6: Add a model

The provider's **Models** tab lists the models available through it.

1. On the provider's page, click the **Models** tab.
2. Confirm `mistral-small-latest` is already listed as a chip. Mistral ships with a few common models available by default. To add a different model instead, type its ID into the input field and press <kbd>Enter</kbd> to add it as a chip.

3. Click **Save**.

### Step 7: Deploy the provider

A provider isn't reachable until you deploy it to a running gateway.

1. On the provider's page, click **Deploy to Gateway** in the top right corner. This opens a dedicated deployment page listing your gateways.
2. Confirm the gateway from [Part 2](#part-2-connect-an-ai-gateway) shows a status of **Active**, then click **Deploy** next to it.

The deployment status changes to **Active** within a few seconds, without needing to refresh the page, and the running gateway logs `Configuration deployed successfully`:

![Deploy to Gateway page with the deployment status Active and a history entry](../../assets/img/ai-gateway/ai-workspace/quickstart/provider-deployed-to-gateway.png)

### Step 8: Generate an API key

The **API Keys** section on the provider's **Overview** tab only appears once the provider is deployed to at least one gateway. You won't see it before this point.

1. Go back to the provider's **Overview** tab. After you deploy the provider, an **Invoke URL** section and an **API Keys** section appear.
2. Under **Invoke URL**, select your gateway from the **Gateways** dropdown and copy the URL shown, for example `https://localhost:8443/mistral`.
3. Under **API Keys**, click **Generate API Key**.
4. Enter a **Key Name**, for example `quickstart-test-key`, and click **Generate**.

    ![API key generated dialog with the header name and a sample curl command](../../assets/img/ai-gateway/ai-workspace/quickstart/generated-api-key.png)

!!! danger "Copy the key"
    An API key is displayed only once, in a dialog that also shows a ready-to-run `curl` command using one of the provider's models. Store the key securely immediately. You can't retrieve it again, though you can always generate a new one. It's also different from the Mistral API key you added earlier: the Mistral key authenticates AI Workspace to Mistral, while this key authenticates your own callers to the gateway.

## Part 4: Run your first prompt

This part sends a real chat completion request through your deployed provider and confirms the response.

By default, this provider authenticates requests with the `X-API-Key` header, the same header named on the provider's **Security** tab. Mistral AI exposes an OpenAI-compatible API at `/v1`, so append that to the Invoke URL to reach the chat completions resource.

The following example assumes the Mistral AI provider from Part 3. If you configured a different kind of provider instead, this exact request path and body don't apply. Anthropic and Gemini each use their own native request shape. Azure OpenAI and Azure AI Foundry use the same OpenAI-compatible shape as this example, but need your Azure deployment name instead of a model ID. See [Invoke providers and proxies via SDKs](using-sdks.md) for the equivalent call.

```bash
curl -k -X POST "<INVOKE_URL>/v1/chat/completions" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: <YOUR_GENERATED_API_KEY>" \
  -d '{
    "model": "mistral-small-latest",
    "messages": [
      { "role": "user", "content": "Say hello in exactly five words." }
    ]
  }'
```

!!! tip "Certificate warning?"
    The `-k` flag accepts the gateway's self-signed local certificate, which is expected for a local gateway.

A successful response returns `200 OK` with a chat completion:

```json
{
  "id": "7e22aefb0dac4c3ba1080d34ad8a3da5",
  "object": "chat.completion",
  "created": 1786112464,
  "model": "mistral-small-latest",
  "choices": [
    {
      "index": 0,
      "finish_reason": "stop",
      "message": {
        "role": "assistant",
        "content": "Hello there, how are you?"
      }
    }
  ],
  "usage": { "prompt_tokens": 10, "completion_tokens": 9, "total_tokens": 19 }
}
```

Your `id`, `created` timestamp, and `content` will differ. A `200` status with a `choices` array confirms the request reached Mistral through your gateway. If you see `504 upstream request timeout` instead, see [Troubleshooting](#troubleshooting).

At this point, you have an AI Gateway, connected through AI Workspace to Mistral AI. You just sent a real chat completion through that gateway with a key you generated yourself. AI Workspace, the AI Gateway, and the upstream provider all worked together to complete that request.

## Part 5: Configure an MCP proxy

An MCP proxy exposes a Model Context Protocol (MCP) server through AI Workspace, so any MCP client can discover the server's tools, resources, and prompts through the gateway, with the same authentication and governance as your LLM traffic. Unlike an LLM provider, an MCP proxy belongs to a single project, so make sure you're in the right project before you create one. For background, see [MCP proxies](mcp-proxies/overview.md). This part creates a proxy from a hosted sample MCP server, then deploys it to your gateway.

### Step 9: Create an MCP proxy

AI Workspace includes a hosted sample MCP server, so you don't need to run one yourself.

1. Navigate to **MCP Proxies** in the left navigation menu, then click **Create MCP Proxy**.
2. Click **Try with Sample URL**, then click **Fetch Server Info**.

    ![Create MCP Proxy screen with the sample URL and the fetched tools, resources, and prompts](../../assets/img/ai-gateway/ai-workspace/quickstart/mcp-create-proxy.png)

    AI Workspace fetches the server's capabilities and lists them: 4 tools (including `echo` and `add`), 10 resources, and 3 prompts.

    !!! note "Using your own MCP server?"
        Paste its URL instead of using the sample. It must be reachable from AI Workspace over the internet. AI Workspace fetches its capabilities from the hosted side, so a `localhost` URL won't work. Add credentials under **Advanced Configurations** if the server needs them. See [Configure an MCP proxy](mcp-proxies/configure-proxy.md) for details on connecting a protected server.

3. Click **Next**.
4. Fill in the proxy details:
    - **Name**: a unique name, for example `bijira-mcp-everything`.
    - **Version**: pre-filled, for example `v1.0`.
    - **Description**: optional.
    - **Context**: pre-filled from the name, prefixed with your project's name, for example `/default/bijira-mcp-everything` for a proxy created in the **Default** project from Part 1.
    - **Target**: pre-filled with the server URL from step 2.
5. Click **Create**.

The proxy page opens with a **Capabilities** tab listing its tools, resources, and prompts, and a progress tracker with the remaining steps: **Configure Policies**, **Deploy to Gateway & Test**, and **Publish to MCP Hub**. See [MCP proxies overview](mcp-proxies/overview.md) for what each capability type means.

### Step 10: Deploy the proxy

1. On the proxy's page, click **Deploy to Gateway** in the top right corner. This opens a dedicated deployment page listing your gateways.
2. Confirm the gateway from [Part 2](#part-2-connect-an-ai-gateway) shows a status of **Active**, then click **Deploy** next to it.

The deployment status changes to **Active** within a few seconds, without needing to refresh the page, and the running gateway logs `Configuration deployed successfully` with `kind=Mcp`:

![MCP proxy Deploy to Gateway page with the deployment status Active](../../assets/img/ai-gateway/ai-workspace/quickstart/mcp-proxy-deployed.png)

## Part 6: Call your first MCP tool

This part sends a real tool call through your deployed MCP proxy and confirms the response.

Go back to the proxy's **Overview** tab. Under **MCP Proxy URL**, select your gateway from the **Gateways** dropdown and copy the URL shown. It ends in `/mcp`, for example, `https://localhost:8443/default/bijira-mcp-everything/mcp`.

![MCP proxy Overview tab with the gateway-specific MCP Proxy URL and the capabilities list](../../assets/img/ai-gateway/ai-workspace/quickstart/mcp-proxy-url.png)

Every MCP client starts a session with an `initialize` request before it can call a tool. Replace `<MCP_PROXY_URL>` with the URL you copied, then run:

```bash
curl -ki -X POST "<MCP_PROXY_URL>" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "initialize",
    "params": {
      "protocolVersion": "2025-06-18",
      "capabilities": {},
      "clientInfo": { "name": "getting-started", "version": "1.0.0" }
    }
  }'
```

The `-i` flag prints the response headers. Copy the `Mcp-Session-Id` value. You need it for the next command.

Call the sample `add` tool. Replace `<MCP_PROXY_URL>` and `<SESSION_ID>` with your values:

```bash
curl -k -X POST "<MCP_PROXY_URL>" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -H "Mcp-Session-Id: <SESSION_ID>" \
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "tools/call",
    "params": { "name": "add", "arguments": { "a": 4, "b": 5 } }
  }'
```

A successful response returns `200 OK` with the tool's actual output:

```text
event: message
data: {"result":{"content":[{"type":"text","text":"The sum of 4 and 5 is 9."}]},"jsonrpc":"2.0","id":2}
```

That result means your request reached the sample server's `add` tool and came back through the gateway. To explore the other tools interactively, point an MCP client such as [MCP Inspector](https://github.com/modelcontextprotocol/inspector) at the same URL.

The sample proxy has no authentication policy, so these calls need no key. Keep this sample only while the gateway listens on `localhost`. Add the [MCP Authentication policy](mcp-proxies/apply-policies.md) before you deploy this proxy to a gateway reachable from anywhere else.

At this point, you also have that same AI Gateway routing governed traffic to an MCP server, alongside the LLM provider from Part 3. AI Workspace configures both from one place.

## Verify everything works end to end

To confirm every piece is in place:

- [ ] You can sign in to AI Workspace and see your organization in the Console.
- [ ] An AI Gateway is registered and shows a status of **Active**.
- [ ] An LLM provider is configured with at least one model on its **Models** tab.
- [ ] The provider is deployed to your gateway, with a deployment status of **Active**.
- [ ] A generated API key successfully authenticates a real chat completion request through the gateway.
- [ ] An MCP proxy is configured and deployed to your gateway, with a deployment status of **Active**.
- [ ] An `initialize` request and a `tools/call` request both succeed against the MCP proxy's URL.

From here, every change you make in AI Workspace (a guardrail, a rate limit, an extra model, another back end) is pushed to the gateway without touching client code. Callers keep using the same URLs and keys.

## Troubleshooting

If something doesn't work as expected, check here before anything else:

| Symptom | Likely cause | Fix |
|---|---|---|
| Gateway stays **Inactive** | Can't reach `connect.bijira.dev`, or the token in `keys.env` is incorrect. | Check the `docker compose` logs. Click **Reconfigure** on the gateway's page for a new token, update `keys.env`, and restart. See [Set up an AI Gateway](ai-gateways/setting-up.md). |
| First LLM request returns `504 upstream request timeout` | The gateway hasn't received the latest configuration yet. | Wait about a minute and retry. |
| LLM request returns `401` | The `X-API-Key` header is missing or incorrect. | Use the key from [Part 3](#part-3-configure-an-llm-provider), exactly as generated. |
| MCP `initialize` request fails or times out | The gateway isn't running, or the URL is wrong. | Confirm `docker compose` is still running, and that you copied the full **MCP Proxy URL**. |
| Creating an MCP proxy from your own server fails to fetch info | AI Workspace can't reach that URL from its hosted side. | Use a publicly reachable URL, or click **Try with Sample URL** instead. |

## Next steps

- [Manage an LLM provider](llm-providers/manage-provider.md): configure connection, access control, security, rate limiting, and guardrails for the provider you just created
- [Create an App LLM Proxy](llm-proxies/overview.md): give one application its own endpoint, key, and policies on top of a shared provider
- [Configure an App LLM Proxy](llm-proxies/configure-proxy.md): add an application-specific endpoint on top of a provider, with its own guardrails and access rules
- [Manage an App LLM Proxy](llm-proxies/manage-proxy.md): configure provider settings, resources, security, and guardrails for an existing proxy
- [Invoke providers and proxies via SDKs](using-sdks.md): call your deployed endpoint from the OpenAI, Anthropic, Gemini, Mistral, Azure OpenAI (including Azure AI Foundry), or LangChain software development kits (SDKs)
- [Add a guardrail](policies/guardrails/overview.md): apply content safety, personally identifiable information (PII) masking, or prompt checks, then send a request that trips one
- [Apply MCP policies](mcp-proxies/apply-policies.md): add authentication, authorization, and access control to the MCP proxy you just created
- [Limit cost and volume](policies/rate-limit/llm-cost.md): cap spend and requests per key
- [GenAI applications](genai-applications.md): group API keys under a named application for usage visibility and governance
- [Configure inbound authentication](configure-inbound-auth.md): change the header name your applications use to call a provider or proxy
- [Set up an AI Gateway](ai-gateways/setting-up.md): run the gateway on a VM or Kubernetes instead of locally, and manage or reconfigure it