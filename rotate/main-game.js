window.onload = setup;
window.addEventListener("keydown", keyPress, false);
window.addEventListener("keyup", keyNegate, false);

//global vars
var canvas;
var ctx;
var loadingMap;
var mapSize = 150;
var pTime = 0;
var cTime = 0;
var pSpeed = 0.05;
var pStart ={	"x" : 0.99 * mapSize, 
				"y" : -0.99 * mapSize, 
				"z" : -0.99 * mapSize
			};

var cutscene = false;
var cutsceneTime = 70;

//colors
var characterColor = "#000066";
var characterOutsideColor = "#FFFFFF";

var ableColor = "#AAAAFF";
var floorColor = "#CCCCEE";
var blockColor = "#69479A";
var alphaColor = "#69995D";
var lnColor = "#1A072C";
var textColor = "#FCFCFC";
var buttonColor = "#3DDC97";
var eHighlightColor = "#FF8800";

//zone colors
var rZoneColor = "#FF5468";
var yZoneColor = "#F9FFBD";
var gZoneColor = "#70C1B3";
var bZoneColor = "#106BA0";
var eZoneColor = "#000000";

var rParticleColor = "#CC2F41";
var yParticleColor = "#FAF27F";
var gParticleColor = "#3DA673";
var bParticleColor = "#3BA5E3";

//objects
let camera;
let player;
let timer;
let lEditor;

let gameFlags = {
	atC: false,
	atEC: false,
	hasR: false,
	hasY: false,
	hasG: false,
	hasB: false,
	done: false
};

//functions

function setup() {
    canvas = document.getElementById("cvsPharmacy");
	ctx = canvas.getContext("2d");
	ctx.lineWidth = 2;

	camera = new Camera(0, 0, -2 * mapSize, 230);	
	initMaps();
	handleLocalStorage(false);
	updateMaps();
	player = new Character(pStart["x"], pStart["y"], pStart["z"]);
	
	
	lEditor = new Editor();
	timer = window.requestAnimationFrame(main);
	
}

function keyPress(u) {
	//edit mode vs normal mode
	if (!lEditor.active) {
		//normal mode controls
		//switch statement for keys, J+L or Z+C controls camera while WASD or ↑←↓→ controls character
		switch (u.keyCode) {
			//player controls
			case 37:
			case 65:
				player.ax = -0.5;
				break;
			case 38:
			case 87:
				player.az = 0.5;
				break;
			case 39:
			case 68:
				player.ax = 0.5;
				break;
			case 40:
			case 83:
				player.az = -0.5;
				break;

			//r and f
			case 82:
				player.opSpeed = player.mO;
				break;
			case 70:
				player.opSpeed = -1 * player.mO;
				break;
			
			//camera controls
			//Z and X
			case 90:
				loadingMap.startRotation(pSpeed);
				break;
			case 88:
				loadingMap.startRotation(-1 * pSpeed);
				break;
			//the ] key
			case 221:
				lEditor.active = true;
				break;
		}
	} else {
		lEditor.handleInput(u);
	}
}

function keyNegate(u) {
    //similar to keyPress, but for negation. The if statements are so the controls feel smooth.
    switch (u.keyCode) {
		//movement
        case 37:
        case 65:
			if (player.ax < 0) {
				player.ax = 0;
			}
            break;
        case 38:
        case 87:
			if (player.az > 0) {
				player.az = 0;
			}
            break;
        case 39:
        case 68:
			if (player.ax > 0) {
				player.ax = 0;
			}
            break;
        case 40:
        case 83:
			if (player.az < 0) {
				player.az = 0;
			}
			break;
		case 82:
			if (player.opSpeed == player.mO) {
				player.opSpeed = 0;
			}
			
			break;
		case 70:
			if (player.opSpeed == -1 * player.mO) {
				player.opSpeed = 0;
			}
			break;
    }

}

function main() {
	//bg
	if (!loadingMap.rotating) {
		ctx.fillStyle = loadingMap.bg;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	} else {
		try {
			ctx.fillStyle = cLinterp(loadingMap.bg, loadingMap.goingMap.bg, loadingMap.rotPercent);
		} catch (error) {
			ctx.fillStyle = cLinterp(loadingMap.bg, undefined, loadingMap.rotPercent);
		}
		var temp = ctx.globalAlpha;
		ctx.globalAlpha = 1;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.globalAlpha = temp;
	}
	
	if (cutscene == 1) {
		doCutscene();
	} else {
		if (cutscene == 2) {
			doFinalCutscene();
		}
		//regular gameplay
	
		//run object draws/ticks
		loadingMap.beRun();

		//run editor
		if (lEditor.active) {
			lEditor.tick();
			lEditor.beDrawn();
		}
	}

	//every once in a while sync with localstorage
	if (pTime % 100 == 53) {
		handleLocalStorage(true);
	}

	//call itself through animation frame 
	timer = window.requestAnimationFrame(main);
	if (!loadingMap.rotating) {
		pTime += 1;
	}
}

//cutscene function, determines cutscene graphics
function doCutscene() {
	cTime += 1;
	var drawR = canvas.height * 0.3;
	var drawX = canvas.width * 0.5;
	var drawY = canvas.height * 0.5;
	var amount = 2;

	var buffer = 20;
	
	
	//player drawing animation
	ctx.fillStyle = characterColor;
	gArc(drawX, drawY, drawR, (cTime - cutsceneTime - buffer) / cutsceneTime);
	ctx.fill();

	ctx.strokeStyle = characterOutsideColor;
	ctx.lineWidth = 20;
	gArc(drawX, drawY, drawR, cTime / cutsceneTime);
	ctx.stroke();
	

	//blue
	if (gameFlags["hasB"]) {
		ctx.fillStyle = bZoneColor;
		gArc(drawX, drawY, drawR * 0.8, (cTime - (cutsceneTime * amount) - (buffer * amount)) / cutsceneTime);
		ctx.fill();
		amount += 1;
	}

	//green
	if (gameFlags["hasG"]) {
		ctx.fillStyle = gZoneColor;
		gArc(drawX, drawY, drawR * 0.6, (cTime - (cutsceneTime * amount) - (buffer * amount)) / cutsceneTime);
		ctx.fill();
		amount += 1;
	}

	//yellow
	if (gameFlags["hasY"]) {
		ctx.fillStyle = yZoneColor;
		gArc(drawX, drawY, drawR * 0.4, (cTime - (cutsceneTime * amount) - (buffer * amount)) / cutsceneTime);
		ctx.fill();
		amount += 1;
	}

	//drawing red
	if (gameFlags["hasR"]) {
		ctx.fillStyle = rZoneColor;
		gArc(drawX, drawY, drawR * 0.2, (cTime - (cutsceneTime * amount) - (buffer * amount)) / cutsceneTime);
		ctx.fill();
		amount += 1;
	}

	//white
	if (amount == 6) {
		if (cTime - (cutsceneTime * amount) - (buffer * amount) > 0) {
			ctx.globalAlpha = (cTime - (cutsceneTime * amount) - (buffer * amount)) / cutsceneTime;
		} else {
			ctx.globalAlpha = 0;
		}
		ctx.fillStyle = characterOutsideColor;
		player.color = characterOutsideColor;
		gArc(drawX, drawY, drawR, 1);
		ctx.fill();
		ctx.globalAlpha = 1;
		amount += 1;
	}

	var endTime = (cutsceneTime * amount) + (buffer * (amount + 1));
	if (cTime > endTime) {
		//ending cutscene
		cTime = 0;
		ctx.strokeStyle = lnColor;
		ctx.lineWidth = 2;
		cutscene = false;
	}
}

function doFinalCutscene() {
	cTime += 1;

	player.beDrawn();
	var totalTime = cutsceneTime * 2;
	var percent = (cTime / totalTime) * (cTime / totalTime) * (cTime / totalTime);

	//bringing all colors closer to white
	ableColor = cLinterp(ableColor, "#FFFFFF", percent);
	floorColor = cLinterp(floorColor, "#FFFFFF", percent);
	blockColor = cLinterp(blockColor, "#FFFFFF", percent);
	alphaColor = cLinterp(alphaColor, "#FFFFFF", percent);
	lnColor = cLinterp(lnColor, "#FFFFFF", percent);
	ctx.strokeStyle = lnColor;

	if (cTime > totalTime) {
		//finishing the cutscene
		cTime = 0;
		player.dy = 4;
		loadingMap = mapE_HFinal;
		cutscene = false;
	}
}

//function for doing/redoing map changes. This is seperate from activate so that it can be called when the game starts (for localStorage support)
function updateMaps() {
	//bringing player to crossroads if it has been reached, or the start of the game if it hasn't
	loadingMap = menuMap;

	if (gameFlags["atC"]) {
		loadingMap = mapC;
	}
	if (gameFlags["atEC"]) {
		loadingMap = mapEC;
	}

	//map looping in crossroads to prevent duplicate areas
	if (gameFlags["hasR"]) {
		mapCaa.leftMap = mapCaa;
	}

	if (gameFlags["hasY"]) {
		mapCab.rightMap = mapCba;
	}

	if (gameFlags["hasG"]) {
		mapCba.leftMap = mapCba;
	}

	if (gameFlags["hasB"]) {
		mapCbb.rightMap = mapCbb;
	}

	//map blocking for the areas of crossroads if a side of crossroads has been completed
	if (gameFlags["hasR"] && gameFlags["hasY"]) {
		mapC.contains.push(new Blocker(0));
		mapC.leftMap = "NaN";
	}

	if (gameFlags["hasB"] && gameFlags["hasG"]) {
		mapC.contains.push(new Blocker(2));
		mapC.rightMap = "NaN";
	}
	
	//if all zones have been activated, lock into the beginning zone
	if (gameFlags["hasB"] && gameFlags["hasG"] && gameFlags["hasR"] && gameFlags["hasY"]) {
		gameFlags["atC"] = false;
		loadingMap = menuMap;
		mapA4.rightMap = menuMap;
	}

	//if really done, be done
	if (gameFlags["done"]) {
		loadingMap = mapE_HFinal;
		pStart["y"] = -1000;
	}
}


//helper functions

//polygon, because apparently normal javascript doesn't have that
function dPoly(xyPointsArr) {
	//shortening
	var xypa = xyPointsArr;
	ctx.beginPath();
	ctx.moveTo(xypa[0][0], xypa[0][1]);
	for (var i=1;i<xypa.length;i++) {
		ctx.lineTo(xypa[i][0], xypa[i][1]);
	}
	//back to start
	ctx.lineTo(xypa[0][0], xypa[0][1]);
	ctx.stroke();
}

//having a line draw take 2 lines of code is too annoying for me to write out
function gLine(startXYArr, endXYArr) {
	//accounting for camera offset
	ctx.beginPath();
	ctx.moveTo(startXYArr[0], startXYArr[1]);
	ctx.lineTo(endXYArr[0], endXYArr[1]);
	ctx.stroke();
}

function gPoint(x, y, size) {
	ctx.beginPath();
	ctx.ellipse(x, y, size, size, 0, 0, Math.PI * 2);
}

function gArc(x, y, size, percent) {
	if (percent < 0) {
		percent = 0;
	} else if (percent > 1) {
		percent = 1;
	}
	ctx.beginPath();
	ctx.ellipse(x, y, size, size, 0, 0, (Math.PI * 2) * percent);
}

//the transform from 3d coordinates into 2d screen coordinates
function spaceToScreen(pointArr) {
	//takes in an xyz list and outputs an xy list
	var tX = pointArr[0];
	var tY = pointArr[1];
	var tZ = pointArr[2];

	//step 0: rotate coordinates around 0, 0, 0
	//only check angle after time has passed
	if (pTime > 0) {
		var a = loadingMap.angle;
		if (a > 0 || a < 0) {
			[tX, tZ] = rotate(tX, tZ, a);
		}
	}
	
	//step 1: make coordinates relative to camera
	tX -= camera.x;
	tY -= camera.y;
	tZ -= camera.z;

	//step 2: divide by axis perpendicular to camera
	tX /= tZ;
	tY /= tZ;
	

	//step 2.5: account for camera scale
	tX *= camera.scale;

	//flipping image
	tY *= -1 * camera.scale;

	//step 3: account for screen coordinates
	tX += canvas.width / 2;
	tY += canvas.height / 2;

	return [tX, tY];
}

//rotation equation, is on one line to prevent x/z from affecting each other
function rotate(x, z, radians) {
	[x, z] = [(x * Math.cos(radians)) - (z * Math.sin(radians)), (z * Math.cos(radians)) + (x * Math.sin(radians))];
	return [x, z];
}

function getCameraDist(pointsArray3d) {

	//getting average point
	var pntAvg = avgArray(pointsArray3d)

	//making point relative to camera position
	var xAvg = pntAvg[0] -= camera.x;
	var yAvg = pntAvg[1] -= camera.y;
	var zAvg = pntAvg[2] -= camera.z;

	//getting distance (pythagorean theorum but with 3 numbers)
	var dis = Math.sqrt((xAvg * xAvg) + (yAvg * yAvg) + (zAvg * zAvg));
	return dis;
}

function gSort(arrToSort) {
	//javascript's sort is messed up if you want to sort floats, so this is the better version
	return arrToSort.sort(function (a,b) {return a - b;});
}

//simple linear interpolation function
function linterp(value1, value2, percentage) {
	return value1 + (percentage * (value2 - value1));
}

function cLinterp(color1FullHex, color2FullHex, percentage) {
	if (color1FullHex == undefined) {
		color1FullHex = "#000000";
	}
	if (color2FullHex == undefined) {
		color2FullHex = "#000000";
	}
	//converting color 1 and color 2 to RGB values rather than hex
	var r1 = parseInt(color1FullHex[1] + color1FullHex[2], 16);
	var g1 = parseInt(color1FullHex[3] + color1FullHex[4], 16);
	var b1 = parseInt(color1FullHex[5] + color1FullHex[6], 16);
	var r2 = parseInt(color2FullHex[1] + color2FullHex[2], 16);
	var g2 = parseInt(color2FullHex[3] + color2FullHex[4], 16);
	var b2 = parseInt(color2FullHex[5] + color2FullHex[6], 16);

	//performing a linear interpolation on all 3 aspects
	var finR = linterp(r1, r2, percentage);
	var finG = linterp(g1, g2, percentage);
	var finB = linterp(b1, b2, percentage);
	//converting back to hex
	var finalHex = "#" + ("0" + Math.floor(finR).toString(16)).substr(-2) + ("0" + Math.floor(finG).toString(16)).substr(-2) + ("0" + Math.floor(finB).toString(16)).substr(-2);
	return finalHex;
}


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

//outputs the current map, offset by some radians
function mapOutput(optionalMapNameSTRING) {
	var output = "";
	var mapName = "";
	if (optionalMapNameSTRING != undefined) {
		mapName = optionalMapNameSTRING;
	} else {
		mapName = loadingMap.name;
	}


	//all of this gets javascript-acceptable constructors that represent the whole map
	output += mapName + " = ";
	output += loadingMap.giveEnglishConstructor();
	output += mapName + ".contains = [ \t"
	for (var h=0;h<loadingMap.contains.length;h++) {
		output += loadingMap.contains[h].giveEnglishConstructor(0); 
		if (h != loadingMap.contains.length - 1) {
			output += ", \n";
			output += "\t\t\t\t\t";
		} 
	}
	output += "];"

	return output;
}

//takes the objects from the current map and clones them into a different map with an amount of offset
function cloneMap(cloneToLeftBOOL, mapToCloneToSTRING) {
	var mapName = mapToCloneToSTRING;
	if (typeof(mapName) != "string") {
		return "Non-string value entered for map name. Please retry.";
	}
	var rads;
	var otherExit;

	if (cloneToLeftBOOL) {
		rads = Math.PI / 2;
		try {
			otherExit = eval(mapName).leftMap;
		} catch (error) {
			otherExit = undefined;
		}
		
	} else {
		rads = Math.PI / -2;
		try {
			otherExit = eval(mapName).rightMap;
		} catch (error) {
			otherExit = undefined;
		}		
	}

	//get the constructor data for the current map rotated by the radians, and clone it into the new map
	var data = "";
	data += mapName + " = ";
	data += loadingMap.giveEnglishConstructor();

	eval (data);
	console.log(data, mapA3);

	data = "";
	data += mapName + ".contains = ["
	for (var h=0;h<loadingMap.contains.length;h++) {
		data += loadingMap.contains[h].giveEnglishConstructor(rads); 
		if (h != loadingMap.contains.length - 1) {
			data += ", ";
		} 
	}
	data += "];"

	eval(data);

	//set up a connection between the old map and the new map
	var map = eval(mapName);

	if (rads > 0) {
		loadingMap.leftMap = map;
		map.rightMap = loadingMap.name;
		map.leftMap = otherExit;
	} else {
		loadingMap.rightMap = map;
		map.leftMap = loadingMap.name;
		map.rightMap = otherExit;
	}

	map.name = mapName;

	//return the mapOutput of the new map
	return mapOutput(mapName);
}

function reset(mapToGoTo) {
	window.cancelAnimationFrame(timer);
	loadingMap = mapToGoTo;
	loadingMap.angle = 0;
	loadingMap.rotating = 0;
	lEditor = new Editor();
	window.requestAnimationFrame(main);
}

//handles reading/writing to local storage
function handleLocalStorage(writeToStorage) {
	if (writeToStorage) {
		//turn gameflags into a string that can be written to the rotate_data section
		var toWrite = gameFlags;
		toWrite = JSON.stringify(toWrite);
		//write it
		window.localStorage["rotate_data"] = toWrite;
	} else {
		//turn the things in the messages section of local storage into a string that can be read into gameFlags
		var toRead = window.localStorage["rotate_data"];
		toRead = JSON.parse(toRead);

		//make sure it's somewhat safe, and then make it into the game flags
		if (typeof(toRead) == "object") {
			gameFlags = toRead;
		} else {
			console.log("invalid type specified in localStorage --> rotate_data, defaulting to site tags")
		}
	}
}