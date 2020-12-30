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

var player_thrusterStrength = 0.025;
var player_maxSpeed = 50;

var game_animation;
var time = -1;

var gameState = 0;
var cutsceneTime = 50;
var gravityDampener = 20;
//the greater dt is, the slower the game is.
var dt = 1;
var dtBase = dt;
var dtMult = 2;

var debStartNum = 0;
var maxDebris = 0;
var maxBelt = 0;
var beltV = 1.56;
var beltCreated = 0;

//all the colors used
var spaceColor = "#222266";
var color_black = "#220";
var color_green = "#0D8";
var color_sun = "#F30";
var color_neutron = "#88F";
var color_rocky = "#886";
var color_text = "#8FC";

var mercColor = "#A7A2A0";
var debrisColor = "#8888FF";

var engineColor = "#6666FF";
var shipColor = "#FFFFFF";
var computeColor = "#307529";
var computeWireColor = "#FFEE25";
var hyperColor = "#3872FF";
var brokenHyperColor = "#5D649C";
var repairColor = "#76AA9F";

var endingColor = "#FF00FF";
var startingColor = "#00FF00";
var stoneColor = "#6F8389";
var blackColor = "#000000";

var powerColor = "#FFD800";
var fuelColor = "#FF9300";
var cTemperColor = "#7CBBFA";
var mTemperColor = "#7CFA80";
var hTemperColor = "#FA917C";

//keycodes for button inputs
//const keycode_w;
//const keycode_a;
//const keycode_s;
//const keycode_d;
const keycode_m = 77;
const keycode_z = 90;

const keycode_left = 37;
const keycode_up = 38;
const keycode_right = 39;
const keycode_down = 40;

const keycode_shift = 16;
const keycode_space = 32;



var menuColor = "#333366";
var color_player = "#FAF";

var teleColor = "#8A4EC3";
var explosionColor = "#FF8800";
var coolExplosionColor = "#4D97C7";

var barsText = ["Power: ", "Temperature: ", "Fuel: "];

//classes exist here, oh boy!
let testSystem = new System(1000, 0);

let loading_system;

let camera = {
	x: 0,
	y: 0,
	scale: 1,
	scale_max: 2,
	scale_min: 1/2,
	scale_speed: 1/32,
	scale_d: 0
};

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

	var [x, y, dx, dy] = calculateOrbitalParameters(loading_system.bodies[0], 60, 60, Math.PI / 3, Math.PI / 3, false);
	character = new Player(x, y, dx, dy);

	//populating the debris field
	for (jc=0;jc<debStartNum;jc++) {
		debrisBits.push(new Debris(sun.x + ((Math.random() - 0.5) * 700), sun.y + ((Math.random() - 0.5) * 700)));
	}

	//calling main
	game_animation = window.requestAnimationFrame(main);
}

function keyPress(h) {
	switch (h.keyCode) { 
		//directional movements
		case 65:
		case keycode_left:
			character.ax = -1 * player_thrusterStrength;
			break;
		case 87:
		case keycode_up:
			character.ay = -1 * player_thrusterStrength;
			break;
		case 68:
		case keycode_right:
			character.ax = 1 * player_thrusterStrength;
			break;
		case 83:
		case keycode_down:
			character.ay = 1 * player_thrusterStrength;
			break;
		
		//numbers for inventory selection

		//special operations
		//m for map view
		case keycode_m:
			if (gameState > 0 && gameState < 3) {
				if (gameState == 1) {
					gameState = 2;
					if (menuPos > 1) {
						menuPos = 1;
					}
					camera.scale = 1 / 128;
				} else {
					gameState = 1;
					camera.scale = 1;
				}
			}
			break;
		//scale out + in
		case keycode_shift:
			camera.scale_d = camera.scale_speed;
			break;
		case keycode_space:
			camera.scale_d = -1 * camera.scale_speed;
			break;
		//z
		case keycode_z:
			if (gameState == 0 && character.timeout == 0) {
				gameState = 1;
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
	case 65:
	//directional movements
	case keycode_left:
		if (character.ax < 0) {
			character.ax = 0;
		}
		break;
	case 87:
	case keycode_up:
		if (character.ay < 0) {
			character.ay = 0;
		}
		break;
	case 68:
	case keycode_right:
		if (character.ax > 0) {
			character.ax = 0;
		}
		break;
	case 83:
	case keycode_down:
		if (character.ay > 0) {
			character.ay = 0;
		}
		break;
	//camera
	case keycode_shift:
		if (camera.scale_d > 0) {
			camera.scale_d = 0;
		}
		break;
	case keycode_space:
		if (camera.scale_d < 0) {
			camera.scale_d = 0;
		}
		break;
	}
}

//this function is the main function that repeats every time the timer goes off. It is very important.
function main() {
	//gamestate 0 is just the splash screen. As such it is entirely text.
	if (gameState == 0) {
		drawSplash();
	} else {
		//gameState specific things, if I add any more game states I'll just make this a switch statement
		if (gameState == 1) {
			camera.scale += camera.scale_d;
			if (camera.scale > camera.scale_max) {
				camera.scale = camera.scale_max;
			}
			if (camera.scale < camera.scale_min) {
				camera.scale = camera.scale_min;
			}

			menuPos += menuIncrement;
			camera.x = character.x;
			camera.y = character.y;
		} else if (gameState == 2) {
			menuPos -= menuIncrement * 3;
			if (menuPos < menuLimit) {
				menuPos = menuLimit;
			}
			camera.x = loading_system.centers[0].x;
			camera.y = loading_system.centers[0].y;
		} else if (gameState == 3) {
			dt *= 1.1;
		}
		
		//drawing background
		ctx.fillStyle = spaceColor;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		
		/*dt affects physics timestepping, not just speed, so if it's too low physics will be unstable. 
		To counteract this, low dt has a fast draw but multiple physics timesteps, so it's accurate as well */
		var physSteps = Math.floor(1 / dt);
		dt *= physSteps;
		for (var g=0; g<physSteps; g++) {
			loading_system.tick();
		}
		dt /= physSteps;
		loading_system.beDrawn();

		//tick time
		time += 1 / dt;
		//drawing the menu goes last, because it needs to be on top of everything.
		drawMenu();
	}
	game_animation = window.requestAnimationFrame(main);
}


function drawMenu() {
	//to save time, only draw the menu if it is in-bounds
	if (menuPos < 1) {
		//drawing menu boxes
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = "#FFF";
		ctx.fillRect(0, canvas.height * menuPos, canvas.width, canvas.height * 0.3);
		ctx.fillRect(0, 0, canvas.width, canvas.height * (1 - (menuPos + 0.1)));
		ctx.globalAlpha = 1;
		//text for all the meters
		ctx.fillStyle = color_text;
		ctx.textAlign = "left";
		ctx.font = "20px Century Gothic";
		ctx.fillText(barsText[0], 12, canvas.height * (menuPos + 0.06));
		ctx.fillText(barsText[1], 12, canvas.height * (menuPos + 0.11));
		ctx.fillText(barsText[2], 12, canvas.height * (menuPos + 0.16));
		ctx.fillText(`Momentum: (${(character.dx).toFixed(3)}, ${(character.dy).toFixed(3)})`, canvas.width * 0.3, canvas.height * (1 - (menuPos + 0.13)));
		
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
		drawMeter(meterX, canvas.height * (menuPos + 0.03), meterWidth, meterHeight, character.pow, 0, 100, powerColor);
		//temp
		drawMeter(meterX, canvas.height * (menuPos + 0.08), meterWidth, meterHeight, character.warm, 0, 100, temperColor);
		//fuel
		drawMeter(meterX, canvas.height * (menuPos + 0.13), meterWidth, meterHeight, character.fuel, 0, 100, fuelColor);
	} else {
		menuPos = 1;
	}
	//sun-pointer
	var dialX = canvas.width * 0.9;
	var dialY = (canvas.height * (0.9 + (menuPos - 1)));
	var angle = Math.PI + Math.atan2((character.x - loading_system.x), (character.y - loading_system.y));
	var l = 20;
	ctx.strokeStyle = color_text;
	ctx.lineWidth = 7;
	ctx.beginPath();
	ctx.ellipse(dialX, dialY, 18, 18, 0, 0, Math.PI * 2);
	ctx.stroke();
	ctx.beginPath();
	ctx.strokeStyle = loading_system.centers[0].color;
	ctx.moveTo(dialX, dialY);
	ctx.lineTo(dialX + (l * Math.sin(angle)), dialY + (l * Math.cos(angle)));
	ctx.stroke();

	//zoom text
	ctx.font = "20px Century Gothic";
	ctx.fillStyle = color_text;
	ctx.textAlign = "left";
	ctx.fillText(`Zoom: ${(camera.scale).toFixed(3)}x`, canvas.width * 0.1, canvas.height * (0.95 + (menuPos - 1)));

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

function spaceToScreen(x, y) {
	x = x - camera.x;
	y = y - camera.y;

	x *= camera.scale;
	y *= camera.scale;

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
	//formula for instantaneous velocity is v = sqrt(GM(2/r - 1/a))
	//position on ellipse is (length * cos(theta), length * sin(theta))
	//length = ab / (sqrt((b * cos(theta))^2 + (a * sin(theta))^2))
	//semi-minor axis is sqrt(periapsis * apoapsis)
	//semi-major axis is apoapsis + periapsis


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

//takes in two points and gets the distance between them
function getDistance(xyP1, xyP2) {
	//setting the second point relative to the first point
	xyP2[0] -= xyP1[0];
	xyP2[1] -= xyP1[1];

	return Math.sqrt((xyP2[0] * xyP2[0]) + (xyP2[1] * xyP2[1]));
}