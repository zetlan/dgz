from othello_imports import possible_moves, make_move
import sys

board = sys.argv[1]
player = sys.argv[2]
possibilities = []
for move in possible_moves(board, player):
    new_board = make_move(board, player, move)
    possibilities.append((new_board.count(player), move))
possibilities.sort()
print(possibilities[-1][1])