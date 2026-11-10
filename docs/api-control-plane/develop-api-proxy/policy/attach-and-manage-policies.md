---
title: "Attach and Manage Policies"
description: "Attach policies to an API proxy at the API level or the resource level in API Management."
---

You can easily attach one or more policies to an API proxy component implementation via the API Control Plane. If necessary, you can also rearrange or swap the policies you attach.

## Attach a Policy

### Attach an API Level Policy

An API level policy applies to every resource in the API proxy. To attach one, follow the steps given below.

1. Sign in to the [API Control Plane Console](https://console.bijira.dev).
2. In the header, select the project from the **Projects** list and the API from the **APIs** list.
3. In the left navigation menu, click **Develop**, then click **Policies**.

    ![Policies page showing the Global policies drop area, Resource policies for each resource, and the Available policies pane with search, category filter, and policy versions](/img/cloud/develop-api-proxy/policy/policies-page.png)

4. In the **Available policies** pane, find the policy you want to attach. You can type a policy name in **Search policies**, or select a category from the **All** list to filter the policies.

    :::tip
    Each policy shows its version. To view the details and configuration of a policy, click **Policy Hub** at the top of the pane.
    :::

5. Drag the policy and drop it in the **Global policies** section.
6. Configure the policy parameters, if any, and click **Add**.
7. To attach more policies, repeat steps 4 to 6. The policies run in the order they appear in the section, and you can drag them to change the order.
8. Click **Save** to apply the policies to the API.

### Attach a Resource Level Policy

A resource level policy applies only to the resource you attach it to. To attach one, follow the steps given below.

1. Sign in to the [API Control Plane Console](https://console.bijira.dev).
2. In the header, select the project from the **Projects** list and the API from the **APIs** list.
3. In the left navigation menu, click **Develop**, then click **Policies**.
4. In the **Resource policies** section, find the resource you want to attach a policy to. You can type a path in **Search resources by path**, or select an HTTP method from the **All methods** list to filter the resources.
5. Click the resource to expand it.

    ![Policies page with the GET /* resource expanded under Resource policies, showing an empty drop area and the Available policies pane](/img/cloud/develop-api-proxy/policy/resource-level-policies.png)

6. In the **Available policies** pane, find the policy you want to attach by searching for it or filtering by category.
7. Drag the policy from the **Available policies** pane and drop it in the area below the resource.
8. Configure the policy parameters, if any, and click **Add**.
9. To attach more policies to the resource, repeat steps 6 to 8. To attach policies to other resources, repeat steps 4 to 8.
10. Click **Save** to apply the policies to the API.

:::note
After attaching an API Policy, it is necessary to deploy the API for the policy to become active within its corresponding flow.
:::
