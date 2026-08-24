---
title: "Healthcheck API"
description: "Reference the Healthcheck REST API used to check the availability status of the Streaming Integrator."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.0.0/develop/streaming-apps/healthcheck-apis/
md_url: https://wso2.com/api-platform/docs/api-manager/4.0.0/develop/streaming-apps/healthcheck-apis.md
tags:
  - api-manager
  - develop
  - streaming-apps
  - healthcheck-apis
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "reference"
---

# Healthcheck API

### Overview

<table>
<tbody>
<tr class="odd">
<th>Description</th>
<td><br />
</td>
</tr>
<tr class="even">
<th>API Context</th>
<td><br />
</td>
</tr>
<tr class="odd">
<th>HTTP Method</th>
<td><code>GET</code></td>
</tr>
<tr class="even">
<th>Request/Response Format</th>
<td><br />
</td>
</tr>
<tr class="odd">
<th>Authentication</th>
<td>Basic</td>
</tr>
<tr class="even">
<th>Username</th>
<td><code>admin</code></td>
</tr>
<tr class="odd">
<th>Password</th>
<td><code>admin</code></td>
</tr>
<tr class="even">
<th>Runtime</th>
<td><br />
</td>
</tr>
</tbody>
</table>

### curl command syntax

``` java
curl -k -X GET http://<HOST_NAME>:<PORT>/health
```

### Sample curl command

``` java
curl -k -X GET http://localhost:9090/health	
```

### Sample output

``` java
{"status":"healthy"}	
```

### Response

<table>
<tbody>
<tr class="odd">
<th>HTTP Status Code</th>
<td><p>200</p>
<p>For descriptions of the HTTP status codes, see <a href="https://ei.docs.wso2.com/en/latest/streaming-integrator/ref/hTTP-Status-Codes/">HTTP Status Codes</a> .</p></td>
</tr>
</tbody>
</table>