//houses html interactivity, setup, and main function

window.onload = setup;
window.addEventListener("keydown", handleKeyPress, false);
window.addEventListener("keyup", handleKeyNegate, false);
document.addEventListener('pointerlockchange', handleCursorLockChange, false);
document.addEventListener('mozpointerlockchange', handleCursorLockChange, false);

//global variables
var canvas;
var ctx;
var centerX;
var centerY;

var controls_cursorLock = false;
var controls_sensitivity = 100;

var editor_active = false;
var noclip_active = false;

let page_animation;
let player;

var world_bg = "#002";
var world_pRandValue = 1.241;
var world_starDistance = 10000;
let world_objects = [];
let world_binTree;

var render_crosshairSize = 10;
var render_clipDistance = 0.1;
var render_identicalPointTolerance = 0.00001;




//setup function
function setup() {
	canvas = document.getElementById("cornh");
	ctx = canvas.getContext("2d");
	ctx.lineWidth = 2;
	ctx.lineJoin = "round";

	//cursor movements setup
	canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;
	document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;

	canvas.onclick = function() {canvas.requestPointerLock();}

	centerX = canvas.width * 0.5;
	centerY = canvas.height * 0.5;

	player = new Player(0, 8, 0, 0, 0);

	//setting up world
	
	world_objects = [new Floor(0, -0.01, 0, 5000, 5000, "#868"),
					//box
					new FreePoly([[0, 0, 10], [0, 0, -10], [10, 10, -10], [10, 10, 10]], "#FFF"),
					new WallX(100, 10, 0, 10, 10, "#088"), new WallX(120, 10, 0, 10, 10, "#088"),
					new WallZ(110, 10, -10, 10, 10, "#068"), new WallZ(110, 10, 10, 15, 10, "#068"),
					
					//house
					//house outside walls
					
					new WallZ(0, 15, -130, 50, 15, "#FB6"),
					new WallZ(0, 15, -220, 50, 15, "#FB6"), 
					new WallX(50, 15, -175, 45, 15, "#EA8"),
					new WallX(-50, 25, -175, 45, 5, "#EA8"),
					new WallX(-50, 15, -200, 20, 15, "#EA8"),
					new WallX(-50, 15, -150, 20, 15, "#EA8"),

					
					//house stairs
					new FreePoly([[0, 0, -200], [0, 0, -219], [38, 20, -219], [38, 20, -200]], "#A60"),

					new FreePoly([[-103, 12, 9], [-81, 12, -33], [-116, 12, -37]], "#000")
					]; 
	world_stars = [];

	generateStarSphere();
	generateStaircase();
	generateBinTree();

	page_animation = window.requestAnimationFrame(main);
}

function main() {
	//drawing background
	ctx.fillStyle = world_bg;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	//handling entities
	player.tick();
	//player buffer position
	player.posBuffer = [];

	//handling stars
	for (var c=0;c<world_stars.length;c++) {
		world_stars[c].tick();
		world_stars[c].beDrawn();
	}
	world_binTree.traverse(true);

	//updating player position based on forces
	for (var a=0;a<player.posBuffer.length;a++) {
		player.x += player.posBuffer[a][0];
		player.y += player.posBuffer[a][1];
		player.z += player.posBuffer[a][2];
	}

	world_binTree.traverse(false);

	

	//crosshair
	if (noclip_active) {
		ctx.strokeStyle = "#AFF";
		ctx.rect(centerX - (render_crosshairSize / 2), centerY - (render_crosshairSize / 2), render_crosshairSize, render_crosshairSize);
		ctx.stroke();
	}

	//crosshair 2
	if (editor_active) {
		ctx.strokeStyle = "#FFF";
		//starting pos
		var center = polToCart(player.theta, player.phi, 5);
		center = [center[0] + player.x, center[1] + player.y, center[2] + player.z];

		//jumping-off points
		var xPlus = [center[0] + (render_crosshairSize / 20), center[1], center[2]];
		var yPlus = [center[0], center[1] + (render_crosshairSize / 20), center[2]];
		var zPlus = [center[0], center[1], center[2] + (render_crosshairSize / 20)];

		//transforming lines to screen coordinates
		[center, xPlus, yPlus, zPlus] = [spaceToScreen(center), spaceToScreen(xPlus), spaceToScreen(yPlus), spaceToScreen(zPlus)];

		//drawing lines
		ctx.strokeStyle = "#F00";
		drawPoly("#F00", [center, xPlus]);
		ctx.strokeStyle = "#0F0";
		drawPoly("#0F0", [center, yPlus]);
		ctx.strokeStyle = "#00F";
		drawPoly("#00F", [center, zPlus]);
	}
	

	//call self
	//player.y += 0.1;
	page_animation = window.requestAnimationFrame(main);
}

//input handling
function handleKeyPress(a) {
	switch(a.keyCode) {
		//player controls
		// a/d
		case 65:
			player.ax = -1 * player.speed;
			break;
		case 68:
			player.ax = player.speed;
			break;
		// w/s
		case 87:
			player.az = player.speed;
			break;
		case 83:
			player.az = -1 * player.speed;
			break;

		//space
		case 32:
			if (player.onGround) {
				player.onGround = false;
				player.dy = 2.5;
			}
			break;

		//camera controls
		case 37:
			player.dt = -1 * player.sens;
			break;
		case 38:
			player.dp = player.sens;
			break;
		case 39:
			player.dt = player.sens;
			break;
		case 40:
			player.dp = -1 * player.sens;
			break;

		case 219:
			noclip_active = !noclip_active;
			player.dy = 0;
			break;
		case 221:
			ctx.lineWidth = 2;
			editor_active = !editor_active;
			break;
	}
}

function handleKeyNegate(a) {
	switch(a.keyCode) {
		//player controls
		// a/d
		case 65:
			if (player.ax < 0) {
				player.ax = 0;
			}
			break;
		case 68:
			if (player.ax > 0) {
				player.ax = 0;
			}
			break;
		// w/s
		case 87:
			if (player.az > 0) {
				player.az = 0;
			}
			break;
		case 83:
			if (player.az < 0) {
				player.az = 0;
			}
			break;


		//camera controls
		case 37:
			if (player.dt < 0) {
				player.dt = 0;
			}
			break;
		case 38:
			if (player.dp > 0) {
				player.dp = 0;
			}
			break;
		case 39:
			if (player.dt > 0) {
				player.dt = 0;
			}
			break;
		case 40:
			if (player.dp < 0) {
				player.dp = 0;
			}
			break;
	}
}

function handleCursorLockChange() {
	if (document.pointerLockElement === canvas || document.mozPointerLockElement === canvas) {
		controls_cursorLock = true;
		document.addEventListener("mousemove", handleMouseMove, false);
	} else {
		controls_cursorLock = false;
		document.removeEventListener("mousemove", handleMouseMove, false);
	}
}

function handleMouseMove(a) {
	player.theta += a.movementX / controls_sensitivity;
	player.phi -= a.movementY / controls_sensitivity;
	if (Math.abs(player.phi) > Math.PI / 2.02) {
		if (player.phi < 0) {
			player.phi = Math.PI / -2.01;
		} else {
			player.phi = Math.PI / 2.01;
		}
	}
}