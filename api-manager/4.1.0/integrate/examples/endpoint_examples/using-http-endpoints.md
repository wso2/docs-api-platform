---
title: "Using the HTTP endpoint"
description: "Populate an HTTP endpoint's URI template during mediation and build the endpoint URL from multiple parameters."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/integrate/examples/endpoint_examples/using-http-endpoints/
md_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/integrate/examples/endpoint_examples/using-http-endpoints.md
tags:
  - api-manager
  - integrate
  - examples
  - endpoint_examples
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-30
content_type: "how-to"
---

# Using the HTTP Endpoint

See the examples given below on how to effectively use the HTTP endpoint.

## Example 1: Populating an HTTP endpoint during mediation

Shown below is a synapse configuration that defines an endpoint artifact.

```xml
<endpoint name="HTTPEndpoint" xmlns="http://ws.apache.org/ns/synapse">
    <http method="get" uri-template="http://localhost:8080/{uri.var.servicepath}/restapi/{uri.var.servicename}/menu?category={uri.var.category}&amp;type={uri.var.pizzaType}"/>
</endpoint>
```

The URI template variables in this example HTTP endpoint can be populated during mediation using the following sequence configuration:

```xml
 <inSequence>
    <property name="uri.var.servicepath" scope="default" type="STRING" value="PizzaShopServlet"/>
    <property name="uri.var.servicename" scope="default" type="STRING" value="PizzaWS"/>
    <property name="uri.var.category" scope="default" type="STRING" value="pizza"/>
    <property name="uri.var.pizzaType" scope="default" type="STRING" value="pan"/>
    <send>
        <endpoint key="HTTPEndpoint"/>
    </send>
 </inSequence>
```

This configuration will cause the RESTful URL to evaluate the following: 

```bash
http://localhost:8080/PizzaShopServlet/restapi/PizzaWS/menu?category=pizza&type=pan
```

## Example 2

You can specify one parameter as the HTTP endpoint by
using multiple other parameters, and then pass that to define the HTTP
endpoint as follows:

```xml
<property name="uri.var.httpendpointurl" expression="fn:concat($ctx:prefixuri, $ctx:host, $ctx:port, $ctx:urlparam1, $ctx:urlparam2)" />
<send>
    <endpoint>
        <http uri-template="{uri.var.httpendpointurl}"/>
    </endpoint>
</send>
```