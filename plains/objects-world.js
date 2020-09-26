class Floor {
	constructor(x, y, z, l, w, color) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.len = l;
		this.wdt = w;
		this.collisionHeight = 20;
		
		this.color = color;
		this.pDist = 10;

		this.points;
		this.normal;
		this.calculatePointsAndNormal();

		this.drawCoords = [];
	}

	tick() {
		//collide correctly with player
		this.collideWithPlayer();

		//get distance to player
		this.getPDist();
	}

	beDrawn() {
		//first get camera coordinate points
		var camAng = [player.theta, player.phi];
		var tempPoints = [this.spaceToRelative(this.points[0], camAng), this.spaceToRelative(this.points[1], camAng), this.spaceToRelative(this.points[2], camAng), this.spaceToRelative(this.points[3], camAng)];

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

		if (screenPoints.length > 0) {
			//finally draw self
			drawPoly(this.color, screenPoints);
			
			if (editor_active) {
				//draw self's normal as well
				ctx.strokeStyle = "#FFF";
				ctx.beginPath();
				
				var dXY = spaceToScreen([this.x, this.y, this.z]);
				var cXYZ = polToCart(this.normal[0], this.normal[1], 5);
				var eXY = spaceToScreen([this.x + cXYZ[0], this.y + cXYZ[1], this.z + cXYZ[2]]);
				ctx.moveTo(dXY[0], dXY[1]);
				ctx.lineTo(eXY[0], eXY[1]);
			}
		}
	}

	calculatePointsAndNormal() {
		this.points = [	[this.x + this.len, this.y, this.z - this.wdt],
						[this.x + this.len, this.y, this.z + this.wdt],
						[this.x - this.len, this.y, this.z + this.wdt],
						[this.x - this.len, this.y, this.z - this.wdt]];
		if (player.y > this.y) {
			this.normal = [0, Math.PI / 2];
		} else {
			this.normal = [0, Math.PI / -2];
		}
		
	}
	//clips self and returns an array with two polygons, clipped at the input plane.
	//always returns [polygon inside plane, polgyon outside plane]
	//if self polygon does not intersect the plane, then one of the two return values will be undefined.

	//TODO: clean up code, actual clip code is just duplicated and could be abstracted out to a different function
	clipAtPlane(planePoint, planeNormal) {
		var inPart = undefined;
		var outPart = undefined;

		//getting points aligned to the plane
		var tempPoints;
		for (var j=0;j<this.points.length;j++) {
			//aligning to point
			var [tX, tY, tZ] = [this.points[j][0] - planePoint[0], this.points[j][1] - planePoint[1], this.points[j][2] - planePoint[2]];

			//aligning to normal
			[tX, tZ] = rotate(tX, tZ, planeNormal[0]);
			[tY, tZ] = rotate(tY, tZ, planeNormal[1]);

			//pushing to tempPoints array
			tempPoints.push([tX, tY, tZ]);
		}

		//checking to see if clipping is necessary
		var sign = tempPoints[0][2] > 0;
		var clip = false;
		for (var y=1;y<tempPoints.length;y++) {
			//if the signs of the points match, don't clip them. However, if any polarity of a point is different from the first one, clip the polygon
			if (!sign == tempPoints[y][2] > 0) {
				clip = true;
				y = tempPoints.length;
			}
		}
		if (clip) {
			//get copy of self
			var outPoints = [];
			for (var a=0;a<tempPoints.length;a++) {
				outPoints[a] = tempPoints[a];
			}
			//loop through all points
			for (var y=0;y<tempPoints.length;y++) {
				//if the selected point will be clipped, run the algorithm
				if (tempPoints[y][2] <= 0) {
					//freefriends is the number of adjacent non-clipped points
					var freeFriends = (tempPoints[(y+(tempPoints.length-1))%tempPoints.length][2] >= 0.05) + (tempPoints[(y+1)%tempPoints.length][2] >= 0.05);

					if (freeFriends == 0) {
						//if there are no free friends, there's no point in attempting, so just move on
						tempPoints.splice(y, 1);
						y -= 1;
					} else {
						//move towards friends
						var friendCoords = tempPoints[(y+(tempPoints.length-1))%tempPoints.length];
						var moveAmount = getPercentage(friendCoords[2], tempPoints[y][2], 0.05);
						var newPointCoords = [linterp(friendCoords[0], tempPoints[y][0], moveAmount), linterp(friendCoords[1], tempPoints[y][1], moveAmount), 0.05];

						tempPoints.splice(y, 0, newPointCoords);

						y += 1;

						friendCoords = tempPoints[(y+1)%tempPoints.length];
						moveAmount = getPercentage(friendCoords[2], tempPoints[y][2], 0.05);
						newPointCoords = [linterp(friendCoords[0], tempPoints[y][0], moveAmount), linterp(friendCoords[1], tempPoints[y][1], moveAmount), 0.05];
						tempPoints.splice(y, 1);
						tempPoints.splice(y, 0, newPointCoords);
					}
				}
			}

			//clip part 2
			for (var y=0;y<outPoints.length;y++) {
				//if the selected point will be clipped, run the algorithm
				if (outPoints[y][2] <= 0) {
					//freefriends is the number of adjacent non-clipped points
					var freeFriends = (outPoints[(y+(outPoints.length-1))%outPoints.length][2] >= 0.05) + (outPoints[(y+1)%outPoints.length][2] >= 0.05);

					if (freeFriends == 0) {
						//if there are no free friends, there's no point in attempting, so just move on
						outPoints.splice(y, 1);
						y -= 1;
					} else {
						//move towards friends
						var friendCoords = outPoints[(y+(outPoints.length-1))%outPoints.length];
						var moveAmount = getPercentage(friendCoords[2], outPoints[y][2], 0.05);
						var newPointCoords = [linterp(friendCoords[0], outPoints[y][0], moveAmount), linterp(friendCoords[1], outPoints[y][1], moveAmount), 0.05];

						outPoints.splice(y, 0, newPointCoords);

						y += 1;

						friendCoords = outPoints[(y+1)%outPoints.length];
						moveAmount = getPercentage(friendCoords[2], outPoints[y][2], 0.05);
						newPointCoords = [linterp(friendCoords[0], outPoints[y][0], moveAmount), linterp(friendCoords[1], outPoints[y][1], moveAmount), 0.05];
						outPoints.splice(y, 1);
						outPoints.splice(y, 0, newPointCoords);
					}
				}
			}

			//turning point array into objects that can be put into nodes
			var outBit = new FreePoly(points, this.normal);
		} else {
			//if clipping is not necessary, then just return self
			if (tempPoints[0][2] > 0) {
				inPart = this;
			} else {
				outPart = this;
			}
		}
		

		return [inPart, outPart];
	}

	collideWithPlayer() {
		this.tolerance = Math.abs(player.dy) + 3;
		//if the player is in the same xz spot as self
		if (player.x > this.x - this.len && player.x < this.x + this.len && player.z > this.z - this.wdt && player.z < this.z + this.wdt) {
			//if player is in the y zone
			if (player.y - player.height > this.y - this.tolerance && player.y - player.height < this.y + this.tolerance) {
				//if player collision point is lower than self
				if (player.y - player.height <= this.y) {
					//if player camera is above self
					if (player.y > this.y) {
						if (player.dy < 0) {
							player.y = this.y + player.height;
							player.dy = -0.01;
							player.onGround = true;
						}
					} else {
						player.dy = -0.5;
						player.y = this.y - this.tolerance;
					}
				}
			}
		}
	}

	//these two functions do the same thing as spaceToScreen, but split so the clipping plane can be implemented

	//turns world coordinates into 3d camera coordinates, for clipping
	spaceToRelative(point, thetaPhiAngle) {
		var [tX, tY, tZ] = point;

		tX -= player.x;
		tY -= player.y;
		tZ -= player.z;

		[tX, tZ] = rotate(tX, tZ, thetaPhiAngle[0]);
		[tY, tZ] = rotate(tY, tZ, thetaPhiAngle[1]);

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

	//converts from coordinates relative to an angle into world coordinates
	relativeToSpace(point) {

	}

	getPDist() {
		
		var dTP = [this.x - player.x, this.y - player.y, this.z - player.z];
		this.pDist = Math.sqrt((dTP[0] * dTP[0]) + (dTP[1] * dTP[1]) + (dTP[2] * dTP[2]));
		/*
		this.pDist = this.spaceToCamera([this.x, this.y, this.z]);
		this.pDist = Math.abs(this.pDist[2]);  */
	}
}



class FreePoly extends Floor {
	constructor(points, normal, color) {
		super(points[0][0], points[0][1], points[0][2], 1, 1, color);
	}

	calculatePointsAndNormal() {

	}
}

class Star {
	constructor(x, y, z) {
		this.color = "#AAF";
		this.r = 10000;
		this.drawR;
		
		this.dx = 0;
		this.dy = 0;
		this.dz = 0;

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

class WallX extends Floor {
	constructor(x, y, z, l, h, color) {
		super(x, y, z, l, h, color);
		this.tolerance = player.dMax * 2;
	}

	calculatePointsAndNormal() {
		this.points = [	[this.x, this.y + this.wdt, this.z - this.len],
						[this.x, this.y + this.wdt, this.z + this.len],
						[this.x, this.y - this.wdt, this.z + this.len],
						[this.x, this.y - this.wdt, this.z - this.len]];
		if (player.x < this.x) {
			this.normal = [Math.PI / 2, 0];
		} else {
			this.normal = [Math.PI * 1.5, 0];
		}
	}

	collideWithPlayer() {
		//if they're in the same xyz spot, change their x
		if (player.z > this.z - this.len && player.z < this.z + this.len && player.y > this.y - this.wdt && player.y < this.y + this.wdt) {
			if (player.x > this.x - this.tolerance && player.x < this.x + this.tolerance) {
				if (player.x < this.x) {
					player.x = this.x - this.tolerance;
				} else {
					player.x = this.x + this.tolerance;
				}
			}
		}
	}
}

class WallZ extends Floor {
	constructor(x, y, z, l, h, color) {
		super(x, y, z, l, h, color);
		this.tolerance = player.dMax * 2;
	}

	calculatePointsAndNormal() {
		this.points = [	[this.x - this.len, this.y + this.wdt, this.z],
						[this.x + this.len, this.y + this.wdt, this.z],
						[this.x + this.len, this.y - this.wdt, this.z],
						[this.x - this.len, this.y - this.wdt, this.z]];
		
		if (player.z < this.z) {
			this.normal = [Math.PI, 0];
		} else {
			this.normal = [0, 0];
		}
	}

	collideWithPlayer() {
		//if they're in the same xyz spot, change their z
		if (player.x > this.x - this.len && player.x < this.x + this.len && player.y > this.y - this.wdt && player.y < this.y + this.wdt) {
			if (player.z > this.z - this.tolerance && player.z < this.z + this.tolerance) {
				if (player.z < this.z) {
					player.z = this.z - this.tolerance;
				} else {
					player.z = this.z + this.tolerance;
				}
			}
		}
	}
}

class WallRotable extends Floor{

}