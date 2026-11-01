---
title: "Customize the Portal Theme"
---

## Theming Developer Portal with AI for your Organization

AI-powered branding simplifies the process of customizing your organization's Developer portal. By leveraging AI Branding, you can ensure that your pages not only look great but also align perfectly with your brand's identity.

### Prerequisites

- If you're signing in to the API Platform Console for the first time, create an organization:
    1. Go to [API Platform Console](https://console.bijira.dev/) and sign in using your preferred method.
    2. Enter a unique organization name. For example, `TestingOrg`.
    3. Read and accept the privacy policy and terms of use.
    4. Click **Create**.

This creates the organization and opens the **Project Home** page of the default project created for you.

### Get into `Developer Portal` tab

Go through the below steps to get the `Developer Portal` tab.

- Close the project tab selected by default. Then the `Organization` tab will be selected.
- In the left navigation menu, click `Admin` and then click `Settings`.
- Select `Developer Portal` tab.

### Theme your Devportal with AI

Go through the following steps to customize the theme of the Devportal with AI.

1. Click on `Theme with AI`.

    ![Theming page under Developer Portal settings tab showing Theme your Devportal with AI card and Theme with AI button](/img/cloud/devportal/theming_ai_button.png)

2. Enter the website URL  you'd like to use as the basis for branding.

    ![Configure theming with AI panel showing URL input field with a sample website URL and submit arrow button](/img/cloud/devportal/ai_theme_url.png)

3. Click enter to automate branding for your organization based on the website you provided. The system will then process the website and start generating the branding theme. You can see the result in the preview section.

    ![Theme Settings panel with AI-generated blue color palette and live developer portal preview on the right](/img/cloud/devportal/devportal_preview.png)

4. If you want to save those changes as a draft you can select `Save As Draft`.
5. If it perfectly aligns with your organization's unique identity, you can click `Publish to Devportal`.

    ![Theming header bar showing Save As Draft and Publish To Developer Portal buttons with Org Level tab active](/img/cloud/devportal/publish_to_devportal.png)

6. Go to `Developer portal` to see the changes.

    ![API Platform console header showing the Developer Portal button highlighted next to the Upgrade button](/img/cloud/devportal/view_devportal.png)

    The finalized view will be as follows:

    ![Published developer portal homepage with AI-generated dark blue theme, hero banner, and feature cards](/img/cloud/devportal/finalized_preview.png)

## Customize Developer Portal Manually for your Organization

Developer portal allows you to customize the user interfaces (UIs) in organization level as well as in API level. With this you can ensure that your pages not only look great but also align perfectly with your brand's identity.

Customization takes place at two levels:

- Org Level : This functions as the default branding and applies to all APIs in an organization.
- API Level : Each API can have its own branding. This overrides the organizational level branding applied by default to the organization.

### Prerequisites

- If you're signing in to the API Platform Console for the first time, create an organization:
    1. Go to [API Platform Console](https://console.bijira.dev/) and sign in using your preferred method.
    2. Enter a unique organization name. For example, `TestingOrg`.
    3. Read and accept the privacy policy and terms of use.
    4. Click **Create**.

This creates the organization and opens the **Project Home** page of the default project created for you.

### Get into `Developer Portal` tab

Go through the below steps to get the `Developer Portal` tab.

- Close the project tab selected by default. Then the `Organization` tab will be selected.
- In the left navigation menu, click `Admin` and then click `Settings`.
- Select `Developer Portal` tab.

### Theme your Devportal in Org Level

Go through the following steps to customize the theme of the Devportal in the organization level.

#### Theme Settings

1. Select `Org Level` tab.
2. Select `Theme Settings` tab. Here, you can manage and customize theme colors for your organization.
3. Expand the **Color Palette** section to see the available color fields.
4. Click on each color field to open the color selection interface and choose your desired colors.
5. The preview panel on the right will show real-time changes as you modify the colors.

    ![Org Level Theme Settings showing Color Palette fields for Background, Primary, Secondary, Text, and Gradient with live portal preview](/img/cloud/devportal/customized_theming.png)

4. Expand the dropdown for `Typography` and select the font (e.g., Arial Black).

    ![Theme Settings page with Typography section expanded and Arial Black selected in the Font dropdown](/img/cloud/devportal/customized_font.png)

5. If you want to save these changes as a draft, select  `Save As Draft`.

6. If it perfectly aligns with your organization's unique identity, click `Publish To Developer Portal`.

    ![Theming header bar showing Save As Draft and Publish To Developer Portal buttons with Org Level tab active](/img/cloud/devportal/publish_to_devportal.png)

7. Go to `Developer Portal` to see the changes.

    ![API Platform console header showing the Developer Portal button highlighted next to the Upgrade button](/img/cloud/devportal/view_devportal.png)

#### HTML

1. Select `HTML` tab. You can edit the HTML structure of pages.
2. Paste the below HTML code for `hero-section`.

    ``` html
    <section class="hero-section">
        <div class="container-fluid">
            <div class="hero-content hero">
                <div class="row h-100">
                    
                    <div class="col-xl-9 col-lg-6 col-md-12 text-lg-start d-flex flex-column justify-content-center">
                        <div class="hero-left-content">
                            <h1 class="hero-title">
                                Empower your development with our <span class="span-highlight"> APIs </span>
                                to craft intuitive and robust applications
                            </h1>
                            <p class="hero-description">
                                Use our APIs to build amazing enterprise and consumer applications. Browse our API catalog,
                                subscribe, and get going in minutes.
                            </p>
                            <div class="hero-buttons d-flex gap-3">
                                <a href="{{baseUrl}}/apis" class="common-btn-primary common-btn-secondary">Browse our APIs →</a>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-xl-3 col-lg-6 col-12 d-flex justify-content-end align-items-end">
                        <div class="hero-image-container">
                            <div id="heroImage" class="me-0">
                                <img class="hero-banner-image d-none" src="https://raw.githubusercontent.com/wso2/docs-bijira/refs/heads/main/en/devportal-theming/hero.svg">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    ```

3. The changes can be seen in the preview section.

    ![HTML editor with hero section code and preview showing sample heading and Browse our APIs button](/img/cloud/devportal/change_with_html.png)

#### CSS

1. Select `CSS` tab. You can modify CSS styles to adjust the appearance of the pages.
2. Paste the below code for `.hero-title`.

    ```css
    .hero-title {
        font-size: 2rem;
        font-weight: 1000;
        color: var(--primary-dark-color);
        margin-bottom: 5rem;
        line-height: 2;
    }
    ```

3. The changes can be seen in the preview section.

    ![CSS editor with hero-title rule highlighted and preview showing large bold Empower your development heading](/img/cloud/devportal/change_with_css.png)

#### Referenced CSS

This section shows the reference for the main CSS from the theme settings you assigned at the beginning.

![Referenced CSS tab showing read-only stylesheet with imported CSS files and CSS variable declarations](/img/cloud/devportal/referenced_css.png)

#### Assets

01. The Logo of the devportal can be changed by clicking `Choosing File` under Devportal Logo.

    ![Assets tab showing Devportal Logo section with Choose File button and current logo thumbnail in preview](/img/cloud/devportal/devportal_logo_upload.png)

02. After adding the image you can see the finalized changes in the preview.

    ![Assets tab showing uploaded flower logo thumbnail and portal preview with new logo in the header](/img/cloud/devportal/uploaded_logo.png)

## Customize Developer Portal Manually for your Organization

Developer portal allows you to customize the user interfaces (UIs) in organization level as well as in API level. With this you can ensure that your pages not only look great but also align perfectly with your brand's identity.

Customization takes place at two levels:

- Org Level : This functions as the default branding and applies to all APIs in an organization.
- API Level : Each API can have its own branding. This overrides the organizational level branding applied by default to the organization.

### Prerequisites

- If you're signing in to the API Platform Console for the first time, create an organization:
    1. Go to [API Platform Console](https://console.bijira.dev/) and sign in using your preferred method.
    2. Enter a unique organization name. For example, `TestingOrg`.
    3. Read and accept the privacy policy and terms of use.
    4. Click **Create**.

This creates the organization and opens the **Project Home** page of the default project created for you.

### Get into `Developer Portal` tab

Go through the below steps to get the `Developer Portal` tab.

- Close the project tab selected by default. Then the `Organization` tab will be selected.
- In the left navigation menu, click `Admin` and then click `Settings`.
- Select `Developer Portal` tab.

### Theme your Devportal in API Level

Go through the following steps to customize the theme of the Devportal in the API level.

1. Select `API Level` tab.

#### HTML

The `HTML` tab will show the read only view reference to the HTML structure of APIs in your organization. To edit the content of this page go to [Customize API Landing Page content](#customize-api-landing-page-content).

#### Org level CSS

This tab will show the reference to the main CSS from the organizational level theme settings.

#### CSS

Here you can adjust appearance of the API Overview page by changing the css styles.

![API Level CSS editor showing stylesheet rules alongside a developer portal preview panel](/img/cloud/devportal/api-level-css.png)

1. Replace the following sections in the CSS, You can see the changes in the preview.

    ```CSS
    .key-benefit-item h3 {
    font-size: 2rem;
    font-weight: 600;
    color: var(--main-text-color);
    margin-bottom: 0.625rem;
    }

    .key-benefit-item p {
    font-size: 0.75rem;
    color: var(--primary-main-color);
    margin-bottom: 1.25rem;
    line-height: 2;
    }

    ```

    ![CSS editor with highlighted key-benefit-item rules and preview showing updated heading and paragraph styles](/img/cloud/devportal/api-level-css-preview.png)

2. Click **Publish to Developer Portal** to publish the CSS changes.

#### Customize API Landing Page content

To customize the content of an API go through the following steps.

1. Select a **Project** in your organization.
2. Select an **API** to do the customization.

    ![Breadcrumb navigation showing Organization org01, Project Default, and API Proxies Reading List API selected](/img/cloud/devportal/select-an-api.png)

3. Click **Documents** under **Develop** from the sidebar.
4. Go to **API Landing Page** tab.
5. Select **HTML** tab. 
6. Customize the content by changing the html given. You can see the finalized details in the preview.

:::info[Try This in Preview]

Here is a sample HTML code. You can paste it and see the changes in the preview.

```html
<div class="col-lg-11 container-fluid api-overview" name="Overview">
    <div class="row api-overview-content">
        <div class="row text-start">
            <h1 class="overview-title">Overview</h1>
        </div>
        <div class="col-lg-8 api-content-text">
            <div>
                <p class="intro-text-des">
                    The Reading List API enables developers to integrate reading list functionality into their applications. This includes operations such as adding, updating, deleting, and retrieving books or articles in a user's personal list. The API supports authentication, tagging, sorting, and filtering to help users manage their reading goals effectively.
                </p>
            </div>
            <div>
                <h5 class="section-title">Key Capabilities</h5>
            </div>
            <ul class="requirement-list">
                <li><span class="checkmark"><i class="bi bi-check-circle-fill"></i></span> Create and manage personalized reading lists for each user.</li>
                <li><span class="checkmark"><i class="bi bi-check-circle-fill"></i></span> Add metadata such as title, author, genre, and reading status.</li>
                <li><span class="checkmark"><i class="bi bi-check-circle-fill"></i></span> Mark items as "read", "currently reading", or "to-read".</li>
                <li><span class="checkmark"><i class="bi bi-check-circle-fill"></i></span> Search and filter items by keywords, tags, or status.</li>
                <li><span class="checkmark"><i class="bi bi-check-circle-fill"></i></span> RESTful design with predictable URL patterns and JSON responses.</li>
            </ul>
        </div>
        <div class="col-lg-4 api-sidebar">
            <div>
                <h5 class="section-title">Use this API to:</h5>
            </div>
            <ul class="api-list">
                <li>Authenticate users and associate them with unique reading lists.</li>
                <li>Add or remove books and articles from a list using POST/DELETE methods.</li>
                <li>Fetch full or filtered reading lists using GET queries with parameters.</li>
                <li>Update the read status, notes, or tags of a reading item.</li>
            </ul>
            <div>
                <button type="button" class="common-btn-outlined">Explore API Docs</button>
            </div>
        </div>
    </div>
</div>
```

![HTML editor with API landing page code and preview showing Overview, Key Capabilities, and Use this API sections](/img/cloud/devportal/api-level-content-changes.png)
:::

## Developer Portal Mode

API Platform's developer portal can be configured in different modes based on your requirements.

You can find this under the **Configuration** tab in the **Developer Portal** section in your organization's settings pane.

![Developer Portal Mode configuration panel with API Portal, MCP Hub, and API and MCP Portal radio button options](/img/cloud/devportal/devportal-mode.png)

Devportal configuration has 3 modes.

1. **API Portal** - In this mode, only API Proxies will be shown in the Devportal. Suitable if you have nothing to do with MCP.
2. **MCP Hub** - In this mode, only MCP Servers will be shown in the Devportal. Suitable if you are using API Platform for MCP related use cases.
3. **API & MCP Portal** - This is the **default** mode. Both API Proxies and MCP Servers will be shown in the Devportal
