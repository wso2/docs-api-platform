# Achieving the Same Strategy with Docusaurus

This maps the same three topics from `DOCS-STRATEGY-EXPLAINER.md` onto
Docusaurus. **This is a feasibility assessment, not a built and tested
system** — unlike the mkdocs version, none of this has been implemented or
deployed. Anything below marked "needs prototyping" is my read of Docusaurus's
documented capabilities, not something verified working.

Short answer up front: yes, the same shape is achievable. The pieces map
fairly cleanly — a few need custom work instead of a native feature, but
nothing here looks blocked.

---

## 1. Common artifacts

Same three things need a shared home: the shared JS, the shared lookup file,
and the shared build-time logic.

**The shared JS (`theme.js` equivalent).** Docusaurus has a `scripts` config
in `docusaurus.config.js` that adds plain `<script src="...">` tags — and it
accepts a full external URL, not just a local file. This is the same
mechanism as mkdocs' `extra_javascript`, and it means the "host once on
`docs-shared`, reference by URL" pattern carries over exactly as-is. **Fairly
confident** — this is documented, standard Docusaurus behavior.

One thing to flag: Docusaurus's `clientModules` config looks similar but is
NOT the same — those get bundled into the webpack build at compile time and
can't point at an external URL. `scripts`, not `clientModules`, is the one
that matters here.

**The shared lookup file (`root-index.json` equivalent).** No change needed —
it's just a static JSON file, fetched with `fetch()` the same way regardless
of what generated the site around it.

**The shared build-time logic (`docs_shared_hooks` equivalent).** mkdocs'
Python hooks become a **Docusaurus plugin** — a Node module implementing
lifecycle hooks like `postBuild`. Packaging and pinning it works the same way
too: npm supports installing directly from a git tag, same as pip did —
```json
"docs-shared-plugin": "github:wso2/docs-api-platform#shared-v1"
```
**Needs prototyping** — the mechanism (npm + git dependency) is standard, but
the actual plugin code (walking Docusaurus's route/sidebar data structures
instead of mkdocs' nav tree) hasn't been written.

### Maintaining in Git branches / Deployments

No change from the current strategy — one `docs-shared` branch, deployed
once, same as today. This part has nothing to do with mkdocs vs. Docusaurus.

---

## 2. Product versions

### Maintaining in Git branches / Deployments

No change either — branch-per-product+version, one Dockerfile per branch,
one deployment per branch. This is a git/deployment decision, independent of
the site generator.

### Trimming a branch down to one version

This is where Docusaurus is actually **stronger** than mkdocs, not just
equivalent. mkdocs needed a hand-written regex script
(`trim-mkdocs-version.py`) to cut its nav down to one version. Docusaurus has
a **native** config option for exactly this — `onlyIncludeVersions` in the
docs plugin config:
```js
docs: {
  onlyIncludeVersions: ['4.7.0'],
}
```
**Fairly confident** — this is a documented, first-class Docusaurus feature,
built for exactly this kind of single-version build.

### How the common artifacts are fetched

No change — once `scripts` loads the shared JS from `docs-shared`'s real URL,
everything downstream (fetching `root-index.json`, fetching each other
product's manifest, rendering the sidebar section) is the same `fetch()` +
DOM-manipulation logic as today. It doesn't care whether the page around it
was rendered by mkdocs or Docusaurus.

---

## 3. Switching between product versions

This is the one part that needs real custom work, not just a config change —
and it's worth being upfront about why.

Docusaurus ships its **own** built-in version dropdown, but it's built on a
different assumption than ours: it expects every version to be bundled into
the *same* site. Ours is the opposite — one deployment holds exactly one
version. So the native dropdown, out of the box, has no concept of "this
version isn't in this build, send the reader somewhere else."

That means the same custom logic we already built for mkdocs — "does this
build have that version? if yes, navigate to the equivalent page; if no, fall
back to the live site" — has to be rebuilt for Docusaurus too. The likely
approach is **swizzling** the version dropdown component (Docusaurus's
supported way of replacing a piece of its own UI with custom code) rather
than modifying the plain DOM the way `theme.js` does today. **Needs
prototyping** — this is the part of the migration with the most real,
unverified work in it.

Everything else about switching — cross-product sections, clicking into
another product's page, the fallback to the live site — is the same `scripts`
+ `fetch()` + real-navigation mechanism as §2, so it should transfer without
needing to be rebuilt from scratch.

---

## Bottom line

| Piece | Docusaurus equivalent | Confidence |
|---|---|---|
| Branch-per-product+version, one deployment each | No change — git/deployment strategy | N/A, unaffected |
| Host shared JS once, reference by URL | `scripts` config (not `clientModules`) | Fairly confident |
| Shared lookup file + fetch mechanism | No change | Fairly confident |
| Shared build-time hook logic | Docusaurus plugin, pinned via npm+git | Needs prototyping |
| Trim a branch to one version | `onlyIncludeVersions` (native, better than mkdocs) | Fairly confident |
| Cross-product sidebar rendering | Same `fetch()`/DOM logic, generator-agnostic | Fairly confident |
| Same-product version dropdown w/ fallback | Must rebuild via swizzling — no native equivalent | Needs prototyping |

Nothing here looks like a blocker. The realistic next step, if this is worth
derisking before the actual migration, is a small real prototype covering
just the two "needs prototyping" rows — a Docusaurus plugin generating a nav
manifest, and a swizzled version dropdown with the same redirect-to-live-site
fallback — the same way the mkdocs version was proven with a real PoC before
being trusted.
