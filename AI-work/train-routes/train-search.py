#Name: [REDACTED]
#Date: October-19-2021

import distanceDemo

#global vars
allNodes = {}
citiesToNodes = {}

"""
what do??
    1. model the train tracks structure as a graph
    2.run dijkstra and A* on it
    3. modify code to take any two command line args as cities, and path to them
    4. Animate using tkinter???


"""
#create data structure
def createLargeStructs():
    fileNodesWithCoords = open("rrNodes.txt")
    fileNodesWithCities = open("rrNodeCity.txt")
    fileNodeToNode = open("rrEdges.txt")

    #create node structure
    nodesWithCoords = fileNodesWithCoords.split("\n")
    for line in nodesWithCoords:
        line = line.split(" ")
        allNodes[line[0]] = {
            "coords": (line[1], line[2]),
            "connects": set(),
        }

    #connect cities to specific nodes
    nodesWithCities = fileNodesWithCities.split("\n")
    for line in nodesWithCities:
        line = line.split(" ")
        citiesToNodes[line[0]] = allNodes[line[1]]

    #create tracks
    nodeToNode = fileNodeToNode.split("\n")
    for line in nodeToNode:
        line = line.split(" ")
        #get the distance between the two nodes, then append that to both node's connection set
        distance = distanceDemo.calcd(allNodes[line[0]]["coords"], allNodes[line[1]]["coords"])
        print(distance)
        allNodes[line[0]]["connects"].add((distance, allNodes[line[1]]))
        allNodes[line[1]]["connects"].add((distance, allNodes[line[0]]))


    return

createLargeStructs()