type OpenSourceProject = {
  name: string;
  repository: string;
  description: string;
  demo?: string;
  demoLabel?: string;
};

export const openSourceGroups: { title: string; projects: OpenSourceProject[] }[] = [
  {
    title: 'Tools and sandboxes',
    projects: [
      {
        name: 'vector-pose', repository: 'vector-pose',
        description: 'Vector-based skeletal posing tools, with Electron and browser editions.',
        demo: 'https://bluehexagons.github.io/vector-pose/', demoLabel: 'Try in browser',
      },
      {
        name: 'Easing Lab', repository: 'easing-sandbox',
        description: 'Plot, compose, and experiment with easing curves in an interactive browser workbench.',
        demo: 'https://bluehexagons.github.io/easing-sandbox/', demoLabel: 'Open the lab',
      },
      {
        name: 'Generator', repository: 'generator',
        description: 'A deterministic plasma image generator, revisiting one of my earliest JavaScript projects.',
        demo: 'https://bluehexagons.github.io/generator/', demoLabel: 'Make an image',
      },
    ],
  },
  {
    title: 'Games and experiments',
    projects: [
      {
        name: 'Hex Strategy', repository: 'hexstrategy',
        description: 'A procedural systems toy on a canvas lattice, with evolving forms and autonomous motes.',
        demo: 'https://bluehexagons.github.io/hexstrategy/', demoLabel: 'Explore the demo',
      },
      {
        name: 'Corvus', repository: 'jsshooter',
        description: 'A wireframe, side-scrolling shooter rebuilt from a 2010 browser experiment.',
        demo: 'https://bluehexagons.github.io/jsshooter/', demoLabel: 'Play in browser',
      },
      {
        name: 'A Simple Snake Game', repository: 'snake2d',
        description: 'A Godot game with classic, pitfall, and obstacle modes, plus keyboard, controller, mouse, and touch input.',
      },
    ],
  },
  {
    title: 'Languages and utilities',
    projects: [
      {
        name: 'Trace', repository: 'trace',
        description: 'A specialized functional language originally developed for Antistatic, with an interactive sandbox.',
        demo: 'https://bluehexagons.github.io/trace-sandbox/', demoLabel: 'Try the language',
      },
      {
        name: 'Waveplayer', repository: 'waveplayer',
        description: 'A browser-native waveform audio player written in TypeScript.',
        demo: 'https://bluehexagons.github.io/waveplayer/', demoLabel: 'Try the player',
      },
      {
        name: 'Gomoose', repository: 'gomoose',
        description: 'Go Minimal Web Server: a small, self-contained web server.',
      },
    ],
  },
];
