



class Camera {
	constructor(x, y, z, theta, phi) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.theta = theta;
		this.phi = phi;
	}
}



//ray class, for marching rays
class Ray {
	constructor(x, y, z, dPos, screenX, screenY, color) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.dPos = dPos;
	}

	iterate() {
		//get distance
		var dist = distance_max+1;
		var distObj = undefined;
		var testDist = 1;
		world_objects.forEach(w => {
			testDist = w.distanceTo(this);
			if (testDist < dist) {
				dist = testDist;
				distObj = w;
			}
		});

		//if distance is out of dist bounds
		if (dist < dist_min) {
			//color self according to hit object
			this.beDrawn();
			return;
		}

		if (dist > dist_max) {
			this.beDrawn();
			return;
		}

		//move distance
		this.x += this.dPos[0] * dist;
		this.y += this.dPos[1] * dist;
		this.z += this.dPos[2] * dist;
	}

	beDrawn() {

	}
}



//cube, standard object
class Cube {
	constructor(x, y, z, r) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.r = r;
	}

	distanceTo(object) {
		//get relative distance
		var relX, relY, relZ;
		relX = Math.abs(object.x - this.x) - this.r;
		relY = Math.abs(object.y - this.y) - this.r;
		relZ = Math.abs(object.z - this.z) - this.r;

		return Math.sqrt((relX * relX) + (relY * relY) + (relZ * relZ));
	}
}