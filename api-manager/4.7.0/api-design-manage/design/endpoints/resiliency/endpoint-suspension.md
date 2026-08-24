---
title: "Endpoint Suspension"
description: "The Gateway automatically suspends an unreachable backend endpoint for a default 30-second period, returning an error response to clients."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.7.0/api-design-manage/design/endpoints/resiliency/endpoint-suspension/
md_url: https://wso2.com/api-platform/docs/api-manager/4.7.0/api-design-manage/design/endpoints/resiliency/endpoint-suspension.md
tags:
  - api-manager
  - resiliency
  - endpoints
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "concept"
---

# Endpoint Suspension

In API Manager, by default, the gateway suspends an API for 30 seconds when it cannot reach the endpoint. If another request is made to your API within those 30 seconds, it will not be sent to the backend. The following response appears when the endpoint is suspended.

``` java
    <am:fault xmlns:am="http://wso2.org/apimanager">
    <am:code>303001</am:code>
    <am:type>Status report</am:type>
    <am:message>Runtime Error</am:message>
    <am:description>Currently , Address endpoint : [ Name : somename-AT-sometenant--test_me_APIproductionEndpoint_0 ] [ State : SUSPENDED ]</am:description>
    </am:fault>
```

 <div class="admonition note">
 <p class="admonition-title">What's Next?</p>

 <p>For more information on endpoint timeout configurations, see -
 <ul><li><a href="../endpoint-timeouts.md">Endpoint Timeouts</a>
 </li>
<li><a href="../prevent-api-suspension.md">Prevent API Suspension</a></li></ul></p>
 </div>
