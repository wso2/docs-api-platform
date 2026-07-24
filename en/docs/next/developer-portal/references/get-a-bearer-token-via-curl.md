---
title: "Get a Bearer token via curl (IDP mode)"
description: "Obtain a Bearer token for the Developer Portal REST API from the terminal, without a browser, when running in external IDP mode."
canonical_url: https://wso2.com/api-platform/docs/cloud/devportal/references/get-a-bearer-token-via-curl/
md_url: https://wso2.com/api-platform/docs/cloud/devportal/references/get-a-bearer-token-via-curl.md
tags:
  - cloud
  - devportal
  - authentication
  - rest-api
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-24
content_type: "how-to"
---

# Getting a Bearer Token via curl (IDP Mode)

When the Developer Portal is configured with an external IDP (e.g. Asgardeo), REST API calls to `/api/v0.9/*` must include an `Authorization: Bearer <token>` header. This guide shows how to obtain that token from the terminal, without a browser.

!!! note
    If you're running in **local auth mode** instead (the default for local development), get a token from the Platform API directly — see [Getting Started](../getting-started.md) — no PKCE flow needed.

## Prerequisites

- IDP is configured (`idp.client_id` is set in `config.toml` — see [Integrate Third-Party Identity Providers](../setting-up/integrate-identity-providers.md))
- The `dp:*` scopes are registered in the IDP and assigned to your user (see [Asgardeo Setup](../setting-up/integrate-identity-providers.md#asgardeo-setup) sections 3–4)
- You have the **client ID** and **client secret** from your IDP application
- You know your org's identifier (the `ORGANIZATION_IDENTIFIER` value used to scope the login, e.g. `sub`)

## Flow: Authorization Code + PKCE

The devportal application is a confidential Traditional Web App — it uses authorization code flow with PKCE and a client secret. You need to:

1. Generate a PKCE code verifier and challenge
2. Open the authorization URL (paste into a browser)
3. Exchange the authorization code for a token

## Step 1 — Generate PKCE Values

```bash
# Code verifier: 43–128 random URL-safe characters
CODE_VERIFIER=$(openssl rand -base64 64 | tr -d '=+/' | cut -c1-64)

# Code challenge: SHA-256 of the verifier, base64url-encoded
CODE_CHALLENGE=$(echo -n "$CODE_VERIFIER" | openssl dgst -sha256 -binary | base64 | tr '+/' '-_' | tr -d '=')

echo "CODE_VERIFIER=$CODE_VERIFIER"
echo "CODE_CHALLENGE=$CODE_CHALLENGE"
```

## Step 2 — Start a Local Redirect Listener

The IDP redirects back to a callback URI with the authorization code. Use `nc` to capture it:

```bash
PORT=8080
nc -l $PORT &
NC_PID=$!
```

!!! note
    Register `http://localhost:8080` as an authorized redirect URI in your IDP application before proceeding.

## Step 3 — Build the Authorization URL and Open It

```bash
TENANT=<your-tenant>                           # e.g. dev1234
CLIENT_ID=<devportal-app-client-id>
ORG_IDENTIFIER=<org-identifier>                # ORGANIZATION_IDENTIFIER value, e.g. "sub"
STATE=$(openssl rand -hex 16)

AUTH_URL="https://api.asgardeo.io/t/${TENANT}/oauth2/authorize\
?response_type=code\
&client_id=${CLIENT_ID}\
&redirect_uri=http://localhost:${PORT}\
&scope=openid%20profile%20email%20dp:api_manage%20dp:app_manage%20dp:org_manage%20dp:subscription_manage\
&code_challenge=${CODE_CHALLENGE}\
&code_challenge_method=S256\
&state=${STATE}\
&org=${ORG_IDENTIFIER}"

echo "Open this URL in your browser:"
echo "$AUTH_URL"
```

Open the URL, log in, and approve. The browser is redirected to `http://localhost:8080?code=...&state=...` — the `nc` process captures the raw HTTP request.

## Step 4 — Extract the Authorization Code

```bash
# nc prints something like:
# GET /?code=abc123xyz&state=... HTTP/1.1

CODE=<paste-code-value-here>
kill $NC_PID 2>/dev/null
```

## Step 5 — Exchange the Code for a Token

```bash
TOKEN_URL="https://api.asgardeo.io/t/${TENANT}/oauth2/token"
CLIENT_SECRET=<devportal-app-client-secret>

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

## Step 6 — Call the API

```bash
# The org is resolved from the token's org claim (set via ORGANIZATION_IDENTIFIER
# during login in Step 3) — no org identifier needed in the request itself.
BASE="https://localhost:3000/api/v0.9"

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
| `404 Organization not found` | Token's org claim doesn't match any known org | Verify `ORGANIZATION_IDENTIFIER` matches an org's `idpRefId` |
| `403 Forbidden` (scope error) | Token is missing required `dp:*` scopes | Complete Asgardeo Setup sections 3–4: register scopes and assign the role to your user |
| `401 Authentication required` | Token expired or invalid | Re-run steps 1–5 for a fresh token |
| Token has no `dp:*` scopes | Role not assigned to the user | In the Asgardeo console, assign the `dp_admin` role to the user |
| `nc` gets no output | Redirect URI not registered in IDP | Add `http://localhost:8080` to authorized redirect URIs |

## Token Lifetime

Asgardeo access tokens typically expire in 3600 seconds (1 hour). Re-run steps 1–5 for a new one — the devportal also supports refresh tokens, but from the terminal it's simpler to just re-authenticate.

## Related

- [Integrate Third-Party Identity Providers](../setting-up/integrate-identity-providers.md)
- [Management API](../rest-api/overview.md)
- [Configurations](configurations.md)
