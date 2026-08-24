---
title: "CXF WS-RM inbound endpoint"
description: "Lists the syntax and configuration properties for the CXF WS-RM inbound endpoint used for reliable messaging."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/reference/synapse-properties/inbound-endpoints/listening-inbound-endpoints/cxf-ws-rm-inbound-endpoint-properties/
md_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/reference/synapse-properties/inbound-endpoints/listening-inbound-endpoints/cxf-ws-rm-inbound-endpoint-properties.md
tags:
  - api-manager
  - reference
  - synapse-properties
  - inbound-endpoints
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-30
content_type: "reference"
---

# CXF WS-RM Inbound Endpoint
## Introduction

WS­ReliableMessaging allows SOAP messages to be reliably delivered between distributed applications regardless of software or hardware failures. The CXF WS­-RM inbound endpoint allows a client (RM Source) to communicate with the Micro Integrator with a guarantee that a sent message will be delivered.

## Syntax

```xml
<inboundEndpoint xmlns="http://ws.apache.org/ns/synapse"
                     name="RM_INBOUND"
                     sequence="RMIn"
                     onError="fault"
                     class="org.wso2.carbon.inbound.endpoint.ext.wsrm.InboundRMHttpListener"
                     suspend="false">
       <parameters>
          <parameter name="inbound.cxf.rm.port">20940</parameter>
          <parameter name="inbound.cxf.rm.config-file">conf/cxf/server.xml</parameter>
          <parameter name="coordination">true</parameter>
          <parameter name="inbound.cxf.rm.host">127.0.0.1</parameter>
          <parameter name="inbound.behavior">listening</parameter>
          <parameter name="sequential">true</parameter>
       </parameters>
</inboundEndpoint>
``` 

## Properties

The following properties can be configured when [creating a CXF WS-RM inbound endpoint](../../../../integrate/develop/creating-artifacts/creating-an-inbound-endpoint.md).

<table>
  <tr>
    <th>Property Name</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>inbound.cxf.rm.host</td>
    <td>
      The host name.
    </td>
  </tr>
  <tr>
    <td>inbound.cxf.rm.port</td>
    <td>
      The port to listen to.</br></br>
      <b>Note</b>: When configuring an SSL-enabled cxf\_ws\_rm inbound endpoint, the <code>inbound.cxf.rm.port</code> parameter should be set to the same value as the engine port number specified in the CXF spring configuration file saved in the MI_HOME/conf/cxf directory. For example, in the above CXF spring configuration, the engine port is 8081. This same port number should be specified as the <code>inbound.cxf.rm.port</code> in the cxf\_ws\_rm inbound endpoint configuration.
    </td>
  </tr>
  <tr>
    <td>inbound.cxf.rm.config-file</td>
    <td>
      The path to the CXF Spring configuration file.
    </td>
  </tr>
  <tr>
    <td>enableSSL</td>
    <td>
      Set to <code>true</code> if SSL is enabled in the CXF Spring configuration file.
    </td>
  </tr>
  <tr>
         <td>sequential</td>
         <td>The behavior when executing the given sequence.<br />
            When set as <code>true</code> , mediation will happen within the same thread. When set as <code>false</code> , the mediation engine will use the inbound thread pool. The default thread pool values can be found in the <code>MI_HOME/conf/deployment.toml</code> file, under the `[mediation]` section. The default setting is <code>true</code>.
         </td>
      </tr>
      <tr>
        <td>Suspend</td>
        <td>
          If the inbound listener should pause when accepting incoming requests, set this to <code>true</code>. If the inbound listener should not pause when accepting incoming requests, set this to <code>false</code>.
        </td>
  </tr>
</table>