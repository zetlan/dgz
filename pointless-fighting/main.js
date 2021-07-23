//events
window.onload = setup;
document.addEventListener("keydown", handleKeyPress, false);
document.addEventListener("keyup", handleKeyNegate, false);

//global vars
let animation;

let ctx;
let canvas;

let camera;

const color_attackBubble = "#3872FF";
const color_background = "#226";
const color_foreground = "#64A";
const color_meter_health = "#F44";
const color_meter_stamina = "#FF4";
const color_player = "#FF66FF";
const color_sword = "#32688A";
const color_text = "#882288";

var editor_active = false;

let player;

var world_cCoords = [1, 0, 15, 12];
var world_outsideMapFade = 5;
var world_outsideMapFadeConstant = 5;
var world_squareSize = 60;
var world_time = 0;


//main functions
function setup() {
	canvas = document.getElementById("poderVase");
	ctx = canvas.getContext("2d");

	camera = new Camera(0, 0, world_squareSize);
	
	player = new Player(1, 0, color_player);
	
	maps_load();

	loading_map.entities.push(player);
	player.map = loading_map;
	animation = window.requestAnimationFrame(main);
}

function main() {
	//bege
	ctx.fillStyle = color_background;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	camera.tick();
	loading_map.tick();

	loading_map.beDrawn();
	player.beDrawn();

	//draw map (health + stamina for each)
	ctx.globalAlpha = 0.4;
	ctx.fillStyle = color_player;
	ctx.fillRect(0, 0, camera.scale, canvas.height);
	ctx.globalAlpha = 1;

	drawMeter(color_meter_health, (camera.scale / 9) * 1, canvas.height * 0.05, camera.scale / 3, canvas.height * 0.9, player.health / player.maxHealth);
	drawMeter(color_meter_stamina, (camera.scale / 9) * 5, canvas.height * 0.05, camera.scale / 3, canvas.height * 0.9, player.stamina / player.maxStamina);

	//alert if one player has won
	if (player.health < 0) {
		alert("You died.");
		return;
	}

	animation = window.requestAnimationFrame(main);
	world_time += 1;
}

function handleKeyPress(a) {
	switch (a.keyCode) {
		//player 1

		//arrow keys + /
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
		case 190:
			player.attemptAttack();
			break;
	}
}

function handleKeyNegate(a) {
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
}

function polToXY(startX, startY, angle, magnitude) {
	var xOff = magnitude * Math.cos(angle);
	var yOff = magnitude * Math.sin(angle);
	return [startX + xOff, startY + yOff];
}

function spaceToScreen(x, y) {
	return [(x - camera.cornerCoords[0]) * camera.scale, (y - camera.cornerCoords[1]) * camera.scale];
}