---
title: "Running the streaming integrator runtime"
description: "Start the WSO2 Streaming Integrator runtime server from the command line on Linux, macOS, or Windows."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/install-and-setup/install/installing-the-product/running-the-si/
md_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/install-and-setup/install/installing-the-product/running-the-si.md
tags:
  - api-manager
  - install-and-setup
  - install
  - installing-the-product
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-30
content_type: "how-to"
---

# Running the Streaming Integrator Runtime

Follow the steps given below to run the WSO2 Streaming Integrator (SI) runtime.

## Before you begin

[Download and install](installing-si.md) the Streaming Integrator runtime.

## Starting the SI server

Follow the steps given below to start the Streaming Integrator server.

1.    Open a command prompt as explained below.

      <table>
            <tr>
                  <th>On <b>Linux/macOS</b></td>
                  <td>Establish an SSH connection to the server, log on to the text Linux console, or open a terminal window.</td>
            </tr>
            <tr>
                  <th>On <b>Windows</b></td>
                  <td>Click <b>Start &gt;Run</b>, type <b>cmd</b> at the prompt, and then press <b>Enter</b>.</td>
            </tr>
      </table>     

2.    Navigate to the `<SI_HOME>/bin` folder from your command line.
3.    Execute one of the commands given below.

      -   To start the server:
          
          ```bash tab="On macOS/Linux"
          sh server.sh
          ```

          ```bash tab="On Windows"
          server.bat
          ```

      -   To start the server in background mode:

          ```bash tab="On macOS/Linux"
          sh server.sh start
          ```

          ```bash tab="On Windows"
          server.bat --start
          ```
      
By default, the HTTP listener port is 8290 and the default HTTPS listener port is 8253.

## Stopping the SI server

-     To stop the Streaming Integrator standalone application, go to the terminal and press <i>Ctrl+C</i>.
-     To stop the Streaming Integrator in background mode:

      ```bash tab="On macOS/Linux"
      sh server.sh stop
      ```

      ```bash tab="On Windows"
      server.bat --stop
      ```

## See Also

-   [Running the SI as a Windows Service](installing-si-as-windows-service.md)
-   [Running the SI as a Linux Service](installing-si-as-a-linux-service.md)