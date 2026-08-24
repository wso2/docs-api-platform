---
title: "Input validators"
description: "Reference the built-in input validators available for validating request parameters in a data service query."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/reference/synapse-properties/data-services/input-validators/
md_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/reference/synapse-properties/data-services/input-validators.md
tags:
  - api-manager
  - reference
  - synapse-properties
  - data-services
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-30
content_type: "reference"
---

# Input Validators

Validators are added to individual input mappings in a query. Input
validation allows data services to validate the input parameters in a
request and stop the execution of the request if the input doesn’t meet
the required criteria. WSO2 Micro Integrator provides a set of
built-in validators for some of the most common use cases. It also
provides an extension mechanism to write custom validators.

## Long Range validator

Validates if an integer value is in the specified range. The validator
requires a minimum and a maximum value to set the range. 

## Double Range validator

Validates if a floating point is in the specified range. The validator
requires a minimum and a maximum value to set the range. 

## Length validator

Validates the string length of a given parameter against a specified
length.

## Pattern validator

Validates the string value of the parameter against a given regular
expression.