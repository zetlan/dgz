
class Player {
	constructor(x, y) {
		this.x = x;
		this.y = y;

		this.dx = 0;
		this.dy = 0;
		this.dMax = 2;

		this.ax = 0;
		this.ay = 0;
		this.speed = 0.07;

		this.friction = 0.875;

		this.r = 6;

		this.energy = 1;
		this.energyDepleteNatural = 0;
	}

	tick() {
		this.dx += this.ax * this.speed * sigmoid((Math.abs(this.dx - this.dMax * this.ax) / this.dMax) * 12 - 6, 0, 1);
		this.dy += this.ay * this.speed * sigmoid((Math.abs(this.dy - this.dMax * this.ay) / this.dMax) * 12 - 6, 0, 1);

		//natural friction
		if (this.dx * this.ax <= 0) {
			this.dx *= this.friction;
		}

		if (this.dy * this.ay <= 0) {
			this.dy *= this.friction;
		}

		//cap x and y to world boundaries
		this.x = clamp(this.x + this.dx, -camera.limitX, camera.limitX);
		this.y = clamp(this.y + this.dy, -camera.limitY, camera.limitY);
	}

	beDrawn() {
		var [drawX, drawY] = spaceToScreen(this.x, this.y);
		ctx.fillStyle = color_player;
		ctx.beginPath();
		drawCircle(drawX, drawY, this.r * camera.scale);
		ctx.fill();
	}
}

class Orb {
	constructor(x, y, layers) {
		this.x = x;
		this.y = y;

		this.layers = layers;
		this.layersCurrent = layers;

		this.animTime = 0;
		this.animTimeMax = orb_animTime;

		this.r = orb_radius;
	}

	tick() {
		if (this.layersCurrent <= 0) {
			return;
		}

		//if player is inside self, pop and push player out
		var pXDist = this.x - player.x;
		var pYDist = this.y - player.y;

		if (Math.sqrt(pXDist * pXDist + pYDist * pYDist) < this.r + player.r) {
			this.layersCurrent -= 1;
			this.animTime = 1;
			var dir = Math.atan2(pYDist, pXDist) + Math.PI;
			[player.x, player.y] = polToXY(this.x, this.y, dir, this.r + player.r);
			[player.dx, player.dy] = polToXY(0, 0, dir, player.dMax * (0.4 + 0.05 * this.layersCurrent));
		}
	}

	beDrawn() {
		//don't be drawn if these conditions are met
		if (this.layersCurrent == 0 && !editor_active) {
			return;
		}

		var [drawX, drawY] = spaceToScreen(this.x, this.y);

		ctx.fillStyle = color_orbs[Math.min(this.layersCurrent, color_orbs.length-1)];
		ctx.strokeStyle = ctx.fillStyle;
		//color of self's ring changes if editor is active
		if (editor_active) {
			ctx.strokeStyle = (this == editor_selected) ? color_editor_selection : color_editor_orb;
		}
		

		//ring
		ctx.beginPath();
		drawCircle(drawX, drawY, this.r * camera.scale);
		ctx.stroke();

		//circle

		//circle
		ctx.globalAlpha = orb_opacity;
		ctx.beginPath();
		drawCircle(drawX, drawY, this.r * camera.scale);
		ctx.fill();
		ctx.globalAlpha = 1;
	}

	reset() {
		this.layers = this.layersCurrent;
	}
}


class Monster {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.r = monster_radius;

		this.homeX = x;
		this.homeY = y;
		this.npTime = 0;
		this.npTimeMax = 150;

		this.friction = 0.8;
		this.playerFriction = 0.97;
		this.dx = 0;
		this.dy = 0;
		this.dMax = 2.1;

		this.speed = 0.2;
		this.dir = 0;

		this.target = [0, 0];
		this.eyeOffset = [0, 0];
		this.followDist = 165;
	}

	tick() {
		if (editor_active) {
			this.x = this.homeX;
			this.y = this.homeY;
			return;
		}
		//set target
		this.setTarget();

		//path towards target
		if (this.target != undefined) {
			var xOff = this.target[0] - this.x;
			var yOff = this.target[1] - this.y;
			this.dir = Math.atan2(yOff, xOff);
		}

		//actual position + momentum updating
		var off = polToXY(0, 0, this.dir, this.speed);
		this.dx *= this.friction;
		this.dy *= this.friction;
		this.dx = clamp(this.dx + off[0], -this.dMax, this.dMax);
		this.dy = clamp(this.dy + off[1], -this.dMax, this.dMax);

		this.x = clamp(this.x + this.dx, -camera.limitX, camera.limitX);
		this.y = clamp(this.y + this.dy, -camera.limitY, camera.limitY);

		this.collide();
	}

	beDrawn() {
		var loc = spaceToScreen(this.x, this.y);
		var sz = camera.scale * this.r;

		if (loc[0] > 0 - sz && loc[1] > 0 - sz && loc[0] < canvas.width + sz && loc[1] < canvas.height + sz) {
			ctx.globalAlpha = 0.5;
			ctx.fillStyle = color_monster;
			ctx.beginPath();
			drawCircle(loc[0], loc[1], sz);
			ctx.fill();
			drawCircle(loc[0], loc[1], sz * 0.8);
			ctx.fill();

			//eye
			var newEyeOff = polToXY(0, 0, this.dir, sz * 0.3);
			this.eyeOffset[0] = (5 * this.eyeOffset[0] + newEyeOff[0]) / 6;
			this.eyeOffset[1] = (5 * this.eyeOffset[1] + newEyeOff[1]) / 6;
			
			ctx.fillStyle = color_monster_eye;
			drawCircle(loc[0] + this.eyeOffset[0], loc[1] + this.eyeOffset[1], sz * 0.4);
			ctx.fill();
			ctx.globalAlpha = 1;
		}
	}

	collide() {
		if (game_dynamicObjects.length < 3) {
			return;
		}

		//collide with other monsters
		var xDist;
		var yDist;
		var dist;
		for (var m=0; m<game_dynamicObjects.length; m++) {
			if (game_dynamicObjects[m] != this && game_dynamicObjects[m] != player) {
				xDist = game_dynamicObjects[m].x - this.x;
				yDist = game_dynamicObjects[m].y - this.y;
				dist = Math.sqrt(xDist * xDist + yDist * yDist);
				if (dist < this.r * 2) {
					//get the distance, push self away and push other entity away
					var unitDist = [xDist / dist * Math.sign(xDist), yDist / dist * Math.sign(yDist)];
					var requiredMore = ((this.r * 2) - dist) / 2;

					this.x += unitDist[0] * requiredMore;
					this.y += unitDist[1] * requiredMore;

					game_dynamicObjects[m].x -= unitDist[0] * requiredMore;
					game_dynamicObjects[m].y -= unitDist[1] * requiredMore;
				}
			}
			
		}
	}

	reset() {
		this.x = this.homeX;
		this.y = this.homeY;
		this.dx = 0;
		this.dy = 0;
	}

	setTarget() {
		var pXDist = this.x - player.x;
		var pYDist = this.y - player.y;
		var pDist = Math.sqrt(pXDist * pXDist + pYDist * pYDist);

		//if player's close enough, the target is the player. If player is too far, target is random spot chosen every once in a while.
		if (pDist < this.followDist) {
			this.npTime = 0;
			this.target = [player.x, player.y];

			//if close enough, slow down the player
			if (pDist < player.r + this.r - 1) {
				player.dx *= this.playerFriction;
				player.dy *= this.playerFriction;
			}
		} else {
			//count up time without player
			this.npTime += 1;
			var newCoords;

			//if np time is too great, return close to home
			if (this.npTime > this.npTimeMax) {
				if (Math.random() < 0.01) {
					newCoords = [this.homeX + randomBounded(-150, 150), this.homeY + randomBounded(-150, 150)];
					this.target = [clamp(newCoords[0], -camera.limitX, camera.limitX), clamp(newCoords[1], -camera.limitY, camera.limitY)];
				}
			} else if (Math.random() < 0.015) {
				//choose a random target nearby
				newCoords = polToXY(this.x, this.y, this.dir + randomBounded(-0.5, 0.5), 150);
			}
			if (newCoords != undefined) {
				this.target = [clamp(newCoords[0], -camera.limitX, camera.limitX), clamp(newCoords[1], -camera.limitY, camera.limitY)];
			}
		}
	}
}