//globals here
window.onload = setup;
window.addEventListener("keydown", handleKeyPress, false);
window.addEventListener("keyup", handleKeyNegate, false);

//global vars
var canvas;
var ctx;
var timer;
var gameState = "menu";

var groundColor = "#22DE44";
var beachColor = "#11AE8A";
var backgroundColor = "#639BDB";
var playerColor = "#FF00FF";

var bridgeHeight;
var waterHeight;

//objectos
let loadingBridge = [];
let loadingMap = [	new Island([[0, 0], [60, 60], [40, 120]]),
					new Island([[84, 6], [30, 20], [74, 60]]),
					new Island([[115, 134], [150, 236], [134, 154]]),
					new Island([[230, 124], [170, 225], [210, 108]]),
					new Island([[300, 100], [510, 130], [380, 240]]),
					new Island([[500, 400], [520, 460], [510, 470], [480, 440]])
					];

let human;

//functions

function setup() {
	canvas = document.getElementById("cucumber");
	ctx = canvas.getContext("2d");
	ctx.lineWidth = 10;
	ctx.lineJoin = "round";

	bridgeHeight = 0.75 * canvas.height;
	waterHeight = 0.85 * canvas.height;

	human = new MenuPlayer(0, 0);

	timer = window.requestAnimationFrame(main);
}

function handleKeyPress(u) {
	switch (u.keyCode) {
		case 87:
			if (gameState == "menu") {
			gameState = "map";
			}
			break;
		case 37:
			human.ax = -1 * human.aSpeed;
			break;
		case 38:
			human.ay = -1 * human.aSpeed;
			break;
		case 39:
			human.ax = human.aSpeed;
			break;
		case 40:
			human.ay = human.aSpeed;
			break;
	}
}

function handleKeyNegate(u) {
	switch (u.keyCode) {
		case 37:
			if (human.ax < 0) {
			human.ax = 0;
			}
			break;
		case 38:
			if (human.ay < 0) {
			human.ay = 0;
			}
			break;
		case 39:
			if (human.ax > 0) {
			human.ax = 0;
			}
			break;
		case 40:
			if (human.ay > 0) {
			human.ay = 0;
			}
			break;
	}
}

function main() {
	//background
	ctx.fillStyle = backgroundColor;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	switch (gameState) {
		case "menu":
			runMenu();
			break;
		case "map":
			runMap();
			break;
		case "game":
			break;
		case "gameover":
			break;
	}

	timer = window.requestAnimationFrame(main);
}