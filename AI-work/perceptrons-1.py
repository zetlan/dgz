#NAME: [REDACTED]
#DATE: May-19-2022

import sys
import ast
import math



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



def activationStep(x):
    return int(x > 0)

def activationSigmoid(x):
    return 1 / (1 + math.e ** -x)


def perceptron(Activation, weights, bias, inputs):
    interest = bias
    #multiply all the inputs by the biases and add the weight
    for h in range(len(inputs)):
        interest += inputs[h] * weights[h]

    #run through the activation function
    return Activation(interest)



print(check(int(sys.argv[1]), ast.literal_eval(sys.argv[2]), float(sys.argv[3])))