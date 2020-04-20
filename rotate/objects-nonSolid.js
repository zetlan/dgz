class Character extends Main {
    constructor(x, y, z) {
		super(x, y, z);
		
		this.drawCoord = [];
		this.drawCoord2 = [];
		
		this.r = 5;
		this.abovePoint = [x, y + this.r, z];

        this.dx = 0;
        this.dy = 0;
		this.dz = 0;
		
		this.ax = 0;
		this.az = 0;

		this.mS = 2;
		this.mV = 9.8;
		this.friction = 0.85;
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
    }

    beDrawn() {
		//adjusting the above point
		this.abovePoint = [this.x, this.y + this.r, this.z];

		this.drawCoord = spaceToScreen([this.x, this.y, this.z]);
		this.drawCoord2 = spaceToScreen(this.abovePoint);

		//display size depends on distance, so the transform is done for two points and then the 2d distance between them is tested
		var dispSize = Math.abs(this.drawCoord[1] - this.drawCoord2[1]);
		ctx.fillStyle = characterColor;
		ctx.strokeStyle = characterColor;
		gPoint(this.drawCoord2[0], this.drawCoord2[1], dispSize);

		if (loadingMap.rotating) {
			ctx.stroke();
		} else {
			ctx.fill();
		}
	}
	
	getCameraDist() {

	}
}



class Text {
	constructor(textIndexPerLine) {
		this.cDist = 0;
		this.text = textIndexPerLine;
		this.age = 0;
		this.mA = 70;
	}

	beDrawn() {
		ctx.font = "23px Century Gothic";
		ctx.textAlign = "center";
		ctx.fillStyle = textColor;
		//opacity in case of rotation
		if (loadingMap.rotating) {
			ctx.globalAlpha = 1 - loadingMap.rotPercent;
			ctx.fillText(this.text, canvas.width * 0.5, canvas.height * 0.1);
			ctx.globalAlpha = 1;
			this.age = 0;
		//opacity in case of age
		} else if (this.age < this.mA) {
			ctx.globalAlpha = this.age / this.mA;
			ctx.fillText(this.text, canvas.width * 0.5, canvas.height * 0.1);
			ctx.globalAlpha = 1;
			this.age += 1;
		//regular case
		} else {
			ctx.fillText(this.text, canvas.width * 0.5, canvas.height * 0.1);
		}
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