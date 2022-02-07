window.onload = setup;
window.addEventListener("keydown", handleKeyPress, false);
document.addEventListener("mousemove", handleMouseMove, false);
document.addEventListener("mousedown", handleMouseDown, false);

var animation;

var audio_happy = document.getElementById("audioPositive");
var audio_neutral = document.getElementById("audioNeutral");
var audio_negative = document.getElementById("audioNegative");

var board_pieceRatio = 0.8;
var board_screenSize = 0.88;
var board_rowNum = 2;
var board_tileTol = 0.55;
var board_limits = [2, 6];
var board_height = 0.5;

var canvas;
var ctx;

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

var data_persistent = {
	prefs: {
		startOn: 2,
		speed: 0,
		roundsInd: 0,
		vol: 1,
		time: false,
		disp: 2,
		softCursor: true,
	},
	bests: [
		[null, null, null],
		[null, null, null],
		[null, null, null],
		[null, null, null],
		[null, null, null],
	]
}

var display_sizes = [240, 480, 720, 1080];

var game_active = false;
var game_forceLose = false;
var game_displayTurn = 0;
var game_humanTurn = false;
var game_move = 0;
var game_path = [];
var game_speeds = [40, 31, 23, 16];
var game_rounds = [5, 10, 1e1001];

var light_color = color_selectRobot;
var light_time = 0;
var light_timeMax = game_speeds[data_persistent.prefs.speed];
var light_tile = [];

var menu_active = false;
var menu_darkenAmount = 0.2;
var menu_height = 0.15;
var menu_iconHeight = 0.1;
var menu_items = ["speed", "rounds", "sound", "timer", "dispSize", "cursor"];
var menu_itemsAvailable = [true, false, true, false, true, true];
var menubar_xPos = 0.95;

var rounds_max = game_rounds[data_persistent.prefs.roundsInd];
var rounds_display = ["5", "10", "∞"];

var text_low = "";
var text_high = "";

var timer_count = 0;

function setup() {
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
	localStorage_read();
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
	var textOffset = (0.5 - board_screenSize * 0.5) * 0.75;
	ctx.fillStyle = color_text;
	ctx.fillText(text_high, canvas.width * 0.5, canvas.height * textOffset);
	ctx.fillText(text_low, canvas.width * 0.5, canvas.height * (1 - textOffset));

	//menu
	drawMenuItem(canvas.width * 0.925, canvas.height * menu_iconHeight * 1.25, canvas.height * menu_iconHeight / 3, "settingGear");
	if (menu_active) {
		drawMenu();
	}

	if (data_persistent.prefs.softCursor) {
		drawCursor();
	}

	//write to localStorage every once in a while
	if (animation % 201 == 0) {
		localStorage_write();
	}

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

//input handling
function handleKeyPress(a) {
	switch (a.code) {
		case "Escape":
			//escape exits out of menu if it's up
			menu_active = false;
			break;
		case "Space":
			if (menu_active) {
				menu_active = false;
			} else if (!game_active) {
				startGame();
			}
			a.preventDefault();
			break;
		case "KeyZ":
		case "KeyX":
			//z / x are equivelant to mouse presses
			handleMouseDown();
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
			light_tile = [Math.floor((cursor_x - ((canvas.width / 2) - (trueSize / 2))) / (trueSize / board_rowNum)), 
						Math.floor((cursor_y - ((canvas.height * board_height) - (trueSize / 2))) / (trueSize / board_rowNum))];

			//never have out-of-bounds presses
			light_tile[1] = Math.max(light_tile[1], 0);
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
		if (getDistance([cursor_x, cursor_y], [canvas.width * 0.925, canvas.height * menu_iconHeight * 1.25]) < canvas.height * menu_iconHeight / 2) {
			menu_active = true;
			return true;
		}

		//clicking the left / right board arrows
		if (Math.abs(cursor_y - (canvas.height * 0.5)) < canvas.height * 0.1 && ((cursor_x < canvas.width * 0.1 && board_rowNum > board_limits[0]) || (cursor_x > canvas.width * 0.9 && board_rowNum < board_limits[1]))) {
			//increasing vs decreasing
	
			board_rowNum = clamp(board_rowNum + boolToSigned(cursor_x > canvas.width * 0.5), board_limits[0], board_limits[1]);
			data_persistent.prefs.startOn = board_rowNum;

			if (game_active) {
				stopGame();
			}
			setTextForBoard(board_rowNum);
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