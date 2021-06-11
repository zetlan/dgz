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
		
		if (this.handleSelected != -1) {
			this.handleHandles();
		}
	}

	beDrawn() {

	}

	beDrawn_editor() {
		this.beDrawn();
		this.determineHandlePositions();
		this.beDrawn_handles();
	}

	beDrawn_firstThreeHandles() {
		//editor handle stuff
		var handlePoints = [];
		for (var u=this.handles.length-1; u>=0; u--) {
			handlePoints[u] = [this.x + this.handles[u][0], this.y + this.handles[u][1], this.z + this.handles[u][2]];
		}

		//RGB color coding, for gamers
		drawCrosshair([this.x, this.y, this.z], this.handles[0], this.handles[1], this.handles[2]);
		//any handles beyond the first 3 get drawn with a pink line
		if (this.handles.length > 3) {
			ctx.strokeStyle = "#F0F";
			for (var g=3; g<this.handles.length; g++) {
				drawWorldLine([this.x, this.y, this.z], handlePoints[g]);
			}
		}
		return handlePoints;
	}

	beDrawn_handles() {
		var handlePoints = this.beDrawn_firstThreeHandles();

		//actual handle circles
		var pos;
		for (var g=0; g<handlePoints.length; g++) {
			if (!isClipped(handlePoints[g])) {
				pos = spaceToScreen(handlePoints[g]);
				if (this.handleSelected == g) {
					drawCircle(color_selection, pos[0], pos[1], editor_tolerance / 2);
				} else {
					drawCircle(color_editor_handles, pos[0], pos[1], editor_tolerance / 2);
				}
			}
		}
	}

	determineHandlePositions() {
		//if relative to the world, use x y z. If not, use self's normals
		if (editor_worldRelative) {
			this.handles[0] = [render_crosshairSize, 0, 0];
			this.handles[1] = [0, render_crosshairSize, 0];
			this.handles[2] = [0, 0, render_crosshairSize];
		} else {
			this.handles[0] = polToCart(this.normal[0] + (Math.PI / 2), 0, render_crosshairSize);
			this.handles[1] = polToCart(this.normal[0], this.normal[1] + (Math.PI / 2), render_crosshairSize);
			this.handles[2] = polToCart(this.normal[0], this.normal[1], render_crosshairSize);
		}
	}

	handleClick() {
		//become selected
		var reqDist = editor_tolerance;
		//loop through handles, select the closest one
		for (var a=0; a<this.handles.length; a++) {
			var point = [this.x + this.handles[a][0], this.y + this.handles[a][1], this.z + this.handles[a][2]];
			if (!isClipped(point)) {
				var coords = spaceToScreen(point);
				var xDist = cursor_x - coords[0];
				var yDist = cursor_y - coords[1];
				var trueDist = Math.sqrt(xDist * xDist + yDist * yDist);
				if (trueDist < reqDist) {
					reqDist = trueDist;
					this.handleSelected = a;
				}
			}
		}
	}

	handleHandles() {
		if (this.handleSelected < 3) {
			this.updatePosWithCursor(this.handles[this.handleSelected]);
		}
		if (!cursor_down) {
			this.handleSelected = -1;
		}
	}

	move(changeXBy, changeYBy, changeZBy) {
		this.x += changeXBy;
		this.y += changeYBy;
		this.z += changeZBy;
		this.construct();
		loading_world.generateBinTree();
	}

	updatePosWithCursor(offset) {
		var oldPos = [this.x, this.y, this.z];
		var screenOffset = spaceToScreen([this.x + offset[0], this.y + offset[1], this.z + offset[2]]); 
		var center = spaceToScreen([this.x, this.y, this.z]);

		//get vector to the offset of the crosshair 
		var xDist = center[0] - screenOffset[0];
		var yDist = center[1] - screenOffset[1];
		var distance = Math.sqrt(xDist * xDist + yDist * yDist);
		//realDistance is the distance the cursor is along the original offset (the ray that's selected) divided by the distance the regular ray takes up
		var realDistance = rotate(cursor_x - screenOffset[0], -1 * (cursor_y - screenOffset[1]), -1 * (Math.atan2(screenOffset[0] - center[0], screenOffset[1] - center[1]) - (Math.PI * 0.5)))[0] / distance;

		//now that the offset is obtained, we can calculate where to move based on i
		var changePos = [offset[0] * realDistance, offset[1] * realDistance, offset[2] * realDistance];
		if (controls_shiftPressed) {
			changePos[0] = snapTo(changePos[0], editor_snapAmount);
			changePos[1] = snapTo(changePos[1], editor_snapAmount);
			changePos[2] = snapTo(changePos[2], editor_snapAmount);
		}

		//if position has changed, update self
		if (changePos[0] || changePos[1] || changePos[2]) {
			this.move(changePos[0], changePos[1], changePos[2]);
		}
	}

	updateLengthWithCursor(offset, propertySTRING) {
		//this is a copy + modify from posWithCursor, see that for comments
		var oldVal = eval(propertySTRING);
		var screenOffset = spaceToScreen([this.x + offset[0], this.y + offset[1], this.z + offset[2]]); 
		var center = spaceToScreen([this.x, this.y, this.z]);
		var xDist = center[0] - screenOffset[0];
		var yDist = center[1] - screenOffset[1];
		var distance = Math.sqrt(xDist * xDist + yDist * yDist);
		var rayLength = rotate(cursor_x - screenOffset[0], -1 * (cursor_y - screenOffset[1]), -1 * (Math.atan2(screenOffset[0] - center[0], screenOffset[1] - center[1]) - (Math.PI * 0.5)))[0];

		var realDistance = rayLength / distance;
		eval(`${propertySTRING} += ${realDistance};`);
		if (controls_shiftPressed) {
			eval(`${propertySTRING} = snapTo(${propertySTRING}, editor_snapAmount);`);
		}
		if (oldVal != eval(propertySTRING)) {
			this.construct();
			//binary tree doesn't need updating because updating a size can't change the planes
		}
	}

	updateAngleWithCursor(offset, propertySTRING) {

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
		if (editor_active) {
			if ((this.parent || this) == editor_selected) {
				ctx.strokeStyle = color_selection;
				ctx.stroke();
			}
		}

		if (editor_active && !isClipped([[this.x, this.y, this.z]])) {
			//draw self's normal as well
			var off = polToCart(this.normal[0], this.normal[1], render_normalLength);
			ctx.beginPath();
			ctx.strokeStyle = color_selection;
			drawWorldLine([this.x, this.y, this.z], [off[0] + this.x, off[1] + this.y, off[2] + this.z]);
			ctx.stroke();
		}
	}

	beDrawn_firstThreeHandles() {
		//editor handle stuff
		var handlePoints = [];
		for (var u=this.handles.length-1; u>=3; u--) {
			handlePoints[u] = [this.x + this.handles[u][0], this.y + this.handles[u][1], this.z + this.handles[u][2]];
		}
		if (this.pointSelected == -1) {
			for (var u=2; u>=0; u--) {
				handlePoints[u] = [this.x + this.handles[u][0], this.y + this.handles[u][1], this.z + this.handles[u][2]];
			}
		} else {
			var pRef = this.points[this.pointSelected];
			for (var u=2; u>=0; u--) {
				handlePoints[u] = [pRef[0] + this.handles[u][0], pRef[1] + this.handles[u][1], pRef[2] + this.handles[u][2]];
			}
		}

		//RGB color coding, for gamers
		if (this.pointSelected == -1) {
			drawCrosshair([this.x, this.y, this.z], this.handles[0], this.handles[1], this.handles[2]);
		} else {
			drawCrosshair(this.points[this.pointSelected], this.handles[0], this.handles[1], this.handles[2]);
		}
		return handlePoints;
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
		//getting self's xyz
		[this.x, this.y, this.z] = avgArray(this.points);

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
		this.determineHandlePositions();
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

	determineHandlePositions() {
		this.handles = [];
		super.determineHandlePositions();
		
		//add a handle for each point and each in-between point
		for (var p=0; p<this.points.length; p++) {
			this.handles[2 * p + 3] = [this.points[p][0] - this.x, this.points[p][1] - this.y, this.points[p][2] - this.z];
			this.handles[2 * p + 4] = [(this.points[p][0] + this.points[(p+1)%this.points.length][0]) / 2 - this.x, (this.points[p][1] + this.points[(p+1)%this.points.length][1]) / 2 - this.y, (this.points[p][2] + this.points[(p+1)%this.points.length][2]) / 2 - this.z];
		}
		this.handles[(2 * this.points.length) + 3] = [0, 0, 0];
	}

	handleClick() {
		//I could probably organize this better but I'm lazy
		var reqDist = editor_tolerance;
		var point;
		for (var a=0; a<this.handles.length; a++) {
			if (a < 3 && this.pointSelected != -1) {
				var ref = this.points[this.pointSelected];
				point = [ref[0] + this.handles[a][0], ref[1] + this.handles[a][1], ref[2] + this.handles[a][2]];
			} else {
				point = [this.x + this.handles[a][0], this.y + this.handles[a][1], this.z + this.handles[a][2]];
			}
			if (!isClipped(point)) {
				var coords = spaceToScreen(point);
				var xDist = cursor_x - coords[0];
				var yDist = cursor_y - coords[1];
				var trueDist = Math.sqrt(xDist * xDist + yDist * yDist);
				if (trueDist < reqDist) {
					reqDist = trueDist;
					this.handleSelected = a;
				}
			}
		}
	}

	handleHandles() {
		if (this.pointSelected == -1) {
			super.handleHandles();
			return;
		}
		if (this.handleSelected < 3) {
			this.updatePointWithCursor(this.handles[this.handleSelected]);
		}
		if (!cursor_down) {
			this.handleSelected = -1;
		}
	}

	move(changeXBy, changeYBy, changeZBy) {
		//update all points
		this.points.forEach(p => {
			p[0] += changeXBy;
			p[1] += changeYBy;
			p[2] += changeZBy;
		});
		super.move(changeXBy, changeYBy, changeZBy);
	}

	tick() {
		if (this.handleSelected != -1) {
			this.handleHandles();
			if (this.handleSelected > 2) {
				this.pointSelected = (this.handleSelected - 3) / 2;
				this.handleSelected = -1;

				//if past all points, return to the center
				if (this.pointSelected >= this.points.length) {
					this.pointSelected = -1;
				}
				//if in between points, create a new point
				if (this.pointSelected % 1 != 0) {
					var pOff = [Math.floor(this.pointSelected), Math.ceil(this.pointSelected) % this.points.length];
					var pRef = this.points;
					pRef.splice(pOff[0]+1, 0, [(pRef[pOff[0]][0] + pRef[pOff[1]][0]) / 2, (pRef[pOff[0]][1] + pRef[pOff[1]][1]) / 2, (pRef[pOff[0]][2] + pRef[pOff[1]][2]) / 2]);

					this.pointSelected = pOff[0] + 1;
				}
			}
			if (this.pointSelected != -1) {
				this.determineHandlePositions();
			}
		}
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