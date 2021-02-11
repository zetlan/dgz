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
		this.rPoint;
		this.dir_right;
		this.dir_down;

		this.calculatePointsAndNormal();

		

		this.parent = parent;
		this.parentPosition = tilePosition;

		//for things like crumbling tiles and boxes, that stick out from the strip and need to be ordered specially
		this.requiresOrdering = false;
	}

	calculatePointsAndNormal() {
		var points = [[-1, 0, -1], [-1, 0, 1], [1, 0, 1], [1, 0, -1]];
		
		var rPoint = [0, 0, -10];
		rPoint = transformPoint(rPoint, [0, 0, 0], this.normal, 1);

		for (var p=0; p<points.length; p++) {
			points[p] = transformPoint(points[p], [this.x, this.y, this.z], this.normal, this.size + 0.5);
		}
		
		this.points = points;
		this.rPoint = [rPoint[0] + this.x, rPoint[1] + this.y, rPoint[2] + this.z];
		this.dir_right = cartToPol(rPoint[0], rPoint[1], rPoint[2]);
		this.dir_down = this.normal;
	}

	doRotationEffects() {
		player.dir_down = this.dir_down;
		player.dir_front = [(Math.PI * 2) - this.parent.theta, 0];
		player.dir_side = this.dir_right;

		world_camera.phi = 0;
		world_camera.targetTheta = (Math.PI * 2) - this.parent.theta;
		//if the difference is too great, fix that
		if (Math.abs(world_camera.theta - world_camera.targetTheta) > Math.PI) {
			if (world_camera.theta > Math.PI) {
				world_camera.theta -= Math.PI * 2;
			} else {
				world_camera.theta += Math.PI * 2;
			}
		}

		
		if (!editor_active && world_camera.targetRot != (this.cameraRot + (Math.PI * 1.5)) % (Math.PI * 2)) {
			world_camera.targetRot = (this.cameraRot + (Math.PI * 1.5)) % (Math.PI * 2);

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
		player.dy = 0;
	}

	collideWithPlayer() {
		//only collide if player is within certain distance
		if (Math.abs(this.x - player.x) + Math.abs(this.y - player.y) + Math.abs(this.z - player.z) < (this.size * 2) + player.r) {
			super.collideWithPlayer();
		}
	}

	playerIsOnTop() {
		return ((spaceToRelative([player.x, player.y, player.z], [this.x, this.y, this.z], this.normal)[2] * spaceToRelative([world_camera.x, world_camera.y, world_camera.z], [this.x, this.y, this.z], this.normal)[2]) > 0)
	}
}

//I just gave up on the tile system with this one and made it its own object
class Tile_Box extends Tile {
	constructor(x, y, z, size, normal, parent, tilePosition) {
		super(x, y, z, size, normal, parent, tilePosition, {h: 300, s: 10});

		this.requiresOrdering = true;

		//all boxes have a left / right tile, for changing rotation
		this.leftTile = new Tile(x, y, z, size, [normal[0], (normal[1] + (Math.PI * 1.5)) % (Math.PI * 2)], parent, tilePosition, this.color);
		this.rightTile = new Tile(x, y, z, size, [normal[0], (normal[1] + (Math.PI * 0.5)) % (Math.PI * 2)], parent, tilePosition, this.color);
	}

	calculatePointsAndNormal() {
		var points = [	[-1, 1, -1], [-1, 1, 1], [1, 1, 1], [1, 1, -1],
						[-1, -1, -1], [-1, -1, 1], [1, -1, 1], [1, -1, -1]];
		
		var rPoint = [0, 0, -10];
		rPoint = transformPoint(rPoint, [0, 0, 0], this.normal, 1);

		for (var p=0; p<points.length; p++) {
			points[p] = transformPoint(points[p], [this.x, this.y, this.z], this.normal, this.size + 0.5);
		}
		
		this.points = points;
		this.rPoint = [rPoint[0] + this.x, rPoint[1] + this.y, rPoint[2] + this.z];
		this.dir_right = cartToPol(rPoint[0], rPoint[1], rPoint[2]);
		this.dir_down = this.normal;
	}
	

	beDrawn() {
		if (this.cameraDist < render_maxColorDistance + this.size) {
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
			var relCPos = spaceToRelative([world_camera.x, world_camera.y, world_camera.z], [this.x, this.y, this.z], [this.normal[0], this.normal[1], 0]);
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
				drawCircle(this.getColor(), pos[0], pos[1], (this.size / this.cameraDist) * world_camera.scale * 0.8);
			}
		}
	}

	collideWithPlayer() {
		//only collide if within a certain distance of the player
		if (this.playerDist < this.size * 2) {
			//transforming player coordinates to self
			var playerCoords = spaceToRelative([player.x, player.y, player.z], [this.x, this.y, this.z], [this.normal[0], this.normal[1], 0]);

			//second check for collision, only collide if all 3 coordinates are under threshold
			if (Math.abs(playerCoords[0]) - player.r < this.size / 2 && Math.abs(playerCoords[1]) - player.r < this.size / 2 && Math.abs(playerCoords[2]) - player.r < this.size / 2) {
				var distX = Math.abs(playerCoords[0]);
				var distY = Math.abs(playerCoords[1]);
				var distZ = Math.abs(playerCoords[2]);
				//if x is the greatest (forwards / back in the tunnel) slow player down and push out
				if (distX > distY && distX > distZ) {
					player.dz = 0;
					if (playerCoords[0] > 0) {
						playerCoords[0] = 0.5 * this.size + player.r;
					} else {
						playerCoords[0] = (-0.5 * this.size) - player.r;
					}
				} else if (distZ > distY && distZ > distX) {
					//if z is the greatest, do rotation effects normally
					player.dy = 0;
					if (playerCoords[2] > 0) {
						playerCoords[2] =  0.5 * this.size + player.r;
					} else {
						playerCoords[2] = -0.5 * this.size - player.r;
					}
					this.doCollisionEffects();
					this.doRotationEffects();
				} else {
					//if y is the greatest, then it's the sides of the box.
					//this solution is sort of hacky, but the box is already ridiculously laggy so I don't particularly care
					if (playerCoords[1] > 0) {
						this.rightTile.doRotationEffects();
						playerCoords[1] = 0.5 * this.size + player.r;
					} else {
						this.leftTile.doRotationEffects();
						playerCoords[1] = -0.5 * this.size - player.r;
					}
					this.doCollisionEffects();
				}
			}

			//transform player coords back and assign to player
			[player.x, player.y, player.z] = relativeToSpace(playerCoords, [this.x, this.y, this.z], [this.normal[0], this.normal[1], 0]);
		}
	}

	tick() {
		super.getCameraDist();
		this.collideWithPlayer();
	}
}

class Tile_Box_Spun extends Tile_Box {
	constructor(x, y, z, size, normal, parent, tilePosition) {
		super(x, y, z, size, [normal[0], normal[1] + (Math.PI * 0.25)], parent, tilePosition);
	}

	calculatePointsAndNormal() {
		var len = 1 / Math.sqrt(2);
		var points = [	[-1, len, -len], [-1, len, len], [1, len, len], [1, len, -len],
						[-1, -len, -len], [-1, -len, len], [1, -len, len], [1, -len, -len]];
		
		var rPoint = [0, 0, -10];
		rPoint = transformPoint(rPoint, [0, 0, 0], this.normal, 1);

		for (var p=0; p<points.length; p++) {
			points[p] = transformPoint(points[p], [this.x, this.y, this.z], this.normal, this.size + 0.5);
		}
		
		this.points = points;
		this.rPoint = [rPoint[0] + this.x, rPoint[1] + this.y, rPoint[2] + this.z];
		this.dir_right = cartToPol(rPoint[0], rPoint[1], rPoint[2]);
		this.dir_down = this.normal;
		this.size -= player.r * 0.6;
	}
}

class Tile_Bright extends Tile {
	constructor(x, y, z, size, normal, parent, tilePosition, color) {
		super(x, y, z, size, normal, parent, tilePosition, color);
	}

	getColor() {
		return `hsl(${this.color.h}, ${this.color.s}%, ${linterp(70, 25, clamp((this.playerDist / render_maxColorDistance) * 0.5, 0.1, 1))}%)`
	}
}

class Tile_Conveyor extends Tile {
	constructor(x, y, z, size, normal, parent, tilePosition) {
		super(x, y, z, size, normal, parent, tilePosition, RGBtoHSV("#69beff"));
		this.secondaryColor = RGBtoHSV("#616bff");
	}

	doCollisionEffects() {
		super.doCollisionEffects();
		this.doSpeedEffects();
	}

	doSpeedEffects() {
		if (player.dz < player.dMax * 2) {
			player.dz += physics_conveyorStrength;
		}
	}

	calculatePointsAndNormal() {
		super.calculatePointsAndNormal();
		var points = [	[-1, 0, -1], [-1, 0, 1], [1, 0, 0.1], [1, 0, -0.1]];
		for (var p=0; p<points.length; p++) {
			points[p] = transformPoint(points[p], [this.x, this.y, this.z], this.normal, this.size + 0.5);
		}
		this.triPoints = points;
	}

	getSecondaryColor() {
		return `hsl(${this.secondaryColor.h}, ${linterp(this.secondaryColor.s, 0, clamp((this.playerDist / render_maxColorDistance) * (1 / (this.parent.power + 0.001)), 0.1, 1))}%, ${linterp(70, 0, clamp((this.playerDist / render_maxColorDistance) * (1 / (this.parent.power + 0.001)), 0.1, 1))}%)`;
	}
	
	beDrawn() {
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

	calculatePointsAndNormal() {
		super.calculatePointsAndNormal();
		var points = [[-1, 0, -0.1], [-1, 0, 0.1], [1, 0, 1], [1, 0, -1]];
		for (var p=0; p<points.length; p++) {
			points[p] = transformPoint(points[p], [this.x, this.y, this.z], this.normal, this.size + 0.5);
		}
		this.triPoints = points;
	}

	doSpeedEffects() {
		if (player.dz > player.dMax * 0.4) {
			player.dz -= physics_conveyorStrength * 3;
		}
	}
}

class Tile_Conveyor_Left extends Tile_Conveyor {
	constructor(x, y, z, size, normal, parent, tilePosition) {
		super(x, y, z, size, normal, parent, tilePosition);
	}

	calculatePointsAndNormal() {
		super.calculatePointsAndNormal();
		var points = [[-0.1, 0, -1], [-1, 0, 1], [1, 0, 1], [0.1, 0, -1]];
		for (var p=0; p<points.length; p++) {
			points[p] = transformPoint(points[p], [this.x, this.y, this.z], this.normal, this.size + 0.5);
		}
		this.triPoints = points;
		//rotate by 18.5° the other way
		this.dir_down = [this.normal[0], this.normal[1] - ((Math.PI * 2) / 19.459)];
		this.cameraRot = this.dir_down[1];
	}

	doSpeedEffects() {
		player.dx += physics_conveyorStrength * 3;
	}
}

class Tile_Conveyor_Right extends Tile_Conveyor {
	constructor(x, y, z, size, normal, parent, tilePosition) {
		super(x, y, z, size, normal, parent, tilePosition);
	}

	calculatePointsAndNormal() {
		super.calculatePointsAndNormal();
		var points = [[-1, 0, -1], [-0.1, 0, 1], [0.1, 0, 1], [1, 0, -1]];
		for (var p=0; p<points.length; p++) {
			points[p] = transformPoint(points[p], [this.x, this.y, this.z], this.normal, this.size + 0.5);
		}
		this.triPoints = points;
		//rotate by 18.5°
		this.dir_down = [this.normal[0], this.normal[1] + ((Math.PI * 2) / 19.459)];
		this.cameraRot = this.dir_down[1];
	}

	doSpeedEffects() {
		player.dx -= physics_conveyorStrength * 3;
	}
}

class Tile_Crumbling extends Tile {
	constructor(x, y, z, size, normal, parent, tilePosition) {
		super(x, y, z, size, normal, parent, tilePosition, {h: 0, s: 0});
		this.requiresOrdering = true;
		this.activeSize = this.size;

		this.home = [this.x, this.y, this.z];

		this.fallStatus = undefined;
		this.fallRate = -0.5;
	}

	calculatePointsAndNormal() {
		if (this.activeSize == undefined) {
			this.activeSize = this.size;
		}
		this.points = [[-1, 0, -1], [-1, 0, 1], [1, 0, 1], [1, 0, -1]];
		
		var rPoint = [0, 0, -10];
		rPoint = transformPoint(rPoint, [0, 0, 0], this.normal, 1);

		for (var p=0; p<this.points.length; p++) {
			this.points[p] = transformPoint(this.points[p], [this.x, this.y, this.z], this.normal, this.activeSize + 0.5);
		}

		this.line1 = [transformPoint([0.5, 0, 0.5], [this.x, this.y, this.z], this.normal, this.activeSize), transformPoint([-0.5, 0, -0.5], [this.x, this.y, this.z], this.normal, this.activeSize)];
		this.line2 = [transformPoint([-0.5, 0, 0.5], [this.x, this.y, this.z], this.normal, this.activeSize), transformPoint([0.5, 0, -0.5], [this.x, this.y, this.z], this.normal, this.activeSize)];
		this.rPoint = [rPoint[0] + this.x, rPoint[1] + this.y, rPoint[2] + this.z];

		this.dir_right = cartToPol(rPoint[0], rPoint[1], rPoint[2]);
		this.dir_down = this.normal;
	}

	collideWithPlayer() {
		//only do if large enough
		if (this.activeSize > 0.01) {
			super.collideWithPlayer();
		}
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
				ctx.strokeStyle = `hsl(0, 0%, ${linterp(50, 0, this.playerDist / render_maxColorDistance)}%)`;
				drawWorldLine(this.line1[0], this.line1[1]);
				drawWorldLine(this.line2[0], this.line2[1]);
			}
		}
	}

	//yes I have three functions for this one behavior. No I'm not proud of it. But it works (:
	doCollisionEffects() {
		super.doCollisionEffects();
		//only crumble if not a child
		if (!(player instanceof Child) || player.jumpBuffer > 0) {
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
			this.parent.strips[strip].tiles[num].fallStatus = 0;
			this.parent.strips[strip].tiles[num].propogateCrumble();
		}
	}
}

class Tile_Ice extends Tile {
	constructor(x, y, z, size, normal, parent, tilePosition) {
		super(x, y, z, size, normal, parent, tilePosition, {h: 185, s: 9});
	}

	getColor() {
		return `hsl(${this.color.h}, ${linterp(this.color.s, 0, clamp((this.playerDist / render_maxColorDistance) * (1 / (this.parent.power + 0.001)), 0.1, 1))}%, ${linterp(100, 10, clamp((this.playerDist / render_maxColorDistance) * (1 / (this.parent.power + 0.001)), 0.1, 1))}%)`;
	}

	doCollisionEffects() {
		super.doCollisionEffects();
		player.onIce = true;
	}
}

class Tile_Ice_Ramp extends Tile_Ice {
	constructor(x, y, z, size, normal, parent, tilePosition) {
		super(x, y, z, size, normal, parent, tilePosition);
		this.requiresOrdering = true;
	}

	calculatePointsAndNormal() {
		var points = [[-1, 0, -1], [-1, 0, 1], [-1 + Math.sqrt(3), 0.5, 1], [-1 + Math.sqrt(3), 0.5, -1]];
		
		var rPoint = [0, 0, -10];
		rPoint = transformPoint(rPoint, [0, 0, 0], this.normal, 1);

		for (var p=0; p<points.length; p++) {
			points[p] = transformPoint(points[p], [this.x, this.y, this.z], this.normal, this.size + 0.5);
		}
		
		this.points = points;
		[this.x, this.y, this.z] = avgArray(this.points);
		this.dir_down = this.normal;
		this.normal = calculateNormal(this.points);
		this.rPoint = [rPoint[0] + this.x, rPoint[1] + this.y, rPoint[2] + this.z];
		this.dir_right = cartToPol(rPoint[0], rPoint[1], rPoint[2]);
	}

	doCollisionEffects() {
		super.doCollisionEffects();
		//push player up a bit
		player.dy = 1.2;
		player.onground = physics_graceTimeRamp;
	}
}

class Tile_Ramp extends Tile {
	constructor(x, y, z, size, normal, parent, tilePosition, color) {
		super(x, y, z, size, normal, parent, tilePosition, color);
		this.requiresOrdering = true;
	}

	calculatePointsAndNormal() {
		var points = [[-1, 0, -1], [-1, 0, 1], [-1 + (2 / Math.sqrt(2)), (2 / Math.sqrt(2)), 1], [-1 + (2 / Math.sqrt(2)), (2 / Math.sqrt(2)), -1]];
		
		var rPoint = [0, 0, -10];
		rPoint = transformPoint(rPoint, [0, 0, 0], this.normal, 1);

		for (var p=0; p<points.length; p++) {
			points[p] = transformPoint(points[p], [this.x, this.y, this.z], this.normal, this.size + 0.5);
		}
		
		this.points = points;
		[this.x, this.y, this.z] = avgArray(this.points);
		this.dir_down = this.normal;
		this.normal = calculateNormal(this.points);
		this.rPoint = [rPoint[0] + this.x, rPoint[1] + this.y, rPoint[2] + this.z];
		this.dir_right = cartToPol(rPoint[0], rPoint[1], rPoint[2]);
	}

	doCollisionEffects() {
		super.doCollisionEffects();
		//push player up a bit
		player.dy = 3;
		player.onground = physics_graceTimeRamp;
	}

	playerIsOnTop() {
		return (super.playerIsOnTop || spaceToRelative([player.x, player.y, player.z], [this.x, this.y, this.z], [this.parent.theta, 0, 0]));
	}
}

class Tile_Vertical extends Tile {
	constructor(x, y, z, size, normal, parent, tilePosition, color) {
		super(x, y, z, size, normal, parent, tilePosition, color);
	}
}