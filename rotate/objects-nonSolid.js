class Particle extends Main {
	constructor(x, y, z, color) {
		super(x, y, z);
		this.home = [x, y, z];
		this.storeCoord = [x, y, z];
		this.drawCoord = [];
		this.drawCoordP = [];
		this.drawCoordP2 = [];
		this.drawCoord2 = [];
		this.fDC = [];
		this.color = color;

		this.r = 2.5;
		this.dispSize = 0;
		this.abvP = [x, y + this.r, z];
		this.rollback = false;

		this.dx = 0;
		this.dy = 0;
		this.dz = 0;

		this.mS = 4;
	}

	tick() {
		//randomly change velocity
		this.dx += (Math.random() - 0.5) / 4;
		this.dy += (Math.random() - 0.5) / 4;
		this.dz += (Math.random() - 0.5) / 4;

		//if the particle is close to the edge of the map, influence velocity
		if (Math.abs(this.x) > mapSize - 30) {
			this.dx += this.x / (-4 * mapSize);
		}

		if (Math.abs(this.y) > mapSize - 30) {
			this.dy += this.y / (-4 * mapSize);
		}

		if (Math.abs(this.z) > mapSize - 30) {
			this.dz += this.z / (-4 * mapSize);
		}

		//capping velocity
		if (Math.abs(this.dx) > this.mS) {
			this.dx *= 0.95;
		}

		if (Math.abs(this.dy) > this.mS) {
			this.dy *= 0.95;
		}

		if (Math.abs(this.dz) > this.mS) {
			this.dz *= 0.95;
		}

		//changing position based on velocity
		this.x += this.dx;
		this.y += this.dy;
		this.z += this.dz;

		this.adjustPoints();
	}

	beDrawn() {
		ctx.fillStyle = this.color;
		var temp = ctx.strokeStyle;
		ctx.strokeStyle = this.color;
		//getting the spot to draw the particle based off the average of their current position and past position
		this.fDC = [(this.drawCoordP2[0] + this.drawCoordP[0] + this.drawCoord2[0]) / 3, (this.drawCoordP2[1] + this.drawCoordP[1] + this.drawCoord2[1]) / 3];
		gPoint(this.fDC[0], this.fDC[1], this.dispSize);

		if (loadingMap.rotating) {
			ctx.stroke();
		} else {
			ctx.fill();
		}
		ctx.strokeStyle = temp;
	}

	adjustPoints() {
		//adjusting the above point and other misc. points
		this.abvP = [this.x, this.y + this.r, this.z];
		this.drawCoordP2 = this.drawCoordP;
		this.drawCoordP = this.drawCoord2;
		this.drawCoord = spaceToScreen([this.x, this.y, this.z]);
		this.drawCoord2 = spaceToScreen(this.abvP);

		this.dispSize = Math.abs(this.drawCoord[1] - this.drawCoord2[1]);
	}

	getCameraDist() {
		return 0;
	}

	giveEnglishConstructor() {
		let {home} = this;
		const [x, y, z] = [home[0], home[1], home[2]];
		return `new Particle(${x}, ${y}, ${z})`;
	}
}



class Character extends Particle {
    constructor(x, y, z) {
		super(x, y, z, characterColor);
		this.drawCoordL = [];
		this.drawCoordR = [];
		this.drawCoordLL = [];
		this.drawCoordRR = [];

		this.avoidL = false;
		this.avoidR = false;
		this.avoidLL = false;
		this.avoidRR = false;
		this.avoid = false;
		
		this.r = 7.5;
		this.dispSize = 0;
		this.abvP = [x, y + this.r, z];
		
		this.ax = 0;
		this.az = 0;

		//mS is max horizontal movement, mV is max vertical movement speed, mO is max opacity speed
		this.mS = 1.8;
		this.mV = 9.8;
		this.mO = 0.05;
		this.friction = 0.8;
		this.gravity = 0.5;
		this.opSpeed = 0;

		this.tgt;
    }

    tick() {
		this.dx += this.ax;
		this.dz += this.az;

		//apply gravity
		this.dy -= this.gravity;

		//apply friction
		if (this.ax == 0) {
			this.dx *= this.friction;
		}
		if (this.az == 0) {
			this.dz *= this.friction;
		}

		//capping dx/dz
		if (Math.abs(this.dx) > this.mS) {
			if (this.dx > this.mS) {
				this.dx = this.mS;
			} else {
				this.dx = -1 * this.mS;
			}
		}

		if (Math.abs(this.dz) > this.mS) {
			if (this.dz > this.mS) {
				this.dz = this.mS;
			} else {
				this.dz = -1 * this.mS;
			}
		}

		//capping dy
		if (this.dy < -1 * this.mV) {
			this.dy = -1 * this.mV;
		}

		//check for a target block
		this.tgt = this.getAlphaObj();

		//actions to take only if not rotating
		if (!loadingMap.rotating) {
			//moving player
			this.x += this.dx;
			this.y += this.dy;
			this.z += this.dz;

			//changing opacity of target block
			if (this.tgt) {
				this.tgt.alpha += this.opSpeed;

				//keeping opacity in bounds
				if (this.tgt.alpha > 1 || this.tgt.alpha < 0) {
					if (this.tgt.alpha > 1) {
						this.tgt.alpha = 1;
					} else {
						this.tgt.alpha = 0;
					}
				}
			}
		}
		
		this.adjustPoints();

		//reset avoidance
		this.avoid = false;
		this.avoidD = false;
		this.avoidL = false;
		this.avoidR = false;
		this.avoidLL = false;
		this.avoidRR = false;
    }

    beDrawn() {
		super.beDrawn();
		var temp = ctx.strokeStyle;
		ctx.strokeStyle = characterOutsideColor;
		gPoint(this.fDC[0], this.fDC[1], this.dispSize);
		ctx.stroke();
		ctx.strokeStyle = temp;

		//drawing acquired colors
		//blue
		if (gameFlags["hasB"]) {
			ctx.fillStyle = bZoneColor;
			gPoint(this.fDC[0], this.fDC[1], this.dispSize * 0.8);
			ctx.fill();
		}

		//green
		if (gameFlags["hasG"]) {
			ctx.fillStyle = gZoneColor;
			gPoint(this.fDC[0], this.fDC[1], this.dispSize * 0.6);
			ctx.fill();
		}

		//yellow
		if (gameFlags["hasY"]) {
			ctx.fillStyle = yZoneColor;
			gPoint(this.fDC[0], this.fDC[1], this.dispSize * 0.4);
			ctx.fill();
		}

		//drawing red
		if (gameFlags["hasR"]) {
			ctx.fillStyle = rZoneColor;
			gPoint(this.fDC[0], this.fDC[1], this.dispSize * 0.2);
			ctx.fill();
		}
		//white
		if (gameFlags["hasB"] && gameFlags["hasG"] && gameFlags["hasR"] && gameFlags["hasY"]) {
			ctx.fillStyle = characterOutsideColor;
			var temp2 = ctx.globalAlpha;
			ctx.globalAlpha = (Math.sin(pTime / cutsceneTime) / 2) + 0.5;
			gPoint(this.fDC[0], this.fDC[1], this.dispSize);
			ctx.fill();
			ctx.globalAlpha = temp2;
		}

		//outer ring
		if (this.opSpeed != 0) {

		}
	}


	//function for determining which object to edit with the brightness/alpha editor (r/f)
	getAlphaObj() {
		//variable to store conditions for being the lowest/where the lowest was located
		var lowCheck = [-1, Infinity];

		//loop through all map objects
		for (var j=0;j<loadingMap.contains.length;j++) {
			/*undefined + anything results in NaN, and anything + NaN results in NaN,
			so an easy way to check if it's valid is to see if the values sum to NaN.
			*/
			var fsRef = loadingMap.contains[j];
			//if it's a valid object (has x y z, rx ry rz, and alpha) check it for editing
			if (!Number.isNaN(fsRef.x + fsRef.y + fsRef.z + fsRef.rx + fsRef.ry + fsRef.rz + fsRef.alpha)) {
				//get values for comparison
				var xPerDist = Math.abs(this.x - fsRef.x) / fsRef.rx;
				var yPerDist = Math.abs(this.y - fsRef.y) / fsRef.ry;
				var zPerDist = Math.abs(this.z - fsRef.z) / fsRef.rz;

				//if its values are lower than the previous values, overwrite them
				var totalDist = xPerDist + yPerDist + zPerDist;

				if (lowCheck[1] > totalDist) {
					lowCheck = [j, totalDist];
				}
			}
		}
		//return the final object
		if (lowCheck[0] > -1) {
			return loadingMap.contains[lowCheck[0]];
		} else {
			return false;
		}
		
	}

	adjustPoints() {
		super.adjustPoints();

		this.drawCoordL = [this.drawCoord2[0] - (this.dispSize / 2), this.drawCoord2[1]];
		this.drawCoordR = [this.drawCoord2[0] + (this.dispSize / 2), this.drawCoord2[1]];
		this.drawCoordLL = [this.drawCoord2[0] - this.dispSize, this.drawCoord2[1]];
		this.drawCoordRR = [this.drawCoord2[0] + this.dispSize, this.drawCoord2[1]];
	}
}



class Text {
	constructor(textIndexPerLine) {
		this.cDist = 0;
		this.text = textIndexPerLine;
		this.age = 0;
		this.mA = 40;
	}

	beDrawn() {
		ctx.font = "23px Century Gothic";
		ctx.textAlign = "center";
		ctx.fillStyle = textColor;
		var alfred = ctx.globalAlpha;
		//normal case
		if (!loadingMap.rotating) {
			ctx.globalAlpha = this.age / this.mA;
			ctx.fillText(this.text, canvas.width * 0.5, canvas.height * 0.1);
			
			if (this.age < this.mA) {
				this.age += 1;
			}
		} else if (this.age > 0) {
			//if the loading map is rotating and age is >0, that means this has been loaded before and should fade out
			
			ctx.globalAlpha = 1 - loadingMap.rotPercent;
			if (loadingMap.rotPercent > 0.9) {
				this.age = 0;
			}
			ctx.fillText(this.text, canvas.width * 0.5, canvas.height * 0.1);
		}
		//however if the loading map is rotating and age is <= 0, this is not been loaded and should not fade out/in

		ctx.globalAlpha = alfred;
	}

	tick() {
	}

	getCameraDist() {
		this.cDist = 0;
	}

	giveEnglishConstructor(radians) {
		let {text} = this;
		return `new Text("${text}")`;
	}
}

class Track extends Main {
	constructor(x1, y1, z1, x2, y2, z2, periodINT, offsetINT, object) {
		super(x1, y1, z1);
		this.contains = object;
		this.construct();

		this.o = offsetINT;
		this.p = periodINT;

		this.dx = 0;
		this.dy = 0;
		this.dz = 0;
		
		this.rx = x2;
		this.ry = y2;
		this.rz = z2;

		this.xyP1 = [];
		this.xyP2 = [];
	}

	construct() {
		//changing coordinates for object based on pTime
		var [oldX, oldY, oldZ] = [this.contains.x, this.contains.y, this.contains.z];
		//this formula models the percentage off of a sine wave customized by period, offset, and the current pTime.
		var percent = (Math.cos((((1 / this.p) * pTime) + (this.o / this.p)) * Math.PI * 2) / 2) + 0.5;

		//linterp for the correct xyz part
		//I disguised xyz1/xyz2 as xyz/rx ry rz so that it would be easier to edit with the traditional editor
		[this.contains.x, this.contains.y, this.contains.z] = [linterp(this.x, this.rx, percent), linterp(this.y, this.ry, percent), linterp(this.z, this.rz, percent)];
		this.contains.construct();

		this.xyP1 = spaceToScreen([this.x, this.y, this.z]);
		this.xyP2 = spaceToScreen([this.rx, this.ry, this.rz]);

		//updating dx/dy/dz
		var [newX, newY, newZ] = [this.contains.x, this.contains.y, this.contains.z];

		this.dx = newX - oldX;
		this.dy = newY - oldY;
		this.dz = newZ - oldZ;
	}

	tick() {
		//run collision for object
		//get collision state before object
		var colState = [player.avoidLL, player.avoidL, player.avoid, player.avoidR, player.avoidRR];
		colState = JSON.stringify(colState);

		this.contains.tick();
		
		var newColState = [player.avoidLL, player.avoidL, player.avoid, player.avoidR, player.avoidRR];
		newColState = JSON.stringify(newColState);
		//the collision states are stringified so that they can be compared

		//give the player velocity if they are on the block
		if (newColState != colState) {
			player.x += this.dx;
			player.y += this.dy;
			player.z += this.dz;
		}
	}

	beDrawn() {
		//construct self and object (this is in beDrawn so that rotation doesn't cause visual issues)
		this.construct();

		gLine(this.xyP1, this.xyP2);
		this.contains.beDrawn();
	}

	getCameraDist() {
		var tX;
		var tZ;
		try {
			[tX, tZ] = rotate((this.x + this.rx) / 2, (this.z + this.rz) / 2, loadingMap.angle);
		} catch(error) {
			tX =( this.x + this.rx) / 2;
			tZ = (this.z + this.rz) / 2;
		}
		
		this.cDist = getCameraDist([[tX, this.y, tZ]]);
	}

	giveEnglishConstructor(radians) {
		let {x, y, z, rx, ry, rz, p, o, contains} = this;

		//stringifying to avoid data loss
		contains = contains.giveEnglishConstructor(radians);
		//rotate xz1 and xz2
		[x, z] = rotate(x, z, radians);
		[rx, rz] = rotate(rx, rz, radians);
		[x, z, rx, rz] = [Math.round(x), Math.round(z), Math.round(rx), Math.round(rz)];

		return `new Track(${x}, ${y}, ${z}, ${rx}, ${ry}, ${rz}, ${p}, ${o}, ${contains})`;
	}
}