function dPoint(x, y, size) {
	ctx.beginPath();
	ctx.ellipse(x, y, size, size, 0, 0, Math.PI * 2);
	ctx.fill();
}