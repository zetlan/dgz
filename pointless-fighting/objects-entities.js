
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