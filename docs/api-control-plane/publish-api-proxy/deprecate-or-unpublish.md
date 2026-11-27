---
title: "Deprecate or Unpublish an API"
description: "Deprecate an API to discourage new usage, or unpublish it to remove it from a portal."
---

When an API is replaced by a newer version, or should no longer be offered to consumers, you can deprecate or unpublish it in each portal that it is published to.

| Action | Effect |
|:-------|:-------|
| **Deprecate** | Marks the API as deprecated in the portal. Consumers can still see and use the API, but it's marked as deprecated, so that they move to a newer version. |
| **Unpublish** | Removes the API from the portal. Consumers can no longer discover the API in the portal. You can unpublish an API only when it has no active subscriptions. |

## Deprecate or Unpublish an API

You can deprecate or unpublish an API only after it is published to the portal.

:::note
You can't unpublish an API that has active subscriptions. Each consumer who subscribed to the API must unsubscribe first, in the API Portal & AI Hub. See [Manage Subscriptions](../../api-portal/manage-usage/manage-subscriptions.md#view-and-manage-a-subscription). To steer consumers to a newer version while their subscriptions continue, deprecate the API instead.
:::

1. Sign in to the [API Control Plane Console](https://console.cloud.choreolabs.com/api-management/).

2. In the header, select the project from the **Projects** list and the API from the **APIs** list.

3. In the left navigation menu, click **Publish**.

4. On the portal that the API is published to, click **Configure & Publish**.

5. Start the action.
    - In the **Draft** view, click the arrow next to **Republish**, and then click **Deprecate** or **Unpublish**.

        ![Publish page of a published API in the Draft view with the Republish menu open, showing the Deprecate and Unpublish options](/img/cloud/publish-api-proxy/publish-actions.png)

    - In the **Published** view, click the action button at the bottom of the page, or the arrow next to it, and select **Deprecate** or **Unpublish**. A deprecated API can only be unpublished.

6. In the dialog that opens, type the name of the API to confirm, and click **Confirm**.

The status of the API on the portal changes, on the **Publish** page:

| Action | Status | In the portal |
|:-------|:-------|:--------------|
| **Deprecate** | **Deprecated** | The API stays listed. You can open it with **View in Portal**. |
| **Unpublish** | **Not published** | The API is removed from the portal, and **View in Portal** is unavailable. |

The count at the top of the **Publish** page, such as **Published to 0 of 1 portal**, counts only the portals where the API is published, not where it is deprecated.

:::note
You can't undo a deprecation directly. To make a deprecated API a regular published API again, unpublish it, and then publish it again.
:::

To publish an unpublished API again, click **Configure & Publish** on the portal. The publish page opens in the **Draft** view, with the listing that you prepared before. Review the tabs, and click **Publish**. The status of the API on the portal changes back to **Published**. See [Publish an API](./publish-an-api.md).
