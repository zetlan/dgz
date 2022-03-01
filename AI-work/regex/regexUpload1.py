import sys; args = sys.argv[1:]
index = int(args[0])-30

matchers = [
    #30-39
    r"/^0$|^10[01]$/",
    #"Don't match strings that start with 0 but actually that's fine now and you have to match the null string as well" Dear goodness. I am losing my mind. These specifications are woefully inadequate.
    r"/^[01]*$/",
    r"/0$/",
    r"/\b\S*?[aeiou][a-z]*?[aeiou]\S*?\b/i", 
    r"/^1[01]*0$|^0$/",
    r"/^[01]*110[01]*$/",
    #this is terrible. I am disgusted.
    r"/^[^/]{2,4}$/",
    #regex is bad, among other things, because it's unreadable. What is this line of code supposed to do? There's no words here. It's like brainF level except not intentional.
    #for the record, this line is supposed to match social security numbers. ddd-dd-dddd where there can be any number of spaces between the digits and either 0 or 1 dashes between them.
    r"/^\d{3}\s*-?\s*\d\d\s*-?\s*\d{4}$/",
    r"/^.*?[dD].*?\b/m",
    r"/^0$|^1$|^0[01]*0$|^1[01]*1$|^$/",


    #40-49
    #regex is most purely enjoyed when you don't see anything except the characters. For this reason, there will be no future comments about the regex, apart from line numbers (I'm not a masochist)
    #for the optimal viewing experience, it is recommended that you use an IDE which does not use syntax highlighting, or alternatively just open it in notepad. 
    #Black + white shapes, after all, are what regex is all about.
    r"/^[x.o]{64}$/i",
    r"/^[xo]*\.[xo]*$/i",
    r"/^(x+o*)?\.|\.(o*x+)?$/i",
    r"/^([^!]{2})*[^!]$/",
    r"/^(0|1[01])([01]{2})*$/",
    r"/\w*(a[eiou]|e[aiou]|i[aeou]|o[aeiu]|u[aeio])\w*/i",
    r"/^((10)*0*)*1*$|^0$/",
    r"/^[bc]*[abc][bc]*$/",
    r"/^(a[bc]*a|[bc]+?)(([bc]*?a){2})*[bc]*$/",
    r"/^(2|1[02]*1)(([02]*?1){2})*[02]*$/",


    #50-59
    r"/\w*(\w)\w*?\1\w*/i",
    r"/\w*(\w)(\w*\1){3}\w*/i",
    r"/^([01])([01]*\1)?$/",
    r"/(?=\w{6}\b)\b\w*cat\w*\b/i",
    r"/(?=\w*?bri)(?=\w*?ing)\b\w{5,9}\b/i",
    r"/\b(?!\w*cat)\w{6}\b/i",
    r"/\b(?:([a-z])(?!\w*\1))+\b/i",
    r"/(?!.*10011)^[01]*$/",
    r"/\b\w*?([aeiou])(?!\1)[aeiou]\w*?\b/i",
    r"/(?!.*1[01]1)^[01]*$/",


    #60-69
    r"/(?!.*010)^[01]*$/",
    r"/(?!.*(010|101))^[01]*$/",
    r"/^([01])([01]*\1)?$/",
    r"/\b(?!\w*(\w)\w*\1\b)\w+/i",
    r"/\b(?=\w*(\w)\1\w*(\w)\2\w*)\w+\b/",
    r"//",
    r"/\b(?=\b[^a ]*[a][^a ]*\b)(?=\b[^e ]*[e][^e ]*\b)(?=\b[^i ]*[i][^i ]*\b)(?=\b[^o ]*[o][^o ]*\b)(?=\b[^u ]*[u][^u ]*\b)\w*\b/i",
    r"/(?=((1*0){2})*1*01*$)(?=((0*1){2})*0*$)^[01]*$/",
    r"/^0$|^(?=0*1)(0|1(01*0)*1)+$/",
    r"//"
]

if index < len(matchers):
    print(matchers[index]) #[REDACTED]