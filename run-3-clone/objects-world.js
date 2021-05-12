

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
				this.transformPointSpecial(q, [this.x, this.y, this.z], this.theta + (Math.PI / 2), this.phi, this.tileSize * 0.9999);
			});
		});
		pos_inTapesR.forEach(p => {
			p.forEach(q => {
				this.transformPointSpecial(q, [this.x, this.y, this.z], this.theta + (Math.PI / 2), this.phi, this.tileSize * 0.9999);
			});
		});
		pos_outTapesL.forEach(p => {
			p.forEach(q => {
				this.transformPointSpecial(q, [this.x, this.y, this.z], this.theta + (Math.PI / 2), this.phi, this.tileSize * 1.00001);
			});
		});
		pos_outTapesR.forEach(p => {
			p.forEach(q => {
				this.transformPointSpecial(q, [this.x, this.y, this.z], this.theta + (Math.PI / 2), this.phi, this.tileSize * 1.00001);
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





class FreePoly {
	constructor(points, color) {
		this.x;
		this.y;
		this.z;
		this.points = points;
		this.normal;
		this.color = color;
		this.cameraDist = render_maxColorDistance + 1;
		this.playerDist = render_maxColorDistance + 1;

		//collision tolerance
		this.tolerance = player.r * 0.7;
	}

	calculateNormal() {
		//first get average point, that's self's xyz
		[this.x, this.y, this.z] = avgArray(this.points);

		//get cross product of first two points, that's the normal
		//every shape has to have at least 3 points, so 
		//comparing points 2 and 3 to point 1 for normal getting
		var v1 = [this.points[1][0] - this.points[0][0], this.points[1][1] - this.points[0][1], this.points[1][2] - this.points[0][2]];
		var v2 = [this.points[2][0] - this.points[0][0], this.points[2][1] - this.points[0][1], this.points[2][2] - this.points[0][2]];
		var cross = [(v1[1] * v2[2]) - (v1[2] * v2[1]), (v1[2] * v2[0]) - (v1[0] * v2[2]), (v1[0] * v2[1]) - (v1[1] * v2[0])];
		
		cross = cartToPol(cross[0], cross[1], cross[2]);
		
		//checking for alignment with camera
		// if (spaceToRelativeRotless([world_camera.x, world_camera.y, world_camera.z], [this.x, this.y, this.z], [cross[0], cross[1]])[2] < 0) {
		// 	cross[0] = (cross[0] + Math.PI) % (Math.PI * 2);
		// }
		this.normal = [cross[0], cross[1]];
	}

	collideWithEntity(entity) {
		//transform player to self's coordinates
		var entityCoords = spaceToRelativeRotless([entity.x, entity.y, entity.z], [this.x, this.y, this.z], this.normal);

		//if the player is colliding, do collision stuffies
		if (Math.abs(entityCoords[2]) < this.tolerance && Math.abs(entityCoords[0]) < (this.size / 2) + this.tolerance && Math.abs(entityCoords[1]) < (this.size / 2) + this.tolerance) {
			//different behavior depending on side
			if (entityCoords[2] < 0) {
				//outside the tunnel
				entityCoords[2] = -1 * this.tolerance;
			} else {
				//inside the tunnel
				entityCoords[2] = this.tolerance;
				//r o t a t e   P D F
				if (!haltRotation && (entity.dir_down[0] != this.dir_down[0] || entity.dir_down[1] != this.dir_down[1])) {
					this.doRotationEffects(entity);
				}

				//special collision effects in general
				this.doCollisionEffects(entity);

				//slow entity down if the movement has jumped them too far
				//var temp = entityCoords[2];
				//if (Math.abs(temp - entityCoords[2]) >= entity.r * 0.3 && Math.abs(entityCoords[0]) > this.size / 4 && Math.abs(entityCoords[1] > this.size / 4)) {
				//	entity.dz *= 1 - (Math.abs(temp - entityCoords[2]) / player.r);
				//}
			}

			//transforming back to regular coordinates
			[entity.x, entity.y, entity.z] = relativeToSpace(entityCoords, [this.x, this.y, this.z], this.normal);
		}
	}

	doCollisionEffects(entity) {
		entity.onGround = physics_graceTime;
		entity.onIce = false;
	}

	doComplexLighting() {
		this.playerDist = getDistance_LightSource(this);
	}

	//clips self and returns an array with two polygons, clipped at the input plane.
	//always returns [polygon inside plane, polgyon outside plane]
	//if self polygon does not intersect the plane, then one of the two return values will be undefined.
	clipAtPlane(planePoint, planeNormal) {
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
			outPart = new FreePoly(outPoints, this.color);
		} else {
			//if clipping is not necessary, then just return self
			if (tempPoints[0][2] > 0) {
				inPart = this;
			} else {
				outPart = this;
			}
		}
		return [inPart, outPart];
	}

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
		}
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

		//if the player is close enough horizontally, go into target cutscene
		var winCondition;
		if (this.checkPrevious) {
			winCondition = this.parent.playerTilePos <= this.tile;
		} else {
			winCondition = this.parent.playerTilePos >= this.tile;
		}
		winCondition = winCondition && (player.parent == this.parent);
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

		this.pushForce = polToCart(-1 * this.parent.theta, 0, 0.3);
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

	doComplexLighting() {
		this.playerDist = getDistance_LightSource(this);
	}

	tick() {
		this.playerDist = getDistance(this, player);
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

				if (this.succ) {
					//changing force
					this.pushForce[0] *= this.friction;
					this.pushForce[1] *= this.friction;
					this.pushForce[2] *= this.friction;
					
					this.pushForce[0] += ((player.x - this.x) / this.playerDist) * 2.3;
					this.pushForce[1] += ((player.y - this.y) / this.playerDist) * 2.3;
					this.pushForce[2] += ((player.z - this.z) / this.playerDist) * 2.3;
				}
				
				//moving along tunnel
				this.x += this.pushForce[0];
				this.y += this.pushForce[1];
				this.z += this.pushForce[2];

				//if off the edge of the tunnel, put self back and set force to net 0
				if (spaceToRelativeRotless([this.x, this.y, this.z], this.parent.endPos, [(Math.PI * 2) - this.parent.theta, 0])[2] > 0) {
					this.pushForce = [0, 0, 0];
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
				}
				//regular'ol good'ol box collisin
				this.box.collideWithEntity(player);
			}
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
			ctx.strokeStyle = color_editor_normal;
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
		var tX = this.x;
		var tY = this.y;
		var tZ = this.z;

		[tX, tZ] = rotate(tX, tZ, world_camera.theta);
		[tY, tZ] = rotate(tY, tZ, world_camera.phi);
		[tX, tY] = rotate(tX, tY, world_camera.rot);

		//if the point isn't going to be clipped, continue
		if (tZ >= render_clipDistance) {
			tX /= tZ;
			tY /= tZ;

			//factoring in scale
			tX *= world_camera.scale;
			tY *= -1 * world_camera.scale;
		
			//accounting for screen coordinates
			tX += canvas.width / 2;
			tY += canvas.height / 2;


			//if close enough to the wormhole, draw as a smear. If not, draw as a regular circle.
			var wormDist = getDistance2d([tX, tY], world_wormhole.screenPos);
			if (wormDist < world_wormhole.drawR * world_wormhole.maxRadiusMult) {
				//use radius to determine amount of smearing
				var smearAmount = world_wormhole.arcAtRadius / Math.pow((wormDist / world_wormhole.drawR), 4);
				var angle = Math.atan2(world_wormhole.screenPos[1] - tY, world_wormhole.screenPos[0] - tX) + Math.PI;

				//modify distance to be closer to 1 if inside the wormhole
				if (wormDist < world_wormhole.drawR) {
					wormDist *= Math.sqrt((world_wormhole.drawR / wormDist));
				}
				//figure out 
				ctx.strokeStyle = this.color;
				ctx.lineWidth = this.drawR * 2;
				ctx.beginPath();
				ctx.arc(world_wormhole.screenPos[0], world_wormhole.screenPos[1], wormDist, angle - smearAmount, angle + smearAmount);
				ctx.stroke();
				return;
			}
			drawCircle(this.color, tX, tY, this.drawR);
		}
	}
}

class Star_Special extends Star {
	constructor(x, y, z) {
		super(x, y, z);
		this.color = color_star_special;
		this.r = 8000;
	}

	beDrawn() {
		if (!isClipped([this.x, this.y, this.z])) {
			this.drawR = (this.r / getDistance(this, world_camera)) * world_camera.scale;
			var screenPoint = spaceToScreen([this.x, this.y, this.z]);
			var wormDist = getDistance2d(screenPoint, world_wormhole.screenPos);
			if (wormDist < world_wormhole.drawR * world_wormhole.maxRadiusMult) {
				//use radius to determine amount of smearing
				var smearAmount = world_wormhole.arcAtRadius / Math.pow((wormDist / world_wormhole.drawR), 4);
				var angle = Math.atan2(world_wormhole.screenPos[1] - screenPoint[1], world_wormhole.screenPos[0] - screenPoint[0]) + Math.PI;

				//modify distance to be closer to 1 if inside the wormhole
				if (wormDist < world_wormhole.drawR) {
					wormDist *= Math.sqrt((world_wormhole.drawR / wormDist));
				}
				//figure out 
				ctx.strokeStyle = this.color;
				ctx.lineWidth = this.drawR * 2;
				ctx.beginPath();
				ctx.arc(world_wormhole.screenPos[0], world_wormhole.screenPos[1], wormDist, angle - smearAmount, angle + smearAmount);
				ctx.stroke();
				ctx.lineWidth = this.drawR;
				ctx.beginPath();
				ctx.arc(world_wormhole.screenPos[0], world_wormhole.screenPos[1], wormDist, angle - smearAmount, angle + smearAmount);
				ctx.stroke();
				return;
			}
			drawCircle(this.color, screenPoint[0], screenPoint[1], this.drawR);
			drawCircle(this.color, screenPoint[0], screenPoint[1], this.drawR / 2);
		}
	}
}

class Star_Lizard extends Star {
	constructor(x, y, z) {
		super(x, y, z);
		this.r = 1;
		this.drawR;
		this.texture = new Texture(data_sprites.Lizard.sheet, data_sprites.spriteSize, 1e1001, false, false, data_sprites.Lizard.front);
	}

	beDrawn() {
		this.drawR *= 1.01;
		var tX = this.x;
		var tY = this.y;
		var tZ = this.z;
		[tX, tZ] = rotate(tX, tZ, world_camera.theta);
		[tY, tZ] = rotate(tY, tZ, world_camera.phi);
		[tX, tY] = rotate(tX, tY, world_camera.rot);
		if (tZ >= render_clipDistance) {
			tX /= tZ;
			tY /= tZ;
			tX *= world_camera.scale;
			tY *= -1 * world_camera.scale;
			tX += canvas.width / 2;
			tY += canvas.height / 2;
			this.texture.beDrawn(tX, tY, 0, this.drawR);
			if (this.drawR > canvas.height / 4) {
				runCrash();
			}
		}
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
		this.houseState = loading_state;
		this.immersive = immersiveBOOLEAN;

		this.cutscene = cutsceneDataSTRING;
		this.cameraDist = 1000;
		try {
			this.texture = new Texture(data_sprites[character].sheet, data_sprites.spriteSize, 1e1001, false, false, data_sprites[character].back);
		} catch (error) {
			this.texture = undefined;
		}
		
		this.textureRot = 0;

		this.placeSelf();
	}

	doComplexLighting() {

	}

	activateCutscene() {
		//make sure self is deleted
		this.houseState = {};

		this.parent.resetWithoutPlayer();

		//put cutscene in the 'activated cutscenes' array
		if (!data_persistent.effectiveCutscenes.includes(this.cutscene)) {
			data_persistent.effectiveCutscenes.push(this.cutscene);
		}
		loading_state = new State_Cutscene(eval(`cutsceneData_${this.cutscene}`), this.immersive && loading_state);
	}

	placeSelf() {
		var targetTile = this.parent.strips[this.strip].tiles[this.tile];
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
			this.houseState = loading_state;
		}
	}
}





class Tunnel {
	//so much data here, it's a mess, but oh well
	constructor(angle, color, data, id, lengthInTiles, power, triggerFunctions, sides, spawns, endSpawns, tilesPerSide, tileSize, x, z, bannedCharacters, music) {
		this.x = x;
		this.y = 0;
		this.z = z;
		this.theta = angle;
		this.phi = 0;

		
		this.allowBackwards = false;
		this.bannedCharacters = bannedCharacters;
		this.color = color;
		this.cameraDist = 1000;
		this.discovered = false;

		this.executing = -1;
		this.functions = triggerFunctions;

		this.id = id;
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
		this.len = lengthInTiles;
		this.data = data;
		this.spawns = spawns;
		this.endSpawns = endSpawns;
		this.hasSetEndSpawns = this.endSpawns.length > 0;
		this.strips = [];
		this.freeObjs = [];
		this.farPolys = [];
		this.reverseOrder = false;
		this.tilesPerSide = tilesPerSide;
		this.tileSize = tileSize;

		//generating center
		this.centerPos = [0, 0, (lengthInTiles / 2) * tileSize];
		[this.centerPos[0], this.centerPos[2]] = rotate(this.centerPos[0], this.centerPos[2], angle);
		this.centerPos = [this.centerPos[0] + this.x, this.centerPos[1] + this.y, this.centerPos[2] + this.z];

		//generating end
		this.endPos = [0, 0, lengthInTiles * tileSize];
		[this.endPos[0], this.endPos[2]] = rotate(this.endPos[0], this.endPos[2], angle);
		this.endPos = [this.endPos[0] + this.x, this.endPos[1] + this.y, this.endPos[2] + this.z];

		//radius
		this.r = (this.tilesPerSide * this.tileSize) / (2 * Math.sin(Math.PI / this.sides));

		this.generate();
		//stop rendering individual tiles when they're less than 1 unit per tile
		this.maxTileRenderDist = Math.min(render_maxDistance, (this.tileSize * world_camera.scale) / render_minPolySize);

		//map stuffies
		this.map_startCoords = spaceToScreen([this.x, this.y, this.z]);
		this.map_circleCoords = spaceToScreen([this.centerPos[0], this.centerPos[1], this.centerPos[2]]);
		this.map_endCoords = spaceToScreen([this.endPos[0], this.endPos[1], this.endPos[2]]);
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
			if (data_persistent.settings.altRender) {
				this.beDrawn_playerParentAlternate();
				return;
			}
			this.beDrawn_playerParent();
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

	beDrawn_playerParent() {
		this.farPolys.forEach(f => {
			f.beDrawn();
		});

		var tunnelSize = this.strips.length;
		var tunnelStrip = getClosestObject(this.strips);
		var strip;

		//organize strips based around that
		var drawPlayer = true;
		var freeObjsInMiddle = !this.coordinateIsInTunnel_Boundless(world_camera.x, world_camera.y, world_camera.z);

		//back faces
		for (var n=tunnelSize; n>tunnelSize / 2; n--) {
			strip = ((tunnelStrip + (Math.floor(n / 2) * boolToSigned(n % 2 == 1))) + tunnelSize) % tunnelSize;
			if (drawPlayer) {
				if (!this.strips[strip].playerIsOnTop()) {
					drawPlayer = false;
					player.beDrawn();
				}
			}
			this.strips[strip].beDrawn();
		}

		//if the camera is outside the tunnel do the hybrid approach. If not, do the normal way.
		if (freeObjsInMiddle) {
			this.freeObjs.forEach(f => {
				f.beDrawn();
			});
		}

		//front faces
		for (var n=Math.floor(tunnelSize / 2); n>0; n--) {
			strip = ((tunnelStrip + (Math.floor(n / 2) * boolToSigned(n % 2 == 1))) + tunnelSize) % tunnelSize;
			if (drawPlayer) {
				if (!this.strips[strip].playerIsOnTop()) {
					drawPlayer = false;
					player.beDrawn();
				}
			}
			this.strips[strip].beDrawn();
		}

		//if the free objects still aren't drawn, draw them
		if (!freeObjsInMiddle) {
			this.freeObjs.forEach(f => {
				f.beDrawn();
			});
		}

		//if the player's still not drawn, finally draw them
		if (drawPlayer) {
			player.beDrawn();
		}

		if (editor_active) {
			//numbering strips
			ctx.font = `${canvas.height / 48}px Comfortaa`;
			ctx.fillStyle = color_text_bright;
			var [tX, tY] = [0, 0];
			for (var v=0; v<tunnelSize; v++) {
				if (!isClipped([this.strips[v].x, this.strips[v].y, this.strips[v].z])) {
					[tX, tY] = spaceToScreen([this.strips[v].x, this.strips[v].y, this.strips[v].z]);
					ctx.fillText(v, tX + 5, tY);
				}
			}
			//dot for closest spot
			if (!isClipped([this.strips[tunnelStrip].x, this.strips[tunnelStrip].y, this.strips[tunnelStrip].z])) {
				[tX, tY] = spaceToScreen([this.strips[tunnelStrip].x, this.strips[tunnelStrip].y, this.strips[tunnelStrip].z]);
				drawCircle("#FFF", tX, tY, 10);
			}
		}
	}

	beDrawn_playerParentAlternate() {
		//far polygons
		this.farPolys.forEach(f => {
			f.beDrawn();
		});

		//if self has only 1 tile per side, it doesn't matter, just do regular
		if (this.tilesPerSide == 1) {
			this.beDrawn_playerParent();
			return;
		}
		//figure out whether to do free objects in the center or not
		var doFreeObjsHalfway = !this.coordinateIsInTunnel_Boundless(world_camera.x, world_camera.y, world_camera.z);
		var drawPlayer = true;

		//determine what the closest side is 
		var relCameraPos = spaceToRelativeRotless([world_camera.x, world_camera.y, world_camera.z], [this.x, this.y, this.z], [-1 * this.theta, this.phi]);
		var closestSide = Math.floor((((Math.atan2(relCameraPos[1], relCameraPos[0]) + (Math.PI * (2 + (1 / this.sides)))) / (Math.PI * 2)) % 1) * this.sides);
		var trueSideStrip;
		var centerStripOffset;
		var nowDrawing;

		//zigzag pattern of side (first half)
		for (var side=this.sides; side>Math.floor(this.sides/2); side--) {
			//true side strip is the index of the strip at the start of the side
			trueSideStrip = modulate((closestSide + (Math.floor(side / 2) * boolToSigned(side % 2 == 1))) * this.tilesPerSide, this.sides * this.tilesPerSide);
			//center strip offset is the number of the strip that the camera is on top of
			centerStripOffset = Math.floor((spaceToRelativeRotless([world_camera.x, world_camera.y, world_camera.z], [this.strips[trueSideStrip].x, this.strips[trueSideStrip].y, this.strips[trueSideStrip].z], this.strips[trueSideStrip].normal)[1] / this.tileSize) + 0.5);
			centerStripOffset = clamp(centerStripOffset, 0, this.tilesPerSide);
			//loop through strips in current size, same zigzag pattern but with strips instead of sides
			for (var n=this.tilesPerSide*2; n>0; n--) {
				nowDrawing = (trueSideStrip + centerStripOffset + (Math.floor(n / 2) * boolToSigned(n % 2 == 1))) % (this.sides * this.tilesPerSide);
				//don't draw strips out of bounds
				if (nowDrawing >= trueSideStrip && nowDrawing < trueSideStrip + this.tilesPerSide) {
					if (drawPlayer && !this.strips[nowDrawing].playerIsOnTop()) {
						player.beDrawn();
						drawPlayer = false;
					}
					this.strips[nowDrawing].beDrawn();
				}
			}
		}

		if (doFreeObjsHalfway) {
			this.freeObjs.forEach(f => {
				f.beDrawn();
			});
		}

		//same zigzag pattern, but second half
		for (var side=Math.floor(this.sides/2); side>0; side--) {
			trueSideStrip = modulate((closestSide + (Math.floor(side / 2) * boolToSigned(side % 2 == 1))) * this.tilesPerSide, this.sides * this.tilesPerSide);
			centerStripOffset = Math.floor((spaceToRelativeRotless([world_camera.x, world_camera.y, world_camera.z], [this.strips[trueSideStrip].x, this.strips[trueSideStrip].y, this.strips[trueSideStrip].z], this.strips[trueSideStrip].normal)[1] / this.tileSize) + 0.5);
			centerStripOffset = clamp(centerStripOffset, 0, this.tilesPerSide);
			for (var n=this.tilesPerSide*2; n>0; n--) {
				nowDrawing = (trueSideStrip + centerStripOffset + (Math.floor(n / 2) * boolToSigned(n % 2 == 1))) % (this.sides * this.tilesPerSide);
				if (nowDrawing >= trueSideStrip && nowDrawing < trueSideStrip + this.tilesPerSide) {
					if (drawPlayer && !this.strips[nowDrawing].playerIsOnTop()) {
						player.beDrawn();
						drawPlayer = false;
					}
					this.strips[nowDrawing].beDrawn();
				}
			}
		}


		if (!doFreeObjsHalfway) {
			this.freeObjs.forEach(f => {
				f.beDrawn();
			});
		}

		//draw player if they haven't been drawn yet
		if (drawPlayer) {
			player.beDrawn();
		}

		//debug stuff
		if (editor_active) {
			//numbering strips
			ctx.font = `${canvas.height / 48}px Comfortaa`;
			ctx.fillStyle = color_text_bright;
			var [tX, tY] = [0, 0];
			for (var v=0; v<this.strips.length; v++) {
				if (!isClipped([this.strips[v].x, this.strips[v].y, this.strips[v].z])) {
					[tX, tY] = spaceToScreen([this.strips[v].x, this.strips[v].y, this.strips[v].z]);
					ctx.fillText(v, tX + 5, tY);
				}
			}
			//dot for closest spot
			var strip = closestSide * this.tilesPerSide;
			if (!isClipped([this.strips[strip].x, this.strips[strip].y, this.strips[strip].z])) {
				[tX, tY] = spaceToScreen([this.strips[strip].x, this.strips[strip].y, this.strips[strip].z]);
				drawCircle("#FFF", tX, tY, 10);
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
		var freeObjsInMiddle = !this.coordinateIsInTunnel_Boundless(world_camera.x, world_camera.y, world_camera.z);

		for (var n=tunnelSize; n>tunnelSize / 2; n--) {
			this.strips[((tunnelStrip + (Math.floor(n / 2) * boolToSigned(n % 2 == 1))) + tunnelSize) % tunnelSize].beDrawn();
		}

		if (freeObjsInMiddle) {
			this.freeObjs.forEach(f => {
				f.beDrawn();
			});
		}

		for (var n=Math.floor(tunnelSize / 2); n>0; n--) {
			this.strips[((tunnelStrip + (Math.floor(n / 2) * boolToSigned(n % 2 == 1))) + tunnelSize) % tunnelSize].beDrawn();
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

	beDrawnOnMap() {
		//draw self if discovered
		if (this.discovered || editor_active) {
			this.map_startCoords = spaceToScreen([this.x, this.y, this.z]);
			this.map_circleCoords = spaceToScreen([this.centerPos[0], this.centerPos[1], this.centerPos[2]]);
			this.map_endCoords = spaceToScreen([this.endPos[0] - (tunnel_transitionLength * Math.sin(this.theta)), this.endPos[1], this.endPos[2] + (tunnel_transitionLength * Math.cos(this.theta))]);

			//circle + line
			drawCircle(color_map_writing, this.map_circleCoords[0], this.map_circleCoords[1], canvas.height / 320);

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
	}

	beDrawn_selected() {
		//drawing theta circle + knob
		ctx.beginPath();
		ctx.strokeStyle = color_editor_cursor;
		ctx.ellipse(this.map_startCoords[0], this.map_startCoords[1], editor_thetaCircleRadius, editor_thetaCircleRadius, 0, 0, Math.PI * 2);
		ctx.stroke();
		drawCircle(color_editor_cursor, this.map_startCoords[0] + (editor_thetaCircleRadius * Math.cos(this.theta)), this.map_startCoords[1] - (editor_thetaCircleRadius * Math.sin(this.theta)), editor_thetaKnobRadius);
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

	coordinateIsInTunnel_Bounded(x, y, z) {
		//rotate by tunnel theta
		[x, z] = rotate(x - this.x, z - this.z, this.theta * -1);

		if (z < 0 || z > (this.len * this.tileSize)) {
			//if the coordinate is out of the tunnel in the z direction
			return false;
		}

		//actually making a polygon and checking that is faster than checking with the 3d strips
		var polyPoints = [];
		for (var a=0; a<this.sides; a++) {
			polyPoints.push([this.r * Math.cos(((Math.PI * 2) / this.sides) * (a - 0.5)), this.r * Math.sin(((Math.PI * 2) / this.sides) * (a - 0.5))]);
		}

		return inPoly([x, y - this.y], polyPoints);
	}

	coordinateIsInTunnel_Boundless(x, y, z) {
		var polyPoints = [];
		for (var a=0; a<this.sides; a++) {
			polyPoints.push([this.r * Math.cos(((Math.PI * 2) / this.sides) * (a - 0.5)), this.r * Math.sin(((Math.PI * 2) / this.sides) * (a - 0.5))]);
		}

		return inPoly([rotate(x - this.x, z - this.z, this.theta * -1)[0], y - this.y], polyPoints);
	}

	doComplexLighting() {
		//loop through all tiles
		this.strips.forEach(s => {
			s.realTiles.forEach(t => {
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

	//hopefully self-explanatory
	generate() {
		this.generateTiles();
		this.generatePlexies();
		this.generateFarPolys();
	}

	//this function is a mess. It shoul probably be rewritten from scratch.
	generateFarPolys() {
		this.farPolys = [];
		var actualPolyPoints = [];
		//this is so the first strip has something to look at
		this.farPolys[-1] = [];

		//strip by strip
		this.strips.forEach(s => {
			//create bin for farPolys
			this.farPolys.push([]);
			if (s.realTiles[0] == undefined) {
				return;
			}

			var lastBin = this.farPolys[this.farPolys.length-2];
			var lastBinIndex = 0;
			
			var bin = this.farPolys[this.farPolys.length-1];
			var lastIndex = s.tiles.indexOf(s.realTiles[0]);
			
			var polyRegister = [];
			var minMax = [];

			//merge controls
			var possibleMerge = (lastBin.length > 0) && ((this.farPolys.length - 1) % this.tilesPerSide != 0);
			var merged = false;

			//start behavior
			polyRegister.push(s.realTiles[0].points[0]);
			polyRegister.push(s.realTiles[0].points[1]);
			minMax[0] = lastIndex;

			for (var t=1; t<s.realTiles.length; t++) {
				var index = s.tiles.indexOf(s.realTiles[t]);

				//if there's a greater than 1 gap, end + start another polygon
				if (index - lastIndex > 1) {
					polyRegister.push(s.tiles[lastIndex].points[2]);
					polyRegister.push(s.tiles[lastIndex].points[3]);
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

					polyRegister.push(s.realTiles[t].points[0]);
					polyRegister.push(s.realTiles[t].points[1]);
					minMax[0] = index;
				}
				lastIndex = index;
			}

			//if a poly is partially finished, finish it
			if (polyRegister.length > 0) {
				polyRegister.push(s.realTiles[s.realTiles.length-1].points[2]);
				polyRegister.push(s.realTiles[s.realTiles.length-1].points[3]);
				minMax[1] = s.tiles.indexOf(s.realTiles[s.realTiles.length-1]);
				
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
		});

		//dereference the complex objects, then all that's left is the set of points from before. Turn those into FarPolys.
		this.farPolys = [];
		actualPolyPoints.forEach(p => {
			this.farPolys.push(new FarPoly(p));
		});
	}

	//I apologize in advance for any headaches this function causes.
	generateTiles() {
		this.strips = [];
		//split array into strips, with each strip being its own data structure
		for (var t=0; t<this.sides*this.tilesPerSide; t++) {
			//normal
			var stripNormal = [(Math.PI * 1.5) - this.theta, ((((Math.PI * 2) / this.sides) * Math.floor(t / this.tilesPerSide) * -1) + (Math.PI * 2)) % (Math.PI * 2)];
			var stripPos = this.worldPositionOfTile(t, 0);
			var loadingStrip = new Tunnel_Strip(stripPos[0], stripPos[1], stripPos[2], stripNormal, this, this.tileSize, this.theta);

			//run through every tile in the strip
			for (var a=0; a<this.len; a++) {
				//creating tile
				var value = this.data[t][a];
				if (value == undefined) {
					value = 0;
				}
				//if at the end and is a tile, add to end spawns
				if (!this.hasSetEndSpawns && a >= this.len - 2 && value > 0) {
					if (!this.endSpawns.includes(t)) {
						this.endSpawns.push(t);
					}
				}
				var tileCoordinates = this.worldPositionOfTile(t, a+1);
				loadingStrip.tiles.push(this.generateTile(value, tileCoordinates[0], tileCoordinates[1], tileCoordinates[2], this.tileSize, stripNormal, this.color, t, a));
			}
			loadingStrip.establishReals();
			this.strips.push(loadingStrip);
		}
		// if (this.endSpawns.length == 0) {
		// 	console.log(`oh no! No end spawns for tunnel id~${this.id}`);
		// }
		// if (this.spawns.length == 0) {
		// 	console.log(`oh no! No spawns for tunnel id~${this.id}`);
		// }
	}

	//generates the plexiglass tiles, to go along the edges of the regular tiles
	generatePlexies() {
		//run through every strip
		for (var s=0; s<this.strips.length; s++) {
			//run through every tile in the strip
			for (var t=0; t<this.strips[s].tiles.length; t++) {
				//if it's undefined the plexiglass algorithm can be run
				if (this.strips[s].tiles[t] == undefined) {
					//determining strength
					var tileOffset = Math.floor(physics_maxBridgeDistance / this.tileSize);
					var tileStrength = 0;

					for (var x=s-tileOffset; x<s+tileOffset; x++) {
						for (var y=t-tileOffset; y<t+tileOffset; y++) {
							var realStrip = x;
							//sanitize x
							while (realStrip < 0) {
								realStrip += this.strips.length;
							}
							realStrip = realStrip % this.strips.length;
							//first convert coordinates into true coordinates, then check if there's a tile there
							if (y > -1 && y < this.strips[realStrip].tiles.length) {
								//undefineds cannot give strength
								if (this.strips[realStrip].tiles[y] != undefined) {
									//bridge tiles cannot give strength
									if (this.strips[realStrip].tiles[y].constructor.name != "Tile_Plexiglass") {
										//the strength that tile gives is proportional to the distance to that tile
										var distance = (Math.abs(x - s) + Math.abs(y - t)) * this.tileSize;
	
										//upgrade strength if necessary
										tileStrength = Math.max(tileStrength, 1 - (distance / physics_maxBridgeDistance));
									}
								}
							}
						}
					}

					tileStrength = tileStrength * tileStrength;
					//only create tile if strength is great enough
					if (tileStrength > 0.01) {
						var tileCoords = this.worldPositionOfTile(s, t+1);
						this.strips[s].tiles[t] = new Tile_Plexiglass(tileCoords[0], tileCoords[1], tileCoords[2], this.tileSize, this.strips[s].normal, this, this.color, tileStrength);
					}
				}
			}
			this.strips[s].establishReals();
		}
	}

	//generates a single tile from parameters
	generateTile(type, x, y, z, size, normal, color, strip, tile) {
		switch(type) {
			case 1:
				return new Tile(x, y, z, size, normal, this, color);
			case 2:
				return new Tile_Bright(x, y, z, size, normal, this, color);
			case 3:
				return new Tile_Crumbling(x, y, z, size, normal, this, color, [strip, tile]);
			case 4:
				return new Tile_Ice(x, y, z, size, normal, this);
			case 5:
				return new Tile_Conveyor_Slow(x, y, z, size, normal, this);
			case 6:
				return new Tile_Conveyor(x, y, z, size, normal, this);
			case 7:
				return new Tile_Conveyor_Left(x, y, z, size, normal, this);
			case 8:
				return new Tile_Conveyor_Right(x, y, z, size, normal, this);
			case 9: 
				return new Tile_Box(x, y, z, size, normal, this);
			case 10:
				return new Tile_Box_Spun(x, y, z, size, normal, this);
			case 11:
				return new Tile_Ramp(x, y, z, size, normal, this, color);
			case 12: 
				return new Tile_Ice_Ramp(x, y, z, size, normal, this, color);
			case 13:
				return new Tile_Ringed(x, y, z, size, normal, this, color);
			case 14: 
				return new Tile_Box_Ringed(x, y, z, size, normal, this);
			case 15:
				return new Tile_Bright_Ringed(x, y, z, size, normal, this, color);
			case 16:
				return new Tile_Warning(x, y, z, size, normal, this);
			default:
				return undefined;
		}
	}

	getCameraDist() {
		var relPos = spaceToRelativeRotless([world_camera.x, world_camera.y, world_camera.z], [this.x, this.y, this.z], [-1 * this.theta, 0]);
		if (relPos[2] > 0) {
			relPos[2] = Math.max(relPos[2] - (this.tileSize * this.len) - tunnel_transitionLength, 0);
		}
		this.cameraDist = Math.sqrt((relPos[0] * relPos[0]) + (relPos[1] * relPos[1]) + (relPos[2] * relPos[2]));
	}
	
	giveStringData() {
		//TODO: support function output
		//TODO: support banned character output
		var output = ``;
		//simple non-tile position features
		output += `id~${this.id}`;
		output += `|pos-x~${this.x.toFixed(4)}`;
		output += `|pos-z~${this.z.toFixed(4)}`;
		output += `|direction~${this.theta.toFixed(4)}`;
		output += `|layout-tunnel~${this.sides}~${this.tilesPerSide}`;
		output += `|color~${HSVtoRGB(this.color)}`;
		output += `|tileWidth~${this.tileSize}`;
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
		

		//tile data
		this.repairData();
		output += tunnelData_parseDataReverse(this.data);

		//power + functions
		output += `|power~${this.power.toFixed(4)}`;

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
			//just in case, if there aren't any end spawns, choose from regular spawns
			if (spawnChoice == undefined) {
				spawnChoice = this.spawns[Math.floor(randomBounded(0, this.spawns.length-1))];
			}
			//place player
			spawnObj = this.strips[spawnChoice].realTiles[this.strips[spawnChoice].realTiles.length - 1];
		} else {
			//choose randomly from spawns
			spawnChoice = this.spawns[Math.floor(randomBounded(0, this.spawns.length-1))];
			//placing player on that tile
			spawnObj = this.strips[spawnChoice].realTiles[0];
		}
		
		spawnObj.doRotationEffects(player);

		var offsetCoords = polToCart(spawnObj.normal[0], spawnObj.normal[1], 10);
		player.x = spawnObj.x + offsetCoords[0];
		player.y = spawnObj.y + offsetCoords[1];
		player.z = spawnObj.z + offsetCoords[2];
		player.dz = 0;
		this.playerTilePos = rotate(player.x - this.x, player.z - this.z, this.theta * -1)[1] / this.tileSize;

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
		var gentlemanToggle = (player.constructor.name == "Gentleman");
		//placing power cells
		var apothemLength = (this.tilesPerSide * this.tileSize) / (2 * Math.tan(Math.PI / this.sides));
		var truePowercells = powercells_perTunnel;
		if (gentlemanToggle) {
			truePowercells = Math.round(truePowercells * powercells_gentlemanMultiplier);
		}
		for (var a=0; a<truePowercells; a++) {
			var rotation = randomBounded(0, Math.PI * 2);

			//get offset
			var offset = polToCart(Math.PI / 2, rotation, apothemLength * randomBounded(0.3, 0.9));
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
		[newCoords[0], newCoords[2]] = rotate(newCoords[0], newCoords[2], this.theta * -1);

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
		//reset all crumbling tiles
		this.strips.forEach(a => {
			a.reset();
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
			

			this.strips.forEach(s => {
				s.tick();
			});

			//handling functions
			if (player.parent == this && this.functions.length > 0) {
				this.runTunnelFunctions();
			}

			//order and then tick free objects
			this.freeObjs = orderObjects(this.freeObjs, 5);
			this.freeObjs.forEach(f => {
				f.tick();
			});
		}
	}

	handleMouseDown() {
		//default case, go into the level
		if (!editor_active) {
			player.parentPrev = this;
			this.calculateBackwardsAllow();
			player.backwards = player.backwards && this.allowBackwards;
			loading_state = new State_Game();
			player.parentPrev.reset();

			//displaying text
			loading_state.text = this.id;
			loading_state.time = tunnel_textTime;
			return;
		}

		var knobCoords = [this.map_startCoords[0] + (editor_thetaCircleRadius * Math.cos(this.theta)), this.map_startCoords[1] - (editor_thetaCircleRadius * Math.sin(this.theta))];
	
		//if colliding with the theta change circle, do that stuff
		if (getDistance2d(knobCoords, [cursor_x, cursor_y]) < editor_thetaKnobRadius) {
			var diffX = cursor_x - this.map_startCoords[0];
			var diffY = cursor_y - this.map_startCoords[1];
			this.theta = (Math.atan2(diffY * -1, diffX) + (Math.PI * 2)) % (Math.PI * 2);
			this.updatePosition(this.x, this.y, this.z);
			loading_state.changingTheta = true;
		} else {
			//if not, deselect self
			loading_state.objSelected = undefined;
			loading_state.changingTheta = false;
		}
	}

	handleMouseMove() {
		if (loading_state.changingTheta) {
			//update direction
			this.theta = (Math.atan2(cursor_y - this.map_startCoords[1], this.map_startCoords[0] - cursor_x) + Math.PI) % (Math.PI * 2);
			this.updatePosition(this.x, this.y, this.z);

			//reset cursor pos 
			cursor_x = this.map_circleCoords[0];
			cursor_y = this.map_circleCoords[1];
		} else {
			//moving the tunnel
			var snapX = cursor_x;
			var snapY = cursor_y;

			//if a tunnel end is close enough to the tunnel start, snap the tunnel to that position
			var startSelectOffset = [this.map_startCoords[0] - this.map_circleCoords[0], this.map_startCoords[1] - this.map_circleCoords[1]];
			//calculating tunnel end pos
			for (var a=0; a<world_objects.length; a++) {
				if (world_objects[a] != this) {
					var endPos = world_objects[a].map_endCoords;
					if (getDistance2d([endPos[0], endPos[1]], [snapX + startSelectOffset[0], snapY + startSelectOffset[1]]) < editor_mapSnapTolerance) {
						//moving position of selection
						//get difference between tunnel start coordinates and selected coordinates
						snapX = endPos[0] - startSelectOffset[0];
						snapY = endPos[1] - startSelectOffset[1];
					}
				}
			}

			//update selected tunnel position
			var offset = [this.map_startCoords[0] - this.map_circleCoords[0], this.map_startCoords[1] - this.map_circleCoords[1]];
			var newCoords = screenToSpace([snapX + offset[0], snapY + offset[1]], world_camera.y);
			this.updatePosition(newCoords[0], newCoords[1], newCoords[2]);
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
		this.generate();

		//map coordinate stuff
		this.map_startCoords = spaceToScreen([this.x, this.y, this.z]);
		this.map_circleCoords = spaceToScreen([this.centerPos[0], this.centerPos[1], this.centerPos[2]]);
		this.map_endCoords = spaceToScreen([this.endPos[0] - (tunnel_transitionLength * Math.sin(this.theta)), this.endPos[1], this.endPos[2] + (tunnel_transitionLength * Math.cos(this.theta))]);
	}

	//tunnelPos is [strip number, tile number]
	worldPositionOfTile(stripNum, tileNum) {
		//get offset from center of tunnel cylinder
		var l = this.tilesPerSide * this.tileSize;
		var apothemLength = l / (2 * Math.tan(Math.PI / this.sides));
		var apothemAngle = ((Math.PI * 2) / this.sides) * Math.floor(stripNum / this.tilesPerSide);

		//get offset from apothem
		var additionAngle = apothemAngle + (Math.PI / 2);
		var additionLength = (this.tileSize) + ((this.tileSize * (stripNum % this.tilesPerSide)) - (this.tileSize / 2)) - (l / 2);

		//initial coordinates
		var tileX = apothemLength * Math.cos(apothemAngle);
		var tileY = apothemLength * Math.sin(apothemAngle);
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

		this.tileData = data;
		this.tileZ = tileZ;

		this.cameraDist = 1000;
		this.playerDist = 1000;

		this.parent = parent;
	}

	generate() {

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

		this.tiles = [];
		this.realTiles = [];
		this.realsBackwards = [];
	}

	//returns true if the player should be drawn on top of the strip
	playerIsOnTop() {
		//first figure out the reference plane being used
		var playerRelPos = spaceToRelativeRotless([player.x, player.y, player.z], [this.x, this.y, this.z], this.normal);

		//if player is within self's intersection possibility, continue
		if (Math.abs(playerRelPos[1]) < (this.tileSize * 0.5) + player.r) { 
			//if no tile there, ignore the player
			if (this.tiles[Math.floor(this.parent.playerTilePos - 0.5)] == undefined || this.tiles[Math.floor(this.parent.playerTilePos - 0.5)].leftTile != undefined) {
				return true;
			}

			//if there is a tile there, use the tile's coordinates
			return this.tiles[Math.floor(this.parent.playerTilePos - 0.5)].playerIsOnTop();
		}
		return true;
	}

	beDrawn() {
		if (this.parent.reverseOrder) {
			this.beDrawn_TilesReversed();
		} else {
			this.beDrawn_Tiles();
		}

		//debug
		if (editor_active) {
			var cXYZ = polToCart(this.normal[0], this.normal[1], 10);
			var dXYZ = polToCart((Math.PI * 2) - this.parent.theta, 0, this.parent.tileSize * this.tiles.length);
			//spawn
			ctx.lineWidth = 4;
			ctx.strokeStyle = "#808";
			if (this.parent.spawns.includes(this.parent.strips.indexOf(this))) {
				ctx.strokeStyle = "#0F0";
			}
			drawWorldLine([this.x, this.y, this.z], [this.x + cXYZ[0], this.y + cXYZ[1], this.z + cXYZ[2]]);

			//end spawn
			ctx.strokeStyle = "#808";
			if (this.parent.endSpawns.includes(this.parent.strips.indexOf(this))) {
				ctx.strokeStyle = "#0F0";
			}
			drawWorldLine([this.x + dXYZ[0], this.y + dXYZ[1], this.z + dXYZ[2]], [this.x + dXYZ[0] + cXYZ[0], this.y + dXYZ[1] + cXYZ[1], this.z + dXYZ[2] + cXYZ[2]]);
		}
	}

	beDrawn_Tiles() {
		this.realTiles.forEach(t => {
			if (t.playerDist < render_maxColorDistance + t.size || (t.size / t.cameraDist) * world_camera.scale > render_minTileSize) {
				t.beDrawn();
			}
		});
	}

	beDrawn_TilesReversed() {
		this.realsBackwards.forEach(t => {
			if (t.playerDist < render_maxColorDistance + t.size || (t.size / t.cameraDist) * world_camera.scale > render_minTileSize) {
				t.beDrawn();
			}
		});
	}

	//makes drawing / ticking self tiles slightly faster
	establishReals() {
		this.realTiles = [];
		this.realsBackwards = [];
		for (var t=0; t<this.tiles.length; t++) {
			if (this.tiles[t] != undefined) {
				this.tiles[t].isReal = false;

				//if the tile isn't a plexiglass tile (or it is a plexiglass tile and the player's a pastafarian)
				if ((this.tiles[t].minStrength == undefined || player.personalBridgeStrength != undefined)) {
					this.tiles[t].isReal = true;
					this.realTiles.push(this.tiles[t]);
					this.realsBackwards.splice(0, 0, this.tiles[t]);

					
				}
			}
		}
	}

	reset() {
		this.establishReals();
		//reset all tiles
		this.realTiles.forEach(t => {
			if (t.constructor.name ==  "Tile_Crumbling") {
				t.reset();
			}
		});
	}

	tick() {
		//setting camera distance
		this.cameraDist = getDistance(this, world_camera);
		this.playerDist = getDistance(this, player);
		this.realTiles.forEach(t => {
			t.tick();
		});
	}
}



class Wormhole {
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;

		//space-bending properties
		this.r = 6000;
		this.drawR = 1;
		this.screenPos = [];
		this.arcAtRadius = 0.8;
		this.maxRadiusMult = 4;
	}

	beDrawn() {
		drawCircle("#F0F", this.screenPos[0], this.screenPos[1], this.drawR);
	}

	tick() {
		if (!isClipped([this.x, this.y, this.z])) {
			this.screenPos = spaceToScreen([this.x, this.y, this.z]);
		} else {
			this.screenPos = [-1e7, -1e7];
		}
		this.drawR = (this.r / getDistance(this, world_camera)) * world_camera.scale;
	}
}