---
title: "Snowflake connector reference"
description: "Reference for the connection configuration and operations available in the Snowflake connector."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.2.0/reference/connectors/snowflake-connector/snowflake-connector-reference/
md_url: https://wso2.com/api-platform/docs/api-manager/4.2.0/reference/connectors/snowflake-connector/snowflake-connector-reference.md
tags:
  - api-manager
  - reference
  - connectors
  - snowflake-connector
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "reference"
---

# Snowflake Connector Reference

The following operations allow you to work with the Snowflake Connector. Click an operation name to see parameter details.

## Snowflake Connector Configuration

??? note "Connection configuration"
    In the 'Properties' section of each operation, users can configure connection-related information. Once the configuration is created, it can be re-used in other operations.
    <table>
        <tr>
            <th>Parameter Name</th>
            <th>Description</th>
            <th>Required</th>
        </tr>
        <tr>
            <td>Connection Name</td>
            <td>Name of the configuration.</td>
            <td>Yes</td>
        </tr>
        <tr>
            <td>Account Identifier</td>
            <td>The unique which identifies the Snowflake account.</td>
            <td>Yes</td>
        </tr>
        <tr>
            <td>Username</td>
            <td>Snowflake Account Username.</td>
            <td>Yes</td>
        </tr>
        <tr>
            <td>Password</td>
            <td>Snowflake Account password.</td>
            <td>Yes</td>
        </tr>
    </table>


## Operations

??? note "snowflake.query"
    The `snowflake.query` operation queries the given SQL statement.
    <table>
        <tr>
            <th>Parameter Name</th>
            <th>Description</th>
            <th>Required</th>
        </tr>
        <tr>
            <td>Snowflake configuration</td>
            <td>The Snowflake configuration name.</td>
            <td>Yes</td>
        </tr>
        <tr>
            <td>Sql Query</td>
            <td>SQL query to execute</td>
            <td>Yes</td>
        </tr>
      </table>

??? note "snowflake.execute"
    The `snowflake.execute` operation execute the given SQL statement. This operation can be used to perform DDL and DML Operations.
    <table>
        <tr>
            <th>Parameter Name</th>
            <th>Description</th>
            <th>Required</th>
        </tr>
        <tr>
            <td>Snowflake configuration</td>
            <td>The Snowflake configuration name.</td>
            <td>Yes</td>
        </tr>
        <tr>
            <td>Execute Query</td>
            <td>The SQL Query to execute</td>
            <td>Yes</td>
        </tr>
        <tr>
            <td>Payload</td>
            <td>Payload to be used in the execute query.</td>
            <td>No</td>
        </tr>
    </table>

??? note "snowflake.batchExecute"
    The `snowflake.batchExecute` operation performs a batch of SQL statements. 
    <table>
        <tr>
            <th>Parameter Name</th>
            <th>Description</th>
            <th>Required</th>
        </tr>
        <tr>
            <td>Snowflake configuration</td>
            <td>The Snowflake configuration name.</td>
            <td>Yes</td>
        </tr>
        <tr>
            <td>Execute Query</td>
            <td>SQL Query to execute</td>
            <td>Yes</td>
        </tr>
        <tr>
            <td>Bulk Payload</td>
            <td>Bulk payload to be used in the query</td>
            <td>Yes</td>
        </tr>
    </table>