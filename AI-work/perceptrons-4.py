#NAME: [REDACTED]
#DATE: May-20-2022

import math
import ast
import sys



def activationStep(x):
    return int(x > 0)

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







#XOR HAPPENS HERE

#runNetwork is generalized to NxN networks, so it's slightly less obvious that exactly 3 perceptron calls are happening, but that's what's happening

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

#user input



#different things depending on arguments
if (len(sys.argv) == 1):
    pass
elif (len(sys.argv) == 2):
    print(runNetwork(xorNet, ast.literal_eval(sys.argv[1]))[0])
elif (len(sys.argv) == 3):
    #each one is a decimal value corresponding to x and y coordinates of a point to check against the diamond network
    status = runNetwork(diaNet, float(sys.argv[1]), float(sys.argv[2]))
