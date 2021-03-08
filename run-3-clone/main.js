//houses html interactivity, setup, and main function

window.onload = setup;
window.addEventListener("keydown", handleKeyPress, false);
window.addEventListener("keyup", handleKeyNegate, false);


/*FOR REFACTORING LATER: THE REFACTORING CHECKLIST
	combine code blocks used multiple times into functions
	avoid else
	avoid nesting too far
	when using if else, put most likely condition first
*/
//global variables
var canvas;
var ctx;
var centerX;
var centerY;

var challenge_fadeTime = 50;
var challenge_opacity = 0.05;
var challenge_textTime = 280;

var controls_cursorLock = false;
var controls_sensitivity = 100;
var controls_spacePressed = false;

//bg is in 6 hex numbers for  p r e c i s i o n
const color_bg = "#100026";
const color_box = "#E6CCE6";
const color_box_secondary = "#776A88";
const color_challengeFadeout = "#000";
const color_character = "#888";
const color_conveyor = "#69BEFF";
const color_conveyor_secondary = "#616BFF";
const color_crumbling = "#CCCCCC";
const color_crumbling_secondary = "#808080";
const color_cutsceneBox = "#FFF";
const color_editor_border = "#F8F";
const color_editor_cursor = "#0FF";
const color_editor_bg = "#335";
const color_grey_dark = "#888";
const color_grey_light = "#CCC";
const color_grey_lightest = "#FEF";
const color_ice = "#D1E4E6";
const color_keyPress = "#8FC";
const color_keyUp = "#666";
const color_map_bg = "#FEA";
const color_map_writing = "#010";
const color_menuSelectionOutline = "#88F";
const color_stars = "#44A";
const color_text = "#424";
const color_text_bright = "#FAF";
const colors_powerCells = ["#888888", "#8888FF", "#88FF88", "#88FFFF", "#FF8888", "#FF88FF", "#FFFF88", "#FFFFFF"];

var cursor_x = 0;
var cursor_y = 0;
var cursor_down = false;
var cursor_hoverTolerance = 10;

var data_characters = [`Runner`, `Skater`, `Lizard`, `Bunny`, `Gentleman`, `Duplicator`, `Child`, `Pastafarian`, `Student`, `Angel`];


var data_levelSets = [`main`, `boxStorage`, `coordination`, `planA`, `planC`, `memory`, `wayBack`, `wayBack2`, `wayBackNot`, `winterGames`, `lowPower`, `new`,
						`A`, `B`, `C`, `D`, `F`, `G`, `H`, `I`, `L`, `M`, `N`, `T`, `U`, `W`];
//data_levelSets = [`main`, `lowPower`, `new`, `A`, `B`];

var data_persistent = {
	powercells: 0,
	discovered: [],
	unlocked: [`Runner`],
	goingHomeProgress: 1,
	bridgeBuildingProgress: 1,

};

//I made the executive decision to use PNGs rather than SVGs because of performance. 
//If anyone wants the .fla file with all the character sprites, feel free to dm me on discord (Cynthia_Clementine#4109)or email me at cyClementine0@gmail.com.
var data_sprites = {
	spriteSize: 144,

	Angel: {
		sheet: getImage('images/angelSprites.png'),
		frameTime: 2.2,
		back: [[0, 2]],
		front: [[10, 0]],
		jumpForwards: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0]],
		jumpSideways: [[0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1]],
		walkForwards: [[0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2],
					   [0, 3], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3], [7, 3]],
		walkSideways: [[0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4], [7, 4],
						[0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5], [6, 5], [7, 5]],
	},

	Bunny: {
		sheet: getImage('images/bunnySprites.png'),
		frameTime: 2.2,
		back: [[0, 0]],
		front: [[10, 0]],
		jumpForwards: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0]],
		jumpSideways: [[0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1]]
	},

	Child: {
		sheet: getImage('images/childSprites.png'),
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

	Duplicator: {
		sheet: getImage('images/duplicatorSprites.png'),
		frameTime: 2.3,
		back: [[0, 2]],
		front: [[10, 0]],
		jumpForwards: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0]],
		jumpSideways: [[0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1]],
		walkForwards: [[0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2],
					   [0, 3], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3], [7, 3]],
		walkSideways: [[0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4], [7, 4],
						[0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5], [6, 5], [7, 5]],
	},

	Gentleman: {
		sheet: getImage('images/gentlemanSprites.png'),
		frameTime: 2.3,
		back: [[0, 2]],
		front: [[10, 0]],
		jumpForwards: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0]],
		jumpSideways: [[0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1]],
		walkForwards: [[0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2],
					   [0, 3], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3], [7, 3]],
		walkSideways: [[0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4], [7, 4],
						[0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5], [6, 5], [7, 5]],
		flyForwards: [[0, 7], [1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7], [7, 7]],
		flySideways: [[0, 8], [1, 8], [2, 8], [3, 8], [4, 8], [5, 8], [6, 8], [7, 8]]
	},

	Lizard: {
		sheet: getImage('images/lizardSprites.png'),
		frameTime: 2.4,
		back: [[0, 2]],
		front: [[10, 0]],
		jumpForwards: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0]],
		jumpSideways: [[0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1]],
		walkForwards: [[0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2],
					   [0, 3], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3], [7, 3]],
		walkSideways: [[0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4], [7, 4],
						[0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5], [6, 5], [7, 5]],
	},

	Pastafarian: {
		sheet: getImage('images/pastaSprites.png'),
		frameTime: 2.3,
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
		sheet: getImage('images/runnerSprites.png'),
		frameTime: 2.3,
		back: [[0, 2]],
		front: [[]],
		jumpForwards: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0]],
		jumpSideways: [[0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1]],
		walkForwards: [[0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2],
					   [0, 3], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3], [7, 3]],
		walkSideways: [[0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4], [7, 4],
						[0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5], [6, 5], [7, 5]],
	},

	Skater: {
		sheet: getImage('images/skaterSprites.png'),
		frameTime: 2.1,
		back: [[0, 2]],
		front: [[]],
		jumpForwards: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0]],
		jumpSideways: [[0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1]],
		walkForwards: [[0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2],
					   [0, 3], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3], [7, 3]],
		walkSideways: [[0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4], [7, 4],
						[0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5], [6, 5], [7, 5]],
	},

	Student: {
		sheet: getImage('images/studentSprites.png'),
		frameTime: 2.2,
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

//for the map editor
var editor_active = false;
var editor_changingTheta = false;
var editor_selected = undefined;
var editor_clickTolerance = 5;
var editor_snapTolerance = 5;
var editor_thetaCircleRadius = 60;
var editor_thetaKnobRadius = 10;

//for the tunnel editor, try to keep up zozzle
var editor_cameraJumpDistance = 120;
var editor_colorMultiplier = 1.7;
var editor_mapHeight = 10000;
var editor_maxEditDistance = 1500;
var editor_propertyMenuWidth = 0.25;
var editor_sliderHeight = 0.05;
var editor_sliderProportion = 0.145;
var editor_sliderMargin = 0.008;
var editor_topBarHeight = 0.12;
var editor_tileSize = 0.025;
var editor_buttons = [
	[`Tiles`, `new State_Edit_Tiles()`],
	[`Properties`, `new State_Edit_Properties()`],
	[`World`, `new State_Edit_World()`]
];

//for the cutscene editor
var editor_handleRadius = 6;
var editor_cutsceneWidth = 0.2;

var infinite_levelRange = 40;

let loading_state = new State_Loading();

var map_height = 135000;
var map_shift = 56000;
var map_zOffset = -25000;

var menu_buttonWidth = 0.2;
var menu_buttonHeight = 0.05;
var menu_buttons = [
	[`Infinite Mode`, `new State_Infinite()`],
	[`Explore Mode`, `new State_Map()`],
	[`Edit Mode`, `new State_Edit_Tiles()`]
];
var menu_characterCircleRadius = 0.3;
var menu_characterSize = 30;

let page_animation;

var physics_maxBridgeDistance = 400;
var physics_conveyorStrength = 0.05;
var physics_crumblingShrinkStart = 50;
var physics_crumblingShrinkTime = 150;
var physics_gravity = 0.13;
var physics_jumpTime = 30;
var physics_graceTime = 6;
var physics_graceTimeRamp = 10;

let player;
var player_radius = 18;
var player_coyote = 6;

var powercells_acquireDistance = player_radius * 6;
var powercells_gentlemanMultiplier = 0.5;
var powercells_perTunnel = 10;
var powercells_spinSpeed = 0.05;
var powercells_size = 30;

var tunnel_textTime = 50;
var tunnel_transitionLength = 200;
var tunnel_voidWidth = 200;
var tunnel_bufferTiles = 4;
var tunnel_functions = {
	"instant": power_instant,
	"smooth": power_smooth,
	"slowSmooth": power_slowSmooth,
	"fast": power_fast,
	"slow": power_slow,
	"glimpse": power_glimpse,
	"falseAlarm": power_falseAlarm,
	"notSoFalseAlarm": power_notSoFalseAlarm,
	"undefined": power_fast,
	"cutscene": activateCutsceneFromTunnel
};
var tunnel_tileAssociation = {
	"~undefined": 1, 
	"~glow": 2, 
	"~crumbling": 3, 
	"~ice": 4,
	"~slow": 5, 
	"~fast": 6, 
	"~left": 7, 
	"~right": 8,
	"~box": 9, 
	"~rotatedZBox": 10, 
	"~steepRamp": 11, 
	"~ramp": 12, //ice ramp
	"~movable": 13, 
	"~battery": 14
};

var tunnel_translation = {
	"0": 0, "1": 1, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9,
	":": 10, ";": 11, "<": 12, "=": 13, ">": 14, "?": 15,"@": 16, "A": 17, "B": 18, "C": 19,
	"D": 20, "E": 21, "F": 22, "G": 23, "H": 24, "I": 25, "J": 26, "K": 27, "L": 28, "M": 29,
	"N": 30, "O": 31, "P": 32, "Q": 33, "R": 34, "S": 35, "T": 36, "U": 37, "V": 38, "W": 39,
	"X": 40, "Y": 41, "Z": 42, "[": 43, "/": 44, "]": 45, "^": 46, "_": 47, "!": 48, "a": 49,
	"b": 50, "c": 51, "d": 52, "e": 53, "f": 54, "g": 55, "h": 56, "i": 57, "j": 58, "k": 59,
	"l": 60, "m": 61, "n": 62, "o": 63,
};

let world_camera;
var world_pRandValue = 1.2532;
var world_starDistance = 2300;
var world_starNumber = 500;
var world_time = 0;
let world_lightObjects = [];
let world_objects = [];
let active_objects = [];


var render_animSteps = 9;
var render_crosshairSize = 10;
var render_clipDistance = 0.1;
var render_identicalPointTolerance = 0.0001;
var render_maxColorDistance = 950;
var render_maxDistance = 15000;
var render_minTileSize = 8;
var render_starOpacity = 0.6;
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

	//adding a fun little suprise :)
	if (Math.random() < 0.001) {
		var icon = document.querySelector("link[rel~='icon']");
		icon.href = 'images/run.png';
	}

	world_camera = new Camera(0, 8, 0, 0, 0);
	player = new Runner(-60, 0, 0);

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

	localStorage_read();

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
	if (!editor_active) {
		switch(a.keyCode) {
			//direction controls
			// a / <--
			case 65:
			case 37:
				player.ax = -1 * player.speed;
				break;
			//d / -->
			case 68:
			case 39:
				player.ax = player.speed;
				break;
			// w / ^ / space
			case 87:
			case 38:
			case 32:
				if (!controls_spacePressed) {
					//if it's infinite mode, restart
					if (loading_state instanceof State_Infinite && loading_state.substate == 2) {
						loading_state = new State_Infinite();
					}
					player.handleSpace();
				}
				controls_spacePressed = true;
				break;
			//s / ˇ, for edit mode
			case 83:
			case 40:
				if (loading_state instanceof State_Edit) {
					player.az = -1;
				}
				break;
			//r
			case 82:
				if (loading_state instanceof State_Game && loading_state.substate == 0) {
					loading_state.handlePlayerDeath();
				}
				break;

			//activating editor
			case 221:
				ctx.lineWidth = 2;
				editor_active = true;
				break;
			case 27:
				try {
					loading_state.handleEscape();
				} catch (er) {
					console.log(`No escape function defined for the current game state peko`);
				}
				break;
		}
	} else {
		switch(a.keyCode) {
			//movement controls
			// a/d
			case 65:
				world_camera.ax = -1 * world_camera.speed;
				break;
			case 68:
				world_camera.ax = world_camera.speed;
				break;
			// w/s
			case 87:
				world_camera.az = world_camera.speed;
				break;
			case 83:
				world_camera.az = -1 * world_camera.speed;
				break;
			//space
			case 32:
				if (!controls_spacePressed) {
					world_camera.handleSpace();
				}
				controls_spacePressed = true;
				break;
			//shift
			case 16:
				world_camera.speed *= 8;
				break;
			//delete button
			case 8:
				if (loading_state instanceof State_Cutscene) {
					if (loading_state.selected != undefined) {
						//if space is pressed, splice out all items
						if (controls_spacePressed) {
							loading_state.data[loading_state.frame][1] = [];
							return;
						}
						//normal case
						var editing = loading_state.data[loading_state.frame][1];
						editing.splice(editing.indexOf(loading_state.selected), 1);
					}
				}
				break;

			//direction controls
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
			case 81:
				world_camera.dr = world_camera.sens / 2;
				break;
			case 69:
				world_camera.dr = world_camera.sens / -2;
				break;

			//frame control (< / >)
			case 188:
				if (loading_state instanceof State_Cutscene) {
					if (loading_state.frame > 0) {
						loading_state.frame -= 1;
						loading_state.updateFrame();
					}
				}
				break;
			case 190:
				if (loading_state instanceof State_Cutscene) {
						loading_state.frame += 1;
						if (loading_state.frame + 1 > loading_state.data.length) {
							loading_state.data.push([[world_camera.x, world_camera.y, world_camera.z, world_camera.theta, world_camera.phi, world_camera.rot], []]);
						}
						loading_state.updateFrame();
				}
				break;
			//de-activating editor
			case 221:
				ctx.lineWidth = 2;
				editor_active = false;
				break;
			case 27:
				try {
					loading_state.handleEscape();
				} catch (er) {
					console.log(`No escape function defined for the current game state peko`);
				}
				break;
		}
	}
}

function handleKeyNegate(a) {
	if (!editor_active) {
		switch(a.keyCode) {
			//direction controls
			case 65:
			case 37:
				if (player.ax < 0) {
					player.ax = 0;
				}
				break;
			case 68:
			case 39:
				if (player.ax > 0) {
					player.ax = 0;
				}
				break;
			// w / ^ / space
			case 87:
			case 38:
			case 32:
				controls_spacePressed = false;
				break;
		}
	} else {
		switch(a.keyCode) {
			//direction controls
			case 65:
				if (world_camera.ax < 0) {
					world_camera.ax = 0;
				}
				break;
			case 68:
				if (world_camera.ax > 0) {
					world_camera.ax = 0;
				}
				break;
			case 87:
				if (world_camera.az > 0) {
					world_camera.az = 0;
				}
				break;
			case 83:
				if (world_camera.az < 0) {
					world_camera.az = 0;
				}
				break;
			//shift
			case 16:
				world_camera.speed /= 8;
				break;
			//space
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
			case 81:
				if (world_camera.dr > 0) {
					world_camera.dr = 0;
				}
				break;
			case 69:
				if (world_camera.dr < 0) {
					world_camera.dr = 0;
				}
				break;
		}
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
	render_minTileSize *= multiplier;
	menu_characterSize *= multiplier;

	cursor_hoverTolerance *= multiplier;

	if (loading_state.drawEnding == false) {
		loading_state.drawEnding = true;
	}

	if (loading_state.doDraw == false) {
		loading_state.doDraw = true;
	}

	//updating star size
	world_stars.forEach(w => {
		w.tick();
	});
}

/* results:
	performing 10,000,000 square roots on random numbers from 1 to 4000 took from 930 - 960 ms
	this is slightly faster than the same number of sin, cos, and tan operations, at 1100-1300 ms

	performing 100,000 spaceToRelative functions with a variable declaration took 218 - 228 ms
	performing the same number of spaceToRelative functions with the variable declaration removed took 210-211 ms,

	performing (10,000,000) a clamp operation on a variable when the condition for that clamp was met took between 48-50 ms. 
	Removing the conditional took between 50-56 ms.

	performing 1,000,000 instanceof tests took 10 ms, while performing 1,000,000 checks for a variable only a certain class has took 1-2 ms.

	run 10,000 times, setting an array of 1000 elements took 50 ms normally (push()) but was cut down to 35 ms when setting the last element of the array to undefined
	

	TL;DR-
	square roots are slow, but faster than trig functions
	variable declarations take time, but aren't the end of the world
	running an if statement on a variable to check for clamping is faster than doing clamping all the time
	instanceof tests are SLOW! avoid them
	increasing the length of an array is slow
	forEach loops are approximately 3 times faster than for loops (107 ms vs 315 ms)


*/
function performanceTest() {
	var perfTime = [performance.now(), 0];
	var variableName = [0, 0, 0];
	for (var a=0;a<1000000;a++) {
		transformPoint(variableName, [Math.random(), Math.random(), Math.random()], [Math.random(), Math.random()], randomBounded(3, 6));
		variableName = [0, 0, 0];
	}


	perfTime[1] = performance.now();
	var totalTime = perfTime[1] - perfTime[0];
	console.log(`performance test took ${totalTime} ms`);
}