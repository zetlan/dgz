#NAME: [REDACTED]
#DATE: May-10-2022

import math


starDataTest = []
starDataTrain = []
starColorMap = {
    "White": "#ffffff",
    "white": "#ffffff",
    "Whitish": "#ffddff",
    "Yellowish": "#ffff88",
    "yellowish": "#ffff88",
    "Red": "#ff8888",
    "Orange": "#ffaa66",
    "Orange-Red": "#ff6622",
    "Blue ": "#6666ff",
    "Blue": "#6666ff",
    "Pale yellow orange": "#ffecaa",
    "Blue White": "#aaaaff",
    "Blue white": "#aaaaff",
    "Blue white ": "#aaaaff",
    "Blue-White": "#aaaaff",
    "Blue-white": "#aaaaff",
    "Yellowish White": "#ffffcc",
    "yellow-white": "#ffffcc",
    "White-Yellow": "#ffffcc",


    "debug": "#880088"
}

starDataBinNames = ["low", "medium", "high"]
#data bins are from the star data set (https://www.kaggle.com/datasets/deepu1109/star-dataset)
#low - first column of the bar chart
#medium - middle 6 columns
#high - rightmost 3 columns of the bar chart

starDataBins = [
    [5746, 24774],
    [84943, 594593],
    [195, 1363],
    [-8, 10]
]


#read in star data, similar to kMeans
def createStarData(placementArr, fileName):
    with open(fileName) as file:
        firstLine = True
        lines = file.readlines()
        for line in lines:

            splitLn = line.replace("\n", "").split(",")
            # 0 - Temperature (K)
            # 1 - Luminosity(L/Lo)
            # 2 - Radius(R/Ro)
            # 3 - Absolute magnitude(Mv)
            # 4 - Star type (categorical)
            # 5 - Star color (categorical)

            # 6 - Spectral Class (Ignored)

            if not firstLine:
                
                splitLn[0] = float(splitLn[0])
                splitLn[1] = float(splitLn[1])
                splitLn[2] = float(splitLn[2])
                splitLn[3] = float(splitLn[3])
                splitLn[4] = int(splitLn[4])

                #ok the issue here is that all these different values are continuous, not discreet, and 1R needs discreet values. So I'm going to just put all of these into bins.
                for h in range(4):
                    if (splitLn[h] < starDataBins[h][0]):
                        splitLn[h] = starDataBinNames[0]
                    elif (splitLn[h] > starDataBins[h][1]):
                        splitLn[h] = starDataBinNames[2]
                    else:
                        splitLn[h] = starDataBinNames[1]

                #discretize color
                splitLn[5] = splitLn[5].replace("'", "")
                splitLn[5] = starColorMap[splitLn[5]]
                #I don't care about spectral class so I'm removing it
                splitLn.pop(6)
                placementArr.append(splitLn)
            else:
                firstLine = False


#test the accuracy of assigning a specific attribute with a specific value to a group
#answers the question "what percentage of X value of Y attribute falls into Z group?"
#example -> passing in [0, low, 1] could return 40%, if 40% of low temperature stars are in group 1
def testRule(attribute, value, group):
    correct = 0
    tested = 0

    for star in starDataTrain:
        if star[attribute] == value:
            tested += 1
            if star[4] == group:
                correct += 1

    if (tested == 0):
        #if there's no stars with that attribute-value pairing, it's a useless ruling and should be scored poorly
        return 0

    return correct / tested

#tests the accuracy of a classifier on the entire training dataset
#answers the question "how well can this ruleset classify things?"
def testClassifier(classifier):
    correct = 0
    for star in starDataTrain:
        predictedClass = classifier[star[classifier["ATTRIBUTE INDEX"]]]
        if predictedClass == star[4]:
            correct += 1

    return correct / len(starDataTrain)

def createClassifier():
    bestClassifierAccuracy = 0
    bestClassifier = {}
    #go through all the possible attributes
    for a in range(4):
        classifier = {"ATTRIBUTE INDEX": a}
        #go through all the possible values for these atttributes
        for value in starDataBinNames:
            #figure out which bin this attribute-value pairing best fits
            bestRuleAccuracy = 0
            bestRule = 0
            for r in range(1, 7):
                accuracy = testRule(a, value, r)
                if (accuracy > bestRuleAccuracy):
                    bestRuleAccuracy = accuracy
                    bestRule = r
            
            #append that
            classifier[value] = bestRule
        
        #figure out if this classifier is good
        accuracy = testClassifier(classifier)
        if (accuracy > bestClassifierAccuracy):
            bestClassifier = classifier
            bestClassifierAccuracy = accuracy

    return bestClassifier


def testClassifierTrue(classifier):
    correct = 0
    for star in starDataTest:
        predictedClass = classifier[star[classifier["ATTRIBUTE INDEX"]]]
        if predictedClass == star[4]:
            correct += 1

    return correct / len(starDataTest)



createStarData(starDataTest, "star_data_test.csv")
createStarData(starDataTrain, "star_data_training.csv")

classifyRules = createClassifier()
print(classifyRules)
print("classification accuracy: {}".format(testClassifierTrue(classifyRules)))
