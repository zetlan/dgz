#Name: [REDACTED]
#Date: April-21-2022


import sys
import math
from random import random
from random import randint

#folder that contains my imports, this is why I hate libraries
sys.path.append("/usr/local/lib/python3.9/site-packages")
import pyglet

window = pyglet.window.Window(640 * 1.5, 480 * 1.5, "thirty nine buried zero found")
mainBatch = pyglet.graphics.Batch()

# label = pyglet.text.Label("Heya",
#     font_name="Century Gothic", 
#     font_size=36, x=window.width / 2, 
#     y=window.height / 2,
#     anchor_x="center",
#     anchor_y="center",
#     batch=mainBatch)



@window.event
def on_draw():
    window.clear()

    for star in starsList:
        star.visibility.draw()
    return

@window.event
def on_key_press(symbol, modifiers):
    global groupSelected
    ref = pyglet.window.key

    #this is where switch would be nice
    if (symbol == ref.W):
        camera.az = 1
    if (symbol == ref.A):
        camera.ax = -1
    if (symbol == ref.S):
        camera.az = -1
    if (symbol == ref.D):
        camera.ax = 1
    if (symbol == ref.SPACE):
        camera.ay = -1
    if (symbol == ref.LSHIFT):
        camera.ay = 1

    if (symbol == ref.LEFT):
        camera.dt = -1
    if (symbol == ref.RIGHT):
        camera.dt = 1
    if (symbol == ref.UP):
        camera.dp = 1
    if (symbol == ref.DOWN):
        camera.dp = -1

    #numbers, 0 through 6 for each of the groups + -1 for all the groups at once
    if (symbol >= 48 and symbol <= 54):
        groupSelected = symbol - 49
    return

@window.event
def on_key_release(symbol, modifiers):
    ref = pyglet.window.key
    
    if (symbol == ref.W):
        camera.az = min(camera.az, 0)
    if (symbol == ref.A):
        camera.ax = max(camera.ax, 0)
    if (symbol == ref.S):
        camera.az = max(camera.az, 0)
    if (symbol == ref.D):
        camera.ax = min(camera.ax, 0)
    if (symbol == ref.SPACE):
        camera.ay = max(camera.ay, 0)
    if (symbol == ref.LSHIFT):
        camera.ay = min(camera.ay, 0)

    if (symbol == ref.LEFT):
        camera.dt = max(camera.dt, 0)
    if (symbol == ref.RIGHT):
        camera.dt = min(camera.dt, 0)
    if (symbol == ref.UP):
        camera.dp = min(camera.dp, 0)
    if (symbol == ref.DOWN):
        camera.dp = max(camera.dp, 0)
    return

def on_text_motion(motion):
    return


#actual program things
class Star:
    def __init__(self, color, type, starData):
        self.color = color
        #data is in [Temperature, Luminosity, Radius, Absolute Magnitude]
        self.data = starData
        self.data[2] = (self.data[2] + 6)
        self.typeGuess = None
        self.typeActual = type

        
        self.cameraDist = 1000
        self.visibility = pyglet.shapes.Circle(0, 0, 100, batch=mainBatch, color=color)

    def tick(self):
        self.cameraDist = ((self.data[0] - camera.x) ** 2 + (self.data[1] - camera.y) ** 2 + (self.data[3] - camera.z) ** 2) ** 0.5
        return

    def updateDraw(self):
        coordinates = spaceToScreen(self.data[0], self.data[1], self.data[3])
        if (coordinates == None):
            self.visibility.visible = False
            return

        self.visibility.visible = True
        self.visibility.opacity = 100 + 155 * int(groupSelected == -1 or groupSelected == self.typeGuess)
        self.visibility.x = coordinates[0]
        self.visibility.y = coordinates[1]
        self.visibility.radius = self.data[2] * (1 / 120) * camera.scale / self.cameraDist
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

        self.dMax = 1
        self.friction = 0.85

        self.theta = 0
        self.phi = 0
        self.dt = 0
        self.dp = 0

        self.dSpeed = 0.04
        self.rotSpeed = 0.05

        self.scale = 500

    def tick(self):
        #update velocities
        if (self.ax == 0):
            self.dx *= self.friction
        else:
            self.dx = min(max(self.dx + self.dSpeed * self.ax, -self.dMax), self.dMax)

        if (self.ay == 0):
            self.dy *= self.friction
        else:
            self.dy = min(max(self.dy + self.dSpeed * self.ay, -self.dMax), self.dMax)

        if (self.az == 0):
            self.dz *= self.friction
        else:
            self.dz = min(max(self.dz + self.dSpeed * self.az, -self.dMax), self.dMax)

        #get world velocity based on individual self components
        worldVel = [self.dx, self.dy, self.dz]
        worldVel[2] += self.dz * math.sin(self.phi)
        [worldVel[0], worldVel[2]] = rotate(worldVel[0], worldVel[2], -self.theta)
        #rotate that based on 
        self.x += worldVel[0]
        self.y += worldVel[1]
        self.z += worldVel[2]

        self.theta += self.dt * self.rotSpeed
        self.phi += self.dp * self.rotSpeed

        #cap phi, because I don't feel like dealing with ugliness
        self.phi = min(max(self.phi, math.pi * -0.5), math.pi * 0.5)
        return



#variables
camera = Camera(0.0, 0.0, 0.0)

groupSelected = -1

allStarData = []
starsList = []
starColorMap = {
    "White": (255, 255, 255),
    "white": (255, 255, 255),
    "Whitish": (255, 221, 255),
    "Yellowish": (255, 255, 136),
    "yellowish": (255, 255, 136),
    "Red": (255, 136, 136),
    "Orange": (255, 170, 102),
    "Orange-Red": (255, 102, 34),
    "Blue ": (102, 102, 255),
    "Blue": (102, 102, 255),
    "Pale yellow orange": (255, 236, 170),
    "Blue White": (170, 170, 255),
    "Blue white": (170, 170, 255),
    "Blue white ": (170, 170, 255),
    "Blue-White": (170, 170, 255),
    "Blue-white": (170, 170, 255),
    "Yellowish White": (255, 255, 204),
    "yellow-white": (255, 255, 204),
    "White-Yellow": (255, 255, 204),


    "debug": (136, 0, 136)
}

def createStarData():
    with open("6 class csv.csv") as file:
        firstLine = True
        lines = file.readlines()
        for line in lines:

            splitLn = line.replace("\n", "").split(",")

            if not firstLine:
                splitLn[0] = math.log(float(splitLn[0]))
                splitLn[1] = math.log(float(splitLn[1]))
                splitLn[2] = math.log(float(splitLn[2]))
                try:
                    splitLn[3] = math.log(float(splitLn[3]))
                except:
                    print(float(splitLn[3]))
                #star type
                splitLn[4] = int(splitLn[4])
                splitLn[5] = starColorMap[splitLn[5]]
                #I don't care about spectral class so I'm removing it
                splitLn.pop(6)
                allStarData.append(splitLn)
            else:
                firstLine = False
            


    #after the file reading is done, use the star data to create star objects
    for starDat in allStarData:
        #starDat is in [Temperature, Luminosity, Radius, Absolute Magnitude] form
        starsList.append(Star(starDat[5], starDat[4], starDat[0:4]))

def kMeans(numOfMeans):
    #initialize the means to random stars (I use positions of existing stars to avoid bins including no stars)
    means = []
    for q in range(numOfMeans):
        trying = starsList[randint(0, len(starsList)-1)].data
        #don't have duplicates
        while (trying in means):
            trying = starsList[randint(0, len(starsList)-1)].data
        
        means.append(trying)

    newMeans = [[[] for q in range(numOfMeans)]]
    meanBuckets = []


    meansDelta = 1e5
    tolerance = 0.1
    iterations = 0
    #until the means have settled, figure out which stars are closest to which mean and put them in that bucket
    while meansDelta > tolerance or iterations < 20:
        iterations += 1
        #reset the mean buckets
        meanBuckets = [[] for q in range(numOfMeans)]
        newMeans = [[] for q in range(numOfMeans)]
        for star in starsList:
            #figure out which mean is closest
            closestMean = getClosestPoint(means, star)

            #put that star into the bucket
            meanBuckets[closestMean].append(star)


        #get the true mean of all the buckets
        meansDelta = 0
        for m in range(numOfMeans):
            if (len(meanBuckets[m]) < 1):
                newMeans[m] = means[m]
            else:
                newMeanIndividual = [0, 0, 0, 0]
                for star in meanBuckets[m]:
                    newMeanIndividual[0] += star.data[0]
                    newMeanIndividual[1] += star.data[1]
                    newMeanIndividual[2] += star.data[2]
                    newMeanIndividual[3] += star.data[3]
                for u in range(len(newMeanIndividual)):
                    newMeanIndividual[u] /= len(meanBuckets[m])
                newMeans[m] = newMeanIndividual

            #figure out how much the mean has changed
            meansDelta += ((means[m][0] - newMeans[m][0]) ** 2 + (means[m][1] - newMeans[m][1]) ** 2 + (means[m][2] - newMeans[m][2]) ** 2 + (means[m][3] - newMeans[m][3]) ** 2) ** 0.5

        print(meansDelta, iterations)
        # for q in meanBuckets:
        #     print([star.typeActual for star in q])
        #after the true means have all been calculated, make those the new picking means
        means = newMeans

    for q in meanBuckets:
        print([star.typeActual for star in q])

    #assign guesses to stars
    for c in range(numOfMeans):
        for star in meanBuckets[c]:
            star.typeGuess = c
    return means

def getClosestPoint(meansArr, starObj):
    #meansArr is a set of points with 4 values, starObj has 4 values I can use, so it's just the pythagorean distance
    minDist = ((meansArr[0][0] - starObj.data[0]) ** 2 + (meansArr[0][1] - starObj.data[1]) ** 2 + (meansArr[0][2] - starObj.data[2]) ** 2 + (meansArr[0][3] - starObj.data[3]) ** 2) ** 0.5
    minPoint = 0

    for p in range(1, len(meansArr)):
        dist = ((meansArr[p][0] - starObj.data[0]) ** 2 + (meansArr[p][1] - starObj.data[1]) ** 2 + (meansArr[p][2] - starObj.data[2]) ** 2 + (meansArr[p][3] - starObj.data[3]) ** 2) ** 0.5
        if (dist < minDist):
            minDist = dist
            minPoint = p
    return minPoint

def main(dt):
    #tick all
    camera.tick()

    for star in starsList:
        star.tick()

    #order stars
    starsList.sort(key=lambda x: x.cameraDist, reverse=True)

    #update all stars
    for star in starsList:
        star.updateDraw()


def spaceToScreen(x, y, z):
    x -= camera.x
    y -= camera.y
    z -= camera.z

    #transform from the camera's theta, then phi
    [x, z] = rotate(x, z, camera.theta)
    [y, z] = rotate(y, z, -camera.phi)

    #if the point is behind the camera it shouldn't be rendered
    if (z <= 0):
        return None
    
    #2d transformations
    x /= z
    y /= z

    x *= camera.scale
    y *= -camera.scale

    x += window.width / 2
    y += window.height / 2

    return [x, y]

def rotate(x, z, angle):
    sin = math.sin(angle)
    cos = math.cos(angle)
    return [x * cos - z * sin, z * cos + x * sin]


createStarData()
kMeans(6)

pyglet.clock.schedule_interval(main, 1 / 60.0)
pyglet.app.run()
