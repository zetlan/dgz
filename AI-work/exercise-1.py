#NAME: 1, [REDACTED]

import sys
import math

def run():
    try:
        try:
            print(relation[sys.argv[1]][0]())
        except:
            print(relation[sys.argv[1]][1])
    except:
        print("invalid parameters received")

def A():
        return sys.argv[2] + sys.argv[3] + sys.argv[4]

def B():
    sum = 0
    for h in range(2, len(sys.argv)):
        sum += int(sys.argv[h])
    return sum

def C():
    list = []
    for h in range(2, len(sys.argv)):
        if int(sys.argv[h]) % 3 == 0:
            list.append(sys.argv[h])
    return list

def D():
    list = [1, 1]
    length = int(sys.argv[2])
    if length < 2:
        return list[0:length]

    while len(list) < length:
        list.append(list[len(list)-2] + list[len(list)-1])
    return list

def E():
    min = int(sys.argv[2])
    max = int(sys.argv[3])
    list = []
    for n in range(min, max+1):
        list.append(n * n - 3 * n + 2)
    return list

def F():
    side1 = float(sys.argv[2])
    side2 = float(sys.argv[3])
    side3 = float(sys.argv[4])

    #test for triangle validity
    if side1 + side2 <= side3 or side1 + side3 <= side2 or side2 + side3 <= side1:
        return "invalid side lengths: does not make a triangle"

    halfPerim = (side1 + side2 + side3) / 2
    return math.sqrt(halfPerim * (halfPerim - side1) * (halfPerim - side2) * (halfPerim - side3))

def G():
    vowelOrder = "aeiou"
    vowelArr = [0, 0, 0, 0, 0]

    trueStr = sys.argv[2].lower()
    for u in range(len(trueStr)-1):
        if vowelOrder.find(trueStr[u]) != -1:
            vowelArr[vowelOrder.find(trueStr[u])] += 1

    return "a: {}, e: {}, i: {}, o: {}, u: {}".format(vowelArr[0], vowelArr[1], vowelArr[2], vowelArr[3], vowelArr[4])



#no switch statement. I'm not going to let this go.
relation = {
    "A": [A, "invalid parameters: 3 numbers expected"],
    "B": [B, "invalid parameters: multiple numbers expected"],
    "C": [C, "invalid parameters: multiple numbers expected"],
    "D": [D, "invalid parameters: 1 integer expected"],
    "E": [E, "invalid parameters: 2 integers expected, the first one smaller than the second"],
    "F": [F, "invalid parameters: 3 floats expected"],
    "G": [G, "invalid parameters: string expected"],
}
run()