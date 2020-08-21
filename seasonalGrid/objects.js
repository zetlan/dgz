class Map {
	constructor(bgColor, worldData, entityData, exitData) {
		this.bg = bgColor;
		this.data = worldData;
		this.entities = entityData;
		this.season = 0;
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