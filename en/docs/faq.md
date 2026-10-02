---
title: "WSO2 API Platform FAQ"
description: "Answers to common questions about WSO2 API Platform deployment options, AI Gateway, AI Workspace, MCP Proxies, policies, and API security."
canonical_url: https://wso2.com/api-platform/docs/faq/
md_url: https://wso2.com/api-platform/docs/faq.md
tags:
  - faq
  - api-management
  - ai-gateway
  - ai-workspace
  - mcp
  - policies
  - deployment-options
author: WSO2 API Platform Documentation Team
last_updated: 2026-09-29
content_type: "faq"
---

# Frequently asked questions

This page answers common questions about WSO2 API Platform. It's for developers, platform engineers, and administrators who evaluate or use the platform. The questions cover deployment options and how to govern Large Language Model (LLM) and Model Context Protocol (MCP) traffic. 

## Platform and deployment options

### What is WSO2 API Platform?

WSO2 API Platform helps you manage, secure, and govern APIs and AI services. It covers the full API lifecycle:

- Design
- Deployment
- Testing
- Governance
- Monetization

The platform handles three kinds of traffic:

- **API traffic:** REST, WebSocket, and GraphQL APIs.
- **LLM traffic:** requests from your applications to LLM providers such as OpenAI and Anthropic.
- **MCP traffic:** requests from AI agents to tools that MCP servers expose.

For a map of every component, see the [Platform overview](index.md).

### Which deployment option should I choose?

Choose based on who runs the control plane and who runs the gateways. The following table summarizes the three platform options:

| Option | Control plane | Gateways | Choose it when |
| :--- | :--- | :--- | :--- |
| **Cloud** | WSO2 managed | WSO2 managed | You don't want to manage infrastructure. |
| **Hybrid** | WSO2 managed | Self-hosted | API traffic must stay in your own infrastructure. |
| **Self-managed (API Manager)** | Self-hosted | Self-hosted | You need full control, including air-gapped environments. |

If you only need a gateway, run the standalone [API Gateway](api-gateway/1.2.0/overview.md) or [AI Gateway](ai-gateway/1.2.0/overview.md). Standalone gateways have no web UI or control plane. For a detailed comparison, see [How do the three options compare?](index.md#how-do-the-three-options-compare).

### What is the difference between standalone mode and platform mode?

Standalone mode and platform mode use the same gateway, built on the same Go-based runtime and policy engine. The difference is how you configure the gateway:

- **Platform mode:** the gateway connects to a control plane. You manage APIs, policies, and subscriptions through the web UI.
- **Standalone mode:** the gateway runs on its own. You configure it through YAML files, the CLI, or REST APIs.

For the full comparison, see [What is the difference between standalone mode and platform mode?](index.md#what-is-the-difference-between-standalone-mode-and-platform-mode).

### Can I move from one deployment option to another later?

Yes. All options use the same underlying gateway technology. You can start with Cloud and move to Hybrid or Self-managed without rearchitecting.

A common adoption path starts with a standalone gateway. You can later connect that gateway to one of the following control planes:

- The Cloud control plane
- A self-hosted AI Workspace
- The API Manager control plane

### How does API Platform Cloud relate to WSO2 API Manager?

API Platform Cloud is the WSO2-managed software as a service (SaaS) offering of WSO2 API Platform. You manage it through the [API Platform Console](https://console.bijira.dev/).

WSO2 API Manager is the self-managed option. Starting with version 4.7, API Manager uses the same Go-based gateway runtime as Cloud and Hybrid. [See API Manager documentation](https://apim.docs.wso2.com/en/latest/).

### Does my API traffic pass through WSO2 infrastructure?

It depends on where the gateways run. Your API Proxies run and process traffic in the [data plane](cloud/bijira-concepts/data-planes.md):

- **Cloud:** WSO2-managed gateways process your traffic.
- **Hybrid:** self-hosted gateways process your traffic. Your traffic never leaves the infrastructure you manage.

API Platform Cloud supports two types of data planes:

- **Cloud data planes:** shared, multi-tenant infrastructure that runs your API Proxies.
- **Private data planes:** dedicated infrastructure for a single organization. You can deploy them on-premises or on most major cloud providers, such as Azure, AWS, and Google Cloud Platform (GCP).

All communication from a private data plane to the control plane is outbound, and TLS encrypts it.

## Getting started

### How do I get started with WSO2 API Platform?

To get started, follow these steps:

1. Choose a deployment option. If you're unsure, read the [Platform overview](index.md).
2. Open the [Get Started](get-started.md) page and pick the quick start guide for your goal.
3. For Cloud, sign in to the [API Platform Console](https://console.bijira.dev/) and create an [organization](cloud/bijira-concepts/organization.md). You can sign in with a Google, GitHub, or Microsoft account.
4. Complete the quick start guide, for example [publish your first API Proxy](cloud/introduction/quick-start-guide.md).

### Which API types can I manage on Cloud?

On Cloud, you can create API Proxies for REST, WebSocket, and GraphQL APIs. You can also create proxies for third-party APIs, including AI APIs from LLM providers.

The ways you can create an API Proxy depend on the API type. The following table shows which creation paths each API type supports:

| Creation path | REST | WebSocket | GraphQL |
| :--- | :--- | :--- | :--- |
| **Import an API contract** | Yes | Yes | Yes |
| **Import an API contract from GitHub** | Yes | No | No |
| **Start with an endpoint** | Yes | Yes | Yes |
| **Start from scratch** | Yes | Yes | No |
| **Create with generative AI (GenAI)** | Yes | Yes | No |

For an introduction to API Proxies on Cloud, see the [Create API Proxy overview](cloud/create-api-proxy/overview.md).

### How do I check that a gateway is running?

The check depends on how you run the gateway.

For a standalone API Gateway or AI Gateway, call the Gateway-Controller admin health endpoint. It listens on port `9094` by default:

```bash
curl http://localhost:9094/api/admin/v1/health
```

For a Self-Hosted Gateway connected to API Platform Cloud, call the gateway's health endpoint:

```bash
curl http://localhost:9002/health
```

A connected Self-Hosted Gateway also shows as **Active** under **Gateways** in the API Platform Console. For the full setup, see the guide for your gateway:

- [API Gateway quick start guide](api-gateway/1.2.0/quick-start-guide.md)
- [AI Gateway quick start guide](ai-gateway/1.2.0/quick-start-guide.md)
- [Getting started with the Self-Hosted Gateway](cloud/api-platform-gateway/getting-started.md)

## AI Gateway and AI Workspace

### What is the difference between AI Gateway and AI Workspace?

The AI Gateway is the data plane, and AI Workspace is the control plane:

- **AI Gateway** processes AI traffic. It routes, secures, and observes requests to LLM providers and MCP servers.
- **AI Workspace** manages AI configuration. It does the following:
    - Registers gateways.
    - Stores provider credentials.
    - Applies policies.
    - Deploys configuration to one or more gateways.

Changes you make in AI Workspace don't affect live traffic until you deploy them to a gateway. For more information, see the [AI Workspace overview](ai-workspace/1.0.0/overview.md).

### When should I use AI Workspace instead of a standalone AI Gateway?

Use AI Workspace when you want one place to govern AI traffic across your organization. It's available in Cloud and as a self-hosted control plane. AI Workspace gives you a UI for the following tasks:

- Gateway registration
- Provider and proxy management
- Policy configuration
- Deployments

Use a standalone AI Gateway to work directly with the gateway runtime. You configure it through the Gateway-Controller API. You can connect a standalone gateway to AI Workspace later.

### What is the difference between an LLM Proxy and an MCP Proxy?

Both run on the AI Gateway, but they govern different traffic:

- An **LLM Proxy** is an endpoint your AI application calls to reach an LLM provider, such as OpenAI. It applies guardrails, rate limits, and prompt policies to that traffic.
- An **MCP Proxy** is an endpoint AI agents call to reach an MCP server and its tools. It applies authentication, authorization, and access control to MCP traffic.

An LLM Proxy sends traffic through an LLM Provider. An MCP Proxy routes to its MCP server directly, without a provider. For more information, see [How the AI Gateway works](ai-gateway/1.2.0/how-it-works.md).

### What is the difference between an LLM Provider and an LLM Proxy?

An *LLM Provider* is the connection from the gateway to an upstream AI service. Administrators configure it with the following details:

- The service URL
- Credentials
- Access control rules
- Organization-wide policies

An *LLM Proxy* is a custom endpoint that consumes an LLM Provider. Each LLM Proxy has its own URL context, such as `/assistant`. Developers create one when an application needs its own policies. With LLM Proxies, several applications can share one LLM Provider. In AI Workspace, this application-facing endpoint is called an App LLM Proxy.

Because applications call the proxy URL, you can swap the underlying LLM Provider without changing client code. For more information, see the [App LLM Proxies overview](cloud/ai-workspace/llm-proxies/overview.md).

### What is an LLM Provider Template?

An *LLM Provider Template* describes how the gateway reads a specific AI service's requests and responses. It tells the gateway where to find token counts and model details in those requests and responses.

The AI Gateway ships with built-in templates for common providers. For the full list, see [Which LLM providers does the AI Gateway support?](#which-llm-providers-does-the-ai-gateway-support). To connect a service without a built-in template, [create a custom LLM Provider Template](ai-workspace/1.0.0/llm-provider-templates/configure-template.md) in AI Workspace.

### Which LLM providers does the AI Gateway support?

The AI Gateway includes built-in templates for the following providers:

- OpenAI
- Azure OpenAI
- Anthropic
- Gemini
- Mistral AI
- AWS Bedrock
- Azure AI Foundry

For the providers you can configure in AI Workspace on Cloud, see the [LLM Providers overview](cloud/ai-workspace/llm-providers/overview.md).

### How do I control LLM costs?

Combine the following policies on an LLM Provider or an LLM Proxy:

- **Token-Based Rate Limit:** caps prompt, completion, or total tokens within a time window.
- **LLM Cost-Based Rate Limit with a pricing policy:** the pricing policy calculates the cost of each call. LLM Cost-Based Rate Limit rejects traffic after the budget runs out. Pick the pricing policy that matches the endpoint:
    - **LLM Cost:** a vendor's own endpoint.
    - **Azure LLM Cost:** Azure OpenAI and Azure AI Foundry.
- **Semantic Cache:** answers semantically similar prompts from a cache, which skips the upstream call and its token cost.

For more information, see [Cost control and budgets](ai-gateway/1.2.0/cost-control-and-budgets.md), [Token-based rate limiting](ai-gateway/1.2.0/token-based-rate-limiting.md), and [Semantic caching](ai-gateway/1.2.0/semantic-caching.md).

## Policies and guardrails

### What is the difference between a guardrail and a policy?

A *policy* is a self-contained unit of behavior that runs in the gateway's request and response pipeline. Policies handle concerns such as the following:

- Authentication
- Rate limiting
- Transformations
- Logging

A *guardrail* is a category of policy that inspects the content of AI requests and responses. Guardrails block unsafe prompts before they reach a model. They also filter non-compliant output before it reaches the caller. Examples include PII Masking, Azure Content Safety, and the Semantic Prompt Guard.

API governance also uses the word *policy*, for a set of rulesets that the platform enforces on APIs. For more information, see the [API governance overview](cloud/governance/overview.md).

### What happens when a guardrail blocks a request?

In AI Workspace, the following guardrails block a request or response with `422 Unprocessable Entity`:

- Semantic Prompt Guard
- Azure Content Safety
- Word Count
- Sentence Count

The response body has the following structure:

```json
{
  "type": "<GUARDRAIL_TYPE>",
  "message": {
    "action": "GUARDRAIL_INTERVENED",
    "interveningGuardrail": "<guardrail name>",
    "direction": "REQUEST or RESPONSE",
    "actionReason": "<reason for intervention>",
    "assessments": "<detailed assessment (if Show Assessment is enabled)>"
  }
}
```

Some guardrails transform content instead of blocking it. For example, PII Masking Regex masks personally identifiable information (PII) before forwarding the request. For more information, see [Guardrails overview](ai-workspace/1.0.0/policies/overview.md#guardrails).

### What is the Policy Hub?

The [Policy Hub](policy-hub/overview.md) is the curated, versioned collection of gateway policies and guardrails for WSO2 API Platform. It covers the following policy categories:

- Security
- Guardrails
- AI and LLM
- MCP
- Transformation
- Logging, analytics, and monitoring

The [policies are open source](https://github.com/wso2/gateway-controllers). Each policy has its own version track. Earlier versions of a policy stay available after a release. Running deployments don't break.

### Can I write my own policies?

Yes. The API Platform Gateway supports custom policies in two languages:

- **Go:** the default and recommended language. Go policies compile into the Policy Engine binary, for maximum performance.
- **Python (beta):** a Python Executor runtime, suited to AI and machine learning workloads that need Python libraries.

To use a custom policy, build a custom gateway image with the `ap` CLI. See [Writing a custom policy](api-gateway/1.2.0/policies/custom-policies/writing-a-custom-policy.md) and [Building the gateway with custom policies](api-gateway/1.2.0/policies/custom-policies/building-gateway-with-custom-policies.md).

## MCP servers

### Can I turn my REST APIs into MCP tools?

Yes. On Cloud, you can create an MCP Server from any HTTP backend or from an API Proxy. API Platform generates the MCP tool schemas automatically. It also derives default tool names and descriptions from the API contract. You can edit tool names and descriptions afterward.

For the procedure, see [Design and publish MCP servers](cloud/mcp-servers/design-mcp-servers.md). For an end-to-end walkthrough, see [Convert a REST API into an MCP tool and use it in Claude Desktop](guides/ai-and-mcp/convert-rest-api-to-mcp-server.md).

### How do AI agents and developers discover MCP servers?

When you publish an MCP Proxy from AI Workspace, API Platform registers it in your organization's MCP registry. The registry is available in two ways:

- **MCP Hub:** a visual catalog where developers browse MCP servers.
- **MCP Registry API:** a REST API that AI clients, integrated development environment (IDE) plugins, and automation tools query.

For more information, see [What is an MCP registry?](cloud/mcp-servers/mcp-registry.md).

### How do I secure an MCP server?

Attach MCP policies to the MCP Proxy in front of the server:

- **MCP Authentication:** establishes who's calling, per the MCP specification authorization profile.
- **MCP Authorization:** checks that the caller may use a specific tool, resource, or prompt.
- **MCP Access Control:** filters which tools, resources, and prompts a caller can see.
- **MCP Rewrite:** maps user-facing tool names to backend capability names.
- **MCP Rate Limit:** limits calls per tool, resource, prompt, or JSON-RPC method.

For more information, see [MCP governance](ai-gateway/1.2.0/mcp-governance.md).

## API security and consumption

### How do I secure access to my APIs?

API Platform Cloud supports OAuth2 and API key security for API Proxies. For OAuth2, you can use any of the following:

- Asgardeo
- The built-in API Platform Secure Token Service (STS)
- Microsoft Azure Active Directory (Azure AD)
- An external key manager

You can also secure the connection from the gateway to your backend with OAuth2 or mutual TLS (mTLS). To connect your own identity provider, see [Secure API access with an external key manager](cloud/develop-api-proxy/authentication-and-authorization/secure-api-access-with-external-idp.md).

### How do developers consume my APIs?

Developers find and subscribe to APIs in the Developer Portal. To consume an API secured with an API key, a developer follows these steps:

1. Create an application in the Developer Portal.
2. Subscribe the application to the API.
3. Generate an API key for the subscribed API.
4. Send the key in the `api-key` header.

The following example calls an API with an API key:

```bash
curl -H "api-key: <YOUR_API_KEY>" -X GET "https://my-sample-api.bijiraapis.dev/greet"
```

For the full procedure, see [Consume an API secured with API key](cloud/devportal/consuming-services/consume-an-api-secured-with-api-key.md) or [Consume an API secured with OAuth2](cloud/devportal/consuming-services/consume-an-api-secured-with-oauth2.md).

### What are the lifecycle states of an API?

An API on API Platform Cloud moves through the following lifecycle states:

| State | What it means for consumers |
| :--- | :--- |
| **Created** | The API isn't visible in the Developer Portal. |
| **Pre-released** | The API appears in the Developer Portal as a pre-release for early testing. |
| **Published** | The API is visible and open for subscription. |
| **Deprecated** | The API stays available to its subscribers but accepts no more subscriptions. |
| **Retired** | The API is unpublished and removed from the Developer Portal. |

To change an API's state, see [Lifecycle management](cloud/develop-api-proxy/lifecycle-management.md).

### Can I charge for API usage?

Yes, when you use the platform with a control plane. Standalone gateways don't include monetization.

API monetization lets you offer paid subscription plans, with Stripe as the payment provider. You can use the following pricing models:

- Free
- Flat
- Unit
- Volume
- Graduated

Consumers discover and subscribe to paid plans in the Developer Portal. To set it up, see the [API monetization overview](monetization/overview.md).

### Can I manage APIs that run on third-party gateways?

Yes. Gateway federation brings APIs from external gateways under one control plane. Examples of these gateways include AWS, Azure, Kong, and Envoy. With gateway federation, you can do the following:

- Discover APIs on external gateways.
- Apply governance to those APIs.
- Publish them to the Developer Portal alongside your WSO2-managed APIs.

For more information, see the [gateway federation overview](cloud/federation/overview.md) and [Discover APIs from AWS API Gateway](cloud/federation/api-discovery-aws.md).

## Monitoring and troubleshooting

### How do I find out whether an issue is caused by a platform incident?

Check the [API Platform Status Page](https://status.bijira.dev/). It shows the following information:

- The status of each platform service and region: **Operational**, **Maintenance**, **Degraded**, or **Outage**.
- Active incidents.
- Scheduled maintenance.

You can subscribe to status updates from the page. For more information, see [API Platform Status Page](cloud/monitoring-and-insights/status-page.md).

### Where can I see logs and traffic metrics for my APIs?

API Platform Cloud provides the following observability features:

- **Runtime logs:** investigate request-level issues in your APIs.
- **Audit logs:** review the organization-level operations that users perform in the API Platform Console.
- **Insights:** monitor errors and performance across your API, LLM, and MCP traffic.

To get started, see the [logs overview](cloud/monitoring-and-insights/logs/overview.md) and [Insights](cloud/monitoring-and-insights/insights.md).

## Related resources

- [Platform overview](index.md): components, deployment options, and key concepts.
- [Get Started](get-started.md): quick start guides organized by goal.
- [Guides](guides/ai-and-mcp/convert-rest-api-to-mcp-server.md): end-to-end scenarios that combine several platform features.
- [Policy Hub](policy-hub/overview.md): the curated collection of policies and guardrails for APIs, LLM traffic, and MCP servers.
- [API Portal and MCP Hub concepts](api-portal/1.0.0/concepts.md): organizations, views, applications, subscriptions, and API keys in the self-hosted portal.
