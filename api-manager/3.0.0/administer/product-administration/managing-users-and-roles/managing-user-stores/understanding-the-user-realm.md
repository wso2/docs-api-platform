---
title: "Understanding the user realm"
description: "Explains the user realm concept in WSO2 products, including the classes, configurations, and repositories that make up user management."
canonical_url: https://wso2.com/api-platform/docs/api-manager/3.0.0/administer/product-administration/managing-users-and-roles/managing-user-stores/understanding-the-user-realm/
md_url: https://wso2.com/api-platform/docs/api-manager/3.0.0/administer/product-administration/managing-users-and-roles/managing-user-stores/understanding-the-user-realm.md
tags:
  - api-manager
  - administer
  - product-administration
  - managing-users-and-roles
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "concept"
---

# Understanding the User Realm

User management functionality is provided by default in all WSO2 Carbon-based products and is configured in the 
`deployment.toml` file found in the `<PRODUCT_HOME>/repository/conf/` directory. The following documentation explains 
the configurations that should be done in WSO2 products in order to set up the User Management module.

The complete functionality and contents of the User Management module is called a **user realm** . The realm includes the user management classes, configurations and repositories that store information. Therefore, configuring the User Management functionality in a WSO2 product involves setting up the relevant repositories and updating the relevant configuration files.

The following diagram illustrates the required configurations and repositories:
![]({{ base_path }}/assets/attachments/126562314/126562315.png)

The following sections include instructions on the above required configurations and repositories:

