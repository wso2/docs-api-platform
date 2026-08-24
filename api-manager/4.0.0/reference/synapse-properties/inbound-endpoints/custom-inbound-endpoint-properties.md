---
title: "Custom inbound endpoint properties"
description: "Reference for the properties used to configure a custom listening or polling inbound endpoint in the Micro Integrator."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.0.0/reference/synapse-properties/inbound-endpoints/custom-inbound-endpoint-properties/
md_url: https://wso2.com/api-platform/docs/api-manager/4.0.0/reference/synapse-properties/inbound-endpoints/custom-inbound-endpoint-properties.md
tags:
  - api-manager
  - reference
  - synapse-properties
  - inbound-endpoints
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "reference"
---

# Custom Inbound Endpoint Properties

Given below are the properties that should be configured when you define a custom inbound endpoint.

``` java tab='Custom Listening Inbound'
<inboundEndpoint xmlns="http://ws.apache.org/ns/synapse" name="custom_listener" sequence="request" onError="fault"
                         class="org.wso2.carbon.inbound.custom.listening.SampleListeningEP" suspend="false">
       <parameters>
          <parameter name="sequential">true</parameter>
          <parameter name="inbound.behavior">listening</parameter>
          <parameter name="coordination">true</parameter>
       </parameters>
</inboundEndpoint>
```

``` java tab='Custom Polling Inbound'
<inboundEndpoint xmlns="http://ws.apache.org/ns/synapse" name="class" sequence="request" onError="fault"
                                class="org.wso2.carbon.inbound.custom.poll.SamplePollingClient" suspend="false">
       <parameters>
          <parameter name="sequential">true</parameter>
          <parameter name="interval">2000</parameter>
          <parameter name="coordination">true</parameter>
       </parameters>
</inboundEndpoint>
```

``` java tab='Custom Event-Based Inbound'
<inboundEndpoint xmlns="http://ws.apache.org/ns/synapse" name="custom_waiting" sequence="request" onError="fault"
                         class="org.wso2.carbon.inbound.custom.wait.SampleWaitingClient" suspend="false">
       <parameters>
          <parameter name="sequential">true</parameter>
          <parameter name="inbound.behavior">eventBased</parameter>
          <parameter name="coordination">true</parameter>
       </parameters>
</inboundEndpoint>
```

<table>
   <thead>
      <tr>
         <th>
            <p>Property Name</p>
         </th>
         <th>
            <p>Description</p>
         </th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <td>
          class
         </td>
         <td>
          Name of the custom class implementation. Specify a valid class name.
         </td>
      </tr>
      <tr>
         <td>
          sequence
         </td>
         <td>Name of the sequence message that should be injected. Specify a valid sequence name.</td>
      </tr>
      <tr>
         <td>
            onError
         </td>
         <td>Name of the fault sequence that should be invoked in case of failure. Specify a valid sequence name.</td>
      </tr>
      <tr>
         <td>
          inbound.behavior
         </td>
         <td>
          The behaviour of the inbound endpoint. Specify <code>listening</code>, <code>polling</code>, or <code>event-based</code>.
         </td>
      </tr>
   </tbody>
</table>