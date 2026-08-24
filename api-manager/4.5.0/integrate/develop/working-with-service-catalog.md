---
title: "Publish Integrations to API Manager"
description: "Publish a REST API artifact from the Micro Integrator runtime to WSO2 API Manager using the Service Catalog so it can be managed."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.5.0/integrate/develop/working-with-service-catalog/
md_url: https://wso2.com/api-platform/docs/api-manager/4.5.0/integrate/develop/working-with-service-catalog.md
tags:
  - api-manager
  - service-catalog
  - micro-integrator
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "how-to"
---

# Publishing Integrations to the API Manager

A REST API artifact you create from WSO2 Integration Studio is exposed to consumers when you run it on the Micro Integrator runtime. If you want to control and manage this API, and also expose it to an API marketplace where it becomes discoverable to a wider community of consumers, you need to publish this REST API to the API management layer (API-M runtime) of the product.

Follow the steps given below to publish REST APIs from the Micro Integrator to the API-M runtime.

!!! tip "Related Tutorials"
        To try out an end-to-end use case where an integration service is created and used as a managed API, see tutorials: [Exposing an Integration Service as a Managed API](../../tutorials/integration-tutorials/service-catalog-tutorial.md) and [Exposing an Integration SOAP Service as a Managed API](../../tutorials/integration-tutorials/service-catalog-tutorial-for-proxy-services.md).

## Prerequisites

Develop a REST API artifact using WSO2 Integration Studio. This is your integration service with the mediation logic that will run on the Micro Integrator.

!!! Tip
    For instructions on creating a new integration service, use the following documentation: 

    -   [Developing your First Integration Service](../../integrate/develop/integration-development-kickstart.md).
    -   [Integration Tutorials](../../tutorials/tutorials-overview.md#scenario-tutorials).

## Step 1 - Update the service metadata

When you create a REST API artifact from WSO2 Integration Studio, a **resources** folder with metadata files is created as shown below. This metadata is used by the API management runtime to generate the API proxy for the service.

<img src="../../../assets/img/integrate/tutorials/service-catalog/metadata-folder-service-catalog.png" width="400">

Update the metadata for your service as explained below.

<table>
    <tr>
        <th>
            Parameter
        </th>
        <th>
            Description
        </th>
    </tr>
    <tr>
        <td>
            description
        </td>
        <td>
            Explain the purpose of the API.
        </td>
    </tr>
    <tr>
        <td>
            serviceUrl
        </td>
        <td>
            This is the URL of the API when it gets deployed in the Micro Integrator. You (as the integration developer) may not know this URL during development. Therefore, you can parameterize the URL to be resolved later using environment variables. By default, the <code>{MI_HOST}</code> and <code>{MI_PORT}</code> values are parameterized with placeholders.</br></br>
            You can configure the serviceUrl in the following ways:
            <ul>
                <li>
                    Add the complete URL without parameters. For example: <code>http://localhost:8290/healthcare</code>.</br>
                </li>
                <li>
                    Parameterize using the host and port combination. For example: <code>http://{MI_HOST}:{MI_PORT}/healthcare</code>.
                </li>
                <li>
                    Parameterize using a preconfigured URL. For example: <code>http://{MI_URL}/healthcare</code>.
                </li>
            </ul>
        </td>
    </tr>
</table>

!!! Tip
    See the [Service Catalog API documentation](../../reference/product-apis/service-catalog-apis/service-catalog-v1/service-catalog-v1.md) for more information on the metadata in the YAML file.

## Step 2 - Configure the Micro Integrator server

The Micro Integrator contains a client for publishing integrations to the API-M runtime. To enable this client, update the following in the `deployment.toml` file of your Micro Integrator.

```toml
[[service_catalog]]
apim_host = "https://localhost:9443"
enable = true
username = "admin"
password = "admin"
```

See the descriptions of the [service catalog parameters](../../reference/config-catalog-mi.md#service-catalog-client).

## Step 3 - Start the servers

Once you have created the integration service and deployed it in the Micro Integrator, you only need to start the two servers (API-M server and the Micro Integrator server). 

Note that the API-M server should be started before the Micro Integrator. The client in the Micro Integrator publishes the integration services to the API-M layer during server startup.

## What's Next?

Once the servers are started and the services are published, you can access the service from the API-M layer, and then proceed to **Create**, **Deploy**, and **Publish** the API as follows:

1. [Create and API ](../../manage-apis/design/create-api/create-an-api-using-a-service.md) using the integration service.
2. [Deploy the API](../../manage-apis/deploy-and-publish/deploy-on-gateway/deploy-api/deploy-an-api.md) in the API Gateway.
3. [Publish the API](../../manage-apis/deploy-and-publish/publish-on-dev-portal/publish-an-api.md) to the Developer Portal.