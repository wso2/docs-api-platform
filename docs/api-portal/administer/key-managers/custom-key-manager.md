---
title: "Configure a Custom Key Manager"
description: "Register your own OAuth2 key manager, such as WSO2 Identity Server, Asgardeo, or Keycloak, in the API Portal and AI Hub."
---

ThunderID is the default key manager. To issue access tokens from your own identity provider instead, or in addition, register it as a custom key manager in the API Portal and AI Hub. Developers can then select it when they get an OAuth2 key.

:::info
Only administrators can add and manage key managers. Sign in to the API Portal and AI Hub as an administrator.
:::

## Key Manager Types

| Type | Use It For |
|:-----|:-----------|
| **ThunderID** | ThunderID. |
| **WSO2 Identity Server** | WSO2 Identity Server, using its DCR v1.1 API. |
| **Asgardeo** | Asgardeo. |
| **Custom** | Any key manager that implements RFC 7591 and RFC 7592, such as Keycloak, and has no type of its own. |
| **Provision** | No registration. Developers import a client ID that they created in the key manager. This type is always used when you select **In the identity server** for **OAuth2 applications**. |

## Add a Key Manager

1. Sign in to the API Portal and AI Hub as an administrator.

2. Go to **Settings**, and under **ORGANIZATION**, click the **Key Managers** tab.

3. Click **+ Add key manager**.

4. In **OAuth2 applications**, choose where OAuth2 applications are managed, and fill in the fields. When you select **In the identity server**, the form shows only **Name**, **Discovery URL**, **Token endpoint**, and **Key type**.

    | Field | Required | Description |
    |:------|:---------|:------------|
    | **Name** | Yes | The name that developers see when they choose where to create keys, such as `Production`. |
    | **OAuth2 applications** | Yes | **In the portal** to let the portal register applications over DCR, or **In the identity server** to let developers import the client ID of an application that they created. |
    | **Discovery URL** | No | The OpenID Connect discovery document of the key manager, such as `.../.well-known/openid-configuration`. Click **Fetch** to fill in the token, registration, and authorization endpoints from it. Shown only when you add a key manager, not when you edit one. |
    | **Token endpoint** | Yes | The endpoint that the portal sends `client_credentials` token requests to. |
    | **Key type** | Yes | **Production** for live traffic, or **Sandbox** for testing against sandbox endpoints. Every key created through this key manager has this type. |
    | **Key manager type** | In the portal | The [type](#key-manager-types) of the key manager. Not shown when you select **In the identity server**, which always uses the **Provision** type. |
    | **Registration endpoint** | In the portal | The RFC 7591 client registration endpoint. |
    | **Authorization endpoint** | No | The authorization endpoint. A key manager that only issues `client_credentials` tokens does not have one. |
    | **How the portal authenticates to it** | In the portal | The credential that the portal uses to register applications: **Client credentials**, **Basic**, or **API key**. The fields that follow depend on this choice. |
    | **Client ID** and **Client secret** | With client credentials | The portal's own OAuth2 client on the key manager, not a developer's. |
    | **Scopes** | No | The scopes that the portal requests in its token request. Add them if the key manager requires specific scopes to use its registration endpoint. |
    | **Resource indicator** | No | An [RFC 8707](https://datatracker.ietf.org/doc/html/rfc8707) `resource` value that the portal sends in its token request. Some key managers do not issue a token that their registration endpoint accepts without it. |
    | **Username** and **Password** | With basic | The HTTP Basic credentials for the registration endpoint. |
    | **API key**, **Header name**, and **Scheme** | With API key | The key, the header that carries it (`Authorization` by default), and an optional prefix such as `Bearer`. |
    | **Grant types developers may use** | No | Limits the grant types that developers can select when they generate an OAuth2 key. Leave it empty to allow all the grant types that the key manager type supports. |

    Fields marked **In the portal** apply only when the portal registers applications.

5. Click **Add key manager**.

:::warning
You cannot change the **Key type** or **Key manager type** of a key manager after you create it. Keys that are already issued keep the type that they were created with. To change either, register a new key manager.
:::

## Edit or Delete a Key Manager

- To edit a key manager, click its name or the edit icon. You can change the name, endpoints, and credentials, but not the key manager type or key type.

- To delete a key manager, click the delete icon. You cannot delete or rename a key manager while keys issued through it exist. Remove those keys first.

:::note
Deleting a key manager stops the applications that rely on it from getting new tokens through the portal. Tokens that the key manager already issued stay valid until they expire.
:::

## Next Steps

- [Key Managers](./overview.md) - Learn how key managers issue tokens, and about the default key manager
- [OAuth2 Keys](../../manage-keys/oauth2-keys.md) - Generate or add keys on a key manager as a developer
