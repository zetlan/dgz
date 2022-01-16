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

var audioSource;

var b64_encode = `0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+=`;
var b64_decode = {
	"0": 0, "1": 1, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9,
	"a": 10, "b": 11, "c": 12, "d": 13, "e": 14, "f": 15, "g": 16, "h": 17, "i": 18, "j": 19,
	"k": 20, "l": 21, "m": 22, "n": 23, "o": 24, "p": 25, "q": 26, "r": 27, "s": 28, "t": 29,
	"u": 30, "v": 31, "w": 32, "x": 33, "y": 34, "z": 35, "A": 36, "B": 37, "C": 38, "D": 39,
	"E": 40, "F": 41, "G": 42, "H": 43, "I": 44, "J": 45, "K": 46, "L": 47, "M": 48, "N": 49,
	"O": 50, "P": 51, "Q": 52, "R": 53, "S": 54, "T": 55, "U": 56, "V": 57, "W": 58, "X": 59,
	"Y": 60, "Z": 61, "+": 62, "=": 63
};

var ctx;
var canvas;

var camera;

var color_bgDance = "#000000";
var color_bgMenu = "#be873a";
var color_editor_bg = "#333355";
var color_editor_audio = "#f98e4c";
var color_editor_outline = "#de4aff";
var color_keyboardOutline = "#265891";
var color_keyboardFill = "#292345";
var color_player = "#f351ff";
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

var editD_topBarHeight = 0.1;
var editD_audioResolution = 240;

var editM_sBarW = 0.1;

var editor_active = false;
var editor_placing = "1";


var data_persistent = {

};

var game_map;
var game_state;
var game_time = 0;

var mapData_starsMax = 4;
var map_sqSize = 16;
var map_parallaxF = 0.6;
var map_parallaxC = 1.4;
var maps;

var player = new Player(0, 8);
var player_physRepeats = 2;


function setup() {
	canvas = document.getElementById("kapbsras");
	ctx = canvas.getContext("2d");
	setCanvasPreferences();
	loadMaps();

	game_state = new State_Loading();//new State_Main(map_test);
	camera = new Camera(0, 0);
	
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
	game_state.handleKeyNegate(a);
}

function handleMouseDown(a) {
	cursor_down = true;
	game_state.handleMouseDown(a);
}

function handleMouseMove(a) {
	var canvasArea = canvas.getBoundingClientRect();
	cursor_x = a.clientX - canvasArea.left;
	cursor_y = canvas.height - (a.clientY - canvasArea.top);
}

function handleMouseUp(a) {
	cursor_down = false;
	game_state.handleMouseUp(a);
}