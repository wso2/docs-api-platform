---
title: "Manage Gateways"
description: "View, add, edit, and delete the gateways in your organization from the API Control Plane."
---

You manage all the gateways in your organization from the API Control Plane, regardless of where they run. For the types of gateways and how they work, see [API Gateway](./api-gateway/overview.md).

## View Gateways

1. Sign in to the [API Platform Console](https://console.bijira.dev).

2. In the left navigation menu, click **Gateways**.

The **Gateways** page groups the gateways of your organization into two tabs. Each tab shows how many of its gateways are active and inactive.

| Tab | Gateways |
|:----|:---------|
| **WSO2 managed gateways** | Gateways that WSO2 hosts and operates in the cloud. |
| **Self-hosted gateways** | Gateways that run on your infrastructure and connect to the API Control Plane. |

Each tab lists its gateways with the following details. To find a gateway by name, type in **Search gateways**.

| Column | Description |
|:-------|:------------|
| **Name** | The name of the gateway. The default gateway is marked **Default**. |
| **Description** | A description of the gateway. |
| **Type** | The type of the gateway, such as **API Gateway**. |
| **Status** | Whether the gateway is **Active** or inactive. |
| **Environment** | The environment that the gateway belongs to. |

## Add a Self-Hosted Gateway

To add a gateway that runs on your own infrastructure, click **Add Gateway** on the **Gateways** page. For the full steps, including how to run the gateway and connect it to the API Control Plane, see the [Self-Hosted Gateway Quick Start Guide](./hybrid-gateways/api-gateway/getting-started.md).

## Edit, Configure, or Delete a Gateway

In the **Actions** column of a gateway, do one of the following.

- To edit the gateway, click the edit icon.
- To configure the settings of the gateway, click the settings icon.
- To delete the gateway, click the delete icon.

## Next Steps

- [Manage Environments](./administer/managing-environments.md) - Create the environments that gateways belong to
- [Publish an API](./publish-api-proxy/publish-an-api.md) - Publish an API proxy that is deployed to a gateway
