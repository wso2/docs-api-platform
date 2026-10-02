---
title: "Organizations in API Platform"
description: "Understand organizations in API Platform: structure, groups, roles, and how to find your Organization ID and Handle."
canonical_url: https://wso2.com/api-platform/docs/cloud/bijira-concepts/organization/
md_url: https://wso2.com/api-platform/docs/cloud/bijira-concepts/organization.md
tags:
  - cloud
  - concepts
  - organization
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-23
content_type: "concept"
---

# Organizations in API Platform

Organizations are the foundational building blocks in API Platform, providing a secure and logical grouping of users, resources, and projects. This covers everything you need to know about organizations in API Platform, including their structure, management, permissions, and unique identifiers.

---

## What is an Organization?

An **organization** in API Platform is a logical container for users and their resources. Every user must belong to an organization to use API Platform. Organizations help isolate resources, manage access, and enable collaboration within a defined boundary.

- **First-time user onboarding:** First-time users must create an organization and become its member upon signing up.
- **Resource isolation**: Users and resources in one organization cannot access those in another, unless explicitly invited.
- **Single organization per user**: A user can only create one organization, but may be invited to join others.

---

## Switching between Organizations

If you are a member of multiple organizations, you can easily switch between them by following steps below.

1. In the API Platform Console header, click the **Organization** list.
2. Select the desired organization from the dropdown.

---

## Inviting Members to Your Organization

To collaborate, you can invite new members to your organization. (See the [Inviting Members](../administer/inviting-members.md) guide for step-by-step instructions.)

---

## Managing User Permissions

API Platform uses a combination of **groups** and **roles** to manage user permissions efficiently.

### Groups

A **group** is a collection of users with one or more roles assigned. Users inherit all permissions associated with the group's roles. For example, adding a user to the `API Publisher` group automatically grants them the `API Publisher` role.

#### Predefined Groups

API Platform provides several predefined groups, each mapped to specific roles.

- **Admin**: Users who have full access to the API Platform (user management, application development, billing and subscription, etc.).
- **API Publisher**: Users who understand the technical aspects of the API (interfaces, documentation, versions, etc.) and create and publish APIs into the Developer Portal.
- **API Subscriber**: Users or Application Developers who search the Developer Portal to discover APIs and use them. They read the documentation and forums, rates/comments on the APIs, subscribes to APIs, obtain access tokens, and invokes the APIs.
- **Choreo Platform Engineer**: Users who perform tasks focusing on infrastructure, governance, service mesh, and monitoring.
- **Choreo DevOps**: Users who are involved in deployment management.

> **Tip:** When creating a new group, always assign at least one role to ensure members have the required permissions.

### Roles

Roles define what actions a user can perform within an organization. The main roles in API Platform are:

- **API Publisher**: Users who understand the technical aspects of the API (interfaces, documentation, versions, etc.) and create and publish APIs into the Developer Portal.
- **API Subscriber**: Users or Application Developers who search the Developer Portal to discover APIs and use them. They read the documentation and forums, rates/comments on the APIs, subscribes to APIs, obtain access tokens, and invokes the APIs.
- **Admin**: Users who have full access to the API Platform (user management, application development, billing and subscription, etc.)
- **Choreo DevOps**: Users who are involved in deployment management.
- **Choreo Platform Engineer**: Users who perform tasks focusing on infrastructure, governance, service mesh, and monitoring.

---

## Organization Identifiers

API Platform uses two unique identifiers for organizations, the **Organization ID** and the **Organization Handle**.

### Organization ID

A unique, system-generated identifier for each organization. To find your Organization ID:

1. Go to the [API Platform Console](https://console.bijira.dev/) and sign in.
2. Click the **Organization** list in the header and select your organization.
3. In the left navigation, click **Settings**.
4. In the header, click the **Organization** list to open organization-level settings.
5. Under **Organization**, click **Copy ID**.

### Organization Handle

A unique, human-readable string that corresponds to your organization's name. To find your Organization Handle:

1. Go to the [API Platform Console](https://console.bijira.dev/) and sign in.
2. Click the **Organization** list in the header and select your organization.
3. In the left navigation, click **Settings**.
4. Under **Organization**, click **Copy Handle**.

---

## Best Practices for Organization Management

- **Assign roles carefully**: Only grant users the permissions they need.
- **Use groups for easier management**: Assign roles to groups and add users to groups for scalable permission management.
- **Regularly review membership**: Periodically audit group memberships and roles to ensure security and compliance.
- **Leverage organization identifiers**: Use the Organization ID and Handle for integrations, support, and automation.