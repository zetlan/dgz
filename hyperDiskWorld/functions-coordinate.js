/*
A WORD ON TERMINOLOGY
hypPoints refers to euclidean polar coordinates from the origin.
a regular point (points) generally refers to a euclidean point inside the unit circle.
functions will operate on hypPoints, or points, or both. The goal is for this to be clear.

true HyperCoordinates are almost never actually used, because a coordinate system in a non-abelian space makes me want to cry, 
so there's a bunch of tricks used to convert between projection and actual coordinate space.


*/





//this code yoinked from the interwebs. I'm lazy. 
//https://stackoverflow.com/questions/12219802/a-javascript-function-that-returns-the-x-y-points-of-intersection-between-two-ci
function intersectionOfTwoCircles(circleParams1, circleParams2) {
	var [x0, y0, r0] = circleParams1;
	var [x1, y1, r1] = circleParams2;
	var h, rx, ry;

	//get distances between circle centers
	var dx = x1 - x0;
	var dy = y1 - y0;

	//distance
	var dist = Math.sqrt((dx ** 2) + (dy ** 2));

	//if circles do not intersect (are too far apart)
	if (dist > (r0 + r1)) {
		return undefined;
	}
	//if circles are contained within each other
	if (dist < Math.abs(r0 - r1)) {
		return undefined;
	}

	//'point 2' is the point where the line through the circle intersection points crosses the line between the circle centers.

	//Determine the distance from point 0 to point 2.
	var p02Dist = ((r0 ** 2) - (r1 ** 2) + (dist ** 2)) / (dist * 2);

	//Determine the coordinates of point 2.
	var x2 = x0 + (dx * p02Dist / dist);
	var y2 = y0 + (dy * p02Dist / dist);

	/* Determine the distance from point 2 to either of the
	* intersection points.
	*/
	h = Math.sqrt((r0 ** 2) - (p02Dist ** 2));

	/* Now determine the offsets of the intersection points from
	* point 2.
	*/
	rx = -dy * (h / dist);
	ry = dx * (h / dist);

	/* Determine the absolute intersection points. */
	var xi = x2 + rx;
	var xi_prime = x2 - rx;
	var yi = y2 + ry;
	var yi_prime = y2 - ry;

	return [[xi, yi], [xi_prime, yi_prime]];
}