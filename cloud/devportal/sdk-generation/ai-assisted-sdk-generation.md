---
title: "Generate an SDK with AI assistance"
description: "Generate a custom SDK and sample application code from your subscribed APIs using AI-assisted SDK generation in the Developer Portal."
canonical_url: https://wso2.com/api-platform/docs/cloud/devportal/sdk-generation/ai-assisted-sdk-generation/
md_url: https://wso2.com/api-platform/docs/cloud/devportal/sdk-generation/ai-assisted-sdk-generation.md
tags:
  - cloud
  - devportal
  - sdk-generation
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-22
content_type: "how-to"
---

# AI-Assisted SDK Generation

AI-assisted SDK generation creates custom SDKs and sample application code based on your selected APIs. Instead of manually integrating multiple SDKs, you generate a single SDK with working code examples tailored to your specific requirements.

## What is AI-assisted SDK Generation?

Building applications with multiple APIs typically requires you to:

- Download and manage multiple SDKs
- Understand how the APIs work together
- Write integration code from scratch

AI-assisted SDK generation streamlines this process by:

- Creating a single SDK from your selected APIs
- Generating application code based on your use case
- Providing you a ready starting point for development

This lets you focus on business logic rather than setup and integration.

## Prerequisites

Before proceeding, ensure you have [Created an Application](../manage-applications/create-an-application.md) and [Subscribed to an API](../manage-subscriptions/subscribe-to-an-api.md) to generate an SDK.

!!! tip
    Subscribe to multiple APIs to create more comprehensive SDKs.

## Generate an SDK

Follow these steps to generate a custom SDK and sample application code.

### Step 1: Select APIs for SDK Generation

1. Navigate to the [API Platform Developer Portal](https://devportal.bijira.dev) and sign in.
2. Click on **Applications** in the Developer Portal sidebar.
3. Click on the application for which you want to generate the custom SDK.
4. Choose which subscribed APIs to include in your SDK by clicking on the checkbox.

    !!! note
        The **Generate SDK** button activates when you select at least one API.

    ![Subscribed API Proxies table with two APIs checked and Generate SDK button highlighted](../../../assets/img/devportal/ai_sdk_gen_button.png)

### Step 2: Generate SDK

1. Click **Generate SDK** to open the SDK generation panel.

    ![Generate SDK side panel with Java and Javascript language options and SDK Requirement text field](../../../assets/img/devportal/sdk_drawer.png)

2. Select your preferred programming language from the dropdown (for example, Java).
3. Describe your use case to help the AI generate relevant code.

    **Example:**
    > Create an application that allows users to view and manage their orders using the Order API and the User API.

4. Click the **Arrow** button to start generation.
5. The system generates your custom SDK and sample code. When complete, it downloads a ZIP file containing both the SDK and sample application code.

![Generate SDK panel showing Generating SDK progress bar at 40 percent with in-progress status message](../../../assets/img/devportal/sdk_generation_in_progress.png)

## Important Notes

- AI services require valid configuration and active subscriptions.
- Generated code serves as a starting point and may need customization.
- This uses **Anthropic Claude 3.5 Sonnet (20241022)** for application code generation.
