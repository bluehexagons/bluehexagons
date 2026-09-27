// Vite replaces BASE_URL for each build. Keep public assets and internal links
// under the same base so the site works at / and at a Pages project URL.
export function sitePath(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;
}
