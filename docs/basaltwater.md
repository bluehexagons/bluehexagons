# Basaltwater integration

## Development and CI

Use the native commands in the [development guide](development.md) and
[API guide](../server/README.md). Basaltwater is optional. To use its pinned Node
runtime, run `basaltw node doctor --json`, install a missing pin with
`basaltw node install`, then run `basaltw node exec -- npm run build`.

Keep the [manifest’s](../basaltwater.json) `ci.install`, `ci.build`, and `ci.test`
stages aligned with [GitHub Actions](../.github/workflows/checks.yml). Explicit
stages avoid fallback to deployment hooks. Each frontend build must pass
`check:site` before the next replaces `dist/`; the shop check uses `VITE_SHOP=1`.
CI leaves shop output in `dist/`; deployment builds a fresh artifact separately.

Race tests require CGO and a C compiler. The release binary disables CGO; its
build script requires Bash and `file`.

```bash
basaltw manifest validate --json
```

See [project tooling](https://github.com/bluehexagons/basaltwater/blob/main/docs/agents/project-tooling.md)
for CI execution and runtime selection. GitHub Actions uses native commands.

## Site deployment

The committed manifest runs `npm ci && npm run build` and serves `dist/` at `/`,
using `.nvmrc` for Node selection. GitHub Pages builds separately for
`/bluehexagons/`; do not use that base for the root domain.

On a configured controller, validate deployment inputs with a dry run:

```bash
basaltw setup server_web web.example.com deploy \
  --deploy site.example.com https://github.com/bluehexagons/bluehexagons.git \
  --dry-run
```

Substitute the saved target and HTTPS/access settings. A dry run does not build
or test the project. Selected-builder delivery with `--build-on SAVED-BUILDER`
is supported after enrollment. See the shared
[deployment guide](https://github.com/bluehexagons/basaltwater/blob/main/docs/services/deployments.md)
for provisioning, grants, and activation.

## Optional shop deployment

The shop is unfinished and disabled by default. To resume development, replace
the manifest’s `components` with the pair below, retaining its `ci` stages.
Commit the change on the deployment branch and validate the manifest.

```json
{
  "version": 1,
  "components": [
    {
      "name": "site",
      "type": "static",
      "domain": "{{domain}}",
      "build": "npm ci && npm run build:shop",
      "output": "dist"
    },
    {
      "name": "shop-api",
      "type": "service",
      "domain": "{{domain}}",
      "path": "/api",
      "build": "server/deploy/build.sh",
      "binary": "server/bx-server",
      "port": "auto",
      "env_file": "{{shared_dir}}/.env",
      "runtime_env": {
        "LISTEN_ADDR": "127.0.0.1:{{port}}",
        "DB_PATH": "{{data_dir}}/bluehexagons.db",
        "SHOP_UPLOAD_DIR": "{{data_dir}}/shop_uploads"
      },
      "health": "/api/health",
      "sqlite_backup": "{{data_dir}}/bluehexagons.db",
      "backup_retention": 14
    }
  ]
}
```

Use **build-on-target**, with Node and Go available; their versions are inferred
from `package.json` and `server/go.mod`. The build defaults to Linux/amd64.
Basaltwater creates the service account, hardened unit, loopback port, and Nginx
`/api` route, preserving the prefix. Keep the component name and deployment
destination stable so persistent data remains attached.

Selected-builder delivery rejects `env_file`. If a target already uses a
builder, apply this configuration with `--no-build-on`. Keep payment secrets out
of committed `runtime_env` values and builder grants.

Before activation, prepare `{{shared_dir}}/.env` using the
[environment example](../server/deploy/.env.example). Its resolved directory is
`/var/www/.basaltwater_shared/<app>/shop-api`; obtain `<app>` and the service
account from the deployment configuration. The account must be able to read,
but not write, the file or its parent. For example, use root ownership,
service-group access, and file mode `0640`.

Provision the file through private operator configuration. Set HTTPS `BASE_URL`
and `FRONTEND_ORIGIN`, admin settings, and staging payment keys. The manifest
supplies `LISTEN_ADDR`, `DB_PATH`, and `SHOP_UPLOAD_DIR`.

Verify `/api/health`, shop pages, and staging payments before enabling checkout.
Build checks alone do not establish checkout readiness.

## Shop backup and restore

Deployment creates a consistent SQLite backup before replacing a release and
retains 14 backups. Uploads, private configuration, and changes since the last
deployment need separate operational backups.

Capture a recoverable snapshot:

1. Enter maintenance, block writes, and stop the API. Keep it stopped until both
   the database and uploads are captured.
2. Use SQLite’s `.backup` on `{{data_dir}}/bluehexagons.db`, saving to a private
   backup directory. Do not copy only the live `.db` file while WAL writes are possible.
3. Copy `{{data_dir}}/shop_uploads/`, preserving names and permissions. Record
   the release commit, time, and checksums. Back up private configuration separately.
4. Run `PRAGMA integrity_check`, verify checksums, restart the API, and check
   `/api/health` before ending maintenance. Keep an encrypted off-host copy with
   an explicit retention policy.

For a restore drill, use isolated staging with outbound payment and webhook
traffic disabled. Stop the service and preserve its current data. Restore the
matching database and uploads under its own `{{data_dir}}`; remove stale `-wal`
and `-shm` sidecars only while stopped and after preserving the old set. Restore
ownership, private permissions, and staging configuration, then start the
matching release. Verify integrity, health, and an uploaded file. Do not replay
live payments.

Production recovery uses the same stopped-service procedure under maintenance.
Release rollback does not restore database state or uploads. Checkout and
restore drills still require staging validation.

## Artifacts and cleanup

The [cleanup adapter](../.basaltwater/cleanup.json) identifies `dist/` and
`public/assets/thumbs/` as reproducible output. Other files in `public/assets/`
are source media. Recreate dependencies with `npm ci` and the API binary with
`server/deploy/build.sh`.

Inspect cleanup metadata and preview the output rule:

```bash
basaltw agent storage project /absolute/path/to/checkout --json
basaltw agent storage clean-generated /absolute/path/to/checkout --rule site-output
```

Stop builds and preview servers first. Removal with `--apply` requires explicit
authorization; the policy grants no standing deletion permission. For native
cleanup, inspect the same directories and remove only authorized generated output.

Keep raw logs and captures outside Git or in ignored `artifacts/review/`.
Archive only sanitized evidence with an index and provenance under
`artifacts/archive/YYYY-MM-DD--milestone/`. Preserve curated archives, source
media, databases, uploads, and private configuration. See the shared
[cleanup guide](https://github.com/bluehexagons/basaltwater/blob/main/docs/agents/project-cleanup.md).
