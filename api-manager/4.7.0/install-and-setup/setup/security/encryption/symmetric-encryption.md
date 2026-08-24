---
title: "Symmetric Encryption in WSO2 API Manager"
description: "Learn why WSO2 API Manager uses symmetric key encryption by default to protect secrets and tokens, and how to configure a custom encryption key."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.7.0/install-and-setup/setup/security/encryption/symmetric-encryption/
md_url: https://wso2.com/api-platform/docs/api-manager/4.7.0/install-and-setup/setup/security/encryption/symmetric-encryption.md
tags:
  - api-manager
  - security
  - configuration
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "concept"
---

# Symmetric Encryption

Symmetric encryption uses a single key to encrypt and decrypt information. WSO2 API Manager uses symmetric encryption by default.

!!! note
    If required, you may switch to [asymmetric key encryption](asymmetric-encryption.md).

## Why symmetric key encryption?

From WSO2 API Manager version 4.7.0 onwards, symmetric key encryption is used as the default encryption mechanism due to the following reasons:

- **Ability to easily change key stores** - In earlier versions, internal data was encrypted using asymmetric key encryption. This means that whenever the certificates expire, or when the keystore is changed, all encrypted data should be migrated. With the shift to symmetric encryption, this overhead is now removed.

- **Industry-wide usage** - Symmetric key encryption is used as an accepted industry-wide mechanism for encrypting internal sensitive data. This includes both on-premise and cloud platforms. 

- **Post-Quantum Security** - Quantum computers have the potential to break widely-used asymmetric encryption algorithms such as RSA and ECC by efficiently solving the underlying mathematical problems. Symmetric key encryption, on the other hand, is more resistant to quantum attacks. 

## How is it used?

WSO2 API Manager uses the `AES/GCM/NoPadding` algorithm for symmetric key encryption. GCM is an authenticated encryption mode that supports parallelizable encryption/decryption, which can improve performance. WSO2 API Manager supports AES-256 key size.

WSO2 API Manager uses symmetric key encryption to encrypt the following sensitive data and credentials.

- **Backend security secrets** - Passwords and credentials for secured backend endpoints configured in the Publisher Portal. For more information on encrypting secured endpoint passwords, see [Working with Encrypted Passwords](../logins-and-passwords/working-with-encrypted-passwords.md#encrypting-secured-endpoint-passwords).

- **Key Manager secrets** - Credentials and configuration secrets for Key Manager components managed in the Admin Portal.

- **Gateway secrets** - API Gateway related credentials and security configurations managed in the Admin Portal.

- **API Policy secrets** - Sensitive data within API policies and configurations managed in the Publisher Portal.

- **Access Tokens** - OAuth 2.0 access tokens, refresh tokens, authorization codes, and consumer secrets when token encryption is enabled in the Developer Portal. For more information on encrypting OAuth 2.0 tokens, see [Encrypting OAuth2 Tokens](../../../../api-security/key-management/tokens/encrypting-oauth2-tokens.md).

- **Mediation Policy secrets** - Sensitive data and credentials within mediation policies configured in the Publisher Portal.

- **User store configuration credentials** - Secondary user store properties and authentication credentials managed in the Carbon Console.

- **AI API Key secrets** - API keys and credentials for AI APIs configured in the Publisher Portal.

## Generate a secret key

For enhanced security, it is recommended to generate your own secret key for symmetric key encryption in WSO2 API Manager.

!!! warning
    Apply all changes before starting WSO2 API Manager for the first time.

To do so,

1. Generate a unique 256-bit secret key. If you use OpenSSL, the command will be as follows:

    ```bash
    openssl rand -hex 32
    ```

2. Add your generated key to the `deployment.toml` found in the `<APIM_HOME>/repository/conf/` directory as follows:

    ```toml
    [encryption]
    key = "<generated-64-char-hex-key>"
    ```  

!!! warning
    **Distributed and Cloud Deployments**  
    In a distributed or high-availability deployment, **all API Manager instances must use the exact same `[encryption]` key** in their `deployment.toml` files. Each instance encrypts and decrypts shared registry resources using this key, so a mismatch will cause decryption failures across the cluster. Configure the shared key on every node before the first startup.

If a custom encryption key is not provided, it will auto-generate a random encryption key during server startup with the following warning message.

!!! warning
    ```
    ##################################  ALERT  ##################################
    [WARNING]: A random encryption key has been created and added to deployment.toml at
    <APIM_HOME>/repository/conf/deployment.toml.
    Please modify this [encryption] key and follow the production guidelines in the documentation for a safe production deployment.
    #############################################################################
    ```

It is recommended to change the encryption key before using WSO2 API Manager for the first time. If not, you need to run a key rotation tool to encrypt the secrets and credentials that were already encrypted using the generated random encryption key.

!!! warning
    Do **not** rely on the auto-generated key in multi-node or distributed setups. Each node will generate a different random key, making it impossible to decrypt data created by another node. Always provide a single shared key explicitly.

!!! note "Important"

    It is highly recommended to encrypt the secret key using the [cipher tool](../logins-and-passwords/working-with-encrypted-passwords.md).