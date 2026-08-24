---
title: "Generate SDKs in the Developer Portal"
description: "Generate and download a client-side SDK for a subscribed API from the WSO2 Developer Portal."
canonical_url: https://wso2.com/api-platform/docs/api-manager/3.0.0/learn/consume-api/generating-sdks/generate-sdks-in-dev-portal/
md_url: https://wso2.com/api-platform/docs/api-manager/3.0.0/learn/consume-api/generating-sdks/generate-sdks-in-dev-portal.md
tags:
  - api-manager
  - learn
  - consume-api
  - generating-sdks
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "how-to"
---

# Generate SDKs in the Developer Portal

A Software Development Kit (SDK) is a set of software development tools that allows you to create applications for a specific platform. If an API consumer wants to create an application, they can generate a client-side SDK for a supported language/framework and use it to write a software application to consume the subscribed APIs. 

## Downloading SDKs from the Developer Portal

Follow the instructions below to generate and download client-side SDKs via the Developer Portal:

1.  Sign in to the WSO2 API Developer Portal.

     (`https://<hostname>:<port>/devportal`)

2. Click on the API for which you want to generate a client-side SDK (e.g., `PizzaShackAPI`).

     [![API Overview](../../../assets/img/learn/select-api-dev-portal.png)](../../../assets/img/learn/select-api-dev-portal.png)
 
3.  Click **SDKs**. 

     The default SDKs that you can download appear. 

     [![Default SDKs](../../../assets/img/learn/default-sdks.png)](../../../assets/img/learn/default-sdks.png)
    
4.  Click **Download** to download the required SDK. 

     This downloads the ZIP archive of the SDK.

     <a href="../../../../assets/img/learn/download-sdk.png"><img src="../../../../assets/img/learn/download-sdk.png" alt="Download SDK" title="Download SDK" width="80%" /></a>    
    
##  Configuring supported languages for SDK generation

By default, **Android, Java, JavaScript**, and **JMeter** the SDKs that are available to be downloaded via the Developer Portal in WSO2 API Manager (WSO2 API-M). In addition to the latter mentioned SDKs, WSO2 API Manager also supports SDK generation for the following languages. **C-Sharp (C#), Dart, Flash, Groovy, Perl, PHP, Python, Ruby, Clojure**.

Follow the instructions below to configure the languages available for SDK generation:

1.  Open `<API-M_HOME>/repository/conf/deployment.toml` file.

2.  Add the following configuration to specify the required languages.

    ```toml
    [apim.sdk]
    supported_languages = ["android", "java", "csharp", "dart", "flash", "groovy", "javascript"]
    ```
    
3.  [Restart the server](../../../install-and-setup/installation-guide/running-the-product) to apply the configuration changes.