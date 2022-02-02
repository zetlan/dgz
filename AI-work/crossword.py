import sys; args = sys.argv[1:]
myLines = open(args[0], 'r').read().splitlines()
import re

#shouldn't have any reference to file i/o after this line
tags = myLines.split(" ")
crossword = []

charBlocking = "#"
charEmpty = "-"

def makeCrossword():
    size = tags[0].split("x")
    numBlocks = tags[1]
    #make the initial structure
    for f in range(int(size[0])):
        crossword.append([])
        for g in range(int(size[1])):
            crossword[f].append(charEmpty)

    #read all other tags in as words to be placed
    for q in range(2, len(tags)):
        #parse the tag first
        #first character tells whether it's horizontal or vertical
        isHorizontal = tags[q][0] == "H"
        tags[q] = tags[q][1:]

        #[num]x[num] for start position
        startCoords = re.findall("[0-9]+", tags[q])
        letterBits = re.split('[a-zA-Z]+', tags[q])[1]

        #actual contents to place
    return



def printCrossword(crossword):
    for line in crossword:
        #coalesce all the tiles on a row into one line, then print one at a time
        print(" ".join([str(a) for a in line]))


x = 1 #[NAME REDACTED], Period 1, 2023