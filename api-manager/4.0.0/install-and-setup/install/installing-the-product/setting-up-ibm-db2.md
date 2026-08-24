---
title: "Setting up an IBM DB2"
description: "Set up an IBM DB2 database for the Micro Integrator Dashboard, including prerequisites and database creation steps."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.0.0/install-and-setup/install/installing-the-product/setting-up-ibm-db2/
md_url: https://wso2.com/api-platform/docs/api-manager/4.0.0/install-and-setup/install/installing-the-product/setting-up-ibm-db2.md
tags:
  - api-manager
  - install-and-setup
  - install
  - installing-the-product
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "how-to"
---

# Setting up an IBM DB2

Follow the steps given below to set up the required IBM databases for your Micro Integrator (MI) Dashboard.

## Prerequisites

Install DB2. The following steps are tested in DB2 v11.5.7.0.

## Setting up the databases

The required DB2 script is stored in the `<MI_DASHBOARD_HOME>/dbscripts/db2` directory of your Micro Integrator.

Create the database and then create the DB tables by pointing to the DB2 script in the 
`<MI_DASHBOARD_HOME>/dbscripts/db2` directory.

```bash tab='Dashboard DB'
db2 create database sample
db2 connect to sample user db2inst1 using password
db2 -tvmf <MI_DASHBOARD_HOME>/dbscripts/db2/db2.sql

```

## Setting up DB2 JDBC drivers

Copy the DB2 JDBC drivers (`db2jcc.jar` and `db2jcc_license_c0u.jar`) from the `<DB2_HOME>/SQLLIB/java/` directory to the `MI_DASHBOARD_HOME/lib/` directory.

`<DB2_HOME>` refers to the installation directory of DB2.

## Connecting the database to the server

Open the `deployment.toml` file in the `<MI_DASHBOARD_HOME>/conf` directory and add the following sections to create the connection between the Micro Integrator (MI) Dashboard and the database.

```toml tab='Dashboard DB Connection'
[datasource]
jdbcUrl = "jdbc:db2://localhost:50000/sample"
username = "db2inst1"
password = "xxxx"
driverClassName = "com.ibm.db2.jcc.DB2Driver"
maximumPoolSize = "100"
poolName = "dashboard-1"
connectionTimeout = "400000"
maxLifetime = "2000000"
```

For more information, see the descriptions of [database connection parameters](../../../reference/config-catalog-mi-dashboard.md#database-connection).