


window.onload = setup;
var asyncBuffer;

var boardChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-=,.;'[]~!@#$%^&*()_+";
var boardEmpty = ".";
var board;

var game_auto = false;
var game_computerIs = undefined;
var game_dat;
var game_maxViewDepth = 12;
var game_toPlay;

var textDelayCurrent = 0;
var textDelay = 2;
var textLine = 0;
var textBuffer = [];
var textCommands = [];

function setStandardTextCommands() {
	textCommands = [
		[`quit`, () => {text_setStandard(); stopAsyncActivity();}],
		[`help`, (gameName) => {text_addHelp(gameName);}]

];

}

function setup() {
	setStandardTextCommands();
	text_setStandard()
	document.getElementById("terminal-input-true").addEventListener("keyup", acceptTextCommand, false);
}


function acceptTextCommand(a) {
	//only submit commands on enter
	if (a.key != "Enter") {
		return;
	}
	var commandLocation = document.getElementById("terminal-input-true");
	var command = commandLocation.value;

	if (command == undefined) {
		return;
	}

	//detect commands and clear box if accepted
	var inputs = command.toUpperCase().split(" ");
	for (var e=0; e<textCommands.length; e++) {
		if (inputs[0] == textCommands[e][0].toUpperCase()) {
			textCommands[e][1](...inputs.slice(1));
			commandLocation.value = "";
			return;
		}
	}
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

function stopAsyncActivity() {
	window.clearTimeout(asyncBuffer);
	game_auto = false;
}

function text_addHelp(helpFor) {
	var helpText = ``;
	switch (helpFor) {
		case `othello`:
			
	}

	//add at the top of the text buffer
	textBuffer.splice(0, 0, `--------`);
	textBuffer.splice(0, 0, helpText);
}


function text_runGame() {
	game_toPlay = game_dat.incrementPlayer(game_toPlay);
	setStandardTextCommands();

	

	//figure out if it's a computer or human turn
	var turnIsRobot = game_auto || (game_toPlay == game_computerIs);
	//I put the commands in a list so javascript arguments don't freak out on me
	var commandList = game_dat.constructChildren(board, game_toPlay);
	writeBoardToTerminal(turnIsRobot, commandList);

	//is the game over? 
	if (game_dat.gameIsOver(board)) {
		var nowUtility = game_dat.utilityFor(board);
		var dispText = "";
		switch (true) {
			case (nowUtility == game_dat.utilGoals[game_dat.pieces[0]]):
				//p0 has won
				dispText = `${game_dat.pieces[0]} has won.`;
				break;
			case (nowUtility == game_dat.utilGoals[game_dat.pieces[1]]):
				//p1 has won
				dispText = `${game_dat.pieces[1]} has won.`;
				break;
			case (nowUtility == 0):
				//draw
				dispText = `Stalemate.`;
				break;
			default:
				dispText = `An Error has occurred in this game's utility function.`;
		}
		if (dispText != "") {
			textBuffer.push("");
			textBuffer.push(dispText);
		}

		//restart a new game if it's auto
		if (game_auto) {
			asyncBuffer = window.setTimeout(() => {
				text_setPreparePlayers();
				text_runGame();
			}, 100);
		} else {
			//if it's manual, display the user's options
			textBuffer.push(`You may [quit] or [restart].`);
			textCommands.push(['restart', () => {text_setPreparePlayers();}]);
		}

		displayText();
		return;
	}
	
	if (!game_auto) {
		textBuffer.push(`<br>${game_toPlay} to move.`);
	}

	//commands
	if (turnIsRobot) {
		//think hard
		var moveTree = game_dat.generateMoveTree(board, game_dat.thinkDist, game_toPlay);
		var moveUtilDist = undefined;
		var moveBests = [];
		//choose move based on utility of children
		for (var k=0; k<moveTree.children.length; k++) {
			if (moveUtilDist == undefined || Math.abs(moveTree.children[k].utility - game_dat.utilGoals[game_toPlay]) < moveUtilDist) {
				moveUtilDist = Math.abs(moveTree.children[k].utility - game_dat.utilGoals[game_toPlay]);
				moveBests = [moveTree.children[k].board];
			} else if (Math.abs(moveTree.children[k].utility - game_dat.utilGoals[game_toPlay]) == moveUtilDist) {
				//if it's equal, add it to the possible moves
				moveBests.push(moveTree.children[k].board);
			}
		}

		//choose best move
		if (moveBests.length == 0) {
			console.log(`something's gone wrong!!!`);
		} else {
			board = moveBests[Math.floor(Math.random() * (moveBests.length-0.01))];
		}
		asyncBuffer = window.setTimeout(() => {
			text_runGame();
		}, 5 + (20 * game_auto));
	} else {
		//allow input from player
		commandList.forEach(c => {
			textCommands.push([c[0], () => {board = c[1]; text_runGameBuffer();}])
		});
	}

	//if it's a draw, display that.
	displayText();
}

function text_runGameBuffer() {
	writeBoardToTerminal(game_auto || (game_toPlay == game_computerIs), game_dat.constructChildren(board, game_toPlay));
	displayText();
	asyncBuffer = window.setTimeout(() => {
		text_runGame();
	}, 50);
}

function text_setCMDListing() {
	//drawing
	textBuffer = [
		`COMMAND STRUCTURE: [command name] [arg1] [arg2] [arg3]`,
		`Typed as: command name arg1 arg2 arg3`,
		`[quit] - At any time, quit to the main space.`,
		`[help] [game] - Get information about a game.`,
	];

	//commands
	setStandardTextCommands();
	textCommands = [...textCommands,
		[],
	]

	displayText();
}


function text_setPreparePlayers(gameKey) {
	if (gameKey != undefined) {
		game_dat = games[gameKey];
	}
	game_maxViewDepth = game_dat.thinkDist;
	game_toPlay = game_dat.pieces[1];
	board = game_dat.createBoard();

	//commands
	setStandardTextCommands();
	textCommands.push(['2', () => {game_computerIs = ""; text_runGame();}]);
	textCommands.push(['1', () => {text_setPrepareRoles();}]);
	textCommands.push(['0', () => {game_auto = true; text_runGame();}]);

	//text
	textBuffer = [`Enter number of human players.`, `[2] or [1]`];

	displayText();
}


function text_setPrepareRoles() {
	var players = game_dat.pieces;
	//commands
	setStandardTextCommands();
	textCommands.push([players[0], () => {game_computerIs = players[1]; text_runGame();}]);
	textCommands.push([players[1], () => {game_computerIs = players[0]; text_runGame();}]);

	textBuffer = [`Would you like to be [${players[0]}] or [${players[1]}]?`];
	displayText();
}

function text_setStandard() {
	textBuffer = [
		`Welcome.`,
		`Typable commands will be in [square brackets].`,
		`You may request a full [list] of commands.`,
		`The intelligence for 5-in-a-row is currently incomplete.`,
		`Please be prepared for flawed performance if playing with <2 players.`,
		``,
		`Please type a game selection:`,
	];
	
	//set text + commands
	setStandardTextCommands();
	textCommands.push(["list", () => {text_setCMDListing();}]);
	Object.keys(games).forEach(g => {
		textBuffer.push(`[${g}]`);
		textCommands.push([g, () => {text_setPreparePlayers(g);}])
	});

	displayText();
}

function writeBoardToTerminal(turnIsRobot, commandList) {
	//first display current board state. I put breaks in so this is all done in one pass, no matter the draw speed.
	var boardStr = "<br>";
	var commandStr = "";
	var commandLen = 0;
	for (var a=0; a<commandList.length; a++) {
		if (commandList[a] != undefined) {
			commandLen = commandList[a][0].length;
			a = commandList.length + 1;
		}
	}
	for (var q=0; q<game_dat.dims[0] * game_dat.dims[1]; q+=game_dat.dims[0]) {
		if (!turnIsRobot) {
			for (var y=0; y<game_dat.dims[0]; y++) {
				if (commandList[q+y] == undefined) {
					commandStr += ` `.repeat(2 + commandLen);
				} else {
					commandStr += `[${commandList[q+y][0]}]`;
				}
			}
		}
		
		boardStr += `${board.slice(q, q+game_dat.dims[0])}      ${commandStr}<br>`;
		commandStr = "";
	}

	textBuffer = [boardStr];
}