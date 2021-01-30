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

//returns the distance between two objects
function getDistance(obj1, obj2) {
	return Math.sqrt(((obj1.x - obj2.x) * (obj1.x - obj2.x)) + ((obj1.y - obj2.y) * (obj1.y - obj2.y)) + ((obj1.z - obj2.z) * (obj1.z - obj2.z)));
}

//returns the pythagorean xy distance between two objects 
function getDistance2d(xyP1, xyP2) {
	return Math.sqrt(((xyP1[0] - xyP2[0]) * (xyP1[0] - xyP2[0])) + ((xyP1[1] - xyP2[1]) * (xyP1[1] - xyP2[1])));
}

//determines if a point will be clipped due to being behind / too close to the camera
function isClipped(pointArr) {
	var [tX, tY, tZ] = pointArr;
	tX -= world_camera.x;
	tY -= world_camera.y;
	tZ -= world_camera.z;
	[tX, tZ] = rotate(tX, tZ, world_camera.theta);
	[tY, tZ] = rotate(tY, tZ, world_camera.phi);

	return (tZ < render_clipDistance);
}

function polToCart(theta, phi, radius) {
	//theta here is horizontal angle, while phi is vertical inclination
	return [radius * Math.sin(theta) * Math.cos(phi), 
			radius * Math.sin(phi), 
			radius * Math.cos(theta) * Math.cos(phi)];
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

//takes in a screen point, and returns the spot on the world that would get you that point at a certain Z;
function screenToSpace(screenSpot, targetZ) {
	//converting coordinates to different offsets that are applied to the camera's position
	var sideOffset = polToCart(world_camera.theta + (Math.PI / 2), 0, (screenSpot[0] - (canvas.width / 2)) * (targetZ / world_camera.scale));
	var upOffset = polToCart(world_camera.theta, world_camera.phi + (Math.PI / 2), (-1 * (screenSpot[1] - (canvas.height / 2))) * (targetZ / world_camera.scale));
	var frontOffset = polToCart(world_camera.theta, world_camera.phi, targetZ);

	return [world_camera.x + sideOffset[0] + upOffset[0] + frontOffset[0], 
			world_camera.y + sideOffset[1] + upOffset[1] + frontOffset[1], 
			world_camera.z + sideOffset[2] + upOffset[2] + frontOffset[2]]; 
}

//turns world coordinates into 3d camera coordinates
function spaceToRelative(pointToChange, point, normal) {
	var [tX, tY, tZ] = pointToChange;

	var tX = pointToChange[0] - point[0];
	var tY = pointToChange[1] - point[1];
	var tZ = pointToChange[2] - point[2];

	[tX, tZ] = rotate(tX, tZ, normal[0]);
	[tY, tZ] = rotate(tY, tZ, normal[1]);
	[tX, tY] = rotate(tX, tY, normal[2]);

	return [tX, tY, tZ];
}


function spaceToScreen(point) {
	//takes in an xyz list and outputs an xy list
	var tX = point[0];
	var tY = point[1];
	var tZ = point[2];

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

function transformPoint(pointToTransform, addPoint, normal, size) {
	//multiply point by size, then apply various rotations
	pointToTransform[0] *= size / 2;
	pointToTransform[2] *= size / 2;

	//I have no idea if this is correct but it appears to work
	[pointToTransform[1], pointToTransform[2]] = rotate(pointToTransform[1], pointToTransform[2], (Math.PI * 2) - (normal[1] - (Math.PI * 0.5)));
	[pointToTransform[0], pointToTransform[2]] = rotate(pointToTransform[0], pointToTransform[2], -1 * normal[0]); 

	//adjusting for coordinates
	pointToTransform = [pointToTransform[0] + addPoint[0], pointToTransform[1] + addPoint[1], pointToTransform[2] + addPoint[2]];

	return pointToTransform;
}