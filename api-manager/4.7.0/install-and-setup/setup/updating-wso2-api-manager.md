---
title: "Update WSO2 API Manager Using WSO2 Updates"
description: "Use the WSO2 Updates 2.0 command-line utility to fetch the latest bug fixes and security patches for an installed WSO2 API Manager instance."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.7.0/install-and-setup/setup/updating-wso2-api-manager/
md_url: https://wso2.com/api-platform/docs/api-manager/4.7.0/install-and-setup/setup/updating-wso2-api-manager.md
tags:
  - api-manager
  - installation
  - configuration
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "how-to"
---

# Updating WSO2 API Manager

WSO2 introduces [WSO2 Updates](https://updates.docs.wso2.com/en/latest/) , which is a command-line utility that allows you to get the latest updates that are available for a particular product release. These updates include the latest bug fixes and security fixes that are released by WSO2 after a particular product version is released. Therefore, you do not need to wait and upgrade to the next product release to get these bug fixes.

##WSO2 Updates 2.0
The WSO2 updates 2.0 tool allows you to update your currently used product by fetching updates from the server. While you should manually merge the updated configuration files or use a tool like Puppet, you can store backups with the custom configurations in your system, in case you have to restore later.

For more information, see [Using WSO2 Updates 2.0](https://updates.docs.wso2.com/en/latest/updates/set-up-update-tool/)

!!! warning

    **Persisting Index data**

    The indexing related information of WSO2 API Manager is stored in the `<API-M_HOME>/solr/data` directory. Once the data is indexed, it is stored in the index directory.
    
    !!! tip
        Before you discard the old API Manager instance,
        
        You must take a backup of the `<API-M_HOME>/solr/data` directory and copy it to the API Manager binary pack in the `<API-M_HOME>/solr/data` directory that is updated.
    
    **Persisting WSO2CarbonDB**
    
    To avoid conflicts that can be occurred in the update process, it is recommended to persist the local H2 databases as well.
    
    !!! tip
        Before you discard the old API Manager instance,
        
        Take a backup of `<API-M_HOME>/repository/database/WSO2CARBON_DB.h2.db` and replace it to the API Manager binary pack in the `<API-M_HOME>/repository/database` directory that is updated.
        
        If you are using the existing local H2 database for WSO2MetricsDB as well,
        
        Take a backup of `<API-M_HOME>/repository/database/WSO2METRICS_DB.h2.db` and replace it to the API Manager binary pack in the `<API-M_HOME>/repository/database` directory that is updated.
        
    
    For more information on run time and configuration artifact directories of API Manager refer [Common Runtime and Configuration Artifacts](../../reference/common-runtime-and-configuration-artifacts.md) .