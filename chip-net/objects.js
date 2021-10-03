//puzzles are a grid of squares. Some squares are wires, some are chips, and one or more may be power tiles.

class Puzzle {
	constructor() {
		this.data = [[]];
		this.colorType = 0;
	}

	tick() {
		//update all rotations for all nodes
		var snapDist = rotation_speed * 0.8;

		this.data.forEach(d => {
			d.forEach(n => {
				if (n.rotDir != 0) {
					n.rotation += n.rotDir * rotation_speed;

					if (n.rotation < 0) {
						n.rotation += Math.PI * 2;
					}
					//if it's too close to a cardinal direction, snap to that
					if (n.rotation % (Math.PI / 2) < snapDist || n.rotation % (Math.PI / 2) > (Math.PI / 2) - snapDist) {
						n.rotation = Math.round(n.rotation / (Math.PI / 2)) * (Math.PI * 0.5) % (Math.PI * 2);
						n.rotDir = 0;
					}
				}
			});
		});
	}

	updatePower() {
		//update power
	}

	//the recursive helper function that spreads power from a power source
	updatePower_recursive(sourceX, sourceY) {

	}

	display() {
		var totalSize = canvas.height * puzzle_screenSize;
		var radius = totalSize / 2;
		var squareSize = totalSize / this.data.length;
		var squareRadius = squareSize / 2;
		var startX = canvas.width * 0.5 - radius;
		var startY = canvas.height * 0.5 - radius;

		var pal = puzzle_colorSets[this.colorType];

		//bg
		ctx.fillStyle = pal.bg;
		ctx.fillRect(startX, startY, totalSize, totalSize);

		//loop through all nodes and draw them
		for (var y=0; y<this.data.length; y++) {
			for  (var x=0; x<this.data[y].length; x++) {
				//box
				ctx.beginPath();
				ctx.lineWidth = 1;
				ctx.strokeStyle = pal.bgLines;
				
				ctx.moveTo(startX + (squareSize * x), startY + (squareSize * y));
				ctx.lineTo(startX + (squareSize * x), startY + (squareSize * (y + 1)));

				ctx.moveTo(startX + (squareSize * x), startY + (squareSize * y));
				ctx.lineTo(startX + (squareSize * (x + 1)), startY + (squareSize * y));
				ctx.stroke();

				// ctx.font = `${20}px Century Gothic`;
				// ctx.fillStyle = "#FFF";
				// ctx.fillText(this.data[y][x].rotDir, startX + (squareSize * x), startY + (squareSize * y));

				//lines - unlit
				ctx.lineWidth = squareRadius * 0.25;
				ctx.strokeStyle = pal.wireUnlit;
				ctx.beginPath();
				for (var a=0; a<4; a++) {
					var angle = this.data[y][x].rotation + (Math.PI * 0.5 * a);
					//if there's a connection there, draw the line
					if (this.data[y][x].connections[a] == "1") {
						var offset = [squareRadius * 0.875* Math.cos(angle), squareRadius * 0.875 * Math.sin(angle)];
						ctx.moveTo(startX + squareRadius + (squareSize * x), startY + squareRadius + (squareSize * y));
						ctx.lineTo(startX + squareRadius + (squareSize * x) + offset[0], startY + squareRadius + (squareSize * y) + offset[1]);
					}
				}
				ctx.stroke();

				//lines - lit
			}
		}
	}
}

class Puzzle_Preset extends Puzzle {
	constructor(tileData, chipIDs) {
		super();

		this.tileDat = tileData;
		this.chipDat = chipIDs.split("|");
		//turn data into interactable puzzle
		this.convertData();
	}

	convertData() {
		var puzzSize = Math.sqrt(this.tileDat.length);
		var chipNum = 0;
		var x;
		var y;
		for (var char=0; char<this.tileDat.length; char++) {
			x = char % puzzSize;
			y = Math.floor(char / puzzSize);
			//make sure data slot is defined
			if (this.data[y] == undefined) {
				this.data[y] = [];
			}

			//put object into slot
			this.data[y][x] = this.convertCharToObject(this.tileDat[char], this.chipDat[chipNum]);
			if (this.data[y][x].isChip) {
				chipNum += 1;
			}

		}
	}

	/*
	0 - chip
	1 - I piece
	2 - L piece
	3 - T piece
	*/
	convertCharToObject(character, extendedChipData) {
		//create object
		switch (character[0]) {
			case "0":
				return {
					isChip: true,
					rotation: 0,
					rotDir: 0,
					connections: '1000',
					data: extendedChipData,
				};
			case "1":
				return {
					rotation: 0,
					rotDir: 0,
					connections: '1010'
				};
			case "2":
				return {
					rotation: 0,
					rotDir: 0,
					connections: '0110'
				};
			case "3":
				return {
					rotation: 0,
					rotDir: 0,
					connections: '1110'
				};
		}
	}
}