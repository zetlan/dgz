


//creates a copy of the value that doesn't reference the value
function copy(value) {
	return JSON.parse(JSON.stringify(value));
}

function connectionsToNodes(data) {
	var n = data.length;
	for (var y=0; y<n; y++) {
		for (var x=0; x<n; x++) {
			//null checking, just in case
			if (data[y][x] != undefined) {
				//convert booleans to string
				var strStruct = "";
				data[y][x].connect.forEach(b => {
					strStruct += (b * 1);
				});

				//create final structure
				data[y][x] = makeNode(strStruct);

				//rotate
				data[y][x].rotation = Math.floor(randSD(0, 3)) * Math.PI * 0.5;
				rotateConnections(data[y][x]);
			}
		}
	}
}

/*
	O - none
	A - chip (1 way intersection)
	I - 2 way intersection (straight)
	L - 2 way intersection (bent)
	T - 3 way intersection
	K - 4 way intersection
*/
function convertCharToObject(character) {
	var connections = "0000";
	switch(character) {
		case "A":
			connections = "0100";
			break;
		case "I":
			connections = "0101";
			break;
		case "L":
			connections = "0110";
			break;
		case "T":
			connections = "0111";
			break;
		case "K":
			connections = "1111";
			break;
	}

	return {
		rotation: 0,
		rotDir: 0,
		connections: connections,
		data: undefined,
		isChip: false,
		power: -1,
	};
}



//turns a puzzle into string data
function exportPuzzle(readPuzz) {
	//first convert all connection sets into characters
	var finalStr = `${readPuzz.colorType}___`;
	readPuzz.data.forEach(l => {
		l.forEach(n => {
			//all connections start with 01, are a cross, or are nothing
			if (n == undefined) {
				finalStr += " ";
			} else {
				rotateConnections(n);
				switch (n.connections) {
					case "0100":
						finalStr += "A";
						break;
					case "0101":
						finalStr += "I";
						break;
					case "0110":
						finalStr += "L";
						break;
					case "0111":
						finalStr += "T";
						break;
					case "1111":
						finalStr += "K";
						break;
					case "0000":
						finalStr += "O";
						break;
					default:
						console.error(`couldn't parse ${n.connections}!`)
						finalStr += "?";
						break;
				}
			}
		});
		finalStr += `|`;
	});

	finalStr = finalStr.slice(0, -1);

	var finalChipStr = ``;
	//positions of all chips
	for (var y=0; y<readPuzz.data.length; y++) {
		for (var x=0; x<readPuzz.data[y].length; x++) {
			if (readPuzz.data[y][x] != undefined) {
				if (readPuzz.data[y][x].isChip) {
					finalChipStr += `|${x}~${y}~${readPuzz.data[y][x].data[0]}`;
					//only post second term if it exists
					if (readPuzz.data[y][x].data[1] != undefined) {
						finalChipStr += "~" + readPuzz.data[y][x].data[1];
					}
				}
			}
		}
	}
	finalChipStr = finalChipStr.slice(1);
	return (finalStr + "___" + finalChipStr);
} 



//takes in a size and the position of the different generators, and outputs a shuffled puzzle.
function generatePuzzle(sizeN, generatorPositions, seed) {
	if (seed == undefined) {
		seed = 4 + Math.random() * 2;
	}
	random_seed = seed;
	var n = sizeN;

	//the puzzle object that this function will create
	var puzz = new Puzzle();

	//initialize to empty array
	var data = [];
	for (var r=0; r<n; r++) {
		data.push([]);
		data[r].push(undefined);
	}

	//choose start values

	var primNodes = copy(generatorPositions);
	primNodes.forEach(n => {
		data[n[1]][n[0]] = {
			connect: [false, false, false, false]
		}
	});

	while (primNodes.length > 0) {
		//choose a random node
		var nChooseI = Math.floor(randSD(0, primNodes.length));
		var nChooseC = primNodes[nChooseI];

		//choose a random available direction
		/*
		   1
		2     0
		   3
		*/
		//get available directions
		var dirs = [0, 1, 2, 3];
		for (var a=0; a<dirs.length; a++) {
			if (!nodeIsAvailable(data, nChooseC[0] + dirRelate[dirs[a]][0], nChooseC[1] + dirRelate[dirs[a]][1])) {
				dirs.splice(a, 1);
				a -= 1;
			} 
		}
		//get number of already made connections
		var connectNums = data[nChooseC[1]][nChooseC[0]].connect.reduce((a, b) => a + b);

		//if no directions are available, or self has made too many connections, remove node from the list
		if (dirs.length == 0 || connectNums > 2) {
			primNodes.splice(nChooseI, 1);
		} else {
			//choose a random available direction
			var dirChoose = Math.floor(randSD(0, dirs.length));
			var index = dirs[dirChoose];

			var baseX = nChooseC[0];
			var baseY = nChooseC[1];
			var offX = dirRelate[index][0];
			var offY = dirRelate[index][1];

			//create node in that space
			data[baseY + offY][baseX + offX] = {
				connect: [false, false, false, false]
			}

			//connect to the node and add to queue
			data[baseY][baseX].connect[index] = true;
			data[baseY + offY][baseX + offX].connect[(index + 2) % 4] = true;
			primNodes.push([baseX + offX, baseY + offY]);
		}
	}

	//go through and convert connections to node objects
	connectionsToNodes(data);

	//make sure to make the starting nodes into generators
	for (var g=0; g<generatorPositions.length; g++) {
		data[generatorPositions[g][1]][generatorPositions[g][0]].isChip = true;
		data[generatorPositions[g][1]][generatorPositions[g][0]].data = ["generator", g];

	}

	//put data into object
	puzz.data = data;
	puzz.generatePositions = copy(generatorPositions);

	return puzz;
}

function importPuzzle(puzzleStringData) {
	//seperate into tile data and chip data
	var [colorDat, tileDat, chipDat] = puzzleStringData.split("___");
	
	

	//tile data into char array
	tileDat = tileDat.split("|");
	tileDat = tileDat.map(function (a) {return a.split("");});

	//char array into object array
	for (var n=0; n<tileDat.length; n++) {
		tileDat[n] = tileDat[n].map(function (a) {return convertCharToObject(a);});
	}

	//extra object data
	chipDat = chipDat.split("|").map(a => a.split("~"));
	var ref;
	var genCoords = [];
	chipDat.forEach(c => {
		ref = tileDat[c[1] * 1][c[0] * 1];
		ref.isChip = true;
		ref.data = [c[2]];
		if (c[3] != undefined) {
			ref.data[1] = c[3];
			if (c[2] == "generator") {
				genCoords.push([c[0] * 1, c[1] * 1]);
			}
		}
	});
	
	var puzz = new Puzzle();
	puzz.generatePositions = genCoords;
	puzz.data = tileDat;
	puzz.colorType = colorDat * 1;
	return puzz;
}

//returns a node object, given an identifier
function makeNode(identifier) {
	//identifier is connections case
	if (identifier.length > 1) {
		//+object operator turns into value
		var isChip = +identifier[0] + +identifier[1] + +identifier[2] + +identifier[3] == 1;
		return {
			isChip: isChip,
			rotation: 0,
			rotDir: 0,
			connections: identifier,
			power: -1,
			data: isChip ? ["A1"] : undefined
		};
	}
}




//returns a boolean value that says if the node at that position is a free node, available for adding things to
function nodeIsAvailable(dataArr, x, y) {
	if (x < 0 || x > dataArr.length-1) {
		return false;
	}
	if (y < 0 || y > dataArr.length-1) {
		return false;
	}
	return (dataArr[y][x] == undefined);
}

//gives a pseudo-random number from the seed
function randSD(min, max) {
	random_seed = Math.pow(random_seed, 1.6414756);
	//keep value in bounds
	while (random_seed > 100) {
		random_seed -= 98;
	}
	return ((random_seed % 1) * (max - min)) + min;
}

//rotates the connections of a node to start with 01 if possible
function rotateConnections(node) {
	var timeout = 5;
	while (node.connections.substring(0, 2) != "01" && timeout > 0) {
		timeout -= 1;
		node.connections = node.connections[3] + node.connections.substring(0, 3);
		//for auto-solving
		node.rotation -= Math.PI / 2;
	}
}