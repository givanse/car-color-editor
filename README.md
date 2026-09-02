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

This Netlify account shares **300 credits/month**. Production deploys cost ~15 credits each. Policy: **explicit deploys only**. `skip_prs` is already true. `stop_builds` stays **false**.

### Intentional production ship

Ship only when you mean to:

1. `netlify deploy --prod` (CLI; `ember build -e production` → `dist/`)
2. **Build hook** — `POST` the hook URL. Build hooks **bypass** the ignore command, so they always run a build.

Do not trigger deploys from the Netlify dashboard.

### Skip git-triggered builds

- **Deploy Previews:** `skip_prs` is already true. `netlify.toml` also sets `[context.deploy-preview] ignore = "exit 0"`.
- **Production git pushes:** path-based `[build] ignore` (`scripts/netlify-ignore.sh`) skips unless `src/`, `vendors/`, `config/`, `public/`, `ember-cli-build.js`, `package.json`, `yarn.lock`, `.ember-cli`, or `tsconfig.json` changed. Ignore runs from base (unset here → repo root); the script `git -C`s to `$NETLIFY_REPO_PATH` (else `git rev-parse --show-toplevel`) so a leftover Base directory cannot skip a real UI build. README/`netlify.toml`-only commits do not deploy. If the check is unsure, the build proceeds (fail open). Do not use `ignore = "exit 0"` on production — that would skip real UI changes.
- **Squash-merge:** put `[skip netlify]` in the squash commit message unless that merge **is** the intentional ship.

`stop_builds` remains false so `netlify deploy --prod` and build hooks still work.

`bash scripts/netlify-ignore.test.sh` checks ignore exit codes (no live Netlify).

## Further Reading / Useful Links

* [glimmerjs](http://github.com/tildeio/glimmer/)
* [ember-cli](https://ember-cli.com/)
