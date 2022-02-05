window.onload = setup;
window.addEventListener("keydown", handleKeyPress, false);
document.addEventListener("mousemove", handleMouseMove, false);
document.addEventListener("mousedown", handleMouseDown, false);

var animation;

var audio_happy = document.getElementById("audioPositive");
var audio_neutral = document.getElementById("audioNeutral");
var audio_negative = document.getElementById("audioNegative");

var board_pieceRatio = 0.8;
var board_screenSize = 0.85;
var board_rowNum = 2;
var board_tileTol = 0.55;
var board_limits = [2, 6];
var board_height = 0.45;

var canvas;
var ctx;

var clock_pos = 0.93;

var color_arrows = "#88F";
var color_bg = "#CCF";
var color_clockBase = "#88F";
var color_clockArm = "#F70";
var color_cursor = "#FFF";
var color_cursor2 = "#F00";
var color_cursor3 = "#606";
var color_board = "#114";
var color_menuBg = "#CCF";
var color_select = "#66A";
var color_selectRobot = "#00F";
var color_selectWrong = "#800";
var color_text = "#004";
var color_timerArmActive = "#7F0";

var cursor_x;
var cursor_y;

var display_sizes = [240, 480, 720, 1080];

var game_active = false;
var game_forceLose = false;
var game_displayTurn = 0;
var game_humanTurn = false;
var game_move = 0;
var game_path = [];
var game_speeds = [40, 31, 23, 16];
var game_rounds = [5, 10, 1e1001];
var game_text = "No game active, press space to start a 2x2 game";

var light_color = color_selectRobot;
var light_speed = 0;
var light_time = 0;
var light_timeMax = game_speeds[light_speed];
var light_tile = [];

var menu_active = false;
var menu_darkenAmount = 0.2;
var menu_height = 0.15;
var menu_iconHeight = 0.1;
var menu_items = ["speed", "rounds", "sound", "timer", "dispSize"];
var menu_itemsAvailable = [true, false, true, false, true];
var menubar_xPos = 0.95;

var rounds_index = 1;
var rounds_pos = 0.83;
var rounds_max = game_rounds[rounds_index];
var rounds_display = ["5", "10", "∞"];

var sound_on = 1;
var sound_pos = 0.73;

var timer_active = false;
var timer_pos = 0.63;
var timer_count = 0;

function setup() {
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
	setCanvasPreferences();

	cursor_x = canvas.width / 2;
	cursor_y = canvas.height / 2;

	animation = window.requestAnimationFrame(update);
}

function update() {
	//background
	ctx.fillStyle = color_bg;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	//timing logic
	if (game_active && !menu_active) {
		runGame();
	}

	//board + text
	drawArrows();
	drawBoard();
	ctx.fillStyle = color_text;
	ctx.fillText(game_text, canvas.width * 0.5, canvas.height * 0.95);

	//menu
	drawMenuItem(canvas.width * 0.925, canvas.height * menu_iconHeight * 0.7, canvas.height * menu_iconHeight / 3, "settingGear");
	if (menu_active) {
		drawMenu();
	}

	drawCursor();

	//call self
	animation = window.requestAnimationFrame(update);
}

function runGame() {
	timer_count += 1;
	//if a light is on, reduce the time left on it
	if (light_time > 0) {
		light_time -= 1;
	} else {
		//if out of time...

		//robot case
		if (!game_humanTurn) {
			//switching which tile to display
			game_displayTurn += 1;

			//if out of turns
			if (game_displayTurn > game_path.length - 1) {
				startHumanTurn();
			} else {
				light_time = light_timeMax;
				audio_neutral.play();
			}

			light_tile = game_path[game_displayTurn];
		} else {
			//human case
			if (light_color == color_selectWrong) {
				stopGame();
			} else if (game_move > game_path.length - 1) {
				//if done with the game, end it
				if (game_path.length >= rounds_max) {
					stopGame();
				} else {
					startRobotTurn();
				}
			}
		}
	}
}

function startGame() {
	timer_count = 0;
	game_forceLose = false;
	game_text = `...Game in progress...`;
	game_active = true;
	game_path = [];
	startRobotTurn();
}

function stopGame() {
	if (game_move >= rounds_max && !game_forceLose) {
		//case for timer
		game_text = `You win!`;
		if (timer_active) {
			game_text += ` Your total time is ${(timer_count / 60).toFixed(2)} seconds.`;
		}
	} else {
		game_text = `Game over, your score was ${game_path.length}`;
	}
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

//input handling
function handleKeyPress(a) {
	switch (a.code) {
		case "Escape":
			//escape exits out of menu if it's up
			menu_active = false;
			break;
		case "Space":
			if (!game_active && !menu_active) {
				startGame();
			}
			a.preventDefault();
			break;
		case "KeyZ":
		case "KeyX":
			//z / x are equivelant to mouse presses
			handleMouseDown("argument");
			break;
	}
}

function handleMouseMove(a) {
	var canvasArea = canvas.getBoundingClientRect();
	cursor_x = a.clientX - canvasArea.left;
	cursor_y = a.clientY - canvasArea.top;

	//keeping cursor in bounds
	cursor_x = clamp(cursor_x, 0, canvas.width);
	cursor_y = clamp(cursor_y, 0, canvas.height);
}

function handleMouseDown(a) {
	//updateMenubar returns true if an item is changed, if not do other things

	var handled = updateMenubar(cursor_x, cursor_y);

	//registering input in game if it's the person's turn
	if (game_active && !handled && game_humanTurn && (game_move < game_path.length)) {
		//making sure click is in board bounds
		var trueSize = board_screenSize * canvas.height;
		var inBoundsX = Math.abs((canvas.width / 2) - cursor_x) < trueSize * 0.5;
		var inBoundsY = Math.abs((canvas.height * board_height) - cursor_y) < trueSize * 0.48;
		
		if (inBoundsX && inBoundsY) {
			light_time = light_timeMax;
			light_tile = [Math.round((cursor_x - ((canvas.width / 2) - (trueSize / 2) + (trueSize / (board_rowNum * 2)))) / (trueSize / board_rowNum)), 
						Math.round((cursor_y - ((canvas.width * (board_height - 0.1)) - (trueSize / 2) + (trueSize / (board_rowNum * 2)))) / (trueSize / board_rowNum))];

			//validating press is correct
			if (light_tile[0] == game_path[game_move][0] && light_tile[1] == game_path[game_move][1]) {
				light_color = color_select;
				
				if (game_move > game_path.length - 2) {
					audio_happy.play();
				} else {
					audio_neutral.play();
				}
			} else {
				light_color = color_selectWrong;
				game_forceLose = true;
				game_move = game_path.length - 1;
				audio_negative.play();
			}
			game_move += 1;
		}
	}
}

//detecting clicks on the menubar
function updateMenubar() {
	//clicking the settings gear
	if (!menu_active) {
		//clicking the settings gear
		if (getDistance([cursor_x, cursor_y], [canvas.width * 0.925, canvas.height * menu_iconHeight * 0.7]) < canvas.height * menu_iconHeight / 2) {
			menu_active = true;
			return true;
		}

		//clicking the left / right board arrows
		if (Math.abs(cursor_y - (canvas.height * 0.5)) < canvas.height * 0.1 && ((cursor_x < canvas.width * 0.1 && board_rowNum > board_limits[0]) || (cursor_x > canvas.width * 0.9 && board_rowNum < board_limits[1]))) {
			//increasing vs decreasing
	
			board_rowNum = clamp(board_rowNum + boolToSigned(cursor_x > canvas.width * 0.5), board_limits[0], board_limits[1]);
	
			stopGame();
			game_text = `No game active, press space to start a ${board_rowNum}x${board_rowNum} game`;
		}
		return false;
	}

	//if already in the menu, and clicking outside of it, go outside the menu
	var xDist = Math.abs(cursor_x - canvas.width / 2);
	var yDist = Math.abs(cursor_y - canvas.height / 2);
	if (xDist > canvas.width * menu_iconHeight * menu_items.length * 0.5 || yDist > canvas.height * menu_height * 0.5) {
		menu_active = false;
		return true;
	}

	//interact with the menu elements
	var targetX;
	var targetY;
	for (var i=0; i<menu_items.length; i++) {
		targetX = canvas.width * (0.5 + 0.95 * menu_iconHeight * (i + 0.5 - menu_items.length * 0.5));
		targetY = canvas.height * 0.5;

		if (getDistance([cursor_x, cursor_y], [targetX, targetY]) < canvas.height * menu_iconHeight * 0.5) {
			//the item is interactable
			interactMenuItem(menu_items[i]);
			return true;
		}
	}
	return true;
}