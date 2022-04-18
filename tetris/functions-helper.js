

//takes in score data in format [name, points, version]
function addHighScore(scoreData) {
	//first determine which score bin to place the score into
	var version = scoreData.pop();

	//add to the list
	data_persistent.scores[version].push(scoreData);

	//sort by points
	data_persistent.scores[version] = data_persistent.scores[version].sort((a, b) => b[1] - a[1]);

	//if there's too many scores, remove the worst one
	while (data_persistent.scores[version].length > scores_max) {
		data_persistent.scores[version].pop();
	}
}

function clearLines(arrData) {
	var len = arrData.length;
	var numCleared = 0;

	//if any line is filled all the way through, clear it
	for (var l=0; l<arrData.length; l++) {
		if (arrData[l].indexOf(null) == -1 && arrData[l].indexOf(undefined) == -1) {
			arrData.splice(l, 1);
			numCleared += 1;
			l -= 1;
		}
	}

	//fill any lines back up to the required length
	while (arrData.length < len) {
		arrData.splice(0, 0, new Array(board_width));
	}

	return numCleared;
}

//for making copies of objects that avoid reference issues
function copyObj(object) {
	return JSON.parse(JSON.stringify(object));
}

function createBag() {
	//final bag
	var returnBag = [];
	var pieceBag = ["I","J","L","O","S","T","Z"];

	//shuffle
	while (pieceBag.length > 0) {
		returnBag.push(pieceBag.splice(Math.floor(Math.random() * pieceBag.length), 1)[0]);
	}
	return returnBag;
}


function drawAIButtons() {
	//top text
	ctx.font = `${canvas.height / 20}px Ubuntu`;
	ctx.fillStyle = color_text;
	ctx.textAlign = "center";
	ctx.fillText(`AI Interface`, canvas.width / 2, canvas.height * 0.05);

	//buttons
	var minHeight = canvas.height * menu_settingMarginH;
	var heightPerSetting = canvas.height * ((1 - (menu_settingMarginH * 2)) / menu_buttons_ai.length);

	var minWidth = canvas.width * menu_settingMarginW;

	ctx.font = `${canvas.height / 20}px Ubuntu`;
	ctx.fillStyle = color_text;
	ctx.textAlign = "left";

	for (var e=0; e<menu_buttons_ai.length; e++) {
		ctx.fillText(menu_buttons_ai[e][0], minWidth, minHeight + (heightPerSetting * e));
	}

	//button box
	ctx.strokeStyle = color_text;
	drawRoundedRectangle(minWidth - (canvas.width * 0.02), minHeight + (heightPerSetting * menu_selected) - (canvas.height / 30) - (canvas.height * 0.01), canvas.width * 0.35, canvas.height * 0.08666, canvas.height / 40);
	ctx.stroke();
}

function drawAIListing() {
	ctx.font = `${canvas.height / 20}px Ubuntu`;
	ctx.fillStyle = color_text;
	ctx.textAlign = "center";

	ctx.fillText(`Data`, canvas.width * 0.6, canvas.height * 0.15);
	ctx.fillText(`Score`, canvas.width * 0.9, canvas.height * 0.15);

	if (ai_populationPaired.length < 20) {
		ctx.fillText(`No data!`, canvas.width * 0.75, canvas.height * 0.4);
		return;
	}
	var ref;
	for (var u=0; u<15; u++) {
		ref = ai_populationPaired[u][0];
		ctx.font = `${canvas.height / 40}px Ubuntu`;
		ctx.fillText(`{${ref.a.toFixed(2)}, ${ref.b.toFixed(2)}, ${ref.c.toFixed(2)}, ${ref.d.toFixed(2)}}`, canvas.width * 0.6, canvas.height * (0.2 + (0.04 * u)));

		ctx.font = `${canvas.height / 25}px Ubuntu`;
		ctx.fillText(Math.round(ai_populationPaired[u][1]), canvas.width * 0.9, canvas.height * (0.2 + (0.04 * u)));
	}

	if (ai_avgScore == undefined) {
		ai_avgScore = Math.round(ai_populationPaired.reduce((a, b) => a + b[1], 0) / ai_populationPaired.length);
	}

	u += 2;
	ctx.font = `${canvas.height / 25}px Ubuntu`;
	ctx.fillText(`Avg generation score: ${ai_avgScore}`, canvas.width * 0.75, canvas.height * (0.2 + (0.04 * u)));
}

function drawHighScores() {
	ctx.font = `${canvas.height / 20}px Ubuntu`;
	ctx.fillStyle = color_text;
	ctx.textAlign = "left";
	ctx.fillText(`Name`, canvas.width * 0.1, canvas.height * 0.1);

	ctx.textAlign = "center";
	ctx.fillText(`Score`, canvas.width * 0.8, canvas.height * 0.1);

	var scoreArr = data_persistent.scores["modern"];

	for (var u=0; u<scoreArr.length; u++) {
		ctx.textAlign = "left";
		ctx.fillText(scoreArr[u][0], canvas.width * 0.1, canvas.height * (0.2 + (0.05 * u)));

		ctx.textAlign = "center";
		ctx.fillText(scoreArr[u][1], canvas.width * 0.8, canvas.height * (0.2 + (0.05 * u)));
	}
}


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

function drawMainMenu() {
	ctx.font = `${canvas.height / 10}px Ubuntu`;
	ctx.textAlign = "center";
	ctx.fillStyle = color_text;

	ctx.fillText(`Tetris`, canvas.width / 2, canvas.height * 0.08);

	ctx.font = `${canvas.height / 20}px Ubuntu`;
	//buttons
	var spacePerButton = (menu_buttonHeightMax - menu_buttonHeightMin) / menu_buttons.length;
	for (var b=0; b<menu_buttons.length; b++) {
		ctx.fillText(menu_buttons[b][0], canvas.width / 2, canvas.height * (menu_buttonHeightMin + spacePerButton * b));
	}

	//instruction text
	ctx.font = `${canvas.height / 40}px Ubuntu`;
	ctx.fillText(`Use the arrow keys, Z, and X to interact.`, canvas.width / 2, canvas.height * 0.95);

	//selection box
	var textWidth = ctx.measureText(menu_buttons[menu_selected][0]).width * 2;
	var margin = canvas.height / 100;
	ctx.strokeStyle = color_text;
	drawRoundedRectangle((canvas.width / 2) - (textWidth / 2) - margin, canvas.height * (menu_buttonHeightMin + spacePerButton * (menu_selected - 0.45)), textWidth + margin * 2, canvas.height * spacePerButton * 0.9, canvas.height / 40);
	ctx.stroke();
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

function file_export() {
	//first check to see if there's actually data to export
	if (ai_populationPaired.length == 0) {
		alert(`No data to export!`);
		return;
	}

	//actually create the file
	var textDat = JSON.stringify(ai_populationPaired);



	//download said file
	var newFile = new Blob([textDat], {type: 'text/plain'});

	//make sure a file doesn't already exist (to avoid a memory leak)
	if (fileObj != undefined) {
		window.URL.revokeObjectURL(fileObj);
	}
	fileObj = window.URL.createObjectURL(newFile);
	var link = document.getElementById('downloadBox');
	link.href = fileObj;
	link.click();


}

function file_import() {
	//first get a reference to the file
	var newFile = document.getElementById('uploadBox').files[0];
	//read the file in, this is asynchronous
	var fileReader = new FileReader();
	fileReader.onload = function(fileLoadedEvent) {
		//function for when the text actually loads
		var textDat = fileLoadedEvent.target.result;
		ai_populationPaired = JSON.parse(textDat);
	};

	fileReader.readAsText(newFile, "UTF-8");
}

function localStorage_read() {
	//checks to make sure this is valid
	var toRead = window.localStorage["tetris_data"];
	//make sure it's an object
	try {
		toRead = JSON.parse(toRead);
	} catch (error) {
		console.log(`could not parse ${toRead}, using default.`);
	}
	

	//make sure it's somewhat safe, and then make it into the game flags
	if (typeof(toRead) == "object") {
		data_persistent = toRead;
	} else {
		console.log(`${toRead} isn't an object! Using default.`);
	}
}

function localStorage_write() {
	//this is not that complex
	window.localStorage["tetris_data"] = JSON.stringify(data_persistent);
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
	canvas.width = window.innerHeight * 0.9 * (4 / 3);
	canvas.height = window.innerHeight * 0.9;

	ctx.textBaseline = "middle";
	ctx.lineWidth = Math.ceil(canvas.height / 240);
}

function setSafeString(fieldToSet, string) {
	if (typeof(string) == "string" && string != "" && string != ai_name) {
		eval(`${fieldToSet} = "${string}";`);
	}
}

function startAIGame() {
	if (ai_populationPaired.length > 1) {
		game_state = 5; 
		boards = [new System_AI()];
	} else {
		alert(`There is no AI to run!`);
	}
}