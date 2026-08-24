---
title: "Deploying APIs using the operator"
description: "Use the Kubernetes API operator's custom resources to deploy and manage APIs on Kubernetes."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/install-and-setup/setup/kubernetes-operators/k8s-api-operator/manage-apis/api-deployments/
md_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/install-and-setup/setup/kubernetes-operators/k8s-api-operator/manage-apis/api-deployments.md
tags:
  - api-manager
  - install-and-setup
  - setup
  - kubernetes-operators
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-30
content_type: "concept"
---

# Deploying APIs using the Operator

The Kubernetes API operator provides first-class support for APIs in the Kubernetes ecosystem. It uses the 
**API custom resource** which defined as follows.

```yaml
apiVersion: wso2.com/v1alpha2
kind: API
metadata:
  name: petstore-api
spec:
  swaggerConfigMapName: petstore-cm
```

When it comes to managing APIs, users are able to deploy APIs in Kubernetes with/without the Control Plane (API Manager).

Follow the deployment guides below to get started with managing APIs in Kubernetes.

- [Choreo Connect as a Standalone Gateway on Kubernetes](../../../../../deploy-and-publish/deploy-on-gateway/choreo-connect/getting-started/deploy/cc-as-a-standalone-gateway-on-kubernetes.md)

- [Choreo Connect on Kubernetes with WSO2 API Manager as a Control Plane](../../../../../deploy-and-publish/deploy-on-gateway/choreo-connect/getting-started/deploy/cc-on-kubernetes-with-apim-as-control-plane.md)