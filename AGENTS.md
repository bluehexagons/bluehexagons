# Repository guidance

- The root README is displayed on the GitHub profile. Keep it focused on the personal profile and portfolio; put setup, implementation, and operational documentation in `docs/` or the relevant component guide.
- Setup and checks: [development guide](docs/development.md); API details: [server/README](server/README.md).
- Deployment and cleanup: [Basaltwater integration](docs/basaltwater.md). Use shared Basaltwater skills for environment operations.
- The shop is unfinished; keep it opt-in. `VITE_` settings are public; keep secrets and operational evidence outside Git.
- Keep project descriptions and contribution credits in `src/content/projects.ts`; career details in `src/content/profile.ts` generate the HTML resume and `/profile.md`. Preserve source media and curated archives.
