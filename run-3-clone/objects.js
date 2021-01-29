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

		this.targetX = x;
		this.targetY = y;
		this.targetZ = z;

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
		this.targetTheta = 0;
		this.targetRot = 0;
		this.animSteps = 9;

		this.dt = 0;
		this.dp = 0;
	}

	tick() {
		if (editor_active || !(loading_state instanceof State_Game)) {
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
				this.dz = clamp(this.dz, -1 * this.dMax, this.dMax);
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
			this.theta += this.dt;
		} else {
			//changing with average
			this.x = (this.targetX + (this.x * (this.animSteps - 1))) / this.animSteps;
			this.y = (this.targetY + (this.y * (this.animSteps - 1))) / this.animSteps;
			this.z = (this.targetZ + (this.z * (this.animSteps - 1))) / this.animSteps;
			this.theta = (this.targetTheta + (this.theta * (this.animSteps - 1))) / this.animSteps;
		}


		//camera velocity
		this.phi += this.dp;
		//weighted average towards target rotation
		this.rot = (this.targetRot + (this.rot * (this.animSteps - 1))) / this.animSteps;

		//special case for vertical camera orientation
		if (Math.abs(this.phi) >= Math.PI * 0.5) {
			//if the camera angle is less than 0, set it to -1/2 pi. Otherwise, set it to 1/2 pi
			this.phi = Math.PI * (-0.5 + (this.phi > 0));
		}
	}

	handleSpace() {
		this.targetRot = 0;
	}
}


class Character {
	constructor(x, y, z) {
		this.dir_down = [0, Math.PI / 2];
		this.dir_side = [0, 0];
		this.dir_front = [Math.PI / 2, 0];
		this.gravStrength = 0.1;
		this.speed = 0.15;
		this.dMax = 3.6;

		this.onGround = 0;
		this.jumpTime = controls_jumpTime;

		this.x = x;
		this.y = y;
		this.z = z;
		
		this.parent = undefined;
		this.parentPrev = undefined;

		this.dx = 0;
		this.dy = 0;
		this.dz = this.dMax;

		this.ax = 0;
		this.az = 0;
		this.friction = 0.85;
		this.naturalFriction = 0.97;

		this.r = 10;
		this.cameraDist = 1000;
		this.drawR = this.r / getDistance(this, world_camera);
		this.color = color_character;

	}

	modifyDerivitives(activeGravity, activeFriction, activeAX, activeAZ) {
		//decreasing the time to jump
		this.onGround -= 1;
		//modifying forces
		if (this.parent != undefined) {
			//if in the void, half gravity
			this.dy -= linterp(activeGravity * 0.7, activeGravity, this.parent.power);
		} else {
			this.dy -= activeGravity;
		}
		if (this.dy > 0 && controls_spacePressed && this.jumpTime > 0) {
			this.dy += controls_jumpBoost;
			this.jumpTime -= 1;
		}
		if (Math.abs(this.dy) > this.dMax) {
			this.dy = clamp(this.dy, -1 * this.dMax, 1.5 * this.dMax);
		}

		this.dx += activeAX;
		if (this.ax == 0) {
			this.dx *= activeFriction;
		}
		
		if (Math.abs(this.dx) > this.dMax) {
			this.dx = clamp(this.dx, -1 * this.dMax, this.dMax);
		}

		this.dz += activeAZ;
		//natural friction
		this.dz *= this.naturalFriction;
		if (Math.abs(this.dz) > this.dMax) {
			this.dz = clamp(this.dz, -1.05 * this.dMax, 1.05 * this.dMax);
		}
	}

	tick() {
		//setting camera position
		var vertOffset = polToCart(this.dir_down[0], this.dir_down[1], 100);
		var horizOffset = polToCart(this.dir_front[0], this.dir_front[1], -100);
		world_camera.targetX = this.x + vertOffset[0] + horizOffset[0];
		world_camera.targetY = this.y + vertOffset[1] + horizOffset[1];
		world_camera.targetZ = this.z + vertOffset[2] + horizOffset[2];



		//getting camera distance
		this.cameraDist = Math.max(1, getDistance(this, world_camera) - 20);
		this.drawR = (this.r / this.cameraDist) * world_camera.scale;

		//only do the other tick stuff if camera is close enough
		if (this.cameraDist < 1000 && !editor_active) {
			//if in the void, change around variables
			if (this.parent != undefined && !this.parent.playerIsInTunnel()) {
				this.modifyDerivitives(this.gravStrength / 7, this.friction * 0.8, this.ax / 2, this.speed / 2);
			} else {
				this.modifyDerivitives(this.gravStrength, this.friction, this.ax, this.speed);
			}

			//moving according to forces
			var turnForce = polToCart(this.dir_side[0], this.dir_side[1], this.dx);
			var gravForce = polToCart(this.dir_down[0], this.dir_down[1], this.dy);
			var frontForce = polToCart(this.dir_front[0], this.dir_front[1], this.dz);
			
			this.x += gravForce[0] + turnForce[0] + frontForce[0];
			this.y += gravForce[1] + turnForce[1] + frontForce[1];
			this.z += gravForce[2] + turnForce[2] + frontForce[2];
		}
	}

	beDrawn() {
		if (!isClipped([this.x, this.y, this.z])) {
			var [tX, tY] = spaceToScreen([this.x, this.y, this.z]);
			drawCircle("#000", tX, tY, this.drawR);
			drawCircle(this.color, tX, tY, this.drawR - 4);
			
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

	handleSpace() {
		if (this.onGround > 0) {
			this.dy = controls_jumpInitial;
			this.jumpTime = controls_jumpTime;
			this.onGround = 0;
		}
	}
}