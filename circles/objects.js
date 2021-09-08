
class Level {
	constructor(bg, contents, music, time, completedByDefaultBOOLEAN) {
		this.bg = bg;

		this.music = music;
		this.time = time;
		this.statics = [];
		this.dynamics = [];
		this.playerObj = new Player(0, 0);
		this.playerObj.energyDepleteNatural = 1 / (this.time * 60);
		this.monsterClass = Monster;

		this.completed = completedByDefaultBOOLEAN;

		//convert contents
		this.addObjects(contents);
	}

	addObjects(contents) {
		this.statics = [];
		for (var a=1; a<10; a++) {
			if (contents[a] != undefined) {
				contents[a].forEach(e => {
					this.statics.push(new Orb(e[0], e[1], a));
				});
			}
		}
	
		//monsters
		this.dynamics = [];
		if (contents.M != undefined) {
			contents.M.forEach(e => {
				this.dynamics.push(new this.monsterClass(e[0], e[1]));
			});
		}
	}

	//drawing uwu
	beDrawn() {
		//bg
		ctx.globalAlpha = 1;
		ctx.fillStyle = this.bg;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		//editor's edge box
		if (editor_active) {
			var boxStart = spaceToScreen(-camera.limitX, -camera.limitY);
			var boxEnd = spaceToScreen(camera.limitX, camera.limitY);

			ctx.strokeStyle = color_editor_border;
			ctx.beginPath();
			ctx.rect(boxStart[0], boxStart[1], boxEnd[0] - boxStart[0], boxEnd[1] - boxStart[1]);
			ctx.stroke();
		}

		//entities
		this.playerObj.beDrawn();
		this.dynamics.forEach(d => {
			d.beDrawn();
		});

		//world
		this.statics.forEach(o => {
			o.beDrawn();
		});

		//UI
		drawScanResults();
		drawTutorialText();

		//cover if transitioning
		if (transitionProgress > 0) {
			ctx.fillStyle = this.bg;
			ctx.globalAlpha = droperp(1, 0, 1 - transitionProgress);
			ctx.fillRect(0, 0, canvas.width, canvas.height);
		}
	}

	exportSelf() {
		//reset contents, then fix. After that just export everything
		this.fixContents();

		//exporting everything
		var finalString = `new ${this.constructor.name}("${this.bg}", ${JSON.stringify(this.contents)}, "${this.music}", ${this.time}, [INFO LOST])`;
		console.log(finalString);
	}

	fixContents() {
		this.contents = {};

		//orbs
		this.statics.forEach(u => {
			//push each orb into the contents array
			if (this.contents[u.layers] == undefined) {
				this.contents[u.layers] = [];
			}
			this.contents[u.layers].push([u.x, u.y]);
		});

		//monsters
		this.dynamics.forEach(u => {
			if (this.contents.M == undefined) {
				this.contents.M = [];
			}
			this.contents.M.push([u.homeX, u.homeY]);
		});
	}

	//load self into the main game
	load() {
		game_map = this;
	
		//music
		audio_current = audios[this.music];
		
		if (audio_current != undefined) {
			audio_levelSpeed = audio_current.duration / this.time;
		}
	
		//time + other player stuff
		var c = camera;
		[c.x, c.y] = [0, 0];
		c.scale = camera_scale_game;
		this.reset();
	
		//finish transition
		transitionModeGoal = 1;
		transitionSpeed = transitionSpeedConstant;
	}

	//ticking. Like a clock. but with more function
	tick() {
		this.playerObj.tick();
		this.dynamics.forEach(s => {
			s.tick();
		});
		
		//camera movement
		this.tick_camera();
	
		//orbs
		this.statics.forEach(o => {
			o.tick();
		});

		//exit
		this.tick_exit();
	}

	tick_camera() {
		//exit if camera box is too large
		if (canvas.width / camera.scale > camera.limitX * 2 || canvas.height / camera.scale > camera.limitY * 2) {
			camera.x = 0;
			camera.y = 0;
			return;
		}

		//I'm not really sure how to comment this. This formula does the camera parallax? it's important and was a pain to figure out.
		var unitWidth = canvas.width / camera.scale / 2;
		var unitHeight = canvas.height / camera.scale / 2;
		var newX = this.playerObj.x - (this.playerObj.x / (camera.limitX - unitWidth)) * camera.parallax * unitWidth;
		var newY = this.playerObj.y - (this.playerObj.y / (camera.limitY - unitHeight)) * camera.parallax * unitHeight;
		camera.x = clamp(newX, -camera.limitX + (canvas.width * 0.5 / camera.scale), camera.limitX - (canvas.width * 0.5 / camera.scale));
		camera.y = clamp(newY, -camera.limitY + (canvas.height * 0.5 / camera.scale), camera.limitY - (canvas.height * 0.5 / camera.scale));
	}

	tick_exit() {
		if (orbsAreAllBounced()) {
			loadMenu(true);
		} else if (this.playerObj.energy <= 0) {
			loadMenu(false);
		}
	}

	//reset everything back to defaults
	reset() {
		//stop visibility from previous scans
		scan_time = 0;

		this.statics.forEach(o => {
			o.layersCurrent = o.layers;
		});

		var newDynams = [];
		this.dynamics.forEach(d => {
			newDynams.push(new this.monsterClass(d.homeX, d.homeY));
		});
		this.dynamics = newDynams;

		var p = this.playerObj;
		[p.x, p.y, p.dx, p.dy, p.ax, p.ay, p.energy] = [0, 0, 0, 0, 0, 0, 1];
	}
}

class Level_Facade {
	constructor(bg) {
		this.bg = bg;
	}

	load() {
		return;
	}
}

class Level_Frictionless extends Level {
	constructor(bg, contents, music, time, frictionCost, completedByDefaultBOOLEAN) {
		super(bg, contents, music, time, completedByDefaultBOOLEAN);
		this.frictionless = true;
		this.playerObj.energyDepleteFriction = frictionCost;
	}
}

class Level_Inverse extends Level {
	constructor(bg, contents, music, time, completedByDefaultBOOLEAN) {
		super(bg, contents, music, time, completedByDefaultBOOLEAN);
		this.playerObj = new MonsterControllable(0, 0);
		this.playerObj.energyDepleteNatural = 1 / (this.time * 60);
		this.monsterClass = PlayerAI;
		this.addObjects(contents);
	}

	load() {
		super.load();
		this.dynamics.forEach(d => {
			d.energyDepleteNatural = 1 / (this.time * 60);
		});
	}

	tick_exit() {
		if (this.playerObj.energy <= 0) {
			loadMenu(true);
		} else if (orbsAreAllBounced()) {
			loadMenu(false);
		}
	}
}

class Level_Final extends Level_Inverse {
	constructor(bg, contents, music, time, completedByDefaultBOOLEAN) {
		super(bg, contents, music, time, completedByDefaultBOOLEAN);
		this.playerObj.speed = 0;
		this.monsterClass = PlayerEnder;
		this.addObjects(contents);
	}

	load() {
		super.load();
		this.playerObj.r = this.playerObj.rStable;
	}
}

class Level_Prefab extends Level {
	constructor(bg, contents, music, time, completedByDefaultBOOLEAN) {
		super(bg, contents, music, time, completedByDefaultBOOLEAN);
	}

	addObjects(contents) {
		//prefab is easy
		this.statics = contents.statics;
		this.dynamics = contents.dynamics;
	}
}



class Player {
	constructor(x, y) {
		this.x = x;
		this.y = y;

		this.dx = 0;
		this.dy = 0;
		this.dMax = 2.5;

		this.ax = 0;
		this.ay = 0;
		this.speed = 0.11;

		this.friction = 0.875;
		this.frictionNatural = 0.96;

		this.r = 6;
		this.eyeR = 0.13;

		this.energy = 1;
		this.energyDepleteNatural = 0;
		this.energyDepleteCreature = 1 / 200;
		this.energyDepleteFriction = 0;
	}

	tick() {
		if (editor_active) {
			return;
		}
		this.updateMomentum();
		this.updatePosition();
	}

	beDrawn() {
		var center = spaceToScreen(this.x, this.y);
		var radius = this.r * camera.scale;
		ctx.fillStyle = color_player;
		drawStar(center[0], center[1], radius, 16);
		ctx.fill();

		//draw self's energy pie

		//drawing
		this.beDrawn_energy(center[0], center[1], radius);
		ctx.globalAlpha = Math.min(this.energy / 0.03, 1);

		//draw eye 
		var multiplier = (this.r * camera.scale / this.dMax) * 0.5;
		ctx.fillStyle = "#003";
		drawCircle(center[0] + this.dx * multiplier, center[1] + this.dy * multiplier, radius * this.eyeR);
		ctx.fill();
		ctx.globalAlpha = 1;
	}

	beDrawn_energy(x, y, r) {
		ctx.globalAlpha = 0.6;
		ctx.strokeStyle = color_energy;
		ctx.fillStyle = color_energy;

		if (this.energy < 0.05) {
			ctx.globalAlpha = (this.energy / 0.05) * 0.6;
		}
		drawStar(x, y, r * this.energy, 16);
		ctx.stroke();
		ctx.fill();
	}

	updateMomentum() {
		//acceleration
		if (this.ax != 0 || this.ay != 0) {
			//get vector forms of both acceleration and momentum
			var aVec = [Math.sqrt(this.ax * this.ax + this.ay * this.ay), Math.atan2(this.ay, this.ax)];
			var dVec = [Math.sqrt(this.dx * this.dx + this.dy * this.dy), Math.atan2(this.dy, this.dx)];

			//slow acceleration down if already moving fast
			var angleDivisor = Math.cos(dVec[1] - aVec[1]) * 0.8;
			var multiplier = 1 - sigmoid((dVec[0] * angleDivisor / this.dMax) * 12 - 6, 0, 1);
			this.dx += this.ax / aVec[0] * multiplier * this.speed;
			this.dy += this.ay / aVec[0] * multiplier * this.speed;
		}


		//normalize if too fast
		var magnitude = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
		if (magnitude > this.dMax) {
			this.dx = this.dx / magnitude * this.dMax;
			this.dy = this.dy / magnitude * this.dMax;
		}

		
		if (game_map.frictionless) {
			//frictionless levels take energy to move, but don't have friction
			this.energy -= (this.ax != 0 || this.ay != 0) * this.energyDepleteFriction;
		} else {
			this.dx *= this.frictionNatural;
			this.dy *= this.frictionNatural;
			//natural friction
			if (this.dx * this.ax <= 0) {
				this.dx *= this.friction;
			}
	
			if (this.dy * this.ay <= 0) {
				this.dy *= this.friction;
			}
		}
	}

	updatePosition() {
		//cap x and y to world boundaries
		this.x += this.dx;
		this.y += this.dy;
		if (game_map.frictionless) {
			if (this.x < -camera.limitX || this.x > camera.limitX) {
				this.dx *= -1;
			}
			if (this.y < -camera.limitY || this.y > camera.limitY) {
				this.dy *= -1;
			}
		}
		this.x = clamp(this.x, -camera.limitX, camera.limitX);
		this.y = clamp(this.y, -camera.limitY, camera.limitY);

		//energy
		this.energy -= this.energyDepleteNatural;
		if (this.energy < 0) {
			this.energy = 0;
		}
	}
}

class PlayerAI extends Player {
	constructor(x, y) {
		super(x, y);
		this.homeX = x;
		this.homeY = y;

		this.minMonsterDist = 6;
		this.normalMonsterDist = 35;
		this.monsterTolerance = this.normalMonsterDist;
		
		this.nearestOrb = undefined;
		this.nearChaseTime = 0;
		this.nearChaseTimeMax = 180;

		this.badOrbs = [];
	}

	beDrawn() {
		super.beDrawn();
		// if (this.nearestOrb != undefined) {
		// 	ctx.fillStyle = "#F00";
		// 	var sasc = spaceToScreen(this.nearestOrb.x, this.nearestOrb.y);
		// 	drawCircle(sasc[0], sasc[1], 10);
		// 	ctx.fill();
		// }
	}

	path() {
		if (this.energy <= 0) {
			this.ax = 0;
			this.ay = 0;
			return;
		}

		if (this.energy <= 0.4) {
			//gradually reduce aversion to touching monsters over time
			this.monsterTolerance = Math.min(this.monsterTolerance, linterp((game_map.playerObj.r + this.r) * 1.1, this.normalMonsterDist, this.energy + 0.6));
		}

		//figure out distance from the monster-player
		var xDist = game_map.playerObj.x - this.x;
		var yDist = game_map.playerObj.y - this.y;
		var toPVec = [Math.sqrt(xDist ** 2 + yDist ** 2), Math.atan2(yDist, xDist)];

		if ((this.nearestOrb != undefined && this.nearestOrb.layersCurrent == 0)) {
			this.nearestOrb = undefined;
			this.nearChaseTime = 0;
			this.badOrbs = [];
		}

		if (this.nearestOrb != undefined && this.nearChaseTime > this.nearChaseTimeMax) {
			//choose a random orb
			this.badOrbs.push(this.nearestOrb);
			var validOrbs = [];
			game_map.statics.forEach(s => {
				if (s.layersCurrent > 0 && !this.badOrbs.includes(s)) {
					validOrbs.push(s);
				}
			});
			this.nearestOrb = validOrbs[Math.floor(randomBounded(0, validOrbs.length-0.01))];
			this.nearChaseTime = 0;
		}

		if (this.nearestOrb == undefined) {
			//figure out distance to the nearest orb
			var nearestOrbVec = [1e1001, undefined];
			var oXD;
			var oYD;
			var oD;
			game_map.statics.forEach(s => {
				if (s.layersCurrent > 0 && !this.badOrbs.includes(s)) {
					oXD = s.x - this.x;
					oYD = s.y - this.y;
					oD = Math.sqrt(oXD ** 2 + oYD ** 2);
					if (oD < nearestOrbVec[0]) {
						nearestOrbVec = [oD, Math.atan2(oYD, oXD)];
						this.nearestOrb = s;
					}
				}
			});
			//if no nearest orb has been selected, then the bad orbs list is wrong. The entity should take more risks
			if (this.nearestOrb == undefined) {
				this.monsterTolerance = 5;
				this.nearestOrb = this.badOrbs[0];
				this.badOrbs = [];
			}
		}

		oXD = this.nearestOrb.x - this.x;
		oYD = this.nearestOrb.y - this.y;
		oD = Math.sqrt(oXD ** 2 + oYD ** 2);
		nearestOrbVec = [oD, Math.atan2(oYD, oXD)];

		var pathDirection = nearestOrbVec[1];
		this.nearChaseTime += 1;

		//now that the vectors are gotten, can decide pathing
		if (toPVec[0] < this.monsterTolerance) {
			this.nearChaseTime += 1.2;
			//if too close to the monster, path away from it
			pathDirection = toPVec[1] + Math.PI * 0.8;
			this.nearestOrb = undefined;
		}
		

		//upate acceleration
		
		this.ax = Math.cos(pathDirection);
		this.ay = Math.sin(pathDirection);
	}

	updateMomentum() {
		if (game_time % 3 == 0) {
			this.path();
		}
		super.updateMomentum();
	}
}

class PlayerEnder extends PlayerAI {
	constructor(x, y) {
		super(x, y);
		this.r = 18;
		this.rMult = 0.94;
		this.rStore = undefined;
		this.energyDepleteCreature = 0;
	}

	beDrawn_energy(x, y, r) {
		super.beDrawn_energy(x, y, r / this.energy);
	}

	path() {
		var plr = game_map.playerObj;

		if (plr.r <= 0) {
			return;
		}
		//go straight towards the player
		var xDist = plr.x - this.x;
		var yDist = plr.y - this.y;
		var toPD = Math.sqrt(xDist ** 2 + yDist ** 2);
		var toPA = Math.atan2(yDist, xDist);
		this.ax = Math.cos(toPA);
		this.ay = Math.sin(toPA);

		//if distance is close enough, push out and weaken the player
		if (toPD < this.r + plr.r) {
			//super hacky but whatever
			if (this.rStore == undefined) {
				this.rStore = plr.r;
			}
			plr.r *= this.rMult;
			if (plr.r < 0.5) {
				console.log('hi');
				plr.r = 0;
			}
		}
	}
}

class Orb {
	constructor(x, y, layers) {
		this.x = x;
		this.y = y;

		this.layers = layers;
		this.layersCurrent = layers;
		

		this.animTime = 0;
		this.animTimeMax = 15;

		this.r = 10;
		this.alpha = 0.6;
	}

	collideWith(entity) {
		var pXDist = this.x - entity.x;
		var pYDist = this.y - entity.y;
		var pDist = Math.sqrt(pXDist ** 2 + pYDist ** 2);

		if (pDist < this.r + entity.r) {
			this.layersCurrent -= 1;
			this.animTime = 1;
			var dir = Math.atan2(pYDist, pXDist) + Math.PI;
			[entity.x, entity.y] = polToXY(this.x, this.y, dir, this.r + entity.r);

			//different behavior depending on type
			if (game_map.frictionless) {
				//bounce player away at a slightly greater force
				[entity.dx, entity.dy] = polToXY(0, 0, dir, Math.sqrt(entity.dx * entity.dx + entity.dy * entity.dy) * (0.96 + 0.05 * this.layersCurrent));
				return;
			}
			var moveDir = polToXY(0, 0, dir, entity.dMax * (0.3 + 0.06 * this.layersCurrent));
			if (this.layersCurrent > 0) {
				[entity.dx, entity.dy] = moveDir;
				return;
			}
			entity.dx += moveDir[0];
			entity.dy += moveDir[1];
		}
	}

	tick() {
		if (this.layersCurrent <= 0) {
			return;
		}

		
		if (game_map.playerObj.eyeOffset == undefined) {
			//only collide with player if they're not a monster
			this.collideWith(game_map.playerObj);
		} else {
			//collide with possible monsterPlayers
			game_map.dynamics.forEach(d => {
				this.collideWith(d);
			});
		}
	}

	beDrawn() {
		//don't be drawn if these conditions are met
		if (this.layersCurrent == 0 && this.animTime == 0 && !editor_active) {
			return;
		}

		var [drawX, drawY] = spaceToScreen(this.x, this.y);

		if (this.layersCurrent > 0) {
			this.drawLayer(drawX, drawY, this.r * camera.scale, this.layersCurrent, this.alpha);
		}

		if (this.animTime > 0) {
			var percentage = ((this.animTimeMax - this.animTime) / this.animTimeMax);
			var alpha = this.alpha * percentage;
			ctx.globalAlpha = Math.pow(alpha, 0.7);
			this.drawLayer(drawX, drawY, this.r * camera.scale * droperp(1.2, 1, percentage), this.layersCurrent + 1, alpha);
			this.animTime = (this.animTime + 1) % this.animTimeMax;
		}
	}

	drawLayer(x, y, r, layers, opacity) {
		ctx.fillStyle = color_orbs[Math.min(layers, color_orbs.length-1)];
		ctx.strokeStyle = ctx.fillStyle;
		//color of self's ring changes if editor is active
		if (editor_active) {
			ctx.strokeStyle = (this == editor_selected) ? color_editor_selection : color_editor_orb;
		}

		//ring
		ctx.beginPath();
		drawCircle(x, y, r);
		ctx.stroke();

		//circle
		ctx.globalAlpha = opacity;
		ctx.beginPath();
		drawCircle(x, y, r);
		ctx.fill();
		ctx.globalAlpha = 1;
	}

	reset() {
		this.layers = this.layersCurrent;
	}
}


class Monster {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.r = 13;

		this.homeX = x;
		this.homeY = y;
		this.npTime = 0;
		this.npTimeMax = 150;

		this.friction = 0.8;
		this.playerFriction = 0.97;
		this.dx = 0;
		this.dy = 0;
		this.dMax = 2.1;

		this.speed = 0.2;
		this.dir = 0;

		this.target = [0, 0];
		this.eyeOffset = [0, 0];
		this.followDist = 165;
	}

	tick() {
		if (editor_active) {
			this.x = this.homeX;
			this.y = this.homeY;
			return;
		}
		//set target
		this.setTarget();
		this.pathToTarget();
		this.updatePositionAndMomentum();
		this.collide();
	}

	beDrawn() {
		var loc = spaceToScreen(this.x, this.y);
		var sz = camera.scale * this.r;

		if (loc[0] > 0 - sz && loc[1] > 0 - sz && loc[0] < canvas.width + sz && loc[1] < canvas.height + sz) {
			ctx.globalAlpha = 0.4;
			ctx.fillStyle = color_monster;
			ctx.beginPath();
			drawCircle(loc[0], loc[1], sz);
			ctx.fill();
			drawCircle(loc[0], loc[1], sz * 0.8);
			ctx.fill();

			//eye
			var newEyeOff = polToXY(0, 0, this.dir, sz * 0.3);
			this.eyeOffset[0] = (5 * this.eyeOffset[0] + newEyeOff[0]) / 6;
			this.eyeOffset[1] = (5 * this.eyeOffset[1] + newEyeOff[1]) / 6;
			
			ctx.fillStyle = color_monster_eye;
			drawCircle(loc[0] + this.eyeOffset[0], loc[1] + this.eyeOffset[1], sz * 0.4);
			ctx.fill();
			ctx.globalAlpha = 1;
		}
	}

	collide() {
		if (game_map.dynamics.length < 2) {
			return;
		}

		//collide with other monsters
		var xDist;
		var yDist;
		var dist;
		for (var m=0; m<game_map.dynamics.length; m++) {
			if (game_map.dynamics[m] != this) {
				xDist = game_map.dynamics[m].x - this.x;
				yDist = game_map.dynamics[m].y - this.y;
				dist = Math.sqrt(xDist * xDist + yDist * yDist);
				if (dist < this.r * 2) {
					//get the distance, push self away and push other entity away
					var unitDist = [xDist / dist * Math.sign(xDist), yDist / dist * Math.sign(yDist)];
					var requiredMore = ((this.r * 2) - dist) / 2;

					this.x += unitDist[0] * requiredMore;
					this.y += unitDist[1] * requiredMore;

					game_map.dynamics[m].x -= unitDist[0] * requiredMore;
					game_map.dynamics[m].y -= unitDist[1] * requiredMore;
				}
			}
			
		}
	}

	pathToTarget() {
		if (this.target != undefined) {
			var xOff = this.target[0] - this.x;
			var yOff = this.target[1] - this.y;
			this.dir = Math.atan2(yOff, xOff);
		}
	}

	reset() {
		this.x = this.homeX;
		this.y = this.homeY;
		this.dx = 0;
		this.dy = 0;
	}

	setTarget() {
		var plr = game_map.playerObj;
		var pXDist = this.x - plr.x;
		var pYDist = this.y - plr.y;
		var pDist = Math.sqrt(pXDist * pXDist + pYDist * pYDist);

		//if player's close enough, the target is the player. If player is too far, target is random spot chosen every once in a while.
		if (pDist < this.followDist) {
			this.npTime = 0;
			this.setTargetToPlayer();

			//if close enough, slow down the player
			if (pDist < plr.r + this.r - 1) {
				plr.dx *= this.playerFriction;
				plr.dy *= this.playerFriction;
				plr.energy = clamp(plr.energy - plr.energyDepleteCreature, 0, 1);
			}
		} else {
			//count up time without player
			this.npTime += 1;
			var newCoords;

			//if np time is too great, return close to home
			if (this.npTime > this.npTimeMax) {
				if (Math.random() < 0.01) {
					newCoords = [this.homeX + randomBounded(-150, 150), this.homeY + randomBounded(-150, 150)];
					this.target = [clamp(newCoords[0], -camera.limitX, camera.limitX), clamp(newCoords[1], -camera.limitY, camera.limitY)];
				}
			} else if (Math.random() < 0.015) {
				//choose a random target nearby
				newCoords = polToXY(this.x, this.y, this.dir + randomBounded(-0.5, 0.5), 150);
			}
			if (newCoords != undefined) {
				this.target = [clamp(newCoords[0], -camera.limitX, camera.limitX), clamp(newCoords[1], -camera.limitY, camera.limitY)];
			}
		}
	}

	setTargetToPlayer() {
		this.target = [game_map.playerObj.x, game_map.playerObj.y];
	}

	updatePositionAndMomentum() {
		this.dx *= this.friction;
		this.dy *= this.friction;
		var off = polToXY(0, 0, this.dir, this.speed);
		this.dx = clamp(this.dx + off[0], -this.dMax, this.dMax);
		this.dy = clamp(this.dy + off[1], -this.dMax, this.dMax);

		this.x = clamp(this.x + this.dx, -camera.limitX, camera.limitX);
		this.y = clamp(this.y + this.dy, -camera.limitY, camera.limitY);
	}
}

class MonsterControllable extends Monster {
	constructor(x, y) {
		super(x, y);
		this.rStable = this.r;
		this.ax = 0;
		this.ay = 0;
		//LDC = last down coords
		this.ldC = [this.x, this.y];

		//energy for syncing with playermonsters
		this.energy = 1;
		this.energyDepleteNatural = 0;
	}

	tick() {
		super.tick();
		var energyBuffer = 0;
		game_map.dynamics.forEach(d => {
			energyBuffer += d.energy;
		});
		
		this.energy = energyBuffer / game_map.dynamics.length;
	}

	setTarget() {
		//target is entirely controlled by the user (ax / ay)
		if (this.ax != 0 || this.ay != 0) {
			this.ldC = [this.x, this.y];
		}
		this.target = [this.ldC[0] + (this.ax * 100), this.ldC[1] + (this.ay * 100)];
		


		//remove energy from monsterPlayers
		if (game_map.dynamics.length > 0) {
			game_map.dynamics.forEach(d => {
				var pDist = Math.sqrt((d.x - this.x) ** 2 + (d.y - this.y) ** 2);
				if (pDist < d.r + this.r - 1) {
					d.dx *= this.playerFriction;
					d.dy *= this.playerFriction;
					d.energy = clamp(d.energy - d.energyDepleteCreature, 0, 1);
				}
			});
		}
	}

	collide() {
		//no need for collision with other entities
	}
}

class MonsterSpace extends Monster {
	constructor(x, y) {
		super(x, y);
		this.dMax *= 0.75;
		this.frequency = 150;
	}

	setTargetToPlayer() {
		this.target = [game_map.playerObj.x + (2 * game_map.playerObj.dx), game_map.playerObj.y + (2 * game_map.playerObj.dy)];
	}

	updatePositionAndMomentum() {
		//just path directly towards the target
		var tOff = [this.target[0] - this.x, this.target[1] - this.y];
		var tMagni = Math.sqrt(tOff[0] * tOff[0] + tOff[1] * tOff[1]);

		//slow self down if too close
		if (game_time % Math.floor(this.frequency / 20) == 0 && tMagni < game_map.playerObj.r + this.r) {
			this.dx *= 0.95;
			this.dy *= 0.95;
			this.eyeOffset = [0, 0];
		} else if (game_time % this.frequency == 0) {
			//normalize then multiply by max
			this.dx = (tOff[0] / tMagni) * this.dMax;
			this.dy = (tOff[1] / tMagni) * this.dMax;
			this.eyeOffset = [0, 0];
		}
		

		this.x += this.dx;
		this.y += this.dy;

		if (Math.abs(this.x) > camera.limitX) {
			this.dx *= -1;
			this.x = clamp(this.x, -camera.limitX, camera.limitX);
		}
		if (Math.abs(this.y) > camera.limitY) {
			this.dy *= -1;
			this.y = clamp(this.y, -camera.limitY, camera.limitY);
		}
	}
}

class SettingsChanger {
	constructor(centerX, centerY, displayText, functionOnChange, valuesArr) {
		this.x = centerX;
		this.y = centerY;
		this.w = 120;
		this.text = displayText;
		this.func = functionOnChange;
		this.values = valuesArr;

		this.orbs = [];
		this.orbOut = -1;

		this.generateOrbs();
	}

	beDrawn() {
		this.orbs.forEach(o => {
			o.beDrawn();
			//force a draw with 0 layers
			if (o.layersCurrent == 0) {
				var pos = spaceToScreen(o.x, o.y);
				o.drawLayer(pos[0], pos[1], o.r * camera.scale, 0, o.alpha)
			}
		});

		//draw text as well
		var textPos = spaceToScreen(this.x, this.y - 25);
		ctx.font = `${canvas.height * text_size}px Ubuntu`;
		ctx.textAlign = "center";
		ctx.fillStyle = color_text;
		ctx.fillText(this.text, textPos[0], textPos[1]);
	}

	generateOrbs() {
		//calculation and resetting
		this.orbs = [];
		var offset = (this.values.length - 1) / 2;
		var interval = this.w / (this.values.length - 1);

		//object pushing
		for (var g=0; g<this.values.length; g++) {
			this.orbs.push(new Orb(this.x - (offset * interval) + (g * interval), this.y, 1));
		}
	}

	tick() {
		var newOrbOut = -1;
		for (var a=0; a<this.orbs.length; a++) {
			this.orbs[a].tick();
			if (this.orbs[a].layersCurrent == 0 && a != this.orbOut) {
				newOrbOut = a;
			}
		}

		//if one of the orbs is out, restore the others and set function
		if (newOrbOut != -1) {
			this.orbOut = newOrbOut;
			for (var b=0; b<this.orbs.length; b++) {
				if (b != this.orbOut) {
					this.orbs[b].layersCurrent = 1;
				}
			}
			this.func(this.values[this.orbOut]);
		}
	}
}