


class Camera {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.xGoal = x;
		this.yGoal = y;

		this.scale = 16;
		this.animSteps = 6;
	}

	tick() {
		this.x = (this.xGoal + (this.x * (this.animSteps - 1))) / this.animSteps;
		this.y = (this.yGoal + (this.y * (this.animSteps - 1))) / this.animSteps;
	}
}




class Map {
	constructor(x, y, midLayerData) {
		this.connections = [];

		this.lbFar = [];
		this.lbDeco = [];
		this.lMid = midLayerData;
		this.lfDeco = [];
		this.lfFar = [];
		this.entities = [];
		this.palette = 0;

		this.x = x;
		this.y = y;
	}

	spaceToScreen(x, y, parallaxVal) {
		return [((x + this.x - camera.x) * map_sqSize * parallaxVal) + (canvas.width / 2), ((y + this.y - camera.y) * map_sqSize * parallaxVal) + (canvas.height / 2)];
	}

	screenToSpace(x, y, parallaxVal) {
		return [(x - (canvas.width / 2)) / (parallaxVal * map_sqSize) - this.x + camera.x, (y - (canvas.height / 2)) / (parallaxVal * map_sqSize) - this.y + camera.y];
	}

	beDrawn() {
		//draw all layers as well as entities
		var layerOrder = [`bFar`, `bDeco`, `mid`, `fDeco`, `fFar`];
		var farCorners = [this.screenToSpace(0, 0, map_parallaxF), this.screenToSpace(canvas.width, canvas.height, map_parallaxF)];
		var clsCorners = [this.screenToSpace(0, 0, map_parallaxC), this.screenToSpace(canvas.width, canvas.height, map_parallaxC)];

		this.beDrawn_midLayer();
		player.beDrawn();
	}

	//tries to make the mid layer data the smallest possible
	//forceXBy and forceYBy are what how much extra space to give one of the sides in the data array.
	//If one is 0, the array will be trimmed to the smallest possible dimension without losing data.
	changeDimensions(forceXBy, forceYBy) {
		var shouldRemove;
		//step 1 is to make the array as small as possible

		//+y
		//if there are only 0s
		while (+this.lMid[this.lMid.length-1] == 0) {
			this.lMid.pop();
		}

		//-y
		while (+this.lMid[0] == 0) {
			this.changePosition(0, 1);
			this.lMid.splice(0, 1);
		}

		//+x
		shouldRemove = true;
		while (shouldRemove) {
			for (var c=0; c<this.lMid.length; c++) {
				if (+this.lMid[c][this.lMid[c].length-1] != 0) {
					shouldRemove = false;
				}
			}

			if (shouldRemove) {
				for (var c=0; c<this.lMid.length; c++) {
					this.lMid[c] = this.lMid[c].slice(0, -1);
				}
			}
		}

		//-x
		shouldRemove = true;
		while (shouldRemove) {
			for (var c=0; c<this.lMid.length; c++) {
				if (+this.lMid[c][0] != 0) {
					shouldRemove = false;
				}
			}

			if (shouldRemove) {
				this.changePosition(1, 0);
				for (var c=0; c<this.lMid.length; c++) {
					this.lMid[c] = this.lMid[c].slice(1);
				}
			}
		}

		//next put buffers in
		if (forceYBy != 0) {
			//+y
			for (var count=forceYBy; count>0; count--) {
				this.lMid.push("".padStart(this.lMid[this.lMid.length-1].length, "0"));
			}

			//-y
			if (forceYBy < 0) {
				this.changePosition(0, forceYBy);
				for (var count=forceYBy; count<0; count++) {
					this.lMid.splice(0, 0, "".padStart(this.lMid[0].length, "0"));
				}
			}
		}

		if (forceXBy != 0) {
			var toAdd = "".padStart(Math.abs(forceXBy), "0");
			if (forceXBy < 0) {
				//-x
				this.changePosition(forceXBy, 0);
				for (var p=0; p<this.lMid.length; p++) {
					this.lMid[p] = toAdd + this.lMid[p];
				}
			} else {
				//+x
				for (var p=0; p<this.lMid.length; p++) {
					this.lMid[p] = this.lMid[p] + toAdd;
				}
			}
		}
	}

	changePosition(changeX, changeY) {
		//move self's coordinates
		this.y += changeY;
		this.x += changeX;

		//move all entities
		player.x -= changeX;
		player.y -= changeY;
	}

	beDrawn_midLayer() {
		var corners = [this.screenToSpace(0, 0, 1), this.screenToSpace(canvas.width, canvas.height, 1)];

		//mid layer is simply blocks, so it's easier to draw
		var rowLen = Math.ceil(corners[1][0] - corners[0][0]);
		var colLen = Math.ceil(corners[1][1] - corners[0][1]);
		var startCoords = this.spaceToScreen(0, 0, 1);


		var sqStartX = Math.max(0, Math.floor(corners[0][0]));
		var sqStartY = Math.max(0, Math.floor(corners[0][1]));
		var sqEndY = Math.min(sqStartY + colLen, this.lMid.length);
		


		ctx.fillStyle = "#002";
		for (var sqY=sqStartY; sqY<sqEndY; sqY++) {
			for (var sqX=sqStartX; sqX<Math.min(sqStartX+rowLen+1, this.lMid[sqY].length); sqX++) {
				//0 is non-drawing char
				if (this.lMid[sqY][sqX] != "0") {
					ctx.fillRect(startCoords[0] + (sqX * map_sqSize), startCoords[1] + (sqY * map_sqSize), map_sqSize, map_sqSize);
				}
			}
		}

		if (editor_active) {
			ctx.fillStyle = "#F0F";
			drawCircle(startCoords[0], startCoords[1], 2);
			ctx.fill();
		}
	}

	tick() {
	}
}

class Map_Climbing extends Map {
	constructor(x, y, midLayerData) {
		super(x, y, midLayerData);
	}

	giveStringData() {
		var outStr = ``;
		var trueWidth = Math.max(...this.lMid.map(a => a.length));
		this.lMid = this.lMid.map(l => {
			return l.padEnd(trueWidth, "0");
		});
		var tilePrelimData = this.lMid.reduce((a, b) => {return a + b});
		tilePrelimData = starrify(tilePrelimData);

		outStr += `id~${this.id}`;
		outStr += `|x~${this.x}`;
		outStr += `|y~${this.y}`;
		outStr += `|dims~${trueWidth}~${this.lMid.length}`;
		outStr += `|tiles~${tilePrelimData}`;

		return outStr;
	}
}

class Map_Walking extends Map {
	constructor() {
		super();
	}
}










class Player {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.rLong = 1.1;
		this.rShort = 0.6;

		this.dx = 0;
		this.dy = 0;
		this.ax = 0;
		this.ay = 0;

		this.dMax = 0.99;
		this.speed = 0.015;
	}

	beDrawn() {
		var coords = game_state.map.spaceToScreen(this.x, this.y, 1);
		ctx.fillStyle = color_player;
		var yR = this.rLong * map_sqSize;
		ctx.beginPath();
		ctx.ellipse(coords[0], coords[1] - (yR), this.rShort * map_sqSize, yR, 0, 0, Math.PI * 2);
		ctx.fill();
	}

	modifyDerivatives() {
		//change velocity based on acceleration / forces
	}

	modifyPosition() {
		//move to the best position based on velocity
	}

	tick() {
		this.modifyDerivatives();
		this.modifyPosition();
	}

	tileBlocksPath(tileID) {
		return false;
	}
}

class Player_Climbing extends Player {
	constructor(x, y) {
		super(x, y);
		
		this.dMax = 0.99;
		this.strafeMax = 0.35;
		this.speed = 0.01;

		this.onGround = 0;
		this.onGroundCoyote = 14 * player_physRepeats;

		this.gravity = 0.01;
		this.jumpForce = 0.35;
		this.jumpBoost = 0.003;
		this.jumpBoostTime = 40;
		this.jumpBoostTimeMax = 40;

		this.friction = 0.9;
		this.stairFriction = 0.85;
	}

	handleSpace() {
		if (this.onGround > 0) {
			this.dy = this.jumpForce;
			this.onGround = 0;
		}
	}

	modifyDerivatives() {
		this.onGround -= 1;

		//movement + friction
		this.dx += this.ax * this.speed;
		if (this.ax * this.dx <= 0) {
			this.dx *= this.friction ** (1 + (this.ax * this.dx < 0));
		}
		this.dx = clamp(this.dx, -this.strafeMax, this.strafeMax);

		if (this.ay != 0) {
			this.dy += this.ay * this.jumpBoost;
		}
		this.dy = clamp(this.dy - this.gravity, -this.dMax, this.dMax);
		if (this.onGround > 0) {
			this.dy *= this.friction ** 2;
		}
	}

	modifyPosition() {
		//add x, then y

		//x has a buffer space, can just snap up one or down one depending on position for walking up / down stairs effect
		//walking up/down stairs also takes some speed
		switch (true) {
			//walking down stairs won't happen if it's a ledge (has no floor below)
			case ((this.onGround > 0) && this.positionIsGood(this.x + this.dx, this.y - 1) && !this.positionIsGood(this.x + this.dx, this.y - 2)):
				this.x += this.dx;
				this.y -= 1;
				this.dx *= this.stairFriction;
				break;
			case this.positionIsGood(this.x + this.dx, this.y):
				this.x += this.dx;
				break;
			case this.positionIsGood(this.x + this.dx, this.y + 1):
				//y step up
				this.x += this.dx;
				this.y += 1;
				this.dx *= this.stairFriction;
				break;
		}

		if (this.positionIsGood(this.x, this.y + this.dy)) {
			this.y += this.dy;
		} else {
			this.onGround = this.onGroundCoyote;
		}
	}

	//determines if a position is good to move to
	positionIsGood(x, y) {
		var ptsInLine = Math.ceil(this.rLong * 1.9);
		var ptsDist = (this.rLong * 1.9) / ptsInLine;

		//check left-most, then right-most, then center
		var checkArr = [this.rShort * -0.95, 0, this.rShort * 0.95];
		for (var f=0; f<checkArr.length; f++) {
			for (var p=0; p<ptsInLine; p++) {
				if (this.tileBlocksPath(x + checkArr[f], y - (this.rLong * 1.9) + (ptsDist * p))) {
					return false;
				}
			}
		}

		return true;
	}

	tileBlocksPath(x, y) {
		if (game_map.lMid[Math.floor(y)] == undefined) {
			return false;
		}
		return ((game_map.lMid[Math.floor(y)][Math.floor(x)] ?? "0") != "0");
	}
}

class Player_Walking extends Player {
	constructor(x, y) {
		super(x, y);
	}

	tick() {

	}

	tileBlocksPath(tileID) {
		return ((tileID ?? "0") == "0");
	}


}