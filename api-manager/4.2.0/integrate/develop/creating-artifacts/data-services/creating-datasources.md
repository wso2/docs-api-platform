---
title: "Creating a datasource"
description: "Provides steps to create a datasource connection artifact within a datasource config module in Integration Studio."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.2.0/integrate/develop/creating-artifacts/data-services/creating-datasources/
md_url: https://wso2.com/api-platform/docs/api-manager/4.2.0/integrate/develop/creating-artifacts/data-services/creating-datasources.md
tags:
  - api-manager
  - integrate
  - develop
  - creating-artifacts
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "how-to"
---

# Creating a Datasource

Follow the instructions given below to create a new Datasource connection in WSO2 Integration Studio.

## Instructions

Follow the steps given below to create the datasource file:

1.  Select the already created [**Datasource Config module**](../../create-integration-project#sub-projects) in the project
    navigator, right-click, and go to **New -> Datasource**.

    <img src="../../../../../assets/img/integrate/data-services/create-datasource.png">

    The **New Datasource** window will open as shown below. 

    <img src="../../../../../assets/img/integrate/data-services/create-datasource-dialog.png"> 

2.  Select your [**datasource config module**](../../create-integration-project#sub-projects) as the **Container**, add the file name for your datasource, and click **Finish**.

A datasource file will now be created in your datasource config module. 
Shown below is the sample configuration that is created. You can now update the values in this configuration.

```xml
<datasource>
    <name>MySQLConnection</name>
    <description>MySQL Connection</description>
    <jndiConfig useDataSourceFactory="false">
        <name>MysqlConJNDI1</name>
    </jndiConfig>
    <definition type="RDBMS">
        <configuration>
            <driverClassName>com.mysql.jdbc.Driver</driverClassName>
            <url>jdbc:mysql://localhost:3306/mysqldb</url>
            <username>username</username>
            <password>password</password>
        </configuration>
    </definition>
</datasource>
```

!!!	Tip
    You can generate dataservices for the created datasource. 
    For more information, you can follow the steps given in [Generate Data Services](creating-data-services#generate-data-service-from-a-datasource).


## Examples

-	<a href="../../../../../integrate/examples/data_integration/carbon-data-service">Exposing a Carbon Datasource</a>