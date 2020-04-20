/*north = +Z
east = +X
south = -Z
west = -X

up = +Y
down = -Y
*/



//all actual objects that can be placed inside a map
//in a cube, the points go NW, NE, SE, SW (clockwise starting from northwest point)
class Cube extends Main {
	constructor(x, y, z, r) {
		super(x, y, z);
		
		//never trust people. Negative radii are no exceptions
		this.rx = Math.abs(r);
		this.ry = Math.abs(r);
		this.rz = Math.abs(r);

		this.rotX = false;
		this.rotY = false;
		this.rotZ = false;

		this.uPoints = [];
		this.lPoints = [];
		this.xyUP = [];
		this.xyLP = [];
		this.faces = [];
		this.cDist;
		this.construct();
	}

	construct() {
		this.generatePoints();
		this.generateScreenPoints();
		this.generateFaces();
	}

	generatePoints() {
		this.uPoints = [];
		this.lPoints = [];

		//upper points
		this.uPoints.push([this.x - this.rx, this.y + this.ry, this.z + this.rz]);
		this.uPoints.push([this.x + this.rx, this.y + this.ry, this.z + this.rz]);
		this.uPoints.push([this.x + this.rx, this.y + this.ry, this.z - this.rz]);
		this.uPoints.push([this.x - this.rx, this.y + this.ry, this.z - this.rz]);

		//lower points
		this.lPoints.push([this.x - this.rx, this.y - this.ry, this.z + this.rz]);
		this.lPoints.push([this.x + this.rx, this.y - this.ry, this.z + this.rz]);
		this.lPoints.push([this.x + this.rx, this.y - this.ry, this.z - this.rz]);
		this.lPoints.push([this.x - this.rx, this.y - this.ry, this.z - this.rz]);
	}
	
	generateScreenPoints() {
		this.xyUP = [];
		this.xyLP = [];
		this.xyUP.push(spaceToScreen(this.uPoints[0]));
		this.xyUP.push(spaceToScreen(this.uPoints[1]));
		this.xyUP.push(spaceToScreen(this.uPoints[2]));
		this.xyUP.push(spaceToScreen(this.uPoints[3]));
		
		this.xyLP.push(spaceToScreen(this.lPoints[0]));
		this.xyLP.push(spaceToScreen(this.lPoints[1]));
		this.xyLP.push(spaceToScreen(this.lPoints[2]));
		this.xyLP.push(spaceToScreen(this.lPoints[3]));
	}

	generateFaces() {
		this.faces = [];
		var nSFaces = this.generateNSFaces();
		
		//the non sorted faces are then put into the array according to the distance from the camera, starting with greatest distance.
		
		//this algorithm should be improved.
		var great = 0;
		var times = nSFaces.length;
		for (var a=0;a<times;a++) {
			
			//running through list to get greatest distance
			for (var b=0;b<nSFaces.length;b++) {
				if (nSFaces[b].cDist > great) {
					great = nSFaces[b].cDist;
				}
			}

			//running through list again, move the greatest distance item to the true faces list
			for (var c=0;c<nSFaces.length;c++) {
				if (nSFaces[c].cDist == great) {
					//remove the item, add it to true face list, exit loop
					this.faces.push(nSFaces[c]);
					nSFaces.splice(c, 1);
					c = nSFaces.length + 1;
				}
			}
			great = 0;
		}
	}

	generateNSFaces() {
		let nSFaces = [];
		//generates each face
		//order is left, right, up, front, back
		nSFaces.push(new Face([this.xyUP[0], this.xyUP[3], this.xyLP[3], this.xyLP[0]], [this.uPoints[0], this.uPoints[3], this.lPoints[3], this.lPoints[0]], -1, 0, 0, this.rotX));
		nSFaces.push(new Face([this.xyUP[1], this.xyUP[2], this.xyLP[2], this.xyLP[1]], [this.uPoints[1], this.uPoints[2], this.lPoints[2], this.lPoints[1]], 1, 0, 0, this.rotX));
		nSFaces.push(new Face([this.xyUP[0], this.xyUP[1], this.xyUP[2], this.xyUP[3]], [this.uPoints[0], this.uPoints[1], this.uPoints[2], this.uPoints[3]], 0, 1, 0, this.rotY));
		nSFaces.push(new Face([this.xyUP[3], this.xyUP[2], this.xyLP[2], this.xyLP[3]], [this.uPoints[3], this.uPoints[2], this.lPoints[2], this.lPoints[3]], 0, 0, -1, this.rotZ));
		nSFaces.push(new Face([this.xyUP[0], this.xyUP[1], this.xyLP[1], this.xyLP[0]], [this.uPoints[0], this.uPoints[1], this.lPoints[1], this.lPoints[0]], 0, 0, 1, this.rotZ));
		return nSFaces;
	}

	beDrawn() {
		ctx.strokeStyle = lnColor;

		for (var h=1;h<this.faces.length;h++) {
			this.faces[h].beDrawn();
		}
	} 
	
	tick() {
		this.construct();
		//ticking each face
		for (var h=1;h<this.faces.length;h++) {
			this.faces[h].tick();
		}
	}

	giveEnglishConstructor(radians) {
		//destructuring object and then applying transformations to it to get coordiantes
		let {x, y, z, rx} = this;
		[x, z] = rotate(x, z, radians);
		[x, y, z] = [Math.round(x), Math.round(y), Math.round(z)];
		return `new Cube(${x}, ${y}, ${z}, ${rx})`;
	}
}



class Wall extends Cube {
	constructor(x, y, z, rx, ry, rz) {
		super(x, y, z);
		this.rx = Math.abs(rx);
		this.ry = Math.abs(ry);
		this.rz = Math.abs(rz);
		this.construct();
	}

	giveEnglishConstructor(radians) {
		let {x, y, z, rx, ry, rz} = this;
		[x, z] = rotate(x, z, radians);
		[rx, rz] = rotate(rx, rz, radians);
		[x, z, rx, rz] = [Math.round(x), Math.round(z), Math.round(rx), Math.round(rz)]
		return (`new Wall(${x}, ${y}, ${z}, ${rx}, ${ry}, ${rz})`);
	}
}


class partialWall extends Wall {
	constructor(x, y, z, rx, ry, rz, xRotable, yRotable, zRotable) {
		super(x, y, z, rx, ry, rz);
		this.rotX = xRotable;
		this.rotY = yRotable;
		this.rotZ = zRotable;
		this.construct();
	}

	giveEnglishConstructor(radians) {
		let {x, y, z, rx, ry, rz, xSolid, ySolid, zSolid} = this;
		return `new partialWall(${x}, ${y}, ${z}, ${rx}, ${ry}, ${rz}, ${xSolid}, ${ySolid}, ${zSolid})`;
	}
}


/*	how to distinguish tilt: 
	1st character: what axis the two faces will move along
	2nd character: the axis normal to the moving faces
	for example, a ZY tilt of 1 will create a rectangular prism, but the points with higher z values have higher y values. */
class tiltedWall extends Wall {
	constructor(x, y, z, rx, ry, rz, XYtilt, XZtilt, ZXtilt, ZYtilt) {
		super(x, y, z, rx, ry, rz);
		this.XYt = XYtilt;
		this.XZt = XZtilt;
		this.ZXt = ZXtilt;
		this.ZYt = ZYtilt;
		this.construct();
	}

	generatePoints() {
		this.uPoints = [];
		this.lPoints = [];

		//upper points, equations are messy sorry
		this.uPoints.push([this.x - this.rx, this.y + this.ry, this.z + this.rz]);
		this.uPoints.push([this.x + this.rx, this.y + this.ry, this.z + this.rz]);
		this.uPoints.push([this.x + this.rx, this.y + this.ry, this.z - this.rz]);
		this.uPoints.push([this.x - this.rx, this.y + this.ry, this.z - this.rz]);

		//lower points
		this.lPoints.push([this.x - this.rx, this.y - this.ry, this.z + this.rz]);
		this.lPoints.push([this.x + this.rx, this.y - this.ry, this.z + this.rz]);
		this.lPoints.push([this.x + this.rx, this.y - this.ry, this.z - this.rz]);
		this.lPoints.push([this.x - this.rx, this.y - this.ry, this.z - this.rz]);
	}

	giveEnglishConstructor(radians) {
		//I'm cheating a bit with this, since the most common transformation is += 1.0708 radians, I just extrapollate to +, -, or 0.

		return `new tiltedWall(${x}, ${y}, ${z}, ${rx}, ${ry}, ${rz}, ${ZYtilt}, ${XYtilt}, ${ZXtilt}, ${XZtilt})`;
	}
}



class Floor extends Main {
	constructor() {
		super(0, -1 * mapSize, 0);
		this.points = []; 
		this.xyP = [];

		this.cDist = Infinity;
		this.generatePoints();
		this.generateScreenPoints();
	}

	generatePoints() {
		this.points.push([this.x - mapSize, this.y, this.z + mapSize]);
		this.points.push([this.x + mapSize, this.y, this.z + mapSize]);
		this.points.push([this.x + mapSize, this.y, this.z - mapSize]);
		this.points.push([this.x - mapSize, this.y, this.z - mapSize]);
	}

	generateScreenPoints() {
		this.xyP = [];
		this.xyP.push(spaceToScreen(this.points[0]));
		this.xyP.push(spaceToScreen(this.points[1]));
		this.xyP.push(spaceToScreen(this.points[2]));
		this.xyP.push(spaceToScreen(this.points[3]));
	}

	tick() {
		//keep the player above the floor
		if (player.y < this.y) {
			player.y = this.y;
			//counteract gravity
			if (player.dy < 0) {
				player.dy = 0;
			}
		}

		//keep the player in bounds
		if (Math.abs(player.x) > mapSize) {
			player.x *= 0.99;
			player.dx = 0;
		}

		if (Math.abs(player.z) > mapSize) {
			player.z *= 0.99;
			player.dz = 0;
		}
	}

	beDrawn() {
		this.generateScreenPoints();
		ctx.fillStyle = floorColor;
		ctx.strokeStyle = lnColor;
		dPoly([this.xyP[0], this.xyP[1], this.xyP[2], this.xyP[3]]);
		ctx.fill();
	}

	getCameraDist() {

	}

	giveEnglishConstructor() {
		return ("new Floor()");
	}
}




//2d objects go down here
class Face {
	constructor(points2d, points3d, xCollisionType, doYCollision, zCollisionType, rotable) {
		this.colX = xCollisionType;
		this.colY = doYCollision;
		this.colZ = zCollisionType;
		this.points = points2d;
		this.spacials = points3d;
		this.rotable = rotable;
		this.cDist = getCameraDist(this.spacials);	
	}

	tick() {
		//collision with the player
		if (inPoly(player.drawCoord2, this.points)) {
			//regular case
			if (!loadingMap.rotating) {
				//different collision procedures for collision values
				//0 is none, 1 is positive, -1 is negative
				if (this.colX != 0) {
					player.x += this.colX * player.mS;
				}

				//special check for y for smoother handling
				if (this.colY) {
					player.y += player.gravity;
					if (player.dy * this.colY <= 0) {
						player.dy = 0;
					}
				}

				if (this.colZ != 0) {
					player.z += this.colZ * player.mS;
				}
				 
			} else if (loadingMap.ableToSwap && !this.rotable) {
				//rotation case
					loadingMap.aSpeed *= -1;
					loadingMap.ableToSwap = false;
					console.log("swapped rotation direction using face type ", this.colX, this.colY, this.colZ);
			}
		}	
	}

	beDrawn() {
		//coloring based on rotation ability
		if (this.rotable) {
			ctx.fillStyle = ableColor;
		} else {
			ctx.fillStyle = blockColor;
		}
		dPoly(this.points);
		ctx.fill();
	}
}