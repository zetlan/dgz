window.onload = setup;
window.addEventListener("keydown", handleInput, false);
window.addEventListener("resize", setCanvasPreferences, false);

var animation;
var canvas;
var ctx;

var ai_avgScore;
var ai_best;
var ai_bestFitness;
var ai_endStr = `GAME OVER`;
var ai_gameLengthMax = 350000;
var ai_generation = 0;
var ai_name = "block-II";
var ai_mutationRate = 0.2;
var ai_mutationAmount = 0.05;
var ai_population = [];
var ai_populationPaired = [];
var ai_populationGoal = 600;
//how many points the AI gets for clearing x number of lines at the same time
var ai_scoring = [0, 40, 100, 300, 1200];
var ai_sharesMax = 150;
var ai_sharesRate = 0.8;
var ai_trainGames = 5;


var audio_channel1;
var audio_channel2;
var audio_fadeTime = 30;
var audio_tolerance = 1 / 45;


var board_clearTime = 15;
var board_screenPercentage = 0.9;
var board_width = 10;
var board_height = 20;
var board_heightBuffer = 2;
var board_verticalAdjust = 0.7;
var board_linesRequired = 10;
var boards = [];

var color_bg_menu = "#A57548";
var color_text = "#BDFFF9";
var color_gameEndBg = "#2e103a";

var framesPerSecond = 60;
var frameTime = 1 / framesPerSecond;
var frameIncrement = 60;
var frameBuffer = [];

var fileObj;

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

var scores_max = 10;

let state_functions_main = [
	execute_menu,
	execute_endless,
	execute_sprint,
	execute_competition,
	execute_aiTrain,
	execute_endless,
]
let state_functions_keyPress = [
	handleKeyPress_menu,
	handleKeyPress_game,
	handleKeyPress_game,
	handleKeyPress_competition,
	handleKeyPress_aiTrain,
	handleKeyPress_aiPlay,
]

function handleInput(a) {
	state_functions_keyPress[game_state](a);
}

function setup() {
	canvas = document.getElementById("cromer");
	ctx = canvas.getContext("2d");

	audio_channel1 = new AudioChannel(0.5);

	setCanvasPreferences();
	localStorage_read();

	animation = window.requestAnimationFrame(main);
}

function main() {
	state_functions_main[game_state]();

	//local storage
	if (animation % 203 == 0) {
		localStorage_write();
	}
	animation = window.requestAnimationFrame(main);
}

function execute_aiTrain() {
	//audio + background
	audio_channel1.target = undefined;
	audio_channel1.tick();

	ctx.fillStyle = color_palettes[0].bg;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	drawAIButtons();
	drawAIListing();
}


//game mode functions

function execute_menu() {
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
			drawMainMenu();
			break;
		case 1:
			menu_executeSettings();
			break;
		case 2:
			//highscores
			drawHighScores();
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

function execute_endless() {
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

function execute_sprint() {
	execute_endless();
	//mark line number + time
	if (game_substate == 0) {
		ctx.fillStyle = color_text;
		ctx.textAlign = "left";
		ctx.fillText(`${Math.max(0, sprint_lines - boards[0].linesCleared)} Lines to go!`, canvas.width / 20, canvas.height * 0.95);
		ctx.textAlign = "right";
		ctx.fillText(`Time Taken: ${Math.round(boards[0].time / framesPerSecond)} s`, canvas.width * 19 / 20, canvas.height * 0.95);
	}
	
	//if there are more than the necessary number of lines, pre-emptively end the game
	if (boards[0].linesCleared > sprint_lines) {
		boards[0].stopped = true;
		game_substate = 1;
	}
}

function execute_competition() {
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