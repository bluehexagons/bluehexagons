import { projects, projectCredits, type Project } from '../src/content/projects.ts';
import { additionalSkills, engineeringAreas, experience, profile, services, skills, socialLinks } from '../src/content/profile.ts';
import { pages, resolveSitePath, siteOrigin } from '../src/site.ts';
import { escapeHtml as escape } from './html.ts';

function link(href: string, label: string, base: string): string {
  const path = /^(https?:|mailto:)/.test(href) ? href : resolveSitePath(href, base);
  return `<a href="${escape(path)}">${escape(label)}</a>`;
}

export function renderCredit(id: string, compact = false): string {
  const credit = projectCredits[id];
  if (!credit) throw new Error(`Unknown project credit: ${id}`);
  return `<div class="contribution${compact ? ' contribution--compact' : ''}" aria-label="Contribution credits">
    <strong>${escape(credit.label)}</strong>
    ${compact ? '' : `<p>${escape(credit.detail)}</p>`}
    ${credit.contributors?.map(person => link(person.href, person.label, '/')).join(' · ') || ''}
  </div>`;
}

function renderCard(project: Project, base: string, featured = false): string {
  const primary = project.links[0];
  return `<article id="${project.id}" class="project-card${project.image ? '' : ' project-card--text'}">
    ${project.image ? `<a class="project-card__image" href="${escape(/^(https?:)/.test(primary.href) ? primary.href : resolveSitePath(primary.href, base))}" aria-label="${escape(`${primary.label}: ${project.name}`)}">
      <img src="/${escape(project.image.path)}" alt="${escape(project.image.alt)}" width="960" height="540" ${featured ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" />
    </a>` : ''}
    <div class="project-card__body">
      <p class="eyebrow">${escape(project.category)}</p>
      <h3>${escape(project.name)}</h3>
      <p class="project-card__description">${escape(project.description)}</p>
      ${renderCredit(project.id, !featured && project.id !== 'air-dash-online')}
      <div class="project-card__links">${project.links.map(item => link(item.href, item.label, base)).join(' ')}</div>
    </div>
  </article>`;
}

export function renderProjectCards(group: string, base: string): string {
  const groups: Record<string, Project[]> = {
    games: [projects.antistatic, projects.blackjack],
    tools: [projects.foodguide, projects.vectorPose, projects.basaltwater, projects.clicker],
    collaborative: [projects.airDash],
  };
  if (!groups[group]) throw new Error(`Unknown project group: ${group}`);
  return groups[group].map(project => renderCard(project, base, group === 'games')).join('\n');
}

export function renderBlackjackDetail(base: string): string {
  const project = projects.blackjack;
  const images = [project.image, {
    path: 'assets/bluehexagons/early_prototype_card_game.png',
    alt: 'An early prototype of End of Blackjack.',
  }];
  return `<article id="${project.id}">
    <h3 class="section_title">${escape(project.name)}</h3>
    ${renderCredit(project.id)}
    <p class="description">${escape(project.description)}</p>
    <image-scroller aria-label="End of Blackjack work samples">${images.map(image => `<a href="${escape(resolveSitePath(image.path, base))}">
      <img src="/${escape(image.path.replace('assets/', 'assets/thumbs/'))}" title="${escape(image.alt)}" alt="${escape(image.alt)}" loading="lazy" decoding="async" />
      <span class="gallery-fallback-caption">${escape(image.alt)}</span>
    </a>`).join('')}</image-scroller>
    <p>${link(project.links[0].href, project.links[0].label, base)}</p>
  </article>`;
}

function skillGroups(groups: typeof skills): string {
  return groups.map(group => `<section><h3>${escape(group.title)}</h3>
    <ul>${group.items.map(item => `<li>${escape(item)}</li>`).join('')}</ul></section>`).join('\n');
}

const selectedProjects: Project[] = [projects.antistatic, projects.blackjack, projects.basaltwater, projects.foodguide];

export function renderProfile(base: string): string {
  return `<header class="page-intro profile-heading">
    <p class="eyebrow">Profile / Resume</p><h1>${profile.name}</h1>
    <p class="profile-role">${escape(profile.role)}</p><p class="profile-location">${escape(profile.location)}</p>
    <p>${escape(profile.summary)}</p><p class="profile-availability">${escape(profile.availability)}</p>
    <ul class="profile-contact">${profile.contacts.map(contact => `<li><span>${contact.label}</span> ${link(contact.href, contact.text, base)}</li>`).join('')}</ul>
    <div class="page-actions">${link(pages.portfolio.path, 'View my portfolio', base)} ${link('profile.md', 'Text / Markdown version', base)}</div>
    <p class="print-hint">Use your browser’s Print command to print this resume or save a PDF.</p>
  </header>
  <nav class="section-nav" aria-label="Profile sections"><a href="#experience">Experience</a><a href="#selected-projects">Selected projects</a><a href="#skills">Skills</a><a href="#interests">Interests &amp; services</a></nav>
  <article class="resume-section" id="experience"><h2>Professional experience</h2>
    ${experience.map(job => `<section class="experience-entry" id="${job.id}">
      <div class="experience-entry__heading"><h3>${escape(job.title)}</h3><p>${escape(job.period)}</p></div>
      <p class="experience-context">${escape(job.context)}</p><p>${escape(job.description)}</p>
      <p class="experience-contribution">${escape(job.contribution)}</p>
      ${job.id !== 'fintech' ? `<p>${link(`portfolio.html#${job.id}`, 'Related work samples', base)}</p>` : ''}
    </section>`).join('\n')}
  </article>
  <article class="resume-section" id="selected-projects"><h2>Selected independent work</h2>
    ${selectedProjects.map(project => `<section class="resume-project"><h3>${link(project.id === 'end-of-blackjack' ? 'portfolio.html#end-of-blackjack' : project.links[0].href, project.name, base)}</h3>
      <p>${escape(project.description)}</p>${renderCredit(project.id)}</section>`).join('\n')}
    <p>${link(pages.home.path, 'Explore more games and projects', base)}</p>
  </article>
  <article class="resume-section" id="skills"><h2>Skills &amp; engineering areas</h2>
    <div class="resume-skills">${skillGroups(skills)}</div>
    <ul class="engineering-areas">${engineeringAreas.map(area => `<li>${escape(area)}</li>`).join('')}</ul>
    <p>${escape(profile.agentExperience)}</p>
    <details class="additional-skills"><summary>More technologies, tools, and interests</summary><div class="resume-skills">${skillGroups(additionalSkills)}</div></details>
  </article>
  <article class="resume-section" id="interests"><h2>Work I care about</h2><p>${escape(profile.interests)}</p>
    <h3>Freelance services</h3><ul>${services.map(service => `<li>${escape(service)}</li>`).join('')}</ul>
    <p>${link('mailto:loren@bluehexagons.com', 'Get in touch about a role or project', base)}</p>
  </article>
  <section class="profile-elsewhere" aria-labelledby="elsewhere-heading"><h2 id="elsewhere-heading">Elsewhere</h2>
    <ul>${socialLinks.map(social => `<li>${link(social.href, `${social.label} — ${social.text}`, base)}</li>`).join('')}</ul>
  </section>`;
}

export function renderPerson(): string {
  return `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Person', name: profile.name,
    url: `${siteOrigin}/${pages.profile.path}`, jobTitle: 'Software engineer',
    sameAs: [...profile.contacts.filter(contact => contact.href.startsWith('https:')).map(contact => contact.href), 'https://bluehexagons.itch.io/'],
  }).replaceAll('<', '\\u003c')}</script>`;
}

export function renderProfileMarkdown(): string {
  return `# ${profile.name}

${profile.role}. ${profile.location}.

${profile.summary} ${profile.availability}

## Experience

${experience.map(job => `### ${job.title}\n\n${job.period} · ${job.context}\n\n${job.description}\n\n${job.contribution}`).join('\n\n')}

## Selected projects and credits

${selectedProjects.map(project => `- [${project.name}](${project.id === 'end-of-blackjack' ? 'portfolio.html#end-of-blackjack' : project.links[0].href}): ${project.description} **${project.credit.label}.** ${project.credit.detail}${project.credit.contributors ? ` ${project.credit.contributors.map(person => `[${person.label}](${person.href})`).join('; ')}.` : ''}`).join('\n')}

[Explore all games, tools, and open-source projects](index.html#open-source) or [view detailed work samples](portfolio.html).

## Engineering areas

${engineeringAreas.map(area => `- ${area}`).join('\n')}

${profile.agentExperience}

## Skills

${skills.map(group => `- ${group.title}: ${group.items.join(', ')}.`).join('\n')}

## Work I care about

${profile.interests}

## Freelance services

${services.map(service => `- ${service}`).join('\n')}

## Contact and links

${profile.contacts.map(contact => `- ${contact.label}: [${contact.text}](${contact.href})`).join('\n')}
- [Profile & resume](${pages.profile.path}) · [Portfolio](${pages.portfolio.path}) · [Games & projects](index.html)
`;
}
