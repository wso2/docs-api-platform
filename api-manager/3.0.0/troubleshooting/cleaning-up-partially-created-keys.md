---
title: "Cleaning up partially created keys"
description: "Fix stale OAuth application data left in API Manager when key generation or deletion fails, using the Clean up button."
canonical_url: https://wso2.com/api-platform/docs/api-manager/3.0.0/troubleshooting/cleaning-up-partially-created-keys/
md_url: https://wso2.com/api-platform/docs/api-manager/3.0.0/troubleshooting/cleaning-up-partially-created-keys.md
tags:
  - api-manager
  - troubleshooting
  - cleaning-up-partially-created-keys
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "troubleshooting"
---

# Cleaning Up Partially Created Keys

An application created in WSO2 API Manager has a corresponding OAuth application in the Key Manager node. An application can be created or deleted partially, where the OAuth application is successfully created/deleted but there is stale data left in the API Manager node. This can happen due to network failures between the API Manager and the Key Manager nodes, partial deletion of applications, etc.

To delete the remaining application data from API Manager, follow below steps.

1. Navigate to view the application listing by clicking on the **Applications** tab in the top ribbon.
2. Click on the application name. This will show the application details.
3. Click on the **Clean up** button found at the bottom of the page.

![](../assets/img/troubleshooting/cleanup-keys.png)