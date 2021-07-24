//events
window.onload = setup;
window.addEventListener("keydown", handleKeyPress, false);
window.addEventListener("keyup", handleKeyNegate, false);
window.addEventListener("mousemove", handleMouseMove, false);
window.addEventListener("mousedown", handleMouseDown, false);


//global vars
let animation;

let ctx;
let canvas;

let camera;

const color_attackBubble = "#47F";
const color_background = "#226";

const color_editor_background = "#335";
const color_editor_border = "#0FF";

const color_foreground = "#64A";
const color_meter_health = "#F44";
const color_meter_stamina = "#FF4";
const color_player = "#F6F";
const color_sword = "#368";
const color_text = "#828";

var cursor_x = 0;
var cursor_y = 0;

var editor_active = false;
var editor_block = " ";
var editor_sidebarWidth = 0.2;

let loading_map;

let player;

var world_cCoords = [1, 0, 15, 12];
var world_outsideMapFade = 5;
var world_outsideMapFadeConstant = 5;
var world_squareSize = 80;
var world_time = 0;

let world_maps = {};


//main functions
function setup() {
	canvas = document.getElementById("poderVase");
	ctx = canvas.getContext("2d");

	camera = new Camera(0, 0, world_squareSize);
	
	player = new Player(1, 0, color_player);
	
	maps_load();
	animation = window.requestAnimationFrame(main);
}

function main() {
	//bege
	ctx.fillStyle = color_background;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	if (loading_map == undefined) {
		console.error(`loading map is undefined!`);
		animation = window.requestAnimationFrame(main);
		world_time += 1;
		return;
	}

	camera.tick();
	loading_map.tick();

	loading_map.beDrawn();
	player.beDrawn();

	

	//editor border
	if (editor_active) {
		drawEditorOverlay();
	} else {
		//UI overlays
		ctx.globalAlpha = 0.4;
		ctx.fillStyle = color_player;
		ctx.fillRect(0, 0, camera.scale, canvas.height);
		ctx.globalAlpha = 1;

		drawMeter(color_meter_health, (camera.scale / 9) * 1, canvas.height * 0.05, camera.scale / 3, canvas.height * 0.9, player.health / player.maxHealth);
		drawMeter(color_meter_stamina, (camera.scale / 9) * 5, canvas.height * 0.05, camera.scale / 3, canvas.height * 0.9, player.stamina / player.maxStamina);
	}

	animation = window.requestAnimationFrame(main);
	world_time += 1;
}

function handleKeyPress(a) {
	if (!editor_active) {
		switch (a.keyCode) {
			//arrow keys + z
			case 37:
				player.handleInput(false, 0);
				break;
			case 38:
				player.handleInput(false, 1);
				break;
			case 39:
				player.handleInput(false, 2);
				break;
			case 40:
				player.handleInput(false, 3);
				break;
			case 90:
				player.attemptAttack();
				break;
	
			//editor key
			case 221:
				editor_active = true;
				break;
		}
	} else {
		switch (a.keyCode) {
			case 37:
				camera.dx = -camera.speed;
				break;
			case 38:
				camera.dy = -camera.speed;
				break;
			case 39:
				camera.dx = camera.speed;
				break;
			case 40:
				camera.dy = camera.speed;
				break;

			case 221:
				editor_active = false;
				break;
		}
	}
}

function handleKeyNegate(a) {
	if (!editor_active) {
		switch (a.keyCode) {
			case 37:
				player.handleInput(true, 0);
				break;
			case 38:
				player.handleInput(true, 1);
				break;
			case 39:
				player.handleInput(true, 2);
				break;
			case 40:
				player.handleInput(true, 3);
				break;
		}
	} else {
		switch (a.keyCode) {
			case 37:
				if (camera.dx < 0) {
					camera.dx = 0;
				}
				break;
			case 38:
				if (camera.dy < 0) {
					camera.dy = 0;
				}
				break;
			case 39:
				if (camera.dx > 0) {
					camera.dx = 0;
				}
				break;
			case 40:
				if (camera.dy > 0) {
					camera.dy = 0;
				}
				break;
		}
	}
}

function handleMouseDown(a) {
	if (editor_active) {

	}
}

function handleMouseMove(a) {
	var canvasArea = canvas.getBoundingClientRect();
	cursor_x = a.clientX - canvasArea.left;
	cursor_y = a.clientY - canvasArea.top;
}

function polToXY(startX, startY, angle, magnitude) {
	var xOff = magnitude * Math.cos(angle);
	var yOff = magnitude * Math.sin(angle);
	return [startX + xOff, startY + yOff];
}

function spaceToScreen(x, y) {
	return [(x - camera.cornerCoords[0]) * camera.scale, (y - camera.cornerCoords[1]) * camera.scale];
}

function screenToSpace(x, y) {
	return [(x / camera.scale) + camera.cornerCoords[0], (y / camera.scale) + camera.cornerCoords[1]];
}