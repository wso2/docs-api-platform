---
title: "Disabling message chunking"
description: "Disable chunked Transfer-Encoding for a specific API's backend requests using a custom mediation sequence."
canonical_url: https://wso2.com/api-platform/docs/api-manager/3.0.0/learn/api-gateway/message-mediation/disabling-message-chunking/
md_url: https://wso2.com/api-platform/docs/api-manager/3.0.0/learn/api-gateway/message-mediation/disabling-message-chunking.md
tags:
  - api-manager
  - learn
  - api-gateway
  - message-mediation
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "how-to"
---

# Disabling Message Chunking

When processing large messages, message chunking facilitates sending the message as multiple independent chunks. 
Message chunking is set using the `Transfer-Encoding: chunked` header. However, some legacy backends might not support 
chunked messages. To disable sending chunked messages to the backend for a specific API, follow the steps below:

1.  Create an `XML` file with the following content.

    !!! example
        ``` xml
        <sequence xmlns="http://ws.apache.org/ns/synapse" name="disableChunkingSeq">
            <property name="DISABLE_CHUNKING" value="true" scope="axis2"/>
        </sequence>
        ```

2.  Use the same sequence and apply it as a mediation extension to the inflow of this particular API.       
You can copy the content of the above sequence to an XML file and upload it to an API using Publisher Portal UI. For more information, visit [Creating and Uploading Manually in API Publisher](changing-the-default-mediation-flow-of-api-requests#creating-and-uploading-manually-in-api-publisher)

Once the API is published, chunking is disabled for the message that is sent to the backend.

!!! tip
    To stop chunked messages from being sent to the client, you can apply the same mediation extension to the 
    out sequence as well.
        


