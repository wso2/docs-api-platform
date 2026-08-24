---
title: "Exporting a project"
description: "Provides steps to export a project from the WSO2 Integration Studio workspace as an archive file or file system."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.0.0/integrate/develop/export_project/
md_url: https://wso2.com/api-platform/docs/api-manager/4.0.0/integrate/develop/export_project.md
tags:
  - api-manager
  - integrate
  - develop
  - export_project
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "how-to"
---

# Exporting a Project

With WSO2 Integration Studio, you can export projects from your workspace and later [import them](importing-projects.md).

For example, consider the following [**Maven Multi Module** project](create-integration-project.md) in your project explorer. This is a project solution that includes several project types.

<img src="../../../assets/img/integrate/create_project/proj_explorer_mmm_proj_2.png" width="300">

Follow the steps given below to export the project.   

1.  Right-click the project and click **Export**.

    <img src="../../../assets/img/integrate/create_project/export_project_option.png" width="300">

2.  In the **Export** wizard, open the **WSO2** folder as shown below.

    <img src="../../../assets/img/integrate/create_project/export_dialog_1.png" width="500">

3.  You can choose to export the project as an **archive file** or as a **file system**. Select the required option from the list and click **Next**.

    <table>
        <tr>
            <th>
                Projects Export as Archive File
            </th>
            <td>
                Select this option to export the project as a ZIP archive.
            </td>
        </tr>
        <tr>
            <th>
                Projects Export as File System
            </th>
            <td>
                Select this option to export the project folders without creating a ZIP archive.
            </td>
        </tr>
    </table>
    
4.  In the next page, see that your root project folder is selected. Click **Browse** and give the path to the export location. 

    !!! Tip
        If you have other projects in your workspace, you can also select them if required.

    <img src="../../../assets/img/integrate/create_project/export_dialog_2.png" width="500">


5.  Click **Finish** to export the project.