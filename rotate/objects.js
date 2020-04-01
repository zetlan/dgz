/*north = +Z
east = +X
south = -Z
west = -X

up = +Y
down = -Y
*/



class Map {
    constructor(backgroundColor, objects, connectsToLeft, connectsToRight) {
        this.bg = backgroundColor;
        this.contains = objects;
        this.leftMap = connectsToLeft;
		this.rightMap = connectsToRight;
    }

    beRun() {
		//tick and draw everything
		for (var k=0;k<this.contains.length;k++) {
			this.contains[k].tick();
			this.contains[k].beDrawn();
		}

		//ticking/drawing player
		player.tick();
		player.beDrawn();
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
		this.r = 5;

        this.dx = 0;
        this.dy = 0;
		this.dz = 0;
		
		this.ax = 0;
		this.az = 0;

		this.mS = 5;
		this.friction = 0.85;
		this.gravity = 0.5;
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

		//move player
		this.x += this.dx;
		this.y += this.dy;
		this.z += this.dz;
    }

    beDrawn() {
		this.drawCoord = spaceToScreen([this.x, this.y, this.z]);
		ctx.fillStyle = characterColor;
		gPoint(this.drawCoord[0], this.drawCoord[1], this.r);
    }
}

//all actual objects inside a map

//in a cube, the points go NW, NE, SE, SW (clockwise starting from northwest point)
class Cube extends Main {
    constructor(x, y, z, r) {
        super(x, y, z);

        this.r = r;

        this.uPoints = [];
        this.lPoints = [];
        this.xyUP = [];
        this.xyLP = [];
		this.generatePoints();
		this.generateScreenPoints();
    }

    generatePoints() {
        //this code is a bit of a mess, but hopefully it will never need to be touched.
        //each point is an array of 3 coordinates
        this.uPoints = [];
        this.lPoints = [];

        //upper points
        this.uPoints.push([this.x - this.r, this.y + this.r, this.z + this.r]);
        this.uPoints.push([this.x + this.r, this.y + this.r, this.z + this.r]);
        this.uPoints.push([this.x + this.r, this.y + this.r, this.z - this.r]);
        this.uPoints.push([this.x - this.r, this.y + this.r, this.z - this.r]);

        //lower points
        this.lPoints.push([this.x - this.r, this.y - this.r, this.z + this.r]);
        this.lPoints.push([this.x + this.r, this.y - this.r, this.z + this.r]);
        this.lPoints.push([this.x + this.r, this.y - this.r, this.z - this.r]);
        this.lPoints.push([this.x - this.r, this.y - this.r, this.z - this.r]);
	}
	
	generateScreenPoints() {
		this.xyUP = [];
		this.xyLP = [];
		this.xyUP.push(spaceToScreen(this.uPoints[0]));
		this.xyUP.push(spaceToScreen(this.uPoints[1]));
		this.xyUP.push(spaceToScreen(this.uPoints[2]));
		this.xyUP.push(spaceToScreen(this.uPoints[3]));
		
		this.xyLP.push(spaceToScreen(this.lPoints[0]));
		this.xyLP.push(spaceToScreen(this.lPoints[1]));
		this.xyLP.push(spaceToScreen(this.lPoints[2]));
		this.xyLP.push(spaceToScreen(this.lPoints[3]));
	}

    beDrawn() {
		this.generatePoints();
		this.generateScreenPoints();
		//drawing each face at a time
		ctx.strokeStyle = "#224";
		ctx.fillStyle = "#838";

		//top or bottom decision
		//if the camera is below, draw the top face first
		if (camera.y < this.y - this.r) {
			dPoly([this.xyUP[0], this.xyUP[1], this.xyUP[2], this.xyUP[3]]);

		} else {
			dPoly([this.xyLP[0], this.xyLP[1], this.xyLP[2], this.xyLP[3]]);
		}
		ctx.fill();

		//left or right decision
		//deciding to draw left or right wall first based on camera x in relation to this x
		if (this.z > camera.z) {
			//draw the left face first if camera is to the left
			dPoly([this.xyUP[0], this.xyUP[3], this.xyLP[3], this.xyLP[0]]);
			ctx.fill();

			//right second
			dPoly([this.xyUP[1], this.xyUP[2], this.xyLP[2], this.xyLP[1]]);
			ctx.fill();
		} else {
			//drawing the right face first
			dPoly([this.xyUP[1], this.xyUP[2], this.xyLP[2], this.xyLP[1]]);
			ctx.fill();

			//left second
			dPoly([this.xyUP[0], this.xyUP[3], this.xyLP[3], this.xyLP[0]]);
			ctx.fill();
		}
		

		//if the camera is above, draw the top
		if (camera.y >= this.y + this.r) {
			dPoly([this.xyUP[0], this.xyUP[1], this.xyUP[2], this.xyUP[3]]);
		} else if (camera.y <= this.y - this.r) {
			//if the camera is below, draw the bottom
			dPoly([this.xyLP[0], this.xyLP[1], this.xyLP[2], this.xyLP[3]]);
		}
		ctx.fill();



		//front face, if camera is in the back the cube just won't be drawn
		dPoly([this.xyUP[3], this.xyUP[2], this.xyLP[2], this.xyLP[3]]);
		ctx.fill();
	} 
	
	tick() {
	}
}

class Pyramid {
	constructor() {

	}
}

class Floor extends Main {
	constructor() {
		super(0, -100, 0);
		this.points = []; 
		this.xyP = [];

		this.generatePoints();
		this.generateScreenPoints();
	}

	generatePoints() {
		this.points.push([this.x - mapSize, this.y, this.z + mapSize]);
		this.points.push([this.x + mapSize, this.y, this.z + mapSize]);
		this.points.push([this.x + mapSize, this.y, this.z - mapSize]);
		this.points.push([this.x - mapSize, this.y, this.z - mapSize]);
	}

	generateScreenPoints() {
		this.xyP.push(spaceToScreen(this.points[0]));
		this.xyP.push(spaceToScreen(this.points[1]));
		this.xyP.push(spaceToScreen(this.points[2]));
		this.xyP.push(spaceToScreen(this.points[3]));
	}

	tick() {
		//keep the player above the floor
		if (player.y < this.y) {
			player.y = this.y;
			//counteract gravity
			if (player.dy < 0) {
				player.dy = 0;
			}
		}
	}

	beDrawn() {
		ctx.fillStyle = "#AAF";
		dPoly([this.xyP[0], this.xyP[1], this.xyP[2], this.xyP[3]]);
		ctx.fill();
	}
}