---
title: "Developing streaming integrator solutions"
description: "Get an overview of the four-step development flow for building a solution with the Streaming Integrator."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.2.0/develop/streaming-apps/developing-streaming-integration-solutions/
md_url: https://wso2.com/api-platform/docs/api-manager/4.2.0/develop/streaming-apps/developing-streaming-integration-solutions.md
tags:
  - api-manager
  - develop
  - streaming-apps
  - developing-streaming-integration-solutions
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "concept"
---

# Developing Streaming Integrator Solutions

This section provides an overview of the development flow in the Streaming Integrator.

Developing a Streaming Integrator solution involves the following four steps.


![Streaming Integrator Development Flow](../../assets/img/streaming/developing-si-solutions/si-development-workflow.png)

| **Step**                          | **Description**                                                                                                                   |
|-----------------------------------|-----------------------------------------------------------------------------------------------------------------------------------|
| **Step 1: Installing SI Tooling** |This involves downloading and installing the Streaming Integration Tooling in which Siddhi applications are designed. For more information, see the following topics:<br/> - [Installing the Streaming Integrator in a Virtual Machine](../../install-and-setup/install/installing-the-product/installing-si)<br/> - [Installing the Streaming Integrator in Docker](../../install-and-setup/install/installing-the-product/installing-in-containers/installing-si-using-docker)<br/> - [Installing the Streaming Integrator in Kubernetes](../../install-and-setup/install/installing-the-product/installing-in-containers/installing-si-using-kubernetes) |
| **Step 2: Creating Siddhi Applications** | Siddhi applications can be designed in the Streaming Integrator Tooling via the source view or the design view. For detailed instructions, see [Creating Siddhi Applications](creating-a-siddhi-application). |
| **Step 3: Testing Siddhi Applications** | Once a Siddhi application is created, you can test it before using it in a production environment by simulating events to it. For more information, see [Testing Siddhi Applications](testing-a-siddhi-application). |
| **Step 4: Deploying Siddhi Applications** | Once your Siddhi application is created and verified via the testing functionality in the Streaming Integrator Tooling, you can deploy it in the Streaming Integrator server, or deploy it in a Docker/Kubernetes environment. For more information about, see the following topics:<br/> - [Deploying Siddhi Applications](deploying-streaming-applications)<br/> - [Exporting Siddhi Applications](exporting-siddhi-applications)|
| **Step 5: Running Siddhi Applications** | This involves running the Siddhi application in the server where you deployed them. To try this out, you can follow the [Streaming Integrator Tutorials](../../use-cases/streaming-tutorials/tutorials-overview). |