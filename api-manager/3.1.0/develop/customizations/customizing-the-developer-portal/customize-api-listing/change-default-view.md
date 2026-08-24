---
title: "Change default view"
description: "Switch the Developer Portal API listing from the default grid view to a table view via defaultTheme.js."
canonical_url: https://wso2.com/api-platform/docs/api-manager/3.1.0/develop/customizations/customizing-the-developer-portal/customize-api-listing/change-default-view/
md_url: https://wso2.com/api-platform/docs/api-manager/3.1.0/develop/customizations/customizing-the-developer-portal/customize-api-listing/change-default-view.md
tags:
  - api-manager
  - develop
  - customizations
  - customizing-the-developer-portal
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-27
content_type: "how-to"
---

# Change Default View

By default the API Listing view is a grid view. 

Open `<API-M_HOME>/repository/deployment/server/jaggeryapps/devportal/site/public/theme/defaultTheme.js` file in a text editor.

The following configuration will change the default API listing to a table view.

```js
const Configurations = {
    custom: {
        defaultApiView: 'list',
    },
};
```



Changes done in the defaultTheme.js will be reflected directly in the devportal. ( It's not required to restart the server or rebuild the source code)

![../../../../assets/img/learn/change-default-view.png](../../../../assets/img/learn/change-default-view.png)
