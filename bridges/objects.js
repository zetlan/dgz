

class Island {
	constructor (points) {
		this.p = round2dArray(points);
	}
	
	beDrawn() {
		//drawing polygon with camera offset built in
		ctx.beginPath();
		ctx.fillStyle = color_ground;
		ctx.strokeStyle = color_beach;  
		var dStart = adjustForCamera(this.p[0]);
		ctx.moveTo(dStart[0], dStart[1]);
		for(var a = 1; a < this.p.length + 2; a++) {
			var dPoint = adjustForCamera(this.p[a%(this.p.length)]);
			ctx.lineTo(dPoint[0], dPoint[1]);
		}
		ctx.fill();
		ctx.stroke();
	}

	tick() {

		
	}

	giveEnglishConstructor() {
		var pText = JSON.stringify(this.p);
		return `new Island(${pText})`;
	}
}
	


class Bridge {
	constructor (points, startLength) {
		this.p = round2dArray(points);
		this.bridgeLength = Math.floor(getDistBetween(points[0][0], points[0][1], points[1][0], points[1][1]));
		this.startLength = startLength;
		this.bridgeArr = [];
		this.tolerance = 10;
		this.constructBridge();
	}

	constructBridge() {
		//starting with the starting segments
		for (var r=0;r<this.startLength;r++) {
			this.bridgeArr.push(1);
		}

		//segments to be built
		for (var s=0;s<this.bridgeLength - this.startLength;s++) {
			this.bridgeArr.push(0);
		}
	}

	beDrawn() {
		//terms for readability
		var [x1, y1] = adjustForCamera(this.p[0]);
		var [x2, y2] = adjustForCamera(this.p[1]);

		//main bridge path
		ctx.strokeStyle = color_bridge;
		dLine([x1, y1], [x2, y2]);

		//start blob
		ctx.fillStyle = color_bridgeStart;
		dPoint(x1, y1, 5);
		ctx.fill();

		//end blob
		ctx.fillStyle = color_bridgeEnd;
		dPoint(x2, y2, 5);
		ctx.fill();
	}

	tick() {
		//if the player is near the start of the bridge, move them to the end and go into bridge mode
		if (Math.abs(human.x - this.p[0][0]) < this.tolerance && Math.abs(human.y - this.p[0][1]) < this.tolerance) {
			[human.x, human.y] = this.p[1];
			human.confirmHome();
			loadingBridge = this.bridgeArr;
			switchToGameplayState();
		}
	}

	giveEnglishConstructor() {
		var pText = JSON.stringify(this.p);
		var sText = this.startLength;
		return `new Bridge(${pText}, ${sText})`;
	}
}

class MenuPlayer {
	constructor (x, y) {
		this.ax = 0;
		this.ay = 0;
		this.dx = 0;
		this.dy = 0;
		this.dc = 0;
		this.x = x;
		this.y = y;

		this.r = 7;

		this.fric = 0.85;
		this.mFric = 0.92;

		this.aSpeed = 0.2;
		this.cSpeed = 0.05;
		this.home = -1;
		this.confirmHome();
	}


	tick() {
		//updating camera scroll
		this.updateCameraScroll();

		//updating velocity
		this.updateXVelocity();
		this.updateYVelocity();

		//if not in a home, try to be in a home
		if (this.home == -1) {
			this.confirmHome();
		}

		//updating position
		this.move();
		
	}

	beDrawn() {
		ctx.fillStyle = color_player;
		var dSpot = adjustForCamera([this.x, this.y]);
		dPoint(dSpot[0], dSpot[1], this.r);
		ctx.fill();
	}

	confirmHome() {
		this.home = -1;
		//loop through all islands and find which one player is inside
		for (var u=0;u<loadingMap.length;u++) {
			//only check if it’s an island
			if (loadingMap[u].constructor.name == "Island") {
				if (inPoly([this.x, this.y], loadingMap[u].p)) {
					this.home = u;
					u = loadingMap.length + 1;
				}
			}
		}
	}

	updateCameraScroll() {
		//only attempt an update if the camera is moving in the first place
		if (this.dc != 0) {
			//if the change will still be within the maximum / minimum values, update the camera scroll
			if (camera.scale * (1 + this.dc) < camera.scrollValues.max && camera.scale * (1 + this.dc) > camera.scrollValues.min) {
				camera.scale *= (1 + this.dc);
				//recenter camera
				camera.xOffset = human.x - ((canvas.width / 2) / camera.scale);
				camera.yOffset = human.y - ((canvas.height / 2) / camera.scale);
			}
		}
	}

	updateXVelocity() {
		//player input
		this.dx += this.ax;
		
		//friction, changes depending on if moving or not
		if (Math.abs(this.ax) > 0) {
			this.dx *= this.mFric;
		} else {
			this.dx *= this.fric;
		}
	}

	updateYVelocity() {
		//player input
		this.dy += this.ay;
		
		//friction, changes depending on if moving or not
		if (Math.abs(this.ay) > 0) {
			this.dy *= this.mFric;
		} else {
			this.dy *= this.fric;
		}
	}

	move() {
		//if the player has a home, make sure the movement happens inside that
		if (this.home != -1)  {
			//actual movement
			//getting 5 copies of the xy movement; offset by -90, -45, 0, 45, and 90 degrees
			//the further out left/right the movement is, the more it is reduced
			var mVec = [this.dx, this.dy];
			var r = Math.PI / 4;
			var mVecLL = rotate(this.dx * 0.3, this.dy * 0.3, Math.PI / 1.8);
			var mVecL = rotate(this.dx * 0.75, this.dy * 0.75, Math.PI / 4);
			var mVecR = rotate(this.dx * 0.75, this.dy * 0.75, Math.PI / -4);
			var mVecRR = rotate(this.dx * 0.3, this.dy * 0.3, Math.PI / -1.8);

			//first check the center one
			if (inPoly([this.x + mVec[0], this.y + mVec[1]], loadingMap[this.home].p)) {
				this.x += mVec[0];
				this.y += mVec[1];
				//if that doesn't work, check the left and right vectors
			} else if (inPoly([this.x + mVecR[0], this.y + mVecR[1]], loadingMap[this.home].p)) {
				this.x += mVecR[0];
				this.y += mVecR[1];
			} else if (inPoly([this.x + mVecL[0], this.y + mVecL[1]], loadingMap[this.home].p)) {
				this.x += mVecL[0];
				this.y += mVecL[1];
			//if those don't work, check the far left/right vectors
			} else if (inPoly([this.x + mVecRR[0], this.y + mVecRR[1]], loadingMap[this.home].p)) {
				this.x += mVecRR[0];
				this.y += mVecRR[1];
			} else if (inPoly([this.x + mVecLL[0], this.y + mVecLL[1]], loadingMap[this.home].p)) {
				this.x += mVecLL[0];
				this.y += mVecLL[1];
				//if those don't work, check the far left/right vectors
			}
		} else {
			//if off an island, just let movement happen
			this.x += this.dx;
			this.y += this.dy;
		}
	}
}


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

		//counteract gravity if on a bridge segment x wise, having a dy that will take you below the bridge, and being the bridge segment y wise
		if (loadingBridge[Math.floor(this.x / bridgeSegmentWidth)] > 0 && this.y + this.dy > bridgeHeight - bridgeSegmentHeight && this.y < bridgeHeight) {
			this.dy = 0;
			this.canJump = true;
		}
	}

	move() {
		if (this.x + this.dx > 0) {
			this.x += this.dx;
		}
		this.y += this.dy;
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

	buildBridge() {
		//only build bridge if above water
		if (this.y < waterHeight) {
			var humanTile = Math.floor(human.x / bridgeSegmentWidth);
			//center
			if (!loadingBridge[humanTile]) {
				loadingBridge[humanTile] = 1;
			}

			//left
			else if (!loadingBridge[humanTile-1]) {
				loadingBridge[humanTile-1] = 1;
			}

			//right
			else if (!loadingBridge[humanTile+1]) {
				loadingBridge[humanTile+1] = 1;
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
		this.r = machineRadius;
		this.age = 0;
		this.targetX = bridgeSegmentWidth;
	}

	tick() {
		//collide with player
		this.collideWithPlayer();

		//create debris
		if (pTime % 100 == 50) {
			this.createDebris();
		}

		//move

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
		var landPos = (Math.random() * (canvas.width - bridgeSegmentWidth * 3)) + bridgeSegmentWidth * 2;
		landPos += this.x;

		//get velocity needed to land debris in that spot
		var debrisVel = this.calculateVelocity([landPos, waterHeight], [this.x, this.y], canvas.height * 0.8);

		//push debris to the debris array
		debrisArray.push(new Debris(this.x, this.y, debrisVel[0], debrisVel[1]));

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

	collideWithPlayer() {
		//sideways
		if (human.x > this.x && human.x - human.r <= this.x + this.r && human.y > this.y - this.r) {
			human.dx = 0.5;
		}

		//upways
		if (human.x > this.x - this.r && human.x < this.x + this.r && human.y < this.y && human.y + human.r > this.y - this.r * 1.05) {
			human.dy = -1 * human.gravity;
			//force player to be above the machine

			human.canJump = true;
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
			} else {
				waveArray.push(new Wave(this.x / waterSegmentWidth, waveHeightMedium, 3, wavePropogationRate));
				waveArray.push(new Wave(this.x / waterSegmentWidth, waveHeightMedium, 3, -1 * wavePropogationRate));
			}

		}
	}

	beDrawn() {
		var drawPos = adjustForCamera([this.x, this.y]);
		ctx.fillStyle = color_debris;
		ctx.fillRect(drawPos[0], drawPos[1], this.r, this.r);
	}

	destroyBridge() {
		//check for the correct y range
		if (this.y + this.r > bridgeHeight && this.y - this.r < bridgeHeight + bridgeSegmentHeight) {
			//check for tile self is in
			var selfTile = Math.floor(this.x / bridgeSegmentWidth);
			//if it's there, lower its strength
			if (loadingBridge[selfTile] > 0) {
				loadingBridge[selfTile] -= 0.5;

				//make self weaker
				if (!this.weak) {
					this.weak = true;
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
