


function drawDial(bgColor, lineColor, dialX, dialY, dialR, dialAngle) {
	ctx.fillStyle = bgColor;
	ctx.lineWidth = dialR / 6;
	ctx.globalAlpha = 1;
	ctx.beginPath();
	ctx.ellipse(dialX, dialY, dialR, dialR, 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.beginPath();
	ctx.strokeStyle = lineColor;
	ctx.moveTo(dialX, dialY);
	ctx.lineTo(dialX - ((dialR + 2) * Math.sin(dialAngle)), dialY - ((dialR + 2) * Math.cos(dialAngle)));
	ctx.stroke()
}


function drawMenu() {
	ctx.font = `${Math.floor(canvas.height / 24)}px Century Gothic`;
	//to save time, only draw the menu if it is in-bounds
	if (menuPos < 1) {
		//drawing menu boxes
		ctx.globalAlpha = display_menuOpacity;
		ctx.fillStyle = color_menu;
		ctx.fillRect(0, canvas.height * menuPos, canvas.width, canvas.height * 0.3);
		ctx.globalAlpha = 1;
		//text for all the meters
		ctx.fillStyle = color_text;
		ctx.textAlign = "left";
		ctx.fillText("Power: ", Math.floor(canvas.width / 64), (canvas.height * menuPos) + Math.floor(canvas.height / 18));
		ctx.fillText("Temperature: ", Math.floor(canvas.width / 64), (canvas.height * menuPos) + (2 * Math.floor(canvas.height / 18)));
		ctx.fillText("Fuel: ", Math.floor(canvas.width / 64), (canvas.height * menuPos) + (3 * Math.floor(canvas.height / 18)));

		ctx.textAlign = "right";
		ctx.fillText(`${character.power}`, Math.floor(canvas.width * 0.38), (canvas.height * menuPos) + Math.floor(canvas.height / 18));
		ctx.fillText(`${character.warm}° C`, Math.floor(canvas.width * 0.38), (canvas.height * menuPos) + (2 * Math.floor(canvas.height / 18)));
		ctx.fillText(`${(character.fuel).toFixed(2)} / ${character.fuel_max}`, Math.floor(canvas.width * 0.38), (canvas.height * menuPos) + (3 * Math.floor(canvas.height / 18)));
		
		//timer and effects

		ctx.globalAlpha = 1;
		//meters now
		//determining the color of the temperature meter
		var temperColor = hTemperColor;
		if (character.warm < 67) {
			temperColor = mTemperColor
		}
		if (character.warm < 33) {
			temperColor = cTemperColor;
		}

		var meterX = canvas.width * 0.4;
		var meterWidth = canvas.width * 0.5;
		var meterHeight = canvas.height * 0.04;
		//solar
		drawMeter(meterX, ((canvas.height * menuPos) + Math.floor(canvas.height / 18)) - (Math.floor(canvas.height / 24)), meterWidth, meterHeight, character.power, 0, 100, color_power);
		//temp
		drawMeter(meterX, (canvas.height * menuPos) + (2 * Math.floor(canvas.height / 18)) - (Math.floor(canvas.height / 24)), meterWidth, meterHeight, character.warm, 0, 100, temperColor);
		//fuel
		drawMeter(meterX, (canvas.height * menuPos) + (3 * Math.floor(canvas.height / 18)) - (Math.floor(canvas.height / 24)), meterWidth, meterHeight, character.fuel, 0, 100, color_fuel);
	}
	menuPos = Math.min(1, menuPos);

	//sun-pointer
	var size = Math.floor(canvas.height / 40);
	drawDial(color_ship, character.parent.color, canvas.width - (size * 1.8), size * 1.6, size, Math.atan2(character.x - character.parent.x, character.y - character.parent.y));

	//instrument readout text
	var momentumAmount = Math.sqrt(((character.dx - character.parent.dx) ** 2) + ((character.dy - character.parent.dy) ** 2));
	var momentumAngle = Math.atan2(character.dx - character.parent.dx, character.dy - character.parent.dy);

	ctx.fillStyle = color_text;
	ctx.textAlign = "left";
	ctx.fillText(`Zoom: ${(loading_camera.scale / display_scaleMultiplier).toFixed(3)}x`, canvas.width * 0.03, (size * 1.8));
	ctx.fillText(`Time: ${(1 / dt).toFixed(3)}x`, canvas.width * 0.03, (size * 3.6));
	ctx.textAlign = "center";
	ctx.fillText(`Momentum: (${(momentumAmount).toFixed(3)} km/s, ${(((momentumAngle / Math.PI) * 180) + 180).toFixed(1)}°)`, canvas.width * 0.65, canvas.height * (1 - (menuPos + 0.13)));
	ctx.globalAlpha = 1;
}

function drawMeter(x, y, width, height, value, min, max, color) {
	var borderSize = canvas.height / 160;
	var percentage = getPercentage(min, max, value);
	ctx.strokeStyle = color;
	ctx.fillStyle = color;
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.rect(x, y, width, height);
	ctx.stroke();
	ctx.fillRect(x + borderSize, y + borderSize, (width - (borderSize * 2)) * percentage, height - (borderSize * 2));
}

function drawSplash() {
	ctx.fillStyle = menuColor;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = color_text;
	ctx.textAlign = "center";
	ctx.font = `${Math.floor(canvas.width / 12)}px Century Gothic`;
	ctx.fillText("Space", canvas.width * 0.5, 10 + Math.floor(canvas.width / 12));
	ctx.font = `${Math.floor(canvas.height / 16)}px Century Gothic`;
	ctx.fillText("Press Z to begin", canvas.width * 0.5, canvas.height * 0.5);
}


function drawShopBackground() {
	//window / bg
	ctx.fillStyle = color_space;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	//shop wall, holes must be CCW while outside must be CW because javascript filling is strange
	ctx.fillStyle = color_shop;
	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.lineTo(canvas.width, 0);
	ctx.lineTo(canvas.width, canvas.height);
	ctx.lineTo(0, canvas.height);
	ctx.lineTo(0, 0);

	//wall window
	ctx.moveTo(canvas.width * 0.1, canvas.height * 0.05);
	ctx.lineTo(canvas.width * 0.1, canvas.height * 0.45);
	ctx.lineTo(canvas.width * 0.7, canvas.height * 0.45);
	ctx.lineTo(canvas.width * 0.7, canvas.height * 0.05);
	ctx.lineTo(canvas.width * 0.1, canvas.height * 0.05);
	ctx.fill(); 

	//shop floor
	ctx.fillStyle = color_shop_dark;
	ctx.fillRect(0, canvas.height * 0.6, canvas.width, canvas.height * 0.4);
	
	//text
	drawShopText();
}

function drawShopText() {
	//text box
	ctx.globalAlpha = 0.6;
	ctx.fillStyle = color_textBox;
	ctx.fillRect(canvas.width * 0.02, canvas.height * 0.5, canvas.width * 0.96, canvas.height * 0.48);
	ctx.globalAlpha = 1;

	//formatting for text
	ctx.font = `${Math.floor(canvas.height / 30)}px lucida console`;
	ctx.textAlign = "left";
	ctx.fillStyle = color_text;
	//shop text
	for (var t=0; t<loading_state.text_shop.length; t++) {
		ctx.fillText(loading_state.text_shop[t], canvas.width * 0.05, (canvas.height * 0.56) + (Math.floor(canvas.height / 28) * t));
	}

	//response text
	for (var t=0; t<loading_state.text_response.length; t++) {
		ctx.fillText(loading_state.text_response[t], canvas.width * 0.05, (canvas.height * 0.88) + (Math.floor(canvas.height / 28) * t));
	}

	//response selection box
	ctx.strokeStyle = color_text;
	ctx.beginPath();
	ctx.rect(canvas.width * 0.04, ((canvas.height * 0.88) + (Math.floor(canvas.height / 28) * loading_state.response_selected)) - Math.floor(canvas.height / 35), canvas.width * 0.92, Math.floor(canvas.height / 28));
	ctx.stroke();
}