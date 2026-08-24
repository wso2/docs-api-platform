---
title: "Reusing endpoints"
description: "Demonstrates how to reuse endpoints in a Send mediator using indirect and resolving endpoint configurations."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.2.0/integrate/examples/endpoint_examples/reusing-endpoints/
md_url: https://wso2.com/api-platform/docs/api-manager/4.2.0/integrate/examples/endpoint_examples/reusing-endpoints.md
tags:
  - api-manager
  - integrate
  - examples
  - endpoint_examples
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "how-to"
---

# Reusing Endpoints

## Using Indirect Endpoints

In the following [Send
mediator](../../../reference/mediators/send-mediator)
configuration, the `         PersonInfoEpr        ` key refers to a
specific endpoint configured.

```
<send>
   <endpoint key="PersonInfoEpr"/>
</send>
```

## Using Resolving Endpoints

!!! Info
	The XPath expression specified in a Resolving endpoint configuration derives an existing endpoint rather than the URL of the endpoint to which the message is sent. To derive the endpoint URL to which the message is sent via an XPath expression, use the **Header** mediator.

In the following [Send
mediator](../../../reference/mediators/send-mediator)
configuration, the endpoint to which the message is sent is determined
by the `         get-property('Mail')        ` expression.

```
<send>
  <endpoint key-expression="get-property('Mail')"/>
</send>
```