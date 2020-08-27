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
		this.animTolerance = 0.01;

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

		this.animX = linterp(this.queue[base][0], this.queue[base+1][0], percentage);
		this.animY = linterp(this.queue[base][1], this.queue[base+1][1], percentage);
	}

	beDrawn() {
		//calculate true coordinates to draw at
		var drawCoord = spaceToScreen(this.animX, this.animY);
		drawEllipse(this.color, drawCoord[0], drawCoord[1], this.r, this.r, 0, 0, Math.PI * 2);
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
					if (loading_map.entities[a].x == this.x + updatePos[0] && loading_map.entities[a].y == this.y + updatePos[1] && loading_map.entities[a].constructor.name != "Switch") {
						return false;
					}
				}

				//if this point is reached, then move
				[this.x, this.y] = [this.x + updatePos[0], this.y + updatePos[1]];
				this.queue.push([this.x, this.y]);
				//if on an ice block, propogate future movements
				if (loading_map.data[this.y][this.x] == "C") {
					this.moveImpulse = true;
				}
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

	beReset() {

	}
}




class Switch {
	constructor(switchXY, blockXY, offState, onState) {
		this.x = switchXY[0];
		this.y = switchXY[1];

		[this.targetX, this.targetY] = blockXY;
		this.offID = offState;
		this.onID = onState;
		this.pressTime = 0;
	}

	tick() {
		//check whether there is an entity or player with this location
		this.pressed = false;
		//checking player
		if (player.x == this.x && player.y == this.y) {
			this.pressed = true;
		} else {
			//checking entities
			for (var g=0;g<loading_map.entities.length;g++) {
				if (loading_map.entities[g].x == this.x && loading_map.entities[g].y == this.y && loading_map.entities[g] != this) {
					this.pressed = true;
					g = loading_map.entities.length + 1;
				}
			}
		}
		

		//on state / off state
		if (this.pressed) {
			loading_map.data[this.targetY] = replaceString(loading_map.data[this.targetY], this.onID, this.targetX);
			this.pressTime += 1;
		} else {
			loading_map.data[this.targetY] = replaceString(loading_map.data[this.targetY], this.offID, this.targetX);
			this.pressTime *= 0.85;
		}
	}

	beDrawn() {
		var drawCoords = spaceToScreen(this.x, this.y);
		//drawing self
		ctx.fillStyle = color_switch;
		drawPoly(drawCoords[0], drawCoords[1], tile_half, 6, Math.PI / 6);
		ctx.fillStyle = color_switch_highlight;
		drawPoly(drawCoords[0], drawCoords[1], tile_half * 0.8, 6, Math.PI / 6);

		//drawing ring around target block
		drawCoords = spaceToScreen(this.targetX, this.targetY);
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


		//glowy part
		if (this.pressed) {
		}
		ctx.lineWidth = 1;

	}

	beReset() {
		//other entities being reset will reset this automatically
	}

}