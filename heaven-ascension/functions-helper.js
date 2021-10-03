

function activateEnding() {
	//hacky solution but whatever

	//turns the player into a box once they leave the final area
}


//helper math fucntion, clamps a number to a boundary
function clamp(num, min, max) {
	return num <= min ? min : num >= max ? max : num;
}

//for quickly drawing circles
function drawCircle(x, y, radius, color) {
	ctx.beginPath();
	ctx.fillStyle = color;
	ctx.ellipse(x, y, radius, radius, 0, 0, Math.PI * 2);
	ctx.fill();
}


//draws all the fixed terrain blocks
function drawMap() {
	//startX + startY refers to the tile number that the camera will start drawing from
	var startX = Math.floor(camera.x);
	var startY = Math.floor(camera.y);

	//which pixel the drawing will start from
	var [screenStartX, screenStartY] = spaceToScreen(startX, startY);
	
	//sizeX + sizeY refers to the number of tiles that will be drawn
	var sizeX = Math.ceil(canvas.width / camera.scale) + 1;
	var sizeY = Math.ceil(canvas.height / camera.scale) + 1;

	for (var y=Math.max(startY, 0); y<Math.min(startY+sizeY, data_map.length); y++) {
		for (var x=Math.max(startX, 0); x<startX+sizeX; x++) {
			drawMapSquare(screenStartX + (x - startX) * camera.scale, screenStartY + (y - startY) * camera.scale, data_map[y][x], camera.scale + 1);
		}
	}
}

//draws a map square of a certain type at predetermined coordinates
function drawMapSquare(x, y, type, size) {
	switch (type) {
		case "1":
			ctx.globalAlpha = cloudOpacity;
			ctx.fillStyle = color_cloudDark;
			ctx.fillRect(x, y, size-1, size-1);
			ctx.globalAlpha = 1;
			break;
		case "2":
			ctx.globalAlpha = cloudOpacity;
			ctx.fillStyle = color_cloudMedium;
			ctx.fillRect(x, y, size-1, size-1);
			ctx.globalAlpha = 1;
			break;
		case "3":
			ctx.globalAlpha = cloudOpacity;
			ctx.fillStyle = color_cloudLight;
			ctx.fillRect(x, y, size-1, size-1);
			ctx.globalAlpha = 1;
			break;

		//deco
		case "5":
			drawMapSquare(x, y, "6", size);
			var div8 = size / 8;
			var div4 = size / 4;
			var div2 = size / 2;
			var lnW = ctx.lineWidth;
			ctx.strokeStyle = color_rune;
			ctx.lineWidth = div4;
			ctx.beginPath();
			//ctx.filter = `blur(${Math.floor(size / 10)}px)`;
			ctx.moveTo(x + div8, y);
			ctx.lineTo(x + div8, y + div4);
			ctx.lineTo(x + div4, y + div2);
			ctx.lineTo(x + div8, y + div2 + div4);
			ctx.lineTo(x + div8, y + size);

			ctx.moveTo(x + size - div8, y);
			ctx.lineTo(x + size - div8, y + div4);
			ctx.lineTo(x + div2 + div4, y + div2);
			ctx.lineTo(x + size - div8, y + div2 + div4);
			ctx.lineTo(x + size - div8, y + size);
			ctx.stroke();

			drawCircle(x + size / 2, y + size / 8, size / 8, color_rune);
			drawCircle(x + size / 2, y + size / 8 * 7, size / 8, color_rune);
			//ctx.filter = "none";
			ctx.lineWidth = lnW;
			break;
		case "6":
			ctx.globalAlpha = 0.5;
			drawMapSquare(x, y, "9", size);
			ctx.globalAlpha = 1;
			break;
		//unbreakable terrain
		case "7":
			ctx.fillStyle = color_terrainHell;
			ctx.fillRect(x, y, size, size);
			break;
		case "8":
			ctx.fillStyle = color_terrainNeutral;
			ctx.fillRect(x, y, size, size);
			break;
		case "9":
			ctx.fillStyle = color_terrainHeaven;
			ctx.fillRect(x, y, size, size);
			break;
	}
}



//helps with collision. Looks for if there's an entity or non-air block at xy, and returns it if there is
function findObstacleAtPosition(x, y, entity) {
	//if y is out of bounds just return undefined, I don't feel like catching array access errors and there's not going to be boxes there anyways
	if (y < 0 || y >= data_map.length) {
		return undefined;
	}
	//search for block there
	if (data_tileCollision.indexOf(data_map[Math.floor(y)][Math.floor(x)]) != -1) {
		//return the tile if there is one
		return data_map[Math.floor(y)][Math.floor(x)];
	}

	//search for object there
	for (var h=0; h<entities.length; h++) {
		//no self-intersection
		if (entities[h] != entity) {
			if (Math.abs(entities[h].x - x) < 0.5 && Math.abs(entities[h].y - y) < 0.5) {
				return entities[h];
			}
		}
	}

	//no blockage case
	return undefined;
}

function isOnScreen(worldX, worldY) {
	return (worldX - camera.x > -2 && worldX - camera.x < canvas.width / camera.scale + 2 && worldY - camera.y > -2 && worldY - camera.y < canvas.height / camera.scale + 2);
}

//returns a value given a percentage from a to b
function linterp(a, b, percentage) {
	return a + (b - a) * percentage;
}

//returns the percentage from a to b that the value is
function percentage(a, b, value) {
	return (value - a) / (b - a);
}

function outputMap() {
	//squish all the lines together, then output
	var newStr = JSON.stringify(data_map.map(function(a) {
		return a.reduce((b, c) => b + c);
	}));
	console.log(newStr.replaceAll(",", ",\n"));
}

//converts polar coordinates to XY coordinates
function polToXY(startX, startY, angle, magnitude) {
	var xOff = magnitude * Math.cos(angle);
	var yOff = magnitude * Math.sin(angle);
	return [startX + xOff, startY + yOff];
}

//another polar function, rotates xy coordinates by a certain amount
function rotate(x, y, radians) {
	var sin = Math.sin(radians);
	var cos = Math.cos(radians);
	return [x * cos - y * sin, y * cos + x * sin];
}



//sets default canvas settings
function setCanvasPreferences() {
	ctx.lineWidth = 2;
	ctx.lineJoin = "round";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
}

//converts world coordinates to screen coordinates, it's pretty handy
function spaceToScreen(x, y) {
	return [(x - camera.x) * camera.scale, (y - camera.y) * camera.scale];
}