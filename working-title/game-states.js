
class State_Dance {
	constructor(danceData) {
		this.data = danceData;
		this.keysDown = [[], [], []];

		this.warmTime = 0;

		this.posTime = 0;
		this.posTimeMax = 10;
		this.posQueue;
		this.pos = [0, 0];

		this.eObstacleData = [];
		this.eAudioSBuffer = undefined;
		this.eAudioSRate = 0;
		this.eTimeView = [0, 1];
		this.eAPrecompute = [];
	}

	draw() {
		//bege
		ctx.fillStyle = color_bgDance;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		//draw keyboard
		this.drawKeyboard();

		//editor overlay, if that's required
		if (editor_active) {
			this.drawEditorOverlay();
		}
	}

	computeEAMagnitudes() {
		this.eAPrecompute = [];
		var chunkSizePx = canvas.width / editD_audioResolution;
		var chunkSizeSamps = Math.floor((this.eTimeView[1] - this.eTimeView[0]) * (chunkSizePx / canvas.width) * this.eAudioSRate);
		var max;
		var sampStart = (this.eTimeView[0] * this.eAudioSRate);

		for (var p=0; p<editD_audioResolution; p++) {
			max = 0;
			sampStart = (this.eTimeView[0] * this.eAudioSRate) + (p * chunkSizeSamps);
			max = Math.max(...this.eAudioSBuffer.slice(sampStart, sampStart + (p * chunkSizeSamps)));
			for (var s=sampStart; s<sampStart + (p * chunkSizeSamps); s+=6) {
				max = Math.max(max, this.eAudioSBuffer[s]);
			}
			//draw line at correct height based on max volume
			this.eAPrecompute.push(max);
		} 
	}

	drawEditorOverlay() {
		//top bar
		ctx.fillStyle = color_editor_bg;
		ctx.fillRect(0, 0, canvas.width, canvas.height * editD_topBarHeight);

		//draw audio volume at specified points
		if (this.eAudioSBuffer == undefined) {
			this.eAudioSBuffer = [];
			getDataFor(this.data.audio.src, `game_state.eAudioSRate`, `game_state.eAudioSBuffer`);
		}

		//only draw the data if there's actual data to draw
		if (this.eAudioSBuffer.length > 0) {
			if (this.eAPrecompute.length == 0) {
				this.computeEAMagnitudes();
			}
			ctx.fillStyle = color_editor_audio;
			var barW = canvas.width / editD_audioResolution;
			for (var p=0; p<editD_audioResolution; p++) {
				//draw line at correct height based on max volume
				ctx.fillRect(p * barW, canvas.height * editD_topBarHeight * (0.5 - 0.45 * this.eAPrecompute[p]), barW, canvas.height * editD_topBarHeight * this.eAPrecompute[p] * 0.9);
			} 
		}
	}

	drawKeyboard() {
		//all the keys are a constant distance + size, so size, startX, and startY, are all that's needed to draw all of them
		var keySize = ((1 - (dance_margin * 2)) / dance_layout[0].length) * canvas.width;
		//realKeySize is how its drawn, to give the keys some margin
		var realKeySize = keySize * 0.45;
		var startX = (canvas.width * 0.5) - (keySize * ((dance_layout[0].length * 0.5) - 0.5));
		var startY = (canvas.height * dance_boardHeight) - (keySize * ((dance_layout.length * 0.5) - 0.5));

		var nowX;
		var nowY;

		ctx.strokeStyle = color_keyboardOutline;
		ctx.fillStyle = color_keyboardFill;

		for (var y=0; y<dance_layout.length; y++) {
			for (var x=0; x<dance_layout[y].length; x++) {
				nowX = startX + (dance_vectors[0][0] * x * keySize) + (dance_vectors[1][0] * y * keySize);
				nowY = startY + (dance_vectors[0][1] * x * keySize) + (dance_vectors[1][1] * y * keySize);

				drawRoundedRectangle(nowX - realKeySize, nowY - realKeySize, realKeySize * 2, realKeySize * 2, realKeySize * 0.3);
				if (this.pos[0] == x && this.pos[1] == y) {
					ctx.fill();
				}
				ctx.stroke();
			}
		}
	}

	execute() {
		this.tick();
		this.draw();
	}

	tick() {
		if (this.warmTime < dance_warmupTime) {

			this.warmTime += 1;
			return;
		}
	}

	handleKeyPress(a) {
		//if it's a key, it could be part of the floor
		if (a.code.indexOf("Key") == 0) {
			var cd = a.code.slice(3);
			for (var y=0; y<dance_layout.length; y++) {
				if (dance_layout[y].indexOf(cd) != -1) {
					this.pos = [dance_layout[y].indexOf(cd), y];
					return;
				}
			}
		}

		if (a.code == "Space") {

		}
	}
}


class State_Loading {
	constructor() {
		this.time = 0;
	}

	execute() {
		ctx.fillStyle = color_bgMenu;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = color_text;
		ctx.font = `${canvas.height / 20}px Ubuntu`;
		ctx.textAlign = "center";
		ctx.fillText(`loading...`, canvas.width / 2, canvas.height / 2);
		//if the maps are loaded, transition into main

		if (Object.keys(maps).length > 0) {
			game_state = new State_Main(maps["startEasy"]);
		}
	}

	handleKeyPress(a) {

	}

	handleKeyNegate(a) {

	}

	handleMouseDown(a) {

	}

	handleMouseMove(a) {

	}

	handleMouseUp(a) {

	}
}



class State_Main {
	constructor(mapData) {
		this.map = mapData;

		this.eCursorPos = [cursor_x, cursor_y];



		game_map = mapData;
		player = new ((this.map.constructor.name == "Map_Climbing") ? Player_Climbing : Player_Walking)(player.x, player.y);
	}

	drawEditorOverlay() {
		//border around the edges
		ctx.beginPath();
		ctx.strokeStyle = color_editor_outline;
		ctx.lineWidth = canvas.width / 30;
		ctx.rect(0, 0, canvas.width, canvas.height);
		ctx.stroke();

		//sidebar
		ctx.fillStyle = color_editor_bg;
		ctx.fillRect(0, 0, canvas.width * editM_sBarW, canvas.height);

		ctx.fillStyle = color_text;
	}

	editMapFrom(x, y) {
		var square = game_map.screenToSpace(x, y, 1);
		square[0] = Math.floor(square[0]);
		square[1] = Math.floor(square[1]);
		if (square[0] < 0 || square[1] < 0) {
			game_map.changeDimensions(Math.min(square[0], 0), Math.min(square[1], 0));
			square[0] = Math.max(square[0], 0);
			square[1] = Math.max(square[1], 0);
		}

		if (square[1] >= game_map.lMid.length) {
			//don't bother if trying to place an empty square
			if (editor_placing == "0") {
				return;
			}
			game_map.changeDimensions(0, square[1] - (game_map.lMid.length - 1));
		}

		game_map.lMid[square[1]] = game_map.lMid[square[1]].padEnd(square[0], "0");
		game_map.lMid[square[1]] = game_map.lMid[square[1]].replaceAt(square[0], editor_placing);
	}

	execute() {
		ctx.fillStyle = "#FFF";
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		//tick everything
		this.map.tick();

		//player is ticked 4 times so that their speed can be reasonable but they don't clip through blocks.
		//basically, phys-step is precise but outcome is normal
		if (!editor_active) {
			for (var a=0; a<player_physRepeats; a++) {
				player.tick();
			}
		}

		if (editor_active) {
			camera.x += player.ax / 3;
			camera.y += player.ay / 3;


			if (cursor_down) {
				//figure out the distance between last cursor pos and current cursor pos
				var flingDist = Math.sqrt((this.eCursorPos[0] - cursor_x) ** 2 + (this.eCursorPos[1] - cursor_y) ** 2);
				//interpolate between the two for smooth editing
				for (var a=0; a<Math.ceil(flingDist); a++) {
					this.editMapFrom(linterp(cursor_x, this.eCursorPos[0], a / Math.ceil(flingDist)), linterp(cursor_y, this.eCursorPos[1], a / Math.ceil(flingDist)));
				}
			}

			this.eCursorPos = [cursor_x, cursor_y];
		} else {
			camera.xGoal = player.x + game_map.x;
			camera.yGoal = player.y + game_map.y;
			camera.tick();
		}

		//drawing everything

		//editor overlays
		if (editor_active) {
			this.drawEditorOverlay();
		}

		this.map.beDrawn();

		ctx.fillStyle = "#0F0";
		drawCircle(...this.map.spaceToScreen(...this.map.screenToSpace(cursor_x, cursor_y, 1), 1), 4);
		ctx.fill();
	}

	handleKeyPress(a) {
		if (editor_active) {
			if (a.code.indexOf("Digit") == 0) {
				editor_placing = a.code.slice(5);
			}
		}

		switch (a.code) {
			case "ArrowLeft":
				player.ax = -1;
				break;
			case "ArrowUp":
				player.ay = 1;
				player.handleSpace();
				break;
			case "ArrowRight":
				player.ax = 1;
				break;
			case "ArrowDown":
				player.ay = -1;
				break;
		}
	}

	handleKeyNegate(a) {
		switch (a.code) {
			case "ArrowLeft":
				player.ax = Math.max(0, player.ax);
				break;
			case "ArrowUp":
				player.ay = Math.min(0, player.ay);
				break;
			case "ArrowRight":
				player.ax = Math.min(0, player.ax);
				break;
			case "ArrowDown":
				player.ay = Math.max(0, player.ay);
				break;
		}
	}

	handleMouseDown(a) {

	}

	handleMouseMove(a) {

	}

	handleMouseUp(a) {

	}
}