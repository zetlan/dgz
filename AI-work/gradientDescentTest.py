#NAME: [REDACTED]
#DATE: May-21-2022

import math

zeroTolerance = 1e-8
trainRate = 0.2


def funcA(x, y):
    return (4 * x * x) - (3 * x * y) + (2 * y * y) + (24 * x) - (20 * y)

def funcB(x, y):
    return (1 - y) ** 2 + (x - y * y) ** 2

def funcC(x):
    return math.sin(x) + math.sin(3 * x) + math.sin(4 * x)


functionData = {
    "a": {
        "f": funcA,
        "partialX": 0,
        "partialY": 0
    }
}