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
	[center, xPlus, yPlus, zPlus] = [spaceToScreen(center), spaceToScreen(xPlus), spaceToScreen(yPlus), spaceToScreen(zPlus)];

	//drawing lines
	ctx.strokeStyle = "#F00";
	drawPoly("#F00", [center, xPlus]);
	ctx.strokeStyle = "#0F0";
	drawPoly("#0F0", [center, yPlus]);
	ctx.strokeStyle = "#00F";
	drawPoly("#00F", [center, zPlus]);
}

function drawKeys() {
	ctx.fillStyle = color_keyUp;
	ctx.fillRect(0 + 10, canvas.height - 60, 20, 20);
	ctx.fillRect(0 + 40, canvas.height - 60, 20, 20);
	ctx.fillRect(0 + 70, canvas.height - 60, 20, 20);
	ctx.fillRect(0 + 40, canvas.height - 90, 20, 20);
	ctx.fillRect(0 + 10, canvas.height - 30, 80, 20);

	ctx.fillStyle = color_keyPress;
	if (controls_object.ax < 0) {
		ctx.fillRect(0 + 10, canvas.height - 60, 20, 20);
	}
	if (controls_object.ax > 0) {
		ctx.fillRect(0 + 70, canvas.height - 60, 20, 20);
	}

	if (controls_object.az > 0) {
		ctx.fillRect(0 + 40, canvas.height - 90, 20, 20);
	}
	if (controls_object.az < 0) {
		ctx.fillRect(0 + 40, canvas.height - 60, 20, 20);
	}

	if (controls_spacePressed) {
		ctx.fillRect(0 + 10, canvas.height - 30, 80, 20);
	}
}

function drawPoly(color, xyPointsArr) {
	ctx.fillStyle = color;
	if (!editor_active) {
		ctx.strokeStyle = color;
	}
	
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
	radius = clamp(radius, 0, 1000);
	ctx.beginPath();
	ctx.fillStyle = color;
	ctx.ellipse(x, y, radius, radius, 0, 0, Math.PI * 2);
	ctx.fill();
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