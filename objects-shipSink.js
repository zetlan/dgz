//classes for an astroparty clone





//bullets for causing damage
class Projectile {
	constructor(x, y, dx, dy, parent) {
		this.x = x;
		this.y = y;
		this.dx = dx;
		this.dy = dy;
	}

	beDrawn() {

	}

	tick() {

	}
}

//ship class - the main one for shared behaviors
class Ship {
	constructor(x, y, color) {
		this.color = color;

		//physics things
		this.x = x;
		this.y = y;
		this.rLong = 0.03;
		this.rShort = 0.015;

		this.dx = 0;
		this.dy = 0;
		this.dv = 0.0004;
		this.dMax = 0.05;

		this.av = 0;

		this.friction = 0.99;
		this.aFriction = 0.85;

		this.a = 0;
		this.da = 0;
		this.aa = 0;
		this.aSpeed = Math.PI / 256;
		this.aMax = Math.PI / 32;

		//misc
	}

	beDrawn() {
		this.beDrawn_pos(this.x, this.y);

		//if close to the edges make sure to mirror
		if (!game_map.large) {
			var mirrorX = (this.x < this.rLong || 1 - this.x < this.rLong);
			var mirrorY = (this.y < this.rLong || 1 - this.y < this.rLong);
			if (mirrorX) {
				this.beDrawn_pos(this.x + boolToSigned(this.x < 0.5), this.y);
			}
			if (mirrorY) {
				this.beDrawn_pos(this.x, this.y + boolToSigned(this.y < 0.5));
			}
			if (mirrorX && mirrorY) {
				this.beDrawn_pos(this.x + boolToSigned(this.x < 0.5), this.y + boolToSigned(this.y < 0.5));
			}
		}
	}

	beDrawn_pos(x, y) {
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.moveTo(canvas.width * x, canvas.height * y);
		ctx.ellipse(canvas.width * x, canvas.height * y, canvas.width * this.rLong, canvas.width * this.rShort, this.a, Math.PI * -0.7, Math.PI * 0.7);
		ctx.lineTo(canvas.width * x, canvas.height * y);
		ctx.fill();
	}

	tick() {
		//angular velocity
		if (this.aa == 0) {
			this.da *= this.aFriction;
		}
		this.da = clamp(this.da + this.aa * this.aSpeed, -this.aMax, this.aMax);
		this.a += this.da;

		//directional velocity
		this.dx *= this.friction;
		this.dy *= this.friction;
		var additive = polToXY(0, 0, this.a, this.dv * this.av);

		this.dx += additive[0];
		this.dy += additive[1];

		//speed cap
		var dMag = Math.sqrt(this.dx ** 2 + this.dy ** 2);
		if (dMag > this.dMax) {
			this.dx /= dMag;
			this.dy /= dMag;
			this.dx *= this.dMax;
			this.dy *= this.dMax;
		}

		//position
		this.x += this.dx;
		this.y += this.dy;

		//large maps have no looping
		if (game_map.large) {
			return;
		}

		if (this.x < 0) {
			this.x += 1;
		}
		if (this.x > 1) {
			this.x -= 1;
		}
		if (this.y < 0) {
			this.y += 1;
		}
		if (this.y > 1) {
			this.y -= 1;
		}
	}
}


//here are special types of ship