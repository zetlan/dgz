#Name: [REDACTED]
#Date: November-29-2021


import sys




#returns 0 if the board makes a draw, -1 if the board makes a loss, and 1 if the board makes a win
#board: the current board state (9 length string)
#forPlayer: the player that the utility is being calculated for (X / O)
#playerToMove: the player that's about to move (X / O)
def calculateUtility(board, forPlayer, playerToMove):
    return


#takes in a board, and returns either an empty string, an _, X, or O, depending on which player has won
# "" - board is not over
# "_" - it's a draw
# "X" - X has won
# "O" - O has won
def boardIsOver(board):
    finalChar = ""
    return finalChar