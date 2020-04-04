
class Map {
    constructor(backgroundColor, objects, connectsToLeft, connectsToRight) {
        this.bg = backgroundColor;
        this.contains = objects;
        this.leftMap = connectsToLeft;
        this.rightMap = connectsToRight;

        this.angle = 0;
        this.aSpeed = 0;
        this.aStart = 0;
        this.rotating = false;
    }

    beRun() {
        //rotate if rotating
        if (this.rotating) {
			this.angle += this.aSpeed;
			
            //if rotated 90 degrees, stop rotation
            if (Math.abs(this.aStart - this.angle) > Math.PI / 2) {
				this.rotating = false;
				//rounding to nearest 90 degrees (Pi radians)
				this.angle = Math.round(this.angle / (Math.PI / 2)) * (Math.PI / 2);
            }
        }
		//tick and draw everything
		//player is ticked first but drawn last so that collisions don't look strange
		player.tick();

		for (var k=0;k<this.contains.length;k++) {
			this.contains[k].tick();
			this.contains[k].beDrawn();
		}

		//drawing player
		player.beDrawn();
    }

    startRotation(speed) {
        //only start if not already rotating
        if (!this.rotating) {
            this.aStart = this.angle;
            this.aSpeed = speed;
            this.rotating = true;
        }
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