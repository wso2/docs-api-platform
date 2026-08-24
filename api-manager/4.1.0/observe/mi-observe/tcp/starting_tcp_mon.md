---
title: "Starting TCPMon"
description: "Starts the TCPMon tool from the Micro Integrator distribution or a standalone Apache download."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/observe/mi-observe/tcp/starting_tcp_mon/
md_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/observe/mi-observe/tcp/starting_tcp_mon.md
tags:
  - api-manager
  - observe
  - mi-observe
  - tcp
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-30
content_type: "how-to"
---

# Starting TCPMon

TCPMon is available in the `         MI_HOME/bin        `
directory of the Micro Integrator distribution. Alternatively,
you can download TCPMon from Apache and run the tool.

## Running TCPMon (from the product distribution)

Be sure that the following prerequisites are fulfilled:

-   Install JDK 1.4 or later version.
-   Set the `           JAVA_HOME          ` variable. This setting is
    required only if you are using the TCPMon available in the
    Micro Integrator distribution.
    
To run TCPMon:

1.  Go to the `          MI_HOME/bin         ` directory.
2.  Execute the following command to run the tool.  

    -   On **Windows**:
        ``` java
        tcpmon.bat
        ```

    -   On **Linux/MacOS/CentOS**:
        ``` java
        ./tcpmon.sh
        ```

## Running TCPMon (downloaded from Apache)

To download TCPMon from Apache and run the tool:

1.  [Download TCPMon](http://archive.apache.org/dist/ws/tcpmon/1.0/tcpmon-1.0-bin.zip) from the following location:
2.  Extract the `tcpmon-1.0-bin.zip` archive.
3.  Go to the build of the extracted directory to find the execution script.
4.  Execute the following command to run the tool.  

    -   On **Windows**:
        ``` java
        tcpmon.bat
        ```

    -   On **Linux/MacOS/CentOs**:
        ``` java
        ./tcpmon.sh
        ```