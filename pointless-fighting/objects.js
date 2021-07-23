
//for camera movement
class Camera {
	constructor(x, y, zoom) {
		this.scale = zoom;
		this.x = x;
		this.y = y;
		this.cornerCoords = [x - ((canvas.width / 2) / zoom), y - ((canvas.height / 2) / zoom), x + ((canvas.width / 2) / zoom), y + ((canvas.height / 2) / zoom)];
	}

	tick() {
		//target player
		if (!editor_active) {
			this.x = player.x;
			this.y = player.y;
		}

		this.cornerCoords = [this.x - ((canvas.width / 2) / this.scale), this.y - ((canvas.height / 2) / this.scale), 
							this.x + ((canvas.width / 2) / this.scale), this.y + ((canvas.height / 2) / this.scale)];
	}
}




//map class, for maps y'know?
class Zone {
	constructor(offsetX, offsetY, collisionData, exitData) {
		this.x = offsetX;
		this.y = offsetY;
		this.data = collisionData;
		this.entities = [];
		this.connections = exitData;
		if (this.connections == undefined) {
			this.connections = [];
		}
	}

	beDrawn() {
		//draw self
		ctx.fillStyle = color_foreground;
		if (player.map == this) {
			for (var y=0; y<this.data.length; y++) {
				for (var x=0; x<this.data[y].length; x++) {
					this.drawTile(x, y);
				}
			}
		} else {
			var store = ctx.globalAlpha;

			var dist;
			var xDist;
			var yDist;
			for (var y=0; y<this.data.length; y++) {
				for (var x=0; x<this.data[y].length; x++) {
					//figure out opacity based on distance
					xDist = player.x - (this.x + x);
					yDist = player.y - (this.y + y);
					dist = Math.sqrt(xDist * xDist + yDist * yDist);
					ctx.globalAlpha = Math.max(0, 1 - (dist / world_outsideMapFade));
					this.drawTile(x, y);
				}
			}
			ctx.globalAlpha = store;
		}
		

		//draw entities
		this.entities.forEach(e => {
			e.beDrawn();
		});

		//if there's another map the player's about to go to, draw that as well
		var mapNum;
		if (player.map == this) {
			//if the player's coordinates round to a map square, show the map but with more fade
			try {
				if (this.data[Math.round(player.y) - this.y][Math.round(player.x) - this.x] > 0) {
					var xDist = player.x - player.lastPos[0];
					var yDist = player.y - player.lastPos[1];
					world_outsideMapFade = world_outsideMapFadeConstant * (1 - Math.sqrt(xDist * xDist + yDist * yDist));
					mapNum = this.data[Math.round(player.y) - this.y][Math.round(player.x) - this.x] - 1;
				}
			} catch (er) {
				//player is off the map, nothing needs to be done because in this case they're leaving / entering
			}

			if (mapNum == undefined) {
				//if the player is on a map square, they'll obviously show the new map
				try {
					if (this.data[player.lastPos[1] - this.y][player.lastPos[0] - this.x] > 0) {
						mapNum = this.data[player.lastPos[1] - this.y][player.lastPos[0] - this.x] - 1;
					}
				} catch (er) {
					//also leaving / entering case
				}
				
			}
			

			


			if (this.connections[mapNum] != undefined) {
				this.connections[mapNum][0].x = this.x + this.connections[mapNum][1][0];
				this.connections[mapNum][0].y = this.y + this.connections[mapNum][1][1];
				this.connections[mapNum][0].beDrawn();
			}
		}
	}

	drawTile(x, y) {
		var drawX = (((this.x + x - 0.5) - camera.cornerCoords[0]) * camera.scale) + 1;
		var drawY = (((this.y + y - 0.5) - camera.cornerCoords[1]) * camera.scale) + 1;

		//terrain
		if (this.data[y][x] !== " ") {
			//draw square
			ctx.fillRect(drawX, drawY, camera.scale - 2, camera.scale - 2);
		}

		//if it's a number greater than 0, put a number on it
		if (this.data[y][x] > 0) {
			ctx.fillStyle = color_text;
			ctx.font = `${camera.scale / 2}px Ubuntu`;
			ctx.textAlign = "center";
			ctx.fillText(this.data[y][x], drawX + (camera.scale / 2), drawY + (camera.scale * 0.66));
			ctx.fillStyle = color_foreground;
		}
	}

	tick() {
		this.entities.forEach(e => {
			e.tick();
		});
	}

	transferPlayerToMap(map) {
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

		this.r = 30;
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

		this.map = parentMap;
	}

	

	attack() {
		this.attackFrame += 1;

		/*
		if (this.attackFrame == Math.floor(this.attackLength / 4)) {
			//actual attacking
			//simple p1/2 switch, fix later
			var entity = player1;
			if (player1 == this) {
				entity = player2;
			}

			var boxOffset = polToXY(0, 0, this.a, ((this.r * this.attackBoxLength) / this.attackBoxNum) / camera.scale);
			var boxPos;
			var boxR;

			//loop through series of collision boxes
			for (var b=0; b<this.attackBoxNum; b++) {
				boxPos = [this.x + (boxOffset[0] * b), this.y + (boxOffset[1] * b)];
				boxR = this.r * this.attackBoxRadiusMult * Math.pow(0.95, b);
				var xDist = Math.abs(entity.x - boxPos[0]) * camera.scale;
				var yDist = Math.abs(entity.y - boxPos[1]) * camera.scale;

				//if the enemy is close enough, attack and then break out of loop
				if (Math.sqrt(xDist * xDist + yDist * yDist) < boxR + entity.r) {
					this.hitEntity(entity);
					return;
				}
			}
		} */

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

		//sword changes angle depending on attack frame
		var mult = 0.65 + ((this.attackLength / this.attackFrame) * -0.1);
		if (this.attackFrame == 0) {
			mult = 0.65;
		}
		var swordStartPos = polToXY(drawX, drawY, this.a + (Math.PI * 0.3), this.r);
		var swordEndPos = polToXY(drawX, drawY, this.a + (Math.PI * mult), this.r * 2);
		drawLine(color_sword, swordStartPos, swordEndPos, 3);

		//circle for body
		drawCircle(this.color, drawX, drawY, this.r);
		
		//eyes
		var eye1Pos = polToXY(drawX, drawY, this.a + 0.65, this.r * 0.44);
		var eye2Pos = polToXY(drawX, drawY, this.a - 0.65, this.r * 0.44);
		drawCircle("#000", eye1Pos[0], eye1Pos[1], this.r / 10);
		drawCircle("#000", eye2Pos[0], eye2Pos[1], this.r / 10);

		//attack circles
		if (this.attackFrame >= Math.floor(this.attackLength / 4)) {
			ctx.globalAlpha = Math.max(0, 0.3 - ((this.attackFrame - Math.floor(this.attackLength / 4)) * 0.05));
			var boxOffset = polToXY(0, 0, this.a, (this.r * this.attackBoxLength) / this.attackBoxNum);
			var boxPos;
			var boxR;

			//loop through series of collision boxes
			for (var b=0; b<this.attackBoxNum; b++) {
				boxPos = [drawX + boxOffset[0] * b, drawY + (boxOffset[1] * b)];
				boxR = this.r * this.attackBoxRadiusMult * Math.pow(0.95, b);
				drawCircle(color_attackBubble, boxPos[0], boxPos[1], boxR);
			}
			ctx.globalAlpha = 1;
		}
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