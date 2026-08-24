---
title: "Creating custom users to perform apictl operations"
description: "Create custom users and roles for apictl by assigning the Internal/devops role or a custom role with minimal required scopes."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.0.0/install-and-setup/setup/api-controller/advanced-topics/creating-custom-users-to-perform-api-controller-operations/
md_url: https://wso2.com/api-platform/docs/api-manager/4.0.0/install-and-setup/setup/api-controller/advanced-topics/creating-custom-users-to-perform-api-controller-operations.md
tags:
  - api-manager
  - install-and-setup
  - setup
  - api-controller
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "how-to"
---

#  Creating Custom Users to Perform apictl Operations

To perform tasks using the **WSO2 API Controller (apictl)**, a particular user must have required scopes. From WSO2 API Manager (WSO2 API-M) 3.2.0 onwards, a new role named `Internal/devops` has been introduced who has the ability to perform all the apictl related operations. You just need to create a new user (Refer [Adding a new User](../../../../administer/managing-users-and-roles/managing-users.md#adding-a-new-user) to learn about adding new users), assign the role `Internal/devops` and use that user to perform the apictl operations.

## Minimal permissions and scopes required to perform apictl operations

Further, you can create your own custom user with a custom role to perform specific set of apictl operations. Refer the below table to learn about the required scopes that are needed for each of the apictl operation.

!!! info
    **Steps to create a custom user with a custom role for your need** 

    - As shown in [Create user roles](../../../../administer/managing-users-and-roles/managing-user-roles.md#creating-user-roles) section, you can create your own custom user role by assigning scopes that are required to perform a particular set of apictl operations by referring the table below.
    - Then, create a user as explained in [Adding a new User](../../../../administer/managing-users-and-roles/managing-users.md#adding-a-new-user), by assigning the custom role that you created in the above step, to that user.
    - Now you can login to apictl (using `apictl login <env-name>` command) and perform the particular set of operations as per your need.

<table>
<thead>
<tr class="header">
<th>Operation</th>
 <th>Minimal Scopes</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>add env</td>
<td>-</td>
</tr>
<tr class="even">
<td>remove env</td>
<td>-</td>
</tr>
<tr class="odd">
<td>get envs</td>
<td>-</td>
</tr>
<tr class="even">
<td>login</td>
<td>-</td>
</tr>
<tr class="odd">
<td>logout</td>
<td>-</td>
</tr>
<tr class="even">
<td>get apis</td>
<td>apim:api_import_export</td>
</tr>
<tr class="odd">
<td>get api-revisions</td>
<td>apim:api_import_export</td>
</tr>
<tr class="even">
<td>delete api</td>
<td>apim:api_import_export</td>
</tr>
<tr class="odd">
<td>change-status api</td>
<td>apim:api_import_export</td>
</tr>
<tr class="even">
<td>import api</td>
<td>apim:api_import_export</td>
</tr>
<tr class="odd">
<td>export api</td>
<td>apim:api_import_export</td>
</tr>
<tr class="even">
<td>export-apis</td>
<td>apim:api_import_export</td>
</tr>
<tr class="odd">
<td>get api-products</td>
<td>apim:api_product_import_export</td>
</tr>
<tr class="even">
<td>get api-product-revision</td>
<td>apim:api_product_import_export</td>
</tr>
<tr class="odd">
<td>delete api-product</td>
<td>apim:api_product_import_export</td>
</tr>
<tr class="even">
<td>import api-product</td>
<td>apim:api_product_import_export</td>
</tr>
<tr class="odd">
<td>export api-product</td>
<td>apim:api_product_import_export,<br>apim:api_import_export</td>
</tr>
<tr class="even">
<td>get apps</td>
<td>apim:app_import_export</td>
</tr>
<tr class="odd">
<td>delete app</td>
<td>apim:app_import_export</td>
</tr>
<tr class="even">
<td>import app</td>
<td>apim:app_import_export</td>
</tr>
<tr class="odd">
<td>export app</td>
<td>apim:app_import_export</td>
</tr>
<tr class="even">
<td>get keys</td>
<td>apim:app_manage, <br>apim:sub_manage, <br>apim:api_product_import_export
<br><br>or<br>apim:app_manage, <br>apim:sub_manage, <br>apim:api_import_export
<br><br>or<br>apim:app_manage, <br>apim:sub_manage, <br>apim:api_view</td>
</tr>
</tbody>
</table>
