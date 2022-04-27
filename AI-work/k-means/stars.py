#Name: [REDACTED]
#Date: April-21-2022


import sys
import math
from random import random
from venv import create

#folder that contains my imports, this is why I hate libraries
sys.path.append("/usr/local/lib/python3.9/site-packages")
import pyglet

window = pyglet.window.Window(640, 480, "thirty nine buried zero found")

label = pyglet.text.Label("Heya",
    font_name="Century Gothic", 
    font_size=36, x=window.width / 2, 
    y=window.height / 2,
    anchor_x="center",
    anchor_y="center")



@window.event
def on_draw():
    window.clear()
    label.draw()
    return


#actual program things

def createStarData():
    starColorMap = {
        "White": "#FFFFFF",
        "white": "#FFFFFF",
        "Whitish": "#FFDDFF",
        "Yellowish": "#FFFF88",
        "yellowish": "#FFFF88",
        "Red": "#FF8888",
        "Orange": "#FFAA66",
        "Orange-Red": "#FF6622",
        "Blue ": "#6666FF",
        "Blue": "#6666FF",
        "Pale yellow orange": "#FFECAA",
        "Blue White": "#AAAAFF",
        "Blue white": "#AAAAFF",
        "Blue white ": "#AAAAFF",
        "Blue-White": "#AAAAFF",
        "Blue-white": "#AAAAFF",
        "Yellowish White": "#ffffCC",
        "yellow-white": "#FFFFCC",
        "White-Yellow": "#FFFFCC"
    }

    with open("6 class csv.csv") as file:
        firstLine = True
        lines = file.readlines()
        for line in lines:

            splitLn = line.replace("\n", "").split(",")

            if not firstLine:
                splitLn[0] = math.log(float(splitLn[0]))
                splitLn[1] = math.log(float(splitLn[1]))
                splitLn[2] = math.log(float(splitLn[2]))
                splitLn[3] = float(splitLn[3])
                #star type
                splitLn[4] = int(splitLn[4])
                splitLn[5] = starColorMap[splitLn[5]]
                #I don't care about spectral class so I'm removing it
                splitLn.pop(6)
            else:
                firstLine = False
            allStarData.append(splitLn)


    #after the file reading is done, use the star data to create star objects
    for starDat in allStarData:
        #starDat is in [Temperature, Luminosity, Radius, Absolute Magnitude] form
        starsList.append(Star(starDat[5], starDat[4], starDat[0:4]))

def kMeans(numOfMeans):
    #initialize the means randomly
    means = []
    newMeans = []
    meanBuckets = []
    for h in range(numOfMeans):
        means.append([random(), random(), random(), random()])
        meanBuckets.append([])
        newMeans.append([])


    meansDelta = 1e5
    tolerance = 0.1
    iterations = 0
    #until the means have settled, figure out which stars are closest to which mean and put them in that bucket
    while meansDelta > tolerance:
        iterations += 1
        for star in starsList:
            #figure out which mean is closest
            closestMean = getClosestPoint(means, star)


        #get the true mean of the bucket and repeat

    #figure
    return

def getClosestPoint(meansArr, starObj):
    return



class Star:
    def __init__(self, color, type, starData):
        self.color = color
        self.data = starData
        self.typeGuess = None
        self.typeActual = type

    def draw():
        return

class Camera:
    def __init__(self, x, y, z):
        self.x = x
        self.y = y
        self.z = z
        self.dx = 0
        self.dy = 0
        self.dz = 0
        self.ax = 0
        self.ay = 0
        self.az = 0

        self.theta = 0
        self.phi = 0
        self.dt = 0
        self.dp = 0
        self.rotSpeed = 0.03
        return

    def tick():
        return



#world objects
camera = Camera(0, 0, 0)

allStarData = []
starsList = []

def spaceToScreen(x, y, z):
    x -= camera.x
    y -= camera.y
    z -= camera.z

    #reverse the camera's theta, then phi
    [x, z] = rotate(x, z, -camera.theta)
    [y, z] = rotate(y, z, -camera.phi)

    #camera always faces forwards so I don't have to worry about that
    return [x, y]

def rotate(x, z, angle):
    sin = math.sin(angle)
    cos = math.cos(angle)
    return [x * cos - z * sin, x * sin - z * cos]



createStarData()
kMeans(6)
pyglet.app.run()