/*
INDEX:
	drawCrosshair();
	drawKeys();
	drawPoly();
	drawCircle();
	drawQuad();
	drawWorldLine();

*/



//drawing functions
function drawCrosshair() {
	ctx.strokeStyle = "#FFF";
	//starting pos
	var center = polToCart(world_camera.theta, world_camera.phi, 5);
	center = [center[0] + world_camera.x, center[1] + world_camera.y, center[2] + world_camera.z];

	//jumping-off points
	var xPlus = [center[0] + (render_crosshairSize / 20), center[1], center[2]];
	var yPlus = [center[0], center[1] + (render_crosshairSize / 20), center[2]];
	var zPlus = [center[0], center[1], center[2] + (render_crosshairSize / 20)];

	//transforming lines to screen coordinates

	//drawing lines
	ctx.strokeStyle = "#F00";
	drawWorldLine(center, xPlus);
	ctx.strokeStyle = "#0F0";
	drawWorldLine(center, yPlus);
	ctx.strokeStyle = "#00F";
	drawWorldLine(center, zPlus);
}

function drawInfiniteEndScreen() {
	//main box
	ctx.fillStyle = color_grey_lightest;
	ctx.strokeStyle = color_grey_light;
	ctx.lineWidth = canvas.height / 50;
	drawRoundedRectangle(canvas.width * 0.1, canvas.height * 0.1, canvas.width * 0.8, canvas.height * 0.8, canvas.width * 0.04);

	//getting character order to draw them
	var drawingCharacters = [];
	loading_state.charactersUsed.forEach(c => {
		drawingCharacters.push(c);
	});

	data_characters.forEach(c => {
		if (!drawingCharacters.includes(c)) {
			drawingCharacters.push(c);
		}
	});


	//labels to the side as final labels
	ctx.fillStyle = color_text;
	ctx.font = `${canvas.height / 16}px Century Gothic`;
	ctx.textAlign = "left";

	ctx.fillText(`Total`, canvas.width * 0.35 + (canvas.width * 0.18), canvas.height * 0.7);

	//character availability boxes
	ctx.fillStyle = color_grey_light;
	ctx.strokeStyle = color_menuSelectionOutline;
	ctx.lineWidth = canvas.height / 96;
	
	ctx.font = `${canvas.height / 42}px Century Gothic`;

	var characterNum = 0;
	for (var a=0; a<11; a++) {
		var offY = canvas.height * 0.25 * Math.floor(a / 5);
		var offX = canvas.width * 0.6 * ((a % 5) / 5);

		var textOffset = canvas.height / 40;
		var textOffset2 = menu_characterSize * 2.3;

		ctx.fillStyle = color_text;
		
		

		//labels for every line
		if (a % 5 == 0) {
			ctx.textAlign = "left";
			ctx.fillText(`distance:`, canvas.width * 0.12, (canvas.height * 0.13) + offY + textOffset2);
			ctx.fillText(`time:`, canvas.width * 0.12, (canvas.height * 0.13) + offY + textOffset2 + textOffset);
			ctx.fillText(`avg. speed:`, canvas.width * 0.12, (canvas.height * 0.13) + offY + textOffset2 + (2 * textOffset));
			ctx.fillText(`power cells:`, canvas.width * 0.12, (canvas.height * 0.13) + offY + textOffset2 + (3 * textOffset));
			ctx.fillText(`power cells / min:`, canvas.width * 0.12, (canvas.height * 0.13) + offY + textOffset2 + (4 * textOffset));
		}
		var index = data_characters.indexOf(drawingCharacters[characterNum]);

		if (loading_state.selectionTextures[index] != undefined) {
			//if the character hasn't been used, display the selection box
			if (characterNum >= loading_state.charactersUsed.length) {
				ctx.globalAlpha = 0.3;
				ctx.fillStyle = color_grey_light;
				ctx.strokeStyle = color_menuSelectionOutline;
				drawRoundedRectangle((canvas.width * 0.35) + offX - menu_characterSize, (canvas.height * 0.13) + offY, menu_characterSize * 2, menu_characterSize * 2, canvas.height / 48);
				ctx.globalAlpha = 1;
			} else {
				
				//displaying data about their run
				ctx.textAlign = "center";
				var charInfo = loading_state.characterData[drawingCharacters[characterNum]];
				ctx.fillText(`${charInfo.distance.toFixed(0)} m`, (canvas.width * 0.35) + offX, (canvas.height * 0.13) + offY + textOffset2);
				ctx.fillText(`${getTimeFromFrames(charInfo.time)}`, (canvas.width * 0.35) + offX, (canvas.height * 0.13) + offY + textOffset2 + textOffset);
				ctx.fillText(`${((charInfo.distance / charInfo.time) * 60).toFixed(2)} m/s`, (canvas.width * 0.35) + offX, (canvas.height * 0.13) + offY + textOffset2 + (2 * textOffset));
				ctx.fillText(`${charInfo.powercells}`, (canvas.width * 0.35) + offX, (canvas.height * 0.13) + offY + textOffset2 + (3 * textOffset));
				ctx.fillText(`${((charInfo.powercells / charInfo.time) * 3600).toFixed(2)}`, (canvas.width * 0.35) + offX, (canvas.height * 0.13) + offY + textOffset2 + (4 * textOffset));
			}
			
			//draw character
			loading_state.selectionTextures[index].beDrawn((canvas.width * 0.35) + offX, (canvas.height * 0.13) + offY + menu_characterSize, 0, menu_characterSize * 1.4);
		}
		characterNum += 1;
		//at the end display totals
		if (a == 10) {
			ctx.textAlign = "center";
			offX = canvas.width * 0.24;
			ctx.fillText(`${loading_state.distance.toFixed(0)} m`, (canvas.width * 0.35) + offX, (canvas.height * 0.13) + offY + textOffset2);
			ctx.fillText(`${getTimeFromFrames(loading_state.time)}`, (canvas.width * 0.35) + offX, (canvas.height * 0.13) + offY + textOffset2 + textOffset);
			ctx.fillText(`${((loading_state.distance / loading_state.time) * 60).toFixed(2)} m/s`, (canvas.width * 0.35) + offX, (canvas.height * 0.13) + offY + textOffset2 + (2 * textOffset));
			ctx.fillText(`${loading_state.powercells}`, (canvas.width * 0.35) + offX, (canvas.height * 0.13) + offY + textOffset2 + (3 * textOffset));
			ctx.fillText(`${((loading_state.powercells / loading_state.time) * 3600).toFixed(2)}`, (canvas.width * 0.35) + offX, (canvas.height * 0.13) + offY + textOffset2 + (4 * textOffset));
		}
	}
}

function drawKeys() {
	ctx.fillStyle = color_keyUp;
	ctx.fillRect(0 + 20, canvas.height - 40, 10, 20);
	ctx.fillRect(0 + 70, canvas.height - 40, 10, 20);
	ctx.fillRect(0 + 40, canvas.height - 40, 20, 20);

	ctx.fillStyle = color_keyPress;
	if (player.ax < 0) {
		ctx.fillRect(0 + 20, canvas.height - 40, 10, 20);
	}
	if (player.ax > 0) {
		ctx.fillRect(0 + 70, canvas.height - 40, 10, 20);
	}

	if (controls_spacePressed) {
		ctx.fillRect(0 + 40, canvas.height - 40, 20, 20);
	}
}

function drawPoly(color, xyPointsArr) {
	ctx.fillStyle = color;
	
	var xypa = xyPointsArr;
	ctx.beginPath();
	ctx.moveTo(xypa[0][0], xypa[0][1]);
	for (var i=1;i<xypa.length;i++) {
		ctx.lineTo(xypa[i][0], xypa[i][1]);
	}
	ctx.fill();
}

function drawCircle(color, x, y, radius) {
	ctx.beginPath();
	ctx.fillStyle = color;
	ctx.ellipse(x, y, radius, radius, 0, 0, Math.PI * 2);
	ctx.fill();
}

function drawPlayerWithParentOLD() {
	//sorting player in with the parent tunnel to be drawn
	var stripStorage = orderObjects(player.parent.strips, 4);
			
	//if the player is in the middle of the strips (on top of some but not all) do the special
	if (stripStorage[0].playerIsOnTop() != stripStorage[stripStorage.length-1].playerIsOnTop()) {
		var drawPlayer = true;
		stripStorage.forEach(t => {
			if (drawPlayer && t.playerIsOnTop()) {
				t.beDrawn();
			} else if (drawPlayer) {
				drawPlayer = false;
				player.beDrawn();
				t.beDrawn();
			} else {
				t.beDrawn();
			}
		});
		if (drawPlayer) {
			player.beDrawn();
		}
	} else {
		//case where player is below all
		if (!stripStorage[0].playerIsOnTop()) {
			player.beDrawn();
			stripStorage.forEach(t => {
				t.beDrawn();
			});
		} else {
			//case where player is above all
			stripStorage.forEach(t => {
				t.beDrawn();
			});
			player.beDrawn();
		}
	} 
}

function drawQuad(color, p1, p2, p3, p4) {
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.moveTo(p1[0], p1[1]);
	ctx.lineTo(p2[0], p2[1]);
	ctx.lineTo(p3[0], p3[1]);
	ctx.lineTo(p4[0], p4[1]);
	ctx.lineTo(p1[0], p1[1]);
	ctx.fill();
}

function drawPlayerWithParent() {
	var tunnelStrip = 0;
	var tunnelSize = player.parent.strips.length;

	//get the closest strip
	for (var a=0; a<tunnelSize; a++) {
		if (player.parent.strips[a].cameraDist < player.parent.strips[tunnelStrip].cameraDist) {
			tunnelStrip = a;
		}
	}

	//organize strips based around that
	var trackL = tunnelStrip - 1;
	var trackR = tunnelStrip + 1;
	var stripStorage = [];
	
	//if the size is even, trackL has to be one less than trackR
	if (tunnelSize % 2 == 0) {
		stripStorage.push(player.parent.strips[(tunnelStrip + (tunnelSize / 2)) % tunnelSize]);
		trackL = tunnelStrip - ((tunnelSize / 2) - 1);
		trackR = tunnelStrip + (tunnelSize / 2) - 1;
	} else {
		trackL = tunnelStrip - Math.floor(tunnelSize / 2);
		trackR = tunnelStrip + Math.floor(tunnelSize / 2);
	}

	while (trackR > tunnelStrip && trackL < tunnelStrip) {
		stripStorage.push(player.parent.strips[trackR % tunnelSize]);
		stripStorage.push(player.parent.strips[(trackL + tunnelSize) % tunnelSize]);
		trackR -= 1;
		trackL += 1;
		
	}

	stripStorage.push(player.parent.strips[tunnelStrip]);

	//actual drawing here
	var drawPlayer = true;
	var stripsDrawn = 0;
	stripStorage.forEach(t => {
		if (drawPlayer) {
			if (!t.playerIsOnTop()) {
				drawPlayer = false;
				player.beDrawn();
			}
		}
		t.beDrawn();
		stripsDrawn += 1;
		//if at the correct point in the tunnel, draw the free objects
		if (stripsDrawn == Math.floor(player.parent.strips.length / 2)) {
			//if the camera is outside the tunnel do the hybrid approach. If not, do the normal way.
			if (!player.parent.coordinateIsInTunnel(world_camera.x, world_camera.y, world_camera.z)) {
				player.parent.freeObjs.forEach(f => {
					f.beDrawn();
				});
				stripsDrawn += 100;
			}
		}
	});

	//if the free objects still aren't drawn, draw them
	if (stripsDrawn == player.parent.strips.length) {
		player.parent.freeObjs.forEach(f => {
			f.beDrawn();
		});
	}

	//if the player's still not drawn, draw the player
	if (drawPlayer) {
		player.beDrawn();
	}

	if (editor_active) {
		//numbering strips
		ctx.font = `${canvas.height / 48}px Century Gothic`;
		ctx.fillStyle = color_text_bright;
		var [tX, tY] = [0, 0];
		for (var v=0; v<player.parent.strips.length; v++) {
			if (!isClipped([player.parent.strips[v].x, player.parent.strips[v].y, player.parent.strips[v].z])) {
				[tX, tY] = spaceToScreen([player.parent.strips[v].x, player.parent.strips[v].y, player.parent.strips[v].z]);
				ctx.fillText(v, tX + 5, tY);
			}
			
		}
		//dot for closest spot
		if (!isClipped([player.parent.strips[tunnelStrip].x, player.parent.strips[tunnelStrip].y, player.parent.strips[tunnelStrip].z])) {
			[tX, tY] = spaceToScreen([player.parent.strips[tunnelStrip].x, player.parent.strips[tunnelStrip].y, player.parent.strips[tunnelStrip].z]);
			drawCircle("#FFF", tX, tY, 10);
		}
	}
}

function drawRoundedRectangle(x, y, width, height, arcRadius) {
	y += ctx.lineWidth * 0.5;
	x += ctx.lineWidth * 0.5;
	height -= ctx.lineWidth;
	width -= ctx.lineWidth;
	ctx.beginPath();
	ctx.moveTo(x + arcRadius, y);
	ctx.lineTo(x + width - arcRadius, y);
	ctx.quadraticCurveTo(x + width, y, x + width, y + arcRadius);
	ctx.lineTo(x + width, y + height - arcRadius);
	ctx.quadraticCurveTo(x + width, y + height, x + width - arcRadius, y + height);
	ctx.lineTo(x + arcRadius, y + height);
	ctx.quadraticCurveTo(x, y + height, x, y + height - arcRadius);
	ctx.lineTo(x, y + arcRadius);
	ctx.quadraticCurveTo(x, y, x + arcRadius, y);
	ctx.stroke();
	ctx.fill();
}

function drawSky(bgColor) {
	//background
	ctx.fillStyle = bgColor;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	//stars
	world_stars.forEach(c => {
		c.beDrawn();
	});
}

function drawWorldLine(worldPoint1, worldPoint2) {
	//turning world points into camera relative points
	var tempPoints = [spaceToRelative(worldPoint1, [world_camera.x, world_camera.y, world_camera.z], [world_camera.theta, world_camera.phi, world_camera.rot]),
								spaceToRelative(worldPoint2, [world_camera.x, world_camera.y, world_camera.z], [world_camera.theta, world_camera.phi, world_camera.rot])];
	tempPoints = clipToZ0(tempPoints, render_clipDistance, false);

	//turn points into screen coordinates
	var screenPoints = [];
	for (var a=0;a<tempPoints.length;a++) {
		screenPoints.push(cameraToScreen(tempPoints[a]));
	}
	if (screenPoints[0] != undefined) {
		ctx.beginPath();
		ctx.moveTo(screenPoints[0][0], screenPoints[0][1]);
		ctx.lineTo(screenPoints[1][0], screenPoints[1][1]);
		ctx.stroke();
	}
}

function drawWorldPoly(points, color) {
	//first get camera coordinate points
	var tempPoints = [];
	for (var p=0; p<points.length; p++) {
		tempPoints.push(spaceToRelative(points[p], [world_camera.x, world_camera.y, world_camera.z], [world_camera.theta, world_camera.phi, world_camera.rot]));
	}

	tempPoints = clipToZ0(tempPoints, render_clipDistance, false);
	
	//turn points into screen coordinates
	var screenPoints = [];
	for (var a=0;a<tempPoints.length;a++) {
		screenPoints.push(cameraToScreen(tempPoints[a]));
	}

	if (screenPoints.length > 0) {
		drawPoly(color, screenPoints);
	}
}