//draws each individual square

/* 
  - empty space
A - wall
B -
C - ice
D - stony desert land

a - bluish ground
b - grass
c - snow
d - desert tile, wobbly middle
e - exit block
f - desert tile, no wobble

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
				case "C":
					drawColor = color_ice;
					break;
				case "c":
					drawColor = color_snow;
					break;
				case "d":
				case "D":
				case "f":
					drawColor = color_desert_shadow;
					break;
				case "g":
					drawColor = color_temple_shadow;
				case "i":
					drawColor = loading_map.bg;
					break;
				case "w":
					drawColor = color_water;
					break;
				default:
					drawColor = color_error;
					break;
			}
		}
		ctx.fillStyle = drawColor;
		//drawPoly(ex, why, Math.ceil(tile_half / 0.89), 6, Math.PI / 6);
		drawHexagonTile(ex, why);
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
		drawHexagonTile(ex, why);
		ctx.fillStyle = color_exit_center;
		drawPoly(ex, why, Math.ceil((tile_half * 0.6) / 0.866), 6, Math.PI / 6);

		//number
		ctx.fillStyle = color_text;
		ctx.fillText(tileType, ex, why + tile_size * 0.25);
		
	} else if (tileType != " ") {
		//all regular tiles
		switch(tileType) {
			case "A":
				ctx.fillStyle = color_wall_secondary;
				drawHexagonTile(ex, why);
				ctx.fillStyle = color_wall;
				drawPoly(ex, why, tile_half * 0.9, 6, Math.PI / 6);
				break;
			case "a":
				ctx.fillStyle = color_floor;
				drawHexagonTile(ex, why);
				break;
			case "b":
				//block
				ctx.fillStyle = color_grass;
				drawHexagonTile(ex, why);
				//coloring for ripple effect
				var value = screenToSpace(ex, why);
				ctx.globalAlpha = ((Math.sin(value[0] / 2) + Math.cos(value[1] / 2)) / 4) + 0.5;
				ctx.fillStyle = color_grass_highlight;
				drawHexagonTile(ex, why);
				ctx.globalAlpha = 1;
				break;
			case "C":
				//block
				ctx.fillStyle = color_ice;
				drawHexagonTile(ex, why);
				//highlights
				ctx.strokeStyle = color_ice_highlight;
				ctx.lineWidth = player.r;
				for (var an=0;an<3;an++) {
					var xOff = (tile_half * 1.02) * Math.sin(((Math.PI / 3) * an) + Math.PI / 6);
					var yOff = (tile_half * 1.02) * Math.cos(((Math.PI / 3) * an) + Math.PI / 6);
					ctx.beginPath();
					ctx.moveTo(ex + xOff, why + yOff);
					ctx.lineTo(ex - xOff, why - yOff);
					ctx.stroke();
				}
				break;
			case "c":
				ctx.fillStyle = color_snow;
				drawHexagonTile(ex, why);
				break;
			case "d":
				drawMapSquare(ex, why, "f");
				//smaller hexagon for wavy effect
				var value = screenToSpace(ex, why);
				ctx.fillStyle = color_desert_highlight;
				drawPoly(ex, why + ((Math.sin((game_timer / 25) + (value[0] / 2) + (value[1] / 2))) * 6), tile_half * 0.6, 6, Math.PI / 6);
				break;
			case "D":
				drawMapSquare(ex, why, "f");
				//rock 1
				ctx.fillStyle = color_rock;
				ctx.beginPath();
				ctx.moveTo(ex - (tile_half * 0.7), why);
				ctx.lineTo(ex - (tile_half * 0.4), why - (tile_half * 0.4));
				ctx.lineTo(ex + (tile_half * 0.1), why);
				ctx.lineTo(ex - (tile_half * 0.4), why + (tile_half * 0.1));
				ctx.lineTo(ex - (tile_half * 0.7), why);
				ctx.fill();

				//rock 2
				ctx.moveTo(ex, why + (tile_half * 0.25));
				ctx.lineTo(ex + (tile_half * 0.3), why + (tile_half * 0.1));
				ctx.lineTo(ex + (tile_half * 0.6), why + (tile_half * 0.25));
				ctx.lineTo(ex + (tile_half * 0.2), why + (tile_half * 0.3));
				ctx.lineTo(ex, why + (tile_half * 0.25));
				ctx.fill();
				break;
			case "e":
				ctx.fillStyle = color_exit_complete;
				drawHexagonTile(ex, why);
				ctx.fillStyle = color_player;
				drawPoly(ex, why, Math.ceil((tile_half * 0.6) / 0.866), 6, Math.PI / 6);
				break;
			case "f":
				ctx.fillStyle = color_desert;
				drawHexagonTile(ex, why);
				break;
			case "g":
				ctx.fillStyle = color_temple;
				drawHexagonTile(ex, why);

				//linies
				ctx.strokeStyle = color_temple_shadow;
				ctx.lineWidth = 2;
				ctx.beginPath();
				//horizontal
				ctx.moveTo(ex - tile_half, why - (tile_half * 0.386));
				ctx.lineTo(ex + tile_half, why - (tile_half * 0.386));
				ctx.moveTo(ex - tile_half, why + (tile_half * 0.45));
				ctx.lineTo(ex + tile_half, why + (tile_half * 0.45));

				//vertical
				ctx.moveTo(ex, why - (tile_size * 0.58));
				ctx.lineTo(ex, why - (tile_half * 0.386));
				ctx.moveTo(ex - (tile_half * 0.5), why + (tile_half * 0.386));
				ctx.lineTo(ex - (tile_half * 0.5), why - (tile_half * 0.386));
				ctx.stroke();
				break;
			case "w":
				ctx.fillStyle = color_water;
				drawHexagonTile(ex, why);
				break;
			case "i":
				break;
			default:
				ctx.fillStyle = color_error;
				drawHexagonTile(ex, why);
				break;
		}
		
	}
}