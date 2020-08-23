//draws each individual square

/* 
  - empty space
A - wall
a - bluish ground
b - grass
c -
d - 
e - exit block

0/9 - enter blocks 
*/




//shadow blocks are solid colors, so the function is simpler
function drawMapShadow(ex, why, tileType) {
	ctx.globalAlpha = 0.5;
	//if it's a number, it'll be an exit block
	var exitBlock = String(tileType).match(/^\d/);
	var drawColor;

	if (tileType != " ") {
		if (exitBlock) {
			drawColor = color_exit;
		} else {
			//all regular tiles
			switch(tileType) {
				case "A":
					drawColor = color_wall;
					break;
				case "a":
					drawColor = color_floor;
					break;
				case "b":
					drawColor = color_grass_shadow;
					break;
				default:
					drawColor = color_error;
					break;
			}
		}
		ctx.fillStyle = drawColor;
		drawPoly(ex, why, Math.ceil(tile_half / 0.89), 6, Math.PI / 6);
	}
	ctx.globalAlpha = 1;
}

//real map squares have textures, so the drawing is a bit more complex
function drawMapSquare(ex, why, tileType) {
	//if it's a number, it'll be an exit block
	var exitBlock = String(tileType).match(/^\d/);
	if (exitBlock) {
		//block
		//color changes if completed
		var colorComplete = false;
		try {
			colorComplete = loading_map.connections[tileType].completed;
		} catch (erer) {}
		if (colorComplete) {
			ctx.fillStyle = color_exit_complete;
		} else {
			ctx.fillStyle = color_exit;
		}
		drawPoly(ex, why, Math.ceil(tile_half / Math.sin(Math.PI / 3)), 6, Math.PI / 6);
		ctx.fillStyle = color_exit_center;
		drawPoly(ex, why, Math.ceil((tile_half * 0.6) / Math.sin(Math.PI / 3)), 6, Math.PI / 6);

		//number
		ctx.fillStyle = color_text;
		ctx.fillText(tileType, ex, why + tile_size * 0.25);
		
	} else if (tileType != " ") {
		//all regular tiles
		switch(tileType) {
			case "A":
				ctx.fillStyle = color_wall_secondary;
				drawPoly(ex, why, Math.ceil(tile_half / Math.sin(Math.PI / 3)), 6, Math.PI / 6);
				ctx.fillStyle = color_wall;
				drawPoly(ex, why, tile_half * 0.9, 6, Math.PI / 6);
				break;
			case "a":
				ctx.fillStyle = color_floor;
				drawPoly(ex, why, Math.ceil(tile_half / Math.sin(Math.PI / 3)), 6, Math.PI / 6);
				break;
			case "b":
				ctx.fillStyle = color_grass;
				drawPoly(ex, why, Math.ceil(tile_half / Math.sin(Math.PI / 3)), 6, Math.PI / 6);
				var value = screenToSpace(ex, why);
				ctx.globalAlpha = ((Math.sin(value[0] / 2) + Math.cos(value[1] / 2)) / 4) + 0.5;
				ctx.fillStyle = color_grass_highlight;
				drawPoly(ex, why, Math.ceil(tile_half / Math.sin(Math.PI / 3)), 6, Math.PI / 6);
				ctx.globalAlpha = 1;
				break;
			case "e":
				ctx.fillStyle = color_exit_complete;
				drawPoly(ex, why, Math.ceil(tile_half / Math.sin(Math.PI / 3)), 6, Math.PI / 6);
				ctx.fillStyle = color_player;
				drawPoly(ex, why, Math.ceil((tile_half * 0.6) / Math.sin(Math.PI / 3)), 6, Math.PI / 6);
				break;
			default:
				ctx.fillStyle = color_error;
				drawPoly(ex, why, Math.ceil(tile_half / Math.sin(Math.PI / 3)), 6, Math.PI / 6);
				break;
		}
		
	}
}