---
title: "Configuring Single Sign-On with SAML2"
description: "Overview of SAML2-based Single Sign-On in API Manager, covering claims-based authorization and links to configuring Identity Server as an IdP."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.4.0/reference/customize-product/extending-api-manager/saml2-sso/configuring-single-sign-on-with-saml2/
md_url: https://wso2.com/api-platform/docs/api-manager/4.4.0/reference/customize-product/extending-api-manager/saml2-sso/configuring-single-sign-on-with-saml2.md
tags:
  - api-manager
  - sso
  - saml2
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-15
content_type: "concept"
---

# Configuring Single Sign-on with SAML2

Single Sign-On (SSO) allows users, who are authenticated against one application, to gain access to multiple other related applications without having to repeatedly authenticate themselves. It also allows the web applications to gain access to a set of back-end services with the logged-in user's access rights, and the back-end services can authorize the user based on different **claims** like the user role.

!!! info
    A claim is a piece of information about a particular subject and it is an attribute of the user that is mapped to the underlying user store. A claim can be anything that the subject is owned by or associated with, such as name, group, preferences, etc. A claim provides a single and general notion to define the identity information related to the subject. A set of claims is called a dialect (e.g., http://wso2.org/claims)


This section covers the following topics.

-   [Configuring Identity Server as IDP for SSO](configuring-identity-server-as-idp-for-sso.md)
-   [Configuring External IDP through Identity Server for SSO](configuring-external-idp-through-identity-server-for-sso.md)

!!! info
    The **Single Sign-On with OpenID Connect** feature is enabled by default in the API Manager.  
    
!!! tip
    For more information on SAML related terminologies discussed in the sections above, go to [Assertions and Protocols for the OASIS SAML 2.0](https://docs.oasis-open.org/security/saml/v2.0/saml-core-2.0-os.pdf) documentation.

