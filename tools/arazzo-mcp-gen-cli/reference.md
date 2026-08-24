---
title: "Arazzo MCP Generator CLI reference"
description: "Command reference for arazzo-mcp-gen: sample, validate, inspect, visualize, and mcp-server generate."
canonical_url: https://wso2.com/api-platform/docs/tools/arazzo-mcp-gen-cli/reference/
md_url: https://wso2.com/api-platform/docs/tools/arazzo-mcp-gen-cli/reference.md
tags:
  - tools
  - cli
  - arazzo
  - mcp
  - reference
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-23
content_type: "reference"
---

### `sample`

Creates a new directory with a ready-to-use sample Arazzo spec targeting the Petstore v3 API. Good starting point for writing your own spec.

```bash
arazzo-mcp-gen sample [project-name]
```

| Argument | Description | Default |
|----------|-------------|---------|
| `project-name` | Name of the folder to create | `sample-arazzo-project` |

**Examples**

```bash
# Create a folder called 'sample-arazzo-project'
arazzo-mcp-gen sample

# Create a folder called 'my-api-project'
arazzo-mcp-gen sample my-api-project
```

What it creates:

```
my-api-project/
└── petstore_workflow.yaml   ← sample Arazzo spec targeting Petstore v3
```

---

### `validate`

Validates an Arazzo specification for correctness and completeness.

Uses **Spectral** (via `npx @stoplight/spectral-cli`) with the official `spectral:arazzo` ruleset as the primary validator when available. Falls back to the built-in Go validator when Node.js is not installed, showing install instructions.

```bash
arazzo-mcp-gen validate -d <folder>
arazzo-mcp-gen validate -f <file>
```

| Flag | Short | Description | Default |
|------|-------|-------------|---------|
| `--folder` | `-d` | Folder containing the Arazzo file (auto-detected) | — |
| `--file` | `-f` | Path to a single Arazzo `.yaml` file | — |
| `--check-remote` | | Also probe remote source URLs for accessibility | `false` |
| `--strict` | | Treat warnings as errors (exits with code 1 on warnings) | `false` |

> Use either `--folder` or `--file`, not both.

**Examples**

```bash
# Validate all files in a folder
arazzo-mcp-gen validate -d ./my-arazzo-folder

# Validate a single file
arazzo-mcp-gen validate -f ./workflow.yaml

# Validate and also check that remote OpenAPI URLs are reachable
arazzo-mcp-gen validate -d ./my-arazzo-folder --check-remote

# Strict mode: fail if there are any warnings
arazzo-mcp-gen validate -d ./my-arazzo-folder --strict
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
arazzo-mcp-gen inspect -d <folder>
arazzo-mcp-gen inspect -f <file>
```

| Flag | Short | Description |
|------|-------|-------------|
| `--folder` | `-d` | Folder containing the Arazzo file |
| `--file` | `-f` | Path to a single Arazzo `.yaml` file |

**Examples**

```bash
# Inspect a folder (auto-detects the Arazzo file)
arazzo-mcp-gen inspect -d ./my-arazzo-folder

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
arazzo-mcp-gen visualize -d <folder>
arazzo-mcp-gen visualize -f <file> [-o <output-file>]
```

Alias: `viz`

| Flag | Short | Description |
|------|-------|-------------|
| `--folder` | `-d` | Folder containing the Arazzo file |
| `--file` | `-f` | Path to a single Arazzo `.yaml` file |
| `--output` | `-o` | Output file path. `.md` → Mermaid in fenced code block; `.mmd` → raw Mermaid syntax |

**Examples**

```bash
# Open diagram in browser (default)
arazzo-mcp-gen visualize -d ./my-arazzo-folder

# Save to GitHub-renderable Markdown
arazzo-mcp-gen visualize -f ./workflow.yaml -o diagram.md

# Save raw Mermaid source
arazzo-mcp-gen visualize -d ./my-arazzo-folder -o flow.mmd

# Short alias
arazzo-mcp-gen viz -d ./my-arazzo-folder
```

**Diagram shows**

- Start and end nodes for each workflow
- Steps with operation targets
- `onSuccess` / `onFailure` branches labelled with conditions
- Implicit sequential flow and fallthrough paths (dashed arrows)
- Cross-workflow `goto` references

> Paste any `.mmd` file into [mermaid.live](https://mermaid.live) for a shareable interactive link.

---

### `mcp-server generate`

The main command. Reads your Arazzo + OpenAPI files, generates a Python MCP server, and builds a Docker image.

```bash
arazzo-mcp-gen mcp-server generate -d <folder> [flags]
arazzo-mcp-gen mcp-server generate -f <arazzo-file> [flags]
```

| Flag | Short | Description | Default |
|------|-------|-------------|---------|
| `--folder` | `-d` | Folder containing Arazzo + OpenAPI files (auto-detects the Arazzo file) | — |
| `--file` | `-f` | Path to a single Arazzo specification file (uses its parent directory for OpenAPI files) | — |
| `--port` | `-p` | Port the MCP server listens on inside the container and on your host | `5000` |
| `--output` | `-o` | Save generated artifacts (`mcp_server.py`, `Dockerfile`, `arazzo/` folder) to this path for inspection. If omitted a temp directory is used and cleaned up automatically | — |

> **Note:** One of `--folder` (`-d`) or `--file` (`-f`) is required, but not both.
> Use `--file` when a folder contains multiple Arazzo files and you want to convert only one.

**Examples**

```bash
# From a folder (auto-detects the Arazzo file)
arazzo-mcp-gen mcp-server generate -d ./my-arazzo-folder

# From a single Arazzo file directly
arazzo-mcp-gen mcp-server generate -f ./my-arazzo-folder/workflow.arazzo.yaml

# Custom port
arazzo-mcp-gen mcp-server generate -d ./my-arazzo-folder -p 8080

# Inspect generated files after build
arazzo-mcp-gen mcp-server generate -f ./workflow.arazzo.yaml -p 8080 -o ./artifacts
```

**Input requirements**

- When using `-d`: the folder must contain exactly one `.yaml`/`.yml` file with a top-level `arazzo:` key
- When using `-f`: point directly to the Arazzo file; the folder can contain multiple Arazzo files
- All OpenAPI files referenced in `sourceDescriptions[].url` must be in the same folder as the Arazzo file
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

The MCP endpoint is available at `http://localhost:5000/mcp`.