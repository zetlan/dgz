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

var editor_active = false;

let page_animation;
let player;

var world_bg = "#002";
var world_starDistance = 10000;
let world_floor;
let world_objects = [];


var render_clipDistance = 0.1;




//setup function
function setup() {
	canvas = document.getElementById("cornh");
	ctx = canvas.getContext("2d");
	ctx.lineWidth = 2;
	ctx.lineJoin = "round";

	//cursor movements setup
	canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;
	document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;

	canvas.onclick = function() {canvas.requestPointerLock();}

	centerX = canvas.width * 0.5;
	centerY = canvas.height * 0.5;

	player = new Player(0, 5, 0, 0, 0);

	//setting up world
	world_floor = new Floor(0, 0, 0, 1000, 1000, "#868");
	world_objects = [//box
					new WallX(100, 10, 0, 10, 10, "#088"), new WallX(120, 10, 0, 10, 10, "#088"),
					new WallZ(110, 10, -10, 10, 10, "#068"), new WallZ(110, 10, 10, 10, 10, "#068"),
					
					//house
					//house outside walls
					new WallZ(0, 15, -130, 50, 15, "#FB6"),
					new WallZ(0, 15, -220, 50, 15, "#FB6"),
					new WallX(50, 15, -175, 45, 15, "#EA8"),
					new WallX(-50, 25, -175, 45, 5, "#EA8"),
					new WallX(-50, 15, -200, 20, 15, "#EA8"),
					new WallX(-50, 15, -150, 20, 15, "#EA8"),

					//house stairs
					new Floor(0, 1, -140, 1, 10, "#A60"), new Floor(2, 2, -140, 1, 10, "#A60"), new Floor(4, 3, -140, 1, 10, "#A60"), new Floor(6, 4, -140, 1, 10, "#A60"), new Floor(8, 5, -140, 1, 10, "#A60"),
					new Floor(10, 6, -140, 1, 10, "#A60"), new Floor(12, 7, -140, 1, 10, "#A60"), new Floor(14, 8, -140, 1, 10, "#A60"), new Floor(16, 9, -140, 1, 10, "#A60"), new Floor(18, 10, -140, 1, 10, "#A60"),
					new Floor(20, 11, -140, 1, 10, "#A60"), new Floor(22, 12, -140, 1, 10, "#A60"), new Floor(24, 13, -140, 1, 10, "#A60"), new Floor(26, 14, -140, 1, 10, "#A60"), new Floor(28, 15, -140, 1, 10, "#A60"),
					new Floor(30, 16, -140, 1, 10, "#A60"), new Floor(32, 17, -140, 1, 10, "#A60"), new Floor(34, 18, -140, 1, 10, "#A60"), new Floor(36, 19, -140, 1, 10, "#A60"), new Floor(38, 20, -140, 1, 10, "#A60"),
					];
	world_stars = [];

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

	//ordering objects based on distance to player
	world_objects = orderObjects();

	//handling stars
	for (var c=0;c<world_stars.length;c++) {
		world_stars[c].tick();
		world_stars[c].beDrawn();
	}

	for (var a=0;a<world_objects.length;a++) {
		world_objects[a].tick();
	}
	for (var b=0;b<world_objects.length;b++) {
		world_objects[b].beDrawn();
	}

	//crosshair
	if (editor_active) {
		ctx.strokeStyle = "#AFF";
		ctx.rect(centerX - 5, centerY - 5, 10, 10);
		ctx.stroke();
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

		case 221:
			editor_active = !editor_active;
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
	if (Math.abs(player.phi) > Math.PI / 2.02) {
		if (player.phi < 0) {
			player.phi = Math.PI / -2.01;
		} else {
			player.phi = Math.PI / 2.01;
		}
	}
}