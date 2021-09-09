/*
INDEX
	addZone(zoneObj);
	generateTileImageMap();
	getImage(url);
	getZone(zoneID);
	polToXY(startX, startY, angle, magnitude);
	spaceToScreen(x, y);
	screenToSpace(x, y);

*/


//adds a zone to the zone array, in alphabetical order
function addZone(zoneObj) {
	//add zone in correct spot
	for (var r=0; r<world_maps.length; r++) {
		//if out of alphabetical order, add to the previous index
		if (world_maps[r].name.localeCompare(zoneObj.name) > 0) {
			world_maps.splice(r, 0, zoneObj);
			return;
		}
	}

	world_maps.splice(world_maps.length, 0, zoneObj);
}

//takes map coords and converts them to other map coords
function convertMapCoords(x, y, map, otherMap) {
	//convert to world coordinates
	x += map.x;
	y += map.y;

	x -= otherMap.x;
	y -= otherMap.y;

	return [x, y];
}

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

function getZone(zoneID) {
	var low = 0;
	var high = world_maps.length - 1;

	//binary search
	while (low < high) {
		if (world_maps[Math.floor((low + high) / 2)].name.localeCompare(zoneID) < 0) {
			low = Math.floor((low + high) / 2) + 1;
		} else {
			high = Math.floor((low + high) / 2);
		}
	}

	if (world_maps[low].name == zoneID) {
		return world_maps[low];
	}
	return undefined;
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
