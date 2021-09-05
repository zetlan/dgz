
class Level {
	constructor(bg, contents, music, time, completedByDefaultBOOLEAN) {
		this.bg = bg;

		this.music = music;
		this.time = time;
		this.statics = [];
		this.dynamics = [];
		this.playerObj = invertRolesBOOLEAN ? new MonsterControllable(0, 0) : new Player(0, 0);

		this.completed = completedByDefaultBOOLEAN;
		this.inverted = invertRolesBOOLEAN;
		this.frictionless = frictionlessBOOLEAN;
		this.fCost = frictionCost;

		//convert contents
		this.addObjects(contents);
	}

	addObjects(contents) {
		if (contents.prefab != undefined) {
			//prefab is easy
			this.statics = contents.prefab.statics;
			this.dynamics = contents.prefab.dynamics;
			return;
		}

		//non-prefab case
		for (var a=1; a<10; a++) {
			if (contents[a] != undefined) {
				contents[a].forEach(e => {
					this.statics.push(new Orb(e[0], e[1], a));
				});
			}
		}
	
		//monsters
		if (contents.M != undefined) {
			contents.M.forEach(e => {
				this.dynamics.push(this.inverted ? new PlayerAI(e[0], e[1]) : new Monster(e[0], e[1]));
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
		this.contents = [];

		//orbs
		game_staticObjects.forEach(u => {
			//push each orb into the contents array
			if (toReturn.contents[u.layers] == undefined) {
				toReturn.contents[u.layers] = [];
			}
			toReturn.contents[u.layers].push([u.x, u.y]);
		});

		//monsters
		game_dynamicObjects.forEach(u => {
			if (u != player) {
				if (toReturn.contents.M == undefined) {
					toReturn.contents.M = [];
				}
				toReturn.contents.M.push([u.homeX, u.homeY]);
			}
		});

		var finalString = JSON.stringify(toReturn);
		finalString = finalString.replaceAll(`"`, ``);
	}

	//load self into the main game
	load() {
		game_data = this;
	
		//music
		if (this.music != undefined) {
			audio_current = audios[this.music];
		}
		
		if (audio_current != undefined) {
			audio_levelSpeed = audio_current.duration / this.time;
		}
		
	
		//convert data into objects
	
		//time + other player stuff
		
		camera.x = 0;
		camera.y = 0;
		player.x = 0;
		player.y = 0;
		player.dx = 0;
		player.dy = 0;
		player.energy = 1;
		player.energyDepleteNatural = 1 / (this.time * 60);
		player.energyDepleteFriction = 0;
		camera.scale = camera_scale_game;
	
		//finish transition
		transitionModeGoal = 1;
		transitionSpeed = transitionSpeedConstant;
		console.log("setting to game");
	}

	//ticking. Like a clock. but with more function
	tick() {
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
		if (orbsAreAllBounced()) {
			loadMenu(true);
		} else if (player.energy <= 0) {
			loadMenu(false);
		}
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
		var newX = player.x - (player.x / (camera.limitX - unitWidth)) * camera.parallax * unitWidth;
		var newY = player.y - (player.y / (camera.limitY - unitHeight)) * camera.parallax * unitHeight;
		camera.x = clamp(newX, -camera.limitX + (canvas.width * 0.5 / camera.scale), camera.limitX - (canvas.width * 0.5 / camera.scale));
		camera.y = clamp(newY, -camera.limitY + (canvas.height * 0.5 / camera.scale), camera.limitY - (canvas.height * 0.5 / camera.scale));
	}

	//reset everything back to defaults
	reset() {

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
		this.fCost = frictionCost;
	}
}

class Level_Inverse extends Level {
	constructor(bg, contents, music, time, completedByDefaultBOOLEAN) {
		super(bg, contents, music, time, completedByDefaultBOOLEAN);
	}
}

class Level_Prefab extends Level {
	constructor() {
		super(bg, false, )
	}
}



class Player {
	constructor(x, y) {
		this.x = x;
		this.y = y;

		this.dx = 0;
		this.dy = 0;
		this.dMax = 2;

		this.ax = 0;
		this.ay = 0;
		this.speed = 0.07;

		this.friction = 0.875;

		this.r = 6;

		this.energy = 1;
		this.energyDepleteNatural = 0;
		this.energyDepleteCreature = 1 / 200;
		this.energyDepleteFriction = 0;
	}

	tick() {
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
		ctx.globalAlpha = 0.6;
		ctx.strokeStyle = color_energy;
		ctx.fillStyle = color_energy;

		if (this.energy < 0.05) {
			ctx.globalAlpha = (this.energy * 20) * 0.6;
		}
		drawStar(center[0], center[1], radius * this.energy, 16);
		ctx.stroke();
		ctx.fill();
		ctx.globalAlpha = 1;

		//draw eye 
		var multiplier = (this.r * camera.scale / this.dMax) * 0.5;
		ctx.fillStyle = "#003";
		drawCircle(center[0] + this.dx * multiplier, center[1] + this.dy * multiplier, this.r * 0.4);
		ctx.fill();
	}

	updateMomentum() {
		this.dx += this.ax * this.speed * sigmoid((Math.abs(this.dx - this.dMax * this.ax) / this.dMax) * 12 - 6, 0, 1);
		this.dy += this.ay * this.speed * sigmoid((Math.abs(this.dy - this.dMax * this.ay) / this.dMax) * 12 - 6, 0, 1);

		
		if (game_data.frictionless) {
			//frictionless levels take energy to move, but don't have friction
			this.energy -= (this.ax != 0 || this.ay != 0) * this.energyDepleteFriction;
		} else {
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
		if (game_data.frictionless) {
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

	}
}

class Orb {
	constructor(x, y, layers) {
		this.x = x;
		this.y = y;

		this.layers = layers;
		this.layersCurrent = layers;

		this.animTime = 0;
		this.animTimeMax = orb_animTime;

		this.r = orb_radius;
	}

	tick() {
		if (this.layersCurrent <= 0) {
			return;
		}

		//if player is inside self, pop and push player out
		var pXDist = this.x - player.x;
		var pYDist = this.y - player.y;
		var pDist = Math.sqrt(pXDist * pXDist + pYDist * pYDist);

		if (pDist < this.r + player.r) {
			this.layersCurrent -= 1;
			this.animTime = 1;
			var dir = Math.atan2(pYDist, pXDist) + Math.PI;
			[player.x, player.y] = polToXY(this.x, this.y, dir, this.r + player.r);

			//different behavior depending on type
			if (game_data.frictionless) {
				//bounce player away at a slightly greater force
				[player.dx, player.dy] = polToXY(0, 0, dir, Math.sqrt(player.dx * player.dx + player.dy * player.dy) * (0.96 + 0.05 * this.layersCurrent));
				return;
			}
			var moveDir = polToXY(0, 0, dir, player.dMax * (0.3 + 0.06 * this.layersCurrent));
			if (this.layersCurrent > 0) {
				[player.dx, player.dy] = moveDir;
				return;
			}
			player.dx += moveDir[0];
			player.dy += moveDir[1];
		}
	}

	beDrawn() {
		//don't be drawn if these conditions are met
		if (this.layersCurrent == 0 && !editor_active) {
			return;
		}

		var [drawX, drawY] = spaceToScreen(this.x, this.y);

		ctx.fillStyle = color_orbs[Math.min(this.layersCurrent, color_orbs.length-1)];
		ctx.strokeStyle = ctx.fillStyle;
		//color of self's ring changes if editor is active
		if (editor_active) {
			ctx.strokeStyle = (this == editor_selected) ? color_editor_selection : color_editor_orb;
		}
		

		//ring
		ctx.beginPath();
		drawCircle(drawX, drawY, this.r * camera.scale);
		ctx.stroke();

		//circle

		//circle
		ctx.globalAlpha = orb_opacity;
		ctx.beginPath();
		drawCircle(drawX, drawY, this.r * camera.scale);
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
		if (game_dynamicObjects.length < 3) {
			return;
		}

		//collide with other monsters
		var xDist;
		var yDist;
		var dist;
		for (var m=0; m<game_dynamicObjects.length; m++) {
			if (game_dynamicObjects[m] != this && game_dynamicObjects[m] != player) {
				xDist = game_dynamicObjects[m].x - this.x;
				yDist = game_dynamicObjects[m].y - this.y;
				dist = Math.sqrt(xDist * xDist + yDist * yDist);
				if (dist < this.r * 2) {
					//get the distance, push self away and push other entity away
					var unitDist = [xDist / dist * Math.sign(xDist), yDist / dist * Math.sign(yDist)];
					var requiredMore = ((this.r * 2) - dist) / 2;

					this.x += unitDist[0] * requiredMore;
					this.y += unitDist[1] * requiredMore;

					game_dynamicObjects[m].x -= unitDist[0] * requiredMore;
					game_dynamicObjects[m].y -= unitDist[1] * requiredMore;
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
		var pXDist = this.x - player.x;
		var pYDist = this.y - player.y;
		var pDist = Math.sqrt(pXDist * pXDist + pYDist * pYDist);

		//if player's close enough, the target is the player. If player is too far, target is random spot chosen every once in a while.
		if (pDist < this.followDist) {
			this.npTime = 0;
			this.setTargetToPlayer();

			//if close enough, slow down the player
			if (pDist < player.r + this.r - 1) {
				player.dx *= this.playerFriction;
				player.dy *= this.playerFriction;
				player.energy = clamp(player.energy - player.energyDepleteCreature, 0, 1);
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
		this.target = [player.x, player.y];
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

class MonsterSpace extends Monster {
	constructor(x, y) {
		super(x, y);
		this.dMax *= 0.75;
		this.frequency = 150;
	}

	setTargetToPlayer() {
		this.target = [player.x + player.dx, player.y + player.dy];
	}

	updatePositionAndMomentum() {
		//just path directly towards the target
		var tOff = [this.target[0] - this.x, this.target[1] - this.y];
		var tMagni = Math.sqrt(tOff[0] * tOff[0] + tOff[1] * tOff[1]);

		//slow self down if too close
		if (game_time % Math.floor(this.frequency / 20) == 0 && tMagni < player.r + this.r) {
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
		this.text = displayText;
		this.orbs = [];
		this.func = functionOnChange;
		this.values = valuesArr;
		this.generateOrbs();
	}

	beDrawn() {

	}

	generateOrbs() {

	}

	tick() {

	}
}