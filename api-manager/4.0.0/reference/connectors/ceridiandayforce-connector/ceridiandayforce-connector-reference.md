---
title: "Configuring ceridian dayforce REST operations"
description: "Reference of the init operation and parameters used to authenticate and configure the Ceridian Dayforce REST connector."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.0.0/reference/connectors/ceridiandayforce-connector/ceridiandayforce-connector-reference/
md_url: https://wso2.com/api-platform/docs/api-manager/4.0.0/reference/connectors/ceridiandayforce-connector/ceridiandayforce-connector-reference.md
tags:
  - api-manager
  - reference
  - connectors
  - ceridiandayforce-connector
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "reference"
---

# Configuring Ceridian Dayforce REST Operations

[[Prerequisites]](#prerequisites) [[Initializing the connector]](#initializing-the-connector)

## Prerequisites

> NOTE: For development purposes we can use test credentials provided by Dayforce. However, to understand the Dayforce API and the request responses handled by Dayforce it is recommended that you create a developer account. If you do not have a Dayforce account, go to [https://developers.dayforce.com/Special-Pages/Registration.aspx](https://developers.dayforce.com/Special-Pages/Registration.aspx) and create a Dayforce developer account.

To use the Dayforce REST connector, add the <ceridiandayforce.init> element in your configuration before carrying out any other Dayforce REST operation. 

## Initializing the connector
Add the following <ceridiandayforce.init>

#### init
```xml
<ceridiandayforce.init>
        <username>{$ctx:username}</username>
        <password>{$ctx:ceredianPwd}</password>
        <clientNamespace>{$ctx:clientNamespace}</clientNamespace>
        <apiVersion>{$ctx:apiVersion}</apiVersion>
</ceridiandayforce.init>
```

**Properties**
* username: The username of your Dayforce environment. For testing we can use the sample environment credential: DFWSTest
* password: The password of your Dayforce environment. For testing we can use the sample environment credential: DFWSTest
* clientNamespace: The namespace of your Dayforce environment. For testing we can use the sample environment: usconfigr57.dayforcehcm.com/Api/ddn
* apiVersion: The version of the API you want to call. For testing we will set it to: V1

Now that you have connected to Dayforce, use the information in the following topics to perform various operations with the connector.