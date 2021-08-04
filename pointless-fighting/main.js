//events
window.onload = setup;
window.addEventListener("keydown", handleKeyPress, false);
window.addEventListener("keyup", handleKeyNegate, false);
window.addEventListener("mousemove", handleMouseMove, false);
window.addEventListener("mousedown", handleMouseDown, false);
window.addEventListener("mouseup", handleMouseUp, false);


//global vars
let animation;

let ctx;
let canvas;

let camera;
var camera_scaleMin = 20;
var camera_scaleMax = 120;
var camera_scaleDefault = 80;

const color_attackBubble = "#47F";
const color_background = "#226";
const color_collision = "#64A";

const color_editor_background = "#335";
const color_editor_border = "#4F4";
const color_editor_selection = "#0FF";

const color_meter_health = "#F44";
const color_meter_stamina = "#FF4";
const color_player = "#F6F";
const color_player_eyes = "#000";
const color_sword = "#368";
const color_text = "#828";
const color_text_light = "#C5C";

var cursor_down = false;
var cursor_x = 0;
var cursor_y = 0;

var data_spriteSize = 20;
var data_palettes = {
	Empty: new Palette_Empty(),
	Terrain: {
		North: new Palette(getImage('images/terrainNorth.png'), data_spriteSize)
	} 
};

var editor_active = false;
var editor_block = " ";
var editor_sidebarWidth = 0.2;

let loading_map;
let loading_state;

var menu_animSpeed = 7;

let player;

var tileImage_key = `0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZαγεηικμνυπρσςτφχψωβΓδΔΛξζΣΞΘθΠλΦΨΩ<^> `;
var tileImage_map = generateTileImageMap();

var world_cCoords = [1, 0, 15, 12];
var world_outsideMapFade = 5;
var world_outsideMapFadeConstant = 5.2;
var world_time = 0;

let world_maps = {};


//main functions
function setup() {
	canvas = document.getElementById("poderVase");
	ctx = canvas.getContext("2d");

	camera = new Camera(0, 0, camera_scaleDefault);
	loading_state = new State_Menu();
	player = new Player(1, 0, color_player);

	setCanvasPreferences();
	
	maps_load();
	animation = window.requestAnimationFrame(main);
}

function main() {
	//bege
	loading_state.execute();

	animation = window.requestAnimationFrame(main);
	world_time += 1;
}

function handleKeyPress(a) {
	loading_state.handleKeyPress(a);
}

function handleKeyNegate(a) {
	loading_state.handleKeyNegate(a);
}

function handleMouseDown(a) {
	cursor_down = true;
	loading_state.handleMouseDown();
}

function handleMouseMove(a) {
	var canvasArea = canvas.getBoundingClientRect();
	cursor_x = a.clientX - canvasArea.left;
	cursor_y = a.clientY - canvasArea.top;

	loading_state.handleMouseMove();
}

function handleMouseUp(a) {
	cursor_down = false;
}