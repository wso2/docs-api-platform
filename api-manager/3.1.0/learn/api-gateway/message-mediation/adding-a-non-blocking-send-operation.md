---
title: "Adding a Non-Blocking send operation"
description: "Configure a non-blocking Send mediator operation for transferring large files over the VFS transport."
canonical_url: https://wso2.com/api-platform/docs/api-manager/3.1.0/learn/api-gateway/message-mediation/adding-a-non-blocking-send-operation/
md_url: https://wso2.com/api-platform/docs/api-manager/3.1.0/learn/api-gateway/message-mediation/adding-a-non-blocking-send-operation.md
tags:
  - api-manager
  - learn
  - api-gateway
  - message-mediation
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-27
content_type: "how-to"
---

# Adding a Non-Blocking Send Operation

In this example, the Send mediator in a proxy service using the VFS transport is transferring a file to a VFS endpoint. 

**VFS** is a non-blocking transport by default, which means a new thread is spawned for each outgoing message. The `Property` mediator added before the `Send` mediator removes the `ClientAPINonBlocking` property from the message to perform the mediation in a single thread. This is required when the file being transferred is large and you want to avoid out-of-memory failures.

!!! example
    ```xml
    <inSequence>
       <property name="ClientApiNonBlocking"
               value="true"
               scope="axis2"
               action="remove"/>
       <send>
          <endpoint name="FileEpr">
             <address uri="vfs:file:////home/shammi/file-out"/>
          </endpoint>
       </send>
    </inSequence>
    ```