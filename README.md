[![Build Status](https://travis-ci.org/givanse/car-color-editor.svg?branch=master)](https://travis-ci.org/givanse/car-color-editor)

# car-color-editor

![tm3 screenshot](tm3-screenshot.png)

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with NPM)
* [Yarn](https://yarnpkg.com/en/)
* [Ember CLI](https://ember-cli.com/)

## Installation

* `git clone <repository-url>` this repository
* `cd car-color-editor`
* `yarn`

## Running / Development

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

### Building

* `ember build` (development)
* `ember build --environment production` (production)

## Netlify (https://carcolor.givan.se)

All sites on this Netlify account share **300 credits/month**. A production deploy costs ~15 credits. Do not ship on every PR or every `master` push.

**How to ship on purpose**

1. **Deploys → Trigger deploy** (top of the deploy list). Same-SHA retries fail open, so path ignore does not skip this.
2. **Build hook** (bypasses ignore entirely): **Project configuration → Build & deploy → Continuous deployment → Build hooks → Add build hook**, then `POST` that URL.

[Build hooks ignore the ignore command](https://docs.netlify.com/build/configure-builds/ignore-builds/).

**What path ignore does (production / `master`)**

`[build] ignore` runs `scripts/netlify-ignore.sh` from the **base directory** (repo root here; there is no `[build] base`). The script `git -C`s to the repo root (`$NETLIFY_REPO_PATH`, else `git rev-parse --show-toplevel`) and skips (exit 0) when these UI paths did **not** change between `$CACHED_COMMIT_REF` and `$COMMIT_REF`:

`src/`, `vendors/`, `config/`, `public/`, `ember-cli-build.js`, `package.json`, `yarn.lock`, `.ember-cli`, `tsconfig.json`

That is the Ember/Glimmer production graph (`ember build -e production` → `dist/`). README, this ignore script, and `netlify.toml` are **not** in the list, so landing deploy-policy files does not burn a production deploy.

Missing or equal git refs fail **open to BUILD** (exit 1) so Trigger deploy and a first/empty-cache build are never skipped. Do **not** set production `ignore = "exit 0"` — that would skip real UI builds.

Path ignore **still auto-builds production** when those UI paths change on `master`. That is a safety net, not “only when we click.”

**Deploy Previews and branch deploys**

Toml always skips them (`[context.deploy-preview]` / `[context.branch-deploy]` `ignore = "exit 0"`). `skip_prs` is already true in the Netlify API.

**Leftover UI clicks (Gastón)**

Toml cannot turn off every dashboard lever. Names from current Netlify docs:

| Goal | Where to click | Credits? |
| --- | --- | --- |
| Skip Deploy Previews (already true via API `skip_prs` + toml `exit 0`) | Optional twin: **Project configuration → Build & deploy → Continuous Deployment → Branches and deploy contexts → Configure** → disable **Deploy Previews** → **Save** (also turns the GitHub Netlify PR check off) | skipped |
| Skip docs-only / ignore-toml `master` pushes; still auto-build when UI paths change | already in `netlify.toml` | skipped builds are cheap; UI `master` still costs |
| Build production on git but **do not publish** carcolor.givan.se until you pick a deploy | **Deploys → Lock** to stop auto publishing. **Unlock** to start auto publishing | **still burns build credits** |
| Stop **all** git / hook / Trigger deploy builds | **Project configuration → Build & deploy → Continuous deployment → Build settings → Configure → Build status → Stopped builds** | no builds; **do not set this** (`stop_builds` also blocks Trigger deploy and hooks) |
| Intentional publish with builds still Active | **Deploys → Trigger deploy**, or a **Build hook** | one production build |

Leave the live **Build command** alone if it is still the historical `ember build -e production` (publish `dist/`). Do **not** fill or change **Base directory / Build command / Publish directory** just to land ignore — UI leftovers there have overridden toml on other sites. Do not Trigger deploy just to land an ignore-toml change; the next intentional UI ship picks up the committed config.

`bash scripts/netlify-ignore.test.sh` checks ignore exit codes (no live Netlify).

## Further Reading / Useful Links

* [glimmerjs](http://github.com/tildeio/glimmer/)
* [ember-cli](https://ember-cli.com/)
