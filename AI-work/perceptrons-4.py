#NAME: [REDACTED]
#DATE: May-20-2022

import math
import ast
import sys
import random



def activationStep(x):
    return int(x >= 0)

def activationSigmoid(x):
    return 1 / (1 + math.e ** -x)




def createNetwork(activationFunc, sizeList, weights, biases):
    #the first number is the input size, the last number is the output size, the rest is everything in between
    network = []

    for l in range(1, len(sizeList)):
        newLayer = []
        for n in range(sizeList[l]):
            newLayer.append({
                "w": weights[l-1][n],
                "b": biases[l-1][n],
                "a": activationFunc
            })
        network.append(newLayer)

    return network


def runPerceptron(Activation, weights, bias, inputs):
    
    interest = bias
    #multiply all the inputs by the biases and add the weight
    for h in range(len(inputs)):
        interest += inputs[h] * weights[h]

    #run through the activation function
    return Activation(interest)




def runNetwork(network, inputs):
    #go through layer-by-layer
    layerOutputs = []
    for l in range(len(network)):
        for p in network[l]:
            #separate calls to perceptron function
            layerOutputs.append(runPerceptron(p["a"], p["w"], p["b"], inputs))
        inputs = layerOutputs
        layerOutputs = []
    return inputs






#create XOR network
xorNet = createNetwork(activationStep, [2, 2, 1], 
    [[[1, 1], [0.5, 0.5]], 
    [[1, -1]]],

    [[0, -0.9],
    [0]]
)


#create diamond network
diaNet = createNetwork(activationStep, [2, 4, 1], 
    [[[-1, -1], [-1, 1], [1, -1], [1, 1]], 
    [[1, 1, 1, 1]]],

    [[1, 1, 1, 1],
    [-4]]
)


#create circle network
#https://www.desmos.com/calculator/vsozars2gz is what I used to adjust weights

cirBias1 = 2.7
cirBias2 = -3.6428
cirNet = createNetwork(activationSigmoid, [2, 4, 1], 
    [[[-1, -1], [-1, 1], [1, -1], [1, 1]], 
    [[1, 1, 1, 1]]],

    [[cirBias1, cirBias1, cirBias1, cirBias1],
    [cirBias2]]
)




#different things depending on arguments
if (len(sys.argv) == 1):
    pointsArr = []
    #create points
    for p in range(500):
        pointsArr.append([random.random() * 2 - 1, random.random() * 2 - 1])

    #check all points
    numCorrect = 0

    for p in pointsArr:
        sndert = int((p[0] ** 2 + p[1] ** 2) ** 0.5 < 1)
        trueSndert = round(runNetwork(cirNet, p)[0])
        if (trueSndert != sndert):
            print("misclassified point at [{}, {}]. (Should have been {})".format(p[0], p[1], {1: "inside", 0: "outside"}[trueSndert]))
        else:
            numCorrect += 1

    print("accuracy: {}%".format(numCorrect * 100.0 / len(pointsArr)))


elif (len(sys.argv) == 2):
    print(runNetwork(xorNet, ast.literal_eval(sys.argv[1]))[0])
elif (len(sys.argv) == 3):
    #each one is a decimal value corresponding to x and y coordinates of a point to check against the diamond network
    status = round(runNetwork(diaNet, [float(sys.argv[1]), float(sys.argv[2])])[0])
    if (status == 1):
        print("inside")
    else:
        print("outside")