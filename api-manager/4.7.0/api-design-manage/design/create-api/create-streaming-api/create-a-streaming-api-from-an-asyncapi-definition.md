---
title: "Create a Streaming API from an AsyncAPI Definition"
description: "Import an AsyncAPI v2.x or v3.0 definition to create a WebSocket, WebSub, or SSE streaming API, and view its generated topics and definition."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.7.0/api-design-manage/design/create-api/create-streaming-api/create-a-streaming-api-from-an-asyncapi-definition/
md_url: https://wso2.com/api-platform/docs/api-manager/4.7.0/api-design-manage/design/create-api/create-streaming-api/create-a-streaming-api-from-an-asyncapi-definition.md
tags:
  - api-manager
  - streaming-api
  - api-design
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "how-to"
---

# Create a Streaming API from an AsyncAPI Definition

[AsyncAPI specification](https://www.asyncapi.com/) is a format that describes streaming APIs. An API Creator can import an existing AsyncAPI definition to WSO2 API Manager to create a streaming API using any one of the following protocols.

- [WebSocket](../../../../design/create-api/create-streaming-api/create-a-websocket-streaming-api/#overview)
- [WebSub (WebHooks)](../../../../design/create-api/create-streaming-api/create-a-websub-streaming-api/#overview)
- [Server Sent Events (SSE)](../../../../design/create-api/create-streaming-api/create-a-sse-streaming-api/#overview)

The API Creator can import the existing AsyncAPI definition by either uploading a file or by providing an Async API URL.

Follow the instructions below to create a Streaming API using an AsyncAPI definition for an existing API:

## Step 1 - Design a Streaming API

1.  
    --8<-- "api-manager/4.7.0/includes/sign-in-publisher.md"

2. Click **CREATE API** and then click **Import AsyncAPI Definition**.

    <html><div class="admonition note">
      <p class="admonition-title">Note</p>
      <p>The <b>CREATE API</b> button will only appear if the user who has signed in has the creator role permission.</p>
      </div>
    </html>

    [![Design New Streaming API](../../../../assets/img/design/create-api/streaming-api/design-new-streaming-api.png)](../../../../assets/img/design/create-api/streaming-api/design-new-streaming-api.png)

    The following two options to import the AsyncAPI definition appears.

    * **AsyncAPI URL** - If you select this option, you need to provide a URL.
    * **AsyncAPI File** - If you select this option, click **Browse File to Upload** and upload a file, which contains an AsyncAPI definition.

3. Select the way in which you are going to import the AsyncAPI definition, and click **Next**.

     <html><div class="admonition note">
      <p class="admonition-title">Note</p>
      <p>AsyncAPI import now supports both AsyncAPI v2.x and AsyncAPI v3.0 definitions.</p>
      </div>
     </html>

     For this example, let's select **AsyncAPI File**, upload the following file, and click **Next**.

     [Download AsyncAPI V3 file](../../../../assets/attachments/103332601/streetlights_v3-def.yml)

     <a href="../../../../../assets/attachments/103332601/asyncv3-file.png"><img src="../../../../../assets/attachments/103332601/asyncv3-file.png" width="80%" alt="Import Websocket Streaming API from AsyncAPI File"></a>

4.  Edit the Streaming API information and click **Create**.

     <html><div class="admonition note">
      <p class="admonition-title">Note</p>
      <p>The AsyncAPI definition of the Streaming API will contain the basic API definition, and <b>will not specify the protocol</b>, such as WebSocket, WebSub, WebHook, SSE, that the API has to use. You need to provide the Streaming API information here.</p>
      </div>
     </html>

      For this example, let's design a WebSocket API using the following information.

      | **Field**   | **Sample value** |
      |-------------|------------------|
      | Name | StreetlightsAPI |
      | Context | /streetlights |
      | Version | 1.0.0 |
      | Protocol | WebSocket (or any other type of Streaming API) |
      | Endpoint | ws://localhost:8080 |
 
      <a href="../../../../../assets/img/design/create-api/streaming-api/websocket-streaming-api-from-asyncapi-configure-values.png"><img src="../../../../../assets/img/design/create-api/streaming-api/websocket-streaming-api-from-asyncapi-configure-values.png" width="80%" alt="AsyncAPI configuration values"></a>

      Now, the **StreetlightsAPI API** overview page will appear.

     [![AsyncAPI overview](../../../../assets/img/design/create-api/streaming-api/websocket-streaming-api-from-asyncapi-overview.png)](../../../../assets/img/design/create-api/streaming-api/websocket-streaming-api-from-asyncapi-overview.png)

## Step 2 - Configure Topics
   
Click **Topics** to navigate to the topics page.

[![AsyncAPI topics](../../../../assets/img/design/create-api/streaming-api/asyncv3-topics.png)](../../../../assets/img/design/create-api/streaming-api/asyncv3-topics.png)

You will notice that the topics have been created automatically from the AsyncAPI definition specified in the provided URL.

[![AsyncAPI operations](../../../../assets/img/design/create-api/streaming-api/asyncv3-operations.png)](../../../../assets/img/design/create-api/streaming-api/asyncv3-operations.png)

Expand each topic to view the operations which are automatically created for each channel, as defined in the specification.

## Step 3 - View the AsyncAPI Definition

Click **AsyncAPI Definition** under **API Configurations**. 

The AsyncAPI definition of the streaming API, which you just created, appears.
    
   <a href="../../../../../assets/attachments/103332601/asyncv3-def-view.png"><img src="../../../../../assets/attachments/103332601/asyncv3-def-view.png" alt="WebSocket API AsyncAPI Definition"></a>

Now, you have successfully created a Streaming API from an Async API Definition.

If you have created the streaming API using an AsyncAPI v2.x definition, see [AsyncAPI v2.x for APIM 4.6.0](create-a-streaming-api-from-an-asyncapi-definition).

Next, publish the API, for more information, see [Publish an API](../../../deploy-and-publish/publish-on-dev-portal/publish-an-api.md).


<div class="admonition note">
<p class="admonition-title">What's Next?</p>
<p>Learn how to create Streaming APIs from scratch by trying out the following tutorials: 
<ul>
<li><a href="../../../../../tutorials/streaming-api/create-and-publish-websocket-api.md">Create and Publish a WebSocket API</a></li>
<li><a href="../../../../../tutorials/streaming-api/create-and-publish-websub-api.md">Create and Publish a WebSub API</a></li>
<li><a href="../../../../../tutorials/streaming-api/create-and-publish-sse-api.md">Create and Publish a Server Sent Events API</a></li>
</ul>
</p>
</div>

## See Also

--8<-- "api-manager/4.7.0/includes/design/stream-more-links.md"