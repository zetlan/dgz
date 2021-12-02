
function drawGameOverScreen() {
	var pxMargin = canvas.width * game_endMargin;
	var patchHeight = canvas.height - (pxMargin * 2);
	var patchWidth = canvas.width - (pxMargin * 2);

	var minX = pxMargin;
	var minY = pxMargin;

	
	
	
	//different background styles depending on system
	if (boards[0].constructor.name == "System_Old") {
		//old systems are drawn differently
		ctx.fillStyle = cpOLD[3];
		ctx.fillRect(minX, minY, patchWidth, patchHeight);
		ctx.fillStyle = cpOLD[1];
		ctx.fillRect(minX + 10, minY + 10, patchWidth - 20, patchHeight - 20);

		ctx.fillStyle = cpOLD[3];
		drawGameOverText(minX, minX + patchWidth, minY, minY + patchHeight, boards[0]);
	} else {
		for (var j=0; j<boards.length; j++) {
			ctx.fillStyle = boards[j].palette.endBg;
			drawRoundedRectangle(minX + (canvas.width * j * (patchWidth + game_endMargin)), minY, patchWidth, patchHeight, canvas.height / 20);
			ctx.fill();
			ctx.fillStyle = boards[j].palette.text;
			drawGameOverText(minX + (canvas.width * j * (patchWidth + game_endMargin)), minX + (canvas.width * j * (patchWidth + game_endMargin)) + patchWidth, minY, minY + patchHeight, boards[j]);
		}
	}
	//no audio during this bit
	audio_channel1.target = undefined;
}

function drawGameOverText(minX, maxX, minY, maxY, board) {
	var h = maxY - minY;
	var w = maxX - minX;

	ctx.font = `${canvas.height / 15}px ${board.font}`;
	ctx.textAlign = "center";
	ctx.fillText(`Game Over`, minX + (w / 2), minY + (h * 0.085));

	ctx.font = `${canvas.height / 20}px ${board.font}`;
	//score, lines cleared, time taken, and level

	ctx.textAlign = "left";
	ctx.fillText(`Score:`, 			minX + (w / 10), minY + (h * 0.2));
	ctx.fillText(`Lines Cleared:`, 	minX + (w / 10), minY + (h * 0.4));
	ctx.fillText(`Time Taken:`, 	minX + (w / 10), minY + (h * 0.6));
	ctx.fillText(`Level:`, 			minX + (w / 10), minY + (h * 0.8));

	ctx.textAlign = "right";
	ctx.fillText(board.score,								maxX - (w / 10), minY + (h * 0.2));
	ctx.fillText(board.linesCleared,						maxX - (w / 10), minY + (h * 0.4));
	ctx.fillText((board.time / framesPerSecond).toFixed(2) + " s", maxX - (w / 10), minY + (h * 0.6));
	ctx.fillText(board.level,								maxX - (w / 10), minY + (h * 0.8));
}


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
}

//enumerates a value along the reference array
function enumerate(valueRef, enumRef, changeBy) {
	var index = enumRef.indexOf(eval(valueRef));
	var newIndex = (index + enumRef.length + changeBy) % enumRef.length;
	eval(`${valueRef} = "${enumRef[newIndex]}"`);
}

function localStorage_read() {

}

function localStorage_write() {
	
}



//returns a non-mutable 4x4 array to represent a piece
function representPieceWithArr(pieceID, rotation) {
	var ref = piece_pos[pieceID][rotation][0];
	var placeArr = [];
	for (var char of ref) {
		placeArr.push(parseInt(char, 16).toString(2).padStart(4, "0"));
	}
	return placeArr;
}

function setCanvasPreferences() {
	canvas.width = window.innerHeight * 0.9 * (1 + (1 / 3));
	canvas.height = window.innerHeight * 0.9;

	ctx.textBaseline = "middle";
	ctx.lineWidth = Math.ceil(canvas.height / 240);
}

function setSafeString(fieldToSet, string) {
	if (typeof(string) == "string" && string != "") {
		eval(`${fieldToSet} = "${string}";`);
	}
}