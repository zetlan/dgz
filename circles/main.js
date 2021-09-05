//events
window.onload = setup;
window.addEventListener("keydown", handleKeyPress, false);
window.addEventListener("keyup", handleKeyNegate, false);
window.addEventListener("mousemove", handleMouseMove, false);
window.addEventListener("mousedown", handleMouseDown, false);
window.addEventListener("mouseup", handleMouseUp, false);


//global vars
let animation;
var animation_frameRate = 60;

var audios = {
	"welcome": new Audio(`audio/collect_your_bearings.mp3`),
	"cellular": new Audio(`audio/cellular.mp3`),
	"cellularFar": new Audio(`audio/cellular (distanced).mp3`),
	"clearAndPresent": new Audio(`audio/clear_and_present_danger.mp3`),
	"colonize": new Audio(`audio/colonizer.mp3`),
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
	y: 1.5,
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
const color_monster = "#FA0";
const color_monster_eye = "#804";
const color_orbs = ["#FFF", "#AEF", "#7FB", "#FC2", "#F70", "#E09", "#909", "#406", "#324", "#112", "#000"];
const color_player = "#868";
const color_text = "#102";

var cursor_down = false;
var cursor_x = 0;
var cursor_y = 0;

var editor_active = false;
var editor_selected = undefined;
var editor_type = 1;


var game_mode = 0;
var game_map = undefined;
var game_time = 0;

var menu_nodeSize = 0.5;
var menu_nodeStruct = [
	[`mn`, `i0`, `i1`, `i2`, `m0`],
	[`f0`, `un`, `un`, `un`, `m1`],
	[`st`, `un`, `un`, `un`, `m2`],
	[`un`, `IM`, `f2`, `f1`, `f0`]
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

var orb_animTime = 15;
var orb_opacity = 0.6;
var orb_radius = 10;

var overlay_pieRad = 0.04;
var overlay_pieMargin = 0.01;

var player;

var scan_energyCost = 1 / 80;
var scan_windowScale = [0.96, 0.95];
var scan_time = 0;
var scan_time_static = 200;

var text_buffer = "";
var text_time = 0;
var text_time_static = 200;

var transitionModeGoal = 0;
var transitionProgress = 0;
var transitionSpeed = 0;
var transitionSpeedConstant = 1 / 20;

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

	//transitions
	if (transitionSpeed != 0) {
		doTransitions();
	}


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
				//load the level on the square the player is on
				var q = menu_queue;
				menu_nodeStruct[q[q.length-1][1]][q[q.length-1][0]].load();
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
			game_data.player.ax = -1;
			break;
		case 38:
			game_data.player.ay = -1;
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
			}
		}
	}

	//final node
	if (menu_x % 1 == 0 && menu_y % 1 == 0) {
		ctx.fillStyle = menu_nodeStruct[menu_y][menu_x].bg;
		ctx.strokeStyle = menu_nodeStruct[menu_y][menu_x].completed ? color_level_completed : color_bg_menu;
		drawRoundedRectangle(drawOffset[0] + (menu_x * camera.scale) - (nSize / 2), drawOffset[1] + (menu_y * camera.scale) - (nSize / 2), nSize, nSize, canvas.height / 100);
	}

	//move player
	if (menu_queue.length > 1) {
		menu_x = easerp(menu_queue[0][0], menu_queue[1][0], menu_progress);
		menu_y = easerp(menu_queue[0][1], menu_queue[1][1], menu_progress);

		menu_progress += menu_increment * (1 + (menu_queue.length > 2));
		if (menu_progress >= 1) {
			menu_progress -= 1;
			//don't let the length go below 2 if transitioning
			if (menu_queue.length > 1 + (transitionProgress > 0)) {
				menu_queue.splice(0, 1);
			}
		}
	}

	//draw player
	ctx.fillStyle = color_energy;
	var dCoords = spaceToScreen(menu_x, menu_y);
	drawCircle(dCoords[0], dCoords[1], 5)
	ctx.fill();

	if (transitionProgress > 0) {
		ctx.globalAlpha = linterp(0, 1, transitionProgress);
		ctx.fillStyle = game_data.bg;
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
			dist = Math.sqrt(Math.pow(cursorWorldPos[0] - game_dynamicObjects[p].x, 2) + Math.pow(cursorWorldPos[1] - game_dynamicObjects[p].y, 2));
			if (dist < toReturn[0]) {
				toReturn[0] = dist;
				if (dist < monster_radius) {
					toReturn[1] = game_dynamicObjects[p];
					p = game_dynamicObjects.length;
				}
			}
		}
		
	}

	return toReturn;
}

function gameAudio() {
	if (audio_current == undefined) {
		return;
	}

	if (transitionProgress == 0 && audio_current.paused && player.energy > 0.5) {
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
	var realGameTime = (1 - player.energy) / player.energyDepleteNatural / 60;
	var realAudioTime = audio_current.currentTime / audio_levelSpeed;
	var temporalDistance = realGameTime - realAudioTime;
	//console.log(realGameTime, realAudioTime, temporalDistance);

	if (temporalDistance > 4 / 60) {
		//set to a rate that will solve the distortion in the catch up rate, or speed * 3, whichever is greater
		audio_current.playbackRate = Math.min(audio_speedBounds[1], Math.max(audio_levelSpeed * 3, audio_levelSpeed * (temporalDistance / audio_catchupTime)));
	} else if (temporalDistance > -4 / 60) {
		audio_current.playbackRate = audio_levelSpeed;
	} else {
		audio_current.playbackRate = Math.max(audio_speedBounds[0], audio_levelSpeed * 0.7);
	}
}