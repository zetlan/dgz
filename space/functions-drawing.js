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
		drawMeter(meterX, canvas.height * (menuPos + 0.03), meterWidth, meterHeight, character.power, 0, 100, color_power);
		//temp
		drawMeter(meterX, canvas.height * (menuPos + 0.08), meterWidth, meterHeight, character.warm, 0, 100, temperColor);
		//fuel
		drawMeter(meterX, canvas.height * (menuPos + 0.13), meterWidth, meterHeight, character.fuel, 0, 100, color_fuel);
	} else {
		menuPos = 1;
	}
	//sun-pointer
	var dialR = Math.floor(canvas.height / 40);
	var dialX = canvas.width - (dialR * 1.8);
	var dialY = dialR * 1.6;
	var dialAngle = Math.PI + Math.atan2(character.x - character.parent.x, character.y - character.parent.y);
	var l = dialR + 2;

	var momentumAngle = Math.atan2(character.dx - character.parent.dx, character.dy - character.parent.dy);
	var momentumAmount = Math.sqrt(((character.dx - character.parent.dx) * (character.dx - character.parent.dx)) + ((character.dy - character.parent.dy) * (character.dy - character.parent.dy)));

	ctx.fillStyle = color_ship;
	ctx.lineWidth = dialR / 6;
	ctx.globalAlpha = 1;
	ctx.beginPath();
	ctx.ellipse(dialX, dialY, dialR, dialR, 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.beginPath();
	ctx.strokeStyle = character.parent.color;
	ctx.moveTo(dialX, dialY);
	ctx.lineTo(dialX + (l * Math.sin(dialAngle)), dialY + (l * Math.cos(dialAngle)));
	ctx.stroke();

	//zoom text
	
	ctx.fillStyle = color_text;
	ctx.textAlign = "center";
	ctx.fillText(`Zoom: ${(loading_camera.scale).toFixed(3)}x`, canvas.width * 0.2, (dialR * 1.8));
	ctx.fillText(`Time: ${(1 / dt).toFixed(3)}x`, canvas.width * 0.2, (dialR * 3.6));
	ctx.fillText(`Momentum: (${(momentumAmount).toFixed(3)} km/s, ${(((momentumAngle / Math.PI) * 180) + 180).toFixed(1)}°)`, canvas.width * 0.65, canvas.height * (1 - (menuPos + 0.13)));
	ctx.globalAlpha = 1;

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

function drawMeter(x, y, width, height, value, min, max, color) {
	var percentage = value / (max - min);
	ctx.strokeStyle = color;
	ctx.fillStyle = color;
	ctx.lineWidth = "2";
	ctx.beginPath();
	ctx.rect(x, y, width, height);
	ctx.stroke();
	ctx.fillRect(x+3, y+3, (width - 6) * percentage, height-6);
}


function drawShopBackground() {
	//window / bg

	//shop wall, holes must be CCW while outside must be CW because javascript filling is strange
	ctx.fillStyle = color_shop;
	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.lineTo(canvas.width, 0);
	ctx.lineTo(canvas.width, canvas.height);
	ctx.lineTo(0, canvas.height);
	ctx.lineTo(0, 0);


	ctx.moveTo(canvas.width * 0.1, canvas.height * 0.05);
	ctx.lineTo(canvas.width * 0.1, canvas.height * 0.45);
	ctx.lineTo(canvas.width * 0.7, canvas.height * 0.45);
	ctx.lineTo(canvas.width * 0.7, canvas.height * 0.05);
	ctx.lineTo(canvas.width * 0.1, canvas.height * 0.05);
	ctx.fill(); 

	//shop floor
	ctx.fillStyle = color_shop_dark;
	ctx.fillRect(0, canvas.height * 0.6, canvas.width, canvas.height * 0.4);
	//text box
	ctx.globalAlpha = 0.2;
	ctx.fillStyle = color_menu;
	ctx.fillRect(canvas.width * 0.02, canvas.height * 0.5, canvas.width * 0.96, canvas.height * 0.48);
}

function drawShopText() {
	//first get what to actually draw
	var toDraw = loading_state.data[loading_state.line][0];
	var selectorPosition = loading_state.textSelected;

	//splitting up data into player responses and shop text
	toDraw = toDraw.split("|");
	var lines_NPC = toDraw[0];
	var lines_player = toDraw[1];

}