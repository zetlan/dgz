//draws each individual square

//shadow blocks are solid colors, so the function is simpler
function drawMapShadow(ex, why, tileType) {
    ctx.globalAlpha = 0.5
	//if it's a number, it'll be an exit block
	var exitBlock = String(tileType).match(/^\d/);
	if (exitBlock) {
		
	} else if (tileType != " ") {
		//all regular tiles
		var drawColor = color_error;
		switch(tileType) {
			case "A":
				drawColor = color_wall;
				break;
			case "a":
				drawColor = color_floor;
				break;
			default:
				break;
		}

		ctx.fillStyle = drawColor;
		drawPoly(ex, why, Math.ceil(tile_half / Math.sin(Math.PI / 3)), 6, Math.PI / 6);
    }
    ctx.globalAlpha = 1;
}

//real map squares have textures, so the drawing is a bit more complex
function drawMapSquare(ex, why, tileType) {
	//if it's a number, it'll be an exit block
	var exitBlock = String(tileType).match(/^\d/);
	if (exitBlock) {
		
	} else if (tileType != " ") {
		//all regular tiles
		switch(tileType) {
			case "A":
                ctx.fillStyle = color_wall;
                drawPoly(ex, why, Math.ceil(tile_half / Math.sin(Math.PI / 3)), 6, Math.PI / 6);
				break;
			case "a":
                ctx.fillStyle = color_floor;
                drawPoly(ex, why, Math.ceil(tile_half / Math.sin(Math.PI / 3)), 6, Math.PI / 6);
				break;
			default:
                ctx.fillStyle = color_error;
                drawPoly(ex, why, Math.ceil(tile_half / Math.sin(Math.PI / 3)), 6, Math.PI / 6);
				break;
		}
		
	}
}