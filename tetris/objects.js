
//houses all classes
class AudioChannel {
	constructor(volume) {
		this.audio = undefined;
		this.target = undefined;
		this.volume = volume;
		this.time = 0;
	}

	tick() {
		//if the current sound isn't played, then play it. Also does looping.
		if (this.audio != undefined) {
			//if the file's time is past the loop duration, set it back by the amount of the loop
			var bps = (this.audio.bpm / 60);
			var audioBeatNum = (this.audio.file.currentTime + audio_tolerance) * bps;
			var loopBeatNum = (this.audio.loopEnd - this.audio.loopStart);
			if (this.audio.file.paused || audioBeatNum >= this.audio.loopEnd) {
				this.time = Math.max(0, this.time - (loopBeatNum / bps));
				this.reset();
			}
		}

		//changing audio
		this.change();

		//set volume
		if (this.audio != undefined) {
			this.audio.file.volume = this.volume * (1 - (this.time / audio_fadeTime));
		}
	}

	change() {
		//if the audios are different, fade them out and then play
		if (this.target != this.audio) {
			this.time += 1;

			//if time is up, snap volume up and change audio
			//alternatively, a change from undefined happens instantly
			if (this.time > audio_fadeTime || this.audio == undefined) {
				this.time = 0;
				this.audio = this.target;
				if (this.audio != undefined) {
					this.reset();
				}
				return;
			}
		} else {
			//if the audios are the same and time is greater than 0, subtract time
			if (this.time > 0) {
				this.time -= 1;
			}
		}
	}

	//starts playing the current audio file, from the beginning
	reset() {
		this.audio.file.currentTime = 0;
		this.audio.file.volume = this.volume;
		this.audio.file.play();
	}
}





class System_Old {
	constructor() {
		this.font = `VT323`;
		//create board
		this.board = [];
		for (var f=0; f<board_height+board_heightBuffer; f++) {
			//I don't typically like using array constructors but this makes the code more compact
			this.board.push(new Array(board_width));
		}
		this.clearables = [0];

		this.time = 0;
		this.score = 0;
		this.timeModular = 0;
		this.linesCleared = 0;
		this.linesRequired = 10;
		this.stopped = false;

		//which piece is dropping?
		//[x, y, type, orientation]
		this.dropData = [];
		//the bag to hold randomized items
		this.dropBag = [];

		//difficulty data
		this.level = 1;
		this.framesPerTile = framesPerSecond;
		this.palette = color_palettes[1];
	}

	beDrawn(centerX, centerY) {
		//figure out square size
		var sqSize = board_screenPercentage * (canvas.height / (this.board.length - board_heightBuffer));
		var sqCenterY = ((this.board.length - board_heightBuffer) / 2) - board_verticalAdjust;
		var sqCenterX = (this.board[0].length / 2);

		//do not draw the top two lines, those are just for computation.
		for (var y=board_heightBuffer; y<this.board.length; y++) {
			for (var x=0; x<this.board[y].length; x++) {
				this.palette.draw(this.board[y][x] || this.palette.mg, centerX + ((x - sqCenterX) * sqSize), centerY + ((y - sqCenterY - board_heightBuffer) * sqSize), sqSize);
			}
		}

		//score at the top
		this.beDrawn_score(centerX - (this.board[0].length / 2) * sqSize, centerX + (this.board[0].length / 2) * sqSize, (centerY - (sqSize * (sqCenterY))) / 2);
	}

	beDrawn_score(xMin, xMax, yPos) {
		ctx.fillStyle = this.palette.text;
		ctx.textAlign = "center";
		ctx.font = `${Math.round(canvas.height / 22)}px ${this.font}`;
		ctx.fillText(this.score.toString().padStart(6, "0"), xMin + (xMax - xMin) / 2, yPos);
	}

	checkClearLines() {
		//store amount of cleared lines
		var clearedLines = this.clearables.reduce((a, b) => {return a + (b == true)});

		//ignore unlocked piece for purposes of completing lines
		this.removePieceFromArr(this.dropData);
		var lnGood = true;
		for (var a=this.board.length-1; a>=0; a--) {
			lnGood = true;
			for (var c=0; c<this.board[a].length; c++) {
				if (this.board[a][c] == undefined) {
					lnGood = false;
				}
			}

			if (lnGood) {
				this.clearables[a] = (this.clearables[a] + 1) || 1;
				//if the frame is high enough, clear the line
				if (this.clearables[a] > Math.min(this.framesPerTile, this.clearTime)) {
					this.clearLine(a);
				} else {
					//get all of the values closer to white
					this.colorLine(a);
				}
			}
		}
		this.placePieceInArr(this.dropData);

		//if amount of clearing lines has increased, update score based on how many the player got at a time
		clearedLines = this.clearables.reduce((a, b) => {return a + (b == true)}) - clearedLines;
		if (clearedLines > 0) {
			this.score += this.scoreForLines(clearedLines);
		}
	}

	colorLine(line) {
		for (var y=0; y<this.board[line].length; y++) {
			this.board[line][y] = this.palette.clearColor;
		}
	}

	clearLine(line) {
		this.board.splice(line, 1);
		this.board.splice(0, 0, new Array(this.board[1].length));
		this.clearables.splice(line, 1);
		this.clearables.splice(0, 0, 0);

		//update stats
		this.linesCleared += 1;
		if (this.linesCleared % board_linesRequired == 0) {
			this.level += 1;
			//standard speed curve gives seconds per drop, multiply by 60 for frames
			this.framesPerTile = Math.round(framesPerSecond * (0.8 - ((this.level-1) * 0.007)) ** (this.level - 1));
		}
	}

	createPiece() {
		if (this.dropBag.length < 1) {
			this.dropBag = createBag();
		}
		//x, y corresponds to center
		this.dropData = [Math.floor(this.board[0].length / 2), 0, this.dropBag.pop(), 0];
		if (!this.placePieceInArr(this.dropData)) {
			//if there's a problem placing the piece, it's game over
			this.stopped = true;
			this.sendHighScore();
			game_substate = 1;
		}
	}

	endPiece() {
		this.lockTime = 0;
		this.createPiece();
	}

	hardDrop() {
		
	}

	movePiece(xChange, yChange) {
		//remove the previous piece
		this.removePieceFromArr(this.dropData);
		this.dropData[0] += xChange;
		this.dropData[1] += yChange;
		//try putting it there
		if (!this.placePieceInArr(this.dropData)) {
			//if that doesn't work, move piece back and send error signal
			this.dropData[0] -= xChange;
			this.dropData[1] -= yChange;
			this.placePieceInArr(this.dropData);
			return false;
		}
		return true;
	}

	scoreForLines(clearedLines) {
		return (100 + ((clearedLines - 1) * 200) + ((clearedLines == 4) * 100)) * this.level;
	}

	sendHighScore() {
		addHighScore([data_persistent.name1, this.score, "modern"]);
	}

	storePiece() {

	}

	twistPiece(rotChange) {
		//remove the old spot
		this.removePieceFromArr(this.dropData);

		var oldRot = this.dropData[3];
		this.dropData[3] = (this.dropData[3] + 4 + rotChange) % piece_pos[this.dropData[2]].length;

		//attempt to place new piece
		if (!this.placePieceInArr(this.dropData)) {
			//if it hasn't worked, prevent rotation from happening
			this.dropData[3] = oldRot;
			this.placePieceInArr(this.dropData);
		}
	}

	placePieceInArr(pieceData) {
		//figure out array of placement
		var offCoords = piece_pos[pieceData[2]][pieceData[3]][1];
		var placeArr = representPieceWithArr(pieceData[2], pieceData[3]);
		var trueX;
		var trueY;
		var blocksPlaced = 0;

		//loop through arr and add blocks where they should be added
		for (var ary=0; ary<placeArr.length; ary++) {
			for (var arx=0; arx<placeArr[ary].length; arx++) {
				//if it's a block, place it!
				if (placeArr[ary][arx] == "1") {
					trueX = arx + pieceData[0] - offCoords[0];
					trueY = ary + pieceData[1] + offCoords[1];
					//if it's out of bounds don't bother
					if (trueY < 0 || trueY > this.board.length-1 || trueX < 0 || trueX > this.board[0].length-1 || this.board[trueY][trueX] != undefined) {
						this.removePieceFromArr(pieceData, blocksPlaced);
						return false;
					}
					this.board[trueY][trueX] = this.palette.pColors[pieceData[2]];
					blocksPlaced += 1;
				}
			}
		}
		return true;
	}

	removePieceFromArr(pieceData, limitNumberOfBlocksOPTIONAL) {
		if (limitNumberOfBlocksOPTIONAL == undefined) {
			limitNumberOfBlocksOPTIONAL = 1e1001;
		}
		//like place piece, except removes values
		var offCoords = piece_pos[pieceData[2]][pieceData[3]][1];
		var placeArr = representPieceWithArr(pieceData[2], pieceData[3]);
		var trueX;
		var trueY;

		for (var ary=0; ary<placeArr.length; ary++) {
			for (var arx=0; arx<placeArr[ary].length; arx++) {
				if (placeArr[ary][arx] == "1") {
					//don't remove more than the limit
					limitNumberOfBlocksOPTIONAL -= 1;
					if (limitNumberOfBlocksOPTIONAL < 0) {
						return false;
					}
					trueX = arx + pieceData[0] - offCoords[0];
					trueY = ary + pieceData[1] + offCoords[1];
					if (trueY < 0 || trueY > this.board.length-1 || trueX < 0 || trueX > this.board[0].length || this.board[trueY][trueX] != this.palette.pColors[pieceData[2]]) {
						return false;
					}
					this.board[trueY][trueX] = undefined;
				}
			}
		}
		return true;
	}

	tick() {
		if (this.stopped) {
			return;
		}
		//grab new piece if necessary
		if (this.dropData.length < 1) {
			//yoink piece from bag
			this.createPiece();
		}

		//lower piece if that's necessary
		if (this.timeModular % this.framesPerTile == this.framesPerTile - 1 || this.lockTime > 0) {
			this.timeModular = 0;
			if (!this.movePiece(0, 1)) {
				//if it's struck, lock it
				if (this.lockTime == 0) {
					this.lockTime = this.lockTimeMax;
				}
				this.endPiece();
			} else {
				this.lockTime = 0;
			}
		}

		//clear lines
		this.checkClearLines();

		this.time += 1;
		this.timeModular += 1;
	}
}

class System_New extends System_Old {
	constructor() {
		super();
		this.font = `Ubuntu`;
		this.palette = color_palettes[0];

		this.clearTime = board_clearTime;

		this.ghostLocales = [];

		//holding panel
		this.canHold = true;
		this.hold = undefined;
		this.holdBoard = [new Array(4), new Array(4), new Array(4), new Array(4)];

		this.lockTime = 0;
		this.lockTimeMax = 0.5;
	}

	beDrawn(centerX, centerY) {
		super.beDrawn(centerX, centerY);

		var sqSize = board_screenPercentage * (canvas.height / (this.board.length - board_heightBuffer));
		var boardMinX = centerX - (sqSize * ((this.board[0].length / 2)));
		var boardMinY = centerY - (sqSize * ((((this.board.length - board_heightBuffer) / 2)) - board_verticalAdjust));

		//draw hold piece
		if (this.hold != undefined) {
			//determine edge of the board: 2 squares to the left and at the same height as the top
			var holdMinX = boardMinX - (sqSize * 2);
			var holdMinY = boardMinY + (sqSize * 0.7);
			var holdSqSize = sqSize / 3;

			//hold board
			for (var y=0; y<this.holdBoard.length; y++) {
				for (var x=0; x<this.holdBoard[y].length; x++) {
					if (this.holdBoard[y][x] == "1") {
						this.palette.draw(this.palette.pColors[this.hold], holdMinX + (holdSqSize * x), holdMinY + (holdSqSize * y), holdSqSize);
					}
				}
			}
		}

		ctx.strokeStyle = this.palette.pColors[this.dropData[2]];
		for (var bl of this.ghostLocales) {
			ctx.beginPath();
			ctx.rect(boardMinX + (bl[0] * sqSize), boardMinY + (bl[1] * sqSize), sqSize, sqSize);
			ctx.stroke();
		}
		//next pieces
	}
	
	checkClearLines() {
		super.checkClearLines();
		this.createGhosts();
	}

	colorLine(line) {
		for (var y=0; y<this.board[line].length; y++) {
			this.board[line][y] = cLinterp(this.board[line][y], this.palette.clearColor, 5 / this.clearTime);
		}
	}

	createGhosts() {
		this.ghostLocales = [];
		//remove piece from array
		this.removePieceFromArr(this.dropData);

		var finalDat = [this.dropData[0], this.dropData[1], this.dropData[2], this.dropData[3]];
		//drop piece until it doesn't fit
		while (this.placePieceInArr(finalDat)) {
			this.removePieceFromArr(finalDat);
			finalDat[1] += 1;
		}

		//figure out locations of ominos at final location
		var polyShape = representPieceWithArr(finalDat[2], finalDat[3]);
		var finalOffset = [finalDat[0] - piece_pos[finalDat[2]][finalDat[3]][1][0], finalDat[1] - (3 - piece_pos[finalDat[2]][finalDat[3]][1][1])];

		for (var y=0; y<polyShape.length; y++) {
			for (var x=0; x<polyShape[y].length; x++) {
				if (polyShape[y][x] == "1") {
					this.ghostLocales.push([finalOffset[0] + x, finalOffset[1] + y]);
				}
			}
		}
		this.placePieceInArr(this.dropData);
	}

	createPiece() {
		this.canHold = true;
		super.createPiece();
		this.createGhosts();
	}

	endPiece() {
		if (this.lockTime > 0) {
			this.lockTime = Math.max(0, this.lockTime - frameTime);
		}

		if (this.lockTime == 0) {
			this.createPiece();
		}
	}

	hardDrop() {
		while (this.movePiece(0, 1)) {
			this.score += 2;
			//just run this until it can't be run anymore
		}
		//also create a new piece instantly
		this.createPiece();
	}

	movePiece(xChange, yChange) {
		var val = super.movePiece(xChange, yChange);
		if (xChange != 0) {
			this.createGhosts();
		}
		return val;
	}

	storePiece() {
		//do not hold if not required to
		if (!this.canHold) {
			return;
		}

		//remove piece from the board
		this.removePieceFromArr(this.dropData);

		//swap the hold data with the current data
		if (this.hold == undefined) {
			this.hold = this.dropData[2];
			this.holdBoard = representPieceWithArr(this.hold, 0);
			this.createPiece();
		} else {
			var buffer1 = this.dropData[2];
			this.dropData = [Math.floor(this.board[0].length / 2), 0, this.hold, 0];
			this.placePieceInArr(this.dropData);
			this.hold = buffer1;
			this.holdBoard = representPieceWithArr(this.hold, 0);
			this.createGhosts();
		}

		this.canHold = false;
	}

	//I'm just rewriting the entire function to deal with wall kicks
	twistPiece(rotChange) {
		this.removePieceFromArr(this.dropData);

		var oldRot = this.dropData[3];
		this.dropData[3] = (this.dropData[3] + 4 + rotChange) % piece_pos[this.dropData[2]].length;

		//attempt to place new piece
		if (this.placePieceInArr(this.dropData)) {
			//if it's worked, escape!
			this.createGhosts();
			return true;
		}

		//it hasn't worked, move on
		this.removePieceFromArr(this.dropData);


		//figure out which kicks to apply
		var kickRef = `${oldRot}>>${this.dropData[3]}`;
		kickRef = piece_kicks[this.dropData[2]][kickRef];
		var kickIndex = 0;
		while (kickIndex < kickRef.length) {
			this.dropData[0] += kickRef[kickIndex][0];
			this.dropData[1] -= kickRef[kickIndex][1];

			if (!this.placePieceInArr(this.dropData)) {
				this.dropData[0] -= kickRef[kickIndex][0];
				this.dropData[1] += kickRef[kickIndex][1];
				kickIndex += 1;
			} else {
				this.createGhosts();
				return true;
			}
		}

		//if all the kicks have been exhausted
		if (kickIndex >= kickRef.length) {
			//the piece hasn't worked, prevent the rotation from happening
			this.dropData[3] = oldRot;
			this.placePieceInArr(this.dropData);
			return false;
		}
	}
}

class System_AI extends System_New {
	constructor() {
		super();
		this.palette = color_palettes[2];
		this.clearTime = Math.ceil(this.clearTime / 10);
		this.quitTimer = 100;

		//awareness is where the AI thinks the piece is
		this.aiAwareness = [-1, -1];
		//goals are where the AI wants the piece to be
		this.aiGoals = [-1, -1];
	}

	createPiece() {
		super.createPiece();
		this.createGoals();
	}

	createGoals() {
		//make sure to remove the piece from the board first
		this.removePieceFromArr(this.dropData);

		//create new goals
		this.aiAwareness[0] = -1;
		this.aiAwareness[1] = this.dropData[3];

		var modelBoard = this.board.slice(board_heightBuffer);
		var possibilities = aiMdl_givePossibleStatePaths(modelBoard, this.dropData[2]);

		//loop through all possibilities and choose the best one
		var bestFitness = -1e5;
		var bestState;
		this.aiGoals = undefined;
		var fitness;
		for (var state of possibilities) {
			if (state == ai_endStr) {
				if (this.aiGoals == undefined) {
					
				}
			}
			//use the judgement of the best AI
			fitness = calculateFitness(state[0], 0, ai_populationPaired[0][0]);
			if (fitness > bestFitness || this.aiGoals == undefined) {
				bestFitness = fitness;
				this.aiGoals = state.slice(1);
				bestState = state[0];
			}
		}
		//and put the piece back
		this.placePieceInArr(this.dropData);
	}

	scoreForLines(clearedLines) {
		return ai_scoring[clearedLines];
	}

	sendHighScore() {
		//make sure there's only ever 1 AI score on the leaderboard
		if (data_persistent.scores["modern"].length > 0) {
			var aiScores = data_persistent.scores["modern"].filter(score => score[0] == ai_name);
			if (aiScores.length > 0) {
				if (aiScores[0][1] > this.score) {
					return;
				}
				data_persistent.scores["modern"] = data_persistent.scores["modern"].filter(score => score[0] != ai_name);
			}
		}
		
		addHighScore([ai_name, this.score, "modern"]);
	}

	tick() {
		super.tick();
		if (this.stopped) {
			this.quitTimer -= 1;
			return;
		}

		if (this.aiGoals == undefined) {
			return;
		}

		//the AI is usually limited to 1 operation per tick, but if the level is too high that will change
		var operationsAllowed = 0.5 + (0.5 * (this.level > 1)) + (1 * (this.level > 5)) + Math.floor(this.level / 20);
		var operations = 0;

		if (operationsAllowed < 1) {
			if (animation % (1 / operationsAllowed) != 0) {
				return;
			}
		}

		//align piece with correct rotation
		while (this.aiAwareness[1] != this.aiGoals[1]) {
			operations += 1;
			var directionality = Math.sign(this.aiGoals[1] - this.aiAwareness[1]);
			this.twistPiece(directionality);
			this.aiAwareness[1] += directionality;

			if (operations >= operationsAllowed) {
				return;
			}
		}

		//x position can only be calculated after twisting the piece, because twisting might cause the piece to change widths, which would throw off the visible coordinates otherwise
		if (this.aiAwareness[0] == -1) {
			//if the AI doesn't know where the piece is (-1) calculate it
			operations += 1;

			var xCoordinate = 0;
			while (this.movePiece(-1, 0)) {
				xCoordinate += 1;
			}
			//move piece back
			this.movePiece(xCoordinate, 0);
			this.aiAwareness[0] = xCoordinate;

			if (operations >= operationsAllowed) {
				return;
			}
		}

		//actually moving the piece
		while (this.aiAwareness[0] != this.aiGoals[0]) {
			operations += 1;

			var directionality = Math.sign(this.aiGoals[0] - this.aiAwareness[0]);
			this.movePiece(directionality, 0);
			this.aiAwareness[0] += directionality;

			if (operations >= operationsAllowed) {
				return;
			}
		}

		//dropping the piece
		this.hardDrop();
	}
}