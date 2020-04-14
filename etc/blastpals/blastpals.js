/* copyright (c) bluehexagons 2013, all rights reserved */

/* this contains the initial commit of blastpals, the prototype of Antistatic */

(function () {
	'use strict';
	var activeMode,
		frame = 0,
		frameDiff = 0,
		frameRate = 0,
		rfps,
		iters = 0,
		desync = 0,
		width = 0,
		height = 0,
		typed = '',
		entered = false,
		backspaced = false,
		undef = 'undefined',
		partyMode = false,
		mx = 0,
		my = 0,
		mwdx = 0,
		mwdy = 0,
		mp = 0,
		mouseListeners = [],
		players = [],
		canvas,
		canvasRatio = 1,
		ctx,
		unpaused = true,
		pi2 = Math.PI * 2,
		gamepads = function () { return (navigator.webkitGetGamepads && navigator.webkitGetGamepads()) || navigator.webkitGamepads || navigator.mozGamepads || (navigator.mozGetGamepads && navigator.mozGetGamepads()) || (navigator.getGamepads && navigator.getGamepads()) || navigator.gamepads || undefined; },
		connected = [],
		entities = [],
		removed = [],
		undraws = new Int16Array(2048),
		undrawsCursor = 0,
		dbg = (function dbg() {
			var log = [],
				names = [],
				times = [],
				repeat = [],
				life = 3000,
				expired = 0,
				now = Date.now,
				logFunction = function dbgLog() {
					var i,
						l = arguments.length,
						index;
					log.unshift(arguments[0]);
					if (l > 1) {
						for (i = 1; i < l; i++) {
							log[0] += ', ' + arguments[i];
						}
					}
					times.unshift(now());
					names.unshift(arguments[0]);
					repeat.unshift(0);
					index = names.indexOf(arguments[0], 1);
					if (index > 0) {
						names.splice(index, 1);
						times.splice(index, 1);
						log.splice(index, 1);
						repeat[0] = repeat[index] + 1;
						repeat.splice(index, 1);
					} else {
						dbgObject.offset += 10;
					}
					if (repeat[0] > 0) {
						log[0] += ' (' + repeat[0] + ')';
					}
				},
				dumpFunction = function dbgDump(object) {
					var i;
					if (arguments.length > 1) {
						for (i = 1; i < arguments.length; i++) {
							dbgObject.log(arguments[i], object[i]);
						}
					} else {
						for (i in object) {
							if (object.hasOwnProperty(i)) {
								dbgObject.log(i, object[i]);
							}
						}
					}
				},
				noDisplay = function () {
				},
				dbgObject = {
					drawLedgeGrab: false,
					drawHitbubbles: true,
					drawHurtbubbles: true,
					enabled: true,
					log: logFunction,
					dump: dumpFunction,
					toggle: function () {
						if (dbgObject.enabled) {
							dbgObject.log = noDisplay;
							dbgObject.dump = noDisplay;
						} else {
							dbgObject.log = logFunction;
							dbgObject.dump = dumpFunction;
						}
						dbgObject.enabled = !dbgObject.enabled;
					},
					reader: function Reader() {
						var cursor = 0,
							time = now();
						if (expired > 0) {
							log.length -= expired;
							times.length -= expired;
							names.length -= expired;
							expired = 0;
						}
						if (dbgObject.offset > 0) {
							dbgObject.offset *= 0.75;
						}
						return function reader() {
							if (time - times[cursor] > life) {
								expired++;
							}
							ctx.globalAlpha = Math.max(0, 1 - (time - times[cursor]) / life);
							return log[cursor++];
						};
					},
					offset: 0
				};
			return dbgObject;
		}()),
		pushUndraw = function (x, y, w, h) {
			undraws[undrawsCursor] = x;
			undraws[undrawsCursor + 1] = y;
			undraws[undrawsCursor + 2] = w;
			undraws[undrawsCursor + 3] = h;
			undrawsCursor += 4;
		},
		hurtbubbles = [],
		Hurtbubble = function (owner) {
			this.owner = owner;
			this.x = 0;
			this.y = 0;
			this.radius = 1;
			this.armor = false;
			this.type = 1;
			this.index = hurtbubbles.length;
			hurtbubbles.push(this);
		},
		hitbubbleData = (function () {
			var data = {
				count: 256,
				size: 18,
				fileArgs: 15
				//dataSize: 14,
				//dataBlockSize: 3
			};
			data.data = new ArrayBuffer(data.count * data.size);
			return data;
		}()),
		hitbubbleBin = {
			owner: 0,
			type: 1,
			x: 1, //2, 3
			y: 2, //4, 5
			size: 6,
			flags: 7,
			color: 8,
			damage: 9,
			knockback: 10,
			kbscale: 11,
			direction: 12,
			maxdirection: 13,
			lag: 14,
			selflag: 15,
			stun: 16,
			data: 17
		},
		hitbubbles = new Uint8Array(hitbubbleData.data),
		hitbubblesPos = new Int16Array(hitbubbleData.data),
		hitbubblesWriter = new Uint32Array(hitbubbleData.data),
		hitbubbleCount = 0,
		clearHitbubbles = function () {
			var i = 0,
				l = hitbubbleCount,
				s = hitbubbleData.size;
			hitbubbleCount = 0;
		},
		setHitbubble = function (position, entity, type, x, y, radius, color, damage, knockback, direction, lag, stun) {
			hitbubbles[position] = entity;
			hitbubbles[position + 1] = type;
			hitbubblesPos[position / 2 + 1] = x;
			hitbubblesPos[position / 2 + 2] = y;
			hitbubbles[position + 6] = radius;
			hitbubbles[position + 7] = color;
			hitbubbles[position + 7] = color;
			hitbubbles[position + 8] = damage;
			hitbubbles[position + 9] = knockback;
			hitbubbles[position + 10] = direction;
			hitbubbles[position + 11] = lag;
			hitbubbles[position + 12] = stun;
			
		},
		addDataBubble = (function () {
			var index;
			return function (block1, block2, block3) {
				index = hitbubbleCount * hitbubbleData.dataBlockSize;
				hitbubblesWriter[index] = block1;
				hitbubblesWriter[index + 1] = block2;
				hitbubblesWriter[index + 2] = block3;
				hitbubbleCount++;
			};
		}()),
		addHitbubble = function (entity, type, x, y, radius, flags, color, damage, knockback, kbscale, direction, maxdirection, lag, selflag, stun, data) {
			var position = hitbubbleCount * hitbubbleData.size;
			hitbubbles[position] = entity;
			hitbubbles[position + 1] = type;
			hitbubblesPos[position / 2 + 1] = x;
			hitbubblesPos[position / 2 + 2] = y;
			hitbubbles[position + 6] = radius;
			hitbubbles[position + 7] = flags;
			hitbubbles[position + 8] = color;
			hitbubbles[position + 9] = damage;
			hitbubbles[position + 10] = knockback;
			hitbubbles[position + 11] = kbscale;
			hitbubbles[position + 12] = direction;
			hitbubbles[position + 13] = maxdirection;
			hitbubbles[position + 14] = lag;
			hitbubbles[position + 15] = selflag;
			hitbubbles[position + 16] = stun;
			hitbubbles[position + 17] = data;
			hitbubbleCount++;
		},
		compileHitbubble = function (entity, type, x, y, radius, color) {
			return [(entity << 24) + (type << 16) + x, (y << 16) + (radius << 8) + color, 0];
		},
		strokeCircleUndraw = function (x, y, radius) {
			ctx.beginPath();
			ctx.arc(x, y, radius, 0, pi2, true);
			ctx.stroke();
			//undraws.pushAll(... // array version
			pushUndraw(x - radius - 2, y - radius - 2, radius * 2 + 4, radius * 2 + 4);
		},
		strokeCircleRegular = function (x, y, radius) {
			ctx.beginPath();
			ctx.arc(x, y, radius, 0, pi2, true);
			ctx.stroke();
			//undraws.pushAll(... // array version
		},
		strokeCircle = strokeCircleRegular,
		fillCircleUndraw = function (x, y, radius) {
			ctx.beginPath();
			ctx.arc(x, y, radius, 0, pi2, true);
			ctx.fill();
			pushUndraw(x - radius - 2, y - radius - 2, radius * 2 + 4, radius * 2 + 4);
		},
		fillCircleRegular = function (x, y, radius) {
			ctx.beginPath();
			ctx.arc(x, y, radius, 0, pi2, true);
			ctx.fill();
		},
		fillCircle = fillCircleRegular,
		drawCircleUndraw = function (x, y, radius) {
			ctx.beginPath();
			ctx.arc(x, y, radius, 0, pi2, true);
			ctx.fill();
			ctx.stroke();
			var udRadius = radius + 8;
			pushUndraw(x - udRadius, y - udRadius, udRadius * 2, udRadius * 2);
		},
		drawCircleRegular = function (x, y, radius) {
			ctx.beginPath();
			ctx.arc(x, y, radius, 0, pi2, true);
			ctx.fill();
			ctx.stroke();
			var udRadius = radius + 8;
		},
		drawCircle = drawCircleRegular,
		drawLineUndraw = function (x, y, x2, y2) {
			ctx.beginPath();
			ctx.moveTo(x, y);
			ctx.lineTo(x2, y2);
			ctx.stroke();
			pushUndraw(x - 4, Math.min(y, y2) - 4, x2 - x + 8, Math.max(y2, y) - Math.min(y, y2) + 8);
		},
		drawLineRegular = function (x, y, x2, y2) {
			ctx.beginPath();
			ctx.moveTo(x, y);
			ctx.lineTo(x2, y2);
			ctx.stroke();
		},
		drawLine = drawLineRegular,
		drawRectUndraw = function (x, y, w, h) {
			ctx.beginPath();
			ctx.moveTo(x, y);
			ctx.lineTo(x + w, y);
			ctx.lineTo(x + w, y + h);
			ctx.lineTo(x, y + h);
			ctx.lineTo(x, y);
			ctx.stroke();
			pushUndraw(x - 2, y - 2, w + 4, h + 4);
		},
		drawRectRegular = function (x, y, w, h) {
			ctx.beginPath();
			ctx.moveTo(x, y);
			ctx.lineTo(x + w, y);
			ctx.lineTo(x + w, y + h);
			ctx.lineTo(x, y + h);
			ctx.lineTo(x, y);
			ctx.stroke();
		},
		drawRect = drawRectRegular,
		drawHollowRect = function (x, y, w, h) {
			drawLine(x, y, x + w, y);
			drawLine(x + w, y, x + w, y + h);
			drawLine(x, y + h, x + w, y + h);
			drawLine(x, y + h, x, y);
		},
		fillRect = function (x, y, w, h) {
			ctx.beginPath();
			ctx.moveTo(x, y);
			ctx.lineTo(x + w, y);
			ctx.lineTo(x + w, y + h);
			ctx.lineTo(x, y + h);
			ctx.lineTo(x, y);
			ctx.fill();
		},
		fontSize = 10,
		setFontSize = (function () {
			var cache = [];
			return function setFontSize(size) {
				if (size !== fontSize) {
					fontSize = size;
					//cache[fontSize] || (cache[fontSize] = fontSize + 'px monospace');
					ctx.font = cache[fontSize] || (cache[fontSize] = fontSize + 'px monospace');
				}
			};
		}()),
		drawTextUndraw = function (text, x, y) {
			ctx.fillText(text, x, y);
			pushUndraw(x - 2, y - fontSize - 2, ctx.measureText(text).width + 4, Math.ceil(fontSize * 1.1) + 4);
		},
		drawTextRegular = function (text, x, y) {
			ctx.fillText(text, x, y);
		},
		drawText = drawTextRegular,
		fullRefresh = true,
		setFullRefresh = function (fullrefresh) {
			if (fullrefresh) {
				fullRefresh = true;
				drawRect = drawRectRegular;
				drawLine = drawLineRegular;
				drawCircle = drawCircleRegular;
				strokeCircle = strokeCircleRegular;
				fillCircle = fillCircleRegular;
				drawText = drawTextRegular;
			} else {
				fullRefresh = false;
				drawRect = drawRectUndraw;
				drawLine = drawLineUndraw;
				drawCircle = drawCircleUndraw;
				strokeCircle = strokeCircleUndraw;
				fillCircle = fillCircleUndraw;
				drawText = drawTextUndraw;
			}
		},
		Effects = (function () {
			//@optimize later
			var effects = [],
				bottom = [],
				top = [],
				removed = [],
				removebottom = [],
				removetop = [],
				removeEffect = function () {
				},
				effectFunctions = {
					render: function () {
						var i = effects.length,
							r = 0,
							index;
						while (i--) {
							effects[i]();
						}
						if (removed.length > 0) {
							index = 0;
							while (index < effects.length - r) {
								if (r > 0) {
									effects[index] = effects[index + r];
								}
								if (removed.indexOf(effects[index]) !== -1) {
									r++;
								} else {
									index++;
								}
							}
							effects.length -= r;
							removed.length = 0;
						}
					},
					renderBottom: function () {
						var i = bottom.length,
							r = 0,
							index;
						while (i--) {
							bottom[i]();
						}
						if (removebottom.length > 0) {
							index = 0;
							while (index < bottom.length - r) {
								if (r > 0) {
									bottom[index] = bottom[index + r];
								}
								if (removebottom.indexOf(bottom[index]) !== -1) {
									r++;
								} else {
									index++;
								}
							}
							bottom.length -= r;
							removebottom.length = 0;
						}
					},
					renderTop: function () {
						var i = top.length,
							r = 0,
							index;
						while (i--) {
							top[i]();
						}
						if (removetop.length > 0) {
							index = 0;
							while (index < top.length - r) {
								if (r > 0) {
									top[index] = top[index + r];
								}
								if (removetop.indexOf(top[index]) !== -1) {
									r++;
								} else {
									index++;
								}
							}
							top.length -= r;
							removetop.length = 0;
						}
					},
					reset: function () {
						effects = [];
						removed = [];
						top = [];
						removetop = [];
						bottom = [];
						removebottom = [];
					},
					powershield: function (entity, x, y, r, gro) {
						var duration = 6,
							//color = (entity.color & 168 | ((entity.color & 168) >> 1)) + 3,
							color = entity.lighter + 2,
							start = frame,
							controller = entity.controller,
							grow = gro / duration,
							f = function () {
								if (frame - start > duration) {
									removetop.push(f);
								} else {
									ctx.strokeStyle = rgbaByte[Math.floor(color - (frame - start) / duration * 3)];
									strokeCircle(entity.x + (entity.facing ? x : -x) + controller.hmove * 10, entity.y - y + controller.vmove * 10, r + grow * (frame - start));
								}
							};
						top.push(f);
					},
					shield: function (entity, x, y, r, cr, sr) {
						var animation = entity.animation,
							controller = entity.controller,
							start = frame,
							fade = 3,
							dx,
							dy,
							dr,
							stroke = false,
							color = rgbaByte[entity.color - 2],
							scolor = rgbaByte[15],
							//scolor = rgbaByte[(entity.color & 168 | ((entity.color & 168) >> 1)) + 3],
							highlight = rgbaByte[entity.lighter],
							shadow = rgbaByte[entity.darker],
							//highlight = rgbaByte[171 | (entity.color & 168) >> 1],
							//shadow = rgbaByte[3 | (entity.color & 168) >> 1],
							density,
							f = function () {
								if (entity.animation !== animation) {
									removetop.push(f);
								} else {
									density = Math.floor(entity.shieldVal * 5) + 1;
									ctx.fillStyle = color;
									dx = entity.x + (entity.facing ? x : -x) + controller.hmove * 10;
									dy = entity.y - y + controller.vmove * 10;
									dr = r + cr * (1 - entity.shieldVal) * entity.shield + sr * entity.shield;
									while (density--) {
										fillCircle(dx, dy, dr);
									}
									ctx.strokeStyle = shadow;
									strokeCircle(dx - 0.5, dy - 0.5, dr - 1);
									ctx.strokeStyle = highlight;
									strokeCircle(dx + 1.5, dy + 1.5, dr - 1.25);
									//if (stroke) {
										//ctx.strokeStyle = scolor;
										//strokeCircle(dx, dy, dr);
									//} else {
									//	stroke = frame - start > fade;
									//}
									/*if (density >= 3) {
										ctx.fillStyle = rgbaByte[color + Math.floor(density / 3)];
										fillCircle(entity.x + x + controller.hmove * (entity.facing ? 10 : -10), entity.y - y - controller.vmove * 10, r + cr * (1 - controller.shield) + sr * entity.shield);
									}*/
								}
							};
						top.push(f);
					},
					countdown: function (size, shrink, duration, endText) {
						var startFrame = frame,
							n = duration,
							f = function () {
								if (frame - startFrame > 60) {
									startFrame = frame;
									if (n === endText) {
										removetop.push(f);
									} else {
										n--;
										if (n === 0) {
											n = endText;
											playAudio('countdownend');
										} else {
											playAudio('countdownmid');
										}
									}
								} else {
									ctx.strokeStyle = rgbaByte[14];
									//dbg.log('size', -absoluteX + absoluteW / 2 - ctx.measureText(n).width / 2, -absoluteY + absoluteH / 2 + fontSize / 2);
									setFontSize(Math.floor((size - ((frame - startFrame) / 60) * shrink) * absoluteZ));
									drawText(n, -absoluteX + absoluteW / 2 - ctx.measureText(n).width / 2, -absoluteY + absoluteH / 2 + fontSize / 2);
								}
							};
						playAudio('countdownmid');
						top.push(f);
					},
					message: function (size, shrink, duration, msg) {
						var startFrame = frame,
							hw = ctx.measureText(msg).width / 2,
							f = function () {
								dbg.log('whee');
								if (frame - startFrame > duration) {
									removetop.push(f);
									dbg.log('aww');
								} else {
									ctx.strokeStyle = rgbaByte[14];
									//dbg.log('size', -absoluteX + absoluteW / 2 - ctx.measureText(n).width / 2, -absoluteY + absoluteH / 2 + fontSize / 2);
									setFontSize(Math.floor((size - ((frame - startFrame) / duration) * shrink) * absoluteZ));
									drawText(msg, -absoluteX + absoluteW / 2 - hw, -absoluteY + absoluteH / 2 + fontSize / 2);
								}
							};
						top.push(f);
					},
					respawn: function (entity) {
						var startFrame = frame,
							duration = 30,
							fadeTime = duration / 5,
							x = entity.x,
							y = entity.y,
							c = entity.color + 2,
							animation = entity.animation,
							f = function () {
								if (entity.animation !== animation) {
									removetop.push(f);
								} else {
									if (frame - startFrame >= duration) {
										startFrame = frame;
									}
									ctx.strokeStyle = rgbaByte[c - Math.floor((frame - startFrame) / fadeTime)];
									strokeCircle(x - (frame - startFrame) / 1.5, y, (frame - startFrame) / 4);
									strokeCircle(x, y, (frame - startFrame) / 2.5);
									strokeCircle(x + (frame - startFrame) / 1.5, y, (frame - startFrame) / 4);
								}
							};
						top.push(f);
					},
					combo: function (x, y, dx, dy) {
						var startFrame = frame,
							f = function () {
								if (frame - startFrame > 60) {
									removed.push(f);
								} else {
									ctx.strokeStyle = rgbaByte[14];
									strokeCircle(x + dx * (frame - startFrame) / 3, y + dy - dy * (frame - startFrame) / 3, (startFrame - frame + 60) / 30 * (Math.abs(dx) + Math.abs(dy) + 10));
								}
							};
						effects.push(f);
					},
					hit: function (x, y, dx, dy) {
						var startFrame = frame,
							f = function () {
								if (frame - startFrame > 30) {
									removed.push(f);
								} else {
									ctx.strokeStyle = rgbaByte[192];
									strokeCircle(x + dx * (frame - startFrame) / 5, y + dy - dy * (frame - startFrame) / 5, (startFrame - frame + 30) / 15 * (Math.abs(dx) + Math.abs(dy) + 3));
								}
							};
						effects.push(f);
					},
					hitbubble: function (x, y, dx, dy, d, r, c) {
						var startFrame = frame,
							duration = Math.max(5, d),
							f = function () {
								if (frame - startFrame > duration) {
									removed.push(f);
								} else {
									ctx.strokeStyle = rgbaByte[c];
									strokeCircle(x + dx * (frame - startFrame) / duration, y - dy * (frame - startFrame) / duration, (1 - (frame - startFrame) / duration) * r);
									//strokeCircle(x + dx * (frame - startFrame) / 10, y - dy * (frame - startFrame) / 10, (startFrame - frame + 10) / 5 * (r / 2));
								}
							};
						effects.push(f);
					},
					hurtbubble: function (x, y, dx, dy, r, c) {
						var startFrame = frame,
							duration = 5 + Math.random() * 15,
							f = function () {
								if (frame - startFrame > duration) {
									removed.push(f);
								} else {
									ctx.strokeStyle = rgbaByte[c];
									strokeCircle(x + dx * (frame - startFrame) / duration, y - dy * (frame - startFrame) / duration, (1 - (frame - startFrame) / duration) * r);
								}
							};
						effects.push(f);
					},
					stageBeam: function (x, y, dx, dy, r, c) {
						var startFrame = frame,
							duration = 5 + Math.random() * 15,
							f = function () {
								if (frame - startFrame > duration) {
									removed.push(f);
								} else {
									ctx.strokeStyle = rgbaByte[c];
									strokeCircle(x + dx * (frame - startFrame) / duration, y - dy * (frame - startFrame) / duration, (1 - (frame - startFrame) / duration) * r);
								}
							};
						effects.push(f);
					},
					airjump: function (x, y, c) {
						var startFrame = frame,
							f = function () {
								if (frame - startFrame > 15) {
									removed.push(f);
								} else {
									ctx.strokeStyle = rgbaByte[c];
									strokeCircle(x - (startFrame - frame + 15) / 2, y + ((startFrame - frame) / 15) * 4, (startFrame - frame + 15) / 3);
									strokeCircle(x, y + ((startFrame - frame) / 15) * 4, (startFrame - frame + 15) / 2);
									strokeCircle(x + (startFrame - frame + 15) / 2, y + ((startFrame - frame) / 15) * 4, (startFrame - frame + 15) / 3);
								}
							};
						effects.push(f);
					},
					skid: function (x, y, dx, dy) {
						var startFrame = frame,
							f = function () {
								if (frame - startFrame > 15) {
									removed.push(f);
								} else {
									ctx.strokeStyle = rgbaByte[12];
									strokeCircle(x + dx * (frame - startFrame) / 5, y - dy * (frame - startFrame) / 5, (startFrame - frame + 15));
								}
							};
						dx *= 3 + Math.random() * 4;
						dy *= 5;
						dy += Math.random() * 15;
						effects.push(f);
					},
					colorChooser: function (ox, oy, w, h, entity) {
						var startFrame = frame,
							lastMove = frame,
							x,
							y,
							s = entity.color,
							bw = w / 8,
							bh = h / 8,
							bt,
							f = function cc() {
								if (!entity.controller.select) {
									removed.push(f);
								} else {
									ctx.strokeStyle = rgbaByte[3];
									if (frame - lastMove > 8) {
										if (entity.controller.hright > 0.3) {
											entity.color += 4;
											entity.color %= 256;
											lastMove = frame;
										}
										if (entity.controller.vright < -0.3) {
											entity.color -= 32;
											if (entity.color < 0) {
												entity.color = 256 + entity.color;
											}
											lastMove = frame;
										}
										if (entity.controller.vright > 0.3) {
											entity.color += 32;
											entity.color %= 256;
											lastMove = frame;
										}
										if (entity.controller.hright < -0.3) {
											entity.color -= 4;
											if (entity.color < 0) {
												entity.color = 256 + entity.color;
											}
											lastMove = frame;
										}
										if (lastMove === frame) {
											entity.setColor(entity.color);
											entity.controller.color = entity.color;
										}
									}
									for (x = 0; x < 8; x++) {
										for (y = 0; y < 8; y++) {
											bt = x * 4 + y * 32 + 2;
											if (entity.team === 1) {
												if ((bt & 192) >> 6 < (bt & 48) >> 4 || (bt & 192) >> 6 < (bt & 12) >> 2) {
													bt -= 2;
												}
											} else if (entity.team === 2) {
												if ((bt & 48) >> 4 < (bt & 192) >> 6 || (bt & 48) >> 4 < (bt & 12) >> 2) {
													bt -= 2;
												}
											} else if (entity.team === 3) {
												if ((bt & 12) >> 2 < (bt & 192) >> 4 || (bt & 12) >> 2 < (bt & 48) >> 4) {
													bt -= 2;
												}
											}
											ctx.fillStyle = rgbaByte[bt];
											fillRect(ox + x * bw, oy + y * bh, bw, bh);
											if (bt === entity.color) {
												strokeCircle(ox + x * bw + bw * 0.5, oy + y * bh + bh * 0.5, Math.min(bw, bh) / 2);
											}
										}
									}
									ctx.strokeStyle = rgbaByte[15];
									drawRect(ox, oy, bw * 8, bh * 8);
								}
							};
						if (oy + h > absoluteY + absoluteH) {
							oy = absoluteY + absoluteH - h;
						}
						effects.push(f);
					}
				};
			return effectFunctions;
		}()),
		setActiveMode = function (mode, data) {
			entities.forEach(function (entity) {
				entity.remove();
			});
			entities = [];
			mouseListeners.reset && mouseListeners.reset();
			entities.count = 0;
			removed.count = 0;
			players = [];
			hurtbubbles = [];
			Effects.reset();
			stage = new Stage();
			ctx.clearRect(-absoluteX, -absoluteY, absoluteW, absoluteH);
			activeMode = mode(data);
			connected.forEach(function (controller) {
				controller.hook = undefined;
				activeMode.connect(controller);
			});
		},
		//top/bottom/left/right - true if character can collide moving in that direction
		StageElement = (function () {
			var stageElementConstructor = function StageElement(x, y, x2, y2, properties) {
				var flags, i, key;
				this.particles = 0;
				this.x = x;
				this.y = y;
				this.x2 = x2;
				this.y2 = y2;
				this.minY = y2 > y ? y : y2;
				this.maxY = y2 > y ? y2 : y;
				this.minYX = y2 > y ? x : x2;
				this.maxYX = y2 > y ? x2 : x;
				this.w = this.x2 - this.x;
				this.h = this.maxY - this.minY;
				this.length = Math.sqrt(Math.pow(this.x2 - this.x, 2) + Math.pow(this.y2 - this.y, 2));
				this.dx = 0;
				this.dy = 0;
				this.rightOccupied = false;
				this.leftOccupied = false;
				//define in properties
				this.leftGrabbable = false;
				this.rightGrabbable = false;
				this.top = false;
				this.bottom = false;
				this.left = false;
				this.right = false;
				this.solid = false;
				this.handler = undefined;
				for (key in properties) {
					if (properties.hasOwnProperty(key)) {
						this[key] = properties[key];
					}
				}
				if (this.flags) {
					flags = this.flags.split('|');
					i = flags.length;
					while (i--) {
						this[flags[i]] = true;
					}
				}
				if (this.initHandler) {
					this.handler = this.initHandler();
				}
			};
			stageElementConstructor.prototype.intersects = function (x1, y1, x2, y2) {
				var bx = x2 - x1,
					by = y2 - y1,
					dx = this.x2 - this.x,
					dy = this.y2 - this.y,
					b_dot_d_perp,
					cx,
					cy,
					t,
					u;
				b_dot_d_perp = bx * dy - by * dx;
				if (b_dot_d_perp === 0) {
					return false;
				}
				cx = this.x - x1;
				cy = this.y - y1;
				t = (cx * dy - cy * dx) / b_dot_d_perp;
				if (t < 0 || t > 1) {
					return false;
				}
				u = (cx * by - cy * bx) / b_dot_d_perp;
				if (u < 0 || u > 1) {
					return false;
				}
				return true;
				//return [x1 + t * bx, y1 + t * by];
			};
			stageElementConstructor.prototype.xAt = function (y) {
				return this.x === this.x2 ? this.x : (y - this.y) / (this.y2 - this.y) * (this.x2 - this.x) + this.x;
			};
			stageElementConstructor.prototype.yAt = function (x) {
				return this.y === this.y2 ? this.y : (x - this.x) / (this.x2 - this.x) * (this.y2 - this.y) + this.y;
			};
			stageElementConstructor.prototype.below = function (x, y, x2, y2) {
				return (((x >= this.x && x <= this.x2) || (x2 >= this.x && x2 <= this.x2)) && (y <= this.yAt(x)));
				//return (y <= this.yAt(x) && y2 >= this.yAt(x2));
			};
			stageElementConstructor.prototype.crossPlaneDown = function (x, y, x2, y2) {
				return (y <= this.yAt(x) && y2 >= this.yAt(x2));
			};
			stageElementConstructor.prototype.above = function (x, y, x2, y2) {
				return (((x >= this.x && x <= this.x2) || (x2 >= this.x && x2 <= this.x2)) && (y >= this.yAt(x)));
			};
			stageElementConstructor.prototype.crossPlaneUp = function (x, y, x2, y2) {
				return (y >= this.yAt(x) && y2 <= this.yAt(x2));
			};
			stageElementConstructor.prototype.rightOf = function (x, y, x2, y2, h) {
				return (((y >= this.minY && y <= this.maxY) || (y2 >= this.minY && y2 <= this.maxY)) && (x <= this.xAt(y))) || (((y + h >= this.minY && y + h <= this.maxY) || (y2 + h > this.minY && y2 + h < this.maxY)) && (x <= this.xAt(y + h)));
			};
			stageElementConstructor.prototype.crossPlaneLeft = function (x, y, x2, y2, h) {
				return (x >= this.xAt(y + h) && x2 <= this.xAt(y2 + h)) || (x >= this.xAt(y) && x2 <= this.xAt(y2));
			};
			stageElementConstructor.prototype.leftOf = function (x, y, x2, y2, h) {
				return (((y >= this.minY && y <= this.maxY) || (y2 >= this.minY && y2 <= this.maxY)) && (x >= this.xAt(y))) || (((y + h >= this.minY && y + h <= this.maxY) || (y2 + h > this.minY && y2 + h < this.maxY)) && (x >= this.xAt(y + h)));
			};
			stageElementConstructor.prototype.crossPlaneRight = function (x, y, x2, y2, h) {
				return (x <= this.xAt(y + h) && x2 >= this.xAt(y2 + h)) || (x <= this.xAt(y) && x2 >= this.xAt(y2));
			};
			
			//replaced with segIntersection, intersects
			stageElementConstructor.prototype.downCollide = function (x, y, x2, y2) {
				return (((x >= this.x && x <= this.x2) || (x2 >= this.x && x2 <= this.x2)) && (y <= this.yAt(x) && y2 >= this.yAt(x2)));
			};
			stageElementConstructor.prototype.upCollide = function (x, y, x2, y2) {
				return (((x >= this.x && x <= this.x2) || (x2 >= this.x && x2 <= this.x2)) && (y >= this.yAt(x) && y2 <= this.yAt(x2)));
			};
			stageElementConstructor.prototype.leftCollide = function (x, y, x2, y2) {
				return (((y >= this.minY && y <= this.maxY) || (y2 >= this.minY && y2 <= this.maxY)) && (x <= this.xAt(y) && x2 >= this.xAt(y2)));
			};
			stageElementConstructor.prototype.rightCollide = function (x, y, x2, y2) {
				return (((y >= this.minY && y <= this.maxY) || (y2 >= this.minY && y2 <= this.maxY)) && (x >= this.xAt(y) && x2 <= this.xAt(y2)));
			};
			
			stageElementConstructor.prototype.testLedgeGrab = function (entity) {
				var dX,
					dY;
				if (this.leftGrabbable && !this.leftOccupied && (entity.facing || entity.grabDirections & 16)) {
					dX = this.x - (entity.x + entity.grabXOffset * (entity.facing ? 1 : -1));
					dY = this.y - (entity.y + entity.grabYOffset);
					if ((dX <= entity.grabRadius) &&
							(dY <= entity.grabRadius) &&
							(Math.sqrt(dX * dX + dY * dY) < entity.grabRadius)) {
						return 1;
					}
				}
				if (this.rightGrabbable && !this.rightOccupied && (!entity.facing || entity.grabDirections & 16)) {
					dX = this.x2 - (entity.x + entity.grabXOffset * (entity.facing ? 1 : -1));
					dY = this.y2 - (entity.y + entity.grabYOffset);
					if ((dX <= entity.grabRadius) &&
							(dY <= entity.grabRadius) &&
							(Math.sqrt(dX * dX + dY * dY) <= entity.grabRadius)) {
						return 2;
					}
				} else {
					return 0;
				}
			};
			return stageElementConstructor;
		}()),
		segIntersects = function segIntersects(x1, y1, x2, y2, x3, y3, x4, y4) {
			var bx = x2 - x1,
				by = y2 - y1,
				dx = x4 - x3,
				dy = y4 - y3,
				b_dot_d_perp,
				cx,
				cy,
				t,
				u;
			b_dot_d_perp = bx * dy - by * dx;
			if (b_dot_d_perp === 0) {
				return false;
			}
			cx = x3 - x1;
			cy = y3 - y1;
			t = (cx * dy - cy * dx) / b_dot_d_perp;
			if (t < 0 || t > 1) {
				return false;
			}
			u = (cx * by - cy * bx) / b_dot_d_perp;
			if (u < 0 || u > 1) {
				return false;
			}
			return true;
			//return [x1 + t * bx, y1 + t * by];
		},
		/*segIntersection = function segIntersection(x1, y1, x2, y2, x3, y3, x4, y4) {
			var bx = x2 - x1,
				by = y2 - y1,
				dx = x4 - x3,
				dy = y4 - y3;
			var b_dot_d_perp = bx * dy - by * dx;
			if (b_dot_d_perp === 0) {
				return null;
			}
			var cx = x3 - x1;
			var cy = y3 - y1;
			var t = (cx * dy - cy * dx) / b_dot_d_perp;
			if (t < 0 || t > 1) {
				return null;
			}
			var u = (cx * by - cy * bx) / b_dot_d_perp;
			if (u < 0 || u > 1) {
				return null;
			}
			return [x1 + t * bx, y1 + t * by];
		},*/
		stage,
		gameType,
		StageAnimation = (function () {
			var animationTypes = {},
				stageAnimationConstructor = function StageAnimation(animationType, a, b, c, d) {
					this.tick = animationTypes[animationType];
					this.a = a;
					this.b = b;
					this.c = c;
					this.d = d;
				};
			return stageAnimationConstructor;
		}()),
		Stage = (function () {
			var mirrorElement = function (element, pivot) {
					var key,
						reversePoints = true,
						mirrored = {},
						mirror = ['left', 'right', 'leftGrabbable', 'rightGrabbable'],
						reverse = ['left', 'right'],
						flags,
						mirroredFlags = [],
						i,
						index,
						properties = element[4];
					if (properties) {
						for (key in properties) {
							if (properties.hasOwnProperty(key)) {
								mirrored[key] = properties[key];
							}
						}
						if (mirrored.flags) {
							flags = mirrored.flags.split('|');
							mirroredFlags.length = flags.length;
							for (i = 0; i < flags.length; i++) {
								index = mirror.indexOf(flags[i]);
								
								if (index !== -1) {
									mirroredFlags[i] = (index & 1) ? mirror[index - 1] : mirror[index + 1];
								} else {
									mirroredFlags[i] = flags[i];
								}
							}
							mirrored.flags = mirroredFlags.join('|');
						}
						if (mirrored.name) {
							if (element[0] <= pivot) {
								mirrored.name += '-right';
							} else {
								mirrored.name += '-left';
							}
						}
					}
					if (reversePoints) {
						return [-(element[2] - pivot * 2), element[3], -(element[0] - pivot * 2), element[1], mirrored];
					} else {
						return [-(element[0] - pivot * 2), element[1], -(element[2] - pivot * 2), element[3], mirrored];
					}
				},
				compileAnimations = (function () {
					var compute = {
							linear: function (frame, frames) {
								frames.push(this.movetype, frame / this.duration);
							}
						},
						evtStruct = function (eventData, stage) {
							return {
								time: eventData[0],
								duration: eventData[1],
								target: eventData[2],
								targetElement: !isNaN(eventData[2]) ? stage.elements[eventData[2]] : stage.named[eventData[2]],
								movetype: eventData[3],
								smooth: compute[eventData[4]],
								dx: eventData[5],
								dy: eventData[6]
							};
						};
					return function (stage) {
						var index,
							animations = stage.animations,
							animation,
							currentEvents,
							eventsComputing,
							eventIndex,
							events,
							numEvents,
							frames,
							frame,
							writeIndex,
							i,
							f;
						for (index = 0; index < animations.length; index++) {
							animation = animations[index];
							currentEvents = [];
							eventsComputing = false;
							eventIndex = 0;
							events = animation.events;
							numEvents = events.length;
							//set up animation object for compiled frame data
							animation.frames = [];
							animation.frame = 0;
							animation.frameIndex = 0;
							frames = animation.frames;
							frame = 0;
							writeIndex = 0;
							while (eventsComputing || eventIndex <= numEvents) {
								if (frame === events[eventIndex].time) {
									currentEvents.append(evtStruct(events[eventIndex], stage));
									eventIndex++;
								} else {
									for (i = 0; i < currentEvents.length; i++) {
										f = frame - currentEvents[i].time;
										if (f < currentEvents[i].duration) {
											console.log('compiling frame ' + f);
											
										}
									}
									frame++;
								}
							}
						}
						stage.compiled = true;
					}
				}()),
				stageConstructor = function Stage(stageData) {
					var i, l, elements, mirrored;
					this.animatedFrame = 0;
					this.elements = [];
					this.anchors = [];
					this.spawns = [];
					this.named = {};
					this.animations = [];
					this.blastLeft = 0;
					this.blastRight = 0;
					this.blastTop = 0;
					this.blastBottom = 0;
					this.adjust = true;
					if (stageData) {
						this.anchors = stageData.anchors;
						this.spawns = stageData.spawns;
						this.entrances = stageData.entrances;
						this.symmetric = stageData.symmetric;
						this.pivot = stageData.pivot;
						if (stageData.elements) {
							elements = stageData.elements;
							for (i = 0, l = elements.length; i < l; i++) {
								if (elements[i].length === 5) {
									this.addElement(new StageElement(elements[i][0], elements[i][1], elements[i][2], elements[i][3], elements[i][4]));
								} else if (elements[i].length === 3 && this.symmetric) {
									this.addElement(new StageElement(elements[i][0], elements[i][1], -(elements[i][0] - this.pivot * 2), elements[i][1], elements[i][2]));
								} else {
									dbg.log('error adding stage piece');
									console.log('error adding stage piece', elements[i]);
								}
								if (this.symmetric && !elements[i][5]) {
									if ((elements[i][0] <= this.pivot && elements[i][2] <= this.pivot) || (elements[i][0] >= this.pivot && elements[i][2] >= this.pivot)) {
										mirrored = mirrorElement(elements[i], this.pivot);
										this.addElement(new StageElement(mirrored[0], mirrored[1], mirrored[2], mirrored[3], mirrored[4]));
									}
								}
							}
						}
						if (stageData.handler) {
							this.handler = stageData.handler;
						} else if (stageData.initHandler) {
							this.handler = stageData.initHandler();
						}
						if (stageData.animations) {
							this.animations = stageData.animations;
							if (!stageData.compiled) {
								compileAnimations(this);
							}
						}
					} else {
						
					}
				},
				blastRoomLeft = 1750,
				blastRoomRight = 1750,
				blastRoomTop = 1000,
				blastRoomBottom = 700;
			stageConstructor.blastRoomLeft = blastRoomLeft;
			stageConstructor.blastRoomRight = blastRoomRight;
			stageConstructor.blastRoomTop = blastRoomTop;
			stageConstructor.blastRoomBottom = blastRoomBottom;
			stageConstructor.prototype.recalculateBlastZone = function (element) {
				if (element) {
					if (element.x < this.blastLeft + blastRoomLeft) {
						this.blastLeft = element.x - blastRoomLeft;
					}
					if (element.x2 > this.blastRight - blastRoomRight) {
						this.blastRight = element.x2 + blastRoomRight;
					}
					if (element.y < this.blastTop + blastRoomTop) {
						this.blastTop = element.y - blastRoomTop;
					}
					if (element.y > this.blastBottom - blastRoomBottom) {
						this.blastBottom = element.y + blastRoomBottom;
					}
					if (element.y2 < this.blastTop + blastRoomTop) {
						this.blastTop = element.y2 - blastRoomTop;
					}
					if (element.y2 > this.blastBottom - blastRoomBottom) {
						this.blastBottom = element.y2 + blastRoomBottom;
					}
				} else {
				}
			};
			stageConstructor.prototype.addElement = function (element) {
				this.elements.push(element);
				if (element.name) {
					this.named[name] = element;
				}
				if (this.adjust) {
					this.recalculateBlastZone(element);
				}
			};
			stageConstructor.prototype.traceDown = function (entity) {
				var i = this.elements.length,
					collided = false,
					nearest = false,
					hovering = false,
					nearestD = -1;
				while (i--) {
					if (this.elements[i].top && this.elements[i].crossPlaneDown(entity.lx, entity.ly, entity.x, entity.y)) {
						//if (this.elements[i].downCollide(entity.lx, entity.ly, entity.x, entity.y)) {
						//console.log('crossed', this.elements[i]);
						dbg.log('crossed');
						if (this.elements[i].intersects(entity.lx, entity.ly, entity.x, entity.y)) {
							dbg.log('intersected');
							collided = this.elements[i].yAt(entity.x);
							entity.platform = this.elements[i];
						}
					}
					if (entity.y < this.elements[i].yAt(entity.x) && entity.x >= this.elements[i].x && entity.x <= this.elements[i].x2) {
						if ((nearestD < 0 && this.elements[i].yAt(entity.x) - entity.y > 0) || this.elements[i].yAt(entity.x) - entity.y < nearestD) {
							nearestD = this.elements[i].yAt(entity.x) - entity.y;
							nearest = this.elements[i];
							hovering = true;
						}
					}
				}
				entity.hover = hovering && nearest;
				return collided;
			};
			stageConstructor.prototype.traceUp = function (entity) {
				var i = this.elements.length,
					at = entity.y + entity.height,
					found = false;
				while (i--) {
					if (this.elements[i].bottom && this.elements[i].crossPlaneUp(entity.lx, entity.ly + entity.height, entity.x, entity.y + entity.height)) {
						//if (this.elements[i].upCollide(entity.lx, entity.ly + entity.height, entity.x, entity.y + entity.height)) {
						if (this.elements[i].intersects(entity.lx, entity.ly + entity.height, entity.x, entity.y + entity.height)) {
							at = Math.max(at, this.elements[i].yAt(entity.x));
							found = true;
						}
					}
				}
				return found && at;
			};
			stageConstructor.prototype.traceLeft = function (entity) {
				var i = this.elements.length,
					at = entity.x,
					found = false,
					dx,
					dy;
				while (i--) {
					if ((entity.airborne || this.elements[i].grounded) && this.elements[i].right && this.elements[i].crossPlaneLeft(entity.lx, entity.ly, entity.x, entity.y, entity.height)) {
						/*if (this.elements[i].intersects(entity.lx, entity.ly, entity.x, entity.y)) {
							at = this.elements[i].xAt(entity.y);
						}
						if (this.elements[i].intersects(entity.lx, entity.ly + entity.height, entity.x, entity.y + entity.height)) {
							at = at !== false ? Math.min(at, this.elements[i].xAt(entity.y + entity.height)) : this.elements[i].xAt(entity.y + entity.height);
						}*/
						if (this.elements[i].rightCollide(entity.lx, entity.ly, entity.x, entity.y)) {
							at = Math.max(at, this.elements[i].xAt(entity.y));
							found = true;
						}
						if (this.elements[i].rightCollide(entity.lx, entity.ly + entity.height, entity.x, entity.y + entity.height)) {
							at = Math.max(at, this.elements[i].xAt(entity.y + entity.height));
							found = true;
						}
						dx = entity.x - entity.lx;
						dy = entity.y - entity.ly;
						/*if (at === false) {
							if (entity.x > this.elements[i].x && entity.x < this.elements[i].x2) {
								if (entity.y + entity.height < this.elements[i].minY) {
									return this.elements[i].minYX;
								}
							}
						}
						if (at !== false) {
							return at;
						}*/
						if (segIntersects(entity.lx, entity.ly, entity.lx, entity.ly + entity.height, this.elements[i].x, this.elements[i].y, this.elements[i].x - dx, this.elements[i].y - dy)) {
							at = Math.max(at, this.elements[i].x);
							found = true;
						}
						if (segIntersects(entity.lx, entity.ly, entity.lx, entity.ly + entity.height, this.elements[i].x2, this.elements[i].y2, this.elements[i].x2 - dx, this.elements[i].y2 - dy)) {
							at = Math.max(at, this.elements[i].x2);
							found = true;
						}
					}
				}
				return found && at;
			};
			stageConstructor.prototype.traceRight = function (entity) {
				var i = this.elements.length,
					at = entity.x,
					found = false,
					dx,
					dy;
				while (i--) {
					if ((entity.airborne || this.elements[i].grounded) && this.elements[i].left && this.elements[i].crossPlaneRight(entity.lx, entity.ly, entity.x, entity.y, entity.height)) {
						dbg.log('crossed plane right');
						/*if (this.elements[i].intersects(entity.lx, entity.ly, entity.x, entity.y)) {
							at = this.elements[i].xAt(entity.y);
							//return this.elements[i].xAt(entity.y);
						}
						if (this.elements[i].intersects(entity.lx, entity.ly + entity.height, entity.x, entity.y + entity.height)) {
							//return this.elements[i].xAt(entity.y + entity.height);
							return at !== false ? Math.min(at, this.elements[i].xAt(entity.y + entity.height)) : this.elements[i].xAt(entity.y + entity.height);
						}*/
						if (this.elements[i].leftCollide(entity.lx, entity.ly, entity.x, entity.y)) {
							at = Math.min(at, this.elements[i].xAt(entity.y));
							found = true;
							//return this.elements[i].xAt(entity.y);
						}
						if (this.elements[i].leftCollide(entity.lx, entity.ly + entity.height, entity.x, entity.y + entity.height)) {
							//return this.elements[i].xAt(entity.y + entity.height);
							at = Math.min(at, this.elements[i].xAt(entity.y + entity.height));
							found = true;
						}
						dx = entity.x - entity.lx;
						dy = entity.y - entity.ly;
						if (segIntersects(entity.lx, entity.ly, entity.lx, entity.ly + entity.height, this.elements[i].x, this.elements[i].y, this.elements[i].x - dx, this.elements[i].y - dy)) {
							at = Math.min(at, this.elements[i].x);
							found = true;
						}
						if (segIntersects(entity.lx, entity.ly, entity.lx, entity.ly + entity.height, this.elements[i].x2, this.elements[i].y2, this.elements[i].x2 - dx, this.elements[i].y2 - dy)) {
							at = Math.min(at, this.elements[i].x2);
							found = true;
						}
						/*if (at === false) {
							if (entity.x > this.elements[i].x && entity.x < this.elements[i].x2) {
								if (entity.y + entity.height < this.elements[i].minY) {
									return this.elements[i].minYX;
								}
							}
						}*/
					}
				}
				return found && at;
			};
			stageConstructor.prototype.findPlatformLeft = function (x, y) {
				var i = this.elements.length;
				while (i--) {
					if (this.elements[i].x === x && this.elements[i].y === y && this.elements[i].top) {
						return this.elements[i];
					}
				}
				return false;
			};
			stageConstructor.prototype.findPlatformRight = function (x, y) {
				var i = this.elements.length;
				while (i--) {
					if (this.elements[i].x2 === x && this.elements[i].y2 === y && this.elements[i].top) {
						return this.elements[i];
					}
				}
				return false;
			};
			stageConstructor.prototype.act = function () {
				var i = this.elements.length;
				while (i--) {
					if (this.elements[i].leftOccupied) {
						this.elements[i].leftOccupied--;
					}
					if (this.elements[i].rightOccupied) {
						this.elements[i].rightOccupied--;
					}
					if (this.elements[i].handler) {
						this.elements[i].handler();
					}
				}
				i = this.animations.length;
				while (i--) {
					if (this.animations[i].enabled) {
						//if (this.animations[i].frame === this.animations[i].frames[
					}
				}
			};
			return stageConstructor;
		}()),
		stages = [
			{
				name: "Not A Cloud",
				anchors: [275, -450, 0.8, -50, 1, 0.4, 600, 1, 0.4, 275, 180, 0.5],
				entrances: [-100, 0, true, 650, 0, false],
				spawns: [275, -300],
				elements: [
					[160, 180, 390, 180, {flags: 'leftGrabbable|rightGrabbable|top|fastGrab', name: 'mover', initHandler: function () {
						var yMin = 120,
							yMax = 120,
							xMin = -480,
							xMax = 800,
							diff = 5;
						this.dx = diff;
						return function () {
							if (!this.pause) {
								this.x += this.dx;
								this.x2 += this.dx;
								if (this.x >= xMax) {
									this.updx = -diff;
									this.dx = 0;
									this.pause = 60;
									this.x2 += this.x - xMax;
									this.x = xMax;
								}
								if (this.x <= xMin) {
									this.updx = diff;
									this.dx = 0;
									this.pause = 60;
									this.x2 += this.x - xMin;
									this.x = xMin;
								}
							} else {
								this.pause--;
								if (this.pause === 0) {
									this.dx = this.updx;
								}
							}
						};
					}}],
					[160, -220, 390, -220, {flags: 'top'}],
					[-150, 1, 700, 1, {flags: 'leftGrabbable|rightGrabbable|top|solid'}],
					[-100, -110, 150, -110, {flags: 'top'}],
					[400, -110, 650, -110, {flags: 'top'}],
					[-150, 1, -150, 20, {flags: 'left|solid'}],
					[-150, 20, -100, 100, {flags: 'left|solid'}],
					//[-100, 100, -100, 300, {flags: 'left|grounded'}],
					[700, 20, 700, 1, {flags: 'right|solid'}],
					[650, 100, 700, 20, {flags: 'right|solid'}],
					//[650, 100, 650, 300, {flags: 'right|grounded'}],
					[-101, 100, 651, 100, {flags: 'bottom|solid'}]
					//[-101, 300, 651, 300, {flags: 'bottom|solid'}]
				]
			},
			{
				name: "Flattlebeeld",
				anchors: [275, -450, 0.8, -50, 1, 0.4, 600, 1, 0.4, 275, 100, 0.5],
				entrances: [-100, 0, true, 650, 0, false],
				spawns: [275, -300],
				symmetric: true,
				pivot: 275,
				elements: [
					[160, -220, 390, -220, {flags: 'top'}],
					[-150, 1, 700, 1, {flags: 'leftGrabbable|rightGrabbable|top|solid'}],
					[-100, -110, 150, -110, {flags: 'top'}],
					[-150, 1, -150, 20, {flags: 'left|solid'}],
					[-150, 20, -100, 100, {flags: 'left|solid'}],
					[-101, 100, 651, 100, {flags: 'bottom|solid'}]
				]
			},
			{
				name: "Longboat",
				anchors: [275, -250, 0.8, -50, 1, 0.4, 600, 1, 0.4, 275, 50, 0.5],
				entrances: [-200, 0, true, 750, 0, false],
				spawns: [275, -300],
				symmetric: true,
				pivot: 275,
				elements: [
					[-350, 1, 900, 1, {flags: 'leftGrabbable|rightGrabbable|top|solid'}],
					[-350, 1, -350, 100, {flags: 'left|solid'}],
					[-350, 100, -250, 300, {flags: 'left|solid'}],
					[-251, 300, 801, 300, {flags: 'bottom|solid'}]
				]
			},
			{
				name: "Pillars",
				anchors: [275, -450, 0.8, -150, 1, 0.4, 700, 1, 0.4, 275, 100, 0.5],
				entrances: [-150, 0, true, 700, 0, false],
				spawns: [275, -300],
				symmetric: true,
				pivot: 275,
				elements: [
					[130, -200, 420, -200, {flags: 'top'}],
					[-200, 1, 150, 1, {flags: 'top|solid|leftGrabbable|rightGrabbable'}],
					[-200, 1, -200, 20, {flags: 'left|solid'}],
					[-200, 20, 50, 100, {flags: 'bottom|solid'}],
					[50, 100, 50, 600, {flags: 'left|solid'}],
					[50, 600, 150, 600, {flags: 'bottom'}],
					[150, 1, 150, 600, {flags: 'right|solid'}]
				]
			},
			{
				name: "Great White",
				anchors: [275, -450, 0.8, -150, 1, 0.4, 700, 1, 0.4, 275, 100, 0.5],
				entrances: [-75, 0, true, 625, 0, false],
				spawns: [275, -300],
				symmetric: true,
				pivot: 275,
				elements: [
					[130, -125, {flags: 'top'}],
					[-100, 1, 75, 1, {flags: 'top|solid|leftGrabbable'}],
					[75, 1, 200, 30, {flags: 'top|solid'}],
					[-100, 1, -100, 40, {flags: 'left|solid'}],
					[-100, 40, 50, 75, {flags: 'bottom|solid'}],
					[50, 75, 200, 30, {flags: 'bottom'}],
					[200, 30, {flags: 'top|solid|bottomless'}]
				]
			},
			{
				name: "Confused Duck",
				anchors: [275, -450, 0.8, -50, 1, 0.4, 600, 1, 0.4, 275, 100, 0.5],
				entrances: [-100, -101, true, 650, -101, false],
				spawns: [275, -300],
				symmetric: true,
				pivot: 275,
				elements: [
					[100, -240, {flags: 'top'}],
					[-200, -100, 0, -100, {flags: 'top'}],
					[-180, 20, -100, 1, {flags: 'leftGrabbable|top|solid'}],
					[-180, 20, -180, 120, {flags: 'left|solid'}],
					[-180, 120, -150, 200, {flags: 'left|solid'}],
					[-150, 200, {flags: 'bottom'}],
					[-100, 1, {flags: 'top|solid'}]
				]
			},
			{
				name: "Low-fat Gravy",
				anchors: [275, -450, 0.8, -50, 1, 0.4, 600, 1, 0.4, 275, 100, 0.5],
				entrances: [-200, 0, true, 750, 0, false],
				spawns: [275, -300],
				symmetric: true,
				pivot: 275,
				elements: [
					[-350, 1, 900, 1, {flags: 'leftGrabbable|rightGrabbable|top|solid'}],
					[-150, -140, 50, -140, {flags: 'top'}],
					[-350, 1, -350, 10, {flags: 'left|solid'}],
					[-350, 10, -250, 100, {flags: 'left|solid'}],
					[-250, 100, 0, 100, {flags: 'bottom|solid'}],
					[0, 99, 275, 200, {flags: 'bottom|solid'}]
				]
			},
			{
				name: "Divided",
				anchors: [275, -450, 0.8, -50, 1, 0.4, 600, 1, 0.4, 275, 100, 0.5],
				entrances: [-100, 0, true, 650, 0, false],
				spawns: [275, -300],
				symmetric: true,
				pivot: 275,
				elements: [
					[-150, 1, 75, 1, {flags: 'leftGrabbable|top|solid'}],
					[75, 1, 150, -40, {flags: 'top|solid'}],
					[150, -40, {flags: 'top|solid'}],
					[-200, -140, 50, -140, {flags: 'top'}],
					//[200, -180, {flags: 'top'}],
					[-150, 1, -150, 20, {flags: 'left|solid'}],
					[-150, 20, -100, 100, {flags: 'left|solid'}],
					[-101, 100, 651, 100, {flags: 'bottom|solid'}]
				]
			},
			{
				name: "Has Wall Bugs",
				anchors: [275, -450, 0.8, -50, 1, 0.4, 600, 1, 0.4, 275, 100, 0.5],
				entrances: [-100, 0, true, 650, 0, false],
				spawns: [275, -300],
				symmetric: true,
				pivot: 275,
				elements: [
					[-200, -200, -200, -400, {flags: 'right|grounded'}],
					[-200, -200, -80, -160, {flags: 'top'}],
					[-80, -160, -80, -100, {flags: 'right'}],
					[200, 1, 200, -40, {flags: 'left|grounded'}],
					[200, -40, {flags: 'top|solid'}],
					[-150, 1, {flags: 'leftGrabbable|rightGrabbable|top|solid'}],
					[-150, 1, -150, 3, {flags: 'left|solid'}],
					[-150, 3, -140, 6, {flags: 'left|solid'}],
					[-140, 6, {flags: 'bottom|solid'}],
					[-150, 151, {flags: 'leftGrabbable|rightGrabbable|top|solid'}],
					[-150, 151, -140, 156, {flags: 'left|solid'}],
					[-140, 156, {flags: 'bottom|solid'}]
				]
			},
			{
				name: "Satellite",
				anchors: [275, -450, 0.8, -50, 1, 0.4, 600, 1, 0.4, 275, 100, 0.5],
				entrances: [-200, -101, true, 700, -101, false],
				spawns: [275, -300],
				symmetric: true,
				pivot: 275,
				elements: [
					[-340, -100, -260, -100, {flags: 'leftGrabbable|solid|top'}],
					[-340, -100, -340, -80, {flags: 'left'}],
					[-340, -80, -320, -30, {flags: 'left'}],
					[-320, -30, -270, -30, {flags: 'bottom'}],
					[-270, -30, -260, -80, {flags: 'right'}],
					[-260, -100, -260, -80, {flags: 'right'}],
					[-260, -100, -100, -100, {flags: 'top'}],
					[-70, 1, {flags: 'leftGrabbable|rightGrabbable|top|solid'}],
					[-70, 1, -70, 40, {flags: 'left|solid'}],
					[-70, 40, -30, 200, {flags: 'left|solid'}],
					[-30, 200, {flags: 'bottom|solid'}]
				]
			}
		],
		environment = [],
		Animation = (function () {
			var defaultAnimation = 'idle',
				defaultAirborne = 'airborne',
				animationData = (function () {
					var data = [],
						i,
						l = data.length,
						key,
						keys,
						bubble,
						bubbles,
						args = hitbubbleData.fileArgs;
					for (i = 0; i < l; i++) {
						keys = data[i].keyframes.length;
						for (key = 0; key < keys; key++) {
							bubbles = data[i].keyframes[key].hurtbubbles.length;
							for (bubble = 1; bubble < bubbles; bubble += 4) {
								data[i].keyframes[key].hurtbubbles[bubble] = -data[i].keyframes[key].hurtbubbles[bubble];
							}
							if (data[i].keyframes[key].hitbubbles) {
								bubbles = data[i].keyframes[key].hitbubbles.length;
								for (bubble = 2; bubble < bubbles; bubble += args) {
									data[i].keyframes[key].hitbubbles[bubble] = -data[i].keyframes[key].hitbubbles[bubble];
								}
							}
						}
					}
					return data;
				}()),
				animationCache = [],
				linear = function (frame1, frame2, fraction) {
					var i,
						l = frame1.length,
						between = [];
					between.length = l;
					for (i = 0; i < l; i++) {
						if (i % 4 !== 3) { // don't tween types
							between[i] = ((frame2[i] - frame1[i]) * fraction + frame1[i]);
						} else {
							between[i] = frame1[i];
						}
					}
					return between;
				},
				arc = function (frame1, frame2, fraction, tween) {
					var i,
						l = frame1.length,
						between = [],
						x, y,
						angle,
						distance,
						centerX = tween.centerX,
						centerY = -tween.centerY,
						angledelta = fraction * tween.arc;
					between.length = l;
					for (i = 0; i < l; i++) {
						if (i % 4 === 2) { // linear tween for radius if there is data in the next frame
							if (frame2) {
								between[i] = ((frame2[i] - frame1[i]) * fraction + frame1[i]);
							} else {
								between[i] = frame1[i];
							}
						} else if (i % 4 === 3) { // don't tween types
							if (fraction !== 1 || !frame2) {
								between[i] = frame1[i];
							} else { // if it's 100%, use next frame's type
								between[i] = frame2[i];
							}
						} else if (i % 4 === 0) {
							//x arc tween
							x = centerX - frame1[i];
							y = centerY - frame1[i + 1];
							angle = (Math.PI + Math.atan2(y, x)) / pi2 + angledelta;
							distance = Math.sqrt(x * x + y * y);
							between[i] = Math.cos(angle * pi2) * distance + centerX;
							//between[i] = ((frame2[i] - frame1[i]) * fraction + frame1[i]);
						} else if (i % 4 === 1) {
							//y arc tween
							between[i] = -Math.sin(angle * pi2) * distance + centerY;
							//angle = (Math.PI + Math.atan2(frame1[i], dx)) / pi2 + angledelta;
							//between[i] = ((frame2[i] - frame1[i]) * fraction + frame1[i]);
						}
					}
					return between;
				},
				precomputeAnimation = function (animation) {
					var animationArray = [],
						i,
						next = 0,
						index = 0,
						keyframes = animation.keyframes,
						l = keyframes.length - 1,
						midframe = 0,
						keyframe,
						hurtbubbles,
						tweenfrom,
						tweento,
						nextframe,
						fulllength = 0,
						keyframeLength = 0,
						duration = 0,
						tween,
						tweendata,
						tweenframes,
						interpolatedTween;
					for (i = 0; i < l; i++) {
						keyframe = keyframes[i];
						duration += keyframes[i].duration;
						if (keyframe.hurtbubbles) {
							hurtbubbles = keyframe.hurtbubbles;
							fulllength = keyframe.duration;
							tweenfrom = 0;
							next = i + 1;
							nextframe = keyframes[next];
							tweendata = keyframe.tween;
							if (!tweendata) {
								if (tween !== linear) {
									tween = linear;
									interpolatedTween = false;
								}
								while (!nextframe.hurtbubbles) {
									fulllength += nextframe.duration;
									next++;
									nextframe = keyframes[next];
								}
							} else {
								if (tweendata.type === 'arc') {
									tween = arc;
									interpolatedTween = true;
								}
								tweenframes = (tweendata.frames || 1) - 1;
								while (tweenframes--) {
									fulllength += nextframe.duration;
									next++;
									nextframe = keyframes[next];
								}
								console.log(fulllength);
							}
						} else {
							tweenfrom += keyframeLength;
						}
						keyframeLength = keyframe.duration;
						for (midframe = 0; midframe < keyframeLength; midframe++) {
							animationArray[index] = tween(hurtbubbles, nextframe.hurtbubbles, (midframe + tweenfrom) / fulllength, tweendata);
							index++;
						}
						if (interpolatedTween && keyframes[i + 1] === nextframe) {
							keyframes[i + 1].hurtbubbles = tween(hurtbubbles, nextframe.hurtbubbles, (midframe + tweenfrom) / fulllength, tweendata);
						}
					}
					animation.duration = duration;
					animation.frames = animationArray;
					return animationArray;
				},
				animationConstructor = function Animation(entity, animation) {
					var i;
					this.entity = entity;
					this.keyframe = 0;
					this.frame = 0;
					this.midframe = 0;
					this.ticks = 1;
					this.repeated = 0;
					this.continued = false;
					this.frames = animation.frames || precomputeAnimation(animation);
					for (i in animation) {
						if (animation.hasOwnProperty(i) && !this.hasOwnProperty(i)) {
							this[i] = animation[i];
						}
					}
					if (!this.cancellable && this.cancellable !== '') {
						this.cancellable = '';
						console.log('warning: no cancellable value', this.name, this);
					}
					this.keyframeData = this.keyframes[this.keyframe];
					this.frameDuration = this.keyframeData.duration;
					this.freshKeyframe = true;
				},
				setBubbles = function (entity, frame, keyframe) {
					var i,
						l = Math.min(frame.length / 4, entity.hurtbubbleCount),
						index,
						args = hitbubbleData.fileArgs,
						hbs;
					for (i = 0; i < l; i++) {
						index = i * 4;
						entity.hurtbubbles[i].x = entity.facing ? frame[index] : -frame[index];
						entity.hurtbubbles[i].y = frame[index + 1];
						entity.hurtbubbles[i].radius = frame[index + 2];
						entity.hurtbubbles[i].type = frame[index + 3];
					}
					hbs = keyframe.hitbubbles;
					l = ((hbs && hbs.length) || 0) / args;
					for (i = 0; i < l; i++) {
						index = i * args;
						addHitbubble(
							entity.index,
							hbs[index],
							entity.x + (entity.facing ? hbs[index + 1] : -hbs[index + 1]),
							entity.y + hbs[index + 2],
							hbs[index + 3],
							entity.facing ? (hbs[index + 4] | 1) : hbs[index + 4],
							hbs[index + 5],
							hbs[index + 6],
							hbs[index + 7],
							hbs[index + 8],
							hbs[index + 9],
							hbs[index + 10],
							hbs[index + 11],
							hbs[index + 12],
							hbs[index + 13],
							hbs[index + 14],
							hbs[index + 15],
							hbs[index + 16],
							hbs[index + 17]
						);
					}
				},
				defaultHandlers = {
					brake: function (entity) {
						entity.dx *= entity.animations[entity.animation].brake;
						entity.slide *= entity.animations[entity.animation].brake;
						entity.dy *= entity.animations[entity.animation].brake;
					},
					stop: function (entity) {
						entity.dx = 0;
						entity.dy = 0;
						entity.slide = 0;
					},
					remove: function (entity) {
						entity.removed = true;
					},
					stunned: function (entity) {
						if (entity.stun <= 0) {
							entity.setAnimation('tumble', true);
						}
					},
					meteor: function (entity) {
						if (entity.stun <= 0) {
							entity.setAnimation('tumble', true);
						}
					},
					stumble: function (entity) {
						if (entity.stun <= 0) {
							entity.setAnimation('idle', true);
						}
					},
					setAnimation: function (entity) {
						entity.setAnimation(entity.animations[entity.animation].setAnimation, true);
					},
					pivot: function (entity) {
						entity.facing = !entity.facing;
					}
				},
				defaultStart = {
					airdodge: function (entity, controller) {
						var computedAngle = preciseAngle(controller.hmove, controller.vmove);
						if (!entity.airborne) {
							entity.airborne = true;
							entity.hover = entity.platform;
						}
						entity.dx = -computedAngle[0] * entity.animations[entity.animation].airdodgeSpeed;
						entity.dy = computedAngle[1] * entity.animations[entity.animation].airdodgeSpeed;
						//console.log(entity.hover, entity.hover.yAt(entity.x) - entity.y < 20, entity.dy <= 0.1);
						if (entity.hover && entity.hover.yAt(entity.x) - entity.y < 20 && entity.dy <= 1) {
							//entity.ly = Math.max(entity.y, entity.ly);
							dbg.log('wavedash');
							entity.y = entity.hover.yAt(entity.x) - 1;
							entity.dy = Math.min(entity.dy, -5);
							//entity.ly += entity.dy;
						}
					},
					grab: function (entity) {
						if (entity.lastCollision.entity.animation !== entity.animations[entity.animation].heldAnimation) {
							entity.lastCollision.entity.setAnimation(entity.animations[entity.animation].heldAnimation, true);
							entity.lastCollision.entity.facing = !entity.facing;
							entity.lastCollision.entity.lag = 0;
							entity.lastCollision.entity.stun = 0;
							entity.lastCollision.entity.dx = 0;
							entity.lastCollision.entity.dy = 0;
							entity.lastCollision.entity.slide = 0;
						}
					},
					powershield: function (entity, controller) {
						Effects.powershield(entity, 2, 30, 30, 30);
						if (controller.rright) {
							if (!entity.facing) {
								return 'dodgeback';
							} else {
								entity.facing = false;
								return 'dodgeforth';
							}
						} else if (controller.rleft) {
							if (entity.facing) {
								return 'dodgeback';
							} else {
								entity.facing = true;
								return 'dodgeforth';
							}
						} else if (controller.rdown) {
							return 'spotdodge';
						} else if (controller.rup) {
							return 'hop';
						}
					},
					shield: function (entity) {
						entity.shieldVal = entity.controller.shield;
						Effects.shield(entity, 2, 30, 15, 20, 10);
						
					},
					release: function (entity) {
						entity.held.dx = entity.dx;
						entity.held.dy = entity.dy;
						entity.held.slide = entity.slide;
						entity.held.setAnimation(!entity.held.airborne ? 'idle' : 'airborne', true);
					},
					ledgegrab: function (entity) {
						if (!this.ledgestall && !entity.invulnerable) {
							entity.invulnerable = 45;
						}
						entity.grabbedOn = frame;
						playAudio('ledgegrab');
						entity.ledgeHang = entity.facing;
						if (entity.ledgeHang) {
							entity.platform.leftOccupied = 2;
						} else {
							entity.platform.rightOccupied = 2;
						}
					},
					respawn: function (entity) {
						Effects.respawn(entity);
					},
					pivot: function (entity) {
						entity.facing = -entity.facing;
					}
				},
				defaultHandler = {
					charge: function (entity, controller, animation) {
						entity.animations[animation.release].charged = (animation.frame - 1) / (animation.frameDuration - 2);
						if (animation.frame % 18 === 2) {
							entity.flash = 2;
						}
						//dbg.log('Charging', (animation.frame - 1) / (animation.frameDuration - 2));
						if (!controller.attack && !controller.grab && (animation.type === 1 || animation.type === 2)) {
							entity.setAnimation(animation.release, true);
						} else if (!controller.special && animation.type === 3) {
							entity.setAnimation(animation.release, true);
						}
					},
					dash: function (entity, controller) {
						if (entity.facing) {
							if (controller.hmove < 0) {
								entity.slide -= entity.moonwalk;
							}
						} else {
							if (controller.hmove > 0) {
								entity.slide += entity.moonwalk;
							}
						}
					},
					powershield: function (entity, controller) {
						entity.addHitbubble(7, 2 + controller.hmove * (entity.facing ? 10 : -10), 30 - controller.vmove * 10, 50, 0, entity.color - 2, 0, 0, 0, 0, 0, 0);
					},
					sleepyshield: function (entity, controller) {
						entity.shield = 0;
						entity.addHitbubble(7, 2 + controller.hmove * (entity.facing ? 10 : -10), 30 - controller.vmove * 10, 15 + (1 - entity.shieldVal) * 20 * entity.shield + 10 * entity.shield, 0, entity.color - 2, 0, 0, 0, 0, 0, 0);
						//entity.addHitbubble(7, 2 + controller.hmove * (entity.facing ? 10 : -10), 30 - controller.vmove * 10, (1 - controller.shield) * 15 + 15 + entity.shield * 15, 0, entity.color - 2, 0, 0, 0, 0, 0, 0);
					},
					shield: function (entity, controller) {
						//dbg.log('shield', entity.shield);
						if (entity.stun <= 0) {
							entity.shieldVal = controller.shield;
							entity.shield -= entity.shieldRegen + (entity.shieldDecay * (0.5 + controller.shield));
							if (entity.shield < 0) {
								entity.shield = 0;
								entity.setAnimation('sleepyshield', true);
							} else if (controller.attackPress || controller.grabPress) {
								entity.setAnimation('grab');
							} else if (controller.shield < 0.05) {
								entity.setAnimation('shielddrop');
							} else if ((controller.jump || controller.rup) || (controller.fromneutral && !controller.noTapJump && controller.hardup)) {
								entity.setAnimation('hop', true);
							} else if ((controller.fromneutral && controller.hardright) > 1 || controller.rright === 2) {
								if (!entity.facing) {
									entity.setAnimation('dodgeback');
								} else {
									if (entity.setAnimation('dodgeforth')) {
										entity.facing = false;
									}
								}
							} else if ((controller.fromneutral && controller.hardleft > 1) || controller.rleft === 2) {
								if (entity.facing) {
									entity.setAnimation('dodgeback');
								} else {
									if (entity.setAnimation('dodgeforth')) {
										entity.facing = true;
									}
								}
							} else if ((controller.fromneutral && controller.harddown > 1) || controller.rdown === 2) {
								entity.setAnimation('spotdodge');
							}
						} else {
							entity.shield -= entity.shieldRegen + entity.shieldDecay * 0.5;
						}
						entity.addHitbubble(7, 2 + controller.hmove * (entity.facing ? 10 : -10), 30 - controller.vmove * 10, 15 + (1 - entity.shieldVal) * 20 * entity.shield + 10 * entity.shield, 0, entity.color - 2, 0, 0, 0, 0, 0, 0);
					},
					shieldstun: function (entity, controller) {
						entity.shield -= entity.shieldRegen + (entity.shieldDecay * (0.5 + controller.shield));
						//dbg.log('shield', entity.shield);
						entity.addHitbubble(7, 2 + controller.hmove * (entity.facing ? 10 : -10), 30 - controller.vmove * 10, (1 - controller.shield) * 15 + 15 + entity.shield * 15, 0, 0 + Math.floor(controller.shield * 3), 0, 0, 0, 0, 0, 0);
						
						if (entity.shield < 0) {
							entity.shield = 0;
							entity.setAnimation('sleepyshield', true);
						}
						if (entity.stun <= 0) {
							entity.setAnimation('shield', true);
						}
					},
					fallen: function (entity, controller) {
						if (controller.attackPress || controller.specialPress || controller.grabPress) {
							entity.setAnimation('getup0', true);
						} else if (controller.shieldHardPress || controller.jumpPress) {
							entity.setAnimation('getup');
						} else if ((controller.fromneutral && controller.hardright) || controller.rright) {
							if (entity.facing) {
								entity.setAnimation('rollforth');
							} else {
								entity.setAnimation('rollback');
							}
						} else if ((controller.fromneutral && controller.hardleft) || controller.rleft) {
							if (entity.facing) {
								entity.setAnimation('rollback');
							} else {
								entity.setAnimation('rollforth');
							}
						} else if ((controller.fromneutral && controller.hardup) || controller.rup) {
							entity.setAnimation('getup');
						}
					},
					ledgehang: function (entity, controller) {
						var setOccupied = 2, changed = false;
						if (!this.pause || this.frame > this.pause) {
							if (controller.fromneutral) {
								if (frame > entity.grabbedOn + 600 || controller.down === 2 || (entity.facing && controller.hardleft) || (!entity.facing && controller.hardright)) {
									//entity.x += entity.animations[entity.animation].xOffset * (entity.facing ? 1 : -1);
									//entity.y += entity.animations[entity.animation].yOffset;
									entity.airborne = true;
									if (controller.down === 2) {
										entity.fastfall = true;
									}
									entity.dx = entity.platform.dx;
									entity.dy = entity.platform.dy;
									entity.setAnimation('ledgedrop', true);
									entity.animations[entity.animation].step();
									changed = true;
								} else if ((entity.facing && controller.right === 2) || (!entity.facing && controller.left === 2)) {
									setOccupied = entity.animations['ledgestand'].duration * 0.75 | 0;
									entity.setAnimation('ledgestand', true, true);
									changed = true;
								} else if (controller.up === 2) {
									entity.dx = entity.platform.dx;
									entity.dy = entity.platform.dy;
									setOccupied = entity.animations['ledgehop'].duration * 0.75 | 0;
									entity.setAnimation('ledgehop', true, true);
									changed = true;
								}
							}
							if (changed) {
							} else if (controller.jumpPress) {
								entity.dx = entity.platform.dx;
								entity.dy = entity.platform.dy;
								setOccupied = entity.animations['ledgehop'].duration * 0.75 | 0;
								entity.setAnimation('ledgehop', true, true);
							} else if (controller.shieldHardPress) {
								//console.log(entity.animations['ledgeroll']);
								setOccupied = entity.animations['ledgeroll'].duration * 0.75 | 0;
								entity.setAnimation('ledgeroll', true, true);
							} else if (controller.attackPress || controller.specialPress) {
								setOccupied = entity.animations['ledgeattack0'].duration * 0.75 | 0;
								entity.setAnimation('ledgeattack0', true, true);
							}
						}
						//dbg.log('ocpd', setOccupied);
						if (entity.ledgeHang) {
							if (setOccupied > entity.platform.leftOccupied) {
								entity.platform.leftOccupied = setOccupied;
							}
						} else {
							if (setOccupied > entity.platform.rightOccupied) {
								entity.platform.rightOccupied = setOccupied;
							}
						}
					},
					holding: function (entity, controller, animation) {
						var frame = animation.frame,
							held = entity.held,
							struggleBy = 6;
						if (held.lastInjury.lastFrame && held.lastInjury.entity !== entity) {
							if ((Math.pow(held.dx) + Math.pow(held.dy)) > animation.grabForce) {
								entity.setAnimation('release', true);
							} else {
								held.setAnimation(animation.heldAnimation, true);
							}
						} else {
							if (typeof held.animations[held.animation].pivotx === undef) {
								held.setAnimation(animation.heldAnimation, true);
								//dbg.log('setanim');
							}
							if (typeof held.animations[held.animation].pivotx !== undef) {
								var height = entity.animations[entity.animation].frames[frame][entity.hurtbubbleCount * 4 + 1] + held.animations[held.animation].pivoty,
									ydist = held.y - Math.min(entity.y + height, (!entity.airborne && entity.platform) ? entity.platform.yAt(held.x) : entity.y);
								//held.dx = 0;
								//held.dy = 0;
								held.slide = 0;
								held.facing = !entity.facing;
								//held.x = entity.x + (entity.animations[entity.animation].frames[frame][entity.hurtbubbleCount * 4] + held.animations[held.animation].pivotx) * (entity.facing ? 1 : -1);
								//held.y = Math.min(entity.y + height, (!entity.airborne && entity.platform) ? entity.platform.yAt(held.x) : entity.y);
								//dbg.log('grabbed', Math.abs(ydist), held.height + entity.height, Math.abs(ydist) < held.height + entity.height);
								if (Math.abs(ydist) < Math.abs(held.height + entity.height)) {
									held.dx = entity.x + (entity.animations[entity.animation].frames[frame][entity.hurtbubbleCount * 4] + held.animations[held.animation].pivotx) * (entity.facing ? 1 : -1) - held.x;
									held.dy = ydist;
									if (height < 0 || entity.airborne) {
										held.airborne = true;
									}
								} else {
									entity.struggle = 1000000;
								}
							} else {
							}
							if (controller.attackPress || controller.grabPress) {
								entity.setAnimation('pummel', false, true);
							} else if (controller.fromneutral) {
								if (controller.hardup) {
									entity.setAnimation('uthrow', false, true);
								} else if (controller.harddown) {
									entity.setAnimation('dthrow', false, true);
								} else if (controller.hardleft) {
									if (entity.facing) {
										entity.setAnimation('bthrow', false, true);
									} else {
										entity.setAnimation('fthrow', false, true);
									}
								} else if (controller.hardright) {
									if (entity.facing) {
										entity.setAnimation('fthrow', false, true);
									} else {
										entity.setAnimation('bthrow', false, true);
									}
								}
							}
							entity.struggle++;
							if (entity.held.controller) {
								if (entity.held.controller.hardleft === 6) {
									entity.struggle += struggleBy;
								}
								if (entity.held.controller.hardright === 6) {
									entity.struggle += struggleBy;
								}
								if (entity.held.controller.hardup === 6) {
									entity.struggle += struggleBy;
								}
								if (entity.held.controller.harddown === 6) {
									entity.struggle += struggleBy;
								}
								if (entity.held.controller.rleft === 2) {
									entity.struggle += struggleBy;
								}
								if (entity.held.controller.rright === 2) {
									entity.struggle += struggleBy;
								}
								if (entity.held.controller.rup === 2) {
									entity.struggle += struggleBy;
								}
								if (entity.held.controller.rdown === 2) {
									entity.struggle += struggleBy;
								}
							}
							if (animation.strength >= 0 && entity.struggle > animation.strength + entity.held.damage) {
								entity.held.dx = entity.dx;
								entity.held.dy = entity.dy;
								entity.held.slide = entity.slide;
								entity.held.setAnimation(!entity.held.airborne ? 'released' : 'airreleased', true);
								entity.setAnimation(!entity.held.airborne ? 'release' : 'airrelease', true);
							}
						}
					},
					respawn: function (entity, controller) {
						if (controller.left || controller.right || controller.up || controller.down) {
							entity.setAnimation('airborne', true);
							entity.invulnerable = 120;
						}
					},
					hop: function (entity, controller) {
						if ((controller.hmove || controller.vmove) && controller.shieldHardPress) {
							entity.schedule('airdodge', false, false);
						}
					}
				},
				defaultEnd = {
					respawn: function (entity) {
						entity.invulnerable = 120;
					},
					platformdrop: function (entity) {
						entity.y++;
						entity.ly++;
						entity.dy = 0;
						entity.dx += entity.slide;
						entity.airborne = true;
					}
				},
				defaultCollided = {
					grab: function (entity, controller, animation) {
						entity.held = entity.lastCollision.entity;
						entity.struggle = 0;
						entity.setAnimation(animation.holdingAnimation, true);
					}
				},
				defaultShielded = {
					shield: function (entity, controller, collision) {
						var angle, computedAngle, stun, slide;
						entity.shield -= (collision.damage) / 300 * (1 - controller.shield * 0.25);
						//dbg.log('hit', (collision.damage) / 300);
						//dbg.log('stun', collision.stun);
						entity.lag = collision.lag;
						stun = Math.max((collision.stun - 32) * entity.weight, 0);
						dbg.log(collision.angle);
						slide = collision.knockback * angleX[collision.angle] * (1.1 - controller.shield) * this.shieldbrake;
						if (entity.shield < 0) {
							entity.shield = 0;
							entity.stun = 300;
							entity.setAnimation('stumble', true);
						} else {
							if (controller.left || controller.right || controller.up || controller.down) {
								computedAngle = computeAngle(controller.hmove, -controller.vmove);
								var angle = collision.angle;
								//console.log('angle', angle, computedAngle);
								if (computedAngle >= angle) {
									computedAngle = computedAngle - angle;
									if (255 - computedAngle < computedAngle) {
										computedAngle = -(255 - computedAngle);
									}
								} else {
									computedAngle = angle - computedAngle;
									if (255 - computedAngle < computedAngle) {
										computedAngle = 255 - computedAngle;
									} else {
										computedAngle = -computedAngle;
									}
								}
								//console.log('angle', angle, computedAngle);
								/*if (Math.abs(computedAngle) > 64) {
									if (computedAngle >= 0) {
										computedAngle = 128 - computedAngle;
									} else {
										computedAngle = -128 - computedAngle;
									}
								}
								//console.log('angle', angle, computedAngle);
								angle -= computedAngle * 0.3333;
								angle %= 256;
								if (angle < 0) {
									angle = 255 + angle;
								}
								angle = Math.floor(angle);*/
								if (Math.abs(computedAngle) < 32) {
									stun *= 0.5;
									slide *= 0.5;
								}
								if (Math.abs(computedAngle) > 224) {
									slide *= 1.5;
								}
							}
							entity.stun += stun;
							entity.slide += slide;
							//console.log('computedangle', angle, computedAngle);
						}
					},
					powershield: function (entity, controller, collision) {
						
					}
				},
				defaultInjured = {
				},
				defaultGrabbed = {
					grab: function (entity, controller, animation) {
						entity.held = entity.lastCollision.entity;
						entity.struggle = 0;
						entity.setAnimation(animation.holdingAnimation, true);
					},
					telegrab: function (entity, controller, animation) {
						entity.held = entity.lastCollision.entity;
						entity.y = entity.held.y;
						entity.struggle = 0;
						entity.setAnimation(animation.holdingAnimation, true);
					}
				},
				defaultClashed = {
					
				},
				defaultInterrupted = {
					release: function (entity) {
						entity.held.slide = entity.slide;
						entity.held.dx = 0;
						entity.held.dy = 0;
						entity.held.setAnimation(!entity.held.airborne ? 'released' : 'airreleased', true);
					},
					ledgehit: function (entity) {
						entity.x += this.xOffset * (entity.ledgeHang ? 1 : -1);
						entity.y += this.yOffset;
						entity.phase = true;
					},
					respawn: function (entity) {
						entity.invulnerable = 120;
					}
				},
				defaultCanceled = {
					meteor: function (entity) {
						entity.stunned = 0;
						entity.flash = 8;
						playAudio('meteorcancel');
						console.log('meteor cancel');
					}
				},
				defaultEffect = {
					hop: function (Effects, entity, controller) {
						Effects.skid(entity.x, entity.y - 3, ((controller.left && entity.facing) || (controller.right && !entity.facing) ? 1 : -1) * (entity.dx + entity.slide), entity.dy);
						Effects.skid(entity.x, entity.y - 3, ((controller.left && entity.facing) || (controller.right && !entity.facing) ? 1 : -1) * (entity.dx + entity.slide), entity.dy);
					}
				};
			animationConstructor.precomputeAnimation = precomputeAnimation;
			animationConstructor.prototype.reset = function () {
				this.frame = 0;
				this.midframe = 0;
				this.keyframe = 0;
				this.ticks = 1;
				this.repeated = 0;
				this.continued = false;
				this.hit = false;
				if (!this.keepCollisions) {
					this.entity.collided.length = 0;
				}
				this.keyframeData = this.keyframes[this.keyframe];
				this.frameDuration = this.keyframeData.duration;
				this.freshKeyframe = true;
			};
			animationConstructor.prototype.resetBubbles = function () {
				setBubbles(this.entity, this.frames[this.frame], this.keyframes[this.keyframe]);
			};
			animationConstructor.prototype.step = function () {
				var notEnded = true, transition;
				if (this.entity.lag) {
					this.entity.lag--;
				} else {
					this.frame += this.ticks;
					this.midframe += this.ticks;
				}
				if (this.midframe >= this.frameDuration) {
					//midframe exceeds the number of frames for the current keyframe
					this.midframe -= this.frameDuration;
					this.keyframe++;
					if (this.keyframe >= this.keyframes.length - 1) {
						//no more keyframes, animation ends
						this.end && this.end(this.entity, this.entity.controller, this);
						this.entity.setAnimation(!this.transition ? !this.entity.buffer ? !this.entity.airborne ? defaultAnimation : defaultAirborne : this.entity.buffer : this.transition, true);
						//this.reset(); //redundant?
						if (this.transition === this.name) {
							this.continued = true;
						}
						this.entity.animations[this.entity.animation].step();
						notEnded = false;
					} else {
						//another keyframe left
						this.keyframeData = this.keyframes[this.keyframe];
						this.frameDuration = this.keyframeData.duration;
						this.freshKeyframe = true;
						
					}
				}
				if (notEnded) {
					if (this.freshKeyframe) {
						//fresh key frame
						if (this.keyframe === 0) {
							//first frame
							if (this.start) {
								transition = this.start(this.entity, this.entity.controller, this);
							}
							this.freshStart && !this.continued && this.freshStart(this.entity, this.entity.controller, this);
							if (this.noFastfall) {
								this.entity.fastfall = false;
							}
							if (this.dy) {
								this.entity.dy = this.dy;
							}
							if (this.dx) {
								this.entity.dx = this.entity.facing ? this.dx : -this.dx;
							}
							if (this.slide) {
								this.entity.slide += this.entity.dx;
								this.entity.dx = 0;
							}
						}
						if (this.keyframeData.airjump) {
							this.entity.airjumps++;
						}
						if (this.keyframeData.effect) {
							this.keyframeData.effect(Effects, this.entity, this.entity.controller, this);
						}
						if (this.keyframeData.airborne) {
							if (!isNaN(this.keyframeData.speed)) {
								this.entity.dy = this.keyframeData.speed;
								dbg.log('set speed', this.entity.dy);
							}
							if (!this.entity.airborne) {
								this.entity.airborne = true;
								this.entity.dx += this.entity.slide;
								this.entity.dx += this.entity.platform.dx;
								this.entity.dy += this.entity.platform.dy;
							}
							if (this.keyframeData.jump) {
								if (this.entity.controller && (this.entity.controller.jump || (!this.entity.controller.noTapJump && this.entity.controller.up))) {
									this.entity.dy = this.keyframeData.jumpSpeed;
									dbg.log('set speed', this.entity.dy);
									this.entity.airborne = true;
									this.entity.setAnimation('jump');
								}
							}
							if (this.keyframeData.jumpIn && this.entity.controller) {
								this.entity.controller.jumpIn = this.keyframeData.jumpIn;
								this.entity.controller.jumpSpeed = this.keyframeData.jumpSpeed;
							}
						}
						if (this.keyframeData.audio) {
							playAudio(this.keyframeData.audio);
						}
						this.keyframeData.start && this.keyframeData.start(this.entity, this.entity.controller, this);
						if (this.grabRadius) {
							this.entity.grabRadius = this.grabRadius;
							this.entity.grabXOffset = this.grabXOffset;
							this.entity.grabYOffset = this.grabYOffset;
							this.entity.grabDirections = this.grabDirections;
						} else {
							this.entity.grabRadius = 0;
						}
						if (this.keyframeData.reset) {
							this.entity.collided.length = 0;
						}
						if (this.keyframeData.slide) {
							this.entity.slide = (this.entity.facing ? this.keyframeData.slide : -this.keyframeData.slide);
						}
						if (this.keyframeData.dy) {
							this.entity.dy = this.keyframeData.dy;
						}
						if (this.keyframeData.spawn) {
							this.entity.spawn(this.keyframeData.spawn);
						}
						if (this.keyframeData.upward) {
							this.entity.dy = this.keyframeData.upward;
						}
						if (this.keyframeData.di) {
							if (this.entity.controller.hmove < 0) {
								this.entity.dx = Math.min(this.entity.controller.hmove * this.keyframeData.di, this.entity.dx);
							} else if (this.entity.controller.hmove > 0) {
								this.entity.dx = Math.max(this.entity.controller.hmove * this.keyframeData.di, this.entity.dx);
							}
							this.entity.dy = this.keyframeData.upward;
						}
						if (this.keyframeData.dx) {
							this.entity.dx = this.entity.facing ? this.keyframeData.dx : -this.keyframeData.dx;
						}
						this.freshKeyframe = false;
					}
					if (this.keyframes[this.keyframe].interpolate !== true) {
						setBubbles(this.entity, this.frames[this.frame], this.keyframes[this.keyframe]);
						this.entity.lastframe = this.frames[this.frame];
					} else {
						this.entity.lastinterp = linear(this.entity.lastframe, this.keyframes[this.keyframe].hurtbubbles, this.frame / this.keyframes[this.keyframe].duration);
						setBubbles(this.entity, this.entity.lastinterp, this.keyframes[this.keyframe]);
					}
					if (this.keyframeData.repeat && this.repeated <= this.midframe - this.keyframeData.repeat && this.midframe > 0) {
						this.repeated = this.midframe;
						this.entity.collided.length = 0;
					}
					this.handler && this.handler(this.entity, this.entity.controller, this);
					this.keyframeData.handler && this.keyframeData.handler(this.entity, this.entity.controller, this);
					if ((this.speed || this.keyframeData.speed) && !this.entity.airborne) {
						this.entity.dx = (this.entity.facing ? (this.entity.slide < 0 ? (this.keyframeData.speed || this.speed) : Math.max((this.keyframeData.speed || this.speed) - this.entity.slide, 0)) : (this.entity.slide > 0 ? -(this.keyframeData.speed || this.speed) : Math.min(-(this.keyframeData.speed || this.speed) - this.entity.slide, 0)));
					}
					if (this.slide) {
						this.entity.slide = (this.entity.facing ? this.slide : -this.slide);
					}
					if (transition) {
						this.entity.setAnimation(transition, true);
					}
				}
			};
			animationConstructor.prepareAnimationData = function (data) {
				var i,
					h,
					l = data.length,
					key,
					keys,
					bubble,
					bubbles,
					args = hitbubbleData.fileArgs;
				for (i = 0; i < l; i++) {
					keys = data[i].keyframes.length;
					if (defaultHandlers.hasOwnProperty(data[i].start)) {
						data[i].start = defaultHandlers[data[i].start];
					}
					if (defaultHandlers.hasOwnProperty(data[i].handler)) {
						data[i].handler = defaultHandlers[data[i].handler];
					}
					if (defaultHandlers.hasOwnProperty(data[i].end)) {
						data[i].end = defaultHandlers[data[i].end];
					}
					if (defaultHandlers.hasOwnProperty(data[i].collided)) {
						data[i].collided = defaultHandlers[data[i].collided];
					}
					if (defaultHandlers.hasOwnProperty(data[i].injured)) {
						data[i].injured = defaultHandlers[data[i].injured];
					}
					if (defaultHandlers.hasOwnProperty(data[i].grabbed)) {
						data[i].grabbed = defaultHandlers[data[i].grabbed];
					}
					if (defaultHandlers.hasOwnProperty(data[i].clashed)) {
						data[i].clashed = defaultHandlers[data[i].clashed];
					}
					if (defaultHandlers.hasOwnProperty(data[i].interrupted)) {
						data[i].interrupted = defaultHandlers[data[i].interrupted];
					}

					if (defaultStart.hasOwnProperty(data[i].start)) {
						data[i].start = defaultStart[data[i].start];
					}
					if (defaultStart.hasOwnProperty(data[i].freshStart)) {
						data[i].freshStart = defaultStart[data[i].freshStart];
					}
					if (defaultHandler.hasOwnProperty(data[i].handler)) {
						data[i].handler = defaultHandler[data[i].handler];
					}
					if (defaultEnd.hasOwnProperty(data[i].end)) {
						data[i].end = defaultEnd[data[i].end];
					}
					if (defaultCollided.hasOwnProperty(data[i].collided)) {
						data[i].collided = defaultCollided[data[i].collided];
					}
					if (defaultShielded.hasOwnProperty(data[i].shielded)) {
						data[i].shielded = defaultShielded[data[i].shielded];
					}
					if (defaultInjured.hasOwnProperty(data[i].injured)) {
						data[i].injured = defaultInjured[data[i].injured];
					}
					if (defaultGrabbed.hasOwnProperty(data[i].grabbed)) {
						data[i].grabbed = defaultGrabbed[data[i].grabbed];
					}
					if (defaultClashed.hasOwnProperty(data[i].clashed)) {
						data[i].clashed = defaultClashed[data[i].clashed];
					}
					if (defaultInterrupted.hasOwnProperty(data[i].interrupted)) {
						data[i].interrupted = defaultInterrupted[data[i].interrupted];
					}
					if (defaultEffect.hasOwnProperty(data[i].effect)) {
						data[i].effect = defaultEffect[data[i].effect];
					}
					if (defaultCanceled.hasOwnProperty(data[i].canceled)) {
						data[i].canceled = defaultCanceled[data[i].canceled];
					}

					for (key = 0; key < keys; key++) {
						if (defaultEffect.hasOwnProperty(data[i].keyframes[key].effect)) {
							data[i].keyframes[key].effect = defaultEffect[data[i].keyframes[key].effect];
						}
						if (data[i].keyframes[key].hurtbubbles) {
							bubbles = data[i].keyframes[key].hurtbubbles.length;
							for (bubble = 1; bubble < bubbles; bubble += 4) {
								//flip y values
								data[i].keyframes[key].hurtbubbles[bubble] = -data[i].keyframes[key].hurtbubbles[bubble];
							}
						}
						if (data[i].keyframes[key].hitbubbles) {
							bubbles = data[i].keyframes[key].hitbubbles.length;
							for (bubble = 0; bubble < bubbles; bubble += args) {
								//flip y values
								data[i].keyframes[key].hitbubbles[bubble + 2] = -data[i].keyframes[key].hitbubbles[bubble + 2];
								//allow for quarter values, later divided by 4, stored in memory using unsigned integers
								data[i].keyframes[key].hitbubbles[bubble + 6] *= 4;
								data[i].keyframes[key].hitbubbles[bubble + 7] *= 4;
								data[i].keyframes[key].hitbubbles[bubble + 8] *= 4;
							}
						}
					}
				}
			};
			return animationConstructor;
		}()),
		characterData = (function () {
			var addHurtbubbles = function (entity, count) {
					while (count--) {
						entity.hurtbubbles.push(new Hurtbubble(entity));
					}
				},
				addAnimations = function (character, entity) {
					var anims = character.animations,
						i,
						l = anims.length,
						animation;
					for (i = 0; i < l; i++) {
						animation = new Animation(entity, anims[i]);
						entity.animations[animation.name] = animation;
					}
				},
				characters = {},
				copyAttributes = function (character, entity) {
					addHurtbubbles(entity, character.hurtbubbles);
					addAnimations(character, entity);
					//animation counter
					var i = 0, l;
					for (l in entity.animations) {
						if (entity.animations.hasOwnProperty(l)) {
							i++;
						}
					}
					dbg.log('animations loaded ' + character.name, i);

					entity.color = ((character.color >= 0) ? character.color : 254);
					entity.maxFallSpeed = character.maxFallSpeed;
					entity.hurtbubbleCount = character.hurtbubbles;
					entity.arcSpeed = character.arcSpeed;
					entity.fallSpeed = character.fallSpeed;
					entity.fastfallSpeed = character.fastfallSpeed;
					entity.aerodynamics = character.aerodynamics;
					entity.fallFriction = character.fallFriction;
					entity.arcWeight = character.arcWeight;
					entity.weight = character.weight;
					entity.height = -character.height;
					entity.directionalInfluence = character.directionalInfluence;
					entity.maxDI = character.maxDI;
					entity.friction = character.friction;
					entity.slideFriction = character.slideFriction;
					entity.name = character.name;
					entity.phasing = !!character.phasing;
					entity.phase = false;
					entity.team = 0;
					entity.grabXOffset = character.grabXOffset;
					entity.grabYOffset = character.grabYOffset;
					entity.grabRadius = character.grabRadius;
					entity.shieldRegen = character.shieldRegen;
					entity.shieldDecay = character.shieldDecay;
					entity.permadeath = !!character.permadeath;
					entity.floating = !!character.floating;
					entity.moonwalk = character.moonwalk;
					entity.defaultAnimation = character.defaultAnimation;
					entity.landingAudio = character.landingAudio;
					entity.lagCancelAudio = character.lagCancelAudio;
					entity.backdrop = (character.backdrop || null) && character.backdrop;
					entity.backdropFollow = character.backdropFollow;
					entity.launchResistance = character.launchResistance;
					entity.di = 0;
					entity.sdi = character.sdi;
					entity.stun = 0;
					entity.shield = 1;
					if (character.onCreate) {
						character.onCreate(entity);
					}
					entities.push(entity);
				},
				queue = [],
				listeners = [],
				filterQueue = function (name) {
					return function (item) {
						return item.name === name;
					};
				};
			window.addEventListener('characterloaded', function (e) {
				if (e.characterData) {
					var data = e.characterData;
					if (data.backdrop) {
						data.backdrop.reverse();
					}
					Animation.prepareAnimationData(data.animations);
					characters[data.name] = data;
					//for each entity in the queue with the same name as the loaded character, copy the attributes
					queue.filter(function (item) { return item.name === data.name; }).forEach(function (item) {
						copyAttributes(data, item.entity);
					});
					//remove the entities from the queue with the same name as the loaded character
					queue = queue.filter(function (item) { return item.name !== data.name; });
					//for each listener matching the name of the loaded character, execute the onLoad function
					listeners.filter(function (item) { return item.name === data.name; }).forEach(function (item) {
						item.onLoad instanceof Function && item.onLoad(data);
					});
					listeners = listeners.filter(function (item) { return item.name !== data.name; });
					data.loaded = true;
				} else {
					throw new Error('Character data not found.');
				}
			}, false);
			return {
				//loads a character, and spawns an entity when finished
				load: function (name, entity, data) {
					if (entity && characters[name]) {
						copyAttributes(characters[name], entity);
						if (data.onLoad) {
							data.onLoad(characters[name], entity);
						}
					} else {
						if (listeners.filter(filterQueue(name)).length === 0) {
							var scriptElement = document.createElement('script');
							scriptElement.src = 'characters/' + name.toLowerCase().replace(' ', '') + '.js?' + Math.random();
							document.head.appendChild(scriptElement);
						}
						if (entity) {
							queue.push({name: name, entity: entity});
						}
						if (data) {
							listeners.push(data);
						}
					}
				},
				characters: characters
			};
		}()),
		Entity = (function () {
			var entityConstructor = function Entity() {
				},
				blacklist = ['name', 'x', 'y', 'dx'];
			entityConstructor.prototype.remove = function () {
				this.removed = true;
				this.mouseListener && mouseListeners.remove(this.mouseListener);
				this.onRemove && this.onRemove();
			};
			entityConstructor.prototype.place = function () {
				this.removed = false;
				this.mouseListener && mouseListeners.push(this.mouseListener);
				this.onPlace && this.onPlace();
			};
			entityConstructor.prototype.spawn = function (spawn) {
				var i,
					owner = this,
					entity = spawnAnimatable({type: spawn.type || 0, name: spawn.name, recycle: true, airborne: true, onLoad: function (data, entity) {
						for (i in spawn) {
							if (spawn.hasOwnProperty(i) && blacklist.indexOf(i) === -1) {
								entity[i] = spawn[i];
							}
						}
						entity.lastx = owner.x;
						entity.x = owner.x + (owner.facing ? spawn.x : -spawn.x);
						entity.y = owner.y - spawn.y;
						if (spawn.dx) {
							entity.dx = (owner.facing ? spawn.dx : -spawn.dx);
						}
						if (!spawn.neutral) {
							entity.friendly = owner;
						}
						if (!spawn.singleFacing) {
							entity.facing = owner.facing;
						}
						if (spawn.stale) {
							entity.staleAs = owner;
						}
					}});
			};
			return entityConstructor;
		}()),
		importPrototype = function (from, to) {
			var i;
			if (arguments.length > 2) {
				for (i = 2; i < arguments.length; i++) {
					to.prototype[arguments[i]] = from.prototype[arguments[i]];
				}
			}
		},
		playAudio = (function () {
			var cache = [{}, {}, {}, {}, {}, {}, {}, {}, {}],
				playMute = function (name) {
				
				},
				playSound = function (name) {
					var i,
						l = cache.length,
						highestProgress = 0,
						idealDrop,
						sample;
					for (i = 0; i < l; i++) {
						sample = cache[i][name];
						if (!sample) {
							sample = new Audio('audio/' + name + '.ogg');
							cache[i][name] = sample;
						}
						if (sample.paused) {
							sample.play();
							break;
						}
						if (sample.currentTime > highestProgress) {
							highestProgress = sample.currentTime;
							idealDrop = sample;
						}
					}
					if (idealDrop) {
						idealDrop.currentTime = 0;
						idealDrop.play();
					}
				};
			playSound.cache = function (name) {
			};
			playSound.toggleMute = function () {
				playAudio = playMute;
			};
			playMute.toggleMute = function () {
				playAudio = playSound;
			};
			return playSound;
		}()),
		Animatable = (function () {
			var animatableConstructor = function Animatable(entityData) {
					this.index = entities.count++;
					this.hurtbubbles = [];
					this.animation = !entityData.airborne ? 'idle' : 'airborne';
					this.airborne = !!entityData.airborne;
					this.scheduledAnimation = [null, false, false];
					this.animations = {};
					this.lastInjury = { lastFrame: false, entity: undefined, damage: 0, knockback: 0, angle: 0, flags: 0 };
					this.lastShield = { lastFrame: false, entity: undefined, damage: 0, knockback: 0, angle: 0, flags: 0 };
					this.lastCollision = { lastFrame: false, type: 0, entity: undefined, damage: 0, knockback: 0, angle: 0, flags: 0 };
					this.lastClash = { lastFrame: false, type: 0, entity: undefined, damage: 0, knockback: 0, angle: 0, flags: 0 };
					this.playerNumber = -1;
					this.launched = false;
					this.color = 0;
					this.x = 0;
					this.dx = 0;
					this.lag = 0;
					this.stun = 0;
					this.invulnerable = 0;
					this.slide = 0;
					this.y = 0;
					this.dy = 0;
					this.damage = 0;
					this.stocks = 0;
					this.stale = [];
					this.stale.cursor = 0;
					this.collided = [];
					this.fastfall = false;
					this.airjumps = 0;
					this.lagCancel = 0;
					this.facing = true;
					this.onRemove = false;
					this.follow = true;
					this.buffer = '';
					this.buffertime = 0;
					this.activeAnimation = null;
					this.ledgeHang = false; //direction of hanging from the ledge
					this.friendly = this;
					if (entityData) {
						(function (data, entity) {
							if (data.type === 0) {
								characterData.load(data.name, entity, data);
							}
						}(entityData, this));
					}
				},
				all = 'all';
			animatableConstructor.prototype.schedule = function (name, force, interruptInterrupt) {
				if (this.scheduledAnimation[0] === null || force) {
					this.scheduledAnimation[0] = name;
					this.scheduledAnimation[1] = force;
					this.scheduledAnimation[2] = interruptInterrupt;
				}
			};
			animatableConstructor.prototype.addHitbubble = function () {
				addHitbubble(
					this.index,
					arguments[0],
					this.x + (this.facing ? arguments[1] : -arguments[1]),
					this.y - arguments[2],
					arguments[3],
					this.facing ? (arguments[4] | 1) : arguments[4],
					arguments[5],
					arguments[6],
					arguments[7],
					arguments[8],
					arguments[9],
					arguments[10],
					arguments[11],
					arguments[12]
				);
			};
			animatableConstructor.prototype.setAnimation = function (animationName, force, interruptInterrupt) {
				var name, activeAnimation = this.animations[this.animation];
				if (force || ((activeAnimation && !(activeAnimation.noCancel && activeAnimation.noCancel.indexOf(animationName) !== -1) &&
						((activeAnimation.cancellable === all || activeAnimation.cancellable.indexOf(animationName) !== -1) ||
						(activeAnimation.keyframeData.cancellable && (activeAnimation.keyframeData.cancellable === all || activeAnimation.keyframeData.cancellable.indexOf(animationName) !== -1)))) &&
						!(activeAnimation.redirect && activeAnimation.redirect[animationName] === 0))) {
					if (activeAnimation.keyframeData.interpolate) {
						this.lastframe = this.lastinterp;
					}
					if (!interruptInterrupt && activeAnimation.interrupted && activeAnimation.transition !== animationName) {
						name = activeAnimation.interrupted(this);
						if (name) {
							animationName = name;
						}
					}
					if (activeAnimation.cancellable.indexOf(animationName) !== -1) {
						console.log('ahhhhhhhh', activeAnimation.name, activeAnimation.canceled, animationName);
						activeAnimation.canceled && activeAnimation.canceled(this, this.controller, animationName);
					}
					if (this.buffertime > 0) {
						this.buffertime = 0;
						this.buffer = '';
					}
					activeAnimation.reset();
					//console.log(activeAnimation.name, animationName);
					this.animation = activeAnimation.redirect && activeAnimation.redirect[animationName] ? activeAnimation.redirect[animationName] : animationName;
					this.activeAnimation = this.animations[animationName];
					this.activeAnimation.continued = (activeAnimation.transition === activeAnimation.name === animationName);
					if (!this.activeAnimation) {
						dbg.log('animation error: ' + animationName);
						console.log('animation not found', this, animationName);
					}
					if (this.activeAnimation.refresh) {
						this.activeAnimation.step();
					}
					//dbg.log('p' + this.playerNumber + ': ' + this.animation);
					return true;
				} else if (activeAnimation && activeAnimation.buffer && !this.animations[animationName].unbufferable && (activeAnimation.buffer === all || activeAnimation.buffer.indexOf(animationName) !== -1)) {
					this.buffer = animationName;
					this.buffertime = 8;
				}
				return false;
			};
			animatableConstructor.prototype.reset = function () {
				this.collided.length = 0;
				this.x = 0;
				this.y = 0;
				this.dx = 0;
				this.dy = 0;
				this.slide = 0;
				this.lag = 0;
				this.stun = 0;
				this.stale = [];
				this.stale.cursor = 0;
				this.buffer = '';
				this.buffertime = 0;
				this.fastfall = false;
				this.airjumps = 0;
				this.lagCancel = 0;
				this.teched = 0;
				this.facing = true;
				this.lastCollision.lastFrame = false;
				this.lastShield.lastFrame = false;
				this.lastInjury.lastFrame = false;
				this.lastClash.lastFrame = false;
				this.setAnimation(this.defaultAnimation || 'idle', true);
			};
			animatableConstructor.prototype.setColor = function (color) {
				this.color = color;
				this.darker = (color >> 4) << 4;
				this.lighter = ((color >> 4) << 4) + 9;
				//this.contrast = (((color >> 4) + 8) << 4) + 9;
				this.contrast = complements[color];
				//console.log(this.darker, this.lighter);
			};
			importPrototype(Entity, animatableConstructor, 'remove', 'place', 'spawn');
			return animatableConstructor;
		}()),
		spawnAnimatable = function (entityData) {
			var i;
			if (entityData.recycle) {
				i = removed.length;
				while (i--) {
					if (removed[i].removed && removed[i].name === entityData.name) {
						removed[i].removed = false;
						removed[i].reset();
						entityData.onLoad(removed[i], removed[i]);
						return removed[i];
					}
				}
			}
			//if not recycling, or none is found
			return new Animatable(entityData);
		},
		Cursor = (function () {
			var cursorConstructor = function (controller, x, y, data) {
				this.x = x;
				this.y = y;
				for (var key in data) {
					if (data.hasOwnProperty(key)) {
						if (data[key] instanceof Function) {
							this[key] = data[key].bind(this);
						} else {
							this[key] = data[key];
						}
					}
				}
				this.controller = controller;
				controller.hook = this;
				this.index = entities.count++;
				this.hide = false;
				this.place();
				this.animation = 'idle';
				this.animations = {'idle': {
					clash: function () {
					}
				}};
				this.setAnimation = function () {};
			};
			cursorConstructor.prototype.act = function () {
				var i, entity;
				if (this.controller && !this.hide) {
					this.x += this.controller.hmove * 8;
					this.y += this.controller.vmove * 8;
					if (this.restrict) {
						if (this.x > this.restrict[2]) {
							this.x = this.restrict[2];
						}
						if (this.y > this.restrict[3]) {
							this.y = this.restrict[3];
						}
						if (this.x < this.restrict[0]) {
							this.x = this.restrict[0];
						}
						if (this.y < this.restrict[1]) {
							this.y = this.restrict[1];
						}
					}
					if (this.spring) {
						if (this.x > this.spring[2]) {
							this.x -= (this.x - this.spring[2]) / 8;
						}
						if (this.y > this.spring[3]) {
							this.y -= (this.y - this.spring[3]) / 8;
						}
						if (this.x < this.spring[0]) {
							this.x -= (this.x - this.spring[0]) / 8;
						}
						if (this.y < this.spring[1]) {
							this.y -= (this.y - this.spring[1]) / 8;
						}
					}
					if (this.controller.specialPress && this.back instanceof Function) {
						this.back();
					}
					if (this.controller.attackPress) {
						for (i = 0; i < entities.length; i++) {
							entity = entities[i];
							if (entity instanceof Button) {
								if (entity.handlers.press instanceof Function && entity.contains(this.x, this.y)) {
									entity.handlers.press(this);
								}
							} else if (entity instanceof Selection && entity.contains(this.x, this.y)) {
								entity.press(this);
							}
						}
					}
				}
			};
			cursorConstructor.prototype.paint = function () {
				if (!this.hide) {
					ctx.fillStyle = rgbaByte[this.color];
					drawCircle(this.x, this.y, 12);
				}
			};
			importPrototype(Entity, cursorConstructor, 'remove', 'place');
			return cursorConstructor;
		}()),
		Button = (function () {
			var buttonConstructor = function Button(text, x, y, w, h, handlers) {
				var that = this,
					hovered = false,
					pressed = false,
					circle = !!(handlers.circle),
					r = w,
					dragHandler = handlers.drag,
					hoverHandler = handlers.hover,
					clickHandler = handlers.click,
					rightClickHandler = handlers.rightClick,
					middleClickHandler = handlers.middleClick,
					x2 = x + w,
					y2 = y + h,
					xOffset,
					yOffset,
					checkMouse = (circle ? function () {
						//circle
						return Math.sqrt(Math.pow(mx - x, 2) + Math.pow(my - y, 2)) < r;
					} : function () {
						//rectangle
						return mx > x && my > y && mx < x2 && my < y2;
					}),
					listener = function () {
						if (pressed) {
							if (mp & 1) {
								if (dragHandler instanceof Function) {
									dragHandler(xOffset, yOffset);
								}
							} else {
								if (checkMouse()) {
									if (clickHandler instanceof Function) {
										clickHandler(x - mx, y - my);
									}
								}
								pressed = false;
							}
						} else {
							if (checkMouse()) {
								if (!hovered) {
									r = w * 1.25;
									hovered = true;
								}
								if (mp & 2) {
									pressed = true;
									xOffset = x - mx;
									yOffset = y - my;
								}
								if (mp & 8) {
									//middle press
								}
								if (mp & 32) {
									//right press
								}
							} else if (hovered) {
								r = w;
								hovered = false;
							}
						}
					};
				if (w === 0) {
					setFontSize(h);
					w = ctx.measureText(text).width + 4;
					r = w / 2;
					x2 = x + w;
				}
				that.x = x;
				that.y = y;
				that.w = w;
				that.h = h;
				that.r = w;
				that.paint = (circle ? function () {
					drawCircle(x, y, r);
					drawText(text, x + 2, y + h * 0.2);
					setFontSize(h);
				} : function () {
					setFontSize(h);
					ctx.fillStyle = rgbaByte[12];
					drawRect(x, y, w, h);
					ctx.fillStyle = rgbaByte[15];
					drawText(text, x + 2, y2 - h * 0.2);
				});
				this.contains = function (xc, yc) {
					return xc > x && yc > y && xc < x2 && yc < y2;
				};
				that.mouseListener = listener;
				this.index = entities.count++;
				that.place();
				this.handlers = handlers;
				this.animation = 'idle';
				this.animations = {
					'idle': {
						clash: function () {
						}
					}
				};
				this.setAnimation = function () { return false; };
			};
			importPrototype(Entity, buttonConstructor, 'remove', 'place');
			return buttonConstructor;
		}()),
		Selection = (function () {
			var selectionConstructor = function Selection(defaultText, x, y, w, rowHeight, showRows, items, handlers) {
				var that = this,
					hovered = false,
					pressed = false,
					expandedRows = Math.min(showRows, items.length),
					eh = rowHeight * (Math.min(expandedRows, items.length) + 1),
					h = rowHeight,
					i,
					dragHandler = handlers.drag,
					hoverHandler = handlers.hover,
					clickHandler = handlers.click,
					selectHandler = handlers.select,
					rightClickHandler = handlers.rightClick,
					middleClickHandler = handlers.middleClick,
					backHandler = handlers.back,
					selectedIndex = -1,
					selected = defaultText,
					cursor,
					lastScrolled = 0,
					expanded = false,
					typedIn = '',
					scrolling = false,
					scrollHover = false,
					changedLast = false,
					cursorPressed = false,
					scrollIndex = 0,
					scrollOffset = 0,
					x2 = x + w,
					y2 = y + h,
					xOffset,
					yOffset,
					expand = function () {
						expanded = true;
						h = eh;
						y2 = y + h;
					},
					retract = function () {
						expanded = false;
						h = rowHeight;
						y2 = y + h;
					},
					toggle = function () {
						if (expanded) {
							retract();
						} else {
							expand();
						}
					},
					checkMouse = function () {
						//rectangle
						return mx > x && my > y && mx < x2 && my < y2;
					},
					checkScroll = function () {
						//rectangle
						return expandedRows < items.length && mx > x2 - 12 && my > y + scrollOffset + rowHeight && mx < x2 + 4 && my < y + scrollOffset + rowHeight * 2;
					},
					startsWith = function (str) {
						var l = str.length;
						return function (item) {
							if (item.substr(0, l) === str) {
								return true;
							}
						};
					},
					listener = function () {
						if (cursor) {
							if (!expanded) {
								toggle();
							}
							if (cursorPressed && !cursor.controller.attack) {
								cursorPressed = false;
							}
							if (cursor.controller.special) {
								toggle();
								backHandler instanceof Function && that.back(cursor);
								cursor.hide = false;
								cursor = undefined;
							} else if (!cursorPressed && cursor.controller.attack && lastScrolled !== frame) {
								selected = items[selectedIndex];
								if (selectHandler instanceof Function) {
									that.select(selected, selectedIndex, cursor);
								}
								toggle();
								cursor.hide = false;
								cursor = undefined;
							} else {
								if (cursor.controller.vmove > 0) {
									if (frame - lastScrolled > (1.1 - cursor.controller.vmove * cursor.controller.vmove) * 30) {
										selectedIndex = (selectedIndex + 1) % items.length;
										if (selectedIndex >= scrollIndex + expandedRows) {
											scrollIndex = selectedIndex - expandedRows + 1;
										} else if (selectedIndex < scrollIndex) {
											scrollIndex = selectedIndex;
										}
										scrollOffset = scrollIndex / (items.length - expandedRows) * (eh - rowHeight * 2);
										if (changedLast) {
											lastScrolled = frame;
										} else {
											lastScrolled = frame + 12;
											changedLast = true;
										}
									}
								} else if (cursor.controller.vmove < 0) {
									if (frame - lastScrolled > (1.1 - cursor.controller.vmove * cursor.controller.vmove) * 30) {
										selectedIndex = (selectedIndex > 0) ? selectedIndex - 1 : items.length - 1;
										//scrollIndex = Math.min(Math.max(0, selectedIndex), items.length - expandedRows);
										if (selectedIndex >= scrollIndex + expandedRows) {
											scrollIndex = selectedIndex - expandedRows + 1;
										} else if (selectedIndex < scrollIndex) {
											scrollIndex = selectedIndex;
										}
										scrollOffset = scrollIndex / (items.length - expandedRows) * (eh - rowHeight * 2);
										if (changedLast) {
											lastScrolled = frame;
										} else {
											lastScrolled = frame + 12;
											changedLast = true;
										}
									}
								} else {
									changedLast = false;
									lastScrolled = 0;
								}
							}
						} else {
							if (expanded) {
								if (typed) {
									if (typedIn.length === 0) {
										typedIn = typed;
									} else {
										typedIn += typed;
									}
									selected = typedIn;
									selectedIndex = items.indexOf(items.filter(startsWith(typedIn))[0]);
									scrollIndex = Math.min(Math.max(0, selectedIndex), items.length - expandedRows);
									scrollOffset = scrollIndex / (items.length - expandedRows) * (eh - rowHeight * 2);
								}
								if (backspaced) {
									typedIn = typedIn.substr(0, typedIn.length - 1);
									selected = typedIn;
								}
								if (entered) {
									if (selectedIndex >= 0) {
										selected = items[selectedIndex];
										if (selectHandler instanceof Function) {
											that.select(selected, selectedIndex);
										}
									} else {
										selected = defaultText;
									}
									typedIn = '';
									retract();
								}
							}
							if (mwdy !== 0) {
								scrollIndex = Math.min(Math.max(0, scrollIndex - mwdy / 40), items.length - expandedRows);
								scrollOffset = scrollIndex / (items.length - expandedRows) * (eh - rowHeight * 2);
							}
							if (scrolling) {
								if (mp & 1) {
									scrollOffset = Math.min(Math.max(0, my - yOffset - y), eh - rowHeight * 2);
									scrollIndex = Math.floor(scrollOffset / (eh - rowHeight * 2) * (items.length - expandedRows));
								} else {
									scrolling = false;
								}
							}
							if (pressed) {
								if (mp & 1) {
									if (dragHandler instanceof Function) {
										dragHandler();
									}
								} else {
									if (checkMouse()) {
										if (clickHandler instanceof Function) {
											clickHandler();
										}
										if (my - y > rowHeight) {
											selectedIndex = Math.floor((my - y - rowHeight) / rowHeight) + scrollIndex;
											selected = items[selectedIndex];
											if (selectHandler instanceof Function) {
												that.select(selected, selectedIndex);
											}
										}
										toggle();
									}
									pressed = false;
								}
							} else {
								if (expanded && scrollHover && !scrolling) {
									scrollHover = false;
								}
								if (expanded && checkScroll()) {
									scrollHover = true;
									if (mp & 2) {
										scrolling = true;
										yOffset = my - y - scrollOffset;
									}
								} else if (checkMouse()) {
									if (!hovered) {
										hovered = true;
									}
									if (mp & 2) {
										pressed = true;
										xOffset = x - mx;
										yOffset = y - my;
									}
									if (mp & 8) {
										//middle press
									}
									if (mp & 32) {
										//right press
									}
								} else {
									if (mp & 2) {
										retract();
									}
									if (hovered) {
										hovered = false;
									}
								}
							}
						}
					};
				if (w === 0) {
					setFontSize(rowHeight);
					w = ctx.measureText(defaultText).width;
					i = items.length;
					while (i--) {
						if (ctx.measureText(items[i]).width > w) {
							w = ctx.measureText(items[i]).width;
						}
					}
					w += 4;
					x2 = x + w;
				}
				that.select = selectHandler;
				that.back = backHandler;
				that.press = function (cursoro) {
					if (!cursor) {
						cursor = cursoro;
						cursor.hide = true;
						cursorPressed = true;
						lastScrolled = frame;
						if (selectedIndex === -1) {
							selectedIndex = 0;
							selected = items[selectedIndex];
						}
						toggle();
					}
				};
				that.reset = function () {
					selectedIndex = -1;
					selected = defaultText;
				};
				this.index = entities.count++;
				that.x = x;
				that.y = y;
				that.w = w;
				that.h = h;
				that.r = w;
				that.paint = function () {
					var i,
						yOffset = rowHeight * 0.8 + rowHeight;
					setFontSize(rowHeight);
					ctx.fillStyle = rgbaByte[12];
					if (expanded) {
						fillRect(x, y, w, eh);
						drawLine(x, y + rowHeight, x + w, y + rowHeight);
						drawRect(x, y, w, eh);
						if (expandedRows < items.length) {
							fillRect(x2 - (scrollHover ? 12 : 4), y + rowHeight + scrollOffset, (scrollHover ? 16 : 8), rowHeight);
							drawRect(x2 - (scrollHover ? 12 : 4), y + rowHeight + scrollOffset, (scrollHover ? 16 : 8), rowHeight);
						}
						ctx.fillStyle = rgbaByte[15];
						for (i = 0; i < expandedRows && i + scrollIndex < items.length; i++) {
							if (i + scrollIndex === selectedIndex) {
								drawRect(x - 4, i * rowHeight + y + rowHeight, ctx.measureText(items[i + scrollIndex]).width + 8, rowHeight);
							}
							drawText(items[i + scrollIndex], x + 2, i * rowHeight + y + yOffset);
						}
					} else {
						fillRect(x, y, w, rowHeight);
						drawRect(x, y, w, rowHeight);
						ctx.fillStyle = rgbaByte[15];
					}
					drawText(selected, x + 2, y + rowHeight * 0.8);
				};
				that.contains = function (xc, yc) {
					return xc > x && yc > y && xc < x2 && yc < y2;
				};
				that.mouseListener = listener;
				that.place();
			};
			importPrototype(Entity, selectionConstructor, 'remove', 'place');
			return selectionConstructor;
		}()),
		keyboardGamepads = [],
		keyboardControllers = [],
		/**
		 * button binds: keys corresponding to buttons
		 * axis binds: keys corresponding to the axes:
		 * * left, right, up, down, rleft, rright, rup, rdown, tilt mod
		*/
		KeyboardGamepad = function (buttonBinds, axisBinds) {
			var index,
				tilt = 1,
				buttons,
				axes;
			this.buttons = buttonBinds.map(function () {
				return 0;
			});
			buttons = this.buttons;
			this.axes = [0, 0, 0, 0];
			axes = this.axes;
			this.keydown = function (key) {
				if ((index = buttonBinds.indexOf(key)) >= 0) {
					buttons[index] = 1;
					return true;
				}
				if ((index = axisBinds.indexOf(key)) >= 0) {
					if (index === 8) {
						tilt = 0.65;
					} else {
						if (index % 2 === 0) { //negative
							axes[index / 2] = -tilt + (index === 2 || index === 3 ? 0.05 : 0);
						} else {
							axes[(index - 1) / 2] = tilt + (index === 2 || index === 3 ? 0.05 : 0);
						}
					}
					return true;
				}
			};
			this.keyup = function (key) {
				if ((index = buttonBinds.indexOf(key)) >= 0) {
					buttons[index] = 0;
					return true;
				}
				if ((index = axisBinds.indexOf(key)) >= 0) {
					if (index === 8) {
						tilt = 1;
					} else {
						if (index % 2 === 0) { //negative
							if (axes[index / 2] < 0) {
								axes[index / 2] = 0;
							}
						} else {
							if (axes[(index - 1) / 2] > 0) {
								axes[(index - 1) / 2] = 0;
							}
						}
					}
					return true;
				}
			};
		},
		showControls = false,
		Controller = (function () {
			var jumpFrames = 7,
				tapJumpFrames = 5,
				controlCharacter = function controlCharacter() {
					if (!this.select) {
						if (this.startPress) {
							dbg.log('started');
							activeMode.start && activeMode.start(this, this.hook);
						}
					}
					if (this.select && this.hook) {
						if (this.selectPress) {
							Effects.colorChooser(this.hook.x - 100, this.hook.y, 200, 200, this.hook);
						}
						if (this.dupPress) {
							dbg.log('Requesting fullscreen');
							canvas.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
							/*canvas.requestFullScreen && canvas.requestFullScreen() ||
									canvas.mozRequestFullScreen && canvas.mozRequestFullScreen() ||
									canvas.webkitRequestFullScreen && canvas.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);*/
						}
						if (this.jumpPress) {
							this.noTapJump = !this.noTapJump;
							dbg.log('Tap jump for p' + (this.hook.playerNumber + 1), this.noTapJump ? 'off' : 'on');
						}
						if (this.shieldPress) {
							dbg.enabled && dbg.log('Debug text', 'disabled');
							dbg.toggle();
							dbg.enabled && dbg.log('Debug text', 'enabled');
						}
						if (this.grabPress) {
							dbg.drawLedgeGrab = !dbg.drawLedgeGrab;
							dbg.log('Draw ledge grab data', dbg.drawLedgeGrab ? 'on' : 'off');
						}
						if (this.specialPress) {
							dbg.drawHurtbubbles = !dbg.drawHurtbubbles;
							dbg.log('Draw hurtbubbles', dbg.drawHurtbubbles ? 'on' : 'off');
						}
						if (this.attackPress) {
							dbg.drawHitbubbles = !dbg.drawHitbubbles;
							dbg.log('Draw hitbubbles', dbg.drawHitbubbles ? 'on' : 'off');
						}
						if (this.startPress && this.hook instanceof Animatable) {
							this.hook.reset();
							this.hook.stocks = 3;
							dbg.log('Reset player ' + (this.hook.playerNumber + 1));
						}
					} else if (this.hook instanceof Animatable) {
						showControls = this.start;
						if (this.jumpIn > 0) {
							this.jumpIn--;
						}
						if (this.hook.animations[this.hook.animation] &&
								this.hook.animations[this.hook.animation].reversible &&
								this.hook.animations[this.hook.animation].frame < 6 &&
								((this.hook.facing && this.left === 2) || (!this.hook.facing && this.right === 2))) {
							this.hook.facing = !this.hook.facing;
							this.hook.dx = -this.hook.dx;
							if (this.hook.animations[this.hook.animation].reverse) {
								this.hook.setAnimation(this.hook.animations[this.hook.animation].reverse, true);
							}
						}
						if (this.shieldHardPress && !this.hook.teched) {
							this.hook.teched = 30;
						}
						if (this.hook.airborne) {
							if (this.jumpPress || (!this.noTapJump && this.hardup === 6)) {
								if (this.hook.animations['airjump' + this.hook.airjumps] && this.hook.setAnimation('airjump' + this.hook.airjumps)) {
									Effects.airjump(this.hook.x, this.hook.y, this.hook.color);
									this.hook.fastfall = false;
								}
							}
							/*if (!this.jumpIn && this.hook.animations[this.hook.animation].keyframeData.jump) {
								dbg.log(this.hook.animations[this.hook.animation].tapJumped);
								if (this.hook.animations[this.hook.animation].tapJumped) {
									this.jumpIn = tapJumpFrames;
								} else {
									this.jumpIn = jumpFrames;
								}
								this.jumpSpeed = this.hook.animations[this.hook.animation].keyframeData.jumpSpeed;
							}
							if (this.jumpIn === 1 && (this.jump > 0 || (!this.noTapJump && this.up))) {
								this.hook.dy = this.jumpSpeed;
								this.hook.setAnimation('jump');
							}*/
							if (!this.jumpIn && this.hook.animations[this.hook.animation].keyframeData.jump) {
								//dbg.log(this.hook.animations[this.hook.animation].tapJumped);
								if (this.hook.animations[this.hook.animation].tapJumped) {
									this.jumpIn = Math.max(1, tapJumpFrames - this.hook.animations[this.hook.animation].frame);
								} else {
									this.jumpIn = Math.max(1, jumpFrames - this.hook.animations[this.hook.animation].frame);
								}
								//dbg.log('what', this.jumpIn);
								this.jumpSpeed = this.hook.animations[this.hook.animation].keyframeData.jumpSpeed;
							}
							if (this.jumpIn === 1 && (this.jump || (!this.noTapJump && this.up))) {
								this.hook.dy = this.jumpSpeed;
								this.hook.setAnimation('jump');
							}
							if (this.shieldHardPress) {
								(this.hmove || this.vmove || this.hook.setAnimation('neutraldodge')) && this.hook.setAnimation('airdodge');
							}
							if ((this.hook.facing && this.hmove < -0.4) || (!this.hook.facing && this.hmove > 0.4)) {
								this.reversible = 16;
							} else if (this.reversible > 0) {
								this.reversible--;
							}
							this.hook.di = this.hmove * this.hook.directionalInfluence;
							if (this.grabPress) {
								this.hook.animations.zair && this.hook.setAnimation('zair');
							} else if (this.attackPress) {
								if (this.shield > 0.8 && this.hook.setAnimation('zair')) {
									
								} else if (this.up) {
									this.hook.setAnimation('uair');
								} else if (this.down) {
									this.hook.setAnimation('dair');
								} else if (this.hook.facing) {
									if (this.hmove < -0.3) {
										this.hook.setAnimation('bair');
									} else if (this.hmove > 0.3) {
										this.hook.setAnimation('fair');
									} else {
										this.hook.setAnimation('nair');
									}
								} else {
									if (this.left) {
										this.hook.setAnimation('fair');
									} else if (this.right) {
										this.hook.setAnimation('bair');
									} else {
										this.hook.setAnimation('nair');
									}
								}
							} else if (this.specialPress) {
								if (this.left) {
									if (this.hook.setAnimation('airsidespecial')) {
										this.hook.facing = false;
									}
								} else if (this.right) {
									if (this.hook.setAnimation('airsidespecial')) {
										this.hook.facing = true;
									}
								} else if (this.up) {
									if (this.hook.setAnimation('airupspecial')) {
										if (this.hmove !== 0) {
											this.hook.facing = this.hmove >= 0;
										}
									}
								} else if (this.down) {
									this.hook.setAnimation('airdownspecial');
								} else if (this.hook.setAnimation('airspecial') && this.reversible) {
									this.hook.facing = !this.hook.facing;
								}
							}
							if (this.rup === 2) {
								this.hook.setAnimation('uair');
							} else if (this.rdown === 2) {
								this.hook.setAnimation('dair');
							} else if (this.hook.facing) {
								if (this.rleft === 2) {
									this.hook.setAnimation('bair');
								} else if (this.rright === 2) {
									this.hook.setAnimation('fair');
								}
							} else {
								if (this.rleft === 2) {
									this.hook.setAnimation('fair');
								} else if (this.rright === 2) {
									this.hook.setAnimation('bair');
								}
							}
							if (this.harddown && ((this.hook.dy < 5 && this.hook.animations[this.hook.animation].type === 2) || (this.hook.dy < 4 && !this.hook.animations[this.hook.animation].noFastfall))) {
								this.hook.fastfall = true;
							}
							if (this.shieldPress && this.hook.lagCancel === 0 && this.hook.animations[this.hook.animation].type === 2 && !this.hook.animations[this.hook.animation].noLCancel) {
								this.hook.lagCancel = 13;
							}
						} else {
							if (this.ddownPress) { //down taunt, force trip
								this.hook.setAnimation('dtaunt');
							}
							if (this.dleftPress || this.drightPress) {
								this.hook.setAnimation('staunt');
							}
							if (this.dupPress) {
								this.hook.setAnimation('utaunt');
							}
							if (this.harddown === 6) {
								this.hook.platformDrop = true;
							}
							if (this.shield > 0.1 && Math.abs(this.hook.slide) < 1) {
								this.hook.setAnimation('shieldup');
							}
							if (this.hook.animation === 'run') {
								if ((this.hook.facing && !this.right) || (!this.hook.facing && !this.left)) {
									if (this.hook.setAnimation('skid')) {
										Effects.skid(this.hook.x, this.hook.y - 3, this.hook.dx + this.hook.slide, this.hook.dy);
										Effects.skid(this.hook.x, this.hook.y - 3, this.hook.dx + this.hook.slide, this.hook.dy);
										Effects.skid(this.hook.x, this.hook.y - 3, this.hook.dx + this.hook.slide, this.hook.dy);
									}
								}
							} else if (this.hook.animation === 'dash') {
								if (!this.hook.facing && this.hardright === 6 && Math.abs(this.vmove) < 0.55 && this.hook.setAnimation('pivot')) {
									this.hook.facing = true;
									if (partyMode && Math.random() > 0.9) {
										this.hook.setAnimation('trip', true);
										dbg.log('Party time!');
										Effects.message(80, 40, 90, 'PARTY TIME!');
									}
									Effects.skid(this.hook.x, this.hook.y - 3, this.hook.dx + this.hook.slide, this.hook.dy);
									Effects.skid(this.hook.x, this.hook.y - 3, this.hook.dx + this.hook.slide, this.hook.dy);
									Effects.skid(this.hook.x, this.hook.y - 3, this.hook.dx + this.hook.slide, this.hook.dy);
									Effects.skid(this.hook.x, this.hook.y - 3, this.hook.dx + this.hook.slide, this.hook.dy);
									Effects.skid(this.hook.x, this.hook.y - 3, this.hook.dx + this.hook.slide, this.hook.dy);
									Effects.skid(this.hook.x, this.hook.y - 3, this.hook.dx + this.hook.slide, this.hook.dy);
								} else if (this.hook.facing && this.hardleft === 6 && Math.abs(this.vmove) < 0.55 && this.hook.setAnimation('pivot')) {
									this.hook.facing = false;
									if (partyMode && Math.random() > 0.9) {
										this.hook.setAnimation('trip', true);
										dbg.log('Party time!');
										Effects.message(80, 40, 90, 'PARTY TIME!');
									}
									Effects.skid(this.hook.x, this.hook.y - 3, this.hook.dx + this.hook.slide, this.hook.dy);
									Effects.skid(this.hook.x, this.hook.y - 3, this.hook.dx + this.hook.slide, this.hook.dy);
									Effects.skid(this.hook.x, this.hook.y - 3, this.hook.dx + this.hook.slide, this.hook.dy);
									Effects.skid(this.hook.x, this.hook.y - 3, this.hook.dx + this.hook.slide, this.hook.dy);
									Effects.skid(this.hook.x, this.hook.y - 3, this.hook.dx + this.hook.slide, this.hook.dy);
									Effects.skid(this.hook.x, this.hook.y - 3, this.hook.dx + this.hook.slide, this.hook.dy);
								} else if (!this.left && !this.right) {
								}
							} else if (this.hook.animation === 'crouch' || this.hook.animation === 'crouched') {
								if (!this.down) {
									this.hook.setAnimation('stand');
								}
							} else if (this.down && this.hook.animation !== 'crouch') {
								this.hook.setAnimation('crouch');
							} else if (Math.abs(this.hmove) > 0.2) {
								if (this.hardleft || this.hardright) {
									if (this.hook.animation !== 'dash' && this.hook.setAnimation('dash')) {
										if (partyMode && Math.random() > 0.9) {
											this.hook.setAnimation('trip', true);
											dbg.log('Party time!');
											Effects.message(80, 40, 90, 'PARTY TIME!');
										}
										if (!this.hook.facing && this.hmove > 0) {
											this.hook.facing = true;
										} else if (this.hook.facing && this.hmove < 0) {
											this.hook.facing = false;
										}
									}
									if (this.hook.animation === 'skid') {
										if (this.hook.facing && this.left) {
											this.hook.facing = false;
											this.hook.setAnimation('turnaround');
										} else if (!this.hook.facing && this.right) {
											this.hook.facing = true;
											this.hook.setAnimation('turnaround');
										}
									}
								} else if (Math.abs(this.hmove) > 0.6) {
									if (this.hook.animation !== 'stride' && this.hook.setAnimation('stride')) {
										if (!this.hook.facing && this.hmove > 0) {
											this.hook.facing = true;
										} else if (this.hook.facing && this.hmove < 0) {
											this.hook.facing = false;
										}
									}
								} else {
									if (this.hook.animation !== 'walk' && this.hook.setAnimation('walk')) {
										if (!this.hook.facing && this.hmove > 0) {
											this.hook.facing = true;
										} else if (this.hook.facing && this.hmove < 0) {
											this.hook.facing = false;
										}
									}
								}
							} else {
								if (this.hook.animation === 'walk' || this.hook.animation === 'stride') {
									this.hook.setAnimation('idle');
								}
							}
							if ((this.jumpPress || (!this.noTapJump && this.hardup)) && this.hook.setAnimation('hop')) {
								this.hook.animations['hop'].tapJumped = !this.jumpPress;
							}
							if (this.rup === 2) {
								this.hook.setAnimation('usmash');
							} else if (this.rdown === 2) {
								this.hook.setAnimation('dsmash');
							} else if (this.rleft === 2 || this.rright === 2) {
								if (this.hook.setAnimation('fsmash')) {
									this.hook.facing = this.rright;
								}
							} else if (this.grabPress) {
								this.hook.setAnimation('grab');
							} else if (this.attackPress) {
								if (this.hook.animation.type === 4) { //shield
									this.hook.setAnimation('grab');
								} else if (this.hardup) {
									this.hook.setAnimation('usmash');
								} else if (this.up) {
									this.hook.setAnimation('utilt');
								} else if (this.harddown) {
									this.hook.setAnimation('dsmash');
								} else if (this.down) {
									this.hook.setAnimation('dtilt');
								} else if (this.hardleft || this.hardright) {
									this.hook.setAnimation('fsmash');
								} else if (this.left || this.right) {
									this.hook.setAnimation('ftilt');
								} else {
									this.hook.setAnimation('jab');
								}
							} else if (this.specialPress) {
								if (this.left) {
									if (this.hook.setAnimation('sidespecial')) {
										this.hook.facing = false;
									}
								} else if (this.right) {
									if (this.hook.setAnimation('sidespecial')) {
										this.hook.facing = true;
									}
								} else if (this.up) {
									this.hook.setAnimation('upspecial');
								} else if (this.down) {
									this.hook.setAnimation('downspecial');
								} else {
									this.hook.setAnimation('groundspecial');
								}
							}
						}
					}
				};
			return function Controller(gamepad) {
				var buttonMap = ['attack', 'jump', 'special', 'jump', 'grab', 'grab', 'shield', 'shield2', 'select', 'start', /*movedown*/'none', /*rightdown*/'none', 'dup', 'ddown', 'dleft', 'dright'],
					axisMap = ['hmove', 'vmove', 'hright', 'vright'],
					deadZone = 0.2,
					that = this,
					press = [],
					last = [],
					pressWord = 'Press',
					lastWord = 'Last',
					resetButton = function (name, index) {
						that[name] = 0;
						that[press[name]] = false;
					},
					resetAxis = function (name, index) {
						that[name] = 0;
					},
					resetLast = function (name, index) {
						if (!that[name]) {
							that[last[name]] = false;
						}
					},
					updateButton = function (name, index) {
						that[name] = Math.max(gamepad.buttons[index], that[name]);
						if (!that[last[name]] && that[name] > 0) {
							that[press[name]] = true;
							that[last[name]] = true;
						}
					},
					updateAxis = function (name, index) {
						if (index % 2 === 0) {
							if ((Math.abs(gamepad.axes[index]) < deadZone) && Math.abs(gamepad.axes[index + 1]) < deadZone) {
								that[name] = 0;
							} else {
								that[name] = gamepad.axes[index];
							}
						} else {
							if ((Math.abs(gamepad.axes[index]) < deadZone) && Math.abs(gamepad.axes[index - 1]) < deadZone) {
								that[name] = 0;
							} else {
								that[name] = gamepad.axes[index];
							}
						}
					},
					deadzoneAxis = function (name, index) {
						if (index % 2 === 0) {
							if (Math.abs(gamepad.axes[index] < deadZone) && gamepad.axes[index + 1] < deadZone) {
								that[name] = 0;
							} else {
								that[name] = gamepad.axes[index] < 0 ? gamepad.axes[index] + deadZone : gamepad.axes[index] - deadZone;
							}
						}
					};
				buttonMap.forEach(function (name) {
					press[name] = name + pressWord;
					last[name] = name + lastWord;
					that[press[name]] = false;
				});
				this.poll = function () {
					buttonMap.forEach(resetButton);
					buttonMap.forEach(updateButton);
					axisMap.forEach(updateAxis);
					//that.shieldHardPress = (!that.shieldHardLast && that.shield > 0.95) || (!that.shieldHardLast2 && that.shield2 > 0.95);
					//if (that.shieldHardPress) {
					//	that.shieldHardLast = true;
					//}
					that.shieldHardPress = false;
					if (!that.shieldHardLast && that.shield > 0.95) {
						that.shieldHardPress = true;
						that.shieldHardLast = true;
					}
					if (!that.shieldHardLast2 && that.shield2 > 0.95) {
						that.shieldHardPress = true;
						that.shieldHardLast2 = true;
					}
					that.shield = Math.max(that.shield, that.shield2);
					buttonMap.forEach(resetLast);
					if (that.shieldHardLast && that.shield <= 0.9) {
						that.shieldHardLast = false;
					}
					if (that.shieldHardLast2 && that.shield2 <= 0.9) {
						that.shieldHardLast2 = false;
					}
					if (that.shield || that.shield2) {
						that.shield = Math.max(that.shield, that.shield2);
					}
					if (that.shield2Press) {
						that.shieldPress = true;
					}
					//press values: only one will have a value, rest will always be zero; non-zero (1) if in a direction, 2 if changed this frame
					var up = that.vmove < 0 && Math.abs(that.vmove) > Math.abs(that.hmove),
						down = that.vmove > 0 && Math.abs(that.vmove) > Math.abs(that.hmove),
						left = that.hmove < 0 && Math.abs(that.vmove) < Math.abs(that.hmove),
						right = that.hmove > 0 && Math.abs(that.vmove) < Math.abs(that.hmove),
						rup = that.vright < -0.8 && Math.abs(that.vright) > Math.abs(that.hright),
						rdown = that.vright > 0.8 && Math.abs(that.vright) > Math.abs(that.hright),
						rleft = that.hright < -0.8 && Math.abs(that.vright) < Math.abs(that.hright),
						rright = that.hright > 0.8 && Math.abs(that.vright) < Math.abs(that.hright);
					that.up = that.up && up ? 1 : that.up === 0 && up ? 2 : 0;
					that.down = that.down && down ? 1 : that.down === 0 && down ? 2 : 0;
					that.left = that.left && left ? 1 : that.left === 0 && left ? 2 : 0;
					that.right = that.right && right ? 1 : that.right === 0 && right ? 2 : 0;
					that.rup = that.rup && rup ? 1 : that.rup === 0 && rup ? 2 : 0;
					that.rdown = that.rdown && rdown ? 1 : that.rdown === 0 && rdown ? 2 : 0;
					that.rleft = that.rleft && rleft ? 1 : that.rleft === 0 && rleft ? 2 : 0;
					that.rright = that.rright && rright ? 1 : that.rright === 0 && rright ? 2 : 0;

					if (that.left === 0 && that.right === 0 && that.up === 0 && that.down === 0) {
						that.neutral = true;
					}
					
					if (that.hardupLast > 0) {
						that.hardupLast--;
					}
					if (that.hardup > 0) {
						that.hardup--;
						if (that.vmove > -0.9) {
							that.hardup = 0;
						}
					}
					if (that.up === 2) {
						that.hardupLast = 5;
						that.fromneutral = that.neutral;
						if (that.neutral) {
							that.neutral = false;
						}
					}
					if (that.hardupLast && that.vmove < -0.9) {
						that.hardup = 6;
					}
					if (that.hardup) {
						that.hardupLast = 0;
					}
					if (that.hardupLast && !that.up) {
						that.hardupLast = 0;
					}

					if (that.harddownLast > 0) {
						that.harddownLast--;
					}
					if (that.harddown > 0) {
						that.harddown--;
						if (that.vmove < 0.9) {
							that.harddown = 0;
						}
					}
					if (that.down === 2) {
						that.harddownLast = 5;
						that.fromneutral = that.neutral;
						if (that.neutral) {
							that.neutral = false;
						}
					}
					if (that.harddownLast && that.vmove > 0.9) {
						that.harddown = 6;
					}
					if (that.harddown) {
						that.harddownLast = 0;
					}
					if (that.harddownLast && !that.down) {
						that.harddownLast = 0;
					}

					if (that.hardleftLast > 0) {
						that.hardleftLast--;
					}
					if (that.hardleft > 0) {
						that.hardleft--;
						if (that.hmove > -0.9) {
							that.hardleft = 0;
						}
					}
					if (that.left === 2) {
						that.hardleftLast = 5;
						that.fromneutral = that.neutral;
						if (that.neutral) {
							that.neutral = false;
						}
					}
					if (that.hardleftLast && that.hmove < -0.9) {
						that.hardleft = 6;
					}
					if (that.hardleft) {
						that.hardleftLast = 0;
					}
					if (that.hardleftLast && !that.left) {
						that.hardleftLast = 0;
					}

					if (that.hardrightLast > 0) {
						that.hardrightLast--;
					}
					if (that.hardright > 0) {
						that.hardright--;
						if (that.hmove < 0.9) {
							that.hardright = 0;
						}
					}
					if (that.right === 2) {
						that.hardrightLast = 5;
						that.fromneutral = that.neutral;
						if (that.neutral) {
							that.neutral = false;
						}
					}
					if (that.hardrightLast && that.hmove > 0.9) {
						that.hardright = 6;
					}
					if (that.hardright) {
						that.hardrightLast = 0;
					}
					if (that.hardrightLast && !that.right) {
						that.hardrightLast = 0;
					}
					that.frame++;
				};
				this.angle = function () {
					return computeAngle(this.hmove, this.vmove);
				};
				this.rangle = function () {
					return computeAngle(this.hright, this.vright);
				};
				this.angleX = function () {
					return angleX[computeAngle(this.hmove, this.vmove)];
				};
				this.angleY = function () {
					return angleY[computeAngle(this.hmove, this.vmove)];
				};
				this.frame = 0;
				this.hook = undefined;
				this.fromneutral = false;
				this.neutral = true;
				this.control = controlCharacter;
			};
		}()),
		readyKeyboardControllers = function (hostElement) {
			//buttonMap = ['attack', 'jump', 'special', 'jump', 'grab', 'grab', 'shield', 'shield', 'select', 'start', /*movedown*/'jump', /*rightdown*/'attack', 'dup', 'ddown', 'dleft', 'dright'],
			//axisMap = ['hmove', 'vmove', 'hright', 'vright'],
			//axes 65, 68, 87, 83, 75, 186, 79, 76, 16
			//btns    j  p  m  sp ,   e  '   q esc ent r  f  1  2  3  4
			//buttons 74 80 77 32 188 69 222 81 27 13  82 70 49 50 51 52
			var code,
				evt,
				checkex = /[\w \.\']/,
				applyKeydown = function (gamepad) {
					if (gamepad.keydown(code)) {
						evt.preventDefault();
					}
				},
				applyKeyup = function (gamepad) {
					if (gamepad.keyup(code)) {
						evt.preventDefault();
					}
				};
			hostElement.addEventListener('keydown', function (e) {
				if (!e.ctrlKey) {
					code = e.keyCode;
					evt = e;
					keyboardGamepads.forEach(applyKeydown);
					if (checkex.test(String.fromCharCode(e.keyCode))) {
						typed += e.shiftKey ? String.fromCharCode(e.keyCode) : String.fromCharCode(e.keyCode).toLowerCase();
					} else if (e.keyCode === 13) {
						entered = true;
					} else if (e.keyCode === 8) {
						backspaced = true;
					}
				}
			}, false);
			hostElement.addEventListener('keyup', function (e) {
				if (!e.ctrlKey) {
					code = e.keyCode;
					evt = e;
					keyboardGamepads.forEach(applyKeyup);
					e.preventDefault();
					dbg.log('code', e.keyCode);
				}
			}, false);
			keyboardGamepads.push(
				new KeyboardGamepad([74, 80, 77, 32, 188, 69, 222, 81, 27, 8, 82, 70, 49, 50, 51, 52],
									[65, 68, 87, 83, 75, navigator.userAgent.toString().indexOf('AppleWebKit') >= 0 ? 186 : 59, 79, 76, 16]
					),
				new KeyboardGamepad([96, 100, 97, 106, 99, 99, 107, 110, 45, 46, 102, 98, 36, 33, 35, 34],
									[37, 39, 38, 40, 103, 105, 111, 104, 17]
					)
			);
			keyboardControllers = keyboardGamepads.map(function (item) {
				return new Controller(item);
			});
		},
		absoluteX = 0,
		absoluteY = 0,
		absoluteW = width,
		absoluteH = height,
		camX = 0,
		camY = 0,
		panCamera = function (x, y) {
			camX += x;
			camY += y;
		},
		absoluteZ = 1,
		camZ = 1,
		zoomCamera = function (dist) {
			camZ *= dist;
		},
		computeCamera = function () {
			if (camX !== 0 || camY !== 0) {
				ctx.translate(camX, camY);
				absoluteX += camX;
				absoluteY += camY;
				camX = 0;
				camY = 0;
			}
			if (camZ !== 1) {
				ctx.scale(camZ, camZ);
				absoluteZ /= camZ;
				absoluteX /= camZ;
				absoluteY /= camZ;
				absoluteH = height * absoluteZ;
				absoluteW = width * absoluteZ;
				camZ = 1;
			}
		},
		performUndraws = (function () {
			var undrawCount,
				place;
			return function performUndraws() {
				undrawCount = undrawsCursor / 4; //using Uint16
				while (undrawCount--) {
					place = undrawCount * 4;
					ctx.clearRect(undraws[place], undraws[place + 1], undraws[place + 2], undraws[place + 3]);
				}
				undrawsCursor = 0;
				computeCamera();
			};
		}()),
		fps = (function () {
			var now = Date.now,
				start = performance.now(),
				last = start,
				cur = start,
				diff = 0,
				lostFrames = 0,
				timeFrame = 0,
				frameTime = Math.floor(1000 / 60),
				lastFrameAt = start,
				average = [],
				acrsr = 0,
				sum = function (n1, n2) {
					return n1 + n2;
				},
				run = function () {
					cur = performance.now();
					diff = cur - last;
					timeFrame = Math.floor((cur - start) / frameTime);
					if (unpaused) {
						frame = timeFrame - lostFrames;
						frameDiff = timeFrame - Math.floor((last - start) / frameTime);
					} else {
						frameDiff = 0;
						lostFrames += timeFrame - Math.floor((last - start) / frameTime);
					}
					last = cur;
					average[acrsr++] = diff;
					if (acrsr >= 30) {
						acrsr = 0;
					}
					//average.unshift(diff);
					//average.length = 30;
					frameRate = ((1000 / (average.reduce(sum) / average.length) * 100) | 0) / 100;
					return frameRate; //returns approx fps
				};
			average.length = 30;
			return run;
		}()),
		stopwatch = (function () {
			var startTimes = [];
			return {
				start: function () {
					startTimes.push(performance.now());
				},
				stop: function (message) {
					if (message) {
						dbg.log(message + ': ' + (performance.now() - startTimes.pop()));
					} else {
						return performance.now() - startTimes.pop();
					}
				}
			};
		}()),
		rgba = (function () {
			var rgb = 'rgba(',
				c = ',',
				rp = ')',
				rgba = ['rgba(', 0, ',', 0, ',', 0, ',', 0, ')'];
			return function (r, g, b, a) {
				return rgb.concat(r, c, g, c, b, c, a, rp);
			};
		}()),
		hsv2rgb = (function () {
			var data = [0, 0, 0, 1],
				hue = 1 / 6;
			return function(h, s, v) {
				var r, g, b, i;
				if (s === 0) {
					r = v;
					g = v;
					b = v;
				} else {
					h = h / hue;
					i = h | 0;
					data[0] = v*(1-s);
					data[1] = v*(1-s*(h-i));
					data[2] = v*(1-s*(1-(h-i)));
					switch(i) {
						case 0:
							r = v;
							g = data[2];
							b = data[0];
							break;
						case 1:
							r = data[1];
							g = v;
							b = data[0];
							break;
						case 2:
							r = data[0];
							g = v;
							b = data[2];
							break;
						case 3:
							r = data[0];
							g = data[1];
							b = v;
							break;
						case 4:
							r = data[2];
							g = data[0];
							b = v;
							break;
						default:
							r = v;
							g = data[0];
							b = data[1];
							break;
					}
				}
				//return rgba(r * 255, g * 255, b * 255, 1);
				data[0] = r;
				data[1] = g;
				data[2] = b;
				return data;
			}
		}()),
		complements = [],
		rgbaByte = (function () {
			var colors = [];
			colors.length = 256;
			(function (colors) {
				var i,
					grey = 16,
					l = 256 - grey,
					c;
				for (i = 0; i < grey; i++) {
					c = (i >> 2) / 3 * 255 | 0;
					colors[i] = rgba(c, c, c, ((i & 3) + 1) / 4);
					complements[i] = ((grey - i) >> 2 << 2) + (i & 3);
					//complements[i] = rgba(1 - c, 1 - c, 1 - c, ((i & 3) + 1) / 4);
				}
				for (i = 0; i < l; i++) {
					if (i % 16 >= 8) {
						c = hsv2rgb((i >> 4) / 15, 1 - (i >> 2 & 3) / 8, 1);
					} else if (i % 16 < 4) {
						c = hsv2rgb((i >> 4) / 15, 1, 1 - ((i >> 2 & 3) + 2) / 5);
					} else {
						c = hsv2rgb((i >> 4) / 15, 1, 1);
					}
					colors[i + grey] = rgba(c[0] * 255 | 0, c[1] * 255 | 0, c[2] * 255 | 0, ((i & 3) + 1) / 4);
					//complements[i + grey] = rgba((1 - c[0]) * 255 | 0, (1 - c[1]) * 255 | 0, (1 - c[2]) * 255 | 0, ((i & 3) + 1) / 4);
					//complements[i + grey] = grey + (((l - i) >> 2 << 2) + (i & 3));
					complements[i + grey] = grey + ((((i + l / 2 + 16) % l) >> 2 << 2) + (i & 3));
					//colors[i] = rgba((i >> 6) * 85, (i >> 4 & 3) * 85, (i >> 2 & 3) * 85, ((i & 3) + 1) / 4);
				}
			}(colors));
			window.rgbaByte = colors;
			return colors;
		}()),
		approximateColor = function (r, g, b, a) {
			//order of operations works out perfectly for once
			return ((r / 255 * 3 + 0.5 | 0) << 6) + ((g / 255 * 3 + 0.5 | 0) << 4) + ((b / 255 * 3 + 0.5 | 0) << 2) + (a * 3 + 0.5 | 0);
		},
		angleX = [],
		angleY = (function () {
			var angleY = [],
				i,
				pi2 = Math.PI * 2;
			for (i = 0; i < 256; i++) {
				angleX[i] = Math.cos(i / 255 * pi2);
				angleY[i] = Math.sin(i / 255 * pi2);
			}
			angleX[64] = 0;
			angleX[190] = 0;
			angleY[128] = 0;
			return angleY;
		}()),
		computeAngle = function (dx, dy) {
			return Math.floor((Math.PI + Math.atan2(dy, dx)) / (Math.PI * 2) * 255);
		},
		preciseAngle = (function () {
			var container = [0, 0],
				pi2 = Math.PI * 2;
			return function (dx, dy) {
				var angle = (Math.PI + Math.atan2(dy, dx)) / pi2;
				container[0] = Math.cos(angle * pi2);
				container[1] = Math.sin(angle * pi2);
				return container;
			};
		}()),
		addAngle = function (angle1, angle2) {
			if (angle2 > 0) {
				return (angle1 + angle2) % 256;
			}
			return (angle1 + angle2) % 256 < 0 ? (angle1 + angle2) % 256 + 256 : (angle1 + angle2) % 256;
		},
		angleDiff = function (angle1, angle2) {
		},
		testHitBubbleCollisions = (function () {
			var i,
				cur,
				owner,
				type,
				x,
				y,
				radius,
				flags,
				hi,
				hx,
				hy,
				htype,
				totalRadius,
				s = hitbubbleData.size,
				h = s / 2,
				l,
				k1,
				k2,
				d1,
				d2,
				c1,
				c2,
				angle,
				index,
				hindex,
				hitbubbleOwner,
				binowner = hitbubbleBin.owner,
				bintype = hitbubbleBin.type,
				binx = hitbubbleBin.x,
				biny = hitbubbleBin.y,
				binsize = hitbubbleBin.size,
				binflags = hitbubbleBin.flags,
				bincolor = hitbubbleBin.color,
				bindamage = hitbubbleBin.damage,
				binknockback = hitbubbleBin.knockback,
				binkbscale = hitbubbleBin.kbscale,
				bindirection = hitbubbleBin.direction,
				binmaxdirection = hitbubbleBin.maxdirection,
				binlag = hitbubbleBin.lag,
				binselflag = hitbubbleBin.selflag,
				binstun = hitbubbleBin.stun,
				bindata = hitbubbleBin.data;
			return function testHitBubbleCollisions() {
				l = hitbubbleCount;
				for (i = 0; i < l; i++) {
					cur = i * s;
					owner = entities[hitbubbles[cur]];
					type = hitbubbles[cur + bintype];
					x = hitbubblesPos[i * h + binx];
					y = hitbubblesPos[i * h + biny];
					radius = hitbubbles[cur + binsize];
					flags = hitbubbles[cur + binflags];
					if (type !== 5 && type !== 8) {
						for (hi = i + 1; hi < l; hi++) {
							index = hi * s;
							hindex = hi * h;
							htype = hitbubbles[index + bintype];
							if (htype !== 5 && htype !== 8 && ((type === 6 && htype === 6) || (type !== 6 && htype !== 6))) {
								hx = hitbubblesPos[hindex + binx];
								hy = hitbubblesPos[hindex + biny];
								totalRadius = radius + hitbubbles[index + binsize];
								if ((Math.abs(x - hx) < totalRadius) && //square first for optimization; x first because widescreen: most likely to return false
										(Math.abs(y - hy) < totalRadius) &&
										(Math.sqrt(Math.pow(x - hx, 2) + Math.pow(y - hy, 2)) < totalRadius)) { //then circle
									hitbubbleOwner = entities[hitbubbles[index]];
									if (owner && hitbubbleOwner && owner !== hitbubbleOwner && owner.friendly !== hitbubbleOwner && owner.friendly !== hitbubbleOwner.friendly && owner.collided.indexOf(hitbubbleOwner) === -1) {
										//determine the winner of the clash
										d1 = hitbubbles[cur + bindamage];
										d2 = hitbubbles[index + bindamage];
										k1 = hitbubbles[cur + binknockback];
										k2 = hitbubbles[index + binknockback];
										dbg.log('collision', d1, d2, k1, k2);
										//dbg.log('collide ' + Math.abs((d1 + k1) - (d2 + k2)));
										if (type === 7) {
											//hitbox was a shield
											if (hitbubbleOwner.collided.indexOf(owner) === -1) {
												angle = hitbubbles[index + bindirection];
												
												if ((hitbubbles[index + binflags] & 1) === 1) {
													//if hitbubble's angle should be reflected vertically
													angle = computeAngle(angleX[angle], -angleY[angle]);
												}
												hitbubbleOwner.collided.push(owner);
												c1 = false;
												c2 = false;
												owner.lag = hitbubbles[index + binselflag] + hitbubbles[index + binlag];
												owner.lastShield.lastFrame = true;
												owner.lastShield.entity = hitbubbleOwner;
												owner.lastShield.damage = d2;
												owner.lastShield.knockback = k2;
												owner.lastShield.angle = angle;
												owner.lastShield.type = htype;
												owner.lastShield.stun = hitbubbles[index + binstun];
												owner.lastShield.flags = flags;
												playAudio('clash');
											}
										} else if (htype === 7) {
											//hitbox hit a shield
											angle = hitbubbles[cur + bindirection];
											if ((flags & 1) === 1) {
												//if hitbubble's angle should be reflected vertically
												angle = computeAngle(angleX[angle], -angleY[angle]);
											}
											owner.collided.push(hitbubbleOwner);
											c1 = false;
											c2 = false;
											owner.lag = hitbubbles[cur + binselflag] + hitbubbles[index + binlag];
											hitbubbleOwner.lastShield.lastFrame = true;
											hitbubbleOwner.lastShield.entity = owner;
											hitbubbleOwner.lastShield.damage = d1;
											hitbubbleOwner.lastShield.knockback = k1;
											hitbubbleOwner.lastShield.angle = angle;
											hitbubbleOwner.lastShield.type = type;
											hitbubbleOwner.lastShield.stun = hitbubbles[cur + binstun];
											hitbubbleOwner.lastShield.flags = flags;
											playAudio('clash');
										} else if (Math.abs(d1 - d2) < 32 || Math.abs(k1 - k2) < 32) {
											//draw
											c1 = true;
											c2 = true;
											playAudio('clash');
										} else if (d1 + k1 > d2 + k2) {
											//initiator won clash
											c1 = false;
											c2 = true;
										} else {
											//recipient won clash
											c1 = true;
											c2 = false;
										}
										if (c1) {
											owner.collided.push(hitbubbleOwner);
											owner.lastClash.lastFrame = true;
											owner.lastClash.entity = hitbubbleOwner;
											if (owner.animations[owner.animation].clash) {
												owner.setAnimation(owner.animations[owner.animation].clash, true);
											}
											if (owner.animations[owner.animation].clashed) {
												owner.animations[owner.animation].clashed();
											}
										}
										if (c2) {
											hitbubbleOwner.collided.push(owner);
											hitbubbleOwner.lastClash.lastFrame = true;
											hitbubbleOwner.lastClash.entity = hitbubbleOwner;
											if (hitbubbleOwner.animations[hitbubbleOwner.animation].clashed) {
												hitbubbleOwner.animations[hitbubbleOwner.animation].clashed();
											}
											if (hitbubbleOwner.animations[hitbubbleOwner.animation].clash) {
												hitbubbleOwner.setAnimation(hitbubbleOwner.animations[hitbubbleOwner.animation].clash, true);
											}
										}
									}
								}
							}
						}
					}
				}
			};
		}()),
		testCollisions = (function () {
			var i = 0,
				s = hitbubbleData.size,
				l,
				h = s / 2,
				x,
				y,
				hx,
				hy,
				index,
				hindex,
				radius,
				totalRadius,
				hitbubbleOwner,
				flags,
				damage,
				angle,
				maxangle,
				knockback,
				kbscale,
				computedAngle,
				type,
				stun,
				stale,
				staled,
				scale,
				staleSearch,
				kx,
				ky,
				binowner = hitbubbleBin.owner,
				bintype = hitbubbleBin.type,
				binx = hitbubbleBin.x,
				biny = hitbubbleBin.y,
				binsize = hitbubbleBin.size,
				binflags = hitbubbleBin.flags,
				bincolor = hitbubbleBin.color,
				bindamage = hitbubbleBin.damage,
				binknockback = hitbubbleBin.knockback,
				binkbscale = hitbubbleBin.kbscale,
				bindirection = hitbubbleBin.direction,
				binmaxdirection = hitbubbleBin.maxdirection,
				binlag = hitbubbleBin.lag,
				binselflag = hitbubbleBin.selflag,
				binstun = hitbubbleBin.stun,
				bindata = hitbubbleBin.data;
			return function testCollisions(hurtbubble) {
				if (!hurtbubble.owner.removed && hurtbubble.type !== 0 && hurtbubble.type !== 5 && hurtbubble.type !== 11) {
					i = 0;
					x = hurtbubble.x + hurtbubble.owner.x;
					y = hurtbubble.y + hurtbubble.owner.y;
					l = hitbubbleCount;
					radius = hurtbubble.radius;
					for (i = 0; i < l; i++) {
						index = i * s;
						hindex = i * h;
						hx = hitbubblesPos[hindex + binx];
						hy = hitbubblesPos[hindex + biny];
						type = hitbubbles[index + bintype];
						totalRadius = radius + hitbubbles[index + binsize];
						flags = hitbubbles[index + binflags];
						if (type !== 7 && //not shield
								((flags & 8) === 0 || !hurtbubble.owner.airborne) && //ground-only hitbubble
								((flags & 16) === 0 || hurtbubble.owner.airborne) && //air-only hitbubble
								(Math.abs(x - hx) < totalRadius) && //square collision first for optimization; x first because it's most likely to be false
								(Math.abs(y - hy) < totalRadius) &&
								(Math.sqrt(Math.pow(x - hx, 2) + Math.pow(y - hy, 2)) < totalRadius)) { //then circle
							//collision: hitbubble to hurtbubble
							hitbubbleOwner = entities[hitbubbles[index]];
							if (hitbubbleOwner && hurtbubble.owner !== hitbubbleOwner && hitbubbleOwner.friendly !== hurtbubble.owner && hitbubbleOwner.collided.indexOf(hurtbubble.owner) === -1 &&
									!(hurtbubble.owner.animations[hurtbubble.owner.animation].ungrabbable && type == 6)) {
								hurtbubble.hitBy(i);
								if (hitbubbleOwner.hit instanceof Function) {
									hitbubbleOwner.hit(hurtbubble, i);
								}
								hitbubbleOwner.collided.push(hurtbubble.owner);
								staled = !hitbubbleOwner.staleAs ? hitbubbleOwner.stale : hitbubbleOwner.staleAs.stale;
								staleSearch = staled.length;
								stale = 0;
								while (staleSearch--) {
									if (staled[staleSearch] === hitbubbleOwner.animation) {
										stale++;
									}
								}
								if (!hitbubbleOwner.animations[hitbubbleOwner.animation].hit) {
									hitbubbleOwner.animations[hitbubbleOwner.animation].hit = true;
									staled[staled.cursor++] = hitbubbleOwner.animation;
									staled.cursor %= 10;
								}
								hitbubbleOwner.lag += hitbubbles[index + binselflag];
								//hitbubbleOwner.lastInjury.damaged = damage;
								knockback = hitbubbles[index + binknockback] / 4;
								kbscale = hitbubbles[index + binkbscale] / 4;
								damage = hitbubbles[index + bindamage] / 4;
								//dbg.log('charged', hitbubbleOwner.animations[hitbubbleOwner.animation].scale, hitbubbleOwner.animations[hitbubbleOwner.animation].charged);
								if (hitbubbleOwner.animations[hitbubbleOwner.animation].scale && hitbubbleOwner.animations[hitbubbleOwner.animation].charged) {
									scale = hitbubbleOwner.animations[hitbubbleOwner.animation].charged * hitbubbleOwner.animations[hitbubbleOwner.animation].scale;
									knockback += knockback * scale;
									damage += damage * scale;
								}
								if (hurtbubble.type !== 4) {
									//if hurtbubble was not invincible
									if ((flags & 2) === 0) {
										//if hitbubble does not have fixed knockback
										knockback = knockback + kbscale * (hurtbubble.owner.damage / 100)
										//knockback = knockback + kbscale * (hurtbubble.owner.damage / 100) * (1 - Math.pow(stale / 10, 1.5) / 4);
									} else {
										//why did I even have this
										//knockback = knockback;
									}
									knockback *= hurtbubble.owner.weight;
									dbg.log(hurtbubble.owner.weight);
									maxangle = hitbubbles[index + binmaxdirection];
									angle = hitbubbles[index + bindirection];
									if (angle !== maxangle) {
										angle += Math.floor((maxangle - angle) * Math.min(hurtbubble.owner.damage / 100, 1));
									}
									if ((flags & 1) === 1) {
										//if hitbubble's angle should be reflected vertically
										angle = computeAngle(angleX[angle], -angleY[angle]);
									}
									if (((flags & 4) === 0 /* if hitbubble's angle is not fixed */) && hurtbubble.owner.controller && (Math.abs(hurtbubble.owner.controller.hmove) >= 0.1 || Math.abs(hurtbubble.owner.controller.vmove) >= 0.1)) {
										computedAngle = computeAngle(-hurtbubble.owner.controller.hmove, hurtbubble.owner.controller.vmove);
										//console.log('angle', angle, computedAngle);
										if (computedAngle >= angle) {
											computedAngle = computedAngle - angle;
											if (255 - computedAngle < computedAngle) {
												computedAngle = -(255 - computedAngle);
											}
										} else {
											computedAngle = angle - computedAngle;
											if (255 - computedAngle < computedAngle) {
												computedAngle = 255 - computedAngle;
											} else {
												computedAngle = -computedAngle;
											}
										}
										//console.log('angle', angle, computedAngle);
										if (Math.abs(computedAngle) > 64) {
											if (computedAngle >= 0) {
												computedAngle = 128 - computedAngle;
											} else {
												computedAngle = -128 - computedAngle;
											}
										}
										angle += computedAngle * 0.3;
										angle %= 256;
										if (angle < 0) {
											angle = 255 + angle;
										}
										angle = Math.floor(angle);
										//console.log('angle', angle, computedAngle);
										//console.log('computedangle', angle, computedAngle);
									}
									kx = angleX[angle] * knockback;
									ky = angleY[angle] * knockback;
									if (ky < 0) {
										ky *= hitbubbleOwner.arcWeight;
									}

									hurtbubble.owner.lag += hitbubbles[index + binlag];
									//hitbubbles[index + 7] & 1 --- facing direction flag
									//console.log('mv', hurtbubble.owner.dx, hurtbubble.owner.dx, kx, ky);
									if (hurtbubble.owner.stun) {
										hurtbubble.owner.dx = (hurtbubble.owner.dx / 2) + kx;
										hurtbubble.owner.dy = (hurtbubble.owner.dy / 2) + ky;
									} else if (knockback > 0) {
										hurtbubble.owner.dx = kx;
										hurtbubble.owner.dy = ky;
									}
									if (hurtbubble.owner.facing && kx > 0) {
										hurtbubble.owner.facing = false;
									} else if (!hurtbubble.owner.facing && kx < 0) {
										hurtbubble.owner.facing = true;
									}
									//console.log('aftr', hurtbubble.owner.dx, hurtbubble.owner.dx, kx, ky);
									damage *= 1 - stale / 20;
									stun = hitbubbles[index + binstun];
									hurtbubble.owner.stun = Math.max(Math.floor(Math.max(ky, 0) / hurtbubble.owner.arcSpeed + (stun - 32) / hurtbubble.owner.fallSpeed), 0);
									//hurtbubble.owner.stun = Math.max(Math.floor((Math.max(ky, 0) + ((stun - 32))) / hurtbubble.owner.fallSpeed), 0);
									//hurtbubble.owner.stun = Math.max(Math.floor((Math.max(ky, 0) + ((stun - 32) * (0.25 + hurtbubble.owner.damage * 0.01))) / hurtbubble.owner.fallSpeed), 0);
									hurtbubble.owner.damage += damage;
									hurtbubble.owner.lastInjury.lastFrame = true;
									hurtbubble.owner.lastInjury.entity = hitbubbleOwner;
									hurtbubble.owner.lastInjury.damage = damage;
									hurtbubble.owner.lastInjury.knockback = knockback;
									hurtbubble.owner.lastInjury.angle = angle;
									hurtbubble.owner.lastInjury.type = type;
									hurtbubble.owner.lastInjury.stun = stun;
									hurtbubble.owner.lastInjury.flags = flags;

									hitbubbleOwner.lastCollision.lastFrame = true;
									hitbubbleOwner.lastCollision.entity = hurtbubble.owner;
									hitbubbleOwner.lastCollision.damage = damage;
									hitbubbleOwner.lastCollision.knockback = knockback;
									hitbubbleOwner.lastCollision.angle = angle;
									hitbubbleOwner.lastCollision.type = type;
									hitbubbleOwner.lastCollision.stun = stun;
									hitbubbleOwner.lastCollision.flags = flags;
									if (hurtbubble.owner.stun > 0) {
										Effects.combo(hx, hy, kx, ky);
									}
									if (hitbubbleOwner.animations[hitbubbleOwner.animation].keyframeData.hitAudio) {
										playAudio(hitbubbleOwner.animations[hitbubbleOwner.animation].keyframeData.hitAudio);
									} else if (type === 6) {
										playAudio('grab');
									} else if (type === 1 || type === 2 || type === 3) {
										playAudio('hit');
										if (hurtbubble.owner.stun <= 0) {
											Effects.hit(hx, hy, kx, ky);
										}
									}
									if (hitbubbles[index + bintype] !== 6 && knockback > 0) {
										hurtbubble.owner.launched = true;
									}
								}
								//8 - damage; 9 - knockback; 10 - direction; 11 - lag
							}
						}
					}
				}
			};
		}()),
		entityAct = function (entity) {
			var landed = false,
				traceDown,
				traceLeft,
				traceRight,
				traceUp,
				slid = false,
				a,
				i,
				clipLeft,
				clipRight,
				grab,
				ledgegrabbed,
				landingAudio;
			if (!entity.removed) {
				if (!(entity.act && entity.act()) && entity instanceof Animatable) {
					entity.ly = entity.y;
					entity.lx = entity.x;
					if (entity.scheduledAnimation[0] !== null) {
						entity.setAnimation(entity.scheduledAnimation[0], entity.scheduledAnimation[1], entity.scheduledAnimation[2]);
						entity.scheduledAnimation[0] = null;
					}
					if (entity.lastCollision.lastFrame) {
						if (entity.animations[entity.animation].grabbed && entity.lastCollision.type === 6) {
							entity.animations[entity.animation].grabbed(entity, entity.controller, entity.animations[entity.animation]);
						}
						if (entity.animations[entity.animation].collided) {
							entity.animations[entity.animation].collided(entity, entity.controller, entity.animations[entity.animation]);
						}
					}
					if (entity.lastInjury.lastFrame && entity.animations[entity.animation].injured) {
						entity.animations[entity.animation].injured(entity, entity.controller);
					}
					if (entity.lastShield.lastFrame && entity.animations[entity.animation].shielded) {
						entity.animations[entity.animation].shielded(entity, entity.controller, entity.lastShield);
					}
					if (entity.lag && entity.stun && entity.controller) {
						//# smashdi sdi smash di
						if (entity.controller.hardleft === 6 || entity.controller.hardright === 6 || entity.controller.hardup === 6 || entity.controller.harddown === 6) {
							a = entity.controller.angle();
							entity.x -= entity.sdi * angleX[a];
							entity.y -= entity.sdi * angleY[a];
							console.log('left stick sdi');
						}
						if (entity.controller.rleft === 2 || entity.controller.rright === 2 || entity.controller.rup === 2 || entity.controller.rdown === 2) {
							a = entity.controller.rangle();
							entity.x -= entity.sdi * angleX[a];
							entity.y -= entity.sdi * angleY[a];
							console.log('right stick sdi');
						}
					}

					if (entity.launched) {
						if (entity.dy > 0 && !entity.airborne) {
							entity.airborne = true;
						}
						if (entity.airborne) {
							if (~entity.lastInjury.flags & 32) {
								entity.setAnimation('airhit', true);
							} else {
								entity.setAnimation('meteorhit', true);
							}
						} else {
							if ((entity.lastInjury.flags & 32) && entity.dy < -entity.launchResistance) {
								entity.setAnimation('bounced', true);
								entity.airborne = true;
								entity.dy = -entity.dy * 0.8;
								if (entity.lastInjury.stun) {
									entity.stun = Math.max(Math.floor(Math.max(entity.dy, 0) / entity.arcSpeed + (entity.lastInjury.stun - 32) / entity.fallSpeed), 0);
									//entity.stun = Math.max(Math.floor((Math.max(entity.dy, 0) + ((entity.lastInjury.stun - 32) / 2)) / entity.arcSpeed), 0);
								}
							} else {
								entity.setAnimation('hit', true);
							}
						}
						entity.launched = false;
					}
					if (entity.airborne) {
						if (!entity.lag) {
							entity.y -= entity.dy;
							if (entity.fastfall && entity.dy < 0) {
								entity.dy = -entity.maxFallSpeed;
								entity.fastfall = true;
							}
							if (entity.dy > -entity.maxFallSpeed) {
								if (!entity.stun || entity.dy < 0) {
									entity.dy -= !isNaN(entity.animations[entity.animation].gravity) ? entity.animations[entity.animation].gravity : entity.fallSpeed;
								} else {
									entity.dy -= !isNaN(entity.animations[entity.animation].gravity) ? entity.animations[entity.animation].gravity : entity.arcSpeed;
								}
								if (entity.dy < -entity.maxFallSpeed) {
									entity.dy = -entity.maxFallSpeed;
								}
							}
						}
						if (entity.animations[entity.animation].nodi !== true) {
							if (entity.di > 0 && entity.maxDI > entity.dx) {
								entity.dx = Math.min(entity.di + entity.dx, entity.maxDI);
							}
							if (entity.di < 0 && -entity.maxDI < entity.dx) {
								entity.dx = Math.max(entity.di + entity.dx, -entity.maxDI);
							}
						}
						if (!entity.lag) {
							entity.x += entity.dx;
							entity.dx *= entity.animations[entity.animation].aerodynamics || entity.aerodynamics;
							if (entity.dy < 0) {
								entity.dy *= entity.animations[entity.animation].fallFriction || entity.fallFriction;
							}
							if (entity.animations[entity.animation].aerodynamics) {
								entity.dy *= entity.animations[entity.animation].aerodynamics;
							}
						}
					} else {
						if (entity.platformDrop && !entity.platform.solid && entity.animation !== 'platformdrop') {
							if (entity.setAnimation('platformdrop')) {
								entity.dx += entity.platform.dx;
								entity.dy += entity.platform.dy;
							}
							entity.platformDrop = false;
						} else if (entity.platformDrop) {
							entity.platformDrop = false;
						}
						if (!entity.lag) {
							entity.x += entity.dx;
							entity.x += entity.slide;
							if (entity.animations[entity.animation].slideFriction) {
								entity.slide *= entity.animations[entity.animation].slideFriction;
							} else {
								entity.slide *= entity.slideFriction;
							}
							if (entity.animations[entity.animation].friction) {
								entity.dx *= entity.animations[entity.animation].friction;
							} else {
								entity.dx *= entity.friction;
							}
						}
					}
					if (!entity.phasing && !entity.phase) {
						if (entity.airborne) {
							traceDown = stage.traceDown(entity);
							if (traceDown !== false) {
								if (entity.platform.solid || !entity.animations[entity.animation].platformDroppable || !entity.controller.down) {
									entity.y = traceDown;
									landed = true;
								}
							}
						} else {
							if (entity.platform && entity.platform.dx) {
								entity.x += entity.platform.dx;
							}
							if (entity.platform && entity.x > entity.platform.x2 && stage.findPlatformLeft(entity.platform.x2, entity.platform.y2)) {
								entity.platform = stage.findPlatformLeft(entity.platform.x2, entity.platform.y2);
								entity.y = entity.platform.yAt(entity.x);
							} else if (entity.platform && entity.x < entity.platform.x && stage.findPlatformRight(entity.platform.x, entity.platform.y)) {
								entity.platform = stage.findPlatformRight(entity.platform.x, entity.platform.y);
								entity.y = entity.platform.yAt(entity.x);
							} else if (entity.platform && entity.x >= entity.platform.x && entity.x <= entity.platform.x2) {
								entity.y = entity.platform.yAt(entity.x);
							} else {
								if (!entity.platform || Math.abs(entity.dx) > 1) {
									slid = true;
								} else if (entity.animations[entity.animation].type !== 0) {
									if (entity.x >= entity.platform.x2) {
										clipRight = entity.platform.x2;
										entity.x = entity.platform.x2;
										entity.y = entity.platform.yAt(entity.x);
										if (entity.slide < 1 && entity.slide > -1) {
											entity.slide = 0;
										}
									} else {
										clipLeft = entity.platform.x;
										entity.x = entity.platform.x;
										entity.y = entity.platform.yAt(entity.x);
										if (entity.slide < 1 && entity.slide > -1) {
											entity.slide = 0;
										}
									}
								} else if (entity.facing) {
									if (entity.x >= entity.platform.x2) {
										entity.x = entity.platform.x2;
										entity.y = entity.platform.yAt(entity.x);
										entity.slide = 0;
									} else {
										slid = true;
									}
								} else {
									if (entity.x <= entity.platform.x) {
										entity.x = entity.platform.x;
										entity.y = entity.platform.yAt(entity.x);
										entity.slide = 0;
									} else {
										slid = true;
									}
								}
								if (slid) {
									entity.airborne = true;
									entity.dx += entity.slide;
									if (entity.animations[entity.animation].slid !== 'continue') {
										entity.dy = 0;
										if (entity.platform) {
											entity.dx += entity.platform.dx;
											entity.dy += entity.platform.dy;
										}
										if (entity.animations[entity.animation].slid && entity.animations[entity.animation].slid !== 'stop') {
											entity.setAnimation(entity.animations[entity.animation].slid, true);
										} else {
											if (entity.animations[entity.animation].type === 0) {
												entity.setAnimation('airborne', true);
											} else {
												entity.setAnimation('airborne-slid', true);
											}
										}
									}
								}
							}
						}
						if (!entity.lag) {
							if (entity.x <= entity.lx) {
								traceLeft = stage.traceLeft(entity);
								if (traceLeft !== false) {
									entity.x = traceLeft;
									entity.dx *= 0.8;
									if (entity.animations[entity.animation].techable) {
										if (entity.teched > 12) {
											entity.dx = 0;
											entity.dy = 0;
											entity.stun = 0;
											entity.facing = true;
											entity.setAnimation('walltech');
											entity.animations[entity.animation].tech && entity.animations[entity.animation].tech(entity, 2);
										}  else {
											entity.dx = -entity.dx;
											entity.dy = entity.dy < 0 ? entity.dy : -entity.dy;
											entity.lag = 8;
											entity.animations[entity.animation].missedtech && entity.animations[entity.animation].missedtech(entity, 2);
										}
									}
								}
							}
							if (entity.x >= entity.lx) {
								traceRight = stage.traceRight(entity);
								if (traceRight !== false) {
									entity.x = traceRight;
									entity.dx *= 0.8;
									if (entity.animations[entity.animation].techable) {
										if (entity.teched > 12) {
											entity.dx = 0;
											entity.dy = 0;
											entity.stun = 0;
											entity.facing = false;
											entity.setAnimation('walltech');
											entity.animations[entity.animation].tech && entity.animations[entity.animation].tech(entity, 4);
										}  else {
											entity.dx = -entity.dx;
											entity.dy = entity.dy < 0 ? entity.dy : -entity.dy;
											entity.lag = 8;
											entity.animations[entity.animation].missedtech && entity.animations[entity.animation].missedtech(entity, 4);
										}
									}
								}
							}
							if (entity.airborne) {
								traceUp = stage.traceUp(entity);
								if (traceUp !== false) {
									entity.y = traceUp - entity.height;
									entity.dy *= 0.8;
									if (entity.animations[entity.animation].techable) {
										if (entity.teched > 12) {
											entity.dx = 0;
											entity.dy = 0;
											entity.stun = 0;
											entity.setAnimation('rooftech');
											entity.airjumps = 0;
											entity.animations[entity.animation].tech && entity.animations[entity.animation].tech(entity, 1);
										} else {
											entity.dy = entity.dy < 0 ? entity.dy : -entity.dy;
											entity.lag = 8;
											entity.animations[entity.animation].missedtech && entity.animations[entity.animation].missedtech(entity, 1);
										}
									}
								}
							}
						}
					} else if (entity.phase) {
						entity.phase = false;
					}
					if (landed && !entity.lag) {
						entity.dy = 0;
						if (entity.animations[entity.animation].type === 0) {
							entity.slide = entity.dx;
							entity.dx = 0;
						} else {
							entity.slide = 0;
						}
						entity.airjumps = 0;
						landingAudio = entity.landingAudio;
						entity.airborne = false;
						entity.fastfall = false;
						if (entity.slide >= 0) {
							entity.slide -= entity.platform.dx;
							if (entity.slide < 0) {
								entity.dx += entity.slide;
								entity.slide = 0;
							}
						} else {
							entity.slide -= entity.platform.dx;
							if (entity.slide > 0) {
								entity.dx += entity.slide;
								entity.slide = 0;
							}
						}
						if (entity.animations[entity.animation].cancel) {
							if (entity.animations[entity.animation].techable && entity.teched > 12) {
								if (entity.controller.left) {
									if (!entity.facing) {
										entity.setAnimation('techforward', true);
									} else {
										entity.setAnimation('techbackward', true);
									}
								} else if (entity.controller.right) {
									if (entity.facing) {
										entity.setAnimation('techforward', true);
									} else {
										entity.setAnimation('techbackward', true);
									}
								} else {
									entity.stun = 0;
									entity.setAnimation('tech', true);
								}
								entity.teched = 0;
								entity.animations[entity.animation].tech && entity.animations[entity.animation].tech(entity, 3);
							} else {
								if (entity.animations[entity.animation].cancel !== 'continue') {
									entity.setAnimation(entity.animations[entity.animation].cancel, true);
								}
								if (entity.lagCancel > 0) {
									entity.lagCancel = 0;
									if (entity.lagCancelAudio) {
										landingAudio = entity.lagCancelAudio;
										entity.flash = 8;
									}
									entity.animations[entity.animation].ticks = 2;
								}
								entity.animations[entity.animation].missedtech && entity.animations[entity.animation].missedtech(entity, 3);
							}
						} else {
							entity.setAnimation(entity.defaultAnimation || 'idle', true);
						}
						landingAudio && playAudio(landingAudio);
						Effects.airjump(entity.x, entity.y - 3, entity.color);
					}
					if (entity.buffertime > 0 && entity.buffer) {
						//dbg.log(entity.buffer);
						if (entity.setAnimation(entity.buffer)) {
							entity.buffertime = 0;
							entity.buffer = '';
						} else {
							entity.buffertime--;
						}
					}
					if (entity.lagCancel > 0) {
						entity.lagCancel--;
					}
					if (entity.flash > 0) {
						entity.flash--;
					}
					if (entity.stun > 0 && !entity.lag) {
						entity.stun--;
					}
					if (entity.shield < 1) {
						entity.shield += entity.shieldRegen;
						if (entity.shield > 1) {
							entity.shield = 1;
						}
					}
					if (!entity.airborne) {
						if (!isNaN(clipRight) && entity.x > clipRight) {
							entity.x = clipRight;
							entity.animations[entity.animation].resetBubbles();
						}
						if (!isNaN(clipLeft) && entity.x < clipLeft) {
							entity.x = clipLeft;
							entity.animations[entity.animation].resetBubbles();
						}
					}
					if (!entity.lag && !entity.animations[entity.animation].keyframeData.noLedgeGrab && entity.airborne && entity.grabRadius && (!entity.controller || !entity.controller.down) &&
							((entity.grabDirections & 1 && entity.dy >= 0) || (entity.grabDirections & 2 && entity.dx <= 0) || (entity.grabDirections & 4 && entity.dy <= 0) || (entity.grabDirections & 8 && entity.dx >= 0))) {
						i = stage.elements.length;
						while (i--) {
							grab = stage.elements[i].testLedgeGrab(entity);
							if (grab > 0) {
								if (!((grab === 1 && entity.controller.left) || (grab === 2 && entity.controller.right))) {
									ledgegrabbed = stage.elements[i];
								}
								break;
							}
						}
					}
					if (!ledgegrabbed && entity.grabDirections & 32) {
						i = stage.elements.length;
						while (i--) {
							if (stage.elements[i].fastGrab) {
								grab = stage.elements[i].testLedgeGrab(entity);
								if (grab > 0) {
									if (!((grab === 1 && entity.controller.left) || (grab === 2 && entity.controller.right))) {
										ledgegrabbed = stage.elements[i];
									}
									break;
								}
							}
						}
					}
					if (ledgegrabbed) {
						entity.airborne = false;
						entity.dx = 0;
						entity.dy = 0;
						entity.airjumps = 0;
						entity.slide = 0;
						entity.fastfall = false;
						entity.platform = ledgegrabbed;
						if (grab === 1) {
							entity.x = ledgegrabbed.x;
							entity.y = ledgegrabbed.y;
							entity.facing = true;
						} else if (grab === 2) {
							entity.x = ledgegrabbed.x2;
							entity.y = ledgegrabbed.y2;
							entity.facing = false;
						}
						entity.setAnimation(entity.animations[entity.animation].ledgeGrab ? entity.animations[entity.animation].ledgeGrab : 'ledgegrab', true);
					}

					entity.animations[entity.animation].step();
					if (entity.invulnerable) {
						entity.invulnerable--;
						i = entity.hurtbubbles.length;
						while (i--) {
							if (entity.hurtbubbles[i].type !== 5) {
								entity.hurtbubbles[i].type = 4;
							}
						}
					}
					if (entity.teched > 0) {
						entity.teched--;
					}
					if (entity.x < stage.blastLeft || entity.x > stage.blastRight || entity.y < stage.blastTop || entity.y > stage.blastBottom) {
						if (entity.x < stage.blastLeft) {
							//panCamera(1000, 0);
						}
						if (entity.x > stage.blastRight) {
							//panCamera(-1000, 0);
						}
						if (entity.y < stage.blastTop) {
							//panCamera(0, 1000);
						}
						if (entity.y > stage.blastBottom) {
							//panCamera(0, -1000);
						}
						entity.damage = 0;
						entity.stocks--;
						entity.points--;
						entity.reset();
						entity.x = stage.spawns[0];
						entity.y = stage.spawns[1];
						if (entity.permadeath) {
							entity.removed = true;
						} else {
							entity.setAnimation('respawn', true);
							entity.animations['respawn'].step();
							playAudio('blastzone2');
						}
					}
					if (entity.lastCollision.lastFrame || entity.lastInjury.lastFrame || entity.lastClash.lastFrame || entity.lastShield.lastFrame) {
						entity.lastCollision.lastFrame = entity.lastInjury.lastFrame = entity.lastClash.lastFrame = entity.lastShield.lastFrame = false;
					}
				}
			}
		},
		checkConnections = (function () {
			var connectKeyboard = function (controller) {
					if (!controller.connected) {
						controller.poll();
						if (controller.select) {
							dbg.log('keyboard connected');
							controller.connected = true;
							connected.push(controller);
							if (activeMode.connect) {
								activeMode.connect(controller);
							}
						}
					}
				},
				noGamepads = function () {
					keyboardControllers.forEach(connectKeyboard);
				},
				check = function () {
					var pads = gamepads(),
						i,
						controller;
					if (pads) {
						i = pads.length;
						while (i--) {
							if (pads[i] && !pads[i].connected) {
								dbg.log(pads[i].id + ' connected');
								pads[i].connected = true;
								controller = new Controller(pads[i]);
								connected.push(controller);
								if (activeMode.connect) {
									activeMode.connect(controller);
								}
							}
						}
					} else {
						dbg.log('Your browser does not support the Gamepad API.');
						checkConnections = noGamepads;
					}
					keyboardControllers.forEach(connectKeyboard);
				};
			return check;
		}()),
		fixedCamera = function (x, y, zoom) {
			panCamera(-absoluteX + x, -absoluteY + y);
			zoomCamera(absoluteZ * zoom);
			//panCamera(x, y);
			//zoomCamera(zoom);
			return function () {
			};
		},
		fixedScreen = function (x, y, w, h) {
			var wRatio,
				hRatio,
				ratio,
				xOffset,
				yOffset,
				fixedScreen = function () {
				},
				set = function (nx, ny, nw, nh) {
					x = nx;
					y = ny;
					w = nw;
					h = nh;
					refresh();
				},
				refresh = function () {
					wRatio = width / w;
					hRatio = height / h;
					ratio = Math.min(wRatio, hRatio);
					xOffset = (width - w * ratio) / ratio / 2;
					yOffset = (height - h * ratio) / ratio / 2;
					computeCamera();
					zoomCamera(absoluteZ);
					panCamera(-absoluteX, -absoluteY);
					zoomCamera(ratio);
					computeCamera();
					panCamera(-x + xOffset, -y + yOffset);
					setFullRefresh(false);
				};
			fixedScreen.set = set;
			fixedScreen.refresh = refresh;
			refresh();
			return fixedScreen;
		},
		fitOnScreen = (function () {
			var minX = null,
				maxX = null,
				minY = null,
				maxY = null,
				save = false,
				fixed,
				smoothness = 10,
				fit = function (entity) {
					if (!entity.removed && entity.follow) {
						if (minX === null) {
							minX = entity.x;
							maxX = entity.x;
							minY = entity.y;
							maxY = entity.y;
						} else {
							if (entity.x < minX) {
								minX = entity.x;
							}
							if (entity.x > maxX) {
								maxX = entity.x;
							}
							if (entity.y < minY) {
								minY = entity.y;
							}
							if (entity.y > maxY) {
								maxY = entity.y;
							}
						}
					}
				},
				run = function fitOnScreen(smooth) {
					var i, x, y, strength, maxd;
					if (save) {
						if (stage) {
							for (i = 0; i < stage.anchors.length; i += 3) {
								x = stage.anchors[i];
								y = stage.anchors[i + 1];
								strength = stage.anchors[i + 2];
								if (x < minX) {
									minX = minX + (x - minX) * strength;
								}
								if (x > maxX) {
									maxX = maxX + (x - maxX) * strength;
								}
								if (y < minY) {
									minY = minY + (y - minY) * strength;
								}
								if (y > maxY) {
									maxY = maxY + (y - maxY) * strength;
								}
							}
						}
						minX -= width / 6;
						maxX += width / 6;
						minY -= width / 6;
						maxY += width / 6;
						if (!smooth) {
							smooth = smoothness;
						}
						maxd = smooth / absoluteZ;
						panCamera(Math.min(Math.max((-minX + (width * absoluteZ - (maxX - minX)) / 2 - absoluteX) / smooth, -maxd), maxd), Math.min(Math.max((-minY + (height * absoluteZ - (maxY - minY)) / 2 - absoluteY) / smooth, -maxd), maxd), maxd);
						if (maxX - minX !== width * absoluteZ) {
							zoomCamera(Math.min(Math.max(Math.min((width * absoluteZ) / (maxX - minX) - 1, (height * absoluteZ) / (maxY - minY) - 1) / smooth, -0.1), 0.1) + 1);
						}
						save = false;
					} else {
						minX = null;
						maxX = null;
						minY = null;
						maxY = null;
						save = true;
						return fit;
					}
				},
				fitOnScreen = function () {
					entities.forEach(run());
					run();
				};
			fitOnScreen.refresh = function () {
				var i, x, y, strength;
				entities.forEach(run());
				if (stage) {
					for (i = 0; i < stage.anchors.length; i += 3) {
						x = stage.anchors[i];
						y = stage.anchors[i + 1];
						strength = stage.anchors[i + 2];
						if (x < minX) {
							minX = minX + (x - minX) * strength;
						}
						if (x > maxX) {
							maxX = maxX + (x - maxX) * strength;
						}
						if (y < minY) {
							minY = minY + (y - minY) * strength;
						}
						if (y > maxY) {
							maxY = maxY + (y - maxY) * strength;
						}
					}
				}
				minX -= width / 6;
				maxX += width / 6;
				minY -= width / 6;
				maxY += width / 6;

				fixedScreen(minX, minY, maxX - minX, maxY - minY);
				setFullRefresh(true);
				run();
			};
			return function () {
				setFullRefresh(true);
				return fitOnScreen;
			};
		}()),
		cameraType = fitOnScreen(),
		swapRemoved = function (from, to, match) {
			var i,
				l = from.length,
				r = 0;
			for (i = 0; i < l; i++) {
				if (from[i].removed === match) {
					to.push(from[i]);
					r++;
					from[i].index = to.length - 1;
					from[i].present = !match;
				} else {
					if (r > 0) {
						from[i].index -= r;
						from[i - r] = from[i];
					}
				}
			}
			from.length -= r;
			from.count -= r;
			to.count += r;
		},
		frameTick = (function () {
			var i, s, l, h, c,
				updateController = function (controller) {
					controller.poll();
					controller.control();
				},
				drawStageElement = function (element) {
					var qty, x;
					drawLine(element.x, element.y, element.x2, element.y2);
					if (element.leftOccupied) {
						fillCircle(element.x, element.y, 8);
					}
					if (element.rightOccupied) {
						fillCircle(element.x2, element.y2, 8);
					}
					if ((element.bottom || element.left || element.right || element.bottomless || (element.top && !element.solid)) && (element.x !== element.x2)) {
						ctx.globalAlpha = 0.5;
						drawLine(element.x, element.y + 3, element.x2, element.y2 + 3);
						ctx.globalAlpha = 0.3;
						drawLine(element.x, element.y + 6, element.x2, element.y2 + 6);
						ctx.globalAlpha = 0.15;
						drawLine(element.x, element.y + 9, element.x2, element.y2 + 9);
						ctx.globalAlpha = 1;
						if (unpaused) {
							element.particles += Math.random() * element.length / 1000;
							qty = element.particles | 0;
							element.particles %= 1;
							while (qty--) {
								x = element.x + Math.random() * element.w;
								Effects.stageBeam(x + Math.random() * 10 - 5, element.yAt(x) + 3 + Math.random() * 10 - 5, Math.random() * 20 - 10, Math.random() * -30, 2, 0);
							}
						}
					}
				},
				msFpsCache = [],
				msFramerate = function (ms) {
					/*ms = Math.floor(ms * 100);
					if (!msFpsCache[ms]) {
						dbg.log('new ' + ms / 100);
						msFpsCache[ms] = (ms / 100 < 10 ? ' ' : '') + ms + 'ms,' + ('   ' + (10 / ms).toFixed(2)).substr(((10 / ms).toFixed(2) + '').length - 4) + 'fps';
					}
					return msFpsCache[ms];*/
					var time = (ms * 1000 | 0);
					return '00000'.substr(time.toString().length) + time + 'ns,' + ('   ' + (1000 / ms).toFixed(2)).substr(((1000 / ms).toFixed(2) + '').length - 4) + 'fps';
				},
				renderFpsCache = [],
				renderFramerate = function (ms) {
					if (!renderFpsCache[ms]) {
						renderFpsCache[ms] = (ms * 1000 | 0) + 'ns,' + ('   ' + (1000 / ms).toFixed(2)).substr(((1000 / ms).toFixed(2) + '').length - 4) + 'fps';
					}
					return renderFpsCache[ms];
				},
				tick = function frameTick(time) {
					var reader, read, strokeByte, fillByte, ls, lf, particleByte, ra, pa, c, sc, i, j, bd, pt, ox, oy, xm, ym, hb;
					//dbg.log('between frames', stopwatch.stop());
					stopwatch.start();
					checkConnections();
					if (connected.length === 0) {
						dbg.log('blastpals, prototype of Antistatic, as of Feb 21 2013 (initial repo commit)');
						dbg.log('Copyright (c) 2013 bluehexagons');
						dbg.log('Press escape to connect the keyboard as a controller. Press the A button to connect a gamepad.');
					}
					fps();
					gamepads(); //update
					if (frameDiff > 30) {
						frameDiff = 0;
					}
					fullRefresh && ctx.clearRect(-absoluteX, -absoluteY, absoluteW, absoluteH);
					fullRefresh || performUndraws();
					computeCamera();
					while (frameDiff--) {
						clearHitbubbles();
						swapRemoved(entities, removed, true);
						swapRemoved(removed, entities, false);
						connected.forEach(updateController);
						if (unpaused) {
							activeMode();
							entities.forEach(entityAct);
							testHitBubbleCollisions();
							hurtbubbles.forEach(testCollisions);
							stage.act();
							cameraType();
						} else {
							activeMode.paused && activeMode.paused();
						}
					}
					i = mouseListeners.length;
					while (i--) {
						mouseListeners[i]();
					}
					Effects.renderBottom();

					l = entities.length;
					strokeByte = 3;
					ls = strokeByte;
					ctx.strokeStyle = rgbaByte[strokeByte];
					for (i = 0; i < l; i++) {
						if (entities[i].backdrop) {
							ox = entities[i].x + entities[i].hurtbubbles[entities[i].backdropFollow].x;
							oy = entities[i].y + entities[i].hurtbubbles[entities[i].backdropFollow].y;

							strokeByte = 15;
							bd = entities[i].backdrop;
							j = bd.length;
							pt = bd[j-- - 1];
							ctx.beginPath();
							ctx.moveTo(pt[0] + ox, pt[1] + oy);
							while (j--) {
								pt = bd[j];
								if (pt.length === 2) {
									//linear
									ctx.lineTo(pt[0] + ox, pt[1] + oy);
								} else if (pt.length === 4) {
									//quadratic curve
									ctx.quadraticCurveTo(pt[0] + ox, pt[1] + oy, pt[2] + ox, pt[3] + oy);
								} else if (pt.length === 6) {
									//bezier curve
									ctx.bezierCurveTo(pt[0] + ox, pt[1] + oy, pt[2] + ox, pt[3] + oy, pt[4] + ox, pt[5] + oy);
								}
							}
							if (strokeByte !== ls) {
								ctx.strokeStyle = rgbaByte[strokeByte];
								ls = strokeByte;
							}
							ctx.stroke();
						}
					}

					l = entities.length;
					fillByte = 3;
					lf = fillByte;
					ctx.fillStyle = rgbaByte[fillByte];
					for (i = 0; i < l; i++) {
						if (entities[i].backdrop) {
							/*j = entities[i].hurtbubbles.length;
							hb = entities[i].hurtbubbles[j-- - 1];
							ox = hb.x - hb.radius;
							oy = hb.y - hb.radius;
							mx = hb.x + hb.radius;
							my = hb.y + hb.radius;
							dbg.dump(hb);
							while (j--) {
								hb = entities[i].hurtbubbles[j];
								if (hb.x - hb.radius < ox) {
									ox = hb.x - hb.radius;
								}
								if (hb.y - hb.radius < oy) {
									oy = hb.y - hb.radius;
								}
								if (hb.x + hb.radius > mx) {
									mx = hb.x + hb.radius;
								}
								if (hb.y + hb.radius > my) {
									my = hb.y + hb.radius;
								}
							}
							ox = (ox + mx) / 2 + entities[i].x;
							oy = (oy + my) / 2 + entities[i].y;*/
							/*if (entities[i].activeAnimation && (entities[i].activeAnimation.xOffset || entities[i].activeAnimation.yOffset)) {
								if (entities[i].facing) {
									ox = entities[i].x + entities[i].activeAnimation.xOffset;
								} else {
									ox = entities[i].x + -entities[i].activeAnimation.xOffset;
								}
								oy = entities[i].y + entities[i].activeAnimation.yOffset;
							} else {
								ox = entities[i].x;
								oy = entities[i].y;
							}*/
							ox = entities[i].x + entities[i].hurtbubbles[entities[i].backdropFollow].x;
							oy = entities[i].y + entities[i].hurtbubbles[entities[i].backdropFollow].y;

							fillByte = 3;
							bd = entities[i].backdrop;
							j = bd.length;
							pt = bd[j-- - 1];
							ctx.beginPath();
							ctx.moveTo(pt[0] + ox, pt[1] + oy);
							while (j--) {
								pt = bd[j];
								if (pt.length === 2) {
									//linear
									ctx.lineTo(pt[0] + ox, pt[1] + oy);
								} else if (pt.length === 4) {
									//quadratic curve
									ctx.quadraticCurveTo(pt[0] + ox, pt[1] + oy, pt[2] + ox, pt[3] + oy);
								} else if (pt.length === 6) {
									//bezier curve
									ctx.bezierCurveTo(pt[0] + ox, pt[1] + oy, pt[2] + ox, pt[3] + oy, pt[4] + ox, pt[5] + oy);
								}
							}
							if (fillByte !== lf) {
								ctx.fillStyle = rgbaByte[fillByte];
								lf = fillByte;
							}
							ctx.fill();
						}
						//entities[i].backgroundEffect && entities[i].backgroundEffect(entities[i]);
					}

					ctx.fillStyle = rgbaByte[163];
					ctx.strokeStyle = rgbaByte[15];
					stage && stage.elements.forEach(drawStageElement);
					//ctx.fillStyle = rgbaByte[31];
					//debug render hurt/hit boxes
					//drawHollowRect(stage.blastLeft, stage.blastTop, stage.blastRight - stage.blastLeft, stage.blastBottom - stage.blastTop);
					Effects.render();
					
					if (dbg.drawHitbubbles) {
						s = hitbubbleData.size;
						l = hitbubbleCount;
						h = s / 2;
						ctx.strokeStyle = rgbaByte[14];
						for (i = 0; i < l; i++) {
							//c = hitbubbles[hitbubblesPos[i * h + 1], hitbubblesPos[i * h + 2], i * s + 8];
							c = hitbubbles[i * s + 8];
							ra = Math.random() * 255 | 0;
							pa = hitbubbles[i * s + 12] + (Math.random() * (hitbubbles[i * s + 13] - hitbubbles[i * s + 12]) | 0);
							unpaused && Effects.hitbubble(
								hitbubblesPos[i * h + 1], hitbubblesPos[i * h + 2],
								//5, 5,
								//(angleX[ra] * Math.random() * 30 - 15), (angleY[ra] * Math.random() * 30 - 15),
								(angleX[ra] * Math.random() * 10 - 5) + (hitbubbles[i * s + 10] === 0 ? 0 : ((hitbubbles[i * s + 7] & 1) ? -angleX[pa] : angleX[pa]) * (hitbubbles[i * s + 6])),
								(angleY[ra] * Math.random() * 10 - 5) + (hitbubbles[i * s + 10] === 0 ? 0 : angleY[pa] * (hitbubbles[i * s + 6])),
								(hitbubbles[10] + Math.random() * hitbubbles[11]) / 4 | 0,
								hitbubbles[i * s + 6], c);
							//dbg.log('hbco', c >> 2 << 2);
							if (ctx.fillStyle !== rgbaByte[c]) {
								ctx.fillStyle = rgbaByte[c];
							}
							fillCircle(hitbubblesPos[i * h + 1], hitbubblesPos[i * h + 2], hitbubbles[i * s + 6]);
							if (hitbubbles[i * s + 10] > 0) {
								if (ctx.strokeStyle !== rgbaByte[14]) {
									ctx.strokeStyle = rgbaByte[14];
								}
								drawLine(hitbubblesPos[i * h + 1], hitbubblesPos[i * h + 2], hitbubblesPos[i * h + 1] + hitbubbles[i * s + 6] * ((hitbubbles[i * s + 7] & 1) ? -angleX[hitbubbles[i * s + 12]] : angleX[hitbubbles[i * s + 12]]), hitbubblesPos[i * h + 2] - hitbubbles[i * s + 6] * angleY[hitbubbles[i * s + 12]]);
							}
							if (hitbubbles[i * s + 13] !== hitbubbles[i * s + 12]) {
								if (ctx.strokeStyle !== rgbaByte[2]) {
									ctx.strokeStyle = rgbaByte[2];
								}
								drawLine(hitbubblesPos[i * h + 1], hitbubblesPos[i * h + 2], hitbubblesPos[i * h + 1] + hitbubbles[i * s + 6] * ((hitbubbles[i * s + 7] & 1) ? -angleX[hitbubbles[i * s + 13]] : angleX[hitbubbles[i * s + 13]]), hitbubblesPos[i * h + 2] - hitbubbles[i * s + 6] * angleY[hitbubbles[i * s + 13]]);
							}
						}
					}
					if (dbg.drawHurtbubbles) {
						i = hurtbubbles.length;
						strokeByte = 15;
						fillByte = 254;
						ls = strokeByte;
						lf = fillByte;
						ctx.strokeStyle = rgbaByte[strokeByte];
						ctx.fillStyle = rgbaByte[fillByte];
						while (i--) {
							if (!hurtbubbles[i].owner.removed && hurtbubbles[i].type !== 0) {
								strokeByte = 15;
								fillByte = 254;
								particleByte = hurtbubbles[i].owner.color - 2;
								if (hurtbubbles[i].owner.animations[hurtbubbles[i].owner.animation].helpless) {
									strokeByte = hurtbubbles[i].owner.contrast;
									particleByte = hurtbubbles[i].owner.contrast;
								}
								if (hurtbubbles[i].type === 4) {
									fillByte = hurtbubbles[i].owner.color;
									//particleByte -= 2;
									//fillByte %= 256;
									//strokeByte = (hurtbubbles[i].owner.color + 1) % 256;
									strokeByte = 14;
									if (frame % 12 < 6) {
										fillByte -= 1;
										strokeByte -= 1;
										if (frame % 12 < 3) {
											fillByte -= 1;
											strokeByte -= 1;
										}
									} else if (frame % 12 > 9) {
										fillByte -= 1;
										strokeByte -= 1;
									}
								} else if (hurtbubbles[i].type === 5) {
									fillByte = hurtbubbles[i].owner.contrast - 1;
									fillByte %= 256;
									strokeByte = (hurtbubbles[i].owner.color + 1) % 256;
								} else {
									fillByte = hurtbubbles[i].owner.color;
									//particleByte -= 2;
									//strokeByte = 15;
								}
								if (hurtbubbles[i].owner.flash) {
									strokeByte -= 3;
									fillByte -= 2;
								} else if (hurtbubbles[i].owner.stun > 0) {
									fillByte -= 1;
									particleByte = hurtbubbles[i].owner.contrast - 1;
								} else if (hurtbubbles[i].type === 6) {
									fillByte -= 1;
									strokeByte -= 1;
								}
								if (strokeByte !== ls) {
									ctx.strokeStyle = rgbaByte[strokeByte];
									ls = strokeByte;
								}
								if (fillByte !== lf) {
									ctx.fillStyle = rgbaByte[fillByte];
									lf = fillByte;
								}
								ra = Math.random() * 255 | 0;
								//dbg.log('particle', fillByte, particleByte);
								unpaused && Effects.hurtbubble(hurtbubbles[i].x + hurtbubbles[i].owner.x, hurtbubbles[i].y + hurtbubbles[i].owner.y, hurtbubbles[i].owner.dx + hurtbubbles[i].owner.slide + (angleX[ra] * Math.random() * 10 - 5), hurtbubbles[i].owner.dy + (angleY[ra] * Math.random() * 10 - 5), hurtbubbles[i].radius, particleByte);
								drawCircle(hurtbubbles[i].x + hurtbubbles[i].owner.x, hurtbubbles[i].y + hurtbubbles[i].owner.y, hurtbubbles[i].radius);
							}
						}
					}
					if (dbg.drawLedgeGrab) {
						i = entities.length;
						ctx.fillStyle = rgbaByte[241];
						ctx.strokeStyle = rgbaByte[12];
						while (i--) {
							if (entities[i].grabRadius > 0) {
								drawCircle(entities[i].x + (entities[i].facing ? entities[i].grabXOffset : -entities[i].grabXOffset), entities[i].y + entities[i].grabYOffset, entities[i].grabRadius);
							}
						}
					}
					i = entities.length;
					ctx.strokeStyle = rgbaByte[15];
					ctx.fillStyle = rgbaByte[15];
					while (i--) {
						!entities[i].removed && entities[i].paint && entities[i].paint();
					}
					Effects.renderTop();
					//Effects.render();
					ctx.strokeStyle = rgbaByte[15];
					ctx.fillStyle = rgbaByte[15];
					//drawLine(-absoluteX, 0, width / absoluteZ, 0);
					setFontSize(Math.floor(12 * absoluteZ));
					drawText(frameRate, -absoluteX, fontSize - absoluteY - 2);
					if (showControls) {
						dbg.log('keyboard: WASD - move .. OKL; - right-stick .. p, r, space - jump .. j, f - attack .. m - special .. comma, e - grab .. \', q - shield .. 1234 - dpad .. esc - select .. backsp - start');
						dbg.log('numpad: arrows - move .. /789 - right-stick .. 4, 6, * - jump .. 0, 2 - attack .. 1 - special .. 3 - grab .. +, . - shield .. home, pg up, end, pg down - dpad .. ins - select .. del - start');
					}
					if (unpaused) {
						activeMode.paint && activeMode.paint();
					} else {
						i = connected.length;
						while (i--) {
							connected[i].poll();
						}
						activeMode.paintPaused && activeMode.paintPaused();
					}
					ctx.strokeStyle = rgbaByte[15];
					ctx.fillStyle = rgbaByte[15];
					reader = dbg.reader();
					i = 0;
					while (read = reader()) {
						drawText(read, -absoluteX, Math.floor(-fontSize * i + dbg.offset + (absoluteH - absoluteY)) - fontSize * 0.2);
						i++;
					}
					ctx.globalAlpha = 1;
					i = players.length;
					setFontSize(Math.floor(24 * absoluteZ));
					while (i--) {
						ctx.fillStyle = rgbaByte[players[i].color - 1];
						fillCircle(absoluteW / players.length * i - absoluteX + absoluteW / players.length / 2 + fontSize, absoluteH - absoluteY - absoluteH * 0.1 - fontSize * 0.75, fontSize * 1.2);
						ctx.fillStyle = rgbaByte[15];
						if (!players[i].removed) {
							drawText('ooooooooo'.substr(0, players[i].stocks + 1), absoluteW / players.length * i - absoluteX + absoluteW / players.length / 2, absoluteH - absoluteY - absoluteH * 0.1 - fontSize);
							drawText(Math.ceil(players[i].damage) + '%', absoluteW / players.length * i - absoluteX + absoluteW / players.length / 2, absoluteH - absoluteY - absoluteH * 0.1);
						} else {
							drawText(':(', absoluteW / players.length * i - absoluteX + absoluteW / players.length / 2, absoluteH - absoluteY - absoluteH * 0.1);
						}
					}
					setFontSize(Math.floor(12 * absoluteZ));
					//stopwatch.stop('frame time (ms)');
					drawText(msFramerate(stopwatch.stop()), -absoluteX, (fontSize - 2) * 2 - absoluteY);
					if (mp & 2) {
						mp ^= 2;
					}
					if (mp & 8) {
						mp ^= 8;
					}
					if (mp & 32) {
						mp ^= 32;
					}
					mwdx = 0;
					mwdy = 0;
					if (typed.length > 0) {
						typed = '';
					}
					if (entered) {
						entered = false;
					}
					if (backspaced) {
						backspaced = false;
					}
					requestAnimationFrame(frameTick);
					//stopwatch.start();
				};
			tick.fitOnScreen = fitOnScreen;
			return tick;
		}()),
		requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame,
		//hitbubbleHit = function ()
		renderMenu = function () {
			var tsize = 15,
				diff = 5,
				i,
				chardude,
				hitme = function () {
					//addHitbubble(this.index, 2, this.x, this.y, this.radius, this.color);
					//addDataBubble(this.data[0], this.data[1] + this.color + 1, this.data[2]);
				},
				gothit = function (bubble, index) {
					/*var speed = 1, dx = (this.x - (bubble.x + bubble.owner.x)), dy = (this.y - (bubble.y + bubble.owner.y));
					this.x += dx / dy;
					this.y += dy / dx;*/
					//this.color += 4;
					this.remove();
				},
				thing,
				monsters = [],
				menu = function () {
					//a bunch of framerate debug code
					/*iters++;
					if (frameDiff != 1) {
						console.log('hiccup', frame, frameRate, frameDiff);
					}
					if (frameRate < 60) {
						console.log('lowfps');
					}
					if (iters != frame) {
						desync += (iters < frame) - (iters > frame);
					}
					if (Math.abs(desync) >= 10) {
						//console.log('desync', desync);
					}*/
					//test different gamepads
					/*if (typeof connected !== 'undefined') {
						navigator.webkitGamepads; //update
						navigator.webkitGamepads[0].axes.forEach(function (axis, index) {if (Math.abs(axis) > 0.5) console.log(index, axis);});
						navigator.webkitGamepads[0].buttons.forEach(function (button, index) {if (Math.abs(button) > 0) console.log(index, button);});
					}*/
					//mover.y += mover.dy;
					//mover.y2 += mover.dy;
					/*if (mover.y >= yMax) {
						mover.dy = -diff;
						mover.y2 += mover.y - yMax;
						mover.y = yMax;
					}
					if (mover.y <= yMin) {
						mover.dy = diff;
						mover.y2 += mover.y - yMin;
						mover.y = yMin;
					}*/
					
				};
			menu.start = function (controller) {
				if (controller.hook instanceof Cursor) {
					controller.hook.removed = true;
					controller.hook = controller.hook.entity;
				} else {
					if (!controller.hook.cursor) {
						controller.hook.cursor = new Cursor(controller, -100 + 200 * Math.random(), -400 + 50 * Math.random(), {
							spring: [-125, -425, 700, -275],
							entity: controller.hook,
							swapCharacter: function (name) {
								var onLoad = function (data, e) {
										var cursor = controller.hook,
											old = controller.hook.entity,
											entity = e;
										entity.setColor(old.color);
										entity.stocks = old.stocks;
										entity.damage = old.damage;
										cursor.entity = entity;
										entity.cursor = cursor;
										entity.controller = controller;

										old.removed = true;
										players.splice(players.indexOf(old), 1, entity);
									},
									entity = new Animatable({type: 0, name: name, onLoad: onLoad});
							}
						});
						entities.push(controller.hook);
					} else {
						controller.hook.cursor.removed = false;
						controller.hook = controller.hook.cursor;
					}
				}
				//setActiveMode(renderVersusSelect);
			};
			menu.connect = function (controller) {
				chardude = new Animatable({type: 0, name: 'Prototype Man'});
				chardude.x = stage.entrances[(players.length * 3) % stage.entrances.length];
				chardude.y = stage.entrances[((players.length * 3) % stage.entrances.length) + 1];
				chardude.facing = stage.entrances[((players.length * 3) % stage.entrances.length) + 2];
				chardude.stocks = 3;
				//chardude.act = function () {
				//	dbg.dump(this);
				//};
				chardude.setColor(((Math.random() * 64 | 0) << 2) + 2);
				//chardude.color = calcColor(Math.random() * 256, Math.random() * 256, Math.random() * 256, 0.75);
				controller.hook = chardude;
				chardude.controller = controller;
				chardude.playerNumber = connected.indexOf(controller);
				players.push(chardude);
			};
			stage = new Stage(stages[0]);
			entities.push(new Button('Animator', 400, -400, 0, 50, {click: function () { setActiveMode(renderAnimator); }, press: function () { setActiveMode(renderAnimator); }}));
			entities.push(new Button('Toggle Party Mode', 400, -430, 0, 20, {click: function () { partyMode = !partyMode; }, press: function () { partyMode = !partyMode; }}));
			entities.push(new Button('Toggle Mute', 200, -430, 0, 20, {click: function () { playAudio.toggleMute(); }, press: function () { playAudio.toggleMute(); }}));
			entities.push(new Selection(stages[0].name, -200, -340, 0, 50, 9, stages.map(function (val) { return val.name; }), {select: function (selected, index) {
				//on select
				stage = new Stage(stages[index]);
				var i = players.length;
				while (i--) {
					players[i].airborne = true;
				}
			}}));
			entities.push(new Selection('Swap Character', 200, -340, 0, 50, 9, ['Prototype Man', 'Prototype Dan'], {select: function (selected, index, cursor) {
				//on selected
				cursor && cursor.swapCharacter && cursor.swapCharacter(selected);
				this.reset();
			},
			back: function () {
				this.reset();
			}}));
			entities.push(new Button('Versus', -100, -400, 0, 50, {click: function () { setActiveMode(renderVersusSelect); }, press: function () { setActiveMode(renderVersusSelect); }}));
			/*entities[1] = {
				x: 100,
				y: 100,
				radius: 30,
				color: 195,
				act: hitme
			};
			entities[2] = {
				x: 200,
				y: 200,
				radius: 30,
				color: 195,
				act: hitme
			};*/
			cameraType = fitOnScreen();
			//Effects.countdown(150, 100, 3, 'GO');
			//cameraType = fixedScreen(-568, -718, 1800, 850);
			//cameraType = fixedScreen(stage.blastLeft, stage.blastTop, stage.blastRight - stage.blastLeft, stage.blastBottom - stage.blastTop);
			for (i = 0; i < 0; i++) {
				/*thing = {
					x: Math.random() * width,
					y: Math.random() * height,
					index: i,
					radius: (5 + Math.random() * 50) | 0,
					color: (Math.random() * 256) | 0,
					act: hitme,
					hit: gothit
				};
				//thing.data = compileHitbubble(i, 2, thing.x | 0, thing.y | 0, thing.radius, 0);
				entities.push(thing);*/
				chardude = new Animatable({type: 0, name: 'Floaty Thing', onLoad: function () {
					cameraType.refresh();
				}});
				//entities.push(chardude);
				/*while (Math.random() > 0.1) {
					chardude.animations[chardude.animation].step();
				}*/
				//-568, -718, 1800, 850
				chardude.x = -568 + Math.random() * 1800;
				chardude.y = -718 * Math.random();
				//chardude.hurtbubbles[2].radius = Math.random() * 20 + 5;
				chardude.airborne = true;
				(function (dude) {
					var hovered = false,
						pressed = false,
						xOffset,
						yOffset,
						listener = function () {
							if (pressed) {
								if (mp & 1) {
									dude.x = mx + xOffset;
									dude.y = my + yOffset;
								} else {
									pressed = false;
									dude.dx = -(dude.x - xOffset - mx);
									dude.dy = dude.y - yOffset - my;
								}
							} else {
								if (dude.hurtbubbles[2] && Math.sqrt(Math.pow(mx - dude.x, 2) + Math.pow(my - dude.y, 2)) < dude.hurtbubbles[2].radius) {
									if (!hovered) {
										dude.hurtbubbles[2].radius = dude.myRadius * 1.25;
										hovered = true;
									}
									if (mp & 2) {
										pressed = true;
										xOffset = dude.x - mx;
										yOffset = dude.y - my;
									}
									if (mp & 32) {
										dude.remove();
									}
								} else if (hovered) {
									dude.hurtbubbles[2].radius = dude.myRadius;
									hovered = false;
								}
							}
						};
					//mouseListeners.push(listener);
					dude.mouseListener = listener;
					dude.paint = function () {
						setFontSize(Math.floor(dude.myRadius));
						drawText(dude.damage + '%', dude.x - ctx.measureText(dude.damage + '%').width / 2, dude.y + 6);
					};
					dude.place();
				}(chardude));
				//chardude.hit = gothit;
				//controller.hook = chardude;
			}
			return menu;
		},
		renderVersusSelect = function (playerdata) {
			var stageSelected = 0,
				i,
				versus = function () {
					/*var i = cursors.length;
					while (i--) {
						if (cursors[i].controller.startPress && cursors[i].selected) {
							//later, stage select?
							setActiveMode(renderBattle, stageSelected);
						}
					}*/
				},
				cursors = [];
			versus.start = function (controller) {
				setActiveMode(renderBattle, stageSelected);
			};
			versus.connect = function (controller) {
				var cursor = new Cursor(controller, 100 + 100 * Math.random(), 100 + 100 * Math.random(), {
						back: function () {
							this.select();
						},
						select: function (name) {
							this.selected = name;
							this.controller.character = name;
						},
						selected: undefined,
						character: function (name) {
							this.select(name);
						},
						restrict: [25, 25, 575, 425]
					}),
					i = 0;
				if (playerdata) {
					for (i; i < playerdata.length; i++) {
						if (playerdata[i].controller === controller) {
							cursor.color = controller.color;
							cursor.select(controller.character);
						}
					}
				}
				if (!cursor.color) {
					if (controller.color) {
						cursor.color = controller.color;
					} else {
						controller.color = cursor.color = calcColor(Math.random() * 256, Math.random() * 256, Math.random() * 256, 0.75);
					}
				}
				cursor.character('Prototype Man');
				cursors.push(cursor);
				controller.color = cursor.color;
				entities.push(cursor);
			};
			versus.paint = function () {
				var i = cursors.length;
				while (i--) {
					ctx.fillStyle = rgbaByte[cursors[i].color];
					fillCircle(absoluteW / cursors.length * i - absoluteX + absoluteW / cursors.length / 2 + fontSize, absoluteH - absoluteY - absoluteH * 0.1 - fontSize * 0.75, fontSize * 1.2);
					if (cursors[i].selected) {
						ctx.fillStyle = rgbaByte[15];
						drawText(cursors[i].selected, absoluteW / cursors.length * i - absoluteX + absoluteW / cursors.length / 2, absoluteH - absoluteY - absoluteH * 0.1);
						//drawText(absoluteW / cursors.length * i - absoluteX + absoluteW / cursors.length / 2 + fontSize, absoluteH - absoluteY - absoluteH * 0.1 - fontSize * 0.75);
					}
				}
				ctx.strokeStyle = rgbaByte[15];
				drawLine(80 + (stageSelected / 5 | 0) * 180, 310 + 25 * (stageSelected % 5),
					100 + (stageSelected / 5 | 0) * 180, 310 + 25 * (stageSelected % 5));
				100 + (i / 5 | 0) * 180, 300 + (i % 5) * 25
			};
			cameraType = fixedScreen(0, 0, 600, 450);
			entities.push(new Button('Main Menu', 0, 0, 0, 50, {
				click: function () { setActiveMode(renderMenu); },
				press: function () { setActiveMode(renderMenu); }
			}));
			entities.push(new Button('Prototype Man', 100, 100, 0, 50, {
				press: function (cursor) {
					cursor.character('Prototype Man');
				}
			}));
			entities.push(new Button('Prototype Dan', 100, 150, 0, 50, {
				press: function (cursor) {
					cursor.character('Prototype Dan');
				}
			}));
			for (i = 0; i < stages.length; i++) {
				entities.push(new Button(stages[i].name, 100 + (i / 5 | 0) * 180, 300 + (i % 5) * 25, 0, 20, (function () {
					var val = i;
					return {
						click: function (cursor) {
							stageSelected = val;
						},
						press: function (cursor) {
							stageSelected = val;
						}
					}
				}())));
			}
			/*entities.push(new Button('Starter', 100, 200, 0, 50, {
				press: function (cursor) {
					stageSelected = 0;
				}
			}));
			entities.push(new Button('Fattlebeeld', 100, 250, 0, 50, {
				press: function (cursor) {
					stageSelected = 1;
				}
			}));
			entities.push(new Button('Longboat', 100, 300, 0, 50, {
				press: function (cursor) {
					stageSelected = 2;
				}
			}));*/
			return versus;
		},
		renderBattle = function (stageNum) {
			var tsize = 15,
				i,
				chardude,
				justPaused,
				timer = 180,
				battle = function () {
					var dead = 0,
						undead;
					i = players.length;
					while (i--) {
						if (players[i].stocks < 0) {
							dead++;
						} else {
							undead = players[i];
						}
						if (timer < 170 && players[i].controller.startPress) {
							unpaused = false;
							justPaused = 12;
							battle.pause();
						}
					}
					if (dead >= players.length - 1) {
						dbg.log('Winner: ' + undead.playerNumber);
						setActiveMode(renderVersusSelect, players);
					}
					if (timer !== 0) {
						timer--;
						if (timer === 1) {
							i = players.length;
							while (i--) {
								players[i].controller.hook = players[i];
							}
						}
					}
				};
			Effects.countdown(40, 20, 3, 'GO');
			stage = new Stage(stages[stageNum]);
			battle.connect = function (controller) {
				if (controller.character) {
					chardude = new Animatable({type: 0, name: controller.character});
					chardude.x = stage.entrances[(players.length * 3) % stage.entrances.length];
					chardude.y = stage.entrances[((players.length * 3) % stage.entrances.length) + 1];
					chardude.facing = stage.entrances[((players.length * 3) % stage.entrances.length) + 2];
					chardude.stocks = 3;
					//chardude.act = function () {
					//	dbg.dump(this);
					//};
					chardude.setColor(typeof controller.color !== undef ? controller.color : calcColor(Math.random() * 256, Math.random() * 256, Math.random() * 256, 0.75));
					chardude.controller = controller;
					chardude.playerNumber = connected.indexOf(controller);
					players.push(chardude);
				}
			};
			battle.paint = function () {
				
			};
			battle.pause = function () {
				//cameraType = fixedCamera();
			};
			battle.paused = function () {
			};
			battle.paintPaused = function () {
				var i = players.length;
				if (!justPaused) {
					while (i--) {
						if (players[i].controller.startPress) {
							unpaused = true;
							battle.unpause();
						}
					}
				} else {
					justPaused--;
				}
				dbg.log('Paused');
			};
			battle.unpause = function () {

			};
			cameraType = fitOnScreen();
			return battle;
		},
		renderAnimator = function () {
			var charName = 'Prototype Man',
				x = -150,
				y = -200,
				x2 = -50,
				y2 = -200,
				savedx = x,
				savedy = y,
				animator = function () {
					if (mp & 1) {
						//savedx = mx;
						//savedy = my;
						cangle = computeAngle(mx - x, -(my - y));
						savedx = Math.floor(x - angleX[Math.floor(cangle)] * 30);
						savedy = Math.floor(y + angleY[Math.floor(cangle)] * 30);
					}
				},
				viewWindow = [-568, -718, 1800, 850],
				resetView = function () {
					cameraType = fixedScreen(-568, -718, 1800, 850);
				},
				angle = 0,
				cangle = 0,
				max = 0,
				may = 0,
				computedAngle = 0,
				loaded = [],
				bubbles = [];
			animator.paint = function () {
				ctx.strokeStyle = rgbaByte[15];
				//angle = Math.floor((Math.PI + Math.atan2(my - y, mx - x)) / (Math.PI * 2) * 255);
				computedAngle = computeAngle(mx - x, -(my - y));
				max = Math.floor(x - angleX[Math.floor(computedAngle)] * 60);
				may = Math.floor(y + angleY[Math.floor(computedAngle)] * 60);
				drawLine(Math.min(x, max), x < max ? y : may, Math.max(x, max), x > max ? y : may);
				computedAngle = computeAngle(mx - x, -(my - y));
				drawLine(Math.min(x, savedx), x < savedx ? y : savedy, Math.max(x, savedx), x > savedx ? y : savedy);
				drawText(computedAngle, x, y);
				angle = cangle;
				if (computedAngle >= angle) {
					computedAngle = computedAngle - angle;
					if (255 - computedAngle < computedAngle) {
						computedAngle = -(255 - computedAngle);
					}
				} else {
					computedAngle = angle - computedAngle;
					if (255 - computedAngle < computedAngle) {
						computedAngle = 255 - computedAngle;
					} else {
						computedAngle = -computedAngle;
					}
				}
				//console.log('angle', angle, computedAngle);
				if (Math.abs(computedAngle) > 64) {
					if (computedAngle >= 0) {
						computedAngle = 128 - computedAngle;
					} else {
						computedAngle = -128 - computedAngle;
					}
				}
				//console.log('angle', angle, computedAngle);
				angle += computedAngle * 0.3333;
				angle %= 256;
				if (angle < 0) {
					angle = 255 + angle;
				}
				angle = Math.floor(angle);
				max = Math.floor(x - 40 * angleX[angle]);
				may = Math.floor(y + 40 * angleY[angle]);
				drawLine(Math.min(x, max), x < max ? y : may, Math.max(x, max), x > max ? y : may);
			};
			animator.connect = function (controller) {
				var chardude = new Animatable({type: 0, name: charName, onLoad: function (data) {
					var animationNames = [],
						animationData = data.animations,
						animations = (function () {
							var keyVal = {};
							data.animations.forEach(function (item) {
								keyVal[item.name] = item;
							});
							return keyVal;
						}()),
						i = animationData.length,
						/*doll = new Animatable({type: 0, name: data.name, onLoad: function (data, e) {
							var entity = doll || e;
							entity.airborne = false;
							entity.phasing = true;
							entity.x = -100;
							entity.y = -650;
							entity.controller = controller;
							entity.act = function () {
								entity.x = -100;
								entity.y = -650;
								entity.dx = 0;
								entity.dy = 0;
								entity.airborne = false;
								entity.lag = 1;
							};
						}});*/
						dolls = [],
						setActiveAnimation = function setActiveAnimation(animation) {
							var i,
								d = dolls.length,
								frames = 0;
							i = 0;
							while (d--) {
								dolls[d] && dolls[d].remove();
							}
							dolls.length = animations[animation].keyframes.length;
							while (i < dolls.length) {
								dolls[i] = new Animatable({type: 0, name: data.name, onLoad: function (data, e) {
									var entity = e, //note: e is only set if character has already been cached
										posX = -100 + 200 * i,
										framePos = frames,
										duration = animations[animation].keyframes[i].duration - 1,
										max = framePos + duration;
									entity.airborne = false;
									entity.phasing = true;
									entity.x = posX;
									entity.y = -450;
									entity.controller = controller;
									entity.animations[animation].ticks = framePos;
									entity.animations[animation].step();
									entity.animations[animation].ticks = 1;
									entity.pause = true;
									entity.act = function () {
										entity.x = posX;
										entity.y = -450;
										entity.dx = 0;
										entity.dy = 0;
										entity.airborne = false;
										if (entity.pause) {
											entity.lag = 1;
										}
										//dbg.log('frame' + framePos, entity.animations[animation].frame);
										if (entity.animations[animation].frame >= max) {
											entity.animations[animation].ticks = -duration;
											entity.animations[animation].step();
											entity.animations[animation].ticks = 1;
											entity.pause = true;
										}
									};
									entity.setAnimation(animation, true);
								}});
								frames += animations[animation].keyframes[i].duration;
								i++;
							}
						};
					/*dolls.push(new Animatable({type: 0, name: data.name, onLoad: function (data, e) {
						var entity = e; //note: e is only set if character has already been cached
						entity.airborne = false;
						entity.phasing = true;
						entity.x = -100;
						entity.y = -650;
						entity.controller = controller;
						entity.act = function () {
							entity.x = -100;
							entity.y = -650;
							entity.dx = 0;
							entity.dy = 0;
							entity.airborne = false;
							entity.lag = 1;
						};
					}}));*/
					//setActiveAnimation
					while (i--) {
						animationNames.push(animationData[i].name);
					}
					animationNames = animationNames.sort();
					entities.push(new Selection(data.name, 0, -700 + loaded.length * 65, 0, 50, 7, animationNames, {select: function (selected) {
						//on select
						//doll.setAnimation(selected, true);
						setActiveAnimation(selected);
					}}));
					loaded.push(data);
				}});
				chardude.x = 0;
				chardude.y = 0;
				controller.hook = chardude;
				chardude.controller = controller;
				players.push(chardude);
			};
			stage = new Stage(stages[2]);
			entities.forEach(function (entity) {
				entity.remove();
			});
			entities.push(new Button('Main Menu', 700, -700, 0, 50, {click: function () { setActiveMode(renderMenu); }}));
			resetView();
			return animator;
		},
		initGame = function (hostElement) {
			var refreshCanvasSize = function (set) {
				var unscaledWidth = hostElement.offsetWidth,
					unscaledHeight = hostElement.offsetHeight;
				width = unscaledWidth;
				height = unscaledHeight;
				canvas.style.width = unscaledWidth + 'px';
				canvas.style.height = unscaledHeight + 'px';
				canvas.width = unscaledWidth * canvasRatio;
				canvas.height = unscaledHeight * canvasRatio;
				ctx.scale(canvasRatio, canvasRatio);
				absoluteX = 0;
				absoluteY = 0;
				absoluteZ = 1;
				//cameraType = fixedScreen(-568, -718, 1800, 850);
				//cameraType = fitOnScreen;
				ctx.lineWidth = 3;
				cameraType.refresh();
				//console.log(height, canvas.height, canvas.style.height);
				//ctx.reset();
				//panCamera(absoluteX, absoluteY);
				//zoomCamera(1 / absoluteZ);
				//panCamera((width / 2), (height * 3 / 4));
				//canvas.style.width = hostElement.style.width;
				//canvas.style.height = hostElement.style.height;
			};
			entities.count = 0;
			canvas = document.createElement('canvas');
			width = parseInt(hostElement.style.width, 10) || window.innerWidth;
			height = parseInt(hostElement.style.height, 10) || window.innerHeight;
			if (!parseInt(hostElement.style.width, 10)) {
				hostElement.style.position = 'absolute';
				hostElement.style.left = '0px';
				hostElement.style.top = '0px';
				hostElement.style.width = '100%';
				hostElement.style.height = '100%';
				//document.body.style.overflow = 'scroll';
				window.addEventListener('resize', refreshCanvasSize);
			}
			ctx = canvas.getContext('2d');
			hostElement.appendChild(canvas);
			refreshCanvasSize();
			characterData.load('Prototype Man');
			characterData.load('Prototype Dan');
			setActiveMode(renderMenu);
			canvas.addEventListener('mousemove', function (e) {
				mx = e.offsetX * absoluteZ - absoluteX;
				my = e.offsetY * absoluteZ - absoluteY;
				//dbg.log('mouse', mx | 0, my | 0, !!(mp & 1), !!(mp & 4), !!(mp & 16));
			}, false);
			canvas.addEventListener('mousedown', function (e) {
				mp |= (3 << e.button * 2);
				dbg.log('mouse', mx | 0, my | 0, !!(mp & 1), !!(mp & 4), !!(mp & 16));
			}, false);
			canvas.addEventListener('mouseup', function (e) {
				mp ^= (1 << e.button * 2);
				//dbg.log('mouse', mx | 0, my | 0, !!(mp & 1), !!(mp & 4), !!(mp & 16));
			}, false);
			canvas.addEventListener('contextmenu', function (e) {
				e.preventDefault();
				return false;
			}, false);
			canvas.addEventListener('mousewheel', function (e) {
				mwdx += e.wheelDeltaX;
				mwdy += e.wheelDeltaY;
				if (e.altKey) {
					//zoomCamera(1 + (e.wheelDelta >= 0 ? 0.1 : -0.1));
				} else {
					if (e.wheelDeltaX || e.wheelDeltaY) {
						//panCamera(e.wheelDeltaX / 10, e.wheelDeltaY / 10);
					}
				}
				e.preventDefault();
				return false;
			}, false);
			mouseListeners.remove = function (object) {
				var index = mouseListeners.indexOf(object);
				if (index >= 0) {
					for (index; index < mouseListeners.length - 1; index++) {
						mouseListeners[index] = mouseListeners[index + 1];
					}
					delete mouseListeners[mouseListeners.length - 1];
					mouseListeners.length--;
				}
			};
			mouseListeners.reset = function () {
				var i;
				for (i = 0; i < this.length; i++) {
					delete this[i];
				}
				this.length = 0;
			};
			readyKeyboardControllers(window);
			requestAnimationFrame(frameTick);
			//Effects.colorSquare(0, -300, 300, 300, 180);
			//setInterval(frameTick, 1000/60);
		};
	Array.prototype.pushAll = function () {
		var i = 0,
			l = this.length;
		this.length += arguments.length;
		while (l < this.length) {
			this[l++] = arguments[i++];
		}
    };
	Hurtbubble.prototype = {
		hitbubble: function (index) {
			return (Math.sqrt(Math.pow(this.x - hitbubblesPos[index / 2 + 1], 2) + Math.pow(this.x - hitbubblesPos[index / 2 + 2], 2)) < this.radius + hitbubbles[index + 6]);
		},
		hitBy: function (index) {
			if (this.owner.hit instanceof Function) {
				this.owner.hit(this, index);
			}
		},
		set: function (x, y, radius) {
			this.x = x;
			this.y = y;
			this.radius = radius;
		}
	};
	window.addEventListener('load', function () {
		initGame(document.getElementById('blastpals'));
	}, false);
}());
var calcColor = function (r, g, b, a) {
	'use strict';
	//order of operations works out perfectly for once
	return ((r / 255 * 3 + 0.5 | 0) << 6) + ((g / 255 * 3 + 0.5 | 0) << 4) + ((b / 255 * 3 + 0.5 | 0) << 2) + (a * 3 + 0.5 | 0);
};
