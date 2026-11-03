---
title: "Manage Key Managers"
description: "Register the OAuth2 key managers that issue access tokens for your APIs from the Settings page of the API Portal and AI Hub."
---

A key manager is the OAuth2 authorization server that issues access tokens for OAuth2-secured APIs. When you register a key manager in the API Portal and AI Hub, the portal knows where to send token requests. If the key manager supports [Dynamic Client Registration](https://datatracker.ietf.org/doc/html/rfc7591) (DCR), the portal can also create OAuth2 applications on behalf of developers.

## How Developers Get Keys

When you register a key manager, you choose one of the following ways for developers to get keys from it.

| Mode | What Happens | When to Use It |
|:-----|:-------------|:---------------|
| **The portal registers the application** | The developer fills in a short form, and the portal registers a new OAuth2 client on the key manager over DCR. The key manager returns a client ID and secret. The portal shows the secret **once** and never stores it. | The key manager implements RFC 7591, and you want developers to get keys without using the console of the identity server. |
| **The developer imports an existing client ID** | The developer creates the OAuth2 application in the console of the key manager, and then pastes its client ID into the portal. | The key manager has no DCR endpoint, or a separate team controls who can create applications. |

In both modes, the portal never stores a client secret. When a developer requests a token, the portal sends a `client_credentials` request to the token endpoint of the key manager, with the secret that the developer supplies for that one request.

## Key Manager Types

| Type | Use It For |
|:-----|:-----------|
| **ThunderID** | ThunderID. |
| **WSO2 Identity Server** | WSO2 Identity Server, using its DCR v1.1 API. |
| **Asgardeo** | Asgardeo. |
| **Custom** | Any key manager that implements RFC 7591 and RFC 7592, such as Keycloak, and has no type of its own. |
| **Provision** | No registration. Developers import a client ID that they created in the key manager. This type is used when you select **In the identity server** for **OAuth2 applications**. |

## Add a Key Manager

1. In the API Portal and AI Hub, go to **Settings**, and under **ORGANIZATION**, click the **Key Managers** tab.

2. Click **+ Add key manager**.

3. In **OAuth2 applications**, choose where OAuth2 applications are managed, and fill in the fields. When you select **In the identity server**, the form shows only **Name**, **Discovery URL**, **Token endpoint**, and **Key type**.

    | Field | Required | Description |
    |:------|:---------|:------------|
    | **Name** | Yes | The name that developers see when they choose where to create keys, such as `Production`. |
    | **OAuth2 applications** | Yes | **In the portal** to let the portal register applications over DCR, or **In the identity server** to let developers import the client ID of an application that they created. |
    | **Discovery URL** | No | The OpenID Connect discovery document of the key manager, such as `.../.well-known/openid-configuration`. Click **Fetch** to fill in the token, registration, and authorization endpoints from it. |
    | **Token endpoint** | Yes | The endpoint that the portal sends `client_credentials` token requests to. |
    | **Key type** | Yes | **Production** for live traffic, or **Sandbox** for testing against sandbox endpoints. Every key created through this key manager has this type. |
    | **Key manager type** | In the portal | The [type](#key-manager-types) of the key manager. |
    | **Registration endpoint** | In the portal | The RFC 7591 client registration endpoint. |
    | **Authorization endpoint** | No | The authorization endpoint. A key manager that only issues `client_credentials` tokens does not have one. |
    | **How the portal authenticates to it** | In the portal | The credential that the portal uses to register applications: **Client credentials**, **Basic**, or **API key**. The fields that follow depend on this choice. |
    | **Client ID** and **Client secret** | With client credentials | The portal's own OAuth2 client on the key manager, not a developer's. |
    | **Scopes** | No | The scopes that the portal requests in its token request. Add them if the key manager requires specific scopes to use its registration endpoint. |
    | **Resource indicator** | No | An [RFC 8707](https://datatracker.ietf.org/doc/html/rfc8707) `resource` value that the portal sends in its token request. Some key managers require it. |
    | **Username** and **Password** | With basic | The HTTP Basic credentials for the registration endpoint. |
    | **API key**, **Header name**, and **Scheme** | With API key | The key, the header that carries it (`Authorization` by default), and an optional prefix such as `Bearer`. |
    | **Grant types developers may use** | No | The grant types that developers can select. Leave it empty to allow all the grant types that the key manager type supports. |

    Fields marked **In the portal** apply only when the portal registers applications.

4. Click **Add key manager**.

:::warning
You cannot change the **Key type** or **Key manager type** of a key manager after you create it. To change either, register a new key manager.
:::

## Edit or Delete a Key Manager

- To edit a key manager, click its name or the edit icon. You can change the name, endpoints, and credentials.
- To delete a key manager, click the delete icon. You cannot delete or rename a key manager while keys issued through it exist. Remove those keys first.

After you delete a key manager, the applications that rely on it cannot get new tokens through the portal. Tokens that the key manager already issued stay valid until they expire.

## How Developers Use Key Managers

1. The developer opens **OAuth2 Keys** and chooses a key manager.

2. If the key manager registers applications, the developer fills in the application details, and the portal creates the OAuth2 client. The portal shows the client secret once, when it creates the client, and cannot show it again.

3. If the key manager expects an existing application, the developer pastes the client ID of an application that they created in the console of the key manager.

4. To get a token, the developer supplies the client secret, and the portal sends a `client_credentials` request to the token endpoint. The portal uses the secret for that one request and does not store it.

When a developer updates or deletes a key that the portal registered, the portal applies the change in the key manager as well. Deleting the key deletes the OAuth2 application. Deleting an imported key only unlinks it, and the application stays in the key manager.

## Next Steps

- [Call an OAuth2-Secured API](../consume-an-api/oauth2.md) - Get an access token and invoke an OAuth2-secured API
