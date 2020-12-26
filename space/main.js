window.addEventListener("keydown", keyPress, false);
window.addEventListener("keyup", keyNegate, false);
//setting up variables for later
var canvas;
var ctx;

var shipMap = [[9, 9, 9, 9, 9, 9, 9, 9, 9, 0, 0, 0, 0, 0, 0, 0], 
			[9, 9, 9, 9, 9, 9, 9, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0], 
			[9, 9, 9, 9, 9, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0], 
			[9, 9, 9, 9, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0], 
			[9, 9, 9, 0, 1, 0, 1, 1, 1, 0, 1, 3, 3, 3, 1, 0, 1, 1, 1, 0, 1, 0], 
			[9, 9, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0], 
			[9, 9, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0], 
			[9, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0], 
			[9, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0], 
			[0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 6, 0, 0, 0], 
			[0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0],
			[0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0], 
			[0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0], 
			[0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0], 
			[0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0], 
			[0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0], 
			[9, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0], 
			[9, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0], 
			[9, 9, 0, 1, 1, 0, 1, 1, 1, 1, 4, 4, 5, 4, 4, 1, 1, 1, 1, 0, 1, 1, 0], 
			[9, 9, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0], 
			[9, 9, 9, 0, 1, 0, 1, 1, 1, 4, 4, 5, 4, 4, 4, 5, 1, 1, 1, 0, 1, 0], 
			[9, 9, 9, 9, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0], 
			[9, 9, 9, 9, 9, 0, 0, 1, 1, 1, 4, 4, 4, 5, 4, 1, 1, 1, 0, 0], 
			[9, 9, 9, 9, 9, 9, 9, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0], 
			[9, 9, 9, 9, 9, 9, 9, 9, 9, 0, 0, 0, 0, 0, 0, 0]
						];
var solidSurfaces = [0, 4, 5, 6, 6.5, 7];
var cornerCoords = [0, 0, 0, 0];

var loadingMap = shipMap;
var arrayValue;
var centerX;
var centerY;
var squareSize = 20;

//player attributes, the ship version has been moved to the class but this is for the in-ship conrols
var x = (loadingMap.length / 2) * squareSize;
var y = (loadingMap[Math.floor(x / squareSize)].length / 2) * squareSize;

var cx = 0;
var cy = 0;
var max = 20;

var menuPos = 1;
var menuIncrement = 0.005;
var menuLimit = 0.82;

var entitySpeed = 0.025;
var powerIncrement = 0.0125;
var repairPower = 25;
var maxRepairPower = 50;
var repaired = 0;
var repairsRequired = 0;
var failedRepair = 0;

var buttonPos = [undefined, undefined];

var timer;
var time = -1;
var timeUntilExplosion = 10000;
var timeLeft = timeUntilExplosion - time;

var gameState = -1;
var yes = 0;
var cutsceneTime = 50;
var gravityDampener = 20;
//the greater dt is, the slower the game is.
var dt = 1;
var dtBase = dt;
var dtMult = 2;

var debStartNum = 100;
var maxDebris = 850;
var maxBelt = 450;
var beltV = 1.56;
var beltCreated = 0;

//all the colors used
var landColor = "#008800";
var spaceColor = "#222266";
var sunColor = "#FF3300";
var mercColor = "#A7A2A0";
var debrisColor = "#8888FF";

var engineColor = "#6666FF";
var shipColor = "#FFFFFF";
var computeColor = "#307529";
var computeWireColor = "#FFEE25";
var hyperColor = "#3872FF";
var brokenHyperColor = "#5D649C";
var repairColor = "#76AA9F";

var endingColor = "#FF00FF";
var startingColor = "#00FF00";
var stoneColor = "#6F8389";
var blackColor = "#000000";

var powerColor = "#FFD800";
var fuelColor = "#FF9300";
var cTemperColor = "#7CBBFA";
var mTemperColor = "#7CFA80";
var hTemperColor = "#FA917C";

var menuColor = "#333366";
var textColor = "#88FFCC";
var playerColor = "#CCCCFF";
var characterColor = "#FF00FF";

var teleColor = "#8A4EC3";
var explosionColor = "#FF8800";
var coolExplosionColor = "#4D97C7";
var text = " ";
//base64 images, sorry for the mess
var imageSub = ["Press Z to continue"];
var images = ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAgCAMAAABjCgsuAAAAFVBMVEUAAAALCwsZAhgwAy5UVFTFDL7///+xLEtuAAAAiklEQVR42u3UQQ6AIAxE0bFq739kqSQNZqCFjW78MXHTJ1FUHIt9CdSaA9qWAqVioJ0Y8LzcESHg06fVFeDL1/FKMuDzDkiAF/DpcmAOuAmBtitIyU7qjUGdtFJAT4nmCdA+xMDDXhMFGHQE5PQlkG6czUhzEwjepRGIX28G+Sf6AO//NbbF8DfRBQO1FQP8/O5aAAAAAElFTkSuQmCC",

"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAgCAMAAABjCgsuAAAAFVBMVEUAAAAA/xMLCwuanK+f/926rKz/AP/dNRBRAAAAdklEQVR42u3OQQqEQAxE0eopk/sfeVoEP6NOUGjBhX8Z6kE0/cvH53HA9sOA5+4EXnog8FngkaB3DbTWtIR0CdaQW5C5B6QIk+a9EAD2PyAkZU9SAcKA6ItMHgYgINHbLNT2QkHsAQXhgxrwLwGqhoDPxfR2oi87jg5jIB1sKwAAAABJRU5ErkJggg==",

"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAgCAMAAABjCgsuAAAAHlBMVEUAAAAA/xMKCgoLCwtTMf+anK+f/926rKz/MTH/MedwccHeAAAAkklEQVR4Ae3OUQrCQAyE4dm2xuT+FzbbqQFbA6NPPvi5GJD5Qdhbt4NdoN3TzwTmnLuJgXtskxjUPuQgNn7EwD2Owl0LIjxFkgKfjqMF+7N9LAXVsTpBsk9gjIEnNSgoWkC4pz7Fdf8KRQpSLUDjDF1AGBdAv2fQJwCGEvT/l4Huq2BJ6zrfwu95lv3yt7oEwd8DxDUVZ7WP6zsAAAAASUVORK5CYII=",

"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAgCAMAAABjCgsuAAAAOVBMVEUAAAAAAAEA/xMBAAEDAQUEAgcKCgoKCgsLCgwLCwsLCwwPCxIQCxQwFE1cQ3Zhjo3/AAD/AP////9y7TioAAAA0ElEQVR42uXR0Q6CMAxA0Q51OLWl+P8f68qysbRQ4NljIiHpzVYFLBhPkoCdhGwgmLlvyD+BkcWFK5WA/UWoBtwCPeFfSW0xCSwGoZbWN5qaPF+sgTX1hqoFjGUNFTR9QOoE7udB1MJcibGp099sM+CNDZbpWphfyQYgAcywBugHMj+LJUBxEDQ7Aek/uYcNqROcgLA4G9gdnAL3Atos0ACZNLpxG2xT0+QFhB7Ai+AZY0yvmNIYU/6WN/nIU95Se44xe3/gFmARAhwL9wf8ox9KRT03oV3uPgAAAABJRU5ErkJggg==",

"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAgCAMAAABjCgsuAAAAPFBMVEUAAAAAAAEBAAEDAQUEAgcKCgoKCgsLCgwLCwsLCwwPCxIQCxQwFE1Db0hil/+qrbissLq6rKz/AAD////iriLMAAAAvklEQVR4AeXS0Q7CIAyFYaYyUes8wPu/qxw0NSQ0szfe+KuQJX52ZgT5hNriMgZ+IO/C+H0b4GtQfIDCAKgTUHr1DhUWAPjWCSbQoLZUGxg5Jmiu/4BdoBnA8aR/DeShIOe8bbllnVYdUVygC+OWZAoK6wP4+315AcgcCDjBA6QAs3MkJuAQHdHqQJgJBBgAIDZQgsndWEANEzYDjsI5xpguMaU1prbyii/uvEq6r7F1vYXDEnoL972W4yn8Y0/UTEk+AlcFzgAAAABJRU5ErkJggg==",

"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAGCAMAAADJ2y/JAAAAA1BMVEUzMzPK7GI1AAAAC0lEQVR4AWMgCwAAADYAAQ50xLMAAAAASUVORK5CYII=",
//endings past here
"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAgBAMAAACm+uYvAAAAElBMVEUAAAAA50wLCwswFE3a2/j/AABE+rNaAAAA+UlEQVQoz82Sy23FQAwDt4UF4QbSATFWBXYKMBj130oO+z5+h9zDowbUaiUOnjoQN40bAPIJBFV7apWEgYEF0PlZrSo3R4WqPSRA1QtUA9fD0UljGFDdAfMtgdGyDNMdg3RMxJSrF6ikFeA8wHa2BBhUC03YzxMszUoQo4pMBOd5HtimHg6ukngApqT1Bk3sFzDFmor0+tF+ngB2tFp1ibJgAbABhjqYacPBnGuDa1woI8FuvU8yBCQSgelsut2jnAuBJfXH2tNVgC/beQNRuSqhtq21Vvi8eaUJ6epn/RmGoqDVnTzmfaUk0Dsvwy0+wH7P1dcfGv9SvxY9f3D0ePc5AAAAAElFTkSuQmCC",

"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAgCAMAAABjCgsuAAAAGFBMVEUAAAALCwswFE1cQ3assLrNrO//AP////+MLZKQAAAApElEQVR4Ae2T4Q7CIBgD677B3v+NBYVzkcok8aeX+K+XFmHaFnkJaXsjvOAze2dwbcMOKKBup5RsHsM3kNeTUUGAFj8qzfncQP6AkxEnIfDIQzFmk3o+F+iwAgUtXzEV8gVZWRjSXKBgRVAJ15+dFHaSmKT5GdqtsYirCyME7wIe8enfajEC/ES4fq0+jxAc2RpkwzdcfqIek0aYEoNwW0Rf8OcO4fANO0DbuEMAAAAASUVORK5CYII="

];

var texts = [["'In other news, the sun is exploding.'", "'Please do not do anything irrational.'", "(Press X to skip cutscene, Z repeatedly to see cutscene)"], 
			["You quickly board your spaceship."],
			["Taking off, you reflect on all the people that will probably die", "because no plan was made for this, even though everybody", "knew it would happen hundreds of years in advance."],
			["As you are on your way out of the solar system however,", "one major problem is discovered:", "The ship's light speed travel is broken!"],
			["Now you must repair the broken engines (in grey)", "with the ship's repair tool, (green)", "while managing needs such as solar power and temperature."],
			["Use the arrow keys or WASD to manuever,", "Hold the spacebar to access your ship, and", "use Z to interact with objects inside your ship."],
			["You died. To restart, refresh the page."],
			["Congratulations! You escaped from certain doom!", "To retry, refresh the page."]
];
//other text
var menuText = ["Sun Survivor", "Press Z!"];

var barsText = ["Power: ", "Temperature: ", "Fuel: ", "Time Until Explosion: ", "Repair Power: "];

var failedRepairText = ["The repair tool has too little power to repair any more.", 
												"Return to the charger to recharge the repair tool."];

//classes exist here, oh boy!
var sunX;
var sunY;
let sun;
let earth;
let mercury;
let bh;
let character;
let debrisBits = [];
//one class is for debris, while one is for bodies that do gravity
class Body {

constructor(x, y, mass, radius, color, a, dx, dy) {
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.m = mass;
	this.r = radius;
	this.c = color;
	this.atmo = a;
}

beDrawn() {
	//multiplier is for the first atmosphere ring, which wobbles in and out.
	var multiplier = 1.5 + (Math.cos((time * 0.5) / (180 / Math.PI)) / 3);
	//main ring
	ctx.fillStyle = this.c;
	ctx.beginPath();
	ctx.ellipse(this.x - cx, this.y - cy, this.r, this.r, 0, 0, Math.PI * 2);
	ctx.fill();
	if (this.atmo > 0) {
	//first atmo ring
	ctx.globalAlpha = 0.5;
	ctx.ellipse(this.x - cx, this.y - cy, this.r * multiplier, this.r * multiplier, 0, 0, Math.PI * 2);
	ctx.fill();
	//all other rings
	var mult = 2.5;
	var ga;
	for (ga=4;ga>0;ga--) {
		ctx.globalAlpha = ga / 10;
		ctx.ellipse(this.x - cx, this.y - cy, this.r * mult, this.r * mult, 0, 0, Math.PI * 2);
		ctx.fill();
		mult += 2.5;
	}
	ctx.globalAlpha = 1;
	ctx.closePath();
	}
}

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

	/*if the thing is experiencing a gravitational force that's strong
	enough for it to be inside the object, destroy the thing. */
	var radiusMagni = (this.m / gravityDampener) / (this.r * this.r);
	radiusMagni = radiusMagni / dt;
	if (magnitude > radiusMagni) {
	try {
		thing.destroy();
	}
	catch(error) {
		ctx.globalAlpha = 1;
	}
	}
}

move() {
	this.x += this.dx / dt;
	this.y += this.dy / dt;
}
}

class Debris {
constructor(x, y, dx, dy) {
	this.x = x;
	this.y = y;
	if (dx === undefined || dy === undefined) {
	this.dx = (Math.random() - 0.7) * (9 / Math.abs(this.x / 750));
	this.dy = (Math.random() - 0.7) * (9 / Math.abs(this.x / 750));
	} else {
	this.dx = dx;
	this.dy = dy;
	}
	
	this.r = 3;
	this.physical = 1;
}

move() {
	this.x += this.dx / dt;
	this.y += this.dy / dt;
}

beDrawn() {
	ctx.beginPath();
	ctx.fillStyle = debrisColor;
	ctx.ellipse(this.x - cx, this.y - cy, this.r, this.r, 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.closePath();
}

destroy() {
	this.physical = 0;
}
}

class Player {

constructor(x, y) {
	//ax and ay are acceleration, and change dx/dy. Dx/dy are the ones that change the player's position. This system allows for a space-floaty feel.
	this.x = x;
	this.y = y;
	this.dx = earth.dx;
	this.dy = earth.dy - 1.2;
	this.ax = 0;
	this.ay = 0;

	this.timeout = 0;
	this.pow = 50;
	this.fuel = 100;
	this.warm = 50;

	this.toolPower = 50;
	this.toolPos = 0;
	this.tele = 0;
}

recieveInput() {
	//all this just changes direction based on acceleration and makes sure it's not over it's max speed.
	//factoring in fuel for x
	if (this.fuel > 0 && this.pow > 0) {
	this.dx += this.ax / dt;
	this.fuel -= Math.abs(this.ax / dt);
	}
	
	if (this.dx / dt > max / dt || this.dx / dt < -1 * (max / dt)) {
	if (this.dx / dt > (max / dt)) {
		this.dx = max;
	} else {
		this.dx = -1 * max;
	}
	}
	
	//for y
	if (this.fuel > 0 && this.pow > 0) {
	this.dy += this.ay / dt;
	this.fuel -= Math.abs(this.ay / dt);
	}
	if (this.dy / dt > max / dt || this.dy / dt < -1 * (max / dt)) {
	if (this.dy / dt > (max / dt)) {
		this.dy = max;
	} else {
		this.dy = -1 * max;
	}
	} 
}

tick() {
	//updating the player and the camera's position
	this.x += this.dx / dt;
	this.y += this.dy / dt;
	cx = this.x - centerX;
	cy = this.y - centerY;

	//handling power, producing
	var xDist = (this.x - sun.x);
	var yDist = (this.y - sun.y);
	var theValue = 10 * ((5 * sun.r) / ((xDist * xDist) + (yDist * yDist)))
	this.pow += (theValue * 1.5) / dt;
	this.warm += (theValue - 0.025) / dt;

	//consuming
	//some is consumed just over time
	this.pow -= powerIncrement / dt;

	//putting it into the repair tool, the repair tool doesn't charge if power is critically low
	if (this.toolPower < maxRepairPower && this.toolPos == 0 && this.pow > 7.5) {
	this.toolPower += 1;
	this.pow -= 1;
	}

	//adjusting temperature by using power
	if (this.warm < 33.333333 && this.pow > 0) {
	this.warm += (powerIncrement * 6) / dt;
	this.pow -= (powerIncrement * 6) / dt;
	}
	if (this.warm > 66.66666 && this.pow > 0) {
	this.warm -= (powerIncrement * 6) / dt;
	this.pow -= (powerIncrement * 6) / dt;
	}
	//forcing temperature
	if (this.warm < 0) {
	this.warm = 0;
	this.destroy();
	}
	if (this.warm > 100) {
	this.warm = 100;
	this.destroy();
	}
	//adjusting power to be within scale
	if (this.pow < 0) {
	this.pow = 0;
	}
	if (this.pow > 100) {
	this.pow = 100;
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
	//drawing engine flames
	if (this.pow > 0 && this.fuel > 0) {
	ctx.beginPath();
	ctx.globalAlpha = 0.7;
	ctx.strokeStyle = engineColor;
	ctx.lineWidth = 5;
	var mult = -500;

	ctx.moveTo(this.x - cx, this.y - cy);
	ctx.lineTo((this.x - cx) + this.ax * mult, (this.y - cy));
	ctx.stroke();
	ctx.moveTo(this.x - cx, this.y - cy);
	ctx.lineTo((this.x - cx), (this.y - cy) + this.ay * mult);
	ctx.stroke();
	}
	//drawing ship
	ctx.fillStyle = playerColor;

	//alpha based on death
	if (this.timeout > cutsceneTime) {
	ctx.globalAlpha = 0;
	} else {
	ctx.globalAlpha = 1 - (this.timeout / cutsceneTime);
	}
	//alpha based on winning overrides
	if (this.tele > cutsceneTime / 2) {
	ctx.globalAlpha = 0;
	}
	
	ctx.beginPath();
	ctx.ellipse(this.x - cx, this.y - cy, 5, 5, 0, 0, Math.PI * 2);
	ctx.fill();
	

	//drawing teleport beam
	if (this.tele > 0) {
	var off = Math.sin(this.tele / (2 * cutsceneTime / Math.PI)) * 20;
	if (this.tele >= ((Math.PI * 0.63) * cutsceneTime)) {
		off = 0;
	}
	ctx.beginPath();
	ctx.globalAlpha = 1;
	ctx.fillStyle = teleColor;
	ctx.moveTo((this.x - cx) - off, (this.y - cy));
	ctx.lineTo((this.x - cx), (this.y - cy) - off);
	ctx.lineTo((this.x - cx) + off, (this.y - cy));
	ctx.lineTo((this.x - cx), (this.y - cy) + off);
	ctx.closePath();
	ctx.fill();
	this.tele += 1;
	dt = 10000;
	gameState = 1;

	if (this.tele >= ((Math.PI * 1.5) * cutsceneTime)) {
		gameState = 0;
		time = 11;
	}
	}
	//drawing explosion
	if (this.timeout > 0) {
	this.timeout ++;
	gameState = 1;
	if (this.warm > 0) {
		ctx.fillStyle = explosionColor;
	} else {
		ctx.fillStyle = coolExplosionColor;
	}
	
	ctx.ellipse(this.x - cx, this.y - cy, this.timeout / 4, this.timeout / 4, 0, 0, Math.PI * 2);
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

window.onload = setup;
// the initializing function.
function setup() {
setInterval(main, 15);
canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

centerX = canvas.width / 2;
centerY = canvas.height / 2;

sun = new Body(centerX, centerY, 100000, 100, sunColor, 1, 0, 0);
earth = new Body(sun.x + (sun.r * 9.5), sun.y, 2000, 15, startingColor, 0, 0, -2.25);
mercury = new Body(sun.x - (sun.r * 2), sun.y, 1500, 10, mercColor, 0, 0, 5.3);
bh = new Body(10000, 0, 200000, 50, blackColor, 1, 0, 0);

character = new Player(earth.x + 50, earth.y);

//populating the debris field
for (jc=0;jc<debStartNum;jc++) {
	debrisBits.push(new Debris(sun.x + ((Math.random() - 0.5) * 700), sun.y + ((Math.random() - 0.5) * 700)));
}

//finding the button
var anotherValue;
for (hl=0;hl<loadingMap.length;hl++) {
	
	for (hm=0;hm<loadingMap[hl].length;hm++) {
	//getting value
	try {
		anotherValue = loadingMap[hl][hm];
	} 
	catch (error) {
		anotherValue = 9;
	}
	
	if (anotherValue == 2) {
		buttonPos = [hl, hm];
	} 
	if (anotherValue == 4) {
		repairsRequired += 1;
	}
	}
}
}

function keyPress(h) {
	switch (h.keyCode) { 
	//arrow keys + WASD
	case 65:
		case 37:
	character.ax = -1 * entitySpeed;
		break;
	case 87:
	case 38:
	character.ay = -1 * entitySpeed;
	break;
	case 68:
	case 39:
		character.ax = 1 * entitySpeed;
		break;
	case 83:
	case 40:
	character.ay = 1 * entitySpeed;
	break;
	
	//numbers for inventory selection

	//special operations
	//shift
	case 32:
	if (gameState > 0) {
		gameState = 2;
		if (menuPos > 1) {
			menuPos = 1;
		}
		if (dt == dtBase) {
		dt = dtBase * dtMult;
		}
	}
	break;
	//z
	case 90:
	if (gameState < 0) {
		gameState = 0;
	}
	if (gameState == 0 && beltCreated == 0) {
		time += 1;
	}
	if (gameState == 2) {
		var didIt;
		var switched = 0;
		//if the player has repaired everything, attempt to finish the game
		didIt = squareMod(7, 7);
		if (didIt != 4) {
		character.end();
		}
		//if the game isn't finished... 
		//attempting to pick tool up
		if (character.toolPos == 0) {
		didIt = squareMod(6, 6.5);
		if (didIt != 4) {
			character.toolPos = 1;
			switched = 1;
		}
		}
		//attempting to put tool back, and then attempting to repair engine
		if (character.toolPos == 1 && switched == 0) {
		didIt = squareMod(6.5, 6);
		if (didIt != 4) {
			character.toolPos = 0;
			//attempting to repair
		} else {
			didIt = squareMod(4, 4);
			if (didIt != 4) {
				if (character.toolPower >= repairPower) {
				character.toolPower -= repairPower;
				squareMod(4, 5);
				repairsRequired -= 1;
				//if no repairs are left, then activate the button in the center
				if (repairsRequired < 1) {
					loadingMap[buttonPos[0]][buttonPos[1]] = 7;
				}
			} else {
				//if the power is too low, then if the player can repair, alert the player
				failedRepair = 1;
			}
			}
		}
		}
	}
	break;
	//x
	case 88:
		if (gameState == 0 && beltCreated == 0) {
		time = 6;
		}
		break;
	}
}

/*all the "character dot"s make it confusing, but I'm making the player an object
because
1. This whole game is an expirement with using objects and functions inside them,
and
2. the bodies are an object and it's easier to pass an object 
through the gravity function, stored inside the bodies. */
function keyNegate(h) {
	switch (h.keyCode) {
	case 65:
	case 37:
	if (character.ax < 0) {
		character.ax = 0;
	}
	break;
	case 87:
	case 38:
	if (character.ay < 0) {
		character.ay = 0;
	}
	break;
	case 68:
	case 39:
	if (character.ax > 0) {
		character.ax = 0;
	}
	break;
	case 83:
	case 40:
	if (character.ay > 0) {
		character.ay = 0;
	}
	break;
	case 32:
	if (gameState > 0) {
		gameState = 1;
		if (dt == dtBase * dtMult) {
		dt = dtBase;
		}
	}
	break;
	}
}

//this function is the main function that repeats every time the timer goes off. It is very important.
function main() {
	//gamestate -1 is just the splash screen. As such it is entirely text.
if (gameState == -1) {
	ctx.fillStyle = menuColor;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = textColor;
	ctx.textAlign = "center";
	ctx.font = "45px Century Gothic";
	ctx.fillText(menuText[0], centerX - 5, 50);
	ctx.font = "30px Century Gothic";
	ctx.fillText(menuText[1], centerX, centerY);
}

if (gameState == 0) {
	//always sanitize input
	time = Math.round(time);
	if (time > 5 && time < 10) {
	time = 0;
	gameState = 1;
	} else {
	var effectiveTime;
	//effectiveTime changes between pre-game and post-game, so that's here.
	if (time < 7) {
		effectiveTime = time;
	} else if (time >= 10){
		effectiveTime = time - 4;
	}

	//displaying images
	var toDisplay = new Image();
	toDisplay.src = images[effectiveTime];
	ctx.drawImage(toDisplay, 0, 0, canvas.width, canvas.height);

	//displaying text
	ctx.textAlign = "center";
	ctx.font = "20px Century Gothic";
	for (tx=0;tx<texts[effectiveTime].length;tx++) {
		ctx.fillText(texts[effectiveTime][tx], centerX, canvas.height * (0.84 + (tx * 0.0625)));
	}
	}
}

if (gameState > 0) {
	//drawing space
	ctx.fillStyle = spaceColor;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	//drawing bodies
	sun.beDrawn();
	earth.beDrawn();
	mercury.beDrawn();
	character.beDrawn();
	bh.beDrawn();
	for (a=0;a<debrisBits.length;a++) {
	debrisBits[a].beDrawn();
	}

	//adding debris, as they run into or out of the universe rather often
	if (debrisBits.length < maxDebris) {
	if (time % 30 == 1) {
		//random dust
		var posX = sun.x + ((Math.random() - 0.5) * 2000);
		var posY = sun.y + ((Math.random() - 0.5) * 2000);
		debrisBits.push(new Debris(posX, posY));
	}
	
	if (beltCreated < maxBelt) {
		
		//first gets avg position of belt (beltR)
		var beltMult = 21;
		var beltR = sun.r * beltMult;
		
		//while loop picks an xy point inside the belt range
		var choseX = 0;
		var choseY = 0;
		var choseR = 0;
		
		var xDist = 0;
		var yDist = 0;
		
		//if the point is more than 3 sun-radii away from the avg belt area, it isn't a valid point
		//pick a random point on the circle
		var angle = Math.floor(Math.random() * 360);
		angle = angle * (Math.PI / 180);
		var circlePoint = [sun.x + (beltR * Math.sin(angle)), sun.y + (beltR * Math.cos(angle))];

		//give the point a random offset
		choseX = circlePoint[0] + ((Math.random() - 0.5) * sun.r);
		choseY = circlePoint[1] + ((Math.random() - 0.5) * sun.r);

		//split into x and y distances
		xDist = choseX - sun.x;
		yDist = choseY - sun.y;
		/* Next the velocity needs to be gotten. Here we can turn to my good old friend atan2. */
		var velAngle = (Math.PI / 2) + Math.atan2(xDist, yDist);

		var choseVelX = beltV * Math.sin(velAngle);
		var choseVelY = beltV * Math.cos(velAngle);
		
		//finally spawn the debris
		debrisBits.push(new Debris(choseX, choseY, choseVelX, choseVelY));

		beltCreated += 1;
	}
	}
	//ticking everything
	handleCollision(); 

	//time based things, adding time and then making the sun expand if doom time is happening.
	time += 1 / dt;
	failedRepair -= 0.00390625;
	timeLeft = timeUntilExplosion - time;
	if (timeLeft < 0) {
	sun.r *= 1.00625 / dt;
	sun.m *= 1.0125 / dt;
	}
	
	if (gameState == 1) {
	character.recieveInput();
	menuPos += menuIncrement;
	}
	if (gameState == 2) {
	drawShip();
	moveInShip();
	//menu things
	menuPos -= menuIncrement * 3;
	if (menuPos < menuLimit) {
		menuPos = menuLimit;
	}
	} 
	//drawing the menu goes last, because it needs to be on top of everything.
	drawMenu();
}
}

function handleCollision() {
//debris-body interaction
var shouldExist;

for (w=0;w<debrisBits.length;w++) {
	sun.gravitate(debrisBits[w]);
	earth.gravitate(debrisBits[w]);
	mercury.gravitate(debrisBits[w]);

	debrisBits[w].move();

	//debris-player interaction
	var diffX = Math.abs(character.x - debrisBits[w].x);
	var diffY = Math.abs(character.y - debrisBits[w].y);
	if (diffX < 10 && diffY < 10) {
	character.debrisHit(debrisBits[w].dx, debrisBits[w].dy);
	debrisBits[w].physical = 0;
	}
	//removing debris
	shouldExist = debrisBits[w].physical;
	if (shouldExist != 1) {
	debrisBits.splice(w, 1);
	}
}

//player-body interaction
sun.gravitate(character);
earth.gravitate(character);
mercury.gravitate(character);
bh.gravitate(character);

/*body-body interaction, it's somewhat limited in that the 
sun doesn't move and mercury-earth don't interact. I did this
because when running a simulation, they didn't affect each-other's 
orbit too much, and the point of mercury is to mess with the 
player's orbit, not other bodies. Sorry mercury. */

sun.gravitate(earth);
sun.gravitate(mercury);

//moving things
earth.move();
mercury.move();
character.tick();
}  

function drawMenu() {
//to save time, only draw the menu if it is in-bounds
if (menuPos < 1) {
	//establish the drawMeter function for later
	function drawMeter(x, y, width, height, value, min, max, color) {
	var percentage = value / (max - min);
	ctx.strokeStyle = color;
	ctx.fillStyle = color;
	ctx.lineWidth = "2";
	ctx.beginPath();
	ctx.rect(x, y, width, height);
	ctx.stroke();
	ctx.fillRect(x+3, y+3, (width - 6) * percentage, height-6);
	}

	//drawing menu boxes
	ctx.fillStyle = computeColor;
	ctx.fillRect(0, canvas.height * menuPos, canvas.width, canvas.height * 0.3);
	ctx.fillRect(0, 0, canvas.width, canvas.height * (1 - (menuPos + 0.1)));

	//text for all the meters
	ctx.fillStyle = textColor;
	ctx.textAlign = "left";
	ctx.font = "20px Century Gothic";
	ctx.fillText(barsText[0], 12, canvas.height * (menuPos + 0.06));
	ctx.fillText(barsText[1], 12, canvas.height * (menuPos + 0.11));
	ctx.fillText(barsText[2], 12, canvas.height * (menuPos + 0.16));
	ctx.fillText(barsText[3], 12, canvas.height * (1 - (menuPos + 0.13)));
	ctx.fillText(barsText[4], canvas.width * 0.45, canvas.height * (1 - (menuPos + 0.13)));
	
	//timer and effects

	ctx.globalAlpha = 1;
	//meters now
	//determining the color of the temperature meter
	var temperColor;
	var toolColor;
	if (character.warm < 33.33333 || character.warm > 66.6666) {
	if (character.warm < 33.33333) {
		temperColor = cTemperColor;
	} else {
		temperColor = hTemperColor;
	}
	} else {
	temperColor = mTemperColor;
	}
	//determining the color of the repair tool meter
	if (character.toolPos == 0) {
	toolColor = powerColor;
	} else {
	toolColor = playerColor;
	}

	var meterX = canvas.width * 0.4;
	var meterWidth = canvas.width * 0.5;
	var meterHeight = canvas.height * 0.04;
	//solar
	drawMeter(meterX, canvas.height * (menuPos + 0.03), meterWidth, meterHeight, character.pow, 0, 100, powerColor);
	//temp
	drawMeter(meterX, canvas.height * (menuPos + 0.08), meterWidth, meterHeight, character.warm, 0, 100, temperColor);
	//fuel
	drawMeter(meterX, canvas.height * (menuPos + 0.13), meterWidth, meterHeight, character.fuel, 0, 100, fuelColor);

	//repair power
	drawMeter(meterX * 1.75, canvas.height * (1 - (menuPos + 0.16)), meterWidth / 2, meterHeight, character.toolPower, 0, 50, toolColor);
	
	//making timer flash
	var timeDisplay = timeLeft;
	if (timeLeft < 0) {
	timeDisplay = 0;
	ctx.globalAlpha = Math.floor((time % (cutsceneTime / 3) / (cutsceneTime / 6)));
	};
	//time is not a meter, but drawing it here anyways
	ctx.fillText((timeDisplay / 66.666666666).toFixed(2), canvas.width * 0.325, canvas.height * (1 - (menuPos + 0.13)))
	ctx.globalAlpha = 1;
} else {
	menuPos = 1;
}
//draw the failed repair text if necessary
if (failedRepair > 0 && gameState == 2) {
	if (gameState == 2) {
		ctx.fillStyle = sunColor;
		ctx.globalAlpha = failedRepair;
		ctx.textAlign = "center";
		ctx.fillText(failedRepairText[0], canvas.width * 0.5, canvas.height * 0.3);
		ctx.fillText(failedRepairText[1], canvas.width * 0.5, canvas.height * 0.35);
		ctx.globalAlpha = 1;
	}
}
//sun-dial gets drawn no matter what
	var dialX = canvas.width * 0.9;
	var dialY = (canvas.height * (0.9 + (menuPos - 1)));
	var angle = Math.PI + Math.atan2((character.x - sun.x), (character.y - sun.y));
	var l = 20;
	ctx.strokeStyle = textColor;
	ctx.lineWidth = "4";
	ctx.beginPath();
	ctx.ellipse(dialX, dialY, 20, 20, 0, 0, Math.PI * 2);
	ctx.stroke();
	ctx.beginPath();
	ctx.strokeStyle = sunColor;
	ctx.moveTo(dialX, dialY);
	ctx.lineTo(dialX + (l * Math.sin(angle)), dialY + (l * Math.cos(angle)));
	ctx.stroke();
	
//if doomsday is happening, color the screen accordingly, kill the player if too much time has passed
if (timeLeft < 0) {
	ctx.globalAlpha = Math.abs(timeLeft) / (cutsceneTime * 4);
	ctx.fillStyle = sunColor;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	if (-1 * timeLeft > cutsceneTime * 4) {
	gameState = 0;
	time = 10;
	}
	ctx.globalAlpha = 1;
	ctx.fillStyle = textColor;
}
}

function drawShip() { 
//to prevent ugly lines from appearing in the map, the coordinates are rounded to the pixel

	cornerCoords[0] = Math.round(x) - centerX - squareSize;
cornerCoords[1] = Math.round(y) - centerY - squareSize;
cornerCoords[2] = Math.round(x) + centerX + squareSize;
cornerCoords[3] = Math.round(y) + centerY + squareSize;
var mapCounter = 0;
var loadingMap = shipMap;
var theColor;

var xSquare = Math.round(x) / squareSize;
var ySquare = Math.round(y) / squareSize;

/* mapSquare is the function that draws all the different tiles. */
function mapSquare(value, ex, why) {
	switch (value) {
	case 0:
		ctx.fillStyle = playerColor;
			ctx.fillRect(ex, why, squareSize, squareSize);
		ctx.globalAlpha = 1;
		break;
	case 1:
	case 2:
		ctx.fillStyle = shipColor;
			ctx.fillRect(ex, why, squareSize, squareSize);
		break;
	case 3:
		ctx.fillStyle = computeColor;
			ctx.fillRect(ex, why, squareSize, squareSize);
		ctx.strokeStyle = computeWireColor;
		ctx.lineWidth = "1";
		var num = 4;
		for (cl=0;cl<num;cl++) {
		ctx.beginPath();
		ctx.moveTo(ex, why + (squareSize * (1/(2 * num))) + (squareSize * cl/num));
		ctx.lineTo(ex+squareSize, why + (squareSize * (1/(2 * num))) + (squareSize * cl/num));
		ctx.stroke();
		}
		break;
	case 4:
		mapSquare(1, ex, why);
		ctx.globalAlpha = 0.7 + (Math.sin(time / 90) * 0.3);
		ctx.fillStyle = brokenHyperColor;
		ctx.fillRect(ex, why, squareSize, squareSize);
		ctx.globalAlpha = 1;
		break;
	case 5:
		mapSquare(1, ex, why);
		ctx.globalAlpha = 0.7 + (Math.sin(time / 90) * 0.3);
		ctx.fillStyle = hyperColor;
		ctx.fillRect(ex, why, squareSize, squareSize);
		ctx.globalAlpha = 1;
		break;
	case 6.5:
		mapSquare(1, ex, why);
		ctx.fillStyle = repairColor;
		ctx.fillRect(ex+(squareSize / 2), why, squareSize / 2, squareSize);
		break;
	case 6:
		mapSquare(6.5, ex, why);
		ctx.fillRect(ex, why, squareSize / 3, squareSize);
	case 9:
	default:
		break;
	}
}
/*This is the part that draws the map. It uses two while loops, one for y and one for x. */
var row = cornerCoords[1] / squareSize;
var mapRow = 0 - (row - Math.floor(row));
var counter = 0;

while (row * squareSize < cornerCoords[3]) {    
	counter = cornerCoords[0] / squareSize;
	mapCounter = 0 - (counter - Math.floor(counter));
	
	while (counter * squareSize < cornerCoords[2]) {
		//this line determines what square to load in. For the rows, it uses counter, and for the number of rows it uses row. The floor and absolute value operations are just to turn the players square coordinates into something that the array can understand.
		var value;
	try {
		value = loadingMap[(Math.floor(row))][Math.floor(counter)];
	} 
	catch(error) {
		value = 9;
	}
		mapSquare(value, (mapCounter * squareSize) - squareSize, (mapRow * squareSize) - squareSize);
		counter = counter + 1;
	mapCounter = mapCounter + 1;
	
	
	}
	row = row + 1;
	mapRow = mapRow + 1;
}
//after drawing the map, draws the player
ctx.beginPath();
ctx.fillStyle = characterColor;
ctx.ellipse(centerX, centerY, 5, 5, 0, 0, Math.PI * 2);
ctx.fill();

//drawing the repair tool
if (character.toolPos == 1) {
	ctx.beginPath();
	ctx.fillStyle = repairColor;
	ctx.fillRect(centerX-10, centerY-10, 5, 20);
}

}

function moveInShip() {
x += character.ax * 100;

//this part handles collision for x
arrayValue = loadingMap[Math.floor((y) / squareSize)][Math.floor((x) / squareSize)];

for (l=0; l<solidSurfaces.length; l++) {
	if (arrayValue == solidSurfaces[l]) {
		x -= character.ax * 100;
	}
}
//and for y
y += character.ay * 60;
arrayValue = loadingMap[Math.floor((y) / squareSize)][Math.floor((x) / squareSize)];

for (l=0; l<solidSurfaces.length; l++) {
	if (arrayValue == solidSurfaces[l]) {
		y -= character.ay * 60;
	}
}
}

function squareMod(toFind, toReplace) {
//first get the player's square position
//defining more variables
var playerSquare = [Math.floor(x / squareSize), Math.floor(y / squareSize)];
var squareValue;

var xOff;
var yOff;

for (sq=0;sq<4;sq++) {
	//get the searching position
	xOff = Math.round(Math.sin(sq*0.5*Math.PI));
	yOff = Math.round(Math.cos(sq*0.5*Math.PI));
	//get the value
	try {
	squareValue = loadingMap[playerSquare[1] + yOff][playerSquare[0] + xOff];
	}
	catch (error) {
	squareValue = 9;
	}

	//if it's the right value, return the position of the square.
	if (squareValue == toFind) {
	loadingMap[playerSquare[1] + yOff][playerSquare[0] + xOff] = toReplace;
	return sq;
	}
}
//if the for loop is exited, then that means there are no squares
//if no squares were found, then the code will continue and 0 will be returned
return 4;
}