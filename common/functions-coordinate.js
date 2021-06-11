/* 
like functions-math, but dealing with multi-dimensional problems instead of single dimensional ones.

INDEX
cartToPol(x, y, z);
clipToZ0(polyPoints, tolerance, invertClipDirection);
getDistance(x1, y1, z1, x2, y2, z2);
polToCart(theta, phi, radius);
rotate(x, z, radians)
*/

//the opposite of polToCart, takes in an xyz point and outputs a vector in the form of [theta, phi, radius]
function cartToPol(x, y, z) {
	var rad = Math.sqrt((x * x) + (y * y) + (z * z));
	var theta = Math.atan2(x, z);
	var phi = Math.atan(y / Math.sqrt((z * z) + (x * x)));
	
	return [theta, phi, rad];
}

//takes in an array of points and clips all the points that have a Z less than 0. Modifies the array in the process
function clipToZ0(polyPoints, tolerance, invertClipDirection) {
	//to save time, inverting the clip direction just means inverting all the points, then inverting back
	if (invertClipDirection) {
		polyPoints.forEach(p => {
			p[2] *= -1;
		});
	}
	//make all the polypoints have a boolean that says whether they're clipped or not, this is used for number of neighbors
	var halt = true;
	var n = 0;
	while (halt && n < polyPoints.length) {
		if (polyPoints[n][2] < tolerance) {
			polyPoints[n][3] = true;
		} else {
			halt = false;
			polyPoints[n][3] = false;
		}
		n += 1;
	}

	//return early if all points are destroyed
	if (halt) {
		return [];
	}

	while (n < polyPoints.length) {
		polyPoints[n][3] = polyPoints[n][2] < tolerance;
		n += 1;
	}
	for (var y=0; y<polyPoints.length; y++) {
		//if the selected point will be clipped, run the algorithm
		if (polyPoints[y][3]) {
			//decide what to do based on the number of adjacent non-clipped points
			switch (!polyPoints[(y+(polyPoints.length-1))%polyPoints.length][3] + !polyPoints[(y+1)%polyPoints.length][3]) {
				case 0:
					//if there are no free friends, there's no point in attempting, so just move on
					polyPoints.splice(y, 1);
					y -= 1;
					break;
				case 1:
					//determine which one is free, then move towards it
					var friendCoords;
					var moveAmount;
					//lesser friend
					if (!polyPoints[(y+(polyPoints.length-1))%polyPoints.length][3]) {
						friendCoords = polyPoints[(y+(polyPoints.length-1))%polyPoints.length];
						moveAmount = getPercentage(friendCoords[2], polyPoints[y][2], tolerance);
						polyPoints[y] = [linterp(friendCoords[0], polyPoints[y][0], moveAmount), linterp(friendCoords[1], polyPoints[y][1], moveAmount), tolerance, true];
					} else {
						//greater friend
						friendCoords = polyPoints[(y+1)%polyPoints.length];
						moveAmount = getPercentage(friendCoords[2], polyPoints[y][2], tolerance);
						polyPoints[y] = [linterp(friendCoords[0], polyPoints[y][0], moveAmount), linterp(friendCoords[1], polyPoints[y][1], moveAmount), tolerance, true];
					}
					break;
				case 2:
					//move towards both friends
					var friendCoords = polyPoints[(y+(polyPoints.length-1))%polyPoints.length];
					var moveAmount = getPercentage(friendCoords[2], polyPoints[y][2], tolerance);
					polyPoints.splice(y, 0, [linterp(friendCoords[0], polyPoints[y][0], moveAmount), linterp(friendCoords[1], polyPoints[y][1], moveAmount), tolerance, true]);
					y += 1;

					friendCoords = polyPoints[(y+1)%polyPoints.length];
					moveAmount = getPercentage(friendCoords[2], polyPoints[y][2], tolerance);
					polyPoints[y] = [linterp(friendCoords[0], polyPoints[y][0], moveAmount), linterp(friendCoords[1], polyPoints[y][1], moveAmount), tolerance, true];
					y -= 1;
					break;
			}
		}
	}
	if (invertClipDirection) {
		polyPoints.forEach(p => {
			p[2] *= -1;
		});
	}
	return polyPoints;
}

function polToCart(theta, phi, radius) {
	//theta here is horizontal angle, while phi is vertical inclination
	return [radius * Math.sin(theta) * Math.cos(phi), 
			radius * Math.sin(phi), 
			radius * Math.cos(theta) * Math.cos(phi)];
}

function rotate(x, z, radians) {
	var sin = Math.sin(radians);
	var cos = Math.cos(radians);
	return [x * cos - z * sin, z * cos + x * sin];
}