---
title: "Arazzo Visualizer quick start guide"
description: "Install Arazzo Visualizer for VS Code, open a sample Arazzo workflow as a diagram, and run it against a live API with Try with curl."
canonical_url: https://wso2.com/api-platform/docs/tools/vscode-arazzo-visualizer/quick-start-guide/
md_url: https://wso2.com/api-platform/docs/tools/vscode-arazzo-visualizer/quick-start-guide.md
tags:
  - tools
  - vscode
  - arazzo
  - quick-start
author: WSO2 API Platform Documentation Team
last_updated: 2026-10-28
content_type: "quickstart"
---

# Arazzo Visualizer quick start guide

This guide shows you how to visualize and run an [Arazzo](https://spec.openapis.org/arazzo/latest.html) workflow in VS Code. You install Arazzo Visualizer, create a two-step workflow against a public sample API, view it as a diagram, and run it with **Try with curl**.

## Prerequisites

- [Visual Studio Code](https://code.visualstudio.com/) 1.100 or later.
- Internet access, so the workflow can reach the sample Reading List API and its OpenAPI definition.

## Step 1: Install the extension

Install [Arazzo Visualizer](https://marketplace.visualstudio.com/items?itemName=WSO2.arazzo-visualizer) from the VS Code Marketplace. You can also install it from the command line:

```bash
code --install-extension WSO2.arazzo-visualizer
```

## Step 2: Create a sample workflow

In a new folder, create a file named `reading-list.arazzo.yaml` with the following content. The extension recognizes files that end in `.arazzo.yaml`, `.arazzo.yml`, or `.arazzo.json`.

```yaml
arazzo: 1.0.1
info:
  title: Reading list workflow
  version: 1.0.0
  description: Lists the books in the reading list, then fetches the first book by its ID.
sourceDescriptions:
  - name: readingListApi
    url: https://raw.githubusercontent.com/wso2/bijira-samples/a912b603983909644121ceae1c3bb110bd5ec0a4/reading-list-api/openapi.yaml
    type: openapi
workflows:
  - workflowId: getFirstBook
    summary: Get the first book in the reading list
    steps:
      - stepId: listBooks
        operationId: listBooks
        successCriteria:
          - condition: $statusCode == 200
        outputs:
          firstBookId: $response.body#/books/0/id
      - stepId: getBook
        operationId: getBookById
        parameters:
          - name: id
            in: path
            value: $steps.listBooks.outputs.firstBookId
        successCriteria:
          - condition: $statusCode == 200
        outputs:
          title: $response.body#/title
          author: $response.body#/author
    outputs:
      title: $steps.getBook.outputs.title
      author: $steps.getBook.outputs.author
```

The workflow calls the `listBooks` operation, passes the first book's ID to the `getBookById` operation, and returns that book's title and author.

## Step 3: Open the visualizer

With `reading-list.arazzo.yaml` open in the editor, click the **Open Arazzo Visualizer** icon in the editor toolbar. You can also open the **Command Palette** (<kbd>Ctrl+Shift+P</kbd> on Windows and Linux, <kbd>Cmd+Shift+P</kbd> on macOS) and run **ArazzoDesigner: Open Arazzo Visualizer**.

The visualizer opens beside the file and shows the `getFirstBook` workflow with its two steps. Select a step to see its request, outputs, and success criteria. When you edit the file, the diagram updates.

## Step 4: Run the workflow

1. In the editor, click **▶ Try with curl** above the `- workflowId: getFirstBook` line.
2. When VS Code asks whether to start the Arazzo server for this file, click **Yes**.

The extension sends a `curl` request to the local Arazzo server in a terminal named **Arazzo**. The response shows the workflow's outputs:

```json
{"status":"success","outputs":{"author":"F. Scott Fitzgerald","title":"The Great Gatsby"}}
```

If a workflow declares inputs, a panel opens so you can fill them in before it runs.

## Next steps

- To learn about the visualizer, Copilot support, and **Try with AI**, see the [Arazzo Visualizer overview](getting-started.md).
- To turn an Arazzo workflow into an MCP server that AI agents can call, see the [Arazzo MCP Generator CLI quick start guide](../arazzo-mcp-gen-cli/quick-start-guide.md).
