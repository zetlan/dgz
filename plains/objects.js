//houses all classes

class Player {
	constructor(x, y, z, xRot, yRot) {
		this.friction = 0.85;
		this.gravity = -0.15;

		this.height = 4.9;
		this.onGround = false;

		this.scale = 200;
		this.sens = 0.04;
		this.speed = 0.05;


		this.x = x;
		this.y = y;
		this.z = z;

		this.dx = 0;
		this.dy = 0;
		this.dz = 0;
		this.dMax = 1;
		this.fallMax = 10;

		this.ax = 0;
		this.ay = 0;
		this.az = 0;


		this.theta = yRot;
		this.phi = xRot;

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

		//gravity
		this.dy += this.gravity;
		if (Math.abs(this.dy) > this.fallMax) {
			this.dy *= 0.95;
		}

		//handling position
		if (!editor_active) {
			this.x += this.dz * Math.sin(this.theta);
			this.z += this.dz * Math.cos(this.theta);

			this.x += this.dx * Math.sin(this.theta + (Math.PI/2));
			this.z += this.dx * Math.cos(this.theta + (Math.PI/2));
			
			this.y += this.dy;
		} else {
			if (this.dz > 0.1) {
				var moveCoords = polToCart(this.theta, this.phi, this.speed * 100);
				this.x += moveCoords[0];
				this.y += moveCoords[1];
				this.z += moveCoords[2];
			}
		}


		//camera velocity
		this.theta += this.dt;
		this.phi += this.dp;

		//special case for vertical camera orientation
		if (Math.abs(this.phi) >= Math.PI * 0.5) {
			//if the camera angle is less than 0, set it to -1/2 pi. Otherwise, set it to 1/2 pi
			this.phi = Math.PI * (-0.5 + (this.phi > 0));
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
		if (this.inObj == undefined) {
			this.inObj = new TreeNode(outputs[0]);
		} else if (outputs[0] != undefined) {
			//if there is something in the below bucket, make sure that the output is valid before making it the below bucket's problem
			this.inObj.accept(outputs[0]);
		}

		if (this.outObj == undefined) {
			this.outObj = new TreeNode(outputs[1]);
		} else if (outputs[1] != undefined) {
			this.outObj.accept(outputs[1]);
		}
	}

	//sorry, I probably could have made these one function but I'm lazy oh well
	traverse() {
		//left
		if (this.inObj != undefined) {
			this.inObj.traverse();
		}

		//center
		this.contains.tick();
		this.contains.beDrawn();

		//right
		if (this.outObj != undefined) {
			this.outObj.traverse();
		}
	}

	traverseBackwards() {
		//right
		if (this.outObj != undefined) {
			this.outObj.traverse();
		}

		//center
		this.contains.tick();
		this.contains.beDrawn();

		//left
		if (this.inObj != undefined) {
			this.inObj.traverse();
		}
	}
}