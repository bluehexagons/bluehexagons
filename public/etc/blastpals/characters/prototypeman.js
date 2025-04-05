(function () {
	"use strict";
	var evt = new Event('characterloaded'),
		hbColor = 20,
		grabColor = 101,
		ox = -75,
		oy = -80;
	evt.characterData = {
		"name": "Prototype Man",
		"hurtbubbles": 6,
		"fallSpeed": 0.5,
		"arcSpeed": 0.5,
		"maxFallSpeed": 12,
		"fastfallSpeed": 0.7,
		"maxFastfall": 5.25,
		"aerodynamics": 0.99,
		"fallFriction": 0.99,
		"arcWeight": 1,
		"weight": 1,
		"launchResistance": 10,
		"moonwalk": 6,
		"directionalInfluence": 0.8,
		"maxDI": 4,
		"sdi": 25,
		"height": 60,
		"grabYOffset": -26,
		"grabXOffset": 20,
		"grabRadius": 31,
		"grabDirections": 4,
		"friction": 0.8,
		"slideFriction": 0.90,
		"shieldRegen": 0.0030,
		"shieldDecay": 0.0020,
		"landingAudio": "landing",
		"lagCancelAudio": "lagcancel",
		/*"backdrop": [
			[75 + ox,25 + oy],
			[25 + ox,25 + oy,25 + ox,62.5 + oy],
			[25 + ox,100 + oy,50 + ox,100 + oy],
			[50 + ox,120 + oy,30 + ox,125 + oy],
			[60 + ox,120 + oy,65 + ox,100 + oy],
			[125 + ox,100 + oy,125 + ox,62.5 + oy],
			[125 + ox,25 + oy,75 + ox,25 + oy]
		],
		"backdropFollow": 2,*/
		"animations": [
			{
				"name": "idle",
				"cancellable": "all",
				"type": 0,
				"keyframes": [
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 22, 7, 1,
							0, 15, 15, 1,
							6, 35, 25, 1,
							-2, 4, 4, 1,
							5, 18, 7, 1
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "dtaunt",
				"cancellable": "",
				"transition": "trip",
				"type": 0,
				"keyframes": [
					{
						"duration": 2,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					},
					{
						"duration": 2,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 22, 7, 1,
							0, 15, 15, 1,
							6, 35, 25, 1,
							-2, 4, 4, 1,
							5, 18, 7, 1
						]
					}
				]
			},
			{
				"name": "staunt",
				"cancellable": "",
				"type": 0,
				"keyframes": [
					{
						"duration": 12,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					},
					{
						"duration": 20,
						"hurtbubbles": [
							5, 4, 8, 1,
							10, 20, 9, 1,
							0, 15, 4, 1,
							2, 30, 30, 1,
							-2, 4, 43, 1,
							5, 20, 2, 1
						]
					},
					{
						"duration": 20,
						"hurtbubbles": [
							-15, 4, 2, 1,
							-5, 45, 30, 1,
							0, 15, 3, 1,
							0, 35, 8, 1,
							15, 4, 40, 1,
							35, 18, 15, 1
						]
					},
					{
						"duration": 20,
						"hurtbubbles": [
							5, 4, 25, 1,
							10, 20, 13, 1,
							0, 15, 4, 1,
							2, 30, 42, 1,
							-2, 4, 1, 1,
							5, 20, 22, 1
						]
					},
					{
						"duration": 6,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "utaunt",
				"cancellable": "",
				"type": 0,
				"keyframes": [
					{
						"duration": 12,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					},
					{
						"duration": 20,
						"hurtbubbles": [
							-15, 4, 4, 1,
							-35, 18, 7, 1,
							0, 15, 15, 1,
							0, 35, 25, 1,
							15, 4, 4, 1,
							35, 18, 7, 1
						]
					},
					{
						"duration": 20,
						"hurtbubbles": [
							-15, 4, 4, 1,
							-5, 45, 7, 1,
							0, 15, 15, 1,
							0, 35, 25, 1,
							15, 4, 4, 1,
							35, 18, 7, 1
						]
					},
					{
						"duration": 20,
						"hurtbubbles": [
							-15, 4, 4, 1,
							-5, 45, 7, 1,
							0, 15, 15, 1,
							0, 35, 25, 1,
							15, 4, 4, 1,
							35, 18, 7, 1
						]
					},
					{
						"duration": 6,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "respawn",
				"cancellable": "",
				"type": 0,
				"gravity": 0,
				"start": "respawn",
				"nodi": true,
				"nofastfall": true,
				"transition": "waiting",
				"interrupted": "respawn",
				"keyframes": [
					{
						"duration": 60,
						"hurtbubbles": [
							5, 4, 1, 5,
							10, 20, 1, 5,
							0, 15, 1, 5,
							2, 30, 1, 5,
							-2, 4, 1, 5,
							5, 20, 1, 5
						]
					},
					{
						"duration": 60,
						"hurtbubbles": [
							5, 4, 4, 5,
							10, 20, 7, 5,
							0, 15, 15, 5,
							2, 30, 25, 5,
							-2, 4, 4, 5,
							5, 20, 7, 5
						]
					}
				]
			},
			{
				"name": "waiting",
				"cancellable": "all",
				"type": 0,
				"gravity": 0,
				"nodi": true,
				"nofastfall": true,
				"start": "respawn",
				"handler": "respawn",
				"end": "respawn",
				"interrupted": "respawn",
				"keyframes": [
					{
						"duration": 180,
						"hurtbubbles": [
							5, 4, 4, 5,
							10, 20, 7, 5,
							0, 15, 15, 5,
							2, 30, 25, 5,
							-2, 4, 4, 5,
							5, 20, 7, 5
						]
					},
					{
						"duration": 180,
						"hurtbubbles": [
							5, 4, 4, 5,
							10, 22, 7, 5,
							0, 15, 15, 5,
							6, 35, 25, 5,
							-2, 4, 4, 5,
							5, 18, 7, 5
						]
					},
					{
						"duration": 180,
						"hurtbubbles": [
							5, 4, 4, 5,
							10, 20, 7, 5,
							0, 15, 15, 5,
							2, 30, 25, 5,
							-2, 4, 4, 5,
							5, 20, 7, 5
						]
					}
				]
			},
			{
				"name": "bounced",
				"cancellable": "",
				"cancel": "fallen",
				"nodi": true,
				"techable": true,
				"nofastfall": true,
				"type": 4,
				"handler": "stunned",
				"transition": "stunned",
				"keyframes": [
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 42, 7, 1,
							0, 15, 15, 1,
							6, 35, 25, 1,
							-2, 4, 4, 1,
							5, 38, 7, 1
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 40, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 40, 7, 1
						]
					}
				]
			},
			{
				"name": "airhit",
				"cancellable": "",
				"cancel": "fallen",
				"nodi": true,
				"techable": true,
				"nofastfall": true,
				"type": 4,
				"handler": "stunned",
				"transition": "stunned",
				"keyframes": [
					{
						"duration": 5,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					},
					{
						"duration": 5,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 42, 7, 1,
							0, 15, 15, 1,
							6, 35, 25, 1,
							-2, 4, 4, 1,
							5, 38, 7, 1
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 40, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 40, 7, 1
						]
					}
				]
			},
			{
				"name": "meteorhit",
				"cancellable": "airupspecial.airjump0",
				"cancel": "fallen",
				"nodi": true,
				"techable": true,
				"nofastfall": true,
				"type": 4,
				"handler": "meteor",
				"canceled": "meteor",
				"transition": "meteor",
				"keyframes": [
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 42, 7, 1,
							0, 15, 15, 1,
							6, 35, 25, 1,
							-2, 4, 4, 1,
							5, 38, 7, 1
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 40, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 40, 7, 1
						]
					}
				]
			},
			{
				"name": "hit",
				"cancellable": "",
				"cancel": "fallen",
				"nofastfall": true,
				"techable": true,
				"nodi": true,
				"type": 4,
				"slid": "stunned",
				"handler": "stumble",
				"transition": "stumble",
				"keyframes": [
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 42, 7, 1,
							0, 15, 15, 1,
							6, 35, 25, 1,
							-2, 4, 4, 1,
							5, 38, 7, 1
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 40, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 40, 7, 1
						]
					}
				]
			},
			{
				"name": "stunned",
				"cancellable": "",
				"cancel": "fallen",
				"techable": true,
				"nofastfall": true,
				"type": 4,
				"handler": "stunned",
				"nodi": true,
				"transition": "stunned",
				"keyframes": [
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 42, 7, 1,
							0, 15, 15, 1,
							6, 35, 25, 1,
							-2, 4, 4, 1,
							5, 38, 7, 1
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 42, 7, 1,
							0, 15, 15, 1,
							6, 35, 25, 1,
							-2, 4, 4, 1,
							5, 38, 7, 1
						]
					}
				]
			},
			{
				"name": "meteor",
				"cancellable": "airupspecial.airjump0",
				"cancel": "fallen",
				"techable": true,
				"nofastfall": true,
				"type": 4,
				"handler": "meteor",
				"canceled": "meteor",
				"nodi": true,
				"transition": "meteor",
				"keyframes": [
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 42, 7, 1,
							0, 15, 15, 1,
							6, 35, 25, 1,
							-2, 4, 4, 1,
							5, 38, 7, 1
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 42, 7, 1,
							0, 15, 15, 1,
							6, 35, 25, 1,
							-2, 4, 4, 1,
							5, 38, 7, 1
						]
					}
				]
			},
			{
				"name": "stumble",
				"cancellable": "",
				"type": 4,
				"slid": "stunned",
				"nofastfall": true,
				"handler": "stumble",
				"transition": "stumble",
				"keyframes": [
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 42, 7, 1,
							0, 15, 15, 1,
							6, 35, 25, 1,
							-2, 4, 4, 1,
							5, 38, 7, 1
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 42, 7, 1,
							0, 15, 15, 1,
							6, 35, 25, 1,
							-2, 4, 4, 1,
							5, 38, 7, 1
						]
					}
				]
			},
			{
				"name": "tumble",
				"cancel": "fallen",
				"cancellable": "all",
				"noCancel": "airdodge.neutraldodge",
				"nofastfall": true,
				"transition": "tumble",
				"techable": true,
				"type": 4,
				"grabYOffset": -35,
				"grabXOffset": 10,
				"grabRadius": 41,
				"grabDirections": 4,
				"keyframes": [
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 42, 7, 1,
							0, 15, 15, 1,
							6, 35, 25, 1,
							-2, 4, 4, 1,
							5, 38, 7, 1
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 22, 7, 1,
							0, 15, 15, 1,
							6, 35, 25, 1,
							-2, 4, 4, 1,
							5, 18, 7, 1
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 42, 7, 1,
							0, 15, 15, 1,
							6, 35, 25, 1,
							-2, 4, 4, 1,
							5, 38, 7, 1
						]
					}
				]
			},
			{
				"name": "crouch",
				"cancellable": "all",
				"type": 0,
				"transition": "crouched",
				"keyframes": [
					{
						"duration": 3,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					},
					{
						"duration": 3,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 10, 7, 1,
							0, 12, 12, 1,
							2, 18, 18, 1,
							-2, 4, 4, 1,
							5, 10, 7, 1
						]
					}
				]
			},
			{
				"name": "platformdrop",
				"cancellable": "dsmash.dtilt.downspecial",
				"type": 4,
				"platformDroppable": true,
				"transition": "airborne-nofastfall",
				"buffer": "all",
				"speed": 0,
				"end": "platformdrop",
				"keyframes": [
					{
						"duration": 4,
						"interpolate": true,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 10, 7, 1,
							0, 15, 15, 1,
							2, 25, 25, 1,
							-2, 4, 4, 1,
							5, 10, 7, 1
						]
					},
					{
						"duration": 4,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 10, 7, 1,
							0, 15, 15, 1,
							2, 25, 25, 1,
							-2, 4, 4, 1,
							5, 10, 7, 1
						]
					}
				]
			},
			{
				"name": "slowdrop",
				"cancellable": "dsmash.dtilt.downspecial",
				"type": 4,
				"platformDroppable": true,
				"transition": "airborne-nofastfall",
				"buffer": "all",
				"speed": 0,
				"end": "platformdrop",
				"keyframes": [
					{
						"duration": 4,
						"interpolate": true,
						"hurtbubbles": [
							5, 4, 4, 5,
							10, 10, 7, 5,
							0, 15, 10, 5,
							2, 25, 20, 5,
							-2, 4, 4, 5,
							5, 10, 7, 5
						]
					},
					{
						"duration": 8,
						"hurtbubbles": [
							5, 4, 4, 5,
							10, 10, 7, 5,
							0, 15, 10, 5,
							2, 25, 20, 5,
							-2, 4, 4, 5,
							5, 10, 7, 5
						]
					},
					{
						"duration": 4,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 10, 7, 1,
							0, 15, 10, 1,
							2, 25, 20, 1,
							-2, 4, 4, 1,
							5, 10, 7, 1
						]
					},
					{
						"duration": 4,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 10, 7, 1,
							0, 15, 15, 1,
							2, 25, 25, 1,
							-2, 4, 4, 1,
							5, 10, 7, 1
						]
					}
				]
			},
			{
				"name": "crouched",
				"cancellable": "all",
				"type": 0,
				"transition": "crouched",
				"keyframes": [
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 10, 7, 1,
							0, 12, 12, 1,
							2, 18, 18, 1,
							-2, 4, 4, 1,
							5, 10, 7, 1
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 10, 7, 1,
							0, 12, 12, 1,
							6, 18, 18, 1,
							-2, 4, 4, 1,
							5, 10, 7, 1
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 10, 7, 1,
							0, 12, 12, 1,
							2, 18, 18, 1,
							-2, 4, 4, 1,
							5, 10, 7, 1
						]
					}
				]
			},
			{
				"name": "stand",
				"cancellable": "all",
				"type": 0,
				"keyframes": [
					{
						"duration": 3,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 10, 7, 1,
							0, 15, 15, 1,
							2, 25, 25, 1,
							-2, 4, 4, 1,
							5, 10, 7, 1
						]
					},
					{
						"duration": 3,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "trip",
				"cancellable": "",
				"type": 0,
				"start": "stop",
				"slideFriction": 0.95,
				"transition": "fallen",
				"keyframes": [
					{
						"duration": 30,
						"slide": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					},
					{
						"duration": 20,
						"hurtbubbles": [
							5, 4, 4, 1,
							30, 20, 7, 1,
							0, 15, 15, 1,
							6, 30, 25, 1,
							-2, 4, 4, 1,
							30, 20, 7, 1
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 7, 7, 1,
							0, 10, 10, 1,
							6, 15, 15, 1,
							-2, 4, 4, 1,
							5, 7, 7, 1
						]
					}
				]
			},
			{
				"name": "fallen",
				"cancellable": "getup, rollback, rollforth",
				"type": 4,
				"slid": "tumble",
				"ungrabbable": true,
				"transition": "fallen",
				"handler": "fallen",
				"keyframes": [
					{
						"interpolate": true,
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 7, 7, 1,
							0, 10, 10, 1,
							6, 15, 15, 1,
							-2, 4, 4, 1,
							5, 7, 7, 1
						]
					},
					{
						"duration": 30,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 7, 7, 1,
							0, 10, 10, 1,
							6, 15, 15, 1,
							-2, 4, 4, 1,
							5, 7, 7, 1
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 7, 7, 1,
							0, 10, 10, 1,
							6, 15, 15, 1,
							-2, 4, 4, 1,
							5, 7, 7, 1
						]
					}
				]
			},
			{
				"name": "getup",
				"cancellable": "",
				"ungrabbable": true,
				"type": 0,
				"keyframes": [
					{
						"duration": 12,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 7, 7, 1,
							0, 10, 10, 1,
							6, 15, 15, 1,
							-2, 4, 4, 1,
							5, 7, 7, 1
						]
					},
					{
						"duration": 6,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "getup0",
				"cancellable": "",
				"ungrabbable": true,
				"type": 1,
				"keyframes": [
					{
						"duration": 3,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 7, 7, 1,
							0, 10, 10, 1,
							6, 15, 15, 1,
							-2, 4, 4, 1,
							5, 7, 7, 1
						]
					},
					{
						"duration": 7,
						"hurtbubbles": [
							-5, 4, 4, 1,
							-10, 20, 7, 1,
							0, 10, 10, 1,
							-2, 15, 15, 1,
							2, 4, 4, 1,
							-5, 20, 7, 1
						]
					},
					{
						"duration": 7,
						"hurtbubbles": [
							-5, 4, 4, 1,
							-30, 20, 7, 1,
							0, 15, 12, 1,
							-2, 30, 20, 1,
							2, 4, 4, 1,
							0, 20, 7, 1
						],
						"audio": "shortwhiff",
						"hitbubbles": [
							1, -30, 20, 23, 0, hbColor, 7.5, 9, 9, 110, 110, 1, 1, 45, 0
						]
					},
					{
						"duration": 3,
						"hurtbubbles": [
							5, 4, 4, 1,
							30, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							0, 20, 7, 1
						],
						"audio": "shortwhiff",
						"hitbubbles": [
							1, 30, 20, 23, 0, hbColor, 7, 8, 8, 20, 20, 1, 1, 45, 0
						]
					},
					{
						"duration": 3,
						"hurtbubbles": [
							5, 4, 4, 1,
							30, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							0, 20, 7, 1
						]
					},
					{
						"duration": 3,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "tech",
				"cancellable": "",
				"type": 4,
				"start": "stop",
				"ungrabbable": true,
				"keyframes": [
					{
						"interpolate": true,
						"duration": 8,
						"hurtbubbles": [
							5, 4, 4, 5,
							10, 7, 7, 5,
							0, 15, 15, 5,
							2, 25, 25, 5,
							-2, 4, 4, 5,
							5, 7, 7, 5
						]
					},
					{
						"duration": 6,
						"hurtbubbles": [
							5, 4, 4, 5,
							10, 7, 7, 5,
							0, 15, 10, 5,
							2, 25, 15, 5,
							-2, 4, 4, 5,
							5, 7, 7, 5
						]
					},
					{
						"duration": 4,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "walltech",
				"cancellable": "",
				"gravity": 0,
				"type": 4,
				"ungrabbable": true,
				"keyframes": [
					{
						"interpolate": true,
						"duration": 8,
						"dx": 2,
						"hurtbubbles": [
							5, 4, 4, 5,
							10, 7, 7, 5,
							0, 15, 15, 5,
							2, 25, 25, 5,
							-2, 4, 4, 5,
							5, 7, 7, 5
						]
					},
					{
						"duration": 6,
						"hurtbubbles": [
							5, 4, 4, 5,
							10, 7, 7, 5,
							0, 15, 15, 5,
							2, 25, 25, 5,
							-2, 4, 4, 5,
							5, 7, 7, 5
						]
					},
					{
						"duration": 4,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "rooftech",
				"cancellable": "",
				"gravity": 0,
				"type": 4,
				"ungrabbable": true,
				"keyframes": [
					{
						"interpolate": true,
						"duration": 8,
						"dx": 2,
						"hurtbubbles": [
							5, 4, 4, 5,
							10, 7, 7, 5,
							0, 15, 15, 5,
							2, 25, 25, 5,
							-2, 4, 4, 5,
							5, 7, 7, 5
						]
					},
					{
						"duration": 6,
						"hurtbubbles": [
							5, 4, 4, 5,
							10, 7, 7, 5,
							0, 15, 15, 5,
							2, 25, 25, 5,
							-2, 4, 4, 5,
							5, 7, 7, 5
						]
					},
					{
						"duration": 4,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "techforward",
				"cancellable": "",
				"type": 4,
				"slide": 7,
				"friction": 0,
				"start": "stop",
				"end": "stop",
				"ungrabbable": true,
				"keyframes": [
					{
						"duration": 15,
						"hurtbubbles": [
							5, 4, 4, 5,
							5, 35, 7, 5,
							0, 15, 15, 5,
							2, 30, 25, 5,
							-2, 4, 4, 5,
							0, 30, 7, 5
						]
					},
					{
						"duration": 5,
						"hurtbubbles": [
							5, 4, 4, 1,
							5, 35, 7, 1,
							0, 15, 10, 1,
							2, 30, 15, 1,
							-2, 4, 4, 1,
							0, 30, 7, 1
						]
					},
					{
						"duration": 1,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 10, 1,
							2, 30, 15, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "techbackward",
				"cancellable": "",
				"type": 4,
				"slide": -7,
				"friction": 0,
				"start": "stop",
				"end": "stop",
				"ungrabbable": true,
				"keyframes": [
					{
						"duration": 6,
						"hurtbubbles": [
							5, 4, 4, 5,
							5, 35, 7, 5,
							0, 15, 15, 5,
							2, 30, 25, 5,
							-2, 4, 4, 5,
							0, 30, 7, 5
						]
					},
					{
						"duration": 15,
						"hurtbubbles": [
							5, 4, 4, 5,
							5, 35, 7, 5,
							0, 15, 10, 5,
							2, 30, 15, 5,
							-2, 4, 4, 5,
							0, 30, 7, 5
						]
					},
					{
						"duration": 5,
						"hurtbubbles": [
							5, 4, 4, 1,
							5, 35, 7, 1,
							0, 15, 10, 1,
							2, 30, 15, 1,
							-2, 4, 4, 1,
							0, 30, 7, 1
						]
					},
					{
						"duration": 1,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "airborne",
				"cancellable": "all",
				"cancel": "airborne-cancel",
				"type": 0,
				"platformDroppable": true,
				"grabYOffset": -35,
				"grabXOffset": 10,
				"grabRadius": 41,
				"grabDirections": 4,
				"keyframes": [
					{
						"duration": 10,
						"hurtbubbles": [
							5, -4, 4, 1,
							10, 20, 7, 1, 
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, -4, 4, 1,
							5, 20, 7, 1
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, -4, 4, 1,
							10, 22, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, -4, 4, 1,
							5, 15, 7, 1
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, -4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, -4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "airborne-slid",
				"cancellable": "all",
				"cancel": "airborne-cancel",
				"type": 0,
				"platformDroppable": true,
				"keyframes": [
					{
						"duration": 15,
						"hurtbubbles": [
							5, -4, 4, 1,
							10, 20, 7, 1, 
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, -4, 4, 1,
							5, 20, 7, 1
						]
					},
					{
						"duration": 15,
						"hurtbubbles": [
							5, -4, 4, 1,
							10, 22, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, -4, 4, 1,
							5, 15, 7, 1
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, -4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, -4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "airborne-nofastfall",
				"cancellable": "all",
				"cancel": "airborne-cancel",
				"noFastfall": true,
				"transition": "airborne-nofastfall",
				"type": 0,
				"platformDroppable": true,
				"keyframes": [
					{
						"duration": 10,
						"hurtbubbles": [
							5, -4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, -4, 4, 1,
							5, 20, 7, 1
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, -4, 4, 1,
							10, 22, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, -4, 4, 1,
							5, 15, 7, 1
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, -4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, -4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "helpless",
				"cancellable": "",
				"transition": "helpless",
				"helpless": true,
				"type": 4,
				"platformDroppable": true,
				"grabYOffset": -20,
				"grabXOffset": 20,
				"grabRadius": 41,
				"grabDirections": 4,
				"keyframes": [
					{
						"duration": 20,
						"hurtbubbles": [
							5, -4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, -4, 4, 1,
							5, 20, 7, 1
						]
					},
					{
						"duration": 20,
						"hurtbubbles": [
							5, 34, 4, 1,
							10, 10, 7, 1,
							0, 15, 15, 1,
							2, 20, 25, 1,
							-2, 34, 4, 1,
							5, 10, 7, 1
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, -4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, -4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "airdodgefall",
				"cancellable": "",
				"transition": "helpless",
				"helpless": true,
				"type": 4,
				"platformDroppable": false,
				"keyframes": [
					{
						"duration": 10,
						"interpolate": true,
						"hurtbubbles": [
							5, 34, 4, 1,
							10, 10, 7, 1,
							0, 15, 15, 1,
							2, 20, 25, 1,
							-2, 34, 4, 1,
							5, 10, 7, 1
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, 34, 4, 1,
							10, 10, 7, 1,
							0, 15, 15, 1,
							2, 20, 25, 1,
							-2, 34, 4, 1,
							5, 10, 7, 1
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, -4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, -4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "ledgegrab",
				"cancellable": "",
				"transition": "ledgehang",
				"type": 4,
				"xOffset": -10,
				"yOffset": 60,
				"refresh": true,
				"pause": 8,
				"ungrabbable": true,
				"start": "ledgegrab",
				"handler": "ledgehang",
				"interrupted": "ledgehit",
				"keyframes": [
					{
						"duration": 10,
						"hurtbubbles": [
							-5, -54, 4, 1,
							0, -30, 7, 1,
							-10, -35, 15, 1,
							-8, -20, 25, 1,
							-12, -54, 4, 1,
							-5, -30, 7, 1
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							-5, -54, 4, 1,
							0, -20, 7, 1,
							-10, -35, 15, 1,
							-8, -20, 25, 1,
							-12, -54, 4, 1,
							-5, -20, 7, 1
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							-5, -54, 4, 1,
							0, -7, 7, 1,
							-10, -35, 15, 1,
							-8, -20, 25, 1,
							-12, -54, 4, 1,
							-5, -7, 7, 1
						]
					}
				]
			},
			{
				"name": "ledgedrop",
				"cancellable": "all",
				"transition": "airborne",
				"type": 4,
				"keyframes": [
					{
						"duration": 10,
						"hurtbubbles": [
							5, -4, 4, 1,
							10, 20, 7, 1, 
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, -4, 4, 1,
							5, 20, 7, 1
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, -4, 4, 1,
							10, 22, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, -4, 4, 1,
							5, 15, 7, 1
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, -4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, -4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "ledgegrabzair",
				"cancellable": "",
				"transition": "ledgehang",
				"pause": 8,
				"type": 4,
				"xOffset": -10,
				"yOffset": 80,
				"refresh": true,
				"ledgestall": true,
				"start": "ledgegrab",
				"handler": "ledgehang",
				"interrupted": "ledgehit",
				"keyframes": [
					{
						"duration": 10,
						"hurtbubbles": [
							-5, -54, 4, 1,
							0, -30, 7, 1,
							-10, -35, 15, 1,
							-8, -20, 25, 1,
							-12, -54, 4, 1,
							-5, -30, 7, 1
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							-5, -54, 4, 1,
							0, -20, 7, 1,
							-10, -35, 15, 1,
							-8, -20, 25, 1,
							-12, -54, 4, 1,
							-5, -20, 7, 1
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							-5, -54, 4, 1,
							0, -7, 7, 1,
							-10, -35, 15, 1,
							-8, -20, 25, 1,
							-12, -54, 4, 1,
							-5, -7, 7, 1
						]
					}
				]
			},
			{
				"name": "ledgehang",
				"cancellable": "",
				"transition": "ledgehang",
				"type": 4,
				"xOffset": -10,
				"yOffset": 60,
				"handler": "ledgehang",
				"ungrabbable": true,
				"interrupted": "ledgehit",
				"keyframes": [
					{
						"duration": 20,
						"hurtbubbles": [
							-5, -54, 4, 1,
							0, -7, 7, 1,
							-10, -35, 15, 1,
							-8, -20, 25, 1,
							-12, -54, 4, 1,
							-5, -7, 7, 1
						]
					},
					{
						"duration": 20,
						"hurtbubbles": [
							-5, -54, 4, 1,
							0, -7, 7, 1,
							-10, -35, 15, 1,
							-8, -20, 25, 1,
							-12, -54, 4, 1,
							-5, -7, 7, 1
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							-5, -54, 4, 1,
							0, -7, 7, 1,
							-10, -35, 15, 1,
							-8, -20, 25, 1,
							-12, -54, 4, 1,
							-5, -7, 7, 1
						]
					}
				]
			},
			{
				"name": "ledgeattack0",
				"cancellable": "",
				"transition": "idle",
				"type": 4,
				"xOffset": -10,
				"yOffset": 80,
				"keyframes": [
					{
						"duration": 6,
						"hurtbubbles": [
							-5, -54, 4, 5,
							0, -7, 7, 5,
							-10, -35, 15, 5,
							-8, -20, 25, 5,
							-12, -54, 4, 5,
							-5, -7, 7, 5
						]
					},
					{
						"duration": 8,
						"hurtbubbles": [
							-5, 4, 4, 5,
							0, 20, 7, 5,
							-10, 15, 15, 5,
							-8, 30, 25, 5,
							-12, 4, 4, 5,
							-5, 20, 7, 5
						]
					},
					{
						"duration": 4,
						"dx": 4,
						"hurtbubbles": [
							5, 4, 4, 5,
							10, 20, 7, 5,
							0, 15, 15, 5,
							2, 30, 25, 5,
							-2, 4, 4, 5,
							5, 20, 7, 5
						]
					},
					{
						"duration": 5,
						"hurtbubbles": [
							5, 4, 4, 1,
							30, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							0, 20, 7, 1
						],
						"audio": "shortwhiff",
						"hitbubbles": [
							1, 30, 20, 23, 0, hbColor, 6, 8, 8, 70, 70, 1, 1, 45, 0
						]
					},
					{
						"duration": 3,
						"hurtbubbles": [
							5, 4, 4, 1,
							30, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							0, 20, 7, 1
						]
					},
					{
						"duration": 3,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "ledgestand",
				"cancellable": "",
				"transition": "idle",
				"type": 4,
				"xOffset": -10,
				"yOffset": 80,
				"keyframes": [
					{
						"duration": 10,
						"hurtbubbles": [
							-5, -54, 4, 5,
							0, -7, 7, 5,
							-10, -35, 15, 5,
							-8, -20, 25, 5,
							-12, -54, 4, 5,
							-5, -7, 7, 5
						]
					},
					{
						"duration": 5,
						"hurtbubbles": [
							-5, 4, 4, 5,
							0, 20, 7, 5,
							-10, 15, 15, 5,
							-8, 30, 25, 5,
							-12, 4, 4, 5,
							-5, 20, 7, 5
						]
					},
					{
						"duration": 5,
						"dx": 2,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "ledgeroll",
				"cancellable": "",
				"transition": "idle",
				"type": 4,
				"xOffset": -10,
				"yOffset": 80,
				"keyframes": [
					{
						"duration": 5,
						"hurtbubbles": [
							-5, -54, 4, 1,
							0, -7, 7, 1,
							-10, -35, 15, 1,
							-8, -20, 25, 1,
							-12, -54, 4, 1,
							-5, -7, 7, 1
						]
					},
					{
						"duration": 5,
						"hurtbubbles": [
							-5, 4, 4, 5,
							0, 20, 7, 5,
							-10, 15, 15, 5,
							-8, 30, 25, 5,
							-12, 4, 4, 5,
							-5, 20, 7, 5
						]
					},
					{
						"duration": 5,
						"hurtbubbles": [
							5, 4, 4, 5,
							10, 20, 7, 5,
							0, 15, 15, 5,
							2, 30, 25, 5,
							-2, 4, 4, 5,
							5, 20, 7, 5
						]
					},
					{
						"duration": 30,
						"speed": 5,
						"hurtbubbles": [
							5, 4, 4, 5,
							10, 20, 7, 5,
							0, 15, 15, 5,
							2, 30, 25, 5,
							-2, 4, 4, 5,
							5, 20, 7, 5
						]
					},
					{
						"duration": 10,
						"speed": 25,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "ledgehop",
				"cancellable": "",
				"type": 0,
				"cancel": "continue",
				"slid": "continue",
				"friction": 1,
				"keyframes": [
					{
						"duration": 3,
						"dx": 1,
						"cancellable": "",
						"hurtbubbles": [
							-5, -54, 4, 5,
							0, -7, 7, 5,
							-10, -35, 15, 5,
							-8, -20, 25, 5,
							-12, -54, 4, 5,
							-5, -7, 7, 5
						]
					},
					{
						"duration": 5,
						"cancellable": "all",
						"airborne": true,
						"speed": 14,
						"dx": 5,
						"jumpSpeed": 10,
						"hurtbubbles": [
							5, 4, 4, 5,
							10, 20, 7, 5,
							0, 15, 15, 5,
							2, 30, 25, 5,
							-2, 4, 4, 5,
							5, 20, 7, 5
						]
					},
					{
						"duration": 10,
						"cancellable": "all",
						"hurtbubbles": [
							5, -8, 4, 1,
							10, 45, 7, 1,
							0, 15, 15, 1,
							2, 35, 25, 1,
							-2, -8, 4, 1,
							5, 15, 7, 1
						]
					},
					{
						"duration": 10,
						"cancellable": "all",
						"hurtbubbles": [
							5, -4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, -4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "airborne-cancel",
				"cancellable": "all",
				"noCancel": "platformdrop",
				"type": 0,
				"keyframes": [
					{
						"interpolate": true,
						"duration": 4,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 10, 7, 1,
							0, 15, 15, 1,
							2, 25, 25, 1,
							-2, 4, 4, 1,
							5, 10, 7, 1
						]
					},
					{
						"duration": 4,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 10, 7, 1,
							0, 15, 15, 1,
							2, 25, 25, 1,
							-2, 4, 4, 1,
							5, 10, 7, 1
						]
					},
					{
						"duration": 4,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "walk",
				"cancellable": "all",
				"unbufferable": true,
				"type": 0,
				"speed": 2,
				"keyframes": [
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 18, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							8, 4, 4, 1,
							10, 22, 7, 1,
							0, 15, 15, 1,
							2, 35, 25, 1,
							4, 4, 4, 1,
							5, 15, 7, 1
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "stride",
				"cancellable": "all",
				"unbufferable": true,
				"type": 0,
				"speed": 6,
				"keyframes": [
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					},
					{
						"duration": 5,
						"hurtbubbles": [
							8, 4, 4, 1,
							10, 15, 7, 1,
							0, 15, 15, 1,
							2, 35, 25, 1,
							4, 4, 4, 1,
							5, 15, 7, 1
						]
					},
					{
						"duration": 5,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "dash",
				"cancellable": "dash.grab.dashattack.sidespecial.groundspecial.downspecial.upspecial.pivot.skid.run.usmash.jump.hop.jab.ftilt.dsmash.crouch.shieldup.trip",
				"type": 4,
				"speed": 11,
				"unbufferable": true,
				"noCancel": "platformdrop",
				"transition": "run",
				"handler": "dash",
				"slid": "dashslid",
				"redirect": {
					"jab": "dashattack",
					"ftilt": "dashattack",
					"dtilt": "dashattack",
					"dsmash": "dashattack",
					"grab": "dashgrab"
				},
				"keyframes": [
					{
						"duration": 5,
						"cancellable": "fsmash",
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					},
					{
						"duration": 5,
						"hurtbubbles": [
							16, 4, 4, 1,
							10, 15, 7, 1,
							0, 15, 15, 1,
							2, 35, 25, 1,
							12, 4, 4, 1,
							5, 15, 7, 1
						]
					},
					{
						"duration": 5,
						"hurtbubbles": [
							2, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-5, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "pivot",
				"cancellable": "all",
				"noCancel": "pivot.dash",
				"unbufferable": true,
				"type": 4,
				"end": "stop",
				"slid": "dashslid",
				"redirect": {
					"dash": 0,
					"grab": "pivotgrab"
				},
				"transition": "dash",
				"keyframes": [
					{
						"duration": 2,
						"hurtbubbles": [
							-5, 4, 4, 1,
							-10, 20, 7, 1,
							0, 15, 15, 1,
							-2, 30, 25, 1,
							2, 4, 4, 1,
							-5, 20, 7, 1
						]
					},
					{
						"duration": 5,
						"hurtbubbles": [
							2, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-5, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "dashslid",
				"cancellable": "all",
				"type": 4,
				"keyframes": [
					{
						"interpolate": true,
						"duration": 6,
						"hurtbubbles": [
							2, -4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-5, -4, 4, 1,
							5, 20, 7, 1
						]
					},
					{
						"duration": 16,
						"hurtbubbles": [
							2, -4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-5, -4, 4, 1,
							5, 20, 7, 1
						]
					},
					{
						"duration": 8,
						"hurtbubbles": [
							2, -4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-5, -4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "run",
				"cancellable": "dtaunt.staunt.utaunt.dash.run.grab.usmash.sidespecial.groundspecial.downspecial.upspecial.dsmash.skid.turnaround.jump.hop.jab.ftilt.crouch.shieldup.trip",
				"unbufferable": true,
				"type": 4,
				"speed": 11,
				"transition": "run",
				"redirect": {
					"jab": "dashattack",
					"ftilt": "dashattack",
					"dsmash": "dashattack",
					"grab": "dashgrab"
				},
				"keyframes": [
					{
						"duration": 3,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					},
					{
						"duration": 3,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					},
					{
						"duration": 3,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "skid",
				"cancellable": "dsmash.usmash.grab.sidespecial.groundspecial.downspecial.upspecial.skid.turnaround.jump.hop.jab.ftilt.crouch.shieldup",
				"type": 4,
				"redirect": {
					"jab": "dashattack",
					"ftilt": "dashattack",
					"dsmash": "dashattack",
					"grab": "dashgrab"
				},
				"end": "stop",
				"keyframes": [
					{
						"duration": 15,
						"hurtbubbles": [
							8, 4, 4, 1,
							10, 15, 7, 1,
							0, 15, 15, 1,
							2, 35, 25, 1,
							4, 4, 4, 1,
							5, 15, 7, 1
						]
					},
					{
						"duration": 5,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "turnaround",
				"cancellable": "dsmash.usmash.grab.sidespecial.groundspecial.downspecial.upspecial.skid.turnaround.jump.hop.jab.ftilt.crouch.shieldup",
				"type": 4,
				"friction": 0.95,
				"slid": "dashslid",
				"transition": "run",
				"redirect": {
					"jab": "dashattack",
					"ftilt": "dashattack",
					"dsmash": "dashattack",
					"grab": "pivotgrab"
				},
				"keyframes": [
					{
						"duration": 15,
						"hurtbubbles": [
							-5, 4, 4, 1,
							-10, 20, 7, 1,
							0, 15, 15, 1,
							-2, 30, 25, 1,
							2, 4, 4, 1,
							-5, 20, 7, 1
						]
					},
					{
						"duration": 15,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "jump",
				"cancellable": "all",
				"type": 0,
				"keyframes": [
					{
						"duration": 10,
						"hurtbubbles": [
							5, -8, 4, 1,
							10, 45, 7, 1,
							0, 15, 15, 1,
							2, 35, 25, 1,
							-2, -8, 4, 1,
							5, 15, 7, 1
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, -4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, -4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "airjump0",
				"cancellable": "all",
				"noFastfall": true,
				"type": 0,
				"fallFriction": 1,
				"keyframes": [
					{
						"duration": 1,
						"hurtbubbles": [
							5, -8, 4, 1,
							10, 45, 7, 1,
							0, 15, 15, 1,
							2, 35, 25, 1,
							-2, -8, 4, 1,
							5, 15, 7, 1
						]
					},
					{
						"upward": 11,
						"di": 6,
						"airjump": true,
						"duration": 10,
						"hurtbubbles": [
							5, -4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, -4, 4, 1,
							5, 20, 7, 1
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, -4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, -4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "hop",
				"cancellable": "airdodge",
				"handler": "hop",
				"type": 0,
				"friction": 1,
				"keyframes": [
					{
						"duration": 4,
						"cancellable": "grab.usmash.upspecial",
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					},
					{
						"duration": 5,
						"cancellable": "all",
						"airborne": true,
						"speed": 7,
						"jump": 5,
						"jumpSpeed": 13,
						"effect": "hop",
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					},
					{
						"duration": 10,
						"cancellable": "all",
						"hurtbubbles": [
							5, -8, 4, 1,
							10, 45, 7, 1,
							0, 15, 15, 1,
							2, 35, 25, 1,
							-2, -8, 4, 1,
							5, 15, 7, 1
						]
					},
					{
						"duration": 10,
						"cancellable": "all",
						"hurtbubbles": [
							5, -4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, -4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "shieldup",
				"cancellable": "grab.hop.jump.jab.ftilt",
				"type": 5,
				"transition": "shield",
				"slid": "stop",
				"platformDroppable": true,
				"redirect": {
					"jab": "grab",
					"ftilt": "grab"
				},
				"handler": "powershield",
				"shielded": "powershield",
				"start": "powershield",
				"keyframes": [
					{
						"duration": 3,
						"audio": "shieldup",
						"hurtbubbles": [
							5, 4, 4, 6,
							7, 20, 7, 6,
							0, 15, 15, 6,
							2, 30, 25, 6,
							-2, 4, 4, 6,
							4, 20, 7, 6
						]
					},
					{
						"duration": 3,
						"hurtbubbles": [
							5, 4, 4, 1,
							16, 35, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							12, 30, 7, 1
						]
					}
				]
			},
			{
				"name": "shield",
				"cancellable": "dodgeback.spotdodge.dodgeforth.grab.shielddrop",
				"type": 5,
				"slid": "stop",
				"freshStart": "shield",
				"transition": "shield",
				"handler": "shield",
				"platformDroppable": true,
				"shieldbrake": 0.1,
				"shielded": "shield",
				"keyframes": [
					{
						"duration": 40,
						"hurtbubbles": [
							5, 4, 4, 6,
							16, 35, 7, 6,
							0, 15, 15, 6,
							2, 30, 25, 6,
							-2, 4, 4, 6,
							12, 30, 7, 6
						]
					},
					{
						"duration": 40,
						"hurtbubbles": [
							5, 4, 4, 6,
							16, 35, 7, 6,
							0, 15, 15, 6,
							2, 30, 25, 6,
							-2, 4, 4, 6,
							12, 30, 7, 6
						]
					}
				]
			},
			{
				"name": "sleepyshield",
				"cancellable": "",
				"type": 5,
				"handler": "sleepyshield",
				"start": "shield",
				"shieldbrake": 0.1,
				"shielded": "shield",
				"keyframes": [
					{
						"duration": 40,
						"interpolate": true,
						"hurtbubbles": [
							5, 4, 4, 6,
							16, 35, 7, 6,
							0, 15, 10, 6,
							2, 30, 20, 6,
							-2, 4, 4, 6,
							12, 30, 7, 6
						]
					},
					{
						"duration": 50,
						"hurtbubbles": [
							5, 4, 4, 6,
							16, 35, 7, 6,
							0, 15, 10, 6,
							2, 30, 20, 6,
							-2, 4, 4, 6,
							12, 30, 7, 6
						]
					},
					{
						"duration": 0,
						"hurtbubbles": [
							5, 4, 4, 1,
							16, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							12, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "shieldstun",
				"cancellable": "",
				"type": 5,
				"transition": "shieldstun",
				"buffer": ["grab", "attack", "ftilt", "hop"],
				"handler": "shieldstun",
				"shielded": "shield",
				"shieldbrake": 0.1,
				"keyframes": [
					{
						"duration": 40,
						"hurtbubbles": [
							5, 4, 4, 6,
							16, 35, 7, 6,
							0, 15, 15, 6,
							2, 30, 25, 6,
							-2, 4, 4, 6,
							12, 30, 7, 6
						]
					},
					{
						"duration": 0,
						"hurtbubbles": [
							5, 4, 4, 6,
							16, 35, 7, 6,
							0, 15, 15, 6,
							2, 30, 25, 6,
							-2, 4, 4, 6,
							12, 30, 7, 6
						]
					}
				]
			},
			{
				"name": "shielddrop",
				"cancellable": "hop.jump.grab",
				"type": 5,
				"buffer": "all",
				"keyframes": [
					{
						"duration": 6,
						"hurtbubbles": [
							5, 4, 4, 1,
							16, 35, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							12, 30, 7, 1
						]
					},
					{
						"duration": 3,
						"hurtbubbles": [
							5, 4, 4, 1,
							7, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							4, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "dodgeback",
				"cancellable": "",
				"type": 4,
				"friction": 0,
				"slideFriction": 0.96,
				"end": "stop",
				"keyframes": [
					{
						"duration": 6,
						"slide": -9,
						"hurtbubbles": [
							5, 4, 4, 5,
							16, 35, 7, 5,
							0, 15, 15, 5,
							2, 30, 25, 5,
							-2, 4, 4, 5,
							12, 30, 7, 5
						]
					},
					{
						"duration": 15,
						"hurtbubbles": [
							5, 4, 4, 5,
							16, 35, 7, 5,
							0, 15, 15, 5,
							2, 30, 25, 5,
							-2, 4, 4, 5,
							12, 30, 7, 5
						]
					},
					{
						"duration": 5,
						"hurtbubbles": [
							5, 4, 4, 1,
							16, 35, 7, 1,
							0, 15, 10, 1,
							2, 30, 20, 1,
							-2, 4, 4, 1,
							12, 30, 7, 1
						]
					},
					{
						"duration": 1,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "spotdodge",
				"cancellable": "",
				"type": 4,
				"keyframes": [
					{
						"duration": 3,
						"hurtbubbles": [
							5, 4, 4, 5,
							16, 35, 7, 5,
							0, 15, 15, 5,
							2, 30, 25, 5,
							-2, 4, 4, 5,
							12, 30, 7, 5
						]
					},
					{
						"duration": 15,
						"hurtbubbles": [
							5, 4, 4, 5,
							16, 35, 7, 5,
							0, 15, 15, 5,
							2, 30, 25, 5,
							-2, 4, 4, 5,
							12, 30, 7, 5
						]
					},
					{
						"duration": 5,
						"hurtbubbles": [
							5, 4, 4, 1,
							16, 35, 7, 1,
							0, 15, 10, 1,
							2, 30, 20, 1,
							-2, 4, 4, 1,
							12, 30, 7, 1
						]
					},
					{
						"duration": 1,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "dodgeforth",
				"cancellable": "",
				"type": 4,
				"friction": 0,
				"slideFriction": 0.96,
				"end": "stop",
				"keyframes": [
					{
						"duration": 6,
						"slide": -9,
						"hurtbubbles": [
							-5, 4, 4, 5,
							-16, 35, 7, 5,
							0, 15, 15, 5,
							-2, 30, 25, 5,
							2, 4, 4, 5,
							-12, 30, 7, 5
						]
					},
					{
						"duration": 15,
						"hurtbubbles": [
							-5, 4, 4, 5,
							-16, 35, 7, 5,
							0, 15, 15, 5,
							-2, 30, 25, 5,
							2, 4, 4, 5,
							-12, 30, 7, 5
						]
					},
					{
						"duration": 5,
						"hurtbubbles": [
							5, 4, 4, 1,
							16, 35, 7, 1,
							0, 15, 10, 1,
							2, 30, 20, 1,
							-2, 4, 4, 1,
							12, 30, 7, 1
						]
					},
					{
						"duration": 1,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "rollforth",
				"cancellable": "platformdrop",
				"redirect": {
					"platformdrop": "slowdrop"
				},
				"type": 4,
				"friction": 0,
				"end": "stop",
				"slideFriction": 0.96,
				"keyframes": [
					{
						"duration": 3,
						"slide": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 7, 7, 1,
							0, 10, 10, 1,
							6, 15, 15, 1,
							-2, 4, 4, 1,
							5, 7, 7, 1
						]
					},
					{
						"duration": 15,
						"hurtbubbles": [
							5, 4, 4, 5,
							5, 35, 7, 5,
							0, 15, 12, 5,
							2, 30, 20, 5,
							-2, 4, 4, 5,
							0, 30, 7, 5
						]
					},
					{
						"duration": 8,
						"hurtbubbles": [
							5, 4, 4, 1,
							5, 35, 7, 1,
							0, 15, 10, 1,
							2, 30, 20, 1,
							-2, 4, 4, 1,
							0, 30, 7, 1
						]
					},
					{
						"duration": 1,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "rollback",
				"cancellable": "platformdrop",
				"redirect": {
					"platformdrop": "slowdrop"
				},
				"type": 4,
				"friction": 0,
				"slideFriction": 0.96,
				"end": "stop",
				"keyframes": [
					{
						"duration": 3,
						"slide": -10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 7, 7, 1,
							0, 10, 10, 1,
							6, 15, 15, 1,
							-2, 4, 4, 1,
							5, 7, 7, 1
						]
					},
					{
						"duration": 15,
						"hurtbubbles": [
							5, 4, 4, 5,
							5, 35, 7, 5,
							0, 15, 12, 5,
							2, 30, 20, 5,
							-2, 4, 4, 5,
							0, 30, 7, 5
						]
					},
					{
						"duration": 8,
						"hurtbubbles": [
							5, 4, 4, 1,
							5, 35, 7, 1,
							0, 15, 12, 1,
							2, 30, 20, 1,
							-2, 4, 4, 1,
							0, 30, 7, 1
						]
					},
					{
						"duration": 1,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "airdodge",
				"cancellable": "zair",
				"redirect": {
					"zair": "zair-dodge"
				},
				"cancel": "airdodge-cancel",
				"noFastfall": true,
				"nodi": true,
				"type": 0,
				"aerodynamics": 0.9,
				"gravity": 0,
				"airdodgeSpeed": 20,
				"brake": 0.8,
				"transition": "airdodgefall",
				"start": "airdodge",
				"keyframes": [
					{
						"duration": 6,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					},
					{
						"duration": 15,
						"hurtbubbles": [
							5, 4, 4, 5,
							5, 35, 7, 5,
							0, 15, 12, 5,
							2, 30, 20, 5,
							-2, 4, 4, 5,
							0, 30, 7, 5
						],
						"end": "brake"
					},
					{
						"duration": 5,
						"hurtbubbles": [
							5, 4, 4, 1,
							5, 35, 7, 1,
							0, 15, 12, 1,
							2, 30, 20, 1,
							-2, 4, 4, 1,
							0, 30, 7, 1
						]
					},
					{
						"duration": 1,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "airdodge-cancel",
				"cancellable": "all",
				"noCancel": "walk.shieldup.dash.stride.platformdrop.crouch",
				"type": 0,
				"keyframes": [
					{
						"duration": 4,
						"hurtbubbles": [
							5, -4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, -4, 4, 1,
							5, 20, 7, 1
						]
					},
					{
						"duration": 4,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 10, 7, 1,
							0, 15, 15, 1,
							2, 25, 25, 1,
							-2, 4, 4, 1,
							5, 10, 7, 1
						]
					},
					{
						"duration": 4,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "neutraldodge",
				"cancellable": "zair",
				"type": 0,
				"transition": "airdodgefall",
				"keyframes": [
					{
						"duration": 6,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					},
					{
						"duration": 20,
						"hurtbubbles": [
							5, 4, 4, 5,
							5, 35, 7, 5,
							0, 15, 12, 5,
							2, 30, 20, 5,
							-2, 4, 4, 5,
							0, 30, 7, 5
						]
					},
					{
						"duration": 5,
						"hurtbubbles": [
							5, 4, 4, 1,
							5, 35, 7, 1,
							0, 15, 12, 1,
							2, 30, 20, 1,
							-2, 4, 4, 1,
							0, 30, 7, 1
						]
					},
					{
						"duration": 1,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "grab",
				"cancellable": "",
				"holdingAnimation": "holding",
				"collided": "grab",
				"type": 1,
				"keyframes": [
					{
						"duration": 6,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					},
					{
						"duration": 5,
						"hurtbubbles": [
							5, 4, 4, 1,
							30, 30, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							0, 20, 7, 1
						],
						"hitbubbles": [
							6, 30, 30, 25, 0, grabColor, 0, 0, 0, 0, 0, 0, 0, 0, 0
						]
					},
					{
						"duration": 5,
						"hurtbubbles": [
							5, 4, 4, 1,
							20, 10, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							0, 20, 7, 1
						],
						"hitbubbles": [
							6, 30, 30, 25, 0, grabColor, 0, 0, 0, 0, 0, 0, 0, 0, 0
						]
					},
					{
						"duration": 8,
						"hurtbubbles": [
							5, 4, 4, 1,
							30, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							0, 20, 7, 1
						]
					},
					{
						"duration": 3,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "holding",
				"cancellable": "fthrow.bthrow.uthrow.pummel.dthrow",
				"transition": "holding",
				"type": 6,
				"grabForce": 10,
				"start": "grab",
				"interrupted": "release",
				"handler": "holding",
				"friction": 0.7,
				"strength": 30,
				"cancel": "holding",
				"heldAnimation": "held",
				"keyframes": [
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							20, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1,
							20, 20, 0, 0
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							20, 22, 7, 1,
							0, 15, 15, 1,
							6, 35, 25, 1,
							-2, 4, 4, 1,
							5, 18, 7, 1,
							20, 20, 0, 0
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							20, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1,
							20, 20, 0, 0
						]
					}
				]
			},
			{
				"name": "release",
				"cancellable": "",
				"type": 4,
				"keyframes": [
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							20, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							20, 22, 7, 1,
							0, 15, 15, 1,
							6, 35, 25, 1,
							-2, 4, 4, 1,
							5, 18, 7, 1
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "airrelease",
				"cancellable": "",
				"type": 4,
				"keyframes": [
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							20, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							20, 22, 7, 1,
							0, 15, 15, 1,
							6, 35, 25, 1,
							-2, 4, 4, 1,
							5, 18, 7, 1
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "pummel",
				"cancellable": "",
				"transition": "holding",
				"type": 6,
				"grabForce": 10,
				"interrupted": "release",
				"handler": "holding",
				"strength": -1,
				"buffer": "pummel",
				"cancel": "holding",
				"heldAnimation": "held",
				"keyframes": [
					{
						"duration": 5,
						"hurtbubbles": [
							5, 4, 4, 1,
							20, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1,
							20, 20, 0, 0
						]
					},
					{
						"duration": 5,
						"hurtbubbles": [
							5, 4, 4, 1,
							-2, 22, 7, 1,
							0, 15, 15, 1,
							6, 35, 25, 1,
							-2, 4, 4, 1,
							5, 18, 7, 1,
							20, 20, 0, 0
						]
					},
					{
						"duration": 5,
						"hurtbubbles": [
							5, 4, 4, 1,
							16, 22, 7, 1,
							0, 15, 15, 1,
							6, 35, 25, 1,
							-2, 4, 4, 1,
							5, 18, 7, 1,
							20, 20, 0, 0
						],
						"hitbubbles": [
							1, 30, 20, 13, 0, hbColor, 2, 4, 4, 70, 70, 3, 3, 45, 0
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							20, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1,
							20, 20, 0, 0
						]
					}
				]
			},
			{
				"name": "dthrow",
				"cancellable": "",
				"cancel": "continue",
				"transition": "dthrowhit",
				"type": 6,
				"grabForce": 10,
				"start": "grab",
				"interrupted": "release",
				"handler": "holding",
				"strength": 100,
				"heldAnimation": "held",
				"keyframes": [
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							20, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1,
							20, 20, 0, 0
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							30, 90, 7, 1,
							0, 15, 15, 1,
							6, 35, 25, 1,
							-2, 4, 4, 1,
							5, 18, 7, 1,
							30, 90, 0, 0
						]
					},
					{
						"duration": 1,
						"hitbubbles": [
							6, 30, 20, 13, 0, hbColor, 3, 15, 15, 70, 70, 4, 4, 0, 0
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							40, 10, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1,
							40, 0, 0, 0
						]
					}
				]
			},
			{
				"name": "dthrowhit",
				"cancellable": "",
				"cancel": "continue",
				"start": "release",
				"type": 1,
				"keyframes": [
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							40, 10, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						],
						"hitbubbles": [
							1, 30, 20, 13, 0, hbColor, 6, 4, 6, 90, 90, 4, 4, 45, 0
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "uthrow",
				"cancellable": "",
				"cancel": "continue",
				"transition": "uthrowhit",
				"type": 6,
				"grabForce": 10,
				"start": "grab",
				"interrupted": "release",
				"handler": "holding",
				"strength": -1,
				"heldAnimation": "held",
				"keyframes": [
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							20, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1,
							20, 20, 0, 0
						]
					},
					{
						"duration": 5,
						"hurtbubbles": [
							5, 4, 4, 1,
							40, 20, 7, 1,
							0, 15, 15, 1,
							6, 35, 25, 1,
							-2, 4, 4, 1,
							-30, 20, 7, 1,
							40, 20, 0, 0
						]
					},
					{
						"duration": 5,
						"hurtbubbles": [
							5, 4, 4, 1,
							40, 23, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							-40, 25, 7, 1,
							-40, 25, 0, 0
						]
					},
					{
						"duration": 5,
						"hurtbubbles": [
							5, 4, 4, 1,
							40, 30, 7, 1,
							0, 15, 15, 1,
							6, 35, 25, 1,
							-2, 4, 4, 1,
							-40, 30, 7, 1,
							40, 30, 0, 0
						]
					},
					{
						"duration": 5,
						"hurtbubbles": [
							5, 4, 4, 1,
							40, 40, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							-40, 35, 7, 1,
							-40, 35, 0, 0
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							40, 45, 7, 1,
							0, 15, 15, 1,
							6, 35, 25, 1,
							-2, 4, 4, 1,
							-40, 50, 7, 1,
							40, 45, 0, 0
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							40, 50, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							-40, 55, 7, 1,
							-40, 55, 0, 0
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							0, 80, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							0, 80, 7, 1,
							0, 80, 0, 0
						]
					}
				]
			},
			{
				"name": "uthrowhit",
				"cancellable": "",
				"cancel": "continue",
				"start": "release",
				"type": 1,
				"keyframes": [
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							0, 80, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							0, 80, 7, 1
						],
						"hitbubbles": [
							1, 0, 60, 40, 0, hbColor, 11, 18, 19, 64, 64, 0, 0, 48, 0
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 22, 7, 1,
							0, 15, 15, 1,
							6, 35, 25, 1,
							-2, 4, 4, 1,
							5, 18, 7, 1
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "fthrow",
				"cancellable": "",
				"cancel": "continue",
				"transition": "fthrowhit",
				"type": 6,
				"grabForce": 10,
				"start": "grab",
				"interrupted": "release",
				"handler": "holding",
				"strength": -1,
				"heldAnimation": "held",
				"keyframes": [
					{
						"duration": 5,
						"hurtbubbles": [
							5, 4, 4, 1,
							20, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1,
							20, 20, 0, 0
						]
					},
					{
						"duration": 30,
						"hurtbubbles": [
							5, 4, 4, 1,
							20, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							20, 20, 7, 1,
							20, 20, 0, 0
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							-6, 4, 7, 1,
							0, 15, 15, 1,
							6, 35, 25, 1,
							-2, 4, 4, 1,
							40, 50, 7, 1,
							40, 50, 0, 0
						]
					},
					{
						"duration": 30,
						"hurtbubbles": [
							5, 4, 4, 1,
							40, 50, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							40, 50, 7, 1,
							40, 50, 0, 0
						]
					}
				]
			},
			{
				"name": "fthrowhit",
				"cancellable": "",
				"cancel": "continue",
				"start": "release",
				"type": 1,
				"keyframes": [
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							40, 50, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							40, 50, 7, 1
						],
						"hitbubbles": [
							1, 40, 50, 13, 0, hbColor, 16, 19, 22, 100, 100, 12, 12, 45, 0
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							60, 60, 7, 1,
							0, 15, 15, 1,
							6, 35, 25, 1,
							-2, 4, 4, 1,
							10, 22, 7, 1
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "bthrow",
				"cancellable": "fthrow",
				"cancel": "continue",
				"redirect": {
					"fthrow": "bthrow-reverse"
				},
				"transition": "bthrowhit",
				"type": 6,
				"grabForce": 10,
				"start": "grab",
				"interrupted": "release",
				"handler": "holding",
				"strength": 200,
				"heldAnimation": "heldpivot",
				"keyframes": [
					{
						"duration": 20,
						"hurtbubbles": [
							5, 4, 4, 1,
							20, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1,
							20, 20, 0, 0
						]
					},
					{
						"duration": 120,
						"hurtbubbles": [
							5, 4, 4, 1,
							0, 40, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1,
							0, 40, 0, 0
						]
					}
				]
			},
			{
				"name": "bthrowhit",
				"cancellable": "",
				"cancel": "continue",
				"start": "release",
				"type": 1,
				"keyframes": [
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							0, 40, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						],
						"hitbubbles": [
							1, 0, 40, 13, 0, hbColor, 13, 12, 15, 30, 30, 0, 0, 45, 0
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							-10, 30, 7, 1,
							0, 15, 15, 1,
							6, 35, 25, 1,
							-2, 4, 4, 1,
							5, 18, 7, 1
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "bthrow-reverse",
				"cancellable": "",
				"cancel": "continue",
				"transition": "bthrow-reversehit",
				"type": 6,
				"grabForce": 10,
				"start": "grab",
				"interrupted": "release",
				"handler": "holding",
				"strength": 200,
				"heldAnimation": "heldpivot",
				"keyframes": [
					{
						"interpolate": true,
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							20, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1,
							20, 20, 0, 0
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							40, 40, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1,
							40, 40, 0, 0
						]
					}
				]
			},
			{
				"name": "bthrow-reversehit",
				"cancellable": "",
				"cancel": "continue",
				"start": "release",
				"type": 1,
				"keyframes": [
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							40, 40, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						],
						"hitbubbles": [
							1, 40, 40, 13, 0, hbColor, 13, 12, 12, 100, 100, 0, 0, 45, 0
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							50, 30, 7, 1,
							0, 15, 15, 1,
							6, 35, 25, 1,
							-2, 4, 4, 1,
							5, 18, 7, 1
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "held",
				"transition": "held",
				"cancellable": "",
				"cancel": "held",
				"nofastfall": true,
				"nodi": true,
				"type": 4,
				"pivotx": 10,
				"pivoty": 15,
				"keyframes": [
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "heldpivot",
				"transition": "held",
				"cancellable": "",
				"cancel": "held",
				"nofastfall": true,
				"start": "pivot",
				"nodi": true,
				"type": 4,
				"pivotx": 10,
				"pivoty": 15,
				"keyframes": [
					{
						"duration": 60,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					},
					{
						"duration": 20,
						"hurtbubbles": [
							-5, 4, 4, 1,
							-10, 20, 7, 1,
							0, 15, 15, 1,
							-2, 30, 25, 1,
							2, 4, 4, 1,
							-5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "released",
				"cancellable": "",
				"nofastfall": true,
				"nodi": true,
				"type": 4,
				"keyframes": [
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "airreleased",
				"cancellable": "",
				"nofastfall": true,
				"nodi": true,
				"type": 4,
				"keyframes": [
					{
						"duration": 2,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					},
					{
						"dy": 10,
						"dx": -6,
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "dashgrab",
				"cancellable": "",
				"collided": "grab",
				"holdingAnimation": "holding",
				"type": 1,
				"slideFriction": 0.94,
				"start": "stop",
				"end": "stop",
				"keyframes": [
					{
						"duration": 6,
						"slide": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							7, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					},
					{
						"duration": 12,
						"hurtbubbles": [
							5, 4, 4, 1,
							60, 30, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							0, 20, 7, 1
						],
						"hitbubbles": [
							6, 30, 20, 25, 0, grabColor, 0, 0, 0, 0, 0, 0, 0, 0, 0,
							6, 65, 25, 15, 0, grabColor, 0, 0, 0, 0, 0, 0, 0, 0, 0
						]
					},
					{
						"duration": 12,
						"hurtbubbles": [
							5, 4, 4, 1,
							20, 10, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							0, 20, 7, 1
						]
					},
					{
						"duration": 12,
						"hurtbubbles": [
							5, 4, 4, 1,
							30, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							0, 20, 7, 1
						]
					},
					{
						"duration": 3,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "pivotgrab",
				"cancellable": "",
				"collided": "grab",
				"holdingAnimation": "holding",
				"type": 1,
				"keyframes": [
					{
						"duration": 3,
						"hurtbubbles": [
							-5, 4, 4, 1,
							-10, 20, 7, 1,
							0, 15, 15, 1,
							-2, 30, 25, 1,
							2, 4, 4, 1,
							-5, 20, 7, 1
						]
					},
					{
						"duration": 4,
						"hurtbubbles": [
							5, 4, 4, 1,
							40, 30, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							0, 20, 7, 1
						],
						"hitbubbles": [
							6, 50, 20, 25, 0, grabColor, 0, 0, 0, 0, 0, 0, 0, 0, 0,
							6, 10, 20, 25, 0, grabColor, 0, 0, 0, 0, 0, 0, 0, 0, 0
						]
					},
					{
						"duration": 4,
						"hurtbubbles": [
							5, 4, 4, 1,
							20, 10, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							0, 20, 7, 1
						]
					},
					{
						"duration": 8,
						"hurtbubbles": [
							5, 4, 4, 1,
							30, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							0, 20, 7, 1
						]
					},
					{
						"duration": 7,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "groundspecial",
				"cancellable": "",
				"type": 3,
				"buffer": "groundspecial",
				"reversible": true,
				"keyframes": [
					{
						"duration": 4,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					},
					{
						"duration": 5,
						"audio": "pew",
						"spawn": {
							"name": "laser",
							"stale": true,
							"x": 30,
							"y": 20,
							"dx": 15,
							"follow": false,
							"airborne": true
						},
						"hurtbubbles": [
							5, 4, 4, 1,
							30, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							0, 20, 7, 1
						]
					},
					{
						"duration": 18,
						"cancellable": "hop",
						"hurtbubbles": [
							5, 4, 4, 1,
							30, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							0, 20, 7, 1
						]
					},
					{
						"duration": 8,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "sidespecial",
				"cancellable": "",
				"transition": "sidespecial2",
				"noFastfall": true,
				"grabRadius": 11,
				"grabXOffset": 10,
				"grabYOffset": -30,
				"grabDirections": 15,
				"holdingAnimation": "dthrow",
				"grabbed": "grab",
				"type": 3,
				"start": function (entity) {
					entity.y -= 1;
					entity.airborne = true;
					entity.startY = entity.y;
					entity.dx = 0;
				},
				"end": function (entity) {
					entity.dy = 0;
				},
				"keyframes": [
					{
						"duration": 3,
						"noLedgeGrab": true,
						"handler": function (entity) {
							//entity.x = entity.startX;
							//entity.y = entity.startY;
							entity.y = entity.startY;
							entity.dy = 0;
						},
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					},
					{
						"duration": 7,
						"noLedgeGrab": true,
						"handler": function (entity) {
							//entity.x = entity.startX;
							//entity.y = entity.startY;
							entity.y = entity.startY;
							entity.dy = 0;
						},
						"hurtbubbles": [
							5, 4, 4, 1,
							30, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							0, 20, 7, 1
						]
					},
					{
						"duration": 8,
						"reset": true,
						"start": function (entity) {
						},
						"handler": function (entity, controller, animation) {
							entity.dx = entity.facing ? 22 : -22;
							entity.y = entity.startY;
							entity.dy = 0;
						},
						"hurtbubbles": [
							5, 4, 4, 1,
							30, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							0, 20, 7, 1
						],
						"hitbubbles": [
							6, 25, 30, 23, 0, grabColor, 0, 0, 0, 0, 0, 4, 4, 45, 0,
							6, 30, 20, 23, 0, grabColor, 0, 0, 0, 0, 0, 4, 4, 45, 0
						]
					},
					{
						"duration": 3,
						"start": function (entity) {
						},
						"handler": function (entity) {
							entity.dx *= 0.9;
							entity.y = entity.startY;
							entity.dy = 0;
						},
						"hurtbubbles": [
							5, 4, 4, 1,
							30, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							0, 20, 7, 1
						]
					},
					{
						"duration": 12,
						"handler": function (entity) {
							entity.dx *= 0.9;
							entity.y = entity.startY;
							entity.dy = 0;
						},
						"hurtbubbles": [
							5, 4, 4, 1,
							30, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							0, 20, 7, 1
						]
					},
					{
						"duration": 12,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "sidespecial2",
				"cancellable": "",
				"transition": "helpless",
				"helpless": true,
				"type": 4,
				"noFastfall": true,
				"grabRadius": 51,
				"grabXOffset": 40,
				"grabYOffset": -36,
				"grabDirections": 15,
				"keyframes": [
					{
						"duration": 20,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					},
					{
						"duration": 20,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 10, 7, 1,
							0, 15, 15, 1,
							2, 20, 25, 1,
							-2, 4, 4, 1,
							5, 10, 7, 1
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "downspecial",
				"cancellable": "hop",
				"type": 3,
				"reversible": true,
				"keyframes": [
					{
						"duration": 2,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					},
					{
						"duration": 2,
						"hurtbubbles": [
							5, 4, 4, 1,
							30, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							0, 20, 7, 1
						],
						"audio": "shortwhiff",
						"hitbubbles": [
							1, 20, 20, 32, 2 | 4 | 8, 174, 3, 28, 0, 130, 130, 2, 2, 48, 0,
							1, 0, 20, 32, 2 | 4 | 8, 174, 3, 28, 0, 252, 252, 2, 2, 48, 0,
							1, 20, 20, 32, 2 | 4 | 16, 174, 3, 12, 0, 130, 130, 2, 2, 48, 0,
							1, 0, 20, 32, 2 | 4 | 16, 174, 3, 12, 0, 252, 252, 2, 2, 48, 0
						]
					},
					{
						"duration": 10
					},
					{
						"duration": 16,
						"hurtbubbles": [
							5, 4, 4, 1,
							30, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							0, 20, 7, 1
						]
					},
					{
						"duration": 3,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "upspecial",
				"cancellable": "",
				"transition": "jetpack",
				"slid": "jetpack",
				"type": 3,
				"reversible": true,
				"keyframes": [
					{
						"duration": 30,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					},
					{
						"duration": 30,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 4, 1,
							0, 15, 10, 1,
							2, 30, 10, 1,
							-2, 4, 25, 1,
							5, 20, 25, 1
						],
						"hitbubbles": [
							1, -30, 15, 13, 0, hbColor, 5, 9, 9, 110, 110, 2, 2, 45, 0
						]
					},
					{
						"duration": 30,
						"hurtbubbles": [
							-15, 4, 4, 1,
							15, 20, 4, 1,
							-20, 15, 10, 1,
							20, 30, 10, 1,
							0, 4, 25, 1,
							0, 20, 25, 1
						],
						"hitbubbles": [
							1, 30, 20, 13, 0, hbColor, 5, 9, 9, 20, 20, 2, 2, 45, 0
						]
					},
					{
						"duration": 30,
						"hurtbubbles": [
							-15, 4, 4, 1,
							15, 4, 4, 1,
							-20, 37, 10, 1,
							20, 37, 10, 1,
							0, 25, 25, 1,
							0, 50, 25, 1
						]
					}
				]
			},
			{
				"name": "killjoy",
				"cancellable": "",
				"cancel": "continue",
				"type": 3,
				"nofastfall": true,
				"reversible": true,
				"keyframes": [
					{
						"duration": 10,
						"hurtbubbles": [
							-15, 4, 4, 1,
							15, 4, 4, 1,
							-20, 37, 10, 1,
							20, 37, 10, 1,
							0, 25, 25, 1,
							0, 50, 25, 1
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							-15, 4, 4, 1,
							15, 20, 4, 1,
							-20, 15, 10, 1,
							20, 30, 10, 1,
							0, 4, 25, 1,
							0, 20, 25, 1
						],
						"audio": "shortwhiff",
						"hitbubbles": [
							1, 30, 20, 13, 0, hbColor, 5, 9, 9, 20, 20, 2, 2, 45, 0
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 4, 1,
							0, 15, 10, 1,
							2, 30, 10, 1,
							-2, 4, 25, 1,
							5, 20, 25, 1
						],
						"audio": "shortwhiff",
						"hitbubbles": [
							1, -30, 5, 13, 0, hbColor, 5, 9, 9, 110, 110, 2, 2, 45, 0
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "jetpack",
				"cancellable": "",
				"cancel": "continue",
				"transition": "jetpack",
				"friction": 0,
				"gravity": 0.12,
				"redirect": {
					"airhit": "killjoy",
					"hit": "killjoy"
				},
				"type": 3,
				"reversible": true,
				"start": function (entity, controller) {
					entity.airborne = true;
					if (!entity.lastPoot) {
						entity.lastPoot = controller.frame;
					}
				},
				"handler": function (entity, controller) {
					var height = entity.hover && entity.hover.yAt(entity.x) - entity.y;
					if (!entity.airborne) {
						entity.slide = 0;
						entity.dx = 0;
					}
					if (controller.vmove > 0) {
						entity.fastfall = false;
					}
					if (controller.vmove < 0 && !entity.airborne) {
						entity.airborne = true;
					}
					entity.dx += controller.hmove * 0.05;
					if (height > 0) {
						entity.dy -= controller.vmove * 0.75 * Math.max((height) / Math.pow(height, 1.35), 0.1135953354806627);
					} else if (height === 0) {
						entity.dy -= controller.vmove * 0.75;
					} else {
						entity.dy -= controller.vmove * 0.75 * 0.1135953354806627;
					}
					entity.hurtbubbles[0].y = Math.min(-4, -4 + controller.vmove * 20);
					entity.hurtbubbles[1].y = Math.min(-4, -4 + controller.vmove * 20);
					entity.hurtbubbles[0].x = Math.min(-15, -15 + controller.vmove * 10);
					entity.hurtbubbles[1].x = Math.max(15, 15 - controller.vmove * 10);
					if (entity.airborne && controller.vmove < 0 && controller.frame - entity.lastPoot > Math.ceil(6 * (1 / -controller.vmove))) {
						entity.spawn({
							"name": "poof",
							"stale": true,
							"follow": false,
							"x": 0,
							"y": 0,
							"dx": -controller.hmove * 4,
							"dy": controller.vmove * 4 - 6,
							"airborne": true
						});
						entity.lastPoot = controller.frame;
					}
					if (controller.specialPress) {
						entity.schedule('killjoy', true);
					}
				},
				"keyframes": [
					{
						"duration": 60,
						"hurtbubbles": [
						]
					},
					{
						"duration": 60,
						"hurtbubbles": [
						]
					}
				]
			},
			{
				"name": "airspecial",
				"cancellable": "",
				"buffer": "airspecial",
				"type": 3,
				"reversible": true,
				"keyframes": [
					{
						"duration": 6,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					},
					{
						"duration": 5,
						"hurtbubbles": [
							5, 4, 4, 1,
							30, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							0, 20, 7, 1
						],
						"audio": "pew",
						"spawn": {
							"name": "laser",
							"follow": false,
							"stale": true,
							"x": 30,
							"y": 20,
							"dx": 15,
							"dy": -2,
							"airborne": true
						},
						"link": "megaairspecial"
					},
					{
						"duration": 6,
						"hurtbubbles": [
							5, 4, 4, 1,
							30, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							0, 20, 7, 1
						]
					},
					{
						"duration": 6,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "megaairspecial",
				"cancellable": "",
				"type": 3,
				"reversible": true,
				"keyframes": [
					{
						"duration": 6,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					},
					{
						"duration": 5,
						"hurtbubbles": [
							5, 4, 4, 1,
							30, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							0, 20, 7, 1
						],
						"hitbubbles": [
							1, 30, 20, 13, 0, 195, 0, 0, 0, 0, 0, 0, 0, 45, 0
						],
						"spawn": {
							"name": "laser",
							"follow": false,
							"stale": true,
							"x": 30,
							"y": 20,
							"dx": 15,
							"dy": 15,
							"airborne": true
						},
						"link": "megaairspecial"
					},
					{
						"duration": 3,
						"hurtbubbles": [
							5, 4, 4, 1,
							30, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							0, 20, 7, 1
						]
					},
					{
						"duration": 3,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "airsidespecial",
				"cancellable": "",
				"transition": "airsidespecial2",
				"noFastfall": true,
				"grabRadius": 45,
				"grabXOffset": 20,
				"grabYOffset": -30,
				"grabDirections": 32,
				"holdingAnimation": "bthrow-reverse",
				"grabbed": "grab",
				"ledgeGrab": "ledgegrabzair",
				"type": 3,
				"start": function (entity) {
					entity.y += 1;
					entity.startDx = entity.dx;
					entity.startDy = entity.dy;
					entity.startX = entity.x;
					entity.startY = entity.y;
					entity.dx *= 0.1;
				},
				"end": function (entity) {
					entity.dy = 0;
				},
				"keyframes": [
					{
						"duration": 3,
						"noLedgeGrab": true,
						"handler": function (entity) {
							//entity.x = entity.startX;
							//entity.y = entity.startY;
							entity.dy *= 0.85;
						},
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					},
					{
						"duration": 6,
						"noLedgeGrab": true,
						"handler": function (entity) {
							//entity.x = entity.startX;
							//entity.y = entity.startY;
							entity.dy *= 0.85;
						},
						"hurtbubbles": [
							5, 4, 4, 1,
							30, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							0, 20, 7, 1
						]
					},
					{
						"duration": 14,
						"reset": true,
						"start": function (entity) {
							entity.dx = entity.startDx;
							entity.dy = entity.startDy;
						},
						"handler": function (entity, controller, animation) {
							entity.dx *= 0.8;
							entity.dx += Math.min(15, (entity.facing ? 1 : -1) * (3 + (entity.dy < 0 ? -entity.dy : 0)));
							entity.dy *= 0.85;
							entity.dy += 1;
						},
						"hurtbubbles": [
							5, 4, 4, 1,
							30, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							0, 20, 7, 1
						],
						"hitbubbles": [
							6, 20, 20, 20, 0, grabColor, 0, 0, 0, 0, 0, 3, 3, 45, 0
						]
					},
					{
						"duration": 3,
						"hurtbubbles": [
							5, 4, 4, 1,
							30, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							0, 20, 7, 1
						]
					},
					{
						"duration": 3,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "airsidespecial2",
				"cancellable": "",
				"transition": "helpless",
				"helpless": true,
				"type": 4,
				"noFastfall": true,
				"grabRadius": 51,
				"grabXOffset": 30,
				"grabYOffset": -36,
				"grabDirections": 15,
				"keyframes": [
					{
						"duration": 20,
						"hurtbubbles": [
							5, -4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, -4, 4, 1,
							5, 20, 7, 1
						]
					},
					{
						"duration": 20,
						"hurtbubbles": [
							5, 34, 4, 1,
							10, 10, 7, 1,
							0, 15, 15, 1,
							2, 20, 25, 1,
							-2, 34, 4, 1,
							5, 10, 7, 1
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, -4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, -4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "airdownspecial",
				"cancellable": "airjump0",
				"start": "brake",
				"brake": 0.3,
				"noFastfall": true,
				"nodi": true,
				"gravity": 0,
				"type": 3,
				"reversible": true,
				"keyframes": [
					{
						"duration": 3,
						"dy": 0,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					},
					{
						"duration": 2,
						"hurtbubbles": [
							5, 4, 4, 1,
							30, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							0, 20, 7, 1
						],
						"audio": "shortwhiff",
						"hitbubbles": [
							1, 20, 20, 32, 6, 174, 3, 12, 12, 130, 130, 2, 2, 48, 0,
							1, 0, 20, 32, 6, 174, 3, 12, 12, 252, 252, 2, 2, 48, 0
						]
					},
					{
						"duration": 10
					},
					{
						"duration": 8,
						"hurtbubbles": [
							5, 4, 4, 1,
							30, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							0, 20, 7, 1
						]
					},
					{
						"duration": 3,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "airupspecial",
				"cancellable": "",
				"noFastfall": true,
				"type": 3,
				"reversible": true,
				"transition": "airupspecial2",
				"handler": function (entity, controller, animation) {
					var angle;
					if (animation.keyframe === 0) {
						entity.dy *= 0.95;
						entity.dx = entity.facing ? 2 : -2;
					} else if (animation.keyframe === 1) {
						entity.dy = 16 - 5 * (animation.midframe / animation.frameDuration);
						entity.dx = entity.facing ? 4 : -4;
					}
					if (controller.specialPress && animation.keyframe === 1) {
						entity.schedule('airupspecial2', true);
						if (Math.abs(controller.hmove) > 0.2 || Math.abs(controller.vmove) > 0.2) {
						//angle = controller.angle();
						//if (angle > 201 || angle < 181) {
							entity.dx -= controller.angleX() * 12;
							entity.dy = Math.min(controller.angleY() * 12, 6);
							if (entity.hover && entity.hover - entity.y < 20) {
								entity.y = entity.hover;
							}
							if (controller.left && entity.facing || controller.right && !entity.facing) {
								entity.facing = !entity.facing;
							}
						}
					}
				},
				"start": function (entity) {
					entity.airborne = true;
				},
				"end": function (entity, controller) {
					entity.dx = 0;
					if ((entity.facing && controller.left) || (!entity.facing && controller.right)) {
						entity.facing = !entity.facing;
					}
				},
				"keyframes": [
					{
						"duration": 15,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					},
					{
						"duration": 20,
						"hurtbubbles": [
							5, 4, 4, 1,
							30, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							0, 20, 7, 1
						],
						"hitbubbles": [
							1, 20, 35, 35, 0, 207, 13, 7, 7, 44, 44, 3, 3, 45, 0
						]
					},
					{
						"duration": 3,
						"hurtbubbles": [
							5, 4, 4, 1,
							30, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							0, 20, 7, 1
						]
					},
					{
						"duration": 3,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "airupspecial2",
				"cancellable": "",
				"transition": "helpless",
				"helpless": true,
				"type": 0,
				"noFastfall": true,
				"grabRadius": 51,
				"grabXOffset": 20,
				"grabYOffset": -36,
				"grabDirections": 20,
				"keyframes": [
					{
						"duration": 20,
						"hurtbubbles": [
							5, -4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, -4, 4, 1,
							5, 20, 7, 1
						]
					},
					{
						"duration": 20,
						"hurtbubbles": [
							5, 34, 4, 1,
							10, 10, 7, 1,
							0, 15, 15, 1,
							2, 20, 25, 1,
							-2, 34, 4, 1,
							5, 10, 7, 1
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, -4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, -4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "jab",
				"cancellable": "",
				"type": 1,
				"redirect": {
					"jab": "jab2"
				},
				"buffer": "jab",
				"keyframes": [
					{
						"duration": 3,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					},
					{
						"duration": 5,
						"hurtbubbles": [
							5, 4, 4, 1,
							30, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							0, 20, 7, 1
						],
						"audio": "shortwhiff",
						"hitbubbles": [
							1, 30, 20, 23, 0, hbColor, 3, 4, 4, 140, 140, 1, 1, 45, 0
						]
					},
					{
						"duration": 8,
						"cancellable": "jab",
						"hurtbubbles": [
							5, 4, 4, 1,
							30, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							0, 20, 7, 1
						]
					},
					{
						"duration": 8,
						"cancellable": "all"
					},
					{
						"duration": 16,
						"cancellable": "all",
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "jab2",
				"cancellable": "",
				"type": 1,
				"redirect": {
					"jab": "jab3"
				},
				"buffer": "jab",
				"keyframes": [
					{
						"duration": 3,
						"interpolate": true,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					},
					{
						"duration": 5,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							35, 20, 7, 1
						],
						"audio": "shortwhiff",
						"hitbubbles": [
							1, 35, 20, 20, 0, hbColor, 4, 5, 5, 66, 66, 2, 2, 45, 0
						]
					},
					{
						"duration": 8,
						"cancellable": "jab",
						"hurtbubbles": [
							5, 4, 4, 1,
							30, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							0, 20, 7, 1
						]
					},
					{
						"duration": 8,
						"cancellable": "all",
						"hurtbubbles": [
							5, 4, 4, 1,
							30, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							0, 20, 7, 1
						]
					},
					{
						"duration": 8,
						"cancellable": "all",
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "jab3",
				"cancellable": "",
				"type": 1,
				"keyframes": [
					{
						"duration": 6,
						"interpolate": true,
						"hurtbubbles": [
							5, 4, 4, 1,
							30, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							0, 20, 7, 1
						]
					},
					{
						"duration": 5,
						"hurtbubbles": [
							5, 4, 4, 1,
							30, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							0, 20, 7, 1
						],
						"audio": "longwhiff",
						"hitbubbles": [
							1, 30, 40, 45, 16, 173, 4, 30, 10, 160, 160, 20, 20, 33, 0,
							1, 30, 40, 45, 8, 241, 4, 10, 5, 160, 160, 20, 20, 42, 0
						]
					},
					{
						"duration": 20,
						"hurtbubbles": [
							5, 4, 4, 1,
							30, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							0, 20, 7, 1
						]
					},
					{
						"duration": 9,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "dashattack",
				"cancellable": "",
				"type": 1,
				"friction": 0,
				"start": "stop",
				"end": "stop",
				"slideFriction": 0.94,
				"keyframes": [
					{
						"duration": 5,
						"slide": 9,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						],
						"audio": "longwhiff",
						"hitbubbles": [
							1, 30, 20, 35, 0, hbColor, 12, 9, 9, 117, 117, 2, 2, 50, 0
						]
					},
					{
						"duration": 15,
						"hurtbubbles": [
							5, 4, 4, 1,
							20, 12, 7, 1,
							15, 15, 15, 1,
							30, 20, 25, 1,
							-2, 4, 4, 1,
							15, 15, 7, 1
						]
					},
					{
						"duration": 3,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "dtilt",
				"cancellable": "",
				"transition": "crouched",
				"type": 1,
				"keyframes": [
					{
						"interpolate": true,
						"duration": 5,
						"hurtbubbles": [
							5, 4, 4, 1,
							25, 6, 7, 1,
							5, 10, 10, 1,
							15, 15, 15, 1,
							-2, 4, 4, 1,
							20, 6, 7, 1
						]
					},
					{
						"duration": 5,
						"hurtbubbles": [
							5, 4, 4, 1,
							25, 6, 7, 1,
							5, 10, 10, 1,
							15, 15, 15, 1,
							-2, 4, 4, 1,
							20, 6, 7, 1
						],
						"audio": "longwhiff",
						"hitbubbles": [
							1, 40, 20, 30, 8, 241, 10, 7, 7, 90, 65, 1, 1, 45, 0,
							1, 10, 20, 20, 0, hbColor, 10, 7, 7, 30, 65, 1, 1, 45, 0,
							1, 85, 15, 20, 8, 241, 10, 13, 13, 120, 100, 1, 1, 45, 0,
							1, 100, 15, 20, 16, 173, 14, 14, 5, 65, 100, 1, 1, 45, 0,
							1, 60, 15, 20, 16, 173, 10, 12, 5, 65, 100, 1, 1, 45, 0,
							1, 60, 15, 20, 8, 241, 10, 11, 11, 120, 100, 1, 1, 45, 0,
							1, 80, 15, 20, 16, 173, 10, 12, 5, 65, 100, 1, 1, 45, 0,
							1, 72, 15, 20, 8, 241, 10, 9, 9, 120, 100, 1, 1, 45, 0
						]
					},
					{
						"duration": 15,
						"hurtbubbles": [
							5, 4, 4, 1,
							95, 15, 7, 1,
							20, 10, 10, 1,
							35, 15, 15, 1,
							-2, 4, 4, 1,
							80, 6, 7, 1
						]
					},
					{
						"duration": 5,
						"hurtbubbles": [
							5, 4, 4, 1,
							25, 6, 7, 1,
							5, 10, 10, 1,
							15, 15, 15, 1,
							-2, 4, 4, 1,
							20, 6, 7, 1
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 10, 7, 1,
							0, 12, 12, 1,
							2, 18, 18, 1,
							-2, 4, 4, 1,
							5, 10, 7, 1
						]
					}
				]
			},
			{
				"name": "ftilt",
				"cancellable": "",
				"type": 1,
				"keyframes": [
					{
						"duration": 3,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 35, 25, 1,
							-2, 4, 4, 1,
							0, 20, 7, 1
						]
					},
					{
						"duration": 3,
						"hurtbubbles": [
							25, 8, 4, 1,
							-10, 5, 7, 1,
							10, 15, 15, 1,
							-4, 25, 25, 1,
							25, 14, 4, 1,
							0, 5, 7, 1
						]
					},
					{
						"duration": 3,
						"hurtbubbles": [
							45, 18, 4, 1,
							-10, 5, 7, 1,
							25, 25, 15, 1,
							-4, 25, 25, 1,
							45, 24, 4, 1,
							0, 5, 7, 1
						],
						"audio": "longwhiff",
						"hitbubbles": [
							1, 45, 30, 30, 0, hbColor, 14, 11, 11, 120, 100, 1, 1, 45, 0
						]
					},
					{
						"duration": 30,
						"hurtbubbles": [
							45, 18, 4, 1,
							-10, 5, 7, 1,
							25, 25, 15, 1,
							-4, 25, 25, 1,
							45, 24, 4, 1,
							0, 5, 7, 1
						],
						"hitbubbles": [
							1, 45, 30, 30, 0, hbColor, 9, 7, 7, 120, 100, 1, 1, 45, 0
						]
					},
					{
						"duration": 8,
						"hurtbubbles": [
							55, 28, 4, 1,
							-10, 5, 7, 1,
							25, 25, 15, 1,
							-4, 25, 25, 1,
							55, 34, 4, 1,
							0, 5, 7, 1
						]
					},
					{
						"duration": 4,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 35, 25, 1,
							-2, 4, 4, 1,
							0, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "utilt",
				"cancellable": "",
				"type": 1,
				"keyframes": [
					{
						"duration": 5,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 35, 25, 1,
							-2, 4, 4, 1,
							0, 20, 7, 1
						],
						"audio": "longwhiff",
						"hitbubbles": [
							1, 20, 20, 15, 0, hbColor, 3, 7, 7, 70, 70, 1, 1, 45, 0
						]
					},
					{
						"duration": 8,
						"reset": true,
						"hurtbubbles": [
							5, 4, 4, 1,
							5, 15, 7, 1,
							0, 15, 15, 1,
							2, 35, 25, 1,
							-2, 4, 4, 1,
							20, 17, 7, 1
						],
						"hitbubbles": [
							1, 35, 30, 25, 0, hbColor, 7, 8, 8, 70, 70, 1, 1, 45, 0,
							1, 20, 20, 15, 0, hbColor, 7, 8, 8, 70, 70, 1, 1, 45, 0
						]
					},
					{
						"duration": 5,
						"reset": true,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							-2, 15, 15, 1,
							-5, 32, 25, 1,
							-2, 4, 4, 1,
							35, 30, 7, 1
						],
						"hitbubbles": [
							1, 30, 90, 35, 2, hbColor, 6, 16, 16, 70, 70, 1, 1, 55, 0,
							1, 33, 50, 30, 2, hbColor, 6, 16, 16, 70, 70, 1, 1, 55, 0
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							-3, 15, 15, 1,
							-7, 32, 25, 1,
							-3, 4, 4, 1,
							30, 70, 7, 1
						]
					},
					{
						"duration": 5,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 35, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "fsmash",
				"cancellable": "",
				"transition": "fsmash-charge",
				"type": 1,
				"friction": 0,
				"keyframes": [
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 35, 25, 1,
							-2, 4, 4, 1,
							0, 20, 7, 1
						]
					},
					{
						"duration": 5,
						"hurtbubbles": [
							5, 4, 4, 1,
							5, 20, 7, 1,
							0, 15, 15, 1,
							0, 35, 25, 1,
							-2, 4, 4, 1,
							0, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "fsmash-charge",
				"cancellable": "",
				"handler": "charge",
				"release": "fsmash-release",
				"transition": "fsmash-release",
				"type": 1,
				"keyframes": [
					{
						"duration": 5,
						"hurtbubbles": [
							5, 4, 4, 1,
							5, 20, 7, 1,
							0, 15, 15, 1,
							0, 35, 25, 1,
							-2, 4, 4, 1,
							0, 20, 7, 1
						]
					},
					{
						"duration": 85,
						"audio": "charging"
					},
					{
						"duration": 5,
						"hurtbubbles": [
							5, 4, 4, 1,
							5, 20, 7, 1,
							0, 15, 15, 1,
							0, 35, 25, 1,
							-2, 4, 4, 1,
							-20, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "fsmash-release",
				"cancellable": "",
				"type": 1,
				"scale": 0.4,
				"keyframes": [
					{
						"interpolate": true,
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							5, 20, 7, 1,
							0, 15, 15, 1,
							0, 35, 25, 1,
							-2, 4, 4, 1,
							0, 20, 7, 1
						]
					},
					{
						"duration": 5,
						"hurtbubbles": [
							5, 4, 4, 1,
							5, 20, 7, 1,
							0, 15, 15, 1,
							0, 35, 25, 1,
							-2, 4, 4, 1,
							0, 20, 7, 1
						],
						"audio": "shortwhiff",
						"hitbubbles": [
							1, 50, 20, 30, 0, hbColor, 21, 18.5, 16, 117, 117, 3, 3, 45, 0,
							1, 25, 20, 10, 0, hbColor, 21, 18.5, 16, 117, 117, 3, 3, 45, 0,
							1, -20, 20, 20, 0, hbColor, 12, 13, 13, 25, 25, 1, 1, 45, 0
						]
					},
					{
						"duration": 5,
						"hurtbubbles": [
							5, 4, 4, 1,
							50, 20, 7, 1,
							0, 15, 15, 1,
							-3, 35, 25, 1,
							-2, 4, 4, 1,
							-20, 20, 7, 1
						]
					},
					{
						"duration": 5,
						"hurtbubbles": [
							5, 4, 4, 1,
							-10, 20, 7, 1,
							0, 15, 15, 1,
							-6, 35, 25, 1,
							-2, 4, 4, 1,
							30, 20, 7, 1
						],
						"audio": "longwhiff",
						"hitbubbles": [
							1, 30, 20, 30, 0, hbColor, 21, 16, 16, 120, 120, 3, 3, 45, 0,
							1, 15, 20, 10, 0, hbColor, 21, 16, 16, 120, 120, 3, 3, 45, 0,
							1, -10, 20, 20, 0, hbColor, 12, 11, 11, 25, 25, 1, 1, 45, 0
						]
					},
					{
						"duration": 5
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							-10, 20, 7, 1,
							0, 15, 15, 1,
							-6, 35, 25, 1,
							-2, 4, 4, 1,
							30, 20, 7, 1
						]
					},
					{
						"duration": 5,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 35, 25, 1,
							-2, 4, 4, 1,
							0, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "usmash",
				"cancellable": "",
				"transition": "usmash-charge",
				"type": 1,
				"keyframes": [
					{
						"duration": 25,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 35, 25, 1,
							-2, 4, 4, 1,
							0, 20, 7, 1
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							0, 25, 4, 1,
							0, 25, 7, 1,
							0, 25, 15, 1,
							0, 25, 25, 1,
							0, 25, 4, 1,
							0, 25, 7, 1
						]
					}
				]
			},
			{
				"name": "usmash-charge",
				"cancellable": "",
				"handler": "charge",
				"transition": "usmash-release",
				"release": "usmash-release",
				"type": 1,
				"keyframes": [
					{
						"duration": 5,
						"hurtbubbles": [
							0, 25, 4, 1,
							0, 25, 7, 1,
							0, 25, 15, 1,
							0, 25, 25, 1,
							0, 25, 4, 1,
							0, 25, 7, 1
						]
					},
					{
						"duration": 85,
						"audio": "charging"
					},
					{
						"duration": 1,
						"hurtbubbles": [
							0, 25, 4, 1,
							0, 25, 7, 1,
							0, 25, 15, 1,
							0, 25, 25, 1,
							0, 25, 4, 1,
							0, 25, 7, 1
						]
					}
				]
			},
			{
				"name": "usmash-release",
				"cancellable": "",
				"type": 1,
				"scale": 0.4,
				"keyframes": [
					{
						"interpolate": true,
						"duration": 15,
						"hurtbubbles": [
							-29, 35, 4, 1,
							-32, 25, 7, 1,
							0, 35, 15, 1,
							0, 25, 25, 1,
							29, 35, 4, 1,
							32, 25, 7, 1
						]
					},
					{
						"duration": 10,
						"reset": true,
						"hurtbubbles": [
							-29, 35, 4, 1,
							-32, 25, 7, 1,
							0, 35, 15, 1,
							0, 25, 25, 1,
							29, 35, 4, 1,
							32, 25, 7, 1
						],
						"audio": "shortwhiff",
						"hitbubbles": [
							1, -20, 60, 10, 6, hbColor, 3, 3, 3, 90, 90, 6, 1, 45, 0,
							1, 20, 60, 10, 6, hbColor, 3, 3, 3, 40, 40, 6, 1, 45, 0,
							1, -32, 30, 15, 2, hbColor, 3, 3, 3, 90, 90, 6, 1, 45, 0,
							1, 32, 30, 15, 2, hbColor, 3, 3, 3, 40, 40, 6, 1, 45, 0,
							1, -26, 0, 15, 2, hbColor, 3, 6, 4, 80, 80, 6, 1, 45, 0,
							1, 26, 0, 15, 2, hbColor, 3, 6, 4, 50, 50, 6, 1, 45, 0
						]
					},
					{
						"duration": 5,
						"reset": true,
						"hurtbubbles": [
							-20, 65, 4, 1,
							-32, 35, 7, 1,
							0, 35, 15, 1,
							0, 25, 25, 1,
							20, 65, 4, 1,
							32, 35, 7, 1
						],
						"audio": "shortwhiff",
						"hitbubbles": [
							1, -5, 83, 10, 6, hbColor, 3, 3, 3, 90, 90, 6, 1, 45, 0,
							1, 5, 83, 10, 6, hbColor, 3, 3, 3, 40, 40, 6, 1, 45, 0,
							1, -12, 55, 15, 2, hbColor, 3, 3, 3, 90, 90, 6, 1, 45, 0,
							1, 12, 55, 15, 2, hbColor, 3, 3, 3, 40, 40, 6, 1, 45, 0
						]
					},
					{
						"duration": 15,
						"hurtbubbles": [
							0, 85, 4, 1,
							-12, 55, 7, 1,
							0, 35, 15, 1,
							0, 25, 25, 1,
							0, 85, 4, 1,
							12, 55, 7, 1
						]
					},
					{
						"reset": true,
						"duration": 2,
						"hurtbubbles": [
							0, 55, 4, 1,
							0, 55, 7, 1,
							0, 55, 15, 1,
							0, 25, 25, 1,
							0, 55, 4, 1,
							0, 55, 7, 1
						],
						"audio": "longwhiff",
						"hitbubbles": [
							1, 0, 55, 60, 0, hbColor, 4, 1, 1, 64, 64, 21, 16, 25, 0
						]
					},
					{
						"reset": true,
						"duration": 5,
						"hitAudio": "wham",
						"hitbubbles": [
							1, 0, 55, 60, 0, hbColor, 22, 20, 20, 64, 64, 3, 3, 50, 0
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							0, 55, 4, 1,
							0, 55, 7, 1,
							0, 55, 15, 1,
							0, 25, 25, 1,
							0, 55, 4, 1,
							0, 55, 7, 1
						]
					},
					{
						"duration": 15,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 35, 25, 1,
							-2, 4, 4, 1,
							0, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "dsmash",
				"cancellable": "",
				"transition": "dsmash-release",
				"release": "dsmash-release",
				"handler": "charge",
				"type": 1,
				"keyframes": [
					{
						"interpolate": true,
						"duration": 10,
						"hurtbubbles": [
							8, 4, 4, 1,
							6, 4, 7, 1,
							0, 12, 15, 1,
							0, 28, 25, 1,
							4, 4, 4, 1,
							-6, 4, 7, 1
						]
					},
					{
						"duration": 80,
						"audio": "charging",
						"hurtbubbles": [
							8, 4, 4, 1,
							6, 4, 7, 1,
							0, 12, 15, 1,
							0, 28, 25, 1,
							4, 4, 4, 1,
							-6, 4, 7, 1
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							8, 4, 4, 1,
							6, 4, 7, 1,
							0, 12, 15, 1,
							0, 28, 25, 1,
							4, 4, 4, 1,
							-6, 4, 7, 1
						]
					}
				]
			},
			{
				"name": "dsmash-release",
				"cancellable": "",
				"type": 1,
				"scale": 0.4,
				"keyframes": [
					{
						"interpolate": true,
						"duration": 10,
						"hurtbubbles": [
							8, 4, 4, 1,
							6, 4, 7, 1,
							0, 12, 15, 1,
							0, 28, 25, 1,
							4, 4, 4, 1,
							-6, 4, 7, 1
						]
					},
					{
						"duration": 8,
						"hurtbubbles": [
							8, 4, 4, 1,
							6, 4, 7, 1,
							0, 12, 15, 1,
							0, 28, 25, 1,
							4, 4, 4, 1,
							-6, 4, 7, 1
						],
						"audio": "shortwhiff",
						"hitbubbles": [
							1, 30, 5, 25, 0, hbColor, 14, 19.5, 22, 100, 100, 3, 3, 45, 0,
							1, 46, 6, 30, 0, hbColor, 14, 19.5, 22, 100, 100, 3, 3, 45, 0,
							1, 0, 20, 30, 0, hbColor, 12, 16, 16, 64, 64, 3, 3, 45, 0
						]
					},
					{
						"reset": true,
						"duration": 8,
						"hurtbubbles": [
							48, 4, 4, 1,
							6, 4, 7, 1,
							-2, 12, 15, 1,
							-5, 23, 25, 1,
							44, 7, 4, 1,
							-6, 4, 7, 1
						],
						"audio": "shortwhiff",
						"hitbubbles": [
							1, -15, 5, 25, 0, hbColor, 13, 15, 15, 10, 10, 3, 3, 45, 0,
							1, -36, 12, 30, 0, hbColor, 13, 15, 15, 10, 10, 3, 3, 45, 0,
							1, 0, 20, 30, 0, hbColor, 12, 15, 15, 63, 63, 3, 3, 45, 0
						]
					},
					{
						"duration": 8,
						"hurtbubbles": [
							-38, 10, 4, 1,
							6, 4, 7, 1,
							2, 12, 15, 1,
							14, 25, 25, 1,
							-34, 13, 4, 1,
							-6, 4, 7, 1
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							-8, 4, 4, 1,
							3, 4, 7, 1,
							0, 12, 15, 1,
							6, 28, 25, 1,
							-4, 4, 4, 1,
							-3, 4, 7, 1
						]
					},
					{
						"duration": 5,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "zair",
				"cancellable": "",
				"cancel": "zair-cancel",
				"type": 2,
				"grabYOffset": -46,
				"grabXOffset": 80,
				"grabRadius": 71,
				"grabDirections": 15,
				"noLCancel": true,
				"ledgeGrab": "ledgegrabzair",
				"keyframes": [
					{
						"duration": 4,
						"noLedgeGrab": true,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					},
					{
						"reset": true,
						"noLedgeGrab": true,
						"duration": 2,
						"hurtbubbles": [
							5, 4, 4, 1,
							100, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						],
						"audio": "longwhiff",
						"hitbubbles": [
							1, 90, 20, 13, 0, hbColor, 5, 6, 6, 100, 100, 2, 2, 45, 0,
							1, 110, 20, 13, 0, hbColor, 5, 6, 6, 100, 100, 2, 2, 45, 0,
							1, 130, 20, 13, 0, hbColor, 5, 6, 6, 100, 100, 2, 2, 45, 0
						]
					},
					{
						"reset": true,
						"noLedgeGrab": true,
						"duration": 2,
						"hurtbubbles": [
							5, 4, 4, 1,
							120, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						],
						"hitbubbles": [
							1, 120, 20, 13, 0, hbColor, 2, 4, 4, 240, 240, 2, 2, 45, 0
						]
					},
					{
						"reset": true,
						"duration": 2,
						"hurtbubbles": [
							5, 4, 4, 1,
							70, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						],
						"hitbubbles": [
							1, 80, 20, 13, 0, hbColor, 2, 4, 4, 240, 240, 2, 2, 45, 0
						]
					},
					{
						"reset": true,
						"duration": 2,
						"hurtbubbles": [
							5, 4, 4, 1,
							50, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						],
						"hitbubbles": [
							1, 60, 20, 13, 0, hbColor, 2, 4, 4, 240, 240, 2, 2, 45, 0
						]
					},
					{
						"reset": true,
						"duration": 2,
						"hurtbubbles": [
							5, 4, 4, 1,
							30, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						],
						"hitbubbles": [
							1, 40, 20, 13, 0, hbColor, 6, 6, 6, 240, 240, 2, 2, 45, 0
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "zair-dodge",
				"cancellable": "",
				"cancel": "zair-cancel",
				"transition": "helpless",
				"helpless": true,
				"type": 2,
				"grabYOffset": -46,
				"grabXOffset": 80,
				"grabRadius": 71,
				"grabDirections": 15,
				"noLCancel": true,
				"ledgeGrab": "ledgegrabzair",
				"keyframes": [
					{
						"duration": 4,
						"noLedgeGrab": true,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					},
					{
						"reset": true,
						"noLedgeGrab": true,
						"duration": 2,
						"hurtbubbles": [
							5, 4, 4, 1,
							100, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						],
						"audio": "longwhiff",
						"hitbubbles": [
							1, 90, 20, 13, 0, hbColor, 5, 6, 6, 100, 100, 2, 2, 45, 0,
							1, 110, 20, 13, 0, hbColor, 5, 6, 6, 100, 100, 2, 2, 45, 0,
							1, 130, 20, 13, 0, hbColor, 5, 6, 6, 100, 100, 2, 2, 45, 0
						]
					},
					{
						"reset": true,
						"noLedgeGrab": true,
						"duration": 2,
						"hurtbubbles": [
							5, 4, 4, 1,
							120, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						],
						"hitbubbles": [
							1, 120, 20, 13, 0, hbColor, 2, 4, 4, 240, 240, 2, 2, 45, 0
						]
					},
					{
						"reset": true,
						"duration": 2,
						"hurtbubbles": [
							5, 4, 4, 1,
							70, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						],
						"hitbubbles": [
							1, 80, 20, 13, 0, hbColor, 2, 4, 4, 240, 240, 2, 2, 45, 0
						]
					},
					{
						"reset": true,
						"duration": 2,
						"hurtbubbles": [
							5, 4, 4, 1,
							50, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						],
						"hitbubbles": [
							1, 60, 20, 13, 0, hbColor, 2, 4, 4, 240, 240, 2, 2, 45, 0
						]
					},
					{
						"reset": true,
						"duration": 2,
						"hurtbubbles": [
							5, 4, 4, 1,
							30, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						],
						"hitbubbles": [
							1, 40, 20, 13, 0, hbColor, 6, 6, 6, 240, 240, 2, 2, 45, 0
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "zair-cancel",
				"cancellable": "",
				"type": 0,
				"keyframes": [
					{
						"interpolate": true,
						"duration": 4,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					},
					{
						"duration": 4,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "nair",
				"cancellable": "",
				"cancel": "nair-cancel",
				"type": 2,
				"keyframes": [
					{
						"duration": 8,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					},
					{
						"duration": 3,
						"hurtbubbles": [
							35, 25, 4, 1,
							10, 25, 7, 1,
							0, 15, 15, 1,
							2, 35, 25, 1,
							-35, 25, 4, 1,
							5, 15, 7, 1
						],
						"audio": "longwhiff",
						"hitbubbles": [
							1, 25, 25, 28, 0, hbColor, 12, 16, 16, 110, 110, 1, 1, 45, 0,
							1, -25, 25, 28, 0, hbColor, 12, 16, 16, 40, 40, 1, 1, 45, 0
						]
					},
					{
						"duration": 27,
						"hitbubbles": [
							1, 25, 25, 20, 0, hbColor, 5, 7, 7, 110, 110, 1, 1, 45, 0,
							1, -25, 25, 20, 0, hbColor, 5, 7, 7, 40, 40, 1, 1, 45, 0
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							35, 25, 4, 1,
							10, 25, 7, 1,
							0, 15, 15, 1,
							2, 35, 25, 1,
							-35, 25, 4, 1,
							5, 15, 7, 1
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "nair-cancel",
				"cancellable": "",
				"type": 0,
				"keyframes": [
					{
						"interpolate": true,
						"duration": 17,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					},
					{
						"duration": 6,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "fair",
				"cancellable": "",
				"cancel": "fair-cancel",
				"type": 2,
				"keyframes": [
					{
						"duration": 8,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					},
					{
						"reset": true,
						"duration": 6,
						"hurtbubbles": [
							5, 4, 4, 1,
							30, 30, 10, 1,
							0, 15, 15, 1,
							-6, 30, 25, 1,
							-2, 4, 4, 1,
							30, 10, 10, 1
						],
						"audio": "shortwhiff",
						"hitbubbles": [
							1, 30, 10, 20, 0, hbColor, 5, 10, 7, 118, 118, 4, 1, 45, 0,
							1, 30, 30, 20, 0, hbColor, 5, 10, 7, 118, 118, 4, 1, 45, 0
						]
					},
					{
						"reset": true,
						"duration": 5,
						"hurtbubbles": [
							3, 4, 4, 1,
							30, 30, 10, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-4, 4, 4, 1,
							30, 10, 10, 1
						],
						"audio": "shortwhiff",
						"hitbubbles": [
							1, 60, 12, 25, 6, hbColor, 5, 10, 7, 105, 105, 7, 2, 45, 0,
							1, 60, 28, 25, 6, hbColor, 5, 10, 7, 105, 105, 7, 2, 45, 0
						]
					},
					{
						"reset": true,
						"duration": 8,
						"hurtbubbles": [
							1, 4, 4, 1,
							30, 30, 10, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-6, 4, 4, 1,
							30, 10, 10, 1
						],
						"audio": "longwhiff",
						"hitbubbles": [
							1, 80, 14, 12, 0, hbColor, 16, 16, 20, 100, 100, 10, 10, 45, 0,
							1, 80, 24, 12, 0, hbColor, 16, 16, 20, 100, 100, 10, 10, 45, 0
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							-1, 4, 4, 1,
							30, 30, 10, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-8, 4, 4, 1,
							30, 10, 10, 1
						],
						"hitbubbles": [
							1, 110, 15, 12, 0, hbColor, 14, 10, 10, 175, 175, 3, 3, 45, 0,
							1, 110, 25, 12, 0, hbColor, 14, 10, 10, 175, 175, 3, 3, 45, 0
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							-3, 4, 4, 1,
							30, 30, 10, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-10, 4, 4, 1,
							30, 10, 10, 1
						]
					},
					{
						"duration": 5,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "fair-cancel",
				"cancellable": "",
				"type": 0,
				"keyframes": [
					{
						"interpolate": true,
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]/*[
							5, 4, 4, 1,
							25, 30, 10, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							25, 10, 10, 1
						]*/
					},
					{
						"duration": 15,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "bair",
				"cancellable": "",
				"transition": "bair-charge",
				"cancel": "bair-cancel",
				"type": 2,
				"keyframes": [
					{
						"duration": 5,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					},
					{
						"duration": 7,
						"hurtbubbles": [
							15, 4, 4, 1,
							5, 15, 7, 1,
							0, 15, 15, 1,
							-8, 25, 25, 1,
							4, 4, 4, 1,
							0, 15, 7, 1
						]
					}
				]
			},
			{
				"name": "bair-charge",
				"cancellable": "",
				"cancel": "bair-charge-cancel",
				"noLCancel": true,
				"handler": "charge",
				"release": "bair-fastrelease",
				"transition": "bair-release",
				"type": 2,
				"keyframes": [
					{
						"duration": 5,
						"hurtbubbles": [
							15, 4, 4, 1,
							5, 15, 7, 1,
							0, 15, 15, 1,
							-8, 25, 25, 1,
							4, 4, 4, 1,
							0, 15, 7, 1
						]
					},
					{
						"duration": 15,
						"audio": "charging"
					},
					{
						"duration": 7,
						"hurtbubbles": [
							20, 4, 4, 1,
							45, 35, 7, 1,
							0, 15, 15, 1,
							-8, 25, 25, 1,
							15, 10, 4, 1,
							30, 45, 7, 1
						]
					}
				]
			},
			{
				"name": "bair-fastrelease",
				"cancellable": "",
				"cancel": "bair-cancel",
				"type": 2,
				"scale": 0.1,
				"keyframes": [
					{
						"interpolate": true,
						"duration": 7,
						"hurtbubbles": [
							-30, 16, 4, 1,
							5, 10, 7, 1,
							0, 15, 15, 1,
							15, 15, 25, 1,
							-30, 13, 4, 1,
							7, 5, 7, 1
						]
					},
					{
						"duration": 5,
						"hurtbubbles": [
							-50, 16, 4, 4,
							5, 10, 7, 1,
							0, 15, 15, 1,
							15, 15, 25, 1,
							-47, 13, 4, 4,
							7, 5, 7, 1
						],
						"audio": "shortwhiff",
						"hitbubbles": [
							1, -30, 15, 30, 0, hbColor, 12, 11, 11, 11, 11, 2, 2, 45, 0,
							1, -10, 15, 25, 0, hbColor, 8, 9, 9, 110, 110, 2, 2, 45, 0
						]
					},
					{
						"duration": 5,
						"hurtbubbles": [
							-30, 16, 4, 4,
							5, 10, 7, 1,
							0, 15, 15, 1,
							15, 15, 25, 1,
							-30, 13, 4, 4,
							7, 5, 7, 1
						]
					},
					{
						"duration": 15,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "bair-release",
				"cancellable": "",
				"cancel": "bair-charge-cancel",
				"noLCancel": true,
				"type": 2,
				"keyframes": [
					{
						"interpolate": true,
						"duration": 7,
						"hurtbubbles": [
							-80, 16, 4, 1,
							60, -10, 7, 4,
							0, 15, 15, 1,
							15, 15, 25, 1,
							-80, 13, 4, 1,
							65, -5, 7, 4
						]
					},
					{
						"duration": 3,
						"audio": "shortwhiff",
						"hitbubbles": [
							1, 60, -7, 20, 0, hbColor, 14, 16, 16, 185, 185, 5, 5, 45, 0
						]
					},
					{
						"duration": 20,
						"hurtbubbles": [
							-80, 16, 4, 4,
							60, -10, 7, 4,
							0, 15, 15, 1,
							15, 15, 25, 1,
							-80, 13, 4, 4,
							65, -5, 7, 4
						],
						"audio": "longwhiff",
						"hitbubbles": [
							1, -60, 15, 40, 0, hbColor, 14, 18, 18, 25, 25, 5, 5, 45, 0,
							1, -30, 15, 25, 0, hbColor, 14, 18, 18, 25, 25, 5, 5, 50, 0
						]
					},
					{
						"duration": 7,
						"hurtbubbles": [
							-80, 16, 4, 1,
							5, 10, 7, 1,
							0, 15, 15, 1,
							15, 15, 25, 1,
							-80, 13, 4, 1,
							7, 5, 7, 1
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "bair-cancel",
				"cancellable": "",
				"type": 0,
				"keyframes": [
					{
						"duration": 10,
						"interpolate": true,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "bair-charge-cancel",
				"cancellable": "",
				"type": 0,
				"keyframes": [
					{
						"duration": 20,
						"interpolate": true,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "bair2",
				"cancellable": "",
				"cancel": "bair-cancel",
				"keepCollisions": true,
				"type": 2,
				"keyframes": [
					{
						"interpolate": true,
						"duration": 10,
						"hurtbubbles": [
							-80, 16, 4, 1,
							5, 10, 7, 1,
							0, 15, 15, 1,
							15, 15, 25, 1,
							-80, 13, 4, 1,
							7, 5, 7, 1
						]
					},
					{
						"duration": 15,
						"hurtbubbles": [
							-80, 16, 4, 1,
							5, 10, 7, 1,
							0, 15, 15, 1,
							15, 15, 25, 1,
							-80, 13, 4, 1,
							7, 5, 7, 1
						],
						"hitbubbles": [
							1, -60, 15, 40, 0, hbColor, 8, 10, 10, 25, 25, 5, 5, 45, 0,
							1, -30, 15, 25, 0, hbColor, 4, 4, 4, 25, 25, 5, 5, 50, 0
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "uair",
				"cancellable": "",
				"cancel": "uair-cancel",
				"type": 2,
				"keyframes": [
					{
						"duration": 5,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					},
					{
						"duration": 5,
						"hurtbubbles": [
							5, 4, 4, 1,
							20, 10, 7, 1,
							0, 15, 15, 1,
							0, 30, 25, 1,
							-2, 4, 4, 1,
							-20, 10, 7, 1
						]
					},
					{
						"duration": 10,
						"audio": "shortwhiff",
						"hitbubbles": [
							1, -20, 30, 20, 0, hbColor, 3, 9, 6, 64, 64, 1, 1, 53, 0,
							1, 20, 30, 20, 0, hbColor, 3, 9, 6, 63, 63, 1, 1, 53, 0
						]
					},
					{
						"duration": 10,
						"reset": true,
						"hurtbubbles": [
							5, 4, 4, 1,
							20, 70, 7, 1,
							0, 15, 15, 1,
							0, 90, 25, 1,
							-2, 4, 4, 1,
							-20, 70, 7, 1
						],
						"audio": "shortwhiff",
						"hitbubbles": [
							1, 0, 100, 35, 0, hbColor, 5, 9, 7, 63, 63, 1, 1, 53, 0,
							1, 0, 120, 40, 0, hbColor, 6, 9, 7, 63, 63, 1, 1, 53, 0
						]
					},
					{
						"duration": 6,
						"reset": true,
						"hurtbubbles": [
							5, 4, 4, 1,
							20, 20, 7, 1,
							0, 15, 15, 1,
							0, 140, 25, 1,
							-2, 4, 4, 1,
							-20, 20, 7, 1
						],
						"audio": "longwhiff",
						"hitbubbles": [
							1, 0, 140, 40, 0, hbColor, 10, 15, 15, 63, 63, 1, 1, 55, 0,
							1, 0, 180, 35, 0, hbColor, 14, 17, 17, 63, 63, 1, 1, 55, 0
						]
					},
					{
						"duration": 15,
						"hurtbubbles": [
							5, 4, 4, 1,
							20, 20, 7, 1,
							0, 15, 15, 1,
							0, 140, 25, 1,
							-2, 4, 4, 1,
							-20, 20, 7, 1
						]
					},
					{
						"duration": 15,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "uair-cancel",
				"cancellable": "",
				"type": 0,
				"keyframes": [
					{
						"interpolate": true,
						"duration": 10,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]/*[
							5, 4, 4, 1,
							20, 70, 7, 1,
							0, 15, 15, 1,
							0, 90, 25, 1,
							-2, 4, 4, 1,
							-20, 70, 7, 1
						]*/
					},
					{
						"duration": 5,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "dair",
				"cancellable": "nair",
				"cancel": "dair-cancel",
				"type": 2,
				"keyframes": [
					{
						"duration": 5,
						"hurtbubbles": [
							5, -4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, -4, 4, 1,
							5, 20, 7, 1
						]
					},
					{
						"reset": true,
						"duration": 4,
						"hurtbubbles": [
							5, -10, 4, 1,
							10, 30, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, -10, 4, 1,
							5, 30, 7, 1
						],
						"audio": "shortwhiff",
						"hitbubbles": [
							1, 20, -5, 15, 0, hbColor, 2, 3, 3, 181, 181, 6, 2, 45, 0,
							1, -10, -10, 15, 0, hbColor, 2, 3, 3, 201, 201, 6, 2, 45, 0
						]
					},
					{
						"reset": true,
						"duration": 4,
						"hurtbubbles": [
							-2, -10, 4, 1,
							10, 40, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							5, -10, 4, 1,
							5, 50, 7, 1
						],
						"audio": "shortwhiff",
						"hitbubbles": [
							1, 20, -5, 15, 0, hbColor, 2, 3, 3, 181, 181, 6, 2, 45, 0,
							1, -10, -10, 15, 0, hbColor, 2, 3, 3, 201, 201, 6, 2, 45, 0
						]
					},
					{
						"reset": true,
						"duration": 4,
						"hurtbubbles": [
							5, -10, 4, 1,
							10, 50, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, -10, 4, 1,
							5, 60, 7, 1
						],
						"audio": "shortwhiff",
						"hitbubbles": [
							1, 20, -5, 15, 0, hbColor, 2, 3, 3, 181, 181, 6, 2, 45, 0,
							1, -10, -10, 15, 0, hbColor, 2, 3, 3, 201, 201, 6, 2, 45, 0
						]
					},
					{
						"reset": true,
						"duration": 8,
						"hurtbubbles": [
							-2, -10, 4, 1,
							10, 60, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							5, -10, 4, 1,
							5, 40, 7, 1
						],
						"audio": "shortwhiff",
						"hitbubbles": [
							1, 15, 5, 30, 0, hbColor, 2, 8, 8, 181, 181, 6, 2, 45, 0,
							1, -5, 0, 30, 0, hbColor, 2, 8, 8, 201, 201, 6, 2, 45, 0
						]
					},
					{
						"duration": 5,
						"hurtbubbles": [
							5, -4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, -4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			},
			{
				"name": "dair-cancel",
				"cancellable": "",
				"type": 0,
				"keyframes": [
					{
						"interpolate": true,
						"duration": 15,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]/*[
							-2, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							5, 4, 4, 1,
							5, 20, 7, 1
						]*/
					},
					{
						"duration": 5,
						"hurtbubbles": [
							5, 4, 4, 1,
							10, 20, 7, 1,
							0, 15, 15, 1,
							2, 30, 25, 1,
							-2, 4, 4, 1,
							5, 20, 7, 1
						]
					}
				]
			}
		]
	};
	var laser = new Event('characterloaded');
	laser.characterData = {
		"name": "laser",
		"defaultAnimation": "airborne",
		"hurtbubbles": 0,
		"fallSpeed": 0,
		"maxFallSpeed": 0,
		"fastfallSpeed": 0,
		"maxFastfall": 0,
		"aerodynamics": 1,
		"fallFriction": 1,
		"weight": 1,
		"height": 0,
		"directionalInfluence": 0,
		"maxDI": 0,
		"grabYOffset": -26,
		"grabXOffset": 20,
		"grabRadius": 0,
		"grabDirections": 0,
		"friction": 1,
		"slideFriction": 1,
		"color": 119,
		"onRemove": function () {
			this.lastCollision.lastFrame = false;
		},
		"permadeath": true,
		"animations": [
			{
				"name": "airborne",
				"cancellable": "",
				"cancel": "airborne-cancel",
				"transition": "airborne",
				"techable": true,
				"collided": "remove",
				"missedtech": function (entity, type) {
					if (type !== 3) { // 1-up; 2-left; 3-down; 4-right
						entity.schedule('walled', true);
					}
				},
				"type": 0,
				"keepCollisions": true,
				"keyframes": [
					{
						"duration": 30,
						"hurtbubbles": [
						],
						"hitbubbles": [
							1, 0, 0, 10, 0, 119, 4, 0, 0, 4, 4, 3, 0, 50, 0
						]
					},
					{
						"duration": 0,
						"hurtbubbles": [
						],
						"hitbubbles": [
							1, 0, 0, 10, 0, 119, 4, 0, 0, 4, 4, 3, 0, 50, 0
						]
					}
				]
			},
			{
				"name": "walled",
				"cancellable": "",
				"start": "stop",
				"end": "remove",
				"type": 0,
				"transition": "airborne",
				"keyframes": [
					{
						"reset": true,
						"duration": 10,
						"audio": "explode",
						"hurtbubbles": [
						],
						"hitbubbles": [
							1, 0, 0, 25, 0, 116, 4, 14, 14, 63, 63, 10, 0, 50, 0,
							1, 0, 0, 25, 0, 116, 4, 14, 14, 64, 64, 10, 0, 50, 0
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
						]
					}
				]
			},
			{
				"name": "airborne-cancel",
				"cancellable": "",
				"start": "stop",
				"end": "remove",
				"type": 0,
				"transition": "airborne",
				"keyframes": [
					{
						"reset": true,
						"duration": 10,
						"audio": "explode",
						"hurtbubbles": [
						],
						"hitbubbles": [
							1, 15, 15, 25, 0, 116, 4, 14, 14, 63, 63, 10, 0, 50, 0,
							1, -15, 15, 25, 0, 116, 4, 14, 14, 64, 64, 10, 0, 50, 0
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
						]
					}
				]
			}
		]
	}
	var poof = new Event('characterloaded');
	poof.characterData = {
		"name": "poof",
		"defaultAnimation": "airborne",
		"hurtbubbles": 0,
		"fallSpeed": 0,
		"maxFallSpeed": 0,
		"fastfallSpeed": 0,
		"maxFastfall": 0,
		"aerodynamics": 1,
		"fallFriction": 1,
		"weight": 1,
		"directionalInfluence": 0,
		"maxDI": 0,
		"height": 0,
		"grabYOffset": -26,
		"grabXOffset": 20,
		"grabRadius": 0,
		"grabDirections": 0,
		"friction": 1,
		"slideFriction": 1,
		"permadeath": true,
		"color": hbColor,
		"animations": [
			{
				"name": "airborne",
				"cancellable": "",
				"cancel": "airborne-cancel",
				"transition": "airborne",
				"type": 0,
				"end": "remove",
				"keepCollisions": true,
				"keyframes": [
					{
						"duration": 20,
						"hurtbubbles": [
						],
						"hitbubbles": [
							1, 0, 0, 20, 2, hbColor, 2, 3, 3, 64, 64, 1, 0, 64, 0
						]
					},
					{
						"duration": 5,
						"hurtbubbles": [
						],
						"hitbubbles": [
							1, 0, 0, 20, 0, hbColor, 2, 3, 3, 64, 64, 1, 0, 64, 0
						]
					}
				]
			},
			{
				"name": "airborne-cancel",
				"cancellable": "",
				"start": "stop",
				"end": "remove",
				"type": 0,
				"transition": "airborne",
				"keyframes": [
					{
						"duration": 2,
						"hurtbubbles": [
						]
					},
					{
						"duration": 2,
						"hurtbubbles": [
						]
					}
				]
			}
		]
	};
	window.dispatchEvent(evt);
	window.dispatchEvent(laser);
	window.dispatchEvent(poof);
}());