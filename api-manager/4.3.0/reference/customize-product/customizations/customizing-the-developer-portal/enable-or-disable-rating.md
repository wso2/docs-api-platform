---
title: "Enable or disable rating"
description: "Disable the star rating shown on the Developer Portal by setting the showRating attribute in userTheme.js."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.3.0/reference/customize-product/customizations/customizing-the-developer-portal/enable-or-disable-rating/
md_url: https://wso2.com/api-platform/docs/api-manager/4.3.0/reference/customize-product/customizations/customizing-the-developer-portal/enable-or-disable-rating.md
tags:
  - api-manager
  - reference
  - customize-product
  - customizations
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-17
content_type: "how-to"
---

# Enable or Disable Rating

The star rating is enabled by default. You can disable the star rating by configuring the `userTheme.js` file.

The `userTheme.js` file has all the parameters defining the look and feel of the developer portal. To learn more about `userTheme.js` refer [here](../../../../reference/customize-product/customizations/customizing-the-developer-portal/overriding-developer-portal-theme.md#global-theming).

1. Open the `<API-M_HOME>/repository/deployment/server/webapps/devportal/site/public/theme/userTheme.js` file in a text editor and set the `themes.light.custom.social.showRating` attribute to `false` if you want to disable the star rating.

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