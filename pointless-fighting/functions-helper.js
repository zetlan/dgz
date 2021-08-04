/*
INDEX
	generateTileImageMap();
	getImage(url);
	polToXY(startX, startY, angle, magnitude);
	spaceToScreen(x, y);
	screenToSpace(x, y);

*/




function generateTileImageMap() {
	var map = {};
	for (var c=0; c<tileImage_key.length; c++) {
		map[tileImage_key[c]] = c;
	}
	return map;
}

function getImage(url) {
	var image = new Image();
	image.src = url;
	return image;
}

function polToXY(startX, startY, angle, magnitude) {
	var xOff = magnitude * Math.cos(angle);
	var yOff = magnitude * Math.sin(angle);
	return [startX + xOff, startY + yOff];
}

function spaceToScreen(x, y) {
	return [(x - camera.cornerCoords[0]) * camera.scale, (y - camera.cornerCoords[1]) * camera.scale * camera.vSquish];
}

function screenToSpace(x, y) {
	return [(x / camera.scale) + camera.cornerCoords[0], (y / camera.scale / camera.vSquish) + camera.cornerCoords[1]];
}
