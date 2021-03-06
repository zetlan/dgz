

//abstract class for basic editor functionality
class EditableWorldObject {
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.normal;
		this.faces = [];
		this.handles = [
			[render_crosshairSize, 0, 0],
			[0, render_crosshairSize, 0],
			[0, 0, render_crosshairSize]
		]
		this.handleSelected = -1;
	}

	construct() {

	}

	tick() {
		this.faces.forEach(f => {
			f.tick();
		});
	}

	beDrawn() {

	}

	move(changeXBy, changeYBy, changeZBy) {
		this.x += changeXBy;
		this.y += changeYBy;
		this.z += changeZBy;
		this.construct();
		if (editor_meshSelected != loading_world.meshes[0]) {
			editor_meshSelected.generateBinTree();
		} else {
			loading_world.generateBinTree();
		}
	}

	giveStringData() {
		return `ERROR: STRING DATA NOT DEFINED FOR OBJECT ${this.constructor.name}`;
	}
}

//abstract class for storing multiple arbitrary faces in an object
class CustomObject extends EditableWorldObject {
	constructor(x, y, z, faceData) {
		super(x, y, z);
	}
}


class Mesh extends EditableWorldObject {
	constructor(name) {
		super(undefined, undefined, undefined);
		this.faces = undefined;
		this.name = name;
		this.objects = [];
		this.tolerance = 11;
		this.binTree;
		this.minMaxs;
	}

	generateBinTree() {
		//when generating the binary tree, also generate bounds for self
		this.generatePosBounds();

		//actual tree part
		this.binTree = new TreeNode();
		this.binTree.parent = this;
	
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

	generatePosBounds() {
		this.minMaxs = [[1e1001, -1e1001], [1e1001, -1e1001], [1e1001, -1e1001]];
		//loop through all objects
		this.objects.forEach(r => {
			//face / component distinction
			if (r.points != undefined) {
				r.points.forEach(p => {
					this.generatePosBoundsPoint(p);
				});
			} else {
				r.faces.forEach(f => {
					f.points.forEach(p => {
						this.generatePosBoundsPoint(p);
					});
				});
			}
		});

		//add tolerance to pos bounds in either direction
		this.minMaxs[0][0] -= this.tolerance;
		this.minMaxs[0][1] += this.tolerance;
		this.minMaxs[1][0] -= this.tolerance;
		this.minMaxs[1][1] += this.tolerance;
		this.minMaxs[2][0] -= this.tolerance;
		this.minMaxs[2][1] += this.tolerance;

		//get coordsinates from mins + maxes
		this.x = (this.minMaxs[0][0] + this.minMaxs[0][1]) / 2;
		this.y = (this.minMaxs[1][0] + this.minMaxs[1][1]) / 2;
		this.z = (this.minMaxs[2][0] + this.minMaxs[2][1]) / 2;
	}

	generatePosBoundsPoint(point) {
		this.minMaxs[0][0] = Math.min(point[0], this.minMaxs[0][0]);
		this.minMaxs[1][0] = Math.min(point[1], this.minMaxs[1][0]);
		this.minMaxs[2][0] = Math.min(point[2], this.minMaxs[2][0]);

		this.minMaxs[0][1] = Math.max(point[0], this.minMaxs[0][1]);
		this.minMaxs[1][1] = Math.max(point[1], this.minMaxs[1][1]);
		this.minMaxs[2][1] = Math.max(point[2], this.minMaxs[2][1]);
	}

	giveStringData() {
		var output = `MESH~${this.name}\n`;
		this.objects.forEach(b => {
			output += b.giveStringData() + "\n";
		});
		return output;
	}

	move(changeXBy, changeYBy, changeZBy) {
		this.x += changeXBy;
		this.y += changeYBy;
		this.z += changeZBy;
		//reconstruct all objects in mesh
		this.objects.forEach(h => {
			h.x += changeXBy;
			h.y += changeYBy;
			h.z += changeZBy;

			if (h.points != undefined) {
				h.points.forEach(p => {
					p[0] += changeXBy;
					p[1] += changeYBy;
					p[2] += changeZBy;
				});
			} else {
				h.construct();
			}
		});
	}

	tick() {
		//only tick objects if player is in bounds
		var ref = this.minMaxs;
		if ((player.x > ref[0][0] && player.x < ref[0][1]) && (player.y > ref[1][0] && player.y < ref[1][1]) && (player.z > ref[2][0] && player.z < ref[2][1])) {
			this.objects.forEach(o => {
				o.tick();
			});
		}
	}
}



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
			console.log('case caught');
			this.contains = object;
			return;
		}
		var ref = this.contains;
		var outputs = object.clipAtPlane([ref.x, ref.y, ref.z], ref.normal);

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

	//passes object down the tree, but with no clipping, just inserts the node into the suitable bin
	acceptNode(node) {
		//assumes tree is already built, except for final bins
		var ref = node.contains;
		var zPos = spaceToRelative([ref.x, ref.y, ref.z], [this.contains.x, this.contains.y, this.contains.z], this.contains.normal)[2];
		

		//positive (in self)
		if (zPos > 0) {
			//create blob or push to blob's bin
			if (this.inObj == undefined) {
				this.inObj = new TreeBlob(node);
			} else {
				this.inObj.acceptNode(node);
			}
		} else {
			//negative (out of self)
			if (this.outObj == undefined) {
				this.outObj = new TreeBlob(node);
			} else {
				this.outObj.acceptNode(node);
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
		//this array should contain only binary trees containing meshes
		this.contains = [contains];
	}

	accept(object) {
		this.contains.push(object);
	}

	acceptNode(object) {
		this.contains.push(object);
	}

	traverse(ticking) {
		if (ticking) {
			this.contains.forEach(c => {
				c.traverse(true);
			});
		} else {
			//get distance to all objects
			this.contains.forEach(c => {
				//variable definition avoids having to reconstruct the array every time
				var playArr = [player.x, player.y, player.z];
				c.parent.playerDist = getDistance3d([c.parent.x, c.parent.y, c.parent.z], playArr);
			});
			//order based on distance
			//TODO: change this sort to be custom, rather than the built-in javascript sort. Also test if my custom sorting algorithm is faster or if I'm wasting my time
			this.contains.sort(function (a, b) {
				return b.parent.playerDist - a.parent.playerDist;
			});

			this.contains.forEach(c => {
				c.traverse(false);
			});
		}
	}
}

class World {
	constructor(worldID, bgColor) {
		this.id = worldID;
		this.bg = bgColor;
		this.meshes = [];
		this.binTree;
	}

	addFormally(object) {
		editor_meshSelected.objects.push(object);
		this.generateBinTree();
	}

	generateBinTree() {
		//step 1: generate all mesh trees
		this.meshes.forEach(m => {
			m.generateBinTree();
		});

		//step 2: steal first mesh's tree
		this.binTree = this.meshes[0].binTree;

		//step 3: put other meshes into the tree
		for (var m=1; m<this.meshes.length; m++) {
			this.binTree.acceptNode(this.meshes[m].binTree);
		}
	}

	giveStringData() {
		var output = `\n\nWORLD~${this.id}~${this.bg}\n`;
		this.meshes.forEach(v => {
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
		this.meshes.forEach(o => {
			o.tick();
		});
		player.fixPosBuffer();
	}

	beDrawn() {
		this.binTree.traverse(false);
	}
}