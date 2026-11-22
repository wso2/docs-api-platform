---
title: "Attach and Manage Policies"
description: "Attach policies to an API proxy at the API level or the resource level in API Management."
---

You can attach one or more policies to an API proxy in the API Control Plane, either to the whole API or to a single resource. After you attach policies, you can reorder them, edit their configuration, or remove them.

## Attach a Policy

### Attach an API Level Policy

An API level policy applies to every resource in the API proxy. To attach one, follow the steps given below.

1. Sign in to the [API Control Plane Console](#).
2. In the header, select the project from the **Projects** list and the API from the **APIs** list.
3. In the left navigation menu, click **Develop**, then click **Policies**.

    ![Policies page showing the Global policies drop area, Resource policies for each resource, and the Available policies pane with search, category filter, and policy versions](/img/cloud/develop-api-proxy/policy/policies-page.png)

4. In the **Available policies** pane, find the policy you want to attach. You can type a policy name in **Search policies**, or select a category from the **All** list to filter the policies.

    :::tip
    Each policy shows its version. To view the details and configuration of a policy, click **Policy Hub** at the top of the pane.
    :::

5. Drag the policy and drop it in the **Global policies** section.
6. In the **Configure** pane that opens, set the policy parameters, if any, and click **Attach policy**. For example settings, see [Example Policy Settings](#example-policy-settings).
7. To attach more policies, repeat steps 4 to 6. The policies run in the order they appear in the section, and you can drag them to change the order.
8. Click **Save changes** to apply the policies to the API.

### Attach a Resource Level Policy

A resource level policy applies only to the resource you attach it to. To attach one, follow the steps given below.

1. Sign in to the [API Control Plane Console](#).
2. In the header, select the project from the **Projects** list and the API from the **APIs** list.
3. In the left navigation menu, click **Develop**, then click **Policies**.
4. In the **Resource policies** section, find the resource you want to attach a policy to. You can type a path in **Search resources by path**, or select an HTTP method from the **All methods** list to filter the resources.
5. Click the resource to expand it.

    ![Policies page with the GET /* resource expanded under Resource policies, showing an empty drop area and the Available policies pane](/img/cloud/develop-api-proxy/policy/resource-level-policies.png)

6. In the **Available policies** pane, find the policy you want to attach by searching for it or filtering by category.
7. Drag the policy from the **Available policies** pane and drop it in the area below the resource.
8. In the **Configure** pane that opens, set the policy parameters, if any, and click **Attach policy**.
9. To attach more policies to the resource, repeat steps 6 to 8. To attach policies to other resources, repeat steps 4 to 8.
10. Click **Save changes** to apply the policies to the API.

## Edit a Policy's Configuration

1. On the **Policies** page, find the attached policy in **Global policies** or under the resource.
2. Click the edit (pencil) icon on the policy.
3. Change the parameters, and click **Save policy**.
4. Click **Save changes**.

## Remove a Policy

1. On the **Policies** page, find the attached policy in **Global policies** or under the resource.
2. Click the remove (**X**) icon on the policy.
3. Click **Save changes**.

To discard changes that you haven't saved, click **Discard** in the save bar.

## Apply the Changes to a Gateway

Saving policies changes the API in the API Control Plane only. To apply attached, edited, or removed policies to a gateway, follow these steps:

1. Deploy the API again with a new build. In the left navigation menu, click **Deploy**, click the arrow next to **Deploy** in **Build Area**, and select **Build and Deploy**. For more information, see [Deploy an API](../../deploy-api-proxy/overview.md).
2. Wait until the gateway's status is **Active**.
3. Call the API, and check that the change took effect. For example, after you remove a policy, its behavior stops:

    | Removed policy | Result |
    | --- | --- |
    | **API Key Auth** | Requests without an API key succeed, instead of getting a `401 Unauthorized` response. |
    | **Basic Rate Limit** | Requests over the limit succeed, instead of getting a `429 Too Many Requests` response. |
    | **Set Headers** | Responses no longer carry the header that the policy added. |

If you deploy an existing build instead of a new one, the gateway keeps running the policies that the build had.

## Example Policy Settings

The following examples show settings for four common policies. Parameters that you don't list keep their default values.

| Policy | Parameter | Example value | Result |
| --- | --- | --- | --- |
| **CORS** | `allowedOrigins` | `https://app.example.com` | Browsers allow cross-origin calls only from that origin. The default, `*`, allows every origin. |
| **Basic Rate Limit** | `limits` | `requests`: `3`, `duration`: `1m` | The fourth request in a minute gets a `429 Too Many Requests` response. The duration takes a number and a unit, such as `30s`, `1m`, or `1h`. |
| **Set Headers** | `response` > `headers` | `name`: `X-API-Version`, `value`: `1.0` | Every response carries the `X-API-Version: 1.0` header. |
| **API Key Auth** | `key` | `API-Key` (the default) | Requests must send a valid API key in the `API-Key` header. Requests without one get a `401 Unauthorized` response. See [API Key Authentication](../security/api-key-authentication.md). |

To see every parameter of a policy, click **Policy Hub** in the **Available policies** pane.
