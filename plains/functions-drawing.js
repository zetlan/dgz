//drawing functions
function drawEditorOverlay() {
	//bar at the top
	ctx.fillStyle = color_editor_bg;
	ctx.fillRect(0, 0, canvas.width, canvas.height * editor_topBarHeight);

	//icons
	var y = (canvas.height * editor_topBarHeight * 0.5);
	var x;
	for (var i=0; i<=editor_iconNum; i++) {
		x = (canvas.width / editor_iconNum) * (i + 0.5) * editor_iconWidth;
		drawEditorIcon(x - (canvas.height * editor_iconSize / 2), y - (canvas.height * editor_iconSize / 2), canvas.height * editor_iconSize, i);
	}

	y += canvas.height / 100;

	//color
	if (editor_selected != undefined) {
		ctx.font = `${canvas.height/ 40}px Comfortaa`;
		ctx.fillStyle = color_text_light;
		ctx.fillText("#", canvas.width * 0.935, y);
		for (var c=0; c<3; c++) {
			ctx.fillText("▲", canvas.width * (0.945 + 0.015 * c), y - (canvas.height / 42));
			ctx.fillText(editor_selected.color[c+1], canvas.width * (0.95 + 0.015 * c), y);
			ctx.fillText("▼", canvas.width * (0.945 + 0.015 * c), y + (canvas.height / 50));
		}
	}

	//world relative icons
	ctx.globalAlpha = 0.2 + (0.8 * editor_worldRelative);
	drawEditorIcon(canvas.width * (editor_iconWidth), canvas.height * ((editor_topBarHeight * 0.25) - (editor_iconSize / 2)), canvas.height * editor_iconSize, 100);
	ctx.globalAlpha = 0.2 + (0.8 * !editor_worldRelative);
	drawEditorIcon(canvas.width * (editor_iconWidth), canvas.height * ((editor_topBarHeight * 0.75) - (editor_iconSize / 2)), canvas.height * editor_iconSize, 101);
	ctx.globalAlpha = 1;
}

function drawEditorIcon(ex, why, size, type) {
	ctx.fillStyle = color_editor_defaultPoly;

	switch (type) {
		case 0:
			//free poly
			ctx.beginPath();
			ctx.moveTo(ex, why);
			ctx.lineTo(ex + size, why);
			ctx.lineTo(ex + (size / 2), why + size);
			ctx.lineTo(ex, why);
			ctx.fill();
			break;
		case 1:
			//x wall
			ctx.fillRect(ex, why, size / 2, size);
			drawLine("#F00", ex + size / 2, why + size / 2, ex + size, why + size / 2);
			break;
		case 2:
			//y wall
			ctx.fillRect(ex, why, size / 2, size);
			drawLine("#0F0", ex + size / 2, why + size / 2, ex + size, why + size / 2);
			break;
		case 3:
			//z wall
			ctx.fillRect(ex, why, size / 2, size);
			drawLine("#00F", ex + size / 2, why + size / 2, ex + size, why + size / 2);
			break;
		case 4:
			break;
		case 5:
			break;


		case 100:
			//world relative icon
			drawCircle("#FFF", ex + (size / 2), why + (size / 2), size * 0.4);
			drawLine("#F00", ex + size / 2, why + size / 2, ex + size, why + size / 2);
			drawLine("#0F0", ex + size / 2, why + size / 2, ex + size / 2, why);
			drawLine("#00F", ex + size / 2, why + size / 2, ex + size * 0.66, why + size * 0.4);
			break;
		case 101:
			//face relative icon
			ctx.fillStyle = "#FFF";
			ctx.fillRect(ex + (size * 0.1), why + (size * 0.1), size * 0.8, size * 0.8);
			drawLine("#F00", ex + size / 2, why + size / 2, ex + size, why + size / 2);
			drawLine("#0F0", ex + size / 2, why + size / 2, ex + size / 2, why);
			drawLine("#00F", ex + size / 2, why + size / 2, ex + size * 0.66, why + size * 0.4);
			break;
	}
}




function drawQuad(color, p1, p2, p3, p4) {
	ctx.fillStyle = color;
	ctx.strokeStyle = color;
	ctx.beginPath();
	ctx.moveTo(p1[0], p1[1]);
	ctx.lineTo(p2[0], p2[1]);
	ctx.lineTo(p3[0], p3[1]);
	ctx.lineTo(p4[0], p4[1]);
	ctx.lineTo(p1[0], p1[1]);
	ctx.stroke();
	ctx.fill();
}

function drawPoly(color, xyPointsArr) {
	ctx.fillStyle = color;
	ctx.strokeStyle = color;
	
	var xypa = xyPointsArr;
	ctx.beginPath();
	ctx.moveTo(xypa[0][0], xypa[0][1]);
	for (var i=1;i<xypa.length;i++) {
		ctx.lineTo(xypa[i][0], xypa[i][1]);
	}
	//back to start
	ctx.lineTo(xypa[0][0], xypa[0][1]);
	ctx.stroke();
	ctx.fill();
}

function drawCircle(color, x, y, radius) {
	ctx.beginPath();
	ctx.fillStyle = color;
	ctx.ellipse(x, y, radius, radius, 0, 0, Math.PI * 2);
	ctx.fill();
}

function drawCrosshair(center, offset1, offset2, offset3) {
	ctx.strokeStyle = "#FFF";
	ctx.lineWidth = 2;
	//drawing lines
	ctx.strokeStyle = "#F00";
	drawWorldLine(center, [center[0] + offset1[0], center[1] + offset1[1], center[2] + offset1[2]]);
	ctx.strokeStyle = "#0F0";
	drawWorldLine(center, [center[0] + offset2[0], center[1] + offset2[1], center[2] + offset2[2]]);
	ctx.strokeStyle = "#00F";
	drawWorldLine(center, [center[0] + offset3[0], center[1] + offset3[1], center[2] + offset3[2]]);
}

function drawLine(color, x1, y1, x2, y2) {
	ctx.strokeStyle = color;
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();
}

function drawWorldLine(worldPoint1, worldPoint2) {
	//turning world points into camera relative points
	var tempPoints = [spaceToRelative(worldPoint1, [player.x, player.y, player.z], [player.theta, player.phi]), spaceToRelative(worldPoint2, [player.x, player.y, player.z], [player.theta, player.phi])];
	
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
	tempPoints[points.length-1] = spaceToRelative(points[points.length-1], [player.x, player.y, player.z], [player.theta, player.phi]);
	for (var p=0; p<points.length-1; p++) {
		tempPoints[p] = spaceToRelative(points[p], [player.x, player.y, player.z], [player.theta, player.phi]);
	}

	tempPoints = clipToZ0(tempPoints, render_clipDistance, false);

	//don't bother drawing if there's not enough points
	if (tempPoints.length < 2) {
		return;
	}
	testNumStorage += 1;
	
	//turn points into screen coordinates
	for (p=0; p<tempPoints.length; p++) {
		tempPoints[p] = cameraToScreen(tempPoints[p]);
	}
	drawPoly(color, tempPoints);
}