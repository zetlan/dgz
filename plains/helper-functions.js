//houses functions of various utility, from 3d rendering to 2d drawing to misc. object manipulation



//generation functions
function generateBinTree() {
	world_binTree = new TreeNode(world_objects[0]);
	console.log(world_binTree.contains == world_objects[0]);

	for (var r=1;r<world_objects.length;r++) {
		world_binTree.accept(world_objects[r]);
	}
	console.log(world_binTree.contains == world_objects[0]);
}
function generateStarSphere() {
	//random stars
	for (var e=0;e<100;e++) {
		var pos = polToCart(randomCustom(0, Math.PI * 2), randomCustom(0.1, (Math.PI * 0.48)), randomCustom(world_starDistance, world_starDistance * 2));
		world_stars.push(new Star(pos[0], pos[1], pos[2]));
	}
}

function generateStaircase() {
	for (var y=0;y<30;y++) {
		var x = 40 * Math.sin((Math.PI / 6) * y);
		var z = 40 * Math.cos((Math.PI / 6) * y);

		world_objects.push(new Floor(x, y*2, z, 10, 10, "#F0F"));
	}
}






//utility functions

//the opposite of polToCart, takes in an xyz point and outputs a vector in the form of [theta, phi, radius]
function cartToPol(x, y, z) {
	var rad = Math.sqrt((x * x) + (y * y) + (z * z));
	var phi = Math.asin(y / rad);
	var theta = Math.asin((x / rad) / Math.cos(phi));
	return [theta, phi, rad];
}
//keeps a number between certain bounds
//these operators are stupid and I hope to never use them again
function clamp(num, min, max) {
	return num <= min ? min : num >= max ? max : num;
}

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

//takes in all the unordered objects in the map, and returns an ordered list of them by distance to the player
function orderObjects() {
	//addings all world objects to first array
	let unsorted_objects = [];
	let ordered = [];
	let buckets = [[], [], [], [], [], [], [], [], [], []];
	for (var e=0;e<world_objects.length;e++) {
		unsorted_objects.push(world_objects[e]);
	}

	//take out all the stars and put them at the start of the list
	for (var w=0;w<unsorted_objects.length;w++) {
		if (unsorted_objects[w] instanceof Star) {
			ordered.push(unsorted_objects[w]);
			unsorted_objects.splice(w, 1);
			w -= 1;
		}
	}
	//after stars are the world floor
	ordered.push(world_floor);
	if (world_floor == unsorted_objects[0]) {
		unsorted_objects.splice(0, 1);
	}

	//running a radix sort
	//4 places
	for (var pos=1;pos<5;pos++) {
		//push objects to buckets
		while (unsorted_objects.length > 0) {
			//formula determines which bucket to push into
			buckets[Math.floor(((unsorted_objects[0].pDist) % Math.pow(10, pos) / Math.pow(10, pos-1)))].push(unsorted_objects[0]);
			unsorted_objects.splice(0, 1);
		}

		//empty buckets
		for (var k=0;k<buckets.length;k++) {
			while (buckets[k].length > 0) {
				unsorted_objects.push(buckets[k][0]);
				buckets[k].splice(0, 1);
			}
		}
	}

	//push now ordered list to final array
	while (unsorted_objects.length > 0) {
		ordered.push(unsorted_objects[unsorted_objects.length-1]);
		unsorted_objects.splice(unsorted_objects.length-1, 1);
	}
	
	return ordered;
}

function polToCart(theta, phi, radius) {
	//theta here is horizontal angle, while phi is vertical inclination
	var x = radius * Math.sin(theta) * Math.cos(phi);
	var y = radius * Math.sin(phi);
	var z = radius * Math.cos(theta) * Math.cos(phi);
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

function runCrash() {
	ctx.fillStyle = "#F0F";
	ctx.fillRect(0, 0, canvas.width / 2, canvas.height / 2);
	ctx.fillRect(canvas.width / 2, canvas.height / 2, canvas.width / 2, canvas.height / 2);

	ctx.fillStyle = "#000";
	ctx.fillRect(canvas.width / 2, 0, canvas.width / 2, canvas.height / 2);
	ctx.fillRect(0, canvas.height / 2, canvas.width / 2, canvas.height / 2);

	window.cancelAnimationFrame(game_animation);
}





//drawing functions

function drawQuad(color, p1, p2, p3, p4) {
	//console.log(color, p1, p2, p3, p4);
	ctx.fillStyle = color;
	ctx.strokeStyle = color;
	ctx.beginPath();
	ctx.moveTo(p1[0], p1[1]);
	ctx.lineTo(p2[0], p2[1]);
	ctx.lineTo(p3[0], p3[1]);
	ctx.lineTo(p4[0], p4[1]);
	ctx.lineTo(p1[0], p1[1]);
	ctx.stroke();
	ctx.fill();
}

function drawPoly(color, xyPointsArr) {
	ctx.fillStyle = color;
	if (!editor_active) {
		ctx.strokeStyle = color;
	}
	
	var xypa = xyPointsArr;
	ctx.beginPath();
	ctx.moveTo(xypa[0][0], xypa[0][1]);
	for (var i=1;i<xypa.length;i++) {
		ctx.lineTo(xypa[i][0], xypa[i][1]);
	}
	//back to start
	ctx.lineTo(xypa[0][0], xypa[0][1]);
	ctx.stroke();
	ctx.fill();
}

function drawCircle(color, x, y, radius) {
	ctx.beginPath();
	ctx.fillStyle = color;
	ctx.strokeStyle = color;
	ctx.ellipse(x, y, radius, radius, 0, 0, Math.PI * 2);
	ctx.stroke();
	ctx.fill();
}