//houses all classes

class Player {
	constructor(x, y, z, xRot, yRot) {
		this.friction = 0.85;
		this.gravity = -0.15;

		this.height = 4.9;
		this.onGround = false;

		this.scale = 200;
		this.sens = 0.04;
		this.speed = 0.05;


		this.x = x;
		this.y = y;
		this.z = z;

		this.dx = 0;
		this.dy = 0;
		this.dz = 0;
		this.dMax = 1;
		this.fallMax = 10;

		this.ax = 0;
		this.ay = 0;
		this.az = 0;


		this.theta = yRot;
		this.phi = xRot;

		this.dt = 0;
		this.dp = 0;
	}

	tick() {
		//handling velocity

		//adding
		this.dx += this.ax;

		//binding max
		if (Math.abs(this.dx) > this.dMax) {
			this.dx *= 0.95;
		}

		//friction
		if (this.ax == 0) {
			this.dx *= this.friction;
		}

		this.dz += this.az;
		if (Math.abs(this.dz) > this.dMax) {
			this.dz *= 0.95;
		}
		if (this.az == 0) {
			this.dz *= this.friction;
		}

		//gravity
		this.dy += this.gravity;
		if (Math.abs(this.dy) > this.fallMax) {
			this.dy *= 0.95;
		}

		//handling position
		this.x += this.dz * Math.sin(this.theta);
		this.z += this.dz * Math.cos(this.theta);

		this.x += this.dx * Math.sin(this.theta + (Math.PI/2));
		this.z += this.dx * Math.cos(this.theta + (Math.PI/2));
		
		this.y += this.dy;


		//camera velocity
		this.theta += this.dt;
		this.phi += this.dp;

		//special case for vertical camera orientation
		if (Math.abs(this.phi) >= Math.PI * 0.5) {
			//if the camera angle is less than 0, set it to -1/2 pi. Otherwise, set it to 1/2 pi
			this.phi = Math.PI * (-0.5 + (this.phi > 0));
		}
	}
}

class Platform {
	constructor(x, y, z, l, w, color) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.len = l;
		this.wdt = w;
		this.collisionHeight = 20;
		
		this.color = color;

		this.points = [	[this.x + this.len, this.y, this.z - this.wdt],
						[this.x + this.len, this.y, this.z + this.wdt],
						[this.x - this.len, this.y, this.z + this.wdt],
						[this.x - this.len, this.y, this.z - this.wdt]];

		this.drawCoords = [];
	}

	tick() {
		//collide correctly with player
		//if the player is in the same xz spot as self, move player above self
		if (player.x > this.x - this.len && player.x < this.x + this.len && player.z > this.z - this.wdt && player.z < this.z + this.wdt) {
			if (player.y < this.y + player.height && player.y > this.y) {
				player.y = this.y + player.height;
				if (player.dy < 0) {
					player.dy = 0;
					player.onGround = true;
				}
			}
		}
	}

	beDrawn() {
		//first get camera coordinate points
		var tempPoints = [this.spaceToCamera(this.points[0]), this.spaceToCamera(this.points[1]), this.spaceToCamera(this.points[2]), this.spaceToCamera(this.points[3])];

		//loop through all points
		for (var y=0;y<tempPoints.length;y++) {
			//if the selected point will be clipped, run the algorithm
			if (tempPoints[y][2] < render_clipDistance) {
				//freefriends is the number of adjacent non-clipped points
				var freeFriends = (tempPoints[(y+(tempPoints.length-1))%tempPoints.length][2] >= render_clipDistance) + (tempPoints[(y+1)%tempPoints.length][2] >= render_clipDistance);

				if (freeFriends == 0) {
					//if there are no free friends, there's no point in attempting, so just move on
					tempPoints.splice(y, 1);
					y -= 1;
				} else {
					//move towards friends
					var friendCoords = tempPoints[(y+(tempPoints.length-1))%tempPoints.length];
					var moveAmount = getPercentage(friendCoords[2], tempPoints[y][2], render_clipDistance)
					var newPointCoords = [linterp(friendCoords[0], tempPoints[y][0], moveAmount), linterp(friendCoords[1], tempPoints[y][1], moveAmount), render_clipDistance + 0.05];

					tempPoints.splice(y, 0, newPointCoords);

					y += 1;

					friendCoords = tempPoints[(y+1)%tempPoints.length];
					moveAmount = getPercentage(friendCoords[2], tempPoints[y][2], render_clipDistance)
					newPointCoords = [linterp(friendCoords[0], tempPoints[y][0], moveAmount), linterp(friendCoords[1], tempPoints[y][1], moveAmount), render_clipDistance + 0.05];
					tempPoints.splice(y, 1);
					tempPoints.splice(y, 0, newPointCoords);
				}
			}
		}
		
		//turn points into screen coordinates
		var screenPoints = [];
		for (var a=0;a<tempPoints.length;a++) {
			screenPoints.push(this.cameraToScreen(tempPoints[a]));
		}

		if (screenPoints.length == 0) {
			screenPoints = [[0, 0], [0, 0]];
		}


		//finally draw self
		drawPoly(this.color, screenPoints);
	}

	//these two functions do the same thing as spaceToScreen, but split so the clipping plane can be implemented

	//turns world coordinates into 3d camera coordinates, for clipping
	spaceToCamera(point) {
		var [tX, tY, tZ] = point;

		tX -= player.x;
		tY -= player.y;
		tZ -= player.z;

		[tX, tZ] = rotate(tX, tZ, player.theta);
		[tY, tZ] = rotate(tY, tZ, player.phi);

		return [tX, tY, tZ];
	}

	//turns camera coordinates into 2d screen coordinates
	cameraToScreen(point) {
		//divide by axis perpendicular to player
		var [tX, tY, tZ] = point;
		tX /= tZ;
		tY /= tZ;

		//accounting for camera scale
		tX *= player.scale;

		//flipping image
		tY *= -1 * player.scale;

		//accounting for screen coordinates
		tX += canvas.width / 2;
		tY += canvas.height / 2;

		return [tX, tY];
	}
}

class Star {
	constructor(x, y, z) {
		this.color = "#AAF";
		this.r = 10000;
		this.drawR;

		this.x = x;
		this.y = y;
		this.z = z;
	}

	tick() {
		//getting distance to player
		var dTP = [this.x - player.x, this.y - player.y, this.z - player.z];
		var pyXYDist = Math.sqrt((dTP[0] * dTP[0]) + (dTP[1] * dTP[1]));
		var pyDist = Math.sqrt((pyXYDist * pyXYDist) + (dTP[2] * dTP[2]));

		this.drawR = this.r / pyDist;
	}

	beDrawn() {
		if (!isClipped([this.x, this.y, this.z])) {
			var drawCoords = spaceToScreen([this.x, this.y, this.z]);
			drawCircle(this.color, drawCoords[0], drawCoords[1], this.drawR);
		}
	}
}