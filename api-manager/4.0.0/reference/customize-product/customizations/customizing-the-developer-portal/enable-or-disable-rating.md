---
title: "Enable or disable rating"
description: "Enable or disable the star rating shown on the Developer Portal by configuring the defaultTheme.js file."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.0.0/reference/customize-product/customizations/customizing-the-developer-portal/enable-or-disable-rating/
md_url: https://wso2.com/api-platform/docs/api-manager/4.0.0/reference/customize-product/customizations/customizing-the-developer-portal/enable-or-disable-rating.md
tags:
  - api-manager
  - reference
  - customize-product
  - customizations
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "how-to"
---

# Enable or Disable Rating

The star rating is enabled by default. You can disable the star rating by configuring the `defaultTheme.js` file.

The `defaultTheme.js` file has all the parameters defining the look and feel of the developer portal. To learn more about `defaultTheme.js` refer [here](overriding-developer-portal-theme.md#global-theming).

1. Open the `<API-M_HOME>/repository/deployment/server/jaggeryapps/devportal/site/public/theme/defaultTheme.js` file in a text editor and set the `themes.light.custom.social.showRating` attribute to `false` if you want to disable the star rating.

    ```js
    const Configurations = {
        custom: {
            social: {
                showRating: false,
            },
        },
    };
    ```

2. Refresh the Developer Portal to view the changes.