window.addEventListener("keydown", keyPress, false);
window.onload = setup;
			
//I store all my global variables at the start of my code so I know where to find them
var canvas;
var ctx;



var color_background = "#BDE8FF";
var color_player = "#FF00FF";

var color_stage = "#AAAAFF";
var color_stage_shadow = "#7777D4";
var boxColor = "#8888FF";
var color_text = "#222266";
var color_collector = "#33FF33";
var color_collector_shadow = "#12DE78";
var color_select1 = "#FF8800";
var color_select2 = "#FF8888";

var display_vignetting = 0.85;

var font_large = "40px Courier";
var font_medium = "30px Courier";
var font_small = "20px Courier";


var game_surfaces = "a";

var loading_animation;
var loading_map = map_def;

var centerX;
var centerY;

var tile_size = 40;
var tile_shadow_offset = 3;
var tile_half = tile_size / 2;

var camera =	{  
					x: 0,
					y: 0,
					scale: 1
				};

var player = new Player(1, 3);




//the initializing function.
function setup() {
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
	ctx.lineJoin = "round";

	centerX = canvas.width / 2;
	centerY = canvas.height / 2;
	loading_animation = window.requestAnimationFrame(main);

}

function keyPress(hn) {
	switch (hn.keyCode) {
		//we ad zx in that order
		case 87:
			player.move("UL");
			break;
		case 69:
			player.move("UR");
			break;

		case 65:
			player.move("L");
			break;
		case 68:
			player.move("R");
			break;

		case 90:
			player.move("DL");
			break;
		case 88:
			player.move("DR");
			break;
		

	}
}

/*this function is the main function that repeats every time the timer goes off. It clears the screen and then draws everything.  */
function main() {
	//clearing / drawing background
	ctx.fillStyle = color_background;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	//draw world
	drawMap();

	//draw / tick entities
	/*
	for (var a=0;a<loading_map.entities.length;a++) {
		loading_map.entities[a].tick();
		loading_map.entities[a].beDrawn();
	} */

	//draw player
	player.tick();
	player.beDrawn();

	//call self for next frame
	game_animation = window.requestAnimationFrame(main);
}


//drawing functions!


function drawEllipse(color, x, y, xRadius, yRadius, rotation, startAngle, endAngle) {
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.ellipse(x, y, xRadius, yRadius, rotation, startAngle, endAngle)
	ctx.fill();
}

function drawPoly(x, y, r, sides, offsetAngle) {
	ctx.beginPath();
	for (var an=0;an<sides+1;an++) {
		var trueAngle = ((an / sides) * (Math.PI * 2)) + (Math.PI / sides) + offsetAngle;
		var xAdd = r * Math.sin(trueAngle);
		var yAdd = r * Math.cos(trueAngle);
		ctx.lineTo(x + xAdd, y + yAdd);
	}
	ctx.fill();
}

function drawMap() {
	//first determining where to start
	//tileStartX and tileStartY tell the function which square from the loading map data array to read from
	var tileStartX = Math.floor(camera.x);
	var tileStartY = Math.floor(camera.y);

	//drawSquares x / y say how many hexagons to draw in each dimension
	var drawSquaresX = Math.floor(canvas.width / tile_size) + 2;
	var drawSquaresY = Math.floor(canvas.height / tile_size) + 3;


	//other helpful vars
	var heightPercentage = Math.sin(Math.PI / 3);


	//main for loop
	for (var yM=0;yM<drawSquaresY;yM++) {
		for (var xM=0;xM<drawSquaresX;xM++) {

			//getting data
			var value = " ";

			try {
				value = loading_map.data[tileStartY + yM][tileStartX + xM];
			} catch (error) {}

			//catching those pesky undefineds
			if (value == undefined) {
				value = " ";
			}
			var squarePos = spaceToScreen(tileStartX + xM, tileStartY + yM);
			var [squareX, squareY] = squarePos;

			//shadow
			ctx.globalAlpha = 0.5;
			drawMapSquare(squareX, squareY, value);

			ctx.globalAlpha = 1;
			//real square
			drawMapSquare(squareX, squareY, value);
		}
	}
}

//draws each individual square for the max
function drawMapSquare(ex, why, tileType) {
	//if it's a number, it'll be an exit block
	var exitBlock = String(tileType).match(/^\d/);
	if (exitBlock) {
		
	} else if (tileType != " ") {
		//all regular tiles
		var drawColor = "#FF00FF";
		switch(tileType) {
			case "A":
				drawColor = "#004444";
				break;
			case "a":
				drawColor = "#008888";
				break;
			default:
				break;
		}

		ctx.fillStyle = drawColor;
		drawPoly(ex, why, Math.ceil(tile_half / Math.sin(Math.PI / 3)), 6, Math.PI / 6);
	}
}








//other utility functions
function spaceToScreen(x, y) {
	//converting to hexagonal coords from square
	var newX = x + Math.abs(((0.5 * (y + 5)) % 1) - 0.5);
	var newY = y * Math.sin(Math.PI / 3);

	//converting to pixel coords from world
	[newX, newY] = [newX * tile_size, newY * tile_size];

	//subtracting camera coords
	[newX, newY] = [newX - (camera.x * tile_size), newY - (camera.y * tile_size)];

	return [newX, newY]
}