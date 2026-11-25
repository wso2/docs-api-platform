---
title: "Definition"
pagination_label: "API Definition"
description: "View, edit, import, and download the OpenAPI definition of a REST API proxy, and add or delete its resources."
---

The definition of a REST API proxy is its OpenAPI document. It lists the resources that the API exposes, where each resource is an HTTP method and a path, such as `GET /books/{id}`.

On the **Definition** page, you can view the definition as YAML or JSON, add and delete resources, edit the definition directly, replace it with another contract, and download it.

## Open the Definition Page

1. Sign in to the API Control Plane.
2. In the header, select the project from the **Projects** list and the API from the **APIs** list.
3. In the left navigation menu, click **Develop**, then click **Definition**.

The definition opens as source, in a read-only editor.

- To switch the source between YAML and JSON, select **YAML** or **JSON**.
- To see the resources as a list instead of source, click **View Resources**. To go back to the source, click **View Definition**.

## Add a Resource

1. Click **View Resources**.
2. Click **Add resource**.
3. In the **Add Resource** dialog box, enter the following details, and click **Add**.

    | Field | Description |
    | --- | --- |
    | **Method** | The HTTP method, such as `GET` or `POST`. |
    | **Path** | The resource path. Write a path parameter in curly braces, for example, `/orders/{id}/cancel`. |
    | **Description** | Optional. A short description of the resource. |

4. Click **Save**, and in the **Update API** dialog box, click **Save** again.

## Delete a Resource

1. Click **View Resources**.
2. Find the resource. You can search by path, or filter by HTTP method.
3. Click the delete icon next to the resource.
4. Click **Save**, and in the **Update API** dialog box, click **Save** again.

## Edit the Definition

1. In the source view, click **Edit**.
2. Change the definition in the editor.
3. Click **Save**. The console validates the definition first. If the definition isn't a valid OpenAPI document, the console lists the errors instead of saving it.
4. In the **Update API** dialog box, click **Save**.

To discard your changes before you save, click **Reset**.

## Import a Definition

Importing replaces the whole definition with another OpenAPI 3.x contract. The console doesn't accept Swagger 2.x contracts.

1. Click the **Import Definition** (upload) icon.
2. In the **Update OpenAPI Definition** dialog box, do one of the following:

    - Paste the contract URL, and click **Fetch specification**.
    - Click **Upload Specification**, and select a `.json`, `.yaml`, or `.yml` file.

3. Review the imported definition in the editor, and click **Save**.
4. In the **Update API** dialog box, click **Save**.

## Download the Definition

1. Select **YAML** or **JSON** for the format you want.
2. Click the **Download Definition** icon.

The console downloads the saved definition as `api_definition.yaml` or `api_definition.json`. Unsaved changes aren't included.

## Apply the Changes to a Gateway

Saving the definition changes the API in the API Control Plane only. To apply the changes to a gateway, deploy the API again. See [Deploy an API](../deploy-api-proxy/overview.md).
