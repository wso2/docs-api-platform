---
title: "About this release"
description: "What ships in WSO2 API Manager 4.6.0: MCP Gateway, AI guardrails, federated gateway discovery, improvements, deprecations, and fixed issues."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.6.0/get-started/about-this-release/
md_url: https://wso2.com/api-platform/docs/api-manager/4.6.0/get-started/about-this-release.md
tags:
  - api-manager
  - get-started
  - about-this-release
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-23
content_type: "release-notes"
---

# About this Release

WSO2 API Manager is a complete platform for building, integrating, and exposing your digital services as managed APIs in the cloud, on-premise, and hybrid architectures to drive your digital transformation strategy. It comes with a cloud-native, standards-based messaging engine, and an integration framework for integrating APIs, services, data, SaaS, proprietary, and legacy systems and it can also serve streaming-based integrations. The product comes with command-line and developer tools that enable easy design, development, and testing.

**WSO2 API Manager 4.6.0** is the latest **WSO2 API Manager release** and is the successor of **WSO2 API Manager 4.5.0**.

For more information on WSO2 API Manager, see the [overview](overview.md).

## Downloads

<a href="https://wso2.com/api-manager/#"><img src="../../assets/img/get_started/download-apim.png" title="Download WSO2 API Manager" width="25%" alt="Download WSO2 API Manager"/></a>

## New Features

??? note "MCP Gateway"

    WSO2 API Manager now supports the Model Context Protocol (MCP), enabling seamless integration between APIs and AI agents. Organizations can transform existing APIs into MCP-compatible services, import and expose external APIs as MCP servers, or proxy remote MCP servers through API Manager for centralized governance.

    Key Capabilities:

    - **Existing API to MCP conversion:** Automatically convert existing APIs into MCP-compatible services.
    - **MCP Servers from external APIs:** Import and expose external APIs as MCP Servers.
    - **Managing remote MCP Servers:** Import an external MCP Server and proxy via WSO2 API Manager.
    - **QoS for MCP Servers:** Apply rate limiting, authentication, and other policies.

    **[Learn more](../ai-gateway/mcp-gateway/overview.md)**

??? note "MCP Hub"

    The control plane can now function as a MCP Hub, enabling centralized discovery and reuse of MCP Servers across teams and environments.

    **[Learn more](../ai-gateway/mcp-gateway/invoke-a-mcp-server-using-playground.md)**

??? note "Multi-Model AI Service Provider Support"

    This release introduces support for configuring multi-model AI Service Providers, extending beyond the single provider support available previously. Organizations can now onboard AI Service Providers to gain unified AI model management capabilities across multiple providers.

    - Provides a hierarchical model structure (Service Provider → Model Provider → Model) to unify AI model operations across multiple providers.
    - Supports dynamic model selection based on performance, cost, or compliance, with detailed usage analytics and flexible business plans.

    Onboarded AI service providers:

    - [AWS Bedrock](../ai-gateway/ai-vendor-management/aws-bedrock.md)
    - [Azure AI Foundry](../ai-gateway/ai-vendor-management/azure-ai-foundry.md)

??? note "AI Guardrails and Semantic Caching for AI Gateway"

    AI Gateway is now equipped with AI Guardrails and Semantic Caching.

    - **AI Guardrails:** Real-time validation and enforcement to ensure AI safety, reliability, and compliance. **[Learn more](../ai-gateway/ai-guardrails/overview.md)**
    - **Semantic Caching:** Meaning-based response caching for improved performance and reduced latency in AI workloads. **[Learn more](../ai-gateway/semantic-caching.md)**

??? note "API Discovery support for Federated Gateways"

    WSO2 API Manager 4.6.0 release introduces the API discovery support for Federated Gateways. The allows organizations to manage APIs deployed in multiple third-party gateways through a unified control plane. Gateways supported in this release include:

    - [AWS API Gateway](../api-gateway/federated-gateways/aws/discover-apis-on-aws-api-gateway.md)
    - [Azure API Gateway](../api-gateway/federated-gateways/azure/discover-apis-on-azure-api-gateway.md)
    - Kong Gateway: [Kubernetes](../api-gateway/federated-gateways/kong/kong-kubernetes/discover-apis-on-kong-gateway-in-kubernetes.md) | [Standalone](../api-gateway/federated-gateways/kong/kong-standalone/discover-apis-on-kong-gateway.md)
    - [Envoy Gateway](../api-gateway/federated-gateways/envoygateway/eg-k8s/discover-apis-on-eg-gateway-in-kubernetes.md)

    **[Learn more](../api-gateway/federated-gateways/overview.md)**

??? note "API Analytics with Moesif"

    Moesif-powered Analytics for enhanced insights and observability.

    This integration enables you to collect and publish API analytics data to the Moesif dashboard, providing insights into API usage, traffic trends, and error tracking in near real-time.

     **[Learn more](../monitoring/api-analytics/moesif-analytics/moesif-integration-guide.md)**

??? note "Application update workflow"

    Enhances application lifecycle management by introducing workflow-driven updates with an approval process. This ensures governance and compliance before changes are applied, as applications enter an UPDATE PENDING state until updates are reviewed and approved.

     **[Learn more](../api-developer-portal/manage-application/advanced-topics/adding-an-application-update-workflow.md)**

??? note "Application level scopes"

    Application scopes provide fine-grained control over permissions at the application level, enhancing security and flexibility. These scopes are configured as allowed scopes for specific applications and can only be selected from the subscribed scopes (scopes available from all subscribed APIs).

     **[Learn more](../api-security/runtime/authorization/oauth2-scopes/application-scopes.md)** 

## Improvements

??? note "Newly onboarded AI Service Providers"

    With this release, we have onboarded the following AI Service Providers that are ready for use out of the box.

    - [AWS Bedrock](../ai-gateway/ai-vendor-management/aws-bedrock.md)
    - [Azure AI Foundry](../ai-gateway/ai-vendor-management/azure-ai-foundry.md)
    - [Gemini](../ai-gateway/ai-vendor-management/gemini.md)
    - [Anthropic](../ai-gateway/ai-vendor-management/anthropic.md)

    Also, we have shipped version 2.0.0 for the following AI Service Providers:

    - OpenAI
    - AzureOpenAI

??? note "Redis-based counter sharing for traffic management"

    - Introduces distributed throttling powered by external CRDT-based counters (e.g., Redis, Valkey) as the underlying mechanism for API rate limiting in multi-node and multi-cluster environments.
    - All gateways share throttling state through distributed counters, ensuring consistent and accurate rate limiting regardless of which node or cluster processes a request.
    - This model supports billions of API calls per day while maintaining high performance and real-time throttling decisions.

     **[Learn more](../api-gateway/rate-limiting/distributed-throttling.md)**

??? note "Gateway health and API deployment monitoring support"

    Adds new observability and monitoring capabilities for gateway operations.

    - **Gateway health monitoring:** View real-time gateway availability, status, and performance via the Admin Portal.
    - **API deployment monitoring:** Track API deployments and undeployments per gateway instance, with active revision visibility in the Publisher Portal.

    These enhancements improve transparency, troubleshooting efficiency, and operational confidence across distributed environments.

??? note "Removing database dependency of multi-tenant API gateways"

    - Introduces database dependency removal for the Universal Gateway to improve scalability and deployment flexibility in multi-tenant environments.
    - Gateways now operate independently without shared database access, synchronizing only tenant-specific data with the control plane.
    - This architecture enhances horizontal scalability, fault isolation, and resilience, enabling seamless scaling across distributed and high-traffic deployments.

     **[Learn more](../api-design-manage/deploy-and-publish/deploy-on-gateway/api-gateway/maintain-seperate-gateways-per-tenants.md)**

??? note "API Analytics with OpenSearch"

    WSO2 API Manager now supports OpenSearch as the analytics provider for private cloud and on-premises environments. This solution publishes analytics data into log files, which are then processed through a deployment architecture consisting of Fluent Bit, OpenSearch, and OpenSearch Dashboards.

     **[Learn more](../monitoring/api-analytics/on-prem/opensearch-installation-guide.md)**

## Compatible WSO2 product versions

--8<-- "api-manager/4.6.0/includes/compatibility-matrix.md"

## Key Changes

Before upgrading to WSO2 API Manager 4.6.0, review the following architectural considerations that may affect your deployment setup:

- **Support for Choreo Analytics has been deprecated:**
Choreo Analytics has been deprecated in favor of Moesif-powered WSO2 Analytics, which offers enhanced insights and observability.

- **Removing database dependency of multi-tenant API gateways:**
With the removal of database dependency in the Universal Gateway and Traffic Manager, users no longer need to share databases with the control plane to support multi-tenancy.
This change improves scalability and simplifies deployment across distributed environments.

- **Disabled Admin Services:**
[Admin Services](../reference/wso2-admin-services.md) are SOAP-based web services that are used for internal management. We have disabled the below listed services from APIM 4.6.0 onwards:

    ??? note "List of denied admin services"
        - ClassMediatorAdmin
        - CommandMediatorAdmin
        - ConfigServiceAdmin
        - CustomMeteringService
        - DeploymentSynchronizerAdmin
        - EndpointTemplateAdminService
        - ESBNTaskAdmin
        - MediationLibraryAdminService
        - MediationLibraryUploader
        - MediationSecurityAdminService
        - MetricsDataService
        - ModuleAdminService
        - RemoteTaskAdmin
        - StatisticsAdmin
        - SynapseApplicationAdmin
        - SynapseArtifactUploaderAdmin
        - TemplateAdminService
        - ThemeMgtService
        - TierCacheService
        - WebappAdmin

## Deprecations

[Admin Services](../reference/wso2-admin-services.md) are SOAP-based web services that are used for internal management. Note that we have deprecated the below listed services from APIM 4.6.0 onwards:

??? note "Deprecated admin services"
    - APIGatewayAdmin
    - APIKeyMgtRemoteUserStoreMgtService
    - APILocalEntryAdmin
    - CustomMeteringService
    - EmailVerificationService
    - LoginStatisticsAdmin
    - LogViewer
    - PackageInfoService
    - QpidAdminService
    - RegistryCacheInvalidationService
    - TierCacheService

## Fixed issues

- [API Manager](https://github.com/wso2/api-manager/issues?q=is%3Aissue%20is%3Aclosed%20label%3AComponent%2FAPIM%20closed%3A2025-03-06..2025-10-28%20-label%3AResolution%2FInvalid%20-label%3AResolution%2FDuplicate%20-label%3A%22Resolution%2FNot%20a%20bug%22%20-label%3A%22Resolution%2FCannot%20Reproduce%22%20-label%3A%22Resolution%2FWon%E2%80%99t%20Fix%22)
- [API Controller](https://github.com/wso2/api-manager/issues?q=is%3Aissue%20is%3Aclosed%20label%3AComponent%2FAPICTL%20closed%3A2025-03-06..2025-10-28%20-label%3AResolution%2FInvalid%20-label%3AResolution%2FDuplicate%20-label%3A%22Resolution%2FNot%20a%20bug%22%20-label%3A%22Resolution%2FCannot%20Reproduce%22%20-label%3A%22Resolution%2FWon%E2%80%99t%20Fix%22)

## Known issues

- [API Manager](https://github.com/wso2/api-manager/issues?q=is%3Aissue+label%3AComponent%2FAPIM+is%3Aopen)
- [API Controller](https://github.com/wso2/api-manager/issues?q=is%3Aissue+label%3AComponent%2FAPICTL+is%3Aopen)