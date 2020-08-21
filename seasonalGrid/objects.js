class Map {
	constructor(bgColor, worldData, playerDefaultPos, entityData, exitData) {
		this.bg = bgColor;
		this.data = worldData;
		this.playerPos = playerDefaultPos;
		//check just to make sure the map is enterable, I want to have some safety
		if (this.playerPos.length != 2) {
			this.playerPos = [1, 1];
		}
		this.entities = entityData;
		this.connections = exitData;
		this.completed = false;
		this.season = 0;

		this.exiting = false;
		this.exitProgress = 0;
		this.exitingTo = undefined;


		//ack gross I wish this syntax didn't exist but here we are
		var self = this;
		window.setTimeout(function() {self.convertConnections();}, 1);
	}

	tick() {
		for (var a=0;a<this.entities.length;a++) {
			this.entities[a].tick();
			this.entities[a].beDrawn();
		}

		//if the player is on an exit block (number) when the map hasn't been completed, force them into an exit
		var forceSwitch = false;
		try {
			var forceSwitch = !this.connections[this.data[player.y][player.x]].completed;
		} catch (error) {}

		if (this.data[player.y][player.x] * 2 > -1 && forceSwitch) {
			this.exiting = true;
			this.exitingTo = this.connections[this.data[player.y][player.x]];
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
				//updating player position
				[player.x, player.y] = loading_map.playerPos;
			}
			
		}
	}

	convertConnections() {
		for (var c=0;c<this.connections.length;c++) {
			this.connections[c] = eval(this.connections[c]);
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
		this.animDelay = 8;

		this.target = [0, 0];
	}

	tick() {
		//confirming target coords are valid
		if (this.target[0] != 0 || this.target[1] != 0) {
			var problem = true;
			//run through all the walkable tiles and see if the target tile is on there
			for (var k=0;k<tile_walkables.length;k++) {
				//if the editor is active then the problem becomes false automatically
				if (editor_active || loading_map.data[this.target[1]][this.target[0]] == tile_walkables[k]) {
					problem = false;
					k = tile_walkables.length;
				}
			}

			//if the tile is walkable, move to it
			if (!problem) {
				[this.x, this.y] = this.target;
				this.target = [0, 0];
			}
		}
		//bringing drawing coords closer to true coordinates
		this.drawX = ((this.drawX * (this.animDelay - 1)) + this.x) / this.animDelay;
		this.drawY = ((this.drawY * (this.animDelay - 1)) + this.y) / this.animDelay;

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
}