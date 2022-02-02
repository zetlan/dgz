window.addEventListener("keydown", keyPress, false);
window.addEventListener("keyup", keyNegate, false);
//setting up variables for later
var canvas;
var ctx;

var menuPos = 1;
var menuIncrement = 0.005;
var menuLimit = 0.82;

var game_animation;
var game_time = -1;

var cutsceneTime = 50;
var gravityDampener = 20;


let camera_world = new Camera_World();
let camera_map = new Camera_Map();

//all the colors used
const color_black = "#220";
const color_coolPuff = "#59C";
const color_debris = "#88F";
const color_engineFlames = "#66F";
const color_fuel = "#F90";
const color_green = "#0D8";
const color_ice = "#BEF";
const color_menu = "#FFF";
const color_power = "#FD0";
const color_purple = "#808";
const color_ring = "#FFF";
const color_rocky = "#868";
const color_space = "#222266";
const color_space_blueshift = "#0b0b6a";
const color_space_redshit = "#551155";
const color_star_neutron = "#0DF";
const color_star_sun = "#FB0";
const color_star_warm = "#F30";
const color_ship = "#F8F";
const color_shop = "#DAF";
const color_shop_dark = "#C7C";
const color_shop_glow = "#FB0";
const color_splash = "#333366";
const color_text = "#8FC";
const color_textBox = "#66F";
const color_water = "#88F";
const color_white = "#EFF";

var data_persistent = {
	highRes: false,
	plot: {
		overall: 0,
	},
};

var display_orbitOpacity = 0.2;
var display_menuOpacity = 0.2;
var display_scaleMultiplier = 1;

var debris_startNum = 0;
var debris_maxNum = 0;
var debris_minSize = 0.3;

//DT stuff. the greater dt is, the slower the game is.
var dt = 32;
var dt_base = 3;
var dt_values = [8, 4, 2, 1, 1/2, 1/4, 1/8, 1/20, 1/50, 1/100];
var dt_selector = dt_base;

var computeColor = "#307529";
var computeWireColor = "#FFEE25";
var hyperColor = "#3872FF";
var brokenHyperColor = "#5D649C";
var repairColor = "#76AA9F";

var cTemperColor = "#7CBBFA";
var mTemperColor = "#7CFA80";
var hTemperColor = "#FA917C";

//keycodes for button inputs
const keycode_w = 87;
const keycode_a = 65;
const keycode_s = 83;
const keycode_d = 68;

const keycode_l = 76;
const keycode_m = 77;
const keycode_z = 90;

const keycode_left = 37;
const keycode_up = 38;
const keycode_right = 39;
const keycode_down = 40;

const keycode_shift = 16;
const keycode_space = 32;

const keycode_right_carat = 190;
const keycode_left_carat = 188;

let loading_debris = [];
let loading_camera = camera_world;
let loading_state = new State_Splash();
let loading_system;

var player_radius = 5;
var player_thrusterStrength = 1 / 256;
//fuel efficiency is the ratio of fuel used to velocity gained. The higher it is, the more fuel needs to be used for the same amount of thrust.
var player_fuelEfficiency = 8;
var player_turnStrength = 0.025;
var player_turnSpeedMax = 0.2;
var player_asteroidResist = 6;

//objects here




let character;

window.onload = setup;
// the initializing function.
function setup() {
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
	ctx.imageSmoothingEnabled = false;
	ctx.fillRule = "evenodd";

	//high resolution slider
	document.getElementById("haveHighResolution").onchange = updateResolution;
	//if the box is already checked from a previous session update resolution to max
	if (document.getElementById("haveHighResolution").checked) {
		updateResolution();
	}

	//initialize player
	character = new Player(x, y, dx, dy);

	//initialize world
	initWorld();

	loading_system = system_main;
	
	//set player's orbit
	[character.x, character.y, character.dx, character.dy] = calculateOrbitalParameters(system_d_a, 310, 290, 0, 0.05, false);
	loading_debris.push(character);

	//populating the debris field
	for (jc=0;jc<debris_startNum;jc++) {
		var apoH = (Math.random() * 30000) + 200;
		var periH = Math.abs(apoH - (Math.random() * 5000));
		var [x, y, dx, dy] = calculateOrbitalParameters(loading_system, apoH, periH, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.floor(Math.random() * 1.01));
		loading_debris.push(new Debris(x, y, dx, dy));
	}

	//calling main
	game_animation = window.requestAnimationFrame(main);
}

function keyPress(h) {
	switch (h.keyCode) { 
		//directional movements
		case keycode_a:
		case keycode_left:
			character.aa = -1 * player_turnStrength;
			break;
		case keycode_w:
		case keycode_up:
			if (loading_state.id == "shop") {
				shop_handleUp();
			} else {
				character.acc = true;
			}
			h.preventDefault();
			break;
		case keycode_d:
		case keycode_right:
			character.aa = player_turnStrength;
			break;
		case keycode_s:
		case keycode_down:
			if (loading_state.id == "shop") {
				shop_handleDown();
			}
			h.preventDefault();
			break;

		//special operations
		//m for map view
		case keycode_m:
			if (loading_state.id == "world") {
				loading_state = new State_Map();
			} else if (loading_state.id == "map") {
				loading_state = new State_World();
			}
			break;
		//scale out + in
		case keycode_shift:
			loading_camera.scale_d = 1;
			h.preventDefault();
			break;
		case keycode_space:
			loading_camera.scale_d = -1;
			h.preventDefault();
			break;

		//starting / restarting game
		case keycode_z:
			if (loading_state.id == "splash" && character.timeout == 0) {
				loading_state = new State_World();
			} else if (loading_state.id == "shop") {
				shop_handleZ();
			}
			break;

		//dt stepping
		case keycode_right_carat:
			if ((loading_state.id == "map" || loading_state.id == "world") && dt_selector < dt_values.length - 1) {
				dt_selector += 1;
				dt = dt_values[dt_selector];
			}
			break;
		case keycode_left_carat:
			if ((loading_state.id == "map" || loading_state.id == "world") && dt_selector > 0) {
				dt_selector -= 1;
				dt = dt_values[dt_selector];
			}
			break;
		case keycode_l:
			if (loading_state.id == "map" || loading_state.id == "world") {
				dt_selector = dt_base;
				dt = dt_values[dt_selector];
			}
			break;

	}
}

/*all the "character dot"s make it confusing, but I'm making the player an object
because
1. This whole game is an expirement with using objects and functions inside them,
and
2. the bodies are an object and it's easier to pass an object 
through the gravity function, stored inside the bodies. */
function keyNegate(h) {
	switch (h.keyCode) {
		//directional movements
		case keycode_a:
		case keycode_left:
			if (character.aa < 0) {
				character.aa = 0;
			}
			break;
		case keycode_w:
		case keycode_up:
			character.acc = false;
			break;
		case keycode_d:
		case keycode_right:
			if (character.aa > 0) {
				character.aa = 0;
			}
			break;
		//camera
		case keycode_shift:
			if (loading_camera.scale_d > 0) {
				loading_camera.scale_d = 0;
			}
			break;
		case keycode_space:
			if (loading_camera.scale_d < 0) {
				loading_camera.scale_d = 0;
			}
			break;
	}
}

//this function is the main function that repeats every time the timer goes off. It is very important.
function main() {
	loading_state.execute();
	game_animation = window.requestAnimationFrame(main);
}