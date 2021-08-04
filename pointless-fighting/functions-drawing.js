/*
INDEX:
	drawCircle(color, x, y, r);
	drawLine(color, xyFrom, xyTo, width);
	drawMeter(color, x, y, width, height, percentage);
	drawRoundedRectangle(x, y, width, height, arcRadius);
	drawSelectionBox(x, y, width, height);

	drawEditorOverlay();
*/


//general functions
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

function drawSelectionBox(x, y, width, height) {
	ctx.lineWidth = 2;
	ctx.strokeStyle = color_editor_selection;
	drawRoundedRectangle(x, y, width, height, canvas.height / 100);
	ctx.stroke();
}

function setCanvasPreferences() {
	ctx.textBaseline = "middle";
	ctx.imageSmoothingEnabled = false;
}