---
title: "Get a Bearer token via curl (IdP mode)"
description: "Obtain a Bearer token for the API Portal REST API from the terminal, without a browser, when running in external IdP mode."
canonical_url: https://wso2.com/api-platform/docs/api-portal/references/get-a-bearer-token-via-curl/
md_url: https://wso2.com/api-platform/docs/api-portal/references/get-a-bearer-token-via-curl.md
tags:
  - cloud
  - api-portal
  - authentication
  - rest-api
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-24
content_type: "how-to"
---

# Getting a bearer token via curl (IdP mode)

When the API Portal & MCP Hub is configured with an external identity provider (IdP) such as Asgardeo, REST API calls to `/api-portal/api/v0.9/*` must include an `Authorization: Bearer <token>` header. This guide obtains that token from the terminal, without going through the portal UI. One step still opens a browser: the IdP's own login and redirect.

!!! note
    If you're running in **local auth mode** instead (the default for local development), get a token from the Platform API directly—see [Getting Started](../getting-started.md)—no PKCE flow needed.

## Prerequisites

- An IdP is configured, with `api_portal.auth.idp.client_id` set in `config.toml`—see [Authentication](../setting-up/authentication/overview.md)
- Your user carries the privileges the operations need: a role the portal's grant table names when `auth.authorization.mode = "role"`, or the `dp:*` scopes themselves when it's `"scope"`—see [Choose how privileges reach the token](../setting-up/authentication/connect-an-identity-provider.md#step-3-choose-how-privileges-reach-the-token)
- You have the **client ID** and **client secret** from your IdP application
- You know your org's identifier (the `ORGANIZATION_IDENTIFIER` value used to scope the login, e.g. `sub`)

## Flow: Authorization code + Proof Key for Code Exchange (PKCE)

The API Portal application is a confidential Traditional Web App—it uses authorization code flow with PKCE and a client secret. You need to:

1. Generate a PKCE code verifier and challenge
2. Open the authorization URL (paste into a browser)
3. Exchange the authorization code for a token

## Step 1—generate PKCE values

```bash
# Code verifier: 43–128 random URL-safe characters
CODE_VERIFIER=$(openssl rand -base64 64 | tr -d '=+/' | cut -c1-64)

# Code challenge: SHA-256 of the verifier, base64url-encoded
CODE_CHALLENGE=$(echo -n "$CODE_VERIFIER" | openssl dgst -sha256 -binary | base64 | tr '+/' '-_' | tr -d '=')

echo "CODE_VERIFIER=$CODE_VERIFIER"
echo "CODE_CHALLENGE=$CODE_CHALLENGE"
```

## Step 2—start a local redirect listener

The IdP redirects back to a callback URI with the authorization code. Use `nc` to capture it:

```bash
PORT=8080
nc -l $PORT &
NC_PID=$!
```

!!! note
    Register `http://localhost:8080` as an authorized redirect URI in your IdP application before proceeding.

## Step 3—build the authorization URL and open it

```bash
TENANT=<your-tenant>                           # e.g. dev1234
CLIENT_ID=<api-portal-app-client-id>
ORG_IDENTIFIER=<org-identifier>                # ORGANIZATION_IDENTIFIER value, e.g. "sub"
STATE=$(openssl rand -hex 16)

AUTH_URL="https://api.asgardeo.io/t/${TENANT}/oauth2/authorize\
?response_type=code\
&client_id=${CLIENT_ID}\
&redirect_uri=http://localhost:${PORT}\
&scope=openid%20profile%20email%20dp:api:manage%20dp:application:manage%20dp:organization:manage%20dp:subscription:manage\
&code_challenge=${CODE_CHALLENGE}\
&code_challenge_method=S256\
&state=${STATE}\
&org=${ORG_IDENTIFIER}"

echo "Open this URL in your browser:"
echo "$AUTH_URL"
```

Open the URL, log in, and approve. The browser is redirected to `http://localhost:8080?code=...&state=...`—the `nc` process captures the raw HTTP request.

## Step 4—extract the authorization code

```bash
# nc prints something like:
# GET /?code=abc123xyz&state=... HTTP/1.1

CODE=<paste-code-value-here>
kill $NC_PID 2>/dev/null
```

## Step 5—exchange the code for a token

```bash
TOKEN_URL="https://api.asgardeo.io/t/${TENANT}/oauth2/token"
CLIENT_SECRET=<api-portal-app-client-secret>

RESPONSE=$(curl -s -X POST "$TOKEN_URL" \
  -u "${CLIENT_ID}:${CLIENT_SECRET}" \
  -d "grant_type=authorization_code" \
  -d "code=${CODE}" \
  -d "redirect_uri=http://localhost:${PORT}" \
  -d "code_verifier=${CODE_VERIFIER}")

echo "$RESPONSE" | jq .

TOKEN=$(echo "$RESPONSE" | jq -r '.access_token')
echo "TOKEN=$TOKEN"
```

## Step 6—call the API

```bash
# The org is resolved from the token's org claim (set via ORGANIZATION_IDENTIFIER
# during login in Step 3) — no org identifier needed in the request itself.
BASE="https://localhost:9543/api-portal/api/v0.9"

curl -sk "${BASE}/apis" -H "Authorization: Bearer $TOKEN" | jq .
curl -sk "${BASE}/applications" -H "Authorization: Bearer $TOKEN" | jq .

curl -sk -X POST "${BASE}/applications" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"displayName": "My CLI App", "description": "Created via API"}' | jq .
```

See the [Management API](../rest-api/overview.md) for the full set of available operations.

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `403 Missing organization claim in token` | Token has no org claim | Log in with `org=<ORGANIZATION_IDENTIFIER>` in the auth URL |
| `403 Forbidden` (organization) | Token's org claim doesn't resolve to the organization this portal serves. Unknown and foreign organizations return the same status, so the response can't be used to discover which organizations exist | Verify `ORGANIZATION_IDENTIFIER` matches the portal's `[api_portal.organization] handle` |
| `403 Forbidden` (scope error) | The request's effective scopes don't cover the operation | In `mode = "role"`, assign the user a role the portal's grant table names. In `mode = "scope"`, grant the operation's `dp:*` scope to the application in the IdP |
| `401 Authentication required` | Token expired or invalid | Re-run steps 1–5 for a fresh token |
| Token carries no `dp:*` scopes | Expected in `mode = "role"`—the portal derives scopes from the roles claim and ignores the token's own scope claim, so an absent `dp:*` scope isn't the fault | Check the roles claim instead. In the Asgardeo console, assign `dp_admin` for full access, or `dp_subscriber`. Only `mode = "scope"` requires the scopes in the token |
| `nc` gets no output | Redirect URI not registered in IdP | Add `http://localhost:8080` to authorized redirect URIs |

## Token lifetime

Asgardeo access tokens typically expire in 3600 seconds (1 hour). Re-run steps 1–5 for a new one—the API Portal & MCP Hub also supports refresh tokens, but from the terminal it's simpler to just re-authenticate.

## Related

- [Authentication](../setting-up/authentication/overview.md)
- [Management API](../rest-api/overview.md)
- [Configurations](configurations.md)