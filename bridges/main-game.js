//globals here
window.onload = setup;
window.addEventListener("keydown", handleKeyPress, false);
window.addEventListener("keyup", handleKeyNegate, false);

window.onmousemove = handleMouseMove;
window.onmousedown = handleMouseDown;
window.onmouseup = handleMouseUp;

//global vars
var canvas;
var ctx;
var timer;
var gameState = "menu";

var bridgeColor = "#000000";
var bridgeStartColor = "#00FF00";
var bridgeEndColor = "#E65F5C";
var groundColor = "#22DE44";
var beachColor = "#43BD90";
var backgroundColor = "#639BDB";
var playerColor = "#FF00FF";
var editorColor = "#FF8888";

var bridgeHeight;
var waterHeight;

//objectos
let loadingBridge = [];
let loadingMap = [	new Island([[0, 0], [60, 60], [40, 120]]),
					new Island([[84, 6], [30, 20], [74, 60]]),
					new Island([[115, 134], [150, 236], [134, 154]]),
					new Island([[230, 124], [170, 225], [210, 108]]),
					new Island([[300, 100], [510, 130], [380, 240]]),
					new Island([[500, 400], [520, 460], [510, 470], [480, 440]]),

					new Bridge([[0, 0], [21, 21]], 3)
					];



let editor = {
				occupies: -1,
				object: undefined,
				point: 0
			};
		
let mouse = {
	x: 0,
	y: 0,
	down: false,
}

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
		//player controls
		case 90:
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

		//editor controls
		case 221:
			//forwards
			if (editor.occupies < loadingMap.length - 1) {
				editor.occupies += 1;
				editor.object = loadingMap[editor.occupies];
				editor.point = 0;
			} 
			break;
		case 219:
			//back
			if (editor.occupies > -1) {
				editor.occupies -= 1;
				if (editor.occupies > -1) {
					editor.object = loadingMap[editor.occupies];
				}
				editor.point = 0;
			}
			break;
	}

	//controls that only work when the editor is active
	if (editor.occupies > -1) {
		switch (u.keyCode) {
			//forwards / back from point selection
			case 187:
				editor.point += 1;
				if (editor.point > editor.object.p.length - 1) {
					editor.point = 0;
				}
				break;
			case 189:
				editor.point -= 1;
				if (editor.point < 0) {
					editor.point = editor.object.p.length - 1;
				}
				break;
			//adding / removing a point
			case 32:
				//adds a point with slightly offset coordinates from the currently selected point
				editor.object.p.splice(editor.point, 0, [editor.object.p[editor.point][0] + 5, editor.object.p[editor.point][1] + 5]);
				break;
			case 16:
				//removes the currently selected point if there is more than 1 point in the object
				if (editor.object.p.length > 1) {
					editor.object.p.splice(editor.point, 1);
					if (editor.point > editor.object.p.length - 1) {
						editor.point -= 1;
					}
				}
				break;

		}
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

function handleMouseDown(a) {
	mouse.down = true;
}

function handleMouseMove(a) {
	var canvasArea = canvas.getBoundingClientRect();
	mouse.x = Math.round(a.clientX - canvasArea.left);
	mouse.y = Math.round(a.clientY - canvasArea.top);

	//working with edit mode
	if (mouse.down && editor.occupies > -1) {
		loadingMap[editor.occupies].p[editor.point][0] = mouse.x;
		loadingMap[editor.occupies].p[editor.point][1] = mouse.y;
	}
}

function handleMouseUp(a) {
	mouse.down = false;
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