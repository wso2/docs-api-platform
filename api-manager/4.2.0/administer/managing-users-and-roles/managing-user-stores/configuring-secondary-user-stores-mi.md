---
title: "Configuring secondary user stores"
description: "Enable the user-core feature and add a new secondary user store to the WSO2 Micro Integrator for integration use cases."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.2.0/administer/managing-users-and-roles/managing-user-stores/configuring-secondary-user-stores-mi/
md_url: https://wso2.com/api-platform/docs/api-manager/4.2.0/administer/managing-users-and-roles/managing-user-stores/configuring-secondary-user-stores-mi.md
tags:
  - api-manager
  - administer
  - managing-users-and-roles
  - managing-user-stores
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "how-to"
---

# Configuring Secondary User Stores

For user management purposes, the WSO2 Micro Integrator can connect to several secondary user stores.

Users from the primary and secondary user store(s) can be authenticated and authorized for integration use cases after configuration.

!!! info
    **Note** : It's mandatory to have a primary user store configured before adding secondary user stores. Refer
    [configuring an LDAP user store](../../../install-and-setup/setup/mi-setup/user_stores/setting_up_a_userstore#configuring-an-ldap-user-store)

## Enabling the user-core feature

To deploy secondary user stores, we need to enable the user-core feature which is disabled by default. 

To enable the user-core feature, change the following entry to false in micro-integrator.sh/micro-integrator.bat files as required.
```bash
-DNonUserCoreMode=true \
```

## Adding a new secondary user store

1. [Download](../../../assets/attachments/migration/micro-integrator/secondary-userstore-templates.zip) the template files provided and change the urls and credentials accordingly.
2. Create a directory named **userstores** in `<MI_HOME>/repository/deployment/server` location.
3. Add the modified template files to the above directory.
4. Rename the file with the domain name you choose for the secondary user store.

!!! note
    The secondary user store configuration file must have the same name as the domain with an underscore (_) in place of the period. For example, if the domain is 'wso2.com', name the file as wso2_com.xml . One file contains the definition for one user store domain.

    Users from secondary user stores have the non-admin (read-only) permissions in the management dashboard. 


