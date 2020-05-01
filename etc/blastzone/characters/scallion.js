/* eslint-disable */
;(function () {
  'use strict'
  const evt = new Event('characterloaded')
  const { lqrandomSync } = ImportMath()
  const { Hitbubble } = ImportAnimation()
  const hbColor = 20
  const tipColor = 52
  const grabColor = 101
  const ox = -75
  const oy = -80
  evt.characterData = () => ({
    name: 'Scallion',
    hurtbubbles: [
      'rhand', 1, 0, // front-hand
      'rfoot', 0, 2, // front-foot
      'body', 2, 2,
      'head', 3, 3, // head
      'lfoot', 4, 2, // back-foot
      'lhand', 5, 4 // back-hand
    ],
    headbubble: 3,
    walkSpeed: 5,
    arcSpeed: 0.8,
    fallSpeed: 0.8,
    maxFallSpeed: 10,
    fastfallSpeed: 14,
    initialFallSpeed: 1.5,
    aerodynamics: 0.99,
    fallFriction: 0.99,
    carryMomentum: 0.75,
    arcWeight: 0.97,
    weight: 0.97,
    launchResistance: 5,
    flinchThreshold: 3,
    softland: 10,
    moonwalk: 8,
    airAcceleration: 0.18,
    airSpeed: 3,
    sdi: 5,
    asdi: 2,
    stunMod: 1,
    kbDecayMod: 1,
    stunBreak: 0.5,
    height: 40,
    width: 10,
    grabDirections: 4,
    reverseGrabRange: 35,
    forwardGrabRange: 40,
    grabStart: 20,
    grabHeight: 30,
    friction: 0.8,
    kbFriction: 0.8,
    slideFriction: 0.80,
    slideDecay: 1.0,
    shieldMultiplier: 0.6,
    shieldMinSize: 13,
    shieldGrowth: 15,
    shieldReset: 0.5,
    lightShieldGrowth: 15,
    shieldMobility: 17,
    powershieldSize: 25,
    shieldRegen: 0.0030,
    shieldDecay: 0.0020,
    shieldX: 2,
    shieldY: 35,
    shieldX2: 2,
    shieldY2: 25,
    landingAudio: 'landing',
    heavyLandingAudio: 'heavy_landing',
    lagCancelAudio: 'landing',
    /*backdrop: [
      [75 + ox,25 + oy],
      [25 + ox,25 + oy,25 + ox,62.5 + oy],
      [25 + ox,100 + oy,50 + ox,100 + oy],
      [50 + ox,120 + oy,30 + ox,125 + oy],
      [60 + ox,120 + oy,65 + ox,100 + oy],
      [125 + ox,100 + oy,125 + ox,62.5 + oy],
      [125 + ox,25 + oy,75 + ox,25 + oy]
    ],
    backdropFollow: 2,*/
    /*
      bone documentation..
      pitch: looking up-down on the 2D plane
      yaw: looking left/right on the 2D plane
      roll: twisting on the 2D plane
    */
    bones: [
      {
        name: 'torso',
        transform: {
          x: 0,
          y: 24,
          z: 0,
        },
        length: 0,
        radius: 9,
        parent: null, // gets set to character's base transform
        at: 1,
      },
      {
        name: 'head',
        transform: {
          x: 1,
          y: 21,
          z: 0,
        },
        length: 0,
        radius: 13,
        parent: 'torso',
        at: 1,
      },
      {
        name: 'arm.L',
        transform: {
          x: 0,
          y: 0,
          z: 0,
          pitch: 90,
        },
        length: 0,
        radius: 13,
        parent: 'torso',
        at: 1,
      },
    ],
    animations: [
      {
        name: 'airborne-cancel',
        cancellable: '',
        noCancel: 'platformdrop',
        type: 4,
        iasa: 10,
        keyframes: [
          {
            interpolate: true,
            duration: 6,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 5, 5, 1,
              0, 15, 9, 1,
              1, 30, 10, 1,
              -5, 4, 4, 1,
              5, 5, 5, 1
            ]
          },
          {
            duration: 3,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 5, 5, 1,
              0, 15, 9, 1,
              1, 30, 10, 1,
              -5, 4, 4, 1,
              5, 5, 5, 1
            ]
          },
          {
            duration: 5,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 5, 5, 1,
              0, 15, 9, 1,
              1, 30, 10, 1,
              -5, 4, 4, 1,
              5, 5, 5, 1
            ]
          },
          {
            duration: 4,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
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
            interpolate: true,
            duration: 6,
            hurtbubbles: [
              10, 4, 4, 1,
              2, 15, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              2, 15, 5, 1
            ]
          },
          {
            duration: 20,
            hurtbubbles: [
              10, 4, 4, 1,
              2, 15, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              2, 15, 5, 1
            ]
          },
          {
            duration: 30,
            hurtbubbles: [
              10, 4, 4, 1,
              1, 15, 5, 1,
              0, 24, 9, 1,
              2, 45, 10, 1,
              -5, 4, 4, 1,
              2.5, 15, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              10, 4, 4, 1,
              2, 15, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              2, 15, 5, 1
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
              10, 4, 4, 1,
              2, 15, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              2, 15, 5, 1
            ]
          },
          {
            duration: 8,
            hurtbubbles: [
              10, 4, 4, 1,
              1, 15, 5, 1,
              0, 24, 9, 1,
              2, 45, 10, 1,
              -5, 4, 4, 1,
              2.5, 15, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              10, 4, 4, 1,
              2, 15, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              2, 15, 5, 1
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
              -10, 25, 5, 1,
              5, 15, 9, 1,
              15, 25, 10, 1,
              -2, 4, 4, 1,
              -13, 25, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              0, 4, 4, 1,
              -10, 25, 5, 1,
              5, 15, 9, 1,
              15, 25, 10, 1,
              -2, 4, 4, 1,
              -13, 25, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              0, 4, 4, 1,
              10, 22, 5, 1,
              -5, 15, 9, 1,
              -10, 35, 10, 1,
              -2, 4, 4, 1,
              5, 18, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              0, 4, 4, 1,
              10, 20, 5, 1,
              0, 15, 9, 1,
              2, 30, 10, 1,
              -2, 4, 4, 1,
              5, 20, 5, 1
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
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 2,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 22, 5, 1,
              0, 15, 9, 1,
              6, 35, 10, 1,
              -2, 4, 4, 1,
              5, 18, 5, 1
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
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 20,
            hurtbubbles: [
              5, 4, 8, 1,
              10, 20, 9, 1,
              0, 15, 4, 1,
              2, 30, 22, 1,
              -2, 4, 35, 1,
              5, 20, 2, 1
            ]
          },
          {
            duration: 20,
            hurtbubbles: [
              -15, 4, 2, 1,
              -5, 45, 20, 1,
              0, 15, 3, 1,
              0, 35, 8, 1,
              15, 4, 30, 1,
              35, 18, 12, 1
            ]
          },
          {
            duration: 20,
            hurtbubbles: [
              5, 4, 25, 1,
              10, 20, 10, 1,
              0, 15, 4, 1,
              2, 30, 22, 1,
              -2, 4, 1, 1,
              5, 20, 22, 1
            ]
          },
          {
            duration: 6,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
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
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 20,
            hurtbubbles: [
              -15, 4, 4, 1,
              -35, 18, 5, 1,
              0, 24, 9, 1,
              0, 45, 10, 1,
              15, 4, 4, 1,
              35, 18, 5, 1
            ]
          },
          {
            duration: 20,
            hurtbubbles: [
              -15, 4, 4, 1,
              -5, 50, 5, 1,
              0, 24, 9, 1,
              0, 45, 10, 1,
              15, 4, 4, 1,
              35, 18, 5, 1
            ]
          },
          {
            duration: 20,
            hurtbubbles: [
              -15, 4, 4, 1,
              -5, 50, 5, 1,
              0, 24, 9, 1,
              0, 45, 10, 1,
              15, 4, 4, 1,
              35, 18, 5, 1
            ]
          },
          {
            duration: 6,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
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
              10, 4, 4, 5,
              10, 20, 5, 5,
              0, 24, 9, 5,
              1, 45, 10, 5,
              -5, 4, 4, 5,
              5, 20, 5, 5
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
              10, 4, 4, 5,
              10, 20, 5, 5,
              0, 24, 9, 5,
              1, 45, 10, 5,
              -5, 4, 4, 5,
              5, 20, 5, 5
            ]
          },
          {
            duration: 180,
            hurtbubbles: [
              10, 4, 4, 5,
              10, 20, 5, 5,
              0, 24, 9, 5,
              1, 45, 10, 5,
              -5, 4, 4, 5,
              5, 20, 5, 5
            ]
          },
          {
            duration: 180,
            hurtbubbles: [
              10, 4, 4, 5,
              10, 20, 5, 5,
              0, 24, 9, 5,
              1, 45, 10, 5,
              -5, 4, 4, 5,
              5, 20, 5, 5
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
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 42, 5, 1,
              0, 15, 9, 1,
              6, 35, 10, 1,
              -2, 4, 4, 1,
              5, 38, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 40, 5, 1,
              0, 15, 9, 1,
              2, 30, 10, 1,
              -2, 4, 4, 1,
              5, 40, 5, 1
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
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 5,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 42, 5, 1,
              0, 21, 9, 1,
              6, 40, 10, 1,
              -2, 4, 4, 1,
              5, 38, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 40, 5, 1,
              0, 21, 9, 1,
              2, 40, 10, 1,
              -2, 4, 4, 1,
              5, 40, 5, 1
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
            duration: 2,
            interpolate: true,
            hurtbubbles: [
              10, 6, 4, 1,
              1, 40, 5, 1,
              -6, 19, 9, 1,
              -15, 34, 10, 1,
              -2, 0, 4, 1,
              -12, 37, 5, 1
            ]
          },
          {
            duration: 2,
            hurtbubbles: [
              10, 6, 4, 1,
              1, 40, 5, 1,
              -6, 19, 9, 1,
              -15, 34, 10, 1,
              -2, 0, 4, 1,
              -12, 37, 5, 1
            ]
          },
          {
            duration: 5,
            hurtbubbles: [
              10, 6, 4, 1,
              1, 40, 5, 1,
              -6, 19, 9, 1,
              -15, 34, 10, 1,
              -2, 0, 4, 1,
              -12, 37, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              10, 6, 4, 1,
              1, 40, 5, 1,
              -6, 19, 9, 1,
              -15, 34, 10, 1,
              -2, 0, 4, 1,
              -12, 37, 5, 1
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
            duration: 2,
            interpolate: true,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              -2, 24, 9, 1,
              -3, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 2,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              -2, 24, 9, 1,
              -3, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 5,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 42, 5, 1,
              0, 21, 9, 1,
              6, 40, 10, 1,
              -2, 4, 4, 1,
              5, 38, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 40, 5, 1,
              0, 21, 9, 1,
              2, 40, 10, 1,
              -2, 4, 4, 1,
              5, 40, 5, 1
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
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 5,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 42, 5, 1,
              0, 21, 9, 1,
              6, 40, 10, 1,
              -2, 4, 4, 1,
              5, 38, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 40, 5, 1,
              0, 21, 9, 1,
              2, 40, 10, 1,
              -2, 4, 4, 1,
              5, 40, 5, 1
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
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 42, 5, 1,
              0, 21, 9, 1,
              6, 40, 10, 1,
              -2, 4, 4, 1,
              5, 38, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 40, 5, 1,
              0, 21, 9, 1,
              2, 40, 10, 1,
              -2, 4, 4, 1,
              5, 40, 5, 1
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
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 42, 5, 1,
              0, 21, 9, 1,
              6, 40, 10, 1,
              -2, 4, 4, 1,
              5, 38, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 40, 5, 1,
              0, 21, 9, 1,
              2, 40, 10, 1,
              -2, 4, 4, 1,
              5, 40, 5, 1
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
              10, 42, 5, 1,
              0, 21, 9, 1,
              6, 40, 10, 1,
              -2, 4, 4, 1,
              5, 38, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 42, 5, 1,
              0, 21, 9, 1,
              6, 40, 10, 1,
              -2, 4, 4, 1,
              5, 38, 5, 1
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
              10, 6, 4, 1,
              1, 40, 5, 1,
              -6, 19, 9, 1,
              -15, 34, 10, 1,
              -2, 0, 4, 1,
              -12, 37, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              10, 6, 4, 1,
              1, 40, 5, 1,
              -6, 19, 9, 1,
              -15, 34, 10, 1,
              -2, 0, 4, 1,
              -12, 37, 5, 1
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
              10, 42, 5, 1,
              0, 21, 9, 1,
              6, 40, 10, 1,
              -2, 4, 4, 1,
              5, 38, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 42, 5, 1,
              0, 21, 9, 1,
              6, 40, 10, 1,
              -2, 4, 4, 1,
              5, 38, 5, 1
            ]
          }
        ]
      },
      {
        name: 'flinch',
        cancellable: '',
        cancel: 'fall',
        starKO: true,
        noFastfall: true,
        techable: true,
        nodi: true,
        type: 4,
        slid: 'tumble',
        handler: 'stumble',
        transition: 'idle',
        keyframes: [
          {
            duration: 10,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 42, 5, 1,
              0, 21, 9, 1,
              6, 40, 10, 1,
              -2, 4, 4, 1,
              5, 38, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 40, 5, 1,
              0, 21, 9, 1,
              2, 40, 10, 1,
              -2, 4, 4, 1,
              5, 40, 5, 1
            ]
          }
        ]
      },
      {
        name: 'air-flinch',
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
              10, 42, 5, 1,
              0, 21, 9, 1,
              6, 40, 10, 1,
              -2, 4, 4, 1,
              5, 38, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 42, 5, 1,
              0, 21, 9, 1,
              6, 40, 10, 1,
              -2, 4, 4, 1,
              5, 38, 5, 1
            ]
          }
        ]
      },
      {
        name: 'meteor',
        cancellable: 'airupspecial.airjump0',
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
              10, 42, 5, 1,
              0, 21, 9, 1,
              6, 40, 10, 1,
              -2, 4, 4, 1,
              5, 38, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 42, 5, 1,
              0, 21, 9, 1,
              6, 40, 10, 1,
              -2, 4, 4, 1,
              5, 38, 5, 1
            ]
          }
        ]
      },
      {
        name: 'weakstumble',
        cancellable: '',
        starKO: true,
        type: 4,
        slid: 'weakstunned',
        noFastfall: true,
        handler: 'weakstumble',
        transition: 'weakstumble',
        keyframes: [
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 42, 5, 1,
              0, 21, 9, 1,
              6, 40, 10, 1,
              -2, 4, 4, 1,
              5, 38, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 42, 5, 1,
              0, 21, 9, 1,
              6, 40, 10, 1,
              -2, 4, 4, 1,
              5, 38, 5, 1
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
              10, 42, 5, 1,
              0, 21, 9, 1,
              6, 40, 10, 1,
              -2, 4, 4, 1,
              5, 38, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 42, 5, 1,
              0, 21, 9, 1,
              6, 40, 10, 1,
              -2, 4, 4, 1,
              5, 38, 5, 1
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
            interpolate: true,
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 22, 5, 1,
              0, 21, 9, 1,
              6, 40, 10, 1,
              -2, 4, 4, 1,
              5, 18, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 22, 5, 1,
              0, 21, 9, 1,
              6, 40, 10, 1,
              -2, 4, 4, 1,
              5, 18, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 42, 5, 1,
              0, 21, 9, 1,
              6, 40, 10, 1,
              -2, 4, 4, 1,
              5, 38, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 42, 5, 1,
              0, 21, 9, 1,
              6, 40, 10, 1,
              -2, 4, 4, 1,
              5, 38, 5, 1
            ]
          }
        ]
      },
      {
        name: 'crouch',
        cancellable: 'all',
        noCancel: 'walk.walkpivot.stride.dash.dashpivot',
        type: 0,
        handler: 'crouch',
        transition: 'crouched',
        keyframes: [
          {
            duration: 3,
            interpolate: true,
            hurtbubbles: [
              12, 4, 4, 1,
              10, 10, 5, 1,
              0, 12, 9, 1,
              3, 24, 10, 1,
              -6, 4, 4, 1,
              5, 10, 5, 1
            ]
          },
          {
            duration: 3,
            hurtbubbles: [
              12, 4, 4, 1,
              10, 10, 5, 1,
              0, 12, 9, 1,
              3, 24, 10, 1,
              -6, 4, 4, 1,
              5, 10, 5, 1
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
              10, 10, 5, 1,
              0, 15, 9, 1,
              2, 25, 10, 1,
              -2, 4, 4, 1,
              5, 10, 5, 1
            ]
          },
          {
            duration: 4,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 10, 5, 1,
              0, 15, 9, 1,
              2, 25, 10, 1,
              -2, 4, 4, 1,
              5, 10, 5, 1
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
            duration: 10,
            hurtbubbles: [
              12, 4, 4, 1,
              10, 10, 5, 1,
              0, 12, 9, 1,
              3, 24, 10, 1,
              -6, 4, 4, 1,
              5, 10, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              12, 4, 4, 1,
              10, 10, 5, 1,
              0, 12, 9, 1,
              4, 24, 10, 1,
              -6, 4, 4, 1,
              5, 10, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              12, 4, 4, 1,
              10, 10, 5, 1,
              0, 12, 9, 1,
              3, 24, 10, 1,
              -6, 4, 4, 1,
              5, 10, 5, 1
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
            hurtbubbles: [
              12, 4, 4, 1,
              10, 10, 5, 1,
              0, 12, 9, 1,
              3, 24, 10, 1,
              -6, 4, 4, 1,
              5, 10, 5, 1
            ]
          },
          {
            duration: 3,
            hurtbubbles: [
              10, 4, 4, 1,
              2, 15, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              2, 15, 5, 1
            ]
          }
        ]
      },
      {
        name: 'reset',
        cancellable: '',
        transition: 'idle',
        type: 0,
        ungrabbable: true,
        keyframes: [
          {
            duration: 30,
            interpolate: true,
            hurtbubbles: [
              12, 4, 4, 1,
              10, 10, 5, 1,
              0, 12, 9, 1,
              3, 24, 10, 1,
              -6, 4, 4, 1,
              5, 10, 5, 1
            ]
          },
          {
            duration: 3,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
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
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 20,
            hurtbubbles: [
              5, 4, 4, 1,
              30, 20, 5, 1,
              0, 15, 9, 1,
              6, 30, 10, 1,
              -2, 4, 4, 1,
              30, 20, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 7, 5, 1,
              0, 10, 9, 1,
              6, 15, 10, 1,
              -2, 4, 4, 1,
              5, 7, 5, 1
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
              5, 4, 4, 1,
              25, 5, 5, 1,
              0, 10, 9, 1,
              6, 15, 10, 1,
              -14, 4, 4, 1,
              13, 5, 5, 1
            ]
          },
          {
            duration: 8,
            hurtbubbles: [
              5, 14, 4, 1,
              20, 15, 5, 1,
              0, 15, 9, 1,
              6, 20, 10, 1,
              -10, 14, 4, 1,
              10, 15, 5, 1
            ]
          },
          {
            duration: 7,
            hurtbubbles: [
              5, 14, 4, 1,
              20, 15, 5, 1,
              0, 15, 9, 1,
              6, 20, 10, 1,
              -10, 14, 4, 1,
              10, 15, 5, 1
            ]
          },
          {
            duration: 1,
            effect: 'hop',
            audio: 'landing',
            hurtbubbles: [
              5, 4, 4, 1,
              25, 5, 5, 1,
              0, 10, 9, 1,
              6, 15, 10, 1,
              -14, 4, 4, 1,
              13, 5, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              25, 5, 5, 1,
              0, 10, 9, 1,
              6, 15, 10, 1,
              -14, 4, 4, 1,
              13, 5, 5, 1
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
              5, 4, 4, 1,
              25, 5, 5, 1,
              0, 10, 9, 1,
              6, 15, 10, 1,
              -14, 4, 4, 1,
              13, 5, 5, 1
            ]
          },
          {
            duration: 30,
            hurtbubbles: [
              5, 4, 4, 1,
              25, 5, 5, 1,
              0, 10, 9, 1,
              6, 15, 10, 1,
              -14, 4, 4, 1,
              13, 5, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              25, 5, 5, 1,
              0, 10, 9, 1,
              6, 15, 10, 1,
              -14, 4, 4, 1,
              13, 5, 5, 1
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
              10, 13, 5, 5,
              0, 17, 9, 5,
              6, 25, 10, 5,
              -2, 4, 4, 5,
              7, 5, 5, 5
            ]
          },
          {
            duration: 7,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 13, 5, 1,
              0, 17, 9, 1,
              6, 25, 10, 1,
              -2, 4, 4, 1,
              7, 5, 5, 1
            ]
          },
          {
            duration: 6,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
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
              -10, 20, 5, 5,
              0, 10, 9, 5,
              -2, 15, 10, 5,
              2, 4, 4, 5,
              -5, 20, 5, 5
            ]
          },
          {
            duration: 7,
            hurtbubbles: [
              -5, 4, 4, 5,
              -10, 20, 5, 5,
              0, 10, 9, 5,
              -2, 15, 10, 5,
              2, 4, 4, 5,
              -5, 20, 5, 5
            ]
          },
          {
            duration: 2,
            hurtbubbles: [
              -5, 4, 4, 5,
              -30, 20, 5, 5,
              0, 15, 9, 5,
              -2, 30, 10, 5,
              2, 4, 4, 5,
              0, 20, 5, 5
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
              }
            ]
          },
          {
            duration: 5,
            hurtbubbles: [
              -5, 4, 4, 5,
              -30, 20, 5, 5,
              0, 15, 9, 5,
              -2, 30, 10, 5,
              2, 4, 4, 5,
              0, 20, 5, 5
            ]
          },
          {
            duration: 2,
            hurtbubbles: [
              5, 4, 4, 5,
              30, 20, 5, 5,
              0, 15, 9, 5,
              2, 30, 10, 5,
              -2, 4, 4, 5,
              0, 20, 5, 5
            ],
            audio: 'shortwhiff',
            hitbubbles: [
              {
                type: 'ground',
                x: 30,
                y: 20,
                radius: 23,
                damage: 7,
                knockback: 8,
                growth: 7,
                sakurai: true
              }
            ]
          },
          {
            duration: 23,
            hurtbubbles: [
              5, 4, 4, 1,
              30, 20, 5, 1,
              0, 15, 9, 1,
              2, 30, 10, 1,
              -2, 4, 4, 1,
              0, 20, 5, 1
            ]
          },
          {
            duration: 3,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
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
              10, 7, 5, 5,
              0, 15, 9, 5,
              2, 25, 10, 5,
              -2, 4, 4, 5,
              5, 7, 5, 5
            ]
          },
          {
            duration: 12,
            hurtbubbles: [
              5, 4, 4, 5,
              10, 7, 5, 5,
              0, 15, 9, 5,
              2, 25, 10, 5,
              -2, 4, 4, 5,
              5, 7, 5, 5
            ]
          },
          {
            duration: 4,
            hurtbubbles: [
              5, 4, 4, 5,
              10, 7, 5, 5,
              0, 15, 9, 5,
              2, 25, 10, 5,
              -2, 4, 4, 5,
              5, 7, 5, 5
            ]
          },
          {
            duration: 4,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
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
              10, 7, 5, 5,
              0, 15, 9, 5,
              2, 25, 10, 5,
              -2, 4, 4, 5,
              5, 7, 5, 5
            ]
          },
          {
            duration: 15,
            hurtbubbles: [
              5, 4, 4, 5,
              10, 7, 5, 5,
              0, 15, 9, 5,
              2, 25, 10, 5,
              -2, 4, 4, 5,
              5, 7, 5, 5
            ]
          },
          {
            duration: 6,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 7, 5, 1,
              0, 15, 9, 1,
              2, 25, 10, 1,
              -2, 4, 4, 1,
              5, 7, 5, 1
            ]
          },
          {
            duration: 4,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
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
              10, 7, 5, 5,
              0, 15, 9, 5,
              2, 25, 10, 5,
              -2, 4, 4, 5,
              5, 7, 5, 5
            ]
          },
          {
            duration: 9,
            hurtbubbles: [
              5, 4, 4, 5,
              10, 7, 5, 5,
              0, 15, 9, 5,
              2, 25, 10, 5,
              -2, 4, 4, 5,
              5, 7, 5, 5
            ]
          },
          {
            duration: 9,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 7, 5, 1,
              0, 15, 9, 1,
              2, 25, 10, 1,
              -2, 4, 4, 1,
              5, 7, 5, 1
            ]
          },
          {
            duration: 4,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          }
        ]
      },
      {
        name: 'techforward',
        cancellable: '',
        type: 4,
        friction: 0.96,
        ungrabbable: true,
        slid: 'stop',
        keyframes: [
          {
            duration: 8,
            audio: 'tech',
            hurtbubbles: [
              5, 4, 4, 5,
              5, 35, 5, 5,
              0, 15, 9, 5,
              2, 30, 10, 5,
              -2, 4, 4, 5,
              0, 30, 5, 5
            ]
          },
          {
            duration: 12,
            speed: 3.75,
            hurtbubbles: [
              5, 4, 4, 5,
              5, 35, 5, 5,
              0, 15, 9, 5,
              2, 30, 10, 5,
              -2, 4, 4, 5,
              0, 30, 5, 5
            ]
          },
          {
            duration: 20,
            hurtbubbles: [
              5, 4, 4, 1,
              5, 35, 5, 1,
              0, 15, 9, 1,
              2, 30, 10, 1,
              -2, 4, 4, 1,
              0, 30, 5, 1
            ]
          },
          {
            duration: 1,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          }
        ]
      },
      {
        name: 'techbackward',
        cancellable: '',
        type: 4,
        friction: 0.96,
        ungrabbable: true,
        slid: 'stop',
        keyframes: [
          {
            duration: 8,
            audio: 'tech',
            hurtbubbles: [
              5, 4, 4, 5,
              5, 35, 5, 5,
              0, 15, 9, 5,
              2, 30, 10, 5,
              -2, 4, 4, 5,
              0, 30, 5, 5
            ]
          },
          {
            duration: 12,
            speed: -3.5,
            hurtbubbles: [
              5, 4, 4, 5,
              5, 35, 5, 5,
              0, 15, 9, 5,
              2, 30, 10, 5,
              -2, 4, 4, 5,
              0, 30, 5, 5
            ]
          },
          {
            duration: 20,
            hurtbubbles: [
              5, 4, 4, 1,
              5, 35, 5, 1,
              0, 15, 9, 1,
              2, 30, 10, 1,
              -2, 4, 4, 1,
              0, 30, 5, 1
            ]
          },
          {
            duration: 1,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
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
            interpolate: true,
            duration: 5,
            hurtbubbles: [
              12, -4, 4, 1,
              -4, 37, 5, 1,
              0, 17, 9, 1,
              1, 37, 10, 1,
              -5, -4, 4, 1,
              4, 39, 5, 1
            ]
          },
          {
            duration: 20,
            hurtbubbles: [
              12, -4, 4, 1,
              -4, 37, 5, 1,
              0, 17, 9, 1,
              1, 37, 10, 1,
              -5, -4, 4, 1,
              4, 39, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              12, -4, 4, 1,
              -4, 37, 5, 1,
              0, 17, 9, 1,
              1, 37, 10, 1,
              -5, -4, 4, 1,
              4, 39, 5, 1
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
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 15,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
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
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
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
            duration: 24,
            interpolate: true,
            hurtbubbles: [
              -14, 24, 4, 1,
              20, 29, 5, 1,
              2, 9, 9, 1,
              12, 20, 10, 1,
              -19, 17, 4, 1,
              26, 15, 5, 1
            ]
          },
          {
            duration: 40,
            hurtbubbles: [
              -14, 24, 4, 1,
              20, 29, 5, 1,
              2, 9, 9, 1,
              12, 20, 10, 1,
              -19, 17, 4, 1,
              26, 15, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              -14, 24, 4, 1,
              20, 29, 5, 1,
              2, 9, 9, 1,
              12, 20, 10, 1,
              -19, 17, 4, 1,
              26, 15, 5, 1
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
        yOffset: 45,
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
              0, -7, 5, 1,
              -10, -35, 9, 1,
              -8, -20, 10, 1,
              -12, -54, 4, 1,
              -5, -7, 5, 1
            ]
          },
          {
            duration: 10,
            handler: 'ledgehang',
            hurtbubbles: [
              -5, -54, 4, 1,
              0, -7, 5, 1,
              -10, -35, 9, 1,
              -8, -20, 10, 1,
              -12, -54, 4, 1,
              -5, -7, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              -5, -54, 4, 1,
              0, -7, 5, 1,
              -10, -35, 9, 1,
              -8, -20, 10, 1,
              -12, -54, 4, 1,
              -5, -7, 5, 1
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
              10, 20, 5, 1,
              0, 15, 9, 1,
              2, 30, 10, 1,
              -2, -4, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, -4, 4, 1,
              10, 22, 5, 1,
              0, 15, 9, 1,
              2, 30, 10, 1,
              -2, -4, 4, 1,
              5, 15, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, -4, 4, 1,
              10, 20, 5, 1,
              0, 15, 9, 1,
              2, 30, 10, 1,
              -2, -4, 4, 1,
              5, 20, 5, 1
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
        yOffset: 45,
        handler: 'ledgehang',
        ungrabbable: true,
        interrupted: 'ledgehit',
        keyframes: [
          {
            duration: 20,
            hurtbubbles: [
              -5, -54, 4, 1,
              0, -7, 5, 1,
              -10, -35, 9, 1,
              -8, -20, 10, 1,
              -12, -54, 4, 1,
              -5, -7, 5, 1
            ]
          },
          {
            duration: 20,
            hurtbubbles: [
              -5, -54, 4, 1,
              0, -7, 5, 1,
              -10, -35, 9, 1,
              -8, -20, 10, 1,
              -12, -54, 4, 1,
              -5, -7, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              -5, -54, 4, 1,
              0, -7, 5, 1,
              -10, -35, 9, 1,
              -8, -20, 10, 1,
              -12, -54, 4, 1,
              -5, -7, 5, 1
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
        yOffset: 45,
        ungrabbable: true,
        keyframes: [
          {
            duration: 10,
            hurtbubbles: [
              -5, -54, 4, 5,
              0, -7, 5, 5,
              -10, -35, 9, 5,
              -8, -20, 10, 5,
              -12, -54, 4, 5,
              -5, -7, 5, 5
            ]
          },
          {
            duration: 8,
            hurtbubbles: [
              -5, 4, 4, 5,
              0, 20, 5, 5,
              -10, 15, 9, 5,
              -8, 30, 10, 5,
              -12, 4, 4, 5,
              -5, 20, 5, 5
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
              10, 20, 5, 1,
              0, 15, 9, 1,
              2, 30, 10, 1,
              -2, 4, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 5,
            hurtbubbles: [
              5, 4, 4, 1,
              30, 20, 5, 1,
              0, 15, 9, 1,
              2, 30, 10, 1,
              -2, 4, 4, 1,
              0, 20, 5, 1
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
              30, 20, 5, 1,
              0, 15, 9, 1,
              2, 30, 10, 1,
              -2, 4, 4, 1,
              0, 20, 5, 1
            ]
          },
          {
            duration: 3,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
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
        yOffset: 45,
        ungrabbable: true,
        keyframes: [
          {
            duration: 18,
            hurtbubbles: [
              -5, -54, 4, 5,
              0, -7, 5, 5,
              -10, -35, 9, 5,
              -8, -20, 10, 5,
              -12, -54, 4, 5,
              -5, -7, 5, 5
            ]
          },
          {
            duration: 20,
            hurtbubbles: [
              -5, 4, 4, 5,
              0, 20, 5, 5,
              -10, 15, 9, 5,
              -8, 30, 10, 5,
              -12, 4, 4, 5,
              -5, 20, 5, 5
            ]
          },
          {
            duration: 15,
            dx: 4,
            hurtbubbles: [
              5, 4, 4, 5,
              10, 20, 5, 5,
              0, 15, 9, 5,
              2, 30, 10, 5,
              -2, 4, 4, 5,
              5, 20, 5, 5
            ]
          },
          {
            duration: 5,
            hurtbubbles: [
              5, 4, 4, 1,
              30, 20, 5, 1,
              0, 15, 9, 1,
              2, 30, 10, 1,
              -2, 4, 4, 1,
              0, 20, 5, 1
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
            duration: 3,
            hurtbubbles: [
              5, 4, 4, 1,
              30, 20, 5, 1,
              0, 15, 9, 1,
              2, 30, 10, 1,
              -2, 4, 4, 1,
              0, 20, 5, 1
            ]
          },
          {
            duration: 3,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
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
        yOffset: 45,
        ungrabbable: true,
        keyframes: [
          {
            duration: 16,
            hurtbubbles: [
              -5, -54, 4, 5,
              0, -7, 5, 5,
              -10, -35, 9, 5,
              -8, -20, 10, 5,
              -12, -54, 4, 5,
              -5, -7, 5, 5
            ]
          },
          {
            duration: 14,
            hurtbubbles: [
              -5, 4, 4, 5,
              0, 20, 5, 5,
              -10, 15, 9, 5,
              -8, 30, 10, 5,
              -12, 4, 4, 5,
              -5, 20, 5, 5
            ]
          },
          {
            duration: 5,
            dx: 2,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
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
        yOffset: 45,
        ungrabbable: true,
        keyframes: [
          {
            duration: 30,
            hurtbubbles: [
              -5, -54, 4, 5,
              0, -7, 5, 5,
              -10, -35, 9, 5,
              -8, -20, 10, 5,
              -12, -54, 4, 5,
              -5, -7, 5, 5
            ]
          },
          {
            duration: 25,
            hurtbubbles: [
              -5, 4, 4, 5,
              0, 20, 5, 5,
              -10, 15, 9, 5,
              -8, 30, 10, 5,
              -12, 4, 4, 5,
              -5, 20, 5, 5
            ]
          },
          {
            duration: 5,
            dx: 2,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
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
        yOffset: 45,
        ungrabbable: true,
        keyframes: [
          {
            duration: 5,
            hurtbubbles: [
              -5, -54, 4, 5,
              0, -7, 4, 5,
              -10, -35, 9, 5,
              -8, -20, 10, 5,
              -12, -54, 4, 5,
              -5, -7, 5, 5
            ]
          },
          {
            duration: 5,
            hurtbubbles: [
              -5, 4, 4, 5,
              0, 20, 5, 5,
              -10, 15, 9, 5,
              -8, 30, 10, 5,
              -12, 4, 4, 5,
              -5, 20, 5, 5
            ]
          },
          {
            duration: 5,
            hurtbubbles: [
              5, 4, 4, 5,
              10, 20, 5, 5,
              0, 15, 9, 5,
              2, 30, 10, 5,
              -2, 4, 4, 5,
              5, 20, 5, 5
            ]
          },
          {
            duration: 15,
            speed: 5,
            hurtbubbles: [
              5, 4, 4, 5,
              10, 20, 5, 5,
              0, 15, 9, 5,
              2, 30, 10, 5,
              -2, 4, 4, 5,
              5, 20, 5, 5
            ]
          },
          {
            duration: 15,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 5, 1,
              0, 15, 9, 1,
              2, 30, 10, 1,
              -2, 4, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
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
        yOffset: 45,
        ungrabbable: true,
        keyframes: [
          {
            duration: 20,
            hurtbubbles: [
              -5, -54, 4, 5,
              0, -7, 4, 5,
              -10, -35, 9, 5,
              -8, -20, 10, 5,
              -12, -54, 4, 5,
              -5, -7, 5, 5
            ]
          },
          {
            duration: 12,
            hurtbubbles: [
              -5, 4, 4, 5,
              0, 20, 5, 5,
              -10, 15, 9, 5,
              -8, 30, 10, 5,
              -12, 4, 4, 5,
              -5, 20, 5, 5
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 5,
              10, 20, 5, 5,
              0, 15, 9, 5,
              2, 30, 10, 5,
              -2, 4, 4, 5,
              5, 20, 5, 5
            ]
          },
          {
            duration: 20,
            speed: 6,
            hurtbubbles: [
              5, 4, 4, 5,
              10, 20, 5, 5,
              0, 15, 9, 5,
              2, 30, 10, 5,
              -2, 4, 4, 5,
              5, 20, 5, 5
            ]
          },
          {
            duration: 18,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 5, 1,
              0, 15, 9, 1,
              2, 30, 10, 1,
              -2, 4, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          }
        ]
      },
      {
        name: 'ledgehop',
        cancellable: '',
        disableIK: true,
        type: 4,
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
              0, -7, 5, 5,
              -10, -35, 9, 5,
              -8, -20, 10, 5,
              -12, -54, 4, 5,
              -5, -7, 5, 5
            ]
          },
          {
            duration: 5,
            airborne: true,
            speed: 12,
            dx: 5,
            jumpSpeed: 14,
            hurtbubbles: [
              -5, 4, 4, 1,
              -10, 20, 5, 1,
              0, 15, 9, 1,
              -2, 30, 10, 1,
              -2, 4, 4, 1,
              -5, 20, 5, 1
            ]
          },
          {
            duration: 20,
            hurtbubbles: [
              5, -8, 4, 1,
              10, 45, 5, 1,
              0, 15, 9, 1,
              2, 35, 10, 1,
              -2, -8, 4, 1,
              5, 15, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, -4, 4, 1,
              10, 20, 5, 1,
              0, 15, 9, 1,
              2, 30, 10, 1,
              -2, -4, 4, 1,
              5, 20, 5, 1
            ]
          }
        ]
      },
      {
        name: 'walk',
        cancellable: 'all',
        cancel: 'walk',
        noiasa: true,
        unbufferable: true,
        disableIK: true,
        type: 0,
        handler: 'walk',
        transition: 'walk',
        slid: 'stop',
        keyframes: [
          {
            interpolate: true,
            duration: 13,
            hurtbubbles: [
              14, 8, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -12, 8, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 13,
            hurtbubbles: [
              14, 8, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -12, 8, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 13,
            hurtbubbles: [
              3, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              2, 8, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 13,
            hurtbubbles: [
              -10, 8, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              12, 8, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 13,
            hurtbubbles: [
              -2, 8, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              6, 4, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 13,
            hurtbubbles: [
              14, 8, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -12, 8, 4, 1,
              5, 20, 5, 1
            ]
          },
        ]
      },
      {
        name: 'stride',
        cancellable: 'all',
        transition: 'stride',
        noiasa: true,
        disableIK: true,
        handler: 'walk',
        unbufferable: true,
        type: 0,
        keyframes: [
          {
            interpolate: true,
            duration: 8,
            hurtbubbles: [
              14, 8, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -12, 8, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 8,
            hurtbubbles: [
              14, 8, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -12, 8, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 8,
            hurtbubbles: [
              3, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              2, 8, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 8,
            hurtbubbles: [
              -10, 8, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              12, 8, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 3,
            hurtbubbles: [
              -2, 8, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              6, 4, 4, 1,
              5, 20, 5, 1
            ]
          }
        ]
      },
      {
        name: 'dash',
        cancellable: 'dash.grab.dashattack.sidespecial.upspecial.pivot.skid.run.usmash.jump.hop.jab.ftilt.dsmash.shieldup.powershield.trip.dtaunt.staunt.utaunt',
        type: 0,
        scaleSpeed: 9,
        initialSpeed: 5,
        unbufferable: true,
        passthrough: false,
        disableIK: true,
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
            duration: 6,
            cancellable: 'fsmash.fsmashpivot',
            hurtbubbles: [
              -10, 4, 4, 1,
              10, 20, 5, 1,
              3, 24, 9, 1,
              7, 45, 10, 1,
              20, 8, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 12,
            hurtbubbles: [
              -10, 4, 4, 1,
              10, 20, 5, 1,
              3, 24, 9, 1,
              7, 45, 10, 1,
              20, 8, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 5,
            hurtbubbles: [
              -2, 12, 4, 1,
              10, 20, 5, 1,
              3, 24, 9, 1,
              7, 45, 10, 1,
              6, 4, 4, 1,
              5, 20, 5, 1
            ]
          }
        ]
      },
      {
        name: 'run',
        cancellable: 'dtaunt.staunt.utaunt.dash.run.grab.usmash.sidespecial.groundspecial.downspecial.upspecial.dsmash.fsmash.skid.turnaround.jump.hop.jab.ftilt.crouch.shieldup.powershield.trip',
        unbufferable: true,
        disableIK: true,
        type: 0,
        runSpeed: 7.7,
        transition: 'run',
        handler: 'run',
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
              -2, 12, 4, 1,
              10, 20, 5, 1,
              3, 24, 9, 1,
              7, 45, 10, 1,
              6, 4, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 5,
            hurtbubbles: [
              14, 8, 4, 1,
              10, 20, 5, 1,
              3, 24, 9, 1,
              7, 45, 10, 1,
              -12, 8, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 5,
            hurtbubbles: [
              3, 4, 4, 1,
              10, 20, 5, 1,
              3, 24, 9, 1,
              7, 45, 10, 1,
              2, 12, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 5,
            hurtbubbles: [
              -10, 8, 4, 1,
              10, 20, 5, 1,
              3, 24, 9, 1,
              7, 45, 10, 1,
              12, 8, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 3,
            hurtbubbles: [
              -2, 12, 4, 1,
              10, 20, 5, 1,
              3, 24, 9, 1,
              7, 45, 10, 1,
              6, 4, 4, 1,
              5, 20, 5, 1
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
              -10, 20, 5, 1,
              0, 24, 9, 1,
              -2, 45, 10, 1,
              2, 4, 4, 1,
              -5, 20, 5, 1
            ]
          },
          {
            duration: 5,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
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
              -10, 20, 5, 1,
              0, 24, 9, 1,
              -2, 45, 10, 1,
              2, 4, 4, 1,
              -5, 20, 5, 1
            ]
          },
          {
            duration: 5,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
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
              -10, 20, 5, 1,
              0, 24, 9, 1,
              -2, 45, 10, 1,
              2, 4, 4, 1,
              -5, 20, 5, 1
            ]
          },
          {
            duration: 5,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
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
            duration: 12,
            hurtbubbles: [
              2, -4, 4, 1,
              0, 35, 5, 1,
              0, 24, 9, 1,
              2, 45, 10, 1,
              -5, -4, 4, 1,
              -5, 30, 5, 1
            ]
          },
          {
            duration: 16,
            hurtbubbles: [
              2, -4, 4, 1,
              0, 35, 5, 1,
              0, 24, 9, 1,
              2, 45, 10, 1,
              -5, -4, 4, 1,
              -5, 30, 5, 1
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
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 5,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
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
            duration: 20,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 5,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          }
        ]
      },
      {
        name: 'turnaround',
        cancellable: 'sidespecial.upspecial.skid.turnaround.jump.hop',
        type: 4,
        friction: 0.95,
        slid: 'dashslid',
        transition: 'idle',
        end: 'turnaround',
        keyframes: [
          {
            interpolate: true,
            duration: 8,
            hurtbubbles: [
              20, 4, 4, 1,
              10, 20, 5, 1,
              -2, 24, 9, 1,
              -8, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              20, 4, 4, 1,
              10, 20, 5, 1,
              -2, 24, 9, 1,
              -8, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 15,
            hurtbubbles: [
              -10, 4, 4, 1,
              -10, 20, 5, 1,
              0, 24, 9, 1,
              -1, 45, 10, 1,
              5, 4, 4, 1,
              -5, 20, 5, 1
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
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
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
        carryMomentum: 0.25,
        di: 4,
        upward: 16,
        interrupted: 'airjump',
        keyframes: [
          {
            duration: 10,
            audio: 'asper_djump',
            hurtbubbles: [
              12, -4, 4, 1,
              -4, 37, 5, 1,
              0, 17, 9, 1,
              1, 37, 10, 1,
              -5, -4, 4, 1,
              4, 39, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              12, -4, 4, 1,
              -4, 37, 5, 1,
              0, 17, 9, 1,
              1, 37, 10, 1,
              -5, -4, 4, 1,
              4, 39, 5, 1
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
              12, -4, 4, 1,
              -4, 37, 5, 1,
              0, 17, 9, 1,
              1, 37, 10, 1,
              -5, -4, 4, 1,
              4, 39, 5, 1
            ]
          },
          {
            upward: 13,
            audio: 'asper_djump',
            di: 6,
            duration: 10,
            hurtbubbles: [
              12, -4, 4, 1,
              -4, 37, 5, 1,
              0, 17, 9, 1,
              1, 37, 10, 1,
              -5, -4, 4, 1,
              4, 39, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              12, -4, 4, 1,
              -4, 37, 5, 1,
              0, 17, 9, 1,
              1, 37, 10, 1,
              -5, -4, 4, 1,
              4, 39, 5, 1
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
            duration: 3,
            cancellable: 'grab.usmash.upspecial',
            hurtbubbles: [
              10, 4, 4, 1,
              13, 5, 5, 1,
              0, 14, 9, 1,
              1, 30, 10, 1,
              -5, 4, 4, 1,
              2, 8, 5, 1
            ]
          },
          {
            duration: 2,
            cancellable: 'grab.usmash.upspecial',
            hurtbubbles: [
              10, 4, 4, 1,
              13, 5, 5, 1,
              0, 14, 9, 1,
              1, 30, 10, 1,
              -5, 4, 4, 1,
              2, 8, 5, 1
            ]
          },
          {
            duration: 2,
            cancellable: 'grab.usmash.upspecial.downspecial',
            airborne: true,
            jump: 10,
            fullJump: 16,
            jumpDI: 2,
            effect: 'hop',
            hurtbubbles: [
              10, 4, 4, 1,
              13, 5, 5, 1,
              0, 14, 9, 1,
              1, 30, 10, 1,
              -5, 4, 4, 1,
              2, 8, 5, 1
            ]
          },
          {
            duration: 5,
            cancellable: 'all',
            hurtbubbles: [
              10, -8, 4, 1,
              13, 13, 5, 1,
              0, 14, 9, 1,
              1, 30, 10, 1,
              -5, -8, 4, 1,
              2, 15, 5, 1
            ]
          },
          {
            duration: 10,
            cancellable: 'all',
            hurtbubbles: [
              10, -6, 4, 1,
              -2, 40, 5, 1,
              0, 20, 9, 1,
              1, 34, 10, 1,
              -5, -6, 4, 1,
              8, 42, 5, 1
            ]
          },
          {
            duration: 10,
            cancellable: 'all',
            hurtbubbles: [
              12, -4, 4, 1,
              -2, 34, 5, 1,
              0, 17, 9, 1,
              1, 37, 10, 1,
              -5, -4, 4, 1,
              4, 35, 5, 1
            ]
          }
        ]
      },
      {
        name: 'shieldup',
        cancellable: 'grab.dodgeback.spotdodge.dodgeforth',
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
              16, 35, 5, 1,
              0, 24, 9, 1,
              2, 45, 10, 1,
              -2, 4, 4, 1,
              12, 30, 5, 1
            ]
          },
          {
            duration: 3,
            hurtbubbles: [
              5, 4, 4, 1,
              16, 35, 5, 1,
              0, 24, 9, 1,
              2, 45, 10, 1,
              -2, 4, 4, 1,
              12, 30, 5, 1
            ]
          }
        ]
      },
      {
        name: 'shield',
        cancellable: 'dodgeback.spotdodge.dodgeforth.grab.shielddrop',
        specialDrop: true,
        type: 5,
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
              16, 35, 5, 1,
              0, 24, 9, 1,
              2, 45, 10, 1,
              -2, 4, 4, 1,
              12, 30, 5, 1
            ]
          },
          {
            duration: 40,
            hurtbubbles: [
              5, 4, 4, 1,
              16, 35, 5, 1,
              0, 24, 9, 1,
              2, 45, 10, 1,
              -2, 4, 4, 1,
              12, 30, 5, 1
            ]
          }
        ]
      },
      {
        name: 'crumple',
        cancellable: '',
        type: 4,
        transition: 'fallen',
        start: 'crumple',
        keyframes: [
          {
            duration: 102,
            interpolate: true,
            hurtbubbles: [
              5, 4, 4, 1,
              25, 5, 5, 1,
              0, 10, 9, 1,
              6, 15, 10, 1,
              -14, 4, 4, 1,
              13, 5, 5, 1
            ]
          },
          {
            duration: 0,
            hurtbubbles: [
              5, 4, 4, 1,
              25, 5, 5, 1,
              0, 10, 9, 1,
              6, 15, 10, 1,
              -14, 4, 4, 1,
              13, 5, 5, 1
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
              16, 35, 5, 1,
              0, 24, 9, 1,
              2, 45, 10, 1,
              -2, 4, 4, 1,
              12, 30, 5, 1
            ]
          },
          {
            duration: 3,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          }
        ]
      },
      {
        name: 'dodgeback',
        cancellable: '',
        type: 4,
        friction: 0.96,
        end: 'stop',
        slid: 'stop',
        keyframes: [
          {
            duration: 5,
            hurtbubbles: [
              5, 4, 4, 1,
              16, 35, 5, 1,
              0, 24, 9, 1,
              2, 45, 10, 1,
              -2, 4, 4, 1,
              12, 30, 5, 1
            ]
          },
          {
            duration: 15,
            speed: -3.5,
            hurtbubbles: [
              5, 4, 4, 5,
              16, 35, 5, 5,
              0, 24, 9, 5,
              2, 45, 10, 5,
              -2, 4, 4, 5,
              12, 30, 5, 5
            ]
          },
          {
            duration: 12,
            hurtbubbles: [
              5, 4, 4, 1,
              16, 35, 5, 1,
              0, 24, 9, 1,
              2, 45, 10, 1,
              -2, 4, 4, 1,
              12, 30, 5, 1
            ]
          },
          {
            duration: 1,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
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
              16, 35, 5, 1,
              0, 24, 9, 1,
              2, 45, 10, 1,
              -2, 4, 4, 1,
              12, 30, 5, 1
            ]
          },
          {
            duration: 15,
            hurtbubbles: [
              5, 4, 4, 5,
              16, 35, 5, 5,
              0, 24, 9, 5,
              2, 45, 10, 5,
              -2, 4, 4, 5,
              12, 30, 5, 5
            ]
          },
          {
            duration: 9,
            hurtbubbles: [
              5, 4, 4, 1,
              16, 35, 5, 1,
              0, 24, 9, 1,
              2, 45, 10, 1,
              -2, 4, 4, 1,
              12, 30, 5, 1
            ]
          },
          {
            duration: 1,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          }
        ]
      },
      {
        name: 'dodgeforth',
        cancellable: '',
        type: 4,
        friction: 0.96,
        slid: 'stop',
        end: 'stop',
        keyframes: [
          {
            duration: 5,
            hurtbubbles: [
              5, 4, 4, 1,
              16, 35, 5, 1,
              0, 24, 9, 1,
              2, 45, 10, 1,
              -2, 4, 4, 1,
              12, 30, 5, 1
            ]
          },
          {
            duration: 15,
            speed: 4,
            hurtbubbles: [
              5, 4, 4, 5,
              16, 35, 5, 5,
              0, 24, 9, 5,
              2, 45, 10, 5,
              2, 4, 4, 5,
              12, 30, 5, 5
            ]
          },
          {
            duration: 1,
            start: function (entity) {
              entity.face = -entity.face
            },
            hurtbubbles: [
              0, 4, 4, 1,
              0, 35, 5, 1,
              0, 24, 9, 1,
              0, 45, 10, 1,
              0, 4, 4, 1,
              0, 30, 5, 1
            ]
          },
          {
            duration: 12,
            hurtbubbles: [
              0, 4, 4, 1,
              0, 35, 5, 1,
              0, 24, 9, 1,
              0, 45, 10, 1,
              0, 4, 4, 1,
              0, 30, 5, 1
            ]
          },
          {
            duration: 1,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          }
        ]
      },
      {
        name: 'rollforth',
        cancellable: '',
        type: 4,
        friction: 0.96,
        slid: 'stop',
        keyframes: [
          {
            duration: 5,
            interpolate: true,
            hurtbubbles: [
              5, 4, 4, 5,
              5, 35, 5, 5,
              0, 24, 9, 5,
              2, 45, 10, 5,
              -2, 4, 4, 5,
              0, 30, 5, 5
            ]
          },
          {
            duration: 15,
            speed: 3.5,
            hurtbubbles: [
              5, 4, 4, 5,
              5, 35, 5, 5,
              0, 24, 9, 5,
              2, 45, 10, 5,
              -2, 4, 4, 5,
              0, 30, 5, 5
            ]
          },
          {
            duration: 12,
            hurtbubbles: [
              5, 4, 4, 1,
              5, 35, 5, 1,
              0, 24, 9, 1,
              2, 45, 10, 1,
              -2, 4, 4, 1,
              0, 30, 5, 1
            ]
          },
          {
            duration: 1,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          }
        ]
      },
      {
        name: 'rollback',
        cancellable: '',
        type: 4,
        friction: 0.96,
        slid: 'stop',
        keyframes: [
          {
            duration: 5,
            interpolate: true,
            hurtbubbles: [
              5, 4, 4, 5,
              5, 35, 5, 5,
              0, 24, 9, 5,
              2, 45, 10, 5,
              -2, 4, 4, 5,
              0, 30, 5, 5
            ]
          },
          {
            duration: 15,
            speed: -3,
            hurtbubbles: [
              5, 4, 4, 5,
              5, 35, 5, 5,
              0, 24, 9, 5,
              2, 45, 10, 5,
              -2, 4, 4, 5,
              0, 30, 5, 5
            ]
          },
          {
            duration: 12,
            hurtbubbles: [
              5, 4, 4, 1,
              5, 35, 5, 1,
              0, 24, 9, 1,
              2, 45, 10, 1,
              -2, 4, 4, 1,
              0, 30, 5, 1
            ]
          },
          {
            duration: 1,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              2, 45, 10, 1,
              -2, 4, 4, 1,
              5, 20, 5 , 1
            ]
          }
        ]
      },
      {
        name: 'airdodge',
        cancellable: 'dodgepanic',
        cancel: 10,
        type: 4,
        aerodynamics: 0.85,
        airdodgeSpeed: 11,
        decay: 0.65,
        bufferAngle: 0,
        transition: 'helpless',
        start: 'airdodge',
        handler: 'airdodge',
        keyframes: [
          {
            noFastfall: true,
            nodi: true,
            duration: 5,
            gravity: 0,
            audio: 'longwhiff',
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            noFastfall: true,
            nodi: true,
            duration: 26,
            gravity: 0,
            hurtbubbles: [
              5, 4, 4, 5,
              5, 35, 5, 5,
              0, 24, 9, 5,
              2, 45, 10, 5,
              -2, 4, 4, 5,
              0, 30, 5, 5
            ]
          },
          {
            duration: 14,
            hurtbubbles: [
              5, 4, 4, 1,
              5, 35, 5, 1,
              0, 24, 9, 1,
              2, 45, 10, 1,
              -2, 4, 4, 1,
              0, 30, 5, 1
            ]
          },
          {
            duration: 1,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
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
              10, 4, 4, 1,
              6, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 3,
            grabDirections: 4 | 64,
            hurtbubbles: [
              10, 4, 4, 1,
              6, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 16,
            grabDirections: 4 | 64,
            hurtbubbles: [
              10, 4, 4, 1,
              6, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              20, 20, 5, 1
            ]
          },
          {
            duration: 1,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              20, 20, 5, 1
            ]
          }
        ]
      },
      {
        name: 'grab',
        cancellable: '',
        holdingAnimation: 'holding',
        collided: 'grab',
        type: 1,
        keyframes: [
          {
            duration: 3,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 5,
            hurtbubbles: [
              10, 4, 4, 1,
              -5, 23, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 2,
            hurtbubbles: [
              10, 4, 4, 1,
              30, 25, 5, 1,
              0, 24, 9, 1,
              -4, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ],
            audio: 'grab_whiff',
            hitbubbles: [
              {
                follow: 'body',
                type: 'grab',
                x: 4,
                radius: 15
              },
              {
                follow: 'rhand',
                type: 'grab',
                radius: 20
              }
            ]
          },
          {
            duration: 2,
            hurtbubbles: [
              10, 4, 4, 1,
              25, 17, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 25,
            hurtbubbles: [
              10, 4, 4, 1,
              20, 17, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 3,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
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
              20, 20, 5, 1,
              0, 24, 9, 1,
              2, 45, 10, 1,
              -2, 4, 4, 1,
              5, 20, 5, 1,
              20, 20, 0, 0
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              20, 22, 5, 1,
              0, 24, 9, 1,
              6, 45, 10, 1,
              -2, 4, 4, 1,
              5, 18, 5, 1,
              20, 20, 0, 0
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              20, 20, 5, 1,
              0, 24, 9, 1,
              2, 45, 10, 1,
              -2, 4, 4, 1,
              5, 20, 5, 1,
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
              20, 20, 5, 1,
              0, 24, 9, 1,
              2, 45, 10, 1,
              -2, 4, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              20, 22, 5, 1,
              0, 24, 9, 1,
              6, 45, 10, 1,
              -2, 4, 4, 1,
              5, 18, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
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
              20, 20, 5, 1,
              0, 24, 9, 1,
              2, 45, 10, 1,
              -2, 4, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              20, 22, 5, 1,
              0, 24, 9, 1,
              6, 45, 10, 1,
              -2, 4, 4, 1,
              5, 18, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
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
              20, 20, 5, 1,
              0, 24, 9, 1,
              2, 45, 10, 1,
              -2, 4, 4, 1,
              5, 20, 5, 1,
              20, 20, 0, 0
            ]
          },
          {
            duration: 3,
            hurtbubbles: [
              5, 4, 4, 1,
              -2, 22, 5, 1,
              0, 24, 9, 1,
              6, 45, 10, 1,
              -2, 4, 4, 1,
              5, 18, 5, 1,
              20, 20, 0, 0
            ]
          },
          {
            duration: 2,
            hurtbubbles: [
              5, 4, 4, 1,
              16, 22, 5, 1,
              0, 24, 9, 1,
              6, 45, 10, 1,
              -2, 4, 4, 1,
              5, 18, 5, 1,
              20, 20, 0, 0
            ],
            audio: 'shortwhiff',
            hitbubbles: [
              {
                type: 'ground',
                x: 30,
                y: 20,
                radius: 13,
                damage: 3,
                knockback: 4,
                growth: 4,
                sakurai: true
              }
            ]
          },
          {
            duration: 8,
            hurtbubbles: [
              5, 4, 4, 1,
              16, 22, 5, 1,
              0, 24, 9, 1,
              6, 45, 10, 1,
              -2, 4, 4, 1,
              5, 18, 5, 1,
              20, 20, 0, 0
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              20, 20, 5, 1,
              0, 24, 9, 1,
              2, 45, 10, 1,
              -2, 4, 4, 1,
              5, 20, 5, 1,
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
            duration: 4,
            hurtbubbles: [
              5, 4, 4, 1,
              20, 20, 5, 1,
              0, 24, 9, 1,
              2, 45, 10, 1,
              -2, 4, 4, 1,
              5, 20, 5, 1,
              20, 20, 0, 0
            ]
          },
          {
            duration: 6,
            hurtbubbles: [
              5, 4, 4, 1,
              0, 20, 5, 1,
              0, 24, 9, 1,
              6, 45, 10, 1,
              -2, 4, 4, 1,
              5, 18, 5, 1,
              0, 20, 0, 0
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              30, 10, 5, 1,
              0, 24, 9, 1,
              2, 45, 10, 1,
              -2, 4, 4, 1,
              5, 20, 5, 1,
              40, 0, 0, 0
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
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              40, 10, 5, 1,
              0, 24, 9, 1,
              2, 45, 10, 1,
              -2, 4, 4, 1,
              5, 20, 5, 1
            ],
            audio: 'shortwhiff',
            hitbubbles: [
              {
                type: 'ground',
                x: 35,
                y: 20,
                radius: 20,
                damage: 6,
                knockback: 7,
                growth: 5,
                angle: 25
              }
            ]
          },
          {
            duration: 26,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 10, 5, 1,
              0, 24, 9, 1,
              2, 45, 10, 1,
              -2, 4, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
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
              20, 20, 5, 1,
              0, 24, 9, 1,
              2, 45, 10, 1,
              -2, 4, 4, 1,
              5, 20, 5, 1,
              20, 20, 0, 0
            ]
          },
          {
            duration: 5,
            hurtbubbles: [
              5, 4, 4, 1,
              40, 20, 5, 1,
              0, 24, 9, 1,
              6, 45, 10, 1,
              -2, 4, 4, 1,
              -30, 20, 5, 1,
              40, 20, 0, 0
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              0, 60, 5, 1,
              0, 24, 9, 1,
              2, 45, 10, 1,
              -2, 4, 4, 1,
              0, 60, 5, 1,
              0, 60, 0, 0
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
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              0, 60, 5, 1,
              0, 24, 9, 1,
              2, 45, 10, 1,
              -2, 4, 4, 1,
              0, 60, 5, 1
            ],
            audio: 'longwhiff',
            hitAudio: 'wham',
            hitbubbles: [
              {
                type: 'ground',
                flags: 'stale_di',
                x: 10,
                y: 60,
                radius: 25,
                damage: 6,
                knockback: 11,
                growth: 11,
                angle: 85
              }
            ]
          },
          {
            duration: 12,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 22, 5, 1,
              0, 24, 9, 1,
              6, 45, 10, 1,
              -2, 4, 4, 1,
              5, 18, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
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
              20, 20, 5, 1,
              0, 24, 9, 1,
              2, 45, 10, 1,
              -2, 4, 4, 1,
              5, 20, 5, 1,
              20, 20, 0, 0
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              5, 4, 4, 1,
              20, 20, 5, 1,
              0, 24, 9, 1,
              2, 45, 10, 1,
              -2, 4, 4, 1,
              20, 20, 5, 1,
              20, 20, 0, 0
            ]
          },
          {
            duration: 3,
            hurtbubbles: [
              5, 4, 4, 1,
              -6, 4, 5, 1,
              0, 24, 9, 1,
              6, 45, 10, 1,
              -2, 4, 4, 1,
              40, 50, 5, 1,
              40, 50, 0, 0
            ]
          },
          {
            duration: 30,
            hurtbubbles: [
              5, 4, 4, 1,
              30, 45, 5, 1,
              0, 24, 9, 1,
              2, 45, 10, 1,
              -2, 4, 4, 1,
              40, 50, 5, 1,
              30, 45, 0, 0
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
            duration: 4,
            hurtbubbles: [
              5, 4, 4, 1,
              30, 45, 5, 1,
              0, 24, 9, 1,
              2, 45, 10, 1,
              -2, 4, 4, 1,
              40, 50, 5, 1
            ],
            hitAudio: 'wham',
            audio: 'longwhiff',
            hitbubbles: [
              {
                type: 'ground',
                x: 30,
                y: 45,
                radius: 13,
                damage: 11,
                knockback: 5,
                growth: 17,
                angle: 64
              }
            ]
          },
          {
            duration: 14,
            hurtbubbles: [
              5, 4, 4, 1,
              60, 60, 5, 1,
              0, 24, 9, 1,
              6, 45, 10, 1,
              -2, 4, 4, 1,
              10, 22, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
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
            duration: 20,
            hurtbubbles: [
              5, 4, 4, 1,
              20, 20, 5, 1,
              0, 24, 9, 1,
              2, 45, 10, 1,
              -2, 4, 4, 1,
              5, 20, 5, 1,
              20, 20, 0, 0
            ]
          },
          {
            duration: 120,
            hurtbubbles: [
              5, 4, 4, 1,
              -20, 35, 5, 1,
              0, 24, 9, 1,
              2, 45, 10, 1,
              -2, 4, 4, 1,
              5, 20, 5, 1,
              -20, 35, 0, 0
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
            duration: 2,
            hurtbubbles: [
              5, 4, 4, 1,
              -20, 35, 5, 1,
              0, 24, 9, 1,
              2, 45, 10, 1,
              -2, 4, 4, 1,
              5, 20, 5, 1
            ],
            hitbubbles: [
              {
                type: 'ground',
                y: 40,
                radius: 13,
                damage: 9,
                knockback: 7,
                growth: 15,
                angle: 39
              }
            ]
          },
          {
            duration: 20,
            hurtbubbles: [
              5, 4, 4, 1,
              -25, 30, 5, 1,
              0, 24, 9, 1,
              6, 45, 10, 1,
              -2, 4, 4, 1,
              5, 18, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
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
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
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
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 20,
            hurtbubbles: [
              -10, 4, 4, 1,
              -10, 20, 5, 1,
              0, 24, 9, 1,
              -1, 45, 10, 1,
              5, 4, 4, 1,
              -5, 20, 5, 1
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
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
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
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            dy: 10,
            dx: -6,
            duration: 10,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          }
        ]
      },
      {
        name: 'dashgrab',
        cancellable: '',
        collided: 'grab',
        holdingAnimation: 'holding',
        type: 1,
        slideFriction: 0.94,
        start: 'stop',
        end: 'stop',
        keyframes: [
          {
            interpolate: true,
            duration: 4,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 5, 1,
              0, 15, 9, 1,
              7, 30, 10, 1,
              -2, 4, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 7,
            slide: 7,
            hurtbubbles: [
              5, 4, 4, 1,
              10, 20, 5, 1,
              0, 15, 9, 1,
              7, 30, 10, 1,
              -2, 4, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 1,
            hurtbubbles: [
              5, 4, 4, 1,
              30, 23, 5, 1,
              0, 15, 9, 1,
              2, 30, 10, 1,
              -2, 4, 4, 1,
              0, 20, 5, 1
            ],
            audio: 'grab_whiff',
            hitbubbles: [
              {
                follow: 'body',
                type: 'grab',
                x: 4,
                radius: 18
              },
              {
                follow: 'rhand',
                type: 'grab',
                radius: 15
              }
            ]
          },
          {
            duration: 16,
            hurtbubbles: [
              5, 4, 4, 1,
              30, 23, 5, 1,
              0, 15, 9, 1,
              2, 30, 10, 1,
              -2, 4, 4, 1,
              0, 20, 5, 1
            ]
          },
          {
            duration: 26,
            hurtbubbles: [
              5, 4, 4, 1,
              20, 20, 5, 1,
              0, 15, 9, 1,
              2, 30, 10, 1,
              -2, 4, 4, 1,
              0, 20, 5, 1
            ]
          },
          {
            duration: 3,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          }
        ]
      },
      {
        name: 'groundspecial',
        cancellable: '',
        cancel: 'continue',
        slid: 'continue',
        transition: 'airspecial-charge',
        type: 3,
        friction: 0,
        keyframes: [
          {
            duration: 3,
            interpolate: true,
            hurtbubbles: [
              -13, 9, 4, 1,
              -10, 20, 5, 1,
              -6, 15, 9, 1,
              -8, 35, 10, 1,
              -2, 4, 4, 1,
              -6, 24, 5, 1
            ]
          },
          {
            duration: 3,
            hurtbubbles: [
              -13, 9, 4, 1,
              -10, 20, 5, 1,
              -6, 15, 9, 1,
              -8, 35, 10, 1,
              -2, 4, 4, 1,
              -6, 24, 5, 1
            ]
          },
          {
            duration: 5,
            hurtbubbles: [
              -22, 4, 4, 1,
              -28, 20, 5, 1,
              -18, 15, 9, 1,
              -18, 35, 10, 1,
              -2, 4, 4, 1,
              -18, 24, 5, 1
            ]
          }
        ]
      },
      {
        name: 'sidespecial',
        cancellable: '',
        cancel: 'airsidespecial-cancel',
        buffer: 'airjump0',
        noLedgeGrab: true,
        slid: 'continue',
        friction: 1,
        nodi: true,
        noFastfall: true,
        type: 3,
        disableIK: true,
        start: function (entity) {
          entity.dx = entity.dx * 0.1
          entity.dy = entity.dy * 0.1
        },
        keyframes: [
          {
            duration: 16,
            gravity: 0.8,
            start: (entity) => {
              entity.dx = entity.face * 2
              entity.dy = 10
              entity.airborne = true
            },
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 8,
            handler: function (entity) {
              // entity.x = entity.startX
              // entity.y = entity.startY
              entity.dx = entity.face * 14
              entity.dy = -10
            },
            hurtbubbles: [
              -10, 9, 4, 1,
              30, 5, 5, 1,
              0, 9, 9, 1,
              30, 10, 10, 1,
              -10, 4, 4, 1,
              30, 20, 5, 1
            ],
            audio: 'longwhiff',
            hitbubbles: [
              {
                type: 'special',
                x: 10,
                radius: 23,
                damage: 7,
                knockback: 11,
                growth: 11,
                sakurai: true
              }
            ]
          },
          {
            duration: 7,
            hurtbubbles: [
              -10, 9, 4, 1,
              30, 20, 5, 1,
              0, 9, 9, 1,
              30, 10, 10, 1,
              -10, 4, 4, 1,
              30, 5, 5, 1
            ]
          },
          {
            duration: 7,
            hurtbubbles: [
              -10, 9, 4, 1,
              30, 5, 5, 1,
              0, 9, 9, 1,
              30, 10, 10, 1,
              -10, 4, 4, 1,
              30, 20, 5, 1
            ]
          },
          {
            duration: 3,
            hurtbubbles: [
              -10, 9, 4, 1,
              30, 20, 5, 1,
              0, 9, 9, 1,
              30, 10, 10, 1,
              -10, 4, 4, 1,
              30, 5, 5, 1
            ]
          }
        ]
      },
      {
        name: 'sidespecial2',
        cancellable: '',
        cancel: 24,
        transition: 'helpless',
        helpless: true,
        type: 4,
        nodi: true,
        noFastfall: true,
        grabDirections: 4 | 32 | 64,
        keyframes: [
          {
            duration: 3,
            gravity: 0,
            hurtbubbles: [
              -10, 9, 4, 1,
              30, 20, 5, 1,
              0, 9, 9, 1,
              30, 10, 10, 1,
              -10, 4, 4, 1,
              30, 5, 5, 1
            ]
          },
          {
            duration: 2
          },
          {
            duration: 10,
            hurtbubbles: [
              -10, 9, 4, 1,
              30, 20, 5, 1,
              0, 9, 9, 1,
              30, 10, 10, 1,
              -10, 4, 4, 1,
              30, 5, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              -10, 9, 4, 1,
              30, 5, 5, 1,
              0, 9, 9, 1,
              30, 10, 10, 1,
              -10, 4, 4, 1,
              30, 20, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              -10, 9, 4, 1,
              30, 20, 5, 1,
              0, 9, 9, 1,
              30, 10, 10, 1,
              -10, 4, 4, 1,
              30, 5, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              -10, 9, 4, 1,
              30, 5, 5, 1,
              0, 9, 9, 1,
              30, 10, 10, 1,
              -10, 4, 4, 1,
              30, 20, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              -10, 9, 4, 1,
              30, 20, 5, 1,
              0, 9, 9, 1,
              30, 10, 10, 1,
              -10, 4, 4, 1,
              30, 5, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              -10, 9, 4, 1,
              30, 5, 5, 1,
              0, 9, 9, 1,
              30, 10, 10, 1,
              -10, 4, 4, 1,
              30, 20, 5, 1
            ]
          }
        ]
      },
      {
        name: 'downspecial',
        cancellable: '',
        cancel: 'continue',
        start: function (entity) {
          entity.dx = 0
          entity.dy = -3
          entity.kb = entity.kb * 2
          entity.kbx = entity.kbx * 2
          entity.kby = entity.kby * 2
        },
        handler: function (entity, controller, animation) {
          if (animation.frame > 3 && controller.hmove > 0.2 || controller.hmove < -0.2) {
            entity.face = Math.sign(controller.hmove)
          }
          if (animation.frame < 5) {
            entity.dx = 0
            entity.dy = 0
          }
          if (entity.fastfall) {
            entity.fastfall = false
          }
        },
        type: 3,
        keyframes: [
          {
            duration: 1,
            interpolate: true,
            hurtbubbles: [
              10, 4, 4, 1,
              20, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              -20, 20, 5, 1
            ],
            audio: 'blip',
            hitbubbles: [
              {
                type: 'special',
                flags: 'wind',
                y: 25,
                radius: 35,
                damage: 3,
                knockback: 8,
                growth: 20,
                angle: 90,
                color: 174
              }
            ]
          },
          {
            duration: 2,
            hurtbubbles: [
              10, 4, 4, 1,
              20, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              -20, 20, 5, 1
            ]
          },
          {
            duration: 10,
            gravity: 0.5,
            cancellable: 'hop.airjump0',
          },
          {
            duration: 30,
            gravity: 0.7,
            cancellable: 'hop.airjump0',
            hurtbubbles: [
              10, 4, 4, 1,
              20, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              -20, 20, 5, 1
            ]
          },
          {
            duration: 3,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          }
        ]
      },
      {
        name: '64:downspecial',
        cancel: 4,
        start: function (entity) {
          entity.dx = 0
          entity.dy = -3
          entity.kb = entity.kb * 2
          entity.kbx = entity.kbx * 2
          entity.kby = entity.kby * 2
        },
        handler: function (entity, controller, animation) {
          if (animation.frame > 3 && controller.hmove > 0.2 || controller.hmove < -0.2) {
            entity.face = Math.sign(controller.hmove)
          }
        },
        type: 3,
        keyframes: [
          {
            duration: 1,
            interpolate: true,
            hurtbubbles: [
              10, 4, 4, 1,
              20, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              -20, 20, 5, 1
            ],
            audio: 'blip',
            hitbubbles: [
              {
                type: 'special',
                y: 25,
                radius: 33,
                flags: 'fixed',
                damage: 3,
                knockback: 8,
                angle: 0,
                color: 174
              }
            ]
          },
          {
            duration: 2,
            hurtbubbles: [
              10, 4, 4, 1,
              20, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              -20, 20, 5, 1
            ]
          },
          {
            duration: 10,
          },
          {
            duration: 30,
            hurtbubbles: [
              10, 4, 4, 1,
              20, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              -20, 20, 5, 1
            ]
          },
          {
            duration: 3,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          }
        ]
      },
      {
        name: 'upspecial',
        cancellable: '',
        cancel: 'continue',
        nodi: true,
        type: 3,
        reversible: true,
        gravity: 0.4,
        fallFriction: 0.9,
        grabDirections: 4 | 64,
        transition: 'airupspecial',
        disableIK: true,
        keyframes: [
          {
            duration: 3,
            noLedgeGrab: true,
            interpolate: true,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 3,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          }
        ]
      },
      {
        name: 'airspecial',
        cancellable: '',
        cancel: 'continue',
        slid: 'continue',
        reversible: true,
        transition: 'airspecial-charge',
        type: 3,
        friction: 0,
        keyframes: [
          {
            duration: 3,
            interpolate: true,
            hurtbubbles: [
              -13, 9, 4, 1,
              -10, 20, 5, 1,
              -6, 15, 9, 1,
              -8, 35, 10, 1,
              -2, 4, 4, 1,
              -6, 24, 5, 1
            ]
          },
          {
            duration: 3,
            hurtbubbles: [
              -13, 9, 4, 1,
              -10, 20, 5, 1,
              -6, 15, 9, 1,
              -8, 35, 10, 1,
              -2, 4, 4, 1,
              -6, 24, 5, 1
            ]
          },
          {
            duration: 5,
            hurtbubbles: [
              -22, 4, 4, 1,
              -28, 20, 5, 1,
              -18, 15, 9, 1,
              -18, 35, 10, 1,
              -2, 4, 4, 1,
              -18, 24, 5, 1
            ]
          }
        ]
      },
      {
        name: 'airspecial-charge',
        cancellable: '',
        cancel: 'continue',
        slid: 'continue',
        handler: 'charge',
        release: 'airspecial-release',
        transition: 'airspecial-release',
        type: 3,
        keyframes: [
          {
            duration: 5,
            hurtbubbles: [
              -22, 4, 4, 1,
              -28, 20, 5, 1,
              -18, 15, 9, 1,
              -18, 35, 10, 1,
              -2, 4, 4, 1,
              -18, 24, 5, 1
            ]
          },
          {
            duration: 175,
          },
          {
            duration: 5,
            hurtbubbles: [
              -22, 4, 4, 1,
              -28, 20, 5, 1,
              -18, 15, 9, 1,
              -18, 35, 10, 1,
              -2, 4, 4, 1,
              -18, 24, 5, 1
            ]
          }
        ]
      },
      {
        name: 'airspecial-release',
        cancel: 'continue',
        slid: 'continue',
        scale: 5,
        cancellable: '',
        type: 3,
        iasa: 8,
        blocked: (entity) => {
          entity.airborne ? entity.schedule('airborne') : entity.schedule('recoil')
        },
        keyframes: [
          {
            interpolate: true,
            duration: 6,
            hurtbubbles: [
              25, 4, 4, 1,
              60, 20, 5, 1,
              14, 18, 9, 1,
              22, 37, 10, 1,
              -2, 4, 4, 1,
              20, 12, 5, 1
            ]
          },
          {
            duration: 12,
            audio: 'longwhiff',
            hitbubbles: [
              {
                type: 'ground',
                x: 50,
                y: 24,
                radius: 20,
                damage: 7,
                knockback: 4,
                growth: 10,
                sakurai: true
              },
              {
                type: 'ground',
                x: 30,
                y: 24,
                radius: 20,
                damage: 7,
                knockback: 4,
                growth: 10,
                sakurai: true
              },
              {
                type: 'ground',
                x: 10,
                y: 24,
                radius: 20,
                damage: 7,
                knockback: 4,
                growth: 10,
                sakurai: true
              },
            ]
          },
          {
            duration: 5,
            hurtbubbles: [
              22, 4, 4, 1,
              60, 20, 5, 1,
              14, 18, 9, 1,
              22, 37, 10, 1,
              -2, 4, 4, 1,
              20, 12, 5, 1
            ]
          },
          {
            duration: 8,
            hurtbubbles: [
              22, 4, 4, 1,
              -9, 14, 5, 1,
              6, 18, 9, 1,
              16, 37, 10, 1,
              -2, 4, 4, 1,
              16, 20, 5, 1
            ]
          },
          {
            duration: 20,
            hurtbubbles: [
              18, 4, 4, 1,
              5, 15, 5, 1,
              5, 18, 9, 1,
              12, 37, 10, 1,
              -2, 4, 4, 1,
              16, 20, 5, 1
            ]
          },
          {
            duration: 5,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          }
        ]
      },
      {
        name: 'airsidespecial',
        cancellable: '',
        cancel: 'airsidespecial-cancel',
        slid: 'continue',
        buffer: 'airjump0',
        noFastfall: true,
        nodi: true,
        type: 3,
        grabDirections: 4 | 64,
        end: function (entity) {
          entity.airjumps = 0
          entity.dy = -entity.maxFallSpeed
        },
        keyframes: [
          {
            duration: 1,
            gravity: 0.8,
            noLedgeGrab: true,
            start: (entity) => {
              entity.dx = entity.face * 4
              entity.dy = 14
            },
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 19,
            gravity: 0.8,
            start: (entity) => {
              entity.dx = entity.face * 4
              entity.dy = 14
            },
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 8,
            handler: function (entity) {
              // entity.x = entity.startX
              // entity.y = entity.startY
              entity.dx = entity.face * 3
              entity.dy = -18
            },
            hurtbubbles: [
              -10, 9, 4, 1,
              30, 5, 5, 1,
              0, 9, 9, 1,
              30, 10, 10, 1,
              -10, 4, 4, 1,
              30, 20, 5, 1
            ],
            audio: 'longwhiff',
            hitbubbles: [
              {
                type: 'special',
                x: 10,
                radius: 23,
                damage: 7,
                knockback: 11,
                growth: 11,
                sakurai: true
              }
            ]
          },
          {
            duration: 8,
            noLedgeGrab: true,
            hitbubbles: true
          },
          {
            duration: 7,
            noLedgeGrab: true,
            hurtbubbles: [
              -10, 9, 4, 1,
              30, 20, 5, 1,
              0, 9, 9, 1,
              30, 10, 10, 1,
              -10, 4, 4, 1,
              30, 5, 5, 1
            ]
          },
          {
            duration: 7,
            noLedgeGrab: true,
            hurtbubbles: [
              -10, 9, 4, 1,
              30, 5, 5, 1,
              0, 9, 9, 1,
              30, 10, 10, 1,
              -10, 4, 4, 1,
              30, 20, 5, 1
            ]
          },
          {
            duration: 3,
            hurtbubbles: [
              -10, 9, 4, 1,
              30, 20, 5, 1,
              0, 9, 9, 1,
              30, 10, 10, 1,
              -10, 4, 4, 1,
              30, 5, 5, 1
            ]
          }
        ]
      },
      {
        name: 'airsidespecial-cancel',
        nodi: true,
        cancellable: '',
        cancel: 'continue',
        type: 0,
        transition: 'crouched',
        keyframes: [
          {
            duration: 6,
            interpolate: true,
            dy: 3,
            gravity: 0.5,
            start: (entity) => {
              entity.dx *= 0.25
            },
            airborne: true,
            hurtbubbles: [
              12, 4, 4, 1,
              30, 6, 5, 1,
              0, 8, 9, 1,
              30, 9, 10, 1,
              -6, 4, 4, 1,
              30, 6, 5, 1
            ],
            hitAudio: 'wham',
            audio: 'shortwhiff',
            hitbubbles: [
              {
                type: 'special',
                y: 10,
                x: -20,
                radius: 23,
                damage: 10,
                knockback: 11,
                growth: 15,
                sakurai: true
              },
              {
                type: 'special',
                y: 10,
                x: 20,
                radius: 23,
                damage: 10,
                knockback: 11,
                growth: 15,
                sakurai: true
              }
            ]
          },
          {
            duration: 15,
            hurtbubbles: [
              12, 4, 4, 1,
              30, 6, 5, 1,
              0, 8, 9, 1,
              30, 9, 10, 1,
              -6, 4, 4, 1,
              30, 6, 5, 1
            ]
          },
          {
            duration: 9,
            hurtbubbles: [
              12, 4, 4, 1,
              10, 6, 5, 1,
              0, 10, 9, 1,
              3, 16, 10, 1,
              -6, 4, 4, 1,
              5, 7, 5, 1
            ]
          },
          {
            duration: 3,
            hurtbubbles: [
              12, 4, 4, 1,
              10, 10, 5, 1,
              0, 12, 9, 1,
              3, 24, 10, 1,
              -6, 4, 4, 1,
              5, 10, 5, 1
            ]
          }
        ]
      },
      {
        name: 'airdownspecial',
        cancel: 10,
        start: function (entity) {
          entity.dx = 0
          entity.dy = 0
          entity.kb = entity.kb * 2
          entity.kbx = entity.kbx * 2
          entity.kby = entity.kby * 2
        },
        handler: function (entity, controller, animation) {
          if (animation.frame > 3 && controller.hmove > 0.2 || controller.hmove < -0.2) {
            entity.face = controller.hmove > 0 ? 1 : -1
          }
          if (animation.frame < 5) {
            entity.dx = 0
            entity.dy = 0
          }
          if (entity.fastfall) {
            entity.fastfall = false
          }
        },
        noFastfall: true,
        nodi: true,
        type: 3,
        keyframes: [
          {
            duration: 1,
            hurtbubbles: [
              5, 4, 4, 4,
              10, 20, 5, 4,
              0, 15, 9, 4,
              2, 30, 10, 4,
              -2, 4, 4, 4,
              5, 20, 5, 4
            ],
            audio: 'blip',
            hitbubbles: [
              {
                type: 'special',
                flags: 'wind',
                y: 25,
                radius: 35,
                damage: 3,
                knockback: 8,
                growth: 20,
                angle: 90,
                color: 174
              }
            ]
          },
          {
            duration: 1,
            hurtbubbles: [
              10, 4, 4, 1,
              20, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              -20, 20, 5, 1
            ]
          },
          {
            duration: 10,
            gravity: 0.5,
            cancellable: 'hop.airjump0',
          },
          {
            duration: 30,
            gravity: 0.7,
            cancellable: 'hop.airjump0',
            hurtbubbles: [
              10, 4, 4, 1,
              20, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              -20, 20, 5, 1
            ]
          },
          {
            duration: 3,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          }
        ]
      },
      {
        name: '64:airdownspecial',
        cancel: 4,
        start: function (entity) {
          entity.dx = 0
          entity.dy = 0
          entity.kb = entity.kb * 2
          entity.kbx = entity.kbx * 2
          entity.kby = entity.kby * 2
        },
        handler: function (entity, controller, animation) {
          if (animation.frame > 3 && controller.hmove > 0.2 || controller.hmove < -0.2) {
            entity.face = controller.hmove > 0 ? 1 : -1
          }
          if (animation.frame < 5) {
            entity.dx = 0
            entity.dy = 0
          }
          if (entity.fastfall) {
            entity.fastfall = false
          }
        },
        noFastfall: true,
        nodi: true,
        type: 3,
        keyframes: [
          {
            duration: 1,
            hurtbubbles: [
              5, 4, 4, 4,
              10, 20, 5, 4,
              0, 15, 9, 4,
              2, 30, 10, 4,
              -2, 4, 4, 4,
              5, 20, 5, 4
            ],
            audio: 'blip',
            hitbubbles: [
              {
                type: 'special',
                y: 25,
                radius: 33,
                flags: 'fixed',
                damage: 3,
                knockback: 8,
                angle: 0,
                color: 174
              }
            ]
          },
          {
            duration: 3,
            hurtbubbles: [
              10, 4, 4, 1,
              20, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              -20, 20, 5, 1
            ]
          },
          {
            duration: 10,
            gravity: 0.5,
          },
          {
            duration: 30,
            gravity: 0.7,
            hurtbubbles: [
              10, 4, 4, 1,
              20, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              -20, 20, 5, 1
            ]
          },
          {
            duration: 3,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          }
        ]
      },
      {
        name: 'airupspecial',
        cancellable: '',
        cancel: 30,
        noFastfall: true,
        type: 3,
        grabDirections: 4 | 16 | 64 | 128,
        transition: 'helpless',
        keyframes: [
          {
            duration: 5,
            noLedgeGrab: true,
            nodi: true,
            audio: 'shortwhiff',
            handler: function (entity) {
              entity.dy = entity.dy * 0.5
              entity.dx = entity.dx * 0.5
            },
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 1,
            noLedgeGrab: true,
            hitbubbles: [
              {
                type: 'special',
                x: 30,
                y: 20,
                radius: 23,
                damage: 14,
                knockback: 6,
                growth: 11,
                angle: 33,
              }
            ]
          },
          {
            duration: 8,
            noLedgeGrab: true,
            gravity: 0,
            start: function (entity, controller) {
              entity.airborne = true
              if (controller.hmove < -0.2) {
                if (controller.hmove < -0.4) {
                  entity.dx = -14
                  entity.dy = 24
                } else {
                  entity.dx = -6
                  entity.dy = 30
                }
                entity.face = -1
              } else if (controller.hmove > 0.2) {
                entity.dx = 14
                entity.face = 1
                entity.dy = 24
              } else {
                entity.dx = 6 * entity.face
                entity.dy = 30
              }
            },
            handler: function (entity) {
            },
            hurtbubbles: [
              -25, 27, 4, 1,
              5, 30, 5, 1,
              0, 15, 9, 1,
              2, 15, 10, 1,
              -25, 23, 4, 1,
              15, 20, 5, 1
            ],
            hitbubbles: [
              {
                type: 'special',
                x: 20,
                y: 30,
                radius: 25,
                damage: 7,
                knockback: 6,
                growth: 11,
                sakurai: true
              }
            ]
          },
          {
            duration: 9,
            nodi: true,
            start: function (entity) {
              entity.dy *= 0.5
            },
            handler: function (entity) {
              entity.dy = entity.dy * 0.5
              entity.dx = entity.dx * 0.5
            },
            hurtbubbles: [
              -25, 27, 4, 1,
              5, 35, 5, 1,
              0, 15, 9, 1,
              2, 15, 10, 1,
              -25, 23, 4, 1,
              25, 20, 5, 1
            ]
          },
          {
            duration: 14,
            hurtbubbles: [
              -25, 24, 4, 1,
              30, 38, 5, 1,
              0, 15, 9, 1,
              2, 15, 10, 1,
              -25, 16, 4, 1,
              35, 20, 5, 1
            ]
          },
          {
            duration: 3,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          }
        ]
      },
      {
        name: 'jab',
        cancellable: '',
        type: 1,
        redirect: {
          jab: 'jab2'
        },
        buffer: 'jab',
        iasa: 8,
        keyframes: [
          {
            duration: 3,
            interpolate: true,
            hurtbubbles: [
              10, 4, 4, 1,
              -10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 4,
            hurtbubbles: [
              10, 4, 4, 1,
              -10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 2,
            hurtbubbles: [
              10, 4, 4, 1,
              20, 30, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              0, 20, 5, 1
            ],
            audio: 'shortwhiff',
            hitbubbles: [
              {
                type: 'ground',
                follow: 'rhand',
                radius: 14,
                damage: 2,
                knockback: 2,
                sakurai: true
              }
            ]
          },
          {
            duration: 14,
            cancellable: 'jab'
          },
          {
            duration: 16,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          }
        ]
      },
      {
        name: 'jab2',
        cancellable: '',
        type: 1,
        redirect: {
          jab: 'jab3'
        },
        buffer: 'jab',
        iasa: 8,
        keyframes: [
          {
            duration: 3,
            interpolate: true,
            hurtbubbles: [
              10, 4, 4, 1,
              15, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              -16, 20, 5, 1
            ]
          },
          {
            duration: 4,
            hurtbubbles: [
              10, 4, 4, 1,
              15, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              -16, 20, 5, 1
            ]
          },
          {
            duration: 2,
            hurtbubbles: [
              10, 4, 4, 1,
              15, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              27, 40, 5, 1
            ]
          },
          {
            duration: 2,
            hurtbubbles: [
              10, 4, 4, 1,
              15, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              27, 40, 5, 1
            ],
            audio: 'shortwhiff',
            hitbubbles: [
              {
                type: 'ground',
                follow: 'lhand',
                radius: 14,
                damage: 2,
                knockback: 2,
                sakurai: true
              }
            ]
          },
          {
            duration: 14,
            cancellable: 'jab'
          },
          {
            duration: 8,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          }
        ]
      },
      {
        name: 'jab3',
        cancellable: '',
        type: 1,
        iasa: 4,
        redirect: {
          jab: 'jab3'
        },
        buffer: 'jab',
        transition: 'jab4',
        keyframes: [
          {
            duration: 8,
            interpolate: true,
            hurtbubbles: [
              10, 4, 4, 1,
              40, 25, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              38, 22, 5, 1
            ]
          },
          {
            duration: 3,
            hurtbubbles: [
              10, 4, 4, 1,
              30, 30, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              0, 20, 5, 1
            ],
            audio: 'shortwhiff',
            hitbubbles: [
              {
                type: 'ground',
                follow: 'rhand',
                radius: 14,
                damage: 1,
                knockback: 1,
                sakurai: true
              }
            ]
          },
          {
            duration: 4
          },
          {
            duration: 3,
            hurtbubbles: [
              10, 4, 4, 1,
              15, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              37, 40, 5, 1
            ],
            audio: 'shortwhiff',
            reset: true,
            hitbubbles: [
              {
                type: 'ground',
                follow: 'lhand',
                radius: 14,
                damage: 1,
                knockback: 1,
                sakurai: true
              }
            ]
          },
          {
            duration: 5,
            cancellable: 'jab',
            hurtbubbles: [
              10, 4, 4, 1,
              40, 25, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              38, 22, 5, 1
            ]
          },
          {
            duration: 9,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          }
        ]
      },
      {
        name: 'jab4',
        cancellable: '',
        type: 1,
        iasa: 4,
        keyframes: [
          {
            duration: 6,
            interpolate: true,
            hurtbubbles: [
              10, 4, 4, 1,
              40, 25, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              38, 22, 5, 1
            ]
          },
          {
            duration: 5,
            hurtbubbles: [
              10, 4, 4, 1,
              35, 25, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              33, 22, 5, 1
            ],
            audio: 'longwhiff',
            hitbubbles: [
              {
                type: 'ground',
                follow: 'rhand',
                radius: 20,
                damage: 4,
                knockback: 3,
                growth: 14,
                sakurai: true
              }
            ]
          },
          {
            duration: 20,
            hurtbubbles: [
              10, 4, 4, 1,
              40, 25, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              38, 22, 5, 1
            ]
          },
          {
            duration: 9,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
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
        slideFriction: 0.94,
        iasa: 4,
        keyframes: [
          {
            duration: 5,
            cancellable: 'usmash',
            slide: 5,
            interpolate: true,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              -4, 23, 9, 1,
              -9, 39, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 5,
            slide: 3,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              -4, 23, 9, 1,
              -9, 39, 10, 1,
              5, 4, 4, 1,
              5, 20, 5, 1
            ],
            audio: 'longwhiff',
            hitbubbles: [
              {
                type: 'ground',
                follow: 'head',
                radius: 25,
                damage: 9,
                knockback: 9,
                growth: 12,
                sakurai: true
              },
              {
                type: 'ground',
                follow: 'body',
                radius: 15,
                damage: 9,
                knockback: 9,
                growth: 12,
                sakurai: true
              }
            ]
          },
          {
            duration: 20,
            hurtbubbles: [
              25, 4, 4, 1,
              20, 12, 5, 1,
              15, 20, 9, 1,
              30, 29, 10, 1,
              -5, 4, 4, 1,
              15, 15, 5, 1
            ]
          },
          {
            duration: 3,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          }
        ]
      },
      {
        name: 'dtilt',
        cancellable: '',
        transition: 'crouched',
        type: 1,
        iasa: 3,
        keyframes: [
          {
            interpolate: true,
            duration: 3,
            hurtbubbles: [
              12, 4, 4, 1,
              -9, 6, 5, 1,
              -4, 10, 9, 1,
              8, 15, 10, 1,
              -6, 4, 4, 1,
              -9, 6, 5, 1
            ]
          },
          {
            duration: 6,
            hurtbubbles: [
              12, 4, 4, 1,
              -9, 6, 5, 1,
              -4, 10, 9, 1,
              8, 15, 10, 1,
              -6, 4, 4, 1,
              -9, 6, 5, 1
            ]
          },
          {
            duration: 2,
            hurtbubbles: [
              12, 4, 4, 1,
              25, 10, 5, 1,
              5, 10, 9, 1,
              15, 15, 10, 1,
              -6, 4, 4, 1,
              20, 6, 5, 1
            ],
          },
          {
            duration: 4,
            hurtbubbles: [
              12, 4, 4, 1,
              25, 10, 5, 1,
              20, 10, 9, 1,
              35, 15, 10, 1,
              34, 4, 4, 1,
              64, 15, 5, 1
            ],
            audio: 'shortwhiff',
            hitbubbles: [
              {
                type: 'ground',
                follow: 'lhand',
                x: -9,
                radius: 18,
                damage: 2,
                knockback: 3,
                angle: 180
              },
              {
                type: 'ground',
                follow: 'lhand',
                x: -39,
                y: 5,
                radius: 18,
                damage: 1.5,
                knockback: 3,
                angle: 0
              }
            ]
          },
          {
            duration: 4,
            reset: true,
            audio: 'shortwhiff',
            hitbubbles: true
          },
          {
            duration: 4,
            reset: true,
            hurtbubbles: [
              12, 4, 4, 1,
              25, 10, 5, 1,
              20, 10, 9, 1,
              35, 15, 10, 1,
              34, 4, 4, 1,
              64, 15, 5, 1
            ],
            audio: 'shortwhiff',
            hitbubbles: [
              {
                type: 'ground',
                follow: 'lhand',
                x: -9,
                radius: 18,
                damage: 8,
                knockback: 3,
                growth: 20,
                angle: 74
              },
              {
                type: 'ground',
                follow: 'lhand',
                x: -39,
                y: 5,
                radius: 18,
                damage: 8,
                knockback: 3,
                growth: 20,
                angle: 74
              },
            ]
          },
          {
            duration: 2,
            hurtbubbles: [
              12, 4, 4, 1,
              25, 10, 5, 1,
              20, 10, 9, 1,
              35, 15, 10, 1,
              34, 4, 4, 1,
              64, 15, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              12, 4, 4, 1,
              25, 10, 5, 1,
              20, 10, 9, 1,
              35, 15, 10, 1,
              34, 4, 4, 1,
              64, 15, 5, 1
            ]
          },
          {
            duration: 8,
            hurtbubbles: [
              12, 4, 4, 1,
              25, 6, 5, 1,
              5, 10, 9, 1,
              15, 15, 10, 1,
              10, 4, 4, 1,
              20, 6, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              12, 4, 4, 1,
              10, 10, 5, 1,
              0, 12, 9, 1,
              3, 24, 10, 1,
              -6, 4, 4, 1,
              5, 10, 5, 1
            ]
          }
        ]
      },
      {
        name: 'ftilt',
        cancellable: '',
        type: 1,
        transition: 'ftilt-neutral',
        // TODO: angle tilt
        angles: 1 | 2 | 4,
        keyframes: [
          {
            duration: 6,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 6,
            hurtbubbles: [
              -5, 10, 4, 1,
              -10, 10, 5, 1,
              -5, 20, 9, 1,
              -4, 34, 10, 1,
              -5, 4, 4, 1,
              0, 5, 5, 1
            ]
          }
        ]
      },
      {
        name: 'ftilt-neutral',
        cancellable: '',
        type: 1,
        iasa: 6,
        disableIK: true,
        keyframes: [
          {
            duration: 3,
            hurtbubbles: [
              -5, 10, 4, 1,
              -10, 10, 5, 1,
              -5, 20, 9, 1,
              -4, 34, 10, 1,
              -5, 4, 4, 1,
              0, 5, 5, 1
            ]
          },
          {
            duration: 2,
            hurtbubbles: [
              5, 40, 4, 1,
              47, 18, 5, 1,
              9, 20, 9, 1,
              4, 34, 10, 1,
              20, 4, 4, 1,
              0, 5, 5, 1
            ],
            audio: 'shortwhiff',
            hitbubbles: [
              {
                type: 'ground',
                follow: 'rhand',
                x: -10,
                y: 4,
                radius: 20,
                damage: 3,
                knockback: 2,
                angle: 180
              }
            ]
          },
          {
            duration: 1
          },
          {
            duration: 3,
            hurtbubbles: [
              15, 40, 4, 1,
              24, 18, 5, 1,
              9, 20, 9, 1,
              4, 34, 10, 1,
              20, 4, 4, 1,
              0, 5, 5, 1
            ]
          },
          {
            duration: 2,
            reset: true,
            hurtbubbles: [
              5, 40, 4, 1,
              47, 18, 5, 1,
              9, 20, 9, 1,
              4, 34, 10, 1,
              20, 4, 4, 1,
              0, 5, 5, 1
            ],
            audio: 'shortwhiff',
            hitbubbles: [
              {
                type: 'ground',
                follow: 'rhand',
                x: -10,
                y: 4,
                radius: 20,
                damage: 3,
                knockback: 2,
                angle: 180
              }
            ]
          },
          {
            duration: 1
          },
          {
            duration: 3,
            hurtbubbles: [
              15, 40, 4, 1,
              24, 18, 5, 1,
              9, 20, 9, 1,
              4, 34, 10, 1,
              20, 4, 4, 1,
              0, 5, 5, 1
            ]
          },
          {
            duration: 2,
            reset: true,
            hurtbubbles: [
              5, 40, 4, 1,
              47, 18, 5, 1,
              9, 20, 9, 1,
              4, 34, 10, 1,
              20, 4, 4, 1,
              0, 5, 5, 1
            ],
            audio: 'shortwhiff',
            hitbubbles: [
              {
                type: 'ground',
                follow: 'rhand',
                x: -10,
                y: 4,
                radius: 20,
                damage: 3,
                knockback: 2,
                angle: 180
              }
            ]
          },
          {
            duration: 1
          },
          {
            duration: 3,
            hurtbubbles: [
              15, 40, 4, 1,
              24, 18, 5, 1,
              9, 20, 9, 1,
              4, 34, 10, 1,
              20, 4, 4, 1,
              0, 5, 5, 1
            ]
          },
          {
            duration: 4,
            reset: true,
            hurtbubbles: [
              5, 40, 4, 1,
              47, 18, 5, 1,
              9, 20, 9, 1,
              4, 34, 10, 1,
              20, 4, 4, 1,
              0, 5, 5, 1
            ],
            audio: 'shortwhiff',
            hitbubbles: [
              {
                type: 'ground',
                follow: 'rhand',
                x: -10,
                y: 4,
                radius: 20,
                damage: 4,
                knockback: 8,
                growth: 24,
                sakurai: true
              },
              {
                type: 'ground',
                follow: 'rhand',
                x: -30,
                y: 4,
                radius: 20,
                damage: 4,
                knockback: 8,
                growth: 24,
                sakurai: true
              }
            ]
          },
          {
            duration: 1
          },
          {
            duration: 7,
            hurtbubbles: [
              5, 40, 4, 1,
              47, 18, 5, 1,
              9, 20, 9, 1,
              4, 34, 10, 1,
              20, 4, 4, 1,
              0, 5, 5, 1
            ]
          },
          {
            duration: 6,
            hurtbubbles: [
              10, 4, 4, 1,
              20, 5, 5, 1,
              0, 18, 9, 1,
              1, 37, 10, 1,
              20, 4, 4, 1,
              0, 5, 5, 1
            ]
          },
          {
            duration: 4,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          }
        ]
      },
      {
        name: 'ftilt-up',
        cancellable: '',
        type: 1,
        iasa: 6,
        disableIK: true,
        keyframes: [
          {
            duration: 3,
            hurtbubbles: [
              -5, 6, 4, 1,
              -10, 5, 5, 1,
              -5, 15, 9, 1,
              -4, 25, 10, 1,
              -5, 8, 4, 1,
              0, 5, 5, 1
            ]
          },
          {
            duration: 3,
            hurtbubbles: [
              53, 45, 4, 1,
              -10, 5, 5, 1,
              20, 30, 9, 1,
              -4, 25, 10, 1,
              51, 52, 4, 1,
              0, 5, 5, 1
            ],
            audio: 'longwhiff',
            hitbubbles: [
              {
                type: 'ground',
                follow: 'lfoot',
                x: -10,
                y: -2,
                radius: 20,
                damage: 8,
                knockback: 8,
                growth: 11,
                sakurai: true
              }
            ]
          },
          {
            duration: 20,
            hitbubbles: [
              {
                type: 'ground',
                follow: 'lfoot',
                x: -10,
                y: -1,
                radius: 20,
                damage: 7,
                knockback: 7,
                growth: 7,
                sakurai: true
              }
            ]
          },
          {
            duration: 6
          },
          {
            duration: 6,
            hurtbubbles: [
              38, 28, 4, 1,
              -10, 5, 5, 1,
              20, 30, 9, 1,
              -4, 25, 10, 1,
              35, 34, 4, 1,
              0, 5, 5, 1
            ]
          },
          {
            duration: 6,
            hurtbubbles: [
              10, 4, 4, 1,
              -10, 5, 5, 1,
              0, 18, 9, 1,
              1, 37, 10, 1,
              -5, 4, 4, 1,
              0, 5, 5, 1
            ]
          },
          {
            duration: 4,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          }
        ]
      },
      {
        name: 'ftilt-down',
        cancellable: '',
        type: 1,
        iasa: 6,
        disableIK: true,
        keyframes: [
          {
            duration: 3,
            hurtbubbles: [
              -5, 6, 4, 1,
              -10, 5, 5, 1,
              -5, 15, 9, 1,
              -4, 25, 10, 1,
              -5, 8, 4, 1,
              0, 5, 5, 1
            ]
          },
          {
            duration: 3,
            hurtbubbles: [
              42, 8, 4, 1,
              -10, 5, 5, 1,
              15, 15, 9, 1,
              -4, 25, 10, 1,
              45, 14, 4, 1,
              0, 5, 5, 1
            ],
            audio: 'longwhiff',
            hitbubbles: [
              {
                type: 'ground',
                follow: 'lfoot',
                x: -10,
                radius: 20,
                damage: 8,
                knockback: 8,
                growth: 11,
                sakurai: true
              }
            ]
          },
          {
            duration: 20,
            hitbubbles: [
              {
                type: 'ground',
                follow: 'lfoot',
                x: -10,
                radius: 20,
                damage: 7,
                knockback: 7,
                growth: 7,
                sakurai: true
              }
            ]
          },
          {
            duration: 6
          },
          {
            duration: 6,
            hurtbubbles: [
              25, 8, 4, 1,
              -10, 5, 5, 1,
              15, 15, 9, 1,
              -4, 25, 10, 1,
              25, 14, 4, 1,
              0, 5, 5, 1
            ]
          },
          {
            duration: 6,
            hurtbubbles: [
              10, 4, 4, 1,
              -10, 5, 5, 1,
              0, 18, 9, 1,
              1, 37, 10, 1,
              -5, 4, 4, 1,
              0, 5, 5, 1
            ]
          },
          {
            duration: 4,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          }
        ]
      },
      {
        name: 'utilt',
        cancellable: '',
        type: 1,
        iasa: 4,
        keyframes: [
          {
            duration: 4,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 3,
            hurtbubbles: [
              10, 4, 4, 1,
              3, 5, 5, 1,
              0, 9, 9, 1,
              6, 25, 10, 1,
              -5, 4, 4, 1,
              5, 5, 5, 1
            ]
          },
          {
            duration: 2,
            hurtbubbles: [
              10, 4, 4, 1,
              8, 7, 5, 1,
              2, 9, 9, 1,
              2, 25, 10, 1,
              -5, 4, 4, 1,
              5, 5, 5, 1
            ],
            audio: 'shortwhiff',
            hitbubbles: [
              {
                type: 'ground',
                y: 20,
                x: 18,
                radius: 20,
                damage: 2,
                knockback: 6,
                angle: 180
              },
              {
                type: 'ground',
                x: 6,
                y: 36,
                radius: 20,
                damage: 2,
                knockback: 6,
                angle: 180
              }
            ]
          },
          {
            duration: 2,
            reset: true,
            hurtbubbles: [
              10, 4, 4, 1,
              20, 25, 5, 1,
              6, 24, 9, 1,
              2, 45, 10, 1,
              -5, 4, 4, 1,
              5, 13, 5, 1
            ],
            hitbubbles: [
              {
                type: 'ground',
                follow: 'rhand',
                radius: 16,
                damage: 2,
                knockback: 4,
                angle: 180
              },
              {
                type: 'ground',
                follow: 'body',
                x: -3,
                y: 20,
                radius: 16,
                damage: 2,
                knockback: 4,
                angle: 180
              }
            ]
          },
          {
            duration: 2,
            reset: true,
            hurtbubbles: [
              10, 4, 4, 1,
              20, 25, 5, 1,
              6, 24, 9, 1,
              2, 45, 10, 1,
              -5, 4, 4, 1,
              5, 13, 5, 1
            ],
            hitbubbles: [
              {
                type: 'ground',
                follow: 'rhand',
                radius: 16,
                damage: 2,
                knockback: 4,
                angle: 180
              },
              {
                type: 'ground',
                follow: 'body',
                x: -3,
                y: 20,
                radius: 16,
                damage: 2,
                knockback: 4,
                angle: 180
              }
            ]
          },
          {
            duration: 2,
            reset: true,
            hurtbubbles: [
              10, 4, 4, 1,
              20, 25, 5, 1,
              6, 24, 9, 1,
              2, 45, 10, 1,
              -5, 4, 4, 1,
              5, 13, 5, 1
            ],
            hitbubbles: [
              {
                type: 'ground',
                follow: 'rhand',
                radius: 16,
                damage: 2,
                knockback: 4,
                angle: 180
              },
              {
                type: 'ground',
                follow: 'body',
                x: -3,
                y: 20,
                radius: 16,
                damage: 2,
                knockback: 4,
                angle: 180
              }
            ]
          },
          {
            duration: 4,
            reset: true,
            hurtbubbles: [
              10, 4, 4, 1,
              28, 60, 5, 1,
              5, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 13, 5, 1
            ],
            hitbubbles: [
              {
                type: 'ground',
                follow: 'rhand',
                x: -10,
                y: -2,
                radius: 18,
                damage: 4,
                knockback: 8,
                growth: 20,
                angle: 65
              },
              {
                type: 'ground',
                follow: 'body',
                x: -3,
                y: 16,
                radius: 16,
                damage: 4,
                knockback: 8,
                growth: 20,
                angle: 65
              }
            ]
          },
          {
            duration: 12,
            hurtbubbles: [
              2, 4, 4, 1,
              22, 60, 5, 1,
              5, 24, 9, 1,
              1, 45, 10, 1,
              -7, 4, 4, 1,
              5, 13, 5, 1
            ]
          },
          {
            duration: 19,
            hurtbubbles: [
              10, 10, 4, 1,
              8, 10, 5, 1,
              3, 22, 9, 1,
              9, 40, 10, 1,
              -5, 4, 4, 1,
              14, 28, 5, 1
            ]
          },
          {
            duration: 15,
            hurtbubbles: [
              10, 6, 4, 1,
              8, 10, 5, 1,
              3, 22, 9, 1,
              9, 40, 10, 1,
              -5, 4, 4, 1,
              7, 20, 5, 1
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
        disableIK: true,
        keyframes: [
          {
            duration: 2,
            interpolate: true,
            hurtbubbles: [
              -4, 5, 4, 1,
              -4, 5, 5, 1,
              -10, 15, 9, 1,
              -16, 35, 10, 1,
              -2, 4, 4, 1,
              -6, 24, 5, 1
            ]
          },
          {
            duration: 12,
            hurtbubbles: [
              -4, 5, 4, 1,
              -4, 5, 5, 1,
              -10, 15, 9, 1,
              -16, 35, 10, 1,
              -2, 4, 4, 1,
              -6, 24, 5, 1
            ]
          },
          {
            duration: 5,
            hurtbubbles: [
              -28, 20, 4, 1,
              -22, 5, 5, 1,
              -18, 15, 9, 1,
              -25, 35, 10, 1,
              -2, 4, 4, 1,
              -12, 14, 5, 1
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
        disableIK: true,
        type: 1,
        keyframes: [
          {
            duration: 5,
            hurtbubbles: [
              -28, 20, 4, 1,
              -22, 5, 5, 1,
              -18, 15, 9, 1,
              -25, 35, 10, 1,
              -2, 4, 4, 1,
              -12, 14, 5, 1
            ]
          },
          {
            duration: 85,
            audio: 'charging'
          },
          {
            duration: 5,
            hurtbubbles: [
              -28, 20, 4, 1,
              -22, 5, 5, 1,
              -18, 15, 9, 1,
              -25, 35, 10, 1,
              -2, 4, 4, 1,
              -12, 14, 5, 1
            ]
          }
        ]
      },
      {
        name: 'fsmash-release',
        cancellable: '',
        type: 1,
        iasa: 8,
        disableIK: true,
        keyframes: [
          {
            duration: 5,
            hurtbubbles: [
              -28, 20, 4, 1,
              -22, 5, 5, 1,
              -18, 15, 9, 1,
              -25, 35, 10, 1,
              -2, 4, 4, 1,
              -12, 14, 5, 1
            ]
          },
          {
            duration: 2,
            hurtbubbles: [
              -28, 20, 4, 1,
              -22, 5, 5, 1,
              -18, 15, 9, 1,
              -25, 35, 10, 1,
              -2, 4, 4, 1,
              -12, 14, 5, 1
            ]
          },
          {
            duration: 4,
            audio: 'longwhiff',
            hitbubbles: [
              {
                type: 'ground',
                follow: 'head',
                x: 0,
                y: 0,
                radius: 22,
                damage: 11,
                knockback: 2,
                growth: 18,
                sakurai: true
              },
              {
                type: 'ground',
                follow: 'body',
                x: -15,
                y: 4,
                radius: 16,
                damage: 11,
                knockback: 2,
                growth: 18,
                sakurai: true
              },
            ]
          },
          {
            duration: 6,
            hurtbubbles: [
              5, 12, 4, 1,
              -22, 5, 5, 1,
              33, 18, 9, 1,
              45, 24, 10, 1,
              30, 4, 4, 1,
              25, 12, 5, 1
            ],
            hitbubbles: true
          },
          {
            duration: 12,
            hurtbubbles: [
              5, 4, 4, 1,
              -22, 5, 5, 1,
              33, 18, 9, 1,
              45, 24, 10, 1,
              30, 4, 4, 1,
              25, 12, 5, 1
            ]
          },
          {
            duration: 5,
            hurtbubbles: [
              14, 4, 4, 1,
              -9, 14, 5, 1,
              6, 18, 9, 1,
              16, 37, 10, 1,
              -2, 4, 4, 1,
              16, 20, 5, 1
            ]
          },
          {
            duration: 18,
            hurtbubbles: [
              12, 4, 4, 1,
              5, 15, 5, 1,
              5, 18, 9, 1,
              12, 37, 10, 1,
              -2, 4, 4, 1,
              16, 20, 5, 1
            ]
          },
          {
            duration: 5,
            hurtbubbles: [
              10, 4, 4, 1,
              2, 15, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              2, 15, 5, 1
            ]
          }
        ]
      },
      {
        name: 'usmash',
        cancellable: '',
        transition: 'usmash-charge',
        type: 1,
        keyframes: [
          {
            duration: 3,
            interpolate: true,
            hurtbubbles: [
              15, 4, 4, 1,
              20, 10, 5, 1,
              8, 19, 9, 1,
              11, 38, 10, 1,
              -10, 4, 4, 1,
              25, 35, 5, 1
            ]
          },
          {
            duration: 3,
            hurtbubbles: [
              15, 4, 4, 1,
              20, 10, 5, 1,
              8, 19, 9, 1,
              11, 38, 10, 1,
              -10, 4, 4, 1,
              25, 35, 5, 1
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
        keyframes: [
          {
            duration: 5,
            hurtbubbles: [
              15, 4, 4, 1,
              20, 10, 5, 1,
              8, 19, 9, 1,
              11, 38, 10, 1,
              -10, 4, 4, 1,
              25, 35, 5, 1
            ]
          },
          {
            duration: 85,
            audio: 'charging'
          },
          {
            duration: 1,
            hurtbubbles: [
              15, 4, 4, 1,
              20, 10, 5, 1,
              8, 19, 9, 1,
              11, 38, 10, 1,
              -10, 4, 4, 1,
              25, 35, 5, 1
            ]
          }
        ]
      },
      {
        name: 'usmash-release',
        cancellable: '',
        type: 1,
        iasa: 4,
        keyframes: [
          {
            interpolate: true,
            duration: 2,
            hurtbubbles: [
              15, 4, 4, 1,
              13, 13, 5, 1,
              8, 19, 9, 1,
              11, 38, 10, 1,
              -10, 4, 4, 1,
              34, 38, 5, 1
            ]
          },
          {
            duration: 1,
            hurtbubbles: [
              15, 4, 4, 1,
              13, 13, 5, 1,
              8, 19, 9, 1,
              11, 38, 10, 1,
              -10, 4, 4, 1,
              34, 38, 5, 1
            ]
          },
          { // side
            duration: 2,
            hurtbubbles: [
              15, 4, 4, 1,
              19, 40, 5, 1,
              5, 24, 9, 1,
              7, 45, 10, 1,
              -10, 4, 4, 1,
              -7, 25, 5, 1
            ]
          },
          { // up hit
            duration: 2,
            hurtbubbles: [
              15, 4, 4, 1,
              33, 20, 5, 1,
              5, 24, 9, 1,
              7, 45, 10, 1,
              -10, 4, 4, 1,
              1, 25, 5, 1
            ],
            audio: 'longwhiff',
            hitbubbles: [
              {
                type: 'ground',
                flags: 'stale_di',
                x: 5,
                y: 15,
                radius: 20,
                damage: 12,
                knockback: 6,
                growth: 18,
                angle: 83
              },
              {
                type: 'ground',
                flags: 'stale_di',
                x: 33,
                y: 20,
                radius: 20,
                damage: 12,
                knockback: 6,
                growth: 18,
                angle: 83
              }
            ]
          },
          {
            duration: 2,
            hurtbubbles: [
              15, 4, 4, 1,
              28, 50, 5, 1,
              5, 24, 9, 1,
              7, 45, 10, 1,
              -10, 4, 4, 1,
              1, 25, 5, 1
            ],
            hitbubbles: [
              {
                type: 'ground',
                flags: 'stale_di',
                x: 28,
                y: 50,
                radius: 20,
                damage: 12,
                knockback: 6,
                growth: 18,
                angle: 80
              }
            ]
          },
          {
            duration: 2,
            hurtbubbles: [
              15, 4, 4, 1,
              10, 65, 5, 1,
              5, 24, 9, 1,
              7, 45, 10, 1,
              -10, 4, 4, 1,
              1, 25, 5, 1
            ],
            hitbubbles: [
              {
                type: 'ground',
                flags: 'stale_di',
                x: 10,
                y: 65,
                radius: 20,
                damage: 12,
                knockback: 6,
                growth: 18,
                angle: 50
              }
            ]
          },
          {
            duration: 2,
            hurtbubbles: [
              15, 4, 4, 1,
              -20, 45, 5, 1,
              5, 24, 9, 1,
              7, 45, 10, 1,
              -10, 4, 4, 1,
              1, 25, 5, 1
            ],
            hitbubbles: [
              {
                type: 'ground',
                x: -20,
                y: 45,
                radius: 20,
                damage: 12,
                knockback: 6,
                growth: 18,
                angle: 40
              }
            ]
          },
          {
            duration: 2,
            hurtbubbles: [
              15, 4, 4, 1,
              -30, 30, 5, 1,
              5, 24, 9, 1,
              7, 45, 10, 1,
              -10, 4, 4, 1,
              1, 25, 5, 1
            ],
            hitbubbles: [
              {
                type: 'ground',
                x: -30,
                y: 30,
                radius: 20,
                damage: 12,
                knockback: 6,
                growth: 18,
                angle: 37
              }
            ]
          },
          {
            duration: 6
          },
          { // up shake
            duration: 4,
            hurtbubbles: [
              15, 4, 4, 1,
              -24, 24, 5, 1,
              5, 24, 9, 1,
              7, 45, 10, 1,
              -10, 4, 4, 1,
              1, 25, 5, 1
            ]
          },
          { // up shook
            duration: 8,
            hurtbubbles: [
              15, 4, 4, 1,
              -9, 30, 5, 1,
              5, 20, 9, 1,
              7, 40, 10, 1,
              -10, 4, 4, 1,
              4, 25, 5, 1
            ]
          },
          { // up shook
            duration: 8,
            hurtbubbles: [
              15, 4, 4, 1,
              5, 15, 5, 1,
              5, 20, 9, 1,
              7, 40, 10, 1,
              -10, 4, 4, 1,
              4, 25, 5, 1
            ]
          },
          { // withdraw
            duration: 10,
            hurtbubbles: [
              15, 4, 4, 1,
              7, 20, 5, 1,
              5, 20, 9, 1,
              7, 40, 10, 1,
              -10, 4, 4, 1,
              4, 25, 5, 1
            ]
          },
          {
            duration: 15,
            hurtbubbles: [
              10, 4, 4, 1,
              2, 15, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              2, 15, 5, 1
            ]
          }
        ]
      },
      {
        name: 'dsmash',
        cancellable: '',
        transition: 'dsmash-charge',
        type: 1,
        keyframes: [
          {
            interpolate: true,
            duration: 3,
            hurtbubbles: [
              -7, 4, 4, 1,
              6, 5, 5, 1,
              3, 15, 9, 1,
              5, 28, 10, 1,
              -7, 4, 4, 1,
              -6, 5, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              -7, 4, 4, 1,
              6, 5, 5, 1,
              3, 15, 9, 1,
              5, 28, 10, 1,
              -7, 4, 4, 1,
              -6, 5, 5, 1
            ]
          }
        ]
      },
      {
        name: 'dsmash-charge',
        cancellable: '',
        handler: 'charge',
        transition: 'dsmash-release',
        release: 'dsmash-release',
        type: 1,
        keyframes: [
          {
            duration: 5,
            hurtbubbles: [
              -7, 4, 4, 1,
              6, 5, 5, 1,
              3, 15, 9, 1,
              5, 28, 10, 1,
              -7, 4, 4, 1,
              -6, 5, 5, 1
            ]
          },
          {
            duration: 85,
            audio: 'charging'
          },
          {
            duration: 1,
            hurtbubbles: [
              -7, 4, 4, 1,
              6, 5, 5, 1,
              3, 15, 9, 1,
              5, 28, 10, 1,
              -7, 4, 4, 1,
              -6, 5, 5, 1
            ]
          }
        ]
      },
      {
        name: 'dsmash-release',
        cancellable: '',
        type: 1,
        iasa: 4,
        disableIK: true,
        keyframes: [
          {
            interpolate: true,
            duration: 4,
            hurtbubbles: [
              -14, 4, 4, 1,
              6, 5, 5, 1,
              0, 15, 9, 1,
              0, 28, 10, 1,
              -17, 4, 4, 1,
              -6, 5, 5, 1
            ]
          },
          {
            duration: 4,
            hurtbubbles: [
              -10, 4, 4, 1,
              6, 5, 5, 1,
              0, 15, 9, 1,
              0, 28, 10, 1,
              4, 4, 4, 1,
              -6, 5, 5, 1
            ]
          },
          {
            duration: 4,
            audio: 'shortwhiff',
            hitAudio: 'wham',
            hitbubbles: [
              {
                type: 'ground',
                follow: 'rfoot',
                x: -7,
                radius: 20,
                damage: 12,
                knockback: 3,
                growth: 15,
                angle: 40
              },
              {
                type: 'ground',
                follow: 'lfoot',
                x: 7,
                radius: 20,
                damage: 12,
                knockback: 3,
                growth: 15,
                angle: 40
              }
            ]
          },
          {
            duration: 6,
            hurtbubbles: [
              35, 17, 4, 1,
              6, 5, 5, 1,
              -2, 15, 9, 1,
              -5, 23, 10, 1,
              -30, 15, 4, 1,
              -6, 5, 5, 1
            ],
            hitbubbles: [
              {
                type: 'ground',
                follow: 'rfoot',
                x: -7,
                radius: 20,
                damage: 8,
                knockback: 3,
                growth: 12,
                angle: 37
              },
              {
                type: 'ground',
                follow: 'lfoot',
                x: 7,
                radius: 20,
                damage: 8,
                knockback: 3,
                growth: 12,
                angle: 37
              }
            ]
          },
          {
            duration: 5,
            hurtbubbles: [
              35, 17, 4, 1,
              6, 5, 5, 1,
              -2, 15, 9, 1,
              -5, 23, 10, 1,
              -30, 15, 4, 1,
              -6, 5, 5, 1
            ],
          },
          {
            duration: 8,
            hurtbubbles: [
              30, 16, 4, 1,
              6, 5, 5, 1,
              2, 15, 9, 1,
              3, 25, 10, 1,
              -25, 15, 4, 1,
              -6, 5, 5, 1
            ]
          },
          {
            duration: 6,
            hurtbubbles: [
              -8, 4, 4, 1,
              6, 5, 5, 1,
              0, 15, 9, 1,
              2, 28, 10, 1,
              4, 4, 4, 1,
              -6, 5, 5, 1
            ]
          },
          {
            duration: 5,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          }
        ]
      },
      {
        name: 'nair',
        cancellable: '',
        cancel: 13,
        type: 2,
        iasa: 9,
        early: 6,
        late: 12,
        keyframes: [
          {
            duration: 3,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 2,
            hurtbubbles: [
              -10, 5, 4, 1,
              10, 17, 5, 1,
              0, 7, 9, 1,
              2, 28, 10, 1,
              10, 5, 4, 1,
              -10, 20, 5, 1
            ]
          },
          {
            duration: 4,
            hurtbubbles: [
              35, 17, 4, 1,
              10, 17, 5, 1,
              0, 7, 9, 1,
              2, 28, 10, 1,
              -10, 17, 4, 1,
              -10, 20, 5, 1
            ],
            audio: 'longwhiff',
            hitAudio: 'wham',
            hitbubbles: [
              {
                type: 'aerial',
                follow: 'rfoot',
                x: -5,
                radius: 18,
                damage: 12,
                knockback: 4,
                growth: 12,
                angle: 30
              },
              {
                type: 'aerial',
                follow: 'lfoot',
                x: 10,
                radius: 18,
                damage: 12,
                knockback: 4,
                growth: 12,
                angle: 30
              }
            ]
          },
          {
            duration: 6,
            hitbubbles: [
              {
                type: 'aerial',
                follow: 'rfoot',
                x: -5,
                radius: 18,
                damage: 6,
                knockback: 2,
                growth: 8,
                angle: 30
              },
              {
                type: 'aerial',
                follow: 'lfoot',
                x: 10,
                radius: 18,
                damage: 6,
                knockback: 2,
                growth: 8,
                angle: 30
              }
            ]
          },
          {
            duration: 6,
            hitbubbles: [
              {
                type: 'aerial',
                follow: 'rfoot',
                x: -5,
                radius: 18,
                damage: 3,
                knockback: 2,
                growth: 7,
                angle: 30
              },
              {
                type: 'aerial',
                follow: 'lfoot',
                x: 10,
                radius: 18,
                damage: 3,
                knockback: 2,
                growth: 4,
                angle: 30
              }
            ]
          },
          {
            duration: 16,
            hurtbubbles: [
              35, 17, 4, 1,
              5, 17, 5, 1,
              0, 7, 9, 1,
              2, 28, 10, 1,
              -10, 17, 4, 1,
              -5, 20, 5, 1
            ]
          },
          {
            duration: 10,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          }
        ]
      }, 
      {
        name: 'fair',
        cancellable: '',
        cancel: 30,
        type: 2,
        early: 3,
        late: 7,
        iasa: 7,
        keyframes: [
          {
            duration: 3,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 14,
            hurtbubbles: [
              5, 5, 4, 1,
              5, 29, 5, 1,
              0, 24, 9, 1,
              -3, 35, 10, 1,
              -3, 5, 4, 1,
              4, 12, 5, 1
            ]
          },
          {
            duration: 2,
            hurtbubbles: [
              5, 5, 4, 1,
              5, 29, 5, 1,
              0, 24, 9, 1,
              -3, 35, 10, 1,
              -3, 5, 4, 1,
              4, 12, 5, 1
            ],
            audio: 'shortwhiff',
            hitAudio: 'wham',
            hitbubbles: [
              {
                type: 'aerial',
                follow: 'rhand',
                x: 10,
                y: 0,
                radius: 20,
                damage: 13,
                knockback: 7,
                growth: 14,
                angle: 30
              },
              {
                type: 'aerial',
                follow: 'rhand',
                x: -20,
                y: 0,
                radius: 18,
                damage: 8,
                knockback: 7,
                growth: 14,
                angle: 30
              }
            ]
          },
          {
            duration: 2,
            hurtbubbles: [
              -16, 10, 4, 1,
              57, 29, 5, 1,
              -5, 24, 9, 1,
              10, 30, 10, 1,
              -12, 9, 4, 1,
              4, 12, 5, 1
            ],
            hitbubbles: [
              {
                type: 'aerial',
                follow: 'rhand',
                x: -10,
                y: 0,
                radius: 20,
                damage: 13,
                knockback: 7,
                growth: 14,
                angle: 30
              },
              {
                type: 'aerial',
                follow: 'rhand',
                x: -30,
                y: 10,
                radius: 18,
                damage: 8,
                knockback: 7,
                growth: 14,
                angle: 30
              }
            ]
          },
          {
            duration: 3,
            hurtbubbles: [
              -26, 20, 4, 1,
              47, 0, 5, 1,
              -5, 24, 9, 1,
              15, 27, 10, 1,
              -19, 12, 4, 1,
              4, 12, 5, 1
            ],
            hitbubbles: [
              {
                type: 'aerial',
                follow: 'rhand',
                x: -10,
                y: 0,
                radius: 20,
                damage: 13,
                knockback: 7,
                growth: 14,
                angle: 30
              }
            ]
          },
          {
            duration: 9,
            hurtbubbles: [
              -26, 20, 4, 1,
              44, -10, 5, 1,
              -5, 24, 9, 1,
              15, 27, 10, 1,
              -19, 12, 4, 1,
              4, 12, 5, 1
            ]
          },
          {
            duration: 17,
            hurtbubbles: [
              -26, 20, 4, 1,
              12, 10, 5, 1,
              -5, 24, 9, 1,
              15, 27, 10, 1,
              -19, 12, 4, 1,
              4, 12, 5, 1
            ]
          },
          {
            duration: 5,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          }
        ]
      },
      {
        name: 'bair',
        cancellable: '',
        cancel: 18,
        type: 2,
        early: 6,
        late: 8,
        iasa: 8,
        keyframes: [
          {
            duration: 2,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 3,
            hurtbubbles: [
              19, 14, 4, 1,
              8, 20, 5, 1,
              0, 15, 9, 1,
              -8, 25, 10, 1,
              10, 9, 4, 1,
              3, 15, 5, 1
            ]
          },
          {
            duration: 2,
            hurtbubbles: [
              -15, 16, 4, 1,
              5, 10, 5, 1,
              0, 15, 9, 1,
              15, 15, 10, 1,
              -15, 13, 4, 1,
              7, 5, 5, 1
            ]
          },
          {
            duration: 4,
            hurtbubbles: [
              -40, 16, 4, 1,
              5, 10, 5, 1,
              0, 15, 9, 1,
              15, 15, 10, 1,
              -37, 13, 4, 1,
              7, 5, 5, 1
            ],
            audio: 'shortwhiff',
            hitbubbles: [
              {
                type: 'aerial',
                follow: 'rfoot',
                x: 12,
                radius: 24,
                damage: 9,
                knockback: 7,
                growth: 14,
                sakurai: true
              },
              {
                type: 'aerial',
                follow: 'body',
                x: 4,
                radius: 21,
                damage: 9,
                knockback: 7,
                growth: 14,
                sakurai: true
              }
            ]
          },
          {
            duration: 12,
            hitAudio: 'hit',
            hitbubbles: [
              {
                type: 'aerial',
                follow: 'rfoot',
                x: 16,
                radius: 23,
                damage: 6,
                knockback: 7,
                growth: 12,
                sakurai: true
              },
              {
                type: 'aerial',
                follow: 'body',
                x: 4,
                radius: 20,
                damage: 6,
                knockback: 7,
                growth: 12,
                sakurai: true
              }
            ]
          },
          {
            duration: 1,
            hurtbubbles: [
              -40, 16, 4, 1,
              5, 10, 5, 1,
              0, 15, 9, 1,
              15, 15, 10, 1,
              -37, 13, 4, 1,
              7, 5, 5, 1
            ]
          },
          {
            duration: 6,
            hurtbubbles: [
              -15, 16, 4, 1,
              5, 10, 5, 1,
              0, 15, 9, 1,
              15, 15, 10, 1,
              -15, 13, 4, 1,
              7, 5, 5, 1
            ]
          },
          {
            duration: 6,
            hurtbubbles: [
              11, 11, 4, 1,
              12, 28, 5, 1,
              0, 20, 9, 1,
              -3, 35, 10, 1,
              10, 8, 4, 1,
              11, 26, 5, 1
            ]
          },
          {
            duration: 12,
            hurtbubbles: [
              2, 2, 4, 1,
              7, 24, 5, 1,
              0, 20, 9, 1,
              2, 35, 10, 1,
              -11, 0, 4, 1,
              9, 22, 5, 1
            ]
          },
          {
            duration: 15,
            hurtbubbles: [
              12, -4, 4, 1,
              -4, 37, 5, 1,
              0, 17, 9, 1,
              1, 37, 10, 1,
              -5, -4, 4, 1,
              4, 39, 5, 1
            ]
          }
        ]
      },
      {
        name: 'uair',
        cancellable: '',
        cancel: 21,
        early: 3,
        late: 8,
        type: 2,
        keyframes: [
          {
            interpolate: true,
            duration: 6,
            hurtbubbles: [
              2, -4, 4, 1,
              20, 3, 5, 1,
              0, 17, 9, 1,
              0, 37, 10, 1,
              -2, -4, 4, 1,
              -20, 3, 5, 1
            ]
          },
          {
            duration: 3,
            hurtbubbles: [
              2, -4, 4, 1,
              10, 0, 5, 1,
              0, 17, 9, 1,
              0, 37, 10, 1,
              -2, -4, 4, 1,
              -10, 0, 5, 1
            ]
          },
          {
            duration: 8,
            audio: 'longwhiff',
            hitAudio: 'wham',
            hitbubbles: [
              {
                type: 'aerial',
                flags: 'stale_di',
                x: 0,
                y: 35,
                radius: 13,
                damage: 11,
                knockback: 6,
                growth: 16,
                angle: 90
              },
              {
                type: 'aerial',
                flags: 'stale_di',
                x: 0,
                y: 66,
                radius: 13,
                damage: 11,
                knockback: 6,
                growth: 16,
                angle: 90
              }
            ]
          },
          {
            duration: 16,
            hitbubbles: [
              {
                type: 'aerial',
                flags: 'stale_di',
                x: 0,
                y: 35,
                radius: 24,
                damage: 6,
                knockback: 6,
                growth: 16,
                angle: 90
              },
              {
                type: 'aerial',
                flags: 'stale_di',
                x: 0,
                y: 66,
                radius: 15,
                damage: 6,
                knockback: 6,
                growth: 16,
                angle: 90
              }
            ]
          },
          {
            duration: 6,
            hurtbubbles: [
              -2, -4, 4, 1,
              -10, 60, 5, 1,
              0, 14, 9, 1,
              0, 34, 10, 1,
              2, -4, 4, 1,
              10, 60, 5, 1
            ],
          },
          {
            duration: 13,
            hurtbubbles: [
              2, -4, 4, 1,
              15, 20, 5, 1,
              0, 17, 9, 1,
              0, 37, 10, 1,
              -2, -4, 4, 1,
              -15, 20, 5, 1
            ]
          },
          {
            duration: 15,
            hurtbubbles: [
              10, -4, 4, 1,
              10, 20, 5, 1,
              0, 17, 9, 1,
              1, 37, 10, 1,
              -5, -4, 4, 1,
              5, 20, 5, 1
            ]
          }
        ]
      },
      {
        name: 'uair-fastcancel',
        cancellable: '',
        type: 4,
        keyframes: [
          {
            interpolate: true,
            duration: 11,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 5,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 24, 9, 1,
              1, 45, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          }
        ]
      },
      {
        name: 'dair',
        cancellable: '',
        cancel: 27,
        type: 2,
        early: 4,
        late: 4,
        iasa: 4,
        keyframes: [
          {
            interpolate: true,
            duration: 4,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              -1, 17, 9, 1,
              -2, 37, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 9,
            hurtbubbles: [
              10, 4, 4, 1,
              10, 20, 5, 1,
              0, 17, 9, 1,
              1, 37, 10, 1,
              -5, 4, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 5,
            hurtbubbles: [
              16, -4, 4, 1,
              3, 6, 5, 1,
              -1, 16, 9, 1,
              -6, 34, 10, 1,
              2, -9, 4, 1,
              4, 10, 5, 1
            ],
            audio: 'longwhiff',
            hitbubbles: [
              {
                type: 'aerial',
                x: 0,
                y: 5,
                radius: 18,
                damage: 14,
                knockback: 0,
                growth: 14,
                angle: 25,
                lag: 2
              },
              {
                type: 'aerial',
                x: 0,
                y: 25,
                radius: 18,
                damage: 14,
                knockback: 0,
                growth: 14,
                angle: 25,
                lag: 2
              }
            ]
          },
          {
            duration: 8,
            hurtbubbles: [
              2, -9, 4, 1,
              3, 6, 5, 1,
              -1, 16, 9, 1,
              -6, 34, 10, 1,
              16, -4, 4, 1,
              4, 10, 5, 1
            ],
            hitbubbles: true
          },
          {
            duration: 8,
            hurtbubbles: [
              16, -4, 4, 1,
              3, 6, 5, 1,
              -1, 16, 9, 1,
              -6, 34, 10, 1,
              2, -9, 4, 1,
              4, 10, 5, 1
            ],
            hitbubbles: true
          },
          {
            duration: 15,
            hurtbubbles: [
              2, -9, 4, 1,
              3, 6, 5, 1,
              -1, 16, 9, 1,
              -6, 34, 10, 1,
              16, -4, 4, 1,
              4, 10, 5, 1
            ]
          },
          {
            duration: 4,
            hurtbubbles: [
              -2, 0, 4, 1,
              3, 6, 5, 1,
              0, 17, 9, 1,
              2, 37, 10, 1,
              6, 0, 4, 1,
              5, 20, 5, 1
            ]
          },
          {
            duration: 5,
            hurtbubbles: [
              12, -4, 4, 1,
              -4, 37, 5, 1,
              0, 17, 9, 1,
              1, 37, 10, 1,
              -5, -4, 4, 1,
              4, 39, 5, 1
            ]
          }
        ]
      }
    ]
  })
  window.dispatchEvent(evt)
}())
