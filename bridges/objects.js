

class Island {
	constructor (points) {
		this.p = points;
	}
	
	beDrawn() {
		ctx.beginPath();
		ctx.fillStyle = groundColor;
		ctx.strokeStyle = beachColor;  
		ctx.moveTo(this.p[0][0], this.p[0][1]);
		for(var a = 1; a < this.p.length + 2; a++) {
			ctx.lineTo(this.p[a%(this.p.length)][0], this.p[a%(this.p.length)][1]);
		}
		ctx.fill();
		ctx.stroke();
	}
}
	


class Bridge {
	constructor (points, startLength) {
		this.p = points;
		this.bridgeLength = Math.floor(getDistBetween(points[0][0], points[0][1], points[1][0], points[1][1]));
		this.startLength = startLength;
		this.bridgeArr = [];
		this.constructBridge();
	}

	constructBridge() {
		//starting with the starting segments
		for (var r=0;r<this.startLength;r++) {
			this.bridgeArr.push(true);
		}

		//segments to be built
		for (var s=0;s<this.bridgeLength - this.startLength;s++) {
			this.bridgeArr.push(false);
		}
	}

	beDrawn() {
		//terms for readability
		var x1 = this.p[0][0];
		var y1 = this.p[0][1];
		var x2 = this.p[1][0];
		var y2 = this.p[1][1];

		//main bridge path
		ctx.strokeStyle = bridgeColor;
		dLine(this.p[0], this.p[1]);

		//start blob
		ctx.fillStyle = bridgeStartColor;
		dPoint(x1, y1, 5);
		ctx.fill();

		//end blob
		ctx.fillStyle = bridgeEndColor;
		dPoint(x2, y2, 5);
		ctx.fill();
		


	}
}

class GamePlayer {
	constructor (x, y) {
		this.x = x;
		this.y = y;

		this.dx = 0;
		this.dy = 0;

		this.ax = 0;
		this.ay = 0;
		this.friction = 0.85;
		this.movingFriction = 0.92;

		this.mS = 5;
	}


	tick() {

	}

	beDrawn() {

	}
}


class MenuPlayer {
	constructor (x, y) {
		this.ax = 0;
		this.ay = 0;
		this.dx = 0;
		this.dy = 0;
		this.x = x;
		this.y = y;

		this.r = 7;

		this.fric = 0.85;
		this.mFric = 0.92;

		this.mS = 5;
		this.aSpeed = 0.25;
		this.home = -1;
		this.confirmHome();
	}


	tick() {
		//updating velocity and position
		this.dx += this.ax;
		this.dy += this.ay;

		//friction
		if (Math.abs(this.ax) + Math.abs(this.ay) > 0) {
			[this.dx, this.dy] = [this.dx * this.mFric, this.dy * this.mFric];
		} else {
			[this.dx, this.dy] = [this.dx * this.fric, this.dy * this.fric];
		}
		//if not in a home, try to be in a home
		if (this.home == -1) {
			this.confirmHome();
		}
		//checking for validity while moving
		if (this.home != -1)  {
			//actual movement
			//getting 5 copies of the xy movement; offset by -90, -45, 0, 45, and 90 degrees
			//the further out left/right the movement is, the more it is reduced
			var mVec = [this.dx, this.dy];
			var r = Math.PI / 4;
			var mVecLL = rotate(this.dx * 0.3, this.dy * 0.3, Math.PI / 1.8);
			var mVecL = rotate(this.dx * 0.75, this.dy * 0.75, Math.PI / 4);
			var mVecR = rotate(this.dx * 0.75, this.dy * 0.75, Math.PI / -4);
			var mVecRR = rotate(this.dx * 0.3, this.dy * 0.3, Math.PI / -1.8);

			//first check the center one
			if (inPoly([this.x + mVec[0], this.y + mVec[1]], loadingMap[this.home].p)) {
				this.x += mVec[0];
				this.y += mVec[1];
				//if that doesn't work, check the left and right vectors
			} else if (inPoly([this.x + mVecR[0], this.y + mVecR[1]], loadingMap[this.home].p)) {
				this.x += mVecR[0];
				this.y += mVecR[1];
			} else if (inPoly([this.x + mVecL[0], this.y + mVecL[1]], loadingMap[this.home].p)) {
				this.x += mVecL[0];
				this.y += mVecL[1];
			//if those don't work, check the far left/right vectors
			} else if (inPoly([this.x + mVecRR[0], this.y + mVecRR[1]], loadingMap[this.home].p)) {
				this.x += mVecRR[0];
				this.y += mVecRR[1];
			} else if (inPoly([this.x + mVecLL[0], this.y + mVecLL[1]], loadingMap[this.home].p)) {
				this.x += mVecLL[0];
				this.y += mVecLL[1];
				//if those don't work, check the far left/right vectors
			}
		} else {
			//if off an island, just let movement happen
			this.x += this.dx;
			this.y += this.dy;
		}
	}

	beDrawn() {
		ctx.beginPath();
		ctx.fillStyle = playerColor;
		ctx.ellipse(this.x, this.y, this.r, this.r, 0, 0, Math.PI * 2);
		ctx.fill();
	}

	confirmHome() {
		//loop through all islands and find which one player is inside
		for (var u=0;u<loadingMap.length;u++) {
			//only check if it’s an island
			if (loadingMap[u].constructor.name == "Island") {
				if (inPoly([this.x, this.y], loadingMap[u].p)) {
					this.home = u;
					u = loadingMap.length + 1;
				}
			}
		}
	}
}


class Apple {
	constructor(x, y, velocity){
		this.x = x;
		this.y = y;
		this.v = velocity;
		this.g = 2; //gravity
	}

	tick() {
		this.y += this.v;
		this.v = this.g * ((this.v/this.g) + 1);

		if((this.x > human.x-10) && (this.x < human.x+10) && (this.y > human.y)){
			human.resetApple();
		} else if(this.y > waterHeight){
			endGame();
		} else if(this.y > bridgeHeight){
			loadingBridge[Math.floor(this.x / canvas.width)] = false;
		}
	}
	
	endGame() {
		gameState = "gameover";
	}
}
