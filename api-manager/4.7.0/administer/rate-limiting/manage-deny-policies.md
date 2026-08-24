---
title: "Manage Deny Policies"
description: "Configure deny policies to block requests to specific APIs, applications, IP addresses, or users, protecting backend servers from abuse."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.7.0/administer/rate-limiting/manage-deny-policies/
md_url: https://wso2.com/api-platform/docs/api-manager/4.7.0/administer/rate-limiting/manage-deny-policies.md
tags:
  - api-manager
  - rate-limiting
  - admin-portal
  - security
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "how-to"
---

# Manage Deny Policies

By denying requests, you can protect servers from common attacks and abuse by users. Tenant administrative users can block requests based on the following parameters:

- Block calls to specific APIs
- Block all calls from a given application
- Block requests coming from a specific IP address
- Block a specific user from accessing APIs

## Adding a Deny Policy

To deny a request:

1.  Log in to the Admin Portal using the URL `https://localhost:9443/admin` and your admin credentials.
2.  Click **Deny Policies** under the **Rate Limiting Policies** section and click **Add Policy**.

    [![Add denied policy](../../assets/img/learn/add-denied-policy.png)](../../assets/img/learn/add-denied-policy.png)

3. Select the item to deny, enter a value and click **Deny**.

    [![Select denied condition](../../assets/img/learn/select-denied-condition.png)](../../assets/img/learn/select-denied-condition.png)

<div class="admonition info">
    <p class="admonition-title">Note</p>
<p>You can temporary switch on/off the denied condition by enabling/disabling the <b>Condition status</b> that is auto enabled when a denied condition is created. </p>
</div>

[![Denied condition status](../../assets/img/learn/denied-condition-status.png)](../../assets/img/learn/denied-condition-status.png)

## Example: Denying an API

Let's see how to deny requests to a specific API.

1.  Log in to the Admin Portal using the URL `https://localhost:9443/admin` and your admin credentials.
2.  Click **Deny Policies** under the **Rate Limiting Policies** section and click **Add Policy**.
3.  Select **API Context** and provide the Context of the API with version as the **Value.**

    [![Select context deny](../../assets/img/learn/select-context-deny.png)](../../assets/img/learn/select-context-deny.png)

4.  Click **Deny.**

The API will now be blocked. When users attempt to invoke the blocked API, they will receive an error response.