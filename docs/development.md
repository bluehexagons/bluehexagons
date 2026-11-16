# Site development

Use Node.js 24.22.2+ in the 24.x line or 26.13.0+ in the 26.x line.
[`.nvmrc`](../.nvmrc) pins the version used by CI.

```bash
nvm install && nvm use       # optional, if using nvm
npm ci
npm run dev                 # http://localhost:3000
npm run build               # production output in dist/
npm run preview             # preview the build
```

The build type-checks the frontend and generates thumbnails from
`public/assets/`. Thumbnails, dependencies, and `dist/` are untracked output.
Preserve source media and the curated archives in `public/etc/`.

The default build excludes the unfinished shop; its routes return 404 in ordinary
development. Use `npm run dev:shop` or `npm run build:shop` to enable it, alongside
the [Go API](../server/README.md). `VITE_API_BASE` defaults to
`http://localhost:8080` locally and the site’s origin in production. All `VITE_`
settings are public; keep secrets in the API environment.

## Hosting paths

Root-domain builds use `/`. For the
[GitHub Pages copy](https://bluehexagons.github.io/bluehexagons/), use the same
base for build, checks, and preview:

```bash
VITE_BASE_PATH=/bluehexagons/ npm run build
VITE_BASE_PATH=/bluehexagons/ npm run check:site
VITE_BASE_PATH=/bluehexagons/ npm run preview
```

`VITE_BASE_PATH` must be an absolute URL path; a trailing slash is added if
needed. Canonical URLs and the sitemap always point to `bluehexagons.com`.
Development and preview return 404 for unknown routes.

## Checks

Before pushing, build and check both frontend modes, then run the backend checks:

```bash
npm run build && npm run check:site
npm run build:shop && VITE_SHOP=1 npm run check:site
cd server
go mod verify
go vet ./...
go test -race ./...
```

Run `check:site` after each build, before another build replaces `dist/`. Match
its `VITE_BASE_PATH` and `VITE_SHOP` settings to the build. Check new pages at both
`/` and `/bluehexagons/`.

The suite covers metadata, navigation, local links and fragments in HTML and
documentation, gallery fallbacks, profile consistency, and shop exclusion.
Temporary fixtures test nested pages through development, build, and preview.
GitHub Actions checks both frontend modes and the API; a separate workflow builds
and deploys the Pages copy.

For interactive changes, run the optional Chromium suite against a fresh build:

```bash
npx playwright install chromium  # once, and after Playwright updates
npm run build
npm run check:browser
```

The suite starts and stops preview on `127.0.0.1:4175`. It checks desktop and phone
layouts, navigation without JavaScript, gallery keyboard controls and modal
focus, video activation, fragment links, and expandable content when resizing,
reattaching, or printing. Match `VITE_BASE_PATH` to the build for a project URL.
Failure traces stay in the ignored `test-results/` directory. Browser tests run
separately from the fast CI checks; see [Playwright’s browser setup](https://playwright.dev/docs/browsers)
for platform requirements.

Also check the skip link, profile printing, and touch gestures manually. Bind
manual preview to loopback with `--host 127.0.0.1`. Firefox and native Windows
coverage have not been established.

## Content and architecture

The site uses Vite’s multipage mode. All public pages contain their content and
navigation in static HTML; the homepage and profile need no JavaScript.

| Source | Purpose |
| --- | --- |
| [`src/index.html`](../src/index.html) | Games and projects homepage; retains `#open-source` and `#basaltwater` |
| [`src/portfolio.html`](../src/portfolio.html) | Detailed work samples and galleries |
| [`src/profile.html`](../src/profile.html) | Printable resume and contact information |
| [`src/site.ts`](../src/site.ts) | Page metadata, navigation, and canonical URLs |
| [`src/content/projects.ts`](../src/content/projects.ts) | Shared project summaries, media, links, and credits |
| [`src/content/open-source.ts`](../src/content/open-source.ts) | Smaller project catalogue |
| [`src/content/profile.ts`](../src/content/profile.ts) | Career records for the HTML resume and generated `/profile.md` |

Keep detailed narratives in one HTML entry. The shared renderers in
[`build/content.ts`](../build/content.ts) supply project cards, credits, and the
profile. [`build/site-html.ts`](../build/site-html.ts) expands markers before Vite
processes HTML and emits `sitemap.xml` and `profile.md`; do not duplicate these in
`public/`.

Shared content markers:

- `site:project-cards:games`, `site:project-cards:tools`,
  `site:project-cards:collaborative`: homepage collections.
- `site:credit:PROJECT-ID`: contribution credits.
- `site:open-source-projects`: the smaller project catalogue.
- `site:profile` and `site:person`: the resume and its structured data.

Use these inside HTML comments, for example `<!-- site:credit:antistatic -->`.
Update [`public/llms.txt`](../public/llms.txt) when public source links change.
Check new repository links while signed out; use a public project page or
storefront when source is private.

## Adding a page

1. Create an HTML entry and register its path, title, description, label, layout,
   and sitemap eligibility in `src/site.ts`. Use `''` for the homepage,
   `projects/example.html` for a file, or `projects/example/` backed by
   `src/projects/example/index.html`. Paths are relative to the hosting base.
   Missing, duplicate, and unregistered entries fail validation.
2. Copy an existing page’s structure. Put `<!-- site:head -->` after the charset
   declaration, and wrap content with `site:layout-start` and `site:layout-end`
   comments. These generate metadata, navigation, the skip link, main landmark,
   and footer. Keep page-specific head elements in the entry.
3. Choose `article` with `/case-study.css` for a case study, or `portfolio` with
   `/portfolio.css` for the wider layout. Add `/portfolio.ts` only for galleries
   or expandable sections. Add primary navigation links when useful.
4. Use `%BASE_URL%` for internal anchor URLs and `sitePath()` for links created
   by browser code. Use root-relative image and head asset URLs; Vite applies
   the hosting base. Keep existing URLs stable.
5. Build and check both hosting bases. Add behavior checks for new interactions.

`src/shop/` is exempt from the public registry and included only with
`VITE_SHOP=1`. Its metadata stays separate, with no public navigation or sitemap
entries.

## Styles and components

`base.css` holds shared typography and tokens. `portfolio-content.css` holds
portfolio content styles; `page.css` shares introductions and credits. Page
stylesheets compose these with layout, link, and footer styles. Components load
`component.css` (reset and accessibility rules) plus their own styles.

`portfolio.ts` adds galleries and expandable sections without replacing page
content. The optional shop uses `bootstrap.ts` and the `css.css` compatibility
entry. `elements/index.ts` is an unused, explicit all-components entry point.

Expandable sections keep their main control above the preview. Expanded content
has a second collapse action at the end, which returns focus and the viewport
to the main control. Give each section a descriptive `aria-label` beginning with
“Show more”; the label is also visible. Sections that fit hide both controls.
If a focused control disappears after resizing, focus moves to the content.
Fragment links and keyboard focus reveal clipped content automatically.
Printing shows all content and hides the controls.

## Image galleries

Wrap thumbnail images in native links with captions so galleries work without
JavaScript. Set the image’s `title` for its caption and `alt` for a visual
description. Thumbnails live under `/assets/thumbs/`; the selected image and
viewer use the original asset. Expandable content remains visible until upgraded.

`data-link-override` preserves video destinations. Supported YouTube URLs offer
an embedded player using the privacy-enhanced host; playback loads only after
activation. Switching items, returning to the preview, closing the viewer, or
removing the gallery stops playback. Other video hosts retain external links.

Arrows, thumbnails, Left/Right, Home/End, and horizontal swipes navigate images.
Vertical touch scrolling and pinch zoom stay native. Escape, Close, or a backdrop
click dismisses the enlarged viewer and returns focus. Reduced-motion settings
disable animations; there is no automatic advance.

## Deployment

See [Basaltwater integration](basaltwater.md) for deployment, optional shop setup,
backups, and cleanup. Basaltwater is optional for local builds and tests;
Linux deployment uses Bash and the Go build script.
