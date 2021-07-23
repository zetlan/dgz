/*
INDEX:
	drawCircle(color, x, y, r);
*/



function drawCircle(color, x, y, r) {
	ctx.beginPath();
	ctx.fillStyle = color;
	ctx.ellipse(x, y, r, r, 0, 0, Math.PI * 2);
	ctx.fill();
}

function drawLine(color, xyFrom, xyTo, width) {
	ctx.beginPath();
	ctx.strokeStyle = color;
	ctx.lineWidth = width;
	ctx.moveTo(xyFrom[0], xyFrom[1]);
	ctx.lineTo(xyTo[0], xyTo[1]);
	ctx.stroke();
}

function drawMeter(color, x, y, width, height, percentage) {
	var wBuffer = 3 * boolToSigned(width > 0);
	var hBuffer = 3 * boolToSigned(height > 0);
	ctx.strokeStyle = color;
	ctx.fillStyle = color;
	ctx.lineWidth = "2";
	ctx.beginPath();
	ctx.rect(x, y, width, height);
	ctx.stroke();
	ctx.fillRect(x + wBuffer, y + hBuffer, (width - (wBuffer * 2)), (height - (hBuffer * 2)) * percentage);
}