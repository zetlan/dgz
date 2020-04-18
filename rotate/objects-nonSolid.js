
class Map {
    constructor(backgroundColor, objects, connectsToLeft, connectsToRight) {
        this.bg = backgroundColor;
        this.contains = objects;
        this.leftMap = connectsToLeft;
		this.rightMap = connectsToRight;
		this.goingMap;

        this.angle = 0;
        this.aSpeed = 0;
		this.aStart = 0;
		this.rotPercent = 0;
		this.playerStorePos = [];
		this.rotating = false;
		this.ableToSwap = false;

		//ew
		var self = this;
		window.setTimeout(function() {self.initSides();}, 1);
		window.setTimeout(function() {self.orderObjects();}, 2);
    }

    beRun() {
		//tick and draw everything
		//player is ticked first but drawn last so that collisions don't look strange
		player.tick();

		for (var k=0;k<this.contains.length;k++) {
			this.contains[k].tick();
			this.contains[k].beDrawn();
		}

		//drawing player
		player.beDrawn();


		//rotation things go last
        if (this.rotating) {
			this.angle += this.aSpeed;
			this.rotPercent = Math.abs(loadingMap.angle / (Math.PI / 2))
			
            //if rotated 90 degrees or rotated ~0 degrees, stop rotation
            if (Math.abs(this.aStart - this.angle) > Math.PI / 2 || Math.abs(this.aStart - this.angle) < Math.abs(this.aSpeed * 0.8)) {
				//if rotated 90 degrees, change loadingMap
				if (Math.abs(this.aStart - this.angle) > Math.PI / 2) {
					loadingMap = this.goingMap;

					//change player position to avoid jarring transition
					var nTX = player.x;
					var nTZ = player.z;
					player.x = (nTX * Math.cos(this.angle)) - (nTZ * Math.sin(this.angle));
					player.z = (nTZ * Math.cos(this.angle)) + (nTX * Math.sin(this.angle));
				}

				//rotation cancellation things
				this.rotating = false;
				this.angle = 0;
				this.aSpeed = 0;
				this.rotPercent = 0;
            }
        }
    }

    startRotation(speed) {
        //only start if not already rotating
        if (!this.rotating) {
            this.aStart = this.angle;
            this.aSpeed = speed;
			this.rotating = true;
			
			this.playerStorePos = [player.drawCoord[0], player.drawCoord[1]];
			if (this.aSpeed > 0) {
				this.goingMap = this.leftMap;
			} else {
				this.goingMap = this.rightMap;
			}
			//set timer for being able to collide, 30 ms I think is a safe guess for frame time
			window.setTimeout(loadingMap.beSwappable, 30);
        }
	}

	beSwappable() {
		loadingMap.ableToSwap = true;
	}
	
	initSides() {
		this.leftMap = eval(this.leftMap);
		this.rightMap = eval(this.rightMap);

		//creating walls to block rotation in the case of non-existant sides
		if (Number.isNaN(this.leftMap)) {
			this.contains.push(new Wall(-1 * mapSize, 0, 0, 1, mapSize, mapSize));
		}

		if (Number.isNaN(this.rightMap)) {
			this.contains.push(new Wall(mapSize, 0, 0, 1, mapSize, mapSize));
		}

		if (Number.isNaN(this.rightMap.rightMap) || this.rightMap.rightMap == undefined) {
			this.contains.push(new Wall(0, 0, mapSize, mapSize, mapSize, 1));
		}
	}

	orderObjects() {
		//same as ordering faces
		var great = 0;
		let temp = [];
		var times = this.contains.length;
		console.log(this.contains, times);
		for (var a=0;a<times;a++) {
			
			//running through list to get greatest distance
			for (var b=0;b<this.contains.length;b++) {
				if (this.contains[b].cDist > great) {
					great = this.contains[b].cDist;
				}
			}

			//running through list again, move the greatest distance item to the true object list
			for (var c=0;c<this.contains.length;c++) {
				if (this.contains[c].cDist == great) {
					//remove the item, add it to true object list, exit loop
					temp.push(this.contains[c]);
					
					this.contains.splice(c, 1);
					c = this.contains.length + 1;
				}
			}
			great = 0;
		}

		this.contains = temp;
	}
}


//main class, everything extends from here
class Main {
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
}



//camera stores data about how to render things
class Camera extends Main {
    constructor(x, y, z, scale) {
        super(x, y, z);

		this.scale = scale;
    }
}



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
		this.friction = 0.85;
		this.gravity = 0.5;
		this.mV = 9.8;
    }

    tick() {
		//apply forces
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

		//move player
		this.x += this.dx;
		this.y += this.dy;
		this.z += this.dz;
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
}

//this is the only object that has a beDrawn in the game, but it's here because it's not solid.
class Text {
	constructor(textIndexPerLine) {
		this.cDist = 0;
		this.text = textToDisplay;
	}

	beDrawn() {

	}

	tick() {

	}

	giveEnglishConstructor() {
		return ("new Text(" + this.text + ")");
	}
}