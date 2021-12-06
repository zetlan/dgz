
/*basic game rules:
    play on a rectangular board made of squares
    boards are represented as a string that is length n, where the board is size p, q and p * q = n
    two players
    take turns placing one piece at a time
    there must be some way to evaluate board utility
*/



var games = {
    "tic-tac-toe": {
        dims: [3, 3],
        validMoves: {
            "X": "X",
            "O": "O"
        },
        //utility goal is the amount of utility each player wants. In this case, X wants a lot of negative utility, and O wants a lot of positive utility.
        utilityGoals: {
            "X": -1e101,
            "O": 1e101
        },

        isDone: (boardState) => {
            return (games["tic-tac-toe"].utility(boardState) != 0);
        },

        //x counts as negative utility
        utility: (boardState) => {
            return utilityForNxNStandard(boardState, 3);
        }
    },
    "order-and-chaos": {
        boardDimensions: [6, 6],
        validMoves: {
            "order": "XO",
            "chaos": "XO"
        }
    }
}