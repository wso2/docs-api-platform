---
title: "Handling Non-Matching resources"
description: "Define a sequence that returns an error response when a REST API request has no matching resource definition."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.2.0/integrate/examples/rest_api_examples/handling-non-matching-resources/
md_url: https://wso2.com/api-platform/docs/api-manager/4.2.0/integrate/examples/rest_api_examples/handling-non-matching-resources.md
tags:
  - api-manager
  - integrate
  - examples
  - rest_api_examples
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "how-to"
---

# Handling Non-Matching Resources
    
This example demonstrates how you can define a sequence to be invoked if the Micro Integrator is unable to find a matching resource definition for a specific API invocation. This sequence generates a response indicating an error when no matching resource definition is found.
    
## Synapse configurations

Following is a sample REST API configuration and Sequence configuration that we can used to implement this scenario. See the instructions on how to [build and run](#build-and-run) this example.
        
=== "REST Api"
      ```xml
      <api xmlns="http://ws.apache.org/ns/synapse" name="jaxrs" context="/jaxrs">
         <resource methods="GET" uri-template="/customers/{id}">
            <inSequence>
               <send>
                  <endpoint>
                     <address uri="http://localhost:8290/jaxrs_basic/services/customers/customerservice"/>
                  </endpoint>
               </send>
            </inSequence>
            <outSequence>
               <send/>
            </outSequence>
         </resource>
      </api> 
      ```
    
=== "Sequence"
      ```xml
      <sequence xmlns="http://ws.apache.org/ns/synapse" name="_resource_mismatch_handler_">
         <payloadFactory>
            <format>
               <tp:fault xmlns:tp="http://test.com">
                  <tp:code>404</tp:code>
                  <tp:type>Status report</tp:type>
                  <tp:message>Not Found</tp:message>
                  <tp:description>The requested resource (/$1) is not available.</tp:description>
               </tp:fault>
            </format>
            <args>
               <arg xmlns:ns="http://org.apache.synapse/xsd" expression="$axis2:REST_URL_POSTFIX"/>
            </args>
         </payloadFactory>
         <property name="RESPONSE" value="true" scope="default"/>
         <property name="NO_ENTITY_BODY" action="remove" scope="axis2"/>
         <property name="HTTP_SC" value="404" scope="axis2"/>
         <header name="To" action="remove"/>
         <send/>
      </sequence>
      ```

## Build and run

Create the artifacts:

1. [Set up WSO2 Integration Studio](../../develop/installing-wso2-integration-studio).
2. [Create an integration project](../../develop/create-integration-project) with an <b>ESB Configs</b> module and an <b>Composite Exporter</b>.
3. Create the [rest API](../../develop/creating-artifacts/creating-an-api) and [mediation sequence](../../develop/creating-artifacts/creating-reusable-sequences) with the configurations given above.
4. [Deploy the artifacts](../../develop/deploy-artifacts) in your Micro Integrator.

Set up the back-end service:

1. Download the [back-end service](https://github.com/wso2-docs/WSO2_EI/blob/master/Back-End-Service/axis2Server.zip)
2. Extract the downloaded zip file.
3. Open a terminal, navigate to the `axis2Server/bin/` directory inside the extracted folder.
4. Execute the following command to start the axis2server with the SimpleStockQuote back-end service:
   
    === "On MacOS/Linux/CentOS"
         ```bash
         sh axis2server.sh
         ```
          
    === "On Windows"
         ```bash
         axis2server.bat
         ```

Send an invalid request to the back end as follows:
    
```bash
curl -X GET http://localhost:8290/jaxrs/customers-wrong/123
```
    
You will get the following response:
    
```bash
<tp:fault xmlns:tp="http://test.com">
<tp:code>404</tp:code>
<tp:type>Status report</tp:type>
<tp:message>Not Found</tp:message>
<tp:description>The requested resource (//customers-wrong/123) is not available.</tp:description>
</tp:fault>
```