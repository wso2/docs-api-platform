# API Management Cloud documentation

Docusaurus site for the API Management Cloud documentation, served at
`/api-platform/docs/cloud/`.

## Prerequisites

Node 20 or later. Run `nvm use` to pick the version in `.nvmrc` (Node 22).

## Run and build

```
npm install
npm start          # local dev server at http://localhost:3000/api-platform/docs/cloud/
npm run build      # production build into build/
npm run serve      # preview the production build locally
```

To use another port, run `npm start -- --port 3010`.

Set `BASE_URL` to build for another path, for example staging:
`BASE_URL=/api-platform/docs-staging/cloud/ npm run build`.

## Structure

The navigation is in `sidebars.js`. Pages are under `docs/`, and images are
under `static/img/cloud/`.

| Sidebar section | Folder |
|:----------------|:-------|
| Overview, Get Started, Key Concepts | `docs/overview.md`, `docs/get-started.md`, `docs/key-concepts.md` |
| API Control Plane | `docs/api-control-plane/` (`create-api-proxy/`, `develop-api-proxy/`, `deploy-api-proxy/`, `test-api-proxy/`, `publish-api-proxy/`, `observability/`, `insights/`, `administer/`) |
| API Portal and AI Hub | `docs/api-portal/` (paths and file names match the API Portal `next` docs) |
| API Gateway | `docs/api-gateway/` (`self-hosted-gateways/`, `observability/`) |
| Insights, Observability, Monetization | `docs/insights/`, `docs/observability/`, `docs/monetization/` |
| Policy Hub | `docs/policy-hub/` |
| Tools | `docs/tools/` |

The first page in each section is its Overview, and some Overview pages set a
`slug` (for example `/api-control-plane`, `/api-portal`, `/api-gateway`).

## Conventions

- `onBrokenLinks` is set to `throw`, so the build fails on any broken link.
  Run `npm run build` before you commit.
- Link to other pages with relative paths to the `.md` file, and to images
  with absolute `/img/cloud/...` paths.
- Use Docusaurus admonitions (`:::note`, `:::tip`, `:::info`, `:::warning`).
