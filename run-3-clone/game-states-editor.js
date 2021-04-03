class State_Edit {
	constructor() {
		
		player = new Runner(player.x, player.y, player.z);
		this.tunnel = new Tunnel(0.1, {h: 0, s: 0, v: 0.5}, [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]], `Custom Tunnel 1`, 40, 1, [], 4, [], [], 4, 70, 0, 0);
		
		world_camera.targetX = 0.1;
		world_camera.targetY = 5;
		world_camera.targetZ = 0;

		world_camera.targetTheta = (Math.PI * 2) - this.tunnel.theta;
		world_camera.targetRot = 0;
		world_camera.phi = 0;
		world_camera.rot = 0;
		//so they can see plexiglass tiles
		player = new Pastafarian(player.x, player.y, player.z);
		player.parent = this.tunnel;
		player.parentPrev = this.tunnel;
		render_maxColorDistance *= editor_colorMultiplier;


		this.frontHeld = false;
		this.sideHeld = false;
		this.topDarkButton = undefined;
	}

	execute() {
		world_camera.tick();
		this.convertPlayerToCamera();

		//little dot in the center of the screen
		drawCircle(color_editor_cursor, canvas.width * 0.5, canvas.height * 0.5, 2);

		//top bar
		ctx.fillStyle = color_editor_bg;
		ctx.fillRect(0, 0, canvas.width, canvas.height * editor_topBarHeight);

		//top buttons
		ctx.font = `${Math.floor(canvas.height * 0.04)}px Comfortaa`;
		ctx.textAlign = `center`;
		ctx.fillStyle = color_grey_light;
		ctx.strokeStyle = color_grey_dark;
		ctx.lineWidth = canvas.height / 96;
		for (var a=1; a<=editor_buttons.length; a++) {
			var width = canvas.width * 1 / (editor_buttons.length * 1.5);
			if (this.topDarkButton == a) {
				ctx.fillStyle = color_grey_dark;
			}
			drawRoundedRectangle((canvas.width * (a / (editor_buttons.length + 1))) - (width * 0.5), canvas.height * 0.03, width, canvas.height * 0.06, canvas.height / 40);

			ctx.fillStyle = color_text;
			ctx.fillText(editor_buttons[a-1][0], (canvas.width * (a / (editor_buttons.length + 1))), canvas.height * 0.075);
			ctx.fillStyle = color_grey_light;
		}
	}

	convertPlayerToCamera() {
		//update player properties
		player.parent = this.tunnel;
		player.parentPrev = player.parent;

		player.x = world_camera.x;
		player.y = world_camera.y;
		player.z = world_camera.z;
		player.onGround = 1;

		//translate player up into camera movement
		if (player.dy == 0) {
			this.frontHeld = false;
		}
		if (this.frontHeld == false) {
			if (player.dy != 0) {
				this.frontHeld = true;
				var modifyDir;
				if (player.dy > 0) {
					modifyDir = polToCart(world_camera.targetTheta, 0, editor_cameraJumpDistance);
				} else {
					modifyDir = polToCart(world_camera.targetTheta, 0, -editor_cameraJumpDistance);
				}
				
				world_camera.targetX += modifyDir[0];
				world_camera.targetY += modifyDir[1];
				world_camera.targetZ += modifyDir[2];
			}
		}

		//translate player left / right into camera movement
		if (player.ax == 0) {
			this.sideHeld = false;
		}
		if (player.ax != 0 && this.sideHeld == false) {
			this.sideHeld = true;
			world_camera.targetTheta = (world_camera.targetTheta + Math.PI) % (Math.PI * 2);
		}
	}

	handleMouseMove(a) {
		//first determine screen coordinates
		var canvasArea = canvas.getBoundingClientRect();
		cursor_x = Math.round(a.clientX - canvasArea.left);
		cursor_y = Math.round(a.clientY - canvasArea.top);

		//if the cursor is up top
		if (cursor_y < canvas.height * 0.15) {
			return 31;
		}
	}

	handleMouseDown(a) {
		var canvasArea = canvas.getBoundingClientRect();
		cursor_x = Math.round(a.clientX - canvasArea.left);
		cursor_y = Math.round(a.clientY - canvasArea.top);

		//changing state
		if (cursor_y < canvas.height * 0.12) {
			for (var a=0; a<editor_buttons.length; a++) {
				var width = (canvas.width * 1 / (editor_buttons.length * 2)) / 2;
				var height = canvas.height * 0.03;

				if (cursor_x > (canvas.width * ((a+1) / (editor_buttons.length + 1))) - width && cursor_x < (canvas.width * ((a+1) / (editor_buttons.length + 1))) + width &&
				cursor_y > (canvas.height * 0.06) - height && cursor_y < (canvas.height * 0.06) + height) {
					if (loading_state.constructor.name != eval(editor_buttons[a][1]).constructor.name) {
						loading_state = eval(editor_buttons[a][1]);
						this.transferPropertiesToState(loading_state);
					}
					return 31;
				}
			}
			return 31;
		}
	}

	handleEscape() {
		render_maxColorDistance /= editor_colorMultiplier;
		player = new Runner(player.x, player.y, player.z);
		loading_state = new State_Menu();
	}

	transferPropertiesToState(newState) {
		newState.tunnel = this.tunnel;
		player.parent = this.tunnel;
		player.parentPrev = this.tunnel;
		render_maxColorDistance /= editor_colorMultiplier;
	}

	handleKeyPress(a) {
		
	}

	handleKeyNegate(a) {

	}
}


class State_Edit_Tiles extends State_Edit {
	constructor() {
		super();

		this.tileSelected = 0;
		this.animTileSelected = 0;

		this.targetTile = [3, 15];
		var tileCoords = this.tunnel.worldPositionOfTile(this.targetTile[0], this.targetTile[1] + 1);
		this.selectedTileExtra = new Tile_Plexiglass(tileCoords[0], tileCoords[1], tileCoords[2], this.tunnel.tileSize, this.tunnel.strips[this.targetTile[0]].normal, this.tunnel, this.targetTile, this.tunnel.color, 0.5);
		this.selectedTileExtra.playerDist = 50;
		this.selectedTileExtra.cameraDist = 50;
		this.topDarkButton = 1;
	}

	execute() {
		drawSky(color_bg);
		//have the editor active for display purposes, but not for player control
		editor_active = true;
		this.tunnel.tick();
		this.tunnel.beDrawn();
		this.selectedTileExtra.beDrawn();
		editor_active = false;

		//update the tile selected
		this.animTileSelected = (this.animTileSelected * (render_animSteps - 1) + this.tileSelected) / render_animSteps;

		//side bar
		ctx.fillStyle = color_editor_bg;
		ctx.fillRect(0, 0, canvas.width * 0.06, canvas.height);

		//selection box
		ctx.globalAlpha = 0.3;
		ctx.fillStyle = color_grey_light;
		ctx.strokeStyle = color_menuSelectionOutline;
		ctx.lineWidth = canvas.height / 200;
		drawRoundedRectangle((canvas.width * 0.015) - (canvas.width * editor_tileSize * 0.3), ((canvas.height / 15) * (this.animTileSelected + 2)) - (canvas.width * editor_tileSize * 0.3), 
							canvas.width * editor_tileSize * 1.6, canvas.width * editor_tileSize * 1.6, canvas.height / 100);
		ctx.globalAlpha = 1;
		ctx.lineWidth = 2;

		//tile listing
		for (var a=0; a<13; a++) {
			drawTile2d(canvas.width * 0.015, (canvas.height / 15) * (a + 2), canvas.width * editor_tileSize, a);
		}

		super.execute();
	}

	handleMouseMove(a) {
		//if cursor is up top
		if (super.handleMouseMove(a) == 31) {
			return;
		}

		//if the cursor is over the menu to the left
		if (cursor_x < canvas.width * 0.05) {
			return;
		}

		//if still here...

		//modify selected tile
		var xOffset = cursor_x - (canvas.width * 0.5);
		var yOffset = cursor_y - (canvas.height * 0.5);
		//outRate is the rate at which the ray travels out from the center. Used to calculate at what z position it will hit the tunnel
		var outRate = Math.sqrt(((xOffset * xOffset) + (yOffset * yOffset))) / world_camera.scale;
		//rough estimate of intersection point
		var intersectZ = this.tunnel.r / outRate;
		var cameraZ = spaceToRelativeRotless([world_camera.x, world_camera.y, world_camera.z], [this.tunnel.x, this.tunnel.y, this.tunnel.z], [(Math.PI * 2) - this.tunnel.theta, 0])[2];

		if (intersectZ < editor_maxEditDistance) {
			//update the tile self points to
			var angle = (Math.atan2(yOffset, -xOffset) + Math.PI) / (Math.PI * 2);
			var targetStrip = Math.floor(((angle * (this.tunnel.sides * this.tunnel.tilesPerSide)) + (this.tunnel.sides * this.tunnel.tilesPerSide) + 2) % (this.tunnel.sides * this.tunnel.tilesPerSide));
			var targetColumn = Math.floor(((intersectZ + cameraZ) / this.tunnel.tileSize) - 0.5);
			this.targetTile = [targetStrip, targetColumn];

			//search for closer tiles
			var error = getDistance2d(spaceToScreen(this.tunnel.worldPositionOfTile(this.targetTile[0], this.targetTile[1] + 1)), [cursor_x, cursor_y]);
			var pastError;
			
			for (var t=this.targetTile[1]-1; t>=-1; t--) {
				pastError = error;
				//check tile
				error = getDistance2d(spaceToScreen(this.tunnel.worldPositionOfTile(this.targetTile[0], t+1)), [cursor_x, cursor_y]);
				//if the error has increased, break out of the loop. If not however, change the target tile
				if (error > pastError) {
					t = -43;
				} else {
					this.targetTile[1] = t;
				}
			}

			if (this.targetTile[1] < -1) {
				this.targetTile[1] = -1;
			}

			
			var tileCoords = this.tunnel.worldPositionOfTile(this.targetTile[0], this.targetTile[1] + 1);
			this.selectedTileExtra = new Tile_Plexiglass(tileCoords[0], tileCoords[1], tileCoords[2], this.tunnel.tileSize, this.tunnel.strips[this.targetTile[0]].normal, this.tunnel, this.targetTile, this.tunnel.color, 0.5);
			this.selectedTileExtra.playerDist = 50;
			this.selectedTileExtra.cameraDist = 50;

			//if the cursor is down, modify the tile
			if (cursor_down) {
				this.modifySelectedTilePos();
			}
		}
	}

	handleMouseDown(a) {
		if (super.handleMouseDown(a) == 31) {
			return;
		}

		//changing tile selected
		if (cursor_x < canvas.width * 0.06) {
			this.tileSelected = clamp(Math.floor((cursor_y - (canvas.height / 15))  / (canvas.height / 15)) - 1, 0, 12);
			return;
		}

		//if it's at the start, toggle a spawn rather than creating a tile
		if (this.targetTile[1] == -1) {
			var spawnArr = this.tunnel.spawns;
			if (!spawnArr.includes(this.targetTile[0])) {
				spawnArr.push(this.targetTile[0]);
			} else {
				spawnArr.splice(spawnArr.indexOf(this.targetTile[0]), 1);
			}
			return;
		}
		//place tile there if no other actions have been taken
		this.modifySelectedTilePos();
	}

	modifySelectedTilePos() {
		if (this.tunnel.data[this.targetTile[0]] == undefined) {
			this.tunnel.data[this.targetTile[0]] = [];
		}
		this.tunnel.data[this.targetTile[0]][this.targetTile[1]] = this.tileSelected;
		var coords = this.tunnel.worldPositionOfTile(this.targetTile[0], this.targetTile[1] + 1);
		this.tunnel.strips[this.targetTile[0]].tiles[this.targetTile[1]] = this.tunnel.generateTile(this.tileSelected, coords[0], coords[1], coords[2], this.tunnel.tileSize, this.tunnel.strips[this.targetTile[0]].normal, [this.targetTile[0], this.targetTile[1]], this.tunnel.color);
		player = new Runner(player.x, player.y, player.z);
		this.tunnel.strips[this.targetTile[0]].establishReals();
		player = new Pastafarian(player.x, player.y, player.z);
		player.parent = this.tunnel;
		player.parentPrev = this.tunnel;
	}
}

class State_Edit_Properties extends State_Edit {
	constructor() {
		super();

		this.propertyModifiers = [
			//ew, this is verbose
			//hue + saturation + value
			new PropertySlider(0.01, 0.14 + (0 * editor_sliderHeight), editor_propertyMenuWidth - (editor_sliderMargin * 2), editor_sliderProportion, `hue`, `loading_state.tunnel.color.h = value;`, `loading_state.tunnel.color.h`, 0, 360, 1, false),
			new PropertySlider(0.01, 0.14 + (1 * editor_sliderHeight), editor_propertyMenuWidth - (editor_sliderMargin * 2), editor_sliderProportion, `sat.`, `loading_state.tunnel.color.s = value;`, `loading_state.tunnel.color.s`, 0, 80, 1, false),
			new PropertySlider(0.01, 0.14 + (2 * editor_sliderHeight), editor_propertyMenuWidth - (editor_sliderMargin * 2), editor_sliderProportion, `val.`, `loading_state.tunnel.color.v = value;`, `loading_state.tunnel.color.v`, 0, 0.9, 0.001, false),

			//power
			new PropertySlider(0.01, 0.14 + (4 * editor_sliderHeight), editor_propertyMenuWidth - (editor_sliderMargin * 2), editor_sliderProportion, `power`, `loading_state.tunnel.powerBase = value;`, `loading_state.tunnel.powerBase`, 0, 1, 0.01, false),

			//tile properties
			new PropertySlider(0.01, 0.14 + (6 * editor_sliderHeight), editor_propertyMenuWidth - (editor_sliderMargin * 2), editor_sliderProportion, `tile size`, `loading_state.tunnel.tileSize = value; world_camera.targetY = value / 2;`, `loading_state.tunnel.tileSize`, 15, 220, 5, true),
			new PropertySlider(0.01, 0.14 + (7 * editor_sliderHeight), editor_propertyMenuWidth - (editor_sliderMargin * 2), editor_sliderProportion / 2, `tiles / side`, `loading_state.tunnel.tilesPerSide = value;`, `loading_state.tunnel.tilesPerSide`, 1, 8, 1, true),
			new PropertySlider(0.01, 0.14 + (8 * editor_sliderHeight), editor_propertyMenuWidth - (editor_sliderMargin * 2), editor_sliderProportion, `sides`, `loading_state.tunnel.sides = value;`, `loading_state.tunnel.sides`, 3, 50, 1, true),

			//tunnel name
			new PropertyTextBox(0.01, 0.14 + (10 * editor_sliderHeight), editor_propertyMenuWidth - (editor_sliderMargin * 2), `id~`, `loading_state.tunnel.id = value;`, `loading_state.tunnel.id`, `New Tunnel Name: `, ``, false),
			
			//save / load
			new PropertyTextBox(0.01, 0.14 + (11 * editor_sliderHeight), (editor_propertyMenuWidth / 2) - editor_sliderMargin, `load`, `loading_state.tunnel = new Tunnel_FromData(value); loading_state.tunnel.theta = (Math.PI * 2) - world_camera.targetTheta; loading_state.tunnel.updatePosition(0, 0, 0);`, `""`, `Input Tunnel Data: `, ``, true),
			new PropertyTextBox(0.01 + (editor_propertyMenuWidth / 2), 0.14 + (11 * editor_sliderHeight), (editor_propertyMenuWidth / 2) - editor_sliderMargin, `save`, ``, `""`, `Don't type in the box, just copy this string:`, `loading_state.tunnel.giveStringData();`, true),
		];
		
		this.topDarkButton = 2;
	}

	execute() {
		this.tunnel.power = this.tunnel.powerBase;

		//world thoingies
		drawSky(color_bg);
		editor_active = true;
		this.tunnel.tick();
		this.convertPlayerToCamera();
		this.tunnel.beDrawn();
		editor_active = false;

		//side bar
		ctx.fillStyle = color_editor_bg;
		ctx.fillRect(0, (canvas.height * editor_topBarHeight) - 1, canvas.width * editor_propertyMenuWidth, (canvas.height * (1 - editor_topBarHeight)) + 1);

		//sliders
		this.propertyModifiers.forEach(m => {
			m.tick();
			m.beDrawn();
		});

		//top bar
		super.execute();
	}

	handleMouseDown(a) {
		//if cursor is up top
		//property menu
		if (cursor_x < canvas.width * editor_propertyMenuWidth && this.substate == 2) {
			return;
		}
	}
}

class State_Edit_Triggers extends State_Edit {
	constructor() {
		super();
	}

	execute() {

	}
}

class State_Edit_World extends State_Edit {
	constructor() {
		super();
	}

	execute() {
		
	}
}



