#Name: [REDACTED]
#Date: October-19-2021

import distanceDemo
import sys
import time

#global vars
allNodes = {}
citiesToNodes = {}
dictionaryStopper = "kitchen utensil"

"""
what do??
    1. model the train tracks structure as a graph
    2.run dijkstra and A* on it
    3. modify code to take any two command line args as cities, and path to them
    4. Animate using tkinter???


"""
#create data structure
def createLargeStructs():
    #create node structure
    with open("rrNodes.txt") as fileNodesWithCoords:
        for line in fileNodesWithCoords:
            #remove \ns
            line = line.replace("\n", "")
            line = line.split(" ")
            allNodes[line[0]] = {
                "coords": [float(line[1]), float(line[2])],
                "connects": [],
            }

    #connect cities to specific nodes
    with open("rrNodeCity.txt") as fileNodesWithCities:
        for line in fileNodesWithCities:
            line = line.replace("\n", "")
            line = line.split(" ")
            citiesToNodes[line[1]] = line[0]

    #create tracks
    with open("rrEdges.txt") as fileNodeToNode:
        for line in fileNodeToNode:
            line = line.replace("\n", "")
            line = line.split(" ")
            #get the distance between the two nodes, then append that to both node's connection set
            distance = distanceDemo.calcd(allNodes[line[0]]["coords"], allNodes[line[1]]["coords"])
            allNodes[line[0]]["connects"].append((distance, line[1]))
            allNodes[line[1]]["connects"].append((distance, line[0]))


    return


#runs dijkstra's algorithm to get a path from city1 to city2
#each city is the node number
def dijkstra(node1, node2):
    pathDict = {}
    pathDict[node1] = dictionaryStopper
    unvisited = [[0, node1]]
    while (len(unvisited) > 0):
        #get the closest node to be current
        index = 0
        dist = unvisited[0][0]
        for i in range(len(unvisited)):
            #test dist
            if (unvisited[i][0] < dist):
                dist = unvisited[i][0]
                index = i

        #now that self has the closest node, pop it off
        closest = unvisited.pop(i)

        #get children, append them to the list
        for child in allNodes[closest[1]]["connects"]:
            #print(child)
            #only continue if it's not already in the visited list (path)
            if (child[1] not in pathDict):
                #if it's the end, break out
                if (child[1] == node2):
                    print("path found with length of {}".format(child[0] + closest[0]))
                    return
            
                #if not, add it to the unvisited list as well as the path
                pathDict[child[1]] = closest
                unvisited.append([child[0] + closest[0], child[1]])
            elif (child[1] in [x[1] for x in unvisited]):
                for g in range(len(unvisited)):
                    if unvisited[g][1] == child[1]:
                        unvisited[g][0] = child[0] + closest[0]
                        pathDict[child[0]] = closest
                        g = len(unvisited)
                #actually, it can be visited and still have its distance reduced, as long as it's still in the path

    #if still here, a path hasn't been found. Sadge.
    print("path not found ):")
    return







tStart = time.perf_counter()
createLargeStructs()
tEnd = time.perf_counter()
print("creating data structs took {:.5f} s".format(tEnd - tStart))

tStart = time.perf_counter()
dijkstra(citiesToNodes[sys.argv[1]], citiesToNodes[sys.argv[2]])
tEnd = time.perf_counter()
print("Dijkstra find between {} and {} took {:.5f} s".format(sys.argv[1], sys.argv[2], tEnd - tStart))