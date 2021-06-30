

//main polygon class
class FreePoly extends EditableWorldObject {
	constructor(points, color) {
		super(undefined, undefined, undefined);
		this.faces = undefined;
		this.pointSelected = -1;
		this.color = color;

		//collision tolerance
		this.tolerance = player.fallMax * 1.5;
		this.collisionPoints;
		this.points = points;

		this.collisionPoints;
		this.construct();
	}

	beDrawn() {
		drawWorldPoly(this.points, this.color);

		if (editor_active && !isClipped([[this.x, this.y, this.z]])) {
			//draw self's normal as well
			var off = polToCart(this.normal[0], this.normal[1], render_normalLength);
			ctx.strokeStyle = color_selection;
			drawWorldLine([this.x, this.y, this.z], [off[0] + this.x, off[1] + this.y, off[2] + this.z]);
			ctx.stroke();
		}
	}

	calculateCollision() {
		this.collisionPoints = [];
		//looping through all points
		for (var u=0;u<this.points.length;u++) {
			//transform point to self's normal
			var transformed = spaceToRelative(this.points[u], [this.x, this.y, this.z], this.normal);

			//zs are going to be zero, so they can be ignored
			this.collisionPoints.push([transformed[0], transformed[1]]);
		}
	}

	calculateNormal() {
		//get xyz
		var mins = [1e9, 1e9, 1e9];
		var maxs = [-1e9, -1e9, -1e9];
		this.points.forEach(p => {
			mins[0] = Math.min(p[0], mins[0]);
			mins[1] = Math.min(p[1], mins[1]);
			mins[2] = Math.min(p[2], mins[2]);

			maxs[0] = Math.max(p[0], maxs[0]);
			maxs[1] = Math.max(p[1], maxs[1]);
			maxs[2] = Math.max(p[2], maxs[2]);
		});

		this.x = (mins[0] + maxs[0]) / 2;
		this.y = (mins[1] + maxs[1]) / 2;
		this.z = (mins[2] + maxs[2]) / 2;
		

		//calculate normal
		//every shape has to have at least 3 points, so points 2+3 are compared to 1
		var v1 = [this.points[1][0] - this.points[0][0], this.points[1][1] - this.points[0][1], this.points[1][2] - this.points[0][2]];
		var v2 = [this.points[2][0] - this.points[0][0], this.points[2][1] - this.points[0][1], this.points[2][2] - this.points[0][2]];
		var cross = cartToPol((v1[1] * v2[2]) - (v1[2] * v2[1]), (v1[2] * v2[0]) - (v1[0] * v2[2]), (v1[0] * v2[1]) - (v1[1] * v2[0]));
		this.normal = [cross[0], cross[1]];
		if (this.normal[1] < 0) {
			this.normal[0] = (this.normal[0] + Math.PI) % (Math.PI * 2);
			this.normal[1] *= -1;
		}
	}

	collideWithPlayer() {
		//transform player to self's coordinates
		var pFeetCoords = spaceToRelative([player.x, player.y, player.z], [this.x, this.y + player.height, this.z], this.normal);

		//if the player is too close, take them seriously
		if (Math.abs(pFeetCoords[2]) < this.tolerance) {
			if (inPoly([pFeetCoords[0], pFeetCoords[1]], this.collisionPoints)) {
				//different behavior depending on side
				if (pFeetCoords[2] < 0) {
					pFeetCoords[2] = -1 * this.tolerance;
				} else {
					pFeetCoords[2] = this.tolerance;
				}

				//if self counts as a floor / ceiling tile, work on player's y velocity
				if (Math.abs(this.normal[1]) > Math.PI / 4) {
					//reduce player's y acceleration 
					if (player.dy < 0) {
						player.dy = -0.01;
						player.onGround = true;
					}
				}
			} else if (pFeetCoords[2] < -4 || this.normal[1] < 1) {
				//if self is at player's feet or self is considered a wall tile
				if (inPoly([pFeetCoords[0] - (player.fallMax * 1.5 * boolToSigned(pFeetCoords[0] > 0)), pFeetCoords[1] - (player.fallMax * 1.5 * boolToSigned(pFeetCoords[1] > 0))], this.collisionPoints)) {
					//detect if the player is slightly outside, and in that case, prevent them from entering
					var playerRelDir = spaceToRelative([
						player.dz * Math.sin(player.theta) + player.dx * Math.sin(player.theta + (Math.PI/2)), 
						player.dy,
						player.dz * Math.cos(player.theta) + player.dx * Math.cos(player.theta + (Math.PI/2))
					], [0, 0, 0], this.normal);
					pFeetCoords[0] += playerRelDir[0] * 0.999 * boolToSigned(pFeetCoords[0] > 0) * (pFeetCoords[0] * playerRelDir[0] < 0);
					pFeetCoords[1] += playerRelDir[1] * 0.999 * boolToSigned(pFeetCoords[1] > 0) * (pFeetCoords[1] * playerRelDir[1] < 0);
				}
			}

			//transforming back to regular coordinates
			pFeetCoords = relativeToSpace(pFeetCoords, [this.x, this.y + player.height, this.z], this.normal);

			//getting difference between actual player coordinates and attempted coords for forces
			pFeetCoords = [pFeetCoords[0] - player.x, pFeetCoords[1] - player.y, pFeetCoords[2] - player.z];
			player.posBuffer.push(pFeetCoords);
		}
	}

	construct() {
		this.calculateNormal();
		this.calculateCollision();
	}

	//clips self and returns an array with two polygons, clipped at the input plane.
	//always returns [polygon inside plane, polgyon outside plane]
	//if self polygon does not intersect the plane, then one of the two return values will be undefined.
	clipAtPlane(planePoint, planeNormal) {
		//getting points aligned to the plane
		var tempPoints = [];
		for (var j=0;j<this.points.length;j++) {
			tempPoints.push(spaceToRelative(this.points[j], planePoint, planeNormal));
		}

		//checking to see if clipping is necessary
		var clip = false;
		for (var y=1;y<tempPoints.length;y++) {
			//if the signs of the points match, don't clip them. However, if any polarity of a point is different from the first one, clip the polygon
			if (tempPoints[0][2] > 0 != tempPoints[y][2] > 0) {
				clip = true;
				y = tempPoints.length;
			}
		}
		if (!clip) {
			//if clipping is not necessary, then just return self
			if (tempPoints[0][2] > 0) {
				return [this, undefined];
			} else {
				return [undefined, this];
			}
		}

		//clipping case
		var inPart = undefined;
		var outPart = undefined;

		//get copy of self
		var outPoints = [];
		for (var a=tempPoints.length-1; a>-1; a--) {
			outPoints[a] = tempPoints[a];
		}
		var pushParent = this.parent || this;

		//clip
		tempPoints = clipToZ0(tempPoints, 0, false);
		trimPoints(tempPoints);

		if (tempPoints.length > 2) {
			//transforming points to world coordinates
			for (var q=0;q<tempPoints.length;q++) {
				tempPoints[q] = relativeToSpace(tempPoints[q], planePoint, planeNormal);
			}

			//turning point array into objects that can be put into nodes
			inPart = new FreePoly(tempPoints, this.color);
			inPart.parent = pushParent;
		}

		outPoints = clipToZ0(outPoints, 0, true);
		trimPoints(outPoints);
		if (outPoints.length > 2) {
			for (var q=0;q<outPoints.length;q++) {
				outPoints[q] = relativeToSpace(outPoints[q], planePoint, planeNormal);
			}
			outPart = new FreePoly(outPoints, this.color);
			outPart.parent = pushParent;
		}

		return [inPart, outPart];
	}

	move(changeXBy, changeYBy, changeZBy) {
		//update all points
		this.points.forEach(p => {
			p[0] += changeXBy;
			p[1] += changeYBy;
			p[2] += changeZBy;

			//snap points if it's that time
			if (controls_shiftPressed) {
				p[0] = snapTo(p[0], editor_snapAmount);
				p[1] = snapTo(p[1], editor_snapAmount);
				p[2] = snapTo(p[2], editor_snapAmount);
			}
		});
		super.move(changeXBy, changeYBy, changeZBy);
	}

	tick() {
		if (noclip_active) {
			return;
		}
		//collide correctly with player
		this.collideWithPlayer();
	}

	updatePointWithCursor(offset) {
		var ref = this.points[this.pointSelected];
		var oldPos = [ref[0], ref[1], ref[2]];
		var screenOffset = spaceToScreen([ref[0] + offset[0], ref[1] + offset[1], ref[2] + offset[2]]); 
		var center = spaceToScreen(ref);
		var xDist = center[0] - screenOffset[0];
		var yDist = center[1] - screenOffset[1];
		var distance = Math.sqrt(xDist * xDist + yDist * yDist);
		var realDistance = rotate(cursor_x - screenOffset[0], -1 * (cursor_y - screenOffset[1]), -1 * (Math.atan2(screenOffset[0] - center[0], screenOffset[1] - center[1]) - (Math.PI * 0.5)))[0] / distance;

		ref[0] += offset[0] * realDistance;
		ref[1] += offset[1] * realDistance;
		ref[2] += offset[2] * realDistance;

		if (controls_shiftPressed) {
			ref[0] = snapTo(ref[0], editor_snapAmount);
			ref[1] = snapTo(ref[1], editor_snapAmount);
			ref[2] = snapTo(ref[2], editor_snapAmount);
		}
		if (oldPos[0] != ref[0] || oldPos[1] != ref[1] || oldPos[2] != ref[2]) {
			this.construct();
			loading_world.generateBinTree();
		}
	}

	giveStringData() {
		return `FRP~${JSON.stringify(this.points)}~${this.color}`;
	}
}

class Star {
	constructor(x, y, z) {
		this.color = "#AAF";
		this.r = star_size;
		this.drawR;
		
		this.dx = 0;
		this.dy = 0;
		this.dz = 0;

		this.x = x;
		this.y = y;
		this.z = z;
	}

	tick() {
		//getting distance to player
		var dTP = [this.x - player.x, this.y - player.y, this.z - player.z];
		var pyXYDist = Math.sqrt((dTP[0] * dTP[0]) + (dTP[1] * dTP[1]));
		var pyDist = Math.sqrt((pyXYDist * pyXYDist) + (dTP[2] * dTP[2]));

		this.drawR = (this.r / pyDist) * player.scale;
	}

	beDrawn() {
		if (!isClipped([this.x, this.y, this.z])) {
			var drawCoords = spaceToScreen([this.x, this.y, this.z]);
			drawCircle(this.color, drawCoords[0], drawCoords[1], this.drawR);
		}
	}
}





//prefabs here

class WallX extends EditableWorldObject {
	constructor(x, y, z, width, height, color) {
		super(x, y, z);
		this.w = width;
		this.h = height;
		this.color = color;
		this.normal = [Math.PI / 2, 0];
		this.construct();
	}

	construct() {
		this.faces = [
			new FreePoly([
				[this.x, this.y + this.h, this.z + this.w],
				[this.x, this.y + this.h, this.z - this.w],
				[this.x, this.y - this.h, this.z - this.w],
				[this.x, this.y - this.h, this.z + this.w]
			], this.color)
		];
		this.faces.forEach(f => {
			f.parent = this;
		});
	}

	giveStringData() {
		return `WLX~${this.x}~${this.y}~${this.z}~${this.w}~${this.h}~${this.color}`;
	}
}

class WallY extends EditableWorldObject {
	constructor(x, y, z, length, width, color) {
		super(x, y, z);
		this.l = length;
		this.w = width;
		this.color = color;
		this.normal = [0, Math.PI / 2];
		this.construct();
	}

	construct() {
		this.faces = [
			new FreePoly([
				[this.x + this.l, this.y, this.z + this.w],
				[this.x + this.l, this.y, this.z - this.w],
				[this.x - this.l, this.y, this.z - this.w],
				[this.x - this.l, this.y, this.z + this.w]
			], this.color)
		];
		this.faces.forEach(f => {
			f.parent = this;
		});
	}

	giveStringData() {
		return `WLY~${this.x}~${this.y}~${this.z}~${this.l}~${this.w}~${this.color}`;
	}
}

class WallZ extends EditableWorldObject {
	constructor(x, y, z, width, height, color) {
		super(x, y, z);
		this.w = width;
		this.h = height;
		this.color = color;
		this.construct();
		this.normal = [0, 0];
	}

	construct() {
		this.faces = [
			new FreePoly([
				[this.x + this.w, this.y + this.h, this.z],
				[this.x - this.w, this.y + this.h, this.z],
				[this.x - this.w, this.y - this.h, this.z],
				[this.x + this.w, this.y - this.h, this.z]
			], this.color)
		];
		this.faces.forEach(f => {
			f.parent = this;
		});
	}

	giveStringData() {
		return `WLZ~${this.x}~${this.y}~${this.z}~${this.w}~${this.h}~${this.color}`;
	}
}

class Box extends EditableWorldObject {
	constructor(x, y, z, length, width, height, color) {
		super(x, y, z);
		this.l = length;
		this.w = width;
		this.h = height;
		this.color = color;
		this.normal = [0, 0];
		this.construct();
	}

	construct() {
		var vn = [
			[this.x - this.l, this.y + this.h, this.z - this.w],
			[this.x + this.l, this.y + this.h, this.z - this.w],
			[this.x + this.l, this.y + this.h, this.z + this.w],
			[this.x - this.l, this.y + this.h, this.z + this.w],

			[this.x - this.l, this.y - this.h, this.z - this.w],
			[this.x + this.l, this.y - this.h, this.z - this.w],
			[this.x + this.l, this.y - this.h, this.z + this.w],
			[this.x - this.l, this.y - this.h, this.z + this.w],
		]

		this.faces = [
			new FreePoly([vn[0], vn[1], vn[2], vn[3]], this.color),
			new FreePoly([vn[7], vn[6], vn[5], vn[4]], this.color),
			new FreePoly([vn[0], vn[3], vn[7], vn[4]], this.color),
			new FreePoly([vn[1], vn[5], vn[6], vn[2]], this.color),
			new FreePoly([vn[0], vn[4], vn[5], vn[1]], this.color),
			new FreePoly([vn[3], vn[2], vn[6], vn[7]], this.color),
		]
		this.faces.forEach(f => {
			f.parent = this;
		});
	}

	giveStringData() {
		return `BOX~${this.x}~${this.y}~${this.z}~${this.l}~${this.w}~${this.h}~${this.color}`;
	}
}

class Portal extends EditableWorldObject {
	constructor(x, y, z, footprint, height, worldID) {

	}
}