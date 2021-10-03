

function activateEnding() {
	//hacky solution but whatever

	//turns the player into a box once they leave the final area
	timeoutBuffer = window.setInterval(() => {
		//if player is outside the bounds of the heaven box, turn them into a box
		if (player.x < 41.7 || player.x > 62.3 || player.y < 0.7 || player.y > 17.3) {
			var oldPlayer = player;
			player = new FreeBlock("1", player.x, player.y);
			player.dx = oldPlayer.dx;
			player.dy = oldPlayer.dy;
			window.clearInterval(timeoutBuffer);
		}
	}, 32);
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
	screenStartX = Math.floor(screenStartX);
	screenStartY = Math.floor(screenStartY);
	
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
	ctx.drawImage(image_data, image_squareSize * (type - 1), 0, image_squareSize, image_squareSize, x, y, size, size);
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

function getImage(url) {
	var image = new Image();
	image.src = url;
	return image;
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
	ctx.lineJoin = "round";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.imageSmoothingEnabled = false;
}

//converts world coordinates to screen coordinates, it's pretty handy
function spaceToScreen(x, y) {
	return [(x - camera.x) * camera.scale, (y - camera.y) * camera.scale];
}