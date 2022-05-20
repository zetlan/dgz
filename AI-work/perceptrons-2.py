#NAME: [REDACTED]
#DATE: May-19-2022

import sys
import ast
import math



epochs = 0
epochsMax = 100

nBits = int(sys.argv[1])

perceptronWeights = []
perceptronBias = 0

trainRate = 0.5



def activationStep(x):
    return int(x > 0)

def activationSigmoid(x):
    return 1 / (1 + math.e ** -x)



#takes in a canon integer representation and a perceptron returns the accuracy of the perceptron as a percentage
def check(canonInteger, perceptronWeight, perceptronBias):
    numCorrect = 0
    numTried = 0

    #bits can be figured out from the length of the weights, because input length == weight length
    bits = len(perceptronWeight)
    targetTable = tablifyCanon(bits, canonInteger)

    for bitSet in targetTable:
        perception = perceptron(activationStep, perceptronWeight, perceptronBias, bitSet)
        numTried += 1
        #if the perception percieves the same thing as is in the table, everything is cool and good
        if (perception == targetTable[bitSet]):
            numCorrect += 1


    return numCorrect / numTried



def perceptron(Activation, weights, bias, inputs):
    interest = bias
    #multiply all the inputs by the biases and add the weight
    for h in range(len(inputs)):
        interest += inputs[h] * weights[h]

    #run through the activation function
    return Activation(interest)



#takes an integer and returns the tuple of its boolean representation
def tuplifyCanon(bits, integer):
    return tuple([int(x) for x in list(bin(integer)[2:].zfill(bits))])

#takes an integer and returns a truth table with expected results
def tablifyCanon(bits, integer):
    #create table to output
    #it's a dictionary so you can search a set of values and get a result
    valueTable = {}

    intRep = bin(integer)[2:].zfill(2 ** bits)

    #start counting up
    for g in range(1, (2 ** bits) + 1):
        #g is the number that represents the state the bits should be in

        #create bit representation
        #turn number into a binary tuple, then add it to the value table
        valueTable[tuplifyCanon(bits, g-1)] = int(intRep[len(intRep)-g])

    return valueTable



def trainOnce(dataTable):
    global perceptronBias, epochs
    #loop through all elements of the data table
    for combination in dataTable:
        #run the thing
        output = perceptronBias
        for h in range(len(perceptronWeights)):
            output += perceptronWeights[h] * combination[h]
        output = activationStep(output)

        #figure out what the true output should be then correct errors
        trueOutput = dataTable[combination]
        error = trueOutput - output

        #wNew = wOld + learningRate * error * inputsList
        for w in range(len(perceptronWeights)):
            perceptronWeights[w] += trainRate * error * combination[w]

        #bNew = bOld + learningRate * error
        perceptronBias += trainRate * error

    epochs += 1



def trainFully(dataTable, funcInt):
    global perceptronWeights, perceptronBias
    lastWeights = []
    lastBias = 1e1001

    perceptronWeights = [0 for n in range(nBits)]
    perceptronBias = 0

    #run until out of epochs or until output converges
    while (not (lastWeights == perceptronWeights and lastBias == perceptronBias) and (epochs < epochsMax)):
        lastWeights = perceptronWeights.copy()
        lastBias = perceptronBias

        trainOnce(dataTable)

    #check accuracy
    return check(funcInt, perceptronWeights, perceptronBias)


#main


#if running in all mode, figure out how many n-bit functions there are and how many can be correctly modelled
if (len(sys.argv) < 3):
    numCorrect = 0
    numTotal = 2 ** (2 ** nBits)

    for an in range(numTotal):
        funcTable = tablifyCanon(nBits, an)
        accuracy = trainFully(funcTable, an)
        #if it's completely accurate, add to the correct bin
        if (accuracy == 1):
            numCorrect += 1

        #console logs
        if (an % 10 == 9):
            print("{} / {} complete".format(an+1, numTotal))


    print("{} possible, {} correctly modeled".format(numTotal, numCorrect))
else:
    #if not in all mode
    #take the second argument as the function to try to model
    funcInt = int(sys.argv[2])
    funcTable = tablifyCanon(nBits, funcInt)

    accuracy = trainFully(funcTable, funcInt)
    
    print("accuracy for {} with {} bits - {}%".format(funcInt, nBits, accuracy * 100))
