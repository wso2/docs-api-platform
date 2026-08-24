---
title: "Setup overview"
description: "Get an overview of setup tasks such as updates, databases, user stores, and security for each API Manager component."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/install-and-setup/setup/setup-overview/
md_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/install-and-setup/setup/setup-overview.md
tags:
  - api-manager
  - install-and-setup
  - setup
  - setup-overview
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-30
content_type: "concept"
---

# Setup Overview

Setting up involves doing the required configurations for the API Manager and its components before running them in the production environment. The following are some common set up tasks that you are required to do separately for each component.

- **Updating the component**

    This involves applying the latest [WSO2 updates](https://wso2.com/updates) to each component so that each component is updated with the latest bug fixes and software improvement.

- **Configuring databases**

    This involves setting up databases for each component to store data.
    
    For instructions to set up databases for each component, see the following topics:
    
    - [Setting up Databases for the API Manager](setting-up-databases/overview.md)
    - [Setting up Databases for the Micro Integrator](mi-setup/databases/setting-up-mysql.md)
    - [Setting up Databases for the Streaming Integrator](si-setup/configuring-data-sources.md)
    
- **Configuring primary user stores**

    A user store is the database where information of the users and/or user roles are stored. This topic describes how to configure and manage different primary user stores. 
    
    For instructions to set up primary user stores for each component, see the following topics:
    
    - [Configuring Primary User Stores for the API Manager](../../administer/managing-users-and-roles/managing-user-stores/introduction-to-userstores.md)
    - [Configuring Primary User Stores for the Micro Integrator](mi-setup/user_stores/setting_up_a_userstore.md)
    
- **Configuring security**

    This covers topic such as key stores, securer vaults, GDPR compliance and working with secrets.
    
    For instructions to configure security for each component, see the following topics:
    
    - [Configuring Security for the API Manager](security/logins-and-passwords/maintaining-logins-and-passwords.md)
    - [Configuring Security for the Micro Integrator](mi-setup/security/creating_keystores.md)
    - [Configuring Security for the Streaming Integrator](si-setup/general-data-protection-regulations.md)

    
- **Configuring transport**

    WSO2 API Manager supports a range of transports. This topic covers how each transport is set up.
    
    For instructions to configure transports for each component, see the following topics:
    
    - [Configuring Transports for the Micro Integrator](mi-setup/transport_configurations/configuring-transports.md)
    - [Configuring Transports for the Streaming Integrator](si-setup/supporting-different-transports.md)
    
- **Performance Tuning**

    This topic covers different configurations done for the WSO2 API Manager and recommends values based on your requirements to optimize performance.
    
    For instructions to tune the performance for each component, see the following topics:
    
    - [Tuning Performance for the API Manager](deployment-best-practices/tuning-performance.md)
    - [Tuning Performance for the Micro Integrator](mi-setup/performance_tuning/tuning_jvm_performance.md)
    
The above activities need to be carried out separately for each runtime. The procedures to execute them are similar, but there can be slight differences between one component to another.

In addition, the component-specific setup tasks are as follows:

- **API Manager**

    - [**Setting up key managers**](distributed-deployment/configure-a-third-party-key-manager.md)
    
        This involves downloading a third party key manager application and setting it up so that WSO2 API Manager could communicate with it.
        
        !!! note
            Once a key manager is set up, you need to configure it to work with the API Manager in the Admin Portal. This is explained in the [Multiple Key Manager Support in WSO2 API Manager](../../administer/key-managers/overview.md)
        
    - [**Setting up Proxy Server and Load Balancer**](setting-up-proxy-server-and-the-load-balancer/configuring-the-proxy-server-and-the-load-balancer.md)
    
        A load balancer or reverse proxy is required to map external traffic with ports and URLs that WSO2 API Manager uses internally. This section explains how to configure such a load balancer.
        
    - [**Configuring caching**](advance-configurations/configuring-caching.md)
    
        This involves enabling caching in the API Gateway and Key Manger servers to optimize the efficiency with which the verification process for calls from the API Manager is carried out.
    
    - [**Customizing the Management Console**](advance-configurations/customizing-the-management-console.md)

        This explains how you can customize the WSO2 API-M Management Console by setting up the development environment, applying new styles, etc.
        
- **Micro Integrator**

    - [**Setting up the file-based registry**](mi-setup/deployment/file_based_registry.md)
    
        The Micro Integrator is shipped with a file-system-based registry to store registry artifacts. This section explains the default directory structure of the registry and how to change it if required.
    
    -*[**Setting up message brokers**](mi-setup/brokers/deploy-rabbitmq.md)
    
        This section explains how to set up the different message brokers with which the Micro Integrator component can integrate.
        
    - [**Setting up message builders and formatters**](mi-setup/message_builders_formatters/message-builders-and-formatters.md)
    
        When the Micro Integrator receives a request via a transport, the transport uses a **message builder** to process the payload and convert it to SOAP. 
        
        Similarly, when the Micro Integrator sends a message via a transport, the publishing transport uses a **message formatter** to present the payload in the required format. 
        
        This section explains how to configure these message builders and message formatters.
    
    - [**Configuring message relay**](mi-setup/message_builders_formatters/message-relay.md)
    
        Enabling message relay allows the Micro Integrator component to pass messages along without building or processing them unless specifically requested to do so. This way, the Micro Integrator can handle a higher throughput.
        
        This section guides you to enable and configure message relay.
        
    - [**Time stamp conversion for RDBMS**](mi-setup/feature_configs/configuring_timestamp_conversion_for_rdbms.md)
    
        This section explains how to enable/disable time stamp conversions for the RDBMS databases configured for the Micro Integrator component.

- **Streaming Integrator**

    - [**Configuring business rules deployment**](si-setup/configuring-business-rules-deployment.md)
    
        The Streaming Integrator component allows common Siddhi queries to be templated as business rules. Business users can use these rules when they need to write similar queries instead of writing the queries from scratch. This section explains how to configure a Streaming Integrator node to use a specified business rule template.
    
    - [**Configuring state persistence**](si-setup/configuring-database-and-file-system-state-persistence.md)
    
        This section explains how to prevent the loss of data that can result from a system failure by persisting the state of Streaming Integrator component periodically either into a database system or into the file system.
        
    - [**Configuring cluster coordination**](si-setup/configuring-cluster-coordination.md)
    
        This section explains how to configure a cluster coordination strategy that determines how the Streaming Integrator nodes in a cluster coordinate with each other.
        
    - [**Adding third party non-OSGi libraries**](si-setup/adding-third-party-non-osgi-libraries.md)
    
        The Streaming Integrator component is OSGi-based. Therefore, when you are adding non-OSGi libraries to the Streaming Integrator pack, you need to first convert them into OSGi bundles. This section provides instructions to do this.
    
    - [**Enabling logs for received event count**](si-setup/monitoring-received-events-count-via-logs.md)
    
        This section provides instructions to enable a log that  monitors the total number of event received by the Streaming Integrator component via its sources per given time interval. 

