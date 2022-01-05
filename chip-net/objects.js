//puzzles are a grid of squares. Some squares are wires, some are chips, and one or more may be power tiles.

class Puzzle {
	constructor() {
		this.data = [[]];
		this.generatePositions = [];
		this.colorType = 0;
	}

	tick() {
		//update all rotations for all nodes
		var snapDist = rotation_speed * 0.8;

		this.data.forEach(d => {
			d.forEach(n => {
				if (n != undefined) {
					if (n.rotDir != 0) {
						n.rotation += Math.sign(n.rotDir) * rotation_speed;
	
						if (n.rotation < 0) {
							n.rotation += Math.PI * 2;
						}
						//if it's too close to a cardinal direction, snap to that
						if (n.rotation % (Math.PI / 2) < snapDist || n.rotation % (Math.PI / 2) > (Math.PI / 2) - snapDist) {
							n.rotation = Math.round(n.rotation / (Math.PI / 2)) * (Math.PI * 0.5) % (Math.PI * 2);
							n.rotDir -= Math.sign(n.rotDir);
						}
					}
				}
			});
		});
		this.updatePower();
	}

	updatePower() {
		//update power
		//first set all nodes' power to 0
		this.data.forEach(d => {
			d.forEach(n => {
				if (n != undefined) {
					//reduce decimal component
					n.power = Math.floor(n.power) + ((n.power % 1) * 0.85);
					if (n.power % 1 < 0.001) {
						n.power = -1;
					}
				}
			});
		});

		//loop through generator positions, and spread out power to lines
		for (var g=0; g<this.generatePositions.length; g++) {
			if (this.generatePositions[g] != undefined) {
				this.updatePower_recursive(this.generatePositions[g][0], this.generatePositions[g][1], undefined, g);
				//make sure rotating generators still get power
				if (this.data[this.generatePositions[g][1]][this.generatePositions[g][0]].power < g + 0.999) {
					this.data[this.generatePositions[g][1]][this.generatePositions[g][0]].power = g + 0.999;
				}
			}
			
		}
	}

	//the recursive helper function that spreads power from a power source
	updatePower_recursive(sourceX, sourceY, banDir, powerN) {
		var nowNode = this.data[sourceY][sourceX];
		//go to 3 decimal places for power

		//cannot power if turning!
		if (nowNode.rotDir != 0) {
			return;
		}

		if (Math.floor(nowNode.power) == -1 || (Math.floor(nowNode.power) == powerN && nowNode.power % 1 < 0.999)) {
			nowNode.power = powerN + 0.999;
		} else {
			if (nowNode.power > 9999) {
				return;
			}
			nowNode.power = 9999.999;
		}

		//spread to neighbors
		var off = Math.round(nowNode.rotation / (Math.PI * 0.5));
		var spread = [nowNode.connections[(4-off+0) % 4] == 1, nowNode.connections[(4-off+1) % 4] == 1, 
						nowNode.connections[(4-off+2) % 4] == 1, nowNode.connections[(4-off+3) % 4] == 1];

		for (var d=0; d<spread.length; d++) {
			if (spread[d] && d != banDir) {
				var newX = sourceX + dirRelate[d][0];
				var newY = sourceY + dirRelate[d][1];
				if (newX >= 0 && newX < this.data.length && newY >= 0 && newY < this.data.length && this.data[newY][newX] != undefined) {
					//only transfer if the neighbor matches up
					var neighborRot = Math.round(this.data[newY][newX].rotation / (Math.PI * 0.5));
					if (this.data[newY][newX].connections[(4 - neighborRot + 2 + d) % 4] == 1) {
						this.updatePower_recursive(newX, newY, (d + 2) % 4, powerN);
					}
				}
			}
		}
	}

	display() {
		var squareSize = (canvas.height * puzzle_screenSize) / this.data.length;
		var squareRadius = squareSize / 2;
		var totalWidth = squareSize * this.data[0].length;
		var totalHeight = squareSize * this.data.length;
		
		var startX = canvas.width * 0.5 - (totalWidth / 2);
		var startY = canvas.height * 0.5 - (totalHeight / 2);

		var pal = color_styles[this.colorType];

		//bg
		ctx.fillStyle = pal.bg;
		ctx.fillRect(startX, startY, squareSize * this.data[0].length, squareSize * this.data.length);

		ctx.font = `${squareSize / 2}px Ubuntu`;
		//loop through all nodes and draw them
		for (var y=0; y<this.data.length; y++) {
			for  (var x=0; x<this.data[y].length; x++) {
				if (this.data[y][x] != undefined) {
					var ex = startX + squareSize * x;
					var why = startY + squareSize * y;

					//line offsets
					var offsets = [];
					for (var a=0; a<this.data[y][x].connections.length; a++) {
						var angle = this.data[y][x].rotation + (Math.PI * 0.5 * a);
						//if there's a connection there, make an offset
						if (this.data[y][x].connections[a] == "1") {
							offsets.push([squareRadius * Math.cos(angle), squareRadius * -1 * Math.sin(angle)]);
						}
					}
					
					var magnitude = 1 - (puzzle_lineWidth / 2);

					//lines - unlit
					ctx.lineWidth = squareRadius * puzzle_lineWidth;
					ctx.strokeStyle = pal.wireUnlit;

					ctx.beginPath();
					offsets.forEach(e => {
						ctx.moveTo(ex + squareRadius, why + squareRadius);
						ctx.lineTo(ex + squareRadius + (e[0] * magnitude), why + squareRadius + (e[1] * magnitude));
					});
					ctx.stroke();

					//lines - lit
					if (this.data[y][x].power > -1) {
						var lineOpacity = this.data[y][x].power % 1;
						//overloaded vs generator color toggle
						var color = (this.data[y][x].power > 9999) ? pal.wireOverload : pal.generators[Math.floor(this.data[y][x].power) % pal.generators.length];
					}
					
					if (this.data[y][x].power > -1) {
						ctx.globalAlpha = lineOpacity;
						ctx.lineWidth = squareRadius * puzzle_lineWidth * (1 - puzzle_lineMargin);
						ctx.strokeStyle = color;
						magnitude = 1 - (ctx.lineWidth / squareSize);
	
						ctx.beginPath();
						offsets.forEach(e => {
							ctx.moveTo(ex + squareRadius, why + squareRadius);
							ctx.lineTo(ex + squareRadius + (e[0] * magnitude), why + squareRadius + (e[1] * magnitude));
						});
						ctx.stroke();
						ctx.globalAlpha = 1;
					}
					

					//chip?
					if (this.data[y][x].isChip) {
						//special drawing for chip types
						switch(this.data[y][x].data[0]) {
							case "generator":
								ctx.globalAlpha = lineOpacity;
								//generators are large and drawn without borders
								var margin = squareSize * 0.5 * (1 - puzzle_lineMargin / 2);
								ctx.fillStyle = color;
								ctx.fillRect(ex + (squareSize / 4) + margin, why + (squareSize / 4) + margin, squareSize * 0.5 - margin * 2, squareSize * 0.5 - margin * 2);
								ctx.globalAlpha = 1;
								break;
							default:
								ctx.fillStyle = pal.wireUnlit;
								ctx.fillRect(ex + squareSize / 4, why + squareSize / 4, squareSize * 0.5, squareSize * 0.5);
								if (this.data[y][x].power > -1) {
									ctx.globalAlpha = lineOpacity;
									var margin = squareSize * 0.5 * (1 - puzzle_lineMargin / 2);
									ctx.fillStyle = color;
									ctx.fillRect(ex + (squareSize / 4) + margin, why + (squareSize / 4) + margin, squareSize * 0.5 - margin * 2, squareSize * 0.5 - margin * 2);
									ctx.globalAlpha = 1;
								}
								break;
						}
					}
				} else {
					ctx.fillStyle = "#000";
					ctx.fillRect(startX + squareSize * x, startY + squareSize * y, squareSize, squareSize);
				}
			}
		}

		//draw the grid lines
		ctx.beginPath();
		ctx.strokeStyle = pal.bgLines;
		ctx.lineWidth = 1;

		for (var x=0; x<=this.data[0].length; x++) {
			ctx.moveTo(startX + squareSize * x, startY);
			ctx.lineTo(startX + squareSize * x, startY + totalHeight);
		}
		ctx.stroke();
		ctx.beginPath();
		for (var y=0; y<=this.data.length; y++) {
			ctx.moveTo(startX, startY + squareSize * y);
			ctx.lineTo(startX + totalWidth, startY + squareSize * y);
		}
		ctx.stroke();

		if (editor_active) {
			ctx.rect(startX + squareSize * (editor_x + 0.125), startY + squareSize * (editor_y + 0.125), squareSize * 0.75, squareSize * 0.75);
			ctx.stroke();
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
			this.data[y][x] = convertCharToObject(this.tileDat[char], this.chipDat[chipNum]);
			if (this.data[y][x].isChip) {
				chipNum += 1;
			}

		}
	}
} 





class House {
	constructor(image, ) {
		this.data = [[]];
		this.characters = [];
		this.playerControls = -1;
	}

	tick() {
		//should have player collide with objects
	}

	display() {
		//draw collision boxes if 
	}
}