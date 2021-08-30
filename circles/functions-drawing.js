function drawScanLine(entityX, entityY, reqYDist, reqXDist, yCutoff) {
	//first get distance from center screen
	var xDist = (entityX - camera.x);
	var yDist = (entityY - camera.y);

	//only mark it if it's off screen
	if (Math.abs(xDist) > reqXDist || Math.abs(yDist) > reqYDist) {
		//normalize distance
		var dist = Math.sqrt(xDist * xDist + yDist * yDist);
		xDist /= dist;
		yDist /= dist;

		//figure out true length
		if (Math.abs(yDist) > yCutoff) {
			//normalize to y and then multiply 
			xDist /= Math.abs(yDist);
			yDist = Math.sign(yDist);

			xDist *= canvas.height / 2 * scan_windowScale[1];
			yDist *= canvas.height / 2 * scan_windowScale[1];
		} else {
			// //do the same thing but for x
			yDist /= Math.abs(xDist)
			xDist = Math.sign(xDist);

			xDist *= canvas.width / 2 * scan_windowScale[0];
			yDist *= canvas.width / 2 * scan_windowScale[0];
		}

		//draw actual dot
		ctx.beginPath();
		drawCircle(canvas.width / 2 + xDist, canvas.height / 2 + yDist, 5);
		ctx.fill();
	}
}

function drawScanResults() {
	if (scan_time <= 0) {
		return;
	}
	scan_time -= 1;
	ctx.fillStyle = "#000";
	ctx.globalAlpha = 1 - Math.pow(1 - (scan_time / scan_time_static), 12);

	//required distance away for the object to be scanned
	var reqYDist = canvas.height * scan_windowScale[1] / camera.scale / 2;
	var reqXDist = canvas.width * scan_windowScale[0] / camera.scale / 2;
	//figure out y-cutoff for when lines will intersect the side instead of the top
	var yCutoff = (canvas.height * scan_windowScale[1]) / Math.sqrt(Math.pow(canvas.width * scan_windowScale[0], 2) + Math.pow(canvas.height * scan_windowScale[1], 2));
	
	//loop through visible orbs
	ctx.fillStyle = color_orbs[0];
	game_staticObjects.forEach(s => {
		//only continue if it's visible
		if (s.layersCurrent > 0) {
			//I pass in arguments so I don't have to redefine these semi-constants for every single object
			drawScanLine(s.x, s.y, reqYDist, reqXDist, yCutoff);
		}
	});

	//monsters
	ctx.fillStyle = color_monster_eye;
	game_dynamicObjects.forEach(d => {
		if (d != player) {
			drawScanLine(d.x, d.y, reqYDist, reqXDist, yCutoff);
		}
	});

	ctx.globalAlpha = 1;
}

function drawTutorialText() {
	//finish functions
	if (player.ax != 0 || player.ay != 0) {
		tutorial.hasDone[0] = true;
	}
	if (scan_time > 0) {
		tutorial.hasDone[1] = true;
	}

	//first determine what needs to be drawn
	if (!tutorial.hasDone[0]) {
		if (game_time > 600) {
			text_buffer = tutorial.texts[0];
			text_time = text_time_static;
		}
	} else if (!tutorial.hasDone[1]) {
		//get minimum distance to orb, if it's large enough do the scan prompt
		if (game_time % 10 == 0) {

		}
	}


	if (text_time > 0) {
		//draw text
		ctx.font = `${canvas.height / 30}px Ubuntu`;
		ctx.textAlign = "center";
		ctx.fillStyle = color_text;
		//opacity is based on time
		ctx.globalAlpha = 1 - Math.pow((text_time_static - text_time) / text_time_static, 16);
		ctx.fillText(text_buffer, canvas.width / 2, canvas.height * 0.96);
		ctx.globalAlpha = 1;


		//increment time
		text_time -= 1;
	}
}