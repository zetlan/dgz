//I can't physically stop you from looking through all this code. But to be honest, I don't know why you would. I don't even like looking through all this code, and I wrote the darn thing!



//acts as a light source, as the player normally would
class SceneLight {
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;

		this.selectedPart = undefined;
	}

	beDrawn() {
		//only draw self if in edit mode and not clipped
		if (editor_active && !isClipped([this.x, this.y, this.z])) {

			//jumping-off points
			var screenCenter = spaceToScreen([this.x, this.y, this.z]);
			var screenXup =  spaceToScreen([this.x + render_crosshairSize, this.y, this.z]);
			var screenYup =  spaceToScreen([this.x, this.y + render_crosshairSize, this.z]);
			var screenZup =  spaceToScreen([this.x, this.y, this.z + render_crosshairSize]);

			//transforming lines to screen coordinates

			//drawing lines
			ctx.strokeStyle = "#F00";
			drawLine(screenCenter, screenXup);
			ctx.strokeStyle = "#0F0";
			drawLine(screenCenter, screenYup);
			ctx.strokeStyle = "#00F";
			drawLine(screenCenter, screenZup);

			//drawing circles
			drawCircle(color_grey_dark, screenXup[0], screenXup[1], editor_handleRadius);
			drawCircle(color_grey_dark, screenYup[0], screenYup[1], editor_handleRadius);
			drawCircle(color_grey_dark, screenZup[0], screenZup[1], editor_handleRadius);

			//selection circles
			switch (this.selectedPart) {
				case 0:
					drawCircle(color_editor_cursor, screenXup[0], screenXup[1], editor_handleRadius);
					break;
				case 1:
					drawCircle(color_editor_cursor, screenYup[0], screenYup[1], editor_handleRadius);
					break;
				case 2:
					drawCircle(color_editor_cursor, screenZup[0], screenZup[1], editor_handleRadius);
					break;
			}
		}
	}

	tick() {
		//move to where the cursor is
		var center = spaceToScreen([this.x, this.y, this.z]);
		var offX =  spaceToScreen([this.x + render_crosshairSize, this.y, this.z]);
		var offY =  spaceToScreen([this.x, this.y + render_crosshairSize, this.z]);
		var offZ =  spaceToScreen([this.x, this.y, this.z + render_crosshairSize]);
		
		var angle;
		var distance;
		var realDistance;
		var cursorOffset;

		switch (this.selectedPart) {
			case 0:
				//x
				//get vector to the offset of the crosshair 
				angle = Math.atan2(offX[0] - center[0], offX[1] - center[1]) + (Math.PI * 1.5);
				distance = getDistance2d(center, offX);
				//get cursor offset
				cursorOffset = [cursor_x - offX[0], cursor_y - offX[1]];
				//rotate offset
				cursorOffset = rotate(cursorOffset[0], -cursorOffset[1], -angle)[0];

				//now that the offset is obtained, we can calculate where to move based on it
				realDistance = render_crosshairSize * (cursorOffset / distance);
				this.x += realDistance;
				break;
			case 1:
				//y
				angle = Math.atan2(offY[0] - center[0], offY[1] - center[1]) + (Math.PI * 1.5);
				distance = getDistance2d(center, offY);
				cursorOffset = [cursor_x - offY[0], cursor_y - offY[1]];
				cursorOffset = rotate(cursorOffset[0], cursorOffset[1], -angle)[0];
				realDistance = render_crosshairSize * (cursorOffset / distance);
				this.y -= realDistance;
				break;
			case 2:
				//z
				angle = Math.atan2(offZ[0] - center[0], offZ[1] - center[1]) + (Math.PI * 1.5);
				distance = getDistance2d(center, offZ);
				cursorOffset = [cursor_x - offZ[0], cursor_y - offZ[1]];
				cursorOffset = rotate(cursorOffset[0], cursorOffset[1], -angle)[0];
				realDistance = render_crosshairSize * (cursorOffset / distance);
				this.z += realDistance;
				break;
		}
		//update the lighting of the world
		for (var n=Math.max(0, loading_state.nearObjs.length-1); n>Math.max(0, loading_state.nearObjs.length-15); n--) {
			loading_state.nearObjs[n].doComplexLighting();
		}

		if (!cursor_down) {
			//if the cursor's not down, stop being moved
			this.selectedPart = undefined;
		}
	}

	becomeSelected() {
		//get the position of the various handles. If the cursor is close enough, attach to that handle
		var screenXup =  spaceToScreen([this.x + render_crosshairSize, this.y, this.z]);
		var screenYup =  spaceToScreen([this.x, this.y + render_crosshairSize, this.z]);
		var screenZup =  spaceToScreen([this.x, this.y, this.z + render_crosshairSize]);

		if (getDistance2d(screenXup, [cursor_x, cursor_y]) < editor_handleRadius) {
			this.selectedPart = 0;
			return true;
		}

		if (getDistance2d(screenYup, [cursor_x, cursor_y]) < editor_handleRadius) {
			this.selectedPart = 1;
			return true;
		}

		if (getDistance2d(screenZup, [cursor_x, cursor_y]) < editor_handleRadius) {
			this.selectedPart = 2;
			return true;
		}

		return false;
	}

	giveEnglishConstructor() {
		return `new SceneLight(${this.x.toFixed(4)}, ${this.y.toFixed(4)}, ${this.z.toFixed(4)})`;
	}
}



class SceneText {
	constructor(x, y, width, textSize, content, lightBOOLEAN) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.fontSize = textSize;
		this.rawContent = content.replace("\\'", "'");
		this.processedContent = [];
		this.isLight = lightBOOLEAN;
		this.selectedPart = undefined;
	}

	beDrawn() {
		this.drawMainBody();
		if (editor_active) {
			this.drawSelectionCircles();
		}
	}

	drawMainBody() {
		if (this.isLight) {
			ctx.fillStyle = color_text_bright;
		} else {
			ctx.fillStyle = color_text;
		}
		ctx.textAlign = "center";
		ctx.font = `${this.fontSize * canvas.height}px Comfortaa`;
		for (var p=0; p<this.processedContent.length; p++) {
			ctx.fillText(this.processedContent[p], (this.x * canvas.width), (this.y * canvas.height) + (canvas.height * this.fontSize * (p + 0.66)));
		}
	}

	drawSelectionCircles() {
		var height = this.fontSize * this.processedContent.length * canvas.height;
		//grey circles
		drawCircle(color_grey_dark, canvas.width * this.x, canvas.height * this.y, editor_handleRadius);
		drawCircle(color_grey_dark, canvas.width * this.x, (canvas.height * this.y) + height, editor_handleRadius);
		drawCircle(color_grey_dark, (canvas.width * this.x) + (canvas.width * this.width), canvas.height * this.y, editor_handleRadius);

		drawCircle(color_grey_dark, (canvas.width * this.x) - (canvas.width * this.width * 0.5), (canvas.height * this.y) + (height * 0.5), editor_handleRadius);
		drawCircle(color_grey_dark, (canvas.width * this.x) - (canvas.width * this.width * 0.5), (canvas.height * this.y) - (this.fontSize * canvas.height * 0.5), editor_handleRadius);

		//colored circles
		switch (this.selectedPart) {
			case 0:
				//position
				drawCircle(color_editor_cursor, canvas.width * this.x, canvas.height * this.y, editor_handleRadius);
				break;
			case 1:
				//text size
				drawCircle(color_editor_cursor, canvas.width * this.x, (canvas.height * this.y) + height, editor_handleRadius);
				this.process();
				break;
			case 2:
				//width
				drawCircle(color_editor_cursor, (canvas.width * this.x) + (canvas.width * this.width), canvas.height * this.y, editor_handleRadius);
				this.process();
				break;
			case 3:
				//bright toggle
				drawCircle(color_editor_cursor, (canvas.width * this.x) - (canvas.width * this.width * 0.5), (canvas.height * this.y) - (this.fontSize * canvas.height * 0.5), editor_handleRadius);
				break;
		}
	}

	process() {
		ctx.font = `${this.fontSize * canvas.height}px Comfortaa`;
		//split content by spaces
		this.processedContent = [];
		var split = this.rawContent.split(" ");
		var temp = "";
		while (split.length > 0) {
			//if adding the next word makes the temp string too long, push the temp string on and put the word on the temp string
			if (ctx.measureText(temp + " " + split[0]).width > this.width * 2 * canvas.width) {
				this.processedContent.push(temp);
				temp = "";
			}
			temp += " " + split.splice(0, 1);
		}
		this.processedContent.push(temp);
	}

	tick() {
		//different behavior depending on part selected
		switch (this.selectedPart) {
			case 0:
				//move to where the cursor is
				this.x = cursor_x / canvas.width;
				this.y = cursor_y / canvas.height;
				break;
			case 1:
				//font size
				this.fontSize = Math.abs(this.y - (cursor_y / canvas.height)) / this.processedContent.length;
				break;
			case 2:
				//width
				this.width = Math.abs(this.x - (cursor_x / canvas.width));
				break;
		}
		if (!cursor_down) {
			//if the cursor's not down, stop being moved
			this.selectedPart = undefined;
		}
	}

	becomeSelected() {
		//determines which part should be selected based on cursor position
		var x = canvas.width * this.x;
		var y = canvas.height * this.y;
		var width = canvas.width * this.width;
		var height = canvas.height * this.fontSize * this.processedContent.length;

		//only become selected if in the correct area
		if (cursor_x > x - width - editor_snapTolerance && cursor_x < x + width + editor_snapTolerance && cursor_y > y - height - editor_snapTolerance && cursor_y < y + height + editor_snapTolerance) {
			//top
			if (cursor_y > y + height - editor_snapTolerance) {
				this.selectedPart = 1;
				return true;
			}

			//right area
			if (cursor_x > x + width - editor_snapTolerance) {
				this.selectedPart = 2;
				return true;
			}

			//text modification
			if (getDistance2d([cursor_x, cursor_y], [x - width / 2, y + height / 2]) < editor_snapTolerance) {
				var test = prompt("Enter message text please;", this.rawContent);
				if (test != null && test != undefined && test != "") {
					this.rawContent = test;
					this.process();
				}
				return false;
			}

			//bright toggle
			if (getDistance2d([cursor_x, cursor_y], [x - width / 2, y - (this.fontSize * canvas.height) / 2]) < editor_snapTolerance) {
				this.selectedPart = 3;
				this.isLight = !this.isLight;
				return false;
			}

			//center
			this.selectedPart = 0;
			return true;
		}
		return false;
	}

	giveEnglishConstructor() {
		return `new SceneText(${this.x.toFixed(4)}, ${this.y.toFixed(4)}, ${this.width.toFixed(4)}, ${this.fontSize.toFixed(4)}, '${this.rawContent}', ${this.isLight})`;
	}
}


class SceneBox {
	constructor(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		this.selectedPart = undefined;
	}

	beDrawn() {
		this.drawMainBody();
		if (editor_active) {
			this.drawSelectionCircles();
		}
	}

	drawMainBody() {
		ctx.strokeStyle = color_cutsceneBox;
		ctx.fillStyle = color_cutsceneBox;
		drawRoundedRectangle((canvas.width * this.x) - (canvas.width * this.width), (canvas.height * this.y) - (canvas.height * this.height), canvas.width * this.width * 2, canvas.height * this.height * 2, canvas.height / 48);
	}

	drawSelectionCircles() {
		//grey circles
		drawCircle(color_grey_dark, canvas.width * this.x, canvas.height * this.y, editor_handleRadius);
		drawCircle(color_grey_dark, canvas.width * this.x, (canvas.height * this.y) + (canvas.height * this.height), editor_handleRadius);
		drawCircle(color_grey_dark, (canvas.width * this.x) + (canvas.width * this.width), canvas.height * this.y, editor_handleRadius);

		//colored circles
		switch (this.selectedPart) {
			case 0:
				drawCircle(color_editor_cursor, canvas.width * this.x, canvas.height * this.y, editor_handleRadius);
				break;
			case 1:
				drawCircle(color_editor_cursor, canvas.width * this.x, (canvas.height * this.y) + (canvas.height * this.height), editor_handleRadius);
				break;
			case 2:
				drawCircle(color_editor_cursor, (canvas.width * this.x) + (canvas.width * this.width), canvas.height * this.y, editor_handleRadius);
				break;
		}
	}

	tick() {
		//different behavior depending on part selected
		switch (this.selectedPart) {
			case 0:
				//move to where the cursor is
				this.x = cursor_x / canvas.width;
				this.y = cursor_y / canvas.height;
				break;
			case 1:
				//vertical stretch
				this.height = Math.abs(this.y - (cursor_y / canvas.height));
				break;
			case 2:
				//horizontal stretch
				this.width = Math.abs(this.x - (cursor_x / canvas.width));
				break;
		}
		if (!cursor_down) {
			//if the cursor's not down, stop being moved
			this.selectedPart = undefined;
		}
	}

	becomeSelected() {
		//determines which part should be selected based on cursor position
		var x = canvas.width * this.x;
		var y = canvas.height * this.y;
		var width = canvas.width * this.width;
		var height = canvas.height * this.height;

		//only become selected if in the correct area
		if (cursor_x > x - width - editor_snapTolerance && cursor_x < x + width + editor_snapTolerance && cursor_y > y - height - editor_snapTolerance && cursor_y < y + height + editor_snapTolerance) {

			if (cursor_y > y + height - editor_snapTolerance) {
				this.selectedPart = 1;
				return true;
			}
			//right area
			if (cursor_x > x + width - editor_snapTolerance) {
				this.selectedPart = 2;
				return true;
			}

			//center
			this.selectedPart = 0;
			return true;
		}
		return false;
	}

	giveEnglishConstructor() {
		return `new SceneBox(${this.x.toFixed(4)}, ${this.y.toFixed(4)}, ${this.width.toFixed(4)}, ${this.height.toFixed(4)})`;
	}
}

class SceneBubble extends SceneBox {
	constructor(x, y, width, height) {
		super(x, y, width, height);
	}

	drawMainBody() {
		ctx.fillStyle = color_cutsceneBox;
		ctx.beginPath();
		ctx.ellipse(this.x * canvas.width, this.y * canvas.height, this.width * canvas.width, this.height * canvas.height, 0, 0, Math.PI * 2);
		ctx.fill();
	}

	giveEnglishConstructor() {
		return `new SceneBubble(${this.x.toFixed(4)}, ${this.y.toFixed(4)}, ${this.width.toFixed(4)}, ${this.height.toFixed(4)})`;
	}
}

class SceneSprite extends SceneBox {
	constructor(x, y, size, spriteSheetSTRING, rotation, backwardsBoolean, textureX, textureY) {
		super(x, y, size, size);
		this.textureX = textureX;
		this.textureY = textureY;
		this.sheet = spriteSheetSTRING;
		this.texture = new Texture(eval(spriteSheetSTRING), data_sprites.spriteSize, 1e1001, false, backwardsBoolean, [[this.textureX, this.textureY]]);

		//special case for map sprite sheet
		if (spriteSheetSTRING == "data_sprites.Map.sheet") {
			this.texture = new Texture(eval(spriteSheetSTRING), data_sprites.spriteSize * 2, 1e1001, false, backwardsBoolean, [[this.textureX, this.textureY]]);
		}
		this.rot = rotation;
	}

	drawMainBody() {
		this.texture.beDrawn(canvas.width * this.x, canvas.height * this.y, this.rot, canvas.width * this.width * 2);
	}

	drawSelectionCircles() {
		//each texture has 5, for modifying different aspects of the texture
		drawCircle(color_grey_dark, canvas.width * this.x, canvas.height * this.y, editor_handleRadius);
		drawCircle(color_grey_dark, (canvas.width * this.x) + (canvas.width * this.width), canvas.height * this.y, editor_handleRadius);
		drawCircle(color_grey_dark, canvas.width * this.x, (canvas.height * this.y) + (canvas.height * this.height), editor_handleRadius);
		drawCircle(color_grey_dark, (canvas.width * this.x) + (canvas.width * this.width), (canvas.height * this.y) + (canvas.height * this.height), editor_handleRadius);
		drawCircle(color_grey_dark, (canvas.width * this.x) - (canvas.width * this.width * 0.5), (canvas.height * this.y) + (canvas.height * this.height * 0.5), editor_handleRadius);

		//colored circles
		switch (this.selectedPart) {
			//center
			case 0:
				drawCircle(color_editor_cursor, canvas.width * this.x, canvas.height * this.y, editor_handleRadius);
				break;
			//size
			case 1:
				drawCircle(color_editor_cursor, canvas.width * this.x, (canvas.height * this.y) + (canvas.height * this.height), editor_handleRadius);
				break;
			//direction
			case 2:
				drawCircle(color_editor_cursor, (canvas.width * this.x) + (canvas.width * this.width), canvas.height * this.y, editor_handleRadius);
				break;
			//rotation
			case 3:
				drawCircle(color_editor_cursor, (canvas.width * this.x) + (canvas.width * this.width), (canvas.height * this.y) + (canvas.height * this.height), editor_handleRadius);
				break;
			//frame type
			case 4:
				drawCircle(color_editor_cursor, (canvas.width * this.x) - (canvas.width * this.width * 0.5), (canvas.height * this.y) + (canvas.height * this.height * 0.5), editor_handleRadius);
				break;
		}
	}

	tick() {
		//different behavior depending on part selected
		switch (this.selectedPart) {
			case 0:
				//move to where the cursor is
				this.x = cursor_x / canvas.width;
				this.y = cursor_y / canvas.height;
				break;
			case 1:
				//size
				this.height = (cursor_y / canvas.height) - this.y;
				if (this.height < 0.004) {
					this.height = 0.004;
				}
				this.width = this.height * 0.75;
				break;
			case 3:
				//rotation
				var xOffset = cursor_x - (canvas.width * this.x);
				var yOffset = cursor_y - (canvas.height * this.y);
				this.rot = Math.atan2(yOffset, xOffset) + (Math.PI * 1.75);
				break;
			case 4:
				//frame to display
				this.rot = 0;
				var xOffset = cursor_x - ((canvas.width * this.x) - (canvas.width * this.width * 0.5));
				var yOffset = cursor_y - ((canvas.height * this.y) + (canvas.height * this.height * 0.5));

				var scale = Math.min(this.texture.size, canvas.width * this.width * 2);

				var sheetXOffset = (this.x * canvas.width) - (((this.textureX + 0.5) - (xOffset / scale)) * this.width * canvas.width * 2);
				var sheetYOffset = (this.y * canvas.height) - (((this.textureY + 0.5) - (yOffset / scale)) * this.height * canvas.height * 2);

				ctx.globalAlpha = 0.2;
				ctx.drawImage(this.texture.sheet, sheetXOffset, sheetYOffset, 
							(this.texture.sheet.width / this.texture.size) * this.width * canvas.width * 2, (this.texture.sheet.height / this.texture.size) * this.height * canvas.height * 2);
				ctx.globalAlpha = 1;

				//if the cursor's up, snap to the nearest frame
				if (!cursor_down) {
					this.textureX = Math.round(this.textureX - (xOffset / scale));
					this.textureY = Math.round(this.textureY - (yOffset / scale));

					this.textureX = clamp(this.textureX, 0, (this.texture.sheet.width / this.texture.size) - 1);
					this.textureY = clamp(this.textureY, 0, (this.texture.sheet.height / this.texture.size) - 1);

					this.texture.frames[0][0] = this.textureX;
					this.texture.frames[0][1] = this.textureY;
				}
				break;
		}
		if (!cursor_down) {
			//if the cursor's not down, stop being moved
			this.selectedPart = undefined;
		}
	}

	becomeSelected() {
		//determines which part should be selected based on cursor position
		var x = canvas.width * this.x;
		var y = canvas.height * this.y;
		var width = canvas.width * this.width;
		var height = canvas.height * this.height;

		//only become selected if in the correct area
		if (cursor_x > x - width - editor_snapTolerance && cursor_x < x + width + editor_snapTolerance && cursor_y > y - height - editor_snapTolerance && cursor_y < y + height + editor_snapTolerance) {
			//diagonal
			if (getDistance2d([cursor_x, cursor_y], [x + width, y + height]) < editor_snapTolerance) {
				this.selectedPart = 3;
				return true;
			}
			//lower area
			if (cursor_y > y + height - editor_snapTolerance) {
				this.selectedPart = 1;
				return true;
			}
			//right area
			if (cursor_x > x + width - editor_snapTolerance) {
				this.texture.backwards = !this.texture.backwards;
				return false;
			}
			//lower left
			if (getDistance2d([cursor_x, cursor_y], [x - (width * 0.5), y + (height * 0.5)]) < editor_snapTolerance) {
				this.selectedPart = 4;
				return true;
			}
			//center
			this.selectedPart = 0;
			return true;
		}
		return false;
	}

	giveEnglishConstructor() {
		return `new SceneSprite(${this.x.toFixed(4)}, ${this.y.toFixed(4)}, ${this.width.toFixed(4)}, '${this.sheet}', ${this.rot.toFixed(4)}, ${this.texture.backwards}, ${this.textureX}, ${this.textureY})`;
	}
}

class SceneTri {
	constructor(x1, y1, x2, y2, width) {
		this.x = x1;
		this.y = y1;
		this.endX = x2;
		this.endY = y2;
		this.width = width;
	}

	beDrawn() {
		this.drawMainBody();
		if (editor_active) {
			this.drawSelectionCircles();
		}
	}

	drawMainBody() {
		//determine angle from width
		var angle = Math.atan2(this.endX - this.x, this.endY - this.y);
		var triOffset = [this.width * canvas.width, 0];
		triOffset = rotate(triOffset[0], triOffset[1], (Math.PI * 2) - angle);
		drawPoly(color_cutsceneBox, [[(this.x * canvas.width) + triOffset[0], (this.y * canvas.height) + triOffset[1]], [this.endX * canvas.width, this.endY * canvas.height], [(this.x * canvas.width) - triOffset[0], (this.y * canvas.height) - triOffset[1]]]);
	}

	drawSelectionCircles() {
		//each texture has 5, for modifying different aspects of the texture
		drawCircle(color_grey_dark, canvas.width * this.x, canvas.height * this.y, editor_handleRadius);
		drawCircle(color_grey_dark, (canvas.width * this.x) + (canvas.width * this.width), canvas.height * this.y, editor_handleRadius);
		drawCircle(color_grey_dark, canvas.width * this.endX, canvas.height * this.endY, editor_handleRadius);

		//colored circles
		switch (this.selectedPart) {
			//p1
			case 0:
				drawCircle(color_editor_cursor, canvas.width * this.x, canvas.height * this.y, editor_handleRadius);
				break;
			//p2
			case 1:
				drawCircle(color_editor_cursor, canvas.width * this.endX, canvas.height * this.endY, editor_handleRadius);
				break;
			//offset
			case 2:
				drawCircle(color_editor_cursor, (canvas.width * this.x) + (canvas.width * this.width), canvas.height * this.y, editor_handleRadius);
				break;
		}
	}

	tick() {
		switch (this.selectedPart) {
			case 0:
				//move to where the cursor is
				this.x = cursor_x / canvas.width;
				this.y = cursor_y / canvas.height;
				break;
			case 1:
				//p2
				this.endX = cursor_x / canvas.width;
				this.endY = cursor_y / canvas.height;
				break;
			case 2:
				//width
				this.width = Math.abs(this.x - (cursor_x / canvas.width));
				break;
		}
		if (!cursor_down) {
			//if the cursor's not down, stop being moved
			this.selectedPart = undefined;
		}
	}

	becomeSelected() {
		//determines which part should be selected based on cursor position

		//p1
		if (getDistance2d([cursor_x, cursor_y], [canvas.width * this.x, canvas.height * this.y]) < editor_snapTolerance) {
			this.selectedPart = 0;
			return true;
		}

		//width
		if (getDistance2d([cursor_x, cursor_y], [(canvas.width * this.x) + (canvas.width * this.width), canvas.height * this.y]) < editor_snapTolerance) {
			this.selectedPart = 2;
			return true;
		}

		//p2
		if (getDistance2d([cursor_x, cursor_y], [canvas.width * this.endX, canvas.height * this.endY]) < editor_snapTolerance) {
			this.selectedPart = 1;
			return true;
		}

		return false;
	}

	giveEnglishConstructor() {
		return `new SceneTri(${this.x.toFixed(4)}, ${this.y.toFixed(4)}, ${this.endX.toFixed(4)}, ${this.endY.toFixed(4)}, ${this.width.toFixed(4)})`;
	}
}


//texture that's in the map and activates a cutscene upon viewing
class MapTexture {
	constructor(x, z, coordinates, cutsceneString, viewCondition) {
		this.x = x;
		this.y = 0;
		this.z = z;
		this.texture = new Texture(data_sprites["Map"].sheet, data_sprites.spriteSize * 2, 1e1001, false, false, coordinates);
		this.map_circleCoords = [-1, -1];
		this.cutsceneRef = `cutsceneData_${cutsceneString}`;
		this.id = "";
		if (this.cutsceneRef != `cutsceneData_undefined`) {
			this.id = eval(this.cutsceneRef).id;
		}
		this.viewCondition = viewCondition;
		this.visible = false;
	}

	activate() {
		if (this.visible) {
			activateCutsceneFromTunnel(1, this.cutsceneRef.split("_")[1], 1);
		}
	}

	beDrawn() {
		this.visible = eval(this.viewCondition);
		if (editor_active || this.visible) {
			this.map_circleCoords = spaceToScreen([this.x, this.y, this.z]);
			this.texture.beDrawn(this.map_circleCoords[0], this.map_circleCoords[1], 0, map_iconSize * canvas.height);
			//small circle in the middle of self for editor
			if (editor_active) {
				drawCircle(color_grey_light, this.map_circleCoords[0], this.map_circleCoords[1], editor_handleRadius);
			}
		}

		//if doesn't lead to a cutscene, make sure self can't be selected
		if (this.id == "") {
			this.visible = false;
		}
	}

	beDrawn_selected() {
		this.beDrawn();
	}

	handleMouseDown() {
		if (!editor_active) {
			//activating cutscene if not in edit mode
			this.activate();
		} else {
			//if in edit mode and the cursor is down too far away, become unselected
			if (getDistance2d(this.map_circleCoords, [cursor_x, cursor_y]) > map_iconSize * canvas.height) {
				loading_state.objSelected = undefined;
			}
		}
	}

	handleMouseMove() {
		//move to where the cursor is
		var newCoords = screenToSpace([cursor_x, cursor_y], world_camera.y);
		this.x = newCoords[0];
		this.z = newCoords[2];
	}

	giveEnglishConstructor() {
		return `new MapTexture(${Math.round(this.x)}, ${Math.round(this.z)}, ${JSON.stringify(this.texture.frames)}, \`${this.cutsceneRef.split("_")[1]}\`, \`${this.viewCondition}\`)`;
	}
}








//sliders for editing properties in the editor
class PropertySlider {
	constructor(xPERCENTAGE, yPERCENTAGE, widthPERCENTAGE, sliderWidthPERCENTAGE, label, propertyToModifySTRING, displayProperty, minValue, maxValue, snapAmount, resetTunnel) {
		this.x = xPERCENTAGE;
		this.y = yPERCENTAGE;
		this.width = widthPERCENTAGE;
		this.textSpace = this.width - sliderWidthPERCENTAGE;

		this.property = displayProperty;
		this.execution = propertyToModifySTRING;
		this.label = label;
		this.min = minValue;
		this.max = maxValue;
		this.snapTo = snapAmount;
		this.doReset = resetTunnel;
	}

	beDrawn() {
		//text
		ctx.fillStyle = color_text_bright;
		ctx.font = `${canvas.height / 36}px Comfortaa`;
		ctx.textAlign = "left";
		ctx.fillText(this.label, canvas.width * this.x, (canvas.height * this.y) + (canvas.height / 108));



		//slider
		ctx.strokeStyle = color_grey_dark;
		ctx.beginPath();

		ctx.moveTo(canvas.width * (this.x + this.textSpace), canvas.height * this.y);
		ctx.lineTo(canvas.width * (this.x + this.width), canvas.height * this.y);
		ctx.stroke();
		drawCircle(color_grey_light, canvas.width * (this.x + this.textSpace + (getPercentage(this.min, this.max, eval(this.property)) * (this.width - this.textSpace))), canvas.height * this.y, 4);
		//drawCircle(color_grey_light, canvas.width * (this.x + this.textSpace), canvas.height * this.y, 4);
		ctx.stroke();
	}

	tick() {
		//update self's values if cursor is down
		if (cursor_down) {
			//if in the area, modify value
			if (cursor_y > (canvas.height * this.y) - cursor_hoverTolerance && cursor_y < (canvas.height * this.y) + cursor_hoverTolerance) {
				if (cursor_x < (canvas.width * (this.x + this.width)) + cursor_hoverTolerance && cursor_x > (canvas.width * this.x) - cursor_hoverTolerance) {
					var percentage = cursor_x - (canvas.width * (this.x + this.textSpace));
					percentage = clamp(percentage / (canvas.width * (this.width - this.textSpace)), 0, 1);
					var value = linterp(this.min, this.max, percentage);
					value = Math.round(value / this.snapTo) * this.snapTo;
					eval(this.execution);
					if (this.doReset) {
						player = new Runner(player.x, player.y, player.z);
						loading_state.tunnel.updatePosition(loading_state.tunnel.x, loading_state.tunnel.y, loading_state.tunnel.z);
						player = new Pastafarian(player.x, player.y, player.z);
					}
				}
			}
		}
	}
}


//text boxes you can click on and change in the editor
class PropertyTextBox {
	constructor(xPERCENTAGE, yPERCENTAGE, widthPERCENTAGE, label, propertyToModifySTRING, propertyDisplay, textBoxText, textBoxPrefill, resetTunnel) {
		this.x = xPERCENTAGE;
		this.y = yPERCENTAGE;
		this.width = widthPERCENTAGE;

		this.label = label;
		this.property = propertyDisplay;
		this.execution = propertyToModifySTRING;
		this.boxLabel = textBoxText;
		this.boxContent = textBoxPrefill;
		this.doReset = resetTunnel;
	}

	beDrawn() {
		//selection box
		ctx.strokeStyle = color_menuSelectionOutline;
		ctx.fillStyle = color_grey_light;
		ctx.globalAlpha = 0.3;
		drawRoundedRectangle(canvas.width * this.x, (canvas.height * this.y) - (canvas.height / 50), canvas.width * this.width, canvas.height / 25, canvas.height / 96);
		ctx.globalAlpha = 1;

		//text
		ctx.fillStyle = color_text_bright;
		ctx.font = `${canvas.height / 42}px Comfortaa`;
		ctx.textAlign = "left";
		ctx.fillText(this.label + eval(this.property), canvas.width * (this.x + 0.01), (canvas.height * this.y) + (canvas.height / 126));
	}

	tick() {
		//update self's values if cursor is down
		if (cursor_down) {
			//if in the area, modify value
			if (cursor_y > (canvas.height * this.y) - cursor_hoverTolerance && cursor_y < (canvas.height * this.y) + cursor_hoverTolerance) {
				if (cursor_x < (canvas.width * (this.x + this.width)) + cursor_hoverTolerance && cursor_x > (canvas.width * this.x) - cursor_hoverTolerance) {
					var value = prompt(this.boxLabel, eval(this.boxContent));
					//sanitize input because users are evil gremlins (sorry any user that's reading this, you're not an evil gremlin, but your typing habits could cause problems)
					if (value != undefined && value != "" && value != null) {
						value.replace(`\'`, "");
						value.replace(`\\`, "");

						eval(this.execution);
						if (this.doReset) {
							player = new Runner(player.x, player.y, player.z);
							loading_state.tunnel.updatePosition(loading_state.tunnel.x, loading_state.tunnel.y, loading_state.tunnel.z);
							player = new Pastafarian(player.x, player.y, player.z);
						}
					}
					
				}
			}
		}
	}
}