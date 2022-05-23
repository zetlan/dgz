
/*basic game rules:
	play on a rectangular board made of squares
	boards are represented as a string that is length n, where the board is size p, q and p * q = n
	two players
	take turns placing one piece at a time
	there must be some way to evaluate board utility
*/




//everything is an object and you are not going to remember inheritance correctly
class Game {
	constructor() {
		this.dims = [1, 1, 1];
		this.pieces = "XO";
		this.thinkDist = -1;
		this.utilGoals = {
			"X": 1,
			"O": -1
		};
	}

	applyMove(boardState, location, piece) {
		return boardState.slice(0, location) + piece + boardState.slice(location + 1);
	}

	createBoard() {
		return boardEmpty.repeat(this.dims[0] * this.dims[1]);
	}

	gameIsOver(boardState) {
		//a game is generally over if it gives utility
		return (this.utilityFor(boardState) != undefined);
	}

	generateMoveTree(boardState, maxDepth, player) {
		var selfNode = {
			board: boardState,
			children: [],
			utility: undefined
		};

		//if the game is over or it's being cut off, evaluate utility
		if (maxDepth <= 0 || this.gameIsOver(boardState)) {
			selfNode.utility = this.utilityFor(boardState) ?? 0;
			return selfNode;
		}
	
		//if unfinished, recurse
		var minUtilDist = 1e1001;
		var newNode;
		//figure out children
		var children = this.constructChildren(selfNode.board, player);
	
		for (var c=0; c<children.length; c++) {
			if (children[c] != undefined) {
				newNode = this.generateMoveTree(children[c][1], maxDepth - 1, this.incrementPlayer(player));
				selfNode.children.push(newNode);
	
				//if that possible utility is closer to self's goal, then make that the utility for the boare
				if (Math.abs(newNode.utility - this.utilGoals[player]) < minUtilDist) {
					minUtilDist = Math.abs(newNode.utility - this.utilGoals[player]);
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

	incrementPlayer(player) {
		return (player == this.pieces[1]) ? this.pieces[0] : this.pieces[1];
	}

	utilityFor(board) {
		return this.utilityStandard(board, this.dims[0], this.dims[1], this.dims[2]);
	}

	utilityStandard(boardState, width, height, requiredInARow) {
		var valuesFromBoard = [];
		var inARow = 0;
		var rowVal;
	
		for (var c=0; c<boardState.length; c++) {
			valuesFromBoard[c] = +(boardState[c] == "X") - +(boardState[c] == "O")
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
		if (boardState.indexOf(boardEmpty) == -1) {
			return 0;
		}
	}
}

//actual games
class ConnectFour extends Game {
	constructor() {
		super();
		this.dims = [7, 6, 4];
		this.thinkDist = 6;
	}

	constructChildren(boardState, player) {
		//one command for each row
		var sz = this.dims;
		var buffer1 = [];

		for (var x=0; x<sz[0]; x++) {
			//is the row open?
			if (boardState[x] == boardEmpty) {
				//move down util found one
				for (var y=1; y<sz[1]; y++) {
					if (boardState[(sz[0] * y) + x] != boardEmpty) {
						buffer1[x] = [boardChars[x], this.applyMove(boardState, (sz[0] * (y - 1)) + x, player)];
						y = sz[1] + 1;
					}
				}

				//if out of zone, set to last square
				if (y < sz[1] + 1) {
					buffer1[x] = [boardChars[x], this.applyMove(boardState, (sz[0] * (sz[1] - 1)) + x, player)];
				}
			}
		}
		return buffer1;
	}
}


class FiveInARow extends Game {
	constructor() {
		super();
		this.dims = [10, 10, 5];
		this.thinkDist = 4;
	}

	//returns a list of name coordinates associated with board states
	//one element example: ["23", "...XO..X..O...XX..O..O"]
	constructChildren(boardState, player) {
		var sz = this.dims;
		var arr = [];
		for (var y=0; y<sz[1]; y++) {
			for (var x=0; x<sz[0]; x++) {
				if (boardState[(y * sz[1]) + x] == boardEmpty) {
					arr[x + (sz[1] * y)] = [boardChars[x] + boardChars[y], this.applyMove(boardState, x + (sz[1] * y), player)];
				}
			}
		}
		return arr;
	}
}


class Othello extends Game {
	constructor() {
		super();
		this.dims = [10, 10];
		this.pieces = "xo";
		this.thinkDist = 6;
		this.utilGoals = {
			'x': 1e7,
			'o': -1e7,
		}
		this.dirs = [-11, -10, -9, -1, 1, 9, 10, 11];
	}

	//returns a new board with a piece applied at an index. Flips pieces accordingly.
	applyMove(board, index, piece, opposition) {
		//apply initial piece
		board = board.slice(0, index) + piece + board.slice(index+1);
	
		//apply changes in all directions
		var trackIndex = index;
		for (var dir of this.dirs) {
			trackIndex = index + dir;
			//go through board line until a different character is found
			while (board[trackIndex] == opposition) {
				trackIndex += dir;
			}
	
			//if that different character is a good character, run back through and color all the pieces in between
			if (board[trackIndex] == piece) {
				trackIndex -= dir;
				while (trackIndex != index) {
					board = board.slice(0, trackIndex) + piece + board.slice(trackIndex+1);
					trackIndex -= dir;
				}
			}
		}
		return board;
	}

	childIsGood(boardState, player, opposer, moveIndex) {
		//loop through all directions to see if a swap is possible, if a swap can be made then the move is legal
		var trackIndex = moveIndex;
		for (var dir of this.dirs) {
			trackIndex = moveIndex + dir;
			while (boardState[trackIndex] == opposer) {
				trackIndex += dir;
			}
			//if the run can flip a piece, say it's good
			if (trackIndex != moveIndex + dir && boardState[trackIndex] == player) {
				return true;
			}
		}
		return false;
	}

	createBoard() {
		//to be honest it's just easier to hardcode this one rather than having a bunch of repeat functions and variables.
		return "```````````........``........``........``...xo...``...ox...``........``........``........```````````";
	}

	constructChildren(boardState, player) {
		var opposite = (player == 'x') ? 'o' : 'x';
		var moveList = [];

		var nowIndex;
		for (var c=1; c<9; c++) {
			for (var r=1; r<9; r++) {
				//if it's a blank, maybe a move can be made there
				nowIndex = (c * 10) + r;
				if (boardState[nowIndex] == boardEmpty) {
					//if given the ok, add the move to the list
					if (games["othello"].childIsGood(boardState, player, opposite, nowIndex)) {
						moveList[(c * 10) + r] = [boardChars[r] + boardChars[c], this.applyMove(boardState, (c * 10) + r, player, opposite)];
					}
				}
			}
		}

		return moveList;
	}

	gameIsOver(boardState) {
		return (boardState.indexOf(boardEmpty) == -1);
	}

	utilityFor(boardState) {
		//constants for adjusting how much the AI cares about different things
		var utilWin = 1e7;
		var utilCorner = 1e5;
		var utilMove = 1e2;
		var utilCapture = 1;

		var numXs = (boardState.match(/x/g) || []).length;
		var numOs = (boardState.match(/o/g) || []).length;

		//if it's a win state, calculation is easy
		if (numXs + numOs == 64) {
			return utilWin * Math.sign(numXs - numOs);
		}

		var utility = 0;
		//corners matter
		utility += utilCorner * ((boardState[11] == 'x') + (boardState[18] == 'x') + (boardState[81] == 'x') + (boardState[88] == 'x'));
		utility -= utilCorner * ((boardState[11] == 'o') + (boardState[18] == 'o') + (boardState[81] == 'o') + (boardState[88] == 'o'));

		//value mobility
		utility += utilMove * (games["othello"].constructChildren(boardState, 'x').filter(a => a != undefined).length - 
								games["othello"].constructChildren(boardState, 'x').filter(a => a != undefined).length);

		// #points
		utility += utilCapture * (numXs - numOs);

		//don't let utility be 0, because that indicates a stalemate
		if (utility == 0) {
			return 1;
		}
		return utility;
	}
}

class TicTacToe extends Game {
	constructor() {
		super();
		this.dims = [3, 3, 3];
		this.thinkDist = 11;
	}

	constructChildren(boardState, player) {
		var buffer1 = [];

		//add all available squares
		for (var c=0; c<boardState.length; c++) {
			if (boardState[c] == boardEmpty) {
				buffer1[c] = [boardChars[c], this.applyMove(boardState, c, player)];
			}
		}

		return buffer1;
	}
}


var games = {
	"5-in-a-row": new FiveInARow(),
	"connect-4": new ConnectFour(),
	"tic-tac-toe": new TicTacToe(),
	
	/*FIX CONSTRUCT CHILDREN HERE
	"order-and-chaos": {
		constructChildren: (boardState, player) => {
			var buffer1 = [];

			//add all available squares
			for (var c=0; c<boardState.length; c++) {
				if (boardState[c] == ".") {
					buffer1[c] = [boardChars[c], c];
				}
			}
			return buffer1;
		},
		dims: [6, 6],
		players: ["order", "chaos"],
		thinkDist: 5,
		utilGoals: {
			"order": 1,
			"chaos": 0,
		},
		utility: (boardState) => {
			//divide into 4 boards, those'll act as mini 5x5s.
			var minis = [];
			
			//if either x or o wins, order wins (so take the absolute value of a typical utility function)
		}
	}, */
	"othello": new Othello(),
}


var games_desc = {
	"5-in-a-row": [`Similar to tic-tac-toe, but 5 in a row`, `is required to win, and the board is 10 by 10.`],
	"connect-4": [`Played on a 6 by 7 board.`, `Players drop tiles from the top of the board, and they fall to the lowest available spot.`, `The first player to make 4 in a row wins`],
	"tic-tac-toe": [`Played with two players on a 3 by 3 board.`, `Each player tries to make 3 in a row to win the game.`, `One player plays only Xs, and one player plays only Os.`, `X goes first.`],
	"order-and-chaos": [`Played on a 6 by 6 board.`, `One player is order, and the other is chaos.`, `Both players can place an X or O.`, `Order wants to make at least 5 in a row, and chaos wants to prevent that.`, `Order plays first; to play type either X or O and then the number of the space you want to play at.`],
	"othello": [`Played on an 8 by 8 board.`, `Players take turns placing an X or O on the board.`, `If placing a tile creates a line of tiles bordered on each end by the same type, the tiles will switch sides.`, `The game ends when the entire board is filled.`]
}