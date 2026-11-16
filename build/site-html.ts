import { posix, relative } from 'node:path';
import type { Plugin } from 'vite';
import { navigationLinks, pageFile, pages, resolveSitePath, siteOrigin, type Page } from '../src/site.ts';
import { openSourceGroups } from '../src/content/open-source.ts';
import { artworkCredit, copyrightNotice } from '../src/content/footer.ts';

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]!);
}

export function renderHead(page: Page): string {
  // Vite rewrites asset URLs in head links; give it a source-root URL so the
  // hosting base is applied exactly once in development as well as production.
  const icon = '/assets/icon.png';
  const canonical = escapeHtml(`${siteOrigin}/${page.path}`);
  return `<title>${escapeHtml(page.title)}</title>
    <meta name="description" content="${escapeHtml(page.description)}" />
    <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="bluehexagons" />
    <meta property="og:title" content="${escapeHtml(page.title)}" />
    <meta property="og:description" content="${escapeHtml(page.description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${escapeHtml(page.title)}" />
    <meta name="twitter:description" content="${escapeHtml(page.description)}" />
    <link rel="icon" sizes="362x362" type="image/png" href="${icon}" />
    <link rel="apple-touch-icon" href="${icon}" />`;
}

function renderLayoutStart(page: Page, base: string): string {
  const links = navigationLinks(base, resolveSitePath(page.path, base))
    .map(link => `<a href="${escapeHtml(link.href)}"${link.current ? ' aria-current="page"' : ''}>${escapeHtml(link.label)}</a>`)
    .join('\n');
  if (page.layout === 'portfolio') {
    return `<a class="skip-link" href="#main-content">Skip to main content</a>
      <div class="content_area">
        <div class="content_area__background" aria-hidden="true"></div>
        <div class="content_wrapper">
          <header class="navbar"><nav class="nav" aria-label="Primary navigation">${links}</nav></header>
          <main id="main-content" class="content_main" tabindex="-1">`;
  }
  return `<a class="skip-link" href="#main-content">Skip to main content</a>
    <div class="case-study-shell">
      <header class="case-study-header">
        <nav aria-label="Primary navigation">${links}</nav>
      </header>
      <main id="main-content" tabindex="-1">`;
}

function renderLayoutEnd(page: Page, base: string): string {
  if (page.layout === 'portfolio') {
    return `</main></div></div>
      <footer class="site-footer">
        <div class="copyright">
          ${escapeHtml(copyrightNotice(new Date().getFullYear()))}
          <a href="${artworkCredit.href}" target="_blank" rel="noopener noreferrer">${artworkCredit.name}<span class="link__new-tab"> (opens in a new tab)</span></a>.
        </div>
        <ul class="links-container">
          <li><a href="${escapeHtml(resolveSitePath('profile.md', base))}">Concise profile</a></li>
          <li><a href="${escapeHtml(resolveSitePath(pages.privacy.path, base))}">Privacy</a></li>
        </ul>
      </footer>`;
  }
  return `</main>
      <footer class="case-study-footer">
        <a href="${escapeHtml(resolveSitePath('', base))}">Back to the portfolio</a> ·
        <a href="${escapeHtml(resolveSitePath('profile.md', base))}">Concise profile</a> ·
        <a href="${escapeHtml(resolveSitePath(pages.privacy.path, base))}">Privacy</a> ·
        <a href="mailto:loren@bluehexagons.com">Contact Loren</a>
      </footer>
    </div>`;
}

export function renderSitemap(registeredPages: readonly Page[] = Object.values(pages)): string {
  const urls = registeredPages.filter(page => page.sitemap)
    .map(page => `  <url><loc>${siteOrigin}/${page.path}</loc></url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function projectLink(href: string, label: string, ariaLabel: string, className = ''): string {
  return `<a href="${escapeHtml(href)}"${className ? ` class="${className}"` : ''} target="_blank" rel="noopener noreferrer"
    aria-label="${escapeHtml(ariaLabel)} (opens in a new tab)">${escapeHtml(label)}</a>`;
}

function renderOpenSourceProjects(): string {
  return openSourceGroups.map(group => `<section>
    <h3>${escapeHtml(group.title)}</h3>
    <ul>${group.projects.map(project => `<li>
      <h4>${projectLink(`https://github.com/bluehexagons/${project.repository}`, project.name, `${project.name} source on GitHub`)}</h4>
      <p>${escapeHtml(project.description)}</p>
      ${project.demo ? projectLink(project.demo, project.demoLabel || 'Open demo', `${project.demoLabel || 'Open demo'}: ${project.name}`, 'open_projects__demo') : ''}
    </li>`).join('\n')}</ul>
  </section>`).join('\n');
}

export function siteHtmlPlugin(sourceRoot: string, registeredPages: readonly Page[], includeShop = false): Plugin {
  let base = '/';
  return {
    name: 'site-html',
    configResolved(config) { base = config.base; },
    transformIndexHtml: {
      order: 'pre',
      handler(html, context) {
        const path = relative(sourceRoot, context.filename).replaceAll('\\', '/');
        const page = registeredPages.find(page => pageFile(page.path) === path);
        // Shop entries remain independent and opt-in.
        if (!page) {
          if (includeShop && path.startsWith('shop/')) return html;
          throw new Error(`Missing page metadata: ${path}`);
        }
        for (const marker of ['head', 'layout-start', 'layout-end']) {
          if (html.split(`<!-- site:${marker} -->`).length !== 2) {
            throw new Error(`Expected one site:${marker} in ${path || 'index.html'}`);
          }
        }
        const result = html.replace('<!-- site:head -->', () => renderHead(page))
          .replace('<!-- site:open-source-projects -->', renderOpenSourceProjects)
          .replace('<!-- site:layout-start -->', () => renderLayoutStart(page, base))
          .replace('<!-- site:layout-end -->', () => renderLayoutEnd(page, base));
        if (result.includes('<!-- site:')) throw new Error(`Unknown site marker in ${path || 'index.html'}`);
        return result;
      },
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: renderSitemap(registeredPages) });
    },
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        let path: string;
        try {
          // Match Vite's decoded file paths before applying the feature gate.
          path = posix.normalize(decodeURIComponent(request.url?.split('?')[0] || '').replaceAll('\\', '/'));
        } catch {
          response.statusCode = 400;
          response.end('Malformed URL');
          return;
        }
        const entry = path.startsWith(base) ? path.slice(base.length) : path.replace(/^\//, '');
        if (!includeShop && (entry === 'shop' || entry.startsWith('shop/'))) {
          response.statusCode = 404;
          response.end('Not found');
          return;
        }
        if (path !== '/sitemap.xml' && path !== resolveSitePath('sitemap.xml', base)) return next();
        response.setHeader('Content-Type', 'application/xml; charset=utf-8');
        response.end(renderSitemap(registeredPages));
      });
    },
  };
}
