---
title: "Overview"
description: "What WSO2 API Manager offers across API design, AI Gateway, gateways, security, Developer Portal, rate limiting, analytics, governance, and deployment."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.6.0/get-started/overview/
md_url: https://wso2.com/api-platform/docs/api-manager/4.6.0/get-started/overview.md
tags:
  - api-manager
  - get-started
  - overview
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-23
content_type: "concept"
---

# Overview

WSO2 API Manager is a comprehensive, fully open-source API management platform that provides complete API lifecycle management with enterprise-grade security, advanced gateway capabilities, and AI-powered features. It enables organizations to design, secure, publish, and analyze APIs while providing developers with a rich marketplace experience.

## Core Capabilities
<hr style="border: 0; border-top: 1px solid #ccc; margin-top: -10px; margin-bottom: 20px;">

### Design & Create APIs

Create and manage diverse API types with comprehensive tooling and AI assistance:

- **Multiple API Types**: REST, GraphQL, WebSocket, WebSub/WebHook, Server-Sent Events (SSE), SOAP-to-REST, and AI APIs
- **API Design Tools**: OpenAPI/Swagger import, AsyncAPI support, GraphQL SDL, and service catalog integration
- **AI-Assisted Design**: Create APIs with AI, API Chat for testing, and Marketplace Assistant for discovery
- **API Products**: Combine resources from multiple APIs into unified product offerings
- **Prototype APIs**: Mock implementations and existing backend prototypes
- **Versioning & Revisions**: Comprehensive API versioning with revision-based deployment

> **[Learn more about API Design](../api-design-manage/design/design-api-overview.md)**

---

### AI Gateway Capabilities

Enterprise-grade AI infrastructure management with dual gateway modes:

- **LLM Gateway**: Direct AI model integration supporting OpenAI, Azure OpenAI, AWS Bedrock, Anthropic, Google Gemini, Mistral AI, and Azure AI Foundry
- **MCP Gateway**: Transform APIs into AI-discoverable tools following the Model Context Protocol
- **Multi-Model Routing**: Load balancing and failover across multiple AI providers
- **AI Guardrails**: Content filtering, PII masking, semantic validation, JSON schema validation, and provider-native safety controls
- **Semantic Caching**: Reduce latency and costs with meaning-based response caching
- **Prompt Management**: Centralized prompt templates and decorators for consistent AI interactions
- **Cost Control**: Smart routing, usage quotas, and spending limits to prevent runaway expenses

> **[Explore AI Gateway](../ai-gateway/ai-gateway-overview.md)**

---

### Universal & Federated Gateways

Deploy APIs across multiple gateway types with centralized management:

- **Universal Gateway**: Enterprise-grade API gateway with rate limiting, response caching, threat protection, policies, and scalability
- **Kubernetes Gateway Integration**: API Manager as Control Plane for WSO2 Kubernetes Gateway deployments
- **Federated Gateways**: Deploy and discover APIs on AWS API Gateway, Azure API Gateway, Kong Gateway, and Envoy Gateway
- **Multiple Environments**: Production, sandbox, and custom gateway environments
- **Gateway Policies**: Transformations, mediations, custom handlers, and policy enforcement

> **[Learn about Universal API Gateway](../api-gateway/overview-of-the-api-gateway.md)**

---

### Comprehensive API Security

Multi-layered security with flexible authentication and authorization:

- **Authentication Methods**: OAuth 2.0, API Keys, Mutual SSL, Basic Authentication, and Certificate Bound Access Tokens
- **Authorization**: Role-based access control (RBAC), OAuth scopes, XACML policies, and application scopes
- **Key Manager Integration**: Built-in key manager plus third-party support for WSO2 Identity Server, Keycloak, Okta, Auth0, PingFederate, ForgeRock, and Azure AD
- **Threat Protection**: Regular expression, JSON, and XML threat protectors, plus bot detection
- **OPA Validation**: Open Policy Agent integration for policy-based validation
- **Security Audit**: Design-time security audits and runtime validation

> **[Explore Runtime API Security](../api-security/runtime/api-authentication/api-authentication-overview.md)**

---

### Developer Portal & Marketplace

Rich developer experience with AI-powered discovery:

- **Marketplace Assistant**: AI-powered API discovery and recommendations
- **API Chat**: Natural language API testing interface
- **Integrated API Console**: Interactive testing for REST, GraphQL, and SOAP APIs
- **SDK Generation**: Auto-generate client SDKs in 13+ languages (Java, JavaScript, Python, C#, Swift, etc.)
- **Application Management**: Create applications, manage subscriptions, and generate access tokens
- **Collaboration**: Comments, ratings, forums, and social media integration
- **Self-Service**: User registration, password recovery, and profile management

> **[Visit Developer Portal](../api-developer-portal/consume-api-overview.md)**

---

### Advanced Rate Limiting

Sophisticated traffic management:

- **Multi-Level Policies**: Subscription (Business Plans), Application, Advanced, and Custom policies
- **Streaming API Support**: Event-based rate limiting for WebSocket, WebSub, and SSE APIs
- **AI API Limits**: Token-based and request-based rate limiting for AI workloads
- **Burst Control**: Handle traffic spikes with configurable burst limits
- **Conditional Policies**: IP-based, header-based, query parameter, and JWT claim-based rate limiting
- **Deny Policies**: Block specific IPs, applications, or users

> **[Understand Rate Limiting](../api-gateway/rate-limiting/understand-rate-limit-enforcement.md)**

---

### Analytics, Observability & Monetization

Comprehensive insights and revenue generation with multiple analytics solutions:

- **Moesif Analytics**: Advanced API analytics with user behavior tracking (New in 4.6.0)
- **Alternative Solutions**: ELK, Datadog, OpenSearch, and Choreo-based analytics
- **Observability**: Correlation logs, HTTP access logs, audit logs, API logs, and WebSocket logs
- **Tracing**: OpenTracing and OpenTelemetry integration
- **Metrics**: JMX-based monitoring and custom metrics
- **API Monetization**: Usage-based billing, subscription management, business plans (Free, Bronze, Silver, Gold, Unlimited), and Stripe integration for revenue generation

> **[Explore Analytics](../monitoring/api-analytics/analytics-overview.md)**

---

### API Lifecycle & Governance

Complete lifecycle management with compliance controls:

- **Lifecycle States**: CREATED, PRE-RELEASED, PUBLISHED, BLOCKED, DEPRECATED, and RETIRED
- **Custom Lifecycles**: Tailor lifecycle states to organizational needs
- **Workflows**: Human approval processes for API state changes, subscriptions, and applications
- **Governance Framework**: Rule-based validation with WSO2 API Management Guidelines, REST API Design Guidelines, and OWASP Top 10 compliance
- **CI/CD Support**: APIOps with apictl for environment promotion and automation
- **API Discovery**: Automatic API discovery from federated gateways

> **[Learn about Governance Framework](../administer/governance/overview.md)**

---

### Deployment Flexibility

Deploy anywhere with comprehensive infrastructure support:

- **Deployment Options**: Single node, Active-Active, Distributed, and Multi-DC deployments
- **Kubernetes**: Helm charts and operators for cloud-native deployments
- **OpenShift**: Native OpenShift deployment support
- **Multi-Tenancy**: Logical isolation for departments or organizational units

> **[View Deployment Options](deployment-platforms.md)**

---

## What's Next

- Get started quickly with the [Quick Start Guide](../get-started/api-manager-quick-start-guide.md)
- Understand the [architecture and key concepts](../get-started/apim-architecture.md)
- Explore [what's new in this release](../get-started/about-this-release.md)
- Try scenario-based [tutorials](../tutorials/tutorials-overview.md) for hands-on learning