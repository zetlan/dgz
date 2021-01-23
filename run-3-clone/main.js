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

var editor_active = false;

let page_animation;

const color_keyPress = "#8FC";
const color_keyUp = "#666";
const color_stars = "#44A";
const color_bg = "#204";

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
					//new Tunnel(0, 0, 0, Math.PI / 4, 40, 6, 2, {h:310, s:100}, 40, []),
					new Tunnel(-20, 0, 0, 40, 6, 2, {h:310, s:100}, 9, []),
					new Tunnel_FromData(100, 100, 0, levelData_mainTunnel.split("\n")[64], []),
					]; 
	world_stars = [];

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
	//drawing background
	ctx.fillStyle = color_bg;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	

	//handling entities
	world_camera.tick();
	player.tick();

	//handling stars
	for (var c=0;c<world_stars.length;c++) {
		world_stars[c].beDrawn();
	}

	//calculating which objects should be active

	//every few ticks reorder objects
	if (world_time % 25 == 1) {
		world_objects = orderObjects(world_objects);
	}

	//order the objects of the closet tunnel for drawing
	if (world_time % 10 == 0) {
		world_objects[world_objects.length - 1].strips = orderObjects(world_objects[world_objects.length - 1].strips);
	}

	world_objects.forEach(a => {
		a.tick();
	});

	for (var a=0; a<world_objects.length - 1; a++) {
		world_objects[a].beDrawn();
	}

	//sorting player in with the closest tunnel to be drawn
	var belowStorage = [];
	var aboveStorage = [];
	world_objects[world_objects.length - 1].strips.forEach(t => {
		if (t.playerIsOnTop()) {
			belowStorage.push(t);
		} else {
			aboveStorage.push(t);
		}
	});
	belowStorage.forEach(o => {
		o.beDrawn();
	});
	player.beDrawn();
	aboveStorage.forEach(o => {
		o.beDrawn();
	});

	//crosshair
	if (editor_active) {
		drawCrosshair();
	}

	//drawing pressed keys
	ctx.fillStyle = color_keyUp;
	ctx.fillRect(canvas.width * 0.05, canvas.height * 0.95, 30, 30);
	ctx.fillRect(canvas.width * 0.1, canvas.height * 0.95, 30, 30);
	ctx.fillRect(canvas.width * 0.1, canvas.height * 0.9, 30, 30);
	ctx.fillRect(canvas.width * 0.15, canvas.height * 0.95, 30, 30);

	ctx.fillStyle = color_keyPress;
	if (controls_object.ax < 0) {
		ctx.fillRect(canvas.width * 0.05, canvas.height * 0.95, 30, 30);
	}
	if (controls_object.ax > 0) {
		ctx.fillRect(canvas.width * 0.15, canvas.height * 0.95, 30, 30);
	}

	if (controls_object.az > 0) {
		ctx.fillRect(canvas.width * 0.1, canvas.height * 0.9, 30, 30);
	}
	if (controls_object.az < 0) {
		ctx.fillRect(canvas.width * 0.1, canvas.height * 0.95, 30, 30);
	}
	

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
			controls_object.dy = controls_object.dMax;
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