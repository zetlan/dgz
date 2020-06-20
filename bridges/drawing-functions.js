
function dLine(startXYArr, endXYArr) {
	ctx.beginPath();
	ctx.moveTo(startXYArr[0], startXYArr[1]);
	ctx.lineTo(endXYArr[0], endXYArr[1]);
	ctx.stroke();
}

function dPoint(x, y, size) {
	ctx.beginPath();
	ctx.ellipse(x, y, size, size, 0, 0, Math.PI * 2);
}