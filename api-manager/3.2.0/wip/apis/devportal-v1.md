---
title: "Developer Portal REST API v1 (work in progress)"
description: "Try out the Developer Portal REST API v1 against a local instance of WSO2 API Manager. This page is work in progress."
canonical_url: https://wso2.com/api-platform/docs/api-manager/3.2.0/wip/apis/devportal-v1/
md_url: https://wso2.com/api-platform/docs/api-manager/3.2.0/wip/apis/devportal-v1.md
tags:
  - api-manager
  - wip
  - apis
  - devportal-v1
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-22
content_type: "reference"
template: templates/swagger.html
---

??? Info "Note: Click to view"
    Do the following to try out the REST APIs with your local instance of WSO2 API Manager. 
     
       1.  Expand the relevant API operation and click the **Try It Out** button.  
       2.  Fill in relevant sample values for the input parameters and click **Execute**. 
            You will receive a sample curl command with the sample values you filled in. 
       3. Add a `-k` header to the curl command and run the curl command on the terminal with a running instance of WSO2
         API-M. 
     
<div id="swagger-ui"></div>
<script>
window.onload = function() {
  // Begin Swagger UI call region
  const ui = SwaggerUIBundle({
    url: "../devportal-v1.yaml",
    dom_id: '#swagger-ui',
    deepLinking: true,
    validatorUrl: null,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  })
  // End Swagger UI call region

  window.ui = ui
}
</script>