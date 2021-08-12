


class State_Menu {
	constructor() {
		this.buttons = [
			`Settings`,
			`Start`,
			`Credits`
		];
		this.selected = 0;
		this.animSelect = 0;

		this.buttonsStartWidth = 0.7;
		this.buttonsStartHeight = 0.7;
		this.buttonsMargin = 0.06;

		this.substate = 0;
	}

	execute() {
		this.animSelect = ((this.animSelect * menu_animSpeed) + this.selected) / (menu_animSpeed + 1);
		this.animSelect = this.animSelect.toFixed(5) * 1;
		//draw main menu

		//background
		ctx.fillStyle = color_background;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		//title card
		ctx.fillStyle = color_text_light;
		ctx.font = `${canvas.height / 10}px Ubuntu`;
		ctx.textAlign = "center";
		ctx.fillText(`Onion`, canvas.width / 2, canvas.height * 0.1);

		//buttons
		ctx.font = `${canvas.height / 20}px Ubuntu`;

		//selector
		var width1 = ctx.measureText(this.buttons[Math.floor(this.animSelect)]).width;
		var width2 = ctx.measureText(this.buttons[Math.ceil(this.animSelect)]).width
		var percent = this.animSelect % 1;

		var boxY = canvas.height * (this.buttonsStartHeight + (this.buttonsMargin * this.animSelect));
		drawSelectionBox(canvas.width * (this.buttonsStartWidth - 0.01), boxY - (canvas.height / 36), linterp(width1, width2, percent) + (canvas.width / 50), canvas.height / 18);

		ctx.textAlign = "left";
		var text;
		for (var b=0; b<this.buttons.length; b++) {
			//don't draw start text if the loading map isn't there yet
			if (b != 1 || loading_map != undefined) {
				text = this.buttons[b]; 
			} else {
				text = `loading...`;
			}
			ctx.fillText(text, canvas.width * this.buttonsStartWidth, canvas.height * (this.buttonsStartHeight + (this.buttonsMargin * b)));
		}
	}

	handleKeyPress(a) {
		switch (a.keyCode) {
			case 38:
			case 40:
				//cycle up or down based on key pressed
				this.selected = clamp(this.selected + (a.keyCode - 39), 0, this.buttons.length-1);
				break;
			
			//z
			case 90:
				//different things depending on what's selected
				if (this.substate == 0) {
					switch (this.selected) {
						case 0:
							//settings
							break;
						case 1:
							//game
							if (loading_map != undefined) {
								loading_state = new State_Game();
							}
							break;
						case 2:
							//credits
							break;
					}
				}
				break;
		}
	}

	handleKeyNegate(a) {

	}

	handleMouseMove() {

	}

	handleMouseDown() {
	}

	handleMouseUp() {

	}
}

class State_Game {
	constructor() {

	}

	execute() {
		//background fill
		ctx.fillStyle = color_background;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		//soundies
		audio_channel1.tick();
	
		camera.tick_follow();
		loading_map.tick();
	
		loading_map.beDrawn();

		//UI overlays
		ctx.globalAlpha = 0.4;
		ctx.fillStyle = color_player;
		ctx.fillRect(0, 0, camera.scale, canvas.height);
		ctx.globalAlpha = 1;

		drawMeter(color_meter_health, (camera.scale / 9) * 1, canvas.height * 0.05, camera.scale / 3, canvas.height * 0.9, player.health / player.maxHealth);
		drawMeter(color_meter_stamina, (camera.scale / 9) * 5, canvas.height * 0.05, camera.scale / 3, canvas.height * 0.9, player.stamina / player.maxStamina);
		world_time += 1;
	}

	handleKeyPress(a) {
		switch (a.keyCode) {
			//arrow keys + z
			case 37:
			case 38:
			case 39:
			case 40:
				player.handleInput(false, a.keyCode - 37);
				break;
			case 90:
				player.attemptAttack();
				break;
	
			//editor key
			case 221:
				loading_state = new State_Edit_Collision();
				break;
		}
	}

	handleKeyNegate(a) {
		switch (a.keyCode) {
			case 37:
			case 38:
			case 39:
			case 40:
				player.handleInput(true, a.keyCode - 37);
				break;
		}
	}

	handleMouseDown() {
		if (editor_active) {
			//if the cursor is over the main area
			if (cursor_x > canvas.width * editor_sidebarWidth && cursor_x < canvas.width && cursor_y > 0 && cursor_y < canvas.height) {
				//convert cursor pos to world
				var xy = screenToSpace(cursor_x, cursor_y);
				//floor that
				xy[0] = Math.round(xy[0]) - loading_map.x;
				xy[1] = Math.round(xy[1]) - loading_map.y;

				//if it's the same square as a selected exit, turn into moving mode
				if (editor_exitSelected != undefined) {
					if (xy[0] == loading_map.connections[editor_exitSelected][1][0] && xy[1] == loading_map.connections[editor_exitSelected][1][1]) {
						editor_exitMoving = true;
						return;
					}
				}


				//change the square at that position
				loading_map.changeCollisionSquare(xy[0], xy[1], editor_block);
				return;
			}
	
			//if the cursor is over the sidebar
			if (cursor_x < canvas.width * editor_sidebarWidth) {
				//I'm beginning to wonder if I can't name these functions better. Abstraction is good for readability, but it also creates these terrible file-folder name schemes
				editor_sidebar_click();
			}
		}
	}

	handleMouseMove() {
	}

	handleMouseUp() {
	}
}