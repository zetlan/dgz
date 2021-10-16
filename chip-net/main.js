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

var color_textEditor = "#FF88FF";
var color_styles = [{
	//stony
	bg: "#6e6e6e",
	bgLines: "#333355",
	generators:  ["#008277", "#780074", "#009138", "#000044", "#D2F200", "#A84D02"],
	wireOverload: "#FF0022",
	wireUnlit: "#999999",
}, {
	//classic computer green
	bg: "#006209", 
	bgLines: "#666666",
	generators: ["#77FF52", "#D7A6FF", "#F2AA24"],
	wireUnlit: "#004422",
	wireOverload: "#FF0055",
}, {
	//cool blue
	bg: "#006666",
	bgLines: "#559999",
	generators: ["#9EDFFF", "#74FCA2", "#C67AFF", "#EEB0FF", "#FAFF73", "#FAD27A"],
	wireOverload: "#FF0022",
	wireUnlit: "#000044",
}, {
	//warm orange?
	bg: "#AD6E00",
	bgLines: "#4F3600",
	generators: ["#FFD999", "#CEFF96", "#FAFF75", "#C7D0FF", "#E4BDFF", "#F5DB31"],
	wireOverload: "#FF0022",
	wireUnlit: "#704D11"
}, {
	//cherry tree
	bg: "#f1abf7",
	bgLines: "#FFFFFF",
	generators: ["#8c6214", "#f1f0ff", "#b7ff8a", "#12aae6"],
	wireOverload: "#FF0022",
	wireUnlit: "#c58bc9"
}
]

var editor_active = false;
var editor_placing = " ";
var editor_moving = true;
var editor_x = 0;
var editor_y = 0;

/*
HOW TO USE EDITOR:

] - activate
arrow keys - navigate

~ - toggle wire placing
spacebar - toggle movement
0/9 - set number
C - place Chip with set number (space means any)
G - place Generator with set number (will not place if on space)

*/


var button_altPressed = false;
var button_shiftPressed = false;

var cursor_x = 0;
var cursor_y = 0;
var cursor_down = false;

var dirRelate = [[1, 0], [0, -1], [-1, 0], [0, 1]];

var game_mode = "main";

var puzzle = importPuzzle(data_freeWires);
var puzzle_screenSize = 0.9;
var puzzle_lineWidth = 0.25;
var puzzle_lineMargin = 0.1;

var random_seed = 1.23454584376;

var rotation_speed = 0.2;



//functions

function setup() {
	canvas = document.getElementById("caaaaa");
	ctx = canvas.getContext("2d", {alpha: false});
	setCanvasPreferences();
	animation = window.requestAnimationFrame(main);
}

function main() {
	ctx.fillStyle = "#000";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	puzzle.display();
	puzzle.tick();

	//editor overlay
	if (editor_active) {
		drawEditorOverlay();
	}
	
	animation = window.requestAnimationFrame(main);
}

function handleMouseDown(a) {
	cursor_down = true;

	//rotate the square the user has clicked on
	var squareSize = (canvas.height * puzzle_screenSize) / puzzle.data.length;

	var startX = canvas.width * 0.5 - (squareSize * puzzle.data[0].length * 0.5);
	var startY = canvas.height * 0.5 - (squareSize * puzzle.data.length * 0.5);

	var squareX = Math.floor((cursor_x - startX) / squareSize);
	var squareY = Math.floor((cursor_y - startY) / squareSize);

	if (squareX >= 0 && squareX < puzzle.data[0].length && squareY >= 0 && squareY < puzzle.data.length) {
		puzzle.data[squareY][squareX].rotDir += boolToSigned(!button_altPressed);
		//if the click cancels out the previous direction, add another one to keep it moving back to the original position
		if (puzzle.data[squareY][squareX].rotDir == 0) {
			puzzle.data[squareY][squareX].rotDir += boolToSigned(!button_altPressed);
		}
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
		return (button_altPressed = true);
	}

	if (a.keyCode == 221) {
		return (editor_active = !editor_active);
	}

	if (editor_active) {
		var ref = puzzle.data[editor_y][editor_x];

		//numbers
		if (a.keyCode >= 48 && a.keyCode <= 57) {
			return (editor_placing = "" + (a.keyCode - 48));
		}

		switch (a.keyCode) {
			//delete
			case 8:
				//reset to default status
				ref.connections = "0000";
				break;

			//space
			case 32:
				editor_placing = " ";
				break;
			//tilde
			case 192:
				editor_placing = (editor_placing == "~") ? " " : "~";
				break;

			//C + G
			case 67:
				ref.isChip = !ref.isChip;
				if (ref.data == undefined) {
					ref.data = ["A0"];
				}
				break;
			
			case 71:
				if (editor_placing * 1 > -1) {
					ref.isChip = true;
					puzzle.generatePositions[editor_placing * 1] = [editor_x, editor_y];
					ref.data = ["generator", editor_placing * 1];
				}
				
				break;

			//arrows
			case 37:
			case 38:
			case 39:
			case 40:
				if (editor_placing == " ") {
					//move around
					editor_x = clamp(editor_x - dirRelate[a.keyCode - 37][0], 0, puzzle.data[0].length-1);
					editor_y = clamp(editor_y + dirRelate[a.keyCode - 37][1], 0, puzzle.data.length-1);
				} else {
					//toggle wire
					var index = (4 + (a.keyCode - 37) - (ref.rotation / (Math.PI * 0.5))) % 4;

					//indexes go backwards (37 38 39 40 is CW, 0 1 2 3 is CCW)
					if (index % 2 == 0) {
						index = (index + 2) % 4;
					}
					ref.connections = ref.connections.substring(0, index) + (1 * !(+ref.connections[index])) + (ref.connections.substring(index+1, 4));
				}
				break;
		}
	}
	
}

function handleKeyUp(a) {
	if (a.keyCode == 18) {
		return (button_altPressed = false);
	}
}