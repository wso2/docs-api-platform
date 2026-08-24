---
title: "Arazzo MCP Generator CLI quick start guide"
description: "Convert an Arazzo specification into a Dockerized MCP server using the arazzo-mcp-gen CLI, from validation to running the generated server."
canonical_url: https://wso2.com/api-platform/docs/tools/arazzo-mcp-gen-cli/quick-start-guide/
md_url: https://wso2.com/api-platform/docs/tools/arazzo-mcp-gen-cli/quick-start-guide.md
tags:
  - tools
  - cli
  - arazzo
  - mcp
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-23
content_type: "quickstart"
---

## Quick Start — Arazzo MCP Generator (arazzo-mcp-gen)

`arazzo-mcp-gen` is a CLI tool that turns an [Arazzo specification](https://spec.openapis.org/arazzo/latest.html) and its referenced OpenAPI files into a fully Dockerized Python MCP (Model Context Protocol) server. Each Arazzo workflow becomes an MCP tool that any AI agent can call.

## What It Does

Given a folder containing:

- one Arazzo `.yaml` file (describes multi-step API workflows)
- referenced OpenAPI `.yaml` files (describe individual API operations)

the CLI will:

| Step | What happens |
|------|-------------|
| Validate | Checks the Arazzo file for correctness (requires Spectral or uses built-in checks) |
| Inspect | Shows a human-readable summary of workflows and steps |
| Visualize | Renders a Mermaid flowchart of the workflow logic |
| Generate | Emits `mcp_server.py` + `Dockerfile`, then builds a Docker image |
| Run | `docker run` the image — any MCP client can connect |

---

## Prerequisites

| Tool | Why | Install |
|------|-----|---------|
| **Docker** | Build and run the generated image | [docs.docker.com/get-docker](https://docs.docker.com/get-docker/) |
| **Node.js + npx** *(optional)* | Enables the Spectral validator for in-depth Arazzo checks | [nodejs.org](https://nodejs.org) |

---

## Installation

Download the latest version for your operating system from the [Releases](https://github.com/HimethW/arazzo-mcp-gen/releases) page.

### Windows
1. Download `arazzo-mcp-gen-windows-amd64.exe`.
2. Rename it to `arazzo-mcp-gen.exe`.
3. Move it to a folder in your PATH (e.g., `C:\Windows\system32`) or run it directly from your downloads.

### macOS / Linux
1. Download the binary for your architecture (`darwin` for Mac, `linux` for Linux).
2. Make it executable:
   ```bash
   chmod +x arazzo-mcp-gen-linux-amd64
   sudo mv arazzo-mcp-gen-linux-amd64 /usr/local/bin/arazzo-mcp-gen
   ```

Verify the installation:

```bash
arazzo-mcp-gen --version
```

---

## Quick Start

If you don't have an Arazzo spec yet, let the CLI create a sample one:

```bash
arazzo-mcp-gen sample my-project
cd my-project
```

Then validate, inspect, and generate in three commands:

```bash
arazzo-mcp-gen validate -d .
arazzo-mcp-gen inspect  -d .
arazzo-mcp-gen mcp-server generate -d . -p 5000
```

Once Docker finishes building, run it:

```bash
docker run -p 5000:5000 <image-name-from-output>
```

## User Scenario: End-to-End Walkthrough

> **Scenario:** You have an OpenAPI spec for a pet store API and want to expose a "check if a pet exists, then create or update it" workflow as an MCP tool for an AI agent.

### Step 1 — Prepare your project folder

Create a folder containing your Arazzo specification and its referenced OpenAPI files:

1. Create a folder named `pet-project`.
2. Save your Arazzo file (e.g., `petstore_workflow.yaml`) inside it.
3. Ensure all OpenAPI `.yaml` files referenced in the Arazzo spec are also in this folder.

```
pet-project/
├── petstore_workflow.yaml   ← Your Arazzo spec
└── petstore_openapi.yaml    ← Your OpenAPI spec
```

### Step 2 — Validate the spec

```bash
arazzo-mcp-gen validate -d .
```

**Expected output (Spectral available):**
```
Validating: /path/to/pet-project/petstore_workflow.yaml
────────────────────────────────────────────────────────────
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Validation Result: PASSED
  ✓ All arazzo rules passed
  ─ Validated using Spectral (spectral:arazzo ruleset)
```

Fix any errors reported before continuing. Warnings are informational; use `--strict` to treat them as errors in CI.

### Step 3 — Inspect the spec

```bash
arazzo-mcp-gen inspect -d .
```

Review the printed summary to confirm:

- The correct source descriptions (your OpenAPI file/URL)
- Every step has an `operationId` that matches your OpenAPI spec
- Input schema, success criteria, and routing look correct

### Step 4 — Visualize the flow

```bash
arazzo-mcp-gen visualize -d .
```

Your browser opens with an interactive Mermaid flowchart. Check the branching logic visually — this is especially useful for multi-step workflows with `onSuccess` / `onFailure` routing.

To save it:

```bash
# As a Markdown file (renders on GitHub)
arazzo-mcp-gen visualize -d . -o flow.md
```

### Step 5 — Generate the MCP server

Make sure Docker is running, then:

```bash
arazzo-mcp-gen mcp-server generate -d . -p 5000 -o ./artifacts
```

**Expected output:**
```
Validating input folder...
Found Arazzo spec: Pet Upsert Workflow (V3) with 1 workflow(s)
Generating MCP server code...
Building Docker image...
[+] Building 12.3s (10/10) FINISHED
╔════════════════════════════════════════════════════════════════════════╗
║ ✅ MCP Server image built successfully!                                ║
║                                                                        ║
║ Image:  pet-upsert-workflow-v3-mcp-server                              ║
║ Run:    docker run -p 5000:5000 pet-upsert-workflow-v3-mcp-server      ║
║ URL:    http://localhost:5000                                          ║
║                                                                        ║
║ Build artifacts saved to: ./artifacts                                  ║
╚════════════════════════════════════════════════════════════════════════╝
```

### Step 6 — Run the server

Copy the `docker run` command from the output and run it:

```bash
docker run -p 5000:5000 pet-upsert-workflow-v3-mcp-server
```

### Step 7 — Connect an MCP client

The server is now live at `http://localhost:5000/mcp` in stateless HTTP mode. To connect it to an MCP client like **Claude Desktop**, you can use `supergateway` to bridge the HTTP endpoint:

```json
{
  "mcpServers": {
    "my-mcp-server": {
      "command": "npx",
      "args": [
        "-y",
        "supergateway",
        "--streamableHttp",
        "http://localhost:5000/mcp"
      ]
    }
  }
}
```

> **Note:** Replace `http://localhost:5000/mcp` with the endpoint shown in your terminal if you used a different port.

The AI agent can now call your Arazzo workflows as tools. The tool executes the full multi-step logic internally and returns the final result.

---

## Generated Artifacts

Inspect with `--output` / `-o ./artifacts`:

```
artifacts/
├── mcp_server.py     ← FastMCP server; each workflow = @mcp.tool()
├── Dockerfile        ← python:3.11-slim image; EXPOSEs your port
└── arazzo/
    ├── petstore_workflow.yaml   ← copy of your Arazzo spec
    └── openapi.yaml             ← copy of referenced OpenAPI spec(s)
```

| File | What it is |
|------|------------|
| `mcp_server.py` | Python server using `fastmcp` and `arazzo-runner`. Workflow inputs become typed function parameters; docstrings come from workflow summaries/descriptions. |
| `Dockerfile` | Standard slim Python container. Installs dependencies, copies the `arazzo/` folder, and runs `mcp_server.py`. |
| `arazzo/` | All spec files the container needs to resolve `$ref` and `sourceDescriptions` at runtime. |

---