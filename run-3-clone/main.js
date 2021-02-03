//houses html interactivity, setup, and main function

window.onload = setup;
window.addEventListener("keydown", handleKeyPress, false);
window.addEventListener("keyup", handleKeyNegate, false);

//global variables
var canvas;
var ctx;
var centerX;
var centerY;

var controls_cursorLock = false;
var controls_sensitivity = 100;
var controls_object;
var controls_spacePressed = false;

var physics_jumpTime = 30;
var physics_jumpInitial = 2.9;
var physics_jumpBoost = 0.1;
var physics_graceTime = 5;
var physics_graceTimeRamp = 15;

//bg is in 6 hex numbers for  p r e c i s i o n
const color_bg = "#100026";
const color_character = "#888";
const color_editor_border = "#F8F";
const color_editor_cursor = "#0FF";
const color_ice = "#EFF";
const color_keyPress = "#8FC";
const color_keyUp = "#666";
const color_map_bg = "#FEA";
const color_map_writing = "#010";
const color_stars = "#44A";
const color_text = "#424";
const color_text_bright = "#FAF";

var cursor_x = 0;
var cursor_y = 0;
var cursor_down = false;

var editor_active = false;
var editor_changingTheta = false;
var editor_selected = undefined;
var editor_clickTolerance = 5;
var editor_snapTolerance = 5;
var editor_thetaCircleRadius = 60;
var editor_thetaKnobRadius = 10;

let loading_state = new State_Loading();

var map_cameraHeight = 175000;

let page_animation;

var tunnel_transitionLength = 200;
var tunnel_voidWidth = 200;
var tunnel_bufferTiles = 4;
var tunnel_powerFunctions = {
	"instant": power_instant,
	"smooth": power_smooth,
	"slowSmooth": power_slowSmooth,
	"fast": power_fast,
	"slow": power_slow,
	"glimpse": power_glimpse,
	"falseAlarm": power_falseAlarm,
	"notSoFalseAlarm": power_notSoFalseAlarm,
	"undefined": power_fast
};

let world_camera;
var world_pRandValue = 1.2532;
var world_starDistance = 1500;
var world_starNumber = 500;
var world_time = 0;
let world_objects = [];
let active_objects = [];

var render_crosshairSize = 10;
var render_clipDistance = 0.1;
var render_maxColorDistance = 1000;
var render_minTileSize = 9;
var render_identicalPointTolerance = 0.0001;
var render_tunnelTextTime = 50;

var times_current = {};
var times_past = {};

var haltCollision = false;




//setup function
function setup() {
	canvas = document.getElementById("cornh");
	ctx = canvas.getContext("2d");
	ctx.lineWidth = 2;
	ctx.lineJoin = "round";

	//cursor movements setup
	document.addEventListener("mousemove", handleMouseMove, false);
	document.addEventListener("mousedown", handleMouseDown, false);
	document.addEventListener("mouseup", handleMouseUp, false);

	world_camera = new Camera(0, 8, 0, 0, 0);
	player = new Character(-60, 0, 0);

	controls_object = player;

	//setting up world
	//as a reminder, tunnels are (x, y, z, angle, tile size, sides, tiles per sides, color, length, data)
	world_objects = []; 
	world_stars = [];

	console.log("hi");

	//high resolution slider
	document.getElementById("haveHighResolution").onchange = updateResolution;
	//if the box is already checked from a previous session update resolution to max
	if (document.getElementById("haveHighResolution").checked) {
		updateResolution();
	}

	generateStarSphere();

	//setting the player in a tunnel

	page_animation = window.requestAnimationFrame(main);
}

function main() {
	loading_state.execute();

	//call self
	world_time += 1;
	page_animation = window.requestAnimationFrame(main);
}

//input handling
function handleKeyPress(a) {
	switch(a.keyCode) {
		//direction controls
		// a/d
		case 65:
			controls_object.ax = -1 * controls_object.speed;
			break;
		case 68:
			controls_object.ax = controls_object.speed;
			break;
		// w/s
		case 87:
			controls_object.az = controls_object.speed;
			break;
		case 83:
			controls_object.az = -1 * controls_object.speed;
			break;

		//escape
		case 27:
			loading_state = new State_Map();
			break;

		//space
		case 32:
			if (!controls_spacePressed) {
				controls_object.handleSpace();
			}
			controls_spacePressed = true;
			break;

		//camera controls
		case 37:
			world_camera.dt = -1 * world_camera.sens;
			break;
		case 38:
			world_camera.dp = world_camera.sens;
			break;
		case 39:
			world_camera.dt = world_camera.sens;
			break;
		case 40:
			world_camera.dp = -1 * world_camera.sens;
			break;

		//editor / noclip
		case 221:
			ctx.lineWidth = 2;
			editor_active = !editor_active;
			if (editor_active) {
				controls_object = world_camera;
			} else {
				controls_object = player;
			}
			break;
	}
}

function handleKeyNegate(a) {
	switch(a.keyCode) {
		//direction controls
		// a/d
		case 65:
			if (controls_object.ax < 0) {
				controls_object.ax = 0;
			}
			break;
		case 68:
			if (controls_object.ax > 0) {
				controls_object.ax = 0;
			}
			break;
		// w/s
		case 87:
			if (controls_object.az > 0) {
				controls_object.az = 0;
			}
			break;
		case 83:
			if (controls_object.az < 0) {
				controls_object.az = 0;
			}
			break;

		case 32:
			controls_spacePressed = false;
			break;

		//angle controls
		case 37:
			if (world_camera.dt < 0) {
				world_camera.dt = 0;
			}
			break;
		case 38:
			if (world_camera.dp > 0) {
				world_camera.dp = 0;
			}
			break;
		case 39:
			if (world_camera.dt > 0) {
				world_camera.dt = 0;
			}
			break;
		case 40:
			if (world_camera.dp < 0) {
				world_camera.dp = 0;
			}
			break;
	}
}

function handleMouseDown(a) {
	if (editor_active) {
		cursor_down = true;

		var canvasArea = canvas.getBoundingClientRect();
		
		if (editor_selected != undefined) {
			var knobCoords = [editor_selected.map_startCoords[0] + (editor_thetaCircleRadius * Math.cos(editor_selected.theta)), editor_selected.map_startCoords[1] - (editor_thetaCircleRadius * Math.sin(editor_selected.theta))];

			//if colliding with the theta change circle, do that stuff
			if (getDistance2d(knobCoords, [Math.round(a.clientX - canvasArea.left), Math.round(a.clientY - canvasArea.top)]) < editor_thetaKnobRadius) {
				editor_changingTheta = true;
				var diffX = Math.round(a.clientX - canvasArea.left) - cursor_x;
				var diffY = -1 * (Math.round(a.clientY - canvasArea.top) - cursor_y);
				editor_selected.theta = (Math.atan2(diffY, diffX) + (Math.PI * 2)) % (Math.PI * 2);
				editor_selected.updatePosition([editor_selected.x, editor_selected.y, editor_selected.z]);
			} else {
				editor_changingTheta = false;
				editor_selected = undefined;
			}
		} else {
			//update cursor position
			cursor_x = Math.round(a.clientX - canvasArea.left);
			cursor_y = Math.round(a.clientY - canvasArea.top);

			//modifying regular tunnels

			//loop through all world objects, if one is close enough, make it the selected one
			for (var a=0; a<world_objects.length; a++) {
				if (getDistance2d(world_objects[a].map_circleCoords, [cursor_x, cursor_y]) < editor_clickTolerance) {
					editor_selected = world_objects[a];
					cursor_x = world_objects[a].map_circleCoords[0];
					cursor_y = world_objects[a].map_circleCoords[1];
					a = world_objects.length + 1;
				}
			}
		}
	} else {
		//going into the level that's selected
		if (loading_state instanceof State_Map && loading_state.levelSelected != undefined) {
			//ordering all the objects
			world_objects.forEach(u => {
				u.getCameraDist();
			});
			world_objects = orderObjects(world_objects, 8);
			player.parentPrev = loading_state.levelSelected;
			loading_state = new State_Game();
			player.parentPrev.reset();

			//displaying text
			loading_state.text = player.parentPrev.id;
			loading_state.time = render_tunnelTextTime;
		}
	}
}

function handleMouseUp(a) {
	cursor_down = false;
}

function handleMouseMove(a) {
	var canvasArea = canvas.getBoundingClientRect();

	if (editor_active) {
		if (cursor_down && editor_selected != undefined) {
			if (editor_changingTheta) {
				//update selected tunnel direction
				var diffX = Math.round(a.clientX - canvasArea.left) - cursor_x;
				var diffY = -1 * (Math.round(a.clientY - canvasArea.top) - cursor_y);
				editor_selected.theta = (Math.atan2(diffY, diffX) + (Math.PI * 2)) % (Math.PI * 2);
				editor_selected.updatePosition([editor_selected.x, editor_selected.y, editor_selected.z]);
				cursor_x = editor_selected.map_circleCoords[0];
				cursor_y = editor_selected.map_circleCoords[1];
			} else {
				//moving the tunnel
				cursor_x = Math.round(a.clientX - canvasArea.left);
				cursor_y = Math.round(a.clientY - canvasArea.top);

				var snapX = cursor_x;
				var snapY = cursor_y;

				//if a tunnel end is close enough to the tunnel start, snap the tunnel to that position
				var startSelectOffset = [editor_selected.map_startCoords[0] - editor_selected.map_circleCoords[0], editor_selected.map_startCoords[1] - editor_selected.map_circleCoords[1]];
				//calculating tunnel end pos
				for (var a=0; a<world_objects.length; a++) {
					if (world_objects[a] != editor_selected) {
						var endPos = world_objects[a].map_endCoords;
						if (getDistance2d([endPos[0], endPos[1]], [snapX + startSelectOffset[0], snapY + startSelectOffset[1]]) < editor_snapTolerance) {
							//moving position of selection
							//get difference between tunnel start coordinates and selected coordinates
							snapX = endPos[0] - startSelectOffset[0];
							snapY = endPos[1] - startSelectOffset[1];
						}
					}
				}

				//update selected tunnel position
				if (editor_selected != undefined) {
					var offset = [editor_selected.map_startCoords[0] - editor_selected.map_circleCoords[0], editor_selected.map_startCoords[1] - editor_selected.map_circleCoords[1]];
					var newCoords = screenToSpace([snapX + offset[0], snapY + offset[1]], map_cameraHeight);
					editor_selected.updatePosition(newCoords);
				}
			}
		}
	} else {
		if (loading_state instanceof State_Map) {
			//if mousing over a level, set the ID to the display text
			var testX = Math.round(a.clientX - canvasArea.left);
			var testY = Math.round(a.clientY - canvasArea.top);

			//resetting both text and position
			loading_state.levelSelected = undefined;
			loading_state.cursorPos = [-100, -100];

			//if a tunnel end is close enough, snap the tunnel to that position
			//calculating tunnel end pos
			for (var a=0; a<world_objects.length; a++) {
				if (world_objects[a] != editor_selected) {
					var tunnelPos = world_objects[a].map_circleCoords;
					if (getDistance2d([tunnelPos[0], tunnelPos[1]], [testX, testY]) < editor_snapTolerance) {
						loading_state.cursorPos = tunnelPos;
						loading_state.levelSelected = world_objects[a];
						a = world_objects.length + 1;
					}
				}
			}
		}
	}
}

function updateResolution() {
	var multiplier = 0.5;
	if (document.getElementById("haveHighResolution").checked) {
		multiplier = 2;
	}

	//all things necessary for switching between resolutions
	canvas.width *= multiplier;
	canvas.height *= multiplier;
	world_camera.scale *= multiplier;
}

/* results:
	performing 10,000,000 square roots on random numbers from 1 to 4000 took from 930 - 960 ms
	this is slightly faster than the same number of sin, cos, and tan operations, at 1100-1300 ms

	performing 100,000 spaceToRelative functions with a variable declaration took 218 - 228 ms
	performing the same number of spaceToRelative functions with the variable declaration removed took 210-211 ms,
	

	TL;DR-
	square roots are slow, but faster than trig functions
	variable declarations take time, but aren't the end of the world


*/
function performanceTest() {
	var perfTime = [performance.now(), 0];

	for (var a=0;a<100000;a++) {
		//part to test performance
		var value = spaceToRelative([Math.random() * 60, Math.random() * 60, Math.random() * 60], [8, 8, 8], [1, 0.4, 0]);

		//constant part
		value *= 2;
		if (value > 0) {
			value /= 2;
		}
	}


	perfTime[1] = performance.now();
	var totalTime = perfTime[1] - perfTime[0];
	console.log(`performance test took ${totalTime} ms`);
}