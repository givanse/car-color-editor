#!/usr/bin/env bash
# Skip production Netlify builds when the Ember/Glimmer UI did not change.
#
# Netlify [build] ignore (exit 0 = skip, exit 1 = continue build).
# This command runs FROM THE BASE DIRECTORY, not necessarily the repo
# root. Diff pathspecs are resolved with git -C against the repo root
# ($NETLIFY_REPO_PATH, else `git rev-parse --show-toplevel`). A naive
# `git diff … .` from a subdirectory base would miss root UI files or
# skip a real UI build.
#
# Fail open to BUILD (exit 1) when refs are missing, equal (empty cache /
# first git-triggered build), git cannot resolve them, or the repo root
# cannot be found. Never `exit 0` unconditionally — that would skip
# real UI builds.
#
# Docs / this ignore script / netlify.toml are NOT in the watch list.
# Intentional ship is `netlify deploy --prod` or a build hook (hooks
# bypass ignore). Squash-merge with [skip netlify] unless that merge
# is the ship. stop_builds stays false.
set -u

cached="${CACHED_COMMIT_REF:-}"
commit="${COMMIT_REF:-}"

if [[ -z "$cached" || -z "$commit" ]]; then
  exit 1
fi

# Same SHA: first git-triggered build or cleared cache.
# git diff --quiet would be empty and skip; we must not skip those.
if [[ "$cached" == "$commit" ]]; then
  exit 1
fi

if [[ -n "${NETLIFY_REPO_PATH:-}" ]]; then
  repo="$NETLIFY_REPO_PATH"
else
  repo="$(git rev-parse --show-toplevel 2>/dev/null || true)"
fi

if [[ -z "$repo" || ! -d "$repo" ]]; then
  exit 1
fi

# Sanity: this site is the Ember/Glimmer app at repo root.
if [[ ! -f "$repo/ember-cli-build.js" ]]; then
  exit 1
fi

if ! git -C "$repo" cat-file -e "${cached}^{commit}" 2>/dev/null; then
  exit 1
fi
if ! git -C "$repo" cat-file -e "${commit}^{commit}" 2>/dev/null; then
  exit 1
fi

# Paths that ship https://carcolor.givan.se (`ember build -e production`).
# Do not list netlify.toml, README, or this script — those must skip so
# landing ignore is free. CLI `netlify deploy --prod` does not use this.
git -C "$repo" diff --quiet "$cached" "$commit" -- \
  src/ \
  vendors/ \
  config/ \
  public/ \
  ember-cli-build.js \
  package.json \
  yarn.lock \
  .ember-cli \
  tsconfig.json
status=$?

if [[ "$status" -eq 0 ]]; then
  exit 0
fi
exit 1
