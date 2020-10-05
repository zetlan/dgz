//here are all the functions that tranform 3d coordinates
/*overview:
	cameraToScreen();
	cartToPol();
	polToCart();
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

//the opposite of polToCart, takes in an xyz point and outputs a vector in the form of [theta, phi, radius]
function cartToPol(x, y, z) {
	var rad = Math.sqrt((x * x) + (y * y) + (z * z));
	var phi = Math.asin(y / rad);
	var theta = Math.atan2(y, x);
	return [theta, phi, rad];
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

	return [tX, tY, tZ];
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