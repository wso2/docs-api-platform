---
title: "End to end: a secured API from gateway to portal"
description: "Stand up the control plane, portal, and gateway, publish an API that requires both a subscription token and an API key, and invoke it with credentials issued in the API Portal."
canonical_url: https://wso2.com/api-platform/docs/api-portal/tutorials/secured-api-end-to-end/
md_url: https://wso2.com/api-platform/docs/api-portal/tutorials/secured-api-end-to-end.md
tags:
  - cloud
  - api-portal
  - tutorials
  - authentication
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-05
content_type: "tutorial"
---

# End-to-end: a secured API from gateway to portal

This tutorial connects three pieces: the Platform API control plane, a gateway, and the API Portal. You'll publish an API that requires both a subscription token and an API key on every call. Then you'll generate both credentials in the portal and watch the gateway accept them.

The point of the exercise is the seam in the middle. The portal never talks to the gateway. When a developer subscribes or generates a key, the portal fires a **signed webhook** to the Platform API, which persists the credential and pushes it to every gateway where the API is deployed. Getting that seam right is most of the work, and most of this tutorial.

## What you'll build

```text
API Portal  ──signed webhook──▶  Platform API  ──control plane──▶  Gateway
 (issues the                     (verifies, decrypts,              (enforces
  credentials)                     persists, broadcasts)            on each call)
                                                                        ▲
                                          consumer's request ───────────┘
                                          API-Key + Subscription-Key
```

## Prerequisites

- Docker with the Compose plugin, `curl`, `unzip`, `jq`, and `openssl`
- Free ports: **9543** (portal), **9243** (Platform API), **9090** and **9094** (gateway management and admin), **8080** (gateway API listener)

## Step 1: Start the control plane and portal

The API Portal distribution ships the Platform API alongside it, so one compose file gives you both.

```bash
curl -sLO https://github.com/wso2/api-platform/releases/download/api-portal%2Fv1.0.0/wso2apip-api-portal-1.0.0.zip
unzip wso2apip-api-portal-1.0.0.zip
cd wso2apip-api-portal-1.0.0
./scripts/setup.sh
docker compose up -d
```

`setup.sh` provisions the TLS certificate, encryption keys, the RS256 JWT keypair the two services share, and your admin credentials. **Copy the admin password it prints**—it's shown once.

Confirm both are up:

```bash
curl -fsk https://localhost:9243/health && echo " platform-api ok"
curl -fsk -o /dev/null https://localhost:9543/api-portal/default/views/default && echo "api-portal ok"
```

Now get a Platform API token and create a project to hold the API. Every Platform API call below uses this token, and the portal accepts the same one—it verifies it against the shared public key.

```bash
export ADMIN_USERNAME=admin
export ADMIN_PASSWORD='<the password setup.sh printed>'

export TOKEN=$(curl -sk -X POST https://localhost:9243/api/portal/v0.9/auth/login \
  -d "username=$ADMIN_USERNAME&password=$ADMIN_PASSWORD" | jq -r .token)

export PROJECT_ID=$(curl -sk -X POST https://localhost:9243/api/v0.9/projects \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"id":"my-project","displayName":"My Project","description":"My tutorial project"}' | jq -r .id)

echo "project: $PROJECT_ID"
```

## Step 2: Register the gateway, then start it

A gateway has to be registered with the Platform API before it can join. Registration returns an id; a second call mints the token the gateway authenticates with.

```bash
export GW_NAME=my-gateway

curl -sk -X POST https://localhost:9243/api/v0.9/gateways \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d "{\"id\":\"$GW_NAME\",\"displayName\":\"$GW_NAME\",\"endpoints\":[\"http://localhost:8080\"],\"functionalityType\":\"regular\"}" | jq -r .id

export GW_TOKEN=$(curl -sk -X POST https://localhost:9243/api/v0.9/gateways/$GW_NAME/tokens \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' -d '{}' | jq -r .token)
```

Download the gateway distribution and run its setup:

```bash
cd ..
curl -sLO https://github.com/wso2/api-platform/releases/download/gateway%2Fv1.2.0-rc/wso2apip-api-gateway-1.2.0-rc.zip
unzip wso2apip-api-gateway-1.2.0-rc.zip
cd wso2apip-api-gateway-1.2.0-rc
./scripts/setup.sh
```

Point the controller at the control plane by adding these to `api-platform.env`, then start it:

```bash
cat >> api-platform.env <<EOF
APIP_GW_CONTROLLER_CONTROLPLANE_HOST=host.docker.internal:9243
APIP_GW_CONTROLLER_CONTROLPLANE_TOKEN=$GW_TOKEN
APIP_GW_CONTROLLER_CONTROLPLANE_GATEWAY_NAME=$GW_NAME
APIP_GW_CONTROLLER_CONTROLPLANE_INSECURE_SKIP_VERIFY=true
EOF

docker compose up -d
curl -fs http://localhost:9094/api/admin/v1/health && echo " gateway ok"
```

`APIP_GW_CONTROLLER_CONTROLPLANE_GATEWAY_NAME` must match the id you registered, and `INSECURE_SKIP_VERIFY` is needed here only because `setup.sh` generated a self-signed certificate. `CONTROLPLANE_HOST` is a `host:port` with no scheme—the controller prepends `https://` and `wss://` itself, so adding `https://` here makes the connection fail with a `lookup https: no such host` error.

!!! note
    `host.docker.internal` lets the gateway containers reach the Platform API published on your host. On Linux without that alias, put both stacks on one Docker network and use the service name instead.

## Step 3: Connect the portal's webhooks to the Platform API

This is the seam. Two things have to be true before a portal-issued credential can reach the gateway.

**First, link the portal's organization to the control plane.** The Platform API resolves each incoming event's organization by handle, read from `org.ref_id`, which comes from the portal organization's `cpRefId`:

```bash
curl -sk -X PUT https://localhost:9543/api-portal/api/v0.9/organizations/default \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"id":"default","displayName":"Default","idpRefId":"default","cpRefId":"default"}'
```

The update requires `id`, `displayName`, and `idpRefId`. The `id` and `idpRefId` are fixed at seed time and can't change, so pass their existing values (both `default` here)—only `cpRefId` is new.

You can set the same field from the portal UI instead: **Settings > Organization**, under the **ORGANIZATION** group, in the **Control plane reference ID** field. See [Organization settings](../admin-settings/organization-settings.md).

**Second, register the Platform API as a webhook subscriber.** The `secret` here does double duty: it signs each delivery and derives the key that encrypts the credential fields. It must equal `APIP_CP_WEBHOOK_SECRET` on the Platform API, or signature verification and decryption both fail.

```bash
export WEBHOOK_SECRET=$(openssl rand -hex 32)

curl -sk -X POST https://localhost:9543/api-portal/api/v0.9/webhook-subscribers \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d "{\"id\":\"platform-api\",\"displayName\":\"Platform API\",
       \"targetUrl\":\"https://platform-api:9243/api/internal/v0.9/webhook/events\",
       \"secret\":\"$WEBHOOK_SECRET\",
       \"events\":[\"apikey.*\",\"subscription.*\"],\"enabled\":true}"
```

The Platform API's webhook receiver ships disabled, and the shipped `configs/config.toml` has no `[platform_api.webhook]` section wiring in a secret—setting `APIP_CP_WEBHOOK_SECRET` alone does nothing. Enable the receiver and point it at the same secret, then set the value in `api-platform.env` and restart the Platform API so both changes take effect:



```bash
cd ../wso2apip-api-portal-1.0.0

cat >> configs/config.toml <<'EOF'

[platform_api.webhook]
enabled = true
secret  = '{{ env "APIP_CP_WEBHOOK_SECRET" }}'
EOF

echo "APIP_CP_WEBHOOK_SECRET=$WEBHOOK_SECRET" >> api-platform.env
chmod 600 api-platform.env
docker compose up -d platform-api
```



!!! important "Without this, every delivery fails with a plain 404"
    The route isn't conditionally rejecting the request—it's never registered on the server at all while `enabled` is `false`, so any delivery attempt gets a bare 404 with no error detail to explain why.

!!! warning
    `api-platform.env` now holds a live shared secret, alongside the admin password hash. Keep it readable only by its owner, and never commit it to source control.

`targetUrl` uses the container name because the portal reaches the Platform API across the Docker network, not through your host's published port.

!!! note "Webhook deliveries fail with a TLS error"
    The portal and the Platform API share a self-signed certificate, mounted into the `api-portal` container at `/etc/api-portal/tls/cert.pem`. Node doesn't trust it by default, so a delivery to `https://platform-api:9243/...` fails certificate verification until the portal process is told to trust that certificate. Point `NODE_EXTRA_CA_CERTS` at it and restart the portal:

    ```bash
    echo "NODE_EXTRA_CA_CERTS=/etc/api-portal/tls/cert.pem" >> api-platform.env
    docker compose up -d api-portal
    ```

You can register the same subscriber from the portal UI instead: **Settings > Webhooks**, under **INTEGRATIONS**, with **+ Add webhook**. See [Webhook Integration](../admin-settings/webhook-integration.md).

## Step 4: Create the secured API

Create a subscription plan on the Platform API:

```bash
export PLAN=gold

curl -sk -X POST https://localhost:9243/api/v0.9/subscription-plans \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d "{\"id\":\"$PLAN\",\"displayName\":\"$PLAN\",\"status\":\"ACTIVE\",
       \"limits\":[{\"limitType\":\"REQUEST_COUNT\",\"timeUnit\":\"HOUR\",\"limitCount\":10000}]}"
```

!!! warning "Give each plan a unique display name"
    The gateway stores plans keyed by gateway and **display name**. Two plans sharing one display name collide, and the second one—along with its subscriptions—silently fails to sync.

Now the API. Two policies do the enforcing: `api-key-auth` reads the key from a header you name, and `subscription-validation` reads the subscription token from another.

```bash
export API_ID=$(curl -sk -X POST https://localhost:9243/api/v0.9/rest-apis \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d "{\"displayName\":\"Reading List API\",\"context\":\"/reading-list/\$version\",\"version\":\"v1\",
       \"projectId\":\"$PROJECT_ID\",\"lifeCycleStatus\":\"PUBLISHED\",
       \"subscriptionPlans\":[\"$PLAN\"],
       \"upstream\":{\"main\":{\"url\":\"https://apis.bijira.dev/samples/reading-list-api-service/v1.0\"}},
       \"policies\":[
         {\"name\":\"api-key-auth\",\"version\":\"v1\",
          \"params\":{\"key\":\"API-Key\",\"in\":\"header\"}},
         {\"name\":\"subscription-validation\",\"version\":\"v1\",
          \"params\":{\"subscriptionKeyHeader\":\"Subscription-Key\"}}
       ]}" | jq -r .id)
```

The header names are the gateway's, set here—`API-Key` and `Subscription-Key` are the policy defaults, and changing these params changes what consumers must send.

Deploy it to the gateway, then confirm the route is live and enforcing. The deployment takes a `name` label, a `base` source (`current` deploys the latest working copy), and the target `gatewayId`:

```bash
curl -sk -X POST https://localhost:9243/api/v0.9/rest-apis/$API_ID/deployments \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d "{\"name\":\"v1.0\",\"base\":\"current\",\"gatewayId\":\"$GW_NAME\"}"

curl -s -o /dev/null -w '%{http_code}\n' http://localhost:8080/reading-list/v1/books
```

Expect **401** or **403**. A **404** means the route isn't programmed yet—wait a few seconds and retry.

!!! important "Deploy before issuing credentials"
    Do not create the subscription or key first. The Platform API only broadcasts credential events to gateways where the API is **already deployed**, and issuing an API key while no gateway is connected returns `503`. Once the API is deployed, credentials propagate live over the control-plane connection—no restart needed.

## Step 5: Mirror the API and plan into the portal

The Platform API resolves each event's API and plan by **handle**, so the portal's copies have to carry matching references. Together with the organization link from step 3, that's three linkages that must line up:

| Portal field | Must equal |
|---|---|
| Organization `cpRefId` | The Platform API organization handle (`default`) |
| API `referenceId` | The Platform API API handle |
| Plan `refId` | The Platform API plan handle |

Sync the plan:

```bash
curl -sk -X PUT https://localhost:9543/api-portal/api/v0.9/subscription-plans \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d "{\"id\":\"$PLAN\",\"displayName\":\"$PLAN\",\"refId\":\"$PLAN\",
        \"limits\":[{\"limitType\":\"REQUEST_COUNT\",\"limitCount\":10000,
                     \"timeUnit\":\"HOUR\",\"timeAmount\":1}]}"
```

You can set the same `refId` from the portal UI instead: **Settings > Subscription Plans**, under **ORGANIZATION**, in the **External reference ID** field when adding or editing the plan. See [Subscription plans](../admin-settings/subscription-plans.md).

Then publish the API to the portal with `referenceId` set to the Platform API handle, and its specification attached. Adding an API is also possible from **Settings > APIs**, under **CONTENT**, with **+ Add API**—see [Manage APIs](../admin-settings/manage-apis.md)—but that wizard has no field for `referenceId`, so this particular linkage still needs the manifest and the Management API. Create the manifest, setting `referenceId` to the value of `$API_ID` and listing `$PLAN` under `subscriptionPlans`:

```bash
cat > api.yaml <<EOF
apiVersion: api-portal.api-platform.wso2.com/v1
kind: RestApi

metadata:
  name: reading-list-api-v1

spec:
  type: REST
  displayName: Reading List API
  version: v1
  description: Track a personal reading list. Every call requires an API key and a subscription token.
  status: PUBLISHED
  referenceId: $API_ID

  tags:
    - reading-list

  labels:
    - default

  subscriptionPlans:
    - $PLAN

  agentVisibility: VISIBLE

  businessInformation:
    businessOwner: Platform Owner
    businessOwnerEmail: support@example.com
    technicalOwner: API Team
    technicalOwnerEmail: architecture@example.com

  endpoints:
    sandboxUrl: http://localhost:8080/reading-list/v1
    productionUrl: http://localhost:8080/reading-list/v1
EOF
```

Create the matching OpenAPI definition:

```bash
cat > definition.yaml <<'EOF'
openapi: 3.0.1
info:
  title: Reading List API
  version: v1
  description: |
    Track a personal reading list — add books, update their reading status, and
    remove them when you're done. Requires an API key and a subscription token.
servers:
  - url: http://localhost:8080/reading-list/v1
security:
  - ApiKeyHeader: []
components:
  securitySchemes:
    ApiKeyHeader:
      type: apiKey
      in: header
      name: API-Key
  parameters:
    SubscriptionKeyHeader:
      name: Subscription-Key
      x-header-type: subscription-key
      in: header
      required: true
      schema:
        type: string
  schemas:
    Book:
      type: object
      required: [title, author, status]
      properties:
        id:
          type: string
          format: uuid
          readOnly: true
        title:
          type: string
          example: The Great Gatsby
        author:
          type: string
          example: F. Scott Fitzgerald
        status:
          type: string
          enum: [to_read, reading, read]
paths:
  /books:
    parameters:
      - $ref: '#/components/parameters/SubscriptionKeyHeader'
    get:
      summary: List books
      responses:
        '200':
          description: OK. The reading list.
    post:
      summary: Add a book
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Book'
      responses:
        '201':
          description: Created. The newly added book.
  /books/{id}:
    parameters:
      - $ref: '#/components/parameters/SubscriptionKeyHeader'
      - name: id
        in: path
        required: true
        schema:
          type: string
          format: uuid
    get:
      summary: Get a book
      responses:
        '200':
          description: OK. The requested book.
    put:
      summary: Update a book
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Book'
      responses:
        '200':
          description: OK. The updated book.
    delete:
      summary: Remove a book
      responses:
        '204':
          description: No Content. The book was removed.
EOF
```

Publish both files:

```bash
curl -sk -X POST https://localhost:9543/api-portal/api/v0.9/apis \
  -H "Authorization: Bearer $TOKEN" \
  -F "metadata=@api.yaml;type=application/yaml" \
  -F "definition=@definition.yaml;type=application/yaml"
```

Open `https://localhost:9543/api-portal/default/views/default/apis`. The API appears in the catalog with its plan.

## Step 6: Get both credentials in the portal

Do this part in the portal UI—it's what a developer would actually do. Sign in with the admin credentials.

1. Open the API and click **Subscribe** on the plan. Copy the **subscription token** from the dialog.
2. Click **API Keys**, then **Generate API key**. Give it a name and copy the key.

Each action fires a webhook the Platform API turns into gateway state. For the equivalent REST calls, see [Subscriptions](../rest-api/subscriptions.md) and [API Keys](../rest-api/api-keys.md).

## Step 7: Invoke through the gateway

Send both credentials, in the headers the policies named:

```bash
export API_KEY='<the key from the portal>'
export SUB_TOKEN='<the subscription token from the portal>'

curl -i http://localhost:8080/reading-list/v1/books \
  -H "API-Key: $API_KEY" \
  -H "Subscription-Key: $SUB_TOKEN"
```

A **200** means the whole chain worked: the portal issued the credentials, signed and encrypted them into a webhook, the Platform API verified and decrypted them, and the gateway is now enforcing them on live traffic.

Propagation takes a moment. If you get a 401 or 403 immediately after generating the credentials, retry after a few seconds.

### Confirm each credential is really being checked

Drop one header at a time—each should be rejected:

```bash
curl -s -o /dev/null -w 'no credentials:      %{http_code}\n' http://localhost:8080/reading-list/v1/books
curl -s -o /dev/null -w 'key only:            %{http_code}\n' http://localhost:8080/reading-list/v1/books -H "API-Key: $API_KEY"
curl -s -o /dev/null -w 'subscription only:   %{http_code}\n' http://localhost:8080/reading-list/v1/books -H "Subscription-Key: $SUB_TOKEN"
```

## Step 8: Watch a lifecycle change propagate

Credential changes travel the same path. In the portal, revoke the API key, then call again with it:

```bash
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:8080/reading-list/v1/books \
  -H "API-Key: $API_KEY" -H "Subscription-Key: $SUB_TOKEN"
```

Once the webhook lands you get **401**—the key is gone from the gateway without anyone touching the gateway. Generate a new key and the call succeeds again.

The same holds for the subscription side, where a rejection reads as **403** rather than 401: suspending the subscription blocks calls, resuming restores them, and regenerating the token invalidates the old one while the new one works. See [Manage Subscriptions](../consume-an-api/manage-subscriptions.md).

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| `404` at the gateway | The route isn't programmed yet, or the API wasn't deployed to this gateway |
| `503` when generating an API key | No gateway is connected for that API—deploy it first |
| Credentials never start working | The webhook secret differs between the portal subscriber and `APIP_CP_WEBHOOK_SECRET`, so signatures fail and credential fields can't be decrypted |
| Only the subscription fails (`403`) | The portal plan's `refId` doesn't match the Platform API plan handle, or two plans share a display name |
| Every delivery gets a `404` | The Platform API's webhook receiver isn't enabled—add `[platform_api.webhook]` with `enabled = true` to `configs/config.toml` and restart it |
| Nothing arrives at all | The organization's `cpRefId` doesn't match the Platform API organization handle |
| Deliveries fail once and stop | Webhook delivery is attempted exactly once with no retry—check delivery history, see [Webhook Events](../rest-api/webhook-events.md) |

## Related

- [Webhook Event Catalog](../references/webhook-event-catalog.md): the events this flow depends on, their payloads, and the signing and encryption scheme
- [Webhook Integration](../admin-settings/webhook-integration.md): registering a subscriber from the Settings UI
- [Consume an API](../consume-an-api/overview.md): which credentials an API expects, and how to tell
- [Manage Subscriptions](../consume-an-api/manage-subscriptions.md) and [Manage API Keys](../consume-an-api/manage-api-keys.md): the consumer-side lifecycles
- [Getting Started](../getting-started.md): the portal on its own, without a gateway