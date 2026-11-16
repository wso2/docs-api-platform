---
title: "Manage Gateways"
description: "Create a self-hosted gateway or a managed gateway, and view, edit, or delete the gateways in your organization from the API Control Plane."
---

You manage all the gateways in your organization from the API Control Plane, regardless of where they run. For the types of gateways and how they work, see [API Gateway](../../api-gateway/overview.md).

## View Gateways

1. Sign in to the [API Control Plane Console](https://console.bijira.dev).

2. In the left navigation menu, click **API Gateways**.

The **API Gateways** page groups the gateways of your organization into two tabs. Each tab shows how many of its gateways are active and inactive.

| Tab | Gateways |
|:----|:---------|
| **WSO2 managed API gateways** | Gateways that WSO2 hosts and operates in the cloud. |
| **Self-hosted API gateways** | Gateways that run on your own infrastructure and connect to the API Control Plane. |

A new organization comes with one WSO2 managed gateway, named **Default**, in the development environment. It is listed on the **WSO2 managed API gateways** tab.

Each tab lists its gateways with the following details. To find a gateway by name, type in **Search gateways**.

| Column | Description |
|:-------|:------------|
| **Name** | The name of the gateway. |
| **Description** | A description of the gateway. |
| **Type** | The type of the gateway, such as **API Gateway**. |
| **Status** | The status of the gateway, such as **Active**, **Inactive**, or **Failed**. |
| **Environment** | The environment that the gateway belongs to. |
| **Actions** | Edit, configure, or delete the gateway. See [Edit, Configure, or Delete a Gateway](#edit-configure-or-delete-a-gateway). |

## Choose Where the Gateway Runs

When you add a gateway, you choose its **Hosting**.

| Hosting | Use it when |
|:--------|:------------|
| **WSO2 managed API gateway (cloud)** | WSO2 runs, scales, and upgrades the gateway for you, and you have no infrastructure to maintain. |
| **Self-hosted API gateway** | You run the gateway on your own infrastructure and connect it to the API Control Plane, so that API traffic stays in your network. |

To compare the two before you choose, click **Compare options** on the **Add API Gateway** page. The **Compare hosting options** dialog shows how each option handles traffic, its setup time, and what it's best for. Click **Choose WSO2 managed** or **Choose Self-hosted** to select one.

## Create a self-hosted gateway

A self-hosted gateway runs on your own infrastructure and connects to the API Control Plane.

1. On the **API Gateways** page, click **Add API Gateway**.
2. Under **Hosting**, select **Self-hosted API gateway**.
3. Enter the gateway details.

    | Field | Description |
    |:------|:------------|
    | **Gateway Type** | Select **API Gateway**. |
    | **Name** | Required. The gateway handle is derived from this name and cannot be changed later. |
    | **Description** | Optional. A short description of the gateway. |
    | **Environment** | The environment this gateway belongs to. |
    | **API Gateway Version** | The gateway version to run. Use the latest version. |
    | **URL** | Required. The address where the gateway will be reachable, for example `https://localhost:8443`. |

4. Click **Add API Gateway**.

The console opens the gateway so you can download it and connect it to the API Control Plane. The gateway stays inactive until it connects. A self-hosted gateway is never the default gateway of an environment, so select it explicitly when you deploy to it. For those steps, see the [Self-Hosted Gateway Quick Start Guide](../../api-gateway/self-hosted-gateways/quickstart-guide.md).

## Create a managed gateway

A managed gateway is a gateway that WSO2 hosts and operates.

1. On the **API Gateways** page, click **Add API Gateway**.
2. Under **Hosting**, select **WSO2 managed API gateway (cloud)**.
3. Enter the gateway details.

    | Field | Description |
    |:------|:------------|
    | **Gateway Type** | Select **API Gateway**. |
    | **Name** | Required. The gateway handle is derived from this name and cannot be changed later. As you type, the form shows the handle. |
    | **Description** | Optional. A short description of the gateway. |
    | **Environment** | Required. Select the environment that will run this gateway. |
    | **Default gateway for this environment** | The first gateway of this type in the environment is the default, and this switch stays on. When the environment already has a gateway of this type, turn the switch on to make this gateway the default. |

4. Click **Add API Gateway**. **Add API Gateway** stays unavailable until **Name** and **Environment** are set. Click **Cancel** to leave without creating the gateway.

The new gateway is listed on the **WSO2 managed API gateways** tab. Its status is **Inactive** while it is being provisioned, and changes to **Active** when it is ready.

## Edit, Configure, or Delete a Gateway

In the **Actions** column of a gateway, do one of the following.

- To edit the gateway, click the edit icon.
- To configure the settings of the gateway, click the settings icon.
- To delete the gateway, click the delete icon.

## Next Steps

- [Manage Environments](./managing-environments.md) - Create the environments that gateways belong to
- [Deploy an API](../deploy-api-proxy/overview.md) - Deploy an API proxy to a managed or self-hosted gateway
- [Publish an API](../publish-api-proxy/publish-an-api.md) - Publish an API proxy that is deployed to a gateway
