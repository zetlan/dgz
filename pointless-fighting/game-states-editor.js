class State_Edit {
	constructor() {
		this.typePanel;
		this.sbarW = 0.25;
		this.otherEditorOpacity = 0.2;

		this.panelW = 0.8;
		this.panelH = 0.8;
		this.panelRows = 5;
		this.makeButton();
	}

	makeButton() {
		var states = [
			`State_Edit_Collision`,
			`State_Edit_Sprites`,
			`State_Edit_Cutscenes`,
			`State_Edit_Entities`
		];

		this.typePanel = new UI_Panel(this.sbarW / 2, 0.03, this.sbarW * 0.96, 0.05, `loading....`, false, true, 0.8, 0.6, states);
		window.setTimeout(() => {
			loading_state.typePanel.button.text = loading_state.constructor.name;
		}, 30);
	
	}

	execute() {
		//all editors have a basic form, which is draw map(s) -> draw sidebar -> sidebar elements.

		//typePanel overrides this, because it goes on top of everything
		if (this.typePanel.panelUp) {
			this.typePanel.beDrawn();
			return;
		}

		this.doWorld();
		this.drawOverlay();
		this.drawSidebarElements();
	}

	doWorld() {
		//bebe
		ctx.fillStyle = color_background;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		camera.tick_free();
		loading_map.beDrawn();
	}

	drawOverlay() {
		//outline
		ctx.globalAlpha = 0.5;
		ctx.strokeStyle = color_editor_border;
		ctx.lineWidth = canvas.height / 50;
		ctx.beginPath();
		ctx.rect(canvas.width * this.sbarW, 0, canvas.width * (1 - this.sbarW), canvas.height);
		ctx.stroke();
		ctx.globalAlpha = 1;
		ctx.lineWidth = 1;

		//actual sidebar
		ctx.fillStyle = color_editor_background;
		ctx.fillRect(0, 0, canvas.width * this.sbarW, canvas.height);
	}

	drawSidebarElements() {
		//type switch
		this.typePanel.beDrawn();
	}

	handleKeyPress(a) {
		switch (a.keyCode) {
			//camera keys
			case 37:
				camera.dx = -camera.speed;
				break;
			case 38:
				camera.dy = -camera.speed;
				break;
			case 39:
				camera.dx = camera.speed;
				break;
			case 40:
				camera.dy = camera.speed;
				break;

			//+ / - keys, for zoom
			case 61:
				camera.targetScale = Math.min(camera_scaleMax, camera.scale + camera_scaleStep);
				break;
			case 173:
				camera.targetScale = Math.max(camera_scaleMin, camera.scale - camera_scaleStep);
				break;

			case 221:
				loading_state = new State_Game();
				break;
		}
	}

	handleKeyNegate(a) {
		switch (a.keyCode) {
			case 37:
				if (camera.dx < 0) {
					camera.dx = 0;
				}
				break;
			case 38:
				if (camera.dy < 0) {
					camera.dy = 0;
				}
				break;
			case 39:
				if (camera.dx > 0) {
					camera.dx = 0;
				}
				break;
			case 40:
				if (camera.dy > 0) {
					camera.dy = 0;
				}
				break;
		}
	}

	handleMouseMove() {

	}

	handleMouseDown() {
		this.typePanel.tick();

		//if a new state has been selected, go there
		if (this.typePanel.value != undefined) {
			loading_state = eval(`new ${this.typePanel.value}();`);
			return 31;
		}

		if (this.typePanel.panelUp) {
			return 31;
		}
	}

	handleMouseUp() {

	}
}

class State_Edit_Collision extends State_Edit {
	constructor() {
		super();
		this.block = " ";

		this.exitsHeight = 0.3;
		this.exitsSpacing = 0.04;
		this.exitMoving = false;
		this.exit = undefined;
		this.panelType = undefined;

		this.buttons = [
			new UI_Button(0.5 + this.sbarW / 2, 0.05, 0.1, 0.04, `SYNC NAME PLEASE`, false, `loading_state.newName();`),
			new UI_Button(0.5, 0.05, 0.02, 0.04, "+", false, `loading_state.addMap();`),

			new UI_Button(this.sbarW * 0.25, 0.98, 0.02, 0.025, "+", true, `loading_state.exitAdd();`),
			new UI_Button(this.sbarW * 0.75, 0.98, 0.02, 0.025, "-", true, `loading_state.exitRemove();`)
		];

		var nameList = [];
		world_maps.forEach(m => {
			nameList.push(m.name);
		});
		this.connectionTry = undefined;
		this.worldTry = undefined;
		this.panels = [
			//the 'change what world a connection goes to' panel
			new UI_Panel(this.sbarW * 0.5, 0.98, 0.02, 0.025, "•", true, false, 0.8, 0.4, nameList),
			//the 'change what world you're editing' panel
			new UI_Panel(0.5, 0.05, 0.02, 0.04, "•", false, false, 0.8, 0.4, nameList)
		]
		this.syncNameButton();
	}

	doWorld() {
		//don't do the whole world thing if the panel is up
		if (this.panels[0].panelUp || this.panels[1].panelUp) {
			return;
		}
		ctx.fillStyle = color_background;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		camera.tick_free();
		loading_map.beDrawn_collision();

		//draw image reference
		ctx.globalAlpha = this.otherEditorOpacity;
		loading_map.beDrawn_images();
		ctx.globalAlpha = 1;
	}

	addMap() {
		//come up with a name
		var worldName = "world ";
		for (var a=0; a<6; a++) {
			worldName += tileImage_key[Math.floor(randomBounded(0, tileImage_key.length-0.01))];
		}
		while (getZone(worldName) != undefined) {
			worldName = "world ";
			for (var a=0; a<6; a++) {
				worldName += tileImage_key[Math.floor(randomBounded(0, tileImage_key.length-0.01))];
			}
		}

		//create and move to map
		addZone(new Zone(0, 0, worldName, [], [["0"]], [["0"]], [], "Terrain.North"));
		loading_map = getZone(worldName);
		loading_state = new State_Edit_Collision();
	}

	exitAdd() {
		if (loading_map == world_maps[0]) {
			if (world_maps.length > 1) {
				loading_map.connections.push([world_maps[1], [0, -2]]);
			} else {
				console.error(`no other maps to connect to!`);
			}
		} else {
			loading_map.connections.push([world_maps[0], [0, -2]]);
		}
		
	}

	exitRemove() {
		loading_map.connections.splice(this.exit, 1);
		this.exit = undefined;
		this.buttons[2].over = false;
	}

	newName() {
		var newNameCheck = prompt(`enter new map name`, loading_map.name);
		if (newNameCheck != null && newNameCheck != undefined && newNameCheck != "") {
			//remove any vertical seperators or tildes (used in level data)
			newNameCheck = newNameCheck.replaceAll("|", "").replaceAll("~", "");

			//if the new name appears to be valid, check with the object, and change it
			if (getZone(newNameCheck) == undefined) {
				loading_map.name = newNameCheck;
				world_maps.splice(world_maps.indexOf(loading_map), 1);
				addZone(loading_map);
				this.syncNameButton();
			}
		}
	}

	syncNameButton() {
		this.buttons[0].text = loading_map.name;
		this.buttons[0].beDrawn();
		this.buttons[0].w = (ctx.measureText(loading_map.name).width / canvas.width) + 0.01;

		//also do other button and panel button
		this.buttons[1].x = this.buttons[0].x - (this.buttons[0].w / 2) - 0.04;
		this.panels[1].button.x = this.buttons[0].x - (this.buttons[0].w / 2) - 0.08;
	}

	drawOverlay() {
		//panel, if up
		for (var y=0; y<this.panels.length; y++) {
			if (this.panels[y].panelUp) {
				this.panels[y].beDrawn();
				return;
			}
		}

		//exit, if one is selected
		ctx.strokeStyle = color_editor_border;
		if (this.exit != undefined) {
			var ref = loading_map.connections[this.exit][1];
			var startXY = spaceToScreen(loading_map.x, loading_map.y);
			var endXY = spaceToScreen(loading_map.x + ref[0], loading_map.y + ref[1]);

			ctx.beginPath();
			ctx.moveTo(startXY[0], startXY[1]);
			ctx.lineTo(endXY[0], endXY[1]);
			ctx.stroke();

			ctx.beginPath();
			if (this.exitMoving) {
				ctx.strokeStyle = color_editor_selection;
			}
			ctx.rect(endXY[0] - camera.scale / 2, endXY[1] - (camera.scale / 2) * camera.vSquish, camera.scale, camera.scale * camera.vSquish);
			ctx.stroke();
		}

		super.drawOverlay();
	}

	drawSidebarElements() {
		super.drawSidebarElements();
		if (this.panels[0].panelUp || this.panels[1].panelUp) {
			return;
		}
		//map title button
		this.buttons[0].beDrawn();
		this.buttons[1].beDrawn();
		this.panels[1].beDrawn();

		//block ID
		ctx.textAlign = "left";
		ctx.fillText(`block: "${this.block}"`, canvas.width * 0.01, canvas.height * 0.1);

		//connections
		ctx.fillText(`connections`, canvas.width * 0.01, canvas.height * (this.exitsHeight - 0.05));
		ctx.font = `${canvas.height / 40}px Ubuntu`;
		var textX = canvas.width * 0.015;
		var textY;
		for (var e=0; e<loading_map.connections.length; e++) {
			textY = canvas.height * (this.exitsHeight + (this.exitsSpacing * e));
			ctx.fillText(`${e + 1} - `, textX, textY);
			ctx.fillText(`${loading_map.connections[e][0].name}`, textX + (canvas.width * 0.025), textY, canvas.width * this.sbarW * 0.5);
			ctx.textAlign = "right";
			ctx.fillText(JSON.stringify(loading_map.connections[e][1]), canvas.width * (this.sbarW - 0.015), textY);
			ctx.textAlign = "left";
			if (this.exit != e) {
				drawSelectionBox(canvas.width / 100, canvas.height * (this.exitsHeight + (this.exitsSpacing * e) - 0.0175), canvas.width * (this.sbarW - 0.02), canvas.height * 0.035);
			}
		}

		//+, •, and - buttons
		this.buttons[2].beDrawn();
		if (this.exit != undefined) {
			this.panels[0].beDrawn();
			this.buttons[3].beDrawn();
		}
	}

	handleKeyPress(a) {
		super.handleKeyPress(a);
		switch (a.keyCode) {
			case 48:
			case 49:
			case 50:
			case 51:
			case 52:
			case 53:
			case 54:
			case 55:
			case 56:
			case 57:
				this.block = (a.keyCode - 48) + "";
				break;
			case 32:
				this.block = " ";
				break;
		}
	}

	handleMouseDown() {
		if (super.handleMouseDown() == 31) {
			return 31;
		}

		//panel goes on top of everything
		if (this.panels[0].panelUp) {
			this.panels[0].tick();

			if (this.panels[0].value != undefined) {
				loading_map.connections[this.exit][0] = getZone(this.panels[0].value);
				this.panels[0].value = undefined;
			}
			return;
		}

		if (this.panels[1].panelUp) {
			this.panels[1].tick();

			if (this.panels[1].value != undefined) {
				loading_map = getZone(this.panels[1].value);
				this.exit = undefined;
				this.panels[1].value = undefined;
			}
			return;
		}

		//sidebar
		if (cursor_x < this.sbarW * canvas.width) {
			//choosing new exit
			var exit = Math.floor(((cursor_y / canvas.height) - this.exitsHeight + (this.exitsSpacing / 2)) / this.exitsSpacing);
			if (loading_map.connections[exit] != undefined) {
				this.exit = exit;
			}

			//buttons
			this.buttons[2].tick();
			if (this.exit != undefined) {
				this.panels[0].tick();
				this.buttons[3].tick();
			}
		} else {
			if (this.buttons[0].over) {
				this.buttons[0].tick();
				return;
			}
			if (this.buttons[1].over) {
				this.buttons[1].tick();
				return;
			}
			if (this.panels[1].button.over) {
				this.panels[1].tick();
				return;
			}

			//selecting exit position / changing a square
			var xy = screenToSpace(cursor_x, cursor_y);
			xy[0] = Math.round(xy[0]) - loading_map.x;
			xy[1] = Math.round(xy[1]) - loading_map.y;

			//move exit
			if (this.exit != undefined && loading_map.connections[this.exit][1][0] == xy[0] && loading_map.connections[this.exit][1][1] == xy[1]) {
				this.exitMoving = true;
			} else {
				loading_map.changeCollisionSquare(xy[0], xy[1], this.block);
			}
		}
		
	}

	handleMouseMove() {
		if (cursor_down) {
			var xy = screenToSpace(cursor_x, cursor_y);
			xy[0] = Math.round(xy[0]) - loading_map.x;
			xy[1] = Math.round(xy[1]) - loading_map.y;

			//exit move / edit square switch
			if (this.exitMoving) {
				loading_map.connections[this.exit][1] = xy;
			} else {
				if (cursor_x > canvas.width * this.sbarW) {
					loading_map.changeCollisionSquare(xy[0], xy[1], this.block);
				}
			}
		} else {
			if (this.exitMoving) {
				this.exitMoving = false;
			}
		}
	}
}

class State_Edit_Entities extends State_Edit {
	constructor() {
		super();

		this.modifierHeight = 0.2;
		this.modifierMargin = 0.05;

		this.entity = undefined;
		this.entityPanel = new UI_Panel(this.sbarW / 3, 0.08, 0.03, 0.04, "+", false, false, 0.8, 0.6, ["Spike"]);
		this.removeButton = new UI_Button((this.sbarW / 3) * 2, 0.08, 0.03, 0.04, "-", false, `loading_state.deleteEntity();`);
		this.entityModifiers = [];
	}

	deleteEntity() {
		loading_map.entities.splice(loading_map.entities.indexOf(this.entity), 1);
	}

	execute() {
		if (this.entityPanel.panelUp) {
			this.entityPanel.beDrawn();
			return;
		}
		super.execute();
	}

	doWorld() {
		super.doWorld();

		//draw boxes around entities
		var xy = [];
		var xOff = camera.scale / 2;
		var yOff = (camera.scale / 2) * camera.vSquish;
		loading_map.entities.forEach(e => {
			//determine box color
			ctx.strokeStyle = (e == this.entity) ? color_editor_selection : color_editor_border;
			//draw box
			xy = spaceToScreen(e.x + loading_map.x, e.y + loading_map.y);
			ctx.beginPath();
			ctx.rect(xy[0] - xOff, xy[1] - yOff, xOff * 2, yOff * 2);
			ctx.stroke();
		});
	}

	drawSidebarElements() {
		super.drawSidebarElements();

		//plus button
		this.entityPanel.beDrawn();
		
		this.entityModifiers.forEach(em => {
			em.beDrawn();
		});
	}

	setModifiersForEntity() {
		this.entityModifiers = [];
		if (this.entity == undefined) {
			return;
		}
		switch (this.entity.constructor.name) {
			case "Spike":
				this.entityModifiers.push(new UI_Slider(this.sbarW / 2, this.modifierHeight, this.sbarW * 0.95, `type`, this.sbarW * 0.7, 0, 9, 1, `loading_state.entity.type`));
				break;
		}
	}

	handleMouseDown() {
		if (this.entityPanel.panelUp) {
			this.entityPanel.tick();
			if (this.entityPanel.value != undefined) {
				//create new entity
				var xy = screenToSpace(canvas.width / 2, canvas.height / 2);
				xy[0] = Math.round(xy[0]) - loading_map.x;
				xy[1] = Math.round(xy[1]) - loading_map.y;
				switch (this.entityPanel.value) {
					case "Spike":
						loading_map.entities.push(new Spike(xy[0], xy[1], 0));
						break;
				}
				this.entityPanel.value = undefined;
			}
			return 31;
		}
		if (super.handleMouseDown() == 31) {
			return 31;
		}

		if (cursor_x < canvas.width * this.sbarW) {
			this.entityPanel.tick();
			this.entityModifiers.forEach(em => {
				em.tick();
			});
			return;
		}

		//clicking on an entity
		this.entity = undefined;
		var cursorSquare = screenToSpace(cursor_x, cursor_y);
		cursorSquare[0] = Math.round(cursorSquare[0] - loading_map.x);
		cursorSquare[1] = Math.round(cursorSquare[1] - loading_map.y);
		for (var a=0; a<loading_map.entities.length; a++) {
			if (loading_map.entities[a].x == cursorSquare[0] && loading_map.entities[a].y == cursorSquare[1]) {
				this.entity = loading_map.entities[a];
				this.setModifiersForEntity();
				return;
			}
		}
		this.setModifiersForEntity();
	}

	handleMouseMove() {
		if (cursor_down && cursor_x > canvas.width * this.sbarW && this.entity != undefined) {
			var cursorSquare = screenToSpace(cursor_x, cursor_y);
			this.entity.x = Math.round(cursorSquare[0] - loading_map.x);
			this.entity.y = Math.round(cursorSquare[1] - loading_map.y);
		}
	}
}

class State_Edit_Sprites extends State_Edit {
	constructor() {
		super();

		this.block = " ";
		this.blockSelecting = false;

		this.labelBlockHeight = 0.15;
		this.buttons = [
			new UI_Button(this.sbarW / 2, this.labelBlockHeight - 0.05, this.sbarW * 0.94, 0.05, loading_map.palettePath, false, `loading_state.changePath();`),
			new UI_Button(this.sbarW * 0.9, this.labelBlockHeight, 0.03, 0.04, "", false, `loading_state.blockSelecting = !loading_state.blockSelecting;`),
			new UI_Button(this.sbarW / 2, this.labelBlockHeight + 0.05, this.sbarW * 0.94, 0.05, `song: ${loading_map.musicID}`, false, `loading_state.newMusic();`)
		];
	}

	changePath() {
		var newPathAttempt = prompt(`enter new path`, loading_map.palettePath);
		if (eval(`data_images.${newPathAttempt}`) instanceof Palette) {
			loading_map.palettePath = newPathAttempt;
			loading_map.palette = eval(`data_images.${loading_map.palettePath}`);
			this.buttons[1].text = newPathAttempt;
		} else {
			alert(`invalid path recieved`);
		}
	}

	newMusic() {

	}

	doWorld() {
		super.doWorld();
		//draw collision boxes for reference
		ctx.globalAlpha = this.otherEditorOpacity;
		loading_map.beDrawn_collision();
		ctx.globalAlpha = 1;
	}

	drawSidebarElements() {
		super.drawSidebarElements();
		ctx.textAlign = "left";
		ctx.fillText(`block: ${this.block}`, canvas.width * 0.01, canvas.height * this.labelBlockHeight);

		this.buttons[0].beDrawn();
		this.buttons[1].beDrawn();

		//if selecting a block, put up menu
		if (this.blockSelecting) {
			var aspect = (canvas.width * (1 - this.sbarW)) / loading_map.palette.sheet.width;
			ctx.fillStyle = color_editor_background;
			ctx.fillRect(canvas.width * this.sbarW, 0, canvas.width * (1 - this.sbarW), loading_map.palette.sheet.height * aspect);
			ctx.drawImage(loading_map.palette.sheet, canvas.width * this.sbarW, 0, canvas.width * (1 - this.sbarW), loading_map.palette.sheet.height * aspect);
			
		}
	}

	handleMouseDown() {
		if (super.handleMouseDown() == 31) {
			return;
		}

		this.buttons[0].tick();
		this.buttons[1].tick();

		if (this.blockSelecting) {
			var aspect = (canvas.width * (1 - this.sbarW)) / loading_map.palette.sheet.width;
			var imgW = canvas.width * (1 - this.sbarW);
			var imgH = loading_map.palette.sheet.height * aspect;
			var imgCoords = [Math.floor((cursor_x - (canvas.width * this.sbarW)) / (imgW / 16)), Math.floor(cursor_y / (imgH / 8))];
			//only continue if image coordinates are valid
			if (imgCoords[0] >= 0 && imgCoords[0] < 16 && imgCoords[1] >= 0 && imgCoords[1] < 8) {
				var dataVal;
				//terrain
				if (imgCoords[0] < 3) {
					dataVal = Math.floor(imgCoords[1] / 2);
					this.block = tileImage_key[96 + dataVal];
				}
				//tiles
				if (imgCoords[0] > 3) {
					dataVal = (imgCoords[1] * 12) + (imgCoords[0] - 4);
					this.block = tileImage_key[dataVal];
				}
				return;
			}
		}

		//placing blocks
		if (cursor_x > canvas.width * this.sbarW) {
			var xy = screenToSpace(cursor_x, cursor_y);
			xy[0] = Math.round(xy[0]) - loading_map.x;
			xy[1] = Math.round(xy[1]) - loading_map.y;
			loading_map.changeDisplaySquare(xy[0], xy[1], this.block);
		}
	}

	handleMouseMove() {
		if (cursor_down && cursor_x > canvas.width * this.sbarW && cursor_y > this.blockSelecting * (loading_map.palette.sheet.height * ((canvas.width * (1 - this.sbarW)) / loading_map.palette.sheet.width))) {
			var xy = screenToSpace(cursor_x, cursor_y);
			xy[0] = Math.round(xy[0]) - loading_map.x;
			xy[1] = Math.round(xy[1]) - loading_map.y;
			loading_map.changeDisplaySquare(xy[0], xy[1], this.block);
		}
	}
}

class State_Edit_Cutscenes extends State_Edit {
	constructor() {
		super();
	}
}