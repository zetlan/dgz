#NAME: 1, [REDACTED]
import sys
# import os
import time
fileName = sys.argv[1]
checkStr = "this string won't appear in a regular puzzle."




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

"""#returns true if the board matches board goal, and false if not
def goal_test(boardState):
    return boardState == find_goal(boardState)
"""


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

#takes in a board state and returns number of steps required
def goalBFS(boardState):
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

#main program, uncomm
#will not take less than 2 minutes! Likely halts when faced with 4x4 puzzles
with open(fileName) as file:
    n = 0
    for line in file:
        splitDat = line.split(" ")
        #remove /n in second line
        if splitDat[1].find("\n") != -1:
            splitDat[1] = splitDat[1][:-1]
         # for each puzzle, output the start state, the goal state, and the start state's children, Clearly Labelled.
        print("Line {}: {}".format(n, splitDat[1]))
        tStart = time.perf_counter()
        number = goalBFS(splitDat[1])
        tEnd = time.perf_counter()
        print("    took {:.5f} s, requires {} move{}".format(tEnd - tStart, number, "" + ("s" * (number != 1))))
        n += 1

    # #no-goal BFS
    # print('starting search')
    # noGoalBFS("12345678.")
    


#main part 2, accepting a puzzle specification and giving the full path
"""
#fileName is reused as puzzle data
splitDat = fileName.split(" ")
if splitDat[1].find("\n") != -1:
    splitDat[1] = splitDat[1][:-1]
goalBFSWithPath(splitDat[1])
"""