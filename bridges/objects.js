

class Island {
	constructor (points) {
		this.p = round2dArray(points);
	}
	
	beDrawn() {
		//drawing polygon with camera offset built in
		ctx.beginPath();
		ctx.fillStyle = groundColor;
		ctx.strokeStyle = beachColor;  
		var dStart = adjustForCamera(this.p[0]);
		ctx.moveTo(dStart[0], dStart[1]);
		for(var a = 1; a < this.p.length + 2; a++) {
			var dPoint = adjustForCamera(this.p[a%(this.p.length)]);
			ctx.lineTo(dPoint[0], dPoint[1]);
		}
		ctx.fill();
		ctx.stroke();
	}

	tick() {

		
	}

	giveEnglishConstructor() {
		var pText = JSON.stringify(this.p);
		return `new Island(${pText})`;
	}
}
	


class Bridge {
	constructor (points, startLength) {
		this.p = round2dArray(points);
		this.bridgeLength = Math.floor(getDistBetween(points[0][0], points[0][1], points[1][0], points[1][1]));
		this.startLength = startLength;
		this.bridgeArr = [];
		this.tolerance = 10;
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
		var [x1, y1] = adjustForCamera(this.p[0]);
		var [x2, y2] = adjustForCamera(this.p[1]);

		//main bridge path
		ctx.strokeStyle = bridgeColor;
		dLine([x1, y1], [x2, y2]);

		//start blob
		ctx.fillStyle = bridgeStartColor;
		dPoint(x1, y1, 5);
		ctx.fill();

		//end blob
		ctx.fillStyle = bridgeEndColor;
		dPoint(x2, y2, 5);
		ctx.fill();
	}

	tick() {
		//if the player is near the start of the bridge, move them to the end and go into bridge mode
		if (Math.abs(human.x - this.p[0][0]) < this.tolerance && Math.abs(human.y - this.p[0][1]) < this.tolerance) {
			[human.x, human.y] = this.p[1];
			human.confirmHome();
			switchToGameState();
		}
	}

	giveEnglishConstructor() {
		var pText = JSON.stringify(this.p);
		var sText = this.startLength;
		return `new Bridge(${pText}, ${sText})`;
	}
}

class MenuPlayer {
	constructor (x, y) {
		this.ax = 0;
		this.ay = 0;
		this.dx = 0;
		this.dy = 0;
		this.dc = 0;
		this.x = x;
		this.y = y;

		this.r = 7;

		this.fric = 0.85;
		this.mFric = 0.92;

		this.aSpeed = 0.2;
		this.cSpeed = 0.05;
		this.home = -1;
		this.confirmHome();
	}


	tick() {
		//updating camera scroll
		this.updateCameraScroll();

		//updating velocity
		this.updateXVelocity();
		this.updateYVelocity();

		//if not in a home, try to be in a home
		if (this.home == -1) {
			this.confirmHome();
		}

		//updating position
		this.move();
		
	}

	beDrawn() {
		ctx.fillStyle = playerColor;
		var dSpot = adjustForCamera([this.x, this.y]);
		dPoint(dSpot[0], dSpot[1], this.r);
		ctx.fill();
	}

	confirmHome() {
		this.home = -1;
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

	updateCameraScroll() {
		//only attempt an update if the camera is moving in the first place
		if (this.dc != 0) {
			//if the change will still be within the maximum / minimum values, update the camera scroll
			if (camera.scale * (1 + this.dc) < camera.scrollValues.max && camera.scale * (1 + this.dc) > camera.scrollValues.min) {
				camera.scale *= (1 + this.dc);
				//recenter camera
				camera.xOffset = human.x - ((canvas.width / 2) / camera.scale);
				camera.yOffset = human.y - ((canvas.height / 2) / camera.scale);
			}
		}
	}

	updateXVelocity() {
		//player input
		this.dx += this.ax;
		
		//friction, changes depending on if moving or not
		if (Math.abs(this.ax) > 0) {
			this.dx *= this.mFric;
		} else {
			this.dx *= this.fric;
		}
	}

	updateYVelocity() {
		//player input
		this.dy += this.ay;
		
		//friction, changes depending on if moving or not
		if (Math.abs(this.ay) > 0) {
			this.dy *= this.mFric;
		} else {
			this.dy *= this.fric;
		}
	}

	move() {
		//if the player has a home, make sure the movement happens inside that
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
}


class GamePlayer extends MenuPlayer {
	constructor (x, y) {
		super(x, y);
		//making sure confirmHome doesn't get called every turn
		this.home = 1;

		//changing a few properties
		this.r = 12;
		this.aSpeed = 0.4;
	}

	confirmHome() {
	}

	updateCameraScroll() {
	}

	updateYVelocity() {
		
	}

	move() {
		this.x += this.dx;
		this.y += this.dy;
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
