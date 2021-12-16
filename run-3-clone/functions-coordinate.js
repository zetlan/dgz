//here are all the functions that deal with 3d coordinates 
/*overview:
	calculateNormal(points);
	cameraToScreen(point);
	clipToPlane(polyPoints, tolerance, planePoint, planeNormal);
	dirToTunnelCenter(tunnel, x, y, z);
	getDistance(obj1, obj2);
	getDistance2d(xyP1, xyP2);
	getDistancePoint(p1, p2);
	getDistance_Tunnel(tunnel, obj2);
	getDistance_LightSource(obj);
	isClipped(pointArr);
	multiplyPointByMatrix(pt, mtx);
	orderObjects(array, places);
	relativeToSpace(pointToTransform, point, normal);
	relativeToSpaceRot(pointToTransform, point, normal);
	screenToSpace(screenSpot, targetZ);
	spaceToCamera(point);
	spaceToRelative(pointToChange, point, normal);
	spaceToRelativeRotless(pointToChange, point, normal);
	spaceToScreen(point);
	transformPoint(pointToTransform, addPoint, normal, size);
*/

//calculates a normal from an array of points
function calculateNormal(points) {
	//first get average point, that's self's xyz
	var [x, y, z] = avgArray(points);

	//get cross product of first two points, that's the normal
	//every shape has to have at least 3 points, so 
	//comparing points 2 and 3 to point 1 for normal getting
	var v1 = [points[1][0] - points[0][0], points[1][1] - points[0][1], points[1][2] - points[0][2]];
	var v2 = [points[2][0] - points[0][0], points[2][1] - points[0][1], points[2][2] - points[0][2]];
	var cross = [(v1[1] * v2[2]) - (v1[2] * v2[1]), (v1[2] * v2[0]) - (v1[0] * v2[2]), (v1[0] * v2[1]) - (v1[1] * v2[0])];
	
	cross = cartToPol(cross[0], cross[1], cross[2]);

	return [cross[0], cross[1]];
}

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

//like clipToZ0, but uses distance instead of Z-coordinate.
function clipToDistance(polyPoints, tolerance) {
	var allBad = true;
	var n = 0;
	while (allBad && n < polyPoints.length) {
		polyPoints[n][3] = Math.sqrt(polyPoints[n][0] * polyPoints[n][0] + polyPoints[n][1] * polyPoints[n][1] + polyPoints[n][2] * polyPoints[n][2]);
		if (polyPoints[n][3] < tolerance) {
			polyPoints[n][4] = true;
		} else {
			allBad = false;
			polyPoints[n][4] = false;
		}
		n += 1;
	}

	//return early if all points are destroyed
	if (allBad) {
		return [];
	}

	while (n < polyPoints.length) {
		polyPoints[n][3] = Math.sqrt(polyPoints[n][0] * polyPoints[n][0] + polyPoints[n][1] * polyPoints[n][1] + polyPoints[n][2] * polyPoints[n][2]);
		polyPoints[n][4] = polyPoints[n][3] < tolerance;
		n += 1;
	}

	for (var y=0; y<polyPoints.length; y++) {
		//if the selected point will be clipped, run the algorithm
		if (polyPoints[y][4]) {
			// console.log(`point ${y} is too close, clipping`);
			//decide what to do based on the number of adjacent non-clipped points
			switch (!polyPoints[(y+(polyPoints.length-1))%polyPoints.length][4] + !polyPoints[(y+1)%polyPoints.length][4]) {
				case 0:
					//if there are no free friends, there's no point in attempting, so just move on
					polyPoints.splice(y, 1);
					y -= 1;
					break;
				case 1:
					//determine which one is free, then move towards it
					var friendCoords;
					var moveAmount;
					//lesser / greater friend decision friend
					friendCoords = polyPoints[(y+(polyPoints.length + boolToSigned(polyPoints[(y+(polyPoints.length-1))%polyPoints.length][4])))%polyPoints.length];
					moveAmount = getPercentage(friendCoords[3], polyPoints[y][3], tolerance);
					polyPoints[y] = [...linterp3d(friendCoords, polyPoints[y], moveAmount), linterp(friendCoords[3], polyPoints[y][3], moveAmount), true];
					break;
				case 2:
					//move towards both friends
					var friendCoords = polyPoints[(y+(polyPoints.length-1))%polyPoints.length];
					var moveAmount = getPercentage(friendCoords[3], polyPoints[y][3], tolerance);
					polyPoints.splice(y, 0, [...linterp3d(friendCoords, polyPoints[y], moveAmount), linterp(friendCoords[3], polyPoints[y][3], moveAmount), true]);
					y += 1;

					friendCoords = polyPoints[(y+1)%polyPoints.length];
					moveAmount = getPercentage(friendCoords[3], polyPoints[y][3], tolerance);
					polyPoints[y] = [...linterp3d(friendCoords, polyPoints[y], moveAmount), linterp(friendCoords[3], polyPoints[y][3], moveAmount), true];
					y -= 1;
					break;
			}
		}
	}
	return polyPoints;
}


//WARNING: this function modifies the original array. I may change it later if this causes problems.
function clipToPlane(polyPoints, tolerance, planePoint, planeNormal) {
	//transform to plane coordinates
	for (var p=0; p<polyPoints.length; p++) {
		polyPoints[p] = spaceToRelativeRotless(polyPoints[p], planePoint, planeNormal);
	}
	//clip
	polyPoints = clipToZ0(polyPoints, tolerance, false);

	//transform back
	for (var p=0; p<polyPoints.length; p++) {
		polyPoints[p] = relativeToSpace(polyPoints[p], planePoint, planeNormal);
	}

	return polyPoints;
}

//takes a coordinate and returns the direction needed to move towards the center of that tunnel
function dirToTunnelCenter(tunnel, speed, x, y, z) {
	var relPos = spaceToRelativeRotless([x, y, z], [tunnel.x, tunnel.y, tunnel.z], [-1 * tunnel.theta, 0]);
	relPos[2] = 0;
	//determine direction to push in
	var magnitude = Math.sqrt((relPos[0] * relPos[0]) + (relPos[1] * relPos[1]));
	relPos[0] = (relPos[0] / magnitude) * speed;
	relPos[1] = (relPos[1] / magnitude) * speed;

	//transform back to real coordinates
	[relPos[0], relPos[2]] = rotate(relPos[0], relPos[2], tunnel.theta);
	return relPos;
}

function dot(vec1, vec2) {
	var sum = 0;
	for (var h=0; h<vec1.length; h++) {
		sum += vec1[h] * vec2[h];
	}
	return sum;
}

//returns the distance between two objects
function getDistance(obj1, obj2) {
	return Math.sqrt(((obj1.x - obj2.x) * (obj1.x - obj2.x)) + ((obj1.y - obj2.y) * (obj1.y - obj2.y)) + ((obj1.z - obj2.z) * (obj1.z - obj2.z)));
}

//returns the pythagorean xy distance between two objects 
function getDistance2d(xyP1, xyP2) {
	return Math.sqrt(((xyP1[0] - xyP2[0]) * (xyP1[0] - xyP2[0])) + ((xyP1[1] - xyP2[1]) * (xyP1[1] - xyP2[1])));
}

function getDistancePoint(p1, p2) {
	return Math.sqrt(((p1[0] - p2[0]) * (p1[0] - p2[0])) + ((p1[1] - p2[1]) * (p1[1] - p2[1])) + ((p1[2] - p2[2]) * (p1[2] - p2[2])));
}

function getDistance_Tunnel(tunnel, obj2) {
	var relPos = spaceToRelativeRotless([obj2.x, obj2.y, obj2.z], [tunnel.x, tunnel.y, tunnel.z], [-1 * tunnel.theta, 0]);
	if (relPos[2] > 0) {
		relPos[2] = Math.max(relPos[2] - (tunnel.tileSize * tunnel.len) - tunnel_transitionLength, 0);
	}
	return Math.sqrt((relPos[0] * relPos[0]) + (relPos[1] * relPos[1]) + (relPos[2] * relPos[2]));
}

//doesn't work for 3 dimensions but whatever, the game isn't built with that in mind anyways
function getDistance_TunnelTunnel(tunnel1, tunnel2) {
	//convert 3d structs into 2 2d line segments
	var a1 = [tunnel1.x, tunnel1.z];
	var a2 = [tunnel1.endPos[0], tunnel1.endPos[2]];
	var b1 = [tunnel2.x, tunnel2.z];
	var b2 = [tunnel2.endPos[0], tunnel2.endPos[2]];

	//if the tunnels just intersect it's good
	if (lineIntersect(a1, a2, b1, b2)) {
		return 0;
	}

	//wacky, trying each of the vertices together will give the result needed
	return Math.min(
		pointSegmentDistance(a1, b1, b2), 
		pointSegmentDistance(a2, b1, b2),
		pointSegmentDistance(b1, a1, a2),
		pointSegmentDistance(b2, a1, a2));
}

//sets the object's player distance to the closest distance to a light source
function getDistance_LightSource(obj) {
	var dist = render_maxColorDistance * 2;
	world_lightObjects.forEach(l => {
		dist = Math.min(dist, getDistance(obj, l));
	});
	return dist;
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

function multiplyPointByMatrix(pt, mtx) {
	return [
		pt[0] * mtx[0][0] + pt[1] * mtx[1][0] + pt[2] * mtx[2][0],
		pt[0] * mtx[0][1] + pt[1] * mtx[1][1] + pt[2] * mtx[2][1],
		pt[0] * mtx[0][2] + pt[1] * mtx[1][2] + pt[2] * mtx[2][2]
	]
}

//takes in an array of objects with cameraDist values and returns the array, ordered by distance from the camera
function orderObjects(array) {
	var newArr = [];

	var b = 0;
	for (var a=0; a<array.length; a++) {
		b = 0;
		while (b < newArr.length && newArr[b].cameraDist > array[a].cameraDist) {
			b += 1;
		}
		newArr.splice(b, 0, array[a]);
	}
	return newArr;
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

function relativeToSpaceRot(pointToTransform, point, normal) {
	var [tX, tY, tZ] = pointToTransform;
	var invNorm = [(Math.PI * 2) - normal[0], normal[1] * -1, normal[2] * -1];

	[tX, tY] = rotate(tX, tY, invNorm[2]);
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

//like spaceToRelative, but specifically for the camera, which gets its own special matrix to speed things up
function spaceToCamera(point) {
	return multiplyPointByMatrix([point[0] - world_camera.x, point[1] - world_camera.y, point[2] - world_camera.z], world_camera.rotMatrix);
}

//turns world coordinates into 3d camera coordinates
function spaceToRelative(pointToChange, point, normal) {
	var tX = pointToChange[0] - point[0];
	var tY = pointToChange[1] - point[1];
	var tZ = pointToChange[2] - point[2];

	[tX, tZ] = rotate(tX, tZ, normal[0]);
	[tY, tZ] = rotate(tY, tZ, normal[1]);
	[tX, tY] = rotate(tX, tY, normal[2]);

	return [tX, tY, tZ];
}

//like spaceToRelative, but without the rotation that a lot of objects don't need
function spaceToRelativeRotless(pointToChange, point, normal) {
	var tX = pointToChange[0] - point[0];
	var tY = pointToChange[1] - point[1];
	var tZ = pointToChange[2] - point[2];

	[tX, tZ] = rotate(tX, tZ, normal[0]);
	[tY, tZ] = rotate(tY, tZ, normal[1]);

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

	//step 3: divide by axis perpendicular to camera
	tX /= tZ;
	tY /= tZ;

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
	size /= 2;
	pointToTransform[0] *= size;
	pointToTransform[1] *= size;
	pointToTransform[2] *= size;

	//I have no idea if this is correct but it appears to work
	[pointToTransform[1], pointToTransform[2]] = rotate(pointToTransform[1], pointToTransform[2], (Math.PI * 0.5) - normal[1]);
	[pointToTransform[0], pointToTransform[2]] = rotate(pointToTransform[0], pointToTransform[2], -1 * normal[0]); 

	//adjusting for coordinates
	pointToTransform[0] += addPoint[0];
	pointToTransform[1] += addPoint[1];
	pointToTransform[2] += addPoint[2];

	return pointToTransform;
}