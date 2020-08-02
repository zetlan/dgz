class GamePlayer extends MenuPlayer {
	constructor (x, y) {
		super(x, y);
		//making sure confirmHome doesn't get called every turn
		this.home = 1;

		//changing a few properties
		this.r = 12;
		this.aSpeed = 0.5;
		this.mFric = 0.95;
		this.gravity = 0.4;
		this.jumpForce = 10;
		this.canJump = false;

		this.inWater = false;
	}

	confirmHome() {
	}

	updateCameraScroll() {
	}

	updateYVelocity() {
		//applying jump force if able to jump
		if (this.ay < 0) {
			this.ay = 0;
			if (this.canJump) {
				this.dy = -1 * this.jumpForce;
				this.canJump = false;
			}
		}
	
		//applying gravity
		this.dy += this.gravity;

		this.counterGravity();
	}

	move() {
		//don't go off the world edge
		if (loadingBridge.completed || (this.x + this.dx > 0 && this.x + this.dx < loadingBridge.bridgeArr.length * bridgeSegmentWidth)) {
			//don't go inside the machine
			if (loadingBridge.machine.doesPlayerCollide(this.dx, 0) == false) {
				this.x += this.dx;
			} else {
				//if the machine is moving, and the palyer is on the right side, push to the right
				if (loadingBridge.machine.targetX != loadingBridge.machine.x && this.x > loadingBridge.machine.x) {
					this.x = loadingBridge.machine.x + loadingBridge.machine.r + this.r;
				}
			}
		}

		//don't go inside the machine
		if (loadingBridge.machine.doesPlayerCollide(0, this.dy) == false) {
			this.y += this.dy;
		} else {
			this.y = loadingBridge.machine.y - loadingBridge.machine.r - this.r - this.gravity;
			this.canJump = true;
			this.dy = this.gravity * -1;
		}
	}

	tick() {
		super.tick();
		//check for going into water
		if (this.y > waterHeight) {
			if (!this.inWater) {
				this.inWater = true;
				this.gravity /= 2;
				this.jumpForce /= 2;
				this.aSpeed -= 0.1;
				//creating splashes, whose height is proportional to the speed at which the water is entered
				waveArray.push(new Wave(this.x / waterSegmentWidth, 1 - (1 / Math.abs(this.dy / 4)), 5, wavePropogationRate));
				waveArray.push(new Wave(this.x / waterSegmentWidth, 1 - (1 / Math.abs(this.dy / 4)), 5, -1 * wavePropogationRate));
			}
		} else {
			if (this.inWater) {
				this.inWater = false;
				this.gravity *= 2;
				this.jumpForce *= 2;
				this.aSpeed += 0.1;
			}
			
			
		}
	}

	counterGravity() {
		//counteract gravity if on a bridge segment x wise, having a dy that will take you below the bridge, and being the bridge segment y wise
		if (loadingBridge.bridgeArr[Math.floor(this.x / bridgeSegmentWidth)] > 0 && this.y + this.dy > bridgeHeight - bridgeSegmentHeight && this.y < bridgeHeight) {
			//different forced height for different bridge versions
			if (loadingBridge.bridgeArr[Math.floor(this.x / bridgeSegmentWidth)] == 1) {
				this.y = bridgeHeight - this.r;
			} else if (loadingBridge.bridgeArr[Math.floor(this.x / bridgeSegmentWidth)] == 0.5) {
				this.y = (bridgeHeight + (bridgeSegmentHeight * 0.5)) - this.r ;
			}
			this.dy = 0;
			this.canJump = true;
		}
	}

	buildBridge() {
		//only build bridge if above water
		if (this.y < waterHeight) {
			var humanTile = Math.floor(human.x / bridgeSegmentWidth);
			//center
			if (loadingBridge.bridgeArr[humanTile] == 0) {
				loadingBridge.bridgeArr[humanTile] = 1;
			}

			//left
			else if (loadingBridge.bridgeArr[humanTile-1] == 0) {
				loadingBridge.bridgeArr[humanTile-1] = 1;
			}

			//right
			else if (loadingBridge.bridgeArr[humanTile+1] == 0) {
				loadingBridge.bridgeArr[humanTile+1] = 1;
			}

			//left2
			else if (loadingBridge.bridgeArr[humanTile-2] == 0) {
				loadingBridge.bridgeArr[humanTile-2] = 1;
			}

			//right2
			else if (loadingBridge.bridgeArr[humanTile+2] == 0) {
				loadingBridge.bridgeArr[humanTile+2] = 1;
			}
		}
	}
}

class Wave {
	constructor(startIndex, startHeight0to1, spread, movement) {
		this.x = startIndex;
		this.height = startHeight0to1;
		this.size = spread;
		this.d = movement;

		//bounding height
		if (this.height < 0) {
			this.height = 0;
		}
		if (this.height > 1) {
			this.height = 1;
		}
	}

	tick() {
		//update movement
		this.x += this.d;

		//place self on water array based on characteristics
		//determining characteristics
		var startInd = Math.ceil(this.x - this.size);
		var endInd = Math.ceil(this.x + this.size);
		var tile = startInd;

		//only update the indeces within the size portion, otherwise cosine wave shennanigans occur
		while (tile < endInd) {
			//equation for calculating how high water should be, sorry about the less than ideal explanation.
			//Just know it's a cosine wave cut off after the first wave, with some adjustments to fit the format of the water array.
			loadingWater[tile] += ((Math.cos(((tile - this.x) * Math.PI) / this.size) / 2) + 0.5) * this.height;
			tile += 1;
		}
		//every time ticked, height decreases a bit
		this.height *= 0.99;
		//if height is lower, decrease more
		if (this.height < 0.05) {
			this.height *= 0.9;
		}
	}
}

class Machine {
	constructor() {
		this.x = bridgeSegmentWidth;
		this.y = bridgeHeight;
		this.r = radius_machine;
		this.age = 0;
		this.checkDistance = 12;
		this.throwDistance = 7;
		this.moveDistance = 5;
		this.targetX = bridgeSegmentWidth;
	}

	tick() {
		//create debris
		if (!loadingBridge.completed && pTime % 100 == 50) {
			this.createDebris();
		}

		//move
		this.move();

		//age
		this.age += 1;
	}

	beDrawn() {
		ctx.fillStyle = color_machine;
		var p1 = adjustForCamera([this.x - this.r, this.y - this.r]);
		ctx.fillRect(p1[0], p1[1], this.r * 2, this.r * 2);
	}

	createDebris() {
		//randomly select the position where the debris should land, from +bridgeSegmentWidth to almost the edge of the screen
		var landPos = (Math.random() * (bridgeSegmentWidth * (this.throwDistance - 2))) + bridgeSegmentWidth * 2;
		landPos += this.x;

		//get velocity needed to land debris in that spot
		var debrisVel = this.calculateVelocity([landPos, waterHeight], [this.x, this.y], canvas.height * 0.8);

		//push debris to the debris array
		loadingBridge.debris.push(new Debris(this.x, this.y, debrisVel[0], debrisVel[1]));

	}

	move() {
		//if no target position is set, 
		if (this.targetX == this.x) {
			//decide whether to move
			var problem = false;
			var selfTile = Math.floor(this.x / bridgeSegmentWidth);
			for (var g=0;g<this.checkDistance;g++) {
				if (loadingBridge.bridgeArr[selfTile + g] == 0) {
					problem = true;
				}
			}

			//set a target position
			if (problem == false) {
				this.targetX = this.x + (bridgeSegmentWidth * this.moveDistance);
			}
		} else {
			//move closer to the target position
			var difference = this.targetX - this.x;
			difference *= 0.05;
			this.x += difference;
			//if the difference is small enough, just move there
			if (Math.abs(this.targetX - this.x) < 1) {
				this.x = this.targetX;
			}

			//if the machine is offscreen, exit the gameplay
			if (this.x > loadingBridge.bridgeArr.length * (bridgeSegmentWidth + 4)) {
				switchToMapState();
			}
		}
	}

	calculateVelocity(landingSpot, startingSpot, peakHeight) {
		//based on gravity and peak height (where gravity has cancelled out initial velocity) get initial dy

		//by the way, here's how I got dy
		/*
		the parabola describing time and height is gx^2 + vx + o, with g being gravity, v being initial velocity, and o being offset.
		We know what the peak height, the gravity, and the offset should be, and peak height is obtained with the equation -v / 2g, so we can replace 
		every instance of x with -v / 2g, since we want the equation to represent velocity that will get us to the highest point.
		The equation is now y = g(-v / 2g)(-v / 2g) + v(-v / 2g) + o, which simplifies to (-v^2g / 4g^2) + (v^2 / -2g) + o.
		We can now rewrite this in terms of v to get..
		
		v = sqrt(4go - 4gy) where g is gravity, o is offset, and y is the target height. (gravity is always 0.5)

		So yay! That's how to get the y velocity for the target height!
		*/
		var grav = debrisGravity / -2;
		var initDy = Math.sqrt(4 * grav * (landingSpot[1] - startingSpot[1]) - 4 * grav * peakHeight);

		//getting the position of the intercept is easy, just use the quadratic equation
		var interceptTime = (-1 * initDy - Math.sqrt((initDy * initDy) - (4 * grav * (landingSpot[1] - startingSpot[1])))) / (2 * grav);
		
		//divide total distance covered by total time to get velocity per tick
		var totalDist = landingSpot[0] - startingSpot[0];
		var initDx = totalDist / interceptTime;
		//flip dy to account for screen coordinates
		initDy *= -1;

		//return solution
		return [initDx, initDy];
	}

	doesPlayerCollide(addedDx, addedDy) {
		var hPos = [human.x + addedDx, human.y + addedDy];
		//determines if the player (with some added velocity) is inside the machines bounding box
		var boundingBox = this.r + human.r;

		//if the human's position is inside the bounding box, return true
		if ((hPos[0] < this.x + boundingBox) && (hPos[0] > this.x - boundingBox) && (hPos[1] < this.y + boundingBox) && (hPos[1] > this.y - boundingBox)) {
			return true;
		} else {
			return false;
		}
	}
}

class Debris {
	constructor(x, y, dx, dy) {
		this.x = x;
		this.y = y;
		this.r = 10;
		this.a = Math.random() * Math.PI * 2;
		this.aSpeed = Math.random() - 0.5;
		this.dx = dx;
		this.dy = dy;
		this.gravity = debrisGravity;
		this.inWater = false;
		this.weak = false;
	}

	tick() {
		//changing velocity
		this.dy += this.gravity;

		//changing position
		this.x += this.dx;
		this.y += this.dy;

		//colliding with bridge
		this.destroyBridge();

		//colliding with edge of world
		if (this.x > loadingBridge.bridgeArr.length * bridgeSegmentWidth) {
			//destroy self
			this.inWater = true;
			this.y = canvas.height * 147;
		}

		//colliding with water
		if (!this.inWater && this.y > waterHeight) {
			//physics changes
			this.inWater = true;
			this.dy /= 2;
			this.dx *= 1.1;
			this.gravity /= 2;

			//wave creation
			if (this.weak) {
				waveArray.push(new Wave(this.x / waterSegmentWidth, waveHeightSmall, 3, wavePropogationRate));
				waveArray.push(new Wave(this.x / waterSegmentWidth, waveHeightSmall, 3, -1 * wavePropogationRate));
				this.aSpeed *= 0.8;
			} else {
				waveArray.push(new Wave(this.x / waterSegmentWidth, waveHeightMedium, 3, wavePropogationRate));
				waveArray.push(new Wave(this.x / waterSegmentWidth, waveHeightMedium, 3, -1 * wavePropogationRate));
				this.aSpeed *= 0.8;
			}
		}

		//change rotation
		this.a += this.aSpeed;
	}

	beDrawn() {
		var drawPos = adjustForCamera([this.x, this.y]);
		ctx.beginPath();
		ctx.fillStyle = color_debris;
		ctx.ellipse(drawPos[0], drawPos[1], this.r * 0.5, this.r * 1.5, this.a, 0, Math.PI * 2);
		ctx.fill();
	}

	destroyBridge() {
		//check for the correct y range
		if (this.y + this.r > bridgeHeight && this.y - this.r < bridgeHeight + bridgeSegmentHeight) {
			//check for tile self is in
			var selfTile = Math.floor(this.x / bridgeSegmentWidth);
			//if it's there, lower its strength
			if (loadingBridge.bridgeArr[selfTile] > 0) {
				loadingBridge.bridgeArr[selfTile] -= 0.5;

				//make self weaker
				if (!this.weak) {
					this.weak = true;
					this.r /= 2;
					this.aSpeed /= 2;
					this.dy = -10 * this.gravity;
				} else {
					//just destroy self if already weak
					this.inWater = true;
					this.y = canvas.height * 147;
				}
			}
		}
	}
}
