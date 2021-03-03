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
	constructor(xPERCENTAGE, yPERCENTAGE, widthPERCENTAGE, label, propertyToModifySTRING, propertyDisplay, textBoxText, resetTunnel) {
		this.x = xPERCENTAGE;
		this.y = yPERCENTAGE;
		this.width = widthPERCENTAGE;

		this.label = label;
		this.property = propertyDisplay;
		this.execution = propertyToModifySTRING;
		this.boxLabel = textBoxText;
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
					var value = prompt(this.boxLabel, eval(this.property));
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