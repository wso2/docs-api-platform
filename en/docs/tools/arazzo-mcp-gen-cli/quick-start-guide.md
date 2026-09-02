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
last_updated: 2026-09-01
content_type: "quickstart"
---

## Quick start — Arazzo MCP Generator (arazzo-mcp-gen)

`arazzo-mcp-gen` is a CLI tool that turns an [Arazzo specification](https://spec.openapis.org/arazzo/latest.html) and its referenced OpenAPI files into a fully Dockerized Python MCP (Model Context Protocol) server. Each Arazzo workflow becomes an MCP tool that any AI agent can call.

## What it does

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

Download the archive for your platform from the [arazzo-mcp-generator releases](https://github.com/wso2/arazzo-mcp-generator/releases) page, or use the install commands below.

The commands below install version `0.1.0`. Substitute another version number in the URL to install a different release.

### macOS and Linux

Run only the block that matches your platform:

```bash
# For macOS (Apple Silicon)
curl -LO https://github.com/wso2/arazzo-mcp-generator/releases/download/0.1.0/arazzo-mcp-gen-0.1.0-darwin-arm64.zip
unzip arazzo-mcp-gen-0.1.0-darwin-arm64.zip
sudo mv arazzo-mcp-gen-darwin-arm64 /usr/local/bin/arazzo-mcp-gen

# For macOS (Intel)
curl -LO https://github.com/wso2/arazzo-mcp-generator/releases/download/0.1.0/arazzo-mcp-gen-0.1.0-darwin-amd64.zip
unzip arazzo-mcp-gen-0.1.0-darwin-amd64.zip
sudo mv arazzo-mcp-gen-darwin-amd64 /usr/local/bin/arazzo-mcp-gen

# For Linux (x86_64)
curl -LO https://github.com/wso2/arazzo-mcp-generator/releases/download/0.1.0/arazzo-mcp-gen-0.1.0-linux-amd64.zip
unzip arazzo-mcp-gen-0.1.0-linux-amd64.zip
sudo mv arazzo-mcp-gen-linux-amd64 /usr/local/bin/arazzo-mcp-gen

# For Linux (ARM64)
curl -LO https://github.com/wso2/arazzo-mcp-generator/releases/download/0.1.0/arazzo-mcp-gen-0.1.0-linux-arm64.zip
unzip arazzo-mcp-gen-0.1.0-linux-arm64.zip
sudo mv arazzo-mcp-gen-linux-arm64 /usr/local/bin/arazzo-mcp-gen
```

Moving the binary to `/usr/local/bin` lets you run `arazzo-mcp-gen` from any folder.

> **Note:** If you downloaded through a browser rather than with `curl`, macOS marks the file as untrusted and refuses to run it. Clear the mark:
>
> ```bash
> xattr -d com.apple.quarantine /usr/local/bin/arazzo-mcp-gen
> ```

### Windows

Download and extract the archive in PowerShell:

```powershell
Invoke-WebRequest -Uri https://github.com/wso2/arazzo-mcp-generator/releases/download/0.1.0/arazzo-mcp-gen-0.1.0-windows-amd64.zip -OutFile arazzo-mcp-gen-0.1.0-windows-amd64.zip
Expand-Archive -Path arazzo-mcp-gen-0.1.0-windows-amd64.zip -DestinationPath .
```

Move `arazzo-mcp-gen.exe` to a folder on your `PATH` to run it from anywhere, or run it from the folder you extracted it into.

### Verify the installation

Confirm that the binary runs and reports its version:

```bash
arazzo-mcp-gen --version
# arazzo-mcp-gen version v0.1.0
```

### Check the download

Each release includes `checksums.txt`, which lists a fingerprint for every published archive. Comparing your copy against that list confirms the download arrived intact. Run this from the folder holding the archive:

```bash
curl -LO https://github.com/wso2/arazzo-mcp-generator/releases/download/0.1.0/checksums.txt
shasum -a 256 -c checksums.txt --ignore-missing
```

An intact archive reports `OK`. Delete the archive when you're done: `rm arazzo-mcp-gen-0.1.0-*.zip`.

---

## User scenario: end-to-end walkthrough

> **Scenario:** You have an OpenAPI spec for a pet store API and want to expose a "check if a pet exists, then create or update it" workflow as an MCP tool for an AI agent.

### Step 1 — Prepare your project folder

The tool needs your Arazzo file, which lists the workflow steps, and the OpenAPI file describing the API those steps call.

1. Create a folder named `pet-project`, then change into it with `cd pet-project`. The commands in the following steps all run from inside this folder.
2. Save your Arazzo file (for example, `petstore_workflow.yaml`) inside it. If you don't have one, open the [sample Arazzo file](https://github.com/wso2/arazzo-mcp-generator#sample-arazzo-file), copy the YAML block, and save it under that name.
3. If your Arazzo spec references OpenAPI files by name, put those files in this folder too. The sample references the Petstore API by URL, so it needs no local copy.

```text
pet-project/
├── petstore_workflow.yaml   ← Your Arazzo spec
└── petstore_openapi.yaml    ← Your OpenAPI spec, if referenced by file name
```

### Step 2 — Validate the spec

```bash
arazzo-mcp-gen validate -f .
```

**Expected output (Spectral available):**
```
Validating: /path/to/pet-project/petstore_workflow.yaml
────────────────────────────────────────────────────────────
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Validation Result: PASSED
  ✓ All arazzo rules passed
  ⚠ 0 warnings
  ✗ 0 errors
  ─ Validated using Spectral (spectral:arazzo ruleset)
```

Fix any errors reported before continuing. Warnings are informational; use `--strict` to treat them as errors in CI.

### Step 3 — Inspect the spec

```bash
arazzo-mcp-gen inspect -f .
```

Review the printed summary to confirm:

- The correct source descriptions (your OpenAPI file/URL)
- Every step has an `operationId` that matches your OpenAPI spec
- Input schema, success criteria, and routing look correct

### Step 4 — Visualize the flow

```bash
arazzo-mcp-gen visualize -f .
```

Your browser opens a rendered Mermaid flowchart. Check the branching logic visually — this is especially useful for multi-step workflows with `onSuccess` / `onFailure` routing.

To save it:

```bash
# As a Markdown file (renders on GitHub)
arazzo-mcp-gen visualize -f . -o flow.md
```

### Step 5 — Generate the MCP server

Make sure Docker is running, then:

```bash
arazzo-mcp-gen mcp-server generate -f . -p 5000 -o ./artifacts
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
║ If TLS verification must be disabled for self-signed HTTPS endpoints,  ║
║ run the image with: -e ARAZZO_DISABLE_TLS_VERIFY=1                     ║
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

The server is now live at `http://localhost:5000/mcp` in stateless HTTP mode. To connect it to an MCP client like **Claude Desktop**, you can use `supergateway` to bridge the HTTP endpoint. Add the following to your Claude Desktop configuration, keeping any settings already in the file. On macOS it's at `~/Library/Application Support/Claude/claude_desktop_config.json`; on Windows, `%APPDATA%\Claude\claude_desktop_config.json`:

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

Save the file, then quit Claude Desktop and open it again. The AI agent can now call your Arazzo workflows as tools. The tool executes the full multi-step logic internally and returns the final result.

---

## Generated artifacts

Inspect with `--output` / `-o ./artifacts`:

```text
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
