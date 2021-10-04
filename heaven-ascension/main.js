
window.onload = setup;
//for game
window.addEventListener("keydown", handleKeyDown, false);
window.addEventListener("keyup", handleKeyUp, false);

//for editor
window.addEventListener("mousedown", handleMouseDown, false);
window.addEventListener("mousemove", handleMouseMove, false);
window.addEventListener("mouseup", handleMouseUp, false);


//global vars
var animation;
var canvas;
var ctx;

var camera = {
	x: 0,
	y: 0,
	scale: 40,
}


var button_altPressed = false;

var cloudOpacity = 0.7;

var color_bg = "#888888";
var color_editorGrid = "#AAA";
var color_player = "#F8F";

var color_cloudDark = "#B4A4BD";
var color_cloudLight = "#D1E3E3";
var color_cloudMedium = "#A8EDED";
var color_terrainHeaven = "#DDDDFF";
var color_terrainHell = "#4D2208";
var color_terrainNeutral = "#5BB36F";
var color_rune = "#F79502";
var color_text = "#3E0363";



var cursor_x = 0;
var cursor_y = 0;
var cursor_down = false;

var editor_active = false;
var editor_selected = "0";

var entities = [];

var image_data = getImage('terrains.png');
var image_squareSize = 41;

var physics_gravity = 0.007;
var physics_friction = 0.85;
var physics_reachDistance = 2.4;

//characters
var player = new Player(11.7, 88.5);
var player_respawnPos = [9.5, 87.5];
var npcs = [
	//tutorial friendos
	new NPC(13.7, 88.6, "#000", data_interact1, 200),
	new NPC(29.39, 85.6, "#000", data_interact2, 200),
	new NPC(50.84, 80.6, "#000", [`I've heard you can use WASD and spacebar to control as well.`], 200),

	//hell dwellers
	new NPC(72.57, 88.6, "#020", [`We mostly just sit around here all day. It's quite fun.`], 150),
	new NPC(60.09, 87.6, "#020", data_interactVoid, 150),
	new NPC(5.57, 81.6, "#200", data_interactClouds, 150),

	//climb dwellers
	new NPC(36.57, 47.6, "#086", data_interactPreacher, 210),
	new NPC(45.45, 56.6, "#F2B", [`I'm a degenerate nyaa~`], 150),
	new NPC(46.51, 49.6, "#C3C", data_interactDegenerate, 200),

	new NPC(6.40, 46.6, "#FB2", data_interactFly, 130),

	//heaven dwellers
	new NPC(53.50, 12.5, "#FFF", data_interactAngel, 150),
];

var timeoutBuffer = undefined;


//functions

function setup() {
	canvas = document.getElementById("convex");
	ctx = canvas.getContext("2d");

	//switch map to a more easily editable format
	for (var a=0; a<data_map.length; a++) {
		data_map[a] = data_map[a].split("");
	}

	setCanvasPreferences();
	animation = window.requestAnimationFrame(main);
}

function main() {
	if (!editor_active) {
		//tick everything
		camera.x = player.x - (canvas.width * 0.5 / camera.scale);
		camera.y = player.y - (canvas.height * 0.5 / camera.scale);
		player.tick();
		npcs.forEach(n => {
			n.tick();
		});
	}
	entities.forEach(e => {
		e.tick();
	});

	//draw everything
	ctx.fillStyle = color_bg;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	drawMap();
	npcs.forEach(n => {
		n.beDrawn();
	});
	player.beDrawn();
	entities.forEach(e => {
		e.beDrawn();
	});

	//death overlay
	if (player.y > data_map.length) {
		var value = linterp(0, 1, (player.y - data_map.length) / 30);
		ctx.globalAlpha = Math.min(value, 1);
		ctx.fillStyle = color_terrainHell;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.globalAlpha = 1;

		if (value > 1.35) {
			player.x = player_respawnPos[0];
			player.y = player_respawnPos[1];
			player.dx = 0;
			player.dy = 0;
		}
	}

	//editor overlay
	animation = window.requestAnimationFrame(main);
}

function handleMouseDown(a) {
	cursor_down = true;
	if (editor_active) {
		placeEditorBlock();
	}
	
}

function handleMouseMove(a) {
	var canvasArea = canvas.getBoundingClientRect();
	cursor_x = a.clientX - canvasArea.left;
	cursor_y = a.clientY - canvasArea.top;

	if (cursor_down && editor_active) {
		placeEditorBlock();
	}
}

function placeEditorBlock() {
	//do not place if out of bounds
	if (cursor_x < 0 || cursor_y < 0) {
		return;
	}
	if (cursor_x > canvas.width || cursor_y > canvas.height) {
		return;
	}

	var xBlock = Math.floor(camera.x + (cursor_x / camera.scale));
	var yBlock = Math.floor(camera.y + (cursor_y / camera.scale));
	while (data_map[yBlock] == undefined) {
		data_map.push([]);
		for (var a=0; a<data_map[0].length; a++) {
			data_map[data_map.length-1].push("0");
		}
	}
	data_map[yBlock][xBlock] = editor_selected;
	for (var a=0; a<data_map[yBlock].length; a++) {
		if (data_map[yBlock][a] == undefined) {
			data_map[yBlock][a] = "0";
		}
	}
	
}

function handleMouseUp(a) {
	cursor_down = false;
}

function handleKeyDown(a) {
	if (player.constructor.name == "FreeBlock") {
		return;
	}
	switch (a.keyCode) {
		//arrow keys, for movement
		case 37:
		case 65:
			player.ax = -player.speed;
			break;
		case 38:
		case 87:
			if (player.onGround) {
				player.dy = -player.jumpStrength;
				player.onGround = false;
			}
			break;
		case 39:
		case 68:
			player.ax = player.speed;
			break;

		//Z, for picking blocks
		case 90:
		case 32:
			player.pickBlock();
			break;

		case 221:
			editor_active = !editor_active;
			if (editor_active) {
				camera.x = 0;
				camera.y = 0;
				camera.scale = 7;
				canvas.height *= 2;
			} else {
				camera.scale = 40;
				canvas.height /= 2;
			}
			break;

		case 48:
		case 49:
		case 50:
		case 51:
		case 52:
		case 53:
		case 54:
		case 55:
		case 56:
		case 57:
			editor_selected = a.keyCode - 48 + "";
			break;
	}
}

function handleKeyUp(a) {
	if (player.constructor.name == "FreeBlock") {
		return;
	}
	switch (a.keyCode) {
		case 37:
		case 65:
			player.ax = Math.max(player.ax, 0);
			break;
		case 39:
		case 68:
			player.ax = Math.min(player.ax, 0);
			break;
	}
}