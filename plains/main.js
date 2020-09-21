//houses html interactivity, setup, and main function

window.onload = setup;
window.addEventListener("keydown", handleKeyPress, false);
window.addEventListener("keyup", handleKeyNegate, false);
document.addEventListener('pointerlockchange', handleCursorLockChange, false);
document.addEventListener('mozpointerlockchange', handleCursorLockChange, false);

//global variables
var canvas;
var ctx;
var centerX;
var centerY;

var controls_cursorLock = false;
var controls_sensitivity = 100;

let page_animation;
let player;

var world_bg = "#002";
var world_starDistance = 5000;
let world_objects = [];


var render_clipDistance = 0.1;




//setup function
function setup() {
	canvas = document.getElementById("cornh");
	ctx = canvas.getContext("2d");

	//cursor movements setup
	canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;
	document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;

	canvas.onclick = function() {canvas.requestPointerLock();}

	centerX = canvas.width * 0.5;
	centerY = canvas.height * 0.5;

	player = new Player(0, 5, 0, 0, 0);

	//setting up world
	world_objects = [new Platform(0, 0, 0, 1000, 1000, "#868")];

	generateStarSphere();
	generateStaircase();

	page_animation = window.requestAnimationFrame(main);
}

function main() {
	//drawing background
	ctx.fillStyle = world_bg;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	//handling entities
	player.tick();

	for (var a=0;a<world_objects.length;a++) {
		world_objects[a].tick();
	}

	for (var b=0;b<world_objects.length;b++) {
		world_objects[b].beDrawn();
	}

	//call self
	//player.y += 0.1;
	page_animation = window.requestAnimationFrame(main);
}

//input handling
function handleKeyPress(a) {
	switch(a.keyCode) {
		//player controls
		// a/d
		case 65:
			player.ax = -1 * player.speed;
			break;
		case 68:
			player.ax = player.speed;
			break;
		// w/s
		case 87:
			player.az = player.speed;
			break;
		case 83:
			player.az = -1 * player.speed;
			break;

		//space
		case 32:
			if (player.onGround) {
				player.onGround = false;
				player.dy = 2.5;
			}
			break;

		//camera controls
		case 37:
			player.dt = -1 * player.sens;
			break;
		case 38:
			player.dp = player.sens;
			break;
		case 39:
			player.dt = player.sens;
			break;
		case 40:
			player.dp = -1 * player.sens;
			break;
	}
}

function handleKeyNegate(a) {
	switch(a.keyCode) {
		//player controls
		// a/d
		case 65:
			if (player.ax < 0) {
				player.ax = 0;
			}
			break;
		case 68:
			if (player.ax > 0) {
				player.ax = 0;
			}
			break;
		// w/s
		case 87:
			if (player.az > 0) {
				player.az = 0;
			}
			break;
		case 83:
			if (player.az < 0) {
				player.az = 0;
			}
			break;


		//camera controls
		case 37:
			if (player.dt < 0) {
				player.dt = 0;
			}
			break;
		case 38:
			if (player.dp > 0) {
				player.dp = 0;
			}
			break;
		case 39:
			if (player.dt > 0) {
				player.dt = 0;
			}
			break;
		case 40:
			if (player.dp < 0) {
				player.dp = 0;
			}
			break;
	}
}

function handleCursorLockChange() {
	if (document.pointerLockElement === canvas || document.mozPointerLockElement === canvas) {
		controls_cursorLock = true;
		document.addEventListener("mousemove", handleMouseMove, false);
	} else {
		controls_cursorLock = false;
		document.removeEventListener("mousemove", handleMouseMove, false);
	}
}

function handleMouseMove(a) {
	player.theta += a.movementX / controls_sensitivity;
	player.phi -= a.movementY / controls_sensitivity;
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
	ctx.strokeStyle = color;
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