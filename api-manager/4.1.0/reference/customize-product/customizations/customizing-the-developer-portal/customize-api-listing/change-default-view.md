---
title: "Change default view"
description: "Switch the Developer Portal API listing from the default grid view to a table view via defaultTheme.js."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/reference/customize-product/customizations/customizing-the-developer-portal/customize-api-listing/change-default-view/
md_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/reference/customize-product/customizations/customizing-the-developer-portal/customize-api-listing/change-default-view.md
tags:
  - api-manager
  - reference
  - customize-product
  - customizations
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-30
content_type: "how-to"
---

# Change Default View

By default the API Listing view is a grid view. You can follow the steps below to change the default API listing to a table view by configuring `defaultTheme.js`.

The `defaultTheme.js` file has all the parameters defining the look and feel of the developer portal. To learn more about `defaultTheme.js` refer [here](../overriding-developer-portal-theme.md#global-theming).

1. Open the `<API-M_HOME>/repository/deployment/server/jaggeryapps/devportal/site/public/theme/defaultTheme.js` file in a text editor.

    You can add the following configuration to the `defaultTheme.js` to change the default API listing to a table view.

    ```js
    const Configurations = {
        custom: {
            defaultApiView: 'list',
        },
    };
    ```

    Changes done in the `defaultTheme.js` will be reflected directly in the developer portal. (It is not required to restart the server or rebuild the source code) 

2. Refresh the Developer Portal to view the changes.

    ![Default view](../../../../../assets/img/learn/change-default-view.png)