# API Manager 4.4.0 sync plan- 09-10-2026

Source: `docs-apim/4.4.0`
Copied in from docs-apim at: `7ba083c5c` 2026-07-15T15:26:23+05:30 Merge pull request #11607 from Dimagidhp/fixing-issue-10768-4.4.0
Target: `upstream/apim-4.4.0`

Page commits after that point are cherry-picked onto `en/docs/api-manager/4.4.0/`. A change is applied only when this branch still has the parent version of that page. `en/mkdocs.yml` and `en/redirects.yml` are not modified.

## Commits

- `already` `461f73150` Add warning: [apim.webhooks.http] enable = false has no effect in 4.4.0 — this branch already has these page changes
- `already` `599b4be8d` Remove non-functional [apim.webhooks.http] enable config from 4.4.0 docs — this branch already has these page changes
- `already` `948e562fe` [4.4.0] Add authentication policy configuration to the config catalog — this branch already has these page changes
- `already` `fddd1c8d7` Add streaming limitation note for Universal Gateway AI APIs — this branch already has these page changes
- `already` `80bbacfd2` Reword: explicitly state streaming is not supported for AI APIs — this branch already has these page changes
- `already` `9b0df626d` Simplify: remove explanation, keep only 'not supported' statement — this branch already has these page changes
- `already` `4db4c8032` Fix: Add configuration placement guidance for OpenTelemetry — this branch already has these page changes
- `replay` `fb837b7fb` Remove obsolete import template references — 1 page
- `already` `10f3abfae` Fix: Add cache mediator syntax documentation for response caching — this branch already has these page changes
- `already` `d88f9f29c` upgrading org.wso2.apim.monetization.impl version — this branch already has these page changes

1 commits to cherry-pick, 9 already on this branch, 0 left because the page has moved on, 0 skipped.

## Cherry-pick conflicts

There were no git conflict markers. A commit was skipped when the page on `apim-4.4.0` was no longer the exact text docs-apim had edited. Every skipped page had the same two rewrites, added on 16 July in `7f5d34d8f` ("Adding frontmatter"): a frontmatter block (`title`, `description`, `canonical_url`, `md_url`, `tags`, `author`, `last_updated`, `content_type`), and `{{base_path}}/.../` links rewritten to relative `.md` links. `fb837b7fb` is partial: the screenshot matched and was cherry-picked; the markdown did not.

| Page | docs-apim commits | What the patch wanted | What already differed here |
|---|---|---|---|
| `configuring-transport-level-security.md` | `461f73150`, `599b4be8d` | Remove the WebHook transport section | Frontmatter, plus `{{base_path}}` links rewritten to relative `.md` links |
| `config-catalog.md` | `948e562fe` | Add the `[authentication_policy]` section | Frontmatter only. The catalog body still matched, but the extra header is enough to reject the patch |
| `create-an-ai-api.md` | `fddd1c8d7`, `80bbacfd2`, `9b0df626d` | Add the one-sentence streaming limitation | Frontmatter and image links rewritten from `{{base_path}}` to relative paths |
| `rate-limiting-for-ai-apis.md` | `fddd1c8d7`, `80bbacfd2`, `9b0df626d` | Add a streaming note, then delete it again. The final docs-apim text matches the old paragraph | Frontmatter and image links. No page change was needed after the note was removed |
| `monitoring-with-opentelemetry.md` | `4db4c8032` | Add the `apim.` placement warning | Frontmatter and the config-catalog link rewritten to a relative `.md` link |
| `response-caching.md` | `10f3abfae` | Add the cache mediator syntax | Frontmatter and the "Create an API" link rewritten to a relative `.md` link |
| `monetizing-an-api.md` | `d88f9f29c` | Bump the Stripe plugin jar from 1.4.x to 1.5.1 | Frontmatter and the monetization screenshots rewritten to relative paths |
| `cicd-using-cli.md` | `fb837b7fb` | Drop the import-template bullet and reword the following sentence | Frontmatter and about 30 `{{base_path}}` links rewritten |

## What you change by hand

After the cherry-picks, edit these two files on the working branch. The script does not touch them.

### Nav entries to add in en/mkdocs.yml

None.

### Nav entries docs-apim removed

None.

### Redirects to add in en/redirects.yml

None.

### docs-apim commits that touched nav or redirects

None.

## Pages only on this branch

docs-apim does not have these files. They stay. Do not delete them as part of the cherry-pick.

- `en/docs/api-manager/4.4.0/administer/managing-users-and-roles/configuring-the-system-administrator.md`
- `en/docs/api-manager/4.4.0/assets/img/integrate/tutorials/service-catalog/metadata-folder-service-catalog.png`
- `en/docs/api-manager/4.4.0/assets/img/integrate/tutorials/service-catalog/open-service-catalog.png`
- `en/docs/api-manager/4.4.0/assets/img/learn/api-security/recaptcha/recaptcha-sso.png`
- `en/docs/api-manager/4.4.0/assets/img/learn/okta-add-new-attribute-add.png`
- `en/docs/api-manager/4.4.0/assets/img/learn/okta-add-new-attribute-details.png`
- `en/docs/api-manager/4.4.0/assets/img/learn/okta-add-new-attribute.png`
- `en/docs/api-manager/4.4.0/assets/img/learn/okta-apim-add-role-permissions1.png`
- `en/docs/api-manager/4.4.0/assets/img/learn/okta-apim-add-role-permissions2.png`
- `en/docs/api-manager/4.4.0/assets/img/learn/okta-apim-add-role-permissions3.png`
- `en/docs/api-manager/4.4.0/assets/img/learn/okta-profile-edit.png`
- `en/docs/api-manager/4.4.0/assets/img/learn/okta-profile-edit2.png`
- `en/docs/api-manager/4.4.0/assets/img/learn/okta-profile-edit3.png`
- `en/docs/api-manager/4.4.0/includes/streaming/enable-publishing.md`

## Pages that will still differ from docs-apim

These stay as they are on the deployment branch. Most of them differ because this branch edited pages after the copy (frontmatter, links, base URL), not because a later docs-apim commit was skipped. The commits marked diverged above are the docs-apim edits that could not be cherry-picked onto a page this branch has since changed.
