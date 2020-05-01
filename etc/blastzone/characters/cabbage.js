/* eslint-disable */
;(function () {
  'use strict'
  const evt = new Event('characterloaded')
  const hbColor = 20
  const grabColor = 101
  const ox = -75
  const oy = -90
  evt.characterData = () => ({
    name: 'Cabbage',
    hurtbubbles: [
      'lhand', 1, 2, // front-hand
      'rfoot', 0, 2, // front-foot
      'head', 3, 3, // head
      'body', 2, 2, // body
      'lfoot', 4, 2, // back-foot
      'rhand', 5, 2 // back-hand
    ],
    headbubble: 2,
    walkSpeed: 3,
    arcSpeed: 0.8,
    fallSpeed: 0.55,
    maxFallSpeed: 7.5,
    fastfallSpeed: 9,
    initialFallSpeed: 1,
    aerodynamics: 0.99,
    fallFriction: 0.99,
    carryMomentum: 0.5,
    arcWeight: 0.93,
    weight: 0.93,
    launchResistance: 5,
    flinchThreshold: 3,
    softland: 10,
    moonwalk: 3,
    airAcceleration: 0.2,
    airSpeed: 3,
    sdi: 5,
    asdi: 2,
    stunMod: 1,
    kbDecayMod: 1,
    stunBreak: 0.5,
    height: 55,
    width: 18,
    grabDirections: 4,
    reverseGrabRange: 45,
    forwardGrabRange: 50,
    grabStart: 10,
    grabHeight: 40,
    friction: 0.8,
    kbFriction: 0.9,
    slideFriction: 0.85,
    slideDecay: 1.2,
    shieldMultiplier: 0.6,
    shieldMinSize: 16,
    shieldGrowth: 20,
    shieldReset: 0.5,
    lightShieldGrowth: 16,
    shieldMobility: 18,
    powershieldSize: 25,
    shieldRegen: 0.0030,
    shieldDecay: 0.0020,
    shieldX: 2,
    shieldY: 31,
    shieldX2: 2,
    shieldY2: 29,
    landingAudio: 'landing',
    heavyLandingAudio: 'heavy_landing',
    lagCancelAudio: 'landing',
    /*backdrop: [
      [75 + ox,40 + oy],
      [75 + ox,37 + oy,70 + ox,25 + oy,50 + ox,25 + oy],
      [20 + ox,25 + oy,20 + ox,62.5 + oy,20 + ox,62.5 + oy],
      [20 + ox,80 + oy,40 + ox,102 + oy,75 + ox,120 + oy],
      [110 + ox,102 + oy,130 + ox,80 + oy,130 + ox,62.5 + oy],
      [130 + ox,62.5 + oy,130 + ox,25 + oy,100 + ox,25 + oy],
      [85 + ox,25 + oy,75 + ox,37 + oy,75 + ox,40 + oy]
    ],
    backdropFollow: 2,*/
    animations: [
      {
        name: 'airborne-cancel',
        cancellable: '',
        noCancel: 'platformdrop',
        type: 4,
        iasa: 7,
        keyframes: [
          {
            interpolate: true,
            duration: 6,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 10, 7, 1,
              0, 15, 5, 1,
              2, 25, 25, 1,
              -2, 4, 4, 1,
              5, 10, 7, 1
            ]
          },
          {
            duration: 5,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 10, 7, 1,
              0, 15, 5, 1,
              2, 25, 25, 1,
              -2, 4, 4, 1,
              5, 10, 7, 1
            ]
          },
          {
            duration: 4,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'idle',
        cancellable: 'all',
        cancel: 'idle',
        handler: 'walk',
        type: 0,
        keyframes: [
          {
            duration: 6,
            interpolate: true,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          },
          {
            duration: 20,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          },
          {
            duration: 20,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20.5, 7, 1,
              0, 15, 5, 1,
              3.5, 31, 25, 1,
              -2, 4, 4, 1,
              5, 19.5, 7, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'recoil',
        cancellable: '',
        type: 4,
        keyframes: [
          {
            duration: 8,
            interpolate: true,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          },
          {
            duration: 8,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20.5, 7, 1,
              0, 15, 5, 1,
              3.5, 31, 25, 1,
              -2, 4, 4, 1,
              5, 19.5, 7, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'tipping',
        cancellable: 'all',
        transition: 'tipping',
        cancel: 'tipping',
        noCancel: 'tipping.idle.walk',
        type: 0,
        keyframes: [
          {
            interpolate: true,
            duration: 10,
            hurtbubbles: [
              0, 4, 4, 1,
              -10, 25, 7, 1,
              5, 15, 5, 1,
              15, 25, 25, 1,
              -2, 4, 4, 1,
              -13, 25, 7, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              0, 4, 4, 1,
              -10, 25, 7, 1,
              5, 15, 5, 1,
              15, 25, 25, 1,
              -2, 4, 4, 1,
              -13, 25, 7, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              0, 4, 4, 1,
              10, 22, 7, 1,
              -5, 15, 5, 1,
              -10, 35, 25, 1,
              -2, 4, 4, 1,
              5, 18, 7, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              0, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'dtaunt',
        cancellable: '',
        transition: 'trip',
        slid: 'cancel',
        type: 4,
        keyframes: [
          {
            duration: 2,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          },
          {
            duration: 2,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 22, 7, 1,
              0, 15, 5, 1,
              6, 35, 25, 1,
              -2, 4, 4, 1,
              5, 18, 7, 1
            ]
          }
        ]
      },
      {
        name: 'staunt',
        cancellable: '',
        slid: 'cancel',
        type: 4,
        keyframes: [
          {
            duration: 12,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          },
          {
            duration: 20,
            hurtbubbles: [
              5, 4, 8, 1,
              10, 20, 9, 1,
              0, 15, 4, 1,
              2, 30, 30, 1,
              -2, 4, 43, 1,
              5, 20, 2, 1
            ]
          },
          {
            duration: 20,
            hurtbubbles: [
              -15, 4, 2, 1,
              -5, 45, 30, 1,
              0, 15, 3, 1,
              0, 35, 8, 1,
              15, 4, 40, 1,
              35, 18, 15, 1
            ]
          },
          {
            duration: 20,
            hurtbubbles: [
              5, 4, 25, 1,
              10, 20, 13, 1,
              0, 15, 4, 1,
              2, 30, 42, 1,
              -2, 4, 1, 1,
              5, 20, 22, 1
            ]
          },
          {
            duration: 6,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'utaunt',
        cancellable: '',
        slid: 'cancel',
        type: 4,
        keyframes: [
          {
            duration: 12,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          },
          {
            duration: 20,
            hurtbubbles: [
              -15, 4, 4, 1,
              -35, 18, 7, 1,
              0, 15, 5, 1,
              0, 35, 25, 1,
              15, 4, 4, 1,
              35, 18, 7, 1
            ]
          },
          {
            duration: 20,
            hurtbubbles: [
              -15, 4, 4, 1,
              -5, 45, 7, 1,
              0, 15, 5, 1,
              0, 35, 25, 1,
              15, 4, 4, 1,
              35, 18, 7, 1
            ]
          },
          {
            duration: 20,
            hurtbubbles: [
              -15, 4, 4, 1,
              -5, 45, 7, 1,
              0, 15, 5, 1,
              0, 35, 25, 1,
              15, 4, 4, 1,
              35, 18, 7, 1
            ]
          },
          {
            duration: 6,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'respawn',
        cancellable: '',
        type: 4,
        gravity: 0,
        start: 'respawn',
        nodi: true,
        noFastfall: true,
        transition: 'waiting',
        interrupted: 'respawn',
        keyframes: [
          {
            duration: 90,
            hurtbubbles: [
              0, 0, 0, 5,
              0, 0, 0, 5,
              0, 0, 0, 5,
              0, 0, 0, 5,
              0, 0, 0, 5,
              0, 0, 0, 5
            ]
          },
          {
            duration: 60,
            hurtbubbles: [
              5, 4, 4, 5,
              10, 20, 7, 5,
              0, 15, 5, 5,
              2, 30, 25, 5,
              -2, 4, 4, 5,
              5, 20, 7, 5
            ]
          }
        ]
      },
      {
        name: 'waiting',
        cancellable: 'all',
        type: 4,
        gravity: 0,
        nodi: true,
        noFastfall: true,
        start: 'respawn',
        handler: 'respawn',
        end: 'respawn',
        interrupted: 'respawn',
        keyframes: [
          {
            duration: 180,
            hurtbubbles: [
              5, 4, 4, 5,
              10, 20, 7, 5,
              0, 15, 5, 5,
              2, 30, 25, 5,
              -2, 4, 4, 5,
              5, 20, 7, 5
            ]
          },
          {
            duration: 180,
            hurtbubbles: [
              5, 4, 4, 5,
              10, 20, 7, 5,
              0, 15, 5, 5,
              2, 30, 25, 5,
              -2, 4, 4, 5,
              5, 20, 7, 5
            ]
          },
          {
            duration: 180,
            hurtbubbles: [
              5, 4, 4, 5,
              10, 20, 7, 5,
              0, 15, 5, 5,
              2, 30, 25, 5,
              -2, 4, 4, 5,
              5, 20, 7, 5
            ]
          }
        ]
      },
      {
        name: 'bounced',
        cancellable: '',
        cancel: 'fall',
        starKO: true,
        nodi: true,
        techable: true,
        noFastfall: true,
        type: 4,
        handler: 'stunned',
        transition: 'stunned',
        keyframes: [
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 42, 7, 1,
              0, 15, 5, 1,
              6, 35, 25, 1,
              -2, 4, 4, 1,
              5, 38, 7, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 40, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 40, 7, 1
            ]
          }
        ]
      },
      
      {
        name: 'weakairhit',
        cancellable: '',
        starKO: true,
        nodi: true,
        noFastfall: true,
        type: 4,
        handler: 'weakstunned',
        transition: 'weakstunned',
        keyframes: [
          {
            duration: 5,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          },
          {
            duration: 5,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 42, 7, 1,
              0, 15, 5, 1,
              6, 35, 25, 1,
              -2, 4, 4, 1,
              5, 38, 7, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 40, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 40, 7, 1
            ]
          }
        ]
      },
      {
        name: 'airhit',
        cancellable: '',
        cancel: 'fall',
        starKO: true,
        nodi: true,
        techable: true,
        noFastfall: true,
        type: 4,
        handler: 'stunned',
        transition: 'stunned',
        bufferable: 'airjump0',
        buffertime: 20,
        keyframes: [
          {
            duration: 5,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          },
          {
            duration: 5,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 42, 7, 1,
              0, 15, 5, 1,
              6, 35, 25, 1,
              -2, 4, 4, 1,
              5, 38, 7, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 40, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 40, 7, 1
            ]
          }
        ]
      },
      {
        name: 'jugglehit',
        cancellable: '',
        cancel: 'fall',
        starKO: true,
        nodi: true,
        techable: true,
        noFastfall: true,
        type: 4,
        handler: 'stunned',
        transition: 'jugglestunned',
        bufferable: 'airjump0',
        buffertime: 20,
        keyframes: [
          {
            duration: 5,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          },
          {
            duration: 5,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 42, 7, 1,
              0, 15, 5, 1,
              6, 35, 25, 1,
              -2, 4, 4, 1,
              5, 38, 7, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 40, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 40, 7, 1
            ]
          }
        ]
      },
      {
        name: 'meteorhit',
        cancellable: '',
        cancel: 'fall',
        starKO: true,
        nodi: true,
        techable: true,
        noFastfall: true,
        type: 4,
        handler: 'meteor',
        canceled: 'meteor',
        transition: 'meteor',
        bufferable: 'airjump0',
        buffertime: 20,
        keyframes: [
          {
            duration: 5,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          },
          {
            duration: 5,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 42, 7, 1,
              0, 15, 5, 1,
              6, 35, 25, 1,
              -2, 4, 4, 1,
              5, 38, 7, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 40, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 40, 7, 1
            ]
          }
        ]
      },
      {
        name: 'weakhit',
        cancellable: '',
        cancel: 'fall',
        starKO: true,
        noFastfall: true,
        nodi: true,
        type: 4,
        slid: 'tumble',
        handler: 'weakstumble',
        transition: 'weakstumble',
        keyframes: [
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 42, 7, 1,
              0, 15, 5, 1,
              6, 35, 25, 1,
              -2, 4, 4, 1,
              5, 38, 7, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 40, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 40, 7, 1
            ]
          }
        ]
      },
      {
        name: 'hit',
        cancellable: '',
        cancel: 'fall',
        starKO: true,
        noFastfall: true,
        techable: true,
        nodi: true,
        type: 4,
        slid: 'tumble',
        handler: 'stumble',
        transition: 'stumble',
        keyframes: [
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 42, 7, 1,
              0, 15, 5, 1,
              6, 35, 25, 1,
              -2, 4, 4, 1,
              5, 38, 7, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 40, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 40, 7, 1
            ]
          }
        ]
      },
      {
        name: 'weakstunned',
        cancellable: '',
        cancel: 'weakstumble',
        starKO: true,
        noFastfall: true,
        type: 4,
        handler: 'weakstunned',
        nodi: true,
        transition: 'weakstunned',
        keyframes: [
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 42, 7, 1,
              0, 15, 5, 1,
              6, 35, 25, 1,
              -2, 4, 4, 1,
              5, 38, 7, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 42, 7, 1,
              0, 15, 5, 1,
              6, 35, 25, 1,
              -2, 4, 4, 1,
              5, 38, 7, 1
            ]
          }
        ]
      },
      {
        name: 'stunned',
        cancellable: '',
        cancel: 'fall',
        starKO: true,
        techable: true,
        noFastfall: true,
        type: 4,
        handler: 'stunned',
        nodi: true,
        transition: 'stunned',
        keyframes: [
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 42, 7, 1,
              0, 15, 5, 1,
              6, 35, 25, 1,
              -2, 4, 4, 1,
              5, 38, 7, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 42, 7, 1,
              0, 15, 5, 1,
              6, 35, 25, 1,
              -2, 4, 4, 1,
              5, 38, 7, 1
            ]
          }
        ]
      },
      {
        name: 'jugglestunned',
        cancellable: '',
        cancel: 'fall',
        starKO: true,
        techable: true,
        noFastfall: true,
        type: 4,
        handler: 'stunned',
        nodi: true,
        transition: 'jugglestunned',
        keyframes: [
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 42, 7, 1,
              0, 15, 5, 1,
              6, 35, 25, 1,
              -2, 4, 4, 1,
              5, 38, 7, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 42, 7, 1,
              0, 15, 5, 1,
              6, 35, 25, 1,
              -2, 4, 4, 1,
              5, 38, 7, 1
            ]
          }
        ]
      },
      {
        name: 'meteor',
        cancellable: 'airupspecial.airjump0.airjump1.airjump2',
        cancel: 'fall',
        starKO: true,
        techable: true,
        noFastfall: true,
        type: 4,
        handler: 'meteor',
        canceled: 'meteor',
        nodi: true,
        transition: 'meteor',
        keyframes: [
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 42, 7, 1,
              0, 15, 5, 1,
              6, 35, 25, 1,
              -2, 4, 4, 1,
              5, 38, 7, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 42, 7, 1,
              0, 15, 5, 1,
              6, 35, 25, 1,
              -2, 4, 4, 1,
              5, 38, 7, 1
            ]
          }
        ]
      },
      {
        name: 'weakstumble',
        cancellable: '',
        starKO: true,
        type: 4,
        slid: 'tumble',
        noFastfall: true,
        handler: 'weakstumble',
        transition: 'weakstumble',
        keyframes: [
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 42, 7, 1,
              0, 15, 5, 1,
              6, 35, 25, 1,
              -2, 4, 4, 1,
              5, 38, 7, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 42, 7, 1,
              0, 15, 5, 1,
              6, 35, 25, 1,
              -2, 4, 4, 1,
              5, 38, 7, 1
            ]
          }
        ]
      },
      {
        name: 'stumble',
        cancellable: '',
        starKO: true,
        type: 4,
        slid: 'stunned',
        noFastfall: true,
        handler: 'stumble',
        transition: 'stumble',
        keyframes: [
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 42, 7, 1,
              0, 15, 5, 1,
              6, 35, 25, 1,
              -2, 4, 4, 1,
              5, 38, 7, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 42, 7, 1,
              0, 15, 5, 1,
              6, 35, 25, 1,
              -2, 4, 4, 1,
              5, 38, 7, 1
            ]
          }
        ]
      },
      {
        name: 'tumble',
        cancel: 'fall',
        cancellable: 'all',
        noCancel: 'airdodge',
        noFastfall: true,
        handler: 'tumble',
        transition: 'tumble',
        techable: true,
        type: 4,
        grabDirections: 4 | 64,
        keyframes: [
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 42, 7, 1,
              0, 15, 5, 1,
              6, 35, 25, 1,
              -2, 4, 4, 1,
              5, 38, 7, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 22, 7, 1,
              0, 15, 5, 1,
              6, 35, 25, 1,
              -2, 4, 4, 1,
              5, 18, 7, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 42, 7, 1,
              0, 15, 5, 1,
              6, 35, 25, 1,
              -2, 4, 4, 1,
              5, 38, 7, 1
            ]
          }
        ]
      },
      {
        name: 'platformdrop',
        cancellable: 'dsmash.dtilt.downspecial',
        type: 4,
        platformDroppable: true,
        transition: 'airborne',
        buffer: 'all',
        speed: 0,
        end: 'platformdrop',
        keyframes: [
          {
            duration: 4,
            interpolate: true,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 10, 7, 1,
              0, 15, 5, 1,
              2, 25, 25, 1,
              -2, 4, 4, 1,
              5, 10, 7, 1
            ]
          },
          {
            duration: 4,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 10, 7, 1,
              0, 15, 5, 1,
              2, 25, 25, 1,
              -2, 4, 4, 1,
              5, 10, 7, 1
            ]
          }
        ]
      },
      {
        name: 'crouch',
        cancellable: 'all',
        noCancel: 'walk.walkpivot.stride.dash.dashpivot.crouched',
        type: 0,
        handler: 'crouch',
        transition: 'crouched',
        keyframes: [
          {
            duration: 4,
            interpolate: true,
            hurtbubbles: [
              5, 4, 4, 1,
              25, 7, 7, 1,
              0, 15, 5, 1,
              2, 25, 25, 1,
              -2, 4, 4, 1,
              -5, 7, 7, 1
            ]
          },
          {
            duration: 3,
            hurtbubbles: [
              5, 4, 4, 1,
              25, 7, 7, 1,
              0, 15, 5, 1,
              2, 25, 25, 1,
              -2, 4, 4, 1,
              -5, 7, 7, 1
            ]
          }
        ]
      },
      {
        name: 'crouched',
        cancellable: 'all',
        noCancel: 'walk.stride',
        type: 0,
        handler: 'crouch',
        transition: 'crouched',
        keyframes: [
          {
            duration: 30,
            hurtbubbles: [
              5, 4, 4, 1,
              25, 7, 7, 1,
              0, 15, 5, 1,
              2, 25, 25, 1,
              -2, 4, 4, 1,
              -5, 7, 7, 1
            ]
          },
          {
            duration: 30,
            hurtbubbles: [
              5, 4, 4, 1,
              25, 7, 7, 1,
              0, 15, 5, 1,
              6, 25, 25, 1,
              -2, 4, 4, 1,
              -7, 7, 7, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              25, 7, 7, 1,
              0, 15, 5, 1,
              2, 25, 25, 1,
              -2, 4, 4, 1,
              -4, 7, 7, 1
            ]
          }
        ]
      },
      {
        name: 'stand',
        cancellable: 'all',
        noCancel: 'walk.walkpivot.stride.dash',
        transition: 'idle',
        type: 0,
        keyframes: [
          {
            duration: 5,
            interpolate: true,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          },
          {
            duration: 3,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'reset',
        cancellable: '',
        transition: 'idle',
        ungrabbable: true,
        type: 0,
        keyframes: [
          {
            duration: 30,
            interpolate: true,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 10, 7, 1,
              0, 15, 5, 1,
              2, 25, 25, 1,
              -2, 4, 4, 1,
              5, 10, 7, 1
            ]
          },
          {
            duration: 3,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'trip',
        cancellable: '',
        type: 4,
        start: 'stop',
        slideFriction: 0.95,
        transition: 'fallen',
        keyframes: [
          {
            duration: 30,
            slide: 4,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          },
          {
            duration: 20,
            hurtbubbles: [
              5, 4, 4, 1,
              30, 20, 7, 1,
              0, 15, 5, 1,
              6, 30, 25, 1,
              -2, 4, 4, 1,
              30, 20, 7, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              -8, 4, 4, 1,
              10, 7, 7, 1,
              -5, 15, 5, 1,
              6, 25, 25, 1,
              -20, 4, 4, 1,
              5, 7, 7, 1
            ]
          }
        ]
      },
      {
        name: 'fall',
        cancellable: '',
        type: 4,
        slid: 'tumble',
        ungrabbable: true,
        transition: 'fallen',
        keyframes: [
          {
            interpolate: true,
            duration: 8,
            effect: 'hop',
            hurtbubbles: [
              -8, 4, 4, 1,
              10, 7, 7, 1,
              -5, 15, 5, 1,
              6, 25, 25, 1,
              -20, 4, 4, 1,
              5, 7, 7, 1
            ]
          },
          {
            duration: 8,
            hurtbubbles: [
              -8, 9, 4, 1,
              10, 12, 7, 1,
              -5, 20, 5, 1,
              6, 30, 25, 1,
              -20, 9, 4, 1,
              5, 12, 7, 1
            ]
          },
          {
            duration: 7,
            hurtbubbles: [
              -8, 9, 4, 1,
              10, 12, 7, 1,
              -5, 20, 5, 1,
              6, 30, 25, 1,
              -20, 9, 4, 1,
              5, 12, 7, 1
            ]
          },
          {
            duration: 1,
            effect: 'hop',
            hurtbubbles: [
              -8, 4, 4, 1,
              10, 7, 7, 1,
              -5, 15, 5, 1,
              6, 25, 25, 1,
              -20, 4, 4, 1,
              5, 7, 7, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              -8, 4, 4, 1,
              10, 7, 7, 1,
              -5, 15, 5, 1,
              6, 25, 25, 1,
              -20, 4, 4, 1,
              5, 7, 7, 1
            ]
          }
        ]
      },
      {
        name: 'fallen',
        cancellable: 'getup, rollback, rollforth, getup0',
        type: 4,
        slid: 'tumble',
        ungrabbable: true,
        transition: 'fallen',
        handler: 'fallen',
        keyframes: [
          {
            interpolate: true,
            duration: 10,
            hurtbubbles: [
              -8, 4, 4, 1,
              -20, 7, 7, 1,
              -5, 15, 5, 1,
              6, 25, 25, 1,
              -24, 4, 4, 1,
              20, 7, 7, 1
            ]
          },
          {
            duration: 30
          },
          {
            duration: 10,
            hurtbubbles: [
              -8, 4, 4, 1,
              -20, 7, 7, 1,
              -5, 15, 5, 1,
              6, 25, 25, 1,
              -24, 4, 4, 1,
              20, 7, 7, 1
            ]
          }
        ]
      },
      {
        name: 'getup',
        cancellable: '',
        ungrabbable: true,
        type: 4,
        keyframes: [
          {
            duration: 23,
            interpolate: true,
            hurtbubbles: [
              5, 4, 4, 5,
              10, 10, 7, 5,
              0, 15, 5, 5,
              6, 27, 25, 5,
              -2, 4, 4, 5,
              5, 7, 7, 5
            ]
          },
          {
            duration: 7,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 10, 7, 1,
              0, 15, 5, 1,
              6, 27, 25, 1,
              -2, 4, 4, 1,
              5, 7, 7, 1
            ]
          },
          {
            duration: 6,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'getup0',
        cancellable: '',
        ungrabbable: true,
        type: 1,
        keyframes: [
          {
            duration: 9,
            interpolate: true,
            hurtbubbles: [
              -5, 4, 4, 5,
              -10, 20, 7, 5,
              0, 15, 5, 5,
              -2, 25, 25, 5,
              2, 4, 4, 5,
              -5, 20, 7, 5
            ]
          },
          {
            duration: 7,
            hurtbubbles: [
              -5, 4, 4, 5,
              -10, 20, 7, 5,
              0, 15, 5, 5,
              -2, 25, 25, 5,
              2, 4, 4, 5,
              -5, 20, 7, 5
            ]
          },
          {
            duration: 2,
            hurtbubbles: [
              -5, 4, 4, 5,
              -10, 20, 7, 5,
              0, 15, 5, 5,
              -2, 25, 25, 5,
              2, 4, 4, 5,
              10, 20, 7, 5
            ],
            audio: 'shortwhiff',
            hitbubbles: [
              {
                type: 'ground',
                x: -30,
                y: 20,
                radius: 23,
                damage: 7.5,
                knockback: 9,
                growth: 7,
                sakurai: true
              },
              {
                type: 'ground',
                x: 30,
                y: 20,
                radius: 23,
                damage: 7.5,
                knockback: 9,
                growth: 7,
                sakurai: true
              }
            ]
          },
          {
            duration: 31,
            hurtbubbles: [
              5, 4, 4, 1,
              30, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              -30, 20, 7, 1
            ]
          },
          {
            duration: 3,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'tech',
        cancellable: '',
        type: 4,
        ungrabbable: true,
        keyframes: [
          {
            interpolate: true,
            duration: 8,
            audio: 'tech',
            hurtbubbles: [
              5, 4, 4, 5,
              10, 7, 7, 5,
              0, 15, 5, 5,
              2, 25, 25, 5,
              -2, 4, 4, 5,
              5, 7, 7, 5
            ]
          },
          {
            duration: 12,
            hurtbubbles: [
              5, 4, 4, 5,
              10, 7, 7, 5,
              0, 15, 5, 5,
              2, 25, 25, 5,
              -2, 4, 4, 5,
              5, 7, 7, 5
            ]
          },
          {
            duration: 4,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 7, 7, 1,
              0, 15, 5, 1,
              2, 25, 25, 1,
              -2, 4, 4, 1,
              5, 7, 7, 1
            ]
          },
          {
            duration: 4,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'walltech',
        cancellable: '',
        gravity: 0,
        type: 4,
        ungrabbable: true,
        keyframes: [
          {
            interpolate: true,
            duration: 8,
            dx: 2,
            hurtbubbles: [
              5, 4, 4, 5,
              10, 7, 7, 5,
              0, 15, 5, 5,
              2, 25, 25, 5,
              -2, 4, 4, 5,
              5, 7, 7, 5
            ]
          },
          {
            duration: 15,
            hurtbubbles: [
              5, 4, 4, 5,
              10, 7, 7, 5,
              0, 15, 5, 5,
              2, 25, 25, 5,
              -2, 4, 4, 5,
              5, 7, 7, 5
            ]
          },
          {
            duration: 6,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 7, 7, 1,
              0, 15, 5, 1,
              2, 25, 25, 1,
              -2, 4, 4, 1,
              5, 7, 7, 1
            ]
          },
          {
            duration: 4,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'rooftech',
        cancellable: '',
        gravity: 0,
        type: 4,
        ungrabbable: true,
        keyframes: [
          {
            interpolate: true,
            duration: 8,
            dx: 2,
            hurtbubbles: [
              5, 4, 4, 5,
              10, 7, 7, 5,
              0, 15, 5, 5,
              2, 25, 25, 5,
              -2, 4, 4, 5,
              5, 7, 7, 5
            ]
          },
          {
            duration: 9,
            hurtbubbles: [
              5, 4, 4, 5,
              10, 7, 7, 5,
              0, 15, 5, 5,
              2, 25, 25, 5,
              -2, 4, 4, 5,
              5, 7, 7, 5
            ]
          },
          {
            duration: 9,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 7, 7, 1,
              0, 15, 5, 1,
              2, 25, 25, 1,
              -2, 4, 4, 1,
              5, 7, 7, 1
            ]
          },
          {
            duration: 4,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'techforward',
        cancellable: '',
        type: 4,
        friction: 0.8,
        ungrabbable: true,
        slid: 'stop',
        keyframes: [
          {
            duration: 11,
            audio: 'tech',
            hurtbubbles: [
              5, 4, 4, 5,
              5, 35, 7, 5,
              0, 15, 5, 5,
              2, 30, 25, 5,
              -2, 4, 4, 5,
              0, 30, 7, 5
            ]
          },
          {
            duration: 9,
            speed: 4.5,
            hurtbubbles: [
              5, 4, 4, 5,
              5, 35, 7, 5,
              0, 15, 5, 5,
              2, 30, 25, 5,
              -2, 4, 4, 5,
              0, 30, 7, 5
            ]
          },
          {
            duration: 20,
            hurtbubbles: [
              5, 4, 4, 1,
              5, 35, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              0, 30, 7, 1
            ]
          },
          {
            duration: 1,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'techbackward',
        cancellable: '',
        type: 4,
        friction: 0.8,
        ungrabbable: true,
        slid: 'stop',
        keyframes: [
          {
            duration: 11,
            audio: 'tech',
            hurtbubbles: [
              5, 4, 4, 5,
              5, 35, 7, 5,
              0, 15, 5, 5,
              2, 30, 25, 5,
              -2, 4, 4, 5,
              0, 30, 7, 5
            ]
          },
          {
            duration: 9,
            speed: -4.5,
            hurtbubbles: [
              5, 4, 4, 5,
              5, 35, 7, 5,
              0, 15, 5, 5,
              2, 30, 25, 5,
              -2, 4, 4, 5,
              0, 30, 7, 5
            ]
          },
          {
            duration: 20,
            hurtbubbles: [
              5, 4, 4, 1,
              5, 35, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              0, 30, 7, 1
            ]
          },
          {
            duration: 1,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'airborne',
        cancellable: 'all',
        cancel: 'airborne-cancel',
        type: 0,
        platformDroppable: true,
        grabDirections: 4 | 64,
        keyframes: [
          {
            duration: 10,
            hurtbubbles: [
              5, -4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, -4, 4, 1,
              5, 20, 7, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, -4, 4, 1,
              10, 22, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, -4, 4, 1,
              5, 15, 7, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, -4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, -4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'airborne-slid',
        cancellable: 'all',
        cancel: 'airborne-cancel',
        type: 0,
        platformDroppable: true,
        grabDirections: 4 | 64,
        keyframes: [
          {
            duration: 15,
            hurtbubbles: [
              5, -4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, -4, 4, 1,
              5, 20, 7, 1
            ]
          },
          {
            duration: 15,
            hurtbubbles: [
              5, -4, 4, 1,
              10, 22, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, -4, 4, 1,
              5, 15, 7, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, -4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, -4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'airborne-nofastfall',
        cancellable: 'all',
        cancel: 'airborne-cancel',
        noFastfall: true,
        transition: 'airborne-nofastfall',
        type: 0,
        platformDroppable: true,
        keyframes: [
          {
            duration: 10,
            hurtbubbles: [
              5, -4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, -4, 4, 1,
              5, 20, 7, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, -4, 4, 1,
              10, 22, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, -4, 4, 1,
              5, 15, 7, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, -4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, -4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'helpless',
        cancellable: '',
        transition: 'helpless',
        type: 4,
        helpless: true,
        platformDroppable: true,
        grabDirections: 4 | 64,
        handler: 'helpless',
        keyframes: [
          {
            duration: 20,
            hurtbubbles: [
              5, -4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, -4, 4, 1,
              5, 20, 7, 1
            ]
          },
          {
            duration: 20,
            hurtbubbles: [
              5, 34, 4, 1,
              10, 10, 7, 1,
              0, 15, 5, 1,
              2, 20, 25, 1,
              -2, 34, 4, 1,
              5, 10, 7, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, -4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, -4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'ledgegrab',
        cancellable: '',
        transition: 'ledgehang',
        disableIK: true,
        type: 4,
        xOffset: -10,
        yOffset: 60,
        refresh: true,
        pause: 8,
        ungrabbable: true,
        start: 'ledgegrab',
        interrupted: 'ledgehit',
        keyframes: [
          {
            duration: 7,
            hurtbubbles: [
              -5, -54, 4, 1,
              0, -7, 7, 1,
              -10, -35, 5, 1,
              -8, -20, 25, 1,
              -12, -54, 4, 1,
              -5, -7, 7, 1
            ]
          },
          {
            duration: 10,
            handler: 'ledgehang',
            hurtbubbles: [
              -5, -54, 4, 1,
              0, -7, 7, 1,
              -10, -35, 5, 1,
              -8, -20, 25, 1,
              -12, -54, 4, 1,
              -5, -7, 7, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              -5, -54, 4, 1,
              0, -7, 7, 1,
              -10, -35, 5, 1,
              -8, -20, 25, 1,
              -12, -54, 4, 1,
              -5, -7, 7, 1
            ]
          }
        ]
      },
      {
        name: 'ledgedrop',
        cancellable: 'all',
        transition: 'airborne',
        disableIK: true,
        type: 4,
        keyframes: [
          {
            duration: 10,
            hurtbubbles: [
              5, -4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, -4, 4, 1,
              5, 20, 7, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, -4, 4, 1,
              10, 22, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, -4, 4, 1,
              5, 15, 7, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, -4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, -4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'ledgehang',
        cancellable: '',
        transition: 'ledgehang',
        disableIK: true,
        type: 4,
        xOffset: -10,
        yOffset: 60,
        handler: 'ledgehang',
        ungrabbable: true,
        interrupted: 'ledgehit',
        keyframes: [
          {
            duration: 20,
            hurtbubbles: [
              -5, -54, 4, 1,
              0, -7, 7, 1,
              -10, -35, 5, 1,
              -8, -20, 25, 1,
              -12, -54, 4, 1,
              -5, -7, 7, 1
            ]
          },
          {
            duration: 20,
            hurtbubbles: [
              -5, -54, 4, 1,
              0, -7, 7, 1,
              -10, -35, 5, 1,
              -8, -20, 25, 1,
              -12, -54, 4, 1,
              -5, -7, 7, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              -5, -54, 4, 1,
              0, -7, 7, 1,
              -10, -35, 5, 1,
              -8, -20, 25, 1,
              -12, -54, 4, 1,
              -5, -7, 7, 1
            ]
          }
        ]
      },
      {
        name: 'ledgeattack0',
        cancellable: '',
        transition: 'idle',
        disableIK: true,
        type: 1,
        xOffset: -10,
        yOffset: 80,
        ungrabbable: true,
        keyframes: [
          {
            duration: 10,
            hurtbubbles: [
              -5, -54, 4, 5,
              0, -7, 7, 5,
              -10, -35, 5, 5,
              -8, -20, 25, 5,
              -12, -54, 4, 5,
              -5, -7, 7, 5
            ]
          },
          {
            duration: 8,
            hurtbubbles: [
              -5, 4, 4, 5,
              0, 20, 7, 5,
              -10, 15, 5, 5,
              -8, 30, 25, 5,
              -12, 4, 4, 5,
              -5, 20, 7, 5
            ]
          },
          {
            duration: 4,
            dx: 4,
          },
          {
            duration: 3,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          },
          {
            duration: 5,
            hurtbubbles: [
              5, 4, 4, 1,
              30, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              0, 20, 7, 1
            ],
            audio: 'shortwhiff',
            hitbubbles: [
              {
                type: 'ground',
                x: 30,
                y: 20,
                radius: 23,
                damage: 6,
                knockback: 8,
                growth: 7,
                sakurai: true
              }
            ]
          },
          {
            duration: 25,
            hurtbubbles: [
              5, 4, 4, 1,
              30, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              0, 20, 7, 1
            ]
          },
          {
            duration: 3,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'ledgeattack100',
        cancellable: '',
        transition: 'idle',
        disableIK: true,
        type: 1,
        xOffset: -10,
        yOffset: 80,
        ungrabbable: true,
        keyframes: [
          {
            duration: 18,
            hurtbubbles: [
              -5, -54, 4, 5,
              0, -7, 7, 5,
              -10, -35, 5, 5,
              -8, -20, 25, 5,
              -12, -54, 4, 5,
              -5, -7, 7, 5
            ]
          },
          {
            duration: 20,
            hurtbubbles: [
              -5, 4, 4, 5,
              0, 20, 7, 5,
              -10, 15, 5, 5,
              -8, 30, 25, 5,
              -12, 4, 4, 5,
              -5, 20, 7, 5
            ]
          },
          {
            duration: 15,
            dx: 4,
          },
          {
            duration: 5,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          },
          {
            duration: 5,
            hurtbubbles: [
              5, 4, 4, 1,
              30, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              0, 20, 7, 1
            ],
            audio: 'shortwhiff',
            hitbubbles: [
              {
                type: 'ground',
                x: 30,
                y: 20,
                radius: 23,
                damage: 6,
                knockback: 8,
                growth: 7,
                sakurai: true
              }
            ]
          },
          {
            duration: 25,
            hurtbubbles: [
              5, 4, 4, 1,
              30, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              0, 20, 7, 1
            ]
          },
          {
            duration: 3,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'ledgestand0',
        cancellable: '',
        transition: 'idle',
        disableIK: true,
        type: 4,
        xOffset: -10,
        yOffset: 80,
        ungrabbable: true,
        keyframes: [
          {
            duration: 16,
            hurtbubbles: [
              -5, -54, 4, 5,
              0, -7, 7, 5,
              -10, -35, 5, 5,
              -8, -20, 25, 5,
              -12, -54, 4, 5,
              -5, -7, 7, 5
            ]
          },
          {
            duration: 14,
            hurtbubbles: [
              -5, 4, 4, 5,
              0, 20, 7, 5,
              -10, 15, 5, 5,
              -8, 30, 25, 5,
              -12, 4, 4, 5,
              -5, 20, 7, 5
            ]
          },
          {
            duration: 5,
            dx: 2,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'ledgestand100',
        cancellable: '',
        transition: 'idle',
        disableIK: true,
        type: 4,
        xOffset: -10,
        yOffset: 80,
        ungrabbable: true,
        keyframes: [
          {
            duration: 30,
            hurtbubbles: [
              -5, -54, 4, 5,
              0, -7, 7, 5,
              -10, -35, 5, 5,
              -8, -20, 25, 5,
              -12, -54, 4, 5,
              -5, -7, 7, 5
            ]
          },
          {
            duration: 25,
            hurtbubbles: [
              -5, 4, 4, 5,
              0, 20, 7, 5,
              -10, 15, 5, 5,
              -8, 30, 25, 5,
              -12, 4, 4, 5,
              -5, 20, 7, 5
            ]
          },
          {
            duration: 5,
            dx: 2,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'ledgeroll0',
        cancellable: '',
        transition: 'idle',
        disableIK: true,
        type: 4,
        xOffset: -10,
        yOffset: 80,
        ungrabbable: true,
        keyframes: [
          {
            duration: 5,
            hurtbubbles: [
              -5, -54, 4, 5,
              0, -7, 7, 5,
              -10, -35, 5, 5,
              -8, -20, 25, 5,
              -12, -54, 4, 5,
              -5, -7, 7, 5
            ]
          },
          {
            duration: 5,
            hurtbubbles: [
              -5, 4, 4, 5,
              0, 20, 7, 5,
              -10, 15, 5, 5,
              -8, 30, 25, 5,
              -12, 4, 4, 5,
              -5, 20, 7, 5
            ]
          },
          {
            duration: 5,
            hurtbubbles: [
              5, 4, 4, 5,
              10, 20, 7, 5,
              0, 15, 5, 5,
              2, 30, 25, 5,
              -2, 4, 4, 5,
              5, 20, 7, 5
            ]
          },
          {
            duration: 15,
            speed: 5,
            hurtbubbles: [
              5, 4, 4, 5,
              10, 20, 7, 5,
              0, 15, 5, 5,
              2, 30, 25, 5,
              -2, 4, 4, 5,
              5, 20, 7, 5
            ]
          },
          {
            duration: 15,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'ledgeroll100',
        cancellable: '',
        transition: 'idle',
        disableIK: true,
        type: 4,
        xOffset: -10,
        yOffset: 80,
        ungrabbable: true,
        keyframes: [
          {
            duration: 20,
            hurtbubbles: [
              -5, -54, 4, 5,
              0, -7, 7, 5,
              -10, -35, 5, 5,
              -8, -20, 25, 5,
              -12, -54, 4, 5,
              -5, -7, 7, 5
            ]
          },
          {
            duration: 12,
            hurtbubbles: [
              -5, 4, 4, 5,
              0, 20, 7, 5,
              -10, 15, 5, 5,
              -8, 30, 25, 5,
              -12, 4, 4, 5,
              -5, 20, 7, 5
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 5,
              10, 20, 7, 5,
              0, 15, 5, 5,
              2, 30, 25, 5,
              -2, 4, 4, 5,
              5, 20, 7, 5
            ]
          },
          {
            duration: 20,
            speed: 6,
            hurtbubbles: [
              5, 4, 4, 5,
              10, 20, 7, 5,
              0, 15, 5, 5,
              2, 30, 25, 5,
              -2, 4, 4, 5,
              5, 20, 7, 5
            ]
          },
          {
            duration: 18,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'ledgehop',
        cancellable: '',
        disableIK: true,
        type: 0,
        cancel: 'continue',
        slid: 'continue',
        friction: 1,
        ungrabbable: true,
        keyframes: [
          {
            duration: 20,
            cancellable: '',
            hurtbubbles: [
              -5, -54, 4, 5,
              0, -7, 7, 5,
              -10, -35, 5, 5,
              -8, -20, 25, 5,
              -12, -54, 4, 5,
              -5, -7, 7, 5
            ]
          },
          {
            duration: 5,
            airborne: true,
            speed: 10,
            dx: 3,
            jumpSpeed: 10,
            hurtbubbles: [
              -5, 4, 4, 1,
              -10, 20, 7, 1,
              0, 15, 5, 1,
              -2, 30, 25, 1,
              -2, 4, 4, 1,
              -5, 20, 7, 1
            ]
          },
          {
            duration: 20,
            hurtbubbles: [
              5, -8, 4, 1,
              10, 45, 7, 1,
              0, 15, 5, 1,
              2, 35, 25, 1,
              -2, -8, 4, 1,
              5, 15, 7, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, -4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, -4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'walk',
        cancellable: 'all',
        handler: 'walk',
        transition: 'walk',
        cancel: 'walk',
        slid: 'stop',
        unbufferable: true,
        type: 0,
        keyframes: [
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 18, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              8, 4, 4, 1,
              10, 22, 7, 1,
              0, 15, 5, 1,
              2, 35, 25, 1,
              4, 4, 4, 1,
              5, 15, 7, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'stride',
        cancellable: 'all',
        handler: 'walk',
        transition: 'stride',
        unbufferable: true,
        type: 0,
        keyframes: [
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          },
          {
            duration: 5,
            hurtbubbles: [
              8, 4, 4, 1,
              10, 15, 7, 1,
              0, 15, 5, 1,
              2, 35, 25, 1,
              4, 4, 4, 1,
              5, 15, 7, 1
            ]
          },
          {
            duration: 5,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'dash',
        cancellable: 'dash.grab.dashattack.sidespecial.upspecial.pivot.skid.run.usmash.jump.hop.jab.ftilt.dsmash.shieldup.powershield.trip.dtaunt.staunt.utaunt',
        type: 0,
        scaleSpeed: 6,
        initialSpeed: 1,
        unbufferable: true,
        passthrough: false,
        noCancel: 'platformdrop',
        start: 'dash',
        end: 'dash',
        handler: 'dash',
        slid: 'dashslid',
        redirect: {
          jab: 'dashattack',
          ftilt: 'dashattack',
          dtilt: 'dashattack',
          dsmash: 'dashattack',
          grab: 'dashgrab'
        },
        keyframes: [
          {
            interpolate: true,
            duration: 7,
            cancellable: 'fsmash.fsmashpivot',
            hurtbubbles: [
              16, 4, 4, 1,
              10, 15, 7, 1,
              -3, 15, 5, 1,
              -6, 28, 25, 1,
              12, 4, 4, 1,
              5, 15, 7, 1
            ]
          },
          {
            duration: 14,
            hurtbubbles: [
              16, 4, 4, 1,
              10, 15, 7, 1,
              -3, 15, 5, 1,
              -6, 28, 25, 1,
              12, 4, 4, 1,
              5, 15, 7, 1
            ]
          },
          {
            duration: 5,
            hurtbubbles: [
              7, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -4, 4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'walkpivot',
        cancellable: 'all',
        noCancel: 'walkpivot.walk.stride.idle.dash',
        unbufferable: true,
        type: 0,
        end: 'walkpivot',
        slid: 'dashslid',
        transition: 'idle',
        keyframes: [
          {
            duration: 4,
            hurtbubbles: [
              -5, 4, 4, 1,
              -10, 20, 7, 1,
              0, 15, 5, 1,
              -2, 30, 25, 1,
              2, 4, 4, 1,
              -5, 20, 7, 1
            ]
          },
          {
            duration: 5,
            hurtbubbles: [
              2, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -5, 4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'pivot',
        cancellable: 'all',
        noCancel: 'pivot.dash.walk.crouch.dashpivot.stride',
        unbufferable: true,
        type: 0,
        start: 'pivot',
        end: 'pivot',
        slid: 'dashslid',
        keyframes: [
          {
            duration: 3,
            hurtbubbles: [
              -5, 4, 4, 1,
              -10, 20, 7, 1,
              0, 15, 5, 1,
              -2, 30, 25, 1,
              2, 4, 4, 1,
              -5, 20, 7, 1
            ]
          },
          {
            duration: 5,
            hurtbubbles: [
              2, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -5, 4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'fsmashpivot',
        cancellable: '',
        type: 4,
        end: 'stop',
        slid: 'stop',
        transition: 'fsmash',
        keyframes: [
          {
            duration: 2,
            hurtbubbles: [
              -5, 4, 4, 1,
              -10, 20, 7, 1,
              0, 15, 5, 1,
              -2, 30, 25, 1,
              2, 4, 4, 1,
              -5, 20, 7, 1
            ]
          },
          {
            duration: 5,
            hurtbubbles: [
              2, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -5, 4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'dashslid',
        cancellable: 'all',
        type: 0,
        grabDirections: 4 | 64,
        keyframes: [
          {
            interpolate: true,
            duration: 6,
            hurtbubbles: [
              2, -4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -5, -4, 4, 1,
              5, 20, 7, 1
            ]
          },
          {
            duration: 16,
            hurtbubbles: [
              2, -4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -5, -4, 4, 1,
              5, 20, 7, 1
            ]
          },
          {
            duration: 8,
            hurtbubbles: [
              2, -4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -5, -4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'run',
        cancellable: 'dtaunt.staunt.utaunt.dash.run.grab.usmash.sidespecial.groundspecial.downspecial.upspecial.dsmash.fsmash.skid.turnaround.jump.hop.jab.ftilt.crouch.shieldup.powershield.trip',
        unbufferable: true,
        type: 0,
        runSpeed: 6,
        handler: 'run',
        transition: 'run',
        redirect: {
          jab: 'dashattack',
          ftilt: 'dashattack',
          dsmash: 'dashattack',
          fsmash: 'dashattack',
          grab: 'dashgrab'
        },
        keyframes: [
          {
            duration: 5,
            hurtbubbles: [
              7, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -4, 4, 4, 1,
              5, 20, 7, 1
            ]
          },
          {
            duration: 5,
            hurtbubbles: [
              -4, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              7, 4, 4, 1,
              5, 20, 7, 1
            ]
          },
          {
            duration: 3,
            hurtbubbles: [
              7, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -4, 4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'dashskid',
        cancellable: 'dash.dashpivot.dtaunt.staunt.utaunt.grab.sidespecial.groundspecial.downspecial.upspecial.turnaround.jump.hop.crouch.shieldup.powershield',
        type: 4,
        redirect: {
          grab: 'dashgrab'
        },
        end: 'stop',
        keyframes: [
          {
            interpolate: true,
            duration: 12,
            hurtbubbles: [
              8, 4, 4, 1,
              10, 15, 7, 1,
              0, 15, 5, 1,
              2, 35, 25, 1,
              4, 4, 4, 1,
              5, 15, 7, 1
            ]
          },
          {
            duration: 5,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'skid',
        cancellable: 'dtaunt.staunt.utaunt.grab.sidespecial.groundspecial.downspecial.upspecial.turnaround.jump.hop.crouch.shieldup.powershield',
        type: 4,
        redirect: {
          grab: 'dashgrab'
        },
        end: 'stop',
        keyframes: [
          {
            interpolate: true,
            duration: 5,
            hurtbubbles: [
              8, 4, 4, 1,
              15, 15, 7, 1,
              4, 15, 5, 1,
              8, 27, 25, 1,
              -2, 4, 4, 1,
              11, 15, 7, 1
            ]
          },
          {
            duration: 15,
            hurtbubbles: [
              8, 4, 4, 1,
              15, 15, 7, 1,
              4, 15, 5, 1,
              8, 27, 25, 1,
              -2, 4, 4, 1,
              11, 15, 7, 1
            ]
          },
          {
            duration: 5,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'turnaround',
        cancellable: 'sidespecial.groundspecial.downspecial.upspecial.skid.turnaround.jump.hop',
        type: 4,
        friction: 0.95,
        slid: 'dashslid',
        transition: 'idle',
        end: 'turnaround',
        keyframes: [
          {
            interpolate: true,
            duration: 20,
            hurtbubbles: [
              -5, 4, 4, 1,
              -10, 20, 7, 1,
              0, 15, 5, 1,
              -2, 30, 25, 1,
              2, 4, 4, 1,
              -5, 20, 7, 1
            ]
          },
          {
            duration: 15,
            hurtbubbles: [
              -5, 4, 4, 1,
              -10, 20, 7, 1,
              0, 15, 5, 1,
              -2, 30, 25, 1,
              2, 4, 4, 1,
              -5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'jump',
        cancellable: 'all',
        type: 0,
        keyframes: [
          {
            duration: 10,
            hurtbubbles: [
              5, -8, 4, 1,
              10, 45, 7, 1,
              0, 15, 5, 1,
              2, 35, 25, 1,
              -2, -8, 4, 1,
              5, 15, 7, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, -4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, -4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'airjump0',
        cancellable: 'all',
        noCancelInterrupt: true,
        noFastfall: true,
        type: 0,
        fallFriction: 1,
        start: 'airjump',
        carryMomentum: 0.75,
        upward: 10,
        di: 2,
        interrupted: 'airjump',
        keyframes: [
          {
            duration: 10,
            hurtbubbles: [
              5, -4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, -4, 4, 1,
              5, 20, 7, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, -4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, -4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'walljump',
        cancellable: 'all',
        noCancel: 'walljump',
        noCancelInterrupt: true,
        noFastfall: true,
        type: 0,
        fallFriction: 1,
        interrupted: 'airjump',
        keyframes: [
          {
            duration: 1,
            hurtbubbles: [
              5, -8, 4, 1,
              10, 45, 7, 1,
              0, 15, 5, 1,
              2, 35, 25, 1,
              -2, -8, 4, 1,
              5, 15, 7, 1
            ]
          },
          {
            upward: 11.25,
            di: 4,
            duration: 10,
            hurtbubbles: [
              5, -4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, -4, 4, 1,
              5, 20, 7, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, -4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, -4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'hop',
        cancellable: 'airdodge',
        slid: 'stop',
        handler: 'hop',
        type: 0,
        keyframes: [
          {
            interpolate: true,
            duration: 6,
            cancellable: 'grab.usmash.upspecial',
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          },
          {
            duration: 1,
            cancellable: 'grab.usmash.upspecial',
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          },
          {
            duration: 1,
            cancellable: 'grab.usmash.upspecial.downspecial',
            airborne: true,
            jump: 8.5,
            fullJump: 14,
            jumpDI: 2,
            effect: 'hop',
          },
          {
            duration: 5,
            cancellable: 'all',
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          },
          {
            duration: 10,
            cancellable: 'all',
            hurtbubbles: [
              5, -8, 4, 1,
              10, 45, 7, 1,
              0, 15, 5, 1,
              2, 35, 25, 1,
              -2, -8, 4, 1,
              5, 15, 7, 1
            ]
          },
          {
            duration: 10,
            cancellable: 'all',
            hurtbubbles: [
              5, -4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, -4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'shieldup',
        cancellable: 'grab.dodgeback.spotdodge.dodgeforth.hop',
        specialDrop: true,
        type: 5,
        transition: 'shield',
        handler: 'shield',
        alwaysHandle: true,
        shielded: 'shield',
        start: 'shield',
        keyframes: [
          {
            interpolate: true,
            duration: 6,
            audio: 'shieldup',
            hurtbubbles: [
              5, 4, 4, 1,
              7, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              4, 20, 7, 1
            ]
          },
          {
            duration: 3,
            hurtbubbles: [
              5, 4, 4, 1,
              16, 35, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              12, 30, 7, 1
            ]
          }
        ]
      },
      {
        name: 'shield',
        cancellable: 'dodgeback.spotdodge.dodgeforth.grab.shielddrop',
        specialDrop: true,
        type: 5,
        freshStart: 'shield',
        transition: 'shield',
        handler: 'shield',
        alwaysHandle: true,
        shieldbrake: 0.1,
        shielded: 'shield',
        keyframes: [
          {
            duration: 40,
            hurtbubbles: [
              5, 4, 4, 1,
              16, 35, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              12, 30, 7, 1
            ]
          },
          {
            duration: 40,
            hurtbubbles: [
              5, 4, 4, 1,
              16, 35, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              12, 30, 7, 1
            ]
          }
        ]
      },
      {
        name: 'crumple',
        cancellable: '',
        type: 4,
        start: 'crumple',
        transition: 'fallen',
        keyframes: [
          {
            duration: 102,
            interpolate: true,
            hurtbubbles: [
              -8, 4, 4, 1,
              -20, 7, 7, 1,
              -5, 15, 5, 1,
              6, 25, 25, 1,
              -24, 4, 4, 1,
              20, 7, 7, 1
            ]
          },
          {
            duration: 0,
            hurtbubbles: [
              -8, 4, 4, 1,
              -20, 7, 7, 1,
              -5, 15, 5, 1,
              6, 25, 25, 1,
              -24, 4, 4, 1,
              20, 7, 7, 1
            ]
          }
        ]
      },
      {
        name: 'shielddrop',
        cancellable: 'hop.jump.grab',
        specialDrop: true,
        type: 5,
        buffer: 'all',
        keyframes: [
          {
            duration: 15,
            hurtbubbles: [
              5, 4, 4, 1,
              16, 35, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              12, 30, 7, 1
            ]
          },
          {
            duration: 3,
            hurtbubbles: [
              5, 4, 4, 1,
              7, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              4, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'dodgeback',
        cancellable: '',
        type: 4,
        friction: 0.8,
        end: 'stop',
        slid: 'stop',
        keyframes: [
          {
            duration: 5,
            hurtbubbles: [
              5, 4, 4, 1,
              16, 35, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              12, 30, 7, 1
            ]
          },
          {
            duration: 15,
            speed: -5,
            hurtbubbles: [
              5, 4, 4, 5,
              16, 35, 7, 5,
              0, 15, 5, 5,
              2, 30, 25, 5,
              -2, 4, 4, 5,
              12, 30, 7, 5
            ]
          },
          {
            duration: 9,
            hurtbubbles: [
              5, 4, 4, 1,
              16, 35, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              12, 30, 7, 1
            ]
          },
          {
            duration: 1,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'spotdodge',
        cancellable: '',
        type: 4,
        keyframes: [
          {
            duration: 3,
            audio: 'asper_dodge',
            hurtbubbles: [
              5, 4, 4, 1,
              16, 35, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              12, 30, 7, 1
            ]
          },
          {
            duration: 15,
            hurtbubbles: [
              5, 4, 4, 5,
              16, 35, 7, 5,
              0, 15, 5, 5,
              2, 30, 25, 5,
              -2, 4, 4, 5,
              12, 30, 7, 5
            ]
          },
          {
            duration: 9,
            hurtbubbles: [
              5, 4, 4, 1,
              16, 35, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              12, 30, 7, 1
            ]
          },
          {
            duration: 1,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'dodgeforth',
        cancellable: '',
        type: 4,
        friction: 0.8,
        end: 'stop',
        slid: 'stop',
        keyframes: [
          {
            duration: 5,
            hurtbubbles: [
              5, 4, 4, 1,
              16, 35, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              12, 30, 7, 1
            ]
          },
          {
            duration: 15,
            speed: 5,
            hurtbubbles: [
              5, 4, 4, 5,
              16, 35, 7, 5,
              0, 15, 5, 5,
              2, 30, 25, 5,
              -2, 4, 4, 5,
              12, 30, 7, 5
            ]
          },
          {
            duration: 1,
            start: function (entity) {
              entity.face = -entity.face
            },
            hurtbubbles: [
              0, 4, 4, 1,
              0, 35, 7, 1,
              0, 15, 5, 1,
              0, 30, 25, 1,
              0, 4, 4, 1,
              0, 30, 7, 1
            ]
          },
          {
            duration: 12,
            hurtbubbles: [
              0, 4, 4, 1,
              0, 35, 7, 1,
              0, 15, 5, 1,
              0, 30, 25, 1,
              0, 4, 4, 1,
              0, 30, 7, 1
            ]
          },
          {
            duration: 1,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'rollforth',
        cancellable: '',
        type: 4,
        friction: 0.9,
        slid: 'stop',
        keyframes: [
          {
            duration: 5,
            interpolate: true,
            hurtbubbles: [
              5, 4, 4, 5,
              5, 35, 7, 5,
              0, 15, 5, 5,
              2, 30, 25, 5,
              -2, 4, 4, 5,
              0, 30, 7, 5
            ]
          },
          {
            duration: 10,
            speed: 5,
            hurtbubbles: [
              5, 4, 4, 5,
              5, 35, 7, 5,
              0, 15, 5, 5,
              2, 30, 25, 5,
              -2, 4, 4, 5,
              0, 30, 7, 5
            ]
          },
          {
            duration: 17,
            hurtbubbles: [
              5, 4, 4, 1,
              5, 35, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              0, 30, 7, 1
            ]
          },
          {
            duration: 1,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'rollback',
        cancellable: '',
        type: 4,
        friction: 0.9,
        slid: 'stop',
        keyframes: [
          {
            duration: 5,
            interpolate: true,
            hurtbubbles: [
              5, 4, 4, 5,
              5, 35, 7, 5,
              0, 15, 5, 5,
              2, 30, 25, 5,
              -2, 4, 4, 5,
              0, 30, 7, 5
            ]
          },
          {
            duration: 15,
            speed: -5,
            hurtbubbles: [
              5, 4, 4, 5,
              5, 35, 7, 5,
              0, 15, 5, 5,
              2, 30, 25, 5,
              -2, 4, 4, 5,
              0, 30, 7, 5
            ]
          },
          {
            duration: 12,
            hurtbubbles: [
              5, 4, 4, 1,
              5, 35, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              0, 30, 7, 1
            ]
          },
          {
            duration: 1,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'airdodge',
        cancellable: 'dodgepanic',
        cancel: 10,
        type: 4,
        aerodynamics: 0.8,
        airdodgeSpeed: 11,
        decay: 1,
        bufferAngle: 0,
        transition: 'helpless',
        start: 'airdodge',
        handler: 'airdodge',
        keyframes: [
          {
            duration: 5,
            gravity: 0,
            noFastfall: true,
            nodi: true,
            audio: 'longwhiff',
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          },
          {
            duration: 26,
            noFastfall: true,
            nodi: true,
            gravity: 0,
            hurtbubbles: [
              5, 4, 4, 5,
              5, 35, 7, 5,
              0, 15, 5, 5,
              2, 30, 25, 5,
              -2, 4, 4, 5,
              0, 30, 7, 5
            ]
          },
          {
            duration: 14,
            hurtbubbles: [
              5, 4, 4, 1,
              5, 35, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              0, 30, 7, 1
            ]
          },
          {
            duration: 1,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'dodgepanic',
        cancellable: '',
        cancel: 10,
        transition: 'helpless',
        ledgestall: true,
        pseudojump: true,
        noFastfall: true,
        nodi: true,
        type: 4,
        keyframes: [
          {
            duration: 16,
            gravity: 0,
            interpolate: true,
            hurtbubbles: [
              5, 4, 4, 1,
              5, 35, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              0, 30, 7, 1
            ]
          },
          {
            duration: 3,
            grabDirections: 4 | 64,
            hurtbubbles: [
              5, 4, 4, 1,
              5, 35, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              0, 30, 7, 1
            ]
          },
          {
            duration: 16,
            grabDirections: 4 | 64,
            hurtbubbles: [
              5, 4, 4, 1,
              5, 35, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              30, 30, 7, 1
            ]
          },
          {
            duration: 1,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              30, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'grab',
        cancellable: '',
        holdingAnimation: 'holding',
        collided: 'grab',
        disableIK: true,
        type: 1,
        keyframes: [
          {
            duration: 3,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          },
          {
            duration: 4,
            hurtbubbles: [
              9, 7, 4, 1,
              4, 17, 7, 1,
              -3, 15, 5, 1,
              -5, 29, 25, 1,
              -2, 4, 4, 1,
              -15, 30, 7, 1
            ]
          },
          {
            duration: 5,
            hurtbubbles: [
              12, 4, 4, 1,
              -9, 20, 7, 1,
              6, 15, 5, 1,
              8, 30, 25, 1,
              -2, 4, 4, 1,
              23, 10, 7, 1
            ],
            audio: 'grab_whiff',
            hitbubbles: [
              {
                type: 'grab',
                follow: 'rhand',
                x: -5,
                radius: 20
              }
            ]
          },
          {
            duration: 20,
            hurtbubbles: [
              12, 4, 4, 1,
              0, 20, 7, 1,
              6, 15, 5, 1,
              8, 30, 25, 1,
              -2, 4, 4, 1,
              30, 20, 7, 1
            ]
          },
          {
            duration: 3,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'holding',
        cancellable: 'fthrow.bthrow.uthrow.pummel.dthrow',
        transition: 'holding',
        type: 6,
        grabForce: 10,
        start: 'grab',
        interrupted: 'release',
        handler: 'holding',
        friction: 0.7,
        strength: 64,
        cancel: 'holding',
        heldAnimation: 'held',
        keyframes: [
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              20, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1,
              20, 20, 0, 0
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              20, 22, 7, 1,
              0, 15, 5, 1,
              6, 35, 25, 1,
              -2, 4, 4, 1,
              5, 18, 7, 1,
              20, 20, 0, 0
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              20, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1,
              20, 20, 0, 0
            ]
          }
        ]
      },
      {
        name: 'release',
        cancellable: '',
        type: 4,
        keyframes: [
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              20, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              20, 22, 7, 1,
              0, 15, 5, 1,
              6, 35, 25, 1,
              -2, 4, 4, 1,
              5, 18, 7, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'airrelease',
        cancellable: '',
        type: 4,
        keyframes: [
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              20, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              20, 22, 7, 1,
              0, 15, 5, 1,
              6, 35, 25, 1,
              -2, 4, 4, 1,
              5, 18, 7, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'pummel',
        cancellable: '',
        transition: 'holding',
        type: 6,
        grabForce: 10,
        interrupted: 'release',
        handler: 'holding',
        strength: -1,
        buffer: 'pummel',
        cancel: 'holding',
        heldAnimation: 'held',
        keyframes: [
          {
            duration: 2,
            hurtbubbles: [
              5, 4, 4, 1,
              20, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1,
              20, 20, 0, 0
            ]
          },
          {
            duration: 4,
            hurtbubbles: [
              5, 4, 4, 1,
              -2, 22, 7, 1,
              0, 15, 5, 1,
              6, 35, 25, 1,
              -2, 4, 4, 1,
              5, 18, 7, 1,
              20, 20, 0, 0
            ]
          },
          {
            duration: 2,
            hurtbubbles: [
              5, 4, 4, 1,
              16, 22, 7, 1,
              0, 15, 5, 1,
              6, 35, 25, 1,
              -2, 4, 4, 1,
              5, 18, 7, 1,
              20, 20, 0, 0
            ],
            hitbubbles: [
              {
                type: 'ground',
                x: 30,
                y: 20,
                radius: 13,
                damage: 3,
                knockback: 4,
                sakurai: true
              }
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              16, 22, 7, 1,
              0, 15, 5, 1,
              6, 35, 25, 1,
              -2, 4, 4, 1,
              5, 18, 7, 1,
              20, 20, 0, 0
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              20, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1,
              20, 20, 0, 0
            ]
          }
        ]
      },
      {
        name: 'dthrow',
        cancellable: '',
        cancel: 'continue',
        transition: 'dthrowhit',
        type: 6,
        grabForce: 10,
        start: 'grab',
        interrupted: 'release',
        handler: 'throwing',
        strength: -1,
        heldAnimation: 'held',
        keyframes: [
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              20, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1,
              20, 20, 0, 0
            ]
          },
          {
            duration: 16,
            hurtbubbles: [
              5, 4, 4, 1,
              30, 60, 7, 1,
              0, 15, 5, 1,
              6, 35, 25, 1,
              -2, 4, 4, 1,
              5, 18, 7, 1,
              30, 60, 0, 0
            ]
          },
          {
            duration: 4,
            hurtbubbles: [
              5, 4, 4, 1,
              30, 60, 7, 1,
              0, 15, 5, 1,
              6, 35, 25, 1,
              -2, 4, 4, 1,
              5, 18, 7, 1,
              30, 60, 0, 0
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              25, 9, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 9, 7, 1,
              25, 9, 0, 0
            ]
          }
        ]
      },
      {
        name: 'dthrowhit',
        cancellable: '',
        cancel: 'continue',
        start: 'release',
        type: 1,
        keyframes: [
          {
            duration: 4,
            hurtbubbles: [
              5, 4, 4, 1,
              25, 9, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 9, 7, 1
            ],
            hitbubbles: [
              {
                type: 'ground',
                follow: 'lhand',
                x: 0,
                y: 0,
                radius: 16,
                damage: 11,
                knockback: 5,
                growth: 6,
                angle: 24
              }
            ]
          },
          
          {
            duration: 14,
            hurtbubbles: [
              5, 4, 4, 1,
              30, 9, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 0, 7, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'uthrow',
        cancellable: '',
        cancel: 'continue',
        transition: 'uthrowhit',
        type: 6,
        grabForce: 10,
        start: 'grab',
        interrupted: 'release',
        handler: 'throwing',
        strength: -1,
        heldAnimation: 'held',
        keyframes: [
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              20, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1,
              20, 20, 0, 0
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              20, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 10, 7, 1,
              30, 40, 0, 0
            ]
          }
        ]
      },
      {
        name: 'uthrowhit',
        cancellable: '',
        cancel: 'continue',
        start: 'release',
        type: 1,
        keyframes: [
          {
            duration: 4,
            hurtbubbles: [
              5, 4, 4, 1,
              20, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 10, 7, 1,
              30, 40, 0, 0
            ],
            audio: 'shortwhiff',
            hitbubbles: [
              {
                type: 'ground',
                x: 10,
                y: 20,
                radius: 20,
                damage: 6,
                knockback: 7,
                angle: 85
              }
            ]
          },
          {
            duration: 5,
            reset: true,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              -2, 15, 5, 1,
              -5, 32, 25, 1,
              -2, 4, 4, 1,
              35, 30, 7, 1
            ],
            hitbubbles: [
              {
                type: 'ground',
                x: 25,
                y: 90,
                radius: 22,
                damage: 7,
                knockback: 10,
                growth: 15,
                angle: 75
              },
              {
                type: 'ground',
                x: 27,
                y: 50,
                radius: 20,
                damage: 7,
                knockback: 10,
                growth: 15,
                angle: 75
              }
            ]
          },
          {
            duration: 20,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              -3, 15, 5, 1,
              -7, 32, 25, 1,
              -3, 4, 4, 1,
              30, 70, 7, 1
            ]
          },
          {
            duration: 5,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 35, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'fthrow',
        cancellable: '',
        cancel: 'continue',
        transition: 'fthrowhit',
        type: 6,
        grabForce: 10,
        start: 'grab',
        interrupted: 'release',
        handler: 'throwing',
        strength: -1,
        heldAnimation: 'held',
        keyframes: [
          {
            duration: 5,
            hurtbubbles: [
              5, 4, 4, 1,
              20, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1,
              20, 20, 0, 0
            ]
          },
          {
            duration: 24,
            hurtbubbles: [
              5, 4, 4, 1,
              30, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              30, 20, 7, 1,
              30, 16, 0, 0
            ]
          }
        ]
      },
      {
        name: 'fthrowhit',
        cancellable: '',
        cancel: 'continue',
        start: 'release',
        type: 1,
        keyframes: [
          {
            duration: 3,
            hurtbubbles: [
              5, 4, 4, 1,
              30, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              30, 16, 7, 1
            ],
            hitbubbles: [
              {
                type: 'ground',
                x: 34,
                y: 40,
                radius: 20,
                damage: 6,
                knockback: 14,
                growth: 6,
                angle: 75
              }
            ]
          },
          {
            duration: 18,
            hurtbubbles: [
              5, 4, 4, 1,
              40, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              40, 16, 7, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'bthrow',
        cancellable: '',
        cancel: 'continue',
        transition: 'bthrowhit',
        type: 6,
        grabForce: 10,
        start: 'grab',
        interrupted: 'release',
        handler: 'throwing',
        strength: -1,
        heldAnimation: 'heldpivot',
        keyframes: [
          {
            duration: 24,
            hurtbubbles: [
              5, 4, 4, 1,
              20, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1,
              20, 20, 0, 0
            ]
          },
          {
            duration: 120,
            hurtbubbles: [
              5, 4, 4, 1,
              0, 40, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1,
              0, 40, 0, 0
            ]
          }
        ]
      },
      {
        name: 'bthrowhit',
        cancellable: '',
        cancel: 'continue',
        start: 'release',
        type: 1,
        keyframes: [
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              0, 40, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ],
            hitbubbles: [
              {
                type: 'ground',
                y: 40,
                radius: 13,
                damage: 13,
                knockback: 12,
                growth: 5,
                angle: 150
              }
            ]
          },
          {
            duration: 27,
            hurtbubbles: [
              5, 4, 4, 1,
              -10, 30, 7, 1,
              0, 15, 5, 1,
              6, 35, 25, 1,
              -2, 4, 4, 1,
              5, 18, 7, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'held',
        transition: 'held',
        cancellable: '',
        cancel: 'held',
        noFastfall: true,
        nodi: true,
        type: 4,
        pivotx: 10,
        pivoty: 15,
        keyframes: [
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'heldpivot',
        transition: 'held',
        cancellable: '',
        cancel: 'held',
        noFastfall: true,
        start: 'pivot',
        nodi: true,
        type: 4,
        pivotx: 10,
        pivoty: 15,
        keyframes: [
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          },
          {
            duration: 20,
            hurtbubbles: [
              -5, 4, 4, 1,
              -10, 20, 7, 1,
              0, 15, 5, 1,
              -2, 30, 25, 1,
              2, 4, 4, 1,
              -5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'released',
        cancellable: '',
        noFastfall: true,
        nodi: true,
        type: 4,
        keyframes: [
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'airreleased',
        cancellable: '',
        noFastfall: true,
        nodi: true,
        type: 4,
        keyframes: [
          {
            duration: 2,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          },
          {
            dy: 10,
            dx: -6,
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'dashgrab',
        cancellable: '',
        collided: 'grab',
        disableIK: true,
        holdingAnimation: 'holding',
        type: 1,
        slideFriction: 0.94,
        start: 'stop',
        end: 'stop',
        keyframes: [
          {
            duration: 7,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              7, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          },
          {
            duration: 4,
            slide: 7,
            hurtbubbles: [
              5, 4, 4, 1,
              -14, 20, 7, 1,
              0, 15, 5, 1,
              9, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          },
          {
            duration: 2,
            audio: 'grab_whiff',
            hitbubbles: [
              {
                type: 'grab',
                follow: 'lhand',
                radius: 25
              },
              {
                type: 'grab',
                follow: 'head',
                radius: 15
              }
            ],
            effect: 'hop',
            hurtbubbles: [
              -4, 10, 4, 1,
              40, 30, 7, 1,
              0, 15, 5, 1,
              5, 25, 25, 1,
              -12, 8, 4, 1,
              0, 20, 7, 1
            ]
          },
          {
            duration: 12,
            hurtbubbles: [
              -25, 10, 4, 1,
              30, 20, 7, 1,
              0, 15, 5, 1,
              5, 25, 25, 1,
              -19, 8, 4, 1,
              0, 20, 7, 1
            ]
          },
          {
            duration: 12,
            hurtbubbles: [
              -20, 8, 4, 1,
              25, 14, 7, 1,
              0, 15, 5, 1,
              5, 25, 25, 1,
              9, 4, 4, 1,
              0, 20, 7, 1
            ]
          },
          {
            duration: 3,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'groundspecial',
        cancellable: '',
        type: 3,
        reversible: true,
        transition: 'groundspecial2',
        disableIK: true,
        keyframes: [
          {
            duration: 6,
            interpolate: true,
            hurtbubbles: [
              20, 4, 4, 1,
              0, 7, 7, 1,
              0, 4, 4, 1,
              0, 15, 5, 1,
              -20, 4, 4, 1,
              0, 7, 7, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              20, 4, 4, 1,
              0, 7, 7, 1,
              0, 4, 4, 1,
              0, 15, 5, 1,
              -20, 4, 4, 1,
              0, 7, 7, 1
            ]
          },
          {
            duration: 40,
            hurtbubbles: [
              60, 4, 4, 1,
              0, 7, 7, 1,
              0, 4, 4, 1,
              0, 15, 5, 1,
              -60, 4, 4, 1,
              0, 7, 7, 1
            ]
          }
        ]
      },
      {
        name: 'groundspecial2',
        cancellable: 'groundspecial3',
        disableIK: true,
        type: 3,
        transition: 'groundspecial3',
        handler: function (entity, controller, animation) {
          if (!controller.special) {
            entity.schedule('groundspecial3')
          }
        },
        keyframes: [
          {
            duration: 600,
            hurtbubbles: [
              60, 4, 4, 1,
              0, 7, 7, 1,
              0, 4, 4, 1,
              0, 15, 5, 1,
              -60, 4, 4, 1,
              0, 7, 7, 1
            ]
          },
          {
            duration: 40,
            hurtbubbles: [
              60, 4, 4, 1,
              0, 7, 7, 1,
              0, 4, 4, 1,
              0, 15, 5, 1,
              -60, 4, 4, 1,
              0, 7, 7, 1
            ]
          }
        ]
      },
      {
        name: 'groundspecial3',
        cancellable: '',
        disableIK: true,
        type: 3,
        keyframes: [
          {
            duration: 1,
            hurtbubbles: [
              60, 4, 4, 1,
              0, 7, 7, 1,
              0, 4, 4, 1,
              0, 15, 5, 1,
              -60, 4, 4, 1,
              0, 7, 7, 1
            ],
            hitbubbles: [
              {
                type: 'special',
                follow: 'rfoot',
                radius: 16,
                flags: 'fixed',
                damage: 2,
                knockback: 10,
                angle: 170
              },
              {
                type: 'special',
                follow: 'lfoot',
                radius: 16,
                flags: 'fixed',
                damage: 2,
                knockback: 10,
                angle: 170
              }
            ]
          },
          {
            duration: 2,
            reset: true,
            audio: 'shortwhiff',
            hitAudio: 'wham',
            hurtbubbles: [
              60, 4, 4, 1,
              0, 7, 7, 1,
              0, 4, 4, 1,
              0, 15, 5, 1,
              -60, 4, 4, 1,
              0, 7, 7, 1
            ],
            hitbubbles: [
              {
                type: 'special',
                follow: 'lhand',
                radius: 20,
                damage: 15,
                knockback: 10,
                growth: 7,
                angle: 90
              },
              {
                type: 'special',
                follow: 'rfoot',
                radius: 16,
                damage: 9,
                knockback: 8,
                growth: 7,
                angle: 75
              },
              {
                type: 'special',
                follow: 'lfoot',
                radius: 16,
                damage: 9,
                knockback: 8,
                growth: 7,
                angle: 75
              }
            ]
          },
          {
            duration: 2,
            reset: true,
            hurtbubbles: [
              0, 67, 4, 1,
              0, 67, 7, 1,
              0, 4, 4, 1,
              0, 15, 5, 1,
              0, 67, 4, 1,
              0, 67, 7, 1
            ]
          },
          {
            duration: 12,
            hurtbubbles: [
              0, 67, 4, 1,
              0, 67, 7, 1,
              0, 4, 4, 1,
              0, 15, 5, 1,
              0, 67, 4, 1,
              0, 67, 7, 1
            ]
          },
          {
            duration: 12,
            hurtbubbles: [
              0, 67, 4, 1,
              0, 67, 7, 1,
              0, 7, 7, 1,
              0, 15, 5, 1,
              0, 67, 4, 1,
              0, 67, 7, 1
            ]
          },
          {
            duration: 40,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'sidespecial',
        cancel: 26,
        transition: 'tilt',
        angles: 1 | 2 | 4,
        cancellable: '',
        noFastfall: true,
        nodi: true,
        type: 3,
        keyframes: [
          {
            duration: 3,
            interpolate: true,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          },
          {
            duration: 6,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          },
          {
            duration: 3,
            hurtbubbles: [
              15, 4, 4, 1,
              -30, 35, 7, 1,
              0, 25, 5, 1,
              0, 25, 25, 1,
              -15, 4, 4, 1,
              -30, 15, 7, 1
            ]
          },
          {
            duration: 8,
            hurtbubbles: [
              15, 4, 4, 1,
              -30, 35, 7, 1,
              0, 25, 5, 1,
              0, 25, 25, 1,
              -15, 4, 4, 1,
              -30, 15, 7, 1
            ]
          }
        ]
      },
      {
        name: 'sidespecial-neutral',
        cancel: 26,
        cancellable: '',
        noFastfall: true,
        nodi: true,
        type: 3,
        keyframes: [
          {
            duration: 3,
            hurtbubbles: [
              15, 4, 4, 1,
              -30, 35, 7, 1,
              0, 25, 5, 1,
              0, 25, 25, 1,
              -15, 4, 4, 1,
              -30, 15, 7, 1
            ]
          },
          {
            duration: 1,
            hurtbubbles: [
              15, 4, 4, 1,
              150, 25, 7, 1,
              0, 25, 5, 1,
              0, 25, 25, 1,
              -15, 4, 4, 1,
              -30, 15, 7, 1
            ]
          },
          {
            duration: 2,
            audio: 'shortwhiff',
            hitbubbles: [
              {
                type: 'special',
                follow: 'rhand',
                x: -6,
                y: 2,
                radius: 22,
                damage: 8,
                knockback: 8,
                growth: 11,
                sakurai: true
              }
            ]
          },
          {
            duration: 1,
            hurtbubbles: [
              15, 4, 4, 1,
              150, 25, 7, 1,
              0, 25, 5, 1,
              0, 25, 25, 1,
              -15, 4, 4, 1,
              150, 25, 7, 1
            ],
            hitbubbles: true
          },
          {
            duration: 10
          },
          {
            duration: 8,
            hurtbubbles: [
              15, 4, 4, 1,
              150, 25, 7, 1,
              0, 25, 5, 1,
              0, 25, 25, 1,
              -15, 4, 4, 1,
              150, 25, 7, 1
            ]
          },
          {
            duration: 8,
            hurtbubbles: [
              15, 4, 4, 1,
              30, 35, 7, 1,
              0, 25, 5, 1,
              0, 25, 25, 1,
              -15, 4, 4, 1,
              30, 15, 7, 1
            ]
          },
          {
            duration: 12,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'sidespecial-up',
        cancel: 26,
        cancellable: '',
        noFastfall: true,
        nodi: true,
        type: 3,
        keyframes: [
          {
            duration: 3,
            hurtbubbles: [
              15, 4, 4, 1,
              -30, 35, 7, 1,
              0, 25, 5, 1,
              0, 25, 25, 1,
              -15, 4, 4, 1,
              -30, 15, 7, 1
            ]
          },
          {
            duration: 1,
            hurtbubbles: [
              15, 4, 4, 1,
              130, 60, 7, 1,
              0, 25, 5, 1,
              0, 25, 25, 1,
              -15, 4, 4, 1,
              -30, 15, 7, 1
            ]
          },
          {
            duration: 2,
            audio: 'shortwhiff',
            hitbubbles: [
              {
                type: 'special',
                follow: 'rhand',
                x: -6,
                y: 2,
                radius: 22,
                damage: 8,
                knockback: 8,
                growth: 11,
                angle: 50
              }
            ]
          },
          {
            duration: 1,
            hurtbubbles: [
              15, 4, 4, 1,
              130, 60, 7, 1,
              0, 25, 5, 1,
              0, 25, 25, 1,
              -15, 4, 4, 1,
              130, 60, 7, 1
            ],
            hitbubbles: true
          },
          {
            duration: 10
          },
          {
            duration: 8,
            hurtbubbles: [
              15, 4, 4, 1,
              130, 60, 7, 1,
              0, 25, 5, 1,
              0, 25, 25, 1,
              -15, 4, 4, 1,
              130, 60, 7, 1
            ]
          },
          {
            duration: 8,
            hurtbubbles: [
              15, 4, 4, 1,
              30, 35, 7, 1,
              0, 25, 5, 1,
              0, 25, 25, 1,
              -15, 4, 4, 1,
              30, 15, 7, 1
            ]
          },
          {
            duration: 12,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'sidespecial-down',
        cancel: 26,
        cancellable: '',
        noFastfall: true,
        nodi: true,
        type: 3,
        keyframes: [
          {
            duration: 3,
            hurtbubbles: [
              15, 4, 4, 1,
              -30, 35, 7, 1,
              0, 25, 5, 1,
              0, 25, 25, 1,
              -15, 4, 4, 1,
              -30, 15, 7, 1
            ]
          },
          {
            duration: 1,
            hurtbubbles: [
              15, 4, 4, 1,
              120, 7, 7, 1,
              0, 25, 5, 1,
              0, 25, 25, 1,
              -15, 4, 4, 1,
              -30, 15, 7, 1
            ]
          },
          {
            duration: 2,
            audio: 'shortwhiff',
            hitbubbles: [
              {
                type: 'special',
                follow: 'rhand',
                x: -6,
                y: 2,
                radius: 22,
                damage: 8,
                knockback: 8,
                growth: 11,
                sakurai: true
              }
            ]
          },
          {
            duration: 1,
            hurtbubbles: [
              15, 4, 4, 1,
              120, 7, 7, 1,
              0, 25, 5, 1,
              0, 25, 25, 1,
              -15, 4, 4, 1,
              120, 7, 7, 1
            ],
            hitbubbles: true
          },
          {
            duration: 10
          },
          {
            duration: 8,
            hurtbubbles: [
              15, 4, 4, 1,
              120, 7, 7, 1,
              0, 25, 5, 1,
              0, 25, 25, 1,
              -15, 4, 4, 1,
              120, 7, 7, 1
            ]
          },
          {
            duration: 8,
            hurtbubbles: [
              15, 4, 4, 1,
              30, 35, 7, 1,
              0, 25, 5, 1,
              0, 25, 25, 1,
              -15, 4, 4, 1,
              30, 15, 7, 1
            ]
          },
          {
            duration: 12,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'airsidespecial',
        cancel: 26,
        transition: 'tilt',
        angles: 1 | 2 | 4,
        cancellable: '',
        noFastfall: true,
        nodi: true,
        type: 3,
        gravity: 0,
        start: function (entity, controller) {
          let diff = 4 - entity.dy
          entity.pseudojumps++
          entity.dy = entity.dy + diff * (1 / entity.pseudojumps)
          entity.fastfall = false
        },
        keyframes: [
          {
            duration: 4,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          },
          {
            duration: 6,
            hurtbubbles: [
              15, 4, 4, 1,
              -30, 35, 7, 1,
              0, 25, 5, 1,
              0, 25, 25, 1,
              -15, 4, 4, 1,
              -30, 15, 7, 1
            ]
          },
          {
            duration: 8,
            hurtbubbles: [
              15, 4, 4, 1,
              -30, 35, 7, 1,
              0, 25, 5, 1,
              0, 25, 25, 1,
              -15, 4, 4, 1,
              -30, 15, 7, 1
            ]
          }
        ]
      },
      {
        name: 'airsidespecial-neutral',
        cancel: 26,
        cancellable: '',
        noFastfall: true,
        nodi: true,
        type: 3,
        keyframes: [
          {
            duration: 3,
            hurtbubbles: [
              15, 4, 4, 1,
              -30, 35, 7, 1,
              0, 25, 5, 1,
              0, 25, 25, 1,
              -15, 4, 4, 1,
              -30, 15, 7, 1
            ]
          },
          {
            duration: 1,
            hurtbubbles: [
              15, 4, 4, 1,
              150, 25, 7, 1,
              0, 25, 5, 1,
              0, 25, 25, 1,
              -15, 4, 4, 1,
              -30, 15, 7, 1
            ]
          },
          {
            duration: 2,
            audio: 'shortwhiff',
            hitbubbles: [
              {
                type: 'special',
                follow: 'rhand',
                x: -6,
                y: 2,
                radius: 22,
                damage: 8,
                knockback: 8,
                growth: 11,
                sakurai: true
              }
            ]
          },
          {
            duration: 1,
            hurtbubbles: [
              15, 4, 4, 1,
              150, 25, 7, 1,
              0, 25, 5, 1,
              0, 25, 25, 1,
              -15, 4, 4, 1,
              150, 25, 7, 1
            ],
            hitbubbles: true
          },
          {
            duration: 10
          },
          {
            duration: 8,
            hurtbubbles: [
              15, 4, 4, 1,
              150, 25, 7, 1,
              0, 25, 5, 1,
              0, 25, 25, 1,
              -15, 4, 4, 1,
              150, 25, 7, 1
            ]
          },
          {
            duration: 8,
            hurtbubbles: [
              15, 4, 4, 1,
              30, 35, 7, 1,
              0, 25, 5, 1,
              0, 25, 25, 1,
              -15, 4, 4, 1,
              30, 15, 7, 1
            ]
          },
          {
            duration: 12,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'airsidespecial-up',
        cancel: 26,
        cancellable: '',
        noFastfall: true,
        nodi: true,
        type: 3,
        keyframes: [
          {
            duration: 3,
            hurtbubbles: [
              15, 4, 4, 1,
              -30, 35, 7, 1,
              0, 25, 5, 1,
              0, 25, 25, 1,
              -15, 4, 4, 1,
              -30, 15, 7, 1
            ]
          },
          {
            duration: 1,
            hurtbubbles: [
              15, 4, 4, 1,
              130, 70, 7, 1,
              0, 25, 5, 1,
              0, 25, 25, 1,
              -15, 4, 4, 1,
              -30, 15, 7, 1
            ]
          },
          {
            duration: 2,
            audio: 'shortwhiff',
            hitbubbles: [
              {
                type: 'special',
                follow: 'rhand',
                x: -6,
                y: 2,
                radius: 22,
                damage: 8,
                knockback: 8,
                growth: 11,
                angle: 50
              }
            ]
          },
          {
            duration: 1,
            hurtbubbles: [
              15, 4, 4, 1,
              130, 70, 7, 1,
              0, 25, 5, 1,
              0, 25, 25, 1,
              -15, 4, 4, 1,
              130, 70, 7, 1
            ],
            hitbubbles: true
          },
          {
            duration: 10
          },
          {
            duration: 8,
            hurtbubbles: [
              15, 4, 4, 1,
              130, 70, 7, 1,
              0, 25, 5, 1,
              0, 25, 25, 1,
              -15, 4, 4, 1,
              130, 70, 7, 1
            ]
          },
          {
            duration: 8,
            hurtbubbles: [
              15, 4, 4, 1,
              30, 35, 7, 1,
              0, 25, 5, 1,
              0, 25, 25, 1,
              -15, 4, 4, 1,
              30, 15, 7, 1
            ]
          },
          {
            duration: 12,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'airsidespecial-down',
        cancel: 26,
        cancellable: '',
        noFastfall: true,
        nodi: true,
        type: 3,
        keyframes: [
          {
            duration: 3,
            hurtbubbles: [
              15, 4, 4, 1,
              -30, 35, 7, 1,
              0, 25, 5, 1,
              0, 25, 25, 1,
              -15, 4, 4, 1,
              -30, 15, 7, 1
            ]
          },
          {
            duration: 1,
            hurtbubbles: [
              15, 4, 4, 1,
              117, -15, 7, 1,
              0, 25, 5, 1,
              0, 25, 25, 1,
              -15, 4, 4, 1,
              -30, 15, 7, 1
            ]
          },
          {
            duration: 2,
            audio: 'shortwhiff',
            hitbubbles: [
              {
                type: 'special',
                follow: 'rhand',
                x: -6,
                y: 2,
                radius: 22,
                damage: 8,
                knockback: 8,
                growth: 11,
                sakurai: true
              }
            ]
          },
          {
            duration: 1,
            hurtbubbles: [
              15, 4, 4, 1,
              117, -15, 7, 1,
              0, 25, 5, 1,
              0, 25, 25, 1,
              -15, 4, 4, 1,
              117, -15, 7, 1
            ],
            hitbubbles: true
          },
          {
            duration: 10
          },
          {
            duration: 8,
            hurtbubbles: [
              15, 4, 4, 1,
              117, -15, 7, 1,
              0, 25, 5, 1,
              0, 25, 25, 1,
              -15, 4, 4, 1,
              117, -15, 7, 1
            ]
          },
          {
            duration: 8,
            hurtbubbles: [
              15, 4, 4, 1,
              30, 35, 7, 1,
              0, 25, 5, 1,
              0, 25, 25, 1,
              -15, 4, 4, 1,
              30, 15, 7, 1
            ]
          },
          {
            duration: 12,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'downspecial',
        cancellable: '',
        type: 3,
        reversible: true,
        keyframes: [
          {
            duration: 20,
            interpolate: true,
            hurtbubbles: [
              -15, 19, 4, 1,
              -9, 17, 7, 1,
              0, 5, 5, 1,
              -40, 25, 25, 1,
              -19, 20, 4, 1,
              -24, 22, 7, 1
            ]
          },
          {
            duration: 6,
            hurtbubbles: [
              -15, 19, 4, 1,
              -9, 17, 7, 1,
              0, 5, 5, 1,
              -40, 25, 25, 1,
              -19, 20, 4, 1,
              -24, 22, 7, 1
            ]
          },
          {
            duration: 4,
            hitAudio: 'wham',
            audio: 'longwhiff',
            hitbubbles: [
              {
                type: 'special',
                follow: 'head',
                x: 10,
                y: 5,
                radius: 35,
                damage: 22,
                knockback: 6,
                growth: 11,
                sakurai: true,
                shieldDamage: 10
              }
            ]
          },
          {
            duration: 3,
            speed: 3,
            hurtbubbles: [
              35, 19, 4, 1,
              24, 17, 7, 1,
              0, 5, 5, 1,
              84, 25, 25, 1,
              42, 20, 4, 1,
              53, 22, 7, 1
            ]
          },
          {
            duration: 20,
            hurtbubbles: [
              30, 19, 4, 1,
              19, 17, 7, 1,
              0, 5, 5, 1,
              80, 25, 25, 1,
              38, 20, 4, 1,
              49, 22, 7, 1
            ]
          },
          {
            duration: 30,
            hurtbubbles: [
              15, 4, 4, 1,
              9, 7, 7, 1,
              0, 5, 5, 1,
              40, 25, 25, 1,
              19, 4, 4, 1,
              24, 7, 7, 1
            ]
          },
          {
            duration: 2,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'upspecial',
        cancellable: '',
        noFastfall: true,
        type: 3,
        reversible: true,
        slid: 'airupspecial2',
        transition: 'idle',
        disableIK: true,
        handler: function (entity, controller, animation) {
          let angle
          if (animation.keyframe === 2) {
            entity.dx = 4 * controller.hmove * (animation.midframe / animation.frameDuration)
          }
        },
        keyframes: [
          {
            duration: 4,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          },
          {
            duration: 2,
            hurtbubbles: [
              17, 17, 4, 1,
              -17, 17, 7, 1,
              23, 60, 5, 1,
              0, 25, 25, 1,
              17, 17, 4, 1,
              -17, 17, 7, 1
            ],
            audio: 'longwhiff',
            hitbubbles: [
              {
                type: 'special',
                x: 20,
                y: 35,
                radius: 30,
                color: 207,
                damage: 7,
                knockback: 10,
                sakurai: true
              }
            ]
          },
          {
            duration: 20,
            reset: true,
            repeat: 3,
            hurtbubbles: [
              17, 17, 4, 1,
              -17, 17, 7, 1,
              23, 60, 5, 1,
              0, 25, 25, 1,
              17, 17, 4, 1,
              -17, 17, 7, 1
            ],
            hitbubbles: [
              {
                type: 'special',
                x: 20,
                y: 35,
                radius: 30,
                color: 207,
                damage: 3,
                knockback: 5,
                sakurai: true
              }
            ]
          },
          {
            duration: 2,
            reset: true,
            hurtbubbles: [
              17, 17, 4, 1,
              -17, 17, 7, 1,
              23, 60, 5, 1,
              0, 25, 25, 1,
              17, 17, 4, 1,
              -17, 17, 7, 1
            ],
            hitbubbles: [
              {
                type: 'special',
                x: 20,
                y: 35,
                radius: 35,
                color: 207,
                damage: 7,
                knockback: 10,
                growth: 10,
                sakurai: true
              }
            ]
          },
          {
            duration: 14,
            hurtbubbles: [
              17, 17, 4, 1,
              -17, 17, 7, 1,
              23, 60, 5, 1,
              0, 25, 25, 1,
              17, 17, 4, 1,
              -17, 17, 7, 1
            ]
          },
          {
            duration: 3,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'airspecial',
        disableIK: true,
        cancellable: '',
        type: 3,
        reversible: true,
        transition: 'airspecial2',
        cancel: 'continue',
        keyframes: [
          {
            duration: 6,
            interpolate: true,
            hurtbubbles: [
              20, 4, 4, 1,
              0, 7, 7, 1,
              0, 4, 4, 1,
              0, 15, 5, 1,
              -20, 4, 4, 1,
              0, 7, 7, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              20, 4, 4, 1,
              0, 7, 7, 1,
              0, 4, 4, 1,
              0, 15, 5, 1,
              -20, 4, 4, 1,
              0, 7, 7, 1
            ]
          },
          {
            duration: 40,
            hurtbubbles: [
              60, 4, 4, 1,
              0, 7, 7, 1,
              0, 4, 4, 1,
              0, 15, 5, 1,
              -60, 4, 4, 1,
              0, 7, 7, 1
            ]
          }
        ]
      },
      {
        name: 'airspecial2',
        disableIK: true,
        cancellable: 'airspecial3',
        cancel: 'groundspecial2',
        type: 3,
        transition: 'airspecial3',
        handler: function (entity, controller, animation) {
          if (!controller.special) {
            entity.schedule('airspecial3')
          }
        },
        keyframes: [
          {
            duration: 600,
            hurtbubbles: [
              60, 4, 4, 1,
              0, 7, 7, 1,
              0, 4, 4, 1,
              0, 15, 5, 1,
              -60, 4, 4, 1,
              0, 7, 7, 1
            ]
          },
          {
            duration: 40,
            hurtbubbles: [
              60, 4, 4, 1,
              0, 7, 7, 1,
              0, 4, 4, 1,
              0, 15, 5, 1,
              -60, 4, 4, 1,
              0, 7, 7, 1
            ]
          }
        ]
      },
      {
        name: 'airspecial3',
        disableIK: true,
        cancellable: '',
        cancel: 10,
        grabDirections: 4 | 16 | 64 | 128,
        type: 3,
        start: function (entity) {
          entity.dy = 9
        },
        transition: 'helpless',
        keyframes: [
          {
            duration: 1,
            hurtbubbles: [
              60, 4, 4, 1,
              0, 7, 7, 1,
              0, 4, 4, 1,
              0, 15, 5, 1,
              -60, 4, 4, 1,
              0, 7, 7, 1
            ],
            hitbubbles: [
              {
                type: 'special',
                follow: 'rfoot',
                radius: 16,
                flags: 'fixed',
                damage: 2,
                knockback: 10,
                angle: 170
              },
              {
                type: 'special',
                follow: 'lfoot',
                radius: 16,
                flags: 'fixed',
                damage: 2,
                knockback: 10,
                angle: 170
              }
            ]
          },
          {
            duration: 2,
            reset: true,
            audio: 'shortwhiff',
            hitAudio: 'wham',
            hurtbubbles: [
              60, 4, 4, 1,
              0, 7, 7, 1,
              0, 4, 4, 1,
              0, 15, 5, 1,
              -60, 4, 4, 1,
              0, 7, 7, 1
            ],
            hitbubbles: [
              {
                type: 'special',
                follow: 'lhand',
                radius: 20,
                damage: 15,
                knockback: 10,
                growth: 8,
                angle: 90
              },
              {
                type: 'special',
                follow: 'rfoot',
                radius: 16,
                damage: 9,
                knockback: 8,
                growth: 7,
                angle: 75
              },
              {
                type: 'special',
                follow: 'lfoot',
                radius: 16,
                damage: 9,
                knockback: 8,
                growth: 7,
                angle: 75
              }
            ]
          },
          {
            duration: 2,
            reset: true,
            hurtbubbles: [
              0, 67, 4, 1,
              0, 67, 7, 1,
              0, 4, 4, 1,
              0, 15, 5, 1,
              0, 67, 4, 1,
              0, 67, 7, 1
            ]
          },
          {
            duration: 20,
            hurtbubbles: [
              0, 67, 4, 1,
              0, 67, 7, 1,
              0, 4, 4, 1,
              0, 15, 5, 1,
              0, 67, 4, 1,
              0, 67, 7, 1
            ]
          },
          {
            duration: 16,
            hurtbubbles: [
              0, 67, 4, 1,
              0, 67, 7, 1,
              0, 7, 7, 1,
              0, 15, 5, 1,
              0, 67, 4, 1,
              0, 67, 7, 1
            ]
          },
          {
            duration: 40,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'airdownspecial',
        cancellable: '',
        cancel: 'continue',
        type: 3,
        reversible: true,
        keyframes: [
          {
            duration: 22,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          },
          {
            duration: 9,
            hurtbubbles: [
              -15, 19, 4, 1,
              -9, 17, 7, 1,
              0, 15, 5, 1,
              -40, 25, 25, 1,
              -19, 20, 4, 1,
              -24, 22, 7, 1
            ]
          },
          {
            duration: 4,
            hitAudio: 'wham',
            audio: 'longwhiff',
            hitbubbles: [
              {
                type: 'special',
                follow: 'head',
                x: 10,
                y: 5,
                radius: 35,
                damage: 22,
                knockback: 6,
                growth: 11,
                sakurai: true,
                shieldDamage: 10
              }
            ]
          },
          {
            duration: 3,
            accel: 1,
            hurtbubbles: [
              35, 19, 4, 1,
              24, 17, 7, 1,
              0, 15, 5, 1,
              84, 25, 25, 1,
              42, 20, 4, 1,
              53, 22, 7, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              30, 19, 4, 1,
              19, 17, 7, 1,
              0, 15, 5, 1,
              80, 25, 25, 1,
              38, 20, 4, 1,
              49, 22, 7, 1
            ]
          },
          {
            duration: 20,
            hurtbubbles: [
              15, 4, 4, 1,
              9, 7, 7, 1,
              0, 15, 5, 1,
              40, 25, 25, 1,
              19, 4, 4, 1,
              24, 7, 7, 1
            ]
          },
          {
            duration: 2,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'airupspecial',
        cancellable: '',
        cancel: 'continue',
        noFastfall: true,
        nodi: true,
        type: 3,
        reversible: true,
        gravity: 0.5,
        transition: 'airupspecial2',
        handler: function (entity, controller, animation) {
          let angle
          if (animation.keyframe !== 0) {
            if (controller.special) {
              entity.dx = entity.dx * 0.85
              entity.dy = entity.dy * 0.88
            }
          }
          if (animation.keyframe === 0) {
            entity.dy = entity.dx * 0.5
            entity.dx = entity.dy * 0.9
          } else if (animation.keyframe === 1) {
            if (!entity.airborne) {
              entity.airborne = true
            }
            entity.dy = entity.dy * 0.9 + 0.8 * (animation.midframe / animation.frameDuration)
            entity.dx = entity.dx * 0.9
          } else if (animation.keyframe === 2) {
            entity.dx = entity.dx + entity.face * 5
          } else if (animation.keyframe === 3) {
            if (!entity.airborne) {
              entity.airborne = true
            }
            entity.dy = 20 - 5 * (animation.midframe / animation.frameDuration) * animation.ticks
            entity.dx = entity.dx * 0.9
          }
        },
        start: function (entity) {
          entity.airborne = true
        },
        keyframes: [
          {
            duration: 15,
            interpolate: true,
            hurtbubbles: [
              17, 17, 4, 1,
              -17, 17, 7, 1,
              23, 60, 5, 1,
              0, 25, 25, 1,
              17, 17, 4, 1,
              -17, 17, 7, 1
            ]
          },
          {
            duration: 35,
            hurtbubbles: [
              17, 17, 4, 1,
              -17, 17, 7, 1,
              23, 60, 5, 1,
              0, 25, 25, 1,
              17, 17, 4, 1,
              -17, 17, 7, 1
            ],
            audio: 'shortwhiff',
            hitbubbles: [
              {
                type: 'special',
                follow: 'body',
                x: -5,
                y: -18,
                radius: 30,
                color: 207,
                damage: 7,
                knockback: 10,
                growth: 5,
                sakurai: true
              }
            ]
          },
          {
            duration: 3,
            hitbubbles: true
          },
          {
            duration: 6,
            hurtbubbles: [
              17, 17, 4, 1,
              -17, 17, 7, 1,
              23, 60, 5, 1,
              0, 25, 25, 1,
              17, 17, 4, 1,
              -17, 17, 7, 1
            ],
            hitbubbles: true
          },
          {
            duration: 3,
            hurtbubbles: [
              17, 17, 4, 1,
              -17, 17, 7, 1,
              23, 60, 5, 1,
              0, 25, 25, 1,
              17, 17, 4, 1,
              -17, 17, 7, 1
            ],
            hitbubbles: true
          },
          {
            duration: 3,
            hurtbubbles: [
              17, 17, 4, 1,
              -17, 17, 7, 1,
              23, 60, 5, 1,
              0, 25, 25, 1,
              17, 17, 4, 1,
              -17, 17, 7, 1
            ]
          }
        ]
      },
      {
        name: 'airupspecial2',
        cancellable: '',
        cancel: 20,
        transition: 'helpless',
        helpless: true,
        platformDroppable: true,
        type: 4,
        grabDirections: 4 | 16 | 64 | 128,
        keyframes: [
          {
            duration: 25,
            hurtbubbles: [
              17, 17, 4, 1,
              -17, 17, 7, 1,
              23, 60, 5, 1,
              0, 25, 25, 1,
              17, 17, 4, 1,
              -17, 17, 7, 1
            ],
            hitbubbles: [
              {
                type: 'special',
                follow: 'body',
                x: -5,
                y: -18,
                radius: 30,
                color: 207,
                damage: 7,
                knockback: 10,
                sakurai: true
              }
            ]
          },
          {
            duration: 5,
          },
          {
            duration: 80,
            hurtbubbles: [
              5, 34, 4, 1,
              10, 10, 7, 1,
              0, 15, 5, 1,
              2, 20, 25, 1,
              -2, 34, 4, 1,
              5, 10, 7, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, -4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, -4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'jab',
        cancellable: '',
        type: 1,
        iasa: 6,
        keyframes: [
          {
            duration: 3,
            interpolate: true,
            hurtbubbles: [
              17, 4, 4, 1,
              2, 27, 7, 1,
              -5, 15, 5, 1,
              -12, 46, 25, 1,
              -2, 4, 4, 1,
              -1, 20, 7, 1
            ]
          },
          {
            duration: 2,
            hurtbubbles: [
              17, 4, 4, 1,
              2, 27, 7, 1,
              -5, 15, 5, 1,
              -12, 46, 25, 1,
              -2, 4, 4, 1,
              -1, 20, 7, 1
            ],
            audio: 'shortwhiff',
            hitbubbles: [
              {
                type: 'ground',
                follow: 'head',
                x: -5,
                y: 5,
                radius: 26,
                damage: 8,
                knockback: 2,
                growth: 15,
                sakurai: true
              }
            ]
          },
          {
            duration: 2,
            hurtbubbles: [
              17, 4, 4, 1,
              16, 7, 7, 1,
              10, 15, 5, 1,
              27, 25, 25, 1,
              -2, 4, 4, 1,
              8, 14, 7, 1
            ],
            hitbubbles: true
          },
          {
            duration: 7,
            hurtbubbles: [
              17, 4, 4, 1,
              16, 7, 7, 1,
              10, 15, 5, 1,
              27, 25, 25, 1,
              -2, 4, 4, 1,
              8, 14, 7, 1
            ]
          },
          {
            duration: 13,
            hurtbubbles: [
              17, 4, 4, 1,
              10, 10, 7, 1,
              10, 15, 5, 1,
              19, 27, 25, 1,
              -2, 4, 4, 1,
              8, 14, 7, 1
            ]
          },
          {
            duration: 16,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'dashattack',
        cancellable: '',
        type: 1,
        friction: 0,
        start: 'stop',
        end: 'stop',
        slideFriction: 0.9,
        iasa: 4,
        disableIK: true,
        keyframes: [
          {
            duration: 7,
            cancellable: 'usmash',
            slide: 4,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          },
          {
            duration: 3,
            cancellable: 'usmash',
            slide: 10,
            hurtbubbles: [
              15 - 10, 4, 4, 1,
              10 - 10, 20, 7, 1,
              0 - 10, 15, 5, 1,
              -8 - 10, 30, 25, 1,
              10 - 10, 4, 4, 1,
              5 - 10, 20, 7, 1
            ]
          },
          {
            duration: 6,
            tween: { type: 'arc', centerX: 0, centerY: 25, arc: -0.5, frames: 2 },
            hurtbubbles: [
              16, 48, 4, 1,
              14, 5, 7, 1,
              0, 25, 5, 1,
              0, 25, 25, 1,
              -16, 5, 4, 1,
              -14, 45, 7, 1
            ],
            audio: 'longwhiff',
            hitbubbles: [
              {
                type: 'ground',
                follow: 'rhand',
                radius: 15,
                damage: 10,
                knockback: 12,
                growth: 10,
                sakurai: true
              },
              {
                type: 'ground',
                follow: 'rfoot',
                radius: 15,
                damage: 10,
                knockback: 12,
                growth: 10,
                sakurai: true
              },
              {
                type: 'ground',
                follow: 'lfoot',
                radius: 15,
                damage: 10,
                knockback: 12,
                growth: 10,
                sakurai: true
              },
              {
                type: 'ground',
                follow: 'lhand',
                radius: 15,
                damage: 10,
                knockback: 12,
                growth: 10,
                sakurai: true
              }
            ]
          },
          {
            duration: 10,
            hitbubbles: [
              {
                type: 'ground',
                follow: 'rhand',
                radius: 15,
                damage: 8,
                knockback: 9,
                growth: 8,
                sakurai: true
              },
              {
                type: 'ground',
                follow: 'rfoot',
                radius: 15,
                damage: 8,
                knockback: 9,
                growth: 8,
                sakurai: true
              },
              {
                type: 'ground',
                follow: 'lfoot',
                radius: 15,
                damage: 8,
                knockback: 9,
                growth: 8,
                sakurai: true
              },
              {
                type: 'ground',
                follow: 'lhand',
                radius: 15,
                damage: 8,
                knockback: 9,
                growth: 8,
                sakurai: true
              }
            ]
          },
          {
            duration: 20
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'dtilt',
        cancellable: '',
        type: 1,
        transition: 'crouched',
        iasa: 2,
        disableIK: true,
        keyframes: [
          {
            interpolate: true,
            duration: 6,
            hurtbubbles: [
              5, 4, 4, 1,
              12, 7, 7, 1,
              0, 15, 5, 1,
              0, 25, 25, 1,
              -25, 4, 4, 1,
              -6, 7, 7, 1
            ]
          },
          {
            duration: 7,
            hurtbubbles: [
              5, 4, 4, 1,
              12, 7, 7, 1,
              0, 15, 5, 1,
              0, 25, 25, 1,
              -25, 4, 4, 1,
              -6, 7, 7, 1
            ]
          },
          {
            duration: 3,
            hurtbubbles: [
              -10, 4, 4, 1,
              12, 7, 7, 1,
              0, 15, 5, 1,
              0, 25, 25, 1,
              -25, 4, 4, 1,
              -6, 7, 7, 1
            ]
          },
          {
            duration: 2,
            hurtbubbles: [
              27, 4, 4, 1,
              12, 7, 7, 1,
              0, 15, 5, 1,
              0, 25, 25, 1,
              -25, 4, 4, 1,
              -6, 7, 7, 1
            ],
            audio: 'shortwhiff',
            hitbubbles: [
              {
                type: 'ground',
                follow: 'rfoot',
                x: -15,
                y: 14,
                radius: 26,
                damage: 12,
                knockback: 14,
                growth: 10,
                angle: 50
              }
            ]
          },
          {
            duration: 1,
            hurtbubbles: [
              78, 4, 4, 1,
              12, 7, 7, 1,
              4, 15, 5, 1,
              -5, 25, 25, 1,
              -25, 4, 4, 1,
              -6, 7, 7, 1
            ],
            hitbubbles: true
          },
          {
            duration: 22,
            hurtbubbles: [
              78, 4, 4, 1,
              12, 7, 7, 1,
              4, 15, 5, 1,
              -5, 25, 25, 1,
              -25, 4, 4, 1,
              -6, 7, 7, 1
            ]
          },
          {
            duration: 8,
            hurtbubbles: [
              12, 4, 4, 1,
              12, 7, 7, 1,
              2, 15, 5, 1,
              0, 25, 25, 1,
              -25, 4, 4, 1,
              -6, 7, 7, 1
            ]
          },
          {
            duration: 5,
            hurtbubbles: [
              5, 4, 4, 1,
              25, 7, 7, 1,
              0, 15, 5, 1,
              2, 25, 25, 1,
              -2, 4, 4, 1,
              -5, 7, 7, 1
            ]
          }
        ]
      },
      {
        name: 'ftilt',
        cancellable: '',
        transition: 'tilt',
        type: 1,
        keyframes: [
          {
            duration: 4,
            interpolate: true,
            hurtbubbles: [
              -4, 4, 4, 1,
              -10, 5, 7, 1,
              10, 15, 5, 1,
              -4, 25, 25, 1,
              4, 4, 4, 1,
              10, 5, 7, 1
            ]
          },
          {
            duration: 2,
            hurtbubbles: [
              -4, 4, 4, 1,
              -10, 5, 7, 1,
              10, 15, 5, 1,
              -4, 25, 25, 1,
              4, 4, 4, 1,
              10, 5, 7, 1
            ]
          }
        ]
      },
      {
        name: 'ftilt-neutral',
        cancellable: '',
        type: 1,
        iasa: 2,
        disableIK: true,
        keyframes: [
          {
            duration: 8,
            hurtbubbles: [
              -4, 4, 4, 1,
              -10, 5, 7, 1,
              10, 15, 5, 1,
              -4, 25, 25, 1,
              4, 4, 4, 1,
              10, 5, 7, 1
            ]
          },
          {
            duration: 3,
            hurtbubbles: [
              -25, 12, 4, 5,
              -10, 5, 7, 5,
              -10, 15, 5, 5,
              -4, 25, 25, 1,
              -25, 18, 4, 5,
              10, 5, 7, 5
            ],
            audio: 'shortwhiff',
            hitbubbles: [
              {
                type: 'ground',
                follow: 'rfoot',
                x: -6,
                y: 5,
                radius: 30,
                damage: 11,
                knockback: 8,
                growth: 13,
                sakurai: true
              }
            ]
          },
          {
            duration: 1,
            hurtbubbles: [
              55, 18, 4, 5,
              -10, 5, 7, 5,
              25, 15, 5, 5,
              -4, 25, 25, 1,
              55, 24, 4, 5,
              10, 5, 7, 5
            ],
            hitbubbles: true
          },
          {
            duration: 15,
            hurtbubbles: [
              55, 18, 4, 5,
              -10, 5, 7, 1,
              25, 15, 5, 5,
              -4, 25, 25, 1,
              55, 24, 4, 5,
              10, 5, 7, 1
            ]
          },
          {
            duration: 4,
            hurtbubbles: [
              5, 4, 4, 1,
              -10, 5, 7, 1,
              0, 15, 5, 1,
              2, 35, 25, 1,
              -2, 4, 4, 1,
              10, 5, 7, 1
            ]
          },
          {
            duration: 4,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 35, 25, 1,
              -2, 4, 4, 1,
              0, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'ftilt-up',
        cancellable: '',
        type: 1,
        iasa: 2,
        disableIK: true,
        keyframes: [
          {
            duration: 8,
            hurtbubbles: [
              -4, 4, 4, 1,
              -10, 5, 7, 1,
              10, 15, 5, 1,
              -4, 25, 25, 1,
              4, 4, 4, 1,
              10, 5, 7, 1
            ]
          },
          {
            duration: 3,
            hurtbubbles: [
              -15, 18, 4, 5,
              -10, 5, 7, 5,
              -10, 25, 5, 5,
              -4, 25, 25, 1,
              -15, 24, 4, 5,
              10, 5, 7, 5
            ],
            audio: 'shortwhiff',
            hitbubbles: [
              {
                type: 'ground',
                follow: 'rfoot',
                x: -7,
                y: 5,
                radius: 30,
                damage: 11,
                knockback: 8,
                growth: 13,
                angle: 55
              }
            ]
          },
          {
            duration: 1,
            hurtbubbles: [
              47, 34, 4, 5,
              -10, 5, 7, 5,
              25, 30, 5, 5,
              -4, 25, 25, 1,
              47, 39, 4, 5,
              10, 5, 7, 5
            ],
            hitbubbles: true
          },
          {
            duration: 15,
            hurtbubbles: [
              47, 34, 4, 5,
              -10, 5, 7, 1,
              25, 30, 5, 5,
              -4, 25, 25, 1,
              47, 39, 4, 5,
              10, 5, 7, 1
            ]
          },
          {
            duration: 4,
            hurtbubbles: [
              5, 4, 4, 1,
              -10, 5, 7, 1,
              0, 15, 5, 1,
              2, 35, 25, 1,
              -2, 4, 4, 1,
              10, 5, 7, 1
            ]
          },
          {
            duration: 4,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 35, 25, 1,
              -2, 4, 4, 1,
              0, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'ftilt-down',
        cancellable: '',
        type: 1,
        iasa: 2,
        disableIK: true,
        keyframes: [
          {
            duration: 8,
            hurtbubbles: [
              -4, 4, 4, 1,
              -10, 5, 7, 1,
              10, 15, 5, 1,
              -4, 25, 25, 1,
              4, 4, 4, 1,
              10, 5, 7, 1
            ]
          },
          {
            duration: 3,
            hurtbubbles: [
              -15, 2, 4, 5,
              -10, 5, 7, 5,
              -10, 15, 5, 5,
              -4, 25, 25, 1,
              -15, 8, 4, 5,
              10, 5, 7, 5
            ],
            audio: 'shortwhiff',
            hitbubbles: [
              {
                type: 'ground',
                follow: 'rfoot',
                x: -10,
                radius: 30,
                damage: 10,
                knockback: 6,
                growth: 13,
                sakurai: true
              }
            ]
          },
          {
            duration: 1,
            hurtbubbles: [
              50, 12, 4, 5,
              -10, 5, 7, 5,
              25, 15, 5, 5,
              -4, 25, 25, 1,
              50, 18, 4, 5,
              10, 5, 7, 5
            ],
            hitbubbles: true
          },
          {
            duration: 15,
            hurtbubbles: [
              50, 12, 4, 5,
              -10, 5, 7, 1,
              25, 15, 5, 5,
              -4, 25, 25, 1,
              50, 18, 4, 5,
              10, 5, 7, 1
            ]
          },
          {
            duration: 4,
            hurtbubbles: [
              5, 4, 4, 1,
              -10, 5, 7, 1,
              0, 15, 5, 1,
              2, 35, 25, 1,
              -2, 4, 4, 1,
              10, 5, 7, 1
            ]
          },
          {
            duration: 4,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 35, 25, 1,
              -2, 4, 4, 1,
              0, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'utilt',
        cancellable: '',
        type: 1,
        iasa: 2,
        disableIK: true,
        keyframes: [
          {
            duration: 3,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          },
          {
            duration: 3,
            hurtbubbles: [
              -10, 4, 4, 1,
              10, 7, 7, 1,
              -2, 17, 5, 1,
              6, 28, 23, 1,
              -2, 4, 4, 1,
              0, 20, 7, 1
            ]
          },
          {
            duration: 2,
            hurtbubbles: [
              -30, 4, 4, 1,
              10, 7, 7, 1,
              -2, 17, 5, 1,
              6, 28, 23, 1,
              -2, 4, 4, 1,
              0, 20, 7, 1
            ],
            audio: 'shortwhiff',
            hitbubbles: [
              {
                type: 'ground',
                follow: 'rfoot',
                flags: 256,
                x: 0,
                y: 15,
                radius: 15,
                damage: 13,
                knockback: 3,
                growth: 10,
                angle: 90
              },
              {
                type: 'ground',
                follow: 'rfoot',
                flags: 256,
                x: 15,
                y: 15,
                radius: 15,
                damage: 13,
                knockback: 3,
                growth: 10,
                angle: 90
              },
              {
                type: 'ground',
                follow: 'rfoot',
                flags: 256,
                x: 30,
                y: 15,
                radius: 15,
                damage: 13,
                knockback: 3,
                growth: 10,
                angle: 90
              }
            ]
          },
          {
            duration: 7,
            hurtbubbles: [
              -25, 75, 4, 1,
              10, 7, 7, 1,
              -5, 20, 5, 1,
              11, 27, 23, 1,
              -2, 4, 4, 1,
              0, 20, 7, 1
            ],
            hitbubbles: [
              {
                type: 'ground',
                follow: 'rfoot',
                flags: 256,
                x: 15,
                y: -15,
                radius: 30,
                damage: 10,
                knockback: 2,
                growth: 7,
                angle: 90
              },
            ]
          },
          {
            duration: 9,
            hurtbubbles: [
              -22, 65, 4, 1,
              10, 7, 7, 1,
              -5, 18, 5, 1,
              8, 28, 23, 1,
              -2, 4, 4, 1,
              0, 20, 7, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              -22, 45, 4, 1,
              10, 20, 7, 1,
              -1, 15, 5, 1,
              5, 30, 25, 1,
              -2, 4, 4, 1,
              0, 20, 7, 1
            ]
          },
          {
            duration: 5,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'fsmash',
        cancellable: '',
        transition: 'fsmash-charge',
        type: 1,
        friction: 0,
        keyframes: [
          {
            duration: 5,
            interpolate: true,
            hurtbubbles: [
              5, 4, 4, 1,
              5, 20, 7, 1,
              0, 15, 5, 1,
              0, 27, 25, 1,
              -2, 4, 4, 1,
              0, 20, 7, 1
            ]
          },
          {
            duration: 5,
            hurtbubbles: [
              5, 4, 4, 1,
              5, 20, 7, 1,
              0, 15, 5, 1,
              0, 27, 25, 1,
              -2, 4, 4, 1,
              0, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'fsmash-charge',
        cancellable: '',
        handler: 'charge',
        release: 'fsmash-release',
        transition: 'fsmash-release',
        type: 1,
        keyframes: [
          {
            duration: 5,
            hurtbubbles: [
              5, 4, 4, 1,
              5, 20, 7, 1,
              0, 15, 5, 1,
              0, 27, 25, 1,
              -2, 4, 4, 1,
              0, 20, 7, 1
            ]
          },
          {
            duration: 85,
            audio: 'charging'
          },
          {
            duration: 5,
            hurtbubbles: [
              5, 4, 4, 1,
              5, 20, 7, 1,
              0, 15, 5, 1,
              0, 27, 25, 1,
              -2, 4, 4, 1,
              -20, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'fsmash-release',
        cancellable: '',
        type: 1,
        keyframes: [
          {
            interpolate: true,
            duration: 4,
            speed: 3,
            hurtbubbles: [
              5, 4, 4, 1,
              5, 20, 7, 1,
              0, 15, 5, 1,
              0, 35, 25, 1,
              -2, 4, 4, 1,
              0, 20, 7, 1
            ]
          },
          {
            duration: 2,
            hurtbubbles: [
              5, 4, 4, 1,
              5, 20, 7, 1,
              0, 15, 5, 1,
              0, 35, 25, 1,
              -2, 4, 4, 1,
              0, 20, 7, 1
            ],
            audio: 'shortwhiff',
            hitbubbles: [
              {
                type: 'ground',
                follow: 'rhand',
                radius: 30,
                damage: 5,
                knockback: 10,
                angle: 40
              },
              {
                type: 'ground',
                follow: 'lhand',
                radius: 30,
                damage: 5,
                knockback: 10,
                angle: 40
              }
            ]
          },
          {
            duration: 7,
            speed: 8,
            hurtbubbles: [
              5, 4, 4, 1,
              50, 20, 7, 1,
              0, 15, 5, 1,
              -3, 35, 25, 1,
              -2, 4, 4, 1,
              -20, 20, 7, 1
            ]
          },
          {
            duration: 2,
            reset: true,
            hurtbubbles: [
              5, 4, 4, 1,
              -10, 20, 7, 1,
              0, 15, 5, 1,
              -6, 35, 25, 1,
              -2, 4, 4, 1,
              30, 20, 7, 1
            ],
            audio: 'longwhiff',
            hitbubbles: [
              {
                type: 'ground',
                follow: 'rhand',
                radius: 30,
                damage: 13,
                knockback: 8,
                growth: 9,
                angle: 40
              },
              {
                type: 'ground',
                follow: 'lhand',
                radius: 30,
                damage: 13,
                knockback: 8,
                growth: 9,
                angle: 40
              }
            ]
          },
          {
            duration: 5
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              -10, 20, 7, 1,
              0, 15, 5, 1,
              -6, 35, 25, 1,
              -2, 4, 4, 1,
              30, 20, 7, 1
            ]
          },
          {
            duration: 5,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 35, 25, 1,
              -2, 4, 4, 1,
              0, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'usmash',
        cancellable: '',
        transition: 'usmash-charge',
        slideFriction: 0.95,
        type: 1,
        disableIK: true,
        keyframes: [
          {
            duration: 6,
            interpolate: true,
            hurtbubbles: [
              2, 62, 4, 1,
              14, 33, 7, 1,
              26, 33, 5, 1,
              2, 33, 25, 1,
              2, 4, 4, 1,
              47, 33, 7, 1
            ]
          },
          {
            duration: 25,
            hurtbubbles: [
              2, 62, 4, 1,
              14, 33, 7, 1,
              26, 33, 5, 1,
              2, 33, 25, 1,
              2, 4, 4, 1,
              47, 33, 7, 1
            ]
          }
        ]
      },
      {
        name: 'usmash-charge',
        cancellable: '',
        handler: 'charge',
        transition: 'usmash-release',
        release: 'usmash-release',
        type: 1,
        disableIK: true,
        keyframes: [
          {
            duration: 3,
            hurtbubbles: [
              2, 62, 4, 1,
              14, 33, 7, 1,
              26, 33, 5, 1,
              2, 33, 25, 1,
              2, 4, 4, 1,
              47, 33, 7, 1
            ]
          },
          {
            duration: 85,
            audio: 'charging'
          },
          {
            duration: 25,
            hurtbubbles: [
              2, 62, 4, 1,
              14, 33, 7, 1,
              26, 33, 5, 1,
              2, 33, 25, 1,
              2, 4, 4, 1,
              47, 33, 7, 1
            ]
          }
        ]
      },
      {
        name: 'usmash-release',
        cancellable: '',
        type: 1,
        iasa: 4,
        disableIK: true,
        keyframes: [
          {
            duration: 7,
            hurtbubbles: [
              2, 62, 4, 1,
              14, 33, 7, 1,
              26, 33, 5, 1,
              2, 33, 25, 1,
              2, 4, 4, 1,
              47, 33, 7, 1
            ]
          },
          {
            duration: 2,
            tween: { type: 'arc', centerX: 2, centerY: 33, arc: 0.56, frames: 6 },
            hurtbubbles: [
              2, 62, 4, 1,
              34, 33, 7, 1,
              56, 33, 5, 1,
              2, 33, 25, 1,
              2, 4, 4, 1,
              77, 33, 7, 1
            ],
            audio: 'longwhiff',
            hitbubbles: [
              {
                type: 'ground',
                follow: 'body',
                radius: 35,
                damage: 12,
                knockback: 12,
                growth: 12,
                angle: 55
              }
            ]
          },
          {
            duration: 2,
            hitbubbles: [
              {
                type: 'ground',
                follow: 'body',
                radius: 35,
                damage: 12,
                knockback: 12,
                growth: 12,
                angle: 60
              }
            ]
          },
          {
            duration: 2,
            hitbubbles: [
              {
                type: 'ground',
                follow: 'body',
                radius: 35,
                damage: 10,
                knockback: 10,
                growth: 12,
                angle: 75
              }
            ]
          },
          {
            duration: 2,
            hitbubbles: [
              {
                type: 'ground',
                follow: 'body',
                radius: 35,
                damage: 10,
                knockback: 10,
                growth: 12,
                angle: 70
              }
            ]
          },
          {
            duration: 2,
            hitbubbles: [
              {
                type: 'ground',
                follow: 'body',
                radius: 35,
                damage: 10,
                knockback: 10,
                growth: 12,
                angle: 66
              }
            ]
          },
          {
            duration: 2,
            hitbubbles: [
              {
                type: 'ground',
                follow: 'body',
                radius: 35,
                damage: 10,
                knockback: 10,
                growth: 12,
                angle: 40
              }
            ]
          },
          {
            duration: 2,
            hitbubbles: [
              {
                type: 'ground',
                follow: 'body',
                radius: 35,
                damage: 10,
                knockback: 10,
                growth: 12,
                angle: 25
              }
            ]
          },
          {
            duration: 32
          },
          {
            duration: 5,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'dsmash',
        cancellable: '',
        transition: 'dsmash-charge',
        type: 1,
        friction: 0,
        keyframes: [
          {
            duration: 6,
            interpolate: true,
            hurtbubbles: [
              4, 4, 4, 1,
              25, 10, 7, 1,
              0, 15, 5, 1,
              0, 25, 25, 1,
              -4, 4, 4, 1,
              -25, 10, 7, 1
            ]
          },
          {
            duration: 5,
            hurtbubbles: [
              4, 4, 4, 1,
              25, 10, 7, 1,
              0, 15, 5, 1,
              0, 25, 25, 1,
              -4, 4, 4, 1,
              -25, 10, 7, 1
            ]
          }
        ]
      },
      {
        name: 'dsmash-charge',
        cancellable: '',
        handler: 'charge',
        release: 'dsmash-release',
        transition: 'dsmash-release',
        type: 1,
        keyframes: [
          {
            duration: 5,
            hurtbubbles: [
              4, 4, 4, 1,
              25, 10, 7, 1,
              0, 15, 5, 1,
              0, 25, 25, 1,
              -4, 4, 4, 1,
              -25, 10, 7, 1
            ]
          },
          {
            duration: 85,
            audio: 'charging'
          },
          {
            duration: 5,
            hurtbubbles: [
              4, 4, 4, 1,
              25, 20, 7, 1,
              0, 15, 5, 1,
              0, 25, 25, 1,
              -4, 4, 4, 1,
              -25, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'dsmash-release',
        cancellable: '',
        type: 1,
        iasa: 3,
        keyframes: [
          {
            interpolate: true,
            duration: 15,
            hurtbubbles: [
              4, 4, 4, 1,
              35, 20, 7, 1,
              0, 15, 5, 1,
              0, 25, 25, 1,
              -4, 4, 4, 1,
              -35, 20, 7, 1
            ]
          },
          {
            duration: 6,
            hurtbubbles: [
              4, 4, 4, 1,
              35, 20, 7, 1,
              0, 15, 5, 1,
              0, 25, 25, 1,
              -4, 4, 4, 1,
              -35, 20, 7, 1
            ],
            audio: 'shortwhiff',
            hitbubbles: [
              {
                type: 'ground',
                follow: 'lhand',
                y: 10,
                radius: 25,
                damage: 3,
                knockback: 8,
                angle: 180
              }
            ]
          },
          {
            duration: 6,
            reset: true,
            hurtbubbles: [
              4, 4, 4, 1,
              -35, 20, 7, 1,
              0, 15, 5, 1,
              0, 25, 25, 1,
              -4, 4, 4, 1,
              35, 20, 7, 1
            ],
            audio: 'shortwhiff',
            hitbubbles: [
              {
                type: 'ground',
                follow: 'rhand',
                y: 10,
                radius: 25,
                damage: 3,
                knockback: 8,
                angle: 180
              },
              {
                type: 'ground',
                follow: 'lhand',
                y: 10,
                radius: 25,
                damage: 3,
                knockback: 8,
                angle: 180
              }
            ]
          },
          {
            duration: 6,
            reset: true,
            hurtbubbles: [
              4, 4, 4, 1,
              35, 20, 7, 1,
              0, 15, 5, 1,
              0, 25, 25, 1,
              -4, 4, 4, 1,
              -35, 20, 7, 1
            ],
            audio: 'shortwhiff',
            hitbubbles: true
          },
          {
            duration: 6,
            reset: true,
            hurtbubbles: [
              4, 4, 4, 1,
              -35, 20, 7, 1,
              0, 15, 5, 1,
              0, 25, 25, 1,
              -4, 4, 4, 1,
              35, 20, 7, 1
            ],
            audio: 'shortwhiff',
            hitbubbles: true
          },
          {
            duration: 6,
            reset: true,
            hurtbubbles: [
              4, 4, 4, 1,
              35, 20, 7, 1,
              0, 15, 5, 1,
              0, 25, 25, 1,
              -4, 4, 4, 1,
              -35, 20, 7, 1
            ],
            audio: 'shortwhiff',
            hitbubbles: true
          },
          {
            duration: 6,
            reset: true,
            hurtbubbles: [
              4, 4, 4, 1,
              -35, 20, 7, 1,
              0, 15, 5, 1,
              0, 25, 25, 1,
              -4, 4, 4, 1,
              35, 20, 7, 1
            ],
            audio: 'shortwhiff',
            hitbubbles: true
          },
          {
            duration: 2,
            reset: true,
            hurtbubbles: [
              4, 4, 4, 1,
              35, 20, 7, 1,
              0, 15, 5, 1,
              0, 25, 25, 1,
              -4, 4, 4, 1,
              -35, 20, 7, 1
            ],
            hitbubbles: [
              {
                type: 'ground',
                x: 25,
                y: 25,
                radius: 30,
                damage: 8,
                knockback: 10,
                growth: 10,
                angle: 140
              },
              {
                type: 'ground',
                x: -25,
                y: 25,
                radius: 30,
                damage: 8,
                knockback: 10,
                growth: 10,
                angle: 140
              },
              {
                type: 'ground',
                y: 40,
                radius: 40,
                damage: 8,
                knockback: 10,
                growth: 10,
                angle: 140
              }
            ]
          },
          {
            duration: 29,
            hurtbubbles: [
              4, 4, 4, 1,
              15, 20, 7, 1,
              0, 15, 5, 1,
              0, 25, 25, 1,
              -4, 4, 4, 1,
              -15, 20, 7, 1
            ]
          },
          {
            duration: 5,
            hurtbubbles: [
              5, 4, 4, 1,
              25, 7, 7, 1,
              0, 15, 5, 1,
              2, 25, 25, 1,
              -2, 4, 4, 1,
              -5, 7, 7, 1
            ]
          }
        ]
      },
      {
        name: 'nair',
        cancellable: '',
        cancel: 22,
        type: 2,
        early: 6,
        late: 6,
        iasa: 4,
        keyframes: [
          {
            duration: 2,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              9, 34, 4, 1,
              9, 16, 7, 1,
              0, 25, 5, 1,
              0, 25, 25, 1,
              -9, 16, 4, 1,
              -9, 34, 7, 1
            ]
          },
          {
            duration: 4,
            tween: { type: 'arc', centerX: 0, centerY: 25, arc: 1, frames: 2 },
            hurtbubbles: [
              28, 55, 4, 1,
              28, 5, 7, 1,
              0, 25, 5, 1,
              0, 25, 25, 1,
              -28, 5, 4, 1,
              -28, 55, 7, 1
            ],
            audio: 'shortwhiff',
            hitbubbles: [
              {
                type: 'aerial',
                y: 25,
                radius: 40,
                damage: 15,
                knockback: 3,
                growth: 14,
                sakurai: true
              }
            ]
          },
          {
            duration: 12,
            hitbubbles: [
              {
                type: 'aerial',
                y: 25,
                radius: 37,
                damage: 10,
                knockback: 5,
                growth: 10,
                sakurai: true
              }
            ]
          },
          {
            duration: 24
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'fair',
        cancellable: '',
        cancel: 20,
        type: 2,
        early: 6,
        late: 4,
        iasa: 3,
        keyframes: [
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          },
          {
            duration: 6,
            hurtbubbles: [
              -10, 4, 4, 1,
              9, 25, 7, 1,
              0, 15, 5, 1,
              7, 30, 25, 1,
              4, 4, 4, 1,
              10, 20, 7, 1
            ]
          },
          {
            duration: 3,
            hurtbubbles: [
              30, 18, 4, 1,
              1, 10, 7, 1,
              6, 10, 5, 1,
              -13, 25, 25, 1,
              4, -10, 4, 1,
              3, 13, 7, 1
            ],
            hitAudio: 'wham',
            audio: 'longwhiff',
            hitbubbles: [
              {
                type: 'aerial',
                follow: 'rfoot',
                x: -15,
                radius: 30,
                damage: 18,
                knockback: 2,
                growth: 16,
                sakurai: true,
                lag: 3
              },
              {
                type: 'aerial',
                follow: 'rfoot',
                x: 5,
                radius: 25,
                damage: 18,
                knockback: 2,
                growth: 16,
                sakurai: true,
                lag: 3
              }
            ]
          },
          {
            duration: 14,
            hitbubbles: [
              {
                type: 'aerial',
                follow: 'rfoot',
                x: -15,
                radius: 30,
                damage: 6,
                knockback: 2,
                growth: 10,
                angle: 30
              },
              {
                type: 'aerial',
                follow: 'rfoot',
                x: 5,
                radius: 25,
                damage: 6,
                knockback: 2,
                growth: 10,
                angle: 30
              }
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              30, 18, 4, 1,
              -11, 20, 7, 1,
              0, 15, 5, 1,
              -13, 20, 25, 1,
              -12, 0, 4, 1,
              -16, 20, 7, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'bair',
        cancellable: '',
        cancel: 12,
        type: 2,
        early: 3,
        late: 3,
        iasa: 4,
        keyframes: [
          {
            duration: 5,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          },
          {
            duration: 5,
            hurtbubbles: [
              0, 15, 4, 1,
              0, 15, 4, 1,
              0, 15, 5, 1,
              0, 15, 9, 1,
              0, 15, 4, 1,
              0, 15, 4, 1
            ]
          },
          {
            duration: 4,
            start: function (entity) {
              entity.face = -entity.face
            },
            hurtbubbles: [
              0, 15, 4, 1,
              0, 15, 4, 1,
              0, 15, 5, 1,
              0, 15, 9, 1,
              0, 15, 4, 1,
              0, 15, 4, 1
            ],
            audio: 'shortwhiff',
            hitbubbles: [
              {
                type: 'aerial',
                follow: 'head',
                radius: 15,
                damage: 11,
                knockback: 6,
                growth: 11,
                angle: 30
              },
              {
                type: 'aerial',
                follow: 'rhand',
                radius: 15,
                damage: 11,
                knockback: 6,
                growth: 10,
                angle: 30
              },
              {
                type: 'aerial',
                follow: 'rfoot',
                radius: 15,
                damage: 11,
                knockback: 6,
                growth: 10,
                angle: 30
              },
              {
                type: 'aerial',
                follow: 'lfoot',
                radius: 15,
                damage: 11,
                knockback: 6,
                growth: 10,
                angle: 30
              },
              {
                type: 'aerial',
                follow: 'lhand',
                radius: 15,
                damage: 11,
                knockback: 6,
                growth: 10,
                angle: 30
              }
            ]
          },
          {
            duration: 14,
            hurtbubbles: [
              30, 50, 4, 1,
              40, 35, 4, 1,
              0, 15, 5, 1,
              50, 15, 9, 1,
              40, -5, 4, 1,
              20, -20, 4, 1
            ],
            hitbubbles: [
              {
                type: 'aerial',
                follow: 'rhand',
                radius: 12,
                y: 4,
                damage: 6,
                knockback: 3,
                growth: 5,
                sakurai: true
              },
              {
                type: 'aerial',
                follow: 'rfoot',
                radius: 12,
                y: -4,
                damage: 6,
                knockback: 3,
                growth: 5,
                sakurai: true
              },
              {
                type: 'aerial',
                follow: 'head',
                radius: 15,
                damage: 6,
                knockback: 3,
                growth: 5,
                sakurai: true
              },
              {
                type: 'aerial',
                follow: 'lfoot',
                radius: 15,
                damage: 6,
                knockback: 3,
                growth: 5,
                sakurai: true
              },
              {
                type: 'aerial',
                follow: 'lhand',
                radius: 15,
                damage: 6,
                knockback: 3,
                growth: 5,
                sakurai: true
              }
            ]
          },
          {
            duration: 8,
            hurtbubbles: [
              30, 50, 4, 1,
              40, 35, 4, 1,
              0, 15, 5, 1,
              50, 15, 9, 1,
              40, -5, 4, 1,
              20, -20, 4, 1
            ]
          },
          {
            duration: 20,
            hurtbubbles: [
              30, 50, 4, 1,
              40, 35, 4, 1,
              0, 15, 5, 1,
              50, 15, 9, 1,
              40, -5, 4, 1,
              20, -20, 4, 1
            ]
          },
          {
            duration: 5,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'uair',
        cancellable: '',
        cancel: 16,
        type: 2,
        early: 10,
        iasa: 4,
        keyframes: [
          {
            duration: 4,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              0, 20, 7, 1
            ]
          },
          {
            duration: 2,
            hurtbubbles: [
              2, 62, 4, 1,
              20, 33, 7, 1,
              34, 33, 5, 1,
              2, 33, 25, 1,
              2, 4, 4, 1,
              56, 33, 7, 1
            ]
          },
          {
            duration: 1,
            tween: { type: 'arc', centerX: 2, centerY: 33, arc: 0.55, frames: 6 },
            hurtbubbles: [
              2, 62, 4, 1,
              20, 33, 7, 1,
              34, 33, 5, 1,
              2, 33, 25, 1,
              2, 4, 4, 1,
              56, 33, 7, 1
            ],
            audio: 'shortwhiff',
            hitbubbles: [
              {
                type: 'aerial',
                follow: 'rhand',
                radius: 20,
                damage: 13,
                knockback: 6,
                growth: 13,
                angle: 50
              },
              {
                type: 'aerial',
                follow: 'body',
                radius: 20,
                damage: 13,
                knockback: 6,
                growth: 13,
                angle: 50
              }
            ]
          },
          {
            duration: 1,
            hitbubbles: true
          },
          {
            duration: 1,
            hitbubbles: true
          },
          {
            duration: 1,
            hitbubbles: [
              {
                type: 'aerial',
                follow: 'rhand',
                radius: 20,
                damage: 7,
                knockback: 7,
                growth: 7,
                angle: 50
              },
              {
                type: 'aerial',
                follow: 'body',
                radius: 20,
                damage: 7,
                knockback: 7,
                growth: 7,
                angle: 30
              }
            ]
          },
          {
            duration: 1,
            hitbubbles: [
              {
                type: 'aerial',
                follow: 'body',
                radius: 20,
                damage: 7,
                knockback: 7,
                growth: 7,
                angle: 30
              }
            ]
          },
          {
            duration: 1,
            hitbubbles: true
          },
          {
            duration: 1,
            hitbubbles: true
          },
          {
            duration: 24
          },
          {
            duration: 5,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, 4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      },
      {
        name: 'dair',
        cancel: 22,
        cancellable: '',
        type: 2,
        early: 4,
        iasa: 4,
        late: 10,
        keyframes: [
          {
            duration: 5,
            hurtbubbles: [
              5, -4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, -4, 4, 1,
              5, 20, 7, 1
            ]
          },
          {
            duration: 4,
            hurtbubbles: [
              -20, 60, 7, 1,
              -4, 70, 7, 1,
              2, 30, 5, 1,
              2, 30, 25, 1,
              4, 70, 7, 1,
              20, 60, 7, 1
            ]
          },
          {
            duration: 5,
            hurtbubbles: [
              -20, 60, 7, 1,
              -4, 70, 7, 1,
              2, 30, 5, 1,
              2, 30, 25, 1,
              4, 70, 7, 1,
              20, 60, 7, 1
            ]
          },
          {
            duration: 6,
            hurtbubbles: [
              -20, 0, 7, 1,
              -4, -10, 7, 1,
              2, 30, 5, 1,
              2, 30, 25, 1,
              4, -10, 7, 1,
              20, 0, 7, 1
            ],
            audio: 'longwhiff',
            hitbubbles: [
              {
                type: 'aerial',
                flags: 'meteor',
                x: 12,
                y: 5,
                radius: 13,
                damage: 9,
                knockback: 6,
                growth: 12,
                angle: 270
              },
              {
                type: 'aerial',
                flags: 'meteor',
                x: -5,
                y: 0,
                radius: 13,
                damage: 9,
                knockback: 6,
                growth: 12,
                angle: 270
              },
              {
                type: 'aerial',
                x: 5,
                y: 5,
                radius: 30,
                damage: 6,
                knockback: 9,
                growth: 9,
                angle: 90
              },
              {
                type: 'aerial',
                x: -10,
                y: 0,
                radius: 30,
                damage: 6,
                knockback: 9,
                growth: 9,
                angle: 90
              }
            ]
          },
          {
            duration: 25,
            hurtbubbles: [
              -20, 0, 7, 1,
              -4, -10, 7, 1,
              2, 30, 5, 1,
              2, 30, 25, 1,
              4, -10, 7, 1,
              20, 0, 7, 1
            ],
            hitbubbles: [
              {
                type: 'aerial',
                x: 5,
                y: 5,
                radius: 30,
                damage: 6,
                knockback: 9,
                growth: 9,
                angle: 90
              },
              {
                type: 'aerial',
                x: -10,
                y: 0,
                radius: 30,
                damage: 6,
                knockback: 9,
                growth: 9,
                angle: 90
              }
            ]
          },
          {
            duration: 14,
            hurtbubbles: [
              -20, 0, 7, 1,
              -4, -10, 7, 1,
              2, 30, 5, 1,
              2, 30, 25, 1,
              4, -10, 7, 1,
              20, 0, 7, 1
            ]
          },
          {
            duration: 5,
            hurtbubbles: [
              5, -4, 4, 1,
              10, 20, 7, 1,
              0, 15, 5, 1,
              2, 30, 25, 1,
              -2, -4, 4, 1,
              5, 20, 7, 1
            ]
          }
        ]
      }
    ]
  })
  window.dispatchEvent(evt)
}())
