---
title: "API Revision Deployment Approval Workflow"
description: "Enable the Approval Workflow Executor in WSO2 API Manager so API revision deployments to the gateway require administrator approval before taking effect."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.5.0/manage-apis/deploy-and-publish/deploy-on-gateway/deploy-api/revision-deployment-workflow/
md_url: https://wso2.com/api-platform/docs/api-manager/4.5.0/manage-apis/deploy-and-publish/deploy-on-gateway/deploy-api/revision-deployment-workflow.md
tags:
  - api-manager
  - api-revisions
  - governance
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "how-to"
---

# Revision Deployment Workflow

In this section let's see how to add an approval workflow to control the deployment of revisions in WSO2 API Manager. When the revisions deployment workflow is activated, the API publisher can submit a revision deployment request to the administrator. If approved, the revision is deployed on the gateway. If declined, the gateway stays unchanged.

## Engaging the Approval Workflow Executor in API Manager

1. Enable the API revision deployment workflow configuration for the **Approval Workflow Executor**.

    1. Sign in to the API-M management console(`https://<Server Host>:9443/carbon`).

    2. Click **Registry** --> **Browse**.

       [![Resources Browse Menu](../../../../assets/img/learn/navigate-main-resources.png)](../../../../assets/img/learn/navigate-main-resources.png)

    3. Go to the `/_system/governance/apimgt/applicationdata/workflow-extensions.xml` resource.

    4. Disable the `Simple Workflow Executor` and enable the `Approval Workflow Executor` by adding the following configuration.

       <a name="config"></a>
       ```xml
       <WorkFlowExtensions>
           ....
       <!--APIRevisionDeployment executor="org.wso2.carbon.apimgt.impl.workflow.
       APIRevisionDeploymentSimpleWorkflowExecutor"/-->
        <APIRevisionDeployment executor="org.wso2.carbon.apimgt.impl.workflow.
       APIRevisionDeploymentApprovalWorkflowExecutor"/>
           ....
       </WorkFlowExtensions>
       ```

       You have now activated the revision deployment approval Workflow.

2.  Deploy a revision

    1. Sign in to the API Publisher (`https://<Server-Host>:9443/publisher`), click the relevant API, and go to deployments tab.

    2. Select a revision and click the deploy button.

    A revision request will be sent to the administrator for approval. A pending chip will be displayed in the **Next Revision** column. The gateway will continue to serve the current revision until the request is approved. 

    ![Deployment Pending](../../../../assets/img/deploy/pending-revision.png)

    !!! info
        Note that when clicking the Deploy New Revision button, a gateway with a pending request will be disabled for selection until the workflow task is completed or deleted.
    
    ![Deploy New Revision Disabled](../../../../assets/img/deploy/pending-deploy-new-revision-tab.png)

    4. Optionally, you can revoke the deployment revision change by clicking **Cancel**.

       [![Delete pending task](../../../../assets/img/deploy/delete-revision-deployment-request.png)](../../../../assets/img/deploy/delete-revision-deployment-request.png)

3. Approve or reject the API revision deployment pending request.

    1. Sign in to the Admin Portal(`https://<Server Host>:9443/admin`)

    2. Click **Tasks** --> **API Revision Deployment**.

       The list of API revision deployment tasks awaiting approval appears.

    3. Click on **Approve** or **Reject** to approve or reject the pending API revision deployment request(s).

    If the request is approved, the existing revision deployed on the gateway will be removed, and the new revision will take its place. If the request is rejected, the currently deployed revision will remain unchanged. 

       [![API revision deployment pending list](../../../../assets/img/deploy/revision-deployment-pending-list.png)](../../../../assets/img/deploy/revision-deployment-pending-list.png)

4. View the outcome of the updated API revision deployment request.

    1. Navigate to the API Publisher (`https://<Server-Host>:9443/publisher`).

    2. Click **Deployments**.

    Notice that the API revision deployment is updated.

    If the request is approved, the new revision will be shown in the **Current Revision** column.
    If the request is rejected, the **Current Revision** column will remain unchanged.

       [![API revision deployment updated list](../../../../assets/img/deploy/revision%20deployment-updated-status.png)](../../../../assets/img/deploy/revision%20deployment-updated-status.png)
       
    !!! info
         You can send a new pending request even while a deployment to a specific gateway is in progress. The current revision will not be undeployed until the new request is approved. As
         mentioned earlier, you have the option to either cancel the second pending request or undeploy the current revision at your discretion.

    [![API gateway with a deployed and a pending revision](../../../../assets/img/deploy/deployed-and-pending-revisions.png)](../../../../assets/img/deploy/deployed-and-pending-revisions.png)