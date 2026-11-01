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

1. Sign in to the [API Platform Console](https://console.bijira.dev/).
2. In the header, select the project from the **Projects** list and the API from the **APIs** list.
3. In the left navigation menu, click **Publish**.
4. On the portal, click **Go to Publish**.
5. Click the arrow next to **Publish**, and then click **Deprecate** or **Unpublish**.

    ![Publish page of an API with the Publish menu open, showing the Deprecate and Unpublish options](/img/cloud/publish-api-proxy/publish-actions.png)

To make an unpublished API available in the portal again, [publish it](./publish-an-api.md) again.
