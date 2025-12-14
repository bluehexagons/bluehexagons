import '../bootstrap';
import { render } from '../render';

const app = document.getElementById('app');
if (!app) throw new Error('Missing #app container');

render(
  <>
    <content-area>
      <page-header slot="content"></page-header>

      <article slot="content">
        <h1>Loren Crain</h1>

        <br />

        <div class="labeled_list">
          <div>Contact</div>
          <ul class="flex_list">
            <li>
              <site-link href="https://www.linkedin.com/in/loren-crain" aria-label="Loren Crain on LinkedIn">
                LinkedIn
              </site-link>
            </li>
            <li>
              <site-link href="https://github.com/bluehexagons" aria-label="Loren Crain is bluehexagons on GitHub">
                GitHub
              </site-link>
            </li>
            <li>
              <site-link href="mailto:loren@bluehexagons.com" aria-label="Email me at loren@bluehexagons.com">
                loren@bluehexagons.com
              </site-link>
            </li>
            <li aria-label="Southwest Missouri">
              <icon-img name="MissouriFlag.png"></icon-img> SW MO, USA (central time)
            </li>
          </ul>
        </div>

        <div class="description">
          <p>I'm a generalist software engineer and indie game developer. Founder of bluehexagons, solo developer of Antistatic.</p>

          <p>
            Open for work, freelance, and contract opportunities using a variety of technologies. Proficient in web and software
            development. Professional experience in financial tech, e-commerce, and games.
          </p>
        </div>

        <div class="widest center">
          <image-scroller>
            <img
              data-link-override="https://youtu.be/GtGyPGYhTdE?si=AbhJgwcNC9TpAteq"
              title="Antistatic is made from scratch in a bespoke 3D engine, built solo using C and TypeScript using very few third-party dependencies. I created all sound effects, music, 3D models, color algorithms, etc. Follow this link for the Antistatic 0.7 combo video trailer on YouTube."
              src="/assets/thumbs/antistatic/eztrailer_4-00.00.01.149.png"
            />
            <img
              title="A screenshot of a table rendered in React that was created using the internal table editing tool I authored at Zazzle."
              src="/assets/thumbs/zazzle/Screenshot 2023-11-13 121545.png"
            />
            <img
              title="Air Dash Online was a short-lived project to create a fast platform fighting game for PC, which I was the programmer for."
              src="/assets/thumbs/ado/1157428_391081464351375_1074064025_n.png"
            />
            <img
              title="The unofficial Don't Starve Food Guide started as a crockpot simulator early in alpha, and has grown since."
              src="/assets/thumbs/foodguide/Screenshot 2023-11-16 141703.png"
            />
            <img
              title="A screenshot of A Simple Snake Game during development, made in Godot and open-sourced."
              src="/assets/thumbs/bluehexagons/a_simple_snake_game.png"
            />
            <img title="A prototype card game made in Godot." src="/assets/thumbs/bluehexagons/early_prototype_card_game.png" />
            <img title="Part of the admin UI for backend systems built for a client." src="/assets/thumbs/bluehexagons/redacted_admin_ui.png" />
            <img
              title="A macro photograph I took of a butterfly. I post more photos to Bluesky, and offer higher-quality downloads."
              src="/assets/thumbs/bluehexagons/set_2_5_butterfly.jpg"
            />
            <img
              title="vector-pose is an open-source vector-based character posing tool I built for an in-development project."
              src="/assets/thumbs/bluehexagons/vector_pose_alpha.png"
            />
          </image-scroller>
        </div>

        <div class="labeled_list">
          <div>Also On</div>
          <ul class="flex_list">
            <li>
              Bluesky:{' '}
              <site-link href="https://bsky.app/profile/bluehexagons.com" aria-label="Loren Crain is @bluehexagons.com on Bluesky">
                @bluehexagons.com
              </site-link>
            </li>
            <li>
              itch.io:{' '}
              <site-link href="https://bluehexagons.itch.io/" aria-label="bluehexagons on itch.io">
                bluehexagons
              </site-link>
            </li>
            <li>
              YouTube:{' '}
              <site-link href="https://www.youtube.com/@bluehexagons" aria-label="@bluehexagons on YouTube">
                @bluehexagons
              </site-link>
            </li>
            <li>
              Second channel:{' '}
              <site-link href="https://www.youtube.com/@bluehexagons2" aria-label="@bluehexagons2 on YouTube">
                @bluehexagons2
              </site-link>
            </li>
            <li>
              Ko-fi:{' '}
              <site-link href="https://ko-fi.com/bluehexagons" aria-label="Loren Crain is bluehexagons on Ko-fi">
                bluehexagons
              </site-link>
            </li>
            <li>
              Birdsite:{' '}
              <site-link
                href="https://twitter.com/bluehexagons"
                aria-label="@bluehexagons on Twitter, or whatever it is when you read this"
              >
                @bluehexagons
              </site-link>
            </li>
            <li>
              Twitch:{' '}
              <site-link href="https://www.twitch.tv/thisterral" aria-label="thisterral on Twitch">
                thisTerral
              </site-link>
            </li>
            <li>
              Mastodon:{' '}
              <site-link
                href="https://mastodon.gamedev.place/@terral"
                aria-label="@terral@mastodon.gamedev.place on Mastodon"
              >
                @terral@mastodon.gamedev.place
              </site-link>
            </li>
            <li>
              Linktree:{' '}
              <site-link href="https://linktr.ee/bluehexagons" aria-label="bluehexagons on Linktree">
                bluehexagons
              </site-link>
            </li>
          </ul>
        </div>

        <div class="labeled_list">
          <div>Roles</div>
          <ul class="flex_list flex_list__background">
            <li>Software Engineer</li>
            <li>True Full-Stack</li>
            <li>Web Dev</li>
            <li>Game Dev</li>
            <li>SysAdmin</li>
          </ul>
        </div>

        <div class="labeled_list">
          <div>Core skills</div>
          <ul class="flex_list flex_list__background">
            <li>
              <icon-img name="TypeScript"></icon-img> TypeScript
            </li>
            <li>
              <site-link href="https://electronjs.org/">Electron</site-link>
            </li>
            <li>
              <site-link href="https://react.dev/">React</site-link>
            </li>
            <li>
              <icon-img name="CSharp"></icon-img> C#
            </li>
            <li>
              <icon-img name="Go"></icon-img> <site-link href="https://go.dev/">Go</site-link>
            </li>
            <li>
              <icon-img name="CPlusPlus"></icon-img> C/C++
            </li>
            <li>SQL</li>
            <li>
              <site-link href="https://nodejs.org/en">Node.js</site-link>
            </li>
            <li>
              <site-link href="https://aws.amazon.com/pm/lambda">AWS Lambda</site-link>
            </li>
            <li>
              <site-link href="https://godotengine.org/">Godot</site-link>
            </li>
          </ul>
        </div>

        <div class="labeled_list">
          <div>Freelance Services</div>
          <ul class="flex_list flex_list__background">
            <li>Website design & hosting</li>
            <li>Software & game development</li>
            <li>Full-stack web development</li>
            <li>etc</li>
          </ul>
        </div>

        <expandable-section aria-label="Show more">
          <div class="labeled_list">
            <div>Frontend web development</div>
            <ul class="flex_list flex_list__background">
              <li>
                <icon-img name="TypeScript"></icon-img> TypeScript
              </li>
              <li>
                <icon-img name="JS"></icon-img> JavaScript
              </li>
              <li>
                <site-link href="https://electronjs.org/">Electron</site-link>
              </li>
              <li>
                <site-link href="https://react.dev/">React</site-link>
              </li>
              <li>
                <site-link href="https://developer.mozilla.org/en-US/docs/Web/API/Web_components">Web Components</site-link>
              </li>
              <li>
                <site-link href="https://vite.dev/">Vite</site-link>
              </li>
              <li>HTML</li>
              <li>CSS</li>
              <li>
                <site-link href="https://jestjs.io/">Jest</site-link>
              </li>
              <li>
                <site-link href="https://storybook.js.org/">Storybook</site-link>
              </li>
              <li>
                <site-link href="https://nodejs.org/api/addons.html">Node-API</site-link>
              </li>
              <li>
                <site-link href="https://www.slatejs.org/">slate</site-link>
              </li>
              <li>
                <site-link href="https://eslint.org/">ESLint</site-link>
              </li>
            </ul>
          </div>

          <div class="labeled_list">
            <div>Software engineering</div>
            <ul class="flex_list flex_list__background">
              <li>
                <icon-img name="CSharp"></icon-img> C#
              </li>
              <li>
                <icon-img name="Python"></icon-img> Python
              </li>
              <li>
                <icon-img name="Rust"></icon-img> <site-link href="https://www.rust-lang.org/">Rust</site-link>
              </li>
              <li>git</li>
              <li>SQL Server</li>
              <li>
                <site-link href="https://www.postgresql.org/">PostgreSQL</site-link>
              </li>
              <li>
                <site-link href="https://www.sqlite.org/">SQLite</site-link>
              </li>
              <li>Auth systems</li>
              <li>REST APIs</li>
            </ul>
          </div>

          <div class="labeled_list">
            <div>Game development</div>
            <ul class="flex_list flex_list__background">
              <li>Godot</li>
              <li>Unreal Engine</li>
              <li>GDScript</li>
              <li>
                <icon-img name="TypeScript"></icon-img> TypeScript
              </li>
              <li>
                <icon-img name="CSharp"></icon-img> C#
              </li>
              <li>Blender</li>
              <li>Unity</li>
              <li>
                <site-link href="https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API">WebGL</site-link>
              </li>
              <li>
                <site-link href="https://www.opengl.org/">OpenGL</site-link>
              </li>
              <li>
                <site-link href="https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API">HTML5 Canvas</site-link>
              </li>
              <li>
                <site-link href="https://store.steampowered.com/">Steam</site-link> publishing
              </li>
              <li>
                <site-link href="https://itch.io/">itch.io</site-link> publishing
              </li>
              <li>Game design</li>
              <li>Controller input</li>
              <li>Custom engines</li>
              <li>Internationalization</li>
            </ul>
          </div>

          <div class="labeled_list">
            <div>Systems</div>
            <ul class="flex_list flex_list__background">
              <li>Bash</li>
              <li>
                vim/<site-link href="https://neovim.io/">neovim</site-link>
              </li>
              <li>Linux administration</li>
              <li>
                <site-link href="https://www.proxmox.com/en/products/proxmox-virtual-environment/overview">Proxmox VE</site-link>
              </li>
              <li>Networking</li>
              <li>Hardware</li>
              <li>VMs/VPS</li>
              <li>Containers</li>
              <li>
                <site-link href="https://www.truenas.com/">TrueNAS</site-link>
              </li>
              <li>
                <site-link href="https://opnsense.org/">OPNsense</site-link>
              </li>
              <li>PowerShell</li>
            </ul>
          </div>

          <div class="labeled_list">
            <div>Tools and software</div>
            <ul class="flex_list flex_list__background">
              <li>Linux</li>
              <li>Windows</li>
              <li>Mac OS</li>
              <li>Visual Studio</li>
              <li>VS Code</li>
              <li>
                <site-link href="https://www.ffmpeg.org/">ffmpeg</site-link>
              </li>
              <li>RDP</li>
              <li>Trello</li>
              <li>Bitbucket</li>
              <li>GitHub</li>
              <li>Jira</li>
              <li>Jenkins</li>
            </ul>
          </div>

          <div class="labeled_list">
            <div>Amazon Web Services</div>
            <ul class="flex_list flex_list__background">
              <li>Lambda</li>
              <li>Cognito</li>
              <li>DynamoDB</li>
              <li>AWS Amplify</li>
              <li>CloudWatch</li>
              <li>Route 51</li>
              <li>IAM</li>
              <li>Secrets Manager</li>
            </ul>
          </div>

          <div class="labeled_list">
            <div>Other engineering</div>
            <ul class="flex_list flex_list__background">
              <li>3D printing</li>
              <li>Soldering</li>
              <li>Reverse engineering</li>
              <li>Electrical engineering</li>
              <li>Embedded devices</li>
              <li>Raspberry Pi</li>
            </ul>
          </div>

          <div class="labeled_list">
            <div>Other interests</div>
            <ul class="flex_list flex_list__background">
              <li>Nature photography</li>
              <li>Music</li>
              <li>Languages</li>
              <li>PC games</li>
              <li>Speedcubing</li>
              <li>2D animation</li>
              <li>3D modeling</li>
              <li>SSBM</li>
              <li>Mechanical keyboards</li>
              <li>Distro hopping</li>
              <li>Manufacturing</li>
            </ul>
          </div>

          <div class="labeled_list">
            <div>More stuff I use</div>
            <ul class="flex_list flex_list__background">
              <li>Digital Ocean</li>
              <li>Cloudflare</li>
              <li>
                <site-link href="https://scoop.sh/">Scoop</site-link>
              </li>
              <li>Debian</li>
              <li>Fedora</li>
              <li>Linux Mint</li>
              <li>Android</li>
              <li>Steam</li>
              <li>Steam Deck</li>
              <li>Duolingo</li>
            </ul>
          </div>
        </expandable-section>
      </article>

      <article slot="content">
        <h1>
          Antistatic
          <span class="time_range">2012 - Present</span>
        </h1>

        <p class="description">
          A solo-developed uncompromising platform fighting game using a bespoke C/TypeScript engine.

          {' '}Read more at <site-link href="/antistatic">the main Antistatic page.</site-link>
        </p>

        <div class="widest center">
          <image-scroller>
            <img src="/assets/thumbs/antistatic/boxart.png" title="Antistatic's Steam box art" />
            <img
              data-link-override="https://youtu.be/GtGyPGYhTdE?si=AbhJgwcNC9TpAteq"
              title="A thumbnail for the Antistatic 0.7 combo video trailer. Follow the link to check it out."
              src="/assets/thumbs/antistatic/eztrailer_4-00.00.01.149.png"
            />
            <img
              src="/assets/thumbs/antistatic/Screenshot 2023-11-16 135339.png"
              title="A screenshot of the current state of the 0.8 open alpha test."
            />
            <img
              src="/assets/thumbs/antistatic/wheeeemodels.png"
              title="A screenshot showing a graphics engine test. It uses public domain high-detail models of a DSLR or mirrorless camera, and a rolling coffee cart."
            />
          </image-scroller>
        </div>

        <ul class="flex_list flex_list__background">
          <li>Built from Scratch</li>
          <li>Main language: TypeScript</li>
          <li>Native code: C</li>
          <li>Server language: Go</li>
        </ul>

        <expandable-section aria-label="Show more">
          <ul class="flex_list flex_list__background">
            <li>Shaders: GLES</li>
            <li>Server OS: Ubuntu</li>
            <li>Graphics: OpenGL</li>
            <li>Bespoke graphics engine</li>
            <li>Dynamic sound engine</li>
            <li>Custom physics engine</li>
            <li>Uncapped player count</li>
            <li>Latency-optimized rendering and input processing</li>
            <li>Font atlassing in C</li>
            <li>Delay-based P2P UDP netcode</li>
            <li>Custom build system: Bash, PowerShell</li>
          </ul>

          <div class="labeled_list">
            <div>Open-Source Pieces</div>
            <ul class="flex_list flex_list__background">
              <li>
                Lobby server:{' '}
                <site-link href="https://github.com/bluehexagons/antistatic-server">antistatic-server</site-link>
              </li>
              <li>
                Input state machine:{' '}
                <site-link href="https://github.com/bluehexagons/capacitor">capacitor</site-link>
              </li>
              <li>
                Color math scripting language:{' '}
                <site-link href="https://github.com/bluehexagons/trace">trace</site-link>
              </li>
              <li>
                Loader:{' '}
                <site-link href="https://github.com/bluehexagons/antistatic-loader">antistatic-loader</site-link>
              </li>
              <li>
                Animator:{' '}
                <site-link href="https://github.com/bluehexagons/antistatic-animator">antistatic-animator</site-link>
              </li>
              <li>
                Translations:{' '}
                <site-link href="https://github.com/bluehexagons/antistatic-translations">antistatic-translations</site-link>
              </li>
              <li>
                Easing library:{' '}
                <site-link href="https://github.com/bluehexagons/easing">@bluehexagons/easing</site-link>
              </li>
            </ul>
          </div>
        </expandable-section>
      </article>

      <article slot="content">
        <h1>
          Senior UI Engineer @ Zazzle.com
          <span class="time_range">Jun 2019 - Sep 2023</span>
        </h1>

        <p class="description">I worked on most parts of the Zazzle.com frontend codebase, and built some internal tools.</p>

        <div class="widest center">
          <image-scroller>
            <img
              title="A screenshot showing a few technologies I built and worked on being used on the website. I worked extensively on displaying images, interactive hotspots, and the content management system."
              src="/assets/thumbs/zazzle/Screenshot 2023-11-13 121328.png"
            />
            <img title="A screenshot of other examples of rich content and image use I worked on." src="/assets/thumbs/zazzle/Screenshot 2023-11-13 121946.png" />
            <img
              title="A screenshot of a featured creators spotlight, using a highly-configurable profile photo embedding feature I originally authored."
              src="/assets/thumbs/zazzle/Screenshot 2023-11-13 121406.png"
            />
            <img
              title="A screenshot of an internal table editing tool built for React that I fully designed and implemented."
              src="/assets/thumbs/zazzle/Screenshot 2023-05-16 at 20.26.22.png"
            />
            <img
              title="A screenshot of a table rendered in React that was created using the internal table editing tool I authored."
              src="/assets/thumbs/zazzle/Screenshot 2023-11-13 121545.png"
            />
          </image-scroller>
        </div>

        <ul class="flex_list flex_list__background">
          <li>TypeScript</li>
          <li>React</li>
          <li>SASS</li>
          <li>C#</li>
          <li>Redux/Sagas</li>
          <li>slate</li>
          <li>SQL</li>
          <li>Responsive design</li>
          <li>Accessibility</li>
          <li>Internationalization</li>
          <li>Storybook</li>
          <li>Jira</li>
          <li>Bitbucket</li>
        </ul>

        <expandable-section aria-label="Show more">
          <p>
            Built and maintained frontend UI infrastructure and for public and internal pages. The primary technologies I used were
            TypeScript, React, Redux/Sagas, and C#.
          </p>
        </expandable-section>
      </article>

      <article slot="content">
        <h1>
          Application Developer @ Dexter Solutions
          <span class="time_range">Feb 2014 - Jun 2018</span>
        </h1>

        <p class="description">
          For most of the time, I was part of a two-person team responsible for any dev or sysadmin work that came up for the company
          or clients. Worked on big old systems with a lot of data.
        </p>

        <ul class="flex_list flex_list__background">
          <li>TypeScript</li>
          <li>Go</li>
          <li>SQL</li>
          <li>PHP</li>
          <li>JavaScript</li>
          <li>HTML</li>
          <li>CSS</li>
          <li>OAUTH integration</li>
          <li>Linux system administration</li>
        </ul>

        <expandable-section aria-label="Show more">
          <p>
            Developed bespoke pages and utilities using Go, SQL Server, and TypeScript. Enhanced legacy PHP, JavaScript, and
            third-party software. Administered Linux servers.
          </p>
        </expandable-section>
      </article>

      <article slot="content">
        <h1>
          Lead Programmer @ Air Dash Online
          <span class="time_range">May - Oct 2013</span>
        </h1>

        <p class="description">This game scared Wobbles with how fast it was at Evo, and I miss it.</p>

        <div class="widest center">
          <image-scroller>
            <img
              title="A promotional screenshot showing Tesla using side-special against a stationary Chai."
              src="/assets/thumbs/ado/1157428_391081464351375_1074064025_n.png"
            />
            <img
              loading="lazy"
              title="A short animation showing Tesla comboing Chai. It ends in an air dash knee used to punish a stun cancel air dash for the KO."
              src="/assets/ado/dd0e10cb88d38afeaf6303d24b11521f_large.gif"
            />
            <img
              title="A screenshot of progress made after the Evo demo, leading up to the Kickstarter launch."
              src="/assets/thumbs/ado/1093871_374154056044116_1718466907_o.png"
            />
          </image-scroller>
        </div>

        <ul class="flex_list flex_list__background">
          <li>Unity Game Engine</li>
          <li>Custom physics</li>
          <li>Custom 2D collision system</li>
          <li>Technical animation</li>
          <li>Rapid prototyping</li>
          <li>git</li>
        </ul>

        <expandable-section aria-label="Show more">
          <p>
            Air Dash Online was a prototype of a fast-paced platform fighting game by JV5 Games. As the programmer, I built its custom
            platform fighter engine inside of Unity. JV5 Games was a global team; I worked most with the founder, animators, and the
            graphics lead. We had a playable demo after a few months that we demoed at Evo 2013.
          </p>

          <p>
            A fun trip down memory lane: <site-link href="https://www.youtube.com/watch?v=RuP-JQJhP4Q">CLASH Tournament's vod</site-link>{' '}
            is still available from when they let Chris stream his modeling work and some gameplay. I've lost all builds of the game,
            so if anyone has kept one then please let me know so that I don't need to port it off of Unity Script to relive playing.
          </p>

          <div class="labeled_list">
            <div>Custom Tech</div>
            <ul>
              <li>2D capsule-based attack collision system based on 3D animations</li>
              <li>2D stage collision and management system</li>
              <li>In-game controller remapping tech</li>
              <li>Automated detection of some controllers for specific remapping</li>
              <li>Keyboard, controller, and fight stick support</li>
              <li>YAML parser</li>
              <li>Animation sequencing, timing, interpolation system</li>
              <li>Platform fighter mechanics: air dodging, wave dashing, light/heavy attacks, blocking, recovery, etc</li>
            </ul>
          </div>
        </expandable-section>
      </article>

      <article slot="content">
        <h1>
          Don't Starve Food Guide
          <span class="time_range">Jan 2013 - Present</span>
        </h1>

        <p class="description">
          The Unofficial Don't Starve Food Guide is a simple static JavaScript-powered app that provides several helpful food-related
          tools for the Don't Starve series of games.
        </p>

        <div class="widest center">
          <image-scroller>
            <img title="A screenshot of the Don't Starve Food Guide's Discovery tab." src="/assets/thumbs/foodguide/Screenshot 2023-11-16 141445.png" />
            <img title="Woah! That's a lot of food!" src="/assets/thumbs/foodguide/Screenshot 2023-11-16 141703.png" />
            <img title="A screenshot of the statistics analyzer in the Discovery tab." src="/assets/thumbs/foodguide/Screenshot 2023-11-16 141519.png" />
          </image-scroller>
        </div>

        <ul class="flex_list flex_list__background">
          <li>JavaScript</li>
          <li>HTML</li>
          <li>CSS</li>
          <li>Open-source</li>
          <li>
            <site-link href="https://github.com/bluehexagons/foodguide">100+ stars on GitHub</site-link>
          </li>
        </ul>

        <expandable-section aria-label="Show more">
          <p>
            The open-source <site-link href="https://foodguide.bluehexagons.com">Food Guide</site-link> (
            <site-link href="https://github.com/bluehexagons/foodguide">on GitHub</site-link>) was created to simulate the in-game
            crock pot, which crafts different dishes depending on what four ingredients are chosen. It expanded to include more tools,
            and has been maintained since Don't Starve was in Early Access.
          </p>
        </expandable-section>
      </article>

      <article slot="content">
        <h1>
          bluehexagons.com
          <span class="time_range">2015 - Present</span>
        </h1>

        <p class="description">You Are Here. And I appreciate you.</p>

        <ul class="flex_list flex_list__background">
          <li>TypeScript</li>
          <li>HTML</li>
          <li>CSS</li>
          <li>Web Components</li>
          <li>Vite</li>
          <li>Node.js</li>
          <li>Ubuntu</li>
          <li>Bash</li>
          <li>
            <site-link href="https://github.com/bluehexagons/bluehexagons">On GitHub</site-link>
          </li>
        </ul>

        <expandable-section aria-label="Show more">
          <p>
            This website is hosted on a headless Linux server running nginx, written using modern HTML, CSS, and TypeScript. It's
            still under construction.
          </p>
        </expandable-section>
      </article>
    </content-area>

    <page-footer></page-footer>
  </>,
  app
);
