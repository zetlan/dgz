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
			//console.log(world_camera.targetRot, (this.cameraRot + (Math.PI * 1.5)) % (Math.PI * 2));
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
}

class Tile_Box extends Tile {
	constructor(x, y, z, size, normal, parent, tilePosition) {
		super(x, y, z, size, normal, parent, tilePosition, {h: 0, s: 100});

		//create child tiles
		this.children = [];
		for (var s=0; s<4; s++) {
			var offset = polToCart(this.normal[0], this.normal[1] + ((Math.PI * 0.5) * s), this.size / 2);
			this.children.push(new Tile(this.x + offset[0], this.y + offset[1], this.z + offset[2], this.size, [this.normal[0], this.normal[1] + ((Math.PI * 0.5) * s)], this.parent, this.parentPosition, {h: 0, s: 0}));
		}
		this.requiresOrdering = true;
	}

	getCameraDist() {
		super.getCameraDist();
		//only get camera distance for children if close enough
		this.children.forEach(c => {
			c.getCameraDist();
		});
	}

	beDrawn() {
		this.children.forEach(c => {
			c.beDrawn();
		});
	}

	collideWithPlayer() {
		//only collide if close enough
		if (this.playerDist < (this.size * 1.75) + player.r) {
			this.children.forEach(c => {
				c.collideWithPlayer();
			});
		}
	}

	tick() {
		this.getCameraDist();
		if (world_time % 3 == 2) {
			this.children = orderObjects(this.children, 4);
		}
		this.collideWithPlayer();
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


class Tile_Crumbling extends Tile {
	constructor(x, y, z, size, normal, parent, tilePosition) {
		super(x, y, z, size, normal, parent, tilePosition, {h: 0, s: 0});
		this.requiresOrdering = true;
		this.line1 = [transformPoint([0.5, 0, 0.5], [x, y, z], this.normal, size), transformPoint([-0.5, 0, -0.5], [x, y, z], this.normal, size)];
		this.line2 = [transformPoint([-0.5, 0, 0.5], [x, y, z], this.normal, size), transformPoint([0.5, 0, -0.5], [x, y, z], this.normal, size)];

		this.home = [this.x, this.y, this.z];

		this.fallStatus = undefined;
		this.fallRate = -0.5;
	}

	tick() {
		super.tick();
		if (this.fallStatus != undefined) {
			this.fallStatus += 1;

			if (this.fallStatus > 0) {
				//fall downward
				var changeBy = polToCart(this.normal[0], this.normal[1], this.fallRate);
				this.x += changeBy[0];
				this.y += changeBy[1];
				this.z += changeBy[2];

				//recalculate points
				this.points.forEach(p => {
					p[0] += changeBy[0];
					p[1] += changeBy[1];
					p[2] += changeBy[2];
				});

				this.line1.forEach(p => {
					p[0] += changeBy[0];
					p[1] += changeBy[1];
					p[2] += changeBy[2];
				});

				this.line2.forEach(p => {
					p[0] += changeBy[0];
					p[1] += changeBy[1];
					p[2] += changeBy[2];
				});

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

		//recalculating points
		var difference = [this.home[0] - this.x, this.home[1] - this.y, this.home[2] - this.z];
		[this.x, this.y, this.z] = this.home;

		//recalculate points
		this.points.forEach(p => {
			p[0] += difference[0];
			p[1] += difference[1];
			p[2] += difference[2];
		});

		this.line1.forEach(p => {
			p[0] += difference[0];
			p[1] += difference[1];
			p[2] += difference[2];
		});

		this.line2.forEach(p => {
			p[0] += difference[0];
			p[1] += difference[1];
			p[2] += difference[2];
		});
	}

	beDrawn() {
		super.beDrawn();
		if (this.playerDist / render_maxColorDistance < 0.95) {
			ctx.strokeStyle = `hsl(0, 0%, ${linterp(50, 0, this.playerDist / render_maxColorDistance)}%)`;
			drawWorldLine(this.line1[0], this.line1[1]);
			drawWorldLine(this.line2[0], this.line2[1]);
		}
	}

	//yes I have three functions for this one behavior. No I'm not proud of it. But it works (:
	doCollisionEffects() {
		super.doCollisionEffects();
		this.fallStatus = 0;
		this.propogateCrumble();
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
}

class Tile_Vertical extends Tile {
	constructor(x, y, z, size, normal, parent, tilePosition, color) {
		super(x, y, z, size, normal, parent, tilePosition, color);
	}
}