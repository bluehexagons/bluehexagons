export const profile = {
  name: 'Loren Crain',
  role: 'Software engineer & indie game developer',
  location: 'Southwest Missouri, USA · Central time',
  summary: 'I build web software, games, and the infrastructure behind them. My professional experience spans financial technology, e-commerce, and games; my independent work covers product engineering through deployment and operations.',
  availability: 'Open to engineering roles, freelance work, and contracts.',
  interests: 'I’m especially interested in engineering work for nonprofits, wildlife conservation and environmental efforts, expanding access to science and technology, and human rights causes.',
  agentExperience: 'Across contract and independent work, I have used Codex, Claude Code, GitHub Copilot, Cursor, OpenCode, and T3 Code to develop complex systems.',
  contacts: [
    { label: 'Email', text: 'loren@bluehexagons.com', href: 'mailto:loren@bluehexagons.com' },
    { label: 'GitHub', text: 'bluehexagons', href: 'https://github.com/bluehexagons' },
    { label: 'LinkedIn', text: 'loren-crain', href: 'https://www.linkedin.com/in/loren-crain' },
  ],
};

export const experience = [
  {
    id: 'fintech', title: 'Financial technology contractor', period: 'Contract work',
    context: 'Production web applications · Client unnamed',
    description: 'Built features for production websites using AWS Lambda, Cognito, DynamoDB, Amplify, CloudWatch, Route 53, IAM, and Secrets Manager.',
    contribution: 'Contract engineering; client and product details are kept private.',
  },
  {
    id: 'zazzle', title: 'Senior UI Engineer @ Zazzle.com', period: 'Jun 2019 – Sep 2023',
    context: 'E-commerce · Engineering teams',
    description: 'Built and maintained public-facing frontend features and internal tools using TypeScript, React, Redux/Sagas, and C#. Work included rich content, image presentation, a Slate rich-text editor, and an internal table editor I designed and implemented.',
    contribution: 'Team work, with individual ownership of editor features and internal tooling.',
  },
  {
    id: 'dexter', title: 'Application Developer @ Dexter Solutions', period: 'Feb 2014 – Jun 2018',
    context: 'Business systems · Two-person engineering team',
    description: 'Developed bespoke pages and utilities using Go, SQL Server, and TypeScript; enhanced legacy PHP and JavaScript systems and third-party software; administered Linux servers for the company and clients.',
    contribution: 'Shared development and systems administration responsibilities with another engineer.',
  },
  {
    id: 'air-dash-online', title: 'Lead Programmer @ Air Dash Online', period: 'May – Oct 2013',
    context: 'JV5 Games · Sole programmer on a collaborative game prototype',
    description: 'Built a custom platform fighter engine inside Unity, including physics, collision, controller support, and animation systems. Worked with the founder, animators, and graphics lead on the playable Evo 2013 demo.',
    contribution: 'Sole programmer, with input on game mechanics and design. Other team members handled art and design.',
  },
];

export const skills = [
  { title: 'Web & application engineering', items: ['TypeScript', 'JavaScript', 'React', 'HTML & CSS', 'Web Components', 'Node.js', 'Electron', 'C#', 'Go', 'SQL', 'REST APIs', 'Authentication'] },
  { title: 'Games & creative tools', items: ['Godot / GDScript', 'Unity', 'C / C++', 'Custom engines', 'OpenGL / WebGL', 'Physics & collision', 'Animation tooling', 'Blender', 'Controller input', 'Steam & itch.io publishing'] },
  { title: 'Infrastructure & operations', items: ['Linux', 'Proxmox', 'Bash', 'PowerShell', 'AWS', 'Networking', 'Containers', 'Deployment automation', 'Diagnostics & recovery', 'Git', 'CI workflows'] },
  { title: 'Product & interface work', items: ['Responsive design', 'Accessibility', 'Internationalization', 'Storybook', 'Jest', 'Slate', 'Redux / Sagas', 'Legacy system maintenance'] },
];

export const engineeringAreas = [
  'Linux and Proxmox machine setup, service management, diagnostics, and recovery.',
  'Static site and service deployment with staging, health checks, isolated runtime users, and persistent data.',
  'Web frontend and backend development, games, and development tooling.',
  'Managed Git workspaces, browser verification, and access boundaries for coding environments.',
];

export const services = ['Website design & hosting', 'Software & game development', 'Full-stack web development', 'General technical consulting'];

export const additionalSkills = [
  { title: 'Frontend web development', items: ['TypeScript', 'JavaScript', 'Electron', 'React', 'Web Components', 'Vite', 'HTML', 'CSS', 'Jest', 'Storybook', 'Node-API', 'slate', 'ESLint'] },
  { title: 'Software engineering', items: ['C#', 'Python', 'Rust', 'git', 'SQL Server', 'PostgreSQL', 'SQLite', 'Auth systems', 'REST APIs'] },
  { title: 'Game development', items: ['Godot', 'Unreal Engine', 'GDScript', 'TypeScript', 'C#', 'Blender', 'Unity', 'WebGL', 'OpenGL', 'HTML5 Canvas', 'Steam publishing', 'itch.io publishing', 'Game design', 'Controller input', 'Custom engines', 'Internationalization'] },
  { title: 'Systems', items: ['Bash', 'vim/neovim', 'Linux administration', 'Proxmox VE', 'Networking', 'Hardware', 'VMs/VPS', 'Containers', 'TrueNAS', 'OPNsense', 'PowerShell'] },
  { title: 'Tools and software', items: ['Linux', 'Windows', 'Mac OS', 'Visual Studio', 'VS Code', 'ffmpeg', 'RDP', 'Trello', 'Bitbucket', 'GitHub', 'Jira', 'Jenkins'] },
  { title: 'Amazon Web Services', items: ['Lambda', 'Cognito', 'DynamoDB', 'AWS Amplify', 'CloudWatch', 'Route 53', 'IAM', 'Secrets Manager'] },
  { title: 'Other engineering', items: ['3D printing', 'Soldering', 'Reverse engineering', 'Electrical engineering', 'Embedded devices', 'Raspberry Pi'] },
  { title: 'Other interests', items: ['Nature photography', 'Music', 'Languages', 'PC games', 'Speedcubing', '2D animation', '3D modeling', 'SSBM', 'Mechanical keyboards', 'Distro hopping', 'Manufacturing'] },
  { title: 'More stuff I use', items: ['Digital Ocean', 'Cloudflare', 'Scoop', 'Debian', 'Fedora', 'Linux Mint', 'Android', 'Steam', 'Steam Deck'] },
];

export const socialLinks = [
  { href: 'https://bsky.app/profile/bluehexagons.com', label: 'Bluesky', text: '@bluehexagons.com' },
  { href: 'https://bluehexagons.itch.io/', label: 'itch.io', text: 'bluehexagons' },
  { href: 'https://www.youtube.com/@bluehexagons', label: 'YouTube', text: '@bluehexagons' },
  { href: 'https://www.youtube.com/@bluehexagons2', label: '2nd YouTube', text: '@bluehexagons2' },
  { href: 'https://ko-fi.com/bluehexagons', label: 'Ko-fi', text: 'bluehexagons' },
  { href: 'https://twitter.com/bluehexagons', label: 'Birdsite', text: '@bluehexagons' },
  { href: 'https://www.twitch.tv/thisterral', label: 'Twitch', text: 'thisTerral' },
  { href: 'https://mastodon.gamedev.place/@terral', label: 'Mastodon', text: '@terral@mastodon.gamedev.place' },
  { href: 'https://linktr.ee/bluehexagons', label: 'Linktree', text: 'bluehexagons' },
];
