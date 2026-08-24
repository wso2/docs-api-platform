---
title: "Disabling message chunking"
description: "Disable chunked message transfer to the backend for an API whose legacy backend does not support the Transfer-Encoding header."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.0.0/deploy-and-publish/deploy-on-gateway/api-gateway/message-mediation/disabling-message-chunking/
md_url: https://wso2.com/api-platform/docs/api-manager/4.0.0/deploy-and-publish/deploy-on-gateway/api-gateway/message-mediation/disabling-message-chunking.md
tags:
  - api-manager
  - deploy-and-publish
  - deploy-on-gateway
  - api-gateway
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "how-to"
---

# Disabling Message Chunking

When processing large messages, message chunking facilitates sending the message as multiple independent chunks. 
Message chunking is set using the `Transfer-Encoding: chunked` header. However, some legacy backends might not support 
chunked messages. To disable sending chunked messages to the backend for a specific API, follow the steps below:

1.  Go to the created API and from the Left Menu, go to **API Configurations** --> **Runtime**.
2.  Click [![Edit](../../../../assets/img/learn/api-gateway/message-mediation/edit-button.png)](../../../../assets/img/learn/api-gateway/message-mediation/edit-button.png) button in the **Message Mediation** under the **Request** section.      
  
    [![Select Mediation policy](../../../../assets/img/learn/api-gateway/message-mediation/edit-mediation.png)](../../../../assets/img/learn/api-gateway/message-mediation/edit-mediation.png)  

3.  In the **Select a Mediation Policy** popup you can select **Common Policies** radio button and then select disable-chunking radio button.  

    [![Disable Chunking](../../../../assets/img/learn/api-gateway/message-mediation/disable-chunking.png)](../../../../assets/img/learn/api-gateway/message-mediation/disable-chunking.png)

4.  Press select button and then save the API.

Once the API is published, chunking is disabled for the message that is sent to the backend.

!!! tip
    To stop chunked messages from being sent to the client, you can apply the same mediation policy in the response section as well.
        


