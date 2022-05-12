#NAME: [REDACTED]
#DATE: May-10-2022

import math


testStarData = []
trainStarData = []
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
                #ok the issue here is that all these different values are continuous, not discreet, and 1R needs discreet values. So I'm going to just put all of these
                splitLn[0] = math.log(float(splitLn[0]))
                splitLn[1] = math.log(float(splitLn[1]))
                splitLn[2] = math.log(float(splitLn[2]))
                splitLn[3] = float(splitLn[3])
                #star type
                splitLn[4] = int(splitLn[4])

                #discretize color
                splitLn[5] = starColorMap[splitLn[5]]
                #I don't care about spectral class so I'm removing it
                splitLn.pop(6)
                placementArr.append(splitLn)
            else:
                firstLine = False
