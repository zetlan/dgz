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
	constructor (startXY, endXY, startLength) {
		this.startPos = startXY;
		this.endPos = endXY;
		this.length = Math.floor(calculateDistance(startXY, endXY));
		this.bridgeArr = [true, true, true, true];
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

		this.fric = 0.85;
		this.mFric = 0.92;

		this.mS = 5;
		this.aSpeed = 0.25;
		this.home = -1;
		this.confirmHome();
	}


	tick() {
		//updating velocity
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
			if (inPoly([this.x + this.dx, this.y + this.dy], loadingMap[this.home].p)) {
				this.x += this.dx;
			}
		} else {
			this.x += this.dx;
			this.y += this.dy;
		}
	}

	beDrawn() {
		ctx.beginPath();
		ctx.fillStyle = playerColor;
		ctx.ellipse(this.x, this.y, 5, 5, 0, 0, Math.PI * 2);
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
	constructor(x, y, velocity) {
		this.x = x;
		this.y = y;
		this.v = velocity;
		this.g = 2; //gravity
	}

	tick() {
		this.y += this.v;
		this.v = this.g * ((this.v/this.g) + 1);

		if ((this.x > human.x-10) && (this.x < human.x+10) && (this.y > human.y)) {
			human.resetApple();
		}
		else if (this.y > waterHeight) {
			endGame();
		}
		else if (this.y > bridgeHeight) {
			loadingBridge[Math.floor(this.x / canvas.width)] = false;
		}
	}
	
	endGame() {
		gameState = "gameover";
	}
}
