//houses all classes
class Camera {
	constructor(x, y, z, xRot, yRot) {
		this.friction = 0.85;

		this.scale = 200;
		this.sens = 0.04;
		this.speed = 0.025;


		this.x = x;
		this.y = y;
		this.z = z;

		this.dx = 0;
		this.dy = 0;
		this.dz = 0;
		this.dMax = 1;

		this.ax = 0;
		this.ay = 0;
		this.az = 0;


		this.theta = yRot;
		this.phi = xRot;
		this.rot = 0;
		this.targetRot = 0;

		this.dt = 0;
		this.dp = 0;
	}

	tick() {
		//handling velocity

		//adding
		this.dx += this.ax;

		//binding max
		if (Math.abs(this.dx) > this.dMax) {
			this.dx *= 0.95;
		}

		//friction
		if (this.ax == 0) {
			this.dx *= this.friction;
		}

		this.dz += this.az;
		if (Math.abs(this.dz) > this.dMax) {
			this.dz *= 0.95;
		}
		if (this.az == 0) {
			this.dz *= this.friction;
		}
		
		if (Math.abs(this.dy) > this.dMax) {
			this.dy *= 0.95;
		}

		//handling position
		var moveCoords = [0, 0, 0];
		if (Math.abs(this.dz) > 0.05) {
			var toAdd = polToCart(this.theta, this.phi, this.speed * 500 * this.dz);
			moveCoords = [moveCoords[0] + toAdd[0], moveCoords[1] + toAdd[1], moveCoords[2] + toAdd[2]];
			
		}
		if (Math.abs(this.dx) > 0.05) {
			var toAdd = polToCart(this.theta + (Math.PI / 2), 0, this.speed * 500 * this.dx);
			moveCoords = [moveCoords[0] + toAdd[0], moveCoords[1] + toAdd[1], moveCoords[2] + toAdd[2]];
		}
		this.x += moveCoords[0];
		this.y += moveCoords[1];
		this.z += moveCoords[2];


		//camera velocity
		this.theta += this.dt;
		this.phi += this.dp;
		//weighted average towards target rotation
		this.rot = (this.targetRot + (this.rot * 8)) / 9;

		//special case for vertical camera orientation
		if (Math.abs(this.phi) >= Math.PI * 0.5) {
			//if the camera angle is less than 0, set it to -1/2 pi. Otherwise, set it to 1/2 pi
			this.phi = Math.PI * (-0.5 + (this.phi > 0));
		}
	}
}


class Character {
	constructor(x, y, z) {
		this.dir_down = [0, Math.PI / 2];
		this.dir_side = [0, 0];
		this.dir_front = [Math.PI / 2, 0];
		this.gravStrength = 0.04;
		this.speed = 0.1;
		this.dMax = 1.2;

		this.x = x;
		this.y = y;
		this.z = z;

		this.dx = 0;
		this.dy = 0;
		this.dz = 0;

		this.ax = 0;
		this.az = 0;
		this.friction = 0.85;

		this.r = 1000;
		this.cameraDist = 1000;
		this.drawR = this.r / getDistance(this, world_camera);
		this.color = "#888";

	}

	tick() {
		//getting camera distance
		this.cameraDist = Math.max(1, getDistance(this, world_camera) - 20);
		this.drawR = this.r / this.cameraDist;

		//modifying forces
		this.dy -= this.gravStrength;
		if (Math.abs(this.dy) > this.dMax) {
			this.dy = clamp(this.dy, -1 * this.dMax, this.dMax);
		}

		this.dx += this.ax;
		if (this.ax == 0) {
			this.dx *= this.friction;
		}
		if (Math.abs(this.dx) > this.dMax) {
			this.dx = clamp(this.dx, -1 * this.dMax, this.dMax);
		}

		this.dz += this.az;
		if (this.az == 0) {
			this.dz *= this.friction;
		}
		if (Math.abs(this.dz) > this.dMax) {
			this.dz = clamp(this.dz, -1 * this.dMax, this.dMax);
		}

		//moving according to forces
		var turnForce = polToCart(this.dir_side[0], this.dir_side[1], this.dx);
		var gravForce = polToCart(this.dir_down[0], this.dir_down[1], this.dy);
		var frontForce = polToCart(this.dir_front[0], this.dir_front[1], this.dz);
		
		this.x += gravForce[0] + turnForce[0] + frontForce[0];
		this.y += gravForce[1] + turnForce[1] + frontForce[1];
		this.z += gravForce[2] + turnForce[2] + frontForce[2];
	}

	beDrawn() {
		if (!isClipped([this.x, this.y, this.z])) {
			var [tX, tY] = spaceToScreen([this.x, this.y, this.z]);
			drawCircle(this.color, tX, tY, this.drawR);
			
			if (editor_active) {
				var cartX = polToCart(this.dir_side[0], this.dir_side[1], 10);
				var cartY = polToCart(this.dir_down[0], this.dir_down[1], 10);
				var cartZ = polToCart(this.dir_front[0], this.dir_front[1], 10);
				var xXY = spaceToScreen([cartX[0] + this.x, cartX[1] + this.y, cartX[2] + this.z]);
				var yXY = spaceToScreen([cartY[0] + this.x, cartY[1] + this.y, cartY[2] + this.z]);
				var zXY = spaceToScreen([cartZ[0] + this.x, cartZ[1] + this.y, cartZ[2] + this.z]);
				ctx.beginPath();
				ctx.strokeStyle = "#F00";
				ctx.moveTo(tX, tY);
				ctx.lineTo(xXY[0], xXY[1]);
				ctx.stroke();

				ctx.beginPath();
				ctx.strokeStyle = "#0F0";
				ctx.moveTo(tX, tY);
				ctx.lineTo(yXY[0], yXY[1]);
				ctx.stroke();

				ctx.beginPath();
				ctx.strokeStyle = "#00F";
				ctx.moveTo(tX, tY);
				ctx.lineTo(zXY[0], zXY[1]);
				ctx.stroke();
			}
		}
	}



}


class TreeNode {
	constructor(contains) {
		this.contains = contains;
		this.inObj = undefined;
		this.outObj = undefined;
	}

	//passes object to a spot below the self
	accept(object) {
		var ref = this.contains;
		var outputs = object.clipAtPlane([ref.x, ref.y, ref.z], [ref.normal[0], ref.normal[1]]);

		//if the object in the below bucket is not defined, push output to below bucket
		if (outputs[0] != undefined) {
			if (this.inObj == undefined) {
				this.inObj = new TreeNode(outputs[0]);
			} else {
				//if there is something in the below bucket, make sure that the output is valid before making it the below bucket's problem
				this.inObj.accept(outputs[0]);
			}
		}

		if (outputs[1] != undefined) {
			if (this.outObj == undefined) {
				this.outObj = new TreeNode(outputs[1]);
			} else {
				this.outObj.accept(outputs[1]);
			}
		}
	}

	traverse(tick) {
		//getting the dot product of angles between self normal and camera normal
		var v1 = polToCart(this.contains.normal[0], this.contains.normal[1], 1);
		var v2 = [world_camera.x - this.contains.x, world_camera.y - this.contains.y, world_camera.z - this.contains.z];

		var dot = (v1[0] * v2[0]) + (v1[1] * v2[1]) + (v1[2] * v2[2]);

		//traverse in reverse order if the dot product is negative
		if (dot > 0) {
			//right
			if (this.outObj != undefined) {
				this.outObj.traverse(tick);
			}

			//center
			if (tick) {
				this.contains.tick();
			} else {
				this.contains.beDrawn();
			}

			//left
			if (this.inObj != undefined) {
				this.inObj.traverse(tick);
			}
		} else {
			if (this.inObj != undefined) {
				this.inObj.traverse(tick);
			}
			if (tick) {
				this.contains.tick();
			} else {
				this.contains.beDrawn();
			}
			if (this.outObj != undefined) {
				this.outObj.traverse(tick);
			}
		}
	}
}