---
title: "Setting up the Redis environment"
description: "Sets up the Redis environment, including client libraries and a local Redis server, for use with the Redis connector."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/reference/connectors/redis-connector/redis-connector-configuration/
md_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/reference/connectors/redis-connector/redis-connector-configuration.md
tags:
  - api-manager
  - reference
  - connectors
  - redis-connector
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-19
content_type: "how-to"
---

# Setting up the Redis Environment 

The Redis connector allows you to access the Redis commands from an integration sequence. Redis stands for remote dictionary server. Redis store/server that stores data as key-value pairs and this key-value store can be used as a database.

## Setting up the environment

Before you start configuring the Redis connector, you need the WSO2 integration runtime. [Download](https://wso2.com/integration/micro-integrator/) the integration runtime and extract the ZIP file to a known location. In this setup guide we refer to that location as <PRODUCT_HOME>.

To configure the Redis connector, download the following client libraries from the given locations and copy to the `<PRODUCT_HOME>/lib` directory.

* For Redis connector v1.0.1 - [jedis-2.1.0.jar](https://mvnrepository.com/artifact/redis.clients/jedis/2.1.0)
* For Redis connector v2.1.x and above - [jedis-3.6.0.jar](https://mvnrepository.com/artifact/redis.clients/jedis/3.6.0)

## Setting up the Redis server 

1. Download the [Redis server](http://redis.io/download) and follow the steps given in this page to install this in your local machine.
2. After setting up the **Redis Server**, navigate to the location you installed Redis and execute the **sudo make install** command.
3. Enter **redis-server** command to start the Redis server.
4. In the command line, you can see the Redis **port** and **PID** as shown below.
    
    <a href="../../../../assets/img/integrate/connectors/redis-server.png"><img src="../../../../assets/img/integrate/connectors/redis-server.png" title="Redis server" alt="Redis server"/></a>
 
5. You can interact with Redis using the built-in client. In the command line, navigate to the location you installed Redis. Enter `redis-cli`.

    <a href="../../../../assets/img/integrate/connectors/redis-client.png"><img src="../../../../assets/img/integrate/connectors/redis-client.png" title="Redis Client" width="60%" alt="Redis Client"/> </a>