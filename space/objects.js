
//a system contains center bodies, outer bodies, and debris
//coordinates of bodies are all relative to the system
class System {
	constructor(x, y, dx, dy, centerBodies, outerBodies, debrisMax) {
		this.x = x;
		this.y = y;
		this.dx = dx;
		this.dy = dy;

		this.r = 10;
		this.m = 1;

		this.centers = centerBodies;
		this.bodies = outerBodies;
		this.debris = [];
		this.debrisMaxNum = debrisMax;
	}

	tick() {
		//adding debris, as they run into or out of the universe rather often
		if (this.debris.length < this.debrisMaxNum) {
			if (time % 30 == 1) {
				//random dust
				var posX = this.x + ((Math.random() - 0.5) * 2000);
				var posY = this.y + ((Math.random() - 0.5) * 2000);
				this.debris.push(new Debris(posX, posY));
			}
		}

		//debris
		for (var w=0;w<this.debris.length;w++) {
			//debris-body interaction
			this.centers.forEach(a => {a.gravitate(this.debris[w]);});
			this.bodies.forEach(b => {b.gravitate(this.debris[w]);});

			this.debris[w].tick();

			//debris-player interaction
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

		//player-body interaction
		this.centers.forEach(a => {a.gravitate(character);});
		this.bodies.forEach(b => {b.gravitate(character);});

		//center-body interaction
		this.centers.forEach(a => {
			this.bodies.forEach(b => {a.gravitate(b);});
		});
		//center-center interaction
		this.centers.forEach(a => {
			this.centers.forEach(b => {
				if (a != b) {
					a.gravitate(b);
				}
			});
		});

		//moving things
		this.bodies.forEach(a => {a.tick();});
		this.centers.forEach(b => {b.tick();});

		//character input handling
		character.recieveInput();
		character.tick();
	}

	beDrawn() {
		//drawing everything
		this.centers.forEach(a => {a.beDrawn();});
		this.bodies.forEach(b => {b.beDrawn();});
		this.debris.forEach(c => {c.beDrawn();});
		character.beDrawn();
	}

	gravitate(entity) {
		
	}
}

//splitting up the system into types of system
class SystemOrbiting extends System {
	constructor(orbitingBody, apoapsis, periapsis, apoapsisAngleRADIANS, startAngleRADIANS, counterClockwiseBOOLEAN, centerBodies, outerBodies, debrisMax) {
		var [x, y, dx, dy] = calculateOrbitalParameters(orbitingBody, apoapsis, periapsis, apoapsisAngleRADIANS, startAngleRADIANS, counterClockwiseBOOLEAN);
		super(x, y, dx, dy, centerBodies, outerBodies, debrisMax);
	}
}

//

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
			ctx.ellipse(tempXY[0], tempXY[1], this.r * camera.scale * multiplier, this.r * camera.scale * multiplier, 0, 0, Math.PI * 2);
			ctx.fill();
			//all other rings
			var mult = 2.5;
			var ga;
			for (ga=4;ga>0;ga--) {
				ctx.globalAlpha = ga / 10;
				ctx.ellipse(tempXY[0], tempXY[1], this.r * camera.scale * mult, this.r * camera.scale * mult, 0, 0, Math.PI * 2);
				ctx.fill();
				mult += 2.5;
			}
			ctx.globalAlpha = 1;
			ctx.closePath();
		}
		//if in map mode
		if (gameState == 2 && this.parent != undefined) {
			var tempXY = spaceToScreen(this.parent.x, this.parent.y);
			ctx.beginPath();
			ctx.lineWidth = 2;
			ctx.strokeStyle = this.c;
			ctx.ellipse(tempXY[0], tempXY[1], this.r * camera.scale, this.r * camera.scale, 0, 0, Math.PI * 2);
			ctx.stroke();
		}
	}

	//changes the thing's dx / dy based off of mass 
	gravitate(thing) {
		//atan2 does y, x instead of x, y for some reason, so I adjust by subtracting Pi.
		var xDist = thing.x - this.x;
		var yDist = thing.y - this.y;
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
		super(x, y, dx, dy, radius, mass, hasAtmosphereBOOLEAN, color);
		this.parent = orbitingBody;
	}

	beDrawn() {
		if (this.atmo){
			//main body
			ctx.fillStyle = this.color;
			ctx.beginPath();
			var tempXY = spaceToScreen(this.x, this.y);
			ctx.ellipse(tempXY[0], tempXY[1], this.r * camera.scale, this.r * camera.scale, 0, 0, Math.PI * 2);
			ctx.fill();
			
			if (this.atmo) {
				//all other rings
				var ga;
				for (ga=2;ga>0;ga--) {
					ctx.globalAlpha = 1 / (ga + 1);
					ctx.beginPath();
					ctx.ellipse(tempXY[0], tempXY[1], this.r * camera.scale * ((ga + 4) / 4), this.r * camera.scale * ((ga + 4) / 4), 0, 0, Math.PI * 2);
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
		if (this.pow > 0 && this.fuel > 0) {
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
		if (this.timeout > 0) {
			this.timeout++;
			gameState = 1;
			if (this.warm > 33) {
				ctx.fillStyle = color_player;
			} else {
				ctx.fillStyle = coolExplosionColor;
			}
			
			ctx.ellipse(tempXY[0], tempXY[1], this.timeout / 4, this.timeout / 4, 0, 0, Math.PI * 2);
			ctx.fill();
		
			if (this.timeout > cutsceneTime * 3) { 
				gameState = 0;
				time = 10;
			}
		}
		ctx.globalAlpha = 1;
	}
	
	destroy() {
		if (this.timeout == 0) {
			this.timeout = 1;
			dt = 10000;
		}
	}
	
	end() {
		this.ax = 0;
		this.ay = 0;
		this.tele = 1;
	}
}

//creates an easily visible perfectly circular ring
class Ring {
	constructor(parentBody, apoapsisHeight, periapsisHeight, angleOfApoapsis) {
		
		this.major = (apoapsisHeight + periapsisHeight) / 2;
		this.minor = Math.sqrt(apoapsisHeight * periapsisHeight);
		this.color = "#FFF";
		this.physical = true;
		this.a = angleOfApoapsis;
		this.highlightA = 0;
		this.parent = parentBody;

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

	}

	gravitate(body) {

	}
}