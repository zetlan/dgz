/*
a lot of these functions are created for an assignment specification, which is why they may seem weird or out of place given the rest of this codebase. Still, many of them are still useful for creating the AI.


INDEX:
*/



/* Given an input board string in row major order, outputs an array of all the possible boards via all possible pieces placed.
Extra arguments specify what limitations to place on what the function outputs. 
PieceId will limit the output to just the possible states when given a single piece to place, and pieceRot will limit the output 
to just the possible states with the piece and with a specified rotation. */
function aiMdl_givePossibleStates(inputState, pieceIdOPTIONAL, pieceRotOPTIONAL) {
	var outStrs = [];

	//if there's a piece ID, then the possibilities only need to be calculated for one piece
	if (pieceIdOPTIONAL != undefined) {
		if (pieceRotOPTIONAL != undefined) {
			//get array representation of the piece
			var arrRep = representPieceWithArr(pieceData[2], pieceData[3]);

			//cut off top and bottom
			while (+arrRep[0] == 0) {
				arrRep = arrRep.slice(1);
			}

			while (+arrRep[arrRep.length-1] == 0) {
				arrRep.pop();
			}

			//cut off unnecessary left side
			var goLoop = true;
			while (goLoop) {
				for (var a=0; a<arrRep.length; a++) {
					//if there's a block there stop the slicing
					if (arrRep[a][0] != "0") {
						goLoop = false;
					}
				}

				if (goLoop) {
					for (var a=0; a<arrRep.length; a++) {
						arrRep[a] = arrRep[a].slice(1);
					}
				}
			}

			//cut off unnecessary right side
			goLoop = true;
			while (goLoop) {
				for (var a=0; a<arrRep.length; a++) {
					//if there's a block there stop the slicing
					if (arrRep[a][arrRep[a].length-1] != "0") {
						goLoop = false;
					}
				}

				if (goLoop) {
					for (var a=0; a<arrRep.length; a++) {
						arrRep[a] = arrRep[a].slice(0, -1);
					}
				}
			}

			//the width of the array now acts as a barrier
			var upperXBound = board_width - arrRep[0].length;

			for (var x=0; x<=upperXBound; x++) {
				//first get a copy of the array
			}

			return outStrs;
		}

		//just do all the rotations lol
		for (var r=0; r<=piece_posLimits; r++) {
			outStrs = outStrs.concat(aiMdl_givePossibleStates(inputState, pieceIdOPTIONAL, r));
		}

		return outStrs;
	}

	//just do all the pieces lol
	Object.keys(piece_pos).forEach(p => {
		outStrs = outStrs.concat(aiMdl_givePossibleStates(inputState, p));
	});

	return outStrs;

}

function aiMdl_convertToArr(inputStr) {
	//the string is in left-to-right, top-to-bottom order, so it's not particularly difficult
	var outArr = [];
	for (var a=0; a<inputStr.length; a++) {
		if (a % board_width == 0) {
			outArr.push([]);
		}
		outArr.push((inputStr[a] == "#") ? color_palettes.pColors["I"] : " ");
	}
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

function calculateFitness(board, weights) {
	var fitness = 0;

	//step 1: figure out relavant parameters of the board
	var maxHeight;
	var minHeight;
	var numHoles;
	var variance;

	//step 2: calculate fitness based on weights

	return (maxHeight * weights.a + minHeight * weights.b + numHoles * weights.c + variance * weights.d);
}

function calculateFitnessFor(network) {
	var points = 0;

	//step 1: use network's weights to determine what the best board state is
	//step 2: get to the best board state, adding points as necessary
	//step 3: repeat until game is over


	//step 4: return the point value as fitness score
	return points;
}

function trainOnce() {
	
}