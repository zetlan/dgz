class State_Game {
	constructor() {

	}

	execute() {
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

		//calculating which objects should be active

		//every few ticks reorder objects
		if (world_time % 25 == 1) {
			world_objects = orderObjects(world_objects);
		}

		world_objects.forEach(a => {
			a.tick();
		});

		for (var a=0; a<world_objects.length - 1; a++) {
			world_objects[a].beDrawn();
		}

		//sorting player in with the closest tunnel to be drawn
		var stripStorage = orderObjects(world_objects[world_objects.length - 1].strips);

		//if the player is in the middle of the strips (on top of some but not all) do the special
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

		//crosshair
		if (editor_active) {
			drawCrosshair();
		}

		//drawing pressed keys
		drawKeys();
	}
}

class State_Loading {
	constructor() {
		this.time = 0;
	}

	execute() {
		if (this.time == 0) {
			//drawing background
			ctx.fillStyle = color_bg;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
		}
		this.time += 1;
		drawCircle(color_stars, randomSeeded(0, canvas.width), randomSeeded(0, canvas.height), randomSeeded(3, 7));
		
		if (this.time > 50) {
			loading_state = new State_Map();
		}
	}
}

class State_Map {
	constructor() {
		world_camera.x = 0;
		world_camera.y = 250000;
		world_camera.z = 0;

		world_camera.phi = -0.5 * Math.PI;
		world_camera.theta = -0.5 * Math.PI;
	}

	execute() {
		//draw background
		ctx.fillStyle = color_map_bg;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		
		//handling stars
		for (var c=0;c<world_stars.length;c++) {
			world_stars[c].beDrawn();
		}

		//draw world objects
		ctx.lineWidth = 2;
		ctx.strokeStyle = color_map_writing;
		world_objects.forEach(w => {
			w.beDrawnOnMap();
		});

	}
}

