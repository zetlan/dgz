test = "          #         #         #      #  #      #  #      #  #     ##  #     ##  #     ## ##     ## #####  ########  ######### ######### ######### ######### ########## #### # # # # ##### ###   ########"
print("This script is paired with tetrisout1.txt and tests the following board:")
print("=======================")
for count in range(20):
    print(' '.join(list(("|" + test[count * 10: (count + 1) * 10] + "|"))), " ", count)
print("=======================")
print()
print("  0 1 2 3 4 5 6 7 8 9  ")
print()

sol1 = []
your_game_over_count = 0
with open("tetrisout.txt") as f:
    for line in f:
        if line.strip() == "GAME OVER":
            your_game_over_count += 1
        else:
            sol1.append(line.replace("\n", ""))
print("Your output has", your_game_over_count, "GAME OVER lines and", len(sol1), "different valid boards.  Now checking...")

sol2 = []
ideal_game_over_count = 0
with open("tetrisout1.txt") as f:
    for line in f:
        if line.strip() == "GAME OVER":
            ideal_game_over_count += 1
        else:
            sol2.append(line.replace("\n", ""))

for sol in sol1:
    if sol not in sol2:
        if len(sol) == 200:
            print("Your solution included this board, which wasn't in the correct file:")
            print("=======================")
            for count in range(20):
                print(' '.join(list(("|" + sol[count * 10: (count + 1) * 10] + "|"))), " ", count)
            print("=======================")
            print()
            print("  0 1 2 3 4 5 6 7 8 9  ")
            print()
        else:
            print("This solution in your file is not 200 characters long:")
            print(sol)

for sol in sol2:
    if sol not in sol1:
        print("The file of correct solutions included this board, which wasn't in your file:")
        print("=======================")
        for count in range(20):
            print(' '.join(list(("|" + sol[count * 10: (count + 1) * 10] + "|"))), " ", count)
        print("=======================")
        print()
        print("  0 1 2 3 4 5 6 7 8 9  ")
        print()

if your_game_over_count != ideal_game_over_count:
    print("Your code should have had", ideal_game_over_count, "GAME OVER strings, but instead you had", your_game_over_count)

print()
print("...checking complete!  If you see no errors, your output was correct!")