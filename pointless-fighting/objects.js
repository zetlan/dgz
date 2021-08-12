
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
		this.vSquish = 0.8;

		this.calculateCorners();
	}

	calculateCorners() {
		this.cornerCoords = [this.x - ((canvas.width / 2) / this.scale), this.y - ((canvas.height / 2) / this.scale) / this.vSquish,
							this.x + ((canvas.width / 2) / this.scale), this.y + ((canvas.height / 2) / this.scale) / this.vSquish];
	}

	tick_free() {
		this.x += this.dx;
		this.y += this.dy;
		this.scale = ((this.scale * 7) + this.targetScale) / 8;
		this.calculateCorners();
	}

	tick_follow() {
		this.x = player.x;
		this.y = player.y;
		this.calculateCorners();
	}
}







//TODO: 'time since attack' system doesn't work properly
//player class
class Player {
	constructor(x, y, color, parentMap) {
		this.x = x;
		this.y = y;
		this.lastPos = [x, y];

		this.attackBoxNum = 10;
		this.attackBoxLength = 2.8;
		this.attackBoxRadiusMult = 1.6;
		this.attackFrame = 0;
		this.attackLength = 15;
		this.attackPushMultiplier = 0.4;

		this.friction = 0.95;

		
		this.speedDash = 1/2;
		this.speedHit = 1 / 16;
		this.speedNormal = 1 / 9;
		this.speed = 0;

		this.blockInputOf = undefined;
		this.downQueue = [];
		this.moveQueue = [];
		this.queuePos = 0;
		this.queueMaxLength = 4;
		this.lastPressTime = -100;

		this.r = 1;
		this.a = 0;
		this.color = color;

		this.maxHealth = 6;
		this.health = this.maxHealth;
		this.healthRegen = 1 / 720;
		this.maxStamina = 6;
		this.stamina = this.maxStamina;
		this.staminaRegen = 1 / 180;

		
		this.timeSinceAttackPress = 15;

		this.frequencyDashLimit = 15;
		this.frequencyHaltLimit = 5;
		this.dashStamina = this.maxStamina * 0.1;

		this.texture = data_images.Characters.Player;
		this.map = parentMap;
	}

	

	attack() {
		this.attackFrame += 1;

		
		if (this.attackFrame == Math.floor(this.attackLength / 4)) {
			var xDist;
			var yDist;
			//actual attacking
			//get list of enemies that's possibly close enough
			var entityList = [];
			this.map.entities.forEach(e => {
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
			this.timeSinceAttackPress = 0;
		}
	}

	determineTargetPos() {
		return this.determinePosFromDir(this.moveQueue[0]);
	}

	determinePosFromDir(direction) {
		var targetPos = [this.lastPos[0], this.lastPos[1]];
		switch (direction) {
			case 0:
				targetPos[0] -= 1;
				break;
			case 1:
				targetPos[1] -= 1;
				break;
			case 2:
				targetPos[0] += 1;
				break;
			case 3:
				targetPos[1] += 1;
				break;
		}
		return targetPos;
	}

	hitEntity(entity) {
		var strength = 0.8 * sigmoid((this.timeSinceAttackPress * 0.6) - (this.attackLength * 0.5), 0, 1);
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
		this.timeSinceAttackPress += 1;
		if (this.attackFrame > 0) {
			this.attack();
		}
		//movement
		if (this.attackFrame <= 0 || this.speed != this.speedNormal) {
			this.updatePosition();
		}
	}

	beDrawn() {
		//get direction + drawing position of self 
		if (this.moveQueue.length > 0) {
			this.a = (this.moveQueue[0] * (Math.PI / 2)) + (Math.PI);
			this.a %= Math.PI * 2;
		}
		
		var [drawX, drawY] = spaceToScreen(this.x, this.y);
		var drawR = this.r * camera.scale;

		this.texture.drawTexture(drawX, drawY, drawR, drawR);
	}

	handleInput(negatingBOOLEAN, index) {
		if (negatingBOOLEAN) {
			//remove index from the down queue
			if (this.downQueue.includes(index)) {
				this.downQueue.splice(this.downQueue.indexOf(index), 1);
			}

			if (index == this.moveQueue[this.moveQueue.length-1] || this.moveQueue.length == 0) {
				this.blockInputOf = undefined;
			}
		} else {
			if (this.blockInputOf != index || this.moveQueue.length == 0) {
				if (!this.downQueue.includes(index)) {
					this.downQueue.push(index);
				}
				this.moveQueue.push(index);
				this.speed = this.speedNormal;

				//if the queue's longer than the max, preserve the start and the end but cut out inputs from the middle
				if (this.moveQueue.length > this.queueMaxLength) {
					this.moveQueue.splice(1, 1);
				}

				//if there's 2 in a row and the click is fast enough, start a dash
				if (this.moveQueue.length >= 2 && this.moveQueue[this.moveQueue.length-1] == this.moveQueue[this.moveQueue.length-2] && world_time - this.lastPressTime < this.frequencyDashLimit) {
					this.moveQueue = [this.moveQueue[0], index];
					this.speed = this.speedDash;
				}

				this.lastPressTime = world_time;
				this.blockInputOf = index;
			}
		}
	}

	updatePosition() {
		//if the queue is empty, add any direction that's down
		if (this.moveQueue.length == 0) {
			for (var i=0; i<this.downQueue.length; i++) {
				var target = this.determinePosFromDir(this.downQueue[i]);
				if (this.map.validateMovementTo(target[0], target[1], this)) {
					this.moveQueue.push(this.downQueue[i]);
					this.blockInputOf = this.downQueue[i];
					this.speed = this.speedNormal;
				}
			}
		}

		
		//get target
		var targetPos = this.determineTargetPos();

		//if target is invalid, just move on to the next command
		while (!this.map.validateMovementTo(targetPos[0], targetPos[1], this)) {
			
			[this.x, this.y] = this.lastPos;
			this.moveQueue.splice(0, 1);
			if (this.moveQueue.length == 0) {
				this.queuePos = 0;
				this.speed = 0;
				return;
			}
			targetPos = this.determineTargetPos();
		}
		//update speed
		if (this.speed > this.speedNormal) {
			this.speed = Math.max(this.speedNormal, this.speed * this.friction);
		}
		
		this.queuePos += this.speed;

		//if queue is far enough along, set target and try again
		while (this.queuePos > 1) {
			this.queuePos -= 1;
			[this.x, this.y] = targetPos;
			this.lastPos = targetPos;

			//remove object from queue only if that's not the direction the player is currently holding
			if (this.moveQueue.length > 1 || (this.moveQueue.length == 1 && this.blockInputOf == undefined)) {
				this.moveQueue.splice(0, 1);
				//if out of queue, exit early
				if (this.moveQueue.length == 0) {
					this.queuePos = 0;
					this.speed = 0;
					return;
				}
			}
			
			targetPos = this.determineTargetPos();
		}

		//if next position is valid and moving towards it, interpolate between them at the current speed
		this.x = linterp(this.lastPos[0], targetPos[0], this.queuePos);
		this.y = linterp(this.lastPos[1], targetPos[1], this.queuePos);
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

		//draw entities
		this.entities.forEach(e => {
			e.beDrawn();
		});

		//if there's another map the player's about to go to, draw that as well
		if (player.map == this) {
			this.drawOtherMap();
		}
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

		var xLen = Math.min(Math.ceil(canvas.width / camera.scale) + 3, this.data[0].length - startXY[0]);
		var yLen = Math.min(Math.ceil(canvas.height / (camera.scale * camera.vSquish)) + 1, this.data.length - startXY[1]);

		ctx.fillStyle = color_collision;
		var drawXStart = pixelStartXY[0] + 1 + ((startXY[0] - 0.5) * camera.scale);
		var drawYStart = pixelStartXY[1] + 1 + ((startXY[1] - 0.5) * camera.scale * camera.vSquish) - (camera.scale * (1 - camera.vSquish));
		for (var y=startXY[1]; y<startXY[1]+yLen; y++) {
			for (var x=startXY[0]; x<startXY[0]+xLen; x++) {
				//draw square
				this.palette.drawTexture(this.dArr[y][x], x, y, drawXStart + ((x - startXY[0]) * camera.scale), drawYStart + ((y - startXY[1]) * camera.scale * camera.vSquish), camera.scale);
			}
		}
	}

	beDrawn_fading() {
		this.dArr = this.display;
		var store = ctx.globalAlpha;

		var startXY = screenToSpace(0, 0);
		startXY[0] = Math.max(Math.floor(startXY[0]) - this.x, 0);
		startXY[1] = Math.max(Math.floor(startXY[1]) - this.y, 0);
		var pixelStartXY = spaceToScreen(this.x, this.y);
		var xLen = Math.min(Math.ceil(canvas.width / camera.scale) + 1, this.data[0].length - startXY[0]);
		var yLen = Math.min(Math.ceil(canvas.height / (camera.scale * camera.vSquish)) + 1, this.data.length - startXY[1]);

		var dist;
		var xDist;
		var yDist;
		var drawX;
		var drawY;
		ctx.fillStyle = color_collision;
		for (var y=startXY[1]; y<startXY[1]+yLen; y++) {
			for (var x=startXY[0]; x<startXY[0]+xLen; x++) {
				//figure out opacity based on distance
				xDist = player.x - (this.x + x);
				yDist = player.y - (this.y + y);
				dist = Math.sqrt(xDist * xDist + yDist * yDist);
				ctx.globalAlpha = Math.max(0, 1 - (dist / world_outsideMapFade));
				//draw square
				drawX = pixelStartXY[0] + 1 + ((x - 0.5) * camera.scale);
				drawY = pixelStartXY[1] + 1 + ((y - 0.5) * camera.scale * camera.vSquish) - (camera.scale * (1 - camera.vSquish));
				this.palette.drawTexture(this.dArr[y][x], x, y, drawX, drawY, camera.scale);
			}
		}
		ctx.globalAlpha = store;
	}

	drawOtherMap() {
		var mapNum;
		//if the player's coordinates round to a map square, show the map but with more fade
		try {
			if (this.data[Math.round(player.y) - this.y][Math.round(player.x) - this.x] > 0) {
				var xDist = player.x - player.lastPos[0];
				var yDist = player.y - player.lastPos[1];
				world_outsideMapFade = world_outsideMapFadeConstant * (1 - Math.max(Math.abs(xDist), Math.abs(yDist)));
				mapNum = this.data[Math.round(player.y) - this.y][Math.round(player.x) - this.x] - 1;
			}
		} catch (er) {
			//player is off the map, nothing needs to be done because in this case they're leaving / entering
		}

		//actual drawing
		if (this.connections[mapNum] != undefined) {
			var ref = this.connections[mapNum];
			ref[0].x = this.x + ref[1][0];
			ref[0].y = this.y + ref[1][1];
			ref[0].beDrawn_fading();
		}
	}

	//TODO: this feels horribly inefficient
	changeCollisionSquare(x, y, newValue) {
		//if y is invalid
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

		//this.removeExcessTiles();
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
					for (var y=0; y<this.data.length; y++) {
						this.data[y].splice(0, 1);
						this.display[y].splice(0, 1);
					}
				}
			}

			//is the top wall worth removing
			if (removal[1]) {

			}
			
		}
		

	}

	tick() {
		this.entities.forEach(e => {
			e.tick();
		});
	}

	transferPlayerToMap(map) {
		audio_channel1.targetAudio = data_audio[map.musicID];
		player.map = map;
		loading_map = map;
		this.entities.splice(player);
		player.map.entities.push(player);
	}

	validateMovementTo(x, y, entity) {
		//if player is on a map square, check the other map first
		var playerMap;
		try {
			playerMap = this.data[player.lastPos[1] - this.y][player.lastPos[0] - this.x] - 1;
		} catch (er) {
			playerMap = -1;
		}
		
		if (this.connections[playerMap] != undefined) {
			if (this.connections[playerMap][0].validateMovementTo(x, y, entity)) {
				this.transferPlayerToMap(this.connections[playerMap][0]);
				return true;
			} 
		}

		x -= this.x;
		y -= this.y;
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
			if (Math.round(this.entities[e].x) == x && Math.round(this.entities[e].y) == y && this.entities[e] != entity) {
				return false;
			}
		}
		return true;
	}
}