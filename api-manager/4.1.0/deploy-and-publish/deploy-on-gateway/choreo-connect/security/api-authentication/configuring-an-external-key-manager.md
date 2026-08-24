---
title: "Configuring an external key manager"
description: "Configure an external key manager or token service for API authentication in Choreo Connect."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/deploy-and-publish/deploy-on-gateway/choreo-connect/security/api-authentication/configuring-an-external-key-manager/
md_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/deploy-and-publish/deploy-on-gateway/choreo-connect/security/api-authentication/configuring-an-external-key-manager.md
tags:
  - api-manager
  - deploy-and-publish
  - deploy-on-gateway
  - choreo-connect
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-30
content_type: "how-to"
---

# Configuring an External Key Manager

You can configure an external Key Manager or a Token Service in the following ways depending on the Choreo Connect **mode** you have chosen.

|**Mode**         | **Method**    |
|--------------|-----------|
|[Choreo Connect with WSO2 API Manager as a Control Plane](../../concepts/apim-as-control-plane.md)   | [Via WSO2 API Manager Admin Portal](#via-wso2-api-manager-admin-portal)  |
|[Choreo Connect as a Standalone Gateway](../../concepts/as-a-standalone-gateway.md)  |[Via the Choreo Connect Config File](#via-the-choreo-connect-config-file) |

## Via WSO2 API Manager Admin Portal

Choreo Connect provides the capability to configure external Key Managers through the API Manager Admin Portal. The issuer data is retrieved from the event hub at the startup, and updated as the changes are made from the Admin Portal.

### Step 1 - Configure Choreo Connect with API Manager

Please refer [Configure Choreo Connect with API Manager](../../getting-started/deploy/cc-on-docker-with-apim-as-control-plane.md).

### Step 2 - Add the external key manager to API Manager

Please refer [Multiple Key Manager Support in WSO2 API Manager](../../../../../administer/key-managers/overview.md) to configure the desired key manager. 

!!! note
    Please note that Choreo Connect only supports self-validation of JWT tokens from key managers. (JWT tokens will be validated against the issuer data.)

!!! important
    Token services which are added from the `config.toml` file under `enforcer.security.tokenService` configuration will be overridden from the retrieved key manager configurations from the API Manager if the issuers are identical. Furthermore, if the corresponding key manager is removed from the API Manager admin portal, the token service added from the configuration will be used.

## Via the Choreo Connect Config File

When Choreo Connect runs as a standalone Gateway, the external Key Managers, Token Services or JWT issuers used for API authentication must be configured in the [config.toml](../../configurations/configuration-overview.md#configurations-overview). To know what these parameters mean, you can go through the descriptions given under [Token Service in Enforcer Configurations](../../configurations/enforcer-configurations.md#token-service). The following are the token services configured by default. The template with the default values can also be found in `config.toml.template` located together with `config.toml`.

``` toml
# Issuer 1
[[enforcer.security.tokenService]]
  name="Resident Key Manager"
  issuer = "https://localhost:9443/oauth2/token"
  certificateAlias = "wso2carbon"
  jwksURL = "https://apim:9443/t/wso2.com/oauth2/jwks"
  validateSubscription = false
  consumerKeyClaim = "azp"
  certificateFilePath = "/home/wso2/security/truststore/wso2carbon.pem"

# Issuer 2
[[enforcer.security.tokenService]]
  name = "MGW"
  issuer = "https://localhost:9095/testkey"
  certificateAlias = "mgw"
  jwksURL = ""
  validateSubscription = false
  consumerKeyClaim = ""
  certificateFilePath = "/home/wso2/security/truststore/mg.pem"

# Issuer 3
[[enforcer.security.tokenService]]
  name = "APIM Publisher"
  issuer = "https://localhost:9443/publisher"
  validateSubscription = true
  certificateAlias = ""
  certificateFilePath = "/home/wso2/security/truststore/wso2carbon.pem"
```

!!! tip

    In the configuration file (**config.toml** or **config-toml-configmap.yaml** depending on whether you have deployed Choreo Connect on Docker Compose or K8s), the token services are configured as an array in **toml** format. Therefore when updating the token services, the entire array or all the token services required must exist in this file for all of them to be used. If none of the `[[enforcer.security.tokenService]]` sections are present, then the default array that consists of,

    - "Resident Key Manager" of WSO2 API-M
    - token service exposed by Choreo Connect Enforcer named as "MGW"
    - token service exposed by WSO2 API-M Publisher 

    will be set as given in the toml format above.