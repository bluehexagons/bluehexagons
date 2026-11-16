import { openSourceGroups } from './open-source.ts';

export type Credit = { label: string; detail: string; contributors?: { label: string; href: string }[] };
export type Project = {
  id: string;
  name: string;
  category: string;
  description: string;
  credit: Credit;
  image?: { path: string; alt: string };
  links: { href: string; label: string }[];
};

const vectorPose = openSourceGroups.flatMap(group => group.projects).find(project => project.repository === 'vector-pose')!;

export const projects = {
  antistatic: {
    id: 'antistatic', name: 'Antistatic', category: 'Platform fighter · Custom engine',
    description: 'A crisp, uncompromising platform fighter built around competitive mechanics, expressive movement, and a bespoke C and TypeScript engine.',
    credit: { label: 'Solo project', detail: 'Game design, programming, custom engine, 3D art, animation, music, and sound by Loren Crain.' },
    image: { path: 'assets/antistatic/Screenshot 2023-11-16 135339.png', alt: 'Antistatic gameplay with fighters on a floating platform.' },
    links: [
      { href: 'antistatic.html', label: 'Explore Antistatic' },
      { href: 'https://store.steampowered.com/app/944500/Antistatic', label: 'Steam' },
      { href: 'https://bluehexagons.itch.io/antistatic', label: 'itch.io' },
    ],
  },
  blackjack: {
    id: 'end-of-blackjack', name: 'End of Blackjack', category: 'First-person blackjack · Godot',
    description: 'A first-person blackjack game set in a post-apocalyptic world, built in Godot.',
    credit: { label: 'Solo development · Guest music', detail: 'Game design and development by Loren Crain.', contributors: [{ label: 'Music by kikiala', href: 'https://kikiala.bandcamp.com/' }] },
    image: { path: 'assets/bluehexagons/end_of_blackjack.jpg', alt: 'A blackjack table with illuminated cards and a mechanical control panel in End of Blackjack.' },
    links: [
      { href: 'https://store.steampowered.com/app/3884650/End_of_Blackjack/', label: 'View on Steam' },
      { href: 'portfolio.html#end-of-blackjack', label: 'Work samples' },
    ],
  },
  foodguide: {
    id: 'foodguide', name: "Don’t Starve Food Guide", category: 'Game companion · JavaScript',
    description: 'An unofficial crock pot simulator and food reference for the Don’t Starve games, growing from a small calculator into a collection of useful tools.',
    credit: { label: 'Primarily solo · Community contributions', detail: 'Created, maintained, and almost entirely developed by Loren Crain, with community contributions. An unofficial companion to Klei Entertainment’s Don’t Starve games.' },
    image: { path: 'assets/foodguide/Screenshot 2023-11-16 141703.png', alt: 'Ingredients and recipes in the Don’t Starve Food Guide.' },
    links: [
      { href: 'https://foodguide.bluehexagons.com', label: 'Open the guide' },
      { href: 'https://github.com/bluehexagons/foodguide', label: 'Source' },
    ],
  },
  vectorPose: {
    id: 'vector-pose', name: vectorPose.name, category: 'Creative tool · Electron & browser',
    description: vectorPose.description,
    credit: { label: 'Solo project', detail: 'Vector posing tool developed by Loren Crain for game and animation work.' },
    image: { path: 'assets/bluehexagons/vector_pose_alpha.png', alt: 'A vector character and posing controls in vector-pose.' },
    links: [
      { href: vectorPose.demo!, label: 'Try in browser' },
      { href: `https://github.com/bluehexagons/${vectorPose.repository}`, label: 'Source' },
    ],
  },
  basaltwater: {
    id: 'basaltwater', name: 'Basaltwater', category: 'Open-source infrastructure',
    description: 'A toolkit for repeatable Linux setup, web deployments, diagnostics, and managed development environments. It also runs this website.',
    credit: { label: 'Solo project', detail: 'Designed and maintained by Loren Crain; applied to this website, internal services, and workstations.' },
    links: [
      { href: 'basaltwater.html', label: 'Read the case study' },
      { href: 'https://github.com/bluehexagons/basaltwater', label: 'Source' },
    ],
  },
  clicker: {
    id: 'clicker', name: 'Minimal Clicker', category: 'Web experiment · Ruby on Rails',
    description: 'A small experiment in Ruby on Rails: a login system and a button that’s fun to press.',
    credit: { label: 'Solo project', detail: 'Web application developed by Loren Crain as a Ruby on Rails learning project.' },
    image: { path: 'assets/bluehexagons/minimal_clicker.png', alt: 'The Minimal Clicker web application.' },
    links: [{ href: 'https://clicker.bluehexagons.com', label: 'Try the clicker' }],
  },
  airDash: {
    id: 'air-dash-online', name: 'Air Dash Online', category: 'Collaborative prototype · 2013',
    description: 'A fast platform fighter by JV5 Games, demoed at Evo 2013. The team built a playable prototype but did not secure funding to finish the game.',
    credit: { label: 'Team project · Sole programmer', detail: 'Loren Crain: all programming, including custom Unity physics, collision, controller support, and animation systems, with input on game mechanics and design. Other JV5 Games team members handled art and design.' },
    image: { path: 'assets/ado/1157428_391081464351375_1074064025_n.png', alt: 'Tesla attacking Chai in the Air Dash Online prototype.' },
    links: [{ href: 'portfolio.html#air-dash-online', label: 'Read about my contribution' }],
  },
} satisfies Record<string, Project>;

export const projectCredits: Record<string, Credit> = {
  ...Object.fromEntries(Object.values(projects).map(project => [project.id, project.credit])),
  zazzle: { label: 'Team work · Senior UI Engineer', detail: 'Built frontend features and internal tools within Zazzle’s engineering teams. Individual work included a Slate rich-text editor and the design and implementation of an internal table editor.' },
  dexter: { label: 'Two-person engineering team', detail: 'Application development and Linux administration alongside another engineer, supporting Dexter Solutions and its clients.' },
  website: { label: 'Solo development', detail: 'Site design, frontend development, and hosting by Loren Crain. Background artwork is credited in the footer.' },
};
