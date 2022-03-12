#NAME: [REDACTED]
#DATE: March-7-2022
import math
import random
import string
import sys


alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
nGramValues = {}


#simulation parameters
generations = 500
mutationRate = 0.8
mutationRateAgain = 0.15
numSurvivors = 2
nUsing = 4
populationTarget = 1000
#this is the rate at which proportions of the reproduction chance drop off. 
#for example: with a rate of 0.85, and a best of 150, 1st place would get 150 shares, 2nd place would get ceil(150 * 0.85) -> 128 shares, 3rd place would get 109 shares, etc
sharesBest = 140
shareDropOffRate = 0.85


#random.seed(2.82)

def createNGramStruct():
    with open('ngrams.txt') as file:
        for line in file:
            [gram, freq] = line.split()
            #take the natural log of frequency to reduce the effect of most common grams
            nGramValues[gram] = math.log(int(freq))


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


def fitness(n, decodedText):
    fitness = 0
    #remove all non-alphabet chars
    decodedText = decodedText.translate(str.maketrans('', '', string.punctuation))

    #break the text into groups by spacing (nGrams won't go between words)
    wordsList = decodedText.split(" ")
    for word in wordsList:
        #if the word is too short to have multiple nGrams by the defined N, just use the longest one possible
        if len(word) <= n:
            fitness += grabFrequency(word)
        else:
            #loop through word, getting all ngrams in the word.
            for l in range(len(word)-n):
                fitness += grabFrequency(word[l:l+n])

    return fitness

def fitnessDecode(n, encodedCheckText, cipherKey):
    #first decode the text
    decodedCheckText = decode(encodedCheckText, cipherKey)
    return fitness(n, decodedCheckText)


def grabFrequency(gram):
    try:
        return nGramValues[gram]
    except:
        nGramValues[gram] = -1
        return -1


def produceRandomCipher():
    return "".join(random.sample(alphabet, len(alphabet)))

def produceRandomPopulation():
    cipherPopulation = set()
    for e in range(populationTarget):
        cipherPopulation.add(produceRandomCipher())
    return cipherPopulation



def hillClimbOnce(stringToDecode, cipher):
    f0 = fitnessDecode(nUsing, stringToDecode, cipher)
    #swap each two letters to try and get a better result
    for c1 in range(0, len(alphabet)):
        for c2 in range(c1+1, len(alphabet)):
            newCipher = list(cipher)
            [newCipher[c1], newCipher[c2]] = [newCipher[c2], newCipher[c1]]
            newCipher = "".join(newCipher)
            if (fitnessDecode(nUsing, stringToDecode, newCipher) > f0):
                return newCipher
    return "unable to hill climb"


def solve_hillClimb(stringToDecode):
    initialGuess = produceRandomCipher()

    for g in range(generations):
        #improve guess
        #first create what self thinks is a better cipher
        swapping = random.sample([x for x in range(len(initialGuess))], 2)
        newGuess = list(initialGuess)
        [newGuess[swapping[0]], newGuess[swapping[1]]] = [newGuess[swapping[1]], newGuess[swapping[0]]]
        newGuess = "".join(newGuess)

        #if the new guess has a better utility, replace it
        if (fitnessDecode(nUsing, stringToDecode, newGuess) > fitnessDecode(nUsing, stringToDecode, initialGuess)):
            initialGuess = newGuess
            print("generation: {}".format(g))
            print(initialGuess, decode(stringToDecode, initialGuess), fitnessDecode(nUsing, stringToDecode, initialGuess))


def solve_giHelp(tuple):
    return tuple[1]

def solve_genetic(stringToDecode):
    cipherPopulation = produceRandomPopulation()
    lastBestFitness = -1e5
    #score all ciphers
    for g in range(generations):
        if (g % 100 == 0):
            print("generation is now {}".format(g))
        cipherFitnesses = [(cipher, fitnessDecode(nUsing, stringToDecode, cipher)) for cipher in cipherPopulation]

        #sort them and put into gene pool based on their scoring
        cipherFitnesses = sorted(cipherFitnesses, key=solve_giHelp, reverse=True)

        #display the best fitness
        if (cipherFitnesses[0][1] > lastBestFitness):
            lastBestFitness = cipherFitnesses[0][1]
            print("generation: {}".format(g))
            print(lastBestFitness, cipherFitnesses[0][0], decode(stringToDecode, cipherFitnesses[0][0]))


        genePool = []
        nextGeneration = set()
        sharesNow = sharesBest
        for entity in cipherFitnesses:
            for u in range(sharesNow):
                genePool.append(entity[0])
            sharesNow = math.ceil(sharesNow * shareDropOffRate)

        #first have survivors
        for k in range(numSurvivors):
            nextGeneration.add(cipherFitnesses[k][0])

        #have 1 hill-climber
        #print('hill climbing')
        #nextGeneration.append(hillClimbOnce(stringToDecode, cipherFitnesses[0][0]))

        #new children
        while (len(nextGeneration) < populationTarget):
            #create a child from two parents
            child = ""
            parents = random.sample(genePool, 2)

            #make sure there's at least some mixing
            cutPosition = random.randint(1, len(parents[0]) - 1)
            allowedLetters = list(alphabet)

            #introduce parent 1
            for char in range(cutPosition):
                child += parents[0][char]
                allowedLetters.remove(parents[0][char])

            #introduce parent 2
            for char in range(cutPosition, len(parents[1])):
                if (parents[1][char] in allowedLetters):
                    child += parents[1][char]
                    allowedLetters.remove(parents[1][char])
                else:
                    letter = allowedLetters.pop(random.randint(0, len(allowedLetters)-1))
                    child += letter

            #mutation?
            if (random.random() < mutationRate):
                swapping = random.sample([x for x in range(len(child))], 2)
                child = list(child)
                [child[swapping[0]], child[swapping[1]]] = [child[swapping[1]], child[swapping[0]]]
                child = "".join(child)

            while (random.random() < mutationRateAgain):
                swapping = random.sample([x for x in range(len(child))], 2)
                child = list(child)
                [child[swapping[0]], child[swapping[1]]] = [child[swapping[1]], child[swapping[0]]]
                child = "".join(child)
            
            #append child
            nextGeneration.add(child)

        #create the next generation
        cipherPopulation = nextGeneration
    return






#actual program

#first create structure
createNGramStruct()

#start with an initial guess
stringToDecode = sys.argv[1]
solve_genetic(stringToDecode)