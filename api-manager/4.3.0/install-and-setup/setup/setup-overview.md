---
title: "Setup overview"
description: "Get an overview of setup tasks for API Manager, Micro Integrator, and Streaming Integrator, including databases, user stores, security, and transports."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.3.0/install-and-setup/setup/setup-overview/
md_url: https://wso2.com/api-platform/docs/api-manager/4.3.0/install-and-setup/setup/setup-overview.md
tags:
  - api-manager
  - install-and-setup
  - setup
  - setup-overview
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-18
content_type: "concept"
---

# Setup Overview

Setting up involves doing the required configurations for the API Manager and its components before running them in the production environment. The following are some common set up tasks that you are required to do separately for each component.

- **Updating the component**

    This involves applying the latest [WSO2 updates](https://wso2.com/updates) to each component so that each component is updated with the latest bug fixes and software improvement.

- **Configuring databases**

    This involves setting up databases for each component to store data.
    
    For instructions to set up databases for each component, see the following topics:
    
    - [Setting up Databases for the API Manager](../../install-and-setup/setup/setting-up-databases/overview.md)
    - [Setting up Databases for the Micro Integrator](https://mi.docs.wso2.com/en/latest/install-and-setup/setup/databases/setting-up-mysql/)
    - [Setting up Databases for the Streaming Integrator](../../install-and-setup/setup/si-setup/configuring-data-sources.md)
    
- **Configuring primary user stores**

    A user store is the database where information of the users and/or user roles are stored. This topic describes how to configure and manage different primary user stores. 
    
    For instructions to set up primary user stores for each component, see the following topics:
    
    - [Configuring Primary User Stores for the API Manager](../../administer/managing-users-and-roles/managing-user-stores/introduction-to-userstores.md)
    - [Configuring Primary User Stores for the Micro Integrator](https://mi.docs.wso2.com/en/latest/install-and-setup/setup/user-stores/setting-up-a-userstore/)
    
- **Configuring security**

    This covers topic such as key stores, securer vaults, GDPR compliance and working with secrets.
    
    For instructions to configure security for each component, see the following topics:
    
    - [Configuring Security for the API Manager](../../install-and-setup/setup/security/logins-and-passwords/maintaining-logins-and-passwords.md)
    - [Configuring Security for the Micro Integrator](../../install-and-setup/setup/mi-setup/security/creating_keystore.md)
    - [Configuring Security for the Streaming Integrator](../../install-and-setup/setup/si-setup/general-data-protection-regulations.md)

    
- **Configuring transport**

    WSO2 API Manager supports a range of transports. This topic covers how each transport is set up.
    
    For instructions to configure transports for each component, see the following topics:
    
    - [Configuring Transports for the Micro Integrator](https://mi.docs.wso2.com/en/latest/install-and-setup/setup/transport-configurations/configuring-transports/)
    - [Configuring Transports for the Streaming Integrator](../../install-and-setup/setup/si-setup/supporting-different-transports.md)
    
- **Performance Tuning**

    This topic covers different configurations done for the WSO2 API Manager and recommends values based on your requirements to optimize performance.
    
    For instructions to tune the performance for each component, see the following topics:
    
    - [Tuning Performance for the API Manager](../../install-and-setup/setup/deployment-best-practices/tuning-performance.md)
    - [Tuning Performance for the Micro Integrator](https://mi.docs.wso2.com/en/latest/install-and-setup/setup/performance-tuning/tuning-jvm-performance/)
    
The above activities need to be carried out separately for each runtime. The procedures to execute them are similar, but there can be slight differences between one component to another.

In addition, the component-specific setup tasks are as follows:

- **API Manager**

    - [**Setting up key managers**](../../install-and-setup/setup/distributed-deployment/configure-a-third-party-key-manager.md)
    
        This involves downloading a third party key manager application and setting it up so that WSO2 API Manager could communicate with it.
        
        !!! note
            Once a key manager is set up, you need to configure it to work with the API Manager in the Admin Portal. This is explained in the [Multiple Key Manager Support in WSO2 API Manager](../../administer/key-managers/overview.md)
        
    - [**Setting up Proxy Server and Load Balancer**](../../install-and-setup/setup/setting-up-proxy-server-and-the-load-balancer/configuring-the-proxy-server-and-the-load-balancer.md)
    
        A load balancer or reverse proxy is required to map external traffic with ports and URLs that WSO2 API Manager uses internally. This section explains how to configure such a load balancer.
        
    - [**Configuring caching**](../../install-and-setup/setup/advance-configurations/configuring-caching.md)
    
        This involves enabling caching in the API Gateway and Key Manger servers to optimize the efficiency with which the verification process for calls from the API Manager is carried out.
    
    - [**Customizing the Management Console**](../../install-and-setup/setup/advance-configurations/customizing-the-management-console.md)

        This explains how you can customize the WSO2 API-M Management Console by setting up the development environment, applying new styles, etc.
        
- **Micro Integrator**

    - [**Setting up the file-based registry**](https://mi.docs.wso2.com/en/latest/install-and-setup/setup/deployment/file-based-registry/)
    
        The Micro Integrator is shipped with a file-system-based registry to store registry artifacts. This section explains the default directory structure of the registry and how to change it if required.
    
    -*[**Setting up message brokers**](https://mi.docs.wso2.com/en/latest/install-and-setup/setup/brokers/deploy-rabbitmq/)
    
        This section explains how to set up the different message brokers with which the Micro Integrator component can integrate.
        
    - [**Setting up message builders and formatters**](https://mi.docs.wso2.com/en/latest/install-and-setup/setup/message-builders-formatters/message-builders-and-formatters/)
    
        When the Micro Integrator receives a request via a transport, the transport uses a **message builder** to process the payload and convert it to SOAP. 
        
        Similarly, when the Micro Integrator sends a message via a transport, the publishing transport uses a **message formatter** to present the payload in the required format. 
        
        This section explains how to configure these message builders and message formatters.
    
    - [**Configuring message relay**](https://mi.docs.wso2.com/en/latest/install-and-setup/setup/message-builders-formatters/message-relay/)
    
        Enabling message relay allows the Micro Integrator component to pass messages along without building or processing them unless specifically requested to do so. This way, the Micro Integrator can handle a higher throughput.
        
        This section guides you to enable and configure message relay.
        
    - [**Time stamp conversion for RDBMS**](https://mi.docs.wso2.com/en/latest/install-and-setup/setup/feature-configs/configuring-timestamp-conversion-for-rdbms/)
    
        This section explains how to enable/disable time stamp conversions for the RDBMS databases configured for the Micro Integrator component.

- **Streaming Integrator**

    - [**Configuring business rules deployment**](../../install-and-setup/setup/si-setup/configuring-business-rules-deployment.md)
    
        The Streaming Integrator component allows common Siddhi queries to be templated as business rules. Business users can use these rules when they need to write similar queries instead of writing the queries from scratch. This section explains how to configure a Streaming Integrator node to use a specified business rule template.
    
    - [**Configuring state persistence**](../../install-and-setup/setup/si-setup/configuring-database-and-file-system-state-persistence.md)
    
        This section explains how to prevent the loss of data that can result from a system failure by persisting the state of Streaming Integrator component periodically either into a database system or into the file system.
        
    - [**Configuring cluster coordination**](../../install-and-setup/setup/si-setup/configuring-cluster-coordination.md)
    
        This section explains how to configure a cluster coordination strategy that determines how the Streaming Integrator nodes in a cluster coordinate with each other.
        
    - [**Adding third party non-OSGi libraries**](../../install-and-setup/setup/si-setup/adding-third-party-non-osgi-libraries.md)
    
        The Streaming Integrator component is OSGi-based. Therefore, when you are adding non-OSGi libraries to the Streaming Integrator pack, you need to first convert them into OSGi bundles. This section provides instructions to do this.
    
    - [**Enabling logs for received event count**](../../install-and-setup/setup/si-setup/monitoring-received-events-count-via-logs.md)
    
        This section provides instructions to enable a log that  monitors the total number of event received by the Streaming Integrator component via its sources per given time interval. 

