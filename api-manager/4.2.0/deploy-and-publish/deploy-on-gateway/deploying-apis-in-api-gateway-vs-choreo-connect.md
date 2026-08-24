---
title: "Deploying APIs in API Gateway vs Choreo connect"
description: "Compare the traditional API Gateway and Choreo Connect across architecture, scaling, deployment, and CI/CD to choose the right Gateway for your APIs."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.2.0/deploy-and-publish/deploy-on-gateway/deploying-apis-in-api-gateway-vs-choreo-connect/
md_url: https://wso2.com/api-platform/docs/api-manager/4.2.0/deploy-and-publish/deploy-on-gateway/deploying-apis-in-api-gateway-vs-choreo-connect.md
tags:
  - api-manager
  - deploy-and-publish
  - deploy-on-gateway
  - deploying-apis-in-api-gateway-vs-choreo-connect
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "explanation"
---

# Deploying APIs in API Gateway vs Choreo Connect

**API Deploying** is the process of making the API available for invocation. WSO2 API Manager comes with two gateway choices, the traditional API Gateway and the lightweight Choreo Connect.

Choreo Connect is a cloud-native, open-source, and developer-centric API gateway proxy. It provides first-class support for K8s, while facilitating an array of API management quality of services (QoS), such as message security, rate-limiting, observability, and message mediation. It can also be configured to have multiple Gateway environments, which can have different sets of APIs.

### Choreo Connect vs API Gateway

Choreo Connect and the "traditional" API Gateway can be compared in different aspects as below.  The decision to select either of the Gateways is highly dependent on the architecture, design, and deployment. Both Gateways mostly have similar features and functionality, but works differently in order to cater for the purpose it was designed to serve.

#### Design and deployment comparison

| **Design/ Deployment**       | **Choreo Connect**                                       | **API Gateway**                        |
|-------------------------|---------------------------------------------------------|-----------------------------------|
|Architecture             |Designed for microservices                               |Designed for monolith              |
|Horizontal Scaling       |Scales independently as the runtime does not have a direct dependency on other components. Security and throttling validations are done within Choreo Connect.                           |  Scaling can be done with other components. For example, the traffic manager (one node per dedicated cluster of gateway nodes ) and key manager can be scaled along with the gateway.|
|Deployment distribution  | Decentralized                                           | Centralized                       |
|Runtime footprint        | Lightweight and can run on computers with low performance.| Designed to run on high performing computers with enough memory and more CPUs.|
|Isolated lockdown environments| Designed to work in a network isolated environment| Limited functionalities(affect on throttling/ analytics)|
|Cloud ready              | Yes                                                     | Yes                               |
|Automated API CI/CD flows| Supported with CLI tools                                |Supported with CLI tools           |
|Update APIs              | Supports both Mutable Gateway and Immutable Gateway     | Mutable Gateway                   |

#### Security Comparison

API Gateway and Choreo Connect both support different security mechanisms.

| **Security Mechanism**           | **Choreo Connect**                                              | **API Gateway**                       |
|------------------------------|:-------------------------------------------------------------:|:---------------------------------:|
| OAuth2                        | ![(Yes)](../../assets/img/deploy/check.svg) | ![(Yes)](../../assets/img/deploy/check.svg) |
| Mutual SSL                   | ![(Yes))](../../assets/img/deploy/check.svg) | ![(Yes)](../../assets/img/deploy/check.svg) |
| Basic Auth                   | Custom Filter can be developed                    | ![(Yes)](../../assets/img/deploy/check.svg) |
| API Keys                     | ![(Yes)](../../assets/img/deploy/check.svg) | ![(Yes)](../../assets/img/deploy/check.svg) |

#### Feature Comparison

|   **Feature**                                                  | **Choreo Connect**                                                                        |          **API Gateway**                                                                |
|----------------------------------------------------|:-------------------------------------------------------------------------:|:-----------------------------------------------------------------------:|
| SOAP backends                                      | ![(Yes)](../../assets/img/deploy/check.svg) | ![(Yes)](../../assets/img/deploy/check.svg)   |
| REST APIs                                          | ![(Yes)](../../assets/img/deploy/check.svg)   | ![(Yes)](../../assets/img/deploy/check.svg)   |
| JMS backends                                       | ![(No)](../../assets/img/deploy/error.svg) | ![(Yes)](../../assets/img/deploy/check.svg)   |
| GraphQL APIs                                       | ![(Yes)](../../assets/img/deploy/check.svg) | ![(Yes)](../../assets/img/deploy/check.svg)   |
| Web Socket APIs                                    | ![(Yes)](../../assets/img/deploy/check.svg) | ![(Yes)](../../assets/img/deploy/check.svg)   |
| Custom mediation/transformation                    | ![(Yes)](../../assets/img/deploy/check.svg)   | ![(Yes)](../../assets/img/deploy/check.svg)   |
| Advanced rate limiting (header, IP, query param, jwt claims) | ![(Yes)](../../assets/img/deploy/check.svg) | ![(Yes)](../../assets/img/deploy/check.svg)   |
| Advanced rate limiting (based on bandwidth) | ![(No)](../../assets/img/deploy/error.svg) | ![(Yes)](../../assets/img/deploy/check.svg)   |
| Schema validation                                  | ![(No)](../../assets/img/deploy/error.svg)   | ![(Yes)](../../assets/img/deploy/check.svg)   |
| JWT revocation                                     | ![(Yes)](../../assets/img/deploy/check.svg)   | ![(Yes)](../../assets/img/deploy/check.svg)   |
| Per resource Endpoints                             | ![(Yes)](../../assets/img/deploy/check.svg)   | ![(No)](../../assets/img/deploy/error.svg) |