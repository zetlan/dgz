
class Network {
	constructor(layerParams) {
		this.layerParams = layerParams;

		this.network = [];

		this.trainRate = 0.1;
	}

	//creates a child network with another network of the same size
	createChildWith(otherNetwork) {
		var child = new Network(this.layerParams);
		//half of the nodes in the child will come from self, half of them will come from the other parent
		for (var c=0; c<this.network.length; c++) {
			child.network.push([]);

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
		return child;
	}

	createNetwork() {
		this.network = [];

		//create layers
		for (var l=1; l<this.layerParams.length; l++) {
			this.network.push([]);

			//create nodes in the network, the input layer isn't included because it isn't made of nodes
			for (var a=0; a<this.layerParams[l]; a++) {
				//each node has a set of weights and a set of biases. This determines how it filters data from the input nodes
				var weightList = [];

				for (var g=0; g<this.layerParams[l-1]; g++) {
					weightList[g] = randomBounded(-1, 1);
				}
				this.network[l-1][a] = {
					w: weightList,
					b: randomBounded(-1, 1)
				};
			}
		}
	}

	//takes in a list of inputs and outputs a list of outputs, according to the values in the network
	evaluate(inputs) {
		//go through, calculating layer by layer
		var newValues = [];
		
		//propogate through all layers
		for (var l=0; l<this.network.length; l++) {
			newValues = [];
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
		return JSON.stringify(this.network);
	}

	importNetwork(networkData) {
		this.network = JSON.parse(networkData);
	}

	trainOnce(inputs, expectedOutputs) {
		//first run the network forwards and save the values in each layer
		var xValues = [];
		var newValues = [];
		var newXs = [];

		//same forward running as in the evaluate function
		for (var l=0; l<this.network.length; l++) {
			newValues = []
			newXs = [];
			for (var m=0; m<this.network[l].length; m++) {
				var nowNode = this.network[l][m];
				newXs[m] = nowNode.b;
				for (var p=0; p<nowNode.w.length; p++) {
					newXs[m] += inputs[p] * nowNode.w[p];
				}
				newValues[m] = sigmoid(newXs[m], 0, 1);
			}

			//now that the values for the layer have been calculated, shift over by one layer and start again
			inputs = newValues;
			xValues.push(newXs);
		}

		//after all that, we can calculate the error and run the network backwards to fix it
		var frontError = [];
		var currentError = [];
		var neuronRef;
		var neuronDelta;

		//for farthest layer
		for (var n=0; n<newValues.length; n++) {
			neuronRef = this.network[this.network.length-1][n];

			//calculating error is easy (just expected - actual)
			frontError[n] = expectedOutputs[n] - newValues[n];

			//fix weights + biases
			neuronDelta = sigmoidAnti(xValues[xValues.length-1][n]) * frontError[n] * this.trainRate;
			for (var w=0; w<neuronRef.w.length; w++) {
				neuronRef.w[w] += neuronDelta;
			}
			neuronRef.b += neuronDelta;

		}

		//repeat for all middle layers
		for (var k=this.network.length-2; k>-1; k--) {
			for (var n=0; n<this.network[k].length; n++) {
				//error
				currentError[n] = 0;

				//since we're going backwards, the error for the node is the error for the nodes in the layer ahead of this one multiplied by the strength of this node's connections to those
				//high error for future node & high weight = high error, high error for future node & low wieght = low error, etc
				//these errors are all added together and then put through the anti-sigmoid function, because they're passing back a layer and each layer is passed through a sigmoid
				for (var np=0; np<this.network[k+1].length; np++) {
					currentError[n] += frontError[np] * this.network[k+1][np].w[n];
				}
				currentError[n] = sigmoidAnti(xValues[k][n]) * currentError[n];

				//weights/biases
				neuronRef = this.network[k][n];
				neuronDelta = sigmoidAnti(xValues[k][n]) * currentError[n] * this.trainRate;
				for (var w=0; w<neuronRef.w.length; w++) {
					neuronRef.w[w] += neuronDelta;
				}
				neuronRef.b += neuronDelta;
			}
			frontError = currentError;
			currentError = [];
		}
	}
}