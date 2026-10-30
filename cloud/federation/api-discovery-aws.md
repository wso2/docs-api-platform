---
title: "Discover APIs from AWS API Gateway"
description: "Connect an AWS API Gateway account to API Platform and federate discovered REST APIs into your organization."
canonical_url: https://wso2.com/api-platform/docs/cloud/federation/api-discovery-aws/
md_url: https://wso2.com/api-platform/docs/cloud/federation/api-discovery-aws.md
tags:
  - cloud
  - api-gateway
  - third-party-gateways
  - aws
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-22
content_type: "how-to"
---

# Discover APIs from AWS API Gateway

API Platform allows you to discover APIs from AWS API Gateway and bring them under centralized governance.

---

## Prerequisites

Before you begin, ensure you have:

- An active AWS account with access to AWS API Gateway
- Appropriate permissions to create IAM users and manage API Gateway resources
- Admin access to your API Platform organization. (Only required for Step 1 and 2)

---

## Step 1: Configure User Credentials in AWS API Gateway

1. Login to your AWS account and navigate to Console Home. Search for "IAM" in the search bar.
2. Click on the IAM service. Navigate to Users under Access Management.
3. Create an IAM user in AWS with `AmazonAPIGatewayAdministrator` permission.
4. Obtain an Access Key and Secret Key for the IAM user created in the previous step. Select Third-party service as the use case.

!!! Warning 
    It is not recommended to enter root credentials of the AWS account. Instead, create a new IAM user with the required permissions and use the credentials of the IAM user. For more information see [Best practices for managing AWS access keys](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#securing_access-keys).

---

## Step 2: Add an External Gateway in API Platform

Now that you have your AWS credentials ready, configure the external gateway connection in API Platform.

1. Navigate to **Organization Level** in API Platform.  
2. Click **Add External Gateway**.

      ![External Gateway empty state page with Add Gateway button and API gateway icon, shown under Admin > External Gateway menu](../../assets/img/gateway-federation/add-external-gateway.png)

3. Enter the gateway configuration details:
      - **Gateway Name:** A descriptive name for this gateway (e.g., `Production AWS API Gateway`)
      - **Region:** The AWS region where your API Gateway is deployed (e.g., `us-east-1`)
      - **Stage:** The API Gateway stage to discover APIs from (e.g., `prod`, `dev`)
      - **Access Key :** The Access Key  from Step 1
      - **Secret Key:** The Secret Key from Step 1
4. Click **Save**
   
   ![Add External Gateway form with AWS vendor selected, display name, description, AWS region us-east-1, stage name dev, access key, and secret key fields](../../assets/img/gateway-federation/add-external-gateway-form.png){ width="800" }

The external gateway is now connected to API Platform and ready for API discovery.

---

## Step 3: Discover APIs from the Gateway

Once the external gateway is configured, you can discover and federate APIs into API Platform.

1. Navigate to a **Project** in API Platform.  
2. Click **Create** in the project overview.
3. Click on **Discover APIs**.

     ![Create New page showing My APIs Ingress options including Import API Contract and Third Party APIs Egress options, with Discover APIs banner at the bottom](../../assets/img/gateway-federation/federate-apis.png){ width="1000" }

3. Select the external gateway(s) from which you want to discover APIs and proceed with discovery.

4. Click **Discover APIs from Gateways**.

      ![Select Gateways for API Discovery page listing devgateway and prodgateway both checked, with Discover APIs from 2 Gateways button](../../assets/img/gateway-federation/select-gateways.png){ width="1000" }
      

5. View the list of discovered APIs from the selected gateway(s).

      ![Discovered APIs table listing School Management System API and Construction Company Management API from devgateway and prodgateway, each with a Create button](../../assets/img/gateway-federation/create-discovered-apis.png){ width="1000" } 
  
!!! Note
        Only [REST APIs](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-rest-api.html) are supported for discovery from AWS API Gateway.

6. For each API, click **Create** next to the API name. This federates the API into the API Platform control plane.
   - Repeat for all desired APIs.
   - Navigate to the project **Overview** page to view all federated APIs.
7. You can view the federated API overview by navigating to the API overview page

      ![School Management System API overview showing AWS gateway name, region us-east-1, stage dev, production URL, and GET PUT DELETE OPTIONS endpoints for /students/{studentId}](../../assets/img/gateway-federation/federated-api-overview.png){ width="900" } 