---
title: "API Platform CLI quick start guide"
description: "Install the ap CLI binary, set gateway credentials, and run your first commands from the API Platform Controller."
canonical_url: https://wso2.com/api-platform/docs/tools/cli/quick-start-guide/
md_url: https://wso2.com/api-platform/docs/tools/cli/quick-start-guide.md
tags:
  - tools
  - cli
  - quickstart
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-23
content_type: "quickstart"
---

## Quick Start — API Platform Controller (ap)

This short guide explains how to use a prebuilt `ap` binary so you can run the CLI from any location.

- Install the binary: put the file on your `PATH`. For example:


  - macOS / Linux:

    Extract the zip to a local bin directory and add it to your `PATH`.

  - Windows:

    Place `ap.exe` in a folder that's included in your `%PATH%` (for example `%USERPROFILE%\bin`) or add its folder to your PATH.

- Gateway credentials: export `WSO2AP_GW_USERNAME` and `WSO2AP_GW_PASSWORD` before running controller commands.

- Policy Hub: if your environment overrides the default policy source, set the appropriate Policy Hub environment variable (for example `POLICY_HUB_URL`) to point to your policy hub.

After placing the binary on your `PATH` and exporting any required environment variables, you can run `ap` from any terminal.