function getDistBetween(x1, y1, x2, y2) {
	//subtract position of a from b
	x2 -= x1;
	y2 -= y1;

	//get pythagorean distance
	var dist = Math.sqrt((x2 * x2) + (y2 * y2));

	return dist;
}
	//functions for determining 2d collision are stored here, such as if two line segments intersect, if a point is inside a polygon, and other helpful functions relating to 2d position.


function getOrientation(p1, p2, p3) {
	//will return 0 if points are colinear, 1 if points are counterclockwise, and 2 if points are clockwise.

	//formula compares slope and gets direction based off of that
	var value = (p2[1] - p1[1]) * (p3[0] - p2[0]) - (p2[0] - p1[0]) * (p3[1] - p2[1]);

	//If second slope is greater, clockwise. If second slope is smaller, counterclockwise. If not, it must be colinear.
	if (value > 0) {
		return 2;
	}
	if (value < 0) {
		return 1;
	} else {
		return 0;
	}
}

function lineIntersect(lin1p1, lin1p2, lin2p1, lin2p2) {
	/*lines intersect if the orientation between:
		a. the points in the first segment and the first point in the second segment
		b. the points in the first segment and the second point in the second segment

		are different, and vice versa, so

		c. the points in the second segment and the first point in the first segment
		d. the points in the second segment and the second point in the first segment

		are different. If a != b and c != d, they intersect.
	*/
	var a = getOrientation(lin1p1, lin1p2, lin2p1);
	var b = getOrientation(lin1p1, lin1p2, lin2p2);
	var c = getOrientation(lin2p1, lin2p2, lin1p1);
	var d = getOrientation(lin2p1, lin2p2, lin1p2);

	if (a != b && c != d) {
		return 1;
	} else {
		return 0;
	}
}



function inPoly(xyPoint, polyPoints) {
	//to test if a point is in a polygon, a line is drawn out to infinity (or close enough)
	//and it's checked against all lines in the polygon. If it hits an odd number of lines, it is inside.

	//making collision line
	var linP1 = xyPoint;
	var linP2 = [canvas.width, xyPoint[1]];

	var intersectNum = 0;
	//checking against all polygon lines
	for (var r=0;r<polyPoints.length;r++) {
		var p1 = polyPoints[r % polyPoints.length];
		var p2 = polyPoints[(r+1) % polyPoints.length];

		if (lineIntersect(p1, p2, linP1, linP2)) {
		intersectNum += 1;
		}
	}

	//return final value
	if (intersectNum % 2 == 1) {
		return true;
	} else {
		return false;
	}
}
