// Shared by the build and browser. Keep this module free of DOM and Vite APIs.
export const siteOrigin = 'https://bluehexagons.com';

export type Page = {
  path: string;
  title: string;
  description: string;
  label: string;
  layout: 'portfolio' | 'article';
  sitemap: boolean;
};

export const pages = {
  home: {
    layout: 'portfolio',
    path: '',
    title: 'bluehexagons - Loren Crain',
    description: 'Loren Crain builds web software, games, and reliable infrastructure, including the open-source Basaltwater toolkit.',
    label: 'bluehexagons',
    sitemap: true,
  },
  antistatic: {
    layout: 'portfolio',
    path: 'antistatic.html',
    title: 'Antistatic - bluehexagons',
    description: 'Antistatic is a crisp, uncompromising platform fighter focused on exploring competitive mechanics.',
    label: 'Antistatic',
    sitemap: true,
  },
  basaltwater: {
    layout: 'article',
    path: 'basaltwater.html',
    title: 'Basaltwater: infrastructure and deployment engineering — Loren Crain',
    description: 'How Loren Crain designs Basaltwater for repeatable Linux setup, safer deployments, and managed coding environments.',
    label: 'Basaltwater',
    sitemap: true,
  },
  privacy: {
    layout: 'article',
    path: 'privacy.html',
    title: 'Privacy Policy - bluehexagons',
    description: 'Privacy Policy for bluehexagons.com and related services.',
    label: 'Privacy',
    sitemap: false,
  },
} as const satisfies Record<string, Page>;

type NavigationItem = { label: string } & ({ path: string } | { href: string });

export const primaryNavigation: readonly NavigationItem[] = [
  { path: pages.home.path, label: pages.home.label },
  { path: pages.antistatic.path, label: pages.antistatic.label },
  { path: pages.basaltwater.path, label: pages.basaltwater.label },
  { path: '#open-source', label: 'Open source' },
  { href: 'https://store.steampowered.com/app/3884650/End_of_Blackjack', label: 'End of Blackjack' },
  { href: 'https://clicker.bluehexagons.com', label: 'Clicker' },
  { href: 'https://foodguide.bluehexagons.com', label: 'DS Food Guide' },
];

export function resolveSitePath(path: string, base: string): string {
  return `${base.replace(/\/*$/, '/')}${path.replace(/^\/+/, '')}`;
}

export function navigationLinks(base: string, currentPath: string) {
  const normalizedPath = currentPath.replace(/index\.html$/, '');
  return primaryNavigation.map(item => {
    const href = 'path' in item ? resolveSitePath(item.path, base) : item.href;
    return { label: item.label, href, current: !href.includes('#') && href === normalizedPath };
  });
}
