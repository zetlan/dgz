window.addEventListener("keydown", keyPress, false);
window.onload = setup;
			
//I store all my global variables at the start of my code so I know where to find them
var canvas;
var ctx;

var color_background = "#BDE8FF";
var color_deliverer = "#008800";
var color_deliverer_shadow = "#006622";
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

var loading_animation;
var loading_map = map_def;
var loading_camera = {  
					x: 0,
					y: 0,
					scale: 1
					};

var centerX;
var centerY;

var tile_size = 40;
var tile_half = tile_size / 2;
var tile_draw_percentage = 0.8;




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
		case 37:
			break;
		case 38:
			break;
		case 39:
			break;
		case 40:
			break;
		case 90:
			break;
		case 88:
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


function drawMap() {
	//first determining where to start
	//tileStartX and tileStartY tell the function which square from the loading map data array to read from
	var tileStartX = Math.floor(loading_camera.x);
	var tileStartY = Math.floor(loading_camera.y);

	//pixelStartX and Y tell the function where the first square should draw to, then all other squares are based off of that first positioning
	var pixelStartX = (tileStartX * tile_size) - (loading_camera.x * tile_size);
	var pixelStartY = (tileStartY * tile_size) - (loading_camera.y * tile_size);

	var drawSquaresX = Math.floor(canvas.width / tile_size) + 1;
	var drawSquaresY = Math.floor(canvas.height / tile_size) + 1;


	//main for loop
	for (var yM=0;yM<drawSquaresY;yM++) {
		for (var xM=0;xM<drawSquaresX;xM++) {

			//getting data
			var value = " ";
			var neighborData = [false, false, false, false];

			try {
				value = loading_map.data[tileStartY + yM][tileStartX + xM];
			} catch (error) {}

			//getting neighbor data (on condition of not being empty)
			//I know this can be condensed, but I don't particularly care and I wanted to make this algorithm simple
			if (value != " ") {
				try {
					neighborData[0] = loading_map.data[tileStartY + yM][tileStartX + xM - 1];
				} catch (ere) {}

				try {
					neighborData[1] = loading_map.data[tileStartY + yM - 1][tileStartX + xM];
				} catch (ere) {}

				try {
					neighborData[2] = loading_map.data[tileStartY + yM][tileStartX + xM + 1];
				} catch (ere) {}

				try {
					neighborData[3] = loading_map.data[tileStartY + yM + 1][tileStartX + xM];
				} catch (ere) {}
				
			}

			drawMapSquare(pixelStartX + (xM * tile_size), pixelStartY + (yM * tile_size), value, neighborData);
		}
	}
}

//draws each individual square for the max
function drawMapSquare(ex, why, tileType, sideInfo) {
	//if it's a number, it'll be an exit block
	var exitBlock = String(tileType).match(/^\d/);
	if (exitBlock) {
		
	} else {
		switch(tileType) {
			case "A":
				drawEllipse("#00FF00", ex + tile_half, why + tile_half, tile_draw_percentage * tile_half, tile_draw_percentage * tile_half, 0, 0, Math.PI * 2);
				break;
			case "a":
				drawEllipse("#008800", ex + tile_half, why + tile_half, tile_draw_percentage * tile_half, tile_draw_percentage * tile_half, 0, 0, Math.PI * 2);
				break;
			case "C":
				break;
			case "D":
				break;
			case "E":
				break;
			default:
				break;
		}
	}
}








//classes!

class SharedFunctionality {
	constructor(number) {
		this.adjustDelay = game_animation_speed;
		this.size = 15;
		this.number = number;
		this.x = canvas.width;

		this.targetX = 0;
		this.y = 0;
		this.shadowY = 0;
		this.color = "#FFFFFF";
		this.shadowColor = "#FFFFFF";
	}

	beDrawn() {
		dEllipse(this.shadowColor, this.x, this.shadowY, this.size, this.size * 0.75, 0, 0, Math.PI * 2);
		dEllipse(this.color, this.x, this.y, this.size, this.size * 0.75, 0, 0, Math.PI * 2);
	}

	tick() {
		//move according to x / target x
		this.x = ((this.x * (this.adjustDelay - 1)) + this.targetX) / this.adjustDelay;
	}
}



class Deliverer extends SharedFunctionality {
	constructor(number) {
		super(number);

		this.targetX = (canvas.width / (deliverers_array.length + 1)) * (this.number + 1);
		this.y = canvas.height * 0.9;
		this.shadowY = this.y + deliverers_shadow_offset;

		this.color = color_deliverer;
		this.shadowColor = color_deliverer_shadow;

		this.progress = 0;
		this.deliveryNumber = 8;
	}

	beDrawn() {
		super.beDrawn();

		//draw current delivery package over self, simple linterp towards the center
		var modProg = this.progress * this.progress * this.progress;
		var drawX = this.x + (modProg * (centerX - this.x));
		var drawY = this.y + 5 + (modProg * (centerY - this.y));
		ctx.font = font_small;
		ctx.fillStyle = color_text;
		ctx.fillText(packages_textures[this.deliveryNumber], drawX, drawY);
	}

	tick() {
		//decide whether to send a package
		/*the condition for sending a package is a 1/frequency random chance.
		The chance is also increased if the stage is empty, and is 0 if trust is below 0 */
		var activeFrequency = Infinity;
		if (game_trust > 0) {
			activeFrequency = deliverers_frequency / (1 + 2 * (stage_array[0] == 8));
		}
		var sendPackage = Math.floor(Math.random() * activeFrequency) == 5;
		//if decided to possibly send a package, additional checks are added for making sure self is not already sending a package
		if (sendPackage && this.progress == 0) {
			this.deliveryNumber = Math.floor(Math.random() * (packages_maxID + 0.99));
		}

		//advancing the package forwards
		if ((this.deliveryNumber != 8 && !deliverers_sending && game_trust > 0) || this.progress > 0) {
			deliverers_sending = true;
			this.progress += deliverers_rate;
			if (this.progress >= 1) {
				
				for (var g=0;g<stage_array.length;g++) {
					//completing the delivery
					if (stage_array[g] == 8) {
						stage_array[g] = this.deliveryNumber;
						this.deliveryNumber = 8;
						game_trust += 1;
						g = stage_array.length + 1;
					}
				}

				//failing the delivery
				if (this.deliveryNumber != 8) {
					game_trust -= 5;
					this.deliveryNumber = 8;
					if (game_trust <= 0) {
						endGame();
					}
				}

				//things that happen regardless of delivery outcome
				this.progress = 0;
				deliverers_sending = false;
			}
		}

		//moving
		this.targetX = (canvas.width / (deliverers_array.length + 1)) * (this.number + 1);
		super.tick();
		
	}
}

class Collector extends SharedFunctionality {
	constructor(number) {
		super(number);

		this.size = 25;
		this.y = canvas.height * 0.1;
		this.shadowY = this.y + collectors_shadow_offset;

		this.color = color_collector;
		this.shadowColor = color_collector_shadow;
	}

	beDrawn() {
		super.beDrawn();
		//drawing what to recieve
		var target = packages_key[this.number];
		if (target == undefined) {
			target = packages_textures[8];
		}
			
		ctx.font = font_small;
		ctx.fillStyle = color_text;
		for (var f=0;f<target.length;f++) {
			ctx.fillText(target[f], this.x, this.y + 10 + (15 * (f - 1)));
		}
	}

	tick() {
		this.targetX = (canvas.width / (collectors_array.length + 1)) * (this.number + 1);
		super.tick();
	}
}