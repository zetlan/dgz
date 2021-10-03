
//I feel I should be writing more insightful comments but I don't really know what to say
//player
class Player {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.dx = 0;
		this.dy = 0;
		this.ax = 0;
		this.ay = physics_gravity;

		this.r = 0.3;
		//the farthest x + y distance you can get from the center and still be inside the circle
		this.innerR = this.r * Math.sqrt(2) * 0.4;

		this.dMax = 0.2;
		this.fallMax = 0.99;

		this.friction = physics_friction;
		this.speed = 0.007;
		this.jumpStrength = 0.22;

		this.onGround = true;

		this.dir = [0, 0];

		this.carrying = undefined;
		this.carryThrowForce = 0.05;
	}

	//verbose collision code with sub-optimal physics? Sure! I have no idea what I'm doing. I wanted the boxes to rotate but I have realized I have no idea how to do that. Smarter people probably could.
	tick() {
		//update velocity
		//friction
		if (this.dx * this.ax <= 0) {
			this.dx *= this.friction;
		}
		this.dx = clamp(this.dx + this.ax, -this.dMax, this.dMax);
		this.dy = clamp(this.dy + this.ay, -this.fallMax, this.fallMax);

		//update direction
		if (this.ax != 0) {
			this.dir[0] = clamp(this.dir[0] + Math.sign(this.ax) * 0.2, -1, 1);
		}
		if (this.ay != 0) {
			this.dir[1] = this.dy / this.fallMax;
		}



		//update position
		var colPoints = [
			[this.x + this.r, this.y + this.r],
			[this.x + this.r, this.y - this.r],
			[this.x - this.r, this.y + this.r],
			[this.x - this.r, this.y - this.r]
		]
		var problemFound = false;
		for (var p=0; p<colPoints.length; p++) {
			if (findObstacleAtPosition(colPoints[p][0] + this.dx, colPoints[p][1], this) != undefined) {
				problemFound = true;
				p = colPoints.length + 1;
			}
		}

		if (!problemFound) {
			this.x += this.dx;
		} else {
			this.dx = 0;
		}

		colPoints = [
			[this.x + this.r, this.y + this.r],
			[this.x + this.r, this.y - this.r],
			[this.x - this.r, this.y + this.r],
			[this.x - this.r, this.y - this.r]
		]

		problemFound = false;
		for (var p=0; p<colPoints.length; p++) {
			if (findObstacleAtPosition(colPoints[p][0], colPoints[p][1] + this.dy, this) != undefined) {
				problemFound = true;
				p = colPoints.length + 1;
			}
		}

		if (!problemFound) {
			this.y += this.dy;
		} else {
			//only set onGround if colliding while moving downwards. this isn't a perfect system but oh well
			if (this.dy > 0) {
				this.onGround = true;
			}
			this.dy = 0;
		}

		colPoints = [
			[this.x + this.r, this.y + this.r],
			[this.x + this.r, this.y - this.r],
			[this.x - this.r, this.y + this.r],
			[this.x - this.r, this.y - this.r]
		]

		//if there's still a problem now, push player out
		problemFound = false;
		var object = undefined;
		for (var p=0; p<colPoints.length; p++) {
			if (findObstacleAtPosition(colPoints[p][0], colPoints[p][1], this) != undefined) {
				problemFound = true;
				object = findObstacleAtPosition(colPoints[p][0], colPoints[p][1], this);
				p = colPoints.length + 1;
			}
		}
		if (object != undefined) {
			//the player can pull themselves out of free blocks
			if (object.constructor.name == "String") {
				this.y -= 0.1;
			}
		}
	}

	beDrawn() {
		var dCoords = spaceToScreen(this.x, this.y);
		//body
		drawCircle(dCoords[0], dCoords[1], this.r * camera.scale, color_player);

		//eye-thing?
		var offset = [this.dir[0] * this.innerR * camera.scale, this.dir[1] * this.innerR * camera.scale];
		drawCircle(dCoords[0] + offset[0], dCoords[1] + offset[1], this.r * camera.scale * 0.2, "#404");

		//block if carrying
		if (this.carrying != undefined) {
			this.carrying.x = this.x;
			this.carrying.y = this.y - 1;
			this.carrying.generatePoints();
			this.carrying.beDrawn();
		}
	}

	pickBlock() {
		var direction = Math.sign(this.dir[0]);

		//if holding a block, drop that one
		if (this.carrying != undefined) {
			var temp = this.carrying;
			this.carrying = undefined;
			entities.push(temp);
			temp.dx = this.dx + (this.carryThrowForce * direction);
			temp.dy = this.dy - this.carryThrowForce * 2;

			//make sure when letting go of a block, it doesn't get stuck in another block
			var baseX = Math.floor(temp.x);
			var baseY = Math.floor(temp.y);

			//do not care if out of bounds
			if (baseX < 0 || baseX > data_map.length - 1 || baseY < 0 || baseY > data_map.length - 1) {
				return;
			}

			//push out of an immediate wall
			if (data_tileCollision.indexOf(data_map[baseY][baseX]) != -1) {
				//player's probably not in a wall, let's take their position
				baseX = Math.floor(player.x);
				baseY = Math.floor(player.y);
				temp.x = baseX + temp.x % 1;
				temp.y = baseY + temp.y % 1;
			}

			//OOB check again! Because! It could have moved out of bounds
			if (baseX < 0 || baseX > data_map.length - 1 || baseY < 0 || baseY > data_map.length - 1) {
				return;
			}

			//left-right wall check
			if (temp.x % 1 < 0.5) {
				if (data_tileCollision.indexOf(data_map[baseY][baseX-1]) != -1) {
					temp.x = baseX + 0.501;
				}
			} else {
				if (data_tileCollision.indexOf(data_map[baseY][baseX+1]) != -1) {
					temp.x = baseX + 0.499;
				}
			}

			//up-down wall check
			if (temp.y % 1 < 0.5) {
				if (data_tileCollision.indexOf(data_map[baseY-1][baseX]) != -1) {
					temp.y = baseY + 0.501;
				}
			} else {
				if (data_tileCollision.indexOf(data_map[baseY+1][baseX]) != -1) {
					temp.y = baseY + 0.499;
				}
			}
			return;
		}
		
		//don't pick up a block if facing the center
		if (direction == 0) {
			return;
		}

		//get the nearest block by extending a ray outwards until it hits something
		var rayIncrement = 0.5 * direction;
		var rayDistance = 0;
		var found;
		while (Math.abs(rayDistance) < physics_reachDistance) {
			found = findObstacleAtPosition(this.x + rayDistance, this.y, this)
			if (found != undefined) {
				//if it's a string, it's a data block and should be removed
				if (found.constructor.name == "String" && data_pickable.indexOf(found) != -1) {
					data_map[Math.floor(this.y)][Math.floor(this.x + rayDistance)] = "0";
					this.carrying = new FreeBlock(found, Math.floor(this.x + rayDistance), Math.floor(this.y));
					return;
				}

				//if it's an entity
				if (found.constructor.name == "FreeBlock") {
					this.carrying = found;
					entities.splice(entities.indexOf(found), 1);
					return;
				}
			}
			rayDistance += rayIncrement;
		}
	}
}




class FreeBlock {
	constructor(type, x, y) {
		this.id = type;
		this.homeX = x;
		this.homeY = y;

		this.x = x;
		this.dx = 0;

		this.y = y;
		this.dy = 0;
		this.ay = physics_gravity;
		
		this.r = 0.5;

		this.dMax = 0.99;
		


		//points, for better collision
		this.axis1 = polToXY(0, 0, this.a, this.r);
		this.axis2 = polToXY(0, 0, this.a + (Math.PI / 2), this.r);
		this.generatePoints();
		this.pointsIntersection = [undefined, undefined, undefined, undefined];
	}

	generatePoints() {
		this.points = [[this.r, this.r], [-this.r, this.r], [-this.r, -this.r], [this.r, -this.r]];
	}

	getPointsIntersecting(xOff, yOff) {
		var xAmount = 0;
		for (var a=0; a<this.points.length; a++) {
			this.pointsIntersection[a] = findObstacleAtPosition(this.x + this.points[a][0] + xOff, this.y + this.points[a][1] + yOff, this);
			xAmount += (this.pointsIntersection[a] != undefined);
		}
		return xAmount;
	}

	//collide with all of the world objects
	collide() {
		//get intersections at each goal point
		var xAmount = this.getPointsIntersecting(this.dx, 0);

		//only continue if each point is good
		if (xAmount == 0) {
			this.x += this.dx;
		} else {
			this.dx = 0;
		}

		//y
		xAmount = this.getPointsIntersecting(0, this.dy);
		if (xAmount == 0) {
			this.y += this.dy;
		} else {
			this.dy = 0;
		}

		//if there's still points intersecting, find the object
		xAmount = this.getPointsIntersecting(0, 0);
		if (xAmount > 0) {
			var obj = (this.pointsIntersection[0] || this.pointsIntersection[1] || this.pointsIntersection[2] || this.pointsIntersection[3]);
			if (obj.constructor.name != "String") {
				//push other away
				var towardsVec = [this.x - obj.x, this.y - obj.y];
				var magnitude = Math.sqrt(towardsVec[0] * towardsVec[0] + towardsVec[1] * towardsVec[1]);
				towardsVec[0] /= magnitude;
				towardsVec[1] /= magnitude;

				obj.x -= towardsVec[0];
				obj.y -= towardsVec[1];
			}
		}
	}

	tick() {
		if (editor_active) {
			data_map[this.homeY][this.homeX] = this.id;
			entities.splice(entities.indexOf(this), 1);
			return;
		}

		//don't tick if offscreen and without substantial momentum
		if (!isOnScreen(this.x, this.y) && Math.abs(this.dy) < this.ay * 4 && Math.abs(this.dx) < 0.05) {
			return;
		}

		//velocity
		this.dy = clamp(this.dy + this.ay, -this.dMax, this.dMax);
		//if at least one point is colliding, do friction
		if (this.getPointsIntersecting(0, this.dy) > 0) {
			this.dx *= physics_friction;
		}

		//position
		this.collide();
	}

	beDrawn() {
		//do not be drawn if too far offscreen
		if (!isOnScreen(this.x, this.y)) {
			return;
		}

		var drawSpot = spaceToScreen(this.x - this.r, this.y - this.r);
		drawMapSquare(drawSpot[0], drawSpot[1], this.id, camera.scale + 1);
	}
}





class NPC {
	constructor(x, y, color, dialogueLines, dialogueSpeed) {
		this.x = x;
		this.y = y;
		this.color = color;
		this.lines = dialogueLines;
		this.textTimeMax = dialogueSpeed;
		this.lineCurrent = 0;
		this.textTime = 0;

		this.r = 0.4;
	}

	tick() {
		if (isOnScreen(this.x, this.y)) {
			//if the player is close enough, start running lines
			var xDist = this.x - player.x;
			var yDist = this.y - player.y;
 
			//is the player in range or not
			if (Math.sqrt(xDist * xDist + yDist * yDist) < physics_reachDistance) {
				//don't go further if out of lines
				if (this.lineCurrent > this.lines.length-1) {
					return;
				}
				this.textTime += 1;
			} else {
				this.textTime -= 1;
				//text will not progress backwards unless at the very end
				if (this.textTime < 0) {
					this.textTime = 0;
					if (this.lineCurrent > this.lines.length - 1) {
						this.lineCurrent -= 1;
					}
					return;
				}
			}

			if (this.textTime >= this.textTimeMax) {
				this.textTime = 0;

				//move to the next line
				this.lineCurrent += 1;
				//move to the next line. If it's a code line, execute that line and skip it.
				while (this.lines[this.lineCurrent] != undefined && this.lines[this.lineCurrent].substring(0, 5) == `CODE~`) {
					eval(this.lines[this.lineCurrent].substring(5));
					this.lineCurrent += 1;
				}
			}
		}
	}

	beDrawn() {
		//be drawn if on screen
		if (isOnScreen(this.x, this.y)) {
			//orb
			var drawCoords = spaceToScreen(this.x, this.y);
			drawCircle(drawCoords[0], drawCoords[1], this.r * camera.scale, this.color);

			//text?
			if (this.textTime > 0) {
				ctx.globalAlpha = 1 - ((2 * (this.textTime / this.textTimeMax) - 1) ** 20);
				ctx.font = `${Math.floor(canvas.height / 30)}px Ubuntu`;
				ctx.fillText(this.lines[this.lineCurrent], drawCoords[0], drawCoords[1] - camera.scale);
				ctx.globalAlpha = 1;
			}
		}
	}
}