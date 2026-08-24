---
title: "Link creation"
description: "Create symbolic or remote links to resources and collections in the WSO2 API Manager registry."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.2.0/install-and-setup/setup/setting-up-databases/working-with-the-resgistry/managing-the-registry/link-creation/
md_url: https://wso2.com/api-platform/docs/api-manager/4.2.0/install-and-setup/setup/setting-up-databases/working-with-the-resgistry/managing-the-registry/link-creation.md
tags:
  - api-manager
  - install-and-setup
  - setup
  - setting-up-databases
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "how-to"
---

# Link Creation

Follow the instructions below to create a link on a resource/collection.

1. Symbolic links and Remote links can be created in a similar way to adding a normal resource. To add a link, click *Create Link* in the *Entries* panel.

![](../../../../../assets/attachments/126562639/126562641.png)

2. Select a link to add from the drop-down menu.

### A Symbolic Link

When adding a Symbolic link, enter a name for the link and the path of an existing resource or collection which is being linked. It creates a link to the particular resource.

![](../../../../../assets/attachments/126562639/126562640.png)

### A Remote Link

You can mount a collection in a remotely-deployed registry instance to your registry instance by adding a Remote link. Provide a name for the Remote link in the name field. Choose the instance to which you are going to mount and give the path of the remote collection which you need to mount for the path field, or else the root collection will be mounted.

![](../../../../../assets/attachments/126562639/126562642.png)