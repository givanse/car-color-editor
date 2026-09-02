#!/usr/bin/env bash
# Lightweight tests of scripts/netlify-ignore.sh. No live Netlify.
# Exit 0 from the ignore script = skip build; exit 1 = continue build.
set -euo pipefail

here="$(cd "$(dirname "$0")" && pwd)"
repo_root="$(cd "$here/.." && pwd)"
script="$here/netlify-ignore.sh"
toml="$repo_root/netlify.toml"
fail=0

assert_eq() {
  local got="$1" want="$2" msg="$3"
  if [[ "$got" != "$want" ]]; then
    echo "FAIL: $msg (got $got, want $want)" >&2
    fail=1
  else
    echo "ok: $msg"
  fi
}

git_in() {
  local cwd="$1"
  shift
  # Ignore the cloud-agent core.hooksPath; fixture repos must be inert.
  git -C "$cwd" -c core.hooksPath=/dev/null "$@"
}

sha() {
  git_in "$1" rev-parse HEAD
}

commit_file() {
  local cwd="$1" rel="$2" contents="$3" message="$4"
  mkdir -p "$(dirname "$cwd/$rel")"
  printf '%s' "$contents" >"$cwd/$rel"
  git_in "$cwd" add "$rel"
  git_in "$cwd" commit -m "$message" >/dev/null
  sha "$cwd"
}

run_ignore() {
  local cwd="$1" cached="${2-}" commit="${3-}" repo_path="${4-UNSET}"
  local env_args=()
  if [[ -n "$cached" ]]; then
    env_args+=(CACHED_COMMIT_REF="$cached")
  fi
  if [[ -n "$commit" ]]; then
    env_args+=(COMMIT_REF="$commit")
  fi
  if [[ "$repo_path" == "UNSET" ]]; then
    :
  elif [[ "$repo_path" == "EMPTY" ]]; then
    env_args+=(NETLIFY_REPO_PATH="")
  else
    env_args+=(NETLIFY_REPO_PATH="$repo_path")
  fi
  # Simulate ignore running from cwd (base). Drop NETLIFY_REPO_PATH from
  # the parent environment so UNSET means unset.
  (
    cd "$cwd"
    env -u NETLIFY_REPO_PATH -u CACHED_COMMIT_REF -u COMMIT_REF \
      "${env_args[@]}" bash "$script"
  )
}

echo "== toml: DP always skips; production is path-based, not exit 0 =="
grep -q 'ignore = "bash ./scripts/netlify-ignore.sh"' "$toml" \
  || { echo "FAIL: production ignore must be ./scripts/netlify-ignore.sh" >&2; fail=1; }
echo "ok: production ignore is ./scripts/netlify-ignore.sh"
grep -q 'command = "ember build -e production"' "$toml" \
  || { echo "FAIL: production command must be ember build -e production" >&2; fail=1; }
echo "ok: command is ember build -e production"
grep -q 'publish = "dist"' "$toml" \
  || { echo "FAIL: publish must be dist" >&2; fail=1; }
echo "ok: publish is dist"
grep -A1 '\[context.deploy-preview\]' "$toml" | grep -q 'ignore = "exit 0"' \
  || { echo "FAIL: [context.deploy-preview] ignore = \"exit 0\"" >&2; fail=1; }
echo "ok: [context.deploy-preview] ignore = \"exit 0\""
grep -A1 '\[context.branch-deploy\]' "$toml" | grep -q 'ignore = "exit 0"' \
  || { echo "FAIL: [context.branch-deploy] ignore = \"exit 0\"" >&2; fail=1; }
echo "ok: [context.branch-deploy] ignore = \"exit 0\""
if awk '
  $0 ~ /^\[build\]/ { in_build=1; next }
  $0 ~ /^\[/ { in_build=0 }
  in_build && $0 ~ /ignore[[:space:]]*=[[:space:]]*"exit 0"/ { found=1 }
  END { exit found ? 0 : 1 }
' "$toml"; then
  echo "FAIL: [build] must not always-skip with ignore = \"exit 0\"" >&2
  fail=1
else
  echo "ok: [build] is not ignore = \"exit 0\""
fi
if grep -E '^[[:space:]]*stop_builds[[:space:]]*=' "$toml" >/dev/null; then
  echo "FAIL: do not set stop_builds" >&2
  fail=1
else
  echo "ok: stop_builds not set as a config key"
fi

fixture() {
  local root
  root="$(mktemp -d "${TMPDIR:-/tmp}/carcolor-nignore.XXXXXX")"
  git_in "$root" init -b master >/dev/null
  git_in "$root" config user.email "test@example.com"
  git_in "$root" config user.name "test"
  git_in "$root" config commit.gpgsign false
  mkdir -p "$root/src/ui" "$root/vendors" "$root/config" "$root/public" "$root/scripts"
  printf 'module.exports = function() {};\n' >"$root/ember-cli-build.js"
  printf '{}\n' >"$root/package.json"
  printf '# lock\n' >"$root/yarn.lock"
  printf '{ "blueprint": "@glimmer/blueprint" }\n' >"$root/.ember-cli"
  printf '{}\n' >"$root/tsconfig.json"
  printf 'export const app = 1;\n' >"$root/src/index.ts"
  printf 'mesh\n' >"$root/vendors/car.stl"
  printf 'module.exports = {};\n' >"$root/config/environment.js"
  printf 'User-agent: *\n' >"$root/public/robots.txt"
  printf 'docs\n' >"$root/README.md"
  printf 'lint\n' >"$root/tslint.json"
  mkdir -p "$root/tests"
  printf 'qunit\n' >"$root/tests/index.html"
  printf '[build]\n  ignore = "bash ./scripts/netlify-ignore.sh"\n' >"$root/netlify.toml"
  git_in "$root" add .
  git_in "$root" commit -m "seed" >/dev/null
  echo "$root"
}

root="$(fixture)"
cached="$(sha "$root")"

echo "== missing refs fail open to BUILD =="
set +e
run_ignore "$root"
assert_eq "$?" 1 "both refs unset"
run_ignore "$root" "$cached" ""
assert_eq "$?" 1 "COMMIT_REF unset"
run_ignore "$root" "" "$cached"
assert_eq "$?" 1 "CACHED_COMMIT_REF unset"
set -e

echo "== equal refs fail open (empty cache / same SHA) =="
set +e
run_ignore "$root" "$cached" "$cached" "$root"
assert_eq "$?" 1 "equal SHAs"
set -e

echo "== README / netlify.toml / lint / tests skip (landing ignore is free) =="
set +e
docs="$(commit_file "$root" "README.md" "docs v2\n" "readme")"
run_ignore "$root" "$cached" "$docs" "$root"
assert_eq "$?" 0 "README-only skip"

toml_only="$(commit_file "$root" "netlify.toml" "# comment\n[build]\n" "toml")"
run_ignore "$root" "$docs" "$toml_only" "$root"
assert_eq "$?" 0 "netlify.toml-only skip"

script_only="$(commit_file "$root" "scripts/netlify-ignore.sh" "#!/bin/bash\nexit 1\n" "ignore script")"
run_ignore "$root" "$toml_only" "$script_only" "$root"
assert_eq "$?" 0 "ignore-script-only skip"

lint="$(commit_file "$root" "tslint.json" "lint2\n" "lint")"
run_ignore "$root" "$script_only" "$lint" "$root"
assert_eq "$?" 0 "tslint-only skip"

qunit_only="$(commit_file "$root" "tests/index.html" "qunit2\n" "qunit html")"
run_ignore "$root" "$lint" "$qunit_only" "$root"
assert_eq "$?" 0 "qunit-html-only skip"
set -e

echo "== real UI paths continue BUILD =="
set +e
ui="$(commit_file "$root" "src/index.ts" "export const app = 2;\n" "ui")"
run_ignore "$root" "$qunit_only" "$ui" "$root"
assert_eq "$?" 1 "src/ builds"

vendors="$(commit_file "$root" "vendors/car.stl" "mesh2\n" "vendors")"
run_ignore "$root" "$ui" "$vendors" "$root"
assert_eq "$?" 1 "vendors/ builds"

buildfile="$(commit_file "$root" "ember-cli-build.js" "module.exports = function() { return 1; };\n" "broccoli")"
run_ignore "$root" "$vendors" "$buildfile" "$root"
assert_eq "$?" 1 "ember-cli-build.js builds"

pkg="$(commit_file "$root" "package.json" "{ \"name\": \"x\" }\n" "pkg")"
run_ignore "$root" "$buildfile" "$pkg" "$root"
assert_eq "$?" 1 "package.json builds"

cfg="$(commit_file "$root" "config/environment.js" "module.exports = { env: 1 };\n" "config")"
run_ignore "$root" "$pkg" "$cfg" "$root"
assert_eq "$?" 1 "config/ builds"

pub="$(commit_file "$root" "public/robots.txt" "User-agent: *\nDisallow: /\n" "public")"
run_ignore "$root" "$cfg" "$pub" "$root"
assert_eq "$?" 1 "public/ builds"
set -e

echo "== honor base: ignore cwd is a subdirectory; NETLIFY_REPO_PATH is repo root =="
mkdir -p "$root/web"
set +e
run_ignore "$root/web" "$qunit_only" "$ui" "$root"
assert_eq "$?" 1 "src/ still builds when cwd is base=web"

run_ignore "$root/web" "$cached" "$docs" "$root"
assert_eq "$?" 0 "README still skips when cwd is base=web"
set -e

echo "== NETLIFY_REPO_PATH unset: git toplevel from repo root =="
set +e
run_ignore "$root" "$qunit_only" "$ui" "UNSET"
assert_eq "$?" 1 "src/ builds with toplevel fallback from root"
set -e

echo "== NETLIFY_REPO_PATH unset: git toplevel from subdirectory base =="
set +e
run_ignore "$root/web" "$qunit_only" "$ui" "UNSET"
assert_eq "$?" 1 "src/ builds with toplevel fallback from base=web"

# Sanity: naive git diff . from web/ misses src/ and would skip a real UI build.
naive_status=0
git -C "$root/web" -c core.hooksPath=/dev/null diff --quiet "$qunit_only" "$ui" -- . || naive_status=$?
assert_eq "$naive_status" 0 "sanity: git diff . from web/ misses src/ (would skip)"
set -e

echo "== unknown git refs fail open =="
set +e
run_ignore "$root" "$cached" "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" "$root"
assert_eq "$?" 1 "unknown COMMIT_REF"
set -e

if [[ "$fail" -ne 0 ]]; then
  echo "netlify-ignore tests failed" >&2
  exit 1
fi
echo "netlify-ignore tests ok"
