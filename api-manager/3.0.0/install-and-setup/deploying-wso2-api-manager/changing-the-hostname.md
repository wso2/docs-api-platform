---
title: "Changing the hostname"
description: "Change the hostname and management hostname of a WSO2 API Manager production deployment in deployment.toml."
canonical_url: https://wso2.com/api-platform/docs/api-manager/3.0.0/install-and-setup/deploying-wso2-api-manager/changing-the-hostname/
md_url: https://wso2.com/api-platform/docs/api-manager/3.0.0/install-and-setup/deploying-wso2-api-manager/changing-the-hostname.md
tags:
  - api-manager
  - install-and-setup
  - deploying-wso2-api-manager
  - changing-the-hostname
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "how-to"
---

# Changing the Hostname

By default, WSO2 products identify the hostname of the current machine through the Java API. However, this value sometimes yields erroneous results on some environments. Therefore, users are recommended to configure the hostname. The following procedure explains how to change the hostname and management hostname of WSO2 API Manager (WSO2 API-M) as required for your production environment.

1. Update the `deployment.toml` file.

    1. Open the `<API-M_HOME>/repository/conf/deployment.toml` file 
    
    2. Define the `hostname` attribute under server configurations as shown below.

        ``` format tab="Format"
        [server]
        hostname = "{hostname}"
        ```
    
        ``` example tab="Example"
        [server]
        hostname = "am.dev.wso2.com"
        ```
    
        `{hostname}` - Hostname or IP address of the machine hosting this server. This is will become part of the End Point Reference of the services deployed on this server instance.
    
    3. Configure the Developer Portal URL, which is used to access the Developer Portal via the Publisher. 

        Uncomment the following configuration and define the `hostname`.

        ```
        [apim.devportal]
        url = "https://<hostname>:${mgt.transport.https.port}/devportal"
        ```

2.  Generate a key store, export the public certificate from the keystore, and import that certificate to the `client­-truststore.jks` file.
    
     For more information, see [Creating New Keystores](../../administer/product-security/configuring-keystores/keystore-basics/creating-new-keystores).

3.  Restart the server.

    !!! warning

        After you change the hostname, if you encounter login failures when trying to access the API Publisher and API Developer Portal, with the error `Registered callback does not match with the provided url`, see ['Registered callback does not match with the provided url' error](../../troubleshooting/troubleshooting-invalid-callback-error) in the Troubleshooting guide.