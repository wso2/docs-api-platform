---
title: "Set passwords using environment variables"
description: "Supply system user, keystore, and truststore passwords through environment variables or system properties instead of hardcoding them."
canonical_url: https://wso2.com/api-platform/docs/api-manager/3.2.0/install-and-setup/setup/security/logins-and-passwords/set-passwords-using-vars-and-sys-props/
md_url: https://wso2.com/api-platform/docs/api-manager/3.2.0/install-and-setup/setup/security/logins-and-passwords/set-passwords-using-vars-and-sys-props.md
tags:
  - api-manager
  - install-and-setup
  - setup
  - security
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-22
content_type: "how-to"
---

# Set Passwords using Environment Variables or System Properties

The instructions on this page explain how you can set the passwords of system users, keystores, and trustores, etc. using system properties and environment variable, rather than hardcoding them in the configuration file itself. 

## Set passwords using environment variables 

1.  Set the password to an environment variable. 

2.  Open `<APIM_HOME>/repository/deployment.toml` file and refer the password value in the configuration using the `$env{<environment_variable_name>}` placeholder. 

       ``` tab="Format"
        [super_admin]
        username="admin"
        password="$env{<environment_variable_name>}"
       ```
       
       ``` tab="Example"
        [super_admin]
        username="admin"
        password="$env{ADMIN_PASSWORD}"
       ```

3.  Start the server to apply the changes.

      * On Linux: `./wso2server.sh`
      * On Windows: `./wso2server.bat`
 
## Set passwords using system properties
 
 1.  Open the `<APIM_HOME>/repository/deployment.toml` file and refer the required password value in the configuration using the `$sys{system.property}` placeholder. 
 
    ``` tab="Format"
    [super_admin]
    username="admin"
    password="$sys{system.property}"
    ```
        
    ``` tab="Example"
    [super_admin]
    username="admin"
    password="$sys{admin.password}"
    ```
    
2.  Pass the above-configured system property to the runtime by using one of the following options.
     
     Let's use `admin.password` here as a sample system property.

     -   During the server startup time

        * On Linux: `./wso2server.sh -Dadmin.password=admin`
        * On Windows: `./wso2server.bat -Dadmin.password=admin`
      
     -   Configure the system property in the `<APIM_HOME>/bin/wso2server.sh` file.
        
        ```bash
        -Dadmin.password=admin \
        ```
        