import { ExpandableSection } from './elements/ExpandableSection';

function revealFragment(hash: string, scroll: boolean): void {
  if (!hash || hash === '#') return;

  let id: string;
  try {
    id = decodeURIComponent(hash.slice(1));
  } catch {
    return;
  }

  const target = document.getElementById(id);
  if (!target) return;

  let revealed = false;
  for (let parent = target.parentElement; parent; parent = parent.parentElement) {
    if (parent instanceof ExpandableSection) {
      parent.reveal();
      revealed = true;
    }
  }

  if (revealed && scroll) target.scrollIntoView({ block: 'start' });
}

// Reveal nested sections before the browser follows a link, including a link
// to the current hash (which does not trigger hashchange).
document.addEventListener('click', event => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const link = event.composedPath().find(node => node instanceof HTMLAnchorElement);
  if (!(link instanceof HTMLAnchorElement) || !link.hasAttribute('href') || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;

  const url = new URL(link.href);
  if (url.origin === location.origin && url.pathname === location.pathname && url.search === location.search) {
    revealFragment(url.hash, false);
  }
});

window.addEventListener('hashchange', () => revealFragment(location.hash, true));
requestAnimationFrame(() => revealFragment(location.hash, true));
