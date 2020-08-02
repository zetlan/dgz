
function adjustForCamera(xyPoint) {
	//adjusts an xy coordinate to go to screen
	var adjustedPoint = [(xyPoint[0] - camera.xOffset) * camera.scale, (xyPoint[1] - camera.yOffset) * camera.scale];
	return adjustedPoint;
}


function convertToPolar(x, y) {
	var direction = Math.atan2(x, y) + Math.PI;
	var magnitude = Math.sqrt((x * x) + (y * y));
	var polar = [direction, magnitude];
	return polar;
}

function getDistBetween(x1, y1, x2, y2) {
	//subtract position of a from b
	x2 -= x1;
	y2 -= y1;

	//get pythagorean distance
	var dist = Math.sqrt((x2 * x2) + (y2 * y2));

	return dist;
}


function getOrientation(p1, p2, p3) {
	//will return 0 if points are colinear, 1 if points are counterclockwise, and 2 if points are clockwise.
	
	//formula compares slope and gets direction based off of that
	var value = (p2[1] - p1[1]) * (p3[0] - p2[0]) - (p2[0] - p1[0]) * (p3[1] - p2[1]);
	
	//If second slope is greater, clockwise. If second slope is smaller, counterclockwise. If not, it must be colinear.
	if (value > 0) {
		return 2;
	}
	if (value < 0) {
		return 1;
	} else {
		return 0;
	}
}



function inPoly(xyPoint, polyPoints) {
	//to test if a point is in a polygon, a line is drawn out to infinity (or close enough)
	//and it's checked against all lines in the polygon. If it hits an odd number of lines, it is inside.

	//making collision line that extends a long distance to the positive x direction
	var linP1 = xyPoint;
	var linP2 = [8675309, xyPoint[1]];

	var intersectNum = 0;
	//checking against all polygon lines
	for (var r=0;r<polyPoints.length;r++) {
		var p1 = polyPoints[r % polyPoints.length];
		var p2 = polyPoints[(r+1) % polyPoints.length];

		if (lineIntersect(p1, p2, linP1, linP2)) {
			intersectNum += 1;
		}
	}

	//return final value
	if (intersectNum % 2 == 1) {
		return true;
	} else {
		return false;
	}
}

//returns the angle of a line between two points from 0 to pi/2 radians
function getAngle(p1, p2) {
	p2 = [p2[0] - p1[0], p2[1] - p1[1]];
	var angle = Math.atan2(p2[1], p2[0]);
	angle = Math.abs(angle);
	if (angle > Math.PI / 2) {
	angle = Math.PI - angle;
	}

	return angle;
}
/*similar to inPoly, returns the position of the line intersected with in radians. 
Returns -1 if no line is intersected with. */
function getIntersectPoint(xyPoint1 , xyPoint2, polyPoints) {
	var linP1 = xyPoint1;
	var linP2 = xyPoint2;

	var intersectsAt = -1;

	//checking against all polygon lines
	for (var r=0;r<polyPoints.length;r++) {
		var p1 = polyPoints[r % polyPoints.length];
		var p2 = polyPoints[(r+1) % polyPoints.length];

		if (lineIntersect(p1, p2, linP1, linP2)) {
			intersectsAt = r;
			r = polyPoints.length + 1;
		}
	}

	return [intersectsAt, (intersectsAt + 1) % polyPoints.length];
}

function handleGameplayCameraScroll() {
	var screenHumanPos = adjustForCamera([human.x, human.y]);
	//forwards, keep player out of the 25% right zone
	if (screenHumanPos[0] > canvas.width * 0.75) {
		camera.xOffset = human.x - canvas.width * 0.75;
		//make sure not to go off the right edge
		if (camera.xOffset > (loadingBridge.bridgeArr.length * bridgeSegmentWidth) - canvas.width - 10) {
			camera.xOffset = (loadingBridge.bridgeArr.length * bridgeSegmentWidth) - canvas.width - 10;
		}
	}

	//backwards, keep player out of the 25% left zone but make sure to not go off the left edge
	if (screenHumanPos[0] < canvas.width * 0.25 && camera.xOffset > 10) {
		camera.xOffset = human.x - canvas.width * 0.25;
	};
	//if the player is out of bounds, check for leaving
	if (human.y > canvas.height) {
		console.log("human offscreen down: true");
		loadingBridge.checkForLeave(true);
	} else if (human.x < 0 || human.x > loadingBridge.bridgeArr.length * bridgeSegmentWidth) {
		console.log("human offscreen left: " + (human.x < 0) + "\n", "human offscreen right: " + (human.x > loadingBridge.bridgeArr.length * bridgeSegmentWidth));
		loadingBridge.checkForLeave(false);
	}
}

//not a very complex function, but this way I don't have to write out the equation every time
function linterp(val1, val2, percentage0to1) {
	return val1 + ((val2 - val1) * percentage0to1);
}

function lineIntersect(lin1p1, lin1p2, lin2p1, lin2p2) {
	/*lines intersect if the orientation between:
		a. the points in the first segment and the first point in the second segment
		b. the points in the first segment and the second point in the second segment

		are different, and vice versa, so

		c. the points in the second segment and the first point in the first segment
		d. the points in the second segment and the second point in the first segment

		are different. If a != b and c != d, they intersect.
	*/
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

function mapOutput() {
	//outputs the current map as a string

	//goes through all the elements in the map and appends them to an array as a string
	let outputMap = [];
	for (var f=0;f<loadingMap.length;f++) {
		outputMap.push(loadingMap[f].giveEnglishConstructor());
	}

	//stringify constructor array
	outputMap = JSON.stringify(outputMap);

	//misc. changes for conversion to proper format
	outputMap = outputMap.replace(/"/g, '');
	outputMap = outputMap.replace(/,n/g, ',\nn');
	console.log(outputMap);
}

function playerIsNear(xyPoint) {
	if (Math.abs(human.x - xyPoint[0]) < distance_tolerance && Math.abs(human.y - xyPoint[1]) < distance_tolerance) {
		return true;
	} else {
		return false;
	}
}

function rotate(x, y, radians) {
	[x, y] = [(x * Math.cos(radians)) - (y * Math.sin(radians)), (y * Math.cos(radians)) + (x * Math.sin(radians))];
	return [x, y];
}

//rounds a 2d array
function round2dArray(arr) {
	for (var u=0;u<arr.length;u++) {
		for (var v=0;v<arr[u].length;v++) {
			arr[u][v] = Math.round(arr[u][v]);
		}
	}

	return arr;
}

//for switching to the gameplay state, from the map
function switchToGameplayState(startAtEnd) {
	human = theGameCharacter;
	//position the player
	if (startAtEnd) {
		human.x = (loadingBridge.bridgeArr.length * (bridgeSegmentWidth - 1)) - 10;
	} else {
		human.x = 10;
	}
	
	human.y = canvas.width * 0.5;

	[human.dx, human.dy] = [0, 0];
	[human.ax, human.ay] = [0, 0];
	camera.xOffset = 0;
	camera.yOffset = 0;
	camera.scale = 1;
	gameState = "game";

	

	
	//figure out ratio of water indeces to bridge indeces, calculate number of waters
	var wRatio = bridgeSegmentWidth / waterSegmentWidth;
	var waterIndeces = (loadingBridge.bridgeArr.length * wRatio) + 10;

	//initilize array with number of indeces specified

	//initializing water
	loadingWater = [];
	for (var q=0;q<waterIndeces;q++) {
		loadingWater.push(0);
	}
}

//for switching to the map, from the gameplay
function switchToMapState() {
	human = theMapCharacter;
	loadingBridge.completed = true;
	[human.x, human.y] = loadingBridge.destination;
	[human.dx, human.dy] = [0, 0];
	[human.ax, human.ay] = [0, 0];
	human.confirmHome();
	gameState = "map";
}

//for switching to gameover, from the gameplay
function switchToGameoverState(showMessage) {
	human = theMapCharacter;

	if (showMessage) {
		gameState = "gameover";
	} else {
		gameState = "map";
	}
	
}

function updateWater() {
	//zero the array
	for (var g=0;g<loadingWater.length;g++) {
		loadingWater[g] = 0;
	}

	//loop through the wave objects
	for (var d=0;d<waveArray.length;d++) {
		//update object
		waveArray[d].tick();

		//if object is queued for death, make it die
		if (waveArray[d].height < 0.01) {
			waveArray.splice(d, 1);
		}
	}
}

function zNegate() {
	button_z = false;
}

function zHandle() {
	switch (gameState) {
		case "menu":
			gameState = "map";
			break;
		case "map":
			//set the z flag to true for the bridges / NPCs to detect it
			button_z = true;
			window.setTimeout(zNegate, 30);
			break;
		case "game":
			human.buildBridge();
			break;
		case "gameover":
			gameState = "map";
			break;
	}

		
}