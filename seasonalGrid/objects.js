class Firefly {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.animX = x;
		this.animY = y;
		this.updateX = x;
		this.updateY = y;

		this.r = 0.3;
	}

	tick() {
		//if the player is in the same square as self, push them out
		if (player.x == this.x && player.y == this.y) {
			//better explanation of this code found in the Orb class
			var moveCodesOpposite = {
				"L": "R",
				"UL": "DR",
				"UR": "DL",
				"R": "L",
				"DR": "UL",
				"DL": "UR"
			}
			var playerMoveVector = player.dirToWorld(moveCodesOpposite[player.dir]);
			player.x += playerMoveVector[0];
			player.y += playerMoveVector[1];
			player.queue[player.queue.length-1] = [player.x, player.y];
			player.moveImpulse = false;
		}


		//visual movement
		this.updateX += (Math.random() - 0.5) * 0.125;

		if (Math.abs(this.updateX - this.x) > this.r) {
			if (this.updateX > this.x) {
				this.updateX = this.x + this.r;
			} else {
				this.updateX = this.x - this.r;
			}
		}


		this.updateY += (Math.random() - 0.5) * 0.125;

		if (Math.abs(this.updateY - this.y) > this.r) {
			if (this.updateY > this.y) {
				this.updateY = this.y + this.r;
			} else {
				this.updateY = this.y - this.r;
			}
		}

		this.animX = ((this.animX * (display_animDelay - 1)) + this.updateX) / display_animDelay;
		this.animY = ((this.animY * (display_animDelay - 1)) + this.updateY) / display_animDelay;;
	}

	beDrawn() {
		var drawCoords = spaceToScreen(this.animX, this.animY);

		drawEllipse(color_firefly, drawCoords[0], drawCoords[1], tile_half * 0.3, tile_half * 0.5, 0, 0, Math.PI * 2);
	}

	beReset() {
		this.animX = this.x;
		this.animY = this.y;
	}
}










class Map {
	constructor(bgColor, worldData, playerDefaultPos, entityData, exitData, completedOPTIONAL) {
		this.bg = bgColor;
		this.connections = exitData;
		this.completed = false;
		this.data = worldData;
		this.entities = entityData;

		this.exiting = false;
		this.exitProgress = 0;
		this.exitingTo = undefined;

		this.name = "NO CONNECTIONS ERROR: UNINITIALIZED NAME";
		this.parent = undefined;
		this.playerPos = playerDefaultPos;
		this.playerPosDefault = playerDefaultPos;
		this.season = 0;

		//check just to make sure the map is enterable, I want to have some safety
		if (this.playerPos.length != 2) {
			this.playerPos = [1, 1];
			this.playerPosDefault = [1, 1];
		}

		if (completedOPTIONAL) {
			this.completed = true;
		}


		//ack gross I wish this syntax didn't exist but here we are
		var self = this;
		window.setTimeout(function() {self.convertConnections();}, 1);
	}

	tick() {
		//tick all entities
		for (var a=0;a<this.entities.length;a++) {
			this.entities[a].tick();
			this.entities[a].beDrawn();
		}

		//handle exits
		if (!editor_active) {
			this.handleExit();
		}
	}

	beReset() {
		//reset all entities
		for (var f=0;f<this.entities.length;f++) {
			this.entities[f].beReset();
		}

		//reset player position
		[player.x, player.y] = this.playerPosDefault;
		player.queue.push([player.x, player.y]);
	}

	convertConnections() {
		for (var c=0;c<this.connections.length;c++) {
			var name = this.connections[c];
			this.connections[c] = eval(this.connections[c]);
			this.connections[c].name = name;
		}
	}

	handleExit() {
		//get the block the player is currently on
		var playerBlock = " ";
		try {
			playerBlock = this.data[player.y][player.x];
		} catch (error) {}

		//if the player is on an exit block (number) when the map hasn't been completed, force them into an exit
		var forceSwitch = false;
		try {
			var forceSwitch = !this.connections[playerBlock].completed;
		} catch (error) {}

		//starting an exit
		if (forceSwitch) {
			this.exiting = true;
			this.exitingTo = this.connections[this.data[player.y][player.x]];
			this.exitingTo.parent = this;
		}

		//other way to exit is through the exit block, which completes the map as well
		if (playerBlock == "e") {
			this.exiting = true;
			this.exitingTo = this.parent;
			this.completed = true;
		}

		//if in exiting mode, do screen fade stuffies
		if (this.exiting) {
			ctx.fillStyle = color_mapFade;
			ctx.globalAlpha = this.exitProgress;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			this.exitProgress += display_mapSwitchSpeed;

			if (this.exitProgress >= 1) {
				//actually switch maps
				this.exitProgress = 0;
				this.exiting = false;
				loading_map = this.exitingTo;
				

				//save player position
				this.playerPos = [player.x, player.y];
				player.dir = "";
				//updating player position
				//reset map if moving to a child map
				if (this.exitingTo.parent == this) {
					this.exitingTo.beReset();
				} else {
					[player.x, player.y] = loading_map.playerPos;
					player.queue.push([player.x, player.y]);
				}
				
			}
		}
	}
}





//parent class for all movable objects
class MovableTileEntity {
	constructor(color, x, y) {
		this.x = x;
		this.y = y;
		this.color = color;
		this.r = tile_size / 3;

		//all tile entities have a seperate drawing and actual coordinates, as real coordinates "snap" and the drawing is for animation
		this.animX = x;
		this.animY = y;
		this.animProgress = 0;

		this.drawCoords = [];

		this.queue = [[x, y], [x, y]];
		
		this.dir = "";
		this.moveInpulse = false;
	}

	tick() {
		this.move();
		this.alignAnimCoords();
	}

	alignAnimCoords() {
		var [base, percentage] = this.alignAnimQueue();

		this.animX = linterp(this.queue[base][0], this.queue[base+1][0], percentage);
		this.animY = linterp(this.queue[base][1], this.queue[base+1][1], percentage);
	}

	alignAnimQueue() {
		//use weighted average to move progress along
		this.animProgress = ((this.animProgress * (display_animDelay - 1)) + (this.queue.length - 1)) / display_animDelay;

		//if progress is greater than 1, delete the first element of the queue and remove 1 from progress
		if (this.animProgress > 1 && this.queue.length > 2) {
			this.queue.splice(0, 1);
			this.animProgress -= 1;
		}


		//turn progress into xy coordinates for display
		var percentage = this.animProgress % 1;
		var base = Math.floor(this.animProgress);
		//special case to avoid problems when the animation progress is exactly 1
		if (this.animProgress == 1) {
			base -= 1;
		}

		return [base, percentage];
	}

	beDrawn() {
		//only draw self if on the screen
		if (Math.abs(this.animX - player.animX) < canvas.width / (tile_size * 1.5) && Math.abs(this.animY - player.animY) < canvas.height / (tile_size * 1.5)) {
			//calculate true coordinates to draw at
			var drawCoord = spaceToScreen(this.animX, this.animY);
			//modify y position if on a desert block
			try {
				if (loading_map.data[this.y][this.x] == "d") {
					drawCoord[1] += ((Math.sin((game_timer / 25) + (this.animX / 2) + (this.animY / 2))) * 6);
				}
			} catch (e) {}
			drawEllipse(this.color, drawCoord[0], drawCoord[1], this.r, this.r, 0, 0, Math.PI * 2);
		}
	}

	move() {
		//if told to move, try moving
		if (this.moveImpulse) {
			this.moveImpulse = false;
			var updatePos = this.dirToWorld(this.dir);
			//if the square being moved to is valid, move there
			if (validateMovement(this.x + updatePos[0], this.y + updatePos[1])) {
				[this.x, this.y] = [this.x + updatePos[0], this.y + updatePos[1]];
				//if now on an ice block, continue movement
				this.queue.push([this.x, this.y]);
				try {
					if (loading_map.data[this.y][this.x] == "C") {
						this.moveImpulse = true;
					}
				} catch (er) {}
				return true;
			} else {
				return false;
			}
		}
	}

	handleMoveInput(direction) {
		//sends a move input if the last one has been handled
		if (!this.moveImpulse) {
			this.dir = direction;
			this.moveImpulse = true;
		}
	}

	//converts the direction string to a world coordinate
	dirToWorld(dirString) {
		//offset accounts for difference in odd/even grid rows
		var offset = Math.abs(((this.y + 5) % 2) - 1);
		var move_codes = {
			"UL": [-1 + offset, -1],
			"UR": [0 + offset, -1],
			"L": [-1, 0],
			"R": [1, 0],
			"DL": [-1 + offset, 1],
			"DR": [0 + offset, 1]
		};

		return move_codes[dirString];
	}
}




class Player extends MovableTileEntity {
	constructor(x, y) {
		super(color_player, x, y);
	}

	tick() {
		super.tick();

		//making camera follow player
		camera.x = this.animX - ((canvas.width / 2) / tile_size) + Math.abs(((0.5 * (this.animY + 5)) % 1) - 0.5);
		camera.y = (this.animY * Math.sin(Math.PI / 3)) - ((canvas.height / 2) / tile_size);
	}

	move() {
		var returnCode = super.move();
		//make sure ice does not affect self when in edit mode
		if (editor_active) {
			this.moveImpulse = false;
		}
		return returnCode;
	}
}





class Orb extends MovableTileEntity {
	constructor(color, x, y) {
		super(color, x, y);
		this.homeX = x;
		this.homeY = y;
	}

	tick() {
		this.alignAnimCoords();
		//just move
		this.move();
		//if the player is in the same square as the self, be pushed by them
		if (player.x == this.x && player.y == this.y) {
			this.dir = player.dir;
			this.moveImpulse = true;
			
			//move
			var suc = this.move();

			//if the move was unsuccessful, push the player back
			if (!suc) {
				var moveCodesOpposite = {
					"L": "R",
					"UL": "DR",
					"UR": "DL",
					"R": "L",
					"DR": "UL",
					"DL": "UR"
				}
				//this line may look confusing.
				//It reverses the direction this entity was pushed in, applies it to the player, and then stores that in playerMoveVector.
				var playerMoveVector = player.dirToWorld(moveCodesOpposite[this.dir]);

				//after moving the player, make sure the player doesn't want to move again.
				player.x += playerMoveVector[0];
				player.y += playerMoveVector[1];
				//also change player's queue so that they move visually
				player.queue[player.queue.length-1] = [player.x, player.y];
				player.moveImpulse = false;
			}
		}
	}

	//changes the position based on the dir property and moveImpulse. 
	//returns whether the move was successful or not
	move() {
		if (this.moveImpulse) {
			this.moveImpulse = false;
			var updatePos = this.dirToWorld(this.dir);
			//if the square being moved to isn't valid, cancel out of the function
			if (!validateMovement(this.x + updatePos[0], this.y + updatePos[1])) {
				return false;
			} else {
				//if there's an entity in the way, cancel out
				for (var a=0;a<loading_map.entities.length;a++) {
					if (loading_map.entities[a].x == this.x + updatePos[0] && loading_map.entities[a].y == this.y + updatePos[1] && !(loading_map.entities[a] instanceof Switch)) {
						return false;
					}
				}

				//if this point is reached, then move
				[this.x, this.y] = [this.x + updatePos[0], this.y + updatePos[1]];
				this.queue.push([this.x, this.y]);
				//if on an ice block, propogate future movements
				try {
					if (loading_map.data[this.y][this.x] == "C") {
						this.moveImpulse = true;
					}
				} catch (e) {}
				return true;
			}
		}
	}

	beReset() {
		[this.x, this.y] = [this.homeX, this.homeY];
		this.queue.push([this.x, this.y]);
	}
}





class Stone extends Orb {
	constructor(x, y) {
		super("#888", x, y);
	}

	beDrawn() {
		//only draw self if on screen
		if (Math.abs(this.animX - player.animX) < canvas.width / (tile_size * 1.5) && Math.abs(this.animY - player.animY) < canvas.height / (tile_size * 1.5)) {
			var drawCoords = spaceToScreen(this.animX, this.animY);
			ctx.fillStyle = this.color;
			//shadow
			ctx.globalAlpha = 0.5;
			drawPoly(drawCoords[0] + display_entityShadowOffset, drawCoords[1] + display_entityShadowOffset, tile_half * 0.6, 6, Math.PI / 6);
			//full block
			ctx.globalAlpha = 1;
			drawPoly(drawCoords[0], drawCoords[1], tile_half * 0.6, 6, Math.PI / 6);
		}	
	}
}




class Text {
	constructor(string, x, y) {
		this.x = x;
		this.y = y;
		this.text = string;
	}

	tick() {}

	beDrawn() {
		var drawCoords = spaceToScreen(this.x, this.y);
		ctx.fillStyle = color_text;
		ctx.fillText(this.text, drawCoords[0], drawCoords[1] + (tile_size * 0.25));
	}

	beReset() {}
}




class SpecialOrb extends Orb {
	constructor(color, x, y, command) {
		super(color, x, y);
		this.command = command;
	}

	tick() {
		super.tick();
		eval(this.command);
	}
}




class Sandstorm {
	constructor(framesUntilFade, framesForFade) {
		this.defaults = {"cd": framesUntilFade, "fd": framesForFade};
		this.countdown = framesUntilFade;
		this.fade = framesForFade;
	}

	tick() {
		//getting player block value
		var value = " ";
		try {
			value = loading_map.data[player.y][player.x];
		} catch (e) {}

		if (value == undefined) {
			value = " ";
		}

		//if the player is on a sand block, increment the countdown
		if (value == "d") {

			if (this.countdown > 0) {
				this.countdown -= 1;
			} else if (this.fade > 0) {
					this.fade -= 1;
			}

		} else if (value == "b") {

			//if they're on a grass block, decrement the countdown
			if (this.fade < this.defaults["fd"]) {
				this.fade += 1;
			} else if (this.countdown < this.defaults["cd"]){
				this.countdown += 1;
			}

		}
	}

	beDrawn() {
		//drawing filter over the screen
		if (this.countdown == 0 && !editor_active) {
			ctx.globalAlpha = 1 - (this.fade / this.defaults["fd"]);
			ctx.fillStyle = loading_map.bg;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.globalAlpha = 1;
		}
	}

	beReset() {
		this.countdown = this.defaults["cd"];
		this.fade = this.defaults["fd"];
	}
}






class ShadowStorm {
	constructor() {
		this.rad = display_entityLightRadius;
		this.dispRad = display_entityLightRadius;
	}

	tick() {
		this.dispRad = this.rad + (Math.sin(game_timer / 20) / 4);
	}

	
	beDrawn() {
		//only draw self if in regular mode
		if (!editor_active) {
			ctx.fillStyle = loading_map.bg;
			ctx.beginPath();
			ctx.rect(0,0,canvas.width,canvas.height);
			//loop through all entities and create light bubbles around them
			for (var a=0;a<loading_map.entities.length;a++) {
				if (loading_map.entities[a] != this) {
					var size = this.dispRad;
					if (!(loading_map.entities[a] instanceof Firefly)) {
						size /= 3;
					}
					var baseCoords = spaceToScreen(loading_map.entities[a].animX, loading_map.entities[a].animY);
					ctx.moveTo(baseCoords[0], baseCoords[1]);
					for (var an=0;an<7;an++) {
						var trueAngle = ((an / 6) * (Math.PI * 2)) + (Math.PI / 6) + (Math.PI / 6);
						var xAdd = size * tile_size * Math.sin(trueAngle);
						var yAdd = size * tile_size * Math.cos(trueAngle);
						ctx.lineTo(baseCoords[0] + xAdd, baseCoords[1] + yAdd);
					}
				}
			}
			ctx.fill(display_fillRule);
		}
	}
	beDrawn() {
		//only draw self if in regular mode
		if (!editor_active) {
			//steals map drawing code because I don't feel like doing the hard way
			var tileStartX = Math.floor(camera.x);
			var tileStartY = Math.floor(camera.y / 0.866) - 1;
			var drawSquaresX = Math.floor(canvas.width / tile_size) + 2;
			var drawSquaresY = Math.floor((canvas.height / tile_size) * 1.4);
		
			//main for loop
			ctx.globalAlpha = 0.5;
			for (var yM=0;yM<drawSquaresY;yM++) {
				for (var xM=0;xM<drawSquaresX;xM++) {
					var squarePos = spaceToScreen(tileStartX + xM, tileStartY + yM);
					var [squareX, squareY] = squarePos;

					//entity distance
					var entityDist = this.dispRad + 1;
					for (var a=0;a<loading_map.entities.length;a++) {
						if (loading_map.entities[a] != this) {
							if (loading_map.entities[a] instanceof Firefly) {
								entityDist = Math.min(entityDist, getDistance([tileStartX + xM, tileStartY + yM], [loading_map.entities[a].animX, loading_map.entities[a].animY]) / 3);
							} else {
								entityDist = Math.min(entityDist, getDistance([tileStartX + xM, tileStartY + yM], [loading_map.entities[a].animX, loading_map.entities[a].animY]));
							}
						}
					}

					ctx.globalAlpha = 1 - Math.max(-1 * ((entityDist * 3) / this.dispRad) + 1, 0);
					
					drawMapSquare(squareX, squareY, "i");
				}
				//if off the end of the map, skip the rest
				if (yM + tileStartY > loading_map.data.length-1) {
					yM = drawSquaresY + 1;
				}
			}
			ctx.globalAlpha = 1;
		}
	}
	

	beReset() {

	}
}




class Switch {
	constructor(switchXY, blockXY, offState, onState) {
		this.x = switchXY[0];
		this.y = switchXY[1];

		[this.animX, this.animY] = [this.x, this.y];

		[this.targetX, this.targetY] = blockXY;
		this.offID = offState;
		this.onID = onState;
		this.pressTime = 0;
		this.pressed = false;
	}

	tick() {
		this.checkPressStatus();

		//on state / off state
		if (this.pressed) {
			loading_map.data[this.targetY] = replaceString(loading_map.data[this.targetY], this.onID, this.targetX);
			this.pressTime += 1;
		} else {
			loading_map.data[this.targetY] = replaceString(loading_map.data[this.targetY], this.offID, this.targetX);
			this.pressTime *= 0.85;
		}
	}
	//checks whether there is an entity or player with this location
	checkPressStatus() {
		this.pressed = false;

		//checking player
		if (player.x == this.x && player.y == this.y) {
			this.pressed = true;
		} else {
			//checking entities
			for (var g=0;g<loading_map.entities.length;g++) {
				if (loading_map.entities[g].x == this.x && loading_map.entities[g].y == this.y && !(loading_map.entities[g] instanceof Switch)) {
					this.pressed = true;
					g = loading_map.entities.length + 1;
					
				}
			}
		}
	}

	beDrawn() {
		//split into two parts, the switch and the ring
		this.drawSelf();
		this.drawTarget();
	}

	drawSelf() {
		//only draw self if on screen
		if (Math.abs(this.x - player.animX) < canvas.width / (tile_size * 1.5) && Math.abs(this.y - player.animY) < canvas.height / (tile_size * 1.5)) {
			var drawCoords = spaceToScreen(this.x, this.y);
			//drawing self
			ctx.fillStyle = color_switch;
			drawPoly(drawCoords[0], drawCoords[1], tile_half, 6, Math.PI / 6);
			ctx.fillStyle = color_switch_highlight;
			drawPoly(drawCoords[0], drawCoords[1], tile_half * 0.8, 6, Math.PI / 6);
		}
	}

	drawTarget() {
		//drawing ring around target block
		if (Math.abs(this.targetX - player.animX) < canvas.width / (tile_size * 1.5) && Math.abs(this.targetY - player.animY) < canvas.height / (tile_size * 1.5)) {
			var drawCoords = spaceToScreen(this.targetX, this.targetY);
			//ring part 1
			ctx.strokeStyle = color_switch_ring;
			ctx.lineWidth = 2;
			ctx.beginPath();
			for (var an=0;an<7;an++) {
				var trueAngle = ((an / 6) * (Math.PI * 2)) + (Math.PI / 6) + (Math.PI / 6);
				var spice = (0.8 + (Math.abs(((((this.pressTime) / 30) + 5) % 2) - 1) / 4));
				var xAdd = (tile_half / 0.8) * Math.sin(trueAngle) * spice;
				var yAdd = (tile_half / 0.8) * Math.cos(trueAngle) * spice;
				ctx.lineTo(drawCoords[0] + xAdd, drawCoords[1] + yAdd);
			}
			ctx.stroke();
			ctx.lineWidth = 1;
		}
	}

	beReset() {
		//other entities being reset will reset this automatically
	}

}





class LightSwitch extends Switch {
	constructor(switchXY, lightXY) {
		super(switchXY, lightXY, "", "");
		this.lamp = new Firefly(lightXY[0], lightXY[1]);
		this.populated = false;
	}

	tick() {
		this.checkPressStatus();

		if (this.pressed && !this.populated) {
			//if pressed but not added to the entities array, do that
			loading_map.entities.push(this.lamp);
			this.populated = true;

		} else if (!this.pressed && this.populated) {
			//if unpressed and still in the entities array, remove self's lamp
			for (var a=0;a<loading_map.entities.length;a++) {
				if (loading_map.entities[a] == this.lamp) {
					loading_map.entities.splice(a, 1);
					a = loading_map.entities.length + 1;
					this.populated = false;
				}
			}
		}
	}

	drawTarget() {
		//drawing ring around target block
		if (Math.abs(this.targetX - player.animX) < canvas.width / (tile_size * 1.5) && Math.abs(this.targetY - player.animY) < canvas.height / (tile_size * 1.5)) {
			var drawCoords = spaceToScreen(this.targetX, this.targetY);
			//ring part 1
			ctx.strokeStyle = color_firefly;
			ctx.lineWidth = 2;
			ctx.beginPath();
			for (var an=0;an<7;an++) {
				var trueAngle = ((an / 6) * (Math.PI * 2)) + (Math.PI / 6) + (Math.PI / 6);
				var spice = (0.8 + (Math.abs(((((this.pressTime) / 30) + 5) % 2) - 1) / 4));
				var xAdd = (tile_half / 0.8) * Math.sin(trueAngle) * spice;
				var yAdd = (tile_half / 0.8) * Math.cos(trueAngle) * spice;
				ctx.lineTo(drawCoords[0] + xAdd, drawCoords[1] + yAdd);
			}
			ctx.stroke();
			ctx.lineWidth = 1;
		}
	}
}




class Walker extends MovableTileEntity {
	constructor(x, y, movementDirections) {
		super("#F40", x, y);
		this.homeX = x;
		this.homeY = y;

		this.mD = movementDirections;
		this.mDPos = 0;
		this.limit = 20;
		this.pRP = [player.x, player.y];
		this.stopSurfaces = "A";
		this.animLasers = [0, 0, 0, 0, 0, 0];

		this.delay = 4;
	}

	tick() {
		super.tick();

		//if the player has moved, move as well
		if (this.pRP[0] != player.x || this.pRP[1] != player.y) {
			if (this.delay == 0) {
				this.delay = 4;
				this.pRP = [player.x, player.y];

				//logging self position
				var selfPos = [this.x, this.y];

				//moving
				this.handleMoveInput(this.mD[this.mDPos]);
				this.move();

				//if self position is the same, increment direction and try moving
				var tolerance = this.mD.length;
				while (this.x == selfPos[0] && this.y == selfPos[1] && tolerance > 0) {
					this.mDPos += 1;
					if (this.mDPos > this.mD.length-1) {
						this.mDPos = 0;
					}

					this.handleMoveInput(this.mD[this.mDPos]);
					this.move();
					tolerance -= 1;
				}
			}
			this.delay -= 1;
		}
	}

	alignAnimCoords() {
		var [base, percentage] = this.alignAnimQueue();

		this.animX = linterp(this.queue[base][0], this.queue[base+1][0], percentage);
		this.animY = linterp(this.queue[base][1], this.queue[base+1][1], percentage);
		this.animLasers = [	linterp(this.queue[base][2], this.queue[base+1][2], percentage),
							linterp(this.queue[base][3], this.queue[base+1][3], percentage),
							linterp(this.queue[base][4], this.queue[base+1][4], percentage),
							linterp(this.queue[base][5], this.queue[base+1][5], percentage),
							linterp(this.queue[base][6], this.queue[base+1][6], percentage),
							linterp(this.queue[base][7], this.queue[base+1][7], percentage)];
	}

	beDrawn() {
		super.beDrawn();

		//drawing danger lines out from self
		var drawCoords = spaceToScreen(this.animX, this.animY);

		ctx.strokeStyle = color_laser;
		ctx.lineWidth = tile_half;
		ctx.globalAlpha = 0.7;
		for (var g=0;g<this.animLasers.length;g++) {
			var angle = ((g / 6) * (Math.PI * 2)) + (Math.PI / 6);
			var xAdd = (this.animLasers[g] + 0.5) * tile_size * Math.sin(angle);
			var yAdd = (this.animLasers[g] + 0.5) * tile_size * Math.cos(angle);

			ctx.beginPath();
			ctx.moveTo(drawCoords[0], drawCoords[1]);
			ctx.lineTo(drawCoords[0] + xAdd, drawCoords[1] + yAdd);
			ctx.stroke();

		}
		ctx.lineWidth = 1;
		ctx.globalAlpha = 1;
	}

	//for the laser, searches forwards and returns the number where it needs to stop
	expand(x, y, direction, number) {
		//if the limit has been reached, cease
		if (number > this.limit) {
			return number;
		} else {
			//check the current square, if it's available recurse. If not, return the number.
			var available = true;
			var c = 0;
			var value;
			try {
				value = loading_map.data[y][x];
			} catch (e) {
				//empty space is registered as a space
				value = " ";
			}

			//colliding with blocks
			for (c;c<this.stopSurfaces.length;c++) {
				if (value == this.stopSurfaces[c]) {
					available = false;
					c = this.stopSurfaces.length + 1;
				}
			}

			//colliding with tile entities
			for (var w=0;w<loading_map.entities.length;w++) {
				if (loading_map.entities[w] != this && loading_map.entities[w] instanceof MovableTileEntity && loading_map.entities[w].x == x && loading_map.entities[w].y == y) {
					available = false;
				}
			}

			//recursing if available
			if (available) {
				//modifier lookup chart
				var move_codes = {
					"UL": [-1 + Math.abs(((y + 5) % 2) - 1), -1],
					"UR": [0 + Math.abs(((y + 5) % 2) - 1), -1],
					"L": [-1, 0],
					"R": [1, 0],
					"DL": [-1 + Math.abs(((y + 5) % 2) - 1), 1],
					"DR": [0 + Math.abs(((y + 5) % 2) - 1), 1]
				};

				number = this.expand(x + move_codes[direction][0], y + move_codes[direction][1], direction, number + 1);

				//colliding with player
				if (player.x == x && player.y == y && !editor_active) {
					loading_map.beReset();
				}
			}
			return number;
		}
	}

	truePositionReset() {
		[this.x, this.y] = [this.homeX, this.homeY]; 
		this.pRP = [player.x, player.y];
		this.mDPos = 0;
		this.dir = this.mD[this.mDPos];
		//queue stuffies
		this.queue.push([this.x, this.y]);

		var laserDirs = ["DR", "R", "UR", "UL", "L", "DL"];
		
		for (var j=0;j<laserDirs.length;j++) {
			this.queue[this.queue.length-1][j+2] = this.expand(this.x, this.y, laserDirs[j], -1);
		}
	}

	move() {
		var succ = super.move();
		
		var laserDirs = ["DR", "R", "UR", "UL", "L", "DL"];
		
		for (var j=0;j<laserDirs.length;j++) {
			this.queue[this.queue.length-1][j+2] = this.expand(this.x, this.y, laserDirs[j], -1);
		}
	}

	beReset() {
		[this.x, this.y] = [this.homeX, this.homeY];

		var self = this;
		window.setTimeout(function() {self.truePositionReset();}, 20);
	}
}





class LongWalker extends Walker {
	constructor(x, y, movementDirections) {
		super(x, y, movementDirections);
		this.limit = 50;
	}
}