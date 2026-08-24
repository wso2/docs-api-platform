---
title: "Developer Portal API v0.16"
description: "Interactive REST API reference for the WSO2 API Manager Developer Portal API version 0.16."
canonical_url: https://wso2.com/api-platform/docs/api-manager/3.1.0/develop/product-apis/devportal-apis/devportal-v0.16/devportal-v0.16/
md_url: https://wso2.com/api-platform/docs/api-manager/3.1.0/develop/product-apis/devportal-apis/devportal-v0.16/devportal-v0.16.md
tags:
  - api-manager
  - develop
  - product-apis
  - devportal-apis
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-19
content_type: "reference"
template: templates/swagger.html
---

!!! warning
    - The **Developer Portal v0.16 REST APIs will be deprecated in the next WSO2 API Manager release**. 
    - **[WSO2 recommends that you use the Developer Portal v1 REST APIs](../devportal-v1/devportal-v1.md)** as it is up to date and has support for the latest WSO2 API Manager 3.1.0 features.

??? Info "Click here to see how to try out the APIs"
    Do the following to try out the REST APIs with your local instance of WSO2 API Manager.

       1. Expand the relevant API operation and click the **Try It Out** button.

       2. Fill in relevant sample values for the input parameters and click **Execute**.

           You will receive a sample curl command with the sample values you filled in.

       3. Add a `-k` header to the curl command and run the curl command on the terminal with a running instance of WSO2 API-M.

<div id="swagger-ui"></div>
<script>
window.onload = function() {
  // Begin Swagger UI call region
  const ui = SwaggerUIBundle({
    url: "../../../../develop/product-apis/devportal-apis/devportal-v0.16/devportal-v0.16.yaml",
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