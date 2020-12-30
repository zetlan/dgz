
/*a system contains center bodies, outer bodies, and debris
it acts like a little mini main loop, ticking / drawing everything inside, 
Systems are always either fixed or orbiting some body. Their x, y, dx, and dy can't just be set to something to start. By default they're all 0
*/
class System {
	constructor(centerBodies, outerBodies, debrisMax) {
		this.x = 0;
		this.y = 0;
		this.dx = 0;
		this.dy = 0;

		this.prevD = [this.dx, this.dy];

		this.r = 10;
		this.m = 1;

		this.centers = centerBodies;
		this.bodies = outerBodies;
		this.debris = [];
		this.debrisMaxNum = debrisMax;
	}

	//updates radius / mass
	calibrate() {
		this.m = 0;
		this.r = 0;
		var extraAdd = Math.sqrt(Math.pow(canvas.width / (2 * camera.scale_min), 2) + Math.pow(canvas.height / (2 * camera.scale_min), 2));

		this.centers.forEach(a => {
			this.m += a.m;
		});

		this.bodies.forEach(b => {
			//body mass moves around, so it isn't weighted as heavily
			this.m += b.m / 3;
			this.r = Math.max(this.r, b.apoapsis + extraAdd);
		});
	}

	tick() { 
		//system-wide things
		this.x += this.dx / dt;
		this.y += this.dy / dt;

		//adding dx / dy to all bodies in the system
		if (this.prevD[0] != this.dx) {
			this.centers.forEach(a => {a.dx += this.dx - this.prevD[0];});
			this.bodies.forEach(b => {b.dx += this.dx - this.prevD[0];});
			this.debris.forEach(c => {c.dx += this.dx - this.prevD[0];});
		}

		if (this.prevD[1] != this.dy) {
			this.centers.forEach(a => {a.dy += this.dy - this.prevD[1];});
			this.bodies.forEach(b => {b.dy += this.dy - this.prevD[1];});
			this.debris.forEach(c => {c.dy += this.dy - this.prevD[1];});
		}
		this.prevD = [this.dx, this.dy];


		//adding debris, as they run into or out of the universe rather often
		if (this.debris.length < this.debrisMaxNum) {
			if (time % 30 == 1) {
				//random dust
				var posX = this.x + ((Math.random() - 0.5) * 2000);
				var posY = this.y + ((Math.random() - 0.5) * 2000);
				this.debris.push(new Debris(posX, posY));
			}
		}

		//debris interaction
		for (var w=0;w<this.debris.length;w++) {
			//with bodies
			this.centers.forEach(a => {a.gravitate(this.debris[w]);});
			this.bodies.forEach(b => {b.gravitate(this.debris[w]);});

			this.debris[w].tick();

			//with player
			var diffX = Math.abs(character.x - this.debris[w].x);
			var diffY = Math.abs(character.y - this.debris[w].y);
			if (diffX < 10 && diffY < 10) {
				character.debrisHit(this.debris[w].dx, this.debris[w].dy);
				this.debris[w].physical = 0;
			}
			//removing debris
			if (!this.debris[w].physical) {
				this.debris.splice(w, 1);
			}
		}

		//body interaction with player
		this.bodies.forEach(b => {b.gravitate(character);});

		//center interaction
		this.centers.forEach(a => {
			//with bodies
			this.bodies.forEach(b => {a.gravitate(b);});

			//with other centers
			this.centers.forEach(c => {
				if (a != c) {
					a.gravitate(c);
				}
			});

			//with player
			a.gravitate(character);
		});

		//ticking; bodies, centers, and player
		this.bodies.forEach(a => {a.tick();});
		this.centers.forEach(b => {b.tick();});
		character.recieveInput();
		character.tick();
	}

	beDrawn() {
		//drawing everything
		this.centers.forEach(a => {a.beDrawn();});
		this.bodies.forEach(b => {b.beDrawn();});
		this.debris.forEach(c => {c.beDrawn();});
		character.beDrawn();

		//indicator dot
		
		ctx.fillStyle = "#F0F";
		ctx.beginPath();
		var tempXY = spaceToScreen(this.x, this.y);
		ctx.ellipse(tempXY[0], tempXY[1], 5, 5, 0, 0, Math.PI * 2, false);
		ctx.fill();
	}

	gravitate(entity) {
		//given that the entity is outside the system range, treat it as a whole one object
		if (getDistance([entity.x, entity.y], [this.x, this.y]) > this.r) {
			var xDist = entity.x - this.x;
			var yDist = entity.y - this.y;
			var direction = (Math.atan2(xDist, yDist) - (Math.PI));
			var magnitude = (this.m / gravityDampener) / ((xDist * xDist) + (yDist * yDist));
			magnitude = magnitude / dt;
		
			entity.dx += magnitude * Math.sin(direction);
			entity.dy += magnitude * Math.cos(direction);

			var magniAtRadius = (this.m / gravityDampener) / (this.r * this.r);
			magniAtRadius = magniAtRadius / dt;
			if (magnitude >= magniAtRadius) {
				try {
					entity.physical = false;
				}
				catch(error) {
					console.error(`error: attempted entity was not an object able to be given a .physical tag`);
				}
			}
		} else {
			//if the entity is instead inside the system range, make sure that each individual object acts on them (debris have no gravity)
			//centers
			this.centers.forEach(a => {a.gravitate(entity);});

			//bodies
			this.bodies.forEach(b => {b.gravitate(entity);});
		}
	}

	setOrbit(bodyToOrbit, apoH, periH, apoA, startA, ccwBOOL) {
		//first subtract all x, y, dx, and dy given to child objects by the system
		
		this.centers.forEach(a => {
			a.x -= this.x;
			a.y -= this.y;
			a.dx -= this.dx;
			a.dy -= this.dy;
		});
		this.bodies.forEach(b => {
			b.x -= this.x;
			b.y -= this.y;
			b.dx -= this.dx;
			b.dy -= this.dy;
		});
		this.debris.forEach(c => {
			c.x -= this.x;
			c.y -= this.y;
			c.dx -= this.dx;
			c.dy -= this.dy;
		});

		//then set properties to new values
		[this.x, this.y, this.dx, this.dy] = calculateOrbitalParameters(bodyToOrbit, apoH, periH, apoA, startA, ccwBOOL);
		console.log(this.x, this.y, this.dx, this.dy);
		//add values to children
		this.centers.forEach(a => {
			a.x += this.x;
			a.y += this.y;
			a.dx += this.dx;
			a.dy += this.dy;
		});
		this.bodies.forEach(b => {
			b.x += this.x;
			b.y += this.y;
			b.dx += this.dx;
			b.dy += this.dy;
		});
		this.debris.forEach(c => {
			c.x += this.x;
			c.y += this.y;
			c.dx += this.dx;
			c.dy += this.dy;
		});
		this.prevD = [this.dx, this.dy];
	}
}

//all objects that have gravity
class Body {
	constructor(x, y, dx, dy, radius, mass, hasAtmosphereBOOLEAN, color) {
		this.x = x;
		this.y = y;
		this.r = radius;
		this.m = mass;
		this.dx = dx;
		this.dy = dy;
		this.color = color;
		this.atmo = hasAtmosphereBOOLEAN;
		this.parent = undefined;
	}
	
	//draws the object. All the drawing functions for bodies have a built in limiter of 1 px, after that they won't draw smaller
	beDrawn() {
		var tempXY = spaceToScreen(this.x, this.y);
		//multiplier is for the first atmosphere ring, which wobbles in and out.
		var multiplier = 1.5 + (Math.cos((time * 0.5) / (180 / Math.PI)) / 3);
		//main ring
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.ellipse(tempXY[0], tempXY[1], this.r * camera.scale, this.r * camera.scale, 0, 0, Math.PI * 2);
		ctx.fill();
		if (this.atmo) {
			//first atmo ring
			ctx.globalAlpha = 0.5;
			var radius = Math.max(1, this.r * camera.scale * multiplier);
			ctx.ellipse(tempXY[0], tempXY[1], radius, radius, 0, 0, Math.PI * 2);
			ctx.fill();
			//all other rings
			var mult = 2.5;
			var ga;
			for (ga=4;ga>0;ga--) {
				var rad2 = Math.max(1, this.r * camera.scale * mult);
				ctx.globalAlpha = ga / 10;
				ctx.ellipse(tempXY[0], tempXY[1], rad2, rad2, 0, 0, Math.PI * 2);
				ctx.fill();
				mult += 2.5;
			}
			ctx.globalAlpha = 1;
			ctx.closePath();
		}
	}

	//changes the thing's dx / dy based off of mass 
	gravitate(thing) {
		var xDist = thing.x - this.x;
		var yDist = thing.y - this.y;
		//atan2 does y, x instead of x, y for some reason, so I adjust by subtracting Pi.
		var direction = (Math.atan2(xDist, yDist) - (Math.PI));
		//magnitude was annoying to get right, I just messed around with gravitational strength until something looked right.
		var magnitude = (this.m / gravityDampener) / ((xDist * xDist) + (yDist * yDist));
		magnitude = magnitude / dt;
	
		thing.dx += magnitude * Math.sin(direction);
		thing.dy += magnitude * Math.cos(direction);
	
		/*if the thing is experiencing a gravitational force it could only get by being inside the object, destroy it */
		var magniAtRadius = (this.m / gravityDampener) / (this.r * this.r);
		magniAtRadius = magniAtRadius / dt;
		if (magnitude >= magniAtRadius) {
			try {
				thing.physical = false;
			}
			catch(error) {}
		}
	}
	
	tick() {
		this.x += this.dx / dt;
		this.y += this.dy / dt;
	}
}


//planets and stars are types of bodies. The difference between them is stars generate heat and have a larger atmosphere
//planets also generate into stable orbits
class Planet extends Body {
	constructor(orbitingBody, apoapsis, periapsis, apoapsisAngleRADIANS, planetStartAngleRADIANS, counterClockwiseBOOLEAN, radius, mass, hasAtmosphereBOOLEAN, color) {
		var [x, y, dx, dy] = calculateOrbitalParameters(orbitingBody, apoapsis, periapsis, apoapsisAngleRADIANS, planetStartAngleRADIANS, counterClockwiseBOOLEAN);
		console.log(x, y, dx, dy);
		super(x, y, dx, dy, radius, mass, hasAtmosphereBOOLEAN, color);
		this.parent = orbitingBody;
		this.apoapsis = apoapsis;
		this.periapsis = periapsis;
	}

	beDrawn() {
		if (this.atmo){
			//main body
			ctx.fillStyle = this.color;
			ctx.beginPath();
			var tempXY = spaceToScreen(this.x, this.y);
			ctx.ellipse(tempXY[0], tempXY[1], Math.max(1, this.r * camera.scale), Math.max(1, this.r * camera.scale), 0, 0, Math.PI * 2);
			ctx.fill();
			
			if (this.atmo) {
				//all other rings
				var ga;
				for (ga=2;ga>0;ga--) {
					ctx.globalAlpha = 1 / (ga + 1);
					ctx.beginPath();
					var radius = Math.max(1, this.r * camera.scale * ((ga + 4) / 4));
					ctx.ellipse(tempXY[0], tempXY[1], radius, radius, 0, 0, Math.PI * 2);
					ctx.fill();
				}
			}
		} else {
			super.beDrawn();
		}
	}
}

class Star {

}
	
class Debris {
	constructor(x, y, dx, dy) {
		this.x = x;
		this.y = y;
		this.r = 3;
		this.m = 1;
		if (dx === undefined || dy === undefined) {
			this.dx = (Math.random() - 0.7) * (9 / Math.abs(this.x / 750));
			this.dy = (Math.random() - 0.7) * (9 / Math.abs(this.x / 750));
		} else {
			this.dx = dx;
			this.dy = dy;
		}
		
		
		this.physical = true;
	}
	
	tick() {
		this.x += this.dx / dt;
		this.y += this.dy / dt;
	}
	
	beDrawn() {
		ctx.beginPath();
		ctx.fillStyle = debrisColor;
		var tempXY = spaceToScreen(this.x, this.y);
		ctx.ellipse(tempXY[0], tempXY[1], this.r * camera.scale, this.r * camera.scale, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.closePath();
	}
}

class Player {
	constructor(x, y, dx, dy) {
		//ax and ay are acceleration, and change dx/dy. Dx/dy are the ones that change the player's position. This system allows for a space-floaty feel.
		this.x = x;
		this.y = y;

		if (dx != undefined && dy != undefined) {
			this.dx = dx;
			this.dy = dy;
		} else {
			this.dx = 0;
			this.dy = 0;
		}
		this.ax = 0;
		this.ay = 0;
	
		this.timeout = 0;
		this.pow = 50;
		this.fuel = 100;
		this.warm = 50;

		this.tele = 0;
		this.physical = true;
	}
	
	recieveInput() {
		//all this just changes direction based on acceleration and makes sure it's not over it's max speed.
		//factoring in fuel usage for x
		if (this.fuel > 0 && this.pow > 0) {
			this.dx += this.ax / dt;
			this.fuel -= Math.abs(this.ax / dt);
		}
		
		if (this.dx / dt > player_maxSpeed / dt || this.dx / dt < -1 * (player_maxSpeed / dt)) {
			if (this.dx / dt > (player_maxSpeed / dt)) {
				this.dx = player_maxSpeed;
			} else {
				this.dx = -1 * player_maxSpeed;
			}
		}
		
		//for y
		if (this.fuel > 0 && this.pow > 0) {
			this.dy += this.ay / dt;
			this.fuel -= Math.abs(this.ay / dt);
		}
		if (this.dy / dt > player_maxSpeed / dt || this.dy / dt < -1 * (player_maxSpeed / dt)) {
			if (this.dy / dt > (player_maxSpeed / dt)) {
				this.dy = player_maxSpeed;
			} else {
				this.dy = -1 * player_maxSpeed;
			}
		} 
	}
	
	tick() {
		//updating the player and the camera's position
		this.x += this.dx / dt;
		this.y += this.dy / dt;


		//forcing temperature
		if (this.warm < 0) {
			this.warm = 0;
			this.physical = false;
		}
		if (this.warm > 100) {
			this.warm = 100;
			this.physical = false;
		}
		//adjusting power to be within scale
		if (this.pow < 0) {
			this.pow = 0;
		}

		if (this.pow > 100) {
			this.pow = 100;
		}

		if (!this.physical) {
			this.destroy();
		}
	}
	
	debrisHit(dx, dy) {
		var asteroidVelX = dx;
		var asteroidVelY = dy;
		//take a weighted average of the velocities
		var dxAverage = ((6 * this.dx) + asteroidVelX) / 7;
		var dyAverage = ((6 * this.dy) + asteroidVelY) / 7;
		//with this, distances can be negative, but it doesn't matter because I square them anyways
		var xSunDist = this.x - sun.x;
		var ySunDist = this.y - sun.y;
		var dist = Math.sqrt((xSunDist * xSunDist) + (ySunDist * ySunDist));
		//make the weighted average the player's new velocity
		this.dx = dxAverage;
		this.dy = dyAverage;
	
		//give the player power, because asteroids do that I guess
		this.pow += powerIncrement * 16;
	
		/*if the player has collided in a range that suggests being in the belt area, 
		(36-50 sun radii) make the game spawn a new belt object 
		Belt objects also give the player more charge*/
		if (dist > (sun.r * 18) && dist < (sun.r * 25)) {
			beltCreated -= 1;
			this.pow += powerIncrement * 512;
		}
	}
	
	beDrawn() {
		var tempXY = spaceToScreen(this.x, this.y);
		//drawing engine flames
		if (this.pow > 0 && this.fuel > 0 && this.timeout == 0) {
			ctx.beginPath();
			ctx.globalAlpha = 0.7;
			ctx.strokeStyle = engineColor;
			ctx.lineWidth = 5 * camera.scale;
			var mult = -500;
			
			ctx.moveTo(tempXY[0], tempXY[1]);
			ctx.lineTo((tempXY[0]) + (this.ax * mult * camera.scale), tempXY[1]);
			ctx.stroke();
			ctx.moveTo(tempXY[0], tempXY[1]);
			ctx.lineTo(tempXY[0], (tempXY[1]) + (this.ay * mult * camera.scale));
			ctx.stroke();
		}
		//drawing ship
		ctx.fillStyle = color_player;
	
		//alpha based on death
		if (this.timeout > cutsceneTime) {
			ctx.globalAlpha = 0;
		} else {
			ctx.globalAlpha = 1 - (this.timeout / cutsceneTime);
		}
		
		ctx.beginPath();
		ctx.ellipse(tempXY[0], tempXY[1], Math.max(5 * camera.scale, 1), Math.max(5 * camera.scale, 1), 0, 0, Math.PI * 2);
		ctx.fill();
		//drawing explosion
		if (this.timeout > 0 && this.timeout < cutsceneTime * 3) {
			this.timeout++;
			if (this.warm > 33) {
				ctx.fillStyle = color_player;
			} else {
				ctx.fillStyle = coolExplosionColor;
			}
			
			ctx.ellipse(tempXY[0], tempXY[1], this.timeout / 4, this.timeout / 4, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.globalAlpha = 1;
	}
	
	destroy() {
		if (this.timeout == 0) {
			this.timeout = 1;
			gameState = 3;
			dt *= 10;
		}
	}
}

//creates an easily visible perfectly circular ring
class Ring {
	constructor(parentBody, apoapsisHeight, periapsisHeight, angleOfApoapsis) {
		//ring specific things
		this.apoapsis = apoapsisHeight;
		this.periapsis = periapsisHeight;
		this.major = (apoapsisHeight + periapsisHeight) / 2;
		this.minor = Math.sqrt(apoapsisHeight * periapsisHeight);
		this.a = angleOfApoapsis;
		this.highlightA = 0;

		//general things
		this.color = "#FFF";
		this.physical = true;
		this.parent = parentBody;
		this.m = 1;
		this.r = 1;

		//parent body determines position, as it is always at the first focal point
		//amount to offset by
		var length = this.major - periapsisHeight;
		var [offX, offY] = [length * Math.cos(this.a), length * Math.sin(this.a)];
		this.x = this.parent.x + offX;
		this.y = this.parent.y + offY;
	}

	tick() {
	}

	beDrawn() {
		//ring
		ctx.beginPath();
		var tempXY = spaceToScreen(this.x, this.y);
		ctx.strokeStyle = this.color;
		ctx.lineWidth = 2;
		ctx.globalAlpha = 0.2;
		ctx.ellipse(tempXY[0], tempXY[1], this.major * camera.scale, this.minor * camera.scale, this.a, 0, Math.PI * 2, false);
		ctx.stroke();

		//circle on ring
		var length = (this.major * this.minor) / (Math.sqrt(Math.pow(this.minor * Math.cos(this.highlightA), 2) + Math.pow(this.major * Math.sin(this.highlightA), 2)));
		var [x, y] = [length * Math.cos(this.highlightA + this.a), length * Math.sin(this.highlightA + this.a)];
		tempXY = spaceToScreen(this.x + x, this.y + y);
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.ellipse(tempXY[0], tempXY[1], 10 * camera.scale, 10 * camera.scale, 0, 0, Math.PI * 2, false);
		ctx.fill();
		ctx.globalAlpha = 1;

	}

	gravitate(body) {

	}
}