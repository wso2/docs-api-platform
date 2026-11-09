---
title: "Key Managers"
description: "Learn how key managers issue access tokens for OAuth2-secured APIs in the API Portal and AI Hub, and how ThunderID works as the default key manager."
---

A key manager is the OAuth2 authorization server that issues access tokens for OAuth2-secured APIs. The API Portal and AI Hub sends token requests to the key manager, and can also create OAuth2 applications on it for developers.

## The Default Key Manager

ThunderID is configured as the default key manager for your organization. Developers can generate OAuth2 keys and access tokens on it without any setup from an administrator. See [Consume an OAuth2-Secured API](../../consume-an-api/oauth2.md).

To issue tokens from your own identity provider, such as WSO2 Identity Server, Asgardeo, or Keycloak, see [Configure a Custom Key Manager](./custom-key-manager.md).

## How Developers Get Keys

A key manager gives developers keys in one of the following ways.

| Mode | What Happens | When to Use It |
|:-----|:-------------|:---------------|
| **The portal registers the application** | The developer fills in a short form, and the portal registers a new OAuth2 client on the key manager over [Dynamic Client Registration](https://datatracker.ietf.org/doc/html/rfc7591) (DCR). The key manager returns a client ID and secret. The portal shows the secret **once** and never stores it. | The key manager supports DCR, and you want developers to get keys without using the console of the identity provider. |
| **The developer imports an existing client ID** | The developer creates the OAuth2 application in the console of the key manager, and then adds its client ID to the portal. | The key manager has no DCR endpoint, or a separate team controls who can create applications. |

ThunderID uses the first mode.

In both modes, the portal never stores a client secret. When a developer requests a token, the portal sends a `client_credentials` request to the token endpoint of the key manager, with the secret that the developer supplies for that one request.

:::note
When a developer updates or deletes a key that the portal registered, the portal applies the change in the key manager as well. Deleting the key deletes the OAuth2 application. Deleting an imported key only removes it from the portal, and the application stays in the key manager.
:::

## Next Steps

- [Configure a Custom Key Manager](./custom-key-manager.md) - Connect your own identity provider as a key manager
- [Consume an OAuth2-Secured API](../../consume-an-api/oauth2.md) - Generate a key and a token, and invoke the API
- [OAuth2 Keys](../../manage-keys/oauth2-keys.md) - Work with OAuth2 keys as a developer
