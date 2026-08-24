---
title: "Creating an endpoint"
description: "Provides steps to create a static or dynamic endpoint artifact and specify its type in WSO2 Integration Studio."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.2.0/integrate/develop/creating-artifacts/creating-endpoints/
md_url: https://wso2.com/api-platform/docs/api-manager/4.2.0/integrate/develop/creating-artifacts/creating-endpoints.md
tags:
  - api-manager
  - integrate
  - develop
  - creating-artifacts
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "how-to"
---

# Creating an Endpoint
Follow the instructions given below to create a new [Endpoint](../../../reference/synapse-properties/endpoint-properties) artifact in WSO2 Integration Studio.

## Instructions

### Creating the Endpoint artifact

1.  Right-click the [ESB Config project](../create-integration-project#sub-projects) and go to **New → Endpoint** to open the **New Endpoint Artifact** dialog box.

    <img src="../../../../assets/img/integrate/create_artifacts/new_endpoint/select-endpoint.png">

2.  Select **Create a New Endpoint** and click **Next**.

    <img src="../../../../assets/img/integrate/create_artifacts/new_endpoint/new-endpoint-wizard-1.png" width="500">

3.  Enter a unique name for the endpoint, and then select the type of endpoint you are creating.

    <img src="../../../../assets/img/integrate/create_artifacts/new_endpoint/new-endpoint-wizard-2.png" width="500">

4.  Specify values for the [required parameter](../../../reference/synapse-properties/endpoint-properties) for the selected endpoint type.
5.  Specify how you want to save the endpoint:

    - Select **Static Endpoint** to save the endpoint in the current workspace.
    - Select **Dynamic Endpoint** to save the endpoint as a registry resource.

6.  Specify the location to save the endpoint:

    - To save in an existing ([ESB Config project](../create-integration-project#sub-projects) or [Registry Resource project](../create-integration-project#sub-projects)) in your workspace, click **Browse** and select that project.
    - To save in a new project, click **Create new Project** and create the new project.

7.  Click **Finish**. 

The endpoint is created in the `src/main/synapse-config/endpoints` folder under the ESB Config project or [registry resource project](../create-integration-project#sub-projects) you specified.

### Designing the integration

To add an endpoint artifact to the integration sequence, use the [Send Mediator](../../../reference/mediators/send-mediator) or the [Call Mediator](../../../reference/mediators/call-mediator).

1.	Open to the **Design View** of your [mediation sequence](../../../reference/synapse-properties/sequence-properties).
2.  Drag the [Call Mediator](../../../reference/mediators/call-mediator) from the **Palette** and drop it to the relevant position in the [mediation sequence](../../../reference/synapse-properties/sequence-properties):

	<img src="../../../../assets/img/integrate/create_artifacts/new_endpoint/endpoint-graphical-editor-1.png" width="700">

    !!! Tip
        Similarly, you can use the [Send Mediator](../../../reference/mediators/send-mediator).

3.	Drag the new endpoint artifact from the **Defined Endpoints** section in the **Palette** and drop it to the empty box in the [Call Mediator](../../../reference/mediators/call-mediator):

	<img src="../../../../assets/img/integrate/create_artifacts/new_endpoint/endpoint-graphical-editor-2.png" width="700">

The endpoint artifact is now linked to your integration sequence.

### Updating the properties

Open the new endpoint artifact from the project explorer. You can use the **Form** view or the **Source** view to update endpoint properties.

<img src="../../../../assets/img/integrate/create_artifacts/new_endpoint/endpoint-form-view.png" width="700">

See the descriptions of all [endpoint properties](../../../reference/synapse-properties/endpoint-properties).

## Examples

<ul>
	<li>
		<a href="../../../../integrate/examples/endpoint_examples/using-address-endpoints">Using Address Endpoints</a>
	</li>
	<li>
		<a href="../../../../integrate/examples/endpoint_examples/using-failover-endpoints">Using Failover Endpoints</a>
	</li>
	<li>
		<a href="../../../../integrate/examples/endpoint_examples/using-http-endpoints">Using HTTP Endpoints</a>
	</li>
	<li>
		<a href="../../../../integrate/examples/endpoint_examples/using-websocket-endpoints">Using a Websocket Endpoint</a>
	</li>
  <li>
		<a href="../../../../integrate/examples/endpoint_examples/using-wsdl-endpoints">Using WSDL Endpoints</a>
	</li>
	<li>
		<a href="../../../../integrate/examples/endpoint_examples/using-loadbalancing-endpoints">Using Load Balancing Endpoints</a>
	</li>
</ul>