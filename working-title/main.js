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


var game_state = 0;
var game_map;

var players = [];



function setup() {
	canvas = document.getElementById("kapbsras");
	ctx = canvas.getContext("2d");

	players.push(new Ship(0.5, 0.5, "#00F"));
	game_map = map_test;

	setCanvasPreferences();
	
	//maps_load();
	animation = window.requestAnimationFrame(main);
}

function setCanvasPreferences() {
	ctx.textBaseline = "middle";
	ctx.imageSmoothingEnabled = false;
	var size = Math.min(window.innerWidth, window.innerHeight);
	canvas.width = size * 0.9;
	canvas.height = size * 0.9;
}

//main functions
function main() {
	switch (game_state) {
		//run the game normally
		case 0:
			execute_game();
			break;
	}

	//call self
	animation = window.requestAnimationFrame(main);
}






function execute_game() {
	ctx.fillStyle = game_map.bg;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	//handle everything
	game_map.objects.forEach(o => {
		o.beDrawn();
		o.tick();
	});


	players.forEach(p => {
		p.beDrawn();
		p.tick();
	});
}


function execute_menu() {

}










//event handlers
function handleKeyPress(a) {
	switch (a.code) {
		//p1
		case 'ArrowLeft':
			players[0].aa = -1;
			break;
		case 'ArrowUp':
			players[0].av = 1;
			break;
		case 'ArrowRight':
			players[0].aa = 1;
			break;
		case 'ArrowDown':
			players[0].av = -1;
			break;
		case 'Slash':
			break;


		//p2
		case 'KeyS':
			break;
		case 'KeyE':
			break;
		case 'KeyF':
			break;
		case 'KeyD':
			break;
		case 'KeyQ':
			break;
	}
}

function handleKeyNegate(a) {
	switch (a.code) {
		//p1
		case 'ArrowLeft':
			players[0].aa = Math.max(0, players[0].aa);
			break;
		case 'ArrowUp':
			players[0].av = Math.min(0, players[0].av);
			break;
		case 'ArrowRight':
			players[0].aa = Math.min(0, players[0].aa);
			break;
		case 'ArrowDown':
			players[0].av = Math.max(0, players[0].av);
			break;
		case 'Slash':
			break;


		//p2
		case 'KeyS':
			break;
		case 'KeyE':
			break;
		case 'KeyF':
			break;
		case 'KeyD':
			break;
		case 'KeyQ':
			break;
	}
}

function handleMouseDown(a) {

}

function handleMouseMove(a) {

}

function handleMouseUp(a) {

}