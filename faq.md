---
title: "WSO2 API Platform FAQ"
description: "Answers to common questions about WSO2 API Platform gateways, control plane, API Portal and MCP Hub, AI governance, analytics, and monetization."
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
last_updated: 2026-10-16
content_type: "faq"
---

# WSO2 API Platform FAQ

This page answers common questions about WSO2 API Platform. The questions cover the gateways, the control plane, API Portal and MCP Hub, analytics, and monetization. It's for developers, platform engineers, administrators, and API product managers who evaluate or use the platform. Notes titled **Upcoming** describe features that aren't released yet.

Last updated: October 16, 2026

## WSO2 API Platform overview

### What is the WSO2 API Platform?

WSO2 API Platform manages, secures, governs, and monetizes APIs and AI services. It builds on an open-source foundation and governs traffic through three gateways:

- **API Gateway:** REST, GraphQL, SOAP, and WebSocket traffic, both inbound and outbound.
- **AI Gateway:** traffic to large language model (LLM) providers, Model Context Protocol (MCP) traffic between agents and tools, and Agent2Agent (A2A) agent traffic.
- **Event Gateway:** Kafka, WebSub, Server-Sent Events (SSE), and other event protocols.

The same policies and guardrails apply across all three gateways. They cover authentication, rate limiting, cost controls, personally identifiable information (PII) masking, caching, routing, and observability. For a map of every component, see the [Platform overview](index.md).

### What components make up the platform?

The platform consists of the following components:

- API Gateway, AI Gateway, and Event Gateway
- API Control Plane
- AI Workspace, the control plane for AI assets
- API Portal and MCP Hub, the developer portal
- Policy Hub, an open-source catalog of policies and guardrails
- Analytics and Monetization, powered by Moesif

Each component is a separate product. You can start with one gateway and add the rest as your needs grow, or run everything together. For the policy catalog, see the [Policy Hub](policy-hub/overview.md).

### What deployment models are supported?

WSO2 API Platform supports the following deployment models:

- **Cloud (SaaS):** WSO2 runs the control plane and gateways for you as a software as a service (SaaS) offering.
- **Hybrid:** WSO2 runs the control plane, and the gateways run in your infrastructure. Your traffic never leaves your infrastructure.
- **Self-managed:** everything runs in your infrastructure, with multi-tenancy and air-gapped support.
- **Standalone:** a gateway runs alone, with no control plane, and you configure it as code.

All deployment models have the same features. Gateways run on virtual machines (VMs), Docker, and Kubernetes. On Kubernetes, you can deploy with Helm, the operator, custom resource definitions (CRDs), or the Kubernetes Gateway API. For more information, see the [comparison of deployment options](index.md#how-do-the-three-options-compare).

### Can the platform be managed as code?

Yes. You configure every component in YAML and version the configuration in Git. The platform supports the following practices:

- A CLI-driven GitOps workflow promotes APIs, policies, and configuration across environments.
- Environment-specific configuration leaves the API definition unchanged.
- Kubernetes CRDs and the operator work with Argo CD and Flux.
- A Terraform provider manages platform and infrastructure configuration together.
- Governance checks run in continuous integration and continuous delivery (CI/CD) pipelines before an API reaches any environment.
- Immutable Gateway mode builds the configuration into the gateway at build time, for air-gapped environments.

For more information, see the [API Platform CLI quick start guide](tools/cli/quick-start-guide.md).

### How does the platform manage third-party APIs such as OpenAI or Salesforce?

The control plane imports an OpenAPI or GraphQL specification and deploys a managed proxy for outbound traffic. It provides the following capabilities:

- Curated specifications for SaaS providers such as Salesforce
- Built-in templates for LLM providers such as OpenAI, Anthropic, and Mistral, plus support for custom templates
- Rate limits per application, user, consumer, or IP address, plus token and US dollar (USD) limits for LLM calls and tool-call limits for MCP
- Analytics with budget tracking and threshold alerts

For more information, see [Cost control and budgets](ai-gateway/1.2.0/cost-control-and-budgets.md).

## API design

### Does the platform support a design-first approach?

Yes. You create, import, edit, document, mock, and validate an API contract before you implement it. The API Designer supports REST, GraphQL, and AsyncAPI, and runs standalone or in Visual Studio Code (VS Code). Commit the specification to Git, then import it into the control plane from Git or by upload.

For more information, see [Getting started with VS Code for API design](tools/vscode-api-design/getting-started.md).

### Which API styles are supported?

WSO2 API Platform supports the following API styles:

- REST, with OpenAPI
- GraphQL, with Schema Definition Language (SDL)
- Event-driven APIs, with AsyncAPI for WebSocket, WebSub and webhooks, SSE, and Kafka
- AI APIs, with LLM provider templates
- MCP servers
- SOAP, with Web Services Description Language (WSDL), including SOAP-to-REST transformation
- gRPC and other external contracts, registered and governed as third-party services
- API Products, bundling resources from several APIs with their own lifecycle

WSO2 Integrator and Ballerina compose several backends into one governed API.

### How does generative AI help with API design?

Generative AI helps with API design in the following ways:

- The **Design Assistant** generates REST, GraphQL, and AsyncAPI specifications from natural language, existing contracts, or backend descriptions. You refine the specifications through follow-up prompts.
- AI generates and improves API descriptions, schema documentation, and consumer-facing metadata.
- **Agent skills** check specifications for design, security, and governance gaps. They suggest fixes in the portal, the integrated development environment (IDE), or CI/CD pipelines.
- A built-in API architect agent reports inconsistencies and best-practice violations.

### What is an AI-readiness score?

The API Designer scores each specification on how well an AI agent can use it. The score considers the following factors:

- Clear descriptions
- Meaningful operation names
- Examples
- Predictable behavior
- Security posture
- Metadata quality
- Discoverability

### Can designs be validated against organizational standards before publishing?

Yes. You express standards as Spectral rulesets, or as natural-language guidelines that AI checks. The platform validates an API against these standards before you publish it. Protocol-specific controls are also available, such as scopes, security, and rate limits per GraphQL operation.

For more information, see the [API governance overview](cloud/governance/overview.md).

## API Portal and MCP Hub

### Does the API Platform include a developer portal?

Yes. In API Portal and MCP Hub, developers and AI agents discover APIs, MCP servers, Arazzo workflows, and documentation. They also subscribe to APIs and get credentials there. API Portal and MCP Hub provides the following features:

- API try-out, application management, subscriptions, and credential generation
- SDK and Postman collection generation
- Comments for feedback
- Several usage plans per tenant
- Visibility by role, organization, or tenant, including business-to-business (B2B) sharing
- SaaS or self-hosted deployment, with multi-tenancy, in API-only, MCP-only, or combined mode

For more information, see [API Portal and MCP Hub concepts](api-portal/1.0.0/concepts.md).

### How customizable is the API Portal?

You can customize the API Portal in the following ways:

- **Business pages:** you can fully replace pages such as the landing, API listing, and API landing pages. You can also add pages.
- **Technical pages:** pages such as try-out and key generation accept themes but keep their behavior.
- **Technology:** customization uses only HTML and CSS, with no UI framework or content management system required.
- **AI-assisted branding:** the portal generates a theme from your website URL.
- **Discoverability:** the portal supports search engine optimization (SEO) and generative engine optimization (GEO).

For more information, see [Theming the Developer Portal with AI](cloud/devportal/theming-devportal-with-ai.md).

### How does the portal serve AI agents?

The portal exposes agent-visible APIs through machine-readable endpoints. Agents discover and use these APIs without the visual portal:

- **`/llms.txt`:** portal context, agent-visible APIs, documentation links, and workflows. It also includes admin-written instructions on authentication conventions and constraints.
- **`/api.md`:** Markdown documentation with the specification, for each API and MCP server.
- **Arazzo workflows:** approved multi-step flows, with guidance on when to run them.

API owners choose which APIs agents can see. For more information, see [AI agent discovery](cloud/devportal/discover-apis/ai-agent-discovery.md).

### What are MCP Hub and MCP Registry?

MCP Hub and the MCP Registry API serve different consumers:

- **MCP Hub:** the browsable catalog of MCP servers in the portal, with visibility controls for teams, business units, and B2B partners.
- **MCP Registry API:** server metadata, versions, capabilities, and endpoints for MCP clients, IDEs, and pipelines.

For more information, see [MCP registry](cloud/mcp-servers/mcp-registry.md).

### How does the Marketplace Assistant help?

Developers describe a use case in natural language and get recommended APIs and MCP servers. They can also select subscribed APIs and describe a use case. The Marketplace Assistant then generates one SDK, with sample code that calls those APIs together.

## API security

### How does the platform address the OWASP API Top 10?

The platform addresses the Open Worldwide Application Security Project (OWASP) API Top 10 in the following ways:

- **Governance:** a built-in OWASP API Top 10 governance ruleset runs at design, deployment, and publishing. The platform blocks non-compliant APIs before they reach production.
- **Authentication:** OAuth2 and OpenID Connect (OIDC), mutual TLS (mTLS), API keys, and basic authentication. OAuth2 and OIDC flows include authorization code with Proof Key for Code Exchange (PKCE), client credentials, and token exchange. They also include Security Assertion Markup Language (SAML) bearer, NT LAN Manager (NTLM), and Kerberos.
- **Authorization:** OAuth2 scopes, plus Open Policy Agent (OPA) and eXtensible Access Control Markup Language (XACML) policies.

### What threat protection is built in?

The platform includes the following threat protection:

- OpenAPI schema validation rejects non-conformant requests and responses.
- JSON, XML, and regex threat protectors block malformed payloads, XML external entity (XXE) attacks, and injection. They inspect bodies, headers, and path parameters.
- Bot detection identifies and logs non-human traffic.
- The platform integrates with AI-powered threat detection.

### How does the platform protect APIs from abusive traffic and traffic spikes?

To stop volumetric distributed denial-of-service (DDoS) attacks, use a dedicated service at the network edge, such as Cloudflare or Akamai. Place that service in front of the gateway. The gateway adds the following application-layer protection behind the edge:

- Throttling at the subscription, application, API, resource, user, and IP address levels, with burst control and conditional policies
- Deny policies that block clients by API, application, IP address range, or user
- Backend throughput limits that protect upstream services
- Certificate-based rate limiting for mTLS APIs
- GraphQL complexity and depth limits
- Rate limiting for WebSub, WebSocket, and SSE

### What other security features are available?

The platform also provides the following security features:

- Certificate-bound and single-use tokens, and JSON Web Token (JWT) audience validation
- Hardware security module (HSM) key management, and hash-based message authentication code (HMAC) for async APIs
- Role-based visibility of APIs, documentation, and gateway environments
- Organization-based access control for B2B
- API key usage tracking and revocation
- Pluggable key managers for third-party token generation and validation
- Multi-tenant isolation and fraud detection
- Security information and event management (SIEM) integration
- General Data Protection Regulation (GDPR) support

### How are AI agents authenticated at the platform level?

You onboard agents as applications. Each agent gets its own credentials, subscriptions, scopes, policies, and analytics identity. Agent authentication works as follows:

- **Flows:** OAuth2 client credentials, JWT bearer token exchange, mTLS, and API keys with IP address or Classless Inter-Domain Routing (CIDR) restrictions.
- **Identity providers:** WSO2 Identity Server, Okta, Keycloak, Microsoft Entra ID, Auth0, and PingFederate.
- **Identity propagation:** the gateway forwards the agent identity to backends in the `X-JWT-Assertion` header.
- **Usage limits:** per-subscription token quotas limit each agent's LLM usage.

## API governance and lifecycle

### How does the platform validate APIs against enterprise style guides?

Governance policies combine Spectral rulesets with natural-language guidelines that AI checks. Validation runs in the following places:

- The API Designer
- The control plane, for every API, including federated APIs
- CI/CD pipelines, through the Governance CLI

Governance provides the following capabilities:

- Violations can block publishing or deployment.
- A compliance dashboard shows violations, severity, scores, and remediation guidance.
- The platform validates documentation completeness alongside definitions.

For more information, see the [API governance overview](cloud/governance/overview.md).

### How does lifecycle management work?

APIs move through six states:

- Created
- Pre-Released
- Published
- Blocked
- Deprecated
- Retired

You can customize the states. Transitions can require approval, including multi-step and conditional workflows, and the platform audits every transition. The same model applies to REST, GraphQL, AsyncAPI, SOAP, MCP servers, and AI assets.

For more information, see [Lifecycle management](cloud/develop-api-proxy/lifecycle-management.md).

### How are versions, deprecation, and retirement handled?

The platform handles versions, deprecation, and retirement as follows:

- You create a version by copying an existing one. Several versions can be active at once.
- Publishing another version can deprecate the earlier one automatically, migrate its subscribers, and notify them by email.
- Backward-compatible changes can route automatically to the most recent version.
- Deprecated APIs accept no more subscriptions. Current subscribers keep access until retirement.
- Retirement removes the API from the gateway and the portal. You can't delete an API that has active subscriptions.
- Revisions capture configuration changes that don't affect the interface.
- API Products have their own versions, lifecycle, and migration path.

## AI Gateway and AI Workspace

### What is the WSO2 AI Gateway?

The AI Gateway sits between applications or agents and the models, tools, and agents they call. It's one of the platform's three gateways, and runs on the same Go-based runtime and policy engine as the API Gateway. It also shares the Policy Hub, API Portal and MCP Hub, and analytics. The only difference is that the AI Gateway has its own control plane, AI Workspace.

The AI Gateway governs three kinds of traffic. Each kind has its own proxy type that intercepts incoming requests:

- **LLM Proxy:** calls to model providers, with routing, failover, guardrails, rate limits, semantic caching, and streaming.
- **MCP Proxy:** agent-to-tool traffic, with MCP-specific authentication, authorization, and access control per tool, resource, and prompt. It also provides rate limiting, capability rewriting, and semantic tool filtering.
- **Agent artifact:** A2A traffic to agents, with Agent Cards, JSON-RPC and HTTP+JSON bindings, streaming, authentication, rate limiting, and guardrails.

For more information, see [How the AI Gateway works](ai-gateway/1.2.0/how-it-works.md).

### What is AI Workspace?

AI Workspace is the control plane for the AI Gateway. It does the following:

- Registers gateways and deploys configuration to them.
- Stores provider credentials.
- Maintains the catalog of LLM providers and approved models.
- Manages LLM Proxies, MCP Proxies, and policies.

The gateway processes requests and enforces policies itself. As a result, changes in AI Workspace take effect only after you deploy them. The gateway also keeps serving traffic if the control plane is upgrading or unavailable. AI Workspace runs in Cloud or self-hosted.

For more information, see the [AI Workspace overview](ai-workspace/1.0.0/overview.md).

### Do I need AI Workspace to run the AI Gateway?

No. The AI Gateway runs standalone, and you configure it through YAML, the CLI, or the Gateway Controller API. You can connect it to AI Workspace later for a UI and organization-wide governance. The gateway keeps its configuration and data when you connect it.

For a walkthrough, see the [AI Gateway quick start guide](ai-gateway/1.2.0/quick-start-guide.md).

### How can the AI Gateway be deployed?

You can deploy the AI Gateway in the following ways:

- **Cloud:** the control plane and gateway run in WSO2 Cloud.
- **Hybrid:** the gateway runs in your infrastructure and connects to AI Workspace in the cloud.
- **Self-managed:** AI Workspace, the AI Gateway, and MCP Hub all run in your infrastructure.
- **Standalone:** only the gateway runs, with no control plane.

## Upgrades and compatibility

### Does the gateway keep serving traffic during a control plane upgrade?

Yes. The control plane only distributes configuration, and the gateway enforces it. Upgrading or losing the control plane doesn't affect deployed configuration or in-flight requests.

### What happens to in-flight requests and long-lived streams during a gateway upgrade?

Rolling upgrades drain pods gracefully. A pod stops taking new requests and finishes accepted ones within the termination grace period. Meanwhile, healthy replicas receive new requests. For long-lived streams, set an appropriate `terminationGracePeriodSeconds` value and set `maxUnavailable` to `0`.

### Are policies versioned independently of gateway releases?

Yes. Policies and guardrails come from the Policy Hub on their own version track. A policy release doesn't affect running gateways, and any gateway version can use any Policy Hub policy.

Independent versioning matters because AI evolves rapidly. New risks and model behaviors appear between gateway releases, and you shouldn't have to wait for a full upgrade to address them. For example, WSO2 shipped the Jev guardrails weeks after the gateway release. You can adopt protections as soon as WSO2 publishes them, without upgrading or redeploying the gateway.

For more information, see the [Policy Hub](policy-hub/overview.md).

### Who controls upgrade timing?

Upgrade responsibility depends on the deployment model:

- **Self-managed:** you control upgrades and their timing, with WSO2 update tools. The published support service level agreement (SLA) covers each version.
- **Hybrid:** WSO2 upgrades the SaaS control plane, and you upgrade your gateways. The control plane stays compatible with earlier gateway versions within the support SLA.
- **Cloud:** WSO2 manages planned upgrades and migrations, and announces them in advance.

WSO2 publishes releases, dates, and end-of-life information in the WSO2 Release Matrix.

### How are upstream model version changes handled?

You pin models per provider, so workloads use only approved models. Routing policies and model aliases decouple routing names from deployed providers. As a result, consumers move to another model version without changing endpoints.

For more information, see [Routing](ai-gateway/1.2.0/routing/index.md).

### What is the backward-compatibility commitment?

The gateway follows semantic versioning. Minor versions keep the admin API and configuration schema backward compatible, and only major versions can break them. The model-facing API is OpenAI compatible. It also supports Anthropic, Mistral, and other provider specifications.

### Which rollout methods are supported?

The platform supports blue-green, canary, and rolling deployments on VMs, Docker, and Kubernetes, with readiness checks and disruption controls. Redis or a database stores session token usage and accumulated cost, so that data survives rollouts.

For more information, see [Kubernetes deployment](api-gateway/1.2.0/deployment/deployment-modes/kubernetes/overview.md).

## Identity and access control

### How does the AI Gateway authenticate users, applications, and agents?

The gateway authenticates every call to an LLM Proxy, an MCP server, or an agent. It accepts OAuth2 tokens (JWT or opaque), API keys, mTLS, or basic authentication. Agents get their own verifiable identity, called Agent ID, with delegation and on-behalf-of token exchange. As a result, the gateway authenticates each user, application, and agent before any model or tool call.

### How is authorization enforced?

The AI Gateway enforces authorization in the following ways:

- OAuth2 scopes, roles, subscriptions, and application keys restrict access to models, MCP tools, and agents.
- OPA adds rules based on attributes, time, and context, such as blocking delete operations.
- Delegated authorization limits what an agent can do for a given user.

### Which identity providers and standards are supported?

The gateway works with any identity provider that supports standard protocols:

- **Standards:** OAuth2, OIDC, SAML, JWT, and API keys.
- **Identity providers:** Microsoft Entra ID, Okta, Keycloak, Auth0, PingFederate, Google, and any other OIDC or SAML provider.

With WSO2 Identity Server, you can also federate across these providers. You can add single sign-on (SSO), multi-factor authentication (MFA), and adaptive authentication too.

### At what levels can access policies be enforced?

You can enforce access policies at the following levels:

- **Model and provider:** routing, guardrail, and rate-limit policies bound to specific models or endpoints.
- **Capability:** scopes and access rules mapped to individual MCP tools and operations.
- **Business unit:** separate applications, subscription plans, organizations, and spend limits.
- **API, resource, and operation:** guardrail and mediation policies attached at each level.

### How are provider credentials managed?

The gateway stores provider keys centrally and injects them into outbound requests, so applications never see them. Provider keys include keys for OpenAI, Azure, AWS Bedrock, Anthropic, and others. You can set keys per endpoint to separate teams or environments. You can also rotate keys centrally, and keep them in a vault or external secret store.

### How are MCP clients authenticated and authorized?

The AI Gateway authenticates and authorizes MCP clients in the following ways:

- **MCP Authentication** enforces the MCP authorization profile, including protected resource metadata. It applies per tool, resource, prompt, or JSON-RPC method, with JWTs from any OIDC provider.
- **MCP Authorization** restricts tools, resources, and prompts by identity, scopes, and claims.
- **MCP Access Control** rewrites list responses to hide restricted capabilities.
- You can delegate access decisions to an external framework.
- The gateway propagates identity upstream through a gateway-signed JWT or token exchange.
- The gateway injects downstream credentials from the built-in secret store or an external secret manager.

For more information, see [MCP governance](ai-gateway/1.2.0/mcp-governance.md).

### How are agent identities and agent-to-agent calls authorized?

The AI Gateway authorizes agent calls in the following ways:

- **Inbound authentication policies:** `jwt-auth` with JSON Web Key Set (JWKS) verification and several key managers, `opaque-token-auth`, `api-key-auth`, and `basic-auth`.
- **Per-operation rules:** role-based access control (RBAC) and claim-based rules for A2A calls.
- **Policy execution conditions:** rules that apply by calling agent, target agent, operation, environment, or task context.
- **Identity propagation:** token exchange or a gateway-issued backend JWT propagates the user identity upstream.

## Guardrails and AI security

### Which guardrails does the AI Gateway provide?

Guardrails run on prompts, retrieved context, tool outputs, and responses. They map to the OWASP Top 10 for LLM applications, and can allow, transform, redact, or block content. The AI Gateway provides guardrails for the following risks:

- **Prompt injection and jailbreaks:** Semantic Prompt Guard, Granite Guardian Prompt Injection, Jev Content Safety, and regex guardrails.
- **Harmful content:** NVIDIA NeMo Guard Content Safety, Azure AI Content Safety, and AWS Bedrock Guardrails.
- **Sensitive data:** PII masking, with reversible anonymization or irreversible redaction, and URL validation, on requests and responses.
- **Payload shape:** JSON Schema, content length, word count, and sentence count.
- **Off-task tool use:** Jev MCP Tool Intent Verification checks that each MCP tool call matches the agent's task.

Administrators set enterprise-wide guardrails that developers can't bypass. Developers add application-specific guardrails to those. You write custom guardrails in Go or Python. For the full catalog, see the [Policy Hub](policy-hub/overview.md).

### Can the gateway integrate with third-party security and DLP tools?

Yes. Azure AI Content Safety and AWS Bedrock Guardrails are built in, and OPA handles external policy decisions. The custom-guardrail SDK and mediation policies call in-house or partner data loss prevention (DLP) and security services inline.

### How are MCP interactions protected?

The AI Gateway protects MCP interactions in the following ways:

- Authentication and authorization per tool, resource, prompt, or JSON-RPC method, based on scopes and claims
- MCP Access Control, hiding restricted tools from list responses
- MCP-specific rate limits per capability, with several quotas
- PII masking and URL validation on MCP traffic
- Tool input validation and output inspection through custom policies
- Tool poisoning detection, using the [tool poisoning detection model](https://huggingface.co/wso2/tool-poisoning-detection) that WSO2 publishes on Hugging Face
- User context passed to upstream MCP servers after authentication terminates at the gateway

### What guardrails apply to agents and high-risk actions?

The following guardrails apply to agents and high-risk actions:

- The same prompt injection, size, and content moderation guardrails as model traffic
- Operation-level policies, so high-risk actions such as canceling a task can require higher privileges
- Token exchange, so regulated systems authenticate on behalf of the actual user rather than with static gateway credentials
- Consent tokens for high-risk actions

### How is transport protected?

The platform protects transport with TLS and strong ciphers, plus post-quantum cryptography (PQC) algorithms.

## Model routing, prompts, and caching

### Which LLM providers are supported?

The AI Gateway supports the following providers:

- OpenAI
- Azure OpenAI
- Anthropic
- Google Gemini
- Mistral
- AWS Bedrock
- Azure AI Foundry

You can also connect custom or self-hosted providers through custom templates. Consumers use one normalized API, and the gateway handles each provider's schema, authentication, and token counting.

For more information, see the [LLM Providers overview](cloud/ai-workspace/llm-providers/overview.md).

### How does the gateway route across models?

The gateway offers the following routing policies:

- **Model Round Robin and Model Weighted Round Robin:** spread requests across models or endpoints.
- **Model Failover:** sends requests to an ordered list of fallback models when the primary model fails. The gateway suspends failing endpoints before it retries them.
- **Intelligent Model Routing:** uses an LLM as a judge to pick the best model for each prompt.
- **Semantic Model Routing:** routes by embedding similarity.
- **Jev Model Routing:** applies plain-language, intent-based rules, without an LLM call.

Routing combines with token limits and semantic caching. Model aliases let consumers change models without changing endpoints. For more information, see [Routing](ai-gateway/1.2.0/routing/index.md).

### How are prompts managed at the gateway?

The gateway manages prompts through the following policies:

- **Prompt Template:** reusable, parameterized templates with variable substitution.
- **Prompt Decorator:** server-side system instructions, roles, and context that clients can't override.
- **Prompt Compressor:** removes redundancy to reduce prompt tokens.

All three are Policy Hub policies that you apply per API or resource. The gateway versions them on deployment, so you can roll back to earlier deployments. For more information, see [Prompt management](ai-gateway/1.2.0/prompt-management.md).

### How does semantic caching reduce latency and cost?

Semantic caching in the AI Gateway serves prompts with the same meaning from the cache. The gateway embeds prompts through a configurable provider and stores them in a configurable vector database. It then matches prompts by a similarity threshold. You enable caching per API, with control over the provider, database, threshold, and scope.

For more information, see [Semantic caching](ai-gateway/1.2.0/semantic-caching.md).

### What other optimizations are available?

**Semantic Tool Filtering** sends the model only the tools relevant to the request. It selects tools by top-K or by threshold, backed by an embedding cache. As a result, it reduces prompt tokens and improves tool selection.

## Registries: models, MCP servers, and agents

### How are approved models cataloged?

AI Workspace keeps a registry of providers and their approved models. Only listed models are available to select in policies or to expose to consumers. Each entry records the following details:

- Name
- Description
- Request and response definitions
- Token metrics
- Authentication

Cost and performance data come from analytics, and risk classification uses labels.

### How are models onboarded, approved, and retired?

A model moves through the following stages:

- **Onboard:** register the provider, its API definition, and its model list through the admin API or AI Workspace. Custom providers use connector definitions.
- **Approve:** developers commit declarative model configuration to Git, and admins approve it. The model then joins the active list.
- **Deprecate:** remove the model from AI Workspace. Agents that already use it keep working, but other agents can't use it.
- **Retire:** undeploy the model from the gateway. The model becomes unavailable to all agents.

The platform treats each model version as a separate model.

### How are MCP servers registered, approved, and retired?

An MCP server moves through the following stages:

- **Register:** point the AI Gateway or AI Workspace to the server's endpoint URL.
- **Approve:** developers commit MCP Proxy configuration, reviewers merge it, and the CLI deploys it.
- **Deprecate:** remove the server from the MCP Hub. Clients that already use it keep working.
- **Retire:** undeploy the proxy from the gateway.

You can enrich server metadata in the gateway for agent use. Examples include descriptions, parameter schemas, usage examples, and client configuration snippets. For more information, see [MCP proxy](ai-gateway/1.2.0/gateway-artifacts/mcp-proxy.md).

### How is access to MCP tools controlled?

Attached policies, OAuth2 scopes, and OPA rules decide which servers and tools each caller can see and call. They decide by identity, role, entitlement, or context. Tool-level authorization enforces least privilege.

### Is there a registry for AI agents?

Yes. You register agents as first-class artifacts through the control plane REST API or a Kubernetes Agent CRD. Each agent has metadata, a version, and an owning organization. The gateway applies authentication, rate limiting, analytics, and tracing to every call.

!!! info "Upcoming"
    AI Workspace and the API Portal list agents alongside APIs and MCP servers.

### How are Agent Cards handled?

The gateway handles Agent Cards in two modes:

- **Managed mode:** the gateway serves the governed card from the platform domain.
- **Passthrough mode:** the gateway proxies the upstream card.

Only authenticated, authorized callers receive protected cards, and entity tag (ETag) versioning signals changes. Capability search runs over the skills that cards declare.

## MCP servers

### How are enterprise systems exposed as MCP servers?

You expose enterprise systems through MCP Proxies on the AI Gateway. An MCP Proxy fronts self-managed or third-party servers, with or without upstream authentication. Tools can pass through as they are, or the gateway can manage them. MCP Proxies also support resources and prompts.

MCP Proxies support the following:

- Every MCP specification version
- Streamable HTTP transport
- MCP OAuth authorization flow, with granular scopes, RFC 8707 resource indicators, PKCE, and audience-bound tokens

For more information, see [MCP proxy](ai-gateway/1.2.0/gateway-artifacts/mcp-proxy.md).

### Can existing APIs be converted into MCP tools?

Yes, without code, in two ways:

- **One-to-one:** generate an MCP server from an OpenAPI specification. Each endpoint becomes a tool.
- **Orchestrated:** generate an MCP server from an Arazzo workflow with the open-source `arazzo-mcp-gen` CLI. Each workflow becomes one tool with typed inputs. The CLI validates the specification with a Spectral ruleset and visualizes it as a Mermaid flowchart.

You then onboard the generated server to the AI Gateway for governance. For the procedure, see [Design and publish MCP servers](cloud/mcp-servers/design-mcp-servers.md) and the [Arazzo MCP Generator CLI quick start guide](tools/arazzo-mcp-gen-cli/quick-start-guide.md). For an end-to-end walkthrough, see [Convert a REST API into an MCP tool and use it in Claude Desktop](guides/ai-and-mcp/convert-rest-api-to-mcp-server.md).

### Can tools from several back-end systems be aggregated into one MCP server?

Yes. WSO2 integration composes operations and resources from several APIs and systems into one governed MCP server.

### How are MCP servers governed at runtime?

Policies on the MCP Proxy enforce authentication, authorization, rate limiting, and guardrails at the server or tool level. MCP analytics appear on the dashboards. Discovery runs through the MCP Hub and the registry.

For more information, see [MCP governance](ai-gateway/1.2.0/mcp-governance.md).

### Are agent skills supported?

The AI Gateway governs skills at two points:

- **LLM Proxy:** the gateway intercepts skills attached to a request before they reach the model. Policies allow or strip skills per application, team, or agent, and run guardrails over skill instructions.
- **MCP Proxy:** servers that use the MCP Skills extension (`skills/list`, `skills/get`, and `skill://` resources) get authentication, authorization, and audit logging.

You can create agents with skills in AI Workspace.

## Agent governance and policy management

### What controls apply to agent interactions?

The following controls apply to agent interactions:

- **Agent artifact policies:** guardrails, authentication, and other policies on the Agent artifact.
- **A2A-specific controls:** interface selection and Agent Card mediation.
- **Rate limiting:** named multi-quota limits, with several windows per quota. Limits use the generic cell rate algorithm (GCRA) or a fixed window, and Redis keeps them consistent across replicas.
- **Timeouts:** request and idle timeouts at the global and operation levels.

!!! info "Upcoming"
    The gateway adds circuit breakers, recursion controls, and fan-out limits for agent-to-agent calls.

### Can the gateway require human approval for high-risk actions?

Yes, through policies:

- The Interceptor Service policy calls a workflow engine at runtime.
- A custom policy validates user consent, or the gateway requires a consent token.
- You implement escalation, dual authorization, and exception handling the same way.

For configuration changes, deploy artifacts declaratively from Git. Your pull request review then controls what reaches the gateway. For more information, see [Writing a custom policy](api-gateway/1.2.0/policies/custom-policies/writing-a-custom-policy.md).

### How are policies authored, versioned, and deployed?

The Policy Hub versions and governs all policies, and enterprises can also keep private policies. Policies are code, so standard build and versioning practices apply. Admins choose which policies their organization uses. Source control and AI Workspace audit records track every change.

For more information, see the [Policy Hub](policy-hub/overview.md).

### Can MCP tool usage be monetized?

Yes. You can charge for MCP tool usage. Connect a billing engine in Moesif, then define billing plans and billable metrics from MCP analytics. For example, a metric can count tool calls per server or per tool, so you bill consumers for the tools they use.

## Observability, budgets, and traffic control

### What visibility does the gateway provide into AI usage?

The gateway records the following data for each request:

- Model and provider
- Latency, including time to first token and the 50th, 95th, and 99th percentiles (p50, p95, and p99)
- Errors and the routing decision
- Prompt, completion, and total tokens
- Cost, status, and duration

You can slice metrics by provider, model, application, team, or user through custom dimensions. AI Explain answers questions about the data in natural language. For more information, see [Analytics](ai-gateway/1.2.0/analytics/index.md).

### Does the gateway support budgets and chargeback?

Yes. The gateway supports the following:

- Spend limits, token limits, and request limits, enforced with `429 Too Many Requests`
- Budgets per team, user, project, or agent, over a day, week, or month
- Cost attribution per model, provider, team, and application, for chargeback and showback

For more information, see [Cost control and budgets](ai-gateway/1.2.0/cost-control-and-budgets.md).

### Which observability, FinOps, and SIEM platforms are supported?

The gateway integrates with the following platforms:

- **OpenTelemetry:** traces, metrics, and logs with generative AI (GenAI) semantic conventions. Destinations include Grafana, Datadog, Splunk, Azure Monitor, Jaeger, and any OpenTelemetry Protocol (OTLP) tool. Elasticsearch, Logstash, and Kibana (ELK) pipelines and Prometheus pipelines also work.
- **Moesif:** analytics built into AI Workspace.
- **Financial operations (FinOps) tools:** consume cost data through Moesif, OpenTelemetry, or a custom policy that publishes cost events.
- **SIEM platforms:** receive authentication, authorization, and guardrail failures through the same pipeline.

For more information, see [Logging and tracing](ai-gateway/1.2.0/logging-and-tracing/index.md).

### What MCP and agent observability is available?

The gateway provides the following observability for MCP and agent traffic:

- **MCP:** client details, protocol versions, JSON-RPC methods, and tool, resource, and prompt names. Errors and latency appear in logs, analytics, and traces.
- **A2A:** task states, multi-turn messages grouped by `contextId`, agent-reported errors, and streaming details.
- **Correlation:** across `taskId`, `contextId`, `messageId`, and response identifiers. The gateway classifies errors by category: authentication, throttled, connectivity, or A2A.
- **Tracing:** end-to-end traces across agents, gateways, MCP servers, and models.

### What traffic controls and overload protection exist?

The gateway provides the following traffic controls:

- **Advanced rate limiting:** several quotas, weighted and cost-based limits, and Redis-backed distribution. Limits can key on a header, client, or user.
- **Token limits:** prompt, completion, and total token limits, with automatic token extraction for each provider.
- **Concurrency caps:** the policy engine caps concurrency and applies default circuit breaker thresholds.
- **Endpoint suspension:** suspends a failing endpoint for a configurable duration.
- **Payload limits:** limits by content length, word count, and sentence count, plus limits on decompression.
- **Timeouts:** request and idle timeouts at the global, upstream, and resource levels.

For more information, see [Timeouts and resilience](ai-gateway/1.2.0/timeouts-and-resilience.md).

## Testing and CI/CD

### How does the platform support continuous testing?

The platform supports continuous testing in the following ways:

- You import APIs from GitHub, GitLab, URLs, or uploads, and the CLI automates validation, deployment, and promotion.
- The platform generates mock responses from OpenAPI definitions in one click, and publishes prototypes to the portal for early feedback.
- Production and sandbox environments stay separate, and revisions give instant rollback.
- Governance checks run as specification-level tests and can fail a pipeline build.
- Dynamic endpoints and weighted routing enable A/B and canary testing without changing the API definition.

### What testing exists for AI and agent development?

The platform provides the following testing tools:

- **API Chat:** natural-language test execution and multi-step call sequences.
- **MCP Playground:** lists and invokes MCP tools, and validates the responses.
- **Try-out consoles:** REST, GraphQL, AsyncAPI, SOAP, LLM Proxies, and MCP, with production and sandbox tokens.
- **Lower-environment validation:** checks guardrails, PII masking, token and cost limits, and routing against LLM Proxies and MCP Proxies.
- **Debugging:** request tracing, correlation logs, and on-demand API-level logs.

For more information, see [Test an API Proxy with API Chat](cloud/test-api-proxy/api-chat.md).

## Event-driven and streaming APIs

### Are asynchronous and streaming APIs supported?

Yes. You define, document, and govern them with AsyncAPI. They get the same lifecycle, security, throttling, subscriptions, monetization, and analytics as REST APIs. The platform supports the following protocols and brokers:

- **Protocols:** WebSocket, SSE, webhooks and WebSub, gRPC, and GraphQL subscriptions.
- **Brokers:** Kafka topics as managed APIs, plus integrations with Java Message Service (JMS), RabbitMQ, ActiveMQ, and Solace.

### What is the Event Gateway?

The Event Gateway exposes event APIs close to their sources while keeping central governance. It runs standalone or as a self-hosted gateway connected to the control plane.

For more information, see the [Event Gateway overview](cloud/event-gateway/overview.md).

## Gateway federation

### Can the control plane govern APIs on third-party gateways?

Yes. You onboard APIs on Amazon API Gateway, Azure API Management, Kong, and Envoy into the control plane. Extension points add any other gateway, and event platforms such as Solace federate the same way. Federation provides the following:

- Governance rules report violations, missing policies, and best-practice gaps across all your gateways.
- The control plane deploys APIs directly to Amazon API Gateway and Azure API Management. For other gateways, deployment pipelines act on its violation reports.
- Federated APIs appear in the API Portal, with one subscription and key experience across gateways and identity providers.
- Unmanaged and non-compliant APIs surface centrally, reducing the risk of untracked shadow APIs.

For more information, see the [gateway federation overview](cloud/federation/overview.md).

### Are analytics unified across gateways?

Yes. Moesif is gateway-neutral, so one view covers WSO2 and third-party gateways. That view includes central alerts and webhooks.

## Analytics, monetization, and FinOps

### What analytics are available for API product managers?

API product managers get the following analytics:

- **Adoption:** unique users, requests, errors, onboarding trends, top APIs and applications, geographic demand, and latency. Adoption analytics cover REST, GraphQL, gRPC, SOAP, and event APIs.
- **Product intelligence:** customer journeys, usage funnels, conversion, time to first call, drop-offs, and retention cohorts.
- **AI and MCP:** tokens and spend by model and provider, plus tool calls, agents, sessions, and top tools.
- **Revenue:** billable usage linked to billing.
- **Dashboards:** drag-and-drop dashboards, natural-language queries through AI Explain, and embedded usage and quota views for each customer.

For more information, see [Insights](cloud/monitoring-and-insights/insights.md).

### How is LLM cost calculated and capped?

The LLM Cost policy reads the model from each response and looks up its pricing. It then computes the cost in USD from tokens, context-window tier, and service tier.

The LLM Cost-Based Rate Limit policy caps spend per period, for example, 100 USD per day. The most restrictive active limit applies, and over-budget requests get `429 Too Many Requests`. Response headers show the remaining budget. Token limits work alone or alongside cost budgets.

For more information, see [Cost control and budgets](ai-gateway/1.2.0/cost-control-and-budgets.md) and [Token-based rate limiting](ai-gateway/1.2.0/token-based-rate-limiting.md).

### What monetization models are supported?

The platform supports the following monetization models:

- **Plans:** free, flat-rate, unit, volume, and graduated plans. You package plans as API Products, and consumers purchase them in the portal.
- **AI pricing:** by token type (prompt, completion, or total), request count, model tier, provider, or estimated cost.
- **Billing models:** prepaid, postpaid, pay-as-you-go, tiered, and outcome-based billing.
- **Billing meters:** scripted fields and custom formulas on any traffic property. Firehose and Logstash connectors meter external events.
- **Billing systems:** Stripe natively, plus Zuora, Chargebee, Recurly, or custom systems through Moesif and webhooks.

For more information, see the [API monetization overview](monetization/overview.md).

### Can usage data be exported for chargeback?

Yes. Cost attribution per model, provider, team, and application supports chargeback and showback. You can export data in CSV, Parquet, or JSON format through the API, webhooks, or bulk export to Azure Storage. Quota rules can act on exhausted credits, contract violations, or suspicious usage.

## Interoperability

### Does the AI Gateway work with agents built on other frameworks?

Yes. Any agent routes model traffic through the gateway after you change its base URL and credentials. The switch works because the gateway exposes OpenAI-compatible and provider-native endpoints. Any MCP-compliant client works with MCP Proxies. You can also expose any agent over A2A with a managed Agent Card.

### Can third-party agent management platforms integrate?

Yes. The gateway exposes management APIs, OAuth-based identity, and OpenTelemetry events. WSO2 Agent Manager uses these interfaces, and any OpenTelemetry-compatible platform can do the same.

### Can the AI Gateway run alongside other AI gateways?

Yes. The AI Gateway can sit in front of or behind another gateway by treating it as a custom provider. OpenTelemetry brings telemetry from all gateways into one view.

!!! info "Upcoming"
    The AI Gateway federates with third-party AI gateways for discovery, governance, and combined analytics.

### Does the gateway integrate with external AI catalogs?

Yes. Third-party catalogs can scrape discovery endpoints for models, MCP servers, and Agent Cards. The gateway also emits events whenever a provider, MCP server, or Agent artifact changes.

## Related resources

- [Platform overview](index.md): components, deployment options, and key concepts.
- [Get Started](get-started.md): quick start guides organized by goal.
- [Guides](guides/overview.md): end-to-end scenarios that combine several platform features.
- [Policy Hub](policy-hub/overview.md): the curated collection of policies and guardrails for APIs, LLM traffic, and MCP servers.
- [API Portal and MCP Hub concepts](api-portal/1.0.0/concepts.md): organizations, views, applications, subscriptions, and API keys in the self-hosted portal.