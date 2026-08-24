---
title: "Set up a Third-party key manager"
description: "Understand the Key Manager component in a distributed API Manager deployment and how to plug in a third-party OAuth authorization server instead."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.0.0/install-and-setup/setup/distributed-deployment/configure-a-third-party-key-manager/
md_url: https://wso2.com/api-platform/docs/api-manager/4.0.0/install-and-setup/setup/distributed-deployment/configure-a-third-party-key-manager.md
tags:
  - api-manager
  - install-and-setup
  - setup
  - distributed-deployment
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "concept"
---

# Set up a Third-party Key Manager

The **Key Manager** handles all clients, security, and access token-related operations. In a typical API Manager production deployment, different components talk to the Key Manager component to achieve different tasks. The API Gateway connects with the Key Manager to check the validity of OAuth tokens, subscriptions, and API invocations. When a subscriber generates an access token to the application using the Developer Portal, the Developer Portal makes a call to the Key Manager to create an OAuth application and obtains an access token. 

At server startup, the Gateway fetches all the subscription validation meta information such as APIs, API policies, URL templates, applications, application keys, application policies, subscriptions, and subscription policies from the database and persists them in memory.
Therefore when required to validate a token, the API Gateway uses the in-memory data store and validates the token details. For more information, see [Key Manager](../../../get-started/apim-architecture.md#key-manager).

The Key Manager decouples the OAuth client and access token management from the rest of its operations so that you can plug in a third-party OAuth provider for managing OAuth clients and access tokens. When working with an external Key Manager, you need to configure the authorization server configurations in the WSO2 API Manager Admin Portal by adding a new Key Manager.

- [Integration with a third-party OAuth Authorization Server](../../../administer/key-managers/overview.md)