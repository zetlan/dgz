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

		//mS is max horizontal movement, mV is max vertical movement
		this.mS = 1.8;
		this.mV = 9.8;
		this.friction = 0.8;
		this.gravity = 0.5;
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

		//move player if not rotating
		if (!loadingMap.rotating) {
			this.x += this.dx;
			this.y += this.dy;
			this.z += this.dz;
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