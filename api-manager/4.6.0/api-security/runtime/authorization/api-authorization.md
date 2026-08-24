---
title: "API authorization"
description: "Fine-grained API access control options in WSO2 API Manager: OAuth2 scopes, application scopes, and XACML-based role restrictions on resources."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.6.0/api-security/runtime/authorization/api-authorization/
md_url: https://wso2.com/api-platform/docs/api-manager/4.6.0/api-security/runtime/authorization/api-authorization.md
tags:
  - api-manager
  - api-security
  - runtime
  - authorization
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-23
content_type: "concept"
---

Nowadays, most of the enterprise applications are built with a collection of REST APIs. These APIs are being used by wide variety of users and devices. Due to the expanding consumer base, the application developers have to focus on limiting the API access in order to make sure that only the authorized parties have access to respective resources/services.

 WSO2 API Manager offers following fine grained API access control mechanism to restrict the API access to desired user groups only.

- [Fine Grained Access Control Using Scopes](oauth2-scopes/fine-grained-access-control-with-oauth-scopes.md)

- [Fine Grained Access Control Using XACML](role-based-access-control-using-xacml.md)

- [Fine Grained Access Control Using Application Scopes](oauth2-scopes/application-scopes.md)