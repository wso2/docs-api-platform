---
title: "Manage Gateways"
description: "Create a self-hosted gateway or a managed gateway, and view, edit, or delete the gateways in your organization from the API Control Plane."
---

You manage all the gateways in your organization from the API Control Plane, regardless of where they run. For the types of gateways and how they work, see [API Gateway](../../api-gateway/overview.md).

## View Gateways

1. Sign in to the [API Control Plane](https://console.bijira.dev).

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

## Create a self-hosted gateway

A self-hosted gateway runs on your own infrastructure and connects to the API Control Plane.

1. On the **Gateways** page, open the **Self-hosted gateways** tab.
2. Click **Add Gateway**.
3. Enter the gateway details.

    | Field | Description |
    |:------|:------------|
    | **Type** | Select **API Gateway**. |
    | **Name** | Required. A name for the gateway. |
    | **Description** | Optional. A short description of the gateway. |
    | **URL** | Required. The address where the gateway will be reachable, for example `https://localhost:8443`. |
    | **Associated Environment** | The environment this gateway belongs to. |

4. Click **Add**.

The console opens the gateway so you can download it and connect it to the API Control Plane. For those steps, see the [Self-Hosted Gateway Quick Start Guide](../../api-gateway/self-hosted-gateways/quickstart-guide.md).

## Create a managed gateway

A managed gateway is a gateway that WSO2 hosts and operates.

1. On the **Gateways** page, open the **WSO2 managed gateways** tab.
2. Click **Add Gateway**.

    When the organization has no gateways, the page displays **No available gateways** and **Add Gateway**.

3. Enter the gateway details.

    | Field | Description |
    |:------|:------------|
    | **Gateway Type** | Select **API Gateway**. |
    | **Name** | Required. The gateway handle is derived from this name and cannot be changed later. As you type, the form shows the handle. |
    | **Description** | Optional. A short description of the gateway. |
    | **Environment** | Required. Select the environment that will run this gateway. |
    | **Default gateway for this environment** | The first gateway of this type in the environment is the default, and this switch stays on. When the environment already has a gateway of this type, turn the switch on to make this gateway the default. |

4. Click **Add Gateway**. **Add Gateway** stays unavailable until **Name** and **Environment** are set. Click **Cancel** to leave without creating the gateway.

The new gateway is listed on the **WSO2 managed gateways** tab. Its status is **Inactive** while it is being provisioned, and changes to **Active** when it is ready.

## Edit, Configure, or Delete a Gateway

In the **Actions** column of a gateway, do one of the following.

- To edit the gateway, click the edit icon.
- To configure the settings of the gateway, click the settings icon.
- To delete the gateway, click the delete icon.

## Next Steps

- [Manage Environments](./managing-environments.md) - Create the environments that gateways belong to
- [Deploy an API](../deploy-api-proxy/overview.md) - Deploy an API proxy to a managed or self-hosted gateway
- [Publish an API](../publish-api-proxy/publish-an-api.md) - Publish an API proxy that is deployed to a gateway
