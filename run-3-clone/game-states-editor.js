class State_Edit {
	constructor() {
		player = new Runner(player.x, player.y, player.z);
		this.readFrom = orderObjects(editor_objects, 6);
		this.lightMultiplier = 2.2;
		this.tunnel = this.readFrom[this.readFrom.length-1];
		this.buttons = [
			new PropertyButton(0.5 / 5, editor_topBarHeight / 2, 1 / 5.5, editor_topBarHeight * editor_buttonHeightPercentage, "Tiles", `loading_state = new State_Edit_Tiles();`),
			new PropertyButton(1.5 / 5, editor_topBarHeight / 2, 1 / 5.5, editor_topBarHeight * editor_buttonHeightPercentage, "Properties", `loading_state = new State_Edit_Properties();`),
			new PropertyButton(3.5 / 5, editor_topBarHeight / 2, 1 / 5.5, editor_topBarHeight * editor_buttonHeightPercentage, "Cutscene", `loading_state = new State_Edit_Cutscenes();`),
			new PropertyButton(4.5 / 5, editor_topBarHeight / 2, 1 / 5.5, editor_topBarHeight * editor_buttonHeightPercentage, "Playtest", ``),
			new PropertyButton(2.5 / 5, editor_topBarHeight / 2, 1 / 5.5, editor_topBarHeight * editor_buttonHeightPercentage, "World", `loading_state = new State_Edit_World();`),
		];
	}

	doWorldEffects() {
		world_camera.targetX = 0.1;
		world_camera.targetY = 0.1;
		world_camera.targetZ = 0;

		if (this.tunnel != undefined) {
			world_camera.targetTheta = (Math.PI * 2) - this.tunnel.theta;
			world_camera.targetX = this.tunnel.x + 0.1;
			world_camera.targetY = this.tunnel.y + 0.1;
			world_camera.targetZ = this.tunnel.z;
		}
		world_camera.targetRot = 0;
		world_camera.rot = 0;
		world_camera.targetPhi = 0;
		
		//so they can see plexiglass tiles
		player = new Pastafarian(player.x, player.y, player.z);
		render_maxColorDistance *= this.lightMultiplier;
	}

	execute() {
		drawSky(color_bg);
		world_camera.tick();
		this.convertPlayerToCamera();

		editor_active = true;
		//draw all tunnels
		this.readFrom.forEach(e => {
			e.tick();
			e.beDrawn();
		});
		editor_active = false;

		//order objects every few frames
		if (world_time % 17 == 16) {
			this.readFrom = orderObjects(this.readFrom, 6);
		}
		
		
		this.drawTopBar();
		//little dot in the center of the screen
		drawCircle(color_editor_cursor, canvas.width * 0.5, canvas.height * 0.5, 2);
	}

	convertPlayerToCamera() {
		//update player properties
		player.x = world_camera.x;
		player.y = world_camera.y;
		player.z = world_camera.z;


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

	drawTopBar() {
		//top bar
		ctx.fillStyle = color_editor_bg;
		ctx.fillRect(0, 0, canvas.width, canvas.height * editor_topBarHeight);

		//top buttons
		ctx.font = `${Math.floor(canvas.height * 0.04)}px Comfortaa`;
		this.buttons.forEach(b => {
			b.tick();
			b.beDrawn();
		});
	}

	handleMouseMove(a) {
		updateCursorPos(a);
		//if the cursor is up top
		if (cursor_y < canvas.height * 0.15) {
			return 31;
		}
	}

	handleMouseDown(a) {
		updateCursorPos(a);
		//changing state
		if (cursor_y < canvas.height * 0.12) {
			this.buttons.forEach(b => {
				b.handleClick();
			});
			if (loading_state != this) {
				render_maxColorDistance /= this.lightMultiplier;
			}
			return 31;
		}
	}

	handleEscape() {
		render_maxColorDistance /= this.lightMultiplier;
		player = new Runner(player.x, player.y, player.z);
		loading_state = new State_Menu();
	}

	handleKeyPress(a) {
		
	}

	handleKeyNegate(a) {

	}
}


class State_Edit_Tiles extends State_Edit {
	constructor() {
		super();
		this.doWorldEffects();

		this.tileSelected = 0;
		this.animTileSelected = 0;

		this.targetTile = [3, 15];
		var tileCoords = this.tunnel.worldPositionOfTile(this.targetTile[0], this.targetTile[1] + 1);
		this.selectedTileExtra = new Tile_Plexiglass(tileCoords[0], tileCoords[1], tileCoords[2], this.tunnel.tileSize, this.tunnel.strips[this.targetTile[0]].normal, this.tunnel, this.targetTile, this.tunnel.color, 0.5);
		this.selectedTileExtra.playerDist = 50;
		this.selectedTileExtra.cameraDist = 50;
		this.topDarkButton = 1;
		this.cameraMovement = 0;
	}

	execute() {
		//move camera
		if (this.cameraMovement != 0) {
			var cameraOffset = polToCart(world_camera.targetTheta, world_camera.targetPhi, (8*(controls_shiftPressed+1)) * this.cameraMovement);
			world_camera.targetX += cameraOffset[0];
			world_camera.targetY += cameraOffset[1];
			world_camera.targetZ += cameraOffset[2];

			if (cursor_down) {
				this.modifySelectedTilePos();
			}
		}
		
		super.execute();
		this.selectedTileExtra.beDrawn();

		//update the tile selected
		this.animTileSelected = (this.animTileSelected * (render_animSteps - 1) + this.tileSelected) / render_animSteps;

		//draw tile coordinates
		if (this.targetTile != undefined) {
			ctx.fillStyle = color_text_bright;
			ctx.textAlign = "right";
			ctx.font = `${canvas.height / 40}px Comfortaa`;
			ctx.fillText(JSON.stringify(this.targetTile), canvas.width * 0.96, canvas.height * 0.95);
			ctx.textAlign = "center";
		}
		//side bar
		ctx.fillStyle = color_editor_bg;
		ctx.fillRect(0, canvas.height * (editor_topBarHeight - 0.01), canvas.width * 0.06, canvas.height);

		//selection box
		ctx.globalAlpha = 0.3;
		ctx.fillStyle = color_grey_light;
		ctx.strokeStyle = color_menuSelectionOutline;
		ctx.lineWidth = canvas.height / 200;
		drawRoundedRectangle((canvas.width * 0.015) - (canvas.width * editor_tileSize * 0.3), ((canvas.height / 17) * (this.animTileSelected + 2)) - (canvas.width * editor_tileSize * 0.3), 
							canvas.width * editor_tileSize * 1.6, canvas.width * editor_tileSize * 1.6, canvas.height / 100);
		ctx.globalAlpha = 1;
		ctx.lineWidth = 2;

		//tile listing
		for (var a=0; a<15; a++) {
			drawTile2d(canvas.width * 0.015, (canvas.height / 17) * (a + 2), canvas.width * editor_tileSize, a);
		}

		
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
		//var divisor = getDistance2d([0, 0], [xOffset, yOffset]) / Math.max(Math.abs(xOffset), Math.abs(yOffset));
		//intersectZ /= divisor;
		var cameraZ = spaceToRelativeRotless([world_camera.x, world_camera.y, world_camera.z], [this.tunnel.x, this.tunnel.y, this.tunnel.z], [(Math.PI * 2) - this.tunnel.theta, 0])[2];

		if (intersectZ < editor_maxEditDistance) {
			//update the tile self points to
			var angle = (Math.atan2(yOffset, -xOffset) + Math.PI) / (Math.PI * 2);
			var targetStrip = Math.floor(((angle * (this.tunnel.sides * this.tunnel.tilesPerSide)) + (this.tunnel.sides * this.tunnel.tilesPerSide) + (this.tunnel.tilesPerSide / 2)) % (this.tunnel.sides * this.tunnel.tilesPerSide));
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
			this.tileSelected = clamp(Math.floor((cursor_y - (canvas.height / 17))  / (canvas.height / 17)) - 1, 0, 15);
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

	handleKeyPress(a) {
		switch(a.keyCode) {
			case 37:
			case 65:
				world_camera.targetTheta -= Math.PI;
				if (world_camera.targetTheta < 0) {
					world_camera.targetTheta += Math.PI * 2;
					world_camera.theta += Math.PI * 2;
				}
				break;
			case 38:
			case 87:
				this.cameraMovement = 1;
				break;
			case 39:
			case 68:
				world_camera.targetTheta += Math.PI;
				if (world_camera.targetTheta > Math.PI * 2) {
					world_camera.targetTheta -= Math.PI * 2;
					world_camera.theta -= Math.PI * 2;
				}
				break;
			case 40:
			case 83:
				this.cameraMovement = -1;
				break;
		}
	}

	handleKeyNegate(a) {
		switch(a.keyCode) {
			case 38:
			case 87:
				if (this.cameraMovement == 1) {
					this.cameraMovement = 0;
				}
				break;
			case 40:
			case 83:
				if (this.cameraMovement == -1) {
					this.cameraMovement = 0;
				}
				break;
		}
	}

	modifySelectedTilePos() {
		//expand array if necessary
		this.tunnel.len = Math.max(this.tunnel.len, this.targetTile[1] + 1);
		this.tunnel.repairData();

		//basically just uh... kinda sorta... replace the tile
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
		this.doWorldEffects();

		this.propertyModifiers = [
			//ew, this is verbose
			//hue + saturation + value
			new PropertySlider(0.01, 0.14 + (0 * editor_sliderHeight), editor_propertyMenuWidth - (editor_sliderMargin * 2), editor_sliderProportion, `hue`, `loading_state.tunnel.color.h = value;`, `loading_state.tunnel.color.h`, 0, 360, 1, false),
			new PropertySlider(0.01, 0.14 + (1 * editor_sliderHeight), editor_propertyMenuWidth - (editor_sliderMargin * 2), editor_sliderProportion, `sat.`, `loading_state.tunnel.color.s = value;`, `loading_state.tunnel.color.s`, 0, 80, 1, false),
			new PropertySlider(0.01, 0.14 + (2 * editor_sliderHeight), editor_propertyMenuWidth - (editor_sliderMargin * 2), editor_sliderProportion, `val.`, `loading_state.tunnel.color.v = value;`, `loading_state.tunnel.color.v`, 0, 0.9, 0.001, false),

			//power
			new PropertySlider(0.01, 0.14 + (4 * editor_sliderHeight), editor_propertyMenuWidth - (editor_sliderMargin * 2), editor_sliderProportion, `power`, `loading_state.tunnel.powerBase = value;`, `loading_state.tunnel.powerBase`, 0, 1, 0.01, false),

			//tile properties
			new PropertySlider(0.01, 0.14 + (6 * editor_sliderHeight), editor_propertyMenuWidth - (editor_sliderMargin * 2), editor_sliderProportion, `tile size`, `loading_state.tunnel.tileSize = value;`, `loading_state.tunnel.tileSize`, 15, 220, 5, true),
			new PropertySlider(0.01, 0.14 + (7 * editor_sliderHeight), editor_propertyMenuWidth - (editor_sliderMargin * 2), editor_sliderProportion / 2, `tiles / side`, `loading_state.tunnel.tilesPerSide = value; loading_state.tunnel.repairData();`, `loading_state.tunnel.tilesPerSide`, 1, 8, 1, true),
			new PropertySlider(0.01, 0.14 + (8 * editor_sliderHeight), editor_propertyMenuWidth - (editor_sliderMargin * 2), editor_sliderProportion, `sides`, `loading_state.tunnel.sides = value; loading_state.tunnel.repairData();`, `loading_state.tunnel.sides`, 3, 50, 1, true),

			//music
			new PropertyButton(0.025, 0.14 + (10 * editor_sliderHeight), 0.04, 0.045, '<', `loading_state.tunnel.music = data_musics[(data_musics.indexOf(loading_state.tunnel.music)+(data_musics.length-1)) % data_musics.length];`),
			new PropertyButton(editor_propertyMenuWidth - 0.025, 0.14 + (10 * editor_sliderHeight), 0.04, 0.045, '>', `loading_state.tunnel.music = data_musics[(data_musics.indexOf(loading_state.tunnel.music)+1) % data_musics.length];`),

			//banned characters

			//tunnel name
			new PropertyTextBox(0.01, 0.14 + (15 * editor_sliderHeight), editor_propertyMenuWidth - (editor_sliderMargin * 2), `id~`, `loading_state.tunnel.id = value;`, `loading_state.tunnel.id`, `New Tunnel Name: `, ``, false),
			
			//save / load individual level
			new PropertyTextBox(0.01, 								   0.14 + (16 * editor_sliderHeight), (editor_propertyMenuWidth / 2) - editor_sliderMargin, `load`, `loading_state.newTunnelData = value;`, `""`, `Input Tunnel Data: `, ``, true),
			new PropertyTextBox(0.01 + (editor_propertyMenuWidth / 2), 0.14 + (16 * editor_sliderHeight), (editor_propertyMenuWidth / 2) - (editor_sliderMargin * 2), `save`, ``, `""`, `Don't type in the box, just copy this string:`, `loading_state.tunnel.giveStringData();`, true),
		];
		
		this.topDarkButton = 2;
		this.newTunnelData = undefined;
	}

	execute() {
		this.tunnel.power = this.tunnel.powerBase;

		//world thoingies
		super.execute();

		//side bar
		ctx.fillStyle = color_editor_bg;
		ctx.fillRect(0, (canvas.height * editor_topBarHeight) - 1, canvas.width * editor_propertyMenuWidth, (canvas.height * (1 - editor_topBarHeight)) + 1);

		
		//sliders
		this.propertyModifiers.forEach(m => {
			m.tick();
			m.beDrawn();
		});

		//drawing music choice
		ctx.fillStyle = color_text_bright;
		ctx.font = `${canvas.height / 45}px Comfortaa`;
		ctx.textAlign = "center";
		ctx.fillText(this.tunnel.music, canvas.width * (editor_propertyMenuWidth / 2), canvas.height * (0.1475 + (10 * editor_sliderHeight)));

		//this system is horribly janky
		if (this.newTunnelData != undefined) {
			var oldObj = this.tunnel;
			//create object and update properties
			var newObj = new Tunnel_FromData(this.newTunnelData);
			newObj.theta = oldObj.theta;
			newObj.updatePosition(oldObj.x, oldObj.y, oldObj.z);

			//switch new and old objects
			this.tunnel = newObj;
			editor_objects[editor_objects.indexOf(oldObj)] = newObj;
			this.readFrom[this.readFrom.indexOf(oldObj)] = newObj;
			player.parent = newObj;
			player.parentPrev = newObj;
			this.newTunnelData = undefined;
		}
	}

	handleMouseDown(a) {
		//if cursor is up top
		if (super.handleMouseDown(a) == 31) {
			return;
		}
		
		//property menu
		if (cursor_x < canvas.width * editor_propertyMenuWidth) {
			this.propertyModifiers.forEach(p => {
				if (p.constructor.name == "PropertyButton") {
					p.handleClick();
				}
			});
		}
	}
}

class State_Edit_World extends State_Edit {
	constructor() {
		super();
		this.topDarkButton = 3;
		//x, y approach
		this.cameraForce = [0, 0];
		this.tunnel = undefined;
		this.lightMultiplier = 8;
		this.doWorldEffects();

		//sometimes my genius, it's almost frightening. JUST ADD MORE BUTTONS! THIS IS PERFECT INTERFACE DESIGN
		this.lowButtons = [
			new PropertyButton(0.03, 0.96, 0.04, 0.05, `+`, `loading_state.addTunnel();`),
			new PropertyButton(0.08, 0.96, 0.04, 0.05, `-`, ``),
			new PropertyButton(0.18, 0.96, 0.14, 0.05, `export`, `file_export();`),
			new PropertyButton(0.33, 0.96, 0.14, 0.05, `import`, `document.getElementById('upload').click();`),
		];
	}

	addTunnel() {
		//choosing tag
		var tag = "";
		for (var n=0; n<4; n++) {
			tag += data_alphaNumerics[Math.floor(randomBounded(0, data_alphaNumerics.length-1))];
		}
		var pos = screenToSpace([canvas.width / 2, canvas.height / 2], world_camera.targetY);
		editor_objects.push(new Tunnel(0.00, {h: Math.round(randomBounded(0, 360)), s: Math.round(randomBounded(20, 80)), v: randomBounded(0.2, 0.8)}, [[1, 1, 1, 1, 1], [1, 0, 1, 0, 1]], 'Custom Tunnel '+tag, 5, 1, [], 4, [1], [], 4, 75, pos[0], pos[2], [], `TravelTheGalaxy`));
		this.readFrom = orderObjects(editor_objects, 6);
	}
	

	doWorldEffects() {
		world_camera.targetY = 4000;
		world_camera.targetX = this.readFrom[this.readFrom.length-1].x;
		world_camera.targetZ = this.readFrom[this.readFrom.length-1].z;
		world_camera.targetTheta = 0;
		world_camera.targetPhi = Math.PI / -2;
		world_camera.targetRot = 0;

		player.parent = undefined;
		player.parentPrev = undefined;
		render_maxColorDistance *= this.lightMultiplier;
	}

	execute() {
		player.parent = undefined;
		player.parentPrev = undefined;
		super.execute();
		this.readFrom = orderObjects(this.readFrom, 6);

		ctx.lineWidth = 2;

		this.readFrom.forEach(r => {
			if (r == this.tunnel) {
				ctx.strokeStyle = color_editor_cursor;
				ctx.fillStyle = color_editor_cursor;
			} else {
				ctx.strokeStyle = color_grey_dark;
				ctx.fillStyle = color_grey_dark;
			}
			//center dot
			var XY = spaceToScreen([r.x, r.y, r.z]);
			var offset = [editor_thetaCircleRadius * Math.cos((Math.PI * 2) - r.theta), editor_thetaCircleRadius * Math.sin((Math.PI * 2) - r.theta)];
			drawCircle(ctx.fillStyle, XY[0], XY[1], 5);

			//theta change circle
			ctx.beginPath();
			ctx.ellipse(XY[0], XY[1], editor_thetaCircleRadius, editor_thetaCircleRadius, 0, 0, Math.PI * 2);
			ctx.stroke();

			ctx.beginPath();
			ctx.ellipse(XY[0] + offset[0], XY[1] + offset[1], editor_thetaKnobRadius, editor_thetaKnobRadius, 0, 0, Math.PI * 2);
			ctx.fill();
		});

		//low buttons
		this.lowButtons.forEach(l => {
			l.tick();
			l.beDrawn();
		});

		//move camera along camera force
		world_camera.targetX += 32 * this.cameraForce[0] * (controls_shiftPressed + 1);
		world_camera.targetZ += 32 * this.cameraForce[1] * (controls_shiftPressed + 1);

		//make sure camera is within a reasonable bounds
		world_camera.targetX = clamp(world_camera.targetX, -editor_cameraLimit, editor_cameraLimit);
		world_camera.targetZ = clamp(world_camera.targetZ, -editor_cameraLimit, editor_cameraLimit);
	}

	handleKeyPress(a) {
		//camera noises
		switch(a.keyCode) {
			case 37:
			case 65:
				this.cameraForce[0] = -1;
				break;
			case 38:
			case 87:
				this.cameraForce[1] = 1;
				break;
			case 39:
			case 68:
				this.cameraForce[0] = 1;
				break;
			case 40:
			case 83:
				this.cameraForce[1] = -1;
				break;
		}
	}

	handleKeyNegate(a) {
		switch(a.keyCode) {
			case 37:
			case 65:
				if (this.cameraForce[0] == -1) {
					this.cameraForce[0] = 0;
				}
				break;
			case 38:
			case 87:
				if (this.cameraForce[1] == 1) {
					this.cameraForce[1] = 0;
				}
				break;
			case 39:
			case 68:
				if (this.cameraForce[0] == 1) {
					this.cameraForce[0] = 0;
				}
				break;
			case 40:
			case 83:
				if (this.cameraForce[1] == -1) {
					this.cameraForce[1] = 0;
				}
				break;
		}
	}

	handleMouseDown(a) {
		if (super.handleMouseDown(a) == 31) {
			return;
		}

		//low buttons
		if (cursor_y > canvas.height * 0.94) {
			this.lowButtons.forEach(l => {
				l.handleClick();
			});
			return;
		}
		

		//dragging tunnels around I guess
		this.tunnel = undefined;
		this.readFrom.forEach(e => {
			var pos = spaceToScreen([e.x, e.y, e.z]);
			var offset = [editor_thetaCircleRadius * Math.cos((Math.PI * 2) - e.theta), editor_thetaCircleRadius * Math.sin((Math.PI * 2) - e.theta)];
			//get tunnel's coordinates and become selected
			if (getDistance2d([cursor_x, cursor_y], pos) < (e.r / e.cameraDist) * world_camera.scale) {
				this.tunnel = e;
				editor_changingTheta = false;
			}
			if (getDistance2d([cursor_x, cursor_y], [pos[0] + offset[0], pos[1] + offset[1]]) < editor_worldSnapTolerance) {
				this.tunnel = e;
				editor_changingTheta = true;
			}
		});

		
	}

	handleMouseMove(a) {
		updateCursorPos(a);
		//move selected tunnel
		if (cursor_down && this.tunnel != undefined) {
			if (editor_changingTheta) {
				//direction
				var tunnelPos = spaceToScreen([this.tunnel.x, this.tunnel.y, this.tunnel.z]);
				this.tunnel.theta = (Math.PI * 3) - (Math.atan2(cursor_y - tunnelPos[1], cursor_x - tunnelPos[0]) + Math.PI);
				this.tunnel.updatePosition(this.tunnel.x, 0, this.tunnel.z);
			} else {
				//movement
				var newCoords = screenToSpace([cursor_x, cursor_y], world_camera.y);
				this.tunnel.updatePosition(newCoords[0], 0, newCoords[2]);
			}
			
		}
	}
}


class State_Edit_Cutscenes extends State_Edit {
	constructor() {
		super();
		player = new Runner(player.x, player.y, player.z);
		this.cols = editor_cutsceneColumns;
		this.colHeight = editor_maxCutscenes / editor_cutsceneColumns;
	}

	execute() {
		//bg
		ctx.fillStyle = color_bg;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		//text
		ctx.fillStyle = color_text_bright;
		ctx.font = `${canvas.height / 30}px Comfortaa`;
		var xOff;
		var yOff;
		var ySpace = (1 - editor_topBarHeight - (2 * editor_cutsceneMargin)) / this.colHeight;
		
		for (var r=0; r<editor_cutscenes.length; r++) {
			xOff = canvas.width * ((0.5 + Math.floor(r / this.colHeight)) / (this.cols + 1));
			yOff = canvas.height * (editor_topBarHeight + (r % this.colHeight * ySpace));
			ctx.fillText(editor_cutscenes[r].id, xOff, yOff);
		}

		//this icon will just be a circle but I'll change it later
		super.drawTopBar();
	}

	handleKeyPress(a) {
	}

	handleKeyNegate(a) {

	}

	handleMouseDown(a) {

	}

	handleMouseMove(a) {

	}
}



