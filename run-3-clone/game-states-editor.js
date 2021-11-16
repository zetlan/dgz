class State_Edit {
	constructor() {
		player = new Runner(player.x, player.y, player.z);
		this.readFrom = orderObjects(editor_objects, 6);
		this.lightMultiplier = 2.2;
		this.tunnel = this.readFrom[this.readFrom.length-1];
		this.buttons = [
			new PropertyButton(0.5 / 5, editor_topBarHeight / 2, 1 / 5.5, editor_topBarHeight * editor_buttonHeightPercentage, "Tiles", `if (loading_state.constructor.name != "State_Edit_Tiles") {loading_state = new State_Edit_Tiles();}`),
			new PropertyButton(1.5 / 5, editor_topBarHeight / 2, 1 / 5.5, editor_topBarHeight * editor_buttonHeightPercentage, "Properties", `if (loading_state.constructor.name != "State_Edit_Properties") {loading_state = new State_Edit_Properties();}`),
			new PropertyButton(3.5 / 5, editor_topBarHeight / 2, 1 / 5.5, editor_topBarHeight * editor_buttonHeightPercentage, "Cutscene", `if (loading_state.constructor.name != "State_Edit_Cutscenes") {loading_state = new State_Edit_Cutscenes();}`),
			new PropertyButton(4.5 / 5, editor_topBarHeight / 2, 1 / 5.5, editor_topBarHeight * editor_buttonHeightPercentage, "Playtest", `loading_state.enterPlaytestMode();`),
			new PropertyButton(2.5 / 5, editor_topBarHeight / 2, 1 / 5.5, editor_topBarHeight * editor_buttonHeightPercentage, "World", `if (loading_state.constructor.name != "State_Edit_World") {loading_state = new State_Edit_World();}`),
		];
	}

	calculateTunnelPoints() {
		//points of the tunnel, handy for tunnel functions
		this.tunnelPoints = [];
		for (var a=0; a<this.tunnel.sides; a++) {
			this.tunnelPoints.push([
				this.tunnel.r * Math.cos(((Math.PI * 2) / this.tunnel.sides) * (a - 0.5)), 
				this.tunnel.r * Math.sin(((Math.PI * 2) / this.tunnel.sides) * (a - 0.5)), 
				0
			]);
		}
		//rotate
		for (var b=0; b<this.tunnelPoints.length; b++) {
			[this.tunnelPoints[b][0], this.tunnelPoints[b][2]] = rotate(this.tunnelPoints[b][0], this.tunnelPoints[b][2], this.tunnel.theta);
		}
	}

	doWorldEffects() {
		replacePlayer(0 + (7 * data_persistent.settings.pastaView));
		if (editor_objects.includes(player.parentPrev)) {
			//if the player's parent is an editor object, go there
			this.tunnel = player.parentPrev;

		}
		player.parent = undefined;
		player.parentPrev = undefined;
		if (this.tunnel != undefined) {
			world_camera.targetTheta = (Math.PI * 2) - this.tunnel.theta;
			world_camera.targetX = this.tunnel.x + 1;
			world_camera.targetY = this.tunnel.y + 1;
			world_camera.targetZ = this.tunnel.z;
			this.tunnel.generate();
		} else {
			world_camera.targetX = 1;
			world_camera.targetY = 1;
			world_camera.targetZ = 0;
		}
		world_camera.targetRot = 0;
		world_camera.rot = 0;
		world_camera.targetPhi = 0;
		
		//so user can see plexiglass tiles
		replacePlayer(7);
		render_maxColorDistance *= this.lightMultiplier;
	}

	enterPlaytestMode() {
		editor_objects.forEach(u => {
			u.getCameraDist();
		});

		player.parentPrev = editor_spawn;
		loading_state = new State_Playtest();
		loading_state.returnState = this;
		loading_state.text = player.parentPrev.id;
		loading_state.time = tunnel_textTime;
		player.parentPrev.reset();
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

	renderFunction(tunnelFunction) {
		//tunnel functions are [z, result value, type];
		//if the area isn't clipped, render the function
		var zOff = [0, 0, tunnelFunction[0] * this.tunnel.tileSize];
		[zOff[0], zOff[2]] = rotate(zOff[0], zOff[2], this.tunnel.theta);
		zOff[0] += this.tunnel.x;
		zOff[1] += this.tunnel.y;
		zOff[2] += this.tunnel.z;
		if (!isClipped(zOff)) {
			ctx.fillStyle = color_trigger;
			ctx.globalAlpha = 0.7 * Math.max((2 - Math.pow(Math.sin(modularDifference((Math.PI * 2) - loading_state.tunnel.theta, world_camera.theta, Math.PI * 2)) + 1, 1.5)), 0);
			ctx.beginPath();
			var point = [];
			this.tunnelPoints.forEach(p => {
				point = spaceToScreen([p[0] + zOff[0], p[1] + zOff[1], p[2] + zOff[2]]);
				ctx.lineTo(point[0], point[1]);
			});
			ctx.fill();
			ctx.globalAlpha = 1;
		}
	}

	handleMouseMove(a) {
		updateCursorPos(a);
		//if the cursor is up top
		if (cursor_y < canvas.height * editor_topBarHeight) {
			return 31;
		}
	}

	handleMouseDown(a) {
		updateCursorPos(a);
		//changing state
		if (cursor_y < canvas.height * 0.12) {
			this.buttons.forEach(b => {
				b.interact();
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

		this.substate = 0;
		this.substateTravel = 0;

		this.lowButton = new PropertyButton(0.91, 0.96, 0.16, 0.05, "Triggers", `loading_state.switchSubstates();`);
		this.funcButtons = [
			new PropertyButton(editor_lTriggerW + 0.025, 0.97, 0.04, 0.05, "-", `if (loading_state.triggerSelected != undefined) {
				loading_state.tunnel.functions.splice(loading_state.tunnel.functions.indexOf(loading_state.triggerSelected), 1);
				loading_state.triggerSelected = undefined;
			}`),
			new PropertyButton(editor_lTriggerW + 0.07, 0.97, 0.04, 0.05, "+", `loading_state.tunnel.functions.splice(0, 0, [0, 1, "instant"]);`)
		];

		this.sub2Buttons = [
			//esc
			new PropertyButton(editor_lTriggerW + 0.025, editor_topBarHeight + 0.03, 0.04, 0.05, "X", `loading_state.substate = 1;`),

			//left / right type selector
			new PropertyButton(editor_lTriggerW + 0.075, editor_topBarHeight + 0.03, 0.04, 0.05, '<', `loading_state.incrementTriggerType(-1);`),
			new PropertyButton(editor_lTriggerW + editor_triggerEditW - 0.075, editor_topBarHeight + 0.03, 0.04, 0.05, '>', `loading_state.incrementTriggerType(1);`)
		];

		this.tileSelected = 0;
		this.tileIsRing = false;
		this.animTileSelected = 0;

		this.triggerSelected = undefined;
		this.triggerLastChange = 0;

		this.targetTile = [3, 15];
		var tileCoords = this.tunnel.worldPositionOfTile(this.targetTile[0], this.targetTile[1] + 1);
		this.selectedTileExtra = new Tile_Plexiglass(tileCoords[0], tileCoords[1], tileCoords[2], this.tunnel.tileSize, this.tunnel.strips[this.targetTile[0]].normal, this.tunnel, this.targetTile, this.tunnel.color, 0.5);
		this.selectedTileExtra.playerDist = 50;
		this.selectedTileExtra.cameraDist = 50;
		this.cameraMovement = 0;
		this.calculateTunnelPoints();
	}

	incrementTriggerType(incrementBy) {
		//don't allow "true" cutscenes
		if (this.triggerSelected[2] == "cutscene") {
			this.triggerSelected[2] = "cutsceneImmerse";
		}
		this.triggerLastChange = incrementBy;
		var oldTypeNum = this.functionList.indexOf(this.triggerSelected[2]);
		var newTypeNum = modulate(oldTypeNum + incrementBy, this.functionList.length)
		//splice out old output controllers
		while (this.sub2Buttons.length > 3) {
			this.sub2Buttons.splice(this.sub2Buttons.length-1, 1);
		}
		

		//change type and add new output controllers
		this.triggerSelected[2] = this.functionList[newTypeNum];
		var selectorHeight = editor_topBarHeight + editor_triggerEditH * 0.75;
		if (this.functionList[newTypeNum] == "cutsceneImmerse") {
			//left / right cutscene selector
			this.sub2Buttons.push(new PropertyButton(editor_lTriggerW + 0.075, selectorHeight, 0.04, 0.05, '<', `loading_state.incrementCutsceneRef(-1);`));
			this.sub2Buttons.push(new PropertyButton(editor_lTriggerW + editor_triggerEditW - 0.075, selectorHeight, 0.04, 0.05, '>', `loading_state.incrementCutsceneRef(1);`));

			//don't be a cutscene if no cutscenes exist
			if (Object.keys(editor_cutscenes).length == 0) {
				this.incrementTriggerType(this.triggerLastChange + (this.triggerLastChange == 0));
				return;
			}

			//change result type
			if (this.triggerSelected[1].constructor.name != "String") {
				this.triggerSelected[1] = Object.keys(editor_cutscenes)[0];
			}
		} else {
			//power result slider
			this.sub2Buttons.push(new PropertySlider(editor_lTriggerW + (editor_triggerEditW / 8), selectorHeight, editor_triggerEditW * 0.75, (editor_triggerEditW / 2) - 0.05, `result`, `loading_state.triggerSelected[1] = value;`, `loading_state.triggerSelected[1]`, 0, 1, 0.0025, false));

			//change result type
			if (this.triggerSelected[1].constructor.name == "String") {
				this.triggerSelected[1] = 1;
			}
		}

		
	}

	incrementCutsceneRef(incrementBy) {
		var listing = Object.keys(editor_cutscenes);
		var index = listing.indexOf(this.triggerSelected[1])
		this.triggerSelected[1] = listing[modulate(index+incrementBy, Math.min(editor_maxCutscenes, listing.length))];
	}

	switchSubstates() {
		if (this.substate == 0 || this.substateTravel < 0) {
			//if it's already in the tiles area
			this.lowButton.label = "Triggers";
			this.substateTravel = editor_substateTravelSpeed;
		} else {
			//if already in triggers area
			this.lowButton.label = "Tiles";
			this.substateTravel = -editor_substateTravelSpeed;
		}
	}

	drawTileSidebar() {
		ctx.globalAlpha = 1 - this.substate;
		//update the tile icon selected
		if (this.tileSelected < 100) {
			this.animTileSelected = (this.animTileSelected * (render_animSteps - 1) + this.tileSelected) / render_animSteps;
		} else {
			this.animTileSelected = (this.animTileSelected * (render_animSteps - 1) + this.tileSelected - 100) / render_animSteps;	
		}
		
		//draw tile coordinates
		if (this.targetTile != undefined) {
			ctx.fillStyle = color_text_bright;
			ctx.textAlign = "right";
			ctx.font = `${canvas.height / 40}px Comfortaa`;
			ctx.fillText(JSON.stringify(this.targetTile), canvas.width * 0.99, canvas.height * 0.92);
			ctx.textAlign = "center";
		}

		//selection box
		ctx.lineWidth = canvas.height / 200;
		drawSelectionBox((canvas.width * (0.015 + editor_tileSize / 2)), ((canvas.height / 17) * (this.animTileSelected + 2)) + (canvas.width * editor_tileSize / 2), 
						canvas.width * editor_tileSize * 1.6, canvas.width * editor_tileSize * 1.6);
		ctx.lineWidth = 2;

		//tile listing
		for (var a=1; a<=13; a++) {
			drawTile2d(canvas.width * 0.015, (canvas.height / 17) * (a + 2), canvas.width * editor_tileSize, a + (100 * this.tileIsRing));
		}

		drawTile2d(canvas.width * 0.015, canvas.height * 0.95, canvas.width * editor_tileSize, 0);
	}

	drawTriggerSidebar() {
		ctx.globalAlpha = this.substate;
		ctx.lineWidth = 2;

		var ribX = canvas.width * editor_triggerRibX;
		var minH = canvas.height * (editor_topBarHeight - 0.01);
		var maxH = canvas.height * 0.98;
		var totalH = maxH - minH;
		var zScale = totalH / ((this.tunnel.len * this.tunnel.tileSize) + tunnel_transitionLength);

		//tunnel line
		var color = `hsl(${this.tunnel.color.h}, ${this.tunnel.color.s}%, ${this.tunnel.color.v * 85}%)`;
		ctx.strokeStyle = color;
		ctx.fillStyle = color;
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(ribX, minH + (zScale * (tunnel_transitionLength - this.tunnel.tileSize)));
		ctx.lineTo(ribX, maxH - (zScale * this.tunnel.tileSize));
		ctx.stroke();

		//circles
		//this line isn't confusing at all, size is height/240 unless there are a large amount of tiles, then it's 1/5th of the tiles, unless that makes it smaller than 1 pixel, in which case it's 1 pixel.
		var circleSize = Math.max(Math.min((canvas.height / 240), zScale * this.tunnel.tileSize * 0.2), 1);

		//draw tile snappers
		var numTiles = this.tunnel.len + Math.ceil(tunnel_transitionLength / this.tunnel.tileSize);
		for (var n=0; n<numTiles; n++) {
			drawCircle(color, ribX, maxH - ((n + 0.5) * zScale * this.tunnel.tileSize), circleSize);
		}

		//draw triggers
		for (var f=0; f<this.tunnel.functions.length; f++) {
			var objRef = this.tunnel.functions[f];
			//determine height from z-index
			var height = maxH - ((objRef[0] + 0.5) * zScale * this.tunnel.tileSize);
			if (this.triggerSelected == objRef) {
				drawCircle(color_editor_cursor, ribX, height, circleSize);
			} else {
				drawCircle(color_trigger, ribX, height, circleSize);
			}

			//the box
			drawSelectionBox(canvas.width * editor_lTriggerW * 0.56, height, canvas.width * editor_lTriggerW * 0.825, canvas.height * 0.02);
			
			ctx.fillStyle = color_text_bright;
			ctx.font = `${canvas.height / 80}px Comfortaa`;
			ctx.textAlign = "left";
			var textOffset = canvas.height / 300;

			//z
			ctx.fillText(objRef[0], ribX + (canvas.width * 0.005), height + textOffset);

			//type
			ctx.fillText(editor_functionMapping[objRef[2]], ribX + (canvas.width * 0.025), height + textOffset);

			//value
			ctx.textAlign = "right";
			ctx.fillText((objRef[2] != "cutsceneImmerse" && objRef[2] != "cutscene" && objRef[1].toFixed(data_precision) * 1) || objRef[1], canvas.width * (editor_lTriggerW - 0.01), height + textOffset);
		}

		this.funcButtons.forEach(f => {
			f.tick();
			f.beDrawn();
		});
	}

	drawTriggerEditor() {
			//bege
			ctx.fillStyle = color_editor_bg;
			ctx.fillRect(canvas.width * editor_lTriggerW - 1, canvas.height * editor_topBarHeight - 1, canvas.width * editor_triggerEditW + 1, canvas.height * editor_triggerEditH + 1);

			//type text
			ctx.fillStyle = color_text_bright;
			ctx.font = `${canvas.height / 40}px Comfortaa`;
			ctx.textAlign = "center";
			ctx.fillText(editor_functionMapping[this.triggerSelected[2]], canvas.width * (editor_lTriggerW + editor_triggerEditW / 2), canvas.height * (editor_topBarHeight + 0.04));

			//cutscene name text, if required
			if (this.triggerSelected[2] == "cutsceneImmerse") {
				ctx.font = `${canvas.height / 60}px Comfortaa`;
				if (editor_cutscenes[this.triggerSelected[1]] == undefined) {
					this.triggerSelected[1] = Object.keys(editor_cutscenes)[0];
				}
				ctx.fillText(editor_cutscenes[this.triggerSelected[1]].id, canvas.width * (editor_lTriggerW + editor_triggerEditW / 2), canvas.height * (editor_topBarHeight + editor_triggerEditH - 0.03));
			}

			//buttons
			this.sub2Buttons.forEach(b => {
				b.beDrawn();
				b.tick();
			});
	}

	execute() {
		//move camera
		if (this.cameraMovement != 0) {
			var cameraOffset = polToCart(world_camera.targetTheta, world_camera.targetPhi, (8*(controls_shiftPressed+1)) * this.cameraMovement);
			world_camera.targetX += cameraOffset[0];
			world_camera.targetY += cameraOffset[1];
			world_camera.targetZ += cameraOffset[2];

			this.getSelectedTile();

			if (cursor_down) {
				this.modifySelectedTile();
			}
		}
		
		super.execute();

		if (modularDifference((Math.PI * 2) - loading_state.tunnel.theta, world_camera.theta, Math.PI * 2) < Math.PI * 0.5) {
			//forwards case
			for (var f=this.tunnel.functions.length-1; f>-1; f--) {
				this.renderFunction(this.tunnel.functions[f]);
			}
		} else {
			//backwards case
			this.tunnel.functions.forEach(f => {
				this.renderFunction(f);
			});
		}
		this.selectedTileExtra.beDrawn();
		if (this.substate < 2) {
			this.lowButton.tick();
			this.lowButton.beDrawn();
		}
		super.drawTopBar();

		//update substate
		if (this.substate <= 1.1 + this.substateTravel) {
			this.substate += this.substateTravel;
			this.substate = clamp(this.substate, 0, 1);
			if (this.substate == 0 || this.substate == 1) {
				this.substateTravel = 0;
			}
		}

		//side bar bg
		ctx.fillStyle = color_editor_bg;
		ctx.fillRect(0, canvas.height * (editor_topBarHeight - 0.01), canvas.width * linterp(editor_lTileW, editor_lTriggerW, clamp(this.substate, 0, 1)), canvas.height);

		//tile sidebar
		if (this.substate < 1) {
			this.drawTileSidebar();
		}

		//trigger sidebar
		if (this.substate > 0) {
			this.drawTriggerSidebar();

			//substate 2 is selecting tunnel trigger properties, it gets its own thing
			if (this.substate == 2) {
				if (this.functionList == undefined) {
					this.functionList = Object.keys(editor_functionMapping);
					this.incrementTriggerType(0);
				}
				this.drawTriggerEditor();
			}
		}
		ctx.globalAlpha = 1;
	}

	getSelectedTile() {
		var xOffset = cursor_x - (canvas.width * 0.5);
		var yOffset = cursor_y - (canvas.height * 0.5);
		var tRef = this.tunnel;
		//outRate is the rate at which the ray travels out from the center. Used to calculate at what z position it will hit the tunnel
		var outRate = Math.sqrt(((xOffset * xOffset) + (yOffset * yOffset))) / world_camera.scale;
		//rough estimate of intersection point
		var intersectZ = tRef.r / outRate;

		if (Math.sqrt((xOffset * xOffset) + (yOffset * yOffset)) > editor_minEditAngle * canvas.height) {
			//update the tile self points to
			var isBackwards = (modularDifference((Math.PI * 2) - loading_state.tunnel.theta, world_camera.targetTheta, Math.PI * 2) != 0);
			var angle = (Math.atan2(yOffset, -xOffset) + Math.PI) / (Math.PI * 2);
			if (isBackwards) {
				angle = 0.5 - angle;
			}
			this.targetTile[0] = Math.floor(((angle * (tRef.sides * tRef.tilesPerSide)) + (tRef.sides * tRef.tilesPerSide) + (tRef.tilesPerSide / 2)) % (tRef.sides * tRef.tilesPerSide));

			//loop through tiles, starting at -1 or camera's z position
			var cameraTilePos = spaceToRelativeRotless([world_camera.x, world_camera.y, world_camera.z], [tRef.x, tRef.y, tRef.z], [(Math.PI * 2) - tRef.theta, 0])[2] / tRef.tileSize;
			var start;
			var end;
			if (isBackwards) {
				end = Math.floor(cameraTilePos);
				start = -1;
			} else {
				start = Math.max(-1, Math.floor(cameraTilePos+1));
				end = start + ((tRef.r / ((editor_minEditAngle * canvas.height) / world_camera.scale)) / tRef.tileSize);
			}
			var polyPoints = [[], [], [], []];
			var sRef = tRef.strips[this.targetTile[0]];
			//start from -1 and move forwards
			for (var t=start; t<end; t++) {
				//get polygon position for the tile
				polyPoints = [[0.5 + t, 0, -0.5], [0.5 + t, 0, 0.5], [1.5 + t, 0, 0.5], [1.5 + t, 0, -0.5]];
				//screen position
				for (var p=0; p<polyPoints.length; p++) {
					polyPoints[p] = spaceToScreen(transformPoint(polyPoints[p], [sRef.x, sRef.y, sRef.z], sRef.normal, tRef.tileSize * 2));
				}
				
				//if the cursor is inside the tile, make that selected and then break out
				if (inPoly([cursor_x, cursor_y], polyPoints)) {
					this.targetTile[1] = t;
					t = end + 1;
				}
			}
			var tileCoords = tRef.worldPositionOfTile(this.targetTile[0], this.targetTile[1] + 1);
			this.selectedTileExtra = new Tile_Plexiglass(tileCoords[0], tileCoords[1], tileCoords[2], tRef.tileSize, tRef.strips[this.targetTile[0]].normal, tRef, tRef.color, 0.5);
			this.selectedTileExtra.playerDist = 50;
			this.selectedTileExtra.cameraDist = 50;
		}
	}

	handleEscape() {
		if (this.substate == 2) {
			this.substate = 1;
			return;
		}
		super.handleEscape();
	}

	handleMouseMove(a) {
		updateCursorPos(a);
		//if cursor is up top
		if (super.handleMouseMove(a) == 31 && this.substate != 1) {
			return;
		}

		//if changing states
		if (this.substateTravel != 0) {
			return;
		}

		//tile mode
		if (this.substate == 0) {
			//if the cursor is over the menu to the left
			if (cursor_x < canvas.width * editor_lTileW) {
				return;
			}
		} else {
			//trigger editing
			if (this.substate == 2) {
				if (this.sub2Buttons[3].constructor.name == "PropertySlider") {
					this.sub2Buttons[3].interact();
				}
			}
			//if the cursor is over the tunnel rib with cursor down
			if (cursor_x < canvas.width * editor_lTileW) {
				if (cursor_down && this.triggerSelected != undefined) {
					//get new position for the trigger based on cursor position
					var minH = canvas.height * (editor_topBarHeight - 0.01);
					var maxH = canvas.height * 0.98;
					var totalH = maxH - minH;
					var numTiles = this.tunnel.len + Math.ceil(tunnel_transitionLength / this.tunnel.tileSize);
					var cursorTilePos = clamp(cursor_y - minH, 0, totalH);
					this.triggerSelected[0] = Math.floor((totalH - cursorTilePos) / (totalH / numTiles));
					//special case
					if (this.triggerSelected[0] > numTiles - 1) {
						this.triggerSelected[0] = numTiles - 1;
					}

					//reorder triggers just to be safe
					this.tunnel.functions.sort(function(a, b) {
						return a[0] - b[0];
					});
				}
				return;
			}
		}

		//if still here...
		this.getSelectedTile();

		//if the cursor is down, modify the tile
		if (cursor_down) {
			this.modifySelectedTile();
		}
 		
	}

	handleMouseDown(a) {
		if (this.substate == 2) {
			var toReturn = false;
			this.sub2Buttons.forEach(b => {
				if (b.interact() == 31) {
					toReturn = true;
				}
			});
			if (toReturn) {
				return;
			}
		}

		if (super.handleMouseDown(a) == 31 && this.substate < 1) {
			return;
		}

		this.lowButton.interact();

		if (this.substateTravel == 0) {
			//tile stuff
			if (this.substate == 0) {
				//changing tile selected
				if (cursor_x < canvas.width * 0.06) {
					if (cursor_y > canvas.height * 0.95) {
						this.tileIsRing = !this.tileIsRing;
						this.tileSelected += boolToSigned(this.tileIsRing) * 100;
						if (!tunnel_validIndeces[this.tileSelected]) {
							this.tileSelected = 0;
						}
						return;
					}

					//select new tile and make sure it's valid
					var targetVal = clamp(Math.floor((cursor_y - (canvas.height / 17)) / (canvas.height / 17)) - 1, 0, 13);
					if (this.tileIsRing && targetVal > 0) {
						targetVal += 100;
					}
					if (tunnel_validIndeces[targetVal]) {
						this.tileSelected = targetVal;
					}
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
				this.modifySelectedTile();
			}

			//trigger stuff
			if (this.substate == 1) {
				//buttons
				this.funcButtons.forEach(f => {
					f.interact();
				});
				
				var reqDist = editor_handleRadius;
				var ribX = canvas.width * editor_triggerRibX;
				var minH = canvas.height * (editor_topBarHeight - 0.01);
				var maxH = canvas.height * 0.98;
				var totalH = maxH - minH;
				var zScale = totalH / ((this.tunnel.len * this.tunnel.tileSize) + tunnel_transitionLength);

				this.triggerSelected = undefined;
				this.tunnel.functions.forEach(f => {
					var height = maxH - ((f[0] + 0.5) * zScale * this.tunnel.tileSize);

					//actual selection
					if (getDistance2d([cursor_x, cursor_y], [ribX, height]) < reqDist) {
						reqDist = getDistance2d([cursor_x, cursor_y], [ribX, height]);
						this.triggerSelected = f;
					}

					//selection for substate 2
					if (Math.abs(cursor_y - height) < canvas.height * 0.04 && cursor_x < editor_lTriggerW * canvas.width && cursor_x > 0.02 * canvas.width) {
						if (Math.abs(cursor_y - height) < reqDist || this.triggerSelected == undefined) {
							this.triggerSelected = f;
						}
						this.substate = 2;
					}
				});
			}
		}
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

	modifySelectedTile() {
		//expand array if necessary
		if (this.targetTile[1]+1 > this.tunnel.len) {
			this.tunnel.endSpawns = [];
		}

		//if the tile is already the selected value, do not change
		if (this.tunnel.data[this.targetTile[0]][this.targetTile[1]] == this.tileSelected) {
			return;
		}

		//basically just uh... kinda sorta... replace the tile
		this.tunnel.data[this.targetTile[0]][this.targetTile[1]] = this.tileSelected;
		var coords = this.tunnel.worldPositionOfTile(this.targetTile[0], this.targetTile[1] + 1);
		this.tunnel.strips[this.targetTile[0]].tiles[this.targetTile[1]] = this.tunnel.generateTile(this.tileSelected, coords[0], coords[1], coords[2], this.tunnel.tileSize, this.tunnel.strips[this.targetTile[0]].normal, [this.targetTile[0], this.targetTile[1]], this.tunnel.color);
		replacePlayer(0 + (7 * data_persistent.settings.pastaView));
		this.tunnel.repairData();
		this.tunnel.updatePosition(this.tunnel.x, this.tunnel.y, this.tunnel.z);
		replacePlayer(7);
	}
}

class State_Edit_Properties extends State_Edit {
	constructor() {
		super();
		this.doWorldEffects();

		this.propertyModifiers = [
			//ew, this is verbose
			//hue + saturation + value
			new PropertySlider(0.01, 0.14 + (0 * editor_sliderHeight), editor_lPropertyW - (editor_sliderMargin * 2), editor_sliderProportion, `hue`, `loading_state.tunnel.color.h = value;`, `loading_state.tunnel.color.h`, 0, 360, 1, false),
			new PropertySlider(0.01, 0.14 + (1 * editor_sliderHeight), editor_lPropertyW - (editor_sliderMargin * 2), editor_sliderProportion, `sat.`, `loading_state.tunnel.color.s = value;`, `loading_state.tunnel.color.s`, 0, 80, 1, false),
			new PropertySlider(0.01, 0.14 + (2 * editor_sliderHeight), editor_lPropertyW - (editor_sliderMargin * 2), editor_sliderProportion, `val.`, `loading_state.tunnel.color.v = value;`, `loading_state.tunnel.color.v`, 0, 0.9, 0.001, false),

			//power
			new PropertySlider(0.01, 0.14 + (4 * editor_sliderHeight), editor_lPropertyW - (editor_sliderMargin * 2), editor_sliderProportion, `power`, `loading_state.tunnel.powerBase = value;`, `loading_state.tunnel.powerBase`, 0, 1, 0.01, false),

			//tile properties
			new PropertySlider(0.01, 0.14 + (6 * editor_sliderHeight), editor_lPropertyW - (editor_sliderMargin * 2), editor_sliderProportion, `tile size`, `loading_state.tunnel.tileSize = value; loading_state.calculateTunnelPoints();`, `loading_state.tunnel.tileSize`, 15, 220, 5, true),
			new PropertySlider(0.01, 0.14 + (7 * editor_sliderHeight), editor_lPropertyW - (editor_sliderMargin * 2), editor_sliderProportion / 2, `tiles / side`, `loading_state.tunnel.tilesPerSide = value; loading_state.tunnel.repairData(); loading_state.calculateTunnelPoints();`, `loading_state.tunnel.tilesPerSide`, 1, 8, 1, true),
			new PropertySlider(0.01, 0.14 + (8 * editor_sliderHeight), editor_lPropertyW - (editor_sliderMargin * 2), editor_sliderProportion, `sides`, `loading_state.tunnel.sides = value; loading_state.tunnel.repairData(); loading_state.calculateTunnelPoints();`, `loading_state.tunnel.sides`, 3, 50, 1, true),

			//music
			new PropertyButton(0.025, 0.14 + (10 * editor_sliderHeight), 0.04, 0.05, '<', `loading_state.tunnel.music = data_musics[(data_musics.indexOf(loading_state.tunnel.music)+(data_musics.length-1)) % data_musics.length];`),
			new PropertyButton(editor_lPropertyW - 0.025, 0.14 + (10 * editor_sliderHeight), 0.04, 0.05, '>', `loading_state.tunnel.music = data_musics[(data_musics.indexOf(loading_state.tunnel.music)+1) % data_musics.length];`),

			//banned characters

			//tunnel name
			new PropertyTextBox(0.01, 0.14 + (15 * editor_sliderHeight), editor_lPropertyW - (editor_sliderMargin * 2), `id~`, `loading_state.tunnel.id = value;`, `loading_state.tunnel.id`, `New Tunnel Name: `, ``, false),
			
			//save / load individual level
			new PropertyTextBox(0.01,							0.14 + (16 * editor_sliderHeight), (editor_lPropertyW / 2) - editor_sliderMargin, `load`, `loading_state.newTunnelData = value;`, `""`, `Input Tunnel Data: `, ``, true),
			new PropertyTextBox(0.01 + (editor_lPropertyW / 2), 0.14 + (16 * editor_sliderHeight), (editor_lPropertyW / 2) - (editor_sliderMargin * 2), `save`, ``, `""`, `Don't type in the box, just copy this string:`, `loading_state.tunnel.giveStringData();`, true),
		];

		this.banButtons = [
			new PropertyButton(0.5 + (editor_lPropertyW / 2), 0.95, 0.04, 0.05, '+', `loading_state.banStorage.push(["the ~~character~~ isn't here!", []])`),
			new PropertyButton(0.5 + (editor_lPropertyW / 2), 0.533, 0.06, 0.08, 'X', `loading_state.banSelected = undefined;`)
		];

		this.banStorage = undefined;
		this.banSelected = undefined;
		this.allowStorage = undefined;

		this.substate = 0;
		this.newTunnelData = undefined;
		this.calculateTunnelPoints();
	}

	createTunnel() {
		//check if it's old data; I'd like to have a chat with player_03 about using special characters in his otherwise web-friendly level data. 
		//Thank goodness the user's passing this bit in and I'm not trying to read from a normal string.
		/*
		for old test: , 
		for kongregate object data:	.includes("{")
		*/
		
		//check for if it's old data
		if (this.newTunnelData.includes("layout-tunnel") && this.newTunnelData.includes("terrain-pos-")) {
			if (confirm("Hey! This data seems to be from a different version of run 3. Do you want to convert it? \n(Press OK to convert, Cancel to not)")) {
				//figure out whether it's an object or just data
				if (this.newTunnelData.includes("{") && this.newTunnelData.includes("}")) {
					//fix backslashes
					/*kongregate object data doesn't allow certain special characters. \u003e and \u003c correspond to > and <, the \n is the newline character, 
					and \\ corresponds to \. 
					The reason I have the extra bit with the newline character is because I'm worried that \n may appear in the level data.
					To prevent this, I only take the \n that are before a new tunnel declaration.
					*/
					this.newTunnelData = this.newTunnelData.replaceAll(`\\u003e`, `>`).replaceAll(`\\u003c`, `<`).replaceAll("\\nlayout-tunnel", "#NEWLINE#layout-tunnel").replaceAll(`\\\\`, `/`);
					//JSON doesn't like built-in newlines so I have to do this thing
					this.newTunnelData = JSON.parse(this.newTunnelData.replaceAll(`#NEWLINE#`, `\\n`));
					this.newTunnelData = tunnelData_convertOldObject(this.newTunnelData);
				} else {
					//data from player_03's website is more tame, if not still including backslashes
					this.newTunnelData = tunnelData_convertOldData(this.newTunnelData.replaceAll("\\", "/"));
				}
			}
		}
		//first tunnel
		//make sure the data is always an array - makes reading it out easier
		if (this.newTunnelData.constructor.name == "String") {
			this.newTunnelData = [this.newTunnelData];
		}

		var lastTunnel = new Tunnel_FromData(this.newTunnelData[0]);
		var pos;

		//switch new and old objects
		this.swapTunnels(this.tunnel, lastTunnel);
		this.newTunnelData.splice(0, 1);
		
		//do the rest of the tunnels as well
		while (this.newTunnelData.length > 0) {
			pos = [lastTunnel.endPos[0] - (tunnel_transitionLength * Math.sin(lastTunnel.theta)), lastTunnel.endPos[2] + (tunnel_transitionLength * Math.cos(lastTunnel.theta))];
			//update coordinates and direction, then create tunnel
			lastTunnel = new Tunnel_FromData(this.newTunnelData[0].replace(`pos-x~0`, `pos-x~${pos[0]}`).replace(`pos-z~0`, `pos-z~${pos[1]}`).replace(`direction~0`, `direction~${lastTunnel.theta}`));
			editor_objects.push(lastTunnel);
			this.readFrom = orderObjects(editor_objects, 6);
			this.newTunnelData.splice(0, 1);
		}
		this.newTunnelData = undefined;
	}

	swapTunnels(oldTunnel, newTunnel) {
		player = new Runner(player.x, player.y, player.z);
		//update properties of new object
		newTunnel.theta = oldTunnel.theta;
		newTunnel.updatePosition(oldTunnel.x, oldTunnel.y, oldTunnel.z);
		//make sure world spawn isn't out of world
		if (editor_spawn == oldTunnel) {
			editor_spawn = newTunnel;
		}

		this.banStorage = undefined;
		this.tunnel = newTunnel;
		editor_objects[editor_objects.indexOf(oldTunnel)] = newTunnel;
		this.readFrom[this.readFrom.indexOf(oldTunnel)] = newTunnel;
		player = new Pastafarian(player.x, player.y, player.z);
		player.parent = newTunnel;
		player.parentPrev = newTunnel;
		this.calculateTunnelPoints();
	}

	drawCharacterBans() {
		var centerX = (0.5 + (editor_lPropertyW / 2)) * canvas.width;
		var centerY = (0.5 + 0.035) * canvas.height;
		var height = (canvas.height - centerY) * 2;

		//bege
		ctx.fillStyle = color_bg;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		//rule selection
		if (this.banSelected == undefined) {
			if (this.banStorage == undefined) {
				this.parseBanned();
			}
			//show rules
			ctx.font = `${canvas.height / 38}px Comfortaa`;
			ctx.textAlign = "left";
			var baseX;
			var baseY;
			var textWidth;
			for (var r=0; r<this.banStorage.length; r++) {
				baseX = canvas.width * (editor_lPropertyW + 0.03);
				baseY = canvas.height * (0.1 + (r * 0.0775));
				textWidth = ctx.measureText(this.banStorage[r][0]).width + 10;
				//box
				drawSelectionBox(baseX + (textWidth / 2), baseY, textWidth, canvas.height * 0.04);

				//rule
				ctx.fillStyle = color_text_bright;
				ctx.fillText(this.banStorage[r][0], baseX + 4, baseY + (canvas.height * 0.01));

				//characters it applies to
				for (var c=0; c<this.banStorage[r][1].length; c++) {
					textures_common[data_characters.map[this.banStorage[r][1][c]]].frame = 0;
					textures_common[data_characters.map[this.banStorage[r][1][c]]].beDrawn(baseX + (canvas.height * 0.04 * (c+1)), baseY + (canvas.height * 0.0375), 0, canvas.height * 0.035);
				}
			}
			//+ button at the bottom
			this.banButtons[0].beDrawn();
			this.banButtons[0].tick();
			return;
		}
		
		//character selection
		ctx.fillStyle = color_editor_bg;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		//characters that the ban can't apply to (because they're in another ban) are skipped.
		//characters that are affected by the current ban are drawn with a dark grey background, 
		//and characters that aren't affected are drawn with a light grey background
		var leftOff;
		var rightOff;
		var centerOff;
		var theta;
		var wedgeAngle = Math.PI * 2 / data_characters.indexes.length;
		for (var c=0; c<data_characters.indexes.length; c++) {
			theta = wedgeAngle * c;

			leftOff = [height * 1.5 * Math.cos(theta - (wedgeAngle / 2)), height * 1.5 * Math.sin(theta - (wedgeAngle / 2))];
			centerOff = [height * 0.3 * Math.cos(theta), height * 0.3 * Math.sin(theta)];
			rightOff = [height * 1.5 * Math.cos(theta + (wedgeAngle / 2)), height * 1.5 * Math.sin(theta + (wedgeAngle / 2))];

			//bg
			if (this.allowStorage.includes(data_characters.indexes[c]) || this.banStorage[this.banSelected][1].includes(data_characters.indexes[c])) {
				//select color and draw wedge
				if (this.allowStorage.includes(data_characters.indexes[c])) {
					ctx.fillStyle = color_grey_light;
				} else {
					ctx.fillStyle = data_characters[data_characters.indexes[c]].color;
				}

				ctx.beginPath();
				ctx.moveTo(centerX, centerY);
				ctx.lineTo(centerX + leftOff[0], centerY + leftOff[1]);
				ctx.lineTo(centerX + rightOff[0], centerY + rightOff[1]);
				ctx.lineTo(centerX, centerY);
				ctx.fill();

				//draw character
				drawSelectionBox(centerX + centerOff[0], centerY + centerOff[1], menu_characterSize * 1.25, menu_characterSize * 1.25);
				textures_common[c].beDrawn(centerX + centerOff[0], centerY + centerOff[1], 0, menu_characterSize);
			}

			//draw line outwards (I put this here because I want a constant thickness)
			ctx.strokeStyle = color_editor_bg;
			ctx.beginPath();
			ctx.moveTo(centerX, centerY);
			ctx.lineTo(centerX + leftOff[0], centerY + leftOff[1]);
			ctx.stroke();
		}

		//text
		ctx.fillStyle = color_editor_bg;
		ctx.fillRect(0, 0, canvas.width, canvas.height * 0.07);
		ctx.font = `${canvas.height / 38}px Comfortaa`;
		ctx.textAlign = "center";
		drawSelectionBox(centerX, canvas.height * 0.03, ctx.measureText(this.banStorage[this.banSelected][0]).width + 10, canvas.height * 0.04);
		ctx.fillStyle = color_text_bright;
		ctx.fillText(this.banStorage[this.banSelected][0],centerX, canvas.height * 0.04);

		//X
		this.banButtons[1].tick();
		this.banButtons[1].beDrawn();

	}

	execute() {
		if (this.substate == 1) {
			this.drawCharacterBans();
			//sidebar
			ctx.fillStyle = color_editor_bg;
			ctx.fillRect(0, 0, canvas.width * editor_lPropertyW, canvas.height);
		} else {
			this.tunnel.power = this.tunnel.powerBase;

			//world thoingies
			super.execute();

			if (modularDifference((Math.PI * 2) - loading_state.tunnel.theta, world_camera.theta, Math.PI * 2) < Math.PI / 2) {
				//forwards case
				for (var f=this.tunnel.functions.length-1; f>-1; f--) {
					this.renderFunction(this.tunnel.functions[f]);
				}
			} else {
				//backwards case
				this.tunnel.functions.forEach(f => {
					this.renderFunction(f);
				});
			}
			super.drawTopBar();

			//side bar
			ctx.fillStyle = color_editor_bg;
			ctx.fillRect(0, (canvas.height * editor_topBarHeight) - 1, canvas.width * editor_lPropertyW, (canvas.height * (1 - editor_topBarHeight)) + 1);

			if (this.newTunnelData != undefined) {
				this.createTunnel();
				try {
					
				} catch (er) {
					alert("This tunnel data cannot be loaded.");
					this.newTunnelData = undefined;
				}
			}

			//sliders + text boxes
			this.propertyModifiers.forEach(m => {
				m.tick();
				m.beDrawn();
			});

			//drawing music choice
			ctx.fillStyle = color_text_bright;
			ctx.font = `${canvas.height / 45}px Comfortaa`;
			ctx.textAlign = "center";
			ctx.fillText(this.tunnel.music, canvas.width * (editor_lPropertyW / 2), canvas.height * (0.1475 + (10 * editor_sliderHeight)));
		}

		//drawing banned character toggle
		drawSelectionBox((editor_lPropertyW / 2) * canvas.width, (0.14 + (14 * editor_sliderHeight)) * canvas.height, editor_lPropertyW * 0.75 * canvas.width, editor_sliderHeight * 0.75 * canvas.height);
		ctx.font = `${canvas.height / 45}px Comfortaa`;
		ctx.textAlign = "center";
		ctx.fillStyle = color_text_bright;
		ctx.fillText("banned characters", (editor_lPropertyW / 2) * canvas.width, (0.15 + (14 * editor_sliderHeight)) * canvas.height);
	}

	parseBanned() {
		var ruleObj = flipObject(this.tunnel.bannedCharacters);
		var ruleKeys = Object.keys(ruleObj);

		this.allowStorage = ["Bunny", "Child", "Duplicator", "Gentleman", "Lizard", "Pastafarian", "Runner", "Skater", "Student"];
		var ruleList = [["the ~~character~~ isn't here!", ["Angel"]]];
		//if there are rules, use those. If not, create own rules.
		if (ruleKeys.length > 0) {
			this.allowStorage.push("Angel");
			ruleList = [];
			ruleKeys.forEach(k => {
				//add all the rules / banned characters
				//remove tick marks and change syntax so players can't directly interact with evaluating code.
				ruleList.push([k.replaceAll('`', '').replaceAll("${player.constructor.name}", "~~character~~"), ruleObj[k]]);
				ruleObj[k].forEach(c => {
					this.allowStorage.splice(this.allowStorage.indexOf(c), 1);
				});
				
			});
		}
		this.banStorage = ruleList;
	}

	pushBanned() {
		var obj = {};
		//loop through all rules
		this.banStorage.forEach(r => {
			//loop through all characters
			r[1].forEach(c => {
				//apply modified rule to character
				obj[c] = '`' + r[0].replaceAll("~~character~~", "${player.constructor.name}") + '`';
			});
		});
		this.tunnel.bannedCharacters = obj;
	}

	handleMouseDown(a) {
		if (this.substate == 0) {
			if (super.handleMouseDown(a) == 31) {
				return;
			}
		}
		//switching out of / into banned character mode
		if (cursor_x <= canvas.width * editor_lPropertyW && cursor_y > (0.14 + (13.5 * editor_sliderHeight)) * canvas.height && cursor_y < (0.14 + (14.5 * editor_sliderHeight)) * canvas.height) {
			this.substate = (!this.substate) * 1;

			//if switching out of banned character mode
			if (this.substate == 0) {
				this.pushBanned();
			}
			return;
		}

		//if in banned character mode, select rules
		if (this.substate == 1) {
			//if in viewing, select rule
			if (this.banSelected == undefined) {
				for (var r=0; r<this.banStorage.length; r++) {
					if (cursor_x > canvas.width * (editor_lPropertyW + 0.03) && 
					cursor_y && cursor_y >= canvas.height * (0.08 + (r * 0.0775)) && 
					cursor_y <= canvas.height * (0.12 + (r * 0.0775))) {
						this.banSelected = r;
						return;
					}
				}
				this.banButtons[0].interact();
				return;
			}
			//if in rule mode:
			
			//select rule text
			if (cursor_y < canvas.height * 0.07) {
				var newText = prompt("Enter new ban reason:", this.banStorage[this.banSelected][0]);
				if (isValidString(newText)) {
					//no
					newText = newText.replaceAll('`', '');
					newText = newText.replaceAll('${', '{');
					this.banStorage[this.banSelected][0] = newText;
				}
				return;
			}

			//select x
			if (this.banSelected != undefined && getDistance2d([cursor_x, cursor_y], [(0.5 + (editor_lPropertyW / 2)) * canvas.width, 0.535 * canvas.height]) < canvas.height / 10) {
				this.banButtons[1].interact();
				return;
			}

			//select character
			var angle = Math.atan2((canvas.height * 0.5) - cursor_y, (canvas.width * (0.5 + (editor_lPropertyW / 2))) - cursor_x) + Math.PI;
			var character = Math.floor(((angle / (Math.PI * 2)) * data_characters.indexes.length) + 0.5);
			if (character > data_characters.indexes.length - 1) {
				character = 0;
			}

			//toggle whether the rule applies
			if (this.banStorage[this.banSelected][1].includes(data_characters.indexes[character]) || this.allowStorage.includes(data_characters.indexes[character])) {
				//if allowed, ban them
				if (this.allowStorage.includes(data_characters.indexes[character])) {
					this.allowStorage.splice(this.allowStorage.indexOf(data_characters.indexes[character]), 1);
					this.banStorage[this.banSelected][1].push(data_characters.indexes[character]);
				} else {
					//if banned, allow them again
					this.banStorage[this.banSelected][1].splice(this.banStorage[this.banSelected][1].indexOf(data_characters.indexes[character]), 1);
					this.allowStorage.push(data_characters.indexes[character]);
				}
			}
			return;
		}

		
		
		//property menu
		if (cursor_x < canvas.width * editor_lPropertyW) {
			this.propertyModifiers.forEach(p => {
				p.interact();
			});
		}
	}

	handleMouseMove(a) {
		if (super.handleMouseMove(a) == 31) {
			return 31;
		}
		this.propertyModifiers.forEach(m => {
			if (m.constructor.name == "PropertySlider") {
				m.interact();
			}
		});
	}

	handleEscape() {
		if (this.substate == 1) {
			this.substate = 0;
			return;
		}
		super.handleEscape();
	}
}

class State_Edit_World extends State_Edit {
	constructor() {
		super();
		//x, y approach
		this.cameraForce = [0, 0];
		this.tunnel = undefined;
		this.lightMultiplier = 8;
		this.doWorldEffects();

		//sometimes my genius, it's almost frightening. JUST ADD MORE BUTTONS! THIS IS PERFECT INTERFACE DESIGN
		this.lowButtons = [
			new PropertyButton(0.025, 0.96, 0.04, 0.05, `+`, `loading_state.addTunnel();`),
			new PropertyButton(0.07, 0.96, 0.04, 0.05, `-`, `loading_state.deleteTunnel();`),
			new PropertyButton(0.16, 0.96, 0.13, 0.05, `export`, `file_export();`),
			new PropertyButton(0.295, 0.96, 0.13, 0.05, `import`, `document.getElementById('upload').click();`),
			new PropertyButton(0.5, 0.96, 0.27, 0.05, `set world spawn`, `editor_spawn = loading_state.tunnel;`),
			new PropertyButton(0.66, 0.96, 0.04, 0.05, `<`, `loading_state.selectBackwards();`),
			new PropertyButton(0.975, 0.96, 0.04, 0.05, `>`, `loading_state.selectForwards();`),
		];
	}

	addTunnel() {
		//choosing tag
		var tag = "";
		for (var n=0; n<4; n++) {
			tag += data_alphaNumerics[Math.floor(randomBounded(0, data_alphaNumerics.length-1))];
		}
		var pos = screenToSpace([canvas.width / 2, canvas.height / 2], world_camera.targetY);
		editor_objects.push(new Tunnel(0.00, {h: Math.round(randomBounded(0, 360)), s: Math.round(randomBounded(20, 80)), v: randomBounded(0.2, 0.8)}, JSON.parse(JSON.stringify(editor_tunnelDefaultData)), 'Custom Tunnel '+tag, 5, 1, [], 4, [1], [], 4, 75, pos[0], pos[2], [], `TravelTheGalaxy`));
		this.readFrom = orderObjects(editor_objects, 6);
	}

	deleteTunnel() {
		//you can't delete the last tunnel. It would cause all sorts of problems that I don't want to have to solve ;)
		if (this.tunnel != undefined && editor_objects.length > 1) {
			
			//gotta delete it from all the places it's referenced
			editor_objects.splice(editor_objects.indexOf(this.tunnel), 1);
			this.readFrom.splice(this.readFrom.indexOf(this.tunnel), 1);

			//if the tunnel is the world spawn, redirect the world spawn
			if (this.tunnel == editor_spawn) {
				editor_spawn = editor_objects[0];
			}
			this.tunnel = undefined;
		}
	}

	//I use the editor_objects array here because it doesn't change order based on camera position
	selectBackwards() {
		//select the tunnel 1 slot before the current one
		this.tunnel = editor_objects[(editor_objects.indexOf(this.tunnel) + (editor_objects.length-1)) % editor_objects.length];
		world_camera.targetX = this.tunnel.x;
		world_camera.targetZ = this.tunnel.z;
	}

	selectForwards() {
		//select the tunnel 1 slot after the current one
		this.tunnel = editor_objects[(editor_objects.indexOf(this.tunnel) + 1) % editor_objects.length];
		world_camera.targetX = this.tunnel.x;
		world_camera.targetZ = this.tunnel.z;
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
		super.drawTopBar();

		//selected tunnel text
		ctx.font = `${canvas.height / 40}px Comfortaa`;
		ctx.fillStyle = color_editor_cursor;
		ctx.textAlign = "center";
		if (this.tunnel == undefined) {
			ctx.fillText(`no tunnel selected`, canvas.width * 0.8175, canvas.height * 0.97);
		} else {
			if (this.tunnel == editor_spawn) {
				ctx.fillText(`This tunnel is the world spawn.`, canvas.width * 0.8175, canvas.height * 0.93);
			}
			ctx.fillText(this.tunnel.id, canvas.width * 0.8175, canvas.height * 0.975);
		}

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
				l.interact();
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

		if (super.handleMouseMove(a) == 31) {
			return;
		}

		//avoid button weirdness
		if (cursor_y > canvas.height * 0.94) {
			return;
		}
		//move selected tunnel
		if (cursor_down && this.tunnel != undefined) {
			if (editor_changingTheta) {
				//direction
				var tunnelPos = spaceToScreen([this.tunnel.x, this.tunnel.y, this.tunnel.z]);
				this.tunnel.theta = (Math.PI * 3) - (Math.atan2(cursor_y - tunnelPos[1], cursor_x - tunnelPos[0]) + Math.PI);
				this.tunnel.updatePosition(this.tunnel.x, 0, this.tunnel.z);
			} else {
				var newCoords = screenToSpace([cursor_x, cursor_y], world_camera.y);
				//movement
				var tunnel;
				var endCoords;
				var endScreenCoords;
				for (var u=0; u<editor_objects.length; u++) {
					tunnel = editor_objects[u];
					endCoords = [tunnel.endPos[0] - (tunnel_transitionLength * Math.sin(tunnel.theta)), tunnel.endPos[1], tunnel.endPos[2] + (tunnel_transitionLength * Math.cos(tunnel.theta))];
					endScreenCoords = spaceToScreen(endCoords);
					if (getDistance2d(endScreenCoords, [cursor_x, cursor_y]) < editor_worldSnapTolerance) {
						newCoords = endCoords;
						u = editor_objects.length + 1;
					}
				}
				this.tunnel.updatePosition(newCoords[0], 0, newCoords[2]);
			}
			
		}
	}
}


class State_Edit_Cutscenes extends State_Edit {
	constructor() {
		super();
		this.doWorldEffects();
		this.cols = editor_cutsceneColumns;
		this.colHeight = editor_maxCutscenes / editor_cutsceneColumns;
		this.cutscenes = Object.keys(editor_cutscenes);
		this.lightMultiplier = 1;
		this.lowButton = new PropertyButton(0.5, 0.95, 0.04, 0.05, "+", "loading_state.addCutscene();");

	}

	doWorldEffects() {
		player = new Runner(player.x, player.y, player.z);
	}

	addCutscene() {
		//generate code
		var code = "aaaa";
		while (editor_cutscenes[code] != undefined) {
			code = "";
			for (var n=0; n<4; n++) {
				code += data_alphaNumerics[Math.floor(randomBounded(0, data_alphaNumerics.length-1))];
			}
		}

		//now that there is a unique code, generate base cutscene data for it
		editor_cutscenes[code] = {id: 'New cutscene', effects: '', frames: [`~CAM~0~0~0~0~0~0`]};
		this.cutscenes = Object.keys(editor_cutscenes);
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
		for (var r=0; r<this.cutscenes.length; r++) {
			xOff = canvas.width * ((0.5 + Math.floor(r / this.colHeight)) / (this.cols));
			yOff = canvas.height * (editor_topBarHeight + 0.08 + (r % this.colHeight * ((1 - editor_topBarHeight - (2 * editor_cutsceneMargin)) / this.colHeight)));

			drawSelectionBox(xOff, yOff - (canvas.height / 90), ctx.measureText(editor_cutscenes[this.cutscenes[r]].id).width + 10, canvas.height / 20);
			ctx.fillStyle = color_text_bright;
			ctx.fillText(editor_cutscenes[this.cutscenes[r]].id, xOff, yOff);
		}

		if (this.cutscenes.length < editor_maxCutscenes) {
			this.lowButton.tick();
			this.lowButton.beDrawn();
		}

		//this icon will just be a circle but I'll change it later
		super.drawTopBar();
	}

	handleKeyPress(a) {
	
	}

	handleKeyNegate(a) {

	}

	handleMouseDown(a) {
		if (super.handleMouseDown(a) == 31) {
			return;
		}

		//going into cutscene area
		var xOff;
		var yOff;
		var textWidth;
		for (var r=0; r<this.cutscenes.length; r++) {
			xOff = canvas.width * ((0.5 + Math.floor(r / this.colHeight)) / (this.cols));
			yOff = canvas.height * (editor_topBarHeight + 0.08 + (r % this.colHeight * ((1 - editor_topBarHeight - (2 * editor_cutsceneMargin)) / this.colHeight)));
			textWidth = ctx.measureText(editor_cutscenes[this.cutscenes[r]].id).width / 2;
			if (cursor_x > xOff - textWidth && cursor_x < xOff + textWidth && cursor_y > yOff - (canvas.height / 20) && cursor_y < yOff + (canvas.height / 20)) {
				//change loading state
				loading_state = new State_Cutscene(editor_cutscenes[this.cutscenes[r]], this);
				loading_state.allowDebug = true;
			}
		}

		if (this.cutscenes.length < editor_maxCutscenes) {
			this.lowButton.interact();
		}
	}

	handleMouseMove(a) {
		if (super.handleMouseMove(a) == 31) {
			return;
		}
	}
}

class State_Playtest extends State_World {
	constructor() {
		super();
		this.returnState = undefined;
		this.readFrom = editor_objects;
		this.isMainGame = true;
		this.doWorldEffects();
		this.substate = 3;
	}

	doWorldEffects() {
		this.orderWorld();

		world_camera.targetTheta = player.dir_front[0];
		world_camera.targetPhi = 0;
		world_camera.targetRot = (player.dir_down[1] + (Math.PI * 1.5)) % (Math.PI * 2);
		player.setCameraPosition();
		world_camera.snapToTargets();
	}

	execute() {
		super.execute();
		if (this.substate == 1) {
			drawArrow((canvas.width * 0.5) - (canvas.width * 0.04) + (canvas.width * 0.08 * player.backwards), canvas.height * 0.94, color_grey_light, Math.PI * player.backwards, canvas.width * 0.045, canvas.width * 0.025, canvas.height * 0.03, canvas.height * 0.06);
			ctx.lineWidth = 2;
		}
	}

	handleMouseDown(a) {
		//regular interactions
		super.handleMouseDown(a);

		if (this.substate == 1) {
			//backwards toggle interact
			if (player.parent != undefined && cursor_x > canvas.width * 0.45 && cursor_x < canvas.width * 0.55 && cursor_y > canvas.height * 0.9 && cursor_y < canvas.height * 0.99) {
				player.turnAround();
				player.parent.reset();
				this.substate = 0;
				this.execute();
				this.substate = 1;
				return;
			}
		}
	}

	handleKeyPress(a) {
		super.handleKeyPress(a);
		if (a.keyCode == 82 && this.substate == 0) {
			this.handlePlayerDeath();
		}
	}

	handleEscape() {
		if (this.substate == 0) {
			this.substate = 1;
			return;
		}
		loading_state = this.returnState;
		loading_state.doWorldEffects();
	}
}