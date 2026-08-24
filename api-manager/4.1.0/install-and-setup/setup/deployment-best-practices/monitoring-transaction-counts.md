---
title: "Monitoring integration transactions counts"
description: "Enable and configure the transaction counter component to track Micro Integrator transaction counts."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/install-and-setup/setup/deployment-best-practices/monitoring-transaction-counts/
md_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/install-and-setup/setup/deployment-best-practices/monitoring-transaction-counts.md
tags:
  - api-manager
  - install-and-setup
  - setup
  - deployment-best-practices
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-30
content_type: "how-to"
---

# Monitoring Integration Transactions Counts

A **Transaction** in WSO2 Micro Integrator is typically defined as an inbound request (a request coming to the server). That is, any inbound request to a [REST API](../../../integrate/develop/creating-artifacts/creating-an-api.md), [Proxy service](../../../integrate/develop/creating-artifacts/creating-a-proxy-service.md), or [Inbound Endpoint](../../../integrate/develop/creating-artifacts/creating-an-inbound-endpoint.md) is considered as one transaction.

However, when the Micro Integrator is configured as both the message producer and consumer to handle **asynchronous** messaging scenarios, the two requests (listening request and sending request) are considered as a single transaction.

If you need to track the number of transactions in your Micro Integrator deployment, you can enable the transaction counter component in each Micro Integrator instance of your deployment. Currently, the transaction counter is responsible for counting all requests received via the [HTTP Passthru](../mi-setup/transport_configurations/configuring-transports.md#configuring-the-httphttps-transport) and [JMS](../mi-setup/transport_configurations/configuring-transports.md#configuring-the-jms-transport) transports and for persisting the summary of the transaction count in a database for future use.

Follow the instructions given below.

## Step 1 - Enabling the transaction counter

Configure a relational database to persist transaction count information and then enable the **Transaction Counter** component from the `deployment.toml` file (stored in the `<MI_HOME>/conf` folder).

1.  Select the preferred database type from the list given below and follow the relevant link to set up a database.

    - [Setting up a MySQL database](../mi-setup/databases/setting-up-mysql.md)
    - [Setting up an MSSQL database](../mi-setup/databases/setting-up-mssql.md)
    - [Setting up an Oracle database](../mi-setup/databases/setting-up-oracle.md)
    - [Setting up a Postgre database](../mi-setup/databases/setting-up-postgresql.md)
    - [Setting up an IBM database](../mi-setup/databases/setting-up-ibm-db2.md)

2.  Once you have set up the database, verify that the `deployment.toml` file of your Micro Integrator contains the relevant datasource configurations:

    ```toml tab='MySQL'
    [[datasource]]
    id = "WSO2_TRANSACTION_DB"
    url= "jdbc:mysql://localhost:3306/transactiondb"
    username="root"
    password="root"
    driver="com.mysql.jdbc.Driver"
    pool_options.maxActive=50
    pool_options.maxWait = 60000
    pool_options.testOnBorrow = true
    ```

    ```toml tab='MSSQL'
    [[datasource]]
    id = "WSO2_TRANSACTION_DB"
    url= "jdbc:sqlserver://<IP>:1433;databaseName=transactiondb;SendStringParametersAsUnicode=false"
    username="root"
    password="root"
    driver="com.microsoft.sqlserver.jdbc.SQLServerDriver"
    pool_options.maxActive=50
    pool_options.maxWait = 60000
    pool_options.testOnBorrow = true
    ```

    ```toml tab='Oracle'
    [[datasource]]
    id = "WSO2_TRANSACTION_DB"
    url= "jdbc:oracle:thin:@SERVER_NAME:PORT/SID"
    username="root"
    password="root"
    driver="oracle.jdbc.OracleDriver"
    pool_options.maxActive=50
    pool_options.maxWait = 60000
    pool_options.testOnBorrow = true
    ```

    ```toml tab='PostgreSQL'
    [[datasource]]
    id = "WSO2_TRANSACTION_DB"
    url= "jdbc:postgresql://localhost:5432/transactiondb"
    username="root"
    password="root"
    driver="org.postgresql.Driver"
    pool_options.maxActive=50
    pool_options.maxWait = 60000
    pool_options.testOnBorrow = true
    ```

    ```toml tab='IBM DB'
    [[datasource]]
    id = "WSO2_TRANSACTION_DB"
    url="jdbc:db2://SERVER_NAME:PORT/transactiondb"
    username="root"
    password="root"
    driver="com.ibm.db2.jcc.DB2Driver"
    pool_options.maxActive=50
    pool_options.maxWait = 60000
    pool_options.testOnBorrow = true
    ```

3.  Add the parameters given below to the `deployment.toml` file and update the values.

    ```toml
    [transaction_counter]
    enable = true
    data_source = "WSO2_TRANSACTION_DB"
    update_interval = 2
    ```

    Parameters used above are explained below.

    <table>
    	<tr>
    		<th>Parameter</th>
    		<th>Description</th>
    	</tr>
    	<tr>
    		<td>
    			<code>enable</code>
    		</td>
    		<td>
    			This paramter is used for enabling the Transaction Counter. Default value if 'false'.
    		</td>
    	</tr>
    	<tr>
    		<td>
    			<code>data_source</code>
    		</td>
    		<td>
    			The ID of the datasource. This refers the datasource ID configured under the datasource configuration.
    		</td>
    	</tr>
    	<tr>
    		<td>
    			<code>update_interval</code>
    		</td>
    		<td>
    			The transaction count is stored in the database with an interval (specified by this parameter, which will be taken as the number of minutes) between the insert queries. The default update interval is one minute.
    		</td>
    	</tr>
    </table>

## Step 2 - Getting the transaction count

You can get the transaction count for a particular month or period. This data can be viewed or saved to a report. There are two ways to get transaction count data:

-  Start the [APICTL](../api-controller/getting-started-with-wso2-api-controller.md) and use the [mi transaction](../api-controller/managing-integrations/managing-integrations-with-ctl.md#monitor-transactions) option.

-  Directly access the [Management API resources](../../../observe/mi-observe/working-with-management-api.md) and invoke the [/transaction/count](../../../observe/mi-observe/working-with-management-api.md#get-transaction-count) and [/transaction/report](../../../observe/mi-observe/working-with-management-api.md#get-transaction-report-data) resources.