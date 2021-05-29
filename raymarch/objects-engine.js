

//objects that are required for the engine to run
class Camera {
	constructor(world, x, y, z) {
		this.world = world;
		this.x = x;
		this.y = y;
		this.z = z;

		this.dx = 0;
		this.dy = 0;
		this.dz = 0;
		this.dMax = 3;
		this.dMin = 0.05;

		this.ax = 0;
		this.ay = 0;
		this.az = 0;

		this.speed = 0.07;
		this.jumpSpeed = 2.5;
		this.friction = 0.8;

		this.gravity = 0.15;
		this.fallMax = 12;
		this.onGround = false;

		this.height = 10;
		this.width = 5;

		this.theta = 0;
		this.phi = 0;
	}

	tick() {
		this.updateMomentum();
		this.updatePosition();
	}

	updateMomentum() {
		//updates dVars
		this.dx += this.ax;
		if (Math.abs(this.dx) > this.dMax) {
			this.dx = clamp(this.dx, -this.dMax, this.dMax);
		}
		if (this.ax * this.dx <= 0) {
			this.dx *= this.friction;
		}

		//gravity
		this.dy += this.gravity;
		if (Math.abs(this.dy) > this.fallMax) {
			this.dy = clamp(this.dy, -this.fallMax, this.fallMax);
		}

		this.dz += this.az;
		if (Math.abs(this.dz) > this.dMax) {
			this.dz = clamp(this.dz, -this.dMax, this.dMax);
		}
		if (this.az * this.dz <= 0) {
			this.dz *= this.friction;
		}
	}

	updatePosition() {
		//handling position
		var speedMultiplier = 1 + controls_shiftPressed * (1 + editor_active * 7);
		var lookRay;
		if (Math.abs(this.dx) > this.dMin) {
			var toAdd = polToCart(this.theta + (Math.PI / 2), 0, this.dx * speedMultiplier);
			//cast ray sideways
			lookRay = new Ray_Tracking(this.world, this.x, this.y, this.z, [toAdd[0] / Math.abs(this.dx * speedMultiplier), toAdd[1] / Math.abs(this.dx * speedMultiplier), toAdd[2] / Math.abs(this.dx * speedMultiplier)]);
			lookRay.iterate(0);
			//if the ray's gone far enough, then move there
			if (lookRay.distance > this.width + Math.abs(this.dx)) {
				//doesn't need a y because phi is always 0
				this.x += toAdd[0];
				this.z += toAdd[2];
			} else {
				this.dx = 0;
			}
		}

		if (Math.abs(this.dy) > this.dMin) {
			var toAdd = polToCart(0, -(Math.PI / 2), this.dy);
			lookRay = new Ray_Tracking(this.world, this.x, this.y, this.z, [toAdd[0] / this.dy, toAdd[1] / this.dy, toAdd[2] / this.dy]);
			lookRay.iterate(0);
			if (lookRay.distance > this.height + this.dy) {
				this.y += toAdd[1];
			} else {
				this.dy = 0;
				this.onGround = true;
			}
		}

		if (Math.abs(this.dz) > this.dMin) {
			var toAdd = polToCart(this.theta, 0, this.dz * speedMultiplier);
			lookRay = new Ray_Tracking(this.world, this.x, this.y, this.z, [toAdd[0] / Math.abs(this.dz * speedMultiplier), toAdd[1] / Math.abs(this.dz * speedMultiplier), toAdd[2] / Math.abs(this.dz * speedMultiplier)]);
			lookRay.iterate(0);
			if (lookRay.distance > this.width + Math.abs(this.dz)) {
				this.x += toAdd[0];
				this.z += toAdd[2];
			} else {
				this.dz = 0;
			}
		}
	}

	jump() {
		if (this.onGround) {
			this.dy = -this.jumpSpeed;
			this.onGround = false;
		}
	}
}



//ray class, for marching rays
class Ray {
	constructor(world, x, y, z, dPos, screenX, screenY) {
		this.world = world;
		this.x = x;
		this.y = y;
		this.z = z;

		this.screenX = screenX;
		this.screenY = screenY;
		this.color = world.getBgColor();
		this.dPos = dPos;
		this.hit = false;
	}

	iterate(num) {
		if (num > ray_maxIters) {
			this.beDrawn();
			return;
		}

		//get distance
		var dist = ray_maxDist+1;
		var distObj = undefined;
		var testDist = 1;
		this.world.objects.forEach(w => {
			testDist = w.distanceTo(this);
			if (testDist < dist) {
				dist = testDist;
				distObj = w;
			}
		});

		//if distance is out of dist bounds
		if (dist < ray_minDist) {
			if (this.hit) {
				//draw self as a shadow
				this.color[0] *= render_shadowPercent;
				this.color[1] *= render_shadowPercent;
				this.color[2] *= render_shadowPercent;
				this.beDrawn();
				return;
			}
			//if not hit,
			//color self according to hit object, and change direction
			this.color[0] = distObj.color[0];
			this.color[1] = distObj.color[1];
			this.color[2] = distObj.color[2];
			dist = ray_minDist * 2;
			this.hit = true;
			this.dPos = this.world.sunVector;
		}

		if (dist > ray_maxDist) {
			this.beDrawn();
			return;
		}

		//apply world effects
		this.world.effects(this, distObj);
		//move distance
		this.x += this.dPos[0] * dist;
		this.y += this.dPos[1] * dist;
		this.z += this.dPos[2] * dist;

		return this.iterate(num+1);
	}

	beDrawn() {
		ctx.beginPath();
		ctx.fillStyle = `rgb(${this.color[0]}, ${this.color[1]}, ${this.color[2]})`;
		ctx.fillRect(render_cornerCoords[0] + this.screenX * render_pixelSize, render_cornerCoords[1] + this.screenY * render_pixelSize, render_pixelSize, render_pixelSize);
	}
}

class Ray_Tracking {
	constructor(world, x, y, z, dPos) {
		this.world = world;
		this.x = x;
		this.y = y;
		this.z = z;
		this.dPos = dPos;
		this.distance = 0;
		this.object = undefined;
	}

	iterate(num) {
		if (num > ray_maxIters) {
			return;
		}
		
		//get distance
		var dist = ray_maxDist+1;
		var distObj = undefined;
		var testDist = 1;
		this.world.objects.forEach(w => {
			testDist = w.distanceTo(this);
			if (testDist < dist) {
				dist = testDist;
				distObj = w;
			}
		});

		//if distance is out of dist bounds
		if (dist < ray_minDist) {
			this.object = distObj;
			return;
		}

		if (dist > ray_maxDist) {
			this.distance += dist;
			return;
		}
		//move distance
		this.x += this.dPos[0] * dist;
		this.y += this.dPos[1] * dist;
		this.z += this.dPos[2] * dist;
		this.distance += dist;

		return this.iterate(num+1);
	}
}







class Editor {
	constructor() {
		this.object = undefined;
		this.objectColorStore = undefined;
	}

	beDrawn() {
		ctx.fillStyle = color_editor_bg;
		ctx.fillRect(0, 0, canvas.width, render_cornerCoords[1]);
		ctx.fillRect(0, 0, render_cornerCoords[0], canvas.height);
	}

	toggle() {
		if (!editor_active) {
			//activating
			render_cornerCoords[0] = canvas.width * 0.25;
			render_cornerCoords[1] = canvas.height * 0.25;
			render_pixelSize *= 0.75;
		} else {
			//deactivating
			render_cornerCoords[0] = 0;
			render_cornerCoords[1] = 0;
			render_pixelSize /= 0.75;
		}

		editor_active = !editor_active
	}

	selectObject(pixelCoords) {

	}
}