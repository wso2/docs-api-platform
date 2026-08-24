---
title: "Adding custom properties to APIs"
description: "Add custom properties to an API via the API Publisher or REST API and search APIs by those values."
canonical_url: https://wso2.com/api-platform/docs/api-manager/3.1.0/learn/design-api/create-api/adding-custom-properties-to-apis/
md_url: https://wso2.com/api-platform/docs/api-manager/3.1.0/learn/design-api/create-api/adding-custom-properties-to-apis.md
tags:
  - api-manager
  - learn
  - design-api
  - create-api
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-19
content_type: "how-to"
---

# Adding Custom Properties to APIs

Usually, APIs have a pre-defined set of properties such as the name, version, context, etc. However, there may be instances where you want to add specific custom properties to your API. You can do this in either of the following ways:

-   [Add custom properties via the API Publisher](#AddcustompropertiesviatheAPIPublisher)
-   [Add custom properties via the REST API](#AddcustompropertiesviatheRESTAPI)

When adding custom properties, note the following:

-   Property name should be unique.

-   Property name should not contain spaces.

-   Property name cannot be case-sensitive.

-   Property name cannot be any of the following as they are reserved keywords: provider, version, context, status, description, subcontext, doc, lcState, name, tags.

After the custom properties have been added, you can [search for APIs using custom property values](#Searchusingcustomproperties).

<a name="AddcustompropertiesviatheAPIPublisher"></a>

### Add custom properties via the API Publisher

1.  Sign in to the API Publisher as an API creator using the following URL: 
      
      `https://<localhost>:9443/publisher`

2.  [Create a new API](../../../design-api/create-api/create-a-rest-api/) or edit an existing API.

3.  Click **Properties** and click **ADD NEW PROPERTY**.

      [![Add new property menu](../../../assets/img/learn/properties-add-property.png)](../../../assets/img/learn/properties-add-property.png)

4. Enter a custom property name and value (e.g., property name: environment, property value: preprod) and click **ADD** to add it.

      [![Add new property](../../../assets/img/learn/add-new-property.png)](../../../assets/img/learn/add-new-property.png)

5.  Click **SAVE** to save the API.

<a name="AddcustompropertiesviatheRESTAPI"></a>

### Add custom properties via the REST API

Use the [existing REST API](../../../develop/product-apis/restful-apis.md) to add a new API and in order to add the API with custom properties make sure to add the following element to the request body including the relevant properties.

`"additionalProperties : {"environment": "preprod", "secured": "true"}`

<a name="Searchusingcustomproperties"></a>

### Search using custom properties

You can use the following format to search for an API using the custom properties:

`<property_name>:<property_value>        `

For example, if you want to search for the **environment** property with a specific value (e.g., preprod) in the Publisher, you can search as shown below:

[![Publisher search option](../../../assets/img/learn/search-apis-with-custom-properties.png)](../../../assets/img/learn/search-apis-with-custom-properties.png)

When you click on the name of the API in the above screen, the respective API Overview page appears. Click on the **Properties** tab to list the API properties that you added.

[![API Properties](../../../assets/img/learn/view-custom-api-properties.png)](../../../assets/img/learn/view-custom-api-properties.png)