//houses functions of various utility
/* 
	generateStarSphere();

	avgArray();
	clamp();
	crumbleTileSet();

	getClosestObject();
	getImage();
	getObjectFromID();
	getPercentage();
	getTimeFromFrames();

	handleAudio();
	HSVtoRGB();
	linterp();
	localStorage_read();
	localStorage_write();
	logTime();
	logTimeEnd();
	modularDifference();
	outputWorld();
	outputTunnel();

	power_falseAlarm();
	power_fast();
	power_glimpse();
	power_instant();
	power_notSoFalseAlarm();
	power_slow();
	power_slowSmooth();
	power_smooth();

	randomBounded();
	randomSeeded();
	RGBtoHSV();
	rotate();
	runCrash();
	sigmoid();
	spliceIn();
	spliceOut();
	stealAudioConsent();

	tunnelData_applyProperty();
	tunnelData_handle();
	tunnelData_parseData();
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

function activateCutsceneFromTunnel(start, end, time) {
	//don't do the cutscene stuff during a challenge
	if (loading_state.constructor.name != "State_Challenge") {
		//put cutscene in the 'activated cutscenes' array
		if (!data_persistent.effectiveCutscenes.includes(end)) {
			data_persistent.effectiveCutscenes.push(end);
		}
		setTimeout(() => {
			loading_state = new State_Cutscene(eval(`cutsceneData_${end}`));
		}, 10);
	}
	
	return start;
}

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

function crumbleTileSets(tunnel, posArray) {
	posArray.forEach(p => {
		try {
			tunnel.strips[p[0]].tiles[p[1]].fallStatus = physics_crumblingShrinkTime + physics_crumblingShrinkStart - 1;
			tunnel.strips[p[0]].tiles[p[1]].propogateCrumble();
		} catch (error) {
			console.log(`Error crumbling tile with strip ${p[0]} and tile ${p[1]} at tunnel ${tunnel.id}`);
		}
		
	});
	
}

function getClosestObject(arr) {
	var item = 0;
	for (var a=1; a<arr.length; a++) {
		if (arr[a].cameraDist < arr[item].cameraDist) {
			item = a;
		}
	}
	return item;
}

function getImage(url) {
	var image = new Image();
	image.src = url;
	return image;
}

function getObjectFromID(id) {
	for (var a=0; a<world_objects.length; a++) {
		if (world_objects[a].id == id) {
			return world_objects[a];
		}
	}
}

//returns the percentage from val1 to val2 that the checkVal is in
//example: 0, 10, 5, returns 0.5)
function getPercentage(val1, val2, checkVal) {
	val2 -= val1;
	checkVal -= val1;
	return checkVal / val2;
}

function getTimeFromFrames(intFrames) {
	var timeText = ` s`;
	//seconds
	timeText = Math.floor((intFrames % 3600) / 60) + timeText;
	

	//minutes
	if (intFrames >= 3600) {
		//add 0 to seconds
		if (Math.floor((intFrames % 3600) / 60) < 10) {
			timeText = "0" + timeText;
		}
		timeText = `${Math.floor((intFrames % 216000) / 3600)}:` + timeText.substring(0, timeText.length-2);
	}
	//hours
	if (intFrames >= 216000) {
		//add 0 to minutes
		if (Math.floor((intFrames % 216000) / 3600) < 10) {
			timeText = "0" + timeText;
		}
		timeText = `${Math.floor(intFrames / 216000)}:` + timeText;
	}
	return timeText;
}






function handleAudio() {
	//first choose what audio should be
	//don't update audio target at all during cutscenes
	if (loading_state.constructor.name == "State_Cutscene") {
		return;
	}

	//set target audio to player's parent if in a gameplay state
	audio_channel1.target = undefined;
	if (loading_state.parentControlsAudio) {
		//special case for skater
		if (player.constructor.name == "Skater" && player.parentPrev.music != "None") {
			audio_channel1.target = audio_data["UnsafeSpeeds"];
			return;
		}

		//also special case for infinite mode, going by difficulty
		if (loading_state.constructor.name == "State_Infinite") {
			//songs scale with distance
			switch (Math.floor(loading_state.distance / 2000)) {
				case 0:
					audio_channel1.target = audio_data["TravelTheGalaxy"];
					return;
				case 1:
					audio_channel1.target = audio_data["LeaveTheSolarSystem"];
					return;
				case 2:
					audio_channel1.target = audio_data["WormholeToSomewhere"];
					return;
				case 3:
					audio_channel1.target = audio_data["TheVoid"];
					return;
				case 4:
					audio_channel1.target = audio_data["CrumblingWalls"];
					return;
				case 5:
				default:
					audio_channel1.target = audio_data["MapOfTheStars"];
					return;
			}
		}
		//default case
		if (loading_state.substate != 3) {
			audio_channel1.target = audio_data[player.parentPrev.music];
		}
	}
}



function HSVtoRGB(hsvObject) {
	//I don't understand most of this but it appears to work
	var compound = (hsvObject.v / 100) * (hsvObject.s / 80);
	var x = compound * (1 - Math.abs(((hsvObject.h / 60) % 2) - 1));
	var mystery = (hsvObject.v / 100) - compound;
	var RGB = [0, 0, 0];

	switch(Math.floor(hsvObject.h / 60)) {
		case 0:
			RGB = [compound, x, 0];
			break;
		case 1:
			RGB = [x, compound, 0];
			break;
		case 2:
			RGB = [0, compound, x];
			break;
		case 3:
			RGB = [0, x, compound];
			break;
		case 4:
			RGB = [x, 0, compound];
			break;
		case 5:
			RGB = [compound, 0, x];
			break;
	}

	RGB = [
		(RGB[0] + mystery) * 255, 
		(RGB[1] + mystery) * 255, 
		(RGB[2] + mystery) * 255
	];

	return RGB;
}

//performs a linear interpolation between 2 values
function linterp(a, b, percentage) {
	return a + ((b - a) * percentage);
}

function localStorage_read() {
	//turn the things in the messages section of local storage into a string that can be read into gameFlags
	var toRead = window.localStorage["run3_data"];
	try {
		toRead = JSON.parse(toRead);
	} catch (error) {
		console.log(`ERROR: could not parse ${toRead}, using default`);
		return;
	}
	

	//make sure it's somewhat safe, and then make it into the game flags
	if (typeof(toRead) == "object") {
		data_persistent = toRead;
	} else {
		console.log("ERROR: invalid type specified in save data, using default");
		return;
	}
	console.log("loaded save");
}

function localStorage_write() {
	//loop through all levels. If it's discovered, add it to the discovered array
	data_persistent.discovered = [];
	for (var a=0; a<world_objects.length; a++) {
		if (world_objects[a].discovered == true) {
			data_persistent.discovered.push(world_objects[a].id);
		}
	}
	window.localStorage["run3_data"] = JSON.stringify(data_persistent);
}

function logTime(logName) {
	times_current[logName] = [performance.now(), 0];
	if (times_past[logName] == undefined) {
		times_past[logName] = [];
	}
}

function logTimeEnd(logName, textToDisplay) {
	times_current[logName][1] = performance.now();
	times_past[logName].push(times_current[logName][1] - times_current[logName][0]);
	if (times_past[logName].length > 150) {
		var avgTime = 0;
		times_past[logName].forEach(t => {
			avgTime += t;
		});
		avgTime /= times_past[logName].length;
		console.log(`${textToDisplay}: ${avgTime.toFixed(3)} ms`);
		times_past[logName] = [];
	}
}

function modularDifference(a, b, modulo) {
	//first make sure they're both positive
	while (a < 0) {
		a += modulo;
	}
	while (b < 0) {
		b += modulo;
	}

	//get to be the smallest possible
	a %= modulo;
	b %= modulo;

	//check both sides
	return Math.min(Math.abs(a - b), Math.abs((a + modulo) - b), Math.abs((a - modulo) - b));

}

//outputs every tunnel in the world as a string
function outputWorld() {
	var output = ``;
	world_objects.forEach(w => {
		output += w.giveStringData() + "\n";
	});

	return output;
}

//outputs every tunnel with a prefix as a string
function outputTunnel(prefix) {
	var output = ``;
	var num = 1;
	while (getObjectFromID(prefix + num) != undefined) {
		output += getObjectFromID(prefix + num).giveStringData() + "\n";
		num += 1;
	}

	return output;
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

	if (mode < 9) {
		mode = 9;
	}
	switch (mode) {
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
			return powEnd;
		case 17:
			return linterp(powEnd, powStart, 0.3);
		case 18:
		default:
			return powEnd;
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
function randomBounded(min, max) {
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

	return {h: hue, s: saturation * 80, v: value};
}

function runCrash() {
	ctx.fillStyle = "#00";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	//loop through all lines
	ctx.fillStyle = "#F0F";
	for (var y=0; y<canvas.height; y++) {
		if (randomSeeded(0, 1) < 0.25) {
			ctx.fillRect(0, y, canvas.width, 1);
		}
	}

	window.cancelAnimationFrame(game_animation);
}

function sigmoid(input, lowerBound, upperBound) {
	//haha good luck reading this ;)
	return ((1 / (1+Math.pow(Math.E, -input))) + lowerBound) * (upperBound - lowerBound);
  }

function spliceIn(string, charStart, string2) {
	return string.slice(0, charStart) + string2 + string.slice(charStart, string.length);
}

function spliceOut(string, charStart, charEnd) {
	return string.slice(0, charStart) + string.slice(charEnd, string.length);
}

function stealAudioConsent(a) {
	//plays and then pauses all the audio elements. It's triggered by the first click, so the user doesn't notice, but they technically allowed the audio to play.
	if (audio_consentRequired) {
		for (var audio in audio_data) {
			audio_data[audio].play();
			audio_data[audio].pause();
			audio_data[audio].currentTime = 0;
		}
	}
}

//applies a property to a tunnel set
function tunnel_applyProperty(setPrefix, codeToExecuteSTRING) {
	var targetTunnel = getObjectFromID(`${setPrefix}1`);
	var targetNum = 2;
	while (targetTunnel != undefined) {
		eval(codeToExecuteSTRING);
		targetTunnel = getObjectFromID(`${setPrefix}${targetNum}`);
		targetNum += 1;
	}
}


function tunnelData_applyProperty(data, dataTagToApply, startLineIfAny, endLineIfAny) {
	var lines = data.split("\n");
	var newData = ``;
	//start / end line parsing
	var startLine = 0;
	var endLine = lines.length - 1;
	if (startLineIfAny != undefined) {
		startLine = startLineIfAny;
	}

	if (endLineIfAny != undefined) {
		endLine = endLineIfAny;
	}

	for (var a=startLine; a<endLine; a++) {
		lines[a] = lines[a] + "|" + dataTagToApply;
	}

	//recombine data
	for (var b=0; b<lines.length-1; b++) {
		newData += lines[b] + "\n";
	}

	return newData;
}

//takes in raw tunnel data and subdivides it into its segments (id, tunnel type information, tile information, color, etc)
function tunnelData_handle(data) {
	var rawInput = data;

	//split input using vertical separators
	var splitInput = rawInput.split("|");

	var tunnelStructure = {
		color: "", 
		id: "ERROR: name not initialized", 
		maxLen: 0, 
		music: "TravelTheGalaxy",
		power: 1, 
		functions: [], 
		sides: 0, 
		spawns: [],
		endSpawns: [],
		tileData: [], 
		tileSize: 70, 
		tilesPerSide: 0, 
		theta: 0, 
		x: 0, 
		z: 0,
		bannedCharacters: {}
	};

	//looping through all indeces of the array to classify them
	splitInput.forEach(i => {
		var splitTag = i.split("~");
		switch (splitTag[0]) {
			case "id":
				tunnelStructure.id = splitTag[1];
				break;
			case "layout-tunnel":
				//splice out the non-numbers
				var layoutNumberBits = JSON.parse("[" + splitTag[1] + "]");

				//0 is sides, 1 is tiles per side
				tunnelStructure.sides = layoutNumberBits[0];
				tunnelStructure.tilesPerSide = layoutNumberBits[1];
				break;
			case "color":
				tunnelStructure.color = "#" + splitTag[1];
				break;
			case "music":
				tunnelStructure.music = splitTag[1];
				break;
			case "tileWidth":
				tunnelStructure.tileSize = splitTag[1] * 1;
				break;
			case "trigger-z":
				
				//for power triggers
				if (splitTag[2] == "result-power") {
					//split tag will be ["trigger-z", "0", "result-power", "0.1", "smooth"]
					//the first box is the tile to trigger at, the second box is the result power, and the third box is the type of fade
					//EX [10, 0.4, "slow"]
					tunnelStructure.functions.push([splitTag[1] * 1, splitTag[3] * 1, splitTag[4]]);
				}

				//for cutscene triggers
				if (splitTag[2] == "result-cutscene") {
					//splitTag will be ["trigger-z", "number", "result-cutscene", "cutscene name"]
					tunnelStructure.functions.push([splitTag[1] * 1, splitTag[3], "cutscene"]);
				}
				break;
			case "terrain-pos":
				tunnelStructure.tileData.push(splitTag[1] + "~" + splitTag[2]);
				break;
			case "pos-x":
				tunnelStructure.x = splitTag[1] * 1;
				break;
			case "pos-z":
				tunnelStructure.z = splitTag[1] * 1;
				break;
			case "direction":
				tunnelStructure.theta = splitTag[1] * 1;
				break;
			case "spawn":
				tunnelStructure.spawns.push(splitTag[1] * 1);
				break;
			case "endSpawn":
				tunnelStructure.endSpawns.push(splitTag[1] * 1);
				break;
			case "power":
				tunnelStructure.power = splitTag[1] * 1;
				break;
			case "charRestriction":
				//split tag will be ["charRestriction", "[reason]", "character1", "character2"... etc]
				for (var i=2; i<splitTag.length; i++) {
					tunnelStructure.bannedCharacters[splitTag[i]] = splitTag[1];
				}
				break;
		}
	});

	//the tile data is incomplete, so it needs to be fixed
	//generate tunnel array
	var finalTileArray = [];

	finalTileArray[(tunnelStructure.tilesPerSide * tunnelStructure.sides) - 1] = [];
	for (var g=0; g<tunnelStructure.tilesPerSide*tunnelStructure.sides-1; g++) {
		finalTileArray[g] = [];
	}

	tunnelStructure.tileData.forEach(j => {
		var dataBit = j.split("~");
		dataBit[1] = "~" + dataBit[1];
		tunnelData_parseData(dataBit[0], finalTileArray, tunnelStructure.tilesPerSide * tunnelStructure.sides, tunnel_tileAssociation[dataBit[1]]);
	});

	tunnelStructure.tileData = finalTileArray;

	//get the tunnel length
	tunnelStructure.tileData.forEach(td => {
		tunnelStructure.maxLen = Math.max(tunnelStructure.maxLen, td.length);
	});

	//return the final data
	return tunnelStructure;
}


//takes in terrain data and returns the 2d array with different tunnel tile types
function tunnelData_parseData(toParse, tileArray, tilesInLoop, tileTypeNum) {
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
			var repeatTimes = tunnel_translation[toParse[detectorChar]];

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
		newData += ("000000" + (tunnel_translation[toParse[e]]).toString(2)).substr(-6);
	}

	//final step is to map the 1s/0s onto the tunnel array
	var posCounter = 0;
	while (posCounter < newData.length) {
		var row = posCounter % tilesInLoop;
		var column = Math.floor(posCounter / tilesInLoop);

		//if the array doesn't already have a value, put self's value in
		if (!(tileArray[row][column] > 0)) {
			tileArray[row][column] = newData[posCounter] * tileTypeNum;
		}

		posCounter += 1;
	}
}

function updateCursorPos(a) {
	var canvasArea = canvas.getBoundingClientRect();
	cursor_x = a.clientX - canvasArea.left;
	cursor_y = a.clientY - canvasArea.top;
}