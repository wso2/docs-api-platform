---
title: "Converting POX messages to JSON"
description: "Convert POX messages to JSON using the messageType property and other transformation methods in a proxy service."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.0.0/integrate/examples/message_transformation_examples/pox-to-json-conversion/
md_url: https://wso2.com/api-platform/docs/api-manager/4.0.0/integrate/examples/message_transformation_examples/pox-to-json-conversion.md
tags:
  - api-manager
  - integrate
  - examples
  - message_transformation_examples
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "how-to"
---

# Converting POX Messages to JSON 

The following examples explain different methods of converting POX messages to JSON using the Micro Integrator.

## Using the messageType property

Let's convert a POX message to JSON using the [messageType property](../../../reference/mediators/property-reference/generic-properties.md#messagetype).

### Synapse configuration
Following is a sample proxy service configuration that we can use to implement this scenario. 

!!! Tip
    Note that after the [messageType property](../../../reference/mediators/property-reference/generic-properties.md#messagetype) completes the message convertion, we are using the [Respond mediator](../../../reference/mediators/respond-mediator.md) to return the converted message back to the JSON client.

See the instructions on how to [build and run](#build-and-run-example-1) this example.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<proxy xmlns="http://ws.apache.org/ns/synapse"
       name="POX_To_JSON_Convert_Msgtype_Proxy"
       startOnLoad="true"
       statistics="disable"
       trace="disable"
       transports="http,https">
   <target>
      <inSequence>
         <property name="messageType" scope="axis2" value="application/json"/>
         <respond/>
      </inSequence>
   </target>
   <description/>
</proxy>
```

### Build and run (example 1)

Create the artifacts:

1. [Set up WSO2 Integration Studio](../../develop/installing-wso2-integration-studio.md).
2. [Create an integration project](../../develop/create-integration-project.md) with an <b>ESB Configs</b> module and an <b>Composite Exporter</b>.
3. [Create the proxy service](../../develop/creating-artifacts/creating-a-proxy-service.md) with the configurations given above.
4. [Deploy the artifacts](../../develop/deploy-artifacts.md) in your Micro Integrator.

Invoke the proxy service:

- HTTP method: POST
- Request URL: http://localhost:8290/services/POX_To_JSON_Convert_Msgtype_Proxy
- Content-Type: text/xml
- Message Body:
    ```xml
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
       <soapenv:Header/>
       <soapenv:Body>
       <SpaceX_LaunchPads>
          <Station>
              <Name>Kennedy Space Center Historic Launch Complex 39A</Name>
              <Short_Name>KSC LC 39A</Short_Name>
              <Launches>
                  <Attempts>18</Attempts>
                  <Successful>18</Successful>
              </Launches>
              <Region>Florida</Region>
              <Latitude>28.6080585</Latitude>
              <Longitude>-80.6039558</Longitude>
              <WIKI_Link>https://en.wikipedia.org/wiki/Kennedy_Space_Center_Launch_Complex_39#Launch_Pad_39A</WIKI_Link>
          </Station>
      </SpaceX_LaunchPads>
       </soapenv:Body>
    </soapenv:Envelope>
    ```

The converted JSON response is returned as follows:

```json
{
    "Envelope": {
        "Header": null,
        "Body": {
            "SpaceX_LaunchPads": {
                "Station": {
                    "Name": "Kennedy Space Center Historic Launch Complex 39A",
                    "Short_Name": "KSC LC 39A",
                    "Launches": {
                        "Attempts": 18,
                        "Successful": 18
                    },
                    "Region": "Florida",
                    "Latitude": 28.6080585,
                    "Longitude": -80.6039558,
                    "WIKI_Link": "https://en.wikipedia.org/wiki/Kennedy_Space_Center_Launch_Complex_39#Launch_Pad_39A"
                }
            }
        }
    }
}
```

## Using the PayloadFactory Mediator

Let's convert a POX message to JSON using a [PayloadFactory mediator](../../../reference/mediators/payloadfactory-mediator.md).

### Synapse configuration
Following is a sample proxy service configuration that we can use to implement this scenario. 

!!! Tip
    Note that after the [PayloadFactory mediator](../../../reference/mediators/payloadfactory-mediator.md) completes the message convertion, we are using the [Respond mediator](../../../reference/mediators/respond-mediator.md) to return the converted message back to the JSON client.

See the instructions on how to [build and run](#build-and-run-example-2) this example.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<proxy xmlns="http://ws.apache.org/ns/synapse"
       name="POX_To_JSON_Convert_PayloadFactory_Proxy"
       startOnLoad="true"
       statistics="disable"
       trace="disable"
       transports="http,https">
   <target>
      <inSequence>
         <payloadFactory media-type="json">
            <format>
            {
        "name": "$1",
        "location": {
            "region": "$2",
            "latitude": $3,
            "longitude": $4
        },
        "attempted_launches": $5,
        "successful_launches": $6,
        "wikipedia": "$7",
        "site_name_long": "$8"
        }
            </format>
            <args>
               <arg evaluator="xml" expression="//SpaceX_LaunchPads/Station/Short_Name"/>
               <arg evaluator="xml" expression="//SpaceX_LaunchPads/Station/Region"/>
               <arg evaluator="xml" expression="//SpaceX_LaunchPads/Station/Latitude"/>
               <arg evaluator="xml" expression="//SpaceX_LaunchPads/Station/Longitude"/>
               <arg evaluator="xml" expression="//SpaceX_LaunchPads/Station/Launches/Attempts"/>
               <arg evaluator="xml" expression="//SpaceX_LaunchPads/Station/Launches/Successful"/>
               <arg evaluator="xml" expression="//SpaceX_LaunchPads/Station/WIKI_Link"/>
               <arg evaluator="xml" expression="//SpaceX_LaunchPads/Station/Name"/>
            </args>
         </payloadFactory>
         <respond/>
      </inSequence>
   </target>
   <description/>
</proxy>
```

### Build and run (example 2)

Create the artifacts:

1. [Set up WSO2 Integration Studio](../../develop/installing-wso2-integration-studio.md).
2. [Create an integration project](../../develop/create-integration-project.md) with an <b>ESB Configs</b> module and an <b>Composite Exporter</b>.
3. [Create the proxy service](../../develop/creating-artifacts/creating-a-proxy-service.md) with the configurations given above.
4. [Deploy the artifacts](../../develop/deploy-artifacts.md) in your Micro Integrator.

Invoke the proxy service:

- HTTP method: POST
- Request URL: http://localhost:8290/services/POX_To_JSON_Convert_PayloadFactory_Proxy
- Content-Type: text/xml
- Message Body:
    ```xml
    <SpaceX_LaunchPads>
        <Station>
            <Name>Kennedy Space Center Historic Launch Complex 39A</Name>
            <Short_Name>KSC LC 39A</Short_Name>
            <Launches>
                <Attempts>18</Attempts>
                <Successful>18</Successful>
            </Launches>
            <Region>Florida</Region>
            <Latitude>28.6080585</Latitude>
            <Longitude>-80.6039558</Longitude>
            <WIKI_Link>https://en.wikipedia.org/wiki/Kennedy_Space_Center_Launch_Complex_39#Launch_Pad_39A</WIKI_Link>
        </Station>
    </SpaceX_LaunchPads>
    ```

The converted JSON response is returned as follows:

```json
{
    "name": "KSC LC 39A",
    "location": {
        "region": "Florida",
        "latitude": 28.6080585,
        "longitude": -80.6039558
    },
    "attempted_launches": 18,
    "successful_launches": 18,
    "wikipedia": "https://en.wikipedia.org/wiki/Kennedy_Space_Center_Launch_Complex_39#Launch_Pad_39A",
    "site_name_long": "Kennedy Space Center Historic Launch Complex 39A"
}
```