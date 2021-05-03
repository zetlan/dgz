//houses functions of various utility
/* 
	generateStarSphere();

	addBox();
	activateCutsceneFromTunnel();
	avgArray();
	clamp();

	challenge_addEncounter();
	challenge_crumble();
	challenge_changeSpawn();

	compressCutsceneData();
	crumbleTileSets();

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
	pickNewParent();

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
	replacePlayer();
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
	tunnelData_parseDataReverse();
	tunnelData_parseStars();
*/



//generation functions
function generateAngelLines() {
	data_angelChecklist.forEach(c => {
		if (!c[3]) {
			for (var t=0; t<=checklist_stayLines; t++) {
				c[5].push(randomSeeded(0.1, 1));
			}
		}
	});
}
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
function addBox(levelID, x, y, z, size, rot) {
	var ref = getObjectFromID(levelID);
	if (ref.id == undefined) {
		console.error(`ERROR: Level ${levelID} doesn't exist!`);
		return;
	}

	//don't add if box already exists
	getObjectFromID(ref).freeObjs.forEach(f => {
		if (f.constructor.name == "PushableBox") {
			return;
		}
	});

	ref.freeObjs.push(new PushableBox(x, y, z, ref, size, rot));
}

function activateCutsceneFromEditorTunnel(start, end, time) {
	//simpler because it only applies to edit mode
	setTimeout(() => {
		var parentStorage = player.parentPrev;
		var newState = new State_Cutscene(eval(`cutsceneData_${end}`));
		newState.destinationState = loading_state;
		loading_state = newState;
		player.parentPrev = parentStorage;
	}, 10);
	return start;
}

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






function challenge_addEncounter(levelID, strip, tile, characterName, cutsceneName) {
	//loop through the free objects. If there's a character already on that strip + tile, don't add the character
	var objs = getObjectFromID(levelID).freeObjs;
	for (var f=0; f<objs.length; f++) {
		if (objs[f].strip == strip && objs[f].tile == tile) {
			return;
		}
	}
	getObjectFromID(levelID).freeObjs.push(new StaticCharacter(getObjectFromID(levelID), strip, tile, characterName, cutsceneName));
}
//respawns the player at a certain strip / tile
function challenge_changeSpawn(strip, tile) {
	var spawnObj = player.parent.strips[strip].tiles[tile];
	spawnObj.doRotationEffects(player);

	var offsetCoords = polToCart(spawnObj.normal[0], spawnObj.normal[1], 10);
	player.x = spawnObj.x + offsetCoords[0];
	player.y = spawnObj.y + offsetCoords[1];
	player.z = spawnObj.z + offsetCoords[2];
}

//crumbles different tiles
function challenge_crumble(tunnelID, posArray) {
	tunnelID = getObjectFromID(tunnelID);
	posArray.forEach(p => {
		try {
			tunnelID.strips[p[0]].tiles[p[1]].fallStatus = physics_crumblingShrinkTime + physics_crumblingShrinkStart - 1;
			tunnelID.strips[p[0]].tiles[p[1]].propogateCrumble();
		} catch (error) {
			console.log(`Error crumbling tile with strip ${p[0]} and tile ${p[1]} at tunnel ${tunnelID.id}`);
		}
		
	});
}







function changeTile(tunnel, tileCoords, newTileID) {
	var reference = getObjectFromID(tunnel);
	reference.data[tileCoords[0]][tileCoords[1]] = newTileID;
	reference.updatePosition(reference.x, reference.y, reference.z);

}


//keeps a number between certain bounds
//these operators are stupid and I hope to never use them again
function clamp(num, min, max) {
	return num <= min ? min : num >= max ? max : num;
}

function compressCutsceneData(reference) {
	//loop through all frames
	//if it's an array of objects, get string data and replace it
	for (var f=0; f<reference.frames.length; f++) {
		var arr = reference.frames[f];
		if (arr.constructor.name == "Array") {
			//camera data
			var camData = "CAM~";
			for (var a=0; a<arr[0].length-1; a++) {
				camData += arr[0][a].toFixed(4) + "~";
			}
			camData += arr[0][arr[0].length-1].toFixed(4);

			var objData = "";
			arr[1].forEach(a => {
				objData += "|" + a.giveStringData();
			});

			reference.frames[f] = camData + objData;
		}
	}
}

//generate file from editor world
function file_export() {
	//create data
	var textDat = '';

	//world objects
	editor_objects.forEach(e => {
		textDat += e.giveStringData() + "\n";
	});
	textDat += "\n";

	//spawn index
	textDat += editor_objects.indexOf(editor_spawn) + "\n";

	//cutscenes
	//loop through all cutscenes
	var cList = Object.keys(editor_cutscenes);
	cList.forEach(c => {
		compressCutsceneData(editor_cutscenes[c]);
		textDat += `\n${c}\n`;
		textDat += `${editor_cutscenes[c].id}\n`;
		textDat += `${editor_cutscenes[c].effects}\n`;

		//frames
		var frameRef = editor_cutscenes[c].frames;
		frameRef.forEach(f => {
			textDat += `${f}\n`;
		});
		textDat += "end";
	});

	var fileObj = new Blob([textDat], {type: 'text/plain'});

	//make sure a world file doesn't already exist
	if (editor_worldFile != undefined) {
		window.URL.revokeObjectURL(editor_worldFile);
	}
	editor_worldFile = window.URL.createObjectURL(fileObj);
	var link = document.getElementById('download');
	link.href = editor_worldFile;
	link.click();
}


//turn file into editor world
function file_import() {
	//people say javascript is its most awkward when it's interacting with html + other elements. I think they're right.
	var fileObj = document.getElementById('upload').files[0];
	var fileReader = new FileReader();
	fileReader.onload = function(fileLoadedEvent) {
		//function for when the text actually loads
		var worldText = fileLoadedEvent.target.result;


		//loading levels
		editor_objects = [];
		var levelToLoad = worldText.substring(0, worldText.indexOf("\n"));
		worldText = worldText.substring(worldText.indexOf("\n")+1);
		while (levelToLoad != "") {
			editor_objects.push(new Tunnel_FromData(levelToLoad));

			levelToLoad = worldText.substring(0, worldText.indexOf("\n"));
			worldText = worldText.substring(worldText.indexOf("\n")+1);
		}

		loading_state.readFrom = orderObjects(editor_objects, 6);

		//load start level
		editor_spawn = editor_objects[worldText.substring(0, worldText.indexOf("\n")) * 1];
		worldText = worldText.substring(worldText.indexOf("\n")+2);
		
		//safety
		var tolerance = 5000;
		//loading cutscenes
		worldText = worldText.split("\n");
		while (worldText.length > 0) {
			console.log("length: ", worldText.length);
			var ref = worldText[0];
			var cName = worldText[1];
			var cEffects = worldText[2];
			var cFrames = [];
			var lineCheck = 3;

			//4 + is frames, search
			while (worldText[lineCheck] != "end") {
				cFrames.push(worldText[lineCheck]);
				lineCheck += 1;

				tolerance -= 1;
				if (tolerance <= 0) {
					if (!confirm(editor_warning_file)) {
						return;
					}
				}
			}
			//push cutscene and delete from the data
			editor_cutscenes[ref] = {
				id: cName,
				effects: cEffects,
				frames: cFrames
			};
			worldText.splice(0, lineCheck+1);
		}
	};

	fileReader.readAsText(fileObj, "UTF-8");
}

function flipObject(object) {
	//takes key:value pairs and turns them into value: key pairs.
	var flipped = {};
	var keyList = Object.keys(object);
	keyList.forEach(k => {
		var val = object[k];
		if (flipped[val] == undefined) {
			flipped[val] = [];
		}
		flipped[val].push(k);
	});
	return flipped;
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

//given a dictionary of key:value pairs, returns the key of a value
function getKey(obj, value) {
	return Object.keys(obj)[Object.values(obj).indexOf(value)];
}

function getObjectFromID(id) {
	for (var a=0; a<world_objects.length; a++) {
		if (world_objects[a].id == id) {
			return world_objects[a];
		}
	}

	//to prevent errors, return an empty object if nothing is found
	//commented out because the errors get annoying.
	//console.error(`ERROR: couldn't find tunnel with id ${id}`);
	return {};
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
	//channel 2 is pretty simple, just maintain whatever you're doing if in a gameplay state and if not, set self to undefined
	//the only states accessible from the world should be map + menu, if I've missed one I'll need to fix it, but doing constructor.name is faster than instanceof
	if (loading_state.constructor.name == "State_Map" || loading_state.constructor.name == "State_Menu") {
		audio_channel2.target = undefined;
	}

	//subtitles for people with their volume off
	if (audio_channel2.audio == data_audio["Tone"] && audio_channel2.volume == 0 && text_queue.length == 0) {
		text_queue.push([undefined, `beeeep`]);
	} 



	//channel 1
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
			audio_channel1.target = data_audio["UnsafeSpeeds"];
			return;
		}

		//also special case for infinite mode, going by difficulty
		if (loading_state.constructor.name == "State_Infinite") {
			//songs scale with distance
			switch (Math.floor(loading_state.distance / 2000)) {
				case 0:
					audio_channel1.target = data_audio["TravelTheGalaxy"];
					return;
				case 1:
					audio_channel1.target = data_audio["LeaveTheSolarSystem"];
					return;
				case 2:
					audio_channel1.target = data_audio["WormholeToSomewhere"];
					return;
				case 3:
					audio_channel1.target = data_audio["TheVoid"];
					return;
				case 4:
					audio_channel1.target = data_audio["CrumblingWalls"];
					return;
				case 5:
				default:
					audio_channel1.target = data_audio["MapOfTheStars"];
					return;
			}
		}
		//default case
		if (loading_state.substate != 3) {
			audio_channel1.target = data_audio[player.parentPrev.music];
		}
	}
}


//deals with the text queue at the bottom of the screen
function handleTextDisplay() {
	//only do if things in the queue
	if (text_queue.length > 0) {
		drawCharacterText();

		//choosing text
		if (loading_state.substate == 0) {
			text_time -= 1;
			if (text_time == 0) {
				text_time = text_timeMax;
				text_queue.splice(0, 1);
			}
		}
	}
}



function HSVtoRGB(hsvObject) {
	//I don't understand most of this but it appears to work
	var compound = hsvObject.v * (hsvObject.s / 80);
	var x = compound * (1 - Math.abs(((hsvObject.h / 60) % 2) - 1));
	var mystery = hsvObject.v - compound;
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
		Math.floor((RGB[0] + mystery) * 255), 
		Math.floor((RGB[1] + mystery) * 255), 
		Math.floor((RGB[2] + mystery) * 255)
	];

	var RGBString = "";
	var tempStr = "";
	RGB.forEach(colorPart => {
		tempStr = colorPart.toString(16);
		if (tempStr.length == 1) {
			tempStr = "0" + tempStr;
		}
		RGBString += tempStr;
	});


	return RGBString;
}

function isValidString(str) {
	return (str != null && str != undefined && str != "");
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

	var settingStorage = data_persistent.settings;
	

	//make sure it's somewhat safe, and then make it into the game flags
	if (typeof(toRead) == "object") {
		data_persistent = toRead;
	} else {
		console.log("ERROR: invalid type specified in save data, using default");
		return;
	}

	if (data_persistent.settings == undefined) {
		data_persistent.settings = settingStorage;
		console.log("ERROR: invalid settings recieved, using default");
	}

	//update settings
	audio_channel1.volume = data_persistent.settings.volume;
	if (data_persistent.settings.highResolution) {
		updateResolution();
	}
	ctx.imageSmoothingEnabled = data_persistent.settings.antiAlias;

	//canvas stuff
	ctx.lineWidth = 2;
	ctx.lineJoin = "round";
	ctx.lineCap = "round";
	console.log("loaded save");
}

function localStorage_write() {
	//loop through all levels. If it's discovered, add it to the discovered list
	data_persistent.discovered = "";
	for (var a=0; a<world_objects.length; a++) {
		if (world_objects[a].discovered == true) {
			data_persistent.discovered += "~"+world_objects[a].id;
		}
	}
	data_persistent.discovered = data_persistent.discovered.substring(1);
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
	while (getObjectFromID(prefix + num).id != undefined) {
		output += getObjectFromID(prefix + num).giveStringData() + "\n";
		num += 1;
	}

	return output;
}

//picks a new parent tunnel for free objects, given an old one
function pickNewParent(object, oldParent) {
	var reqDist = getDistance(object, oldParent);
	for (var a=0; a<world_objects.length; a++) {
		if (world_objects[a] != oldParent) {
			if (getDistance(object, world_objects[a]) < reqDist) {
				oldParent = world_objects[a];
				reqDist = getDistance(object, world_objects[a]);
			}
		}
	}
	return oldParent;
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

//replaces the current player with a new player object, with all the same properties that matter
function replacePlayer(characterIDNum) {
	var playerStore = player;
	var str = `new ${data_characters.indexes[characterIDNum]}(player.x, player.y, player.z);`
	player = eval(str);
	player.dx = playerStore.dx;
	player.dy = playerStore.dy;
	player.dz = playerStore.dz;

	player.dir_down = playerStore.dir_down;
	player.dir_side = playerStore.dir_side;
	player.dir_front = playerStore.dir_front;

	player.parent = playerStore.parentPrev;
	player.parentPrev = playerStore.parentPrev;
}

//does a reset without the player for all tunnels
function resetAllTunnels() {
	world_objects.forEach(t => {
		if (t.freeObjs.length > 0) {
			t.resetWithoutPlayer();
		}
	});
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
	ctx.globalAlpha = 0.8;
	ctx.fillStyle = "#000";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	//loop through all lines
	ctx.fillStyle = "#F0F";
	for (var y=0; y<canvas.height; y++) {
		if (randomSeeded(0, 1) < 0.25) {
			ctx.fillRect(0, y, canvas.width, 1);
		}
	}

	window.cancelAnimationFrame(page_animation);
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
		for (var audio in data_audio) {
			data_audio[audio].play();
			data_audio[audio].pause();
			data_audio[audio].currentTime = 0;
		}
		audio_consentRequired = false;
	}
}

//applies a property to a tunnel set
function tunnel_applyProperty(setPrefix, codeToExecuteSTRING) {
	var targetTunnel = getObjectFromID(`${setPrefix}1`);
	var targetNum = 2;
	while (targetTunnel.id != undefined) {
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
				//0 is sides, 1 is tiles per side
				tunnelStructure.sides = splitTag[1] * 1;
				tunnelStructure.tilesPerSide = splitTag[2] * 1;
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
			case "terrain":
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
	toParse = tunnelData_parseStars(toParse);

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

function tunnelData_parseDataReverse(tileDataArray) {
	//helpful numbers
	var numOfTiles = Object.keys(tunnel_tileAssociation).length;


	//helpful units of storage
	var dataString = "";
	var stringRegister2 = "";
	var dataLists = [];

	//step 1: convert tunnel array to sets of 1s / 0s
	
	//loop through possible values, create array index
	//doing this loop backwards makes it faster
	for (var n=numOfTiles-1; n>-1; n--) {
		dataLists[n] = "";
	}

	//loop through possible values again, this time search through the tunnel data to see tiles of that type
	for (var n=0; n<numOfTiles; n++) {
		for (var tile=0; tile<tileDataArray[0].length; tile++) {
			for (var strip=0; strip<tileDataArray.length; strip++) {
				//add a 0 or 1 string based on whether the tile is there or not
				dataLists[n] += "" + (1 * (tileDataArray[strip][tile] == (n+1)));
			}
		}
	}


	//step 2: convert binary data into b64 data
	for (var q=0; q<dataLists.length; q++) {
		stringRegister2 = "";


		//only append to final if it's got a tile in it
		if (dataLists[q] * 1 != 0) {
			//go through each set of binary numbers, turn into a b64 character, then remove them. After the whole set has been done put the b64 string back into the list
			while (dataLists[q].length > 0) {
				stringRegister2 += getKey(tunnel_translation, parseInt(dataLists[q].substring(0, 6), 2));
				dataLists[q] = dataLists[q].substring(6);
				//if only zeroes are left, escape early
				if (dataLists[q] * 1 == 0) {
					dataLists[q] = "";
					
				}
			}
			//step 3: add stars while we're at it
			dataLists[q] = tunnelData_parseStarsReverse(stringRegister2);

			//step 4: append data to final array
			dataString += `|terrain~${dataLists[q]}`;
			//if it's a special tile, mark that
			if (q > 0) {
				dataString += getKey(tunnel_tileAssociation, q+1);
			}
		}
	}

	//step 5: return
	return dataString;
}

function tunnelData_parseStars(toParse) {
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
	return toParse;
}

function tunnelData_parseStarsReverse(toParse) {
	var strStore = "";
	var strFinal = "";
	var repeatTimes = 0;
	var repeatLimit = 0;
	//go through all the characters
	while (toParse.length > 0) {
		//repeat for all the stars
		for (var starNum=1; starNum<=tunnel_dataStarChainMax; starNum++) {
			//get initial check value
			strStore = toParse.substring(0, starNum);

			//jump through and detect how many times that value repeats
			while (strStore == toParse.substring(repeatTimes * starNum, (repeatTimes + 1) * starNum)) {
				repeatTimes += 1;
			}

			//cap repeatTimes at 63, I don't want undefined characters in my data
			if (repeatTimes > 63) {
				repeatTimes = 63;
			}

			//if there's only 1 star, it must repeat 4+ times. 2 stars requires 3 repeats, and 3+ stars requires only 2 repeats
			switch (starNum) {
				case 1:
					repeatLimit = 3;
					break;
				default:
					repeatLimit = 2;
					break;
			}

			//if repeated enough, use the stars and leave the loop. if not, move to the next star number
			if (repeatTimes > repeatLimit) {
				//append to final string
				strFinal += strStore;
				for (var s=0; s<starNum; s++) {
					strFinal += "*";
				}
				if (getKey(tunnel_translation, repeatTimes) == undefined) {
					console.log(repeatTimes);
				}
				strFinal += getKey(tunnel_translation, repeatTimes);
				//update toParse and leave star loop
				toParse = toParse.substring(starNum * repeatTimes);
				starNum = tunnel_dataStarChainMax + 1;
			} else if (starNum == tunnel_dataStarChainMax) {
				//if out of star numbers, remove and add the single character
				strFinal += toParse[0];
				toParse = toParse.substring(1);
			}

			//reset things to default
			repeatTimes = 0;
		}
	}
	return strFinal;
}

function updateCursorPos(a) {
	var canvasArea = canvas.getBoundingClientRect();
	cursor_x = a.clientX - canvasArea.left;
	cursor_y = a.clientY - canvasArea.top;
}