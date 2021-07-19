
//map class, for maps y'know?
class Zone {
	constructor(offsetX, offsetY, collisionData) {
		this.x = offsetX;
		this.y = offsetY;
		this.data = collisionData;
		this.entities = [];
	}

	beDrawn() {
		//draw self
		ctx.fillStyle = color_foreground;
		for (var y=0; y<this.data.length; y++) {
			for (var x=0; x<this.data[y].length; x++) {
				if (this.data[y][x] == 0) {
					//draw square
					ctx.fillRect(((this.x + x) * world_sqSize) + 1, ((this.y + y) * world_sqSize) + 1, world_sqSize - 2, world_sqSize - 2);
				}
			}
		}

		//draw entities
		this.entities.forEach(e => {
			e.beDrawn();
		});
	}

	tick() {
		this.entities.forEach(e => {
			e.tick();
		});
	}

	validateMovementTo(x, y) {
		if (this.data[y][x] == 1) {
			return false;
		}

		//loop through entities, if there's an entity there don't allow it
		for (var e=0; e<this.entities.length; e++) {
			if (Math.round(this.entities[e].x) == x && Math.round(this.entities[e].y) == y) {
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

		this.dx = 0;
		this.dy = 0;
		this.ax = 0;
		this.ay = 0;
		
		this.dMax = 0.01;
		this.dMin = 0.004;
		this.moveDir = undefined;
		this.speed = 0.03;
		this.friction = 0.93;
		this.frictionReverseBoost = 0.17;

		this.r = 30;
		this.a = 0;
		this.color = color;

		this.maxHealth = 6;
		this.health = this.maxHealth;
		this.maxStamina = 6;
		this.stamina = this.maxStamina;

		this.attackBoxNum = 8;
		this.attackBoxLength = 2.5;

		this.attackFrame = 0;
		this.attackLength = 15;
		this.timeSinceAttackPress = 15;

		this.dashFrequencyLimit = 15;
		this.dashPower = 10;
		this.dashStamina = this.maxStamina * 0.1;
		this.dashTimeStorage = [0, 0, 0, 0];

		this.parentMap = parentMap;
	}

	

	attack() {
		this.attackFrame += 1;

		if (this.attackFrame == Math.floor(this.attackLength / 4)) {
			//actual attacking
			//simple p1/2 switch, fix later
			var entity = player1;
			if (player1 == this) {
				entity = player2;
			}

			var boxOffset = polToXY(0, 0, this.a, (this.r * this.attackBoxLength) / this.attackBoxNum);
			var boxPos;
			var boxR;

			//loop through series of collision boxes
			for (var b=0; b<this.attackBoxNum; b++) {
				boxPos = [this.x + boxOffset[0] * b, this.y + (boxOffset[1] * b)];
				boxR = this.r * 2 * Math.pow(0.95, b);
				var xDist = Math.abs(entity.x - boxPos[0]);
				var yDist = Math.abs(entity.y - boxPos[1]);

				//if the enemy is close enough, attack and then break out of loop
				if (Math.sqrt(xDist * xDist + yDist * yDist) < boxR + (entity.r * 0.9)) {
					var strength = 0.8;//0.8 * sigmoid((this.timeSinceAttackPress * 0.8) - (this.attackLength * 0.5), 0, 1);
					entity.health -= strength;
					var pushback = polToXY(0, 0, this.a, strength * 6);
					entity.dx += pushback[0];
					entity.dy += pushback[1];
					return;
				}
			}
		}

		if (this.attackFrame > this.attackLength) {
			this.attackFrame = 0;
		}
	}

	attemptAttack() {
		this.timeSinceAttackPress = 0;
		if (this.attackFrame == 0) {
			this.attackFrame = 1;
		}
	}

	tick() {
		//dash storage
		this.handleDashing();
		//regen
		if (this.health > 0) {
			this.health = Math.min(this.maxHealth, this.health + (Math.abs(Math.sin(world_time / 90)) / 270));
			this.stamina = Math.min(this.maxStamina, this.stamina + (Math.abs(Math.sin(world_time / 90)) / 180));
		}

		//attacking
		if (this.attackFrame > 0) {
			this.attack();
		} else {
			//movement
			if (this.ax != 0) {
				this.dx += sigmoid((this.dMax * boolToSigned(this.ax > 0) - this.dx) * 6, 0, boolToSigned(this.ax > 0)) * this.speed;
			}
			if (this.ay != 0) {
				this.dy += sigmoid((this.dMax * boolToSigned(this.ay > 0) - this.dy) * 6, 0, boolToSigned(this.ay > 0)) * this.speed;
			}
		}

		//actual updating position based on forces
		this.updatePosition();
	}

	beDrawn() {
		//get direction + drawing position of self 
		if (this.dx != 0 || this.dy != 0) {
			this.a = (Math.atan2(this.dx, -this.dy) + (Math.PI * 1.5)) % (Math.PI * 2);
			this.a = Math.round(this.a / (Math.PI / 2)) * (Math.PI / 2);
		}
		
		var drawX = this.x * (world_sqSize + 0.5);
		var drawY = this.y * (world_sqSize + 0.5);

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
				boxR = this.r * 2 * Math.pow(0.95, b);
				drawCircle(color_attackBubble, boxPos[0], boxPos[1], boxR);
			}
			ctx.globalAlpha = 1;
		}
	}

	handleDashing(negatingBOOLEAN, index) {
		if (negatingBOOLEAN) {
			//for first press
			if (this.dashTimeStorage[index] != "dashed") {
				this.dashTimeStorage[index] = world_time;
			} else {
				this.dashTimeStorage[index] = "waiting";
			}
		} else {
			//for second press, actual dashing logic
			if (world_time - this.dashTimeStorage[index] <= this.dashFrequencyLimit && this.stamina > this.maxStamina * 0.1) {
				//make the negating happen and remove stamina
				this.dashTimeStorage[index] = "dashed"; 
				this.stamina -= this.maxStamina * 0.1;

				//update velocity
				switch (index) {
					case 0:
						this.ax = -this.dashPower;
						break;
					case 1:
						this.ay = -this.dashPower;
						break;
					case 2:
						this.ax = this.dashPower;
						break;
					case 3:
						this.ay = this.dashPower;
						break;
				}
			}
		}
	}

	updatePosition() {
		//first update momentum
		this.dx *= this.friction - ((this.ax * this.dx <= 0) * this.frictionReverseBoost);
		this.dy *= this.friction - ((this.ay * this.dy <= 0) * this.frictionReverseBoost);

		switch (this.moveDir) {
			case "x":
				if (Math.abs(this.dx) < this.minSpeed)
				break;
			case "y":
				break;
		}

		if (Math.abs(this.dx) < 0.001) {
			this.dx = 0;
		}
		if (Math.abs(this.dy) < 0.001) {
			this.dy = 0;
		}

		//moving without decision if already moving
		if (this.x % 1 != 0 || this.y % 1 != 0) {
			switch (this.moveDir) {
				case "x":
					this.x += this.dx;
					break;
				case "y":
					this.y += this.dy;
					break;
			}
		}
		//only move if it's worth moving
		if (Math.abs(this.dx) > this.minSpeed || Math.abs(this.dy) > this.minSpeed) {
			//x/y switch
			if (Math.abs(this.dx) > Math.abs(this.dy)) {
				this.moveDir = "x";
				this.x += this.dx;
			} else {
				this.moveDir = "y";
				this.y += this.dy;
			}
		}
		//this.x += this.dx;
		//this.y += this.dy;

		//capping x
		//this.x = clamp(this.x, (world_sqSize * world_cCoords[0]) + this.r, (world_sqSize * world_cCoords[2]) - this.r);
		//this.y = clamp(this.y, (world_sqSize * world_cCoords[1]) + this.r, (world_sqSize * world_cCoords[3]) - this.r);
	}
}