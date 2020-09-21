//houses functions of various utility, from 3d rendering to 2d drawing to misc. object manipulation
//generation functions
function generateStarSphere() {
	//random stars
	for (var e=0;e<100;e++) {
		var pos = polToCart(randomCustom(0, Math.PI * 2), randomCustom(0.1, (Math.PI * 0.48)), randomCustom(world_starDistance, world_starDistance * 2));
		world_objects.splice(0, 0, new Star(pos[0], pos[1], pos[2]));
	}
}

function generateStaircase() {
	for (var y=0;y<30;y++) {
		var x = 40 * Math.sin((Math.PI / 6) * y);
		var z = 40 * Math.cos((Math.PI / 6) * y);

		world_objects.push(new Platform(x, y*2, z, 10, 10, "#F0F"));
	}
}






//utility functions

//returns the percentage from val1 to val2 that the checkVal is in
//example: 0, 10, 5, returns 0.5)
function getPercentage(val1, val2, checkVal) {
	val2 -= val1;
	checkVal -= val1;
	return checkVal / val2;
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

	return (tZ < 0.1);
}

//performs a linear interpolation between 2 values
function linterp(a, b, percentage) {
	return a + ((b - a) * percentage);
}

function polToCart(theta, phi, radius) {
	//theta here is horizontal angle, while phi is vertical inclination
	var x = radius * Math.cos(theta) * Math.sin(phi);
	var y = radius * Math.cos(phi);
	var z = radius * Math.sin(theta) * Math.sin(phi);
	return [x, y, z];
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

	//rotating around y axis
	[tX, tZ] = rotate(tX, tZ, player.theta);

	//rotating around x axis
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

function randomCustom(min, max) {
	return (Math.random() * (max - min)) + min;
}

function rotate(x, z, radians) {
	[x, z] = [(x * Math.cos(radians)) - (z * Math.sin(radians)), (z * Math.cos(radians)) + (x * Math.sin(radians))];
	return [x, z];
}