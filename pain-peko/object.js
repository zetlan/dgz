
class Network {
	constructor(layerParams) {
		this.layerParams = layerParams;

		this.network = [];
	}

	//creates a child network with another network of the same size
	createChildWith(otherNetwork) {
		var child = new Network(this.layerParams);
		//half of the nodes in the child will come from self, half of them will come from the other parent
		for (var c=0; c<this.network.length; c++) {
			child.network.push([]);

			//actual layers with weights / biases
			if (c > 0) {
				//create all the child nodes
				for (var d=0; d<this.network[c].length; d++) {
					//take from either self or the other parent
					var obj = (Math.random() > 0.5) ? this : otherNetwork;
					//make a copy of the parent's node to give to the child
					child.network[c][d] = JSON.parse(JSON.stringify(obj.network[c][d]));

					//chance of a mutation
					while (Math.random() > network_mutateRate) {
						//change either a weight or the bias, it'll be more likely to change a weight
						if (Math.random() > 1 / (child.network[c][d].w.length + 1)) {
							child.network[c][d].w[Math.floor(randomBounded(0, child.network[c][d].w.length-0.01))] += boolToSigned(Math.random() > 0.5) * network_changeAmount;
						} else {
							child.network[c][d].b += boolToSigned(Math.random() > 0.5) * network_changeAmount;
						}
					}
				}
			}
		}
		return child;
	}

	createNetwork() {
		this.network = [];

		//create layers
		for (var l=0; l<this.layerParams.length; l++) {
			this.network.push([]);

			//create nodes in the network
			if (l > 0) {
				//nodes in the hidden / end layers have to have computational values
				for (var a=0; a<this.layerParams[l]; a++) {
					//each node has a set of weights and a set of biases. This determines how it filters data from the input nodes
					var weightList = [];

					for (var g=0; g<this.layerParams[l-1]; g++) {
						weightList[g] = randomBounded(-1, 1);
					}
					this.network[l][a] = {
						w: weightList,
						b: randomBounded(-1, 1)
					};
				}
			} else {
				for (var a=0; a<this.layerParams[l]; a++) {
					this.network[l][a] = -1;
				}
			}
		}
	}

	//takes in a list of inputs and outputs a list of outputs, according to the values in the network
	evaluate(inputs) {
		//go through, calculating layer by layer
		var newValues = [];
		
		//propogate through all layers
		for (var l=1; l<this.network.length; l++) {
			newValues = []
			//calculate the values for each node
			for (var m=0; m<this.network[l].length; m++) {
				var nowNode = this.network[l][m];
				newValues[m] = nowNode.b;
				//have the value for the current node be a product of all the weights and biases in that node
				for (var p=0; p<nowNode.w.length; p++) {
					newValues[m] += inputs[p] * nowNode.w[p];
				}
				newValues[m] = sigmoid(newValues[m], 0, 1);
			}

			//now that the values for the layer have been calculated, shift over by one layer and start again
			inputs = newValues;
		}

		//when finished with the network, output the values
		return newValues;
	}

	//exports self's data to a string
	exportNetwork() {

	}

	importNetwork(networkData) {

	}
}