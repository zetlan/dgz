
class Network {
    constructor(layerParams) {
        this.layerParams = layerParams;

        this.network = [];
        this.createNetwork();
    }

    createNetwork() {
        this.network = [];

        //create layers
        for (var l=0; l<this.layerParams.length; l++) {
            this.network.push([]);

            //create nodes in the network
        }
        
    }

    createWeights() {

    }

    evaluate(inputs) {

    }

    //creates a child network with another network of the same size
    createChildWith(otherNetwork) {
        var child = new Network();
    }
}