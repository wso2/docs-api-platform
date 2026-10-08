# Commit Migration Runbook: upstream/main + docs-apim → per-product/version branches

## Background

Until **2026-07-13**, this repo (`wso2/docs-api-platform`) kept every product's docs on one
branch (`main`), and WSO2 API Manager's docs lived in a **separate repo**,
`wso2/docs-apim`, with one branch per APIM version (e.g. `4.7.0`).

Since then, this repo has been restructured into one branch per product+version
(`ai-workspace-1.0.0`, `apim-4.7.0`, `cloud`, etc. — see the mapping table below). All of
these branches share a **single common fork point**:

```
b2227a5531132f75c9683e023bf2fb5a0d32292c   (upstream/main, 2026-07-13, "Merge pull request #340 from Krishanx92/self-hosted")
```

Verify this yourself before starting, in case more branches get cut later:

```bash
git merge-base origin/<any-product-branch> upstream/main
```

Since that commit, people have kept committing docs changes to `upstream/main` (352 commits as
of 2026-10-08) and to `docs-apim`'s version branches. None of that has reached the new
per-product/version branches. **This runbook is the process for catching them up, one commit
at a time, with judgment — not a script to blindly run.**

There are two separate source repos to pull from:

- **Track A**: `upstream/main` (this repo) → every product *except* API Manager.
- **Track B**: `wso2/docs-apim`'s per-version branches → this repo's `apim-*` branches.

(API Manager never had real version content on `main` — `en/docs/api-manager/overview.md`
there is just a stub pointing at the old `apim.docs.wso2.com` site. All of APIM's real
content history lives in `docs-apim`, hence Track B.)

## Branch mapping

| Product / version | New branch | Source | Source path |
|---|---|---|---|
| API Manager 3.0.0–4.7.0 | `apim-3.0.0` … `apim-4.7.0` | `docs-apim` branch of the same name | `en/docs/` (docs-apim root) |
| AI Gateway 1.0.0/1.1.0/1.2.0/next | `ai-gateway-1.0.0` etc. | `upstream/main` | `en/docs/ai-gateway/<version>/` |
| AI Workspace 1.0.0/next | `ai-workspace-1.0.0` etc. | `upstream/main` | `en/docs/ai-workspace/<version>/` |
| API Gateway 1.0.0/1.1.0/1.2.0/next | `api-gateway-1.0.0` etc. | `upstream/main` | `en/docs/api-gateway/<version>/` |
| API Portal 1.0.0/next | `api-portal-1.0.0` etc. | `upstream/main` | `en/docs/api-portal/<version>/` |
| Cloud (unversioned) | `cloud` | `upstream/main` | `en/docs/cloud/` ⚠️ **path differs** — see below |
| Analytics / Monetization / Policy Hub / Guides / Tools (unversioned) | `platform-common` | `upstream/main` | `en/docs/analytics/`, `en/docs/monetization/`, `en/docs/policy-hub/`, `en/docs/guides/`, `en/docs/tools/` |

**Before you start on a product, confirm a branch for that exact version still exists and is
current** — `git ls-remote origin` / `git ls-remote upstream`. New versions keep appearing on
`main` that don't have a branch yet at all (example found while writing this: AI Gateway grew
a `2026.09.24` version folder on `main` after the cut, with no `ai-gateway-2026.09.24` branch
anywhere). If you hit one of these, that's a bigger decision (cut a new branch first) — raise
it, don't silently skip the commits.

## The two cases: path-preserving vs path-remapped

This is the single most important thing to get right before touching any commit.

**Path-preserving** (AI Gateway, AI Workspace, API Gateway, API Portal, platform-common): the
new branch's folder structure under `en/docs/` is byte-for-byte identical to `main`'s. A commit
that only touches `en/docs/ai-gateway/1.1.0/foo.md` on `main` can be cherry-picked directly —
the path means the same thing on both branches.

**Path-remapped** (API Manager, Cloud): the content moved to a different relative path when
the branch was cut.

- API Manager: `docs-apim`'s `en/docs/foo.md` → this repo's `en/docs/api-manager/<version>/foo.md`.
- Cloud: `main`'s `en/docs/cloud/foo.md` → this repo's `cloud` branch's `en/docs/foo.md`
  (the `cloud/` prefix was deliberately flattened away — see this repo's commit
  `3f28ed92f` for why).

A plain `git cherry-pick` will not apply cleanly here (the paths don't match), and even if it
did by coincidence, it would reintroduce the wrong structure. Use the patch-rewrite method
below instead.

## Step 0: one-time setup

```bash
git remote add docs-apim https://github.com/wso2/docs-apim.git   # Track B only
git fetch upstream main
git fetch docs-apim                                               # Track B only
```

## Track A: path-preserving products (AI Gateway, AI Workspace, API Gateway, API Portal, platform-common)

For each product+version branch:

```bash
# 1. Find candidate commits since the cut, touching only this version's own folder.
git log --oneline b2227a5531132f75c9683e023bf2fb5a0d32292c..upstream/main \
  -- en/docs/ai-gateway/1.1.0/        # adjust path per branch

# 2. For each commit, check what else it touched before picking it -
#    a commit can touch more than one version/product at once.
git show --stat <sha>

# 3a. If it ONLY touches this branch's own en/docs/<product>/<version>/ path
#     (plus maybe redirects.yml - see caveat below), cherry-pick it as-is:
git checkout ai-gateway-1.1.0
git cherry-pick -x <sha>

# 3b. If it ALSO touches files outside this branch's own content path
#     (mkdocs.yml, hooks.py, theme/, nav config, another product's folder),
#     do NOT cherry-pick the whole commit. Instead `git show <sha> -- en/docs/ai-gateway/1.1.0/`
#     and apply just that part by hand, understanding what the change actually does -
#     the shared/config files have diverged structurally between `main` and this
#     branch (see PRODUCT-BRANCH-ARCHITECTURE.md / PRODUCT-DEPLOYMENTS-AND-REDIRECTS.md
#     in this same new branch for why), so the old file doesn't necessarily have an
#     equivalent in the new structure. Use judgment, don't force it.
```

Repeat per version folder, per branch. `platform-common` is the same process but covers five
source paths (`analytics/`, `monetization/`, `policy-hub/`, `guides/`, `tools/`) landing on
one branch.

**Caveat — `redirects.yml`**: `main` keeps redirects in `mkdocs.yml`'s own
`redirect_maps`; the new branches keep them in a separate `en/redirects.yml` loaded via a
hook (see this repo's commit `5df992849`). A commit that only adds/changes redirect entries
for this product needs its *content* ported into `en/redirects.yml` by hand, not cherry-picked
verbatim.

## Track B: API Manager, from `docs-apim`

`docs-apim`'s branches root content at `en/docs/`; this repo's `apim-<version>` branches root
the same content at `en/docs/api-manager/<version>/`. Every patch needs that prefix inserted.

```bash
# Per APIM version, e.g. 4.7.0:
git log --oneline <known-good-base>..docs-apim/4.7.0 -- en/docs/

# For each commit you want to port:
git format-patch -1 <sha> --stdout -- en/docs/ > /tmp/patch.diff

# Rewrite the patch's paths to add the api-manager/<version>/ prefix:
sed -i '' \
  -e 's#^diff --git a/en/docs/#diff --git a/en/docs/api-manager/4.7.0/#' \
  -e 's#^diff --git a/en/docs/api-manager/4.7.0/\(.*\) b/en/docs/#diff --git a/en/docs/api-manager/4.7.0/\1 b/en/docs/api-manager/4.7.0/#' \
  -e 's#^--- a/en/docs/#--- a/en/docs/api-manager/4.7.0/#' \
  -e 's#^+++ b/en/docs/#+++ b/en/docs/api-manager/4.7.0/#' \
  /tmp/patch.diff

git checkout apim-4.7.0
git am /tmp/patch.diff
```

(The double `s///` on the `diff --git` line exists because that line has *both* the `a/` and
`b/` path on it — test on one commit first and check `git show --stat` on the result matches
what you expect before doing this at scale. If `git am` fails to apply cleanly, `git am
--abort`, inspect, and consider applying by hand instead — these are real content files,
getting the merge right matters more than automating it.)

**There is no "known-good-base" commit shared between `docs-apim` and this repo** (they were
always separate histories) — you'll need to establish, per APIM version, the last commit that
was actually incorporated when that `apim-<version>` branch's initial content was assembled.
If that's not already known/documented somewhere, the practical starting point is: diff
`docs-apim/<version>`'s current `en/docs/` tree against `apim-<version>`'s
`en/docs/api-manager/<version>/` tree, and treat any `docs-apim` commit touching a file that's
still identical as "already incorporated" — anything touching a file that now differs is a
candidate to review.

## General caveats (both tracks)

- **A commit might not map 1:1 to one branch.** Treat "touches this version's own folder" as
  the filter, not "mentions this product in the message."
- **Don't batch-apply by date range alone.** Check each commit's actual diff before deciding
  it's safe to port — a commit can look product-scoped from its message but touch shared
  config too.
- **Order matters within a branch.** Cherry-pick/apply in chronological order so later commits
  (e.g. a correction to an earlier change) still make sense on top.
- **If a cherry-pick conflicts**, that's usually a sign the destination file has already
  diverged from `main`/`docs-apim` for a reason specific to this restructuring (see this
  branch's `PRODUCT-BRANCH-ARCHITECTURE.md` and `DOCS-STRATEGY-EXPLAINER.md`) — resolve with
  that context in mind, don't just take "theirs" or "ours" blindly.
- **New versions with no branch yet** (like `ai-gateway/2026.09.24` found above): cutting a
  new branch is a bigger step (new Dockerfile, router entry, root-index.json entry, etc. — see
  `PRODUCT-DEPLOYMENTS-AND-REDIRECTS.md`) and should be raised, not folded silently into this
  commit-porting work.
