---
title: "Using inbound endpoints with the registry"
description: "Configure inbound endpoint parameter values as registry entries so the same configuration works across environments."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.0.0/integrate/examples/inbound_endpoint_examples/inbound-endpoint-with-registry/
md_url: https://wso2.com/api-platform/docs/api-manager/4.0.0/integrate/examples/inbound_endpoint_examples/inbound-endpoint-with-registry.md
tags:
  - api-manager
  - integrate
  - examples
  - inbound_endpoint_examples
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "how-to"
---

# Using Inbound Endpoints with the Registry
Other than specifying parameter values inline, you can also
specify parameter values as registry entries. The advantage of
specifying a parameter value as a registry entry is that the same
inbound endpoint configuration can be used in different environments
simply by changing the registry entry value.

<!--

```
    <?xml version="1.0" encoding="UTF-8"?>
    <inboundEndpoint xmlns="http://ws.apache.org/ns/synapse" name="file" sequence="request" onError="fault" protocol="file" suspend="false">
       <parameters>
          ...............
          <parameter name="transport.vfs.FileURI" key="conf:/repository/ei/ei-configurations/test"/>
          ...............
       </parameters>
    </inboundEndpoint>
```
-->

## Synapse configuration

Following are the integration artifacts that we can used to implement this scenario. See the instructions on how to [build and run](#build-and-run) this example.
 
```xml
<?xml version="1.0" encoding="UTF-8"?>
<inboundEndpoint xmlns="http://ws.apache.org/ns/synapse" 
                 name="file1" sequence="request" 
                 onError="fault" 
                 protocol="file" 
                 suspend="false">
   <parameters>
      <parameter name="interval">1000</parameter>
      <parameter name="sequential">true</parameter> 
      <parameter name="coordination">true</parameter> 
      <parameter name="transport.vfs.ActionAfterProcess">MOVE</parameter>
      <parameter name="transport.vfs.MoveAfterProcess" key="gov:/custom/out.txt"/>
      <parameter name="transport.vfs.FileURI" key="gov:/custom/in.txt"/>
      <parameter name="transport.vfs.MoveAfterFailure" key="gov:/custom/failed.txt"/>
      <parameter name="transport.vfs.FileNamePattern">.*.txt</parameter>
      <parameter name="transport.vfs.ContentType">text/plain</parameter>
      <parameter name="transport.vfs.ActionAfterFailure">MOVE</parameter>
   </parameters>
</inboundEndpoint>
```

## Build and run

Create the artifacts:

1. [Set up WSO2 Integration Studio](../../develop/installing-wso2-integration-studio.md).
2. [Create an integration project](../../develop/create-integration-project.md) with an <b>ESB Configs</b> module and an <b>Composite Exporter</b>.
3. See the instructions on [creating an inbound endpoint](../../develop/creating-artifacts/creating-an-inbound-endpoint.md) to define the inbound endpoint given above.
4. [Deploy the artifacts](../../develop/deploy-artifacts.md) in your Micro Integrator.