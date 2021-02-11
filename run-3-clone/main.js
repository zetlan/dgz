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

var physics_conveyorStrength = 0.05;
var physics_crumblingShrinkStart = 50;
var physics_crumblingShrinkTime = 150;
var physics_gravity = 0.13;
var physics_jumpTime = 30;
var physics_graceTime = 5;
var physics_graceTimeRamp = 15;

//bg is in 6 hex numbers for  p r e c i s i o n
const color_bg = "#100026";
const color_character = "#888";
const color_editor_border = "#F8F";
const color_editor_cursor = "#0FF";
const color_grey_dark = "#888";
const color_grey_light = "#CCC";
const color_grey_lightest = "#FEF";
const color_ice = "#EFF";
const color_keyPress = "#8FC";
const color_keyUp = "#666";
const color_map_bg = "#FEA";
const color_map_writing = "#010";
const color_menuSelectionOutline = "#88F";
const color_stars = "#44A";
const color_text = "#424";
const color_text_bright = "#FAF";

var cursor_x = 0;
var cursor_y = 0;
var cursor_down = false;

//var data_possibleCharacters = [`Runner`, `Skater`, `Lizard`, `Bunny`, `Gentleman`, `Duplicator`, `Child`, `Pastafarian`, `Student`, `Angel`];
var data_characters = [`Runner`,`Bunny`, `Child`, `Angel`];
var data_;


var data_levelSets = [`mainTunnel`, `boxStorage`, `wayBack`, `winterGames`, `lowPower`, 
						`A`, `B`, `D`, `F`, `G`, `I`, `L`, `M`, `N`, `T`, `U`, `W`];

var data_sprites = {
	spriteSize: 144,

	Angel: {
		sheet: 'images/angelSprites.png',
		frameTime: 2.2,
		back: [[0, 2]],
		front: [[]],
		jumpForwards: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0]],
		jumpSideways: [[0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1]],
		walkForwards: [[0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2],
					   [0, 3], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3], [7, 3]],
		walkSideways: [[0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4], [7, 4],
						[0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5], [6, 5], [7, 5]],
	},

	Bunny: {
		sheet: 'images/bunnySprites.png',
		frameTime: 2.2,
		back: [[0, 0]],
		front: [[10, 0]],
		jumpForwards: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0]],
		jumpSideways: [[0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1]]
	},

	Child: {
		sheet: 'images/childSprites.png',
		frameTime: 2.1,
		back: [[0, 3]],
		front: [[]],
		jumpForwards: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0]],
		jumpLeft: [[0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1]],
		jumpRight: [[0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2]],
		walkForwards: [[0, 3], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3], [7, 3],
					   [0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4], [7, 4]],
		walkLeft: [[0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5], [6, 5], [7, 5],
						[0, 6], [1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [6, 6], [7, 6]],
		walkRight: [[0, 7], [1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7], [7, 7],
						[0, 8], [1, 8], [2, 8], [3, 8], [4, 8], [5, 8], [6, 8], [7, 8]],
	},

	Runner: {
		sheet: 'images/runnerSprites.png',
		frameTime: 2.3,
		back: [[0, 2]],
		front: [[]],
		jumpForwards: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0]],
		jumpSideways: [[0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1]],
		walkForwards: [[0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2],
					   [0, 3], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3], [7, 3]],
		walkSideways: [[0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4], [7, 4],
						[0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5], [6, 5], [7, 5]],
	}
};

var data_persistent = {
	discovered: []
};

var editor_active = false;
var editor_changingTheta = false;
var editor_selected = undefined;
var editor_clickTolerance = 5;
var editor_snapTolerance = 5;
var editor_thetaCircleRadius = 60;
var editor_thetaKnobRadius = 10;

var infinite_levelRange = 40;

let loading_state = new State_Loading();

var map_cameraHeight = 175000;

var menu_buttonWidth = 0.2;
var menu_buttonHeight = 0.05;
var menu_buttons = [
	[`Infinite Mode`, `new State_Infinite()`],
	[`Explore Mode`, `new State_Map()`],
];
var menu_characterCircleRadius = 0.3;
var menu_characterSize = 60;

let page_animation;

let player;
var player_radius = 15;


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
var world_starDistance = 2300;
var world_starNumber = 500;
var world_time = 0;
let world_objects = [];
let active_objects = [];

var render_crosshairSize = 10;
var render_clipDistance = 0.1;
var render_maxColorDistance = 950;
var render_maxDistance = 15000;
var render_minTileSize = 9;
var render_identicalPointTolerance = 0.0001;
var render_tunnelTextTime = 50;
var render_voidSpinSpeed = 0.04;

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
	player = new Runner(-60, 0, 0);

	controls_object = player;

	//setting up world
	//as a reminder, tunnels are (x, y, z, angle, tile size, sides, tiles per sides, color, length, data)
	world_objects = []; 
	world_stars = [];

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

	//save data every once in a while
	if (world_time % 204 == 203) {
		localStorage_write();
	}

	//call self
	//modulo so that time never gets stuck
	world_time = (world_time + 1) % 9e15;
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
			try {
				loading_state.handleEscape();
			} catch (er) {
				console.log(`No escape function defined for the current game state peko`);
			}
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
	cursor_down = true;
	loading_state.handleMouseDown(a);
}

function handleMouseUp(a) {
	cursor_down = false;
}

function handleMouseMove(a) {
	loading_state.handleMouseMove(a);
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

	performing (10,000,000) a clamp operation on a variable when the condition for that clamp was met took between 48-50 ms. 
	Removing the conditional took between 50-56 ms.
	

	TL;DR-
	square roots are slow, but faster than trig functions
	variable declarations take time, but aren't the end of the world
	running an if statement on a variable to check for clamping is faster than doing clamping all the time


*/
function performanceTest() {
	var perfTime = [performance.now(), 0];

	var val = 0;
	for (var a=0;a<10000000;a++) {
		val += Math.random() - 0.5;
		//if (Math.abs(val) > 2) {
			val = clamp(val, -2, 2);
		//}
	}


	perfTime[1] = performance.now();
	var totalTime = perfTime[1] - perfTime[0];
	console.log(`performance test took ${totalTime} ms`);
}