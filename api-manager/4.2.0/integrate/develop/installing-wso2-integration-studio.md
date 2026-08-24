---
title: "Installing WSO2 integration studio"
description: "Lists the installation prerequisites and steps for installing and running WSO2 Integration Studio."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.2.0/integrate/develop/installing-wso2-integration-studio/
md_url: https://wso2.com/api-platform/docs/api-manager/4.2.0/integrate/develop/installing-wso2-integration-studio.md
tags:
  - api-manager
  - integrate
  - develop
  - installing-wso2-integration-studio
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "how-to"
---

# Installing WSO2 Integration Studio

WSO2 Integration Studio provides a comprehensive development experience for building integration solutions.

### Installation prerequisites

<table>
    <tr>
        <td><b>Processor</b></td>
        <td>Intel Core i5 or equivalent </td>
    </tr>
    <tr>
        <td><b>RAM</b></td>
        <td>4 GB minimum, 8 GB recommended </td>
    </tr>
    <tr>
        <td><b>Disk Space</b></td>
        <td>Approximately 4 GB </td>
    </tr>
</table>

### Install and run WSO2 Integration Studio

Follow the steps given below.

1.  Go to the [API Manager Tooling web page](https://wso2.com/api-management/tooling/), and download WSO2 Integration Studio.

    !!! Note
        * If you are a MacOS user, be sure to add it to the **Applications** directory.
        * If you are a Microsoft Windows user, extract it outside the **Programs** directory. This is done because the Integration Studio requires permission to write to files.
        
3.  Run the **Integration Studio** application to start the tool.

!!! info
    **Getting an error message?** See the [troubleshooting](#troubleshooting) tips.

### Get the latest updates

If you have already installed and set up WSO2 Integration Studio, you can get the latest updates as follows:

1.  Open WSO2 Integration Studio on your computer.
2.  Go to **Help** -> **Check for Updates**.

    <a href="../../../assets/img/integrate/get-tooling-updates.png"><img src="../../../assets/img/integrate/get-tooling-updates.png" alt="get tooling updates" width="300"></a>

3.  Once the update check is completed, you can select all the available updates and install.

#### Checking the version

You can check the version of the Integration Studio as below.

* For MacOS : Integration Studio > About Integration Studio
* For Windows/Linux : Help > About Integration Studio

    <a href="../../../assets/img/integrate/about-integration-studio.jpg"><img src="../../../assets/img/integrate/about-integration-studio.jpg" alt="get studio information" width="400"></a>

### Troubleshooting

If you get an error message about the file being damaged or that you
cannot open the file when you try to start the tool on a MacOS, change the
MacOS security settings as described below.

1.  Go to **System Preferences** -\> **Security & Privacy** -\> **General**.
2.  Under **Allow apps downloaded from**, click **Anywhere** .
3.  Thereafter, select **IntegrationStudio** from the **Applications** menu in your Mac.

## What's next?

-   Take a [quick tour](wso2-integration-studio) of the WSO2 Integration Studio interface.
-   [Build a simple integration use case](integration-development-kickstart) to get familiar with the development workflow. 
-   Build [integration use cases](../integration-overview) with WSO2 Integration Studio.