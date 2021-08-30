//events
window.onload = setup;
window.addEventListener("keydown", handleKeyPress, false);
window.addEventListener("keyup", handleKeyNegate, false);
window.addEventListener("mousemove", handleMouseMove, false);
window.addEventListener("mousedown", handleMouseDown, false);
window.addEventListener("mouseup", handleMouseUp, false);


//global vars
let animation;

var button_altPressed = false;

let ctx;
let canvas;

var camera = {
	x: 2,
	y: 0,
	scale: 200,
	parallax: 0.2,
	limitX: 600,
	limitY: 600,
}
var camera_menuCoords = [camera.x, camera.y];
var camera_scale_game = 4;
var camera_scale_menu = 200;

const color_bg_menu = "#197";

const color_editor_border = "#FFF";
const color_editor_orb = "#F00";
const color_editor_selection = "#8F8";

const color_level_completed = "#0C4";
const color_monster = "#FA0";
const color_monster_eye = "#804";
const color_orbs = ["#FFF", "#AEF", "#7FB", "#FC2", "#F70", "#E09", "#909", "#406", "#324", "#112", "#000"];
const color_player = "#F8F";
const color_text = "#102";

var cursor_down = false;
var cursor_x = 0;
var cursor_y = 0;

var editor_active = false;
var editor_selected = undefined;
var editor_type = 1;


var game_mode = 0;
var game_data = undefined;
var game_staticObjects = [];
var game_dynamicObjects = [];
var game_time = 0;

var menu_nodeSize = 0.5;
var menu_nodeStruct = [
	[`un`, `un`, `i0`, `i1`, `i2`],
	[`un`, `un`, `IM`, `un`, `m0`],
	[],
]
//turn readable nodeStruct into computable nodeStruct
for (var a=0; a<menu_nodeStruct.length; a++) {
	for (var b=0; b<menu_nodeStruct[a].length; b++) {
		menu_nodeStruct[a][b] = eval(`levels_${menu_nodeStruct[a][b]}`);
	}
}
var menu_x = 2;
var menu_y = 0;
var menu_lastPos = [menu_x, menu_y];
var menu_nextPos = [menu_x, menu_y];
var menu_progress = 0;
var menu_increment = 1 / 30;

var monster_radius = 13;


var orb_animTime = 15;
var orb_opacity = 0.6;
var orb_radius = 10;

var overlay_pieRad = 0.04;
var overlay_pieMargin = 0.01;

var player;

var scan_alertWidth = 10;
var scan_energyCost = 1 / 50;
var scan_windowScale = [0.96, 0.95];
var scan_time = 0;
var scan_time_static = 200;

var text_buffer = "";
var text_time = 0;
var text_time_static = 200;

var tutorial = {
	texts: [
		`use the arrow keys or WASD to move`,
		`press space to scan the area`
	],
	hasDone: [
		false, 
		false
	]
}


//main functions
function setup() {
	canvas = document.getElementById("poderVase");
	ctx = canvas.getContext("2d");
	setCanvasPreferences();

	player = new Player(0, 0);
	game_dynamicObjects.push(player);

	animation = window.requestAnimationFrame(main);
}

function main() {
	switch (game_mode) {
		case 0:
			//menu
			doMenuState();
			break;
		case 1:
			//gaime
			doGameState();
			break;
	}

	//draw text if necessary
	drawTutorialText();


	animation = window.requestAnimationFrame(main);
	game_time += 1;
}

function handleKeyPress(a) {
	if (game_mode == 0) {
		//in the menu
		switch (a.keyCode) {
			case 37:
				menuMove([-1, 0]);
				break;
			case 38:
				menuMove([0, -1]);
				break;
			case 39:
				menuMove([1, 0]);
				break;
			case 40:
				menuMove([0, 1]);
				break;
			case 13:
				if (game_mode == 0) {
					//in menu, try to enter a map
					if (menu_x % 1 == 0 && menu_y % 1 == 0) {
						loadMap(menu_nodeStruct[menu_y][menu_x]);
					}
				}
				break;
		}
		return;
	}




	if (a.keyCode == 221) {
		editor_active = !editor_active;
		if (editor_active) {
			camera.scale = 0.7;
		} else {
			camera.scale = camera_scale_game;
		}
		return;
	}

	//in the main game
	if (editor_active) {
		if (a.keyCode > 48 && a.keyCode < 58) {
			editor_type = a.keyCode - 48;
			return;
		}
		if (a.keyCode == 192) {
			//-1 is for monsters
			editor_type = -1;
		}
	}

	switch (a.keyCode) {
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
		//space
		case 32:
			scanWorld();
			break;

		case 18:
			button_altPressed = true;
			break;

		//enter, +, and -
		case 13:
			if (editor_active) {
				game_staticObjects.forEach(o => {
					o.layersCurrent = o.layers;
				});
			}
			break;
		case 173:
			camera.scale = 1;
			break;
		case 61:
			camera.scale = 4;
			break;
	}
}

function handleKeyNegate(a) {
	switch (a.keyCode) {
		case 37:
			player.ax = Math.max(player.ax, 0);
			break;
		case 38:
			player.ay = Math.max(player.ay, 0);
			break;
		case 39:
			player.ax = Math.min(player.ax, 0);
			break;
		case 40:
			player.ay = Math.min(player.ay, 0);
			break;

		case 18:
			button_altPressed = false;
			break;
	}
}

function handleMouseDown(a) {
	cursor_down = true;

	if (editor_active) {
		//alt click will deselect object 
		if (button_altPressed == true) {
			editor_selected = undefined;
			return;
		}

		//regular click will either select object or create new object
		var cursorWP = screenToSpace(cursor_x, cursor_y);
		var minObjDist;
		[minObjDist, editor_selected] = editorSelectObject();

		//if one isn't selected, create a new object
		if (editor_selected == undefined && minObjDist > orb_radius * 1.99) {
			if (editor_type == -1) {
				game_dynamicObjects.push(new Monster(Math.round(cursorWP[0]), Math.round(cursorWP[1])));
				return;
			}
			game_staticObjects.push(new Orb(Math.round(cursorWP[0]), Math.round(cursorWP[1]), editor_type));
		}
	}
}

function handleMouseMove(a) {
	var canvasArea = canvas.getBoundingClientRect();
	cursor_x = a.clientX - canvasArea.left;
	cursor_y = a.clientY - canvasArea.top;


	if (editor_active && cursor_down) {
		var movePos = screenToSpace(cursor_x, cursor_y);

		if (editor_selected == undefined) {
			var storeArr = editorSelectObject();
			if (button_altPressed) {
				//destroy an orb if close enough
				if (storeArr[0] < orb_radius) {
					var index = game_staticObjects.indexOf(storeArr[1]);
					if (index != -1) {
						game_staticObjects.splice(index, 1);
					} else {
						game_dynamicObjects.splice(game_dynamicObjects.indexOf(storeArr[1]), 1);
					}
					
				}
			} else {
				if (editor_type == -1) {
					return;
				}
				//create a new orb if far away enough and not pressing alt
				if (storeArr[0] > orb_radius * 1.99) {
					game_staticObjects.push(new Orb(Math.round(movePos[0]), Math.round(movePos[1]), editor_type));
				}
			}
		} else {
			//move the existing orb
			editor_selected.x = Math.round(movePos[0]);
			editor_selected.y = Math.round(movePos[1]);

			if (editor_selected.homeX != undefined) {
				editor_selected.homeX = editor_selected.x;
				editor_selected.homeY = editor_selected.y;
			}
		}
	}

	
}

function handleMouseUp(a) {
	cursor_down = false;
}














function doGameState() {
	//bg
	ctx.fillStyle = game_data.bg;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	//player + camera
	game_dynamicObjects.forEach(s => {
		s.tick();
	});
	
	if (canvas.width / camera.scale < camera.limitX * 2 && canvas.height / camera.scale < camera.limitY * 2) {
		camera.x = clamp(player.x * (1 - camera.parallax), -camera.limitX + (canvas.width * 0.5 / camera.scale), camera.limitX - (canvas.width * 0.5 / camera.scale));
		camera.y = clamp(player.y * (1 - camera.parallax), -camera.limitY + (canvas.height * 0.5 / camera.scale), camera.limitY - (canvas.height * 0.5 / camera.scale));
	} else {
		camera.x = 0;
		camera.y = 0;
	}
	

	game_dynamicObjects.forEach(d => {
		d.beDrawn();
	});


	//world
	game_staticObjects.forEach(o => {
		o.tick();
		o.beDrawn();
	});

	//edge boxes
	if (editor_active) {
		var boxStart = spaceToScreen(-camera.limitX, -camera.limitY);
		var boxEnd = spaceToScreen(camera.limitX, camera.limitY);

		if (Math.max(boxStart[0], boxStart[1]) > 0 || boxEnd[0] < canvas.width || boxEnd[1] < canvas.height) {
			ctx.globalAlpha = 1;
			ctx.strokeStyle = color_editor_border;
			ctx.beginPath();
			ctx.rect(boxStart[0], boxStart[1], boxEnd[0] - boxStart[0], boxEnd[1] - boxStart[1]);
			ctx.stroke();
		}
	}


	//UI - energy pie

	//UI - scan arrows
	drawScanResults();


	//exit
	var maxLayers = 0;
	game_staticObjects.forEach(s => {
		maxLayers = Math.max(maxLayers, s.layersCurrent);
	});
	if (maxLayers == 0) {
		loadMenu();
	}
}

function doMenuState() {
	//bg
	ctx.fillStyle = color_bg_menu;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.lineWidth = canvas.height / 240;
	//map nodes
	var drawOffset = spaceToScreen(0, 0);
	var nSize = camera.scale * menu_nodeSize;
	for (var y=0; y<menu_nodeStruct.length; y++) {
		for (var x=0; x<menu_nodeStruct[y].length; x++) {
			//don't draw if invisible or player won't show up, because player's node is drawn at the end
			if (menu_nodeStruct[y][x] != undefined && (y != menu_y || x != menu_x)) {
				//color node
				ctx.fillStyle = menu_nodeStruct[y][x].bg;
				ctx.strokeStyle = menu_nodeStruct[y][x].completed ? color_level_completed : color_bg_menu;


				//position + size
				drawRoundedRectangle(drawOffset[0] + (x * camera.scale) - (nSize / 2), drawOffset[1] + (y * camera.scale) - (nSize / 2), nSize, nSize, canvas.height / 100);
			}
		}
	}

	//final node
	if (menu_x % 1 == 0 && menu_y % 1 == 0) {
		ctx.fillStyle = menu_nodeStruct[menu_y][menu_x].bg;
		drawRoundedRectangle(drawOffset[0] + (menu_x * camera.scale) - (nSize / 2), drawOffset[1] + (menu_y * camera.scale) - (nSize / 2), nSize, nSize, canvas.height / 100);
	}

	//move player
	if (menu_lastPos[0] != menu_nextPos[0] || menu_lastPos[1] != menu_nextPos[1]) {
		menu_progress += menu_increment;
		if (menu_progress >= 1) {
			menu_progress = 0;
			menu_lastPos = menu_nextPos;
		}
		menu_x = easerp(menu_lastPos[0], menu_nextPos[0], menu_progress);
		menu_y = easerp(menu_lastPos[1], menu_nextPos[1], menu_progress);
	}

	//draw player
	ctx.fillStyle = color_player;
	var dCoords = spaceToScreen(menu_x, menu_y);
	drawCircle(dCoords[0], dCoords[1], 5)
	ctx.fill();
}

//uses cursor position to get an object and the distance to the closest object
function editorSelectObject() {
	var cursorWorldPos = screenToSpace(cursor_x, cursor_y);
	var toReturn = [1e1001, undefined];
	var dist;
	for (var p=0; p<game_staticObjects.length; p++) {
		dist = Math.sqrt(Math.pow(cursorWorldPos[0] - game_staticObjects[p].x, 2) + Math.pow(cursorWorldPos[1] - game_staticObjects[p].y, 2));
		if (dist < toReturn[0]) {
			toReturn[0] = dist;
			if (dist < orb_radius) {
				toReturn[1] = game_staticObjects[p];
				p = game_staticObjects.length;
			}
		}
	}

	//dynamic objects as well
	for (var p=0; p<game_dynamicObjects.length; p++) {
		if (game_dynamicObjects[p] != player) {
			dist = Math.sqrt(Math.pow(cursorWorldPos[0] - game_staticObjects[p].x, 2) + Math.pow(cursorWorldPos[1] - game_staticObjects[p].y, 2));
			if (dist < toReturn[0]) {
				toReturn[0] = dist;
				if (dist < monster_radius) {
					toReturn[1] = game_staticObjects[p];
					p = game_staticObjects.length;
				}
			}
		}
		
	}

	return toReturn;
}


function exportMap() {
	var toReturn = {
		bg: game_data.bg,
		contents: {}, 
		time: -1
	};

	//time

	//orbs
	game_staticObjects.forEach(u => {
		//push each orb into the contents array
		if (toReturn.contents[u.layers] == undefined) {
			toReturn.contents[u.layers] = [];
		}
		toReturn.contents[u.layers].push([u.x, u.y]);
	});

	//monsters
	game_dynamicObjects.forEach(u => {
		if (u != player) {
			if (toReturn.contents["M"] == undefined) {
				toReturn.contents["M"] = [];
			}
			toReturn.contents["M"].push([u.homeX, u.homeY]);
		}
	});

	var finalString = JSON.stringify(toReturn);
	finalString = finalString.replaceAll(`"`, ``);
	console.log(finalString);
}

//turns map data into a loading map
function loadMap(mapDat) {
	//bg
	game_data = mapDat;

	//convert data into objects
	for (var a=1; a<10; a++) {
		if (mapDat.contents[a] != undefined) {
			mapDat.contents[a].forEach(e => {
				game_staticObjects.push(new Orb(e[0], e[1], a));
			});
		}
	}

	//monsters
	if (mapDat.contents["M"] != undefined) {
		mapDat.contents["M"].forEach(e => {
			game_dynamicObjects.push(new Monster(e[0], e[1]));
		});
	}

	//time?

	//finish transition
	game_mode = 1;
	camera.scale = camera_scale_game;
}

function loadMenu() {
	camera.scale = camera_scale_menu;
	camera.x = camera_menuCoords[0];
	camera.y = camera_menuCoords[1];
	game_mode = 0;
}

//handles move inputs in the menu
function menuMove(moveArr) {
	var squareVal;
	try {
		squareVal = menu_nodeStruct[menu_nextPos[1] + moveArr[1]][menu_nextPos[0] + moveArr[0]];
	} catch (er) {
		//squareVal will remain undefined
	}
	if (squareVal != undefined) {
		menu_lastPos = [menu_x, menu_y];
		menu_progress = 0;
		menu_nextPos[0] += moveArr[0];
		menu_nextPos[1] += moveArr[1];
	}
}

//interpolates between the positions of two map nodes, given a direction
function nodeterp(node1, node2, directionINT, percentage) {
	return [node2.x, node2.y];
}

//boolean function, returns true if there are orbs on screen
function orbsAreOnScreen() {
	for (var h=0; h<game_staticObjects.length; h++) {
		if (orbIsOnScreen(game_staticObjects[h])) {
			return true;
		}
	}
	return false;
}

//boolean function, returns true if an orb is on screen
function orbIsOnScreen(orb) {
	return (Math.abs(orb.x - camera.x) < canvas.height * scan_windowScale[1] / camera.scale / 2 || Math.abs(orb.y - camera.y) < canvas.width * scan_windowScale[0] / camera.scale / 2);
}

function polToXY(startX, startY, angle, magnitude) {
	var xOff = magnitude * Math.cos(angle);
	var yOff = magnitude * Math.sin(angle);
	return [startX + xOff, startY + yOff];
}

function scanWorld() {
	player.energy -= scan_energyCost;
	scan_time = scan_time_static;
}




function screenToSpace(x, y) {
	return [((x - (canvas.width / 2)) / camera.scale) + camera.x, ((y - (canvas.height / 2)) / camera.scale) + camera.y];
}

function setCanvasPreferences() {
	ctx.lineWidth = 3;
	ctx.lineCap = "butt";
	ctx.textBaseline = "middle";
}

function spaceToScreen(x, y) {
	return [((x - camera.x) * camera.scale) + canvas.width / 2, ((y - camera.y) * camera.scale) + canvas.height / 2];
}

