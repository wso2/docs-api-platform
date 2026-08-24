---
title: "Template patterns for OpenAPI definitions"
description: "Lists supported OpenAPI path template patterns and resource ordering rules for APIs deployed on Choreo Connect."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/deploy-and-publish/deploy-on-gateway/choreo-connect/concepts/template-patterns-for-choreo-connect/
md_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/deploy-and-publish/deploy-on-gateway/choreo-connect/concepts/template-patterns-for-choreo-connect.md
tags:
  - api-manager
  - deploy-and-publish
  - deploy-on-gateway
  - choreo-connect
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-30
content_type: "reference"
---

# Template Patterns for OpenAPI Definitions

You can use these template patterns when defining OpenAPI (Swagger) definitions for APIs that will be deployed on Choreo Connect.
The following is a list of sample patterns that are currently supported in Choreo Connect.

| **Pattern Format** | **Sample request path** |
|-------|---------------------|
| `/{constant1}/{variable1}/{variable2}` | `/foo/p12/e001` |
| `/{constant1}/{variable1}/{variable2}/{constant2}` | `/foo/p20/e002/store` |
| `/{constant1}/{variable1}.{constant2}` | `/foo/baz.id` |
| `/{constant1}/{variable1}.{constant2}/{constant2}` | `/foo/quz.id/qux` |

!!! note
    You cannot define two resources in the same service, as follows, by only changing one path template expression.

    **Example**

    ```
    /echo/{abc}/bar
    /echo/{xyz}/bar
    ```

## Resource Ordering

Choreo Connect Router is backed by Envoy. All the resource paths defined in the OpenAPI (Swagger) definition are applied through a single Envoy configuration as routes.

The routes are matched in the order which they have been configured. Therefore, it's mandatory to order the resources in such a way that, correct resource path is matched when invoking the API.

The resources in the OpenAPI (Swagger) definition will be ordered as below.

### OpenAPI (Swagger) Definition

```
/pet
/pet/{id}
/pet/index.html
/pet/{id}/price
/pet/{id}/{price}
/pet/*
/pet/{petId}.com
/pet/pet.{anc}
/pet/{pet}.{anc}
```

### Ordered resources

```
/pet/index.html
/pet/pet.{anc}
/pet/{petId}.com
/pet/{pet}.{anc}
/pet
/pet/{id}
/pet/{id}/price
/pet/{id}/{price}
/pet/*
```

## Considerations

- The concrete paths are matched first for a given pattern.
- Any path with `.` character gets higher precedence.
- Precedence decreases when the number of path parameters increases.
- The wild card path is matched last.