
//for camera movement
class Camera {
	constructor(x, y, zoom) {
		this.x = x;
		this.y = y;
		this.cornerCoords;

		this.dx = 0;
		this.dy = 0;
		this.speed = 0.2;

		this.scale = zoom;
		this.targetScale = this.scale;
		//all sprites are done at 4/5ths perspective

		this.calculateCorners();
	}

	calculateCorners() {
		this.scale = ((this.scale * 7) + this.targetScale) / 8;
		this.cornerCoords = [this.x - ((canvas.width / 2) / this.scale), this.y - ((canvas.height / 2) / this.scale) / render_vSquish,
							this.x + ((canvas.width / 2) / this.scale), this.y + ((canvas.height / 2) / this.scale) / render_vSquish];
	}

	tick_free() {
		this.x += this.dx;
		this.y += this.dy;
		this.calculateCorners();
	}

	tick_follow() {
		this.x = player.x + loading_map.x;
		this.y = player.y + loading_map.y;
		this.calculateCorners();
	}
}







//TODO: 'time since attack' system doesn't work properly
//player class
class Player {
	constructor(x, y, color) {
		this.x = x;
		this.y = y;
		this.r = 0.3;

		this.attackBoxNum = 10;
		this.attackBoxLength = 2.8;
		this.attackBoxRadiusMult = 1.6;
		this.attackFrame = 0;
		this.attackLength = 15;
		this.attackPushMultiplier = 0.4;

		this.friction = 0.85;
		this.locked = false;
		this.dir = 0;
		this.animDir = 0;

		this.speedDash = 1 / 2;
		this.speedMax = 1 / 8;
		this.speedHit = 1 / 16;
		this.speedWalk = 1 / 32;
		

		this.keysDown = [false, false, false, false];
		this.keyPressTimes = [-100, -100, -100, -100];

		this.dx = 0;
		this.dy = 0;
		
		
		this.color = color;

		this.maxHealth = 6;
		this.health = this.maxHealth;
		this.healthRegen = 1 / 720;
		this.maxStamina = 6;
		this.stamina = this.maxStamina;
		this.staminaRegen = 1 / 180;

		this.dashTimeLimit = 40;
		this.dashStamina = this.maxStamina * 0.1;
		
		this.timeSinceAttack = 15;

		this.texture = data_images.Characters.Player;
	}

	

	attack() {
		this.attackFrame += 1;

		if (this.attackFrame == Math.floor(this.attackLength / 4)) {
			var xDist;
			var yDist;
			//actual attacking
			//get list of enemies that's possibly close enough
			var entityList = [];
			loading_map.entities.forEach(e => {
				var eDist = Math.sqrt(xDist * xDist + yDist * yDist);
			});

			var boxOffset = polToXY(0, 0, this.a, ((this.r * camera.scale * this.attackBoxLength)) / camera.scale);
			var boxPos;
			var boxR;

			//loop through series of collision boxes
			for (var b=0; b<this.attackBoxNum; b++) {
				boxPos = [this.x + (boxOffset[0] * b), this.y + (boxOffset[1] * b)];
				boxR = this.r * camera.scale * this.attackBoxRadiusMult * Math.pow(0.95, b);
				xDist = Math.abs(entity.x - boxPos[0]) * camera.scale;
				yDist = Math.abs(entity.y - boxPos[1]) * camera.scale;

				//if the enemy is close enough, attack and then break out of loop
				if (Math.sqrt(xDist * xDist + yDist * yDist) < boxR + entity.r) {
					this.hitEntity(entity);
					return;
				}
			}
		}

		if (this.attackFrame > this.attackLength) {
			this.attackFrame = 0;
		}
	}

	attemptAttack() {
		if (this.attackFrame == 0) {
			this.attackFrame = 1;
		} else {
			this.timeSinceAttack = 0;
		}
	}

	beDrawn() {
		var [drawX, drawY] = spaceToScreen(this.x + loading_map.x, this.y + loading_map.y);
		var drawR = this.r * camera.scale;

		ctx.fillStyle = color_player;
		ctx.beginPath();
		ctx.ellipse(drawX, drawY - (drawR * render_vSquish * 0.9), drawR, drawR * 2 * render_vSquish, 0, 0, Math.PI * 2);
		ctx.fill();
	}

	hitEntity(entity) {
		var strength = 0.8 * sigmoid((this.timeSinceAttack * 0.6) - (this.attackLength * 0.5), 0, 1);
		entity.speed = entity.speedHit;
		entity.moveQueue.splice(0, 0, ((this.a / (Math.PI / 2)) + 2) % 4);
		entity.health -= strength;
	}

	tick() {
		//regen
		if (this.health > 0) {
			this.health = Math.min(this.maxHealth, this.health + (Math.abs(Math.sin(world_time / 90)) * this.healthRegen));
			this.stamina = Math.min(this.maxStamina, this.stamina + (Math.abs(Math.sin(world_time / 90)) * this.staminaRegen));
		}

		//attacking
		this.timeSinceAttack += 1;
		if (this.attackFrame > 0) {
			this.attack();
		}

		//movement
		this.updateMomentum();
		this.updatePosition();
	}

	handleInput(negatingBOOLEAN, index) {
		if (negatingBOOLEAN) {
			this.keysDown[index] = false;
			return;
		}

		//if pressing the key
		if (!this.keysDown[index]) {
			this.animDir = index;
			//if it isn't already pressed, press it and refresh the time
			this.keysDown[index] = true;

			//if it's been pressed fast enough, do the boost
			if (world_time - this.keyPressTimes[index] < this.dashTimeLimit) {
				//dashing goes here
				this.keyPressTimes[index] = -1;
			} else {
				this.keyPressTimes[index] = world_time;
			}
		}
	}

	teleport(relativeX, relativeY) {
		this.x += relativeX;
		this.y += relativeY;
	}

	updateMomentum() {
		var xAcc = this.keysDown[2] - this.keysDown[0];
		var yAcc = this.keysDown[3] - this.keysDown[1];
		//update velocity based on acceleration
		if (xAcc == 0) {
			//apply friction if not accelerating
			this.dx *= this.friction;
		} else {
			this.dx += this.speedWalk * xAcc;
		}

		if (yAcc == 0) {
			this.dy *= this.friction;
		} else {
			this.dy += this.speedWalk * yAcc;
		}

		//capping
		var mag = Math.sqrt(this.dx ** 2 + this.dy ** 2);
		if (mag > this.speedMax) {
			this.dx = this.dx / mag * this.speedMax;
			this.dy = this.dy / mag * this.speedMax;
		}
	}

	updatePosition() {
		//position updates, if map allows
		if (loading_map.validateMovementTo(Math.round(this.x + this.dx), Math.round(this.y), this)) {
			this.x += this.dx;
		} else {
			this.dx *= this.friction ** 2;
		}

		if (loading_map.validateMovementTo(Math.round(this.x), Math.round(this.y + this.dy), this)) {
			this.y += this.dy;
		} else {
			this.dy *= this.friction ** 2;
		}
	}
}



class Portal {
	constructor(x, y, leadsToZoneID) {
		this.x = x;
		this.y = y;
		this.zone = leadsToZoneID;

		this.r = 0.7;
		this.rBoost = 1.05;
		this.rBase = this.r;
		this.rVariance = 0.04;
		this.rTime = 40;

		this.aBase = 0;
		this.aVariance = 0.2;
		this.aTime = 120;

		this.sides = 12;
		this.sideStorage = [];

		this.absorbing = false;
		this.absorbTime = 0;
	}

	beDrawn() {
		//if there's no information to draw, don't draw anything
		if (this.sideStorage.length < this.sides) {
			return;
		}
		var angularOffset = this.aBase + this.aVariance * Math.sin(world_time / this.aTime);
		var angle;
		var cornerCoords;
		//go around in a circle, drawing all the edges
		ctx.beginPath();
		
		for (var a=0; a<this.sides; a++) {
			angle = (Math.PI * 2 * a) / this.sides;
			cornerCoords = polToXY(this.x + loading_map.x, this.y + loading_map.y, angle + angularOffset, this.sideStorage[a] + this.rVariance * Math.cos((world_time / this.rTime) + 5 * angle));
			ctx.lineTo(...spaceToScreen(...cornerCoords));
		}

		if (this.zone.constructor.name == "String") {
			this.zone = getZone(this.zone);
		}

		// ctx.strokeStyle = color_portal;
		// ctx.lineWidth = canvas.height / 120;
		// ctx.stroke();

		//make sure other side is defined
		if (this.zone == undefined) {
			//draw solid wall
			ctx.fillStyle = color_portal;
			ctx.fill();
		} else {
			//draw other side
			ctx.save();
			ctx.clip();
			drawBackground();
			this.zone.beDrawn();
			player.beDrawn();
			ctx.restore();
		}
	}

	evalStrengthAt(x, y) {
		//take into account self's x/y, as well as player's x/y
		var val;
		val = 1 / (Math.sqrt((x - player.x) ** 2 + (y - player.y) ** 2) / player.r) ** 4;
		val += 1 / (Math.sqrt((x - this.x) ** 2 + (y - this.y) ** 2) / this.r);
		return  val;
	}

	tick() {
		var angularOffset = this.aBase + this.aVariance * Math.sin(world_time / this.aTime);

		//calculate portal sizes
		var acceptableError = 0.01;
		var dist;
		var distStep;
		var str;
		var i = 0;
		for (var a=0; a<this.sides; a++) {
			var pointing = polToXY(0, 0, ((Math.PI * 2 * a) / this.sides) + angularOffset, 1);

			//start with an initial guess, then approximate the distance to strength=1 and move there repeatedly until close enough
			dist = this.r;
			distStep = this.r / 10;
			i = 100;
			while (i > 0) {
				str = this.evalStrengthAt(this.x + pointing[0] * dist, this.y + pointing[1] * dist);

				//if the error is ok, break out of the loop
				if (Math.abs(1 - str) <= acceptableError) {
					break;
				}
				dist += distStep * boolToSigned(str > 1);
				distStep *= 0.99;
				i -= 1;
			}

			//use the new position
			this.sideStorage[a] = dist;
		}



		//absorb
		if (!this.absorbing && Math.sqrt((player.x - this.x) ** 2 + (player.y - this.y) ** 2) < this.r) {
			this.absorbing = true;
		}

		if (this.absorbing) {
			//expand radius
			this.r *= 1 + (this.absorbTime / 100);

			//suck player inwards
			var playerDir = [player.x - this.x, player.y - this.y];
			player.dx *= player.friction;
			player.dy *= player.friction;

			playerDir[0] *= 0.95;
			playerDir[1] *= 0.95;

			player.x = this.x + playerDir[0];
			player.y = this.y + playerDir[1];

			this.absorbTime += 1;

			//if radius is great enough, cancel absorption and switch maps
			if (this.r > Math.sqrt(canvas.width ** 2 + canvas.height ** 2) / camera.scale) {
				this.absorbTime = 0;
				this.r = this.rBase;
				loading_map.entities.splice(loading_map.entities.indexOf(player), 1);
				this.zone.entities.push(player);
				player.x = player.x - loading_map.x + this.zone.x;
				camera.x = camera.x - loading_map.x + this.zone.x;
				player.y = player.y - loading_map.y + this.zone.y;
				camera.y = camera.y - loading_map.y + this.zone.y;
				loading_map = this.zone;
				
			}
		}
	}
}



//map class, for maps y'know?
class Zone {
	constructor(x, y, name, connections, collisionData, display, entities, palettePath, music) {
		this.name = name;
		this.x = x;
		this.y = y;

		this.connections = connections;
		this.data = collisionData;
		this.display = display;
		this.entities = entities;

		this.palettePath = palettePath;
		this.palette = eval(`data_images.${palettePath}`);

		this.musicID = music;

		this.dArr = undefined;
	}

	beDrawn() {
		//draw self
		this.dArr = this.display;
		this.beDrawn_images();

		//if there are portals, make sure to put them on top of the map
		this.entities.forEach(h => {
			if (h.constructor.name == "Portal") {
				//only draw if it's close enough
				var hCoords = spaceToScreen(h.x + this.x, h.y + this.y);
				if (Math.abs(hCoords[0] - (canvas.width / 2)) < canvas.width * 0.6 || Math.abs(hCoords[1] - (canvas.height / 2)) < canvas.height * 0.6) {
					h.beDrawn();
				}
			}
		});
	}

	beDrawn_collision() {
		//border
		ctx.lineWidth = 2;
		ctx.strokeStyle = color_editor_border;
		var startXY = spaceToScreen(this.x - 0.5, this.y - 0.5);
		var endXY = spaceToScreen(this.x + this.data[0].length - 0.5, this.y + this.data.length - 0.5);
		ctx.rect(startXY[0], startXY[1], endXY[0] - startXY[0], endXY[1] - startXY[1]);
		ctx.stroke();

		//actual squares
		this.dArr = this.data;
		var palStore = this.palette;
		this.palette = data_images.Empty;
		this.beDrawn_images();
		this.dArr = this.display;
		this.palette = palStore;
		

		//other map
		if (loading_state.exit != undefined && this == loading_map) {
			var ref = this.connections[loading_state.exit];
			ref[0].x = this.x + ref[1][0];
			ref[0].y = this.y + ref[1][1];
			ref[0].beDrawn_collision();
		}
	}

	beDrawn_images() {
		//squares
		var startXY = screenToSpace(0, 0);
		startXY[0] = Math.max(Math.floor(startXY[0]) - this.x, 0);
		startXY[1] = Math.max(Math.floor(startXY[1]) - this.y, 0);
		var pixelStartXY = spaceToScreen(this.x, this.y);
		pixelStartXY[0] = Math.floor(pixelStartXY[0]);
		pixelStartXY[1] = Math.floor(pixelStartXY[1]);

		var xLen = Math.min(Math.ceil(canvas.width / camera.scale) + 3, this.data[0].length - startXY[0]);
		var yLen = Math.min(Math.ceil(canvas.height / (camera.scale * render_vSquish)) + 3, this.data.length - startXY[1]);

		ctx.fillStyle = color_collision;
		var drawXStart = pixelStartXY[0] + 1 + ((startXY[0] - 0.5) * camera.scale);
		var drawYStart = pixelStartXY[1] + 1 + ((startXY[1] - 0.5) * camera.scale * render_vSquish) - (camera.scale * (1 - render_vSquish));
		var entityArrPos = 0;
		for (var y=startXY[1]; y<startXY[1]+yLen; y++) {
			for (var x=startXY[0]; x<startXY[0]+xLen; x++) {
				//draw square
				this.palette.drawTexture(this.dArr[y][x], x, y, drawXStart + ((x - startXY[0]) * camera.scale), drawYStart + ((y - startXY[1]) * camera.scale * render_vSquish), camera.scale);
			}
			//draw the entities for that row, assuming all the entities are in order
			while (entityArrPos < this.entities.length && this.entities[entityArrPos].y <= y) {
				//don't draw portals
				if (this.entities[entityArrPos].constructor.name != "Portal") {
					this.entities[entityArrPos].beDrawn();
				}
				entityArrPos += 1;
			}
		}
	}

	beDrawn_fading(fadeFromRelativeX, fadeFromRelativeY) {
		this.dArr = this.display;
		var store = ctx.globalAlpha;

		var startXY = screenToSpace(0, 0);
		startXY[0] = Math.max(Math.floor(startXY[0]) - this.x, 0);
		startXY[1] = Math.max(Math.floor(startXY[1]) - this.y, 0);
		var pixelStartXY = spaceToScreen(this.x, this.y);
		var xLen = Math.min(Math.ceil(canvas.width / camera.scale) + 1, this.data[0].length - startXY[0]);
		var yLen = Math.min(Math.ceil(canvas.height / (camera.scale * render_vSquish)) + 1, this.data.length - startXY[1]);

		var dist;
		var xDist;
		var yDist;
		var drawX;
		var drawY;
		ctx.fillStyle = color_collision;
		for (var y=startXY[1]; y<startXY[1]+yLen; y++) {
			for (var x=startXY[0]; x<startXY[0]+xLen; x++) {
				//figure out opacity based on distance
				xDist = fadeFromRelativeX - x;
				yDist = fadeFromRelativeY - y;
				dist = Math.sqrt(xDist * xDist + yDist * yDist);
				
				ctx.globalAlpha = Math.max(0, 1 - (dist / world_outsideMapFade));
				//draw square
				drawX = pixelStartXY[0] + 1 + ((x - 0.5) * camera.scale);
				drawY = pixelStartXY[1] + 1 + ((y - 0.5) * camera.scale * render_vSquish) - (camera.scale * (1 - render_vSquish));
				this.palette.drawTexture(this.dArr[y][x], x, y, drawX, drawY, camera.scale);
			}
		}
		ctx.globalAlpha = store;
	}

	//TODO: this feels horribly inefficient
	changeCollisionSquare(x, y, newValue) {
		//if y is invalid
		if (y < 0) {
			this.entities.forEach(e => {
				e.y -= y;
			});
		}
		for (y; y<0; y++) {
			this.y -= 1;
			
			this.data.splice(0, 0, []);
			for (var a=0; a<this.data[1].length; a++) {
				this.data[0][a] = " ";
			}
			this.display.splice(0, 0, JSON.parse(JSON.stringify(this.data[0])));
		}
			
		while (y > this.data.length-1) {
			this.data.push([]);
			for (var a=0; a<this.data[0].length; a++) {
				this.data[this.data.length-1][a] = " ";
			}
			this.display.push(JSON.parse(JSON.stringify(this.data[this.data.length-1])));
		}
		
		//if x is invalid
		if (x < 0) {
			//move self
			this.x += x;

			this.entities.forEach(e => {
				e.x -= x;
			});

			//add buffer to all rows
			for (var c=0; c<this.data.length; c++) {
				for (var i=0; i<Math.abs(x-1); i++) {
					this.data[c].splice(0, 0, " ");
					this.display[c].splice(0, 0, " ");
				}
			}
			x = 0;
		}

		if (x >= this.data[0].length) {
			var amount = x - (this.data[0].length - 1);
			for (var c=0; c<this.data.length; c++) {
				for (var i=0; i<amount; i++) {
					this.data[c].push(" ");
					this.display[c].push(" ");
				}
			}
		}

		//set square
		this.data[y][x] = newValue;

		this.removeExcessTiles();
	}

	changeDisplaySquare(x, y, newValue) {
		//only change if in bounds
		if (x >= 0 && x < this.display[0].length && y >= 0 && y < this.display.length) {
			this.display[y][x] = newValue;
		}
	}

	removeExcessTiles() {
		//determine which sides are good
		var removal = [true, true, true, true];
		var removed = [0, 0];
		while (removal[0] + removal[1] + removal[2] + removal[3] > 0) {
			//if the left wall worth removing?
			if (removal[0]) {
				for (var y=0; y<this.data.length; y++) {
					if (this.data[y][0] != " " || this.display[y][0] != " ") {
						removal[0] = false;
					}
				}
				//actual remove
				if (removal[0]) {
					removed[0] += 1;
					for (var y=0; y<this.data.length; y++) {
						this.data[y].splice(0, 1);
						this.display[y].splice(0, 1);
					}
				}
			}

			//is the top wall worth removing
			if (removal[1]) {
				for (var y=0; y<this.data[0].length; y++) {
					if (this.data[0][y] != " " || this.display[0][y] != " ") {
						removal[1] = false;
					}
				}

				if (removal[1]) {
					removed[1] += 1;
					this.data.splice(0, 1);
					this.display.splice(0, 1);
				}
			}

			//right wall
			if (removal[2]) {
				for (var y=0; y<this.data.length; y++) {
					if (this.data[y][this.data[y].length-1] != " " || this.display[y][this.data[y].length-1] != " ") {
						removal[2] = false;
					}
				}
				if (removal[2]) {
					for (var y=0; y<this.data.length; y++) {
						this.data[y].pop();
						this.display[y].pop();
					}
				}
			}

			//lower wall
			if (removal[3]) {
				for (var y=0; y<this.data[this.data.length-1].length; y++) {
					if (this.data[this.data.length-1][y] != " " || this.display[this.data.length-1][y] != " ") {
						removal[3] = false;
					}
				}
				if (removal[3]) {
					this.data.pop();
					this.display.pop();
				}
			}
		}

		//entity coordinate changes
		this.entities.forEach(e => {
			e.x -= removed[0];
			e.y -= removed[1];
		});
	}

	stringifyEntities() {
		var str = ``;
		this.entities.forEach(e => {
			switch (e.constructor.name) {
				case "Spike":
					str += `~SPK_${e.x}_${e.y}_${e.type}`;
					break;
			}
		});
		if (str.length > 0) {
			return `entities${str}`;
		}
		return str;
	}

	tick() {
		//sort entities by y
		this.entities.sort(function (a, b) {
			return a.y - b.y;
		});
		this.entities.forEach(e => {
			e.tick();
		});
	}

	transferPlayerToMap(map) {
		player.teleport(this.x - map.x, this.y - map.y);
		audio_channel1.targetAudio = data_audio[map.musicID];
		loading_map = map;
		this.entities.splice(player);
		loading_map.entities.push(player);
	}

	validateMovementTo(x, y, entity) {
		//if the entity is a player, they have the ability to change maps
		if (entity == player && loading_map == this) {
			var playerMap;
			try {
				playerMap = this.data[player.lastPos[1]][player.lastPos[0]] - 1;
			} catch (er) {
				playerMap = -1;
			}
			
			var connectObj = this.connections[playerMap]
			if (connectObj != undefined) {
				
				if (connectObj[0].validateMovementTo((x + this.x) - connectObj[0].x, (y + this.y) - connectObj[0].y, entity)) {
					this.transferPlayerToMap(this.connections[playerMap][0]);
					return true;
				} 
			}
		}
		if (this.data[y] == undefined) {
			return false;
		}
		if (this.data[y][x] == undefined) {
			return false;
		}
		if (this.data[y][x] === " ") {
			return false;
		}

		//loop through entities, if there's an entity there don't allow it
		for (var e=0; e<this.entities.length; e++) {
			if (!this.entities[e].intangible && Math.round(this.entities[e].x) == x && Math.round(this.entities[e].y) == y && this.entities[e] != entity) {
				return false;
			}
		}
		return true;
	}
}