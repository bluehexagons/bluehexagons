# Site development

Use Node.js 24.22.2 or newer in the 24.x line, or 26.13.0 or newer in the
26.x line. [Node.js downloads](https://nodejs.org/en/download/) provides both
supported LTS lines; `.nvmrc` pins the 24.x release used by CI.

```bash
nvm install && nvm use      # if you use nvm
npm ci
npm run dev                 # development server at http://localhost:3000
npm run build               # production output in dist/
npm run preview             # inspect the production build locally
```

`npm run build` creates the static site in `dist/` for hosting at `/`.
The build type-checks the frontend and generates thumbnails from `public/assets/`.
Thumbnails, `node_modules/`, and `dist/` are generated and are not committed.
For the GitHub Pages project URL, build with
`VITE_BASE_PATH=/bluehexagons/ npm run build`. The Pages workflow runs that
build and publishes `dist/` to
[bluehexagons.github.io/bluehexagons](https://bluehexagons.github.io/bluehexagons/).
To preview that build locally, use
`VITE_BASE_PATH=/bluehexagons/ npm run preview` so the preview uses the same path.
The shop and account UI is excluded from the default static build because it
requires the separate API service.

Use `npm run dev:shop` for local shop development or `npm run build:shop` to
include it in a production build. See the [API setup guide](../server/README.md)
for the Go service, local cookies, payments, and deployment. `VITE_API_BASE`
can override the API origin; it defaults to `http://localhost:8080` on local
hosts and the site's own origin in production. Values beginning with `VITE_`
are public build settings; keep secrets in the API's environment.

Before pushing, run `npm run build`, `npm run build:shop`, and, from `server/`,
`go mod verify`, `go vet ./...`, and `go test -race ./...`. The repository
checks workflow runs these checks and builds the static Go binary on pushes
to `main` and pull requests. The separate Pages workflow builds the static
portfolio for the project URL on pushes to `main`.

The homepage includes a short HTML summary that remains readable without
JavaScript. Keep it aligned with the interactive homepage and the concise
[`profile.md`](../public/profile.md) when career details change. The static
[`basaltwater.html`](../src/basaltwater.html) case study provides a direct URL for
the project; [`llms.txt`](../public/llms.txt) links these public sources for
automated readers. Canonical URLs and the sitemap point to bluehexagons.com,
which is the primary copy of the site.

Check repository links while signed out of GitHub before adding them to public
pages or documentation. Link to a public project page or storefront when the
source repository is private.

## Basaltwater integration

See [the integration guide](basaltwater.md) for manifest CI commands,
portfolio deployment, the opt-in unfinished shop, and cleanup/backup procedures.
Native development uses the commands above; Basaltwater is optional for local
builds and tests. Linux deployment uses Bash and the Go build script; native
Windows runtime testing has not been established.

## Image galleries

Use `<image-scroller aria-label="Project screenshots">` with image children.
Each image's `title` supplies its caption; use `alt` for a distinct visual
description when useful. Generated `/assets/thumbs/` images appear in the preview
strip, while the selected image and enlarged viewer use the original asset.
`data-link-override` preserves video destinations. YouTube watch, short, embed,
and `youtu.be` links offer an embedded player when selected; choose Play video
(or click the preview) to load it, and Back to preview to return to the image.
The enlarged viewer also offers playback for YouTube items. Players use YouTube's
privacy-enhanced embed host and load only after activation. Switching items,
returning to the preview, closing the viewer, or removing the gallery stops playback.
An external watch link remains available, including for other video hosts.

Browse with the arrows, thumbnails, or horizontal drags and swipes on the selected
image. Horizontal gestures follow the pointer before switching; vertical touch
scrolling and pinch zoom remain native. Hovering adds a subtle cursor-centered
zoom, and images fade in when loaded. Reduced-motion preferences disable these
animations.
Left/Right and Home/End work while a gallery has keyboard focus. The enlarged
viewer keeps focus inside it; Escape, Close, or a backdrop click dismisses it and
returns focus to the gallery without losing the page position. There is no
automatic advance, and thumbnail scrolling respects reduced-motion preferences.
