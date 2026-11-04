---
title: "Adding and Managing Policies"
pagination_label: "Adding and Managing Policies"
description: "Attach, configure, and deploy policies on API proxies running on a Self-Hosted Gateway."
---

You attach policies to an API proxy from the API Management Console. The Self-Hosted Gateway runs those policies on the traffic it handles in your infrastructure. Attach a policy at the API level to apply it to every resource, or at the resource level to apply it to one resource. If you attach more than one, you can drag them to change the order they run in.

Saving the API records the policies. Deploy the API afterward so the Self-Hosted Gateway starts enforcing them.

## Attach an API Level Policy

An API level policy applies to every resource in the API proxy. To attach one, follow the steps given below.

1. Sign in to the [API Management Console](https://console.bijira.dev).
2. In the header, select the project from the **Projects** list and the API from the **APIs** list. The API must be one that you deploy to your Self-Hosted Gateway.
3. In the left navigation menu, click **Develop**, then click **Policies**.

    ![Policies page showing the Global policies drop area, Resource policies for each resource, and the Available policies pane with search, category filter, and policy versions](/img/cloud/develop-api-proxy/policy/policies-page.png)

4. In the **Available policies** pane, find the policy you want to attach. You can type a policy name in **Search policies**, or select a category from the **All** list to filter the policies.

    :::tip
    Each policy shows its version. To view the details and configuration of a policy, click **Policy Hub** at the top of the pane. The [Policy Hub](../../policy-hub/overview.md) lists the policies you can attach.
    :::

5. Drag the policy and drop it in the **Global policies** section.
6. Configure the policy parameters, if any, and click **Add**.
7. To attach more policies, repeat steps 4 to 6. The policies run in the order they appear in the section, and you can drag them to change the order.
8. Click **Save** to apply the policies to the API.

## Attach a Resource Level Policy

A resource level policy applies only to the resource you attach it to. To attach one, follow the steps given below.

1. Sign in to the [API Management Console](https://console.bijira.dev).
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

## Deploy the API to the Self-Hosted Gateway

The policies stay inactive until you deploy the API. Deploy it so the Self-Hosted Gateway receives the updated policy chain.

1. In the left navigation menu, click **Deploy** to open the **Deploy** page of the API.

2. Select your Self-Hosted Gateway, and click the **Deploy** button.

When the deployment is active, the gateway runs the policies in the order you arranged them.
