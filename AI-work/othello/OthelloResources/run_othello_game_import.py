from othello_imports import possible_moves, make_move  # This code uses YOUR Othello implementation!
import sys
import subprocess

print(sys.version)

time_limit = 2   # Time limit per turn in seconds.  Set to None for no time limit.
# p1, p2 = sys.argv[1], sys.argv[2]   # Uncomment to use command line arguments.
p1 = "oth_random_import.py"
p2 = "oth_greedy_predictable_import.py"
players = [p1, p2]


def what_next(board, current_player):
    if board.count(".") == 0:
        return -1  # -1 is game over
    if len(possible_moves(board, "xo"[current_player])) > 0:
        return 1  # current player takes a turn
    if len(possible_moves(board, "xo"[1-current_player])) > 0:
        return 0  # other player gets a turn
    return -1  # -1 is game over here too; only will get here if both players are stuck


def winner(board):
    x = board.count("x")
    o = board.count("o")
    if x > o:
        return 0  # x wins
    if o > x:
        return 1  # o wins
    return -1  # -1 is a tie


def nicely_print(board):
    board_rows = [board[x:x + 8] for x in range(0, 64, 8)]
    for row in board_rows:
        print(" ".join(list(row)))


def run_game(players):
    board = "...........................ox......xo..........................."
    turn = 0
    move_tracker = []  # This will track a list of moves...
    board_state_tracker = []  # ...and a list of board states as the game progresses.  Feel free to modify and add more!
    print("Beginning game. ", players[0], "is x, and", players[1], "is o.")
    while True:
        print()
        print("Current board:")
        nicely_print(board)
        status = what_next(board, turn)
        if status == -1:
            win = winner(board)
            print(players[win], "playing as", "xo"[win], "wins the game!")
            win_count = board.count("xo"[win])
            lose_count = board.count("xo"[1-win])
            print(players[win], "took", str(win_count/(win_count+lose_count)*100) + "%", "of the played tokens!")
            return win, move_tracker, board_state_tracker
        print("Next player:", players[turn], "playing as", "xo"[turn])
        if status == 0:
            turn = 1 - turn
            print("Current player has no valid moves and must skip.")
            move_tracker.append(-1)
            board_state_tracker.append(board)
            continue
        print(players[turn], "is starting their turn.")
        options = possible_moves(board, "xo"[turn])
        print("Available moves are:", options)
        try:
            # The next two lines run a subprocess that runs a player's script with appropriate args and captures output.
            # args is the list of arguments sent to start the process.  sys.executable is the python executable that is
            # running the current file; -u makes the output unbuffered so it can all be captured; the rest are command
            # line args sent to the python executable - first the name of the .py file we're running, then the args
            # sent to the .py file - the board and the current token, x or o.
            args = [sys.executable, "-u", players[turn], board, "xo"[turn]]
            stream = subprocess.run(args, capture_output=True, text=True, timeout=time_limit)
            outs = stream.stdout  # This will happen if the subprocess ends itself within the time limit.
            errs = stream.stderr
            print("Turn ended in less than time limit.")
        except subprocess.TimeoutExpired as timeErr:
            # This "except" block happens when the process does not end itself in time and times out; this still will
            # capture the output, but now gets it from the TimeoutExpired exception itself.  Either way: output and any
            # error messages that arose along the way are captured.
            outs = timeErr.stdout
            errs = timeErr.stderr
            print("Turn killed after time limit.")
        if len(errs) > 0:
            print("Error message from", players[turn] + ":")
            print(errs)
            print()
            print("Attempting to continue play.")
        # Now that the output of the player's code is captured, try to get a valid move out of it.
        outputs = outs.strip().split("\n")
        try:
            move = int(outputs[-1])
        except:
            print("The last printed text from", players[turn], "is not an integer, so no move was captured.")
            print("For debugging, current board is:", board)
            print("This is the output given by the script:")
            print(outs)
            print()
            print("This game is over; no victor.")
            return None, move_tracker, board_state_tracker
        if move not in options:
            print("Captured move", move, "is not a valid location to play.")
            print("For debugging, current board is:", board)
            print("This is the output given by the script:")
            print(outs)
            print()
            print("This game is over; no victor.")
            return None, move_tracker, board_state_tracker
        print("Player script's output with newlines removed:")
        print(outs.replace("\n", " "))
        print(players[turn], "has played at", move)
        board = make_move(board, "xo"[turn], move)
        turn = 1-turn
        move_tracker.append(move)
        board_state_tracker.append(board)






victor, moves, boards = run_game(players)
print()
print("All moves in order:", moves)
print("Game log (-1 indicates a player had no valid moves and skipped):")
player = "x"
for count in range(len(moves)):
    print(player, moves[count] if moves[count] > 9 or moves[count] == -1 else " " + str(moves[count]), boards[count])
    player = "xo"["ox".index(player)]
