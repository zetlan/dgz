window.onload = setup;
window.addEventListener("keydown", handleInput, false);

var animation;
var canvas;
var ctx;

var audio_channel1;
var audio_channel2;
var audio_fadeTime = 30;
var audio_tolerance = 1 / 45;


var board_clearTime = 15;
var board_screenPercentage = 0.9;
var board_width = 10;
var board_height = 20;
var board_verticalAdjust = 0.7;
var board_linesRequired = 10;
var boards = [];

var framesPerSecond = 60;
var frameTime = 1 / framesPerSecond;
var frameIncrement = 60;
var frameBuffer = [];





var color_bg_menu = "#A57548";
var color_text = "#BDFFF9";
var color_gameEndBg = "#B5FFE0";




var game_levels = [];
var game_endOpacity = 0;
var game_endOpacitySpeed = 0.025;
var game_endMargin = 0.1;

/*
0 - menu
1 - endless tetris
2 - sprint
3 - local competition??
*/
var game_state = 0;
var game_substate = -1;


var menu_selectSet = [];
var menu_selected = 0;
var menu_buttonHeightMin = 0.4;
var menu_buttonHeightMax = 0.9;
var menu_settingMarginH = 0.2;
var menu_settingMarginW = 0.1;

var sprint_lines = 40;

let state_functions_main = [
	menu_execute,
	endless_execute,
	sprint_execute,
	competition_execute,
]
let state_functions_keyPress = [
	menu_handleKeyPress,
	game_handleKeyPress,
	game_handleKeyPress,
	competition_handleKeyPress
]

function handleInput(a) {
	state_functions_keyPress[game_state](a);
}

function setup() {
	canvas = document.getElementById("cromer");
	ctx = canvas.getContext("2d");

	audio_channel1 = new AudioChannel(0.5);

	setCanvasPreferences();

	animation = window.requestAnimationFrame(main);
}

function main() {
	state_functions_main[game_state]();
	animation = window.requestAnimationFrame(main);
}


//game mode functions

function menu_execute() {
	//background
	audio_channel1.target = undefined;
	audio_channel1.tick();
	ctx.fillStyle = color_palettes[0].bg;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	if (game_substate > 0) {
		ctx.font = `${canvas.height / 40}px Ubuntu`;
		ctx.fillStyle = color_text;
		ctx.fillText(`Press X to return.`, canvas.width / 2, canvas.height * 0.95);
	}

	switch (game_substate) {
		case -1:
			menu_executePre();
			break;
		case 0:
			menu_executeNormal();
			break;
		case 1:
			menu_executeSettings();
			break;
		case 2:
			//highscores
			break;
		case 3:
			menu_executeControls();
			//controls
			break;
	}
}

function menu_executeControls() {

}

function menu_executePre() {
	//create frame time calculation
	if (frameBuffer.length == 0) {
		frameBuffer.push(performance.now());
	}
	if (animation > 20) {
		frameBuffer.push(performance.now());
		//calculate actual frame time
		var fps = Math.round((1000 * (animation-1)) / (frameBuffer[1] - frameBuffer[0]));
		var rounded = Math.round(fps / frameIncrement) * frameIncrement;
		framesPerSecond = rounded;
		frameTime = 1 / framesPerSecond;

		game_substate = 0;
		menu_selectSet = menu_buttons;
		menu_selected = 0;
	}
}

function menu_executeNormal() {
	//title text
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
	ctx.fillText(`Use the arrow keys and Z to interact.`, canvas.width / 2, canvas.height * 0.95);

	//selection box
	var textWidth = ctx.measureText(menu_buttons[menu_selected][0]).width * 2;
	var margin = canvas.height / 100;
	ctx.strokeStyle = color_text;
	drawRoundedRectangle((canvas.width / 2) - (textWidth / 2) - margin, canvas.height * (menu_buttonHeightMin + spacePerButton * (menu_selected - 0.45)), textWidth + margin * 2, canvas.height * spacePerButton * 0.9, canvas.height / 40);
	ctx.stroke();
}

function menu_executeSettings() {
	//text
	ctx.font = `${canvas.height / 40}px Ubuntu`;
	ctx.fillStyle = color_text;
	ctx.fillText(`Press Z to interact.`, canvas.width / 2, canvas.height * 0.92);
	//settings
	var minHeight = canvas.height * menu_settingMarginH;
	var heightPerSetting = canvas.height * ((1 - (menu_settingMarginH * 2)) / menu_settings.length);

	var minWidth = canvas.width * menu_settingMarginW;

	ctx.font = `${canvas.height / 20}px Ubuntu`;
	ctx.fillStyle = color_text;
	ctx.textAlign = "left";

	for (var e=0; e<menu_settings.length; e++) {
		ctx.fillText(menu_settings[e][0], minWidth, minHeight + (heightPerSetting * e));
	}

	ctx.textAlign = "center";
	//values
	var val;
	for (var e=0; e<menu_settings.length; e++) {
		val = "";
		if (menu_settings[e][1] != "") {
			try {
				val = eval(menu_settings[e][1]);
			} catch (er) {}
		}
		ctx.fillText(val, canvas.width * (menu_settingMarginW + 0.5), minHeight + (heightPerSetting * e));
	}
	//box
	ctx.strokeStyle = color_text;
	drawRoundedRectangle(minWidth - (canvas.width * 0.02), minHeight + (heightPerSetting * menu_selected) - (canvas.height / 30) - (canvas.height * 0.01), canvas.width * (1 - menu_settingMarginW * 2), canvas.height * 0.08666, canvas.height / 40);
	ctx.stroke();
}

function menu_handleKeyPress(a) {
	switch (a.key) {
		case controls_s.u:
			menu_selected = clamp(menu_selected - 1, 0, menu_selectSet.length-1);
			while (menu_selectSet[menu_selected][0] == "") {
				menu_selected = clamp(menu_selected - 1, 0, menu_selectSet.length-1);
			}
			break;
		case controls_s.d:
			menu_selected = clamp(menu_selected + 1, 0, menu_selectSet.length-1);
			while (menu_selectSet[menu_selected][0] == "") {
				menu_selected = clamp(menu_selected + 1, 0, menu_selectSet.length-1);
			}
			break;

		//Z for select
		case controls_s.rl:
			if (menu_selectSet[menu_selected][1] != "") {
				eval(menu_selectSet[menu_selected][1 + (game_substate > 0)]);
			}
			break;
		case controls_s.rr:
			if (game_substate > 0) {
				game_substate = 0;
				menu_selectSet = menu_buttons;
				menu_selected = 0;
			}
			break;
	}
}

function endless_execute() {
	//audio
	audio_channel1.tick();

	if (game_substate == 2) {
		//pause menu
		ctx.fillStyle = boards[0].palette.text;
		ctx.textAlign = "center";
		ctx.fillText(`Paused`, canvas.width / 2, canvas.height / 2);
		//ctx.fillText(`Press`, canvas.width / 2, canvas.height / 2);

		return;
	}
	//background
	ctx.fillStyle = boards[0].palette.bg;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	boards[0].tick();
	boards[0].beDrawn(canvas.width / 2, canvas.height / 2);

	//draw game over info if over
	if (game_substate == 1) {
		game_endOpacity = Math.min(1, game_endOpacity + game_endOpacitySpeed);
		ctx.globalAlpha = game_endOpacity ** 8;
		drawGameOverScreen();
		ctx.globalAlpha = 1;
	}
}

function game_handleKeyPress(a) {
	if (game_substate == 1) {
		if (game_endOpacity == 1) {
			game_endOpacity = 0;
			game_substate = 0;
			game_state = 0;
		}
		return;
	}

	switch (a.key) {
		//left, right, and soft drop
		case controls_s.l:
			boards[0].movePiece(-1, 0);
			break;
		case controls_s.r:
			boards[0].movePiece(1, 0);
			break;
		case controls_s.d:
			boards[0].score += +boards[0].movePiece(0, 1);
			break;

		//rotation
		case controls_s.rl:
		case controls_s.rl2:
			boards[0].twistPiece(1);
			break;
		case controls_s.rr:
			boards[0].twistPiece(-1);
			break;

		//storage
		case controls_s.st:
			boards[0].storePiece();
			break;

		//hard drop
		case controls_s.hd:
			boards[0].hardDrop();
			break;

		//escape / enter
		case controls_s.esc:
			if (game_substate == 0) {
				game_substate = 2;
			} else {
				game_state = 0;
				game_substate = 0;
			}
			break;
		case controls_s.confirm:
			if (game_substate == 2) {
				game_substate = 0;
			}
			break;
	}
}

function sprint_execute() {
	endless_execute();
	//mark line number + time
	ctx.fillStyle = color_text;
	ctx.textAlign = "left";
	ctx.fillText(`${Math.max(0, sprint_lines - boards[0].linesCleared)} Lines to go!`, canvas.width / 20, canvas.height * 0.95);
	ctx.textAlign = "right";
	ctx.fillText(`Time Taken: ${Math.round(boards[0].time / framesPerSecond)} s`, canvas.width * 19 / 20, canvas.height * 0.95);
	//if there are more than the necessary number of lines, pre-emptively end the game
	if (boards[0].linesCleared > sprint_lines) {
		boards[0].stopped = true;
		game_substate = 1;
	}
}

function competition_execute() {
	//background
	ctx.fillStyle = color_palettes[0].bg;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	boards[0].tick();
	boards[0].beDrawn(canvas.width / 2, canvas.height / 2);

	boards[1].tick();
	boards[1].beDrawn(canvas.width / 2, canvas.height / 2);

	//draw game over info if over
	if (boards[0].stopped || boards[1].stopped) {
		game_endOpacity = Math.min(1, game_endOpacity + game_endOpacitySpeed);
		ctx.globalAlpha = game_endOpacity;
		drawGameOverText();
		ctx.globalAlpha = 1;
	}
}

function competition_handleKeyPress(a) {

}