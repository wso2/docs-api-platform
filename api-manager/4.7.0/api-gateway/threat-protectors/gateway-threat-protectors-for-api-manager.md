---
title: "Gateway Threat Protectors Overview"
description: "Overview of the three Gateway threat protectors (regular expression, JSON, and XML) and how to combine them in a mediation sequence against injection attacks."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.7.0/api-gateway/threat-protectors/gateway-threat-protectors-for-api-manager/
md_url: https://wso2.com/api-platform/docs/api-manager/4.7.0/api-gateway/threat-protectors/gateway-threat-protectors-for-api-manager.md
tags:
  - api-manager
  - threat-protection
  - api-gateway
  - security
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "concept"
---

# Gateway Threat Protectors

WSO2 API Manager has three types of threat protectors for the Gateway.

-   [Regular Expression Threat Protection for API Gateway](regular-expression-threat-protection-for-api-gateway.md)
-   [JSON Threat Protection for API Gateway](json-threat-protection-for-api-gateway.md)
-   [XML Threat Protection for API Gateway](xml-threat-protection-for-api-gateway.md)

### Combining threat protectors

You can use a combination of the threat protectors given above to validate the messages and protect your gateway from attacks. An example custom mediation policy which validates the API request against XML and regex validators is given below.

``` java
<sequence xmlns="http://ws.apache.org/ns/synapse" name="combinevalidator">
    <property name="xmlValidation" value="true"/>
    <property name="dtdEnabled" value="false"/>
    <property name="externalEntitiesEnabled" value="true"/>
    <property name="maxXMLDepth" value="30"/>
    <property name="maxElementCount" value="30"/>
    <property name="maxAttributeCount" value="30"/>
    <property name="maxAttributeLength" value="30"/>
    <property name="entityExpansionLimit" value="30"/>
    <property name="maxChildrenPerElement" value="30"/>
    <property name="schemaValidation" value="true"/>
    <switch source="get-property('To')">
         <case regex=".*/addResource.*">
            <property name="xsdURL" value="http://localhost:8000/shiporder.xsd"/>
        </case>
    </switch>
    <class name="org.wso2.carbon.apimgt.gateway.mediators.XMLSchemaValidator"/>
    <property name="threatType" expression="get-property('threatType')" value="SQL-Injection"/>
    <property name="regex" expression="get-property('regex')" value=".*'.*|.*ALTER.*|.*ALTER TABLE.*|.*ALTER VIEW.*|
    .*CREATE DATABASE.*|.*CREATE PROCEDURE.*|.*CREATE SCHEMA.*|.*create table.*|.*CREATE VIEW.*|.*DELETE.*|.
    *DROP DATABASE.*|.*DROP PROCEDURE.*|.*DROP.*|.*SELECT.*"/>
    <property name="enabledCheckBody" expression="get-property('checkBodyEnable')" value="true"/>
    <property name="enabledCheckHeaders" expression="get-property('enabledCheckHeaders')" value="true"/>
    <property name="enabledCheckPathParams" expression="get-property('enabledCheckPathParams')" value="true"/>
    <class name="org.wso2.carbon.apimgt.gateway.mediators.RegularExpressionProtector"/>
</sequence>
```

### Add a custom sequence

You can add custom sequences depending on the threats that you need to address. You can create a policy using the custom sequence and attach it to the API. 
Please refer [API Policies](../../api-design-manage/design/api-policies/overview.md) for more information on how to attach a policy to an API