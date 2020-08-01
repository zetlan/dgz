class Island {
	constructor (points) {
		this.p = round2dArray(points);
	}
	
	beDrawn() {
		//drawing polygon with camera offset built in
		ctx.beginPath();
		ctx.fillStyle = color_ground;
		ctx.strokeStyle = color_beach;
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
		//map attributes
		this.p = round2dArray(points);
		this.bridgeLength = Math.floor(getDistBetween(points[0][0], points[0][1], points[1][0], points[1][1]) / bridgeWorldSegmentWidth);
		this.startLength = startLength;
		this.tolerance = 10;
		this.worldDestination = [];
		this.opacity = 0;
		

		//gameplay attributes
		this.bridgeArr = [];
		this.completed = false;
		this.debris = [];
		this.machine;
		this.clearCondition = "";

		//ew, but it's necessary
		let self = this;
		window.setTimeout(function() {self.constructBridge();}, 1);
	}

	constructBridge() {
		//starting with the starting segments
		for (var r=0;r<this.startLength;r++) {
			this.bridgeArr.push(1);
		}

		//segments to be built
		for (var s=0;s<this.bridgeLength - this.startLength;s++) {
			this.bridgeArr.push(0);
		}

		//initialize machine
		this.machine = new Machine();
	}

	beDrawn() {
		//terms for readability
		var [x1, y1] = adjustForCamera(this.p[0]);
		var [x2, y2] = adjustForCamera(this.p[1]);

		//main bridge path
		ctx.globalAlpha = this.opacity;
		ctx.strokeStyle = color_bridge;
		dLine([x1, y1], [x2, y2]);
		ctx.globalAlpha = 1;

		//start blob
		//if player is near, color it green. Otherwise, red
		if (playerIsNear(this.p[0])) {
			ctx.fillStyle = color_bridgeStart;
		} else {
			ctx.fillStyle = color_bridgeEnd;
		}
		dPoint(x1, y1, ctx.lineWidth / 2);
		ctx.fill();
		

		//end blob
		//same color system here
		if (playerIsNear(this.p[1])) {
			ctx.fillStyle = color_bridgeStart;
		} else {
			ctx.fillStyle = color_bridgeEnd;
		}
		dPoint(x2, y2, ctx.lineWidth / 2);
		ctx.fill();
	}

	tick() {
		//if the player is near one end of the bridge, activate bridge mode
		if (button_z) {
			if (playerIsNear(this.p[0])) {
				this.moveThroughSelfTo(1);
			}

			if (playerIsNear(this.p[1])) {
				if (this.completed) {
					this.moveThroughSelfTo(0);
				} else {
					//swap positions to sustain consistiency
					[this.p[0], this.p[1]] = [this.p[1], this.p[0]];
					this.moveThroughSelfTo(1);
				}
				
			}
		}
		//every once in a while, check opacity
		if (pTime % 46 == 0) {
			this.checkOpacity();
		}
	}

	moveThroughSelfTo(index) {
		this.destination = this.p[index];
		loadingBridge = this;
		//if completed, make sure the debris array is empty
		if (this.completed) {
			this.debris = [];
		}
		//set to the appropriate clear condition
		if (this.completed) {
			if (index == 1) {
				this.clearCondition = "human.x > loadingBridge.bridgeArr.length * bridgeSegmentWidth;";
			} else {
				this.clearCondition = "human.x < 0;";
			}
		} else {
			this.clearCondition = "loadingBridge.machine.x > loadingBridge.bridgeArr.length * bridgeSegmentWidth";
		}
		
		switchToGameplayState(!index);
	}

	giveEnglishConstructor() {
		var pText = JSON.stringify(this.p);
		var sText = this.startLength;
		return `new Bridge(${pText}, ${sText})`;
	}

	checkOpacity() {
		this.opacity = 0;
		for (var t=0;t<this.bridgeArr.length;t++) {
			this.opacity += this.bridgeArr[t];
		}
		this.opacity /= this.bridgeArr.length;
	}

	checkForLeave(showSplashScreen) {
		//if the clear condition is true, leave to map. If not, gameover.
		if (eval(this.clearCondition)) {
			switchToMapState();
		} else {
			switchToGameoverState(showSplashScreen);
		}
	}
}

class OrbPerson {
	constructor(xyPos, color, inputText, ID) {
		this.p = [xyPos];
		this.color = color;
        this.conversing = false;
        this.id = ID; //ID is used for updating what the orbs say after each bridge has been completed
		this.lineNumber = 0;
		this.text = inputText;
		this.playerLockInfo = {x: 0, y: 0, scale: 0}
	}

	tick() {
		//potentially start conversation
		if (!this.conversing) {
			if (playerIsNear(this.p[0]) && button_z) {
				this.conversing = true;
				this.updateTextBox(this.text[this.lineNumber]);
				this.playerLockInfo = {x: human.x, y: human.y, scale: camera.scale};
				button_z = false;
			}
		} else {
			//if already conversing, lock the player's movement and camera scroll
			[human.ax, human.ay, human.dx, human.dy, human.dc, human.x, human.y] = [0, 0, 0, 0, 0, this.playerLockInfo.x, this.playerLockInfo.y];
			camera.scale = this.playerLockInfo.scale;

			//whenever the z button is pressed move forwards a line
			if (playerIsNear(this.p[0]) && button_z) {
				this.lineNumber += 1;

				//if out of lines, end the conversation
				if (this.lineNumber > this.text.length-1) {
					//end conversation
					this.conversing = false;
					this.lineNumber = 0;
					this.updateTextBox(["", false]);
					
				} else {
					//display text
					this.updateTextBox(this.text[this.lineNumber]);
				}
				button_z = false;
			}
			//update the flag for drawing the text box
			conversation_drawBox = true;
		}
	}

	beDrawn() {
		//orb
		ctx.fillStyle = this.color;
		var tPos = adjustForCamera(this.p[0]);
		dPoint(tPos[0], tPos[1], radius_NPC);
		ctx.fill();

	}

	updateTextBox(line) {
		if (line[1]) {
			document.getElementById(conversation_storage).style.color = color_player;
		} else {
			document.getElementById(conversation_storage).style.color = this.color;
		}
		document.getElementById(conversation_storage).innerHTML = line[0];
	}

	giveEnglishConstructor() {
		let [p, color] = [this.p, this.color];
		return `new OrbPerson([${p}], '${color}', inputText)`;
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

		this.r = radius_player;

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
		ctx.fillStyle = color_player;
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