---
title: "AI Guardrails Overview"
description: "Overview of basic, advanced, and third-party AI guardrails available in WSO2 API Platform to secure and govern AI API proxies."
canonical_url: https://wso2.com/api-platform/docs/cloud/create-api-proxy/third-party-apis/guardrails/
md_url: https://wso2.com/api-platform/docs/cloud/create-api-proxy/third-party-apis/guardrails.md
tags:
  - cloud
  - api-proxy
  - ai-gateway
  - guardrails
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-18
content_type: "overview"
---

# AI Guardrails

Guardrails are a set of guidelines and best practices designed to ensure the safe and effective use of AI systems. They help mitigate risks and promote responsible AI usage. API Platform provides 3 types of guardrails to enhance the security and reliability of AI APIs:

- **Basic Guardrails**: These are the foundational security measures that apply to all AI APIs, ensuring a baseline level of protection.
    - [Regex Guardrail](guardrails/basic-guardrails/regex-guardrail.md)
    - [Word Count Guardrail](guardrails/basic-guardrails/word-count-guardrail.md)
    - [Sentence Count Guardrail](guardrails/basic-guardrails/sentence-count-guardrail.md)
    - [Content Length Guardrail](guardrails/basic-guardrails/content-length-guardrail.md)
    - [URL Guardrail](guardrails/basic-guardrails/url-guardrail.md)
    - [Regex PII Masking](guardrails/basic-guardrails/regex-pii-masking.md)
- **Advanced Guardrails**: For more sophisticated AI applications that require enhanced flexibility and control, API Platform integrates with Guardrails AI—an extensible framework that enables seamless integration of complex AI models and services. This framework allows you to leverage open-source fine-tuned language models to implement advanced guardrails tailored to your specific requirements.
    - [PII Masking](guardrails/advanced-guardrails/pii-masking.md)
- **Third Party Guardrail Integrations**: These are integrations with third-party services that offer additional security and compliance features for AI APIs.
    - [Azure Content Safety Content Moderation](guardrails/third-party-guardrail-integrations/azure-content-safety-content-moderation.md)
    - [AWS Bedrock Guardrails](guardrails/third-party-guardrail-integrations/aws-bedrock-guardrail.md)