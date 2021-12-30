//events
window.onload = setup;
window.addEventListener("keydown", handleKeyPress, false);
window.addEventListener("keyup", handleKeyNegate, false);
window.addEventListener("mousemove", handleMouseMove, false);
window.addEventListener("mousedown", handleMouseDown, false);
window.addEventListener("mouseup", handleMouseUp, false);
window.addEventListener("resize", setCanvasPreferences);


var animation;

var ctx;
var canvas;

var game_state = -1;
var game_map;



function setup() {
	canvas = document.getElementById("kapb");
	ctx = canvas.getContext("2d");

	camera = new Camera(0, 0, camera_scaleDefault);
	loading_state = new State_Menu();
	player = new Player(1, 0, color_player);

	setCanvasPreferences();
	
	//maps_load();
	animation = window.requestAnimationFrame(main);
}

function setCanvasPreferences() {
	ctx.textBaseline = "middle";
	ctx.imageSmoothingEnabled = false;
	var size = Math.min(window.innerWidth * 0.8, window.innerHeight * 0.8);
	canvas.width = size;
	canvas.height = size;
}

function main() {
	switch (game_state) {

	}
}

function handleKeyPress(a) {

}

function handleKeyNegate(a) {

}

function handleMouseDown(a) {

}

function handleMouseMove(a) {

}

function handleMouseUp(a) {
	
}