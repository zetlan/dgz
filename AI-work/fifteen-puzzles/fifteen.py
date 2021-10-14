#NAME: 1, [REDACTED]
import sys
# import os
import time
import math
fileName = sys.argv[1]
checkStr = "this string won't appear in a regular puzzle."
#time in seconds to halt self after
timeCutoff = 120
t0 = time.perf_counter()


#uses the time cutoff to tell the program whether it should cease. I put this in the main loop of all my algorithms so it doesn't run too long.
def shouldEscape():
    t1 = time.perf_counter()
    if t1 - t0 > timeCutoff:
        print("OUT OF TIME!")
        return True
    return False

#takes in a board state and determines a heuristic cost for it
def determineCost(boardState, targetState):
    incorrect = 0
    #heuristic is the number of squares that are wrong
    for c in range(len(boardState)):
        incorrect += int(boardState[c] == targetState[c])
    #split string, compare to targetState
    return incorrect

#takes size and stringDat and prints it to the console as a grid
def print_puzzle(size, stringDat):
    puzzLines = [stringDat[c:c+size] for c in range(0, len(stringDat), size)]
    for line in puzzLines:
        #python makes me feel like I'm lost at sea, slowly swimming in any direction while the waves buffet me around.
        #anyways, I put spaces between each character by splitting the string and then putting it back together with whitespace inside.
        splitLn = list(line)
        print(" ".join(splitLn))

def find_goal(boardState):
    #sorted will put a period at the start, so I have to put it at the end manually
    buffer1 = sorted(boardState)
    del buffer1[0]
    return ''.join(buffer1) + '.'




#returns the list of possible board states you can get from the input board state
def get_children(boardState, banThisState):
    #convert the string to a list, get the position of the dot
    splitStruct = list(boardState)
    spacePos = boardState.find('.')
    sideLen = int(len(splitStruct) ** 0.5)
    children = []

    #4 possible moves: the -1 swap, the +1 swap, the -n swap, and the +n swap. 
    #-1 swap is legal if the space isn't at the left edge
    if spacePos % sideLen != 0:
        splitStruct2 = splitStruct.copy()
        [splitStruct2[spacePos], splitStruct2[spacePos-1]] = [splitStruct2[spacePos-1], splitStruct2[spacePos]]
        children.append("".join(splitStruct2))

    #+1 swap is same but for right edge
    if spacePos % sideLen != sideLen - 1:
        splitStruct2 = splitStruct.copy()
        [splitStruct2[spacePos], splitStruct2[spacePos+1]] = [splitStruct2[spacePos+1], splitStruct2[spacePos]]
        children.append("".join(splitStruct2))

    #-n swap works if not at the top
    if spacePos > sideLen:
        splitStruct2 = splitStruct.copy()
        [splitStruct2[spacePos], splitStruct2[spacePos-sideLen]] = [splitStruct2[spacePos-sideLen], splitStruct2[spacePos]]
        children.append("".join(splitStruct2))

    #+n swap, not at the bottom
    if spacePos < len(splitStruct) - sideLen:
        splitStruct2 = splitStruct.copy()
        [splitStruct2[spacePos], splitStruct2[spacePos+sideLen]] = [splitStruct2[spacePos+sideLen], splitStruct2[spacePos]]
        children.append("".join(splitStruct2))

    if banThisState in children:
        children.remove(banThisState)

    #sort children by cost
    #for a in range(len(children)):
    children.sort()
    #return children
    return children


#search functions
#takes in a board state and returns the list of possible board states reached from that state
def noGoalBFS(boardState):
    #create list of visited states
    visited = []
    visited.append(boardState)

    #queue creation
    activeQueue = []
    activeQueue.append(boardState)

    #actual algorithm
    while len(activeQueue) > 0:
        #take the first element of the queue, remove and grab its children
        potentialKids = get_children(activeQueue.pop(0))
        #loop through all potential children, if it's not already in the visited list append it
        for child in potentialKids:
            if child not in visited:
                visited.append(child)
                activeQueue.append(child)
                # if len(visited) % 50 == 0:
                #     print("found {} states".format(len(visited)))


    print("complete state printout: ", visited)

#gives the manhattan (x + y) distance between all tiles and their solved states
def giveManhattanDist(puzzle, solvedState, puzzleSize):
    #convert puzzle into indexes when solved EXCEPT FOR PERIOD!! NO puncutation!
    indeces = []
    distance = 0
    for char in puzzle:
        if char != ".":
            indeces.append(solvedState.find(char))
        else:
            indeces.append(len(indeces))


    #now that we have indexes + indexes when solved, can use that to calculate distances
    for k in range(len(indeces)):
        #x distance
        distance += abs((k % puzzleSize) - (indeces[k] % puzzleSize))
        #y distance
        distance += abs(math.floor(k / puzzleSize) - math.floor(indeces[k] / puzzleSize))
    return distance

#takes in a board state and returns number of steps required
def goalBFS(boardState):
    goalState = find_goal(boardState)
    #don't do search if already at the goal
    if (goalState == boardState):
        return 0

    #do BFS
    visited = {}
    visited[boardState] = checkStr

    activeQueue = [boardState]
    solutionFound = False
    while len(activeQueue) > 0 and not solutionFound:
        #check for time
        if (shouldEscape()):
            return -1

        current = activeQueue.pop(0)
        for child in get_children(current, visited[current]):
            if child == goalState:
                solutionFound = True
            if child not in visited:
                visited[child] = current
                activeQueue.append(child)

        

    #if no solution could be found, return -1
    if not solutionFound:
        return -1

    #count steps
    steps = 0
    ref = goalState
    while visited[ref] != checkStr:
        steps += 1
        ref = visited[ref]
    return steps


#like goal BFS, but prints the path taken to reach the goal
def goalBFSWithPath(boardState):
    goalState = find_goal(boardState)

    #do BFS
    visited = {}
    visited[boardState] = checkStr

    activeQueue = [boardState]
    solutionFound = False
    while len(activeQueue) > 0 and not solutionFound:
        current = activeQueue.pop(0)
        for child in get_children(current, visited[current]):
            if child == goalState:
                solutionFound = True
            if child not in visited:
                visited[child] = current
                activeQueue.append(child)

        

    #if no solution could be found, return -1
    if not solutionFound:
        return -1

    #count steps and make path
    path = []
    steps = 0
    ref = goalState
    while visited[ref] != checkStr:
        path.insert(0, visited[ref])
        steps += 1
        ref = visited[ref]
        
    print("takes {} step{}".format(steps, "" + ("s" * (steps != 1))))
    for node in path:
        print_puzzle(int(len(node) ** 0.5), node)
        print("")


def limitedDFS(puzzle, depthLimit):
    goalState = find_goal(puzzle)

    #do not if already when the has
    if (puzzle == goalState):
        return 0

    #length of ancestors can also be used as depth
    ancestors = [[puzzle, -1]]

    #loop until gone through the whole tree
    while len(ancestors) > 0:
        #if not at the depth limit, add one to the chain
        if (len(ancestors) < depthLimit):
            #get parent
            parent = ancestors[len(ancestors)-1]
            parent[1] += 1

            #get possible children, ban parent if there is one
            if len(ancestors) > 1:
                possibleChildren = get_children(parent[0], ancestors[len(ancestors)-2][0])
            else:
                possibleChildren = get_children(parent[0], None)

            
            if (parent[1] < len(possibleChildren)):
                #out of possible children, select the one that the indicator says to
                ancestors.append([possibleChildren[parent[1]], -1])

                #if the added one is the goal, cool! Return that
                if possibleChildren[parent[1]] == goalState:
                    return (len(ancestors) - 1)
            else:
                #if all available children have been selected, remove self as well
                ancestors.pop()
        else:
            #at the depth limit, remove node from the list, it cannot propogate children
            ancestors.pop()

    return -1

def iterativeDFS(puzzle):
    #loop forever until solved
    n = 1
    while True:
        if (shouldEscape()):
            return -1
        result = limitedDFS(puzzle, n)
        if (result != -1):
            return result

        #repeat again with higher n
        n += 1

def hasGoodParity(puzzle):
    sideLength = len(puzzle) ** 0.5

    #check for number of out-of-order pairs
    outOfOrders = 0
    #first get indexes of all pairs
    goalBoard = find_goal(puzzle)
    indeces = []
    for char in puzzle:
        #I will not have any GOSH DARN puncutation messing with my counting. 
        if char != ".":
            indeces.append(goalBoard.find(char))

    for a in range(0, len(indeces)):
        for b in range(a, len(indeces)):
            outOfOrders += int(indeces[b] < indeces[a])

    #if it's odd, can do the easy check of how many out-of-order pairs there are
    if (sideLength % 2 == 1):
        return (outOfOrders % 2 == 0)

    #if it's even, the check is a bit harder

    blankRow = math.floor(puzzle.find(".") / sideLength)

    #if the blank tile is in an odd numbered row, the parity check is the same as odd side lengths.
    if (blankRow % 2 == 1):
        return (outOfOrders % 2 == 0)
    
    #otherwise, the check is flipped.
    return (outOfOrders % 2 == 1)


def aStar(puzzle):
    puzzleSize = len(puzzle) ** 0.5
    goalState = find_goal(puzzle)
    #don't do search if already at the goal
    if (goalState == puzzle):
        return 0

    #I don't care about path, so I can just do this and I'm storing the depth elsewhere anyways
    visited = set()
    visited.add(puzzle)

    #format: [board state, fCost (total cost), gCost (depth))]
    activeHeap = [[puzzle, giveManhattanDist(puzzle, goalState, puzzleSize), 0]]
    while len(activeHeap) > 0:
        #check for time
        if (shouldEscape()):
            return -1

        #get the most promising node
        current = activeHeap.pop(a8Best(activeHeap))

        #get children of most promising node
        for child in get_children(current[0], None):
            #if it's the goal, you know the depth already
            if child == goalState:
                return (current[2] + 1)

            #if they aren't visited, add them
            if child not in visited:
                visited.add(child)
                activeHeap.append([child, current[2] + 1 + giveManhattanDist(child, goalState, puzzleSize), current[2] + 1])
    return -1

#it's a8 because a* doesn't work as a function name
#gives the most promising node's index
def a8Best(array):
    mostPromising = 0
    lowestFCost = array[0][1]

    #find the one with the lowest fcost
    for z in range(len(array)):
        if array[z][1] < lowestFCost:
            mostPromising = z
            lowestFCost = array[z][1]
    return mostPromising


#main program, uncomm
with open(fileName) as file:
    n = 0
    for line in file:
        #remove /n in line
        if line.find("\n") != -1:
            line = line[:-1]

        line = line.split(" ")
        print("Line {}: {}".format(n, line))
        if (hasGoodParity(line[1])):
            #BFS
            if (line[2] == "!" or line[2] == "B"):
                tStart = time.perf_counter()
                number = goalBFS(line[1])
                tEnd = time.perf_counter()
                print("    with BFS took {:.5f} s, requires {} move{}".format(tEnd - tStart, number, "" + ("s" * (number != 1))))

            #DFS
            if (line[2] == "!" or line[2] == "I"):
                tStart = time.perf_counter()
                number = iterativeDFS(line[1])
                tEnd = time.perf_counter()
                print("    with iterative DFS took {:.5f} s, requires {} move{}".format(tEnd - tStart, number, "" + ("s" * (number != 1))))
            
            #A*
            if (line[2] == "!" or line[2] == "A"):
                tStart = time.perf_counter()
                number = aStar(line[1])
                tEnd = time.perf_counter()
                print("    with A* took {:.5f} s, requires {} move{}".format(tEnd - tStart, number, "" + ("s" * (number != 1))))
        else:
            print("This is not solvable!")
        n += 1