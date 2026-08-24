---
title: "Hot deploying artifacts"
description: "Explains hot deployment of synapse artifacts in the Micro Integrator and how to disable it in deployment.toml."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.2.0/integrate/develop/hot-deployment/
md_url: https://wso2.com/api-platform/docs/api-manager/4.2.0/integrate/develop/hot-deployment.md
tags:
  - api-manager
  - integrate
  - develop
  - hot-deployment
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "concept"
---

# Hot Deploying Artifacts

Hot deployment is the process of dynamically deploying your synapse artifacts (XML), dataservices(DBS), carbon applications (CAR), etc., in your Micro Integrator. That is, it is not required to restart the server for the artifact deployment to be effective.

Hot deployment is useful for testing the integration artifacts **in a VM environment**. With hot deployment, it is not required to restart the server each time you deploy an artifact and the testing time will be shorter and efficient. Hence, hot deployment is enabled by default in the Micro Integrator distribution.

## Disabling hot deployment
Open the `deployment.toml` file from the `<MI_HOME>/conf` directory and set hot_deployment property to false.

```toml
[server]
hot_deployment = false
```

See the [complete list of server configurations](../../reference/config-catalog#deployment).