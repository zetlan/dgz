/*all the functions that draw things to the screen. Some are generic, some are specific
INDEX:
	generics:
		drawArrow(x, y, color, rotationInRADIANS, bodyLength, headLength, bodyWidth, headWidth);
		drawCircle(color, x, y, radius);
		drawCrosshair(center, normal1, normal2, normal3);
		drawLine(p1, p2);
		drawLock(x, y, width, height);
		drawPieChart(x, y, radius, number1, color1, text1, number2, color2, text2, ... ,numberN, colorN, textN);
		drawPoly(color, xyPointsArr);
		drawRoundedRectangle(x, y, width, height, arcRadius);
		drawTriangle(x, y, radius, rot);
		drawWorldLine(worldPoint1, worldPoint2);
		drawWorldPoly(points, color);

	specifics:
		drawAngelPanel(time);
		drawCharacterText();
		drawInfiniteEndScreen();
		drawKeys();
		drawSelectionBox(x, y, width, height);
		drawSky(bgColor);
		drawTiles2d(ex, why, size, type);
*/
//TODO: reorganize these functions



//drawing functions
function drawArrow(x, y, color, rotationInRADIANS, bodyLength, headLength, bodyWidth, headWidth) {
	bodyWidth /= 2;
	headWidth /= 2;
	//it's easier to just define the points and then do a transformation on all of them
	var points = [	[0, -bodyWidth], [bodyLength, -bodyWidth], [bodyLength, -headWidth], [bodyLength + headLength, 0], 
					[bodyLength, headWidth], [bodyLength, bodyWidth], [0, bodyWidth], 
					[0, -bodyWidth], [bodyLength, -bodyWidth]];

	for (var i=0; i<points.length; i++) {
		points[i] = rotate(points[i][0], points[i][1], rotationInRADIANS);
	}

	for (var i=0; i<points.length; i++) {
		points[i] = [points[i][0] + x, points[i][1] + y];
	}

	drawPoly(color, points);
	ctx.stroke();
}

function drawCircle(color, x, y, radius) {
	ctx.beginPath();
	ctx.fillStyle = color;
	ctx.ellipse(x, y, radius, radius, 0, 0, Math.PI * 2);
	ctx.fill();
}

function drawCrosshair(center, normal1, normal2, normal3) {
	ctx.strokeStyle = "#FFF";
	ctx.lineWidth = 2;
	//drawing lines
	ctx.strokeStyle = "#F00";
	var offset = polToCart(normal1[0], normal1[1], render_crosshairSize);
	drawWorldLine(center, [center[0] + offset[0], center[1] + offset[1], center[2] + offset[2]]);
	ctx.strokeStyle = "#0F0";
	offset = polToCart(normal2[0], normal2[1], render_crosshairSize);
	drawWorldLine(center, [center[0] + offset[0], center[1] + offset[1], center[2] + offset[2]]);
	ctx.strokeStyle = "#00F";
	offset = polToCart(normal3[0], normal3[1], render_crosshairSize);
	drawWorldLine(center, [center[0] + offset[0], center[1] + offset[1], center[2] + offset[2]]);
}

function drawLine(p1, p2) {
	ctx.beginPath();
	ctx.moveTo(p1[0], p1[1]);
	ctx.lineTo(p2[0], p2[1]);
	ctx.stroke();
}

function drawLock(x, y, width, height) {
	//lock circle
	ctx.beginPath();
	ctx.strokeStyle = color_grey_light;
	ctx.lineWidth = width / 8;
	ctx.ellipse(x, y, width / 3, width / 3, 0, 0, Math.PI * 2);
	ctx.stroke();

	ctx.strokeStyle = color_grey_dark;
	ctx.lineWidth = width / 16;
	ctx.beginPath();
	ctx.ellipse(x, y, (width / 3) + (width / 10), (width / 3) + (width / 10), 0, 0, Math.PI * 2);
	ctx.ellipse(x, y, (width / 3) - (width / 10), (width / 3) - (width / 10), 0, 0, Math.PI * 2);
	ctx.stroke();

	//main lock body
	ctx.beginPath();
	ctx.lineWidth = width / 8;
	ctx.fillStyle = color_grey_light;
	drawRoundedRectangle(x - (width * 0.5), y, width, height * 0.95, canvas.height / 100);
}

function drawPoly(color, xyPointsArr) {
	ctx.beginPath();
	ctx.fillStyle = color;
	for (p of xyPointsArr) {
		ctx.lineTo(p[0], p[1]);
	}
	ctx.fill();
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

//draws an equilateral triangle centered on an xy position
function drawTriangle(x, y, radius, rot) {
	ctx.beginPath();
	for (var b=0; b<4; b++) {
		ctx.lineTo(x + (radius * Math.cos(rot + (Math.PI * 2 * (b / 3)))), 
					y + (radius * Math.sin(rot + (Math.PI * 2 * (b / 3)))));
	}
	ctx.fill();
}

function drawWorldLine(worldPoint1, worldPoint2) {
	//turning world points into camera relative points
	var tempPoints = [spaceToRelative(worldPoint1, [world_camera.x, world_camera.y, world_camera.z], [world_camera.theta, world_camera.phi, world_camera.rot]),
								spaceToRelative(worldPoint2, [world_camera.x, world_camera.y, world_camera.z], [world_camera.theta, world_camera.phi, world_camera.rot])];
	
	//return if both points are clipped
	if (tempPoints[0][2] < 0 && tempPoints[1][2] < 0) {
		return;
	}

	//if one point is clipped, fix the other
	if (tempPoints[0][2] < 0) {
		moveAmount = getPercentage(tempPoints[1][2], tempPoints[0][2], 1);
		tempPoints[0] = [linterp(tempPoints[1][0], tempPoints[0][0], moveAmount), linterp(tempPoints[1][1], tempPoints[0][1], moveAmount), 1];
	} else if (tempPoints[1][2] < 0) {
		moveAmount = getPercentage(tempPoints[0][2], tempPoints[1][2], 1);
		tempPoints[1] = [linterp(tempPoints[0][0], tempPoints[1][0], moveAmount), linterp(tempPoints[0][1], tempPoints[1][1], moveAmount), 1];
	}

	//turn points into screen coordinates and draw
	tempPoints[0] = cameraToScreen(tempPoints[0]);
	tempPoints[1] = cameraToScreen(tempPoints[1]);
	ctx.beginPath();
	ctx.moveTo(tempPoints[0][0], tempPoints[0][1]);
	ctx.lineTo(tempPoints[1][0], tempPoints[1][1]);
	ctx.stroke();
}

function drawWorldPoly(points, color) {
	//first get camera coordinate points
	var tempPoints = [];

	tempPoints[points.length-1] = spaceToCamera(points[points.length - 1]);
	for (var p=0; p<points.length-1; p++) {
		tempPoints[p] = spaceToCamera(points[p]);
	}

	tempPoints = clipToZ0(tempPoints, render_clipDistance, false);

	//don't bother drawing if there's not enough points
	if (tempPoints.length < 3) {
		return;
	}
	
	//turn points into screen coordinates
	for (p=0; p<tempPoints.length; p++) {
		tempPoints[p] = cameraToScreen(tempPoints[p]);
	}
	drawPoly(color, tempPoints);
}












//specifics
function drawAngelPanel(time) {
	//slide the whole panel based on time
	var yOffset = ((1.3 * (time * time)) - (2.26 * time) + 0.96) * canvas.height * checklist_height;
	var yDefault = (1 - checklist_height) * canvas.height;

	//main box
	ctx.fillStyle = color_cutsceneBox;
	ctx.fillRect(checklist_margin * canvas.width, yDefault + yOffset, checklist_width * canvas.width, checklist_height * canvas.height);

	//box triangle
	ctx.fillStyle = color_text;
	drawTriangle(canvas.width * (checklist_width + checklist_margin - 0.01), yDefault + yOffset + (canvas.height * 0.015), canvas.height * 0.01, (Math.PI / -2) - (Math.PI * time));

	if (time > 0) {
		//title card
		ctx.fillStyle = color_text;
		ctx.strokeStyle = color_text;
		ctx.lineWidth = 2;
		ctx.font = `${canvas.height / 30}px Permanent Marker`;
		ctx.textAlign = "center";
		ctx.fillText(data_angelChecklist[0], canvas.width * (checklist_margin + (checklist_width / 2)), yDefault + yOffset + (canvas.height * 0.07));

		//line
		ctx.moveTo(canvas.width * (checklist_margin + (checklist_width * 0.05)), yDefault + yOffset + (canvas.height * 0.075));
		ctx.lineTo(canvas.width * (checklist_margin + (checklist_width * 0.95)), yDefault + yOffset + (canvas.height * 0.08));
		ctx.stroke();

		ctx.font = `${canvas.height / 35}px Permanent Marker`;
		ctx.textAlign = "left";
		for (var g=1; g<data_angelChecklist.length; g++) {
			var textYOffset = canvas.height * ((g+2) * (checklist_height / (data_angelChecklist.length + 2)));
			var textXOffset = canvas.width * (checklist_margin + (checklist_width / 5));
			var boxSize = canvas.width * (checklist_width / 25);
			var currentTextWidth = ctx.measureText(data_angelChecklist[g][0]).width * 1.1;

			//text
			ctx.fillText(data_angelChecklist[g][0], textXOffset, yDefault + yOffset + textYOffset);

			//box
			ctx.beginPath();
			ctx.rect(textXOffset - (boxSize * 2), yDefault + yOffset + textYOffset - (boxSize * 0.9), boxSize, boxSize);
			ctx.stroke();

			//box check
			if (data_persistent.effectiveCutscenes.includes(data_angelChecklist[g][2])) {
				//superscript
				ctx.font = `${canvas.height / 50}px Permanent Marker`;
				ctx.fillText(data_angelChecklist[g][1], textXOffset + currentTextWidth, yDefault + yOffset + textYOffset - (canvas.height / 50));
				ctx.font = `${canvas.height / 35}px Permanent Marker`;

				if (data_angelChecklist[g][3]) {
					//box check
					ctx.fillText('/', textXOffset - (canvas.width * checklist_width / 15), yDefault + yOffset + textYOffset);
				} else {
					//drawing cross-out lines
					ctx.beginPath();
					ctx.moveTo(textXOffset, yDefault + yOffset + textYOffset - (canvas.height / 35) + (canvas.height * (1/40) * data_angelChecklist[g][5][0]));
					for (var a=1; a<=checklist_stayLines; a++) {
						ctx.lineTo(textXOffset + (currentTextWidth * 0.91 * (a % 2)), yDefault + yOffset + textYOffset - (canvas.height / 40) + (canvas.height * (1/40) * data_angelChecklist[g][5][a]));
					}
					ctx.stroke();
				}
			}
		}
		//keep searching button
		if (data_persistent.goingHomeProgress < challengeData_angelMissions.length) {
			checklist_searchButton.y = checklist_height + ((yDefault + yOffset) / canvas.height) - 0.05;
			checklist_searchButton.tick();
			checklist_searchButton.beDrawn();
		}
	}
}

function drawCharacterText() {
	var yOffset = Math.pow((text_time / (text_timeMax / 2)) - 1, 12);

	var yPos = (canvas.height * 0.92) + (yOffset * canvas.width * 0.08);
	ctx.fillStyle = color_grey_light;
	ctx.strokeStyle = color_grey_dark;
	drawRoundedRectangle(canvas.width * 0.11, yPos - (menu_characterSize * 0.15), canvas.width * 0.8, menu_characterSize * 1.3, canvas.height / 96);
	if (text_queue[0][0] != undefined) {
		textures_common[text_queue[0][0]].beDrawn(canvas.width * 0.14, yPos + (menu_characterSize / 2), 0, menu_characterSize);
	}
	
	ctx.fillStyle = color_text;
	ctx.font = `${menu_characterSize / 2.25}px Comfortaa`;
	ctx.textAlign = "center";

	//before drawing text, split it if necessary
	if (text_queue[0][1].constructor.name == "String") {
		var dataStorage = text_queue[0][1].split(" ");
		text_queue[0][1] = [];
		var tempStr = "";
		while (dataStorage.length > 0) {
			//loop through the lines and add to the queue
			while (dataStorage.length > 0 && ctx.measureText(tempStr + dataStorage[0] + " ").width < (canvas.width * 0.8) - menu_characterSize * 1.5) {
				tempStr += dataStorage.splice(0, 1) + " ";
			}
			
			text_queue[0][1].push(tempStr);
			tempStr = "";

		}
	}
	for (var a=0; a<text_queue[0][1].length; a++) {
		ctx.fillText(text_queue[0][1][a], (canvas.width * 0.5) + menu_characterSize, yPos + (menu_characterSize * 0.1) + (menu_characterSize * 1.25 * ((a + 1) / (text_queue[0][1].length + 1))));
	}
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

	data_characters.indexes.forEach(c => {
		if (!drawingCharacters.includes(c)) {
			drawingCharacters.push(c);
		}
	});


	//labels to the side as final labels
	ctx.fillStyle = color_text;
	ctx.font = `${canvas.height / 16}px Comfortaa`;
	ctx.textAlign = "left";

	ctx.fillText(`Total`, canvas.width * 0.35 + (canvas.width * 0.18), canvas.height * 0.7);

	//character availability boxes
	ctx.fillStyle = color_grey_light;
	ctx.strokeStyle = color_menuSelectionOutline;
	ctx.lineWidth = canvas.height / 96;
	
	ctx.font = `${canvas.height / 42}px Comfortaa`;

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
		var index = data_characters.map[drawingCharacters[a]];

		if (textures_common[index] != undefined) {
			textures_common[index].frame = 0;
			//if the character hasn't been used, display the selection box
			if (a >= loading_state.charactersUsed.length) {
				//only draw selection if they can actually be selected
				if (data_persistent.unlocked.includes(drawingCharacters[a])) {
					drawSelectionBox((canvas.width * 0.35) + offX, (canvas.height * 0.13) + offY + menu_characterSize, menu_characterSize * 2, menu_characterSize * 2);
				}
			} else {
				textures_common[index].frame = 1;
				//displaying data about their run
				ctx.textAlign = "center";
				var charInfo = loading_state.characterData[drawingCharacters[a]];
				ctx.fillText(`${charInfo.distance.toFixed(0)} m`, (canvas.width * 0.35) + offX, (canvas.height * 0.13) + offY + textOffset2);
				ctx.fillText(`${getTimeFromFrames(charInfo.time)}`, (canvas.width * 0.35) + offX, (canvas.height * 0.13) + offY + textOffset2 + textOffset);
				ctx.fillText(`${((charInfo.distance / charInfo.time) * 60).toFixed(2)} m/s`, (canvas.width * 0.35) + offX, (canvas.height * 0.13) + offY + textOffset2 + (2 * textOffset));
				ctx.fillText(`${charInfo.powercells}`, (canvas.width * 0.35) + offX, (canvas.height * 0.13) + offY + textOffset2 + (3 * textOffset));
				ctx.fillText(`${((charInfo.powercells / charInfo.time) * 3600).toFixed(2)}`, (canvas.width * 0.35) + offX, (canvas.height * 0.13) + offY + textOffset2 + (4 * textOffset));
			}
			
			//draw character
			textures_common[index].beDrawn((canvas.width * 0.35) + offX, (canvas.height * 0.13) + offY + menu_characterSize, 0, menu_characterSize * 1.4);

			//if locked, draw a lock
			if (!data_persistent.unlocked.includes(drawingCharacters[a])) {
				drawLock((canvas.width * 0.35) + offX, (canvas.height * 0.13) + offY + menu_characterSize, menu_characterSize, menu_characterSize);
			}
		}
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
	var unit = canvas.height / 72;
	ctx.fillRect(unit * 1, canvas.height - (unit * 3), unit, unit * 2);
	ctx.fillRect(unit * 6, canvas.height - (unit * 3), unit, unit * 2);
	ctx.fillRect(unit * 3, canvas.height - (unit * 3), unit * 2, unit * 2);

	ctx.fillStyle = color_keyPress;
	if (player.ax < 0) {
		ctx.fillRect(unit * 1, canvas.height - (unit * 3), unit, unit * 2);
	}
	if (player.ax > 0) {
		ctx.fillRect(unit * 6, canvas.height - (unit * 3), unit, unit * 2);
	}

	if (controls_spacePressed) {
		ctx.fillRect(unit * 3, canvas.height - (unit * 3), unit * 2, unit * 2);
	}
}

function drawSelectionBox(x, y, width, height) {
	var al = ctx.globalAlpha;
	ctx.lineWidth = height / 15;
	ctx.globalAlpha = al / 3;
	ctx.fillStyle = color_grey_light;
	ctx.strokeStyle = color_menuSelectionOutline;
	drawRoundedRectangle(x - (width / 2), y - (height / 2), width, height, height / 6);
	ctx.globalAlpha = al;
}

function drawSky(bgColor) {
	//background
	ctx.fillStyle = bgColor;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	//tick wormhole
	world_wormhole.tick();
	if (editor_active && data_persistent.settings.enableOutlines) {
		world_wormhole.beDrawn();
	}
	ctx.lineCap = "round";

	//stars
	ctx.globalAlpha = render_starOpacity;
	star_arr.forEach(c => {
		c.beDrawn();
	});

	ctx.lineCap = "butt";
	ctx.globalAlpha = 1;
}

//draws all tiles but in 2 dimensions, used for the editor
function drawTile2d(ex, why, size, type) {
	if (type >= 30 && type < 100) {
		drawSelectionBox(ex + (size / 2), why + (size / 2), size, size);
	}
	ctx.beginPath();
	ctx.rect(ex, why, size, size);
	switch (type) {
		case 0:
			//ring, this usually doesn't appear normally
			ctx.strokeStyle = color_ring;
			ctx.beginPath();
			ctx.ellipse(ex + (size * 0.5), why + (size * 0.5), size * 0.2, size * 0.2, 0, 0, Math.PI * 180);
			ctx.stroke();
			break;
		case 1:
			//regular
			ctx.fillStyle = `hsl(${loading_state.tunnel.color.h}, ${loading_state.tunnel.color.s}%, 60%)`;
			ctx.fillRect(ex, why, size, size);
			break;
		case 2:
			//light
			ctx.fillStyle = `hsl(${loading_state.tunnel.color.h}, ${loading_state.tunnel.color.s}%, 80%)`;
			ctx.fillRect(ex, why, size, size);
			break;
		case 3:
			//crumbling
			ctx.fillStyle = color_crumbling;
			ctx.strokeStyle = color_crumbling_secondary;
			ctx.fillRect(ex, why, size, size);
			
			ctx.beginPath();
			ctx.moveTo(ex + (size * 0.2), why + (size * 0.2));
			ctx.lineTo(ex + (size * 0.8), why + (size * 0.8));

			ctx.moveTo(ex + (size * 0.8), why + (size * 0.2));
			ctx.lineTo(ex + (size * 0.2), why + (size * 0.8));
			ctx.stroke();
			break;
		case 4:
			//ice
			ctx.fillStyle = color_ice;
			ctx.fillRect(ex, why, size, size);
			break;
		case 5:
			//slow
			ctx.fillStyle = color_conveyor;
			ctx.fillRect(ex, why, size, size);
			ctx.fillStyle = color_conveyor_secondary;
			ctx.beginPath();
			ctx.moveTo(ex + (size * 0.5), why + (size * 0.8));
			ctx.lineTo(ex + (size * 0.1), why + (size * 0.2));
			ctx.lineTo(ex + (size * 0.9), why + (size * 0.2));
			ctx.fill();
			break;
		case 6:
			//fast
			ctx.fillStyle = color_conveyor;
			ctx.fillRect(ex, why, size, size);
			ctx.fillStyle = color_conveyor_secondary;
			ctx.beginPath();
			ctx.moveTo(ex + (size * 0.5), why + (size * 0.2));
			ctx.lineTo(ex + (size * 0.1), why + (size * 0.8));
			ctx.lineTo(ex + (size * 0.9), why + (size * 0.8));
			ctx.fill();
			break;
		case 7:
			//left
			ctx.fillStyle = color_conveyor;
			ctx.fillRect(ex, why, size, size);
			ctx.fillStyle = color_conveyor_secondary;
			ctx.beginPath();
			ctx.moveTo(ex + (size * 0.8), why + (size * 0.5));
			ctx.lineTo(ex + (size * 0.2), why + (size * 0.1));
			ctx.lineTo(ex + (size * 0.2), why + (size * 0.9));
			ctx.fill();
			break;
		case 8:
			//right
			ctx.fillStyle = color_conveyor;
			ctx.fillRect(ex, why, size, size);
			ctx.fillStyle = color_conveyor_secondary;
			ctx.beginPath();
			ctx.moveTo(ex + (size * 0.2), why + (size * 0.5));
			ctx.lineTo(ex + (size * 0.8), why + (size * 0.1));
			ctx.lineTo(ex + (size * 0.8), why + (size * 0.9));
			ctx.fill();
			break;
		case 9:
			//box-normal
			ctx.fillStyle = color_box;
			ctx.fillRect(ex, why, size, size);
			ctx.beginPath();
			ctx.strokeStyle = color_box_secondary;
			ctx.rect(ex + (size * 0.2), why + (size * 0.2), size * 0.6, size * 0.6);
			ctx.stroke();
			break;
		case 10:
			//box-45
			ctx.fillStyle = color_box;
			ctx.fillRect(ex, why, size, size);
			ctx.strokeStyle = color_box_secondary;
			ctx.beginPath();
			ctx.moveTo(ex + (size * 0.1), why + (size * 0.5));
			ctx.lineTo(ex + (size * 0.9), why + (size * 0.5));
			ctx.stroke();
			break;
		case 11:
			//tile ramp
			ctx.fillStyle = `hsl(${loading_state.tunnel.color.h}, ${loading_state.tunnel.color.s}%, 60%)`;
			ctx.fillRect(ex, why, size * 0.6, size);
			break;
		case 12:
			//ice ramp
			ctx.fillStyle = color_ice;
			ctx.fillRect(ex, why, size * 0.6, size);
			break;
		case 13:
			//warning
			ctx.fillStyle = color_warning;
			ctx.fillRect(ex, why, size, size);
			ctx.strokeStyle = color_warning_secondary;
			ctx.beginPath();
			ctx.moveTo(ex + (size * 0.1), why + (size * 0.1));
			ctx.lineTo(ex + (size * 0.9), why + (size * 0.1));
			ctx.stroke();
			break;

		//ringed tiles
		case 101:
			//tile with ring
			drawTile2d(ex, why, size, 1);
			drawTile2d(ex, why, size, 0);
			break;
		case 102:
			drawTile2d(ex, why, size, 2);
			drawTile2d(ex, why, size, 0);
			break;
		case 109:
			//box with ring
			drawTile2d(ex, why, size * 0.95, 9);
			ctx.strokeStyle = color_ring;
			drawLine([ex, why + (size * 0.2)], [ex, why + (size * 0.8)]);
			drawLine([ex + size, why + (size * 0.2)], [ex + size, why + (size * 0.8)]);
			break;

		//2d cutscene icons
		case 20:
			//box
			ctx.fillStyle = color_cutsceneBox;
			ctx.fillRect(ex - (size / 2), why - (size / 2), size, size);
			break;
		case 21:
			//bubble
			ctx.fillStyle = color_cutsceneBox;
			drawCircle(color_cutsceneBox, ex, why, size / 2);
			break;
		case 22:
			//line
			ctx.strokeStyle = color_cutsceneBox;
			ctx.beginPath();
			ctx.moveTo(ex - (size / 2), why - (size / 2));
			ctx.lineTo(ex + (size / 2), why + (size / 2));
			ctx.stroke();
			break;
		case 23:
			//tri
			ctx.strokeStyle = color_cutsceneBox;
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.moveTo(ex - (size / 2), why - (size / 2));
			ctx.lineTo(ex + (size / 2), why + (size / 2));
			ctx.lineTo(ex - (size / 1.5), why - (size / 2.5));
			ctx.stroke();
			break;
		case 24:
			//text
			ctx.fillStyle = color_text_bright;
			ctx.font = `${size}px Comfortaa`;
			ctx.fillText("T", ex, why + (size * 0.66));
			break;
		case 25:
			//code console
			ctx.fillStyle = color_cutsceneBox;
			ctx.fillRect(ex - (size * 0.5), why - (size * 0.5), size, size);
			ctx.fillStyle = color_text;
			ctx.font = `${size}px Comfortaa`;
			ctx.fillText(">", ex + (size * 0.2), why + (size * 0.4));
			break;
		
		//3d cutscene icons
		case 26:
			//light
			ctx.fillStyle = color_map_bg;
			ctx.globalAlpha = 0.5;
			drawCircle(color_map_bg, ex, why, size / 2);
			ctx.globalAlpha = 1;
			drawCircle(color_map_bg, ex, why, size / 3);
			break;
		case 27:
			//powercell
			ctx.beginPath();
			ctx.fillStyle = colors_powerCells[0];
			ctx.moveTo(ex + (size * 0.1), why + (size * 0.1));
			ctx.lineTo(ex + (size * 0.9), why + (size * 0.4));
			ctx.lineTo(ex + (size * 0.3), why + (size * 0.9))
			ctx.lineTo(ex + (size * 0.1), why + (size * 0.1));
			ctx.fill();
			break;
		case 28:
			//box with rings
			drawTile2d(ex, why, size, 109);
			break;
		case 29:
			//boat
			ctx.beginPath();
			ctx.fillStyle = "#8FF0F7";
			ctx.moveTo(ex, why + (size / 3));
			ctx.lineTo(ex + (size * 0.666), why + (size / 3));
			ctx.lineTo(ex + size, why + (size / 2));
			ctx.lineTo(ex + (size * 0.666), why + (size * 0.666));
			ctx.lineTo(ex, why + (size * 0.666));
			ctx.fill();
			break;
		case 30:
			//movable tile
			drawTile2d(ex, why, size, 101);
			break;
		




			
		//menu icons
		case 40:
			//leaderboards
			ctx.fillStyle = color_grey_lightest;
			ctx.fillRect(ex + (size * 0.125), why + (size * 0.625), size * 0.1875, size * 0.25);
			ctx.fillRect(ex + (size * 0.375) + (size * 0.03125), why + (size * 0.125), size * 0.1875, size * 0.75);
			ctx.fillRect(ex + (size * 0.625) + (size * 0.0625), why + (size * 0.375), size * 0.1875, size * 0.5);
			break;
		case 41:
			//settings
			var x = ex + (size * 0.5);
			var y = why + (size * 0.5);
			var r = size * 0.25;
			ctx.fillStyle = color_grey_light;
			ctx.strokeStyle = color_grey_dark;

			ctx.moveTo(x + size * 0.5, y);
			ctx.beginPath();
			ctx.arc(x, y, size * 0.15, 0, Math.PI * 2, true);
			for (var a=0; a<34; a++) {
				ctx.lineTo(x + (r * (1 + (0.25 * (a % 4 < 2))) * Math.cos((Math.PI / 16) * a)), 
							y + (r * (1 + (0.25 * (a % 4 < 2))) * Math.sin((Math.PI / 16) * a)));
			}
			ctx.stroke();
			ctx.fill();
			break;
		case 42:
			//cutscene viewer
			ctx.beginPath();
			ctx.fillStyle = color_cutsceneBox;
			ctx.ellipse(ex + (size / 2), why + (size * 0.4), (size / 2) - (size / 7), size * 0.25, 0, 0, Math.PI * 2);
			ctx.fill();
			drawTile2d(ex + (size * 0.7), why + (size * 0.6), size * 0.35, 22);
			break;
		case 43:
			//credits
			ctx.strokeStyle = color_text_bright;
			drawLine([ex + (size * 0.15), why + (size * 0.3)], [ex + (size * 0.85), why + (size * 0.3)]);
			drawLine([ex + (size * 0.15), why + (size * 0.5)], [ex + (size * 0.85), why + (size * 0.5)]);
			drawLine([ex + (size * 0.15), why + (size * 0.7)], [ex + (size * 0.85), why + (size * 0.7)]);
			break;
	}
}

function drawTunnelSectionPerfect(tunnel, simpleTileDat, complexTileDat, freeObjs) {
	//B3Node()
}


function setCanvasPreferences() {
	ctx.textBaseline = "middle";
}