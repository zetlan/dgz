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
		var pt = [player.x, player.y, player.z];
		var tempPoints = [];
		for (var p=0;p<this.points.length;p++) {
			tempPoints.push(this.spaceToRelative(this.points[p], pt, camAng));
		}

		tempPoints = this.clipToZ0(tempPoints, render_clipDistance, false);
		
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
	clipAtPlane(planePoint, planeNormal) {
		var inPart = undefined;
		var outPart = undefined;

		//getting points aligned to the plane
		var tempPoints = [];
		for (var j=0;j<this.points.length;j++) {
			tempPoints.push(this.spaceToRelative(this.points[j], planePoint, planeNormal));
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

			//clip
			tempPoints = this.clipToZ0(tempPoints, 0, false);

			//transforming points to world coordinates
			for (var q=0;q<tempPoints.length;q++) {
				tempPoints[q] = this.relativeToSpace(tempPoints[q], planePoint, planeNormal);
			}

			outPoints = this.clipToZ0(outPoints, 0, true);
			for (var q=0;q<outPoints.length;q++) {
				outPoints[q] = this.relativeToSpace(outPoints[q], planePoint, planeNormal);
			}

			//turning point array into objects that can be put into nodes
			inPart = new FreePoly(tempPoints, this.normal, this.color);
			outPart = new FreePoly(outPoints, this.normal, this.color);
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

	clipToZ0(polyPoints, tolerance, invertClipDirection) {
		//to save time, inverting the clip direction just means inverting all the points, then inverting back
		if (invertClipDirection) {
			for (var a=0;a<polyPoints.length;a++) {
				polyPoints[a][2] *= -1;
			}
		}
		for (var y=0;y<polyPoints.length;y++) {
			//if the selected point will be clipped, run the algorithm
			if (polyPoints[y][2] < tolerance) {
				//freefriends is the number of adjacent non-clipped points
				var freeFriends;
				var freeFriends = (polyPoints[(y+(polyPoints.length-1))%polyPoints.length][2] >= tolerance) + (polyPoints[(y+1)%polyPoints.length][2] >= tolerance);
				switch (freeFriends) {
					case 0:
						//if there are no free friends, there's no point in attempting, so just move on
						polyPoints.splice(y, 1);
						y -= 1;
						break;
					case 1:
						//determine which one is free, then move towards it
						var friendCoords;
						var moveAmount;
						var newPointCoords;
						//lesser friend
						if (polyPoints[(y+(polyPoints.length-1))%polyPoints.length][2] >= tolerance) {
							friendCoords = polyPoints[(y+(polyPoints.length-1))%polyPoints.length];
							moveAmount = getPercentage(friendCoords[2], polyPoints[y][2], tolerance);
							newPointCoords = [linterp(friendCoords[0], polyPoints[y][0], moveAmount), linterp(friendCoords[1], polyPoints[y][1], moveAmount), tolerance];
						} else {
							//greater friend
							friendCoords = polyPoints[(y+1)%polyPoints.length];
							moveAmount = getPercentage(friendCoords[2], polyPoints[y][2], tolerance);
							newPointCoords = [linterp(friendCoords[0], polyPoints[y][0], moveAmount), linterp(friendCoords[1], polyPoints[y][1], moveAmount), tolerance + 0.05];
						}
						polyPoints[y] = newPointCoords;
						break;
					case 2:
						//move towards both friends
						var friendCoords = polyPoints[(y+(polyPoints.length-1))%polyPoints.length];
						var moveAmount = getPercentage(friendCoords[2], polyPoints[y][2], tolerance);
						var newPointCoords = [linterp(friendCoords[0], polyPoints[y][0], moveAmount), linterp(friendCoords[1], polyPoints[y][1], moveAmount), tolerance + 0.05];
	
						friendCoords = polyPoints[(y+1)%polyPoints.length];
						moveAmount = getPercentage(friendCoords[2], polyPoints[y][2], tolerance);
						var newerPointCoords = [linterp(friendCoords[0], polyPoints[y][0], moveAmount), linterp(friendCoords[1], polyPoints[y][1], moveAmount), tolerance + 0.05];

						polyPoints[y] = newerPointCoords;
						polyPoints.splice(y, 0, newPointCoords);
						break;
				}
			}
		}
		if (invertClipDirection) {
			for (var a=0;a<polyPoints.length;a++) {
				polyPoints[a][2] *= -1;
			}
		}
		return polyPoints;
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
	spaceToRelative(pointToChange, point, normal) {
		var [tX, tY, tZ] = pointToChange;

		tX -= point[0];
		tY -= point[1];
		tZ -= point[2];

		[tX, tZ] = rotate(tX, tZ, normal[0]);
		[tY, tZ] = rotate(tY, tZ, normal[1]);

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
	relativeToSpace(pointToTransform, point, normal) {
		var [tX, tY, tZ] = pointToTransform;
		var invNorm = [(Math.PI * 2) - normal[0], normal[1] * -1];

		[tY, tZ] = rotate(tY, tZ, invNorm[1]);
		[tX, tZ] = rotate(tX, tZ, invNorm[0]);
		[tX, tY, tZ] = [tX + point[0], tY + point[1], tZ + point[2]];

		return [tX, tY, tZ];
	}

	getPDist() {
		
		var dTP = [this.x - player.x, this.y - player.y, this.z - player.z];
		this.pDist = Math.sqrt((dTP[0] * dTP[0]) + (dTP[1] * dTP[1]) + (dTP[2] * dTP[2]));
	}
}



class FreePoly extends Floor {
	constructor(points, normal, color) {
		super(points[0][0], points[0][1], points[0][2], 1, 1, color);
		this.points = points;
		this.normal = normal;
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