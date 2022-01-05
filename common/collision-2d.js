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

function pointSegmentDistance(point, lineP1, lineP2) {
	var changeX = lineP2[0] - lineP1[0];
	var changeY = lineP2[1] - lineP1[1];

	//segment is a point and distance is easy
	if (changeX == 0 && changeY == 0) {
		return Math.sqrt((point[0] - lineP1[0]) ** 2 + (point[1] - lineP1[1]) ** 2);
	}

	//T is progress along the line to get minimum distance
	var t = ((point[0] - lineP1[0]) * changeX + (point[1] - lineP1[1]) * changeY) / (changeX * changeX + changeY * changeY);

	//T is off of the line
	if (t <= 0) {
		return Math.sqrt((point[0] - lineP1[0]) ** 2 + (point[1] - lineP1[1]) ** 2);
	}

	if (t >= 1) {
		return Math.sqrt((point[0] - lineP2[0]) ** 2 + (point[1] - lineP2[1]) ** 2);
	}

	//t is between the points
	return Math.sqrt((point[0] - (lineP1[0] + t * changeX)) ** 2 + (point[1] - (lineP1[1] + t * changeY)) ** 2);
}

/*
def point_segment_distance(px, py, x1, y1, x2, y2):
  dx = x2 - x1
  dy = y2 - y1
  if dx == dy == 0:  # the segment's just a point
    return math.hypot(px - x1, py - y1)

  # Calculate the t that minimizes the distance.
  t = ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy)

  # See if this represents one of the segment's
  # end points or a point in the middle.
  if t < 0:
    dx = px - x1
    dy = py - y1
  elif t > 1:
    dx = px - x2
    dy = py - y2
  else:
    near_x = x1 + t * dx
    near_y = y1 + t * dy
    dx = px - near_x
    dy = py - near_y

  return math.hypot(dx, dy)*/