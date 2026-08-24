---
title: "Communication between the components"
description: "Explains how Mutual SSL secures communication between the Adapter, Enforcer, Router, and API-M Control Plane in Choreo Connect."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/deploy-and-publish/deploy-on-gateway/choreo-connect/concepts/inter-component-communication/
md_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/deploy-and-publish/deploy-on-gateway/choreo-connect/concepts/inter-component-communication.md
tags:
  - api-manager
  - deploy-and-publish
  - deploy-on-gateway
  - choreo-connect
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-30
content_type: "concept"
---

# Communication Between the Components

Communication between internal components of Choreo Connect (Adapter, Enforcer, Router and API-M Control Plane) are secured via Mutual SSL.

Each component has its private-public key pair and truststore. In the adapter's case, it is configured using the `config.toml` file as indicated below.

```toml
[adapter.keystore] 
certPath = "/home/wso2/security/keystore/mg.pem"
keyPath = "/home/wso2/security/keystore/mg.key"

[adapter.truststore]
location = "/home/wso2/security/truststore"
```