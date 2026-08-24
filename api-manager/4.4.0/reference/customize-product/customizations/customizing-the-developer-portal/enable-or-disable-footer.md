---
title: "Enable or Disable the Developer Portal Footer"
description: "Show or hide the Developer Portal footer and customize its HTML, text, background, color, and height by editing the userTheme.json file."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.4.0/reference/customize-product/customizations/customizing-the-developer-portal/enable-or-disable-footer/
md_url: https://wso2.com/api-platform/docs/api-manager/4.4.0/reference/customize-product/customizations/customizing-the-developer-portal/enable-or-disable-footer.md
tags:
  - api-manager
  - developer-portal
  - customization
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-15
content_type: "how-to"
---

# Enable or Disable Footer

The footer section is visible by default. You can hide the footer by configuring the `userTheme.js` file.

The `userTheme.js` file has all the parameters defining the look and feel of the developer portal. To learn more about `userTheme.js` refer [here](../../../../reference/customize-product/customizations/customizing-the-developer-portal/overriding-developer-portal-theme.md#global-theming).

1. Open the `<API-M_HOME>/repository/deployment/server/webapps/devportal/site/public/theme/userTheme.js` file in a text editor and set the `themes.light.custom.footer.active` attribute as `false` to hide the footer.

2. Refresh the Developer Portal to view the changes.

### The following attributes are available for the footer

```js
const Configurations = {
    custom: {
        footer: {
            active: true,
            text: '',
            background: '#000',
            color: '#fff',
        },
    },
};
```

| Option | type | Description |
| ------ | -- | ----------- |
| active | boolean | Footer is visible if true (default). Hidden if false. |
| text | string | Leave empty to show the default WSO2 Text. Provide custom text to display your own thing. |
| background | string | Set the background color of the footer |
| color | string | Set the font color for the footer text |

