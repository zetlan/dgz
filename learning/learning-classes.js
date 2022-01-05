/* how it works:
Networks have nodes, which themselves have axons. 
Nodes are in a certain layer, and the number of layers varies with the network.
Axons connect nodes to other nodes with a strength applied to the value. (multiplying the value by a certain amount.) 
Axons always connect from the previous layer to the next layer.

When the network runs evaluate, it is fed an input that all the axons/nodes operate on, 
and eventually produces an output at the final layer. This is then compared to the expected output, and the difference is the network's loss.
When the network runs train, it will tweak some of its axons at random and run the evaluate function again. If the loss is lower, the changes are kept.
However, if the loss is higher, the changes are not kept. This happens over and over again, preferably with different training data each time.
Overall

*/


class Network {
    constructor(numOfNodesInInput, numOfNodesInOutput, numOfNodesInHiddens, numOfHiddens) {

    }

    evaluate() {

    }

    train() {

    }
}

class Node {
    constructor() {
        this.value;
    }

    operate() {
        //change this value to all the axon values added up
    }
}

class Axon {
    constructor() {
        this.targetNode;
        this.strength = 1;
        this.currentValue = 0;
    }

    operate() {
        //applies strength to target node and stores in current value
        this.currentValue = (this.targetNode.value) * this.strength
    }
}