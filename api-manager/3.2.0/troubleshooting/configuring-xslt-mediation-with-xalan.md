---
title: "Configuring XSLT mediation with xalan"
description: "Work around the missing ends-with() function when Xalan is used instead of Saxon for XSLT message transformation."
canonical_url: https://wso2.com/api-platform/docs/api-manager/3.2.0/troubleshooting/configuring-xslt-mediation-with-xalan/
md_url: https://wso2.com/api-platform/docs/api-manager/3.2.0/troubleshooting/configuring-xslt-mediation-with-xalan.md
tags:
  - api-manager
  - troubleshooting
  - configuring-xslt-mediation-with-xalan
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-22
content_type: "troubleshooting"
---

# Configuring XSLT Mediation with Xalan

When Xalan is selected instead of Saxon for the XSLT message transformation, it does not support the `ends-with()` function that was used in the XSLT transformation.

You may encounter an error similar to the following.

```bash
TID: [36] [] [2021-06-08 21:41:47,551] ERROR {org.apache.synapse.mediators.transform.XSLTMediator} - Fatal error occurred in stylesheet parsing. ; Line#: 91; Column#: 60
javax.xml.transform.TransformerException: Could not find function: ends-with
 at org.apache.xpath.compiler.XPathParser.error(XPathParser.java:610)
 at org.apache.xpath.compiler.XPathParser.FunctionCall(XPathParser.java:1507)
 at org.apache.xpath.compiler.XPathParser.PrimaryExpr(XPathParser.java:1446)
```

This issue can be resolved by using the below system parameter.

```
-Djavax.xml.transform.TransformerFactory=net.sf.saxon.TransformerFactoryImpl \
```
