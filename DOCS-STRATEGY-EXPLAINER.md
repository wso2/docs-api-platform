# New Docs Strategy: How It Works

The [API Platform docspace](https://wso2.com/api-platform/docs/) hosts several products: API Gateway, AI Gateway,
API Portal, AI Workspace, each shown in the left navbar with its own version
dropdown. API Manager is listed too, but as of now, clicking it just sends readers
to [APIM's own separate docspace](https://apim.docs.wso2.com/en/latest/), instead of showing its versions the same
way the other products do.

We're bringing API Manager in properly as a product with its own version
dropdown, same as the rest. 

Since this will be deployed in Choreo, we ran into the following problems:
- Currently, all the product versions reside in the same branch, and are deployed and hosted via a Choreo component.
- API Manager docs (all the versions altogether) are large in size, and a Choreo component cannot be deployed with such a size. Therefore, bringing in all the APIM versions and maintaining them under [4] will not be possible.
- So far, all the versions of other products/components are not large in size, and that's why we can host them all together. But going forward, it won't be scalable as we do more releases, and API Manager's problem will apply to these.


Therefore, we are planning to take an approach of having one branch per product version, each deployed as its own Choreo component, plus one small shared component every version depends on. 

This document explains how this approach works.

---

## Branch layout

```
apim-4.6.0, apim-4.7.0, ai-gateway-1.0.0, ai-gateway-1.1.0, ai-gateway-next
  (one branch per product+version, all shaped the same way)
├─ en/docs/<product>/<version>/    every page, image, attachment for this one version
├─ Dockerfile.<version>            builds this branch into one deployable image
├─ en/hooks.py                     two lines - pulls in docs-shared's real build logic
├─ en/requirements.txt             pins which docs-shared version to install
└─ en/mkdocs.yml                   site config + nav; points at docs-shared's real URL

docs-shared
  (one branch, holds everything the product+version branches share)
├─ assets/theme.js                 the shared JS - hosted here, loaded by every branch
├─ assets/root-index.json          the shared lookup file (see §1 below)
├─ docs_shared_hooks/__init__.py   builds each version's nav data, loads redirects, search
│                                  breadcrumbs, cache-busting (see §1 below) - one copy, used
│                                  by every branch
├─ pyproject.toml                  package metadata for docs_shared_hooks
└─ Dockerfile + nginx.conf         just serves the two assets/ files as static files
```

---

## 1. Common artifacts

Three files/things are shared across every product and version:

- `theme.js`: the JavaScript that renders version dropdowns and the
  cross-product sidebar sections.
- `root-index.json`: a small lookup file: for each product, its title,
  default version, and where to fetch its nav data from.
- The build hook logic (`docs_shared_hooks`): a "hook" is just mkdocs' own
  term for code it calls automatically at specific points during
  `mkdocs build`. This one builds each version's nav data (so other products
  can fetch and render it), loads redirect rules, generates search
  breadcrumbs, and handles cache-busting for assets.

### Maintaining in Git branches

All three live in **one branch: `docs-shared`**.

Whenever `docs_shared_hooks/__init__.py` changes, cut a new tag (e.g.
`shared-v2`). Product branches pin to a specific tag, so a change here only reaches a branch once its
`requirements.txt` is updated to point at the new tag. `theme.js` and
`root-index.json` don't need this — see "How the shared files are used"
below for why.

### Deployments

`docs-shared` is deployed **once**, as its own service, with its own URL.
Example: `https://apipd-shared.choreoapps.dev`.

- `theme.js` and `root-index.json` are served as plain static files from that
  URL.
- The build hook logic is packaged as an installable Python package and tagged (e.g. `shared-v1`). It's installed during each product version's build, pinned to that tag.

### How the shared files are used

`theme.js` and `root-index.json` are used the same way - **fetched over
HTTP**, at runtime, by the reader's browser:

- Every product+version page includes a `<script src="https://apipd-shared.choreoapps.dev/theme.js">`
  tag. The browser downloads and runs it directly from `docs-shared`, on every page load. It isn't bundled into the product's own build.
- Once running, `theme.js` does a plain `fetch()` for `root-index.json` from that same URL. It uses what comes back — each product's title, default version, and where to find its nav data — to know which other product sections to build in the sidebar, and where to fetch their actual content from.

The build hook logic is **installed at build time**. Each product branch's `requirements.txt` has a line like:
```
docs-shared-hooks @ git+https://github.com/.../docs-api-platform.git@shared-v1
```
`pip` supports installing a package straight from a git tag. When a product+version branch is built, this line pulls that exact tagged version from the `docs-shared` branch and installs it, same as installing any other Python package.

---

## 2. Product versions

Example products/versions: API Manager 4.6.0, 4.7.0; AI Gateway 1.0.0, 1.1.0.

### Maintaining in Git branches

**One branch per product+version.** eg: `apim-4.6.0`, `apim-4.7.0`, `ai-gateway-1.0.0`, `ai-gateway-1.1.0` each holding only that one version's docs.

### Deployments

Each branch is deployed as its own separate service, with its own URL.
Examples:
- `apim-4.7.0` → `https://apipd-apim-470.choreoapps.dev`
- `ai-gateway-1.1.0` → `https://apipd-aigw-110.choreoapps.dev`


### How the common artifacts are fetched

Every product version's build points at `docs-shared`'s real URL:

- The page loads `theme.js` directly from `https://apipd-shared.choreoapps.dev/theme.js`.
- Once loaded, `theme.js` fetches `root-index.json` from that same URL.
- `root-index.json` tells it where each *other* product's nav data lives
  (e.g. AI Gateway's is at `https://apipd-aigw-110.choreoapps.dev/ai-gateway/product-nav-manifest.json`)
  — `theme.js` fetches that too, and uses it to render that product's section
  in the sidebar, even though none of that content actually lives on this
  page's own deployment.

This happens on every page load, for every product other than the one currently being viewed.

---

## 3. How the navbar is built, with other products' sections

The sidebar is built two different ways, depending on whose section it is.

### Half 1 — the page's own section: rendered server-side

At `mkdocs build` time, `nav-item.html` (the theme's own nav-rendering
template) walks that branch's `mkdocs.yml` nav tree directly, reading:
- `extra.versioned_sections` / `extra.unversioned_sections` — which
  top-level sections belong to *this* product, and whether each is versioned.
- `extra.expanded_navs` — per-section styling: a divider line above it,
  a vertical connecting line down its children, or both.
- `extra.nav_icons` — per-section icon.

This produces real HTML, baked into the page at build time. It's why the
current page's own section is already there the instant the page loads —
before any JavaScript has run, and without any fetch at all.

### Half 2 — every other product's section: fetched client-side

Everything else in the sidebar is added afterward, in the browser, by
`theme.js`, using three fetches:

1. **`root-index.json`** — fetched from `docs-shared`'s URL. Lists every
   product: its title, its default version, and where its nav data lives.
2. **`assets/own-product-slugs.json`** — fetched from the *current page's
   own* deployment. The list of slugs this branch already rendered in Half 1,
   so `theme.js` knows not to re-fetch-and-render its own product as if it
   were some other product (an early source of duplicated sections — see
   `docs_shared_hooks`'s `on_post_build`).
3. **Each other product's `product-nav-manifest.json`** — fetched from
   wherever `root-index.json` says it lives (that product's default-version
   deployment).

Concretely, on an API Manager 4.7.0 page:

- `theme.js` fetches `assets/own-product-slugs.json` from its own deployment
  (returns `["api-manager"]`) and, in parallel,
  `https://8c140a8d-...choreoapps.dev/root-index.json` from `docs-shared`.
- `root-index.json` says AI Gateway's nav data lives at
  `https://5d231cdd-...choreoapps.dev/ai-gateway/product-nav-manifest.json`
  — `theme.js` fetches that too (skipping `api-manager` itself, since that's
  already in the own-slugs list).
- That fetched file is a full page tree — titles, URLs, nested sections,
  plus icon/divider/vertical-line styling (see Tier 2 below). `theme.js`
  turns that into real sidebar HTML — a collapsible section, its own version
  dropdown, styled the same way a native section would be — even though none
  of that actual content lives on this page's own deployment.

This happens fresh on **every single page load**, for every product other
than the one currently being viewed — nothing about it is cached or built in
ahead of time.

### The three tiers for Product Info

**Tier 1 — `root-index.json`: which products exist, and where.**
 - Handwritten. Lives on the `docs-shared` branch (`assets/root-index.json`).
 - Served from `docs-shared`'s one deployment, e.g.
   `https://8c140a8d-7209-401b-84ab-2aebe8deaa80.e1-us-east-azure.choreoapps.dev/root-index.json`.
   One entry per product — versioned products carry a `defaultVersion`,
   unversioned ones (Cloud, Analytics, Monetization, Policy Hub, Guides,
   Tools) don't.
 - Fetched by `theme.js`, on every single product+version page — it's the
   first fetch `theme.js` always makes, regardless of which product the
   page belongs to.
 - Also carries `_liveSiteBase`: the URL a version dropdown falls back to
   when the version picked isn't actually deployed (e.g. an older API
   Manager version this build doesn't bundle) — currently
   `https://wso2.com/api-platform/docs-rearranged/`.
```json
{
  "products": {
    "api-manager": {
      "slug": "api-manager",
      "title": "API Manager",
      "manifestUrl": "https://0f2f65aa-...choreoapps.dev/api-manager/product-nav-manifest.json",
      "defaultVersion": "4.7.0"
    },
    "analytics": {
      "slug": "analytics",
      "title": "Analytics",
      "manifestUrl": "https://50dcbee2-...choreoapps.dev/analytics/product-nav-manifest.json"
    }
  },
  "_liveSiteBase": "https://wso2.com/api-platform/docs-rearranged/"
}
```

**Tier 2 — `product-nav-manifest.json`: that one product's own section.**
- During a product version's build, this is generated by
  `docs_shared_hooks._build_product_nav_manifest()` (installed via the
  pinned package — see §1), and written into that product+version branch's
  own built site, under its own slug (e.g. `ai-gateway/product-nav-
  manifest.json` — nested under the slug rather than a shared `assets/` path,
  so the reverse proxy's existing `/<slug>/*` routing reaches it).
- Fetched by `theme.js`, once per *other* product listed in `root-index.json`
  — not for the current page's own product (already server-rendered in Half
  1), and not on every page for every product like Tier 1 is.
- Two shapes, depending on whether the product is versioned:
  - **Versioned** (`versions` key) — one entry per version this build
    bundles, plus `allVersions` (the full configured list, which may include
    versions this build *doesn't* bundle — picking one of those falls back
    to `_liveSiteBase`, same as the native dropdown).
  - **Unversioned** (`tree` key instead) — a single flat tree, no version
    dropdown rendered for it.
- Both shapes also carry `icon` (raw SVG, from `_section_icon()` reading
  `extra.nav_icons`) and `divider`/`verticleLine`/`expandedSection`
  (booleans, from `_section_style()` reading `extra.expanded_navs`) — these
  mirror `nav-item.html`'s own logic so a cross-product section picks up the
  same icon and styling a native section with that title would get.

Versioned shape, from an AI Gateway build:
```json
{
  "slug": "ai-gateway",
  "default": "1.2.0",
  "allVersions": ["1.2.0", "1.1.0", "1.0.0"],
  "versions": {
    "1.2.0": [
      { "title": "Overview", "url": "ai-gateway/1.2.0/overview/" },
      { "title": "LLM Proxy", "children": [ "..." ] }
    ]
  },
  "icon": "<svg>...</svg>",
  "divider": true,
  "verticleLine": false,
  "expandedSection": false
}
```

Unversioned shape, from `platform-common`'s Analytics build:
```json
{
  "slug": "analytics",
  "tree": [
    { "title": "Overview", "url": "analytics/overview/" },
    { "title": "Dashboards", "children": [ "..." ] }
  ],
  "icon": "<svg>...</svg>",
  "divider": false,
  "verticleLine": true,
  "expandedSection": true
}
```

**Tier 3 — inside `versions` or `tree`: the actual page tree.**
- Not a separate file — it's just data sitting inside tier 2's JSON, so it
  lives in the exact same place: that product+version's own deployment. Each
  entry is either a real page (`{title, url}`) or a nested section (`{title,
  children}`) — exactly the headings you'd see rendered in the sidebar. This
  is what `theme.js`'s `renderNode()` walks to actually build the HTML.
  Every `url` in it is resolved (via `productOriginFor()`) against that
  product's own base — the same `manifestUrl`, with the trailing
  `<slug>/product-nav-manifest.json` stripped off — so a link lands on the
  right deployment (and, once a real `docs-rearranged` reverse proxy exists,
  keeps the reader on that unified domain instead of jumping to the raw
  Choreo address underneath it).

So loading one page really involves: own-product-slugs (skip list) +
root-index (in parallel) → each other product's manifest → the page tree
inside it.

---

## 4. Switching between product versions

Switching happens to a different deployment (redirect) in every case below.

1. **Same product, different version selected in the dropdown.** On an API
   Manager 4.7.0 page, click the version dropdown → `4.6.0`.
   → Goes to `apim-4.6.0`'s own deployment, loading the equivalent page
   there.

2. **Clicking into another product's section.** On an API Manager page, the
   sidebar shows an "AI Gateway" section (fetched as described in §3). Click
   "Overview" under it.
   → Goes to AI Gateway's own deployment (`apipd-aigw-110...`), loading its
   actual Overview page.

3. **Switching versions inside another product's section.** The AI Gateway
   section rendered inside an API Manager page has its own version dropdown
   too. Click `1.1.0` → `1.0.0`.
   → Goes to `ai-gateway-1.0.0`'s own deployment, loading that version's
   Overview page — always the overview, since there's no "equivalent page"
   to find on a deployment that has no AI Gateway content at all.

---

## Known limitations

- **Search only covers whichever deployment you're actually on.** Each
  deployment builds its own search index from only its own pages. So
  searching for "the common stuff" — Monetization, Analytics, Cloud, Policy
  Hub, Guides, Tools — only returns results while browsing
  `platform-common`'s own deployment. Searching from, say, an API Manager
  page won't find them, even though their sections are visible in that
  page's sidebar.
