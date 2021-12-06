


window.onload = setup;

var game_board;
var game_dat;
var game

var textDelayCurrent = 0;
var textDelay = 2;
var textLine = 0;

var textBuffer = [];
var textCommands = [[`quit`, () => {state = 0; text_setStandard();}]];

var state = 0;

function setup() {
	text_setStandard();
	document.getElementById("terminal-input").addEventListener("keyup", acceptTextCommand, false);
}

function acceptTextCommand(a) {
	//only submit commands on enter
	if (a.key != "Enter") {
		return;
	}
	var commandLocation = document.getElementById("terminal-input");
	var command = commandLocation.value;

	//detect commands and clear box if accepted
	for (var e=0; e<textCommands.length; e++) {
		if (command == textCommands[e][0]) {
			textCommands[e][1]();
			commandLocation.value = "";
		}
	}
}

function text_setPreparePlayers(gameKey) {
	//commands
	textCommands = textCommands.slice(0, 1);
	textCommands.push([players[0], () => {}]);

	//text
	textBuffer = [`Enter number of human players.`, `[2] or [1]`];
}


function text_setPrepareRoles(gameKey) {
	var players = Object.keys(games[gameKey].validMoves);

	//commands
	textCommands = textCommands.slice(0, 1);
	textCommands.push([players[0], () => {}])

	game_dat = games[gameKey];
	board = ".".repeat(game_dat.dims[0] * game_dat.dims[1]);

	textBuffer = [`Would you like to be [${players[0]}] or [${players[1]}]?`];
	displayText();
}

function text_setStandard() {
	textBuffer = [
		`Welcome.`,
		`Typable commands will be in [square brackets].`,
		`At any time, you may [quit] to this state.`,
		`Please type a game selection:`,
	];
	
	//set text + commands
	textCommands = textCommands.slice(0, 1);
	Object.keys(games).forEach(g => {
		textBuffer.push(`[${g}]`);
		textCommands.push([g, () => {text_setPrepare(g); state = 1;}])
	});
	displayText();

	//set commands
}



function displayText() {
	textLine = 0;
	document.getElementById("terminal-output").innerHTML = "";
	displayTextRecursive();
}

function displayTextRecursive() {
	//don't display if off the end
	if (textLine > textBuffer.length-1) {
		return;
	}

	//increment the text parity
	textDelayCurrent += 1;

	//display text
	if (textDelayCurrent >= textDelay) {
		textDelayCurrent = 0;
		textLine += 1;

		var strOutput = ``;
		for (var h=0; h<textLine; h++) {
			strOutput += textBuffer[h] + "<br>";
		}

		document.getElementById("terminal-output").innerHTML = strOutput;
	}
	window.requestAnimationFrame(displayTextRecursive);
}


//returns the standard utility for an n x n board (X is negative, O is positive, tic-tac-toe rules but on an n by n board)
function utilityForNxNStandard(boardState, n) {
	var valuesFromBoard = [];
	for (var c=0; c<boardState.length; c++) {
		valuesFromBoard[c] = +(boardState[c] == "O") - +(boardState[c] == "X")
	}
	//keep track of the value for every row, column, and diagonal.
	var utilStore = 0;

	//diagonal1
	for (var a=0; a<n*n; a+=n+1) {
		utilStore += valuesFromBoard[a];
	}
	if (Math.trunc(utilStore / n) != 0) {
		return utilStore / n;
	}
	utilStore = 0;
	

	//diagonal2
	for (a=n-1; a<n*n-1; a+=n-1) {
		utilStore += valuesFromBoard[a];
	}
	if (Math.trunc(utilStore / n) != 0) {
		return utilStore / n;
	}
	utilStore = 0;


	//rows
	for (c=0; c<n; c++) {
		for (a=0; a<n; a++) {
			utilStore += valuesFromBoard[(n * c) + a];
		}
		if (Math.trunc(utilStore / n) != 0) {
			return utilStore / n;
		}
		utilStore = 0;
	}

	//columns
	for (c=0; c<n; c++) {
		for (a=0; a<n; a++) {
			utilStore += valuesFromBoard[(a * n) + c];
		}
		if (Math.trunc(utilStore / n) != 0) {
			return utilStore / n;
		}
		utilStore = 0;
	}
}