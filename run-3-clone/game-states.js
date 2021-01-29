class State_Game {
	constructor() {

	}

	execute() {
		var perfTime = [performance.now(), 0];
		//drawing background
		ctx.fillStyle = color_bg;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		//handling entities
		world_camera.tick();
		player.tick();

		//handling stars
		for (var c=0;c<world_stars.length;c++) {
			world_stars[c].beDrawn();
		}

		//if the player isn't in a tunnel, try to get them in one
		if (player.parent == undefined) {
			//ordering all the objects
			world_objects.forEach(u => {
				u.getCameraDist();
			});
			world_objects = orderObjects(world_objects, 8);

			//try the player in the closest few tunnels
			for (var v=world_objects.length-1; v>Math.max(-1, world_objects.length-6); v--) {
				if (world_objects[v].playerIsInBounds()) {
					player.parent = world_objects[v];
					v = -1;
				}
			}
			//if they're still undefined, kill them
			if (player.parent == undefined) {
				player.parentPrev.reset();
				player.parent = player.parentPrev;
			}
		} else {
			//if the player's left their parent tunnel, change their parent
			if (!player.parent.playerIsInBounds()) {
				player.parentPrev = player.parent;
				player.parent = undefined;
			} else if (!player.parent.playerIsInTunnel()) {
				//if the player is in the void, try to change parent without reordering objects

				//try the player in the closest few tunnels
				for (var v=world_objects.length-1; v>Math.max(-1, world_objects.length-6); v--) {
					if (world_objects[v].playerIsInTunnel()) {
						player.parentPrev = player.parent;
						player.parent = world_objects[v];
						v = -1;

						//reorder objects anyways if found a new tunnel
						world_objects.forEach(u => {
							u.getCameraDist();
						});
						world_objects = orderObjects(world_objects, 8);
					}
				}
			}
		}

		//just tick the closest few tunnels
		for (var v=world_objects.length-1; v>Math.max(-1, world_objects.length-9); v--) {
			world_objects[v].tick();
		}

		//drawing all tunnels
		for (var a=0; a<world_objects.length; a++) {
			if (world_objects[a] != player.parent) {
				world_objects[a].beDrawn();
			}
		}

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

		perfTime[1] = performance.now();
		var totalTime = perfTime[1] - perfTime[0];
		render_times.push(totalTime);
		if (render_times.length > 150) {
			var avgTime = 0;
			render_times.forEach(t => {
				avgTime += t;
			});
			avgTime /= render_times.length;
			//console.log(`avg frame time: ${avgTime} ms`);
			render_times = [];
		}
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

		this.levelSelected = undefined;
		this.cursorPos = [-100, -100];
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
				ctx.ellipse(cursor_x, cursor_y, editor_thetaCircleRadius, editor_thetaCircleRadius, 0, 0, Math.PI * 2);
				ctx.stroke();
				ctx.beginPath();
				ctx.ellipse(cursor_x + (editor_thetaCircleRadius * Math.cos(editor_selected.theta)), cursor_y - (editor_thetaCircleRadius * Math.sin(editor_selected.theta)), editor_thetaKnobRadius, editor_thetaKnobRadius, 0, 0, Math.PI * 2);
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

