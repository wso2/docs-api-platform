---
title: "Third party key managers"
description: "Explains how Choreo Connect retrieves and applies third-party Key Manager configurations from the API-M Admin Portal."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/deploy-and-publish/deploy-on-gateway/choreo-connect/concepts/third-party-key-managers/
md_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/deploy-and-publish/deploy-on-gateway/choreo-connect/concepts/third-party-key-managers.md
tags:
  - api-manager
  - deploy-and-publish
  - deploy-on-gateway
  - choreo-connect
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-30
content_type: "concept"
---

# Third party Key Managers

Third Party Key Managers can be registered via the WSO2 API Manager (WSO2 API-M) Admin Portal. 

The issuer data is used for the JWT token validation in Choreo Connect. When the Choreo Connect startup process takes place, Choreo Connect connects with the Event Hub and pulls the list of existing Key Managers. The latter mentioned data is stored in issuer data store within the Enforcer. 

If the same token service is found in the configuration file (`config.toml` or `config-toml-configmap.yaml`), the configuration data in that issuer will be overridden with the Key Manager configurations that came from the WSO2 API-M Admin Portal. Whenever Choreo Connect receives a Key Manager event (add, update, delete), the Issuer data store will be updated accordingly. However, if it still persists in the configuration file, the delete events will not be carried out.