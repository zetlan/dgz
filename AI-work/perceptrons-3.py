#NAME: [REDACTED]
#DATE: May-20-2022

import math
import ast
import sys



def activationStep(x):
    return int(x > 0)

def activationSigmoid(x):
    return 1 / (1 + math.e ** -x)




def createNetwork(sizeList):
    #the first number is the input size, the last number is the output size, the rest is everything in between
    network = []

    for l in range(1, len(sizeList)):
        newLayer = []
        for j in range(sizeList[l]):
            newLayer.append({
                "w": [0 for x in range(sizeList[l-1])],
                "b": 0,
                "a": activationStep
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







#XOR HAPPENS HERE

#runNetwork is generalized to NxN networks, so it's slightly less obvious that exactly 3 perceptron calls are happening, but that's what's happening

#create XOR network
xorNet = createNetwork([2, 2, 1])

#set weights of said network
xorNet[0][0]["w"] = [1, 1]
xorNet[0][0]["b"] = 0

xorNet[0][1]["w"] = [0.5, 0.5]
xorNet[0][1]["b"] = -0.9

xorNet[1][0]["w"] = [1, -1]
xorNet[1][0]["b"] = 0

#user input
userTuple = ast.literal_eval(sys.argv[1])
print(runNetwork(xorNet, userTuple)[0])
