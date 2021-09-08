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
		drawCircle(canvas.width / 2 + xDist, canvas.height / 2 + yDist, canvas.height / 160);
		ctx.fill();
	}
}

function drawScanResults() {
	var isInverted = game_map.playerObj.constructor.name == "MonsterControllable";
	if (scan_time <= 0) {
		return;
	}
	scan_time -= 1;
	ctx.fillStyle = "#000";
	ctx.globalAlpha = droperp(1, 0, 1 - (scan_time / scan_time_static));

	//required distance away for the object to be scanned
	var reqYDist = canvas.height * scan_windowScale[1] / camera.scale / 2;
	var reqXDist = canvas.width * scan_windowScale[0] / camera.scale / 2;
	//figure out y-cutoff for when lines will intersect the side instead of the top
	var yCutoff = (canvas.height * scan_windowScale[1]) / Math.sqrt(Math.pow(canvas.width * scan_windowScale[0], 2) + Math.pow(canvas.height * scan_windowScale[1], 2));
	
	//loop through visible orbs
	ctx.fillStyle = color_orbs[0];
	game_map.statics.forEach(s => {
		//only continue if it's visible
		if (s.layersCurrent > 0) {
			//I pass in arguments so I don't have to redefine these semi-constants for every single object
			drawScanLine(s.x, s.y, reqYDist, reqXDist, yCutoff);
		}
	});

	//monsters
	ctx.fillStyle = isInverted ? color_energy : color_monster_eye;
	game_map.dynamics.forEach(d => {
		if (!isInverted || d.energy > 0) {
			drawScanLine(d.x, d.y, reqYDist, reqXDist, yCutoff);
		}
	});

	ctx.globalAlpha = 1;
}

function drawStar(x, y, r, sides) {
	ctx.beginPath();
	ctx.moveTo(x + r, y);
	var angle = ((Math.PI * 2) / sides);
	for (var a=0; a<sides+1; a++) {
		ctx.lineTo(x + r * (0.75 + 0.25 * (a % 2 == 0)) * Math.cos(angle * a), y + r * (0.75 + 0.25 * (a % 2 == 0)) * Math.sin(angle * a));
	}
}

function drawTutorialText() {
	determineTutorialText();

	if (text_time > 0) {
		//draw text
		ctx.font = `${canvas.height * text_size}px Ubuntu`;
		ctx.textAlign = "center";
		ctx.fillStyle = color_text;
		//opacity is based on time
		ctx.globalAlpha = droperp(0, 1, text_time / text_time_static);
		ctx.fillText(text_buffer, canvas.width / 2, canvas.height * 0.96);
		ctx.globalAlpha = 1;


		//increment time
		text_time -= 1;
	}
}



function setCanvasPreferences() {
	ctx.lineWidth = canvas.height / 120;
	ctx.lineCap = "butt";
	ctx.textBaseline = "middle";

	camera_scale_game = canvas.height / 240;
	camera_scale_menu = canvas.height / 4.8;
	camera.scale = (game_mode == 0) ? camera_scale_menu : camera_scale_game;
}