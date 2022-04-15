/*
a lot of these functions are created for an assignment specification, which is why they may seem weird or out of place given the rest of this codebase. Still, many of them are still useful for creating the AI.


INDEX:
aiMdl_givePossibleStates(inputStateArr, pieceIdOPTIONAL, pieceRotOPTIONAL);
aiMdl_convertToArr(inputStr);
aiMdl_convertToStr(inputArr);

calculateFitness(boardArr, weights);
calculateFitnessFor(network);

*/



/* Given an input board string in row major order, outputs an array of all the possible boards via all possible pieces placed.
Extra arguments specify what limitations to place on what the function outputs. 
PieceId will limit the output to just the possible states when given a single piece to place, and pieceRot will limit the output 
to just the possible states with the piece and with a specified rotation. */
function aiMdl_givePossibleStates(inputStateArr, pieceIdOPTIONAL, pieceRotOPTIONAL) {
	var outBoards = [];

	//if there's a piece ID, then the possibilities only need to be calculated for one piece
	if (pieceIdOPTIONAL != undefined) {
		if (pieceRotOPTIONAL != undefined) {
			//get landing heights of all rows in the input
			var inputRowHeights = [];
			for (var x=0; x<board_width; x++) {
				for (var y=0; y<board_height; y++) {
					if (inputStateArr[y][x] != undefined) {
						//the block has been detected
						inputRowHeights[x] = y;
						y = board_height + 5;
					}
				}

				if (y < board_height + 5) {
					inputRowHeights[x] = board_height;
				}
			}

			//get array representation of the piece
			var arrRep = representPieceWithArr(pieceIdOPTIONAL, pieceRotOPTIONAL);
			arrRep = trimPieceArr(arrRep);

			//the width of the array now acts as a barrier
			var upperXBound = board_width - arrRep[0].length;

			//get the heights at which the stored piece sits in its array
			var heights = [];
			for (var x=0; x<arrRep[0].length; x++) {
				for (var y=arrRep.length-1; y>-1; y--) {
					if (arrRep[y][x] != "0") {
						heights[x] = y;
						y = -1;
					}
				}
			}

			//now use the heights against the blocks to figure out the height the piece will drop to

			var arrCopy;
			var landSection;
			for (var x=0; x<=upperXBound; x++) {
				//first get a copy of the array
				arrCopy = copyObj(inputStateArr);

				//figure out the distance to the nearest blocks below
				landSection = inputRowHeights.slice(x, x + arrRep[0].length);
				for (var bx=0; bx<arrRep[0].length; bx++) {
					landSection[bx] -= heights[bx] + 1;
				}

				//make the piece land in the array
				var height = Math.min(...landSection);
				if (height < 0) {
					//it's a game over
					outBoards.push(ai_endStr);
				} else {
					for (var by=0; by<arrRep.length; by++) {
						for (bx=0; bx<arrRep[0].length; bx++) {
							if (arrRep[by][bx] == "1") {
								if (arrCopy[by + height][bx + x] != undefined) {
									console.log(`issue placing piece from reference (${x}, ${height}), at location (${bx + x}, ${by + height})`);
								} else {
									arrCopy[by + height][bx + x] = "#";//color_palettes[0].pColors["I"];
								}
							}
						}
					}
					//push to the array
					outBoards.push(arrCopy);
				}
			}
			return outBoards;
		}

		//just do all the rotations lol
		for (var r=0; r<=piece_posLimits[pieceIdOPTIONAL]; r++) {
			var thisIteration = aiMdl_givePossibleStates(inputStateArr, pieceIdOPTIONAL, r);

			outBoards = outBoards.concat(thisIteration);
		}

		return outBoards;
	}

	//just do all the pieces lol
	Object.keys(piece_pos).forEach(p => {
		outBoards = outBoards.concat(aiMdl_givePossibleStates(inputStateArr, p));
	});

	return outBoards;

}

function aiMdl_convertToArr(inputStr) {
	//the string is in left-to-right, top-to-bottom order, so it's not particularly difficult
	var outArr = [];
	for (var a=0; a<inputStr.length; a++) {
		if (a % board_width == 0) {
			outArr.push([]);
		}
		outArr[outArr.length-1].push((inputStr[a] == "#") ? "#" /*color_palettes[0].pColors["I"]*/ : undefined);
	}
	return outArr;
}

//takes in a 2d array of height x width and returns a string representation of the board that is h * w long
function aiMdl_convertToStr(inputArr) {
	//if there's no data to convert, just return a blank string
	if (inputArr == undefined) {
		return " ".repeat(board_width * board_height);
	}

	var outStr = "";
	//loop over the array and convert every character into either a block or a space
	//y starts at the end of the array - the necessary height because game boards have 2 extra rows as a buffer that need to be ignored for the AI.
	for (var y=inputArr.length-board_height; y<board_height; y++) {
		for (var x=0; x<board_width; x++) {
			outStr += (inputArr[y][x] == undefined) ? " " : "#";
		}
	}
	return outStr;
}

function calculateFitness(boardArr, weights) {
	//if the board is the game over str, have it be negative
	//sorry network but this one isn't up to you
	if (boardArr == ai_endStr) {
		return -1e5
	}

	//step 1: figure out relavant parameters of the board
	var maxHeight;
	var minHeight;
	var numHoles = 0;
	var variance;
	var nerf = 0;

	//to calculate heights: loop through the board and find out how far down each row goes
	var rowHeights = [];
	var counting = false;
	for (var x=0; x<board_width; x++) {
		counting = false;
		rowHeights[x] = 0;
		for (var y=board_heightBuffer; y<board_height; y++) {
			//if there's a block there, the height has been found
			if (!counting && boardArr[y][x] != undefined) {
				rowHeights[x] = board_height - y;
				counting = true;
			} else if (counting && boardArr[y][x] == undefined) {
				numHoles += 1;
			}
		}
	}

	//now that heights are known, min, max, and variance can be calculated
	maxHeight = Math.max(...rowHeights);

	//similar game-ending check, I'd rather the AI not reach the very top
	if (maxHeight > board_height - 2) {
		nerf = -1e3;
	}

	minHeight = Math.min(...rowHeights);
	rowHeights.splice(rowHeights.indexOf(minHeight), 1);
	var avg = rowHeights.reduce((a, b) => a + b, 0) / rowHeights.length;
	variance = rowHeights.reduce((a, b) => a + Math.abs(b - avg), 0) / rowHeights.length;
	variance = variance * variance;


	//step 2: calculate fitness based on weights
	return (nerf + maxHeight * weights.a + minHeight * weights.b + numHoles * weights.c + variance * weights.d);
}

function calculateFitnessFor(network) {
	var points = 0;

	//step 1: play a specified number of games and see how many points the AI gets on average
	var pieces;
	var pieceNext;
	var gameBoard;
	var lastGameBoard;
	var i = 0;
	for (var g=0; g<ai_trainGames; g++) {
		gameBoard = aiMdl_convertToArr(" ".repeat(board_height * board_width));
		pieces = createBag();

		//a 'game' consists of calculating which board are possible, having the AI rank them, and then continue to the one it thinks is best.
		var bestBoard;
		var possibleBoards;
		var bonusScore;
		while (gameBoard != ai_endStr) {
			i += 1;
			pieceNext = pieces.pop();
			//make sure there's always pieces in the bag
			if (pieces.length < 1) {
				pieces = createBag();
			}
			lastGameBoard = gameBoard;
			possibleBoards = aiMdl_givePossibleStates(gameBoard, pieceNext);
			//go through all the possible boards and add data - the number of points the AI would get from cleared lines, as well as the AI's fitness scoring of this board
			bestBoard = undefined;
			for (var b=0; b<possibleBoards.length; b++) {
				bonusScore = (possibleBoards[b] != ai_endStr) ? ai_scoring[clearLines(possibleBoards[b])] : 0;
				possibleBoards[b] = [possibleBoards[b], bonusScore, calculateFitness(possibleBoards[b], network)];

				//if it's the best board, select it
				if (bestBoard == undefined || bestBoard[2] < possibleBoards[b][2]) {
					bestBoard = possibleBoards[b];
				}
			}

			//change the board state to the best board and add points
			points += bestBoard[1];
			gameBoard = bestBoard[0];
		}
	}
	points = points / ai_trainGames;

	//step 2: return the point value as fitness score
	return points;
}

function trainOnce() {
	ai_generation += 1;

	//if the paired population isn't defined, create a random population
	if (ai_populationPaired.length == 0) {
		ai_population = [];
		while (ai_population.length < ai_populationGoal) {
			ai_population.push({
				a: Math.random() * 2 - 1, 
				b: Math.random() * 2 - 1, 
				c: Math.random() * 2 - 1, 
				d: Math.random() * 2 - 1
			});
		}
	} else {
		//if it is defined, reproduce using it
		var genePool = [];
		var shares = ai_sharesMax;

		//put networks into gene pool based on their fitness
		for (var n=0; n<ai_populationPaired.length; n++) {
			for (var r=0; r<shares; r++) {
				genePool.push(ai_populationPaired[n][0]);
			}
		}

		ai_population = [];
		var parent1;
		var parent2;
		while (ai_population.length < ai_populationGoal) {
			parent1 = Math.floor(randomBounded(0, populationPullArr.length-0.01));
			parent2 = Math.floor(randomBounded(0, populationPullArr.length-0.01));
			//make sure the parents aren't the same 
			while (parent1 == parent2) {
				parent2 =  Math.floor(randomBounded(0, populationPullArr.length-0.01));
			}

			//merge the two
			var child = {
				a: ((Math.random() > 0.5) ? parent1.a : parent2.a) + (Math.random() < ai_mutationRate) * boolToSigned(Math.random() > 0.5) * ai_mutationAmount,
				b: ((Math.random() > 0.5) ? parent1.b : parent2.b) + (Math.random() < ai_mutationRate) * boolToSigned(Math.random() > 0.5) * ai_mutationAmount,
				c: ((Math.random() > 0.5) ? parent1.c : parent2.c) + (Math.random() < ai_mutationRate) * boolToSigned(Math.random() > 0.5) * ai_mutationAmount,
				d: ((Math.random() > 0.5) ? parent1.d : parent2.d) + (Math.random() < ai_mutationRate) * boolToSigned(Math.random() > 0.5) * ai_mutationAmount,
			}
			ai_population.push(child);
		}
	}

	//create paired population from the new generation
	ai_populationPaired = [];
	for (var network of ai_population) {
		ai_populationPaired.push([network, calculateFitnessFor(network)]);
	}




	
}

function trimPieceArr(arr) {
	//cut off top and bottom
	while (+arr[0] == 0) {
		arr = arr.slice(1);
	}

	while (+arr[arr.length-1] == 0) {
		arr.pop();
	}

	//left side
	var goLoop = true;
	while (goLoop) {
		for (var a=0; a<arr.length; a++) {
			//if there's a block there stop the slicing
			if (arr[a][0] != "0") {
				goLoop = false;
			}
		}

		if (goLoop) {
			for (var a=0; a<arr.length; a++) {
				arr[a] = arr[a].slice(1);
			}
		}
	}

	//right side
	goLoop = true;
	while (goLoop) {
		for (var a=0; a<arr.length; a++) {
			//if there's a block there stop the slicing
			if (arr[a][arr[a].length-1] != "0") {
				goLoop = false;
			}
		}

		if (goLoop) {
			for (var a=0; a<arr.length; a++) {
				arr[a] = arr[a].slice(0, -1);
			}
		}
	}
	return arr;
}