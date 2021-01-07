window.addEventListener("keydown", keyPress, false);
window.addEventListener("keyup", keyNegate, false);
//setting up variables for later
var canvas;
var ctx;
var centerX;
var centerY;

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
const color_purple = "#808";
const color_ring = "#FFF";
const color_rocky = "#868";
const color_space = "#226";
const color_star_neutron = "#0DF";
const color_star_sun = "#FB0";
const color_star_warm = "#F30";
const color_ship = "#F8F";
const color_shop = "#DAF";
const color_shop_dark = "#C7C";
const color_shop_glow = "#FB0";
const color_text = "#8FC";
const color_water = "#88F";

var display_orbitOpacity = 0.2;
var display_menuOpacity = 0.2;

var debris_startNum = 0;
var debris_maxNum = 0;
var debris_minSize = 0.3;

//DT stuff. the greater dt is, the slower the game is.
var dt = 1;
var dt_base = 3;
var dt_values = [8, 4, 2, 1, 1/2, 1/4, 1/8, 1/20, 1/50, 1/100];
var dt_selector = dt_base;

var computeColor = "#307529";
var computeWireColor = "#FFEE25";
var hyperColor = "#3872FF";
var brokenHyperColor = "#5D649C";
var repairColor = "#76AA9F";

var endingColor = "#FF00FF";
var startingColor = "#00FF00";
var stoneColor = "#6F8389";

var powerColor = "#FFD800";
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
var player_fuelEfficiency = 4;
var player_turnStrength = 0.025;
var player_turnSpeedMax = 0.2;


var menuColor = "#333366";

//objects here




let character;

window.onload = setup;
// the initializing function.
function setup() {
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
	ctx.imageSmoothingEnabled = false;

	centerX = canvas.width / 2;
	centerY = canvas.height / 2;

	initWorld();

	loading_system = system_main;
	
	var [x, y, dx, dy] = calculateOrbitalParameters(system_main, 2000, 2000, Math.PI * 0, 0.1, false);
	character = new Player(x, y, dx, dy);
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
			character.acc = true;
			break;
		case keycode_d:
		case keycode_right:
			character.aa = player_turnStrength;
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
			loading_camera.scale_d = loading_camera.scale_speed;
			break;
		case keycode_space:
			loading_camera.scale_d = -1 * loading_camera.scale_speed;
			break;

		//starting / restarting game
		case keycode_z:
			if (loading_state.id == "splash" && character.timeout == 0) {
				loading_state = new State_World();
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
	h.preventDefault();
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
	loading_state.tick();
	game_animation = window.requestAnimationFrame(main);
}

//this function has the function calls that occurr for the simulation to run, without all the extra stuff that normally happens in main
function trueMain() {
	//most of these are recursive functions that call for every body when called on loading_system. 
	//The exceptions are the ones with loading_debris, which have forEach loops,
	loading_system.spliceIncorrect();
	loading_system.gravitateAll();
	loading_system.pullChildren();
	
	loading_debris.forEach(a => {
		loading_system.gravitateToArray(a);
	});
	
	loading_system.tick();
	loading_debris.forEach(a => {a.tick();});

	game_time += 1 / dt;
}


function drawMenu() {
	//to save time, only draw the menu if it is in-bounds
	if (menuPos < 1) {
		//drawing menu boxes
		ctx.globalAlpha = display_menuOpacity;
		ctx.fillStyle = "#FFF";
		ctx.fillRect(0, canvas.height * menuPos, canvas.width, canvas.height * 0.3);
		ctx.globalAlpha = 1;
		//text for all the meters
		ctx.fillStyle = color_text;
		ctx.textAlign = "left";
		ctx.font = "20px Century Gothic";
		ctx.fillText("Power: ", 12, canvas.height * (menuPos + 0.06));
		ctx.fillText("Temperature: ", 12, canvas.height * (menuPos + 0.11));
		ctx.fillText("Fuel: ", 12, canvas.height * (menuPos + 0.16));
		
		//timer and effects

		ctx.globalAlpha = 1;
		//meters now
		//determining the color of the temperature meter
		var temperColor = hTemperColor;
		if (character.warm < 67) {
			temperColor = mTemperColor
		}
		if (character.warm < 33) {
			temperColor = cTemperColor;
		}

		var meterX = canvas.width * 0.4;
		var meterWidth = canvas.width * 0.5;
		var meterHeight = canvas.height * 0.04;
		//solar
		drawMeter(meterX, canvas.height * (menuPos + 0.03), meterWidth, meterHeight, character.power, 0, 100, powerColor);
		//temp
		drawMeter(meterX, canvas.height * (menuPos + 0.08), meterWidth, meterHeight, character.warm, 0, 100, temperColor);
		//fuel
		drawMeter(meterX, canvas.height * (menuPos + 0.13), meterWidth, meterHeight, character.fuel, 0, 100, color_fuel);
	} else {
		menuPos = 1;
	}
	//sun-pointer
	var dialR = 12;
	var dialX = canvas.width - (dialR * 1.8);
	var dialY = dialR * 1.6;
	var dialAngle = Math.PI + Math.atan2(character.x - character.parent.x, character.y - character.parent.y);
	var l = dialR + 2;

	var momentumAngle = Math.atan2(character.dx - character.parent.dx, character.dy - character.parent.dy);
	var momentumAmount = Math.sqrt(((character.dx - character.parent.dx) * (character.dx - character.parent.dx)) + ((character.dy - character.parent.dy) * (character.dy - character.parent.dy)));

	ctx.fillStyle = color_ship;
	ctx.lineWidth = dialR / 6;
	ctx.globalAlpha = 1;
	ctx.beginPath();
	ctx.ellipse(dialX, dialY, dialR, dialR, 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.beginPath();
	ctx.strokeStyle = character.parent.color;
	ctx.moveTo(dialX, dialY);
	ctx.lineTo(dialX + (l * Math.sin(dialAngle)), dialY + (l * Math.cos(dialAngle)));
	ctx.stroke();

	//zoom text
	ctx.font = "20px Century Gothic";
	ctx.fillStyle = color_text;
	ctx.textAlign = "center";
	ctx.fillText(`Zoom: ${(loading_camera.scale).toFixed(3)}x`, canvas.width * 0.2, (dialR * 1.8));
	ctx.fillText(`Time: ${(1 / dt).toFixed(3)}x`, canvas.width * 0.2, (dialR * 3.6));
	ctx.fillText(`Momentum: (${(momentumAmount).toFixed(3)} km/s, ${(((momentumAngle / Math.PI) * 180) + 180).toFixed(1)}°)`, canvas.width * 0.65, canvas.height * (1 - (menuPos + 0.13)));
	ctx.globalAlpha = 1;

}

function drawSplash() {
	ctx.fillStyle = menuColor;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = color_text;
	ctx.textAlign = "center";
	ctx.font = "45px Century Gothic";
	ctx.fillText("Space", centerX - 5, 50);
	ctx.font = "30px Century Gothic";
	ctx.fillText("Press Z to begin", centerX, centerY);
}

function drawMeter(x, y, width, height, value, min, max, color) {
	var percentage = value / (max - min);
	ctx.strokeStyle = color;
	ctx.fillStyle = color;
	ctx.lineWidth = "2";
	ctx.beginPath();
	ctx.rect(x, y, width, height);
	ctx.stroke();
	ctx.fillRect(x+3, y+3, (width - 6) * percentage, height-6);
}



//utility functions
//takes in an x, y screen coordinate as well as a tolerance, and returns whether that is inside the screen or not. 
//Tolerance is the amount the object can be off the screen by and still be counted.
function isOnScreen(x, y, r) {
	//x offscreen
	if (x + r < 0) {
		return false;
	}
	if (x - r > canvas.width) {
		return false;
	}

	//y offscreen
	if (y + r < 0) {
		return false;
	}
	if (y - r > canvas.height) {
		return false;
	}
	return true;
}

function spaceToScreen(x, y) {
	x = x - loading_camera.x;
	y = y - loading_camera.y;

	x *= loading_camera.scale;
	y *= loading_camera.scale;

	x += centerX;
	y += centerY;

	return [x, y];
}

//takes in a body to orbit, the orbiting body's mass, the periapsis, and the apoapsis, and returns the velocity at apoapsis for that orbit
function calculateOrbitalVelocity(centerMass, periapsis, apoapsis) {
	if (apoapsis == periapsis) {
		//special case for completely circular orbits
		return Math.sqrt((centerMass / gravityDampener) / apoapsis);
	} else {
		//in an elliptical orbit, the formula is more generalized to v = sqrt(GM(2/r - 1/a)) where
		//G is gravitational constant, M is mass of center obj, r is current distance, and a is the semi-major axis
		//periapsis and apoapsis are always opposite, so I can just add them to get semi-major axis
		return Math.sqrt((centerMass / gravityDampener) * ((2 / apoapsis) - (1 / (periapsis + apoapsis))));
	}
}

//takes in parameters and turns them into x / y, dx / dy
function calculateOrbitalParameters(body, apo, peri, apoA, startA, counterClockwiseBOOLEAN) {
	//formula for instantaneous velocity is v = sqrt(GM(2/r - 1/a)) (vis-viva equation) where r is current distance and a is semi-major axis
	//position on ellipse is (length * cos(theta), length * sin(theta))
	//length = ab / (sqrt((b * cos(theta))^2 + (a * sin(theta))^2))
	//semi-minor axis is sqrt(periapsis * apoapsis)
	//semi-major axis is apoapsis + periapsis

	//if periapsis is greater than apoapsis, assume a mistake and swap them
	if (apo > peri) {
		[apo, peri] = [peri, apo];
		apoA += Math.PI;
		startA += Math.PI;
	}


	//major / minor axes for convienence
	var major = (apo + peri) / 2;
	var minor = Math.sqrt(apo * peri);

	//first calculate position

	//position of planet from center of ellipse
	var lengthToEdge = (major * minor) / (Math.sqrt(Math.pow(minor * Math.cos(startA), 2) + Math.pow(major * Math.sin(startA), 2)));
	var [x, y] = [lengthToEdge * Math.cos(startA + apoA), lengthToEdge * Math.sin(startA + apoA)];

	//position of center of ellipse from parent
	var lengthToCenter = major - peri;
	var [offX, offY] = [lengthToCenter * Math.cos(apoA), lengthToCenter * Math.sin(apoA)];
	x += offX;
	y += offY;


	//calculate velocity
	var currentHeight = Math.sqrt((x * x) + (y * y));
	var velocity = Math.sqrt((body.m / gravityDampener) * ((2 / currentHeight) - (1 / major)));


	//direct velocity based on the start angle
	var orbitAngle = startA + (Math.PI / 2);
	if (counterClockwiseBOOLEAN) {
		orbitAngle += Math.PI;
	}

	var [dx, dy] = [velocity * Math.cos(orbitAngle + apoA), velocity * Math.sin(orbitAngle + apoA)];
	return [x + body.x, y + body.y, dx + body.dx, dy + body.dy];
}

//calculates orbits for 2 bodies in a binary orbit, where they're centered on 0, 0
function calculateBinaryOrbitalParameters(body1, body2) {

}

//takes in two points and gets the distance between them
function getDistance(xyP1, xyP2) {
	//setting the second point relative to the first point
	xyP2[0] -= xyP1[0];
	xyP2[1] -= xyP1[1];

	return Math.sqrt((xyP2[0] * xyP2[0]) + (xyP2[1] * xyP2[1]));
}