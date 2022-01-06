//houses html interactivity, setup, and main function

window.onload = setup;
window.addEventListener("keydown", handleKeyPress, false);
window.addEventListener("keyup", handleKeyNegate, false);


/*FOR REFACTORING LATER: THE REFACTORING CHECKLIST
	combine code blocks used multiple times into functions
	avoid else
	avoid nesting too far
	when using if else, put most likely condition first



TODO list
change the way cutscene data works. Perhaps all the cutscenes could be put into a giant dictionary?
instead of cutsceneData_id it would be data_cutscene["id"]
would also cut down on the distinction between "planetMissing" and "Planet Missing" for example, as keys can be any string
all cutscenes should be relative to some tunnel. I don't know how many things I'm going to accidentally break when I move a tunnel and the cutscenes don't come with. It's annoying.

Fix tunnel rendering. Goish I feel terrible about that. Currently it seems like a binary space partition is the only way to go, but maybe there are some shortcuts that can be taken.
	If going with a BSP, make sure it's fast. Find a way to group tiles into one plane
	is it possible to not cut any tile planes? Boxes + ramps seem like a big no-go on that but it may be possible

challenge mode is a mess. Maybe something with that?


*/
//global variables
var audio_channel1 = new AudioChannel(0.5);
var audio_channel2 = new AudioChannel(0.5);
var audio_consentRequired = true;
var audio_fadeTime = 75;
var audio_tolerance = 1 / 30;

var canvas;
var ctx;
var centerX;
var centerY;

var challenge_fadeTime = 40;
var challenge_opacity = 0.05;

var checklist_width = 0.35;
var checklist_height = 0.45;
var checklist_margin = 0.01;
var checklist_speed = 0.04;
var checklist_searchButton = new PropertyButton(checklist_width + (checklist_margin * 2.1) + (checklist_width * 0.375), 1, checklist_width * 0.75, 0.06, `Keep searching`, `loading_state = new State_Challenge(challengeData_angelMissions, data_persistent.goingHomeProgress);`);
var checklist_stayLines = 3;

var clip_tolerance = 0.1

var controls_altPressed = false;
var controls_cursorLock = false;
var controls_escPressed = false;
var controls_escHoldTime = 5000;
var controls_sensitivity = 100;
var controls_spacePressed = false;
var controls_shiftPressed = false;


//some of these are in 6 digits if they need to be parsed to HSV or if I want it to be very precise.
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
const color_cutsceneLink = "#404";
const color_deathE = "#4BF";
const color_deathE2 = "#689";
const color_deathI = "#F93";
const color_deathI2 = "#A86";

const color_editor_bg = "#335";
const color_editor_border = "#F8F";
const color_editor_camera = "#0F0";
const color_editor_cursor = "#0FF";
const color_editor_normal = "#F80";

const color_grey_dark = "#666";
const color_grey_light = "#CCC";
const color_grey_lightest = "#FEF";
const color_ice = "#D1E4E6";
const color_keyPress = "#8FC";
const color_keyUp = "#666";
const color_map_bg = "#FEA";
const color_map_bg_dark = "#DCC";
const color_map_writing = "#010";
const color_menuSelectionOutline = "#88F";
const color_ring = "#FEEC00";
const color_stars = "#44A";
const color_star_special = "#88F";
const color_star_wormhole = "#F88";
const color_tape = "#5E6570";
const color_text = "#424";
const color_text_bright = "#FAF";
const color_text_danger = "#F22";
const color_trigger = "#A60";
const color_warning = "#FFDB29";
const color_warning_secondary = "#8C8C89";
const colors_powerCells = ["#888888", "#8888FF", "#88FF88", "#88FFFF", "#FF8888", "#FF88FF", "#FFFF88", "#FFFFFF"];

var credits = [
	`CREDITS:`,
	`Cynthia Clementine - coding, art, and interface design`,
	`Joseph Cloutier - level design, original art, and story`,
	`Alex Ostroff - original art/animation`,
	`Jesse Valentine - music`,
	`NintendoPanda101 - providing some improved music loops`,
	``,
	`ADDITIONAL LEVELS BY:`,
	`Karsh777, mathwiz100, portugal2000, Huggaso,`,
	`StarsOfTheSky, Fivebee2, Gecco, and Cynthia Clementine`,
	``,
	`SPECIAL THANKS:`,
	`A*16 - "I barely did anything but I still wanted`,
	`to be in the credits."`,
	`Chair - "Chair or LongNeckedChair."`,
]
var cursor_x = 0;
var cursor_y = 0;
var cursor_down = false;
var cursor_hoverTolerance = 10;

//for the map editor
var editor_active = false;
var editor_changingTheta = false;
var editor_clickTolerance = 5;
var editor_cutsceneSnapTolerance = 36;
var editor_mapSnapTolerance = 5;
var editor_thetaCircleRadius = 60;
var editor_thetaKnobRadius = 10;

//for the tunnel editor, try to keep up zozzle
var editor_buttonHeightPercentage = 0.45;
var editor_cameraLimit = 300000;
var editor_colorMultiplier = 1.7;
var editor_constrainViewLen = 0.02;
var editor_cutsceneColumns = 3;
var editor_cutsceneMargin = 0.08;
var editor_functionMapping = {
	"instant":			"power (instant)",
	"smooth":			"power (smooth)",
	"slowSmooth":		"power (smooth, slow)",
	"fast": 			"power (stutter)",
	"slow": 			"power (stutter, slow)",
	"glimpse":			"power (glimpse)",
	"falseAlarm":		"power (false alarm)",
	"notSoFalseAlarm":	"power (true alarm)",
	"cutsceneImmerse":	"cutscene"
};
var editor_mapHeight = 10000;
var editor_minEditAngle = 0.06;
var editor_lPropertyW = 0.3;
var editor_lTileW = 0.06;
var editor_lTriggerW = 0.2;
var editor_sliderHeight = 0.05;
var editor_sliderProportion = 0.145;
var editor_sliderMargin = 0.008;
var editor_substateTravelSpeed = 0.07;
var editor_topBarHeight = 0.12;
var editor_tileSize = 0.02;
var editor_triggerRibX = 0.0075;
var editor_triggerEditW = 0.4;
var editor_triggerEditH = 0.15;
var editor_tunnelDefaultData = `id~Custom Tunnel IeCo|pos-x~0|pos-z~2|direction~0.0000|tube~4~4|color~4CCC4C|spawn~1|tileWidth~75|terrain~!0200<00P03|music~TravelTheGalaxy`;
var editor_warning = "Warning: Editor data does not save between sessions. If you want to save your data, make sure to export your world before closing the window.";
var editor_warning_file = `the file you have entered has been detected at over 5000 lines long. 
This either means you have quite a large file, or something's gone wrong. 
If you would like to stop processing the file, click cancel. If continuing is alright, hit ok.`;
var editor_controlText = [
	`EDIT MODE CONTROLS:`,
	`< / > - decrement / increment cutscene frame`,
	`WASD, space, and shift - change camera position`,
	`arrow keys, Q, and E - change camera orientation`,
	`r - reset camera orientation`,
	`c - toggle permanent camera change`,
	`esc - reset camera position`,


	`NORMAL MODE CONTROLS:`,
	`esc - skip cutscene`,
	`click - advance frame`
]
var editor_worldSnapTolerance = 25;
var editor_worldFile = undefined;

//for the cutscene editor
var editor_handleRadius = 6;
var editor_cutsceneWidth = 0.15;

//for custom worlds
var editor_maxCutscenes = 21;
var editor_cutscenes = {}
var editor_objects = [];
var editor_spawn = undefined;
var editor_locked = false;


var infinite_branchChance = 0.2;
var infinite_branchCooldown = 8;
var infinite_data = levelData_infinite.split("\n");
var infinite_difficultyBoost = 4;
var infinite_levelRange = 40;
var infinite_wobble = 0.3;
var infinite_levelConstraints = [];
var infinite_levelsVisited = "";



let loading_state;

var map_height = 120000;
var map_shift = 57000;
var map_zOffset = -46900;
var map_zStorage = map_zOffset;
var map_iconSize = 0.06;

var menu_buttonWidth = 0.25;
var menu_buttonHeight = 0.06;
var menu_characterCircleRadius = 0.3;
var menu_characterSize = 30;
var menu_characterTextTime = 160;
var menu_characterTextWidth = 0.7;
var menu_cutsceneParallax = 0.4;
var menu_propertyHeight = 0.07;
var menu_ringHeight = 0.56;

let page_animation;
let page_escBuffer;

var physics_boxFriction = 0.96;
var physics_boxMultiplier = 9;
var physics_boxSidePush = 0.75;
var physics_conveyorStrength = 0.05;
var physics_crumblingShrinkStart = 50;
var physics_crumblingShrinkTime = 150;
var physics_graceTime = 6;
var physics_graceTimeRamp = 10;
var physics_gravity = 0.13;
var physics_jumpTime = 30;
var physics_maxBridgeDistance = 350;

let player;
var player_radius = 18;
var player_coyote = 12;
var player_maxNameWidth = 0.28;

var powercells_acquireDistance = player_radius * 6;
var powercells_gentlemanMultiplier = 0.5;
var powercells_perTunnel = 10;
var powercells_spinSpeed = 0.05;
var powercells_size = 30;

var render_animSteps = 9;
var render_crosshairSize = 10;
var render_clipDistance = 0.1;
var render_identicalPointTolerance = 0.0001;
var render_maxColorDistance = 950;
var render_maxDistance = 25000;
var render_minTileSize = 8;
var render_minPolySize = 4;
var render_ringSize = 18;
//rate + rateStep are how often the game ticks. This fixes the problem with 120Hz monitors being twice as fast. If you use a monitor that's not a multiple of 60, you're out of luck, soiry.
var render_rate = 60;
var render_rateBase = 60;
var render_rateParity = 0;
var render_starOpacity = 0.6;
var render_voidSpinSpeed = 0.04;

let star_arr = [];
var star_distance = 2300;
var star_number = 500;

var text_queue = [];
var text_timeMax = 240;
var text_time = text_timeMax;

var textures_common = [];
data_characters.indexes.forEach(c => {
	textures_common.push(new Texture(eval(`data_sprites.${c}.sheet`), data_sprites.spriteSize, 1e1001, false, false, eval(`[data_sprites.${c}.back[0], data_sprites.${c}.front[0]]`)));
});

var times_holiday = undefined;
var times_current = {};
var times_past = {};

var tunnel_bufferTiles = 4;
var tunnel_crumbleOffset = 0.05;
var tunnel_dataStarChainMax = 4;
var tunnel_dataRepeatMax = 3;
var tunnel_minPlexiStrength = 0.01;

var tunnel_textTime = 50;
var tunnel_transitionLength = 200;
var tunnel_voidWidth = 200;

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
	"cutscene": activateCutsceneFromTunnel,
	"cutsceneImmerse": activateCutsceneFromEditorTunnel
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
	"~warning": 13,

	//movable tiles all start with 100 because. Just because.
	"~movable": 101, 
	"~movableGlow": 102,
	"~movableBox": 109
};

var tunnel_tileObjectAssociation = {
	1: Tile,
	2: Tile_Bright,
	3: Tile_Crumbling,
	4: Tile_Ice,
	5: Tile_Conveyor_Slow,
	6: Tile_Conveyor,
	7: Tile_Conveyor_Left,
	8: Tile_Conveyor_Right,
	9: Tile_Box,
	10: Tile_Box_Spun,
	11: Tile_Ramp,
	12: Tile_Ice_Ramp,
	13: Tile_Warning,

	101: Tile_Ringed,
	102: Tile_Bright_Ringed,
	109: Tile_Box_Ringed
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
var tunnel_translationInverse = `0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[/]^_!abcdefghijklmno`;
var tunnel_validIndeces = {
	0: true,
	1: true,
	2: true,
	3: true,
	4: true,
	5: true,
	6: true,
	7: true,
	8: true,
	9: true,
	10: true,
	11: true,
	12: true,
	13: true,

	101: true,
	102: true,
	109: true,
};

let world_camera;
var world_pRandValue = 1.2532;
var world_time = 0;
let world_lightObjects = [];
let world_objects = [];
var world_specialStar;
let active_objects = [];
let world_wormhole;
var world_version = 1.2;

//misc variables I couldn't be bothered giving prefixes to
/*
haltRotation - a variable to force tunnels to not rotate more than once per frame
deathCount - a counter used in challenge mode to see how many times player has died (used in resetting boxes)
*/
var haltRotation = false;
var deathCount = 0;




//setup function
function setup() {
	canvas = document.getElementById("cornh");
	ctx = canvas.getContext("2d");
	setCanvasPreferences();

	//cursor movements setup
	document.addEventListener("mousemove", handleMouseMove, false);
	document.addEventListener("mousedown", handleMouseDown, false);
	document.addEventListener("mouseup", handleMouseUp, false);

	//objects
	world_camera = new Camera(0, 8, 0, 0, 0);
	player = new Runner(-60, 0, 0);
	world_wormhole = new Wormhole(60000, 2000, 199199);

	//adding a fun little suprise :)
	if (Math.random() < 0.001) {
		var icon = document.querySelector("link[rel~='icon']");
		icon.href = 'images/run.png';
	}

	//edit world objects
	if (editor_objects.length == 0) {
		editor_objects.push(createTunnelFromData(editor_tunnelDefaultData));
		editor_spawn = editor_objects[0];
	}

	loading_state = new State_Loading();

	//setting up world
	//fastLoad();

	generateStarSphere();
	generateAngelLines();
	localStorage_read();

	//seasons
	var date = new Date();
	if (date.getMonth() + 1 == 10 && date.getDate() == 31) {
		star_arr.forEach(s => {
			s.color = "#FC8";
		});
	}

	//the wavy air
	//navigator.mediaDevices.getUserMedia({audio: true});
	
	page_animation = window.requestAnimationFrame(main);
}

function main() {
	if (render_rateParity == 0) {
		//main loop
		loading_state.execute();
		handleTextDisplay();

		//handle audio
		handleAudio();
		audio_channel1.tick();
		audio_channel2.tick();

		//save data every once in a while
		if (world_time % 204 == 203) {
			localStorage_write();
		}

		//time
		world_time = (world_time + 1) % 9e15;
	}


	//call self
	render_rateParity = (render_rateParity + 1) % (render_rate / render_rateBase);
	page_animation = window.requestAnimationFrame(main);
}

//input handling
function handleKeyPress(a) {
	loading_state.handleKeyPress(a);

	//universal keys
	switch (a.key.toLowerCase()) {
		case 'shift':
			controls_shiftPressed = true;
			break;
		case 'alt':
			controls_altPressed = true;
			break;
		case 'escape':
			if (!controls_escPressed) {
				controls_escPressed = true;
				toggleForcedReset(1);
				try {
					loading_state.handleEscape();
				} catch (er) {
					console.log(`No escape / invalid function defined for the current game state peko`);
				}
			}
			break;
		case ' ':
			controls_spacePressed = true;
			break;
		case ']':
			editor_active = !editor_active;
			break;
	}
}

function handleKeyPress_camera(a) {
	//movement controls
	switch (a.key.toLowerCase()) {
		// a/d
		case 'a':
			world_camera.ax = -1 * world_camera.aSpeed;
			break;
		case 'd':
			world_camera.ax = world_camera.aSpeed;
			break;
		// w/s
		case 'w':
			world_camera.az = world_camera.aSpeed;
			break;
		case 's':
			world_camera.az = -1 * world_camera.aSpeed;
			break;
		//space / shift
		case ' ':
			world_camera.ay = world_camera.aSpeed;
			break;
		case 'shift':
			world_camera.ay = -1 * world_camera.aSpeed;
			break;

		//angle controls
		case 'arrowleft':
			world_camera.dt = -1 * world_camera.sens;
			break;
		case 'arrowup':
			world_camera.dp = world_camera.sens;
			break;
		case 'arrowright':
			world_camera.dt = world_camera.sens;
			break;
		case 'arrowdown':
			world_camera.dp = -1 * world_camera.sens;
			break;
		case 'q':
			world_camera.dr = world_camera.sens;
			break;
		case 'e':
			world_camera.dr = -1 * world_camera.sens;
			break;

		//speed controls (- / +)
		case '-':
			if (world_camera.speedSettingSelected > 0) {
				world_camera.speedSettingSelected = 0;
			} else {
				world_camera.speedSettingSelected = 1;
			}
			break;
		case '=':
			if (world_camera.speedSettingSelected < 2) {
				world_camera.speedSettingSelected = 2;
			} else {
				world_camera.speedSettingSelected = 1;
			}
			break;

		//reset
		case 'r':
			world_camera.reset();
			break;
	}
}

function handleKeyPress_player(a) {
	switch(a.key.toLowerCase()) {
		//direction controls
		// a / <--
		case 'a':
		case 'arrowleft':
			player.ax = -1 * player.strafeSpeed;
			break;
		//d / -->
		case 'd':
		case 'arrowright':
			player.ax = player.strafeSpeed;
			break;
		// w / ^ / space
		case 'w':
		case 'arrowup':
		case ' ':
			if (!controls_spacePressed) {
				//if it's infinite mode, restart
				if (loading_state instanceof State_Infinite && loading_state.substate == 2) {
					loading_state.pushScoreToLeaderboard();
					loading_state = new State_Infinite();
					loading_state.doWorldEffects();
				}
				player.handleSpace();
			}
			controls_spacePressed = true;
			break;
		//r
		case 'r':
			if (loading_state instanceof State_Game && loading_state.substate == 0) {
				loading_state.handlePlayerDeath();
			}
			break;
	}
}

function handleKeyNegate(a) {
	loading_state.handleKeyNegate(a);

	//universals
	switch (a.key.toLowerCase()) {
		case 'shift':
			controls_shiftPressed = false;
			break;
		case 'alt':
			controls_altPressed = false;
			break;
		case 'escape':
			controls_escPressed = false;
			toggleForcedReset(0);
			break;
		case ' ':
			controls_spacePressed = false;
			break;
	}
}

function handleKeyNegate_camera(a) {
	switch(a.key.toLowerCase()) {
		//direction controls
		case 'a':
			if (world_camera.ax < 0) {
				world_camera.ax = 0;
			}
			break;
		case 'd':
			if (world_camera.ax > 0) {
				world_camera.ax = 0;
			}
			break;
		case 'w':
			if (world_camera.az > 0) {
				world_camera.az = 0;
			}
			break;
		case 's':
			if (world_camera.az < 0) {
				world_camera.az = 0;
			}
			break;
		case ' ':
			if (world_camera.ay > 0) {
				world_camera.ay = 0;
			}
			break;
		case 'shift':
			if (world_camera.ay < 0) {
				world_camera.ay = 0;
			}
			break;
			
		//angle controls
		case 'arrowleft':
			if (world_camera.dt < 0) {
				world_camera.dt = 0;
			}
			break;
		case 'arrowup':
			if (world_camera.dp > 0) {
				world_camera.dp = 0;
			}
			break;
		case 'arrowright':
			if (world_camera.dt > 0) {
				world_camera.dt = 0;
			}
			break;
		case 'arrowdown':
			if (world_camera.dp < 0) {
				world_camera.dp = 0;
			}
			break;
		case 'q':
			if (world_camera.dr > 0) {
				world_camera.dr = 0;
			}
			break;
		case 'e':
			if (world_camera.dr < 0) {
				world_camera.dr = 0;
			}
			break;
	}
}

function handleKeyNegate_player(a) {
	switch(a.key.toLowerCase()) {
		//a / <--
		case 'a':
		case 'arrowleft':
			if (player.ax < 0) {
				player.ax = 0;
			}
			break;
		//d / -->
		case 'd':
		case 'arrowright':
			if (player.ax > 0) {
				player.ax = 0;
			}
			break;
		// w / ^ / space
		case 'w':
		case 'arrowup':
		case ' ':
			controls_spacePressed = false;
			break;
	}
}

function handleMouseDown(a) {
	cursor_down = true;
	var canvasArea = canvas.getBoundingClientRect();
	if (!data_persistent.settings.maskCursor || (
	a.clientX - canvasArea.left <= canvas.width && a.clientX - canvasArea.left >= 0 && 
	a.clientY - canvasArea.top >= 0 && a.clientY - canvasArea.top <= canvas.height)) {
		loading_state.handleMouseDown(a);
	}
}

function handleMouseUp(a) {
	cursor_down = false;
}

function handleMouseMove(a) {
	var canvasArea = canvas.getBoundingClientRect();
	if (!data_persistent.settings.maskCursor || (
	a.clientX - canvasArea.left <= canvas.width && a.clientX - canvasArea.left >= 0 && 
	a.clientY - canvasArea.top >= 0 && a.clientY - canvasArea.top <= canvas.height)) {
		loading_state.handleMouseMove(a);
	}
}

function updateResolution() {
	var multiplier = 0.5;
	if (data_persistent.settings.highResolution) {
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
	star_arr.forEach(w => {
		w.tick();
	});
	setCanvasPreferences();
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
	instanceof tests are SLOW! avoid them, if you have to use .constructor.name instead
	increasing the length of an array is slow
	forEach loops are approximately 3 times faster than for loops (107 ms vs 315 ms)
	binary search is indeed, much faster than linear search. For an array of 300 elements, it is at least 20 times as fast.
	it is possible to create a faster square root than the built-in javascript one, but it's weird and wacky

*/
function performanceTest() {
	var perfTime = [0, 0];
	var possibleObjects = [Tile, Tile_Bright, Tile_Ringed]
	var totalTime = 0;
	perfTime = [performance.now(), 0];
	var num = [];
	var num2 = [];
	for (var a=0; a<50000; a++) {
		num[a] = new possibleObjects[Math.floor(randomBounded(0, 2.999))](0, 0, 0, 20, [1, 1], {}, {h: 0, s: 0, v: 0});
	}

	for (var g=0; g<10; g++) {
		num2 = [];
		for (var a=49999; a>-1; a--) {
			num2[a] = num[a] instanceof Tile_Ringed;
		}
	}

	perfTime[1] = performance.now();
	totalTime = perfTime[1] - perfTime[0];
	console.log(`performance test took ${totalTime} ms`);
}