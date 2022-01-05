


window.onload = setup;
var asyncBuffer;

var boardChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-=,.;'[]~!@#$%^&*()_+";
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
	textCommands = [[`quit`, () => {text_setStandard(); stopAsyncActivity();}]];
}

function setup() {
	setStandardTextCommands();
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
		if (command.toUpperCase() == textCommands[e][0].toUpperCase()) {
			textCommands[e][1]();
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


function generateMoveTree(boardState, maxDepth, player) {
	var selfNode = {
		board: boardState,
		children: [],
		utility: game_dat.utility(boardState),
	};

	//if the utility isn't undefined, it's an end node, and it can be returned
	//alternatively, it's being cut off
	if (selfNode.utility != undefined) {
		return selfNode;
	}

	if (maxDepth <= 0) {
		selfNode.utility = 0;
		return selfNode;
	}

	//if the utility is undefined, gotta recurse
	var minUtilDist = 1e1001;
	var newNode;
	//figure out children
	var children = game_dat.constructChildren(selfNode.board, player);

	for (var c=0; c<children.length; c++) {
		if (children[c] != undefined) {
			newNode = generateMoveTree(children[c][1], maxDepth - 1, incrementPlayer(player));
			selfNode.children.push(newNode);

			//if that possible utility is closer to self's goal, then make that the utility for the boare
			if (Math.abs(newNode.utility - game_dat.utilityGoals[player]) < minUtilDist) {
				minUtilDist = Math.abs(newNode.utility - game_dat.utilityGoals[player]);
				selfNode.utility = newNode.utility;

				//if it's the closest possible, it's not worth continuing (can't find a closer state)
				// if (minUtilDist == 0) {
				// 	return selfNode;
				// }
			}
		}
		
	}

	return selfNode;
}

function incrementPlayer(player) {
	//walk through the players
	return game_dat["players"][(game_dat["players"].indexOf(player) + 1) % game_dat["players"].length];
}

function placePiece(boardState, location, piece) {
	return boardState.slice(0, location) + piece + boardState.slice(location + 1);
}

function stopAsyncActivity() {
	window.clearTimeout(asyncBuffer);
	game_auto = false;
}


function text_runGame() {
	game_toPlay = incrementPlayer(game_toPlay);
	setStandardTextCommands();

	//figure out if it's a computer or human turn
	var turnIsRobot = game_auto || (game_toPlay == game_computerIs);

	//first display current board state. I put breaks in so this is all done in one pass, no matter the draw speed.
	var boardStr = "<br>";
	var commandStr = "";
	//I put the commands ina list so javascript arguments don't freak out on me
	var commandList = game_dat.constructChildren(board, game_toPlay);
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

	//is the game over? 
	var nowUtility = game_dat.utility(board);
	if (nowUtility != undefined) {
		textBuffer.push("");
		if (nowUtility == game_dat.utilityGoals[game_dat.players[0]]) {
			textBuffer.push(`${game_dat.players[0]} has won.`);
		} else if (nowUtility == game_dat.utilityGoals[game_dat.players[1]]) {
			textBuffer.push(`${game_dat.players[1]} has won.`);
		} else {
			textBuffer.push(`Stalemate.`);
		}
		
		if (game_auto) {
			asyncBuffer = window.setTimeout(() => {
				text_setPreparePlayers();
				text_runGame();
			}, 100);
		} else {
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
		var moveTree = generateMoveTree(board, game_maxViewDepth, game_toPlay);
		var moveUtilDist = undefined;
		var moveBests = [];
		var classifyText = "";
		//choose move based on utility of children
		for (var k=0; k<moveTree.children.length; k++) {
			classifyText = (moveTree.children[k].utility == game_dat.utilityGoals[game_toPlay]) ? `win` : (moveTree.children[k].utility == 0) ? `draw` : `loss`;

			if (moveUtilDist == undefined || Math.abs(moveTree.children[k].utility - game_dat.utilityGoals[game_toPlay]) < moveUtilDist) {
				moveUtilDist = Math.abs(moveTree.children[k].utility - game_dat.utilityGoals[game_toPlay]);
				moveBests = [moveTree.children[k].board];
			} else if (Math.abs(moveTree.children[k].utility - game_dat.utilityGoals[game_toPlay]) == moveUtilDist) {
				//if it's equal, add it to the possible moves
				moveBests.push(moveTree.children[k].board);
			}
		}

		//choose best move
		if (moveBests.length == 0) {
			console.log(`something's gone wrong!!!`);
		}
		if (moveBests.length < 2) {
			board = moveBests[0];
			//console.log(`forced`, board);
		} else {
			board = moveBests[Math.floor(Math.random() * (moveBests.length-0.01))];
		}
		asyncBuffer = window.setTimeout(() => {
			text_runGame();
		}, 1 + (20 * game_auto));
	} else {
		//allow input from player
		commandList.forEach(c => {
			textCommands.push([c[0], () => {board = c[1]; text_runGame();}])
		});
	}

	//if it's a draw, display that.
	


	displayText();
}

function text_setCMDListing() {
	//drawing
	textBuffer = [
		`COMMAND STRUCTURE: [command name] [arg1] [arg2] [arg3]`,
		`Typed as: command name arg1 arg2 arg3`,
		`[quit] - At any time, quit to the main space.`,
		//`[rules] [game] - View the rules of a game.`,
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
	game_toPlay = game_dat.players[1];
	board = ".".repeat(game_dat.dims[0] * game_dat.dims[1]);

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
	var players = game_dat.players;
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
		`Computer opposition is not yet fully complete. Please be prepared`,
		`for imperfect performance if playing with <2 players.`,
		`Currently both 5-in-a-row and order-and-chaos are broken.`,
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



//returns the standard utility for an n x n board (X is negative, O is positive, tic-tac-toe rules but on an n by n board)
function utilityForNxMStandard(boardState, requiredInARow, width, height) {
	var valuesFromBoard = [];
	var inARow = 0;
	var rowVal;

	for (var c=0; c<boardState.length; c++) {
		valuesFromBoard[c] = +(boardState[c] == "O") - +(boardState[c] == "X")
	}


	/*
	Here's the dealio. From each square, there are four possible ways to make a winning line.
	Down, across, diagonal left, and diagonal right.
	The other four directions aren't counted because they're duplicates, and given that we're starting from the top of the board, will just be discovered as one of the other four.

	So the algorithm loops through the portion of the board that can make one of those four lines, and tries to see if there are any lines there. If there are, returns the utility for those.
	*/

	//check all the horizontal lines first, my little system doesn't work with those
	for (var c=0; c<height; c++) {
		for (var r=0; r<width; r++) {
			if (valuesFromBoard[(width * c) + r] != 0 && valuesFromBoard[(width * c) + r] == rowVal) {
				inARow += 1;
				if (inARow >= requiredInARow) {
					return rowVal;
				}
			} else {
				inARow = 1;
				rowVal = valuesFromBoard[(width * c) + r];
			}
		}
		rowVal = undefined;
	}

	for (r=0; r<width; r++) {
		for (c=0; c<=height-requiredInARow; c++) {
			//can't make a line if the start isn't a valid square
			if (valuesFromBoard[r + (c * width)] != 0) {
				//console.log(r, c);
				//can self make a downwards line? (the answer is always yes, the height adjustment is taken care of in the initial for loop)
				rowVal = valuesFromBoard[r + (c * width)];
				for (var k=1; k<requiredInARow; k++) {
					if (valuesFromBoard[r + ((c + k) * width)] != rowVal) {
						k = requiredInARow + 10;
					}
				}
				if (k == requiredInARow) {
					return rowVal;
				}

				//can this square make a DR line?
				if (r <= width - requiredInARow) {
					//console.log('could be DR');
					//can this square make a DR line?
					rowVal = valuesFromBoard[r + (c * width)];
					for (var k=1; k<requiredInARow; k++) {
						if (valuesFromBoard[r + k + ((c + k) * width)] != rowVal) {
							k = requiredInARow + 10;
						}
					}
					if (k == requiredInARow) {
						return rowVal;
					}
				}

				//can this square make a DL line?
				if (r >= requiredInARow - 1) {
					//console.log('could be DL');
					rowVal = valuesFromBoard[r + (c * width)];
					for (var k=1; k<requiredInARow; k++) {
						if (valuesFromBoard[r - k + ((c + k) * width)] != rowVal) {
							k = requiredInARow + 10;
						}
					}
					if (k == requiredInARow) {
						return rowVal;
					}
				}
			}
		}
	}
	//if there are no moves left to play, it's a draw
	if (boardState.indexOf(".") == -1) {
		return 0;
	}
}