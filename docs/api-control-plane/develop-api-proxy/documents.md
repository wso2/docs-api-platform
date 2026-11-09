---
title: "Documents"
description: "Add guides, samples, and support resources to an API proxy so consumers can understand and use it in the API Portal and AI Hub."
---

When API consumers browse APIs in the API Portal and AI Hub, they need more than the API name and version to decide whether to use an API. Documents let you provide that information, such as,

- A brief description of the API.
- How to invoke the API.
- The limitations or restrictions of the API.
- Version history.

You write documents in Markdown and add them to the API before you publish it. You can add as many documents as you need.

## Create a Document

To add a document to an API, follow the steps given below.

1. Sign in to the [API Control Plane](https://console.bijira.dev/).
2. In the header, select the project from the **Projects** list and the API from the **APIs** list.
3. In the left navigation menu, click **Develop**, then click **Documents**.
4. Click **Create Document**.
5. On the **Create Document** page, provide the following details.

    - **Document type:** Select the type of document, for example, **How To**.
    - **Name:** Enter a name for the document, for example, `Getting started`.
    - **Content:** Write the document content in Markdown.

    To choose how the editor is displayed, select **Source** to show only the Markdown, **Split** to show the Markdown and a preview side by side, or **Preview** to show only the rendered document.

    ![Create Document page with the How To document type, a document name, and Markdown content shown side by side with its preview in Split view](/img/cloud/develop-api-proxy/documents/create-document.png)

6. Click **Create**.

The document appears under **All documents**, grouped by document type. Click a document to view its content.

![Documents page listing Reading List API Doc under How To in All documents, with the rendered document and edit and delete icons on the right](/img/cloud/develop-api-proxy/documents/documents-list.png)

To add more documents, click **Create Document** at the top of the page.

## Edit or Delete a Document

1. On the **Documents** page, under **All documents**, click the document.
2. Do one of the following.

    - To edit the document, click the edit (pencil) icon, make your changes, and save them.
    - To delete the document, click the delete (trash) icon and confirm the deletion.
