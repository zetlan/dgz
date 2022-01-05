//events
window.onload = setup;
window.addEventListener("keydown", handleKeyPress, false);
window.addEventListener("keyup", handleKeyNegate, false);
window.addEventListener("mousemove", handleMouseMove, false);
window.addEventListener("mousedown", handleMouseDown, false);
window.addEventListener("mouseup", handleMouseUp, false);
window.addEventListener("resize", setCanvasPreferences);


var animation;
var atx;
var ctx;
var canvas;

var color_bgDance = "#000000";
var color_editor_bg = "#333355";
var color_editor_audio = "#f98e4c";
var color_keyboardOutline = "#265891";
var color_keyboardFill = "#292345";
var color_text = "#8652a6";

var cursor_x;
var cursor_y;
var cursor_down = false;

var dance_layout = [
	`QWERTYUIO`,
	`ASDFGHJK`,
	`ZXCVBNM`
];
var dance_vectors = [[1, 0], [0.5, 1]];
var dance_warmupTime = 60;
var dance_boardHeight = 0.7;
var dance_margin = 0.05;

var dEdit_topBarHeight = 0.1;
var dEdit_audioResolution = 240;

var editor_active = false;


var data_persistent = {

};


var game_state;
var game_time = 0;

var source;

function setup() {
	canvas = document.getElementById("kapbsras");
	ctx = canvas.getContext("2d");
	setCanvasPreferences();

	game_state = new State_Dance(dataDance_test);
	
	//maps_load();
	animation = window.requestAnimationFrame(main);
}

//main functions
function main() {
	game_state.execute();
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
	//sneaky sneaky get audio consent
	if (atx == undefined) {
		//browser security is dumb and bad
		atx = new (window.AudioContext || window.webkitAudioContext)();
	} 

	//universal keys
	if (a.code == "BracketRight") {
		editor_active = !editor_active;
	}
	game_state.handleKeyPress(a);
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