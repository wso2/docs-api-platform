---
title: "Deprecate or Unpublish an API"
description: "Deprecate an API to discourage new usage, or unpublish it to remove it from a portal."
---

When an API is replaced by a newer version, or should no longer be offered to consumers, you can deprecate or unpublish it in each portal that it is published to.

| Action | Effect |
|:-------|:-------|
| **Deprecate** | Marks the API as deprecated in the portal. Consumers can still see and use the API, but it's marked as deprecated, so that they move to a newer version. |
| **Unpublish** | Removes the API from the portal. Consumers can no longer discover the API in the portal. |

## Deprecate or Unpublish an API

You can deprecate or unpublish an API only after it is published to the portal.

1. Sign in to the [API Control Plane Console](https://console.bijira.dev/).

2. In the header, select the project from the **Projects** list and the API from the **APIs** list.

3. In the left navigation menu, click **Publish**.

4. On the portal that the API is published to, click the arrow next to **Publish**, and select **Configure & Publish**.

5. In the **Draft** view, click the arrow next to **Republish**, and then click **Deprecate** or **Unpublish**.

    ![Publish page of a published API in the Draft view with the Republish menu open, showing the Deprecate and Unpublish options](/img/cloud/publish-api-proxy/publish-actions.png)

    In the **Published** view, you can also click **Unpublish**.

To make an unpublished API available in the portal again, [publish it](./publish-an-api.md) again.
