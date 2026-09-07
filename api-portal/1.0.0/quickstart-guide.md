---
title: "Quick start for API Portal and MCP Hub"
description: "Install the API Portal and MCP Hub with Docker, then add an API and an MCP server through the admin UI and through GitOps."
canonical_url: https://wso2.com/api-platform/docs/api-portal/quickstart-guide/
md_url: https://wso2.com/api-platform/docs/api-portal/quickstart-guide.md
tags:
  - cloud
  - api-portal
  - mcp
  - quickstart
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-27
content_type: "quickstart"
---

# Quick start for API Portal and MCP Hub

API Portal and MCP Hub allows developers to discover, subscribe to, and consume the APIs and Model Context Protocol (MCP) servers you publish. This guide is for developers who want to publish to it end to end. You'll install the Portal with Docker, then add one API and one MCP server in two ways: 

- Through the API Portal and MCP Hub UI 
- Through the Management API

The latter method allows you to carry out GitOps workflows and manage your APIs, MCP servers, documentation, and other resources declaratively "as-code".

This guide assumes basic familiarity with Docker, YAML, and the command line. See [Concepts](concepts.md) for the terms used throughout this guide: 

- API 
- MCP server
- Label 
- Subscription plan

## Before you start
Before going through this quickstart, complete the following prerequisites:

- Install [Docker](https://docs.docker.com/get-docker/) with the Compose plugin. You can check the installed version with the `docker compose version` command.
- `openssl`, `curl`, `unzip`, and `jq` are available to use in the command line.
- The following ports are available on your machine: 
    - `9543` for API Portal and MCP Hub
    - `9243` for Platform API

## Install API Portal and MCP Hub

### Step 1: Download API Portal and MCP Hub

Run this command in your terminal to download and unzip the standalone API Portal distribution:

```bash
curl -sLO https://github.com/wso2/api-platform/releases/download/api-portal%2Fv1.0.0/wso2apip-api-portal-1.0.0.zip && \
unzip wso2apip-api-portal-1.0.0.zip
```

### Step 2: Run the setup script

Navigate to the API Portal directory:

```bash
cd wso2apip-api-portal-1.0.0
```

Run this command to set up the API Portal:

```bash
./scripts/setup.sh
```

The script prompts you for an admin username and password. Press <kbd>Enter</kbd> at the password prompt to have the script generate a strong password for you.

!!! warning "Save the printed admin credentials"
    The script shows the admin password once and never stores it in plain text. If you lose it, remove the `APIP_CP_ADMIN_USERNAME` and `APIP_CP_ADMIN_PASSWORD_HASH` variables from the `api-platform.env` file. Then run `./scripts/setup.sh` to generate a new one.

For more information about the script and the resources it provisions, [see the getting started guide](getting-started.md#step-2-run-the-setup-script).

### Step 3: Start the portal

Start the Portal with the following command:

```bash
docker compose up
```

Then verify the health of the Platform API sidecar:

```bash
curl -fk https://localhost:9243/health
```

It returns `{"status":"ok"}` for a healthy Platform API sidecar. 

### Step 4: Open the portal and log in

Go to `https://localhost:9543/api-portal/default/views/default`. Click **Log In** and [sign in with the admin username and password from step 2](#step-2-run-the-setup-script).

!!! note "Browser trust warning?"
    The generated TLS certificate is self-signed. Click **Advanced > Proceed** to continue.

## Add an API through the API Portal and MCP Hub UI

In this step, you'll add an API that tracks a list of books. You can find the API's manifest and OpenAPI definition in the 
`resources/samples/apis/reading-list-api-v1.0/` directory of the API Portal and MCP Hub distribution.

### Step 1: Open the Add API wizard

Go to **Settings** from the navigation menu and click **APIs**. Then click **Add API**.

### Step 2: Enter API details

Enter the API details as follows and leave every other field at its default:

| Field | Value |
|---|---|
| **API name** | Reading List API |
| **Version** | v1.0 |
| **API type** | REST |
| **Agent visibility** | Visible |
| **Description** | Sample reading list API for tracking books and their reading status. Open access: no API key or subscription required. |
| **Production URL** | `https://apis.bijira.dev/samples/reading-list-api-service/v1.0` |
| **Sandbox URL** | `https://apis.bijira.dev/samples/reading-list-api-service/v1.0` |
| **Labels** | default |
| **Tags** | reading-list, books |
| **Status** | Published |
| **Technical owner / email** | API Team / `architecture@example.com` |
| **Business owner / email** | Platform Owner / `support@example.com` |
| **Applicable Subscription Plans** | Leave empty |

Click **Next**.

### Step 3: Upload the OpenAPI definition

Upload the OpenAPI definition of the Reading List API. You can also find the definition in the `resources/samples/apis/reading-list-api-v1.0/definition.yml` file of the API Portal and MCP Hub distribution folder. Then click **Next**.

```yaml
openapi: 3.0.1
info:
  title: Reading-List-API
  version: v1.0
  description: |
    Track a personal reading list — add books, update their reading status, and
    remove them when you are done.

    Open access: no API key or subscription token is required.
servers:
  - url: https://apis.bijira.dev/samples/reading-list-api-service/v1.0

components:
  schemas:
    Book:
      type: object
      properties:
        id:
          type: string
          format: uuid
          description: Server-assigned identifier. Ignored on create.
          readOnly: true
          example: 1d4c9647-5e62-4f1d-9c30-e1f25c6d0e73
        title:
          type: string
          example: The Great Gatsby
        author:
          type: string
          example: F. Scott Fitzgerald
        status:
          type: string
          description: Where the book sits in the reading list.
          enum:
            - to_read
            - reading
            - read
          example: read
      required:
        - title
        - author
        - status
    BookList:
      type: object
      properties:
        books:
          type: array
          items:
            $ref: '#/components/schemas/Book'
      required:
        - books
    Error:
      type: object
      properties:
        error:
          type: string
          example: UUID does not exist
      required:
        - error

paths:
  /books:
    get:
      summary: List books
      description: Returns every book on the reading list.
      operationId: listBooks
      tags:
        - books
      responses:
        '200':
          description: OK. The reading list.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/BookList'
    post:
      summary: Add a book
      description: Adds a book to the reading list and returns it with its assigned id.
      operationId: addBook
      tags:
        - books
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Book'
      responses:
        '201':
          description: Created. The newly added book.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Book'
        '400':
          description: Bad Request. Invalid request body.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /books/{id}:
    parameters:
      - name: id
        in: path
        required: true
        description: Unique identifier of the book.
        schema:
          type: string
          format: uuid
    get:
      summary: Get a book
      description: Returns a single book by id.
      operationId: getBook
      tags:
        - books
      responses:
        '200':
          description: OK. The requested book.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Book'
        '404':
          description: Not Found. No book with that id.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
    put:
      summary: Update a book
      description: Replaces a book's details — commonly used to move it between reading statuses.
      operationId: updateBook
      tags:
        - books
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Book'
      responses:
        '200':
          description: OK. The updated book.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Book'
        '404':
          description: Not Found. No book with that id.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
    delete:
      summary: Remove a book
      description: Removes a book from the reading list.
      operationId: deleteBook
      tags:
        - books
      responses:
        '204':
          description: No Content. The book was removed.
        '404':
          description: Not Found. No book with that id.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
```

### Step 4: Add the API's documentation (optional)

You can upload the API's documentation in a Markdown file. For the Reading List API, you can find a documentation in `resources/samples/apis/reading-list-api-v1.0/docs/overview.md`. Then click **Save API** to create the API.

### Step 5: Verify that the APIs catalog page lists the new API

Refresh the **APIs** listing page. The Reading List API card appears. The card shows various details of the API, for example: 

- The **REST** and **AI Ready** badges
- Description
- Tags 

Because the API has no subscription plan, the card shows no plan count or **Subscribe** button.

## Add an API through GitOps

In this section, you will add a product catalog API through the [API Portal Management API](./rest-api/overview.md). The product catalog API demonstrates token-based subscription access. It defines Gold and Bronze subscription plans. The API also decalres an API key-based security in its OpenAPI definition.

Before you follow these steps, navigate to the root directory of the API Portal and MCP Hub distribution folder.

### Step 1: Get a bearer token

Get a token from the Platform API using the admin credentials that you obtained in [step 2](#step-2-run-the-setup-script):

```bash
TOKEN=$(curl -sk -X POST "https://localhost:9243/api/portal/v0.9/auth/login" \
  -d "username=<admin-username>&password=<admin-password>" | jq -r .token)
```

### Step 2: Prepare the API manifest and OpenAPI definition

Use the following manifest for the product catalog API:

```yaml
apiVersion: api-portal.api-platform.wso2.com/v1
kind: RestApi

metadata:
  name: catalog-api-v1.0

spec:
  type: REST
  displayName: Catalog API
  version: v1.0
  description: Sample product catalog API demonstrating token-based subscription access. Subscribe to a Gold or Bronze plan to receive a subscription token, then send both the API key (X-API-Key) and the subscription token (X-Subscription-Token) headers on every request.
  status: PUBLISHED
  referenceID: catalog-api-v1.0

  tags:
    - catalog
    - api-key
    - subscription-token

  labels:
    - default

  subscriptionPlans:
    - Gold
    - Bronze

  agentVisibility: VISIBLE

  businessInformation:
    businessOwner: Platform Owner
    businessOwnerEmail: support@example.com
    technicalOwner: API Team
    technicalOwnerEmail: architecture@example.com

  endpoints:
    sandboxUrl: http://localhost:8080/catalog
    productionUrl: http://localhost:8080/catalog
```

And use the following OpenAPI definition:

```yaml
openapi: 3.0.1
info:
  title: Catalog API
  version: 1.0.0
  description: |
    Product catalog API with token-based subscription access control.

    Subscribe to a Gold or Bronze plan in the API Portal to receive a
    **subscription token**. Every request must include both an **API key**
    (`X-API-Key` header) and the **subscription token** (`X-Subscription-Token`
    header).
servers:
  - url: /catalog
security:
  - ApiKeyHeader: []
components:
  securitySchemes:
    ApiKeyHeader:
      type: apiKey
      in: header
      name: X-API-Key
  parameters:
    SubscriptionTokenHeader:
      name: Subscription-Token
      x-header-type: subscription-key   # marks the API as token-based subscription
      in: header
      required: true
      schema:
        type: string
  schemas:
    Product:
      type: object
      properties:
        productId:
          type: string
          example: prod-00456
        name:
          type: string
          example: Wireless Headphones
        description:
          type: string
          example: Over-ear noise-cancelling wireless headphones
        price:
          type: number
          format: float
          example: 149.99
        categoryId:
          type: string
          example: cat-electronics
        inStock:
          type: boolean
          example: true
      required:
        - productId
        - name
        - price
        - categoryId
    Category:
      type: object
      properties:
        categoryId:
          type: string
          example: cat-electronics
        name:
          type: string
          example: Electronics
        description:
          type: string
          example: Consumer electronics and accessories
      required:
        - categoryId
        - name
    Error:
      type: object
      properties:
        code:
          type: integer
          format: int32
        message:
          type: string
      required:
        - code
        - message

paths:
  /products:
    get:
      summary: List all products
      description: Returns a paginated list of products in the catalog.
      operationId: listProducts
      tags:
        - products
      parameters:
        - name: categoryId
          in: query
          required: false
          description: Filter products by category.
          schema:
            type: string
        - name: limit
          in: query
          required: false
          description: Maximum number of products to return.
          schema:
            type: integer
            default: 20
      responses:
        '200':
          description: OK. List of products.
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Product'

  /products/{productId}:
    get:
      summary: Get a product
      description: Returns full details of a single product by ID.
      operationId: getProduct
      tags:
        - products
      parameters:
        - name: productId
          in: path
          required: true
          description: Unique identifier of the product.
          schema:
            type: string
      responses:
        '200':
          description: OK. Product details.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Product'
        '404':
          description: Not Found. Product does not exist.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /categories:
    get:
      summary: List all categories
      description: Returns all product categories available in the catalog.
      operationId: listCategories
      tags:
        - categories
      responses:
        '200':
          description: OK. List of categories.
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Category'
```

You can also find the manifest and the definition in the `resources/samples/apis/catalog-api-v1.0/` directory of the API Portal and MCP Hub distribution folder.

### Step 3: Publish the API

Use the following command to publish the API:

```bash
curl -k -X POST "https://localhost:9543/api-portal/api/v0.9/apis" \
  -H "Authorization: Bearer $TOKEN" \
  -F "metadata=@resources/samples/apis/catalog-api-v1.0/api.yaml;type=application/yaml" \
  -F "definition=@resources/samples/apis/catalog-api-v1.0/definition.yaml;type=application/octet-stream"
```

A successful operation responds back the API's metadata in the terminal:

```json
{
  "name": "Catalog API",
  "version": "v1.0",
  "description": "Sample product catalog API demonstrating token-based subscription access. Subscribe to a Gold or Bronze plan to receive a subscription token, then send both the API key (X-API-Key) and the subscription token (X-Subscription-Token) headers on every request.",
  "type": "RestApi",
  "status": "PUBLISHED",
  "agentVisibility": "VISIBLE",
  "tags": [
    "catalog",
    "api-key",
    "subscription-token"
  ],
  "labels": [
    "default"
  ],
  "owners": {
    "businessOwner": "Platform Owner",
    "businessOwnerEmail": "support@example.com",
    "technicalOwner": "API Team",
    "technicalOwnerEmail": "architecture@example.com"
  },
  "endPoints": {
    "sandboxURL": "http://localhost:8080/catalog",
    "productionURL": "http://localhost:8080/catalog"
  },
  "subscriptionPlans": [
    {
      "id": "Gold"
    },
    {
      "id": "Bronze"
    }
  ],
  "id": "catalog-api-v1.0",
  "createdBy": "admin",
  "updatedBy": "admin",
  "createdAt": "2026-08-27T13:38:55.379Z",
  "updatedAt": "2026-08-27T13:38:55.379Z"
}
```

### Step 4: Verify that the APIs catalog page lists the product catalog API

Refresh the **APIs** listing page. The Catalog API card appears. The card shows various details of the API like the Reading List API, for example: 

- The **REST** and **AI Ready** badges
- Description
- Tags 
- The number of available subscription plans

Unlike the Reading List API you have added, the Catalog API offers two subscription plans. So the card shows the number of plans available and a **Subscribe** button.

## Add an MCP server through the API Portal and MCP Hub UI

In this step, you'll add a sample MCP server exercising the Model Context Protocol's tools, prompts, resources, and sampling. You can find its manifest and tools definition in the `resources/samples/mcps/everything-mcp-server-v1.0/` directory of the API Portal and MCP Hub distribution folder.

### Step 1: Open the Add MCP Server wizard

Go to **Settings** from the navigation menu and click **MCP Servers**. Then click **Add MCP Server**.

### Step 2: Enter MCP server details

Enter the MCP server details as follows and leave every other field at its default:

| Field | Value |
|---|---|
| **API name** | Everything MCP Server |
| **Version** | v1.0 |
| **API type** | MCP |
| **Agent visibility** | Visible |
| **Description** | A reference MCP server that exercises the whole protocol — tools, prompts, resources, and sampling. Built for developers testing an MCP client, with a pizza-ordering flow standing in for a real workload. |
| **Production URL** | `https://db720294-98fd-40f4-85a1-cc6a3b65bc9a-prod.e1-us-east-azure.choreoapis.dev/godzilla/mcp-everything-server/v1.0/mcp` |
| **Sandbox URL** | Same as production |
| **Labels** | default |
| **Tags** | mcp, ai-agent, reference, testing |
| **Status** | Published |
| **Technical owner / email** | Platform Team / `platform-team@example.com` |
| **Business owner / email** | API Team / `api-team@example.com` |
| **Subscription Plans** | Silver, Bronze |

Click **Next**.

### Step 3: Upload the tools definition

Next, upload the tools definition. You can also find it in the `resources/samples/mcps/everything-mcp-server-v1.0/definition.yaml` file of the API Portal and MCP Hub distribution folder. Then click **Next**.

```yaml
- type: TOOL
  name: echo
  description: Echoes back the input.
  inputSchema:
    type: object
    properties:
      message:
        type: string
        description: Message to echo
    required:
      - message

- type: TOOL
  name: add
  description: Adds two numbers.
  inputSchema:
    type: object
    properties:
      a:
        type: number
        description: First number
      b:
        type: number
        description: Second number
    required:
      - a
      - b

- type: TOOL
  name: viewPizzaMenu
  description: View the pizza menu. This tool provides a list of available pizzas.
  inputSchema:
    type: object
    properties: {}

- type: TOOL
  name: orderPizza
  description: Order a pizza from the menu. This tool allows you to place an order for a pizza.
  inputSchema:
    type: object
    properties:
      pizzaType:
        type: string
        description: Type of pizza to order
      quantity:
        type: integer
        minimum: 1
        description: Number of pizzas to order
      customerName:
        type: string
        description: Name of the customer
      deliveryAddress:
        type: string
        description: Delivery address for the order
      creditCardNumber:
        type: string
        description: Credit card number for payment
    required:
      - pizzaType
      - quantity
      - customerName
      - deliveryAddress
      - creditCardNumber

- type: RESOURCE
  name: test-resource
  description: One of 100 numbered test resources. Even-numbered ones return plain text, odd-numbered ones return base64-encoded binary. Supports subscriptions, and subscribed resources auto-update every 5 seconds.
  uri: test://static/resource/1
  mimeType: text/plain

- type: PROMPT
  name: simple_prompt
  description: A basic prompt that takes no arguments and returns a single message exchange.

- type: PROMPT
  name: complex_prompt
  description: Demonstrates argument handling — returns a multi-turn conversation that includes images.
  arguments:
    - name: temperature
      description: Temperature setting
      required: true
    - name: style
      description: Output style preference (e.g. casual, formal, technical, friendly)
      required: false

- type: PROMPT
  name: resource_prompt
  description: Demonstrates embedding a resource reference directly in prompt messages.
  arguments:
    - name: resourceId
      description: ID of the resource to embed, from 1 to 100
      required: true
```

### Step 4: Add the MCP server's documentation (optional)

You can upload the MCP server's documentation in a Markdown file. For this MCP server, you can find a documentation in `resources/samples/mcps/everything-mcp-server-v1.0/docs/getting-started.md`. Then click **Save API** to create the server.

### Step 5: Verify that the MCP server appears in the catalog and the registry

Refresh the **MCP Servers** listing page. The Everything MCP Server card appears, showing various details, for example: 

- The **MCP** and **AI Ready** badges
- Description
- Tags 
- The number of available subscription plans
- A **Subscribe** button.

Then use the following command to find the MCP server in the [MCP Registry](mcp-registry.md):

```bash
curl -sk "https://localhost:9543/api-portal/registry/default/v0.1/servers?search=everything" | jq .
```

Look for an entry in the `servers` array for the server you just added:

```json
{
  "servers": [
    {
      "server": {
        "$schema": "https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json",
        "name": "Everything MCP Server",
        "version": "1.0",
        "description": "A reference MCP server that exercises the whole protocol — tools, prompts, resources, and sampling. Built for developers testing an MCP client, with a pizza-ordering flow standing in for a real workload.",
        "remotes": [
          {
            "type": "streamable-http",
            "url": "https://db720294-98fd-40f4-85a1-cc6a3b65bc9a-prod.e1-us-east-azure.bijiraapis.dev/godzilla/mcp-everything-server/v1.0/mcp"
          }
        ]
      },
      "_meta": {
        "io.modelcontextprotocol.registry/official": {
          "status": "active",
          "isLatest": true
        }
      }
    }
  ],
  "metadata": {
    "count": 1
  }
}
```

## Add an MCP server through GitOps

In this section, you will publish another version of the Everything MCP Server through [the API Portal Management API](./rest-api/overview.md). It reuses the same tools definition. We update the metadata for a different version of the same MCP server without altering the tool schema.

Before you follow these steps, navigate to the root directory of the API Portal and MCP Hub distribution folder.

### Step 1: Reuse or refresh your bearer token

Reuse the bearer token that you obtained [when adding an API through the Management API](#step-1-get-a-bearer-token). Alternatively, get a fresh one the same way if you're starting a new terminal session.

### Step 2: Write a manifest for the new version

Create `mcp.yaml` with a new `metadata.name` and `spec.version`:

```yaml
apiVersion: api-portal.api-platform.wso2.com/v1
kind: MCP

metadata:
  name: everything-mcp-server-v1.1

spec:
  type: MCP
  displayName: Everything MCP Server
  version: v1.1
  description: A reference MCP server that exercises the whole protocol — tools, prompts, resources, and sampling. Built for developers testing an MCP client, with a pizza-ordering flow standing in for a real workload.
  status: PUBLISHED

  tags:
    - mcp
    - ai-agent
    - reference
    - testing

  labels:
    - default

  subscriptionPlans:
    - Silver
    - Bronze

  agentVisibility: VISIBLE

  businessInformation:
    businessOwner: API Team
    businessOwnerEmail: api-team@example.com
    technicalOwner: Platform Team
    technicalOwnerEmail: platform-team@example.com

  endpoints:
    productionUrl: https://db720294-98fd-40f4-85a1-cc6a3b65bc9a-prod.e1-us-east-azure.choreoapis.dev/godzilla/mcp-everything-server/v1.0/mcp
    sandboxUrl: https://db720294-98fd-40f4-85a1-cc6a3b65bc9a-prod.e1-us-east-azure.choreoapis.dev/godzilla/mcp-everything-server/v1.0/mcp
```

The rest of the data is the same as the `resources/samples/mcps/everything-mcp-server-v1.0/api.yaml` file in your API Portal and MCP Hub distribution folder.

### Step 3: Reuse the bundled tools definition

Version 1.1 of the Everything MCP Server exposes the same tools, prompts, and resources. So [reuse the same tools definition you used when adding the MCP server through the API Portal and MCP Hub UI](#step-3-upload-the-tools-definition). 

### Step 4: Publish the new version of the MCP server

Use the following command to publish version 1.1 of the Everything MCP Server:

```bash
curl -k -X POST "https://localhost:9543/api-portal/api/v0.9/mcp-servers" \
  -H "Authorization: Bearer $TOKEN" \
  -F "metadata=@mcp.yaml;type=application/yaml" \
  -F "definition=@resources/samples/mcps/everything-mcp-server-v1.0/definition.yaml;type=application/octet-stream"
```

### Step 5: Verify that both versions appear in the catalog and the registry

Refresh the **MCP Servers** listing page. Two Everything MCP Server cards now appear: version 1.0 and version 1.1.

Query the registry again:

```bash
curl -sk "https://localhost:9543/api-portal/registry/default/v0.1/servers?search=everything" | jq .
```

The `servers` array now includes both versions:

```json
{
  "servers": [
    {
      "server": {
        "$schema": "https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json",
        "name": "Everything MCP Server",
        "version": "1.0",
        "description": "A reference MCP server that exercises the whole protocol — tools, prompts, resources, and sampling. Built for developers testing an MCP client, with a pizza-ordering flow standing in for a real workload.",
        "remotes": [
          {
            "type": "streamable-http",
            "url": "https://db720294-98fd-40f4-85a1-cc6a3b65bc9a-prod.e1-us-east-azure.bijiraapis.dev/godzilla/mcp-everything-server/v1.0/mcp"
          }
        ]
      },
      "_meta": {
        "io.modelcontextprotocol.registry/official": {
          "status": "active",
          "isLatest": true
        }
      }
    },
    {
      "server": {
        "$schema": "https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json",
        "name": "Everything MCP Server",
        "version": "v1.1",
        "description": "A reference MCP server that exercises the whole protocol — tools, prompts, resources, and sampling. Built for developers testing an MCP client, with a pizza-ordering flow standing in for a real workload.",
        "remotes": [
          {
            "type": "streamable-http",
            "url": "https://db720294-98fd-40f4-85a1-cc6a3b65bc9a-prod.e1-us-east-azure.bijiraapis.dev/godzilla/mcp-everything-server/v1.0/mcp"
          }
        ]
      },
      "_meta": {
        "io.modelcontextprotocol.registry/official": {
          "status": "active",
          "isLatest": true
        }
      }
    }
  ],
  "metadata": {
    "count": 2
  }
}
```

## Next steps

- See the [getting started guide for API Portal and MCP Hub](./getting-started.md).
- To route MCP traffic through a gateway, with authentication and access control, see the [MCP Proxy quickstart guide](../../ai-gateway/1.0.0/mcp-proxy/quick-start-guide.md).
- See [Manage APIs](admin-settings/manage-apis.md) and [Manage MCP Servers](admin-settings/manage-mcp-servers.md) for the full admin reference for editing, publishing, deprecating, and deleting APIs and MCP servers. 
- See [MCP Registry API](mcp-registry.md) for the full discovery and publishing reference, including how to update or delete a published version.
- For information about the consumer side of your published APIs and MCP servers, like subscribing, getting a token, and calling an artifact, see [Manage Subscriptions](consume-an-api/manage-subscriptions.md) and [Connect to an MCP Server](mcp-servers/connect-to-an-mcp-server.md).
- See [AI Agent Discovery](ai-agent-discovery.md) for information about `llms.txt` and Markdown endpoints AI agents use to find APIs and MCP servers