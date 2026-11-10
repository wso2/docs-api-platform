---
title: "Deploy and Test an API on a Self Hosted Gateway"
pagination_label: "Self-Hosted Gateway Deploy and Test an API"
description: "Create, Deploy and Test a REST API using your connected Self Hosted Gateway"
---

# Deploy and Test an API on a Self-Hosted Gateway

This guide creates a REST API proxy from an OpenAPI definition, deploys it to your self-hosted gateway, and invokes it.

## Prerequisites

- A self-hosted gateway that shows **Active** in the console. If you don't have one, follow the [Quick Start](./quickstart-guide.md).
- A backend that the **gateway** can reach. The gateway calls the backend, not the cloud, so a backend on a private network works as long as the gateway host can route to it.

This guide uses the sample **Reading List API**, whose backend is publicly reachable.

## Step 1: Create the API proxy

1. In the console, go to **Projects** and open a project (for example, **default**).
2. Click **+ Create API**.
3. **What kind of API are you exposing?** Select **REST API** and click **Continue**.

4. **How do you want to define your REST API?** You can either:
   - choose **Start from scratch** and enter the backend **Endpoint URL**, or
   - choose **Start with a contract** and import an OpenAPI definition from a **URL** or by **Upload**.

   For this guide, select **Start with a contract → URL** and click **Try with Sample URL**. The console fills in the Reading List OpenAPI URL and previews its resources (`GET /books`, `POST /books`, `GET`/`PUT`/`DELETE /books/{id}`). Click **Continue**.

   ![Import the Reading List OpenAPI contract](/img/cloud/self-hosted-gateway/create-and-test-api/self-hosted-create-and-test-api-step-2.png)

5. **Configure and create.** Review the values taken from the contract:

   | Field | Sample value |
   |---|---|
   | Name | `Reading List API` |
   | Identifier | `reading-list-api` |
   | Version | `1.0` |
   | Context | `/default/reading-list-api/v1.0` |
   | Target URL (backend) | `https://apis.bijira.dev/samples/reading-list-api-service/v1.0` |

   ![Configure and create the API](/img/cloud/self-hosted-gateway/create-and-test-api/self-hosted-create-and-test-api-step-3.png)

6. Click **Create**.

The API overview page opens. The progress bar shows **Create → Deploy → Test → Publish**, with **Create** complete.

> You don't choose a gateway when you create an API. You choose it when you deploy, in the next step.

## Step 2: Deploy the API to the self-hosted gateway

1. On the API overview page, click **Deploy to Gateway**, or click **Deploy** in the left navigation.
2. The **Deploy** page shows a **Build Area** and one card per environment. The card lists that environment's gateways and how many are active. Your self-hosted gateway appears as `<environment>-<gateway-handle>`, for example `development-local-self-hosted-gateway`, with the status **Not deployed**.

   ![Deploy page before the first deployment](/img/cloud/self-hosted-gateway/create-and-test-api/self-hosted-create-and-test-api-step-5.png)

3. Click **Build and deploy**.
4. In the **Deploy to development** dialog, check the **Gateway** (your self-hosted gateway) and the backend **Endpoint URL**, then click **Deploy**.

   ![Deploy dialog targeting the self-hosted gateway](/img/cloud/self-hosted-gateway/create-and-test-api/self-hosted-create-and-test-api-step-6.png)

The console creates a build (named by date, for example `2026-11-04-1`) and sends it to the gateway. The gateway row shows **Deploying**, then **Active** once the gateway confirms it. Reload the page if the status doesn't change.

![API deployed and Active on the self-hosted gateway](/img/cloud/self-hosted-gateway/create-and-test-api/self-hosted-create-and-test-api-step-7.png)

On the gateway host, the controller logs show the deployment arriving and being applied:

```text
msg="Received WebSocket event" type=api.deployed ...
msg="Processing API deployment" api_id=... deployment_id=...
msg="API configuration created" name="Reading List API" version=1.0
msg="Deployment ack sent" deployment_id=...
msg="Runtime deploy config added" key=RestApi:reading-list-api kind=RestApi name="Reading List API" routes=5 policy_chains=5
```

> A self-hosted gateway is never an environment's default gateway, so make sure it is the gateway selected in the deploy dialog.

## Step 3: Test the API

1. In the left navigation, click **Test**.
2. In the **Gateway** selector, choose your self-hosted gateway (for example, **Local Self-Hosted Gateway — Development**). The base URL next to it combines the gateway **URL** you configured with the API context:

   ```text
   https://localhost:8443/default/reading-list-api/v1.0
   ```

3. Switch to **CURL VIEW**, choose a resource (for example `GET /books`), and copy the generated command.

![Invoke the Deployed API using the Test Console's cURL View](/img/cloud/self-hosted-gateway/create-and-test-api/self-hosted-create-and-test-api-step-8.png)

4. Run it from a machine that can reach the gateway. The default listener certificate is self-signed, so add `-k` (or `--cacert <your-ca.pem>`) until you install a trusted certificate:

   ```bash
   curl -k -X GET 'https://localhost:8443/default/reading-list-api/v1.0/books'
   ```

   Expected response (`200 OK`):

   ```json
   {
     "books": [
       { "id": "1d4c9647-5e62-4f1d-9c30-e1f25c6d0e73", "title": "The Great Gatsby", "author": "F. Scott Fitzgerald", "status": "read" },
       { "id": "be8c8194-0342-4ed7-bd64-47ad47f214b6", "title": "1984", "author": "George Orwell", "status": "to_read" },
       { "id": "660f6db1-1390-460d-9c0b-df7a4028ff4e", "title": "The Hobbit", "author": "J. R. R. Tolkien", "status": "reading" }
     ]
   }
   ```

> **CONSOLE VIEW** sends requests from your browser straight to the gateway URL. It works only if your browser can reach that URL and trusts the gateway's certificate. If it fails with a network or certificate error, use **CURL VIEW**, or open the gateway URL in the browser once and trust its certificate.

> **Security note:** an API with no security policy attached can be called without credentials, as in the example above. Attach an authentication policy (for example API Key or JWT) under **Develop → Policies**, and redeploy before you expose the gateway beyond a trusted network.

## Update or remove a deployment

- **Redeploy after changes.** Changes to an API (resources, policies, endpoint) reach the gateway only when you deploy again. On the **Deploy** page, click **Deploy**; the arrow next to it selects which build to deploy. Each deployment creates a new build in the **Build Area**.
- **Undeploy.** On the **Deploy** page, expand the gateway row and click **Stop deployment**. The gateway removes the API's routes.
- **Gateway offline during a change?** The gateway re-syncs every deployment assigned to it when it reconnects, and periodically after that, so it catches up automatically.

## Troubleshooting

| Symptom | Cause / fix |
|---|---|
| Self-hosted gateway isn't listed on the **Deploy** page | It belongs to a different environment, or it hasn't connected yet. Check its environment and status on the **Gateways** page. |
| Status stays **Deploying** | The gateway didn't acknowledge the deployment. Check that it is **Active**, then look for errors in `docker compose logs gateway-controller` after `Received WebSocket event type=api.deployed`. |
| `curl: (60) SSL certificate problem` | The listener certificate is self-signed. Use `-k`, pass `--cacert`, or install a certificate for your gateway hostname. |
| `404` from the gateway | The path doesn't match a deployed route. Check the context (for example `/default/reading-list-api/v1.0`) and the resource path, and confirm the deployment is **Active**. |
| `502`/`503` from the gateway | The gateway can't reach the backend. Check DNS and network routing from the gateway host or pod to the endpoint URL. |
| Test command points to the wrong host or port | The command uses the gateway **URL** from the gateway's settings. Update it with **Edit** on the gateway. |
