#NAME: [REDACTED]
#PERIOD: 1
#DATE: September-23-2021

import sys
import time

fileNameWORDS = sys.argv[1]
fileNamePUZZLE = sys.argv[2]

wordsGraph = set()
counter = 0




chars = "abcdefghijklmnopqrstuvwxyz"
specialCheckStr = "this string will never be a word, but is useful for checking"




"""
specifications:
1. accept 2 arguments (first is the name of the file containing words, second is the name of the file containing ladder puzzles)

2. read the words in from the file, make a dictionary, print time taken to create structure

3. read puzzles from the word ladder file and solve them with the shortest path, ladders may be impossible!

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
    neighborsList = []

    #loop through all characters, changing one at a time
    for h in range(len(wordStr)):
        for c in chars:
            newStr = wordStr[0:h] + c + wordStr[h+1:]
            #if the changed word is valid, add it to the list of possible neighbors
            if newStr != wordStr and newStr in wordsGraph:
                neighborsList.append(newStr)
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

#creates clumps
def defineClumps():
    maxClumpParams = [0, ""]
    currentClumpParams = [0, ""]
    clumpNum = 0
    clumpGraph = {}

    #get a data structure easier for clump creation
    for word in wordsGraph:
        clumpGraph[word] = 0

    #loop through all words
    for word in wordsGraph:
        #if it hasn't been nabbed yet
        if clumpGraph[word] == 0:
            #define the clump params
            currentClumpParams[0] = 1
            currentClumpParams[1] = word
            clumpNum += 1
            clumpGraph[word] = clumpNum

            #do BFS to get all connected words
            queue = [word]
            visited = set()
            visited.add(word)
            while len(queue) > 0:
                currentWord = queue.pop(0)
                neighbors = createPossibleNeighbors(currentWord)
                for newWord in neighbors:
                    #marks words as part of that same clump
                    if newWord not in visited:
                        currentClumpParams[0] += 1
                        clumpGraph[newWord] = clumpNum
                        visited.add(newWord)
                        queue.append(newWord)

        #update max clump if the current clump is large enough
        if currentClumpParams[0] > maxClumpParams[0]:
            maxClumpParams[0] = currentClumpParams[0]
            maxClumpParams[1] = currentClumpParams[1]

    print("the largest clump has {} words, and contains {}".format(maxClumpParams[0], maxClumpParams[1]))
    return [clumpNum, maxClumpParams]

#takes in pathParams of [number of words, word in the path] and returns the longest path between two words in the graph
def findLongestPath(pathParams):
    print("starting from word %s" % pathParams[1])
    longestPathDat = [0, "", ""]
    #do BFS. On the way, collect path info for all the words
    wordsInClump = set()
    queue = [pathParams[1]]
    wordsInClump.add(pathParams[1])

    while len(queue) > 0:
        currentWord = queue.pop(0)

        #do length of this word's path
        wordPathMaxDat = bfsHeight(currentWord)
        if wordPathMaxDat[0] > longestPathDat[0]:
            longestPathDat[0] = wordPathMaxDat[0]
            longestPathDat[1] = currentWord
            longestPathDat[2] = wordPathMaxDat[1]
            print("for now, longest path is {} words...".format(wordPathMaxDat[0]))

        neighbors = createPossibleNeighbors(currentWord)
        for newWord in neighbors:
            #marks words as part of that same clump
            if newWord not in wordsInClump:
                wordsInClump.add(newWord)
                queue.append(newWord)
    return longestPathDat

#gives you the max. height of the BFS tree that this word creates
def bfsHeight(word):
    maxHeightDat = [0, ""]
    heightDict = {}
    heightDict[word] = 0
    queue = [word]

    #this program has so many instances of the BFS algorithm but they're all slightly different and have different things inserted, so I can't duplicate them. It's a shame really
    while (len(queue) > 0):
        cWord = queue.pop(0)
        nebers = createPossibleNeighbors(cWord)
        for ne in nebers:
            if (ne not in heightDict):
                queue.append(ne)
                heightDict[ne] = heightDict[cWord] + 1
                if (heightDict[ne] > maxHeightDat[0]):
                    maxHeightDat[0] = heightDict[ne]
                    maxHeightDat[1] = ne
    return maxHeightDat

def solveLadder(startStr, endStr):
    #problem declaration
    print("start: {}, end: {}".format(startStr, endStr))
    #commit BFS
    queue = [startStr]
    visited = {}
    visited[startStr] = specialCheckStr

    foundSolution = False
    while len(queue) > 0 and foundSolution == False:
        #update current word
        currentWord = queue.pop(0)
        newChildren = createPossibleNeighbors(currentWord)
        #add children to queue
        for child in newChildren:
            if child not in visited:
                queue.append(child)
                #assign parentage
                visited[child] = currentWord
                #if the new word is the goal or connects to the goal, exit out
                if child == endStr:
                    foundSolution = child

    #if the path was never found, exit out
    if foundSolution == False:
        print("goal not found ):")
        print("")
        return

    #printing the path!
    path = []
    ref = endStr

    while visited[ref] != startStr:
        path.insert(0, visited[ref])
        ref = visited[ref]

    path.insert(0, startStr)
    path.append(endStr)
    print(path)
    #whitespace
    print("")
    return


#program
tStartTrue = time.perf_counter()

tStart = time.perf_counter()
makeGraph()
tEnd = time.perf_counter()
print("dictionary creation took {:.5f}s".format(tEnd - tStart))

tStart = time.perf_counter()
count = removeSingletons()
tEnd = time.perf_counter()
print("removed {} singletons in {:.5f}s".format(count, tEnd - tStart))

count2 = defineClumps()
print("there are {} total clumps, but only {} clumps when exluding singletons and the largest clump".format(count2[0] + count, count2[0] - 1))

#these three below lines will most likely make the program take more than two minutes. Because of this I have commented them out, but they do run, and produce a solution in roughly 3 minutes.
# count2 = findLongestPath(count2[1])
# print("the longest path is {} steps long, from {} to {}.".format(count2[0], count2[1], count2[2]))
# solveLadder(count2[1], count2[2])
print("")
with open(fileNamePUZZLE) as puzzFile:
    lines = [line.strip().split(" ") for line in puzzFile]

    #main solving
    tStart = time.perf_counter()
    for line in lines:
        solveLadder(line[0], line[1])
    tEnd = time.perf_counter()
    print("solved ladders in {:.5f}s".format(tEnd - tStart))


tEndTrue = time.perf_counter()
print("total time is {:.5f}s".format(tEndTrue - tStartTrue))