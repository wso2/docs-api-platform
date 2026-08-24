---
title: "Troubleshooting"
description: "Check K8s API operator logs and use kubectl commands to diagnose APIs, integrations, and target endpoints."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/install-and-setup/setup/kubernetes-operators/k8s-api-operator/troubleshooting/
md_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/install-and-setup/setup/kubernetes-operators/k8s-api-operator/troubleshooting.md
tags:
  - api-manager
  - install-and-setup
  - setup
  - kubernetes-operators
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-30
content_type: "troubleshooting"
---

# Troubleshooting

## Check logs in the K8s API Operator

- Following command will list the available pods in the default namespace.

    ```shell
    kubectl get pods
   
    Output:
    NAME                             READY   STATUS    RESTARTS   AGE
    api-operator-59c665f477-9bw7l   1/1     Running   0          4h23m
    ```
- Once you are able to see the api-operator pod up and running, you can check its logs using the below command.

   ```shell tab="Format"
   kubectl logs -f <NAME_OF_THE_API-OPERATOR_POD>
   ```
  
   ```shell tab="Example"
   kubectl logs -f api-operator-59c665f477-9bw7l
   ```
- Once the above command is executed, it will show the logs in the API operator.

## Useful kubectl commands for troubleshooting

- Listing APIs, Integrations and TargetEndpoints

    ```shell
    kubectl get apis
   
    Output:
    NAME           AGE
    petstore-api   5m15s
    ``` 

    ```shell
    kubectl get integrations
  
    Output:  
    NAME               STATUS    SERVICE-NAME               AGE
    mock-integration   Running   mock-integration-service   4m47s
    ```

    ```shell
    kubectl get targetEndpoints
  
    Output:  
    NAME                  AGE
    mock-service          6s
    ```

- Describing APIs, Integrations and TargetEndpoints

    ```shell
    kubectl describe apis petstore-api
    kubectl describe integrations mock-integration
    kubectl describe targetEndpoint mock-service
    ```
  