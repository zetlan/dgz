window.addEventListener("keydown", keyPress, false);
window.onload = preSetup;
			
//I store all my global variables at the start of my code so I know where to find them
var canvas;
var ctx;


var color_background_0 = "#B8F";
var color_background_1 = "#BFF";
var color_background_2 = "#FA2";
var color_background_3 = "#F88";
var color_background_out = "#000";
var color_player = "#FAF";
var color_desert = "#FD7";
var color_desert_highlight = "#FEC";
var color_desert_shadow = "#DA9";
var color_error = "#F0F";
var color_exit = "#AAA";
var color_exit_center = "#888";
var color_exit_complete = "#AFA";
var color_floor = "#088";
var color_grass = "#30DB44";
var color_grass_highlight = "#5E6";
var color_grass_shadow = "#3B7";
var color_ice = "#DDF";
var color_ice_highlight = "#EEF";
var color_laser = "#F44";
var color_mapFade = "#FFF";
var color_rock = "#888";
var color_snow = "#EFF";
var color_switch = "#566";
var color_switch_highlight = "#68A";
var color_switch_ring = "#05F";
var color_switch_ring_highlight = "#0AF";
var color_temple = "#FA0";
var color_temple_shadow = "#DA5";
var color_text = "#226";
var color_wall = "#044";
var color_wall_secondary = "#024";
var color_water = "#08F";


var display_animDelay = 6;
var display_entityShadowOffset = 3;
var display_tileShadowOffset = 6;
var display_vignetting = 0.6;
var display_mapSwitchSpeed = 0.02;


var editor_active = false;
var editor_block = " ";
var editor_possibleBlocks = " ACDabcdefgiw";
var editor_blockNumber = 0;

var font_large = "40px Courier";
var font_medium = "30px Courier";
var font_small = "20px Courier";

var game_animation;
var game_timer = 0;
var game_avgFrameTime = [];


var loading_animation;
var loading_map;

var centerX;
var centerY;

var tile_size = 35;
var tile_walkables = "Cabcbdefgi0123456789";
var tile_half = tile_size / 2;

var camera =	{  
					x: 1.357,
					y: 6.133,
					scale: 1
				};

var player = new Player(4, 3);




//the initializing function.
function preSetup() {
	//function for delaying the setup until all maps are good
	game_animation = window.requestAnimationFrame(setup);
}

function setup() {
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
	ctx.lineJoin = "round";
	ctx.font = font_medium;
	ctx.textAlign = "center";

	loading_map = map_out;

	//setting up entities in the map_out zone
	for (var a=0;a<16;a++) {
		map_out.entities.push(new Orb("#AAF", 52 + a, 0));
	}
	for (var a=0;a<16;a++) {
		map_out.entities.push(new Orb("#FAF", 52 + a, 6));
	}

	//setting up the rn map relations
	map_rn1.parent = map_rn2;
	map_rn2.parent = map_rn3;
	map_rn3.parent = map_rn4;
	map_rn4.parent = map_rn5;
	map_rn5.parent = map_rn6;

	centerX = canvas.width / 2;
	centerY = canvas.height / 2;
	game_animation = window.requestAnimationFrame(main);
}

function keyPress(hn) {
	switch (hn.keyCode) {
		//we ad zx in that order
		case 87:
			player.handleMoveInput("UL");
			break;
		case 69:
			player.handleMoveInput("UR");
			break;

		case 65:
			player.handleMoveInput("L");
			break;
		case 68:
			player.handleMoveInput("R");
			break;

		case 90:
			player.handleMoveInput("DL");
			break;
		case 88:
			player.handleMoveInput("DR");
			break;

		//r, for resetting things
		case 82:
			loading_map.beReset();
			break;

		//enter
		case 13:
			//editor active thing, placing blocks
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
			} else {
				//regular mode, for entering completed levels
				//getting the tile the player is on
				try {
					//if the level is completed, make it not be
					if (loading_map.connections[loading_map.data[player.y][player.x]].completed) {
						loading_map.connections[loading_map.data[player.y][player.x]].completed = false;
					}
				} catch (ereerererererere) {}
				
			}
			break;
		//shift, for toggling which block is selected in the editor
		case 16:
			editor_blockNumber += 1;
			if (editor_blockNumber > editor_possibleBlocks.length-1) {
				editor_blockNumber = 0;
			}
			editor_block = editor_possibleBlocks[editor_blockNumber];
			break;
		//], for toggling edit mode
		case 221:
			editor_active = !editor_active;
			break;
		

	}
}

/*this function is the main function that repeats every time the timer goes off. It clears the screen and then draws everything.  */
function main() {
	//starting performance test
	//var times = [performance.now(), 0];

	//clearing / drawing background
	ctx.fillStyle = loading_map.bg;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	//draw world
	drawMap();

	//ticking world thigns
	loading_map.tick();

	//draw player
	player.tick();
	player.beDrawn();

	//editor text if active
	if (editor_active) {
		//drawing box around edge

		//drawing coordinates
		ctx.fillStyle = color_player;
		ctx.fillText(`Block: ${editor_block}`, canvas.width * 0.5, canvas.height * 0.9);
		ctx.fillText(`X: ${player.x} Y: ${player.y}`, canvas.width * 0.5, canvas.height * 0.95);
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

	//time based things
	game_timer += 1;
	display_tileShadowOffset = 6 + (Math.sin(game_timer / 100) * 2);


	//performance testing
	/*
	times[1] = performance.now();
	var totalTime = times[1] - times[0];
	game_avgFrameTime.push(totalTime);
	if (game_avgFrameTime.length > 100) {
		var avg = 0;
		for (var v=0;v<game_avgFrameTime.length;v++) {
			avg += game_avgFrameTime[v];
		}
		avg /= game_avgFrameTime.length;

		console.log("average time for past 100 frames is " + avg + "ms");
		game_avgFrameTime = [];
	} */

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

//this code is a mess but it's slightly faster than the drawPoly function
function drawHexagonTile(x, y) {
	ctx.beginPath();
	ctx.moveTo(x + tile_half + 0.5, y + (tile_half * 0.58));
	ctx.lineTo(x + tile_half + 0.5, y - (tile_half * 0.58));
	ctx.lineTo(x, y - (tile_size * 0.58));
	ctx.lineTo(x - tile_half - 0.5, y - (tile_half * 0.58));
	ctx.lineTo(x - tile_half - 0.5, y + (tile_half * 0.58));
	ctx.lineTo(x, y + (tile_size * 0.58));
	ctx.lineTo(x + tile_half + 0.5, y + (tile_half * 0.58));
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
	var drawSquaresY = Math.floor((canvas.height / tile_size) * 1.4);

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
				//if the value is undefined, check to see if the rest of the row search should be skipped
				value = " ";
				if (tileStartX + xM > 0) {
					xM = drawSquaresX + 1;
				}
				
			}
			var squarePos = spaceToScreen(tileStartX + xM, tileStartY + yM);
			var [squareX, squareY] = squarePos;

			//only call the function if not an empty space
			if (value != " ") {
				//shadow
				drawMapShadow(squareX + display_tileShadowOffset, squareY + display_tileShadowOffset, value);
				//real square
				drawMapSquare(squareX, squareY, value);
			}	

			//draw grid if editor is active
			if (editor_active && tileStartY + yM > 0 && tileStartX + xM > 0) {
				ctx.lineWidth = 1;
				ctx.strokeStyle = color_text;
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
function determineEnding() {
	if (player.y < 3) {
		loading_map.parent = map_rn1;
	} else {
		loading_map.parent = map_free;
	}
}
function linterp(a, b, percentage) {
	return (a + ((b - a) * percentage));
}

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

function screenToSpace(x, y) {
	//adding camera coords
	[x, y] = [x + (camera.x * tile_size), y + (camera.y * tile_size)];

	//converting to world coordinates from pixel
	[x, y] = [x / tile_size, y / tile_size];

	//convert to square coords
	y /= Math.sin(Math.PI / 3);
	x -= Math.abs(((0.5 * (y + 5)) % 1) - 0.5);

	return [x, y];
}

function validateMovement(x, y) {
	//if the map is exiting, automatically return false
	if (loading_map.exiting) {
		return false;
	}

	//if the editor is active excuse all other errors
	if (editor_active) {
		return true;
	}

	//if neither of the special conditions apply..
	var problem = true;
	var value;
	//determine what the target tile is
	try {
		value = loading_map.data[y][x];
	} catch (errerer) {
		return false;
	}

	//run through all the walkable tiles and see if the target tile is on there
	for (var k=0;k<tile_walkables.length;k++) {
		if (value == tile_walkables[k]) {
			problem = false;
			k = tile_walkables.length;
			return true;
		}
	}

	//if this point is reached, the tile isn't valid
	return false;
}


//interesting, doing the math 100,000,000 times is faster than loading the value variable 100,000,000 times
//(on average, 10-20 ms faster)
function performanceTest() {
	var perfTime = [performance.now(), 0];
	var value = Math.sin(Math.PI / 3);
	for (var a=0;a<100000000;a++) {
		var testApple = Math.sin(Math.PI / 3);
		//var testApple = value;
		testApple *= 2;
		if (testApple > 0) {
			testApple /= 2;
		}
	}
	perfTime[1] = performance.now();
        
	var totalTime = perfTime[1] - perfTime[0];
	console.log(`performance test took ${totalTime} ms`);
}
