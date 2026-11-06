# Basaltwater integration

## Development and CI

The [README](../README.md#building-this-site) owns native setup and check
commands; [server/README](../server/README.md) covers the Go API. On Basaltwater,
use `basaltw node doctor --json` to check the project pin and
`basaltw node exec -- npm run build` to run with that runtime. Install a missing
pin explicitly with `basaltw node install`. Native Node/npm and Go remain enough
for local development. The deployment build script requires Bash and `file`.

The root [manifest](../basaltwater.json) declares literal `ci.install`,
`ci.build`, and `ci.test` commands matching the gates in
[GitHub Actions](../.github/workflows/checks.yml). Keep both definitions aligned.
Explicit CI stages avoid falling back to component deployment hooks. CI checks
both frontend modes and the API; its final `dist/` contains the shop and is not
the portfolio deployment artifact. Deployment builds the selected components
separately. Race tests need a native Go toolchain with CGO and a C compiler;
the release binary itself is built with CGO disabled.

Validate configuration locally with:

```bash
basaltw manifest validate --json
```

See [Basaltwater project tooling](https://github.com/bluehexagons/basaltwater/blob/main/docs/agents/project-tooling.md)
for CI execution and runtime selection. Basaltwater is not required in ordinary
GitHub Actions jobs, which continue to run native commands.

## Portfolio deployment

The committed manifest builds only the static portfolio with `npm ci` and
`npm run build`, serving `dist/` at `/`. It uses `.nvmrc` for Node selection.
The existing GitHub Pages workflow separately builds for `/bluehexagons/`.
Keep the project URL setting out of the root-domain deployment.

On an already configured Basaltwater controller, a sanitized target-build
preflight looks like:

```bash
basaltw setup server_web web.example.com deploy \
  --deploy site.example.com https://github.com/bluehexagons/bluehexagons.git \
  --dry-run
```

Use the operator's actual saved target and access/HTTPS settings. A dry run
validates deployment inputs without running build commands; run project checks
separately. The portfolio is also eligible for selected-builder delivery with
`--build-on SAVED-BUILDER` after enrollment. Follow the shared
[deployment guide](https://github.com/bluehexagons/basaltwater/blob/main/docs/services/deployments.md)
for provisioning, builder grants, and activation.

## Optional shop deployment

The shop is unfinished. This configuration preserves a deployment route for
resuming development; it does not establish checkout or production readiness.
Keep the portfolio-only manifest until the shop is intentionally enabled.

Replace the root manifest's `components` with the complete pair below, retaining
its `ci` stages. This enables both the shop frontend and the same-origin API.
Commit the reviewed change on the branch to deploy, then validate the manifest.

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

Use ordinary **build-on-target** deployment for this configuration. It needs
Node and Go on the build target; Basaltwater infers these from `package.json`
and `server/go.mod`. The build script defaults to Linux/amd64. Basaltwater
generates the service user, hardened unit, stable loopback port, and Nginx
`/api` route, preserving the API prefix. Keep the `shop-api` component name and
deployment destination stable so persistent data stays attached to the service.

The selected-builder flow currently rejects `env_file`; do not use `--build-on`
for this shop manifest. If the saved target already uses a builder, switch with
`--no-build-on` when applying the shop configuration. Do not move payment secrets
into committed `runtime_env` values or builder grants to bypass this limit.

Before activation, use [the sanitized environment example](../server/deploy/.env.example)
to prepare the private target file at `{{shared_dir}}/.env`. Basaltwater resolves
the component shared directory as
`/var/www/.basaltwater_shared/<app>/shop-api`; determine `<app>` and the generated
service account from the deployment configuration. The file must be readable
but not writable by that account, with a non-writable parent (for example,
root-owned, service-group-readable mode `0640`). Provision this through the
operator's private configuration workflow. Set the actual HTTPS `BASE_URL` and
`FRONTEND_ORIGIN`, admin configuration, and staging payment keys there. The
manifest supplies `LISTEN_ADDR`, `DB_PATH`, and `SHOP_UPLOAD_DIR`.

Confirm `/api/health`, the shop pages, and staging payment behavior before
considering checkout enabled. Only build checks are part of this integration;
end-to-end shop qualification remains future development work.

## Shop backup and restore

Basaltwater takes a consistent SQLite backup before release replacement and
retains 14 deployment backups. This does not back up uploads, private environment
configuration, or changes since the last deployment. Schedule operational backups
separately when the shop resumes service; keep backup destinations and credentials
in private operator state.

For a recoverable snapshot:

1. Put the shop into maintenance and stop the generated API unit. Block incoming
   writes and keep the service stopped through both database and upload capture.
2. Use SQLite's `.backup` command on `{{data_dir}}/bluehexagons.db` to create a
   consistent standalone database in a private backup directory. Do not copy only
   the live `.db` file while WAL writes are possible.
3. Copy `{{data_dir}}/shop_uploads/` into the same backup set, preserving names and
   permissions. Record the release commit, capture time, and checksums. Securely
   back up the private environment configuration separately.
4. Check the backup database with `PRAGMA integrity_check`, verify file checksums,
   and restart the API. Check `/api/health` before ending maintenance. Keep an
   encrypted copy outside the deployment host with an explicit retention policy.

For a restore drill, use an isolated staging service with outbound payment and
webhook traffic disabled. Stop it, preserve its current data, and restore the
matching database and upload set under its own `{{data_dir}}`. Remove stale
`-wal` and `-shm` sidecars from the replaced database only while the service is
stopped and after preserving the old set. Restore service ownership and private
permissions, supply staging configuration, and start the matching release.
Check database integrity, health, and a representative uploaded file. Do not
replay live payments. Production recovery follows the same stopped-service
procedure under maintenance; release rollback alone does not restore database
state or uploaded assets. No restore drill has been performed by this change.

## Artifacts and cleanup

[The cleanup adapter](../.basaltwater/cleanup.json) preserves the existing layout:
`dist/` and `public/assets/thumbs/` are reproducible site output. Source assets
elsewhere in `public/assets/` remain source. Dependencies can be recreated with
`npm ci`; the optional binary with `server/deploy/build.sh`.

Inspect metadata and preview the generated-output rule with:

```bash
basaltw agent storage project /absolute/path/to/checkout --json
basaltw agent storage clean-generated /absolute/path/to/checkout --rule site-output
```

Stop builds and preview servers before cleanup. Removal requires an explicitly
authorized run with `--apply`; the policy grants no standing deletion permission.
Without Basaltwater, inspect the same exact directories, confirm no retained
evidence or tracked files are present, and remove only authorized generated output
using native filesystem tools.

Keep raw logs and captures outside Git, or in ignored `artifacts/review/`.
Selected, sanitized evidence may be curated into
`artifacts/archive/YYYY-MM-DD--milestone/` with an index and provenance; preserve
archives. Databases, uploads, secrets, source media, and review evidence are not
generated-output cleanup targets. See the shared
[cleanup guide](https://github.com/bluehexagons/basaltwater/blob/main/docs/agents/project-cleanup.md).
