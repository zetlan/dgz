import sys; args = sys.argv[1:]
import random;
#myLines = open(args[0], 'r').read().splitlines()
tags = args
import re

#shouldn't have any reference to file i/o after this line
#tags = myLines.split(" ")
crossword = []

charBlocking = "#"
charEmpty = "-"

def makeCrossword():
    global tags, crossword
    size = tags[0].split("x")
    size[0] = int(size[0])
    size[1] = int(size[1])
    centerX = (size[1] - 1) / 2
    centerY = (size[0] - 1) / 2
    numBlocks = int(tags[1])
    tags = tags[2:]
    #make the initial structure
    crossword = initPuzzle(size[1], size[0])

    #if it's all blocks, return all blocks
    if (size[0] * size[1] == numBlocks):
        for f in range(size[0]):
            for g in range(size[1]):
                crossword[f][g] = charBlocking
        return

    #since all blocks are rotationally symmetric, if both sizes are odd and there's an odd number of blocks (one can't be paired) the center must be filled in
    if (size[0] % 2 == 1 and size[1] % 2 == 1 and numBlocks % 2 == 1):
        crossword[centerY][centerX] = charBlocking

    #read all other tags in as words to be placed
    initTags(crossword, tags)

    #mirror already-existing blocks
    for y in range(len(crossword)):
        for x in range(len(crossword[y])):
            if (crossword[y][x] == charBlocking):
                crossword[int(centerY + (centerY - y))][int(centerX + (centerY - x))] = charBlocking

    numBlocksCurrent = sum([cross.count(charBlocking) for cross in crossword])

    #add more blocks if necessary
    while (numBlocksCurrent < numBlocks and addBlockTo(crossword)):
        numBlocksCurrent += 2
    return



def addBlockTo(crossword):
    emptyCount = sum([cross.count(charEmpty) for cross in crossword])
    spotsTried = []
    thisSpot = [0, 0]
    #choose a random spot
    while (crossword[thisSpot[0]][thisSpot[1]] != charEmpty):
        spotsTried.append(thisSpot)

        #if self has gone through all the empty spots and still no valid character, give up
        if (len(spotsTried) >= emptyCount):
            return False

        #get a new spot to try
        thisSpot = [random.randint(0, len(crossword)-1), random.randint(0, len(crossword[0])-1)]
        while (thisSpot in spotsTried):
            thisSpot = [random.randint(0, len(crossword)-1), random.randint(0, len(crossword[0])-1)]

    #place blocker at the spot as well as it's opposite
    centerX = (len(crossword[0]) - 1) / 2
    centerY = (len(crossword) - 1) / 2
    crossword[thisSpot[0]][thisSpot[1]] = charBlocking
    crossword[int(centerY + (centerY - thisSpot[0]))][int(centerX + (centerY - thisSpot[1]))] = charBlocking
    return True

def giveFlippedPos(crossword, yxPieceArr):
    centerX = (len(crossword[0]) - 1) / 2
    centerY = (len(crossword) - 1) / 2
    return [int(centerY + (centerY - yxPieceArr[0])), int(centerX + (centerY - yxPieceArr[1]))]

def initPuzzle(width, height):
    puzzle = []
    for f in range(height):
        puzzle.append([])
        for g in range(width):
            puzzle[f].append(charEmpty)
    return puzzle

def initTags(crossword, tags):
    for q in range(len(tags)):
        #parse the tag first
        #first character tells whether it's horizontal or vertical
        isHorizontal = tags[q][0] == "H" or tags[q][0] == "h"

        #[num]x[num] for start position
        startCoords = re.findall("[0-9]+", tags[q])
        startCoords[0] = int(startCoords[0])
        startCoords[1] = int(startCoords[1])

        #actual contents
        letterBits = re.split('[0-9]+', tags[q])[2]

        #placing
        if isHorizontal:
            #if the bounds of the word exclude any words from being placed, fill in with blocks
            if (letterBits[0] == charBlocking and startCoords[1] < 3):
                for v in range(startCoords[1]):
                    crossword[startCoords[0]][v] = charBlocking
            # if (letterBits[len(letterBits)-1] == charBlocking and startCoords[1] + len(letterBits) > len(crossword[0]) - 3):
            #     for v in range(startCoords[1] + len(letterBits), len(crossword[0])):
            #         crossword[startCoords[0]][v] = charBlocking
            for v in range(len(letterBits)):
                crossword[startCoords[0]][startCoords[1] + v] = letterBits[v]
        else:
            for v in range(len(letterBits)):
                crossword[startCoords[0] + v][startCoords[1]] = letterBits[v]
    return



def floodFills(crossword):
    #find the first available space
    takenSquares = []
    for y in range(len(crossword)):
        for x in range(len(crossword[y])):
            if (crossword[y][x] == charEmpty):
                takenSquares.append([x, y])
                break
        if (len(takenSquares) > 0):
            break
    
    #flood fill recusively
    floodFills_tiny(crossword, takenSquares)

    #if there are fewer flooded squares than empty squares, it's gone wrong.
    expectedVal = sum([cross.count(charEmpty) for cross in crossword])
    return (expectedVal == len(takenSquares))


def floodFills_tiny(crossword, takenSquares, currentSquare):
    for dir in [[0, -1], [0, 1], [-1, 0], [1, 0]]:
        newSquare = [currentSquare[0] + dir[0] + currentSquare[1] + dir[1]]
        if (newSquare[0] >= 0 and newSquare[0] < len(crossword[0]) and newSquare[1] >= 0 and newSquare[1] < len(crossword)):
            takenSquares.append(newSquare)
            floodFills_tiny(crossword, takenSquares, newSquare)


def printCrossword(crossword):
    for line in crossword:
        #coalesce all the tiles on a row into one line, then print one at a time
        print(" ".join([str(a) for a in line]))

def processBlock(crossword, x, y, banDirection):
    return


makeCrossword()
printCrossword(crossword)


x = 1 #Davis Zetlan, Period 1, 2023