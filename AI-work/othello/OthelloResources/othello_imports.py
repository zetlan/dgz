#NAME: [REDACTED]
#DATE: December-16-2021


#naming is to meet the specifications. I would name them differently, but hey, working with other people's code happens sometimes.

pieceWarning = "`"
pieces = "xo"
dirs = [-11, -10, -9, -1, 1, 9, 10, 11]

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
    return pieces[(pieces.find(piece) + 1) % 2]





#gives the possible moves a token can make, given a board state
def possible_moves(board, token):
    print(board)
    #make sure it's in valid forme
    if (len(board) == 64):
        board = convert8to10(board)

    opposite = invertPiece(token)
    moveList = []

    for c in range(1, 9):
        for r in range(1, 9):
            #if it's a blank
            nowIndex = (10 * c) + r
            if (board[nowIndex] == "."):
                #loop through all directions, a similar check to make_move but don't change it, instead just append
                completed = False
                for dir in dirs:
                    if not completed:
                        run = True
                        trackInd = nowIndex + dir
                        if (board[trackInd] != opposite):
                            run = False
                        while run:
                            trackInd += dir
                            if (board[trackInd] == token):
                                run = False
                                moveList.append((8 * (c-1)) + (r-1))
                                completed = True
                            elif (board[trackInd] != opposite and board[trackInd] != token):
                                run = False
    return moveList



#returns a new board with a move made at the index
def make_move(board, token, index):
    #figure out true index when converted to 10x10
    #print(index, 10 * (int(index / 8) + 1) + 1 + (index % 8))
    index = 10 * (int(index / 8) + 1) + 1 + (index % 8)
    opposing = invertPiece(token)
    #make sure it's in valid forme
    board = convert8to10(board)
    board = board[:index] + token + board[index+1:]


    #apply changes in all directions
    for dir in dirs:
        run = True
        trackInd = index + dir
        #first tile check to break
        if (board[trackInd] == opposing):
        
            #main loop
            while run:
                #iterate
                trackInd += dir
                #did you find a bad character? Escape
                if (not board[trackInd] == opposing and not board[trackInd] == token):
                    run = False
                elif (board[trackInd] == token):
                    #run back through tiles, coloring them along the way
                    trackInd -= dir
                    while (trackInd != index):
                        board = board[:trackInd] + token + board[trackInd+1:]
                        trackInd -= dir
                    run = False
    return convert10to8(board)