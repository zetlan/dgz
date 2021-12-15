from othello_imports import make_move, possible_moves
import ast
import time

start = time.perf_counter()

problems = []
with open("boards.txt") as f:
    for line in f:
        problems.append(line.strip().split())

moves_lists = []
board_lists = []
with open("answers.txt") as g:
    for line in g:
        moves = ast.literal_eval(line[line.index("["): line.index("]") + 1])
        if moves == []:
            boards = []
        else:
            boards = line[line.index("]") + 2:].strip().split(", ")
        moves_lists.append(moves)
        board_lists.append(boards)


def nicely_print(board):
    board_rows = [board[x:x + 8] for x in range(0, 64, 8)]
    for row in board_rows:
        print(" ".join(list(row)))


def dual_print(board, other):
    board_rows = [board[x:x + 8] for x in range(0, 64, 8)]
    other_rows = [other[x:x + 8] for x in range(0, 64, 8)]
    for count in range(8):
        print(" ".join(list(board_rows[count])) + "      " + " ".join(list(other_rows[count])))



for num in range(len(problems)):
    problem, moves, boards = problems[num], moves_lists[num], board_lists[num]
    board, token = problem
    your_moves = sorted(possible_moves(board, token))
    if your_moves != moves:
        print("Your possible move list for token", token, "on this board:")
        print()
        nicely_print(board)
        print()
        print("was:", your_moves)
        print("not:", moves, "as it should have been.")
        input("Press enter to continue trying test cases and looking for errors, or just stop this script.")
        print("\n\n\n")
    else:
        your_results = []
        for move in your_moves:
            your_results.append(make_move(board, token, move))
        if len(boards) > 0:
            for index in range(len(boards)):
                if your_results[index] != boards[index]:
                    row = moves[index] // 8
                    col = moves[index] % 8
                    print("You attempted to place token ", token, " at location ", moves[index], " (row ", row, " column ",
                          col, ") on this board:", sep='')
                    print()
                    nicely_print(board)
                    print()
                    print("You ended up with the board on the LEFT.  You should have gotten the board on the RIGHT.")
                    print()
                    dual_print(your_results[index], boards[index])
                    print()
                    input("Press enter to continue trying test cases and looking for errors, or just stop this script.")
                    print("\n\n\n")
print("Testing is done.  If you didn't get any error messages, your othello_imports.py file worked perfectly!")

end = time.perf_counter()
print("Testing took, in total,", end - start, "seconds.  This number is only useful if there were no errors, and should be much less than half a second.  My code runs in .058 seconds.")