//drawing functions
function drawQuad(color, p1, p2, p3, p4) {
	//console.log(color, p1, p2, p3, p4);
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
	ctx.beginPath();
	ctx.fillStyle = color;
	ctx.ellipse(x, y, radius, radius, 0, 0, Math.PI * 2);
	ctx.fill();
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
	if (tempPoints.length < 3) {
		return;
	}
	
	//turn points into screen coordinates
	for (p=0; p<tempPoints.length; p++) {
		tempPoints[p] = cameraToScreen(tempPoints[p]);
	}
	drawPoly(color, tempPoints);
}