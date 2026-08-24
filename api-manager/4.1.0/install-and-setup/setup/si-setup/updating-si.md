---
title: "Updating WSO2 streaming integrator"
description: "Apply WSO2 Updates and in-place update tooling to keep Streaming Integrator patched with the latest fixes."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/install-and-setup/setup/si-setup/updating-si/
md_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/install-and-setup/setup/si-setup/updating-si.md
tags:
  - api-manager
  - install-and-setup
  - setup
  - si-setup
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-30
content_type: "concept"
---

# Updating WSO2 Streaming Integrator

WSO2 introduces [WSO2 Updates)](https://updates.docs.wso2.com/en/latest/) , which is a command-line utility that allows you to get the latest updates that are available for a particular product release. These updates include the latest bug fixes and security fixes that are released by WSO2 after a particular product version is released. Therefore, you do not need to wait and upgrade to the next product release to get these bug fixes.

##WSO2 in-place updates
The WSO2 in-place updates tool allows you to update your currently used product by fetching updates from the server and merging all configurations and files. The tool also gives backup and restore capability.

For more information, see [Using Update Tool](https://updates.docs.wso2.com/en/latest/updates/update-tool/)


##WSO2 Updates 2.0
You should manually merge the updated configuration files or use a tool like Puppet. You should store backups with the custom configurations in your system, in case you have to restore later.

For more information, see [Overview](https://updates.docs.wso2.com/en/latest/updates/overview/)