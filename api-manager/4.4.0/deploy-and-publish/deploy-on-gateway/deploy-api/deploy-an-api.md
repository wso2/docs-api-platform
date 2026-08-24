---
title: "Deploy an API"
description: "Deploy an API revision to a selected Gateway environment via the Publisher Portal so it can be invoked, or undeploy it to remove it."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.4.0/deploy-and-publish/deploy-on-gateway/deploy-api/deploy-an-api/
md_url: https://wso2.com/api-platform/docs/api-manager/4.4.0/deploy-and-publish/deploy-on-gateway/deploy-api/deploy-an-api.md
tags:
  - api-manager
  - deployment
  - api-revisions
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-15
content_type: "how-to"
---

# Deploy an API

<div class="admonition note">
<p class="admonition-title">Note</p>
<p>The steps involved in deploying an API and deploying an API Product are the same.</p>
</div>

**API Deploying** is the process of making the API available for invocation via a Gateway. You can deploy an API to a selected API Gateway environment via the Publisher Portal. To invoke an API, it needs to be published on the Developer Portal as well as deployed on a Gateway environment. You need to create a revision of an API in order to deploy it. For more information, see [Create API Revisions](../../../design/create-api/create-api-revisions.md)

**Undeploying an API**  will remove the API from the API Gateway Environment.

--8<-- "api-manager/4.4.0/includes/design/deploy-revision.md"