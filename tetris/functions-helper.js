function drawRoundedRectangle(x, y, width, height, arcRadius) {
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
	ctx.fill();
}