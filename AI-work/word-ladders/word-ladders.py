#NAME: [REDACTED]
#PERIOD: 1
#DATE: September-23-2021

import sys
import time

fileNameWORDS = sys.argv[1]
fileNamePUZZLE = sys.argv[2]

wordsGraph = set()

chars = "abcdefghijklnopqrstuvwxyz"




"""
specifications:
1. accept 2 arguments (first is the name of the file containing words, second is the name of the file containing ladder puzzles)

2. read the words in from the file, make a dictionary, print time taken to create structure

3. read puzzles from the word ladder file and solve them witht he shortest path, ladders may be impossible!

4. display total time taken after solving all puzzles

5. total time must be less than two minutes



questions: 
1. how many words are singletons?

2. how many words are in the largest interconnected spot?

3a. how many clumps are there?

3b. how many clumps (excluding singletons and excluding large clump) are there?

4. what is the longest ideal path? and print that path!
"""

#returns a list of all possible words with one-letter differences
def createPossibleNeighbors(wordStr):
    neighborsList = set() #bad and I hate it

    #loop through all characters, changing one at a time
    for h in range(len(wordStr)):
        for c in chars:
            newStr = wordStr[0:h] + c + wordStr[h+1:]
            #if the changed word is valid, add it to the list of possible neighbors
            if newStr != wordStr and newStr in wordsGraph:
                neighborsList.add(newStr)
    return neighborsList

def makeGraph():
    with open(fileNameWORDS) as wordFile:
        #create initial words
        global wordsGraph
        wordsGraph = set([line.strip() for line in wordFile])
    
    
def removeSingletons():
    singletonCount = 0
    for word in list(wordsGraph):
        if len(createPossibleNeighbors(word)) == 0:
            #print("{} are s;ingleton".format(word))
            wordsGraph.remove(word)
            singletonCount += 1
    return singletonCount

def solveLadder(startStr, endStr):
    #problem declaration
    print("start: {}, end: {}".format(startStr, endStr))
    #commit BFS, but in both directions for maximum speed
    frontQueue = [startStr]
    frontVisited = {}

    backQueue = [endStr]
    backVisited = {}

    #iterate through both searches
    foundSolution = False
    while len(frontQueue) > 0 and not foundSolution:
        currentWord = frontQueue.pop(0)
        newChildren = createPossibleNeighbors(currentWord)
        #add children to queue
        frontQueue += newChildren
        #loop through children and assign parents
        for child in newChildren:
            if child not in frontVisited:
                frontVisited[child] = currentWord
                #print(len(frontVisited), currentWord, child)
                #if the new word is the goal, exit out
                if child == endStr:
                    foundSolution = True

    #if the path was never found, exit out
    if endStr not in frontVisited:
        print("goal not found ):")
        print("")
        return

    #printing the path!
    path = []
    ref = endStr

    while frontVisited[ref] != startStr:
        path.insert(0, frontVisited[ref])
        ref = frontVisited[ref]

    path.insert(0, startStr)
    path.append(endStr)
    print(path)
    #whitespace
    print("")
    return


#program
tStart = time.perf_counter()
makeGraph()
tEnd = time.perf_counter()
print("dictionary creation took {:.5f}s".format(tEnd - tStart))

tStart = time.perf_counter()
count = removeSingletons()
tEnd = time.perf_counter()
print("removed {} singletons in {:.5f}s".format(count, tEnd - tStart))

with open(fileNamePUZZLE) as puzzFile:
    lines = [line.strip().split(" ") for line in puzzFile]
    for line in lines:
        solveLadder(line[0], line[1])
