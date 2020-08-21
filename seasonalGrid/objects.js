class Map {
	constructor(bgColor, worldData, entityData) {
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
		this.r = 12;
		this.drawX = x;
		this.drawY = y;
		this.animDelay = 8;

		this.target = [0, 0];
	}

	tick() {
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
		if (this.y % 2 == 0) {
			[this.x, this.y] = [this.x + move_codes[moveCode][0], this.y + move_codes[moveCode][1]];
		} else {
			[this.x, this.y] = [this.x + move_codes[moveCode][0], this.y + move_codes[moveCode][1]];
		}
		
	}
}