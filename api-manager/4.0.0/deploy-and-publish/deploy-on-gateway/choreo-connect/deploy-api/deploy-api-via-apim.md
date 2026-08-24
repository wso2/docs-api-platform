---
title: "Deploy a REST API in Choreo Connect using API Manager"
description: "Deploy a REST API to Choreo Connect by configuring API Manager as the control plane and publishing through the Publisher Portal."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.0.0/deploy-and-publish/deploy-on-gateway/choreo-connect/deploy-api/deploy-api-via-apim/
md_url: https://wso2.com/api-platform/docs/api-manager/4.0.0/deploy-and-publish/deploy-on-gateway/choreo-connect/deploy-api/deploy-api-via-apim.md
tags:
  - api-manager
  - deploy-and-publish
  - deploy-on-gateway
  - choreo-connect
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "how-to"
---

# Deploying a REST API in Choreo Connect Using WSO2 API Manager

Follow the instructions below to use the WSO2 API Manager Publisher Portal to deploy a REST type API in Choreo Connect:

## Step 1 - Configure Choreo Connect with API Manager

- To start Choreo Connect with an existing API Manager instance, follow the steps mentioned in the [Using Choreo Connect Deployed on Docker with WSO2 API Manager Guide](../getting-started/deploy/cc-on-docker-with-apim-as-control-plane.md)
- To start a complete deployment setup that includes a WSO2 API Manager instance and a Choreo Connect instance already configured to work with API Manager, follow the steps in the [Quick Start Guide](../getting-started/quick-start-guide-docker-with-apim.md).

## Step 2 - Create an API in API Manager

Follow the steps [here](../../../../design/create-api/create-rest-api/create-a-rest-api.md).

## Step 3 - Deploy the API in API Manager

 The guide [here](../../deploy-api/deploy-an-api.md) will explain how you could easily deploy the API you just created.

That's it! To invoke the API follow the steps [here](#step-4-invoke-the-api).


During the startup, Choreo Connect will check the `config.toml` to see if the `controlPlane` configuration has been enabled. If so, it will start fetching all the necessary artifacts that belongs to the Gateway environment given in `environmentLabels`. These artifacts include deployed APIs, Applications, Subscriptions, Polices, information related to Key Managers, etc.

Whenever a new event occurs in API Manager such as an API being deployed, API Manager will notify Choreo Connect via Event Hub. Choreo Connect will then start fetching all the new artifacts related to its environment. 

!!! Tip
    To be able to invoke an API via the Developer Portal TryOut Console, make sure at least one of the certificates used by the enforcer is same as the certificate used by the Key Manager configured in API-M. In Choreo Connect, the certs for enforcer are located at `<CHOREO-CONNECT_HOME>/docker-compose/resources/enforcer/security/truststore`. In API-M, Key Managers can be configured from the API-M Admin Portal.

!!! Note 

    You might find the following content useful here onwards,

    - [API Manager as Control Plane](../concepts/apim-as-control-plane.md) 
    - [Publish an API on the Developer Portal](../../../publish-on-dev-portal/publish-an-api.md)

##  Step 4 - Invoke the API

--8<-- "api-manager/4.0.0/includes/obtain-jwt.md"
--8<-- "api-manager/4.0.0/includes/invoke-api-with-jwt.md"

<!-- brought the following here because the path becomes relative when included in the includes folder -->
Refer to [Generate a Test JWT](../security/generate-a-test-jwt.md) for more details.