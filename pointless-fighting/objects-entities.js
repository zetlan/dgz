
class Spike {
	constructor(x, y, type) {
		this.x = x;
		this.y = y;
		this.type = type;
	}

	tick() {
		//just straight vibing
	}

	beDrawn() {
		var drawCoords = spaceToScreen(this.x + loading_map.x, this.y + loading_map.y);
		data_images.Decoration.Spikes.drawTexture(this.type, drawCoords[0], drawCoords[1], camera.scale);
	}
}


class Sign {
	constructor(x, y, text) {
		this.x = x;
		this.y = y;
		this.health = 1;
		this.text = text;
		this.invertedColor = cInvert(color_text);

		this.textTime = 0;
		this.textTimeMax = 150;
	}

	tick() {
		//if attacked, restore health and display text
		if (this.health < 1) {
			this.health = 1;
			this.textTime = this.textTimeMax;
		}
	}

	beDrawn() {
		//draw sign

		//draw text
	}
}