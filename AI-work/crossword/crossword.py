import sys; args = sys.argv[1:]
#myLines = open(args[0], 'r').read().splitlines()
tags = args
import re

#shouldn't have any reference to file i/o after this line
#tags = myLines.split(" ")
crossword = []

charBlocking = "#"
charEmpty = "-"

def makeCrossword():
    global tags
    size = tags[0].split("x")
    size[0] = int(size[0])
    size[1] = int(size[1])
    centerX = (size[1] - 1) / 2
    centerY = (size[0] - 1) / 2
    numBlocks = int(tags[1])
    tags = tags[2:]
    #make the initial structure
    for f in range(size[0]):
        crossword.append([])
        for g in range(size[1]):
            crossword[f].append(charEmpty)

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
        for v in range(len(letterBits)):
            if isHorizontal:
                crossword[startCoords[0]][startCoords[1] + v] = letterBits[v]
            else:
                crossword[startCoords[0] + v][startCoords[1]] = letterBits[v]

    #mirror already-existing blocks
    for y in range(len(crossword)):
        for x in range(len(crossword[y])):
            if (crossword[y][x] == charBlocking):
                crossword[int(centerY + (centerY - y))][int(centerX + (centerY - x))] = charBlocking

    numBlocksCurrent = sum([cross.count(charBlocking) for cross in crossword])

    #add more blocks if necessary
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


def floodFills_tiny(crossword, takenSquares):
    return


def printCrossword(crossword):
    for line in crossword:
        #coalesce all the tiles on a row into one line, then print one at a time
        print(" ".join([str(a) for a in line]))


makeCrossword()
printCrossword(crossword)


x = 1 #Davis Zetlan, Period 1, 2023