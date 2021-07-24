/*
INDEX:
	drawCircle(color, x, y, r);
	drawLine(color, xyFrom, xyTo, width);
	drawMeter(color, x, y, width, height, percentage);

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



//specific, complex functions
function drawEditorOverlay() {
	//outline
	ctx.globalAlpha = 0.5;
	ctx.strokeStyle = color_editor_border;
	ctx.lineWidth = canvas.height / 50;
	ctx.beginPath();
	ctx.rect(canvas.width * editor_sidebarWidth, 0, canvas.width * (1 - editor_sidebarWidth), canvas.height);
	ctx.stroke();
	ctx.globalAlpha = 1;

	//actual sidebar
	ctx.fillStyle = color_editor_background;
	ctx.fillRect(0, 0, canvas.width * editor_sidebarWidth, canvas.height);

	//text
	ctx.font = `${canvas.height / 24}px Ubuntu`;
	ctx.fillStyle = color_text;
	//top name
	ctx.fillText(loading_map.name, canvas.width * (editor_sidebarWidth / 2), canvas.height * 0.045);
	//block ID
	ctx.textAlign = "left";
	ctx.fillText(`block: "${editor_block}"`, canvas.width * 0.01, canvas.height * 0.1);

	//connections
	ctx.fillText(`connections`, canvas.width * 0.01, canvas.height * 0.2);
	ctx.font = `${canvas.height / 36}px Ubuntu`;
	for (var e=0; e<loading_map.connections.length; e++) {
		ctx.fillText(`${e+1} - ${loading_map.connections[e][0].name}, ${JSON.stringify(loading_map.connections[e][1])}`, canvas.width * 0.015, canvas.height * (0.24 + (0.04 * e)));
	}
}