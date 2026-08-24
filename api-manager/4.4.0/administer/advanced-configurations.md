---
title: "Configure Advanced Tenant Settings"
description: "Navigate to the Advanced Configuration section of the Admin Portal to update tenant-level settings and define custom linter rules for API schema validation."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.4.0/administer/advanced-configurations/
md_url: https://wso2.com/api-platform/docs/api-manager/4.4.0/administer/advanced-configurations.md
tags:
  - api-manager
  - admin-portal
  - governance
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-15
content_type: "how-to"
---

# **Advanced Configurations**

This section covers how to change and configure several features related to the advanced tenant configurations.

## Step 1 - Navigate to the Admin Portal Advanced Configuration Section

1.  Sign in to the WSO2 Admin Portal via `https://<Server-Host>:9443/admin`.
2.  Click **Settings** --> **Advanced**.

    <a href="../../assets/img/administer/advanced-config-browse.png"><img src="../../assets/img/administer/advanced-config-browse.png"/></a>
    
## Step 2 - Change the Advanced Configurations per use case

1. Change the relevant configuration accordingly and click **Save**.

    <a href="../../assets/img/administer/advanced-config-save.png"><img src="../../assets/img/administer/advanced-config-save.png"/></a>

    ??? tip "Setting custom Linter rules"
        You can add your custom rules in JSON with the key “LinterCustomRules”.
    

2.  You can revert the unsaved changes by clicking **Cancel**.

!!! tip
    Before clicking **Save**, check and fix any schema validation errors visible in the editor due to the changes made.