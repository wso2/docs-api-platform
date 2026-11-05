---
title: "OAuth2 Authentication"
description: "Authenticate API invocations with access tokens issued by an external key manager that is registered in the API Portal and AI Hub."
---

You can secure an API proxy with access tokens issued by an external key manager, such as ThunderID, WSO2 Identity Server, Asgardeo, or any key manager that supports Dynamic Client Registration, such as Keycloak.

## Prerequisites

- An API proxy that is deployed and published. To create one, follow the [Quick Start Guide](../../quickstart-guide.md).
- An administrator has registered the key manager in the API Portal and AI Hub. For more information, see [Key Managers](../../../api-portal/administer/key-managers/overview.md).

## How It Works

1. An administrator registers the key manager in the API Portal and AI Hub, and chooses whether the portal creates OAuth2 applications on the key manager, or developers create them in the key manager and import their client IDs.

2. A consumer gets an OAuth2 key for the key manager in the API Portal and AI Hub, under **Keys** › **OAuth2 Keys**.

3. The consumer gets an access token with the key, from the portal or directly from the token endpoint of the key manager.

4. The consumer sends the access token as a bearer token when invoking the API.

For the steps that consumers follow, see [Consume an OAuth2-Secured API](../../../api-portal/consume-an-api/oauth2.md).
