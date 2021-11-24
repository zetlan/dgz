window.onload = setup;
window.addEventListener("keydown", handleInput, false);

var animation;
var canvas;
var ctx;

var audio_channel1;
var audio_channel2;
var audio_fadeTime = 30;
var audio_tolerance = 1 / 45;
var audio_table = {

};


var board_clearTime = 15;
var board_screenPercentage = 0.925;
var board_width = 10;
var board_height = 20;
var board_linesRequired = 10;
var boards = [];

var framesPerSecond = 60;
var frameTime = 1 / framesPerSecond;





var color_bg_menu = "#A57548";

var color_palettes = [
	//modern
	{
		clearColor: "#FFFFFF",
		bg: "#01295F",
		mg: "#5D5E83",
		lines: "#FFFFFF",
		pColors: {
			"I": "#00FFFF",
			"J": "#0000FF",
			"L": "#FF8800",
			"O": "#FFFF00",
			"S": "#00FF00",
			"T": "#FF00FF",
			"Z": "#FF0000",
		},
		draw: (color, x, y, size) => {
			ctx.fillStyle = color;
			ctx.globalAlpha = 0.7;
			drawRoundedRectangle(x, y, size, size, size * 0.35);
			ctx.globalAlpha = 1;
			var cs = size * 0.15;
			drawRoundedRectangle(x + cs, y + cs, size - (cs * 2), size - (cs * 2), (size - (cs * 2)) * 0.35);
		}
	}, {
		//classic
		clearColor: "#9bbc0f",
		bg: "#9bbc0f",
		mg: "#8bac0f",
		lines: "#8bac0f",
		pColors: {
			"I": "#306230",
			"J": "#306230",
			"L": "#306230",
			"O": "#306230",
			"S": "#0f380f",
			"T": "#0f380f",
			"Z": "#0f380f",
		},
		draw: (color, x, y, size) => {
			ctx.fillStyle = color;
			ctx.fillRect(x, y, size+1, size+1);
		}
	}]
var controls_single = [

]

var controls_double = {
	p1: [],
	p2: []
}




var game_levels = [];

/*
0 - menu
1 - endless tetris
2 - sprint
3 - local competition??
*/
var game_state = 0;
var game_substate = 0;


var menu_buttons = [
	[`Endless (modern)`, `game_state = 1; boards[0] = new System_New();`],
	[`Endless (classic)`, `game_state = 1; boards[0] = new System_Old();`]
	[`Sprint`, `game_state = 2; boards[0] = new System_New();`],
	[`2 Player Competition`, `game_state = 3; boards[0] = new System_New(); boards[1] = new System_New();`],
	[`Settings`, ``],
	[`About`, ``],
]
var menu_buttonSelected = [];



//T, L, R, Z, S, O, I
//each piece is stored in the format [data, centerCoords]
//data stores the positions of the blocks, and centerCoords says where the reference point of those blocks are.
//Data is 4 hex characters, because the array is 4x4 and each hex character can be 4 bits (0000 - 1111)
var piece_pos = {
	//the I piece is weird
	"I": [
		["0F00", [0, 1]],
		["2222", [0, 1]],
		["00F0", [0, 1]],
		["4444", [0, 1]]
	],
	"J": [
		["8E00", [1, 2]],
		["6440", [1, 2]],
		["0E20", [1, 2]],
		["44C0", [1, 2]]
	],
	"L": [
		["2E00", [1, 2]],
		["4460", [1, 2]],
		["0E80", [1, 2]],
		["C440", [1, 2]],
	],
	"O": [
		["CC00", [0, 2]],
		["CC00", [0, 2]],
		["CC00", [0, 2]],
		["CC00", [0, 2]]
	],
	"S": [
		["6C00", [1, 2]],
		["4620", [1, 2]],
		["06C0", [1, 2]],
		["8C40", [1, 2]]
	],
	"T": [
		["4E00", [0, 2]],
		["4640", [0, 2]],
		["0E40", [0, 2]],
		["4C40", [0, 2]]
	],
	"Z": [
		["C600", [1, 2]],
		["2640", [1, 2]],
		["0C60", [1, 2]],
		["4C80", [1, 2]]
	],
};

//kicks say which alternative positions a piece can move to when being rotated. This helps with awkwardness at the side walls, 
//for example, where a pure rotation would put the piece into the wall.
var piece_kicks_standard = {
	"0>>1": [[-1,0], [-1,1], [0,-2], [-1,-2]],
	"1>>2": [[1, 0], [1, -1], [0, 2], [1, 2]],
	"2>>3": [[1, 0], [1, 1], [0, -2], [1, -2]],
	"3>>0": [[-1, 0], [-1, -1], [0, 2], [-1, 2]],

	"1>>0": [[1, 0],[1,-1],[0, 2],[1, 2]],
	"2>>1": [[-1, 0], [-1, 1], [0, -2], [-1, -2]],
	"3>>2": [[-1, 0], [-1, -1], [0, 2], [-1, 2]],
	"0>>3": [[1, 0], [1, 1], [0, -2], [1, -2]],
}
var piece_kicks_i = {
	"0>>1": [[-2, 0], [1, 0], [-2, -1], [1, 2]],
	"1>>2": [[-1, 0], [2, 0], [-1, 2], [2, -1]],
	"2>>3": [[2, 0], [-1, 0], [2, 1], [-1, -2]],
	"3>>0": [[1, 0], [-2, 0], [1, -2], [-2, 1]],

	"1>>0": [[2, 0], [-1, 0], [2, 1], [-1, -2]],
	"2>>1": [[1, 0], [-2, 0], [1, -2], [-2, 1]],
	"3>>2": [[-2, 0], [1, 0], [-2, -1], [1, 2]],
	"0>>3": [[-1, 0], [2, 0], [-1, 2], [2, -1]],
}
var piece_kicks = {
	"I": piece_kicks_i,
	"J": piece_kicks_standard,
	"L": piece_kicks_standard,
	"O": {
		"0>>1": [], "1>>2": [], "2>>3": [], "3>>0": [],
		"1>>0": [], "2>>1": [], "3>>2": [], "0>>3": [],
	},
	"S": piece_kicks_standard,
	"T": piece_kicks_standard,
	"Z": piece_kicks_standard,
}

let state_functions_main = [
	menu_execute,
	endless_execute,
	sprint_execute,
	competition_execute,
]
let state_functions_keyPress = [
	menu_handleKeyPress,
	game_handleKeyPress,
	game_handleKeyPress,
	competition_handleKeyPress
]

function handleInput(a) {
	state_functions_keyPress[game_state](a);
}

function setup() {
	canvas = document.getElementById("cromer");
	ctx = canvas.getContext("2d");

	animation = window.requestAnimationFrame(main);
}

function main() {
	state_functions_main[game_state]();
	animation = window.requestAnimationFrame(main);
}


//game mode functions

function menu_execute() {
	//background
	ctx.fillStyle = color_palettes[0].bg;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	switch (game_substate) {
		case 0:
			break;
		case 1:
			//display controls
			break;
		case 2:
			//display results of last game
			break;
	}
}

//switches to a different state, depending on which button is selected
function menu_switchState() {

}

function menu_handleKeyPress(a) {

}

function endless_execute() {
	//background
	ctx.fillStyle = boards[0].palette.bg;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	boards[0].tick();
	boards[0].beDrawn(canvas.width / 2, canvas.height / 2);
}

function game_handleKeyPress(a) {
	switch (a.keyCode) {
		//shifts by one block
		case 37:
			boards[0].movePiece(-1, 0);
			break;
		case 39:
			boards[0].movePiece(1, 0);
			break;
		case 40:
			boards[0].score += +boards[0].movePiece(0, 1);
			break;

		//z + x to rotate
		case 90:
			boards[0].twistPiece(1);
			break;
		case 88:
			boards[0].twistPiece(-1);
			break;

		//c for storage
		case 67:
			boards[0].storePiece();
			break;

		//space for hard drop
		case 32:
			boards[0].hardDrop();
			break;


		//hold box
	}
}

function sprint_execute() {

}

function competition_execute() {

}

function competition_handleKeyPress(a) {

}