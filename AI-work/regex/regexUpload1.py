import sys; args = sys.argv[1:]
index = int(args[0])-30

matchers = [
    r"/0|100|101/",
    r"/[01]+/",
    r"//",
    r"/\S[aeiou]{2}\S/", 
    r"//",
    r"//",
    #regex is bad, among other things, because it's unreadable. What is this line of code supposed to do? There's no words here. It's like brainF but not intentionally bad.
    #for the record, this line is supposed to match social security numbers. ddd-dd-dddd where there can be any number of spaces between the digits and either 0 or 1 dashes between them.
    r"/\d{3}\s*-?\s*\d\d\s*-?\s*\d{4}/",
    r"//",
    r"//"
]

if index < len(matchers):
    print(matchers[index]) #Davis Zetlan, 1, 2023