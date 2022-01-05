
/*basic game rules:
	play on a rectangular board made of squares
	boards are represented as a string that is length n, where the board is size p, q and p * q = n
	two players
	take turns placing one piece at a time
	there must be some way to evaluate board utility
*/



var games = {
	"5-in-a-row": {
		//returns a list of name coordinates associated with board states
		//ex: ["23", "...XO..X..O...XX..O..O"]
		constructChildren: (boardState, player) => {
			var sz = games["5-in-a-row"].dims;
			var arr = [];
			for (var y=0; y<sz[1]; y++) {
				for (var x=0; x<sz[0]; x++) {
					if (boardState[(y * sz[1]) + x] == ".") {
						arr[x + (sz[1] * y)] = [boardChars[x] + boardChars[y], placePiece(boardState, x + (sz[1] * y), player)];
					}
				}
			}
			return arr;
		},
		dims: [10, 10],
		players: ["X", "O"],
		thinkDist: 4,
		//utility goal is the amount of utility each player wants. In this case, X wants a lot of negative utility, and O wants a lot of positive utility.
		utilityGoals: {
			"X": -1,
			"O": 1
		},

		utility: (boardState) => {
			return utilityForNxMStandard(boardState, 5, games["5-in-a-row"].dims[0], games["5-in-a-row"].dims[1])
		}
	},

	"connect-4": {
		constructChildren: (boardState, player) => {
			//one command for each row
			var sz = games["connect-4"].dims;
			var buffer1 = [];

			for (var x=0; x<sz[0]; x++) {
				//is the row open?
				if (boardState[x] == ".") {
					//move down util found one
					for (var y=1; y<sz[1]; y++) {
						if (boardState[(sz[0] * y) + x] != ".") {
							buffer1[x] = [boardChars[x], placePiece(boardState, (sz[0] * (y - 1)) + x, player)];
							y = sz[1] + 2;
						}
					}

					//if out of zone, set to last square
					if (y < sz[1] + 1) {
						buffer1[x] = [boardChars[x], placePiece(boardState, (sz[0] * (sz[1] - 1)) + x, player)];
					}
				}
			}
			return buffer1;
		},
		dims: [7, 6],
		players: ["X", "O"],
		thinkDist: 6,
		validMoves: {
			"X": "X",
			"O": "O"
		},
		utilityGoals: {
			"X": -1,
			"O": 1
		},

		utility: (boardState) => {
			return utilityForNxMStandard(boardState, 4, games["connect-4"].dims[0], games["connect-4"].dims[1]);
		}
	},

	"tic-tac-toe": {
		constructChildren: (boardState, player) => {
			var buffer1 = [];

			//add all available squares
			for (var c=0; c<boardState.length; c++) {
				if (boardState[c] == ".") {
					buffer1[c] = [boardChars[c], placePiece(boardState, c, player)];
				}
			}

			return buffer1;
		},
		dims: [3, 3],
		players: ["X", "O"],
		thinkDist: 10,
		validMoves: {
			"X": "X",
			"O": "O"
		},
		utilityGoals: {
			"X": -1,
			"O": 1
		},

		utility: (boardState) => {
			return utilityForNxMStandard(boardState, 3, games["tic-tac-toe"].dims[0], games["tic-tac-toe"].dims[1]);
		}
	},
	
	//FIX CONSTRUCT CHILDREN HERE
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
		validMoves: {
			"order": "XO",
			"chaos": "XO"
		},
		utilityGoals: {
			"order": 1,
			"chaos": 0,
		},
		utility: (boardState) => {
			//divide into 4 boards, those'll act as mini 5x5s.
			var minis = [];
			
			//if either x or o wins, order wins (so take the absolute value of a typical utility function)
		}
	}
}


var games_desc = {
	"tic-tac-toe": [`Played with two players on a 3 by 3 board.`, `Each player tries to make 3 in a row to win the game.`, `One player plays only Xs, and one player plays only Os.`, `X goes first.`],
	"5-in-a-row": [`Similar to tic-tac-toe, but 5 in a row`, `is required to win, and the board is 10 by 10.`],
	"order-and-chaos": [`Played on a 6 by 6 board.`, `One player is order, and the other is chaos.`, `Both players can place an X or O.`, `Order wants to make at least 5 in a row.`, `Chaos wants to prevent that.`, `Order plays first.`],
}