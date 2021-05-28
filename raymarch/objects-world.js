



class Camera {
	constructor(world, x, y, z) {
		this.world = world;
		this.x = x;
		this.y = y;
		this.z = z;

		this.dx = 0;
		this.dy = 0;
		this.dz = 0;
		this.dMax = 6;
		this.dMin = 0.05;

		this.ax = 0;
		this.ay = 0;
		this.az = 0;

		this.speed = 0.07;
		this.friction = 0.8;

		this.theta = 0;
		this.phi = 0;
	}

	tick() {
		//adding to derivatives 
		this.dx += this.ax;
		if (Math.abs(this.dx) > this.dMax) {
			this.dx = clamp(this.dx, -this.dMax, this.dMax);
		}
		if (this.ax * this.dx <= 0) {
			this.dx *= this.friction;
		}

		this.dy += this.ay;
		if (Math.abs(this.dy) > this.dMax) {
			this.dy = clamp(this.dy, -this.dMax, this.dMax);
		}
		if (this.ay * this.dy <= 0) {
			this.dy *= this.friction;
		}

		this.dz += this.az;
		if (Math.abs(this.dz) > this.dMax) {
			this.dz = clamp(this.dz, -this.dMax, this.dMax);
		}
		if (this.az * this.dz <= 0) {
			this.dz *= this.friction;
		}

		//handling position
		var moveCoords = [0, 0, 0];
		if (Math.abs(this.dx) > this.dMin) {
			var toAdd = polToCart(this.theta + (Math.PI / 2), 0, this.dx);
			moveCoords = [moveCoords[0] + toAdd[0], moveCoords[1] + toAdd[1], moveCoords[2] + toAdd[2]];
		}
		if (Math.abs(this.dy) > this.dMin) {
			var toAdd = polToCart(0, -(Math.PI / 2), this.dy);
			moveCoords = [moveCoords[0] + toAdd[0], moveCoords[1] + toAdd[1], moveCoords[2] + toAdd[2]];
		}
		if (Math.abs(this.dz) > this.dMin) {
			var toAdd = polToCart(this.theta, this.phi, this.dz);
			moveCoords = [moveCoords[0] + toAdd[0], moveCoords[1] + toAdd[1], moveCoords[2] + toAdd[2]];
		}
		this.x += moveCoords[0];
		this.y += moveCoords[1];
		this.z += moveCoords[2];

		//special case for vertical camera orientation
		if (Math.abs(this.phi) >= Math.PI * 0.5) {
			//if the camera angle is less than 0, set it to -1/2 pi. Otherwise, set it to 1/2 pi
			this.phi = Math.PI * 0.5 * boolToSigned(this.phi > 0);
		}
	}
}



//ray class, for marching rays
class Ray {
	constructor(world, x, y, z, dPos, screenX, screenY) {
		this.worldRef = world;
		this.x = x;
		this.y = y;
		this.z = z;

		this.screenX = screenX;
		this.screenY = screenY;
		this.color = world.getBgColor();
		this.dPos = dPos;
		this.drawn = false;
	}

	iterate(num) {
		//get distance
		var dist = ray_maxDist+1;
		var distObj = undefined;
		var testDist = 1;
		this.worldRef.objects.forEach(w => {
			testDist = w.distanceTo(this);
			if (testDist < dist) {
				dist = testDist;
				distObj = w;
			}
		});

		//if distance is out of dist bounds
		if (dist < ray_minDist) {
			//color self according to hit object
			this.color = distObj.color;
			this.beDrawn();
			return;
		}

		if (dist > ray_maxDist) {
			this.beDrawn();
			return;
		}

		//apply world effects
		this.worldRef.effects(this, distObj);
		//move distance
		this.x += this.dPos[0] * dist;
		this.y += this.dPos[1] * dist;
		this.z += this.dPos[2] * dist;

		return this.iterate(num+1);
	}

	beDrawn() {
		ctx.beginPath();
		ctx.fillStyle = `rgb(${this.color[0]}, ${this.color[1]}, ${this.color[2]})`;
		ctx.fillRect(this.screenX * render_pixelSize, this.screenY * render_pixelSize, render_pixelSize, render_pixelSize);
		this.drawn = true;
	}
}


//main object contract
class Scene3dObject {
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	tick() {

	}

	distanceTo(object) {
		return undefined;
	}

	giveStringData() {
		return `!!!UNDEFINED!!!`;
	}
}



//cube, standard object
class Cube extends Scene3dObject {
	constructor(x, y, z, r, RGBColor) {
		super(x, y, z)
		this.r = r;

		this.color = RGBColor;
	}

	distanceTo(object) {
		var x = Math.max(0, Math.abs(object.x - this.x) - this.r);
		var y = Math.max(0, Math.abs(object.y - this.y) - this.r);
		var z = Math.max(0, Math.abs(object.z - this.z) - this.r);
		return Math.sqrt(x * x + y * y + z * z);
	}

	giveStringData() {
		return `CUB~${this.x}~${this.y}~${this.z}~${this.r}~[${this.color}]`;
	}
}

class Box extends Scene3dObject {
	constructor(x, y, z, xr, yr, zr, RGBColor) {
		super(x, y, z)
		this.xr = xr;
		this.yr = yr;
		this.zr = zr;
		this.color = RGBColor;
	}

	distanceTo(object) {
		var x = Math.max(0, Math.abs(object.x - this.x) - this.xr);
		var y = Math.max(0, Math.abs(object.y - this.y) - this.yr);
		var z = Math.max(0, Math.abs(object.z - this.z) - this.zr);
		return Math.sqrt(x * x + y * y + z * z);
	}

	giveStringData() {
		return `BOX~${this.x}~${this.y}~${this.z}~${this.r}~${this.xr}~${this.yr}~${this.zr}~[${this.color}]`;
	}
}

class Sphere extends Scene3dObject {
	constructor(x, y, z, r, RGBColor) {
		super(x, y, z)
		this.r = r;

		this.color = RGBColor;
	}

	distanceTo(object) {
		//get relative distance
		var relX, relY, relZ;
		relX = Math.abs(object.x - this.x);
		relY = Math.abs(object.y - this.y);
		relZ = Math.abs(object.z - this.z);

		return Math.sqrt((relX * relX) + (relY * relY) + (relZ * relZ)) - this.r;
	}

	giveStringData() {
		return `SPH~${this.x}~${this.y}~${this.z}~${this.r}~[${this.color}]`;
	}
}