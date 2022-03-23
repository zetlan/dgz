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

var button_shiftPressed = false;

const color_background = "#babadb";
const color_flowers = [
	"#ef3434",
	"#265df4",
	"#a53fdc",
	"#ff3891",
];

const color_text = "#882288";

var cursor_down = false;
var cursor_x = 0;
var cursor_y = 0;

var flowers = [];
var flower_typeSelected = 0;
var flower_size = 7;

var world_time = 0;


//main functions
function setup() {
	canvas = document.getElementById("cylinderRoses");
	ctx = canvas.getContext("2d");

	setCanvasPreferences();
	animation = window.requestAnimationFrame(main);
}

function main() {
	animation = window.requestAnimationFrame(main);
	world_time += 1;

	//draw background
	ctx.fillStyle = color_background;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	//flower backgrounds
	ctx.globalAlpha = 0.5;
	flowers.forEach(f => {
		ctx.fillStyle = color_flowers[f[2]];
		ctx.beginPath();
		ctx.ellipse(f[0] * canvas.width, f[1] * canvas.height, flower_size * 2, flower_size * 2, 0, 0, Math.PI * 2);
		ctx.fill();
	});
	ctx.globalAlpha = 1;

	//flower foregrounds
	flowers.forEach(f => {
		ctx.fillStyle = color_flowers[f[2]];
		ctx.beginPath();
		ctx.ellipse(f[0] * canvas.width, f[1] * canvas.height, flower_size, flower_size, 0, 0, Math.PI * 2);
		ctx.fill();
	});
}

function setCanvasPreferences() {

}

function handleKeyPress(a) {
	switch (a.code) {
		case "ShiftLeft":
			button_shiftPressed = true;
			break;
		//refactor this bit later
		case "Digit0":
			flower_typeSelected = 0;
			break;
		case "Digit1":
			flower_typeSelected = 1;
			break;
		case "Digit2":
			flower_typeSelected = 2;
			break;
		case "Digit3":
			flower_typeSelected = 3;
			break;
	}
}

function handleKeyNegate(a) {
	switch (a.code) {
		case "ShiftLeft":
			button_shiftPressed = false;
			break;
	}
}

function handleMouseDown(a) {
	cursor_down = true;

	//get cursor position
	var canvasArea = canvas.getBoundingClientRect();
	cursor_x = a.clientX - canvasArea.left;
	cursor_y = a.clientY - canvasArea.top;

	if (cursor_x <= 0 || cursor_x > canvas.width) {
		return;
	}

	if (cursor_y <= 0 || cursor_y > canvas.height) {
		return;
	}

	//add / remove a dot
	if (button_shiftPressed) {
		//find the closest 
	} else {
		//add a flower at the current position
		flowers.push([cursor_x / canvas.width, cursor_y / canvas.height, flower_typeSelected])

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