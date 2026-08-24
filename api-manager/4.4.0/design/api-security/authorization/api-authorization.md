---
title: "API Authorization"
description: "Overview of fine-grained API access control: OAuth2 scopes and XACML-based role access control restrict access to authorized groups."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.4.0/design/api-security/authorization/api-authorization/
md_url: https://wso2.com/api-platform/docs/api-manager/4.4.0/design/api-security/authorization/api-authorization.md
tags:
  - api-manager
  - authorization
  - oauth2
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-15
content_type: "concept"
---

Nowadays, most of the enterprise applications are built with a collection of REST APIs. These APIs are being used by wide variety of users and devices. Due to the expanding consumer base, the application developers have to focus on limiting the API access in order to make sure that only the authorized parties have access to respective resources/services.

 WSO2 API Manager offers following fine grained API access control mechanism to restrict the API access to desired user groups only.

[Fine Grained Access Control Using Scopes](../../../design/api-security/oauth2/oauth2-scopes/fine-grained-access-control-with-oauth-scopes.md)

[Fine Grained Access Control Using XACML](../../../design/api-security/authorization/role-based-access-control-using-xacml.md)