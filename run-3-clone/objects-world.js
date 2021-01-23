class FreePoly {
	constructor(points, color) {
		this.x;
		this.y;
		this.z;
		this.points = points;
		this.normal;
		this.dir_tunnel = 0;
		this.color = color;
		this.cameraDist = render_maxColorDistance;

		//collision tolerance
		this.tolerance = player.dMax * 1.5;
		this.calculateNormal();

		this.collisionPoints = this.calculateCollision();
	}

	calculateCollision() {
		var temp = [];
		//looping through all points
		for (var u=0;u<this.points.length;u++) {
			//transform point to self's normal
			var transformed = spaceToRelative(this.points[u], [this.x, this.y, this.z], [this.normal[0], this.normal[1], 0]);

			//zs are going to be zero, so they can be ignored
			temp.push([transformed[0], transformed[1]]);
		}
		return temp;
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
		if (spaceToRelative([world_camera.x, world_camera.y, world_camera.z], [this.x, this.y, this.z], [cross[0], cross[1]])[2] < 0) {
			cross[0] = (cross[0] + Math.PI) % (Math.PI * 2);
		}
		this.normal = [cross[0], cross[1]];
	}

	collideWithPlayer() {
		//transform player to self's coordinates
		var playerCoords = spaceToRelative([player.x, player.y, player.z], [this.x, this.y, this.z], [this.normal[0], this.normal[1], 0]);

		//if the player is too close, take them seriously
		if (Math.abs(playerCoords[2]) < this.tolerance) {
			
			if (inPoly([playerCoords[0], playerCoords[1]], this.collisionPoints)) {
				//different behavior depending on side
				if (playerCoords[2] < 0) {
					playerCoords[2] = -1 * this.tolerance;
				} else {
					playerCoords[2] = this.tolerance;
				}

				//special collision effects for inside the tunnel
				if (!haltCollision && (player.dir_down[0] != this.normal[0] || player.dir_down[1] != this.normal[1])) {
					this.doCollideEffects();
				}

				//transforming back to regular coordinates
				playerCoords = relativeToSpace(playerCoords, [this.x, this.y, this.z], this.normal);

				//getting difference between actual player coordinates and attempted coords for forces
				playerCoords = [playerCoords[0] - player.x, playerCoords[1] - player.y, playerCoords[2] - player.z];
				//player.posBuffer.push(playerCoords);
				player.x += playerCoords[0];
				player.y += playerCoords[1];
				player.z += playerCoords[2];
			}
		}
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
		this.cameraDist = getDistance(this, world_camera);
		//collide correctly with player
		this.collideWithPlayer();
		
	}

	beDrawn() {
		//first get camera coordinate points
		var tempPoints = [];
		for (var p=0;p<this.points.length;p++) {
			tempPoints.push(spaceToRelative(this.points[p], [world_camera.x, world_camera.y, world_camera.z], [world_camera.theta, world_camera.phi, world_camera.rot]));
		}

		tempPoints = clipToZ0(tempPoints, render_clipDistance, false);
		
		//turn points into screen coordinates
		var screenPoints = [];
		for (var a=0;a<tempPoints.length;a++) {
			screenPoints.push(cameraToScreen(tempPoints[a]));
		}

		if (screenPoints.length > 0) {
			//finally draw self
			drawPoly(`hsl(${this.color.h}, ${linterp(this.color.s, 0, this.cameraDist / render_maxColorDistance)}%, ${linterp(70, 0, this.cameraDist / render_maxColorDistance)}%)`, screenPoints);
			//drawCircle("#FFF", screenPoints[0][0], screenPoints[0][1], 4);
			if (editor_active && !isClipped([[this.x, this.y, this.z]])) {
				//draw self's normal as well
				var dXY = spaceToScreen([this.x, this.y, this.z]);
				var cXYZ = polToCart(this.normal[0], this.normal[1], 5);
				var eXY = spaceToScreen([this.x + cXYZ[0], this.y + cXYZ[1], this.z + cXYZ[2]]);
				//var fXY = spaceToScreen(this.rPoint);
				ctx.beginPath();
				ctx.strokeStyle = "#AFF";
				ctx.fillStyle = "#AFF";
				//ctx.font = "20px Century Gothic";
				//ctx.fillText(this.dir_down.toFixed(2), dXY[0], dXY[1]);
				ctx.moveTo(dXY[0], dXY[1]);
				ctx.lineTo(eXY[0], eXY[1]);
				//ctx.moveTo(dXY[0], dXY[1]);
				//ctx.lineTo(fXY[0], fXY[1]);
				ctx.stroke();
			}
		}
	}
}

class Star {
	constructor(x, y, z) {
		this.color = color_stars;
		this.r = 2000;
		this.drawR;
		
		this.dx = 0;
		this.dy = 0;
		this.dz = 0;

		this.x = x;
		this.y = y;
		this.z = z;
		

		this.drawR = this.r / getDistance(this, {x:0, y:0, z:0});
	}

	tick() {
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
	
			drawCircle(this.color, tX, tY, this.drawR * (world_camera.scale / 200));
		}
	}
}





class Tunnel {
	constructor(x, z, angle, tileSize, sides, tilesPerSide, color, lengthInTiles, data, connections) {
		this.x = x;
		this.y = 0;
		this.z = z;
		this.theta = angle;
		this.phi = 0;
		this.rot = 0;

		this.color = color;

		this.sides = sides;
		this.tilesPerSide = tilesPerSide;
		this.tileSize = tileSize;
		this.len = lengthInTiles;
		this.data = data;
		this.strips = [];
		this.connections = [];

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
		this.maxTileRenderDist = (this.tileSize / 2) * world_camera.scale;
	}

	generateTiles() {
		this.strips = [];
		//split array into strips, with each strip being its own data structure
		//generating tiles
		var l = this.tilesPerSide * this.tileSize;
		var apothemLength = l / (2 * Math.tan(Math.PI / this.sides));

		for (var t=0; t<this.sides*this.tilesPerSide; t++) {
			//finding apothem rotation / offset parameters
			var apothemAngle = ((Math.PI * 2) / this.sides) * Math.floor(t / this.tilesPerSide);
			var additionAngle = apothemAngle + (Math.PI / 2);
			var additionLength = (this.tileSize) + ((this.tileSize * (t % this.tilesPerSide)) - (this.tileSize / 2)) - (l / 2);

			//tunnel strip parameters, sorry this code is messy
			var stripNormal = cartToPol(apothemLength * Math.cos(apothemAngle), apothemLength * Math.sin(apothemAngle), 0);

			var stripPos = [apothemLength * Math.cos(apothemAngle), apothemLength * Math.sin(apothemAngle), (this.len / 2) * this.tileSize];
			[stripPos[0], stripPos[1]] = [stripPos[0] + additionLength * Math.cos(additionAngle), stripPos[1] + additionLength * Math.sin(additionAngle)];
			[stripPos[0], stripPos[2]] = rotate(stripPos[0], stripPos[2], this.theta);
			stripPos = [stripPos[0] + this.x, stripPos[1] + this.y, stripPos[2] + this.z];

			var loadingStrip = new Tunnel_Strip(stripPos[0], stripPos[1], stripPos[2], stripNormal[0], stripNormal[1]);

			//run through every tile in the strip
			for (var a=0; a<this.len; a++) {
				//z position is l, x / y are determined by position on side
				var tileX = apothemLength * Math.cos(apothemAngle);
				var tileY = apothemLength * Math.sin(apothemAngle);
				var tileZ = 0 + (a * this.tileSize);
				
				//modifying coordinates
				tileX += additionLength * Math.cos(additionAngle);
				tileY += additionLength * Math.sin(additionAngle);

				//rotate final coordinates
				[tileX, tileZ] = rotate(tileX, tileZ, this.theta);

				//creating tile
				var value = 0;
				try {
					value = this.data[t][a]
				} catch(e) {
					//I really don't care if there's no data. If I start to care later I'll change this
				}
				if (value != 0) {
					loadingStrip.tiles.push(this.generateTile(value, this.x + tileX, this.y + tileY, this.z + tileZ, this.tileSize, this.theta, apothemAngle + (Math.PI / 2), 0, [stripNormal[0] + Math.PI - this.theta, stripNormal[1]], this.theta, this.color));
				}
			}
			this.strips.push(loadingStrip);
		}
	}

	generateTile(type, x, y, z, size, theta, phi, rot, normal, tunnelDir, color) {
		switch(type) {
			default:
				return new Tile(x, y, z, size, theta, phi, rot, normal, tunnelDir, color);
		}
		
	}

	tick() {
		//keep track of distance from player, use center of tunnel rather than start
		this.cameraDist = getDistance({x:this.centerPos[0], y:this.centerPos[1], z:this.centerPos[2]}, world_camera);

		this.strips.forEach(s => {
			s.tick();
		});
		haltCollision = false;
	}

	beDrawn() {
		//if player is close enough, draw individual tiles. If not, draw a thin line
		if (this.cameraDist < this.maxTileRenderDist) {
			this.strips.forEach(s => {
				s.beDrawn();
			});
		} else {
			//camera coordinate points
			var tempPoints = [spaceToRelative([this.x, this.y, this.z], [world_camera.x, world_camera.y, world_camera.z], [world_camera.theta, world_camera.phi, world_camera.rot]),
								spaceToRelative(this.endPos, [world_camera.x, world_camera.y, world_camera.z], [world_camera.theta, world_camera.phi, world_camera.rot])];
			tempPoints = clipToZ0(tempPoints, render_clipDistance, false);
			
			//turn points into screen coordinates
			var screenPoints = [];
			for (var a=0;a<tempPoints.length;a++) {
				screenPoints.push(cameraToScreen(tempPoints[a]));
			}

			//draw screen points
			ctx.lineWidth = (this.r * this.r) / this.cameraDist;
			ctx.strokeStyle = "#000";
			ctx.moveTo(screenPoints[0][0], screenPoints[0][1]);
			ctx.lineTo(screenPoints[1][0], screenPoints[1][1]);
			ctx.stroke();
		}
	}
	//returns true if the player is inside the tunnel, and false if the player is not
	playerIsInTunnel() {
		
	}
}

class Tunnel_FromData extends Tunnel {
	constructor(x, z, angle, tunnelData, connections) {
		var data = tunnelData_handle(tunnelData);
		super(x, z, angle, data.tileSize, data.sides, data.tilesPerSide, RGBtoHSV(data.color), data.maxLen, data.tileData, connections);
	}
}

//the tunnel strips don't need to be organized by 
class Tunnel_Strip {
	constructor(x, y, z, theta, phi) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.cameraDist = 1000;
		this.theta = theta;
		this.phi = phi;

		this.tiles = [];
	}

	//returns true if the player should be drawn on top of the strip
	playerIsOnTop() {
		//if the camera / player are on the same side, return true. If not, return false.
		return ((spaceToRelative([player.x, player.y, player.z], [this.x, this.y, this.z], [this.theta, this.phi, 0])[2] * spaceToRelative([world_camera.x, world_camera.y, world_camera.z], [this.x, this.y, this.z], [this.theta, this.phi, 0])[2]) > 0);
	}

	beDrawn() {
		this.tiles.forEach(t => {
			t.beDrawn();
		});
	}

	tick() {
		//setting camera distance
		this.cameraDist = getDistance(this, world_camera);
		this.tiles.forEach(t => {
			t.tick();
		});
	}
}

class Tile extends FreePoly {
	constructor(x, y, z, size, theta, phi, rot, normal, tunnelDir, color) {
		var points = [[-1, 0, -1], [-1, 0, 1], [1, 0, 1], [1, 0, -1]];

		var rPoint = [10, 0, 0];

		[rPoint[0], rPoint[2]] = rotate(rPoint[0], rPoint[2], rot);
		[rPoint[0], rPoint[1]] = rotate(rPoint[0], rPoint[1], phi);
		[rPoint[0], rPoint[2]] = rotate(rPoint[0], rPoint[2], theta);

		//multiply points by size, then apply various rotations
		for (var p=0; p<points.length; p++) {
			points[p][0] *= size / 2;
			points[p][2] *= size / 2;

			//spin
			[points[p][0], points[p][2]] = rotate(points[p][0], points[p][2], rot);
			[points[p][0], points[p][1]] = rotate(points[p][0], points[p][1], phi);
			[points[p][0], points[p][2]] = rotate(points[p][0], points[p][2], theta); 

			//adjusting for coordinates
			points[p] = [points[p][0] + x, points[p][1] + y, points[p][2] + z];
		} 
		
		super(points, color);
		
		this.normal = [normal[0], -1 * normal[1]];
		this.collisionPoints = this.calculateCollision();
		this.theta = theta;
		this.phi = phi;
		this.rot = rot;

		this.dir_tunnel = tunnelDir;
		this.dir_right = cartToPol(rPoint[0], rPoint[1], rPoint[2]);
		this.cameraRot = phi - (Math.PI / 2);

		this.size = size;
		
		this.rPoint = [rPoint[0] + x, rPoint[1] + y, rPoint[2] + z];
	}

	doCollideEffects() {
		player.dir_down = this.normal;
		player.dir_front = [this.dir_tunnel, 0];
		player.dir_side = this.dir_right;

		if (world_camera.targetRot != (Math.PI * 1.5) - this.cameraRot) {
			world_camera.targetRot = (Math.PI * 1.5) - this.cameraRot;
			haltCollision = true;
		}
		player.dy = 0;
	}

	collideWithPlayer() {
		//only collide if player is within certain distance, being this size
		if (Math.abs(this.x - player.x) + Math.abs(this.y - player.y) + Math.abs(this.z - player.z) < this.size * 2) {
			super.collideWithPlayer();
		}
	}
}