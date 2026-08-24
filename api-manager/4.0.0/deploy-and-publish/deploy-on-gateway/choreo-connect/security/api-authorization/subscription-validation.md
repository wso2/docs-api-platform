---
title: "Subscription Validation"
description: "Configure subscription validation in Choreo Connect using self-contained token claims or Event Hub subscription data."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.0.0/deploy-and-publish/deploy-on-gateway/choreo-connect/security/api-authorization/subscription-validation/
md_url: https://wso2.com/api-platform/docs/api-manager/4.0.0/deploy-and-publish/deploy-on-gateway/choreo-connect/security/api-authorization/subscription-validation.md
tags:
  - api-manager
  - deploy-and-publish
  - deploy-on-gateway
  - choreo-connect
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "how-to"
---

# Subscription Validation

The [subscription](../../../../../consume/manage-subscription/subscribe-to-an-api.md) validation is configurable per issuer basis. In order to mandate the subscriptions, subscription validation can be enabled.
If validation has failed, it will send an error message with error code 900908.

In Choreo Connect subscription validation can be done in two ways.

1. Self-contained token with `subscribedAPIs` claim
    
    To authorize an API request with the self-contained JWT token under an issuer with subscription validation, the API name and version should be listed under `subscribedAPIs` claim of the JWT token.
    
    !!! note
        When an older version of WSO2 API Manager (3.1.* and below) is used as the key manager it sends the subscribed APIs as a list in the JWT under the `subscribedAPIs` claim. Therefore it is required to have the corresponding API name and version listed under `subscribedAPIs` claim to authorize the API request when JWT tokens issued by older API Manager versions are used. 

2. Event Hub based subscription validation

    For JWTs issued by API Manager, to enable subscription validation it requires the Event Hub to fetch Application and Subscription data from WSO2 API Manager.

    The latest versions of API manager do not include the `subscribedAPIs` claim in the JWT, instead, subscription validation is done using the `[eventhub]`. Refer documentation on [Event Hub](../../concepts/event-hub.md) and [Subscription Validation Model](../../concepts/subscription-validation.md) to understand how Choreo Connect validates subscriptions using Event Hub.

### Configure Subscription Validation

You can enable or disable subscription validation using the following configuration and it is disabled by default. Add the following to the `<CHOREO-CONNECT_HOME>/docker-componse/choreo-connect/conf/config.toml` file.

1. Configure Event Hub and key managers for token authentication.

    In order to do subscription validation, the `[eventHub]` must be enabled for the latest versions of API Manager. 

    ```toml
        # Configurations for retrieving API and subscription data from API Manager.
        [controlPlane]
        enabled = false
        serviceURL = "https://apim:9443/"
        username = "admin"
        password = "$env{cp_admin_pwd}"
        environmentLabels = ["Default"]
        retryInterval = 5
        skipSSLVerification = true
        # Message broker connection URL of the control plane
        [controlPlane.brokerConnectionParameters]
            eventListeningEndpoints = ["amqp://admin:$env{cp_admin_pwd}@apim:5672?retries='10'&connectdelay='30'"]
    ```

2. Enable subscription validation.

    - Enable/disable Subscription Validation for JWT tokens by configuring `validateSubscription` under the corresponding JWT issuer configuration.

    ```toml 
        [[security.enforcer.tokenService]]
            name="Resident Key Manager"
            issuer = "https://localhost:9443/oauth2/token"
            certificateAlias = ""
            # URL of the JWKs endpoint
            jwksURL = ""
            # Validate subscribed APIs
            validateSubscription = true
            # The claim in which the consumer key of the application is coming
            consumerKeyClaim = "azp"
            # Certificate Filepath within enforcer
            certificateFilePath = "/home/wso2/security/truststore/wso2carbon.pem"
    ```