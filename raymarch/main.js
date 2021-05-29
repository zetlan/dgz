
window.onload = setup;
window.addEventListener("keydown", handleKeyPress, false);
window.addEventListener("keyup", handleKeyNegate, false);
document.addEventListener('pointerlockchange', handleCursorLockChange, false);
document.addEventListener('mozpointerlockchange', handleCursorLockChange, false);


var bg_min = 30;
var bg_max = 30;

var canvas;
var ctx;

var camera_FOV = 1.5;
var camera_planeOffset = 1;
var camera;

var color_editor_bg = "#220073";
var color_editor_border = "#FF00FF";

var controls_cursorLock = false;
var controls_shiftPressed = false;
var controls_sensitivity = 0.01;

var editor_active = false;


//ray properties
var ray_maxDist = 9999;
var ray_minDist = 0.1;
var ray_maxIters = 1000;

var page_animation;

var render_cornerCoords = [0, 0, 0, 0];
var render_pixelSize = 10;
var render_shadowPercent = 0.2;

var world_time = 0;

var loading_world = worldData_start;
var loading_editor = new Editor();




//setup
function setup() {
	canvas = document.getElementById("cancan");
	ctx = canvas.getContext("2d");

	canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;
	document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;
	canvas.onclick = function() {canvas.requestPointerLock();}

	camera = new Camera(loading_world, loading_world.spawn[0], loading_world.spawn[1], loading_world.spawn[2]);
	render_cornerCoords = [0, 0, canvas.width, canvas.height];

	page_animation = window.requestAnimationFrame(main);
}

//loop loop loop loop
function main() {
	world_time += 1;
	//tick all world objects
	loading_world = camera.world;
	camera.tick();
	loading_world.objects.forEach(o => {
		o.tick();
	});
	draw();

	

	//editor stuff
	if (editor_active) {
		loading_editor.beDrawn();
	}

	page_animation = window.requestAnimationFrame(main);
}

function draw() {
	//draw everything
	var pixelWidth = (render_cornerCoords[2] - render_cornerCoords[0]) / render_pixelSize;
	var pixelHeight = (render_cornerCoords[3] - render_cornerCoords[1]) / render_pixelSize;

	var multiple = camera_FOV / pixelWidth;

	var xDir = polToCart(camera.theta + (Math.PI / 2), 0, 1);
	var yDir = polToCart(camera.theta, camera.phi - (Math.PI / 2), 1);
	var zDir = polToCart(camera.theta, camera.phi, camera_planeOffset);
	var trueDir;
	var magnitude;

	for (var x=0; x<pixelWidth; x++) {
		for (var y=0; y<pixelHeight; y++) {
			var xMult = multiple * (x - pixelWidth / 2);
			var yMult = multiple * (y - pixelWidth / 2);

			//create a ray and iterate until complete
			trueDir = [
				xDir[0] * xMult + yDir[0] * yMult + zDir[0],
				xDir[1] * xMult + yDir[1] * yMult + zDir[1], 
				xDir[2] * xMult + yDir[2] * yMult + zDir[2]
			]
			magnitude = Math.sqrt(trueDir[0] * trueDir[0] + trueDir[1] * trueDir[1] + trueDir[2] * trueDir[2]);
			trueDir[0] /= magnitude;
			trueDir[1] /= magnitude;
			trueDir[2] /= magnitude;
			new Ray(camera.world, camera.x, camera.y, camera.z, trueDir, x, y).iterate(0);
		}
	}
}


function handleKeyPress(a) {
	//handling controls for camera
	switch (a.keyCode) {
		case 65:
		case 37:
			camera.ax = -camera.speed;
			break;
		case 87:
		case 38:
			camera.az = camera.speed;
			break;
		case 68:
		case 39:
			camera.ax = camera.speed;
			break;
		case 83:
		case 40:
			camera.az = -camera.speed;
			break;
		case 16:
			controls_shiftPressed = true;
			break;
		case 32:
			camera.jump();
			break;
		
		//toggling editor
		case 221:
			loading_editor.toggle();
			break;
	}
}

function handleKeyNegate(a) {
	switch(a.keyCode) {
		case 65:
		case 37:
			if (camera.ax < 0) {
				camera.ax = 0;
			}
			break;
		case 87:
		case 38:
			if (camera.az > 0) {
				camera.az = 0;
			}
			break;
		case 68:
		case 39:
			if (camera.ax > 0) {
				camera.ax = 0;
			}
			break;
		case 83:
		case 40:
			if (camera.az < 0) {
				camera.az = 0;
			}
			break;
		case 16:
			controls_shiftPressed = false;
			break;
	}
}

function handleCursorLockChange() {
	console.log(`cursor lock is changing`);
	if (document.pointerLockElement === canvas || document.mozPointerLockElement === canvas) {
		controls_cursorLock = true;
		document.addEventListener("mousemove", handleMouseMove, false);
	} else {
		controls_cursorLock = false;
		document.removeEventListener("mousemove", handleMouseMove, false);
	}
}

function handleMouseMove(a) {
	camera.theta += a.movementX * controls_sensitivity;
	camera.phi -= a.movementY * controls_sensitivity;
	if (Math.abs(camera.phi) > Math.PI / 2.02) {
		if (camera.phi < 0) {
			camera.phi = Math.PI / -2.01;
		} else {
			camera.phi = Math.PI / 2.01;
		}
	}
}