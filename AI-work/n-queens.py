#name: [REDACTED]
#date: October-25-2021

import time
import random

#the board sizes
#n = [84, 129, 342]
n = [39, 41]




#simple backtracking

# NOTE ON SIMPLE BACKTRACKING!!
# as shown in my genBoard_noSearch function, choosing all the odd values and then all the even values will instantly work,
# just due to the geometry of the board. So I feel bad even calling this a search, despite there being a perfectly functional search algorithm.
# This method of choosing variables will work for all N under 16. It will also work essentially instantly for all N % 6 + 1, and all N % 6 - 1.
# However, as N increases, this algorithm tends towards 2/3rds numbers that just stall forever (N % 6 + 2, 3, and 4). This is obviously not good.
# I've considered modifying gen_possibleVars to essentially do the same thing as my noSearch code, where it shuffles a few values around based on the n % 6. 
# However, I doubt that is what any of us want. If you wanted a construction, the assignment would have allowed for constructions. 
# The line between construction and search may be blurry, but I don't want to completely overstep it.
def genBoard_simpleBacktrack(n):
    #until the board is complete and n-long:
    finalBoard = []
    possibleNums = gen_possibleVars(n)

    #create initial board
    while len(finalBoard) < n:
        finalBoard = gen_nextVar(finalBoard, possibleNums)

    #until the board is good, move the new queen
    while (not test_solution(finalBoard)):
        finalBoard = gen_nextVar(finalBoard, possibleNums)

    #after all that, a good board will have been found.
    print(finalBoard)
    return True


def gen_possibleVars(n):
        #I've ordered this to be faster, does all the evens first and then the odds
    return [num for num in range(1, n, 2)] + [num for num in range(0, n, 2)]

def gen_nextVar(boardState, possibleVars):
    #print(boardState)
    #get list of allowed vars
    unusedVars = [num for num in possibleVars if num not in boardState]

    #if the board is smaller than the amount of variables, add one
    if (len(boardState) < len(possibleVars)):
        return boardState + [unusedVars[0]]

    #if it's the correct size it's more complicated, need to swap

    #step 1: remove last item and get priority
    lastPriority = possibleVars.index(boardState[len(boardState)-1])
    unusedVars.append(boardState.pop())
    
    while (len(boardState) < len(possibleVars)):
        #print("a + {}\n + {}\n + {}\n + {}\n".format(boardState, unusedVars, possibleVars, lastPriority))

        removeAnother = False
        #step 2: can you append an item of lower priority (farther down the possibleVars list) than the lastPriority?

        #get the first item of lower priority in the possibleVars list than the last priority
        newAddition = next((possibleVars[pos] for pos in range(lastPriority+1, len(possibleVars)) if possibleVars[pos] in unusedVars), -1)
        if (newAddition != -1):
            boardState += [newAddition]
            unusedVars.remove(newAddition)
            #lastPriority resets if added one
            lastPriority = -1
        else:
            removeAnother = True
        
        if removeAnother:
            #step 3: if can't append an item, repeat.
            if len(boardState) < 1:
                print("seomthing's gone horribly wrong")

            lastPriority = possibleVars.index(boardState[len(boardState)-1])
            unusedVars.append(boardState.pop())


    return boardState


#better algorithm. who know.s really?
def genBoard_betterBacktrack(n):
    #get ordering of variables
    #until the board is complete and n-long:
    finalBoard = []
    while len(finalBoard) < n:
        #append a 0 to the board
        finalBoard.append(0)

        #until the board is good, move the new queen
        while (not test_solution(finalBoard)):
            finalBoard[len(finalBoard)-1] += 1
            #if the board still isn't good after all the spots the new queen can take, delete one and move the previous queen
            while (finalBoard[len(finalBoard)-1] > n-1):
                finalBoard.pop()
                finalBoard[len(finalBoard)-1] += 1

    #after all that, a good board will have been found.
    print(finalBoard)
    return True

#weird and wacky. Turns out chess boards have cool properties sometimes.
def genBoard_noSearch(n):
    #first get the remainder when dividing n by 6
    remain = n % 6

    #get list of evens and odds
    odds = [a for a in range(1, n, 2)]
    evens = [a for a in range(0, n, 2)]
    

    #if the remainder is a certain amount, then things must be shuffled around

    #if the remainder is 2, swap 0 and 2, as well as move 4 to the end
    if remain == 2:
        [evens[0], evens[1]] = [evens[1], evens[0]]
        evens.append(evens.pop(2))


    #if the remainder is 3, move 1 to the end as well as 0 and 2
    if remain == 3:
        odds.append(odds.pop(0))
        evens.append(evens.pop(0))
        evens.append(evens.pop(0))

    #evens then odds
    board = odds + evens
    print(board)
    return True

#Possible easy optimizations here: when conflicts gets low, most movements of queens won't do anything. 
# There could be a part of the program that detects which queens don't conflict with any others, and then choose not to modify them.
# There's more specifics to that, but the basic idea would probably save iterations.
# As well as this, printing takes a significant amount of time. Final time can be cut down by just removing the constant console logging.
def genBoard_incrementalRepair(n):
    #don't attempt 2 or 3, will break
    if n == 2 or n == 3:
        return []
    
    #start with initial guess
    possVars = gen_possibleVars(n)
    board = []
    while len(board) < n:
        newVar = possVars.pop(random.randint(0, len(possVars)-1))
        board.append(newVar)

    #is this initial board somehow good? Cool! Return it
    if test_solution(board):
        return board

    lastIndexModified = -1

    iterations = 0
    lastConflicts = -1
    
    while not test_solution(board):
        numConflictsCurrent = board_conflicts(board)
        #I'm apparently supposed to print after every iteration. That seems exessive to me, but whatever.
        #if (numConflictsCurrent != lastConflicts):
        #    lastConflicts = numConflictsCurrent
        print("iterations: {}, board: {}, conflicts: {}".format(iterations, board, board_conflicts(board)))
        #modify one index at a time
        index = lastIndexModified
        while index == lastIndexModified:
            index = random.randint(0, len(board)-1)

        #find the value at which the least conflicts are created
        conflictsForN = []
        for p in range(len(board)):
            conflictsForN.append(board_conflictsOne(board[0:index] + [p] + board[index+1:], index))

        #get the indeces that have the least collisions
        leastIndeces = []
        #cannot collide with more than n+1 queens
        leastRequirement = n + 1
        for s in range(len(conflictsForN)):
            if conflictsForN[s] < leastRequirement:
                leastRequirement = conflictsForN[s]
                leastIndeces = [s]
            elif conflictsForN[s] == leastRequirement:
                leastIndeces += [s]

        #move the queen to that height
        #if there's only one least, cool! Good!
        if len(leastIndeces) == 1:
            board[index] = leastIndeces[0]
        elif len(leastIndeces) > 1:
            #multiple leasts, check to make sure it's actually being moved
            if (board[index] in leastIndeces):
                leastIndeces.remove(board[index])
                #move queen to a random best value
                random.shuffle(leastIndeces)
                board[index] = leastIndeces[0]
        else:
            #how. How could there be no best value.
            print("something's gone horribly wrong.")

        iterations += 1
    print(board)
    return board

def board_conflicts(board):
    totalConflicts = 0
    for n in range(0, len(board)):
        totalConflicts += board_conflictsOne(board, n)
    return totalConflicts

#gives the conflicts that one queen makes
def board_conflictsOne(board, n):
    conflicts = 0
    
    #before queen's row
    for c in range(n):
        #checking for intersection with all 3 rays of the queen's influence
        if board[c] == board[n] or board[c] == board[n] - (c - n) or board[c] == board[n] + (c - n):
            conflicts += 1

    #after queen's row
    for c in range(n+1, len(board)):
        if board[c] == board[n] or board[c] == board[n] - (c - n) or board[c] == board[n] + (c - n):
            conflicts += 1

    return conflicts


#grumble grumble.
#it doesn't work for non-square boards. EX: test_solution([0, 2, 3]) -> True, when it should be False
def test_solution(state):
    for var in range(len(state)):
        # if (var % 200 == 0):
        #     print(var) 
        left = state[var]
        middle = state[var]
        right = state[var]
        for compare in range(var + 1, len(state)): 
            left -= 1
            right += 1
            if state[compare] == middle: 
                #print(var, "middle", compare) 
                return False
            if left >= 0 and state[compare] == left: 
                #print(var, "left", compare)
                return False
            if right < len(state) and state[compare] == right: 
                #print(var, "right", compare)
                return False
    return True



























#actual code
t0 = time.perf_counter()
for size in n:
    print('solving {}...'.format(size))
    #genBoard_noSearch(size)
    print(test_solution(genBoard_incrementalRepair(size)))


t1 = time.perf_counter()
print("final time is {:.5f} seconds".format(t1 - t0))