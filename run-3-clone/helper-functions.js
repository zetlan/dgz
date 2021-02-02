//houses functions of various utility, from 3d rendering to 2d drawing to misc. object manipulation

/* 
generation functions:
	generateBinTree();
	generateStarSphere();

utility:
	avgArray();
	clamp();
	getPercentage();
	linterp();

	power_falseAlarm();
	power_fast();
	power_glimpse();
	power_instant();
	power_notSoFalseAlarm();
	power_slow();
	power_slowSmooth();
	power_smooth();

	randomCustom();
	randomSeeded();
	RGBtoHSV();
	rotate();
	runCrash();
	spliceIn();
	spliceOut();
	tunnelData_handle();
	tunnelData_parseData();
	tunnelData_subdivide();
	worldOutput();

2d collision:
	getOrientation();
	lineIntersect();
	inPoly();
*/



//generation functions
function generateStarSphere() {
	//random stars
	for (var e=0;e<world_starNumber;e++) {
		//squared for distribution more towards the center
		var cosTheta = Math.pow(randomSeeded(0, 1), 2);
		if (randomSeeded(0, 1) < 0.5) {
			cosTheta *= -1;
		}
		//maps to between -1/2pi and 1/2pi
		var theta = Math.acos(cosTheta) - (Math.PI / 2);
		var pos = polToCart(randomSeeded(0, Math.PI * 2), theta, randomSeeded(world_starDistance, world_starDistance * 2));
		world_stars.push(new Star(pos[0], pos[1], pos[2]));
	}
}



//utility functions

//takes in a 2-dimensional array and averages the elements to output a 1d array
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

//performs a linear interpolation between 2 values
function linterp(a, b, percentage) {
	return a + ((b - a) * percentage);
}

//takes in an array of objects with cameraDist values and returns the array, ordered by distance from the camera
function orderObjects(array, places) {
	//addings all objects to first array
	let unsorted_objects = [];
	let ordered = [];
	let buckets = [[], [], [], [], [], [], [], [], [], []];
	array.forEach(e => {
		unsorted_objects.push(e);
	});

	//running a radix sort
	for (var pos=1; pos<places+1; pos++) {
		//push objects to buckets
		while (unsorted_objects.length > 0) {
			//formula determines which bucket to push into
			buckets[Math.floor(((unsorted_objects[0].cameraDist) % Math.pow(10, pos) / Math.pow(10, pos-1)))].push(unsorted_objects[0]);
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

function placeTunnelSet(setName) {
	var setSplit = setName.split("\n");
	for (var g=0; g<setSplit.length-1; g++) {
		world_objects.push(new Tunnel_FromData(setSplit[g], []));
	}
}

//power functions!
//each power function takes in a start power, end power, and a time. The time determines what the power will be.
function power_falseAlarm(powStart, powEnd, time) {
	time = clamp(time / 60, 0, 1);
	return linterp(powEnd, powStart, Math.max(0, 1 - (2 * (3.00006648 * time * time)) + (6 * (time * time * time * time))))

}

function power_fast(powStart, powEnd, time) {
	//fast is made from other functions
	if (time < 90) {
		return power_notSoFalseAlarm(powStart, powEnd, time);
	} else if (time < 100) {
		return linterp(powStart, powEnd, 0.5);
	} else {
		return power_smooth(powStart, powEnd, (time - 100) * 4);
	}
}

function power_glimpse(powStart, powEnd, time) {
	time = clamp(time / 60, 0, 2);
	return linterp(powStart, powEnd, 1 - ((time - 1) * (time - 1)));
}

function power_instant(powStart, powEnd, time) {
	return powEnd;
}

function power_notSoFalseAlarm(powStart, powEnd, time) {
	//slow fade, jump to start, then jump back to end
	if (time > 70) {
		return powEnd;
	}
	return power_falseAlarm(powStart, powEnd, time);
}

function power_slow(powStart, powEnd, time) {
	//slow is also made from other functions, I used switch because it was worth it
	var mode = Math.floor(time / 10);

	switch (mode) {
		case 0:
		case 1:
		case 2:
		case 3:
		case 4:
		case 5:
		case 6:
		case 7:
		case 8:
		case 9:
			return power_notSoFalseAlarm(powStart, powEnd, time);
		case 10:
			return power_smooth(powStart, powEnd, (time - 100) * 6);
		case 11:
		case 12:
			return linterp(powEnd, powStart, 0.6);
		case 13:
			return linterp(powEnd, powStart, 0.2);
		case 14:
		case 15:
			return linterp(powEnd, powStart, 0.4);
		case 16:
			return linterp(powEnd, powStart, 0);
		case 17:
			return linterp(powEnd, powStart, 0.3);
		case 18:
		default:
			return linterp(powEnd, powStart, 0);
	}
}

//I like the smooth functions because they're easy
function power_slowSmooth(powStart, powEnd, time) {
	return linterp(powStart, powEnd, clamp(time, 0, 120) / 120);
}

function power_smooth(powStart, powEnd, time) {
	return linterp(powStart, powEnd, clamp(time, 0, 60) / 60);
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

//takes in a six digit RGB hex code and outputs an HSV code in object form.
function RGBtoHSV(sixDigitRGBHexCode) {
	//first get the seperate red, green, and blue values
	var val_red = sixDigitRGBHexCode.substring(1, 3);
	var val_green = sixDigitRGBHexCode.substring(3, 5);
	var val_blue = sixDigitRGBHexCode.substring(5, 7);

	//map from strings to 0-255 value
	val_red = parseInt(val_red, 16);
	val_green = parseInt(val_green, 16);
	val_blue = parseInt(val_blue, 16);

	
	//convert to 0-1 scalar
	val_red /= 255;
	val_green /= 255;
	val_blue /= 255;

	//other helpful parameters
	var val_max = Math.max(val_red, val_green, val_blue);
	var val_min = Math.min(val_red, val_green, val_blue);
	var diff = val_max - val_min;

	var hue;
	var saturation;
	var value = val_max;

	//calculating hue
	if (diff == 0) {
		hue = 0;
	} else if (val_red == val_max) {
		hue = 60 * (((val_green - val_blue) / diff) % 6);
	} else if (val_green == val_max) {
		hue = 60 * (((val_blue - val_red) / diff) + 2);
	} else if (val_blue == val_max) {
		hue = 60 * (((val_red - val_green) / diff) + 4);
	}



	//calculating saturation
	if (val_max == 0) {
		saturation = 0;
	} else {
		saturation = diff / val_max;
	}

	return {h: hue, s: saturation * 100, v: value};
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

function spliceIn(string, charStart, string2) {
	return string.slice(0, charStart) + string2 + string.slice(charStart, string.length);
}

function spliceOut(string, charStart, charEnd) {
	return string.slice(0, charStart) + string.slice(charEnd, string.length);
}

function tunnelData_handle(data) {
	//turn raw input into slightly more managable data by subdividing it
	data = tunnelData_subdivide(data);

	//the tile data is incomplete, so it needs to be fixed
	//generate tunnel array
	var finalTileArray = [];

	tunnelTileFarthest = 0;
	for (var g=0; g<data.tilesPerSide*data.sides; g++) {
		finalTileArray.push([]);
	}

	//parse the tunnel data
	for (var j=0;j<data.tileData.length;j++) {
		//only process the index if the data is real
		if (data.tileData[j]) {
			tunnelData_parseData(data.tileData[j], finalTileArray, data.tilesPerSide * data.sides, j);
		}
	}

	data.tileData = finalTileArray;

	//get the tunnel length
	data.tileData.forEach(td => {
		data.maxLen = Math.max(data.maxLen, td.length);
	});

	//return the final data
	return data;
}

//takes in terrain data and returns the 2d array with different tunnel tile types
function tunnelData_parseData(toParse, tileArray, tilesInLoop, tileTypeNum) {
	var translation = {
		"0": 0, "1": 1, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9,
		":": 10, ";": 11, "<": 12, "=": 13, ">": 14, "?": 15,"@": 16, "A": 17, "B": 18, "C": 19,
		"D": 20, "E": 21, "F": 22, "G": 23, "H": 24, "I": 25, "J": 26, "K": 27, "L": 28, "M": 29,
		"N": 30, "O": 31, "P": 32, "Q": 33, "R": 34, "S": 35, "T": 36, "U": 37, "V": 38, "W": 39,
		"X": 40, "Y": 41, "Z": 42, "[": 43, "/": 44, "]": 45, "^": 46, "_": 47, "!": 48, "a": 49,
		"b": 50, "c": 51, "d": 52, "e": 53, "f": 54, "g": 55, "h": 56, "i": 57, "j": 58, "k": 59,
		"l": 60, "m": 61, "n": 62, "o": 63,
	};
	//first step is to parse the stars
	//loop through all characters of the data
	for (var u=0;u<toParse.length;u++) {
		//if the character is a star, look forwards for other stars
		if (toParse[u] == "*") {
			var detectorChar = u+1;
			var starNum = 1;

			//determining number of stars/number of repeats
			while (toParse[detectorChar] == "*") {
				detectorChar += 1;
				starNum += 1;
			}
			var repeatTimes = translation[toParse[detectorChar]];

			//removing the stars and indicator number from the original data
			toParse = spliceOut(toParse, u, detectorChar+1);

			//extending the data through the duplication process
			var charsToRepeat = toParse.substr(u-starNum, starNum);
			for (var g=0; g<repeatTimes-1; g++) {
				toParse = spliceIn(toParse, u, charsToRepeat);
			}
		}
	}

	//next step is converting the data to 1s/0s
	var newData = "";
	for (var e=0;e<toParse.length;e++) {
		newData += ("000000" + (translation[toParse[e]]).toString(2)).substr(-6);
	}

	//final step is to map the 1s/0s onto the tunnel array
	var posCounter = 0;
	while (posCounter < newData.length) {
		var row = posCounter % tilesInLoop;
		var column = Math.floor(posCounter / tilesInLoop);

		//if the array is empty or has a 0 at the given position, put this data value on it
		if (tileArray[row][column] == undefined || tileArray[row][column] == 0) {
			tileArray[row][column] = newData[posCounter] * tileTypeNum;
		}

		posCounter += 1;
	}
}

//takes in raw tunnel data and subdivides it into its segments (id, tunnel type information, tile information, color, etc)
function tunnelData_subdivide(data) {
	var tileAssociation = {
		"~undefined": 1, "~glow": 2, "~crumbling": 3, "~ice": 4,
		"~slow": 5, "~fast": 6, "~left": 7, "~right": 8,
		"~box": 9, "~rotatedZBox": 10, "~steepRamp": 11, "~ramp": 12, //ice ramp
		"~movable": 13, "~battery": 14
	 };

	 

	var rawInput = data;
	//remove color indicators, I don't want to deal with that
	rawInput = rawInput.replace("~color-1", "");
	rawInput = rawInput.replace("~color-0", "");

	//split input using vertical separators
	var splitInput = rawInput.split("|");

	//looping through all indeces of the array to classify them
	var tunnel_tileData = [];
	var tunnel_color = "";
	var tunnel_sides = 0;
	var tunnel_tilesPerSide = 0;
	var tunnel_tileSize = 70;
	var tunnel_id = "";

	var tunnel_power = 1;
	var tunnel_powerFunctions = [];

	var tunnel_spawns = [];

	var tunnel_theta = 0;
	var tunnel_x = 0;
	var tunnel_z = 0;
	

	

		//determining what to do with the input
	splitInput.forEach(i => {
		//if it's a color tag, update the color
		if (i.indexOf("color") == 0) {
			//take the last 6 chars as the color code
			tunnel_color = "#" + i.substr(i.length - 6, 6);
		}

		//if it's a layout tag, update the tiles per row
		else if (i.indexOf("layout") == 0) {
			//splice out the non-numbers
			var layoutNumberBits = i.replace("layout-tunnel", "");
			layoutNumberBits = "[" + layoutNumberBits + "]";
			layoutNumberBits = JSON.parse(layoutNumberBits);

			//0 is sides, 1 is tiles per side
			tunnel_sides = layoutNumberBits[0];
			tunnel_tilesPerSide = layoutNumberBits[1];
		}

		//if it's a tile size tag, update the tile size
		else if (i.indexOf("tileWidth") == 0) {
			//splice out the first part, multiply by 1 so it's not a string anymore
			tunnel_tileSize = i.replace("tileWidth-", "") * 1;
		}

		//if it's an id tag, update the id, you know the thingy
		else if (i.indexOf("id-") == 0) {
			tunnel_id = i.replace("id-", "");
		}

		//trigger conditionals
		else if (i.indexOf("trigger-condition-z,") == 0) {
			var temp = i.replace("trigger-condition-z,", "");
			//only proceed if it's actually a power trigger
			if (temp.indexOf("result-power-") != -1) {
				temp = temp.split(",");

				//the first box is the tile to trigger at,
				//the second box is the result power, and 
				//the third box is the type of fade
				//EX [10, 0.4, "slow"]
				tunnel_powerFunctions.push([temp[0] * 1, temp[1].replace(">~result-power-", "")* 1, temp[2]]);
			}
		}

		//data tags
		else if (i.indexOf("terrain-pos") == 0) {
			//first splice out the terrain pos
			var dataBit = i.replace("terrain-pos-", "");
			//splice out the type definition

			dataBit = dataBit.split("~");
			dataBit[1] = "~" + dataBit[1];

			//use the second part (after the tilda) to know where to place the first part (actual data)
			var position = tileAssociation[dataBit[1]];

			tunnel_tileData[position] = dataBit[0];
		}

		//x, z, and theta 
		else if (i.indexOf("pos-x:") == 0) {
			tunnel_x = i.replace("pos-x:", "") * 1;
		}

		else if (i.indexOf("pos-z:") == 0) {
			tunnel_z = i.replace("pos-z:", "") * 1;
		}

		else if (i.indexOf("direction:") == 0) {
			tunnel_theta = i.replace("direction:", "") * 1;
		}

		//spawns
		else if (i.indexOf("spawn-") == 0) {
			tunnel_spawns.push(i.replace("spawn-", "") * 1);
		}

		//power
		else if (i.indexOf("power-") == 0) {
			tunnel_power = i.replace("power-", "") * 1;
		}
	});

	return {color: tunnel_color, id: tunnel_id, maxLen: 0, power: tunnel_power, powerFunctions: tunnel_powerFunctions, sides: tunnel_sides, spawns: tunnel_spawns,
			tileData: tunnel_tileData, tileSize: tunnel_tileSize, tilesPerSide: tunnel_tilesPerSide, theta: tunnel_theta, x: tunnel_x, z: tunnel_z};
}


//outputs every tunnel in the world as a string
function worldOutput() {
	var output = ``;
	world_objects.forEach(w => {
		output += w.giveStringData() + "\n";
	});

	return output;
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
	var linP2 = [1000000, xyPoint[1]];
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