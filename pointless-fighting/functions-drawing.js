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