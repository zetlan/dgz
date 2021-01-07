/*classes can be found in alphabetical order, except for System, which is at the top

index:

Body

Camera
Camera_Map
Camera_World
Debris
Planet
Player
Ring
Star
Star_Binary
System

*/




//all objects that have gravity
class Body {
	constructor(x, y, dx, dy, radius, mass, color) {
		//coordinate parameters
		this.x = x;
		this.y = y;
		this.dx = dx;
		this.dy = dy;
		this.prevD = [this.dx, this.dy];

		//body parameters
		this.r = radius;
		this.m = mass;
		this.color = color;
		this.debris = [];

		//orbital parameters
		this.apoapsis = 0;
		this.periapsis = 0;
		this.parent = undefined;
		this.ring = undefined;
	}

	beDrawn() {
		//I'm just leaving this up to the child classes
	}
	
	//draws the object. All the drawing functions for bodies have a built in limiter of 1 px, after that they won't draw smaller
	drawBody(bodyX, bodyY, r, atmoRings, extraRadiusPerRing, color) {
		var tempXY = spaceToScreen(bodyX, bodyY);

		//only draw if going to be on screen
		if (isOnScreen(tempXY[0], tempXY[1], (r * (1 + (extraRadiusPerRing * atmoRings))) * loading_camera.scale)) {
			//main ring
			ctx.fillStyle = color;
			ctx.beginPath();
			ctx.ellipse(tempXY[0], tempXY[1], Math.max(1, r * loading_camera.scale), Math.max(1, r * loading_camera.scale), 0, 0, Math.PI * 2);
			ctx.fill();
			if (atmoRings > 0) {
				ctx.globalAlpha = 0.2;
				for (var u=0; u<atmoRings; u++) {
					var rad2 = Math.max(1, (r * (1 + (extraRadiusPerRing * (u + 1)))) * loading_camera.scale);
					ctx.ellipse(tempXY[0], tempXY[1], rad2, rad2, 0, 0, Math.PI * 2);
					ctx.fill();
				}
				ctx.globalAlpha = 1;
			}
		}
	}

	//changes the thing's dx / dy based off of mass 
	gravitate(thing) {
		//getting distance to object for strength of pull
		var xDist = thing.x - this.x;
		var yDist = thing.y - this.y;
		//atan2 does y, x instead of x, y for some reason, so I adjust by subtracting Pi.
		var direction = (Math.atan2(xDist, yDist) - (Math.PI));

		//normally gravity would be (m1 * m2 * g) / d^2, but that m2 is because of inertia, which doesn't exist here.
		//that simplifies it to (m1 * g) / d^2
		//since distance is sqrt(x^2 + y^2), I can just avoid using the square root
		var magnitude = ((this.m / gravityDampener) / ((xDist * xDist) + (yDist * yDist))) / dt;
	
		thing.dx += magnitude * Math.sin(direction);
		thing.dy += magnitude * Math.cos(direction);
	
		/*if the thing is experiencing a gravitational force strong enough that it could only be inside self's radius, destroy it 
		I don't use pythagorean distance here because that requires a square root.*/
		var magniAtRadius = (this.m / gravityDampener) / (this.r * this.r);
		magniAtRadius = magniAtRadius / dt;
		if (magnitude >= magniAtRadius) {
			thing.physical = false;
		}
	}

	//gravitate all child bodies as well as give all debris forces in their forces array
	gravitateAll() {
		loading_debris.forEach(a => {
			this.gravitateToArray(a);
		});
	}

	gravitateToArray(thing) {
		//same as gravitate but with a different output
		var xDist = thing.x - this.x;
		var yDist = thing.y - this.y;
		var direction = (Math.atan2(xDist, yDist) - (Math.PI));
		var magnitude = ((this.m / gravityDampener) / ((xDist * xDist) + (yDist * yDist))) / dt;

		thing.gravityForces.push([this, magnitude, magnitude * Math.sin(direction), magnitude * Math.cos(direction)]);

		var magniAtRadius = ((this.m / gravityDampener) / (this.r * this.r)) / dt;
		if (magnitude >= magniAtRadius) {
			thing.physical = false;
		}
	}

	//modifies coordinates without directly changing x, y, dx, dy. This is useful in systems, where changing the x / y of the system does not change the x / y of the child bodies.
	modifyCoordinates(xModifier, yModifier, dxModifier, dyModifier, subtractingBOOLEAN) {
		//changing subtractingBOOLEAN from a boolean into a -1, 1 multiplier
		var mult = (subtractingBOOLEAN * -2) + 1;

		//changing own parameters
		this.x += xModifier * mult;
		this.y += yModifier * mult;
		this.dx += dxModifier * mult;
		this.dy += dyModifier * mult;
		this.prevD = [this.dx, this.dy];

		//also change debris parameters
		this.debris.forEach(d => {
			d.modifyCoordinates(xModifier, yModifier, dxModifier, dyModifier, subtractingBOOLEAN);
		});
	}

	pullChildren() {
		//adding dx / dy to all children
		//modifying just the dx / dy in pullChildren rather than calling the whole modifyCoordinates function is faster, so I'm doing that. It doesn't appear to cause any problems.
		if (this.prevD[0] != this.dx) {
			this.debris.forEach(c => {c.dx += this.dx - this.prevD[0];});
		}

		if (this.prevD[1] != this.dy) {
			this.debris.forEach(c => {c.dy += this.dy - this.prevD[1];});
		}
		this.prevD = [this.dx, this.dy];
	}

	setOrbit(bodyToOrbit, apoH, periH, apoA, startA, ccwBOOL) {
		//first subtract all x, y, dx, and dy
		this.modifyCoordinates(this.x, this.y, this.dx, this.dy, true);

		//then set orbital properties to new values
		var newCoords = calculateOrbitalParameters(bodyToOrbit, apoH, periH, apoA, startA, ccwBOOL);
		this.parent = bodyToOrbit;
		this.ring = new Ring(bodyToOrbit, apoH, periH, apoA);
		this.prevD = [newCoords[2], newCoords[3]];
		this.apoapsis = apoH;
		this.periapsis = periH;

		this.modifyCoordinates(newCoords[0], newCoords[1], newCoords[2], newCoords[3], false);
	}

	spliceIncorrect() {
		//loop through debris, if they don't point to this body remove them
		for (var h=0; h<this.debris.length; h++) {
			if (this.debris[h].parent != this) {
				this.debris.splice(h, 1);
			} else if (!this.debris[h].physical) {
				//if the debris isn't physical, delete it as well
				this.debris.splice(h, 1);
			}
		}
	}
	
	tick() {
		//change x / y of self
		this.x += this.dx / dt;
		this.y += this.dy / dt;
	}
}

class Debris {
	constructor(x, y, dx, dy) {
		//x / y keep track of position, Dx/dy are change in position over time
		this.x = x;
		this.y = y;
		this.dx = dx;
		this.dy = dy;

		this.r = 3;
		this.apoapsis = undefined;
		this.periapsis = undefined;

		this.physical = true;

		this.color = color_debris;
		this.gravityForces = [];
		this.parent = system_main;
	}

	applyGravity() {
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
			if (!this.parent.debris.includes(this)) {
				this.parent.debris.push(this);
			}
			

			this.dx += maxForce[2];
			this.dy += maxForce[3];
			//reset array
			this.gravityForces = [];
			
		}
	}

	beDrawn() {
		
		var tempXY = spaceToScreen(this.x, this.y);
		if (isOnScreen(tempXY[0], tempXY[1], this.r * loading_camera.scale)) {
			ctx.beginPath();
			ctx.fillStyle = color_debris;
			ctx.ellipse(tempXY[0], tempXY[1], Math.max(debris_minSize, this.r * loading_camera.scale), Math.max(debris_minSize, this.r * loading_camera.scale), 0, 0, Math.PI * 2);
			ctx.fill();
		}
	}

	modifyCoordinates(xModifier, yModifier, dxModifier, dyModifier, subtractingBOOLEAN) {
		var mult = (subtractingBOOLEAN * -2) + 1;
		this.x += xModifier * mult;
		this.y += yModifier * mult;
		this.dx += dxModifier * mult;
		this.dy += dyModifier * mult;
	}
	
	tick() {
		//changing dx / dy based on gravity
		this.applyGravity();

		//updating position
		this.x += this.dx / dt;
		this.y += this.dy / dt;
	}
}


//planets are stars that don't generate heat or have large atmospheres
class Planet extends Body {
	constructor(x, y, dx, dy, radius, mass, hasAtmosphereBOOLEAN, color) {
		super(x, y, dx, dy, radius, mass, color);
		this.atmo = hasAtmosphereBOOLEAN;
	}

	beDrawn() {
		if (this.atmo) {
			this.drawBody(this.x, this.y, this.r, 2, 0.4, this.color);
		} else {
			this.drawBody(this.x, this.y, this.r, 0, 0, this.color);
		}
	}
}

//like a planet but it generates into a stable orbit
class Planet_Orbiting extends Planet {
	constructor(bodyToOrbit, apoapsis, periapsis, apoapsisAngleRADIANS, planetStartAngleRADIANS, counterClockwiseBOOLEAN, radius, mass, hasAtmosphereBOOLEAN, color) {
		super(0, 0, 0, 0, radius, mass, hasAtmosphereBOOLEAN, color);

		this.setOrbit(bodyToOrbit, apoapsis, periapsis, apoapsisAngleRADIANS, planetStartAngleRADIANS, counterClockwiseBOOLEAN);
	}

	beDrawn() {
		if (loading_camera == camera_map) {
			this.ring.tick();
			this.ring.beDrawn();
		}

		super.beDrawn();
	}
}


//player extends debris for convienence sake, they share a lot of the same gravitatonal properties
class Player extends Debris {
	constructor(x, y, dx, dy) {
		super(x, y, dx, dy);
		this.color = color_ship;
		this.r = player_radius;

		this.a = 0;
		this.da = 0;
		this.aa = 0;
		this.acc = false;

		this.ring = undefined;
	
		
		this.power = 50;
		this.fuel = 100;
		this.warm = 50;
		this.timeout = 0;
		this.dtStore = 0;

		this.predictCoords = [[game_time, this.x, this.y, this.dx, this.dy]];
	}

	applyGravity() {
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

			if (!this.parent.debris.includes(this)) {
				this.parent.debris.push(this);
			}
			

			this.dx += maxForce[2];
			this.dy += maxForce[3];
			//reset array
			this.gravityForces = [];
			
		}
	}

	beDrawn() {
		//if in the map, draw prediction path
		
		if (loading_state.id == "map") {
			//redraw prediction path if out
			if (game_time > 0) {
				this.prediction_create();
			}

			//drawing all prediction lines, starting at the player's ship
			ctx.strokeStyle = color_ring;
			ctx.globalAlpha = display_orbitOpacity;
			var coords = spaceToScreen(this.x, this.y);
			ctx.moveTo(coords[0], coords[1]);
			ctx.beginPath();
			this.predictCoords.forEach(v => {
				coords = spaceToScreen(v[1], v[2]);
				ctx.lineTo(coords[0], coords[1]);
			});
			ctx.stroke();
			ctx.globalAlpha = 1;
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
			
			ctx.beginPath();
			ctx.ellipse(tempXY[0], tempXY[1], ((this.timeout / 4) + this.r), (this.timeout / 8) + (this.r / 2), this.a, 0, Math.PI * 2);
			ctx.fill();
		} else {
			//regular ship
			ctx.beginPath();
			ctx.ellipse(tempXY[0], tempXY[1], Math.max(this.r * loading_camera.scale, 2), Math.max((this.r / 2) * loading_camera.scale, 1), this.a, Math.PI * 0.25, Math.PI * 1.75);
			ctx.fill();
		}
		ctx.globalAlpha = 1;
	}
	
	debrisHit(dx, dy) {
		var asteroidVelX = dx;
		var asteroidVelY = dy;
		//take a weighted average of the velocities
		var dxAverage = ((6 * this.dx) + asteroidVelX) / 7;
		var dyAverage = ((6 * this.dy) + asteroidVelY) / 7;

		//make the weighted average the player's new velocity
		this.dx = dxAverage;
		this.dy = dyAverage;
	
		//give the player power, because asteroids do that I guess
		this.pow += powerIncrement * 16;
	}

	destroy() {
		if (this.timeout == 0) {
			this.timeout = 1;
			this.dtStore = dt;
			loading_state = new State_Death();
			dt *= 10;
		}
	}

	prediction_add() {
		//takes in the previous predict coordinate, and adds a line to it
		var stepsPerLine = 35;

		var lastPredict = this.predictCoords[this.predictCoords.length - 1];
		

		//creating new predict coordinate
		this.predictCoords.push([game_time + stepsPerLine, lastPredict[1], lastPredict[2], lastPredict[3], lastPredict[4]]);

		//setting easy reference
		lastPredict = this.predictCoords[this.predictCoords.length - 1];

		for (var t=0; t<stepsPerLine; t++) {
			//each line takes over 10 timesteps, iterate until done

			//this is just the gravitate function, but compressed and modifies the predictCoords, not an object
			var dist = [lastPredict[1] - this.parent.x, lastPredict[2] - this.parent.y];
			var direction = (Math.atan2(dist[0], dist[1]) - (Math.PI));
			var magnitude = (this.parent.m / gravityDampener) / ((dist[0] * dist[0]) + (dist[1] * dist[1]));
		
			lastPredict[3] += magnitude * Math.sin(direction);
			lastPredict[4] += magnitude * Math.cos(direction);

			lastPredict[1] += lastPredict[3];
			lastPredict[2] += lastPredict[4];
		}
	}

	fireThrusters() {
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
			this.fuel -= (player_thrusterStrength * player_fuelEfficiency) / dt;

			//calculate change in dx / dy
			this.dx -= (player_thrusterStrength / dt) * Math.cos(this.a);
			this.dy -= (player_thrusterStrength / dt) * Math.sin(this.a);

			//change orbit ring
			this.prediction_create();
		}
	}

	prediction_create() {
		this.predictCoords = [[game_time, this.x, this.y, this.dx - this.parent.dx, this.dy - this.parent.dy]];

		//helpful label variable. Hopefully the name is self-explanatory. If you cannot understand what this variable does that is also ok.
		//However, I'm not going to explain it. Perhaps you could mess around with it and see what changes in-game.

		//aright i'll explain it it controls the number of prediction lines this function creates in the predictCoords array
		var numOfLines = 25;

		//push out 7 lines
		for (var w=0; w<numOfLines; w++) {
			this.prediction_add();
		}
	}

	tick() {
		//recieving input
		this.fireThrusters();
		super.tick();

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
			this.physical = true;
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

	beDrawn() {
		//ring
		ctx.beginPath();
		var tempXY = spaceToScreen(this.x, this.y);
		ctx.strokeStyle = color_ring;
		ctx.lineWidth = 2;
		ctx.globalAlpha = display_orbitOpacity;
		ctx.ellipse(tempXY[0], tempXY[1], this.major * loading_camera.scale, this.minor * loading_camera.scale, this.a, 0, Math.PI * 2, false);
		ctx.stroke();
		ctx.globalAlpha = 1;
	}

	tick() {
		this.x = this.parent.x + this.offX;
		this.y = this.parent.y + this.offY;
	}
}

//shops always orbit a parent body, like orbiting planets, but the player can enter them
class Shop extends Body {
	constructor(bodyToOrbit, apoapsis, periapsis, apoapsisAngleRADIANS, startAngleRADIANS, ccwBOOL) {
		super(0, 0, 0, 0, 10, 10, color_shop);
		this.setOrbit(bodyToOrbit, apoapsis, periapsis, apoapsisAngleRADIANS, startAngleRADIANS, ccwBOOL);
	}

	beDrawn() {
		var tempXY = spaceToScreen(this.x, this.y);
		if (isOnScreen(tempXY[0], tempXY[1], this.r * 1.4 * loading_camera.scale)) {
			var glowRad = Math.max(1, (this.r * loading_camera.scale * 1.4));
			var rad = Math.max(1, (this.r * loading_camera.scale))
			//drawing glow (diamond shape)
			ctx.fillStyle = color_shop_glow;
			ctx.globalAlpha = 0.3;
			ctx.beginPath();
			ctx.moveTo(tempXY[0] - glowRad, tempXY[1]);
			ctx.lineTo(tempXY[0], tempXY[1] - glowRad);
			ctx.lineTo(tempXY[0] + glowRad, tempXY[1]);
			ctx.lineTo(tempXY[0], tempXY[1] + glowRad);
			ctx.fill();

			//drawing actual entity (same diamond shape)
			ctx.fillStyle = this.color;
			ctx.globalAlpha = 1;
			ctx.beginPath();
			ctx.moveTo(tempXY[0] - rad, tempXY[1]);
			ctx.lineTo(tempXY[0], tempXY[1] - rad);
			ctx.lineTo(tempXY[0] + rad, tempXY[1]);
			ctx.lineTo(tempXY[0], tempXY[1] + rad);
			ctx.fill();
		}
	}

	//because the shop just pushes away debris and attracts the player, gravitate to array doesn't push any forces. Instead, it directly affects dx / dy
	gravitateToArray(entity) {
		//for regular debris
		//diagonal shape allows for simple distance calculation, no pythagoren theorum required
		var entityDist = Math.abs(entity.x - this.x) + Math.abs(entity.y - this.y);
		if (entityDist <= this.r) {
			this.color = color_shop_dark;

			//bouncing effect
			var dxRel = entity.dx - this.dx;
			var dyRel = entity.dy - this.dy;

			/*moving towards the shop from different directions yields different results.
			dx / dy are swapped, and one or both of them are multiplied by -1
			left-upper: swap with -1, -1
			left-lower: swap with -1, 1

			right-upper: swap with 1, 1
			right-lower: swap with -1, -1
			*/

			if (entity.x < this.x) {
				//entity is to the left
				if (entity.y < this.y) {
					entity.dx = (-1 * dyRel) + this.dx;
					entity.dy = (-1 * dxRel) + this.dy;
				} else {
					entity.dx = (-1 * dyRel) + this.dx;
					entity.dy = (dxRel) + this.dy;
				}
			} else {
				//entity is to the right
				if (entity.y < this.y) {
					entity.dx = (dyRel) + this.dx;
					entity.dy = (dxRel) + this.dy;
				} else {
					entity.dx = (-1 * dyRel) + this.dx;
					entity.dy = (-1 * dxRel) + this.dy;
				}
			}

			//ticking once so the entity is for sure out of the area
			entity.x += entity.dx - this.dx;
			entity.y += entity.dy - this.dy;

			//if the entity is the character, put them in the shop
		} else {
			if (Math.floor(game_time) % 100 == 0) {
				this.color = color_shop;
			}
		}
	}

	//this function is empty because the shop generates such little force that it's pointless to do the calculation
	gravitate(entity) {

	}
}


//stars are special bodies that have a large atmosphere
class Star extends Body {
	constructor(x, y, dx, dy, radius, mass, hasAtmosphereBOOLEAN, color) {
		super(x, y, dx, dy, radius, mass, color);
		this.atmo = hasAtmosphereBOOLEAN;
	}

	beDrawn() {
		if (this.atmo) {
			this.drawBody(this.x, this.y, this.r, 5, 1.8, this.color);
		} else {
			this.drawBody(this.x, this.y, this.r, 0, 1, this.color);
		}
	}
}



//binary stars are sets of two stars that orbit each other. It's one object so I don't have to deal with the hell of having multiple objects in the center of each System.
class Star_Binary extends Body {
	constructor(body1, body2) {
		super((body1.x + body2.x) / 2, (body1.y + body2.y) / 2, (body1.dx + body2.dx) / 2, (body1.dy + body2.dy) / 2, 0, body1.m + body2.m, body1.color);
		this.body1 = body1;
		this.body2 = body2;
	}

	beDrawn() {
		this.body1.beDrawn();
		this.body2.beDrawn();

		//indicator dot
		
		ctx.fillStyle = "#F0F";
		ctx.beginPath();
		var tempXY = spaceToScreen(this.x, this.y);
		ctx.ellipse(tempXY[0], tempXY[1], 5, 5, 0, 0, Math.PI * 2, false);
		ctx.fill();
		
	}

	

	modifyCoordinates(xModifier, yModifier, dxModifier, dyModifier, subtractingBOOLEAN) {

		super.modifyCoordinates(xModifier, yModifier, dxModifier, dyModifier, subtractingBOOLEAN);

		//also modify child coordinates
		this.body1.modifyCoordinates(xModifier, yModifier, dxModifier, dyModifier, subtractingBOOLEAN);
		this.body2.modifyCoordinates(xModifier, yModifier, dxModifier, dyModifier, subtractingBOOLEAN);
	}

	tick() {
		//interaction with self
		this.body1.gravitate(body2);
		this.body2.gravitate(body1);

		//tick child objects
		this.body1.tick();
		this.body2.tick();

		super.tick();
	}

	gravitate() {
		var xDist = (thing.x - this.x);
		var yDist = thing.y - this.y;
		var direction = (Math.atan2(xDist, yDist) - (Math.PI));
		var magnitude = ((this.m / gravityDampener) / ((xDist * xDist) + (yDist * yDist))) / dt;
	
		thing.dx += magnitude * Math.sin(direction);
		thing.dy += magnitude * Math.cos(direction);
	

		//checking with body radii
		var inABody = (getDistance([thing.x, thing.y], [this.body1.x, this.body1.y]) < this.body1.r) || (getDistance([thing.x, thing.y], [this.body2.x, this.body2.y]) < this.body2.r);
		if (inABody) {
			thing.physical = false;
		}
	}

	gravitateToArray(thing) {
		var xDist = thing.x - this.x;
		var yDist = thing.y - this.y;
		var direction = (Math.atan2(xDist, yDist) - (Math.PI));
		var magnitude = ((this.m / gravityDampener) / ((xDist * xDist) + (yDist * yDist))) / dt;
		thing.gravityForces.push([this, magnitude, magnitude * Math.sin(direction), magnitude * Math.cos(direction)]);

		//same body radii check
		var inABody = (getDistance([thing.x, thing.y], [this.body1.x, this.body1.y]) < this.body1.r) || (getDistance([thing.x, thing.y], [this.body2.x, this.body2.y]) < this.body2.r);
		if (inABody) {
			thing.physical = false;
		}
	}

	

	setOrbit(bodyToOrbit, apoH, periH, apoA, startA, ccwBOOL) {
		this.body1.x -= this.x;
		this.body1.y -= this.y;
		this.body1.dx -= this.dx;
		this.body1.dy -= this.dy;

		this.body2.x -= this.x;
		this.body2.y -= this.y;
		this.body2.dx -= this.dx;
		this.body2.dy -= this.dy;

		super.setOrbit(bodyToOrbit, apoH, periH, apoA, startA, ccwBOOL);

		this.body1.x += this.x;
		this.body1.y += this.y;
		this.body1.dx += this.dx;
		this.body1.dy += this.dy;

		this.body2.x += this.x;
		this.body2.y += this.y;
		this.body2.dx += this.dx;
		this.body2.dy += this.dy;
	}
}


/*a system contains center bodies, outer bodies, and debris
it acts like a little mini main loop, ticking / drawing everything inside, 
Systems are always either fixed or orbiting some body. Their x, y, dx, and dy can't just be set to something to start. By default they're all 0
*/
class System extends Body {
	constructor(centerBody, outerBodies, debrisMax) {
		super(0, 0, 0, 0, 0, 0, "#F0F");

		this.center = centerBody;
		this.bodies = outerBodies;
		this.debrisMaxNum = debrisMax;
		if (this.center != undefined) {
			this.setCenter(this.center);
		}
	}

	beDrawn() {
		//drawing ring if has
		if (this.ring != undefined && loading_camera == camera_map) {
			this.ring.beDrawn();
		}

		//drawing everything else
		this.center.beDrawn();
		this.bodies.forEach(b => {b.beDrawn();});

		//indicator dot
		/*
		ctx.fillStyle = "#F0F";
		ctx.beginPath();
		var tempXY = spaceToScreen(this.x, this.y);
		ctx.ellipse(tempXY[0], tempXY[1], 5, 5, 0, 0, Math.PI * 2, false);
		ctx.fill(); */
	}

	gravitate(thing) {
		//given that the entity is outside self's range, just use the center
		super.gravitate(thing);

		//if the entity is inside the range, gravitate with bodies as well
		if (getDistance([thing.x, thing.y], [this.x, this.y]) <= this.r) {
			this.bodies.forEach(b => {b.gravitate(thing);});
		}
	}

	gravitateAll() {
		//gravitate children and have them give debris forces
		this.bodies.forEach(b => {
			this.gravitate(b);
			b.gravitateAll();
		});
	
		//give debris forces
		super.gravitateAll();
	}

	gravitateToArray(thing) {
		super.gravitateToArray(thing);
		this.bodies.forEach(b => {b.gravitateToArray(thing);});
	}

	modifyCoordinates(xModifier, yModifier, dxModifier, dyModifier, subtractingBOOLEAN) {
		super.modifyCoordinates(xModifier, yModifier, dxModifier, dyModifier, subtractingBOOLEAN);

		//also modify center and bodies
		this.center.modifyCoordinates(xModifier, yModifier, dxModifier, dyModifier, subtractingBOOLEAN);
		this.bodies.forEach(b => {
			b.modifyCoordinates(xModifier, yModifier, dxModifier, dyModifier, subtractingBOOLEAN);
		});
	}

	pullChildren() {
		//pulling own children
		if (this.prevD[0] != this.dx) {
			this.center.dx += this.dx - this.prevD[0];
			this.bodies.forEach(b => {b.dx += this.dx - this.prevD[0];});
			this.debris.forEach(c => {c.dx += this.dx - this.prevD[0];});
		}

		if (this.prevD[1] != this.dy) {
			this.center.dy += this.dy - this.prevD[1];
			this.bodies.forEach(b => {b.dy += this.dy - this.prevD[1];});
			this.debris.forEach(c => {c.dy += this.dy - this.prevD[1];});
		}

		this.center.x = this.x;
		this.center.y = this.y;
		this.prevD = [this.dx, this.dy];

		//recursing
		this.bodies.forEach(b => {
			b.pullChildren();
		});
	}

	//updates radius, mass, and color
	setCenter(object) {
		this.center = object;
		
		this.m = this.center.m;
		this.center.parent = this;
		this.r = this.center.r;
		this.color = this.center.color;
	}

	spliceIncorrect() {
		//loop through debris, if they don't point to this body remove them
		for (var h=0; h<this.debris.length; h++) {
			if (this.debris[h].parent != this) {
				this.debris.splice(h, 1);
			} else if (!this.debris[h].physical) {
				//if the debris isn't physical, delete it as well
				this.debris.splice(h, 1);
			}
		}

		//call for children, center isn't used because the debris never see the center (they only see the System and its bodies)
		this.bodies.forEach(s => {
			s.spliceIncorrect();
		});

	}

	tick() {
		//ticking; bodies, center, and self
		this.center.tick();
		this.bodies.forEach(a => {a.tick();});
		super.tick();

		//ring if has
		if (this.ring != undefined) {
			this.ring.tick();
		}
	}
}