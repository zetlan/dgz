//houses functions of various utility, from 3d rendering to 2d drawing to misc. object manipulation

/* 
generation functions:
	generateBinTree();
	generateStarSphere();
	generateStaircase();

utility:
	avgArray();
	clamp();
	getPercentage();
	isClipped();
	linterp();
	randomCustom();
	randomSeeded();
	rotate();
	runCrash();

2d collision:


drawing:
	drawQuad();
	drawPoly();
	drawCircle();
*/



//generation functions
function generateBinTree() {
	world_binTree = new TreeNode(world_objects[0]);

	for (var r=1;r<world_objects.length;r++) {
		world_binTree.accept(world_objects[r]);
	}
}
function generateStarSphere() {
	//random stars
	for (var e=0;e<100;e++) {
		var pos = polToCart(randomSeeded(0, Math.PI * 2), randomSeeded(0.1, (Math.PI * 0.48)), randomSeeded(world_starDistance, world_starDistance * 2));
		world_stars.push(new Star(pos[0], pos[1], pos[2]));
	}
}

function generateStaircase() {
	for (var y=0;y<30;y++) {
		var x = 40 * Math.sin((Math.PI / 6) * y);
		var z = 40 * Math.cos((Math.PI / 6) * y);

		world_objects.push(new Floor(x, y*2, z, 10, 10, "#FF0"));
	}
}






//utility functions

//takes in a multi-dimensional array and averages the elements to output a 1d array
function avgArray(array) {
	var finArr = [];
	var arr = array;

	//get the length of the first 1d array
	for (var y=0;y<arr[0].length;y++) {
		//average all the 0s, the 1s, the 2s, etc until whole is done
		finArr.push(0);
		for (var z=0;z<arr.length;z++) {
			finArr[y] += arr[z][y];
		}
	}

	//divide numbers by the amount of 1d arrays
	for (var d=0;d<finArr.length;d++) {
		finArr[d] /= arr.length;
	}
	

	return finArr;
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

	return (tZ < render_clipDistance);
}

//performs a linear interpolation between 2 values
function linterp(a, b, percentage) {
	return a + ((b - a) * percentage);
}

//returns a random value between the min value and max values, using the default javascript randomizer
function randomCustom(min, max) {
	return (Math.random() * (max - min)) + min;
}

//returns a pseudo-random value between the min value and max values
function randomSeeded(min, max) {
	world_pRandValue = Math.pow(world_pRandValue, 1.6414756);
	//keep value in bounds
	while (world_pRandValue > 100) {
		world_pRandValue -= 98;
	}
	return ((world_pRandValue % 1) * (max - min)) + min;
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





//2d collision functions, I've written these enough times that they don't need explanations. If you want an explanation, check rotate/2d-collision.js
function getOrientation(p1, p2, p3) {
	var value = (p2[1] - p1[1]) * (p3[0] - p2[0]) - (p2[0] - p1[0]) * (p3[1] - p2[1]); 
	if (value > 0) {
		return 2;
	} 
	if (value < 0) {
		return 1;
	} else {
		return 0;
	}
}

function lineIntersect(lin1p1, lin1p2, lin2p1, lin2p2) {
	var a = getOrientation(lin1p1, lin1p2, lin2p1);
	var b = getOrientation(lin1p1, lin1p2, lin2p2);
	var c = getOrientation(lin2p1, lin2p2, lin1p1);
	var d = getOrientation(lin2p1, lin2p2, lin1p2);
	if (a != b && c != d) {
		return 1;
	} else {
		return 0;
	}
}


function inPoly(xyPoint, polyPoints) {
	var linP1 = xyPoint;
	var linP2 = [canvas.width, xyPoint[1]];
	var intersectNum = 0;
	for (var r=0;r<polyPoints.length;r++) {
		var p1 = polyPoints[r % polyPoints.length];
		var p2 = polyPoints[(r+1) % polyPoints.length];

		if (lineIntersect(p1, p2, linP1, linP2)) {
			intersectNum += 1;
		}
	}
	if (intersectNum % 2 == 1) {
		return true;
	} else {
		return false;
	}
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