---
title: "Choreo connect with API Manager as Control Plane"
description: "Learn how Choreo Connect works with WSO2 API Manager as its Control Plane to deploy and manage APIs."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/deploy-and-publish/deploy-on-gateway/choreo-connect/concepts/apim-as-control-plane/
md_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/deploy-and-publish/deploy-on-gateway/choreo-connect/concepts/apim-as-control-plane.md
tags:
  - api-manager
  - deploy-and-publish
  - deploy-on-gateway
  - choreo-connect
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-30
content_type: "concept"
---

# Choreo Connect with API Manager as Control Plane

## Overview

Choreo Connect can connect to WSO2 API Manager (WSO2 API-M), which is running on cloud or on-premise. You can configure Choreo Connect to connect with API-M as the Control Plane so that the user actions, such as API deploying, application creation, key generation, subscription creation, etc., are received by Choreo Connect seamlessly.

[![Choreo Connect Overview](../../../../assets/img/deploy/mgw/choreo-connect-overview.png){: style="width:80%"}](../../../../assets/img/deploy/mgw/choreo-connect-overview.png)

## Workflow when deploying an API

To deploy an API via API-M you need to,

1. Configure the `[controlPlane]` Choreo Connect configuration section to point to WSO2 API Manager.

2. Create a revision of the API via the API Manager Publisher Portal.

3. Select Choreo Connect as the Gateway environment and deploy the API.

Once an API is deployed to Choreo Connect via the WSO2 API Manager Publisher Portal, the following sequence of actions will take place.

1. The API Manager [Event Hub](event-hub.md) component will send an API deploy event to the Adapter component in Choreo Connect.

2. The Adapter will pull the API object from the Event Hub upon receiving the API deploy event.

3. The Adapter will pass the API to the Router and Enforcer.

## See Also

- [Event Hub](event-hub.md)
- [Rate Limiting in Choreo Connect](cc-rate-limiting.md)
- [Revoked Tokens in Choreo Connect](revoked-tokens.md)
- [Working with third-party Key Managers in Choreo Connect](third-party-key-managers.md)