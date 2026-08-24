---
title: "Integration overview"
description: "Get an overview of the Micro Integrator's enterprise integration capabilities shipped with WSO2 API Manager."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.0.0/integrate/integration-overview/
md_url: https://wso2.com/api-platform/docs/api-manager/4.0.0/integrate/integration-overview.md
tags:
  - api-manager
  - integrate
  - integration-overview
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "concept"
---

<style>
    @font-face {
    font-family: 'Material Icons';
    font-style: normal;
    font-weight: 400;
    src: url(https://wso2.cachefly.net/wso2/sites/all/fonts/docs/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2) format('woff2');
    }
 .material-icons {
    font-family: 'Material Icons';
    font-weight: normal;
    font-style: normal;
    font-size: 24px;
    line-height: 1;
    letter-spacing: normal;
    text-transform: none;
    display: inline-block;
    white-space: nowrap;
    word-wrap: normal;
    direction: ltr;
    -webkit-font-feature-settings: 'liga';
    -webkit-font-smoothing: antialiased;
    }
</style>

# Integration Overview

WSO2 API Manager 4.0.0 is shipped with an integration runtime (Micro Integrator) with comprehensive enterprise integration capabilities. Therefore, you can now use WSO2 API Manager to develop complex integration services and expose them as managed APIs in an API marketplace. This allows you to enable API-led connectivity across your business using a single platform.

## Get Started with Integration

Let's get started with the integration capabilities and concepts of the Micro Integrator of WSO2 API Manager.

<div>
    <div class="content">
        <!-- card -->
        <div class="card img" onclick="location.href='../../get-started/integration-quick-start-guide/';">
            <div class="line"></div>
            <div class="card-icon">
                <img src='../../assets/img/integrate/quick-start.png' alt="integration quick start" />
            </div>
            <div class="card-content" >
                <p class="title">Quick Start with Integration</p>
                <p class="hint">Try out a simple message mediation using the Micro Integrator.</p>
            </div>
        </div>
        <!-- end card -->
        <!-- card -->
        <div class="card img" onclick="location.href='../develop/integration-development-kickstart/';">
            <div class="line"></div>
            <div class="card-icon">
                <img src='../../assets/img/integrate/first-service.png' alt="develop first integration" />
            </div>
            <div class="card-content">
                <p class="title">Develop your First Integration</p>
                <p class="hint">Build a simple integration scenario using WSO2 Integration Studio.</p>
            </div>
        </div>
        <!-- end card -->
        <!-- card -->
        <div class="card img" onclick="location.href='../integration-key-concepts/';">
            <div class="line"></div>
            <div class="card-icon">
                <img src='../../assets/img/integrate/key-concepts.png' alt="integration key concepts" />
            </div>
            <div class="card-content">
                <p class="title">Key Concepts of Integration</p>
                <p class="hint">Explore the key concepts used by the Micro Integrator.</p>
            </div>
        </div>
        <!-- end card -->
    </div>
</div>

## Integration Strategy

You can now leverage the integration capabilities as well as the API management capabilities of the product to implement any of the following integration strategies.

### API-led Integration

WSO2 API Manager consists of an API management layer as well as an integration layer, which enables API-led integration through a single platform. The integration layer (Micro Integrator) is used for running the integration APIs, which are developed using WSO2 Integration Studio. The API management layer is used for converting the integration APIs into experience APIs and making them discoverable to developers. 

See <a href="../api-led-integration.md">API-led Integration</a> for more information.

### Microservices Integration

The Micro Integrator is lightweight and container friendly. This allows you to leverage the comprehensive enterprise messaging capabilities of the Micro Integrator in your decentralized, cloud-native integrations.

<img src="../../assets/img/integrate/intro/mi-microservices-architecture.png" width="700">

If your organization is running on a decentralized, cloud-native, integration architecture where microservices are used for integrating the various APIs, events, and systems, the Micro Integrator can easily function as your Integration microservices and API microservices.

### Centralized Integration (Enterprise Service Bus)

At the heart of the Micro Integrator server is an event-driven, standards-based messaging engine (the Bus). This ESB supports message routing, message transformations, and other types of messaging use cases. If your organization uses an API-driven, centralized, integration architecture, the Micro Integrator can be used as the central integration layer that implements the message mediation logic connecting all the systems, data, events, APIs, etc. in your integration ecosystem.

<img src="../../assets/img/integrate/intro/mi-esb-architecture.png" width="700">

## Learn Integration

See the topics in the following sections for details and instructions.

### Integration Use Cases

Learn about the main integration capabilities of the Micro Integrator of WSO2 API Manager. You can also follow the [tutorials](#integration-tutorials) on each of these use cases to gain hands-on knowledge.

<div>
    <div class="content">
        <!-- card -->
        <div class="card" onclick="location.href='../integration-use-case/message-routing-overview/';">
            <div class="line"></div>
            <div class="card-content" >
                <p class="title">Message Routing</p>
                <p class="hint">Explore how messages are routed to different endpoints.</p>
            </div>
        </div>
        <!-- end card -->
        <!-- card -->
        <div class="card" onclick="location.href='../integration-use-case/message-routing-overview/';">
            <div class="line"></div>
            <div class="card-content" >
                <p class="title">Message Transformation</p>
                <p class="hint">Explore how messages are transformed into different formats.</p>
            </div>
        </div>
        <!-- end card -->
        <!-- card -->
        <div class="card" onclick="location.href='../integration-use-case/data-integration-overview/';">
            <div class="line"></div>
            <div class="card-content" >
                <p class="title">Data Integration</p>
                <p class="hint">Explore how data from various sources are used during message mediation.</p>
            </div>
        </div>
        <!-- end card -->
    </div>
    <div class="content">
        <!-- card -->
        <div class="card" onclick="location.href='../integration-use-case/file-processing-overview/';">
            <div class="line"></div>
            <div class="card-content">
                <p class="title">File Processing</p>
                <p class="hint">Explore how data from file systems are moved and used during message mediation.</p>
            </div>
        </div>
        <!-- end card -->
        <!-- card -->
        <div class="card" onclick="location.href='../integration-use-case/connectors/';">
            <div class="line"></div>
            <div class="card-content" >
                <p class="title">SaaS and B2B Connectivity</p>
                <p class="hint">Explore how to integrate with third-party systems using WSO2 connectors.</p>
            </div>
        </div>
        <!-- end card -->
        <!-- card -->
        <div class="card" onclick="location.href='../integration-use-case/service-orchestration-overview/';">
            <div class="line"></div>
            <div class="card-content" >
                <p class="title">Service Orchestration</p>
                <p class="hint">Explore how multiple Restful services are exposed as a single course-grained service.</p>
            </div>
        </div>
        <!-- end card -->
    </div>
    <div class="content">
        <!-- card -->
        <div class="card" onclick="location.href='../integration-use-case/asynchronous-message-overview/';">
            <div class="line"></div>
            <div class="card-content" >
                <p class="title">Enterprise Messaging</p>
                <p class="hint">Explore asynchronous messaging patterns using message brokers.</p>
            </div>
        </div>
        <!-- end card -->
        <!-- card -->
        <div class="card" onclick="location.href='../integration-use-case/scheduled-task-overview/';">
            <div class="line"></div>
            <div class="card-content" >
                <p class="title">Scheduled Integration Processes</p>
                <p class="hint">Explore how integration processes are scheduled and executed periodically.</p>
            </div>
        </div>
        <!-- end card -->
        <!-- card -->
        <div class="card" onclick="location.href='../integration-use-case/protocol-switching-overview/';">
            <div class="line"></div>
            <div class="card-content">
                <p class="title">Protocol Switching</p>
                <p class="hint">Explore how message protocols are changed during message mediation.</p>
            </div>
        </div>
        <!-- end card -->
    </div>
</div>

### Integration Development

Learn how to set up the development environment and build integration solutions.

<div>
    <div class="content">
        <!-- card -->
        <div class="card" onclick="location.href='../develop/wso2-integration-studio/';">
            <div class="line"></div>
            <div class="card-content" >
                <p class="title">Quick Tour - WSO2 Integration Studio</p>
                <p class="hint">Get an overview of the developer tool that you will use for developing integrations.</p>
            </div>
        </div>
        <!-- end card -->
        <!-- card -->
        <div class="card" onclick="location.href='../develop/installing-wso2-integration-studio/';">
            <div class="line"></div>
            <div class="card-content" >
                <p class="title">Install WSO2 Integration Studio</p>
                <p class="hint">Install and set up WSO2 Integration Studio.</p>
            </div>
        </div>
        <!-- end card -->
        <!-- card -->
        <div class="card" onclick="location.href='../develop/intro-integration-development/';">
            <div class="line"></div>
            <div class="card-content">
                <p class="title">Development Workflow</p>
                <p class="hint">Get an overview of the integration development workflow.</p>
            </div>
        </div>
        <!-- end card -->
    </div>
</div>

See the **Developing Integrations** section in the left-hand navigator for more topics on working with integrations.

### Management and Observability

Learn about the dashboards, tools, and solutions that are available for managing and monitoring integrations deployed in the Micro Integrator.

<div>
    <div class="content">
        <!-- card -->
        <div class="card" onclick="location.href='../../observe/mi-observe/working-with-monitoring-dashboard/';">
            <div class="line"></div>
            <div class="card-content" >
                <p class="title">Micro Integrator Dashboard</p>
                <p class="hint">Dashboard for monitoring integration artifacts in a Micro Integrator cluster.</p>
            </div>
        </div>
        <!-- end card -->
        <!-- card -->
        <div class="card" onclick="location.href='{{ base_bath }}/install-and-setup/setup/api-controller/managing-integrations/managing-integrations-with-ctl';">
            <div class="line"></div>
            <div class="card-content" >
                <p class="title">APICTL (CLI for Integration)</p>
                <p class="hint">Command-line tool for monitoring integration artifacts in a Micro Integrator instance.</p>
            </div>
        </div>
        <!-- end card -->
        <!-- card -->
        <div class="card" onclick="location.href='../../observe/micro-integrator/cloud-native-observability-overview/';">
            <div class="line"></div>
            <div class="card-content">
                <p class="title">Observability for Integrations</p>
                <p class="hint">Observability solution for integrations deployed in a Micro Integrator cluster.</p>
            </div>
        </div>
        <!-- end card -->
    </div>
</div>

### DevOps and Administration

Learn how to set up a Micro Integrator deployment and configure the deployment according to your requirements.

<div>
    <div class="content">
        <!-- card -->
        <div class="card" onclick="location.href='../../install-and-setup/install-and-setup-overview/#installing_1';">
            <div class="line"></div>
            <div class="card-content" >
                <p class="title">Installation</p>
                <p class="hint">Install the Micro Integrator in your environment.</p>
            </div>
        </div>
        <!-- end card -->
        <!-- card -->
        <div class="card" onclick="location.href='{{ base_bath }}/install-and-setup/install-and-setup-overview/#deploying_1';">
            <div class="line"></div>
            <div class="card-content">
                <p class="title">Deployment</p>
                <p class="hint">Select a deployment strategy and set up a deployment (on containers or VMs).</p>
            </div>
        </div>
        <!-- end card -->
        <!-- card -->
        <div class="card" onclick="location.href='../../install-and-setup/install-and-setup-overview/#upgrading_1';">
            <div class="line"></div>
            <div class="card-content">
                <p class="title">Upgrade</p>
                <p class="hint">Upgrade to the latest Micro Integrator from previous product versions.</p>
            </div>
        </div>
        <!-- end card -->
    </div>
    <div class="content">
        <!-- card -->
        <div class="card" onclick="location.href='../../install-and-setup/install-and-setup-overview/#setting-up_1';">
            <div class="line"></div>
            <div class="card-content" >
                <p class="title">Configuration and Set up</p>
                <p class="hint">Configure Security, Data Stores, Perfomance, Message Brokers, Transports, etc.</p>
            </div>
        </div>
        <!-- end card -->
        <!-- card -->
        <div class="card" onclick="location.href='../../install-and-setup/setup/mi-setup/user_stores/managing_users/';">
            <div class="line"></div>
            <div class="card-content" >
                <p class="title">User Management</p>
                <p class="hint">Configure a user store and manage users and roles in the Micro Integrator.</p>
            </div>
        </div>
        <!-- end card -->
        <!-- card -->
        <div class="card" onclick="location.href='{{ base_bath }}/install-and-setup/setup/api-controller/getting-started-with-wso2-api-controller';">
            <div class="line"></div>
            <div class="card-content">
                <p class="title">CICD Pipelines</p>
                <p class="hint">Implement CICD pipelines for your deployment (on containers or VMs).</p>
            </div>
        </div>
        <!-- end card -->
    </div>
</div>

### Integration Tutorials

Learn how to implement various integration use cases, deploy them in the Micro Integrator, and test them locally.

-   API-led Integration tutorials

    <table>
    <tr>
        <td>
            <a href="../../tutorials/integration-tutorials/service-catalog-tutorial.md">Exposing an Integration Service as a Managed API</a>
        </td>
    </tr>
    </table>

-   Message mediation tutorials

    <table>
        <tr>
            <td>
                <ul>
                    <li><a href="../../tutorials/integration-tutorials/sending-a-simple-message-to-a-service.md">Sending a Simple Message to a Service</a></li>
                    <li><a href="../../tutorials/integration-tutorials/routing-requests-based-on-message-content.md">Routing Requests based on Message Headers</a></li>
                    <li><a href="../../tutorials/integration-tutorials/transforming-message-content.md">Translating Message Formats</a></li>
                    <li><a href="../../tutorials/integration-tutorials/exposing-several-services-as-a-single-service.md">Exposing Several Services as a Single Service</a></li>
                    <li><a href="../../tutorials/integration-tutorials/storing-and-forwarding-messages.md">Store and Forward Messages for Guaranteed Delivery</a></li>
                    <li><a href="../../tutorials/integration-tutorials/sending-a-simple-message-to-a-datasource.md">Exposing Datasources as a Service</a></li>
                </ul>
            </td>
            <td>
                <ul>
                    <li><a href="../../tutorials/integration-tutorials/file-processing.md">File Processing</a></li>
                    <li><a href="../../tutorials/integration-tutorials/using-scheduled-tasks.md">Periodic Execution of Integration Process</a></li>
                    <li><a href="../../tutorials/integration-tutorials/using-inbound-endpoints.md">Using Inbound Endpoints</a></li>
                    <li><a href="../../tutorials/integration-tutorials/using-templates.md">Reusing Mediation Sequences</a></li>
                    <li><a href="../../tutorials/integration-tutorials/sap-integration.md">Sending Emails from an Integration Service</a></li>
                </ul>
            </td>
        </tr>
    </table>

### Integration Examples

<table>
    <tr>
        <td><b>Message Routing</b> 
            <ul>
                <li><a href="../examples/routing_examples/routing_based_on_headers.md">Routing Based on Message Headers</a></li>
                <li><a href="../examples/routing_examples/routing_based_on_payloads.md">Routing Based on Message Payload</a></li>
                <li><a href="../examples/routing_examples/splitting_aggregating_messages.md">Splitting Messages and Aggregating Responses</a></li>
            </ul>
        </td>
    </tr>
    <tr>
        <td><b>Message Transformation</b> 
            <ul>
                <li><a href="../examples/message_transformation_examples/json-to-soap-conversion.md">Converting JSON Messages to SOAP</a></li>
                <li><a href="../examples/message_transformation_examples/pox-to-json-conversion.md">Converting POX Messages to JSON</a></li>
            </ul>
        </td>
    </tr>
    <tr>
        <td><b>Asynchronous Messaging</b>
            <li>RabbitMQ Examples
                <ul>
                    <li><a href="../examples/rabbitmq_examples/point-to-point-rabbitmq.md">Point to Point</a></li>
                    <li><a href="../examples/rabbitmq_examples/pub-sub-rabbitmq.md">Publish/Subscribe</a></li>
                    <li>Guaranteed Delivery 
                        <ul>
                            <li><a href="../examples/rabbitmq_examples/store-forward-rabbitmq.md">Message Store and Message Processor</a></li>
                            <li><a href="../examples/rabbitmq_examples/retry-delay-failed-msgs-rabbitmq.md">Retry failed messages with a delay</a></li>
                            <li><a href="../examples/rabbitmq_examples/requeue-msgs-with-errors-rabbitmq.md">Requeue a message preserving the order</a></li>
                            <li><a href="../examples/rabbitmq_examples/move-msgs-to-dlq-rabbitmq.md">Publish messages to DLX</a></li>
                        </ul>
                    </li>
                    <li><a href="../examples/rabbitmq_examples/request-response-rabbitmq.md">Dual Channel</a></li>
                </ul>
            </li>
            <li>JMS Examples
                <ul>
                    <li><a href="../examples/jms_examples/consuming-jms.md">Consuming JMS Messages</a></li>
                    <li><a href="../examples/jms_examples/producing-jms.md">Producing JMS Messages</a></li>
                    <li><a href="../examples/jms_examples/consume-produce-jms.md">Consuming and Producing JMS Messages</a></li>
                    <li><a href="../examples/jms_examples/dual-channel-http-to-jms.md">Dual Channel HTTP-to-JMS</a></li>
                    <li><a href="../examples/jms_examples/quad-channel-jms-to-jms.md">Quad Channel JMS-to-JMS</a></li>
                    <li><a href="../examples/jms_examples/guaranteed-delivery-with-failover.md">Guaranteed Delivery with Failover</a></li>
                    <li><a href="../examples/jms_examples/publish-subscribe-with-jms.md">Publish and Subscribe with JMS</a></li>
                    <li><a href="../examples/jms_examples/shared-topic-subscription.md">Shared Topic Subscription</a></li>
                    <li><a href="../examples/jms_examples/detecting-repeatedly-redelivered-messages.md">Detecting Repeatedly Redelivered Messages</a></li>
                    <li><a href="../examples/jms_examples/specifying-a-delivery-delay-on-messages.md">Specifying Delivery Delay on Messages</a></li>
                </ul>
            </li>
        </td>
    </tr>
    <tr>
        <td><b>Protocol Switching</b>
            <ul>
                <li><a href="../examples/protocol-switching/switching_from_jms_to_http/">Switching from JMS to HTTP/S</a></li>
                <li><a href="../examples/protocol-switching/switching_from_https_to_jms/">Switching from HTTP/S to JMS</a></li>
                <li><a href="../examples/protocol-switching/switching_from_ftp_listener_to_mail_sender/">Switching from FTP Listener to Mail Sender</a></li>
                <li><a href="../examples/protocol-switching/switching_from_http_to_fix/">Switching from HTTP to FIX</a></li>
                <li><a href="../examples/protocol-switching/switching_from_fix_to_http/">Switch from FIX to HTTP</a></li>
                <li><a href="../examples/protocol-switching/switching_from_fix_to_amqp/">Switch from FIX to AMQP</a></li>
                <li><a href="../examples/protocol-switching/switching_between_fix_versions/">Switching between FIX Versions</a></li>
                <li><a href="../examples/protocol-switching/switching_from_tcp_to_https/">Switching from TCP to HTTP/S</a></li>
                <li><a href="../examples/protocol-switching/switching_from_udp_to_https/">Switching from UDP to HTTP/S</a></li>
                <li><a href="../examples/protocol-switching/switching_between_http_and_msmq/">Switching between HTTP to MSMQ</a></li>
            </ul>
        </td>
    </tr>
    <tr>
        <td><b>File Processing</b> 
            <ul>
                <li><a href="../examples/file-processing/vfs-transport-examples.md">Using VFS for File Transferring</a></li>
                <li><a href="../examples/file-processing/accessing_windows_share_using_vfs_transport/">Accessing a Windows Share Using VFS</a></li>
                <li><a href="../examples/file-processing/mailto-transport-examples.md">Sending and Receiving Emails</a></li>
            </ul>
        </td>
    </tr>
    <tr>
        <td><b>Data Integration</b>
            <ul>
                <li><a href="../examples/data_integration/rdbms-data-service.md">Exposing an RDBMS datasource</a></li>
                <li>Exposing Other Datasources
                    <ul>
                        <li><a href="../examples/data_integration/csv-data-service.md">Exposing a CSV datasource</a></li>
                        <li><a href="../examples/data_integration/carbon-data-service.md">Exposing a Carbon datasource</a></li>
                    </ul>
                </li>
                <li><a href="../examples/data_integration/json-with-data-service.md">Exposing Data in JSON Format</a></li>
                <li><a href="../examples/data_integration/odata-service.md">Using an OData Service</a></li>
                <li><a href="../examples/data_integration/nested-queries-in-data-service.md">Using Nested Data Queries</a></li>
                <li><a href="../examples/data_integration/batch-requesting.md">Batch Requesting</a></li>
                <li><a href="../examples/data_integration/request-box.md">Invoking Multiple Operations as a Request Box</a></li>
                <li><a href="../examples/data_integration/distributed-trans-data-service.md">Using Distributed Transactions in Data Services</a></li>
                <li><a href="../examples/data_integration/data-input-validator.md">Validating Data Input</a></li>
                <li><a href="../examples/data_integration/swagger-data-services.md">Swagger Documents of RESTful Data Services</a></li>
            </ul>
        </td>
    </tr>
    <tr>
        <td><b>Examples of Components</b>
            <ul>
                <li>REST APIs 
                    <ul>
                        <li><a href="../examples/rest_api_examples/introduction-rest-api.md">Using a Simple REST API</a></li>
                        <li><a href="../examples/rest_api_examples/setting-query-params-outgoing-messages.md">Setting Query Parameters on Outgoing Messages</a></li>
                        <li><a href="../examples/rest_api_examples/enabling-rest-to-soap.md">Exposing a SOAP Endpoint as a RESTful API</a></li>
                        <li><a href="../examples/rest_api_examples/configuring-non-http-endpoints.md">Exposing Non-HTTP Services as RESTful APIs</a></li>
                        <li><a href="../examples/rest_api_examples/handling-non-matching-resources.md">Handling Non-Matching Resources</a></li>
                        <li><a href="../examples/rest_api_examples/setting-https-status-codes.md">Handling HTTP Status Codes</a></li>
                        <li><a href="../examples/rest_api_examples/transforming-content-type.md">Transforming Content Types</a></li>
                        <li><a href="../examples/rest_api_examples/securing-rest-apis.md">Securing a REST API</a></li>
                        <li><a href="../examples/rest_api_examples/publishing-a-swagger-api.md">Publishing a Custom Swagger Document</a></li>
                        <li>Handling Special Cases
                            <ul>
                                <li><a href="../examples/rest_api_examples/special-cases.md#get-request-with-a-message-body">Using GET with a Message Body</a></li>
                                <li><a href="../examples/rest_api_examples/special-cases.md#using-post-with-an-empty-body">Using POST with Empty Message Body</a></li>
                                <li><a href="../examples/rest_api_examples/special-cases.md#using-post-with-query-parameters">Using POST with Query Parameters</a></li>
                            </ul>
                        </li>
                    </ul>
                </li>
                <li>Proxy Services 
                    <ul>
                        <li><a href="../examples/proxy_service_examples/introduction-to-proxy-services.md">Using a Simple Proxy Service</a></li>
                        <li><a href="../examples/proxy_service_examples/publishing-a-custom-wsdl.md">Publishing a Custom WSDL</a></li>
                        <li><a href="../examples/proxy_service_examples/exposing-proxy-via-inbound.md">Exposing a Proxy Service via Inbound Endpoints</a></li>
                        <li><a href="../examples/proxy_service_examples/securing-proxy-services.md">Securing a Proxy Service</a></li>
                    </ul>
                </li>
                <li>Inbound Endpoints 
                    <ul>
                        <li><a href="../examples/inbound_endpoint_examples/inbound-endpoint-jms-protocol.md">JMS Inbound Endpoint</a></li>
                        <li><a href="../examples/inbound_endpoint_examples/file-inbound-endpoint.md">File Inbound Endpoint</a></li>
                        <li><a href="../examples/inbound_endpoint_examples/inbound-endpoint-http-protocol.md">HTTP Inbound Endpoint</a></li>
                        <li><a href="../examples/inbound_endpoint_examples/inbound-endpoint-https-protocol.md">HTTPS Inbound Endpoint</a></li>
                        <li><a href="../examples/inbound_endpoint_examples/inbound-endpoint-hl7-protocol-auto-ack.md">HL7 Inbound Endpoint</a></li>
                        <li><a href="../examples/inbound_endpoint_examples/inbound-endpoint-mqtt-protocol.md">MQTT Inbound Endpoint</a></li>
                        <li><a href="../examples/inbound_endpoint_examples/inbound-endpoint-rabbitmq-protocol.md">RabbitMQ Inbound Endpoint</a></li>
                        <li><a href="../examples/inbound_endpoint_examples/inbound-endpoint-kafka.md">Kafka Inbound Endpoint</a></li>
                        <li><a href="../examples/inbound_endpoint_examples/inbound-endpoint-secured-websocket.md">Secured WebSocket Inbound Endpoint</a></li>
                        <li><a href="../examples/inbound_endpoint_examples/inbound-endpoint-with-registry.md">Using Inbound Endpoints with Registry</a></li>
                    </ul>
                </li>
                <li>Scheduled Tasks 
                    <ul>
                        <li><a href="../examples/scheduled-tasks/task-scheduling-simple-trigger.md">Task Scheduling using a Simple Trigger</a></li>
                        <li><a href="../examples/scheduled-tasks/injecting-messages-to-rest-endpoint.md">Injecting Messages to a RESTful Endpoint</a></li>
                    </ul>
                </li>
                <li><a href="../examples/registry_examples/local-registry-entries.md">Local Registry Entries</a></li>
                <li>Templates 
                    <ul>
                        <li><a href="../examples/template_examples/using-sequence-templates.md">Using Sequence Templates</a></li>
                        <li><a href="../examples/template_examples/using-endpoint-templates.md">Using Endpoint Templates</a></li>
                    </ul>
                </li>
                <li>Message Stores & Processors 
                    <ul>
                        <li><a href="../examples/message_store_processor_examples/intro-message-stores-processors.md">Introduction to Message Stores and Processors</a></li>
                        <li><a href="../examples/message_store_processor_examples/using-jdbc-message-store.md">JDBC Message Store</a></li>
                        <li><a href="../examples/message_store_processor_examples/using-jms-message-stores.md">JMS Message Store</a></li>
                        <li><a href="../examples/message_store_processor_examples/using-rabbitmq-message-stores.md">RabbitMQ Message Store</a></li>
                        <li><a href="../examples/message_store_processor_examples/using-message-sampling-processor.md">Message Sampling Processor</a></li>
                        <li><a href="../examples/message_store_processor_examples/using-message-forwarding-processor.md">Message Forwarding Processor</a></li>
                        <li><a href="../examples/message_store_processor_examples/securing-message-processor.md">Securing the Message Forwarding Processor</a></li>
                        <li><a href="../examples/message_store_processor_examples/loadbalancing-with-message-processor.md">Load Balancing with Message Forwarding Processor</a></li>
                    </ul>
                </li>
                <li>Endpoints 
                    <ul>
                        <li><a href="../examples/endpoint_examples/using-address-endpoints.md">Address Endpoint</a></li>
                        <li><a href="../examples/endpoint_examples/using-failover-endpoints.md">Failover Endpoints</a></li>
                        <li><a href="../examples/endpoint_examples/using-http-endpoints.md">HTTP Endpoint</a></li>
                        <li><a href="../examples/endpoint_examples/using-websocket-endpoints.md">WebSocket Endpoint</a></li>
                        <li><a href="../examples/endpoint_examples/using-wsdl-endpoints.md">WSDL Endpoint</a></li>
                        <li><a href="../examples/endpoint_examples/using-loadbalancing-endpoints.md">Load Balance Endpoint</a></li>
                        <li>Recipient List of Endpoints
                            <ul>
                                <li><a href="../examples/endpoint_examples/using-static-recepient-list-endpoints.md">Static List of Recepients</a></li>
                                <li><a href="../examples/endpoint_examples/using-dynamic-recepient-list-endpoints-1.md">Dynamic List of Recepients</a></li>
                                <li><a href="../examples/endpoint_examples/using-dynamic-recepient-list-endpoints-2.md">Dynamic List of Recepients with Aggregated Responses</a></li>
                            </ul>
                        </li>
                        <li><a href="../examples/endpoint_examples/reusing-endpoints.md">Reusing Endpoints</a></li>
                        <li><a href="../examples/endpoint_examples/endpoint-error-handling.md">Endpoint Error Handling</a></li>
                        <li><a href="../examples/endpoint_examples/mtom-swa-with-endpoints.md">MTOM and SwA Optimizations</a></li>
                    </ul>
                </li>
                <li>Sequences 
                    <ul>
                        <li><a href="../examples/sequence_examples/using-multiple-sequences.md">Breaking Complex Flows into Multiple Sequences</a></li>
                        <li><a href="../examples/sequence_examples/using-fault-sequences.md">Using Fault Sequences</a></li>
                        <li><a href="../examples/sequence_examples/custom-sequences-with-proxy-services.md">Reusing Sequences</a></li>
                    </ul>
                </li>
                <li>Transports 
                    <ul>
                        <li><a href="../examples/transport_examples/tcp-transport-examples.md">Using the TCP Transport</a></li>
                        <li><a href="../examples/transport_examples/fix-transport-examples.md">Using the FIX Transport</a></li>
                        <li><a href="../examples/transport_examples/pub-sub-using-mqtt.md">Using the MQTT Transport</a></li>
                    </ul>
                </li>
            </ul>
        </td>
    </tr>
    <tr>
        <td>
            <ul>
                <li><a href="../examples/working-with-transactions.md">Transactions</a></li>
            </ul>
        </td>
    </tr>
    <tr>
        <td>
            <ul>
                <li><a href="../examples/json_examples/json-examples.md">JSON Examples</a></li>
            </ul>
        </td>
    </tr>
</table>