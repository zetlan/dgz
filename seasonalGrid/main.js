window.addEventListener("keydown", keyPress, false);
window.onload = setup;
			
//I store all my global variables at the start of my code so I know where to find them
var canvas;
var ctx;



var color_background = "#BDE8FF";
var color_player = "#FF00FF";

var color_stage = "#AAAAFF";
var color_stage_shadow = "#7777D4";

var color_error = "#FF00FF";
var color_text = "#222266";
var color_wall = "#004444";
var color_floor = "#008888";

var color_select1 = "#FF8800";
var color_select2 = "#FF8888";

var display_vignetting = 0.6;

var editor_active = false;
var editor_block = "A";

var font_large = "40px Courier";
var font_medium = "30px Courier";
var font_small = "20px Courier";




var loading_animation;
var loading_map = map_def;

var centerX;
var centerY;

var tile_size = 30;
var tile_walkables = "a0123456789";
var tile_shadow_offset = 6;
var tile_half = tile_size / 2;

var camera =	{  
					x: 0,
					y: 0,
					scale: 1
				};

var player = new Player(1, 1);




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

		//enter, for placing blocks in the editor
		case 13:
			//only works if editor is active
			if (editor_active) {
				//gets the data for the row the player is on
				var originData = loading_map.data[player.y];
				//if the data is undefined, define it
				if (originData == undefined) {
					originData = "";
				}
				//if the data is too short, lengthen it
				while (originData.length < player.x + 1) {
					originData += " ";
				}
				//place the editor block where the player is if safe
				if (player.x >= 0) {	
					var modData = replaceString(originData, editor_block, player.x);
					//replace the editor data with the modified data
					loading_map.data[player.y] = modData;
				}
			}
			break;
		//], for toggling edit mode
		case 221:
			editor_active = !editor_active;
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

	//editor things if active
	if (editor_active) {
		//drawing box around edge
	}

	//vignetting
	var gradient = ctx.createRadialGradient(centerX, centerY * 1.5, 30, centerX, centerY * 1.5, canvas.height * 1);
	
	gradient.addColorStop(0, "rgba(0, 0, 64, 0)");
	gradient.addColorStop(1, "rgba(0, 0, 64, 1)");
	ctx.fillStyle = gradient;
	ctx.globalAlpha = display_vignetting;
	ctx.setTransform(1, 0, 0, 0.75, 0, 0);
	ctx.fillRect(0, 0, canvas.width, canvas.height * 2);
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.globalAlpha = 1;

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
	//I'm dividing by 0.866 instead of sin(pi / 3) because it's faster and I don't think the extra precision is worth it
	var tileStartX = Math.floor(camera.x);
	var tileStartY = Math.floor(camera.y / 0.866);

	//drawSquares x / y say how many hexagons to draw in each dimension
	var drawSquaresX = Math.floor(canvas.width / tile_size) + 2;
	var drawSquaresY = Math.floor((canvas.height / tile_size) * 1.5);


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
			drawMapShadow(squareX + tile_shadow_offset, squareY + tile_shadow_offset, value);
			//real square
			drawMapSquare(squareX, squareY, value);

			//draw grid if editor is active
			if (editor_active && tileStartY + yM > 0) {
				var prevPos1 = spaceToScreen(tileStartX + xM - 1, tileStartY + yM);
				var prevPos2 = spaceToScreen(tileStartX + xM, tileStartY + yM - 1);
				ctx.beginPath();
				ctx.moveTo(squareX, squareY);
				ctx.lineTo(prevPos1[0], prevPos1[1]);
				ctx.moveTo(squareX, squareY);
				ctx.lineTo(prevPos2[0], prevPos2[1]);
				ctx.stroke();
			}
		}
		//if off the end of the map, skip the rest
		if (yM + tileStartY > loading_map.data.length-1) {
			yM = drawSquaresY + 1;
		}
	}
}





//other utility functions
function mapOutput() {
	//outputs the current map's data as text
	var outputString = `[`;
	for (var w=0;w<loading_map.data.length;w++) {
		outputString +=`'` + loading_map.data[w] + `'`;
		if (w<loading_map.data.length-1) {
			outputString += `,\n`;
		} else {
			outputString += `];`;
		}
	}
	return outputString;
}

function replaceString(originalString, charReplacement, positionToReplaceAt) {
	return originalString.substr(0, positionToReplaceAt) + charReplacement + originalString.substr(positionToReplaceAt + 1);
}

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