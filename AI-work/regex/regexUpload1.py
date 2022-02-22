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
    r"/^0$|^1$|^0[01]*0$|^1[01]*1$|^$/"


    #40-49
    r"/^[xX.Oo]{64}$/",
    r"/[xXOo]*\.[xXOo]*/",
    r"/^\.|\.$|^x+o*\.|\.o*x+$/",
    r"/^(..)*.$/",
    r"/^0([01]{2})*$|^1[01]([01]{2})*$/",
    r"//",
    r"//",
    r"/^[bc]*a?[bc]*$/",
    r"/^((([bc]*a[bc]*){2})*)$/",
    r"//"
]

if index < len(matchers):
    print(matchers[index]) #[REDACTED]