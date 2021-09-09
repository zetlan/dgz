
class UI_Button {
	constructor(x, y, width, height, text, haveLightText, codeToRunAsString) {
		this.x = x;
		this.y = y;
		this.w = width;
		this.h = height;
		this.text = text;
		this.code = codeToRunAsString;
		this.light = haveLightText;

		this.textSize = 0.03;
	}

	tick() {
		//if the cursor is down and over the button, activate
		if (this.over) {
			eval(this.code);
		}
	}

	beDrawn() {
		this.over = (cursor_x > canvas.width * (this.x - this.w / 2) && cursor_x < canvas.width * (this.x + this.w / 2) && cursor_y > canvas.height * (this.y - this.h / 2) && cursor_y < canvas.height * (this.y + this.h / 2));

		ctx.strokeStyle = this.over ? color_editor_selection : color_editor_border;
		ctx.fillStyle = this.light ? color_text_light : color_text; 
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
	constructor(buttonX, buttonY, buttonW, buttonH, buttonInitialValue, haveLightTextBOOLEAN, syncButtonTextBOOLEAN, width, height, valuesArr) {
		this.button = new UI_Button(buttonX, buttonY, buttonW, buttonH, buttonInitialValue, haveLightTextBOOLEAN, ``);
		this.buttonSync = syncButtonTextBOOLEAN;
		this.panelUp = false;
		this.w = width;
		this.h = height;
		this.rows = 2;

		this.arr = valuesArr;
		this.value = undefined;
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
			drawRoundedRectangle(leftX, upY, rightX - leftX, downY - upY, canvas.height / menu_curve);
			ctx.fill();
			ctx.stroke();

			//determine which bit is selected
			this.selected = -1;
			if (cursor_x > leftX && cursor_x < rightX && cursor_y > upY && cursor_y < downY) {
				var relX = (cursor_x - leftX) / (canvas.width * this.w);
				var relY = (cursor_y - upY) / (canvas.height * this.h);
				var row = Math.floor(relX * this.rows);
				var column = Math.floor(relY * Math.ceil(this.arr.length / this.rows));
				this.selected = (this.rows * column) + row;
				if (column < 0) {
					this.selected = -1;
				}
			}

			//actual texts
			ctx.font = `${canvas.height / 26}px Ubuntu`;
			ctx.textAlign = "center";
			ctx.fillStyle = color_text_light;
			var x;
			var y;
			var columns = Math.ceil(this.arr.length / this.rows);
			for (var f=0; f<this.arr.length; f++) {
				x = leftX + canvas.width * ((1 / (2 * this.rows)) + ((f % this.rows) * (1 / this.rows))) * this.w;
				y = upY + canvas.height * ((Math.floor(f / this.rows) + 1) / (columns + 1)) * this.h;
				var boxWidth = canvas.width * ((this.w / this.rows) - 0.02);
				ctx.fillText(this.arr[f], x, y);
				if (f == this.selected) {
					ctx.strokeStyle = color_editor_selection;
					drawSelectionBox(x - (boxWidth / 2), y - (canvas.height * 0.025), boxWidth, canvas.height * 0.05);
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
			if (this.selected == -1 || this.selected >= this.arr.length) {
				this.panelUp = false;
				return;
			}

			//set value to the cell the cursor is in
			this.value = this.arr[this.selected];
			if (this.buttonSync) {
				this.button.text = this.arr[this.selected];
			}
			this.panelUp = false;
		}
	}
}


class UI_Slider {
	constructor(x, y, width, text, sliderWidth, sliderMin, sliderMax, sliderInterval, variableToControl) {
		this.x = x;
		this.y = y;
		this.w = width;
		this.h = 0.04;
		this.text = text;

		this.sW = sliderWidth;
		this.sMin = sliderMin;
		this.sMax = sliderMax;
		this.sSnap = sliderInterval;
		this.var = variableToControl;

		this.value = eval(variableToControl);
		this.over = false;
	}

	beDrawn() {
		this.over = (Math.abs(cursor_x - (this.x * canvas.width)) < canvas.width * this.w / 2) && (Math.abs(cursor_y - (this.y * canvas.height)) < canvas.height * this.h / 2);

		//change value if necessary
		if (this.over && cursor_down) {
			var percentage = cursor_x - (canvas.width * (this.x + (this.w / 2) - this.sW));
			percentage = clamp(percentage / (canvas.width * this.sW), 0, 1);
			console.log(percentage);
			this.value = Math.round(linterp(this.sMin, this.sMax, percentage) / this.sSnap) * this.sSnap;
			eval(`${this.var} = ${this.value};`);
		}

		//outline
		ctx.strokeStyle = this.over ? color_editor_selection : color_editor_border;
		drawRoundedRectangle((this.x - this.w / 2) * canvas.width, (this.y - this.h / 2) * canvas.height, this.w * canvas.width, this.h * canvas.height, canvas.height / menu_curve);
		ctx.stroke();

		var displayValue = this.value;
		if (this.snapTo % 1 != 0) {
			displayValue = displayValue.toFixed(2);
		} else {
			displayValue = Math.round(displayValue);
		}
		//text
		ctx.font = `${canvas.height / 32}px Ubuntu`;
		ctx.textAlign = "left";
		ctx.fillStyle = color_text_light;
		ctx.fillText(this.text, (this.x - (this.w * 0.48)) * canvas.width, this.y * canvas.height);


		//slider
		ctx.strokeStyle = color_editor_border;
		ctx.beginPath();
		ctx.moveTo(canvas.width * (this.x + (this.w / 2) - this.sW), this.y * canvas.height);
		ctx.lineTo(canvas.width * (this.x + this.w * 0.48), this.y * canvas.height);
		ctx.stroke();

		//slider tick
		ctx.strokeStyle = this.over ? color_editor_selection : color_editor_border;
		drawCircle(color_grey_light, canvas.width * (this.x + (this.w / 2) - this.sW + linterp(0, this.sW * 0.99, (this.value - this.sMin) / (this.sMax - this.sMin))), canvas.height * this.y, canvas.height / 100);
	}

	tick() {

	}
}