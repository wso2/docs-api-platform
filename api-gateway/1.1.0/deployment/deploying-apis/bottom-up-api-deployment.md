---
title: "Bottom-Up API Deployment Guide"
description: "Deploy REST APIs directly to API Platform Gateway and automatically sync them to on-prem WSO2 API Manager using bottom-up deployment."
canonical_url: https://wso2.com/api-platform/docs/api-gateway/deployment/deploying-apis/bottom-up-api-deployment/
md_url: https://wso2.com/api-platform/docs/api-gateway/deployment/deploying-apis/bottom-up-api-deployment.md
tags:
  - api-gateway
  - deployment
  - api-management
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-11
content_type: "how-to"
---

# Bottom-Up API Deployment Guide

## Overview

When you deploy a REST API via the gateway controller's REST API endpoint, the gateway **automatically tracks it for bottom-up sync** to on-prem WSO2 APIM 4.7.x (if configured for on-prem control plane mode).

### Understanding API Deployment Approaches

The WSO2 API Platform gateway supports two fundamentally different deployment approaches, distinguished by the **direction of API flow**:

#### **Top-Down Deployment (Control Plane → Gateway)**

In top-down deployment, the **platform-API (central control plane) pushes APIs to the gateway** via WebSocket connection.

**How it works:**
- Control plane is the source of truth
- Platform-API sends API definitions via WebSocket
- Gateway receives and applies these definitions
- Gateway pulls configuration from control plane

#### **Bottom-Up Deployment (Gateway → On-Prem APIM)**

Currently this support is only available for the on prem APIM control plane type.

In bottom-up deployment, **REST APIs deployed directly to the gateway are automatically synced back to on-prem WSO2 APIM.** (If configured with on prem control plane type. Cloud control plane is not having this support at the moment.).

**How it works:**
- Gateway is the initial deployment point
- API is deployed via `POST /rest-apis` REST endpoint
- Gateway makes API available immediately
- Gateway then syncs the API to on-prem APIM (if connected)

**Characteristics:**
- **Data flow:** Gateway → On-Prem APIM
- **Use case:** On-prem APIM integration
- **Sync:** Automatic and tracked (pending/success/failed)
- **Status tracking:** Yes, tracked internally and observable via gateway controller logs
- **Continues working:** API remains available on gateway even if APIM is unavailable


#### **Key Differences**

| Aspect | Top-Down | Bottom-Up |
|--------|----------|-----------|
| **Initiation** | Control plane (platform-API) | Gateway (REST API) |
| **Direction** | Platform-API → Gateway | Gateway → On-Prem APIM |
| **Source of Truth** | Central control plane | Local gateway |
| **APIM Integration** | Not applicable | Syncs to on-prem APIM |
| **Status Tracking** | Managed by platform-API | Tracked in gateway DB |
| **Failure Handling** | Depends on platform-API | API works, sync retries |

---

**This guide focuses on Bottom-Up deployment** with automatic sync to on-prem APIM.

## Prerequisites

### Gateway Controller Requirements

- Gateway controller running locally or remotely
- Management API endpoint: `http://localhost:9090/api/management/v0.9` (default)

### Bottom-Up API Sync Requirements

- On-prem WSO2 APIM instance
- Control plane configuration with on-prem mode enabled
- Network connectivity between gateway controller and APIM
- APIM OAuth2 credentials (client ID/secret or username/password)

---

## Configuration

### Gateway Controller Configuration

**File:** `config.toml`

```toml
[controller.server]
gateway_id = "gateway-1"
port = 9090

[controller.controlplane]
# For bottom-up sync to on-prem APIM
host = "192.168.0.102:9443"
insecure_skip_verify = true

# OAuth2 credentials (choose one option)
# Option A: Client credentials flow
apim_oauth2_client_id = "<clientId>"
apim_oauth2_client_secret = "<clientSecret>"

# Option B: Resource owner password flow
# apim_oauth2_username = "admin"
# apim_oauth2_password = "admin"

gateway_name = "onprem-gw"

[controller.auth.basic]
enabled = true

[[controller.auth.basic.users]]
username = "admin"
password = "admin"
roles = ["admin"]
```

---

## How It Works

### Sync Behavior

When you deploy a REST API via the gateway controller:

1. **API is deployed to the gateway immediately**
   - Available for routing
   - API keys can be created
   - Requests are processed

2. **Sync to On-Prem APIM (if configured)**
   - Only happens if `controller.controlplane.host` is configured
   - Only happens if gateway is connected to on-prem APIM
   - Status tracked in database: `pending` → `success`/`failed`
   - Automatic retries (3 attempts) on failure

### Conditions for Sync

All three must be true:

```go
controlPlaneClient != nil &&           // APIM config exists
controlPlaneClient.IsConnected() &&    // WebSocket connected to APIM
controlPlaneClient.IsOnPrem()          // On-prem mode detected (via .well-known endpoint)
```

### What Happens If Sync Fails

- API **remains available on the gateway**
- Status marked as `failed` with error details
- Automatic retry on next API update
- Manual retry: Update the API with same definition

---

## REST API Deployment

Bottom-up APIs are REST APIs deployed via the gateway controller that are **automatically synced** to on-prem WSO2 APIM.

### Key Features

- All REST APIs deployed via gateway are tracked for bottom-up sync
- Automatic sync to on-prem APIM (if connected)
- No manual push required - happens in background
- Sync status tracking (pending, success, failed)
- Automatic retry logic (3 attempts on failure)
- Support for API updates and undeployment
- Continues working even if APIM is temporarily unavailable

### Deployment Flow

```
┌─────────────────────────────────────────────────┐
│   REST API Deployed via POST /rest-apis         │
└────────────────────┬────────────────────────────┘
                     │
                     ▼ (Origin = "gateway_api")
          ┌─────────────────────┐
          │ Store in Database   │
          │ CPSyncStatus:       │
          │ pending             │
          └─────────┬───────────┘
                    │
         ┌──────────┴──────────┐
         │                     │
         ▼                     ▼
    ┌─────────┐        ┌───────────────┐
    │ Gateway │        │ Check Control │
    │ Ready   │        │ Plane Status  │
    │ (API    │        │ - Connected?  │
    │ Routing)│        │ - On-prem?    │
    └─────────┘        └───────┬───────┘
         │                     │
         │              ┌──────┴────────┐
         │              │               │
         │              ▼               ▼
         │        ┌──────────┐  ┌─────────────┐
         │        │ Sync to  │  │ API works   │
         │        │ APIM     │  │ locally but │
         │        │ success  │  │ no APIM     │
         │        │ status:  │  │ sync (wait) │
         │        │ success  │  └─────────────┘
         │        └──────────┘
         │
         └─────────────────────────┐
                                   │
                                   ▼
                          ┌────────────────┐
                          │ API Available  │
                          │ on Gateway:    │
                          │ - Routing      │
                          │ - API Keys     │
                          │ - Policies     │
                          └────────────────┘
```

### API Definition

All REST APIs deployed via the gateway will be synced to on-prem APIM automatically. Here's a complete example:

```yaml
apiVersion: gateway.api-platform.wso2.com/v1alpha1
kind: RestApi
metadata:
  name: PetStoreAPI
spec:
  displayName: PetStore API
  version: v1.0
  context: /petstore
  
  upstream:
    main:
      url: "https://petstore.example.com"
  
  # API-level policies apply to all operations
  policies:
    - name: api-key-auth
      version: v1
      params:
        key: X-API-Key
        in: header
    
    - name: basic-ratelimit
      version: v1
      params:
        limits:
          - requests: 1000
            duration: 1h
  
  operations:
    - method: GET
      path: /pet/{petId}
      # Operation-level policies override API-level
      policies:
        - name: basic-ratelimit
          version: v1
          params:
            limits:
              - requests: 100
                duration: 1m
    
    - method: POST
      path: /pet
    
    - method: PUT
      path: /pet
    
    - method: DELETE
      path: /pet/{petId}
    
    - method: GET
      path: /store/inventory
    
    - method: POST
      path: /store/order
    
    - method: GET
      path: /
```

**Important Notes:**

- `metadata.name` must be unique per API
- `context` becomes the URL path prefix on the gateway
- `upstream.main.url` is required (backend service)
- `version` is tracked separately (can have multiple versions of same API)
- Policies are optional but recommended for security

### Deployment Steps

**Step 1: Create API YAML**

Save the API definition as `petstore-api.yaml`:

```yaml
apiVersion: gateway.api-platform.wso2.com/v1alpha1
kind: RestApi
metadata:
  name: PetStoreAPI
spec:
  displayName: PetStore API
  version: v1.0
  context: /petstore
  upstream:
    main:
      url: https://petstore.example.com
  policies:
    - name: api-key-auth
      version: v1
      params:
        key: X-API-Key
        in: header
  operations:
    - method: GET
      path: /pet/{petId}
    - method: POST
      path: /pet
    - method: PUT
      path: /pet
    - method: DELETE
      path: /pet/{petId}
    - method: GET
      path: /store/inventory
    - method: POST
      path: /store/order
    - method: GET
      path: /
```

**Step 2: Deploy to Gateway**

!!! note
    The examples below use a `BASE64_CREDENTIALS` environment variable for the Basic auth header. Set it before running any `curl` command:
    ```bash
    export BASE64_CREDENTIALS=$(echo -n "admin:admin" | base64)
    ```

```bash
curl -X POST http://localhost:9090/api/management/v0.9/rest-apis \
  -H "Content-Type: application/yaml" \
  -H "Authorization: Basic ${BASE64_CREDENTIALS}" \
  --data-binary @petstore-api.yaml
```

**Response:**
```json
{
  "uuid": "api-uuid-12345",
  "displayName": "PetStore API",
  "version": "v1.0",
  "context": "/petstore",
  "origin": "gateway_api",
  "desiredState": "deployed",
  "createdAt": "2026-04-26T10:30:00Z"
}
```

!!! note
    Check the gateway controller logs to confirm control plane sync status. Look for `"Bottom-up sync: starting"` and `"Bottom-up sync: API synced successfully"` entries. If sync fails, the log will show the error detail and the gateway will retry automatically.

**Step 3: Test API on Gateway**

```bash
# Get API key
curl -X POST http://localhost:9090/api/management/v0.9/rest-apis/PetStoreAPI/api-keys \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic ${BASE64_CREDENTIALS}" \
  -d '{"name": "test-key"}'

# Invoke API
curl http://localhost:8080/petstore/pet/123 \
  -H "X-API-Key: <api-key-from-step-above>"
```

**Step 4: Verify in On-Prem APIM (Optional)**

Once sync completes, API is available in APIM:

```bash
# Login to APIM and check
curl -X GET https://192.168.0.102:9443/api/am/publisher/v4/apis \
  -H "Authorization: Bearer <apim-token>" | jq '.list[] | select(.name=="PetStore API")'
```

---

## API Updates

### Automatic Re-Sync on Update

When you update an API, it's automatically re-synced to on-prem APIM (if connected).

**Example: Add Rate Limiting Policy**

Update your API definition to add a rate limit policy and save as `petstore-api-updated.yaml`:

```yaml
apiVersion: gateway.api-platform.wso2.com/v1alpha1
kind: RestApi
metadata:
  name: PetStoreAPI
spec:
  displayName: PetStore API
  version: v1.0
  context: /petstore
  upstream:
    main:
      url: https://petstore.example.com
  policies:
    - name: basic-ratelimit
      version: v1
      params:
        limits:
          - requests: 1000
            duration: 1h
    - name: api-key-auth
      version: v1
      params:
        key: X-API-Key
        in: header
  operations:
    - method: GET
      path: /pet/{petId}
```

**Send Update Request:**

```bash
curl -X PUT http://localhost:9090/api/management/v0.9/rest-apis/PetStoreAPI \
  -H "Content-Type: application/yaml" \
  -H "Authorization: Basic ${BASE64_CREDENTIALS}" \
  --data-binary @petstore-api-updated.yaml
```

**What Happens:**

1. API updated on gateway immediately
2. Sync status internally reset to `pending`
3. Automatically re-synced to on-prem APIM
4. Both gateway and APIM have the updated version

**Check Updated Status:**

Monitor gateway controller logs for the sync result:

```bash
# Watch for sync outcome after update
./gateway-controller 2>&1 | grep "Bottom-up sync"
```

---

## API Undeploy

### Undeploy from Gateway and APIM

To undeploy an API, send a DELETE request with the API name:

```bash
curl -X DELETE http://localhost:9090/api/management/v0.9/rest-apis/PetStoreAPI \
  -H "Authorization: Basic ${BASE64_CREDENTIALS}"
```

**Response:**
```json
{
  "status": "success",
  "message": "RestAPI deleted successfully",
  "id": "PetStoreAPI"
}
```

---

## API Management Operations

### Create API Key

```bash
curl -X POST http://localhost:9090/api/management/v0.9/rest-apis/PetStoreAPI/api-keys \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic ${BASE64_CREDENTIALS}" \
  -d '{
    "name": "my-api-key"
  }'
```

**Response:**
```json
{
  "uuid": "key-uuid-12345",
  "name": "my-api-key",
  "key": "apip_39ec8f6b69ef0edaf090e11be4dbf6c379176c53cd9a86131ee3c1fc4df0a8ds",
  "createdAt": "2026-04-26T10:30:00Z"
}
```

### Invoke Protected API

```bash
curl http://localhost:8080/petstore/pet/1 \
  -H "X-API-Key: apip_39ec8f6b69ef0edaf090e11be4dbf6c379176c53cd9a86131ee3c1fc4df0a8ds"
```

### List API Keys

```bash
curl -X GET http://localhost:9090/api/management/v0.9/rest-apis/PetStoreAPI/api-keys \
  -H "Authorization: Basic ${BASE64_CREDENTIALS}"
```

### Revoke API Key

```bash
curl -X DELETE http://localhost:9090/api/management/v0.9/rest-apis/PetStoreAPI/api-keys/key-uuid-12345 \
  -H "Authorization: Basic ${BASE64_CREDENTIALS}"
```

---

## Sync Status Tracking

### Understand Sync States

The gateway tracks the APIM sync state internally in its database. You can monitor it via the gateway controller logs.

| Status | Meaning | Log signal |
|--------|---------|------------|
| `pending` | Waiting to sync to APIM | `"Bottom-up sync: starting"` |
| `success` | Successfully synced to APIM | `"Bottom-up sync: API synced successfully"` |
| `failed` | Sync failed after 3 retries | `"Bottom-up sync: all retries exhausted"` |


### Retry Failed Sync

If sync fails, the gateway automatically retries up to 3 times per sync cycle. Sync is re-triggered on the next control plane reconnection, or immediately when you update the API.

To manually trigger a retry, update the API with the same definition:

```bash
curl -X PUT http://localhost:9090/api/management/v0.9/rest-apis/PetStoreAPI \
  -H "Content-Type: application/yaml" \
  -H "Authorization: Basic ${BASE64_CREDENTIALS}" \
  --data-binary @petstore-api.yaml
```

---

## Troubleshooting

### Issue: API Not Syncing to APIM

**Symptom:** Gateway logs show `"Bottom-up sync: attempt failed"` or `"Bottom-up sync: all retries exhausted"`

**Possible Causes & Solutions:**

#### 1. Control Plane Not Configured

```bash
# Check if host is set
echo $APIP_GW_CONTROLLER__CONTROLPLANE__HOST
# or check config.toml [controller.controlplane] section
```

**Fix:** Set the on-prem APIM host:
```bash
export APIP_GW_CONTROLLER__CONTROLPLANE__HOST=192.168.0.102:9443
export APIP_GW_CONTROLLER__CONTROLPLANE__APIM_OAUTH2__CLIENT_ID=...
export APIP_GW_CONTROLLER__CONTROLPLANE__APIM_OAUTH2__CLIENT_SECRET=...
```

#### 2. APIM Not Reachable

**Check connectivity:**

```bash
# Test well-known endpoint (returns gateway path for on-prem mode)
curl -k https://192.168.0.102:9443/internal/gateway/.well-known

# Expected response:
# {"gatewayPath": "/internal/data/v1"}
```

**Fix:** 
- Verify network connectivity to APIM host
- Check firewall rules
- Verify HTTPS/TLS settings (`insecureSkipVerify` may be needed)

#### 3. Invalid OAuth2 Credentials

**Check APIM logs** for authentication errors

**Fix:**
- Verify `apim_oauth2_client_id` and `apim_oauth2_client_secret` are correct
- Ensure OAuth2 credentials have proper scopes: `apim:api_import_export apim:api_view`
- Try alternative auth method (username/password instead of client credentials)

#### 4. Missing Upstream URL

**Check API definition:**

```bash
curl -X GET http://localhost:9090/api/management/v0.9/rest-apis/PetStoreAPI \
  -H "Authorization: Basic ${BASE64_CREDENTIALS}" | jq '.spec.upstream'
```

**Fix:** Ensure `upstream.main.url` is set to a valid backend service

#### 5. Gateway-Controller Not Connected to APIM

**Check if gateway is connected:**

```bash
# Look for connection logs
export APIP_GW_LOG_LEVEL=debug
# Restart gateway controller
# Check logs for: "Bottom-up sync: starting"
```

**If not connected:**
1. Wait for automatic reconnection (happens periodically)
2. Or manually trigger by updating the API:
   ```bash
   curl -X PUT http://localhost:9090/api/management/v0.9/rest-apis/PetStoreAPI \
     -H "Content-Type: application/yaml" \
     -H "Authorization: Basic ${BASE64_CREDENTIALS}" \
     --data-binary @api-definition.yaml
   ```

**View Gateway Connection Status:**

Check gateway controller logs for:
- `"Connected to control plane"` - Connected to APIM
- `"Failed to resolve gateway path"` - Can't reach APIM
- `"Resolved WebSocket connect URL"` - On-prem mode detected

### Issue: "Access Token Not Found"

**Cause:** APIM OAuth2 token endpoint returned invalid response

**Solution:**
1. Verify credentials are correct
2. Check APIM OAuth2 endpoint is accessible
3. Enable debug logging to see the actual response

```bash
export APIP_GW_LOG_LEVEL=debug
```

### Issue: "On-prem Control Plane Mode Not Enabled"

**Cause:** `IsOnPrem()` check is failing

**Solution:**
1. Verify APIM `.well-known` endpoint returns `gatewayPath`
2. Check network connectivity to APIM
3. Verify `host` configuration is correct

```bash
# Test well-known endpoint
curl -k https://192.168.0.102:9443/internal/gateway/.well-known
```

Expected response:
```json
{
  "gatewayPath": "/internal/data/v1"
}
```

---