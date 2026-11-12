---
title: "Manage API Consumers"
description: "Learn how consumers sign up to the API Portal and AI Hub, and how to add an admin."
---

API consumers are the developers who use the API Portal and AI Hub to find APIs, get credentials, and invoke APIs. An admin is a user with the **dp_admin** role. That user signs in to the portal and manages its settings.

## How Consumers Sign Up

Anyone can create an account in the portal.

1. Open the portal URL that the API publisher shared. See [Open the Portal](../overview.md#open-the-portal).

2. Click **Log In**, and on the sign-in page, click **Sign up**.

3. Enter the requested details, and create the account.

After signing up, the consumer can sign in, browse APIs, and generate keys. See [Quick Start Guide](../quickstart-guide.md).

## Sign Up as an Admin

The admin is created in Identity & Access Management, assigned the **admin** role, and then deployed to the portal's login environment.

### Open Identity & Access Management

1. Sign in to the WSO2 Cloud Console.

2. Switch to  **Identity & Access Management**.

### Create the admin user

1. In the project selector, select the project for the login environment.

2. In the left navigation menu, under **IDENTITY SETUP**, click **Users**.

3. Click **Add user**.

    ![Users page of the API Portal project with Add user](/img/cloud/api-portal/admin-users.png)

4. Set **User type** to **Person**, and enter the user details.

    | Field | Required | Description |
    |:------|:---------|:------------|
    | **User type** | Yes | Use Person |
    | **Username** | Yes | The name the admin uses to sign in to the portal. |
    | **First Name** | No | The admin's first name. |
    | **Last Name** | No | The admin's last name. |
    | **Email** | Yes | The admin's email address. |
    | **Mobile Number** | No | The admin's mobile number. |
    | **Password** | No | The password for this user. |

    ![Add user form with User type set to Person](/img/cloud/api-portal/admin-add-user.png)

5. Click **Create user**.

### Deploy the changes

A new user is saved as a project version. It is not available in the portal until you deploy that version.

1. In the left navigation menu, click **Deployment pipeline**.

2. Under **Project versions**, click **Deploy** on the latest version.

3. In **Deploy through pipeline**, review the changes, and deploy them to **Development**.
    ![Project deployment pipeline with Deploy on the latest version and the Development environment](/img/cloud/api-portal/admin-deploy-pipeline.png)

### Assign the dp_admin role

The **dp_admin** role already exists for the organization. Assign the admin to it, and deploy that change with the project.

1. Clear the project selection so you are in the organization view.

2. In the left navigation menu, under **IDENTITY SETUP**, click **Roles**.

3. Open **dp_admin**.

    ![Organization roles, including dp_admin](/img/cloud/api-portal/admin-dp-admin-role.png)

4. Open the **Assignments** tab, and click **Add**.

5. On the **Users** tab, select the admin you created, and click **Add selected**. 

6. At the project level again, open **Deployment pipeline**, and deploy the latest version to **Development**. This deploy carries the role assignment to the login environment.

### Sign in to the portal

1. Switch to **API Management**.

2. In the left navigation menu, click **Portals**.

3. On the portal card, click **Open Portal**. The card shows the portal's **Login environment**.

4. In the portal, click **Log In**.

5. Enter the admin **Username** and **Password**, and click **Sign In**.

The signed-in admin can open **Settings** in the portal.

## Next Steps

- [Key Managers](./key-managers/overview.md) - Learn how consumers get access tokens
- [Configure a Custom Key Manager](./key-managers/custom-key-manager.md) - Connect your own identity provider as a key manager
