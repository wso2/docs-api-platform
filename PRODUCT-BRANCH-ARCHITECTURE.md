\# Product Docs: Branch Architecture & Loading Model

This describes the real, built and deployed architecture for splitting WSO2 API
Platform's documentation into independently deployable **product+version**
units, while still presenting one unified, cross-linked site to readers. It has
been validated end-to-end on real Choreo deployments (not just local testing).

Two products exist today: **API Manager** (4.6.0, 4.7.0, ...) and **AI Gateway**
(1.0.0, 1.1.0, next).

---

## 1. How things are organized

**One branch per product+version, plus one `docs-shared` branch.** Each
version — `apim-4.6.0`, `apim-4.7.0`, `ai-gateway-1.0.0`, `ai-gateway-1.1.0`,
`ai-gateway-next` — is its own branch, its own Dockerfile, its own independent
deployment. Working on a single version means cloning only that one branch,
not the full history of every other version too.

```
apim-4.6.0   apim-4.7.0   ai-gateway-1.0.0   ai-gateway-1.1.0   ai-gateway-next     docs-shared
│            │            │                  │                  │                   │
en/docs/api-manager/<version>/       en/docs/ai-gateway/<version>/                  assets/theme.js
Dockerfile.<version>                 Dockerfile.<version>                           assets/root-index.json
en/hooks.py:  "from docs_shared_hooks import *"   ── identical shim, every branch   docs_shared_hooks/__init__.py
en/requirements.txt:  docs-shared-hooks @ git+https://github.com/.../docs-api-platform.git@shared-v1
en/mkdocs.yml:  extra_javascript: - https://<docs-shared-url>/theme.js             pyproject.toml
                                                                                     Dockerfile (nginx only)
                                                                                     nginx.conf (+ CORS header)
```

Each branch's `en/mkdocs.yml` still lists **every** version in its nav (it's
the same file the product used to share across all its versions) — only the
docs folder itself was trimmed down to one version per branch. So
`trim-mkdocs-version.py` still runs at build time, exactly as before, to strip
the nav down to the one version this branch actually has files for:

```dockerfile
COPY en/ .
COPY trim-mkdocs-version.py .
RUN python3 trim-mkdocs-version.py mkdocs.yml 4.7.0
RUN mkdocs build
```

### What each thing does

| Path | Purpose |
|---|---|
| `en/docs/<product>/<version>/` | Every markdown page, image, and attachment for this one branch's one version. |
| `Dockerfile.<version>` | Builds this branch's single-version image. Runs `trim-mkdocs-version.py`, then `mkdocs build`. |
| `en/hooks.py` | Two lines: `from docs_shared_hooks import *`. The real logic lives on `docs-shared`, installed as a pinned package — this file barely changes anymore. |
| `en/requirements.txt` | Pins `docs-shared-hooks` to a git tag on `docs-shared` (e.g. `@shared-v1`) — the real build hook logic, installed at build time. |
| `en/mkdocs.yml` | Site config + full nav (every version). `extra_javascript`'s last entry points at `docs-shared`'s real deployed URL. |
| `docs-shared/docs_shared_hooks/__init__.py` | The real mkdocs build hooks: builds `product-nav-manifest.json`, loads `redirects.yml`, breadcrumbs, cache-busting. One copy, installed by every version branch. |
| `docs-shared/assets/theme.js` | Version dropdown, cross-product sidebar rendering, search breadcrumbs. Hosted once, loaded by every version branch via `<script src>`. |
| `docs-shared/assets/root-index.json` | Hand-written: every product's slug, title, default version, and its manifest's real deployed URL. |
| `docs-shared/Dockerfile` + `nginx.conf` | Serves the two `assets/` files as plain static files, with CORS enabled (see §2). No mkdocs/Python build stage. |

Each branch deploys as its own Choreo component with its own URL, e.g.
`https://apipd-apim-470.choreoapps.dev`. There is no reverse proxy unifying
them yet — see §3 for how that's being handled in the meantime, and what
changes once real routing exists.

---

## 2. How things load

### Build time: where the manifest comes from

`product-nav-manifest.json` isn't a file in the repo — `docs_shared_hooks`
generates it every time `mkdocs build` runs, same mechanism as before the
branch-per-version split: it walks mkdocs' in-memory nav tree in `on_nav`,
converts this build's one product+version section into a `{title, url,
children}` tree, and writes it to `<site_dir>/<slug>/product-nav-manifest.json`
in `on_post_build`. Because this branch's nav was trimmed to one version
before the build ran, `versions` in the resulting manifest only ever has that
one key — `allVersions` still lists the full configured set, independent of
what this one build physically contains.

`root-index.json` isn't generated at all — it's a real file on `docs-shared`,
hand-maintained, served as-is.

**`root-index.json` (real, current content):**
```json
{
  "api-manager": {
    "slug": "api-manager",
    "title": "API Manager",
    "manifestUrl": "https://apipd-apim-470.choreoapps.dev/api-manager/product-nav-manifest.json",
    "defaultVersion": "4.7.0"
  },
  "ai-gateway": {
    "slug": "ai-gateway",
    "title": "AI Gateway",
    "manifestUrl": "https://apipd-aigw-110.choreoapps.dev/ai-gateway/product-nav-manifest.json",
    "defaultVersion": "1.1.0"
  }
}
```
`manifestUrl` is a full, absolute URL — it has to point at one specific
deployment, since each version is now its own separate origin. It always
points at the product's **default** version's own deployment, because that's
the only build whose `manifest.versions` will actually contain the version
`manifest.default` names (see §"cross-product link resolution" below for why
that pairing matters).

### Where the manifest lives, and how it's fetched

Every deployment is its own origin now — there's no shared domain to resolve
relative paths against. So:
- `theme.js` itself is loaded via `<script src="https://apipd-shared.choreoapps.dev/theme.js">` — an absolute URL baked into every version branch's `mkdocs.yml`.
- Inside `theme.js`, `root-index.json` is fetched from that same absolute, hardcoded base (`SHARED_BASE`).
- Each product's `product-nav-manifest.json` is fetched from whatever absolute URL `root-index.json` names for it.

Because these are genuinely cross-origin `fetch()` calls now (not same-origin
requests behind a shared proxy, as they were in local testing), both
`docs-shared`'s nginx and every version deployment's nginx send
`Access-Control-Allow-Origin: *` on their static assets.

### Runtime: what happens, step by step

1. **Page loads.** The current product+version's own nav tree is already in
   the HTML — no fetch needed. `theme.js` fetches `root-index.json`, then
   fetches `product-nav-manifest.json` for every *other* product. All of them,
   every page load.
2. **Reader clicks a heading.** In their own product's section: a normal link,
   normal navigation. In another product's section (built from a manifest):
   forced into a full navigation, since that page lives on an entirely
   different deployment.
3. **Reader switches a version, for any product.** The browser navigates to a
   new URL — same as clicking any link, described in §3.
4. **Reader clicks a heading on that new page.** Same as step 2, now on the
   new page — a fresh page load, so the fetches in step 1 happen again.

### Cross-product link resolution (a real bug, since fixed)

Every node in a fetched manifest carries a *root-relative* URL (e.g.
`ai-gateway/1.1.0/overview/`) — relative to the product that built it, not to
whichever page is currently rendering it. The first version of this code
resolved those URLs against the current page's own origin, which happened to
work locally (everything shared one proxy domain) but sent readers to a 404
on the *current* deployment once each product+version became a genuinely
separate origin.

The fix: derive the correct base from the manifest's own `manifestUrl` (its
origin), not from the current page's `scope`:
```js
var productOrigin = new URL(product.manifestUrl, scope).origin + '/';
// ...later, resolve every node's url and the version-switch target against
// productOrigin, not scope.
```

---

## 3. Version switching, today vs. eventually

There's no unified routing layer yet, so switching versions — same product or
cross-product — currently falls back to a fixed constant when the target
version isn't part of the current build:
```js
var LIVE_SITE_BASE = 'https://wso2.com/api-platform/docs/';
// ...
window.location.href = LIVE_SITE_BASE + slug + '/' + version + '/';
```
For versions that **are** deployed here but not built into the *current*
container (e.g. switching API Manager 4.7.0 → 4.6.0), that fallback URL is
being manually intercepted with a browser extension (Requestly) during
testing, redirecting each `.../  <product>/<version>/` production URL to that
version's real Choreo deployment. This is a manual, per-tester workaround —
not a production mechanism.

**The real fix, when this goes to production:** front everything with one
domain (the plan is something like `sitegoesas.wso2.com`) that path-routes
`/<product>/<version>/...` to the matching deployment, the same way
`LIVE_SITE_BASE` already assumes. Once that exists, `LIVE_SITE_BASE` stops
being a special case — it just becomes the real, permanent home for every
version, deployed or not.

---

## 4. Real deployment topology & rollout order

Six Choreo deployments exist: `docs-shared`, `apim-4.6.0`, `apim-4.7.0`,
`ai-gateway-1.0.0`, `ai-gateway-1.1.0` (deployed), `ai-gateway-next` (not yet
deployed). They have a strict dependency order:

1. **`docs-shared` first.** It depends on nothing else.
2. **The five product+version deployments, any order/parallel.** Each only
   needs `docs-shared`'s URL, for `mkdocs.yml`'s `extra_javascript` entry.
3. **`docs-shared` redeployed once more.** Only now can `root-index.json`
   point at real URLs — specifically, the *default* version's deployment for
   each product (`apim-4.7.0`, `ai-gateway-1.1.0`).

This same order applies to shipping a brand-new version later (see §5).

---

## 5. Release pipeline & update cadence

Two distinct flows, on two very different cadences:

**Routine content edit** (fix a typo, add a page, clarify a section) — push
to that one version's branch, redeploy that one branch. No ripple anywhere
else. This is the common case, and it's fully independent per branch: editing
`apim-4.7.0` never touches `apim-4.6.0` or `docs-shared`.

**Shipping a new version** (e.g. `apim-4.8.0`) — create the new branch,
deploy it, and *if* it becomes the new default, update `docs-shared`'s
`root-index.json` to point at it and redeploy `docs-shared` — the same
dependency order as §4's initial rollout, just for one new branch instead of
five.

So `docs-shared` itself updates on two different triggers, both infrequent:
- **Mechanism changes** — bug fixes or features in `theme.js` /
  `docs_shared_hooks` (like the cross-product URL fix in §2). Irregular, only
  when the platform itself needs to change.
- **A product's default version changing** — roughly once per major release,
  per product.

Product+version branches update as often as that version's content changes —
frequent for the current/active version of each product, essentially quiet
for versions that have been superseded.

**One operational requirement this whole pipeline depends on:** every
deployment's URL has to stay stable across rebuilds — otherwise a routine
`docs-shared` mechanism fix would force updating and redeploying every
product+version branch just to point at a new hostname (this happened once,
by accident, when Choreo build-duration limits on a personal/trial account
forced fresh components with new hostnames instead of rebuilding the existing
ones). A real org account with a fixed or custom domain per component avoids
this — worth confirming that's in place, especially for `docs-shared`, before
relying on this pipeline in production.

---

## Known limitations

- **Eager fetching.** Every page fetches every other product's manifest on
  load. Fine at 2 products, wasteful at 10 — production should lazy-fetch a
  manifest only when its section is expanded.
- **`root-index.json` is hand-maintained.** Adding a real product, or
  changing a product's default version, means editing this one file by hand.
  Everything else that used to require manual syncing (`hooks.py`,
  `theme.js`, `trim-mkdocs-version.py`) is solved by `docs-shared` — this is
  the one piece of shared state left.
