/* 
like functions-math, but dealing with multi-dimensional problems instead of single dimensional ones.

INDEX
cartToPol(x, y, z);
getDistance(x1, y1, z1, x2, y2, z2);
polToCart(theta, phi, radius);
rotate(x, z, radians)

*/


function cartToPol(x, y, z) {
	var rad = Math.sqrt((x * x) + (y * y) + (z * z));
	var theta = Math.atan2(x, z);
	var phi = Math.atan(y / Math.sqrt((z * z) + (x * x)));
	
	return [theta, phi, rad];
}

function getDistance(x1, y1, z1, x2, y2, z2) {
	return Math.sqrt(((x1 - x2) * (x1 - x2)) + ((y1 - y2) * (y1 - y2)) + ((z1 - z2) * (z1 - z2)));
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