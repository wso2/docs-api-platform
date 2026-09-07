---
title: "About this release"
description: "Features, compatible product versions, key considerations, and known limitations of WSO2 AI Workspace 1.0.0."
canonical_url: https://wso2.com/api-platform/docs/ai-workspace/1.0.0/about-this-release/
md_url: https://wso2.com/api-platform/docs/ai-workspace/next/about-this-release.md
tags:
  - cloud
  - ai-workspace
  - release-notes
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-05
content_type: "reference"
---

# About this release

AI Workspace is the control plane for managing how applications access artificial intelligence (AI) services. Platform teams register [AI Gateway runtimes](ai-gateways/setting-up.md) in it, configure large language model (LLM) [providers](llm-providers/overview.md) and [proxies](llm-proxies/overview.md), attach [AI policies](policies/overview.md), and manage [credentials](secrets-management.md). Developers then point their applications and agents at the deployed endpoints. It runs as a distribution you deploy yourself, keeps its own database, and reaches gateways through explicit deployment rather than automatic propagation.

**WSO2 AI Workspace 1.0.0** is the first AI Workspace release. Every capability listed below is available for the first time, so there is no predecessor to upgrade from.

For more information on AI Workspace, see the [AI Workspace overview](overview.md).

## Downloads

Download the AI Workspace distribution from the [WSO2 API Platform releases page](https://github.com/wso2/api-platform/releases). To run it locally with Docker Compose, follow [Get started with AI Workspace](getting-started.md).

## New features

??? note "AI Workspace control plane"

    AI Workspace separates AI configuration from AI traffic. You manage artifacts and policies in the workspace, and the AI Gateway enforces them at request time.

    - **Central configuration**: Manage LLM providers, App LLM proxies, Model Context Protocol (MCP) proxies, policies, and secrets from one console instead of configuring each gateway separately.
    - **Explicit deployment**: Changes take effect on live traffic only when you deploy them to a gateway.
    - **Deployment tracking**: See which artifacts are deployed to which gateways, deploy one artifact to several gateways, and serve several artifacts from one gateway.

    **[AI Workspace overview](overview.md)**

??? note "AI Gateway registration and management"

    Register the gateway runtimes that process your AI traffic, then deploy artifacts to them from the workspace.

    - **Token-based registration**: Register a gateway with a registration token that the workspace issues once.
    - **Status monitoring**: Track whether each registered gateway is active.
    - **Multi-gateway deployment**: Target one or more gateways when you deploy an artifact.

    **[Set up an AI Gateway](ai-gateways/setting-up.md)**

??? note "LLM providers for seven AI services"

    An LLM provider holds the endpoint and authentication configuration for an upstream AI service, and any number of proxies can reuse it.

    - **Built-in provider support**: Connect OpenAI, Azure OpenAI, Azure AI Foundry, Anthropic, Google Gemini, Mistral AI, and AWS Bedrock.
    - **Centralized credentials**: Store upstream API keys as secrets rather than in artifact configuration.
    - **Reusable configuration**: Support multiple proxies with a single provider without duplicating credentials.
    - **Direct invocation**: If you don't need application-specific controls, call a provider endpoint directly.
    - **Inbound authentication with API keys**: The gateway checks an API key on every incoming client request to a deployed provider. The workspace generates each key, shows it once, and sets a 90-day validity period. Send the key in `X-API-Key` by default, or in a header name that suits your software development kit (SDK). Inbound keys are separate from the upstream API key the gateway uses to call the AI service. See [Configure inbound authentication](configure-inbound-auth.md).
    - **SDK invocation**: Applications call a deployed provider through its Invoke URL using the OpenAI, Anthropic, Google Gemini, Mistral, Azure OpenAI, and LangChain SDKs. See [Invoke providers and proxies with AI SDKs](using-sdks.md).

    **[LLM providers overview](llm-providers/overview.md)**

??? note "LLM provider templates for custom services"

    A template is a reusable blueprint that captures the endpoint URL, inbound authentication settings, OpenAPI definition, and token and model mappings for an upstream service.

    - **Built-in templates**: Use the read-only templates shipped for the seven supported services, and enable or disable each one.
    - **Custom templates**: Define a template for any AI service that has no built-in template, from scratch or as a new version of a built-in template.
    - **Versioning**: Keep multiple versions of a custom template, and see the highest-numbered version on each template card.
    - **Provider type selector integration**: Custom templates appear alongside built-in providers when you add a provider.

    **[LLM provider templates overview](llm-provider-templates/overview.md)**

??? note "App LLM proxies"

    If a specific generative AI (GenAI) application or agent needs its own controls, an App LLM proxy adds an application-facing endpoint on top of a provider.

    - **Isolated configuration**: Give each application, agent, team, or environment its own guardrails, access keys, and exposed resources.
    - **Resource control**: Choose which API paths the proxy exposes, and enable or disable them without changing the upstream provider.
    - **Provider switching**: If the replacement provider preserves the client-facing contract, swap the underlying provider without client changes.
    - **Inbound authentication with API keys**: Require an API key that the workspace generates for that proxy, independently of the keys on the underlying provider. The same header name and 90-day validity rules apply. See [Configure inbound authentication](configure-inbound-auth.md).
    - **SDK invocation**: Applications call a deployed proxy with the same AI SDKs and the same code path as a provider. The Invoke URL is the only difference. See [Invoke providers and proxies with AI SDKs](using-sdks.md).

    **[App LLM proxies overview](llm-proxies/overview.md)**

??? note "MCP proxies"

    An MCP proxy routes requests through the gateway to an upstream MCP server, so MCP clients call a managed endpoint instead of the server directly.

    - **Managed MCP endpoints**: Expose an upstream MCP server through a gateway endpoint over streamable HTTP.
    - **Security**: Authenticate and authorize the callers of MCP traffic.
    - **Policy enforcement**: Attach policies that control the MCP traffic passing through the gateway.
    - **Observability**: See which tools and servers are called, and which calls fail.

    **[MCP proxies overview](mcp-proxies/overview.md)**

??? note "AI policies for content, traffic, and cost"

    Policies run on the gateway at request time. Attach a policy to a provider as a baseline, or to a proxy for one application or agent.

    - **Guardrails** inspect and act on request and response content:

        - **Content safety**: Azure content safety moderation, NVIDIA NeMo Guard content safety classification, and AWS Bedrock guardrails.
        - **Prompt protection**: Semantic prompt guard for similarity-based allow and block lists, and IBM Granite Guardian for prompt injection and jailbreak detection.
        - **PII protection**: Regex-based masking of personally identifiable information (PII), with restoration in the response.
        - **Validation**: Word count, sentence count, content length, JSON schema, regex, and URL guardrails.
        - **Tool filtering**: Semantic tool filtering, which limits the tools exposed to a model by relevance to the user query.
        - See [Guardrail policies](policies/overview.md#guardrails).

    - **Rate limiting** caps several different measures of traffic, because many AI services bill per token:

        - **Rate limit: basic**: Caps request count within a time window.
        - **Rate limit: advanced**: Caps request count with multi-dimensional and weighted quotas. Offers a choice of the generic cell rate algorithm (GCRA) or fixed window, and in-memory or Redis counters.
        - **Token-based rate limit**: Caps prompt, completion, or total tokens, independently or in combination.
        - **LLM cost and LLM cost-based rate limit**: Calculate the monetary cost of each call, and cap spend in US dollars (USD).
        - **Built-in provider limits**: Cap requests and tokens from the **Rate Limiting** tab of a provider without attaching a policy.
        - See [Rate limiting policies](policies/overview.md#rate-limiting).

    - **Traffic, prompt, and provider transformations** shape how requests are routed, composed, and translated:

        - **Model routing**: Model round robin and model weighted round robin distribute requests across models.
        - **Header-based routing**: The LLM header router selects the target provider from a request header, so one OpenAI-shaped endpoint routes requests to several providers.
        - **Prompt handling**: Prompt decorator, prompt template, and prompt compressor.
        - **Response handling**: Semantic caching for semantically similar requests, and the respond policy for mocking and short-circuit logic.
        - **Provider transformation**: Translate an OpenAI Chat Completions request into the Anthropic, Azure OpenAI, AWS Bedrock Converse, Gemini, or Mistral API shape, and translate the response back.
        - See [Traffic management and prompt policies](policies/overview.md#traffic-management-and-prompt-policies).

    **[AI policies overview](policies/overview.md)**

??? note "Custom AI policies"

    When no built-in policy covers a requirement, write your own and run it on the gateway.

    - **Policy authoring**: Define a policy with its own version and configuration schema.
    - **Gateway packaging**: Build a gateway image that includes your policies.
    - **Attachment**: Attach a custom policy to a provider or proxy the same way as a built-in policy.

    **[Write an AI policy](policies/writing-an-ai-policy.md)**

??? note "Secrets management"

    Secrets keep raw API keys, tokens, and passwords out of artifact configuration.

    - **Encryption at rest**: Secrets are encrypted with AES-GCM-256. Plaintext values are never written to the database and never returned in an API response, including the creation response.
    - **Placeholder references**: Reference a secret from LLM provider configurations, MCP proxy configurations, and API backend settings, and the gateway resolves it at request time.
    - **Automatic secret creation**: Upstream API keys entered in the AI Workspace user interface (UI) become secrets. AI Workspace replaces each key with a placeholder before it saves the artifact.
    - **Rotation without redeployment**: Update the secret value by handle, and referencing artifacts need no change.

    **[Secrets management](secrets-management.md)**

??? note "Management of gateway-deployed AI artifacts"

    Artifacts created directly on a gateway sync up to AI Workspace, which reverses the usual flow from AI Workspace to the gateway.

    - **Automatic sync**: Automatic sync is enabled by default. LLM provider templates, LLM providers, LLM proxies, and MCP proxies created on a gateway appear in the workspace.
    - **Gateway ownership**: Deployment fields stay read-only in the workspace, because the gateway owns them.
    - **Editable metadata**: Descriptions, documentation, OpenAPI definitions, and template connection details remain editable.
    - **Independent operation**: If AI Workspace is unavailable, these artifacts keep serving traffic.

    **[Sync gateway-created artifacts](sync-gateway-created-artifacts.md)**

??? note "Git-based CI/CD with the `ap` CLI"

    Git-based continuous integration and continuous delivery (CI/CD) lets you manage AI Workspace artifacts as version-controlled project files. You run each step with the `ap` command-line interface (CLI) instead of making changes in the UI.

    - **Declarative project files**: Describe an artifact in `metadata.yaml`, `runtime.yaml`, and `definition.yaml`, and commit them to source control.
    - **Supported artifact types**: LLM providers, App LLM proxies, and MCP proxies.
    - **Validate and apply**: Validate an artifact with `ap ai-workspace build`, apply it with `ap ai-workspace apply`, and deploy the runtime artifact with `ap gateway apply -f runtime.yaml`.
    - **Synchronous operations**: Each step runs from the project files, so the control plane and the gateway runtime don't depend on each other during artifact application.

    **[Git-based CI/CD overview](ci-cd/overview.md)**

??? note "Insights through Moesif"

    The gateway runtime publishes AI traffic telemetry to [Moesif](https://www.moesif.com/), an API analytics platform.

    - **Published telemetry**: Requests, token usage, latency, cost, and guardrail events.
    - **Single configuration step**: Set the `MOESIF_KEY` environment variable on the gateway runtime, and no workspace change is required.
    - **Insights page**: Select **Insights** in the AI Workspace left navigation menu to open your Moesif workspace.

    **[Insights through Moesif](insights.md)**

??? note "Deployment configuration"

    AI Workspace and the Platform API read their settings from a single `config.toml` file.

    - **Interpolation tokens**: Pull values in from environment variables and mounted files, so sensitive values stay out of configuration files.
    - **Setup script**: Provision the Transport Layer Security (TLS) certificate, JSON Web Token (JWT) signing keypair, encryption keys, session secret, and admin credentials with `./scripts/setup.sh`. The script stops without generating weaker values.
    - **Configurable ports**: Remap the published host port, or change the port each service listens on.
    - **Database options**: Store artifacts in SQLite, which is the default, PostgreSQL, or Microsoft SQL Server, with TLS and connection pool settings.

    **[Deployment configuration reference](setting-up/configuration.md)**

??? note "User authentication modes"

    AI Workspace supports two sign-in modes, and a running instance uses one at a time.

    - **File-based authentication**: Validate credentials against a hashed user list in configuration, with no identity provider required, for local use and demos.
    - **Identity provider authentication**: Delegate login to an OpenID Connect (OIDC) identity provider for production.
    - **Role assignment**: Assign roles per user to control what each person can do.

    **[User authentication overview](setting-up/authentication/overview.md)**

## Compatible product versions

AI Workspace deploys artifacts to the AI Gateway and shares a control plane with the API Portal. The following table lists the product versions tested with this release:

| Product | Compatible version |
|---------|--------------------|
| WSO2 AI Gateway | 1.2.0 |
| WSO2 API Portal | 1.0.0 |

## Key changes

None. There is no earlier release to migrate a deployment from.

## Improvements

None. This is the first release, so there is no earlier behavior to improve on.

## Deprecations

None.

## Fixed issues

None recorded against a released version, since this is the first release.

## Known issues

- [Open AI Workspace issues in GitHub](https://github.com/wso2/api-platform/issues?q=is%3Aissue%20state%3Aopen%20label%3AArea%2FAIWorkspace)