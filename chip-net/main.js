//globals here
window.onload = setup;
window.addEventListener("keydown", handleKeyPress, false);
window.addEventListener("keyup", handleKeyUp, false);
window.addEventListener("mousedown", handleMouseDown, false);
window.addEventListener("mousemove", handleMouseMove, false);
window.addEventListener("mouseup", handleMouseUp, false);


//global vars
var animation;
var canvas;
var ctx;

var editor_active = false;

var button_altPressed = false;

var cursor_x = 0;
var cursor_y = 0;
var cursor_down = false;

var puzzle = new Puzzle_Preset("0123201232012320123201232", "");
var puzzle_colorSets = [{
		bg: "#AAAAAA", 
		bgLines: "#666666",
		generators: ["#000000"],
		wireUnlit: "#000000",
		wireLit: "#00FFFF",
	}, {

	}
]
var puzzle_screenSize = 0.9;

var rotation_speed = 0.1;



//functions

function setup() {
	canvas = document.getElementById("caaaaa");
	ctx = canvas.getContext("2d");
	ctx.lineWidth = 2;
	ctx.lineJoin = "round";
	ctx.lineCap = "square";
	animation = window.requestAnimationFrame(main);
}

function main() {
	puzzle.display();
	puzzle.tick();
	
	animation = window.requestAnimationFrame(main);
}

function handleMouseDown(a) {
	cursor_down = true;

	//rotate the square the user has clicked on
	var radius = canvas.height * puzzle_screenSize * 0.5;
	var squareSize = (radius * 2) / puzzle.data.length;

	var startX = canvas.width * 0.5 - radius;
	var startY = canvas.height * 0.5 - radius;

	var squareX = Math.floor((cursor_x - startX) / squareSize);
	var squareY = Math.floor((cursor_y - startY) / squareSize);

	if (squareX >= 0 && squareX < puzzle.data[0].length && squareY >= 0 && squareY < puzzle.data.length) {
		puzzle.data[squareY][squareX].rotDir = boolToSigned(button_altPressed);
		console.log(boolToSigned(button_altPressed));
		
	}
}

function handleMouseMove(a) {
	var canvasArea = canvas.getBoundingClientRect();
	cursor_x = a.clientX - canvasArea.left;
	cursor_y = a.clientY - canvasArea.top;
}

function handleMouseUp(a) {
	cursor_down = false;
}

function handleKeyPress(a) {
	if (a.keyCode == 18) {
		button_altPressed = true;
	}
}

function handleKeyUp(a) {
	if (a.keyCode == 18) {
		button_altPressed = false;
	}
}