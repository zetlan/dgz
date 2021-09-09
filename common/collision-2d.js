//functions for determining 2d collision are stored here, such as if two line segments intersect, if a point is inside a polygon, and other helpful functions relating to 2d position.

//will return 0 if points are colinear, -1 if points are counterclockwise, and 1 if points are clockwise.
function getOrientation(p1, p2, p3) {
	//formula compares slope and gets direction based off of that
	var value = (p2[1] - p1[1]) * (p3[0] - p2[0]) - (p2[0] - p1[0]) * (p3[1] - p2[1]); 
	
	//If second slope is greater, clockwise. If second slope is smaller, counterclockwise. If not, it must be colinear.
	if (value > 0) {
		return 1;
	}
	if (value < 0) {
		return -1;
	}
	return 0;
}

/*lines intersect if the orientation between:
	a. the points in the first segment and the first point in the second segment
	b. the points in the first segment and the second point in the second segment

	are different, and vice versa, so

	c. the points in the second segment and the first point in the first segment
	d. the points in the second segment and the second point in the first segment

	are different. If a != b and c != d, they intersect.
*/
function lineIntersect(lin1p1, lin1p2, lin2p1, lin2p2) {
	return (getOrientation(lin1p1, lin1p2, lin2p1) != getOrientation(lin1p1, lin1p2, lin2p2) && getOrientation(lin2p1, lin2p2, lin1p1) != getOrientation(lin2p1, lin2p2, lin1p2))
}


function inPoly(xyPoint, polyPoints) {
	//to test if a point is in a polygon, a line is drawn out to infinity (or close enough)
	//and it's checked against all lines in the polygon. If it hits an odd number of lines, it is inside.

	//making collision line, known bug: will break if polygon is more than 1e7 units large
	var linP2 = [xyPoint[0] + 1e7, xyPoint[1]];
	var intersectNum = 0;
	//checking against all polygon lines
	for (var r=0; r<polyPoints.length; r++) {
		intersectNum += lineIntersect(polyPoints[r % polyPoints.length], polyPoints[(r+1) % polyPoints.length], xyPoint, linP2);
	}

	//return final value
	return (intersectNum % 2 == 1);
}