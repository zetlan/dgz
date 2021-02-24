class FreePoly {
	constructor(points, color) {
		this.x;
		this.y;
		this.z;
		this.points = points;
		this.normal = [0, 0];
		this.dir_tunnel = 0;
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
			ctx.beginPath();
			ctx.lineWidth = 2;
			ctx.strokeStyle = "#AFF";
			drawWorldLine([this.x, this.y, this.z], cXYZ);
		}
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
		this.friction = 0.86;
		
		this.playerDist = 1000;
		this.cameraDist = 1000;

		this.succ = false;
	}

	calculatePoints() {
		this.points = [[-1, -1, 1], [-1, 1, -1], [1, -1, -1], [1, 1, 1]];
		for (var y=0; y<this.points.length; y++) {
			this.points[y] = transformPoint(this.points[y], [this.x, this.y, this.z], this.normal, this.size);
		}
	}

	tick() {
		this.playerDist = getDistance(this, player);
		this.cameraDist = getDistance(this, world_camera);
		this.normal[0] += this.normalSpin[0];
		this.normal[1] += this.normalSpin[1];

		//modifying coordinates
		
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
						loading_state.powercells += 1;
						loading_state.characterData[player.constructor.name].powercells += 1;

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
				
				this.pushForce[0] += ((player.x - this.x) / this.playerDist) * 2.2;
				this.pushForce[1] += ((player.y - this.y) / this.playerDist) * 2.2;
				this.pushForce[2] += ((player.z - this.z) / this.playerDist) * 2.2;
			}
			
			//moving along tunnel
			this.x += this.pushForce[0];
			this.y += this.pushForce[1];
			this.z += this.pushForce[2];

			//if off the edge of the tunnel, put self back and set force to net 0
			if (spaceToRelativeRotless([this.x, this.y, this.z], this.parent.endPos, [this.parent.theta, 0])[2] > 0) {
				this.pushForce = [0, 0, 0];
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
	
			drawCircle(this.color, tX, tY, this.drawR);
		}
	}
}

class Star_Lizard extends Star {
	constructor(x, y, z) {
		super(x, y, z);
		this.r = 1;
		this.drawR;
		this.texture = new Texture(getImage(data_sprites.Lizard.sheet), data_sprites.spriteSize, 1e1001, false, false, data_sprites.Lizard.front);
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





class Tunnel {
	//so much data here, it's a mess, but oh well
	constructor(angle, color, data, id, lengthInTiles, power, powerFunctions, sides, spawns, tilesPerSide, tileSize, x, z) {
		this.x = x;
		this.y = 0;
		this.z = z;
		this.theta = angle;
		this.phi = 0;

		this.id = id;

		this.color = color;
		this.cameraDist = 1000;

		this.discovered = false;

		this.playerTilePos = 0;
		this.power = power;
		this.powerBase = power;
		this.powerExecuting = -1;
		this.powerPrevious = power;
		this.powerFunctions = powerFunctions;
		this.powerTime = 0;

		this.sides = sides;
		
		this.len = lengthInTiles;
		this.data = data;
		this.spawns = spawns;
		this.endSpawns = [];
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
		//stop rendering individual tiles when they're less than 10 units per tile
		this.maxTileRenderDist = Math.min(render_maxDistance, (this.tileSize / 2) * world_camera.scale);

		//map stuffies
		this.map_startCoords = spaceToScreen([this.x, this.y, this.z]);
		this.map_circleCoords = spaceToScreen([this.centerPos[0], this.centerPos[1], this.centerPos[2]]);
		this.map_endCoords = spaceToScreen([this.endPos[0], this.endPos[1], this.endPos[2]]);
	}

	beDrawn() {
		//if player is close enough, draw individual tiles. If not, draw a thin line
		if (this.cameraDist < this.maxTileRenderDist) {
			//only draw self if corners aren't clipped
			if (!isClipped([this.x, this.y, this.z]) || !isClipped(this.endPos)) {
				//detail level is also distance gated
				if (this.cameraDist - this.len * this.tileSize > render_maxColorDistance) {
					this.beDrawn_MediumDetail();
				} else {
					this.beDrawn_HighDetail();
				}
			}
		} else {
			//draw self as a line
			this.beDrawn_LowDetail();
		}
	}

	beDrawn_HighDetail() {
		var tunnelStrip = getClosestObject(this.strips);

		var	trackL = tunnelStrip - Math.ceil((this.strips.length - 0.5) / 2);
		var	trackR = tunnelStrip + Math.floor((this.strips.length - 0.5) / 2);
		var trackTotal = 0;

		//draw far half, then free objects, then close half
		while (trackR > tunnelStrip && trackL < tunnelStrip && trackTotal < this.strips.length / 2) {
			this.strips[trackR % this.strips.length].beDrawn();
			this.strips[(trackL + this.strips.length) % this.strips.length].beDrawn();
			trackR -= 1;
			trackL += 1;
			trackTotal += 2;
		}

		this.freeObjs.forEach(f => {
			f.beDrawn();
		});

		while (trackR >= tunnelStrip && trackL <= tunnelStrip) {
			this.strips[trackR % this.strips.length].beDrawn();
			this.strips[(trackL + this.strips.length) % this.strips.length].beDrawn();
			trackR -= 1;
			trackL += 1;
		}
		if (editor_active && !isClipped([this.strips[tunnelStrip].x, this.strips[tunnelStrip].y, this.strips[tunnelStrip].z])) {
			var [tX, tY] = spaceToScreen([this.strips[tunnelStrip].x, this.strips[tunnelStrip].y, this.strips[tunnelStrip].z]);
			drawCircle("#FFF", tX, tY, 10);
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
				this.getCameraDist();
				ctx.lineWidth = ((this.r * 2) / this.cameraDist) * world_camera.scale;
			}
			ctx.moveTo(this.map_startCoords[0], this.map_startCoords[1]);
			ctx.lineTo(this.map_endCoords[0], this.map_endCoords[1]);
			ctx.stroke();
		}
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

	//I apologize in advance for any headaches this function causes.
	//TODO: refactor this, create worldPositionOfTile([x, y]) function perhaps?
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
				if (a == this.len - 1 && value != 0) {
					this.endSpawns.push(t);
				}
				var tileCoordinates = this.worldPositionOfTile(t, a+1);
				loadingStrip.tiles.push(this.generateTile(value, tileCoordinates[0], tileCoordinates[1], tileCoordinates[2], this.tileSize, stripNormal, [t, a], this.color));
			}
			loadingStrip.establishReals();
			this.strips.push(loadingStrip);
		}
		if (this.endSpawns.length == 0) {
			console.log(`oh no! No tiles at the end for tunnel ${this.id}`);
		}
		if (this.spawns.length == 0) {
			console.log(`oh no! No spawns for tunnel ${this.id}`);
		}
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
							var realStrip = (x + (4 * this.strips.length)) % this.strips.length;
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
			case 0:
				return undefined;
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
			default:
				return new Tile(x, y, z, size, normal, this, position, color);
		}
	}

	getCameraDist() {
		//keep track of distance from camera, use all 3 points
		this.cameraDist = Math.min(getDistance(this, {x:world_camera.targetX, y:world_camera.targetY, z:world_camera.targetZ}),
								getDistance({x:this.centerPos[0], y:this.centerPos[1], z:this.centerPos[2]}, {x:world_camera.targetX, y:world_camera.targetY, z:world_camera.targetZ}),
								getDistance({x:this.endPos[0], y:this.endPos[1], z:this.endPos[2]}, {x:world_camera.targetX, y:world_camera.targetY, z:world_camera.targetZ}));
	}

	placePlayer() {
		var spawnObj;
		var spawnChoice;
		if (player.backwards) {
			//choosing randomly from spawns 
			spawnChoice = this.endSpawns[Math.floor(randomBounded(0, this.endSpawns.length-1))];
			spawnObj = this.strips[spawnChoice].tiles[this.strips[spawnChoice].tiles.length-1];
		} else {
			//choose randomly from spawns
			spawnChoice = this.spawns[Math.floor(randomBounded(0, this.spawns.length-1))];
			var tolerance = 0;

			//make sure the spawn chosen has a tile there, have to sanitize since it comes from the old data set
			while (this.strips[spawnChoice].tiles[0] == undefined && tolerance < this.strips.length) {
				spawnChoice = (spawnChoice + 1) % (this.strips.length);
				tolerance += 1;
			}

			//placing player on that tile
			spawnObj = this.strips[spawnChoice].tiles[0];
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
			this.discovered = true;
			return true;
		}
		return false;
	}

	reset() {
		this.placePlayer();
		this.resetWithoutPlayer();
	}

	resetWithoutPlayer() {
		//misc tunnel things
		this.playerTilePos = 0;
		this.powerExecuting = -1;
		this.power = this.powerBase;
		this.powerPrevious = this.powerBase;
		this.powerTime = 0;

		//reset all crumbling tiles
		this.strips.forEach(a => {
			a.reset();
		});
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
			//update whether strips should draw backwards or forwards
			if (Math.abs(((Math.PI * 2) - world_camera.theta) - this.theta) < Math.PI / 2) {
				this.reverseOrder = true;
			}
			haltCollision = false;

			//switching power
			if (player.parent == this && this.powerFunctions.length > 0) {
				//if the player is at the next power function, switch which one is being executed
				if (this.powerFunctions[this.powerExecuting + 1] != undefined) {
					if (this.powerFunctions[this.powerExecuting + 1][0] <= this.playerTilePos) {
						this.powerExecuting += 1;
						this.powerPrevious = this.power;
						this.powerTime = 0;
					}
				}

				//if the power function is greater than -1 run it
				if (this.powerExecuting > -1) {
					this.power = tunnel_powerFunctions[this.powerFunctions[this.powerExecuting][2]](this.powerPrevious, this.powerFunctions[this.powerExecuting][1], this.powerTime);
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

	updatePosition(x, y, z) {
		//start
		this.x = x;
		this.y = y;
		this.z = z;

		//middle
		this.centerPos = [0, 0, (this.len / 2) * this.tileSize];
		[this.centerPos[0], this.centerPos[2]] = rotate(this.centerPos[0], this.centerPos[2], this.theta);
		this.centerPos = [this.centerPos[0] + this.x, this.centerPos[1] + this.y, this.centerPos[2] + this.z];

		//generating end
		this.endPos = [0, 0, this.len * this.tileSize];
		[this.endPos[0], this.endPos[2]] = rotate(this.endPos[0], this.endPos[2], this.theta);
		this.endPos = [this.endPos[0] + this.x, this.endPos[1] + this.y, this.endPos[2] + this.z];

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
		super(data.theta, RGBtoHSV(data.color), data.tileData, data.id, data.maxLen, data.power, data.powerFunctions, data.sides, data.spawns, data.tilesPerSide, data.tileSize, data.x, data.z);
		this.rawData = tunnelData;
	}

	giveStringData() {
		//TODO: refactor this, need a proper way to output tunnels for the level editor
		//split into array
		var splitData = this.rawData.split("|");
		var toReturn = ``;
		//add ID 
		toReturn += splitData[0];

		//add coordinates
		toReturn += `|pos-x:${Math.round(this.x)}`;
		toReturn += `|pos-z:${Math.round(this.z)}`;
		toReturn += `|direction:${this.theta.toFixed(4)}`;

		//add all other tags, subtract banned tags
		splitData.forEach(y => {
			if ((y.indexOf("id-") != 0) && (y.indexOf("pos-x:") != 0) && (y.indexOf("pos-z:") != 0) && (y.indexOf("direction:") != 0)) {
				toReturn += `|${y}`;
			}
		});

		return toReturn;
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
		this.requiresOrdering = false;
	}

	//returns true if the player should be drawn on top of the strip
	playerIsOnTop() {
		//first figure out the reference plane being used
		var playerRelPos = spaceToRelativeRotless([player.x, player.y, player.z], [this.x, this.y, this.z], this.normal);

		//if player is within self's intersection possibility, continue
		if (Math.abs(playerRelPos[1]) < (this.tileSize * 0.5) + player.r) { 
			//if no tile there, ignore the player
			if (this.tiles[Math.floor(this.parent.playerTilePos - 0.5)] == undefined) {
				return true;
			}

			//if there is a tile there, use the tile's coordinates
			return this.tiles[Math.floor(this.parent.playerTilePos - 0.5)].playerIsOnTop();
		}
		return true;
	}

	beDrawn() {
		//tiles, then line
		if (this.parent.reverseOrder) {
			this.beDrawn_TilesReversed();
		} else {
			this.beDrawn_Tiles();
		}
		this.beDrawn_LineFar();

		//debug
		if (editor_active) {
			var cXYZ = polToCart(this.normal[0], this.normal[1], 10);
			cXYZ = [this.x + cXYZ[0], this.y + cXYZ[1], this.z + cXYZ[2]];
			ctx.beginPath();
			ctx.lineWidth = 4;
			ctx.strokeStyle = "#F00";
			drawWorldLine([this.x, this.y, this.z], cXYZ);
		}
	}

	beDrawn_LineFar() {
		var lineDown = false;
		var lineStart = undefined;

		ctx.lineWidth = render_minTileSize * 1.25;
		ctx.strokeStyle = "#000";
		this.tiles.forEach(t => {
			//if it's a tile
			if (t != undefined) {
				//if it's small enough to not be drawn, start the line™
				if ((t.size / t.cameraDist) * world_camera.scale <= render_minTileSize) {
					if (!lineDown) {
						lineDown = true;
						lineStart = [t.x, t.y, t.z];
					}
				} else {
					//if drawing a line, end the line
					if (lineDown) {
						lineDown = false;
						drawWorldLine(lineStart, [t.x, t.y, t.z]);
					}
				}
			}
		});

		//if a line is still down work backwards and end it
		if (lineDown) {
			var n = this.tiles.length - 1;
			while (this.tiles[n] == undefined) {
				n -= 1;
			}

			lineDown = false;
			drawWorldLine(lineStart, [this.tiles[n].x, this.tiles[n].y, this.tiles[n].z]);
		}

		ctx.lineWidth = 2;
	}

	beDrawn_Line() {
		var lineDown = false;
		var lineStart = undefined;
		//draw self but only the line part
		ctx.lineWidth = render_minTileSize * 1.25;
		ctx.strokeStyle = "#000";
		this.tiles.forEach(t => {
			//if it's a tile
			if (t != undefined) {

				//if it's small enough to not be drawn, start the line™
				if ((t.size / t.cameraDist) * world_camera.scale <= render_minTileSize) {
					if (!lineDown) {
						lineDown = true;
						lineStart = [t.x, t.y, t.z];
					}
				} else {
					//if drawing a line, end the line
					if (lineDown) {
						lineDown = false;
						drawWorldLine(lineStart, [t.x, t.y, t.z]);
					}
				}
			}
		});
		ctx.lineWidth = 2;
	}

	beDrawn_Tiles() {
		this.realTiles.forEach(t => {
			if ((t.size / t.cameraDist) * world_camera.scale > render_minTileSize) {
				t.beDrawn();
			}
		});
	}

	beDrawn_TilesReversed() {
		for (var a=this.realTiles.length-1; a>=0; a--) {
			if ((this.realTiles[a].size / this.realTiles[a].cameraDist) * world_camera.scale > render_minTileSize) {
				this.realTiles[a].beDrawn();
			}
		}
	}

	collideWithEntity(entity) {
		this.realTiles.forEach(r => {
			r.collideWithEntity(entity);
		});
	}

	//makes drawing / ticking self tiles slightly faster
	establishReals() {
		this.realTiles = [];
		this.tiles.forEach(t => {
			//if the tile isn't undefined and it's not a plexiglass tile (or it is a plexiglass tile and the player's a pastafarian)
			if (t != undefined && (t.minStrength == undefined || player.personalBridgeStrength != undefined)) {
				this.realTiles.push(t);
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