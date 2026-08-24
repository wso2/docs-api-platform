---
title: "Changing the default user role in workflows"
description: "Update the workflow configuration files and BPS credentials when changing the default admin role for workflows."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.0.0/reference/customize-product/extending-api-manager/extending-workflows/changing-the-default-user-role-in-workflows/
md_url: https://wso2.com/api-platform/docs/api-manager/4.0.0/reference/customize-product/extending-api-manager/extending-workflows/changing-the-default-user-role-in-workflows.md
tags:
  - api-manager
  - reference
  - customize-product
  - extending-api-manager
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "how-to"
---

# Changing the Default User Role in Workflows

The default user role in the workflow configuration files is the admin role. If you change this to something else, you need to change the following files:

1.  Change the credentials in the `.epr` files of the `<BPS_HOME>/repository/conf/epr` folder.
2.  Change the credentials in work-flow configurations in API Manager Registry ( `_system/governance/apimgt/applicationdata/workflow-extensions.xml` )
3.  Point the same database that has the permissions used by the API Manager to the BPS.
4.  Share the LDAP, if it exists.
5.  If you change the default user role, change the .ht file of the relevant human task.
