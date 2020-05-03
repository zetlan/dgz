
//map class, all world objects are contained here

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
			this.rotPercent = Math.abs(loadingMap.angle / (Math.PI / 2));
			this.orderObjects();
			
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
				this.orderObjects();
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
			this.contains.push(new Box(-1 * mapSize, 0, 0, 1, mapSize, mapSize));
		}

		if (Number.isNaN(this.rightMap)) {
			this.contains.push(new Box(mapSize, 0, 0, 1, mapSize, mapSize));
		}
	}

	orderObjects() {
		//same as ordering faces
		var great = 0;
		let temp = [];
		var times = this.contains.length;
		//make sure objects have updated camera distances
		for (var d=0;d<this.contains.length;d++) {
			this.contains[d].getCameraDist();
		}

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

	giveEnglishConstructor(radians) {
		const {bg} = this;
		return `new Map("${bg}", [], NaN, NaN); \n`;
	}
}


//main class, almost all objects extend from here
class Main {
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.cDist = this.getCameraDist();
	}

	getCameraDist() {
		var tX;
		var tZ;
		try {
			[tX, tZ] = rotate(this.x, this.z, loadingMap.angle);
		} catch(error) {
			tX = this.x;
			tZ = this.z;
		}
		
		this.cDist = getCameraDist([[tX, this.y, tZ]]);
	}
}

//edit interface, allows for editing of objects in a map
class Editor {
	constructor() {
		this.active = false;
		this.occupies = 0;
		this.obj;

		this.ncrmnt = 5;
	}

	tick() {
		this.obj = loadingMap.contains[this.occupies];
	}
}


//camera stores data about how to render things
class Camera extends Main {
    constructor(x, y, z, scale) {
        super(x, y, z);

		this.scale = scale;
	}
	
	getCameraDist() {
		
	}
}