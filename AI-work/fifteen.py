#NAME: 1, [REDACTED]
import sys
# size = sys.argv[1]
# data = sys.argv[2]



#takes size and stringDat and prints it to the console as a grid
def print_puzzle(size, stringDat):
    puzzLines = [stringDat[c:c+size] for c in range(0, len(stringDat), size)]
    for line in puzzLines:
        #python makes me feel like I'm lost at sea, slowly swimming in any direction while the waves buffet me around.
        #anyways, I put spaces between each character by splitting the string and then putting it back together with whitespace inside.
        splitLn = [][:0] = line
        print(" ".join(splitLn))

def find_goal(boardState):
    #sorted will put a period at the start, so I have to put it at the end manually
    buffer1 = sorted(boardState)
    del buffer1[0]
    return ''.join(buffer1) + '.'




#returns the list of possible board states you can get from the input board state
def get_children(boardState):
    return

#returns true if the board matches board goal, and false if not
def goal_test(boardState):
    return boardState == find_goal(boardState)

#main program, I named my txt file fifteen-puzzles.txt but yours may be different
with open("fifteen-puzzles.txt") as file:
    n = 0
    for line in file:
        splitDat = line.split(" ")
         # for each puzzle, output the start state, the goal state, and the start state's children, Clearly Labelled.
        print("Line {} start state:").format(n)
        print_puzzle(splitDat[0], splitDat[1])

        print("Line {} children:").format(n)
        print(get_children(splitDat[1]))

        print("Line {} goal state:").format(n)
        print(find_goal(splitDat[1]))

        n += 1
       


