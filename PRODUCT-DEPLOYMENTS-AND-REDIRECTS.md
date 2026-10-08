# Product Deployments and docs-staging Redirects

Reference data for the branch-per-product-version Choreo deployments and the `docs-staging` nginx routing needed to unify them under one site.

Base URL: `https://wso2.com/api-platform/docs-staging/` is the intended base URL for this experimental site \- every path and example below is written relative to it.

## How this is organized

- **Versioned** \- API Manager, API Gateway, AI Gateway, API Portal, AI Workspace. One branch per version, each its own deployment.  
  - Format: `<slug>/<version>/<page>/`  
  - Example: `ai-gateway/1.1.0/overview/` \- served by the `ai-gateway-1.1.0` branch  
  - Full URL: `https://wso2.com/api-platform/docs-staging/ai-gateway/1.1.0/overview/`  
- **Unversioned, bundled** \- Analytics, Monetization, Policy Hub, Guides, Tools. All five share one branch, `platform-common`.  
  - Format: `<slug>/<page>/`  
  - Example: `policy-hub/overview/` \- served by `platform-common`  
  - Full URL: `https://wso2.com/api-platform/docs-staging/policy-hub/overview/`  
- **Unversioned, standalone** \- Cloud. Its own branch (`cloud`), kept separate from `platform-common`.  
  - Format: `<slug>/<page>/`  
  - Example: `cloud/overview/` \- served by `cloud`  
  - Full URL: `https://wso2.com/api-platform/docs-staging/cloud/overview/`

## Required Routing Rules

Written technology-agnostically \- not nginx-specific \- since it's not yet decided whether `docs-staging` will sit behind nginx, Cloudflare, or something else. Whatever serves it needs to support two rule types:

1. **Path-prefix forwarding** \- if the request path starts with a given prefix, forward the request to the given origin, with the rest of the path and query string kept unchanged (no rewriting or stripping).  
2. **Referer-based forwarding** (search only) \- forward based on matching a pattern against the `Referer` header instead of the path, since the path alone (`/search/...`) doesn't say which product's page the search happened from.

**One rule per product, not one per version.** Each versioned product (API Manager, API Gateway, AI Gateway, API Portal, AI Workspace) now has its own small "router" deployment sitting in front of all of that product's versions \- a tiny reverse proxy that does its own internal version-level forwarding, using the exact same two rule types above, scoped to just that product's own versions. Infra's rule below points at the router, not at any individual version's raw deployment \- adding, removing, or re-pointing a version is then a change to that router alone, never a change here. See "Routers" under Deployments below for what each one is and where it lives.

> **Open question before finalizing with infra:** every path below assumes `docs-staging` sits at the domain root when these rules are evaluated. The real site is a sub-path (`wso2.com/api-platform/docs-staging/`), so confirm whether infra's routing strips that prefix before these rules apply, or whether every path below needs the full `/api-platform/docs-staging/` prefix added (a mechanical find-and-replace either way, not a redesign).

### Rule type 1: path-prefix forwarding

| Path prefix | Forward to |
| :---- | :---- |
| `/api-manager/` | `https://d2ea1fe5-e3fe-4f74-81ee-881c41fa8bc0.e1-us-east-azure.choreoapps.dev` (router) |
| `/api-gateway/` | `https://5b613c4e-50a4-47a4-9fca-4ec1e73f5774.e1-us-east-azure.choreoapps.dev` (router) |
| `/ai-gateway/` | `https://fa5c197c-5213-455e-abc9-0dea77bea496.e1-us-east-azure.choreoapps.dev` (router) |
| `/api-portal/` | `https://f8436a95-add7-4776-9674-7ec67888deed.e1-us-east-azure.choreoapps.dev` (router) |
| `/ai-workspace/` | `https://9385f3d4-057f-48f9-9051-4ac01dc5b3bd.e1-us-east-azure.choreoapps.dev` (router) |
| `/cloud/` | `https://9782180b-c65f-48d6-bef4-f5bdcdbb0245.e1-us-east-azure.choreoapps.dev` |
| \- `/analytics/` \- `/monetization/` \- `/policy-hub/` \- `/guides/` \- `/tools/` \- `/assets/` \- *(anything else \- default/catch-all)* | `https://50dcbee2-0809-4bf1-801f-b820c18e9816.e1-us-east-azure.choreoapps.dev` |

**9 rules total**, down from one per version (\~26). For the 5 rows marked "(router)": the router itself picks the correct version internally from the rest of the path \- nothing about the version needs to be known or configured here.

Notes:

- **`/assets/*`**: every page references its CSS/JS/images via relative paths that resolve to a site-root-relative `/assets/...` request regardless of which product/version page it came from. Confirmed byte-identical across branches (md5-checked), so routing it to any one backend is safe.  
- **Default/catch-all**: `platform-common` doubles as the site's landing page \- it carries the generic `Overview`/`Get Started` pages (same content every branch used to duplicate locally), so anything unmatched above (including bare `docs-staging/`) falls through to it.

### Rule type 2: Referer-based forwarding (search only)

Applies only to requests under `/search/`. Match the `Referer` header against each pattern below, in order; forward to the first match. If nothing matches \- `Referer` missing/stripped, or a search from bare `docs-staging/` \- fall back to the default row, same target as the path-prefix default above.

| Referer contains | Forward to |
| :---- | :---- |
| `/api-manager/` | `https://d2ea1fe5-e3fe-4f74-81ee-881c41fa8bc0.e1-us-east-azure.choreoapps.dev` (router) |
| `/api-gateway/` | `https://5b613c4e-50a4-47a4-9fca-4ec1e73f5774.e1-us-east-azure.choreoapps.dev` (router) |
| `/ai-gateway/` | `https://fa5c197c-5213-455e-abc9-0dea77bea496.e1-us-east-azure.choreoapps.dev` (router) |
| `/api-portal/` | `https://f8436a95-add7-4776-9674-7ec67888deed.e1-us-east-azure.choreoapps.dev` (router) |
| `/ai-workspace/` | `https://9385f3d4-057f-48f9-9051-4ac01dc5b3bd.e1-us-east-azure.choreoapps.dev` (router) |
| `/cloud/` | `https://9782180b-c65f-48d6-bef4-f5bdcdbb0245.e1-us-east-azure.choreoapps.dev` |
| \- `/analytics/` \- `/monetization/` \- `/policy-hub/` \- `/guides/` \- `/tools/` \- *(no match / missing Referer \- default)* | `https://50dcbee2-0809-4bf1-801f-b820c18e9816.e1-us-east-azure.choreoapps.dev` |

For the 5 rows marked "(router)": that router does its own Referer-based lookup internally to resolve down to the correct *version*, same mechanism, one level deeper. This is not optional for those five \- confirmed by testing that without it, a browser's own cache silently serves one version's search results under a different version's pages, since the request path itself (`/search/...`) is identical regardless of version. Whatever serves this rule should also send `Cache-Control: no-store` (or equivalent) on the forwarded response, for the same reason.

---

## Deployments

### Shared infrastructure

| Component | Branch | URL |
| :---- | :---- | :---- |
| Shared assets (theme.js, root-index.json, docs\_shared\_hooks) | `docs-shared` | `https://8c140a8d-7209-401b-84ab-2aebe8deaa80.e1-us-east-azure.choreoapps.dev` |

### Routers

One per versioned product. Each is a small, standalone nginx deployment \- not a fork or copy of any product branch \- whose only job is forwarding a request under its product's own versions to that version's real deployment below, invisibly. See "Required Routing Rules" above for what infra points at these, and each router's own branch/README for how it works internally.

| Product | Branch | URL |
| :---- | :---- | :---- |
| API Manager | `router_api-manager` | `https://d2ea1fe5-e3fe-4f74-81ee-881c41fa8bc0.e1-us-east-azure.choreoapps.dev` |
| API Gateway | `router_api-gateway` | `https://5b613c4e-50a4-47a4-9fca-4ec1e73f5774.e1-us-east-azure.choreoapps.dev` |
| AI Gateway | `router_ai-gateway` | `https://fa5c197c-5213-455e-abc9-0dea77bea496.e1-us-east-azure.choreoapps.dev` |
| API Portal | `router_api-portal` | `https://f8436a95-add7-4776-9674-7ec67888deed.e1-us-east-azure.choreoapps.dev` |
| AI Workspace | `router_ai-workspace` | `https://9385f3d4-057f-48f9-9051-4ac01dc5b3bd.e1-us-east-azure.choreoapps.dev` |

### Products and versions

#### Unversioned

| Product | Branch | URL |
| :---- | :---- | :---- |
| Platform common (Analytics, Monetization, Policy Hub, Guides, Tools, Overview, Get Started) | `platform-common` | `https://50dcbee2-0809-4bf1-801f-b820c18e9816.e1-us-east-azure.choreoapps.dev` |
| Cloud | `cloud` | `https://9782180b-c65f-48d6-bef4-f5bdcdbb0245.e1-us-east-azure.choreoapps.dev` |

#### API Manager

| Version | Branch | URL | Status |
| :---- | :---- | :---- | :---- |
| 4.7.0 (default) | `apim-4.7.0` | `https://0f2f65aa-8eb1-45c9-85b5-3ce198bd532a.e1-us-east-azure.choreoapps.dev` | Deployed |
| 4.6.0 | `apim-4.6.0` | `https://af9e99fc-6a88-4960-a69e-5ffdcd457040.e1-us-east-azure.choreoapps.dev` | Deployed |
| 4.5.0 | `apim-4.5.0` | `https://9601dab6-b5d5-4c76-844a-23adabf456ce.e1-us-east-azure.choreoapps.dev` | Deployed |
| 4.4.0 | `apim-4.4.0` | `https://016ec2d5-7731-44af-aa60-0c153c692bb7.e1-us-east-azure.choreoapps.dev` | Deployed |
| 4.3.0 | `apim-4.3.0` | `https://8703ad4a-5a8b-46d4-abe6-764a9b745629.e1-us-east-azure.choreoapps.dev` | Deployed |
| 4.2.0 | `apim-4.2.0` | *pending* | Build was failing; last retrigger still running |
| 4.1.0 | `apim-4.1.0` | *pending* | Build was failing; last retrigger still running |
| 4.0.0 | `apim-4.0.0` | *pending* | Build was failing; last retrigger still running |
| 3.2.0 | `apim-3.2.0` | `https://96bc6fb8-b05b-40a7-a0b2-65ccd80a64c3.e1-us-east-azure.choreoapps.dev` | Deployed |
| 3.1.0 | `apim-3.1.0` | `https://4f2660ec-ab45-424e-afcb-35186e853555.e1-us-east-azure.choreoapps.dev` | Deployed |
| 3.0.0 | `apim-3.0.0` | `https://8540e59c-40d5-4309-8473-4163804cfa88.e1-us-east-azure.choreoapps.dev` | Deployed |

#### API Gateway

| Version | Branch | URL |
| :---- | :---- | :---- |
| 1.2.0 (default) | `api-gateway-1.2.0` | `https://e7d9f3fd-5ce8-479a-a1a8-2096a79d2a40.e1-us-east-azure.choreoapps.dev` |
| 1.1.0 | `api-gateway-1.1.0` | `https://e752eeef-9ca7-4802-93a2-cbcd49b339f1.e1-us-east-azure.choreoapps.dev` |
| 1.0.0 | `api-gateway-1.0.0` | `https://19bb36e9-2dee-40b3-b8af-fce663e524ea.e1-us-east-azure.choreoapps.dev` |
| next | `api-gateway-next` | `https://83f98214-b906-4935-9e34-81776c7f75ab.e1-us-east-azure.choreoapps.dev` |

#### AI Gateway

| Version | Branch | URL |
| :---- | :---- | :---- |
| 1.2.0 (default) | `ai-gateway-1.2.0` | `https://5d231cdd-f1d5-4773-a749-a2344f068912.e1-us-east-azure.choreoapps.dev` |
| 1.1.0 | `ai-gateway-1.1.0` | `https://dae05d97-95f2-4b51-86cc-6a356fd09a9b.e1-us-east-azure.choreoapps.dev` |
| 1.0.0 | `ai-gateway-1.0.0` | `https://1d9bf875-4ad4-4ad2-9389-ee91f8c1d520.e1-us-east-azure.choreoapps.dev` |
| next | `ai-gateway-next` | `https://2ab3ae07-8c3e-43e1-9120-6bfd93ced0c0.e1-us-east-azure.choreoapps.dev` |

#### API Portal

| Version | Branch | URL |
| :---- | :---- | :---- |
| 1.0.0 (default) | `api-portal-1.0.0` | `https://bd6a7e9f-488d-488a-bdcf-0a8c1ec14745.e1-us-east-azure.choreoapps.dev` |
| next | `api-portal-next` | `https://0e34c3b9-d440-4c73-834a-955022ea4862.e1-us-east-azure.choreoapps.dev` |

#### AI Workspace

| Version | Branch | URL |
| :---- | :---- | :---- |
| 1.0.0 (default) | `ai-workspace-1.0.0` | `https://2f5fc131-fc7f-4083-8116-f8c142336798.e1-us-east-azure.choreoapps.dev` |
| next | `ai-workspace-next` | `https://b3277ac5-c604-4ab6-8092-066b58dbb5ba.e1-us-east-azure.choreoapps.dev` |

&nbsp;