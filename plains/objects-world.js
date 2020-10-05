class FreePoly {
	constructor(points, color) {
		this.x;
		this.y;
		this.z;
		this.points = points;
		this.normal;
		this.color = color;

		//collision tolerance
		this.tolerance = player.dMax * 2;
		//trimming identical points from the list
		this.trimPoints();
		this.calculateNormal();

		this.collisionPoints = this.calculateCollision();
		this.minPlayerDist = this.calculateMaxPointDist();
	}

	trimPoints() {
		//trimming identicalish points
		var lastPoint = [undefined, undefined, undefined];
		for (var j=0;j<this.points.length;j++) {
			//if the two points are the same, remove the latter one
			if (Math.abs(lastPoint[0] - this.points[j][0]) < render_identicalPointTolerance && Math.abs(lastPoint[1] - this.points[j][1]) < render_identicalPointTolerance && Math.abs(lastPoint[2] - this.points[j][2]) < render_identicalPointTolerance) {
				this.points.splice(j, 1);
				j -= 1;
			}
			lastPoint = this.points[j];
		}
	}

	calculateCollision() {
		var temp = [];
		//looping through all points
		for (var u=0;u<this.points.length;u++) {
			//transform point to self's normal
			var transformed = spaceToRelative(this.points[u], [this.x, this.y, this.z], this.normal);

			//zs are going to be zero, so they can be ignored
			temp.push([transformed[0], transformed[1]]);
		}
		return temp;
	}

	calculateMaxPointDist() {

	}

	calculateNormal() {
		//first get average point, that's self's xyz
		[this.x, this.y, this.z] = avgArray(this.points);

		//get cross product of first two points, that's the normal
		var v1 = [this.points[0][0] - this.x, this.points[0][1] - this.y, this.points[0][2] - this.z];
		var v2 = [this.points[1][0] - this.x, this.points[1][1] - this.y, this.points[1][2] - this.z];

		
		var cross = [(v1[1] * v2[2]) - (v1[2] * v2[1]), (v1[2] * v2[0]) - (v1[1] * v2[2]), (v1[0] * v2[1]) - (v1[1] * v2[0])];
		console.log(this.color, cross);
		cross = cartToPol(cross[0], cross[1], cross[2]);

		console.log(this.color, cross);

		//checking for alignment with camera
		if (spaceToRelative([player.x, player.y, player.z], [this.x, this.y, this.z], [cross[0], cross[1]])[2] < 0) {
			cross[0] = (Math.PI * 2) - cross[0];
			cross[1] *= -1;
		}
		this.normal = [cross[0], cross[1]];
	}

	collideWithPlayer() {
		//transform player to self's coordinates
		var playerCoords = spaceToRelative([player.x, player.y - player.height, player.z], [this.x, this.y, this.z], this.normal);


		//if the player is too close, take them seriously
		if (Math.abs(playerCoords[2]) < this.tolerance) {
			if (inPoly([playerCoords[0], playerCoords[1]], this.collisionPoints)) {
				
				//different behavior depending on side
				if (playerCoords[2] < 0) {
					playerCoords[2] = -1 * this.tolerance;
				} else {
					playerCoords[2] = this.tolerance;

				}

				//transforming back to regular coordinates
				playerCoords = relativeToSpace(playerCoords, [this.x, this.y, this.z], this.normal);
				playerCoords[1] += player.height;
				[player.x, player.y, player.z] = playerCoords;

				//if self counts as a floor / ceiling tile, work on player's y velocity
				if (Math.abs(this.normal[1]) > Math.PI / 4) {
					
					//reduce player's y acceleration 
					if (player.dy < 0) {
						player.dy = -0.01;
						player.onGround = true;
					}
				}
			}
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
			tempPoints.push(spaceToRelative(this.points[j], planePoint, planeNormal));
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
				tempPoints[q] = relativeToSpace(tempPoints[q], planePoint, planeNormal);
			}

			outPoints = this.clipToZ0(outPoints, 0, true);
			for (var q=0;q<outPoints.length;q++) {
				outPoints[q] = relativeToSpace(outPoints[q], planePoint, planeNormal);
			}

			//turning point array into objects that can be put into nodes
			inPart = new FreePoly(tempPoints, this.color);
			console.log(inPart.normal);
			outPart = new FreePoly(outPoints, this.color);
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

	tick() {
		//collide correctly with player
		this.collideWithPlayer();
	}

	beDrawn() {
		//first get camera coordinate points
		var camAng = [player.theta, player.phi];
		var pt = [player.x, player.y, player.z];
		var tempPoints = [];
		for (var p=0;p<this.points.length;p++) {
			tempPoints.push(spaceToRelative(this.points[p], pt, camAng));
		}

		tempPoints = this.clipToZ0(tempPoints, render_clipDistance, false);
		
		//turn points into screen coordinates
		var screenPoints = [];
		for (var a=0;a<tempPoints.length;a++) {
			screenPoints.push(cameraToScreen(tempPoints[a]));
		}

		if (screenPoints.length > 0) {
			//finally draw self
			drawPoly(this.color, screenPoints);
			
			if (editor_active && !isClipped([[this.x, this.y, this.z]])) {
				//draw self's normal as well
				var dXY = spaceToScreen([this.x, this.y, this.z]);
				var cXYZ = polToCart(this.normal[0], this.normal[1], 5);
				var eXY = spaceToScreen([this.x + cXYZ[0], this.y + cXYZ[1], this.z + cXYZ[2]]);
				ctx.beginPath();
				ctx.strokeStyle = "#FFF";
				ctx.moveTo(dXY[0], dXY[1]);
				ctx.lineTo(eXY[0], eXY[1]);
			}
		}
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