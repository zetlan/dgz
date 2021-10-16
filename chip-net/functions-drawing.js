

function drawEditorOverlay() {
	ctx.fillStyle = color_textEditor;
	ctx.font = `${canvas.height / 20}px Ubuntu`;
	ctx.fillText(`Editor Active!!`, canvas.width * 0.5, canvas.height * 0.05);

	ctx.fillText(`[${editor_x}, ${editor_y}]`, canvas.width * 0.333, canvas.height * 0.97);
	ctx.fillText(`mode: ${editor_placing}`, canvas.width * 0.666, canvas.height * 0.97);
}

//sets default canvas states
function setCanvasPreferences() {
	ctx.lineWidth = 2;
	ctx.lineJoin = "round";
	ctx.lineCap = "square";
	ctx.textAlign = "center";
	ctx.textBaseline = "center";
}