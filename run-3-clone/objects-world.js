

/*this is what happens when you refuse to use a real 3d renderer and instead hack together a bunch of 
special cases and rendering tricks,then months later are forced to confront putting real 3d objects into your program.
Don't do what I did, be smart.

I should have used quaternions.

If I come back to this project later I'll convert all the euler angles to quaternions, because that would solve a lot of problems. 
It would also allow a revamp of the galaxy map, tunnels pointing up/down, so many cool things! I'm getting ahead of myself, sorry
*/
class Boat {
	constructor(x, y, z, theta, phi) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	beDrawn() {

	}

	doComplexLighting() {

	}

	generate() {

	}

	tick() {

	}
}






class FreePoly {
	constructor(points, color) {
		this.x;
		this.y;
		this.z;
		this.points = points;
		this.normal = [0, 0];
		this.color = color;
		this.cameraDist = render_maxColorDistance + 1;
		this.playerDist = render_maxColorDistance + 1;

		//collision tolerance
		this.tolerance = player.r * 0.76;
		this.normal = calculateNormal(this.points);
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
		if (spaceToRelativeRotless([world_camera.x, world_camera.y, world_camera.z], [this.x, this.y, this.z], [cross[0], cross[1]])[2] < 0) {
			cross[0] = (cross[0] + Math.PI) % (Math.PI * 2);
		}
		this.normal = [cross[0], cross[1]];
	}

	collideWithEntity(entity) {
		//transform player to self's coordinates
		var entityCoords = spaceToRelativeRotless([entity.x, entity.y, entity.z], [this.x, this.y, this.z], this.normal);

		//if the player is colliding, do collision stuffies
		if (Math.abs(entityCoords[2]) < this.tolerance && Math.abs(entityCoords[0]) < (this.size / 2) + this.tolerance && Math.abs(entityCoords[1]) < (this.size / 2) + this.tolerance) {
			var temp = entityCoords[2];
			//different behavior depending on side
			if (entityCoords[2] < 0) {
				//outside the tunnel
				entityCoords[2] = -1 * this.tolerance;
			} else {
				//inside the tunnel
				entityCoords[2] = this.tolerance;
				//r o t a t e   P D F
				if (!haltCollision && (entity.dir_down[0] != this.dir_down[0] || entity.dir_down[1] != this.dir_down[1])) {
					this.doRotationEffects(entity);
				}

				//special collision effects in general
				this.doCollisionEffects(entity);

				//slow entity down if the movement has jumped them too far
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

	//clips self and returns an array with two polygons, clipped at the input plane.
	//always returns [polygon inside plane, polgyon outside plane]
	//if self polygon does not intersect the plane, then one of the two return values will be undefined.
	clipAtPlane(planePoint, planeNormal) {
		var inPart = undefined;
		var outPart = undefined;

		//getting points aligned to the plane
		var tempPoints = [];
		for (var j=0;j<this.points.length;j++) {
			tempPoints.push(spaceToRelative(this.points[j], planePoint, planeNormal));
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

	beDrawn() {
		drawWorldPoly(this.points, this.getColor());
		if (editor_active) {
			//draw self's normal as well
			var cXYZ = polToCart(this.normal[0], this.normal[1], 5);
			cXYZ = [this.x + cXYZ[0], this.y + cXYZ[1], this.z + cXYZ[2]];
			ctx.lineWidth = 2;
			ctx.strokeStyle = "#AFF";
			drawWorldLine([this.x, this.y, this.z], cXYZ);
		}
	}
}

class OneTimeCutsceneTrigger {
	constructor(parent, tile, flipCheckDirectionBOOLEAN, cutsceneDataSTRING) {
		this.parent = parent;
		this.x = this.parent.x;
		this.y = this.parent.y;
		this.z = this.parent.z;
		this.tile = tile;
		this.checkPrevious = flipCheckDirectionBOOLEAN;
		this.temporary = false;

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
			setTimeout(() => {
				loading_state = new State_Cutscene(eval(`cutsceneData_${this.cutscene}`));
				this.parent.resetWithoutPlayer();
			}, 1);
		}
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
		this.temporary = false;
	}

	calculatePoints() {
		this.points = [[-1, -1, 1], [-1, 1, -1], [1, -1, -1], [1, 1, 1]];
		for (var y=0; y<this.points.length; y++) {
			this.points[y] = transformPoint(this.points[y], [this.x, this.y, this.z], this.normal, this.size);
		}
	}

	doComplexLighting() {
		getDistance_LightSource(this);
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

class Ring {
	constructor(x, y, z, theta, phi, radius) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.theta = theta;
		this.phi = phi;
		this.r = radius;
		this.width = 2;
		this.resolution = 12;
		this.color = RGBtoHSV(color_ring);

		this.points = [];
		this.calculatePoints();
	}

	calculatePoints() {
		this.points = [];
		for (var p=0; p<this.resolution; p++) {
			this.points.push([Math.cos((Math.PI * 2 * p) / this.resolution), 0, Math.sin((Math.PI * 2 * p) / this.resolution)]);
		}

		this.points.forEach(p => {
			transformPoint(p, [this.x, this.y, this.z], [this.theta, this.phi], this.r);
		});
	}

	doComplexLighting() {
		getDistance_LightSource(this);
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

				//correcting smear amount if it's too small to display the star correctly
				if (smearAmount < 1) {
					//length = pi2r * (2pi / )
				}

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
	constructor(parent, strip, tile, character, cutsceneDataSTRING) {
		this.parent = parent;
		this.x;
		this.y;
		this.z;
		this.tile = tile;
		this.strip = strip;
		this.temporary = true;

		this.cutscene = cutsceneDataSTRING;
		this.cameraDist = 1000;
		try {
			this.texture = new Texture(data_sprites[character].sheet, data_sprites.spriteSize, 1e1001, false, false, data_sprites[character].back);
		} catch (error) {
			this.texture = new Texture(data_sprites["Runner"].sheet, 1, 1e1001, false, false, [[0, 0]]);
		}
		
		this.textureRot = 0;

		this.placeSelf();
	}

	activateCutscene() {
		//put cutscene in the 'activated cutscenes' array
		if (!data_persistent.effectiveCutscenes.includes(this.cutscene)) {
			data_persistent.effectiveCutscenes.push(this.cutscene);
		}
		setTimeout(() => {
			loading_state = new State_Cutscene(eval(`cutsceneData_${this.cutscene}`));
			this.parent.resetWithoutPlayer();
		}, 10);
	}

	placeSelf() {
		var targetTile = this.parent.strips[this.strip].tiles[this.tile];
		var offset = polToCart(targetTile.dir_down[0], targetTile.dir_down[1] + Math.PI, player_radius * 5);
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

class StaticCharacterPermanent extends StaticCharacter {
	constructor(parent, strip, tile, character, cutsceneDataSTRING) {
		super(parent, strip, tile, character, cutsceneDataSTRING);
		this.temporary = false;
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
		this.powerPrevious = power;
		this.powerTime = 0;

		this.sides = sides;
		this.len = lengthInTiles;
		this.data = data;
		this.spawns = spawns;
		this.endSpawns = endSpawns;
		this.hasSetEndSpawns = this.endSpawns.length > 0;
		this.strips = [];
		this.freeObjs = [];
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

		this.generateTiles();
		//stop rendering individual tiles when they're less than 1 unit per tile
		this.maxTileRenderDist = Math.min(render_maxDistance, (this.tileSize / 2) * world_camera.scale);

		//map stuffies
		this.map_startCoords = spaceToScreen([this.x, this.y, this.z]);
		this.map_circleCoords = spaceToScreen([this.centerPos[0], this.centerPos[1], this.centerPos[2]]);
		this.map_endCoords = spaceToScreen([this.endPos[0], this.endPos[1], this.endPos[2]]);
	}

	beDrawn() {
		if (this == player.parentPrev) {
			this.beDrawn_playerParent();
			return;
		}
		//if player is close enough, draw individual tiles. If not, draw a thin line
		if (this.cameraDist < this.maxTileRenderDist) {
			//only draw self in detail if corners aren't clipped
			if (spaceToRelativeRotless([this.x, this.y, this.z], [world_camera.x, world_camera.y, world_camera.z], [world_camera.theta, world_camera.phi])[2] + this.r > 0 || 
				spaceToRelativeRotless(this.endPos, [world_camera.x, world_camera.y, world_camera.z], [world_camera.theta, world_camera.phi])[2] + this.r > 0) {
				
				//detail level is also distance gated
				if (this.cameraDist - (this.len * this.tileSize) <= render_maxColorDistance) {
					this.beDrawn_HighDetail();
					return;
				}
				this.beDrawn_MediumDetail();
			}
			return;
		}
		//draw self as a line
		this.beDrawn_LowDetail();
	}

	beDrawn_playerParent() {
		var tunnelSize = this.strips.length;
		var tunnelStrip = getClosestObject(this.strips);

		//organize strips based around that
		var trackL = tunnelStrip - Math.floor(tunnelSize / 2);
		var trackR = tunnelStrip + Math.floor(tunnelSize / 2);
		var drawPlayer = true;
		var stripsDrawn = 0;
		
		//if the size is even, trackL has to be one less than trackR
		//farthest strip + setting variables
		if (tunnelSize % 2 == 0) {
			if (!this.strips[(tunnelStrip + (tunnelSize / 2)) % tunnelSize]) {
				drawPlayer = false;
				player.beDrawn();
			}
			this.strips[(tunnelStrip + (tunnelSize / 2)) % tunnelSize].beDrawn();
			stripsDrawn += 1;
			trackL = tunnelStrip - ((tunnelSize / 2) - 1);
			trackR = tunnelStrip + (tunnelSize / 2) - 1;
		}


		//back faces
		while (stripsDrawn <= Math.floor(tunnelSize / 2)) {
			if (stripsDrawn % 2 == 0) {
				if (drawPlayer) {
					if (!this.strips[trackR % tunnelSize].playerIsOnTop()) {
						drawPlayer = false;
						player.beDrawn();
					}
				}
				this.strips[trackR % tunnelSize].beDrawn();
				trackR -= 1;
			} else {
				if (drawPlayer) {
					if (!this.strips[(trackL + tunnelSize) % tunnelSize].playerIsOnTop()) {
						drawPlayer = false;
						player.beDrawn();
					}
				}
				this.strips[(trackL + tunnelSize) % tunnelSize].beDrawn();
				trackL += 1;
			}
			stripsDrawn += 1;
		}

		//if the camera is outside the tunnel do the hybrid approach. If not, do the normal way.
		if (!this.coordinateIsInTunnel(world_camera.x, world_camera.y, world_camera.z)) {
			this.freeObjs.forEach(f => {
				f.beDrawn();
			});
			stripsDrawn += 1000;
		}

		//front faces
		while (stripsDrawn < tunnelSize - 1 || (stripsDrawn > 999 && stripsDrawn < tunnelSize + 999)) {
			if (stripsDrawn % 2 == 0) {
				if (drawPlayer) {
					if (!this.strips[trackR % tunnelSize].playerIsOnTop()) {
						drawPlayer = false;
						player.beDrawn();
					}
				}
				this.strips[trackR % tunnelSize].beDrawn();
				trackR -= 1;
			} else {
				if (drawPlayer) {
					if (!this.strips[(trackL + tunnelSize) % tunnelSize].playerIsOnTop()) {
						drawPlayer = false;
						player.beDrawn();
					}
				}
				this.strips[(trackL + tunnelSize) % tunnelSize].beDrawn();
				trackL += 1;
			}
			stripsDrawn += 1;
		}

		

		//final strip
		if (drawPlayer && !this.strips[tunnelStrip].playerIsOnTop()) {
			drawPlayer = false;
			player.beDrawn();
		}
		this.strips[tunnelStrip].beDrawn();
		stripsDrawn += 1;

		//if the free objects still aren't drawn, draw them
		if (stripsDrawn == tunnelSize) {
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

	beDrawn_HighDetail() {
		//copy + modify from playerParent
		var tunnelStrip = getClosestObject(this.strips);
		var trackL = tunnelStrip - Math.floor(this.strips.length / 2);
		var trackR = tunnelStrip + Math.floor(this.strips.length / 2);
		var stripsDrawn = 0;
		
		if (this.strips.length % 2 == 0) {
			this.strips[(tunnelStrip + (this.strips.length / 2)) % this.strips.length].beDrawn();
			stripsDrawn += 1;
			trackL = tunnelStrip - ((this.strips.length / 2) - 1);
			trackR = tunnelStrip + (this.strips.length / 2) - 1;
		}


		//tunnel part 1
		while (stripsDrawn <= Math.floor(this.strips.length / 2)) {
			if (stripsDrawn % 2 == 0) {
				this.strips[trackR % this.strips.length].beDrawn();;
				trackR -= 1;
			} else {
				this.strips[(trackL + this.strips.length) % this.strips.length].beDrawn();;
				trackL += 1;
			}
			stripsDrawn += 1;
		}

		//if the camera is outside the tunnel do the hybrid approach. If not, do the normal way.
		if (!this.coordinateIsInTunnel(world_camera.x, world_camera.y, world_camera.z)) {
			this.freeObjs.forEach(f => {
				f.beDrawn();
			});
			stripsDrawn += 1000;
		}

		//tunnel part 2
		while (stripsDrawn < this.strips.length - 1 || (stripsDrawn > 999 && stripsDrawn < this.strips.length + 999)) {
			if (stripsDrawn % 2 == 0) {
				try {
					this.strips[trackR % this.strips.length].beDrawn();
				} catch (er) {
					console.log(trackR);
				}
				trackR -= 1;
			} else {
				this.strips[(trackL + this.strips.length) % this.strips.length].beDrawn();;
				trackL += 1;
			}
			stripsDrawn += 1;
		}

		this.strips[tunnelStrip].beDrawn();
		stripsDrawn += 1;

		//if the free objects still aren't drawn, draw them
		if (stripsDrawn == this.strips.length) {
			this.freeObjs.forEach(f => {
				f.beDrawn();
			});
		}
	}

	beDrawn_MediumDetail() {
		//draw all strips, nothing too fancy
		this.strips.forEach(s => {
			s.beDrawn_Line();
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

	coordinateIsInTunnel(x, y, z) {
		//rotate by tunnel theta
		x -= this.x;
		y -= this.y;
		z -= this.z;
		[x, z] = rotate(x, z, this.theta * -1);

		//actually making a polygon and checking that is faster than checking with the 3d strips
		var polyPoints = [];
		for (var a=0; a<this.sides; a++) {
			polyPoints.push([this.r * Math.cos(((Math.PI * 2) / this.sides) * (a - 0.5)), this.r * Math.sin(((Math.PI * 2) / this.sides) * (a - 0.5))]);
		}

		return inPoly([x, y], polyPoints);
	}

	doComplexLighting() {
		//loop through all tiles
		this.strips.forEach(s => {
			s.realTiles.forEach(t => {
				t.doComplexLighting();
			});
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
				var value = 0;
				try {
					value = this.data[t][a]
				} catch(e) {
					//I really don't care if there's no data. If I start to care later I'll change this
				}
				//if at the end and is a tile, add to end spawns
				if (!this.hasSetEndSpawns && a >= this.len - 2 && value > 0) {
					if (!this.endSpawns.includes(t)) {
						this.endSpawns.push(t);
					}
				}
				var tileCoordinates = this.worldPositionOfTile(t, a+1);
				loadingStrip.tiles.push(this.generateTile(value, tileCoordinates[0], tileCoordinates[1], tileCoordinates[2], this.tileSize, stripNormal, [t, a], this.color));
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
		//generate plexiglass tiles afterwords
		this.generatePlexies();
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
								//other bridge tiles cannot give strength
								if (this.strips[realStrip].tiles[y] instanceof Tile && !(this.strips[realStrip].tiles[y] instanceof Tile_Plexiglass)) {
									//if there's a tile there, the strength that tile gives is proportional to the distance to that tile
									var distance = (Math.abs(x - s) + Math.abs(y - t)) * this.tileSize;

									//upgrade strength is necessary
									tileStrength = Math.max(tileStrength, 1 - (distance / physics_maxBridgeDistance));
								}
							}
						}
					}

					tileStrength = tileStrength * tileStrength;
					//only create tile if strength is great enough
					if (tileStrength > 0.01) {
						var tileCoords = this.worldPositionOfTile(s, t+1);
						this.strips[s].tiles[t] = new Tile_Plexiglass(tileCoords[0], tileCoords[1], tileCoords[2], this.tileSize, this.strips[s].normal, this, [s, t], this.color, tileStrength);
					}
				}
			}
			this.strips[s].establishReals();
		}
	}

	//generates a single tile from parameters
	generateTile(type, x, y, z, size, normal, position, color) {
		switch(type) {
			case 1:
				return new Tile(x, y, z, size, normal, this, position, color);
			case 2:
				return new Tile_Bright(x, y, z, size, normal, this, position, color);
			case 3:
				return new Tile_Crumbling(x, y, z, size, normal, this, position, color);
			case 4:
				return new Tile_Ice(x, y, z, size, normal, this, position);
			case 5:
				return new Tile_Conveyor_Slow(x, y, z, size, normal, this, position);
			case 6:
				return new Tile_Conveyor(x, y, z, size, normal, this, position);
			case 7:
				return new Tile_Conveyor_Left(x, y, z, size, normal, this, position);
			case 8:
				return new Tile_Conveyor_Right(x, y, z, size, normal, this, position);
			case 9: 
				return new Tile_Box(x, y, z, size, normal, this, position);
			case 10:
				return new Tile_Box_Spun(x, y, z, size, normal, this, position);
			case 11:
				return new Tile_Ramp(x, y, z, size, normal, this, position, color);
			case 12: 
				return new Tile_Ice_Ramp(x, y, z, size, normal, this, position, color);
			case 13:
				return new Tile_Movable(x, y, z, size, normal, this, position, color);
			case 14: 
				return new Tile_Box_Ringed(x, y, z, size, normal, this, position);
			case 15:
				return new Tile_Warning(x, y, z, size, normal, this, position);
			default:
				return undefined;
		}
	}

	getCameraDist() {
		//keep track of distance from camera, use all 3 points
		this.cameraDist = Math.min(getDistance(this, {x:world_camera.targetX, y:world_camera.targetY, z:world_camera.targetZ}),
								getDistance({x:this.centerPos[0], y:this.centerPos[1], z:this.centerPos[2]}, {x:world_camera.targetX, y:world_camera.targetY, z:world_camera.targetZ}),
								getDistance({x:this.endPos[0], y:this.endPos[1], z:this.endPos[2]}, {x:world_camera.targetX, y:world_camera.targetY, z:world_camera.targetZ}));
	}

	giveStringData() {
		//TODO: support function output
		//TODO: support banned character output
		var output = ``;
		//non-tile position features
		output += `id~${this.id}`;
		output += `|pos-x~${this.x.toFixed(4)}`;
		output += `|pos-z~${this.z.toFixed(4)}`;
		output += `|direction~${this.theta.toFixed(4)}`;
		output += `|layout-tunnel~${this.sides}~${this.tilesPerSide}`;
		output += `|color~${HSVtoRGB(this.color)}`;
		output += `|tileWidth~${this.tileSize}`;
		this.spawns.forEach(s => {
			output += `|spawn~${s}`;
		});

		this.endSpawns.forEach(s => {
			output += `|endSpawn~${s}`;
		});

		//tile data
		this.repairData();

		output += tunnelData_parseDataReverse(this.data);

		//functions

		//banned characters

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


		//if player is using duplicator, make sure to remove all duplicates
		if (player.duplicates != undefined) {
			player.duplicates = [player];
			player.duplicateGenerationCountup = 0;
		} else if (player.personalBridgeStrength != undefined) {
			//if player is using pastafarian, reset their bridge strength
			player.personalBridgeStrength = 1;
		}

		var offsetCoords = polToCart(spawnObj.normal[0], spawnObj.normal[1], 10);
		player.x = spawnObj.x + offsetCoords[0];
		player.y = spawnObj.y + offsetCoords[1];
		player.z = spawnObj.z + offsetCoords[2];
		player.dz = 0;
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
			if (gentlemanToggle) {
				this.freeObjs[this.freeObjs.length-1].temporary = true;
			}
		}
	}

	//returns true if the player is inside the tunnel, and false if the player is not
	playerIsInTunnel() {
		//rotate by tunnel theta
		var newCoords = [player.x - this.x, player.y - this.y, player.z - this.z];
		[newCoords[0], newCoords[2]] = rotate(newCoords[0], newCoords[2], this.theta * -1);
		if (newCoords[2] < 0 || newCoords[2] > (this.len * this.tileSize)) {
			//if the player is out of the tunnel in the z direction
			return false;
		}

		//actually making a polygon and checking that is faster than checking with the 3d strips
		var polyPoints = [];
		for (var a=0; a<this.sides; a++) {
			polyPoints.push([this.r * Math.cos(((Math.PI * 2) / this.sides) * (a - 0.5)), this.r * Math.sin(((Math.PI * 2) / this.sides) * (a - 0.5))]);
		}

		return inPoly([newCoords[0], newCoords[1]], polyPoints);
	}

	//returns true if the player is inside the tunnel bounds; this is what's used to check for killing the player 
	playerIsInBounds() {
		var newCoords = [player.x - this.x, player.y - this.y, player.z - this.z];
		//rotating by tunnel theta
		[newCoords[0], newCoords[2]] = rotate(newCoords[0], newCoords[2], this.theta * -1);

		//update where the player is
		this.playerTilePos = newCoords[2] / this.tileSize;

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
		this.executing = -1;
		this.power = this.powerBase;
		this.powerPrevious = this.powerBase;
		this.powerTime = 0;

		//reset all crumbling tiles
		this.strips.forEach(a => {
			a.reset();
		});

		//remove any temporary objects
		for (var u=0; u<this.freeObjs.length; u++) {
			if (this.freeObjs[u].temporary == true) {
				this.freeObjs.splice(u, 1);
				u -= 1;
			}
		}
		//add powercells if gentleman exists
		if (this.freeObjs.length == 0) {
			if (player instanceof Gentleman) {
				this.placePowercells();
			}
		}
	}

	tick() {
		this.getCameraDist();
		//only bother with collision and all that jazz if it's close enough to matter
		if (this.cameraDist < this.maxTileRenderDist) {
			//update where player is
			var newCoords = [player.x - this.x, player.y - this.y, player.z - this.z];
			[newCoords[0], newCoords[2]] = rotate(newCoords[0], newCoords[2], this.theta * -1);
			this.playerTilePos = newCoords[2] / this.tileSize;

			this.strips.forEach(s => {
				s.tick();
			});

			
			this.reverseOrder = false;
			//if the camera direction is closely aligned with the tunnel direction, reverse the order of the tiles for proper layering
			if (modularDifference((Math.PI * 2) - world_camera.theta, this.theta, Math.PI * 2) < Math.PI / 2) {
				this.reverseOrder = true;
			}
			haltCollision = false;

			//handling functions
			if (player.parent == this && this.functions.length > 0) {
				//if the player is at the next function, switch which one is being executed
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

			//order power cells
			this.freeObjs = orderObjects(this.freeObjs, 5);

			//tick power cells
			this.freeObjs.forEach(f => {
				f.tick();
			});
		}
	}

	handleMouseDown() {
		//default case, go into the level
		if (!editor_active) {
			setTimeout(() => {
				//ordering all the objects
				world_objects.forEach(u => {
					u.getCameraDist();
				});
				world_objects = orderObjects(world_objects, 8);
				player.parentPrev = this;
				loading_state = new State_Game();
				player.parentPrev.reset();

				//displaying text
				loading_state.text = this.id;
				loading_state.time = tunnel_textTime;
			}, 10);
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
		this.generateTiles();

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
		//line, then tiles
		this.beDrawn_LineFar();
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

	beDrawn_LineFar() {
		var lineDown = false;
		var lineStart = undefined;

		ctx.lineWidth = render_minTileSize * 1.25;
		ctx.strokeStyle = "#000";

		for (var t=0; t<this.realTiles.length; t++) {
			if (lineDown) {
				//if the line is down, check distance to last real tile. If it's more than 1, end line
				if (this.realTiles[t].parentPosition[1] - this.realTiles[t-1].parentPosition[1] > 1 || this.realTiles[t].playerDist < render_maxColorDistance * 1.15 || this.realTiles[t].strength != undefined) {
					lineDown = false;
					drawWorldLine([this.realTiles[lineStart].x, this.realTiles[lineStart].y, this.realTiles[lineStart].z], [this.realTiles[t-1].x, this.realTiles[t-1].y, this.realTiles[t-1].z]);

					//afterwords, restart line
					if (this.realTiles[t].playerDist >= render_maxColorDistance * 1.15 && !(this.realTiles[t].fallStatus > 100) && this.realTiles[t].strength == undefined) {
						lineDown = true;
						lineStart = t;
					}
				}
			} else {
				if (this.realTiles[t].playerDist >= render_maxColorDistance * 1.15 && !(this.realTiles[t].fallStatus > 100) && this.realTiles[t].strength == undefined) {
					//if the line isn't down, start the line
					lineDown = true;
					lineStart = t;
				}
			}
		}

		//if a line is still down work backwards and end it
		if (lineDown) {
			drawWorldLine([this.realTiles[lineStart].x, this.realTiles[lineStart].y, this.realTiles[lineStart].z], 
						[this.realTiles[this.realTiles.length-1].x, this.realTiles[this.realTiles.length-1].y, this.realTiles[this.realTiles.length-1].z]);
		}

		ctx.lineWidth = 2;
	}

	beDrawn_Line() {
		var lineDown = false;
		var lineStart = undefined;
		//draw self but only the line part
		ctx.lineWidth = render_minTileSize * 1.25;
		ctx.strokeStyle = "#000";

		for (var t=0; t<this.realTiles.length; t++) {
			if (lineDown) {
				//if the line is down, check distance to last real tile. If it's more than 1, end line
				if (this.realTiles[t].parentPosition[1] - this.realTiles[t-1].parentPosition[1] > 1) {
					drawWorldLine([this.realTiles[lineStart].x, this.realTiles[lineStart].y, this.realTiles[lineStart].z], [this.realTiles[t-1].x, this.realTiles[t-1].y, this.realTiles[t-1].z]);
					lineStart = t;
				}
			} else {
				lineDown = true;
				lineStart = t;
			}
		}
		
		if (lineStart != undefined) {
			drawWorldLine(lineStart, [this.realTiles[this.realTiles.length-1].x, this.realTiles[this.realTiles.length-1].y, this.realTiles[this.realTiles.length-1].z]);
		}
		ctx.lineWidth = 2;
	}

	beDrawn_Tiles() {
		this.realTiles.forEach(t => {
			if (t.playerDist < render_maxColorDistance * 1.1 || (t.size / t.cameraDist) * world_camera.scale > render_minTileSize) {
				t.beDrawn();
			}
		});
	}

	beDrawn_TilesReversed() {
		this.realsBackwards.forEach(t => {
			if (t.playerDist < render_maxColorDistance * 1.1 || (t.size / t.cameraDist) * world_camera.scale > render_minTileSize) {
				t.beDrawn();
			}
		});
	}

	collideWithEntity(entity) {
		this.realTiles.forEach(r => {
			r.collideWithEntity(entity);
		});
	}

	//makes drawing / ticking self tiles slightly faster
	establishReals() {
		this.realTiles = [];
		this.realsBackwards = [];
		this.tiles.forEach(t => {
			if (t != undefined) {
				t.isReal = false;

				//if the tile isn't a plexiglass tile (or it is a plexiglass tile and the player's a pastafarian)
				if ((t.minStrength == undefined || player.personalBridgeStrength != undefined)) {
					t.isReal = true;
					this.realTiles.push(t);
					this.realsBackwards.splice(0, 0, t);
				}
			}
		});
	}

	reset() {
		this.establishReals();
		//reset all tiles
		this.realTiles.forEach(t => {
			if (t instanceof Tile_Crumbling) {
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