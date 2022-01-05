#Name: REDACTED
#Date: November-11-2021

import sys
import math
import time
import random

#a word on variable names.
#I'm not going to use your variable names. Soiry. I'd like my variable names to make sense to me, and to not be longer than necessary. 
#If I ever work in a group project, I'll adopt the convention of the group. However, since this is a singular project, I think it'll be fine.
#anyways here's N, sub block width, and sub block height.
puzzN = 9
psubW = 3
psubH = 3

#a single puzzle will use the first N characters of this
symbols = "123456789ABCDEFGHIJKLMNOPQRSTUVWXYZß¢ð£ƒþ∞ø¶π∑§◊∆¥"
pSymbols = ""
puzzle = []
pSolvingOrder = []
pSolvingIndex = 0



def createPuzzle(stringDat):
    global puzzN, psubH, psubW, pSymbols, pSolvingOrder, pSolvingIndex, puzzle
    #reset global state
    pSymbols = ""
    puzzle = []
    pSolvingOrder = []
    pSolvingIndex = 0

    puzzN = int(len(stringDat) ** 0.5)
    pSymbols = list(symbols[:puzzN])

    rootN = int(puzzN ** 0.5)
    #if it's a square, this is super easy. If not, specialty is required.
    if (rootN * rootN == puzzN):
        psubW = psubH = rootN
    else:
        #greatest factor greater than the square root
        psubW = [g for g in range(rootN+1, puzzN) if puzzN / g % 1 == 0][0]
        #greatest factor smaller than the square root
        psubH = [s for s in range(rootN, 0, -1) if puzzN / s % 1 == 0][0]

    #create actual puzzle object
    for c in range(len(stringDat)):
        #create an object to represent each index
        cellObj = {
            "value": "",
            "locked": False,
            "possibleValues": [] + pSymbols,
            "constraining": [],
            "neighborsV": set(),
            "neighborsH": set(),
            "neighborsB": set()
        }

        if stringDat[c] != ".":
            cellObj["value"] = stringDat[c]
            cellObj["locked"] = True
            #locked cells also don't get neighbors, they don't need them
        else:
            #figure out neighbors
            #vertical
            for d in range(c % puzzN, len(stringDat)-1, puzzN):
                if (d != c):
                    cellObj["neighborsV"].add(d)
            
            #horizontal
            for d in range(math.floor(c / puzzN) * puzzN, (math.floor(c / puzzN) + 1) * puzzN):
                if (d != c):
                    cellObj["neighborsH"].add(d)

            #all in sub-block
            subXY = [(c % puzzN) - (c % puzzN % psubW), math.floor(c / puzzN) - (math.floor(c / puzzN) % psubH)]
            for y in range(subXY[1], subXY[1] + psubH):
                for x in range(subXY[0], subXY[0] + psubW):
                    d = (y * puzzN) + x
                    if (d != c):
                        cellObj["neighborsB"].add(d)

        puzzle.append(cellObj)
    #use locked constraints to whittle away possible values
    for c in range(len(puzzle)):
        if puzzle[c]["locked"]:
            for d in list(puzzle[c]["neighborsV"]) + list(puzzle[c]["neighborsH"]) + list(puzzle[c]["neighborsB"]):
                if puzzle[c]["value"] in puzzle[d]["possibleValues"]:
                    puzzle[d]["possibleValues"].remove(puzzle[c]["value"])


def createSolveOrder():
    global pSolvingOrder
    #figure out what unlocked indeces are
    pSolvingOrder = []
    #if there are any indices that are already impossible don't bother
    for h in range(0, len(puzzle)):
        if (not puzzle[h]["locked"]) and (len(puzzle[h]["possibleValues"]) == 0):
            print("impossible puzzle!")
            return False

    #add indices in order of liberties, I want the most constrained ones to be solved for first to not waste substantial time
    for l in range(1, puzzN+1):
        for h in range(0, len(puzzle)):
            if (not puzzle[h]["locked"]) and (len(puzzle[h]["possibleValues"]) == l):
                pSolvingOrder.append(h)
    
    return True


def solve(puzzleLine):
    global pSolvingIndex
    #create and then solve puzzle
    createPuzzle(puzzleLine)
    #displayAsBoard_obj()

    if not createSolveOrder():
        return False

    #print(pSolvingOrder)

    #loop through each unlocked portion of the puzzle until they're all satisfied
    pSolvingIndex = 0
    #this code is terribly formatted but I wanted this all to be in one function so I don't have to deal with variable weirdness. 
    #A var keyword would be really nice.
    while (pSolvingIndex < len(pSolvingOrder)):
        hereNowIndex = pSolvingOrder[pSolvingIndex]
        #print(pSolvingIndex)
        #assign the next available value to the current
        #side note: I don't like python's syntax here. Given all the convienences it provides, it shocks me that there is not a simple function that returns an index without error
        try:
            valueIndex = puzzle[hereNowIndex]["possibleValues"].index(puzzle[hereNowIndex]["value"])
        except ValueError:
            valueIndex = -1
        
        if (valueIndex < len(puzzle[hereNowIndex]["possibleValues"]) - 1):
            #print('moving value up')
            #if there is a value, remove it before adding the new one
            if valueIndex != -1:
                solve_removeConstraint(hereNowIndex)
            #propogate constraints
            if not solve_addConstraint(hereNowIndex, puzzle[hereNowIndex]["possibleValues"][valueIndex + 1]):
                #if the constraint goes wrong, replace the same value, don't move on
                pSolvingIndex -= 1
                #print('constraint gone wrong')
        else:
            #if all the way through, clearly there's been a mistake and some previous value needs to change
            solve_removeConstraint(hereNowIndex)
            #print('all the way through, resetting')
            pSolvingIndex -= 2

        #move current forward
        pSolvingIndex += 1
        
        # if (random.random() < 0.1):
        #     displayAsBoard_obj()
        #     for n in range(7):
        #         print("")
        #     time.sleep(0.003)

        #if index is ever negative something's gone horribly wrong
        if pSolvingIndex < 0:
            print("something/s gone wrong!!")
            return

    #displayAsBoard_obj()
    displayAsLine()


def solve_addConstraint(index, value):
    ref = puzzle[index]
    ref["value"] = value
    #if an error is raised, undo it and go back
    if not solve_constrain_all(ref, value):
        return False
    return True

def solve_constrain_all(ref, value):
    #go through all neighbors and constrain them
    for d in ref["neighborsV"]:
        if not solve_constrain_one(d, ref, value):
            return False

    for d in ref["neighborsH"]:
        if not solve_constrain_one(d, ref, value):
            return False

    for d in ref["neighborsB"]:
        if not solve_constrain_one(d, ref, value):
            return False
    return True

def solve_constrain_one(index, reference, value):
    #don't care if it's locked
    if (puzzle[index]["locked"] == True):
        return (puzzle[index]["value"] != value)

    if value in puzzle[index]["possibleValues"]:
        puzzle[index]["possibleValues"].remove(value)
        reference["constraining"].append(index)
        #if that removal makes the puzzle invalid, report it
        if (len(puzzle[index]["possibleValues"]) < 1):
            return False
        #elif (len(puzzle[index]["possibleValues"]) == 1):
        #     if there's exactly one possible, move that index to directly after the index that's currently being worked on.
        #     this can cause the 'chaining' effect
        #     print("there is only 1. Moving", pSolvingOrder)
        #     pSolvingOrder.remove(index)
        #     pSolvingOrder.insert(pSolvingIndex+1, index)
        #     print(pSolvingOrder)


    return True

#removes the value from an index, and removes the constraint from the things it contrains
def solve_removeConstraint(index):
    for ind in puzzle[index]["constraining"]:
        #put the value back into the possible values array at the right position
        symbolIndex = pSymbols.index(puzzle[index]["value"])
        posValInd = 0
        while (posValInd < len(puzzle[ind]["possibleValues"]) and pSymbols.index(puzzle[ind]["possibleValues"][posValInd]) < symbolIndex):
            posValInd += 1
        puzzle[ind]["possibleValues"].insert(posValInd, puzzle[index]["value"])
    puzzle[index]["value"] = ""
    puzzle[index]["constraining"] = []
    return True










def displayAsBoard(line):
    lineStr = ""
    for c in range(len(line)):
        #if it's the first character add a spacer
        poshInSubBlock = math.floor(c / puzzN) % psubH
        if (c % puzzN == 0):
            if (poshInSubBlock == 0):
                print("")

        #add the character to the string
        lineStr += line[c]

        #if it's moving to the next width sub-block, add a spacer
        if ((c % puzzN) % psubW == psubW - 1):
            lineStr += " "

        #if it's the last character of a line print the character
        if (c % puzzN == puzzN - 1):
            print(lineStr)
            lineStr = ""

    #extra spacer at the end
    print("")
    return

def displayAsBoard_obj():
    lineStr = ""
    for c in range(len(puzzle)):
        #if it's the first character add a spacer
        poshInSubBlock = math.floor(c / puzzN) % psubH
        if (c % puzzN == 0):
            if (poshInSubBlock == 0):
                print("")

        #add the character to the string
        if (puzzle[c]["value"] != ""):
            lineStr += puzzle[c]["value"]
        else:
            lineStr += "."

        #if it's moving to the next width sub-block, add a spacer
        if ((c % puzzN) % psubW == psubW - 1):
            lineStr += " "

        #if it's the last character of a line print the character
        if (c % puzzN == puzzN - 1):
            print(lineStr)
            lineStr = ""

    #extra spacer at the end
    print("")
    return

def displayAsInstance_str(line):
    possibleSymbols = list(pSymbols)

    #create dictionary
    instanceNums = {}
    instanceNums["[empty]"] = 0
    for sym in possibleSymbols:
        instanceNums[sym] = 0

    #each time there's a symbol, add to that
    for ch in line:
        if (ch == "."):
            instanceNums["[empty]"] += 1
        else:
            instanceNums[ch] += 1

    print("")
    print("INSTANCE BOARD REPRESENTATION")
    for inst in instanceNums:
        print(inst + " : " + str(instanceNums[inst]))
    print("")
    return

def displayAsInstance_obj(puzzle):
    return

def displayAsLine():
    #displays the current puzzle as a line
    outputStr = ""
    for index in puzzle:
        if index["value"] == "":
            outputStr += "."
        else:
            outputStr += index["value"]

    print(outputStr)
    return







#main program
fileName = sys.argv[1]
#open file and read each puzzle
with open(fileName) as sudokuFile:
    lineNum = 0
    for line in sudokuFile:
        #if (lineNum == 0):
        solve(line.replace("\n", ""))
            #displayAsBoard_obj()
        lineNum += 1