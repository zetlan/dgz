

/*boat
*/
class Boat {
	constructor(x, y, z, theta, phi) {
		this.x = x;
		this.y = y;
		this.z = z;

		this.houseState = undefined;

		this.theta = theta;
		this.phi = phi;
		this.tileSize = getObjectFromID("Level X").tileSize;
		this.color = getObjectFromID("Level X").color;
		this.tapeColor = RGBtoHSV(color_tape);
		this.power = 1;
		this.cameraDist = 1000;
		this.playerDist = 1000;

		this.tapeHeight = 0.1;

		this.generate();
	}

	addToTwoArrs(arr1, arr2, object) {
		arr1.push(object);
		arr2.push(object);
	}

	addToArrAndTree(array, tree, object) {
		array.push(object);
		if (object.x == undefined) {
			object.calculateNormal();
		}
		tree.addObj(object);
	}

	beDrawn() {
		//different ordering based on where the camera is
		var selfCameraPos = spaceToRelativeRotless([world_camera.x, world_camera.y, world_camera.z], [this.x, this.y, this.z], [this.theta, this.phi]);

		/*if camera is on top, it goes low -> floor -> top. If camera is below it goes top -> floor -> low. 
		To save space, the code block looks like low -> floor -> top -> floor -> low, but if statements make sure only one of the two configurations will happen
		*/

		/*X is positive towards the front of the boat, 
		Y is positive to the right of the boat,
		Z is positive at the top of the boat */

		if (selfCameraPos[2] > this.tileSize / -2) {
			//low deco, then floor, then top
			this.lowDeco.forEach(o => {o.beDrawn();});
			this.body.forEach(o => {o.beDrawn();});
			this.top.beDrawn();
		} else {
			this.top.beDrawn();
			this.body.forEach(o => {o.beDrawn();});
			this.lowDeco.forEach(o => {o.beDrawn();});
		}

		if (editor_active) {
			var offP = polToCart(this.theta, this.phi, 10);
			var offT = polToCart(this.theta, 0, 10);
			ctx.strokeStyle = color_editor_normal;
			ctx.lineWidth = 2;
			drawWorldLine([this.x, this.y, this.z], [this.x + offP[0], this.y + offP[1], this.z + offP[2]]);
			drawWorldLine([this.x, this.y, this.z], [this.x + offT[0], this.y + offT[1], this.z + offT[2]]);
		}
	}

	doComplexLighting() {
		this.objects.forEach(o => {
			o.doComplexLighting();
		});
	}

	generate() {
		//establish positions, LEFT = negative x, RIGHT = positive x
		var pos_lowTiles = [
			[-0.5, -0.5, -1],
			[0.5, -0.5, -1],
			[-0.5, -0.5, 0],
			[0.5, -0.5, 0],
			[-0.5, -0.5, 1],
			[0.5, -0.5, 1],
		];
		var pos_rings = [
			[0, -0.5 - (1 / this.tileSize), -0.5],
			[0, -0.5 - (1 / this.tileSize), 0.5],

			[-1 + (1 / this.tileSize), 0, -1],
			[-1 + (1 / this.tileSize), 0, 0],
			[1 - (1 / this.tileSize), 0, -1],
			[1 - (1 / this.tileSize), 0, 0],

		]
		var pos_mains = [
			[-1, 0, -1],
			[-1, 0, 0],
			[1, 0, -1],
			[1, 0, 0],
		]
		//starring: completely giving up on euler angles and just letting the algorithm figure this one out
		//TODO: refactor this, it can take way fewer lines, for example generateTape() could generate the whole polygon
		var pos_fronts = [
			[[Math.sqrt(2) / -2, 0.5, Math.sqrt(2)], 
			[-1, 0.5, 0.5],
			[-1, -0.5, 0.5],
			[Math.sqrt(2) / -2, -0.5, Math.sqrt(2)]],

			[[0, 0.5, 2.168],
			[Math.sqrt(2) / -2, 0.5, Math.sqrt(2)],
			[Math.sqrt(2) / -2, -0.5, Math.sqrt(2)],
			[0, -0.5, 2.168]],

			[[Math.sqrt(2) / 2, 0.5, Math.sqrt(2)], 
			[1, 0.5, 0.5],
			[1, -0.5, 0.5],
			[Math.sqrt(2) / 2, -0.5, Math.sqrt(2)]],

			[[0, 0.5, 2.168],
			[Math.sqrt(2) / 2, 0.5, Math.sqrt(2)],
			[Math.sqrt(2) / 2, -0.5, Math.sqrt(2)],
			[0, -0.5, 2.168]],
		]

		var pos_contoursL = [
			[-1, -1.5],
			[-1, -0.5],
			[-1, 0.5],
			[pos_fronts[0][0][0], pos_fronts[0][0][2]],
			[pos_fronts[1][0][0], pos_fronts[1][0][2]]
		]
		var pos_contoursR = [
			[1, -1.5],
			[1, -0.5],
			[1, 0.5],
			[pos_fronts[2][0][0], pos_fronts[2][0][2]],
			[pos_fronts[3][0][0], pos_fronts[3][0][2]]
		]
		var pos_inTapesL = [];
		var pos_inTapesR = [];
		var pos_outTapesL = [];
		var pos_outTapesR = [];

		this.generateTape(0.5, 1.5, 0.7, pos_contoursL, pos_inTapesL);
		this.generateTape(1.8, 3.2, 0.3, pos_contoursL, pos_inTapesL);

		this.generateTape(0, 1.1, 0.8, pos_contoursR, pos_inTapesR);
		this.generateTape(1.7, 3.1, 0.2, pos_contoursR, pos_inTapesR);
		
		this.generateTape(0.4, 1.4, 0.3, pos_contoursL, pos_outTapesL);
		this.generateTape(0.9, 2.2, 0.7, pos_contoursL, pos_outTapesL);
		this.generateTape(2.4, 3.6, 0.4, pos_contoursL, pos_outTapesL);
		this.generateTape(3.3, 3.999, 0.2, pos_contoursL, pos_outTapesL);
		this.generateTape(3.8, 3.999, 0.85, pos_contoursL, pos_outTapesL);

		this.generateTape(0, 0.3, 0.8, pos_contoursR, pos_outTapesR);
		this.generateTape(0, 0.8, 0.4, pos_contoursR, pos_outTapesR);
		this.generateTape(0.7, 2, 0.25, pos_contoursR, pos_outTapesR);
		this.generateTape(1.5, 3.7, 0.7, pos_contoursR, pos_outTapesR);
		this.generateTape(3.5, 3.999, 0.85, pos_contoursR, pos_outTapesR);
		this.generateTape(3.2, 3.999, 0.2, pos_contoursR, pos_outTapesR);

		pos_lowTiles.forEach(p => {
			this.transformPointSpecial(p, [this.x, this.y, this.z], this.theta + (Math.PI / 2), this.phi, this.tileSize);
		});

		pos_rings.forEach(p => {
			this.transformPointSpecial(p, [this.x, this.y, this.z], this.theta + (Math.PI / 2), this.phi, this.tileSize);
		});

		pos_mains.forEach(p => {
			this.transformPointSpecial(p, [this.x, this.y, this.z], this.theta + (Math.PI / 2), this.phi, this.tileSize);
		});
		pos_fronts.forEach(p => {
			p.forEach(q => {
				this.transformPointSpecial(q, [this.x, this.y, this.z], this.theta + (Math.PI / 2), this.phi, this.tileSize);
			});
		});
		pos_inTapesL.forEach(p => {
			p.forEach(q => {
				this.transformPointSpecial(q, [this.x, this.y, this.z], this.theta + (Math.PI / 2), this.phi, this.tileSize * 0.99);
			});
		});
		pos_inTapesR.forEach(p => {
			p.forEach(q => {
				this.transformPointSpecial(q, [this.x, this.y, this.z], this.theta + (Math.PI / 2), this.phi, this.tileSize * 0.99);
			});
		});
		pos_outTapesL.forEach(p => {
			p.forEach(q => {
				this.transformPointSpecial(q, [this.x, this.y, this.z], this.theta + (Math.PI / 2), this.phi, this.tileSize * 1.01);
			});
		});
		pos_outTapesR.forEach(p => {
			p.forEach(q => {
				this.transformPointSpecial(q, [this.x, this.y, this.z], this.theta + (Math.PI / 2), this.phi, this.tileSize * 1.01);
			});
		});

		//actually construct the thing
		this.body = [];
		this.lowDeco = [];
		this.objects = [];
		this.top = new B3Node();

		//body
		pos_lowTiles.forEach(p => {
			this.addToTwoArrs(this.objects, this.body, new Tile(p[0], p[1], p[2], this.tileSize, [this.theta, this.phi], this, this.color));
		});

		//lower rings
		this.addToTwoArrs(this.objects, this.lowDeco, new Ring(pos_rings[0][0], pos_rings[0][1], pos_rings[0][2], this.theta, this.phi, render_ringSize));
		this.addToTwoArrs(this.objects, this.lowDeco, new Ring(pos_rings[1][0], pos_rings[1][1], pos_rings[1][2], this.theta, this.phi, render_ringSize));
		
		//left side
		this.addToArrAndTree(this.objects, this.top, new Tile(pos_mains[0][0], pos_mains[0][1], pos_mains[0][2], this.tileSize, [this.theta, this.phi - (Math.PI / 2)], this, this.color));
		this.addToArrAndTree(this.objects, this.top, new Tile(pos_mains[1][0], pos_mains[1][1], pos_mains[1][2], this.tileSize, [this.theta, this.phi - (Math.PI / 2)], this, this.color));
		this.addToArrAndTree(this.objects, this.top, new FreePoly(pos_fronts[0], this.color));
		this.addToArrAndTree(this.objects, this.top, new FreePoly(pos_fronts[1], this.color));


		//right side
		this.addToArrAndTree(this.objects, this.top, new Tile(pos_mains[2][0], pos_mains[2][1], pos_mains[2][2], this.tileSize, [this.theta, this.phi - (Math.PI / 2)], this, this.color));
		this.addToArrAndTree(this.objects, this.top, new Tile(pos_mains[3][0], pos_mains[3][1], pos_mains[3][2], this.tileSize, [this.theta, this.phi - (Math.PI / 2)], this, this.color));
		this.addToArrAndTree(this.objects, this.top, new FreePoly(pos_fronts[2], this.color));
		this.addToArrAndTree(this.objects, this.top, new FreePoly(pos_fronts[3], this.color));
		//left side deco:

		//outside
		pos_outTapesL.forEach(t => {
			this.addToArrAndTree(this.objects, this.top, new FreePoly(t, this.tapeColor));
		});

		//inside
		this.addToArrAndTree(this.objects, this.top, new Ring(pos_rings[2][0], pos_rings[2][1], pos_rings[2][2], this.theta, this.phi - (Math.PI / 2), render_ringSize));
		this.addToArrAndTree(this.objects, this.top, new Ring(pos_rings[3][0], pos_rings[3][1], pos_rings[3][2], this.theta, this.phi - (Math.PI / 2), render_ringSize));
		pos_inTapesL.forEach(t => {
			this.addToArrAndTree(this.objects, this.top, new FreePoly(t, this.tapeColor));
		});

		//right side deco:

		//outside
		pos_outTapesR.forEach(t => {
			this.addToArrAndTree(this.objects, this.top, new FreePoly(t, this.tapeColor));
		});

		//inside
		this.addToArrAndTree(this.objects, this.top, new Ring(pos_rings[4][0], pos_rings[4][1], pos_rings[4][2], this.theta, this.phi - (Math.PI / 2), render_ringSize));
		this.addToArrAndTree(this.objects, this.top, new Ring(pos_rings[5][0], pos_rings[5][1], pos_rings[5][2], this.theta, this.phi - (Math.PI / 2), render_ringSize));
		pos_inTapesR.forEach(t => {
			this.addToArrAndTree(this.objects, this.top, new FreePoly(t, this.tapeColor));
		});
	}

	//transforms a set of points into a tape strip that can go on the edge
	/*EX: tapeParams = [0, 0.7, 2] means a piece of tape that starts at the very back of the boat (0 tiles), at a height of 0.7 (the actual tape will range from 0.75 to 0.65), and 
	then the tape goes for 2 tiles forwards.*/
	generateTape(tapeTileStart, tapeTileEnd, tapeHeight, contour, arrayToPutResultIn) {
		var tapePoints = [];

		//add start point
		var lerpX = linterp(contour[Math.floor(tapeTileStart)][0], contour[Math.ceil(tapeTileStart)][0], tapeTileStart - Math.floor(tapeTileStart));
		var lerpZ = linterp(contour[Math.floor(tapeTileStart)][1], contour[Math.ceil(tapeTileStart)][1], tapeTileStart - Math.floor(tapeTileStart));
		//lower
		tapePoints[3] = [lerpX, tapeHeight - 0.5 - (this.tapeHeight / 2), lerpZ];
		//upper
		tapePoints[0] = [lerpX, tapeHeight - 0.5 + (this.tapeHeight / 2), lerpZ];
		var additive = 1 - (tapeTileStart % 1);

		//add all points before the end
		while (tapeTileStart + additive < tapeTileEnd) {
			lerpX = linterp(contour[Math.floor(tapeTileStart+additive)][0], contour[Math.ceil(tapeTileStart+additive)][0], (tapeTileStart+additive) - Math.floor(tapeTileStart+additive));
			lerpZ = linterp(contour[Math.floor(tapeTileStart+additive)][1], contour[Math.ceil(tapeTileStart+additive)][1], (tapeTileStart+additive) - Math.floor(tapeTileStart+additive));
			//if the tape stretches into the front, (curved space), break it off and recurse
			if (tapeTileStart + additive >= 2) {
				tapePoints[1] = [lerpX, tapeHeight - 0.5 + (this.tapeHeight / 2), lerpZ];
				tapePoints[2] = [lerpX, tapeHeight - 0.5 - (this.tapeHeight / 2), lerpZ];
				arrayToPutResultIn.push(tapePoints);
				this.generateTape(tapeTileStart + additive, tapeTileEnd, tapeHeight, contour, arrayToPutResultIn);
				return;
			}
			additive += 1;
		}

		//still here? cool
		lerpX = linterp(contour[Math.floor(tapeTileEnd)][0], contour[Math.ceil(tapeTileEnd)][0], tapeTileEnd - Math.floor(tapeTileEnd));
		lerpZ = linterp(contour[Math.floor(tapeTileEnd)][1], contour[Math.ceil(tapeTileEnd)][1], tapeTileEnd - Math.floor(tapeTileEnd));
		tapePoints[1] = [lerpX, tapeHeight - 0.5 + (this.tapeHeight / 2), lerpZ];
		tapePoints[2] = [lerpX, tapeHeight - 0.5 - (this.tapeHeight / 2), lerpZ];

		arrayToPutResultIn.push(tapePoints);
	}

	tick() {
		//self
		this.cameraDist = getDistance(this, world_camera);
		this.playerDist = getDistance(this, player);

		//tick all objects
		this.objects.forEach(o => {
			o.tick();
		});

		if (this.cameraDist < render_maxColorDistance * 1.5) {
			//order all objects
			this.lowDeco = orderObjects(this.lowDeco, 4);
		}
	}

	//because the regular transformPoint didn't quite work
	transformPointSpecial(point, addPoint, theta, rot, size) {
		point[0] *= size;
		point[1] *= size;
		point[2] *= size;

		//I have no idea if this is correct but it appears to work
		[point[0], point[1]] = rotate(point[0], point[1], (Math.PI * 2.5) - rot);
		[point[0], point[2]] = rotate(point[0], point[2], (Math.PI * 2) - theta);

		//adjusting for coordinates
		point[0] += addPoint[0];
		point[1] += addPoint[1];
		point[2] += addPoint[2];
	}
}



class CustomCutsceneTrigger {
	constructor() {

	}
}
//one-time class, if I ever add more triggers I'll do more of these
class CutsceneTrigger_NoJumpWithChar extends CustomCutsceneTrigger {
	constructor(tunnel, charactersNameArr, cutscene) {
		super();
		this.parent = tunnel;
		this.charactersArr = charactersNameArr;
		this.cutscene = cutscene;

		this.cameraDist = 1000;

		this.validCondition = true;
	}

	tick() {
		//only work if player isn't backwards and is in the array
		if (!player.backwards && player.parentPrev == this.parent && this.charactersArr.includes(player.constructor.name)) {
			//if the player has passed the finish without failing, they've done it
			if (this.parent.playerTilePos > this.parent.len && this.validCondition) {
				activateCutsceneFromTunnel(1, this.cutscene, 1);
			}
			//reset player if stopped
			if (player.dz == 0 || player.dz - player.az == 0) {
				this.validCondition = true;
			}

			//cause player to fail
			if (player.dy > 0) {
				this.validCondition = false;
			}
		}
	}

	beDrawn() {

	}

	doComplexLighting() {

	}

	getCameraDist() {

	}
}




class FreePoly {
	constructor(points, color) {
		this.x;
		this.y;
		this.z;
		this.points = points;
		this.normal;
		this.size;
		this.color = color;
		this.cameraDist = render_maxColorDistance + 1;
		this.playerDist = render_maxColorDistance + 1;

		//collision tolerance
		this.tolerance = player.r * 0.7;
	}

	calculateNormal() {
		//first get average point, that's self's xyz
		[this.x, this.y, this.z] = avgArray(this.points);
		//determine size based on xyz + points
		this.size = Math.sqrt((this.x - this.points[0][0]) ** 2 + (this.y - this.points[0][1]) ** 2 + (this.z - this.points[0][2]) ** 2);

		//get cross product of first two points, that's the normal
		//every shape has to have at least 3 points, so 
		//comparing points 2 and 3 to point 1 for normal getting
		var v1 = [this.points[1][0] - this.points[0][0], this.points[1][1] - this.points[0][1], this.points[1][2] - this.points[0][2]];
		var v2 = [this.points[2][0] - this.points[0][0], this.points[2][1] - this.points[0][1], this.points[2][2] - this.points[0][2]];
		
		var cross = cartToPol((v1[1] * v2[2]) - (v1[2] * v2[1]), (v1[2] * v2[0]) - (v1[0] * v2[2]), (v1[0] * v2[1]) - (v1[1] * v2[0]));
		this.normal = [cross[0], cross[1]];
	}

	collideWithEntity(entity) {
		//transform player to self's coordinates
		var entityCoords = spaceToRelativeRotless([entity.x, entity.y, entity.z], [this.x, this.y, this.z], this.normal);
		
		//sizeLong can be filled out by child classes for extra control over stretching
		if (this.longMult != undefined) {
			entityCoords[0] /= this.longMult;
		}

		//if the player is colliding, do collision stuffies
		if (Math.abs(entityCoords[2]) < this.tolerance && Math.abs(entityCoords[0]) < (this.size / 2) + this.tolerance && Math.abs(entityCoords[1]) < (this.size / 2) + this.tolerance) {

			//push player outside of self
			entityCoords[2] = this.tolerance * boolToSigned(entityCoords[2] > 0);
			//special collision effects inside the tunnel
			if (entityCoords[2] > 0) {
				this.doCollisionEffects(entity);
			}

			//transforming back to regular coordinates
			if (this.longMult != undefined) {
				entityCoords[0] *= this.longMult;
			}
			[entity.x, entity.y, entity.z] = relativeToSpace(entityCoords, [this.x, this.y, this.z], this.normal);
		}
	}

	doCollisionEffects(entity) {
		//filled out in tile class
	}

	doComplexLighting() {
		this.playerDist = getDistance_LightSource(this);
	}

	doRotationEffects(entity) {
		//filled out in tile class
	}

	//clips self and returns an array with two polygons, clipped at the input plane.
	//always returns [polygon inside plane, polgyon outside plane]
	//if self polygon does not intersect the plane, then one of the two return values will be undefined.
	/*clipAtPlane(planePoint, planeNormal) {
		var inPart = undefined;
		var outPart = undefined;

		//getting points aligned to the plane
		var tempPoints = [];
		for (var j=0;j<this.points.length;j++) {
			tempPoints.push(spaceToRelativeRotless(this.points[j], planePoint, planeNormal));
		}

		//checking to see if clipping is necessary
		var sign = tempPoints[0][2] > 0;
		var clip = false;
		for (var y=1;y<tempPoints.length;y++) {
			//if the signs of the points match, don't clip them. However, if any polarity of a point is different from the first one, clip the polygon
			if (!sign == tempPoints[y][2] > 0) {
				clip = true;
				y = tempPoints.length;
			}
		}
		if (clip) {
			//get copy of self
			var outPoints = [];
			for (var a=0;a<tempPoints.length;a++) {
				outPoints[a] = tempPoints[a];
			}

			//clip
			tempPoints = clipToZ0(tempPoints, 0, false);

			//transforming points to world coordinates
			for (var q=0;q<tempPoints.length;q++) {
				tempPoints[q] = relativeToSpace(tempPoints[q], planePoint, planeNormal);
			}

			outPoints = clipToZ0(outPoints, 0, true);
			for (var q=0;q<outPoints.length;q++) {
				outPoints[q] = relativeToSpace(outPoints[q], planePoint, planeNormal);
			}

			//turning point array into objects that can be put into nodes
			inPart = new FreePoly(tempPoints, this.color);
			inPart.calculateNormal();
			outPart = new FreePoly(outPoints, this.color);
			outPart.calculateNormal();
		} else {
			//if clipping is not necessary, then just return self
			if (tempPoints[0][2] > 0) {
				return [this, undefined];
			}
			return [undefined, this];
		}
		return [inPart, outPart];
	}*/

	tick() {
		this.getCameraDist();
	}

	getCameraDist() {
		this.cameraDist = getDistance(this, world_camera);
		this.playerDist = getDistance(this, player);
	}

	getColor() {
		return `hsl(${this.color.h}, ${this.color.s}%, ${linterp(this.color.v * 67.5, 0, clamp(this.playerDist / render_maxColorDistance, 0.1, 1))}%)`;
	}

	beDrawn() {
		drawWorldPoly(this.points, this.getColor());
		if (editor_active && data_persistent.settings.enableOutlines) {
			ctx.lineWidth = 1;
			ctx.strokeStyle = color_editor_cursor;
			ctx.stroke();

			var offset = polToCart(this.normal[0], this.normal[1], render_crosshairSize);
			drawWorldLine([this.x, this.y, this.z], [this.x + offset[0], this.y + offset[1], this.z + offset[2]]);
		}
	}
}

//cut tiles are expected to retain the color of their parent. They're only used for drawing, not collision.
class FreePoly_Cut extends FreePoly {
	constructor(points, colorString) {
		super(points);
		this.colorStr = colorString;
	}

	collideWithEntity(entity) {
		console.log('why?');
	}

	doCollisionEffects(entity) {
		console.log('do not!');
	}

	doRotationEffects(entity) {
		console.log('stop.');
	}

	getColor() {
		return this.colorStr;
	}
}

class FreePoly_Vertical extends FreePoly {
	constructor(points, color) {
		super(points, color);
		this.calculateNormal();
		this.calculateCollisionPoints();
	}

	calculateCollisionPoints() {
		this.collisionPoints = [];
		this.points.forEach(p => {
			var coordinate = spaceToRelativeRotless(p, [this.x, this.y, this.z], this.normal);
			this.collisionPoints.push([coordinate[0] * 1.05, coordinate[1] * 1.05]);
		});
	}

	collideWithEntity(entity) {
		//vertical freePolys are expected to collide with the player and have irregular shapes. Because of this, 2d polygon checking is useful.
		var entityCoords = spaceToRelativeRotless([entity.x, entity.y, entity.z], [this.x, this.y, this.z], this.normal);

		if (Math.abs(entityCoords[2]) < this.tolerance && inPoly(entityCoords, this.collisionPoints)) {
			if (entityCoords[2] < 0) {
				entityCoords[2] = -1 * this.tolerance;
			} else {
				entityCoords[2] = this.tolerance;
			}
			this.doCollisionEffects(entity);
			[entity.x, entity.y, entity.z] = relativeToSpace(entityCoords, [this.x, this.y, this.z], this.normal);
		}
	}

	doCollisionEffects(entity) {
		entity.dz = 0;
		entity.onIce = false;
	}
}


class FarPoly {
	constructor(points) {
		this.points = points;
	}

	beDrawn() {
		//first get camera coordinate points
		var tempPoints = [];
		tempPoints[this.points.length-1] = undefined;
		for (var p=0; p<this.points.length; p++) {
			tempPoints[p] = spaceToRelative(this.points[p], [world_camera.x, world_camera.y, world_camera.z], [world_camera.theta, world_camera.phi, world_camera.rot]);
		}

		tempPoints = clipToZ0(tempPoints, render_maxColorDistance, false);
		//tempPoints = clipToDistance(tempPoints, render_maxColorDistance);
		
		//turn points into screen coordinates
		var screenPoints = [];
		screenPoints[tempPoints.length-1] = undefined;
		for (var a=0; a<tempPoints.length; a++) {
			screenPoints[a] = cameraToScreen(tempPoints[a]);
		}

		if (screenPoints.length > 2) {
			drawPoly("#000", screenPoints);

			if (editor_active && data_persistent.settings.enableOutlines) {
				ctx.strokeStyle = color_editor_cursor;
				ctx.lineWidth = 1;
				ctx.stroke();
			}
		}
	}
}

class OneTimeCutsceneTrigger {
	constructor(parent, tile, flipCheckDirectionBOOLEAN, cutsceneDataSTRING, immersiveBOOLEAN) {
		this.parent = parent;
		this.x = this.parent.x;
		this.y = this.parent.y;
		this.z = this.parent.z;
		this.tile = tile;
		this.checkPrevious = flipCheckDirectionBOOLEAN;
		this.immersive = immersiveBOOLEAN;
		this.houseState = undefined;

		this.cutscene = cutsceneDataSTRING;
		this.cameraDist = 1000;
	}

	tick() {
		//if self's cutscene has already been activated, delete self
		if (data_persistent.effectiveCutscenes.includes(this.cutscene)) {
			this.parent.freeObjs.splice(this.parent.freeObjs.indexOf(this), 1);
			return;
		}

		//if the player is close enough horizontally and in self's tunnel, go into target cutscene
		if (player.parentPrev != this.parent) {
			return;
		}

		var winCondition = this.parent.playerTilePos > this.tile;
		if (this.checkPrevious) {
			winCondition = !winCondition;
		}

		if (winCondition) {
			//put cutscene in the 'activated cutscenes' array
			data_persistent.effectiveCutscenes.push(this.cutscene);
			//sets the destination state to the current state if it's immersive
			loading_state = new State_Cutscene(eval(`cutsceneData_${this.cutscene}`), this.immersive && loading_state)
		}
	}

	doComplexLighting() {
		
	}

	beDrawn() {
	}
}


class Powercell {
	constructor(x, y, z, parent) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.color = RGBtoHSV(colors_powerCells[Math.floor(randomBounded(0, colors_powerCells.length-1))]);
		this.parent = parent;
		this.points = [];
		this.size = powercells_size;
		this.normal = [randomBounded(0, Math.PI * 2), randomBounded(-0.5 * Math.PI, 0.5 * Math.PI)];
		this.normalSpin = [randomBounded(-powercells_spinSpeed, powercells_spinSpeed), randomBounded(-powercells_spinSpeed, powercells_spinSpeed)];
		this.calculatePoints();


		this.speed = 1.3;
		this.pushForce = polToCart(-1 * this.parent.theta, 0, this.speed);
		this.friction = 0.89;
		
		this.playerDist = 1000;
		this.cameraDist = 1000;

		this.succ = false;
		this.houseState = loading_state;
	}

	calculatePoints() {
		this.points = [[-1, -1, 1], [-1, 1, -1], [1, -1, -1], [1, 1, 1]];
		for (var y=0; y<this.points.length; y++) {
			this.points[y] = transformPoint(this.points[y], [this.x, this.y, this.z], this.normal, this.size);
		}
	}

	changePushForce() {
		//friction
		this.pushForce[0] *= this.friction;
		this.pushForce[1] *= this.friction;
		this.pushForce[2] *= this.friction;

		//player attraction
		if (this.succ) {
			this.pushForce[0] += ((player.x - this.x) / this.playerDist) * 2.3;
			this.pushForce[1] += ((player.y - this.y) / this.playerDist) * 2.3;
			this.pushForce[2] += ((player.z - this.z) / this.playerDist) * 2.3;
			return;
		}

		//correcting for outside of tunnel
		if (!this.parent.coordinateIsInTunnel(this.x, this.y, this.z, false)) {
			var relPos = dirToTunnelCenter(this.parent, this.speed * (1 - this.friction) * -4, this.x, this.y, this.z);
			this.pushForce[0] += relPos[0];
			this.pushForce[1] += relPos[1];
			this.pushForce[2] += relPos[2];
		}

		var target = polToCart(-1 * this.parent.theta, 0, this.speed * (1 - this.friction));
		this.pushForce[0] += target[0];
		this.pushForce[1] += target[1];
		this.pushForce[2] += target[2];
	}

	doComplexLighting() {
		this.playerDist = getDistance_LightSource(this);
	}

	tick() {
		this.playerDist = getDistance(this, player);
		//if player is a duplicator
		if (player.duplicates != undefined) {
			player.duplicates.forEach(d => {
				this.playerDist = Math.min(getDistance(this, d), this.playerDist);
			});
		}
		this.cameraDist = getDistance(this, world_camera);
		this.normal[0] += this.normalSpin[0];
		this.normal[1] += this.normalSpin[1];

		//modifying coordinates
		//avoid all that stuff in a cutscene
		if (loading_state.constructor.name != "State_Cutscene") {
			//only do movement if close enough
			if (this.playerDist < render_maxColorDistance * 1.7) {
				//if close enough to player, be attracted to them
				if (this.playerDist < powercells_acquireDistance) {
					this.succ = true;

					//if extremely close, get smaller and eventually be collected
					if (this.playerDist < powercells_acquireDistance / 3.2) {
						this.size *= 0.96;

						//being collected
						if (this.size < player.r || this.playerDist < player.r * 0.4) {
							if (loading_state.constructor.name == "State_Infinite") {
								loading_state.powercells += 1;
								loading_state.characterData[player.constructor.name].powercells += 1;
							} else {
								data_persistent.powercells += 1;
							}

							//remove self from parent's array
							for (var g=0; g<this.parent.freeObjs.length; g++) {
								if (this.parent.freeObjs[g] == this) {
									this.parent.freeObjs.splice(g, 1);
									g = this.parent.freeObjs.length + 1;
								}
							}

							//remove self from player's grasp
							if (player.attracting == this) {
								player.attracting = undefined;
								player.attractionForce = undefined;
							}
						}
					}
				}
				this.changePushForce();
				
				//moving along tunnel
				this.x += this.pushForce[0];
				this.y += this.pushForce[1];
				this.z += this.pushForce[2];

				//if off the edge of the tunnel, move into next tunnel
				if (spaceToRelativeRotless([this.x, this.y, this.z], this.parent.endPos, [-this.parent.theta, 0])[2] > tunnel_transitionLength) {
					var ref = this.parent;
					this.parent = pickNewParent(this, this.parent);
					if (ref != this.parent) {
						ref.freeObjs.splice(ref.freeObjs.indexOf(this), 1);
						this.parent.freeObjs.push(this);
					}
				}
			}
		}
	}

	getColor() {
		return `hsl(${this.color.h}, ${this.color.s}%, ${linterp(65, 0, clamp((this.playerDist / render_maxColorDistance) - 0.2, 0, 1))}%)`
	}

	beDrawn() {
		//only draw if close enough
		if (this.playerDist < render_maxColorDistance * 1.7) {
			this.calculatePoints();

			ctx.globalAlpha = 0.5;
			var color = this.getColor();
			//actual drawing
			drawWorldPoly([this.points[0], this.points[1], this.points[2]], color);
			drawWorldPoly([this.points[0], this.points[1], this.points[3]], color);
			drawWorldPoly([this.points[1], this.points[2], this.points[3]], color);
			drawWorldPoly([this.points[2], this.points[0], this.points[3]], color);
			ctx.globalAlpha = 1;
		}
	}
}

//box for bridge building
class PushableBox {
	constructor(x, y, z, parent, size, rot) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.cameraDist = 1000;
		this.playerDist = 1000;

		this.homeX = x;
		this.homeY = y;
		this.homeZ = z;

		this.dx = 0;
		this.dy = 0;
		this.dz = 0;

		this.box = new Tile_Box_Ringed(x, y, z, size, [(Math.PI * 2.5) - parent.theta, rot], parent);
		this.houseState = undefined;
	}

	chooseParent() {
		var ref = this.box.parent;
		var tunnelZ = spaceToRelativeRotless([this.x, this.y, this.z], [ref.x, ref.y, ref.z], [-1 * ref.theta, 0])[2]
		if (tunnelZ > (ref.len * ref.tileSize) + tunnel_transitionLength || tunnelZ < 0) {
			this.box.parent = pickNewParent(this.box, this.box.parent);

			ref.freeObjs.splice(ref.freeObjs.indexOf(this), 1);
			this.box.parent.freeObjs.push(this);
			this.box.normal[0] = (Math.PI * 2.5) - this.box.parent.theta;

			//decrease dz based on normal change
			this.dz *= (Math.cos(ref.theta - this.box.parent.theta) + 0.3) / 1.3;
		}
	}
	
	reset() {
		this.dx = 0;
		this.dy = 0;
		this.dz = 0;

		this.x = this.homeX;
		this.y = this.homeY;
		this.z = this.homeZ;

		this.box.x = this.x;
		this.box.y = this.y;
		this.box.z = this.z;

		this.chooseParent();
		this.box.calculatePointsAndNormal();
	}

	tick() {
		this.cameraDist = getDistance(this, world_camera);
		this.playerDist = getDistance(this, player);
		this.box.tick();

		if (this.houseState == undefined) {
			this.houseState = loading_state;
		}

		//collision if close enough
		if (this.playerDist < render_maxColorDistance * 1.5) {
			//move self forwards if being pushed by the player
			if (this.playerDist < this.box.size * 2) {
				//being pushed
				
				/*for the relPos array:
				0 = forwards / back
				1 = side / side 
				2 = up / down
				
				for derivatives:
				dx - up / down
				dy - side / side
				dz - forwards / back*/

				var relPos = spaceToRelativeRotless([player.x, player.y, player.z], [this.x, this.y, this.z], [this.box.normal[0], this.box.normal[1]]);
				//if on the correct side and within range, push box
				if (Math.abs(relPos[0]) < (this.box.size / 2) + player.r && Math.abs(relPos[1]) < (this.box.size / 2) + player.r && Math.abs(relPos[1]) < (this.box.size / 2) + player.r) {
					//pushy stuff for each side
					if (Math.abs(relPos[0]) > (this.box.size - player.r) / 2) {
						this.dz = player.dz * physics_boxMultiplier * boolToSigned(relPos[0] > 0);
						player.dz *= 0.03125;

						//if player's moving away from the box, make the push smaller
						var pZOff = polToCart(player.dir_front[0], player.dir_front[1], player.dz);
						var playerMoved = [player.x + pZOff[0], player.y + pZOff[1], player.z + pZOff[2]];
						if (getDistancePoint([this.x, this.y, this.z], playerMoved) > getDistancePoint([this.x, this.y, this.z], [player.x, player.y, player.z])) {
							this.dz /= 4;
							player.dz *= 8;
						}

						//also cap dz
						this.dz = clamp(this.dz, -1 * 9 * physics_boxMultiplier, 9 * physics_boxMultiplier);
						
					}

					if (Math.abs(relPos[2]) > (this.box.size - player.r) / 2) {
						//different push (large vs small based on how far out player is)
						this.dx = boolToSigned(relPos[2] < 0) * (physics_boxSidePush + (physics_boxSidePush * (Math.abs(relPos[2]) > this.box.size)));
						this.dz *= 0.95 + (0.025 * (Math.abs(relPos[2]) < this.box.size));
					}

					if (Math.abs(relPos[1]) > (this.box.size - player.r) / 2) {
						this.dy = boolToSigned(relPos[1] < 0) * (physics_boxSidePush + (physics_boxSidePush * (Math.abs(relPos[1]) > this.box.size)));
						this.dz *= 0.95 + (0.025 * (Math.abs(relPos[1]) < this.box.size));
					}
					deathCount = 0;
				}
				//regular'ol good'ol box collisin
				this.box.collideWithEntity(player);
			}
		}

		//if outside bounds of the tunnel, don't be
		if (this.dx != 0 || this.dy != 0 || this.dz != 0) {
			this.box.parent.r -= (this.box.size * 0.7);
			if (!this.box.parent.coordinateIsInTunnel(this.x, this.y, this.z, false)) {
				var relPos = spaceToRelativeRotless([this.box.parent.x, this.box.parent.y, this.box.parent.z], [this.x, this.y, this.z], this.box.normal);
				//ignore x, just focus on front/back + up/down
				var magnitude = Math.sqrt((relPos[1] * relPos[1]) + (relPos[2] * relPos[2]));
				relPos[1] = (relPos[1] / magnitude) * 0.5;
				relPos[2] = (relPos[2] / magnitude) * 0.5;

				this.dx += relPos[2];
				this.dy += relPos[1];
			}
			this.box.parent.r += (this.box.size * 0.7);
		}

		//movement
		if (Math.abs(this.dx) < 0.00001) {
			this.dx = 0;
		}

		if (Math.abs(this.dy) < 0.00001) {
			this.dy = 0;
		}

		if (Math.abs(this.dz) < 0.00001) {
			this.dz = 0;
		}
		var worldDX = polToCart(this.box.normal[0], this.box.normal[1], this.dx);
		var worldDY = polToCart(this.box.normal[0], this.box.normal[1] + (Math.PI / 2), this.dy);
		var worldDZ = polToCart(this.box.normal[0] - (Math.PI / 2), 0, this.dz);
		
		this.x += worldDZ[0] + worldDX[0] + worldDY[0];
		this.y += worldDZ[1] + worldDX[1] + worldDY[1];
		this.z += worldDZ[2] + worldDX[2] + worldDY[2];

		this.box.x = this.x;
		this.box.y = this.y;
		this.box.z = this.z;

		//if box is out of the parent tunnel, choose a new tunnel
		this.chooseParent();

		if (this.dx != 0 || this.dy != 0 || this.dz != 0) {
			this.box.calculatePointsAndNormal();
		}

		this.dx *= physics_boxFriction;
		this.dy *= physics_boxFriction;
		this.dz *= physics_boxFriction;
	}

	doComplexLighting() {
		this.playerDist = getDistance_LightSource(this);
	}

	beDrawn() {
		this.box.beDrawn();

		if (editor_active) {
			drawCrosshair([this.x, this.y, this.z], this.box.normal, [this.box.normal[0], this.box.normal[1] + (Math.PI / 2)], [this.box.parent.theta, 0]);
		}
	}
}

class Ring {
	constructor(x, y, z, theta, phi, radius) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.normal = [theta, phi];
		this.r = radius;
		this.width = 2;
		this.resolution = 12;
		this.color = RGBtoHSV(color_ring);

		this.cameraDist = getDistance(this, world_camera);
		this.playerDist = getDistance(this, player);

		this.points = [];
		this.calculatePoints();
	}

	calculatePoints() {
		this.points = [];
		for (var p=0; p<this.resolution; p++) {
			this.points.push([Math.cos((Math.PI * 2 * p) / this.resolution), 0, Math.sin((Math.PI * 2 * p) / this.resolution)]);
		}

		this.points.forEach(p => {
			transformPoint(p, [this.x, this.y, this.z], this.normal, this.r);
		});
		
	}

	doComplexLighting() {
		this.playerDist = getDistance_LightSource(this);
	}

	getColor() {
		return `hsl(${this.color.h}, ${this.color.s}%, ${linterp(70, 0, clamp(this.playerDist / render_maxColorDistance, 0, 1))}%)`
	}

	beDrawn() {
		if (this.cameraDist < render_maxColorDistance || this.playerDist < render_maxColorDistance) {
			ctx.strokeStyle = this.getColor();
			ctx.lineCap = "round";
			ctx.lineWidth = (this.width / this.cameraDist) * world_camera.scale;
			for (var a=0; a<this.points.length;a++) {
				drawWorldLine(this.points[a], this.points[(a + 1) % this.points.length]);
			}
			ctx.lineCap = "butt";
		}
		
	}

	tick() {
		//calculate camera + player dist
		this.cameraDist = getDistance(this, world_camera);
		this.playerDist = getDistance(this, player);
	}
}

class Star {
	constructor(x, y, z) {
		this.color = color_stars;
		this.r = 30;
		this.drawR;
		
		this.dx = 0;
		this.dy = 0;
		this.dz = 0;

		this.x = x;
		this.y = y;
		this.z = z;

		this.drawR = (this.r / getDistance(this, {x:0, y:0, z:0})) * world_camera.scale;
	}

	tick() {
		this.drawR = (this.r / getDistance(this, {x:0, y:0, z:0})) * world_camera.scale;
	}

	beDrawn() {
		//does space to screen, but without being relative to the camera coordinates.
		var [tX, tY, tZ] = multiplyPointByMatrix([this.x, this.y, this.z], world_camera.rotMatrix);

		//if the point isn't going to be clipped, continue
		if (tZ >= render_clipDistance) {
			//accounting for screen coordinates
			var tPos = [(tX / tZ * world_camera.scale) + canvas.width / 2, (tY / tZ * -world_camera.scale) + canvas.height / 2];

			//ignore the wormhole if possible
			if (world_wormhole.ignore) {
				this.beDrawn_normally(tPos[0], tPos[1]);
				return;
			}

			//draw as a regular circle if too far from the wormhole
			var circularDist = getDistance2d(world_wormhole.sPos, tPos);
			if (circularDist > world_wormhole.drawR * world_wormhole.maxRadiusMult) {
				this.beDrawn_normally(tPos[0], tPos[1]);
				return;
			}

			//don't bother if wormhole takes up the whole screen
			if (world_wormhole.engulfsCamera) {
				return;
			}

			//if still here, we have to deal with spacial smearing.

			//use radius to determine amount of smearing
			var smearAmount = world_wormhole.arcAtRadius / ((circularDist / world_wormhole.drawR) ** 4);
			//console.log(circularDist, world_wormhole.drawRX);
			var angle = Math.atan2(world_wormhole.sPos[1] - tPos[1], world_wormhole.sPos[0] - tPos[0]) + Math.PI;

			//don't smear more than a circle's worth
			if (smearAmount > Math.PI) {
				smearAmount = Math.PI;
			}

			//don't have star inside the wormhole
			if (circularDist < world_wormhole.drawR) {
				circularDist = world_wormhole.drawR;
			}
			this.beDrawn_smeared(angle, smearAmount, circularDist);
		}
	}

	beDrawn_normally(screenX, screenY) {
		drawCircle(this.color, screenX, screenY, this.drawR);
	}

	beDrawn_smeared(angle, smearAmount, radius) {
		ctx.beginPath();
		ctx.strokeStyle = this.color;
		ctx.lineWidth = this.drawR * 2;
		ctx.arc(world_wormhole.sPos[0], world_wormhole.sPos[1], radius, angle - smearAmount, angle + smearAmount);
		ctx.stroke();
	}
}

class Star_Special extends Star {
	constructor(x, y, z) {
		super(x, y, z);
		this.color = color_star_special;
		this.r = 8000;
		this.trueX = x;
		this.trueY = y;
		this.trueZ = z;
	}

	beDrawn() {
		//change position to align with camera's
		this.x = this.trueX - world_camera.x;
		this.y = this.trueY - world_camera.y;
		this.z = this.trueZ - world_camera.z;
		this.drawR = (this.r / getDistance(this, {x:0, y:0, z:0})) * world_camera.scale;
		super.beDrawn();
	}

	beDrawn_normally(screenX, screenY) {
		drawCircle(this.color, screenX, screenY, this.drawR);
		drawCircle(this.color, screenX, screenY, this.drawR / 2);
	}

	// beDrawn_smeared(x, y, smearAmount, ellipseX, ellipseY, ellipseAngle) {
	// 	//old code, not finished
	// 	ctx.strokeStyle = this.color;
	// 	ctx.lineWidth = this.drawR * 2;
	// 	ctx.beginPath();
	// 	ctx.arc(world_wormhole.screenPos[0], world_wormhole.screenPos[1], wormDist, angle - smearAmount, angle + smearAmount);
	// 	ctx.stroke();
	// 	ctx.lineWidth = this.drawR;
	// 	ctx.beginPath();
	// 	ctx.arc(world_wormhole.screenPos[0], world_wormhole.screenPos[1], wormDist, angle - smearAmount, angle + smearAmount);
	// 	ctx.stroke();
	// }
}

class Star_Wormhole extends Star {
	constructor(x, y, z) {
		super(x, y, z);
		this.color = color_star_wormhole;
	}

	//like the original star beDrawn, except the smear is opposite, and doesn't draw self if outside the wormhole
	beDrawn() {
		//if wormhole isn't on screen, neither is self
		if (world_wormhole.ignore) {
			return;
		}


		var [tX, tY, tZ] = multiplyPointByMatrix([this.x, this.y, this.z], world_camera.rotMatrix);

		//if the point isn't going to be clipped, continue
		if (tZ >= render_clipDistance) {
			//accounting for screen coordinates
			var tPos = [(tX / tZ * world_camera.scale) + canvas.width / 2, (tY / tZ * -world_camera.scale) + canvas.height / 2];

			
			var circularDist = getDistance2d(world_wormhole.sPos, tPos);
			//wormhole is a mask, if outside don't be drawn
			if (circularDist > world_wormhole.drawR) {
				return;
			}

			if (world_wormhole.engulfsCamera || circularDist < world_wormhole.drawR / 4) {
				this.beDrawn_normally(tPos[0], tPos[1]);
				return;
			}

			//smearing
			var fadeAmount = (circularDist / world_wormhole.drawR) ** 7;
			var smearAmount = world_wormhole.arcAtRadius / ((world_wormhole.drawR / circularDist) ** 4);
			var angle = Math.atan2(world_wormhole.sPos[1] - tPos[1], world_wormhole.sPos[0] - tPos[0]) + Math.PI;

			//don't smear more than a circle's worth
			if (smearAmount > Math.PI) {
				smearAmount = Math.PI;
			}

			ctx.globalAlpha = render_starOpacity * (1 - fadeAmount);
			this.beDrawn_smeared(angle, smearAmount, circularDist);
			ctx.globalAlpha = render_starOpacity;
		}
		// var [tX, tY, tZ] = multiplyPointByMatrix([this.x, this.y, this.z], world_camera.rotMatrix);

		// //if the point isn't going to be clipped, continue
		// if (tZ >= render_clipDistance) {
		// 	tX /= tZ;
		// 	tY /= tZ;
		// 	tX *= world_camera.scale;
		// 	tY *= -1 * world_camera.scale;
		// 	var tPos = [tX + canvas.width / 2, tY + canvas.height / 2];

		// 	//if wormhole won't be visible, self won't be as well
		// 	if (world_wormhole.ignore) {
		// 		return;
		// 	}
			
		// 	var focusDist = getDistance2d(world_wormhole.f1, tPos) + getDistance2d(world_wormhole.f2, tPos);
		// 	//if outside of the wormhole, mask away
		// 	if (focusDist > world_wormhole.drawRTot) {
		// 		return;
		// 	}

		// 	if (world_wormhole.engulfsCamera || focusDist < world_wormhole.drawRTot / world_wormhole.maxRadiusMult) {
		// 		this.beDrawn_normally(tPos[0], tPos[1]);
		// 		return;
		// 	}

		// 	//use radius to determine amount of smearing
		// 	var fadeAmount = (focusDist / world_wormhole.drawRTot) ** 7;
		// 	var smearAmount = world_wormhole.arcAtRadius / ((world_wormhole.drawRTot / focusDist) ** 4);
		// 	var angle = Math.atan2(world_wormhole.sPos[1] - tPos[1], world_wormhole.sPos[0] - tPos[0]) + Math.PI;

		// 	if (smearAmount > Math.PI) {
		// 		smearAmount = Math.PI;
		// 	}

		// 	//don't have star outside the wormhole
		// 	if (focusDist > world_wormhole.drawRTot) {
		// 		focusDist = world_wormhole.drawRTot;
		// 	}
		// 	var multiplier = focusDist / world_wormhole.drawRTot;
		// 	ctx.globalAlpha = render_starOpacity * (1 - fadeAmount);
		// 	this.beDrawn_smeared(angle, smearAmount, world_wormhole.drawRX * multiplier, world_wormhole.drawRY * multiplier);
		// 	ctx.globalAlpha = render_starOpacity;
		// }
	}
}

class Star_Lizard extends Star {
	constructor(x, y, z) {
		super(x, y, z);
		this.r = 1;
		this.drawR;
		this.texture = new Texture(data_sprites.Lizard.sheet, data_sprites.spriteSize, 1e1001, false, false, data_sprites.Lizard.front);
	}

	tick() {
		this.drawR *= 1.01;
		if (this.drawR > canvas.height / 4) {
			runCrash();
		}
	}

	beDrawn_normally(screenX, screenY) {
		this.texture.beDrawn(screenX, screenY, 0, this.drawR);
	}

	beDrawn_smeared(screenX, screenY) {
		this.beDrawn_normally(screenX, screenY);
	}
}


class StaticCharacter {
	constructor(parent, strip, tile, character, cutsceneDataSTRING, immersiveBOOLEAN) {
		this.parent = parent;
		this.x;
		this.y;
		this.z;
		this.tile = tile;
		this.strip = strip;
		this.houseState = {};
		this.immersive = immersiveBOOLEAN;

		this.cutscene = cutsceneDataSTRING;
		this.cameraDist = 1000;
		try {
			this.texture = new Texture(data_sprites[character].sheet, data_sprites.spriteSize, 1e1001, false, false, data_sprites[character].back);
		} catch (error) {
			this.texture = undefined;
		}
		
		this.textureRot = 0;
		this.ch = character;

		this.placeSelf();
	}

	doComplexLighting() {

	}

	activateCutscene() {
		if (this.cutscene == undefined) {
			console.log(`${this.ch} is undefined, quitting`);
			return;
		}

		//make sure house state is defined non-loading state, for permanent static characters
		this.houseState = {};
		this.parent.resetWithoutPlayer();

		//put cutscene in the 'activated cutscenes' array
		if (!data_persistent.effectiveCutscenes.includes(this.cutscene)) {
			data_persistent.effectiveCutscenes.push(this.cutscene);
		}
		//special case for challenge states
		if (loading_state.constructor.name == "State_Challenge" && !this.immersive) {
			eval(loading_state.codeOnExit);
		}
		loading_state = new State_Cutscene(eval(`cutsceneData_${this.cutscene}`), this.immersive && loading_state);
	}

	placeSelf() {
		var targetTile = this.parent.tiles[this.strip][this.tile];
		var offset = polToCart(targetTile.dir_down[0], targetTile.dir_down[1], player_radius);
		this.x = targetTile.x + offset[0];
		this.y = targetTile.y + offset[1];
		this.z = targetTile.z + offset[2];
		this.textureRot = targetTile.normal[1];
	}

	tick() {
		this.cameraDist = getDistance(this, world_camera);
		//if the player is close enough horizontally, go into target cutscene
		if (Math.abs(this.tile - this.parent.playerTilePos) < 3) {
			this.activateCutscene();
		}
	}

	beDrawn() {
		if (this.texture != undefined) {
			if (!isClipped([this.x, this.y, this.z])) {
				//do a fade in
				ctx.globalAlpha = clamp(((render_maxColorDistance * 1.8) - this.cameraDist) / render_maxColorDistance, 0, 1);
	
				var area = spaceToScreen([this.x, this.y, this.z]);
				//flip rotation if camera is ahead
				if (this.parent.playerTilePos > this.tile) {
					this.texture.beDrawn(area[0], area[1], (Math.PI * 2.5) - this.textureRot - world_camera.rot, (player_radius / this.cameraDist) * world_camera.scale * 2);
				} else {
					this.texture.beDrawn(area[0], area[1], this.textureRot - (Math.PI * 0.5) - world_camera.rot, (player_radius / this.cameraDist) * world_camera.scale * 2);
				}
				ctx.globalAlpha = 1;
			}
		}
	}
}

class StaticCharacterPermanent extends StaticCharacter {
	constructor(parent, strip, tile, character, cutsceneDataSTRING) {
		super(parent, strip, tile, character, cutsceneDataSTRING);
		this.houseState = undefined;

		//if self's cutscene has already been activated, don't appear again
		
		if (data_persistent.effectiveCutscenes.includes(cutsceneDataSTRING)) {
			this.houseState = {};
		}
	}
}





//with the merging of the tunnel and tunnel_strip classes, I have realized that this class is probably much too large.
class Tunnel {
	//so much data here, it's a mess, but oh well
	constructor(angle, color, data, id, lengthInTiles, power, triggerFunctions, sides, spawns, endSpawns, tilesPerSide, tileSize, x, z, bannedCharacters, music) {
		this.x = x;
		this.y = 0;
		this.z = z;
		this.r = (tilesPerSide * tileSize) / (2 * Math.sin(Math.PI / sides));
		this.rApothem = (tilesPerSide * tileSize) / (2 * Math.tan(Math.PI / sides));
		this.theta = angle;
		this.phi = 0;

		this.allowBackwards = false;
		this.bannedCharacters = bannedCharacters;
		this.color = color;
		this.cameraDist = 1000;
		this.discovered = false;

		this.executing = -1;
		/*I am aware that by mixing the terminology "function" and "trigger" I am making it not only horribly confusing for myself, but everyone else as well. 
		I know this. And I am not changing it. I've been working on this project for 6 months and I simply do not care enough. Good luck and godspeed. */
		this.functions = triggerFunctions;

		this.id = id;
		this.len = lengthInTiles;
		this.music = music;
		this.playerTilePos = 0;
		this.power = power;
		this.powerBase = power;
		this.powerBaseEnd = power;
		this.powerPrevious = power;
		this.powerTime = 0;

		//determine the end base
		this.functions.forEach(f => {
			//if it's a power function (has a value), append
			if (f[1] > -1) {
				this.powerBaseEnd = f[1];
			}
		});

		this.sides = sides;
		this.data = data;
		this.spawns = spawns;
		this.endSpawns = endSpawns;
		this.hasSetEndSpawns = this.endSpawns.length > 0;

		//containing objects
		this.tiles = [];
		this.realTiles = [];
		this.realTilesSimple = [];
		this.realTilesComplex = [];
		this.freeObjs = [];
		this.farPolys = [];

		this.reverseOrder = false;
		this.simple = true;
		this.tilesPerSide = tilesPerSide;
		this.tileSize = tileSize;

		this.generate();
		//stop rendering individual tiles when they're less than 1 unit per tile
		this.maxTileRenderDist = Math.min(render_maxDistance, (this.tileSize * world_camera.scale) / render_minPolySize);
	}

	beDrawn() {
		//super low detail for far away
		if (this.cameraDist > this.maxTileRenderDist) {
			this.beDrawn_LowDetail();
			return;
		}

		//if the camera direction is closely aligned with the tunnel direction, reverse the order of the tiles for proper layering
		this.reverseOrder = (modularDifference((Math.PI * 2) - world_camera.theta, this.theta, Math.PI * 2) < Math.PI / 2);

		//super high detail for parent
		if (this == player.parentPrev) {
			if (this.simple || !data_persistent.settings.altRender) {
				this.beDrawn_playerParent();
				return;
			}
			this.beDrawn_playerParentAlternate();
			return;
		}

		//corner clip check, various medium levels
		if (spaceToRelativeRotless([this.x, this.y, this.z], [world_camera.x, world_camera.y, world_camera.z], [world_camera.theta, world_camera.phi])[2] + this.r > 0 || 
		spaceToRelativeRotless(this.endPos, [world_camera.x, world_camera.y, world_camera.z], [world_camera.theta, world_camera.phi])[2] + this.r > 0) {
			if (this.cameraDist < render_maxColorDistance + (this.r * 2.5)) {
				this.beDrawn_HighDetail();
				return;
			}
			this.beDrawn_MediumDetail();
		}
	}

	//an attempt to perfectly draw a tunnel, always
	beDrawn_playerParentAlternate() {
		//here's the idea: BSTs can draw space perfectly. What if just create a BST for all the complex parts of the tunnel?
		var insideBST = new B3Node();
		var outFarBST = new B3Node();
		var outNearBST = new B3Node();
		var ctrlStrip;
		var cameraIsIn = this.coordinateIsInTunnel(world_camera.x, world_camera.y, world_camera.z, false);
		var cameraRelPos = spaceToRelativeRotless([world_camera.x, world_camera.y, world_camera.z], this.centerPos, [-this.theta, 0]);
		var cameraAngle = Math.atan2(cameraRelPos[1], cameraRelPos[0]);

		var tunnelSize = this.sides * this.tilesPerSide;
		var tunnelStrip = getClosestObject(this.strips);

		var stripsAreBlocking = this.strips.map(s => (rotate(cameraRelPos[0], cameraRelPos[1], s.normal[1])[0] > this.rApothem));

		//farpolys
		this.farPolys.forEach(f => {
			f.beDrawn();
		});

		//sort objects
		var sortObjs = [player, ...this.freeObjs];
		if (player.duplicates != undefined && player.duplicates.length > 0) {
			sortObjs = [...sortObjs, ...player.duplicates];
		}

		//sort tiles
		if (!this.simple) {
			for (var s=0; s<this.realTilesComplex.length; s++) {
				this.realTilesComplex[s].forEach(r => {
					//only add tiles to the BST if if they're visible and need ordering (visible but far away tiles don't need ordering, because they're dark, I don't care)
					if (r.playerDist < render_maxColorDistance + r.size) {
						//put crumbling tiles outside
						if (r.crumbleSet != undefined) {
							if (stripsAreBlocking[s]) {
								outNearBST.addObj(r);
							} else {
								outFarBST.addObj(r);
							}
							return;
						}

						//warning tiles have two parts
						if (r.verticalObj != undefined) {
							insideBST.addObj(r);
							insideBST.addObj(r.verticalObj);
							return;
						}
						//boxes have up to 6 parts
						if (r.drawPolysIn != undefined) {
							r.drawPolysIn.forEach(q => {
								insideBST.addObj(q);
							});

							if (stripsAreBlocking[s]) {
								r.drawPolysOut.forEach(q => {
									outNearBST.addObj(q);
								});
							} else {
								r.drawPolysOut.forEach(q => {
									outFarBST.addObj(q);
								});
							}
							return;
						}

						//base case
						insideBST.addObj(r);
						return;
					}

					if ((r.size / r.cameraDist) * world_camera.scale > render_minTileSize) {
						//if it's too dark to be lit, just draw it first
						r.beDrawn();
					}
				});
			}
			gloablView = insideBST;
		}
		//if there aren't actually any objects being displayed in any of the trees, replace the tree with a leaf to avoid normal problems
		if (insideBST.objs.length == 0) {
			insideBST = new B3NodeLeaf();
		}
		if (outFarBST.objs.length == 0) {
			outFarBST = new B3NodeLeaf();
		}
		if (outNearBST.objs.length == 0) {
			outNearBST = new B3NodeLeaf();
		}

		//sort free objects
		sortObjs.forEach(o => {
			//if the object is inside, cool! If it's not, sort it into far and near depending on camera location
			if (this.coordinateIsInTunnel(o.x, o.y, o.z, false)) {
				insideBST.addObjShallow(o);
				return;
			}
			if (cameraIsIn) {
				outFarBST.addObjShallow(o);
				return;
			}
			if (modularDifference(Math.atan2(o.y - this.y, rotate(o.x - this.x, o.z - this.z, -this.theta)[0]), cameraAngle, Math.PI * 2) > Math.PI / 2) {
				outFarBST.addObjShallow(o);
			} else {
				outNearBST.addObjShallow(o);
			}
		});

		//outside far, outside near is already lumped in if the camera's inside
		outFarBST.beDrawn();

		//walls far, or just walls in general if the camera is inside
		for (var n=tunnelSize; n>0; n--) {
			ctrlStrip = ((tunnelStrip + (Math.floor(n / 2) * boolToSigned(n % 2 == 1))) + tunnelSize) % tunnelSize;
			if (cameraIsIn || !stripsAreBlocking[ctrlStrip]) {
				this.beDrawn_stripSimp(ctrlStrip);
			}
		}

		//inside of tunnel
		insideBST.beDrawn();

		//near walls for outside camera
		if (!cameraIsIn) {
			for (var n=tunnelSize; n>0; n--) {
				ctrlStrip = ((tunnelStrip + (Math.floor(n / 2) * boolToSigned(n % 2 == 1))) + tunnelSize) % tunnelSize;
				if (stripsAreBlocking[ctrlStrip]) {
					this.beDrawn_stripSimp(ctrlStrip);
				}
			}

			//close outside objects for inside camera 
			outNearBST.beDrawn();
		}

		//debug stuff
		if (editor_active) {
			//numbering strips
			ctx.font = `${canvas.height / 48}px Comfortaa`;
			
			var [tX, tY] = [0, 0];
			for (var v=0; v<this.strips.length; v++) {
				if (!isClipped(this.strips[v].pos)) {
					[tX, tY] = spaceToScreen(this.strips[v].pos);
					ctx.beginPath();
					ctx.fillStyle = stripsAreBlocking[v] ? "#F00" : color_text_bright;
					ctx.fillText(v, tX + 5, tY);
				}
			}
		}
	}

	//a function that perfectly draws a tunnel, as long as it has no crumbling tiles, ramps, or boxes
	beDrawn_playerParent() {
		/*ok here's the idea: if a tunnel is simple, we can approximate it into 5 regions:
			the outside of the tunnel (half away from the camera)
			the outside of the tunnel (half towards the camera)
			the tunnel walls (half away)
			the tunnel walls (half towards)
			the inside of the tunnel

		and as long as those 5 regions are ordered correctly, the entire tunnel will get drawn correctly

		if the camera is inside the tunnel, it just has to go outside -> tunnel walls -> inside.
		If the camera is outside the tunnel, it has to go back to front, so outside away -> walls away -> inside -> walls towards -> outside towards

		the player is included as a free object, because they are free.
		*/
		var regionOutFar = [];
		var regionOutNear = [];
		var regionIn = [];
		var ctrlStrip;
		var cameraIsIn = this.coordinateIsInTunnel(world_camera.x, world_camera.y, world_camera.z, false);
		var cameraRelPos = spaceToRelativeRotless([world_camera.x, world_camera.y, world_camera.z], this.centerPos, [-this.theta, 0]);
		var cameraAngle = Math.atan2(cameraRelPos[1], cameraRelPos[0]);

		var tunnelSize = this.sides * this.tilesPerSide;
		var tunnelStrip = getClosestObject(this.strips);

		//figure out if a strip is blocking (normal is facing away, so will be part of the 'front' of the tunnel)
		var stripsAreBlocking = this.strips.map(s => (rotate(cameraRelPos[0], cameraRelPos[1], s.normal[1])[0] > this.rApothem));

		//draw farpolys first, this isn't in the 5 steps but it's important for optimization
		this.farPolys.forEach(f => {
			f.beDrawn();
		});

		//sort objects
		var sortObjs = [player, ...this.freeObjs];
		if (player.duplicates != undefined && player.duplicates.length > 0) {
			sortObjs = [...sortObjs, ...player.duplicates];
		}

		sortObjs.forEach(o => {
			//if the object is inside, cool! If it's not, sort it into far and near depending on camera location
			if (this.coordinateIsInTunnel(o.x, o.y, o.z, false)) {
				regionIn.push(o);
				return;
			}
			if (cameraIsIn) {
				regionOutFar.push(o);
				return;
			}
			if (modularDifference(Math.atan2(o.y - this.y, rotate(o.x - this.x, o.z - this.z, -this.theta)[0]), cameraAngle, Math.PI * 2) > Math.PI / 2) {
				regionOutFar.push(o);
			} else {
				regionOutNear.push(o);
			}
		});

		regionOutFar = orderObjects(regionOutFar);
		regionOutNear = orderObjects(regionOutNear);
		regionIn = orderObjects(regionIn);
		//outside far
		regionOutFar.forEach(d => {
			d.beDrawn();
		});

		//outside near is lumped in with outside far if the camera is inside

		//walls far, or all walls. Doesn't matter with the inside camera
		for (var n=tunnelSize; n>0; n--) {
			ctrlStrip = ((tunnelStrip + (Math.floor(n / 2) * boolToSigned(n % 2 == 1))) + tunnelSize) % tunnelSize;
			if (cameraIsIn || !stripsAreBlocking[ctrlStrip]) {
				this.beDrawn_strip(ctrlStrip);
			}
		}

		//inside of tunel
		regionIn.forEach(d => {
			d.beDrawn();
		});

		//near walls, then close out objects for outside camera
		if (!cameraIsIn) {
			for (var n=tunnelSize; n>0; n--) {
				ctrlStrip = ((tunnelStrip + (Math.floor(n / 2) * boolToSigned(n % 2 == 1))) + tunnelSize) % tunnelSize;
				if (stripsAreBlocking[ctrlStrip]) {
					this.beDrawn_strip(ctrlStrip);
				}
			}

			regionOutNear.forEach(d => {
				d.beDrawn();
			});
		}

		//debug stuff
		if (editor_active) {
			//numbering strips
			ctx.font = `${canvas.height / 48}px Comfortaa`;
			ctx.fillStyle = color_text_bright;
			var [tX, tY] = [0, 0];
			for (var v=0; v<this.strips.length; v++) {
				if (!isClipped(this.strips[v].pos)) {
					[tX, tY] = spaceToScreen(this.strips[v].pos);
					ctx.beginPath();
					ctx.fillStyle = stripsAreBlocking[v] ? "#0F0" : color_text_bright;
					ctx.fillText(v, tX + 5, tY);
				}
			}
		}
	}

	beDrawn_HighDetail() {
		//copy + modify from playerParent drawing
		this.farPolys.forEach(f => {
			f.beDrawn();
		});

		var tunnelSize = this.strips.length;
		var tunnelStrip = getClosestObject(this.strips);
		var freeObjsInMiddle = !this.coordinateIsInTunnel(world_camera.x, world_camera.y, world_camera.z, false);

		for (var n=tunnelSize; n>tunnelSize / 2; n--) {
			this.beDrawn_strip(((tunnelStrip + (Math.floor(n / 2) * boolToSigned(n % 2 == 1))) + tunnelSize) % tunnelSize);
		}

		if (freeObjsInMiddle) {
			this.freeObjs.forEach(f => {
				f.beDrawn();
			});
		}

		for (var n=Math.floor(tunnelSize / 2); n>0; n--) {
			this.beDrawn_strip(((tunnelStrip + (Math.floor(n / 2) * boolToSigned(n % 2 == 1))) + tunnelSize) % tunnelSize);
		}

		if (!freeObjsInMiddle) {
			this.freeObjs.forEach(f => {
				f.beDrawn();
			});
		}
	}

	beDrawn_MediumDetail() {
		this.farPolys.forEach(f => {
			f.beDrawn();
		});
	}

	beDrawn_LowDetail() {
		ctx.lineWidth = Math.max(1, ((2 * this.r) / this.cameraDist) * world_camera.scale);
		ctx.strokeStyle = "#000";
		drawWorldLine([this.x, this.y, this.z], this.endPos);
		ctx.lineWidth = 2;
	}

	beDrawn_strip(stripNum) {
		if (!this.reverseOrder) {
			this.realTiles[stripNum].forEach(t => {
				if (t.playerDist < render_maxColorDistance + t.size || (t.size / t.cameraDist) * world_camera.scale > render_minTileSize) {
					t.beDrawn();
				}
			});
		} else {
			for (var t=this.realTiles[stripNum].length-1; t>-1; t--) {
				if (this.realTiles[stripNum][t].playerDist < render_maxColorDistance + this.realTiles[stripNum][t].size || 
				(this.realTiles[stripNum][t].size / this.realTiles[stripNum][t].cameraDist) * world_camera.scale > render_minTileSize) {
					this.realTiles[stripNum][t].beDrawn();
				}
			}
		}

		//debug
		if (editor_active) {
			ctx.beginPath();
			var cXYZ = polToCart(...this.strips[stripNum].normal, 10);
			var dXYZ = polToCart(-this.theta, 0, this.tileSize * this.tiles[stripNum].length);

			//spawn
			ctx.lineWidth = 4;
			ctx.strokeStyle = this.spawns.includes(stripNum) ? "#0F0" : "#808";
			drawWorldLine(this.strips[stripNum].pos, [this.strips[stripNum].pos[0] + cXYZ[0], this.strips[stripNum].pos[1] + cXYZ[1], this.strips[stripNum].pos[2] + cXYZ[2]]);

			//end spawn
			ctx.strokeStyle = this.endSpawns.includes(stripNum) ? "#0F0" : "#808";
			drawWorldLine([this.strips[stripNum].pos[0] + dXYZ[0], this.strips[stripNum].pos[1] + dXYZ[1], this.strips[stripNum].pos[2] + dXYZ[2]], 
				[this.strips[stripNum].pos[0] + dXYZ[0] + cXYZ[0], this.strips[stripNum].pos[1] + dXYZ[1] + cXYZ[1], this.strips[stripNum].pos[2] + dXYZ[2] + cXYZ[2]]);
		}
	}

	//like drawing a strip, but only draws the simple tiles
	beDrawn_stripSimp(stripNum) {
		if (this.reverseOrder) {
			for (var t=this.realTilesSimple[stripNum].length-1; t>-1; t--) {
				if (this.realTilesSimple[stripNum][t].playerDist < render_maxColorDistance + this.realTilesSimple[stripNum][t].size || 
				(this.realTilesSimple[stripNum][t].size / this.realTilesSimple[stripNum][t].cameraDist) * world_camera.scale > render_minTileSize) {
					this.realTilesSimple[stripNum][t].beDrawn();
				}
			}
		} else {
			this.realTilesSimple[stripNum].forEach(t => {
				if (t.playerDist < render_maxColorDistance + t.size || (t.size / t.cameraDist) * world_camera.scale > render_minTileSize) {
					t.beDrawn();
				}
			});
		}

		

		//debug
		if (editor_active) {
			ctx.beginPath();
			var cXYZ = polToCart(...this.strips[stripNum].normal, 10);
			var dXYZ = polToCart(-this.theta, 0, this.tileSize * this.tiles[stripNum].length);

			//spawn
			ctx.lineWidth = 4;
			ctx.strokeStyle = this.spawns.includes(stripNum) ? "#0F0" : "#808";
			drawWorldLine(this.strips[stripNum].pos, [this.strips[stripNum].pos[0] + cXYZ[0], this.strips[stripNum].pos[1] + cXYZ[1], this.strips[stripNum].pos[2] + cXYZ[2]]);

			//end spawn
			ctx.strokeStyle = this.endSpawns.includes(stripNum) ? "#0F0" : "#808";
			drawWorldLine([this.strips[stripNum].pos[0] + dXYZ[0], this.strips[stripNum].pos[1] + dXYZ[1], this.strips[stripNum].pos[2] + dXYZ[2]], 
				[this.strips[stripNum].pos[0] + dXYZ[0] + cXYZ[0], this.strips[stripNum].pos[1] + dXYZ[1] + cXYZ[1], this.strips[stripNum].pos[2] + dXYZ[2] + cXYZ[2]]);
		}
	}

	beDrawn_map(drawPoint) {
		this.map_startCoords = spaceToScreen([this.x, this.y, this.z]);
		this.map_endCoords = spaceToScreen([this.endPos[0] - (tunnel_transitionLength * Math.sin(this.theta)), this.endPos[1], this.endPos[2] + (tunnel_transitionLength * Math.cos(this.theta))]);

		if (drawPoint) {
			this.map_circleCoords = spaceToScreen([this.centerPos[0], this.centerPos[1], this.centerPos[2]]);
			drawCircle(color_map_writing, this.map_circleCoords[0], this.map_circleCoords[1], canvas.height / 320);
		}

		ctx.beginPath();
		//adjust line thickness if in edit mode
		if (editor_active) {
			//different function for map, since the target position will always be at the top
			this.cameraDist = Math.min(getDistance(this, world_camera,
							getDistance({x:this.centerPos[0], y:this.centerPos[1], z:this.centerPos[2]}, world_camera),
							getDistance({x:this.endPos[0], y:this.endPos[1], z:this.endPos[2]}, world_camera)));
			ctx.lineWidth = ((this.r * 2) / this.cameraDist) * world_camera.scale;
		}
		ctx.moveTo(this.map_startCoords[0], this.map_startCoords[1]);
		ctx.lineTo(this.map_endCoords[0], this.map_endCoords[1]);
		ctx.stroke();
	}

	beDrawn_mapSelected() {
		//drawing theta circle + knob
		ctx.beginPath();
		ctx.strokeStyle = color_editor_cursor;
		ctx.ellipse(this.map_startCoords[0], this.map_startCoords[1], editor_thetaCircleRadius, editor_thetaCircleRadius, 0, 0, Math.PI * 2);
		ctx.stroke();
		drawCircle(color_editor_cursor, this.map_startCoords[0] + (editor_thetaCircleRadius * Math.cos(this.theta)), this.map_startCoords[1] - (editor_thetaCircleRadius * Math.sin(this.theta)), editor_thetaKnobRadius);
	}

	calculatePoints() {
		this.centerPos = [0, 0, (this.len / 2) * this.tileSize];
		[this.centerPos[0], this.centerPos[2]] = rotate(this.centerPos[0], this.centerPos[2], this.theta);
		this.centerPos = [this.centerPos[0] + this.x, this.centerPos[1] + this.y, this.centerPos[2] + this.z];

		//generating end
		this.endPos = [0, 0, this.len * this.tileSize];
		[this.endPos[0], this.endPos[2]] = rotate(this.endPos[0], this.endPos[2], this.theta);
		this.endPos = [this.endPos[0] + this.x, this.endPos[1] + this.y, this.endPos[2] + this.z];
	}

	calculateBackwardsAllow() {
		this.allowBackwards = false;
		
		if (!editor_objects.includes(this)) {
			var prefix = this.id.replaceAll(/[0-9]/g, '');
			var num = this.id.replaceAll(/[A-z]/g, '').replaceAll(',', '').replaceAll('-', '') * 1;
			var sequel = getObjectFromID(prefix+(num+1));
			this.allowBackwards = (sequel.id == undefined || sequel.discovered);
		} else {
			//if in the editor world, always allow backwards
			this.allowBackwards = true;
		}
	}

	calculateBoundsPoly() {
		this.boundsPoly = [];
		for (var a=0; a<this.sides; a++) {
			this.boundsPoly.push([this.r * Math.cos(((Math.PI * 2) / this.sides) * (a - 0.5)), this.r * Math.sin(((Math.PI * 2) / this.sides) * (a - 0.5))]);
		}
	}

	coordinateIsInTunnel(x, y, z, boundedBOOLEAN) {
		//rotate by tunnel theta
		[x, z] = rotate(x - this.x, z - this.z, -this.theta);

		if (boundedBOOLEAN && (z < 0 || z > (this.len * this.tileSize))) {
			//if the coordinate is out of the tunnel in the z direction
			return false;
		}

		//checking with a 2d poly is faster than checking with the 3d strips
		return inPoly([x, y - this.y], this.boundsPoly);
	}

	determinePlexiStrength(s, t) {
		var tileOffset = Math.min(Math.floor(physics_maxBridgeDistance / this.tileSize), Math.floor(this.sides * this.tilesPerSide * 0.5));
		var n = 2;
		while (n / 2 <= tileOffset + 1) {
			//do the ring
			for (var v=0; v<n*2; v++) {
				//determine tile positions from v, uses triangle wave, spooky stuff
				var x = Math.round((Math.abs(((v / n + 1) % 2) - 1) - 0.5) * n);
				var y = Math.round((Math.abs(((v / n + 1.5) % 2) - 1) - 0.5) * n);
				var safeX = modulate(x + s, this.sides * this.tilesPerSide);

				//don't be supported by tiles that don't exist, some number fixing has to be done
				if (this.data[safeX][y + t] != undefined && this.data[safeX][y + t] > 0) {
					//calculate strength and return, spiral pattern means this must be the closest tile
					return Math.pow(1 - (((Math.abs(x) + Math.abs(y)) * this.tileSize) / physics_maxBridgeDistance), 2);
				}
			}

			//increase ring size
			n += 2;
		}
		return 0;
	}

	doComplexLighting() {
		//loop through all tiles
		this.realTiles.forEach(s => {
			s.forEach(t => {
				t.doComplexLighting();
			});
		});
		this.freeObjs.forEach(o => {
			try {
				o.doComplexLighting();
			} catch (er) {
				console.error(`ERROR: could not run complex lighting on object ${o.constructor.name} in tunnel ${this.id}`);
			}
		});
	}

	//from tiles, figure out which ones are the real tiles that apply
	establishReals() {
		this.realTiles = [];
		this.realTilesComplex = [];
		this.realTilesSimple = [];

		for (var s=0; s<this.tiles.length; s++) {
			this.realTiles[s] = [];
			this.realTilesComplex[s] = [];
			this.realTilesSimple[s] = [];

			for (var t=0; t<this.tiles[s].length; t++) {
				if (this.tiles[s][t] != undefined) {
					//if the tile isn't a plexiglass tile (or it is a plexiglass tile and the player's a pastafarian)
					if ((this.tiles[s][t].minStrength == undefined || player.personalBridgeStrength != undefined)) {
						this.realTiles[s].push(this.tiles[s][t]);

						//crumbling, ramp, vertical, or box check
						if (isComplex(this.tiles[s][t])) {
							//special case for boxes, they take priority so they go at the start
							if (this.tiles[s][t].polys != undefined) {
								this.realTilesComplex[s].splice(0, 0, this.tiles[s][t]);
							} else {
								this.realTilesComplex[s].push(this.tiles[s][t]);
							}
						} else {
							this.realTilesSimple[s].push(this.tiles[s][t]);
						}
					}
				}
			}
		}
	}

	establishCrumbleSets() {
		for (var s=0; s<this.realTilesComplex.length; s++) {
			for (var t=0; t<this.realTilesComplex[s].length; t++) {
				//is it a crumbling tile that hasn't been sorted yet?
				if (this.realTilesComplex[s][t].crumbleSet == -1) {
					//sort it!

					//first make sure crumble sets exist
					if (this.crumbleSets == undefined) {
						this.crumbleSets = [];
					}

					//create a bin and add all crumblies in the set to it
					this.crumbleSets.push([]);

					//find index for addition
					var index = this.tiles[s].indexOf(this.realTilesComplex[s][t]);
					this.establishCrumbleSets_recursive(this.crumbleSets.length - 1, s, index);
				}
			}
		}
	}

	establishCrumbleSets_recursive(set, strip, tile) {
		this.tiles[strip][tile].crumbleSet = set;
		this.crumbleSets[set].push(this.tiles[strip][tile]);

		//recurse to neighboring tiles if they're valid, based, and poggers, uwu
		for (var pos of [[0, -1], [0, 1], [-1, -1], [-1, 0], [-1, 1], [1, 1], [1, 0], [1, -1]]) {
			//make sure to adjust the positions to be referencing the correct location
			pos[0] = (pos[0] + strip + this.tiles.length) % this.tiles.length;
			pos[1] = pos[1] + tile;

			if (this.tiles[pos[0]][pos[1]] != undefined && this.tiles[pos[0]][pos[1]].crumbleSet == -1) {
				this.establishCrumbleSets_recursive(set, pos[0], pos[1]);
			}
		}
	}

	//hopefully self-explanatory
	generate() {
		this.maxTileRenderDist = Math.min(render_maxDistance, (this.tileSize * world_camera.scale) / render_minPolySize);
		this.generateTiles();
		this.generatePlexies();
		this.generateFarPolys();
		this.calculateBoundsPoly();
		this.calculatePoints();
	}

	//this function is a mess. It should probably be rewritten from scratch.
	generateFarPolys() {
		this.farPolys = [];
		var actualPolyPoints = [];
		//this is so the first strip has something to look at
		this.farPolys[-1] = [];

		//strip by strip
		var realStrip;
		var fullStrip;
		for (var s=0; s<this.realTiles.length; s++) {
			realStrip = this.realTiles[s];
			fullStrip = this.tiles[s];

			//create bin for farPolys
			this.farPolys.push([]);
			//if there are no tiles in the strip, don't do anything further for this strip
			if (realStrip[0] != undefined) {
				

				var lastBin = this.farPolys[this.farPolys.length-2];
				var lastBinIndex = 0;
				
				var bin = this.farPolys[this.farPolys.length-1];
				var lastIndex = fullStrip.indexOf(realStrip[0]);
				
				var polyRegister = [];
				var minMax = [];

				//merge controls
				var possibleMerge = (lastBin.length > 0) && ((this.farPolys.length - 1) % this.tilesPerSide != 0);
				var merged = false;

				//start behavior
				if (realStrip[0].constructor.name != "Tile_Plexiglass") {
					polyRegister.push(realStrip[0].points[0]);
					polyRegister.push(realStrip[0].points[1]);
					minMax[0] = lastIndex;
				}

				for (var t=1; t<realStrip.length; t++) {
					//skip over plexiglass tiles
					if (realStrip[t].constructor.name != "Tile_Plexiglass") {
						var index = fullStrip.indexOf(realStrip[t]);

						//if there's a greater than 1 gap, end + start another polygon
						if (index - lastIndex > 1) {
							polyRegister.push(fullStrip[lastIndex].points[2]);
							polyRegister.push(fullStrip[lastIndex].points[3]);
							minMax[1] = lastIndex;
							
							//object contains the actual points, the min/max tile range of the strip, and the quarter point (spot to add other polys after)
							bin.push({
								points: polyRegister,
								minMax: minMax,
								quarterPoint: polyRegister[3],
							});
							//do merge behavior
							if (possibleMerge) {
								merged = false;
								var newPoly = bin[bin.length-1];
								var oldPoly = lastBin[lastBinIndex];
								var doneEarly = false;
								//loop until has a polygon that matches up
								while (oldPoly != undefined && oldPoly.minMax[0] <= newPoly.minMax[1] && !doneEarly) {
									//if the polygon's max is greater / equal to old's min, it can be merged
									if (oldPoly.minMax[1] >= newPoly.minMax[0]) {
										merged = true;
										//special case for if the mins / maxes are the same, otherwise simply add after quarter point
										var quarterIndex = oldPoly.points.indexOf(oldPoly.quarterPoint) + 1;
										//if the mins are the same, merge the lower points
										if (oldPoly.minMax[0] == newPoly.minMax[0]) {
											oldPoly.points.splice(quarterIndex, 1);
										} else {
											oldPoly.points.splice(quarterIndex, 0, newPoly.points[1]);
										}
										oldPoly.points.splice(quarterIndex, 0, newPoly.points[0]);
										oldPoly.points.splice(quarterIndex, 0, newPoly.points[3]);
										if (oldPoly.minMax[1] == newPoly.minMax[1]) {
											oldPoly.points.splice(quarterIndex-1, 1);
										} else {
											oldPoly.points.splice(quarterIndex, 0, newPoly.points[2]);
										}

										//fill next object's row with the same
										newPoly.points = oldPoly.points;
										doneEarly = true;
									} else {
										//increment last polygon
										lastBinIndex += 1;
										oldPoly = lastBin[lastBinIndex];
									}
									
								}
							}

							//if merged, don't add new array of points as it's already in there
							if (!merged) {
								actualPolyPoints.push(polyRegister);
							}
							polyRegister = [];
							minMax = [];

							polyRegister.push(realStrip[t].points[0]);
							polyRegister.push(realStrip[t].points[1]);
							minMax[0] = index;
						}
						lastIndex = index;
					}
				}

				//if a poly is partially finished, finish it
				if (polyRegister.length > 0) {
					var lastValidObj = undefined;
					var i = fullStrip.indexOf(realStrip[realStrip.length-1]);
					while (lastValidObj == undefined && i > -1) {
						if (fullStrip[i] != undefined && fullStrip[i].constructor.name != "Tile_Plexiglass") {
							lastValidObj = fullStrip[i];
						} else {
							i -= 1;
						}
					}
					if (i == -1) {
						console.log("log", fullStrip.indexOf(realStrip[realStrip.length-1]), fullStrip);
					}
					polyRegister.push(lastValidObj.points[2]);
					polyRegister.push(lastValidObj.points[3]);
					minMax[1] = i;
					
					bin.push({
						points: polyRegister,
						minMax: minMax,
						quarterPoint: polyRegister[3],
					});

					//more merge behavior
					if (possibleMerge) {
						merged = false;
						var newPoly = bin[bin.length-1];
						var oldPoly = lastBin[lastBinIndex];
						var doneEarly = false;
						while (oldPoly != undefined && oldPoly.minMax[0] <= newPoly.minMax[1] && !doneEarly) {
							if (oldPoly.minMax[1] >= newPoly.minMax[0]) {
								merged = true;
								var quarterIndex = oldPoly.points.indexOf(oldPoly.quarterPoint) + 1;
								if (oldPoly.minMax[0] == newPoly.minMax[0]) {
									oldPoly.points.splice(quarterIndex, 1);
								} else {
									oldPoly.points.splice(quarterIndex, 0, newPoly.points[1]);
								}
								oldPoly.points.splice(quarterIndex, 0, newPoly.points[0]);
								oldPoly.points.splice(quarterIndex, 0, newPoly.points[3]);
								if (oldPoly.minMax[1] == newPoly.minMax[1]) {
									oldPoly.points.splice(quarterIndex-1, 1);
								} else {
									oldPoly.points.splice(quarterIndex, 0, newPoly.points[2]);
								}
								newPoly.points = oldPoly.points;
								doneEarly = true;
							} else {
								lastBinIndex += 1;
								oldPoly = lastBin[lastBinIndex];
							}
						}
					}
					if (!merged) {
						actualPolyPoints.push(polyRegister);
					}
				}
			}
		}

		//dereference the complex objects, then all that's left is the set of points from before. Turn those into FarPolys.
		this.farPolys = [];
		actualPolyPoints.forEach(p => {
			this.farPolys.push(new FarPoly(p));
		});
	}

	//I apologize in advance for any headaches this function causes.
	generateTiles() {
		this.simple = true;
		this.strips = [];
		this.tiles = [];
		//split array into strips, with each strip being its own data structure
		for (var t=0; t<this.sides*this.tilesPerSide; t++) {
			this.strips[t] = {
				normal: [(Math.PI * 1.5) - this.theta, ((((Math.PI * 2) / this.sides) * Math.floor(t / this.tilesPerSide) * -1) + (Math.PI * 2)) % (Math.PI * 2)],
				pos: this.worldPositionOfTile(t, 0),
			}
			this.tiles[t] = [];

			//run through every tile in the strip
			for (var a=0; a<this.len; a++) {
				//creating tile
				var value = this.data[t][a];
				if (value == undefined) {
					value = 0;
				}

				//simpleton check
				if (this.simple) {
					if (value == 3 || (value >= 9 && value <= 13)) {
						this.simple = false;
					}
				}

				//if at the end and is a tile, add to end spawns
				if (!this.hasSetEndSpawns && a >= this.len - 2 && value > 0) {
					if (!this.endSpawns.includes(t)) {
						this.endSpawns.push(t);
					}
				}
				var tileCoordinates = this.worldPositionOfTile(t, a+1);
				this.tiles[t][a] = this.generateTile(value, tileCoordinates[0], tileCoordinates[1], tileCoordinates[2], this.tileSize, this.strips[t].normal, this.color, t, a);
			}
		}
		// if (this.endSpawns.length == 0) {
		// 	console.log(`oh no! No end spawns for tunnel id~${this.id}`);
		// }
		// if (this.spawns.length == 0) {
		// 	console.log(`oh no! No spawns for tunnel id~${this.id}`);
		// }
		this.establishReals();
		if (!this.simple) {
			this.establishCrumbleSets();
		}
	}

	//generates the plexiglass tiles, to go along the edges of the regular tiles
	generatePlexies() {
		//run through every tile
		for (var s=0; s<this.tiles.length; s++) {
			for (var t=0; t<this.tiles[s].length; t++) {
				//if it's undefined the plexiglass algorithm can be run
				if (this.tiles[s][t] == undefined) {
					//determining strength
					var tileStrength;
					tileStrength = this.determinePlexiStrength(s, t);
					//only create tile if strength is great enough
					if (tileStrength > 0.01) {
						var tileCoords = this.worldPositionOfTile(s, t+1);
						this.tiles[s][t] = new Tile_Plexiglass(tileCoords[0], tileCoords[1], tileCoords[2], this.tileSize, this.strips[s].normal, this, this.color, tileStrength);
					}
				}
			}
		}
	}

	//generates a single tile from parameters
	generateTile(type, x, y, z, size, normal, color, strip, tile) {
		var objType = tunnel_tileObjectAssociation[type];
		if (objType == undefined) {
			return undefined;
		}
		
		//crumbling tiles have special infrastructure so they collapse at the same time
		if (objType == Tile_Crumbling) {
			this.crumbleSets = this.crumbleSets ?? [];
		}
		return new objType(x, y, z, size, normal, this, color, -1);
	}

	getCameraDist() {
		var relPos = spaceToRelativeRotless([world_camera.x, world_camera.y, world_camera.z], [this.x, this.y, this.z], [-1 * this.theta, 0]);
		if (relPos[2] > 0) {
			relPos[2] = Math.max(relPos[2] - (this.tileSize * this.len), 0);
		}
		this.cameraDist = Math.sqrt((relPos[0] * relPos[0]) + (relPos[1] * relPos[1]) + (relPos[2] * relPos[2]));
	}
	
	giveStringData() {
		var output = ``;
		//simple non-tile position features
		output += `id~${this.id}`;
		output += `|pos-x~${Math.round(this.x)}`;
		output += `|pos-z~${Math.round(this.z)}`;
		output += `|direction~${this.theta.toFixed(data_precision)}`;
		output += `|tube~${this.sides}~${this.tilesPerSide}`;
		output += `|color~${HSVtoRGB(this.color)}`;
		if (this.spawns.length > 0) {
			output += `|spawn`;
			this.spawns.forEach(s => {
				output += `~${s}`;
			});
		}
		if (this.endSpawns.length > 0) {
			output += `|endSpawn`;
			this.endSpawns.forEach(s => {
				output += `~${s}`;
			});
		}
		//70 is default
		if (this.tileSize != 70) {
			output += `|tileWidth~${this.tileSize}`;
		}

		//tile data
		this.repairData();
		output += tunnelData_parseDataReverse(this.data);

		//power + functions
		if (this.powerBase != 1) {
			output += `|power~${this.power.toFixed(data_precision)}`;
		}
		this.functions.forEach(f => {
			output += `|trigger~${f[0]}~${f[1]}~${f[2]}`;
		});
		output += `|music~${this.music}`;
		//banned characters
		var reverseBanned = flipObject(this.bannedCharacters);
		Object.keys(reverseBanned).forEach(r => {
			output += `|charRestriction~${r}`;
			reverseBanned[r].forEach(c => {
				output += "~" + c;
			});
		});

		return output;
	}

	placePlayer() {
		var spawnObj;
		var spawnChoice;
		if (player.backwards) {
			//choosing randomly from spawns 
			spawnChoice = this.endSpawns[Math.floor(randomBounded(0, this.endSpawns.length-1))];
			//place player
			spawnObj = this.realTiles[spawnChoice][this.realTiles[spawnChoice].length - 1];
		} else {
			spawnChoice = this.spawns[Math.floor(randomBounded(0, this.spawns.length-1))];
			spawnObj = this.realTiles[spawnChoice][0];
		}
		
		spawnObj.doRotationEffects(player);

		var offsetCoords = polToCart(spawnObj.normal[0], spawnObj.normal[1], 10);
		player.x = spawnObj.x + offsetCoords[0];
		player.y = spawnObj.y + offsetCoords[1];
		player.z = spawnObj.z + offsetCoords[2];
		player.dz = 0;
		this.playerTilePos = rotate(player.x - this.x, player.z - this.z, -this.theta)[1] / this.tileSize;

		//character specfic stuff
		//duplicator
		if (player.duplicates != undefined) {
			player.duplicates = [];
			player.duplicateGenerationCountup = 0;
			return;
		} 
		
		//pastafarian
		if (player.personalBridgeStrength != undefined) {
			player.personalBridgeStrength = 1;
			return;
		}
	}

	placePowercells() {
		//placing power cells
		var truePowercells = powercells_perTunnel;
		if (player.constructor.name == "Gentleman") {
			truePowercells = Math.round(truePowercells * powercells_gentlemanMultiplier);
		}
		for (var a=0; a<truePowercells; a++) {
			var rotation = randomBounded(0, Math.PI * 2);

			//get offset
			var offset = polToCart(Math.PI / 2, rotation, this.rApothem * randomBounded(0.3, 0.9));
			offset[2] = ((a + 0.5) / truePowercells) * this.len * this.tileSize;

			//rotate offset for true position
			[offset[0], offset[2]] = rotate(offset[0], offset[2], this.theta);
			
			this.freeObjs.push(new Powercell(this.x + offset[0], this.y + offset[1], this.z + offset[2], this));
		}
	}

	//returns true if the player is inside the tunnel bounds; this is what's used to check for killing the player 
	playerIsInBounds() {
		var newCoords = [player.x - this.x, player.y - this.y, player.z - this.z];
		//rotating by tunnel theta
		[newCoords[0], newCoords[2]] = rotate(newCoords[0], newCoords[2], -this.theta);

		//determining whether the player is in self's bounds using transformed coordinates
		if (getDistance2d([newCoords[0], newCoords[1]], [0, 0]) < this.r + tunnel_voidWidth && newCoords[2] > 0 && newCoords[2] < (this.len * this.tileSize) + tunnel_transitionLength * 2) {
			//if in the traditional game state, become discovered
			if (loading_state.isMainGame) {
				this.discovered = true;
			}
			return true;
		}
		return false;
	}

	repairData() {
		//fix data array size
		while (this.data.length > this.sides * this.tilesPerSide) {
			this.data.pop();
		}

		//update tunnel length
		this.len = 0;
		for (var z=0; z<this.sides * this.tilesPerSide; z++) {
			if (this.data[z] != undefined) {
				//trace backwards until the longest tile is found
				for (var t=this.data[z].length-1; t>-1; t--) {
					if (this.data[z][t] != 0) {
						this.len = Math.max(this.len, t+1);
						t = -1;
					}
				}
			}
		}

		//fix possible undefineds
		for (var a=0; a<this.sides * this.tilesPerSide; a++) {
			if (this.data[a] == undefined) {
				this.data[a] = [];
			}
			for (var b=0; b<this.len; b++) {
				if (this.data[a][b] == undefined) {
					this.data[a][b] = 0;
				}
			}

			//remove elements if too long
			while (this.data[a].length > this.len) {
				this.data[a].pop();
			}
		}
	}

	reset() {
		this.resetWithoutPlayer();
		this.placePlayer();
	}

	resetWithoutPlayer() {
		//misc tunnel things
		this.playerTilePos = 0;
		if (player.backwards) {
			this.executing = this.functions.length;
			this.power = this.powerBaseEnd;
		} else {
			this.executing = -1;
			this.power = this.powerBase;
		}

		this.powerPrevious = this.power;
		this.powerTime = 0;
		this.calculateBackwardsAllow();
		this.establishReals();

		//reset all crumbling tiles
		this.realTiles.forEach(s => {
			s.forEach(t => {
				if (t.constructor.name ==  "Tile_Crumbling") {
					t.reset();
				}
			});
		});

		//remove any out-of house objects
		removeInvalidObjects(this);
		//add powercells if gentleman exists
		if (this.freeObjs.length == 0) {
			if (player.constructor.name == "Gentleman" || loading_state.constructor.name == "State_Infinite") {
				this.placePowercells();
			}
		}
	}

	runTunnelFunctions() {
		//don't do during cutscenes
		if (loading_state.constructor.name == "State_Cutscene") {
			return;
		}
		//if the player is at the next function, switch which one is being executed
		if (player.backwards) {
			//backwards case
			if (this.functions[this.executing - 1] != undefined) {
				if (this.functions[this.executing - 1][0] > this.playerTilePos) {
					this.executing -= 1;
					this.powerPrevious = this.power;
					this.powerTime = 0;
				}
			}

			//if the function is valid, run it
			if (this.executing < this.functions.length && this.executing > 0) {
				this.power = tunnel_functions[this.functions[this.executing-1][2]](this.powerPrevious, this.functions[this.executing-1][1], this.powerTime);
				this.powerTime += 1;
			}
		} else {
			//forwards case
			if (this.functions[this.executing + 1] != undefined) {
				if (this.functions[this.executing + 1][0] <= this.playerTilePos) {
					this.executing += 1;
					this.powerPrevious = this.power;
					this.powerTime = 0;
					
				}
			}

			//if the function is greater than -1 run it
			if (this.executing > -1) {
				this.power = tunnel_functions[this.functions[this.executing][2]](this.powerPrevious, this.functions[this.executing][1], this.powerTime);
				this.powerTime += 1;
			}
		}
	}

	tick() {
		this.getCameraDist();
		//only bother with collision and all that jazz if it's close enough to matter
		if (this.cameraDist < this.maxTileRenderDist) {
			//update where player is
			this.playerTilePos = rotate(player.x - this.x, player.z - this.z, this.theta * -1)[1] / this.tileSize;
			

			//tick containing objects
			this.strips.forEach(s => {
				s.cameraDist = getDistance({x: s.pos[0], y: s.pos[1], z: s.pos[2]}, world_camera);
			});

			this.realTiles.forEach(s => {
				s.forEach(t => {
					t.tick();
				});
			});

			//handling functions
			if (player.parent == this && this.functions.length > 0) {
				this.runTunnelFunctions();
			}

			//free objects
			this.freeObjs.forEach(f => {
				f.tick();
			});
		}
	}

	updatePosition(x, y, z) {
		//start
		this.x = x;
		this.y = y;
		this.z = z;

		//calculate length
		this.len = 0;
		this.data.forEach(d => {
			this.len = Math.max(this.len, d.length);
		});

		//middle
		this.centerPos = [0, 0, (this.len / 2) * this.tileSize];
		[this.centerPos[0], this.centerPos[2]] = rotate(this.centerPos[0], this.centerPos[2], this.theta);
		this.centerPos = [this.centerPos[0] + this.x, this.centerPos[1] + this.y, this.centerPos[2] + this.z];

		//generating end
		this.endPos = [0, 0, this.len * this.tileSize];
		[this.endPos[0], this.endPos[2]] = rotate(this.endPos[0], this.endPos[2], this.theta);
		this.endPos = [this.endPos[0] + this.x, this.endPos[1] + this.y, this.endPos[2] + this.z];

		//misc properties
		this.r = (this.tilesPerSide * this.tileSize) / (2 * Math.sin(Math.PI / this.sides));
		this.rApothem = (this.tilesPerSide * this.tileSize) / (2 * Math.tan(Math.PI / this.sides));
		this.generate();

		//map coordinate stuff
		this.map_startCoords = spaceToScreen([this.x, this.y, this.z]);
		this.map_circleCoords = spaceToScreen([this.centerPos[0], this.centerPos[1], this.centerPos[2]]);
		this.map_endCoords = spaceToScreen([this.endPos[0] - (tunnel_transitionLength * Math.sin(this.theta)), this.endPos[1], this.endPos[2] + (tunnel_transitionLength * Math.cos(this.theta))]);
	}

	//tunnelPos is [strip number, tile number]
	worldPositionOfTile(stripNum, tileNum) {
		//get offset from center of tunnel cylinder
		var apothemAngle = ((Math.PI * 2) / this.sides) * Math.floor(stripNum / this.tilesPerSide);

		//get offset from apothem
		var additionAngle = apothemAngle + (Math.PI / 2);
		var additionLength = this.tileSize * (1 + ((stripNum % this.tilesPerSide) - 0.5) - (this.tilesPerSide * 0.5));

		//initial coordinates
		var tileX = this.rApothem * Math.cos(apothemAngle);
		var tileY = this.rApothem * Math.sin(apothemAngle);
		var tileZ = (tileNum * this.tileSize);
		
		//modifying coordinates
		tileX += additionLength * Math.cos(additionAngle);
		tileY += additionLength * Math.sin(additionAngle);

		//rotate final coordinates
		[tileX, tileZ] = rotate(tileX, tileZ, this.theta);

		return [this.x + tileX, this.y + tileY, this.z + tileZ];
	}
}

class Tunnel_Blocker {
	constructor(parent, tileZ, data) {
		this.x;
		this.y;
		this.z;
		this.houseState = undefined;

		this.tileData = [[]];
		tunnelData_parseData(data, this.tileData, 1, 1);
		this.tileZ = tileZ;
		this.tiles = [];

		this.cameraDist = 1000;
		this.playerDist = 1000;

		this.parent = parent;
		this.generate();
	}

	doComplexLighting() {
		this.tiles.forEach(t => {
			t.doComplexLighting();
		})
	}

	generate() {
		this.tiles = [];
		//quick access variables
		var internalR = (this.parent.tilesPerSide * this.parent.tileSize) / (2 * Math.tan(Math.PI / this.parent.sides));
		var externalR = this.parent.r;
		var dir = 0;
		var dirLen = 1;
		var lenUsed = 0;

		var xInTiles = 0;
		var yInTiles = 0;
		var dataChar = 0;

		var xOff = polToCart((this.parent.theta * -1) + (Math.PI / 2), 0, this.parent.tileSize);
		var yOff = [0, this.parent.tileSize, 0];
		var zOff = polToCart(this.parent.theta * -1, 0, this.tileZ * this.parent.tileSize);
		this.x = this.parent.x + zOff[0];
		this.y = this.parent.y + zOff[1];
		this.z = this.parent.z + zOff[2];

		//if there's an even number of tiles, center is offset
		if (this.parent.tilesPerSide % 2 == 0) {
			xInTiles -= 0.5;
			yInTiles -= 0.5;
		}

		//loop through all tiles
		while (dataChar < this.tileData[0].length) {
			//if the data says so, place a tile. It's a freePoly so it won't have rotational effects.
			if (this.tileData[0][dataChar]) {
				//create points
				var points = [[0.51 + xInTiles, 0.51 + yInTiles, 0], [0.51 + xInTiles, -0.51 + yInTiles, 0], [-0.51 + xInTiles, -0.51 + yInTiles, 0], [-0.51 + xInTiles, 0.51 + yInTiles, 0]];

				//clip if necessary
				var centerDist = getDistance2d([0, 0], [Math.abs(xInTiles), Math.abs(yInTiles)]);
				if (centerDist + 0.5 > internalR / this.parent.tileSize) {
					if (centerDist - 0.5 > externalR / this.parent.tileSize) {
						points = [];
					} else {
						//this is overkill but I'm lazy
						//figure out angle
						//snap to nearest side
						var offsetAngle = (Math.PI * 2) / this.parent.sides;
						var falseLength = internalR / this.parent.tileSize;

						//clipping polygon
						for (var n=0; n<this.parent.sides; n++) {
							points = clipToPlane(points, 0, [falseLength * Math.cos(n * offsetAngle), falseLength * Math.sin(n * offsetAngle), 0], [Math.PI / 2, (n * offsetAngle) + Math.PI]);
						}
					}
				}

				if (points.length > 2) {
					//place tile
					var realPoints = [];
					points.forEach(q => {
						realPoints.push([
							this.parent.x + (xOff[0] * q[0]) + (yOff[0] * q[1]) + zOff[0], 
							this.parent.y + (xOff[1] * q[0]) + (yOff[1] * q[1]) + zOff[1], 
							this.parent.z + (xOff[2] * q[0]) + (yOff[2] * q[1]) + zOff[2]
						]);
					});
					this.tiles.push(new FreePoly_Vertical(realPoints, this.parent.color));
				}
			}

			//movement stuffies, every 180 degrees the line gets 1 longer to make a spiral pattern
			lenUsed += 1;
			var endDir = (lenUsed >= dirLen);
			if (dir % 2 == 0) {
				//even dirs
				xInTiles -= dir - 1;
			} else {
				//odd dirs
				yInTiles -= dir - 2;
				if (endDir) {
					dirLen += 1;
				}
			}
			if (endDir) {
				dir = (dir + 1) % 4;
				lenUsed = 0;
			}
			dataChar += 1;
		}
	}

	getCameraDist() {
		//imprecise but whatever
		this.cameraDist = getDistance(this, world_camera);
		this.tiles.forEach(t => {
			t.getCameraDist();
		});
	}

	tick() {
		this.getCameraDist();

		if (this.cameraDist < render_maxColorDistance) {
			this.tiles.forEach(t => {
				t.tick();
			});
	
			//collide with player if close enough
			if (Math.abs(this.parent.playerTilePos - this.tileZ) < (render_maxColorDistance * 0.4) / this.parent.tileSize) {
				this.tiles.forEach(t => {
					t.collideWithEntity(player);
				});
			}
		}
	}

	beDrawn() {
		this.tiles.forEach(t => {
			t.beDrawn();
		});
	}
}

class Tunnel_FromData extends Tunnel {
	constructor(tunnelData) {
		var data = tunnelData_handle(tunnelData);
		super(data.theta, RGBtoHSV(data.color), data.tileData, data.id, data.maxLen, data.power, data.functions, data.sides, data.spawns, data.endSpawns, 
			data.tilesPerSide, data.tileSize, data.x, data.z, data.bannedCharacters, data.music);
		this.rawData = tunnelData;
	}
}

//the tunnel strips don't need to be organized by 
class Tunnel_Strip {
	constructor(x, y, z, normal, parent, tileSize, tunnelTheta) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.cameraDist = 1000;
		this.playerDist = 1000;
		this.parent = parent;
		this.normal = normal;
		this.tunnelTheta = tunnelTheta;
		this.tileSize = tileSize;
	}

	//returns true if the player should be drawn on top of the strip
	playerIsOnTop(selfIndex) {
		//first figure out the reference plane being used
		var playerRelPos = spaceToRelativeRotless([player.x, player.y, player.z], [this.x, this.y, this.z], this.normal);

		//if player is out of self's intersection possibility
		if (Math.abs(playerRelPos[1]) > (this.tileSize * 0.5) + player.r) {
			return true;
		}

		var cameraRelPos = spaceToRelativeRotless([world_camera.x, world_camera.y, world_camera.z], [this.x, this.y, this.z], this.normal);
		var tileToCheck = Math.floor(this.parent.playerTilePos - 1.5);
		var tileID = this.parent.data[selfIndex][tileToCheck]

		//if both camera and player are on the same side, as long as it's a normal tile (not box or ramp) return
		if (playerRelPos[2] * cameraRelPos[2] > 0) {
			// if (tileID == undefined || tileID < 9) {
			// 	return true;
			// }
			// return false;
			return true;
		}

		//if player and camera are on different sides...
		tileToCheck = Math.floor(linterp(cameraRelPos[0] / this.parent.tileSize, this.parent.playerTilePos, getPercentage(cameraRelPos[2], playerRelPos[2], 0)) - 0.5);
		tileID = this.parent.data[selfIndex][tileToCheck];

		//if no tile there (or box, or plexiglass), ignore the player
		if (tileID == undefined || tileID == 9 || tileID == 10 || 
		(tileID == 0 && player.personalBridgeStrength == undefined)) {
			return true;
		}
		//if the tile's a 'regular' tile, skip this step (player + camera are on opposite sides, normal tiles must block view here)
		if (tileID < 9 && tileID != 3) {
			return false;
		}

		//if there is a special tile there, use the tile's coordinates
		return this.tiles[tileToCheck].playerIsOnTop();
	}
}



class Wormhole {
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.r = 6000;

		//visibility properties
		this.ignore = false;
		this.engulfsCamera = false;
		this.drawR;
		this.sPos = [];

		//space-bending properties
		this.arcAtRadius = 1.3;
		this.maxRadiusMult = 4.3;
	}

	beDrawn() {
		//don't bother if clipped
		if (this.ignore) {
			return;
		}

		ctx.beginPath();
		ctx.fillStyle = "#000";
		ctx.ellipse(this.sPos[0], this.sPos[1], this.drawRX, this.drawRY, this.drawA, 0, Math.PI * 2);
		ctx.fill();

		var circSize = Math.min(canvas.height / 100, this.drawRX / 5);

		//recalculate where offset points are to draw them

		drawCircle("#F0F", ...this.sPos, circSize);
		drawCircle("#F0F", ...this.sXO, circSize);
		drawCircle("#F0F", ...this.sYO, circSize);
	}

	tick() {
		this.ignore = false;

		//just be in the center if the player is inside
		this.engulfsCamera = (getDistance(world_camera, this) <= this.r);
		if (this.engulfsCamera) {
			this.sPos = [canvas.width / 2, canvas.height / 2];
			this.drawR = canvas.width;
			return;
		}
		
		if (isClipped([this.x, this.y, this.z])) {
			this.ignore = true;
			return;
		}

		//figure out radius using transformations
		var wormCPos = multiplyPointByMatrix([this.x - world_camera.x, this.y - world_camera.y, this.z - world_camera.z], world_camera.rotMatrix);
		var distToCenter = getDistance(world_camera, world_wormhole);

		//a • b = |a||b|cos(θ)
		//acos(a • b / (|a||b|)) = θ
		//a - camera pointing vector, in camera space will be [0, 0, 1]
		//b - wormhole pointing vector, in camera space will just be wormhole coordinates
		//if θ is too great, the wormhole won't be on screen and will be so distorted it won't be worth counting.
		var wormTheta = Math.acos(wormCPos[2] / distToCenter);
		if (wormTheta > 1.5) {
			this.ignore = true;
			return;
		}

		//offset points should always be closer to the center of the screen, but will be 
		//some point forwards from the center of the sphere (because perspective)
		var angleQ = Math.acos(this.r / distToCenter);
		var height = this.r * Math.sin(angleQ);
		var width = this.r * Math.cos(angleQ);

		//get offset dirs so that the offset points are perpendicular to the camera
		var dirToCam = cartToPol(...wormCPos);
		var dirX = [dirToCam[0], dirToCam[1]];
		var dirY = [dirToCam[0], dirToCam[1] + Math.PI / 2];

		//figure out offset points. make sure they're always closer to the center of the screen
		//dimensionOC -> dimension Offset Cartesian
		var zOC = polToCart(dirToCam[0], dirToCam[1], -width);
		var yOC = polToCart(dirY[0], dirY[1], height * boolToSigned(dirToCam[1] < 0));
		var xOC = polToCart(dirX[0] + (Math.PI / 2), 0, height * boolToSigned(dirToCam[0] < 0));

		
		var xOff = [wormCPos[0] + zOC[0] + xOC[0], wormCPos[1] + zOC[1] + xOC[1], wormCPos[2] + zOC[2] + xOC[2]];
		var yOff = [wormCPos[0] + zOC[0] + yOC[0], wormCPos[1] + zOC[1] + yOC[1], wormCPos[2] + zOC[2] + yOC[2]];

		this.sXO = cameraToScreen(xOff);
		this.sYO = cameraToScreen(yOff);

		//when the wormhole gets close to the clipping plane (far out of the FOV), effects get weird. I want to reduce that.
		var maxRad = canvas.width * Math.cos(wormTheta)

		this.sPos = cameraToScreen(wormCPos);
		this.drawR = (Math.min(getDistance2d(this.sPos, this.sXO), maxRad) + Math.min(getDistance2d(this.sPos, this.sYO), maxRad)) / 2;

		
	}
}