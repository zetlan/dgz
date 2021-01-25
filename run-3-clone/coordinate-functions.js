//here are all the functions that tranform 3d coordinates
/*overview:
	cameraToScreen();
	cartToPol();
	clipToZ0();
	getDistance();
	isClipped();
	polToCart();
	relativeToSpace();
	spaceToRelative();
	spaceToScreen();
	transformPoint();
*/

//turns camera coordinates into 2d screen coordinates
function cameraToScreen(point) {
	//divide by axis perpendicular to camera
	var [tX, tY, tZ] = point;
	tX /= tZ;
	tY /= tZ;

	//accounting for camera scale
	tX *= world_camera.scale;

	//flipping image
	tY *= -1 * world_camera.scale;

	//accounting for screen coordinates
	tX += canvas.width / 2;
	tY += canvas.height / 2;

	return [tX, tY];
}

//the opposite of polToCart, takes in an xyz point and outputs a vector in the form of [theta, phi, radius]
function cartToPol(x, y, z) {
	var rad = Math.sqrt((x * x) + (y * y) + (z * z));
	var theta = Math.atan2(x, z);
	var phi = Math.atan(y / Math.sqrt((z * z) + (x * x)));
	
	return [theta, phi, rad];
}

function clipToZ0(polyPoints, tolerance, invertClipDirection) {
	//to save time, inverting the clip direction just means inverting all the points, then inverting back
	if (invertClipDirection) {
		for (var a=0;a<polyPoints.length;a++) {
			polyPoints[a][2] *= -1;
		}
	}
	//make all the polypoints have a boolean that says whether they're clipped or not, this is used for number of neighbors
	for (var x=0;x<polyPoints.length;x++) {
		//this flag answers the question "will this be clipped?"
		polyPoints[x][3] = polyPoints[x][2] < tolerance;
	}
	for (var y=0;y<polyPoints.length;y++) {
		//if the selected point will be clipped, run the algorithm
		if (polyPoints[y][3]) {
			//freefriends is the number of adjacent non-clipped points
			var freeFriends;
			var freeFriends = !polyPoints[(y+(polyPoints.length-1))%polyPoints.length][3] + !polyPoints[(y+1)%polyPoints.length][3];
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
					if (!polyPoints[(y+(polyPoints.length-1))%polyPoints.length][3]) {
						friendCoords = polyPoints[(y+(polyPoints.length-1))%polyPoints.length];
						moveAmount = getPercentage(friendCoords[2], polyPoints[y][2], tolerance);
						newPointCoords = [linterp(friendCoords[0], polyPoints[y][0], moveAmount), linterp(friendCoords[1], polyPoints[y][1], moveAmount), tolerance, true];
					} else {
						//greater friend
						friendCoords = polyPoints[(y+1)%polyPoints.length];
						moveAmount = getPercentage(friendCoords[2], polyPoints[y][2], tolerance);
						newPointCoords = [linterp(friendCoords[0], polyPoints[y][0], moveAmount), linterp(friendCoords[1], polyPoints[y][1], moveAmount), tolerance + 0.05, true];
					}
					polyPoints[y] = newPointCoords;
					break;
				case 2:
					//move towards both friends
					var friendCoords = polyPoints[(y+(polyPoints.length-1))%polyPoints.length];
					var moveAmount = getPercentage(friendCoords[2], polyPoints[y][2], tolerance);
					var newPointCoords = [linterp(friendCoords[0], polyPoints[y][0], moveAmount), linterp(friendCoords[1], polyPoints[y][1], moveAmount), tolerance + 0.05, true];

					friendCoords = polyPoints[(y+1)%polyPoints.length];
					moveAmount = getPercentage(friendCoords[2], polyPoints[y][2], tolerance);
					var newerPointCoords = [linterp(friendCoords[0], polyPoints[y][0], moveAmount), linterp(friendCoords[1], polyPoints[y][1], moveAmount), tolerance + 0.05, true];

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

function getDistance(obj1, obj2) {
	//returns the pythagorean distance between two objects
	return Math.sqrt(((obj1.x - obj2.x) * (obj1.x - obj2.x)) + ((obj1.y - obj2.y) * (obj1.y - obj2.y)) + ((obj1.z - obj2.z) * (obj1.z - obj2.z)));
}

//determines if a point will be clipped due to being behind / too close to the camera
function isClipped(pointArr) {
	var tX = pointArr[0];
	var tY = pointArr[1];
	var tZ = pointArr[2];
	tX -= world_camera.x;
	tY -= world_camera.y;
	tZ -= world_camera.z;
	[tX, tZ] = rotate(tX, tZ, world_camera.theta);
	[tY, tZ] = rotate(tY, tZ, world_camera.phi);

	return (tZ < render_clipDistance);
}

function polToCart(theta, phi, radius) {
	//theta here is horizontal angle, while phi is vertical inclination
	var x = radius * Math.sin(theta) * Math.cos(phi);
	var y = radius * Math.sin(phi);
	var z = radius * Math.cos(theta) * Math.cos(phi);
	return [x, y, z];
}

//converts from relative camera coordinates into world coordinates
function relativeToSpace(pointToTransform, point, normal) {
	var [tX, tY, tZ] = pointToTransform;
	var invNorm = [(Math.PI * 2) - normal[0], normal[1] * -1];

	[tY, tZ] = rotate(tY, tZ, invNorm[1]);
	[tX, tZ] = rotate(tX, tZ, invNorm[0]);
	[tX, tY, tZ] = [tX + point[0], tY + point[1], tZ + point[2]];

	return [tX, tY, tZ];
}

//turns world coordinates into 3d camera coordinates
function spaceToRelative(pointToChange, point, normal) {
	var [tX, tY, tZ] = pointToChange;

	tX -= point[0];
	tY -= point[1];
	tZ -= point[2];

	[tX, tZ] = rotate(tX, tZ, normal[0]);
	[tY, tZ] = rotate(tY, tZ, normal[1]);
	[tX, tY] = rotate(tX, tY, normal[2]);

	return [tX, tY, tZ];
}

function spaceToScreen(pointArr) {
	//takes in an xyz list and outputs an xy list
	var tX = pointArr[0];
	var tY = pointArr[1];
	var tZ = pointArr[2];

	//step 1: make coordinates relative to camera
	tX -= world_camera.x;
	tY -= world_camera.y;
	tZ -= world_camera.z;

	//step 2: rotate coordinates
	//around y axis
	[tX, tZ] = rotate(tX, tZ, world_camera.theta);

	//around x axis
	[tY, tZ] = rotate(tY, tZ, world_camera.phi);

	//around self
	[tX, tY] = rotate(tX, tY, world_camera.rot);

	//step 2.5: clipping if behind the camera
	if (tZ < 0.1) {
		tX = (tX * -1) / tZ;
		tY = (tY * -1) / tZ;
	} else {
		//step 3: divide by axis perpendicular to camera
		tX /= tZ;
		tY /= tZ;
	}

	//step 4: account for camera scale
	tX *= world_camera.scale;

	//flipping image
	tY *= -1 * world_camera.scale;

	//accounting for screen coordinates
	tX += canvas.width / 2;
	tY += canvas.height / 2;

	return [tX, tY];
}

function transformPoint(pointToTransform, addPoint, rot, phi, theta, size) {
	//multiply point by size, then apply various rotations
	pointToTransform[0] *= size / 2;
	pointToTransform[2] *= size / 2;

	//spin
	[pointToTransform[0], pointToTransform[2]] = rotate(pointToTransform[0], pointToTransform[2], rot);
	[pointToTransform[0], pointToTransform[1]] = rotate(pointToTransform[0], pointToTransform[1], phi);
	[pointToTransform[0], pointToTransform[2]] = rotate(pointToTransform[0], pointToTransform[2], theta); 

	//adjusting for coordinates
	pointToTransform = [pointToTransform[0] + addPoint[0], pointToTransform[1] + addPoint[1], pointToTransform[2] + addPoint[2]];

	return pointToTransform;
}