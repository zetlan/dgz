const color_UI_text = "#F8F";
const color_UI_grey = "#888";
const color_UI_lightGrey = "#CCC";
const color_UI_selection = "#0AF";

class UI_Parent {
	constructor(x, y, width) {
		this.x = x;
		this.y = y;
		this.width = width;
	}

	drawBox(x, y, width, height, arcRadius);
}


class UI_Button extends UI_Parent {
	constructor(x, y, widthPERCENTAGE, heightPERCENTAGE, label, codeOnClick) {
		super(x, y, widthPERCENTAGE);
		this.height = heightPERCENTAGE;
		this.label = label;
		this.code = codeOnClick;
		this.mouseOver = false;
	}

	beDrawn() {
		ctx.lineWidth = canvas.height / 96;
		ctx.strokeStyle = color_grey_dark;
		if (this.mouseOver) {
			ctx.fillStyle = color_grey_dark;
		} else {
			ctx.fillStyle = color_grey_light;
		}
		drawRoundedRectangle(canvas.width * (this.x - this.width / 2), canvas.height * (this.y - this.height / 2), canvas.width * this.width, canvas.height * this.height, canvas.height / 48);

		ctx.font = `${canvas.height / 25}px Comfortaa`;
		ctx.textAlign = "center";
		ctx.fillStyle = color_text;
		ctx.fillText(this.label, canvas.width * this.x, (canvas.height * this.y) + (canvas.height / 75));
	}

	tick() {
		//mouseover check
		this.mouseOver = (cursor_x > canvas.width * (this.x - this.width * 0.5) && 
						cursor_x < canvas.width * (this.x + this.width * 0.5) && 
						cursor_y > canvas.height * (this.y - this.height * 0.5) && 
						cursor_y < canvas.height * (this.y + this.height * 0.5));
	}

	interact() {
		if (this.mouseOver) {
			eval(this.code);
			return 31;
		}
	}
}

//slider
class UI_Slider extends UI_Parent {
	constructor(xPERCENTAGE, yPERCENTAGE, widthPERCENTAGE, sliderWidthPERCENTAGE, label, propertyToModifySTRING, displayProperty, minValue, maxValue, snapAmount) {
		super(xPERCENTAGE, yPERCENTAGE, widthPERCENTAGE);
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
		var propertyValue = eval(this.property);
		var displayValue = propertyValue;
		if (this.snapTo % 1 != 0) {
			displayValue = displayValue.toFixed(2);
		} else {
			displayValue = Math.round(displayValue);
		}
		//text
		ctx.fillStyle = color_text_bright;
		ctx.font = `${canvas.height / 40}px Comfortaa`;
		ctx.textAlign = "left";
		ctx.fillText(`${this.label} (${displayValue})`, canvas.width * this.x, (canvas.height * this.y) + (canvas.height / 108));



		//slider
		ctx.strokeStyle = color_grey_dark;
		ctx.beginPath();

		ctx.moveTo(canvas.width * (this.x + this.textSpace), canvas.height * this.y);
		ctx.lineTo(canvas.width * (this.x + this.width), canvas.height * this.y);
		ctx.stroke();
		drawCircle(color_grey_light, canvas.width * (this.x + this.textSpace + (getPercentage(this.min, this.max, propertyValue) * (this.width - this.textSpace))), canvas.height * this.y, 4);
		//drawCircle(color_grey_light, canvas.width * (this.x + this.textSpace), canvas.height * this.y, 4);
		ctx.stroke();
	}

	interact() {
		//update self's values if cursor is down
		if (cursor_down) {
			//if in the area, modify value
			if (cursor_y > (canvas.height * this.y) - cursor_hoverTolerance && cursor_y < (canvas.height * this.y) + cursor_hoverTolerance &&
			cursor_x < (canvas.width * (this.x + this.width)) + cursor_hoverTolerance && cursor_x > (canvas.width * this.x) - cursor_hoverTolerance) {
				var percentage = cursor_x - (canvas.width * (this.x + this.textSpace));
				percentage = clamp(percentage / (canvas.width * (this.width - this.textSpace)), 0, 1);
				var value = linterp(this.min, this.max, percentage);
				value = Math.round(value / this.snapTo) * this.snapTo;
				eval(this.execution);
				if (this.doReset) {
					replacePlayer(0 + (7 * data_persistent.settings.pastaView));
					loading_state.tunnel.updatePosition(loading_state.tunnel.x, loading_state.tunnel.y, loading_state.tunnel.z);
					replacePlayer(7);
				}
				return 31;
			}
		}
	}

	tick() {
	}
}

//text boxes you can click on and change in the editor
class UI_TextBox extends UI_Parent {
	constructor(xPERCENTAGE, yPERCENTAGE, widthPERCENTAGE, label, propertyToModifySTRING, propertyDisplay, textBoxText, textBoxPrefill) {
		super(xPERCENTAGE, yPERCENTAGE, widthPERCENTAGE);

		this.label = label;
		this.property = propertyDisplay;
		this.execution = propertyToModifySTRING;
		this.boxLabel = textBoxText;
		this.boxContent = textBoxPrefill;
		this.doReset = resetTunnel;
	}

	beDrawn() {
		drawSelectionBox(canvas.width * (this.x + (this.width * 0.5)), canvas.height * this.y, canvas.width * this.width, canvas.height / 25);

		//text
		ctx.fillStyle = color_text_bright;
		ctx.font = `${canvas.height / 42}px Comfortaa`;
		ctx.textAlign = "left";
		ctx.fillText(this.label + eval(this.property), canvas.width * (this.x + 0.01), (canvas.height * this.y) + (canvas.height / 126));
	}

	interact() {
		//update self's values if cursor is down
		if (cursor_down) {
			//if in the area, modify value
			if (cursor_y > (canvas.height * this.y) - cursor_hoverTolerance && cursor_y < (canvas.height * this.y) + cursor_hoverTolerance) {
				if (cursor_x < (canvas.width * (this.x + this.width)) + cursor_hoverTolerance && cursor_x > (canvas.width * this.x) - cursor_hoverTolerance) {
					var value = prompt(this.boxLabel, eval(this.boxContent));
					//sanitize input because users are evil gremlins (sorry any user that's reading this, you're not an evil gremlin, but your typing habits could cause problems)
					if (isValidString(value)) {
						value.replaceAll(`\'`, "");
						value.replaceAll(`\\`, "");

						eval(this.execution);
						if (this.doReset) {
							player = new Runner(player.x, player.y, player.z);
							loading_state.tunnel.updatePosition(loading_state.tunnel.x, loading_state.tunnel.y, loading_state.tunnel.z);
							player = new Pastafarian(player.x, player.y, player.z);
						}
						//repeat pop-up prevention
						cursor_x = -1000;
						cursor_y = -1000;
					}
				}
			}
		}
	}
	
	tick() {
	}
}

class UI_Toggle extends UI_Parent {
	constructor(xPERCENTAGE, yPERCENTAGE, widthPERCENTAGE, label, propertyToModifySTRING) {
		super(xPERCENTAGE, yPERCENTAGE, widthPERCENTAGE);
		this.text = label;
		this.property = propertyToModifySTRING;
	}

	beDrawn() {
		//selection box
		drawSelectionBox((this.x + this.width) * canvas.width, this.y * canvas.height, (canvas.height / 36) * 2,( canvas.height / 36) * 2);

		ctx.fillStyle = color_text_bright;
		if (eval(this.property)) {
			ctx.fillRect(((this.x + this.width) * canvas.width) - (canvas.height / 72), (this.y * canvas.height) - (canvas.height / 72), canvas.height / 36, canvas.height / 36);
		}

		//text
		ctx.font = `${canvas.height / 36}px Comfortaa`;
		ctx.textAlign = "left";
		ctx.fillText(this.text, canvas.width * this.x, (canvas.height * this.y) + (canvas.height / 108));
	}

	interact() {
		if (cursor_x > this.x * canvas.width && cursor_x < (this.x + this.width) * canvas.width && cursor_y > (this.y * canvas.height) - (canvas.height / 36) && cursor_y < (this.y * canvas.height) + (canvas.height / 36)) {
			eval(`${this.property} = !${this.property};`);
		}
	}

	tick() {
	}
}