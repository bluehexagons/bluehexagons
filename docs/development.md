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
The shop and account UI is excluded from the default static build and returns
404 in ordinary development because it requires the separate API service.

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

After each frontend build, run `npm run check:site` to check its generated HTML,
navigation, sitemap, and shop inclusion. Match the build's settings when checking:

```bash
npm run build && npm run check:site
npm run build:shop && VITE_SHOP=1 npm run check:site
VITE_BASE_PATH=/bluehexagons/ npm run build
VITE_BASE_PATH=/bluehexagons/ npm run check:site
```

## Adding pages

The site is a Vite multipage build. Public HTML files under `src/` must match
the page registry; startup fails for missing, duplicate, or unregistered pages.
`src/shop/` is excluded unless `VITE_SHOP=1`.
Existing `.html` URLs and homepage fragments remain supported. Curated archives
under `public/etc/` are copied unchanged.

1. Add an HTML entry such as `src/project.html` and register its path, title,
   description, label, layout (`portfolio` or `article`), and sitemap eligibility
   in [`src/site.ts`](../src/site.ts).
   The homepage's registry path is the empty string. Other paths can be HTML
   files (`projects/example.html`) or directory URLs (`projects/example/`,
   backed by `src/projects/example/index.html`). Paths are relative to the site
   base; keep the existing public URLs stable.
2. Put `<!-- site:head -->` after the charset declaration. The build supplies
   the title, description, viewport, canonical URL, icons, and social metadata.
   Page-specific structured data and other head elements stay in the HTML entry.
3. For an article or case study, copy [`privacy.html`](../src/privacy.html) or
   [`basaltwater.html`](../src/basaltwater.html). Keep the `site:layout-start` and
   `site:layout-end` comments around the article and the `/case-study.css` link.
   These markers supply a shared static header, skip link, main landmark, and
   footer in both development and production; no page script is required.
   For a portfolio page, use `layout: 'portfolio'`, link `/portfolio.css`, and
   add `/portfolio.ts` only if it has galleries or expandable sections. The
   portfolio layout preserves the wider page shell and project credits.
4. Add a primary navigation entry in `src/site.ts` only when useful. Navigation
   is shared by static layouts and the interactive `page-header` component.
   Use `sitePath()` for browser-generated internal links and `%BASE_URL%` for
   anchor links in source HTML. Use root-relative source URLs for image `src`
   and head asset `href` attributes; Vite applies the hosting base to them.
   Canonical URLs always use the primary domain.
5. Build and run `check:site` at `/` and `/bluehexagons/`. Add behavior checks
   when a new page introduces interactions or another layout.

[`build/site-html.ts`](../build/site-html.ts) expands these explicit markers
before Vite processes HTML and emits `sitemap.xml` from the registry. Do not
maintain another sitemap in `public/`. Shop entries keep their independent
metadata and are absent from public navigation and the sitemap.

[`build/entries.ts`](../build/entries.ts) validates the registry and discovers
the build inputs. `VITE_BASE_PATH` accepts absolute URL paths such as `/` or
`/bluehexagons/` (a trailing slash is added if omitted). Development and preview
use Vite's multipage mode: unknown URLs return 404 rather than the homepage.

Keep reusable project records in `src/content/` and detailed page narratives in
HTML. The homepage's `site:open-source-projects` marker generates the full
curated project listing at build time. All public pages ship their complete
content, navigation, and links in HTML. Keep career details aligned with the
concise [`profile.md`](../public/profile.md); there is no separate homepage
fallback summary to maintain.

`portfolio.ts` registers galleries and expandable sections without replacing
page content. Gallery source images are wrapped in native links with captions,
so they remain usable without JavaScript; expandable content remains visible
until its component upgrades. Keep ordinary links and decorative icons native.
Common document typography, tokens, and article surfaces live in `base.css`;
portfolio-specific content classes live in `portfolio-content.css`. Case studies
load the base and their own stylesheet. `css.css` remains a compatibility entry
point for the optional shop. Components receive
only `component.css` (reset and accessibility primitives) plus their own styles.
`layout.css`, `footer.css`, and `links.css` are shared between document layouts
and the legacy Web Components retained for the opt-in shop.

The shop continues to use `bootstrap.ts` for its client-rendered shell; it does
not import the portfolio enhancements. `elements/index.ts` is an explicit
all-components entry point, unused by common bootstrapping.

[`llms.txt`](../public/llms.txt) links public profile and project sources for
automated readers. Canonical URLs and the sitemap point to bluehexagons.com,
which is the primary copy of the site.

For browser smoke checks, serve the site on loopback with
`npm run dev -- --host 127.0.0.1` (or a production build with
`npm run preview -- --host 127.0.0.1`). Check the homepage and Antistatic at
desktop and narrow phone widths, with JavaScript enabled and disabled. Verify
the skip link, gallery arrows and enlarged viewer, Escape/focus return, and
`antistatic.html#refresh`, which must reveal nested expandable sections. Managed
Chromium covers this workflow; Firefox coverage has not been established.
The `check:site` suite runs registry, development HTTP, production preview, and
build-output checks without a browser dependency. It checks local link targets,
unique page IDs, fragment destinations, gallery fallbacks, and shop exclusion.

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
