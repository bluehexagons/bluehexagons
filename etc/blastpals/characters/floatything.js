(function () {
	"use strict";
	var evt = new Event('characterloaded');
	evt.characterData = {
		"name": "Floaty Thing",
		"hurtbubbles": 3,
		"fallSpeed": 0,
		"fastfallSpeed": 0,
		"aerodynamics": 0.95,
		"fallFriction": 0.95,
		"phasing": true,
		"weight": 1,
		"directionalInfluence": 0.15,
		"friction": 0.85,
		"slideFriction": 0.95,
		"onCreate": function (entity) {
			while (Math.random() > 0.01) {
				entity.animations[entity.animation].step();
			}
			entity.myRadius = Math.random() * 20 + 5;
			entity.hurtbubbles[2].radius = entity.myRadius;
		},
		"animations": [
			{
				"name": "idle",
				"cancellable": "all",
				"transition": "airborne",
				"type": 0,
				"keyframes": [
					{
						"duration": 15,
						"hurtbubbles": [
							0, 50, 5, 1,
							0, -50, 5, 1
						]
					},
					{
						"duration": 15,
						"hurtbubbles": [
							-37, 37, 5, 1,
							37, -37, 5, 1
						]
					},
					{
						"duration": 15,
						"hurtbubbles": [
							-50, 0, 5, 1,
							50, 0, 5, 1
						]
					},
					{
						"duration": 15,
						"hurtbubbles": [
							-37, -37, 5, 1,
							37, 37, 5, 1
						]
					},
					{
						"duration": 15,
						"hurtbubbles": [
							0, -50, 20, 1,
							0, 50, 20, 1
						]
					},
					{
						"duration": 15,
						"hurtbubbles": [
							37, -37, 5, 1,
							-37, 37, 5, 1
						]
					},
					{
						"duration": 15,
						"hurtbubbles": [
							50, 0, 5, 1,
							-50, 0, 5, 1
						]
					},
					{
						"duration": 15,
						"hurtbubbles": [
							37, 37, 5, 1,
							-37, -37, 5, 1
						]
					},
					{
						"duration": 15,
						"hurtbubbles": [
							0, 50, 5, 1,
							0, -50, 5, 1
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
				"type": 0,
				"pivotx": 0,
				"pivoty": 0,
				"keyframes": [
					{
						"duration": 15,
						"hurtbubbles": [
							0, 50, 5, 1,
							0, -50, 5, 1
						]
					},
					{
						"duration": 15,
						"hurtbubbles": [
							-37, 37, 5, 1,
							37, -37, 5, 1
						]
					},
					{
						"duration": 15,
						"hurtbubbles": [
							-50, 0, 5, 1,
							50, 0, 5, 1
						]
					},
					{
						"duration": 15,
						"hurtbubbles": [
							-37, -37, 5, 1,
							37, 37, 5, 1
						]
					},
					{
						"duration": 15,
						"hurtbubbles": [
							0, -50, 20, 1,
							0, 50, 20, 1
						]
					},
					{
						"duration": 15,
						"hurtbubbles": [
							37, -37, 5, 1,
							-37, 37, 5, 1
						]
					},
					{
						"duration": 15,
						"hurtbubbles": [
							50, 0, 5, 1,
							-50, 0, 5, 1
						]
					},
					{
						"duration": 15,
						"hurtbubbles": [
							37, 37, 5, 1,
							-37, -37, 5, 1
						]
					},
					{
						"duration": 15,
						"hurtbubbles": [
							0, 50, 5, 1,
							0, -50, 5, 1
						]
					}
				]
			},
			{
				"name": "heldpivot",
				"transition": "held",
				"cancellable": "",
				"cancel": "held",
				"start": "pivot",
				"nofastfall": true,
				"nodi": true,
				"type": 0,
				"pivotx": 0,
				"pivoty": 0,
				"keyframes": [
					{
						"duration": 15,
						"hurtbubbles": [
							0, 50, 5, 1,
							0, -50, 5, 1
						]
					},
					{
						"duration": 15,
						"hurtbubbles": [
							-37, 37, 5, 1,
							37, -37, 5, 1
						]
					},
					{
						"duration": 15,
						"hurtbubbles": [
							-50, 0, 5, 1,
							50, 0, 5, 1
						]
					},
					{
						"duration": 15,
						"hurtbubbles": [
							-37, -37, 5, 1,
							37, 37, 5, 1
						]
					},
					{
						"duration": 15,
						"hurtbubbles": [
							0, -50, 20, 1,
							0, 50, 20, 1
						]
					},
					{
						"duration": 15,
						"hurtbubbles": [
							37, -37, 5, 1,
							-37, 37, 5, 1
						]
					},
					{
						"duration": 15,
						"hurtbubbles": [
							50, 0, 5, 1,
							-50, 0, 5, 1
						]
					},
					{
						"duration": 15,
						"hurtbubbles": [
							37, 37, 5, 1,
							-37, -37, 5, 1
						]
					},
					{
						"duration": 15,
						"hurtbubbles": [
							0, 50, 5, 1,
							0, -50, 5, 1
						]
					}
				]
			},
			{
				"name": "airhit",
				"cancellable": "",
				"type": 0,
				"handler": "stunned",
				"transition": "stunned",
				"keyframes": [
					{
						"interpolate": true,
						"duration": 14,
						"hurtbubbles": [
							-37, -37, 5, 1,
							37, 37, 5, 1
						]
					},
					{
						"duration": 4,
						"hurtbubbles": [
							0, -50, 20, 1,
							0, 50, 20, 1
						]
					},
					{
						"duration": 4,
						"hurtbubbles": [
							37, -37, 5, 1,
							-37, 37, 5, 1
						]
					}
				]
			},
			{
				"name": "stunned",
				"cancellable": "",
				"type": 0,
				"handler": "stunned",
				"keyframes": [
					{
						"duration": 8,
						"hurtbubbles": [
							0, 50, 5, 1,
							0, -50, 5, 1
						]
					},
					{
						"duration": 8,
						"hurtbubbles": [
							0, 50, 5, 1,
							0, -50, 5, 1
						]
					}
				]
			},
			{
				"name": "tumble",
				"cancellable": "all",
				"type": 0,
				"keyframes": [
					{
						"duration": 15,
						"hurtbubbles": [
							0, 50, 5, 1,
							0, -50, 5, 1
						]
					},
					{
						"duration": 15,
						"hurtbubbles": [
							-37, 37, 5, 1,
							37, -37, 5, 1
						]
					},
					{
						"duration": 15,
						"hurtbubbles": [
							0, 50, 5, 1,
							0, -50, 5, 1
						]
					}
				]
			},
			{
				"name": "airborne",
				"cancellable": "all",
				"type": 0,
				"keyframes": [
					{
						"duration": 15,
						"hurtbubbles": [
							0, 50, 5, 1,
							0, -50, 5, 1
						]
					},
					{
						"duration": 15,
						"hurtbubbles": [
							-37, 37, 5, 1,
							37, -37, 5, 1
						]
					},
					{
						"duration": 15,
						"hurtbubbles": [
							-50, 0, 5, 1,
							50, 0, 5, 1
						]
					},
					{
						"duration": 15,
						"hurtbubbles": [
							-37, -37, 5, 1,
							37, 37, 5, 1
						]
					},
					{
						"duration": 15,
						"hurtbubbles": [
							0, -50, 20, 1,
							0, 50, 20, 1
						]
					},
					{
						"duration": 15,
						"hurtbubbles": [
							37, -37, 5, 1,
							-37, 37, 5, 1
						]
					},
					{
						"duration": 15,
						"hurtbubbles": [
							50, 0, 5, 1,
							-50, 0, 5, 1
						]
					},
					{
						"duration": 15,
						"hurtbubbles": [
							37, 37, 5, 1,
							-37, -37, 5, 1
						]
					},
					{
						"duration": 15,
						"hurtbubbles": [
							0, 50, 5, 1,
							0, -50, 5, 1
						]
					}
				]
			},
			{
				"name": "jab",
				"cancellable": "",
				"type": 1,
				"keyframes": [
					{
						"duration": 20,
						"hurtbubbles": [
							0, 50, 5, 1,
							0, -50, 5, 1
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							-10, 50, 5, 1,
							-10, -50, 5, 1
						],
						"hitbubbles": [
							1, 20, 50, 10, 195, 0, 0, 0, 0, 0,
							1, 20, -50, 10, 195, 0, 0, 0, 0, 0,
							1, 40, 50, 10, 195, 0, 0, 0, 0, 0,
							1, 40, -50, 10, 195, 0, 0, 0, 0, 0
						]
					},
					{
						"duration": 10,
						"hurtbubbles": [
							35, 50, 8, 1,
							35, -50, 8, 1
						],
						"hitbubbles": [
							1, 20, 50, 7, 195, 0, 0, 0, 0, 0,
							1, 20, -50, 7, 195, 0, 0, 0, 0, 0
						]
					},
					{
						"duration": 0,
						"hurtbubbles": [
							0, 50, 5, 1,
							0, -50, 5, 1
						]
					}
				]
			}
		]
	}
	window.dispatchEvent(evt);
}());