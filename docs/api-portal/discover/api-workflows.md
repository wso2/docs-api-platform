---
title: "API Workflows"
description: "Find a published API workflow in the API Portal and AI Hub, read its steps, and hand it to an AI agent through the agent prompt or the Arazzo specification."
---

An API workflow is a published, multi-step sequence of API calls that solves one use case end to end, such as validating a patient, booking a specialist, and confirming the appointment. An administrator defines the workflow once, and everyone who needs that sequence follows the same tested path, instead of piecing it together from individual API specifications.

A workflow serves two audiences from the same definition. Developers read it in the portal to understand the calls and their order. AI agents read the machine-readable version and run it, so that they call the APIs in the right order without skipping steps or inventing endpoints.

## Browse Workflows

Click **API Workflows** in the sidebar. The page shows a card for each published workflow. If no workflows are published, the page shows **No workflows yet**.

Each card shows the following.

- The name and description of the workflow.

- A **POWERED BY** row that names the APIs the workflow calls.

- An **AI Ready** badge, when AI agents can discover the workflow.

Click a card to open the workflow.

## Read a Workflow

The page of a workflow shows its name and description, followed by the definition in one of two formats:

- **Arazzo workflows** are shown in an interactive [Arazzo](https://spec.openapis.org/arazzo/latest.html) viewer, with a flow diagram of the steps beside the specification. Use the diagram to follow the order of the calls, and the specification for the inputs, outputs, and success criteria of each step.

- **Markdown workflows** are shown as formatted text.

An Arazzo workflow names the APIs it calls in `sourceDescriptions`. The documentation of each API gives its endpoint, operations, and the credentials that it expects. See [Which Credentials You Need](../consume-an-api/overview.md).

## Hand a Workflow to an AI Agent

On the page of the workflow, click **Try with AI**. The portal generates an agent prompt from the definition of the workflow, which you can copy, download as a `.txt` file, or open in Claude.

**Try with AI** appears only when the workflow is visible to AI agents.

The prompt has two sections, and tells the agent which one applies.

| Section | For | What It Instructs |
|:--------|:----|:------------------|
| **API Execution Agent** | An assistant that calls the APIs itself | Run the steps in order, keep track of state between them, ask you for credentials, retry `5xx` responses up to three times, and stop on a `4xx` response. |
| **App Builder Agent** | A coding agent that builds an application | Read the workflow, the portal's `llms.txt`, and the specification of each API, map every step to a real endpoint, and confirm with you before writing code. |

Both sections point to the Markdown URL of the workflow, so the agent works from the live definition.

## How AI Agents Find Workflows

AI agents can also find workflows on their own through the machine-readable endpoints of the portal. These endpoints do not require authentication.

| Endpoint | Returns |
|:---------|:--------|
| `/{orgName}/views/{viewName}/api-workflows.md` | A Markdown list of all the published workflows that are visible to agents. |
| `/{orgName}/views/{viewName}/api-workflows/{handle}.md` | One workflow in Markdown, including its source APIs and the full Arazzo specification. |
| `/{orgName}/views/{viewName}/api-workflows/{handle}/arazzo.json` | The Arazzo specification of the workflow. Returns `404` for a Markdown workflow. |
| `/{orgName}/views/{viewName}/api-workflows/{handle}/prompt` | The agent prompt, description, content, and source APIs of the workflow, as JSON. |

The portal's `llms.txt` also lists these workflows. For all the endpoints that AI agents use, see [AI Agents](./ai-agent-discovery.md).

## Who Sees a Workflow

Administrators control two settings for each workflow.

| Setting | Values | Effect |
|:--------|:-------|:-------|
| **Status** | Draft or Published | Draft workflows appear nowhere. Published workflows appear on the **API Workflows** page. |
| **Agent visibility** | Visible or Hidden | A hidden workflow stays on the **API Workflows** page, but is removed from `llms.txt` and the agent endpoints, and does not show **Try with AI**. |

Administrators create and publish workflows in the portal, under **Settings** › **API Workflows**.

## Next Steps

- [AI Agents](./ai-agent-discovery.md) - Let AI agents discover APIs and workflows
- [Which Credentials You Need](../consume-an-api/overview.md) - Get the credentials for the APIs that a workflow calls
