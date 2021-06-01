//here are all the functions that deal with 3d coordinates 
/*overview:
	calculateNormal(points);
	cameraToScreen(point);
	cartToPol(x, y, z);
	clipToPlane(polyPoints, tolerance, planePoint, planeNormal);
	dirToTunnelCenter(tunnel, x, y, z);
	getDistance(obj1, obj2);
	getDistance2d(xyP1, xyP2);
	getDistancePoint(p1, p2);
	getDistance_Tunnel(tunnel, obj2);
	getDistance_LightSource(obj);
	isClipped(pointArr);
	orderObjects(array, places);
	polToCart(theta, phi, radius);
	relativeToSpace(pointToTransform, point, normal);
	relativeToSpaceRot(pointToTransform, point, normal);
	rotate(x, z, radians);
	screenToSpace(screenSpot, targetZ);
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

//the opposite of polToCart, takes in an xyz point and outputs a vector in the form of [theta, phi, radius]
function cartToPol(x, y, z) {
	var rad = Math.sqrt((x * x) + (y * y) + (z * z));
	var theta = Math.atan2(x, z);
	var phi = Math.atan(y / Math.sqrt((z * z) + (x * x)));
	
	return [theta, phi, rad];
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

//takes in an array of objects with cameraDist values and returns the array, ordered by distance from the camera
function orderObjects(array, places) {
	//addings all objects to first array
	let unsorted_objects = [];
	let ordered = [];
	let buckets = [[], [], [], [], [], [], [], [], [], []];
	var end = array.length-1;
	unsorted_objects[end] = undefined;

	for (var a=0; a<array.length; a++) {
		unsorted_objects[a] = array[a];
	}

	//running a radix sort
	for (var pos=1; pos<places+1; pos++) {
		//empty buckets
		for (var g=0; g<buckets.length; g++) {
			buckets[g] = [];
		}
		//push objects to buckets
		for (var m=0; m<unsorted_objects.length; m++) {
			//formula determines which bucket to push into
			try {
				buckets[Math.floor(((unsorted_objects[m].cameraDist) % Math.pow(10, pos) / Math.pow(10, pos-1)))].push(unsorted_objects[m]);
			} catch(er) {
				console.error(`cannot sort object ${unsorted_objects[m].constructor.name} with cameraDist ${unsorted_objects[m].cameraDist}`);
				runCrash();
			}
		}

		//clear unsorted
		unsorted_objects = [];

		//put bucket results into unsorted array
		for (var k=0;k<buckets.length;k++) {
			for (var m=0; m<buckets[k].length; m++) {
				unsorted_objects.push(buckets[k][m]);
			}
		}
	}

	//push now ordered list to final array
	ordered[end] = undefined;
	for (var m=0; m<unsorted_objects.length; m++) {
		ordered[m] = unsorted_objects[end - m];
	}

	return ordered;
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

function relativeToSpaceRot(pointToTransform, point, normal) {
	var [tX, tY, tZ] = pointToTransform;
	var invNorm = [(Math.PI * 2) - normal[0], normal[1] * -1, normal[2] * -1];

	[tX, tY] = rotate(tX, tY, invNorm[2]);
	[tY, tZ] = rotate(tY, tZ, invNorm[1]);
	[tX, tZ] = rotate(tX, tZ, invNorm[0]);
	[tX, tY, tZ] = [tX + point[0], tY + point[1], tZ + point[2]];

	return [tX, tY, tZ];
}

function rotate(x, z, radians) {
	var sin = Math.sin(radians);
	var cos = Math.cos(radians);
	return [x * cos - z * sin, z * cos + x * sin];
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