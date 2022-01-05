//events
window.onload = setup;
window.addEventListener("keydown", handleKeyPress, false);
window.addEventListener("keyup", handleKeyNegate, false);
window.addEventListener("mousemove", handleMouseMove, false);
window.addEventListener("mousedown", handleMouseDown, false);
window.addEventListener("mouseup", handleMouseUp, false);
window.addEventListener('visibilitychange', handleVisibilityChange, false);


//global vars
let animation;
var animation_frameRate = 60;

var audios = {
	"welcome": new Audio(`audio/collect_your_bearings.mp3`),
	"cellular": new Audio(`audio/cellular.mp3`),
	"cellularFar": new Audio(`audio/cellular (distanced).mp3`),
	"clearAndPresent": new Audio(`audio/clear_and_present_danger.mp3`),
	"colonize": new Audio(`audio/colonizer.mp3`),
	"ether": new Audio(`audio/cresting_ether_slow.mp3`), 
	"fanfare": new Audio(`audio/congratulations.mp3`),
};
var audio_current = undefined;
var audio_levelSpeed = 1;
var audio_catchupTime = 0.5;
var audio_speedBounds = [0.08, 15];

var button_altPressed = false;

let ctx;
let canvas;

var camera = {
	x: 2,
	y: 2,
	scale: 200,
	parallax: 0.5,
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

const color_energy = "#F8F";
const color_level_completed = "#0C4";
const color_menuCursor = "#F0F";
const color_monster = "#FA0";
const color_monster_eye = "#804";
const color_orbs = ["#FFF", "#AEF", "#7FB", "#FC2", "#F70", "#E09", "#909", "#406", "#324", "#112", "#000"];
const color_player = "#868";
const color_text = "#102";

var cursor_down = false;
var cursor_x = 0;
var cursor_y = 0;

var data_persistent = {
	lvl: -1,
	vol: 4,
	res: 1,
	tut: false
}

var editor_active = false;
var editor_selected = undefined;
var editor_radius = 10;
var editor_type = 1;


var game_isFocused = true;
var game_mode = 0;
var game_map = undefined;
var game_time = 0;

var menu_levelOrder = [
	levels_i0, levels_i1, levels_i2,
	levels_f0, levels_f1, levels_f2,
	levels_m0, levels_m1, levels_m2,
	levels_e0, levels_e1, levels_en
];
var menu_nodeSize = 0.5;
var menu_nodeStruct = [
	[`st`, `i0`, `i1`, `i2`, `f0`],
	[`un`, `un`, `un`, `un`, `f1`],
	[`un`, `m2`, `m1`, `m0`, `f2`],
	[`un`, `e0`, `un`, `un`, `un`],
	[`un`, `e1`, `en`, `un`, `un`]
]
//turn readable nodeStruct into computable nodeStruct
for (var a=0; a<menu_nodeStruct.length; a++) {
	for (var b=0; b<menu_nodeStruct[a].length; b++) {
		menu_nodeStruct[a][b] = eval(`levels_${menu_nodeStruct[a][b]}`);
	}
}
var menu_x = 0;
var menu_y = 0;
var menu_queue = [[menu_x, menu_y]];
var menu_progress = 0;
var menu_increment = 1 / 20;


var overlay_pieRad = 0.04;
var overlay_pieMargin = 0.01;

var radius_monster = 13;

var scan_energyCost = 1 / 80;
var scan_windowScale = [0.96, 0.95];
var scan_time = 0;
var scan_time_static = 200;

var text_buffer = "";
var text_height_game = 0.96;
var text_height_menu = 0.82;
var text_size = 1 / 25;
var text_time = 0;
var text_time_static = 200;

var transitionModeGoal = 0;
var transitionProgress = 0;
var transitionSpeed = 0;
var transitionSpeedConstant = 1 / 20;

var tutorial = {
	texts: [
		`use the arrow keys or WASD to move`,
		`press space to scan the area`,
		`press enter to revist completed zones`
	],
	hasDone: [
		false, 
		false,
		false
	]
}


//main functions
function setup() {
	canvas = document.getElementById("poderVase");
	ctx = canvas.getContext("2d");
	setCanvasPreferences();
	localStorage_read();
	updateSettings();

	animation = window.requestAnimationFrame(main);
}

function main() {
	//only do the main game loop if the window is focused
	if (game_isFocused) {
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
	
		//transitions
		if (transitionSpeed != 0) {
			doTransitions();
		}
	}

	//push to localStorage
	if (game_time % 150 == 0) {
		localStorage_write();
	}

	animation = window.requestAnimationFrame(main);
	game_time += 1;
}

function handleKeyPress(a) {
	if (game_mode == 0) {
		//in the menu
		switch (a.keyCode) {
			case 37:
			case 65:
				menuMove([-1, 0]);
				break;
			case 38:
			case 87:
				menuMove([0, -1]);
				break;
			case 39:
			case 68:
				menuMove([1, 0]);
				break;
			case 40:
			case 83:
				menuMove([0, 1]);
				break;
			case 13:
				//load the level on the square the player is on
				var q = menu_queue;
				menu_nodeStruct[q[q.length-1][1]][q[q.length-1][0]].load();
				tutorial.hasDone[2] = true;
				break;
			case 221:
				for (var a=0; a<menu_nodeStruct.length; a++) {
					for (var b=0; b<menu_nodeStruct[a].length; b++) {
						if (menu_nodeStruct[a][b] != undefined) {
							menu_nodeStruct[a][b].completed = true;
						}
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
			ctx.lineWidth = 2;
		} else {
			camera.scale = camera_scale_game;
			setCanvasPreferences();
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
		case 65:
			game_map.playerObj.ax = -1;
			break;
		case 38:
		case 87:
			game_map.playerObj.ay = -1;
			break;
		case 39:
		case 68:
			game_map.playerObj.ax = 1;
			break;
		case 40:
		case 83:
			game_map.playerObj.ay = 1;
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
				game_map.reset();
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
	if (game_mode == 0) {
		return;
	}
	var player = game_map.playerObj;
	switch (a.keyCode) {
		case 37:
		case 65:
			player.ax = Math.max(player.ax, 0);
			break;
		case 38:
		case 87:
			player.ay = Math.max(player.ay, 0);
			break;
		case 39:
		case 68:
			player.ax = Math.min(player.ax, 0);
			break;
		case 40:
		case 83:
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
		if (editor_selected == undefined && minObjDist > editor_radius * 1.99) {
			if (editor_type == -1) {
				game_map.dynamics.push(new game_map.monsterClass(Math.round(cursorWP[0]), Math.round(cursorWP[1])));
				return;
			}
			game_map.statics.push(new Orb(Math.round(cursorWP[0]), Math.round(cursorWP[1]), editor_type));
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
				if (storeArr[0] < editor_radius) {
					var index = game_map.statics.indexOf(storeArr[1]);
					if (index != -1) {
						game_map.statics.splice(index, 1);
					} else {
						game_map.dynamics.splice(game_map.dynamics.indexOf(storeArr[1]), 1);
					}
					
				}
			} else {
				if (editor_type == -1) {
					return;
				}
				//create a new orb if far away enough and not pressing alt
				if (storeArr[0] > editor_radius * 1.99) {
					game_map.statics.push(new Orb(Math.round(movePos[0]), Math.round(movePos[1]), editor_type));
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

function handleVisibilityChange(a) {
	game_isFocused = document.visibilityState == "visible";
	if (document.visibilityState == "visible") {
		//switching into the tab
		if (game_mode == 1) {
			if (audio_current != undefined) {
				audio_current.play();
			}
		}
	} else {
		//switching out of the tab
		if (game_mode == 1) {
			//in game mode, pause audio if it's playing
			if (audio_current != undefined) {
				audio_current.pause();
			}
		}
	}
}














function doGameState() {
	if (transitionProgress == 0) {
		game_map.tick();
	}
	game_map.beDrawn();
	gameAudio();
}

function doMenuState() {
	//bg
	ctx.fillStyle = color_bg_menu;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

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

				drawRoundedRectangle(drawOffset[0] + (x * camera.scale) - (nSize / 2), drawOffset[1] + (y * camera.scale) - (nSize / 2), nSize, nSize, canvas.height / 100);
				ctx.fill();
				ctx.stroke();
			}
		}
	}

	//final node
	if (menu_x % 1 == 0 && menu_y % 1 == 0) {
		ctx.fillStyle = menu_nodeStruct[menu_y][menu_x].bg;
		ctx.strokeStyle = menu_nodeStruct[menu_y][menu_x].completed ? color_level_completed : color_bg_menu;
		drawRoundedRectangle(drawOffset[0] + (menu_x * camera.scale) - (nSize / 2), drawOffset[1] + (menu_y * camera.scale) - (nSize / 2), nSize, nSize, canvas.height / 100);
		ctx.fill();
		ctx.stroke();
	}

	menuAnimateMovement();
	drawTutorialText();

	//draw player
	ctx.strokeStyle = color_menuCursor;
	var dCoords = spaceToScreen(menu_x, menu_y);
	var r = canvas.height / 50;
	ctx.beginPath();
	ctx.lineTo(dCoords[0] + r, dCoords[1]);
	ctx.lineTo(dCoords[0], dCoords[1] - r);
	ctx.lineTo(dCoords[0] - r, dCoords[1]);
	ctx.lineTo(dCoords[0], dCoords[1] + r);
	ctx.lineTo(dCoords[0] + r, dCoords[1]);
	ctx.lineTo(dCoords[0], dCoords[1] - r);
	ctx.stroke();

	if (transitionProgress > 0) {
		ctx.globalAlpha = linterp(0, 1, transitionProgress);
		ctx.fillStyle = game_map.bg;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.globalAlpha = 1;
	}
}

function doTransitions() {
	transitionProgress += transitionSpeed;
	if (transitionProgress >= 1) {
		transitionProgress = 1;
		transitionSpeed = -transitionSpeedConstant;
		game_mode = transitionModeGoal;
	}

	if (transitionProgress < 0) {
		transitionProgress = 0;
		transitionSpeed = 0;
	}
}

//uses cursor position to get an object and the distance to the closest object
function editorSelectObject() {
	var cursorWorldPos = screenToSpace(cursor_x, cursor_y);
	var toReturn = [1e1001, undefined];
	var dist;
	for (var p=0; p<game_map.statics.length; p++) {
		dist = Math.sqrt(Math.pow(cursorWorldPos[0] - game_map.statics[p].x, 2) + Math.pow(cursorWorldPos[1] - game_map.statics[p].y, 2));
		if (dist < toReturn[0]) {
			toReturn[0] = dist;
			if (dist < game_map.statics[p].r) {
				toReturn[1] = game_map.statics[p];
				p = game_map.statics.length;
			}
		}
	}

	//dynamic objects as well
	for (var p=0; p<game_map.dynamics.length; p++) {
		dist = Math.sqrt(Math.pow(cursorWorldPos[0] - game_map.dynamics[p].x, 2) + Math.pow(cursorWorldPos[1] - game_map.dynamics[p].y, 2));
		if (dist < toReturn[0]) {
			toReturn[0] = dist;
			if (dist < game_map.dynamics[p].r) {
				toReturn[1] = game_map.dynamics[p];
				p = game_map.dynamics.length;
			}
		}
	}

	return toReturn;
}

function gameAudio() {
	if (audio_current == undefined) {
		return;
	}

	if (transitionProgress == 0 && audio_current.paused && game_map.playerObj.energy > 0.5) {
		audio_current.play();
		audio_current.playbackRate = audio_levelSpeed;
	}

	//adjust volume for fade out
	if (transitionProgress > 0) {
		audio_current.volume = 1 - transitionProgress;
		if (transitionProgress >= 1 - transitionSpeed) {
			audio_current.volume = 1;
			audio_current.currentTime = 0;
			audio_current.pause();
			return;
		}
	}

	//adjust audio playback speed for alignment
	var realGameTime = (1 - game_map.playerObj.energy) / game_map.playerObj.energyDepleteNatural / 60;
	var realAudioTime = audio_current.currentTime / audio_levelSpeed;
	var temporalDistance = realGameTime - realAudioTime;
	//console.log(realGameTime, realAudioTime, temporalDistance);

	if (temporalDistance > 4 / 60) {
		//set to a rate that will solve the distortion in the catch up rate, or speed * 3, whichever is greater
		audio_current.playbackRate = Math.min(audio_speedBounds[1], Math.max(audio_levelSpeed * 3, audio_levelSpeed * (temporalDistance / audio_catchupTime)));
	} else if (temporalDistance > -4 / 60) {
		audio_current.playbackRate = audio_levelSpeed;
	} else {
		audio_current.playbackRate = Math.max(audio_speedBounds[0], Math.min(audio_levelSpeed * 0.75, audio_levelSpeed * (audio_catchupTime / (-1 * temporalDistance))));
	}
}

function menuAnimateMovement() {
	if (menu_queue.length < 2) {
		return;
	}
	//move player
	menu_x = easerp(menu_queue[0][0], menu_queue[1][0], menu_progress);
	menu_y = easerp(menu_queue[0][1], menu_queue[1][1], menu_progress);

	menu_progress += menu_increment * (1 + (menu_queue.length > 2));
	//don't need to do anything else if not finishing a section
	if (menu_progress < 1) {
		return;
	}
	//if transitioning, don't allow for running out of areas
	if (menu_queue.length < 3 && transitionProgress > 0) {
		menu_progress = 1 - menu_increment;
		return;
	}

	//don't let the length go below 2 regularly
	menu_progress -= 1;
	if (menu_queue.length > 1) {
		menu_queue.splice(0, 1);
	}
}