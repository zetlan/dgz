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
		player.target = this.playerPosDefault;
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
				player.dir = [0, 0];
				//updating player position
				//reset map if moving to a child map
				if (this.exitingTo.parent == this) {
					//[player.x, player.y] = loading_map.playerPosDefault;
					this.exitingTo.beReset();
				} else {
					[player.x, player.y] = loading_map.playerPos;
				}
				
			}
		}
	}
}



class Player {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.r = tile_size / 3;
		this.drawX = x;
		this.drawY = y;

		this.target = [this.x, this.y];
		this.dir = [0, 0];
	}

	tick() {
		//confirming target coords are valid
		if (this.dir[0] != 0 || this.dir[1] != 0) {
			var mGood = validateMovement(this.target[0], this.target[1]);
			if (mGood) {
				[this.x, this.y] = this.target;
			} else {
				this.target = [this.x, this.y];
			}
		}

		//bringing drawing coords closer to true coordinates
		this.drawX = ((this.drawX * (display_animDelay - 1)) + this.x) / display_animDelay;
		this.drawY = ((this.drawY * (display_animDelay - 1)) + this.y) / display_animDelay;

		//camera follow of player
		camera.x = this.drawX - ((canvas.width / 2) / tile_size) + Math.abs(((0.5 * (this.drawY + 5)) % 1) - 0.5);
		camera.y = (this.drawY * Math.sin(Math.PI / 3)) - ((canvas.height / 2) / tile_size);
	}

	beDrawn() {
		var drawCoord = spaceToScreen(this.drawX, this.drawY);
		drawEllipse(color_player, drawCoord[0], drawCoord[1], this.r, this.r, 0, 0, Math.PI * 2);
	}

	//movement functions
	move(moveCode) {
		//consists of two movement systems, one for odd-numbered rows and one for even
		var offset = Math.abs(((this.y + 5) % 2) - 1);
		var move_codes = {
			"UL": [-1 + offset, -1],
			"UR": [0 + offset, -1],
			"L": [-1, 0],
			"R": [1, 0],
			"DL": [-1 + offset, 1],
			"DR": [0 + offset, 1]
		};

		//parsing move code
		this.target = [this.x + move_codes[moveCode][0], this.y + move_codes[moveCode][1]];
		this.dir = move_codes[moveCode];
	}
}


class Orb {
	constructor(color, x, y) {
		this.x = x;
		this.y = y;
		this.drawX = x;
		this.drawY = y;
		this.homeX = x;
		this.homeY = y;

		this.color = color;
	}

	tick() {
		//if the player is in the same square as self, try moving according to the vector
		if (player.x == this.x && player.y == this.y) {
			//have to adjust the x vector because of the hexagonal tile offset
			var newXDir = player.dir[0];
			//this code is stupid but it makes the movement work correctly
			if (player.dir[1] != 0) {
				var offset = Math.abs((((player.y+1) + 5) % 2) - 1);
				if (offset == 0) {
					offset = -1;
				}
				newXDir = player.dir[0] - offset;
			}

			//check for valid blocks
			var valid = validateMovement(this.x + newXDir, this.y + player.dir[1]);

			//check for valid entities
			for (var h=0;h<loading_map.entities.length;h++) {
				//if the target position and the entitiy position are the same, there's a problem
				//also make sure entity is not a switch
				if (this.x + newXDir == loading_map.entities[h].x && this.y + player.dir[1] == loading_map.entities[h].y && loading_map.entities[h].constructor.name != "Switch") {
					valid = false;
					h = loading_map.entities.length + 1;
				}
			}

			//if the move is successful, cool. If the move is unsuccessful, move the player backwards to their original position
			if (valid) {
				[this.x, this.y] = [this.x + newXDir, this.y + player.dir[1]];
			} else {
				[player.x, player.y] = [player.x - player.dir[0], player.y - player.dir[1]];
				player.dir = [0, 0];
			}
		}


		//updating animation position
		this.drawX = ((this.drawX * (display_animDelay - 1)) + this.x) / display_animDelay;
		this.drawY = ((this.drawY * (display_animDelay - 1)) + this.y) / display_animDelay;
	}

	beDrawn() {
		var drawCoords = spaceToScreen(this.drawX, this.drawY);
		drawEllipse(this.color, drawCoords[0], drawCoords[1], player.r, player.r, 0, 0, Math.PI * 2);
	}

	beReset() {
		[this.x, this.y] = [this.homeX, this.homeY];
	}
}


class Stone extends Orb {
	constructor(x, y) {
		super("#888", x, y);
	}

	beDrawn() {
		var drawCoords = spaceToScreen(this.drawX, this.drawY);
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