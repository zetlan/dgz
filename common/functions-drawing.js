/*
These are standard drawing functions, in addition to the regular javascript drawing functions. I tried to strike a balance between how much can these be changed (stroke or fill, color?) and how much these provide usefulness. 
(If a function just ends up being 1 line, it's not particularly helpful.) 
INDEX

drawCircle(x, y, r);
drawPoints(points);
drawPolygon(x, y, radius, sides, angleOffset);
drawRoundedRectangle(x, y, width, height, arcRadius);

*/


function drawCircle(x, y, r) {
	ctx.beginPath();
	ctx.ellipse(x, y, r, r, 0, 0, Math.PI * 2);
}

function drawPoints(xyPointsArr) {
	ctx.beginPath();
	xyPointsArr.forEach(p => {
		ctx.lineTo(p[0], p[1]);
	});
}

function drawPolygon(x, y, radius, sides, angleOffset) {
	ctx.beginPath();
}

function drawRoundedRectangle(x, y, width, height, arcRadius) {
	y += ctx.lineWidth / 2;
	x += ctx.lineWidth / 2;
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
}