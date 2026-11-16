import { relative } from 'node:path';
import type { Plugin } from 'vite';
import { navigationLinks, pages, resolveSitePath, siteOrigin, type Page } from '../src/site.ts';
import { openSourceGroups } from '../src/content/open-source.ts';

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]!);
}

export function renderHead(page: Page): string {
  // Vite rewrites asset URLs in head links; give it a source-root URL so the
  // hosting base is applied exactly once in development as well as production.
  const icon = '/assets/icon.png';
  return `<title>${escapeHtml(page.title)}</title>
    <meta name="description" content="${escapeHtml(page.description)}" />
    <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1" />
    <link rel="canonical" href="${siteOrigin}/${page.path}" />
    <link rel="icon" sizes="362x362" type="image/png" href="${icon}" />
    <link rel="apple-touch-icon" href="${icon}" />`;
}

function renderLayoutStart(page: Page, base: string): string {
  const links = navigationLinks(base, resolveSitePath(page.path, base))
    .map(link => `<a href="${escapeHtml(link.href)}"${link.current ? ' aria-current="page"' : ''}>${escapeHtml(link.label)}</a>`)
    .join('\n');
  return `<a class="skip-link" href="#main-content">Skip to main content</a>
    <div class="case-study-shell">
      <header class="case-study-header">
        <nav aria-label="Primary navigation">${links}</nav>
      </header>
      <main id="main-content" tabindex="-1">`;
}

function renderLayoutEnd(base: string): string {
  return `</main>
      <footer class="case-study-footer">
        <a href="${escapeHtml(resolveSitePath('', base))}">Back to the portfolio</a> ·
        <a href="${escapeHtml(resolveSitePath('profile.md', base))}">Concise profile</a> ·
        <a href="${escapeHtml(resolveSitePath(pages.privacy.path, base))}">Privacy</a> ·
        <a href="mailto:loren@bluehexagons.com">Contact Loren</a>
      </footer>
    </div>`;
}

export function renderSitemap(): string {
  const urls = Object.values(pages).filter(page => page.sitemap)
    .map(page => `  <url><loc>${siteOrigin}/${page.path}</loc></url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function renderOpenSourceSummary(): string {
  return `<ul>${openSourceGroups.map(group => `<li>${escapeHtml(group.title)}: ${group.projects
    .map(project => `<a href="https://github.com/bluehexagons/${escapeHtml(project.repository)}">${escapeHtml(project.name)}</a>`)
    .join(', ')}.</li>`).join('\n')}</ul>`;
}

export function siteHtmlPlugin(sourceRoot: string): Plugin {
  let base = '/';
  return {
    name: 'site-html',
    configResolved(config) { base = config.base; },
    transformIndexHtml: {
      order: 'pre',
      handler(html, context) {
        const path = relative(sourceRoot, context.filename).replaceAll('\\', '/').replace(/^index\.html$/, '');
        const page = Object.values(pages).find(page => page.path === path);
        // Shop entries remain independent and opt-in.
        if (!page) {
          if (html.includes('<!-- site:')) throw new Error(`Missing page metadata: ${path}`);
          return html;
        }
        if (!html.includes('<!-- site:head -->')) throw new Error(`Missing site:head in ${path || 'index.html'}`);
        return html.replace('<!-- site:head -->', () => renderHead(page))
          .replace('<!-- site:open-source-summary -->', renderOpenSourceSummary)
          .replace('<!-- site:layout-start -->', () => renderLayoutStart(page, base))
          .replace('<!-- site:layout-end -->', () => renderLayoutEnd(base));
      },
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: renderSitemap() });
    },
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const path = request.url?.split('?')[0];
        if (path !== '/sitemap.xml' && path !== resolveSitePath('sitemap.xml', base)) return next();
        response.setHeader('Content-Type', 'application/xml; charset=utf-8');
        response.end(renderSitemap());
      });
    },
  };
}
