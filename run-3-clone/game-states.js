class State_Game {
	constructor() {
		this.text = ``;
		this.time = 0;

		this.nearObjs = [];
		this.farObjs = [];

		this.orderWorld();
	}

	execute() {
		logTime("total");
		//handling entities
		world_camera.tick();
		player.tick();

		//if the player isn't in a tunnel, try to get them in one
		if (player.parent == undefined) {
			this.orderWorld();

			//try the player in the closest few tunnels
			for (var v=this.nearObjs.length-1; v>Math.max(-1, this.nearObjs.length-6); v--) {
				if (this.nearObjs[v].playerIsInBounds()) {
					player.parent = this.nearObjs[v];
					v = -1;
				}
			}
			//if they're still undefined, kill them
			if (player.parent == undefined) {
				player.parentPrev.reset();
				player.parent = player.parentPrev;
			} else {
				//display text
				this.text = player.parent.id;
				this.time = render_tunnelTextTime;
			}
		} else {
			//if the player's left their parent tunnel, change their parent
			if (!player.parent.playerIsInBounds()) {
				player.parentPrev = player.parent;
				player.parent = undefined;
			} else if (!player.parent.playerIsInTunnel()) {
				
				//if the player is in the void, try to change parent without reordering objects
				//try the player in the closest few tunnels
				for (var v=this.nearObjs.length-1; v>Math.max(-1, this.nearObjs.length-10); v--) {
					if (this.nearObjs[v].playerIsInTunnel()) {
						player.parentPrev = player.parent;
						player.parent = this.nearObjs[v];
						v = -1;

						//reorder objects anyways if found a new tunnel
						this.orderWorld();

						//display text
						this.text = player.parent.id;
						this.time = render_tunnelTextTime;
					}
				}
			}
		}

		
		//just tick the closest few tunnels
		for (var v=this.nearObjs.length-1; v>Math.max(-1, this.nearObjs.length-20); v--) {
			this.nearObjs[v].tick();
		}
		

		//drawing background
		ctx.fillStyle = color_bg;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		
		//draw stars
		for (var c=0;c<world_stars.length;c++) {
			world_stars[c].beDrawn();
		}

		//drawing all tunnels
		this.farObjs.forEach(f => {
			f.beDrawn();
		});
		this.nearObjs.forEach(f => {
			if (f != player.parent) {
				f.beDrawn();
			}
		})

		if (player.parent == undefined) {
			player.beDrawn();
		} else {
			//sorting player in with the parent tunnel to be drawn
			var stripStorage = orderObjects(player.parent.strips, 4);
			
			//if the player is in the middle of the strips (on top of some but not all) do the special
			if (stripStorage[0].playerIsOnTop() != stripStorage[stripStorage.length-1].playerIsOnTop()) {
				var drawPlayer = true;
				stripStorage.forEach(t => {
					if (drawPlayer && t.playerIsOnTop()) {
						t.beDrawn();
					} else if (drawPlayer) {
						drawPlayer = false;
						player.beDrawn();
						t.beDrawn();
					} else {
						t.beDrawn();
					}
				});
				if (drawPlayer) {
					player.beDrawn();
				}
			} else {
				//case where player is below all
				if (!stripStorage[0].playerIsOnTop()) {
					player.beDrawn();
					stripStorage.forEach(t => {
						t.beDrawn();
					});
				} else {
					//case where player is above all
					stripStorage.forEach(t => {
						t.beDrawn();
					});
					player.beDrawn();
				}
			} 
			
		}

		//crosshair
		if (editor_active) {
			drawCrosshair();
		}


		//drawing pressed keys
		drawKeys();

		//drawing new tunnel text
		if (this.time > 0) {
			ctx.fillStyle = color_text_bright;
			ctx.font = `${canvas.height / 22}px Century Gothic`;
			ctx.fillText(this.text, canvas.width * 0.5, canvas.height * 0.5);
			this.time -= 1;
		}
		logTimeEnd("total", "avg. frame time");
	}

	orderWorld() {
		//ordering all the objects
		world_objects.forEach(u => {
			u.getCameraDist();
		});

		//if the camera distance is more than 5 digits (100,000), just put it in a seperate bin
		this.farObjs = [];
		this.nearObjs = [];
		for (var v=0; v<world_objects.length; v++) {
			if (world_objects[v].cameraDist > 99999) {
				this.farObjs.push(world_objects[v]);
			} else {
				this.nearObjs.push(world_objects[v]);
			}
		}

		this.nearObjs = orderObjects(this.nearObjs, 5);
	}
}

class State_Loading {
	constructor() {
		this.time = 10;
	}

	execute() {
		if (this.time == 10) {
			//drawing background
			ctx.fillStyle = color_bg;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
		}
		
		for (var s=0; s<12; s++) {
			this.time += 1;
			var xAdd = (this.time * (canvas.height / 480) * Math.cos((Math.PI * 0.666 * this.time) + Math.pow(randomSeeded(-0.8, 0.8), 3)));
			var yAdd = (this.time * (canvas.height / 480) * Math.sin((Math.PI * 0.666 * this.time) + Math.pow(randomSeeded(-0.8, 0.8), 3)));
			drawCircle(color_stars, (canvas.width * 0.5) + xAdd, (canvas.height * 0.5) + yAdd, randomSeeded(3, 7));

			//loading tunnels at certain times
			//TODO: refactor this, it's difficult to read
			switch (this.time) {
				case 11:
					placeTunnelSet(levelData_mainTunnel);
					console.log(`placed main tunnel`);
					break;
				case 20:
					placeTunnelSet(levelData_boxStorage);
					console.log(`placed box storage`);
					break; 
				case 40:
					placeTunnelSet(levelData_winterGames);
					console.log(`placed winter games`);
					break;
				case 60:
					placeTunnelSet(levelData_lowPower);
					console.log(`placed low power`);
					break;
				case 80:
					placeTunnelSet(levelData_A);
					console.log(`placed A`);
					break;
				case 100:
					placeTunnelSet(levelData_B);
					console.log(`placed B`);
					break;
				case 120:
					placeTunnelSet(levelData_D);
					console.log(`placed D`);
					break;
				case 140:
					placeTunnelSet(levelData_G);
					console.log(`placed G`);
					break;
				case 160:
					placeTunnelSet(levelData_L);
					console.log(`placed L`);
					break;
				case 180:
					placeTunnelSet(levelData_T);
					console.log(`placed T`);
					break;
				case 200:
					placeTunnelSet(levelData_U);
					console.log(`placed U`);
					break;
				case 220:
					placeTunnelSet(levelData_W);
					console.log(`placed W`);
					break;
				default:
					break;
			}
		}
		if (this.time > 550) {
			loading_state = new State_Map();
		}
	}
}

class State_Map {
	constructor() {
		world_camera.x = 0;
		world_camera.y = map_cameraHeight;
		world_camera.z = 0;

		world_camera.phi = -0.5 * Math.PI;
		world_camera.theta = -0.5 * Math.PI;
		world_camera.rot = 0;

		//targets
		world_camera.targetRot = world_camera.rot;
		world_camera.targetTheta = world_camera.theta;

		this.levelSelected = undefined;
		this.cursorPos = [-100, -100];

		//clear player's previous levels
		player.parent = undefined;
		player.parentPrev = undefined;
		player.x = 1e10;
		player.y = 1e10;
		player.z = 1e10;
	}

	execute() {
		world_camera.tick();
		//draw background
		ctx.fillStyle = color_map_bg;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		
		//handling stars
		for (var c=0;c<world_stars.length;c++) {
			world_stars[c].beDrawn();
		}

		//draw world objects
		ctx.lineWidth = canvas.height / 480;
		ctx.strokeStyle = color_map_writing;
		world_objects.forEach(w => {
			w.beDrawnOnMap();
		});

		var fontSize = Math.floor(canvas.height / 24);
		ctx.font = `${fontSize}px Century Gothic`;
		ctx.textAlign = "center";

		//draw selected object + extra UI
		if (editor_active) {
			if (editor_selected != undefined) {
				//drawing cursor
				drawCircle(color_editor_cursor, cursor_x, cursor_y, 4);

				//drawing theta circle + knob
				ctx.beginPath();
				ctx.strokeStyle = color_editor_cursor;
				ctx.ellipse(editor_selected.map_startCoords[0], editor_selected.map_startCoords[1], editor_thetaCircleRadius, editor_thetaCircleRadius, 0, 0, Math.PI * 2);
				ctx.stroke();
				ctx.beginPath();
				ctx.ellipse(editor_selected.map_startCoords[0] + (editor_thetaCircleRadius * Math.cos(editor_selected.theta)), editor_selected.map_startCoords[1] - (editor_thetaCircleRadius * Math.sin(editor_selected.theta)), editor_thetaKnobRadius, editor_thetaKnobRadius, 0, 0, Math.PI * 2);
				ctx.fill();
				
				ctx.fillStyle = color_text;
				ctx.fillText(`selected-id: ${editor_selected.id}`, canvas.width * 0.5, canvas.height * 0.1);
				ctx.fillText(`θ: ${editor_selected.theta}`, canvas.width * 0.5, (canvas.height * 0.1) + fontSize);
			} else {
				ctx.fillStyle = color_text;
				ctx.fillText(`selected-id: undefined`, canvas.width * 0.5, canvas.height * 0.1);
				ctx.fillText(`θ: undefined`, canvas.width * 0.5, (canvas.height * 0.1) + fontSize);
			}
			


			//border around screen
			ctx.strokeStyle = color_editor_border;
			ctx.lineWidth = canvas.height / 20;
			ctx.globalAlpha = 0.5;
			ctx.beginPath();
			ctx.rect(0, 0, canvas.width, canvas.height);
			ctx.stroke();
			ctx.globalAlpha = 1;
		} else {
			//drawing the name of the level the user hovers over
			drawCircle(color_editor_cursor, this.cursorPos[0], this.cursorPos[1], 4);
			if (this.levelSelected != undefined) {
				ctx.fillStyle = color_text;
				ctx.fillText(this.levelSelected.id, canvas.width * 0.5, canvas.height * 0.1);
			}
			
		}

	}
}

