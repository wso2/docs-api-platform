---
title: "Get started with API Designer for VS Code"
description: "Install the API Designer VS Code extension and use AI-assisted editing to design and validate OpenAPI specifications."
canonical_url: https://wso2.com/api-platform/docs/tools/vscode-api-design/getting-started/
md_url: https://wso2.com/api-platform/docs/tools/vscode-api-design/getting-started.md
tags:
  - tools
  - vscode
  - api-design
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-23
content_type: "quickstart"
---

# API Designer

API Designer is a Visual Studio Code extension for building and improving OpenAPI specifications. It helps you use AI to design APIs faster, assess AI readiness, and fix governance issues.

## What you can do

- Design APIs with **Github Copilot** using the built-in **API Design Skill**, with guided recommendations and faster fixes.
- Design and edit OpenAPI specs visually inside VS Code with GitHub Copilot Assistance
- Validate APIs against governance and best-practice rulesets
- Analyze **AI readiness** and identify improvement areas

## Prerequisites

- Visual Studio Code (compatible with extension engine requirement `^1.100.0`).
- GitHub Copilot (optional, recommended for AI-assisted workflows).

## Quick start

1. Install API Designer from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=WSO2.api-designer).
2. Open your OpenAPI file (`.yaml` or `.json`), or create one with GitHub Copilot using the bundled `api-design` skill.
3. Open API Designer. You can open it in any of these ways:

    - CodeLens in the file: Open in API Designer
    - Editor title bar: Open in API Designer
    - Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`): API Designer: Open in API Designer
    - Open-file notification (when `apiDesigner.notifyOnOpen` is enabled)

    ![VS Code editor open on a YAML file with CodeLens link at top, a notification prompt at bottom-right, and callout arrows labeling CodeLens and Notification entry points](./images/options.png)

4. Use AI-assisted editing to improve operations, descriptions, and examples in your spec.
   ![API Designer Design view for Order Management API showing AI Readiness, Security, and REST Compliance score cards, paths list, and Edit with AI button](./images/design-view.png)

5. Open report cards and review AI readiness and governance findings.
   ![AI Readiness full report for Leave Management API showing 78% score, 33/64 passed checks, 19 affected endpoints, 20 errors, 293 warnings, and AI readiness breakdown by dimension](./images/analyze-view.png)

## Next steps

- Learn how to create and refine your specification in [Design APIs using API Designer](./design-apis.md).
- Learn how report cards, rulesets, and issue triage work in [Govern APIs using API Designer](./govern-apis.md).
- Follow the complete workflow in [End-to-end tutorial](./end-to-end-tutorial.md).