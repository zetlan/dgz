#Name: [REDACTED]
#Date: November-29-2021


import sys
import math


computerIsPlaying = ""
boardN = 3
board = "........."
sideToPlay = "X"
gameIsOver = False
utilities = {
    "X": 1,
    "O": -1
}



#returns a tree of objects with utility values associated with them, decided via minmax.
#the top always tries to get the maximum value
def minmaxTree(board, player):
    #create The Object
    node = {
        "state": board,
        "utility": utilityFor(board),
    }
    #is the utility defined? Cool! If not, it's got children, and those need to be evaluated
    if (node["utility"] != None):
        return node

    node["children"] = []
    #take turns replacing each section with a new board
    for c in range(len(board)):
        if (board[c] == "."):
            node["children"].append(minmaxTree(board[:c] + player + board[c+1:], swapPlayer(player)))

    #node's utility is the best utility self can expect. (the utility that comes closest to self's target utility.)
    minUtilDist = 1e1001
    for child in node["children"]:
        #if the utility of that child is closer than all the other possibilities so far, select that as the best possible move
        if (abs(child["utility"] - utilities[player]) < minUtilDist):
            minUtilDist = abs(child["utility"] - utilities[player])
            node["utility"] = child["utility"]
            #if the target utility can already be reached, just set that
            if (minUtilDist == 0):
                return node
    return node


def swapPlayer(player):
    return "XO"[("XO".index(player) + 1) % 2]


#takes in a board, and returns a value depending on which player has won
#   undefined - board is not over
#   1 - X has won
#   0 - it's a draw
#  -1 - O has won
def utilityFor(board):
    n = 3
    utilStore = 0
    values = []
    hasEmpty = False

    #keep track of the value for every space
    for c in range(len(board)):
        values.append(int(board[c] == "X") - int(board[c] == "O"))
        if (board[c] == "."):
            hasEmpty = True
    

    #diagonal 1
    for a in range(0, n * n, n + 1):
        utilStore += values[a]
    if (math.trunc(utilStore / n) != 0):
        return (utilStore / n)
    utilStore = 0

    #diagonal 2
    for a in range(2, n * n - 1, n - 1):
        utilStore += values[a]
    if (math.trunc(utilStore / n) != 0):
        return (utilStore / n)
    utilStore = 0

    #rows
    for c in range(n):
        for a in range(n):
            utilStore += values[n * c + a]
        if (math.trunc(utilStore / n) != 0):
            return (utilStore / n)
        utilStore = 0

    #columns
    for c in range(n):
        for a in range(n):
            utilStore += values[a * n + c]
        if (math.trunc(utilStore / n) != 0):
            return (utilStore / n)
        utilStore = 0

    #if the board isn't empty but neither player has won, it's a draw
    if (not hasEmpty):
        return 0








#main program
board = sys.argv[1]

#board is already over, exit
if (board.count(".") == 0 or utilityFor(board) != None):
    gameIsOver = True
else:
    #figure out which side the computer is playing based on already-existing pieces
    xCount = board.count("X")
    oCount = board.count("O")

    #if there's no xs or os, the user decides
    if (xCount == 0 and oCount == 0):
        side = input("Should the computer play [X] or [O]? ")
        while (not (side == "X" or side == "O")):
            side = input("(Type value inside square brackets) Should the computer play [X] or [O]? ")
        computerIsPlaying = side
        print(computerIsPlaying)
    else:
        #parity determines who goes
        if (xCount == oCount):
            computerIsPlaying = "X"
            sideToPlay = "X"
        else:
            computerIsPlaying = "O"
            sideToPlay = "O"

    print("computer is playing " + computerIsPlaying)




while (not gameIsOver):
    #display the board
    print("")
    for n in range(0, len(board), 3):
        print(board[n:n+3])
    print("")



    #do a move
    if sideToPlay == computerIsPlaying:
        #computer turn
        print("Computer to move. Thinking...")
        futureVision = minmaxTree(board, computerIsPlaying)

        bestPlay = ""
        bestUtilDist = 1e1001
        for future in futureVision["children"]:
            moveType = ""
            if (future["utility"] == utilities[computerIsPlaying]):
                moveType = "(win)"
            elif (future["utility"] == 0):
                moveType = "(draw)"
            else:
                moveType = "(loss)"

            print("expected utility from "+future["state"]+": "+str(future["utility"])+" "+moveType)

            if (abs(future["utility"] - utilities[computerIsPlaying]) < bestUtilDist):
                bestUtilDist = abs(future["utility"] - utilities[computerIsPlaying])
                bestPlay = future["state"]

        board = bestPlay
    else:
        #human turn
        print("")
        print("012")
        print("345")
        print("678")
        print("")
        moveOptions = []
        moveOptionsStr = ""
        for c in range(len(board)):
            if (board[c] == "."):
                moveOptions.append(c)
                moveOptionsStr += "["+str(c)+"]"

        moveSelected = input("Please select a move. " + moveOptionsStr)
        while (moveSelected == "" or (moveSelected not in moveOptionsStr)):
            moveSelected = input("Please select a ‹valid› move. " + moveOptionsStr)
        
        board = board[:int(moveSelected)] + sideToPlay + board[int(moveSelected)+1:]

    sideToPlay = swapPlayer(sideToPlay)
        
    #check for completion
    if (board.count(".") == 0 or utilityFor(board) != None):
        gameIsOver = True


#game is over, quick summary
print("")
for n in range(0, len(board), 3):
    print(board[n:n+3])
print("")
util = utilityFor(board)
if (util == 1):
    print("X wins.")
elif (util == 0):
    print("Stalemate.")
else:
    print("O wins.")