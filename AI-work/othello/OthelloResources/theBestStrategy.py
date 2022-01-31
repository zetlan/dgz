#name: [REDACTED]
#date: Jan-17-2022

import sys
#from random import choice


#constants for adjusting how much I care

#utilWin - super large because it for sure determines who wins the game.
#utilCorner - pretty large because if you've got corners, it's very easy to get lots of pieces
#utilMove - having more mobility is good
#utilCapture - eh
utilWin = 1e10
utilCorner = 1e5
utilMove = 1e2
utilCapture = 1e-1

pieceWarning = "`"
pieceUtilGoals = {
    'x': utilWin,
    'o': -utilWin
}
pieces = "xo"
dirs = [-11, -10, -9, -1, 1, 9, 10, 11]

def boolToSigned(boolVal):
    return int(boolVal) * 2 - 1

# Based on whether player is x or o, start an appropriate version of minimax
# that is depth-limited to "depth".  Return the best available move.
def find_next_move(board8, player, maxDepth):
    #return index10to8(choice(possible_moves(convert8to10(board8), player)))
    #generate the move tree
    gameTree = generateMoveTree(convert8to10(board8), player, maxDepth, -1e1001, 1e1001)

    #determine which move to play based on utility
    bestUtil = None
    bestMove = -1
    for child in gameTree["children"]:
        if (bestUtil == None or abs(child['utility'] - pieceUtilGoals[player]) < abs(bestUtil - pieceUtilGoals[player])):
            bestUtil = child['utility']
            bestMove = child["moveMade"]

    print([make_move(gameTree['board'], player, move) for move in possible_moves(gameTree['board'], player)])
    print([x['utility'] for x in gameTree['children']])
    print("expected utility is {} ({} is goal)".format(bestUtil, pieceUtilGoals[player]))
    return index10to8(bestMove)

def generateMoveTree(board10, player, maxDepth, alpha, beta):
    #start with the top node
    topNode = {
        'board': board10,
        'children': [],
        'utility': None,
    }

    #is it an end node? Because if so, calculate utility and return
    if (maxDepth <= 0):
        topNode['utility'] = utilityFor(board10)
        return topNode

    #recurse if incomplete
    possibles = possible_moves(board10, player)
    children = [make_move(board10, player, move) for move in possibles]
    nextToMove = invertPiece(player)


    #if there are no children, why?
    if (len(children) == 0):
        topNode['utility'] = utilityFor(board10)
        return topNode

    #loop through all children
    if (pieceUtilGoals[player] < 0):
        #for minimizers
        for c in range(len(children)):
            newNode = generateMoveTree(children[c], nextToMove, maxDepth - 1, alpha, beta)
            newNode['moveMade'] = possibles[c]
            topNode['children'].append(newNode)
            if (topNode['utility'] == None or newNode['utility'] < topNode['utility']):
                topNode['utility'] = newNode['utility']

            #ALPHA-BETA PRUNING
            beta = min(beta, topNode['utility'])
            if (beta > alpha):
                break
    else:
        #for maximizers
        for c in range(len(children)):
            newNode = generateMoveTree(children[c], nextToMove, maxDepth - 1, alpha, beta)
            newNode['moveMade'] = possibles[c]
            topNode['children'].append(newNode)
            if (topNode['utility'] == None or newNode['utility'] > topNode['utility']):
                topNode['utility'] = newNode['utility']

            #ALPHA-BETA PRUNING - the alpha and beta make it esoteric, but basically alpha is the maximum possible value, and beta is the minimum
            #if they overlap, it's time to leave, because the next bits of the tree will never be picked
            alpha = max(alpha, topNode['utility'])
            if (alpha > beta):
                break

    return topNode

def utilityFor(board10):
    #if it's a win state, calculation is easy
    if (board10.count('.') == 0):
        return utilWin * boolToSigned(board10.count(pieces[0]) > board10.count(pieces[1]))

    #corners
    utility = 0
    utility += utilCorner * (int(board10[11] == pieces[0]) + int(board10[18] == pieces[0]) + int(board10[81] == pieces[0]) + int(board10[88] == pieces[0]))
    utility -= utilCorner * (int(board10[11] == pieces[1]) + int(board10[18] == pieces[1]) + int(board10[81] == pieces[1]) + int(board10[88] == pieces[1]))
    
    #value mobility
    utility += (utilMove * len(possible_moves(board10, pieces[0]))) - (utilMove * len(possible_moves(board10, pieces[1])))

    #points
    utility += utilCapture * (board10.count(pieces[0]) - board10.count(pieces[1]))

    return utility



#converts an 8 by 8 board to a 10 by 10 board with a border. Scott border, even. The famous lawyer focused on intellectual property.
def convert8to10(board8x8):
    #main zone
    splitBoard = [pieceWarning + board8x8[q:q+8] + pieceWarning for q in range(0, 64, 8)]

    #top + bottom rows
    splitBoard.insert(0, pieceWarning * 10)
    splitBoard.append(pieceWarning * 10)
    return "".join(splitBoard)

#does the opposite of the above conversion
def convert10to8(board10x10):
    return "".join([board10x10[q+1:q+9] for q in range(10, 90, 10)])


def invertPiece(piece):
    return 'xo'['ox'.find(piece)]

def index8to10(ind):
    return 10 * (int(ind / 8) + 1) + (ind % 8) + 1

def index10to8(ind):
    return 8 * (int(ind / 10) - 1) + (ind % 10) - 1



#gives the possible moves a token can make on a 10x10 board, given a board state
def possible_moves(board10, token):
    opposite = invertPiece(token)
    moveList = []

    for c in range(1, 9):
        for r in range(1, 9):
            #if it's a blank
            nowIndex = (10 * c) + r
            if (board10[nowIndex] == "."):
                #loop through all directions, a similar check to make_move but don't change it, instead just append
                completed = False
                for dir in dirs:
                    if not completed:
                        run = True
                        trackInd = nowIndex + dir
                        if (board10[trackInd] != opposite):
                            run = False
                        while run:
                            trackInd += dir
                            if (board10[trackInd] == token):
                                run = False
                                moveList.append(nowIndex)
                                completed = True
                            elif (board10[trackInd] != opposite and board10[trackInd] != token):
                                run = False
    return moveList



#takes in a 10x10 board with an index on that board
#returns a new 10x10 board with a move made at the index
def make_move(board10, token, index):
    opposing = invertPiece(token)
    #make sure it's in valid forme
    board10 = board10[:index] + token + board10[index+1:]


    #apply changes in all directions
    for dir in dirs:
        run = True
        trackInd = index + dir
        #first tile check to break
        if (board10[trackInd] == opposing):
        
            #main loop
            while run:
                #iterate
                trackInd += dir
                #did you find a bad character? Escape
                if (not board10[trackInd] == opposing and not board10[trackInd] == token):
                    run = False
                elif (board10[trackInd] == token):
                    #run back through tiles, coloring them along the way
                    trackInd -= dir
                    while (trackInd != index):
                        board10 = board10[:trackInd] + token + board10[trackInd+1:]
                        trackInd -= dir
                    run = False
    return board10
 


#Strategy class, for access by the server
class Strategy():
    logging = True  # Optional
    def best_strategy(self, board, player, best_move, still_running):
        #print(board)
        for h in range(board.count(".")):  # No need to look more spaces into the future than exist at all
            #print("exploring layer {}".format(h))
            best_move.value = find_next_move(board, player, h+1)


# board = sys.argv[1]
# player = sys.argv[2]
# for h in range(board.count(".")):  # No need to look more spaces into the future than exist at all
#     print(find_next_move(board, player, h+1))

