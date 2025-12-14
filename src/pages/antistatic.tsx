import '../bootstrap';
import { render } from '../render';

const app = document.getElementById('app');
if (!app) throw new Error('Missing #app container');

render(
  <>
    <content-area>
      <page-header slot="content"></page-header>

      <article slot="content">
        <h1>
          Antistatic
          <span class="time_range">v0.7.5 alpha // v0.8.0 testing</span>
        </h1>

        <p class="description">
          <strong class="antistatic-text">Antistatic</strong> is a crisp, uncompromising platform fighter focused on exploring
          competitive mechanics. Built, animated, and designed by a solo developer, in a bespoke, custom engine.
        </p>

        <p class="description">
          Inside a crumbling digital world, atomic combatants carry out their programming in an endless series of battles over the
          remaining shielded landmarks.
        </p>

        <div class="labeled_list">
          <div>Get the Game</div>
          <ul class="flex_list">
            <li>
              <site-link href="https://store.steampowered.com/app/944500/Antistatic">Steam</site-link>
            </li>
            <li>
              <site-link href="https://bluehexagons.itch.io/antistatic">itch.io</site-link>
            </li>
            <li>
              <site-link href="https://www.humblebundle.com/g/antistatic">Humble Bundle</site-link>
            </li>
          </ul>
        </div>

        <div class="labeled_list">
          <div>Community</div>
          <ul class="flex_list">
            <li>
              <site-link href="https://discord.gg/ZGJvA8P">Discord</site-link>
            </li>
            <li>
              <site-link href="https://reddit.com/r/antistatic">Reddit</site-link>
            </li>
            <li>
              <site-link href="https://trello.com/b/XR4oQwYs/antistatic-roadmap">Roadmap (Trello)</site-link>
            </li>
          </ul>
        </div>

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
      </article>

      <article slot="content">
        <h1>Characters</h1>

        <p></p>

        <div class="widest center">
          <image-scroller>
            <img src="/assets/antistatic/characters/silicon.png" title="Silicon" alt="Silicon character artwork" />
            <img src="/assets/antistatic/characters/carbon.png" title="Carbon" alt="Carbon character artwork" />
            <img src="/assets/antistatic/characters/iron.png" title="Iron" alt="Iron character artwork" />
            <img src="/assets/antistatic/characters/xenon.png" title="Xenon" alt="Xenon character artwork" />
            <img src="/assets/antistatic/characters/helium.png" title="Helium" alt="Helium character artwork" />
            <img src="/assets/antistatic/characters/rhodium.png" title="Rhodium" alt="Rhodium character artwork" />
          </image-scroller>
        </div>

        <div class="labeled_list">
          <div>Silicon</div>
          <p>Mobile fastfaller with a lot of combo setups, but often lacks KO power. Can apply pressure with lasers.</p>
        </div>

        <div class="labeled_list">
          <div>Carbon</div>
          <p>High ground movement speed, powerful aerials.</p>
        </div>

        <div class="labeled_list">
          <div>Iron</div>
          <p>Combo-focused heavyweight.</p>
        </div>

        <div class="labeled_list">
          <div>Xenon</div>
          <p>Weird, complicated character; double jump cancels, lots of mechanics.</p>
        </div>

        <div class="labeled_list">
          <div>Helium</div>
          <p>High air speed, initial dash is faster than run speed; has multiple air jumps</p>
        </div>

        <div class="labeled_list">
          <div>Rhodium</div>
          <p>Disjointed moves with limitations. Normal moves must be refreshed with down-special.</p>
        </div>

        <expandable-section aria-label="Show more character details">
          <div class="labeled_list">
            <div>Silicon</div>
            <h4>Advice</h4>
            <ul>
              <li>Space with fair, bair, jab, lasers can be used to apply pressure</li>
              <li>KO with bair, nair, forward-tap, up-tilt, tipper up-tap, sweetspot ftilt</li>
              <li>Late KO with ftilt, up air, forward throw, down-tap, up-tap</li>
              <li>Combo with Pulse, down tilt, down throw, up throw, up tilt, jab 1/2, dair, up air, late hit neutral air</li>
              <li>Pulse semi-reliably combos into grabs and moves</li>
            </ul>
            <expandable-section aria-label="Show more character details">
              <h4>Up - Arc</h4>
              <ul>
                <li>Always does two jumps</li>
                <li>Jumps based on angle and tilt of control stick</li>
              </ul>
              <h4>Side - Trace</h4>
              <ul>
                <li>Pseudojump</li>
                <li>Can be angled up/side/down</li>
                <li>Applies a status that hits several times after a short delay</li>
                <li>If shield is activated during status, all hits trigger instantly and can be powershielded</li>
              </ul>
              <h4>Down - Pulse</h4>
              <ul>
                <li>Frame 1 hit w/ intangibility</li>
                <li>Jump-canceleble on frame 4</li>
                <li>Can turn around during animation</li>
              </ul>
              <h4>Neutral - Emit</h4>
              <ul>
                <li>Projectile that can be land-canceled, does little damage but causes flinching</li>
              </ul>
            </expandable-section>
          </div>

          <div class="labeled_list">
            <div>Carbon</div>
            <h4>Advice</h4>
            <ul>
              <li>Space with bair, nair, fair, dtilt, Bash</li>
              <li>KO with tipper fair, tipper up air, second hit up air, dair, up-tap, down-tap, super Bash</li>
              <li>KO late with down tilt, bair, forward-tap, Slice</li>
              <li>combo with first hit up air, down tilt, forward throw, up throw, reverse bair, first hit nair</li>
            </ul>
            <expandable-section aria-label="Show more character details">
              <h4>Up - Slice</h4>
              <ul>
                <li>Quick upwards burst</li>
                <li>Reversible</li>
                <li>If backward is held at the end of the animation, character will turn around</li>
              </ul>
              <h4>Side - Slam</h4>
              <ul>
                <li>Can grab ledge during very start of fall</li>
                <li>Replenishes double jump</li>
                <li>Can be tilted forward/back</li>
              </ul>
              <h4>Down - Bash</h4>
              <ul>
                <li>After successfully hitting twice, or two targets at once, the next use will be a more powerful version</li>
              </ul>
              <h4>Neutral - Fan</h4>
              <ul>
                <li>Rapidly throw out several hits, fanned vertically</li>
                <li>Decent shield pressure</li>
              </ul>
            </expandable-section>
          </div>

          <div class="labeled_list">
            <div>Iron</div>
            <h4>Advice</h4>
            <ul>
              <li>Space with bair, uair, jab, utilt, Spring</li>
              <li>Cross-up with nair</li>
              <li>Combo with up air, up tilt, dair, forward throw, bair</li>
              <li>KO with fair, nair, ftilt, dtilt, f-tap, u-tap</li>
              <li>Late KO with nair, uair, f-tap, u-tap, up throw, Clobber</li>
              <li>Second-hit up air is semi-spike</li>
            </ul>
            <expandable-section aria-label="Show more character details">
              <h4>Up - Grindstone</h4>
              <ul>
                <li>On ground, can slide around during animation</li>
                <li>In air, trajectory depends on direction of control stick (up/forward/back/down/neutral)</li>
              </ul>
              <h4>Side - Spring</h4>
              <ul>
                <li>Pseudojump</li>
                <li>Can be angled up/down</li>
                <li>Hurtbox extends before hitbox</li>
              </ul>
              <h4>Down - Clobber</h4>
              <ul>
                <li>Two fast hits</li>
                <li>Pushes forward, and can turn around mid-animation for the second hit</li>
              </ul>
              <h4>Neutral - Bear Trap</h4>
              <ul>
                <li>Hold to become a trap, release to attack</li>
                <li>Gives small upward boost when attacking, but ends in free fall</li>
                <li>Can grab ledge</li>
              </ul>
            </expandable-section>
          </div>

          <div class="labeled_list">
            <div>Xenon</div>
            <h4>Advice</h4>
            <ul>
              <li>Space with fair, dtilt, nair, Orb</li>
              <li>
                Combo with up air, dair, bair, up tilt, normal up-tap, tipper fair (low percents), up throw, first hit nair
              </li>
              <li>KO with tipper fair, variant f-tap, f-tap, ftilt</li>
              <li>KO late with sourspot fair, variant down-tap, variant up-tap, up air, normal down-tap</li>
              <li>Down tilt is a set-knockback semi-spike</li>
              <li>Flash hitbox is also a set-knockback semi-spike</li>
              <li>Back air hits at a few different angles</li>
              <li>Down throw can lead into a tech chase</li>
            </ul>
            <expandable-section aria-label="Show more character details">
              <h4>Double jump</h4>
              <ul>
                <li>Can instant land at the start</li>
                <li>
                  Loses momentum at the end of the animation, so can gain extra height by using a move at the right time to cancel it
                </li>
                <li>Can turn around with jump, and grab ledge</li>
                <li>Has strong armor for a few frames at the start of the animation</li>
              </ul>
              <h3>Specials</h3>
              <h4>Up - Flash</h4>
              <ul>
                <li>Can be canceled with shield before the jump</li>
                <li>Can grab ledge during animation</li>
                <li>Reduces gravity slightly</li>
              </ul>
              <h4>Side - Orb</h4>
              <ul>
                <li>Shoots a slow projectile</li>
                <li>Projectile can be angled up or down</li>
                <li>If projectile is out, using move again will teleport to the projectile</li>
                <li>Projectile bounces off of shields and the stage</li>
                <li>Projectile can be destroyed if attacked by a strong enough move</li>
              </ul>
              <h4>Down - Alternate</h4>
              <ul>
                <li>Builds charges (up to 6) for variant tap attacks, adding a charge creates a hitbox</li>
                <li>Can be canceled with shield</li>
                <li>
                  When there is a charge available for variant tap attacks, all tap attacks get replaced with slightly different moves
                  (WIP on exact moves)
                </li>
              </ul>
              <h4>Neutral - Compress</h4>
              <ul>
                <li>When uncharged, gives short burst (4 frames) of strong armor</li>
                <li>
                  When charged, maintains strong armor for 4 seconds, can be canceled into Orb, shield, jumps, or ended with shield
                  hard press in air
                </li>
              </ul>
            </expandable-section>
          </div>

          <div class="labeled_list">
            <div>Helium</div>
            <h4>Advice</h4>
            <ul>
              <li>Space with fair, bair, nair, forward-tap</li>
              <li>Combo with dair, up air, late nair, d-tilt, f-tilt, dash attack</li>
              <li>KO with bair, nair 2, d-tap, gimps, f-tap</li>
              <li>Late KO with utilt, second hit uair, f-tap</li>
              <li>Nair has an optional second hit if A is pressed at the end of the animation</li>
              <li>Up throw leaves open to counter attacks, but does massive damage</li>
              <li>Back hit of up air always pulls forward, can be used to drag off stage</li>
              <li>Charging f-tap will slide forward further</li>
              <li>Utilt has a spike at the end of its animation</li>
              <li>Jab is a spike</li>
              <li>First hit of dash attack is a spike</li>
            </ul>
            <expandable-section aria-label="Show more character details">
              <h4>Up - Inflate</h4>
              <ul>
                <li>Consumes double jumps, can be triggered multiple times</li>
                <li>Reversible</li>
                <li>Slightly better recovery per jump than normal air jumps</li>
              </ul>
              <h4>Side - Spark</h4>
              <ul>
                <li>Pseudojump</li>
                <li>Multi-hit; first hit triggers behind and can be used as a single hit</li>
                <li>Holding special will prolong the attack</li>
              </ul>
              <h4>Down - Swoop</h4>
              <ul>
                <li>Bounces back on hit with significantly less lag</li>
              </ul>
              <h4>Neutral - Seek</h4>
              <ul>
                <li>Hits where the control stick is pointing when the hitbox comes out</li>
              </ul>
            </expandable-section>
          </div>

          <div class="labeled_list">
            <div>Rhodium</div>

            <h4 id="refresh">Refresh and Burn</h4>
            <p>
              Every normal move (taps, tilts, aerials, grabs, throws) has some hitbubbles that only activate while it's refreshed.
              Using a move burns it. All moves are restored whenever Refresh (down-special) is used. Many attacks gain a sweetspot or
              additional range, like forward-tap or grabs. Some take on new trajectories, like throws.
            </p>
            <p>
              Each time a move is burned (once per animation between refreshes), the burn counter increases by 1, which is used by Burn
              (neutral-special). Using Refresh fully resets this counter. A consequence of animations is that moves spanning multiple
              animations, like forward tilt (e.g. ftilt -&gt; ftilt-up) or tap attacks (f-tap -&gt; charge -&gt; release), count multiple times
              and can be exploited to quickly reach a given number.
            </p>

            <expandable-section aria-label="Show more character details">
              <h4>Up - Loop Slash</h4>
              <ul>
                <li>Quickly curve backward and up</li>
              </ul>
              <h4>Side - Memory</h4>
              <ul>
                <li>Perform a hit in place, then quickly attack horizontally</li>
                <li>
                  If attack lands, or an attack hit shortly before activation, then Rhodium remembers and moves toward that target
                </li>
                <li>If the horizontal leap connects, then Rhodium may act after the move; otherwise, become helpless</li>
                <li>
                  Tip: Immediately using side-B after connecting with fast move, like nair, to home in for a follow up
                </li>
              </ul>
              <h4>Down - Refresh</h4>
              <ul>
                <li>Rhodium's primary mechanic: using down-B refreshes every normal move</li>
                <li>Can be jumped out of start on frame 4, and is intangible on frame 1</li>
                <li>If no moves have been burned, has a frame 1 hit with weak knockback and horizontal trajectory</li>
                <li>
                  Tip: Can double-Refresh to get out a hit even if moves have been burned; Refresh -&gt; Jump -&gt; Refresh before leaving
                  ground (3-frame window; frame 4-6)
                </li>
                <li>
                  See <site-link href="#refresh">Refresh and Burn section</site-link>
                </li>
              </ul>
              <h4>Neutral - Burn</h4>
              <ul>
                <li>
                  See <site-link href="#refresh">Refresh and Burn section</site-link>
                </li>
                <li>Shakes as it adds to the burn counter, until a move condition is met</li>
              </ul>
              <ul>
                <li>Divisible by 5: Kick</li>
                <li>Divisible by 9: Spin</li>
                <li>Divisible by 13: Back Stab</li>
              </ul>
            </expandable-section>
          </div>
        </expandable-section>
      </article>

      <article slot="content">
        <h1>Mechanics</h1>
        <ul class="features">
          <li>
            <strong>Online play</strong> &mdash; join one other player in online matches; online is still early in development, with much
            more in the works
          </li>
          <li>
            <strong>Familiar mechanics</strong> &mdash; shields, directional influence, lag-canceling, grabs, wavedashing, and more
          </li>
          <li>
            <strong>Full GameCube controller support</strong> &mdash; play with the iconic platform fighter controller using the official
            adapter
          </li>
          <li>
            <strong>6 characters</strong> &mdash; all with different play styles, and more planned
          </li>
          <li>
            <strong>10 stage layouts</strong> &mdash; some staples, and some new
          </li>
        </ul>

        <h2>Comparisons to a familiar game</h2>
        <expandable-section aria-label="Show more details">
          <p>
            Uncompromising, in Antistatic's case, describes a commitment to building on familiar mechanics. If it's in Melee, it's
            probably here. For peace of mind, though, here's most of what to expect:
          </p>
          <ul>
            <li>Lag-canceling: 66% landing lag</li>
            <li>Wave dashing; air dodges send into free fall</li>
            <li>Moonwalking, charlie walking</li>
            <li>Ledge mechanics, including 100%+ animations</li>
            <li>DI/SDI/ASDI</li>
            <li>Grabs, throws</li>
            <li>Teching</li>
            <li>Shields, light shields, shield dropping</li>
            <li>Wall jumps</li>
            <li>Powershield, parry (see the guide below)</li>
            <li>V-canceling</li>
            <li>Crouch canceling (nerfed), ASDI down</li>
            <li>Aerials, charge moves, tilts, etc</li>
          </ul>
          <p>Some new mechanics include:</p>
          <ul>
            <li>Energy system: shields, specials, and holds consume energy; no more mashing</li>
            <li>
              Stale DI: certain moves that hit upward (up throws, etc) can be DIed further sideways as they become more stale
            </li>
            <li>
              Shield stun tweaked: lasts longer, but heavy shield stun transitions into light shield stun, which allows rolls and dodges
            </li>
          </ul>
        </expandable-section>

        <h2 id="guide">Guide</h2>
        <expandable-section aria-label="Show more details">
          <h3 id="energy">Energy</h3>
          <p>
            The biggest new feature is the <strong>Energy</strong> meter. Shields, specials, lag-canceling, and holding opponents all
            consume Energy.
          </p>
          <p>
            Each character has the same energy pool and regeneration speed. The last chunk of used energy, the ligher chunk on the
            meter, regenerates more quickly; it can help to space out big specials and avoid lag-canceling or using shield immediately
            after for the fastest regeneration potential.
          </p>
          <h3 id="familiar">Familiar</h3>
          <ul>
            <li>
              Lag-canceling: 50% landing lag, rounded up, plus one frame; costs energy to perform based on move's landing lag
            </li>
            <li>Wave dashing; air dodges send into free fall</li>
            <li>Moonwalking, charlie walking</li>
            <li>Ledge mechanics, including right-stick options and 100%+ animations</li>
            <li>DI/SDI/ASDI</li>
            <li>Grabs, throws</li>
            <li>Teching (wall, ground, ceiling)</li>
            <li>
              Shields, light shields, shield dropping, 20XXTE-style Axe method support, command shield drop if control stick is down and
              Special (B) is pressed
            </li>
            <li>Wall jumping</li>
            <li>Powershield, parry (see differences)</li>
            <li>All throws can be buffered with right-stick (not just down throw)</li>
            <li>Shield options can be buffered with right-stick</li>
            <li>V-canceling</li>
            <li>Throws use a set weight</li>
            <li>Crouch canceling (nerfed)</li>
          </ul>
          <h3 id="differences">Differences</h3>
          <ul>
            <li>Reverse aerial rush possible during initial dash, but not during run</li>
            <li>Initial dash can be canceled on first two frames</li>
            <li>Most specials require energy to use, based on the amount of impact they have</li>
            <li>
              Holding consumes energy, grabs cannot be mashed out of; pummeling accelerates energy use
            </li>
            <li>
              Certain moves that hit upward (up throws, etc) can be DIed further sideways as they become more stale
            </li>
            <li>
              Ledge invincibility begins later the more times the ledge is regrabbed; always ends on the same frame
            </li>
            <li>If grabs collide, they will cancel out</li>
            <li>
              If a grab trades with an attack, grab is released if hit is above a knockback threshold
            </li>
            <li>Powershield window is shorter</li>
            <li>
              Powershield still takes heavy shield stun but removes light stun, and consumes no energy
            </li>
            <li>
              Parry window after releasing shield: only provides enhanced super armor; take damage, but suffer no hit stun
            </li>
            <li>Powershield and parry both negate projectiles</li>
            <li>
              If hit during first few frames of a double jump, jump will be refreshed
            </li>
            <li>
              Dodge panic: pressing grab (Z) during air dodge will cancel movement into a stall that can grab ledge after a delay
            </li>
          </ul>
          <h3 id="shields-and-energy">Shields and Energy</h3>
          <ul>
            <li>Powered by energy meter</li>
            <li>More HP</li>
            <li>Regenerate slower</li>
            <li>When shield breaks, character crumples and falls to the ground</li>
            <li>Shield stun has two phases: heavy (full) stun, and light stun</li>
            <li>During light shield stun, character can spot dodge and roll</li>
            <li>
              Lag-canceling can be performed regardless of how much energy is available and will consume energy down to 0
            </li>
            <li>Specials cannot be used with insufficient available energy</li>
            <li>
              Holding consumes energy, and will release when energy reaches 0
            </li>
          </ul>
        </expandable-section>
      </article>

      <article slot="content">
        <h1 id="controllers">Controllers</h1>
        <p>
          Currently officially supports GameCube (via Wii U/Switch adapter in native mode), 360/XB1 (and compatible), PS4, and keyboard
        </p>
        <p>
          Button/key rebinding will be improved later in testing, as well as support for more controllers (e.g. Mayflash in PC mode,
          Switch Pro)
        </p>
        <p>
          To get GameCube controllers to work on Windows, Zadig can be used to install a generic driver; see{' '}
          <site-link href="https://wiki.dolphin-emu.org/index.php?title=How_to_use_the_Official_GameCube_Controller_Adapter_for_Wii_U_in_Dolphin">
            Dolphin's guide
          </site-link>{' '}
          for detailed instructions. Mac/Linux seem to work without hassle.
        </p>
        <p>
          If you can already use controllers in Dolphin, it should work in Antistatic too. In the future, this process might be an
          automated option
        </p>

        <h2 id="control-rebinding">Control rebinding</h2>
        <p>
          Basic controller rebinding is available in the in-game controls menu, but is early in development and only changes default
          controls. Keyboard rebinding still needs a lot of work.
        </p>

        <h2>Advanced</h2>
        <expandable-section>
          <p>
            Advanced control rebinding can be accessed through the console (bound to <kbd>`</kbd>; close with <kbd>escape</kbd>,{' '}
            <kbd>ctrl</kbd>+<kbd>d</kbd>, or <kbd>enter</kbd> with nothing entered).
          </p>
          <p>Basic help is provided by using <code>mapping</code> on its own:</p>
          <pre>
            <code>{`Usage: mapping [controller ID]
  Prints mapping for controller ID, as well as lists available button/axis actions
Usage: mapping [controller ID] bind [button/axis name] [button/axis action] [axis value (keyboard only)]
  Binds button/axis to action for controller ID
Usage: mapping [controller ID] save
  Saves current mapping as the default for controller's kind
Usage: mapping [controller ID] reset
  Resets mapping to original values for controller's kind
Usage: mapping [controller ID] default
  Resets mapping to current default for controller's kind

Usage: mapping list
  Lists all default and saved mappings
Usage: mapping list [controller kind]
  Lists all default and saved mappings for controller kind (e.g. standard, gcn_native)

See also: controller (all)
  Lists active controllers; if all is specified, includes all connected controllers`}</code>
          </pre>

          <h2>Examples</h2>
          <h3>Keyboard rebinding</h3>
          <p>
            Rebind the space bar to shield, and save as the default.
            <br />
            Note that all keys are case-sensitive right now; letters should be lowercase (e.g. <code>w</code>, not <code>W</code>), special
            keys should be capitalized (e.g. <code>RETURN</code>), and numbers are either e.g. <code>A_0</code> (number row) or{' '}
            <code>KP_0</code> (number pad)
          </p>
          <p>Press <kbd>`</kbd> to open the console.</p>
          <pre>
            <code>{`$ controller all      # list out all controllers
0. keyboard: keyboard
$ mapping 0 bind SPACE shield
$ mapping 0 save      # saves as the default keyboard layout
Saved mapping file`}</code>
          </pre>

          <h3>List of all SDL2 key names, until the rebinding UI is done...</h3>
          <expandable-section>
            <pre>
              <code>{`RETURN
ESCAPE
BACKSPACE
TAB
SPACE
EXCLAIM
QUOTEDBL
HASH
PERCENT
DOLLAR
AMPERSAND
QUOTE
LEFTPAREN
RIGHTPAREN
ASTERISK
PLUS
COMMA
MINUS
PERIOD
SLASH
A_0
A_1
A_2
A_3
A_4
A_5
A_6
A_7
A_8
A_9
COLON
SEMICOLON
LESS
EQUALS
GREATER
QUESTION
AT
LEFTBRACKET
BACKSLASH
RIGHTBRACKET
CARET
UNDERSCORE
BACKQUOTE
a
b
c
d
e
f
g
h
i
j
k
l
m
n
o
p
q
r
s
t
u
v
w
x
y
z
CAPSLOCK
F1
F2
F3
F4
F5
F6
F7
F8
F9
F10
F11
F12
PRINTSCREEN
SCROLLLOCK
PAUSE
INSERT
HOME
PAGEUP
DELETE
END
PAGEDOWN
RIGHT
LEFT
DOWN
UP
NUMLOCKCLEAR
KP_DIVIDE
KP_MULTIPLY
KP_MINUS
KP_PLUS
KP_ENTER
KP_1
KP_2
KP_3
KP_4
KP_5
KP_6
KP_7
KP_8
KP_9
KP_0
KP_PERIOD
APPLICATION
POWER
KP_EQUALS
F13
F14
F15
F16
F17
F18
F19
F20
F21
F22
F23
F24
EXECUTE
HELP
MENU
SELECT
STOP
AGAIN
UNDO
CUT
COPY
PASTE
FIND
MUTE
VOLUMEUP
VOLUMEDOWN
KP_COMMA
KP_EQUALSAS400
ALTERASE
SYSREQ
CANCEL
CLEAR
PRIOR
RETURN2
SEPARATOR
OUT
OPER
CLEARAGAIN
CRSEL
EXSEL
KP_00
KP_000
THOUSANDSSEPARATOR
DECIMALSEPARATOR
CURRENCYUNIT
CURRENCYSUBUNIT
KP_LEFTPAREN
KP_RIGHTPAREN
KP_LEFTBRACE
KP_RIGHTBRACE
KP_TAB
KP_BACKSPACE
KP_A
KP_B
KP_C
KP_D
KP_E
KP_F
KP_XOR
KP_POWER
KP_PERCENT
KP_LESS
KP_GREATER
KP_AMPERSAND
KP_DBLAMPERSAND
KP_VERTICALBAR
KP_DBLVERTICALBAR
KP_COLON
KP_HASH
KP_SPACE
KP_AT
KP_EXCLAM
KP_MEMSTORE
KP_MEMRECALL
KP_MEMCLEAR
KP_MEMADD
KP_MEMSUBTRACT
KP_MEMMULTIPLY
KP_MEMDIVIDE
KP_PLUSMINUS
KP_CLEAR
KP_CLEARENTRY
KP_BINARY
KP_OCTAL
KP_DECIMAL
KP_HEXADECIMAL
LCTRL
LSHIFT
LALT
LGUI
RCTRL
RSHIFT
RALT
RGUI
MODE
AUDIONEXT
AUDIOPREV
AUDIOSTOP
AUDIOPLAY
AUDIOMUTE
MEDIASELECT
WWW
MAIL
CALCULATOR
COMPUTER
AC_SEARCH
AC_HOME
AC_BACK
AC_FORWARD
AC_STOP
AC_REFRESH
AC_BOOKMARKS
BRIGHTNESSDOWN
BRIGHTNESSUP
DISPLAYSWITCH
KBDILLUMTOGGLE
KBDILLUMDOWN
KBDILLUMUP
EJECT
SLEEP
APP1
APP2
AUDIOREWIND
AUDIOFASTFORWARD`}</code>
            </pre>
          </expandable-section>

          <h3>XInput (e.g. XB1): rebind X to jump, B to special</h3>
          <p>Press <kbd>`</kbd> to open the console.</p>
          <pre>
            <code>{`$ controller all    # list out all controllers
0. keyboard: keyboard
1. XInput Controller: standard
$ mapping 1
  A attack
  B jump
  ...
$ mapping 1 bind X jump
$ mapping 1 bind B special
$ mapping 1 save
Saved mapping file`}</code>
          </pre>

          <h3>Reset all saved mappings to original</h3>
          <h4>Option 1, using <code>rm</code></h4>
          <p>Press <kbd>`</kbd> to open the console.</p>
          <pre>
            <code>{`$ rm ~/mapping/standard.default`}</code>
          </pre>

          <h4>Option 2, also reset controller</h4>
          <p>Press <kbd>`</kbd> to open the console.</p>
          <pre>
            <code>{`$ controller all    # list out all controllers
0. keyboard: keyboard
1. XInput Controller: standard
$ mapping 1 reset
Reset mapping
$ mapping 1 save
Saved mapping file`}</code>
          </pre>
        </expandable-section>
      </article>

      <article slot="content">
        <h1>Technical Summary</h1>

        <p>
          Antistatic has been in development since 2012 as an experimental homage to Super Smash Bros. Melee. It is built in a custom
          engine, written in TypeScript and C, with a 3D OpenGL graphics engine.
        </p>

        <p>
          Antistatic runs on top of Node.js, with the bulk written in TypeScript. Native portions are written in C, and run as a Node.js
          addon.
        </p>

        <div class="labeled_list" style={{ marginTop: '16px' }}>
          <div>Tech Stack</div>
          <ul class="flex_list flex_list__background" style={{ marginBottom: '8px' }}>
            <li>Main language: TypeScript</li>
            <li>Native code: C</li>
            <li>Server language: Go</li>
            <li>Server OS: Ubuntu</li>
            <li>Graphics: OpenGL</li>
            <li>Shaders: GLES</li>
          </ul>

          <ul class="flex_list flex_list__background">
            <li>Fully from-scratch graphics</li>
            <li>Custom physics engine</li>
            <li>Uncapped player count</li>
            <li>Latency-optimized rendering and input processing</li>
            <li>Font atlassing in C</li>
            <li>Delay-based P2P UDP netcode</li>
            <li>Custom build system: Bash, PowerShell</li>
          </ul>
        </div>

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

        <div class="labeled_list">
          <div>All Third-Party Dependencies</div>
          <ul class="flex_list flex_list__background">
            <li>
              Runtime: <site-link href="https://nodejs.org">Node.js</site-link>
            </li>
            <li>
              Window: <site-link href="https://www.libsdl.org/">SDL2</site-link>
            </li>
            <li>Gamepads: SDL2</li>
            <li>
              Fonts: <site-link href="https://github.com/freetype">Freetype</site-link>
            </li>
            <li>
              USB: <site-link href="https://github.com/libusb/libusb">LibUSB</site-link>
            </li>
            <li>
              Audio: <site-link href="https://github.com/kcat/openal-soft">OpenAL-soft</site-link>
            </li>
            <li>
              Container/codec: <site-link href="https://github.com/xiph/ogg">Ogg</site-link>/{' '}
              <site-link href="https://github.com/xiph/vorbis">Vorbis</site-link>
            </li>
            <li>
              Internationalization: <site-link href="https://projectfluent.org/">Fluent</site-link>
            </li>
            <li>
              Source control: <site-link href="https://git-scm.com/">git</site-link>
            </li>
            <li>
              <site-link href="https://github.com/nigels-com/glew">GLEW</site-link>
            </li>
            <li>
              <site-link href="https://github.com/nothings/stb">stb</site-link>
            </li>
            <li>
              <site-link href="https://github.com/TooTallNate/node-bindings">node-bindings</site-link>
            </li>
            <li>
              <site-link href="https://github.com/toji/gl-matrix">gl-matrix</site-link>
            </li>
            <li>
              <site-link href="https://github.com/andyearnshaw/Intl.js">intl</site-link>
            </li>
            <li>
              <site-link href="https://github.com/microsoft/node-jsonc-parser">jsonc-parser</site-link>
            </li>
            <li>
              <site-link href="https://github.com/sindresorhus/open">open</site-link>
            </li>
            <li>
              <site-link href="https://github.com/sindresorhus/os-locale">os-locale</site-link>
            </li>
            <li>
              <site-link href="https://github.com/ddopson/node-segfault-handler">node-segfault-handler</site-link>
            </li>
          </ul>
        </div>

        <expandable-section aria-label="Show more technical details">
          <h2>Even More Technical Details</h2>

          <p>
            Antistatic's matchmaking server is built in Go{' '}
            <site-link href="https://github.com/bluehexagons/antistatic-server">and is open-source</site-link>. I run it as a service
            on a headless Ubuntu server that I maintain, hosted by a popular VPS.
          </p>

          <h2>Graphics engine</h2>

          <p>
            The graphics engine is also split, with lower-level code written in C and OpenGL and much of the model manipulation, vertex
            rendering, and animation written in TypeScript. FreeType is used to render a dynamically-growing font atlas. Other libraries
            used include: GLEW for OpenGL bindings, SDL2 for window management, and SDL2_image for image loading.
          </p>

          <h2>Audio engine</h2>

          <p>
            The audio engine uses OpenAL-soft to interface with hardware. Files are OGGs, and libvorbistools is used to decode them.
          </p>

          <h2>Netcode</h2>

          <p>
            Netcode is peer-to-peer and delay-based, and some infrastructure work has been done to move toward adding rollback in the
            future. It runs on UDP, with higher-level messages encoded in JSON along with a binary stream of controller snapshots. The
            engine attempts to synchronize beginning times and input delay, poke through permissive firewalls, and gracefully handle
            dropped packets.
          </p>

          <h2>USB GCN Controller Adapter Support</h2>

          <p>
            To connect to the official Wii U/Switch GameCube controller adapter, I used LibUSB to directly communicate with the adapter
            over USB.
          </p>

          <h2>Internationalization</h2>

          <p>
            Internationalization is handled using Fluent, with the language files{' '}
            <site-link href="https://github.com/bluehexagons/antistatic-translations">available on GitHub</site-link>. Currently, only
            English and Spanish have had human review.
          </p>

          <h2>Build system</h2>

          <p>
            Antistatic's build system is mostly automated starting from a build-free git repo, pulling in and installing dependencies as
            well as building a few binaries. The process is a mix of PowerShell and Bash scripts.
          </p>

          <h2>History</h2>

          <p>
            Originally, Antistatic ran in a web browser. The limitations started adding up, and I made the decision to move to Electron
            and add a native add-on. When I couldn't squeeze the consistent performance and hardware support I felt I needed, I
            re-implemented more pieces in C and moved onto Node.js directly.
          </p>
        </expandable-section>
      </article>
    </content-area>

    <page-footer></page-footer>
  </>,
  app
);
