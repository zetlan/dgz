
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
		var chunkSizePx = canvas.width / dEdit_audioResolution;
		var chunkSizeSamps = Math.floor((this.eTimeView[1] - this.eTimeView[0]) * (chunkSizePx / canvas.width) * this.eAudioSRate);
		var max;
		var sampStart = (this.eTimeView[0] * this.eAudioSRate);

		for (var p=0; p<dEdit_audioResolution; p++) {
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
		ctx.fillRect(0, 0, canvas.width, canvas.height * dEdit_topBarHeight);

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
			var barW = canvas.width / dEdit_audioResolution;
			for (var p=0; p<dEdit_audioResolution; p++) {
				//draw line at correct height based on max volume
				ctx.fillRect(p * barW, canvas.height * dEdit_topBarHeight * (0.5 - 0.45 * this.eAPrecompute[p]), barW, canvas.height * dEdit_topBarHeight * this.eAPrecompute[p] * 0.9);
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




class State_Map {
	constructor(mapData, playerPosition) {
		this.connections = [];
		this.layers = {
			"bFar": [],
			"bDeco": [],
			"mid": [],
			"fDeco": [],
			"fFar": [],
		};
		this.palette = 0;
	}

	spaceToScreen(x, y) {

	}

	screenToSpace(x, y) {
		
	}
}


class State_Map_Climbing extends State_Map {

}

class State_Map_Walking extends State_Map {

}