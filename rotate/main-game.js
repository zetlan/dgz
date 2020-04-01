window.onload = setup;
window.addEventListener("keydown", keyPress, false);
window.addEventListener("keyup", keyNegate, false);

//global vars
var canvas;
var ctx;
var loadingMap;
var mapSize = 150;

//colors
var characterColor = "#FF00FF";

//objects
let camera;
let player;
let timer;

//functions

function setup() {
    canvas = document.getElementById("cvsPharmacy");
	ctx = canvas.getContext("2d");

    player = new Character(0, 0, 0);
	camera = new Camera(0, 0, -2 * mapSize, 250);

	initMaps();
    loadingMap = defaultMap;
    timer = window.requestAnimationFrame(main);
}

function keyPress(u) {
    //switch statement for keys, J+L or Z+C controls camera while WASD+space or <^>⌄+space controls character
    switch (u.keyCode) {
        //player controls
        case 37:
        case 65:
			player.ax = -1;
            break;
        case 38:
        case 87:
			player.az = 1;
            break;
        case 39:
        case 68:
			player.ax = 1;
            break;
        case 40:
        case 83:
			player.az = -1;
			break;

		//space
		case 32:
			player.dy = 10;
			break;
        
        //camera controls
        //Z or J
        case 90:
        case 74:
            break;
        //C or L
        case 67:
        case 76:
			break;
			
		case 188:
			break;
		case 190: 
			break;
	}
	console.log(u.keyCode, camera.scale);
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
	//clear bg
	ctx.fillStyle = loadingMap.bg;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	//run object draws/ticks
	loadingMap.beRun();

	//call itself through animation frame 
	timer = window.requestAnimationFrame(main);

}


//helper functions

//polygon, because apparently normal javascript doesn't have that
function dPoly(xyPointsArr) {
	ctx.beginPath();
	ctx.moveTo(xyPointsArr[0][0], xyPointsArr[0][1]);
	for (var i=1;i<xyPointsArr.length;i++) {
		ctx.lineTo(xyPointsArr[i][0], xyPointsArr[i][1]);
	}
	//back to start
	ctx.lineTo(xyPointsArr[0][0], xyPointsArr[0][1]);
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
	ctx.fill();
}

//the transform from 3d coordinates into 2d screen coordinates
function spaceToScreen(pointArr) {
	//takes in an xyz list and outputs an xy list
	//step 1: make coordinates relative to camera
	var tX = pointArr[0] - camera.x;
	var tY = pointArr[1] - camera.y;
	var tZ = pointArr[2] - camera.z;

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