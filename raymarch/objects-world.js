




//main object contract
class Scene3dObject {
	constructor(x, y, z, color) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.color = color;
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
		super(x, y, z, RGBColor);
		this.r = r;
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
		super(x, y, z, RGBColor)
		this.xr = xr;
		this.yr = yr;
		this.zr = zr;
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

class Cylinder extends Scene3dObject {
	constructor(x, y, z, r, h, RGBColor) {
		super(x, y, z, RGBColor);
		this.r = r;
		this.h = h;
	}

	distanceTo(object) {
		var relX = Math.abs(object.x - this.x);
		var relY = Math.abs(object.y - this.y);
		var relZ = Math.abs(object.z - this.z);
		relY -= clamp(relY, 0, this.h);
		return Math.sqrt(relX * relX + relY * relY + relZ * relZ) - this.r;
	}
}

class Portal extends Cylinder {
	constructor(x, y, z, newWorldSTRING) {
		super(x, y, z, 50, 50, [255, 255, 255]);
		this.newWorld = newWorldSTRING;
		this.rayTolerance = 2;
		var self = this;
		window.setTimeout(() => {
			self.newWorld = eval(`worldData_${self.newWorld}`);
		}, 5);
	}

	tick() {
		if (this.distanceTo(camera) / 0.95 < ray_minDist) {
			camera.dx *= -1;
			camera.dz *= -1;
		}
	}

	distanceTo(object) {
		var trueDist = super.distanceTo(object);
		//if the distance is small enough, transport ray to the other world
		if (trueDist < this.rayTolerance) {
			object.world = this.newWorld;
			//if it's a ray
			if (object.color != undefined) {
				//if it hasn't been hit, make it the color of the new world background
				if (!object.hit) {
					object.color = object.world.getBgColor();
				}
			}
		}
		return trueDist * 0.95;
	}
}

class Ring extends Scene3dObject {
	constructor(x, y, z, r, ringR, RGBColor) {
		super(x, y, z, RGBColor);
		this.r = r;
		this.ringR = ringR;
	}

	distanceTo(object) {
		var distX = Math.abs(object.x - this.x);
		var distY = Math.abs(object.y - this.y);
		var distZ = Math.abs(object.z - this.z);
		var q = [Math.sqrt(distX * distX + distZ * distZ) - this.r];
		return Math.sqrt(q[0] * q[0] + distY * distY) - this.ringR;
	}
}

class Sphere extends Scene3dObject {
	constructor(x, y, z, r, RGBColor) {
		super(x, y, z, RGBColor)
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