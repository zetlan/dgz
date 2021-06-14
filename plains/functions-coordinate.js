//here are all the functions that tranform 3d coordinates
/*overview:
	cameraToScreen();
	isClipped();
	relativeToSpace();
	spaceToRelative();
	spaceToScreen();
*/

//turns camera coordinates into 2d screen coordinates
function cameraToScreen(point) {
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

function getDistance3d(p1, p2) {
	return Math.sqrt((p1[0] - p2[0]) * (p1[0] - p2[0]) + (p1[1] - p2[1]) * (p1[1] - p2[1]) + (p1[2] - p2[2]) * (p1[2] - p2[2]));
}

function isInFrustum(point) {
	var hasInside = false;
	var propW = canvas.width * 0.5 / player.scale;
	var propH = canvas.height * 0.5 / player.scale;
	//if the points are outside the frustum entirely, don't bother
	for (var p=0; p<pointArr.length; p++) {
		if (pointArr[p][2] > render_clipDistance && Math.abs(pointArr[p][0]) < propW * pointArr[p][2] && Math.abs(pointArr[p][1]) < propH * pointArr[p][2]) {
			hasInside = true;
			p = pointArr.length + 1;
		}
	}
	if (!hasInside) {
		return [];
	}
}

//determines if a point will be clipped due to being behind / too close to the player
function isClipped(pointArr) {
	var tX = pointArr[0];
	var tY = pointArr[1];
	var tZ = pointArr[2];
	tX -= player.x;
	tY -= player.y;
	tZ -= player.z;
	[tX, tZ] = rotate(tX, tZ, player.theta);
	[tY, tZ] = rotate(tY, tZ, player.phi);

	return (tZ < render_clipDistance);
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

	return [tX, tY, tZ];
}

function spaceToRelative2(pointToChange, point, normal) {
	//calculating camera relative coordinates
}

function spaceToScreen(pointArr) {
	//takes in an xyz list and outputs an xy list
	var tX = pointArr[0];
	var tY = pointArr[1];
	var tZ = pointArr[2];

	//step 1: make coordinates relative to player
	tX -= player.x;
	tY -= player.y;
	tZ -= player.z;

	//step 2: rotate coordinates
	//around y axis
	[tX, tZ] = rotate(tX, tZ, player.theta);

	//around x axis
	[tY, tZ] = rotate(tY, tZ, player.phi);

	//step 2.5: clipping if behind the player
	if (tZ < 0.1) {
		tX = (tX * -1) / tZ;
		tY = (tY * -1) / tZ;
	} else {
		//step 3: divide by axis perpendicular to player
		tX /= tZ;
		tY /= tZ;
	}

	//step 4: account for camera scale
	tX *= player.scale;

	//flipping image
	tY *= -1 * player.scale;

	//accounting for screen coordinates
	tX += canvas.width / 2;
	tY += canvas.height / 2;

	return [tX, tY];
}

function trimPoints(points) {
	//trimming identicalish points
	var lastPoint = points[points.length-1];
	for (var j=0;j<points.length;j++) {
		//if the two points are the same, remove the latter one
		if (Math.abs(lastPoint[0] - points[j][0]) < render_identicalPointTolerance && Math.abs(lastPoint[1] - points[j][1]) < render_identicalPointTolerance && Math.abs(lastPoint[2] - points[j][2]) < render_identicalPointTolerance) {
			points.splice(j, 1);
			j -= 1;
		}
		if (j > -1) {
			lastPoint = points[j];
		}
	}
}