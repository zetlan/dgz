window.onload = setup;
window.addEventListener("keydown", handleInput, false);

var animation;
var canvas;
var ctx;

var controls_single = [

]

var controls_double = {
	p1: [],
	p2: []
}




//classes because... yes
class Board {
	constructor() {

	}

	beDrawn() {

	}
}





var game_size = [10, 20];
var game_levels = [];

/*
0 - title screen
1 - menu
2 - modern tetris
3 - NES tetris
4 - sprint
5 - local competition??
*/
var game_state = 0;

let state_functions_main = [
	title_execute,
	menu_execute,
	endless_execute,
	sprint_execute,
	competition_execute,
]
let state_functions_keyPress = [
	title_handleKeyPress,
	menu_handleKeyPress,
	game_handleKeyPress,
	game_handleKeyPress,
	game2_handleKeyPress
]

function handleInput(a) {
	//different behavior depending on game state
	switch (game_state) {
		case 0:
			break;
	}
	//arrow keys
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
function doTitleScreen() {

}

function doMenu() {

}

function doEndless() {

}

function doSprint() {

}

function doCompetition() {

}