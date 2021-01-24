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
		var belowStorage = [];
		var aboveStorage = [];
		world_objects[world_objects.length - 1].strips.forEach(t => {
			if (t.playerIsOnTop()) {
				belowStorage.push(t);
			} else {
				aboveStorage.push(t);
			}
		});
		//order the objects of the closet tunnel for drawing
		belowStorage = orderObjects(belowStorage);
		aboveStorage = orderObjects(aboveStorage);
		belowStorage.forEach(o => {
			o.beDrawn();
		});
		player.beDrawn();
		aboveStorage.forEach(o => {
			o.beDrawn();
		});

		//crosshair
		if (editor_active) {
			drawCrosshair();
		}

		//drawing pressed keys
		ctx.fillStyle = color_keyUp;
		ctx.fillRect(canvas.width * 0.05, canvas.height * 0.95, 30, 30);
		ctx.fillRect(canvas.width * 0.1, canvas.height * 0.95, 30, 30);
		ctx.fillRect(canvas.width * 0.1, canvas.height * 0.9, 30, 30);
		ctx.fillRect(canvas.width * 0.15, canvas.height * 0.95, 30, 30);

		ctx.fillStyle = color_keyPress;
		if (controls_object.ax < 0) {
			ctx.fillRect(canvas.width * 0.05, canvas.height * 0.95, 30, 30);
		}
		if (controls_object.ax > 0) {
			ctx.fillRect(canvas.width * 0.15, canvas.height * 0.95, 30, 30);
		}

		if (controls_object.az > 0) {
			ctx.fillRect(canvas.width * 0.1, canvas.height * 0.9, 30, 30);
		}
		if (controls_object.az < 0) {
			ctx.fillRect(canvas.width * 0.1, canvas.height * 0.95, 30, 30);
		}
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
			loading_state = new State_Game();
		}
	}
}

class State_Map {
	constructor() {
		world_camera.x = 0;
		world_camera.y = 4000;
		world_camera.z = 0;
	}

	execute() {
		//draw background
		ctx.fillStyle = color_bg_map;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		
		//handling stars
		for (var c=0;c<world_stars.length;c++) {
			world_stars[c].beDrawn();
		}

		//draw world objects

	}
}

