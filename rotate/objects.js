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
		
		//avoiding negative radii
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
		//order is left, right, top, front, back
		nSFaces.push(new Face([this.xyUP[0], this.xyUP[3], this.xyLP[3], this.xyLP[0]], [this.uPoints[0], this.uPoints[3], this.lPoints[3], this.lPoints[0]], -1, 0, 0, this.rotX, this));
		nSFaces.push(new Face([this.xyUP[1], this.xyUP[2], this.xyLP[2], this.xyLP[1]], [this.uPoints[1], this.uPoints[2], this.lPoints[2], this.lPoints[1]], 1, 0, 0, this.rotX, this));
		nSFaces.push(new Face([this.xyUP[0], this.xyUP[1], this.xyUP[2], this.xyUP[3]], [this.uPoints[0], this.uPoints[1], this.uPoints[2], this.uPoints[3]], 0, 1, 0, this.rotY, this));
		nSFaces.push(new Face([this.xyUP[3], this.xyUP[2], this.xyLP[2], this.xyLP[3]], [this.uPoints[3], this.uPoints[2], this.lPoints[2], this.lPoints[3]], 0, 0, -1, this.rotZ, this));

		//back is only added if rotating
		if (loadingMap != undefined && loadingMap.rotating) {
			nSFaces.push(new Face([this.xyUP[0], this.xyUP[1], this.xyLP[1], this.xyLP[0]], [this.uPoints[0], this.uPoints[1], this.lPoints[1], this.lPoints[0]], 0, 0, 1, this.rotZ, this));
		}
		return nSFaces;
	}

	beDrawn() {
		this.construct();
		for (var h=0;h<this.faces.length;h++) {
			this.faces[h].beDrawn();
		}
	} 
	
	tick() {
		//only tick if the player should be able to collide
		if (player.z > this.z - this.rz || loadingMap.rotating) {
			//ticking each face
			for (var h=this.faces.length-1;h>=0;h--) {
					this.faces[h].tick();
			}
		}
	}

	giveEnglishConstructor(radians) {
		//destructuring object and then applying transformations to it to get coordiantes
		let {x, y, z, rx} = this;
		[x, z] = rotate(x, z, radians);
		[x, y, z] = [Math.round(x), Math.round(y), Math.round(z)];
		return `new Cube(${x}, ${y}, ${z}, ${Math.abs(rx)})`;
	}
}



class Box extends Cube {
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
		return (`new Box(${Math.round(x)}, ${Math.round(y)}, ${Math.round(z)}, ${Math.abs(rx)}, ${Math.abs(ry)}, ${Math.abs(rz)})`);
	}
}

class AlphaBox extends Box {
	constructor(x, y, z, rx, ry, rz, alpha) {
		super(x, y, z, rx, ry, rz);
		this.alpha = alpha;
		this.alHome = alpha;
	}

	giveEnglishConstructor(radians) {
		let {x, y, z, rx, ry, rz, alHome} = this;
		[x, z] = rotate(x, z, radians);
		[rx, rz] = rotate(rx, rz, radians);
		[x, z, rx, rz] = [Math.round(x), Math.round(z), Math.round(rx), Math.round(rz)]
		return (`new AlphaBox(${Math.round(x)}, ${Math.round(y)}, ${Math.round(z)}, ${Math.abs(rx)}, ${Math.abs(ry)}, ${Math.abs(rz)}, ${alHome})`);
	}
}

class Blocker extends Box {
	constructor(dir0Through3) {
		switch (dir0Through3) {
			case 0:
				super(-1 * mapSize, 0, 0, 1, mapSize, mapSize);
				break;
			case 1:
				super(0, 0, mapSize, mapSize, mapSize, 1);
				break;
			case 2:
				super(1 * mapSize, 0, 0, 1, mapSize, mapSize);
				break;
			case 3:
				super(0, 0, -1 * mapSize, mapSize, mapSize, 1);
				break;
			default:
				console.log("invalid direction " + dir0Through3 + " recieved for Blocker");
				break;
		}
		this.dir = dir0Through3;
		this.cDist *= 2;
	}

	giveEnglishConstructor(radians) {
		let {dir} = this;
		if (radians < 0) {
			dir += 1;
			if (dir > 3) {
				dir = 0;
			}
		}
		if (radians > 0) {
			dir -= 1;
			if (dir < 0) {
				dir = 3;
			}
		}

		return `new Blocker(${dir})`;
	}

	getCameraDist() {
		super.getCameraDist();
		if (this.dir != 3) {
			this.cDist *= 2;
		}	
	}
}

class PartialBox extends Box {
	constructor(x, y, z, rx, ry, rz, xRotable, yRotable, zRotable) {
		super(x, y, z, rx, ry, rz);
		this.rotX = xRotable;
		this.rotY = yRotable;
		this.rotZ = zRotable;
		this.construct();
	}

	giveEnglishConstructor(radians) {
		let {x, y, z, rx, ry, rz, rotX, rotY, rotZ} = this;
		[x, z] = rotate(x, z, radians);
		[rx, rz] = rotate(rx, rz, radians);
		[rx, rz] = [Math.round(rx), Math.round(rz)];
		if (radians != 0) {
			[rotX, rotZ] = [rotZ, rotX];
		}
		return `new PartialBox(${Math.round(x)}, ${Math.round(y)}, ${Math.round(z)}, ${Math.abs(rx)}, ${Math.abs(ry)}, ${Math.abs(rz)}, ${rotZ}, ${rotY}, ${rotX})`;
	}
}

//maybe I could have optimized this better, but here I am
class Wall extends PartialBox {
	constructor(dir0Through3) {
		switch (dir0Through3) {
			case 0:
				super(-1 * mapSize, 0, 0, 1, mapSize, mapSize, true, true, true);
				break;
			case 1:
				super(0, 0, mapSize, mapSize, mapSize, 1, true, true, true);
				break;
			case 2:
				super(1 * mapSize, 0, 0, 1, mapSize, mapSize, true, true, true);
				break;
			case 3:
				super(0, 0, -1 * mapSize, mapSize, mapSize, 1, true, true, true);
				break;
			default:
				console.log("invalid direction " + dir0Through3 + " recieved for Wall");
				break;
		}
		this.dir = dir0Through3;
		this.cDist *= 2;
	}

	giveEnglishConstructor(radians) {
		let {dir} = this;
		if (radians < 0) {
			dir += 1;
			if (dir > 3) {
				dir = 0;
			}
		}
		if (radians > 0) {
			dir -= 1;
			if (dir < 0) {
				dir = 3;
			}
		}

		return `new Wall(${dir})`;
	}

	getCameraDist() {
		super.getCameraDist();
		if (this.dir != 3) {
			this.cDist *= 2;
		}	
	}
}


/*	how to distinguish tilt: 
	1st character: what axis the two faces will move along
	2nd character: the axis normal to the moving faces
	for example, a ZY tilt of 1 will create a rectangular prism, but the points with higher z values have higher y values. 
	The axis not in the tilt name is the axis you could draw a fixed line through. */
class TiltedBox extends PartialBox {
	constructor(x, y, z, rx, ry, rz, rotableX, rotableY, rotableZ, XYslope, XZslope, ZXslope, ZYslope) {
		super(x, y, z, rx, ry, rz, rotableX, rotableY, rotableZ);
		this.XYt = XYslope;
		this.XZt = XZslope;
		this.ZXt = ZXslope;
		this.ZYt = ZYslope;
		this.construct();
	}

	generatePoints() {
		this.uPoints = [];
		this.lPoints = [];

		//upper points, equations are messy sorry
		this.uPoints.push([(this.x - this.rx) + (this.ZXt * this.rz), (this.y + this.ry) - (this.XYt * this.rx) + (this.ZYt * this.rz), (this.z + this.rz) - (this.XZt * this.rx)]);
		this.uPoints.push([(this.x + this.rx) + (this.ZXt * this.rz), (this.y + this.ry) + (this.XYt * this.rx) + (this.ZYt * this.rz), (this.z + this.rz) + (this.XZt * this.rx)]);
		this.uPoints.push([(this.x + this.rx) - (this.ZXt * this.rz), (this.y + this.ry) + (this.XYt * this.rx) - (this.ZYt * this.rz), (this.z - this.rz) + (this.XZt * this.rx)]);
		this.uPoints.push([(this.x - this.rx) - (this.ZXt * this.rz), (this.y + this.ry) - (this.XYt * this.rx) - (this.ZYt * this.rz), (this.z - this.rz) - (this.XZt * this.rx)]);

		//lower points
		this.lPoints.push([(this.x - this.rx) + (this.ZXt * this.rz), (this.y - this.ry) - (this.XYt * this.rx) + (this.ZYt * this.rz), (this.z + this.rz) - (this.XZt * this.rx)]);
		this.lPoints.push([(this.x + this.rx) + (this.ZXt * this.rz), (this.y - this.ry) + (this.XYt * this.rx) + (this.ZYt * this.rz), (this.z + this.rz) + (this.XZt * this.rx)]);
		this.lPoints.push([(this.x + this.rx) - (this.ZXt * this.rz), (this.y - this.ry) + (this.XYt * this.rx) - (this.ZYt * this.rz), (this.z - this.rz) + (this.XZt * this.rx)]);
		this.lPoints.push([(this.x - this.rx) - (this.ZXt * this.rz), (this.y - this.ry) - (this.XYt * this.rx) - (this.ZYt * this.rz), (this.z - this.rz) - (this.XZt * this.rx)]);
	}

	generateNSFaces() {
		let nSFaces = [];
		//in a tilted box, the top side is always rotable
		nSFaces.push(new Face([this.xyUP[0], this.xyUP[3], this.xyLP[3], this.xyLP[0]], [this.uPoints[0], this.uPoints[3], this.lPoints[3], this.lPoints[0]], -1, 0, 0, this.rotX, this));
		nSFaces.push(new Face([this.xyUP[1], this.xyUP[2], this.xyLP[2], this.xyLP[1]], [this.uPoints[1], this.uPoints[2], this.lPoints[2], this.lPoints[1]], 1, 0, 0, this.rotX, this));
		nSFaces.push(new Face([this.xyUP[0], this.xyUP[1], this.xyUP[2], this.xyUP[3]], [this.uPoints[0], this.uPoints[1], this.uPoints[2], this.uPoints[3]], 0, 1, 0, true, this));
		nSFaces.push(new Face([this.xyUP[3], this.xyUP[2], this.xyLP[2], this.xyLP[3]], [this.uPoints[3], this.uPoints[2], this.lPoints[2], this.lPoints[3]], 0, 0, -1, this.rotZ, this));
		if (loadingMap != undefined && loadingMap.rotating) {
			nSFaces.push(new Face([this.xyUP[0], this.xyUP[1], this.xyLP[1], this.xyLP[0]], [this.uPoints[0], this.uPoints[1], this.lPoints[1], this.lPoints[0]], 0, 0, 1, this.rotZ, this));
		}
		return nSFaces;
	}

	giveEnglishConstructor(radians) {
		//I'm cheating a bit with this by just extrapollating to +, -, or 0.
		let {x, y, z, rx, ry, rz, rotX, rotY, rotZ, XYt, XZt, ZXt, ZYt} = this;
		console.log(radians, x, z);
		if (radians != 0) {
			[x, z] = rotate(x, z, radians);
			[rx, rz] = rotate(rx, rz, radians);
			[rx, ry, rz] = [Math.round(rx), Math.round(ry), Math.round(rz)];
			[rotX, rotZ] = [rotZ, rotX];

			if (radians < 0) {
				[XYt, ZYt, ZXt, XZt] = [-1 * ZYt, -1 * XYt, -1 * XZt, -1 * ZXt];
			} else {
				[XYt, ZYt, ZXt, XZt] = [ZYt, XYt, XZt, ZXt];
			}
		}
		console.log(radians, x, z);
		return `new TiltedBox(${Math.round(x)}, ${Math.round(y)}, ${Math.round(z)}, ${Math.abs(rx)}, ${Math.abs(ry)}, ${Math.abs(rz)}, ${rotX}, ${rotY}, ${rotZ}, ${XYt}, ${XZt}, ${ZXt}, ${ZYt})`;
	}
}

class Icosahedron extends Box {
	constructor(x, y, z, rx, ry, rz, dir0Through3, color) {
		super(x, y, z, rx, ry, rz);
		this.color = color;
		this.theta = 0;
		this.phi = 0;

		this.xyTP = [];
		this.xyBP = [];
		this.tPoint = [];
		this.bPoint = [];
		this.dir = dir0Through3;
		this.construct();
	}

	construct() {
		if (this.theta != undefined && this.phi != undefined) {
			this.generatePoints();
			this.generateScreenPoints();
			this.generateFaces();
		}
	}

	generatePoints() {
		//generate the 4 layers of points
		this.uPoints = [];
		this.lPoints = [];

		//top and bottom point
		this.tPoint = this.polToCart(0, 0);
		this.bPoint = this.polToCart(Math.PI, 0);

		//top-mid layer
		for (var z=0;z<5;z++) {
			this.uPoints.push(this.polToCart(Math.PI * 0.35, (Math.PI * (0.4 * z)) + (Math.PI * 0.5 * this.dir)));
		}
		//low-mid layer
		for (var z=0;z<5;z++) {
			this.lPoints.push(this.polToCart(Math.PI * 0.65, (Math.PI * ((0.4 * z) + 0.2)) + (Math.PI * 0.5 * this.dir)));
		}
	}
	
	generateScreenPoints() {
		this.xyUP = [];
		this.xyLP = [];
		this.xyTP = [];
		this.xyBP = [];

		//top/bottom
		this.xyTP = spaceToScreen(this.tPoint);
		this.xyBP = spaceToScreen(this.bPoint);

		//up/down
		for (var b=0;b<this.uPoints.length;b++) {
			this.xyUP.push(spaceToScreen(this.uPoints[b]));
		}

		for (var b=0;b<this.lPoints.length;b++) {
			this.xyLP.push(spaceToScreen(this.lPoints[b]));
		}
	}

	generateNSFaces() {
		let nSFaces = [];
		//generates each face
		//top 5 faces
		for (var x=0;x<5;x++) {
			nSFaces.push(new ColorableFace([this.xyTP, this.xyUP[x], this.xyUP[(x+1)%5]], [this.tPoint, this.uPoints[x], this.uPoints[(x+1)%5]], this, this.color));
		}
		

		//bottom 5 faces
		for (var x=0;x<5;x++) {
			nSFaces.push(new ColorableFace([this.xyBP, this.xyLP[x], this.xyLP[(x+1)%5]], [this.bPoint, this.lPoints[x], this.lPoints[(x+1)%5]], this, this.color));
		}

		//10 faces in center
		var xU = 0;
		var xD = 0;
		for (var x=0;x<10;x++) {
			//two sides of triangle
			if (x % 2 == 0) {
				nSFaces.push(new ColorableFace([this.xyUP[(xU)%5], this.xyLP[(xD)%5], this.xyUP[(xU+1)%5]], [this.uPoints[(xU)%5], this.lPoints[(xD)%5], this.uPoints[(xU+1)%5]], this, this.color));
				xU += 1;
			} else {
				nSFaces.push(new ColorableFace([this.xyLP[(xD)%5], this.xyUP[(xU)%5], this.xyLP[(xD+1)%5]], [this.lPoints[(xD)%5], this.uPoints[(xU)%5], this.lPoints[(xD+1)%5]], this, this.color));
				xD += 1;
			}
		}
		return nSFaces;
	}

	polToCart(theta, phi) {
		//theta here is vertical inclination, while phi is horizontal
		var x = this.rx * Math.cos(phi) * Math.sin(theta);
		var y = this.ry * Math.cos(theta);
		var z = this.rz * Math.sin(phi) * Math.sin(theta);
		return [x + this.x, y + this.y, z + this.z];
	}

	giveEnglishConstructor(radians) {
		//destructuring object and then applying transformations to it to get coordiantes
		let {x, y, z, rx, ry, rz, dir, color} = this;

		//adjusting direction
		if (radians > 0) {
			dir += 1;
			dir = dir % 4;
		}
		if (radians < 0) {
			dir -= 1;
			if (dir < 0) {
				dir = 3;
			}
		}
		//adjusting position/size
		[x, z] = rotate(x, z, radians);
		[rx, rz] = rotate(rx, rz, radians);

		return `new Icosahedron(${x}, ${y}, ${z}, ${rx}, ${ry}, ${rz}, ${dir}, "${color}")`;
	}
}


//octohedron class
class Octohedron extends PartialBox {
	constructor(x, y, z, rx, ry, rz, rotable) {
		super(x, y, z, rx, ry, rz, rotable, rotable, rotable);
		this.mPoints = [];
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
		this.mPoints = [];

		//middle points, only 3 instead of 4 because it's facing the front
		this.mPoints.push([this.x + this.rx, this.y, this.z]);
		this.mPoints.push([this.x, this.y, this.z - this.rz]);
		this.mPoints.push([this.x - this.rx, this.y, this.z]);
		this.mPoints.push([this.x, this.y, this.z + this.rz]);

		//top/bottom points
		this.uPoints = [this.x, this.y + this.ry, this.z];
		this.lPoints = [this.x, this.y - this.ry, this.z];
	}
	
	generateScreenPoints() {
		this.xyUP = [];
		this.xyLP = [];
		this.xyUP.push(spaceToScreen(this.mPoints[0]));
		this.xyUP.push(spaceToScreen(this.mPoints[1]));
		this.xyUP.push(spaceToScreen(this.mPoints[2]));
		this.xyUP.push(spaceToScreen(this.mPoints[3]));
		
		this.xyLP.push(spaceToScreen(this.uPoints));
		this.xyLP.push(spaceToScreen(this.lPoints));
	}

	generateNSFaces() {
		let nSFaces = [];
		//generates all 4 front faces
		nSFaces.push(new Face([this.xyLP[0], this.xyUP[2], this.xyUP[1]], [this.uPoints, this.mPoints[2], this.mPoints[1]], -1, 0, 0, this.rotX, this));
		nSFaces.push(new Face([this.xyLP[0], this.xyUP[1], this.xyUP[0]], [this.uPoints, this.mPoints[1], this.mPoints[0]], 1, 0, 0, this.rotX, this));
		nSFaces.push(new Face([this.xyLP[1], this.xyUP[2], this.xyUP[1]], [this.lPoints, this.mPoints[2], this.mPoints[1]], -1, 0, 0, this.rotX, this));
		nSFaces.push(new Face([this.xyLP[1], this.xyUP[1], this.xyUP[0]], [this.lPoints, this.mPoints[1], this.mPoints[0]], 1, 0, 0, this.rotX, this));

		//generate back faces if rotating
		if (loadingMap != undefined && loadingMap.rotating) {
			nSFaces.push(new Face([this.xyLP[0], this.xyUP[2], this.xyUP[3]], [this.uPoints, this.mPoints[2], this.mPoints[1]], -1, 0, 0, this.rotX, this));
			nSFaces.push(new Face([this.xyLP[0], this.xyUP[3], this.xyUP[0]], [this.uPoints, this.mPoints[1], this.mPoints[0]], 1, 0, 0, this.rotX, this));
			nSFaces.push(new Face([this.xyLP[1], this.xyUP[2], this.xyUP[3]], [this.lPoints, this.mPoints[2], this.mPoints[1]], -1, 0, 0, this.rotX, this));
			nSFaces.push(new Face([this.xyLP[1], this.xyUP[3], this.xyUP[0]], [this.lPoints, this.mPoints[1], this.mPoints[0]], 1, 0, 0, this.rotX, this));
		}
		return nSFaces;
	}

	giveEnglishConstructor(radians) {
		//the whole destructuring thingy
		let {x, y, z, rx, ry, rz, rotable} = this;
		[x, z] = rotate(x, z, radians);
		[x, y, z] = [Math.round(x), Math.round(y), Math.round(z)];
		return `new Octohedron(${x}, ${y}, ${z}, ${rx}, ${ry}, ${rz}, ${rotable})`;
	}
}



class Floor extends Main {
	constructor() {
		super(0, -1 * mapSize, 0);
		this.points = []; 
		this.xyP = [];

		this.rx = mapSize;
		this.ry = 0;
		this.rz = mapSize;

		this.cDist = Infinity;
		this.generatePoints();
		this.generateScreenPoints();
	}

	generatePoints() {
		this.points = [];
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
		//occasionally check self
		if (pTime % 15 == 0) {
			this.generatePoints();
		}
		//keep the player above the floor
		if (player.y < this.y) {
			player.y = this.y;
			//counteract gravity
			if (player.dy < 0) {
				player.dy = 0;
			}
		}

		//keep the player in bounds
		while (Math.abs(player.x) > mapSize) {
			player.x *= 0.99;
			player.dx = 0;
		}

		while (Math.abs(player.z) > mapSize) {
			player.z *= 0.99;
			player.dz = 0;
		}
	}

	beDrawn() {
		this.generateScreenPoints();
		ctx.fillStyle = floorColor;
		dPoly([this.xyP[0], this.xyP[1], this.xyP[2], this.xyP[3]]);
		ctx.fill();
	}

	getCameraDist() {

	}

	giveEnglishConstructor() {
		return ("new Floor()");
	}
}

//custom objects
class Custom extends Main {
	constructor(x, y, z, data) {
		super(x, y, z);
		this.data = data;
		this.faces = [];
		this.nSFaces = [];
		this.avoid = false;

		[this.rx, this.ry, this.rz] = "°°°";
	}

	construct() {
		this.generateNSFaces();
		this.orderFaces();
	}

	generateNSFaces() {
		this.nSFaces = [];
		//search through this object's data
		//first for loop for each face
		for (var a=0;a<this.data.length;a++) {
			//parameters to pass into the face
			var faceColor = "";
			var points2d = [];
			var points3d = [];
			//second for loop for each point in addition to color
			//go until one index left (which is color)
			for (var b=0;b<this.data[a].length-1;b++) {
				var tempo = this.data[a][b];
				points3d.push([tempo[0] + this.x, tempo[1] + this.y, tempo[2] + this.z]);
				points2d.push(spaceToScreen([tempo[0] + this.x, tempo[1] + this.y, tempo[2] + this.z]));
			}

			//building the face based off of the gathered data
			this.nSFaces.push(new ColorableFace(points2d, points3d, this, this.data[a][this.data[a].length-1]));
		}
	}

	orderFaces() {
		//same algorithm as cube, for comments just look in the cube class
		this.faces = [];
		var great = 0;
		var times = this.nSFaces.length;
		for (var a=0;a<times;a++) {
			
			for (var b=0;b<this.nSFaces.length;b++) {
				if (this.nSFaces[b].cDist > great) {
					great = this.nSFaces[b].cDist;
				}
			}

			for (var c=0;c<this.nSFaces.length;c++) {
				if (this.nSFaces[c].cDist == great) {
					this.faces.push(this.nSFaces[c]);
					this.nSFaces.splice(c, 1);
					c = this.nSFaces.length + 1;
				}
			}
			great = 0;
		}
	}

	tick() {
		//collide with player//only tick if the player should be able to collide
		//slightly less precise than regular objects, but that's just a sacrifice I'm willing to make
		for (var h=this.faces.length-1;h>=0;h--) {
				this.faces[h].tick();
		}
	}

	beDrawn() {
		this.construct();
		//drawing each face one by one
		for (var h=0;h<this.faces.length;h++) {
			this.faces[h].beDrawn();
		}
	} 

	giveEnglishConstructor(radians) {
		//outputting english and all the data
		let {x, y, z, data} = this;

		//rotating xz
		[x, z] = rotate(x, z, radians);
		//rotating data

		//stringify and then parse to switch from pointer to new array
		data = JSON.parse(JSON.stringify(data));
		//looping through all the faces
		for (var a=0;a<data.length;a++) {
			//looping through all points
			for (var b=0;b<data[a].length-1;b++) {
				//rotating x and z
				[data[a][b][0], data[a][b][2]] = rotate(data[a][b][0], data[a][b][2], radians);

				//avoid floating point horrors
				[data[a][b][0], data[a][b][2]] = [Math.round(data[a][b][0]), Math.round(data[a][b][2])];
			}
		}
		//stringify to avoid data loss
		data = JSON.stringify(data);
		return `new Custom(${x}, ${y}, ${z}, ${data})`;
	}
}




//2d objects go down here
class Face {
	constructor(points2d, points3d, xCollisionType, doYCollision, zCollisionType, rotable, parent) {
		this.colX = xCollisionType;
		this.colY = doYCollision;
		this.colZ = zCollisionType;
		this.points = points2d;
		this.spacials = points3d;
		this.xyz = avgArray(this.spacials);
		this.rotable = rotable;
		this.cDist = getCameraDist(this.spacials);	
		this.parent = parent;
	}

	tick() {
		//collision with all 5 points of the player
		if (!player.avoid) {
			player.avoid = this.collide(player.drawCoord2);
		}
		if (!player.avoidL) {
			player.avoidL = this.collide(player.drawCoordL);
		}
		if (!player.avoidR) {
			player.avoidR = this.collide(player.drawCoordR);
		}
		if (!player.avoidLL) {
			player.avoidLL = this.collide(player.drawCoordLL);
		}
		if (!player.avoidRR) {
			player.avoidRR = this.collide(player.drawCoordRR);
		}

		//only check the lower point if rotating
		if (loadingMap.rotating) {
			if (!player.avoidD) {
				player.avoidD = this.collide(player.drawCoord);
			}
		}
	}

	collide(point) {
		if (inPoly(point, this.points)) {
			//regular case
			if (!loadingMap.rotating) {
				//determining whether to factor in alpha to collision
				var multiplier = 1;
				if (this.parent.alpha != undefined && !Number.isNaN(this.parent.alpha)) {
					/*using the cubed value because without it the partial solid effect doesn't start until about 0.2 alpha. 
					Cubing (or just raising it to a power) makes it so that the partial solid effect actually takes
					up more of the 0-1 space. */
					multiplier = this.parent.alpha * this.parent.alpha * this.parent.alpha;
				}
				
				//different collision procedures for collision values
				//0 is none, 1 is positive, -1 is negative
				if (this.colX != 0) {
					player.x += this.colX * player.mS * 1.02 * multiplier;
				}

				//special check for y for smoother handling
				if (this.colY) {
					player.y += player.gravity * multiplier;
					if (player.dy * this.colY <= 0) {
						player.dy *= 1 - multiplier;
					}

					//adjusting player y to be closer to face y

					//step 1, get player's z to see their percentage in the face
					var zPercent = (player.z - this.spacials[3][2]) / (this.spacials[0][2] - this.spacials[3][2]);
					//step 2, get player's x to see their x percentage in face
					var xPercent = (player.z - this.spacials[0][0]) / (this.spacials[1][0] - this.spacials[0][0]);
					//step 3, do a 2-axis linear interpolation to see the target height
					var tgtH = linterp(linterp(this.spacials[3][1], this.spacials[0][1], zPercent), linterp(this.spacials[2][1], this.spacials[1][1], zPercent), xPercent);

					//step 4, if their height is lower than that raise their height
					if (player.y < tgtH) {
						player.y += 1 * multiplier;
					} else {
						player.y -= 1 * multiplier;
					}

					//using the z percentage, if the player is about to fall off the front, slow them down
					if (zPercent < 0.05 && player.remote == 0) {
						player.dz = 0;
					}
					//if the player is coming up the back, speed them up
					if (zPercent > 1) {
						player.z += (player.dz / 2) * multiplier;
					}
				}

				//special check for z to avoid collision issues when in front of an object
				if (this.colZ != 0) {
					if (this.xyz[2] <= player.z + 5) {
						player.z += this.colZ * player.mS * 1.02 * multiplier;
						//if the player is out of bounds in z, make them not be
						if (Math.abs(player.z) > mapSize) {
							player.z += player.mS * 1.02 * multiplier;
						}
						//push player slightly away from the object center
						if (player.x < this.xyz[0]) {
							player.x -= player.mS * 1.1 * multiplier;
						} else {
							player.x += player.mS * 1.1 * multiplier;
						}

						//if player is out of bounds in x make them not be
						if (Math.abs(player.x) > mapSize) {
							if (player.x > 0) {
								player.x -= player.mS * 1.02 * multiplier;
							} else {
								player.x += player.mS * 1.02 * multiplier;
							}
						}
					}
				}
				//return true if collide happens
				return true;
				 
			} else if (loadingMap.ableToSwap) {
				//rotation case
				if (!this.rotable && !(this.parent.alpha < 0.2)) {
					loadingMap.aSpeed *= -1;
					loadingMap.ableToSwap = false;
					console.log("swapped rotation direction using face type", this.colX, this.colY, this.colZ, "\n with parent", this.parent.constructor.name);
					return true;
				} else {
					//make all player points non-collidable for intended behavior of rotable objects "shadowing" non-rotable objects.
					player.avoid = true;
					player.avoidR = true;
					player.avoidL = true;
					player.avoidRR = true;
					player.avoidLL = true;
					player.avoidD = true;
					return true;
				}	
			}
		}
		return false;
	}

	beDrawn() {
		//coloring based on rotation ability/alpha ability
		if (this.parent.alpha != undefined && !Number.isNaN(this.parent.alpha)) {
			var temp = ctx.globalAlpha;
			ctx.fillStyle = alphaColor;
			dPoly(this.points);
			ctx.globalAlpha = this.parent.alpha;
			ctx.fill();
			ctx.globalAlpha = temp;

		} else if (this.rotable) {
			ctx.fillStyle = ableColor;
			dPoly(this.points);
			ctx.fill();
		} else {
			ctx.fillStyle = blockColor;
			dPoly(this.points);
			ctx.fill();
		}
		
	}
}

class ColorableFace extends Face {
	constructor(points2d, points3d, parent, color) {
		super(points2d, points3d, 0, 0, -1, false, parent);
		this.color = color;
	}

	beDrawn() {
		ctx.fillStyle = this.color;

		dPoly(this.points);
		ctx.fill();
	}
}