
//drawing
function drawArrows() {
	ctx.lineWidth = canvas.height / 120;
	ctx.strokeStyle = color_arrows;
	ctx.beginPath();

	//left
	if (data_persistent.prefs.startOn > board_limits[0]) {
		ctx.moveTo(canvas.width * 0.1, canvas.height * (board_height - 0.05));
		ctx.lineTo(canvas.width * 0.05, canvas.height * board_height);
		ctx.lineTo(canvas.width * 0.1, canvas.height * (board_height + 0.05));
	}

	//right
	if (data_persistent.prefs.startOn < board_limits[1]) {
		ctx.moveTo(canvas.width * 0.9, canvas.height * (board_height - 0.05));
		ctx.lineTo(canvas.width * 0.95, canvas.height * board_height);
		ctx.lineTo(canvas.width * 0.9, canvas.height * (board_height + 0.05));
	}
	ctx.stroke();
	ctx.lineWidth = 4;
}

function drawBoard() {
	//board
	var numRows = data_persistent.prefs.startOn;
	var trueSize = board_screenSize * canvas.height;
	var baseX = (canvas.width / 2) - (trueSize / 2) + (trueSize / (numRows * 2));
	var baseY = (canvas.height * board_height) - (trueSize / 2) + (trueSize / (numRows * 2));
	var spacing = trueSize / numRows;
	for (var a=0;a<numRows;a++) {
		for (var b=0;b<numRows;b++) {
			drawPiece(color_board, baseX + (spacing * a), baseY + (spacing * b), (trueSize / (numRows * 2)) * board_pieceRatio);
		}
	}

	//drawing lit up piece
	if (light_time > light_timeMax / 4) {
		var percentage = (light_time - (light_timeMax / 4)) / (light_timeMax * 0.75);
		ctx.globalAlpha = 1 - (1 - percentage) ** 15;
		drawPiece(light_color, baseX + (spacing * light_tile[0]), baseY + (spacing * light_tile[1]), (trueSize / (numRows * 2)) * 0.8);
		ctx.globalAlpha = 1;
	}
}

function drawCircle(color, x, y, radius) {
	ctx.beginPath();
	ctx.fillStyle = color;
	ctx.strokeStyle = color;
	ctx.ellipse(x, y, radius, radius, 0, 0, Math.PI * 2);
	ctx.stroke();
	ctx.fill();
}

function drawMenu() {
	//draw darkening bg
	ctx.globalAlpha = menu_darkenAmount;
	ctx.fillStyle = "#000";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.globalAlpha = 1;

	//draw menu's outline
	ctx.fillStyle = color_menuBg;
	drawRoundedRectangle(canvas.width * (0.5 - menu_iconHeight * menu_items.length * 0.5), canvas.height * (0.5 - menu_height * 0.5), canvas.width * menu_iconHeight * menu_items.length, canvas.height * menu_height, canvas.height * menu_height * 0.1);
	ctx.fill();

	for (var i=0; i<menu_items.length; i++) {
		drawMenuItem(canvas.width * (0.5 + 0.95 * menu_iconHeight * (i + 0.5 - menu_items.length * 0.5)), canvas.height * 0.5, canvas.height * menu_iconHeight * 0.5, menu_items[i]);
	}
}

function drawMenuItem(x, y, r, id) {
	var bad = game_active && !menu_itemsAvailable[menu_items.indexOf(id)];
	if (bad) {
		ctx.globalAlpha = 0.5;
	}
	ctx.lineWidth = Math.floor(canvas.height / 120);
	switch(id) {
		case "speed":
			//base
			drawCircle(color_board, x, y, r);

			//arm
			var angle = (data_persistent.prefs.speed - 1) / 2;
			var xOff = (r * 1.3) * Math.sin(angle);
			var yOff = (r * 1.3) * Math.cos(angle);

			ctx.strokeStyle = color_clockArm;
			ctx.beginPath();
			ctx.moveTo(x, y);
			ctx.lineTo(x + xOff, y - yOff);
			ctx.stroke();
			break;
		case "rounds":
			//number of rounds / game
			//outer circle
			ctx.strokeStyle = color_board;
			ctx.beginPath();
			ctx.ellipse(x, y, r, r, 0, 0, Math.PI * 2);
			ctx.stroke();

			//select circle
			drawCircle(color_selectRobot, x + (r * 0.707), y - (r * 0.707), r * 0.2);
			//text
			ctx.fillStyle = color_board;
			ctx.fillText(rounds_display[data_persistent.prefs.roundsInd], x, y);
			break;
		case "sound":
			//outer circle, of course
			ctx.strokeStyle = color_board;
			ctx.beginPath();
			ctx.ellipse(x, y, r, r, 0, 0, Math.PI * 2);
			ctx.stroke();

			//head
			ctx.beginPath();
			ctx.fillStyle = color_board;
			ctx.moveTo(x - (r * 0.6), y);
			ctx.lineTo(x - (r * 0.1), y - (r * 0.6));
			ctx.lineTo(x - (r * 0.1), y + (r * 0.6));
			ctx.fill();

			//waves if on
			if (data_persistent.prefs.vol > 0) {
				ctx.beginPath();
				ctx.strokeStyle = color_board;
				ctx.arc(x - (r * 0.2), y, r * 0.5, Math.PI / -3, Math.PI / 3);
				ctx.stroke();
				if (audio_happy.volume > 0.5) {
					ctx.beginPath();
					ctx.arc(x - (r * 0.2), y, r * 0.8, Math.PI / -4, Math.PI / 4);
					ctx.stroke();
				}
			}
			break;
		case "timer":
			//knobbles
			drawCircle(color_board, x - (r * 0.5), y - r, r * 0.2);
			drawCircle(color_board, x + (r * 0.5), y - r, r * 0.2);

			//outer circle uwu
			drawCircle(color_board, x, y, r);
			drawCircle(color_bg, x, y, (r - ctx.lineWidth));

			//arm
			var angle = boolToSigned(data_persistent.prefs.time) / 2;
			var xOff = (r * 0.8) * Math.sin(angle);
			var yOff = (r * 0.8) * Math.cos(angle);

			ctx.strokeStyle = data_persistent.prefs.time ? color_timerArmActive : color_clockArm;
			ctx.beginPath();
			ctx.moveTo(x, y);
			ctx.lineTo(x + xOff, y - yOff);
			ctx.stroke();
			break;
		case "dispSize":
			var mult = canvas.height / display_sizes[display_sizes.length-1];
			var rx = r;
			var ry = r * 0.75;

			ctx.beginPath();
			ctx.strokeStyle = color_board;
			ctx.rect(x - rx, y - ry, rx * 2, ry * 2);
			ctx.rect(x - (rx * mult), y - (ry * mult), rx * 2 * mult, ry * 2 * mult);
			ctx.stroke();
			break;
		case "settingGear":
			ctx.globalAlpha = 1;
			var numTeeth = 6;
			ctx.moveTo(x, y);
			ctx.strokeStyle = color_board;
			ctx.beginPath();
			for (var a=0; a<(numTeeth * 4) + 2; a++) {
				ctx.lineTo(x + (r * ((a % 4 < 2) ? 0.8 : 0.6) * Math.cos((Math.PI / (numTeeth * 2)) * a)), 
							y + (r * ((a % 4 < 2) ? 0.8 : 0.6) * Math.sin((Math.PI / (numTeeth * 2)) * a)));
			}
			ctx.stroke();
			break;
		case "cursor":
			if (data_persistent.prefs.softCursor) {
				ctx.beginPath();
				ctx.arc(x, y, r / 2, 0, Math.PI * 2);
				ctx.stroke();
			} else {
				ctx.beginPath();
				ctx.strokeStyle = color_board;
				var size = r / 2;
				ctx.moveTo(x - size, y);
				ctx.lineTo(x + size, y);
				ctx.moveTo(x, y - size);
				ctx.lineTo(x, y + size);
				ctx.stroke();
			}
			break;
	}
	if (bad) {
		ctx.globalAlpha = 1;
	}
}

function drawCursor() {
	//cursor
	drawCircle(game_humanTurn ? color_cursor3 : color_cursor2, cursor_x, cursor_y, canvas.height / 120);
	drawCircle(color_cursor, cursor_x, cursor_y, canvas.height / 240);
}

function drawPiece(color, x, y, radius) {
	//ew
	var tol = board_tileTol;
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.moveTo(x - radius		, y + (radius * tol));
	ctx.lineTo(x - radius		, y - (radius * tol));
	ctx.lineTo(x - (radius * tol), y - radius);
	ctx.lineTo(x + (radius * tol), y - radius);
	ctx.lineTo(x + radius		, y - (radius * tol));
	ctx.lineTo(x + radius		, y + (radius * tol));
	ctx.lineTo(x + (radius * tol), y + radius);
	ctx.lineTo(x - (radius * tol), y + radius);
	ctx.fill();
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

function getDistance(p1, p2) {
	//gets the distance between two points
	return Math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2);
}

//attempts to interact with a menu item
function interactMenuItem(id) {
	//if it's a game state, and the item isn't interactable during the game state, don't
	if (game_active && !menu_itemsAvailable[menu_items.indexOf(id)]) {
		return;
	}
	switch(id) {
		case "speed":
			data_persistent.prefs.speed = (data_persistent.prefs.speed + 1) % game_speeds.length;
			light_timeMax = game_speeds[data_persistent.prefs.speed];
			break;
		case "rounds":
			data_persistent.prefs.roundsInd = (data_persistent.prefs.roundsInd + 1) % game_rounds.length;
			rounds_max = game_rounds[data_persistent.prefs.roundsInd];
			setTextForBoard(board_rowNum);
			break;
		case "sound":
			//alternate between 0, 0.5, and 1
			data_persistent.prefs.vol = (data_persistent.prefs.vol + 0.5) % 1.5

			audio_happy.volume = data_persistent.prefs.vol;
			audio_neutral.volume = data_persistent.prefs.vol;
			audio_negative.volume = data_persistent.prefs.vol;
			break;
		case "timer":
			data_persistent.prefs.time = !data_persistent.prefs.time;
			break;
		case "dispSize":
			//update display size from the list
			data_persistent.prefs.disp = (data_persistent.prefs.disp + 1) % display_sizes.length;
			canvas.width = display_sizes[data_persistent.prefs.disp] * 4 / 3;
			canvas.height = display_sizes[data_persistent.prefs.disp];
			setCanvasPreferences();
			break;
		case "cursor":
			data_persistent.prefs.softCursor = !data_persistent.prefs.softCursor;
			document.getElementById("canvas").style.cursor = data_persistent.prefs.softCursor ? `none` : `crosshair`;
			
	}
	return true;
}

function localStorage_read() {
	//lots of safety measures
	var toRead;
	try {
		toRead = window.localStorage["simon_data"];
	} catch(error) {
		console.error(`ERROR: could not access local storage. Something has gone very seriously wrong.`);
	}

	try {
		toRead = JSON.parse(toRead);
	} catch (error) {
		console.error(`ERROR: could not parse ${toRead}, using default`);
		return;
	}

	//make sure it's somewhat safe before reading it in
	if (typeof(toRead) == "object") {
		data_persistent = toRead;
	} else {
		console.error("ERROR: invalid type specified in save data, using default");
		return;
	}

	//modify external states based on settings
	var ref = data_persistent.prefs;

	board_rowNum = ref.startOn;
	light_timeMax = game_speeds[data_persistent.prefs.speed];
	rounds_max = game_rounds[ref.roundsInd];
	audio_happy.volume = data_persistent.prefs.vol;
	audio_neutral.volume = data_persistent.prefs.vol;
	audio_negative.volume = data_persistent.prefs.vol;
	canvas.width = display_sizes[data_persistent.prefs.disp] * 4 / 3;
	canvas.height = display_sizes[data_persistent.prefs.disp];
	document.getElementById("canvas").style.cursor = data_persistent.prefs.softCursor ? `none` : `crosshair`;

	setCanvasPreferences();
	setTextForBoard(board_rowNum);
}

function localStorage_write() {
	//pretty simple
	window.localStorage["simon_data"] = JSON.stringify(data_persistent);
}


function setCanvasPreferences() {
	ctx.lineWidth = 4;
	ctx.lineJoin = "round";
	ctx.font = `${Math.floor(canvas.height / 20)}px Ubuntu`;
	ctx.textBaseline = "middle"
	ctx.textAlign = "center";
}

function setTextForBoard(n) {
	text_low = `No game active, press space to start a ${n}x${n} game.`;

	var value = data_persistent.bests[board_rowNum-2][data_persistent.prefs.roundsInd];

	//if it's not a number, don't display it
	if (value * 0 != 0 || value == null) {
		text_high = `No high score has been set for these settings yet.`;
		return;
	}

	switch(data_persistent.prefs.roundsInd) {
		case 0:
		case 1:
			text_high = `Your best time on these settings was ${value} seconds.`
			break;
		case 2:
			text_high = `Your longest round for this board was ${value} move${(value == 1) ? "" : "s"}.`;
			break;
	}
}

function startGame() {
	timer_count = 0;
	game_forceLose = false;
	text_low = `...Game in progress...`;
	game_active = true;
	game_path = [];
	startRobotTurn();
}

function stopGame() {
	var textOut = "";
	if (game_move >= rounds_max && !game_forceLose) {
		//case for timer
		textOut = `You win!`;
		if (data_persistent.prefs.time) {
			textOut += ` Your total time is ${(timer_count / 60).toFixed(2)} seconds.`;
			data_persistent.bests[board_rowNum-2][data_persistent.prefs.roundsInd] = Math.min(data_persistent.bests[board_rowNum-2][data_persistent.prefs.roundsInd] ?? 1e1001, +((timer_count / 60).toFixed(2)));
		}
	} else {
		textOut = `Game over, your score was ${game_path.length}`;
		//if it's the user's best score, apply it
		data_persistent.bests[board_rowNum-2][2] = Math.max(data_persistent.bests[board_rowNum-2][2] ?? 0, game_path.length);
	}
	//update text for new highscore / ending
	setTextForBoard(board_rowNum);
	text_low = textOut;
	game_path = [];
	game_active = false;
	light_time = 0;
}

function startHumanTurn() {
	game_displayTurn = 0;
	game_humanTurn = true;
}

function startRobotTurn() {
	game_move = 0;
	game_humanTurn = false;

	//make a random piece
	game_path.push([Math.floor(randomBounded(0, board_rowNum)), Math.floor(randomBounded(0, board_rowNum))]);
	light_color = color_selectRobot;
	light_tile = game_path[0];
	light_time = light_timeMax;

	audio_neutral.play();
}