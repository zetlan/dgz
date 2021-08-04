class State_Edit {
	constructor() {
		this.titleButton;
		this.sbarW = 0.25;
		this.otherEditorOpacity = 0.2;
		this.makeButton();
	}

	makeButton() {
		this.titleButton = new UI_Button(this.sbarW / 2, 0.03, this.sbarW * 0.96, 0.05, `Generic Editor`, false, `loading_state.incrementEditor()`);
	}

	incrementEditor() {
		var states = [
			`State_Edit_Collision`,
			`State_Edit_Sprites`,
			`State_Edit_Cutscenes`
		];

		//figure out which state self is and then increment by 1
		var index = states.indexOf(loading_state.constructor.name) + 1;
		eval(`loading_state = new ${states[index % states.length]}();`);
	}

	execute() {
		//all editors have a basic form, which is draw map(s) -> draw sidebar -> sidebar elements

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


		//type + type switch
		this.titleButton.beDrawn();
	}

	drawSidebarElements() {

	}

	handleKeyPress(a) {
		switch (a.keyCode) {
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
		this.titleButton.tick();
		if (this != loading_state) {
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

		this.exitsHeight = 0.2;
		this.exitsSpacing = 0.04;
		this.exitMoving = false;
		this.exit = undefined;

		this.buttons = [
			new UI_Button(0.5 + this.sbarW / 2, 0.05, 0.1, 0.05, `SYNC NAME PLEASE`, false, `loading_state.newName();`),
			new UI_Button(this.sbarW * 0.4, 0.98, 0.02, 0.025, "+", true, `loading_state.exitAdd();`),
			new UI_Button(this.sbarW * 0.6, 0.98, 0.02, 0.025, "-", true, `loading_state.exitRemove();`)
		];
		this.syncNameButton();
	}

	doWorld() {
		ctx.fillStyle = color_background;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		camera.tick_free();
		loading_map.beDrawn_collision();

		//draw image reference
		ctx.globalAlpha = this.otherEditorOpacity;
		loading_map.beDrawn_images();
		ctx.globalAlpha = 1;
	}

	exitAdd() {
		loading_map.connections.push([undefined, [0, -2]]);
	}

	exitRemove() {
		loading_map.connections.splice(this.exit, 1);
		this.exit = undefined;
	}

	newName() {
		var newNameCheck = prompt(`enter new map name`, loading_map.name);
		if (newNameCheck != null && newNameCheck != undefined && newNameCheck != "") {
			//remove any vertical seperators or tildes (used in level data)
			newNameCheck = newNameCheck.replaceAll("|", "").replaceAll("~", "");
			//if the new name appears to be valid, check with the object, and change it
			if (world_maps[newNameCheck] == undefined) {
				//world stuff
				world_maps[newNameCheck] = loading_map;
				delete world_maps[loading_map.name];
				loading_map.name = newNameCheck;

				//button stuff
				this.syncNameButton();
			}
		}
	}

	syncNameButton() {
		this.buttons[0].text = loading_map.name;
		this.buttons[0].beDrawn();
		this.buttons[0].w = (ctx.measureText(loading_map.name).width / canvas.width) + 0.01;
	}

	makeButton() {
		super.makeButton();
		this.titleButton.text = `Collision Editor`;
	}

	drawOverlay() {
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
		//map title button
		this.buttons[0].beDrawn();

		//block ID
		ctx.textAlign = "left";
		ctx.fillText(`block: "${this.block}"`, canvas.width * 0.01, canvas.height * 0.1);

		//connections
		ctx.fillText(`connections`, canvas.width * 0.01, canvas.height * 0.15);
		ctx.font = `${canvas.height / 36}px Ubuntu`;
		for (var e=0; e<loading_map.connections.length; e++) {
			ctx.fillText(`${e+1} - ${loading_map.connections[e][0].name}, ${JSON.stringify(loading_map.connections[e][1])}`, canvas.width * 0.015, canvas.height * (this.exitsHeight + (this.exitsSpacing * e)));
			if (this.exit != e) {
				drawSelectionBox(canvas.width / 100, canvas.height * (this.exitsHeight + (this.exitsSpacing * e) - 0.0175), canvas.width * (this.sbarW - 0.02), canvas.height * 0.035);
			}
		}

		//+ / - button
		this.buttons[1].beDrawn();
		if (this.exit != undefined) {
			this.buttons[2].beDrawn();
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

		//sidebar
		if (cursor_x < this.sbarW * canvas.width) {
			//choosing new exit
			var exit = Math.floor(((cursor_y / canvas.height) - this.exitsHeight + (this.exitsSpacing / 2)) / this.exitsSpacing);
			if (loading_map.connections[exit] != undefined) {
				this.exit = exit;
			}

			//buttons
			this.buttons[0].tick();
			this.buttons[1].tick();
			if (this.exit != undefined) {
				this.buttons[2].tick();
			}
		} else {
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
			new UI_Button(this.sbarW * 0.9, this.labelBlockHeight, 0.03, 0.04, "", false, `loading_state.blockSelecting = !loading_state.blockSelecting;`)
		];
	}

	makeButton() {
		super.makeButton();
		this.titleButton.text = `Sprite Editor`;
	}

	doWorld() {
		super.doWorld();
		//draw collision boxes for reference
		ctx.globalAlpha = this.otherEditorOpacity;
		loading_map.beDrawn_collision();
		ctx.globalAlpha = 1;
	}

	drawSidebarElements() {
		ctx.textAlign = "left";
		ctx.fillText(`block: ${this.block}`, canvas.width * 0.01, canvas.height * this.labelBlockHeight);

		this.buttons[0].beDrawn();

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
		if (cursor_down && cursor_x > canvas.width * this.sbarW && cursor_y > boolToValues(this.blockSelecting, loading_map.palette.sheet.height * ((canvas.width * (1 - this.sbarW)) / loading_map.palette.sheet.width), 0)) {
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

	makeButton() {
		super.makeButton();
		this.titleButton.text = `Cutscene Editor`;
	}
}