/*classes can be found in alphabetical order, except for System, which is at the top

index:

System
Body
Camera
Camera_Map
Camera_World
Debris
Planet
Player
Ring




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
		this.color = "#F0F";

		this.centers = centerBodies;
		this.bodies = outerBodies;
		this.debris = [];
		this.debrisMaxNum = debrisMax;

		this.parent = undefined;
		this.ring = undefined;
	}

	//updates radius / mass
	calibrate() {
		this.m = 0;
		this.r = 0;
		this.color = this.centers[0].color;
		var extraAdd = Math.sqrt(Math.pow(canvas.width / (2 * loading_camera.scale_min), 2) + Math.pow(canvas.height / (2 * loading_camera.scale_min), 2));

		this.centers.forEach(a => {
			this.m += a.m;
		});

		this.bodies.forEach(b => {
			this.r = Math.max(this.r, b.apoapsis + extraAdd);
		});
	}

	tick() { 
		//system-wide things
		this.x += this.dx / dt;
		this.y += this.dy / dt;

		//adding dx / dy to all entities in the system
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

		//debris interaction
		for (var h=0; h<this.debris.length; h++) {
			//remove debris that doesn't have this as a parent
			if (this.debris[h].parent != this) {
				this.debris.splice(h, 1);
			} else if (!this.debris[h].physical) {
				//if the debris isn't physical, delete it
				this.debris.splice(h, 1);
			}

			//apply forces to debris (centers + bodies)
			this.centers.forEach(a => {a.gravitateToArray(this.debris[h]);});
			this.bodies.forEach(b => {b.gravitateToArray(this.debris[h]);});
		}
		

		//body interaction with player
		this.bodies.forEach(b => {b.gravitateToArray(character);});

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
			a.gravitateToArray(character);
		});

		//ticking; bodies, centers, and debris
		this.bodies.forEach(a => {a.tick();});
		this.centers.forEach(b => {b.tick();});
		this.debris.forEach(c => {c.tick();});
	}

	beDrawn() {
		//drawing ring if has
		if (this.ring != undefined && loading_camera == camera_map) {
			this.ring.beDrawn();
		}
		//drawing everything
		this.centers.forEach(a => {a.beDrawn();});
		this.bodies.forEach(b => {b.beDrawn();});
		this.debris.forEach(c => {c.beDrawn();});

		//indicator dot
		/*
		ctx.fillStyle = "#F0F";
		ctx.beginPath();
		var tempXY = spaceToScreen(this.x, this.y);
		ctx.ellipse(tempXY[0], tempXY[1], 5, 5, 0, 0, Math.PI * 2, false);
		ctx.fill();
		*/
	}

	gravitate(thing) {
		//given that the entity is outside self's range, treat self as a whole one object
		if (getDistance([thing.x, thing.y], [this.x, this.y]) > this.r) {
			var xDist = thing.x - this.x;
			var yDist = thing.y - this.y;
			var direction = (Math.atan2(xDist, yDist) - (Math.PI));
			var magnitude = (this.m / gravityDampener) / ((xDist * xDist) + (yDist * yDist));
			magnitude = magnitude / dt;
		
			thing.dx += magnitude * Math.sin(direction);
			thing.dy += magnitude * Math.cos(direction);

			var magniAtRadius = (this.m / gravityDampener) / (this.r * this.r);
			magniAtRadius = magniAtRadius / dt;
			if (magnitude >= magniAtRadius) {
				try {
					thing.physical = false;
				}
				catch(error) {
					console.error(`error: attempted entity was not an object able to be given a .physical tag`);
				}
			}
		} else {
			//if the entity is instead inside the system range, make sure that each individual object acts on them (debris have no gravity)
			//centers
			this.centers.forEach(a => {a.gravitate(thing);});

			//bodies
			this.bodies.forEach(b => {b.gravitate(thing);});
		}
	}

	gravitateToArray(thing) {
		//same outside / inside split as with gravitate(), but forces are handled differently
		if (getDistance([thing.x, thing.y], [this.x, this.y]) > this.r) {
			var xDist = thing.x - this.x;
			var yDist = thing.y - this.y;
			var direction = (Math.atan2(xDist, yDist) - (Math.PI));
			var magnitude = (this.m / gravityDampener) / ((xDist * xDist) + (yDist * yDist));
			magnitude = magnitude / dt;
		
			//format is [body, magnitude, change in dx, change in dy]
			thing.gravityForces.push([this, magnitude, magnitude * Math.sin(direction), magnitude * Math.cos(direction)]);

			var magniAtRadius = (this.m / gravityDampener) / (this.r * this.r);
			magniAtRadius = magniAtRadius / dt;
			if (magnitude >= magniAtRadius) {
				try {
					thing.physical = false;
				}
				catch(error) {
					console.error(`error: attempted entity was not an object able to be given a .physical tag`);
				}
			}
		} else {
			//if the entity is instead inside the system range, make sure that each individual object acts on them (debris have no gravity)
			//centers
			this.centers.forEach(a => {a.gravitateToArray(thing);});

			//bodies
			this.bodies.forEach(b => {b.gravitateToArray(thing);});
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

		//finalizing orbital things
		this.parent = bodyToOrbit;
		this.ring = new Ring(bodyToOrbit, apoH, periH, apoA);
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
		this.debris = [];
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
		ctx.ellipse(tempXY[0], tempXY[1], Math.max(1, this.r * loading_camera.scale), Math.max(1, this.r * loading_camera.scale), 0, 0, Math.PI * 2);
		ctx.fill();
		if (this.atmo) {
			//first atmo ring
			ctx.globalAlpha = 0.5;
			var radius = Math.max(1, this.r * loading_camera.scale * multiplier);
			ctx.ellipse(tempXY[0], tempXY[1], radius, radius, 0, 0, Math.PI * 2);
			ctx.fill();
			//all other rings
			var mult = 2.5;
			var ga;
			for (ga=4;ga>0;ga--) {
				var rad2 = Math.max(1, this.r * loading_camera.scale * mult);
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
			catch(error) {
				console.error(`error: attempted entity was not an object able to be given a .physical tag`);
			}
		}
	}

	gravitateToArray(thing) {
		var xDist = thing.x - this.x;
		var yDist = thing.y - this.y;
		//atan2 does y, x instead of x, y for some reason, so I adjust by subtracting Pi.
		var direction = (Math.atan2(xDist, yDist) - (Math.PI));
		//magnitude was annoying to get right, I just messed around with gravitational strength until something looked right.
		var magnitude = (this.m / gravityDampener) / ((xDist * xDist) + (yDist * yDist));
		magnitude = magnitude / dt;
	
		thing.gravityForces.push([this, magnitude, magnitude * Math.sin(direction), magnitude * Math.cos(direction)]);
	
		/*if the thing is experiencing a gravitational force it could only get by being inside the object, destroy it */
		var magniAtRadius = (this.m / gravityDampener) / (this.r * this.r);
		magniAtRadius = magniAtRadius / dt;
		if (magnitude >= magniAtRadius) {
			try {
				thing.physical = false;
			}
			catch(error) {
				console.error(`error: attempted entity was not an object able to be given a .physical tag`);
			}
		}
	}
	
	tick() {
		//loop through debris, if they don't point to this body remove them
		for (var h=0; h<this.debris.length; h++) {
			if (this.debris[h].parent != this) {
				this.debris.splice(h, 1);
			} else if (!this.debris[h].physical) {
				//if the debris isn't physical, delete it as well
				this.debris.splice(h, 1);
			}
		}

		this.x += this.dx / dt;
		this.y += this.dy / dt;
	}
}

//I feel dirty for creating 3 camera classes
//it's like I've committed a crime
class Camera {
	constructor(x, y, scale, scaleMax, scaleMin, scaleSpeed) {
		this.x = x;
		this.y = y;
		this.scale = scale;
		this.scale_max = scaleMax;
		this.scale_min = scaleMin;
		this.scale_speed = scaleSpeed;
		this.scale_d = 0;
	}

	tick() {
		if (gameState < 3) {
			//updating scale and keeping it in bounds
			this.scale += this.scale_d;
			if (this.scale > this.scale_max) {
				this.scale = this.scale_max;
			}
			if (this.scale < this.scale_min) {
				this.scale = this.scale_min;
			}
		}
	}
}

class Camera_Map extends Camera {
	constructor() {
		super(0, 0, 1/128, 1/48, 1/128, 1/512);

		//the map camera can move around

	}

	tick() {
		super.tick();
		this.x = loading_system.x;
		this.y = loading_system.y;
	}
}

class Camera_World extends Camera {
	constructor() {
		super(0, 0, 1, 2, 0.5, 1/32);
	}

	tick() {
		super.tick();
		//lock self to player position
		this.x = character.x;
		this.y = character.y;
	}
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
		ctx.ellipse(tempXY[0], tempXY[1], this.r * loading_camera.scale, this.r * loading_camera.scale, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.closePath();
	}
}


//planets are like bodies, but they generate into stable orbits and have a smaller atmosphere
class Planet extends Body {
	constructor(orbitingBody, apoapsis, periapsis, apoapsisAngleRADIANS, planetStartAngleRADIANS, counterClockwiseBOOLEAN, radius, mass, hasAtmosphereBOOLEAN, color) {
		var [x, y, dx, dy] = calculateOrbitalParameters(orbitingBody, apoapsis, periapsis, apoapsisAngleRADIANS, planetStartAngleRADIANS, counterClockwiseBOOLEAN);
		super(x, y, dx, dy, radius, mass, hasAtmosphereBOOLEAN, color);
		this.parent = orbitingBody;
		this.apoapsis = apoapsis;
		this.periapsis = periapsis;

		//all planets, like systems, have an orbit ring
		this.ring = new Ring(this.parent, apoapsis, periapsis, apoapsisAngleRADIANS);
	}

	beDrawn() {
		if (loading_camera == camera_map) {
			this.ring.tick();
			this.ring.beDrawn();
		}
		if (this.atmo) {
			//main body
			ctx.fillStyle = this.color;
			ctx.beginPath();
			var tempXY = spaceToScreen(this.x, this.y);
			ctx.ellipse(tempXY[0], tempXY[1], Math.max(1, this.r * loading_camera.scale), Math.max(1, this.r * loading_camera.scale), 0, 0, Math.PI * 2);
			ctx.fill();

			//all other rings
			var ga;
			for (ga=2;ga>0;ga--) {
				ctx.globalAlpha = 1 / (ga + 1);
				ctx.beginPath();
				var radius = Math.max(1, this.r * loading_camera.scale * ((ga + 4) / 4));
				ctx.ellipse(tempXY[0], tempXY[1], radius, radius, 0, 0, Math.PI * 2);
				ctx.fill();
			}
		} else {
			super.beDrawn();
		}
	}
}


class Player {
	constructor(x, y, dx, dy) {
		//x / y keep track of position, Dx/dy are change in position over time, and acc is whether the engine is on or not. (allows player to control dx / dy)
		this.x = x;
		this.y = y;
		this.r = 10;
		
		this.dx = dx;
		this.dy = dy;

		this.a = 0;
		this.da = 0;
		this.aa = 0;
		this.acc = false;
	
		
		this.power = 50;
		this.fuel = 100;
		this.warm = 50;
		this.physical = true;
		this.timeout = 0;
		this.dtStore = 0;

		this.color = "#FAF";
		this.dialColor = color_black;
		this.gravityForces = [];
		this.parent = system_main;
	}
	
	tick() {
		//recieving input
		
		//changing direction
		this.da += this.aa;
		this.da *= 0.85;
		if (Math.abs(this.da) > player_turnSpeedMax) {
			if (this.da < 0) {
				this.da = -1 * player_turnSpeedMax;
			} else {
				this.da = player_turnSpeedMax;
			}
		}
		this.a += this.da;


		//using fuel to change dx / dy
		if (this.acc && this.fuel > 0 && this.power > 0) {
			//subtract fuel
			this.fuel -= player_thrusterStrength / dt;

			//calculate change in dx / dy
			this.dx -= (player_thrusterStrength / dt) * Math.cos(this.a);
			this.dy -= (player_thrusterStrength / dt) * Math.sin(this.a);
		}

		//changing dx / dy based on gravity
		
		if (this.gravityForces.length > 0) {
			//formula is [body, magnitude, dx, dy]
			var maxForce = [undefined, 0, 0, 0];
			for (var g=0; g<this.gravityForces.length; g++) {
				if (this.gravityForces[g][1] > maxForce[1]) {
					maxForce = this.gravityForces[g];
				}
			}

			//after finding the max force, set parent / apply it
			this.parent = maxForce[0];

			this.dx += maxForce[2];
			this.dy += maxForce[3];
			//reset array
			this.gravityForces = [];
		}


		//updating the player's position
		this.x += this.dx / dt;
		this.y += this.dy / dt;


		//updating vitals
		if (this.warm < 0) {
			this.warm = 0;
			this.physical = false;
		}
		if (this.warm > 100) {
			this.warm = 100;
			this.physical = false;
		}

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
		this.color = this.parent.color;
		//if in the map, draw ring
		if (gameState == 2) {
			//determining orbit from instantaneous velocity
		}

		//drawing self
		var tempXY = spaceToScreen(this.x, this.y);
		//fuel flames
		if (this.power > 0 && this.fuel > 0 && this.timeout == 0) {
			ctx.beginPath();
			ctx.globalAlpha = 0.7;
			ctx.strokeStyle = color_engineFlames;
			ctx.lineWidth = 5 * loading_camera.scale;

			var len = this.r * 2 * this.acc * loading_camera.scale;
			var addPos = [len * Math.cos(this.a), len * Math.sin(this.a)];
			
			ctx.moveTo(tempXY[0], tempXY[1]);
			ctx.stroke();
			ctx.moveTo(tempXY[0], tempXY[1]);
			ctx.lineTo(tempXY[0] + addPos[0], (tempXY[1]) + addPos[1]);
			ctx.stroke();
		}
		//drawing ship
		ctx.fillStyle = this.color;
	
		//opacity based on death
		if (this.timeout > cutsceneTime) {
			ctx.globalAlpha = 0;
		} else {
			ctx.globalAlpha = 1 - (this.timeout / cutsceneTime);
		}
		
		

		
		if (this.timeout > 0 && this.timeout < cutsceneTime * 3) {
			//death effect
			this.timeout += 1 / this.dtStore;
			if (this.warm > 33) {
				ctx.fillStyle = this.color;
			} else {
				ctx.fillStyle = color_coolPuff;
			}
			
			ctx.ellipse(tempXY[0], tempXY[1], (this.timeout / 4) + this.r, (this.timeout / 8) + (this.r / 2), this.a, 0, Math.PI * 2);
			ctx.fill();
		} else {
			//regular ship
			ctx.beginPath();
			ctx.ellipse(tempXY[0], tempXY[1], Math.max(this.r * loading_camera.scale, 2), Math.max((this.r / 2) * loading_camera.scale, 1), this.a, Math.PI * 0.25, Math.PI * 1.75);
			ctx.fill();
		}
		ctx.globalAlpha = 1;
	}
	
	
	destroy() {
		if (this.timeout == 0) {
			this.timeout = 1;
			this.dtStore = dt;
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

		//general things
		this.color = "#FFF";
		this.physical = true;
		this.parent = parentBody;
		this.m = 1;
		this.r = 1;

		//parent body determines position, as it is always at the first focal point
		//amount to offset by
		var length = this.major - periapsisHeight;
		this.offX = length * Math.cos(this.a);
		this.offY = length * Math.sin(this.a);
		this.x = this.parent.x + this.offX;
		this.y = this.parent.y + this.offY;
	}

	tick() {
		this.x = this.parent.x + this.offX;
		this.y = this.parent.y + this.offY;
	}

	beDrawn() {
		//ring
		ctx.beginPath();
		var tempXY = spaceToScreen(this.x, this.y);
		ctx.strokeStyle = this.color;
		ctx.lineWidth = 2;
		ctx.globalAlpha = 0.2;
		ctx.ellipse(tempXY[0], tempXY[1], this.major * loading_camera.scale, this.minor * loading_camera.scale, this.a, 0, Math.PI * 2, false);
		ctx.stroke();
		ctx.globalAlpha = 1;
	}

	gravitate(body) {

	}
}