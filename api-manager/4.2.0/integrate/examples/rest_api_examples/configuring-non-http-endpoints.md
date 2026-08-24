---
title: "Exposing Non-HTTP services as RESTful APIs"
description: "Expose a non-HTTP endpoint, such as a JMS topic, as a RESTful API by removing the REST_URL_POSTFIX property."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.2.0/integrate/examples/rest_api_examples/configuring-non-http-endpoints/
md_url: https://wso2.com/api-platform/docs/api-manager/4.2.0/integrate/examples/rest_api_examples/configuring-non-http-endpoints.md
tags:
  - api-manager
  - integrate
  - examples
  - rest_api_examples
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "how-to"
---

# Exposing Non-HTTP Services as RESTful APIs
This example demonstrates how the WSO2 Micro Integrator forwards messages to non-HTTP endpoints.

## Synapse configuration

Following is a sample REST API configuration that we can used to implement this scenario. See the instructions on how to [build and run](#build-and-run) this example.

```xml
<api xmlns="http://ws.apache.org/ns/synapse" name="EventDelayOrderAPI" context="/orderdelayAPI"> 
        <resource methods="POST" url-mapping="/"> 
           <inSequence> 
              <property name="REST_URL_POSTFIX" action="remove" scope="axis2"></property> 
              <send> 
                 <endpoint> 
                    <address uri=
    "jms:/DelayOrderTopic?transport.jms.ConnectionFactoryJNDIName=TopicConnectionFactory&
    java.naming.factory.initial=org.apache.activemq.jndi.ActiveMQInitialContextFactory&
    java.naming.provider.url=tcp://localhost:61616&transport.jms.DestinationType=topic">
                  </address> 
                 </endpoint> 
              </send> 
           </inSequence> 
        </resource> 
</api>
```

When using a non-HTTP endpoint, such as a JMS endpoint, in the API definition, you must remove the `REST_URL_POSTFIX` property to avoid any characters specified after the context (such as a trailing slash) in the request from being appended to the JMS endpoint. 

Notice that we have specified the `REST_URL_POSTFIX` property with the value set to "remove". When invoking this API, even if the request contains a trailing slash after the context (e.g., `POST http://127.0.0.1:8290/orderdelayAPI/` instead of `POST  http://127.0.0.1:8290/orderdelayAPI`, the endpoint will be called correctly.

## Build and run

Create the artifacts:

1. [Set up WSO2 Integration Studio](../../develop/installing-wso2-integration-studio).
2. [Create an integration project](../../develop/create-integration-project) with an <b>ESB Configs</b> module and an <b>Composite Exporter</b>.
3. [Create the rest API](../../develop/creating-artifacts/creating-an-api) with the configurations given above.
4. [Deploy the artifacts](../../develop/deploy-artifacts) in your Micro Integrator.

[Configure the ActiveMQ broker](../../../install-and-setup/setup/mi-setup/brokers/configure-with-activemq) with your Micro Integrator.

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

Invoke the REST API with a POST message.