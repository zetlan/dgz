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
        crossword[int(centerY)][int(centerX)] = charBlocking

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
    centerX = (len(crossword[0]) - 1) / 2
    centerY = (len(crossword) - 1) / 2

    spotsAvail = []
    achieved = False
    currentInd = -1

    #get all available spots to possibly put a block in
    for x in range(3, len(crossword[0])-3):
        for y in range(3, len(crossword)-3):
            if (crossword[y][x] == charEmpty and crossword[int(centerY + (centerY - y))][int(centerX + (centerX - x))] == charEmpty):
                spotsAvail.append([x, y])

    while not achieved:
        if (len(spotsAvail) < 1):
            return False
        
        currentInd = random.randint(0, len(spotsAvail)-1)
        crossword[spotsAvail[currentInd][1]][spotsAvail[currentInd][0]] = charBlocking
        flippedPos = [int(centerX + (centerX - spotsAvail[currentInd][0])), int(centerY + (centerY - spotsAvail[currentInd][1]))]
        crossword[flippedPos[1]][flippedPos[0]] = charBlocking

        achieved = floodFills(crossword)

        if achieved:
            return True
        else:
            crossword[spotsAvail[currentInd][1]][spotsAvail[currentInd][0]] = charEmpty
            crossword[flippedPos[1]][flippedPos[0]] = charEmpty
            val1 = spotsAvail[currentInd]
            val2 = spotsAvail.index(flippedPos)
            spotsAvail.remove(val1)
            spotsAvail.remove(val2)

def blockPositionIsValid(crossword, y, x):
    if (crossword[y][x] != charEmpty):
        return False

    flippedPos = giveFlippedPos(crossword, [y, x])
    return (crossword[flippedPos[0]][flippedPos[1]] == charEmpty)


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
                if (letterBits[v] == charBlocking):
                    processBlock(crossword, startCoords[1] + v, startCoords[0])
        else:
            for v in range(len(letterBits)):
                crossword[startCoords[0] + v][startCoords[1]] = letterBits[v]
                if (letterBits[v] == charBlocking):
                    processBlock(crossword, startCoords[1], startCoords[0] + v)
    return



def floodFills(crossword):
    #find the first available space
    freeSquares = []
    seeds = []
    for y in range(len(crossword)):
        for x in range(len(crossword[y])):
            if (crossword[y][x] == charEmpty):
                freeSquares.append([x, y])
                seeds.append([x, y])
                break
        if (len(freeSquares) > 0):
            break
    
    #flood fill recusively
    while (len(seeds) > 0):
        #the word 'dir' is banned.
        #I love programming for a grade
        for dri in [[0, -1], [0, 1], [-1, 0], [1, 0]]:
            newSquare = [seeds[0][0] + dri[0], seeds[0][1] + dri[1]]
            if (newSquare[0] >= 0 and newSquare[0] < len(crossword[0]) and newSquare[1] >= 0 and newSquare[1] < len(crossword)):
                if (newSquare not in freeSquares):
                    freeSquares.append(newSquare)
                    seeds.append(newSquare)
        seeds.pop(0)

    #if there are fewer flooded squares than empty squares, it's gone wrong.
    expectedVal = sum([cross.count(charEmpty) for cross in crossword])
    return (expectedVal == len(freeSquares))


def printCrossword(crossword):
    for line in crossword:
        #coalesce all the tiles on a row into one line, then print one at a time
        print(" ".join([str(a) for a in line]))

#takes a block and adds more blocks if necessary
def processBlock(crossword, x, y):
    #if it's closer than 3 away from the edge, fill that bit in with blocks
    xVal = int(x > len(crossword[0]) - 3) - int(x < 3)
    yVal = int(y > len(crossword) - 3) - int(y < 3)

    #no action needed?
    if (xVal == 0 and yVal == 0):
        return

    #corner case
    if (xVal != 0 and yVal != 0):
        valArr = [xVal, yVal]
        #convert x and y ternary values into indices for the array
        valArr[0] = [((valArr[0] + 1) / 2) * x, int(valArr[0] == -1) * len(crossword[0]) + int(valArr[0] == 1) * x]
        valArr[1] = [((valArr[1] + 1) / 2) * y, int(valArr[1] == -1) * len(crossword) + int(valArr[1] == 1) * y]

        for i in range(valArr[0][0], valArr[0][1]):
            for j in range(valArr[1][0], valArr[1][1]):
                crossword[j][i] = charBlocking
        return

    #edges
    if (xVal != 0):
        for i in range(((valArr[0] + 1) / 2) * x, int(valArr[0] == -1) * len(crossword[0]) + int(valArr[0] == 1) * x):
            crossword[y][i] = charBlocking
        return

    if (yVal != 0):
        for j in range(((valArr[1] + 1) / 2) * y, int(valArr[1] == -1) * len(crossword) + int(valArr[1] == 1) * y):
            crossword[j][x] = charBlocking
        return


makeCrossword()
printCrossword(crossword)


x = 1 #Davis Zetlan, Period 1, 2023