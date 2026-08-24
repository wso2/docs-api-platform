---
title: "Exporting packaged synapse artifacts"
description: "Provides steps to export a packaged composite application into a CAR file using WSO2 Integration Studio."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.0.0/integrate/develop/exporting-artifacts/
md_url: https://wso2.com/api-platform/docs/api-manager/4.0.0/integrate/develop/exporting-artifacts.md
tags:
  - api-manager
  - integrate
  - develop
  - exporting-artifacts
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "how-to"
---

# Exporting packaged Synapse artifacts

Once you have [packaged your artifacts](packaging-artifacts.md) into a composite application, you can
export it into a CAR file (.car file):

1.  Select the Composite Exporter module in the project explorer,
    right-click, and click **Export Composite Application Project** .  
    <a href="../../../assets/img/integrate/create_project/export_esb_artifacts.jpg"><img src="../../../assets/img/integrate/create_project/export_esb_artifacts.jpg" width'"70%"></a>
2.  In the dialog that opens, give a name for the CAR file, the destination where the file should be saved, and click **Next**.
3.  You can select the artifacts that should be packaged in the CAR file.
4.  Click **Finish** to generate the CAR file.