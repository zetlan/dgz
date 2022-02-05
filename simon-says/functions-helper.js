
//drawing
function drawArrows() {
	ctx.lineWidth = 4;
	ctx.strokeStyle = color_arrows;
	ctx.beginPath();

	//left
	if (board_rowNum > board_limits[0]) {
		ctx.moveTo(canvas.width * 0.1, canvas.height * (board_height - 0.05));
		ctx.lineTo(canvas.width * 0.05, canvas.height * board_height);
		ctx.lineTo(canvas.width * 0.1, canvas.height * (board_height + 0.05));
	}

	//right
	if (board_rowNum < board_limits[1]) {
		ctx.moveTo(canvas.width * 0.9, canvas.height * (board_height - 0.05));
		ctx.lineTo(canvas.width * 0.95, canvas.height * board_height);
		ctx.lineTo(canvas.width * 0.9, canvas.height * (board_height + 0.05));
	}
	ctx.stroke();
}

function drawBoard() {
	//board
	var baseX = (canvas.width / 2) - (board_screenSize / 2) + (board_screenSize / (board_rowNum * 2));
	var baseY = (canvas.height * board_height) - (board_screenSize / 2) + (board_screenSize / (board_rowNum * 2));
	var spacing = board_screenSize / board_rowNum;
	for (var a=0;a<board_rowNum;a++) {
		for (var b=0;b<board_rowNum;b++) {
			drawPiece(color_board, baseX + (spacing * a), baseY + (spacing * b), (board_screenSize / (board_rowNum * 2)) * board_pieceRatio);
		}
	}

	//drawing lit up piece
	if (light_time > light_timeMax / 4) {
		drawPiece(light_color, baseX + (spacing * light_tile[0]), baseY + (spacing * light_tile[1]), (board_screenSize / (board_rowNum * 2)) * 0.8);
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
	drawRoundedRectangle(canvas.width * (0.5 - menu_height * menu_items.length * 0.5), canvas.width * 0.5, canvas.width * menu_height * menu_items.length, canvas.height * menu_height, canvas.height * menu_height * 0.05);
	ctx.fill();

	for (var i=0; o<menu_items.length; i++) {
		drawMenuItem(canvas.width * (0.5 + menu_height * (i - menu_items.length * 0.5)), canvas.height * 0.5, canvas.height * menu_iconHeight, menu_items[i]);
	}
}

function drawMenuItem(x, y, r, id) {
	var canX = canvas.width * x;
	var canY = canvas.height * y;
	switch(id) {
		case "speed":
			//base
			drawCircle(color_board, canX, canY, r);

			//arm
			var angle = (light_speed - 1) / 2;
			var xOff = (r * 1.3) * Math.sin(angle);
			var yOff = (r * 1.3) * Math.cos(angle);

			ctx.strokeStyle = color_clockArm;
			ctx.lineWidth = 4;
			ctx.beginPath();
			ctx.moveTo(canX, canY);
			ctx.lineTo(canX + xOff, canY - yOff);
			ctx.stroke();
			break;
		case "rounds":
			//number of rounds / game
			//outer circle
			ctx.strokeStyle = color_board;
			ctx.lineWidth = 1.5;
			ctx.beginPath();
			ctx.ellipse(canX, canY, r, r, 0, 0, Math.PI * 2);
			ctx.stroke();

			//select circle
			drawCircle(color_selectRobot, canX + (r * 0.707), canY - (r * 0.707), r * 0.2);
			//text
			ctx.fillStyle = color_board;
			ctx.fillText(rounds_display[rounds_index], canX, canvas.height * (y + 0.015));
			break;
		case "sound":
			//outer circle, of course
			ctx.strokeStyle = color_board;
			ctx.lineWidth = 1.5;
			ctx.beginPath();
			ctx.ellipse(canX, canY, r, r, 0, 0, Math.PI * 2);
			ctx.stroke();

			//head
			ctx.beginPath();
			ctx.fillStyle = color_board;
			ctx.moveTo(canX - (r * 0.6), canY);
			ctx.lineTo(canX - (r * 0.1), canY - (r * 0.6));
			ctx.lineTo(canX - (r * 0.1), canY + (r * 0.6));
			ctx.fill();

			//waves if on
			if (sound_on) {
				ctx.beginPath();
				ctx.strokeStyle = color_board;
				ctx.arc(canX - (r * 0.2), canY, r * 0.5, Math.PI / -3, Math.PI / 3);
				ctx.stroke();
				if (audio_happy.volume > 0.5) {
					ctx.beginPath();
					ctx.arc(canX - (r * 0.2), canY, r * 0.8, Math.PI / -4, Math.PI / 4);
					ctx.stroke();
				}
			}
			break;
		case "timer":
			//knobbles
			drawCircle(color_board, canX - (r * 0.5), canY - r, r * 0.2);
			drawCircle(color_board, canX + (r * 0.5), canY - r, r * 0.2);

			//outer circle uwu
			drawCircle(color_board, canX, canY, r);
			drawCircle(color_bg, canX, canY, (r - 1.5));

			//arm
			var angle = boolToSigned(timer_active) / 2;
			var xOff = (r * 0.7) * Math.sin(angle);
			var yOff = (r * 0.7) * Math.cos(angle);

			ctx.strokeStyle = timer_active ? color_timerArmActive : color_clockArm;
			
			ctx.lineWidth = 4;
			ctx.beginPath();
			ctx.moveTo(canX, canY);
			ctx.lineTo(canX + xOff, canY - yOff);
			ctx.stroke();
			break;
		case "settingGear":
			break;
	}
}

function drawCursor() {
	//cursor
	drawCircle(game_humanTurn ? color_cursor3 : color_cursor2, cursor_x, cursor_y, 4);
	drawCircle(color_cursor, cursor_x, cursor_y, 2);
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