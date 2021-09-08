#NAME: 1, Davis Zetlan

import sys

s = sys.argv[1]


"""test cases!

 but what's the problem here
1 - u
2 -  
3 - 28
4 -  
5 - e
6 - r
7 - t wha
8 -  here
9 - ut what's the problem here
10 -  u htstepolmhr
11 - b ashpbme
12 - ereh melborp eht s'tahw tub 
13 - 0
14 -  but what's the problem he
15 - but what's the problem here
16 -  but what's the problem here
17 - ['', 'but', "what's", 'the', 'problem', 'here']
18 - 6
19 - [' ', 'b', 'u', 't', ' ', 'w', 'h', 'a', 't', "'", 's', ' ', 't', 'h', 'e', ' ', 'p', 'r', 'o', 'b', 'l', 'e', 'm', ' ', 'h', 'e', 'r', 'e']
20 -      'abbeeeehhhlmoprrstttuw
21 - 
22 - False


lonely Tylenol
1 - n
2 - l
3 - 14
4 - l
5 - l
6 - o
7 - ely T
8 - lenol
9 - nely Tylenol
10 - lnl yeo
11 - olTel
12 - lonelyT ylenol
13 - 6
14 - lonely Tylen
15 - onely Tylenol
16 - lonely tylenol
17 - ['lonely', 'Tylenol']
18 - 2
19 - ['l', 'o', 'n', 'e', 'l', 'y', ' ', 'T', 'y', 'l', 'e', 'n', 'o', 'l']
20 -  Teellllnnooyy
21 - lonely
22 - True
"""

"""I don't like error catching so I'm not going to do it. 
This will crash if you pass in an argument that's less than 5 characters long. 
You also have to surround the argument in quotes, or else it will assume spaces seperate multiple arguments."""
print("1 - {}".format(s[2]))
print("2 - {}".format(s[4]))
#in your example, "abcde edcba" gives a length of 12. wat?
print("3 - {}".format(len(s)))
print("4 - {}".format(s[0]))
print("5 - {}".format(s[len(s)-1]))
print("6 - {}".format(s[len(s)-2]))
#the example here shows that "abcde edcba" should give "de e". This is incorrect. "de e" is 4 characters, and you asked for 5 characters.
print("7 - {}".format(s[3:8]))
print("8 - {}".format(s[-5:]))
print("9 - {}".format(s[2:]))
#every other character, but "abcde edcba" prints "ace db"? It should print "ace eca".
#i'm giving up completely. My program is good. Take points off if you want.
print("10 - {}".format(s[::2]))
print("11 - {}".format(s[1::3]))
print("12 - {}".format(s[::-1]))
print("13 - {}".format(s.find(" ")))
print("14 - {}".format(s[:len(s)-2]))
print("15 - {}".format(s[1:]))
print("16 - {}".format(s.lower()))
print("17 - {}".format(s.split(" ")))
print("18 - {}".format(len(s.split(" "))))
print("19 - {}".format([char for char in s]))
print("20 - {}".format("".join(sorted(s))))
print("21 - {}".format(s.split(" ")[0]))
#palindrome ignores spaces and cases
print("22 - {}".format((list(s.replace(" ", "").lower()) == list(reversed(s.replace(" ", "").lower())))))
