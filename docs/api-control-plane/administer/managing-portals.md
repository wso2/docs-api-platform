---
title: "Manage Portals"
description: "Create a portal for your organization, open it, and edit or delete it. A portal is where you publish APIs for consumers."
---

API portal is where consumers discover your APIs, read the documentation, and request access. You create portals for your organization from the API Control Plane, then publish APIs to them.

## Open the Portals page

1. Sign in to the API Control Plane.
2. In the left navigation menu, click **Portals**.

The **Portals** page lists the portals in your organization. Each portal shows its name, its **Login environment**, and when it was last updated. Use **Search Portals** to find a portal.

## Create a portal

1. On the **Portals** page, click **Add Portal**.
2. Enter the portal details.

    | Field | Description |
    |---|---|
    | **Name** | Required. The name of the portal. |
    | **Description** | Optional. A short description of the portal. |
    | **Allow self sign-up** | Turned on by default. Consumers can create their own accounts in the portal. |

3. Click **Add Portal**. **Add Portal** stays unavailable until you enter a name. Click **Cancel** to leave without creating the portal.

    ![Add Portal form with the name Docs Portal, an empty description, Allow self sign-up turned on, and the Cancel and Add Portal buttons](/img/cloud/portals/add-portal.png)

While the portal is being created, its card shows **Creating portal**. When the portal is ready, **Open Portal** is available.

Creating a portal lets you publish APIs to that portal. Consumers can then discover the APIs, read their documentation, and request access. See [Publish an API](../publish-api-proxy/publish-an-api.md).

## Open a portal

On the portal card, click **Open Portal**. The portal opens in a new browser tab.

![Portals page with a portal card showing the login environment, when the portal was updated, the edit icon, Open Portal, and the delete icon](/img/cloud/portals/portal-card.png)

## Edit a portal

1. On the portal card, click the edit icon.
2. Update the **Name**, **Description**, **Login environment**, or **Allow self sign-up**.
3. Click **Save Changes**. Click **Cancel** to keep the current values.


## Delete a portal

1. On the portal card, click the delete icon.
2. In **Delete Portal**, confirm that you want to delete the named portal.
3. Click **Delete**. Click **Cancel** to keep the portal.

:::warning
Deleting a portal is permanent.
:::

## Next Steps

- [Publish an API](../publish-api-proxy/publish-an-api.md) - Publish an API proxy to a portal so consumers can discover it
