---
title: "Changing the default token expiration time"
description: "Change the default validity period of application and user access tokens issued by WSO2 API Manager."
canonical_url: https://wso2.com/api-platform/docs/api-manager/3.1.0/learn/api-security/api-authentication/advanced-topics/changing-the-default-token-expiration-time/
md_url: https://wso2.com/api-platform/docs/api-manager/3.1.0/learn/api-security/api-authentication/advanced-topics/changing-the-default-token-expiration-time.md
tags:
  - api-manager
  - learn
  - api-security
  - api-authentication
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-27
content_type: "how-to"
---

# duplicate\_Changing the default token expiration time

Access tokens have an expiration time, which is set to 60 minutes by default.

-   To change the default expiration time of application access tokens,
    -   Change the value of the `<AccessTokenDefaultValidityPeriod>` element in the `<API-M_HOME>/repository/conf/identity/identity.xml` file. Set this to a negative value to ensure that the token never expires. **Changes to this value are applied only to the new applications that you create** .

        **Example**

        <table>
        <colgroup>
        <col width="100%" />
        </colgroup>
        <tbody>
        <tr class="odd">
        <td><div class="container" title="Hint: double-click to select code">
        <div class="line number1 index0 alt2">
        <code class="java plain">                     &lt;AccessTokenDefaultValidityPeriod&gt;-                    </code> <code class="java value">                     3600                    </code> <code class="java plain">                     &lt;/AccessTokenDefaultValidityPeriod&gt;                    </code>
        </div>
        </div></td>
        </tr>
        </tbody>
        </table>

    -   Alternatively, you can set a default expiration time through the UI when generating/regenerating the application access token.
        This is explained in [previous sections](https://docs.wso2.com/display/SHAN/Am300Working+with+Access+Tokens#Am300WorkingwithAccessTokens-valid) .

-   Similarly, to change the default expiration time of user access tokens, edit the value of the `<UserAccessTokenDefaultValidityPeriod>` element in the `<API-M_HOME>/repository/conf/identity/identity.xml` file.

    **Example**

    <table>
    <colgroup>
    <col width="100%" />
    </colgroup>
    <tbody>
    <tr class="odd">
    <td><div class="container" title="Hint: double-click to select code">
    <div class="line number1 index0 alt2">
    <code class="java plain">                   &lt;UserAccessTokenDefaultValidityPeriod&gt;                  </code> <code class="java value">                   3800                  </code> <code class="java plain">                   &lt;/UserAccessTokenDefaultValidityPeriod&gt;                  </code>
    </div>
    </div></td>
    </tr>
    </tbody>
    </table>

Also see [Configuring Caching](https://docs.wso2.com/display/AM300/Configuring+Caching) for several caching options available to optimize key validation.