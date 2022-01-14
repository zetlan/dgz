

function setCanvasPreferences() {
	var ratio = canvas.width / canvas.height;
	var size = Math.min(window.innerWidth, window.innerHeight * ratio);
	canvas.width = size * 0.9;
	canvas.height = size / ratio * 0.9;

	ctx.setTransform(1, 0, 0, -1, 0, 0);
	ctx.translate(0, -canvas.height);
	ctx.textBaseline = "middle";
	ctx.imageSmoothingEnabled = false;
	ctx.lineWidth = Math.ceil(canvas.height / 240);
}