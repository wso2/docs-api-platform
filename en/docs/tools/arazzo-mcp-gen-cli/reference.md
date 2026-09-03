---
title: "Arazzo MCP Generator CLI reference"
description: "Command reference for arazzo-mcp-gen: validate, inspect, visualize, and mcp-server generate."
canonical_url: https://wso2.com/api-platform/docs/tools/arazzo-mcp-gen-cli/reference/
md_url: https://wso2.com/api-platform/docs/tools/arazzo-mcp-gen-cli/reference.md
tags:
  - tools
  - cli
  - arazzo
  - mcp
  - reference
author: WSO2 API Platform Documentation Team
last_updated: 2026-09-02
content_type: "reference"
---

### `validate`

Validates an Arazzo specification for correctness and completeness.

Uses **Spectral** (via `npx @stoplight/spectral-cli`) with the official `spectral:arazzo` ruleset as the primary validator when available. Falls back to the built-in Go validator when Node.js is not installed, showing install instructions.

```bash
arazzo-mcp-gen validate -f <file-or-folder>
```

| Flag | Short | Description | Default |
|------|-------|-------------|---------|
| `--file` | `-f` | Path to an Arazzo file, or a folder that the CLI scans to find one | — |
| `--check-remote` | | Also probe remote source URLs for accessibility | `false` |
| `--strict` | | Treat warnings as errors (exits with code 1 on warnings) | `false` |

**Examples**

```bash
# Validate all files in a folder
arazzo-mcp-gen validate -f ./my-arazzo-folder

# Validate a single file
arazzo-mcp-gen validate -f ./workflow.yaml

# Validate and also check that remote OpenAPI URLs are reachable
arazzo-mcp-gen validate -f ./my-arazzo-folder --check-remote

# Strict mode: fail if there are any warnings
arazzo-mcp-gen validate -f ./my-arazzo-folder --strict
```

**What it checks (Spectral ruleset)**

- Full JSON Schema validation against the Arazzo 1.0.x spec
- Unique `workflowId` and `stepId` values
- Step targets (`operationId`, `operationPath`, `workflowId`) are present and valid
- Parameter `name`, `in`, and `value` fields
- Success criteria condition syntax
- Unique `onSuccess` / `onFailure` action names
- Output expression syntax
- `dependsOn` cross-references

**Additional built-in checks (always run)**

- Local source file existence
- Remote URL accessibility (only with `--check-remote`)
- Multiple `$statusCode` criteria that are AND-ed together (a common mistake)

**Exit codes**

| Code | Meaning |
|------|---------|
| `0` | Passed (no errors) |
| `1` | Errors found, or warnings in `--strict` mode |

---

### `inspect`

Parses and prints a detailed, colour-coded overview of an Arazzo spec — without generating anything. Use this to understand a spec or debug step-flow routing before generating an MCP server.

```bash
arazzo-mcp-gen inspect -f <file-or-folder>
```

| Flag | Short | Description |
|------|-------|-------------|
| `--file` | `-f` | Path to an Arazzo file, or a folder that the CLI scans to find one |

**Examples**

```bash
# Inspect a folder (auto-detects the Arazzo file)
arazzo-mcp-gen inspect -f ./my-arazzo-folder

# Inspect a specific file
arazzo-mcp-gen inspect -f ./workflow.yaml
```

**Output includes**

- Spec metadata: title, version, Arazzo version
- All source descriptions with types and URLs
- For each workflow:
    - Input schema with types
    - Each step: operation target, parameter bindings, success criteria
    - `onSuccess` / `onFailure` routing with conditions (GOTO, END, RETRY)
    - Step outputs and their expressions
    - Workflow-level outputs

---

### `visualize`

Generates a Mermaid flowchart diagram of the Arazzo spec's workflow logic. By default opens the rendered diagram in your browser (no extra tools needed). Can also save to a file.

```bash
arazzo-mcp-gen visualize -f <file-or-folder> [-o <output-file>]
```

Alias: `viz`

| Flag | Short | Description |
|------|-------|-------------|
| `--file` | `-f` | Path to an Arazzo file, or a folder that the CLI scans to find one |
| `--output` | `-o` | Output file path. `.md` → Mermaid in fenced code block; `.mmd` → raw Mermaid syntax |

**Examples**

```bash
# Open diagram in browser (default)
arazzo-mcp-gen visualize -f ./my-arazzo-folder

# Save to GitHub-renderable Markdown
arazzo-mcp-gen visualize -f ./workflow.yaml -o diagram.md

# Save raw Mermaid source
arazzo-mcp-gen visualize -f ./my-arazzo-folder -o flow.mmd

# Short alias
arazzo-mcp-gen viz -f ./my-arazzo-folder
```

**Diagram shows**

- Start and end nodes for each workflow
- Steps with operation targets
- `onSuccess` / `onFailure` branches labelled with conditions
- Implicit sequential flow and fallthrough paths (dashed arrows)
- Cross-workflow `goto` references

!!! tip

    Paste any `.mmd` file into [mermaid.live](https://mermaid.live) for a shareable interactive link.

---

### `mcp-server generate`

The main command. Reads your Arazzo + OpenAPI files, generates a Python MCP server, and builds a Docker image.

```bash
arazzo-mcp-gen mcp-server generate -f <file-or-folder> [flags]
```

| Flag | Short | Description | Default |
|------|-------|-------------|---------|
| `--file` | `-f` | Path to an Arazzo file, or a folder that the CLI scans to find one. When you give a file, the CLI looks in its parent folder for the referenced OpenAPI files | — |
| `--port` | `-p` | Port the MCP server listens on inside the container and on your host | `5000` |
| `--output` | `-o` | Save generated artifacts (`mcp_server.py`, `Dockerfile`, `arazzo/` folder) to this path for inspection. If omitted a temp directory is used and cleaned up automatically | — |

!!! note

    `--file` (`-f`) is required. Point it at a single Arazzo file when a folder holds more than one and you want to convert only that one.

**Examples**

```bash
# From a folder (auto-detects the Arazzo file)
arazzo-mcp-gen mcp-server generate -f ./my-arazzo-folder

# From a single Arazzo file directly
arazzo-mcp-gen mcp-server generate -f ./my-arazzo-folder/workflow.arazzo.yaml

# Custom port
arazzo-mcp-gen mcp-server generate -f ./my-arazzo-folder -p 8080

# Inspect generated files after build
arazzo-mcp-gen mcp-server generate -f ./workflow.arazzo.yaml -p 8080 -o ./artifacts
```

**Input requirements**

- When `-f` is a folder: it must contain exactly one `.yaml`/`.yml` file with a top-level `arazzo:` key
- When `-f` is a file: point directly to the Arazzo file; the folder can contain multiple Arazzo files
- Local OpenAPI files referenced in `sourceDescriptions[].url` must be in the same folder as the Arazzo file. Remote URLs need no local copy, and the generated server fetches them at runtime
- The Arazzo file must have `info.title`, `info.version`, and at least one workflow

**What it does**

1. Finds and validates the Arazzo file in the folder
2. Generates `mcp_server.py` — each workflow becomes a `@mcp.tool()` function with typed parameters
3. Generates a `Dockerfile` using `python:3.11-slim`
4. Runs `docker build` to produce a tagged image
5. Prints the `docker run` command to start the server

**Running the generated server**

```bash
docker run -p 5000:5000 <image-name>
```

To reach an HTTPS endpoint that uses a self-signed certificate, set `ARAZZO_DISABLE_TLS_VERIFY` when you start the container:

```bash
docker run -p 5000:5000 -e ARAZZO_DISABLE_TLS_VERIFY=1 <image-name>
```

The MCP endpoint is available at `http://localhost:5000/mcp`.