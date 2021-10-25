#name: [REDACTED]
#date: October-25-2021

import time

#the board sizes
n = [32, 34]




#simple backtracking
def genBoard_simpleBacktrack(n):
    return



def genBoard_sortedBacktrack(n):
    return


def genBoard_incrementalRepair(n):
    return



#checks a board, doesn't have to be square, but says if any of the queens intersect each other
def checkBoard(board):
    #quick check, if any of the two numbers are the same then it's invalid
    
    boardLength = len(board)
    boardHeight = max(board) + 1

    #convert board to actual board
    return

def checkBoard_repeats(board):
    for n in board:
        if board.count(n) > 1:
            return True
    return False


#grumble grumble
def test_solution(state):
    for var in range(len(state)): 
        left = state[var]
        middle = state[var]
        right = state[var]
        for compare in range(var + 1, len(state)): 
            left -= 1
            right += 1
            if state[compare] == middle: 
                print(var, "middle", compare) 
                return False
            if left >= 0 and state[compare] == left: 
                print(var, "left", compare)
                return False
            if right < len(state) and state[compare] == right: 
                print(var, "right", compare)
                return False
    return True































#actual code
t0 = time.perf_counter()

print('solving {}...'.format(n[0]))

print('solving {}...'.format(n[1]))



t1 = time.perf_counter()
print("final time is {:.5f}")