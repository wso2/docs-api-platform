---
title: "WSO2 API Platform FAQ"
description: "Answers to common questions about WSO2 API Platform deployment, AI Gateway, MCP, security, monetization, and monitoring."
canonical_url: https://wso2.com/api-platform/docs/faq/
md_url: https://wso2.com/api-platform/docs/faq.md
tags:
  - faq
  - api-management
  - ai-gateway
  - ai-workspace
  - mcp
  - a2a
  - policies
  - deployment-options
author: WSO2 API Platform Documentation Team
last_updated: 2026-10-08
content_type: "faq"
---

# Frequently asked questions

This page answers common questions about WSO2 API Platform. It's for developers, platform engineers, administrators, and API product managers who evaluate or use the platform. The questions cover the following topics:

- Deployment options and getting started
- API design, testing, and governance
- AI Gateway and AI Workspace for Large Language Model (LLM) and Model Context Protocol (MCP) traffic, plus Agent2Agent (A2A) traffic (Upcoming)
- Policies, guardrails, and MCP servers
- API security, consumption, and monetization
- Monitoring and troubleshooting

## Platform and deployment options

### What is WSO2 API Platform?

WSO2 API Platform helps you manage, secure, govern, and monetize APIs and AI services. It covers the full API lifecycle:

- Design
- Deployment
- Testing
- Governance
- Monetization

The platform consists of the following components:

- **API Gateway:** a Go-based gateway for API traffic, both inbound and outbound.
- **AI Gateway:** a Go-based gateway for LLM, MCP, and A2A (Upcoming) traffic, both inbound and outbound.
- **Event Gateway (Beta):** a gateway for event-based integrations, such as Kafka and WebSub.
- **API Control Plane:** central governance, lifecycle management, and federation across WSO2 and third-party gateways.
- **AI Workspace:** a dedicated control plane for managing AI services.
- **API Portal and MCP Hub:** a developer portal where developers and AI agents discover and consume APIs and MCP servers.
- **Monetization:** analytics and usage-based billing, powered by Moesif.

Each component is a separate product. You can start with one component, such as the AI Gateway, and add others as your needs grow. For a map of every component, see the [Platform overview](index.md).

### Is WSO2 API Platform open source?

Yes, except for Monetization. Every other component is open source under the Apache 2.0 license, with no feature gates. You can download and run a full production instance without signing up. Monetization runs as a SaaS service.

The policies in the [Policy Hub](policy-hub/overview.md) are also open source. The API Gateway and AI Gateway build on Envoy Proxy, with a Go-based policy engine that WSO2 develops.

### Which deployment option should I choose?

Choose based on who runs the control plane and who runs the gateways. The following table summarizes the four deployment options:

| Option | Control plane | Gateways | Choose it when |
| :--- | :--- | :--- | :--- |
| **Cloud (SaaS)** | WSO2 managed | WSO2 managed | You don't want to manage infrastructure. |
| **Hybrid** | WSO2 managed | Self-hosted | API traffic must stay in your own infrastructure. |
| **Self-managed** | Self-hosted | Self-hosted | You need full control, including air-gapped environments. |
| **Standalone** | None | Self-hosted | You only need a gateway that you configure as code. |

Cloud, Hybrid, and Self-managed deployments have the same features. For a self-managed deployment, you can run WSO2 API Manager. It bundles the components into one package. You can also deploy individual components on your own infrastructure. Self-managed deployments support multi-tenancy.

WSO2 can also operate the control plane and gateways for you in your own cloud account or data center. For a detailed comparison, see [How do the three options compare?](index.md#how-do-the-three-options-compare).

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

When you connect a standalone AI Gateway to AI Workspace, the gateway and the control plane keep your data.

### How does API Platform Cloud relate to WSO2 API Manager?

API Platform Cloud is the WSO2-managed software as a service (SaaS) offering of WSO2 API Platform. You manage it through the [API Platform Console](https://console.bijira.dev/).

WSO2 API Manager is the all-in-one, self-managed package. Starting with version 4.7, the API Manager control plane connects to two gateway runtimes:

- **Platform Gateway:** the Go-based gateway that Cloud and Hybrid also use.
- **Classic Gateway:** the Java-based gateway from earlier API Manager versions.

You can run new projects on the Platform Gateway while your other APIs continue on the Classic Gateway. This lets you move to the Go-based gateway at your own pace, from one control plane. For more information, see the [API Manager documentation](https://apim.docs.wso2.com/en/latest/).

### Where can I run the gateways?

You can run the gateways on virtual machines, on Docker, or on Kubernetes. For Kubernetes, the gateways support Helm charts, an operator, and custom resource definitions (CRDs).

The gateways come in three runtime variants:

- **Platform Gateway:** the Go-based gateway for inbound and outbound traffic.
- **Kubernetes Gateway:** the same runtime, compliant with the Kubernetes Gateway API specification.
- **Immutable Gateway:** the same runtime with its configuration built in, for air-gapped and edge environments.

For more information, see [Kubernetes deployment](api-gateway/1.2.0/deployment/deployment-modes/kubernetes/overview.md) and [Immutable Gateway](api-gateway/1.2.0/deployment/deployment-modes/immutable-gateway.md).

### How do the gateways scale?

The gateways are stateless, so they scale horizontally. Each gateway handles analytics and rate limiting asynchronously, with no synchronous dependency on databases or file storage. Because a gateway starts in a few seconds, it can absorb traffic spikes.

Scale-out follows the autoscaling rules of your platform. For example, on Kubernetes, a Horizontal Pod Autoscaler can add gateways based on CPU and memory use. On API Platform Cloud, gateways scale up, scale down, and scale to zero.

### Does my API traffic pass through WSO2 infrastructure?

It depends on where the gateways run. Your API Proxies run and process traffic in the [data plane](cloud/bijira-concepts/data-planes.md):

- **Cloud:** WSO2-managed gateways process your traffic.
- **Hybrid:** self-hosted gateways process your traffic. Your traffic never leaves the infrastructure you manage.

API Platform Cloud supports two types of data planes:

- **Cloud data planes:** shared, multi-tenant infrastructure that runs your API Proxies.
- **Private data planes:** dedicated infrastructure for a single organization. You can deploy them on-premises or on most major cloud providers, such as Azure, AWS, and Google Cloud Platform (GCP).

All communication from a private data plane to the control plane is outbound, and TLS encrypts it.

### Where is API Platform Cloud hosted?

API Platform Cloud runs on Microsoft Azure in two regions:

- **US East:** serves the United States.
- **North Europe:** serves all of Europe.

For other regions, or for single-tenant deployments, you can use a private SaaS data plane on AWS, Azure, or GCP. To keep API traffic and data inside national borders, deploy on-premises, in a private cloud, or in a hybrid setup. Data that moves from the European Union and the United Kingdom to other WSO2 entities follows the EU Standard Contractual Clauses.

### Which compliance certifications does WSO2 API Platform have?

WSO2 API Platform holds the following certifications and attestations:

- **SOC 2 Type 2:** covers WSO2's public cloud offerings, including WSO2 API Platform, for the Security, Confidentiality, and Availability trust service criteria. It includes aligned HITRUST CSF controls. Self-hosted offerings aren't in scope.
- **PCI DSS:** API Platform SaaS is certified on PCI DSS v4.0.1 Level 1.
- **HIPAA:** an independent auditor attests that API Platform SaaS is HIPAA compliant.
- **ISO/IEC 27001:2022:** covers WSO2's Digital Operations function. This function manages access to WSO2 infrastructure and endpoints.

WSO2 API Platform also supports the following regulations and standards:

- **GDPR:** a Privacy Toolkit supports user data anonymization, consent management, and the right to be forgotten, in both the software and SaaS offerings.
- **EU-U.S. Data Privacy Framework:** WSO2 complies with the framework and its UK and Swiss extensions.
- **CCPA:** integration with WSO2 Identity Platform supports data access, deletion, and opt-out requests.
- **DORA:** WSO2 complies with the applicable provisions as a non-critical ICT third-party provider for its on-premises products.
- **EU AI Act:** gateway audit trails, guardrail enforcement, and model usage records help you meet its governance, transparency, and logging obligations.
- **WCAG 2.1:** the Developer Portal conforms to Level A and Level AA accessibility criteria.

For details by product, region, and industry, see [WSO2 security and compliance](https://wso2.com/security/compliance).

### Does WSO2 offer industry accelerators?

Yes. WSO2 provides accelerators for regulated industries:

- **Banking and financial services:** Open Banking for regional standards such as UK Open Banking, the Berlin Group, and PSD2. Also Open Finance, Financial Data Exchange (FDX), BIAN, ISO 20022 and ISO 8583, and SWIFT MT-to-MX translation.
- **Healthcare:** FHIR and HL7 accelerators, prebuilt FHIR APIs, SMART on FHIR support, EHR and EMR connectors, and prebuilt healthcare guardrails for the AI Gateway.

For more information, see [WSO2 financial services solutions](https://wso2.com/solutions/financial-services/) and [WSO2 healthcare solutions](https://wso2.com/solutions/healthcare/).

### Can I manage the platform as code?

Yes. You configure every component, including the gateways, control plane, Developer Portal, and AI Workspace, through YAML definitions. You can version, review, and audit those definitions in Git.

The platform supports the following infrastructure-as-code workflows:

- **GitOps:** the CLI deploys and promotes APIs, policies, and configurations across environments from Git.
- **Kubernetes:** CRDs and the operator work with GitOps tools such as Argo CD and Flux.
- **Terraform:** a Terraform provider manages platform configuration alongside your infrastructure.
- **CI/CD:** pipelines run governance checks before an API reaches any environment.

For more information, see the [API Platform CLI quick start guide](tools/cli/quick-start-guide.md).

### Does upgrading AI Workspace or the AI Gateway interrupt traffic?

No. AI Workspace, the control plane, upgrades independently of the AI Gateway. Gateways keep their deployed configuration and keep serving traffic during a control plane upgrade or outage.

To upgrade the gateways themselves, use a rolling upgrade. Each gateway stops accepting requests and finishes its in-flight requests before it shuts down. To keep long-lived streams alive, configure an appropriate termination grace period. The gateway stores session token usage and accumulated costs in Redis or a database, so that state survives the rollout.

The AI Gateway follows semantic versioning. Within a major version, its admin APIs and configuration schema stay backward compatible. In a hybrid deployment, WSO2 upgrades the SaaS control plane, and you upgrade your self-hosted gateways.

## Getting started

### How do I get started with WSO2 API Platform?

To get started, follow these steps:

1. Choose a deployment option. If you're unsure, read the [Platform overview](index.md).
2. Open the [Get Started](get-started.md) page and pick the quick start guide for your goal.
3. For Cloud, sign in to the [API Platform Console](https://console.bijira.dev/) and create an [organization](cloud/bijira-concepts/organization.md). You can sign in with a Google, GitHub, or Microsoft account.
4. Complete the quick start guide, for example [publish your first API Proxy](cloud/introduction/quick-start-guide.md).

### Can I try WSO2 API Platform for free?

Yes. You can try the platform in the following ways:

- **Cloud and Hybrid:** sign up for a 30-day free trial, with self-service onboarding and no credit card. The Monetization component has a 14-day free trial. When you're ready, move to a pay-as-you-go plan without contacting sales.
- **Self-hosted evaluation:** download a distribution under an evaluation license, with 90 days of product updates and technical support.
- **Open source:** use the open-source software indefinitely, without updates or support. It includes every component except Monetization.

### Which API types does the platform support?

WSO2 API Platform supports the following API types:

- **REST:** OpenAPI 3.x definitions.
- **GraphQL:** GraphQL schema definitions (SDL).
- **SOAP:** WSDL 1.1 definitions, including SOAP-to-REST transformation for legacy backends.
- **Event-driven and streaming:** AsyncAPI definitions for WebSocket, WebSub, webhooks, and Server-Sent Events (SSE).
- **AI APIs:** LLM Proxies built on LLM provider templates.
- **MCP servers:** MCP Proxies and generated MCP servers.
- **API Products:** bundles of selected resources from several APIs, with their own lifecycle.

You can also register, catalog, and govern gRPC and other external service contracts.

### Which API types can I create on Cloud?

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

### Does the platform support event-driven and streaming APIs?

Yes. You define, document, and publish event-driven APIs with AsyncAPI. The platform manages WebSocket, SSE, WebSub, and webhook APIs, plus gRPC and GraphQL subscriptions for streaming. You can also publish and consume Kafka topics as managed APIs.

Event-driven APIs get the same management as other APIs:

- Lifecycle management, from design to retirement
- Security with OAuth2, JWT, and mutual TLS (mTLS)
- Throttling, quotas, and rate limiting
- Subscriptions and monetization
- Analytics and observability

The Event Gateway (Beta) runs as a standalone gateway or as a self-hosted gateway connected to a control plane. The platform also federates external event platforms, such as Solace. For more information, see the [Event Gateway overview](cloud/event-gateway/overview.md).

### How do I check that a gateway is running?

The check depends on how you run the gateway.

For a standalone API Gateway or AI Gateway, call the Gateway Controller admin health endpoint. It listens on port `9094` by default:

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

## API design, testing, and governance

### What tools help me design APIs?

WSO2 API Platform supports a design-first approach. You can create, import, edit, document, mock, and validate an API contract before you implement it. The following tools help:

- **API Designer:** designs REST, GraphQL, and AsyncAPI APIs. It runs on its own and in Visual Studio Code (VS Code).
- **Design Assistant:** generates REST, GraphQL, and AsyncAPI specifications from natural language, from API contracts, or from backend service descriptions.
- **AI-readiness scores:** assess whether an API has clear descriptions, meaningful operation names, and examples that AI agents can use.
- **Agent skills:** evaluate API specifications for design, security, and governance gaps, and suggest fixes.

After you design an API, commit the specification to Git. Then import it into the control plane from Git, or upload it directly. For more information, see [Getting started with VS Code for API design](tools/vscode-api-design/getting-started.md).

### How does API governance work?

API governance validates APIs against your organization's standards across the lifecycle. You define standards as Spectral rulesets, or as natural-language guidelines that AI agents check. The platform includes the following rulesets:

- **WSO2 API Management Guidelines:** naming, versioning, ownership, security, and transport.
- **WSO2 REST API Design Guidelines:** paths, HTTP methods, operation IDs, parameters, and schemas.
- **OWASP API Top 10:** authentication, authorization, JSON Web Token (JWT) security, rate limiting, and HTTPS.
- **WSO2 MCP Server Management Guidelines:** tool naming, authentication, metadata, and agent-consumable standards.

Governance checks run at design time, on deployment, and on publishing. A violation can block a lifecycle action, such as publishing. A compliance dashboard shows violations, severity, and remediation guidance. In CI/CD pipelines, the Governance CLI runs the same checks and reports violations in CSV format.

For more information, see the [API governance overview](cloud/governance/overview.md).

### How can I test APIs and MCP servers?

WSO2 API Platform provides the following testing tools:

- **Try-out consoles:** test REST, GraphQL, and AsyncAPI APIs from the Publisher and the Developer Portal, and LLM Proxy endpoints from the Developer Portal.
- **MCP Playground:** lists an MCP server's tools, invokes them with parameters, and shows the responses.
- **API Chat:** runs tests and multi-step call sequences from natural-language instructions.
- **Mocking:** generates mock responses from an OpenAPI definition, so consumers can test before the backend exists.
- **Sandbox and production environments:** separate keys and endpoints for testing and live traffic.
- **Revisions:** capture configuration changes without creating another API version. You can roll back to an earlier revision instantly.
- **A/B and canary testing:** Dynamic Endpoint routes requests to different backends based on conditions, and weighted routing splits traffic between backends. Neither requires a change to the API definition.
- **On-demand logs:** enable API-level logs for real-time debugging, without redeploying the API or changing its configuration.

You can also generate Postman collections and SDKs from an API definition. For more information, see [Test an API Proxy with API Chat](cloud/test-api-proxy/api-chat.md).

## AI Gateway and AI Workspace

### What is the difference between AI Gateway and AI Workspace?

The AI Gateway is the data plane, and AI Workspace is the control plane:

- **AI Gateway** processes AI traffic. It routes, secures, and observes requests to LLM providers, MCP servers, and AI agents (Upcoming).
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

Use a standalone AI Gateway to work directly with the gateway runtime. You configure it through the Gateway Controller API. You can connect a standalone gateway to AI Workspace later.

### What is the difference between an LLM Proxy, an MCP Proxy, and an Agent artifact?

All three run on the AI Gateway, but they govern different traffic:

- An **LLM Proxy** is an endpoint your AI application calls to reach an LLM provider, such as OpenAI. It applies guardrails, rate limits, and prompt policies to that traffic.
- An **MCP Proxy** is an endpoint AI agents call to reach an MCP server and its tools. It applies authentication, authorization, and access control to MCP traffic.
- An **Agent artifact** (Upcoming) fronts an AI agent and exposes it to clients through the A2A protocol. It applies authentication, rate limiting, guardrails, and observability to A2A traffic.

An LLM Proxy sends traffic through an LLM Provider. An MCP Proxy routes to its MCP server directly, without a provider. For more information, see [How the AI Gateway works](ai-gateway/1.2.0/how-it-works.md).

### What is the difference between an LLM Provider and an LLM Proxy?

An *LLM Provider* is the connection from the gateway to an upstream AI service. Administrators configure it with the following details:

- The service URL
- Credentials
- Access control rules
- Organization-wide policies

An *LLM Proxy* is a custom endpoint that consumes an LLM Provider. Each LLM Proxy has its own URL context, such as `/assistant`. Developers create one when an application needs its own policies. With LLM Proxies, several applications can share one LLM Provider. In AI Workspace, this application-facing endpoint is called an App LLM Proxy.

Because applications call the proxy URL, you can swap the underlying LLM Provider without changing client code. For more information, see the [App LLM Proxies overview](cloud/ai-workspace/llm-proxies/overview.md).

### How do I control which models teams can use?

AI Workspace keeps a governed catalog of approved models for each LLM Provider. Policies can select only the models listed under a provider, and consumers see only those models. This keeps workloads pinned to approved models.

To approve a model, use a review workflow in Git:

1. A developer defines the model declaratively and commits it to a source repository.
2. An administrator approves the change.
3. The model joins the approved list, and agents can use it.

You phase a model out in two stages:

- **Deprecate:** remove the model from AI Workspace. Agents that already use it keep working, but no other agents can access it.
- **Retire:** undeploy the model from the AI Gateway. The model becomes unavailable to every agent.

The platform treats each model version as a separate model. To move consumers to another version without changing their endpoint, use model aliases and routing. For more information, see [model routing](#how-does-the-ai-gateway-route-traffic-across-models-and-providers).

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

You can also connect custom and self-hosted providers through custom templates. The AI Gateway can sit in front of or behind another AI gateway by treating it as a custom provider.

For the providers you can configure in AI Workspace on Cloud, see the [LLM Providers overview](cloud/ai-workspace/llm-providers/overview.md).

### How do I connect my AI application or agent to the AI Gateway?

Point your application at the AI Gateway by changing only its base URL and credentials. The gateway exposes an OpenAI-compatible API, plus provider-native APIs for specifications such as Anthropic and Mistral. Agents built with any framework can route their LLM traffic this way.

The gateway forwards streamed responses chunk by chunk, so chat interfaces and agent loops keep their token-by-token behavior. For how policies, analytics, and token counts work on a stream, see [Stream responses](ai-gateway/1.2.0/streaming-responses.md).

For MCP traffic, any MCP-compliant client can connect to an MCP Proxy. The gateway injects the provider credentials into outbound requests, so your application never handles upstream API keys. For a walkthrough, see the [AI Gateway quick start guide](ai-gateway/1.2.0/quick-start-guide.md).

### How does the AI Gateway route traffic across models and providers?

The AI Gateway exposes one client-facing API and mediates requests to each upstream provider. It offers the following routing policies:

- **Model Round Robin:** distributes requests evenly across models or endpoints.
- **Model Weighted Round Robin:** distributes requests in proportion to assigned weights.
- **Model Failover:** redirects traffic to an ordered list of fallback models when the primary model fails.
- **Intelligent Model Routing:** uses an LLM as a judge to pick the best-suited model for each prompt.
- **Semantic Model Routing:** matches each prompt to a route by embedding similarity.
- **Jev Model Routing:** scores plain-language, intent-based rules and routes to the matching model, without an LLM.

The gateway also suspends a failing endpoint for a configurable period before it retries. Model aliases decouple routing names from deployed providers, so you can move consumers to another model version without changing their endpoint. For more information, see [Routing](ai-gateway/1.2.0/routing/index.md).

### How do I control LLM costs?

Combine the following policies on an LLM Provider or an LLM Proxy:

- **Token-Based Rate Limit:** caps prompt, completion, or total tokens within a time window.
- **LLM Cost-Based Rate Limit with a pricing policy (Upcoming on Cloud):** the pricing policy calculates the cost of each call in US dollars (USD). LLM Cost-Based Rate Limit rejects traffic after the budget runs out. Pick the pricing policy that matches the endpoint:
    - **LLM Cost:** a vendor's own endpoint.
    - **Azure LLM Cost:** Azure OpenAI and Azure AI Foundry.
- **Semantic Cache:** answers semantically similar prompts from a cache, eliminating upstream calls and their token costs.
- **Prompt Compressor:** removes redundancy from prompts before they reach the model, reducing prompt tokens.
- **Semantic Tool Filtering:** sends the model only the tools relevant to the request, reducing prompt tokens.

You can set budgets for several periods, such as a day, a week, or a month. When you configure several limits, the gateway enforces all of them, and the most restrictive one applies. After a budget runs out, the gateway returns `429 Too Many Requests`. Response headers show each configured budget and the amount remaining.

AI insights, powered by Moesif, track token use and cost per model, provider, application, and team. They also send alerts as spending approaches a budget. For more information, see [Cost control and budgets](ai-gateway/1.2.0/cost-control-and-budgets.md), [Token-based rate limiting](ai-gateway/1.2.0/token-based-rate-limiting.md), and [Semantic caching](ai-gateway/1.2.0/semantic-caching.md).

### Does the AI Gateway cache responses?

Yes, through semantic caching. A semantic cache serves stored responses for prompts with the same meaning, not only identical text. The gateway converts each prompt to a vector embedding and compares it with earlier prompts. It reuses cached embeddings instead of computing them again.

A cache hit skips the upstream call, eliminating the round-trip latency and the billable tokens. You attach caching to an LLM Proxy or an LLM Provider, and you control the following settings:

- Embedding provider
- Vector database
- Similarity threshold
- Cache scope

For more information, see [Semantic caching](ai-gateway/1.2.0/semantic-caching.md).

### How do I manage prompts at the gateway?

The AI Gateway shapes prompts before they reach the model, through the following policies:

- **Prompt Template:** applies reusable, parameterized templates that turn request data into structured instructions for the model.
- **Prompt Decorator:** injects system instructions, roles, and context on the server side. Client applications and agents can't remove or override these instructions.
- **Prompt Compressor:** removes redundancy from prompts, reducing prompt tokens.

To shape one application's prompts, attach a prompt policy to its LLM Proxy. To shape prompts for every proxy that uses an LLM Provider, attach the policy to the provider. The gateway versions each policy deployment, including prompt templates and decorators, so you can roll back to an earlier deployment. For more information, see [Prompt management](ai-gateway/1.2.0/prompt-management.md).

### Can the AI Gateway govern A2A traffic?

**Upcoming.** With A2A support, you expose an AI agent through the AI Gateway as an Agent artifact. The gateway then governs the traffic that A2A clients send to the agent. A2A support includes the following capabilities:

- **Authentication:** OAuth2 and OpenID Connect (OIDC) JWTs, opaque tokens, gateway-issued API keys, and basic authentication.
- **Authorization:** role-based access control (RBAC) per A2A operation, and access rules based on token claims.
- **Traffic control:** rate limiting, timeouts, and guardrails, at the agent or operation level.
- **Agent Cards:** the gateway serves a governed Agent Card, or passes the upstream agent's card through. Protected cards go only to authenticated, authorized callers.
- **Protocols:** JSON-RPC and HTTP+JSON bindings, including streaming.

You register an agent through the gateway's REST API or as a Kubernetes Agent CRD. The gateway publishes task, context, and message identifiers, so you can trace multi-turn agent conversations.

### Can I require human approval for high-risk agent actions?

Yes. The AI Gateway supports the following approaches:

- **Policies:** the Interceptor Service policy can call a workflow engine at runtime, and a custom policy can validate the consent a user gave.
- **Consent tokens (Upcoming):** the gateway requires a consent token before it allows a high-risk action.

To require approval for configuration changes instead, deploy gateway artifacts declaratively from a source repository. Your review process, such as a pull request review in Git, then controls what reaches the gateway. For more information, see [custom policies](#can-i-write-my-own-policies).

### How do I monitor AI traffic?

The AI Gateway reports each request's model, provider, latency, token counts, cost, and status. Latency metrics include time to first token and p50, p95, and p99 percentiles. You can break down usage by provider, model, application, team, and user.

The gateway sends telemetry to the following destinations:

- **Moesif:** built-in AI and MCP analytics, available in AI Workspace dashboards.
- **OpenTelemetry:** traces, metrics, and logs for any OpenTelemetry-compatible platform, such as Grafana, Datadog, Splunk, Azure Monitor, or Jaeger. Events follow the OpenTelemetry generative AI semantic conventions.
- **SIEM platforms:** authentication failures, guardrail interventions, and other security events, in a format that SIEM systems accept.

MCP analytics include JSON-RPC methods, tool, resource, and prompt names, MCP client details, and errors. For more information, see [Logging and tracing](ai-gateway/1.2.0/logging-and-tracing/index.md) and [Analytics](ai-gateway/1.2.0/analytics/index.md).

## Policies and guardrails

### What is the difference between a guardrail and a policy?

A *policy* is a self-contained unit of behavior that runs in the gateway's request and response pipeline. Policies handle concerns such as the following:

- Authentication
- Rate limiting
- Transformations
- Logging

A *guardrail* is a category of policy that inspects the content of AI requests and responses. Depending on its configuration, a guardrail allows content, transforms or redacts it, or blocks it. Examples include PII Masking, Azure Content Safety, and the Semantic Prompt Guard.

API governance also uses the word *policy*, for a set of rulesets that the platform enforces on APIs. For more information, see [How does API governance work?](#how-does-api-governance-work).

### Which guardrails does the AI Gateway provide?

The AI Gateway provides guardrails for the following risks:

- **Prompt injection and jailbreaks:** Semantic Prompt Guard, Granite Guardian Prompt Injection, Jev Content Safety, and regex guardrails.
- **Harmful content:** NVIDIA NeMo Guard Content Safety, Azure AI Content Safety, AWS Bedrock Guardrails, and Jev Content Safety.
- **Sensitive data:** PII masking with reversible anonymization or irreversible redaction, and URL validation that detects hallucinated URLs.
- **Payload shape and size:** JSON Schema, content length, word count, and sentence count guardrails.
- **Off-task tool use:** Jev MCP Tool Intent Verification checks that each MCP tool call matches the agent's intended task.

Guardrails run on prompts, retrieved context, tool outputs, and responses. They map to the OWASP Top 10 for LLM applications. Administrators can set enterprise-wide guardrails that developers can't bypass. Developers can add guardrails for their own application on top.

To build your own guardrail, write a custom policy in Go or Python. You can also call Open Policy Agent (OPA) for external policy decisions. For the full catalog, see the [Policy Hub](policy-hub/overview.md).

### What happens when a guardrail blocks a request?

In AI Workspace, the following guardrails block a request or response with `422 Unprocessable Entity`:

- Semantic Prompt Guard
- Azure Content Safety
- Word Count
- Sentence Count

Some guardrails, such as NVIDIA NeMo Guard Content Safety and Granite Guardian Prompt Injection, let you set the status code for blocked requests.

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

The [policies are open source](https://github.com/wso2/gateway-controllers). Each policy has its own version track, independent of gateway releases. Any version of the AI Gateway can use any policy in the hub. Earlier versions of a policy stay available after a release, so running deployments don't break.

Guardrails are decoupled from the gateway runtime, so you can update a guardrail without rebuilding the gateway. This works on all three gateway runtime variants. You can keep your own private policies alongside the hub's. Your administrators decide which policies your organization uses.

### Can I write my own policies?

Yes. The API Platform Gateway supports custom policies in two languages:

- **Go:** the default and recommended language. Go policies compile into the Policy Engine binary, for maximum performance.
- **Python (Beta):** a Python Executor runtime, suited to AI and machine learning workloads that need Python libraries.

To use a custom policy, build a custom gateway image with the `ap` CLI. You can also run policy logic as an external HTTP service that the gateway calls, through the Interceptor Service policy. See [Writing a custom policy](api-gateway/1.2.0/policies/custom-policies/writing-a-custom-policy.md) and [Building the gateway with custom policies](api-gateway/1.2.0/policies/custom-policies/building-gateway-with-custom-policies.md).

## MCP servers

### Can I turn my REST APIs into MCP tools?

Yes. WSO2 API Platform generates MCP servers from your APIs in two ways, without code:

- **One-to-one conversion:** the platform generates an MCP server from an OpenAPI specification, with one tool for each API endpoint. The MCP server runs on the gateway, behind an MCP Proxy.
- **Orchestrated workflows:** the open-source `arazzo-mcp-gen` CLI generates an MCP server from an Arazzo workflow, with one tool for each workflow. Each tool can call several API endpoints in sequence. The MCP server runs anywhere, behind an MCP Proxy.

WSO2 integration technology can also aggregate tools and resources from several backend systems into one MCP server.

On Cloud, you can create an MCP Server from any HTTP backend or from an API Proxy. API Platform generates the MCP tool schemas automatically. It also derives default tool names and descriptions from the API contract. You can edit tool names and descriptions afterward.

For the procedure, see [Design and publish MCP servers](cloud/mcp-servers/design-mcp-servers.md) and the [Arazzo MCP Generator CLI quick start guide](tools/arazzo-mcp-gen-cli/quick-start-guide.md). For an end-to-end walkthrough, see [Convert a REST API into an MCP tool and use it in Claude Desktop](guides/ai-and-mcp/convert-rest-api-to-mcp-server.md).

### Can I put my own or third-party MCP servers behind the AI Gateway?

Yes. An MCP Proxy fronts self-managed and third-party MCP servers, with or without upstream authentication. To register a server, point the AI Gateway or AI Workspace to its endpoint URL.

The MCP Proxy supports the following options:

- **Tools:** expose the server's tools as they are, or let the gateway manage them.
- **Resources and prompts:** expose MCP resources and prompts along with tools.
- **Transport:** the streamable HTTP transport.
- **Authorization:** the MCP OAuth authorization flow, with OAuth2 scopes, resource indicators (RFC 8707), PKCE, and audience-bound token validation.

The AI Gateway supports every MCP specification version through 2026-07-28. For more information, see [MCP proxy](ai-gateway/1.2.0/gateway-artifacts/mcp-proxy.md).

### How do AI agents and developers discover MCP servers?

When you publish an MCP Proxy from AI Workspace, API Platform registers it in your organization's MCP registry. The registry is available in two ways:

- **MCP Hub:** a searchable catalog where developers and agents find MCP servers by tool, capability, domain, or server. Semantic discovery lets agents find APIs as tools by meaning.
- **MCP Registry API:** a REST API that AI clients, integrated development environment (IDE) plugins, and automation tools query.

You can also onboard third-party MCP servers into the same catalog, and label them with tags or views. The Developer Portal runs in one of three modes: API-only, MCP-only, or combined. For more information, see [What is an MCP registry?](cloud/mcp-servers/mcp-registry.md).

### How do I secure an MCP server?

Attach MCP policies to the MCP Proxy in front of the server:

- **MCP Authentication:** establishes who's calling, per the MCP specification authorization profile. It works with any OIDC identity provider.
- **MCP Authorization:** checks that the caller may use a specific tool, resource, or prompt, based on scopes and token claims.
- **MCP Access Control:** filters which tools, resources, and prompts a caller can see.
- **MCP Rewrite:** maps user-facing tool names to backend capability names.
- **MCP Rate Limit:** limits calls per tool, resource, prompt, or JSON-RPC method.

You can scope authentication, authorization, and rate limiting to individual tools, resources, prompts, or JSON-RPC methods. Guardrails such as Granite Guardian Prompt Injection, Semantic Prompt Guard, and PII masking also apply to MCP traffic.

The platform also detects tool poisoning, where a tool description carries harmful or unauthorized instructions for the agent. WSO2 publishes its [tool poisoning detection model](https://huggingface.co/wso2/tool-poisoning-detection) on Hugging Face. The model classifies a tool description as safe or poisoned.

To pass the caller's identity to the upstream server, the gateway can issue a signed backend JWT or run a token exchange. It injects upstream credentials from its built-in secret storage or an external secret manager. For more information, see [MCP governance](ai-gateway/1.2.0/mcp-governance.md).

## API security and consumption

### How do I secure access to my APIs?

WSO2 API Platform supports the following authentication methods:

- **OAuth2 and OpenID Connect:** including authorization code with PKCE, client credentials, token exchange, and SAML bearer grants.
- **Mutual TLS (mTLS):** certificate-based client authentication.
- **API keys:** optionally restricted by IP address or CIDR range.
- **Basic authentication:** username and password.

For authorization, the platform uses OAuth2 scopes, roles, and Open Policy Agent (OPA) policies. It integrates with standards-based identity providers, such as WSO2 Identity Server, Okta, Keycloak, Microsoft Entra ID, Auth0, and PingFederate.

On API Platform Cloud, you can secure API Proxies with OAuth2 or API keys. For OAuth2, you can use any of the following:

- Asgardeo
- The built-in API Platform Secure Token Service (STS)
- Microsoft Azure Active Directory (Azure AD)
- An external key manager

You can also secure the connection from the gateway to your backend with OAuth2 or mTLS. To connect your own identity provider, see [Secure API access with an external key manager](cloud/develop-api-proxy/authentication-and-authorization/secure-api-access-with-external-idp.md).

### How does the platform protect APIs from attacks?

WSO2 API Platform applies the following protections:

- **Payload threats:** OpenAPI schema validation, plus JSON, XML, and regex threat protectors that block malformed payloads, XML external entity (XXE) attacks, and injection attempts.
- **Bot traffic:** bot detection identifies and logs unauthorized non-human traffic.
- **Denial of service:** throttling at the subscription, application, API, resource, user, and IP address levels, with burst control and backend throughput limits.
- **Abusive clients:** deny policies block specific APIs, applications, IP addresses or ranges, and users.
- **GraphQL abuse:** query complexity and depth limits.
- **Insecure designs:** the OWASP API Top 10 governance ruleset checks APIs before deployment and publishing.

The AI Gateway also supports post-quantum cryptography (PQC) algorithms for transport security. For AI-specific threats, see [Which guardrails does the AI Gateway provide?](#which-guardrails-does-the-ai-gateway-provide).

### How do I control traffic volume to my APIs and backends?

Gateways apply rate limits globally, or per application, user, consumer, or IP address. The AI Gateway adds the following controls:

- **Advanced rate limiting:** several named quotas, each with several limit windows. It uses the generic cell rate algorithm (GCRA) or a fixed window. Limits can key on headers, clients, or users, and can carry weights.
- **Distributed rate limiting:** a Redis-backed counter keeps limits consistent across gateway replicas.
- **Timeouts:** request and idle timeouts at the global, upstream, and resource levels.
- **Concurrency limits:** the policy engine caps how many requests one gateway instance processes at once. Default circuit breaker thresholds also limit concurrent access.
- **Payload limits:** size guardrails, such as content length and word count, plus limits on decompressed payloads.
- **Overload protection:** the gateway suspends a failing endpoint for a configurable period.

For token and cost limits, see [LLM cost control](#how-do-i-control-llm-costs). For limits on MCP tool calls, see [MCP security](#how-do-i-secure-an-mcp-server). For timeout settings, see [Timeouts and resilience](ai-gateway/1.2.0/timeouts-and-resilience.md).

### How do developers consume my APIs?

Developers find and subscribe to APIs in the Developer Portal. They can browse the catalog, or describe their use case in natural language to get API recommendations from the Marketplace Assistant. Comments on each API let consumers give feedback and ask for changes.

To consume an API secured with an API key, a developer follows these steps:

1. Create an application in the Developer Portal.
2. Subscribe the application to the API.
3. Generate an API key for the subscribed API.
4. Send the key in the `api-key` header.

The following example calls an API with an API key:

```bash
curl -H "api-key: <YOUR_API_KEY>" -X GET "https://my-sample-api.bijiraapis.dev/greet"
```

For the full procedure, see [Consume an API secured with API key](cloud/devportal/consuming-services/consume-an-api-secured-with-api-key.md) or [Consume an API secured with OAuth2](cloud/devportal/consuming-services/consume-an-api-secured-with-oauth2.md).

### Can AI agents discover and use my APIs through the Developer Portal?

Yes. The Developer Portal serves both developers and AI agents. Agents discover published APIs through machine-readable endpoints, without browsing the visual portal:

- **`/llms.txt`:** an index of the portal's agent-visible APIs, MCP servers, documentation, and workflows. Admins add LLM instructions that describe authentication conventions, recommended workflows, and constraints.
- **Per-API Markdown:** each API and MCP server has a `.md` endpoint with its documentation and specification.
- **API workflows:** multi-step workflows in the Arazzo format, so agents follow approved business flows.
- **MCP registry:** the MCP Registry API and MCP Hub list MCP servers.

API owners and admins decide which APIs agents can see. Developers can also generate one SDK and sample code for several subscribed APIs, from a description of their use case. For more information, see [AI agent discovery](cloud/devportal/discover-apis/ai-agent-discovery.md).

### Can I customize the Developer Portal?

Yes. You customize the Developer Portal with HTML and CSS, without a UI framework or content management system. The portal has two kinds of pages:

- **Business pages:** pages such as the landing page and API listing page. You can replace them completely with your own pages.
- **Technical pages:** pages such as the API try-out and key generation pages. You can change their logos, colors, and fonts, but not their behavior.

You can also add pages. Admins customize organization pages, and API owners customize their API pages. To create a matching theme, give the portal your website URL, and AI-assisted branding generates one for you to review.

The portal runs as SaaS or self-hosted, and supports multi-tenancy with separate branding and data for each organization. For more information, see [Theming the Developer Portal with AI](cloud/devportal/theming-devportal-with-ai.md).

### Can I control who sees my APIs in the Developer Portal?

Yes. You can limit the visibility of an API, its documentation, and its usage plans by the following criteria:

- Role
- Organization or tenant
- Usage plan

You can also share APIs with business partners, for business-to-business (B2B) use. The MCP Hub applies the same kind of visibility controls to MCP servers, for teams, business units, and B2B partners. To decide which APIs AI agents can discover, see [AI agent discovery](#can-ai-agents-discover-and-use-my-apis-through-the-developer-portal).

### What are the lifecycle states of an API?

An API moves through six lifecycle states:

- Created
- Pre-Released
- Published
- Blocked
- Deprecated
- Retired

You can customize the states to match your organization's process. State changes can require approval, and the platform records each transition with the actor and time. Consumers notice the following states:

- **Pre-Released:** the API appears in the Developer Portal as a prototype for early testing.
- **Deprecated:** subscribers keep access until retirement, but nobody else can subscribe.
- **Retired:** the API disappears from the gateway and the Developer Portal.

When you publish another version of an API, the platform can deprecate the earlier version automatically and move its subscribers. It notifies subscribers by email. Several versions can stay active at the same time. You can't delete an API that has active subscriptions. To change an API's state on Cloud, see [Lifecycle management](cloud/develop-api-proxy/lifecycle-management.md).

### Can I charge for API, AI, and MCP usage?

Yes. WSO2 API Platform includes built-in monetization for the following:

- REST APIs
- AI APIs, such as LLM Proxies
- MCP servers
- Event-driven and streaming APIs

Monetization works in two layers.

**Subscription plans in the API Control Plane.** The control plane includes the following monetization features:

- Free and paid subscription plans for individual APIs.
- API products, packaged with usage plans.
- Native billing and invoicing through Stripe.
- Five pricing models: free, flat, unit, volume, and graduated.

Consumers discover, subscribe to, and pay for plans in the Developer Portal. To set it up, see the [API monetization overview](monetization/overview.md).

**Usage-based billing with Monetization.** The Monetization product, powered by Moesif, adds usage-based billing and analytics. It runs as SaaS. It's gateway-neutral and billing-neutral: it works with WSO2 gateways and with third-party gateways, such as Kong and Amazon API Gateway. With Monetization, you can do the following:

- Bill on request counts, on prompt, completion, or total tokens, or on custom metrics.
- Build billing meters on any property of API and AI traffic, such as token count, context size, model tier, or provider cost. Meters support scripted fields and custom formulas.
- Meter events from outside your APIs through connectors for event streaming platforms, such as Firehose and Logstash.
- Monetize MCP servers: configure a billing engine, then define billing plans and billable metrics from MCP analytics data.
- Offer prepaid, pay-as-you-go, or outcome-based plans.
- Bill through Zuora, Chargebee, Recurly, or a custom billing or ERP system. Custom billing systems connect through webhooks.
- Analyze AI costs, and send alerts as usage approaches a budget.
- Export usage data in CSV, Parquet, or JSON format for internal chargeback or showback. You can export through an API, through webhooks, or in bulk to Azure Storage.

To cap AI spend at the gateway instead of billing for it, see [LLM cost control](#how-do-i-control-llm-costs).

### Can I manage APIs that run on third-party gateways?

Yes. Gateway federation brings APIs from external gateways under one control plane. The gateways you can federate depend on the control plane:

- **API Platform Cloud control plane:** Amazon API Gateway.
- **Self-hosted control plane:** Amazon API Gateway, Azure API Management, Apigee, Kong, and Envoy.

With gateway federation, you can do the following:

- Discover APIs on external gateways.
- Apply governance to those APIs, and report violations.
- Publish them to the Developer Portal alongside your WSO2-managed APIs.
- View analytics for all gateways in one place, through Moesif.

The control plane can deploy APIs directly to Amazon API Gateway and Azure API Management. For other gateways, your deployment pipelines act on the control plane's violation reports. Extension points let you onboard any other gateway. The platform also federates external event platforms, such as Solace, so you can represent, subscribe to, and govern their event APIs.

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

For AI traffic, see [How do I monitor AI traffic?](#how-do-i-monitor-ai-traffic). To get started, see the [logs overview](cloud/monitoring-and-insights/logs/overview.md) and [Insights](cloud/monitoring-and-insights/insights.md).

### Can I track the business value of my APIs?

Yes. Insights, powered by Moesif, give API product managers the following analytics:

- **Adoption:** unique users, requests, errors, onboarding trends, top APIs and applications, and geographic demand. Adoption analytics cover REST, GraphQL, gRPC, SOAP, and event-driven APIs.
- **Product analytics:** customer journeys, usage funnels, conversion rates, time to first call, drop-offs, and retention cohorts.
- **AI and MCP adoption:** token use and estimated spend by model and provider, plus tool calls, unique agents, sessions, and top tools.
- **Revenue:** billable usage, and billing analytics that connect usage to revenue.

You can build drag-and-drop dashboards that combine event logs, time-series trends, segmentation, heat maps, and funnels. AI Explain answers questions about your data in natural language. You can also embed usage and quota dashboards for each customer in your developer portal or application.

Insights cover APIs on third-party gateways too, through gateway federation. Quota and behavior rules can act on users, applications, companies, plans, or billing state. For example, a rule can act when a customer exceeds a quota or runs out of credits. For more information, see [Insights](cloud/monitoring-and-insights/insights.md).

## Related resources

- [Platform overview](index.md): components, deployment options, and key concepts.
- [Get Started](get-started.md): quick start guides organized by goal.
- [Guides](guides/ai-and-mcp/convert-rest-api-to-mcp-server.md): end-to-end scenarios that combine several platform features.
- [Policy Hub](policy-hub/overview.md): the curated collection of policies and guardrails for APIs, LLM traffic, and MCP servers.
- [API Portal and MCP Hub concepts](api-portal/1.0.0/concepts.md): organizations, views, applications, subscriptions, and API keys in the self-hosted portal.
