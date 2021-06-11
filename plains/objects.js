
class Player {
	constructor(x, y, z, xRot, yRot) {
		this.friction = 0.85;
		this.gravity = -0.15;

		this.height = 4.9;
		this.onGround = false;
		this.posBuffer = [];

		this.scale = 250;
		this.sens = 0.04;
		this.speed = 0.05;


		this.x = x;
		this.y = y;
		this.z = z;

		this.dx = 0;
		this.dy = 0;
		this.dz = 0;
		this.dMax = 1;
		this.fallMax = this.dMax * 1.98;

		this.ax = 0;
		this.ay = 0;
		this.az = 0;


		this.theta = yRot;
		this.phi = xRot;
		this.normalsBuffer = [
			polToCart(this.theta + Math.PI / 2, 0, 1),
			polToCart(this.theta, this.phi + Math.PI / 2, 1),
			polToCart(this.theta, this.phi, 1)
		];

		this.dt = 0;
		this.dp = 0;
	}

	fixPosBuffer() {
		this.posBuffer.forEach(p => {
			this.x += p[0];
			this.y += p[1];
			this.z += p[2];
		});
		this.posBuffer = [];
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
		if (!noclip_active) {
			this.x += this.dz * Math.sin(this.theta);
			this.z += this.dz * Math.cos(this.theta);

			this.x += this.dx * Math.sin(this.theta + (Math.PI/2));
			this.z += this.dx * Math.cos(this.theta + (Math.PI/2));
			
			this.y += this.dy;
		} else {
			var moveCoords = [0, 0, 0];
			if (Math.abs(this.dz) > 0.1) {
				var toAdd = polToCart(this.theta, this.phi, this.dz * player_noclipMultiplier);
				moveCoords = [moveCoords[0] + toAdd[0], moveCoords[1] + toAdd[1], moveCoords[2] + toAdd[2]];
				
			}
			if (Math.abs(this.dx) > 0.1) {
				var toAdd = polToCart(this.theta + (Math.PI / 2), 0, this.dx * player_noclipMultiplier);
				moveCoords = [moveCoords[0] + toAdd[0], moveCoords[1] + toAdd[1], moveCoords[2] + toAdd[2]];
			}
			this.x += moveCoords[0];
			this.y += moveCoords[1];
			this.z += moveCoords[2];
		}


		//camera velocity
		this.theta += this.dt;
		this.phi += this.dp;

		//special case for vertical camera orientation
		if (Math.abs(this.phi) >= Math.PI * 0.5) {
			//if the camera angle is less than 0, set it to -1/2 pi. Otherwise, set it to 1/2 pi
			this.phi = Math.PI * (-0.5 + (this.phi > 0));
		}
		this.normalsBuffer = [
			polToCart(this.theta + Math.PI / 2, 0, 1),
			polToCart(this.theta, this.phi + Math.PI / 2, 1),
			polToCart(this.theta, this.phi, 1)
		];
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
		if (this.contains == undefined) {
			this.contains = object;
			return;
		}
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

	isBackwards() {
		//getting the dot product of angles between self normal and player normal
		var v1 = polToCart(this.contains.normal[0], this.contains.normal[1], 1);
		var v2 = [player.x - this.contains.x, player.y - this.contains.y, player.z - this.contains.z];
		return ((v1[0] * v2[0]) + (v1[1] * v2[1]) + (v1[2] * v2[2])) <= 0;
	}

	traverse(ticking) {
		//decide traversal order
		if (this.isBackwards()) {
			if (this.inObj != undefined) {
				this.inObj.traverse(ticking);
			}
			if (ticking) {
				this.contains.tick();
			} else {
				this.contains.beDrawn();
			}
			if (this.outObj != undefined) {
				this.outObj.traverse(ticking);
			}
		} else {
			//right
			if (this.outObj != undefined) {
				this.outObj.traverse(ticking);
			}

			//center
			if (ticking) {
				this.contains.tick();
			} else {
				this.contains.beDrawn();
			}

			//left
			if (this.inObj != undefined) {
				this.inObj.traverse(ticking);
			}
		}
	}
}

//like a treenode, but doesn't have children. Instead, any objects that go in will be grouped by distance to the camera
class TreeBlob {
	constructor(contains) {
		this.contains = [contains];
	}

	accept(object) {
		this.contains.push(object);
	}
}

class World {
	constructor(worldID, bgColor) {
		this.id = worldID;
		this.bg = bgColor;
		this.objects = [];
		this.binTree;
	}

	addFormally(object) {
		this.objects.push(object);
		this.generateBinTree();
	}

	generateBinTree() {
		this.binTree = new TreeNode();
	
		this.objects.forEach(r => {
			//if the objects have points (are a face), put them in directly. If not, put their component faces in
			if (r.points != undefined) {
				this.binTree.accept(r);
			} else {
				r.faces.forEach(f => {
					this.binTree.accept(f);
				});
			}
		});
	}

	giveStringData() {
		var output = `\n\nCAST~${this.id}~${this.bg}\n`;
		this.objects.forEach(v => {
			output += v.giveStringData() + "\n";
		});
		return output;
	}

	exist() {
		this.tick();
		this.beDrawn();
	}

	tick() {
		player.tick();
		this.objects.forEach(o => {
			o.tick();
		});
		player.fixPosBuffer();
	}

	beDrawn() {
		this.binTree.traverse(false);
	}
}