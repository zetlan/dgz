import sys; args = sys.argv[1:]
myLines = open(args[0], 'r').read().splitlines()

#shouldn't have any reference to file i/o after this line
tags = myLines.split(" ")


x = 1 + 1 #[NAME REDACTED], Period 1, 2023