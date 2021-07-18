//events
window.onload = setup;
document.addEventListener("keydown", handleKeyPress, false);
document.addEventListener("keyup", handleKeyNegate, false);

//global vars
let animation;

let ctx;
let canvas;

const color_background = "#226";
const color_player1 = "#FF66FF";
const color_player2 = "#66FF66";
const color_sword = "#32688A";

let player1;
let player2;

var world_cCoords = [1, 0, 19, 15];
var world_sqSize = 32;


//main functions
function setup() {
	canvas = document.getElementById("poderVase");
	ctx = canvas.getContext("2d");

	player1 = new Player(0, 00, color_player1);
	player2 = new Player(800, 500, color_player2);
	animation = window.requestAnimationFrame(main);
}

function main() {
	//bege
	ctx.fillStyle = color_background;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	//draw players
	player1.tick();
	player1.beDrawn();

	player2.tick();
	player2.beDrawn();

	//draw map (health + stamina for each)

	animation = window.requestAnimationFrame(main);
}

function handleKeyPress(a) {
	switch (a.keyCode) {
		//player 1

		//arrow keys + /
		case 37:
			player.ax = -1;
			break;
		case 38:
			player.ay = -1;
			break;
		case 39:
			player.ax = 1;
			break;
		case 40:
			player.ay = 1;
			break;
		case 191:
			player.attemptAttack();
			break;


		//player 2
		//SEFD + A
		case 83:
			player.ax = -1;
			break;
		case 69:
			player.ay = -1;
			break;
		case 70:
			player.ax = 1;
			break;
		case 68:
			player.ay = 1;
			break;
		case 65:
			player.attemptAttack();
			break;
	}
}

function handleKeyNegate(a) {
	switch (a.keyCode) {
		case 37:
			if (player.ax < 0) {
				player.ax = 0;
			}
			break;
		case 38:
			if (player.ay < 0) {
				player.ay = 0;
			}
			break;
		case 39:
			if (player.ax > 0) {
				player.ax = 0;
			}
			break;
		case 40:
			if (player.ay > 0) {
				player.ay = 0;
			}
			break;
	}
}

function polToXY(startX, startY, angle, magnitude) {
	var xOff = magnitude * Math.cos(angle);
	var yOff = magnitude * Math.sin(angle);
	return [startX + xOff, startY + yOff];
}