/*
A WORD ON TERMINOLOGY
hypPoints refers to euclidean polar coordinates from the origin.
a regular point (points) generally refers to a euclidean point inside the unit circle.
functions will operate on hypPoints, or points, or both. The goal is for this to be clear.

functions will sometimes have "hyp" in their name, meaning operating on hyperCoordinates, even if they take in euclidean xy coords. This means they do an operation in hyperbolic space 
(drawing a hyperbolic line from two euclidean points is different from drawing a euclidean line from two euclidean points.)

true HyperCoordinates are almost never actually used, because a coordinate system in a non-abelian space makes me want to cry, 
so there's a bunch of tricks used to convert between projection and actual coordinate space.



INDEX
circleFrom3Points(xyP1, xyP2, xyP3);
intersectionOfTwoCircles(circleParams1, circleParams2);

*/





function circleFrom3Points(xyP1, xyP2, xyP3) {
	//I shamelessly stole this circle code from online. Math is like magic sometimes.
	var [x1, y1] = xyP1;
	var [x2, y2] = xyP2;
	var [x3, y3] = xyP3;

	var x12 = (x1 - x2);
	var x13 = (x1 - x3);
	var x31 = -x13;
	var x21 = -x12;

	var y12 = (y1 - y2);
	var y13 = (y1 - y3);
	var y31 = -y13;
	var y21 = -y12;

	//x1^2 - x3^2
	var sx13 = x1 * x1 - x3 * x3;

	// y1^2 - y3^2
	var sy13 = y1 * y1 - y3 * y3;

	var sx21 = x2 * x2 - x1 * x1;
	var sy21 = Math.pow(y2, 2) - Math.pow(y1, 2);

	var f = ((sx13) * (x12)
			+ (sy13) * (x12)
			+ (sx21) * (x13)
			+ (sy21) * (x13))
			/ (2 * ((y31) * (x12) - (y21) * (x13)));
	var g = ((sx13) * (y12)
			+ (sy13) * (y12)
			+ (sx21) * (y13)
			+ (sy21) * (y13))
			/ (2 * ((x31) * (y12) - (x21) * (y13)));

	var c = -(x1 * x1) -
	(y1 * y1) - 2 * g * x1 - 2 * f * y1;

	// equation of a circle is
	// x^2 + y^2 + 2*g*x + 2*f*y + c = 0
	// where center is (h = -g, k = -f) and radius is r
	// as r^2 = h^2 + k^2 - c
	var h = -g;
	var k = -f;
	var r = Math.sqrt(h * h + k * k - c);

	//if r is too great, just return undefined. I used !<= isntead of > to catch NaNs.
	if (!(r <= circle_maxComputeR)) {
		return undefined;
	}

	//return xCenter, yCenter, r
	return [h, k, r];
}

//inverts a group of points over a line.
function invertGroup(group, lnP1, lnP2) {

	var lnVecX = lnP2[0] - lnP1[0];
	var lnVecY = lnP2[1] - lnP1[1];
	var lnAngle = (Math.atan2(lnVecX, lnVecY) + Math.PI * 2) % (Math.PI * 2);

	return group.map(function (p) {
		var rotated = rotate(lnP1[0] - p[0], lnP1[1] - p[1], -lnAngle);
		var distance = 1 / rotated[0];
		return polToXY(p[0], p[1], lnAngle + (Math.PI / 2), distance);
	});
}

//takes two polar vectors as [distance, angle] format and converts the first one to the second one's frame of reference
function changePolarReference(p1Vec, polarChangeBy) {
	var angleA = Math.abs(p1Vec[1] - polarChangeBy[1]);
	var d2 = Math.sqrt(polarChangeBy[0] ** 2 + p1Vec[0] ** 2 - 2 * polarChangeBy[0] * p1Vec[0] * Math.cos(angleA));
	var angleC = Math.asin((p1Vec[0] * Math.sin(angleA)) / d2);
	var theta2 = angleC - (Math.PI - polarChangeBy[1]);

	return [d2, theta2];
}