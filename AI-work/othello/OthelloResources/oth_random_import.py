from othello_imports import possible_moves, make_move
from random import choice
import sys

board = sys.argv[1]
player = sys.argv[2]
print(choice(possible_moves(board, player)))