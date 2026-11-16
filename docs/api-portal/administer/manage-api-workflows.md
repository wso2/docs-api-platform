---
title: "API workflows"
description: "Author an API workflow as an Arazzo specification or Markdown, generate its agent prompt, and publish it to a view."
---

**API Workflows** is where you define multi-step API use cases for one [view](./manage-views.md). A workflow tells AI agents how the APIs work together, in order. This page covers the admin side. For what consumers and agents then see, read [API Workflows](../discover/api-workflows.md).

1. Sign in to the API Portal and AI Hub as an administrator.
2. Open **Settings**.
3. Under **AI & DISCOVERY**, select **API Workflows**.

Use the view selector to choose the view. Workflows belong to that view. The list columns are **Name**, **Status**, and **Type**. Status is **Draft** or **Published**. Type is **Arazzo** or **Markdown**. When the list is empty, the page says to click **Add workflow** to get started.

Each workflow also offers actions to view the agent prompt when the workflow is visible to agents, to edit it, and to delete it.

## Add a workflow

Click **Add workflow**. The wizard has three steps, with a live preview beside each one.

### Basic information

| Field | Description |
|---|---|
| **Name** | Required. Up to 120 characters. |
| **Handle** | A lowercase identifier used in URLs. It is generated from the name, and you can edit it before the workflow is saved. It cannot be changed later. |
| **Description** | Required. This is what agents read when deciding whether the workflow fits their task, so describe the goal, not the mechanics. |
| **Agent visibility** | **Visible to agents** or **Hidden from agents**. |

The preview shows the name and description as they will appear in agent discovery.

### Define the workflow

Choose one of two ways to write the workflow.

**Upload file** takes a workflow you already have. An Arazzo specification is a `.yaml`, `.yml`, or `.json` file. A natural-language workflow is a `.md` file. After upload, an Arazzo file lists its source descriptions, and a Markdown file shows a summary.

**From template** uses the APIs that take part in the workflow and generates a starter Arazzo specification from their specifications. Filter the API list by name, type, or description, or narrow it to selected, AI Ready, or AI Restricted APIs. MCP servers appear in this list alongside APIs.

The definition editor has:

- A **Format** toggle between **Arazzo Spec** (`workflow.arazzo.yaml`) and **Markdown** (`workflow.md`)
- **Open in Claude**, **Download .arazzo.yaml**, and **Copy Prompt**, for refining a generated template outside the portal. All three need at least one API selected
- An **Upload** control to bring an edited file back in

:::tip

Source descriptions are what let an agent find each API's specification while following the workflow. Generating from a template fills them in with the specifications of APIs published in this portal. A hand-written Arazzo file has to declare them itself.

:::

### Agent prompt

The agent prompt is generated from the workflow, not written from scratch.

- **Regenerate** rebuilds the prompt after you change the definition.
- Edit the text to adjust the generated wording.
- **Copy prompt** puts it on the clipboard.

The preview shows the Markdown file agents will fetch, plus a readiness checklist for the name and description, the workflow definition, and the agent prompt.

If the workflow is hidden from agents, this step says so and links back to the visibility setting.

## Publish or save as a draft

**Save as Draft** keeps the workflow hidden from consumers. **Publish Flow** makes it available in its view immediately.

A draft appears nowhere outside this panel: not in the portal gallery, not in `llms.txt`, and not in the workflow index. To unpublish, open the workflow and save it as a draft again. There is no separate unpublish action.

## Control visibility

A workflow has one visibility setting, plus its publication status.

| Status | Agent visibility | In the portal gallery | In `llms.txt` and the agent endpoints |
|---|---|---|---|
| Published | Visible | Yes | Yes |
| Published | Hidden | Yes | No |
| Draft | Either | No | No |

Hiding a workflow from agents ships it to developers while its automated execution is still being validated. Publishing it makes it visible in the gallery for that view. There is no separate control for hiding a published workflow from people.

:::note

**Portal is AI-discoverable** overrides this. While it is off, no workflow reaches an agent, regardless of its own setting. See [LLM Instructions](./llm-instructions.md).

:::

## Edit and delete

Open a workflow to change it. The handle stays fixed. Everything else can change, including the content type: you can replace an Arazzo definition with Markdown, or the reverse.

Delete removes the workflow from the gallery and from every agent-facing endpoint.

## Related

- [API Workflows](../discover/api-workflows.md)
- [LLM Instructions](./llm-instructions.md)
- [AI Agent Discovery](../discover/ai-agent-discovery.md)
