#NAME: [REDACTED]
#PERIOD: 1
#DATE: September-23-2021

import sys
import time

fileNameWORDS = sys.argv[1]
fileNamePUZZLE = sys.argv[2]

wordsGraph = {}

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
    chars = "abcdefghijklmnopqrstuvwxyz"
    neighborsList = []

    for h in range(len(wordStr)):
        for c in chars:
            newStr = wordStr[0:h] + c + wordStr[h+1:]
            if newStr != wordStr and newStr in wordsGraph:
                neighborsList.append(newStr)

    return neighborsList

def makeDictionary():
    with open(fileNameWORDS) as wordFile:
        #create initial words
        lines = [line.strip() for line in wordFile]
        for word in lines:
            wordsGraph[word] = []

        #create attached words
        for word in wordsGraph:
            wordsGraph[word] = createPossibleNeighbors(word)
    
    
def removeSingletons():
    singletonCount = 0
    for word in list(wordsGraph):
        if wordsGraph[word] == []:
            #print("{} are s;ingleton".format(word))
            wordsGraph.pop(word)
            singletonCount += 1
    return singletonCount

def solveLadder(startStr, endStr):
    #commit DFS
    return


#program
tStart = time.perf_counter()
makeDictionary()
tEnd = time.perf_counter()
print("dictionary creation took {:.5f}s".format(tEnd - tStart))

tStart = time.perf_counter()
count = removeSingletons()
tEnd = time.perf_counter()
print("removed {} singletons in {:.5f}s".format(count, tEnd - tStart))
