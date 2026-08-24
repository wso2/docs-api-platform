---
title: "Enable or disable footer"
description: "Hide or show the Developer Portal footer through userTheme.json, and set the footer text, links, and other available attributes."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.6.0/reference/customize-product/customizations/customizing-the-developer-portal/enable-or-disable-footer/
md_url: https://wso2.com/api-platform/docs/api-manager/4.6.0/reference/customize-product/customizations/customizing-the-developer-portal/enable-or-disable-footer.md
tags:
  - api-manager
  - reference
  - customize-product
  - customizations
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-23
content_type: "how-to"
---

# Enable or Disable Footer

The footer section is visible by default. You can hide the footer by configuring the `userTheme.json` file.

The `defaultTheme.js` file has all the parameters defining the look and feel of the developer portal. To learn more about `defaultTheme.js` refer [here](overriding-developer-portal-theme.md#global-theming).

1. Open the `<API-M_HOME>/repository/deployment/server/webapps/devportal/site/public/theme/userTheme.json` file in a text editor and set the `custom.footer.active` attribute as `false` to hide the footer.

2. Refresh the Developer Portal to view the changes.

### The following attributes are available for the footer

```json
{
    "custom": {
        "footer": {
            "dangerMode": false,
            "active": true,
            "footerHTML": "",
            "text": "",
            "background": "#000",
            "color": "#fff",
            "height": 50
        }
    }
}

```

| Option | type | Description |
| ------ | -- | ----------- |
| dangerMode | boolean | When true, injects raw HTML via `dangerouslySetInnerHTML` and sets `contentEditable` (unsafe if HTML isn't sanitized). Default: false. |
| active | boolean | Footer is visible if true (default). Hidden if false. |
| footerHTML | string | HTML to render in the footer; overrides `text`. Normally rendered via `HTMLRender`; with `dangerMode` it is injected raw and editable. Leave empty to use `text` or the default. |
| text | string | Leave empty to show the default WSO2 text. Provide custom text to display your own content. |
| background | string | Set the background color of the footer (CSS color value, e.g., `#000`). |
| color | string | Set the font color for the footer text (CSS color value, e.g., `#fff`). |
| height | integer | Height of the footer in pixels. Default: 50. |

