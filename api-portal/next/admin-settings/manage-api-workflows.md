---
title: "Manage API workflows in the API Portal & MCP Hub"
description: "Author an API workflow as an Arazzo spec or Markdown, generate its agent prompt, and publish it to a view."
canonical_url: https://wso2.com/api-platform/docs/api-portal/admin-settings/manage-api-workflows/
md_url: https://wso2.com/api-platform/docs/api-portal/admin-settings/manage-api-workflows.md
tags:
  - cloud
  - api-portal
  - api-workflows
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-31
content_type: "how-to"
---

# Manage API workflows

As a portal admin, you author API workflows, generate the prompt that lets AI agents execute them, and publish them to a view. This page covers the admin side; for what consumers and agents then see, read [API Workflows](../api-workflows.md).

## Open the workflows panel

Go to **Settings** and select **API Workflows** under **AI & DISCOVERY**. The panel lists every workflow in the selected view—use the view selector above the list to switch views, since workflows are scoped to one view.

Each card shows:

- A status dot and label: **DRAFT** or **PUBLISHED**
- A content type badge: **ARAZZO** or **MD**
- The name and description
- Hover actions: view the agent prompt (only when the workflow is agent-visible), edit, and delete

Click **Create** to open the authoring wizard.

## Author a workflow

The wizard has three steps, with a live preview beside each one.

### Step 1: Basic information

| Field | Notes |
|---|---|
| **Name** | Required, up to 120 characters |
| **Handle** | The lowercase identifier used in URLs. Auto-generated from the name; edit it here if you want a specific one. **It can't be changed after the workflow is created** |
| **Description** | Required. This is what agents read when deciding whether the workflow fits their task, so describe the goal, not the mechanics |
| **Agent visibility** | **Visible to agents** or **Hidden from agents** |

The right pane shows an **Agent Preview**—the name and description exactly as they'll appear in agent discovery.

### Step 2: Define the API workflow

Choose one of two authoring paths.

**Upload file**—drop in a workflow you already have. Arazzo specs go in as `.yaml`, `.yml`, or `.json`; a natural-language workflow goes in as `.md`. After upload, an Arazzo file gets its source descriptions validated and listed, and a Markdown file gets a summary strip.

**From template**—pick the APIs that take part in the workflow and let the portal generate a starter Arazzo spec from their specifications. Filter the API list by name, type, or description, or narrow it to selected, AI Ready, or AI Restricted APIs. MCP servers appear in this list alongside APIs.

Either way, the right pane holds the definition editor:

- A **Format** toggle between **Arazzo Spec** (`workflow.arazzo.yaml`) and **Markdown** (`workflow.md`)
- **Open in Claude**, **Download .arazzo.yaml**, and **Copy Prompt**—for refining the generated template outside the portal. All three need at least one API selected
- An **Upload** control to bring an edited file back in

!!! tip
    Source descriptions are what let an agent find each API's specification while following the workflow. Generating from a template fills them in with the specs of APIs published in this portal; a hand-written Arazzo file has to declare them itself.

### Step 3: Agent prompt

The agent prompt is **generated from the workflow**, not written from scratch. Three actions are available:

- **Regenerate** rebuilds the prompt after you change the definition.
- Editing the text directly lets you adjust the generated wording.
- **Copy prompt** puts it on your clipboard to use elsewhere.

The right pane shows the Markdown file agents will fetch, plus a **Readiness** checklist covering name and description, workflow definition, and agent prompt.

If you set the workflow to hidden from agents in step 1, this step shows a banner saying so, with a shortcut back to change it.

## Publish or save as a draft

The wizard's footer carries a split button:

- **Publish Flow** makes the workflow live in its view immediately.
- **Save as Draft**, from the dropdown, saves it without exposing it to consumers.

Draft workflows appear nowhere outside this panel—not in the portal gallery, not in `llms.txt`, not in `api-workflows.md`.

To unpublish, reopen the workflow and save it as a draft again. There's no separate unpublish action.

## Control visibility

A workflow has exactly one visibility setting, plus its publication status. The two combine like this:

| Status | Agent visibility | In the portal gallery | In `llms.txt` and the agent endpoints |
|---|---|---|---|
| Published | Visible | Yes | Yes |
| Published | Hidden | Yes | No |
| Draft | Either | No | No |

Hiding a workflow from agents is how you ship it to human developers while its automated execution is still being validated. There is no separate control for hiding a published workflow from people—publishing it makes it visible in the gallery for that view.

!!! note
    The portal-wide **Portal is AI-discoverable** toggle overrides all of this. With it off, no workflow reaches an agent regardless of its setting. See [LLM Instructions](llm-instructions.md).

## Edit and delete

Click the pencil on a card to reopen the wizard with the workflow's current values. The handle is fixed; everything else can change, including the content type—you can replace an Arazzo definition with Markdown or the reverse.

Click the trash icon to delete a workflow. Deleting removes it from the gallery and from every agent-facing endpoint.

## Related

- [API Workflows](../api-workflows.md): what consumers and agents see, and the endpoints they use
- [LLM Instructions](llm-instructions.md): the portal-wide AI discoverability toggle and the `llms.txt` header
- [AI Agent Discovery](../ai-agent-discovery.md): every agent-facing endpoint the portal serves
- [Artifact types](../setting-up/artifact-types.md): whether this deployment serves API workflows at all