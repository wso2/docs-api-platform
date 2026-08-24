---
title: "Using single key encryption"
description: "Switch the Micro Integrator from asymmetric to single key symmetric encryption and secure the shared key."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/install-and-setup/setup/mi-setup/security/single_key_encryption/
md_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/install-and-setup/setup/mi-setup/security/single_key_encryption.md
tags:
  - api-manager
  - install-and-setup
  - setup
  - mi-setup
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-30
content_type: "how-to"
---

# Using Single Key Encryption

WSO2 Micro Integrator uses [asymmetric encryption](configuring_keystores.md) by default, which means that a **key pair** (public key and private key) for encrypting/decrypting information. If required, you can switch to **single key encryption** (symmetric encryption), which means that a single key will be shared for encryption and decryption of information.

## Enable single key encryption

To enable symmetric encryption, open the deployment.toml file and add the following configurations:

```toml
[encryption]
key = "value"
```

## Encrypt the symmetric key

For better security, the symmetric key in the deployment.toml file should be encrypted.
See [Encrypting Passwords](encrypting_plain_text.md) to replace this key with an encrypted value.