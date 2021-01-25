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
var controls_object;
var controls_spacePressed = false;

var editor_active = false;

let page_animation;

const color_keyPress = "#8FC";
const color_keyUp = "#666";
const color_stars = "#44A";
const color_bg = "#103";
const color_map_bg = "#FEA";
const color_map_writing = "#010";

let loading_state = new State_Loading();

let world_camera;
var world_pRandValue = 1.2532;
var world_starDistance = 1500;
var world_starNumber = 500;
var world_time = 0;
let world_objects = [];
let active_objects = [];

var render_crosshairSize = 10;
var render_clipDistance = 0.1;
var render_maxColorDistance = 1000;
var render_identicalPointTolerance = 0.00001;

var haltCollision = false;




//setup function
function setup() {
	canvas = document.getElementById("cornh");
	ctx = canvas.getContext("2d");
	ctx.lineWidth = 2;
	ctx.lineJoin = "round";

	//cursor movements setup
	canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;
	document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;
	canvas.onclick = function() {
		canvas.requestPointerLock();
	}

	world_camera = new Camera(0, 8, 0, 0, 0);
	player = new Character(-60, 0, 0);

	controls_object = player;

	//setting up world
	//as a reminder, tunnels are (x, y, z, angle, tile size, sides, tiles per sides, color, length, data)
	world_objects = [
					new Tunnel_FromData(100, 100, 0, levelData_mainTunnel.split("\n")[60], []),
					]; 
	world_stars = [];

	//for (var g=0; g<64; g++) {
	//	world_objects.push(new Tunnel_FromData(0, 0, 0, levelData_mainTunnel.split("\n")[g], []));
	//}

	//high resolution slider
	document.getElementById("haveHighResolution").onchange = updateResolution;
	//if the box is already checked from a previous session update resolution to max
	if (document.getElementById("haveHighResolution").checked) {
		updateResolution();
	}

	generateStarSphere();

	//setting the player in a tunnel

	page_animation = window.requestAnimationFrame(main);
}

function main() {
	loading_state.execute();

	//call self
	world_time += 1;
	page_animation = window.requestAnimationFrame(main);
}

//input handling
function handleKeyPress(a) {
	switch(a.keyCode) {
		//direction controls
		// a/d
		case 65:
			controls_object.ax = -1 * controls_object.speed;
			break;
		case 68:
			controls_object.ax = controls_object.speed;
			break;
		// w/s
		case 87:
			controls_object.az = controls_object.speed;
			break;
		case 83:
			controls_object.az = -1 * controls_object.speed;
			break;

		//space
		case 32:
			controls_object.dy = controls_object.dMax * 4;
			controls_spacePressed = true;
			break;

		//camera controls
		case 37:
			world_camera.dt = -1 * world_camera.sens;
			break;
		case 38:
			world_camera.dp = world_camera.sens;
			break;
		case 39:
			world_camera.dt = world_camera.sens;
			break;
		case 40:
			world_camera.dp = -1 * world_camera.sens;
			break;

		//editor / noclip
		case 221:
			ctx.lineWidth = 2;
			editor_active = !editor_active;
			if (editor_active) {
				controls_object = world_camera;
			} else {
				controls_object = player;
			}
			break;
	}
}

function handleKeyNegate(a) {
	switch(a.keyCode) {
		//direction controls
		// a/d
		case 65:
			if (controls_object.ax < 0) {
				controls_object.ax = 0;
			}
			break;
		case 68:
			if (controls_object.ax > 0) {
				controls_object.ax = 0;
			}
			break;
		// w/s
		case 87:
			if (controls_object.az > 0) {
				controls_object.az = 0;
			}
			break;
		case 83:
			if (controls_object.az < 0) {
				controls_object.az = 0;
			}
			break;

		case 32:
			controls_spacePressed = false;
			break;

		//angle controls
		case 37:
			if (world_camera.dt < 0) {
				world_camera.dt = 0;
			}
			break;
		case 38:
			if (world_camera.dp > 0) {
				world_camera.dp = 0;
			}
			break;
		case 39:
			if (world_camera.dt > 0) {
				world_camera.dt = 0;
			}
			break;
		case 40:
			if (world_camera.dp < 0) {
				world_camera.dp = 0;
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
	world_camera.theta += a.movementX / controls_sensitivity;
	world_camera.phi -= a.movementY / controls_sensitivity;
	if (Math.abs(world_camera.phi) > Math.PI / 2.02) {
		if (world_camera.phi < 0) {
			world_camera.phi = Math.PI / -2.01;
		} else {
			world_camera.phi = Math.PI / 2.01;
		}
	}
}

function updateResolution() {
	var multiplier = 0.5;
	if (document.getElementById("haveHighResolution").checked) {
		multiplier = 2;
	}

	//all things necessary for switching between resolutions
	canvas.width *= multiplier;
	canvas.height *= multiplier;
	world_camera.scale *= multiplier;
}

//with default square root, 930 - 960 ms
//interesting, trig functions are slower at around 1100 - 1300 ms
function performanceTest() {
	var perfTime = [performance.now(), 0];

	for (var a=0;a<10000000;a++) {
		//part to test performance
		var value = randomSeeded(1, 10);
		var testApple = Math.cos(value);
		//var testApple = fastSqrt(value, 7);

		//constant part
		testApple *= 2;
		if (testApple > 0) {
			testApple /= 2;
		}
	}


	perfTime[1] = performance.now();
	var totalTime = perfTime[1] - perfTime[0];
	console.log(`performance test took ${totalTime} ms`);
}