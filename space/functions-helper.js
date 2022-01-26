//utility functions
//takes in an x, y screen coordinate as well as a tolerance, and returns whether that is inside the screen or not. 
//Tolerance is the amount the object can be off the screen by and still be counted.
function isOnScreen(x, y, r) {
	//x offscreen
	if (x + r < 0) {
		return false;
	}
	if (x - r > canvas.width) {
		return false;
	}

	//y offscreen
	if (y + r < 0) {
		return false;
	}
	if (y - r > canvas.height) {
		return false;
	}
	return true;
}

function rotate(x, y, radians) {
	var sin = Math.sin(radians);
	var cos = Math.cos(radians);
	return [x * cos - y * sin, y * cos + x * sin];
}

function updateResolution() {
	var multiplier = 0.5;
	if (document.getElementById("haveHighResolution").checked) {
		multiplier = 2;
	}

	//all things necessary for switching between resolutions
	canvas.width *= multiplier;
	canvas.height *= multiplier;
	display_scaleMultiplier *= multiplier;

	camera_world.scale *= multiplier;
	camera_world.scale_min *= multiplier;
	camera_world.scale_max *= multiplier;
	camera_world.scale_speed *= multiplier;

	camera_map.scale *= multiplier;
	camera_map.scale_min *= multiplier;
	camera_map.scale_max *= multiplier;
	camera_map.scale_speed *= multiplier;
}

function spaceToScreen(x, y) {
	x = x - loading_camera.x;
	y = y - loading_camera.y;

	x *= loading_camera.scale;
	y *= loading_camera.scale;

	x += canvas.width * 0.5;
	y += canvas.height * 0.5;

	return [x, y];
}

//takes in a body to orbit, the orbiting body's mass, the periapsis, and the apoapsis, and returns the velocity at apoapsis for that orbit
function calculateOrbitalVelocity(centerMass, periapsis, apoapsis) {
	if (apoapsis == periapsis) {
		//special case for completely circular orbits
		return Math.sqrt((centerMass / gravityDampener) / apoapsis);
	} else {
		//in an elliptical orbit, the formula is more generalized to v = sqrt(GM(2/r - 1/a)) where
		//G is gravitational constant, M is mass of center obj, r is current distance, and a is the semi-major axis
		//periapsis and apoapsis are always opposite, so I can just add them to get semi-major axis
		return Math.sqrt((centerMass / gravityDampener) * ((2 / apoapsis) - (1 / (periapsis + apoapsis))));
	}
}

//takes in parameters and turns them into x / y, dx / dy
function calculateOrbitalParameters(body, apo, peri, apoA, startA, counterClockwiseBOOLEAN) {
	//formula for instantaneous velocity is v = sqrt(GM(2/r - 1/a)) (vis-viva equation) where r is current distance and a is semi-major axis
	//position on ellipse is (length * cos(theta), length * sin(theta))
	//length = ab / (sqrt((b * cos(theta))^2 + (a * sin(theta))^2))
	//semi-minor axis is sqrt(periapsis * apoapsis)
	//semi-major axis is apoapsis + periapsis

	//if periapsis is greater than apoapsis, assume a mistake and swap them
	if (peri > apo) {
		[apo, peri] = [peri, apo];
		apoA += Math.PI;
		startA += Math.PI;
	}


	//major / minor axes for convienence
	var major = (apo + peri) / 2;
	var minor = Math.sqrt(apo * peri);

	//first calculate position

	//position of planet from center of ellipse
	var lengthToEdge = (major * minor) / (Math.sqrt((minor * Math.cos(startA)) ** 2 + (major * Math.sin(startA)) ** 2));
	var [x, y] = [lengthToEdge * Math.cos(startA + apoA), lengthToEdge * Math.sin(startA + apoA)];

	//position of center of ellipse from parent
	var lengthToCenter = major - peri;
	var [offX, offY] = [lengthToCenter * Math.cos(apoA), lengthToCenter * Math.sin(apoA)];
	x += offX;
	y += offY;


	//calculate velocity
	var currentHeight = Math.sqrt((x * x) + (y * y));
	var velocity = Math.sqrt((body.m / gravityDampener) * ((2 / currentHeight) - (1 / major)));


	//direct velocity based on the start angle
	var orbitAngle = startA + (Math.PI / 2);
	if (counterClockwiseBOOLEAN) {
		orbitAngle += Math.PI;
	}

	var [dx, dy] = [velocity * Math.cos(orbitAngle + apoA), velocity * Math.sin(orbitAngle + apoA)];
	return [x + body.x, y + body.y, dx + body.dx, dy + body.dy];
}

function calculateOrbitalParameters(body, apo, peri, apoA, startA, counterClockwiseBOOLEAN) {
	//make sure periapsis isn't greater than apoapsis, that would be weird
	if (peri > apo) {
		[apo, peri] = [peri, apo];
		apoA += Math.PI;
		startA += Math.PI;
	}

	//get base orbit
	var baseParams = calculateOrbitalParametersSIMPLE(body, apo, peri, startA);

	//if it's counterclockwise simply flip the velocity
	if (counterClockwiseBOOLEAN) {
		baseParams[2] *= -1;
		baseParams[3] *= -1;
	}

	//rotate by apoapsis angle
	[baseParams[0], baseParams[1]] = rotate(baseParams[0], baseParams[1], apoA);
	[baseParams[2], baseParams[3]] = rotate(baseParams[2], baseParams[3], apoA);

	//add to parent and return
	return [baseParams[0] + body.x, baseParams[1] + body.y, baseParams[2] + body.dx, baseParams[3] + body.dy];

}

//a helper function, because something was wrong with rotating orbits but I couldn't figure out what it was.
//This function can calculate orbital parameters as long as they're not tilted, and so is called by the main function and the orbit is tilted later.
function calculateOrbitalParametersSIMPLE(body, apo, peri, startA) {
	//formula for instantaneous velocity is v = sqrt(GM(2/r - 1/a)) (vis-viva equation) where r is current distance and a is semi-major axis
	//position on ellipse is (length * cos(theta), length * sin(theta))
	//length = ab / (sqrt((b * cos(theta))^2 + (a * sin(theta))^2))
	//semi-minor axis is sqrt(periapsis * apoapsis)
	//semi-major axis is apoapsis + periapsis

	//major / minor axes for convienence
	var major = (apo + peri) / 2;
	var minor = Math.sqrt(apo * peri);

	//first calculate position

	//position of orbiting planet from center of ellipse
	var sCos = Math.cos(startA);
	var sSin = Math.sin(startA);
	var lengthToEdge = (major * minor) / (Math.sqrt((minor * sCos) ** 2 + (major * sSin) ** 2));
	var [orbitX, orbitY] = [lengthToEdge * sCos, lengthToEdge * sSin];

	//position of center of ellipse from parent
	var lengthToCenter = major - peri;
	orbitX += lengthToCenter;


	//calculate velocity
	var currentHeight = Math.sqrt((orbitX ** 2) + (orbitY ** 2));
	var velocity = Math.sqrt((body.m / gravityDampener) * ((2 / currentHeight) - (1 / major)));

	//angle of velocity is tricky because this is an ellipse, not a circle. There is a pure mathmatical way to do this, but I'm lazy
	//velocity is always tangent to the ellipse, so I get a point slightly ahead of the planet and use atan to figure out that angle. For large orbits it'll be slightly off, but hey, it works
	//calculus wants what I have
	var da = -0.01;
	var sCos2 = Math.cos(startA + da);
	var sSin2 = Math.sin(startA + da);
	var l2 = (major * minor) / (Math.sqrt((minor * sCos2) ** 2 + (major * sSin2) ** 2));
	var xy2 = [l2 * sCos2, l2 * sSin2];

	var diff = [xy2[0] - (orbitX - lengthToCenter), xy2[1] - orbitY];

	var velAngle = Math.atan2(diff[1], diff[0]);

	var [dx, dy] = [velocity * Math.cos(velAngle), velocity * Math.sin(velAngle)];
	return [orbitX, orbitY, dx, dy];
}


//calculates orbits for 2 bodies in a binary orbit.
//Returns two arrays of [x, y, dx, dy]
function calculateBinaryOrbitalParameters(body1, body2) {

}

//takes in two points and gets the distance between them
function getDistance(xyP1, xyP2) {
	//pythagorean theorum. Polygons.
	return Math.sqrt(((xyP2[0] - xyP1[0]) ** 2) + ((xyP2[1] - xyP1[1]) ** 2));
}

function polToXY(startX, startY, angle, magnitude) {
	var xOff = magnitude * Math.cos(angle);
	var yOff = magnitude * Math.sin(angle);
	return [startX + xOff, startY + yOff];
}

function shops_load() {
	fetch('./shops.ssp').then(r => r.text()).then((data) => {
		console.log(data);
	});
}