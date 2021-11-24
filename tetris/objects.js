
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
			if (this.audio.paused || this.audio.currentTime + audio_tolerance >= this.audio.duration) {
				this.time = 0;
				this.reset();
			}
		}

		//changing audio
		this.change();

		//set volume
		if (this.audio != undefined) {
			this.audio.volume = this.volume * (1 - (this.time / audio_fadeTime));
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
		this.audio.currentTime = 0;
		this.audio.volume = this.volume;
		this.audio.play();
	}
}





class System_Old {
	constructor() {
		//create board
		this.board = [];
		for (var f=0; f<board_height+2; f++) {
			//I don't typically like using array constructors but this makes the code more compact
			this.board.push(new Array(board_width));
		}
		this.clearables = [0];

		this.time = 0;
		this.score = 0;
		this.timeModular = 0;
		this.linesCleared = 0;
		this.linesRequired = 10;

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
		var sqSize = board_screenPercentage * (canvas.height / (this.board.length - 2));
		var sqCenterY = (this.board.length - 2) / 2;
		var sqCenterX = (this.board[0].length / 2);
		var pal = this.palette;
		//do not draw the top two lines, those are just for computation.
		for (var y=2; y<this.board.length; y++) {
			for (var x=0; x<this.board[y].length; x++) {
				pal.draw(this.board[y][x] || this.palette.mg, centerX + ((x - sqCenterX) * sqSize), centerY + ((y - sqCenterY - 2) * sqSize), sqSize);
			}
		}
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
				if (this.clearables[a] > Math.min(this.framesPerTile, board_clearTime)) {
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
			console.log(clearedLines)
			this.score += (100 + ((clearedLines - 1) * 200) + ((clearedLines == 4) * 100)) * this.level;
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

	createBag() {
		//figure out which pieces go into the bag
		var allPieces = Object.keys(piece_pos);
		//shuffle into the bag
		this.dropBag = [];
		while (allPieces.length > 0) {
			this.dropBag.push(allPieces.splice(Math.floor(Math.random() * allPieces.length), 1)[0]);
		}
	}

	createPiece() {
		if (this.dropBag.length < 1) {
			this.createBag();
		}
		//x, y corresponds to center
		this.dropData = [Math.floor(this.board[0].length / 2), 0, this.dropBag.pop(), 0];
		this.placePieceInArr(this.dropData);
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

	storePiece() {

	}

	twistPiece(rotChange) {
		//remove the old spot
		this.removePieceFromArr(this.dropData);

		var oldRot = this.dropData[3];
		this.dropData[3] = (this.dropData[3] + 4 + rotChange) % piece_pos[this.dropData[2]].length;
		//figure out which kicks to apply
		var kickRef = `${oldRot}>>${this.dropData[3]}`;

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
		//grab new piece if necessary
		if (this.dropData.length < 1) {
			//yoink piece from bag
			this.createPiece();
		}

		//lower piece if that's necessary
		if (this.timeModular % this.framesPerTile == this.framesPerTile - 1) {
			this.timeModular = 0;
			if (!this.movePiece(0, 1)) {
				//if it's struck, lock it
				this.createPiece();
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
		this.palette = color_palettes[0];

		//holding panel
		this.canHold = true;
		this.hold = undefined;
		this.holdBoard = [new Array(4), new Array(4), new Array(4), new Array(4)];

		this.lockTime = 0.5;
	}

	colorLine(line) {
		for (var y=0; y<this.board[line].length; y++) {
			this.board[line][y] = cLinterp(this.board[line][y], this.palette.clearColor, 5 / board_clearTime);
		}
	}

	createPiece() {
		this.canHold = true;
		super.createPiece();
	}

	hardDrop() {
		while (this.movePiece(0, 1)) {
			this.score += 2;
			//just run this until it can't be run anymore
		}
		//also create a new piece instantly
		this.createPiece();
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
			this.holdBoard = representPieceWithArr(this.hold);
			this.createPiece();
		} else {
			var buffer1 = this.dropData[2];
			this.dropData = [Math.floor(this.board[0].length / 2), 0, this.hold, 0];
			this.placePieceInArr(this.dropData);
			this.hold = buffer1;
		}

		this.canHold = false;
	}
}