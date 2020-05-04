window.onload = setup;
window.addEventListener("keydown", keyPress, false);
window.addEventListener("keyup", keyNegate, false);

//global vars
var canvas;
var ctx;
var loadingMap;
var mapSize = 150;
var pTime = 0;
var pStart ={	"x" : 0, 
				"y" : -0.99 * mapSize, 
				"z" : -0.75 * mapSize
			};

//colors
var characterColor = "#FF495C";
var ableColor = "#AAF";
var floorColor = "#CCE";
var blockColor = "#46237A";
var lnColor = "#1A074C";
var textColor = "#FCFCFC";
var buttonColor = "#3DDC97";

//objects
let camera;
let player;
let timer;
let lEditor;

//functions

function setup() {
    canvas = document.getElementById("cvsPharmacy");
	ctx = canvas.getContext("2d");
	ctx.lineWidth = 2;

    player = new Character(pStart["x"], pStart["y"], pStart["z"]);
	camera = new Camera(0, 0, -2 * mapSize, 230);	
	initMaps();
	
	loadingMap = menuMap;
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
			
			//camera controls
			//Z or K
			case 90:
			case 75:
				loadingMap.startRotation(0.05);
				break;
			//X or L
			case 88:
			case 76:
				loadingMap.startRotation(-0.05);
				break;
			//the ] key
			case 221:
				lEditor.active = true;
		}
	} else {
		//edit mode controls
		//switch statement for keys, (WASD ⇪⎇) controls position while (←↑→↓ :/)  controls size
		switch (u.keyCode) {
			//movement controls (WASD ⇪⎇)
			case 65:
				lEditor.obj.x -= lEditor.ncrmnt;
				break;
			case 87:
				lEditor.obj.z += lEditor.ncrmnt;
				break;
			case 68:
				lEditor.obj.x += lEditor.ncrmnt;
				break;
			case 83:
				lEditor.obj.z -= lEditor.ncrmnt;
				break;
			case 16:
				lEditor.obj.y -= lEditor.ncrmnt;
				break;
			case 18:
				lEditor.obj.y += lEditor.ncrmnt;
				break;
			
			
			//size controls (←↑→↓ '/)
			case 37:
				lEditor.obj.rx -= lEditor.ncrmnt;
				break;
			case 38:
				lEditor.obj.rz += lEditor.ncrmnt;
				break;
			case 39:
				lEditor.obj.rx += lEditor.ncrmnt;
				break;
			case 40:
				lEditor.obj.rz -= lEditor.ncrmnt;
				break;
			case 222:
				lEditor.obj.ry += lEditor.ncrmnt;
				break;
			case 191:
				lEditor.obj.ry -= lEditor.ncrmnt;
				break;

			
			//i, o, and backspace (i creates, o cycles, and backspace deletes the currently selected object)
			case 73:
				lEditor.createObj();
				break;
			case 79:
				lEditor.crInd += 1;
				if (lEditor.crInd > lEditor.createList.length - 1) {
					lEditor.crInd = 0;
				}
				break;
			case 8:
				lEditor.destroyObj();
				break;

			//the ] key
			case 221:
				lEditor.active = false;
				break;
			
			//cycling through which object to edit (- and +)
			case 187:
				lEditor.occupies += 1;
				if (lEditor.occupies > loadingMap.contains.length - 1) {
					lEditor.occupies = 0;
				}
				break;
			case 189:
				lEditor.occupies -= 1;
				if (lEditor.occupies < 0) {
					lEditor.occupies = loadingMap.contains.length - 1;
				}
				break;
		}
	}
}

function keyNegate(u) {
    //similar to keyPress, but slightly more complicated to make the controls feel smooth
    switch (u.keyCode) {
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
    }

}

function main() {
	//bg
	if (!loadingMap.rotating) {
		ctx.fillStyle = loadingMap.bg;
	} else {
		ctx.fillStyle = cLinterp(loadingMap.bg, loadingMap.goingMap.bg, loadingMap.rotPercent);
	}
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	

	//run object draws/ticks
	loadingMap.beRun();

	//run editor
	if (lEditor.active) {
		lEditor.tick();
		lEditor.beDrawn();
	}

	//call itself through animation frame 
	timer = window.requestAnimationFrame(main);
	pTime += 1;
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

//the transform from 3d coordinates into 2d screen coordinates
function spaceToScreen(pointArr) {
	//takes in an xyz list and outputs an xy list
	var tX = pointArr[0];
	var tY = pointArr[1];
	var tZ = pointArr[2];

	var nTX = tX;
	var nTZ = tZ;
	
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

	//step 2: divide by axis perpendicular to camera, (for this program, is always z)
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
	var finalHex = "#" + Math.floor(finR).toString(16) + Math.floor(finG).toString(16) + Math.floor(finB).toString(16);
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
function mapOutput(mapName) {
	var radianInput = 0;
	var output = "";


	//all of this gets javascript-acceptable constructors that represent the whole map
	output += mapName + " = ";
	output += loadingMap.giveEnglishConstructor();
	output += mapName + ".contains = [ \t"
	for (var h=0;h<loadingMap.contains.length;h++) {
		output += loadingMap.contains[h].giveEnglishConstructor(radianInput) 
		if (h != loadingMap.contains.length - 1) {
			output += ", \n";
			output += "\t\t\t\t\t";
		} 
	}
	output += "];"

	return output;
}

//takes the objects from the current map and clones them into a different map with an amount of offset
function cloneMap(radiansPositiveForLeft, mapToCloneTo) {

}