class Tile extends FreePoly {
	constructor(x, y, z, size, normal, parent, tilePosition, color) {
		super([[0, 0, 0], [0, 0, 1], [0, 1, 1]], color);

		this.x = x;
		this.y = y;
		this.z = z;
		this.size = size;

		this.points;
		this.normal = normal;
		this.cameraRot = this.normal[1];
		this.dir_right;
		this.dir_down;

		this.calculatePointsAndNormal();

		this.parent = parent;
		this.parentPosition = tilePosition;
		this.isReal = false;
	}

	calculatePointsAndNormal() {
		var points = [[-1, 0, -1], [-1, 0, 1], [1, 0, 1], [1, 0, -1]];

		for (var p=0; p<points.length; p++) {
			points[p] = transformPoint(points[p], [this.x, this.y, this.z], this.normal, this.size + 0.5);
		}
		
		this.points = points;
		this.dir_right = [this.normal[0], this.normal[1] + (Math.PI / 2)];
		this.dir_down = this.normal;
	}

	doComplexLighting() {
		getDistance_LightSource(this);
	}

	doRotationEffects(entity) {
		var cameraRotAttempt;
		entity.dir_front = [(Math.PI * 2) - this.parent.theta + (Math.PI * player.backwards), 0];
		entity.dir_side = [this.dir_right[0], this.dir_right[1] + (Math.PI * player.backwards)];
		entity.dir_down = this.dir_down;
		entity.dy = -1;

		//TODO: find a way to refactor the if/else out of this
		if (player.backwards) {
			cameraRotAttempt = ((Math.PI * 2.5) - this.dir_down[1]) % (Math.PI * 2);
		} else {
			cameraRotAttempt = (this.dir_down[1] + (Math.PI * 1.5)) % (Math.PI * 2);
		}

		world_camera.targetPhi = 0;
		world_camera.targetTheta = entity.dir_front[0];
		//if the difference is too great, fix that
		if (Math.abs(world_camera.theta - world_camera.targetTheta) > Math.PI) {
			if (world_camera.theta > Math.PI) {
				world_camera.theta -= Math.PI * 2;
			} else {
				world_camera.theta += Math.PI * 2;
			}
		}

		if (!editor_active && world_camera.targetRot != cameraRotAttempt) {
			world_camera.targetRot = cameraRotAttempt;

			//if the rotation difference is too great, fix that
			if (Math.abs(world_camera.rot - world_camera.targetRot) > Math.PI) {
				if (world_camera.rot > Math.PI) {
					world_camera.rot -= Math.PI * 2;
				} else {
					world_camera.rot += Math.PI * 2;
				}
			}
			haltCollision = true;
		}
	}

	collideWithEntity(entity) {
		//only collide if player is within certain distance
		if (this.playerDist < this.size * 2) {
			super.collideWithEntity(entity);
		}
	}

	getColor() {
		return `hsl(${this.color.h}, ${this.color.s}%, ${linterp((this.color.v * 45) * (this.parent.power + 0.5), 0, clamp((this.playerDist / render_maxColorDistance) * (1 / (this.parent.power + 0.001)), 0.1, 1))}%)`;
	}

	playerIsOnTop() {
		return (((spaceToRelativeRotless([player.x, player.y, player.z], [this.x, this.y, this.z], this.normal)[2]) * spaceToRelativeRotless([world_camera.x, world_camera.y, world_camera.z], [this.x, this.y, this.z], this.normal)[2]) > 0)
	}
}

//I just gave up on the tile system with this one and made it its own object
class Tile_Box extends Tile {
	constructor(x, y, z, size, normal, parent, tilePosition) {
		super(x, y, z, size, normal, parent, tilePosition, RGBtoHSV(color_box));

		//all boxes have a left / right tile, for changing rotation
		this.leftTile = new Tile(x, y, z, size, [normal[0], (normal[1] + (Math.PI * 1.5)) % (Math.PI * 2)], parent, tilePosition, this.color);
		this.rightTile = new Tile(x, y, z, size, [normal[0], (normal[1] + (Math.PI * 0.5)) % (Math.PI * 2)], parent, tilePosition, this.color);
	}

	calculatePointsAndNormal() {
		var points = [	[-1, 1, -1], [-1, 1, 1], [1, 1, 1], [1, 1, -1],
						[-1, -1, -1], [-1, -1, 1], [1, -1, 1], [1, -1, -1]];

		for (var p=0; p<points.length; p++) {
			points[p] = transformPoint(points[p], [this.x, this.y, this.z], this.normal, this.size + 0.5);
		}
		
		this.points = points;
		this.dir_right = [this.normal[0], this.normal[1] + (Math.PI / 2)];
		this.dir_down = this.normal;
	}
	

	beDrawn() {
		if ((this.size / this.cameraDist) * world_camera.scale > render_minTileSize * 0.5 && this.cameraDist < render_maxColorDistance * 2) {
			//actual box shape
			/*faces:
			top - 0 1 2 3 
			bottom - 4 5 6 7

			left - 0 1 5 4
			right - 3 2 6 7

			front - 1 2 6 5
			back - 0 3 7 4
			*/

			//getting camera position relative to self for proper ordering
			var relCPos = spaceToRelativeRotless([world_camera.x, world_camera.y, world_camera.z], [this.x, this.y, this.z], this.normal);
			var color = this.getColor();
			
			//top / bottom switch
			if (relCPos[2] > 0) {
				drawWorldPoly([this.points[0], this.points[1], this.points[2], this.points[3]], color);
			} else {
				drawWorldPoly([this.points[4], this.points[5], this.points[6], this.points[7]], color);
			}

			//left / right switch
			if (relCPos[0] > 0) {
				drawWorldPoly([this.points[3], this.points[2], this.points[6], this.points[7]], color);
			} else {
				drawWorldPoly([this.points[0], this.points[1], this.points[5], this.points[4]], color);
			}

			//forwards / back switch
			if (relCPos[1] > 0) {
				drawWorldPoly([this.points[0], this.points[3], this.points[7], this.points[4]], color);
			} else {
				drawWorldPoly([this.points[1], this.points[2], this.points[6], this.points[5]], color);
			}
		} else {
			//simple circle for far away
			if (!isClipped([this.x, this.y, this.z])) {
				var pos = spaceToScreen([this.x, this.y, this.z]);
				drawCircle(this.getColor(), pos[0], pos[1], (this.size / this.cameraDist) * world_camera.scale * 0.6);
			}
		} 
	}

	collideWithEntity(entity) {
		//only collide if within a certain distance of the player
		if (this.playerDist < this.size * 3) {
			//transforming player coordinates to self
			var entityCoords = spaceToRelativeRotless([entity.x, entity.y, entity.z], [this.x, this.y, this.z], this.normal);

			//second check for collision, only collide if all 3 coordinates are under threshold
			if (Math.abs(entityCoords[0]) - this.tolerance < this.size / 2 && Math.abs(entityCoords[1]) - this.tolerance < this.size / 2 && Math.abs(entityCoords[2]) - this.tolerance < this.size / 2) {
				var distX = Math.abs(entityCoords[0]) - entity.r;
				var distY = Math.abs(entityCoords[1]);
				var distZ = Math.abs(entityCoords[2]); 
				//x = forwards / back
				//y = left / right
				//z = up / down


				//if x is the greatest (forwards / back in the tunnel) slow player down and push out
				if (distZ > distX && distZ > distY) {
					//top
					this.collide_upDown(entity, entityCoords);
				} else if (distY > distX && distY > distZ) {
					//sides
					this.collide_leftRight(entity, entityCoords);
				} else {
					//front / back
					this.collide_forwardsBackwards(entity, entityCoords);
				}
			}

			//transform player coords back and assign to player
			[entity.x, entity.y, entity.z] = relativeToSpace(entityCoords, [this.x, this.y, this.z], [this.normal[0], this.normal[1], 0]);
		}
	}

	collide_forwardsBackwards(entity, entityCoords) {
		//if x is the greatest
		entity.dz = 0;
		if (entityCoords[0] > 0) {
			entityCoords[0] = 0.5 * this.size + this.tolerance;
		} else {
			entityCoords[0] = (-0.5 * this.size) - this.tolerance;
		}
	}

	collide_upDown(entity, entityCoords) {
		//if z is the greatest
		this.doCollisionEffects(entity);

		if (entityCoords[2] > 0) {
			entityCoords[2] =  0.5 * this.size + this.tolerance;
			if (Math.abs(entityCoords[2]) < this.size * 0.95 && !haltCollision && (entity.dir_down[0] != this.dir_down[0] || entity.dir_down[1] != this.dir_down[1])) {
				this.doRotationEffects(entity);
			}
		} else {
			entityCoords[2] = -0.5 * this.size - this.tolerance;
			//rotation for upside down
		}
	}

	collide_leftRight(entity, entityCoords) {
		//if y is the greatest
		this.doCollisionEffects(entity);

		//this solution is sort of hacky, but the box is already ridiculously laggy so I don't particularly care
		if (entityCoords[1] > 0) {
			if (Math.abs(entityCoords[1]) < this.size * 0.95 && !haltCollision && (entity.dir_down[0] != this.rightTile.dir_down[0] || entity.dir_down[1] != this.rightTile.dir_down[1])) {
				this.rightTile.doRotationEffects(entity);
			}
			entityCoords[1] = 0.5 * this.size + this.tolerance;
			return;
		} 

		if (Math.abs(entityCoords[1]) < this.size * 0.95 && !haltCollision && (entity.dir_down[0] != this.leftTile.dir_down[0] || entity.dir_down[1] != this.leftTile.dir_down[1])) {
			this.leftTile.doRotationEffects(entity);
		}
		entityCoords[1] = -0.5 * this.size - this.tolerance;
	}

	tick() {
		super.getCameraDist();
	}
}

class Tile_Box_Ringed extends Tile_Box {
	constructor(x, y, z, size, normal, parent, tilePosition) {
		super(x, y, z, size, normal, parent, tilePosition);
		
	}

	calculatePointsAndNormal() {
		super.calculatePointsAndNormal();
		var ringOff = polToCart(this.normal[0], (this.normal[1] + (Math.PI * 1.5)) % (Math.PI * 2), (this.size / 2) + 2);
		this.ringL = new Ring(this.x + ringOff[0], this.y + ringOff[1], this.z + ringOff[2], this.normal[0], (this.normal[1] + (Math.PI * 1.5)) % (Math.PI * 2), render_ringSize);
		this.ringR = new Ring(this.x - ringOff[0], this.y - ringOff[1], this.z - ringOff[2], this.normal[0], (this.normal[1] + (Math.PI * 0.5)) % (Math.PI * 2), render_ringSize);
	}

	beDrawn() {
		//TODO: refactor this to align with parent class, currently is inefficient
		if ((this.size / this.cameraDist) * world_camera.scale > render_minTileSize * 0.5 && this.cameraDist < render_maxColorDistance * 2) {
			var relCPos = spaceToRelativeRotless([world_camera.x, world_camera.y, world_camera.z], [this.x, this.y, this.z], this.normal);
			var color = this.getColor();
			if (relCPos[2] > 0) {
				drawWorldPoly([this.points[0], this.points[1], this.points[2], this.points[3]], color);
			} else {
				drawWorldPoly([this.points[4], this.points[5], this.points[6], this.points[7]], color);
			}
			//front / back
			if (relCPos[0] > 0) {
				drawWorldPoly([this.points[3], this.points[2], this.points[6], this.points[7]], color);
			} else {
				drawWorldPoly([this.points[0], this.points[1], this.points[5], this.points[4]], color);
			}
			//left / rightß
			if (relCPos[1] > 0) {
				//change order of ring / face depending on position
				if (relCPos[1] <= this.size / 2) {
					this.ringR.beDrawn();
				}
				drawWorldPoly([this.points[0], this.points[3], this.points[7], this.points[4]], color);
				if (relCPos[1] > this.size / 2) {
					this.ringR.beDrawn();
				}
			} else {
				if (relCPos[1] >= this.size / -2) {
					this.ringL.beDrawn();
				}
				drawWorldPoly([this.points[1], this.points[2], this.points[6], this.points[5]], color);
				if (relCPos[1] < this.size / -2) {
					this.ringL.beDrawn();
				}
			}
			return;
		}
		//simple circle for far away
		if (!isClipped([this.x, this.y, this.z])) {
			var pos = spaceToScreen([this.x, this.y, this.z]);
			drawCircle(this.getColor(), pos[0], pos[1], (this.size / this.cameraDist) * world_camera.scale * 0.6);
		}
	}

	doComplexLighting() {
		super.doComplexLighting();
		this.ringL.doComplexLighting();
		this.ringR.doComplexLighting();
		
	}

	tick() {
		super.tick();
		this.ringL.tick();
		this.ringR.tick();
	}
}

class Tile_Box_Spun extends Tile_Box {
	constructor(x, y, z, size, normal, parent, tilePosition) {
		super(x, y, z, size, [normal[0], normal[1] + (Math.PI * 0.25)], parent, tilePosition);
		this.collisionMult = 1.414;
	}

	calculatePointsAndNormal() {
		var len = 1 / Math.sqrt(2);
		var points = [	[-1, len, -len], [-1, len, len], [1, len, len], [1, len, -len],
						[-1, -len, -len], [-1, -len, len], [1, -len, len], [1, -len, -len]];

		for (var p=0; p<points.length; p++) {
			points[p] = transformPoint(points[p], [this.x, this.y, this.z], this.normal, this.size + 0.5);
		}
		
		this.points = points;
		this.dir_right = [this.normal[0], this.normal[1] + (Math.PI / 2)];
		this.dir_down = this.normal;
		this.size -= player.r * 0.6;
	}
}

class Tile_Bright extends Tile {
	constructor(x, y, z, size, normal, parent, tilePosition, color) {
		super(x, y, z, size, normal, parent, tilePosition, color);
	}

	getColor() {
		return `hsl(${this.color.h}, ${this.color.s}%, ${linterp(75, 5, clamp((this.playerDist / render_maxColorDistance) * 0.75, 0, 1))}%)`
	}
}

class Tile_Conveyor extends Tile {
	constructor(x, y, z, size, normal, parent, tilePosition) {
		super(x, y, z, size, normal, parent, tilePosition, RGBtoHSV(color_conveyor));
		this.secondaryColor = RGBtoHSV(color_conveyor_secondary);
		this.time = 0;
		this.conveyTime = 80;
	}

	doCollisionEffects(entity) {
		super.doCollisionEffects(entity);
		this.doSpeedEffects(entity);
	}

	doSpeedEffects(entity) {
		if (player.backwards) {
			if (entity.dz > entity.dMax * 0.4) {
				entity.dz -= physics_conveyorStrength * 3;
			}
		} else {
			if (entity.dz < entity.dMax * 2) {
				entity.dz += physics_conveyorStrength;
			}
		}
	}

	calculatePointsAndNormal() {
		super.calculatePointsAndNormal();
		this.calculateTriPoints();
	}

	calculateTriPoints() {
		this.triPoints = [[-1 + (this.time * 2), 0, -1], [-1 + (this.time * 2), 0, 0], [-1, 0, -1 * this.time], [-1, 0, this.time], [-1 + (this.time * 2), 0, 0], 
					[-1 + (this.time * 2), 0, 1], [1, 0, this.time], [1, 0, -1 * this.time]];
		this.triPoints.forEach(p => {
			transformPoint(p, [this.x, this.y, this.z], this.normal, this.size + 0.5);
		});
	}

	getSecondaryColor() {
		return `hsl(${this.secondaryColor.h}, ${this.secondaryColor.s}%, ${linterp(60, 0, clamp((this.playerDist / render_maxColorDistance) * (1 / (this.parent.power + 0.001)), 0.1, 1))}%)`;
	}

	tick() {
		super.tick();
		this.time = (world_time / this.conveyTime) % 1;
	}
	
	beDrawn() {
		//calculate triangle points
		this.calculateTriPoints();

		drawWorldPoly(this.points, this.getColor());
		drawWorldPoly(this.triPoints, this.getSecondaryColor());
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

class Tile_Conveyor_Slow extends Tile_Conveyor {
	constructor(x, y, z, size, normal, parent, tilePosition) {
		super(x, y, z, size, normal, parent, tilePosition);
	}

	calculateTriPoints() {
		this.triPoints = [[1 - (this.time * 2), 0, -1], [1 - (this.time * 2), 0, 0], [1, 0, -1 * this.time], [1, 0, this.time], [1 - (this.time * 2), 0, 0], 
					[1 - (this.time * 2), 0, 1], [-1, 0, this.time], [-1, 0, -1 * this.time]];
		this.triPoints.forEach(p => {
			transformPoint(p, [this.x, this.y, this.z], this.normal, this.size + 0.5);
		});
	}

	doSpeedEffects(entity) {
		if (player.backwards) {
			if (entity.dz < entity.dMax * 2) {
				entity.dz += physics_conveyorStrength;
			}
		} else {
			if (entity.dz > entity.dMax * 0.4) {
				entity.dz -= physics_conveyorStrength * 3;
			}
		}
	}
}

class Tile_Conveyor_Left extends Tile_Conveyor {
	constructor(x, y, z, size, normal, parent, tilePosition) {
		super(x, y, z, size, normal, parent, tilePosition);
	}

	calculatePointsAndNormal() {
		super.calculatePointsAndNormal();
		
		//rotate by 18.5° the other way, 2pi / 19.459 is 18.5° trust me
		this.dir_down = [this.normal[0], this.normal[1] - ((Math.PI * 2) / 19.459)];
		this.cameraRot = this.dir_down[1];
	}

	calculateTriPoints() {
		this.triPoints = [[-1, 0, 1 - (this.time * 2)], [0, 0, 1 - (this.time * 2)], [-1 * this.time, 0, 1], [this.time, 0, 1], [0, 0, 1 - (this.time * 2)], 
					[1, 0, 1 - (this.time * 2)], [this.time, 0, -1], [-1 * this.time, 0, -1]];
		this.triPoints.forEach(p => {
			transformPoint(p, [this.x, this.y, this.z], this.normal, this.size + 0.5);
		});
	}

	doSpeedEffects(entity) {
		entity.dx += physics_conveyorStrength * 3;
		if (player.backwards) {
			entity.dx -= physics_conveyorStrength * 6;
		}
	}
}

class Tile_Conveyor_Right extends Tile_Conveyor {
	constructor(x, y, z, size, normal, parent, tilePosition) {
		super(x, y, z, size, normal, parent, tilePosition);
	}

	calculatePointsAndNormal() {
		super.calculatePointsAndNormal();
		//rotate by 18.5°
		this.dir_down = [this.normal[0], this.normal[1] + ((Math.PI * 2) / 19.459)];
		this.cameraRot = this.dir_down[1];
	}

	calculateTriPoints() {
		this.triPoints = [[-1, 0, -1 + (this.time * 2)], [0, 0, -1 + (this.time * 2)], [-1 * this.time, 0, -1], [this.time, 0, -1], [0, 0, -1 + (this.time * 2)], 
					[1, 0, -1 + (this.time * 2)], [this.time, 0, 1], [-1 * this.time, 0, 1]];
		this.triPoints.forEach(p => {
			transformPoint(p, [this.x, this.y, this.z], this.normal, this.size + 0.5);
		});
	}

	doSpeedEffects(entity) {
		entity.dx -= physics_conveyorStrength * 3;
		if (player.backwards) {
			entity.dx += physics_conveyorStrength * 6;
		}
	}
}

class Tile_Crumbling extends Tile {
	constructor(x, y, z, size, normal, parent, tilePosition, color) {
		super(x, y, z, size, normal, parent, tilePosition, RGBtoHSV(color_crumbling));
		this.activeSize = this.size;

		this.home = [this.x, this.y, this.z];

		this.fallStatus = undefined;
		this.fallRate = -0.52;

		//all crumbling tiles have a plexiglass tile hidden on top of them
		this.plexiTile = new Tile_Plexiglass(x, y, z, size, normal, parent, tilePosition, color, 0.95);
	}

	calculatePointsAndNormal() {
		if (this.activeSize == undefined) {
			this.activeSize = this.size;
		}
		this.points = [[-1, 0, -1], [-1, 0, 1], [1, 0, 1], [1, 0, -1]];

		this.points.forEach(p => {
			transformPoint(p, [this.x, this.y, this.z], this.normal, this.activeSize);
		});

		this.line1 = [transformPoint([0.5, 0, 0.5], [this.x, this.y, this.z], this.normal, this.activeSize), transformPoint([-0.5, 0, -0.5], [this.x, this.y, this.z], this.normal, this.activeSize)];
		this.line2 = [transformPoint([-0.5, 0, 0.5], [this.x, this.y, this.z], this.normal, this.activeSize), transformPoint([0.5, 0, -0.5], [this.x, this.y, this.z], this.normal, this.activeSize)];

		this.dir_right = [this.normal[0], this.normal[1] + (Math.PI / 2)];
		this.dir_down = this.normal;
	}

	collideWithEntity(entity) {
		//only do if large enough
		if (this.activeSize > 0.01 && this.playerDist < this.size * 2) {
			super.collideWithEntity(entity);
		}

		//tick plexiglass
		this.plexiTile.collideWithEntity(entity);
	}

	tick() {
		super.tick();
		if (this.fallStatus != undefined) {
			this.fallStatus += 1;

			if (this.fallStatus > 0) {
				//only continue falling if large enough
				if (this.activeSize > 0.01) {
					//fall downward
					var changeBy = polToCart(this.normal[0], this.normal[1], this.fallRate);
					this.x += changeBy[0];
					this.y += changeBy[1];
					this.z += changeBy[2];

					//get smaller
					if (this.fallStatus > physics_crumblingShrinkStart) {
						this.activeSize = linterp(this.size, 0, (this.fallStatus - physics_crumblingShrinkStart) / physics_crumblingShrinkTime);
					}


					//recalculate points
					this.calculatePointsAndNormal();
				}

				//if in a tunnel that the player is not in, reset self
				if (this.parent != player.parent) {
					this.reset();
				}
			}
		}
		//tick plexiglass
		this.plexiTile.tick();
	}

	reset() {
		//return to home
		this.fallStatus = undefined;
		this.activeSize = this.size;

		//recalculating points
		[this.x, this.y, this.z] = this.home;
		this.calculatePointsAndNormal();
	}

	beDrawn() {
		//only be drawn if large enough
		if (this.activeSize > 0.01) {
			super.beDrawn();
			if (this.playerDist / render_maxColorDistance < 0.95) {
				ctx.strokeStyle = `hsl(0, 0%, ${linterp(40, 0, this.playerDist / render_maxColorDistance)}%)`;
				drawWorldLine(this.line1[0], this.line1[1]);
				drawWorldLine(this.line2[0], this.line2[1]);
			}
		}

		//draw plexiglass if falling
		if (this.fallStatus != undefined) {
			this.plexiTile.beDrawn();
		}
	}

	//yes I have three functions for this one behavior. No I'm not proud of it. But it works (:
	doCollisionEffects(entity) {
		super.doCollisionEffects(entity);
		//crumbling tiles do not place player firmly on the ground
		entity.onGround = physics_graceTime - 1;
		//only crumble if not a child and if not already crumbling
		if (this.fallStatus == undefined && entity.jumpBuffer == undefined || entity.jumpBuffer > 0) {
			this.fallStatus = 0;
			this.propogateCrumble();
		}
		
	}

	propogateCrumble() {
		//crumble all other tiles around self
		var positions = [[-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1]];
		positions.forEach(r => {
			//keeping numbers in bounds, for strip number through modulo and for tile number through clamping
			r[0] = (r[0] + this.parentPosition[0] + this.parent.strips.length) % this.parent.strips.length;
			r[1] = clamp(r[1] + this.parentPosition[1], 0, this.parent.strips[r[0]].length - 1);
		});

		positions.forEach(r => {
			this.crumbleOtherTile(r[0], r[1]);
		});
	}

	crumbleOtherTile(strip, num) {
		if (this.parent.strips[strip].tiles[num] instanceof Tile_Crumbling && this.parent.strips[strip].tiles[num].fallStatus == undefined) {
			this.parent.strips[strip].tiles[num].fallStatus = Math.max(0, this.fallStatus);
			this.parent.strips[strip].tiles[num].propogateCrumble();
		}
	}
}

class Tile_Ice extends Tile {
	constructor(x, y, z, size, normal, parent, tilePosition) {
		super(x, y, z, size, normal, parent, tilePosition, RGBtoHSV(color_ice));
	}

	getColor() {
		return `hsl(${this.color.h}, ${this.color.s}%, ${linterp(90, 0, clamp((this.playerDist / render_maxColorDistance) * (1 / (this.parent.power + 0.001)), 0, 1))}%)`;
	}

	doCollisionEffects(entity) {
		super.doCollisionEffects(entity);
		entity.onIce = true;
	}
}

class Tile_Ice_Ramp extends Tile_Ice {
	constructor(x, y, z, size, normal, parent, tilePosition) {
		super(x, y, z, size, normal, parent, tilePosition);
	}

	calculatePointsAndNormal() {
		this.points = [[-1, 0, -1], [-1, 0, 1], [-1 + Math.sqrt(3), 0.5, 1], [-1 + Math.sqrt(3), 0.5, -1]];
		this.points.forEach(p => {
			transformPoint(p, [this.x, this.y, this.z], this.normal, this.size + 0.5);
		});
		
		[this.x, this.y, this.z] = avgArray(this.points);
		this.dir_down = this.normal;
		this.normal = calculateNormal(this.points);
		this.dir_right = [this.dir_down[0], this.dir_down[1] + (Math.PI / 2)];
	}

	doCollisionEffects(entity) {
		super.doCollisionEffects(entity);
		//push player up a bit
		if (entity.dy < entity.dz * 0.1) {
			entity.dy = entity.dz * 0.1 * ((!player.backwards * 2) - 1);
		}
		entity.onGround = physics_graceTimeRamp;
	}
}

class Tile_Movable extends Tile {
	constructor(x, y, z, size, normal, parent, tilePosition, color) {
		super(x, y, z, size, normal, parent, tilePosition, color);
		
	}

	calculatePointsAndNormal() {
		super.calculatePointsAndNormal();
		var ringOffset = polToCart(this.normal[0], this.normal[1], 2);
		this.ring = new Ring(this.x + ringOffset[0], this.y + ringOffset[1], this.z + ringOffset[2], this.normal[0], this.normal[1], render_ringSize);
	}

	doComplexLighting() {
		super.doComplexLighting();
		//rings on tiles are close enough that it probably doesn't matter, and will save time to not do the computation
		this.ring.playerDist = this.playerDist;
	}

	beDrawn() {
		super.beDrawn();
		//if the camera is on same side as normal, draw ring
		if (spaceToRelativeRotless([world_camera.x, world_camera.y, world_camera.z], [this.x, this.y, this.z], this.normal)[2] > 0) {
			this.ring.beDrawn();
		}
	}

	tick() {
		super.tick();
		this.ring.tick();
	}
}

//this is called a plexiglass tile because I thought it looked a bit like plexiglass. It's not actually made of plexiglass. don't get confused ;)
class Tile_Plexiglass extends Tile {
	constructor(x, y, z, size, normal, parent, tilePosition, color, strength) {
		super(x, y, z, size, normal, parent, tilePosition, color);
		this.strength = strength;
		this.minStrength = 0.04;
	}

	getAlpha() {
		return (linterp(this.strength, 0, clamp((this.playerDist / physics_maxBridgeDistance) * (1.2 / (this.parent.power + 0.2)), 0.1, 1)) * player.personalBridgeStrength);
	}

	getColor() {
		return `hsl(${this.color.h}, ${this.color.s}%, ${linterp(70, 25, clamp((this.playerDist / render_maxColorDistance) * 0.5, 0.1, 1))}%)`
	}

	beDrawn() {
		if (player.personalBridgeStrength != undefined) {
			if (this.getAlpha() > this.minStrength) {
				ctx.globalAlpha = this.getAlpha();
				super.beDrawn();
				ctx.globalAlpha = 1;
			}
		}
	}

	tick() {
		if (player.personalBridgeStrength != undefined) {
			super.tick();
		}
	}

	collideWithEntity(entity) {
		if (player.personalBridgeStrength != undefined) {
			if (this.getAlpha() > this.minStrength && this.playerDist < this.size * 2) {
				super.collideWithEntity(entity);
			}
		}
	}
}

class Tile_Ramp extends Tile {
	constructor(x, y, z, size, normal, parent, tilePosition, color) {
		super(x, y, z, size, normal, parent, tilePosition, color);
	}

	calculatePointsAndNormal() {
		this.points = [[-1, 0, -1], [-1, 0, 1], [-1 + (2 / Math.sqrt(2)), (2 / Math.sqrt(2)), 1], [-1 + (2 / Math.sqrt(2)), (2 / Math.sqrt(2)), -1]];
		this.points.forEach(p => {
			transformPoint(p, [this.x, this.y, this.z], this.normal, this.size + 0.5);
		});

		[this.x, this.y, this.z] = avgArray(this.points);
		this.dir_down = this.normal;
		this.normal = calculateNormal(this.points);
		this.dir_right = [this.dir_down[0], this.dir_down[1] + (Math.PI / 2)];
	}

	doCollisionEffects(entity) {
		super.doCollisionEffects(entity);
		//push player up a bit
		entity.dy = entity.dz * 0.7 * ((!player.backwards * 2) - 1);
		entity.onground = physics_graceTimeRamp;
	}

	playerIsOnTop() {
		return (super.playerIsOnTop || spaceToRelativeRotless([player.x, player.y, player.z], [this.x, this.y, this.z], [this.parent.theta, 0]));
	}
}

class Tile_Vertical extends Tile {
	constructor(x, y, z, size, normal, parent, tilePosition, color) {
		super(x, y, z, size, normal, parent, tilePosition, color);
	}
}

class Tile_Warning extends Tile {
	constructor(x, y, z, size, normal, parent, tilePosition) {
		super(x, y, z, size, normal, parent, tilePosition, RGBtoHSV(color_warning));
		this.verticalPlayerDist = 1000;
	}

	calculatePointsAndNormal() {
		super.calculatePointsAndNormal();
		this.verticalPoints = [[1, 0, -1], [1, 1.25, -1], [1, 1.25, 1], [1, 0, 1]];
		this.verticalCenter = avgArray(this.verticalPoints);

		transformPoint(this.verticalCenter, [this.x, this.y, this.z], this.normal, this.size + 0.5);
		this.verticalPoints.forEach(p => {
			transformPoint(p, [this.x, this.y, this.z], this.normal, this.size + 0.5);
		});
	}

	tick() {
		super.tick();

		//get player distance for vertical part
		this.verticalPlayerDist = getDistance(player, {x: this.verticalCenter[0], y: this.verticalCenter[1], z: this.verticalCenter[2]});
	}

	getVerticalColor() {
		return `hsl(${this.color.h}, ${this.color.s}%, ${linterp((this.color.v * 45) * (this.parent.power + 0.5), 0, clamp((this.verticalPlayerDist / render_maxColorDistance) * (1 / (this.parent.power + 0.001)), 0.1, 1))}%)`;
	}

	collideWithEntity(entity) {
		super.collideWithEntity(entity);

		//also colliding with front bit
		//transform player to self's coordinates
		var entityCoords = spaceToRelative([entity.x, entity.y, entity.z], this.verticalCenter, [this.dir_down[0] + (Math.PI / 2), 0, this.dir_down[1]]);
		if (Math.abs(entityCoords[2]) < this.tolerance && Math.abs(entityCoords[0] < this.size + this.tolerance) && Math.abs(entityCoords[0]) < (this.size * 0.25) + this.tolerance) {
			//different behavior depending on side
			if (entityCoords[2] < 0) {
				entityCoords[2] = -this.tolerance;
			} else {
				entityCoords[2] = this.tolerance;
			}
			entity.dz = 0;
			//transforming back to regular coordinates
			[entity.x, entity.y, entity.z] = relativeToSpaceRot(entityCoords, this.verticalCenter, [this.dir_down[0] + (Math.PI / 2), 0, this.dir_down[1]]);
		}
	}

	beDrawn() {
		super.beDrawn();
		drawWorldPoly(this.verticalPoints, this.getVerticalColor());
		if (editor_active) {
			//draw sideways normal
			var cXYZ = polToCart(this.dir_down[0] + (Math.PI / 2), 0, 5);
			cXYZ = [this.verticalCenter[0] + cXYZ[0], this.verticalCenter[1] + cXYZ[1], this.verticalCenter[2] + cXYZ[2]];
			drawWorldLine(this.verticalCenter, cXYZ);
		}
	}
}