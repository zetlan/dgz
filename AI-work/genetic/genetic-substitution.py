#NAME: [REDACTED]
#DATE: March-7-2022
from math import log

alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
cipherGuess = "FLMQWCIXYOBJRDGHSTUZAKENVP"

def encode(str, cipherKey):
    #convert to uppercase
    str = str.upper()
    #swap with cipher
    newStr = ""
    for char in str:
        ind = alphabet.find(char)
        if ind != -1:
            newStr += cipherKey[ind]
        else:
            newStr += char
    return newStr


def decode(str, cipherKey):
    #swap with main
    newStr = ""
    for char in str:
        ind = cipherKey.find(char)
        if ind != -1:
            newStr += alphabet[ind]
        else:
            newStr += char
    return newStr



def fitness(n, checkText, alphabet):
    return



print(decode(encode("we live in a so.,l siciety", cipherGuess), cipherGuess))