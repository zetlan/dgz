
class UI_Button {
	constructor(x, y, width, height, text, haveLightText, codeToRunAsString) {
		this.x = x;
		this.y = y;
		this.w = width;
		this.h = height;
		this.text = text;
		this.code = codeToRunAsString;
		this.light = haveLightText;

		this.textSize = 0.04;
	}

	tick() {
		//if the cursor is down and over the button, activate
		if (this.over) {
			eval(this.code);
		}
	}

	beDrawn() {
		this.over = (cursor_x > canvas.width * (this.x - this.w / 2) && cursor_x < canvas.width * (this.x + this.w / 2) && cursor_y > canvas.height * (this.y - this.h / 2) && cursor_y < canvas.height * (this.y + this.h / 2));

		ctx.strokeStyle = (this.over && color_editor_selection) || (!this.over && color_editor_border);
		ctx.fillStyle = boolToValues(this.light, color_text_light, color_text);
		ctx.font = `${canvas.height * this.textSize}px Ubuntu`;
		ctx.textAlign = "center";
		ctx.lineWidth = 2;

		ctx.fillText(this.text, canvas.width * this.x, canvas.height * this.y);
		
		drawRoundedRectangle(canvas.width * (this.x - this.w / 2), canvas.height * (this.y - this.h / 2), canvas.width * this.w, canvas.height * this.h, canvas.height / 100);
		ctx.stroke();
	}
}

//panel of buttons the user can choose from. Used when initializing an array of buttons is too extreme
class UI_Panel {
	constructor(buttonX, buttonY, buttonW, buttonH, buttonInitialValue, syncButtonTextBOOLEAN, height, valuesArr, variableToSetOPTIONAL) {
		this.button = new UI_Button(buttonX, buttonY, buttonW, buttonH, buttonInitialValue, false, ``);
		this.buttonSync = syncButtonTextBOOLEAN;
		this.panelUp = false;
		this.w = width;
		this.h = height;
		this.rows = 5;

		this.arr = valuesArr;
		this.var = variableToSetOPTIONAL;
		this.selected = -1;
	}

	beDrawn() {
		if (this.panelUp) {
			//draw panel
			var leftX = canvas.width * (0.5 - this.w / 2);
			var rightX = leftX + canvas.width * this.w;
			var upY = canvas.height * (0.5 - this.h / 2);
			var downY = upY + canvas.height * this.h;
			ctx.fillStyle = color_editor_background;
			drawRoundedRectangle(leftX, upY, rightX - leftX, downY - upY, canvas.height / 100);
			ctx.fill();
			ctx.stroke();

			//determine which bit is selected
			this.selected = -1;
			if (cursor_x > leftX && cursor_x < rightX && cursor_y > upY && cursor_y < downY) {
				var relX = (cursor_x - leftX) / (canvas.width * this.w);
				var relY = (cursor_y - upY) / (canvas.height * this.h);
				this.selected = Math.floor(this.rows * relY * Math.floor(world_maps.length / this.rows)) + Math.floor(relX * this.rows);
			}

			//actual texts
			ctx.font = `${canvas.height / 26}px Ubuntu`;
			var x;
			var y;
			var columns = Math.ceil(this.arr.length / this.rows);
			for (var f=0; f<this.arr.length; f++) {
				x = leftX + canvas.width * ((1 / (2 * this.rows)) + ((f % this.rows) * (1 / this.rows))) * this.w;
				y = upY;
				ctx.fillText(this.arr[f], x, y)
				if (f == this.selected) {
					ctx.strokeStyle = color_editor_selection;
					drawSelectionBox(leftX, upY, rightX - leftX, downY - upY);
					ctx.strokeStyle = color_editor_border;
				} else {
					
				}
			}
		} else {
			//draw button
			this.button.beDrawn();
		}
	}

	tick() {
		if (!this.panelUp) {
			if (this.button.over) {
				this.panelUp = true;
			}
		} else {
			//if the panel is up, recieve a click
			if (this.selected != -1) {
				//set the variable to the cell that the cursor is in
				if (this.var != undefined) {
					eval(`${this.var} = ${this.arr[this.selected]};`);
				}
				if (this.buttonSync) {
					this.button.text = this.arr[this.selected];
				}
			} else {
				//if the cursor's outside, lower panel without choosing a new value
				this.panelUp = false;
			}
		}
	}
}