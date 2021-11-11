
function drawMapSquare(ex, why, xSize, ySize, type) {
	/*
	1 - full square
	2 - triangle /|
	3 - triangle |\
	4 - triangle |/
	5 - triangle \|
	*/
	ctx.fillStyle = color_terrain;
	switch(type) {
		//1 is full 
		case 1:
			ctx.fillRect(ex, why, xSize, ySize);
			break;
		
		case 2:
			ctx.beginPath();
			ctx.moveTo(ex, why);
			ctx.lineTo()
			break;
		case 3:
			break;
		case 4:
			break;
		case 5:
			break;
		default:
			break;
	}
}